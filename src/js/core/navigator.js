/* ========================================================================
 * Phonon: navigator.js v1.2
 * http://phonon.quarkdev.com
 * ========================================================================
 * Licensed under MIT (http://phonon.quarkdev.com)
 * ======================================================================== */
(function (window, riot, phonon) {
  window.phononDOM = {};

  const pages = [];
  let pageHistory = [];
  let started = false;
  let onActiveTransition = false;

  let currentPage = null;
  let previousPage = null;

  let forward = true;
  let safeLink = false;

  const riotEnabled = (riot !== undefined);

  const opts = {
    defaultPage: null,
    defaultTemplateExtension: null,
    hashPrefix: '!',
    animatePages: true,
    templateRootDirectory: '',
    useI18n: true,
    enableBrowserBackButton: false,
    useHash: true,
  };

  /**
   * "Encapsulated" class
   * The activity takes care of creating a window for you in which you can place your UI with.
   * An activity is based on several window states that we call the activitiy life cycle.
   */
  const Activity = (function () {
    /**
     * @constructor
	 * @param {Object} scope
     */
    function Activity(scope) {
      if (typeof scope === 'object') {
        let handler;
        for (handler in scope) {
          if (this[handler] !== undefined && this[handler] !== 'constructor') {
            this[`${handler}Callback`] = scope[handler];
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
  }());

  /**
   * Retrieves the page object
   * @param {String} pageName
   */
  const getPageObject = function (pageName) {
    let i = pages.length - 1;

    for (; i >= 0; i--) {
      if (pages[i].name === pageName) {
        return pages[i];
      }
    }
    return null;
  };

  function DOMEval(pageName, code) {
    // create page in window object
    if (typeof window.phononDOM[pageName] === 'undefined') {
      window.phononDOM[pageName] = {};
    }

    // add a js variable as shortcut
    let fullCode = `var page = window.phononDOM["${pageName}"];`;
    fullCode += code;

    // execute script
	  const script = document.createElement('script');
	  script.text = fullCode;
	  document.head.appendChild(script).parentNode.removeChild(script);
  }

  /**
   * Retrives the DOM element for a given page
   * @param {String} pageName
   */
  const getPageEl = function (pageName) {
    const pages = document.querySelectorAll('[data-page]');
    let i = pages.length - 1;
    let elPage = null;

    for (; i >= 0; i--) {
      const pageAlias = pages[i].getAttribute('data-alias');
      if (pages[i].tagName.toLowerCase() === pageName || pageAlias === pageName) {
        elPage = pages[i];
        break;
      }
    }
    return elPage;
  };

  function forwardAnimation() {
    if (opts.animatePages) {
      const previousPageEl = this;

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
    if (opts.animatePages) {
      const previousPageEl = this;

      previousPageEl.classList.remove('page-sliding');
      previousPageEl.classList.remove('right');
      previousPageEl.off(phonon.event.animationEnd, previousAnimation, false);

      previousPageEl.classList.remove('app-active');
    }

    callTransitionEnd(currentPage);
    callHiddenCallback(previousPage);

    onActiveTransition = false;
  }

  function dispatchDOMEvent(eventName, pageName, parameters) {
	  const eventInitDict = {
      detail: { page: pageName },
      bubbles: true,
      cancelable: true,
    };

	  if (typeof parameters !== 'undefined') {
		  eventInitDict.detail.req = parameters;
	  }

	  const event = new window.CustomEvent(eventName, eventInitDict);

	  document.dispatchEvent(event);
  }

  /**
   * Dispatches page event from addEvent API
   *
   * @param {String} eventName
   * @param {Array} eventHandlers
   * @param {Object} data
   */
  function dispatchEvent(eventName, eventHandlers, data) {
    let i = 0;
    const l = eventHandlers.length;
    for (; i < l; i++) {
      const eventHandler = eventHandlers[i];
      if (eventHandler.event === eventName) {
        if (typeof eventHandler.callback === 'function') {
          eventHandler.callback(data);
        }
      }
    }
  }

  function callCreate(pageName) {
    if (riotEnabled) {
      // Call the "create" event in VM
      phonon.tagManager.trigger(pageName, 'create');
    }

    /*
     * dispatch the event before calling the activity's callback
     * so that UI components are ready to use
     * issue #52 is related to this
    */
    dispatchDOMEvent('pagecreated', pageName);

    const page = getPageObject(pageName);

    // Call the onCreate callback
    if (page.activity instanceof Activity && typeof page.activity.onCreateCallback === 'function') {
      page.activity.onCreateCallback();
    }

    dispatchEvent('create', page.callbackRegistered);

    if (typeof window.phononDOM[page.name] === 'object') {
      const fn = window.phononDOM[page.name].onCreate;
      if (typeof fn === 'function') {
        fn();
      }
    }
  }

  function callReady(pageName) {
    const page = getPageObject(pageName);

    window.setTimeout(() => {
      if (riotEnabled) {
        // Call the "ready" event in VM
        phonon.tagManager.trigger(pageName, 'ready');
      }

      // Dispatch the global event pageopened
	  dispatchDOMEvent('pageopened', pageName);

      // Call the onReady callback
      if (page.activity instanceof Activity && typeof page.activity.onReadyCallback === 'function') {
        page.activity.onReadyCallback();
      }

      dispatchEvent('ready', page.callbackRegistered);

      if (typeof window.phononDOM[page.name] === 'object') {
        const fn = window.phononDOM[page.name].onReady;
        if (typeof fn === 'function') {
          fn();
        }
      }
    }, page.readyDelay);
  }

  function callTransitionEnd(pageName) {
    if (riotEnabled) {
      phonon.tagManager.trigger(pageName, 'transitionend');
    }

    dispatchDOMEvent('pagetransitionend', pageName);

    const page = getPageObject(pageName);

    // Call the onTransitionEnd callback
    if (page.activity instanceof Activity && typeof page.activity.onTransitionEndCallback === 'function') {
      page.activity.onTransitionEndCallback();
    }

    dispatchEvent('transitionend', page.callbackRegistered);

    if (typeof window.phononDOM[page.name] === 'object') {
      const fn = window.phononDOM[page.name].onTransitionEnd;
      if (typeof fn === 'function') {
        fn();
      }
    }
  }

  function callHiddenCallback(pageName) {
    if (riotEnabled) {
      phonon.tagManager.trigger(pageName, 'hidden');
    }

    dispatchDOMEvent('pagehidden', pageName);

    const page = getPageObject(pageName);

    // Call the onHidden callback
    if (page.activity instanceof Activity && typeof page.activity.onHiddenCallback === 'function') {
      page.activity.onHiddenCallback();
    }

    dispatchEvent('hidden', page.callbackRegistered);

    if (typeof window.phononDOM[page.name] === 'object') {
      const fn = window.phononDOM[page.name].onHidden;
      if (typeof fn === 'function') {
        fn();
      }
    }
  }

  function callTabChanged(pageName, tabNumber) {
    if (riotEnabled) {
      phonon.tagManager.trigger(pageName, 'tabchanged', tabNumber);
    }

    dispatchDOMEvent('pagetabchanged', pageName);

    const page = getPageObject(pageName);

    // Call the onTabChanged callback
    if (page.activity instanceof Activity && typeof page.activity.onTabChangedCallback === 'function') {
      page.activity.onTabChangedCallback(tabNumber);
    }

    dispatchEvent('tabchanged', page.callbackRegistered, tabNumber);

    if (typeof window.phononDOM[page.name] === 'object') {
      const fn = window.phononDOM[page.name].onTabChanged;
      if (typeof fn === 'function') {
        fn(tabNumber);
      }
    }
  }

  function callClose(pageName, nextPageName, hash) {
    function close() {
	  dispatchDOMEvent('pageclosed', pageName);

      const currentHash = window.location.hash.split('#')[1];

      if (currentHash === hash || !opts.useHash) {
        onRoute(hash);
      } else {
        window.location.hash = hash;
      }
    }

    // cancel the page transition
    if (isComponentVisible()) return;

    const page = getPageObject(pageName);

    // close the page directly
    if (!page.async) {
      close(true);
      return;
    }

    const api = { close };

    if (riotEnabled) {
      phonon.tagManager.trigger(pageName, 'close', api);
    }

    // Call the onclose callback
    if (page.activity instanceof Activity && typeof page.activity.onCloseCallback === 'function') {
      page.activity.onCloseCallback(api);
    }

    dispatchEvent('close', page.callbackRegistered, api);

    if (typeof window.phononDOM[page.name] === 'object') {
      const fn = window.phononDOM[page.name].onClose;
      if (typeof fn === 'function') {
        fn(api);
      }
    }
  }

  function callHash(pageName, params) {
    if (typeof params === 'undefined') return;

    if (riotEnabled) {
      phonon.tagManager.trigger(pageName, 'hashchanged', params);
    }

    dispatchDOMEvent('pagehash', pageName, params);

    const page = getPageObject(pageName);

    // Call the onHashChanged callback
    if (page.activity instanceof Activity && typeof page.activity.onHashChangedCallback === 'function') {
      page.activity.onHashChangedCallback(params);
    }

    dispatchEvent('hashchanged', page.callbackRegistered, params);

    if (typeof window.phononDOM[page.name] === 'object') {
      const fn = window.phononDOM[page.name].onHashChanged;
      if (typeof fn === 'function') {
        fn(params);
      }
    }
  }

  function callCallback(callbackName, options) {
    if (callbackName === 'tabchanged') {
      callTabChanged(options.page, options.tabNumber);
    }
  }

  function mount(pageName, fn, postData) {
    if (riotEnabled) {
      riot.compile(() => {
        if (opts.useI18n) {
          phonon.i18n().getAll((json) => {
            phonon.tagManager.addTag(riot.mount(pageName, { i18n: json }), pageName);
            fn();
          });
        } else {
          phonon.tagManager.addTag(riot.mount(pageName, { i18n: null }), pageName);
          fn();
        }
      });
    }

    if (!riotEnabled) {
      const page = getPageObject(pageName);

      if (page.content !== null) {
        if (page.nocache === null || page.showloader === null) {
          const setLoaderAndCache = function (pageName) {
            const elPage = getPageEl(pageName);
            page.nocache = false;
            page.showloader = false;
            if (elPage.getAttribute('data-nocache') === 'true') page.nocache = true;
            if (elPage.getAttribute('data-loader') === 'true') page.showloader = true;
          };
          setLoaderAndCache(pageName);
        }

        if (page.showloader) document.body.classList.add('loading');

        loadContent(page.content, (template) => {
          if (page.showloader) document.body.classList.remove('loading');

          const elPage = getPageEl(pageName);

          const virtualDiv = document.createElement('div');
          virtualDiv.innerHTML = template;

          const virtualElPage = virtualDiv.querySelector(pageName);

          if (virtualElPage === null) {
            throw new Error(`Error with ${page.content} : the template for ${pageName} must start with the parent node <${pageName} class="app-page">`);
          }
          const attrs = virtualElPage.attributes;

          let i = attrs.length - 1;

          for (; i >= 0; i--) {
            const attr = attrs.item(i);
            if (attr.nodeName !== 'class' && attr.nodeValue !== 'app-page') elPage.setAttribute(attr.nodeName, attr.nodeValue);
          }


		  const evalJs = function (element) {
			  let s = element.getElementsByTagName('script');
            // convert nodeList to array
            s = Array.prototype.slice.call(s);
			  for (let i = 0; i < s.length; i++) {
              const type = s[i].getAttribute('type');
              if (type === 'text/javascript' || type === null) {
                DOMEval(page.name, s[i].innerHTML);
              }
			  }
		  };

          if (opts.useI18n) {
            phonon.i18n().bind(virtualElPage, () => {
              elPage.innerHTML = virtualElPage.innerHTML;
			  evalJs(virtualDiv);

              fn();
            });
          } else {
            elPage.innerHTML = virtualElPage.innerHTML;
            evalJs(virtualDiv);
            fn();
          }
        }, postData);
      } else {
        fn();
      }
    }
  }

  function loadContent(url, fn, postData) {
    const req = new XMLHttpRequest();
    if (req.overrideMimeType) req.overrideMimeType('text/html; charset=utf-8');
    req.onreadystatechange = function () {
      if (req.readyState === 4 && (req.status === 200 || !req.status && req.responseText.length)) {
        fn(req.responseText, opts, url);
      }
    };

    if (typeof postData !== 'string') {
      req.open('GET', opts.templateRootDirectory + url, true);
      req.send('');
    } else {
      req.open('POST', opts.templateRootDirectory + url, true);
      req.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
      req.send(postData);
    }
  }

  function createPage(pageName, properties) {
    properties = typeof properties === 'object' ? properties : {};

    const newPage = {
      name: pageName,
      mounted: false,
      async: false,
      activity: null,
      content: null,
      readyDelay: 1,
      callbackRegistered: [],
      nocache: null,
      showloader: null,
    };

    let prop;
    for (prop in properties) {
      newPage[prop] = properties[prop];
    }

    return newPage;
  }

  function createOrUpdatePage(pageName, properties) {
	  properties = typeof properties === 'object' ? properties : {};

	  const page = getPageObject(pageName);
	  if (page === null) {
		  return pages.push(createPage(pageName, properties));
	  }

	  let prop;
	  for (prop in properties) {
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
    if (typeof phonon.dialog !== 'undefined' && phonon.dialogUtil.closeActive()) return true;
    if (typeof phonon.popover !== 'undefined' && phonon.popoverUtil.closeActive()) return true;
    if (typeof phonon.panel !== 'undefined' && phonon.panelUtil.closeActive()) return true;
    if (typeof phonon.sidePanel !== 'undefined' && phonon.sidePanelUtil.closeActive()) return true;

    return false;
  }

  function getLastPage() {
    let page = { page: opts.defaultPage, params: '' };
    if (pageHistory.length > 0) {
      let inddex = -1;
      let i = pageHistory.length - 1;

      for (; i >= 0; i--) {
        if (pageHistory[i].page === currentPage) {
          inddex = i - 1;
          break;
        }
      }

      if (inddex > -1) {
        page = pageHistory[inddex];
        pageHistory = pageHistory.slice(0, inddex);
      }
    }
    return page;
  }

  function serializeForm(evt) {
    var evt = evt || window.event;
    const form = evt.target;
    let field; let
      query = '';
    if (typeof form === 'object' && form.nodeName == 'FORM') {
      let i;
      for (i = form.elements.length - 1; i >= 0; i--) {
        field = form.elements[i];
        if (field.name && field.type != 'file' && field.type != 'reset') {
          if (field.type == 'select-multiple') {
            for (j = form.elements[i].options.length - 1; j >= 0; j--) {
              if (field.options[j].selected) {
                query += `&${field.name}=${encodeURIComponent(field.options[j].value).replace(/%20/g, '+')}`;
              }
            }
          } else if ((field.type != 'submit' && field.type != 'button') || evt.target == field) {
            if ((field.type != 'checkbox' && field.type != 'radio') || field.checked) {
              query += `&${field.name}=${encodeURIComponent(field.value).replace(/%20/g, '+')}`;
            }
          }
        }
      }
    }
    return query.substr(1);
  }

  function navigationListener(evt) {
    /*
     * user interactions are safed (with or without data-navigation | href)
     * the goal is to prevent the backward button if enableBrowserBackButton = false
     */
    safeLink = true;

    let { target } = evt;
    let nav = null;
    let validHref = false;
    let params = '';
    let formData;

    if (evt.type == 'submit') { // dev
      const formAction = target.getAttribute('action');
      if (formAction.match(new RegExp(`^#${opts.hashPrefix}`))) {
        evt.preventDefault();
        nav = formAction.substr(1 + (opts.hashPrefix.length));
        callClose(currentPage, nav, opts.hashPrefix + nav);
        onBeforeTransition(nav, () => {
          // callHash(nav);
        }, serializeForm(evt)); // dev
        return changePage(formAction.substr(1 + (opts.hashPrefix.length)));
      }
    }

    for (; target && target !== document; target = target.parentNode) {
      const dataNav = target.getAttribute('data-navigation');
      if (typeof target.href !== 'undefined' && target.href.indexOf('#!') !== -1) {
        validHref = true;
        break;
      }
      if (dataNav) {
        nav = dataNav;
        break;
      }
    }

    if (validHref && opts.useHash) {
      // onRoute will be called
      return;
    }

    if (nav === null && !validHref) {
      return;
    }

    let page = opts.defaultPage;

    if (nav !== null) {
      if (nav === '$previous-page') {
        const pObj = getLastPage();
        page = pObj.page;
        params = pObj.params;
      } else {
        page = nav;
      }
    } else {
      // regex
      const match = target.href.match(`/#${opts.hashPrefix}([A-Za-z0-9\-\.]+)?(.*)/`);
      if (match) {
        page = match[1];
        params = match[2];
      }
    }

    let hash = opts.hashPrefix + page;

    if (params !== '') {
      hash = `${hash}/${params}`;
      hash = hash.replace('//', '/');
    }

    callClose(currentPage, page, hash);
  }

  function startTransition(previousPage, pageName) {
    const previousPageEl = getPageEl(previousPage);
    const elCurrentPage = getPageEl(pageName);

    elCurrentPage.classList.add('app-active');

    if (opts.animatePages) {
      previousPageEl.classList.add('page-sliding');

      if (forward) {
        previousPageEl.classList.add('left');
        previousPageEl.on(phonon.event.animationEnd, forwardAnimation, false);
      } else {
        previousPageEl.classList.add('right');
        previousPageEl.on(phonon.event.animationEnd, previousAnimation, false);
      }
    } else {
      previousPageEl.classList.remove('app-active');

      if (forward) {
        forwardAnimation();
      } else {
        previousAnimation();
      }
    }

    // Scroll to top
    const contents = elCurrentPage.querySelectorAll('.content');
    let i = contents.length - 1;
    for (; i >= 0; i--) {
      const content = contents[i];
      if (content !== null && content.scrollTop !== 0) {
        content.scrollTop = 0;
      }
    }

    // delete history if the current page is the default page
    if (pageName === opts.defaultPage) {
      pageHistory = [];
    }
  }

  /**
   * Calls page events (onCreate, onReady) after
   * the page is actually ready (set its template)
   * @param {String} pageName
   * @param {Function} callback
   */
  function onBeforeTransition(pageName, callback, postData) {
    if (onActiveTransition) {
      if (typeof callback === 'function') {
        return callback();
      }
    }

    const page = getPageObject(pageName);

    if (started) {
      onActiveTransition = true;

      previousPage = currentPage;
      currentPage = pageName;
    }

    if (!page.mounted || page.nocache) {
      mount(page.name, () => {
        page.mounted = true;

        callCreate(pageName);
        callReady(pageName);

        // Call global-ready callbacks once
        if (!started) phonon.dispatchGlobalReady();

        if (started) startTransition(previousPage, pageName);

        if (!started) {
          started = true;

          const el = getPageEl(pageName);
          if (!el.classList.contains('app-active')) {
            el.classList.add('app-active');
          }
        }

        // call the callback after the mount
        if (typeof callback === 'function') {
          callback();
        }
      }, postData);
    } else {
      callReady(pageName);
      startTransition(previousPage, pageName);

      // call the callback directly
      if (typeof callback === 'function') {
        callback();
      }
    }
  }

  function init(options) {
    if (typeof options.templateRootDirectory === 'string' && options.templateRootDirectory !== '') {
      options.templateRootDirectory = ((options.templateRootDirectory.indexOf('/', options.templateRootDirectory.length - '/'.length) !== -1) ? options.templateRootDirectory : `${options.templateRootDirectory}/`);
    }
    if (typeof options.hashPrefix === 'object') options.hashPrefix = '';

    let prop;
    for (prop in options) {
      opts[prop] = options[prop];
    }

    // navigation listeners are accepted (safe)
    if (opts.enableBrowserBackButton) safeLink = true;

    // Add page nodes
    const pages = document.querySelectorAll('[data-page]');
    let i = pages.length - 1;
    for (; i >= 0; i--) {
      const page = pages[i];

      // add the page class
      if (!page.classList.contains('app-page')) {
        page.classList.add('app-page');
      }

      createOrUpdatePage(page.tagName.toLowerCase());
    }
  }

  function start() {
    if (started) {
      throw new Error('The app has been already started');
    }

    // android, ios or browser
    let osName = '';
    if (phonon.device.os) {
      osName = phonon.device.os.toLowerCase();
    }

    let osClass = 'web';

    if (osName === 'android') {
      osClass = 'android';
    } else if (osName === 'ios') {
      osClass = 'ios';
    }

    if (!document.body.classList.contains(osClass)) {
      document.body.classList.add(osClass);
    }

    onRoute();
  }

  function changePage(pageName, pageParams) {
    const currentPageObject = getPageObject(currentPage);
    const pageObject = getPageObject(pageName);

    if (pageObject) {
      let hash = opts.hashPrefix + pageObject.name;

      if (typeof pageParams !== 'undefined') {
        hash = `${opts.hashPrefix + pageObject.name}/${pageParams}`;
      }

      if (currentPageObject.async) {
        callClose(currentPage, pageObject.name, hash);
      } else if (window.location.hash.indexOf(hash) === -1 && opts.useHash) {
        window.location.hash = hash;
      }
    } else {
      throw new Error(`The following page: ${pageName} does not exists`);
    }
  }

  /**
   * @param {String | HashEvent} virtualHash
   */
  function onRoute(virtualHash, postData) {
    const hash = (typeof virtualHash === 'string' ? virtualHash : window.location.href.split('#')[1] || '');
    let pageName;

    const parsed = hash.split('/');
    let params = parsed.slice(1, parsed.length);
    let page = parsed[0];

    // angular hash system
    const withSlash = opts.hashPrefix.indexOf('/');
    if (withSlash !== -1) {
      page = (typeof parsed[1] === 'undefined' ? '' : parsed[1]);
      params = parsed.slice(2, parsed.length);
      pageName = page.substring(withSlash + 1, page.length);
    } else {
      // default hash system
      pageName = page.substring(opts.hashPrefix.length, page.length);
    }


    let pageObject = getPageObject(pageName);

    /*
     * if we get an invalid URL,
     * then we start the default page
     */
    if (!started && !pageObject) {
      // fallback default page
      currentPage = opts.defaultPage;

      pageObject = getPageObject(opts.defaultPage);

      /*
       * updates the URL if necessary
       */
      if (opts.useHash) {
        // the onRoute will be called again
        window.location.hash = opts.hashPrefix + opts.defaultPage;
        return;
      }
    } else if (!started && pageObject) {
      // update default value
      currentPage = pageObject.name;
    }

    if (pageObject) {
      /*
       * [1] change page only if changePage() is called programatically
       * [2] back button: if UI components are visible like dialogs, cancel the page transition
       * [3] the back button can be the physical button on Android or the browser's back button
       */

      isComponentVisible();

      if (pageObject.name === currentPage && started) {
        callHash(pageObject.name, params);
        return;
      }

      if (started && !safeLink) {
        return;
      }

      let inArray = false;
      let i = pageHistory.length - 1;

      for (; i >= 0; i--) {
        if (pageHistory[i].page === pageObject.name) {
          inArray = true;
          break;
        }
      }

      if (pageHistory.length > 0) {
        if (pageObject.name === opts.defaultPage) {
          forward = false;
        }
      } else {
        forward = true;
      }

      if (pageHistory.length > 1 && pageHistory[pageHistory.length - 2].page === pageObject.name) {
        forward = false;
      }

      if (!inArray) {
        const strParams = params.join('/');
        pageHistory.push({ page: pageObject.name, params: strParams });
      }

      /*
       * Page Scope is called once before calling callbacks
       * since v1.0.8, we call the page scope here when the page is not yet mounted
       * because before this version, the onCreate callback was called before the onHash callback
       * since v1.0.2 the order has changed => the onHash callback is called before page callbacks (onCreate, etc.)
       * see issues: #16, #31 and #38
       */
      if (typeof pageObject.callback === 'function' && !pageObject.mounted) {
        pageObject.callback(pageObject.activity);
      }

      if (!pageObject.mounted) {
        onBeforeTransition(pageObject.name, () => {
          callHash(pageObject.name, params);
        }, postData);
      } else {
        onBeforeTransition(pageObject.name, null, postData);
        callHash(pageObject.name, params);
      }

      if (!opts.enableBrowserBackButton) safeLink = false;
    }
  }

  /**
   * One listener to navigate through the app pages
   */
  document.on('tap', navigationListener);
  /**
   * Handle (port) forms to event
   */
  document.on('submit', navigationListener);

  /*
   * [1] we do not call onRoute() directly because it is used in callClose
   * in order to prevent the back button on navigator:
   * the hash changes, but it is refused by this module (not trusted behavior)
   * so we need to call this function with a "virtual hash" as argument
   * [2] window.on(...) seems buggy
   */
  if (opts.useHash) window.addEventListener('hashchange', onRoute);

  document.on('backbutton', () => {
    if (isComponentVisible()) return;
    const last = getLastPage();
    callClose(currentPage, last.page, `${opts.hashPrefix + last.page}/${last.params}`);
  });

  phonon.navigator = function (options) {
    if (typeof options === 'object') {
      init(options);
    }

    return {

      currentPage,
      previousPage,
      start,
      changePage(pageName, pageParams) {
        safeLink = true;

        /*
         * wait the end of front components animations like dialogs, panels, etc before changing the page
         * [1] avoid several animations at the same time
         * [2] it is more logical to see them disappearing before the page changes
         */

        const wait = (isComponentVisible() ? 400 : 1);

        window.setTimeout(() => {
          if (pageName == '$previous-page') {
            const last = getLastPage();
            if (last) {
              pageName = last.page;
              pageParams = last.params;
            }
          }
          changePage(pageName, pageParams);
        }, wait);
      },
      on(options, callback) {
        if (typeof options.page !== 'string') {
          throw new Error('Page name must be a string');
        }
        if (typeof options.preventClose !== 'undefined' && typeof options.preventClose !== 'boolean') {
          throw new Error('preventClose option must be a boolean');
        }
        if (typeof options.readyDelay !== 'undefined' && typeof options.readyDelay !== 'number') {
          throw new Error('readyDelay option must be a number');
        }
        if (typeof options.content !== null && typeof opts.defaultTemplateExtension === 'string') {
          options.content = `${options.page}.${opts.defaultTemplateExtension}`;
        }

        // vuejs, riotjs support
        let page = getPageObject(options.page);
        const exists = page !== null;
        if (!exists) {
          page = createPage(options.page);
        }

        if (typeof callback === 'function' || typeof callback === 'object') {
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
      // register a page event only such as home:create
      onPage(pageName) {
        if (typeof pageName !== 'string') {
          throw new Error('PageName must be a string');
        }

        createOrUpdatePage(pageName, {});

        return {
          addEvent(eventName, callback) {
            const page = getPageObject(pageName);
            page.callbackRegistered.push({ event: eventName, callback });
          },
        };
      },
      callCallback,
    };
  };
}(typeof window !== 'undefined' ? window : this, typeof riot !== 'undefined' ? riot : undefined, phonon));
