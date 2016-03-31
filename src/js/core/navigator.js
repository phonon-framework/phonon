/* ========================================================================
 * Phonon: navigator.js v1.2
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
	 * @param {Object} scope
     */
    function Activity(scope) {
		if(typeof scope === 'object') {
			var handler;
			for(handler in scope) {
				if(this[handler] !== undefined && this[handler] !== 'constructor') {
					this[handler + 'Callback'] = scope[handler];
				}
			}
		}
	}

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
        callback.apply(this, req);
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

    var i = pages.length - 1;

    for (; i >= 0; i--) {
      if(pages[i].name === pageName) {
        return pages[i];
      }
    }
    return null;
  };

  function DOMEval(code) {

	  var script = document.createElement('script');

	  script.text = code;
	  document.head.appendChild( script ).parentNode.removeChild( script );
  }

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

  function dispatchEvent(eventName, pageName, parameters) {

	  var eventInitDict = {
          detail: { page: pageName },
          bubbles: true,
          cancelable: true
      };

	  if(typeof parameters !== 'undefined') {
		  eventInitDict.detail.req = parameters
	  }

	  var event = new window.CustomEvent(eventName, eventInitDict);

	  document.dispatchEvent(event);
  }

  function callCreate(pageName) {

    if(riotEnabled) {
      // Call the "create" event in VM
      phonon.tagManager.trigger(pageName, 'create');
    }

    /*
     * dispatch the event before calling the activity's callback
     * so that UI components are ready to use
     * issue #52 is related to this
    */
	dispatchEvent('pagecreated', pageName)

	var page = getPageObject(pageName);

    // Call the onCreate callback
    if(page.activity instanceof Activity && typeof page.activity.onCreateCallback === 'function') {
      page.activity.onCreateCallback();
    }

  }

  function callReady(pageName) {

	var page = getPageObject(pageName);

    window.setTimeout(function() {

      if(riotEnabled) {
        // Call the "ready" event in VM
        phonon.tagManager.trigger(pageName, 'ready');
      }

      // Dispatch the global event pageopened
	  dispatchEvent('pageopened', pageName)

      // Call the onReady callback
      if(page.activity instanceof Activity && typeof page.activity.onReadyCallback === 'function') {
        page.activity.onReadyCallback();
      }

    }, page.readyDelay);
  }

  function callTransitionEnd(pageName) {
    if(riotEnabled) {
      phonon.tagManager.trigger(pageName, 'transitionend');
    }

	dispatchEvent('pagetransitionend', pageName)

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

	dispatchEvent('pagehidden', pageName)

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

	dispatchEvent('pagetabchanged', pageName)

    var page = getPageObject(pageName);

    // Call the onTabChanged callback
    if(page.activity instanceof Activity && typeof page.activity.onTabChangedCallback === 'function') {
      page.activity.onTabChangedCallback(tabNumber);
    }
  }

  function callClose(pageName, nextPageName, hash) {

    function close() {

	  dispatchEvent('pageclosed', pageName)

      var currentHash = window.location.hash.split('#')[1];

      if(currentHash === hash || !opts.useHash) {
        onRoute(hash);
      } else {
        window.location.hash = hash;
      }
    }

    // cancel the page transition
    if(isComponentVisible()) return;

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
        throw new Error('The page ' + page.name + ' prevents close, but its callback (onClose) is undefined');
      }
    }
  }

  function callHash(pageName, params) {

    if(typeof params === 'undefined') return;

    if(riotEnabled) {
      phonon.tagManager.trigger(pageName, 'hashchanged', params);
    }

	dispatchEvent('pagehash', pageName, params)

    var page = getPageObject(pageName);

    // Call the onHashChanged callback
    if(page.activity instanceof Activity && typeof page.activity.onHashChangedCallback === 'function') {
      page.activity.onHashChangedCallback(params);
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

        if(opts.useI18n) {
          phonon.i18n().getAll(function(json) {
            phonon.tagManager.addTag(riot.mount(pageName, {i18n: json}), pageName);
            fn();
          });
        } else {
          phonon.tagManager.addTag(riot.mount(pageName, {i18n: null}), pageName);
          fn();
        }
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


		  var evalJs = function(element) {
			  var s = element.getElementsByTagName('script');
			  for(var i=0; i < s.length; i++) {
				  DOMEval(s[i].innerHTML);
			  }
		  };

          if(opts.useI18n) {
            phonon.i18n().bind(virtualElPage, function() {
              elPage.innerHTML = virtualElPage.innerHTML;
			  evalJs(virtualDiv);

              fn();
            });
          } else {
            elPage.innerHTML = virtualElPage.innerHTML;
			evalJs(virtualDiv);
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
      if(req.readyState === 4 && (req.status === 200 || !req.status && req.responseText.length)) {
        fn(req.responseText, opts, url);
      }
    };
    req.open('GET', opts.templateRootDirectory + url, true);
    req.send('');
  }

  function createPage(pageName, properties) {
	properties = typeof properties === 'object' ? properties : {};

	var newPage = {
		name: pageName,
		mounted: false,
		async: false,
		activity: null,
		content: null,
		readyDelay: 1
	};

	var prop;
	for(prop in properties) {
		newPage[prop] = properties[prop];
	}

	return newPage;
  }

  function createOrUpdatePage(pageName, properties) {
	  properties = typeof properties === 'object' ? properties : {};

	  var page = getPageObject(pageName);
	  if(page === null) {
		  return pages.push(createPage(pageName, properties));
	  }

	  var prop;
	  for(prop in properties) {
		  page[prop] = properties[prop];
	  }

	  return true;
  }

  /**
   * Checks if a "front" UI component is active
   * Returns true if an UI component is active, false otherwise
   * @return {Boolean}
   */
  function isComponentVisible() {

    // close active dialogs, popovers, panels and side-panels
    if(typeof phonon.dialog !== 'undefined' && phonon.dialog().closeActive()) return true;
    if(typeof phonon.popover !== 'undefined' && phonon.popover().closeActive()) return true;
    if(typeof phonon.panel !== 'undefined' && phonon.panel().closeActive()) return true;
    if(typeof phonon.sidePanel !== 'undefined' && phonon.sidePanel().closeActive()) return true;

    return false;
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

    /*
     * user interactions are safed (with or without data-navigation | href)
     * the goal is to prevent the backward button if enableBrowserBackButton = false
     */
    safeLink = true;

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

    if(validHref && opts.useHash) {

      // onRoute will be called
      return;
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
      var match = target.href.match('/#' + opts.hashPrefix + '([A-Za-z0-9\-\.]+)?(.*)/');
      if(match) {
        page = match[1];
        params = match[2];
      }
    }

    var hash = opts.hashPrefix + page;

    if(params !== '') {
      hash = hash + '/' + params;
      hash = hash.replace('//', '/');
    }

    callClose(currentPage, page, hash);
  }

  function startTransition(previousPage, pageName) {

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

  /**
   * Calls page events (onCreate, onReady) after
   * the page is actually ready (set its template)
   * @param {String} pageName
   * @param {Function} callback
   */
  function onBeforeTransition(pageName, callback) {

    if(onActiveTransition) {
      if(typeof callback === 'function') {
        return callback();
      }
    }

    var page = getPageObject(pageName);

    if(started) {

      onActiveTransition = true;

      previousPage = currentPage;
      currentPage = pageName;
    }

    if(!page.mounted) {

      mount(page.name, function() {

        page.mounted = true;

        callCreate(pageName);
        callReady(pageName);

        // Call global-ready callbacks once
        if(!started) phonon.dispatchGlobalReady();

        if(started) startTransition(previousPage, pageName);

        if(!started) {

          started = true;

          var el = getPageEl(pageName);
          if(!el.classList.contains('app-active')) {
            el.classList.add('app-active');
          }
        }

        // call the callback after the mount
        if(typeof callback === 'function') {
          callback();
        }
      });
    } else {

      callReady(pageName);
      startTransition(previousPage, pageName);

      // call the callback directly
      if(typeof callback === 'function') {
        callback();
      }
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
    if(opts.enableBrowserBackButton) safeLink = true;

    // Add page nodes
    var pages = document.querySelectorAll('[data-page]');
    var i = pages.length - 1;
    for (; i >= 0; i--) {

      var page = pages[i];

      // add the page class
      if(!page.classList.contains('app-page')) {
        page.classList.add('app-page');
      }

      createOrUpdatePage( page.tagName.toLowerCase() );
    }
  }

  function start() {
    if(started) {
      throw new Error('The app has been already started');
    }

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

    onRoute();
  }

  function changePage(pageName, pageParams) {

    var currentPageObject = getPageObject(currentPage);
    var pageObject = getPageObject(pageName);

    if(pageObject) {

      var hash = (typeof pageParams === 'string' ? opts.hashPrefix + pageObject.name + '/' + pageParams : opts.hashPrefix + pageObject.name);

      if(currentPageObject.async) {
        callClose(currentPage, pageObject.name, hash);
      } else {
        var parsed = window.location.hash.split('/');
        if(parsed[0].indexOf(pageObject.name) === -1 && opts.useHash) {
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

    var pageName;

    var parsed = hash.split('/');
    var params = parsed.slice(1, parsed.length);
    var page = parsed[0];

    // angular hash system
    var withSlash = opts.hashPrefix.indexOf('/');
    if(withSlash !== -1) {
      page = (typeof parsed[1] === 'undefined' ? '' : parsed[1]);
      params = parsed.slice(2, parsed.length);
      pageName = page.substring(withSlash+1, page.length);
    } else {
      // default hash system
      pageName = page.substring(opts.hashPrefix.length, page.length);
    }


    var pageObject = getPageObject(pageName);

    /*
     * if we get an invalid URL,
     * then we start the default page
     */
    if(!started && !pageObject) {

      // fallback default page
      currentPage = opts.defaultPage;

      pageObject = getPageObject(opts.defaultPage);

      /*
       * updates the URL if necessary
       */
      if(opts.useHash) {

        // the onRoute will be called again
        window.location.hash = opts.hashPrefix + opts.defaultPage;
        return;
      }
    } else if(!started && pageObject) {
      // update default value
      currentPage = pageObject.name;
    }

    if(pageObject) {

      /*
       * [1] change page only if changePage() is called programatically
       * [2] back button: if UI components are visible like dialogs, cancel the page transition
       * [3] the back button can be the physical button on Android or the browser's back button
       */

      isComponentVisible();

      if(pageObject.name === currentPage && started) {
        callHash(pageObject.name, params);
        return;
      }

      if(started && !safeLink) {
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
        var strParams = params.join('/');
        pageHistory.push( {page: pageObject.name, params: strParams} );
      }

      /*
       * Page Scope is called once before calling callbacks
       * since v1.0.8, we call the page scope here when the page is not yet mounted
       * because before this version, the onCreate callback was called before the onHash callback
       * since v1.0.2 the order has changed => the onHash callback is called before page callbacks (onCreate, etc.)
       * see issues: #16, #31 and #38
       */
      if(typeof pageObject.callback === 'function' && !pageObject.mounted) {
        pageObject.callback(pageObject.activity);
      }

      if(!pageObject.mounted) {

        onBeforeTransition(pageObject.name, function() {
          callHash(pageObject.name, params);
        });

      } else {

        onBeforeTransition(pageObject.name);
        callHash(pageObject.name, params);
      }

      if(!opts.enableBrowserBackButton) safeLink = false;
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
    var last = getLastPage();
    callClose(currentPage, last.page, opts.hashPrefix + last.page + '/' + last.params);
  });


  phonon.navigator = function(options) {

    if(typeof options === 'object') {
      init(options);
    }

    return {
      currentPage: currentPage,
      previousPage: previousPage,
      start: start,
      changePage: function(pageName, pageParams) {
        safeLink = true;

        /*
         * wait the end of front components animations like dialogs, panels, etc before changing the page
         * [1] avoid several animations at the same time
         * [2] it is more logical to see them disappearing before the page changes
         */

        var wait = (isComponentVisible() ? 400 : 1);

        window.setTimeout(function() {
          changePage(pageName, pageParams);
        }, wait);
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

		// vuejs, riotjs support
        var page = getPageObject(options.page);
		var exists = page === null ? false : true;
		if(!exists) {
          page = createPage(options.page);
		}

		if(typeof callback === 'function' || typeof callback === 'object') {
		  page.activity = new Activity(callback);
	  	} else {
		  page.activity = null;
	  	}

		page.callback = callback;
		page.async = (typeof options.preventClose === 'boolean' ? options.preventClose : false);
		page.content = (typeof options.content === 'string' ? options.content : null);
		page.readyDelay = (typeof options.readyDelay === 'number' ? options.readyDelay : 1);

		createOrUpdatePage(options.page.toLowerCase(), page);
	  },
      callCallback: callCallback
    };
  };

})(typeof window !== 'undefined' ? window : this, typeof riot !== 'undefined' ? riot : undefined, phonon);
