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

	var _ajax = __webpack_require__(77);

	var _ajax2 = _interopRequireDefault(_ajax);

	var _platform = __webpack_require__(78);

	var _intl = __webpack_require__(81);

	var _intl2 = _interopRequireDefault(_intl);

	__webpack_require__(87);

	__webpack_require__(88);

	__webpack_require__(89);

	var _notification = __webpack_require__(90);

	var _notification2 = _interopRequireDefault(_notification);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	// visual components (ui)
	/**
	 * --------------------------------------------------------------------------
	 * Licensed under MIT (https://github.com/quark-dev/Phonon-Framework/blob/master/LICENSE)
	 * --------------------------------------------------------------------------
	 */

	// core
	var api = {};

	/**
	 * ------------------------------------------------------------------------
	 * Configuration
	 * ------------------------------------------------------------------------
	 */
	api.config = {
	  // global config
	  debug: true

	  /**
	   * ------------------------------------------------------------------------
	   * Pager
	   * ------------------------------------------------------------------------
	   */
	};api.pager = function () {
	  var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

	  if (typeof api._pager === 'undefined') {
	    api._pager = _index2.default._DOMInterface(options.hashPrefix, options.useHash, options.defaultPage, options.animatePages);
	  }
	  return api._pager;
	};

	/**
	 * ------------------------------------------------------------------------
	 * Platform
	 * ------------------------------------------------------------------------
	 */

	api.platform = (0, _platform.platform)();

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
	 * Notification
	 * ------------------------------------------------------------------------
	 */
	api.notification = _notification2.default._DOMInterface;

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

	var _classCallCheck2 = __webpack_require__(3);

	var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

	var _createClass2 = __webpack_require__(4);

	var _createClass3 = _interopRequireDefault(_createClass2);

	var _page = __webpack_require__(23);

	var _page2 = _interopRequireDefault(_page);

	var _utils = __webpack_require__(76);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	/**
	 * --------------------------------------------------------------------------
	 * Licensed under MIT (https://github.com/quark-dev/Phonon-Framework/blob/master/LICENSE)
	 * --------------------------------------------------------------------------
	 */

	var Pager = function () {
	  /**
	   * ------------------------------------------------------------------------
	   * Constants
	   * ------------------------------------------------------------------------
	   */

	  var NAME = 'pager';
	  var VERSION = '2.0.0';

	  var Event = {
	    PAGE: {
	      SHOW: 'show',
	      SHOWN: 'shown',
	      HIDE: 'hide',
	      HIDDEN: 'hidden',
	      HASH: 'hash'
	    }
	  };

	  var RENDER_SELECTOR = '[data-render]';

	  var currentPage = void 0;
	  var oldPage = void 0;
	  /**
	   * ------------------------------------------------------------------------
	   * Class Definition
	   * ------------------------------------------------------------------------
	   */

	  var Pager = function () {

	    /**
	     * @constructor
	     *
	     * @param hashPrefix {String}
	     * @param useHash {Boolean}
	     * @param defaultPage {String|Null}
	     */
	    function Pager() {
	      var hashPrefix = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '#!';
	      var useHash = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;
	      var defaultPage = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;
	      var animatePages = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : true;
	      (0, _classCallCheck3.default)(this, Pager);

	      this.pages = [];
	      this.hashPrefix = hashPrefix;
	      this.useHash = useHash;
	      this.started = false;
	      this.defaultPage = defaultPage;
	      this.animatePages = animatePages;

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
	        return window.location.hash.split(this.hashPrefix)[1];
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
	        window.location.hash = this.hashPrefix + '/' + pageName;
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
	          (0, _utils.loadFile)(pageModel.getTemplate(), function (template) {
	            var render = function render(DOMPage, template, elements) {
	              if (elements) {
	                elements.forEach(function (el) {
	                  el.innerHTML = template;
	                });
	              } else {
	                DOMPage.innerHTML = template;
	              }
	            };

	            if (pageModel.getRenderFunction()) {
	              render = pageModel.getRenderFunction();
	            }

	            render(newPage, template, newPage.querySelectorAll(RENDER_SELECTOR));
	          }, null);
	        }
	        // end

	        if (oldPage) {
	          var _oldPageName = oldPage.getAttribute('data-page');
	          // use of prototype-oriented language
	          oldPage.back = back;
	          oldPage.previousPageName = _oldPageName;

	          if (this.animatePages) {
	            oldPage.addEventListener('animationend', function (event) {
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
	        var pageModels = this.getPagesModel(this.selectorToArray(this.cachePageSelector), true);
	        pageModels.forEach(function (page) {
	          page.useTemplate(templatePath);
	        });
	        this.cachePageSelector = null;
	      }
	    }, {
	      key: 'useTemplateRenderer',
	      value: function useTemplateRenderer(renderFunction) {
	        var pageModels = this.getPagesModel(this.selectorToArray(this.cachePageSelector), true);
	        pageModels.forEach(function (page) {
	          page.useTemplateRenderer(renderFunction);
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
	        var target = event.target;
	        var pageName = target.getAttribute('data-navigate');
	        var pushPage = !(target.getAttribute('data-pop-page') === 'true');

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
	          if (this.useHash) {
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

	        target.removeEventListener('animationend', function (event) {
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
	       *
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
	          throw new Error('The app has been already started.');
	        }

	        this.started = true;

	        // force default page on Cordova
	        if (window.cordova) {
	          forceDefaultPage = true;
	        }

	        var pageName = this.getPageFromHash();
	        if (!this.getPageModel(pageName)) {
	          pageName = this.defaultPage;
	        }

	        if (forceDefaultPage & !this.defaultPage) {
	          throw new Error('The default page must exist for forcing its launch!');
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
	        if (this.useHash) {
	          this.setHash(pageName);
	        }

	        this.showPage(forceDefaultPage ? this.defaultPage : pageName);
	      }

	      // static

	    }], [{
	      key: '_DOMInterface',
	      value: function _DOMInterface(hashPrefix, useHash, defaultPage, animatePages) {
	        return new Pager(hashPrefix, useHash, defaultPage, animatePages);
	      }
	    }, {
	      key: 'version',
	      get: function get() {
	        return VERSION;
	      }
	    }]);
	    return Pager;
	  }();

	  return Pager;
	}();

	exports.default = Pager;

/***/ }),
/* 3 */
/***/ (function(module, exports) {

	"use strict";

	exports.__esModule = true;

	exports.default = function (instance, Constructor) {
	  if (!(instance instanceof Constructor)) {
	    throw new TypeError("Cannot call a class as a function");
	  }
	};

/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

	"use strict";

	exports.__esModule = true;

	var _defineProperty = __webpack_require__(5);

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
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

	module.exports = { "default": __webpack_require__(6), __esModule: true };

/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

	__webpack_require__(7);
	var $Object = __webpack_require__(10).Object;
	module.exports = function defineProperty(it, key, desc) {
	  return $Object.defineProperty(it, key, desc);
	};


/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

	var $export = __webpack_require__(8);
	// 19.1.2.4 / 15.2.3.6 Object.defineProperty(O, P, Attributes)
	$export($export.S + $export.F * !__webpack_require__(18), 'Object', { defineProperty: __webpack_require__(14).f });


/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

	var global = __webpack_require__(9);
	var core = __webpack_require__(10);
	var ctx = __webpack_require__(11);
	var hide = __webpack_require__(13);
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
/* 9 */
/***/ (function(module, exports) {

	// https://github.com/zloirock/core-js/issues/86#issuecomment-115759028
	var global = module.exports = typeof window != 'undefined' && window.Math == Math
	  ? window : typeof self != 'undefined' && self.Math == Math ? self
	  // eslint-disable-next-line no-new-func
	  : Function('return this')();
	if (typeof __g == 'number') __g = global; // eslint-disable-line no-undef


/***/ }),
/* 10 */
/***/ (function(module, exports) {

	var core = module.exports = { version: '2.5.1' };
	if (typeof __e == 'number') __e = core; // eslint-disable-line no-undef


/***/ }),
/* 11 */
/***/ (function(module, exports, __webpack_require__) {

	// optional / simple context binding
	var aFunction = __webpack_require__(12);
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
/* 12 */
/***/ (function(module, exports) {

	module.exports = function (it) {
	  if (typeof it != 'function') throw TypeError(it + ' is not a function!');
	  return it;
	};


/***/ }),
/* 13 */
/***/ (function(module, exports, __webpack_require__) {

	var dP = __webpack_require__(14);
	var createDesc = __webpack_require__(22);
	module.exports = __webpack_require__(18) ? function (object, key, value) {
	  return dP.f(object, key, createDesc(1, value));
	} : function (object, key, value) {
	  object[key] = value;
	  return object;
	};


/***/ }),
/* 14 */
/***/ (function(module, exports, __webpack_require__) {

	var anObject = __webpack_require__(15);
	var IE8_DOM_DEFINE = __webpack_require__(17);
	var toPrimitive = __webpack_require__(21);
	var dP = Object.defineProperty;

	exports.f = __webpack_require__(18) ? Object.defineProperty : function defineProperty(O, P, Attributes) {
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
/* 15 */
/***/ (function(module, exports, __webpack_require__) {

	var isObject = __webpack_require__(16);
	module.exports = function (it) {
	  if (!isObject(it)) throw TypeError(it + ' is not an object!');
	  return it;
	};


/***/ }),
/* 16 */
/***/ (function(module, exports) {

	module.exports = function (it) {
	  return typeof it === 'object' ? it !== null : typeof it === 'function';
	};


/***/ }),
/* 17 */
/***/ (function(module, exports, __webpack_require__) {

	module.exports = !__webpack_require__(18) && !__webpack_require__(19)(function () {
	  return Object.defineProperty(__webpack_require__(20)('div'), 'a', { get: function () { return 7; } }).a != 7;
	});


/***/ }),
/* 18 */
/***/ (function(module, exports, __webpack_require__) {

	// Thank's IE8 for his funny defineProperty
	module.exports = !__webpack_require__(19)(function () {
	  return Object.defineProperty({}, 'a', { get: function () { return 7; } }).a != 7;
	});


/***/ }),
/* 19 */
/***/ (function(module, exports) {

	module.exports = function (exec) {
	  try {
	    return !!exec();
	  } catch (e) {
	    return true;
	  }
	};


/***/ }),
/* 20 */
/***/ (function(module, exports, __webpack_require__) {

	var isObject = __webpack_require__(16);
	var document = __webpack_require__(9).document;
	// typeof document.createElement is 'object' in old IE
	var is = isObject(document) && isObject(document.createElement);
	module.exports = function (it) {
	  return is ? document.createElement(it) : {};
	};


/***/ }),
/* 21 */
/***/ (function(module, exports, __webpack_require__) {

	// 7.1.1 ToPrimitive(input [, PreferredType])
	var isObject = __webpack_require__(16);
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
/* 22 */
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
/* 23 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _typeof2 = __webpack_require__(24);

	var _typeof3 = _interopRequireDefault(_typeof2);

	var _classCallCheck2 = __webpack_require__(3);

	var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

	var _createClass2 = __webpack_require__(4);

	var _createClass3 = _interopRequireDefault(_createClass2);

	var _utils = __webpack_require__(76);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	var Page = function () {

	  /**
	   * ------------------------------------------------------------------------
	   * Constants
	   * ------------------------------------------------------------------------
	   */

	  var NAME = 'page';
	  var VERSION = '2.0.0';

	  /**
	   * ------------------------------------------------------------------------
	   * Class Definition
	   * ------------------------------------------------------------------------
	   */

	  var Page = function () {
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
	      value: function getEvents() {
	        return this.events;
	      }
	    }, {
	      key: 'getTemplate',
	      value: function getTemplate() {
	        return this.templatePath;
	      }
	    }, {
	      key: 'getRenderFunction',
	      value: function getRenderFunction() {
	        return this.renderFunction;
	      }

	      // public

	    }, {
	      key: 'addEventCallback',
	      value: function addEventCallback(callbackFn) {
	        this.events.push(callbackFn);
	      }
	    }, {
	      key: 'useTemplate',
	      value: function useTemplate(templatePath) {
	        if (typeof templatePath !== 'string') {
	          throw new Error('The template path must be a string. ' + (typeof templatePath === 'undefined' ? 'undefined' : (0, _typeof3.default)(templatePath)) + ' is given');
	        }
	        this.templatePath = templatePath;
	      }
	    }, {
	      key: 'useTemplateRenderer',
	      value: function useTemplateRenderer(renderFunction) {
	        if (typeof renderFunction !== 'function') {
	          throw new Error('The custom template renderer must be a function. ' + (typeof renderFunction === 'undefined' ? 'undefined' : (0, _typeof3.default)(renderFunction)) + ' is given');
	        }
	        this.renderFunction = renderFunction;
	      }
	    }, {
	      key: 'triggerScopes',
	      value: function triggerScopes(eventName) {
	        var _this = this;

	        var eventParams = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

	        this.events.forEach(function (scope) {
	          var scopeEvent = scope[eventName];
	          if (typeof scopeEvent === 'function') {
	            scopeEvent.apply(_this, eventParams);
	          }
	        });

	        (0, _utils.dispatchEvent)(this.name + '.' + eventName, eventParams);
	      }
	    }], [{
	      key: 'version',
	      get: function get() {
	        return VERSION;
	      }
	    }]);
	    return Page;
	  }();

	  return Page;
	}(); /**
	      * --------------------------------------------------------------------------
	      * Licensed under MIT (https://github.com/quark-dev/Phonon-Framework/blob/master/LICENSE)
	      * --------------------------------------------------------------------------
	      */

	exports.default = Page;

/***/ }),
/* 24 */
/***/ (function(module, exports, __webpack_require__) {

	"use strict";

	exports.__esModule = true;

	var _iterator = __webpack_require__(25);

	var _iterator2 = _interopRequireDefault(_iterator);

	var _symbol = __webpack_require__(61);

	var _symbol2 = _interopRequireDefault(_symbol);

	var _typeof = typeof _symbol2.default === "function" && typeof _iterator2.default === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof _symbol2.default === "function" && obj.constructor === _symbol2.default && obj !== _symbol2.default.prototype ? "symbol" : typeof obj; };

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	exports.default = typeof _symbol2.default === "function" && _typeof(_iterator2.default) === "symbol" ? function (obj) {
	  return typeof obj === "undefined" ? "undefined" : _typeof(obj);
	} : function (obj) {
	  return obj && typeof _symbol2.default === "function" && obj.constructor === _symbol2.default && obj !== _symbol2.default.prototype ? "symbol" : typeof obj === "undefined" ? "undefined" : _typeof(obj);
	};

/***/ }),
/* 25 */
/***/ (function(module, exports, __webpack_require__) {

	module.exports = { "default": __webpack_require__(26), __esModule: true };

/***/ }),
/* 26 */
/***/ (function(module, exports, __webpack_require__) {

	__webpack_require__(27);
	__webpack_require__(56);
	module.exports = __webpack_require__(60).f('iterator');


/***/ }),
/* 27 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	var $at = __webpack_require__(28)(true);

	// 21.1.3.27 String.prototype[@@iterator]()
	__webpack_require__(31)(String, 'String', function (iterated) {
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
/* 28 */
/***/ (function(module, exports, __webpack_require__) {

	var toInteger = __webpack_require__(29);
	var defined = __webpack_require__(30);
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
/* 29 */
/***/ (function(module, exports) {

	// 7.1.4 ToInteger
	var ceil = Math.ceil;
	var floor = Math.floor;
	module.exports = function (it) {
	  return isNaN(it = +it) ? 0 : (it > 0 ? floor : ceil)(it);
	};


/***/ }),
/* 30 */
/***/ (function(module, exports) {

	// 7.2.1 RequireObjectCoercible(argument)
	module.exports = function (it) {
	  if (it == undefined) throw TypeError("Can't call method on  " + it);
	  return it;
	};


/***/ }),
/* 31 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	var LIBRARY = __webpack_require__(32);
	var $export = __webpack_require__(8);
	var redefine = __webpack_require__(33);
	var hide = __webpack_require__(13);
	var has = __webpack_require__(34);
	var Iterators = __webpack_require__(35);
	var $iterCreate = __webpack_require__(36);
	var setToStringTag = __webpack_require__(52);
	var getPrototypeOf = __webpack_require__(54);
	var ITERATOR = __webpack_require__(53)('iterator');
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
/* 32 */
/***/ (function(module, exports) {

	module.exports = true;


/***/ }),
/* 33 */
/***/ (function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__(13);


/***/ }),
/* 34 */
/***/ (function(module, exports) {

	var hasOwnProperty = {}.hasOwnProperty;
	module.exports = function (it, key) {
	  return hasOwnProperty.call(it, key);
	};


/***/ }),
/* 35 */
/***/ (function(module, exports) {

	module.exports = {};


/***/ }),
/* 36 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	var create = __webpack_require__(37);
	var descriptor = __webpack_require__(22);
	var setToStringTag = __webpack_require__(52);
	var IteratorPrototype = {};

	// 25.1.2.1.1 %IteratorPrototype%[@@iterator]()
	__webpack_require__(13)(IteratorPrototype, __webpack_require__(53)('iterator'), function () { return this; });

	module.exports = function (Constructor, NAME, next) {
	  Constructor.prototype = create(IteratorPrototype, { next: descriptor(1, next) });
	  setToStringTag(Constructor, NAME + ' Iterator');
	};


/***/ }),
/* 37 */
/***/ (function(module, exports, __webpack_require__) {

	// 19.1.2.2 / 15.2.3.5 Object.create(O [, Properties])
	var anObject = __webpack_require__(15);
	var dPs = __webpack_require__(38);
	var enumBugKeys = __webpack_require__(50);
	var IE_PROTO = __webpack_require__(47)('IE_PROTO');
	var Empty = function () { /* empty */ };
	var PROTOTYPE = 'prototype';

	// Create object with fake `null` prototype: use iframe Object with cleared prototype
	var createDict = function () {
	  // Thrash, waste and sodomy: IE GC bug
	  var iframe = __webpack_require__(20)('iframe');
	  var i = enumBugKeys.length;
	  var lt = '<';
	  var gt = '>';
	  var iframeDocument;
	  iframe.style.display = 'none';
	  __webpack_require__(51).appendChild(iframe);
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
/* 38 */
/***/ (function(module, exports, __webpack_require__) {

	var dP = __webpack_require__(14);
	var anObject = __webpack_require__(15);
	var getKeys = __webpack_require__(39);

	module.exports = __webpack_require__(18) ? Object.defineProperties : function defineProperties(O, Properties) {
	  anObject(O);
	  var keys = getKeys(Properties);
	  var length = keys.length;
	  var i = 0;
	  var P;
	  while (length > i) dP.f(O, P = keys[i++], Properties[P]);
	  return O;
	};


/***/ }),
/* 39 */
/***/ (function(module, exports, __webpack_require__) {

	// 19.1.2.14 / 15.2.3.14 Object.keys(O)
	var $keys = __webpack_require__(40);
	var enumBugKeys = __webpack_require__(50);

	module.exports = Object.keys || function keys(O) {
	  return $keys(O, enumBugKeys);
	};


/***/ }),
/* 40 */
/***/ (function(module, exports, __webpack_require__) {

	var has = __webpack_require__(34);
	var toIObject = __webpack_require__(41);
	var arrayIndexOf = __webpack_require__(44)(false);
	var IE_PROTO = __webpack_require__(47)('IE_PROTO');

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
/* 41 */
/***/ (function(module, exports, __webpack_require__) {

	// to indexed object, toObject with fallback for non-array-like ES3 strings
	var IObject = __webpack_require__(42);
	var defined = __webpack_require__(30);
	module.exports = function (it) {
	  return IObject(defined(it));
	};


/***/ }),
/* 42 */
/***/ (function(module, exports, __webpack_require__) {

	// fallback for non-array-like ES3 and non-enumerable old V8 strings
	var cof = __webpack_require__(43);
	// eslint-disable-next-line no-prototype-builtins
	module.exports = Object('z').propertyIsEnumerable(0) ? Object : function (it) {
	  return cof(it) == 'String' ? it.split('') : Object(it);
	};


/***/ }),
/* 43 */
/***/ (function(module, exports) {

	var toString = {}.toString;

	module.exports = function (it) {
	  return toString.call(it).slice(8, -1);
	};


/***/ }),
/* 44 */
/***/ (function(module, exports, __webpack_require__) {

	// false -> Array#indexOf
	// true  -> Array#includes
	var toIObject = __webpack_require__(41);
	var toLength = __webpack_require__(45);
	var toAbsoluteIndex = __webpack_require__(46);
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
/* 45 */
/***/ (function(module, exports, __webpack_require__) {

	// 7.1.15 ToLength
	var toInteger = __webpack_require__(29);
	var min = Math.min;
	module.exports = function (it) {
	  return it > 0 ? min(toInteger(it), 0x1fffffffffffff) : 0; // pow(2, 53) - 1 == 9007199254740991
	};


/***/ }),
/* 46 */
/***/ (function(module, exports, __webpack_require__) {

	var toInteger = __webpack_require__(29);
	var max = Math.max;
	var min = Math.min;
	module.exports = function (index, length) {
	  index = toInteger(index);
	  return index < 0 ? max(index + length, 0) : min(index, length);
	};


/***/ }),
/* 47 */
/***/ (function(module, exports, __webpack_require__) {

	var shared = __webpack_require__(48)('keys');
	var uid = __webpack_require__(49);
	module.exports = function (key) {
	  return shared[key] || (shared[key] = uid(key));
	};


/***/ }),
/* 48 */
/***/ (function(module, exports, __webpack_require__) {

	var global = __webpack_require__(9);
	var SHARED = '__core-js_shared__';
	var store = global[SHARED] || (global[SHARED] = {});
	module.exports = function (key) {
	  return store[key] || (store[key] = {});
	};


/***/ }),
/* 49 */
/***/ (function(module, exports) {

	var id = 0;
	var px = Math.random();
	module.exports = function (key) {
	  return 'Symbol('.concat(key === undefined ? '' : key, ')_', (++id + px).toString(36));
	};


/***/ }),
/* 50 */
/***/ (function(module, exports) {

	// IE 8- don't enum bug keys
	module.exports = (
	  'constructor,hasOwnProperty,isPrototypeOf,propertyIsEnumerable,toLocaleString,toString,valueOf'
	).split(',');


/***/ }),
/* 51 */
/***/ (function(module, exports, __webpack_require__) {

	var document = __webpack_require__(9).document;
	module.exports = document && document.documentElement;


/***/ }),
/* 52 */
/***/ (function(module, exports, __webpack_require__) {

	var def = __webpack_require__(14).f;
	var has = __webpack_require__(34);
	var TAG = __webpack_require__(53)('toStringTag');

	module.exports = function (it, tag, stat) {
	  if (it && !has(it = stat ? it : it.prototype, TAG)) def(it, TAG, { configurable: true, value: tag });
	};


/***/ }),
/* 53 */
/***/ (function(module, exports, __webpack_require__) {

	var store = __webpack_require__(48)('wks');
	var uid = __webpack_require__(49);
	var Symbol = __webpack_require__(9).Symbol;
	var USE_SYMBOL = typeof Symbol == 'function';

	var $exports = module.exports = function (name) {
	  return store[name] || (store[name] =
	    USE_SYMBOL && Symbol[name] || (USE_SYMBOL ? Symbol : uid)('Symbol.' + name));
	};

	$exports.store = store;


/***/ }),
/* 54 */
/***/ (function(module, exports, __webpack_require__) {

	// 19.1.2.9 / 15.2.3.2 Object.getPrototypeOf(O)
	var has = __webpack_require__(34);
	var toObject = __webpack_require__(55);
	var IE_PROTO = __webpack_require__(47)('IE_PROTO');
	var ObjectProto = Object.prototype;

	module.exports = Object.getPrototypeOf || function (O) {
	  O = toObject(O);
	  if (has(O, IE_PROTO)) return O[IE_PROTO];
	  if (typeof O.constructor == 'function' && O instanceof O.constructor) {
	    return O.constructor.prototype;
	  } return O instanceof Object ? ObjectProto : null;
	};


/***/ }),
/* 55 */
/***/ (function(module, exports, __webpack_require__) {

	// 7.1.13 ToObject(argument)
	var defined = __webpack_require__(30);
	module.exports = function (it) {
	  return Object(defined(it));
	};


/***/ }),
/* 56 */
/***/ (function(module, exports, __webpack_require__) {

	__webpack_require__(57);
	var global = __webpack_require__(9);
	var hide = __webpack_require__(13);
	var Iterators = __webpack_require__(35);
	var TO_STRING_TAG = __webpack_require__(53)('toStringTag');

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
/* 57 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	var addToUnscopables = __webpack_require__(58);
	var step = __webpack_require__(59);
	var Iterators = __webpack_require__(35);
	var toIObject = __webpack_require__(41);

	// 22.1.3.4 Array.prototype.entries()
	// 22.1.3.13 Array.prototype.keys()
	// 22.1.3.29 Array.prototype.values()
	// 22.1.3.30 Array.prototype[@@iterator]()
	module.exports = __webpack_require__(31)(Array, 'Array', function (iterated, kind) {
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
/* 58 */
/***/ (function(module, exports) {

	module.exports = function () { /* empty */ };


/***/ }),
/* 59 */
/***/ (function(module, exports) {

	module.exports = function (done, value) {
	  return { value: value, done: !!done };
	};


/***/ }),
/* 60 */
/***/ (function(module, exports, __webpack_require__) {

	exports.f = __webpack_require__(53);


/***/ }),
/* 61 */
/***/ (function(module, exports, __webpack_require__) {

	module.exports = { "default": __webpack_require__(62), __esModule: true };

/***/ }),
/* 62 */
/***/ (function(module, exports, __webpack_require__) {

	__webpack_require__(63);
	__webpack_require__(73);
	__webpack_require__(74);
	__webpack_require__(75);
	module.exports = __webpack_require__(10).Symbol;


/***/ }),
/* 63 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	// ECMAScript 6 symbols shim
	var global = __webpack_require__(9);
	var has = __webpack_require__(34);
	var DESCRIPTORS = __webpack_require__(18);
	var $export = __webpack_require__(8);
	var redefine = __webpack_require__(33);
	var META = __webpack_require__(64).KEY;
	var $fails = __webpack_require__(19);
	var shared = __webpack_require__(48);
	var setToStringTag = __webpack_require__(52);
	var uid = __webpack_require__(49);
	var wks = __webpack_require__(53);
	var wksExt = __webpack_require__(60);
	var wksDefine = __webpack_require__(65);
	var enumKeys = __webpack_require__(66);
	var isArray = __webpack_require__(69);
	var anObject = __webpack_require__(15);
	var toIObject = __webpack_require__(41);
	var toPrimitive = __webpack_require__(21);
	var createDesc = __webpack_require__(22);
	var _create = __webpack_require__(37);
	var gOPNExt = __webpack_require__(70);
	var $GOPD = __webpack_require__(72);
	var $DP = __webpack_require__(14);
	var $keys = __webpack_require__(39);
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
	  __webpack_require__(71).f = gOPNExt.f = $getOwnPropertyNames;
	  __webpack_require__(68).f = $propertyIsEnumerable;
	  __webpack_require__(67).f = $getOwnPropertySymbols;

	  if (DESCRIPTORS && !__webpack_require__(32)) {
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
	$Symbol[PROTOTYPE][TO_PRIMITIVE] || __webpack_require__(13)($Symbol[PROTOTYPE], TO_PRIMITIVE, $Symbol[PROTOTYPE].valueOf);
	// 19.4.3.5 Symbol.prototype[@@toStringTag]
	setToStringTag($Symbol, 'Symbol');
	// 20.2.1.9 Math[@@toStringTag]
	setToStringTag(Math, 'Math', true);
	// 24.3.3 JSON[@@toStringTag]
	setToStringTag(global.JSON, 'JSON', true);


/***/ }),
/* 64 */
/***/ (function(module, exports, __webpack_require__) {

	var META = __webpack_require__(49)('meta');
	var isObject = __webpack_require__(16);
	var has = __webpack_require__(34);
	var setDesc = __webpack_require__(14).f;
	var id = 0;
	var isExtensible = Object.isExtensible || function () {
	  return true;
	};
	var FREEZE = !__webpack_require__(19)(function () {
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
/* 65 */
/***/ (function(module, exports, __webpack_require__) {

	var global = __webpack_require__(9);
	var core = __webpack_require__(10);
	var LIBRARY = __webpack_require__(32);
	var wksExt = __webpack_require__(60);
	var defineProperty = __webpack_require__(14).f;
	module.exports = function (name) {
	  var $Symbol = core.Symbol || (core.Symbol = LIBRARY ? {} : global.Symbol || {});
	  if (name.charAt(0) != '_' && !(name in $Symbol)) defineProperty($Symbol, name, { value: wksExt.f(name) });
	};


/***/ }),
/* 66 */
/***/ (function(module, exports, __webpack_require__) {

	// all enumerable object keys, includes symbols
	var getKeys = __webpack_require__(39);
	var gOPS = __webpack_require__(67);
	var pIE = __webpack_require__(68);
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
/* 67 */
/***/ (function(module, exports) {

	exports.f = Object.getOwnPropertySymbols;


/***/ }),
/* 68 */
/***/ (function(module, exports) {

	exports.f = {}.propertyIsEnumerable;


/***/ }),
/* 69 */
/***/ (function(module, exports, __webpack_require__) {

	// 7.2.2 IsArray(argument)
	var cof = __webpack_require__(43);
	module.exports = Array.isArray || function isArray(arg) {
	  return cof(arg) == 'Array';
	};


/***/ }),
/* 70 */
/***/ (function(module, exports, __webpack_require__) {

	// fallback for IE11 buggy Object.getOwnPropertyNames with iframe and window
	var toIObject = __webpack_require__(41);
	var gOPN = __webpack_require__(71).f;
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
/* 71 */
/***/ (function(module, exports, __webpack_require__) {

	// 19.1.2.7 / 15.2.3.4 Object.getOwnPropertyNames(O)
	var $keys = __webpack_require__(40);
	var hiddenKeys = __webpack_require__(50).concat('length', 'prototype');

	exports.f = Object.getOwnPropertyNames || function getOwnPropertyNames(O) {
	  return $keys(O, hiddenKeys);
	};


/***/ }),
/* 72 */
/***/ (function(module, exports, __webpack_require__) {

	var pIE = __webpack_require__(68);
	var createDesc = __webpack_require__(22);
	var toIObject = __webpack_require__(41);
	var toPrimitive = __webpack_require__(21);
	var has = __webpack_require__(34);
	var IE8_DOM_DEFINE = __webpack_require__(17);
	var gOPD = Object.getOwnPropertyDescriptor;

	exports.f = __webpack_require__(18) ? gOPD : function getOwnPropertyDescriptor(O, P) {
	  O = toIObject(O);
	  P = toPrimitive(P, true);
	  if (IE8_DOM_DEFINE) try {
	    return gOPD(O, P);
	  } catch (e) { /* empty */ }
	  if (has(O, P)) return createDesc(!pIE.f.call(O, P), O[P]);
	};


/***/ }),
/* 73 */
/***/ (function(module, exports) {

	

/***/ }),
/* 74 */
/***/ (function(module, exports, __webpack_require__) {

	__webpack_require__(65)('asyncIterator');


/***/ }),
/* 75 */
/***/ (function(module, exports, __webpack_require__) {

	__webpack_require__(65)('observable');


/***/ }),
/* 76 */
/***/ (function(module, exports) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.dispatchEvent = dispatchEvent;
	exports.loadFile = loadFile;
	function dispatchEvent(eventName) {
	  var detail = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

	  window.dispatchEvent(new CustomEvent(eventName, { detail: detail }));
	}

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

/***/ }),
/* 77 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _typeof2 = __webpack_require__(24);

	var _typeof3 = _interopRequireDefault(_typeof2);

	var _classCallCheck2 = __webpack_require__(3);

	var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

	var _createClass2 = __webpack_require__(4);

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
	    function Ajax(opts) {
	      (0, _classCallCheck3.default)(this, Ajax);

	      if ((typeof opts === 'undefined' ? 'undefined' : (0, _typeof3.default)(opts)) !== 'object') {
	        throw new Error('' + NAME + '-' + ('' + VERSION));
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

	        this.xhr.onreadystatechange = function (event) {
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
	        return VERSION;
	      }
	    }]);
	    return Ajax;
	  }();

	  return Ajax;
	}();

	exports.default = Ajax;

/***/ }),
/* 78 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.platform = platform;
	function platform() {
	  /* Use of platform.js
	   * https://github.com/bestiejs/platform.js
	   * License: https://github.com/bestiejs/platform.js/blob/master/LICENSE
	   */
	  return __webpack_require__(79);
	}

/***/ }),
/* 79 */
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

	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(80)(module), (function() { return this; }())))

/***/ }),
/* 80 */
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
/* 81 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _keys = __webpack_require__(82);

	var _keys2 = _interopRequireDefault(_keys);

	var _typeof2 = __webpack_require__(24);

	var _typeof3 = _interopRequireDefault(_typeof2);

	var _classCallCheck2 = __webpack_require__(3);

	var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

	var _createClass2 = __webpack_require__(4);

	var _createClass3 = _interopRequireDefault(_createClass2);

	var _binder = __webpack_require__(86);

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

	  /**
	   * ------------------------------------------------------------------------
	   * Class Definition
	   * ------------------------------------------------------------------------
	   */

	  var Intl = function () {
	    function Intl() {
	      var localeDefault = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
	      var data = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
	      var localePreferred = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;
	      (0, _classCallCheck3.default)(this, Intl);

	      if (typeof localeDefault !== 'string') {
	        throw new Error('Locale default is mandatory and must be a string.');
	      }

	      if ((0, _typeof3.default)(data[localeDefault]) !== 'object') {
	        throw new Error('Locale default has not data.');
	      }

	      this.data = data;
	      this.setDefaultLocale(localeDefault, true);
	      this.localePreferred = localePreferred || navigator.language || navigator.userLanguage;
	    }

	    // getters

	    (0, _createClass3.default)(Intl, [{
	      key: 'setDefaultLocale',
	      value: function setDefaultLocale(localeDefault) {
	        var silentMode = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;

	        if ((0, _typeof3.default)(this.data[localeDefault]) !== 'object') {
	          throw new Error('Locale default has not data.');
	        }

	        this.localeDefault = localeDefault;

	        if (!silentMode) {
	          this.bind();
	        }
	      }
	    }, {
	      key: 'getLanguages',
	      value: function getLanguages() {
	        return (0, _keys2.default)(this.data);
	      }
	    }, {
	      key: 'getAll',
	      value: function getAll() {
	        var keys = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;

	        var data = this.data[this.localePreferred];
	        if (!data) {
	          data = this.data[this.localeDefault];
	        }

	        if (Array.isArray(keys)) {
	          var mapData = {};
	          for (var key in data) {
	            if (keys.indexOf(key) > -1) {
	              mapData[key] = data[key];
	            }
	          }
	          data = mapData;
	        }

	        return data;
	      }
	    }, {
	      key: 'get',
	      value: function get(key) {
	        var data = this.getAll();
	        return data[key];
	      }
	    }, {
	      key: 'bind',
	      value: function bind(element) {
	        if (typeof element === 'undefined') {
	          element = document.querySelectorAll('[data-i18n]');
	        }

	        new _binder2.default(element, this.getAll());
	      }

	      // static

	    }], [{
	      key: '_DOMInterface',
	      value: function _DOMInterface(localeDefault, data, localePreferred) {
	        return new Intl(localeDefault, data, localePreferred);
	      }
	    }, {
	      key: 'version',
	      get: function get() {
	        return VERSION;
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
/* 82 */
/***/ (function(module, exports, __webpack_require__) {

	module.exports = { "default": __webpack_require__(83), __esModule: true };

/***/ }),
/* 83 */
/***/ (function(module, exports, __webpack_require__) {

	__webpack_require__(84);
	module.exports = __webpack_require__(10).Object.keys;


/***/ }),
/* 84 */
/***/ (function(module, exports, __webpack_require__) {

	// 19.1.2.14 Object.keys(O)
	var toObject = __webpack_require__(55);
	var $keys = __webpack_require__(39);

	__webpack_require__(85)('keys', function () {
	  return function keys(it) {
	    return $keys(toObject(it));
	  };
	});


/***/ }),
/* 85 */
/***/ (function(module, exports, __webpack_require__) {

	// most Object methods by ES6 should accept primitives
	var $export = __webpack_require__(8);
	var core = __webpack_require__(10);
	var fails = __webpack_require__(19);
	module.exports = function (KEY, exec) {
	  var fn = (core.Object || {})[KEY] || Object[KEY];
	  var exp = {};
	  exp[KEY] = exec(fn);
	  $export($export.S + $export.F * fails(function () { fn(1); }), 'Object', exp);
	};


/***/ }),
/* 86 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _typeof2 = __webpack_require__(24);

	var _typeof3 = _interopRequireDefault(_typeof2);

	var _classCallCheck2 = __webpack_require__(3);

	var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

	var _createClass2 = __webpack_require__(4);

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
	      this.setNodes();
	    }

	    // getters

	    (0, _createClass3.default)(Binder, [{
	      key: 'isElement',


	      /**
	       * Checks if the given argument is a DOM element
	       * @param {DOMObject} o the argument to test
	       * @return true if the object is a DOM element, false otherwise
	       */
	      value: function isElement() {
	        return (typeof Node === 'undefined' ? 'undefined' : (0, _typeof3.default)(Node)) === 'object' ? this.element instanceof Node : this.element && (0, _typeof3.default)(this.element) === 'object' && typeof this.element.nodeType === 'number' && typeof this.element.nodeName === 'string';
	      }

	      /**
	      * Binds some text to the given DOM element
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
	      * @param {String} text
	      */

	    }, {
	      key: 'setHtml',
	      value: function setHtml(element, text) {
	        element.innerHTML = text;
	      }

	      /**
	      * Binds custom attributes to the given DOM element
	      * @param {String} attr
	      * @param {String} text
	      */

	    }, {
	      key: 'setAttribute',
	      value: function setAttribute(element, attr, text) {
	        element.setAttribute(attr, text);
	      }

	      /**
	      * Set values to DOM nodes
	      */

	    }, {
	      key: 'setNodes',
	      value: function setNodes() {
	        var _this = this;

	        var elements = this.element;
	        elements.forEach(function (el) {
	          var attr = el.getAttribute('data-i18n').trim();
	          var r = /(?:\s|^)([A-Za-z-_0-9]+):\s*(.*?)(?=\s+\w+:|$)/g;
	          var m = void 0;

	          while (m = r.exec(attr)) {
	            var key = m[1].trim();
	            var value = m[2].trim().replace(',', '');
	            var intlValue = _this.data[value];

	            if (!_this.data[value]) {
	              console.log(NAME + '. Warning, ' + value + ' does not exist.');
	              intlValue = value;
	            }

	            var methodName = 'set' + key.charAt(0).toUpperCase() + key.slice(1);

	            if (_this[methodName]) {
	              _this[methodName](el, intlValue);
	            } else {
	              _this.setAttribute(el, key, intlValue);
	            }
	          }
	        });
	      }
	    }], [{
	      key: 'version',
	      get: function get() {
	        return VERSION;
	      }
	    }]);
	    return Binder;
	  }();

	  return Binder;
	}();

	exports.default = Binder;

/***/ }),
/* 87 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _utils = __webpack_require__(76);

	var Network = function () {
	  var NAME = 'network';

	  var Event = {
	    NETWORK_ONLINE: 'online.ph.' + NAME,
	    NETWORK_OFFLINE: 'offline.ph.' + NAME
	  };

	  window.addEventListener('online', function () {
	    (0, _utils.dispatchEvent)(Event.NETWORK_ONLINE, { date: new Date() });
	  });

	  window.addEventListener('offline', function () {
	    (0, _utils.dispatchEvent)(Event.NETWORK_OFFLINE, { date: new Date() });
	  });
	}(); /**
	      * --------------------------------------------------------------------------
	      * Licensed under MIT (https://github.com/quark-dev/Phonon-Framework/blob/master/LICENSE)
	      * --------------------------------------------------------------------------
	      */

	exports.default = Network;

/***/ }),
/* 88 */
/***/ (function(module, exports) {

	'use strict';

	window.addEventListener('error', function (event) {
	  console.log('An error has occured! You can pen an issue here: https://github.com/quark-dev/Phonon-Framework/issues');
	});

/***/ }),
/* 89 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _classCallCheck2 = __webpack_require__(3);

	var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

	var _createClass2 = __webpack_require__(4);

	var _createClass3 = _interopRequireDefault(_createClass2);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	/**
	 * --------------------------------------------------------------------------
	 * Licensed under MIT (https://github.com/quark-dev/Phonon-Framework/blob/master/LICENSE)
	 * --------------------------------------------------------------------------
	 */

	var Alert = function () {

	  /**
	   * ------------------------------------------------------------------------
	   * Constants
	   * ------------------------------------------------------------------------
	   */

	  var NAME = 'alert';
	  var VERSION = '2.0.0';

	  var BACKDROP_SELECTOR = 'alert-backdrop';
	  /**
	   * ------------------------------------------------------------------------
	   * Class Definition
	   * ------------------------------------------------------------------------
	   */

	  var Alert = function () {
	    function Alert(alert) {
	      (0, _classCallCheck3.default)(this, Alert);

	      this.alert = alert;
	    }

	    // getters

	    (0, _createClass3.default)(Alert, [{
	      key: 'createBackdrop',


	      // private
	      value: function createBackdrop() {
	        var backdrop = document.createElement('div');
	        backdrop.setAttribute('data-id', this.alert.id);
	        backdrop.classList.add(BACKDROP_SELECTOR);
	        return backdrop;
	      }
	    }, {
	      key: 'center',
	      value: function center() {
	        var computedStyle = window.getComputedStyle(this.alert);
	        // const width = computedStyle.width.slice(0, computedStyle.width.length - 2)
	        var height = computedStyle.height.slice(0, computedStyle.height.length - 2);

	        var top = window.innerHeight / 2 - height / 2;
	        this.alert.style.top = top + 'px';
	      }
	    }, {
	      key: 'open',
	      value: function open() {
	        this.alert.style.visibility = 'visible';
	        this.alert.style.display = 'block';

	        if (!this.alert.classList.contains('active')) {
	          this.alert.classList.add('active');
	          this.center();

	          // var preloader = this.alert.querySelector('.circle-progress')
	          // if (preloader) {
	          // phonon.preloader(preloader).show()
	          // }

	          document.body.appendChild(this.createBackdrop());
	        }
	      }
	    }, {
	      key: 'onHide',
	      value: function onHide() {
	        var _this = this;

	        var backdrop = document.querySelector('.' + BACKDROP_SELECTOR + '[data-id="' + this.alert.id + '"]');
	        document.body.removeChild(backdrop);

	        this.alert.style.visibility = 'hidden';
	        this.alert.style.display = 'none';

	        this.alert.classList.remove('close');

	        // remove autogenerated dialogs, see: #199
	        if (this.alert.getAttribute('data-auto')) {
	          document.body.removeChild(this.alert);
	        }

	        backdrop.removeEventListener('transitionend', function (event) {
	          return _this.onHide(event);
	        }, false);
	      }
	    }, {
	      key: 'close',
	      value: function close() {
	        var _this2 = this;

	        // off(dialog)

	        if (this.alert.classList.contains('active')) {
	          this.alert.classList.remove('active');
	          this.alert.classList.add('close');

	          // var preloader = dialog.querySelector('.circle-progress')
	          // if (preloader) phonon.preloader(preloader).hide()

	          var backdrop = document.querySelector('.' + BACKDROP_SELECTOR + '[data-id="' + this.alert.id + '"]');
	          backdrop.addEventListener('transitionend', function (event) {
	            return _this2.onHide(event);
	          }, false);

	          // fix issue #62
	          window.setTimeout(function () {
	            backdrop.classList.add('fadeout');
	          }, 1);
	        }
	      }
	    }], [{
	      key: 'version',
	      get: function get() {
	        return VERSION;
	      }
	    }]);
	    return Alert;
	  }();

	  return Alert;
	}();

	exports.default = Alert;

/***/ }),
/* 90 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _isInteger = __webpack_require__(91);

	var _isInteger2 = _interopRequireDefault(_isInteger);

	var _classCallCheck2 = __webpack_require__(3);

	var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

	var _createClass2 = __webpack_require__(4);

	var _createClass3 = _interopRequireDefault(_createClass2);

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

	  /**
	   * ------------------------------------------------------------------------
	   * Class Definition
	   * ------------------------------------------------------------------------
	   */

	  var Notification = function () {
	    function Notification() {
	      var notification = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
	      var message = arguments[1];
	      var showButton = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;

	      var _this = this;

	      var timeout = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 0;
	      var color = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : 'dark';
	      (0, _classCallCheck3.default)(this, Notification);

	      this.notification = notification;
	      this.message = message;
	      this.showButton = showButton;
	      this.timeout = timeout;
	      this.color = color;

	      this.template = '' + '<div class="notification-inner">' + '<div class="message"></div>' + '<button class="btn">X</button>' + '</div>';

	      this.onButtonHandler = function (event) {
	        _this.onButton(event);
	      };

	      this.onHiddenTransitionHandler = function (event) {
	        _this.onHidden(event);
	      };
	    }

	    (0, _createClass3.default)(Notification, [{
	      key: 'build',
	      value: function build() {
	        var div = document.createElement('div');
	        div.classList.add('notification');

	        div.innerHTML = this.template;

	        // color
	        div.classList.add('bg-' + this.color);
	        div.querySelector('.btn').classList.add('btn-' + this.color);

	        // text message
	        div.querySelector('.message').innerHTML = this.message;

	        if (this.showButton) {
	          div.querySelector('.btn').addEventListener('click', this.onButtonHandler);
	        } else {
	          div.querySelector('.btn').style.display = 'none';
	        }

	        this.notification = div;

	        document.body.appendChild(this.notification);

	        return this;
	      }
	    }, {
	      key: 'show',
	      value: function show() {
	        var _this2 = this;

	        window.setTimeout(function () {
	          _this2.notification.classList.add('show');
	        }, 1);

	        if ((0, _isInteger2.default)(this.timeout) && this.timeout > 0) {
	          window.setTimeout(function () {
	            _this2.hide();
	          }, this.timeout);
	        }
	      }
	    }, {
	      key: 'hide',
	      value: function hide() {
	        this.notification.classList.remove('show');
	        this.notification.classList.add('hide');
	        this.notification.addEventListener('transitionend', this.onHiddenTransitionHandler);
	      }
	    }, {
	      key: 'onButton',
	      value: function onButton(event) {
	        this.hide();
	        event.target.removeEventListener('click', this.onButtonHandler);
	      }
	    }, {
	      key: 'onHidden',
	      value: function onHidden() {
	        this.notification.removeEventListener('transitionend', this.onHiddenTransitionHandler);
	        this.destroy();
	      }
	    }, {
	      key: 'destroy',
	      value: function destroy() {
	        this.notification.querySelector('.btn').removeEventListener('click', this.onButtonHandler);
	        document.body.removeChild(this.notification);
	        this.notification = null;
	      }
	    }], [{
	      key: '_DOMInterface',
	      value: function _DOMInterface(notification, message, showButton, timeout, color) {
	        return new Notification(notification, message, showButton, timeout, color);
	      }
	    }, {
	      key: 'version',
	      get: function get() {
	        return VERSION;
	      }
	    }]);
	    return Notification;
	  }();

	  return Notification;
	}();

	exports.default = Notification;

/***/ }),
/* 91 */
/***/ (function(module, exports, __webpack_require__) {

	module.exports = { "default": __webpack_require__(92), __esModule: true };

/***/ }),
/* 92 */
/***/ (function(module, exports, __webpack_require__) {

	__webpack_require__(93);
	module.exports = __webpack_require__(10).Number.isInteger;


/***/ }),
/* 93 */
/***/ (function(module, exports, __webpack_require__) {

	// 20.1.2.3 Number.isInteger(number)
	var $export = __webpack_require__(8);

	$export($export.S, 'Number', { isInteger: __webpack_require__(94) });


/***/ }),
/* 94 */
/***/ (function(module, exports, __webpack_require__) {

	// 20.1.2.3 Number.isInteger(number)
	var isObject = __webpack_require__(16);
	var floor = Math.floor;
	module.exports = function isInteger(it) {
	  return !isObject(it) && isFinite(it) && floor(it) === it;
	};


/***/ })
/******/ ]);