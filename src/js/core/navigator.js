/* ========================================================================
 * Phonon: navigator.js v1.1
 * http://phonon.quarkdev.com
 * ========================================================================
 * Licensed under MIT (http://phonon.quarkdev.com)
 * ======================================================================== */
;(function (window, riot, phonon) {

  'use strict';

  var pages = [];
  var pageHistory = [];
  var started = false;
  var onActiveTransition = false;

  var currentPage = null;
  var previousPage = null;

  var forward = true;
  var safeLink = false;

  var riotEnabled = (riot === undefined ? false : true);

  var opts = {
    defaultPage: null,
    hashPrefix: '!',
    animatePages: true,
    templateRootDirectory: '',
    useI18n: true,
    enableBrowserBackButton: false,
    useHash: true
  };

  /**
   * "Encapsulated" class
   * The activity takes care of creating a window for you in which you can place your UI with.
   * An activity is based on several window states that we call the activitiy life cycle.
   */
  var Activity = (function () {

      /**
       * @constructor
       */
      function Activity() {}

      /**
       * 
       * @param {Function} callback
       */
      Activity.prototype.onCreate = function (callback) {
          this.onCreateCallback = callback;
      };

      /**
       * onReady is called after onCreate and for each page refresh (optional)
       * @param {Function} callback
       */
      Activity.prototype.onReady = function (callback) {
          this.onReadyCallback = callback;
      };

      /**
       * Called when the user leaves the page
       * @param {Function} callback
       */
      Activity.prototype.onClose = function (callback) {
          this.onCloseCallback = function (self) {
              callback(self);
          };
      };

      /**
       * Called when the page is completely hidden
       * @param {Function} callback
       */
      Activity.prototype.onHidden = function (callback) {
          this.onHiddenCallback = callback;
      };

      /**
       * Called when the page transition is finished
       * @param {Function} callback
       */
      Activity.prototype.onTransitionEnd = function (callback) {
          this.onTransitionEndCallback = callback;
      };

      /**
       * Called when the page hash changes
       * @param {Function} callback
       */
      Activity.prototype.onHashChanged = function (callback) {
          this.onHashChangedCallback = function (req) {
              callback(req);
          };
      };

      Activity.prototype.onTabChanged = function (callback) {
          this.onTabChangedCallback = function (tabNumber) {
              callback(tabNumber);
          };
      };

      return Activity;
  })();

  /**
   * Retrieves the page object
   * @param {String} pageName
   */
  var getPageObject = function(pageName) {

    var page = null;
    var i = pages.length - 1;

    for (; i >= 0; i--) {
      if(pages[i].name === pageName) {
        page = pages[i];
        break;
      }
    }
    return page;
  };

  /**
   * Retrives the DOM element for a given page
   * @param {String} pageName
   */
  var getPageEl = function(pageName) {

    var pages = document.querySelectorAll('[data-page]');
    var i = pages.length - 1;
    var elPage = null;

    for (; i >= 0; i--) {
      if(pages[i].tagName.toLowerCase() === pageName) {
        elPage = pages[i];
        break;
      }
    }
    return elPage;
  };

  function forwardAnimation() {

    if(opts.animatePages) {
      var previousPageEl = this;

      previousPageEl.classList.remove('page-sliding');
      previousPageEl.classList.remove('left');
      previousPageEl.off(phonon.event.animationEnd, forwardAnimation, false);

      previousPageEl.classList.remove('app-active');
    }
    callTransitionEnd(currentPage);
    callHiddenCallback(previousPage);

    onActiveTransition = false;
  }

  function previousAnimation() {

    if(opts.animatePages) {
      var previousPageEl = this;

      previousPageEl.classList.remove('page-sliding');
      previousPageEl.classList.remove('right');
      previousPageEl.off(phonon.event.animationEnd, previousAnimation, false);

      previousPageEl.classList.remove('app-active');
    }
    callTransitionEnd(currentPage);
    callHiddenCallback(previousPage);

    onActiveTransition = false;
  }

  function callCreate(pageName) {

    if(riotEnabled) {
      // Call the "create" event in VM
      phonon.tagManager.trigger(pageName, 'create');
    }

    var page = getPageObject(pageName);

    // Page Scope is called once during the onCreate process
    if(typeof page.callback === 'function') {
      page.callback(page.activity);
    }

    // Call the onCreate callback
    if(page.activity instanceof Activity && typeof page.activity.onCreateCallback === 'function') {
      page.activity.onCreateCallback();
    }

    var pageEvent = new window.CustomEvent('pagecreated', {
        detail: { page: pageName },
        bubbles: true,
        cancelable: true
    });
    
    document.dispatchEvent(pageEvent);
  }

  function callReady(pageName) {

    var page = getPageObject(pageName);

    window.setTimeout(function() {

      if(riotEnabled) {
        // Call the "ready" event in VM
        phonon.tagManager.trigger(pageName, 'ready');
      }

      // Call the onReady callback
      if(page.activity instanceof Activity && typeof page.activity.onReadyCallback === 'function') {
        page.activity.onReadyCallback();
      }

      // Dispatch the global event pageopened
      var pageEvent = new window.CustomEvent('pageopened', {
          detail: { page: pageName },
          bubbles: true,
          cancelable: true
      });

      document.dispatchEvent(pageEvent);

    }, page.readyDelay);
  }

  function callTransitionEnd(pageName) {
    if(riotEnabled) {
      phonon.tagManager.trigger(pageName, 'transitionend');
    }

    var page = getPageObject(pageName);

    // Call the onTransitionEnd callback
    if(page.activity instanceof Activity && typeof page.activity.onTransitionEndCallback === 'function') {
      page.activity.onTransitionEndCallback();
    }
  }

  function callHiddenCallback(pageName) {
    if(riotEnabled) {
      phonon.tagManager.trigger(pageName, 'hidden');
    }

    var page = getPageObject(pageName);

    // Call the onHidden callback
    if(page.activity instanceof Activity && typeof page.activity.onHiddenCallback === 'function') {
      page.activity.onHiddenCallback();
    }
  }

  function callTabChanged(pageName, tabNumber) {

    if(riotEnabled) {
      phonon.tagManager.trigger(pageName, 'tabchanged', tabNumber);
    }

    var page = getPageObject(pageName);

    // Call the onTabChanged callback
    if(page.activity instanceof Activity && typeof page.activity.onTabChangedCallback === 'function') {
      page.activity.onTabChangedCallback(tabNumber);
    }
  }

  function callClose(pageName, nextPageName, hash) {

    function close() {

      var currentHash = window.location.hash.split('#')[1];

      if(currentHash === hash || !opts.useHash) {
        onRoute(hash);
      } else {
        window.location.hash = hash;
      }
    }

    var page = getPageObject(pageName);

    // close the page directly
    if(!page.async) {
      close(true);
      return;
    }

    var api = {close: close};

    if(riotEnabled) {
      phonon.tagManager.trigger(pageName, 'close', api);
    }

    // Call the onclose callback
    if(page.activity instanceof Activity && typeof page.activity.onCloseCallback === 'function') {
      page.activity.onCloseCallback(api);
    } else {
      if(!riotEnabled) {
        throw new Error('The page ' + pageName + ' prevents close, but its callback (onClose) is undefined');
      }
    }
  }

  function callHash(pageName, params, action) {

    var api = {params: params, action: action};

    if(riotEnabled) {
      phonon.tagManager.trigger(pageName, 'hashchanged', api);
    }

    var page = getPageObject(pageName);

    // Call the onHashChanged callback
    if(page.activity instanceof Activity && typeof page.activity.onHashChangedCallback === 'function') {
      page.activity.onHashChangedCallback(api);
    }
  }

  function callCallback(callbackName, options) {
    if(callbackName === 'tabchanged') {
      callTabChanged(options.page, options.tabNumber);
    }
  }

  function mount(pageName, fn) {

    if(riotEnabled) {

      riot.compile(function() {
        phonon.i18n().getAll(function(json) {
          var tag = riot.mount(pageName, {i18n: json});
          phonon.tagManager.addTag(tag, pageName);

          fn();
        });
      });
    }

    if(!riotEnabled) {

      var page = getPageObject(pageName);

      if(page.content !== null) {

        loadContent(page.content, function(template) {

          var elPage = getPageEl(pageName);

          var virtualDiv = document.createElement('div');
          virtualDiv.innerHTML = template;

          var virtualElPage = virtualDiv.querySelector(pageName);

          if(virtualElPage === null) {
            throw new Error('Error with ' + page.content + ' : the template for ' + pageName + ' must start with the parent node <' + pageName + ' class="app-page">');
          }
          var attrs = virtualElPage.attributes;

          var i = attrs.length - 1;

          for (; i >= 0; i--) {
            var attr = attrs.item(i);
            if(attr.nodeName !== 'class' && attr.nodeValue !== 'app-page') elPage.setAttribute(attr.nodeName, attr.nodeValue);
          }
          
          if(opts.useI18n) {
            phonon.i18n().bind(virtualElPage, function() {
              elPage.innerHTML = virtualElPage.innerHTML;
              fn();
            });
          } else {
            elPage.innerHTML = virtualElPage.innerHTML;
            fn();
          }
        
        });
      } else {
        fn();
      }
    }
  }

  function loadContent(url, fn) {
    var req = new XMLHttpRequest();
    if(req.overrideMimeType) req.overrideMimeType('text/html; charset=utf-8');
    req.onreadystatechange = function() {
      if (req.readyState === 4 && req.status === 200) fn(req.responseText);
    };
    req.open('GET', opts.templateRootDirectory + url, true);
    req.send('');
  }

  function addPage(pageName) {

    var page = {
      name: pageName,
      mounted: false,
      async: false,
      activity: null,
      content: null,
      readyDelay: 1
    };

    pages.push(page);
  }

  function isPageReady() {

    // close active dialogs, popovers, panels and side-panels
    if(typeof phonon.dialog !== 'undefined' && phonon.dialog().closeActive()) {
      return false;
    }
    if(typeof phonon.popover !== 'undefined' && phonon.popover().closeActive()) {
      return false;
    }
    if(typeof phonon.panel !== 'undefined' && phonon.panel().closeActive()) {
      return false;
    }
    if(typeof phonon.sidePanel !== 'undefined' && phonon.sidePanel().closeActive()) {
      return false;
    }

    safeLink = true;

    return true;
  }

  function getLastPage() {
    var page = {page: opts.defaultPage, params: ''};
    if(pageHistory.length > 0) {
      
      var inddex = -1;
      var i = pageHistory.length - 1;

      for (; i >= 0; i--) {
        if(pageHistory[i].page === currentPage) {
          inddex = i - 1;
          break;
        }
      }

      if(inddex > -1) {
        page = pageHistory[inddex];
        pageHistory.slice(inddex, 1);
      }
    }
    return page;
  }

  function navigationListener(evt) {

    var target = evt.target;
    var nav = null;
    var validHref = false;
    var params = '';

    for (; target && target !== document; target = target.parentNode) {
      var dataNav = target.getAttribute('data-navigation');
      if(typeof target.href !== 'undefined' && target.href.indexOf('#!') !== -1) {
        validHref = true;
        break;
      }
      if(dataNav) {
        nav = dataNav;
        break;
      }
    }

    if(validHref) {
      evt.preventDefault();
    }

    if(nav === null && !validHref) {
      return;
    }

    var page = opts.defaultPage;

    if(nav !== null) {
      if(nav === '$previous-page') {
        var pObj = getLastPage();
        page = pObj.page;
        params = pObj.params;
      } else {
        page = nav;
      }

    } else {

      // regex
      var match = target.href.match(/#!([A-Za-z0-9\-\.]+)?(.*)/);
      if(match) {
        page = match[1];
        params = match[2];
      }
    }

    if(isPageReady(page, params)) {
      callClose(currentPage, page, opts.hashPrefix + page + '/' + params);
    }
  }

  function startTransition(previousPage, pageName, params, action) {

    callReady(pageName);
    callHash(pageName, params, action);

    var previousPageEl = getPageEl(previousPage);
    var elCurrentPage = getPageEl(pageName);

    elCurrentPage.classList.add('app-active');

    if(opts.animatePages) {
      previousPageEl.classList.add('page-sliding');

      if(forward) {
        previousPageEl.classList.add( 'left' );
        previousPageEl.on(phonon.event.animationEnd, forwardAnimation, false);
      } else {
        previousPageEl.classList.add( 'right' );
        previousPageEl.on(phonon.event.animationEnd, previousAnimation, false);
      }
    } else {

      previousPageEl.classList.remove('app-active');

      if(forward) {
        forwardAnimation();
      } else {
        previousAnimation();
      }
    }

    // Scroll to top
    var contents = elCurrentPage.querySelectorAll('.content');
    var i = contents.length - 1;
    for (; i >= 0; i--) {
      var content = contents[i];
      if(content !== null && content.scrollTop !== 0) {
          content.scrollTop = 0;
      }
    }

    // delete history if the current page is the default page
    if(pageName === opts.defaultPage) {
      pageHistory = [];
    }
  }

  function onBeforeTransition(pageName, params, action) {

    if(onActiveTransition) {
      return;
    }

    var page = getPageObject(pageName);

    if(page) {

      onActiveTransition = true;

      previousPage = currentPage;
      currentPage = pageName;

      if(!page.mounted) {
        mount(page.name, function() {

          page.mounted = true;

          callCreate(pageName);
          startTransition(previousPage, pageName, params, action);
        });
      } else {
        startTransition(previousPage, pageName, params, action);
      }
    } else {
      throw new Error('The following page: ' + pageName + ' does not exists');
    }
  }

  function init(options) {
    if(typeof options.templateRootDirectory === 'string' && options.templateRootDirectory !== '') {
      options.templateRootDirectory = ( (options.templateRootDirectory.indexOf('/', options.templateRootDirectory.length - '/'.length) !== -1) ? options.templateRootDirectory : options.templateRootDirectory + '/');
    }
    if(typeof options.hashPrefix === 'object') options.hashPrefix = '';

    var prop;
    for(prop in options) {
      opts[prop] = options[prop];
    }

    // navigation listeners are accepted (safe)
    if(opts.enableBrowserBackButton) {
      safeLink = true;
    }

    // Add page nodes
    var pages = document.querySelectorAll('[data-page]');
    var i = pages.length - 1;
    for (; i >= 0; i--) {

      var page = pages[i];

      // add the page class
      if(!page.classList.contains('app-page')) {
        page.classList.add('app-page');
      }

      addPage( page.tagName.toLowerCase() );
    }
  }

  function start() {
    if(started) {
      throw new Error('The app has been already started');
    }

    // Set the default page as current page
    currentPage = opts.defaultPage;

    // android, ios or browser
    var osName = phonon.device.os.toLowerCase();
    var osClass = 'web';

    if(osName === 'android') {
      osClass = 'android';
    } else if(osName === 'ios') {
      osClass = 'ios';
    }

    if(!document.body.classList.contains(osClass)) {
      document.body.classList.add(osClass);
    }

    initFirstPage();
  }

  function initFirstPage() {
    
    mount(currentPage, function() {

      // update the mount state
      var pageObject = getPageObject(currentPage);
      pageObject.mounted = true;

      callCreate(currentPage);

      if(currentPage === opts.defaultPage && !started) {

        var el = getPageEl(currentPage);
        started = true;

        if(el) {

          if(!el.classList.contains('app-active')) {
            el.classList.add('app-active');
          }

          callReady(currentPage);

          // Call global-ready callbacks once
          phonon.dispatchGlobalReady();

          var startHash = opts.hashPrefix + opts.defaultPage;
          if(window.location.hash !== startHash && opts.useHash) {
            window.location.hash = opts.hashPrefix + opts.defaultPage;
          }
        } else {
          throw new Error('Page does not exists');
        }
      }
    });
  }


  function changePage(pageName, pageParams) {

    var currentPageObject = getPageObject(currentPage);
    var pageObject = getPageObject(pageName);

    if(pageObject) {

      var hash = (typeof pageParams === 'string' ? opts.hashPrefix + pageObject.name + '/' + pageParams : opts.hashPrefix + pageObject.name);

      if(currentPageObject.async) {
        callClose(currentPage, pageObject.name, hash);
      } else {
        if(window.location.hash.indexOf(pageObject.name) === -1 && opts.useHash) {
          window.location.hash = hash;
        }
      }
    } else {
      throw new Error('The following page: ' + pageName + ' does not exists');
    }
  }

  /**
   * @param {String | HashEvent} virtualHash
   */
  function onRoute(virtualHash) {

    var hash = (typeof virtualHash === 'string' ? virtualHash : window.location.href.split('#')[1] || '');

    var parsed = hash.split('/');

    var page = parsed[0];
    var params = (typeof parsed[1] === 'undefined' ? '' : parsed[1]);
    var action = (typeof parsed[2] === 'undefined' ? '' : parsed[2]);

    // angular hash system
    var withSlash = opts.hashPrefix.indexOf('/');
    if(withSlash !== -1) {
        page = params;
        params = action;
        action = (typeof parsed[3] === 'undefined' ? '' : parsed[3]);
    }

    // is page?

    var pageName;

    if(withSlash !== -1) {
      if(page[0] !== opts.hashPrefix[withSlash+1]) {
        return;
      }

      pageName = page.substring(withSlash+1, page.length);
    } else {
      if(opts.hashPrefix.length > 0 && page[0] !== opts.hashPrefix[0]) {
          return;
      }
      pageName = page.substring(opts.hashPrefix.length, page.length);
    }


    var pageObject = getPageObject(pageName);

    if(pageObject) {

      if(pageObject.name === currentPage) {
        if(typeof params !== 'undefined') {
          callHash(pageName, params, action);
        }
        return;
      }

      if(!safeLink) {
        return;
      }

      var inArray = false;
      var i = pageHistory.length - 1;

      for (; i >= 0; i--) {
        if(pageHistory[i].page === pageObject.name) {
          inArray = true;
          break;
        }
      }

      if(pageHistory.length > 0) {
        if(pageObject.name === opts.defaultPage) {
          forward = false;
        }
      } else {
        forward = true;
      }

      if(pageHistory.length > 1 && pageHistory[pageHistory.length - 2].page === pageObject.name) {
        forward = false;
      }

      if(!inArray) {
        pageHistory.push( {page: pageObject.name, params: params + '/' + action} );
      }

      if(isPageReady(pageName, params, action)) {
        onBeforeTransition(pageName, params, action);
      }

      if(!opts.enableBrowserBackButton) {
        safeLink = false;
      }
    }
  }

  /**
   * One listener to navigate through the app pages
   */
  document.on('tap', navigationListener);

  /*
   * we do not call onRoute() directly because it is used in callClose
   * in order to prevent the back button on navigator:
   * the hash changes, but it is refused by this module (not trusted behavior)
   * so we need to call this function with a "virtual hash" as argument
   */
  if(opts.useHash) window.on('hashchange', onRoute);

  document.on('backbutton', function() {
    var pObj = getLastPage();
    if(currentPage === opts.defaultPage) {
      return;
    }
    if(isPageReady(pObj.page, '')) {
      callClose(currentPage, pObj.page, opts.hashPrefix + pObj.page + '/' + pObj.params);
    }
  });


  phonon.navigator = function(options) {

    if(typeof options === 'object') {
      init(options);
    }

    return {
      currentPage: currentPage,
      start: start,
      changePage: function(pageName, pageParams) {
        safeLink = true;
        changePage(pageName, pageParams);
      },
      on: function(options, callback) {
        if(typeof options.page !== 'string') {
          throw new Error('Page name must be a string');
        }
        if(typeof options.preventClose !== 'undefined' && typeof options.preventClose !== 'boolean') {
          throw new Error('preventClose option must be a boolean');
        }
        if(typeof options.readyDelay !== 'undefined' && typeof options.readyDelay !== 'number') {
          throw new Error('readyDelay option must be a number');
        }

        var p = getPageObject(options.page);

        if(p) {
          p.activity = (typeof callback === 'function' ? new Activity() : null);
          p.callback = callback;
          p.async = (typeof options.preventClose === 'boolean' ? options.preventClose : false);
          p.content = (typeof options.content === 'string' ? options.content : null);
          p.readyDelay = (typeof options.readyDelay === 'number' ? options.readyDelay : 1);
        } else {
          throw new Error('A namespace for  ' + options.page + ' is detected, but the DOM node <' + options.page + '> is not found.');
        }
      },
      callCallback: callCallback
    };
  };

})(typeof window !== 'undefined' ? window : this, typeof riot !== 'undefined' ? riot : undefined, phonon);