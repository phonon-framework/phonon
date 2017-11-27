/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "http://127.0.0.1:8080/";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__(1);


/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _index = __webpack_require__(2);

	var _index2 = _interopRequireDefault(_index);

	var _ajax = __webpack_require__(82);

	var _ajax2 = _interopRequireDefault(_ajax);

	var _platform = __webpack_require__(83);

	var _platform2 = _interopRequireDefault(_platform);

	var _intl = __webpack_require__(86);

	var _intl2 = _interopRequireDefault(_intl);

	var _network = __webpack_require__(92);

	var _network2 = _interopRequireDefault(_network);

	var _dialog = __webpack_require__(116);

	var _dialog2 = _interopRequireDefault(_dialog);

	var _notification = __webpack_require__(117);

	var _notification2 = _interopRequireDefault(_notification);

	var _collapse = __webpack_require__(122);

	var _collapse2 = _interopRequireDefault(_collapse);

	var _progress = __webpack_require__(123);

	var _progress2 = _interopRequireDefault(_progress);

	var _loader = __webpack_require__(124);

	var _loader2 = _interopRequireDefault(_loader);

	var _offCanvas = __webpack_require__(125);

	var _offCanvas2 = _interopRequireDefault(_offCanvas);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	// components
	var api = {};

	/**
	 * ------------------------------------------------------------------------
	 * Configuration
	 * ------------------------------------------------------------------------
	 */
	/**
	 * --------------------------------------------------------------------------
	 * Licensed under MIT (https://github.com/quark-dev/Phonon-Framework/blob/master/LICENSE)
	 * --------------------------------------------------------------------------
	 */

	// core
	api.config = {
	  // global config
	  debug: true

	  /**
	   * ------------------------------------------------------------------------
	   * Pager
	   * ------------------------------------------------------------------------
	   */
	};api.pager = function (options) {
	  if (typeof api._pager === 'undefined') {
	    api._pager = _index2.default._DOMInterface(options);
	  }
	  return api._pager;
	};

	/**
	 * ------------------------------------------------------------------------
	 * Platform
	 * ------------------------------------------------------------------------
	 */

	api.platform = _platform2.default;

	/**
	 * ------------------------------------------------------------------------
	 * Ajax
	 * ------------------------------------------------------------------------
	 */
	api.ajax = _ajax2.default._DOMInterface;

	/**
	 * ------------------------------------------------------------------------
	 * Intl
	 * ------------------------------------------------------------------------
	 */
	api.intl = _intl2.default._DOMInterface;

	/**
	 * ------------------------------------------------------------------------
	 * Network
	 * ------------------------------------------------------------------------
	 */
	api.network = _network2.default._DOMInterface;

	/**
	 * ------------------------------------------------------------------------
	 * Notification
	 * ------------------------------------------------------------------------
	 */
	api.notification = _notification2.default._DOMInterface;

	/**
	 * ------------------------------------------------------------------------
	 * Dialog
	 * ------------------------------------------------------------------------
	 */
	api.dialog = _dialog2.default._DOMInterface;

	/**
	 * ------------------------------------------------------------------------
	 * Collapse
	 * ------------------------------------------------------------------------
	 */
	api.collapse = _collapse2.default._DOMInterface;

	/**
	 * ------------------------------------------------------------------------
	 * Progress
	 * ------------------------------------------------------------------------
	 */
	api.progress = _progress2.default._DOMInterface;

	/**
	 * ------------------------------------------------------------------------
	 * Loader
	 * ------------------------------------------------------------------------
	 */
	api.loader = _loader2.default._DOMInterface;

	/**
	 * ------------------------------------------------------------------------
	 * Off canvas
	 * ------------------------------------------------------------------------
	 */
	api.offCanvas = _offCanvas2.default._DOMInterface;

	// Make the API live
	window.phonon = api;

	exports.default = api;

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _assign = __webpack_require__(3);

	var _assign2 = _interopRequireDefault(_assign);

	var _classCallCheck2 = __webpack_require__(40);

	var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

	var _createClass2 = __webpack_require__(41);

	var _createClass3 = _interopRequireDefault(_createClass2);

	var _page = __webpack_require__(45);

	var _page2 = _interopRequireDefault(_page);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	var Pager = function () {
	  /**
	   * ------------------------------------------------------------------------
	   * Constants
	   * ------------------------------------------------------------------------
	   */

	  var NAME = 'pager';
	  var VERSION = '2.0.0';
	  var DEFAULT_PROPERTIES = {
	    hashPrefix: '#!',
	    useHash: true,
	    defaultPage: null,
	    animatePages: true
	  };

	  var Event = {
	    PAGE: {
	      SHOW: 'show',
	      SHOWN: 'shown',
	      HIDE: 'hide',
	      HIDDEN: 'hidden',
	      HASH: 'hash'
	    }
	  };

	  var currentPage = void 0;
	  /**
	   * ------------------------------------------------------------------------
	   * Class Definition
	   * ------------------------------------------------------------------------
	   */

	  var Pager = function () {
	    /**
	     * @constructor
	     *
	     * @param options {Object}
	     */
	    function Pager() {
	      var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
	      (0, _classCallCheck3.default)(this, Pager);

	      this.options = (0, _assign2.default)(DEFAULT_PROPERTIES, options);

	      this.pages = [];
	      this.started = false;

	      // add global listeners such ash hash change, navigation, etc.
	      this.addPagerEvents();

	      // faster way to init pages before the DOM is ready
	      this.onDOMLoaded();
	    }

	    // private


	    (0, _createClass3.default)(Pager, [{
	      key: '_',
	      value: function _(selector) {
	        return document.querySelector(selector);
	      }
	    }, {
	      key: 'getHash',
	      value: function getHash() {
	        return window.location.hash.split(this.options.hashPrefix)[1];
	      }
	    }, {
	      key: 'getPageFromHash',
	      value: function getPageFromHash() {
	        var hash = this.getHash();
	        var re = new RegExp('[?\/]([^\/]*)');
	        var matches = re.exec(hash);

	        if (matches && matches[1]) {
	          return matches[1];
	        }

	        return null;
	      }
	    }, {
	      key: 'setHash',
	      value: function setHash(pageName) {
	        window.location.hash = this.options.hashPrefix + '/' + pageName;
	      }
	    }, {
	      key: 'areSamePage',
	      value: function areSamePage(pageName1, pageName2) {
	        var page1 = this.getPageModel(pageName1);
	        var page2 = this.getPageModel(pageName2);
	        return page1 && page2 && page1.name === page2.name;
	      }

	      /**
	       * Attaches the main events for tracking hash changes,
	       * click on navigation buttons and links and back history
	       */

	    }, {
	      key: 'addPagerEvents',
	      value: function addPagerEvents() {
	        var _this = this;

	        document.addEventListener('click', function (event) {
	          return _this.onClick(event);
	        });
	        window.addEventListener('popstate', function (event) {
	          return _this.onBackHistory(event);
	        });
	        window.addEventListener('hashchange', function (event) {
	          return _this.onHashChange(event);
	        });
	        document.addEventListener('DOMContentLoaded', function (event) {
	          return _this.onDOMLoaded(event);
	        });
	      }

	      // getters

	    }, {
	      key: 'showPage',


	      // public

	      value: function showPage(pageName) {
	        var _this2 = this;

	        var addToHistory = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;
	        var back = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;

	        var oldPage = this._('.current');
	        if (oldPage) {
	          var oldPageName = oldPage.getAttribute('data-page');

	          if (this.areSamePage(pageName, oldPageName)) {
	            return;
	          }

	          oldPage.classList.remove('current');

	          // history
	          window.history.replaceState({ page: oldPageName }, oldPageName, window.location.href);

	          this.triggerPageEvent(oldPageName, Event.PAGE.HIDE);
	        }

	        this.triggerPageEvent(pageName, Event.PAGE.SHOW);

	        currentPage = pageName;

	        // new page
	        var newPage = this._('[data-page="' + pageName + '"]');

	        newPage.classList.add('current');

	        // template loader
	        var pageModel = this.getPageModel(pageName);

	        // @todo: use template cache?
	        if (pageModel && pageModel.getTemplate()) {
	          pageModel.loadTemplate();
	        }
	        // end

	        if (oldPage) {
	          var _oldPageName = oldPage.getAttribute('data-page');
	          // use of prototype-oriented language
	          oldPage.back = back;
	          oldPage.previousPageName = _oldPageName;

	          if (this.options.animatePages) {
	            oldPage.addEventListener(Event.ANIMATION_END, function () {
	              return _this2.onPageAnimationEnd(oldPage);
	            });
	            oldPage.classList.add('animate');
	          } else {
	            this.onPageAnimationEnd(oldPage);
	          }

	          oldPage.classList.add(back ? 'pop-page' : 'push-page');
	        }
	      }
	    }, {
	      key: 'addUniquePageModel',
	      value: function addUniquePageModel(pageName) {
	        if (!this.getPageModel(pageName)) {
	          this.pages.push(new _page2.default(pageName));
	        }
	      }
	    }, {
	      key: 'getPageModel',
	      value: function getPageModel(pageName) {
	        return this.pages.find(function (page) {
	          return page.name === pageName;
	        });
	      }
	    }, {
	      key: 'getPagesModel',
	      value: function getPagesModel(pageNames) {
	        return this.pages.filter(function (page) {
	          return pageNames.indexOf(page.name) > -1;
	        });
	      }
	    }, {
	      key: 'selectorToArray',
	      value: function selectorToArray(str) {
	        return str.split(',').map(function (item) {
	          return item.trim();
	        });
	      }
	    }, {
	      key: 'addEvents',
	      value: function addEvents(callback) {
	        if (this.cachePageSelector === '*') {
	          // add to all page models
	          this.pages.forEach(function (page) {
	            page.addEventCallback(callback);
	          });
	          return;
	        }

	        var pageModels = this.getPagesModel(this.selectorToArray(this.cachePageSelector), true);
	        pageModels.forEach(function (page) {
	          page.addEventCallback(callback);
	        });
	        this.cachePageSelector = null;
	      }
	    }, {
	      key: 'useTemplate',
	      value: function useTemplate(templatePath) {
	        var renderFunction = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;

	        var pageModels = this.getPagesModel(this.selectorToArray(this.cachePageSelector), true);
	        pageModels.forEach(function (page) {
	          page.useTemplate(templatePath);
	          if (typeof renderFunction === 'function') {
	            page.useTemplateRenderer(renderFunction);
	          }
	        });
	        this.cachePageSelector = null;
	      }
	    }, {
	      key: 'triggerPageEvent',
	      value: function triggerPageEvent(pageName, eventName) {
	        var eventParams = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;

	        var pageModel = this.getPageModel(pageName);
	        if (pageModel) {
	          pageModel.triggerScopes(eventName, eventParams);
	        }
	      }
	    }, {
	      key: 'onClick',
	      value: function onClick(event) {
	        var pageName = event.target.getAttribute('data-navigate');
	        var pushPage = !(event.target.getAttribute('data-pop-page') === 'true');

	        if (pageName) {
	          if (pageName === '$back') {
	            // the popstate event will be triggered
	            window.history.back();
	            return;
	          }

	          /*
	           * If we he use the hash as trigger,
	           * we change it dynamically so that the hashchange event is called
	           * Otherwise, we show the page
	           */
	          if (this.options.useHash) {
	            this.setHash(pageName);
	          } else {
	            this.showPage(pageName, true, pushPage);
	          }
	        }
	      }
	    }, {
	      key: 'onBackHistory',
	      value: function onBackHistory() {
	        var event = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

	        var pageName = event.state ? event.state.page : null;
	        if (!pageName) {
	          return;
	        }

	        this.showPage(pageName, true, true);
	      }
	    }, {
	      key: 'onPageAnimationEnd',
	      value: function onPageAnimationEnd(target) {
	        var _this3 = this;

	        target.classList.remove('animate');
	        target.classList.remove(target.back ? 'pop-page' : 'push-page');

	        this.triggerPageEvent(currentPage, Event.PAGE.SHOWN);
	        this.triggerPageEvent(target.previousPageName, Event.PAGE.HIDDEN);

	        target.removeEventListener(Event.ANIMATION_END, function (event) {
	          return _this3.onPageAnimationEnd(event);
	        });
	      }
	    }, {
	      key: 'onHashChange',
	      value: function onHashChange() {
	        var params = (this.getHash() ? this.getHash().split('/') : []).filter(function (p) {
	          return p.length > 0;
	        });
	        if (params.length > 0) {
	          // remove first value which is the page name
	          params.shift();
	        }

	        this.triggerPageEvent(currentPage, Event.PAGE.HASH, params);

	        var navPage = this.getPageFromHash();
	        if (navPage) {
	          this.showPage(navPage);
	        }
	      }

	      /**
	       * Queries the page nodes in the DOM
	       */

	    }, {
	      key: 'onDOMLoaded',
	      value: function onDOMLoaded() {
	        var _this4 = this;

	        var pages = document.querySelectorAll('[data-page]');

	        if (!pages) {
	          return;
	        }

	        pages.forEach(function (page) {
	          var pageName = page.getAttribute('data-page');
	          /*
	           * the page name can be given with the attribute data-page
	           * or with its node name
	           */
	          if (!pageName) {
	            pageName = page.nodeName;
	          }

	          _this4.addUniquePageModel(pageName);
	        });
	      }
	    }, {
	      key: 'select',
	      value: function select(pageName) {
	        var addPageModel = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;

	        this.cachePageSelector = pageName;

	        if (addPageModel && pageName !== '*') {
	          this.addUniquePageModel(pageName);
	        }

	        return this;
	      }
	    }, {
	      key: 'start',
	      value: function start() {
	        var forceDefaultPage = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;

	        // check if the app has been already started
	        if (this.started) {
	          throw new Error(NAME + '. The app has been already started.');
	        }

	        this.started = true;

	        // force default page on Cordova
	        if (window.cordova) {
	          forceDefaultPage = true;
	        }

	        var pageName = this.getPageFromHash();
	        if (!this.getPageModel(pageName)) {
	          pageName = this.options.defaultPage;
	        }

	        if (forceDefaultPage && !this.options.defaultPage) {
	          throw new Error(NAME + '. The default page must exist for forcing its launch!');
	        }

	        // Log the device info
	        if (phonon.debug) {
	          console.log('Starting Phonon in ' + platform.description);
	          console.log(this.pages.length + ' pages found');
	          console.log('Loading ' + pageName);
	        }

	        /*
	         * if the app is configurated to use hash tracking
	         * we add the page dynamically in the url
	         */
	        if (this.options.useHash) {
	          this.setHash(pageName);
	        }

	        this.showPage(forceDefaultPage ? this.options.defaultPage : pageName);
	      }

	      // static

	    }], [{
	      key: '_DOMInterface',
	      value: function _DOMInterface(options) {
	        return new Pager(options);
	      }
	    }, {
	      key: 'version',
	      get: function get() {
	        return NAME + '.' + VERSION;
	      }
	    }]);
	    return Pager;
	  }();

	  return Pager;
	}(); /**
	      * --------------------------------------------------------------------------
	      * Licensed under MIT (https://github.com/quark-dev/Phonon-Framework/blob/master/LICENSE)
	      * --------------------------------------------------------------------------
	      */

	exports.default = Pager;

/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

	module.exports = { "default": __webpack_require__(4), __esModule: true };

/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

	__webpack_require__(5);
	module.exports = __webpack_require__(8).Object.assign;


/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

	// 19.1.3.1 Object.assign(target, source)
	var $export = __webpack_require__(6);

	$export($export.S + $export.F, 'Object', { assign: __webpack_require__(21) });


/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

	var global = __webpack_require__(7);
	var core = __webpack_require__(8);
	var ctx = __webpack_require__(9);
	var hide = __webpack_require__(11);
	var PROTOTYPE = 'prototype';

	var $export = function (type, name, source) {
	  var IS_FORCED = type & $export.F;
	  var IS_GLOBAL = type & $export.G;
	  var IS_STATIC = type & $export.S;
	  var IS_PROTO = type & $export.P;
	  var IS_BIND = type & $export.B;
	  var IS_WRAP = type & $export.W;
	  var exports = IS_GLOBAL ? core : core[name] || (core[name] = {});
	  var expProto = exports[PROTOTYPE];
	  var target = IS_GLOBAL ? global : IS_STATIC ? global[name] : (global[name] || {})[PROTOTYPE];
	  var key, own, out;
	  if (IS_GLOBAL) source = name;
	  for (key in source) {
	    // contains in native
	    own = !IS_FORCED && target && target[key] !== undefined;
	    if (own && key in exports) continue;
	    // export native or passed
	    out = own ? target[key] : source[key];
	    // prevent global pollution for namespaces
	    exports[key] = IS_GLOBAL && typeof target[key] != 'function' ? source[key]
	    // bind timers to global for call from export context
	    : IS_BIND && own ? ctx(out, global)
	    // wrap global constructors for prevent change them in library
	    : IS_WRAP && target[key] == out ? (function (C) {
	      var F = function (a, b, c) {
	        if (this instanceof C) {
	          switch (arguments.length) {
	            case 0: return new C();
	            case 1: return new C(a);
	            case 2: return new C(a, b);
	          } return new C(a, b, c);
	        } return C.apply(this, arguments);
	      };
	      F[PROTOTYPE] = C[PROTOTYPE];
	      return F;
	    // make static versions for prototype methods
	    })(out) : IS_PROTO && typeof out == 'function' ? ctx(Function.call, out) : out;
	    // export proto methods to core.%CONSTRUCTOR%.methods.%NAME%
	    if (IS_PROTO) {
	      (exports.virtual || (exports.virtual = {}))[key] = out;
	      // export proto methods to core.%CONSTRUCTOR%.prototype.%NAME%
	      if (type & $export.R && expProto && !expProto[key]) hide(expProto, key, out);
	    }
	  }
	};
	// type bitmap
	$export.F = 1;   // forced
	$export.G = 2;   // global
	$export.S = 4;   // static
	$export.P = 8;   // proto
	$export.B = 16;  // bind
	$export.W = 32;  // wrap
	$export.U = 64;  // safe
	$export.R = 128; // real proto method for `library`
	module.exports = $export;


/***/ }),
/* 7 */
/***/ (function(module, exports) {

	// https://github.com/zloirock/core-js/issues/86#issuecomment-115759028
	var global = module.exports = typeof window != 'undefined' && window.Math == Math
	  ? window : typeof self != 'undefined' && self.Math == Math ? self
	  // eslint-disable-next-line no-new-func
	  : Function('return this')();
	if (typeof __g == 'number') __g = global; // eslint-disable-line no-undef


/***/ }),
/* 8 */
/***/ (function(module, exports) {

	var core = module.exports = { version: '2.5.1' };
	if (typeof __e == 'number') __e = core; // eslint-disable-line no-undef


/***/ }),
/* 9 */
/***/ (function(module, exports, __webpack_require__) {

	// optional / simple context binding
	var aFunction = __webpack_require__(10);
	module.exports = function (fn, that, length) {
	  aFunction(fn);
	  if (that === undefined) return fn;
	  switch (length) {
	    case 1: return function (a) {
	      return fn.call(that, a);
	    };
	    case 2: return function (a, b) {
	      return fn.call(that, a, b);
	    };
	    case 3: return function (a, b, c) {
	      return fn.call(that, a, b, c);
	    };
	  }
	  return function (/* ...args */) {
	    return fn.apply(that, arguments);
	  };
	};


/***/ }),
/* 10 */
/***/ (function(module, exports) {

	module.exports = function (it) {
	  if (typeof it != 'function') throw TypeError(it + ' is not a function!');
	  return it;
	};


/***/ }),
/* 11 */
/***/ (function(module, exports, __webpack_require__) {

	var dP = __webpack_require__(12);
	var createDesc = __webpack_require__(20);
	module.exports = __webpack_require__(16) ? function (object, key, value) {
	  return dP.f(object, key, createDesc(1, value));
	} : function (object, key, value) {
	  object[key] = value;
	  return object;
	};


/***/ }),
/* 12 */
/***/ (function(module, exports, __webpack_require__) {

	var anObject = __webpack_require__(13);
	var IE8_DOM_DEFINE = __webpack_require__(15);
	var toPrimitive = __webpack_require__(19);
	var dP = Object.defineProperty;

	exports.f = __webpack_require__(16) ? Object.defineProperty : function defineProperty(O, P, Attributes) {
	  anObject(O);
	  P = toPrimitive(P, true);
	  anObject(Attributes);
	  if (IE8_DOM_DEFINE) try {
	    return dP(O, P, Attributes);
	  } catch (e) { /* empty */ }
	  if ('get' in Attributes || 'set' in Attributes) throw TypeError('Accessors not supported!');
	  if ('value' in Attributes) O[P] = Attributes.value;
	  return O;
	};


/***/ }),
/* 13 */
/***/ (function(module, exports, __webpack_require__) {

	var isObject = __webpack_require__(14);
	module.exports = function (it) {
	  if (!isObject(it)) throw TypeError(it + ' is not an object!');
	  return it;
	};


/***/ }),
/* 14 */
/***/ (function(module, exports) {

	module.exports = function (it) {
	  return typeof it === 'object' ? it !== null : typeof it === 'function';
	};


/***/ }),
/* 15 */
/***/ (function(module, exports, __webpack_require__) {

	module.exports = !__webpack_require__(16) && !__webpack_require__(17)(function () {
	  return Object.defineProperty(__webpack_require__(18)('div'), 'a', { get: function () { return 7; } }).a != 7;
	});


/***/ }),
/* 16 */
/***/ (function(module, exports, __webpack_require__) {

	// Thank's IE8 for his funny defineProperty
	module.exports = !__webpack_require__(17)(function () {
	  return Object.defineProperty({}, 'a', { get: function () { return 7; } }).a != 7;
	});


/***/ }),
/* 17 */
/***/ (function(module, exports) {

	module.exports = function (exec) {
	  try {
	    return !!exec();
	  } catch (e) {
	    return true;
	  }
	};


/***/ }),
/* 18 */
/***/ (function(module, exports, __webpack_require__) {

	var isObject = __webpack_require__(14);
	var document = __webpack_require__(7).document;
	// typeof document.createElement is 'object' in old IE
	var is = isObject(document) && isObject(document.createElement);
	module.exports = function (it) {
	  return is ? document.createElement(it) : {};
	};


/***/ }),
/* 19 */
/***/ (function(module, exports, __webpack_require__) {

	// 7.1.1 ToPrimitive(input [, PreferredType])
	var isObject = __webpack_require__(14);
	// instead of the ES6 spec version, we didn't implement @@toPrimitive case
	// and the second argument - flag - preferred type is a string
	module.exports = function (it, S) {
	  if (!isObject(it)) return it;
	  var fn, val;
	  if (S && typeof (fn = it.toString) == 'function' && !isObject(val = fn.call(it))) return val;
	  if (typeof (fn = it.valueOf) == 'function' && !isObject(val = fn.call(it))) return val;
	  if (!S && typeof (fn = it.toString) == 'function' && !isObject(val = fn.call(it))) return val;
	  throw TypeError("Can't convert object to primitive value");
	};


/***/ }),
/* 20 */
/***/ (function(module, exports) {

	module.exports = function (bitmap, value) {
	  return {
	    enumerable: !(bitmap & 1),
	    configurable: !(bitmap & 2),
	    writable: !(bitmap & 4),
	    value: value
	  };
	};


/***/ }),
/* 21 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	// 19.1.2.1 Object.assign(target, source, ...)
	var getKeys = __webpack_require__(22);
	var gOPS = __webpack_require__(37);
	var pIE = __webpack_require__(38);
	var toObject = __webpack_require__(39);
	var IObject = __webpack_require__(26);
	var $assign = Object.assign;

	// should work with symbols and should have deterministic property order (V8 bug)
	module.exports = !$assign || __webpack_require__(17)(function () {
	  var A = {};
	  var B = {};
	  // eslint-disable-next-line no-undef
	  var S = Symbol();
	  var K = 'abcdefghijklmnopqrst';
	  A[S] = 7;
	  K.split('').forEach(function (k) { B[k] = k; });
	  return $assign({}, A)[S] != 7 || Object.keys($assign({}, B)).join('') != K;
	}) ? function assign(target, source) { // eslint-disable-line no-unused-vars
	  var T = toObject(target);
	  var aLen = arguments.length;
	  var index = 1;
	  var getSymbols = gOPS.f;
	  var isEnum = pIE.f;
	  while (aLen > index) {
	    var S = IObject(arguments[index++]);
	    var keys = getSymbols ? getKeys(S).concat(getSymbols(S)) : getKeys(S);
	    var length = keys.length;
	    var j = 0;
	    var key;
	    while (length > j) if (isEnum.call(S, key = keys[j++])) T[key] = S[key];
	  } return T;
	} : $assign;


/***/ }),
/* 22 */
/***/ (function(module, exports, __webpack_require__) {

	// 19.1.2.14 / 15.2.3.14 Object.keys(O)
	var $keys = __webpack_require__(23);
	var enumBugKeys = __webpack_require__(36);

	module.exports = Object.keys || function keys(O) {
	  return $keys(O, enumBugKeys);
	};


/***/ }),
/* 23 */
/***/ (function(module, exports, __webpack_require__) {

	var has = __webpack_require__(24);
	var toIObject = __webpack_require__(25);
	var arrayIndexOf = __webpack_require__(29)(false);
	var IE_PROTO = __webpack_require__(33)('IE_PROTO');

	module.exports = function (object, names) {
	  var O = toIObject(object);
	  var i = 0;
	  var result = [];
	  var key;
	  for (key in O) if (key != IE_PROTO) has(O, key) && result.push(key);
	  // Don't enum bug & hidden keys
	  while (names.length > i) if (has(O, key = names[i++])) {
	    ~arrayIndexOf(result, key) || result.push(key);
	  }
	  return result;
	};


/***/ }),
/* 24 */
/***/ (function(module, exports) {

	var hasOwnProperty = {}.hasOwnProperty;
	module.exports = function (it, key) {
	  return hasOwnProperty.call(it, key);
	};


/***/ }),
/* 25 */
/***/ (function(module, exports, __webpack_require__) {

	// to indexed object, toObject with fallback for non-array-like ES3 strings
	var IObject = __webpack_require__(26);
	var defined = __webpack_require__(28);
	module.exports = function (it) {
	  return IObject(defined(it));
	};


/***/ }),
/* 26 */
/***/ (function(module, exports, __webpack_require__) {

	// fallback for non-array-like ES3 and non-enumerable old V8 strings
	var cof = __webpack_require__(27);
	// eslint-disable-next-line no-prototype-builtins
	module.exports = Object('z').propertyIsEnumerable(0) ? Object : function (it) {
	  return cof(it) == 'String' ? it.split('') : Object(it);
	};


/***/ }),
/* 27 */
/***/ (function(module, exports) {

	var toString = {}.toString;

	module.exports = function (it) {
	  return toString.call(it).slice(8, -1);
	};


/***/ }),
/* 28 */
/***/ (function(module, exports) {

	// 7.2.1 RequireObjectCoercible(argument)
	module.exports = function (it) {
	  if (it == undefined) throw TypeError("Can't call method on  " + it);
	  return it;
	};


/***/ }),
/* 29 */
/***/ (function(module, exports, __webpack_require__) {

	// false -> Array#indexOf
	// true  -> Array#includes
	var toIObject = __webpack_require__(25);
	var toLength = __webpack_require__(30);
	var toAbsoluteIndex = __webpack_require__(32);
	module.exports = function (IS_INCLUDES) {
	  return function ($this, el, fromIndex) {
	    var O = toIObject($this);
	    var length = toLength(O.length);
	    var index = toAbsoluteIndex(fromIndex, length);
	    var value;
	    // Array#includes uses SameValueZero equality algorithm
	    // eslint-disable-next-line no-self-compare
	    if (IS_INCLUDES && el != el) while (length > index) {
	      value = O[index++];
	      // eslint-disable-next-line no-self-compare
	      if (value != value) return true;
	    // Array#indexOf ignores holes, Array#includes - not
	    } else for (;length > index; index++) if (IS_INCLUDES || index in O) {
	      if (O[index] === el) return IS_INCLUDES || index || 0;
	    } return !IS_INCLUDES && -1;
	  };
	};


/***/ }),
/* 30 */
/***/ (function(module, exports, __webpack_require__) {

	// 7.1.15 ToLength
	var toInteger = __webpack_require__(31);
	var min = Math.min;
	module.exports = function (it) {
	  return it > 0 ? min(toInteger(it), 0x1fffffffffffff) : 0; // pow(2, 53) - 1 == 9007199254740991
	};


/***/ }),
/* 31 */
/***/ (function(module, exports) {

	// 7.1.4 ToInteger
	var ceil = Math.ceil;
	var floor = Math.floor;
	module.exports = function (it) {
	  return isNaN(it = +it) ? 0 : (it > 0 ? floor : ceil)(it);
	};


/***/ }),
/* 32 */
/***/ (function(module, exports, __webpack_require__) {

	var toInteger = __webpack_require__(31);
	var max = Math.max;
	var min = Math.min;
	module.exports = function (index, length) {
	  index = toInteger(index);
	  return index < 0 ? max(index + length, 0) : min(index, length);
	};


/***/ }),
/* 33 */
/***/ (function(module, exports, __webpack_require__) {

	var shared = __webpack_require__(34)('keys');
	var uid = __webpack_require__(35);
	module.exports = function (key) {
	  return shared[key] || (shared[key] = uid(key));
	};


/***/ }),
/* 34 */
/***/ (function(module, exports, __webpack_require__) {

	var global = __webpack_require__(7);
	var SHARED = '__core-js_shared__';
	var store = global[SHARED] || (global[SHARED] = {});
	module.exports = function (key) {
	  return store[key] || (store[key] = {});
	};


/***/ }),
/* 35 */
/***/ (function(module, exports) {

	var id = 0;
	var px = Math.random();
	module.exports = function (key) {
	  return 'Symbol('.concat(key === undefined ? '' : key, ')_', (++id + px).toString(36));
	};


/***/ }),
/* 36 */
/***/ (function(module, exports) {

	// IE 8- don't enum bug keys
	module.exports = (
	  'constructor,hasOwnProperty,isPrototypeOf,propertyIsEnumerable,toLocaleString,toString,valueOf'
	).split(',');


/***/ }),
/* 37 */
/***/ (function(module, exports) {

	exports.f = Object.getOwnPropertySymbols;


/***/ }),
/* 38 */
/***/ (function(module, exports) {

	exports.f = {}.propertyIsEnumerable;


/***/ }),
/* 39 */
/***/ (function(module, exports, __webpack_require__) {

	// 7.1.13 ToObject(argument)
	var defined = __webpack_require__(28);
	module.exports = function (it) {
	  return Object(defined(it));
	};


/***/ }),
/* 40 */
/***/ (function(module, exports) {

	"use strict";

	exports.__esModule = true;

	exports.default = function (instance, Constructor) {
	  if (!(instance instanceof Constructor)) {
	    throw new TypeError("Cannot call a class as a function");
	  }
	};

/***/ }),
/* 41 */
/***/ (function(module, exports, __webpack_require__) {

	"use strict";

	exports.__esModule = true;

	var _defineProperty = __webpack_require__(42);

	var _defineProperty2 = _interopRequireDefault(_defineProperty);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	exports.default = function () {
	  function defineProperties(target, props) {
	    for (var i = 0; i < props.length; i++) {
	      var descriptor = props[i];
	      descriptor.enumerable = descriptor.enumerable || false;
	      descriptor.configurable = true;
	      if ("value" in descriptor) descriptor.writable = true;
	      (0, _defineProperty2.default)(target, descriptor.key, descriptor);
	    }
	  }

	  return function (Constructor, protoProps, staticProps) {
	    if (protoProps) defineProperties(Constructor.prototype, protoProps);
	    if (staticProps) defineProperties(Constructor, staticProps);
	    return Constructor;
	  };
	}();

/***/ }),
/* 42 */
/***/ (function(module, exports, __webpack_require__) {

	module.exports = { "default": __webpack_require__(43), __esModule: true };

/***/ }),
/* 43 */
/***/ (function(module, exports, __webpack_require__) {

	__webpack_require__(44);
	var $Object = __webpack_require__(8).Object;
	module.exports = function defineProperty(it, key, desc) {
	  return $Object.defineProperty(it, key, desc);
	};


/***/ }),
/* 44 */
/***/ (function(module, exports, __webpack_require__) {

	var $export = __webpack_require__(6);
	// 19.1.2.4 / 15.2.3.6 Object.defineProperty(O, P, Attributes)
	$export($export.S + $export.F * !__webpack_require__(16), 'Object', { defineProperty: __webpack_require__(12).f });


/***/ }),
/* 45 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _typeof2 = __webpack_require__(46);

	var _typeof3 = _interopRequireDefault(_typeof2);

	var _classCallCheck2 = __webpack_require__(40);

	var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

	var _createClass2 = __webpack_require__(41);

	var _createClass3 = _interopRequireDefault(_createClass2);

	var _utils = __webpack_require__(80);

	var _dispatch = __webpack_require__(81);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	/**
	 * --------------------------------------------------------------------------
	 * Licensed under MIT (https://github.com/quark-dev/Phonon-Framework/blob/master/LICENSE)
	 * --------------------------------------------------------------------------
	 */

	var Page = function () {
	  /**
	   * ------------------------------------------------------------------------
	   * Constants
	   * ------------------------------------------------------------------------
	   */

	  var NAME = 'page';
	  var VERSION = '2.0.0';

	  var TEMPLATE_SELECTOR = '[data-template]';

	  /**
	   * ------------------------------------------------------------------------
	   * Class Definition
	   * ------------------------------------------------------------------------
	   */

	  var Page = function () {
	    /**
	     * Creates an instance of Page.
	     * @param {string} pageName
	     */
	    function Page(pageName) {
	      (0, _classCallCheck3.default)(this, Page);

	      this.name = pageName;
	      this.events = [];
	      this.templatePath = null;
	      this.renderFunction = null;
	    }

	    // getters

	    (0, _createClass3.default)(Page, [{
	      key: 'getEvents',


	      /**
	       * Get events
	       * @returns {Function[]}
	       */
	      value: function getEvents() {
	        return this.events;
	      }

	      /**
	       * Get template
	       * @returns {string}
	       */

	    }, {
	      key: 'getTemplate',
	      value: function getTemplate() {
	        return this.templatePath;
	      }

	      /**
	       * Get render function
	       * @returns {Function}
	       */

	    }, {
	      key: 'getRenderFunction',
	      value: function getRenderFunction() {
	        return this.renderFunction;
	      }
	    }, {
	      key: 'loadTemplate',
	      value: function loadTemplate() {
	        var _this = this;

	        var pageElement = document.querySelector('[data-page="' + this.name + '"]');

	        (0, _utils.loadFile)(this.getTemplate(), function (template) {
	          var render = function render(DOMPage, template, elements) {
	            if (elements) {
	              elements.forEach(function (el) {
	                el.innerHTML = template;
	              });
	            } else {
	              DOMPage.innerHTML = template;
	            }
	          };

	          if (_this.getRenderFunction()) {
	            render = _this.getRenderFunction();
	          }

	          render(pageElement, template, pageElement.querySelectorAll(TEMPLATE_SELECTOR));
	        }, null);
	      }

	      // public

	      /**
	       *
	       * @param {*} callbackFn
	       */

	    }, {
	      key: 'addEventCallback',
	      value: function addEventCallback(callbackFn) {
	        this.events.push(callbackFn);
	      }

	      /**
	       * Use the given template
	       *
	       * @param {string} templatePath
	       */

	    }, {
	      key: 'useTemplate',
	      value: function useTemplate(templatePath) {
	        if (typeof templatePath !== 'string') {
	          throw new Error('The template path must be a string. ' + (typeof templatePath === 'undefined' ? 'undefined' : (0, _typeof3.default)(templatePath)) + ' is given');
	        }
	        this.templatePath = templatePath;
	      }

	      /**
	       * Use the given template renderer
	       * @param {Function} renderFunction
	       */

	    }, {
	      key: 'useTemplateRenderer',
	      value: function useTemplateRenderer(renderFunction) {
	        if (typeof renderFunction !== 'function') {
	          throw new Error('The custom template renderer must be a function. ' + (typeof renderFunction === 'undefined' ? 'undefined' : (0, _typeof3.default)(renderFunction)) + ' is given');
	        }
	        this.renderFunction = renderFunction;
	      }

	      /**
	       * Trigger scopes
	       * @param {string} eventName
	       * @param {{}} [eventParams={}]
	       */

	    }, {
	      key: 'triggerScopes',
	      value: function triggerScopes(eventName) {
	        var _this2 = this;

	        var eventParams = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

	        var eventNameAlias = 'on' + eventName.charAt(0).toUpperCase() + eventName.slice(1);

	        this.events.forEach(function (scope) {
	          var scopeEvent = scope[eventName];
	          var scopeEventAlias = scope[eventNameAlias];
	          if (typeof scopeEvent === 'function') {
	            scopeEvent.apply(_this2, eventParams);
	          }

	          // trigger the event alias
	          if (typeof scopeEventAlias === 'function') {
	            scopeEventAlias.apply(_this2, eventParams);
	          }
	        });

	        (0, _dispatch.dispatchPageEvent)(eventName, this.name, eventParams);
	      }
	    }], [{
	      key: 'version',
	      get: function get() {
	        return NAME + '.' + VERSION;
	      }
	    }]);
	    return Page;
	  }();

	  return Page;
	}();

	exports.default = Page;

/***/ }),
/* 46 */
/***/ (function(module, exports, __webpack_require__) {

	"use strict";

	exports.__esModule = true;

	var _iterator = __webpack_require__(47);

	var _iterator2 = _interopRequireDefault(_iterator);

	var _symbol = __webpack_require__(67);

	var _symbol2 = _interopRequireDefault(_symbol);

	var _typeof = typeof _symbol2.default === "function" && typeof _iterator2.default === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof _symbol2.default === "function" && obj.constructor === _symbol2.default && obj !== _symbol2.default.prototype ? "symbol" : typeof obj; };

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	exports.default = typeof _symbol2.default === "function" && _typeof(_iterator2.default) === "symbol" ? function (obj) {
	  return typeof obj === "undefined" ? "undefined" : _typeof(obj);
	} : function (obj) {
	  return obj && typeof _symbol2.default === "function" && obj.constructor === _symbol2.default && obj !== _symbol2.default.prototype ? "symbol" : typeof obj === "undefined" ? "undefined" : _typeof(obj);
	};

/***/ }),
/* 47 */
/***/ (function(module, exports, __webpack_require__) {

	module.exports = { "default": __webpack_require__(48), __esModule: true };

/***/ }),
/* 48 */
/***/ (function(module, exports, __webpack_require__) {

	__webpack_require__(49);
	__webpack_require__(62);
	module.exports = __webpack_require__(66).f('iterator');


/***/ }),
/* 49 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	var $at = __webpack_require__(50)(true);

	// 21.1.3.27 String.prototype[@@iterator]()
	__webpack_require__(51)(String, 'String', function (iterated) {
	  this._t = String(iterated); // target
	  this._i = 0;                // next index
	// 21.1.5.2.1 %StringIteratorPrototype%.next()
	}, function () {
	  var O = this._t;
	  var index = this._i;
	  var point;
	  if (index >= O.length) return { value: undefined, done: true };
	  point = $at(O, index);
	  this._i += point.length;
	  return { value: point, done: false };
	});


/***/ }),
/* 50 */
/***/ (function(module, exports, __webpack_require__) {

	var toInteger = __webpack_require__(31);
	var defined = __webpack_require__(28);
	// true  -> String#at
	// false -> String#codePointAt
	module.exports = function (TO_STRING) {
	  return function (that, pos) {
	    var s = String(defined(that));
	    var i = toInteger(pos);
	    var l = s.length;
	    var a, b;
	    if (i < 0 || i >= l) return TO_STRING ? '' : undefined;
	    a = s.charCodeAt(i);
	    return a < 0xd800 || a > 0xdbff || i + 1 === l || (b = s.charCodeAt(i + 1)) < 0xdc00 || b > 0xdfff
	      ? TO_STRING ? s.charAt(i) : a
	      : TO_STRING ? s.slice(i, i + 2) : (a - 0xd800 << 10) + (b - 0xdc00) + 0x10000;
	  };
	};


/***/ }),
/* 51 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	var LIBRARY = __webpack_require__(52);
	var $export = __webpack_require__(6);
	var redefine = __webpack_require__(53);
	var hide = __webpack_require__(11);
	var has = __webpack_require__(24);
	var Iterators = __webpack_require__(54);
	var $iterCreate = __webpack_require__(55);
	var setToStringTag = __webpack_require__(59);
	var getPrototypeOf = __webpack_require__(61);
	var ITERATOR = __webpack_require__(60)('iterator');
	var BUGGY = !([].keys && 'next' in [].keys()); // Safari has buggy iterators w/o `next`
	var FF_ITERATOR = '@@iterator';
	var KEYS = 'keys';
	var VALUES = 'values';

	var returnThis = function () { return this; };

	module.exports = function (Base, NAME, Constructor, next, DEFAULT, IS_SET, FORCED) {
	  $iterCreate(Constructor, NAME, next);
	  var getMethod = function (kind) {
	    if (!BUGGY && kind in proto) return proto[kind];
	    switch (kind) {
	      case KEYS: return function keys() { return new Constructor(this, kind); };
	      case VALUES: return function values() { return new Constructor(this, kind); };
	    } return function entries() { return new Constructor(this, kind); };
	  };
	  var TAG = NAME + ' Iterator';
	  var DEF_VALUES = DEFAULT == VALUES;
	  var VALUES_BUG = false;
	  var proto = Base.prototype;
	  var $native = proto[ITERATOR] || proto[FF_ITERATOR] || DEFAULT && proto[DEFAULT];
	  var $default = $native || getMethod(DEFAULT);
	  var $entries = DEFAULT ? !DEF_VALUES ? $default : getMethod('entries') : undefined;
	  var $anyNative = NAME == 'Array' ? proto.entries || $native : $native;
	  var methods, key, IteratorPrototype;
	  // Fix native
	  if ($anyNative) {
	    IteratorPrototype = getPrototypeOf($anyNative.call(new Base()));
	    if (IteratorPrototype !== Object.prototype && IteratorPrototype.next) {
	      // Set @@toStringTag to native iterators
	      setToStringTag(IteratorPrototype, TAG, true);
	      // fix for some old engines
	      if (!LIBRARY && !has(IteratorPrototype, ITERATOR)) hide(IteratorPrototype, ITERATOR, returnThis);
	    }
	  }
	  // fix Array#{values, @@iterator}.name in V8 / FF
	  if (DEF_VALUES && $native && $native.name !== VALUES) {
	    VALUES_BUG = true;
	    $default = function values() { return $native.call(this); };
	  }
	  // Define iterator
	  if ((!LIBRARY || FORCED) && (BUGGY || VALUES_BUG || !proto[ITERATOR])) {
	    hide(proto, ITERATOR, $default);
	  }
	  // Plug for library
	  Iterators[NAME] = $default;
	  Iterators[TAG] = returnThis;
	  if (DEFAULT) {
	    methods = {
	      values: DEF_VALUES ? $default : getMethod(VALUES),
	      keys: IS_SET ? $default : getMethod(KEYS),
	      entries: $entries
	    };
	    if (FORCED) for (key in methods) {
	      if (!(key in proto)) redefine(proto, key, methods[key]);
	    } else $export($export.P + $export.F * (BUGGY || VALUES_BUG), NAME, methods);
	  }
	  return methods;
	};


/***/ }),
/* 52 */
/***/ (function(module, exports) {

	module.exports = true;


/***/ }),
/* 53 */
/***/ (function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__(11);


/***/ }),
/* 54 */
/***/ (function(module, exports) {

	module.exports = {};


/***/ }),
/* 55 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	var create = __webpack_require__(56);
	var descriptor = __webpack_require__(20);
	var setToStringTag = __webpack_require__(59);
	var IteratorPrototype = {};

	// 25.1.2.1.1 %IteratorPrototype%[@@iterator]()
	__webpack_require__(11)(IteratorPrototype, __webpack_require__(60)('iterator'), function () { return this; });

	module.exports = function (Constructor, NAME, next) {
	  Constructor.prototype = create(IteratorPrototype, { next: descriptor(1, next) });
	  setToStringTag(Constructor, NAME + ' Iterator');
	};


/***/ }),
/* 56 */
/***/ (function(module, exports, __webpack_require__) {

	// 19.1.2.2 / 15.2.3.5 Object.create(O [, Properties])
	var anObject = __webpack_require__(13);
	var dPs = __webpack_require__(57);
	var enumBugKeys = __webpack_require__(36);
	var IE_PROTO = __webpack_require__(33)('IE_PROTO');
	var Empty = function () { /* empty */ };
	var PROTOTYPE = 'prototype';

	// Create object with fake `null` prototype: use iframe Object with cleared prototype
	var createDict = function () {
	  // Thrash, waste and sodomy: IE GC bug
	  var iframe = __webpack_require__(18)('iframe');
	  var i = enumBugKeys.length;
	  var lt = '<';
	  var gt = '>';
	  var iframeDocument;
	  iframe.style.display = 'none';
	  __webpack_require__(58).appendChild(iframe);
	  iframe.src = 'javascript:'; // eslint-disable-line no-script-url
	  // createDict = iframe.contentWindow.Object;
	  // html.removeChild(iframe);
	  iframeDocument = iframe.contentWindow.document;
	  iframeDocument.open();
	  iframeDocument.write(lt + 'script' + gt + 'document.F=Object' + lt + '/script' + gt);
	  iframeDocument.close();
	  createDict = iframeDocument.F;
	  while (i--) delete createDict[PROTOTYPE][enumBugKeys[i]];
	  return createDict();
	};

	module.exports = Object.create || function create(O, Properties) {
	  var result;
	  if (O !== null) {
	    Empty[PROTOTYPE] = anObject(O);
	    result = new Empty();
	    Empty[PROTOTYPE] = null;
	    // add "__proto__" for Object.getPrototypeOf polyfill
	    result[IE_PROTO] = O;
	  } else result = createDict();
	  return Properties === undefined ? result : dPs(result, Properties);
	};


/***/ }),
/* 57 */
/***/ (function(module, exports, __webpack_require__) {

	var dP = __webpack_require__(12);
	var anObject = __webpack_require__(13);
	var getKeys = __webpack_require__(22);

	module.exports = __webpack_require__(16) ? Object.defineProperties : function defineProperties(O, Properties) {
	  anObject(O);
	  var keys = getKeys(Properties);
	  var length = keys.length;
	  var i = 0;
	  var P;
	  while (length > i) dP.f(O, P = keys[i++], Properties[P]);
	  return O;
	};


/***/ }),
/* 58 */
/***/ (function(module, exports, __webpack_require__) {

	var document = __webpack_require__(7).document;
	module.exports = document && document.documentElement;


/***/ }),
/* 59 */
/***/ (function(module, exports, __webpack_require__) {

	var def = __webpack_require__(12).f;
	var has = __webpack_require__(24);
	var TAG = __webpack_require__(60)('toStringTag');

	module.exports = function (it, tag, stat) {
	  if (it && !has(it = stat ? it : it.prototype, TAG)) def(it, TAG, { configurable: true, value: tag });
	};


/***/ }),
/* 60 */
/***/ (function(module, exports, __webpack_require__) {

	var store = __webpack_require__(34)('wks');
	var uid = __webpack_require__(35);
	var Symbol = __webpack_require__(7).Symbol;
	var USE_SYMBOL = typeof Symbol == 'function';

	var $exports = module.exports = function (name) {
	  return store[name] || (store[name] =
	    USE_SYMBOL && Symbol[name] || (USE_SYMBOL ? Symbol : uid)('Symbol.' + name));
	};

	$exports.store = store;


/***/ }),
/* 61 */
/***/ (function(module, exports, __webpack_require__) {

	// 19.1.2.9 / 15.2.3.2 Object.getPrototypeOf(O)
	var has = __webpack_require__(24);
	var toObject = __webpack_require__(39);
	var IE_PROTO = __webpack_require__(33)('IE_PROTO');
	var ObjectProto = Object.prototype;

	module.exports = Object.getPrototypeOf || function (O) {
	  O = toObject(O);
	  if (has(O, IE_PROTO)) return O[IE_PROTO];
	  if (typeof O.constructor == 'function' && O instanceof O.constructor) {
	    return O.constructor.prototype;
	  } return O instanceof Object ? ObjectProto : null;
	};


/***/ }),
/* 62 */
/***/ (function(module, exports, __webpack_require__) {

	__webpack_require__(63);
	var global = __webpack_require__(7);
	var hide = __webpack_require__(11);
	var Iterators = __webpack_require__(54);
	var TO_STRING_TAG = __webpack_require__(60)('toStringTag');

	var DOMIterables = ('CSSRuleList,CSSStyleDeclaration,CSSValueList,ClientRectList,DOMRectList,DOMStringList,' +
	  'DOMTokenList,DataTransferItemList,FileList,HTMLAllCollection,HTMLCollection,HTMLFormElement,HTMLSelectElement,' +
	  'MediaList,MimeTypeArray,NamedNodeMap,NodeList,PaintRequestList,Plugin,PluginArray,SVGLengthList,SVGNumberList,' +
	  'SVGPathSegList,SVGPointList,SVGStringList,SVGTransformList,SourceBufferList,StyleSheetList,TextTrackCueList,' +
	  'TextTrackList,TouchList').split(',');

	for (var i = 0; i < DOMIterables.length; i++) {
	  var NAME = DOMIterables[i];
	  var Collection = global[NAME];
	  var proto = Collection && Collection.prototype;
	  if (proto && !proto[TO_STRING_TAG]) hide(proto, TO_STRING_TAG, NAME);
	  Iterators[NAME] = Iterators.Array;
	}


/***/ }),
/* 63 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	var addToUnscopables = __webpack_require__(64);
	var step = __webpack_require__(65);
	var Iterators = __webpack_require__(54);
	var toIObject = __webpack_require__(25);

	// 22.1.3.4 Array.prototype.entries()
	// 22.1.3.13 Array.prototype.keys()
	// 22.1.3.29 Array.prototype.values()
	// 22.1.3.30 Array.prototype[@@iterator]()
	module.exports = __webpack_require__(51)(Array, 'Array', function (iterated, kind) {
	  this._t = toIObject(iterated); // target
	  this._i = 0;                   // next index
	  this._k = kind;                // kind
	// 22.1.5.2.1 %ArrayIteratorPrototype%.next()
	}, function () {
	  var O = this._t;
	  var kind = this._k;
	  var index = this._i++;
	  if (!O || index >= O.length) {
	    this._t = undefined;
	    return step(1);
	  }
	  if (kind == 'keys') return step(0, index);
	  if (kind == 'values') return step(0, O[index]);
	  return step(0, [index, O[index]]);
	}, 'values');

	// argumentsList[@@iterator] is %ArrayProto_values% (9.4.4.6, 9.4.4.7)
	Iterators.Arguments = Iterators.Array;

	addToUnscopables('keys');
	addToUnscopables('values');
	addToUnscopables('entries');


/***/ }),
/* 64 */
/***/ (function(module, exports) {

	module.exports = function () { /* empty */ };


/***/ }),
/* 65 */
/***/ (function(module, exports) {

	module.exports = function (done, value) {
	  return { value: value, done: !!done };
	};


/***/ }),
/* 66 */
/***/ (function(module, exports, __webpack_require__) {

	exports.f = __webpack_require__(60);


/***/ }),
/* 67 */
/***/ (function(module, exports, __webpack_require__) {

	module.exports = { "default": __webpack_require__(68), __esModule: true };

/***/ }),
/* 68 */
/***/ (function(module, exports, __webpack_require__) {

	__webpack_require__(69);
	__webpack_require__(77);
	__webpack_require__(78);
	__webpack_require__(79);
	module.exports = __webpack_require__(8).Symbol;


/***/ }),
/* 69 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	// ECMAScript 6 symbols shim
	var global = __webpack_require__(7);
	var has = __webpack_require__(24);
	var DESCRIPTORS = __webpack_require__(16);
	var $export = __webpack_require__(6);
	var redefine = __webpack_require__(53);
	var META = __webpack_require__(70).KEY;
	var $fails = __webpack_require__(17);
	var shared = __webpack_require__(34);
	var setToStringTag = __webpack_require__(59);
	var uid = __webpack_require__(35);
	var wks = __webpack_require__(60);
	var wksExt = __webpack_require__(66);
	var wksDefine = __webpack_require__(71);
	var enumKeys = __webpack_require__(72);
	var isArray = __webpack_require__(73);
	var anObject = __webpack_require__(13);
	var toIObject = __webpack_require__(25);
	var toPrimitive = __webpack_require__(19);
	var createDesc = __webpack_require__(20);
	var _create = __webpack_require__(56);
	var gOPNExt = __webpack_require__(74);
	var $GOPD = __webpack_require__(76);
	var $DP = __webpack_require__(12);
	var $keys = __webpack_require__(22);
	var gOPD = $GOPD.f;
	var dP = $DP.f;
	var gOPN = gOPNExt.f;
	var $Symbol = global.Symbol;
	var $JSON = global.JSON;
	var _stringify = $JSON && $JSON.stringify;
	var PROTOTYPE = 'prototype';
	var HIDDEN = wks('_hidden');
	var TO_PRIMITIVE = wks('toPrimitive');
	var isEnum = {}.propertyIsEnumerable;
	var SymbolRegistry = shared('symbol-registry');
	var AllSymbols = shared('symbols');
	var OPSymbols = shared('op-symbols');
	var ObjectProto = Object[PROTOTYPE];
	var USE_NATIVE = typeof $Symbol == 'function';
	var QObject = global.QObject;
	// Don't use setters in Qt Script, https://github.com/zloirock/core-js/issues/173
	var setter = !QObject || !QObject[PROTOTYPE] || !QObject[PROTOTYPE].findChild;

	// fallback for old Android, https://code.google.com/p/v8/issues/detail?id=687
	var setSymbolDesc = DESCRIPTORS && $fails(function () {
	  return _create(dP({}, 'a', {
	    get: function () { return dP(this, 'a', { value: 7 }).a; }
	  })).a != 7;
	}) ? function (it, key, D) {
	  var protoDesc = gOPD(ObjectProto, key);
	  if (protoDesc) delete ObjectProto[key];
	  dP(it, key, D);
	  if (protoDesc && it !== ObjectProto) dP(ObjectProto, key, protoDesc);
	} : dP;

	var wrap = function (tag) {
	  var sym = AllSymbols[tag] = _create($Symbol[PROTOTYPE]);
	  sym._k = tag;
	  return sym;
	};

	var isSymbol = USE_NATIVE && typeof $Symbol.iterator == 'symbol' ? function (it) {
	  return typeof it == 'symbol';
	} : function (it) {
	  return it instanceof $Symbol;
	};

	var $defineProperty = function defineProperty(it, key, D) {
	  if (it === ObjectProto) $defineProperty(OPSymbols, key, D);
	  anObject(it);
	  key = toPrimitive(key, true);
	  anObject(D);
	  if (has(AllSymbols, key)) {
	    if (!D.enumerable) {
	      if (!has(it, HIDDEN)) dP(it, HIDDEN, createDesc(1, {}));
	      it[HIDDEN][key] = true;
	    } else {
	      if (has(it, HIDDEN) && it[HIDDEN][key]) it[HIDDEN][key] = false;
	      D = _create(D, { enumerable: createDesc(0, false) });
	    } return setSymbolDesc(it, key, D);
	  } return dP(it, key, D);
	};
	var $defineProperties = function defineProperties(it, P) {
	  anObject(it);
	  var keys = enumKeys(P = toIObject(P));
	  var i = 0;
	  var l = keys.length;
	  var key;
	  while (l > i) $defineProperty(it, key = keys[i++], P[key]);
	  return it;
	};
	var $create = function create(it, P) {
	  return P === undefined ? _create(it) : $defineProperties(_create(it), P);
	};
	var $propertyIsEnumerable = function propertyIsEnumerable(key) {
	  var E = isEnum.call(this, key = toPrimitive(key, true));
	  if (this === ObjectProto && has(AllSymbols, key) && !has(OPSymbols, key)) return false;
	  return E || !has(this, key) || !has(AllSymbols, key) || has(this, HIDDEN) && this[HIDDEN][key] ? E : true;
	};
	var $getOwnPropertyDescriptor = function getOwnPropertyDescriptor(it, key) {
	  it = toIObject(it);
	  key = toPrimitive(key, true);
	  if (it === ObjectProto && has(AllSymbols, key) && !has(OPSymbols, key)) return;
	  var D = gOPD(it, key);
	  if (D && has(AllSymbols, key) && !(has(it, HIDDEN) && it[HIDDEN][key])) D.enumerable = true;
	  return D;
	};
	var $getOwnPropertyNames = function getOwnPropertyNames(it) {
	  var names = gOPN(toIObject(it));
	  var result = [];
	  var i = 0;
	  var key;
	  while (names.length > i) {
	    if (!has(AllSymbols, key = names[i++]) && key != HIDDEN && key != META) result.push(key);
	  } return result;
	};
	var $getOwnPropertySymbols = function getOwnPropertySymbols(it) {
	  var IS_OP = it === ObjectProto;
	  var names = gOPN(IS_OP ? OPSymbols : toIObject(it));
	  var result = [];
	  var i = 0;
	  var key;
	  while (names.length > i) {
	    if (has(AllSymbols, key = names[i++]) && (IS_OP ? has(ObjectProto, key) : true)) result.push(AllSymbols[key]);
	  } return result;
	};

	// 19.4.1.1 Symbol([description])
	if (!USE_NATIVE) {
	  $Symbol = function Symbol() {
	    if (this instanceof $Symbol) throw TypeError('Symbol is not a constructor!');
	    var tag = uid(arguments.length > 0 ? arguments[0] : undefined);
	    var $set = function (value) {
	      if (this === ObjectProto) $set.call(OPSymbols, value);
	      if (has(this, HIDDEN) && has(this[HIDDEN], tag)) this[HIDDEN][tag] = false;
	      setSymbolDesc(this, tag, createDesc(1, value));
	    };
	    if (DESCRIPTORS && setter) setSymbolDesc(ObjectProto, tag, { configurable: true, set: $set });
	    return wrap(tag);
	  };
	  redefine($Symbol[PROTOTYPE], 'toString', function toString() {
	    return this._k;
	  });

	  $GOPD.f = $getOwnPropertyDescriptor;
	  $DP.f = $defineProperty;
	  __webpack_require__(75).f = gOPNExt.f = $getOwnPropertyNames;
	  __webpack_require__(38).f = $propertyIsEnumerable;
	  __webpack_require__(37).f = $getOwnPropertySymbols;

	  if (DESCRIPTORS && !__webpack_require__(52)) {
	    redefine(ObjectProto, 'propertyIsEnumerable', $propertyIsEnumerable, true);
	  }

	  wksExt.f = function (name) {
	    return wrap(wks(name));
	  };
	}

	$export($export.G + $export.W + $export.F * !USE_NATIVE, { Symbol: $Symbol });

	for (var es6Symbols = (
	  // 19.4.2.2, 19.4.2.3, 19.4.2.4, 19.4.2.6, 19.4.2.8, 19.4.2.9, 19.4.2.10, 19.4.2.11, 19.4.2.12, 19.4.2.13, 19.4.2.14
	  'hasInstance,isConcatSpreadable,iterator,match,replace,search,species,split,toPrimitive,toStringTag,unscopables'
	).split(','), j = 0; es6Symbols.length > j;)wks(es6Symbols[j++]);

	for (var wellKnownSymbols = $keys(wks.store), k = 0; wellKnownSymbols.length > k;) wksDefine(wellKnownSymbols[k++]);

	$export($export.S + $export.F * !USE_NATIVE, 'Symbol', {
	  // 19.4.2.1 Symbol.for(key)
	  'for': function (key) {
	    return has(SymbolRegistry, key += '')
	      ? SymbolRegistry[key]
	      : SymbolRegistry[key] = $Symbol(key);
	  },
	  // 19.4.2.5 Symbol.keyFor(sym)
	  keyFor: function keyFor(sym) {
	    if (!isSymbol(sym)) throw TypeError(sym + ' is not a symbol!');
	    for (var key in SymbolRegistry) if (SymbolRegistry[key] === sym) return key;
	  },
	  useSetter: function () { setter = true; },
	  useSimple: function () { setter = false; }
	});

	$export($export.S + $export.F * !USE_NATIVE, 'Object', {
	  // 19.1.2.2 Object.create(O [, Properties])
	  create: $create,
	  // 19.1.2.4 Object.defineProperty(O, P, Attributes)
	  defineProperty: $defineProperty,
	  // 19.1.2.3 Object.defineProperties(O, Properties)
	  defineProperties: $defineProperties,
	  // 19.1.2.6 Object.getOwnPropertyDescriptor(O, P)
	  getOwnPropertyDescriptor: $getOwnPropertyDescriptor,
	  // 19.1.2.7 Object.getOwnPropertyNames(O)
	  getOwnPropertyNames: $getOwnPropertyNames,
	  // 19.1.2.8 Object.getOwnPropertySymbols(O)
	  getOwnPropertySymbols: $getOwnPropertySymbols
	});

	// 24.3.2 JSON.stringify(value [, replacer [, space]])
	$JSON && $export($export.S + $export.F * (!USE_NATIVE || $fails(function () {
	  var S = $Symbol();
	  // MS Edge converts symbol values to JSON as {}
	  // WebKit converts symbol values to JSON as null
	  // V8 throws on boxed symbols
	  return _stringify([S]) != '[null]' || _stringify({ a: S }) != '{}' || _stringify(Object(S)) != '{}';
	})), 'JSON', {
	  stringify: function stringify(it) {
	    if (it === undefined || isSymbol(it)) return; // IE8 returns string on undefined
	    var args = [it];
	    var i = 1;
	    var replacer, $replacer;
	    while (arguments.length > i) args.push(arguments[i++]);
	    replacer = args[1];
	    if (typeof replacer == 'function') $replacer = replacer;
	    if ($replacer || !isArray(replacer)) replacer = function (key, value) {
	      if ($replacer) value = $replacer.call(this, key, value);
	      if (!isSymbol(value)) return value;
	    };
	    args[1] = replacer;
	    return _stringify.apply($JSON, args);
	  }
	});

	// 19.4.3.4 Symbol.prototype[@@toPrimitive](hint)
	$Symbol[PROTOTYPE][TO_PRIMITIVE] || __webpack_require__(11)($Symbol[PROTOTYPE], TO_PRIMITIVE, $Symbol[PROTOTYPE].valueOf);
	// 19.4.3.5 Symbol.prototype[@@toStringTag]
	setToStringTag($Symbol, 'Symbol');
	// 20.2.1.9 Math[@@toStringTag]
	setToStringTag(Math, 'Math', true);
	// 24.3.3 JSON[@@toStringTag]
	setToStringTag(global.JSON, 'JSON', true);


/***/ }),
/* 70 */
/***/ (function(module, exports, __webpack_require__) {

	var META = __webpack_require__(35)('meta');
	var isObject = __webpack_require__(14);
	var has = __webpack_require__(24);
	var setDesc = __webpack_require__(12).f;
	var id = 0;
	var isExtensible = Object.isExtensible || function () {
	  return true;
	};
	var FREEZE = !__webpack_require__(17)(function () {
	  return isExtensible(Object.preventExtensions({}));
	});
	var setMeta = function (it) {
	  setDesc(it, META, { value: {
	    i: 'O' + ++id, // object ID
	    w: {}          // weak collections IDs
	  } });
	};
	var fastKey = function (it, create) {
	  // return primitive with prefix
	  if (!isObject(it)) return typeof it == 'symbol' ? it : (typeof it == 'string' ? 'S' : 'P') + it;
	  if (!has(it, META)) {
	    // can't set metadata to uncaught frozen object
	    if (!isExtensible(it)) return 'F';
	    // not necessary to add metadata
	    if (!create) return 'E';
	    // add missing metadata
	    setMeta(it);
	  // return object ID
	  } return it[META].i;
	};
	var getWeak = function (it, create) {
	  if (!has(it, META)) {
	    // can't set metadata to uncaught frozen object
	    if (!isExtensible(it)) return true;
	    // not necessary to add metadata
	    if (!create) return false;
	    // add missing metadata
	    setMeta(it);
	  // return hash weak collections IDs
	  } return it[META].w;
	};
	// add metadata on freeze-family methods calling
	var onFreeze = function (it) {
	  if (FREEZE && meta.NEED && isExtensible(it) && !has(it, META)) setMeta(it);
	  return it;
	};
	var meta = module.exports = {
	  KEY: META,
	  NEED: false,
	  fastKey: fastKey,
	  getWeak: getWeak,
	  onFreeze: onFreeze
	};


/***/ }),
/* 71 */
/***/ (function(module, exports, __webpack_require__) {

	var global = __webpack_require__(7);
	var core = __webpack_require__(8);
	var LIBRARY = __webpack_require__(52);
	var wksExt = __webpack_require__(66);
	var defineProperty = __webpack_require__(12).f;
	module.exports = function (name) {
	  var $Symbol = core.Symbol || (core.Symbol = LIBRARY ? {} : global.Symbol || {});
	  if (name.charAt(0) != '_' && !(name in $Symbol)) defineProperty($Symbol, name, { value: wksExt.f(name) });
	};


/***/ }),
/* 72 */
/***/ (function(module, exports, __webpack_require__) {

	// all enumerable object keys, includes symbols
	var getKeys = __webpack_require__(22);
	var gOPS = __webpack_require__(37);
	var pIE = __webpack_require__(38);
	module.exports = function (it) {
	  var result = getKeys(it);
	  var getSymbols = gOPS.f;
	  if (getSymbols) {
	    var symbols = getSymbols(it);
	    var isEnum = pIE.f;
	    var i = 0;
	    var key;
	    while (symbols.length > i) if (isEnum.call(it, key = symbols[i++])) result.push(key);
	  } return result;
	};


/***/ }),
/* 73 */
/***/ (function(module, exports, __webpack_require__) {

	// 7.2.2 IsArray(argument)
	var cof = __webpack_require__(27);
	module.exports = Array.isArray || function isArray(arg) {
	  return cof(arg) == 'Array';
	};


/***/ }),
/* 74 */
/***/ (function(module, exports, __webpack_require__) {

	// fallback for IE11 buggy Object.getOwnPropertyNames with iframe and window
	var toIObject = __webpack_require__(25);
	var gOPN = __webpack_require__(75).f;
	var toString = {}.toString;

	var windowNames = typeof window == 'object' && window && Object.getOwnPropertyNames
	  ? Object.getOwnPropertyNames(window) : [];

	var getWindowNames = function (it) {
	  try {
	    return gOPN(it);
	  } catch (e) {
	    return windowNames.slice();
	  }
	};

	module.exports.f = function getOwnPropertyNames(it) {
	  return windowNames && toString.call(it) == '[object Window]' ? getWindowNames(it) : gOPN(toIObject(it));
	};


/***/ }),
/* 75 */
/***/ (function(module, exports, __webpack_require__) {

	// 19.1.2.7 / 15.2.3.4 Object.getOwnPropertyNames(O)
	var $keys = __webpack_require__(23);
	var hiddenKeys = __webpack_require__(36).concat('length', 'prototype');

	exports.f = Object.getOwnPropertyNames || function getOwnPropertyNames(O) {
	  return $keys(O, hiddenKeys);
	};


/***/ }),
/* 76 */
/***/ (function(module, exports, __webpack_require__) {

	var pIE = __webpack_require__(38);
	var createDesc = __webpack_require__(20);
	var toIObject = __webpack_require__(25);
	var toPrimitive = __webpack_require__(19);
	var has = __webpack_require__(24);
	var IE8_DOM_DEFINE = __webpack_require__(15);
	var gOPD = Object.getOwnPropertyDescriptor;

	exports.f = __webpack_require__(16) ? gOPD : function getOwnPropertyDescriptor(O, P) {
	  O = toIObject(O);
	  P = toPrimitive(P, true);
	  if (IE8_DOM_DEFINE) try {
	    return gOPD(O, P);
	  } catch (e) { /* empty */ }
	  if (has(O, P)) return createDesc(!pIE.f.call(O, P), O[P]);
	};


/***/ }),
/* 77 */
/***/ (function(module, exports) {

	

/***/ }),
/* 78 */
/***/ (function(module, exports, __webpack_require__) {

	__webpack_require__(71)('asyncIterator');


/***/ }),
/* 79 */
/***/ (function(module, exports, __webpack_require__) {

	__webpack_require__(71)('observable');


/***/ }),
/* 80 */
/***/ (function(module, exports) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.loadFile = loadFile;
	exports.generateId = generateId;
	function loadFile(url, fn, postData) {
	  var req = new XMLHttpRequest();
	  if (req.overrideMimeType) req.overrideMimeType('text/html; charset=utf-8');
	  req.onreadystatechange = function () {
	    if (req.readyState === 4 && (parseInt(req.status) === 200 || !req.status && req.responseText.length)) {
	      fn(req.responseText);
	    }
	  };

	  if (typeof postData !== 'string') {
	    req.open('GET', url, true);
	    req.send('');
	  } else {
	    req.open('POST', url, true);
	    req.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
	    req.send(postData);
	  }
	}

	function generateId() {
	  return Math.random().toString(36).substr(2, 10);
	}

/***/ }),
/* 81 */
/***/ (function(module, exports) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.dispatchWinDocEvent = dispatchWinDocEvent;
	exports.dispatchElementEvent = dispatchElementEvent;
	exports.dispatchPageEvent = dispatchPageEvent;
	function dispatchWinDocEvent(eventName, moduleName) {
	  var detail = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

	  var fullEventName = eventName + ".ph." + moduleName;
	  window.dispatchEvent(new CustomEvent(fullEventName, { detail: detail }));
	  document.dispatchEvent(new CustomEvent(fullEventName, { detail: detail }));
	}

	function dispatchElementEvent(domElement, eventName, moduleName) {
	  var detail = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};

	  var fullEventName = eventName + ".ph." + moduleName;
	  domElement.dispatchEvent(new CustomEvent(fullEventName, { detail: detail }));
	}

	function dispatchPageEvent(eventName, pageName) {
	  var detail = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

	  var fullEventName = pageName + "." + eventName;
	  window.dispatchEvent(new CustomEvent(fullEventName, { detail: detail }));
	  document.dispatchEvent(new CustomEvent(fullEventName, { detail: detail }));
	}

/***/ }),
/* 82 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _typeof2 = __webpack_require__(46);

	var _typeof3 = _interopRequireDefault(_typeof2);

	var _classCallCheck2 = __webpack_require__(40);

	var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

	var _createClass2 = __webpack_require__(41);

	var _createClass3 = _interopRequireDefault(_createClass2);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	/**
	 * --------------------------------------------------------------------------
	 * Licensed under MIT (https://github.com/quark-dev/Phonon-Framework/blob/master/LICENSE)
	 * --------------------------------------------------------------------------
	 */

	var Ajax = function () {
	  /**
	   * ------------------------------------------------------------------------
	   * Constants
	   * ------------------------------------------------------------------------
	   */

	  var NAME = 'ajax';
	  var VERSION = '2.0.0';

	  /**
	   * ------------------------------------------------------------------------
	   * Class Definition
	   * ------------------------------------------------------------------------
	   */

	  var Ajax = function () {
	    /**
	     * Creates an instance of Ajax.
	     * @param {{method: string, url: string, complete: Function, success: Function, error: Function, data: any, crossDomain: boolean, headers: {[header: string]: string}, timeout: number, contentType: number, dataType: string }} opts
	     */
	    function Ajax(opts) {
	      (0, _classCallCheck3.default)(this, Ajax);

	      if ((typeof opts === 'undefined' ? 'undefined' : (0, _typeof3.default)(opts)) !== 'object') {
	        throw new Error(NAME + '-' + VERSION);
	      }
	      this.opts = opts;
	      this.errorCode = null;
	    }

	    (0, _createClass3.default)(Ajax, [{
	      key: 'createXhr',
	      value: function createXhr() {
	        var xhr = new XMLHttpRequest();
	        if ('withCredentials' in xhr && this.opts.crossDomain === true) {
	          xhr.withCredentials = true;
	        }
	        return xhr;
	      }

	      /**
	       * Set headers
	       * @param {{[header: string]: string}} headers
	       */

	    }, {
	      key: 'setHeaders',
	      value: function setHeaders() {
	        var headers = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

	        for (var key in headers) {
	          this.xhr.setRequestHeader(key, headers[key]);
	        }
	      }
	    }, {
	      key: 'onPreExecute',
	      value: function onPreExecute() {
	        var _this = this;

	        if ((0, _typeof3.default)(this.opts.headers) === 'object') {
	          this.setHeaders(this.opts.headers);
	        }

	        if (typeof this.opts.timeout === 'number') {
	          this.xhr.timeout = this.opts.timeout;
	          this.xhr.ontimeout = function () {
	            _this.errorCode = 'TIMEOUT_EXCEEDED';
	          };
	        }

	        if (typeof this.opts.contentType === 'string') {
	          this.setHeaders({ 'Content-type': this.opts.contentType });
	        }

	        if (this.opts.dataType === 'xml' && this.xhr.overrideMimeType) {
	          this.xhr.overrideMimeType('application/xml; charset=utf-8');
	        }
	      }
	    }, {
	      key: 'parseResponse',
	      value: function parseResponse() {
	        var response = null;
	        if (this.opts.dataType === 'json') {
	          try {
	            response = JSON.parse(this.xhr.responseText);
	          } catch (error) {
	            this.errorCode = 'JSON_MALFORMED';
	          }
	        } else if (this.opts.dataType === 'xml') {
	          response = this.xhr.responseXML;
	        } else {
	          response = this.xhr.responseText;
	        }
	        return response;
	      }
	    }, {
	      key: 'runRequest',
	      value: function runRequest() {
	        var _this2 = this;

	        this.xhr = this.createXhr();
	        this.xhr.open(this.opts.method, this.opts.url, true);
	        this.onPreExecute();

	        this.xhr.onreadystatechange = function () {
	          if (parseInt(_this2.xhr.readyState) === 4) {
	            var status = _this2.xhr.status.toString();

	            // response received
	            if (typeof _this2.opts.complete === 'function') {
	              _this2.opts.complete(_this2.errorCode, _this2.xhr);
	            }

	            // success 2xx
	            if (status[0] === '2') {
	              if (typeof _this2.opts.success === 'function') {
	                _this2.opts.success(_this2.parseResponse(), _this2.xhr);
	              }
	              return;
	            }

	            // error (1xx, 2xx, 3xx, 5xx)
	            if (typeof _this2.opts.error === 'function') {
	              // Timeout in order to wait on the timeout limit
	              window.setTimeout(function () {
	                _this2.opts.error(_this2.errorCode, _this2.xhr);
	              }, 1);
	            }
	          }
	        };
	        this.xhr.send(this.opts.data);

	        return this;
	      }
	    }, {
	      key: 'cancel',
	      value: function cancel() {
	        this.errorCode = 'CANCELED';
	        if (this.xhr) {
	          this.xhr.abort();
	        }
	        this.xhr = null;
	      }

	      // getters

	    }], [{
	      key: '_DOMInterface',


	      // public

	      // static
	      value: function _DOMInterface(opts) {
	        return new Ajax(opts).runRequest();
	      }
	    }, {
	      key: 'version',
	      get: function get() {
	        return NAME + '.' + VERSION;
	      }
	    }]);
	    return Ajax;
	  }();

	  return Ajax;
	}();

	exports.default = Ajax;

/***/ }),
/* 83 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _platform = __webpack_require__(84);

	var _platform2 = _interopRequireDefault(_platform);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	exports.default = _platform2.default; /*
	                                       * Use of platform.js
	                                       * https://github.com/bestiejs/platform.js
	                                       * License: https://github.com/bestiejs/platform.js/blob/master/LICENSE
	                                       */

/***/ }),
/* 84 */
/***/ (function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_RESULT__;/* WEBPACK VAR INJECTION */(function(module, global) {/*!
	 * Platform.js <https://mths.be/platform>
	 * Copyright 2014-2016 Benjamin Tan <https://demoneaux.github.io/>
	 * Copyright 2011-2013 John-David Dalton <http://allyoucanleet.com/>
	 * Available under MIT license <https://mths.be/mit>
	 */
	;(function() {
	  'use strict';

	  /** Used to determine if values are of the language type `Object`. */
	  var objectTypes = {
	    'function': true,
	    'object': true
	  };

	  /** Used as a reference to the global object. */
	  var root = (objectTypes[typeof window] && window) || this;

	  /** Backup possible global object. */
	  var oldRoot = root;

	  /** Detect free variable `exports`. */
	  var freeExports = objectTypes[typeof exports] && exports;

	  /** Detect free variable `module`. */
	  var freeModule = objectTypes[typeof module] && module && !module.nodeType && module;

	  /** Detect free variable `global` from Node.js or Browserified code and use it as `root`. */
	  var freeGlobal = freeExports && freeModule && typeof global == 'object' && global;
	  if (freeGlobal && (freeGlobal.global === freeGlobal || freeGlobal.window === freeGlobal || freeGlobal.self === freeGlobal)) {
	    root = freeGlobal;
	  }

	  /**
	   * Used as the maximum length of an array-like object.
	   * See the [ES6 spec](http://people.mozilla.org/~jorendorff/es6-draft.html#sec-tolength)
	   * for more details.
	   */
	  var maxSafeInteger = Math.pow(2, 53) - 1;

	  /** Regular expression to detect Opera. */
	  var reOpera = /\bOpera/;

	  /** Possible global object. */
	  var thisBinding = this;

	  /** Used for native method references. */
	  var objectProto = Object.prototype;

	  /** Used to check for own properties of an object. */
	  var hasOwnProperty = objectProto.hasOwnProperty;

	  /** Used to resolve the internal `[[Class]]` of values. */
	  var toString = objectProto.toString;

	  /*--------------------------------------------------------------------------*/

	  /**
	   * Capitalizes a string value.
	   *
	   * @private
	   * @param {string} string The string to capitalize.
	   * @returns {string} The capitalized string.
	   */
	  function capitalize(string) {
	    string = String(string);
	    return string.charAt(0).toUpperCase() + string.slice(1);
	  }

	  /**
	   * A utility function to clean up the OS name.
	   *
	   * @private
	   * @param {string} os The OS name to clean up.
	   * @param {string} [pattern] A `RegExp` pattern matching the OS name.
	   * @param {string} [label] A label for the OS.
	   */
	  function cleanupOS(os, pattern, label) {
	    // Platform tokens are defined at:
	    // http://msdn.microsoft.com/en-us/library/ms537503(VS.85).aspx
	    // http://web.archive.org/web/20081122053950/http://msdn.microsoft.com/en-us/library/ms537503(VS.85).aspx
	    var data = {
	      '10.0': '10',
	      '6.4':  '10 Technical Preview',
	      '6.3':  '8.1',
	      '6.2':  '8',
	      '6.1':  'Server 2008 R2 / 7',
	      '6.0':  'Server 2008 / Vista',
	      '5.2':  'Server 2003 / XP 64-bit',
	      '5.1':  'XP',
	      '5.01': '2000 SP1',
	      '5.0':  '2000',
	      '4.0':  'NT',
	      '4.90': 'ME'
	    };
	    // Detect Windows version from platform tokens.
	    if (pattern && label && /^Win/i.test(os) && !/^Windows Phone /i.test(os) &&
	        (data = data[/[\d.]+$/.exec(os)])) {
	      os = 'Windows ' + data;
	    }
	    // Correct character case and cleanup string.
	    os = String(os);

	    if (pattern && label) {
	      os = os.replace(RegExp(pattern, 'i'), label);
	    }

	    os = format(
	      os.replace(/ ce$/i, ' CE')
	        .replace(/\bhpw/i, 'web')
	        .replace(/\bMacintosh\b/, 'Mac OS')
	        .replace(/_PowerPC\b/i, ' OS')
	        .replace(/\b(OS X) [^ \d]+/i, '$1')
	        .replace(/\bMac (OS X)\b/, '$1')
	        .replace(/\/(\d)/, ' $1')
	        .replace(/_/g, '.')
	        .replace(/(?: BePC|[ .]*fc[ \d.]+)$/i, '')
	        .replace(/\bx86\.64\b/gi, 'x86_64')
	        .replace(/\b(Windows Phone) OS\b/, '$1')
	        .replace(/\b(Chrome OS \w+) [\d.]+\b/, '$1')
	        .split(' on ')[0]
	    );

	    return os;
	  }

	  /**
	   * An iteration utility for arrays and objects.
	   *
	   * @private
	   * @param {Array|Object} object The object to iterate over.
	   * @param {Function} callback The function called per iteration.
	   */
	  function each(object, callback) {
	    var index = -1,
	        length = object ? object.length : 0;

	    if (typeof length == 'number' && length > -1 && length <= maxSafeInteger) {
	      while (++index < length) {
	        callback(object[index], index, object);
	      }
	    } else {
	      forOwn(object, callback);
	    }
	  }

	  /**
	   * Trim and conditionally capitalize string values.
	   *
	   * @private
	   * @param {string} string The string to format.
	   * @returns {string} The formatted string.
	   */
	  function format(string) {
	    string = trim(string);
	    return /^(?:webOS|i(?:OS|P))/.test(string)
	      ? string
	      : capitalize(string);
	  }

	  /**
	   * Iterates over an object's own properties, executing the `callback` for each.
	   *
	   * @private
	   * @param {Object} object The object to iterate over.
	   * @param {Function} callback The function executed per own property.
	   */
	  function forOwn(object, callback) {
	    for (var key in object) {
	      if (hasOwnProperty.call(object, key)) {
	        callback(object[key], key, object);
	      }
	    }
	  }

	  /**
	   * Gets the internal `[[Class]]` of a value.
	   *
	   * @private
	   * @param {*} value The value.
	   * @returns {string} The `[[Class]]`.
	   */
	  function getClassOf(value) {
	    return value == null
	      ? capitalize(value)
	      : toString.call(value).slice(8, -1);
	  }

	  /**
	   * Host objects can return type values that are different from their actual
	   * data type. The objects we are concerned with usually return non-primitive
	   * types of "object", "function", or "unknown".
	   *
	   * @private
	   * @param {*} object The owner of the property.
	   * @param {string} property The property to check.
	   * @returns {boolean} Returns `true` if the property value is a non-primitive, else `false`.
	   */
	  function isHostType(object, property) {
	    var type = object != null ? typeof object[property] : 'number';
	    return !/^(?:boolean|number|string|undefined)$/.test(type) &&
	      (type == 'object' ? !!object[property] : true);
	  }

	  /**
	   * Prepares a string for use in a `RegExp` by making hyphens and spaces optional.
	   *
	   * @private
	   * @param {string} string The string to qualify.
	   * @returns {string} The qualified string.
	   */
	  function qualify(string) {
	    return String(string).replace(/([ -])(?!$)/g, '$1?');
	  }

	  /**
	   * A bare-bones `Array#reduce` like utility function.
	   *
	   * @private
	   * @param {Array} array The array to iterate over.
	   * @param {Function} callback The function called per iteration.
	   * @returns {*} The accumulated result.
	   */
	  function reduce(array, callback) {
	    var accumulator = null;
	    each(array, function(value, index) {
	      accumulator = callback(accumulator, value, index, array);
	    });
	    return accumulator;
	  }

	  /**
	   * Removes leading and trailing whitespace from a string.
	   *
	   * @private
	   * @param {string} string The string to trim.
	   * @returns {string} The trimmed string.
	   */
	  function trim(string) {
	    return String(string).replace(/^ +| +$/g, '');
	  }

	  /*--------------------------------------------------------------------------*/

	  /**
	   * Creates a new platform object.
	   *
	   * @memberOf platform
	   * @param {Object|string} [ua=navigator.userAgent] The user agent string or
	   *  context object.
	   * @returns {Object} A platform object.
	   */
	  function parse(ua) {

	    /** The environment context object. */
	    var context = root;

	    /** Used to flag when a custom context is provided. */
	    var isCustomContext = ua && typeof ua == 'object' && getClassOf(ua) != 'String';

	    // Juggle arguments.
	    if (isCustomContext) {
	      context = ua;
	      ua = null;
	    }

	    /** Browser navigator object. */
	    var nav = context.navigator || {};

	    /** Browser user agent string. */
	    var userAgent = nav.userAgent || '';

	    ua || (ua = userAgent);

	    /** Used to flag when `thisBinding` is the [ModuleScope]. */
	    var isModuleScope = isCustomContext || thisBinding == oldRoot;

	    /** Used to detect if browser is like Chrome. */
	    var likeChrome = isCustomContext
	      ? !!nav.likeChrome
	      : /\bChrome\b/.test(ua) && !/internal|\n/i.test(toString.toString());

	    /** Internal `[[Class]]` value shortcuts. */
	    var objectClass = 'Object',
	        airRuntimeClass = isCustomContext ? objectClass : 'ScriptBridgingProxyObject',
	        enviroClass = isCustomContext ? objectClass : 'Environment',
	        javaClass = (isCustomContext && context.java) ? 'JavaPackage' : getClassOf(context.java),
	        phantomClass = isCustomContext ? objectClass : 'RuntimeObject';

	    /** Detect Java environments. */
	    var java = /\bJava/.test(javaClass) && context.java;

	    /** Detect Rhino. */
	    var rhino = java && getClassOf(context.environment) == enviroClass;

	    /** A character to represent alpha. */
	    var alpha = java ? 'a' : '\u03b1';

	    /** A character to represent beta. */
	    var beta = java ? 'b' : '\u03b2';

	    /** Browser document object. */
	    var doc = context.document || {};

	    /**
	     * Detect Opera browser (Presto-based).
	     * http://www.howtocreate.co.uk/operaStuff/operaObject.html
	     * http://dev.opera.com/articles/view/opera-mini-web-content-authoring-guidelines/#operamini
	     */
	    var opera = context.operamini || context.opera;

	    /** Opera `[[Class]]`. */
	    var operaClass = reOpera.test(operaClass = (isCustomContext && opera) ? opera['[[Class]]'] : getClassOf(opera))
	      ? operaClass
	      : (opera = null);

	    /*------------------------------------------------------------------------*/

	    /** Temporary variable used over the script's lifetime. */
	    var data;

	    /** The CPU architecture. */
	    var arch = ua;

	    /** Platform description array. */
	    var description = [];

	    /** Platform alpha/beta indicator. */
	    var prerelease = null;

	    /** A flag to indicate that environment features should be used to resolve the platform. */
	    var useFeatures = ua == userAgent;

	    /** The browser/environment version. */
	    var version = useFeatures && opera && typeof opera.version == 'function' && opera.version();

	    /** A flag to indicate if the OS ends with "/ Version" */
	    var isSpecialCasedOS;

	    /* Detectable layout engines (order is important). */
	    var layout = getLayout([
	      { 'label': 'EdgeHTML', 'pattern': 'Edge' },
	      'Trident',
	      { 'label': 'WebKit', 'pattern': 'AppleWebKit' },
	      'iCab',
	      'Presto',
	      'NetFront',
	      'Tasman',
	      'KHTML',
	      'Gecko'
	    ]);

	    /* Detectable browser names (order is important). */
	    var name = getName([
	      'Adobe AIR',
	      'Arora',
	      'Avant Browser',
	      'Breach',
	      'Camino',
	      'Electron',
	      'Epiphany',
	      'Fennec',
	      'Flock',
	      'Galeon',
	      'GreenBrowser',
	      'iCab',
	      'Iceweasel',
	      'K-Meleon',
	      'Konqueror',
	      'Lunascape',
	      'Maxthon',
	      { 'label': 'Microsoft Edge', 'pattern': 'Edge' },
	      'Midori',
	      'Nook Browser',
	      'PaleMoon',
	      'PhantomJS',
	      'Raven',
	      'Rekonq',
	      'RockMelt',
	      { 'label': 'Samsung Internet', 'pattern': 'SamsungBrowser' },
	      'SeaMonkey',
	      { 'label': 'Silk', 'pattern': '(?:Cloud9|Silk-Accelerated)' },
	      'Sleipnir',
	      'SlimBrowser',
	      { 'label': 'SRWare Iron', 'pattern': 'Iron' },
	      'Sunrise',
	      'Swiftfox',
	      'Waterfox',
	      'WebPositive',
	      'Opera Mini',
	      { 'label': 'Opera Mini', 'pattern': 'OPiOS' },
	      'Opera',
	      { 'label': 'Opera', 'pattern': 'OPR' },
	      'Chrome',
	      { 'label': 'Chrome Mobile', 'pattern': '(?:CriOS|CrMo)' },
	      { 'label': 'Firefox', 'pattern': '(?:Firefox|Minefield)' },
	      { 'label': 'Firefox for iOS', 'pattern': 'FxiOS' },
	      { 'label': 'IE', 'pattern': 'IEMobile' },
	      { 'label': 'IE', 'pattern': 'MSIE' },
	      'Safari'
	    ]);

	    /* Detectable products (order is important). */
	    var product = getProduct([
	      { 'label': 'BlackBerry', 'pattern': 'BB10' },
	      'BlackBerry',
	      { 'label': 'Galaxy S', 'pattern': 'GT-I9000' },
	      { 'label': 'Galaxy S2', 'pattern': 'GT-I9100' },
	      { 'label': 'Galaxy S3', 'pattern': 'GT-I9300' },
	      { 'label': 'Galaxy S4', 'pattern': 'GT-I9500' },
	      { 'label': 'Galaxy S5', 'pattern': 'SM-G900' },
	      { 'label': 'Galaxy S6', 'pattern': 'SM-G920' },
	      { 'label': 'Galaxy S6 Edge', 'pattern': 'SM-G925' },
	      { 'label': 'Galaxy S7', 'pattern': 'SM-G930' },
	      { 'label': 'Galaxy S7 Edge', 'pattern': 'SM-G935' },
	      'Google TV',
	      'Lumia',
	      'iPad',
	      'iPod',
	      'iPhone',
	      'Kindle',
	      { 'label': 'Kindle Fire', 'pattern': '(?:Cloud9|Silk-Accelerated)' },
	      'Nexus',
	      'Nook',
	      'PlayBook',
	      'PlayStation Vita',
	      'PlayStation',
	      'TouchPad',
	      'Transformer',
	      { 'label': 'Wii U', 'pattern': 'WiiU' },
	      'Wii',
	      'Xbox One',
	      { 'label': 'Xbox 360', 'pattern': 'Xbox' },
	      'Xoom'
	    ]);

	    /* Detectable manufacturers. */
	    var manufacturer = getManufacturer({
	      'Apple': { 'iPad': 1, 'iPhone': 1, 'iPod': 1 },
	      'Archos': {},
	      'Amazon': { 'Kindle': 1, 'Kindle Fire': 1 },
	      'Asus': { 'Transformer': 1 },
	      'Barnes & Noble': { 'Nook': 1 },
	      'BlackBerry': { 'PlayBook': 1 },
	      'Google': { 'Google TV': 1, 'Nexus': 1 },
	      'HP': { 'TouchPad': 1 },
	      'HTC': {},
	      'LG': {},
	      'Microsoft': { 'Xbox': 1, 'Xbox One': 1 },
	      'Motorola': { 'Xoom': 1 },
	      'Nintendo': { 'Wii U': 1,  'Wii': 1 },
	      'Nokia': { 'Lumia': 1 },
	      'Samsung': { 'Galaxy S': 1, 'Galaxy S2': 1, 'Galaxy S3': 1, 'Galaxy S4': 1 },
	      'Sony': { 'PlayStation': 1, 'PlayStation Vita': 1 }
	    });

	    /* Detectable operating systems (order is important). */
	    var os = getOS([
	      'Windows Phone',
	      'Android',
	      'CentOS',
	      { 'label': 'Chrome OS', 'pattern': 'CrOS' },
	      'Debian',
	      'Fedora',
	      'FreeBSD',
	      'Gentoo',
	      'Haiku',
	      'Kubuntu',
	      'Linux Mint',
	      'OpenBSD',
	      'Red Hat',
	      'SuSE',
	      'Ubuntu',
	      'Xubuntu',
	      'Cygwin',
	      'Symbian OS',
	      'hpwOS',
	      'webOS ',
	      'webOS',
	      'Tablet OS',
	      'Tizen',
	      'Linux',
	      'Mac OS X',
	      'Macintosh',
	      'Mac',
	      'Windows 98;',
	      'Windows '
	    ]);

	    /*------------------------------------------------------------------------*/

	    /**
	     * Picks the layout engine from an array of guesses.
	     *
	     * @private
	     * @param {Array} guesses An array of guesses.
	     * @returns {null|string} The detected layout engine.
	     */
	    function getLayout(guesses) {
	      return reduce(guesses, function(result, guess) {
	        return result || RegExp('\\b' + (
	          guess.pattern || qualify(guess)
	        ) + '\\b', 'i').exec(ua) && (guess.label || guess);
	      });
	    }

	    /**
	     * Picks the manufacturer from an array of guesses.
	     *
	     * @private
	     * @param {Array} guesses An object of guesses.
	     * @returns {null|string} The detected manufacturer.
	     */
	    function getManufacturer(guesses) {
	      return reduce(guesses, function(result, value, key) {
	        // Lookup the manufacturer by product or scan the UA for the manufacturer.
	        return result || (
	          value[product] ||
	          value[/^[a-z]+(?: +[a-z]+\b)*/i.exec(product)] ||
	          RegExp('\\b' + qualify(key) + '(?:\\b|\\w*\\d)', 'i').exec(ua)
	        ) && key;
	      });
	    }

	    /**
	     * Picks the browser name from an array of guesses.
	     *
	     * @private
	     * @param {Array} guesses An array of guesses.
	     * @returns {null|string} The detected browser name.
	     */
	    function getName(guesses) {
	      return reduce(guesses, function(result, guess) {
	        return result || RegExp('\\b' + (
	          guess.pattern || qualify(guess)
	        ) + '\\b', 'i').exec(ua) && (guess.label || guess);
	      });
	    }

	    /**
	     * Picks the OS name from an array of guesses.
	     *
	     * @private
	     * @param {Array} guesses An array of guesses.
	     * @returns {null|string} The detected OS name.
	     */
	    function getOS(guesses) {
	      return reduce(guesses, function(result, guess) {
	        var pattern = guess.pattern || qualify(guess);
	        if (!result && (result =
	              RegExp('\\b' + pattern + '(?:/[\\d.]+|[ \\w.]*)', 'i').exec(ua)
	            )) {
	          result = cleanupOS(result, pattern, guess.label || guess);
	        }
	        return result;
	      });
	    }

	    /**
	     * Picks the product name from an array of guesses.
	     *
	     * @private
	     * @param {Array} guesses An array of guesses.
	     * @returns {null|string} The detected product name.
	     */
	    function getProduct(guesses) {
	      return reduce(guesses, function(result, guess) {
	        var pattern = guess.pattern || qualify(guess);
	        if (!result && (result =
	              RegExp('\\b' + pattern + ' *\\d+[.\\w_]*', 'i').exec(ua) ||
	              RegExp('\\b' + pattern + ' *\\w+-[\\w]*', 'i').exec(ua) ||
	              RegExp('\\b' + pattern + '(?:; *(?:[a-z]+[_-])?[a-z]+\\d+|[^ ();-]*)', 'i').exec(ua)
	            )) {
	          // Split by forward slash and append product version if needed.
	          if ((result = String((guess.label && !RegExp(pattern, 'i').test(guess.label)) ? guess.label : result).split('/'))[1] && !/[\d.]+/.test(result[0])) {
	            result[0] += ' ' + result[1];
	          }
	          // Correct character case and cleanup string.
	          guess = guess.label || guess;
	          result = format(result[0]
	            .replace(RegExp(pattern, 'i'), guess)
	            .replace(RegExp('; *(?:' + guess + '[_-])?', 'i'), ' ')
	            .replace(RegExp('(' + guess + ')[-_.]?(\\w)', 'i'), '$1 $2'));
	        }
	        return result;
	      });
	    }

	    /**
	     * Resolves the version using an array of UA patterns.
	     *
	     * @private
	     * @param {Array} patterns An array of UA patterns.
	     * @returns {null|string} The detected version.
	     */
	    function getVersion(patterns) {
	      return reduce(patterns, function(result, pattern) {
	        return result || (RegExp(pattern +
	          '(?:-[\\d.]+/|(?: for [\\w-]+)?[ /-])([\\d.]+[^ ();/_-]*)', 'i').exec(ua) || 0)[1] || null;
	      });
	    }

	    /**
	     * Returns `platform.description` when the platform object is coerced to a string.
	     *
	     * @name toString
	     * @memberOf platform
	     * @returns {string} Returns `platform.description` if available, else an empty string.
	     */
	    function toStringPlatform() {
	      return this.description || '';
	    }

	    /*------------------------------------------------------------------------*/

	    // Convert layout to an array so we can add extra details.
	    layout && (layout = [layout]);

	    // Detect product names that contain their manufacturer's name.
	    if (manufacturer && !product) {
	      product = getProduct([manufacturer]);
	    }
	    // Clean up Google TV.
	    if ((data = /\bGoogle TV\b/.exec(product))) {
	      product = data[0];
	    }
	    // Detect simulators.
	    if (/\bSimulator\b/i.test(ua)) {
	      product = (product ? product + ' ' : '') + 'Simulator';
	    }
	    // Detect Opera Mini 8+ running in Turbo/Uncompressed mode on iOS.
	    if (name == 'Opera Mini' && /\bOPiOS\b/.test(ua)) {
	      description.push('running in Turbo/Uncompressed mode');
	    }
	    // Detect IE Mobile 11.
	    if (name == 'IE' && /\blike iPhone OS\b/.test(ua)) {
	      data = parse(ua.replace(/like iPhone OS/, ''));
	      manufacturer = data.manufacturer;
	      product = data.product;
	    }
	    // Detect iOS.
	    else if (/^iP/.test(product)) {
	      name || (name = 'Safari');
	      os = 'iOS' + ((data = / OS ([\d_]+)/i.exec(ua))
	        ? ' ' + data[1].replace(/_/g, '.')
	        : '');
	    }
	    // Detect Kubuntu.
	    else if (name == 'Konqueror' && !/buntu/i.test(os)) {
	      os = 'Kubuntu';
	    }
	    // Detect Android browsers.
	    else if ((manufacturer && manufacturer != 'Google' &&
	        ((/Chrome/.test(name) && !/\bMobile Safari\b/i.test(ua)) || /\bVita\b/.test(product))) ||
	        (/\bAndroid\b/.test(os) && /^Chrome/.test(name) && /\bVersion\//i.test(ua))) {
	      name = 'Android Browser';
	      os = /\bAndroid\b/.test(os) ? os : 'Android';
	    }
	    // Detect Silk desktop/accelerated modes.
	    else if (name == 'Silk') {
	      if (!/\bMobi/i.test(ua)) {
	        os = 'Android';
	        description.unshift('desktop mode');
	      }
	      if (/Accelerated *= *true/i.test(ua)) {
	        description.unshift('accelerated');
	      }
	    }
	    // Detect PaleMoon identifying as Firefox.
	    else if (name == 'PaleMoon' && (data = /\bFirefox\/([\d.]+)\b/.exec(ua))) {
	      description.push('identifying as Firefox ' + data[1]);
	    }
	    // Detect Firefox OS and products running Firefox.
	    else if (name == 'Firefox' && (data = /\b(Mobile|Tablet|TV)\b/i.exec(ua))) {
	      os || (os = 'Firefox OS');
	      product || (product = data[1]);
	    }
	    // Detect false positives for Firefox/Safari.
	    else if (!name || (data = !/\bMinefield\b/i.test(ua) && /\b(?:Firefox|Safari)\b/.exec(name))) {
	      // Escape the `/` for Firefox 1.
	      if (name && !product && /[\/,]|^[^(]+?\)/.test(ua.slice(ua.indexOf(data + '/') + 8))) {
	        // Clear name of false positives.
	        name = null;
	      }
	      // Reassign a generic name.
	      if ((data = product || manufacturer || os) &&
	          (product || manufacturer || /\b(?:Android|Symbian OS|Tablet OS|webOS)\b/.test(os))) {
	        name = /[a-z]+(?: Hat)?/i.exec(/\bAndroid\b/.test(os) ? os : data) + ' Browser';
	      }
	    }
	    // Add Chrome version to description for Electron.
	    else if (name == 'Electron' && (data = (/\bChrome\/([\d.]+)\b/.exec(ua) || 0)[1])) {
	      description.push('Chromium ' + data);
	    }
	    // Detect non-Opera (Presto-based) versions (order is important).
	    if (!version) {
	      version = getVersion([
	        '(?:Cloud9|CriOS|CrMo|Edge|FxiOS|IEMobile|Iron|Opera ?Mini|OPiOS|OPR|Raven|SamsungBrowser|Silk(?!/[\\d.]+$))',
	        'Version',
	        qualify(name),
	        '(?:Firefox|Minefield|NetFront)'
	      ]);
	    }
	    // Detect stubborn layout engines.
	    if ((data =
	          layout == 'iCab' && parseFloat(version) > 3 && 'WebKit' ||
	          /\bOpera\b/.test(name) && (/\bOPR\b/.test(ua) ? 'Blink' : 'Presto') ||
	          /\b(?:Midori|Nook|Safari)\b/i.test(ua) && !/^(?:Trident|EdgeHTML)$/.test(layout) && 'WebKit' ||
	          !layout && /\bMSIE\b/i.test(ua) && (os == 'Mac OS' ? 'Tasman' : 'Trident') ||
	          layout == 'WebKit' && /\bPlayStation\b(?! Vita\b)/i.test(name) && 'NetFront'
	        )) {
	      layout = [data];
	    }
	    // Detect Windows Phone 7 desktop mode.
	    if (name == 'IE' && (data = (/; *(?:XBLWP|ZuneWP)(\d+)/i.exec(ua) || 0)[1])) {
	      name += ' Mobile';
	      os = 'Windows Phone ' + (/\+$/.test(data) ? data : data + '.x');
	      description.unshift('desktop mode');
	    }
	    // Detect Windows Phone 8.x desktop mode.
	    else if (/\bWPDesktop\b/i.test(ua)) {
	      name = 'IE Mobile';
	      os = 'Windows Phone 8.x';
	      description.unshift('desktop mode');
	      version || (version = (/\brv:([\d.]+)/.exec(ua) || 0)[1]);
	    }
	    // Detect IE 11 identifying as other browsers.
	    else if (name != 'IE' && layout == 'Trident' && (data = /\brv:([\d.]+)/.exec(ua))) {
	      if (name) {
	        description.push('identifying as ' + name + (version ? ' ' + version : ''));
	      }
	      name = 'IE';
	      version = data[1];
	    }
	    // Leverage environment features.
	    if (useFeatures) {
	      // Detect server-side environments.
	      // Rhino has a global function while others have a global object.
	      if (isHostType(context, 'global')) {
	        if (java) {
	          data = java.lang.System;
	          arch = data.getProperty('os.arch');
	          os = os || data.getProperty('os.name') + ' ' + data.getProperty('os.version');
	        }
	        if (isModuleScope && isHostType(context, 'system') && (data = [context.system])[0]) {
	          os || (os = data[0].os || null);
	          try {
	            data[1] = context.require('ringo/engine').version;
	            version = data[1].join('.');
	            name = 'RingoJS';
	          } catch(e) {
	            if (data[0].global.system == context.system) {
	              name = 'Narwhal';
	            }
	          }
	        }
	        else if (
	          typeof context.process == 'object' && !context.process.browser &&
	          (data = context.process)
	        ) {
	          if (typeof data.versions == 'object') {
	            if (typeof data.versions.electron == 'string') {
	              description.push('Node ' + data.versions.node);
	              name = 'Electron';
	              version = data.versions.electron;
	            } else if (typeof data.versions.nw == 'string') {
	              description.push('Chromium ' + version, 'Node ' + data.versions.node);
	              name = 'NW.js';
	              version = data.versions.nw;
	            }
	          } else {
	            name = 'Node.js';
	            arch = data.arch;
	            os = data.platform;
	            version = /[\d.]+/.exec(data.version)
	            version = version ? version[0] : 'unknown';
	          }
	        }
	        else if (rhino) {
	          name = 'Rhino';
	        }
	      }
	      // Detect Adobe AIR.
	      else if (getClassOf((data = context.runtime)) == airRuntimeClass) {
	        name = 'Adobe AIR';
	        os = data.flash.system.Capabilities.os;
	      }
	      // Detect PhantomJS.
	      else if (getClassOf((data = context.phantom)) == phantomClass) {
	        name = 'PhantomJS';
	        version = (data = data.version || null) && (data.major + '.' + data.minor + '.' + data.patch);
	      }
	      // Detect IE compatibility modes.
	      else if (typeof doc.documentMode == 'number' && (data = /\bTrident\/(\d+)/i.exec(ua))) {
	        // We're in compatibility mode when the Trident version + 4 doesn't
	        // equal the document mode.
	        version = [version, doc.documentMode];
	        if ((data = +data[1] + 4) != version[1]) {
	          description.push('IE ' + version[1] + ' mode');
	          layout && (layout[1] = '');
	          version[1] = data;
	        }
	        version = name == 'IE' ? String(version[1].toFixed(1)) : version[0];
	      }
	      // Detect IE 11 masking as other browsers.
	      else if (typeof doc.documentMode == 'number' && /^(?:Chrome|Firefox)\b/.test(name)) {
	        description.push('masking as ' + name + ' ' + version);
	        name = 'IE';
	        version = '11.0';
	        layout = ['Trident'];
	        os = 'Windows';
	      }
	      os = os && format(os);
	    }
	    // Detect prerelease phases.
	    if (version && (data =
	          /(?:[ab]|dp|pre|[ab]\d+pre)(?:\d+\+?)?$/i.exec(version) ||
	          /(?:alpha|beta)(?: ?\d)?/i.exec(ua + ';' + (useFeatures && nav.appMinorVersion)) ||
	          /\bMinefield\b/i.test(ua) && 'a'
	        )) {
	      prerelease = /b/i.test(data) ? 'beta' : 'alpha';
	      version = version.replace(RegExp(data + '\\+?$'), '') +
	        (prerelease == 'beta' ? beta : alpha) + (/\d+\+?/.exec(data) || '');
	    }
	    // Detect Firefox Mobile.
	    if (name == 'Fennec' || name == 'Firefox' && /\b(?:Android|Firefox OS)\b/.test(os)) {
	      name = 'Firefox Mobile';
	    }
	    // Obscure Maxthon's unreliable version.
	    else if (name == 'Maxthon' && version) {
	      version = version.replace(/\.[\d.]+/, '.x');
	    }
	    // Detect Xbox 360 and Xbox One.
	    else if (/\bXbox\b/i.test(product)) {
	      if (product == 'Xbox 360') {
	        os = null;
	      }
	      if (product == 'Xbox 360' && /\bIEMobile\b/.test(ua)) {
	        description.unshift('mobile mode');
	      }
	    }
	    // Add mobile postfix.
	    else if ((/^(?:Chrome|IE|Opera)$/.test(name) || name && !product && !/Browser|Mobi/.test(name)) &&
	        (os == 'Windows CE' || /Mobi/i.test(ua))) {
	      name += ' Mobile';
	    }
	    // Detect IE platform preview.
	    else if (name == 'IE' && useFeatures) {
	      try {
	        if (context.external === null) {
	          description.unshift('platform preview');
	        }
	      } catch(e) {
	        description.unshift('embedded');
	      }
	    }
	    // Detect BlackBerry OS version.
	    // http://docs.blackberry.com/en/developers/deliverables/18169/HTTP_headers_sent_by_BB_Browser_1234911_11.jsp
	    else if ((/\bBlackBerry\b/.test(product) || /\bBB10\b/.test(ua)) && (data =
	          (RegExp(product.replace(/ +/g, ' *') + '/([.\\d]+)', 'i').exec(ua) || 0)[1] ||
	          version
	        )) {
	      data = [data, /BB10/.test(ua)];
	      os = (data[1] ? (product = null, manufacturer = 'BlackBerry') : 'Device Software') + ' ' + data[0];
	      version = null;
	    }
	    // Detect Opera identifying/masking itself as another browser.
	    // http://www.opera.com/support/kb/view/843/
	    else if (this != forOwn && product != 'Wii' && (
	          (useFeatures && opera) ||
	          (/Opera/.test(name) && /\b(?:MSIE|Firefox)\b/i.test(ua)) ||
	          (name == 'Firefox' && /\bOS X (?:\d+\.){2,}/.test(os)) ||
	          (name == 'IE' && (
	            (os && !/^Win/.test(os) && version > 5.5) ||
	            /\bWindows XP\b/.test(os) && version > 8 ||
	            version == 8 && !/\bTrident\b/.test(ua)
	          ))
	        ) && !reOpera.test((data = parse.call(forOwn, ua.replace(reOpera, '') + ';'))) && data.name) {
	      // When "identifying", the UA contains both Opera and the other browser's name.
	      data = 'ing as ' + data.name + ((data = data.version) ? ' ' + data : '');
	      if (reOpera.test(name)) {
	        if (/\bIE\b/.test(data) && os == 'Mac OS') {
	          os = null;
	        }
	        data = 'identify' + data;
	      }
	      // When "masking", the UA contains only the other browser's name.
	      else {
	        data = 'mask' + data;
	        if (operaClass) {
	          name = format(operaClass.replace(/([a-z])([A-Z])/g, '$1 $2'));
	        } else {
	          name = 'Opera';
	        }
	        if (/\bIE\b/.test(data)) {
	          os = null;
	        }
	        if (!useFeatures) {
	          version = null;
	        }
	      }
	      layout = ['Presto'];
	      description.push(data);
	    }
	    // Detect WebKit Nightly and approximate Chrome/Safari versions.
	    if ((data = (/\bAppleWebKit\/([\d.]+\+?)/i.exec(ua) || 0)[1])) {
	      // Correct build number for numeric comparison.
	      // (e.g. "532.5" becomes "532.05")
	      data = [parseFloat(data.replace(/\.(\d)$/, '.0$1')), data];
	      // Nightly builds are postfixed with a "+".
	      if (name == 'Safari' && data[1].slice(-1) == '+') {
	        name = 'WebKit Nightly';
	        prerelease = 'alpha';
	        version = data[1].slice(0, -1);
	      }
	      // Clear incorrect browser versions.
	      else if (version == data[1] ||
	          version == (data[2] = (/\bSafari\/([\d.]+\+?)/i.exec(ua) || 0)[1])) {
	        version = null;
	      }
	      // Use the full Chrome version when available.
	      data[1] = (/\bChrome\/([\d.]+)/i.exec(ua) || 0)[1];
	      // Detect Blink layout engine.
	      if (data[0] == 537.36 && data[2] == 537.36 && parseFloat(data[1]) >= 28 && layout == 'WebKit') {
	        layout = ['Blink'];
	      }
	      // Detect JavaScriptCore.
	      // http://stackoverflow.com/questions/6768474/how-can-i-detect-which-javascript-engine-v8-or-jsc-is-used-at-runtime-in-androi
	      if (!useFeatures || (!likeChrome && !data[1])) {
	        layout && (layout[1] = 'like Safari');
	        data = (data = data[0], data < 400 ? 1 : data < 500 ? 2 : data < 526 ? 3 : data < 533 ? 4 : data < 534 ? '4+' : data < 535 ? 5 : data < 537 ? 6 : data < 538 ? 7 : data < 601 ? 8 : '8');
	      } else {
	        layout && (layout[1] = 'like Chrome');
	        data = data[1] || (data = data[0], data < 530 ? 1 : data < 532 ? 2 : data < 532.05 ? 3 : data < 533 ? 4 : data < 534.03 ? 5 : data < 534.07 ? 6 : data < 534.10 ? 7 : data < 534.13 ? 8 : data < 534.16 ? 9 : data < 534.24 ? 10 : data < 534.30 ? 11 : data < 535.01 ? 12 : data < 535.02 ? '13+' : data < 535.07 ? 15 : data < 535.11 ? 16 : data < 535.19 ? 17 : data < 536.05 ? 18 : data < 536.10 ? 19 : data < 537.01 ? 20 : data < 537.11 ? '21+' : data < 537.13 ? 23 : data < 537.18 ? 24 : data < 537.24 ? 25 : data < 537.36 ? 26 : layout != 'Blink' ? '27' : '28');
	      }
	      // Add the postfix of ".x" or "+" for approximate versions.
	      layout && (layout[1] += ' ' + (data += typeof data == 'number' ? '.x' : /[.+]/.test(data) ? '' : '+'));
	      // Obscure version for some Safari 1-2 releases.
	      if (name == 'Safari' && (!version || parseInt(version) > 45)) {
	        version = data;
	      }
	    }
	    // Detect Opera desktop modes.
	    if (name == 'Opera' &&  (data = /\bzbov|zvav$/.exec(os))) {
	      name += ' ';
	      description.unshift('desktop mode');
	      if (data == 'zvav') {
	        name += 'Mini';
	        version = null;
	      } else {
	        name += 'Mobile';
	      }
	      os = os.replace(RegExp(' *' + data + '$'), '');
	    }
	    // Detect Chrome desktop mode.
	    else if (name == 'Safari' && /\bChrome\b/.exec(layout && layout[1])) {
	      description.unshift('desktop mode');
	      name = 'Chrome Mobile';
	      version = null;

	      if (/\bOS X\b/.test(os)) {
	        manufacturer = 'Apple';
	        os = 'iOS 4.3+';
	      } else {
	        os = null;
	      }
	    }
	    // Strip incorrect OS versions.
	    if (version && version.indexOf((data = /[\d.]+$/.exec(os))) == 0 &&
	        ua.indexOf('/' + data + '-') > -1) {
	      os = trim(os.replace(data, ''));
	    }
	    // Add layout engine.
	    if (layout && !/\b(?:Avant|Nook)\b/.test(name) && (
	        /Browser|Lunascape|Maxthon/.test(name) ||
	        name != 'Safari' && /^iOS/.test(os) && /\bSafari\b/.test(layout[1]) ||
	        /^(?:Adobe|Arora|Breach|Midori|Opera|Phantom|Rekonq|Rock|Samsung Internet|Sleipnir|Web)/.test(name) && layout[1])) {
	      // Don't add layout details to description if they are falsey.
	      (data = layout[layout.length - 1]) && description.push(data);
	    }
	    // Combine contextual information.
	    if (description.length) {
	      description = ['(' + description.join('; ') + ')'];
	    }
	    // Append manufacturer to description.
	    if (manufacturer && product && product.indexOf(manufacturer) < 0) {
	      description.push('on ' + manufacturer);
	    }
	    // Append product to description.
	    if (product) {
	      description.push((/^on /.test(description[description.length - 1]) ? '' : 'on ') + product);
	    }
	    // Parse the OS into an object.
	    if (os) {
	      data = / ([\d.+]+)$/.exec(os);
	      isSpecialCasedOS = data && os.charAt(os.length - data[0].length - 1) == '/';
	      os = {
	        'architecture': 32,
	        'family': (data && !isSpecialCasedOS) ? os.replace(data[0], '') : os,
	        'version': data ? data[1] : null,
	        'toString': function() {
	          var version = this.version;
	          return this.family + ((version && !isSpecialCasedOS) ? ' ' + version : '') + (this.architecture == 64 ? ' 64-bit' : '');
	        }
	      };
	    }
	    // Add browser/OS architecture.
	    if ((data = /\b(?:AMD|IA|Win|WOW|x86_|x)64\b/i.exec(arch)) && !/\bi686\b/i.test(arch)) {
	      if (os) {
	        os.architecture = 64;
	        os.family = os.family.replace(RegExp(' *' + data), '');
	      }
	      if (
	          name && (/\bWOW64\b/i.test(ua) ||
	          (useFeatures && /\w(?:86|32)$/.test(nav.cpuClass || nav.platform) && !/\bWin64; x64\b/i.test(ua)))
	      ) {
	        description.unshift('32-bit');
	      }
	    }
	    // Chrome 39 and above on OS X is always 64-bit.
	    else if (
	        os && /^OS X/.test(os.family) &&
	        name == 'Chrome' && parseFloat(version) >= 39
	    ) {
	      os.architecture = 64;
	    }

	    ua || (ua = null);

	    /*------------------------------------------------------------------------*/

	    /**
	     * The platform object.
	     *
	     * @name platform
	     * @type Object
	     */
	    var platform = {};

	    /**
	     * The platform description.
	     *
	     * @memberOf platform
	     * @type string|null
	     */
	    platform.description = ua;

	    /**
	     * The name of the browser's layout engine.
	     *
	     * The list of common layout engines include:
	     * "Blink", "EdgeHTML", "Gecko", "Trident" and "WebKit"
	     *
	     * @memberOf platform
	     * @type string|null
	     */
	    platform.layout = layout && layout[0];

	    /**
	     * The name of the product's manufacturer.
	     *
	     * The list of manufacturers include:
	     * "Apple", "Archos", "Amazon", "Asus", "Barnes & Noble", "BlackBerry",
	     * "Google", "HP", "HTC", "LG", "Microsoft", "Motorola", "Nintendo",
	     * "Nokia", "Samsung" and "Sony"
	     *
	     * @memberOf platform
	     * @type string|null
	     */
	    platform.manufacturer = manufacturer;

	    /**
	     * The name of the browser/environment.
	     *
	     * The list of common browser names include:
	     * "Chrome", "Electron", "Firefox", "Firefox for iOS", "IE",
	     * "Microsoft Edge", "PhantomJS", "Safari", "SeaMonkey", "Silk",
	     * "Opera Mini" and "Opera"
	     *
	     * Mobile versions of some browsers have "Mobile" appended to their name:
	     * eg. "Chrome Mobile", "Firefox Mobile", "IE Mobile" and "Opera Mobile"
	     *
	     * @memberOf platform
	     * @type string|null
	     */
	    platform.name = name;

	    /**
	     * The alpha/beta release indicator.
	     *
	     * @memberOf platform
	     * @type string|null
	     */
	    platform.prerelease = prerelease;

	    /**
	     * The name of the product hosting the browser.
	     *
	     * The list of common products include:
	     *
	     * "BlackBerry", "Galaxy S4", "Lumia", "iPad", "iPod", "iPhone", "Kindle",
	     * "Kindle Fire", "Nexus", "Nook", "PlayBook", "TouchPad" and "Transformer"
	     *
	     * @memberOf platform
	     * @type string|null
	     */
	    platform.product = product;

	    /**
	     * The browser's user agent string.
	     *
	     * @memberOf platform
	     * @type string|null
	     */
	    platform.ua = ua;

	    /**
	     * The browser/environment version.
	     *
	     * @memberOf platform
	     * @type string|null
	     */
	    platform.version = name && version;

	    /**
	     * The name of the operating system.
	     *
	     * @memberOf platform
	     * @type Object
	     */
	    platform.os = os || {

	      /**
	       * The CPU architecture the OS is built for.
	       *
	       * @memberOf platform.os
	       * @type number|null
	       */
	      'architecture': null,

	      /**
	       * The family of the OS.
	       *
	       * Common values include:
	       * "Windows", "Windows Server 2008 R2 / 7", "Windows Server 2008 / Vista",
	       * "Windows XP", "OS X", "Ubuntu", "Debian", "Fedora", "Red Hat", "SuSE",
	       * "Android", "iOS" and "Windows Phone"
	       *
	       * @memberOf platform.os
	       * @type string|null
	       */
	      'family': null,

	      /**
	       * The version of the OS.
	       *
	       * @memberOf platform.os
	       * @type string|null
	       */
	      'version': null,

	      /**
	       * Returns the OS string.
	       *
	       * @memberOf platform.os
	       * @returns {string} The OS string.
	       */
	      'toString': function() { return 'null'; }
	    };

	    platform.parse = parse;
	    platform.toString = toStringPlatform;

	    if (platform.version) {
	      description.unshift(version);
	    }
	    if (platform.name) {
	      description.unshift(name);
	    }
	    if (os && name && !(os == String(os).split(' ')[0] && (os == name.split(' ')[0] || product))) {
	      description.push(product ? '(' + os + ')' : 'on ' + os);
	    }
	    if (description.length) {
	      platform.description = description.join(' ');
	    }
	    return platform;
	  }

	  /*--------------------------------------------------------------------------*/

	  // Export platform.
	  var platform = parse();

	  // Some AMD build optimizers, like r.js, check for condition patterns like the following:
	  if (true) {
	    // Expose platform on the global object to prevent errors when platform is
	    // loaded by a script tag in the presence of an AMD loader.
	    // See http://requirejs.org/docs/errors.html#mismatch for more details.
	    root.platform = platform;

	    // Define as an anonymous module so platform can be aliased through path mapping.
	    !(__WEBPACK_AMD_DEFINE_RESULT__ = function() {
	      return platform;
	    }.call(exports, __webpack_require__, exports, module), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
	  }
	  // Check for `exports` after `define` in case a build optimizer adds an `exports` object.
	  else if (freeExports && freeModule) {
	    // Export for CommonJS support.
	    forOwn(platform, function(value, key) {
	      freeExports[key] = value;
	    });
	  }
	  else {
	    // Export to the global object.
	    root.platform = platform;
	  }
	}.call(this));

	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(85)(module), (function() { return this; }())))

/***/ }),
/* 85 */
/***/ (function(module, exports) {

	module.exports = function(module) {
		if(!module.webpackPolyfill) {
			module.deprecate = function() {};
			module.paths = [];
			// module.parent = undefined by default
			module.children = [];
			module.webpackPolyfill = 1;
		}
		return module;
	}


/***/ }),
/* 86 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _keys = __webpack_require__(87);

	var _keys2 = _interopRequireDefault(_keys);

	var _typeof2 = __webpack_require__(46);

	var _typeof3 = _interopRequireDefault(_typeof2);

	var _assign = __webpack_require__(3);

	var _assign2 = _interopRequireDefault(_assign);

	var _classCallCheck2 = __webpack_require__(40);

	var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

	var _createClass2 = __webpack_require__(41);

	var _createClass3 = _interopRequireDefault(_createClass2);

	var _binder = __webpack_require__(91);

	var _binder2 = _interopRequireDefault(_binder);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	var Intl = function () {
	  /**
	   * ------------------------------------------------------------------------
	   * Constants
	   * ------------------------------------------------------------------------
	   */

	  var NAME = 'Intl';
	  var VERSION = '2.0.0';
	  var DEFAULT_PROPERTIES = {
	    fallbackLocale: 'en',
	    locale: 'en',
	    autoBind: true,
	    data: null

	    /**
	     * ------------------------------------------------------------------------
	     * Class Definition
	     * ------------------------------------------------------------------------
	     */

	  };
	  var Intl = function () {
	    /**
	     * Creates an instance of Intl.
	     * @param {fallbackLocale: string, locale: string, autoBind: boolean, data: {[lang: string]: {[key: string]: string}}}
	     */
	    function Intl() {
	      var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
	      (0, _classCallCheck3.default)(this, Intl);

	      this.options = (0, _assign2.default)(DEFAULT_PROPERTIES, options);

	      if (typeof this.options.fallbackLocale !== 'string') {
	        throw new Error(NAME + '. The fallback locale is mandatory and must be a string.');
	      }

	      if (this.options.data === null) {
	        throw new Error(NAME + '. There is no translation data.');
	      }

	      if ((0, _typeof3.default)(this.options.data[this.options.fallbackLocale]) !== 'object') {
	        throw new Error(NAME + '. The fallback locale must necessarily have translation data.');
	      }

	      this.setLocale(this.options.locale, this.options.autoBind);
	    }

	    (0, _createClass3.default)(Intl, [{
	      key: 'getLocale',
	      value: function getLocale() {
	        return this.options.locale;
	      }
	    }, {
	      key: 'getFallbackLocale',
	      value: function getFallbackLocale() {
	        return this.options.fallbackLocale;
	      }

	      /**
	       * Set default locale
	       * @param {string} locale
	       * @param {boolean} [updateHTML=true]
	       */

	    }, {
	      key: 'setLocale',
	      value: function setLocale(locale) {
	        var updateHTML = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;

	        if ((0, _typeof3.default)(this.options.data[locale]) !== 'object') {
	          console.error(NAME + '. ' + locale + ' has no data, fallback in ' + this.options.fallbackLocale + '.');
	        } else {
	          this.options.locale = locale;
	        }

	        if (updateHTML) {
	          this.updateHtml();
	        }
	      }
	    }, {
	      key: 'getLanguages',
	      value: function getLanguages() {
	        return (0, _keys2.default)(this.options.data);
	      }
	    }, {
	      key: 'insertValues',
	      value: function insertValues() {
	        var value = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
	        var injectableValues = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

	        if (typeof value !== 'string') {
	          return undefined;
	        }

	        var match = value.match(/:([a-zA-Z-_0-9]+)/);
	        if (match) {
	          value = value.replace(match[0], injectableValues[match[1]]);
	        }

	        if (value.match(/:([a-zA-Z-_0-9]+)/)) {
	          return this.insertValues(value, injectableValues);
	        }

	        return value;
	      }
	    }, {
	      key: 'translate',
	      value: function translate() {
	        var _this = this;

	        var keyName = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
	        var inject = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

	        var data = this.options.data[this.options.locale];
	        if (!data) {
	          data = this.options.data[this.options.fallbackLocale];
	        }

	        if (keyName === null || keyName === '*' || Array.isArray(keyName)) {
	          if (Array.isArray(keyName)) {
	            var keys = (0, _keys2.default)(data).filter(function (key) {
	              return keyName.indexOf(key) > -1;
	            });
	            var filteredData = {};
	            keys.forEach(function (key) {
	              filteredData[key] = _this.insertValues(data[key], inject);
	            });
	            data = filteredData;
	          }

	          var dataMap = {};
	          for (var key in data) {
	            dataMap[key] = this.insertValues(data[key], inject);
	          }

	          return dataMap;
	        }

	        return this.insertValues(data[keyName], inject);
	      }

	      // alias of t()

	    }, {
	      key: 't',
	      value: function t() {
	        var keyName = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
	        var inject = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

	        return this.translate(keyName, inject);
	      }

	      /**
	       * Updates the HTML views
	       * @param {HTMLElement} element
	       */

	    }, {
	      key: 'updateHtml',
	      value: function updateHtml(element) {
	        if (typeof element === 'undefined') {
	          element = document.querySelectorAll('[data-i18n]');
	        }

	        if (typeof element === 'string') {
	          element = document.querySelector(element);
	        }

	        new _binder2.default(element, this.t());
	      }

	      // static

	    }], [{
	      key: '_DOMInterface',
	      value: function _DOMInterface(options) {
	        return new Intl(options);
	      }
	    }, {
	      key: 'version',
	      get: function get() {
	        return NAME + '.' + VERSION;
	      }
	    }]);
	    return Intl;
	  }();

	  return Intl;
	}(); /**
	      * --------------------------------------------------------------------------
	      * Licensed under MIT (https://github.com/quark-dev/Phonon-Framework/blob/master/LICENSE)
	      * --------------------------------------------------------------------------
	      */
	exports.default = Intl;

/***/ }),
/* 87 */
/***/ (function(module, exports, __webpack_require__) {

	module.exports = { "default": __webpack_require__(88), __esModule: true };

/***/ }),
/* 88 */
/***/ (function(module, exports, __webpack_require__) {

	__webpack_require__(89);
	module.exports = __webpack_require__(8).Object.keys;


/***/ }),
/* 89 */
/***/ (function(module, exports, __webpack_require__) {

	// 19.1.2.14 Object.keys(O)
	var toObject = __webpack_require__(39);
	var $keys = __webpack_require__(22);

	__webpack_require__(90)('keys', function () {
	  return function keys(it) {
	    return $keys(toObject(it));
	  };
	});


/***/ }),
/* 90 */
/***/ (function(module, exports, __webpack_require__) {

	// most Object methods by ES6 should accept primitives
	var $export = __webpack_require__(6);
	var core = __webpack_require__(8);
	var fails = __webpack_require__(17);
	module.exports = function (KEY, exec) {
	  var fn = (core.Object || {})[KEY] || Object[KEY];
	  var exp = {};
	  exp[KEY] = exec(fn);
	  $export($export.S + $export.F * fails(function () { fn(1); }), 'Object', exp);
	};


/***/ }),
/* 91 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _typeof2 = __webpack_require__(46);

	var _typeof3 = _interopRequireDefault(_typeof2);

	var _classCallCheck2 = __webpack_require__(40);

	var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

	var _createClass2 = __webpack_require__(41);

	var _createClass3 = _interopRequireDefault(_createClass2);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	/**
	* --------------------------------------------------------------------------
	* Licensed under MIT (https://github.com/quark-dev/Phonon-Framework/blob/master/LICENSE)
	* --------------------------------------------------------------------------
	*/

	var Binder = function () {
	  /**
	  * ------------------------------------------------------------------------
	  * Constants
	  * ------------------------------------------------------------------------
	  */

	  var NAME = 'intl-binder';
	  var VERSION = '2.0.0';

	  /**
	   * ------------------------------------------------------------------------
	   * Class Definition
	   * ------------------------------------------------------------------------
	   */

	  var Binder = function () {
	    function Binder(element, data) {
	      (0, _classCallCheck3.default)(this, Binder);

	      this.element = element;
	      this.data = data;

	      if (!this.isElement(this.element)) {
	        return;
	      }

	      // array of HTMLElement
	      if (this.element.length && this.element.length > 0) {
	        this.setNodes(this.element);
	      } else {
	        // single HTMLElement
	        this.setNode(this.element);
	      }
	    }

	    // getters

	    (0, _createClass3.default)(Binder, [{
	      key: 'isElement',


	      /**
	       * Checks if the given argument is a DOM element
	       * @param {HTMLElement} the argument to test
	       * @return {boolean} true if the object is a DOM element, false otherwise
	       */
	      value: function isElement(element) {
	        if (element === null) {
	          return false;
	        }
	        return (typeof Node === 'undefined' ? 'undefined' : (0, _typeof3.default)(Node)) === 'object' ? element instanceof Node : element && (typeof element === 'undefined' ? 'undefined' : (0, _typeof3.default)(element)) === 'object' && typeof element.nodeType === 'number' && typeof element.nodeName === 'string';
	      }

	      /**
	      * Binds some text to the given DOM element
	      * @param {HTMLElement} element
	      * @param {String} text
	      */

	    }, {
	      key: 'setText',
	      value: function setText(element, text) {
	        if (!('textContent' in element)) {
	          element.innerText = text;
	        } else {
	          element.textContent = text;
	        }
	      }

	      /**
	       * Binds some html to the given DOM element
	       * @param {HTMLElement} element
	       * @param {string} text
	       */

	    }, {
	      key: 'setHtml',
	      value: function setHtml(element, text) {
	        element.innerHTML = text;
	      }

	      /**
	       * Binds custom attributes to the given DOM element
	       * @param {HTMLElement} element
	       * @param {String} attr
	       * @param {String} text
	       */

	    }, {
	      key: 'setAttribute',
	      value: function setAttribute(element, attr, text) {
	        element.setAttribute(attr, text);
	      }
	    }, {
	      key: 'setNode',
	      value: function setNode(element) {
	        var attr = element.getAttribute('data-i18n');
	        if (!attr) {
	          return;
	        }

	        attr = attr.trim();

	        var r = /(?:\s|^)([A-Za-z-_0-9]+):\s*(.*?)(?=\s+\w+:|$)/g;
	        var m = void 0;

	        while (m = r.exec(attr)) {
	          var key = m[1].trim();
	          var value = m[2].trim().replace(',', '');
	          var intlValue = this.data[value];

	          if (!this.data[value]) {
	            console.log(NAME + '. Warning, ' + value + ' does not exist.');
	            intlValue = value;
	          }

	          var methodName = 'set' + key.charAt(0).toUpperCase() + key.slice(1);

	          if (this[methodName]) {
	            this[methodName](element, intlValue);
	          } else {
	            this.setAttribute(element, key, intlValue);
	          }
	        }
	      }

	      /**
	      * Set values to DOM nodes
	      */

	    }, {
	      key: 'setNodes',
	      value: function setNodes(element) {
	        var _this = this;

	        element.forEach(function (el) {
	          return _this.setNode(el);
	        });
	      }
	    }], [{
	      key: 'version',
	      get: function get() {
	        return NAME + '.' + VERSION;
	      }
	    }]);
	    return Binder;
	  }();

	  return Binder;
	}();

	exports.default = Binder;

/***/ }),
/* 92 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _getPrototypeOf = __webpack_require__(93);

	var _getPrototypeOf2 = _interopRequireDefault(_getPrototypeOf);

	var _classCallCheck2 = __webpack_require__(40);

	var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

	var _createClass2 = __webpack_require__(41);

	var _createClass3 = _interopRequireDefault(_createClass2);

	var _possibleConstructorReturn2 = __webpack_require__(96);

	var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

	var _get2 = __webpack_require__(97);

	var _get3 = _interopRequireDefault(_get2);

	var _inherits2 = __webpack_require__(101);

	var _inherits3 = _interopRequireDefault(_inherits2);

	var _events = __webpack_require__(109);

	var _events2 = _interopRequireDefault(_events);

	var _component = __webpack_require__(110);

	var _component2 = _interopRequireDefault(_component);

	var _dispatch = __webpack_require__(81);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	var Network = function () {
	  /**
	   * ------------------------------------------------------------------------
	   * Constants
	   * ------------------------------------------------------------------------
	   */

	  var NAME = 'network';
	  var VERSION = '2.0.0';
	  var DEFAULT_PROPERTIES = {};

	  window.addEventListener('online', function () {
	    (0, _dispatch.dispatchWinDocEvent)(_events2.default.NETWORK_ONLINE, NAME, { date: new Date() });
	  });

	  window.addEventListener('offline', function () {
	    (0, _dispatch.dispatchWinDocEvent)(_events2.default.NETWORK_OFFLINE, NAME, { date: new Date() });
	  });

	  /**
	   * ------------------------------------------------------------------------
	   * Class Definition
	   * ------------------------------------------------------------------------
	   */

	  var Network = function (_Component) {
	    (0, _inherits3.default)(Network, _Component);

	    /**
	     * Creates an instance of Network.
	     * @param {{}} [options={}]
	     */
	    function Network() {
	      var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
	      (0, _classCallCheck3.default)(this, Network);

	      var _this = (0, _possibleConstructorReturn3.default)(this, (Network.__proto__ || (0, _getPrototypeOf2.default)(Network)).call(this, NAME, VERSION, DEFAULT_PROPERTIES, options, true));

	      _this.addEvents();
	      return _this;
	    }

	    (0, _createClass3.default)(Network, [{
	      key: 'addEvents',
	      value: function addEvents() {
	        var _this2 = this;

	        window.addEventListener('online.ph.network', function () {
	          _this2.triggerEvent(_events2.default.NETWORK_ONLINE, { date: new Date() }, true);
	        });

	        window.addEventListener('offline.ph.network', function () {
	          _this2.triggerEvent(_events2.default.NETWORK_OFFLINE, { date: new Date() }, true);
	        });
	      }
	    }], [{
	      key: '_DOMInterface',
	      value: function _DOMInterface(options) {
	        return (0, _get3.default)(Network.__proto__ || (0, _getPrototypeOf2.default)(Network), '_DOMInterface', this).call(this, Network, options);
	      }
	    }]);
	    return Network;
	  }(_component2.default);

	  return Network;
	}(); /**
	      * --------------------------------------------------------------------------
	      * Licensed under MIT (https://github.com/quark-dev/Phonon-Framework/blob/master/LICENSE)
	      * --------------------------------------------------------------------------
	      */

	exports.default = Network;

/***/ }),
/* 93 */
/***/ (function(module, exports, __webpack_require__) {

	module.exports = { "default": __webpack_require__(94), __esModule: true };

/***/ }),
/* 94 */
/***/ (function(module, exports, __webpack_require__) {

	__webpack_require__(95);
	module.exports = __webpack_require__(8).Object.getPrototypeOf;


/***/ }),
/* 95 */
/***/ (function(module, exports, __webpack_require__) {

	// 19.1.2.9 Object.getPrototypeOf(O)
	var toObject = __webpack_require__(39);
	var $getPrototypeOf = __webpack_require__(61);

	__webpack_require__(90)('getPrototypeOf', function () {
	  return function getPrototypeOf(it) {
	    return $getPrototypeOf(toObject(it));
	  };
	});


/***/ }),
/* 96 */
/***/ (function(module, exports, __webpack_require__) {

	"use strict";

	exports.__esModule = true;

	var _typeof2 = __webpack_require__(46);

	var _typeof3 = _interopRequireDefault(_typeof2);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	exports.default = function (self, call) {
	  if (!self) {
	    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
	  }

	  return call && ((typeof call === "undefined" ? "undefined" : (0, _typeof3.default)(call)) === "object" || typeof call === "function") ? call : self;
	};

/***/ }),
/* 97 */
/***/ (function(module, exports, __webpack_require__) {

	"use strict";

	exports.__esModule = true;

	var _getPrototypeOf = __webpack_require__(93);

	var _getPrototypeOf2 = _interopRequireDefault(_getPrototypeOf);

	var _getOwnPropertyDescriptor = __webpack_require__(98);

	var _getOwnPropertyDescriptor2 = _interopRequireDefault(_getOwnPropertyDescriptor);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	exports.default = function get(object, property, receiver) {
	  if (object === null) object = Function.prototype;
	  var desc = (0, _getOwnPropertyDescriptor2.default)(object, property);

	  if (desc === undefined) {
	    var parent = (0, _getPrototypeOf2.default)(object);

	    if (parent === null) {
	      return undefined;
	    } else {
	      return get(parent, property, receiver);
	    }
	  } else if ("value" in desc) {
	    return desc.value;
	  } else {
	    var getter = desc.get;

	    if (getter === undefined) {
	      return undefined;
	    }

	    return getter.call(receiver);
	  }
	};

/***/ }),
/* 98 */
/***/ (function(module, exports, __webpack_require__) {

	module.exports = { "default": __webpack_require__(99), __esModule: true };

/***/ }),
/* 99 */
/***/ (function(module, exports, __webpack_require__) {

	__webpack_require__(100);
	var $Object = __webpack_require__(8).Object;
	module.exports = function getOwnPropertyDescriptor(it, key) {
	  return $Object.getOwnPropertyDescriptor(it, key);
	};


/***/ }),
/* 100 */
/***/ (function(module, exports, __webpack_require__) {

	// 19.1.2.6 Object.getOwnPropertyDescriptor(O, P)
	var toIObject = __webpack_require__(25);
	var $getOwnPropertyDescriptor = __webpack_require__(76).f;

	__webpack_require__(90)('getOwnPropertyDescriptor', function () {
	  return function getOwnPropertyDescriptor(it, key) {
	    return $getOwnPropertyDescriptor(toIObject(it), key);
	  };
	});


/***/ }),
/* 101 */
/***/ (function(module, exports, __webpack_require__) {

	"use strict";

	exports.__esModule = true;

	var _setPrototypeOf = __webpack_require__(102);

	var _setPrototypeOf2 = _interopRequireDefault(_setPrototypeOf);

	var _create = __webpack_require__(106);

	var _create2 = _interopRequireDefault(_create);

	var _typeof2 = __webpack_require__(46);

	var _typeof3 = _interopRequireDefault(_typeof2);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	exports.default = function (subClass, superClass) {
	  if (typeof superClass !== "function" && superClass !== null) {
	    throw new TypeError("Super expression must either be null or a function, not " + (typeof superClass === "undefined" ? "undefined" : (0, _typeof3.default)(superClass)));
	  }

	  subClass.prototype = (0, _create2.default)(superClass && superClass.prototype, {
	    constructor: {
	      value: subClass,
	      enumerable: false,
	      writable: true,
	      configurable: true
	    }
	  });
	  if (superClass) _setPrototypeOf2.default ? (0, _setPrototypeOf2.default)(subClass, superClass) : subClass.__proto__ = superClass;
	};

/***/ }),
/* 102 */
/***/ (function(module, exports, __webpack_require__) {

	module.exports = { "default": __webpack_require__(103), __esModule: true };

/***/ }),
/* 103 */
/***/ (function(module, exports, __webpack_require__) {

	__webpack_require__(104);
	module.exports = __webpack_require__(8).Object.setPrototypeOf;


/***/ }),
/* 104 */
/***/ (function(module, exports, __webpack_require__) {

	// 19.1.3.19 Object.setPrototypeOf(O, proto)
	var $export = __webpack_require__(6);
	$export($export.S, 'Object', { setPrototypeOf: __webpack_require__(105).set });


/***/ }),
/* 105 */
/***/ (function(module, exports, __webpack_require__) {

	// Works with __proto__ only. Old v8 can't work with null proto objects.
	/* eslint-disable no-proto */
	var isObject = __webpack_require__(14);
	var anObject = __webpack_require__(13);
	var check = function (O, proto) {
	  anObject(O);
	  if (!isObject(proto) && proto !== null) throw TypeError(proto + ": can't set as prototype!");
	};
	module.exports = {
	  set: Object.setPrototypeOf || ('__proto__' in {} ? // eslint-disable-line
	    function (test, buggy, set) {
	      try {
	        set = __webpack_require__(9)(Function.call, __webpack_require__(76).f(Object.prototype, '__proto__').set, 2);
	        set(test, []);
	        buggy = !(test instanceof Array);
	      } catch (e) { buggy = true; }
	      return function setPrototypeOf(O, proto) {
	        check(O, proto);
	        if (buggy) O.__proto__ = proto;
	        else set(O, proto);
	        return O;
	      };
	    }({}, false) : undefined),
	  check: check
	};


/***/ }),
/* 106 */
/***/ (function(module, exports, __webpack_require__) {

	module.exports = { "default": __webpack_require__(107), __esModule: true };

/***/ }),
/* 107 */
/***/ (function(module, exports, __webpack_require__) {

	__webpack_require__(108);
	var $Object = __webpack_require__(8).Object;
	module.exports = function create(P, D) {
	  return $Object.create(P, D);
	};


/***/ }),
/* 108 */
/***/ (function(module, exports, __webpack_require__) {

	var $export = __webpack_require__(6);
	// 19.1.2.2 / 15.2.3.5 Object.create(O [, Properties])
	$export($export.S, 'Object', { create: __webpack_require__(56) });


/***/ }),
/* 109 */
/***/ (function(module, exports) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	// @todo keep ?
	if (typeof window !== 'undefined') {
	  window.addEventListener('error', function () {
	    console.error('An error has occured! You can pen an issue here: https://github.com/quark-dev/Phonon-Framework/issues');
	  });
	}

	// Use available events
	var availableEvents = ['mousedown', 'mousemove', 'mouseup'];
	var touchScreen = false;

	if (typeof window !== 'undefined') {
	  if ('ontouchstart' in window || window.DocumentTouch && document instanceof DocumentTouch) {
	    touchScreen = true;
	    availableEvents = ['touchstart', 'touchmove', 'touchend', 'touchcancel'];
	  }

	  if (window.navigator.pointerEnabled) {
	    availableEvents = ['pointerdown', 'pointermove', 'pointerup', 'pointercancel'];
	  } else if (window.navigator.msPointerEnabled) {
	    availableEvents = ['MSPointerDown', 'MSPointerMove', 'MSPointerUp', 'MSPointerCancel'];
	  }
	}

	var el = document.createElement('div');
	var transitions = [{ name: 'transition', start: 'transitionstart', end: 'transitionend' }, { name: 'MozTransition', start: 'transitionstart', end: 'transitionend' }, { name: 'msTransition', start: 'msTransitionStart', end: 'msTransitionEnd' }, { name: 'WebkitTransition', start: 'webkitTransitionStart', end: 'webkitTransitionEnd' }];
	var animations = [{ name: 'animation', start: 'animationstart', end: 'animationend' }, { name: 'MozAnimation', start: 'animationstart', end: 'animationend' }, { name: 'msAnimation', start: 'msAnimationStart', end: 'msAnimationEnd' }, { name: 'WebkitAnimation', start: 'webkitAnimationStart', end: 'webkitAnimationEnd' }];

	var transitionStart = transitions.find(function (t) {
	  return el.style[t.name] !== undefined;
	}).start;
	var transitionEnd = transitions.find(function (t) {
	  return el.style[t.name] !== undefined;
	}).end;
	var animationStart = animations.find(function (t) {
	  return el.style[t.name] !== undefined;
	}).start;
	var animationEnd = animations.find(function (t) {
	  return el.style[t.name] !== undefined;
	}).end;

	exports.default = {
	  // touch screen support
	  TOUCH_SCREEN: touchScreen,

	  // network
	  NETWORK_ONLINE: 'online',
	  NETWORK_OFFLINE: 'offline',

	  // user interface states
	  SHOW: 'show',
	  SHOWN: 'shown',
	  HIDE: 'hide',
	  HIDDEN: 'hidden',

	  // touch, mouse and pointer events polyfill
	  START: availableEvents[0],
	  MOVE: availableEvents[1],
	  END: availableEvents[2],
	  CANCEL: typeof availableEvents[3] === 'undefined' ? null : availableEvents[3],

	  // transitions
	  TRANSITION_START: transitionStart,
	  TRANSITION_END: transitionEnd,

	  // animations
	  ANIMATION_START: animationStart,
	  ANIMATION_END: animationEnd
	};

/***/ }),
/* 110 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _assign = __webpack_require__(3);

	var _assign2 = _interopRequireDefault(_assign);

	var _classCallCheck2 = __webpack_require__(40);

	var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

	var _createClass2 = __webpack_require__(41);

	var _createClass3 = _interopRequireDefault(_createClass2);

	var _dispatch = __webpack_require__(81);

	var _utils = __webpack_require__(80);

	var _events = __webpack_require__(109);

	var _events2 = _interopRequireDefault(_events);

	var _componentManager = __webpack_require__(111);

	var _componentManager2 = _interopRequireDefault(_componentManager);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	/**
	 * ------------------------------------------------------------------------
	 * Class Definition
	 * ------------------------------------------------------------------------
	 */

	/**
	 * --------------------------------------------------------------------------
	 * Licensed under MIT (https://github.com/quark-dev/Phonon-Framework/blob/master/LICENSE)
	 * --------------------------------------------------------------------------
	 */
	var Component = function () {
	  function Component(name, version) {
	    var defaultOptions = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
	    var options = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};
	    var optionAttrs = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : [];

	    var _this = this;

	    var supportDynamicElement = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : false;
	    var addToStack = arguments.length > 6 && arguments[6] !== undefined ? arguments[6] : false;
	    (0, _classCallCheck3.default)(this, Component);

	    this._name = name;
	    this._version = version;
	    this.options = (0, _assign2.default)(defaultOptions, options);
	    this.optionAttrs = optionAttrs;
	    this.supportDynamicElement = supportDynamicElement;
	    this.addToStack = addToStack;
	    this.id = (0, _utils.generateId)();

	    var checkElement = !this.supportDynamicElement || this.options.element !== null;

	    if (typeof this.options.element === 'string') {
	      this.options.element = document.querySelector(this.options.element);
	    }

	    if (checkElement && this.options.element === null) {
	      throw new Error(this._name + '. The element is not a HTMLElement.');
	    }

	    this.dynamicElement = this.options.element === null;
	    this.registeredElements = [];

	    if (!this.dynamicElement) {
	      /**
	       * if the element exists, we read the data attributes config
	       * then we overwrite existing config keys in JavaScript, so that
	       * we keep the following order
	       * [1] default JavaScript configuration of the component
	       * [2] Data attributes configuration if the element exists in the DOM
	       * [3] JavaScript configuration
	       */
	      this.options = (0, _assign2.default)(this.options, this.assignJsConfig(this.getAttributes(), options));

	      // then, set the new data attributes to the element
	      this.setAttributes();
	    }

	    this.elementListener = function (event) {
	      return _this.onBeforeElementEvent(event);
	    };
	  }

	  (0, _createClass3.default)(Component, [{
	    key: 'assignJsConfig',
	    value: function assignJsConfig(attrConfig, options) {
	      this.optionAttrs.forEach(function (key) {
	        if (options[key]) {
	          attrConfig[key] = options[key];
	        }
	      });

	      return attrConfig;
	    }
	  }, {
	    key: 'getElement',
	    value: function getElement() {
	      return this.options.element;
	    }
	  }, {
	    key: 'registerElements',
	    value: function registerElements(elements) {
	      var _this2 = this;

	      elements.forEach(function (element) {
	        return _this2.registerElement(element);
	      });
	    }
	  }, {
	    key: 'registerElement',
	    value: function registerElement(element) {
	      element.target.addEventListener(element.event, this.elementListener);
	      this.registeredElements.push(element);
	    }
	  }, {
	    key: 'unregisterElements',
	    value: function unregisterElements() {
	      var _this3 = this;

	      this.registeredElements.forEach(function (element) {
	        _this3.unregisterElement(element);
	      });
	    }
	  }, {
	    key: 'unregisterElement',
	    value: function unregisterElement(element) {
	      var registeredElementIndex = this.registeredElements.findIndex(function (el) {
	        return el.target === element.target && el.event === element.event;
	      });

	      if (registeredElementIndex > -1) {
	        element.target.removeEventListener(element.event, this.elementListener);
	        this.registeredElements.splice(registeredElementIndex, 1);
	      } else {
	        console.error('Warning! Unknown registered element: ' + element.target + ' with event: ' + element.event + '.');
	      }
	    }
	  }, {
	    key: 'triggerEvent',
	    value: function triggerEvent(eventName) {
	      var detail = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
	      var objectEventOnly = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;

	      if (this.addToStack) {
	        if (eventName === _events2.default.SHOW) {
	          _componentManager2.default.add(this);
	        } else if (eventName === _events2.default.HIDE) {
	          _componentManager2.default.remove(this);
	        }
	      }

	      var eventNameAlias = 'on' + eventName.charAt(0).toUpperCase() + eventName.slice(1);

	      // object event
	      if (typeof this.options[eventName] === 'function') {
	        this.options[eventName].apply(this, [detail]);
	      }

	      if (typeof this.options[eventNameAlias] === 'function') {
	        this.options[eventNameAlias].apply(this, [detail]);
	      }

	      if (objectEventOnly) {
	        return;
	      }

	      // dom event
	      if (this.options.element) {
	        (0, _dispatch.dispatchElementEvent)(this.options.element, eventName, this._name, detail);
	      } else {
	        (0, _dispatch.dispatchWinDocEvent)(eventName, this._name, detail);
	      }
	    }
	  }, {
	    key: 'setAttributes',
	    value: function setAttributes() {
	      if (this.optionAttrs.length > 0) {
	        (0, _componentManager.setAttributesConfig)(this.options.element, this.options, this.optionAttrs);
	      }
	    }
	  }, {
	    key: 'getAttributes',
	    value: function getAttributes() {
	      var options = (0, _assign2.default)({}, this.options);
	      return (0, _componentManager.getAttributesConfig)(this.options.element, options, this.optionAttrs);
	    }

	    /**
	     * the preventClosable method manages concurrency between active components.
	     * For example, if there is a shown off-canvas and dialog, the last
	     * shown component gains the processing priority
	     */

	  }, {
	    key: 'preventClosable',
	    value: function preventClosable() {
	      return this.addToStack && !_componentManager2.default.closable(this);
	    }
	  }, {
	    key: 'onBeforeElementEvent',
	    value: function onBeforeElementEvent(event) {
	      if (this.preventClosable()) {
	        return;
	      }

	      this.onElementEvent(event);
	    }
	  }, {
	    key: 'onElementEvent',
	    value: function onElementEvent(event) {
	      //
	    }
	  }, {
	    key: 'version',
	    get: function get() {
	      return this._name + '-' + this._version;
	    },
	    set: function set(version) {
	      this._version = version;
	    }
	  }], [{
	    key: '_DOMInterface',
	    value: function _DOMInterface(ComponentClass, options) {
	      return new ComponentClass(options);
	    }
	  }]);
	  return Component;
	}();

	exports.default = Component;

/***/ }),
/* 111 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _is = __webpack_require__(112);

	var _is2 = _interopRequireDefault(_is);

	var _typeof2 = __webpack_require__(46);

	var _typeof3 = _interopRequireDefault(_typeof2);

	var _keys = __webpack_require__(87);

	var _keys2 = _interopRequireDefault(_keys);

	exports.setAttributesConfig = setAttributesConfig;
	exports.getAttributesConfig = getAttributesConfig;

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	var getAttribute = function getAttribute(first, second) {
	  if (first === '') {
	    return 'data-' + second;
	  }
	  return 'data-' + first + '-' + second;
	};

	function setAttributesConfig(element) {
	  var obj = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
	  var attrs = arguments[2];
	  var start = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : '';

	  var keys = (0, _keys2.default)(obj);

	  keys.forEach(function (key) {
	    if (start === '' && attrs.indexOf(key) === -1) {
	      // continue with next iteration
	      return;
	    }

	    if ((0, _typeof3.default)(obj[key]) === 'object' && obj[key] !== null) {
	      var keyStart = key;
	      if (start !== '') {
	        keyStart = start + '-' + key;
	      }

	      setAttributesConfig(element, obj[key], attrs, keyStart);
	      return;
	    }

	    var attr = getAttribute(start, key);
	    element.setAttribute(attr, obj[key]);
	  });
	}

	function getAttributesConfig(element) {
	  var obj = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
	  var attrs = arguments[2];
	  var start = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : '';

	  var newObj = obj;
	  var keys = (0, _keys2.default)(obj);

	  keys.forEach(function (key) {
	    if (start === '' && attrs.indexOf(key) === -1) {
	      // continue with next iteration
	      return;
	    }

	    if (obj[key] !== null && obj[key].constructor === Object) {
	      var keyStart = key;
	      if (start !== '') {
	        keyStart = start + '-' + key;
	      }

	      newObj[key] = getAttributesConfig(element, obj[key], attrs, keyStart);
	      return;
	    }

	    // update value
	    var value = newObj[key]; // default value
	    var type = typeof value === 'undefined' ? 'undefined' : (0, _typeof3.default)(value);
	    var attr = getAttribute(start, key);
	    var attrValue = element.getAttribute(attr);

	    if (attrValue !== null) {
	      if (type === 'boolean') {
	        // convert string to boolean
	        value = attrValue === 'true';
	      } else if (!isNaN(attrValue)) {
	        value = parseInt(attrValue, 10);
	      } else {
	        value = attrValue;
	      }
	    }

	    newObj[key] = value;
	  });

	  return newObj;
	}

	var stack = [];

	exports.default = {
	  add: function add(component) {
	    stack.push(component);
	  },
	  remove: function remove(component) {
	    var index = stack.findIndex(function (c) {
	      return (0, _is2.default)(component, c);
	    });
	    if (index > -1) {
	      stack.splice(index, 1);
	    }
	  },
	  closable: function closable(component) {
	    return stack.length === 0 || (0, _is2.default)(stack[stack.length - 1], component);
	  }
	};

/***/ }),
/* 112 */
/***/ (function(module, exports, __webpack_require__) {

	module.exports = { "default": __webpack_require__(113), __esModule: true };

/***/ }),
/* 113 */
/***/ (function(module, exports, __webpack_require__) {

	__webpack_require__(114);
	module.exports = __webpack_require__(8).Object.is;


/***/ }),
/* 114 */
/***/ (function(module, exports, __webpack_require__) {

	// 19.1.3.10 Object.is(value1, value2)
	var $export = __webpack_require__(6);
	$export($export.S, 'Object', { is: __webpack_require__(115) });


/***/ }),
/* 115 */
/***/ (function(module, exports) {

	// 7.2.9 SameValue(x, y)
	module.exports = Object.is || function is(x, y) {
	  // eslint-disable-next-line no-self-compare
	  return x === y ? x !== 0 || 1 / x === 1 / y : x != x && y != y;
	};


/***/ }),
/* 116 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _getPrototypeOf = __webpack_require__(93);

	var _getPrototypeOf2 = _interopRequireDefault(_getPrototypeOf);

	var _classCallCheck2 = __webpack_require__(40);

	var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

	var _createClass2 = __webpack_require__(41);

	var _createClass3 = _interopRequireDefault(_createClass2);

	var _possibleConstructorReturn2 = __webpack_require__(96);

	var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

	var _get2 = __webpack_require__(97);

	var _get3 = _interopRequireDefault(_get2);

	var _inherits2 = __webpack_require__(101);

	var _inherits3 = _interopRequireDefault(_inherits2);

	var _events = __webpack_require__(109);

	var _events2 = _interopRequireDefault(_events);

	var _component = __webpack_require__(110);

	var _component2 = _interopRequireDefault(_component);

	var _componentManager = __webpack_require__(111);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	var Dialog = function () {
	  /**
	   * ------------------------------------------------------------------------
	   * Constants
	   * ------------------------------------------------------------------------
	   */

	  var NAME = 'dialog';
	  var VERSION = '2.0.0';
	  var BACKDROP_SELECTOR = 'dialog-backdrop';
	  var DEFAULT_PROPERTIES = {
	    element: null,
	    title: null,
	    message: null,
	    cancelable: true
	  };
	  var DATA_ATTRS_PROPERTIES = ['cancelable'];

	  /**
	   * ------------------------------------------------------------------------
	   * Class Definition
	   * ------------------------------------------------------------------------
	   */

	  var Dialog = function (_Component) {
	    (0, _inherits3.default)(Dialog, _Component);

	    function Dialog() {
	      var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
	      (0, _classCallCheck3.default)(this, Dialog);

	      var _this = (0, _possibleConstructorReturn3.default)(this, (Dialog.__proto__ || (0, _getPrototypeOf2.default)(Dialog)).call(this, NAME, VERSION, DEFAULT_PROPERTIES, options, DATA_ATTRS_PROPERTIES, true, true));

	      _this.template = '' + '<div class="dialog" tabindex="-1" role="dialog">' + '<div class="dialog-inner" role="document">' + '<div class="dialog-content">' + '<div class="dialog-header">' + '<h5 class="dialog-title"></h5>' + '</div>' + '<div class="dialog-body">' + '<p></p>' + '</div>' + '<div class="dialog-footer">' + '<button type="button" class="btn btn-primary" data-dismiss="dialog">Ok</button>' + '</div>' + '</div>' + '</div>' + '</div>';

	      if (_this.dynamicElement) {
	        _this.build();
	      }
	      return _this;
	    }

	    (0, _createClass3.default)(Dialog, [{
	      key: 'build',
	      value: function build() {
	        var builder = document.createElement('div');

	        builder.innerHTML = this.template;

	        this.options.element = builder.firstChild;

	        // title
	        if (this.options.title !== null) {
	          this.options.element.querySelector('.dialog-title').innerHTML = this.options.title;
	        }

	        // message
	        if (this.options.message !== null) {
	          this.options.element.querySelector('.dialog-body').firstChild.innerHTML = this.options.message;
	        }

	        document.body.appendChild(this.options.element);

	        this.setAttributes();
	      }
	    }, {
	      key: 'buildBackdrop',
	      value: function buildBackdrop() {
	        var backdrop = document.createElement('div');
	        backdrop.setAttribute('data-id', this.id);
	        backdrop.classList.add(BACKDROP_SELECTOR);

	        document.body.appendChild(backdrop);
	      }
	    }, {
	      key: 'getBackdrop',
	      value: function getBackdrop() {
	        return document.querySelector('.' + BACKDROP_SELECTOR + '[data-id="' + this.id + '"]');
	      }
	    }, {
	      key: 'center',
	      value: function center() {
	        var computedStyle = window.getComputedStyle(this.options.element);
	        // const width = computedStyle.width.slice(0, computedStyle.width.length - 2)
	        var height = computedStyle.height.slice(0, computedStyle.height.length - 2);

	        var top = window.innerHeight / 2 - height / 2;
	        this.options.element.style.top = top + 'px';
	      }
	    }, {
	      key: 'show',
	      value: function show() {
	        var _this2 = this;

	        if (this.options.element === null) {
	          // build and insert a new DOM element
	          this.build();
	        }

	        if (this.options.element.classList.contains('show')) {
	          return false;
	        }

	        // add a timeout so that the CSS animation works
	        setTimeout(function () {
	          _this2.triggerEvent(_events2.default.SHOW);
	          _this2.buildBackdrop();

	          var onShown = function onShown() {
	            _this2.triggerEvent(_events2.default.SHOWN);
	            _this2.options.element.removeEventListener(_events2.default.TRANSITION_END, onShown);
	          };

	          _this2.options.element.addEventListener(_events2.default.TRANSITION_END, onShown);

	          _this2.options.element.classList.add('show');
	          _this2.center();

	          // attach event
	          _this2.attachEvents();
	        }, 1);

	        return true;
	      }
	    }, {
	      key: 'onElementEvent',
	      value: function onElementEvent(event) {
	        if (event.type === 'keyup' && event.keyCode !== 27 && event.keyCode !== 13) {
	          return;
	        }

	        // hide the dialog
	        this.hide();
	      }
	    }, {
	      key: 'hide',
	      value: function hide() {
	        var _this3 = this;

	        if (!this.options.element.classList.contains('show')) {
	          return false;
	        }

	        this.triggerEvent(_events2.default.HIDE);

	        this.detachEvents();

	        this.options.element.classList.add('hide');
	        this.options.element.classList.remove('show');

	        var backdrop = this.getBackdrop();

	        var onHidden = function onHidden() {
	          document.body.removeChild(backdrop);

	          _this3.options.element.classList.remove('hide');

	          _this3.triggerEvent(_events2.default.HIDDEN);

	          backdrop.removeEventListener(_events2.default.TRANSITION_END, onHidden);

	          // remove generated dialogs from the DOM
	          if (_this3.dynamicElement) {
	            document.body.removeChild(_this3.options.element);
	            _this3.options.element = null;
	          }
	        };

	        backdrop.addEventListener(_events2.default.TRANSITION_END, onHidden);
	        backdrop.classList.add('fadeout');

	        return true;
	      }
	    }, {
	      key: 'attachEvents',
	      value: function attachEvents() {
	        var _this4 = this;

	        var dismissButtons = this.options.element.querySelectorAll('[data-dismiss]');
	        if (dismissButtons) {
	          dismissButtons.forEach(function (button) {
	            return _this4.registerElement({ target: button, event: 'click' });
	          });
	        }

	        // add events if the dialog is cancelable
	        // which means the user can hide the dialog
	        // by pressing the ESC key or click outside the backdrop
	        if (this.options.cancelable) {
	          var backdrop = this.getBackdrop();
	          this.registerElement({ target: backdrop, event: _events2.default.START });
	          this.registerElement({ target: document, event: 'keyup' });
	        }
	      }
	    }, {
	      key: 'detachEvents',
	      value: function detachEvents() {
	        var _this5 = this;

	        var dismissButtons = this.options.element.querySelectorAll('[data-dismiss]');
	        if (dismissButtons) {
	          dismissButtons.forEach(function (button) {
	            return _this5.unregisterElement({ target: button, event: 'click' });
	          });
	        }

	        if (this.options.cancelable) {
	          var backdrop = this.getBackdrop();
	          this.unregisterElement({ target: backdrop, event: _events2.default.START });
	          this.unregisterElement({ target: document, event: 'keyup' });
	        }
	      }
	    }], [{
	      key: '_DOMInterface',
	      value: function _DOMInterface(options) {
	        return (0, _get3.default)(Dialog.__proto__ || (0, _getPrototypeOf2.default)(Dialog), '_DOMInterface', this).call(this, Dialog, options);
	      }
	    }]);
	    return Dialog;
	  }(_component2.default);

	  /**
	   * ------------------------------------------------------------------------
	   * DOM Api implementation
	   * ------------------------------------------------------------------------
	   */


	  var components = [];

	  var dialogs = document.querySelectorAll('.' + NAME);
	  if (dialogs) {
	    dialogs.forEach(function (element) {
	      var config = (0, _componentManager.getAttributesConfig)(element, DEFAULT_PROPERTIES, DATA_ATTRS_PROPERTIES);
	      config.element = element;

	      components.push({ element: element, dialog: new Dialog(config) });
	    });
	  }

	  document.addEventListener('click', function (event) {
	    var dataToggleAttr = event.target.getAttribute('data-toggle');
	    if (dataToggleAttr && dataToggleAttr === NAME) {
	      var id = event.target.getAttribute('data-target');
	      var element = document.querySelector(id);

	      var component = components.find(function (c) {
	        return c.element === element;
	      });

	      if (!component) {
	        return;
	      }

	      component.dialog.show();
	    }
	  });

	  return Dialog;
	}(); /**
	      * --------------------------------------------------------------------------
	      * Licensed under MIT (https://github.com/quark-dev/Phonon-Framework/blob/master/LICENSE)
	      * --------------------------------------------------------------------------
	      */
	exports.default = Dialog;

/***/ }),
/* 117 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _isInteger = __webpack_require__(118);

	var _isInteger2 = _interopRequireDefault(_isInteger);

	var _getPrototypeOf = __webpack_require__(93);

	var _getPrototypeOf2 = _interopRequireDefault(_getPrototypeOf);

	var _classCallCheck2 = __webpack_require__(40);

	var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

	var _createClass2 = __webpack_require__(41);

	var _createClass3 = _interopRequireDefault(_createClass2);

	var _possibleConstructorReturn2 = __webpack_require__(96);

	var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

	var _get2 = __webpack_require__(97);

	var _get3 = _interopRequireDefault(_get2);

	var _inherits2 = __webpack_require__(101);

	var _inherits3 = _interopRequireDefault(_inherits2);

	var _events = __webpack_require__(109);

	var _events2 = _interopRequireDefault(_events);

	var _component = __webpack_require__(110);

	var _component2 = _interopRequireDefault(_component);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	/**
	* --------------------------------------------------------------------------
	* Licensed under MIT (https://github.com/quark-dev/Phonon-Framework/blob/master/LICENSE)
	* --------------------------------------------------------------------------
	*/
	var Notification = function () {
	  /**
	   * ------------------------------------------------------------------------
	  * Constants
	  * ------------------------------------------------------------------------
	  */

	  var NAME = 'notification';
	  var VERSION = '2.0.0';
	  var DEFAULT_PROPERTIES = {
	    element: null,
	    message: '',
	    showButton: true,
	    timeout: null,
	    background: 'primary'
	  };
	  var DATA_ATTRS_PROPERTIES = ['timeout'];

	  /**
	   * ------------------------------------------------------------------------
	   * Class Definition
	   * ------------------------------------------------------------------------
	   */

	  var Notification = function (_Component) {
	    (0, _inherits3.default)(Notification, _Component);

	    function Notification() {
	      var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
	      (0, _classCallCheck3.default)(this, Notification);

	      var _this = (0, _possibleConstructorReturn3.default)(this, (Notification.__proto__ || (0, _getPrototypeOf2.default)(Notification)).call(this, NAME, VERSION, DEFAULT_PROPERTIES, options, DATA_ATTRS_PROPERTIES, true, false));

	      _this.template = '' + '<div class="notification">' + '<div class="notification-inner">' + '<div class="message"></div>' + '<button type="button" class="close" data-dismiss="notification" aria-label="Close">' + '<span aria-hidden="true">&times;</span>' + '</button>' + '</div>' + '</div>';

	      if (_this.dynamicElement) {
	        _this.build();
	      }

	      _this.timeoutCallback = null;
	      return _this;
	    }

	    (0, _createClass3.default)(Notification, [{
	      key: 'build',
	      value: function build() {
	        var builder = document.createElement('div');

	        builder.innerHTML = this.template;

	        this.options.element = builder.firstChild;

	        // text message
	        this.options.element.querySelector('.message').innerHTML = this.options.message;

	        if (!this.options.showButton) {
	          this.options.element.querySelector('button').style.display = 'none';
	        }

	        document.body.appendChild(this.options.element);

	        this.setAttributes();
	      }
	    }, {
	      key: 'show',
	      value: function show() {
	        var _this2 = this;

	        if (this.options.element === null) {
	          // build and insert a new DOM element
	          this.build();
	        }

	        if (this.options.element.classList.contains('show')) {
	          return false;
	        }

	        // reset color
	        if (this.options.background) {
	          this.options.element.removeAttribute('class');
	          this.options.element.setAttribute('class', 'notification');

	          this.options.element.classList.add('bg-' + this.options.background);
	          this.options.element.querySelector('button').classList.add('btn-' + this.options.background);
	        }

	        if (this.options.showButton) {
	          // attach the button handler
	          var buttonElement = this.options.element.querySelector('button');
	          this.registerElement({ target: buttonElement, event: 'click' });
	        }

	        setTimeout(function () {
	          _this2.options.element.classList.add('show');
	          _this2.triggerEvent(_events2.default.SHOW);

	          var onShown = function onShown() {
	            _this2.triggerEvent(_events2.default.SHOWN);
	            _this2.options.element.removeEventListener(_events2.default.TRANSITION_END, onShown);
	          };

	          _this2.options.element.addEventListener(_events2.default.TRANSITION_END, onShown);
	        }, 1);

	        if ((0, _isInteger2.default)(this.options.timeout) && this.options.timeout > 0) {
	          // if there is a timeout, auto hide the notification
	          this.timeoutCallback = setTimeout(function () {
	            _this2.hide();
	          }, this.options.timeout + 1);
	        }

	        return true;
	      }
	    }, {
	      key: 'hide',
	      value: function hide() {
	        var _this3 = this;

	        /*
	         * prevent to close a notification with a timeout
	         * if the user has already clicked on the button
	         */
	        if (this.timeoutCallback) {
	          clearTimeout(this.timeoutCallback);
	          this.timeoutCallback = null;
	        }

	        if (!this.options.element.classList.contains('show')) {
	          return false;
	        }

	        this.triggerEvent(_events2.default.HIDE);

	        if (this.options.showButton) {
	          var buttonElement = this.options.element.querySelector('button');
	          this.unregisterElement({ target: buttonElement, event: 'click' });
	        }

	        this.options.element.classList.remove('show');
	        this.options.element.classList.add('hide');

	        var onHidden = function onHidden() {
	          _this3.options.element.removeEventListener(_events2.default.TRANSITION_END, onHidden);
	          _this3.options.element.classList.remove('hide');

	          _this3.triggerEvent(_events2.default.HIDDEN);

	          if (_this3.dynamicElement) {
	            document.body.removeChild(_this3.options.element);
	            _this3.options.element = null;
	          }
	        };

	        this.options.element.addEventListener(_events2.default.TRANSITION_END, onHidden);

	        return true;
	      }
	    }, {
	      key: 'onElementEvent',
	      value: function onElementEvent() {
	        this.hide();
	      }
	    }], [{
	      key: '_DOMInterface',
	      value: function _DOMInterface(options) {
	        return (0, _get3.default)(Notification.__proto__ || (0, _getPrototypeOf2.default)(Notification), '_DOMInterface', this).call(this, Notification, options);
	      }
	    }]);
	    return Notification;
	  }(_component2.default);

	  return Notification;
	}();

	exports.default = Notification;

/***/ }),
/* 118 */
/***/ (function(module, exports, __webpack_require__) {

	module.exports = { "default": __webpack_require__(119), __esModule: true };

/***/ }),
/* 119 */
/***/ (function(module, exports, __webpack_require__) {

	__webpack_require__(120);
	module.exports = __webpack_require__(8).Number.isInteger;


/***/ }),
/* 120 */
/***/ (function(module, exports, __webpack_require__) {

	// 20.1.2.3 Number.isInteger(number)
	var $export = __webpack_require__(6);

	$export($export.S, 'Number', { isInteger: __webpack_require__(121) });


/***/ }),
/* 121 */
/***/ (function(module, exports, __webpack_require__) {

	// 20.1.2.3 Number.isInteger(number)
	var isObject = __webpack_require__(14);
	var floor = Math.floor;
	module.exports = function isInteger(it) {
	  return !isObject(it) && isFinite(it) && floor(it) === it;
	};


/***/ }),
/* 122 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _assign = __webpack_require__(3);

	var _assign2 = _interopRequireDefault(_assign);

	var _classCallCheck2 = __webpack_require__(40);

	var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

	var _createClass2 = __webpack_require__(41);

	var _createClass3 = _interopRequireDefault(_createClass2);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	/**
	 * --------------------------------------------------------------------------
	 * Licensed under MIT (https://github.com/quark-dev/Phonon-Framework/blob/master/LICENSE)
	 * --------------------------------------------------------------------------
	 */

	var Collapse = function () {
	  /**
	   * ------------------------------------------------------------------------
	   * Constants
	   * ------------------------------------------------------------------------
	   */

	  var NAME = 'collapse';
	  var VERSION = '2.0.0';
	  var DEFAULT_PROPERTIES = {
	    element: null,
	    toggle: false

	    /**
	     * ------------------------------------------------------------------------
	     * Class Definition
	     * ------------------------------------------------------------------------
	     */

	  };
	  var Collapse = function () {
	    function Collapse() {
	      var _this = this;

	      var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
	      (0, _classCallCheck3.default)(this, Collapse);

	      this.options = (0, _assign2.default)(DEFAULT_PROPERTIES, options);

	      if (typeof this.options.element === 'string') {
	        this.options.element = document.querySelector(this.options.element);
	      }

	      if (this.options.element === null) {
	        throw new Error(NAME + '. The element is not a HTMLElement.');
	      }

	      this.clickTargetHandler = function (event) {
	        _this.toggle(event);
	      };

	      // buttons

	      // [1] href
	      document.querySelector('[href="#collapseExample"]').addEventListener('click', this.clickTargetHandler);

	      // [2] data-target
	      document.querySelector('[data-target="#collapseExample"]').addEventListener('click', this.clickTargetHandler);
	    }

	    (0, _createClass3.default)(Collapse, [{
	      key: 'toggle',
	      value: function toggle() {
	        document.querySelector('#collapseExample').classList.add('collapsing');

	        setTimeout(function () {
	          document.querySelector('#collapseExample').classList.remove('collapsing');
	          document.querySelector('#collapseExample').classList.toggle('show');
	        }, 600);
	      }
	    }], [{
	      key: '_DOMInterface',
	      value: function _DOMInterface(options) {
	        return new Collapse(options);
	      }
	    }, {
	      key: 'version',
	      get: function get() {
	        return NAME + '.' + VERSION;
	      }
	    }]);
	    return Collapse;
	  }();

	  return Collapse;
	}();

	exports.default = Collapse;

/***/ }),
/* 123 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _getPrototypeOf = __webpack_require__(93);

	var _getPrototypeOf2 = _interopRequireDefault(_getPrototypeOf);

	var _classCallCheck2 = __webpack_require__(40);

	var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

	var _createClass2 = __webpack_require__(41);

	var _createClass3 = _interopRequireDefault(_createClass2);

	var _possibleConstructorReturn2 = __webpack_require__(96);

	var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

	var _get2 = __webpack_require__(97);

	var _get3 = _interopRequireDefault(_get2);

	var _inherits2 = __webpack_require__(101);

	var _inherits3 = _interopRequireDefault(_inherits2);

	var _component = __webpack_require__(110);

	var _component2 = _interopRequireDefault(_component);

	var _events = __webpack_require__(109);

	var _events2 = _interopRequireDefault(_events);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	/**
	 * --------------------------------------------------------------------------
	 * Licensed under MIT (https://github.com/quark-dev/Phonon-Framework/blob/master/LICENSE)
	 * --------------------------------------------------------------------------
	 */
	var Progress = function () {
	  /**
	   * ------------------------------------------------------------------------
	   * Constants
	   * ------------------------------------------------------------------------
	   */

	  var NAME = 'progress';
	  var VERSION = '2.0.0';
	  var DEFAULT_PROPERTIES = {
	    element: null,
	    height: 5,
	    min: 0,
	    max: 100,
	    label: false,
	    striped: false,
	    background: null
	  };
	  var DATA_ATTRS_PROPERTIES = ['height', 'min', 'max', 'label', 'striped', 'background'];

	  /**
	   * ------------------------------------------------------------------------
	   * Class Definition
	   * ------------------------------------------------------------------------
	   */

	  var Progress = function (_Component) {
	    (0, _inherits3.default)(Progress, _Component);

	    function Progress() {
	      var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
	      (0, _classCallCheck3.default)(this, Progress);

	      // set the wanted height
	      var _this = (0, _possibleConstructorReturn3.default)(this, (Progress.__proto__ || (0, _getPrototypeOf2.default)(Progress)).call(this, NAME, VERSION, DEFAULT_PROPERTIES, options, DATA_ATTRS_PROPERTIES, false, false));

	      _this.options.element.style.height = _this.options.height + 'px';

	      // set min and max values
	      var progressBar = _this.getProgressBar();
	      progressBar.setAttribute('aria-valuemin', '' + _this.options.min);
	      progressBar.setAttribute('aria-valuemax', '' + _this.options.max);

	      // set striped
	      if (_this.options.striped && !progressBar.classList.contains('progress-bar-striped')) {
	        progressBar.classList.add('progress-bar-striped');
	      }

	      // set background
	      if (typeof _this.options.background === 'string' && !progressBar.classList.contains('bg-' + _this.options.background)) {
	        progressBar.classList.add('bg-' + _this.options.background);
	      }
	      return _this;
	    }

	    (0, _createClass3.default)(Progress, [{
	      key: 'getProgressBar',
	      value: function getProgressBar() {
	        return this.options.element.querySelector('.progress-bar');
	      }
	    }, {
	      key: 'set',
	      value: function set() {
	        var value = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;

	        var progressBar = this.getProgressBar();
	        var progress = Math.round(value / (this.options.min + this.options.max) * 100);

	        if (value < this.options.min) {
	          console.error(NAME + '. Warning, ' + value + ' is under min value.');
	          return false;
	        }

	        if (value > this.options.max) {
	          console.error(NAME + '. Warning, ' + value + ' is above max value.');
	          return false;
	        }

	        progressBar.setAttribute('aria-valuenow', '' + value);

	        // set label
	        if (this.options.label) {
	          progressBar.innerHTML = progress + '%';
	        }

	        // set percentage
	        progressBar.style.width = progress + '%';

	        return true;
	      }
	    }, {
	      key: 'animate',
	      value: function animate() {
	        var startAnimation = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : true;

	        if (!this.options.striped) {
	          console.error(NAME + '. Animation works only with striped progress.');
	          return false;
	        }

	        var progressBar = this.getProgressBar();

	        if (startAnimation && !progressBar.classList.contains('progress-bar-animated')) {
	          progressBar.classList.add('progress-bar-animated');
	        }

	        if (!startAnimation && progressBar.classList.contains('progress-bar-animated')) {
	          progressBar.classList.remove('progress-bar-animated');
	        }

	        return true;
	      }
	    }, {
	      key: 'show',
	      value: function show() {
	        this.options.element.style.height = this.options.height + 'px';
	        this.triggerEvent(_events2.default.SHOW);
	        this.triggerEvent(_events2.default.SHOWN);

	        return true;
	      }
	    }, {
	      key: 'hide',
	      value: function hide() {
	        this.options.element.style.height = '0px';
	        this.triggerEvent(_events2.default.HIDE);
	        this.triggerEvent(_events2.default.HIDDEN);

	        return true;
	      }
	    }], [{
	      key: '_DOMInterface',
	      value: function _DOMInterface(options) {
	        return (0, _get3.default)(Progress.__proto__ || (0, _getPrototypeOf2.default)(Progress), '_DOMInterface', this).call(this, Progress, options);
	      }
	    }]);
	    return Progress;
	  }(_component2.default);

	  return Progress;
	}();

	exports.default = Progress;

/***/ }),
/* 124 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _getPrototypeOf = __webpack_require__(93);

	var _getPrototypeOf2 = _interopRequireDefault(_getPrototypeOf);

	var _classCallCheck2 = __webpack_require__(40);

	var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

	var _createClass2 = __webpack_require__(41);

	var _createClass3 = _interopRequireDefault(_createClass2);

	var _possibleConstructorReturn2 = __webpack_require__(96);

	var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

	var _get2 = __webpack_require__(97);

	var _get3 = _interopRequireDefault(_get2);

	var _inherits2 = __webpack_require__(101);

	var _inherits3 = _interopRequireDefault(_inherits2);

	var _component = __webpack_require__(110);

	var _component2 = _interopRequireDefault(_component);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	var Loader = function () {
	  /**
	   * ------------------------------------------------------------------------
	   * Constants
	   * ------------------------------------------------------------------------
	   */

	  var NAME = 'loader';
	  var VERSION = '2.0.0';
	  var DEFAULT_PROPERTIES = {
	    element: null,
	    color: null,
	    size: null
	  };
	  var DATA_ATTRS_PROPERTIES = [];

	  /**
	   * ------------------------------------------------------------------------
	   * Class Definition
	   * ------------------------------------------------------------------------
	   */

	  var Loader = function (_Component) {
	    (0, _inherits3.default)(Loader, _Component);

	    function Loader() {
	      var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
	      (0, _classCallCheck3.default)(this, Loader);

	      // set color
	      var _this = (0, _possibleConstructorReturn3.default)(this, (Loader.__proto__ || (0, _getPrototypeOf2.default)(Loader)).call(this, NAME, VERSION, DEFAULT_PROPERTIES, options, DATA_ATTRS_PROPERTIES, false, false));

	      var loaderSpinner = _this.getSpinner();
	      if (typeof _this.options.color === 'string' && !loaderSpinner.classList.contains('color-' + _this.options.color)) {
	        loaderSpinner.classList.add('color-' + _this.options.color);
	      }

	      _this.customSize = _this.options.size !== null;
	      return _this;
	    }

	    (0, _createClass3.default)(Loader, [{
	      key: 'getClientSize',
	      value: function getClientSize() {
	        if (!this.customSize) {
	          var size = this.options.element.getBoundingClientRect();
	          return size.height;
	        }

	        return this.options.size;
	      }
	    }, {
	      key: 'getSpinner',
	      value: function getSpinner() {
	        return this.options.element.querySelector('.loader-spinner');
	      }
	    }, {
	      key: 'show',
	      value: function show() {
	        if (this.options.element.classList.contains('hide')) {
	          this.options.element.classList.remove('hide');
	        }

	        var size = this.getClientSize();
	        this.options.size = size;

	        if (this.customSize) {
	          this.options.element.style.width = this.options.size + 'px';
	          this.options.element.style.height = this.options.size + 'px';

	          var loaderSpinner = this.getSpinner();
	          loaderSpinner.style.width = this.options.size + 'px';
	          loaderSpinner.style.height = this.options.size + 'px';
	        }

	        return true;
	      }
	    }, {
	      key: 'animate',
	      value: function animate() {
	        var startAnimation = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : true;

	        if (startAnimation) {
	          this.show();
	        } else {
	          this.hide();
	        }

	        var loaderSpinner = this.getSpinner();

	        if (startAnimation && !loaderSpinner.classList.contains('loader-spinner-animated')) {
	          loaderSpinner.classList.add('loader-spinner-animated');
	          return true;
	        }

	        if (!startAnimation && loaderSpinner.classList.contains('loader-spinner-animated')) {
	          loaderSpinner.classList.remove('loader-spinner-animated');
	        }

	        return true;
	      }
	    }, {
	      key: 'hide',
	      value: function hide() {
	        if (!this.options.element.classList.contains('hide')) {
	          this.options.element.classList.add('hide');
	        }

	        return true;
	      }
	    }], [{
	      key: '_DOMInterface',
	      value: function _DOMInterface(options) {
	        return (0, _get3.default)(Loader.__proto__ || (0, _getPrototypeOf2.default)(Loader), '_DOMInterface', this).call(this, Loader, options);
	      }
	    }]);
	    return Loader;
	  }(_component2.default);

	  return Loader;
	}(); /**
	      * --------------------------------------------------------------------------
	      * Licensed under MIT (https://github.com/quark-dev/Phonon-Framework/blob/master/LICENSE)
	      * --------------------------------------------------------------------------
	      */
	exports.default = Loader;

/***/ }),
/* 125 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _getPrototypeOf = __webpack_require__(93);

	var _getPrototypeOf2 = _interopRequireDefault(_getPrototypeOf);

	var _classCallCheck2 = __webpack_require__(40);

	var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

	var _createClass2 = __webpack_require__(41);

	var _createClass3 = _interopRequireDefault(_createClass2);

	var _possibleConstructorReturn2 = __webpack_require__(96);

	var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

	var _get2 = __webpack_require__(97);

	var _get3 = _interopRequireDefault(_get2);

	var _inherits2 = __webpack_require__(101);

	var _inherits3 = _interopRequireDefault(_inherits2);

	var _events = __webpack_require__(109);

	var _events2 = _interopRequireDefault(_events);

	var _component = __webpack_require__(110);

	var _component2 = _interopRequireDefault(_component);

	var _componentManager = __webpack_require__(111);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	var OffCanvas = function () {
	  /**
	   * ------------------------------------------------------------------------
	   * Constants
	   * ------------------------------------------------------------------------
	   */

	  var NAME = 'off-canvas';
	  var VERSION = '2.0.0';
	  var BACKDROP_SELECTOR = 'off-canvas-backdrop';
	  var DEFAULT_PROPERTIES = {
	    element: null,
	    aside: {
	      md: false,
	      lg: false,
	      xl: false
	    }
	  };
	  var DATA_ATTRS_PROPERTIES = ['aside'];

	  /**
	   * ------------------------------------------------------------------------
	   * Class Definition
	   * ------------------------------------------------------------------------
	   */

	  var OffCanvas = function (_Component) {
	    (0, _inherits3.default)(OffCanvas, _Component);

	    function OffCanvas() {
	      var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
	      (0, _classCallCheck3.default)(this, OffCanvas);

	      var _this = (0, _possibleConstructorReturn3.default)(this, (OffCanvas.__proto__ || (0, _getPrototypeOf2.default)(OffCanvas)).call(this, NAME, VERSION, DEFAULT_PROPERTIES, options, DATA_ATTRS_PROPERTIES, false, true));

	      _this.useBackdrop = true;
	      _this.currentWidth = null;
	      _this.animate = true;

	      var sm = { name: 'sm', media: window.matchMedia('(min-width: 1px)') };
	      var md = { name: 'md', media: window.matchMedia('(min-width: 768px)') };
	      var lg = { name: 'lg', media: window.matchMedia('(min-width: 992px)') };
	      var xl = { name: 'xl', media: window.matchMedia('(min-width: 1200px)') };

	      var sizes = [sm, md, lg, xl].reverse();

	      var checkWidth = function checkWidth() {
	        if (!('matchMedia' in window)) {
	          return;
	        }

	        sizes.every(function (size) {
	          var match = size.media.media.match(/[a-z]?-width:\s?([0-9]+)/);

	          if (match) {
	            if (size.media.matches) {
	              if (_this.currentWidth !== size.name) {
	                _this.setAside(size.name);
	              }
	              _this.currentWidth = size.name;
	              return false;
	            }
	          }

	          return true;
	        });
	      };

	      checkWidth();
	      window.addEventListener('resize', checkWidth, false);
	      return _this;
	    }

	    (0, _createClass3.default)(OffCanvas, [{
	      key: 'preventClosable',
	      value: function preventClosable() {
	        return (0, _get3.default)(OffCanvas.prototype.__proto__ || (0, _getPrototypeOf2.default)(OffCanvas.prototype), 'preventClosable', this).call(this) || this.options.aside[this.currentWidth] === true;
	      }
	    }, {
	      key: 'setAside',
	      value: function setAside(name) {
	        var content = document.body;

	        if (this.options.aside[name] === true) {
	          if (!content.classList.contains('off-canvas-aside')) {
	            content.classList.add('off-canvas-aside');
	          }

	          this.useBackdrop = false;

	          // avoid animation by setting animate to false
	          this.animate = false;
	          this.show();
	          // remove previous backdrop
	          this.removeBackdrop();
	        } else {
	          if (content.classList.contains('off-canvas-aside')) {
	            content.classList.remove('off-canvas-aside');
	          }

	          this.hide();
	          this.useBackdrop = true;
	          this.animate = true;
	        }
	      }
	    }, {
	      key: 'onElementEvent',
	      value: function onElementEvent(event) {
	        if (event.type === 'keyup' && event.keyCode !== 27 && event.keyCode !== 13) {
	          return;
	        }

	        // hide the off-canvas
	        this.hide();
	      }
	    }, {
	      key: 'show',
	      value: function show() {
	        var _this2 = this;

	        if (this.options.element.classList.contains('show')) {
	          return false;
	        }

	        // add a timeout so that the CSS animation works
	        setTimeout(function () {
	          _this2.triggerEvent(_events2.default.SHOW);

	          var onShown = function onShown() {
	            _this2.triggerEvent(_events2.default.SHOWN);

	            if (_this2.animate) {
	              _this2.options.element.removeEventListener(_events2.default.TRANSITION_END, onShown);
	              _this2.options.element.classList.remove('animate');
	            }
	          };

	          if (_this2.useBackdrop) {
	            _this2.createBackdrop();
	          }

	          if (_this2.animate) {
	            _this2.options.element.addEventListener(_events2.default.TRANSITION_END, onShown);
	            _this2.options.element.classList.add('animate');
	          } else {
	            // directly trigger the onShown
	            onShown();
	          }

	          _this2.options.element.classList.add('show');

	          // attach event
	          _this2.attachEvents();
	        }, 1);

	        return true;
	      }
	    }, {
	      key: 'hide',
	      value: function hide() {
	        var _this3 = this;

	        if (!this.options.element.classList.contains('show')) {
	          return false;
	        }

	        this.triggerEvent(_events2.default.HIDE);

	        this.detachEvents();

	        if (this.animate) {
	          this.options.element.classList.add('animate');
	        }

	        this.options.element.classList.remove('show');

	        if (this.useBackdrop) {
	          var backdrop = this.getBackdrop();

	          var onHidden = function onHidden() {
	            if (_this3.animate) {
	              _this3.options.element.classList.remove('animate');
	            }

	            backdrop.removeEventListener(_events2.default.TRANSITION_END, onHidden);
	            _this3.triggerEvent(_events2.default.HIDDEN);
	            _this3.removeBackdrop();
	          };

	          backdrop.addEventListener(_events2.default.TRANSITION_END, onHidden);
	          backdrop.classList.add('fadeout');
	        }

	        return true;
	      }
	    }, {
	      key: 'createBackdrop',
	      value: function createBackdrop() {
	        var backdrop = document.createElement('div');
	        backdrop.setAttribute('data-id', this.id);
	        backdrop.classList.add(BACKDROP_SELECTOR);

	        document.body.appendChild(backdrop);
	      }
	    }, {
	      key: 'getBackdrop',
	      value: function getBackdrop() {
	        return document.querySelector('.' + BACKDROP_SELECTOR + '[data-id="' + this.id + '"]');
	      }
	    }, {
	      key: 'removeBackdrop',
	      value: function removeBackdrop() {
	        var backdrop = this.getBackdrop();
	        if (backdrop) {
	          document.body.removeChild(backdrop);
	        }
	      }
	    }, {
	      key: 'attachEvents',
	      value: function attachEvents() {
	        var _this4 = this;

	        var dismissButtons = this.options.element.querySelectorAll('[data-dismiss]');

	        if (dismissButtons) {
	          dismissButtons.forEach(function (button) {
	            return _this4.registerElement({ target: button, event: 'click' });
	          });
	        }

	        if (this.useBackdrop) {
	          var backdrop = this.getBackdrop();
	          this.registerElement({ target: backdrop, event: _events2.default.START });
	        }

	        this.registerElement({ target: document, event: 'keyup' });
	      }
	    }, {
	      key: 'detachEvents',
	      value: function detachEvents() {
	        var _this5 = this;

	        var dismissButtons = this.options.element.querySelectorAll('[data-dismiss]');

	        if (dismissButtons) {
	          dismissButtons.forEach(function (button) {
	            return _this5.unregisterElement({ target: button, event: 'click' });
	          });
	        }

	        if (this.useBackdrop) {
	          var backdrop = this.getBackdrop();
	          this.unregisterElement({ target: backdrop, event: _events2.default.START });
	        }

	        this.unregisterElement({ target: document, event: 'keyup' });
	      }
	    }], [{
	      key: '_DOMInterface',
	      value: function _DOMInterface(options) {
	        return (0, _get3.default)(OffCanvas.__proto__ || (0, _getPrototypeOf2.default)(OffCanvas), '_DOMInterface', this).call(this, OffCanvas, options);
	      }
	    }]);
	    return OffCanvas;
	  }(_component2.default);

	  /**
	   * ------------------------------------------------------------------------
	   * DOM Api implementation
	   * ------------------------------------------------------------------------
	   */


	  var components = [];

	  var offCanvas = document.querySelectorAll('.' + NAME);
	  if (offCanvas) {
	    offCanvas.forEach(function (element) {
	      var config = (0, _componentManager.getAttributesConfig)(element, DEFAULT_PROPERTIES, DATA_ATTRS_PROPERTIES);
	      config.element = element;

	      components.push({ element: element, offCanvas: new OffCanvas(config) });
	    });
	  }

	  document.addEventListener('click', function (event) {
	    var dataToggleAttr = event.target.getAttribute('data-toggle');
	    if (dataToggleAttr && dataToggleAttr === NAME) {
	      var id = event.target.getAttribute('data-target');
	      var element = document.querySelector(id);

	      var component = components.find(function (c) {
	        return c.element === element;
	      });

	      if (!component) {
	        return;
	      }

	      component.offCanvas.show();
	    }
	  });

	  return OffCanvas;
	}(); /**
	      * --------------------------------------------------------------------------
	      * Licensed under MIT (https://github.com/quark-dev/Phonon-Framework/blob/master/LICENSE)
	      * --------------------------------------------------------------------------
	      */
	exports.default = OffCanvas;

/***/ })
/******/ ]);