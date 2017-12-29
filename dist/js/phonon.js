(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
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

},{}],2:[function(require,module,exports){
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
  NETWORK_RECONNECTING: 'reconnecting',
  NETWORK_RECONNECTING_SUCCESS: 'reconnect.success',
  NETWORK_RECONNECTING_FAILURE: 'reconnect.failure',

  // user interface states
  SHOW: 'show',
  SHOWN: 'shown',
  HIDE: 'hide',
  HIDDEN: 'hidden',

  // hash
  HASH: 'hash',

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
  ANIMATION_END: animationEnd,

  // dropdown
  ITEM_SELECTED: 'itemSelected'
};

},{}],3:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _events = require('../../common/events');

var _events2 = _interopRequireDefault(_events);

var _component = require('../../components/component');

var _component2 = _interopRequireDefault(_component);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * --------------------------------------------------------------------------
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * Licensed under MIT (https://github.com/quark-dev/Phonon-Framework/blob/master/LICENSE)
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * --------------------------------------------------------------------------
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                */

var Network = function () {
  /**
   * ------------------------------------------------------------------------
   * Constants
   * ------------------------------------------------------------------------
   */

  var NAME = 'network';
  var VERSION = '2.0.0';
  var DEFAULT_PROPERTIES = {
    element: null,
    initialDelay: 3000,
    delay: 5000
  };
  var DATA_ATTRS_PROPERTIES = [];

  /**
   * ------------------------------------------------------------------------
   * Class Definition
   * ------------------------------------------------------------------------
   */

  var Network = function (_Component) {
    _inherits(Network, _Component);

    /**
     * Creates an instance of Network.
     * @param {{}} [options={}]
     */
    function Network() {
      var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

      _classCallCheck(this, Network);

      var _this = _possibleConstructorReturn(this, (Network.__proto__ || Object.getPrototypeOf(Network)).call(this, NAME, VERSION, DEFAULT_PROPERTIES, options, DATA_ATTRS_PROPERTIES, true, false));

      _this.xhr = null;
      _this.checkInterval = null;

      _this.setStatus(_events2.default.NETWORK_ONLINE);

      setTimeout(function () {
        _this.startCheck();
      }, _this.options.initialDelay);
      return _this;
    }

    _createClass(Network, [{
      key: 'getStatus',
      value: function getStatus() {
        return this.status;
      }
    }, {
      key: 'setStatus',
      value: function setStatus(status) {
        this.status = status;
      }
    }, {
      key: 'startRequest',
      value: function startRequest() {
        var _this2 = this;

        this.xhr = new XMLHttpRequest();
        this.xhr.offline = false;

        var url = '/favicon.ico?_=' + new Date().getTime();

        this.triggerEvent(_events2.default.NETWORK_RECONNECTING, { date: new Date() }, false);

        this.xhr.open('HEAD', url, true);

        this.xhr.timeout = this.options.delay - 1;
        this.xhr.ontimeout = function () {
          _this2.xhr.abort();
          _this2.xhr = null;
        };

        this.xhr.onload = function () {
          _this2.onUp();
        };
        this.xhr.onerror = function () {
          _this2.onDown();
        };

        try {
          this.xhr.send();
        } catch (e) {
          this.onDown();
        }
      }
    }, {
      key: 'onUp',
      value: function onUp() {
        this.triggerEvent(_events2.default.NETWORK_RECONNECTING_SUCCESS, { date: new Date() }, false);

        if (this.getStatus() !== _events2.default.NETWORK_ONLINE) {
          this.triggerEvent(_events2.default.NETWORK_ONLINE, { date: new Date() }, false);
        }

        this.setStatus(_events2.default.NETWORK_ONLINE);
      }
    }, {
      key: 'onDown',
      value: function onDown() {
        this.triggerEvent(_events2.default.NETWORK_RECONNECTING_FAILURE, { date: new Date() }, false);

        if (this.getStatus() !== _events2.default.NETWORK_OFFLINE) {
          this.triggerEvent(_events2.default.NETWORK_OFFLINE, { date: new Date() }, false);
        }

        this.setStatus(_events2.default.NETWORK_OFFLINE);
      }
    }, {
      key: 'startCheck',
      value: function startCheck() {
        var _this3 = this;

        this.stopCheck();

        this.startRequest();

        this.checkInterval = setInterval(function () {
          _this3.startRequest();
        }, this.options.delay);
      }
    }, {
      key: 'stopCheck',
      value: function stopCheck() {
        if (this.checkInterval !== null) {
          clearInterval(this.checkInterval);
          this.checkInterval = null;
        }
      }
    }], [{
      key: '_DOMInterface',
      value: function _DOMInterface(options) {
        return _get(Network.__proto__ || Object.getPrototypeOf(Network), '_DOMInterface', this).call(this, Network, options);
      }
    }]);

    return Network;
  }(_component2.default);

  return Network;
}();

exports.default = Network;

},{"../../common/events":2,"../../components/component":7}],4:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.loadFile = loadFile;
exports.generateId = generateId;
exports.findTargetByClass = findTargetByClass;
exports.findTargetById = findTargetById;
exports.findTargetByAttr = findTargetByAttr;
function loadFile(url, fn, postData) {
  var req = new XMLHttpRequest();
  if (req.overrideMimeType) req.overrideMimeType('text/html; charset=utf-8');
  req.onreadystatechange = function () {
    if (req.readyState === 4 && (parseInt(req.status, 10) === 200 || !req.status && req.responseText.length)) {
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

function findTargetByClass(target, parentClass) {
  for (; target && target !== document; target = target.parentNode) {
    if (target.classList.contains(parentClass)) {
      return target;
    }
  }

  return null;
}

function findTargetById(target, parentId) {
  for (; target && target !== document; target = target.parentNode) {
    if (target.getAttribute('id') === parentId) {
      return target;
    }
  }

  return null;
}

function findTargetByAttr(target, attr) {
  for (; target && target !== document; target = target.parentNode) {
    if (target.getAttribute(attr) !== null) {
      return target;
    }
  }

  return null;
}

},{}],5:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _component = require('../component');

var _component2 = _interopRequireDefault(_component);

var _collapse = require('../collapse');

var _collapse2 = _interopRequireDefault(_collapse);

var _componentManager = require('../componentManager');

var _utils = require('../../common/utils');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * --------------------------------------------------------------------------
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * Licensed under MIT (https://github.com/quark-dev/Phonon-Framework/blob/master/LICENSE)
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * --------------------------------------------------------------------------
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                */


var Accordion = function () {
  /**
   * ------------------------------------------------------------------------
   * Constants
   * ------------------------------------------------------------------------
   */

  var NAME = 'accordion';
  var VERSION = '2.0.0';
  var DEFAULT_PROPERTIES = {
    element: null
  };
  var DATA_ATTRS_PROPERTIES = [];

  /**
   * ------------------------------------------------------------------------
   * Class Definition
   * ------------------------------------------------------------------------
   */

  var Accordion = function (_Component) {
    _inherits(Accordion, _Component);

    function Accordion() {
      var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

      _classCallCheck(this, Accordion);

      var _this = _possibleConstructorReturn(this, (Accordion.__proto__ || Object.getPrototypeOf(Accordion)).call(this, NAME, VERSION, DEFAULT_PROPERTIES, options, DATA_ATTRS_PROPERTIES, false, false));

      _this.collapses = [];

      var toggles = _this.options.element.querySelectorAll('[data-toggle="' + NAME + '"]');
      Array.from(toggles).forEach(function (toggle) {
        var collapseId = toggle.getAttribute('href');
        var collapse = document.querySelector(collapseId);

        if (collapse) {
          _this.addCollapse(collapse);
        }
      });
      return _this;
    }

    _createClass(Accordion, [{
      key: 'onElementEvent',
      value: function onElementEvent(event) {
        var id = event.target.getAttribute('href');
        var element = document.querySelector(id);

        this.setCollapses(element);
      }
    }, {
      key: 'addCollapse',
      value: function addCollapse(element) {
        var collapse = new _collapse2.default({
          element: element
        });
        this.collapses.push(collapse);

        return collapse;
      }
    }, {
      key: 'getCollapse',
      value: function getCollapse(element) {
        var collapse = this.collapses.find(function (c) {
          return c.options.element.getAttribute('id') === element.getAttribute('id');
        });

        if (!collapse) {
          // create a new collapse
          collapse = this.addCollapse();
        }

        return collapse;
      }
    }, {
      key: 'getCollapses',
      value: function getCollapses() {
        return this.collapses;
      }
    }, {
      key: 'setCollapses',
      value: function setCollapses(showCollapse) {
        var collapse = this.getCollapse(showCollapse);
        this.collapses.forEach(function (c) {
          if (c.options.element.getAttribute('id') !== showCollapse.getAttribute('id')) {
            c.hide();
          } else {
            collapse.toggle();
          }
        });
      }
    }, {
      key: 'show',
      value: function show(collapseEl) {
        var collapse = collapseEl;
        if (typeof collapseEl === 'string') {
          collapse = document.querySelector(collapseEl);
        }

        if (!collapse) {
          throw new Error(NAME + '. The collapsible ' + collapseEl + ' is an invalid HTMLElement.');
        }

        this.setCollapses(collapse);

        return true;
      }
    }, {
      key: 'hide',
      value: function hide(collapseEl) {
        var collapse = collapseEl;
        if (typeof collapseEl === 'string') {
          collapse = document.querySelector(collapseEl);
        }

        if (!collapse) {
          throw new Error(NAME + '. The collapsible ' + collapseEl + ' is an invalid HTMLElement.');
        }

        var collapseObj = this.getCollapse(collapse);
        return collapseObj.hide();
      }
    }], [{
      key: 'identifier',
      value: function identifier() {
        return NAME;
      }
    }, {
      key: '_DOMInterface',
      value: function _DOMInterface(options) {
        return _get(Accordion.__proto__ || Object.getPrototypeOf(Accordion), '_DOMInterface', this).call(this, Accordion, options);
      }
    }]);

    return Accordion;
  }(_component2.default);

  /**
   * ------------------------------------------------------------------------
   * DOM Api implementation
   * ------------------------------------------------------------------------
   */


  var components = [];

  var accordions = document.querySelectorAll('.' + NAME);
  if (accordions) {
    Array.from(accordions).forEach(function (element) {
      var config = (0, _componentManager.getAttributesConfig)(element, DEFAULT_PROPERTIES, DATA_ATTRS_PROPERTIES);
      config.element = element;

      components.push(Accordion._DOMInterface(config));
    });
  }

  document.addEventListener('click', function (event) {
    var dataToggleAttr = event.target.getAttribute('data-toggle');
    if (dataToggleAttr && dataToggleAttr === NAME) {
      var collapseId = event.target.getAttribute('data-target') || event.target.getAttribute('href');
      var collapseEl = document.querySelector(collapseId);

      var accordion = (0, _utils.findTargetByClass)(event.target, 'accordion');

      if (accordion === null) {
        return;
      }

      var accordionId = accordion.getAttribute('id');
      var component = components.find(function (c) {
        return c.getElement().getAttribute('id') === accordionId;
      });

      if (!component) {
        return;
      }

      // if the collapse has been added programmatically, we add it
      var targetCollapse = component.getCollapses().find(function (c) {
        return c.getElement() === collapseEl;
      });
      if (!targetCollapse) {
        component.addCollapse(collapseEl);
      }

      component.show(collapseId);
    }
  });

  return Accordion;
}();

exports.default = Accordion;

},{"../../common/utils":4,"../collapse":6,"../component":7,"../componentManager":8}],6:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _component = require('../component');

var _component2 = _interopRequireDefault(_component);

var _componentManager = require('../componentManager');

var _events = require('../../common/events');

var _events2 = _interopRequireDefault(_events);

var _utils = require('../../common/utils');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /**
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
  };
  var DATA_ATTRS_PROPERTIES = ['toggle'];

  /**
   * ------------------------------------------------------------------------
   * Class Definition
   * ------------------------------------------------------------------------
   */

  var Collapse = function (_Component) {
    _inherits(Collapse, _Component);

    function Collapse() {
      var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

      _classCallCheck(this, Collapse);

      var _this = _possibleConstructorReturn(this, (Collapse.__proto__ || Object.getPrototypeOf(Collapse)).call(this, NAME, VERSION, DEFAULT_PROPERTIES, options, DATA_ATTRS_PROPERTIES, false, false));

      _this.onTransition = false;

      // toggle directly
      if (_this.options.toggle) {
        _this.show();
      }
      return _this;
    }

    _createClass(Collapse, [{
      key: 'getHeight',
      value: function getHeight() {
        return this.options.element.getBoundingClientRect(this.options.element).height;
      }
    }, {
      key: 'toggle',
      value: function toggle() {
        if (this.options.element.classList.contains('show')) {
          return this.hide();
        }

        return this.show();
      }
    }, {
      key: 'show',
      value: function show() {
        var _this2 = this;

        if (this.onTransition) {
          return false;
        }

        if (this.options.element.classList.contains('show')) {
          return false;
        }

        this.onTransition = true;

        var onCollapsed = function onCollapsed() {
          _this2.options.element.classList.add('show');
          _this2.options.element.classList.remove('collapsing');
          _this2.options.element.removeEventListener(_events2.default.TRANSITION_END, onCollapsed);

          _this2.options.element.setAttribute('aria-expanded', true);

          _this2.onTransition = false;
        };

        if (!this.options.element.classList.contains('collapsing')) {
          this.options.element.classList.add('collapsing');
        }

        this.options.element.addEventListener(_events2.default.TRANSITION_END, onCollapsed);

        var height = this.getHeight();

        this.options.element.style.height = '0px';

        setTimeout(function () {
          _this2.options.element.style.height = height + 'px';
        }, 20);

        return true;
      }
    }, {
      key: 'hide',
      value: function hide() {
        var _this3 = this;

        if (this.onTransition) {
          return false;
        }

        if (!this.options.element.classList.contains('show')) {
          return false;
        }

        this.onTransition = true;

        var onCollapsed = function onCollapsed() {
          _this3.options.element.classList.remove('collapsing');
          _this3.options.element.style.height = 'auto';
          _this3.options.element.removeEventListener(_events2.default.TRANSITION_END, onCollapsed);

          _this3.options.element.setAttribute('aria-expanded', false);

          _this3.onTransition = false;
        };

        this.options.element.style.height = '0px';

        if (!this.options.element.classList.contains('collapsing')) {
          this.options.element.classList.add('collapsing');
        }

        this.options.element.addEventListener(_events2.default.TRANSITION_END, onCollapsed);

        this.options.element.classList.remove('show');

        return true;
      }
    }], [{
      key: 'identifier',
      value: function identifier() {
        return NAME;
      }
    }, {
      key: '_DOMInterface',
      value: function _DOMInterface(options) {
        return _get(Collapse.__proto__ || Object.getPrototypeOf(Collapse), '_DOMInterface', this).call(this, Collapse, options);
      }
    }]);

    return Collapse;
  }(_component2.default);

  /**
   * ------------------------------------------------------------------------
   * DOM Api implementation
   * ------------------------------------------------------------------------
   */


  var components = [];

  var collapses = document.querySelectorAll('.' + NAME);
  if (collapses) {
    collapses.forEach(function (element) {
      // const config = {}
      var config = (0, _componentManager.getAttributesConfig)(element, DEFAULT_PROPERTIES, DATA_ATTRS_PROPERTIES);
      config.element = element;

      components.push(Collapse._DOMInterface(config));
    });
  }

  document.addEventListener('click', function (event) {
    var target = (0, _utils.findTargetByAttr)(event.target, 'data-toggle');
    if (!target) {
      return;
    }

    var dataToggleAttr = target.getAttribute('data-toggle');

    if (dataToggleAttr && dataToggleAttr === NAME) {
      var id = target.getAttribute('data-target') || target.getAttribute('href');
      id = id.replace('#', '');

      var component = components.find(function (c) {
        return c.getElement().getAttribute('id') === id;
      });

      if (!component) {
        return;
      }

      component.toggle();
    }
  });

  return Collapse;
}();

exports.default = Collapse;

},{"../../common/events":2,"../../common/utils":4,"../component":7,"../componentManager":8}],7:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }(); /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * --------------------------------------------------------------------------
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * Licensed under MIT (https://github.com/quark-dev/Phonon-Framework/blob/master/LICENSE)
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * --------------------------------------------------------------------------
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      */


var _dispatch = require('../common/events/dispatch');

var _utils = require('../common/utils');

var _events = require('../common/events');

var _events2 = _interopRequireDefault(_events);

var _componentManager = require('./componentManager');

var _componentManager2 = _interopRequireDefault(_componentManager);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * ------------------------------------------------------------------------
 * Class Definition
 * ------------------------------------------------------------------------
 */

var Component = function () {
  function Component(name, version) {
    var defaultOptions = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
    var options = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};
    var optionAttrs = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : [];

    var _this = this;

    var supportDynamicElement = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : false;
    var addToStack = arguments.length > 6 && arguments[6] !== undefined ? arguments[6] : false;

    _classCallCheck(this, Component);

    this.name = name;
    this.version = version;
    this.options = options;

    // @todo keep?
    // this.options = Object.assign(defaultOptions, options)
    Object.keys(defaultOptions).forEach(function (prop) {
      if (typeof _this.options[prop] === 'undefined') {
        _this.options[prop] = defaultOptions[prop];
      }
    });

    this.optionAttrs = optionAttrs;
    this.supportDynamicElement = supportDynamicElement;
    this.addToStack = addToStack;
    this.id = (0, _utils.generateId)();

    var checkElement = !this.supportDynamicElement || this.options.element !== null;

    if (typeof this.options.element === 'string') {
      this.options.element = document.querySelector(this.options.element);
    }

    if (checkElement && !this.options.element) {
      throw new Error(this.name + '. The element is not a HTMLElement.');
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
      this.options = Object.assign(this.options, this.assignJsConfig(this.getAttributes(), options));

      // then, set the new data attributes to the element
      this.setAttributes();
    }

    this.elementListener = function (event) {
      return _this.onBeforeElementEvent(event);
    };
  }

  _createClass(Component, [{
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
    key: 'getVersion',
    value: function getVersion() {
      return this.version;
    }
  }, {
    key: 'getElement',
    value: function getElement() {
      return this.options.element;
    }
  }, {
    key: 'getId',
    value: function getId() {
      return this.id;
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

      if (typeof eventName !== 'string') {
        throw new Error('The event name is not valid.');
      }

      if (this.addToStack) {
        if (eventName === _events2.default.SHOW) {
          _componentManager2.default.add(this);
        } else if (eventName === _events2.default.HIDE) {
          _componentManager2.default.remove(this);
        }
      }

      // event names can be with dot notation like reconnecting.success
      var eventNameObject = eventName.split('.').reduce(function (acc, current, index) {
        if (index === 0) {
          return current;
        }

        return acc + current.charAt(0).toUpperCase() + current.slice(1);
      });

      var eventNameAlias = 'on' + eventNameObject.charAt(0).toUpperCase() + eventNameObject.slice(1);

      // object event
      if (typeof this.options[eventNameObject] === 'function') {
        this.options[eventNameObject].apply(this, [detail]);
      }

      if (typeof this.options[eventNameAlias] === 'function') {
        this.options[eventNameAlias].apply(this, [detail]);
      }

      if (objectEventOnly) {
        return;
      }

      // dom event
      if (this.options.element) {
        (0, _dispatch.dispatchElementEvent)(this.options.element, eventName, this.name, detail);
      } else {
        (0, _dispatch.dispatchWinDocEvent)(eventName, this.name, detail);
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
      var options = Object.assign({}, this.options);
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
  }], [{
    key: 'identifier',
    value: function identifier() {
      return this.name;
    }
  }, {
    key: '_DOMInterface',
    value: function _DOMInterface(ComponentClass, options) {
      return new ComponentClass(options);
    }
  }]);

  return Component;
}();

exports.default = Component;

},{"../common/events":2,"../common/events/dispatch":1,"../common/utils":4,"./componentManager":8}],8:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

exports.setAttributesConfig = setAttributesConfig;
exports.getAttributesConfig = getAttributesConfig;

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

  var keys = Object.keys(obj);

  keys.forEach(function (key) {
    if (start === '' && attrs.indexOf(key) === -1) {
      // continue with next iteration
      return;
    }

    if (_typeof(obj[key]) === 'object' && obj[key] !== null) {
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

  var newObj = Object.assign({}, obj);
  var keys = Object.keys(obj);

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
    var value = obj[key]; // default value
    var type = typeof value === 'undefined' ? 'undefined' : _typeof(value);
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
      return Object.is(component, c);
    });
    if (index > -1) {
      stack.splice(index, 1);
    }
  },
  closable: function closable(component) {
    return stack.length === 0 || Object.is(stack[stack.length - 1], component);
  }
};

},{}],9:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _index = require('./index');

var _index2 = _interopRequireDefault(_index);

var _componentManager = require('../componentManager');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * --------------------------------------------------------------------------
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * Licensed under MIT (https://github.com/quark-dev/Phonon-Framework/blob/master/LICENSE)
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * --------------------------------------------------------------------------
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                */


var Confirm = function () {

  /**
   * ------------------------------------------------------------------------
   * Constants
   * ------------------------------------------------------------------------
   */

  var NAME = 'confirm';
  var DEFAULT_PROPERTIES = {
    element: null,
    title: null,
    message: null,
    cancelable: true,
    type: NAME,
    buttons: [{
      event: 'cancel',
      text: 'Cancel',
      dismiss: true,
      class: 'btn btn-secondary'
    }, {
      event: 'confirm',
      text: 'Ok',
      dismiss: true,
      class: 'btn btn-primary'
    }]
  };
  var DATA_ATTRS_PROPERTIES = ['cancelable'];

  /**
   * ------------------------------------------------------------------------
   * Class Definition
   * ------------------------------------------------------------------------
   */

  var Confirm = function (_Dialog) {
    _inherits(Confirm, _Dialog);

    function Confirm() {
      var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

      _classCallCheck(this, Confirm);

      var template = '' + '<div class="dialog" tabindex="-1" role="dialog">' + '<div class="dialog-inner" role="document">' + '<div class="dialog-content">' + '<div class="dialog-header">' + '<h5 class="dialog-title"></h5>' + '</div>' + '<div class="dialog-body">' + '<p></p>' + '</div>' + '<div class="dialog-footer">' + '</div>' + '</div>' + '</div>' + '</div>';

      if (!Array.isArray(options.buttons)) {
        options.buttons = DEFAULT_PROPERTIES.buttons;
      }

      return _possibleConstructorReturn(this, (Confirm.__proto__ || Object.getPrototypeOf(Confirm)).call(this, options, template));
    }

    _createClass(Confirm, null, [{
      key: 'identifier',
      value: function identifier() {
        return NAME;
      }
    }, {
      key: '_DOMInterface',
      value: function _DOMInterface(options) {
        return new Confirm(options);
      }
    }]);

    return Confirm;
  }(_index2.default);

  /**
   * ------------------------------------------------------------------------
   * DOM Api implementation
   * ------------------------------------------------------------------------
   */


  var components = [];
  var dialogs = document.querySelectorAll('.' + _index2.default.identifier());

  if (dialogs) {
    Array.from(dialogs).forEach(function (element) {
      var config = (0, _componentManager.getAttributesConfig)(element, DEFAULT_PROPERTIES, DATA_ATTRS_PROPERTIES);
      config.element = element;

      if (config.type === NAME) {
        // confirm
        components.push(new Confirm(config));
      }
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

      // remove the focus state of the trigger
      event.target.blur();

      component.dialog.show();
    }
  });

  return Confirm;
}();

exports.default = Confirm;

},{"../componentManager":8,"./index":10}],10:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _events = require('../../common/events');

var _events2 = _interopRequireDefault(_events);

var _component = require('../component');

var _component2 = _interopRequireDefault(_component);

var _componentManager = require('../componentManager');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * --------------------------------------------------------------------------
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * Licensed under MIT (https://github.com/quark-dev/Phonon-Framework/blob/master/LICENSE)
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * --------------------------------------------------------------------------
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                */


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
    cancelable: true,
    buttons: [{
      event: 'confirm',
      text: 'Ok',
      dismiss: true,
      class: 'btn btn-primary'
    }]
  };
  var DATA_ATTRS_PROPERTIES = ['cancelable'];

  /**
   * ------------------------------------------------------------------------
   * Class Definition
   * ------------------------------------------------------------------------
   */

  var Dialog = function (_Component) {
    _inherits(Dialog, _Component);

    function Dialog() {
      var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
      var template = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;

      _classCallCheck(this, Dialog);

      var _this = _possibleConstructorReturn(this, (Dialog.__proto__ || Object.getPrototypeOf(Dialog)).call(this, NAME, VERSION, DEFAULT_PROPERTIES, options, DATA_ATTRS_PROPERTIES, true, true));

      _this.template = template || '' + '<div class="dialog" tabindex="-1" role="dialog">' + '<div class="dialog-inner" role="document">' + '<div class="dialog-content">' + '<div class="dialog-header">' + '<h5 class="dialog-title"></h5>' + '</div>' + '<div class="dialog-body">' + '<p></p>' + '</div>' + '<div class="dialog-footer">' + '</div>' + '</div>' + '</div>' + '</div>';

      if (_this.dynamicElement) {
        _this.build();
      }
      return _this;
    }

    _createClass(Dialog, [{
      key: 'build',
      value: function build() {
        var _this2 = this;

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
        } else {
          // remove paragraph node
          this.removeTextBody();
        }

        // buttons
        if (this.options.buttons !== null && Array.isArray(this.options.buttons)) {
          if (this.options.buttons.length > 0) {
            this.options.buttons.forEach(function (button) {
              _this2.options.element.querySelector('.dialog-footer').appendChild(_this2.buildButton(button));
            });
          } else {
            this.removeFooter();
          }
        } else {
          this.removeFooter();
        }

        document.body.appendChild(this.options.element);

        this.setAttributes();
      }
    }, {
      key: 'buildButton',
      value: function buildButton() {
        var buttonInfo = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

        var button = document.createElement('button');
        button.setAttribute('type', 'button');
        button.setAttribute('class', buttonInfo.class || 'btn');
        button.setAttribute('data-event', buttonInfo.event);
        button.innerHTML = buttonInfo.text;

        if (buttonInfo.dismiss) {
          button.setAttribute('data-dismiss', NAME);
        }

        return button;
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
      key: 'removeTextBody',
      value: function removeTextBody() {
        this.options.element.querySelector('.dialog-body').removeChild(this.options.element.querySelector('.dialog-body').firstChild);
      }
    }, {
      key: 'removeFooter',
      value: function removeFooter() {
        var footer = this.options.element.querySelector('.dialog-footer');
        this.options.element.querySelector('.dialog-content').removeChild(footer);
      }
    }, {
      key: 'center',
      value: function center() {
        var computedStyle = window.getComputedStyle(this.options.element);
        var height = computedStyle.height.slice(0, computedStyle.height.length - 2);

        var top = window.innerHeight / 2 - height / 2;
        this.options.element.style.top = top + 'px';
      }
    }, {
      key: 'show',
      value: function show() {
        var _this3 = this;

        if (this.options.element === null) {
          // build and insert a new DOM element
          this.build();
        }

        if (this.options.element.classList.contains('show')) {
          return false;
        }

        // add a timeout so that the CSS animation works
        setTimeout(function () {
          _this3.triggerEvent(_events2.default.SHOW);
          _this3.buildBackdrop();

          var onShown = function onShown() {
            _this3.triggerEvent(_events2.default.SHOWN);
            _this3.options.element.removeEventListener(_events2.default.TRANSITION_END, onShown);

            // attach event
            _this3.attachEvents();
          };

          _this3.options.element.addEventListener(_events2.default.TRANSITION_END, onShown);

          _this3.options.element.classList.add('show');

          _this3.center();
        }, 10);

        return true;
      }
    }, {
      key: 'onElementEvent',
      value: function onElementEvent(event) {
        if (event.type === 'keyup' && event.keyCode !== 27 && event.keyCode !== 13) {
          return;
        }

        var eventName = event.target.getAttribute('data-event');

        if (eventName) {
          this.triggerEvent(eventName);
        }

        if (event.target.getAttribute('data-dismiss') !== NAME) {
          return;
        }

        // hide the dialog
        this.hide();
      }
    }, {
      key: 'hide',
      value: function hide() {
        var _this4 = this;

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

          _this4.options.element.classList.remove('hide');

          _this4.triggerEvent(_events2.default.HIDDEN);

          backdrop.removeEventListener(_events2.default.TRANSITION_END, onHidden);

          // remove generated dialogs from the DOM
          if (_this4.dynamicElement) {
            document.body.removeChild(_this4.options.element);
            _this4.options.element = null;
          }
        };

        backdrop.addEventListener(_events2.default.TRANSITION_END, onHidden);
        backdrop.classList.add('fadeout');

        return true;
      }
    }, {
      key: 'attachEvents',
      value: function attachEvents() {
        var _this5 = this;

        var buttons = this.options.element.querySelectorAll('[data-dismiss], .dialog-footer button');
        if (buttons) {
          Array.from(buttons).forEach(function (button) {
            return _this5.registerElement({ target: button, event: 'click' });
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
        var _this6 = this;

        var buttons = this.options.element.querySelectorAll('[data-dismiss], .dialog-footer button');
        if (buttons) {
          Array.from(buttons).forEach(function (button) {
            return _this6.unregisterElement({ target: button, event: 'click' });
          });
        }

        if (this.options.cancelable) {
          var backdrop = this.getBackdrop();
          this.unregisterElement({ target: backdrop, event: _events2.default.START });
          this.unregisterElement({ target: document, event: 'keyup' });
        }
      }
    }], [{
      key: 'identifier',
      value: function identifier() {
        return NAME;
      }
    }, {
      key: '_DOMInterface',
      value: function _DOMInterface(options) {
        return _get(Dialog.__proto__ || Object.getPrototypeOf(Dialog), '_DOMInterface', this).call(this, Dialog, options);
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
    Array.from(dialogs).forEach(function (element) {
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

      // remove the focus state of the trigger
      event.target.blur();

      component.dialog.show();
    }
  });

  return Dialog;
}();

exports.default = Dialog;

},{"../../common/events":2,"../component":7,"../componentManager":8}],11:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _index = require('./index');

var _index2 = _interopRequireDefault(_index);

var _index3 = require('../loader/index');

var _index4 = _interopRequireDefault(_index3);

var _componentManager = require('../componentManager');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * --------------------------------------------------------------------------
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * Licensed under MIT (https://github.com/quark-dev/Phonon-Framework/blob/master/LICENSE)
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * --------------------------------------------------------------------------
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                */


var Loader = function () {

  /**
   * ------------------------------------------------------------------------
   * Constants
   * ------------------------------------------------------------------------
   */

  var NAME = 'loader';
  var DEFAULT_PROPERTIES = {
    element: null,
    title: null,
    message: null,
    cancelable: true,
    type: NAME,
    buttons: []
  };
  var DATA_ATTRS_PROPERTIES = ['cancelable'];

  /**
   * ------------------------------------------------------------------------
   * Class Definition
   * ------------------------------------------------------------------------
   */

  var Loader = function (_Dialog) {
    _inherits(Loader, _Dialog);

    function Loader() {
      var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

      _classCallCheck(this, Loader);

      var template = '' + '<div class="dialog" tabindex="-1" role="dialog">' + '<div class="dialog-inner" role="document">' + '<div class="dialog-content">' + '<div class="dialog-header">' + '<h5 class="dialog-title"></h5>' + '</div>' + '<div class="dialog-body">' + '<p></p>' + '<div class="mx-auto text-center">' + '<div class="loader mx-auto d-block">' + '<div class="loader-spinner"></div>' + '</div>' + '</div>' + '</div>' + '<div class="dialog-footer">' + '</div>' + '</div>' + '</div>' + '</div>';

      if (!Array.isArray(options.buttons)) {
        options.buttons = options.cancelable ? DEFAULT_PROPERTIES.buttons : [];
      }

      var _this = _possibleConstructorReturn(this, (Loader.__proto__ || Object.getPrototypeOf(Loader)).call(this, options, template));

      _this.spinner = null;
      return _this;
    }

    _createClass(Loader, [{
      key: 'show',
      value: function show() {
        _get(Loader.prototype.__proto__ || Object.getPrototypeOf(Loader.prototype), 'show', this).call(this);

        this.spinner = new _index4.default({ element: this.getElement().querySelector('.loader') });
        this.spinner.animate(true);
      }
    }, {
      key: 'hide',
      value: function hide() {
        _get(Loader.prototype.__proto__ || Object.getPrototypeOf(Loader.prototype), 'hide', this).call(this);

        this.spinner.animate(false);
        this.spinner = null;
      }
    }], [{
      key: 'identifier',
      value: function identifier() {
        return NAME;
      }
    }, {
      key: '_DOMInterface',
      value: function _DOMInterface(options) {
        return new Loader(options);
      }
    }]);

    return Loader;
  }(_index2.default);

  /**
   * ------------------------------------------------------------------------
   * DOM Api implementation
   * ------------------------------------------------------------------------
   */


  var components = [];
  var dialogs = document.querySelectorAll('.' + _index2.default.identifier());

  if (dialogs) {
    Array.from(dialogs).forEach(function (element) {
      var config = (0, _componentManager.getAttributesConfig)(element, DEFAULT_PROPERTIES, DATA_ATTRS_PROPERTIES);
      config.element = element;

      if (config.type === NAME) {
        // loader
        components.push(new Loader(config));
      }
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

      // remove the focus state of the trigger
      event.target.blur();

      component.dialog.show();
    }
  });

  return Loader;
}();

exports.default = Loader;

},{"../componentManager":8,"../loader/index":15,"./index":10}],12:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _index = require('./index');

var _index2 = _interopRequireDefault(_index);

var _componentManager = require('../componentManager');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * --------------------------------------------------------------------------
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * Licensed under MIT (https://github.com/quark-dev/Phonon-Framework/blob/master/LICENSE)
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * --------------------------------------------------------------------------
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                */


var Prompt = function () {

  /**
   * ------------------------------------------------------------------------
   * Constants
   * ------------------------------------------------------------------------
   */

  var NAME = 'prompt';
  var DEFAULT_PROPERTIES = {
    element: null,
    title: null,
    message: null,
    cancelable: true,
    type: NAME,
    buttons: [{
      event: 'cancel',
      text: 'Cancel',
      dismiss: true,
      class: 'btn btn-secondary'
    }, {
      event: 'confirm',
      text: 'Ok',
      dismiss: true,
      class: 'btn btn-primary'
    }]
  };
  var DATA_ATTRS_PROPERTIES = ['cancelable'];

  /**
   * ------------------------------------------------------------------------
   * Class Definition
   * ------------------------------------------------------------------------
   */

  var Prompt = function (_Dialog) {
    _inherits(Prompt, _Dialog);

    function Prompt() {
      var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

      _classCallCheck(this, Prompt);

      var template = '' + '<div class="dialog" tabindex="-1" role="dialog">' + '<div class="dialog-inner" role="document">' + '<div class="dialog-content">' + '<div class="dialog-header">' + '<h5 class="dialog-title"></h5>' + '</div>' + '<div class="dialog-body">' + '<p></p>' + '<input class="form-control" type="text" value="">' + '</div>' + '<div class="dialog-footer">' + '</div>' + '</div>' + '</div>' + '</div>';

      if (!Array.isArray(options.buttons)) {
        options.buttons = DEFAULT_PROPERTIES.buttons;
      }

      return _possibleConstructorReturn(this, (Prompt.__proto__ || Object.getPrototypeOf(Prompt)).call(this, options, template));
    }

    _createClass(Prompt, [{
      key: 'show',
      value: function show() {
        _get(Prompt.prototype.__proto__ || Object.getPrototypeOf(Prompt.prototype), 'show', this).call(this);
        this.attachInputEvent();
      }
    }, {
      key: 'hide',
      value: function hide() {
        _get(Prompt.prototype.__proto__ || Object.getPrototypeOf(Prompt.prototype), 'hide', this).call(this);
        this.detachInputEvent();
      }
    }, {
      key: 'getInput',
      value: function getInput() {
        return this.options.element.querySelector('.form-control');
      }
    }, {
      key: 'attachInputEvent',
      value: function attachInputEvent() {
        this.registerElement({ target: this.getInput(), event: 'keyup' });
      }
    }, {
      key: 'detachInputEvent',
      value: function detachInputEvent() {
        this.unregisterElement({ target: this.getInput(), event: 'keyup' });
      }
    }, {
      key: 'onElementEvent',
      value: function onElementEvent(event) {
        if (event.target === this.getInput()) {
          return;
        }

        _get(Prompt.prototype.__proto__ || Object.getPrototypeOf(Prompt.prototype), 'onElementEvent', this).call(this, event);
      }
    }, {
      key: 'setInputValue',
      value: function setInputValue() {
        var value = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';

        this.getInput().value = value;
      }
    }, {
      key: 'getInputValue',
      value: function getInputValue() {
        return this.getInput().value;
      }
    }], [{
      key: 'identifier',
      value: function identifier() {
        return NAME;
      }
    }, {
      key: '_DOMInterface',
      value: function _DOMInterface(options) {
        return new Prompt(options);
      }
    }]);

    return Prompt;
  }(_index2.default);

  /**
   * ------------------------------------------------------------------------
   * DOM Api implementation
   * ------------------------------------------------------------------------
   */


  var components = [];
  var dialogs = document.querySelectorAll('.' + _index2.default.identifier());

  if (dialogs) {
    Array.from(dialogs).forEach(function (element) {
      var config = (0, _componentManager.getAttributesConfig)(element, DEFAULT_PROPERTIES, DATA_ATTRS_PROPERTIES);
      config.element = element;

      if (config.type === NAME) {
        // prompt
        components.push(new Prompt(config));
      }
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

      // remove the focus state of the trigger
      event.target.blur();

      component.dialog.show();
    }
  });

  return Prompt;
}();

exports.default = Prompt;

},{"../componentManager":8,"./index":10}],13:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _component = require('../component');

var _component2 = _interopRequireDefault(_component);

var _events = require('../../common/events');

var _events2 = _interopRequireDefault(_events);

var _utils = require('../../common/utils');

var _componentManager = require('../componentManager');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * --------------------------------------------------------------------------
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * Licensed under MIT (https://github.com/quark-dev/Phonon-Framework/blob/master/LICENSE)
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * --------------------------------------------------------------------------
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                */


var Dropdown = function () {
  /**
   * ------------------------------------------------------------------------
   * Constants
   * ------------------------------------------------------------------------
   */

  var NAME = 'dropdown';
  var VERSION = '2.0.0';
  var DEFAULT_PROPERTIES = {
    element: null,
    default: true,
    search: false
  };
  var DATA_ATTRS_PROPERTIES = ['default', 'search'];

  /**
   * ------------------------------------------------------------------------
   * Class Definition
   * ------------------------------------------------------------------------
   */

  var Dropdown = function (_Component) {
    _inherits(Dropdown, _Component);

    function Dropdown() {
      var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

      _classCallCheck(this, Dropdown);

      var _this = _possibleConstructorReturn(this, (Dropdown.__proto__ || Object.getPrototypeOf(Dropdown)).call(this, NAME, VERSION, DEFAULT_PROPERTIES, options, DATA_ATTRS_PROPERTIES, false, false));

      var selected = _this.options.element.querySelector('[data-selected]');
      var item = _this.getItemData(selected);

      _this.setSelected(item.value, item.text, false);
      return _this;
    }

    _createClass(Dropdown, [{
      key: 'setSelected',
      value: function setSelected() {
        var value = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';

        var _this2 = this;

        var text = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
        var checkExists = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;

        if (!this.options.default) {
          return false;
        }

        var textDisplay = text;
        this.options.element.querySelector('.default-text').innerHTML = text;
        this.options.element.querySelector('input[type="hidden"]').value = value;

        var items = this.options.element.querySelectorAll('.item') || [];
        var itemFound = false;

        Array.from(items).forEach(function (item) {
          if (item.classList.contains('selected')) {
            item.classList.remove('selected');
          }

          var data = _this2.getItemData(item);

          if (value === data.value) {
            if (!item.classList.contains('selected')) {
              item.classList.add('selected');
            }

            textDisplay = data.text;
            itemFound = true;
          }
        });

        if (checkExists && itemFound) {
          this.options.element.querySelector('.default-text').innerHTML = textDisplay;
        } else if (checkExists && !itemFound) {
          throw new Error(NAME + '. The value "' + value + '" does not exist in the list of items.');
        }

        return true;
      }
    }, {
      key: 'getSelected',
      value: function getSelected() {
        return this.options.element.querySelector('input[type="hidden"]').value;
      }
    }, {
      key: 'getItemData',
      value: function getItemData() {
        var item = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;

        var text = '';
        var value = '';

        if (item) {
          text = item.getAttribute('data-text') || item.innerHTML;

          var selectedTextNode = item.querySelector('.text');
          if (selectedTextNode) {
            text = selectedTextNode.innerHTML;
          }

          value = item.getAttribute('data-value') || '';
        }

        return { text: text, value: value };
      }
    }, {
      key: 'onElementEvent',
      value: function onElementEvent(event) {
        if (event.type === _events2.default.START) {
          var dropdown = (0, _utils.findTargetByClass)(event.target, 'dropdown');

          /*
           * hide the current dropdown only if the event concerns another dropdown
           * hide also if the user clicks outside a dropdown
           */
          if (!dropdown || dropdown !== this.getElement()) {
            this.hide();
          }
        } else if (event.type === 'click') {
          var item = (0, _utils.findTargetByClass)(event.target, 'item');

          if (item) {
            if (item.classList.contains('disabled')) {
              return;
            }

            var itemInfo = this.getItemData(item);

            if (this.getSelected() !== itemInfo.value) {
              // the user selected another value, we dispatch the event
              this.setSelected(itemInfo.value, itemInfo.text, false);
              var detail = { item: item, text: itemInfo.text, value: itemInfo.value };
              this.triggerEvent(_events2.default.ITEM_SELECTED, detail);
            }

            this.hide();
            return;
          }

          // don't toggle the dropdown if the event concerns headers, dividers
          var dropdownMenu = (0, _utils.findTargetByClass)(event.target, 'dropdown-menu');
          if (dropdownMenu) {
            return;
          }

          this.toggle();
        }
      }
    }, {
      key: 'toggle',
      value: function toggle() {
        if (this.options.element.classList.contains('active')) {
          return this.hide();
        }

        return this.show();
      }
    }, {
      key: 'show',
      value: function show() {
        if (this.options.element.classList.contains('active')) {
          return false;
        }

        this.options.element.classList.add('active');

        var dropdownMenu = this.options.element.querySelector('.dropdown-menu');

        // scroll to top
        dropdownMenu.scrollTop = 0;

        this.triggerEvent(_events2.default.SHOW);
        this.triggerEvent(_events2.default.SHOWN);

        this.registerElement({ target: dropdownMenu, event: 'click' });
        this.registerElement({ target: document.body, event: _events2.default.START });

        return true;
      }
    }, {
      key: 'hide',
      value: function hide() {
        if (!this.options.element.classList.contains('active')) {
          return false;
        }

        this.options.element.classList.remove('active');

        this.triggerEvent(_events2.default.HIDE);
        this.triggerEvent(_events2.default.HIDDEN);

        this.unregisterElement({ target: this.options.element.querySelector('.dropdown-menu'), event: 'click' });
        this.unregisterElement({ target: document.body, event: _events2.default.START });

        return true;
      }
    }], [{
      key: 'identifier',
      value: function identifier() {
        return NAME;
      }
    }, {
      key: '_DOMInterface',
      value: function _DOMInterface(options) {
        return _get(Dropdown.__proto__ || Object.getPrototypeOf(Dropdown), '_DOMInterface', this).call(this, Dropdown, options);
      }
    }]);

    return Dropdown;
  }(_component2.default);

  /**
   * ------------------------------------------------------------------------
   * DOM Api implementation
   * ------------------------------------------------------------------------
   */


  var components = [];

  var dropdowns = document.querySelectorAll('.' + NAME);
  if (dropdowns) {
    Array.from(dropdowns).forEach(function (element) {
      var config = (0, _componentManager.getAttributesConfig)(element, DEFAULT_PROPERTIES, DATA_ATTRS_PROPERTIES);
      config.element = element;

      if (!config.search) {
        components.push(new Dropdown(config));
      }
    });
  }

  document.addEventListener('click', function (event) {
    var dropdownMenu = (0, _utils.findTargetByClass)(event.target, 'dropdown-menu');
    if (dropdownMenu) {
      return;
    }

    var dropdown = (0, _utils.findTargetByClass)(event.target, 'dropdown');

    if (dropdown) {
      var dataToggleAttr = dropdown.getAttribute('data-toggle');
      if (dataToggleAttr && dataToggleAttr === NAME && dropdown) {
        var component = components.find(function (c) {
          return c.getElement() === dropdown;
        });

        if (!component) {
          return;
        }

        component.toggle();
      }
    }
  });

  return Dropdown;
}();

exports.default = Dropdown;

},{"../../common/events":2,"../../common/utils":4,"../component":7,"../componentManager":8}],14:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _index = require('./index');

var _index2 = _interopRequireDefault(_index);

var _utils = require('../../common/utils');

var _componentManager = require('../componentManager');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * --------------------------------------------------------------------------
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * Licensed under MIT (https://github.com/quark-dev/Phonon-Framework/blob/master/LICENSE)
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * --------------------------------------------------------------------------
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                */


var DropdownSearch = function () {

  /**
   * ------------------------------------------------------------------------
   * Constants
   * ------------------------------------------------------------------------
   */

  var NAME = _index2.default.identifier();
  var DEFAULT_PROPERTIES = {
    element: null,
    default: true,
    search: true
  };
  var DATA_ATTRS_PROPERTIES = ['default', 'search'];

  /**
   * ------------------------------------------------------------------------
   * Class Definition
   * ------------------------------------------------------------------------
   */

  var DropdownSearch = function (_Dropdown) {
    _inherits(DropdownSearch, _Dropdown);

    function DropdownSearch() {
      var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

      _classCallCheck(this, DropdownSearch);

      var _this = _possibleConstructorReturn(this, (DropdownSearch.__proto__ || Object.getPrototypeOf(DropdownSearch)).call(this, options));

      _this.filterItemsHandler = function (event) {
        var search = event.target.value;

        if (search === '') {
          _this.showItems();
          return;
        }

        _this.getItems().forEach(function (item) {
          var fn = typeof _this.options.filterItem === 'function' ? _this.options.filterItem : _this.filterItem;

          if (fn(search, item)) {
            item.element.style.display = 'block';
          } else {
            item.element.style.display = 'none';
          }
        });
      };

      _this.getSearchInput().addEventListener('keyup', _this.filterItemsHandler);
      return _this;
    }

    _createClass(DropdownSearch, [{
      key: 'filterItem',
      value: function filterItem() {
        var search = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
        var item = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

        if (item.value.indexOf(search) > -1 || item.text.indexOf(search) > -1) {
          return true;
        }

        return false;
      }
    }, {
      key: 'getItems',
      value: function getItems() {
        var _this2 = this;

        var items = Array.from(this.options.element.querySelectorAll('.item') || []);
        items = items.map(function (item) {
          var info = _this2.getItemData(item);
          return { text: info.text, value: info.value, element: item };
        });

        return items;
      }
    }, {
      key: 'showItems',
      value: function showItems() {
        this.getItems().forEach(function (item) {
          var i = item;
          i.element.style.display = 'block';
        });
      }
    }, {
      key: 'getSearchInput',
      value: function getSearchInput() {
        return this.options.element.querySelector('.dropdown-menu input');
      }
    }, {
      key: 'hide',
      value: function hide() {
        if (_get(DropdownSearch.prototype.__proto__ || Object.getPrototypeOf(DropdownSearch.prototype), 'hide', this).call(this)) {
          // reset the value
          this.getSearchInput().value = '';
          // show all items
          this.showItems();
        }
      }
    }], [{
      key: '_DOMInterface',
      value: function _DOMInterface(options) {
        return new DropdownSearch(options);
      }
    }]);

    return DropdownSearch;
  }(_index2.default);

  /**
   * ------------------------------------------------------------------------
   * DOM Api implementation
   * ------------------------------------------------------------------------
   */


  var components = [];
  var dropdowns = document.querySelectorAll('.' + NAME);

  if (dropdowns) {
    Array.from(dropdowns).forEach(function (element) {
      var config = (0, _componentManager.getAttributesConfig)(element, DEFAULT_PROPERTIES, DATA_ATTRS_PROPERTIES);
      config.element = element;

      if (config.search) {
        // search
        components.push(new DropdownSearch(config));
      }
    });
  }

  if (dropdowns) {
    document.addEventListener('click', function (event) {
      var dropdownMenu = (0, _utils.findTargetByClass)(event.target, 'dropdown-menu');
      if (dropdownMenu) {
        return;
      }

      var dropdown = (0, _utils.findTargetByClass)(event.target, 'dropdown');

      if (dropdown) {
        var dataToggleAttr = dropdown.getAttribute('data-toggle');
        if (dataToggleAttr && dataToggleAttr === NAME && dropdown) {
          var component = components.find(function (c) {
            return c.getElement() === dropdown;
          });

          if (!component) {
            return;
          }

          component.toggle();
        }
      }
    });
  }

  return DropdownSearch;
}();

exports.default = DropdownSearch;

},{"../../common/utils":4,"../componentManager":8,"./index":13}],15:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _component = require('../component');

var _component2 = _interopRequireDefault(_component);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * --------------------------------------------------------------------------
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * Licensed under MIT (https://github.com/quark-dev/Phonon-Framework/blob/master/LICENSE)
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * --------------------------------------------------------------------------
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                */


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
    _inherits(Loader, _Component);

    function Loader() {
      var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

      _classCallCheck(this, Loader);

      // set color
      var _this = _possibleConstructorReturn(this, (Loader.__proto__ || Object.getPrototypeOf(Loader)).call(this, NAME, VERSION, DEFAULT_PROPERTIES, options, DATA_ATTRS_PROPERTIES, false, false));

      var loaderSpinner = _this.getSpinner();
      if (typeof _this.options.color === 'string' && !loaderSpinner.classList.contains('color-' + _this.options.color)) {
        loaderSpinner.classList.add('color-' + _this.options.color);
      }

      _this.customSize = _this.options.size !== null;
      return _this;
    }

    _createClass(Loader, [{
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
      key: 'identifier',
      value: function identifier() {
        return NAME;
      }
    }, {
      key: '_DOMInterface',
      value: function _DOMInterface(options) {
        return _get(Loader.__proto__ || Object.getPrototypeOf(Loader), '_DOMInterface', this).call(this, Loader, options);
      }
    }]);

    return Loader;
  }(_component2.default);

  return Loader;
}();

exports.default = Loader;

},{"../component":7}],16:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _events = require('../../common/events');

var _events2 = _interopRequireDefault(_events);

var _component = require('../component');

var _component2 = _interopRequireDefault(_component);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /**
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
    _inherits(Notification, _Component);

    function Notification() {
      var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

      _classCallCheck(this, Notification);

      var _this = _possibleConstructorReturn(this, (Notification.__proto__ || Object.getPrototypeOf(Notification)).call(this, NAME, VERSION, DEFAULT_PROPERTIES, options, DATA_ATTRS_PROPERTIES, true, false));

      _this.template = '' + '<div class="notification">' + '<div class="notification-inner">' + '<div class="message"></div>' + '<button type="button" class="close" data-dismiss="notification" aria-label="Close">' + '<span aria-hidden="true">&times;</span>' + '</button>' + '</div>' + '</div>';

      if (_this.dynamicElement) {
        _this.build();
      }

      _this.timeoutCallback = null;
      return _this;
    }

    _createClass(Notification, [{
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

          // set position
          var activeNotifications = document.querySelectorAll('.notification.show') || [];
          var pushDistance = 0;
          activeNotifications.forEach(function (notification) {
            if (_this2.options.element !== notification) {
              var style = getComputedStyle(notification);
              pushDistance += notification.offsetHeight + parseInt(style.marginBottom, 10);
            }
          });

          _this2.options.element.style.transform = 'translateY(' + pushDistance + 'px)';

          _this2.triggerEvent(_events2.default.SHOW);

          var onShown = function onShown() {
            _this2.triggerEvent(_events2.default.SHOWN);
            _this2.options.element.removeEventListener(_events2.default.TRANSITION_END, onShown);
          };

          _this2.options.element.addEventListener(_events2.default.TRANSITION_END, onShown);
        }, 1);

        if (Number.isInteger(this.options.timeout) && this.options.timeout > 0) {
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
      key: 'identifier',
      value: function identifier() {
        return NAME;
      }
    }, {
      key: '_DOMInterface',
      value: function _DOMInterface(options) {
        return _get(Notification.__proto__ || Object.getPrototypeOf(Notification), '_DOMInterface', this).call(this, Notification, options);
      }
    }]);

    return Notification;
  }(_component2.default);

  return Notification;
}();

exports.default = Notification;

},{"../../common/events":2,"../component":7}],17:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _events = require('../../common/events');

var _events2 = _interopRequireDefault(_events);

var _component = require('../component');

var _component2 = _interopRequireDefault(_component);

var _componentManager = require('../componentManager');

var _utils = require('../../common/utils');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * --------------------------------------------------------------------------
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * Licensed under MIT (https://github.com/quark-dev/Phonon-Framework/blob/master/LICENSE)
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * --------------------------------------------------------------------------
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                */


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
    _inherits(OffCanvas, _Component);

    function OffCanvas() {
      var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

      _classCallCheck(this, OffCanvas);

      var _this = _possibleConstructorReturn(this, (OffCanvas.__proto__ || Object.getPrototypeOf(OffCanvas)).call(this, NAME, VERSION, DEFAULT_PROPERTIES, options, DATA_ATTRS_PROPERTIES, false, true));

      _this.useBackdrop = true;
      _this.currentWidth = null;
      _this.animate = true;

      _this.directions = ['left', 'right'];

      var sm = { name: 'sm', media: window.matchMedia('(min-width: 1px)') };
      var md = { name: 'md', media: window.matchMedia('(min-width: 768px)') };
      var lg = { name: 'lg', media: window.matchMedia('(min-width: 992px)') };
      var xl = { name: 'xl', media: window.matchMedia('(min-width: 1200px)') };

      _this.sizes = [sm, md, lg, xl].reverse();

      _this.checkDirection();
      _this.checkWidth();

      window.addEventListener('resize', function () {
        return _this.checkWidth();
      }, false);
      return _this;
    }

    _createClass(OffCanvas, [{
      key: 'checkDirection',
      value: function checkDirection() {
        var _this2 = this;

        this.directions.every(function (direction) {
          if (_this2.options.element.classList.contains('off-canvas-' + direction)) {
            _this2.direction = direction;
            return false;
          }
          return true;
        });
      }
    }, {
      key: 'checkWidth',
      value: function checkWidth() {
        var _this3 = this;

        if (!('matchMedia' in window)) {
          return;
        }

        this.sizes.every(function (size) {
          var match = size.media.media.match(/[a-z]?-width:\s?([0-9]+)/);

          if (match) {
            if (size.media.matches) {
              if (_this3.currentWidth !== size.name) {
                _this3.setAside(size.name);
              }
              _this3.currentWidth = size.name;
              return false;
            }
          }

          return true;
        });
      }
    }, {
      key: 'preventClosable',
      value: function preventClosable() {
        return _get(OffCanvas.prototype.__proto__ || Object.getPrototypeOf(OffCanvas.prototype), 'preventClosable', this).call(this) || this.options.aside[this.currentWidth] === true;
      }
    }, {
      key: 'setAside',
      value: function setAside(name) {
        var content = document.body;

        if (this.options.aside[name] === true) {
          if (!content.classList.contains('off-canvas-aside-' + this.direction)) {
            content.classList.add('off-canvas-aside-' + this.direction);
          }

          this.useBackdrop = false;

          // avoid animation by setting animate to false
          this.animate = false;
          this.show();
          // remove previous backdrop
          this.removeBackdrop();
        } else {
          if (content.classList.contains('off-canvas-aside-' + this.direction)) {
            content.classList.remove('off-canvas-aside-' + this.direction);
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
        var _this4 = this;

        if (this.options.element.classList.contains('show')) {
          return false;
        }

        // add a timeout so that the CSS animation works
        setTimeout(function () {
          _this4.triggerEvent(_events2.default.SHOW);

          var onShown = function onShown() {
            _this4.triggerEvent(_events2.default.SHOWN);

            if (_this4.animate) {
              _this4.options.element.removeEventListener(_events2.default.TRANSITION_END, onShown);
              _this4.options.element.classList.remove('animate');
            }
          };

          if (_this4.useBackdrop) {
            _this4.createBackdrop();
          }

          if (_this4.animate) {
            _this4.options.element.addEventListener(_events2.default.TRANSITION_END, onShown);
            _this4.options.element.classList.add('animate');
          } else {
            // directly trigger the onShown
            onShown();
          }

          _this4.options.element.classList.add('show');

          // attach event
          _this4.attachEvents();
        }, 1);

        return true;
      }
    }, {
      key: 'hide',
      value: function hide() {
        var _this5 = this;

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
            if (_this5.animate) {
              _this5.options.element.classList.remove('animate');
            }

            backdrop.removeEventListener(_events2.default.TRANSITION_END, onHidden);
            _this5.triggerEvent(_events2.default.HIDDEN);
            _this5.removeBackdrop();
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
        var _this6 = this;

        var dismissButtons = this.options.element.querySelectorAll('[data-dismiss]');

        if (dismissButtons) {
          Array.from(dismissButtons).forEach(function (button) {
            return _this6.registerElement({ target: button, event: 'click' });
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
        var _this7 = this;

        var dismissButtons = this.options.element.querySelectorAll('[data-dismiss]');

        if (dismissButtons) {
          Array.from(dismissButtons).forEach(function (button) {
            return _this7.unregisterElement({ target: button, event: 'click' });
          });
        }

        if (this.useBackdrop) {
          var backdrop = this.getBackdrop();
          this.unregisterElement({ target: backdrop, event: _events2.default.START });
        }

        this.unregisterElement({ target: document, event: 'keyup' });
      }
    }], [{
      key: 'identifier',
      value: function identifier() {
        return NAME;
      }
    }, {
      key: '_DOMInterface',
      value: function _DOMInterface(options) {
        return _get(OffCanvas.__proto__ || Object.getPrototypeOf(OffCanvas), '_DOMInterface', this).call(this, OffCanvas, options);
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
    Array.from(offCanvas).forEach(function (element) {
      var config = (0, _componentManager.getAttributesConfig)(element, DEFAULT_PROPERTIES, DATA_ATTRS_PROPERTIES);
      config.element = element;

      components.push({ element: element, offCanvas: new OffCanvas(config) });
    });
  }

  document.addEventListener('click', function (event) {
    var target = (0, _utils.findTargetByAttr)(event.target, 'data-toggle');
    if (!target) {
      return;
    }

    var dataToggleAttr = target.getAttribute('data-toggle');
    if (dataToggleAttr && dataToggleAttr === NAME) {
      var id = target.getAttribute('data-target');
      var element = document.querySelector(id);

      var component = components.find(function (c) {
        return c.element === element;
      });

      if (!component) {
        return;
      }

      target.blur();

      component.offCanvas.show();
    }
  });

  return OffCanvas;
}();

exports.default = OffCanvas;

},{"../../common/events":2,"../../common/utils":4,"../component":7,"../componentManager":8}],18:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _component = require('../component');

var _component2 = _interopRequireDefault(_component);

var _events = require('../../common/events');

var _events2 = _interopRequireDefault(_events);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /**
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
    _inherits(Progress, _Component);

    function Progress() {
      var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

      _classCallCheck(this, Progress);

      // set the wanted height
      var _this = _possibleConstructorReturn(this, (Progress.__proto__ || Object.getPrototypeOf(Progress)).call(this, NAME, VERSION, DEFAULT_PROPERTIES, options, DATA_ATTRS_PROPERTIES, false, false));

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

    _createClass(Progress, [{
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
      key: 'identifier',
      value: function identifier() {
        return NAME;
      }
    }, {
      key: '_DOMInterface',
      value: function _DOMInterface(options) {
        return _get(Progress.__proto__ || Object.getPrototypeOf(Progress), '_DOMInterface', this).call(this, Progress, options);
      }
    }]);

    return Progress;
  }(_component2.default);

  return Progress;
}();

exports.default = Progress;

},{"../../common/events":2,"../component":7}],19:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _component = require('../component');

var _component2 = _interopRequireDefault(_component);

var _componentManager = require('../componentManager');

var _events = require('../../common/events');

var _events2 = _interopRequireDefault(_events);

var _utils = require('../../common/utils');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * --------------------------------------------------------------------------
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * Licensed under MIT (https://github.com/quark-dev/Phonon-Framework/blob/master/LICENSE)
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * --------------------------------------------------------------------------
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                */


var Tab = function () {
  /**
   * ------------------------------------------------------------------------
   * Constants
   * ------------------------------------------------------------------------
   */

  var NAME = 'tab';
  var VERSION = '2.0.0';
  var DEFAULT_PROPERTIES = {};
  var DATA_ATTRS_PROPERTIES = [];
  var TAB_CONTENT_SELECTOR = '.tab-pane';

  /**
   * ------------------------------------------------------------------------
   * Class Definition
   * ------------------------------------------------------------------------
   */

  var Tab = function (_Component) {
    _inherits(Tab, _Component);

    function Tab() {
      var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

      _classCallCheck(this, Tab);

      return _possibleConstructorReturn(this, (Tab.__proto__ || Object.getPrototypeOf(Tab)).call(this, NAME, VERSION, DEFAULT_PROPERTIES, options, DATA_ATTRS_PROPERTIES, false, false));
    }

    _createClass(Tab, [{
      key: 'show',
      value: function show() {
        if (this.options.element.classList.contains('active')) {
          return false;
        }

        var id = this.options.element.getAttribute('href');
        var nav = (0, _utils.findTargetByClass)(this.options.element, 'nav');
        var navTabs = nav ? nav.querySelectorAll('[data-toggle="' + NAME + '"]') : null;

        if (navTabs) {
          Array.from(navTabs).forEach(function (tab) {
            if (tab.classList.contains('active')) {
              tab.classList.remove('active');
            }
            tab.setAttribute('aria-selected', false);
          });
        }

        this.options.element.classList.add('active');
        this.options.element.setAttribute('aria-selected', true);

        var tabContent = document.querySelector(id);
        var tabContents = tabContent.parentNode.querySelectorAll(TAB_CONTENT_SELECTOR);

        if (tabContents) {
          Array.from(tabContents).forEach(function (tab) {
            if (tab.classList.contains('active')) {
              tab.classList.remove('active');
            }
          });
        }

        tabContent.classList.add('showing');

        setTimeout(function () {
          var onShowed = function onShowed() {
            tabContent.classList.remove('animate');
            tabContent.classList.add('active');
            tabContent.classList.remove('showing');
            tabContent.removeEventListener(_events2.default.TRANSITION_END, onShowed);
          };

          tabContent.addEventListener(_events2.default.TRANSITION_END, onShowed);

          tabContent.classList.add('animate');
        }, 20);

        return true;
      }
    }, {
      key: 'hide',
      value: function hide() {
        if (!this.options.element.classList.contains('active')) {
          return false;
        }

        if (this.options.element.classList.contains('active')) {
          this.options.element.classList.remove('active');
        }

        this.options.element.setAttribute('aria-selected', false);

        var id = this.options.element.getAttribute('href');
        var tabContent = document.querySelector(id);

        if (tabContent.classList.contains('active')) {
          tabContent.classList.remove('active');
        }

        return true;
      }
    }], [{
      key: 'identifier',
      value: function identifier() {
        return NAME;
      }
    }, {
      key: '_DOMInterface',
      value: function _DOMInterface(options) {
        return _get(Tab.__proto__ || Object.getPrototypeOf(Tab), '_DOMInterface', this).call(this, Tab, options);
      }
    }]);

    return Tab;
  }(_component2.default);

  /**
   * ------------------------------------------------------------------------
   * DOM Api implementation
   * ------------------------------------------------------------------------
   */


  var components = [];

  var tabs = document.querySelectorAll('[data-toggle="' + NAME + '"]');
  if (tabs) {
    Array.from(tabs).forEach(function (element) {
      // const config = {}
      var config = (0, _componentManager.getAttributesConfig)(element, DEFAULT_PROPERTIES, DATA_ATTRS_PROPERTIES);
      config.element = element;

      components.push(Tab._DOMInterface(config));
    });
  }

  document.addEventListener('click', function (event) {
    var dataToggleAttr = event.target.getAttribute('data-toggle');
    if (dataToggleAttr && dataToggleAttr === NAME) {
      var id = event.target.getAttribute('href');

      var component = components.find(function (c) {
        return c.getElement().getAttribute('href') === id;
      });

      if (!component) {
        return;
      }

      component.show();
    }
  });

  return Tab;
}();

exports.default = Tab;

},{"../../common/events":2,"../../common/utils":4,"../component":7,"../componentManager":8}],20:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

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
      _classCallCheck(this, Binder);

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

    _createClass(Binder, [{
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
        return (typeof Node === 'undefined' ? 'undefined' : _typeof(Node)) === 'object' ? element instanceof Node : element && (typeof element === 'undefined' ? 'undefined' : _typeof(element)) === 'object' && typeof element.nodeType === 'number' && typeof element.nodeName === 'string';
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

        Array.from(element).forEach(function (el) {
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

},{}],21:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }(); /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * --------------------------------------------------------------------------
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * Licensed under MIT (https://github.com/quark-dev/Phonon-Framework/blob/master/LICENSE)
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * --------------------------------------------------------------------------
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      */


var _binder = require('./binder');

var _binder2 = _interopRequireDefault(_binder);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

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

      _classCallCheck(this, Intl);

      this.options = Object.assign(DEFAULT_PROPERTIES, options);

      if (typeof this.options.fallbackLocale !== 'string') {
        throw new Error(NAME + '. The fallback locale is mandatory and must be a string.');
      }

      if (this.options.data === null) {
        throw new Error(NAME + '. There is no translation data.');
      }

      if (_typeof(this.options.data[this.options.fallbackLocale]) !== 'object') {
        throw new Error(NAME + '. The fallback locale must necessarily have translation data.');
      }

      this.setLocale(this.options.locale, this.options.autoBind);
    }

    _createClass(Intl, [{
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

        if (_typeof(this.options.data[locale]) !== 'object') {
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
        return Object.keys(this.options.data);
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
            var keys = Object.keys(data).filter(function (key) {
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
}();

exports.default = Intl;

},{"./binder":20}],22:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }(); /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * --------------------------------------------------------------------------
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * Licensed under MIT (https://github.com/quark-dev/Phonon-Framework/blob/master/LICENSE)
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * --------------------------------------------------------------------------
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      */

var _page = require('./page');

var _page2 = _interopRequireDefault(_page);

var _events = require('../../common/events');

var _events2 = _interopRequireDefault(_events);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

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

      _classCallCheck(this, Pager);

      this.options = Object.assign(DEFAULT_PROPERTIES, options);

      this.pages = [];
      this.started = false;

      // add global listeners such ash hash change, navigation, etc.
      this.addPagerEvents();

      // faster way to init pages before the DOM is ready
      this.onDOMLoaded();
    }

    // private


    _createClass(Pager, [{
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

          this.triggerPageEvent(oldPageName, _events2.default.HIDE);
        }

        this.triggerPageEvent(pageName, _events2.default.SHOW);

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

          var onPageAnimationEnd = function onPageAnimationEnd() {
            if (oldPage.classList.contains('animate')) {
              oldPage.classList.remove('animate');
            }

            oldPage.classList.remove(oldPage.back ? 'pop-page' : 'push-page');

            _this2.triggerPageEvent(currentPage, _events2.default.SHOWN);
            _this2.triggerPageEvent(oldPage.previousPageName, _events2.default.HIDDEN);

            oldPage.removeEventListener(_events2.default.ANIMATION_END, onPageAnimationEnd);
          };

          if (this.options.animatePages) {
            oldPage.addEventListener(_events2.default.ANIMATION_END, onPageAnimationEnd);
            oldPage.classList.add('animate');
          } else {
            onPageAnimationEnd();
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
      key: 'onHashChange',
      value: function onHashChange() {
        var params = (this.getHash() ? this.getHash().split('/') : []).filter(function (p) {
          return p.length > 0;
        });
        if (params.length > 0) {
          // remove first value which is the page name
          params.shift();
        }

        this.triggerPageEvent(currentPage, _events2.default.HASH, params);

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
        var _this3 = this;

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

          _this3.addUniquePageModel(pageName);
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
}();

exports.default = Pager;

},{"../../common/events":2,"./page":23}],23:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }(); /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * --------------------------------------------------------------------------
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * Licensed under MIT (https://github.com/quark-dev/Phonon-Framework/blob/master/LICENSE)
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * --------------------------------------------------------------------------
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      */

var _utils = require('../../common/utils');

var _dispatch = require('../../common/events/dispatch');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

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
      _classCallCheck(this, Page);

      this.name = pageName;
      this.events = [];
      this.templatePath = null;
      this.renderFunction = null;
    }

    // getters

    _createClass(Page, [{
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
              Array.from(elements).forEach(function (el) {
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
          throw new Error('The template path must be a string. ' + (typeof templatePath === 'undefined' ? 'undefined' : _typeof(templatePath)) + ' is given');
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
          throw new Error('The custom template renderer must be a function. ' + (typeof renderFunction === 'undefined' ? 'undefined' : _typeof(renderFunction)) + ' is given');
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

},{"../../common/events/dispatch":1,"../../common/utils":4}],24:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _index = require('./hybrid-apps/pager/index');

var _index2 = _interopRequireDefault(_index);

var _intl = require('./hybrid-apps/intl');

var _intl2 = _interopRequireDefault(_intl);

var _network = require('./common/network');

var _network2 = _interopRequireDefault(_network);

var _dialog = require('./components/dialog');

var _dialog2 = _interopRequireDefault(_dialog);

var _prompt = require('./components/dialog/prompt');

var _prompt2 = _interopRequireDefault(_prompt);

var _confirm = require('./components/dialog/confirm');

var _confirm2 = _interopRequireDefault(_confirm);

var _loader = require('./components/dialog/loader');

var _loader2 = _interopRequireDefault(_loader);

var _notification = require('./components/notification');

var _notification2 = _interopRequireDefault(_notification);

var _collapse = require('./components/collapse');

var _collapse2 = _interopRequireDefault(_collapse);

var _accordion = require('./components/accordion');

var _accordion2 = _interopRequireDefault(_accordion);

var _tab = require('./components/tab');

var _tab2 = _interopRequireDefault(_tab);

var _progress = require('./components/progress');

var _progress2 = _interopRequireDefault(_progress);

var _loader3 = require('./components/loader');

var _loader4 = _interopRequireDefault(_loader3);

var _offCanvas = require('./components/off-canvas');

var _offCanvas2 = _interopRequireDefault(_offCanvas);

var _dropdown = require('./components/dropdown');

var _dropdown2 = _interopRequireDefault(_dropdown);

var _search = require('./components/dropdown/search');

var _search2 = _interopRequireDefault(_search);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * --------------------------------------------------------------------------
 * Licensed under MIT (https://github.com/quark-dev/Phonon-Framework/blob/master/LICENSE)
 * --------------------------------------------------------------------------
 */

var api = {};

/**
 * ------------------------------------------------------------------------
 * Pager
 * ------------------------------------------------------------------------
 */


// components
api.pager = function (options) {
  if (typeof api._pager === 'undefined') {
    api._pager = _index2.default._DOMInterface(options);
  }
  return api._pager;
};

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
api.dialog = function (options) {
  if (options.type === _prompt2.default.identifier()) {
    // prompt dialog
    return _prompt2.default._DOMInterface(options);
  }

  if (options.type === _confirm2.default.identifier()) {
    // confirm dialog
    return _confirm2.default._DOMInterface(options);
  }

  if (options.type === _loader2.default.identifier()) {
    // confirm dialog
    return _loader2.default._DOMInterface(options);
  }

  // generic dialog
  return _dialog2.default._DOMInterface(options);
};

/**
 * ------------------------------------------------------------------------
 * Collapse
 * ------------------------------------------------------------------------
 */
api.collapse = _collapse2.default._DOMInterface;

/**
 * ------------------------------------------------------------------------
 * Accordion
 * ------------------------------------------------------------------------
 */
api.accordion = _accordion2.default._DOMInterface;

/**
 * ------------------------------------------------------------------------
 * Tab
 * ------------------------------------------------------------------------
 */
api.tab = _tab2.default._DOMInterface;

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
api.loader = _loader4.default._DOMInterface;

/**
 * ------------------------------------------------------------------------
 * Off canvas
 * ------------------------------------------------------------------------
 */
api.offCanvas = _offCanvas2.default._DOMInterface;

/**
 * ------------------------------------------------------------------------
 * Dropdown
 * ------------------------------------------------------------------------
 */
api.dropdown = function (options) {
  if (options.search) {
    // search dropdown
    return _search2.default._DOMInterface(options);
  }

  // generic dropdown
  return _dropdown2.default._DOMInterface(options);
};

// Make the API live
window.phonon = api;

exports.default = api;

},{"./common/network":3,"./components/accordion":5,"./components/collapse":6,"./components/dialog":10,"./components/dialog/confirm":9,"./components/dialog/loader":11,"./components/dialog/prompt":12,"./components/dropdown":13,"./components/dropdown/search":14,"./components/loader":15,"./components/notification":16,"./components/off-canvas":17,"./components/progress":18,"./components/tab":19,"./hybrid-apps/intl":21,"./hybrid-apps/pager/index":22}]},{},[24])

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvanMvY29tbW9uL2V2ZW50cy9kaXNwYXRjaC5qcyIsInNyYy9qcy9jb21tb24vZXZlbnRzL2luZGV4LmpzIiwic3JjL2pzL2NvbW1vbi9uZXR3b3JrL2luZGV4LmpzIiwic3JjL2pzL2NvbW1vbi91dGlscy9pbmRleC5qcyIsInNyYy9qcy9jb21wb25lbnRzL2FjY29yZGlvbi9pbmRleC5qcyIsInNyYy9qcy9jb21wb25lbnRzL2NvbGxhcHNlL2luZGV4LmpzIiwic3JjL2pzL2NvbXBvbmVudHMvY29tcG9uZW50LmpzIiwic3JjL2pzL2NvbXBvbmVudHMvY29tcG9uZW50TWFuYWdlci5qcyIsInNyYy9qcy9jb21wb25lbnRzL2RpYWxvZy9jb25maXJtLmpzIiwic3JjL2pzL2NvbXBvbmVudHMvZGlhbG9nL2luZGV4LmpzIiwic3JjL2pzL2NvbXBvbmVudHMvZGlhbG9nL2xvYWRlci5qcyIsInNyYy9qcy9jb21wb25lbnRzL2RpYWxvZy9wcm9tcHQuanMiLCJzcmMvanMvY29tcG9uZW50cy9kcm9wZG93bi9pbmRleC5qcyIsInNyYy9qcy9jb21wb25lbnRzL2Ryb3Bkb3duL3NlYXJjaC5qcyIsInNyYy9qcy9jb21wb25lbnRzL2xvYWRlci9pbmRleC5qcyIsInNyYy9qcy9jb21wb25lbnRzL25vdGlmaWNhdGlvbi9pbmRleC5qcyIsInNyYy9qcy9jb21wb25lbnRzL29mZi1jYW52YXMvaW5kZXguanMiLCJzcmMvanMvY29tcG9uZW50cy9wcm9ncmVzcy9pbmRleC5qcyIsInNyYy9qcy9jb21wb25lbnRzL3RhYi9pbmRleC5qcyIsInNyYy9qcy9oeWJyaWQtYXBwcy9pbnRsL2JpbmRlci5qcyIsInNyYy9qcy9oeWJyaWQtYXBwcy9pbnRsL2luZGV4LmpzIiwic3JjL2pzL2h5YnJpZC1hcHBzL3BhZ2VyL2luZGV4LmpzIiwic3JjL2pzL2h5YnJpZC1hcHBzL3BhZ2VyL3BhZ2UuanMi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RCxDQVJEOztBQVVBO0FBQ0EsT0FBTyxNQUFQLEdBQWdCLEdBQWhCOztrQkFFZSxHIiwiZmlsZSI6InBob25vbi5qcyIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiZXhwb3J0IGZ1bmN0aW9uIGRpc3BhdGNoV2luRG9jRXZlbnQoZXZlbnROYW1lLCBtb2R1bGVOYW1lLCBkZXRhaWwgPSB7fSkge1xuICBjb25zdCBmdWxsRXZlbnROYW1lID0gYCR7ZXZlbnROYW1lfS5waC4ke21vZHVsZU5hbWV9YFxuICB3aW5kb3cuZGlzcGF0Y2hFdmVudChuZXcgQ3VzdG9tRXZlbnQoZnVsbEV2ZW50TmFtZSwgeyBkZXRhaWwgfSkpXG4gIGRvY3VtZW50LmRpc3BhdGNoRXZlbnQobmV3IEN1c3RvbUV2ZW50KGZ1bGxFdmVudE5hbWUsIHsgZGV0YWlsIH0pKVxufVxuXG5leHBvcnQgZnVuY3Rpb24gZGlzcGF0Y2hFbGVtZW50RXZlbnQoZG9tRWxlbWVudCwgZXZlbnROYW1lLCBtb2R1bGVOYW1lLCBkZXRhaWwgPSB7fSkge1xuICBjb25zdCBmdWxsRXZlbnROYW1lID0gYCR7ZXZlbnROYW1lfS5waC4ke21vZHVsZU5hbWV9YFxuICBkb21FbGVtZW50LmRpc3BhdGNoRXZlbnQobmV3IEN1c3RvbUV2ZW50KGZ1bGxFdmVudE5hbWUsIHsgZGV0YWlsIH0pKVxufVxuXG5leHBvcnQgZnVuY3Rpb24gZGlzcGF0Y2hQYWdlRXZlbnQoZXZlbnROYW1lLCBwYWdlTmFtZSwgZGV0YWlsID0ge30pIHtcbiAgY29uc3QgZnVsbEV2ZW50TmFtZSA9IGAke3BhZ2VOYW1lfS4ke2V2ZW50TmFtZX1gXG4gIHdpbmRvdy5kaXNwYXRjaEV2ZW50KG5ldyBDdXN0b21FdmVudChmdWxsRXZlbnROYW1lLCB7IGRldGFpbCB9KSlcbiAgZG9jdW1lbnQuZGlzcGF0Y2hFdmVudChuZXcgQ3VzdG9tRXZlbnQoZnVsbEV2ZW50TmFtZSwgeyBkZXRhaWwgfSkpXG59XG4iLCIvLyBAdG9kbyBrZWVwID9cbmlmICh0eXBlb2Ygd2luZG93ICE9PSAndW5kZWZpbmVkJykge1xuICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcignZXJyb3InLCAoKSA9PiB7XG4gICAgY29uc29sZS5lcnJvcignQW4gZXJyb3IgaGFzIG9jY3VyZWQhIFlvdSBjYW4gcGVuIGFuIGlzc3VlIGhlcmU6IGh0dHBzOi8vZ2l0aHViLmNvbS9xdWFyay1kZXYvUGhvbm9uLUZyYW1ld29yay9pc3N1ZXMnKVxuICB9KVxufVxuXG4vLyBVc2UgYXZhaWxhYmxlIGV2ZW50c1xubGV0IGF2YWlsYWJsZUV2ZW50cyA9IFsnbW91c2Vkb3duJywgJ21vdXNlbW92ZScsICdtb3VzZXVwJ11cbmxldCB0b3VjaFNjcmVlbiA9IGZhbHNlXG5cbmlmICh0eXBlb2Ygd2luZG93ICE9PSAndW5kZWZpbmVkJykge1xuICBpZiAoKCdvbnRvdWNoc3RhcnQnIGluIHdpbmRvdykgfHwgd2luZG93LkRvY3VtZW50VG91Y2ggJiYgZG9jdW1lbnQgaW5zdGFuY2VvZiBEb2N1bWVudFRvdWNoKSB7XG4gICAgdG91Y2hTY3JlZW4gPSB0cnVlXG4gICAgYXZhaWxhYmxlRXZlbnRzID0gWyd0b3VjaHN0YXJ0JywgJ3RvdWNobW92ZScsICd0b3VjaGVuZCcsICd0b3VjaGNhbmNlbCddXG4gIH1cblxuICBpZiAod2luZG93Lm5hdmlnYXRvci5wb2ludGVyRW5hYmxlZCkge1xuICAgIGF2YWlsYWJsZUV2ZW50cyA9IFsncG9pbnRlcmRvd24nLCAncG9pbnRlcm1vdmUnLCAncG9pbnRlcnVwJywgJ3BvaW50ZXJjYW5jZWwnXVxuICB9IGVsc2UgaWYgKHdpbmRvdy5uYXZpZ2F0b3IubXNQb2ludGVyRW5hYmxlZCkge1xuICAgIGF2YWlsYWJsZUV2ZW50cyA9IFsnTVNQb2ludGVyRG93bicsICdNU1BvaW50ZXJNb3ZlJywgJ01TUG9pbnRlclVwJywgJ01TUG9pbnRlckNhbmNlbCddXG4gIH1cbn1cblxuY29uc3QgZWwgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKVxuY29uc3QgdHJhbnNpdGlvbnMgPSBbXG4gIHsgbmFtZTogJ3RyYW5zaXRpb24nLCBzdGFydDogJ3RyYW5zaXRpb25zdGFydCcsIGVuZDogJ3RyYW5zaXRpb25lbmQnIH0sXG4gIHsgbmFtZTogJ01velRyYW5zaXRpb24nLCBzdGFydDogJ3RyYW5zaXRpb25zdGFydCcsIGVuZDogJ3RyYW5zaXRpb25lbmQnIH0sXG4gIHsgbmFtZTogJ21zVHJhbnNpdGlvbicsIHN0YXJ0OiAnbXNUcmFuc2l0aW9uU3RhcnQnLCBlbmQ6ICdtc1RyYW5zaXRpb25FbmQnIH0sXG4gIHsgbmFtZTogJ1dlYmtpdFRyYW5zaXRpb24nLCBzdGFydDogJ3dlYmtpdFRyYW5zaXRpb25TdGFydCcsIGVuZDogJ3dlYmtpdFRyYW5zaXRpb25FbmQnIH0sXG5dXG5jb25zdCBhbmltYXRpb25zID0gW1xuICB7IG5hbWU6ICdhbmltYXRpb24nLCBzdGFydDogJ2FuaW1hdGlvbnN0YXJ0JywgZW5kOiAnYW5pbWF0aW9uZW5kJyB9LFxuICB7IG5hbWU6ICdNb3pBbmltYXRpb24nLCBzdGFydDogJ2FuaW1hdGlvbnN0YXJ0JywgZW5kOiAnYW5pbWF0aW9uZW5kJyB9LFxuICB7IG5hbWU6ICdtc0FuaW1hdGlvbicsIHN0YXJ0OiAnbXNBbmltYXRpb25TdGFydCcsIGVuZDogJ21zQW5pbWF0aW9uRW5kJyB9LFxuICB7IG5hbWU6ICdXZWJraXRBbmltYXRpb24nLCBzdGFydDogJ3dlYmtpdEFuaW1hdGlvblN0YXJ0JywgZW5kOiAnd2Via2l0QW5pbWF0aW9uRW5kJyB9LFxuXVxuXG5jb25zdCB0cmFuc2l0aW9uU3RhcnQgPSB0cmFuc2l0aW9ucy5maW5kKHQgPT4gZWwuc3R5bGVbdC5uYW1lXSAhPT0gdW5kZWZpbmVkKS5zdGFydFxuY29uc3QgdHJhbnNpdGlvbkVuZCA9IHRyYW5zaXRpb25zLmZpbmQodCA9PiBlbC5zdHlsZVt0Lm5hbWVdICE9PSB1bmRlZmluZWQpLmVuZFxuY29uc3QgYW5pbWF0aW9uU3RhcnQgPSBhbmltYXRpb25zLmZpbmQodCA9PiBlbC5zdHlsZVt0Lm5hbWVdICE9PSB1bmRlZmluZWQpLnN0YXJ0XG5jb25zdCBhbmltYXRpb25FbmQgPSBhbmltYXRpb25zLmZpbmQodCA9PiBlbC5zdHlsZVt0Lm5hbWVdICE9PSB1bmRlZmluZWQpLmVuZFxuXG5leHBvcnQgZGVmYXVsdCB7XG4gIC8vIHRvdWNoIHNjcmVlbiBzdXBwb3J0XG4gIFRPVUNIX1NDUkVFTjogdG91Y2hTY3JlZW4sXG5cbiAgLy8gbmV0d29ya1xuICBORVRXT1JLX09OTElORTogJ29ubGluZScsXG4gIE5FVFdPUktfT0ZGTElORTogJ29mZmxpbmUnLFxuICBORVRXT1JLX1JFQ09OTkVDVElORzogJ3JlY29ubmVjdGluZycsXG4gIE5FVFdPUktfUkVDT05ORUNUSU5HX1NVQ0NFU1M6ICdyZWNvbm5lY3Quc3VjY2VzcycsXG4gIE5FVFdPUktfUkVDT05ORUNUSU5HX0ZBSUxVUkU6ICdyZWNvbm5lY3QuZmFpbHVyZScsXG5cbiAgLy8gdXNlciBpbnRlcmZhY2Ugc3RhdGVzXG4gIFNIT1c6ICdzaG93JyxcbiAgU0hPV046ICdzaG93bicsXG4gIEhJREU6ICdoaWRlJyxcbiAgSElEREVOOiAnaGlkZGVuJyxcblxuICAvLyBoYXNoXG4gIEhBU0g6ICdoYXNoJyxcblxuICAvLyB0b3VjaCwgbW91c2UgYW5kIHBvaW50ZXIgZXZlbnRzIHBvbHlmaWxsXG4gIFNUQVJUOiBhdmFpbGFibGVFdmVudHNbMF0sXG4gIE1PVkU6IGF2YWlsYWJsZUV2ZW50c1sxXSxcbiAgRU5EOiBhdmFpbGFibGVFdmVudHNbMl0sXG4gIENBTkNFTDogdHlwZW9mIGF2YWlsYWJsZUV2ZW50c1szXSA9PT0gJ3VuZGVmaW5lZCcgPyBudWxsIDogYXZhaWxhYmxlRXZlbnRzWzNdLFxuXG4gIC8vIHRyYW5zaXRpb25zXG4gIFRSQU5TSVRJT05fU1RBUlQ6IHRyYW5zaXRpb25TdGFydCxcbiAgVFJBTlNJVElPTl9FTkQ6IHRyYW5zaXRpb25FbmQsXG5cbiAgLy8gYW5pbWF0aW9uc1xuICBBTklNQVRJT05fU1RBUlQ6IGFuaW1hdGlvblN0YXJ0LFxuICBBTklNQVRJT05fRU5EOiBhbmltYXRpb25FbmQsXG5cbiAgLy8gZHJvcGRvd25cbiAgSVRFTV9TRUxFQ1RFRDogJ2l0ZW1TZWxlY3RlZCcsXG59IiwiLyoqXG4gKiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICogTGljZW5zZWQgdW5kZXIgTUlUIChodHRwczovL2dpdGh1Yi5jb20vcXVhcmstZGV2L1Bob25vbi1GcmFtZXdvcmsvYmxvYi9tYXN0ZXIvTElDRU5TRSlcbiAqIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gKi9cblxuaW1wb3J0IEV2ZW50IGZyb20gJy4uLy4uL2NvbW1vbi9ldmVudHMnXG5pbXBvcnQgQ29tcG9uZW50IGZyb20gJy4uLy4uL2NvbXBvbmVudHMvY29tcG9uZW50J1xuXG5jb25zdCBOZXR3b3JrID0gKCgpID0+IHtcbiAgLyoqXG4gICAqIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgKiBDb25zdGFudHNcbiAgICogLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAqL1xuXG4gIGNvbnN0IE5BTUUgPSAnbmV0d29yaydcbiAgY29uc3QgVkVSU0lPTiA9ICcyLjAuMCdcbiAgY29uc3QgREVGQVVMVF9QUk9QRVJUSUVTID0ge1xuICAgIGVsZW1lbnQ6IG51bGwsXG4gICAgaW5pdGlhbERlbGF5OiAzMDAwLFxuICAgIGRlbGF5OiA1MDAwLFxuICB9XG4gIGNvbnN0IERBVEFfQVRUUlNfUFJPUEVSVElFUyA9IFtcbiAgXVxuXG4gIC8qKlxuICAgKiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICogQ2xhc3MgRGVmaW5pdGlvblxuICAgKiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICovXG5cbiAgY2xhc3MgTmV0d29yayBleHRlbmRzIENvbXBvbmVudCB7XG4gICAgLyoqXG4gICAgICogQ3JlYXRlcyBhbiBpbnN0YW5jZSBvZiBOZXR3b3JrLlxuICAgICAqIEBwYXJhbSB7e319IFtvcHRpb25zPXt9XVxuICAgICAqL1xuICAgIGNvbnN0cnVjdG9yKG9wdGlvbnMgPSB7fSkge1xuICAgICAgc3VwZXIoTkFNRSwgVkVSU0lPTiwgREVGQVVMVF9QUk9QRVJUSUVTLCBvcHRpb25zLCBEQVRBX0FUVFJTX1BST1BFUlRJRVMsIHRydWUsIGZhbHNlKVxuXG4gICAgICB0aGlzLnhociA9IG51bGxcbiAgICAgIHRoaXMuY2hlY2tJbnRlcnZhbCA9IG51bGxcblxuICAgICAgdGhpcy5zZXRTdGF0dXMoRXZlbnQuTkVUV09SS19PTkxJTkUpXG5cbiAgICAgIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgICB0aGlzLnN0YXJ0Q2hlY2soKVxuICAgICAgfSwgdGhpcy5vcHRpb25zLmluaXRpYWxEZWxheSlcbiAgICB9XG5cbiAgICBnZXRTdGF0dXMoKSB7XG4gICAgICByZXR1cm4gdGhpcy5zdGF0dXNcbiAgICB9XG5cbiAgICBzZXRTdGF0dXMoc3RhdHVzKSB7XG4gICAgICB0aGlzLnN0YXR1cyA9IHN0YXR1c1xuICAgIH1cblxuICAgIHN0YXJ0UmVxdWVzdCgpIHtcbiAgICAgIHRoaXMueGhyID0gbmV3IFhNTEh0dHBSZXF1ZXN0KClcbiAgICAgIHRoaXMueGhyLm9mZmxpbmUgPSBmYWxzZVxuXG4gICAgICBjb25zdCB1cmwgPSBgL2Zhdmljb24uaWNvP189JHtuZXcgRGF0ZSgpLmdldFRpbWUoKX1gXG5cbiAgICAgIHRoaXMudHJpZ2dlckV2ZW50KEV2ZW50Lk5FVFdPUktfUkVDT05ORUNUSU5HLCB7IGRhdGU6IG5ldyBEYXRlKCkgfSwgZmFsc2UpICAgICAgICAgICAgXG5cbiAgICAgIHRoaXMueGhyLm9wZW4oJ0hFQUQnLCB1cmwsIHRydWUpXG5cbiAgICAgIHRoaXMueGhyLnRpbWVvdXQgPSB0aGlzLm9wdGlvbnMuZGVsYXkgLSAxXG4gICAgICB0aGlzLnhoci5vbnRpbWVvdXQgPSAoKSA9PiB7XG4gICAgICAgIHRoaXMueGhyLmFib3J0KClcbiAgICAgICAgdGhpcy54aHIgPSBudWxsXG4gICAgICB9XG5cbiAgICAgIHRoaXMueGhyLm9ubG9hZCA9ICgpID0+IHtcbiAgICAgICAgdGhpcy5vblVwKClcbiAgICAgIH1cbiAgICAgIHRoaXMueGhyLm9uZXJyb3IgPSAoKSA9PiB7XG4gICAgICAgIHRoaXMub25Eb3duKClcbiAgICAgIH1cblxuICAgICAgdHJ5IHtcbiAgICAgICAgdGhpcy54aHIuc2VuZCgpXG4gICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgIHRoaXMub25Eb3duKClcbiAgICAgIH1cbiAgICB9XG5cbiAgICBvblVwKCkge1xuICAgICAgdGhpcy50cmlnZ2VyRXZlbnQoRXZlbnQuTkVUV09SS19SRUNPTk5FQ1RJTkdfU1VDQ0VTUywgeyBkYXRlOiBuZXcgRGF0ZSgpIH0sIGZhbHNlKVxuXG4gICAgICBpZiAodGhpcy5nZXRTdGF0dXMoKSAhPT0gRXZlbnQuTkVUV09SS19PTkxJTkUpIHtcbiAgICAgICAgdGhpcy50cmlnZ2VyRXZlbnQoRXZlbnQuTkVUV09SS19PTkxJTkUsIHsgZGF0ZTogbmV3IERhdGUoKSB9LCBmYWxzZSlcbiAgICAgIH1cblxuICAgICAgdGhpcy5zZXRTdGF0dXMoRXZlbnQuTkVUV09SS19PTkxJTkUpICAgICAgXG4gICAgfVxuXG4gICAgb25Eb3duKCkge1xuICAgICAgdGhpcy50cmlnZ2VyRXZlbnQoRXZlbnQuTkVUV09SS19SRUNPTk5FQ1RJTkdfRkFJTFVSRSwgeyBkYXRlOiBuZXcgRGF0ZSgpIH0sIGZhbHNlKVxuXG4gICAgICBpZiAodGhpcy5nZXRTdGF0dXMoKSAhPT0gRXZlbnQuTkVUV09SS19PRkZMSU5FKSB7XG4gICAgICAgIHRoaXMudHJpZ2dlckV2ZW50KEV2ZW50Lk5FVFdPUktfT0ZGTElORSwgeyBkYXRlOiBuZXcgRGF0ZSgpIH0sIGZhbHNlKVxuICAgICAgfVxuXG4gICAgICB0aGlzLnNldFN0YXR1cyhFdmVudC5ORVRXT1JLX09GRkxJTkUpICAgICAgXG4gICAgfVxuXG4gICAgc3RhcnRDaGVjaygpIHtcbiAgICAgIHRoaXMuc3RvcENoZWNrKClcblxuICAgICAgdGhpcy5zdGFydFJlcXVlc3QoKSAgICAgIFxuXG4gICAgICB0aGlzLmNoZWNrSW50ZXJ2YWwgPSBzZXRJbnRlcnZhbCgoKSA9PiB7XG4gICAgICAgIHRoaXMuc3RhcnRSZXF1ZXN0KClcbiAgICAgIH0sIHRoaXMub3B0aW9ucy5kZWxheSlcbiAgICB9XG5cbiAgICBzdG9wQ2hlY2soKSB7XG4gICAgICBpZiAodGhpcy5jaGVja0ludGVydmFsICE9PSBudWxsKSB7XG4gICAgICAgIGNsZWFySW50ZXJ2YWwodGhpcy5jaGVja0ludGVydmFsKVxuICAgICAgICB0aGlzLmNoZWNrSW50ZXJ2YWwgPSBudWxsXG4gICAgICB9XG4gICAgfVxuXG4gICAgc3RhdGljIF9ET01JbnRlcmZhY2Uob3B0aW9ucykge1xuICAgICAgcmV0dXJuIHN1cGVyLl9ET01JbnRlcmZhY2UoTmV0d29yaywgb3B0aW9ucylcbiAgICB9XG4gIH1cblxuICByZXR1cm4gTmV0d29ya1xufSkoKVxuXG5leHBvcnQgZGVmYXVsdCBOZXR3b3JrXG4iLCJcbmV4cG9ydCBmdW5jdGlvbiBsb2FkRmlsZSh1cmwsIGZuLCBwb3N0RGF0YSkge1xuICBjb25zdCByZXEgPSBuZXcgWE1MSHR0cFJlcXVlc3QoKVxuICBpZiAocmVxLm92ZXJyaWRlTWltZVR5cGUpIHJlcS5vdmVycmlkZU1pbWVUeXBlKCd0ZXh0L2h0bWw7IGNoYXJzZXQ9dXRmLTgnKVxuICByZXEub25yZWFkeXN0YXRlY2hhbmdlID0gKCkgPT4ge1xuICAgIGlmIChyZXEucmVhZHlTdGF0ZSA9PT0gNCAmJiAocGFyc2VJbnQocmVxLnN0YXR1cywgMTApID09PSAyMDBcbiAgICAgIHx8ICFyZXEuc3RhdHVzICYmIHJlcS5yZXNwb25zZVRleHQubGVuZ3RoKSkge1xuICAgICAgZm4ocmVxLnJlc3BvbnNlVGV4dClcbiAgICB9XG4gIH1cblxuICBpZiAodHlwZW9mIHBvc3REYXRhICE9PSAnc3RyaW5nJykge1xuICAgIHJlcS5vcGVuKCdHRVQnLCB1cmwsIHRydWUpXG4gICAgcmVxLnNlbmQoJycpXG4gIH0gZWxzZSB7XG4gICAgcmVxLm9wZW4oJ1BPU1QnLCB1cmwsIHRydWUpXG4gICAgcmVxLnNldFJlcXVlc3RIZWFkZXIoJ0NvbnRlbnQtdHlwZScsICdhcHBsaWNhdGlvbi94LXd3dy1mb3JtLXVybGVuY29kZWQnKVxuICAgIHJlcS5zZW5kKHBvc3REYXRhKVxuICB9XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBnZW5lcmF0ZUlkKCkge1xuICByZXR1cm4gTWF0aC5yYW5kb20oKS50b1N0cmluZygzNikuc3Vic3RyKDIsIDEwKVxufVxuXG5leHBvcnQgZnVuY3Rpb24gZmluZFRhcmdldEJ5Q2xhc3ModGFyZ2V0LCBwYXJlbnRDbGFzcykge1xuICBmb3IgKDsgdGFyZ2V0ICYmIHRhcmdldCAhPT0gZG9jdW1lbnQ7IHRhcmdldCA9IHRhcmdldC5wYXJlbnROb2RlKSB7XG4gICAgaWYgKHRhcmdldC5jbGFzc0xpc3QuY29udGFpbnMocGFyZW50Q2xhc3MpKSB7XG4gICAgICByZXR1cm4gdGFyZ2V0XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIG51bGxcbn1cblxuXG5leHBvcnQgZnVuY3Rpb24gZmluZFRhcmdldEJ5SWQodGFyZ2V0LCBwYXJlbnRJZCkge1xuICBmb3IgKDsgdGFyZ2V0ICYmIHRhcmdldCAhPT0gZG9jdW1lbnQ7IHRhcmdldCA9IHRhcmdldC5wYXJlbnROb2RlKSB7XG4gICAgaWYgKHRhcmdldC5nZXRBdHRyaWJ1dGUoJ2lkJykgPT09IHBhcmVudElkKSB7XG4gICAgICByZXR1cm4gdGFyZ2V0XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIG51bGxcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGZpbmRUYXJnZXRCeUF0dHIodGFyZ2V0LCBhdHRyKSB7XG4gIGZvciAoOyB0YXJnZXQgJiYgdGFyZ2V0ICE9PSBkb2N1bWVudDsgdGFyZ2V0ID0gdGFyZ2V0LnBhcmVudE5vZGUpIHtcbiAgICBpZiAodGFyZ2V0LmdldEF0dHJpYnV0ZShhdHRyKSAhPT0gbnVsbCkge1xuICAgICAgcmV0dXJuIHRhcmdldFxuICAgIH1cbiAgfVxuXG4gIHJldHVybiBudWxsXG59XG4iLCIvKipcbiAqIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gKiBMaWNlbnNlZCB1bmRlciBNSVQgKGh0dHBzOi8vZ2l0aHViLmNvbS9xdWFyay1kZXYvUGhvbm9uLUZyYW1ld29yay9ibG9iL21hc3Rlci9MSUNFTlNFKVxuICogLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAqL1xuaW1wb3J0IENvbXBvbmVudCBmcm9tICcuLi9jb21wb25lbnQnXG5pbXBvcnQgQ29sbGFwc2UgZnJvbSAnLi4vY29sbGFwc2UnXG5pbXBvcnQgeyBnZXRBdHRyaWJ1dGVzQ29uZmlnIH0gZnJvbSAnLi4vY29tcG9uZW50TWFuYWdlcidcbmltcG9ydCB7IGZpbmRUYXJnZXRCeUNsYXNzIH0gZnJvbSAnLi4vLi4vY29tbW9uL3V0aWxzJ1xuXG5jb25zdCBBY2NvcmRpb24gPSAoKCkgPT4ge1xuICAvKipcbiAgICogLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAqIENvbnN0YW50c1xuICAgKiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICovXG5cbiAgY29uc3QgTkFNRSA9ICdhY2NvcmRpb24nXG4gIGNvbnN0IFZFUlNJT04gPSAnMi4wLjAnXG4gIGNvbnN0IERFRkFVTFRfUFJPUEVSVElFUyA9IHtcbiAgICBlbGVtZW50OiBudWxsLFxuICB9XG4gIGNvbnN0IERBVEFfQVRUUlNfUFJPUEVSVElFUyA9IFtcbiAgXVxuXG4gIC8qKlxuICAgKiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICogQ2xhc3MgRGVmaW5pdGlvblxuICAgKiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICovXG5cbiAgY2xhc3MgQWNjb3JkaW9uIGV4dGVuZHMgQ29tcG9uZW50IHtcblxuICAgIGNvbnN0cnVjdG9yKG9wdGlvbnMgPSB7fSkge1xuICAgICAgc3VwZXIoTkFNRSwgVkVSU0lPTiwgREVGQVVMVF9QUk9QRVJUSUVTLCBvcHRpb25zLCBEQVRBX0FUVFJTX1BST1BFUlRJRVMsIGZhbHNlLCBmYWxzZSlcblxuICAgICAgdGhpcy5jb2xsYXBzZXMgPSBbXVxuXG4gICAgICBjb25zdCB0b2dnbGVzID0gdGhpcy5vcHRpb25zLmVsZW1lbnQucXVlcnlTZWxlY3RvckFsbChgW2RhdGEtdG9nZ2xlPVwiJHtOQU1FfVwiXWApXG4gICAgICBBcnJheS5mcm9tKHRvZ2dsZXMpLmZvckVhY2goKHRvZ2dsZSkgPT4ge1xuICAgICAgICBjb25zdCBjb2xsYXBzZUlkID0gdG9nZ2xlLmdldEF0dHJpYnV0ZSgnaHJlZicpXG4gICAgICAgIGNvbnN0IGNvbGxhcHNlID0gZG9jdW1lbnQucXVlcnlTZWxlY3Rvcihjb2xsYXBzZUlkKVxuXG4gICAgICAgIGlmIChjb2xsYXBzZSkge1xuICAgICAgICAgIHRoaXMuYWRkQ29sbGFwc2UoY29sbGFwc2UpXG4gICAgICAgIH1cbiAgICAgIH0pXG4gICAgfVxuXG4gICAgb25FbGVtZW50RXZlbnQoZXZlbnQpIHtcbiAgICAgIGNvbnN0IGlkID0gZXZlbnQudGFyZ2V0LmdldEF0dHJpYnV0ZSgnaHJlZicpXG4gICAgICBjb25zdCBlbGVtZW50ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihpZClcblxuICAgICAgdGhpcy5zZXRDb2xsYXBzZXMoZWxlbWVudClcbiAgICB9XG5cbiAgICBhZGRDb2xsYXBzZShlbGVtZW50KSB7XG4gICAgICBjb25zdCBjb2xsYXBzZSA9IG5ldyBDb2xsYXBzZSh7XG4gICAgICAgIGVsZW1lbnQsXG4gICAgICB9KVxuICAgICAgdGhpcy5jb2xsYXBzZXMucHVzaChjb2xsYXBzZSlcblxuICAgICAgcmV0dXJuIGNvbGxhcHNlXG4gICAgfVxuXG4gICAgZ2V0Q29sbGFwc2UoZWxlbWVudCkge1xuICAgICAgbGV0IGNvbGxhcHNlID0gdGhpcy5jb2xsYXBzZXMuZmluZChjID0+IGMub3B0aW9ucy5lbGVtZW50LmdldEF0dHJpYnV0ZSgnaWQnKSA9PT0gZWxlbWVudC5nZXRBdHRyaWJ1dGUoJ2lkJykpXG5cbiAgICAgIGlmICghY29sbGFwc2UpIHtcbiAgICAgICAgLy8gY3JlYXRlIGEgbmV3IGNvbGxhcHNlXG4gICAgICAgIGNvbGxhcHNlID0gdGhpcy5hZGRDb2xsYXBzZSgpXG4gICAgICB9XG5cbiAgICAgIHJldHVybiBjb2xsYXBzZVxuICAgIH1cblxuICAgIGdldENvbGxhcHNlcygpIHtcbiAgICAgIHJldHVybiB0aGlzLmNvbGxhcHNlc1xuICAgIH1cblxuICAgIHNldENvbGxhcHNlcyhzaG93Q29sbGFwc2UpIHtcbiAgICAgIGNvbnN0IGNvbGxhcHNlID0gdGhpcy5nZXRDb2xsYXBzZShzaG93Q29sbGFwc2UpXG4gICAgICB0aGlzLmNvbGxhcHNlcy5mb3JFYWNoKChjKSA9PiB7XG4gICAgICAgIGlmIChjLm9wdGlvbnMuZWxlbWVudC5nZXRBdHRyaWJ1dGUoJ2lkJykgIT09IHNob3dDb2xsYXBzZS5nZXRBdHRyaWJ1dGUoJ2lkJykpIHtcbiAgICAgICAgICBjLmhpZGUoKVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGNvbGxhcHNlLnRvZ2dsZSgpXG4gICAgICAgIH1cbiAgICAgIH0pXG4gICAgfVxuXG4gICAgc2hvdyhjb2xsYXBzZUVsKSB7XG4gICAgICBsZXQgY29sbGFwc2UgPSBjb2xsYXBzZUVsXG4gICAgICBpZiAodHlwZW9mIGNvbGxhcHNlRWwgPT09ICdzdHJpbmcnKSB7XG4gICAgICAgIGNvbGxhcHNlID0gZG9jdW1lbnQucXVlcnlTZWxlY3Rvcihjb2xsYXBzZUVsKVxuICAgICAgfVxuXG4gICAgICBpZiAoIWNvbGxhcHNlKSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcihgJHtOQU1FfS4gVGhlIGNvbGxhcHNpYmxlICR7Y29sbGFwc2VFbH0gaXMgYW4gaW52YWxpZCBIVE1MRWxlbWVudC5gKVxuICAgICAgfVxuXG4gICAgICB0aGlzLnNldENvbGxhcHNlcyhjb2xsYXBzZSlcblxuICAgICAgcmV0dXJuIHRydWVcbiAgICB9XG5cbiAgICBoaWRlKGNvbGxhcHNlRWwpIHtcbiAgICAgIGxldCBjb2xsYXBzZSA9IGNvbGxhcHNlRWxcbiAgICAgIGlmICh0eXBlb2YgY29sbGFwc2VFbCA9PT0gJ3N0cmluZycpIHtcbiAgICAgICAgY29sbGFwc2UgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKGNvbGxhcHNlRWwpXG4gICAgICB9XG5cbiAgICAgIGlmICghY29sbGFwc2UpIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKGAke05BTUV9LiBUaGUgY29sbGFwc2libGUgJHtjb2xsYXBzZUVsfSBpcyBhbiBpbnZhbGlkIEhUTUxFbGVtZW50LmApXG4gICAgICB9XG5cbiAgICAgIGNvbnN0IGNvbGxhcHNlT2JqID0gdGhpcy5nZXRDb2xsYXBzZShjb2xsYXBzZSlcbiAgICAgIHJldHVybiBjb2xsYXBzZU9iai5oaWRlKClcbiAgICB9XG5cbiAgICBzdGF0aWMgaWRlbnRpZmllcigpIHtcbiAgICAgIHJldHVybiBOQU1FXG4gICAgfVxuXG4gICAgc3RhdGljIF9ET01JbnRlcmZhY2Uob3B0aW9ucykge1xuICAgICAgcmV0dXJuIHN1cGVyLl9ET01JbnRlcmZhY2UoQWNjb3JkaW9uLCBvcHRpb25zKVxuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICogRE9NIEFwaSBpbXBsZW1lbnRhdGlvblxuICAgKiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICovXG4gIGNvbnN0IGNvbXBvbmVudHMgPSBbXVxuXG4gIGNvbnN0IGFjY29yZGlvbnMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKGAuJHtOQU1FfWApXG4gIGlmIChhY2NvcmRpb25zKSB7XG4gICAgQXJyYXkuZnJvbShhY2NvcmRpb25zKS5mb3JFYWNoKChlbGVtZW50KSA9PiB7XG4gICAgICBjb25zdCBjb25maWcgPSBnZXRBdHRyaWJ1dGVzQ29uZmlnKGVsZW1lbnQsIERFRkFVTFRfUFJPUEVSVElFUywgREFUQV9BVFRSU19QUk9QRVJUSUVTKVxuICAgICAgY29uZmlnLmVsZW1lbnQgPSBlbGVtZW50XG5cbiAgICAgIGNvbXBvbmVudHMucHVzaChBY2NvcmRpb24uX0RPTUludGVyZmFjZShjb25maWcpKVxuICAgIH0pXG4gIH1cblxuICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIChldmVudCkgPT4ge1xuICAgIGNvbnN0IGRhdGFUb2dnbGVBdHRyID0gZXZlbnQudGFyZ2V0LmdldEF0dHJpYnV0ZSgnZGF0YS10b2dnbGUnKVxuICAgIGlmIChkYXRhVG9nZ2xlQXR0ciAmJiBkYXRhVG9nZ2xlQXR0ciA9PT0gTkFNRSkge1xuICAgICAgY29uc3QgY29sbGFwc2VJZCA9IGV2ZW50LnRhcmdldC5nZXRBdHRyaWJ1dGUoJ2RhdGEtdGFyZ2V0JykgfHwgZXZlbnQudGFyZ2V0LmdldEF0dHJpYnV0ZSgnaHJlZicpXG4gICAgICBjb25zdCBjb2xsYXBzZUVsID0gZG9jdW1lbnQucXVlcnlTZWxlY3Rvcihjb2xsYXBzZUlkKVxuXG4gICAgICBjb25zdCBhY2NvcmRpb24gPSBmaW5kVGFyZ2V0QnlDbGFzcyhldmVudC50YXJnZXQsICdhY2NvcmRpb24nKVxuXG4gICAgICBpZiAoYWNjb3JkaW9uID09PSBudWxsKSB7XG4gICAgICAgIHJldHVyblxuICAgICAgfVxuXG4gICAgICBjb25zdCBhY2NvcmRpb25JZCA9IGFjY29yZGlvbi5nZXRBdHRyaWJ1dGUoJ2lkJylcbiAgICAgIGNvbnN0IGNvbXBvbmVudCA9IGNvbXBvbmVudHMuZmluZChjID0+IGMuZ2V0RWxlbWVudCgpLmdldEF0dHJpYnV0ZSgnaWQnKSA9PT0gYWNjb3JkaW9uSWQpXG5cbiAgICAgIGlmICghY29tcG9uZW50KSB7XG4gICAgICAgIHJldHVyblxuICAgICAgfVxuXG4gICAgICAvLyBpZiB0aGUgY29sbGFwc2UgaGFzIGJlZW4gYWRkZWQgcHJvZ3JhbW1hdGljYWxseSwgd2UgYWRkIGl0XG4gICAgICBjb25zdCB0YXJnZXRDb2xsYXBzZSA9IGNvbXBvbmVudC5nZXRDb2xsYXBzZXMoKS5maW5kKGMgPT4gYy5nZXRFbGVtZW50KCkgPT09IGNvbGxhcHNlRWwpXG4gICAgICBpZiAoIXRhcmdldENvbGxhcHNlKSB7XG4gICAgICAgIGNvbXBvbmVudC5hZGRDb2xsYXBzZShjb2xsYXBzZUVsKVxuICAgICAgfVxuXG4gICAgICBjb21wb25lbnQuc2hvdyhjb2xsYXBzZUlkKVxuICAgIH1cbiAgfSlcblxuICByZXR1cm4gQWNjb3JkaW9uXG59KSgpXG5cbmV4cG9ydCBkZWZhdWx0IEFjY29yZGlvblxuIiwiLyoqXG4gKiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICogTGljZW5zZWQgdW5kZXIgTUlUIChodHRwczovL2dpdGh1Yi5jb20vcXVhcmstZGV2L1Bob25vbi1GcmFtZXdvcmsvYmxvYi9tYXN0ZXIvTElDRU5TRSlcbiAqIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gKi9cbmltcG9ydCBDb21wb25lbnQgZnJvbSAnLi4vY29tcG9uZW50J1xuaW1wb3J0IHsgZ2V0QXR0cmlidXRlc0NvbmZpZyB9IGZyb20gJy4uL2NvbXBvbmVudE1hbmFnZXInXG5pbXBvcnQgRXZlbnQgZnJvbSAnLi4vLi4vY29tbW9uL2V2ZW50cydcbmltcG9ydCB7IGZpbmRUYXJnZXRCeUF0dHIgfSBmcm9tICcuLi8uLi9jb21tb24vdXRpbHMnXG5cbmNvbnN0IENvbGxhcHNlID0gKCgpID0+IHtcbiAgLyoqXG4gICAqIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgKiBDb25zdGFudHNcbiAgICogLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAqL1xuXG4gIGNvbnN0IE5BTUUgPSAnY29sbGFwc2UnXG4gIGNvbnN0IFZFUlNJT04gPSAnMi4wLjAnXG4gIGNvbnN0IERFRkFVTFRfUFJPUEVSVElFUyA9IHtcbiAgICBlbGVtZW50OiBudWxsLFxuICAgIHRvZ2dsZTogZmFsc2UsXG4gIH1cbiAgY29uc3QgREFUQV9BVFRSU19QUk9QRVJUSUVTID0gW1xuICAgICd0b2dnbGUnLFxuICBdXG5cbiAgLyoqXG4gICAqIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgKiBDbGFzcyBEZWZpbml0aW9uXG4gICAqIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgKi9cblxuICBjbGFzcyBDb2xsYXBzZSBleHRlbmRzIENvbXBvbmVudCB7XG5cbiAgICBjb25zdHJ1Y3RvcihvcHRpb25zID0ge30pIHtcbiAgICAgIHN1cGVyKE5BTUUsIFZFUlNJT04sIERFRkFVTFRfUFJPUEVSVElFUywgb3B0aW9ucywgREFUQV9BVFRSU19QUk9QRVJUSUVTLCBmYWxzZSwgZmFsc2UpXG5cbiAgICAgIHRoaXMub25UcmFuc2l0aW9uID0gZmFsc2VcblxuICAgICAgLy8gdG9nZ2xlIGRpcmVjdGx5XG4gICAgICBpZiAodGhpcy5vcHRpb25zLnRvZ2dsZSkge1xuICAgICAgICB0aGlzLnNob3coKVxuICAgICAgfVxuICAgIH1cblxuICAgIGdldEhlaWdodCgpIHtcbiAgICAgIHJldHVybiB0aGlzLm9wdGlvbnMuZWxlbWVudC5nZXRCb3VuZGluZ0NsaWVudFJlY3QodGhpcy5vcHRpb25zLmVsZW1lbnQpLmhlaWdodFxuICAgIH1cblxuICAgIHRvZ2dsZSgpIHtcbiAgICAgIGlmICh0aGlzLm9wdGlvbnMuZWxlbWVudC5jbGFzc0xpc3QuY29udGFpbnMoJ3Nob3cnKSkge1xuICAgICAgICByZXR1cm4gdGhpcy5oaWRlKClcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIHRoaXMuc2hvdygpXG4gICAgfVxuXG4gICAgc2hvdygpIHtcbiAgICAgIGlmICh0aGlzLm9uVHJhbnNpdGlvbikge1xuICAgICAgICByZXR1cm4gZmFsc2VcbiAgICAgIH1cblxuICAgICAgaWYgKHRoaXMub3B0aW9ucy5lbGVtZW50LmNsYXNzTGlzdC5jb250YWlucygnc2hvdycpKSB7XG4gICAgICAgIHJldHVybiBmYWxzZVxuICAgICAgfVxuXG4gICAgICB0aGlzLm9uVHJhbnNpdGlvbiA9IHRydWVcblxuICAgICAgY29uc3Qgb25Db2xsYXBzZWQgPSAoKSA9PiB7XG4gICAgICAgIHRoaXMub3B0aW9ucy5lbGVtZW50LmNsYXNzTGlzdC5hZGQoJ3Nob3cnKVxuICAgICAgICB0aGlzLm9wdGlvbnMuZWxlbWVudC5jbGFzc0xpc3QucmVtb3ZlKCdjb2xsYXBzaW5nJylcbiAgICAgICAgdGhpcy5vcHRpb25zLmVsZW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcihFdmVudC5UUkFOU0lUSU9OX0VORCwgb25Db2xsYXBzZWQpXG5cbiAgICAgICAgdGhpcy5vcHRpb25zLmVsZW1lbnQuc2V0QXR0cmlidXRlKCdhcmlhLWV4cGFuZGVkJywgdHJ1ZSlcblxuICAgICAgICB0aGlzLm9uVHJhbnNpdGlvbiA9IGZhbHNlXG4gICAgICB9XG5cbiAgICAgIGlmICghdGhpcy5vcHRpb25zLmVsZW1lbnQuY2xhc3NMaXN0LmNvbnRhaW5zKCdjb2xsYXBzaW5nJykpIHtcbiAgICAgICAgdGhpcy5vcHRpb25zLmVsZW1lbnQuY2xhc3NMaXN0LmFkZCgnY29sbGFwc2luZycpXG4gICAgICB9XG5cbiAgICAgIHRoaXMub3B0aW9ucy5lbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIoRXZlbnQuVFJBTlNJVElPTl9FTkQsIG9uQ29sbGFwc2VkKVxuXG4gICAgICBjb25zdCBoZWlnaHQgPSB0aGlzLmdldEhlaWdodCgpXG5cbiAgICAgIHRoaXMub3B0aW9ucy5lbGVtZW50LnN0eWxlLmhlaWdodCA9ICcwcHgnXG5cbiAgICAgIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgICB0aGlzLm9wdGlvbnMuZWxlbWVudC5zdHlsZS5oZWlnaHQgPSBgJHtoZWlnaHR9cHhgXG4gICAgICB9LCAyMClcblxuICAgICAgcmV0dXJuIHRydWVcbiAgICB9XG5cbiAgICBoaWRlKCkge1xuICAgICAgaWYgKHRoaXMub25UcmFuc2l0aW9uKSB7XG4gICAgICAgIHJldHVybiBmYWxzZVxuICAgICAgfVxuXG4gICAgICBpZiAoIXRoaXMub3B0aW9ucy5lbGVtZW50LmNsYXNzTGlzdC5jb250YWlucygnc2hvdycpKSB7XG4gICAgICAgIHJldHVybiBmYWxzZVxuICAgICAgfVxuXG4gICAgICB0aGlzLm9uVHJhbnNpdGlvbiA9IHRydWVcblxuICAgICAgY29uc3Qgb25Db2xsYXBzZWQgPSAoKSA9PiB7XG4gICAgICAgIHRoaXMub3B0aW9ucy5lbGVtZW50LmNsYXNzTGlzdC5yZW1vdmUoJ2NvbGxhcHNpbmcnKVxuICAgICAgICB0aGlzLm9wdGlvbnMuZWxlbWVudC5zdHlsZS5oZWlnaHQgPSAnYXV0bydcbiAgICAgICAgdGhpcy5vcHRpb25zLmVsZW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcihFdmVudC5UUkFOU0lUSU9OX0VORCwgb25Db2xsYXBzZWQpXG5cbiAgICAgICAgdGhpcy5vcHRpb25zLmVsZW1lbnQuc2V0QXR0cmlidXRlKCdhcmlhLWV4cGFuZGVkJywgZmFsc2UpXG5cbiAgICAgICAgdGhpcy5vblRyYW5zaXRpb24gPSBmYWxzZVxuICAgICAgfVxuXG4gICAgICB0aGlzLm9wdGlvbnMuZWxlbWVudC5zdHlsZS5oZWlnaHQgPSAnMHB4J1xuXG4gICAgICBpZiAoIXRoaXMub3B0aW9ucy5lbGVtZW50LmNsYXNzTGlzdC5jb250YWlucygnY29sbGFwc2luZycpKSB7XG4gICAgICAgIHRoaXMub3B0aW9ucy5lbGVtZW50LmNsYXNzTGlzdC5hZGQoJ2NvbGxhcHNpbmcnKVxuICAgICAgfVxuXG4gICAgICB0aGlzLm9wdGlvbnMuZWxlbWVudC5hZGRFdmVudExpc3RlbmVyKEV2ZW50LlRSQU5TSVRJT05fRU5ELCBvbkNvbGxhcHNlZClcblxuICAgICAgdGhpcy5vcHRpb25zLmVsZW1lbnQuY2xhc3NMaXN0LnJlbW92ZSgnc2hvdycpXG5cbiAgICAgIHJldHVybiB0cnVlXG4gICAgfVxuXG4gICAgc3RhdGljIGlkZW50aWZpZXIoKSB7XG4gICAgICByZXR1cm4gTkFNRVxuICAgIH1cblxuICAgIHN0YXRpYyBfRE9NSW50ZXJmYWNlKG9wdGlvbnMpIHtcbiAgICAgIHJldHVybiBzdXBlci5fRE9NSW50ZXJmYWNlKENvbGxhcHNlLCBvcHRpb25zKVxuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICogRE9NIEFwaSBpbXBsZW1lbnRhdGlvblxuICAgKiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICovXG4gIGNvbnN0IGNvbXBvbmVudHMgPSBbXVxuXG4gIGNvbnN0IGNvbGxhcHNlcyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoYC4ke05BTUV9YClcbiAgaWYgKGNvbGxhcHNlcykge1xuICAgIGNvbGxhcHNlcy5mb3JFYWNoKChlbGVtZW50KSA9PiB7XG4gICAgICAvLyBjb25zdCBjb25maWcgPSB7fVxuICAgICAgY29uc3QgY29uZmlnID0gZ2V0QXR0cmlidXRlc0NvbmZpZyhlbGVtZW50LCBERUZBVUxUX1BST1BFUlRJRVMsIERBVEFfQVRUUlNfUFJPUEVSVElFUylcbiAgICAgIGNvbmZpZy5lbGVtZW50ID0gZWxlbWVudFxuXG4gICAgICBjb21wb25lbnRzLnB1c2goQ29sbGFwc2UuX0RPTUludGVyZmFjZShjb25maWcpKVxuICAgIH0pXG4gIH1cblxuICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIChldmVudCkgPT4ge1xuICAgIGNvbnN0IHRhcmdldCA9IGZpbmRUYXJnZXRCeUF0dHIoZXZlbnQudGFyZ2V0LCAnZGF0YS10b2dnbGUnKVxuICAgIGlmICghdGFyZ2V0KSB7XG4gICAgICByZXR1cm5cbiAgICB9XG5cbiAgICBjb25zdCBkYXRhVG9nZ2xlQXR0ciA9IHRhcmdldC5nZXRBdHRyaWJ1dGUoJ2RhdGEtdG9nZ2xlJylcblxuICAgIGlmIChkYXRhVG9nZ2xlQXR0ciAmJiBkYXRhVG9nZ2xlQXR0ciA9PT0gTkFNRSkge1xuICAgICAgbGV0IGlkID0gdGFyZ2V0LmdldEF0dHJpYnV0ZSgnZGF0YS10YXJnZXQnKSB8fCB0YXJnZXQuZ2V0QXR0cmlidXRlKCdocmVmJylcbiAgICAgIGlkID0gaWQucmVwbGFjZSgnIycsICcnKVxuXG4gICAgICBjb25zdCBjb21wb25lbnQgPSBjb21wb25lbnRzLmZpbmQoYyA9PiBjLmdldEVsZW1lbnQoKS5nZXRBdHRyaWJ1dGUoJ2lkJykgPT09IGlkKVxuXG4gICAgICBpZiAoIWNvbXBvbmVudCkge1xuICAgICAgICByZXR1cm5cbiAgICAgIH1cblxuICAgICAgY29tcG9uZW50LnRvZ2dsZSgpXG4gICAgfVxuICB9KVxuXG4gIHJldHVybiBDb2xsYXBzZVxufSkoKVxuXG5leHBvcnQgZGVmYXVsdCBDb2xsYXBzZVxuIiwiLyoqXG4gKiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICogTGljZW5zZWQgdW5kZXIgTUlUIChodHRwczovL2dpdGh1Yi5jb20vcXVhcmstZGV2L1Bob25vbi1GcmFtZXdvcmsvYmxvYi9tYXN0ZXIvTElDRU5TRSlcbiAqIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gKi9cbmltcG9ydCB7IGRpc3BhdGNoRWxlbWVudEV2ZW50LCBkaXNwYXRjaFdpbkRvY0V2ZW50IH0gZnJvbSAnLi4vY29tbW9uL2V2ZW50cy9kaXNwYXRjaCdcbmltcG9ydCB7IGdlbmVyYXRlSWQgfSBmcm9tICcuLi9jb21tb24vdXRpbHMnXG5pbXBvcnQgRXZlbnQgZnJvbSAnLi4vY29tbW9uL2V2ZW50cydcbmltcG9ydCBDb21wb25lbnRNYW5hZ2VyLCB7IHNldEF0dHJpYnV0ZXNDb25maWcsIGdldEF0dHJpYnV0ZXNDb25maWcgfSBmcm9tICcuL2NvbXBvbmVudE1hbmFnZXInXG5cbi8qKlxuICogLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gKiBDbGFzcyBEZWZpbml0aW9uXG4gKiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAqL1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBDb21wb25lbnQge1xuXG4gIGNvbnN0cnVjdG9yKG5hbWUsIHZlcnNpb24sIGRlZmF1bHRPcHRpb25zID0ge30sIG9wdGlvbnMgPSB7fSwgb3B0aW9uQXR0cnMgPSBbXSwgc3VwcG9ydER5bmFtaWNFbGVtZW50ID0gZmFsc2UsIGFkZFRvU3RhY2sgPSBmYWxzZSkge1xuICAgIHRoaXMubmFtZSA9IG5hbWVcbiAgICB0aGlzLnZlcnNpb24gPSB2ZXJzaW9uXG4gICAgdGhpcy5vcHRpb25zID0gb3B0aW9uc1xuXG4gICAgLy8gQHRvZG8ga2VlcD9cbiAgICAvLyB0aGlzLm9wdGlvbnMgPSBPYmplY3QuYXNzaWduKGRlZmF1bHRPcHRpb25zLCBvcHRpb25zKVxuICAgIE9iamVjdC5rZXlzKGRlZmF1bHRPcHRpb25zKS5mb3JFYWNoKChwcm9wKSA9PiB7XG4gICAgICBpZiAodHlwZW9mIHRoaXMub3B0aW9uc1twcm9wXSA9PT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgdGhpcy5vcHRpb25zW3Byb3BdID0gZGVmYXVsdE9wdGlvbnNbcHJvcF1cbiAgICAgIH1cbiAgICB9KVxuXG4gICAgdGhpcy5vcHRpb25BdHRycyA9IG9wdGlvbkF0dHJzXG4gICAgdGhpcy5zdXBwb3J0RHluYW1pY0VsZW1lbnQgPSBzdXBwb3J0RHluYW1pY0VsZW1lbnRcbiAgICB0aGlzLmFkZFRvU3RhY2sgPSBhZGRUb1N0YWNrXG4gICAgdGhpcy5pZCA9IGdlbmVyYXRlSWQoKVxuXG4gICAgY29uc3QgY2hlY2tFbGVtZW50ID0gIXRoaXMuc3VwcG9ydER5bmFtaWNFbGVtZW50IHx8IHRoaXMub3B0aW9ucy5lbGVtZW50ICE9PSBudWxsXG5cbiAgICBpZiAodHlwZW9mIHRoaXMub3B0aW9ucy5lbGVtZW50ID09PSAnc3RyaW5nJykge1xuICAgICAgdGhpcy5vcHRpb25zLmVsZW1lbnQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKHRoaXMub3B0aW9ucy5lbGVtZW50KVxuICAgIH1cblxuICAgIGlmIChjaGVja0VsZW1lbnQgJiYgIXRoaXMub3B0aW9ucy5lbGVtZW50KSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoYCR7dGhpcy5uYW1lfS4gVGhlIGVsZW1lbnQgaXMgbm90IGEgSFRNTEVsZW1lbnQuYClcbiAgICB9XG5cbiAgICB0aGlzLmR5bmFtaWNFbGVtZW50ID0gdGhpcy5vcHRpb25zLmVsZW1lbnQgPT09IG51bGxcbiAgICB0aGlzLnJlZ2lzdGVyZWRFbGVtZW50cyA9IFtdXG5cbiAgICBpZiAoIXRoaXMuZHluYW1pY0VsZW1lbnQpIHtcbiAgICAgIC8qKlxuICAgICAgICogaWYgdGhlIGVsZW1lbnQgZXhpc3RzLCB3ZSByZWFkIHRoZSBkYXRhIGF0dHJpYnV0ZXMgY29uZmlnXG4gICAgICAgKiB0aGVuIHdlIG92ZXJ3cml0ZSBleGlzdGluZyBjb25maWcga2V5cyBpbiBKYXZhU2NyaXB0LCBzbyB0aGF0XG4gICAgICAgKiB3ZSBrZWVwIHRoZSBmb2xsb3dpbmcgb3JkZXJcbiAgICAgICAqIFsxXSBkZWZhdWx0IEphdmFTY3JpcHQgY29uZmlndXJhdGlvbiBvZiB0aGUgY29tcG9uZW50XG4gICAgICAgKiBbMl0gRGF0YSBhdHRyaWJ1dGVzIGNvbmZpZ3VyYXRpb24gaWYgdGhlIGVsZW1lbnQgZXhpc3RzIGluIHRoZSBET01cbiAgICAgICAqIFszXSBKYXZhU2NyaXB0IGNvbmZpZ3VyYXRpb25cbiAgICAgICAqL1xuICAgICAgdGhpcy5vcHRpb25zID0gT2JqZWN0LmFzc2lnbih0aGlzLm9wdGlvbnMsIHRoaXMuYXNzaWduSnNDb25maWcodGhpcy5nZXRBdHRyaWJ1dGVzKCksIG9wdGlvbnMpKVxuXG4gICAgICAvLyB0aGVuLCBzZXQgdGhlIG5ldyBkYXRhIGF0dHJpYnV0ZXMgdG8gdGhlIGVsZW1lbnRcbiAgICAgIHRoaXMuc2V0QXR0cmlidXRlcygpXG4gICAgfVxuXG4gICAgdGhpcy5lbGVtZW50TGlzdGVuZXIgPSBldmVudCA9PiB0aGlzLm9uQmVmb3JlRWxlbWVudEV2ZW50KGV2ZW50KSAgICAgICAgICBcbiAgfVxuXG4gIGFzc2lnbkpzQ29uZmlnKGF0dHJDb25maWcsIG9wdGlvbnMpIHtcbiAgICB0aGlzLm9wdGlvbkF0dHJzLmZvckVhY2goKGtleSkgPT4ge1xuICAgICAgaWYgKG9wdGlvbnNba2V5XSkge1xuICAgICAgICBhdHRyQ29uZmlnW2tleV0gPSBvcHRpb25zW2tleV1cbiAgICAgIH1cbiAgICB9KVxuXG4gICAgcmV0dXJuIGF0dHJDb25maWdcbiAgfVxuXG4gIGdldFZlcnNpb24oKSB7XG4gICAgcmV0dXJuIHRoaXMudmVyc2lvblxuICB9XG5cbiAgZ2V0RWxlbWVudCgpIHtcbiAgICByZXR1cm4gdGhpcy5vcHRpb25zLmVsZW1lbnRcbiAgfVxuXG4gIGdldElkKCkge1xuICAgIHJldHVybiB0aGlzLmlkXG4gIH1cblxuICByZWdpc3RlckVsZW1lbnRzKGVsZW1lbnRzKSB7XG4gICAgZWxlbWVudHMuZm9yRWFjaChlbGVtZW50ID0+IHRoaXMucmVnaXN0ZXJFbGVtZW50KGVsZW1lbnQpKVxuICB9XG5cbiAgcmVnaXN0ZXJFbGVtZW50KGVsZW1lbnQpIHtcbiAgICBlbGVtZW50LnRhcmdldC5hZGRFdmVudExpc3RlbmVyKGVsZW1lbnQuZXZlbnQsIHRoaXMuZWxlbWVudExpc3RlbmVyKVxuICAgIHRoaXMucmVnaXN0ZXJlZEVsZW1lbnRzLnB1c2goZWxlbWVudClcbiAgfVxuXG4gIHVucmVnaXN0ZXJFbGVtZW50cygpIHtcbiAgICB0aGlzLnJlZ2lzdGVyZWRFbGVtZW50cy5mb3JFYWNoKChlbGVtZW50KSA9PiB7XG4gICAgICB0aGlzLnVucmVnaXN0ZXJFbGVtZW50KGVsZW1lbnQpXG4gICAgfSlcbiAgfVxuXG4gIHVucmVnaXN0ZXJFbGVtZW50KGVsZW1lbnQpIHtcbiAgICBjb25zdCByZWdpc3RlcmVkRWxlbWVudEluZGV4ID0gdGhpcy5yZWdpc3RlcmVkRWxlbWVudHNcbiAgICAgIC5maW5kSW5kZXgoZWwgPT4gZWwudGFyZ2V0ID09PSBlbGVtZW50LnRhcmdldCAmJiBlbC5ldmVudCA9PT0gZWxlbWVudC5ldmVudClcblxuICAgIGlmIChyZWdpc3RlcmVkRWxlbWVudEluZGV4ID4gLTEpIHtcbiAgICAgIGVsZW1lbnQudGFyZ2V0LnJlbW92ZUV2ZW50TGlzdGVuZXIoZWxlbWVudC5ldmVudCwgdGhpcy5lbGVtZW50TGlzdGVuZXIpXG4gICAgICB0aGlzLnJlZ2lzdGVyZWRFbGVtZW50cy5zcGxpY2UocmVnaXN0ZXJlZEVsZW1lbnRJbmRleCwgMSlcbiAgICB9IGVsc2Uge1xuICAgICAgY29uc29sZS5lcnJvcihgV2FybmluZyEgVW5rbm93biByZWdpc3RlcmVkIGVsZW1lbnQ6ICR7ZWxlbWVudC50YXJnZXR9IHdpdGggZXZlbnQ6ICR7ZWxlbWVudC5ldmVudH0uYClcbiAgICB9XG4gIH1cblxuICB0cmlnZ2VyRXZlbnQoZXZlbnROYW1lLCBkZXRhaWwgPSB7fSwgb2JqZWN0RXZlbnRPbmx5ID0gZmFsc2UpIHtcbiAgICBpZiAodHlwZW9mIGV2ZW50TmFtZSAhPT0gJ3N0cmluZycpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcignVGhlIGV2ZW50IG5hbWUgaXMgbm90IHZhbGlkLicpXG4gICAgfVxuXG4gICAgaWYgKHRoaXMuYWRkVG9TdGFjaykge1xuICAgICAgaWYgKGV2ZW50TmFtZSA9PT0gRXZlbnQuU0hPVykge1xuICAgICAgICBDb21wb25lbnRNYW5hZ2VyLmFkZCh0aGlzKVxuICAgICAgfSBlbHNlIGlmIChldmVudE5hbWUgPT09IEV2ZW50LkhJREUpIHtcbiAgICAgICAgQ29tcG9uZW50TWFuYWdlci5yZW1vdmUodGhpcylcbiAgICAgIH1cbiAgICB9XG5cbiAgICAvLyBldmVudCBuYW1lcyBjYW4gYmUgd2l0aCBkb3Qgbm90YXRpb24gbGlrZSByZWNvbm5lY3Rpbmcuc3VjY2Vzc1xuICAgIGNvbnN0IGV2ZW50TmFtZU9iamVjdCA9IGV2ZW50TmFtZS5zcGxpdCgnLicpLnJlZHVjZSgoYWNjLCBjdXJyZW50LCBpbmRleCkgPT4ge1xuICAgICAgaWYgKGluZGV4ID09PSAwKSB7XG4gICAgICAgIHJldHVybiBjdXJyZW50XG4gICAgICB9XG5cbiAgICAgIHJldHVybiBhY2MgKyBjdXJyZW50LmNoYXJBdCgwKS50b1VwcGVyQ2FzZSgpICsgY3VycmVudC5zbGljZSgxKVxuICAgIH0pXG5cbiAgICBjb25zdCBldmVudE5hbWVBbGlhcyA9IGBvbiR7ZXZlbnROYW1lT2JqZWN0LmNoYXJBdCgwKS50b1VwcGVyQ2FzZSgpfSR7ZXZlbnROYW1lT2JqZWN0LnNsaWNlKDEpfWBcblxuICAgIC8vIG9iamVjdCBldmVudFxuICAgIGlmICh0eXBlb2YgdGhpcy5vcHRpb25zW2V2ZW50TmFtZU9iamVjdF0gPT09ICdmdW5jdGlvbicpIHtcbiAgICAgIHRoaXMub3B0aW9uc1tldmVudE5hbWVPYmplY3RdLmFwcGx5KHRoaXMsIFtkZXRhaWxdKVxuICAgIH1cblxuICAgIGlmICh0eXBlb2YgdGhpcy5vcHRpb25zW2V2ZW50TmFtZUFsaWFzXSA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgdGhpcy5vcHRpb25zW2V2ZW50TmFtZUFsaWFzXS5hcHBseSh0aGlzLCBbZGV0YWlsXSlcbiAgICB9XG5cbiAgICBpZiAob2JqZWN0RXZlbnRPbmx5KSB7XG4gICAgICByZXR1cm5cbiAgICB9XG5cbiAgICAvLyBkb20gZXZlbnRcbiAgICBpZiAodGhpcy5vcHRpb25zLmVsZW1lbnQpIHtcbiAgICAgIGRpc3BhdGNoRWxlbWVudEV2ZW50KHRoaXMub3B0aW9ucy5lbGVtZW50LCBldmVudE5hbWUsIHRoaXMubmFtZSwgZGV0YWlsKVxuICAgIH0gZWxzZSB7XG4gICAgICBkaXNwYXRjaFdpbkRvY0V2ZW50KGV2ZW50TmFtZSwgdGhpcy5uYW1lLCBkZXRhaWwpXG4gICAgfVxuICB9XG5cbiAgc2V0QXR0cmlidXRlcygpIHtcbiAgICBpZiAodGhpcy5vcHRpb25BdHRycy5sZW5ndGggPiAwKSB7XG4gICAgICBzZXRBdHRyaWJ1dGVzQ29uZmlnKHRoaXMub3B0aW9ucy5lbGVtZW50LCB0aGlzLm9wdGlvbnMsIHRoaXMub3B0aW9uQXR0cnMpXG4gICAgfVxuICB9XG5cbiAgZ2V0QXR0cmlidXRlcygpIHtcbiAgICBjb25zdCBvcHRpb25zID0gT2JqZWN0LmFzc2lnbih7fSwgdGhpcy5vcHRpb25zKVxuICAgIHJldHVybiBnZXRBdHRyaWJ1dGVzQ29uZmlnKHRoaXMub3B0aW9ucy5lbGVtZW50LCBvcHRpb25zLCB0aGlzLm9wdGlvbkF0dHJzKVxuICB9XG5cbiAgLyoqXG4gICAqIHRoZSBwcmV2ZW50Q2xvc2FibGUgbWV0aG9kIG1hbmFnZXMgY29uY3VycmVuY3kgYmV0d2VlbiBhY3RpdmUgY29tcG9uZW50cy5cbiAgICogRm9yIGV4YW1wbGUsIGlmIHRoZXJlIGlzIGEgc2hvd24gb2ZmLWNhbnZhcyBhbmQgZGlhbG9nLCB0aGUgbGFzdFxuICAgKiBzaG93biBjb21wb25lbnQgZ2FpbnMgdGhlIHByb2Nlc3NpbmcgcHJpb3JpdHlcbiAgICovXG4gIHByZXZlbnRDbG9zYWJsZSgpIHtcbiAgICByZXR1cm4gdGhpcy5hZGRUb1N0YWNrICYmICFDb21wb25lbnRNYW5hZ2VyLmNsb3NhYmxlKHRoaXMpXG4gIH1cblxuICBvbkJlZm9yZUVsZW1lbnRFdmVudChldmVudCkge1xuICAgIGlmICh0aGlzLnByZXZlbnRDbG9zYWJsZSgpKSB7XG4gICAgICByZXR1cm5cbiAgICB9XG5cbiAgICB0aGlzLm9uRWxlbWVudEV2ZW50KGV2ZW50KVxuICB9XG5cbiAgb25FbGVtZW50RXZlbnQoZXZlbnQpIHtcbiAgICAvL1xuICB9XG5cbiAgc3RhdGljIGlkZW50aWZpZXIoKSB7XG4gICAgcmV0dXJuIHRoaXMubmFtZVxuICB9XG5cbiAgc3RhdGljIF9ET01JbnRlcmZhY2UoQ29tcG9uZW50Q2xhc3MsIG9wdGlvbnMpIHtcbiAgICByZXR1cm4gbmV3IENvbXBvbmVudENsYXNzKG9wdGlvbnMpXG4gIH1cbn1cbiIsIlxuY29uc3QgZ2V0QXR0cmlidXRlID0gKGZpcnN0LCBzZWNvbmQpID0+IHtcbiAgaWYgKGZpcnN0ID09PSAnJykge1xuICAgIHJldHVybiBgZGF0YS0ke3NlY29uZH1gXG4gIH1cbiAgcmV0dXJuIGBkYXRhLSR7Zmlyc3R9LSR7c2Vjb25kfWBcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHNldEF0dHJpYnV0ZXNDb25maWcoZWxlbWVudCwgb2JqID0ge30sIGF0dHJzLCBzdGFydCA9ICcnKSB7XG4gIGNvbnN0IGtleXMgPSBPYmplY3Qua2V5cyhvYmopXG5cbiAga2V5cy5mb3JFYWNoKChrZXkpID0+IHtcbiAgICBpZiAoc3RhcnQgPT09ICcnICYmIGF0dHJzLmluZGV4T2Yoa2V5KSA9PT0gLTEpIHtcbiAgICAgIC8vIGNvbnRpbnVlIHdpdGggbmV4dCBpdGVyYXRpb25cbiAgICAgIHJldHVyblxuICAgIH1cblxuICAgIGlmICh0eXBlb2Ygb2JqW2tleV0gPT09ICdvYmplY3QnICYmIG9ialtrZXldICE9PSBudWxsKSB7XG4gICAgICBsZXQga2V5U3RhcnQgPSBrZXlcbiAgICAgIGlmIChzdGFydCAhPT0gJycpIHtcbiAgICAgICAga2V5U3RhcnQgPSBgJHtzdGFydH0tJHtrZXl9YFxuICAgICAgfVxuXG4gICAgICBzZXRBdHRyaWJ1dGVzQ29uZmlnKGVsZW1lbnQsIG9ialtrZXldLCBhdHRycywga2V5U3RhcnQpXG4gICAgICByZXR1cm5cbiAgICB9XG5cbiAgICBjb25zdCBhdHRyID0gZ2V0QXR0cmlidXRlKHN0YXJ0LCBrZXkpXG4gICAgZWxlbWVudC5zZXRBdHRyaWJ1dGUoYXR0ciwgb2JqW2tleV0pXG4gIH0pXG59XG5cbmV4cG9ydCBmdW5jdGlvbiBnZXRBdHRyaWJ1dGVzQ29uZmlnKGVsZW1lbnQsIG9iaiA9IHt9LCBhdHRycywgc3RhcnQgPSAnJykge1xuICBjb25zdCBuZXdPYmogPSBPYmplY3QuYXNzaWduKHt9LCBvYmopXG4gIGNvbnN0IGtleXMgPSBPYmplY3Qua2V5cyhvYmopXG5cbiAga2V5cy5mb3JFYWNoKChrZXkpID0+IHtcbiAgICBpZiAoc3RhcnQgPT09ICcnICYmIGF0dHJzLmluZGV4T2Yoa2V5KSA9PT0gLTEpIHtcbiAgICAgIC8vIGNvbnRpbnVlIHdpdGggbmV4dCBpdGVyYXRpb25cbiAgICAgIHJldHVyblxuICAgIH1cblxuICAgIGlmIChvYmpba2V5XSAhPT0gbnVsbCAmJiBvYmpba2V5XS5jb25zdHJ1Y3RvciA9PT0gT2JqZWN0KSB7XG4gICAgICBsZXQga2V5U3RhcnQgPSBrZXlcbiAgICAgIGlmIChzdGFydCAhPT0gJycpIHtcbiAgICAgICAga2V5U3RhcnQgPSBgJHtzdGFydH0tJHtrZXl9YFxuICAgICAgfVxuXG4gICAgICBuZXdPYmpba2V5XSA9IGdldEF0dHJpYnV0ZXNDb25maWcoZWxlbWVudCwgb2JqW2tleV0sIGF0dHJzLCBrZXlTdGFydClcbiAgICAgIHJldHVyblxuICAgIH1cblxuICAgIC8vIHVwZGF0ZSB2YWx1ZVxuICAgIGxldCB2YWx1ZSA9IG9ialtrZXldIC8vIGRlZmF1bHQgdmFsdWVcbiAgICBjb25zdCB0eXBlID0gdHlwZW9mIHZhbHVlXG4gICAgY29uc3QgYXR0ciA9IGdldEF0dHJpYnV0ZShzdGFydCwga2V5KVxuICAgIGNvbnN0IGF0dHJWYWx1ZSA9IGVsZW1lbnQuZ2V0QXR0cmlidXRlKGF0dHIpXG5cbiAgICBpZiAoYXR0clZhbHVlICE9PSBudWxsKSB7XG4gICAgICBpZiAodHlwZSA9PT0gJ2Jvb2xlYW4nKSB7XG4gICAgICAgIC8vIGNvbnZlcnQgc3RyaW5nIHRvIGJvb2xlYW5cbiAgICAgICAgdmFsdWUgPSBhdHRyVmFsdWUgPT09ICd0cnVlJ1xuICAgICAgfSBlbHNlIGlmICghaXNOYU4oYXR0clZhbHVlKSkge1xuICAgICAgICB2YWx1ZSA9IHBhcnNlSW50KGF0dHJWYWx1ZSwgMTApXG4gICAgICB9IGVsc2Uge1xuICAgICAgICB2YWx1ZSA9IGF0dHJWYWx1ZVxuICAgICAgfVxuICAgIH1cblxuICAgIG5ld09ialtrZXldID0gdmFsdWVcbiAgfSlcblxuICByZXR1cm4gbmV3T2JqXG59XG5cbmNvbnN0IHN0YWNrID0gW11cblxuZXhwb3J0IGRlZmF1bHQge1xuICBhZGQoY29tcG9uZW50KSB7XG4gICAgc3RhY2sucHVzaChjb21wb25lbnQpXG4gIH0sXG4gIHJlbW92ZShjb21wb25lbnQpIHtcbiAgICBjb25zdCBpbmRleCA9IHN0YWNrLmZpbmRJbmRleChjID0+IE9iamVjdC5pcyhjb21wb25lbnQsIGMpKVxuICAgIGlmIChpbmRleCA+IC0xKSB7XG4gICAgICBzdGFjay5zcGxpY2UoaW5kZXgsIDEpXG4gICAgfVxuICB9LFxuICBjbG9zYWJsZShjb21wb25lbnQpIHtcbiAgICByZXR1cm4gc3RhY2subGVuZ3RoID09PSAwIHx8IE9iamVjdC5pcyhzdGFja1tzdGFjay5sZW5ndGggLSAxXSwgY29tcG9uZW50KVxuICB9XG59XG4iLCIvKipcbiAqIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gKiBMaWNlbnNlZCB1bmRlciBNSVQgKGh0dHBzOi8vZ2l0aHViLmNvbS9xdWFyay1kZXYvUGhvbm9uLUZyYW1ld29yay9ibG9iL21hc3Rlci9MSUNFTlNFKVxuICogLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAqL1xuaW1wb3J0IERpYWxvZyBmcm9tICcuL2luZGV4J1xuaW1wb3J0IHsgZ2V0QXR0cmlidXRlc0NvbmZpZyB9IGZyb20gJy4uL2NvbXBvbmVudE1hbmFnZXInXG5cbmNvbnN0IENvbmZpcm0gPSAoKCkgPT4ge1xuXG4gIC8qKlxuICAgKiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICogQ29uc3RhbnRzXG4gICAqIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgKi9cblxuICBjb25zdCBOQU1FID0gJ2NvbmZpcm0nXG4gIGNvbnN0IERFRkFVTFRfUFJPUEVSVElFUyA9IHtcbiAgICBlbGVtZW50OiBudWxsLFxuICAgIHRpdGxlOiBudWxsLFxuICAgIG1lc3NhZ2U6IG51bGwsXG4gICAgY2FuY2VsYWJsZTogdHJ1ZSxcbiAgICB0eXBlOiBOQU1FLFxuICAgIGJ1dHRvbnM6IFtcbiAgICAgIHtcbiAgICAgICAgZXZlbnQ6ICdjYW5jZWwnLFxuICAgICAgICB0ZXh0OiAnQ2FuY2VsJyxcbiAgICAgICAgZGlzbWlzczogdHJ1ZSxcbiAgICAgICAgY2xhc3M6ICdidG4gYnRuLXNlY29uZGFyeScsXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICBldmVudDogJ2NvbmZpcm0nLFxuICAgICAgICB0ZXh0OiAnT2snLFxuICAgICAgICBkaXNtaXNzOiB0cnVlLFxuICAgICAgICBjbGFzczogJ2J0biBidG4tcHJpbWFyeScsXG4gICAgICB9LFxuICAgIF0sXG4gIH1cbiAgY29uc3QgREFUQV9BVFRSU19QUk9QRVJUSUVTID0gW1xuICAgICdjYW5jZWxhYmxlJyxcbiAgXVxuXG4gIC8qKlxuICAgKiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICogQ2xhc3MgRGVmaW5pdGlvblxuICAgKiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICovXG5cbiAgY2xhc3MgQ29uZmlybSBleHRlbmRzIERpYWxvZyB7XG5cbiAgICBjb25zdHJ1Y3RvcihvcHRpb25zID0ge30pIHtcbiAgICAgIGNvbnN0IHRlbXBsYXRlID0gJycgK1xuICAgICAgJzxkaXYgY2xhc3M9XCJkaWFsb2dcIiB0YWJpbmRleD1cIi0xXCIgcm9sZT1cImRpYWxvZ1wiPicgK1xuICAgICAgICAnPGRpdiBjbGFzcz1cImRpYWxvZy1pbm5lclwiIHJvbGU9XCJkb2N1bWVudFwiPicgK1xuICAgICAgICAgICc8ZGl2IGNsYXNzPVwiZGlhbG9nLWNvbnRlbnRcIj4nICtcbiAgICAgICAgICAgICc8ZGl2IGNsYXNzPVwiZGlhbG9nLWhlYWRlclwiPicgK1xuICAgICAgICAgICAgICAnPGg1IGNsYXNzPVwiZGlhbG9nLXRpdGxlXCI+PC9oNT4nICtcbiAgICAgICAgICAgICc8L2Rpdj4nICtcbiAgICAgICAgICAgICc8ZGl2IGNsYXNzPVwiZGlhbG9nLWJvZHlcIj4nICtcbiAgICAgICAgICAgICAgJzxwPjwvcD4nICtcbiAgICAgICAgICAgICc8L2Rpdj4nICtcbiAgICAgICAgICAgICc8ZGl2IGNsYXNzPVwiZGlhbG9nLWZvb3RlclwiPicgK1xuICAgICAgICAgICAgJzwvZGl2PicgK1xuICAgICAgICAgICc8L2Rpdj4nICtcbiAgICAgICAgJzwvZGl2PicgK1xuICAgICAgJzwvZGl2PidcblxuICAgICAgaWYgKCFBcnJheS5pc0FycmF5KG9wdGlvbnMuYnV0dG9ucykpIHtcbiAgICAgICAgb3B0aW9ucy5idXR0b25zID0gREVGQVVMVF9QUk9QRVJUSUVTLmJ1dHRvbnNcbiAgICAgIH1cblxuICAgICAgc3VwZXIob3B0aW9ucywgdGVtcGxhdGUpXG4gICAgfVxuXG4gICAgc3RhdGljIGlkZW50aWZpZXIoKSB7XG4gICAgICByZXR1cm4gTkFNRVxuICAgIH1cblxuICAgIHN0YXRpYyBfRE9NSW50ZXJmYWNlKG9wdGlvbnMpIHtcbiAgICAgIHJldHVybiBuZXcgQ29uZmlybShvcHRpb25zKVxuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICogRE9NIEFwaSBpbXBsZW1lbnRhdGlvblxuICAgKiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICovXG4gIGNvbnN0IGNvbXBvbmVudHMgPSBbXVxuICBjb25zdCBkaWFsb2dzID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChgLiR7RGlhbG9nLmlkZW50aWZpZXIoKX1gKVxuXG4gIGlmIChkaWFsb2dzKSB7XG4gICAgQXJyYXkuZnJvbShkaWFsb2dzKS5mb3JFYWNoKChlbGVtZW50KSA9PiB7XG4gICAgICBjb25zdCBjb25maWcgPSBnZXRBdHRyaWJ1dGVzQ29uZmlnKGVsZW1lbnQsIERFRkFVTFRfUFJPUEVSVElFUywgREFUQV9BVFRSU19QUk9QRVJUSUVTKVxuICAgICAgY29uZmlnLmVsZW1lbnQgPSBlbGVtZW50XG5cbiAgICAgIGlmIChjb25maWcudHlwZSA9PT0gTkFNRSkge1xuICAgICAgICAvLyBjb25maXJtXG4gICAgICAgIGNvbXBvbmVudHMucHVzaChuZXcgQ29uZmlybShjb25maWcpKVxuICAgICAgfVxuICAgIH0pXG4gIH1cblxuICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIChldmVudCkgPT4ge1xuICAgIGNvbnN0IGRhdGFUb2dnbGVBdHRyID0gZXZlbnQudGFyZ2V0LmdldEF0dHJpYnV0ZSgnZGF0YS10b2dnbGUnKVxuICAgIGlmIChkYXRhVG9nZ2xlQXR0ciAmJiBkYXRhVG9nZ2xlQXR0ciA9PT0gTkFNRSkge1xuICAgICAgY29uc3QgaWQgPSBldmVudC50YXJnZXQuZ2V0QXR0cmlidXRlKCdkYXRhLXRhcmdldCcpXG4gICAgICBjb25zdCBlbGVtZW50ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihpZClcblxuICAgICAgY29uc3QgY29tcG9uZW50ID0gY29tcG9uZW50cy5maW5kKGMgPT4gYy5lbGVtZW50ID09PSBlbGVtZW50KVxuXG4gICAgICBpZiAoIWNvbXBvbmVudCkge1xuICAgICAgICByZXR1cm5cbiAgICAgIH1cblxuICAgICAgLy8gcmVtb3ZlIHRoZSBmb2N1cyBzdGF0ZSBvZiB0aGUgdHJpZ2dlclxuICAgICAgZXZlbnQudGFyZ2V0LmJsdXIoKVxuXG4gICAgICBjb21wb25lbnQuZGlhbG9nLnNob3coKVxuICAgIH1cbiAgfSlcblxuICByZXR1cm4gQ29uZmlybVxufSkoKVxuXG5leHBvcnQgZGVmYXVsdCBDb25maXJtXG4iLCIvKipcbiAqIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gKiBMaWNlbnNlZCB1bmRlciBNSVQgKGh0dHBzOi8vZ2l0aHViLmNvbS9xdWFyay1kZXYvUGhvbm9uLUZyYW1ld29yay9ibG9iL21hc3Rlci9MSUNFTlNFKVxuICogLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAqL1xuaW1wb3J0IEV2ZW50IGZyb20gJy4uLy4uL2NvbW1vbi9ldmVudHMnXG5pbXBvcnQgQ29tcG9uZW50IGZyb20gJy4uL2NvbXBvbmVudCdcbmltcG9ydCB7IGdldEF0dHJpYnV0ZXNDb25maWcgfSBmcm9tICcuLi9jb21wb25lbnRNYW5hZ2VyJ1xuXG5jb25zdCBEaWFsb2cgPSAoKCkgPT4ge1xuICAvKipcbiAgICogLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAqIENvbnN0YW50c1xuICAgKiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICovXG5cbiAgY29uc3QgTkFNRSA9ICdkaWFsb2cnXG4gIGNvbnN0IFZFUlNJT04gPSAnMi4wLjAnXG4gIGNvbnN0IEJBQ0tEUk9QX1NFTEVDVE9SID0gJ2RpYWxvZy1iYWNrZHJvcCdcbiAgY29uc3QgREVGQVVMVF9QUk9QRVJUSUVTID0ge1xuICAgIGVsZW1lbnQ6IG51bGwsXG4gICAgdGl0bGU6IG51bGwsXG4gICAgbWVzc2FnZTogbnVsbCxcbiAgICBjYW5jZWxhYmxlOiB0cnVlLFxuICAgIGJ1dHRvbnM6IFtcbiAgICAgIHtcbiAgICAgICAgZXZlbnQ6ICdjb25maXJtJyxcbiAgICAgICAgdGV4dDogJ09rJyxcbiAgICAgICAgZGlzbWlzczogdHJ1ZSxcbiAgICAgICAgY2xhc3M6ICdidG4gYnRuLXByaW1hcnknLFxuICAgICAgfSxcbiAgICBdLFxuICB9XG4gIGNvbnN0IERBVEFfQVRUUlNfUFJPUEVSVElFUyA9IFtcbiAgICAnY2FuY2VsYWJsZScsXG4gIF1cblxuICAvKipcbiAgICogLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAqIENsYXNzIERlZmluaXRpb25cbiAgICogLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAqL1xuXG4gIGNsYXNzIERpYWxvZyBleHRlbmRzIENvbXBvbmVudCB7XG5cbiAgICBjb25zdHJ1Y3RvcihvcHRpb25zID0ge30sIHRlbXBsYXRlID0gbnVsbCkge1xuICAgICAgc3VwZXIoTkFNRSwgVkVSU0lPTiwgREVGQVVMVF9QUk9QRVJUSUVTLCBvcHRpb25zLCBEQVRBX0FUVFJTX1BST1BFUlRJRVMsIHRydWUsIHRydWUpXG5cbiAgICAgIHRoaXMudGVtcGxhdGUgPSB0ZW1wbGF0ZSB8fCAnJyArXG4gICAgICAnPGRpdiBjbGFzcz1cImRpYWxvZ1wiIHRhYmluZGV4PVwiLTFcIiByb2xlPVwiZGlhbG9nXCI+JyArXG4gICAgICAgICc8ZGl2IGNsYXNzPVwiZGlhbG9nLWlubmVyXCIgcm9sZT1cImRvY3VtZW50XCI+JyArXG4gICAgICAgICAgJzxkaXYgY2xhc3M9XCJkaWFsb2ctY29udGVudFwiPicgK1xuICAgICAgICAgICAgJzxkaXYgY2xhc3M9XCJkaWFsb2ctaGVhZGVyXCI+JyArXG4gICAgICAgICAgICAgICc8aDUgY2xhc3M9XCJkaWFsb2ctdGl0bGVcIj48L2g1PicgK1xuICAgICAgICAgICAgJzwvZGl2PicgK1xuICAgICAgICAgICAgJzxkaXYgY2xhc3M9XCJkaWFsb2ctYm9keVwiPicgK1xuICAgICAgICAgICAgICAnPHA+PC9wPicgK1xuICAgICAgICAgICAgJzwvZGl2PicgK1xuICAgICAgICAgICAgJzxkaXYgY2xhc3M9XCJkaWFsb2ctZm9vdGVyXCI+JyArXG4gICAgICAgICAgICAnPC9kaXY+JyArXG4gICAgICAgICAgJzwvZGl2PicgK1xuICAgICAgICAnPC9kaXY+JyArXG4gICAgICAnPC9kaXY+J1xuXG4gICAgICBpZiAodGhpcy5keW5hbWljRWxlbWVudCkge1xuICAgICAgICB0aGlzLmJ1aWxkKClcbiAgICAgIH1cbiAgICB9XG5cbiAgICBidWlsZCgpIHtcbiAgICAgIGNvbnN0IGJ1aWxkZXIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKVxuXG4gICAgICBidWlsZGVyLmlubmVySFRNTCA9IHRoaXMudGVtcGxhdGVcblxuICAgICAgdGhpcy5vcHRpb25zLmVsZW1lbnQgPSBidWlsZGVyLmZpcnN0Q2hpbGRcblxuICAgICAgLy8gdGl0bGVcbiAgICAgIGlmICh0aGlzLm9wdGlvbnMudGl0bGUgIT09IG51bGwpIHtcbiAgICAgICAgdGhpcy5vcHRpb25zLmVsZW1lbnQucXVlcnlTZWxlY3RvcignLmRpYWxvZy10aXRsZScpLmlubmVySFRNTCA9IHRoaXMub3B0aW9ucy50aXRsZVxuICAgICAgfVxuXG4gICAgICAvLyBtZXNzYWdlXG4gICAgICBpZiAodGhpcy5vcHRpb25zLm1lc3NhZ2UgIT09IG51bGwpIHtcbiAgICAgICAgdGhpcy5vcHRpb25zLmVsZW1lbnQucXVlcnlTZWxlY3RvcignLmRpYWxvZy1ib2R5JykuZmlyc3RDaGlsZC5pbm5lckhUTUwgPSB0aGlzLm9wdGlvbnMubWVzc2FnZVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgLy8gcmVtb3ZlIHBhcmFncmFwaCBub2RlXG4gICAgICAgIHRoaXMucmVtb3ZlVGV4dEJvZHkoKVxuICAgICAgfVxuXG4gICAgICAvLyBidXR0b25zXG4gICAgICBpZiAodGhpcy5vcHRpb25zLmJ1dHRvbnMgIT09IG51bGwgJiYgQXJyYXkuaXNBcnJheSh0aGlzLm9wdGlvbnMuYnV0dG9ucykpIHtcbiAgICAgICAgaWYgKHRoaXMub3B0aW9ucy5idXR0b25zLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICB0aGlzLm9wdGlvbnMuYnV0dG9ucy5mb3JFYWNoKChidXR0b24pID0+IHtcbiAgICAgICAgICAgIHRoaXMub3B0aW9ucy5lbGVtZW50LnF1ZXJ5U2VsZWN0b3IoJy5kaWFsb2ctZm9vdGVyJykuYXBwZW5kQ2hpbGQodGhpcy5idWlsZEJ1dHRvbihidXR0b24pKVxuICAgICAgICAgIH0pXG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgdGhpcy5yZW1vdmVGb290ZXIoKVxuICAgICAgICB9XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLnJlbW92ZUZvb3RlcigpXG4gICAgICB9XG5cbiAgICAgIGRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQodGhpcy5vcHRpb25zLmVsZW1lbnQpXG5cbiAgICAgIHRoaXMuc2V0QXR0cmlidXRlcygpXG4gICAgfVxuXG4gICAgYnVpbGRCdXR0b24oYnV0dG9uSW5mbyA9IHt9KSB7XG4gICAgICBjb25zdCBidXR0b24gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdidXR0b24nKVxuICAgICAgYnV0dG9uLnNldEF0dHJpYnV0ZSgndHlwZScsICdidXR0b24nKVxuICAgICAgYnV0dG9uLnNldEF0dHJpYnV0ZSgnY2xhc3MnLCBidXR0b25JbmZvLmNsYXNzIHx8ICdidG4nKVxuICAgICAgYnV0dG9uLnNldEF0dHJpYnV0ZSgnZGF0YS1ldmVudCcsIGJ1dHRvbkluZm8uZXZlbnQpXG4gICAgICBidXR0b24uaW5uZXJIVE1MID0gYnV0dG9uSW5mby50ZXh0XG5cbiAgICAgIGlmIChidXR0b25JbmZvLmRpc21pc3MpIHtcbiAgICAgICAgYnV0dG9uLnNldEF0dHJpYnV0ZSgnZGF0YS1kaXNtaXNzJywgTkFNRSlcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIGJ1dHRvblxuICAgIH1cblxuICAgIGJ1aWxkQmFja2Ryb3AoKSB7XG4gICAgICBjb25zdCBiYWNrZHJvcCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpXG4gICAgICBiYWNrZHJvcC5zZXRBdHRyaWJ1dGUoJ2RhdGEtaWQnLCB0aGlzLmlkKVxuICAgICAgYmFja2Ryb3AuY2xhc3NMaXN0LmFkZChCQUNLRFJPUF9TRUxFQ1RPUilcblxuICAgICAgZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZChiYWNrZHJvcClcbiAgICB9XG5cbiAgICBnZXRCYWNrZHJvcCgpIHtcbiAgICAgIHJldHVybiBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKGAuJHtCQUNLRFJPUF9TRUxFQ1RPUn1bZGF0YS1pZD1cIiR7dGhpcy5pZH1cIl1gKVxuICAgIH1cblxuICAgIHJlbW92ZVRleHRCb2R5KCkge1xuICAgICAgdGhpcy5vcHRpb25zLmVsZW1lbnQucXVlcnlTZWxlY3RvcignLmRpYWxvZy1ib2R5JykucmVtb3ZlQ2hpbGQodGhpcy5vcHRpb25zLmVsZW1lbnQucXVlcnlTZWxlY3RvcignLmRpYWxvZy1ib2R5JykuZmlyc3RDaGlsZCkgICAgICBcbiAgICB9XG5cbiAgICByZW1vdmVGb290ZXIoKSB7XG4gICAgICBjb25zdCBmb290ZXIgPSB0aGlzLm9wdGlvbnMuZWxlbWVudC5xdWVyeVNlbGVjdG9yKCcuZGlhbG9nLWZvb3RlcicpICAgICAgXG4gICAgICB0aGlzLm9wdGlvbnMuZWxlbWVudC5xdWVyeVNlbGVjdG9yKCcuZGlhbG9nLWNvbnRlbnQnKS5yZW1vdmVDaGlsZChmb290ZXIpXG4gICAgfVxuXG4gICAgY2VudGVyKCkge1xuICAgICAgY29uc3QgY29tcHV0ZWRTdHlsZSA9IHdpbmRvdy5nZXRDb21wdXRlZFN0eWxlKHRoaXMub3B0aW9ucy5lbGVtZW50KVxuICAgICAgY29uc3QgaGVpZ2h0ID0gY29tcHV0ZWRTdHlsZS5oZWlnaHQuc2xpY2UoMCwgY29tcHV0ZWRTdHlsZS5oZWlnaHQubGVuZ3RoIC0gMilcblxuICAgICAgY29uc3QgdG9wID0gKHdpbmRvdy5pbm5lckhlaWdodCAvIDIpIC0gKGhlaWdodCAvIDIpXG4gICAgICB0aGlzLm9wdGlvbnMuZWxlbWVudC5zdHlsZS50b3AgPSBgJHt0b3B9cHhgXG4gICAgfVxuXG4gICAgc2hvdygpIHtcbiAgICAgIGlmICh0aGlzLm9wdGlvbnMuZWxlbWVudCA9PT0gbnVsbCkge1xuICAgICAgICAvLyBidWlsZCBhbmQgaW5zZXJ0IGEgbmV3IERPTSBlbGVtZW50XG4gICAgICAgIHRoaXMuYnVpbGQoKVxuICAgICAgfVxuXG4gICAgICBpZiAodGhpcy5vcHRpb25zLmVsZW1lbnQuY2xhc3NMaXN0LmNvbnRhaW5zKCdzaG93JykpIHtcbiAgICAgICAgcmV0dXJuIGZhbHNlXG4gICAgICB9XG5cbiAgICAgIC8vIGFkZCBhIHRpbWVvdXQgc28gdGhhdCB0aGUgQ1NTIGFuaW1hdGlvbiB3b3Jrc1xuICAgICAgc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICAgIHRoaXMudHJpZ2dlckV2ZW50KEV2ZW50LlNIT1cpXG4gICAgICAgIHRoaXMuYnVpbGRCYWNrZHJvcCgpXG5cbiAgICAgICAgY29uc3Qgb25TaG93biA9ICgpID0+IHtcbiAgICAgICAgICB0aGlzLnRyaWdnZXJFdmVudChFdmVudC5TSE9XTilcbiAgICAgICAgICB0aGlzLm9wdGlvbnMuZWxlbWVudC5yZW1vdmVFdmVudExpc3RlbmVyKEV2ZW50LlRSQU5TSVRJT05fRU5ELCBvblNob3duKVxuXG4gICAgICAgICAgLy8gYXR0YWNoIGV2ZW50XG4gICAgICAgICAgdGhpcy5hdHRhY2hFdmVudHMoKVxuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5vcHRpb25zLmVsZW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihFdmVudC5UUkFOU0lUSU9OX0VORCwgb25TaG93bilcblxuICAgICAgICB0aGlzLm9wdGlvbnMuZWxlbWVudC5jbGFzc0xpc3QuYWRkKCdzaG93JylcblxuICAgICAgICB0aGlzLmNlbnRlcigpXG4gICAgICB9LCAxMClcblxuICAgICAgcmV0dXJuIHRydWVcbiAgICB9XG5cbiAgICBvbkVsZW1lbnRFdmVudChldmVudCkge1xuICAgICAgaWYgKGV2ZW50LnR5cGUgPT09ICdrZXl1cCcgJiYgZXZlbnQua2V5Q29kZSAhPT0gMjcgJiYgZXZlbnQua2V5Q29kZSAhPT0gMTMpIHtcbiAgICAgICAgcmV0dXJuXG4gICAgICB9XG5cbiAgICAgIGNvbnN0IGV2ZW50TmFtZSA9IGV2ZW50LnRhcmdldC5nZXRBdHRyaWJ1dGUoJ2RhdGEtZXZlbnQnKVxuXG4gICAgICBpZiAoZXZlbnROYW1lKSB7XG4gICAgICAgIHRoaXMudHJpZ2dlckV2ZW50KGV2ZW50TmFtZSlcbiAgICAgIH1cblxuICAgICAgaWYgKGV2ZW50LnRhcmdldC5nZXRBdHRyaWJ1dGUoJ2RhdGEtZGlzbWlzcycpICE9PSBOQU1FKSB7XG4gICAgICAgIHJldHVyblxuICAgICAgfVxuXG4gICAgICAvLyBoaWRlIHRoZSBkaWFsb2dcbiAgICAgIHRoaXMuaGlkZSgpXG4gICAgfVxuXG4gICAgaGlkZSgpIHtcbiAgICAgIGlmICghdGhpcy5vcHRpb25zLmVsZW1lbnQuY2xhc3NMaXN0LmNvbnRhaW5zKCdzaG93JykpIHtcbiAgICAgICAgcmV0dXJuIGZhbHNlXG4gICAgICB9XG5cbiAgICAgIHRoaXMudHJpZ2dlckV2ZW50KEV2ZW50LkhJREUpXG5cbiAgICAgIHRoaXMuZGV0YWNoRXZlbnRzKClcblxuICAgICAgdGhpcy5vcHRpb25zLmVsZW1lbnQuY2xhc3NMaXN0LmFkZCgnaGlkZScpXG4gICAgICB0aGlzLm9wdGlvbnMuZWxlbWVudC5jbGFzc0xpc3QucmVtb3ZlKCdzaG93JylcblxuICAgICAgY29uc3QgYmFja2Ryb3AgPSB0aGlzLmdldEJhY2tkcm9wKClcblxuICAgICAgY29uc3Qgb25IaWRkZW4gPSAoKSA9PiB7XG4gICAgICAgIGRvY3VtZW50LmJvZHkucmVtb3ZlQ2hpbGQoYmFja2Ryb3ApXG5cbiAgICAgICAgdGhpcy5vcHRpb25zLmVsZW1lbnQuY2xhc3NMaXN0LnJlbW92ZSgnaGlkZScpXG5cbiAgICAgICAgdGhpcy50cmlnZ2VyRXZlbnQoRXZlbnQuSElEREVOKVxuXG4gICAgICAgIGJhY2tkcm9wLnJlbW92ZUV2ZW50TGlzdGVuZXIoRXZlbnQuVFJBTlNJVElPTl9FTkQsIG9uSGlkZGVuKVxuXG4gICAgICAgIC8vIHJlbW92ZSBnZW5lcmF0ZWQgZGlhbG9ncyBmcm9tIHRoZSBET01cbiAgICAgICAgaWYgKHRoaXMuZHluYW1pY0VsZW1lbnQpIHtcbiAgICAgICAgICBkb2N1bWVudC5ib2R5LnJlbW92ZUNoaWxkKHRoaXMub3B0aW9ucy5lbGVtZW50KVxuICAgICAgICAgIHRoaXMub3B0aW9ucy5lbGVtZW50ID0gbnVsbFxuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIGJhY2tkcm9wLmFkZEV2ZW50TGlzdGVuZXIoRXZlbnQuVFJBTlNJVElPTl9FTkQsIG9uSGlkZGVuKVxuICAgICAgYmFja2Ryb3AuY2xhc3NMaXN0LmFkZCgnZmFkZW91dCcpXG5cbiAgICAgIHJldHVybiB0cnVlXG4gICAgfVxuXG4gICAgYXR0YWNoRXZlbnRzKCkge1xuICAgICAgY29uc3QgYnV0dG9ucyA9IHRoaXMub3B0aW9ucy5lbGVtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJ1tkYXRhLWRpc21pc3NdLCAuZGlhbG9nLWZvb3RlciBidXR0b24nKVxuICAgICAgaWYgKGJ1dHRvbnMpIHtcbiAgICAgICAgQXJyYXkuZnJvbShidXR0b25zKS5mb3JFYWNoKGJ1dHRvbiA9PiB0aGlzLnJlZ2lzdGVyRWxlbWVudCh7IHRhcmdldDogYnV0dG9uLCBldmVudDogJ2NsaWNrJyB9KSlcbiAgICAgIH1cblxuICAgICAgLy8gYWRkIGV2ZW50cyBpZiB0aGUgZGlhbG9nIGlzIGNhbmNlbGFibGVcbiAgICAgIC8vIHdoaWNoIG1lYW5zIHRoZSB1c2VyIGNhbiBoaWRlIHRoZSBkaWFsb2dcbiAgICAgIC8vIGJ5IHByZXNzaW5nIHRoZSBFU0Mga2V5IG9yIGNsaWNrIG91dHNpZGUgdGhlIGJhY2tkcm9wXG4gICAgICBpZiAodGhpcy5vcHRpb25zLmNhbmNlbGFibGUpIHtcbiAgICAgICAgY29uc3QgYmFja2Ryb3AgPSB0aGlzLmdldEJhY2tkcm9wKClcbiAgICAgICAgdGhpcy5yZWdpc3RlckVsZW1lbnQoeyB0YXJnZXQ6IGJhY2tkcm9wLCBldmVudDogRXZlbnQuU1RBUlQgfSlcbiAgICAgICAgdGhpcy5yZWdpc3RlckVsZW1lbnQoeyB0YXJnZXQ6IGRvY3VtZW50LCBldmVudDogJ2tleXVwJyB9KVxuICAgICAgfVxuICAgIH1cblxuICAgIGRldGFjaEV2ZW50cygpIHtcbiAgICAgIGNvbnN0IGJ1dHRvbnMgPSB0aGlzLm9wdGlvbnMuZWxlbWVudC5xdWVyeVNlbGVjdG9yQWxsKCdbZGF0YS1kaXNtaXNzXSwgLmRpYWxvZy1mb290ZXIgYnV0dG9uJylcbiAgICAgIGlmIChidXR0b25zKSB7XG4gICAgICAgIEFycmF5LmZyb20oYnV0dG9ucykuZm9yRWFjaChidXR0b24gPT4gdGhpcy51bnJlZ2lzdGVyRWxlbWVudCh7IHRhcmdldDogYnV0dG9uLCBldmVudDogJ2NsaWNrJyB9KSlcbiAgICAgIH1cblxuICAgICAgaWYgKHRoaXMub3B0aW9ucy5jYW5jZWxhYmxlKSB7XG4gICAgICAgIGNvbnN0IGJhY2tkcm9wID0gdGhpcy5nZXRCYWNrZHJvcCgpXG4gICAgICAgIHRoaXMudW5yZWdpc3RlckVsZW1lbnQoeyB0YXJnZXQ6IGJhY2tkcm9wLCBldmVudDogRXZlbnQuU1RBUlQgfSlcbiAgICAgICAgdGhpcy51bnJlZ2lzdGVyRWxlbWVudCh7IHRhcmdldDogZG9jdW1lbnQsIGV2ZW50OiAna2V5dXAnIH0pXG4gICAgICB9XG4gICAgfVxuXG4gICAgc3RhdGljIGlkZW50aWZpZXIoKSB7XG4gICAgICByZXR1cm4gTkFNRVxuICAgIH1cblxuICAgIHN0YXRpYyBfRE9NSW50ZXJmYWNlKG9wdGlvbnMpIHtcbiAgICAgIHJldHVybiBzdXBlci5fRE9NSW50ZXJmYWNlKERpYWxvZywgb3B0aW9ucylcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAqIERPTSBBcGkgaW1wbGVtZW50YXRpb25cbiAgICogLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAqL1xuICBjb25zdCBjb21wb25lbnRzID0gW11cblxuICBjb25zdCBkaWFsb2dzID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChgLiR7TkFNRX1gKVxuICBpZiAoZGlhbG9ncykge1xuICAgIEFycmF5LmZyb20oZGlhbG9ncykuZm9yRWFjaCgoZWxlbWVudCkgPT4ge1xuICAgICAgY29uc3QgY29uZmlnID0gZ2V0QXR0cmlidXRlc0NvbmZpZyhlbGVtZW50LCBERUZBVUxUX1BST1BFUlRJRVMsIERBVEFfQVRUUlNfUFJPUEVSVElFUylcbiAgICAgIGNvbmZpZy5lbGVtZW50ID0gZWxlbWVudFxuXG4gICAgICBjb21wb25lbnRzLnB1c2goeyBlbGVtZW50LCBkaWFsb2c6IG5ldyBEaWFsb2coY29uZmlnKSB9KVxuICAgIH0pXG4gIH1cblxuICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIChldmVudCkgPT4ge1xuICAgIGNvbnN0IGRhdGFUb2dnbGVBdHRyID0gZXZlbnQudGFyZ2V0LmdldEF0dHJpYnV0ZSgnZGF0YS10b2dnbGUnKVxuICAgIGlmIChkYXRhVG9nZ2xlQXR0ciAmJiBkYXRhVG9nZ2xlQXR0ciA9PT0gTkFNRSkge1xuICAgICAgY29uc3QgaWQgPSBldmVudC50YXJnZXQuZ2V0QXR0cmlidXRlKCdkYXRhLXRhcmdldCcpXG4gICAgICBjb25zdCBlbGVtZW50ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihpZClcblxuICAgICAgY29uc3QgY29tcG9uZW50ID0gY29tcG9uZW50cy5maW5kKGMgPT4gYy5lbGVtZW50ID09PSBlbGVtZW50KVxuXG4gICAgICBpZiAoIWNvbXBvbmVudCkge1xuICAgICAgICByZXR1cm5cbiAgICAgIH1cblxuICAgICAgLy8gcmVtb3ZlIHRoZSBmb2N1cyBzdGF0ZSBvZiB0aGUgdHJpZ2dlclxuICAgICAgZXZlbnQudGFyZ2V0LmJsdXIoKVxuXG4gICAgICBjb21wb25lbnQuZGlhbG9nLnNob3coKVxuICAgIH1cbiAgfSlcblxuICByZXR1cm4gRGlhbG9nXG59KSgpXG5cbmV4cG9ydCBkZWZhdWx0IERpYWxvZ1xuIiwiLyoqXG4gKiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICogTGljZW5zZWQgdW5kZXIgTUlUIChodHRwczovL2dpdGh1Yi5jb20vcXVhcmstZGV2L1Bob25vbi1GcmFtZXdvcmsvYmxvYi9tYXN0ZXIvTElDRU5TRSlcbiAqIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gKi9cbmltcG9ydCBEaWFsb2cgZnJvbSAnLi9pbmRleCdcbmltcG9ydCBTcGlubmVyIGZyb20gJy4uL2xvYWRlci9pbmRleCdcbmltcG9ydCB7IGdldEF0dHJpYnV0ZXNDb25maWcgfSBmcm9tICcuLi9jb21wb25lbnRNYW5hZ2VyJ1xuXG5jb25zdCBMb2FkZXIgPSAoKCkgPT4ge1xuXG4gIC8qKlxuICAgKiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICogQ29uc3RhbnRzXG4gICAqIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgKi9cblxuICBjb25zdCBOQU1FID0gJ2xvYWRlcidcbiAgY29uc3QgREVGQVVMVF9QUk9QRVJUSUVTID0ge1xuICAgIGVsZW1lbnQ6IG51bGwsXG4gICAgdGl0bGU6IG51bGwsXG4gICAgbWVzc2FnZTogbnVsbCxcbiAgICBjYW5jZWxhYmxlOiB0cnVlLFxuICAgIHR5cGU6IE5BTUUsXG4gICAgYnV0dG9uczogW10sXG4gIH1cbiAgY29uc3QgREFUQV9BVFRSU19QUk9QRVJUSUVTID0gW1xuICAgICdjYW5jZWxhYmxlJyxcbiAgXVxuXG4gIC8qKlxuICAgKiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICogQ2xhc3MgRGVmaW5pdGlvblxuICAgKiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICovXG5cbiAgY2xhc3MgTG9hZGVyIGV4dGVuZHMgRGlhbG9nIHtcblxuICAgIGNvbnN0cnVjdG9yKG9wdGlvbnMgPSB7fSkge1xuICAgICAgY29uc3QgdGVtcGxhdGUgPSAnJyArXG4gICAgICAnPGRpdiBjbGFzcz1cImRpYWxvZ1wiIHRhYmluZGV4PVwiLTFcIiByb2xlPVwiZGlhbG9nXCI+JyArXG4gICAgICAgICc8ZGl2IGNsYXNzPVwiZGlhbG9nLWlubmVyXCIgcm9sZT1cImRvY3VtZW50XCI+JyArXG4gICAgICAgICAgJzxkaXYgY2xhc3M9XCJkaWFsb2ctY29udGVudFwiPicgK1xuICAgICAgICAgICAgJzxkaXYgY2xhc3M9XCJkaWFsb2ctaGVhZGVyXCI+JyArXG4gICAgICAgICAgICAgICc8aDUgY2xhc3M9XCJkaWFsb2ctdGl0bGVcIj48L2g1PicgK1xuICAgICAgICAgICAgJzwvZGl2PicgK1xuICAgICAgICAgICAgJzxkaXYgY2xhc3M9XCJkaWFsb2ctYm9keVwiPicgK1xuICAgICAgICAgICAgICAnPHA+PC9wPicgK1xuICAgICAgICAgICAgICAnPGRpdiBjbGFzcz1cIm14LWF1dG8gdGV4dC1jZW50ZXJcIj4nICtcbiAgICAgICAgICAgICAgICAnPGRpdiBjbGFzcz1cImxvYWRlciBteC1hdXRvIGQtYmxvY2tcIj4nICtcbiAgICAgICAgICAgICAgICAgICc8ZGl2IGNsYXNzPVwibG9hZGVyLXNwaW5uZXJcIj48L2Rpdj4nICtcbiAgICAgICAgICAgICAgICAnPC9kaXY+JyArXG4gICAgICAgICAgICAgICc8L2Rpdj4nICtcbiAgICAgICAgICAgICc8L2Rpdj4nICtcbiAgICAgICAgICAgICc8ZGl2IGNsYXNzPVwiZGlhbG9nLWZvb3RlclwiPicgK1xuICAgICAgICAgICAgJzwvZGl2PicgK1xuICAgICAgICAgICc8L2Rpdj4nICtcbiAgICAgICAgJzwvZGl2PicgK1xuICAgICAgJzwvZGl2PidcblxuICAgICAgaWYgKCFBcnJheS5pc0FycmF5KG9wdGlvbnMuYnV0dG9ucykpIHtcbiAgICAgICAgb3B0aW9ucy5idXR0b25zID0gb3B0aW9ucy5jYW5jZWxhYmxlID8gREVGQVVMVF9QUk9QRVJUSUVTLmJ1dHRvbnMgOiBbXVxuICAgICAgfVxuXG4gICAgICBzdXBlcihvcHRpb25zLCB0ZW1wbGF0ZSlcblxuICAgICAgdGhpcy5zcGlubmVyID0gbnVsbFxuICAgIH1cblxuICAgIHNob3coKSB7XG4gICAgICBzdXBlci5zaG93KClcblxuICAgICAgdGhpcy5zcGlubmVyID0gbmV3IFNwaW5uZXIoe2VsZW1lbnQ6IHRoaXMuZ2V0RWxlbWVudCgpLnF1ZXJ5U2VsZWN0b3IoJy5sb2FkZXInKX0pXG4gICAgICB0aGlzLnNwaW5uZXIuYW5pbWF0ZSh0cnVlKVxuICAgIH1cblxuICAgIGhpZGUoKSB7XG4gICAgICBzdXBlci5oaWRlKClcblxuICAgICAgdGhpcy5zcGlubmVyLmFuaW1hdGUoZmFsc2UpXG4gICAgICB0aGlzLnNwaW5uZXIgPSBudWxsXG4gICAgfVxuXG4gICAgc3RhdGljIGlkZW50aWZpZXIoKSB7XG4gICAgICByZXR1cm4gTkFNRVxuICAgIH1cblxuICAgIHN0YXRpYyBfRE9NSW50ZXJmYWNlKG9wdGlvbnMpIHtcbiAgICAgIHJldHVybiBuZXcgTG9hZGVyKG9wdGlvbnMpXG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgKiBET00gQXBpIGltcGxlbWVudGF0aW9uXG4gICAqIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgKi9cbiAgY29uc3QgY29tcG9uZW50cyA9IFtdXG4gIGNvbnN0IGRpYWxvZ3MgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKGAuJHtEaWFsb2cuaWRlbnRpZmllcigpfWApXG5cbiAgaWYgKGRpYWxvZ3MpIHtcbiAgICBBcnJheS5mcm9tKGRpYWxvZ3MpLmZvckVhY2goKGVsZW1lbnQpID0+IHtcbiAgICAgIGNvbnN0IGNvbmZpZyA9IGdldEF0dHJpYnV0ZXNDb25maWcoZWxlbWVudCwgREVGQVVMVF9QUk9QRVJUSUVTLCBEQVRBX0FUVFJTX1BST1BFUlRJRVMpXG4gICAgICBjb25maWcuZWxlbWVudCA9IGVsZW1lbnRcblxuICAgICAgaWYgKGNvbmZpZy50eXBlID09PSBOQU1FKSB7XG4gICAgICAgIC8vIGxvYWRlclxuICAgICAgICBjb21wb25lbnRzLnB1c2gobmV3IExvYWRlcihjb25maWcpKVxuICAgICAgfVxuICAgIH0pXG4gIH1cblxuICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIChldmVudCkgPT4ge1xuICAgIGNvbnN0IGRhdGFUb2dnbGVBdHRyID0gZXZlbnQudGFyZ2V0LmdldEF0dHJpYnV0ZSgnZGF0YS10b2dnbGUnKVxuICAgIGlmIChkYXRhVG9nZ2xlQXR0ciAmJiBkYXRhVG9nZ2xlQXR0ciA9PT0gTkFNRSkge1xuICAgICAgY29uc3QgaWQgPSBldmVudC50YXJnZXQuZ2V0QXR0cmlidXRlKCdkYXRhLXRhcmdldCcpXG4gICAgICBjb25zdCBlbGVtZW50ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihpZClcblxuICAgICAgY29uc3QgY29tcG9uZW50ID0gY29tcG9uZW50cy5maW5kKGMgPT4gYy5lbGVtZW50ID09PSBlbGVtZW50KVxuXG4gICAgICBpZiAoIWNvbXBvbmVudCkge1xuICAgICAgICByZXR1cm5cbiAgICAgIH1cblxuICAgICAgLy8gcmVtb3ZlIHRoZSBmb2N1cyBzdGF0ZSBvZiB0aGUgdHJpZ2dlclxuICAgICAgZXZlbnQudGFyZ2V0LmJsdXIoKVxuXG4gICAgICBjb21wb25lbnQuZGlhbG9nLnNob3coKVxuICAgIH1cbiAgfSlcblxuICByZXR1cm4gTG9hZGVyXG59KSgpXG5cbmV4cG9ydCBkZWZhdWx0IExvYWRlclxuIiwiLyoqXG4gKiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICogTGljZW5zZWQgdW5kZXIgTUlUIChodHRwczovL2dpdGh1Yi5jb20vcXVhcmstZGV2L1Bob25vbi1GcmFtZXdvcmsvYmxvYi9tYXN0ZXIvTElDRU5TRSlcbiAqIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gKi9cbmltcG9ydCBEaWFsb2cgZnJvbSAnLi9pbmRleCdcbmltcG9ydCB7IGdldEF0dHJpYnV0ZXNDb25maWcgfSBmcm9tICcuLi9jb21wb25lbnRNYW5hZ2VyJ1xuXG5jb25zdCBQcm9tcHQgPSAoKCkgPT4ge1xuXG4gIC8qKlxuICAgKiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICogQ29uc3RhbnRzXG4gICAqIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgKi9cblxuICBjb25zdCBOQU1FID0gJ3Byb21wdCdcbiAgY29uc3QgREVGQVVMVF9QUk9QRVJUSUVTID0ge1xuICAgIGVsZW1lbnQ6IG51bGwsXG4gICAgdGl0bGU6IG51bGwsXG4gICAgbWVzc2FnZTogbnVsbCxcbiAgICBjYW5jZWxhYmxlOiB0cnVlLFxuICAgIHR5cGU6IE5BTUUsXG4gICAgYnV0dG9uczogW1xuICAgICAge1xuICAgICAgICBldmVudDogJ2NhbmNlbCcsXG4gICAgICAgIHRleHQ6ICdDYW5jZWwnLFxuICAgICAgICBkaXNtaXNzOiB0cnVlLFxuICAgICAgICBjbGFzczogJ2J0biBidG4tc2Vjb25kYXJ5JyxcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIGV2ZW50OiAnY29uZmlybScsXG4gICAgICAgIHRleHQ6ICdPaycsXG4gICAgICAgIGRpc21pc3M6IHRydWUsXG4gICAgICAgIGNsYXNzOiAnYnRuIGJ0bi1wcmltYXJ5JyxcbiAgICAgIH0sXG4gICAgXSxcbiAgfVxuICBjb25zdCBEQVRBX0FUVFJTX1BST1BFUlRJRVMgPSBbXG4gICAgJ2NhbmNlbGFibGUnLFxuICBdXG5cbiAgLyoqXG4gICAqIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgKiBDbGFzcyBEZWZpbml0aW9uXG4gICAqIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgKi9cblxuICBjbGFzcyBQcm9tcHQgZXh0ZW5kcyBEaWFsb2cge1xuXG4gICAgY29uc3RydWN0b3Iob3B0aW9ucyA9IHt9KSB7XG4gICAgICBjb25zdCB0ZW1wbGF0ZSA9ICcnICtcbiAgICAgICc8ZGl2IGNsYXNzPVwiZGlhbG9nXCIgdGFiaW5kZXg9XCItMVwiIHJvbGU9XCJkaWFsb2dcIj4nICtcbiAgICAgICAgJzxkaXYgY2xhc3M9XCJkaWFsb2ctaW5uZXJcIiByb2xlPVwiZG9jdW1lbnRcIj4nICtcbiAgICAgICAgICAnPGRpdiBjbGFzcz1cImRpYWxvZy1jb250ZW50XCI+JyArXG4gICAgICAgICAgICAnPGRpdiBjbGFzcz1cImRpYWxvZy1oZWFkZXJcIj4nICtcbiAgICAgICAgICAgICAgJzxoNSBjbGFzcz1cImRpYWxvZy10aXRsZVwiPjwvaDU+JyArXG4gICAgICAgICAgICAnPC9kaXY+JyArXG4gICAgICAgICAgICAnPGRpdiBjbGFzcz1cImRpYWxvZy1ib2R5XCI+JyArXG4gICAgICAgICAgICAgICc8cD48L3A+JyArXG4gICAgICAgICAgICAgICc8aW5wdXQgY2xhc3M9XCJmb3JtLWNvbnRyb2xcIiB0eXBlPVwidGV4dFwiIHZhbHVlPVwiXCI+JyArXG4gICAgICAgICAgICAnPC9kaXY+JyArXG4gICAgICAgICAgICAnPGRpdiBjbGFzcz1cImRpYWxvZy1mb290ZXJcIj4nICtcbiAgICAgICAgICAgICc8L2Rpdj4nICtcbiAgICAgICAgICAnPC9kaXY+JyArXG4gICAgICAgICc8L2Rpdj4nICtcbiAgICAgICc8L2Rpdj4nXG5cbiAgICAgIGlmICghQXJyYXkuaXNBcnJheShvcHRpb25zLmJ1dHRvbnMpKSB7XG4gICAgICAgIG9wdGlvbnMuYnV0dG9ucyA9IERFRkFVTFRfUFJPUEVSVElFUy5idXR0b25zXG4gICAgICB9XG5cbiAgICAgIHN1cGVyKG9wdGlvbnMsIHRlbXBsYXRlKVxuICAgIH1cblxuICAgIHNob3coKSB7XG4gICAgICBzdXBlci5zaG93KClcbiAgICAgIHRoaXMuYXR0YWNoSW5wdXRFdmVudCgpXG4gICAgfVxuXG4gICAgaGlkZSgpIHtcbiAgICAgIHN1cGVyLmhpZGUoKSAgIFxuICAgICAgdGhpcy5kZXRhY2hJbnB1dEV2ZW50KCkgICBcbiAgICB9XG5cbiAgICBnZXRJbnB1dCgpIHtcbiAgICAgIHJldHVybiB0aGlzLm9wdGlvbnMuZWxlbWVudC5xdWVyeVNlbGVjdG9yKCcuZm9ybS1jb250cm9sJylcbiAgICB9XG5cbiAgICBhdHRhY2hJbnB1dEV2ZW50KCkge1xuICAgICAgdGhpcy5yZWdpc3RlckVsZW1lbnQoeyB0YXJnZXQ6IHRoaXMuZ2V0SW5wdXQoKSwgZXZlbnQ6ICdrZXl1cCcgfSlcbiAgICB9XG5cbiAgICBkZXRhY2hJbnB1dEV2ZW50KCkge1xuICAgICAgdGhpcy51bnJlZ2lzdGVyRWxlbWVudCh7IHRhcmdldDogdGhpcy5nZXRJbnB1dCgpLCBldmVudDogJ2tleXVwJyB9KSAgICAgICAgIFxuICAgIH1cblxuICAgIG9uRWxlbWVudEV2ZW50KGV2ZW50KSB7XG4gICAgICBpZiAoZXZlbnQudGFyZ2V0ID09PSB0aGlzLmdldElucHV0KCkpIHtcbiAgICAgICAgcmV0dXJuXG4gICAgICB9XG5cbiAgICAgIHN1cGVyLm9uRWxlbWVudEV2ZW50KGV2ZW50KVxuICAgIH1cblxuICAgIHNldElucHV0VmFsdWUodmFsdWUgPSAnJykge1xuICAgICAgdGhpcy5nZXRJbnB1dCgpLnZhbHVlID0gdmFsdWVcbiAgICB9XG5cbiAgICBnZXRJbnB1dFZhbHVlKCkge1xuICAgICAgcmV0dXJuIHRoaXMuZ2V0SW5wdXQoKS52YWx1ZVxuICAgIH1cblxuICAgIHN0YXRpYyBpZGVudGlmaWVyKCkge1xuICAgICAgcmV0dXJuIE5BTUVcbiAgICB9XG5cbiAgICBzdGF0aWMgX0RPTUludGVyZmFjZShvcHRpb25zKSB7XG4gICAgICByZXR1cm4gbmV3IFByb21wdChvcHRpb25zKVxuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICogRE9NIEFwaSBpbXBsZW1lbnRhdGlvblxuICAgKiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICovXG4gIGNvbnN0IGNvbXBvbmVudHMgPSBbXVxuICBjb25zdCBkaWFsb2dzID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChgLiR7RGlhbG9nLmlkZW50aWZpZXIoKX1gKVxuXG4gIGlmIChkaWFsb2dzKSB7XG4gICAgQXJyYXkuZnJvbShkaWFsb2dzKS5mb3JFYWNoKChlbGVtZW50KSA9PiB7XG4gICAgICBjb25zdCBjb25maWcgPSBnZXRBdHRyaWJ1dGVzQ29uZmlnKGVsZW1lbnQsIERFRkFVTFRfUFJPUEVSVElFUywgREFUQV9BVFRSU19QUk9QRVJUSUVTKVxuICAgICAgY29uZmlnLmVsZW1lbnQgPSBlbGVtZW50XG5cbiAgICAgIGlmIChjb25maWcudHlwZSA9PT0gTkFNRSkge1xuICAgICAgICAvLyBwcm9tcHRcbiAgICAgICAgY29tcG9uZW50cy5wdXNoKG5ldyBQcm9tcHQoY29uZmlnKSlcbiAgICAgIH1cbiAgICB9KVxuICB9XG5cbiAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoZXZlbnQpID0+IHtcbiAgICBjb25zdCBkYXRhVG9nZ2xlQXR0ciA9IGV2ZW50LnRhcmdldC5nZXRBdHRyaWJ1dGUoJ2RhdGEtdG9nZ2xlJylcbiAgICBpZiAoZGF0YVRvZ2dsZUF0dHIgJiYgZGF0YVRvZ2dsZUF0dHIgPT09IE5BTUUpIHtcbiAgICAgIGNvbnN0IGlkID0gZXZlbnQudGFyZ2V0LmdldEF0dHJpYnV0ZSgnZGF0YS10YXJnZXQnKVxuICAgICAgY29uc3QgZWxlbWVudCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoaWQpXG5cbiAgICAgIGNvbnN0IGNvbXBvbmVudCA9IGNvbXBvbmVudHMuZmluZChjID0+IGMuZWxlbWVudCA9PT0gZWxlbWVudClcblxuICAgICAgaWYgKCFjb21wb25lbnQpIHtcbiAgICAgICAgcmV0dXJuXG4gICAgICB9XG5cbiAgICAgIC8vIHJlbW92ZSB0aGUgZm9jdXMgc3RhdGUgb2YgdGhlIHRyaWdnZXJcbiAgICAgIGV2ZW50LnRhcmdldC5ibHVyKClcblxuICAgICAgY29tcG9uZW50LmRpYWxvZy5zaG93KClcbiAgICB9XG4gIH0pXG5cbiAgcmV0dXJuIFByb21wdFxufSkoKVxuXG5leHBvcnQgZGVmYXVsdCBQcm9tcHRcbiIsIi8qKlxuICogLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAqIExpY2Vuc2VkIHVuZGVyIE1JVCAoaHR0cHM6Ly9naXRodWIuY29tL3F1YXJrLWRldi9QaG9ub24tRnJhbWV3b3JrL2Jsb2IvbWFzdGVyL0xJQ0VOU0UpXG4gKiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICovXG5pbXBvcnQgQ29tcG9uZW50IGZyb20gJy4uL2NvbXBvbmVudCdcbmltcG9ydCBFdmVudCBmcm9tICcuLi8uLi9jb21tb24vZXZlbnRzJ1xuaW1wb3J0IHsgZmluZFRhcmdldEJ5Q2xhc3MgfSBmcm9tICcuLi8uLi9jb21tb24vdXRpbHMnXG5pbXBvcnQgeyBnZXRBdHRyaWJ1dGVzQ29uZmlnIH0gZnJvbSAnLi4vY29tcG9uZW50TWFuYWdlcidcblxuY29uc3QgRHJvcGRvd24gPSAoKCkgPT4ge1xuICAvKipcbiAgICogLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAqIENvbnN0YW50c1xuICAgKiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICovXG5cbiAgY29uc3QgTkFNRSA9ICdkcm9wZG93bidcbiAgY29uc3QgVkVSU0lPTiA9ICcyLjAuMCdcbiAgY29uc3QgREVGQVVMVF9QUk9QRVJUSUVTID0ge1xuICAgIGVsZW1lbnQ6IG51bGwsXG4gICAgZGVmYXVsdDogdHJ1ZSxcbiAgICBzZWFyY2g6IGZhbHNlLFxuICB9XG4gIGNvbnN0IERBVEFfQVRUUlNfUFJPUEVSVElFUyA9IFtcbiAgICAnZGVmYXVsdCcsXG4gICAgJ3NlYXJjaCcsXG4gIF1cblxuICAvKipcbiAgICogLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAqIENsYXNzIERlZmluaXRpb25cbiAgICogLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAqL1xuXG4gIGNsYXNzIERyb3Bkb3duIGV4dGVuZHMgQ29tcG9uZW50IHtcblxuICAgIGNvbnN0cnVjdG9yKG9wdGlvbnMgPSB7fSkge1xuICAgICAgc3VwZXIoTkFNRSwgVkVSU0lPTiwgREVGQVVMVF9QUk9QRVJUSUVTLCBvcHRpb25zLCBEQVRBX0FUVFJTX1BST1BFUlRJRVMsIGZhbHNlLCBmYWxzZSlcblxuICAgICAgY29uc3Qgc2VsZWN0ZWQgPSB0aGlzLm9wdGlvbnMuZWxlbWVudC5xdWVyeVNlbGVjdG9yKCdbZGF0YS1zZWxlY3RlZF0nKVxuICAgICAgY29uc3QgaXRlbSA9IHRoaXMuZ2V0SXRlbURhdGEoc2VsZWN0ZWQpXG5cbiAgICAgIHRoaXMuc2V0U2VsZWN0ZWQoaXRlbS52YWx1ZSwgaXRlbS50ZXh0LCBmYWxzZSlcbiAgICB9XG5cbiAgICBzZXRTZWxlY3RlZCh2YWx1ZSA9ICcnLCB0ZXh0ID0gbnVsbCwgY2hlY2tFeGlzdHMgPSB0cnVlKSB7XG4gICAgICBpZiAoIXRoaXMub3B0aW9ucy5kZWZhdWx0KSB7XG4gICAgICAgIHJldHVybiBmYWxzZVxuICAgICAgfVxuXG4gICAgICBsZXQgdGV4dERpc3BsYXkgPSB0ZXh0XG4gICAgICB0aGlzLm9wdGlvbnMuZWxlbWVudC5xdWVyeVNlbGVjdG9yKCcuZGVmYXVsdC10ZXh0JykuaW5uZXJIVE1MID0gdGV4dFxuICAgICAgdGhpcy5vcHRpb25zLmVsZW1lbnQucXVlcnlTZWxlY3RvcignaW5wdXRbdHlwZT1cImhpZGRlblwiXScpLnZhbHVlID0gdmFsdWVcblxuICAgICAgY29uc3QgaXRlbXMgPSB0aGlzLm9wdGlvbnMuZWxlbWVudC5xdWVyeVNlbGVjdG9yQWxsKCcuaXRlbScpIHx8IFtdXG4gICAgICBsZXQgaXRlbUZvdW5kID0gZmFsc2VcblxuICAgICAgQXJyYXkuZnJvbShpdGVtcykuZm9yRWFjaCgoaXRlbSkgPT4ge1xuICAgICAgICBpZiAoaXRlbS5jbGFzc0xpc3QuY29udGFpbnMoJ3NlbGVjdGVkJykpIHtcbiAgICAgICAgICBpdGVtLmNsYXNzTGlzdC5yZW1vdmUoJ3NlbGVjdGVkJylcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IGRhdGEgPSB0aGlzLmdldEl0ZW1EYXRhKGl0ZW0pXG5cbiAgICAgICAgaWYgKHZhbHVlID09PSBkYXRhLnZhbHVlKSB7XG4gICAgICAgICAgaWYgKCFpdGVtLmNsYXNzTGlzdC5jb250YWlucygnc2VsZWN0ZWQnKSkge1xuICAgICAgICAgICAgaXRlbS5jbGFzc0xpc3QuYWRkKCdzZWxlY3RlZCcpXG4gICAgICAgICAgfVxuXG4gICAgICAgICAgdGV4dERpc3BsYXkgPSBkYXRhLnRleHRcbiAgICAgICAgICBpdGVtRm91bmQgPSB0cnVlXG4gICAgICAgIH1cbiAgICAgIH0pXG5cbiAgICAgIGlmIChjaGVja0V4aXN0cyAmJiBpdGVtRm91bmQpIHtcbiAgICAgICAgdGhpcy5vcHRpb25zLmVsZW1lbnQucXVlcnlTZWxlY3RvcignLmRlZmF1bHQtdGV4dCcpLmlubmVySFRNTCA9IHRleHREaXNwbGF5XG4gICAgICB9IGVsc2UgaWYgKGNoZWNrRXhpc3RzICYmICFpdGVtRm91bmQpIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKGAke05BTUV9LiBUaGUgdmFsdWUgXCIke3ZhbHVlfVwiIGRvZXMgbm90IGV4aXN0IGluIHRoZSBsaXN0IG9mIGl0ZW1zLmApICAgICAgICBcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIHRydWVcbiAgICB9XG5cbiAgICBnZXRTZWxlY3RlZCgpIHtcbiAgICAgIHJldHVybiB0aGlzLm9wdGlvbnMuZWxlbWVudC5xdWVyeVNlbGVjdG9yKCdpbnB1dFt0eXBlPVwiaGlkZGVuXCJdJykudmFsdWVcbiAgICB9XG5cbiAgICBnZXRJdGVtRGF0YShpdGVtID0gbnVsbCkge1xuICAgICAgbGV0IHRleHQgPSAnJ1xuICAgICAgbGV0IHZhbHVlID0gJydcblxuICAgICAgaWYgKGl0ZW0pIHtcbiAgICAgICAgdGV4dCA9IGl0ZW0uZ2V0QXR0cmlidXRlKCdkYXRhLXRleHQnKSB8fCBpdGVtLmlubmVySFRNTFxuXG4gICAgICAgIGNvbnN0IHNlbGVjdGVkVGV4dE5vZGUgPSBpdGVtLnF1ZXJ5U2VsZWN0b3IoJy50ZXh0JylcbiAgICAgICAgaWYgKHNlbGVjdGVkVGV4dE5vZGUpIHtcbiAgICAgICAgICB0ZXh0ID0gc2VsZWN0ZWRUZXh0Tm9kZS5pbm5lckhUTUxcbiAgICAgICAgfVxuXG4gICAgICAgIHZhbHVlID0gaXRlbS5nZXRBdHRyaWJ1dGUoJ2RhdGEtdmFsdWUnKSB8fCAnJ1xuICAgICAgfVxuXG4gICAgICByZXR1cm4geyB0ZXh0LCB2YWx1ZSB9XG4gICAgfVxuXG4gICAgb25FbGVtZW50RXZlbnQoZXZlbnQpIHtcbiAgICAgIGlmIChldmVudC50eXBlID09PSBFdmVudC5TVEFSVCkge1xuICAgICAgICBjb25zdCBkcm9wZG93biA9IGZpbmRUYXJnZXRCeUNsYXNzKGV2ZW50LnRhcmdldCwgJ2Ryb3Bkb3duJylcblxuICAgICAgICAvKlxuICAgICAgICAgKiBoaWRlIHRoZSBjdXJyZW50IGRyb3Bkb3duIG9ubHkgaWYgdGhlIGV2ZW50IGNvbmNlcm5zIGFub3RoZXIgZHJvcGRvd25cbiAgICAgICAgICogaGlkZSBhbHNvIGlmIHRoZSB1c2VyIGNsaWNrcyBvdXRzaWRlIGEgZHJvcGRvd25cbiAgICAgICAgICovXG4gICAgICAgIGlmICghZHJvcGRvd24gfHwgZHJvcGRvd24gIT09IHRoaXMuZ2V0RWxlbWVudCgpKSB7XG4gICAgICAgICAgdGhpcy5oaWRlKClcbiAgICAgICAgfVxuXG4gICAgICB9IGVsc2UgaWYgKGV2ZW50LnR5cGUgPT09ICdjbGljaycpIHtcbiAgICAgICAgY29uc3QgaXRlbSA9IGZpbmRUYXJnZXRCeUNsYXNzKGV2ZW50LnRhcmdldCwgJ2l0ZW0nKVxuXG4gICAgICAgIGlmIChpdGVtKSB7XG4gICAgICAgICAgaWYgKGl0ZW0uY2xhc3NMaXN0LmNvbnRhaW5zKCdkaXNhYmxlZCcpKSB7XG4gICAgICAgICAgICByZXR1cm5cbiAgICAgICAgICB9XG5cbiAgICAgICAgICBjb25zdCBpdGVtSW5mbyA9IHRoaXMuZ2V0SXRlbURhdGEoaXRlbSlcblxuICAgICAgICAgIGlmICh0aGlzLmdldFNlbGVjdGVkKCkgIT09IGl0ZW1JbmZvLnZhbHVlKSB7XG4gICAgICAgICAgICAvLyB0aGUgdXNlciBzZWxlY3RlZCBhbm90aGVyIHZhbHVlLCB3ZSBkaXNwYXRjaCB0aGUgZXZlbnRcbiAgICAgICAgICAgIHRoaXMuc2V0U2VsZWN0ZWQoaXRlbUluZm8udmFsdWUsIGl0ZW1JbmZvLnRleHQsIGZhbHNlKVxuICAgICAgICAgICAgY29uc3QgZGV0YWlsID0geyBpdGVtLCB0ZXh0OiBpdGVtSW5mby50ZXh0LCB2YWx1ZTogaXRlbUluZm8udmFsdWUgfVxuICAgICAgICAgICAgdGhpcy50cmlnZ2VyRXZlbnQoRXZlbnQuSVRFTV9TRUxFQ1RFRCwgZGV0YWlsKVxuICAgICAgICAgIH1cblxuICAgICAgICAgIHRoaXMuaGlkZSgpXG4gICAgICAgICAgcmV0dXJuXG4gICAgICAgIH1cblxuICAgICAgICAvLyBkb24ndCB0b2dnbGUgdGhlIGRyb3Bkb3duIGlmIHRoZSBldmVudCBjb25jZXJucyBoZWFkZXJzLCBkaXZpZGVyc1xuICAgICAgICBjb25zdCBkcm9wZG93bk1lbnUgPSBmaW5kVGFyZ2V0QnlDbGFzcyhldmVudC50YXJnZXQsICdkcm9wZG93bi1tZW51JylcbiAgICAgICAgaWYgKGRyb3Bkb3duTWVudSkge1xuICAgICAgICAgIHJldHVyblxuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy50b2dnbGUoKVxuICAgICAgfVxuICAgIH1cblxuICAgIHRvZ2dsZSgpIHtcbiAgICAgIGlmICh0aGlzLm9wdGlvbnMuZWxlbWVudC5jbGFzc0xpc3QuY29udGFpbnMoJ2FjdGl2ZScpKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmhpZGUoKVxuICAgICAgfVxuXG4gICAgICByZXR1cm4gdGhpcy5zaG93KClcbiAgICB9XG5cbiAgICBzaG93KCkge1xuICAgICAgaWYgKHRoaXMub3B0aW9ucy5lbGVtZW50LmNsYXNzTGlzdC5jb250YWlucygnYWN0aXZlJykpIHtcbiAgICAgICAgcmV0dXJuIGZhbHNlXG4gICAgICB9XG5cbiAgICAgIHRoaXMub3B0aW9ucy5lbGVtZW50LmNsYXNzTGlzdC5hZGQoJ2FjdGl2ZScpXG5cbiAgICAgIGNvbnN0IGRyb3Bkb3duTWVudSA9IHRoaXMub3B0aW9ucy5lbGVtZW50LnF1ZXJ5U2VsZWN0b3IoJy5kcm9wZG93bi1tZW51JylcblxuICAgICAgLy8gc2Nyb2xsIHRvIHRvcFxuICAgICAgZHJvcGRvd25NZW51LnNjcm9sbFRvcCA9IDBcblxuICAgICAgdGhpcy50cmlnZ2VyRXZlbnQoRXZlbnQuU0hPVylcbiAgICAgIHRoaXMudHJpZ2dlckV2ZW50KEV2ZW50LlNIT1dOKVxuXG4gICAgICB0aGlzLnJlZ2lzdGVyRWxlbWVudCh7IHRhcmdldDogZHJvcGRvd25NZW51LCBldmVudDogJ2NsaWNrJyB9KSAgICAgIFxuICAgICAgdGhpcy5yZWdpc3RlckVsZW1lbnQoeyB0YXJnZXQ6IGRvY3VtZW50LmJvZHksIGV2ZW50OiBFdmVudC5TVEFSVCB9KVxuXG4gICAgICByZXR1cm4gdHJ1ZVxuICAgIH1cblxuICAgIGhpZGUoKSB7XG4gICAgICBpZiAoIXRoaXMub3B0aW9ucy5lbGVtZW50LmNsYXNzTGlzdC5jb250YWlucygnYWN0aXZlJykpIHtcbiAgICAgICAgcmV0dXJuIGZhbHNlXG4gICAgICB9XG5cbiAgICAgIHRoaXMub3B0aW9ucy5lbGVtZW50LmNsYXNzTGlzdC5yZW1vdmUoJ2FjdGl2ZScpXG5cbiAgICAgIHRoaXMudHJpZ2dlckV2ZW50KEV2ZW50LkhJREUpXG4gICAgICB0aGlzLnRyaWdnZXJFdmVudChFdmVudC5ISURERU4pXG5cbiAgICAgIHRoaXMudW5yZWdpc3RlckVsZW1lbnQoeyB0YXJnZXQ6IHRoaXMub3B0aW9ucy5lbGVtZW50LnF1ZXJ5U2VsZWN0b3IoJy5kcm9wZG93bi1tZW51JyksIGV2ZW50OiAnY2xpY2snIH0pICAgICAgXG4gICAgICB0aGlzLnVucmVnaXN0ZXJFbGVtZW50KHsgdGFyZ2V0OiBkb2N1bWVudC5ib2R5LCBldmVudDogRXZlbnQuU1RBUlQgfSlcblxuICAgICAgcmV0dXJuIHRydWVcbiAgICB9XG5cbiAgICBzdGF0aWMgaWRlbnRpZmllcigpIHtcbiAgICAgIHJldHVybiBOQU1FXG4gICAgfVxuXG4gICAgc3RhdGljIF9ET01JbnRlcmZhY2Uob3B0aW9ucykge1xuICAgICAgcmV0dXJuIHN1cGVyLl9ET01JbnRlcmZhY2UoRHJvcGRvd24sIG9wdGlvbnMpXG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgKiBET00gQXBpIGltcGxlbWVudGF0aW9uXG4gICAqIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgKi9cbiAgY29uc3QgY29tcG9uZW50cyA9IFtdXG5cbiAgY29uc3QgZHJvcGRvd25zID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChgLiR7TkFNRX1gKVxuICBpZiAoZHJvcGRvd25zKSB7XG4gICAgQXJyYXkuZnJvbShkcm9wZG93bnMpLmZvckVhY2goKGVsZW1lbnQpID0+IHtcbiAgICAgIGNvbnN0IGNvbmZpZyA9IGdldEF0dHJpYnV0ZXNDb25maWcoZWxlbWVudCwgREVGQVVMVF9QUk9QRVJUSUVTLCBEQVRBX0FUVFJTX1BST1BFUlRJRVMpXG4gICAgICBjb25maWcuZWxlbWVudCA9IGVsZW1lbnRcblxuICAgICAgaWYgKCFjb25maWcuc2VhcmNoKSB7XG4gICAgICAgIGNvbXBvbmVudHMucHVzaChuZXcgRHJvcGRvd24oY29uZmlnKSlcbiAgICAgIH1cbiAgICB9KVxuICB9XG5cbiAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoZXZlbnQpID0+IHtcbiAgICBjb25zdCBkcm9wZG93bk1lbnUgPSBmaW5kVGFyZ2V0QnlDbGFzcyhldmVudC50YXJnZXQsICdkcm9wZG93bi1tZW51JylcbiAgICBpZiAoZHJvcGRvd25NZW51KSB7XG4gICAgICByZXR1cm5cbiAgICB9XG5cbiAgICBjb25zdCBkcm9wZG93biA9IGZpbmRUYXJnZXRCeUNsYXNzKGV2ZW50LnRhcmdldCwgJ2Ryb3Bkb3duJylcblxuICAgIGlmIChkcm9wZG93bikge1xuICAgICAgY29uc3QgZGF0YVRvZ2dsZUF0dHIgPSBkcm9wZG93bi5nZXRBdHRyaWJ1dGUoJ2RhdGEtdG9nZ2xlJylcbiAgICAgIGlmIChkYXRhVG9nZ2xlQXR0ciAmJiBkYXRhVG9nZ2xlQXR0ciA9PT0gTkFNRSAmJiBkcm9wZG93bikge1xuICAgICAgICBjb25zdCBjb21wb25lbnQgPSBjb21wb25lbnRzLmZpbmQoYyA9PiBjLmdldEVsZW1lbnQoKSA9PT0gZHJvcGRvd24pXG5cbiAgICAgICAgaWYgKCFjb21wb25lbnQpIHtcbiAgICAgICAgICByZXR1cm5cbiAgICAgICAgfVxuXG4gICAgICAgIGNvbXBvbmVudC50b2dnbGUoKVxuICAgICAgfVxuICAgIH1cbiAgfSlcblxuICByZXR1cm4gRHJvcGRvd25cbn0pKClcblxuZXhwb3J0IGRlZmF1bHQgRHJvcGRvd25cbiIsIi8qKlxuICogLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAqIExpY2Vuc2VkIHVuZGVyIE1JVCAoaHR0cHM6Ly9naXRodWIuY29tL3F1YXJrLWRldi9QaG9ub24tRnJhbWV3b3JrL2Jsb2IvbWFzdGVyL0xJQ0VOU0UpXG4gKiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICovXG5pbXBvcnQgRHJvcGRvd24gZnJvbSAnLi9pbmRleCdcbmltcG9ydCB7IGZpbmRUYXJnZXRCeUNsYXNzIH0gZnJvbSAnLi4vLi4vY29tbW9uL3V0aWxzJ1xuaW1wb3J0IHsgZ2V0QXR0cmlidXRlc0NvbmZpZyB9IGZyb20gJy4uL2NvbXBvbmVudE1hbmFnZXInXG5cbmNvbnN0IERyb3Bkb3duU2VhcmNoID0gKCgpID0+IHtcblxuICAvKipcbiAgICogLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAqIENvbnN0YW50c1xuICAgKiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICovXG5cbiAgY29uc3QgTkFNRSA9IERyb3Bkb3duLmlkZW50aWZpZXIoKVxuICBjb25zdCBERUZBVUxUX1BST1BFUlRJRVMgPSB7XG4gICAgZWxlbWVudDogbnVsbCxcbiAgICBkZWZhdWx0OiB0cnVlLFxuICAgIHNlYXJjaDogdHJ1ZSxcbiAgfVxuICBjb25zdCBEQVRBX0FUVFJTX1BST1BFUlRJRVMgPSBbXG4gICAgJ2RlZmF1bHQnLFxuICAgICdzZWFyY2gnLFxuICBdXG5cbiAgLyoqXG4gICAqIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgKiBDbGFzcyBEZWZpbml0aW9uXG4gICAqIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgKi9cblxuICBjbGFzcyBEcm9wZG93blNlYXJjaCBleHRlbmRzIERyb3Bkb3duIHtcblxuICAgIGNvbnN0cnVjdG9yKG9wdGlvbnMgPSB7fSkge1xuICAgICAgc3VwZXIob3B0aW9ucylcblxuICAgICAgdGhpcy5maWx0ZXJJdGVtc0hhbmRsZXIgPSAoZXZlbnQpID0+IHtcbiAgICAgICAgY29uc3Qgc2VhcmNoID0gZXZlbnQudGFyZ2V0LnZhbHVlXG5cbiAgICAgICAgaWYgKHNlYXJjaCA9PT0gJycpIHtcbiAgICAgICAgICB0aGlzLnNob3dJdGVtcygpXG4gICAgICAgICAgcmV0dXJuXG4gICAgICAgIH1cblxuXG4gICAgICAgIHRoaXMuZ2V0SXRlbXMoKS5mb3JFYWNoKChpdGVtKSA9PiB7XG4gICAgICAgICAgY29uc3QgZm4gPSB0eXBlb2YgdGhpcy5vcHRpb25zLmZpbHRlckl0ZW0gPT09ICdmdW5jdGlvbicgPyB0aGlzLm9wdGlvbnMuZmlsdGVySXRlbSA6IHRoaXMuZmlsdGVySXRlbVxuXG4gICAgICAgICAgaWYgKGZuKHNlYXJjaCwgaXRlbSkpIHtcbiAgICAgICAgICAgIGl0ZW0uZWxlbWVudC5zdHlsZS5kaXNwbGF5ID0gJ2Jsb2NrJ1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBpdGVtLmVsZW1lbnQuc3R5bGUuZGlzcGxheSA9ICdub25lJ1xuICAgICAgICAgIH1cbiAgICAgICAgfSlcbiAgICAgIH1cblxuICAgICAgdGhpcy5nZXRTZWFyY2hJbnB1dCgpLmFkZEV2ZW50TGlzdGVuZXIoJ2tleXVwJywgdGhpcy5maWx0ZXJJdGVtc0hhbmRsZXIpXG4gICAgfVxuXG4gICAgZmlsdGVySXRlbShzZWFyY2ggPSAnJywgaXRlbSA9IHt9KSB7XG4gICAgICBpZiAoaXRlbS52YWx1ZS5pbmRleE9mKHNlYXJjaCkgPiAtMVxuICAgICAgICB8fCBpdGVtLnRleHQuaW5kZXhPZihzZWFyY2gpID4gLTEpIHtcbiAgICAgICAgcmV0dXJuIHRydWVcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIGZhbHNlXG4gICAgfVxuXG4gICAgZ2V0SXRlbXMoKSB7XG4gICAgICBsZXQgaXRlbXMgPSBBcnJheS5mcm9tKHRoaXMub3B0aW9ucy5lbGVtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJy5pdGVtJykgfHwgW10pXG4gICAgICBpdGVtcyA9IGl0ZW1zLm1hcCgoaXRlbSkgPT4ge1xuICAgICAgICBjb25zdCBpbmZvID0gdGhpcy5nZXRJdGVtRGF0YShpdGVtKVxuICAgICAgICByZXR1cm4geyB0ZXh0OiBpbmZvLnRleHQsIHZhbHVlOiBpbmZvLnZhbHVlLCBlbGVtZW50OiBpdGVtIH1cbiAgICAgIH0pXG5cbiAgICAgIHJldHVybiBpdGVtc1xuICAgIH1cblxuICAgIHNob3dJdGVtcygpIHtcbiAgICAgIHRoaXMuZ2V0SXRlbXMoKS5mb3JFYWNoKChpdGVtKSA9PiB7XG4gICAgICAgIGNvbnN0IGkgPSBpdGVtXG4gICAgICAgIGkuZWxlbWVudC5zdHlsZS5kaXNwbGF5ID0gJ2Jsb2NrJ1xuICAgICAgfSlcbiAgICB9XG5cbiAgICBnZXRTZWFyY2hJbnB1dCgpIHtcbiAgICAgIHJldHVybiB0aGlzLm9wdGlvbnMuZWxlbWVudC5xdWVyeVNlbGVjdG9yKCcuZHJvcGRvd24tbWVudSBpbnB1dCcpXG4gICAgfVxuXG4gICAgaGlkZSgpIHtcbiAgICAgIGlmIChzdXBlci5oaWRlKCkpIHtcbiAgICAgICAgLy8gcmVzZXQgdGhlIHZhbHVlXG4gICAgICAgIHRoaXMuZ2V0U2VhcmNoSW5wdXQoKS52YWx1ZSA9ICcnXG4gICAgICAgIC8vIHNob3cgYWxsIGl0ZW1zXG4gICAgICAgIHRoaXMuc2hvd0l0ZW1zKClcbiAgICAgIH1cbiAgICB9XG5cbiAgICBzdGF0aWMgX0RPTUludGVyZmFjZShvcHRpb25zKSB7XG4gICAgICByZXR1cm4gbmV3IERyb3Bkb3duU2VhcmNoKG9wdGlvbnMpXG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgKiBET00gQXBpIGltcGxlbWVudGF0aW9uXG4gICAqIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgKi9cbiAgY29uc3QgY29tcG9uZW50cyA9IFtdXG4gIGNvbnN0IGRyb3Bkb3ducyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoYC4ke05BTUV9YClcblxuICBpZiAoZHJvcGRvd25zKSB7XG4gICAgQXJyYXkuZnJvbShkcm9wZG93bnMpLmZvckVhY2goKGVsZW1lbnQpID0+IHtcbiAgICAgIGNvbnN0IGNvbmZpZyA9IGdldEF0dHJpYnV0ZXNDb25maWcoZWxlbWVudCwgREVGQVVMVF9QUk9QRVJUSUVTLCBEQVRBX0FUVFJTX1BST1BFUlRJRVMpXG4gICAgICBjb25maWcuZWxlbWVudCA9IGVsZW1lbnRcblxuICAgICAgaWYgKGNvbmZpZy5zZWFyY2gpIHtcbiAgICAgICAgLy8gc2VhcmNoXG4gICAgICAgIGNvbXBvbmVudHMucHVzaChuZXcgRHJvcGRvd25TZWFyY2goY29uZmlnKSlcbiAgICAgIH1cbiAgICB9KVxuICB9XG5cbiAgaWYgKGRyb3Bkb3ducykge1xuICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKGV2ZW50KSA9PiB7XG4gICAgICBjb25zdCBkcm9wZG93bk1lbnUgPSBmaW5kVGFyZ2V0QnlDbGFzcyhldmVudC50YXJnZXQsICdkcm9wZG93bi1tZW51JylcbiAgICAgIGlmIChkcm9wZG93bk1lbnUpIHtcbiAgICAgICAgcmV0dXJuXG4gICAgICB9XG5cbiAgICAgIGNvbnN0IGRyb3Bkb3duID0gZmluZFRhcmdldEJ5Q2xhc3MoZXZlbnQudGFyZ2V0LCAnZHJvcGRvd24nKVxuXG4gICAgICBpZiAoZHJvcGRvd24pIHtcbiAgICAgICAgY29uc3QgZGF0YVRvZ2dsZUF0dHIgPSBkcm9wZG93bi5nZXRBdHRyaWJ1dGUoJ2RhdGEtdG9nZ2xlJylcbiAgICAgICAgaWYgKGRhdGFUb2dnbGVBdHRyICYmIGRhdGFUb2dnbGVBdHRyID09PSBOQU1FICYmIGRyb3Bkb3duKSB7XG4gICAgICAgICAgY29uc3QgY29tcG9uZW50ID0gY29tcG9uZW50cy5maW5kKGMgPT4gYy5nZXRFbGVtZW50KCkgPT09IGRyb3Bkb3duKVxuXG4gICAgICAgICAgaWYgKCFjb21wb25lbnQpIHtcbiAgICAgICAgICAgIHJldHVyblxuICAgICAgICAgIH1cblxuICAgICAgICAgIGNvbXBvbmVudC50b2dnbGUoKVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfSlcbiAgfVxuXG4gIHJldHVybiBEcm9wZG93blNlYXJjaFxufSkoKVxuXG5leHBvcnQgZGVmYXVsdCBEcm9wZG93blNlYXJjaFxuIiwiLyoqXG4gKiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICogTGljZW5zZWQgdW5kZXIgTUlUIChodHRwczovL2dpdGh1Yi5jb20vcXVhcmstZGV2L1Bob25vbi1GcmFtZXdvcmsvYmxvYi9tYXN0ZXIvTElDRU5TRSlcbiAqIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gKi9cbmltcG9ydCBDb21wb25lbnQgZnJvbSAnLi4vY29tcG9uZW50J1xuXG5jb25zdCBMb2FkZXIgPSAoKCkgPT4ge1xuICAvKipcbiAgICogLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAqIENvbnN0YW50c1xuICAgKiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICovXG5cbiAgY29uc3QgTkFNRSA9ICdsb2FkZXInXG4gIGNvbnN0IFZFUlNJT04gPSAnMi4wLjAnXG4gIGNvbnN0IERFRkFVTFRfUFJPUEVSVElFUyA9IHtcbiAgICBlbGVtZW50OiBudWxsLFxuICAgIGNvbG9yOiBudWxsLFxuICAgIHNpemU6IG51bGwsXG4gIH1cbiAgY29uc3QgREFUQV9BVFRSU19QUk9QRVJUSUVTID0gW11cblxuICAvKipcbiAgICogLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAqIENsYXNzIERlZmluaXRpb25cbiAgICogLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAqL1xuXG4gIGNsYXNzIExvYWRlciBleHRlbmRzIENvbXBvbmVudCB7XG5cbiAgICBjb25zdHJ1Y3RvcihvcHRpb25zID0ge30pIHtcbiAgICAgIHN1cGVyKE5BTUUsIFZFUlNJT04sIERFRkFVTFRfUFJPUEVSVElFUywgb3B0aW9ucywgREFUQV9BVFRSU19QUk9QRVJUSUVTLCBmYWxzZSwgZmFsc2UpXG5cbiAgICAgIC8vIHNldCBjb2xvclxuICAgICAgY29uc3QgbG9hZGVyU3Bpbm5lciA9IHRoaXMuZ2V0U3Bpbm5lcigpXG4gICAgICBpZiAodHlwZW9mIHRoaXMub3B0aW9ucy5jb2xvciA9PT0gJ3N0cmluZydcbiAgICAgICAgJiYgIWxvYWRlclNwaW5uZXIuY2xhc3NMaXN0LmNvbnRhaW5zKGBjb2xvci0ke3RoaXMub3B0aW9ucy5jb2xvcn1gKSkge1xuICAgICAgICBsb2FkZXJTcGlubmVyLmNsYXNzTGlzdC5hZGQoYGNvbG9yLSR7dGhpcy5vcHRpb25zLmNvbG9yfWApXG4gICAgICB9XG5cbiAgICAgIHRoaXMuY3VzdG9tU2l6ZSA9IHRoaXMub3B0aW9ucy5zaXplICE9PSBudWxsXG4gICAgfVxuXG4gICAgZ2V0Q2xpZW50U2l6ZSgpIHtcbiAgICAgIGlmICghdGhpcy5jdXN0b21TaXplKSB7XG4gICAgICAgIGNvbnN0IHNpemUgPSB0aGlzLm9wdGlvbnMuZWxlbWVudC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKSAgICAgICAgXG4gICAgICAgIHJldHVybiBzaXplLmhlaWdodFxuICAgICAgfVxuXG4gICAgICByZXR1cm4gdGhpcy5vcHRpb25zLnNpemVcbiAgICB9XG5cbiAgICBnZXRTcGlubmVyKCkge1xuICAgICAgcmV0dXJuIHRoaXMub3B0aW9ucy5lbGVtZW50LnF1ZXJ5U2VsZWN0b3IoJy5sb2FkZXItc3Bpbm5lcicpXG4gICAgfVxuXG4gICAgc2hvdygpIHtcbiAgICAgIGlmICh0aGlzLm9wdGlvbnMuZWxlbWVudC5jbGFzc0xpc3QuY29udGFpbnMoJ2hpZGUnKSkge1xuICAgICAgICB0aGlzLm9wdGlvbnMuZWxlbWVudC5jbGFzc0xpc3QucmVtb3ZlKCdoaWRlJylcbiAgICAgIH1cblxuICAgICAgY29uc3Qgc2l6ZSA9IHRoaXMuZ2V0Q2xpZW50U2l6ZSgpXG4gICAgICB0aGlzLm9wdGlvbnMuc2l6ZSA9IHNpemVcblxuICAgICAgaWYgKHRoaXMuY3VzdG9tU2l6ZSkge1xuICAgICAgICB0aGlzLm9wdGlvbnMuZWxlbWVudC5zdHlsZS53aWR0aCA9IGAke3RoaXMub3B0aW9ucy5zaXplfXB4YFxuICAgICAgICB0aGlzLm9wdGlvbnMuZWxlbWVudC5zdHlsZS5oZWlnaHQgPSBgJHt0aGlzLm9wdGlvbnMuc2l6ZX1weGBcblxuICAgICAgICBjb25zdCBsb2FkZXJTcGlubmVyID0gdGhpcy5nZXRTcGlubmVyKClcbiAgICAgICAgbG9hZGVyU3Bpbm5lci5zdHlsZS53aWR0aCA9IGAke3RoaXMub3B0aW9ucy5zaXplfXB4YFxuICAgICAgICBsb2FkZXJTcGlubmVyLnN0eWxlLmhlaWdodCA9IGAke3RoaXMub3B0aW9ucy5zaXplfXB4YFxuICAgICAgfVxuXG4gICAgICByZXR1cm4gdHJ1ZVxuICAgIH1cblxuICAgIGFuaW1hdGUoc3RhcnRBbmltYXRpb24gPSB0cnVlKSB7XG4gICAgICBpZiAoc3RhcnRBbmltYXRpb24pIHtcbiAgICAgICAgdGhpcy5zaG93KClcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMuaGlkZSgpXG4gICAgICB9XG5cbiAgICAgIGNvbnN0IGxvYWRlclNwaW5uZXIgPSB0aGlzLmdldFNwaW5uZXIoKVxuXG4gICAgICBpZiAoc3RhcnRBbmltYXRpb24gJiZcbiAgICAgICAgIWxvYWRlclNwaW5uZXIuY2xhc3NMaXN0LmNvbnRhaW5zKCdsb2FkZXItc3Bpbm5lci1hbmltYXRlZCcpKSB7XG4gICAgICAgIGxvYWRlclNwaW5uZXIuY2xhc3NMaXN0LmFkZCgnbG9hZGVyLXNwaW5uZXItYW5pbWF0ZWQnKVxuICAgICAgICByZXR1cm4gdHJ1ZVxuICAgICAgfVxuXG4gICAgICBpZiAoIXN0YXJ0QW5pbWF0aW9uICYmXG4gICAgICAgIGxvYWRlclNwaW5uZXIuY2xhc3NMaXN0LmNvbnRhaW5zKCdsb2FkZXItc3Bpbm5lci1hbmltYXRlZCcpKSB7XG4gICAgICAgIGxvYWRlclNwaW5uZXIuY2xhc3NMaXN0LnJlbW92ZSgnbG9hZGVyLXNwaW5uZXItYW5pbWF0ZWQnKVxuICAgICAgfVxuXG4gICAgICByZXR1cm4gdHJ1ZVxuICAgIH1cblxuICAgIGhpZGUoKSB7XG4gICAgICBpZiAoIXRoaXMub3B0aW9ucy5lbGVtZW50LmNsYXNzTGlzdC5jb250YWlucygnaGlkZScpKSB7XG4gICAgICAgIHRoaXMub3B0aW9ucy5lbGVtZW50LmNsYXNzTGlzdC5hZGQoJ2hpZGUnKVxuICAgICAgfVxuXG4gICAgICByZXR1cm4gdHJ1ZVxuICAgIH1cblxuICAgIHN0YXRpYyBpZGVudGlmaWVyKCkge1xuICAgICAgcmV0dXJuIE5BTUVcbiAgICB9XG5cbiAgICBzdGF0aWMgX0RPTUludGVyZmFjZShvcHRpb25zKSB7XG4gICAgICByZXR1cm4gc3VwZXIuX0RPTUludGVyZmFjZShMb2FkZXIsIG9wdGlvbnMpXG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIExvYWRlclxufSkoKVxuXG5leHBvcnQgZGVmYXVsdCBMb2FkZXJcbiIsIi8qKlxuKiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuKiBMaWNlbnNlZCB1bmRlciBNSVQgKGh0dHBzOi8vZ2l0aHViLmNvbS9xdWFyay1kZXYvUGhvbm9uLUZyYW1ld29yay9ibG9iL21hc3Rlci9MSUNFTlNFKVxuKiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuKi9cbmltcG9ydCBFdmVudCBmcm9tICcuLi8uLi9jb21tb24vZXZlbnRzJ1xuaW1wb3J0IENvbXBvbmVudCBmcm9tICcuLi9jb21wb25lbnQnXG5cbmNvbnN0IE5vdGlmaWNhdGlvbiA9ICgoKSA9PiB7XG4gIC8qKlxuICAgKiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgKiBDb25zdGFudHNcbiAgKiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgKi9cblxuICBjb25zdCBOQU1FID0gJ25vdGlmaWNhdGlvbidcbiAgY29uc3QgVkVSU0lPTiA9ICcyLjAuMCdcbiAgY29uc3QgREVGQVVMVF9QUk9QRVJUSUVTID0ge1xuICAgIGVsZW1lbnQ6IG51bGwsXG4gICAgbWVzc2FnZTogJycsXG4gICAgc2hvd0J1dHRvbjogdHJ1ZSxcbiAgICB0aW1lb3V0OiBudWxsLFxuICAgIGJhY2tncm91bmQ6ICdwcmltYXJ5JyxcbiAgfVxuICBjb25zdCBEQVRBX0FUVFJTX1BST1BFUlRJRVMgPSBbXG4gICAgJ3RpbWVvdXQnLFxuICBdXG5cbiAgLyoqXG4gICAqIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgKiBDbGFzcyBEZWZpbml0aW9uXG4gICAqIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgKi9cblxuICBjbGFzcyBOb3RpZmljYXRpb24gZXh0ZW5kcyBDb21wb25lbnQge1xuXG4gICAgY29uc3RydWN0b3Iob3B0aW9ucyA9IHt9KSB7XG4gICAgICBzdXBlcihOQU1FLCBWRVJTSU9OLCBERUZBVUxUX1BST1BFUlRJRVMsIG9wdGlvbnMsIERBVEFfQVRUUlNfUFJPUEVSVElFUywgdHJ1ZSwgZmFsc2UpXG5cbiAgICAgIHRoaXMudGVtcGxhdGUgPSAnJyArXG4gICAgICAnPGRpdiBjbGFzcz1cIm5vdGlmaWNhdGlvblwiPicgK1xuICAgICAgICAnPGRpdiBjbGFzcz1cIm5vdGlmaWNhdGlvbi1pbm5lclwiPicgK1xuICAgICAgICAgICc8ZGl2IGNsYXNzPVwibWVzc2FnZVwiPjwvZGl2PicgK1xuICAgICAgICAgICc8YnV0dG9uIHR5cGU9XCJidXR0b25cIiBjbGFzcz1cImNsb3NlXCIgZGF0YS1kaXNtaXNzPVwibm90aWZpY2F0aW9uXCIgYXJpYS1sYWJlbD1cIkNsb3NlXCI+JyArXG4gICAgICAgICAgICAnPHNwYW4gYXJpYS1oaWRkZW49XCJ0cnVlXCI+JnRpbWVzOzwvc3Bhbj4nICtcbiAgICAgICAgICAnPC9idXR0b24+JyArXG4gICAgICAgICc8L2Rpdj4nICtcbiAgICAgICc8L2Rpdj4nXG5cbiAgICAgIGlmICh0aGlzLmR5bmFtaWNFbGVtZW50KSB7XG4gICAgICAgIHRoaXMuYnVpbGQoKVxuICAgICAgfVxuXG4gICAgICB0aGlzLnRpbWVvdXRDYWxsYmFjayA9IG51bGxcbiAgICB9XG5cbiAgICBidWlsZCgpIHtcbiAgICAgIGNvbnN0IGJ1aWxkZXIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKVxuXG4gICAgICBidWlsZGVyLmlubmVySFRNTCA9IHRoaXMudGVtcGxhdGVcblxuICAgICAgdGhpcy5vcHRpb25zLmVsZW1lbnQgPSBidWlsZGVyLmZpcnN0Q2hpbGRcblxuICAgICAgLy8gdGV4dCBtZXNzYWdlXG4gICAgICB0aGlzLm9wdGlvbnMuZWxlbWVudC5xdWVyeVNlbGVjdG9yKCcubWVzc2FnZScpLmlubmVySFRNTCA9IHRoaXMub3B0aW9ucy5tZXNzYWdlXG5cbiAgICAgIGlmICghdGhpcy5vcHRpb25zLnNob3dCdXR0b24pIHtcbiAgICAgICAgdGhpcy5vcHRpb25zLmVsZW1lbnQucXVlcnlTZWxlY3RvcignYnV0dG9uJykuc3R5bGUuZGlzcGxheSA9ICdub25lJ1xuICAgICAgfVxuXG4gICAgICBkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKHRoaXMub3B0aW9ucy5lbGVtZW50KVxuXG4gICAgICB0aGlzLnNldEF0dHJpYnV0ZXMoKVxuICAgIH1cblxuICAgIHNob3coKSB7XG4gICAgICBpZiAodGhpcy5vcHRpb25zLmVsZW1lbnQgPT09IG51bGwpIHtcbiAgICAgICAgLy8gYnVpbGQgYW5kIGluc2VydCBhIG5ldyBET00gZWxlbWVudFxuICAgICAgICB0aGlzLmJ1aWxkKClcbiAgICAgIH1cblxuICAgICAgaWYgKHRoaXMub3B0aW9ucy5lbGVtZW50LmNsYXNzTGlzdC5jb250YWlucygnc2hvdycpKSB7XG4gICAgICAgIHJldHVybiBmYWxzZVxuICAgICAgfVxuXG4gICAgICAvLyByZXNldCBjb2xvclxuICAgICAgaWYgKHRoaXMub3B0aW9ucy5iYWNrZ3JvdW5kKSB7XG4gICAgICAgIHRoaXMub3B0aW9ucy5lbGVtZW50LnJlbW92ZUF0dHJpYnV0ZSgnY2xhc3MnKVxuICAgICAgICB0aGlzLm9wdGlvbnMuZWxlbWVudC5zZXRBdHRyaWJ1dGUoJ2NsYXNzJywgJ25vdGlmaWNhdGlvbicpXG5cbiAgICAgICAgdGhpcy5vcHRpb25zLmVsZW1lbnQuY2xhc3NMaXN0LmFkZChgYmctJHt0aGlzLm9wdGlvbnMuYmFja2dyb3VuZH1gKVxuICAgICAgICB0aGlzLm9wdGlvbnMuZWxlbWVudC5xdWVyeVNlbGVjdG9yKCdidXR0b24nKS5jbGFzc0xpc3QuYWRkKGBidG4tJHt0aGlzLm9wdGlvbnMuYmFja2dyb3VuZH1gKVxuICAgICAgfVxuXG4gICAgICBpZiAodGhpcy5vcHRpb25zLnNob3dCdXR0b24pIHtcbiAgICAgICAgLy8gYXR0YWNoIHRoZSBidXR0b24gaGFuZGxlclxuICAgICAgICBjb25zdCBidXR0b25FbGVtZW50ID0gdGhpcy5vcHRpb25zLmVsZW1lbnQucXVlcnlTZWxlY3RvcignYnV0dG9uJylcbiAgICAgICAgdGhpcy5yZWdpc3RlckVsZW1lbnQoeyB0YXJnZXQ6IGJ1dHRvbkVsZW1lbnQsIGV2ZW50OiAnY2xpY2snIH0pXG4gICAgICB9XG5cbiAgICAgIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgICB0aGlzLm9wdGlvbnMuZWxlbWVudC5jbGFzc0xpc3QuYWRkKCdzaG93JylcblxuICAgICAgICAvLyBzZXQgcG9zaXRpb25cbiAgICAgICAgY29uc3QgYWN0aXZlTm90aWZpY2F0aW9ucyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJy5ub3RpZmljYXRpb24uc2hvdycpIHx8IFtdXG4gICAgICAgIGxldCBwdXNoRGlzdGFuY2UgPSAwXG4gICAgICAgIGFjdGl2ZU5vdGlmaWNhdGlvbnMuZm9yRWFjaCgobm90aWZpY2F0aW9uKSA9PiB7XG4gICAgICAgICAgaWYgKHRoaXMub3B0aW9ucy5lbGVtZW50ICE9PSBub3RpZmljYXRpb24pIHtcbiAgICAgICAgICAgIGNvbnN0IHN0eWxlID0gZ2V0Q29tcHV0ZWRTdHlsZShub3RpZmljYXRpb24pXG4gICAgICAgICAgICBwdXNoRGlzdGFuY2UgKz0gbm90aWZpY2F0aW9uLm9mZnNldEhlaWdodCArIHBhcnNlSW50KHN0eWxlLm1hcmdpbkJvdHRvbSwgMTApXG4gICAgICAgICAgfVxuICAgICAgICB9KVxuXG4gICAgICAgIHRoaXMub3B0aW9ucy5lbGVtZW50LnN0eWxlLnRyYW5zZm9ybSA9IGB0cmFuc2xhdGVZKCR7cHVzaERpc3RhbmNlfXB4KWBcblxuICAgICAgICB0aGlzLnRyaWdnZXJFdmVudChFdmVudC5TSE9XKVxuXG4gICAgICAgIGNvbnN0IG9uU2hvd24gPSAoKSA9PiB7XG4gICAgICAgICAgdGhpcy50cmlnZ2VyRXZlbnQoRXZlbnQuU0hPV04pXG4gICAgICAgICAgdGhpcy5vcHRpb25zLmVsZW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcihFdmVudC5UUkFOU0lUSU9OX0VORCwgb25TaG93bilcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMub3B0aW9ucy5lbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIoRXZlbnQuVFJBTlNJVElPTl9FTkQsIG9uU2hvd24pXG5cbiAgICAgIH0sIDEpXG5cbiAgICAgIGlmIChOdW1iZXIuaXNJbnRlZ2VyKHRoaXMub3B0aW9ucy50aW1lb3V0KSAmJiB0aGlzLm9wdGlvbnMudGltZW91dCA+IDApIHtcbiAgICAgICAgLy8gaWYgdGhlcmUgaXMgYSB0aW1lb3V0LCBhdXRvIGhpZGUgdGhlIG5vdGlmaWNhdGlvblxuICAgICAgICB0aGlzLnRpbWVvdXRDYWxsYmFjayA9IHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgICAgIHRoaXMuaGlkZSgpXG4gICAgICAgIH0sIHRoaXMub3B0aW9ucy50aW1lb3V0ICsgMSlcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIHRydWVcbiAgICB9XG5cbiAgICBoaWRlKCkge1xuICAgICAgLypcbiAgICAgICAqIHByZXZlbnQgdG8gY2xvc2UgYSBub3RpZmljYXRpb24gd2l0aCBhIHRpbWVvdXRcbiAgICAgICAqIGlmIHRoZSB1c2VyIGhhcyBhbHJlYWR5IGNsaWNrZWQgb24gdGhlIGJ1dHRvblxuICAgICAgICovXG4gICAgICBpZiAodGhpcy50aW1lb3V0Q2FsbGJhY2spIHtcbiAgICAgICAgY2xlYXJUaW1lb3V0KHRoaXMudGltZW91dENhbGxiYWNrKVxuICAgICAgICB0aGlzLnRpbWVvdXRDYWxsYmFjayA9IG51bGxcbiAgICAgIH1cblxuICAgICAgaWYgKCF0aGlzLm9wdGlvbnMuZWxlbWVudC5jbGFzc0xpc3QuY29udGFpbnMoJ3Nob3cnKSkge1xuICAgICAgICByZXR1cm4gZmFsc2VcbiAgICAgIH1cblxuICAgICAgdGhpcy50cmlnZ2VyRXZlbnQoRXZlbnQuSElERSlcblxuICAgICAgaWYgKHRoaXMub3B0aW9ucy5zaG93QnV0dG9uKSB7XG4gICAgICAgIGNvbnN0IGJ1dHRvbkVsZW1lbnQgPSB0aGlzLm9wdGlvbnMuZWxlbWVudC5xdWVyeVNlbGVjdG9yKCdidXR0b24nKVxuICAgICAgICB0aGlzLnVucmVnaXN0ZXJFbGVtZW50KHsgdGFyZ2V0OiBidXR0b25FbGVtZW50LCBldmVudDogJ2NsaWNrJyB9KVxuICAgICAgfVxuXG4gICAgICB0aGlzLm9wdGlvbnMuZWxlbWVudC5jbGFzc0xpc3QucmVtb3ZlKCdzaG93JylcbiAgICAgIHRoaXMub3B0aW9ucy5lbGVtZW50LmNsYXNzTGlzdC5hZGQoJ2hpZGUnKVxuXG4gICAgICBjb25zdCBvbkhpZGRlbiA9ICgpID0+IHtcbiAgICAgICAgdGhpcy5vcHRpb25zLmVsZW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcihFdmVudC5UUkFOU0lUSU9OX0VORCwgb25IaWRkZW4pXG4gICAgICAgIHRoaXMub3B0aW9ucy5lbGVtZW50LmNsYXNzTGlzdC5yZW1vdmUoJ2hpZGUnKVxuXG4gICAgICAgIHRoaXMudHJpZ2dlckV2ZW50KEV2ZW50LkhJRERFTilcblxuICAgICAgICBpZiAodGhpcy5keW5hbWljRWxlbWVudCkge1xuICAgICAgICAgIGRvY3VtZW50LmJvZHkucmVtb3ZlQ2hpbGQodGhpcy5vcHRpb25zLmVsZW1lbnQpXG4gICAgICAgICAgdGhpcy5vcHRpb25zLmVsZW1lbnQgPSBudWxsXG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgdGhpcy5vcHRpb25zLmVsZW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihFdmVudC5UUkFOU0lUSU9OX0VORCwgb25IaWRkZW4pXG5cbiAgICAgIHJldHVybiB0cnVlXG4gICAgfVxuXG4gICAgb25FbGVtZW50RXZlbnQoKSB7XG4gICAgICB0aGlzLmhpZGUoKVxuICAgIH1cblxuICAgIHN0YXRpYyBpZGVudGlmaWVyKCkge1xuICAgICAgcmV0dXJuIE5BTUVcbiAgICB9XG5cbiAgICBzdGF0aWMgX0RPTUludGVyZmFjZShvcHRpb25zKSB7XG4gICAgICByZXR1cm4gc3VwZXIuX0RPTUludGVyZmFjZShOb3RpZmljYXRpb24sIG9wdGlvbnMpXG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIE5vdGlmaWNhdGlvblxufSkoKVxuXG5leHBvcnQgZGVmYXVsdCBOb3RpZmljYXRpb25cbiIsIi8qKlxuICogLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAqIExpY2Vuc2VkIHVuZGVyIE1JVCAoaHR0cHM6Ly9naXRodWIuY29tL3F1YXJrLWRldi9QaG9ub24tRnJhbWV3b3JrL2Jsb2IvbWFzdGVyL0xJQ0VOU0UpXG4gKiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICovXG5pbXBvcnQgRXZlbnQgZnJvbSAnLi4vLi4vY29tbW9uL2V2ZW50cydcbmltcG9ydCBDb21wb25lbnQgZnJvbSAnLi4vY29tcG9uZW50J1xuaW1wb3J0IHsgZ2V0QXR0cmlidXRlc0NvbmZpZyB9IGZyb20gJy4uL2NvbXBvbmVudE1hbmFnZXInXG5pbXBvcnQgeyBmaW5kVGFyZ2V0QnlBdHRyIH0gZnJvbSAnLi4vLi4vY29tbW9uL3V0aWxzJ1xuXG5jb25zdCBPZmZDYW52YXMgPSAoKCkgPT4ge1xuICAvKipcbiAgICogLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAqIENvbnN0YW50c1xuICAgKiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICovXG5cbiAgY29uc3QgTkFNRSA9ICdvZmYtY2FudmFzJ1xuICBjb25zdCBWRVJTSU9OID0gJzIuMC4wJ1xuICBjb25zdCBCQUNLRFJPUF9TRUxFQ1RPUiA9ICdvZmYtY2FudmFzLWJhY2tkcm9wJ1xuICBjb25zdCBERUZBVUxUX1BST1BFUlRJRVMgPSB7XG4gICAgZWxlbWVudDogbnVsbCxcbiAgICBhc2lkZToge1xuICAgICAgbWQ6IGZhbHNlLFxuICAgICAgbGc6IGZhbHNlLFxuICAgICAgeGw6IGZhbHNlLFxuICAgIH0sXG4gIH1cbiAgY29uc3QgREFUQV9BVFRSU19QUk9QRVJUSUVTID0gW1xuICAgICdhc2lkZScsXG4gIF1cblxuICAvKipcbiAgICogLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAqIENsYXNzIERlZmluaXRpb25cbiAgICogLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAqL1xuXG4gIGNsYXNzIE9mZkNhbnZhcyBleHRlbmRzIENvbXBvbmVudCB7XG5cbiAgICBjb25zdHJ1Y3RvcihvcHRpb25zID0ge30pIHtcbiAgICAgIHN1cGVyKE5BTUUsIFZFUlNJT04sIERFRkFVTFRfUFJPUEVSVElFUywgb3B0aW9ucywgREFUQV9BVFRSU19QUk9QRVJUSUVTLCBmYWxzZSwgdHJ1ZSlcblxuICAgICAgdGhpcy51c2VCYWNrZHJvcCA9IHRydWVcbiAgICAgIHRoaXMuY3VycmVudFdpZHRoID0gbnVsbFxuICAgICAgdGhpcy5hbmltYXRlID0gdHJ1ZVxuXG4gICAgICB0aGlzLmRpcmVjdGlvbnMgPSBbJ2xlZnQnLCAncmlnaHQnXVxuXG4gICAgICBjb25zdCBzbSA9IHsgbmFtZTogJ3NtJywgbWVkaWE6IHdpbmRvdy5tYXRjaE1lZGlhKCcobWluLXdpZHRoOiAxcHgpJykgfVxuICAgICAgY29uc3QgbWQgPSB7IG5hbWU6ICdtZCcsIG1lZGlhOiB3aW5kb3cubWF0Y2hNZWRpYSgnKG1pbi13aWR0aDogNzY4cHgpJykgfVxuICAgICAgY29uc3QgbGcgPSB7IG5hbWU6ICdsZycsIG1lZGlhOiB3aW5kb3cubWF0Y2hNZWRpYSgnKG1pbi13aWR0aDogOTkycHgpJykgfVxuICAgICAgY29uc3QgeGwgPSB7IG5hbWU6ICd4bCcsIG1lZGlhOiB3aW5kb3cubWF0Y2hNZWRpYSgnKG1pbi13aWR0aDogMTIwMHB4KScpIH1cblxuICAgICAgdGhpcy5zaXplcyA9IFtzbSwgbWQsIGxnLCB4bF0ucmV2ZXJzZSgpXG5cbiAgICAgIHRoaXMuY2hlY2tEaXJlY3Rpb24oKVxuICAgICAgdGhpcy5jaGVja1dpZHRoKClcblxuICAgICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ3Jlc2l6ZScsICgpID0+IHRoaXMuY2hlY2tXaWR0aCgpLCBmYWxzZSkgICAgICBcbiAgICB9XG5cbiAgICBjaGVja0RpcmVjdGlvbigpIHtcbiAgICAgIHRoaXMuZGlyZWN0aW9ucy5ldmVyeSgoZGlyZWN0aW9uKSA9PiB7XG4gICAgICAgIGlmICh0aGlzLm9wdGlvbnMuZWxlbWVudC5jbGFzc0xpc3QuY29udGFpbnMoYG9mZi1jYW52YXMtJHtkaXJlY3Rpb259YCkpIHtcbiAgICAgICAgICB0aGlzLmRpcmVjdGlvbiA9IGRpcmVjdGlvblxuICAgICAgICAgIHJldHVybiBmYWxzZVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0cnVlXG4gICAgICB9KVxuICAgIH1cblxuICAgIGNoZWNrV2lkdGgoKSB7XG4gICAgICBpZiAoISgnbWF0Y2hNZWRpYScgaW4gd2luZG93KSkge1xuICAgICAgICByZXR1cm5cbiAgICAgIH1cblxuICAgICAgdGhpcy5zaXplcy5ldmVyeSgoc2l6ZSkgPT4ge1xuICAgICAgICBjb25zdCBtYXRjaCA9IHNpemUubWVkaWEubWVkaWEubWF0Y2goL1thLXpdPy13aWR0aDpcXHM/KFswLTldKykvKVxuXG4gICAgICAgIGlmIChtYXRjaCkge1xuICAgICAgICAgIGlmIChzaXplLm1lZGlhLm1hdGNoZXMpIHtcbiAgICAgICAgICAgIGlmICh0aGlzLmN1cnJlbnRXaWR0aCAhPT0gc2l6ZS5uYW1lKSB7XG4gICAgICAgICAgICAgIHRoaXMuc2V0QXNpZGUoc2l6ZS5uYW1lKVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdGhpcy5jdXJyZW50V2lkdGggPSBzaXplLm5hbWVcbiAgICAgICAgICAgIHJldHVybiBmYWxzZVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiB0cnVlXG4gICAgICB9KVxuICAgIH1cblxuICAgIHByZXZlbnRDbG9zYWJsZSgpIHtcbiAgICAgIHJldHVybiBzdXBlci5wcmV2ZW50Q2xvc2FibGUoKSB8fCB0aGlzLm9wdGlvbnMuYXNpZGVbdGhpcy5jdXJyZW50V2lkdGhdID09PSB0cnVlXG4gICAgfVxuXG4gICAgc2V0QXNpZGUobmFtZSkge1xuICAgICAgY29uc3QgY29udGVudCA9IGRvY3VtZW50LmJvZHlcblxuICAgICAgaWYgKHRoaXMub3B0aW9ucy5hc2lkZVtuYW1lXSA9PT0gdHJ1ZSkge1xuICAgICAgICBpZiAoIWNvbnRlbnQuY2xhc3NMaXN0LmNvbnRhaW5zKGBvZmYtY2FudmFzLWFzaWRlLSR7dGhpcy5kaXJlY3Rpb259YCkpIHtcbiAgICAgICAgICBjb250ZW50LmNsYXNzTGlzdC5hZGQoYG9mZi1jYW52YXMtYXNpZGUtJHt0aGlzLmRpcmVjdGlvbn1gKVxuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy51c2VCYWNrZHJvcCA9IGZhbHNlXG5cbiAgICAgICAgLy8gYXZvaWQgYW5pbWF0aW9uIGJ5IHNldHRpbmcgYW5pbWF0ZSB0byBmYWxzZVxuICAgICAgICB0aGlzLmFuaW1hdGUgPSBmYWxzZVxuICAgICAgICB0aGlzLnNob3coKVxuICAgICAgICAvLyByZW1vdmUgcHJldmlvdXMgYmFja2Ryb3BcbiAgICAgICAgdGhpcy5yZW1vdmVCYWNrZHJvcCgpXG4gICAgICB9IGVsc2Uge1xuICAgICAgICBpZiAoY29udGVudC5jbGFzc0xpc3QuY29udGFpbnMoYG9mZi1jYW52YXMtYXNpZGUtJHt0aGlzLmRpcmVjdGlvbn1gKSkge1xuICAgICAgICAgIGNvbnRlbnQuY2xhc3NMaXN0LnJlbW92ZShgb2ZmLWNhbnZhcy1hc2lkZS0ke3RoaXMuZGlyZWN0aW9ufWApXG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLmhpZGUoKVxuICAgICAgICB0aGlzLnVzZUJhY2tkcm9wID0gdHJ1ZVxuICAgICAgICB0aGlzLmFuaW1hdGUgPSB0cnVlXG4gICAgICB9XG4gICAgfVxuXG4gICAgb25FbGVtZW50RXZlbnQoZXZlbnQpIHtcbiAgICAgIGlmIChldmVudC50eXBlID09PSAna2V5dXAnICYmIGV2ZW50LmtleUNvZGUgIT09IDI3ICYmIGV2ZW50LmtleUNvZGUgIT09IDEzKSB7XG4gICAgICAgIHJldHVyblxuICAgICAgfVxuXG4gICAgICAvLyBoaWRlIHRoZSBvZmYtY2FudmFzXG4gICAgICB0aGlzLmhpZGUoKVxuICAgIH1cblxuICAgIHNob3coKSB7XG4gICAgICBpZiAodGhpcy5vcHRpb25zLmVsZW1lbnQuY2xhc3NMaXN0LmNvbnRhaW5zKCdzaG93JykpIHtcbiAgICAgICAgcmV0dXJuIGZhbHNlXG4gICAgICB9XG5cbiAgICAgIC8vIGFkZCBhIHRpbWVvdXQgc28gdGhhdCB0aGUgQ1NTIGFuaW1hdGlvbiB3b3Jrc1xuICAgICAgc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICAgIHRoaXMudHJpZ2dlckV2ZW50KEV2ZW50LlNIT1cpXG5cbiAgICAgICAgY29uc3Qgb25TaG93biA9ICgpID0+IHtcbiAgICAgICAgICB0aGlzLnRyaWdnZXJFdmVudChFdmVudC5TSE9XTilcblxuICAgICAgICAgIGlmICh0aGlzLmFuaW1hdGUpIHtcbiAgICAgICAgICAgIHRoaXMub3B0aW9ucy5lbGVtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoRXZlbnQuVFJBTlNJVElPTl9FTkQsIG9uU2hvd24pXG4gICAgICAgICAgICB0aGlzLm9wdGlvbnMuZWxlbWVudC5jbGFzc0xpc3QucmVtb3ZlKCdhbmltYXRlJylcbiAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBpZiAodGhpcy51c2VCYWNrZHJvcCkge1xuICAgICAgICAgIHRoaXMuY3JlYXRlQmFja2Ryb3AoKVxuICAgICAgICB9XG5cblxuICAgICAgICBpZiAodGhpcy5hbmltYXRlKSB7XG4gICAgICAgICAgdGhpcy5vcHRpb25zLmVsZW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihFdmVudC5UUkFOU0lUSU9OX0VORCwgb25TaG93bikgICAgICAgIFxuICAgICAgICAgIHRoaXMub3B0aW9ucy5lbGVtZW50LmNsYXNzTGlzdC5hZGQoJ2FuaW1hdGUnKVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIC8vIGRpcmVjdGx5IHRyaWdnZXIgdGhlIG9uU2hvd25cbiAgICAgICAgICBvblNob3duKClcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMub3B0aW9ucy5lbGVtZW50LmNsYXNzTGlzdC5hZGQoJ3Nob3cnKSAgICAgICAgXG5cbiAgICAgICAgLy8gYXR0YWNoIGV2ZW50XG4gICAgICAgIHRoaXMuYXR0YWNoRXZlbnRzKClcbiAgICAgIH0sIDEpXG5cbiAgICAgIHJldHVybiB0cnVlXG4gICAgfVxuXG4gICAgaGlkZSgpIHtcbiAgICAgIGlmICghdGhpcy5vcHRpb25zLmVsZW1lbnQuY2xhc3NMaXN0LmNvbnRhaW5zKCdzaG93JykpIHtcbiAgICAgICAgcmV0dXJuIGZhbHNlXG4gICAgICB9XG5cbiAgICAgIHRoaXMudHJpZ2dlckV2ZW50KEV2ZW50LkhJREUpXG5cbiAgICAgIHRoaXMuZGV0YWNoRXZlbnRzKClcblxuICAgICAgaWYgKHRoaXMuYW5pbWF0ZSkge1xuICAgICAgICB0aGlzLm9wdGlvbnMuZWxlbWVudC5jbGFzc0xpc3QuYWRkKCdhbmltYXRlJylcbiAgICAgIH1cblxuICAgICAgdGhpcy5vcHRpb25zLmVsZW1lbnQuY2xhc3NMaXN0LnJlbW92ZSgnc2hvdycpXG5cbiAgICAgIGlmICh0aGlzLnVzZUJhY2tkcm9wKSB7XG4gICAgICAgIGNvbnN0IGJhY2tkcm9wID0gdGhpcy5nZXRCYWNrZHJvcCgpXG5cbiAgICAgICAgY29uc3Qgb25IaWRkZW4gPSAoKSA9PiB7XG4gICAgICAgICAgaWYgKHRoaXMuYW5pbWF0ZSkge1xuICAgICAgICAgICAgdGhpcy5vcHRpb25zLmVsZW1lbnQuY2xhc3NMaXN0LnJlbW92ZSgnYW5pbWF0ZScpXG4gICAgICAgICAgfVxuXG4gICAgICAgICAgYmFja2Ryb3AucmVtb3ZlRXZlbnRMaXN0ZW5lcihFdmVudC5UUkFOU0lUSU9OX0VORCwgb25IaWRkZW4pXG4gICAgICAgICAgdGhpcy50cmlnZ2VyRXZlbnQoRXZlbnQuSElEREVOKSAgICAgICAgXG4gICAgICAgICAgdGhpcy5yZW1vdmVCYWNrZHJvcCgpXG4gICAgICAgIH1cblxuICAgICAgICBiYWNrZHJvcC5hZGRFdmVudExpc3RlbmVyKEV2ZW50LlRSQU5TSVRJT05fRU5ELCBvbkhpZGRlbilcbiAgICAgICAgYmFja2Ryb3AuY2xhc3NMaXN0LmFkZCgnZmFkZW91dCcpXG4gICAgICB9XG5cbiAgICAgIHJldHVybiB0cnVlXG4gICAgfVxuXG4gICAgY3JlYXRlQmFja2Ryb3AoKSB7XG4gICAgICBjb25zdCBiYWNrZHJvcCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpXG4gICAgICBiYWNrZHJvcC5zZXRBdHRyaWJ1dGUoJ2RhdGEtaWQnLCB0aGlzLmlkKVxuICAgICAgYmFja2Ryb3AuY2xhc3NMaXN0LmFkZChCQUNLRFJPUF9TRUxFQ1RPUilcblxuICAgICAgZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZChiYWNrZHJvcClcbiAgICB9XG5cbiAgICBnZXRCYWNrZHJvcCgpIHtcbiAgICAgIHJldHVybiBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKGAuJHtCQUNLRFJPUF9TRUxFQ1RPUn1bZGF0YS1pZD1cIiR7dGhpcy5pZH1cIl1gKVxuICAgIH1cblxuICAgIHJlbW92ZUJhY2tkcm9wKCkge1xuICAgICAgY29uc3QgYmFja2Ryb3AgPSB0aGlzLmdldEJhY2tkcm9wKClcbiAgICAgIGlmIChiYWNrZHJvcCkge1xuICAgICAgICBkb2N1bWVudC5ib2R5LnJlbW92ZUNoaWxkKGJhY2tkcm9wKVxuICAgICAgfVxuICAgIH1cblxuICAgIGF0dGFjaEV2ZW50cygpIHtcbiAgICAgIGNvbnN0IGRpc21pc3NCdXR0b25zID0gdGhpcy5vcHRpb25zLmVsZW1lbnQucXVlcnlTZWxlY3RvckFsbCgnW2RhdGEtZGlzbWlzc10nKVxuXG4gICAgICBpZiAoZGlzbWlzc0J1dHRvbnMpIHtcbiAgICAgICAgQXJyYXkuZnJvbShkaXNtaXNzQnV0dG9ucykuZm9yRWFjaChidXR0b24gPT4gdGhpcy5yZWdpc3RlckVsZW1lbnQoeyB0YXJnZXQ6IGJ1dHRvbiwgZXZlbnQ6ICdjbGljaycgfSkpXG4gICAgICB9XG5cbiAgICAgIGlmICh0aGlzLnVzZUJhY2tkcm9wKSB7XG4gICAgICAgIGNvbnN0IGJhY2tkcm9wID0gdGhpcy5nZXRCYWNrZHJvcCgpICAgICAgXG4gICAgICAgIHRoaXMucmVnaXN0ZXJFbGVtZW50KHsgdGFyZ2V0OiBiYWNrZHJvcCwgZXZlbnQ6IEV2ZW50LlNUQVJUIH0pXG4gICAgICB9XG5cbiAgICAgIHRoaXMucmVnaXN0ZXJFbGVtZW50KHsgdGFyZ2V0OiBkb2N1bWVudCwgZXZlbnQ6ICdrZXl1cCcgfSlcbiAgICB9XG5cbiAgICBkZXRhY2hFdmVudHMoKSB7XG4gICAgICBjb25zdCBkaXNtaXNzQnV0dG9ucyA9IHRoaXMub3B0aW9ucy5lbGVtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJ1tkYXRhLWRpc21pc3NdJylcblxuICAgICAgaWYgKGRpc21pc3NCdXR0b25zKSB7XG4gICAgICAgIEFycmF5LmZyb20oZGlzbWlzc0J1dHRvbnMpLmZvckVhY2goYnV0dG9uID0+IHRoaXMudW5yZWdpc3RlckVsZW1lbnQoeyB0YXJnZXQ6IGJ1dHRvbiwgZXZlbnQ6ICdjbGljaycgfSkpXG4gICAgICB9XG5cbiAgICAgIGlmICh0aGlzLnVzZUJhY2tkcm9wKSB7XG4gICAgICAgIGNvbnN0IGJhY2tkcm9wID0gdGhpcy5nZXRCYWNrZHJvcCgpXG4gICAgICAgIHRoaXMudW5yZWdpc3RlckVsZW1lbnQoeyB0YXJnZXQ6IGJhY2tkcm9wLCBldmVudDogRXZlbnQuU1RBUlQgfSlcbiAgICAgIH1cblxuICAgICAgdGhpcy51bnJlZ2lzdGVyRWxlbWVudCh7IHRhcmdldDogZG9jdW1lbnQsIGV2ZW50OiAna2V5dXAnIH0pXG4gICAgfVxuXG4gICAgc3RhdGljIGlkZW50aWZpZXIoKSB7XG4gICAgICByZXR1cm4gTkFNRVxuICAgIH1cblxuICAgIHN0YXRpYyBfRE9NSW50ZXJmYWNlKG9wdGlvbnMpIHtcbiAgICAgIHJldHVybiBzdXBlci5fRE9NSW50ZXJmYWNlKE9mZkNhbnZhcywgb3B0aW9ucylcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAqIERPTSBBcGkgaW1wbGVtZW50YXRpb25cbiAgICogLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAqL1xuICBjb25zdCBjb21wb25lbnRzID0gW11cblxuICBjb25zdCBvZmZDYW52YXMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKGAuJHtOQU1FfWApXG4gIGlmIChvZmZDYW52YXMpIHtcbiAgICBBcnJheS5mcm9tKG9mZkNhbnZhcykuZm9yRWFjaCgoZWxlbWVudCkgPT4ge1xuICAgICAgY29uc3QgY29uZmlnID0gZ2V0QXR0cmlidXRlc0NvbmZpZyhlbGVtZW50LCBERUZBVUxUX1BST1BFUlRJRVMsIERBVEFfQVRUUlNfUFJPUEVSVElFUylcbiAgICAgIGNvbmZpZy5lbGVtZW50ID0gZWxlbWVudFxuXG4gICAgICBjb21wb25lbnRzLnB1c2goeyBlbGVtZW50LCBvZmZDYW52YXM6IG5ldyBPZmZDYW52YXMoY29uZmlnKSB9KVxuICAgIH0pXG4gIH1cblxuICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIChldmVudCkgPT4ge1xuICAgIGNvbnN0IHRhcmdldCA9IGZpbmRUYXJnZXRCeUF0dHIoZXZlbnQudGFyZ2V0LCAnZGF0YS10b2dnbGUnKVxuICAgIGlmICghdGFyZ2V0KSB7XG4gICAgICByZXR1cm5cbiAgICB9XG5cbiAgICBjb25zdCBkYXRhVG9nZ2xlQXR0ciA9IHRhcmdldC5nZXRBdHRyaWJ1dGUoJ2RhdGEtdG9nZ2xlJylcbiAgICBpZiAoZGF0YVRvZ2dsZUF0dHIgJiYgZGF0YVRvZ2dsZUF0dHIgPT09IE5BTUUpIHtcbiAgICAgIGNvbnN0IGlkID0gdGFyZ2V0LmdldEF0dHJpYnV0ZSgnZGF0YS10YXJnZXQnKVxuICAgICAgY29uc3QgZWxlbWVudCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoaWQpXG5cbiAgICAgIGNvbnN0IGNvbXBvbmVudCA9IGNvbXBvbmVudHMuZmluZChjID0+IGMuZWxlbWVudCA9PT0gZWxlbWVudClcblxuICAgICAgaWYgKCFjb21wb25lbnQpIHtcbiAgICAgICAgcmV0dXJuXG4gICAgICB9XG5cbiAgICAgIHRhcmdldC5ibHVyKClcblxuICAgICAgY29tcG9uZW50Lm9mZkNhbnZhcy5zaG93KClcbiAgICB9XG4gIH0pXG5cbiAgcmV0dXJuIE9mZkNhbnZhc1xufSkoKVxuXG5leHBvcnQgZGVmYXVsdCBPZmZDYW52YXNcbiIsIi8qKlxuICogLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAqIExpY2Vuc2VkIHVuZGVyIE1JVCAoaHR0cHM6Ly9naXRodWIuY29tL3F1YXJrLWRldi9QaG9ub24tRnJhbWV3b3JrL2Jsb2IvbWFzdGVyL0xJQ0VOU0UpXG4gKiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICovXG5pbXBvcnQgQ29tcG9uZW50IGZyb20gJy4uL2NvbXBvbmVudCdcbmltcG9ydCBFdmVudCBmcm9tICcuLi8uLi9jb21tb24vZXZlbnRzJ1xuXG5jb25zdCBQcm9ncmVzcyA9ICgoKSA9PiB7XG4gIC8qKlxuICAgKiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICogQ29uc3RhbnRzXG4gICAqIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgKi9cblxuICBjb25zdCBOQU1FID0gJ3Byb2dyZXNzJ1xuICBjb25zdCBWRVJTSU9OID0gJzIuMC4wJ1xuICBjb25zdCBERUZBVUxUX1BST1BFUlRJRVMgPSB7XG4gICAgZWxlbWVudDogbnVsbCxcbiAgICBoZWlnaHQ6IDUsXG4gICAgbWluOiAwLFxuICAgIG1heDogMTAwLFxuICAgIGxhYmVsOiBmYWxzZSxcbiAgICBzdHJpcGVkOiBmYWxzZSxcbiAgICBiYWNrZ3JvdW5kOiBudWxsLFxuICB9XG4gIGNvbnN0IERBVEFfQVRUUlNfUFJPUEVSVElFUyA9IFtcbiAgICAnaGVpZ2h0JyxcbiAgICAnbWluJyxcbiAgICAnbWF4JyxcbiAgICAnbGFiZWwnLFxuICAgICdzdHJpcGVkJyxcbiAgICAnYmFja2dyb3VuZCcsXG4gIF1cblxuICAvKipcbiAgICogLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAqIENsYXNzIERlZmluaXRpb25cbiAgICogLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAqL1xuXG4gIGNsYXNzIFByb2dyZXNzIGV4dGVuZHMgQ29tcG9uZW50IHtcblxuICAgIGNvbnN0cnVjdG9yKG9wdGlvbnMgPSB7fSkge1xuICAgICAgc3VwZXIoTkFNRSwgVkVSU0lPTiwgREVGQVVMVF9QUk9QRVJUSUVTLCBvcHRpb25zLCBEQVRBX0FUVFJTX1BST1BFUlRJRVMsIGZhbHNlLCBmYWxzZSlcblxuICAgICAgLy8gc2V0IHRoZSB3YW50ZWQgaGVpZ2h0XG4gICAgICB0aGlzLm9wdGlvbnMuZWxlbWVudC5zdHlsZS5oZWlnaHQgPSBgJHt0aGlzLm9wdGlvbnMuaGVpZ2h0fXB4YFxuXG4gICAgICAvLyBzZXQgbWluIGFuZCBtYXggdmFsdWVzXG4gICAgICBjb25zdCBwcm9ncmVzc0JhciA9IHRoaXMuZ2V0UHJvZ3Jlc3NCYXIoKVxuICAgICAgcHJvZ3Jlc3NCYXIuc2V0QXR0cmlidXRlKCdhcmlhLXZhbHVlbWluJywgYCR7dGhpcy5vcHRpb25zLm1pbn1gKVxuICAgICAgcHJvZ3Jlc3NCYXIuc2V0QXR0cmlidXRlKCdhcmlhLXZhbHVlbWF4JywgYCR7dGhpcy5vcHRpb25zLm1heH1gKVxuXG4gICAgICAvLyBzZXQgc3RyaXBlZFxuICAgICAgaWYgKHRoaXMub3B0aW9ucy5zdHJpcGVkXG4gICAgICAgICYmICFwcm9ncmVzc0Jhci5jbGFzc0xpc3QuY29udGFpbnMoJ3Byb2dyZXNzLWJhci1zdHJpcGVkJykpIHtcbiAgICAgICAgcHJvZ3Jlc3NCYXIuY2xhc3NMaXN0LmFkZCgncHJvZ3Jlc3MtYmFyLXN0cmlwZWQnKVxuICAgICAgfVxuXG4gICAgICAvLyBzZXQgYmFja2dyb3VuZFxuICAgICAgaWYgKHR5cGVvZiB0aGlzLm9wdGlvbnMuYmFja2dyb3VuZCA9PT0gJ3N0cmluZydcbiAgICAgICAgJiYgIXByb2dyZXNzQmFyLmNsYXNzTGlzdC5jb250YWlucyhgYmctJHt0aGlzLm9wdGlvbnMuYmFja2dyb3VuZH1gKSkge1xuICAgICAgICBwcm9ncmVzc0Jhci5jbGFzc0xpc3QuYWRkKGBiZy0ke3RoaXMub3B0aW9ucy5iYWNrZ3JvdW5kfWApXG4gICAgICB9XG4gICAgfVxuXG4gICAgZ2V0UHJvZ3Jlc3NCYXIoKSB7XG4gICAgICByZXR1cm4gdGhpcy5vcHRpb25zLmVsZW1lbnQucXVlcnlTZWxlY3RvcignLnByb2dyZXNzLWJhcicpXG4gICAgfVxuXG4gICAgc2V0KHZhbHVlID0gMCkge1xuICAgICAgY29uc3QgcHJvZ3Jlc3NCYXIgPSB0aGlzLmdldFByb2dyZXNzQmFyKClcbiAgICAgIGNvbnN0IHByb2dyZXNzID0gTWF0aC5yb3VuZCgodmFsdWUgLyAodGhpcy5vcHRpb25zLm1pbiArIHRoaXMub3B0aW9ucy5tYXgpKSAqIDEwMClcblxuICAgICAgaWYgKHZhbHVlIDwgdGhpcy5vcHRpb25zLm1pbikge1xuICAgICAgICBjb25zb2xlLmVycm9yKGAke05BTUV9LiBXYXJuaW5nLCAke3ZhbHVlfSBpcyB1bmRlciBtaW4gdmFsdWUuYClcbiAgICAgICAgcmV0dXJuIGZhbHNlXG4gICAgICB9XG5cbiAgICAgIGlmICh2YWx1ZSA+IHRoaXMub3B0aW9ucy5tYXgpIHtcbiAgICAgICAgY29uc29sZS5lcnJvcihgJHtOQU1FfS4gV2FybmluZywgJHt2YWx1ZX0gaXMgYWJvdmUgbWF4IHZhbHVlLmApICAgICAgICAgIFxuICAgICAgICByZXR1cm4gZmFsc2VcbiAgICAgIH1cblxuICAgICAgcHJvZ3Jlc3NCYXIuc2V0QXR0cmlidXRlKCdhcmlhLXZhbHVlbm93JywgYCR7dmFsdWV9YCkgICAgICBcblxuICAgICAgLy8gc2V0IGxhYmVsXG4gICAgICBpZiAodGhpcy5vcHRpb25zLmxhYmVsKSB7XG4gICAgICAgIHByb2dyZXNzQmFyLmlubmVySFRNTCA9IGAke3Byb2dyZXNzfSVgXG4gICAgICB9XG5cbiAgICAgIC8vIHNldCBwZXJjZW50YWdlXG4gICAgICBwcm9ncmVzc0Jhci5zdHlsZS53aWR0aCA9IGAke3Byb2dyZXNzfSVgXG5cbiAgICAgIHJldHVybiB0cnVlXG4gICAgfVxuXG4gICAgYW5pbWF0ZShzdGFydEFuaW1hdGlvbiA9IHRydWUpIHtcbiAgICAgIGlmICghdGhpcy5vcHRpb25zLnN0cmlwZWQpIHtcbiAgICAgICAgY29uc29sZS5lcnJvcihgJHtOQU1FfS4gQW5pbWF0aW9uIHdvcmtzIG9ubHkgd2l0aCBzdHJpcGVkIHByb2dyZXNzLmApXG4gICAgICAgIHJldHVybiBmYWxzZVxuICAgICAgfVxuXG4gICAgICBjb25zdCBwcm9ncmVzc0JhciA9IHRoaXMuZ2V0UHJvZ3Jlc3NCYXIoKVxuXG4gICAgICBpZiAoc3RhcnRBbmltYXRpb25cbiAgICAgICAgJiYgIXByb2dyZXNzQmFyLmNsYXNzTGlzdC5jb250YWlucygncHJvZ3Jlc3MtYmFyLWFuaW1hdGVkJykpIHtcbiAgICAgICAgcHJvZ3Jlc3NCYXIuY2xhc3NMaXN0LmFkZCgncHJvZ3Jlc3MtYmFyLWFuaW1hdGVkJylcbiAgICAgIH1cblxuICAgICAgaWYgKCFzdGFydEFuaW1hdGlvblxuICAgICAgICAmJiBwcm9ncmVzc0Jhci5jbGFzc0xpc3QuY29udGFpbnMoJ3Byb2dyZXNzLWJhci1hbmltYXRlZCcpKSB7XG4gICAgICAgIHByb2dyZXNzQmFyLmNsYXNzTGlzdC5yZW1vdmUoJ3Byb2dyZXNzLWJhci1hbmltYXRlZCcpXG4gICAgICB9XG5cbiAgICAgIHJldHVybiB0cnVlXG4gICAgfVxuXG4gICAgc2hvdygpIHtcbiAgICAgIHRoaXMub3B0aW9ucy5lbGVtZW50LnN0eWxlLmhlaWdodCA9IGAke3RoaXMub3B0aW9ucy5oZWlnaHR9cHhgXG4gICAgICB0aGlzLnRyaWdnZXJFdmVudChFdmVudC5TSE9XKVxuICAgICAgdGhpcy50cmlnZ2VyRXZlbnQoRXZlbnQuU0hPV04pXG5cbiAgICAgIHJldHVybiB0cnVlXG4gICAgfVxuXG4gICAgaGlkZSgpIHtcbiAgICAgIHRoaXMub3B0aW9ucy5lbGVtZW50LnN0eWxlLmhlaWdodCA9ICcwcHgnXG4gICAgICB0aGlzLnRyaWdnZXJFdmVudChFdmVudC5ISURFKVxuICAgICAgdGhpcy50cmlnZ2VyRXZlbnQoRXZlbnQuSElEREVOKVxuXG4gICAgICByZXR1cm4gdHJ1ZVxuICAgIH1cblxuICAgIHN0YXRpYyBpZGVudGlmaWVyKCkge1xuICAgICAgcmV0dXJuIE5BTUVcbiAgICB9XG5cbiAgICBzdGF0aWMgX0RPTUludGVyZmFjZShvcHRpb25zKSB7XG4gICAgICByZXR1cm4gc3VwZXIuX0RPTUludGVyZmFjZShQcm9ncmVzcywgb3B0aW9ucylcbiAgICB9XG4gIH1cblxuICByZXR1cm4gUHJvZ3Jlc3Ncbn0pKClcblxuZXhwb3J0IGRlZmF1bHQgUHJvZ3Jlc3NcbiIsIi8qKlxuICogLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAqIExpY2Vuc2VkIHVuZGVyIE1JVCAoaHR0cHM6Ly9naXRodWIuY29tL3F1YXJrLWRldi9QaG9ub24tRnJhbWV3b3JrL2Jsb2IvbWFzdGVyL0xJQ0VOU0UpXG4gKiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICovXG5pbXBvcnQgQ29tcG9uZW50IGZyb20gJy4uL2NvbXBvbmVudCdcbmltcG9ydCB7IGdldEF0dHJpYnV0ZXNDb25maWcgfSBmcm9tICcuLi9jb21wb25lbnRNYW5hZ2VyJ1xuaW1wb3J0IEV2ZW50IGZyb20gJy4uLy4uL2NvbW1vbi9ldmVudHMnXG5pbXBvcnQgeyBmaW5kVGFyZ2V0QnlDbGFzcyB9IGZyb20gJy4uLy4uL2NvbW1vbi91dGlscydcblxuY29uc3QgVGFiID0gKCgpID0+IHtcbiAgLyoqXG4gICAqIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgKiBDb25zdGFudHNcbiAgICogLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAqL1xuXG4gIGNvbnN0IE5BTUUgPSAndGFiJ1xuICBjb25zdCBWRVJTSU9OID0gJzIuMC4wJ1xuICBjb25zdCBERUZBVUxUX1BST1BFUlRJRVMgPSB7XG5cbiAgfVxuICBjb25zdCBEQVRBX0FUVFJTX1BST1BFUlRJRVMgPSBbXG4gIF1cbiAgY29uc3QgVEFCX0NPTlRFTlRfU0VMRUNUT1IgPSAnLnRhYi1wYW5lJ1xuXG4gIC8qKlxuICAgKiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICogQ2xhc3MgRGVmaW5pdGlvblxuICAgKiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICovXG5cbiAgY2xhc3MgVGFiIGV4dGVuZHMgQ29tcG9uZW50IHtcblxuICAgIGNvbnN0cnVjdG9yKG9wdGlvbnMgPSB7fSkge1xuICAgICAgc3VwZXIoTkFNRSwgVkVSU0lPTiwgREVGQVVMVF9QUk9QRVJUSUVTLCBvcHRpb25zLCBEQVRBX0FUVFJTX1BST1BFUlRJRVMsIGZhbHNlLCBmYWxzZSlcbiAgICB9XG5cbiAgICBzaG93KCkge1xuICAgICAgaWYgKHRoaXMub3B0aW9ucy5lbGVtZW50LmNsYXNzTGlzdC5jb250YWlucygnYWN0aXZlJykpIHtcbiAgICAgICAgcmV0dXJuIGZhbHNlXG4gICAgICB9XG5cbiAgICAgIGNvbnN0IGlkID0gdGhpcy5vcHRpb25zLmVsZW1lbnQuZ2V0QXR0cmlidXRlKCdocmVmJylcbiAgICAgIGNvbnN0IG5hdiA9IGZpbmRUYXJnZXRCeUNsYXNzKHRoaXMub3B0aW9ucy5lbGVtZW50LCAnbmF2JylcbiAgICAgIGNvbnN0IG5hdlRhYnMgPSBuYXYgPyBuYXYucXVlcnlTZWxlY3RvckFsbChgW2RhdGEtdG9nZ2xlPVwiJHtOQU1FfVwiXWApIDogbnVsbFxuXG4gICAgICBpZiAobmF2VGFicykge1xuICAgICAgICBBcnJheS5mcm9tKG5hdlRhYnMpLmZvckVhY2goKHRhYikgPT4ge1xuICAgICAgICAgIGlmICh0YWIuY2xhc3NMaXN0LmNvbnRhaW5zKCdhY3RpdmUnKSkge1xuICAgICAgICAgICAgdGFiLmNsYXNzTGlzdC5yZW1vdmUoJ2FjdGl2ZScpXG4gICAgICAgICAgfVxuICAgICAgICAgIHRhYi5zZXRBdHRyaWJ1dGUoJ2FyaWEtc2VsZWN0ZWQnLCBmYWxzZSlcbiAgICAgICAgfSlcbiAgICAgIH1cblxuICAgICAgdGhpcy5vcHRpb25zLmVsZW1lbnQuY2xhc3NMaXN0LmFkZCgnYWN0aXZlJylcbiAgICAgIHRoaXMub3B0aW9ucy5lbGVtZW50LnNldEF0dHJpYnV0ZSgnYXJpYS1zZWxlY3RlZCcsIHRydWUpXG5cbiAgICAgIGNvbnN0IHRhYkNvbnRlbnQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKGlkKVxuICAgICAgY29uc3QgdGFiQ29udGVudHMgPSB0YWJDb250ZW50LnBhcmVudE5vZGUucXVlcnlTZWxlY3RvckFsbChUQUJfQ09OVEVOVF9TRUxFQ1RPUilcblxuICAgICAgaWYgKHRhYkNvbnRlbnRzKSB7XG4gICAgICAgIEFycmF5LmZyb20odGFiQ29udGVudHMpLmZvckVhY2goKHRhYikgPT4ge1xuICAgICAgICAgIGlmICh0YWIuY2xhc3NMaXN0LmNvbnRhaW5zKCdhY3RpdmUnKSkge1xuICAgICAgICAgICAgdGFiLmNsYXNzTGlzdC5yZW1vdmUoJ2FjdGl2ZScpXG4gICAgICAgICAgfVxuICAgICAgICB9KVxuICAgICAgfVxuXG4gICAgICB0YWJDb250ZW50LmNsYXNzTGlzdC5hZGQoJ3Nob3dpbmcnKVxuXG4gICAgICBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgICAgY29uc3Qgb25TaG93ZWQgPSAoKSA9PiB7XG4gICAgICAgICAgdGFiQ29udGVudC5jbGFzc0xpc3QucmVtb3ZlKCdhbmltYXRlJylcbiAgICAgICAgICB0YWJDb250ZW50LmNsYXNzTGlzdC5hZGQoJ2FjdGl2ZScpXG4gICAgICAgICAgdGFiQ29udGVudC5jbGFzc0xpc3QucmVtb3ZlKCdzaG93aW5nJylcbiAgICAgICAgICB0YWJDb250ZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoRXZlbnQuVFJBTlNJVElPTl9FTkQsIG9uU2hvd2VkKVxuICAgICAgICB9XG5cbiAgICAgICAgdGFiQ29udGVudC5hZGRFdmVudExpc3RlbmVyKEV2ZW50LlRSQU5TSVRJT05fRU5ELCBvblNob3dlZClcblxuICAgICAgICB0YWJDb250ZW50LmNsYXNzTGlzdC5hZGQoJ2FuaW1hdGUnKVxuXG4gICAgICB9LCAyMClcblxuICAgICAgcmV0dXJuIHRydWVcbiAgICB9XG5cbiAgICBoaWRlKCkge1xuICAgICAgaWYgKCF0aGlzLm9wdGlvbnMuZWxlbWVudC5jbGFzc0xpc3QuY29udGFpbnMoJ2FjdGl2ZScpKSB7XG4gICAgICAgIHJldHVybiBmYWxzZVxuICAgICAgfVxuXG4gICAgICBpZiAodGhpcy5vcHRpb25zLmVsZW1lbnQuY2xhc3NMaXN0LmNvbnRhaW5zKCdhY3RpdmUnKSkge1xuICAgICAgICB0aGlzLm9wdGlvbnMuZWxlbWVudC5jbGFzc0xpc3QucmVtb3ZlKCdhY3RpdmUnKVxuICAgICAgfVxuXG4gICAgICB0aGlzLm9wdGlvbnMuZWxlbWVudC5zZXRBdHRyaWJ1dGUoJ2FyaWEtc2VsZWN0ZWQnLCBmYWxzZSlcblxuICAgICAgY29uc3QgaWQgPSB0aGlzLm9wdGlvbnMuZWxlbWVudC5nZXRBdHRyaWJ1dGUoJ2hyZWYnKVxuICAgICAgY29uc3QgdGFiQ29udGVudCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoaWQpXG5cbiAgICAgIGlmICh0YWJDb250ZW50LmNsYXNzTGlzdC5jb250YWlucygnYWN0aXZlJykpIHtcbiAgICAgICAgdGFiQ29udGVudC5jbGFzc0xpc3QucmVtb3ZlKCdhY3RpdmUnKVxuICAgICAgfVxuXG4gICAgICByZXR1cm4gdHJ1ZVxuICAgIH1cblxuICAgIHN0YXRpYyBpZGVudGlmaWVyKCkge1xuICAgICAgcmV0dXJuIE5BTUVcbiAgICB9XG5cbiAgICBzdGF0aWMgX0RPTUludGVyZmFjZShvcHRpb25zKSB7XG4gICAgICByZXR1cm4gc3VwZXIuX0RPTUludGVyZmFjZShUYWIsIG9wdGlvbnMpXG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgKiBET00gQXBpIGltcGxlbWVudGF0aW9uXG4gICAqIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgKi9cbiAgY29uc3QgY29tcG9uZW50cyA9IFtdXG5cbiAgY29uc3QgdGFicyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoYFtkYXRhLXRvZ2dsZT1cIiR7TkFNRX1cIl1gKVxuICBpZiAodGFicykge1xuICAgIEFycmF5LmZyb20odGFicykuZm9yRWFjaCgoZWxlbWVudCkgPT4ge1xuICAgICAgLy8gY29uc3QgY29uZmlnID0ge31cbiAgICAgIGNvbnN0IGNvbmZpZyA9IGdldEF0dHJpYnV0ZXNDb25maWcoZWxlbWVudCwgREVGQVVMVF9QUk9QRVJUSUVTLCBEQVRBX0FUVFJTX1BST1BFUlRJRVMpXG4gICAgICBjb25maWcuZWxlbWVudCA9IGVsZW1lbnRcblxuICAgICAgY29tcG9uZW50cy5wdXNoKFRhYi5fRE9NSW50ZXJmYWNlKGNvbmZpZykpXG4gICAgfSlcbiAgfVxuXG4gIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKGV2ZW50KSA9PiB7XG4gICAgY29uc3QgZGF0YVRvZ2dsZUF0dHIgPSBldmVudC50YXJnZXQuZ2V0QXR0cmlidXRlKCdkYXRhLXRvZ2dsZScpXG4gICAgaWYgKGRhdGFUb2dnbGVBdHRyICYmIGRhdGFUb2dnbGVBdHRyID09PSBOQU1FKSB7XG4gICAgICBjb25zdCBpZCA9IGV2ZW50LnRhcmdldC5nZXRBdHRyaWJ1dGUoJ2hyZWYnKVxuXG4gICAgICBjb25zdCBjb21wb25lbnQgPSBjb21wb25lbnRzLmZpbmQoYyA9PiBjLmdldEVsZW1lbnQoKS5nZXRBdHRyaWJ1dGUoJ2hyZWYnKSA9PT0gaWQpXG5cbiAgICAgIGlmICghY29tcG9uZW50KSB7XG4gICAgICAgIHJldHVyblxuICAgICAgfVxuXG4gICAgICBjb21wb25lbnQuc2hvdygpXG4gICAgfVxuICB9KVxuXG4gIHJldHVybiBUYWJcbn0pKClcblxuZXhwb3J0IGRlZmF1bHQgVGFiXG4iLCIvKipcbiogLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiogTGljZW5zZWQgdW5kZXIgTUlUIChodHRwczovL2dpdGh1Yi5jb20vcXVhcmstZGV2L1Bob25vbi1GcmFtZXdvcmsvYmxvYi9tYXN0ZXIvTElDRU5TRSlcbiogLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiovXG5cbmNvbnN0IEJpbmRlciA9ICgoKSA9PiB7XG4gIC8qKlxuICAqIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAqIENvbnN0YW50c1xuICAqIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAqL1xuXG4gIGNvbnN0IE5BTUUgPSAnaW50bC1iaW5kZXInXG4gIGNvbnN0IFZFUlNJT04gPSAnMi4wLjAnXG5cbiAgLyoqXG4gICAqIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgKiBDbGFzcyBEZWZpbml0aW9uXG4gICAqIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgKi9cblxuICBjbGFzcyBCaW5kZXIge1xuICAgIGNvbnN0cnVjdG9yKGVsZW1lbnQsIGRhdGEpIHtcbiAgICAgIHRoaXMuZWxlbWVudCA9IGVsZW1lbnRcbiAgICAgIHRoaXMuZGF0YSA9IGRhdGFcblxuICAgICAgaWYgKCF0aGlzLmlzRWxlbWVudCh0aGlzLmVsZW1lbnQpKSB7XG4gICAgICAgIHJldHVyblxuICAgICAgfVxuXG4gICAgICAvLyBhcnJheSBvZiBIVE1MRWxlbWVudFxuICAgICAgaWYgKHRoaXMuZWxlbWVudC5sZW5ndGggJiYgdGhpcy5lbGVtZW50Lmxlbmd0aCA+IDApIHtcbiAgICAgICAgdGhpcy5zZXROb2Rlcyh0aGlzLmVsZW1lbnQpXG4gICAgICB9IGVsc2Uge1xuICAgICAgICAvLyBzaW5nbGUgSFRNTEVsZW1lbnRcbiAgICAgICAgdGhpcy5zZXROb2RlKHRoaXMuZWxlbWVudClcbiAgICAgIH1cbiAgICB9XG5cbiAgICAvLyBnZXR0ZXJzXG5cbiAgICBzdGF0aWMgZ2V0IHZlcnNpb24oKSB7XG4gICAgICByZXR1cm4gYCR7TkFNRX0uJHtWRVJTSU9OfWBcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBDaGVja3MgaWYgdGhlIGdpdmVuIGFyZ3VtZW50IGlzIGEgRE9NIGVsZW1lbnRcbiAgICAgKiBAcGFyYW0ge0hUTUxFbGVtZW50fSB0aGUgYXJndW1lbnQgdG8gdGVzdFxuICAgICAqIEByZXR1cm4ge2Jvb2xlYW59IHRydWUgaWYgdGhlIG9iamVjdCBpcyBhIERPTSBlbGVtZW50LCBmYWxzZSBvdGhlcndpc2VcbiAgICAgKi9cbiAgICBpc0VsZW1lbnQoZWxlbWVudCkge1xuICAgICAgaWYgKGVsZW1lbnQgPT09IG51bGwpIHtcbiAgICAgICAgcmV0dXJuIGZhbHNlXG4gICAgICB9XG4gICAgICByZXR1cm4gKHR5cGVvZiBOb2RlID09PSAnb2JqZWN0JyA/IGVsZW1lbnQgaW5zdGFuY2VvZiBOb2RlIDogZWxlbWVudCAmJiB0eXBlb2YgZWxlbWVudCA9PT0gJ29iamVjdCcgJiYgdHlwZW9mIGVsZW1lbnQubm9kZVR5cGUgPT09ICdudW1iZXInICYmIHR5cGVvZiBlbGVtZW50Lm5vZGVOYW1lID09PSAnc3RyaW5nJylcbiAgICB9XG5cbiAgICAvKipcbiAgICAqIEJpbmRzIHNvbWUgdGV4dCB0byB0aGUgZ2l2ZW4gRE9NIGVsZW1lbnRcbiAgICAqIEBwYXJhbSB7SFRNTEVsZW1lbnR9IGVsZW1lbnRcbiAgICAqIEBwYXJhbSB7U3RyaW5nfSB0ZXh0XG4gICAgKi9cbiAgICBzZXRUZXh0KGVsZW1lbnQsIHRleHQpIHtcbiAgICAgIGlmICghKCd0ZXh0Q29udGVudCcgaW4gZWxlbWVudCkpIHtcbiAgICAgICAgZWxlbWVudC5pbm5lclRleHQgPSB0ZXh0XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBlbGVtZW50LnRleHRDb250ZW50ID0gdGV4dFxuICAgICAgfVxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEJpbmRzIHNvbWUgaHRtbCB0byB0aGUgZ2l2ZW4gRE9NIGVsZW1lbnRcbiAgICAgKiBAcGFyYW0ge0hUTUxFbGVtZW50fSBlbGVtZW50XG4gICAgICogQHBhcmFtIHtzdHJpbmd9IHRleHRcbiAgICAgKi9cbiAgICBzZXRIdG1sKGVsZW1lbnQsIHRleHQpIHtcbiAgICAgIGVsZW1lbnQuaW5uZXJIVE1MID0gdGV4dFxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEJpbmRzIGN1c3RvbSBhdHRyaWJ1dGVzIHRvIHRoZSBnaXZlbiBET00gZWxlbWVudFxuICAgICAqIEBwYXJhbSB7SFRNTEVsZW1lbnR9IGVsZW1lbnRcbiAgICAgKiBAcGFyYW0ge1N0cmluZ30gYXR0clxuICAgICAqIEBwYXJhbSB7U3RyaW5nfSB0ZXh0XG4gICAgICovXG4gICAgc2V0QXR0cmlidXRlKGVsZW1lbnQsIGF0dHIsIHRleHQpIHtcbiAgICAgIGVsZW1lbnQuc2V0QXR0cmlidXRlKGF0dHIsIHRleHQpXG4gICAgfVxuXG4gICAgc2V0Tm9kZShlbGVtZW50KSB7XG4gICAgICBsZXQgYXR0ciA9IGVsZW1lbnQuZ2V0QXR0cmlidXRlKCdkYXRhLWkxOG4nKVxuICAgICAgaWYgKCFhdHRyKSB7XG4gICAgICAgIHJldHVyblxuICAgICAgfVxuXG4gICAgICBhdHRyID0gYXR0ci50cmltKClcblxuICAgICAgY29uc3QgciA9IC8oPzpcXHN8XikoW0EtWmEtei1fMC05XSspOlxccyooLio/KSg/PVxccytcXHcrOnwkKS9nXG4gICAgICBsZXQgbVxuXG4gICAgICB3aGlsZSAobSA9IHIuZXhlYyhhdHRyKSkge1xuICAgICAgICBjb25zdCBrZXkgPSBtWzFdLnRyaW0oKVxuICAgICAgICBjb25zdCB2YWx1ZSA9IG1bMl0udHJpbSgpLnJlcGxhY2UoJywnLCAnJylcbiAgICAgICAgbGV0IGludGxWYWx1ZSA9IHRoaXMuZGF0YVt2YWx1ZV1cblxuICAgICAgICBpZiAoIXRoaXMuZGF0YVt2YWx1ZV0pIHtcbiAgICAgICAgICBjb25zb2xlLmxvZyhgJHtOQU1FfS4gV2FybmluZywgJHt2YWx1ZX0gZG9lcyBub3QgZXhpc3QuYClcbiAgICAgICAgICBpbnRsVmFsdWUgPSB2YWx1ZVxuICAgICAgICB9XG5cbiAgICAgICAgY29uc3QgbWV0aG9kTmFtZSA9ICdzZXQnICsga2V5LmNoYXJBdCgwKS50b1VwcGVyQ2FzZSgpICsga2V5LnNsaWNlKDEpXG5cbiAgICAgICAgaWYgKHRoaXNbbWV0aG9kTmFtZV0pIHtcbiAgICAgICAgICB0aGlzW21ldGhvZE5hbWVdKGVsZW1lbnQsIGludGxWYWx1ZSlcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICB0aGlzLnNldEF0dHJpYnV0ZShlbGVtZW50LCBrZXksIGludGxWYWx1ZSlcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cblxuICAgIC8qKlxuICAgICogU2V0IHZhbHVlcyB0byBET00gbm9kZXNcbiAgICAqL1xuICAgIHNldE5vZGVzKGVsZW1lbnQpIHtcbiAgICAgIEFycmF5LmZyb20oZWxlbWVudCkuZm9yRWFjaChlbCA9PiB0aGlzLnNldE5vZGUoZWwpKVxuICAgIH1cbiAgfVxuXG4gIHJldHVybiBCaW5kZXJcbn0pKClcblxuZXhwb3J0IGRlZmF1bHQgQmluZGVyXG4iLCIvKipcbiAqIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gKiBMaWNlbnNlZCB1bmRlciBNSVQgKGh0dHBzOi8vZ2l0aHViLmNvbS9xdWFyay1kZXYvUGhvbm9uLUZyYW1ld29yay9ibG9iL21hc3Rlci9MSUNFTlNFKVxuICogLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAqL1xuaW1wb3J0IEJpbmRlciBmcm9tICcuL2JpbmRlcidcblxuY29uc3QgSW50bCA9ICgoKSA9PiB7XG4gIC8qKlxuICAgKiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICogQ29uc3RhbnRzXG4gICAqIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgKi9cblxuICBjb25zdCBOQU1FID0gJ0ludGwnXG4gIGNvbnN0IFZFUlNJT04gPSAnMi4wLjAnXG4gIGNvbnN0IERFRkFVTFRfUFJPUEVSVElFUyA9IHtcbiAgICBmYWxsYmFja0xvY2FsZTogJ2VuJyxcbiAgICBsb2NhbGU6ICdlbicsXG4gICAgYXV0b0JpbmQ6IHRydWUsXG4gICAgZGF0YTogbnVsbCxcbiAgfVxuXG4gIC8qKlxuICAgKiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICogQ2xhc3MgRGVmaW5pdGlvblxuICAgKiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICovXG5cbiAgY2xhc3MgSW50bCB7XG4gICAgLyoqXG4gICAgICogQ3JlYXRlcyBhbiBpbnN0YW5jZSBvZiBJbnRsLlxuICAgICAqIEBwYXJhbSB7ZmFsbGJhY2tMb2NhbGU6IHN0cmluZywgbG9jYWxlOiBzdHJpbmcsIGF1dG9CaW5kOiBib29sZWFuLCBkYXRhOiB7W2xhbmc6IHN0cmluZ106IHtba2V5OiBzdHJpbmddOiBzdHJpbmd9fX1cbiAgICAgKi9cbiAgICBjb25zdHJ1Y3RvcihvcHRpb25zID0ge30pIHtcbiAgICAgIHRoaXMub3B0aW9ucyA9IE9iamVjdC5hc3NpZ24oREVGQVVMVF9QUk9QRVJUSUVTLCBvcHRpb25zKVxuXG4gICAgICBpZiAodHlwZW9mIHRoaXMub3B0aW9ucy5mYWxsYmFja0xvY2FsZSAhPT0gJ3N0cmluZycpIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKGAke05BTUV9LiBUaGUgZmFsbGJhY2sgbG9jYWxlIGlzIG1hbmRhdG9yeSBhbmQgbXVzdCBiZSBhIHN0cmluZy5gKVxuICAgICAgfVxuXG4gICAgICBpZiAodGhpcy5vcHRpb25zLmRhdGEgPT09IG51bGwpIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKGAke05BTUV9LiBUaGVyZSBpcyBubyB0cmFuc2xhdGlvbiBkYXRhLmApXG4gICAgICB9XG5cbiAgICAgIGlmICh0eXBlb2YgdGhpcy5vcHRpb25zLmRhdGFbdGhpcy5vcHRpb25zLmZhbGxiYWNrTG9jYWxlXSAhPT0gJ29iamVjdCcpIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKGAke05BTUV9LiBUaGUgZmFsbGJhY2sgbG9jYWxlIG11c3QgbmVjZXNzYXJpbHkgaGF2ZSB0cmFuc2xhdGlvbiBkYXRhLmApXG4gICAgICB9XG5cbiAgICAgIHRoaXMuc2V0TG9jYWxlKHRoaXMub3B0aW9ucy5sb2NhbGUsIHRoaXMub3B0aW9ucy5hdXRvQmluZClcbiAgICB9XG5cbiAgICBzdGF0aWMgZ2V0IHZlcnNpb24oKSB7XG4gICAgICByZXR1cm4gYCR7TkFNRX0uJHtWRVJTSU9OfWBcbiAgICB9XG5cbiAgICBnZXRMb2NhbGUoKSB7XG4gICAgICByZXR1cm4gdGhpcy5vcHRpb25zLmxvY2FsZVxuICAgIH1cblxuICAgIGdldEZhbGxiYWNrTG9jYWxlKCkge1xuICAgICAgcmV0dXJuIHRoaXMub3B0aW9ucy5mYWxsYmFja0xvY2FsZVxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFNldCBkZWZhdWx0IGxvY2FsZVxuICAgICAqIEBwYXJhbSB7c3RyaW5nfSBsb2NhbGVcbiAgICAgKiBAcGFyYW0ge2Jvb2xlYW59IFt1cGRhdGVIVE1MPXRydWVdXG4gICAgICovXG4gICAgc2V0TG9jYWxlKGxvY2FsZSwgdXBkYXRlSFRNTCA9IHRydWUpIHtcbiAgICAgIGlmICh0eXBlb2YgdGhpcy5vcHRpb25zLmRhdGFbbG9jYWxlXSAhPT0gJ29iamVjdCcpIHtcbiAgICAgICAgY29uc29sZS5lcnJvcihgJHtOQU1FfS4gJHtsb2NhbGV9IGhhcyBubyBkYXRhLCBmYWxsYmFjayBpbiAke3RoaXMub3B0aW9ucy5mYWxsYmFja0xvY2FsZX0uYClcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMub3B0aW9ucy5sb2NhbGUgPSBsb2NhbGVcbiAgICAgIH1cblxuICAgICAgaWYgKHVwZGF0ZUhUTUwpIHtcbiAgICAgICAgdGhpcy51cGRhdGVIdG1sKClcbiAgICAgIH1cbiAgICB9XG5cbiAgICBnZXRMYW5ndWFnZXMoKSB7XG4gICAgICByZXR1cm4gT2JqZWN0LmtleXModGhpcy5vcHRpb25zLmRhdGEpXG4gICAgfVxuXG4gICAgaW5zZXJ0VmFsdWVzKHZhbHVlID0gbnVsbCwgaW5qZWN0YWJsZVZhbHVlcyA9IHt9KSB7XG4gICAgICBpZiAodHlwZW9mIHZhbHVlICE9PSAnc3RyaW5nJykge1xuICAgICAgICByZXR1cm4gdW5kZWZpbmVkXG4gICAgICB9XG5cbiAgICAgIGNvbnN0IG1hdGNoID0gdmFsdWUubWF0Y2goLzooW2EtekEtWi1fMC05XSspLylcbiAgICAgIGlmIChtYXRjaCkge1xuICAgICAgICB2YWx1ZSA9IHZhbHVlLnJlcGxhY2UobWF0Y2hbMF0sIGluamVjdGFibGVWYWx1ZXNbbWF0Y2hbMV1dKVxuICAgICAgfVxuXG4gICAgICBpZiAodmFsdWUubWF0Y2goLzooW2EtekEtWi1fMC05XSspLykpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuaW5zZXJ0VmFsdWVzKHZhbHVlLCBpbmplY3RhYmxlVmFsdWVzKVxuICAgICAgfVxuXG4gICAgICByZXR1cm4gdmFsdWVcbiAgICB9XG5cbiAgICB0cmFuc2xhdGUoa2V5TmFtZSA9IG51bGwsIGluamVjdCA9IHt9KSB7XG4gICAgICBsZXQgZGF0YSA9IHRoaXMub3B0aW9ucy5kYXRhW3RoaXMub3B0aW9ucy5sb2NhbGVdXG4gICAgICBpZiAoIWRhdGEpIHtcbiAgICAgICAgZGF0YSA9IHRoaXMub3B0aW9ucy5kYXRhW3RoaXMub3B0aW9ucy5mYWxsYmFja0xvY2FsZV1cbiAgICAgIH1cblxuICAgICAgaWYgKGtleU5hbWUgPT09IG51bGwgfHwga2V5TmFtZSA9PT0gJyonIHx8IEFycmF5LmlzQXJyYXkoa2V5TmFtZSkpIHtcbiAgICAgICAgaWYgKEFycmF5LmlzQXJyYXkoa2V5TmFtZSkpIHtcbiAgICAgICAgICBjb25zdCBrZXlzID0gT2JqZWN0LmtleXMoZGF0YSkuZmlsdGVyKGtleSA9PiBrZXlOYW1lLmluZGV4T2Yoa2V5KSA+IC0xKVxuICAgICAgICAgIGNvbnN0IGZpbHRlcmVkRGF0YSA9IHt9XG4gICAgICAgICAga2V5cy5mb3JFYWNoKGtleSA9PiB7XG4gICAgICAgICAgICBmaWx0ZXJlZERhdGFba2V5XSA9IHRoaXMuaW5zZXJ0VmFsdWVzKGRhdGFba2V5XSwgaW5qZWN0KVxuICAgICAgICAgIH0pXG4gICAgICAgICAgZGF0YSA9IGZpbHRlcmVkRGF0YVxuICAgICAgICB9XG5cbiAgICAgICAgY29uc3QgZGF0YU1hcCA9IHt9XG4gICAgICAgIGZvciAoY29uc3Qga2V5IGluIGRhdGEpIHtcbiAgICAgICAgICBkYXRhTWFwW2tleV0gPSB0aGlzLmluc2VydFZhbHVlcyhkYXRhW2tleV0sIGluamVjdClcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBkYXRhTWFwXG4gICAgICB9XG5cbiAgICAgIHJldHVybiB0aGlzLmluc2VydFZhbHVlcyhkYXRhW2tleU5hbWVdLCBpbmplY3QpXG4gICAgfVxuXG4gICAgLy8gYWxpYXMgb2YgdCgpXG4gICAgdChrZXlOYW1lID0gbnVsbCwgaW5qZWN0ID0ge30pIHtcbiAgICAgIHJldHVybiB0aGlzLnRyYW5zbGF0ZShrZXlOYW1lLCBpbmplY3QpXG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogVXBkYXRlcyB0aGUgSFRNTCB2aWV3c1xuICAgICAqIEBwYXJhbSB7SFRNTEVsZW1lbnR9IGVsZW1lbnRcbiAgICAgKi9cbiAgICB1cGRhdGVIdG1sKGVsZW1lbnQpIHtcbiAgICAgIGlmICh0eXBlb2YgZWxlbWVudCA9PT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgZWxlbWVudCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJ1tkYXRhLWkxOG5dJylcbiAgICAgIH1cblxuICAgICAgaWYgKHR5cGVvZiBlbGVtZW50ID09PSAnc3RyaW5nJykge1xuICAgICAgICBlbGVtZW50ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihlbGVtZW50KVxuICAgICAgfVxuXG4gICAgICBuZXcgQmluZGVyKGVsZW1lbnQsIHRoaXMudCgpKVxuICAgIH1cblxuICAgIC8vIHN0YXRpY1xuICAgIHN0YXRpYyBfRE9NSW50ZXJmYWNlKG9wdGlvbnMpIHtcbiAgICAgIHJldHVybiBuZXcgSW50bChvcHRpb25zKVxuICAgIH1cbiAgfVxuXG4gIHJldHVybiBJbnRsXG59KSgpXG5cbmV4cG9ydCBkZWZhdWx0IEludGxcbiIsIi8qKlxuICogLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAqIExpY2Vuc2VkIHVuZGVyIE1JVCAoaHR0cHM6Ly9naXRodWIuY29tL3F1YXJrLWRldi9QaG9ub24tRnJhbWV3b3JrL2Jsb2IvbWFzdGVyL0xJQ0VOU0UpXG4gKiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICovXG5cbmltcG9ydCBQYWdlIGZyb20gJy4vcGFnZSdcbmltcG9ydCBFdmVudCBmcm9tICcuLi8uLi9jb21tb24vZXZlbnRzJ1xuXG5jb25zdCBQYWdlciA9ICgoKSA9PiB7XG4gIC8qKlxuICAgKiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICogQ29uc3RhbnRzXG4gICAqIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgKi9cblxuICBjb25zdCBOQU1FID0gJ3BhZ2VyJ1xuICBjb25zdCBWRVJTSU9OID0gJzIuMC4wJ1xuICBjb25zdCBERUZBVUxUX1BST1BFUlRJRVMgPSB7XG4gICAgaGFzaFByZWZpeDogJyMhJyxcbiAgICB1c2VIYXNoOiB0cnVlLFxuICAgIGRlZmF1bHRQYWdlOiBudWxsLFxuICAgIGFuaW1hdGVQYWdlczogdHJ1ZSxcbiAgfVxuXG4gIGxldCBjdXJyZW50UGFnZVxuICAvKipcbiAgICogLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAqIENsYXNzIERlZmluaXRpb25cbiAgICogLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAqL1xuXG4gIGNsYXNzIFBhZ2VyIHtcbiAgICAvKipcbiAgICAgKiBAY29uc3RydWN0b3JcbiAgICAgKlxuICAgICAqIEBwYXJhbSBvcHRpb25zIHtPYmplY3R9XG4gICAgICovXG4gICAgY29uc3RydWN0b3Iob3B0aW9ucyA9IHt9KSB7XG4gICAgICB0aGlzLm9wdGlvbnMgPSBPYmplY3QuYXNzaWduKERFRkFVTFRfUFJPUEVSVElFUywgb3B0aW9ucylcblxuICAgICAgdGhpcy5wYWdlcyA9IFtdXG4gICAgICB0aGlzLnN0YXJ0ZWQgPSBmYWxzZVxuXG4gICAgICAvLyBhZGQgZ2xvYmFsIGxpc3RlbmVycyBzdWNoIGFzaCBoYXNoIGNoYW5nZSwgbmF2aWdhdGlvbiwgZXRjLlxuICAgICAgdGhpcy5hZGRQYWdlckV2ZW50cygpXG5cbiAgICAgIC8vIGZhc3RlciB3YXkgdG8gaW5pdCBwYWdlcyBiZWZvcmUgdGhlIERPTSBpcyByZWFkeVxuICAgICAgdGhpcy5vbkRPTUxvYWRlZCgpXG4gICAgfVxuXG4gICAgLy8gcHJpdmF0ZVxuICAgIF8oc2VsZWN0b3IpIHtcbiAgICAgIHJldHVybiBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKHNlbGVjdG9yKVxuICAgIH1cblxuICAgIGdldEhhc2goKSB7XG4gICAgICByZXR1cm4gd2luZG93LmxvY2F0aW9uLmhhc2guc3BsaXQodGhpcy5vcHRpb25zLmhhc2hQcmVmaXgpWzFdXG4gICAgfVxuXG4gICAgZ2V0UGFnZUZyb21IYXNoKCkge1xuICAgICAgY29uc3QgaGFzaCA9IHRoaXMuZ2V0SGFzaCgpXG4gICAgICBjb25zdCByZSA9IG5ldyBSZWdFeHAoJ1s/XFwvXShbXlxcL10qKScpXG4gICAgICBjb25zdCBtYXRjaGVzID0gcmUuZXhlYyhoYXNoKVxuXG4gICAgICBpZiAobWF0Y2hlcyAmJiBtYXRjaGVzWzFdKSB7XG4gICAgICAgIHJldHVybiBtYXRjaGVzWzFdXG4gICAgICB9XG5cbiAgICAgIHJldHVybiBudWxsXG4gICAgfVxuXG4gICAgc2V0SGFzaChwYWdlTmFtZSkge1xuICAgICAgd2luZG93LmxvY2F0aW9uLmhhc2ggPSBgJHt0aGlzLm9wdGlvbnMuaGFzaFByZWZpeH0vJHtwYWdlTmFtZX1gXG4gICAgfVxuXG4gICAgYXJlU2FtZVBhZ2UocGFnZU5hbWUxLCBwYWdlTmFtZTIpIHtcbiAgICAgIGNvbnN0IHBhZ2UxID0gdGhpcy5nZXRQYWdlTW9kZWwocGFnZU5hbWUxKVxuICAgICAgY29uc3QgcGFnZTIgPSB0aGlzLmdldFBhZ2VNb2RlbChwYWdlTmFtZTIpXG4gICAgICByZXR1cm4gcGFnZTEgJiYgcGFnZTIgJiYgcGFnZTEubmFtZSA9PT0gcGFnZTIubmFtZVxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEF0dGFjaGVzIHRoZSBtYWluIGV2ZW50cyBmb3IgdHJhY2tpbmcgaGFzaCBjaGFuZ2VzLFxuICAgICAqIGNsaWNrIG9uIG5hdmlnYXRpb24gYnV0dG9ucyBhbmQgbGlua3MgYW5kIGJhY2sgaGlzdG9yeVxuICAgICAqL1xuICAgIGFkZFBhZ2VyRXZlbnRzKCkge1xuICAgICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBldmVudCA9PiB0aGlzLm9uQ2xpY2soZXZlbnQpKVxuICAgICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ3BvcHN0YXRlJywgZXZlbnQgPT4gdGhpcy5vbkJhY2tIaXN0b3J5KGV2ZW50KSlcbiAgICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdoYXNoY2hhbmdlJywgZXZlbnQgPT4gdGhpcy5vbkhhc2hDaGFuZ2UoZXZlbnQpKVxuICAgICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignRE9NQ29udGVudExvYWRlZCcsIGV2ZW50ID0+IHRoaXMub25ET01Mb2FkZWQoZXZlbnQpKVxuICAgIH1cblxuICAgIC8vIGdldHRlcnNcblxuICAgIHN0YXRpYyBnZXQgdmVyc2lvbigpIHtcbiAgICAgIHJldHVybiBgJHtOQU1FfS4ke1ZFUlNJT059YFxuICAgIH1cblxuICAgIC8vIHB1YmxpY1xuXG4gICAgc2hvd1BhZ2UocGFnZU5hbWUsIGFkZFRvSGlzdG9yeSA9IHRydWUsIGJhY2sgPSBmYWxzZSkge1xuICAgICAgY29uc3Qgb2xkUGFnZSA9IHRoaXMuXygnLmN1cnJlbnQnKVxuICAgICAgaWYgKG9sZFBhZ2UpIHtcbiAgICAgICAgY29uc3Qgb2xkUGFnZU5hbWUgPSBvbGRQYWdlLmdldEF0dHJpYnV0ZSgnZGF0YS1wYWdlJylcblxuICAgICAgICBpZiAodGhpcy5hcmVTYW1lUGFnZShwYWdlTmFtZSwgb2xkUGFnZU5hbWUpKSB7XG4gICAgICAgICAgcmV0dXJuXG4gICAgICAgIH1cblxuICAgICAgICBvbGRQYWdlLmNsYXNzTGlzdC5yZW1vdmUoJ2N1cnJlbnQnKVxuXG4gICAgICAgIC8vIGhpc3RvcnlcbiAgICAgICAgd2luZG93Lmhpc3RvcnkucmVwbGFjZVN0YXRlKHsgcGFnZTogb2xkUGFnZU5hbWUgfSwgb2xkUGFnZU5hbWUsIHdpbmRvdy5sb2NhdGlvbi5ocmVmKVxuXG4gICAgICAgIHRoaXMudHJpZ2dlclBhZ2VFdmVudChvbGRQYWdlTmFtZSwgRXZlbnQuSElERSlcbiAgICAgIH1cblxuICAgICAgdGhpcy50cmlnZ2VyUGFnZUV2ZW50KHBhZ2VOYW1lLCBFdmVudC5TSE9XKVxuXG4gICAgICBjdXJyZW50UGFnZSA9IHBhZ2VOYW1lXG5cbiAgICAgIC8vIG5ldyBwYWdlXG4gICAgICBjb25zdCBuZXdQYWdlID0gdGhpcy5fKGBbZGF0YS1wYWdlPVwiJHtwYWdlTmFtZX1cIl1gKVxuXG4gICAgICBuZXdQYWdlLmNsYXNzTGlzdC5hZGQoJ2N1cnJlbnQnKVxuXG4gICAgICAvLyB0ZW1wbGF0ZSBsb2FkZXJcbiAgICAgIGNvbnN0IHBhZ2VNb2RlbCA9IHRoaXMuZ2V0UGFnZU1vZGVsKHBhZ2VOYW1lKVxuXG4gICAgICAvLyBAdG9kbzogdXNlIHRlbXBsYXRlIGNhY2hlP1xuICAgICAgaWYgKHBhZ2VNb2RlbCAmJiBwYWdlTW9kZWwuZ2V0VGVtcGxhdGUoKSkge1xuICAgICAgICBwYWdlTW9kZWwubG9hZFRlbXBsYXRlKClcbiAgICAgIH1cbiAgICAgIC8vIGVuZFxuXG4gICAgICBpZiAob2xkUGFnZSkge1xuICAgICAgICBjb25zdCBvbGRQYWdlTmFtZSA9IG9sZFBhZ2UuZ2V0QXR0cmlidXRlKCdkYXRhLXBhZ2UnKVxuICAgICAgICAvLyB1c2Ugb2YgcHJvdG90eXBlLW9yaWVudGVkIGxhbmd1YWdlXG4gICAgICAgIG9sZFBhZ2UuYmFjayA9IGJhY2tcbiAgICAgICAgb2xkUGFnZS5wcmV2aW91c1BhZ2VOYW1lID0gb2xkUGFnZU5hbWVcblxuICAgICAgICBjb25zdCBvblBhZ2VBbmltYXRpb25FbmQgPSAoKSA9PiB7XG4gICAgICAgICAgaWYgKG9sZFBhZ2UuY2xhc3NMaXN0LmNvbnRhaW5zKCdhbmltYXRlJykpIHtcbiAgICAgICAgICAgIG9sZFBhZ2UuY2xhc3NMaXN0LnJlbW92ZSgnYW5pbWF0ZScpXG4gICAgICAgICAgfVxuXG4gICAgICAgICAgb2xkUGFnZS5jbGFzc0xpc3QucmVtb3ZlKG9sZFBhZ2UuYmFjayA/ICdwb3AtcGFnZScgOiAncHVzaC1wYWdlJylcblxuICAgICAgICAgIHRoaXMudHJpZ2dlclBhZ2VFdmVudChjdXJyZW50UGFnZSwgRXZlbnQuU0hPV04pXG4gICAgICAgICAgdGhpcy50cmlnZ2VyUGFnZUV2ZW50KG9sZFBhZ2UucHJldmlvdXNQYWdlTmFtZSwgRXZlbnQuSElEREVOKVxuXG4gICAgICAgICAgb2xkUGFnZS5yZW1vdmVFdmVudExpc3RlbmVyKEV2ZW50LkFOSU1BVElPTl9FTkQsIG9uUGFnZUFuaW1hdGlvbkVuZClcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICh0aGlzLm9wdGlvbnMuYW5pbWF0ZVBhZ2VzKSB7XG4gICAgICAgICAgb2xkUGFnZS5hZGRFdmVudExpc3RlbmVyKEV2ZW50LkFOSU1BVElPTl9FTkQsIG9uUGFnZUFuaW1hdGlvbkVuZClcbiAgICAgICAgICBvbGRQYWdlLmNsYXNzTGlzdC5hZGQoJ2FuaW1hdGUnKVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIG9uUGFnZUFuaW1hdGlvbkVuZCgpXG4gICAgICAgIH1cblxuICAgICAgICBvbGRQYWdlLmNsYXNzTGlzdC5hZGQoYmFjayA/ICdwb3AtcGFnZScgOiAncHVzaC1wYWdlJylcbiAgICAgIH1cbiAgICB9XG5cbiAgICBhZGRVbmlxdWVQYWdlTW9kZWwocGFnZU5hbWUpIHtcbiAgICAgIGlmICghdGhpcy5nZXRQYWdlTW9kZWwocGFnZU5hbWUpKSB7XG4gICAgICAgIHRoaXMucGFnZXMucHVzaChuZXcgUGFnZShwYWdlTmFtZSkpXG4gICAgICB9XG4gICAgfVxuXG4gICAgZ2V0UGFnZU1vZGVsKHBhZ2VOYW1lKSB7XG4gICAgICByZXR1cm4gdGhpcy5wYWdlcy5maW5kKHBhZ2UgPT4gcGFnZS5uYW1lID09PSBwYWdlTmFtZSlcbiAgICB9XG5cbiAgICBnZXRQYWdlc01vZGVsKHBhZ2VOYW1lcykge1xuICAgICAgcmV0dXJuIHRoaXMucGFnZXMuZmlsdGVyKHBhZ2UgPT4gcGFnZU5hbWVzLmluZGV4T2YocGFnZS5uYW1lKSA+IC0xKVxuICAgIH1cblxuICAgIHNlbGVjdG9yVG9BcnJheShzdHIpIHtcbiAgICAgIHJldHVybiBzdHIuc3BsaXQoJywnKS5tYXAoaXRlbSA9PiBpdGVtLnRyaW0oKSlcbiAgICB9XG5cbiAgICBhZGRFdmVudHMoY2FsbGJhY2spIHtcbiAgICAgIGlmICh0aGlzLmNhY2hlUGFnZVNlbGVjdG9yID09PSAnKicpIHtcbiAgICAgICAgLy8gYWRkIHRvIGFsbCBwYWdlIG1vZGVsc1xuICAgICAgICB0aGlzLnBhZ2VzLmZvckVhY2goKHBhZ2UpID0+IHtcbiAgICAgICAgICBwYWdlLmFkZEV2ZW50Q2FsbGJhY2soY2FsbGJhY2spXG4gICAgICAgIH0pXG4gICAgICAgIHJldHVyblxuICAgICAgfVxuXG4gICAgICBjb25zdCBwYWdlTW9kZWxzID0gdGhpcy5nZXRQYWdlc01vZGVsKHRoaXMuc2VsZWN0b3JUb0FycmF5KHRoaXMuY2FjaGVQYWdlU2VsZWN0b3IpLCB0cnVlKVxuICAgICAgcGFnZU1vZGVscy5mb3JFYWNoKChwYWdlKSA9PiB7XG4gICAgICAgIHBhZ2UuYWRkRXZlbnRDYWxsYmFjayhjYWxsYmFjaylcbiAgICAgIH0pXG4gICAgICB0aGlzLmNhY2hlUGFnZVNlbGVjdG9yID0gbnVsbFxuICAgIH1cblxuICAgIHVzZVRlbXBsYXRlKHRlbXBsYXRlUGF0aCwgcmVuZGVyRnVuY3Rpb24gPSBudWxsKSB7XG4gICAgICBjb25zdCBwYWdlTW9kZWxzID0gdGhpcy5nZXRQYWdlc01vZGVsKHRoaXMuc2VsZWN0b3JUb0FycmF5KHRoaXMuY2FjaGVQYWdlU2VsZWN0b3IpLCB0cnVlKVxuICAgICAgcGFnZU1vZGVscy5mb3JFYWNoKChwYWdlKSA9PiB7XG4gICAgICAgIHBhZ2UudXNlVGVtcGxhdGUodGVtcGxhdGVQYXRoKVxuICAgICAgICBpZiAodHlwZW9mIHJlbmRlckZ1bmN0aW9uID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgICAgcGFnZS51c2VUZW1wbGF0ZVJlbmRlcmVyKHJlbmRlckZ1bmN0aW9uKVxuICAgICAgICB9XG4gICAgICB9KVxuICAgICAgdGhpcy5jYWNoZVBhZ2VTZWxlY3RvciA9IG51bGxcbiAgICB9XG5cbiAgICB0cmlnZ2VyUGFnZUV2ZW50KHBhZ2VOYW1lLCBldmVudE5hbWUsIGV2ZW50UGFyYW1zID0gbnVsbCkge1xuICAgICAgY29uc3QgcGFnZU1vZGVsID0gdGhpcy5nZXRQYWdlTW9kZWwocGFnZU5hbWUpXG4gICAgICBpZiAocGFnZU1vZGVsKSB7XG4gICAgICAgIHBhZ2VNb2RlbC50cmlnZ2VyU2NvcGVzKGV2ZW50TmFtZSwgZXZlbnRQYXJhbXMpXG4gICAgICB9XG4gICAgfVxuXG4gICAgb25DbGljayhldmVudCkge1xuICAgICAgY29uc3QgcGFnZU5hbWUgPSBldmVudC50YXJnZXQuZ2V0QXR0cmlidXRlKCdkYXRhLW5hdmlnYXRlJylcbiAgICAgIGNvbnN0IHB1c2hQYWdlID0gIShldmVudC50YXJnZXQuZ2V0QXR0cmlidXRlKCdkYXRhLXBvcC1wYWdlJykgPT09ICd0cnVlJylcblxuICAgICAgaWYgKHBhZ2VOYW1lKSB7XG4gICAgICAgIGlmIChwYWdlTmFtZSA9PT0gJyRiYWNrJykge1xuICAgICAgICAgIC8vIHRoZSBwb3BzdGF0ZSBldmVudCB3aWxsIGJlIHRyaWdnZXJlZFxuICAgICAgICAgIHdpbmRvdy5oaXN0b3J5LmJhY2soKVxuICAgICAgICAgIHJldHVyblxuICAgICAgICB9XG5cbiAgICAgICAgLypcbiAgICAgICAgICogSWYgd2UgaGUgdXNlIHRoZSBoYXNoIGFzIHRyaWdnZXIsXG4gICAgICAgICAqIHdlIGNoYW5nZSBpdCBkeW5hbWljYWxseSBzbyB0aGF0IHRoZSBoYXNoY2hhbmdlIGV2ZW50IGlzIGNhbGxlZFxuICAgICAgICAgKiBPdGhlcndpc2UsIHdlIHNob3cgdGhlIHBhZ2VcbiAgICAgICAgICovXG4gICAgICAgIGlmICh0aGlzLm9wdGlvbnMudXNlSGFzaCkge1xuICAgICAgICAgIHRoaXMuc2V0SGFzaChwYWdlTmFtZSlcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICB0aGlzLnNob3dQYWdlKHBhZ2VOYW1lLCB0cnVlLCBwdXNoUGFnZSlcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cblxuICAgIG9uQmFja0hpc3RvcnkoZXZlbnQgPSB7fSkge1xuICAgICAgY29uc3QgcGFnZU5hbWUgPSBldmVudC5zdGF0ZSA/IGV2ZW50LnN0YXRlLnBhZ2UgOiBudWxsXG4gICAgICBpZiAoIXBhZ2VOYW1lKSB7XG4gICAgICAgIHJldHVyblxuICAgICAgfVxuXG4gICAgICB0aGlzLnNob3dQYWdlKHBhZ2VOYW1lLCB0cnVlLCB0cnVlKVxuICAgIH1cblxuICAgIG9uSGFzaENoYW5nZSgpIHtcbiAgICAgIGNvbnN0IHBhcmFtcyA9ICh0aGlzLmdldEhhc2goKSA/IHRoaXMuZ2V0SGFzaCgpLnNwbGl0KCcvJykgOiBbXSkuZmlsdGVyKHAgPT4gcC5sZW5ndGggPiAwKVxuICAgICAgaWYgKHBhcmFtcy5sZW5ndGggPiAwKSB7XG4gICAgICAgIC8vIHJlbW92ZSBmaXJzdCB2YWx1ZSB3aGljaCBpcyB0aGUgcGFnZSBuYW1lXG4gICAgICAgIHBhcmFtcy5zaGlmdCgpXG4gICAgICB9XG5cbiAgICAgIHRoaXMudHJpZ2dlclBhZ2VFdmVudChjdXJyZW50UGFnZSwgRXZlbnQuSEFTSCwgcGFyYW1zKVxuXG4gICAgICBjb25zdCBuYXZQYWdlID0gdGhpcy5nZXRQYWdlRnJvbUhhc2goKVxuICAgICAgaWYgKG5hdlBhZ2UpIHtcbiAgICAgICAgdGhpcy5zaG93UGFnZShuYXZQYWdlKVxuICAgICAgfVxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFF1ZXJpZXMgdGhlIHBhZ2Ugbm9kZXMgaW4gdGhlIERPTVxuICAgICAqL1xuICAgIG9uRE9NTG9hZGVkKCkge1xuICAgICAgY29uc3QgcGFnZXMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCdbZGF0YS1wYWdlXScpXG5cbiAgICAgIGlmICghcGFnZXMpIHtcbiAgICAgICAgcmV0dXJuXG4gICAgICB9XG5cbiAgICAgIHBhZ2VzLmZvckVhY2goKHBhZ2UpID0+IHtcbiAgICAgICAgbGV0IHBhZ2VOYW1lID0gcGFnZS5nZXRBdHRyaWJ1dGUoJ2RhdGEtcGFnZScpXG4gICAgICAgIC8qXG4gICAgICAgICAqIHRoZSBwYWdlIG5hbWUgY2FuIGJlIGdpdmVuIHdpdGggdGhlIGF0dHJpYnV0ZSBkYXRhLXBhZ2VcbiAgICAgICAgICogb3Igd2l0aCBpdHMgbm9kZSBuYW1lXG4gICAgICAgICAqL1xuICAgICAgICBpZiAoIXBhZ2VOYW1lKSB7XG4gICAgICAgICAgcGFnZU5hbWUgPSBwYWdlLm5vZGVOYW1lXG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLmFkZFVuaXF1ZVBhZ2VNb2RlbChwYWdlTmFtZSlcbiAgICAgIH0pXG4gICAgfVxuXG4gICAgc2VsZWN0KHBhZ2VOYW1lLCBhZGRQYWdlTW9kZWwgPSB0cnVlKSB7XG4gICAgICB0aGlzLmNhY2hlUGFnZVNlbGVjdG9yID0gcGFnZU5hbWVcblxuICAgICAgaWYgKGFkZFBhZ2VNb2RlbCAmJiBwYWdlTmFtZSAhPT0gJyonKSB7XG4gICAgICAgIHRoaXMuYWRkVW5pcXVlUGFnZU1vZGVsKHBhZ2VOYW1lKVxuICAgICAgfVxuXG4gICAgICByZXR1cm4gdGhpc1xuICAgIH1cblxuICAgIHN0YXJ0KGZvcmNlRGVmYXVsdFBhZ2UgPSBmYWxzZSkge1xuICAgICAgLy8gY2hlY2sgaWYgdGhlIGFwcCBoYXMgYmVlbiBhbHJlYWR5IHN0YXJ0ZWRcbiAgICAgIGlmICh0aGlzLnN0YXJ0ZWQpIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKGAke05BTUV9LiBUaGUgYXBwIGhhcyBiZWVuIGFscmVhZHkgc3RhcnRlZC5gKVxuICAgICAgfVxuXG4gICAgICB0aGlzLnN0YXJ0ZWQgPSB0cnVlXG5cbiAgICAgIC8vIGZvcmNlIGRlZmF1bHQgcGFnZSBvbiBDb3Jkb3ZhXG4gICAgICBpZiAod2luZG93LmNvcmRvdmEpIHtcbiAgICAgICAgZm9yY2VEZWZhdWx0UGFnZSA9IHRydWVcbiAgICAgIH1cblxuICAgICAgbGV0IHBhZ2VOYW1lID0gdGhpcy5nZXRQYWdlRnJvbUhhc2goKVxuICAgICAgaWYgKCF0aGlzLmdldFBhZ2VNb2RlbChwYWdlTmFtZSkpIHtcbiAgICAgICAgcGFnZU5hbWUgPSB0aGlzLm9wdGlvbnMuZGVmYXVsdFBhZ2VcbiAgICAgIH1cblxuICAgICAgaWYgKGZvcmNlRGVmYXVsdFBhZ2UgJiYgIXRoaXMub3B0aW9ucy5kZWZhdWx0UGFnZSkge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYCR7TkFNRX0uIFRoZSBkZWZhdWx0IHBhZ2UgbXVzdCBleGlzdCBmb3IgZm9yY2luZyBpdHMgbGF1bmNoIWApXG4gICAgICB9XG5cbiAgICAgIC8qXG4gICAgICAgKiBpZiB0aGUgYXBwIGlzIGNvbmZpZ3VyYXRlZCB0byB1c2UgaGFzaCB0cmFja2luZ1xuICAgICAgICogd2UgYWRkIHRoZSBwYWdlIGR5bmFtaWNhbGx5IGluIHRoZSB1cmxcbiAgICAgICAqL1xuICAgICAgaWYgKHRoaXMub3B0aW9ucy51c2VIYXNoKSB7XG4gICAgICAgIHRoaXMuc2V0SGFzaChwYWdlTmFtZSlcbiAgICAgIH1cblxuICAgICAgdGhpcy5zaG93UGFnZShmb3JjZURlZmF1bHRQYWdlID8gdGhpcy5vcHRpb25zLmRlZmF1bHRQYWdlIDogcGFnZU5hbWUpXG4gICAgfVxuXG4gICAgLy8gc3RhdGljXG4gICAgc3RhdGljIF9ET01JbnRlcmZhY2Uob3B0aW9ucykge1xuICAgICAgcmV0dXJuIG5ldyBQYWdlcihvcHRpb25zKVxuICAgIH1cbiAgfVxuXG4gIHJldHVybiBQYWdlclxufSkoKVxuXG5leHBvcnQgZGVmYXVsdCBQYWdlclxuIiwiLyoqXG4gKiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICogTGljZW5zZWQgdW5kZXIgTUlUIChodHRwczovL2dpdGh1Yi5jb20vcXVhcmstZGV2L1Bob25vbi1GcmFtZXdvcmsvYmxvYi9tYXN0ZXIvTElDRU5TRSlcbiAqIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gKi9cblxuaW1wb3J0IHsgbG9hZEZpbGUgfSBmcm9tICcuLi8uLi9jb21tb24vdXRpbHMnXG5pbXBvcnQgeyBkaXNwYXRjaFBhZ2VFdmVudCB9IGZyb20gJy4uLy4uL2NvbW1vbi9ldmVudHMvZGlzcGF0Y2gnXG5cbmNvbnN0IFBhZ2UgPSAoKCkgPT4ge1xuICAvKipcbiAgICogLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAqIENvbnN0YW50c1xuICAgKiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICovXG5cbiAgY29uc3QgTkFNRSA9ICdwYWdlJ1xuICBjb25zdCBWRVJTSU9OID0gJzIuMC4wJ1xuXG4gIGNvbnN0IFRFTVBMQVRFX1NFTEVDVE9SID0gJ1tkYXRhLXRlbXBsYXRlXSdcblxuICAvKipcbiAgICogLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAqIENsYXNzIERlZmluaXRpb25cbiAgICogLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAqL1xuXG4gIGNsYXNzIFBhZ2Uge1xuICAgIC8qKlxuICAgICAqIENyZWF0ZXMgYW4gaW5zdGFuY2Ugb2YgUGFnZS5cbiAgICAgKiBAcGFyYW0ge3N0cmluZ30gcGFnZU5hbWVcbiAgICAgKi9cbiAgICBjb25zdHJ1Y3RvcihwYWdlTmFtZSkge1xuICAgICAgdGhpcy5uYW1lID0gcGFnZU5hbWVcbiAgICAgIHRoaXMuZXZlbnRzID0gW11cbiAgICAgIHRoaXMudGVtcGxhdGVQYXRoID0gbnVsbFxuICAgICAgdGhpcy5yZW5kZXJGdW5jdGlvbiA9IG51bGxcbiAgICB9XG5cbiAgICAvLyBnZXR0ZXJzXG5cbiAgICBzdGF0aWMgZ2V0IHZlcnNpb24oKSB7XG4gICAgICByZXR1cm4gYCR7TkFNRX0uJHtWRVJTSU9OfWBcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBHZXQgZXZlbnRzXG4gICAgICogQHJldHVybnMge0Z1bmN0aW9uW119XG4gICAgICovXG4gICAgZ2V0RXZlbnRzKCkge1xuICAgICAgcmV0dXJuIHRoaXMuZXZlbnRzXG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogR2V0IHRlbXBsYXRlXG4gICAgICogQHJldHVybnMge3N0cmluZ31cbiAgICAgKi9cbiAgICBnZXRUZW1wbGF0ZSgpIHtcbiAgICAgIHJldHVybiB0aGlzLnRlbXBsYXRlUGF0aFxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEdldCByZW5kZXIgZnVuY3Rpb25cbiAgICAgKiBAcmV0dXJucyB7RnVuY3Rpb259XG4gICAgICovXG4gICAgZ2V0UmVuZGVyRnVuY3Rpb24oKSB7XG4gICAgICByZXR1cm4gdGhpcy5yZW5kZXJGdW5jdGlvblxuICAgIH1cblxuICAgIGxvYWRUZW1wbGF0ZSgpIHtcbiAgICAgIGNvbnN0IHBhZ2VFbGVtZW50ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihgW2RhdGEtcGFnZT1cIiR7dGhpcy5uYW1lfVwiXWApXG5cbiAgICAgIGxvYWRGaWxlKHRoaXMuZ2V0VGVtcGxhdGUoKSwgKHRlbXBsYXRlKSA9PiB7XG4gICAgICAgIGxldCByZW5kZXIgPSBmdW5jdGlvbiAoRE9NUGFnZSwgdGVtcGxhdGUsIGVsZW1lbnRzKSB7XG4gICAgICAgICAgaWYgKGVsZW1lbnRzKSB7XG4gICAgICAgICAgICBBcnJheS5mcm9tKGVsZW1lbnRzKS5mb3JFYWNoKChlbCkgPT4ge1xuICAgICAgICAgICAgICBlbC5pbm5lckhUTUwgPSB0ZW1wbGF0ZVxuICAgICAgICAgICAgfSlcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgRE9NUGFnZS5pbm5lckhUTUwgPSB0ZW1wbGF0ZVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGlmICh0aGlzLmdldFJlbmRlckZ1bmN0aW9uKCkpIHtcbiAgICAgICAgICByZW5kZXIgPSB0aGlzLmdldFJlbmRlckZ1bmN0aW9uKClcbiAgICAgICAgfVxuXG4gICAgICAgIHJlbmRlcihwYWdlRWxlbWVudCwgdGVtcGxhdGUsIHBhZ2VFbGVtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoVEVNUExBVEVfU0VMRUNUT1IpKVxuICAgICAgfSwgbnVsbClcbiAgICB9XG5cbiAgICAvLyBwdWJsaWNcblxuICAgIC8qKlxuICAgICAqXG4gICAgICogQHBhcmFtIHsqfSBjYWxsYmFja0ZuXG4gICAgICovXG4gICAgYWRkRXZlbnRDYWxsYmFjayhjYWxsYmFja0ZuKSB7XG4gICAgICB0aGlzLmV2ZW50cy5wdXNoKGNhbGxiYWNrRm4pXG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogVXNlIHRoZSBnaXZlbiB0ZW1wbGF0ZVxuICAgICAqXG4gICAgICogQHBhcmFtIHtzdHJpbmd9IHRlbXBsYXRlUGF0aFxuICAgICAqL1xuICAgIHVzZVRlbXBsYXRlKHRlbXBsYXRlUGF0aCkge1xuICAgICAgaWYgKHR5cGVvZiB0ZW1wbGF0ZVBhdGggIT09ICdzdHJpbmcnKSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcignVGhlIHRlbXBsYXRlIHBhdGggbXVzdCBiZSBhIHN0cmluZy4gJyArIHR5cGVvZiB0ZW1wbGF0ZVBhdGggKyAnIGlzIGdpdmVuJylcbiAgICAgIH1cbiAgICAgIHRoaXMudGVtcGxhdGVQYXRoID0gdGVtcGxhdGVQYXRoXG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogVXNlIHRoZSBnaXZlbiB0ZW1wbGF0ZSByZW5kZXJlclxuICAgICAqIEBwYXJhbSB7RnVuY3Rpb259IHJlbmRlckZ1bmN0aW9uXG4gICAgICovXG4gICAgdXNlVGVtcGxhdGVSZW5kZXJlcihyZW5kZXJGdW5jdGlvbikge1xuICAgICAgaWYgKHR5cGVvZiByZW5kZXJGdW5jdGlvbiAhPT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ1RoZSBjdXN0b20gdGVtcGxhdGUgcmVuZGVyZXIgbXVzdCBiZSBhIGZ1bmN0aW9uLiAnICsgdHlwZW9mIHJlbmRlckZ1bmN0aW9uICsgJyBpcyBnaXZlbicpXG4gICAgICB9XG4gICAgICB0aGlzLnJlbmRlckZ1bmN0aW9uID0gcmVuZGVyRnVuY3Rpb25cbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBUcmlnZ2VyIHNjb3Blc1xuICAgICAqIEBwYXJhbSB7c3RyaW5nfSBldmVudE5hbWVcbiAgICAgKiBAcGFyYW0ge3t9fSBbZXZlbnRQYXJhbXM9e31dXG4gICAgICovXG4gICAgdHJpZ2dlclNjb3BlcyhldmVudE5hbWUsIGV2ZW50UGFyYW1zID0ge30pIHtcbiAgICAgIGNvbnN0IGV2ZW50TmFtZUFsaWFzID0gYG9uJHtldmVudE5hbWUuY2hhckF0KDApLnRvVXBwZXJDYXNlKCl9JHtldmVudE5hbWUuc2xpY2UoMSl9YFxuXG4gICAgICB0aGlzLmV2ZW50cy5mb3JFYWNoKChzY29wZSkgPT4ge1xuICAgICAgICBjb25zdCBzY29wZUV2ZW50ID0gc2NvcGVbZXZlbnROYW1lXVxuICAgICAgICBjb25zdCBzY29wZUV2ZW50QWxpYXMgPSBzY29wZVtldmVudE5hbWVBbGlhc11cbiAgICAgICAgaWYgKHR5cGVvZiBzY29wZUV2ZW50ID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgICAgc2NvcGVFdmVudC5hcHBseSh0aGlzLCBldmVudFBhcmFtcylcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIHRyaWdnZXIgdGhlIGV2ZW50IGFsaWFzXG4gICAgICAgIGlmICh0eXBlb2Ygc2NvcGVFdmVudEFsaWFzID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgICAgc2NvcGVFdmVudEFsaWFzLmFwcGx5KHRoaXMsIGV2ZW50UGFyYW1zKVxuICAgICAgICB9XG4gICAgICB9KVxuXG4gICAgICBkaXNwYXRjaFBhZ2VFdmVudChldmVudE5hbWUsIHRoaXMubmFtZSwgZXZlbnRQYXJhbXMpXG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIFBhZ2Vcbn0pKClcblxuZXhwb3J0IGRlZmF1bHQgUGFnZVxuIiwiLyoqXG4gKiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICogTGljZW5zZWQgdW5kZXIgTUlUIChodHRwczovL2dpdGh1Yi5jb20vcXVhcmstZGV2L1Bob25vbi1GcmFtZXdvcmsvYmxvYi9tYXN0ZXIvTElDRU5TRSlcbiAqIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gKi9cblxuaW1wb3J0IFBhZ2VyIGZyb20gJy4vaHlicmlkLWFwcHMvcGFnZXIvaW5kZXgnXG5pbXBvcnQgSW50bCBmcm9tICcuL2h5YnJpZC1hcHBzL2ludGwnXG5pbXBvcnQgTmV0d29yayBmcm9tICcuL2NvbW1vbi9uZXR3b3JrJ1xuXG4vLyBjb21wb25lbnRzXG5pbXBvcnQgRGlhbG9nIGZyb20gJy4vY29tcG9uZW50cy9kaWFsb2cnXG5pbXBvcnQgUHJvbXB0IGZyb20gJy4vY29tcG9uZW50cy9kaWFsb2cvcHJvbXB0J1xuaW1wb3J0IENvbmZpcm0gZnJvbSAnLi9jb21wb25lbnRzL2RpYWxvZy9jb25maXJtJ1xuaW1wb3J0IERpYWxvZ0xvYWRlciBmcm9tICcuL2NvbXBvbmVudHMvZGlhbG9nL2xvYWRlcidcbmltcG9ydCBOb3RpZmljYXRpb24gZnJvbSAnLi9jb21wb25lbnRzL25vdGlmaWNhdGlvbidcbmltcG9ydCBDb2xsYXBzZSBmcm9tICcuL2NvbXBvbmVudHMvY29sbGFwc2UnXG5pbXBvcnQgQWNjb3JkaW9uIGZyb20gJy4vY29tcG9uZW50cy9hY2NvcmRpb24nXG5pbXBvcnQgVGFiIGZyb20gJy4vY29tcG9uZW50cy90YWInXG5pbXBvcnQgUHJvZ3Jlc3MgZnJvbSAnLi9jb21wb25lbnRzL3Byb2dyZXNzJ1xuaW1wb3J0IExvYWRlciBmcm9tICcuL2NvbXBvbmVudHMvbG9hZGVyJ1xuaW1wb3J0IE9mZkNhbnZhcyBmcm9tICcuL2NvbXBvbmVudHMvb2ZmLWNhbnZhcydcbmltcG9ydCBEcm9wZG93biBmcm9tICcuL2NvbXBvbmVudHMvZHJvcGRvd24nXG5pbXBvcnQgRHJvcGRvd25TZWFyY2ggZnJvbSAnLi9jb21wb25lbnRzL2Ryb3Bkb3duL3NlYXJjaCdcblxuY29uc3QgYXBpID0ge31cblxuLyoqXG4gKiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAqIFBhZ2VyXG4gKiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAqL1xuYXBpLnBhZ2VyID0gKG9wdGlvbnMpID0+IHtcbiAgaWYgKHR5cGVvZiBhcGkuX3BhZ2VyID09PSAndW5kZWZpbmVkJykge1xuICAgIGFwaS5fcGFnZXIgPSBQYWdlci5fRE9NSW50ZXJmYWNlKG9wdGlvbnMpXG4gIH1cbiAgcmV0dXJuIGFwaS5fcGFnZXJcbn1cblxuLyoqXG4gKiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAqIEludGxcbiAqIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICovXG5hcGkuaW50bCA9IEludGwuX0RPTUludGVyZmFjZVxuXG4vKipcbiAqIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICogTmV0d29ya1xuICogLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gKi9cbmFwaS5uZXR3b3JrID0gTmV0d29yay5fRE9NSW50ZXJmYWNlXG5cbi8qKlxuICogLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gKiBOb3RpZmljYXRpb25cbiAqIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICovXG5hcGkubm90aWZpY2F0aW9uID0gTm90aWZpY2F0aW9uLl9ET01JbnRlcmZhY2VcblxuLyoqXG4gKiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAqIERpYWxvZ1xuICogLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gKi9cbmFwaS5kaWFsb2cgPSAob3B0aW9ucykgPT4ge1xuICBpZiAob3B0aW9ucy50eXBlID09PSBQcm9tcHQuaWRlbnRpZmllcigpKSB7XG4gICAgLy8gcHJvbXB0IGRpYWxvZ1xuICAgIHJldHVybiBQcm9tcHQuX0RPTUludGVyZmFjZShvcHRpb25zKVxuICB9XG5cbiAgaWYgKG9wdGlvbnMudHlwZSA9PT0gQ29uZmlybS5pZGVudGlmaWVyKCkpIHtcbiAgICAvLyBjb25maXJtIGRpYWxvZ1xuICAgIHJldHVybiBDb25maXJtLl9ET01JbnRlcmZhY2Uob3B0aW9ucylcbiAgfVxuXG4gIGlmIChvcHRpb25zLnR5cGUgPT09IERpYWxvZ0xvYWRlci5pZGVudGlmaWVyKCkpIHtcbiAgICAvLyBjb25maXJtIGRpYWxvZ1xuICAgIHJldHVybiBEaWFsb2dMb2FkZXIuX0RPTUludGVyZmFjZShvcHRpb25zKVxuICB9XG5cbiAgLy8gZ2VuZXJpYyBkaWFsb2dcbiAgcmV0dXJuIERpYWxvZy5fRE9NSW50ZXJmYWNlKG9wdGlvbnMpXG59XG5cbi8qKlxuICogLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gKiBDb2xsYXBzZVxuICogLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gKi9cbmFwaS5jb2xsYXBzZSA9IENvbGxhcHNlLl9ET01JbnRlcmZhY2VcblxuLyoqXG4gKiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAqIEFjY29yZGlvblxuICogLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gKi9cbmFwaS5hY2NvcmRpb24gPSBBY2NvcmRpb24uX0RPTUludGVyZmFjZVxuXG5cbi8qKlxuICogLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gKiBUYWJcbiAqIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICovXG5hcGkudGFiID0gVGFiLl9ET01JbnRlcmZhY2VcblxuLyoqXG4gKiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAqIFByb2dyZXNzXG4gKiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAqL1xuYXBpLnByb2dyZXNzID0gUHJvZ3Jlc3MuX0RPTUludGVyZmFjZVxuXG4vKipcbiAqIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICogTG9hZGVyXG4gKiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAqL1xuYXBpLmxvYWRlciA9IExvYWRlci5fRE9NSW50ZXJmYWNlXG5cbi8qKlxuICogLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gKiBPZmYgY2FudmFzXG4gKiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAqL1xuYXBpLm9mZkNhbnZhcyA9IE9mZkNhbnZhcy5fRE9NSW50ZXJmYWNlXG5cbi8qKlxuICogLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gKiBEcm9wZG93blxuICogLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gKi9cbmFwaS5kcm9wZG93biA9IChvcHRpb25zKSA9PiB7XG4gIGlmIChvcHRpb25zLnNlYXJjaCkge1xuICAgIC8vIHNlYXJjaCBkcm9wZG93blxuICAgIHJldHVybiBEcm9wZG93blNlYXJjaC5fRE9NSW50ZXJmYWNlKG9wdGlvbnMpXG4gIH1cblxuICAvLyBnZW5lcmljIGRyb3Bkb3duXG4gIHJldHVybiBEcm9wZG93bi5fRE9NSW50ZXJmYWNlKG9wdGlvbnMpXG59XG5cbi8vIE1ha2UgdGhlIEFQSSBsaXZlXG53aW5kb3cucGhvbm9uID0gYXBpXG5cbmV4cG9ydCBkZWZhdWx0IGFwaVxuIl0sInByZUV4aXN0aW5nQ29tbWVudCI6Ii8vIyBzb3VyY2VNYXBwaW5nVVJMPWRhdGE6YXBwbGljYXRpb24vanNvbjtjaGFyc2V0PXV0Zi04O2Jhc2U2NCxleUoyWlhKemFXOXVJam96TENKemIzVnlZMlZ6SWpwYkltNXZaR1ZmYlc5a2RXeGxjeTlpY205M2MyVnlMWEJoWTJzdlgzQnlaV3gxWkdVdWFuTWlMQ0p6Y21NdmFuTXZZMjl0Ylc5dUwyVjJaVzUwY3k5a2FYTndZWFJqYUM1cWN5SXNJbk55WXk5cWN5OWpiMjF0YjI0dlpYWmxiblJ6TDJsdVpHVjRMbXB6SWl3aWMzSmpMMnB6TDJOdmJXMXZiaTl1WlhSM2IzSnJMMmx1WkdWNExtcHpJaXdpYzNKakwycHpMMk52YlcxdmJpOTFkR2xzY3k5cGJtUmxlQzVxY3lJc0luTnlZeTlxY3k5amIyMXdiMjVsYm5SekwyRmpZMjl5WkdsdmJpOXBibVJsZUM1cWN5SXNJbk55WXk5cWN5OWpiMjF3YjI1bGJuUnpMMk52Ykd4aGNITmxMMmx1WkdWNExtcHpJaXdpYzNKakwycHpMMk52YlhCdmJtVnVkSE12WTI5dGNHOXVaVzUwTG1weklpd2ljM0pqTDJwekwyTnZiWEJ2Ym1WdWRITXZZMjl0Y0c5dVpXNTBUV0Z1WVdkbGNpNXFjeUlzSW5OeVl5OXFjeTlqYjIxd2IyNWxiblJ6TDJScFlXeHZaeTlqYjI1bWFYSnRMbXB6SWl3aWMzSmpMMnB6TDJOdmJYQnZibVZ1ZEhNdlpHbGhiRzluTDJsdVpHVjRMbXB6SWl3aWMzSmpMMnB6TDJOdmJYQnZibVZ1ZEhNdlpHbGhiRzluTDJ4dllXUmxjaTVxY3lJc0luTnlZeTlxY3k5amIyMXdiMjVsYm5SekwyUnBZV3h2Wnk5d2NtOXRjSFF1YW5NaUxDSnpjbU12YW5NdlkyOXRjRzl1Wlc1MGN5OWtjbTl3Wkc5M2JpOXBibVJsZUM1cWN5SXNJbk55WXk5cWN5OWpiMjF3YjI1bGJuUnpMMlJ5YjNCa2IzZHVMM05sWVhKamFDNXFjeUlzSW5OeVl5OXFjeTlqYjIxd2IyNWxiblJ6TDJ4dllXUmxjaTlwYm1SbGVDNXFjeUlzSW5OeVl5OXFjeTlqYjIxd2IyNWxiblJ6TDI1dmRHbG1hV05oZEdsdmJpOXBibVJsZUM1cWN5SXNJbk55WXk5cWN5OWpiMjF3YjI1bGJuUnpMMjltWmkxallXNTJZWE12YVc1a1pYZ3Vhbk1pTENKemNtTXZhbk12WTI5dGNHOXVaVzUwY3k5d2NtOW5jbVZ6Y3k5cGJtUmxlQzVxY3lJc0luTnlZeTlxY3k5amIyMXdiMjVsYm5SekwzUmhZaTlwYm1SbGVDNXFjeUlzSW5OeVl5OXFjeTlvZVdKeWFXUXRZWEJ3Y3k5cGJuUnNMMkpwYm1SbGNpNXFjeUlzSW5OeVl5OXFjeTlvZVdKeWFXUXRZWEJ3Y3k5cGJuUnNMMmx1WkdWNExtcHpJaXdpYzNKakwycHpMMmg1WW5KcFpDMWhjSEJ6TDNCaFoyVnlMMmx1WkdWNExtcHpJaXdpYzNKakwycHpMMmg1WW5KcFpDMWhjSEJ6TDNCaFoyVnlMM0JoWjJVdWFuTWlMQ0p6Y21NdmFuTXZhVzVrWlhndWFuTWlYU3dpYm1GdFpYTWlPbHRkTENKdFlYQndhVzVuY3lJNklrRkJRVUU3T3pzN096dFJRMEZuUWl4dFFpeEhRVUZCTEcxQ08xRkJUVUVzYjBJc1IwRkJRU3h2UWp0UlFVdEJMR2xDTEVkQlFVRXNhVUk3UVVGWVZDeFRRVUZUTEcxQ1FVRlVMRU5CUVRaQ0xGTkJRVGRDTEVWQlFYZERMRlZCUVhoRExFVkJRV2xGTzBGQlFVRXNUVUZCWWl4TlFVRmhMSFZGUVVGS0xFVkJRVWs3TzBGQlEzUkZMRTFCUVUwc1owSkJRVzFDTEZOQlFXNUNMRmxCUVcxRExGVkJRWHBETzBGQlEwRXNVMEZCVHl4aFFVRlFMRU5CUVhGQ0xFbEJRVWtzVjBGQlNpeERRVUZuUWl4aFFVRm9RaXhGUVVFclFpeEZRVUZGTEdOQlFVWXNSVUZCTDBJc1EwRkJja0k3UVVGRFFTeFhRVUZUTEdGQlFWUXNRMEZCZFVJc1NVRkJTU3hYUVVGS0xFTkJRV2RDTEdGQlFXaENMRVZCUVN0Q0xFVkJRVVVzWTBGQlJpeEZRVUV2UWl4RFFVRjJRanRCUVVORU96dEJRVVZOTEZOQlFWTXNiMEpCUVZRc1EwRkJPRUlzVlVGQk9VSXNSVUZCTUVNc1UwRkJNVU1zUlVGQmNVUXNWVUZCY2tRc1JVRkJPRVU3UVVGQlFTeE5RVUZpTEUxQlFXRXNkVVZCUVVvc1JVRkJTVHM3UVVGRGJrWXNUVUZCVFN4blFrRkJiVUlzVTBGQmJrSXNXVUZCYlVNc1ZVRkJla003UVVGRFFTeGhRVUZYTEdGQlFWZ3NRMEZCZVVJc1NVRkJTU3hYUVVGS0xFTkJRV2RDTEdGQlFXaENMRVZCUVN0Q0xFVkJRVVVzWTBGQlJpeEZRVUV2UWl4RFFVRjZRanRCUVVORU96dEJRVVZOTEZOQlFWTXNhVUpCUVZRc1EwRkJNa0lzVTBGQk0wSXNSVUZCYzBNc1VVRkJkRU1zUlVGQk5rUTdRVUZCUVN4TlFVRmlMRTFCUVdFc2RVVkJRVW9zUlVGQlNUczdRVUZEYkVVc1RVRkJUU3huUWtGQmJVSXNVVUZCYmtJc1UwRkJLMElzVTBGQmNrTTdRVUZEUVN4VFFVRlBMR0ZCUVZBc1EwRkJjVUlzU1VGQlNTeFhRVUZLTEVOQlFXZENMR0ZCUVdoQ0xFVkJRU3RDTEVWQlFVVXNZMEZCUml4RlFVRXZRaXhEUVVGeVFqdEJRVU5CTEZkQlFWTXNZVUZCVkN4RFFVRjFRaXhKUVVGSkxGZEJRVW9zUTBGQlowSXNZVUZCYUVJc1JVRkJLMElzUlVGQlJTeGpRVUZHTEVWQlFTOUNMRU5CUVhaQ08wRkJRMFE3T3pzN096czdPMEZEWmtRN1FVRkRRU3hKUVVGSkxFOUJRVThzVFVGQlVDeExRVUZyUWl4WFFVRjBRaXhGUVVGdFF6dEJRVU5xUXl4VFFVRlBMR2RDUVVGUUxFTkJRWGRDTEU5QlFYaENMRVZCUVdsRExGbEJRVTA3UVVGRGNrTXNXVUZCVVN4TFFVRlNMRU5CUVdNc2RVZEJRV1E3UVVGRFJDeEhRVVpFTzBGQlIwUTdPMEZCUlVRN1FVRkRRU3hKUVVGSkxHdENRVUZyUWl4RFFVRkRMRmRCUVVRc1JVRkJZeXhYUVVGa0xFVkJRVEpDTEZOQlFUTkNMRU5CUVhSQ08wRkJRMEVzU1VGQlNTeGpRVUZqTEV0QlFXeENPenRCUVVWQkxFbEJRVWtzVDBGQlR5eE5RVUZRTEV0QlFXdENMRmRCUVhSQ0xFVkJRVzFETzBGQlEycERMRTFCUVVzc2EwSkJRV3RDTEUxQlFXNUNMRWxCUVRoQ0xFOUJRVThzWVVGQlVDeEpRVUYzUWl4dlFrRkJiMElzWVVGQk9VVXNSVUZCTmtZN1FVRkRNMFlzYTBKQlFXTXNTVUZCWkR0QlFVTkJMSE5DUVVGclFpeERRVUZETEZsQlFVUXNSVUZCWlN4WFFVRm1MRVZCUVRSQ0xGVkJRVFZDTEVWQlFYZERMR0ZCUVhoRExFTkJRV3hDTzBGQlEwUTdPMEZCUlVRc1RVRkJTU3hQUVVGUExGTkJRVkFzUTBGQmFVSXNZMEZCY2tJc1JVRkJjVU03UVVGRGJrTXNjMEpCUVd0Q0xFTkJRVU1zWVVGQlJDeEZRVUZuUWl4aFFVRm9RaXhGUVVFclFpeFhRVUV2UWl4RlFVRTBReXhsUVVFMVF5eERRVUZzUWp0QlFVTkVMRWRCUmtRc1RVRkZUeXhKUVVGSkxFOUJRVThzVTBGQlVDeERRVUZwUWl4blFrRkJja0lzUlVGQmRVTTdRVUZETlVNc2MwSkJRV3RDTEVOQlFVTXNaVUZCUkN4RlFVRnJRaXhsUVVGc1FpeEZRVUZ0UXl4aFFVRnVReXhGUVVGclJDeHBRa0ZCYkVRc1EwRkJiRUk3UVVGRFJEdEJRVU5HT3p0QlFVVkVMRWxCUVUwc1MwRkJTeXhUUVVGVExHRkJRVlFzUTBGQmRVSXNTMEZCZGtJc1EwRkJXRHRCUVVOQkxFbEJRVTBzWTBGQll5eERRVU5zUWl4RlFVRkZMRTFCUVUwc1dVRkJVaXhGUVVGelFpeFBRVUZQTEdsQ1FVRTNRaXhGUVVGblJDeExRVUZMTEdWQlFYSkVMRVZCUkd0Q0xFVkJSV3hDTEVWQlFVVXNUVUZCVFN4bFFVRlNMRVZCUVhsQ0xFOUJRVThzYVVKQlFXaERMRVZCUVcxRUxFdEJRVXNzWlVGQmVFUXNSVUZHYTBJc1JVRkhiRUlzUlVGQlJTeE5RVUZOTEdOQlFWSXNSVUZCZDBJc1QwRkJUeXh0UWtGQkwwSXNSVUZCYjBRc1MwRkJTeXhwUWtGQmVrUXNSVUZJYTBJc1JVRkpiRUlzUlVGQlJTeE5RVUZOTEd0Q1FVRlNMRVZCUVRSQ0xFOUJRVThzZFVKQlFXNURMRVZCUVRSRUxFdEJRVXNzY1VKQlFXcEZMRVZCU210Q0xFTkJRWEJDTzBGQlRVRXNTVUZCVFN4aFFVRmhMRU5CUTJwQ0xFVkJRVVVzVFVGQlRTeFhRVUZTTEVWQlFYRkNMRTlCUVU4c1owSkJRVFZDTEVWQlFUaERMRXRCUVVzc1kwRkJia1FzUlVGRWFVSXNSVUZGYWtJc1JVRkJSU3hOUVVGTkxHTkJRVklzUlVGQmQwSXNUMEZCVHl4blFrRkJMMElzUlVGQmFVUXNTMEZCU3l4alFVRjBSQ3hGUVVacFFpeEZRVWRxUWl4RlFVRkZMRTFCUVUwc1lVRkJVaXhGUVVGMVFpeFBRVUZQTEd0Q1FVRTVRaXhGUVVGclJDeExRVUZMTEdkQ1FVRjJSQ3hGUVVocFFpeEZRVWxxUWl4RlFVRkZMRTFCUVUwc2FVSkJRVklzUlVGQk1rSXNUMEZCVHl4elFrRkJiRU1zUlVGQk1FUXNTMEZCU3l4dlFrRkJMMFFzUlVGS2FVSXNRMEZCYmtJN08wRkJUMEVzU1VGQlRTeHJRa0ZCYTBJc1dVRkJXU3hKUVVGYUxFTkJRV2xDTzBGQlFVRXNVMEZCU3l4SFFVRkhMRXRCUVVnc1EwRkJVeXhGUVVGRkxFbEJRVmdzVFVGQmNVSXNVMEZCTVVJN1FVRkJRU3hEUVVGcVFpeEZRVUZ6UkN4TFFVRTVSVHRCUVVOQkxFbEJRVTBzWjBKQlFXZENMRmxCUVZrc1NVRkJXaXhEUVVGcFFqdEJRVUZCTEZOQlFVc3NSMEZCUnl4TFFVRklMRU5CUVZNc1JVRkJSU3hKUVVGWUxFMUJRWEZDTEZOQlFURkNPMEZCUVVFc1EwRkJha0lzUlVGQmMwUXNSMEZCTlVVN1FVRkRRU3hKUVVGTkxHbENRVUZwUWl4WFFVRlhMRWxCUVZnc1EwRkJaMEk3UVVGQlFTeFRRVUZMTEVkQlFVY3NTMEZCU0N4RFFVRlRMRVZCUVVVc1NVRkJXQ3hOUVVGeFFpeFRRVUV4UWp0QlFVRkJMRU5CUVdoQ0xFVkJRWEZFTEV0QlFUVkZPMEZCUTBFc1NVRkJUU3hsUVVGbExGZEJRVmNzU1VGQldDeERRVUZuUWp0QlFVRkJMRk5CUVVzc1IwRkJSeXhMUVVGSUxFTkJRVk1zUlVGQlJTeEpRVUZZTEUxQlFYRkNMRk5CUVRGQ08wRkJRVUVzUTBGQmFFSXNSVUZCY1VRc1IwRkJNVVU3TzJ0Q1FVVmxPMEZCUTJJN1FVRkRRU3huUWtGQll5eFhRVVpFT3p0QlFVbGlPMEZCUTBFc2EwSkJRV2RDTEZGQlRFZzdRVUZOWWl4dFFrRkJhVUlzVTBGT1NqdEJRVTlpTEhkQ1FVRnpRaXhqUVZCVU8wRkJVV0lzWjBOQlFUaENMRzFDUVZKcVFqdEJRVk5pTEdkRFFVRTRRaXh0UWtGVWFrSTdPMEZCVjJJN1FVRkRRU3hSUVVGTkxFMUJXazg3UVVGaFlpeFRRVUZQTEU5QllrMDdRVUZqWWl4UlFVRk5MRTFCWkU4N1FVRmxZaXhWUVVGUkxGRkJaa3M3TzBGQmFVSmlPMEZCUTBFc1VVRkJUU3hOUVd4Q1R6czdRVUZ2UW1JN1FVRkRRU3hUUVVGUExHZENRVUZuUWl4RFFVRm9RaXhEUVhKQ1RUdEJRWE5DWWl4UlFVRk5MR2RDUVVGblFpeERRVUZvUWl4RFFYUkNUenRCUVhWQ1lpeFBRVUZMTEdkQ1FVRm5RaXhEUVVGb1FpeERRWFpDVVR0QlFYZENZaXhWUVVGUkxFOUJRVThzWjBKQlFXZENMRU5CUVdoQ0xFTkJRVkFzUzBGQk9FSXNWMEZCT1VJc1IwRkJORU1zU1VGQk5VTXNSMEZCYlVRc1owSkJRV2RDTEVOQlFXaENMRU5CZUVJNVF6czdRVUV3UW1JN1FVRkRRU3h2UWtGQmEwSXNaVUV6UWt3N1FVRTBRbUlzYTBKQlFXZENMR0ZCTlVKSU96dEJRVGhDWWp0QlFVTkJMRzFDUVVGcFFpeGpRUzlDU2p0QlFXZERZaXhwUWtGQlpTeFpRV2hEUmpzN1FVRnJRMkk3UVVGRFFTeHBRa0ZCWlR0QlFXNURSaXhET3pzN096czdPenM3T3pzN08wRkRja05tT3pzN08wRkJRMEU3T3pzN096czdPenM3SzJWQlVFRTdPenM3T3p0QlFWTkJMRWxCUVUwc1ZVRkJWeXhaUVVGTk8wRkJRM0pDT3pzN096czdRVUZOUVN4TlFVRk5MRTlCUVU4c1UwRkJZanRCUVVOQkxFMUJRVTBzVlVGQlZTeFBRVUZvUWp0QlFVTkJMRTFCUVUwc2NVSkJRWEZDTzBGQlEzcENMR0ZCUVZNc1NVRkVaMEk3UVVGRmVrSXNhMEpCUVdNc1NVRkdWenRCUVVkNlFpeFhRVUZQTzBGQlNHdENMRWRCUVROQ08wRkJTMEVzVFVGQlRTeDNRa0ZCZDBJc1JVRkJPVUk3TzBGQlIwRTdPenM3T3p0QlFXcENjVUlzVFVGMVFtWXNUMEYyUW1VN1FVRkJRVHM3UVVGM1FtNUNPenM3TzBGQlNVRXNkVUpCUVRCQ08wRkJRVUVzVlVGQlpDeFBRVUZqTEhWRlFVRktMRVZCUVVrN08wRkJRVUU3TzBGQlFVRXNiMGhCUTJ4Q0xFbEJSR3RDTEVWQlExb3NUMEZFV1N4RlFVTklMR3RDUVVSSExFVkJRMmxDTEU5QlJHcENMRVZCUXpCQ0xIRkNRVVF4UWl4RlFVTnBSQ3hKUVVScVJDeEZRVU4xUkN4TFFVUjJSRHM3UVVGSGVFSXNXVUZCU3l4SFFVRk1MRWRCUVZjc1NVRkJXRHRCUVVOQkxGbEJRVXNzWVVGQlRDeEhRVUZ4UWl4SlFVRnlRanM3UVVGRlFTeFpRVUZMTEZOQlFVd3NRMEZCWlN4cFFrRkJUU3hqUVVGeVFqczdRVUZGUVN4cFFrRkJWeXhaUVVGTk8wRkJRMllzWTBGQlN5eFZRVUZNTzBGQlEwUXNUMEZHUkN4RlFVVkhMRTFCUVVzc1QwRkJUQ3hEUVVGaExGbEJSbWhDTzBGQlVuZENPMEZCVjNwQ096dEJRWFpEYTBJN1FVRkJRVHRCUVVGQkxHdERRWGxEVUR0QlFVTldMR1ZCUVU4c1MwRkJTeXhOUVVGYU8wRkJRMFE3UVVFelEydENPMEZCUVVFN1FVRkJRU3huUTBFMlExUXNUVUUzUTFNc1JVRTJRMFE3UVVGRGFFSXNZVUZCU3l4TlFVRk1MRWRCUVdNc1RVRkJaRHRCUVVORU8wRkJMME5yUWp0QlFVRkJPMEZCUVVFc2NVTkJhVVJLTzBGQlFVRTdPMEZCUTJJc1lVRkJTeXhIUVVGTUxFZEJRVmNzU1VGQlNTeGpRVUZLTEVWQlFWZzdRVUZEUVN4aFFVRkxMRWRCUVV3c1EwRkJVeXhQUVVGVUxFZEJRVzFDTEV0QlFXNUNPenRCUVVWQkxGbEJRVTBzTUVKQlFYZENMRWxCUVVrc1NVRkJTaXhIUVVGWExFOUJRVmdzUlVGQk9VSTdPMEZCUlVFc1lVRkJTeXhaUVVGTUxFTkJRV3RDTEdsQ1FVRk5MRzlDUVVGNFFpeEZRVUU0UXl4RlFVRkZMRTFCUVUwc1NVRkJTU3hKUVVGS0xFVkJRVklzUlVGQk9VTXNSVUZCYjBVc1MwRkJjRVU3TzBGQlJVRXNZVUZCU3l4SFFVRk1MRU5CUVZNc1NVRkJWQ3hEUVVGakxFMUJRV1FzUlVGQmMwSXNSMEZCZEVJc1JVRkJNa0lzU1VGQk0wSTdPMEZCUlVFc1lVRkJTeXhIUVVGTUxFTkJRVk1zVDBGQlZDeEhRVUZ0UWl4TFFVRkxMRTlCUVV3c1EwRkJZU3hMUVVGaUxFZEJRWEZDTEVOQlFYaERPMEZCUTBFc1lVRkJTeXhIUVVGTUxFTkJRVk1zVTBGQlZDeEhRVUZ4UWl4WlFVRk5PMEZCUTNwQ0xHbENRVUZMTEVkQlFVd3NRMEZCVXl4TFFVRlVPMEZCUTBFc2FVSkJRVXNzUjBGQlRDeEhRVUZYTEVsQlFWZzdRVUZEUkN4VFFVaEVPenRCUVV0QkxHRkJRVXNzUjBGQlRDeERRVUZUTEUxQlFWUXNSMEZCYTBJc1dVRkJUVHRCUVVOMFFpeHBRa0ZCU3l4SlFVRk1PMEZCUTBRc1UwRkdSRHRCUVVkQkxHRkJRVXNzUjBGQlRDeERRVUZUTEU5QlFWUXNSMEZCYlVJc1dVRkJUVHRCUVVOMlFpeHBRa0ZCU3l4TlFVRk1PMEZCUTBRc1UwRkdSRHM3UVVGSlFTeFpRVUZKTzBGQlEwWXNaVUZCU3l4SFFVRk1MRU5CUVZNc1NVRkJWRHRCUVVORUxGTkJSa1FzUTBGRlJTeFBRVUZQTEVOQlFWQXNSVUZCVlR0QlFVTldMR1ZCUVVzc1RVRkJURHRCUVVORU8wRkJRMFk3UVVFM1JXdENPMEZCUVVFN1FVRkJRU3cyUWtFclJWbzdRVUZEVEN4aFFVRkxMRmxCUVV3c1EwRkJhMElzYVVKQlFVMHNORUpCUVhoQ0xFVkJRWE5FTEVWQlFVVXNUVUZCVFN4SlFVRkpMRWxCUVVvc1JVRkJVaXhGUVVGMFJDeEZRVUUwUlN4TFFVRTFSVHM3UVVGRlFTeFpRVUZKTEV0QlFVc3NVMEZCVEN4UFFVRnhRaXhwUWtGQlRTeGpRVUV2UWl4RlFVRXJRenRCUVVNM1F5eGxRVUZMTEZsQlFVd3NRMEZCYTBJc2FVSkJRVTBzWTBGQmVFSXNSVUZCZDBNc1JVRkJSU3hOUVVGTkxFbEJRVWtzU1VGQlNpeEZRVUZTTEVWQlFYaERMRVZCUVRoRUxFdEJRVGxFTzBGQlEwUTdPMEZCUlVRc1lVRkJTeXhUUVVGTUxFTkJRV1VzYVVKQlFVMHNZMEZCY2tJN1FVRkRSRHRCUVhaR2EwSTdRVUZCUVR0QlFVRkJMQ3RDUVhsR1ZqdEJRVU5RTEdGQlFVc3NXVUZCVEN4RFFVRnJRaXhwUWtGQlRTdzBRa0ZCZUVJc1JVRkJjMFFzUlVGQlJTeE5RVUZOTEVsQlFVa3NTVUZCU2l4RlFVRlNMRVZCUVhSRUxFVkJRVFJGTEV0QlFUVkZPenRCUVVWQkxGbEJRVWtzUzBGQlN5eFRRVUZNTEU5QlFYRkNMR2xDUVVGTkxHVkJRUzlDTEVWQlFXZEVPMEZCUXpsRExHVkJRVXNzV1VGQlRDeERRVUZyUWl4cFFrRkJUU3hsUVVGNFFpeEZRVUY1UXl4RlFVRkZMRTFCUVUwc1NVRkJTU3hKUVVGS0xFVkJRVklzUlVGQmVrTXNSVUZCSzBRc1MwRkJMMFE3UVVGRFJEczdRVUZGUkN4aFFVRkxMRk5CUVV3c1EwRkJaU3hwUWtGQlRTeGxRVUZ5UWp0QlFVTkVPMEZCYWtkclFqdEJRVUZCTzBGQlFVRXNiVU5CYlVkT08wRkJRVUU3TzBGQlExZ3NZVUZCU3l4VFFVRk1PenRCUVVWQkxHRkJRVXNzV1VGQlREczdRVUZGUVN4aFFVRkxMR0ZCUVV3c1IwRkJjVUlzV1VGQldTeFpRVUZOTzBGQlEzSkRMR2xDUVVGTExGbEJRVXc3UVVGRFJDeFRRVVp2UWl4RlFVVnNRaXhMUVVGTExFOUJRVXdzUTBGQllTeExRVVpMTEVOQlFYSkNPMEZCUjBRN1FVRXpSMnRDTzBGQlFVRTdRVUZCUVN4clEwRTJSMUE3UVVGRFZpeFpRVUZKTEV0QlFVc3NZVUZCVEN4TFFVRjFRaXhKUVVFelFpeEZRVUZwUXp0QlFVTXZRaXgzUWtGQll5eExRVUZMTEdGQlFXNUNPMEZCUTBFc1pVRkJTeXhoUVVGTUxFZEJRWEZDTEVsQlFYSkNPMEZCUTBRN1FVRkRSanRCUVd4SWEwSTdRVUZCUVR0QlFVRkJMRzlEUVc5SVJTeFBRWEJJUml4RlFXOUlWenRCUVVNMVFpd3lSMEZCTWtJc1QwRkJNMElzUlVGQmIwTXNUMEZCY0VNN1FVRkRSRHRCUVhSSWEwSTdPMEZCUVVFN1FVRkJRVHM3UVVGNVNISkNMRk5CUVU4c1QwRkJVRHRCUVVORUxFTkJNVWhsTEVWQlFXaENPenRyUWtFMFNHVXNUenM3T3pzN096czdVVU53U1VNc1VTeEhRVUZCTEZFN1VVRnZRa0VzVlN4SFFVRkJMRlU3VVVGSlFTeHBRaXhIUVVGQkxHbENPMUZCVjBFc1l5eEhRVUZCTEdNN1VVRlZRU3huUWl4SFFVRkJMR2RDTzBGQk4wTlVMRk5CUVZNc1VVRkJWQ3hEUVVGclFpeEhRVUZzUWl4RlFVRjFRaXhGUVVGMlFpeEZRVUV5UWl4UlFVRXpRaXhGUVVGeFF6dEJRVU14UXl4TlFVRk5MRTFCUVUwc1NVRkJTU3hqUVVGS0xFVkJRVm83UVVGRFFTeE5RVUZKTEVsQlFVa3NaMEpCUVZJc1JVRkJNRUlzU1VGQlNTeG5Ra0ZCU2l4RFFVRnhRaXd3UWtGQmNrSTdRVUZETVVJc1RVRkJTU3hyUWtGQlNpeEhRVUY1UWl4WlFVRk5PMEZCUXpkQ0xGRkJRVWtzU1VGQlNTeFZRVUZLTEV0QlFXMUNMRU5CUVc1Q0xFdEJRWGxDTEZOQlFWTXNTVUZCU1N4TlFVRmlMRVZCUVhGQ0xFVkJRWEpDTEUxQlFUWkNMRWRCUVRkQ0xFbEJRM2hDTEVOQlFVTXNTVUZCU1N4TlFVRk1MRWxCUVdVc1NVRkJTU3haUVVGS0xFTkJRV2xDTEUxQlJHcERMRU5CUVVvc1JVRkRPRU03UVVGRE5VTXNVMEZCUnl4SlFVRkpMRmxCUVZBN1FVRkRSRHRCUVVOR0xFZEJURVE3TzBGQlQwRXNUVUZCU1N4UFFVRlBMRkZCUVZBc1MwRkJiMElzVVVGQmVFSXNSVUZCYTBNN1FVRkRhRU1zVVVGQlNTeEpRVUZLTEVOQlFWTXNTMEZCVkN4RlFVRm5RaXhIUVVGb1FpeEZRVUZ4UWl4SlFVRnlRanRCUVVOQkxGRkJRVWtzU1VGQlNpeERRVUZUTEVWQlFWUTdRVUZEUkN4SFFVaEVMRTFCUjA4N1FVRkRUQ3hSUVVGSkxFbEJRVW9zUTBGQlV5eE5RVUZVTEVWQlFXbENMRWRCUVdwQ0xFVkJRWE5DTEVsQlFYUkNPMEZCUTBFc1VVRkJTU3huUWtGQlNpeERRVUZ4UWl4alFVRnlRaXhGUVVGeFF5eHRRMEZCY2tNN1FVRkRRU3hSUVVGSkxFbEJRVW9zUTBGQlV5eFJRVUZVTzBGQlEwUTdRVUZEUmpzN1FVRkZUU3hUUVVGVExGVkJRVlFzUjBGQmMwSTdRVUZETTBJc1UwRkJUeXhMUVVGTExFMUJRVXdzUjBGQll5eFJRVUZrTEVOQlFYVkNMRVZCUVhaQ0xFVkJRVEpDTEUxQlFUTkNMRU5CUVd0RExFTkJRV3hETEVWQlFYRkRMRVZCUVhKRExFTkJRVkE3UVVGRFJEczdRVUZGVFN4VFFVRlRMR2xDUVVGVUxFTkJRVEpDTEUxQlFUTkNMRVZCUVcxRExGZEJRVzVETEVWQlFXZEVPMEZCUTNKRUxGTkJRVThzVlVGQlZTeFhRVUZYTEZGQlFUVkNMRVZCUVhORExGTkJRVk1zVDBGQlR5eFZRVUYwUkN4RlFVRnJSVHRCUVVOb1JTeFJRVUZKTEU5QlFVOHNVMEZCVUN4RFFVRnBRaXhSUVVGcVFpeERRVUV3UWl4WFFVRXhRaXhEUVVGS0xFVkJRVFJETzBGQlF6RkRMR0ZCUVU4c1RVRkJVRHRCUVVORU8wRkJRMFk3TzBGQlJVUXNVMEZCVHl4SlFVRlFPMEZCUTBRN08wRkJSMDBzVTBGQlV5eGpRVUZVTEVOQlFYZENMRTFCUVhoQ0xFVkJRV2RETEZGQlFXaERMRVZCUVRCRE8wRkJReTlETEZOQlFVOHNWVUZCVlN4WFFVRlhMRkZCUVRWQ0xFVkJRWE5ETEZOQlFWTXNUMEZCVHl4VlFVRjBSQ3hGUVVGclJUdEJRVU5vUlN4UlFVRkpMRTlCUVU4c1dVRkJVQ3hEUVVGdlFpeEpRVUZ3UWl4TlFVRTRRaXhSUVVGc1F5eEZRVUUwUXp0QlFVTXhReXhoUVVGUExFMUJRVkE3UVVGRFJEdEJRVU5HT3p0QlFVVkVMRk5CUVU4c1NVRkJVRHRCUVVORU96dEJRVVZOTEZOQlFWTXNaMEpCUVZRc1EwRkJNRUlzVFVGQk1VSXNSVUZCYTBNc1NVRkJiRU1zUlVGQmQwTTdRVUZETjBNc1UwRkJUeXhWUVVGVkxGZEJRVmNzVVVGQk5VSXNSVUZCYzBNc1UwRkJVeXhQUVVGUExGVkJRWFJFTEVWQlFXdEZPMEZCUTJoRkxGRkJRVWtzVDBGQlR5eFpRVUZRTEVOQlFXOUNMRWxCUVhCQ0xFMUJRVGhDTEVsQlFXeERMRVZCUVhkRE8wRkJRM1JETEdGQlFVOHNUVUZCVUR0QlFVTkVPMEZCUTBZN08wRkJSVVFzVTBGQlR5eEpRVUZRTzBGQlEwUTdPenM3T3pzN096czdPenM3UVVOcVJFUTdPenM3UVVGRFFUczdPenRCUVVOQk96dEJRVU5CT3pzN096czdPenNyWlVGU1FUczdPenM3T3p0QlFWVkJMRWxCUVUwc1dVRkJZU3haUVVGTk8wRkJRM1pDT3pzN096czdRVUZOUVN4TlFVRk5MRTlCUVU4c1YwRkJZanRCUVVOQkxFMUJRVTBzVlVGQlZTeFBRVUZvUWp0QlFVTkJMRTFCUVUwc2NVSkJRWEZDTzBGQlEzcENMR0ZCUVZNN1FVRkVaMElzUjBGQk0wSTdRVUZIUVN4TlFVRk5MSGRDUVVGM1FpeEZRVUU1UWpzN1FVRkhRVHM3T3pzN08wRkJablZDTEUxQmNVSnFRaXhUUVhKQ2FVSTdRVUZCUVRzN1FVRjFRbkpDTEhsQ1FVRXdRanRCUVVGQkxGVkJRV1FzVDBGQll5eDFSVUZCU2l4RlFVRkpPenRCUVVGQk96dEJRVUZCTEhkSVFVTnNRaXhKUVVSclFpeEZRVU5hTEU5QlJGa3NSVUZEU0N4clFrRkVSeXhGUVVOcFFpeFBRVVJxUWl4RlFVTXdRaXh4UWtGRU1VSXNSVUZEYVVRc1MwRkVha1FzUlVGRGQwUXNTMEZFZUVRN08wRkJSM2hDTEZsQlFVc3NVMEZCVEN4SFFVRnBRaXhGUVVGcVFqczdRVUZGUVN4VlFVRk5MRlZCUVZVc1RVRkJTeXhQUVVGTUxFTkJRV0VzVDBGQllpeERRVUZ4UWl4blFrRkJja0lzYjBKQlFYVkVMRWxCUVhaRUxGRkJRV2hDTzBGQlEwRXNXVUZCVFN4SlFVRk9MRU5CUVZjc1QwRkJXQ3hGUVVGdlFpeFBRVUZ3UWl4RFFVRTBRaXhWUVVGRExFMUJRVVFzUlVGQldUdEJRVU4wUXl4WlFVRk5MR0ZCUVdFc1QwRkJUeXhaUVVGUUxFTkJRVzlDTEUxQlFYQkNMRU5CUVc1Q08wRkJRMEVzV1VGQlRTeFhRVUZYTEZOQlFWTXNZVUZCVkN4RFFVRjFRaXhWUVVGMlFpeERRVUZxUWpzN1FVRkZRU3haUVVGSkxGRkJRVW9zUlVGQll6dEJRVU5hTEdkQ1FVRkxMRmRCUVV3c1EwRkJhVUlzVVVGQmFrSTdRVUZEUkR0QlFVTkdMRTlCVUVRN1FVRk9kMEk3UVVGamVrSTdPMEZCY2tOdlFqdEJRVUZCTzBGQlFVRXNjVU5CZFVOT0xFdEJka05OTEVWQmRVTkRPMEZCUTNCQ0xGbEJRVTBzUzBGQlN5eE5RVUZOTEUxQlFVNHNRMEZCWVN4WlFVRmlMRU5CUVRCQ0xFMUJRVEZDTEVOQlFWZzdRVUZEUVN4WlFVRk5MRlZCUVZVc1UwRkJVeXhoUVVGVUxFTkJRWFZDTEVWQlFYWkNMRU5CUVdoQ096dEJRVVZCTEdGQlFVc3NXVUZCVEN4RFFVRnJRaXhQUVVGc1FqdEJRVU5FTzBGQk5VTnZRanRCUVVGQk8wRkJRVUVzYTBOQk9FTlVMRTlCT1VOVExFVkJPRU5CTzBGQlEyNUNMRmxCUVUwc1YwRkJWeXgxUWtGQllUdEJRVU0xUWp0QlFVUTBRaXhUUVVGaUxFTkJRV3BDTzBGQlIwRXNZVUZCU3l4VFFVRk1MRU5CUVdVc1NVRkJaaXhEUVVGdlFpeFJRVUZ3UWpzN1FVRkZRU3hsUVVGUExGRkJRVkE3UVVGRFJEdEJRWEpFYjBJN1FVRkJRVHRCUVVGQkxHdERRWFZFVkN4UFFYWkVVeXhGUVhWRVFUdEJRVU51UWl4WlFVRkpMRmRCUVZjc1MwRkJTeXhUUVVGTUxFTkJRV1VzU1VGQlppeERRVUZ2UWp0QlFVRkJMR2xDUVVGTExFVkJRVVVzVDBGQlJpeERRVUZWTEU5QlFWWXNRMEZCYTBJc1dVRkJiRUlzUTBGQkswSXNTVUZCTDBJc1RVRkJlVU1zVVVGQlVTeFpRVUZTTEVOQlFYRkNMRWxCUVhKQ0xFTkJRVGxETzBGQlFVRXNVMEZCY0VJc1EwRkJaanM3UVVGRlFTeFpRVUZKTEVOQlFVTXNVVUZCVEN4RlFVRmxPMEZCUTJJN1FVRkRRU3h4UWtGQlZ5eExRVUZMTEZkQlFVd3NSVUZCV0R0QlFVTkVPenRCUVVWRUxHVkJRVThzVVVGQlVEdEJRVU5FTzBGQmFFVnZRanRCUVVGQk8wRkJRVUVzY1VOQmEwVk9PMEZCUTJJc1pVRkJUeXhMUVVGTExGTkJRVm83UVVGRFJEdEJRWEJGYjBJN1FVRkJRVHRCUVVGQkxHMURRWE5GVWl4WlFYUkZVU3hGUVhORlRUdEJRVU42UWl4WlFVRk5MRmRCUVZjc1MwRkJTeXhYUVVGTUxFTkJRV2xDTEZsQlFXcENMRU5CUVdwQ08wRkJRMEVzWVVGQlN5eFRRVUZNTEVOQlFXVXNUMEZCWml4RFFVRjFRaXhWUVVGRExFTkJRVVFzUlVGQlR6dEJRVU0xUWl4alFVRkpMRVZCUVVVc1QwRkJSaXhEUVVGVkxFOUJRVllzUTBGQmEwSXNXVUZCYkVJc1EwRkJLMElzU1VGQkwwSXNUVUZCZVVNc1lVRkJZU3haUVVGaUxFTkJRVEJDTEVsQlFURkNMRU5CUVRkRExFVkJRVGhGTzBGQlF6VkZMR05CUVVVc1NVRkJSanRCUVVORUxGZEJSa1FzVFVGRlR6dEJRVU5NTEhGQ1FVRlRMRTFCUVZRN1FVRkRSRHRCUVVOR0xGTkJUa1E3UVVGUFJEdEJRUzlGYjBJN1FVRkJRVHRCUVVGQkxESkNRV2xHYUVJc1ZVRnFSbWRDTEVWQmFVWktPMEZCUTJZc1dVRkJTU3hYUVVGWExGVkJRV1k3UVVGRFFTeFpRVUZKTEU5QlFVOHNWVUZCVUN4TFFVRnpRaXhSUVVFeFFpeEZRVUZ2UXp0QlFVTnNReXh4UWtGQlZ5eFRRVUZUTEdGQlFWUXNRMEZCZFVJc1ZVRkJka0lzUTBGQldEdEJRVU5FT3p0QlFVVkVMRmxCUVVrc1EwRkJReXhSUVVGTUxFVkJRV1U3UVVGRFlpeG5Ra0ZCVFN4SlFVRkpMRXRCUVVvc1EwRkJZU3hKUVVGaUxEQkNRVUZ6UXl4VlFVRjBReXhwUTBGQlRqdEJRVU5FT3p0QlFVVkVMR0ZCUVVzc1dVRkJUQ3hEUVVGclFpeFJRVUZzUWpzN1FVRkZRU3hsUVVGUExFbEJRVkE3UVVGRFJEdEJRVGxHYjBJN1FVRkJRVHRCUVVGQkxESkNRV2RIYUVJc1ZVRm9SMmRDTEVWQlowZEtPMEZCUTJZc1dVRkJTU3hYUVVGWExGVkJRV1k3UVVGRFFTeFpRVUZKTEU5QlFVOHNWVUZCVUN4TFFVRnpRaXhSUVVFeFFpeEZRVUZ2UXp0QlFVTnNReXh4UWtGQlZ5eFRRVUZUTEdGQlFWUXNRMEZCZFVJc1ZVRkJka0lzUTBGQldEdEJRVU5FT3p0QlFVVkVMRmxCUVVrc1EwRkJReXhSUVVGTUxFVkJRV1U3UVVGRFlpeG5Ra0ZCVFN4SlFVRkpMRXRCUVVvc1EwRkJZU3hKUVVGaUxEQkNRVUZ6UXl4VlFVRjBReXhwUTBGQlRqdEJRVU5FT3p0QlFVVkVMRmxCUVUwc1kwRkJZeXhMUVVGTExGZEJRVXdzUTBGQmFVSXNVVUZCYWtJc1EwRkJjRUk3UVVGRFFTeGxRVUZQTEZsQlFWa3NTVUZCV2l4RlFVRlFPMEZCUTBRN1FVRTFSMjlDTzBGQlFVRTdRVUZCUVN4dFEwRTRSMFE3UVVGRGJFSXNaVUZCVHl4SlFVRlFPMEZCUTBRN1FVRm9TRzlDTzBGQlFVRTdRVUZCUVN4dlEwRnJTRUVzVDBGc1NFRXNSVUZyU0ZNN1FVRkROVUlzSzBkQlFUSkNMRk5CUVROQ0xFVkJRWE5ETEU5QlFYUkRPMEZCUTBRN1FVRndTRzlDT3p0QlFVRkJPMEZCUVVFN08wRkJkVWgyUWpzN096czdPenRCUVV0QkxFMUJRVTBzWVVGQllTeEZRVUZ1UWpzN1FVRkZRU3hOUVVGTkxHRkJRV0VzVTBGQlV5eG5Ra0ZCVkN4UFFVRTRRaXhKUVVFNVFpeERRVUZ1UWp0QlFVTkJMRTFCUVVrc1ZVRkJTaXhGUVVGblFqdEJRVU5rTEZWQlFVMHNTVUZCVGl4RFFVRlhMRlZCUVZnc1JVRkJkVUlzVDBGQmRrSXNRMEZCSzBJc1ZVRkJReXhQUVVGRUxFVkJRV0U3UVVGRE1VTXNWVUZCVFN4VFFVRlRMREpEUVVGdlFpeFBRVUZ3UWl4RlFVRTJRaXhyUWtGQk4wSXNSVUZCYVVRc2NVSkJRV3BFTEVOQlFXWTdRVUZEUVN4aFFVRlBMRTlCUVZBc1IwRkJhVUlzVDBGQmFrSTdPMEZCUlVFc2FVSkJRVmNzU1VGQldDeERRVUZuUWl4VlFVRlZMR0ZCUVZZc1EwRkJkMElzVFVGQmVFSXNRMEZCYUVJN1FVRkRSQ3hMUVV4RU8wRkJUVVE3TzBGQlJVUXNWMEZCVXl4blFrRkJWQ3hEUVVFd1FpeFBRVUV4UWl4RlFVRnRReXhWUVVGRExFdEJRVVFzUlVGQlZ6dEJRVU0xUXl4UlFVRk5MR2xDUVVGcFFpeE5RVUZOTEUxQlFVNHNRMEZCWVN4WlFVRmlMRU5CUVRCQ0xHRkJRVEZDTEVOQlFYWkNPMEZCUTBFc1VVRkJTU3hyUWtGQmEwSXNiVUpCUVcxQ0xFbEJRWHBETEVWQlFTdERPMEZCUXpkRExGVkJRVTBzWVVGQllTeE5RVUZOTEUxQlFVNHNRMEZCWVN4WlFVRmlMRU5CUVRCQ0xHRkJRVEZDTEV0QlFUUkRMRTFCUVUwc1RVRkJUaXhEUVVGaExGbEJRV0lzUTBGQk1FSXNUVUZCTVVJc1EwRkJMMFE3UVVGRFFTeFZRVUZOTEdGQlFXRXNVMEZCVXl4aFFVRlVMRU5CUVhWQ0xGVkJRWFpDTEVOQlFXNUNPenRCUVVWQkxGVkJRVTBzV1VGQldTdzRRa0ZCYTBJc1RVRkJUU3hOUVVGNFFpeEZRVUZuUXl4WFFVRm9ReXhEUVVGc1FqczdRVUZGUVN4VlFVRkpMR05CUVdNc1NVRkJiRUlzUlVGQmQwSTdRVUZEZEVJN1FVRkRSRHM3UVVGRlJDeFZRVUZOTEdOQlFXTXNWVUZCVlN4WlFVRldMRU5CUVhWQ0xFbEJRWFpDTEVOQlFYQkNPMEZCUTBFc1ZVRkJUU3haUVVGWkxGZEJRVmNzU1VGQldDeERRVUZuUWp0QlFVRkJMR1ZCUVVzc1JVRkJSU3hWUVVGR0xFZEJRV1VzV1VGQlppeERRVUUwUWl4SlFVRTFRaXhOUVVGelF5eFhRVUV6UXp0QlFVRkJMRTlCUVdoQ0xFTkJRV3hDT3p0QlFVVkJMRlZCUVVrc1EwRkJReXhUUVVGTUxFVkJRV2RDTzBGQlEyUTdRVUZEUkRzN1FVRkZSRHRCUVVOQkxGVkJRVTBzYVVKQlFXbENMRlZCUVZVc1dVRkJWaXhIUVVGNVFpeEpRVUY2UWl4RFFVRTRRanRCUVVGQkxHVkJRVXNzUlVGQlJTeFZRVUZHTEU5QlFXMUNMRlZCUVhoQ08wRkJRVUVzVDBGQk9VSXNRMEZCZGtJN1FVRkRRU3hWUVVGSkxFTkJRVU1zWTBGQlRDeEZRVUZ4UWp0QlFVTnVRaXhyUWtGQlZTeFhRVUZXTEVOQlFYTkNMRlZCUVhSQ08wRkJRMFE3TzBGQlJVUXNaMEpCUVZVc1NVRkJWaXhEUVVGbExGVkJRV1k3UVVGRFJEdEJRVU5HTEVkQk0wSkVPenRCUVRaQ1FTeFRRVUZQTEZOQlFWQTdRVUZEUkN4RFFYUkxhVUlzUlVGQmJFSTdPMnRDUVhkTFpTeFRPenM3T3pzN096czdPenM3TzBGRE4wdG1PenM3TzBGQlEwRTdPMEZCUTBFN096czdRVUZEUVRzN096czdPenM3SzJWQlVrRTdPenM3T3pzN1FVRlZRU3hKUVVGTkxGZEJRVmtzV1VGQlRUdEJRVU4wUWpzN096czdPMEZCVFVFc1RVRkJUU3hQUVVGUExGVkJRV0k3UVVGRFFTeE5RVUZOTEZWQlFWVXNUMEZCYUVJN1FVRkRRU3hOUVVGTkxIRkNRVUZ4UWp0QlFVTjZRaXhoUVVGVExFbEJSR2RDTzBGQlJYcENMRmxCUVZFN1FVRkdhVUlzUjBGQk0wSTdRVUZKUVN4TlFVRk5MSGRDUVVGM1FpeERRVU0xUWl4UlFVUTBRaXhEUVVFNVFqczdRVUZKUVRzN096czdPMEZCYWtKelFpeE5RWFZDYUVJc1VVRjJRbWRDTzBGQlFVRTdPMEZCZVVKd1FpeDNRa0ZCTUVJN1FVRkJRU3hWUVVGa0xFOUJRV01zZFVWQlFVb3NSVUZCU1RzN1FVRkJRVHM3UVVGQlFTeHpTRUZEYkVJc1NVRkVhMElzUlVGRFdpeFBRVVJaTEVWQlEwZ3NhMEpCUkVjc1JVRkRhVUlzVDBGRWFrSXNSVUZETUVJc2NVSkJSREZDTEVWQlEybEVMRXRCUkdwRUxFVkJRM2RFTEV0QlJIaEVPenRCUVVkNFFpeFpRVUZMTEZsQlFVd3NSMEZCYjBJc1MwRkJjRUk3TzBGQlJVRTdRVUZEUVN4VlFVRkpMRTFCUVVzc1QwRkJUQ3hEUVVGaExFMUJRV3BDTEVWQlFYbENPMEZCUTNaQ0xHTkJRVXNzU1VGQlREdEJRVU5FTzBGQlVuVkNPMEZCVTNwQ096dEJRV3hEYlVJN1FVRkJRVHRCUVVGQkxHdERRVzlEVWp0QlFVTldMR1ZCUVU4c1MwRkJTeXhQUVVGTUxFTkJRV0VzVDBGQllpeERRVUZ4UWl4eFFrRkJja0lzUTBGQk1rTXNTMEZCU3l4UFFVRk1MRU5CUVdFc1QwRkJlRVFzUlVGQmFVVXNUVUZCZUVVN1FVRkRSRHRCUVhSRGJVSTdRVUZCUVR0QlFVRkJMQ3RDUVhkRFdEdEJRVU5RTEZsQlFVa3NTMEZCU3l4UFFVRk1MRU5CUVdFc1QwRkJZaXhEUVVGeFFpeFRRVUZ5UWl4RFFVRXJRaXhSUVVFdlFpeERRVUYzUXl4TlFVRjRReXhEUVVGS0xFVkJRWEZFTzBGQlEyNUVMR2xDUVVGUExFdEJRVXNzU1VGQlRDeEZRVUZRTzBGQlEwUTdPMEZCUlVRc1pVRkJUeXhMUVVGTExFbEJRVXdzUlVGQlVEdEJRVU5FTzBGQk9VTnRRanRCUVVGQk8wRkJRVUVzTmtKQlowUmlPMEZCUVVFN08wRkJRMHdzV1VGQlNTeExRVUZMTEZsQlFWUXNSVUZCZFVJN1FVRkRja0lzYVVKQlFVOHNTMEZCVUR0QlFVTkVPenRCUVVWRUxGbEJRVWtzUzBGQlN5eFBRVUZNTEVOQlFXRXNUMEZCWWl4RFFVRnhRaXhUUVVGeVFpeERRVUVyUWl4UlFVRXZRaXhEUVVGM1F5eE5RVUY0UXl4RFFVRktMRVZCUVhGRU8wRkJRMjVFTEdsQ1FVRlBMRXRCUVZBN1FVRkRSRHM3UVVGRlJDeGhRVUZMTEZsQlFVd3NSMEZCYjBJc1NVRkJjRUk3TzBGQlJVRXNXVUZCVFN4alFVRmpMRk5CUVdRc1YwRkJZeXhIUVVGTk8wRkJRM2hDTEdsQ1FVRkxMRTlCUVV3c1EwRkJZU3hQUVVGaUxFTkJRWEZDTEZOQlFYSkNMRU5CUVN0Q0xFZEJRUzlDTEVOQlFXMURMRTFCUVc1RE8wRkJRMEVzYVVKQlFVc3NUMEZCVEN4RFFVRmhMRTlCUVdJc1EwRkJjVUlzVTBGQmNrSXNRMEZCSzBJc1RVRkJMMElzUTBGQmMwTXNXVUZCZEVNN1FVRkRRU3hwUWtGQlN5eFBRVUZNTEVOQlFXRXNUMEZCWWl4RFFVRnhRaXh0UWtGQmNrSXNRMEZCZVVNc2FVSkJRVTBzWTBGQkwwTXNSVUZCSzBRc1YwRkJMMFE3TzBGQlJVRXNhVUpCUVVzc1QwRkJUQ3hEUVVGaExFOUJRV0lzUTBGQmNVSXNXVUZCY2tJc1EwRkJhME1zWlVGQmJFTXNSVUZCYlVRc1NVRkJia1E3TzBGQlJVRXNhVUpCUVVzc1dVRkJUQ3hIUVVGdlFpeExRVUZ3UWp0QlFVTkVMRk5CVWtRN08wRkJWVUVzV1VGQlNTeERRVUZETEV0QlFVc3NUMEZCVEN4RFFVRmhMRTlCUVdJc1EwRkJjVUlzVTBGQmNrSXNRMEZCSzBJc1VVRkJMMElzUTBGQmQwTXNXVUZCZUVNc1EwRkJUQ3hGUVVFMFJEdEJRVU14UkN4bFFVRkxMRTlCUVV3c1EwRkJZU3hQUVVGaUxFTkJRWEZDTEZOQlFYSkNMRU5CUVN0Q0xFZEJRUzlDTEVOQlFXMURMRmxCUVc1RE8wRkJRMFE3TzBGQlJVUXNZVUZCU3l4UFFVRk1MRU5CUVdFc1QwRkJZaXhEUVVGeFFpeG5Ra0ZCY2tJc1EwRkJjME1zYVVKQlFVMHNZMEZCTlVNc1JVRkJORVFzVjBGQk5VUTdPMEZCUlVFc1dVRkJUU3hUUVVGVExFdEJRVXNzVTBGQlRDeEZRVUZtT3p0QlFVVkJMR0ZCUVVzc1QwRkJUQ3hEUVVGaExFOUJRV0lzUTBGQmNVSXNTMEZCY2tJc1EwRkJNa0lzVFVGQk0wSXNSMEZCYjBNc1MwRkJjRU03TzBGQlJVRXNiVUpCUVZjc1dVRkJUVHRCUVVObUxHbENRVUZMTEU5QlFVd3NRMEZCWVN4UFFVRmlMRU5CUVhGQ0xFdEJRWEpDTEVOQlFUSkNMRTFCUVROQ0xFZEJRWFZETEUxQlFYWkRPMEZCUTBRc1UwRkdSQ3hGUVVWSExFVkJSa2c3TzBGQlNVRXNaVUZCVHl4SlFVRlFPMEZCUTBRN1FVRndSbTFDTzBGQlFVRTdRVUZCUVN3MlFrRnpSbUk3UVVGQlFUczdRVUZEVEN4WlFVRkpMRXRCUVVzc1dVRkJWQ3hGUVVGMVFqdEJRVU55UWl4cFFrRkJUeXhMUVVGUU8wRkJRMFE3TzBGQlJVUXNXVUZCU1N4RFFVRkRMRXRCUVVzc1QwRkJUQ3hEUVVGaExFOUJRV0lzUTBGQmNVSXNVMEZCY2tJc1EwRkJLMElzVVVGQkwwSXNRMEZCZDBNc1RVRkJlRU1zUTBGQlRDeEZRVUZ6UkR0QlFVTndSQ3hwUWtGQlR5eExRVUZRTzBGQlEwUTdPMEZCUlVRc1lVRkJTeXhaUVVGTUxFZEJRVzlDTEVsQlFYQkNPenRCUVVWQkxGbEJRVTBzWTBGQll5eFRRVUZrTEZkQlFXTXNSMEZCVFR0QlFVTjRRaXhwUWtGQlN5eFBRVUZNTEVOQlFXRXNUMEZCWWl4RFFVRnhRaXhUUVVGeVFpeERRVUVyUWl4TlFVRXZRaXhEUVVGelF5eFpRVUYwUXp0QlFVTkJMR2xDUVVGTExFOUJRVXdzUTBGQllTeFBRVUZpTEVOQlFYRkNMRXRCUVhKQ0xFTkJRVEpDTEUxQlFUTkNMRWRCUVc5RExFMUJRWEJETzBGQlEwRXNhVUpCUVVzc1QwRkJUQ3hEUVVGaExFOUJRV0lzUTBGQmNVSXNiVUpCUVhKQ0xFTkJRWGxETEdsQ1FVRk5MR05CUVM5RExFVkJRU3RFTEZkQlFTOUVPenRCUVVWQkxHbENRVUZMTEU5QlFVd3NRMEZCWVN4UFFVRmlMRU5CUVhGQ0xGbEJRWEpDTEVOQlFXdERMR1ZCUVd4RExFVkJRVzFFTEV0QlFXNUVPenRCUVVWQkxHbENRVUZMTEZsQlFVd3NSMEZCYjBJc1MwRkJjRUk3UVVGRFJDeFRRVkpFT3p0QlFWVkJMR0ZCUVVzc1QwRkJUQ3hEUVVGaExFOUJRV0lzUTBGQmNVSXNTMEZCY2tJc1EwRkJNa0lzVFVGQk0wSXNSMEZCYjBNc1MwRkJjRU03TzBGQlJVRXNXVUZCU1N4RFFVRkRMRXRCUVVzc1QwRkJUQ3hEUVVGaExFOUJRV0lzUTBGQmNVSXNVMEZCY2tJc1EwRkJLMElzVVVGQkwwSXNRMEZCZDBNc1dVRkJlRU1zUTBGQlRDeEZRVUUwUkR0QlFVTXhSQ3hsUVVGTExFOUJRVXdzUTBGQllTeFBRVUZpTEVOQlFYRkNMRk5CUVhKQ0xFTkJRU3RDTEVkQlFTOUNMRU5CUVcxRExGbEJRVzVETzBGQlEwUTdPMEZCUlVRc1lVRkJTeXhQUVVGTUxFTkJRV0VzVDBGQllpeERRVUZ4UWl4blFrRkJja0lzUTBGQmMwTXNhVUpCUVUwc1kwRkJOVU1zUlVGQk5FUXNWMEZCTlVRN08wRkJSVUVzWVVGQlN5eFBRVUZNTEVOQlFXRXNUMEZCWWl4RFFVRnhRaXhUUVVGeVFpeERRVUVyUWl4TlFVRXZRaXhEUVVGelF5eE5RVUYwUXpzN1FVRkZRU3hsUVVGUExFbEJRVkE3UVVGRFJEdEJRWFJJYlVJN1FVRkJRVHRCUVVGQkxHMURRWGRJUVR0QlFVTnNRaXhsUVVGUExFbEJRVkE3UVVGRFJEdEJRVEZJYlVJN1FVRkJRVHRCUVVGQkxHOURRVFJJUXl4UFFUVklSQ3hGUVRSSVZUdEJRVU0xUWl3MlIwRkJNa0lzVVVGQk0wSXNSVUZCY1VNc1QwRkJja003UVVGRFJEdEJRVGxJYlVJN08wRkJRVUU3UVVGQlFUczdRVUZwU1hSQ096czdPenM3TzBGQlMwRXNUVUZCVFN4aFFVRmhMRVZCUVc1Q096dEJRVVZCTEUxQlFVMHNXVUZCV1N4VFFVRlRMR2RDUVVGVUxFOUJRVGhDTEVsQlFUbENMRU5CUVd4Q08wRkJRMEVzVFVGQlNTeFRRVUZLTEVWQlFXVTdRVUZEWWl4alFVRlZMRTlCUVZZc1EwRkJhMElzVlVGQlF5eFBRVUZFTEVWQlFXRTdRVUZETjBJN1FVRkRRU3hWUVVGTkxGTkJRVk1zTWtOQlFXOUNMRTlCUVhCQ0xFVkJRVFpDTEd0Q1FVRTNRaXhGUVVGcFJDeHhRa0ZCYWtRc1EwRkJaanRCUVVOQkxHRkJRVThzVDBGQlVDeEhRVUZwUWl4UFFVRnFRanM3UVVGRlFTeHBRa0ZCVnl4SlFVRllMRU5CUVdkQ0xGTkJRVk1zWVVGQlZDeERRVUYxUWl4TlFVRjJRaXhEUVVGb1FqdEJRVU5FTEV0QlRrUTdRVUZQUkRzN1FVRkZSQ3hYUVVGVExHZENRVUZVTEVOQlFUQkNMRTlCUVRGQ0xFVkJRVzFETEZWQlFVTXNTMEZCUkN4RlFVRlhPMEZCUXpWRExGRkJRVTBzVTBGQlV5dzJRa0ZCYVVJc1RVRkJUU3hOUVVGMlFpeEZRVUVyUWl4aFFVRXZRaXhEUVVGbU8wRkJRMEVzVVVGQlNTeERRVUZETEUxQlFVd3NSVUZCWVR0QlFVTllPMEZCUTBRN08wRkJSVVFzVVVGQlRTeHBRa0ZCYVVJc1QwRkJUeXhaUVVGUUxFTkJRVzlDTEdGQlFYQkNMRU5CUVhaQ096dEJRVVZCTEZGQlFVa3NhMEpCUVd0Q0xHMUNRVUZ0UWl4SlFVRjZReXhGUVVFclF6dEJRVU0zUXl4VlFVRkpMRXRCUVVzc1QwRkJUeXhaUVVGUUxFTkJRVzlDTEdGQlFYQkNMRXRCUVhORExFOUJRVThzV1VGQlVDeERRVUZ2UWl4TlFVRndRaXhEUVVFdlF6dEJRVU5CTEZkQlFVc3NSMEZCUnl4UFFVRklMRU5CUVZjc1IwRkJXQ3hGUVVGblFpeEZRVUZvUWl4RFFVRk1PenRCUVVWQkxGVkJRVTBzV1VGQldTeFhRVUZYTEVsQlFWZ3NRMEZCWjBJN1FVRkJRU3hsUVVGTExFVkJRVVVzVlVGQlJpeEhRVUZsTEZsQlFXWXNRMEZCTkVJc1NVRkJOVUlzVFVGQmMwTXNSVUZCTTBNN1FVRkJRU3hQUVVGb1FpeERRVUZzUWpzN1FVRkZRU3hWUVVGSkxFTkJRVU1zVTBGQlRDeEZRVUZuUWp0QlFVTmtPMEZCUTBRN08wRkJSVVFzWjBKQlFWVXNUVUZCVmp0QlFVTkVPMEZCUTBZc1IwRndRa1E3TzBGQmMwSkJMRk5CUVU4c1VVRkJVRHRCUVVORUxFTkJNVXRuUWl4RlFVRnFRanM3YTBKQk5FdGxMRkU3T3pzN096czdPenR4YWtKRGRFeG1PenM3T3pzN08wRkJTMEU3TzBGQlEwRTdPMEZCUTBFN096czdRVUZEUVRzN096czdPenM3UVVGRlFUczdPenM3TzBsQlRYRkNMRk03UVVGRmJrSXNjVUpCUVZrc1NVRkJXaXhGUVVGclFpeFBRVUZzUWl4RlFVRnRTVHRCUVVGQkxGRkJRWGhITEdOQlFYZEhMSFZGUVVGMlJpeEZRVUYxUmp0QlFVRkJMRkZCUVc1R0xFOUJRVzFHTEhWRlFVRjZSU3hGUVVGNVJUdEJRVUZCTEZGQlFYSkZMRmRCUVhGRkxIVkZRVUYyUkN4RlFVRjFSRHM3UVVGQlFUczdRVUZCUVN4UlFVRnVSQ3h4UWtGQmJVUXNkVVZCUVROQ0xFdEJRVEpDTzBGQlFVRXNVVUZCY0VJc1ZVRkJiMElzZFVWQlFWQXNTMEZCVHpzN1FVRkJRVHM3UVVGRGFra3NVMEZCU3l4SlFVRk1MRWRCUVZrc1NVRkJXanRCUVVOQkxGTkJRVXNzVDBGQlRDeEhRVUZsTEU5QlFXWTdRVUZEUVN4VFFVRkxMRTlCUVV3c1IwRkJaU3hQUVVGbU96dEJRVVZCTzBGQlEwRTdRVUZEUVN4WFFVRlBMRWxCUVZBc1EwRkJXU3hqUVVGYUxFVkJRVFJDTEU5QlFUVkNMRU5CUVc5RExGVkJRVU1zU1VGQlJDeEZRVUZWTzBGQlF6VkRMRlZCUVVrc1QwRkJUeXhOUVVGTExFOUJRVXdzUTBGQllTeEpRVUZpTEVOQlFWQXNTMEZCT0VJc1YwRkJiRU1zUlVGQkswTTdRVUZETjBNc1kwRkJTeXhQUVVGTUxFTkJRV0VzU1VGQllpeEpRVUZ4UWl4bFFVRmxMRWxCUVdZc1EwRkJja0k3UVVGRFJEdEJRVU5HTEV0QlNrUTdPMEZCVFVFc1UwRkJTeXhYUVVGTUxFZEJRVzFDTEZkQlFXNUNPMEZCUTBFc1UwRkJTeXh4UWtGQlRDeEhRVUUyUWl4eFFrRkJOMEk3UVVGRFFTeFRRVUZMTEZWQlFVd3NSMEZCYTBJc1ZVRkJiRUk3UVVGRFFTeFRRVUZMTEVWQlFVd3NSMEZCVlN4M1FrRkJWanM3UVVGRlFTeFJRVUZOTEdWQlFXVXNRMEZCUXl4TFFVRkxMSEZDUVVGT0xFbEJRU3RDTEV0QlFVc3NUMEZCVEN4RFFVRmhMRTlCUVdJc1MwRkJlVUlzU1VGQk4wVTdPMEZCUlVFc1VVRkJTU3hQUVVGUExFdEJRVXNzVDBGQlRDeERRVUZoTEU5QlFYQkNMRXRCUVdkRExGRkJRWEJETEVWQlFUaERPMEZCUXpWRExGZEJRVXNzVDBGQlRDeERRVUZoTEU5QlFXSXNSMEZCZFVJc1UwRkJVeXhoUVVGVUxFTkJRWFZDTEV0QlFVc3NUMEZCVEN4RFFVRmhMRTlCUVhCRExFTkJRWFpDTzBGQlEwUTdPMEZCUlVRc1VVRkJTU3huUWtGQlowSXNRMEZCUXl4TFFVRkxMRTlCUVV3c1EwRkJZU3hQUVVGc1F5eEZRVUV5UXp0QlFVTjZReXhaUVVGTkxFbEJRVWtzUzBGQlNpeERRVUZoTEV0QlFVc3NTVUZCYkVJc2VVTkJRVTQ3UVVGRFJEczdRVUZGUkN4VFFVRkxMR05CUVV3c1IwRkJjMElzUzBGQlN5eFBRVUZNTEVOQlFXRXNUMEZCWWl4TFFVRjVRaXhKUVVFdlF6dEJRVU5CTEZOQlFVc3NhMEpCUVV3c1IwRkJNRUlzUlVGQk1VSTdPMEZCUlVFc1VVRkJTU3hEUVVGRExFdEJRVXNzWTBGQlZpeEZRVUV3UWp0QlFVTjRRanM3T3pzN096czdRVUZSUVN4WFFVRkxMRTlCUVV3c1IwRkJaU3hQUVVGUExFMUJRVkFzUTBGQll5eExRVUZMTEU5QlFXNUNMRVZCUVRSQ0xFdEJRVXNzWTBGQlRDeERRVUZ2UWl4TFFVRkxMR0ZCUVV3c1JVRkJjRUlzUlVGQk1FTXNUMEZCTVVNc1EwRkJOVUlzUTBGQlpqczdRVUZGUVR0QlFVTkJMRmRCUVVzc1lVRkJURHRCUVVORU96dEJRVVZFTEZOQlFVc3NaVUZCVEN4SFFVRjFRanRCUVVGQkxHRkJRVk1zVFVGQlN5eHZRa0ZCVEN4RFFVRXdRaXhMUVVFeFFpeERRVUZVTzBGQlFVRXNTMEZCZGtJN1FVRkRSRHM3T3p0dFEwRkZZeXhWTEVWQlFWa3NUeXhGUVVGVE8wRkJRMnhETEZkQlFVc3NWMEZCVEN4RFFVRnBRaXhQUVVGcVFpeERRVUY1UWl4VlFVRkRMRWRCUVVRc1JVRkJVenRCUVVOb1F5eFpRVUZKTEZGQlFWRXNSMEZCVWl4RFFVRktMRVZCUVd0Q08wRkJRMmhDTEhGQ1FVRlhMRWRCUVZnc1NVRkJhMElzVVVGQlVTeEhRVUZTTEVOQlFXeENPMEZCUTBRN1FVRkRSaXhQUVVwRU96dEJRVTFCTEdGQlFVOHNWVUZCVUR0QlFVTkVPenM3YVVOQlJWazdRVUZEV0N4aFFVRlBMRXRCUVVzc1QwRkJXanRCUVVORU96czdhVU5CUlZrN1FVRkRXQ3hoUVVGUExFdEJRVXNzVDBGQlRDeERRVUZoTEU5QlFYQkNPMEZCUTBRN096czBRa0ZGVHp0QlFVTk9MR0ZCUVU4c1MwRkJTeXhGUVVGYU8wRkJRMFE3T3p0eFEwRkZaMElzVVN4RlFVRlZPMEZCUVVFN08wRkJRM3BDTEdWQlFWTXNUMEZCVkN4RFFVRnBRanRCUVVGQkxHVkJRVmNzVDBGQlN5eGxRVUZNTEVOQlFYRkNMRTlCUVhKQ0xFTkJRVmc3UVVGQlFTeFBRVUZxUWp0QlFVTkVPenM3YjBOQlJXVXNUeXhGUVVGVE8wRkJRM1pDTEdOQlFWRXNUVUZCVWl4RFFVRmxMR2RDUVVGbUxFTkJRV2RETEZGQlFWRXNTMEZCZUVNc1JVRkJLME1zUzBGQlN5eGxRVUZ3UkR0QlFVTkJMRmRCUVVzc2EwSkJRVXdzUTBGQmQwSXNTVUZCZUVJc1EwRkJOa0lzVDBGQk4wSTdRVUZEUkRzN08zbERRVVZ2UWp0QlFVRkJPenRCUVVOdVFpeFhRVUZMTEd0Q1FVRk1MRU5CUVhkQ0xFOUJRWGhDTEVOQlFXZERMRlZCUVVNc1QwRkJSQ3hGUVVGaE8wRkJRek5ETEdWQlFVc3NhVUpCUVV3c1EwRkJkVUlzVDBGQmRrSTdRVUZEUkN4UFFVWkVPMEZCUjBRN096dHpRMEZGYVVJc1R5eEZRVUZUTzBGQlEzcENMRlZCUVUwc2VVSkJRWGxDTEV0QlFVc3NhMEpCUVV3c1EwRkROVUlzVTBGRU5FSXNRMEZEYkVJN1FVRkJRU3hsUVVGTkxFZEJRVWNzVFVGQlNDeExRVUZqTEZGQlFWRXNUVUZCZEVJc1NVRkJaME1zUjBGQlJ5eExRVUZJTEV0QlFXRXNVVUZCVVN4TFFVRXpSRHRCUVVGQkxFOUJSR3RDTEVOQlFTOUNPenRCUVVkQkxGVkJRVWtzZVVKQlFYbENMRU5CUVVNc1EwRkJPVUlzUlVGQmFVTTdRVUZETDBJc1owSkJRVkVzVFVGQlVpeERRVUZsTEcxQ1FVRm1MRU5CUVcxRExGRkJRVkVzUzBGQk0wTXNSVUZCYTBRc1MwRkJTeXhsUVVGMlJEdEJRVU5CTEdGQlFVc3NhMEpCUVV3c1EwRkJkMElzVFVGQmVFSXNRMEZCSzBJc2MwSkJRUzlDTEVWQlFYVkVMRU5CUVhaRU8wRkJRMFFzVDBGSVJDeE5RVWRQTzBGQlEwd3NaMEpCUVZFc1MwRkJVaXd5UTBGQmMwUXNVVUZCVVN4TlFVRTVSQ3h4UWtGQmIwWXNVVUZCVVN4TFFVRTFSanRCUVVORU8wRkJRMFk3T3p0cFEwRkZXU3hUTEVWQlFXbEVPMEZCUVVFc1ZVRkJkRU1zVFVGQmMwTXNkVVZCUVRkQ0xFVkJRVFpDTzBGQlFVRXNWVUZCZWtJc1pVRkJlVUlzZFVWQlFWQXNTMEZCVHpzN1FVRkROVVFzVlVGQlNTeFBRVUZQTEZOQlFWQXNTMEZCY1VJc1VVRkJla0lzUlVGQmJVTTdRVUZEYWtNc1kwRkJUU3hKUVVGSkxFdEJRVW9zUTBGQlZTdzRRa0ZCVml4RFFVRk9PMEZCUTBRN08wRkJSVVFzVlVGQlNTeExRVUZMTEZWQlFWUXNSVUZCY1VJN1FVRkRia0lzV1VGQlNTeGpRVUZqTEdsQ1FVRk5MRWxCUVhoQ0xFVkJRVGhDTzBGQlF6VkNMSEZEUVVGcFFpeEhRVUZxUWl4RFFVRnhRaXhKUVVGeVFqdEJRVU5FTEZOQlJrUXNUVUZGVHl4SlFVRkpMR05CUVdNc2FVSkJRVTBzU1VGQmVFSXNSVUZCT0VJN1FVRkRia01zY1VOQlFXbENMRTFCUVdwQ0xFTkJRWGRDTEVsQlFYaENPMEZCUTBRN1FVRkRSanM3UVVGRlJEdEJRVU5CTEZWQlFVMHNhMEpCUVd0Q0xGVkJRVlVzUzBGQlZpeERRVUZuUWl4SFFVRm9RaXhGUVVGeFFpeE5RVUZ5UWl4RFFVRTBRaXhWUVVGRExFZEJRVVFzUlVGQlRTeFBRVUZPTEVWQlFXVXNTMEZCWml4RlFVRjVRanRCUVVNelJTeFpRVUZKTEZWQlFWVXNRMEZCWkN4RlFVRnBRanRCUVVObUxHbENRVUZQTEU5QlFWQTdRVUZEUkRzN1FVRkZSQ3hsUVVGUExFMUJRVTBzVVVGQlVTeE5RVUZTTEVOQlFXVXNRMEZCWml4RlFVRnJRaXhYUVVGc1FpeEZRVUZPTEVkQlFYZERMRkZCUVZFc1MwRkJVaXhEUVVGakxFTkJRV1FzUTBGQkwwTTdRVUZEUkN4UFFVNTFRaXhEUVVGNFFqczdRVUZSUVN4VlFVRk5MSGRDUVVGelFpeG5Ra0ZCWjBJc1RVRkJhRUlzUTBGQmRVSXNRMEZCZGtJc1JVRkJNRUlzVjBGQk1VSXNSVUZCZEVJc1IwRkJaMFVzWjBKQlFXZENMRXRCUVdoQ0xFTkJRWE5DTEVOQlFYUkNMRU5CUVhSRk96dEJRVVZCTzBGQlEwRXNWVUZCU1N4UFFVRlBMRXRCUVVzc1QwRkJUQ3hEUVVGaExHVkJRV0lzUTBGQlVDeExRVUY1UXl4VlFVRTNReXhGUVVGNVJEdEJRVU4yUkN4aFFVRkxMRTlCUVV3c1EwRkJZU3hsUVVGaUxFVkJRVGhDTEV0QlFUbENMRU5CUVc5RExFbEJRWEJETEVWQlFUQkRMRU5CUVVNc1RVRkJSQ3hEUVVFeFF6dEJRVU5FT3p0QlFVVkVMRlZCUVVrc1QwRkJUeXhMUVVGTExFOUJRVXdzUTBGQllTeGpRVUZpTEVOQlFWQXNTMEZCZDBNc1ZVRkJOVU1zUlVGQmQwUTdRVUZEZEVRc1lVRkJTeXhQUVVGTUxFTkJRV0VzWTBGQllpeEZRVUUyUWl4TFFVRTNRaXhEUVVGdFF5eEpRVUZ1UXl4RlFVRjVReXhEUVVGRExFMUJRVVFzUTBGQmVrTTdRVUZEUkRzN1FVRkZSQ3hWUVVGSkxHVkJRVW9zUlVGQmNVSTdRVUZEYmtJN1FVRkRSRHM3UVVGRlJEdEJRVU5CTEZWQlFVa3NTMEZCU3l4UFFVRk1MRU5CUVdFc1QwRkJha0lzUlVGQk1FSTdRVUZEZUVJc05FTkJRWEZDTEV0QlFVc3NUMEZCVEN4RFFVRmhMRTlCUVd4RExFVkJRVEpETEZOQlFUTkRMRVZCUVhORUxFdEJRVXNzU1VGQk0wUXNSVUZCYVVVc1RVRkJha1U3UVVGRFJDeFBRVVpFTEUxQlJVODdRVUZEVEN3eVEwRkJiMElzVTBGQmNFSXNSVUZCSzBJc1MwRkJTeXhKUVVGd1F5eEZRVUV3UXl4TlFVRXhRenRCUVVORU8wRkJRMFk3T3p0dlEwRkZaVHRCUVVOa0xGVkJRVWtzUzBGQlN5eFhRVUZNTEVOQlFXbENMRTFCUVdwQ0xFZEJRVEJDTEVOQlFUbENMRVZCUVdsRE8wRkJReTlDTEcxRVFVRnZRaXhMUVVGTExFOUJRVXdzUTBGQllTeFBRVUZxUXl4RlFVRXdReXhMUVVGTExFOUJRUzlETEVWQlFYZEVMRXRCUVVzc1YwRkJOMFE3UVVGRFJEdEJRVU5HT3pzN2IwTkJSV1U3UVVGRFpDeFZRVUZOTEZWQlFWVXNUMEZCVHl4TlFVRlFMRU5CUVdNc1JVRkJaQ3hGUVVGclFpeExRVUZMTEU5QlFYWkNMRU5CUVdoQ08wRkJRMEVzWVVGQlR5d3lRMEZCYjBJc1MwRkJTeXhQUVVGTUxFTkJRV0VzVDBGQmFrTXNSVUZCTUVNc1QwRkJNVU1zUlVGQmJVUXNTMEZCU3l4WFFVRjRSQ3hEUVVGUU8wRkJRMFE3TzBGQlJVUTdPenM3T3pzN08zTkRRVXRyUWp0QlFVTm9RaXhoUVVGUExFdEJRVXNzVlVGQlRDeEpRVUZ0UWl4RFFVRkRMREpDUVVGcFFpeFJRVUZxUWl4RFFVRXdRaXhKUVVFeFFpeERRVUV6UWp0QlFVTkVPenM3ZVVOQlJXOUNMRXNzUlVGQlR6dEJRVU14UWl4VlFVRkpMRXRCUVVzc1pVRkJUQ3hGUVVGS0xFVkJRVFJDTzBGQlF6RkNPMEZCUTBRN08wRkJSVVFzVjBGQlN5eGpRVUZNTEVOQlFXOUNMRXRCUVhCQ08wRkJRMFE3T3p0dFEwRkZZeXhMTEVWQlFVODdRVUZEY0VJN1FVRkRSRHM3TzJsRFFVVnRRanRCUVVOc1FpeGhRVUZQTEV0QlFVc3NTVUZCV2p0QlFVTkVPenM3YTBOQlJXOUNMR01zUlVGQlowSXNUeXhGUVVGVE8wRkJRelZETEdGQlFVOHNTVUZCU1N4alFVRktMRU5CUVcxQ0xFOUJRVzVDTEVOQlFWQTdRVUZEUkRzN096czdPMnRDUVhaTWEwSXNVenM3T3pzN096czdPenM3VVVOU1RDeHRRaXhIUVVGQkxHMUNPMUZCZDBKQkxHMUNMRWRCUVVFc2JVSTdPMEZCTDBKb1FpeEpRVUZOTEdWQlFXVXNVMEZCWml4WlFVRmxMRU5CUVVNc1MwRkJSQ3hGUVVGUkxFMUJRVklzUlVGQmJVSTdRVUZEZEVNc1RVRkJTU3hWUVVGVkxFVkJRV1FzUlVGQmEwSTdRVUZEYUVJc2NVSkJRV1VzVFVGQlpqdEJRVU5FTzBGQlEwUXNiVUpCUVdVc1MwRkJaaXhUUVVGM1FpeE5RVUY0UWp0QlFVTkVMRU5CVEVRN08wRkJUMDhzVTBGQlV5eHRRa0ZCVkN4RFFVRTJRaXhQUVVFM1FpeEZRVUZ0UlR0QlFVRkJMRTFCUVRkQ0xFZEJRVFpDTEhWRlFVRjJRaXhGUVVGMVFqdEJRVUZCTEUxQlFXNUNMRXRCUVcxQ08wRkJRVUVzVFVGQldpeExRVUZaTEhWRlFVRktMRVZCUVVrN08wRkJRM2hGTEUxQlFVMHNUMEZCVHl4UFFVRlBMRWxCUVZBc1EwRkJXU3hIUVVGYUxFTkJRV0k3TzBGQlJVRXNUMEZCU3l4UFFVRk1MRU5CUVdFc1ZVRkJReXhIUVVGRUxFVkJRVk03UVVGRGNFSXNVVUZCU1N4VlFVRlZMRVZCUVZZc1NVRkJaMElzVFVGQlRTeFBRVUZPTEVOQlFXTXNSMEZCWkN4TlFVRjFRaXhEUVVGRExFTkJRVFZETEVWQlFTdERPMEZCUXpkRE8wRkJRMEU3UVVGRFJEczdRVUZGUkN4UlFVRkpMRkZCUVU4c1NVRkJTU3hIUVVGS0xFTkJRVkFzVFVGQmIwSXNVVUZCY0VJc1NVRkJaME1zU1VGQlNTeEhRVUZLTEUxQlFXRXNTVUZCYWtRc1JVRkJkVVE3UVVGRGNrUXNWVUZCU1N4WFFVRlhMRWRCUVdZN1FVRkRRU3hWUVVGSkxGVkJRVlVzUlVGQlpDeEZRVUZyUWp0QlFVTm9RaXh0UWtGQll5eExRVUZrTEZOQlFYVkNMRWRCUVhaQ08wRkJRMFE3TzBGQlJVUXNNRUpCUVc5Q0xFOUJRWEJDTEVWQlFUWkNMRWxCUVVrc1IwRkJTaXhEUVVFM1FpeEZRVUYxUXl4TFFVRjJReXhGUVVFNFF5eFJRVUU1UXp0QlFVTkJPMEZCUTBRN08wRkJSVVFzVVVGQlRTeFBRVUZQTEdGQlFXRXNTMEZCWWl4RlFVRnZRaXhIUVVGd1FpeERRVUZpTzBGQlEwRXNXVUZCVVN4WlFVRlNMRU5CUVhGQ0xFbEJRWEpDTEVWQlFUSkNMRWxCUVVrc1IwRkJTaXhEUVVFelFqdEJRVU5FTEVkQmJFSkVPMEZCYlVKRU96dEJRVVZOTEZOQlFWTXNiVUpCUVZRc1EwRkJOa0lzVDBGQk4wSXNSVUZCYlVVN1FVRkJRU3hOUVVFM1FpeEhRVUUyUWl4MVJVRkJka0lzUlVGQmRVSTdRVUZCUVN4TlFVRnVRaXhMUVVGdFFqdEJRVUZCTEUxQlFWb3NTMEZCV1N4MVJVRkJTaXhGUVVGSk96dEJRVU40UlN4TlFVRk5MRk5CUVZNc1QwRkJUeXhOUVVGUUxFTkJRV01zUlVGQlpDeEZRVUZyUWl4SFFVRnNRaXhEUVVGbU8wRkJRMEVzVFVGQlRTeFBRVUZQTEU5QlFVOHNTVUZCVUN4RFFVRlpMRWRCUVZvc1EwRkJZanM3UVVGRlFTeFBRVUZMTEU5QlFVd3NRMEZCWVN4VlFVRkRMRWRCUVVRc1JVRkJVenRCUVVOd1FpeFJRVUZKTEZWQlFWVXNSVUZCVml4SlFVRm5RaXhOUVVGTkxFOUJRVTRzUTBGQll5eEhRVUZrTEUxQlFYVkNMRU5CUVVNc1EwRkJOVU1zUlVGQkswTTdRVUZETjBNN1FVRkRRVHRCUVVORU96dEJRVVZFTEZGQlFVa3NTVUZCU1N4SFFVRktMRTFCUVdFc1NVRkJZaXhKUVVGeFFpeEpRVUZKTEVkQlFVb3NSVUZCVXl4WFFVRlVMRXRCUVhsQ0xFMUJRV3hFTEVWQlFUQkVPMEZCUTNoRUxGVkJRVWtzVjBGQlZ5eEhRVUZtTzBGQlEwRXNWVUZCU1N4VlFVRlZMRVZCUVdRc1JVRkJhMEk3UVVGRGFFSXNiVUpCUVdNc1MwRkJaQ3hUUVVGMVFpeEhRVUYyUWp0QlFVTkVPenRCUVVWRUxHRkJRVThzUjBGQlVDeEpRVUZqTEc5Q1FVRnZRaXhQUVVGd1FpeEZRVUUyUWl4SlFVRkpMRWRCUVVvc1EwRkJOMElzUlVGQmRVTXNTMEZCZGtNc1JVRkJPRU1zVVVGQk9VTXNRMEZCWkR0QlFVTkJPMEZCUTBRN08wRkJSVVE3UVVGRFFTeFJRVUZKTEZGQlFWRXNTVUZCU1N4SFFVRktMRU5CUVZvc1EwRnFRbTlDTEVOQmFVSkRPMEZCUTNKQ0xGRkJRVTBzWTBGQll5eExRVUZrTEhsRFFVRmpMRXRCUVdRc1EwRkJUanRCUVVOQkxGRkJRVTBzVDBGQlR5eGhRVUZoTEV0QlFXSXNSVUZCYjBJc1IwRkJjRUlzUTBGQllqdEJRVU5CTEZGQlFVMHNXVUZCV1N4UlFVRlJMRmxCUVZJc1EwRkJjVUlzU1VGQmNrSXNRMEZCYkVJN08wRkJSVUVzVVVGQlNTeGpRVUZqTEVsQlFXeENMRVZCUVhkQ08wRkJRM1JDTEZWQlFVa3NVMEZCVXl4VFFVRmlMRVZCUVhkQ08wRkJRM1JDTzBGQlEwRXNaMEpCUVZFc1kwRkJZeXhOUVVGMFFqdEJRVU5FTEU5QlNFUXNUVUZIVHl4SlFVRkpMRU5CUVVNc1RVRkJUU3hUUVVGT0xFTkJRVXdzUlVGQmRVSTdRVUZETlVJc1owSkJRVkVzVTBGQlV5eFRRVUZVTEVWQlFXOUNMRVZCUVhCQ0xFTkJRVkk3UVVGRFJDeFBRVVpOTEUxQlJVRTdRVUZEVEN4blFrRkJVU3hUUVVGU08wRkJRMFE3UVVGRFJqczdRVUZGUkN4WFFVRlBMRWRCUVZBc1NVRkJZeXhMUVVGa08wRkJRMFFzUjBGc1EwUTdPMEZCYjBOQkxGTkJRVThzVFVGQlVEdEJRVU5FT3p0QlFVVkVMRWxCUVUwc1VVRkJVU3hGUVVGa096dHJRa0ZGWlR0QlFVTmlMRXRCUkdFc1pVRkRWQ3hUUVVSVExFVkJRMFU3UVVGRFlpeFZRVUZOTEVsQlFVNHNRMEZCVnl4VFFVRllPMEZCUTBRc1IwRklXVHRCUVVsaUxGRkJTbUVzYTBKQlNVNHNVMEZLVFN4RlFVbExPMEZCUTJoQ0xGRkJRVTBzVVVGQlVTeE5RVUZOTEZOQlFVNHNRMEZCWjBJN1FVRkJRU3hoUVVGTExFOUJRVThzUlVGQlVDeERRVUZWTEZOQlFWWXNSVUZCY1VJc1EwRkJja0lzUTBGQlREdEJRVUZCTEV0QlFXaENMRU5CUVdRN1FVRkRRU3hSUVVGSkxGRkJRVkVzUTBGQlF5eERRVUZpTEVWQlFXZENPMEZCUTJRc1dVRkJUU3hOUVVGT0xFTkJRV0VzUzBGQllpeEZRVUZ2UWl4RFFVRndRanRCUVVORU8wRkJRMFlzUjBGVVdUdEJRVlZpTEZWQlZtRXNiMEpCVlVvc1UwRldTU3hGUVZWUE8wRkJRMnhDTEZkQlFVOHNUVUZCVFN4TlFVRk9MRXRCUVdsQ0xFTkJRV3BDTEVsQlFYTkNMRTlCUVU4c1JVRkJVQ3hEUVVGVkxFMUJRVTBzVFVGQlRTeE5RVUZPTEVkQlFXVXNRMEZCY2tJc1EwRkJWaXhGUVVGdFF5eFRRVUZ1UXl4RFFVRTNRanRCUVVORU8wRkJXbGtzUXpzN096czdPenM3T3pzN1FVTjRSV1k3T3pzN1FVRkRRVHM3T3pzN096czdLMlZCVGtFN096czdPenM3UVVGUlFTeEpRVUZOTEZWQlFWY3NXVUZCVFRzN1FVRkZja0k3T3pzN096dEJRVTFCTEUxQlFVMHNUMEZCVHl4VFFVRmlPMEZCUTBFc1RVRkJUU3h4UWtGQmNVSTdRVUZEZWtJc1lVRkJVeXhKUVVSblFqdEJRVVY2UWl4WFFVRlBMRWxCUm10Q08wRkJSM3BDTEdGQlFWTXNTVUZJWjBJN1FVRkpla0lzWjBKQlFWa3NTVUZLWVR0QlFVdDZRaXhWUVVGTkxFbEJURzFDTzBGQlRYcENMR0ZCUVZNc1EwRkRVRHRCUVVORkxHRkJRVThzVVVGRVZEdEJRVVZGTEZsQlFVMHNVVUZHVWp0QlFVZEZMR1ZCUVZNc1NVRklXRHRCUVVsRkxHRkJRVTg3UVVGS1ZDeExRVVJQTEVWQlQxQTdRVUZEUlN4aFFVRlBMRk5CUkZRN1FVRkZSU3haUVVGTkxFbEJSbEk3UVVGSFJTeGxRVUZUTEVsQlNGZzdRVUZKUlN4aFFVRlBPMEZCU2xRc1MwRlFUenRCUVU1blFpeEhRVUV6UWp0QlFYRkNRU3hOUVVGTkxIZENRVUYzUWl4RFFVTTFRaXhaUVVRMFFpeERRVUU1UWpzN1FVRkpRVHM3T3pzN08wRkJiRU54UWl4TlFYZERaaXhQUVhoRFpUdEJRVUZCT3p0QlFUQkRia0lzZFVKQlFUQkNPMEZCUVVFc1ZVRkJaQ3hQUVVGakxIVkZRVUZLTEVWQlFVazdPMEZCUVVFN08wRkJRM2hDTEZWQlFVMHNWMEZCVnl4TFFVTnFRaXhyUkVGRWFVSXNSMEZGWml3MFEwRkdaU3hIUVVkaUxEaENRVWhoTEVkQlNWZ3NOa0pCU2xjc1IwRkxWQ3huUTBGTVV5eEhRVTFZTEZGQlRsY3NSMEZQV0N3eVFrRlFWeXhIUVZGVUxGTkJVbE1zUjBGVFdDeFJRVlJYTEVkQlZWZ3NOa0pCVmxjc1IwRlhXQ3hSUVZoWExFZEJXV0lzVVVGYVlTeEhRV0ZtTEZGQlltVXNSMEZqYWtJc1VVRmtRVHM3UVVGblFrRXNWVUZCU1N4RFFVRkRMRTFCUVUwc1QwRkJUaXhEUVVGakxGRkJRVkVzVDBGQmRFSXNRMEZCVEN4RlFVRnhRenRCUVVOdVF5eG5Ra0ZCVVN4UFFVRlNMRWRCUVd0Q0xHMUNRVUZ0UWl4UFFVRnlRenRCUVVORU96dEJRVzVDZFVJc0swZEJjVUpzUWl4UFFYSkNhMElzUlVGeFFsUXNVVUZ5UWxNN1FVRnpRbnBDT3p0QlFXaEZhMEk3UVVGQlFUdEJRVUZCTEcxRFFXdEZRenRCUVVOc1FpeGxRVUZQTEVsQlFWQTdRVUZEUkR0QlFYQkZhMEk3UVVGQlFUdEJRVUZCTEc5RFFYTkZSU3hQUVhSRlJpeEZRWE5GVnp0QlFVTTFRaXhsUVVGUExFbEJRVWtzVDBGQlNpeERRVUZaTEU5QlFWb3NRMEZCVUR0QlFVTkVPMEZCZUVWclFqczdRVUZCUVR0QlFVRkJPenRCUVRKRmNrSTdPenM3T3pzN1FVRkxRU3hOUVVGTkxHRkJRV0VzUlVGQmJrSTdRVUZEUVN4TlFVRk5MRlZCUVZVc1UwRkJVeXhuUWtGQlZDeFBRVUU0UWl4blFrRkJUeXhWUVVGUUxFVkJRVGxDTEVOQlFXaENPenRCUVVWQkxFMUJRVWtzVDBGQlNpeEZRVUZoTzBGQlExZ3NWVUZCVFN4SlFVRk9MRU5CUVZjc1QwRkJXQ3hGUVVGdlFpeFBRVUZ3UWl4RFFVRTBRaXhWUVVGRExFOUJRVVFzUlVGQllUdEJRVU4yUXl4VlFVRk5MRk5CUVZNc01rTkJRVzlDTEU5QlFYQkNMRVZCUVRaQ0xHdENRVUUzUWl4RlFVRnBSQ3h4UWtGQmFrUXNRMEZCWmp0QlFVTkJMR0ZCUVU4c1QwRkJVQ3hIUVVGcFFpeFBRVUZxUWpzN1FVRkZRU3hWUVVGSkxFOUJRVThzU1VGQlVDeExRVUZuUWl4SlFVRndRaXhGUVVFd1FqdEJRVU40UWp0QlFVTkJMRzFDUVVGWExFbEJRVmdzUTBGQlowSXNTVUZCU1N4UFFVRktMRU5CUVZrc1RVRkJXaXhEUVVGb1FqdEJRVU5FTzBGQlEwWXNTMEZTUkR0QlFWTkVPenRCUVVWRUxGZEJRVk1zWjBKQlFWUXNRMEZCTUVJc1QwRkJNVUlzUlVGQmJVTXNWVUZCUXl4TFFVRkVMRVZCUVZjN1FVRkROVU1zVVVGQlRTeHBRa0ZCYVVJc1RVRkJUU3hOUVVGT0xFTkJRV0VzV1VGQllpeERRVUV3UWl4aFFVRXhRaXhEUVVGMlFqdEJRVU5CTEZGQlFVa3NhMEpCUVd0Q0xHMUNRVUZ0UWl4SlFVRjZReXhGUVVFclF6dEJRVU0zUXl4VlFVRk5MRXRCUVVzc1RVRkJUU3hOUVVGT0xFTkJRV0VzV1VGQllpeERRVUV3UWl4aFFVRXhRaXhEUVVGWU8wRkJRMEVzVlVGQlRTeFZRVUZWTEZOQlFWTXNZVUZCVkN4RFFVRjFRaXhGUVVGMlFpeERRVUZvUWpzN1FVRkZRU3hWUVVGTkxGbEJRVmtzVjBGQlZ5eEpRVUZZTEVOQlFXZENPMEZCUVVFc1pVRkJTeXhGUVVGRkxFOUJRVVlzUzBGQll5eFBRVUZ1UWp0QlFVRkJMRTlCUVdoQ0xFTkJRV3hDT3p0QlFVVkJMRlZCUVVrc1EwRkJReXhUUVVGTUxFVkJRV2RDTzBGQlEyUTdRVUZEUkRzN1FVRkZSRHRCUVVOQkxGbEJRVTBzVFVGQlRpeERRVUZoTEVsQlFXSTdPMEZCUlVFc1owSkJRVlVzVFVGQlZpeERRVUZwUWl4SlFVRnFRanRCUVVORU8wRkJRMFlzUjBGcVFrUTdPMEZCYlVKQkxGTkJRVThzVDBGQlVEdEJRVU5FTEVOQmJraGxMRVZCUVdoQ096dHJRa0Z4U0dVc1R6czdPenM3T3pzN096czdPenRCUTNoSVpqczdPenRCUVVOQk96czdPMEZCUTBFN096czdPenM3T3l0bFFWQkJPenM3T3pzN08wRkJVMEVzU1VGQlRTeFRRVUZWTEZsQlFVMDdRVUZEY0VJN096czdPenRCUVUxQkxFMUJRVTBzVDBGQlR5eFJRVUZpTzBGQlEwRXNUVUZCVFN4VlFVRlZMRTlCUVdoQ08wRkJRMEVzVFVGQlRTeHZRa0ZCYjBJc2FVSkJRVEZDTzBGQlEwRXNUVUZCVFN4eFFrRkJjVUk3UVVGRGVrSXNZVUZCVXl4SlFVUm5RanRCUVVWNlFpeFhRVUZQTEVsQlJtdENPMEZCUjNwQ0xHRkJRVk1zU1VGSVowSTdRVUZKZWtJc1owSkJRVmtzU1VGS1lUdEJRVXQ2UWl4aFFVRlRMRU5CUTFBN1FVRkRSU3hoUVVGUExGTkJSRlE3UVVGRlJTeFpRVUZOTEVsQlJsSTdRVUZIUlN4bFFVRlRMRWxCU0ZnN1FVRkpSU3hoUVVGUE8wRkJTbFFzUzBGRVR6dEJRVXhuUWl4SFFVRXpRanRCUVdOQkxFMUJRVTBzZDBKQlFYZENMRU5CUXpWQ0xGbEJSRFJDTEVOQlFUbENPenRCUVVsQk96czdPenM3UVVFMVFtOUNMRTFCYTBOa0xFMUJiRU5qTzBGQlFVRTdPMEZCYjBOc1FpeHpRa0ZCTWtNN1FVRkJRU3hWUVVFdlFpeFBRVUVyUWl4MVJVRkJja0lzUlVGQmNVSTdRVUZCUVN4VlFVRnFRaXhSUVVGcFFpeDFSVUZCVGl4SlFVRk5PenRCUVVGQk96dEJRVUZCTEd0SVFVTnVReXhKUVVSdFF5eEZRVU0zUWl4UFFVUTJRaXhGUVVOd1FpeHJRa0ZFYjBJc1JVRkRRU3hQUVVSQkxFVkJRMU1zY1VKQlJGUXNSVUZEWjBNc1NVRkVhRU1zUlVGRGMwTXNTVUZFZEVNN08wRkJSM3BETEZsQlFVc3NVVUZCVEN4SFFVRm5RaXhaUVVGWkxFdEJRelZDTEd0RVFVUTBRaXhIUVVVeFFpdzBRMEZHTUVJc1IwRkhlRUlzT0VKQlNIZENMRWRCU1hSQ0xEWkNRVXB6UWl4SFFVdHdRaXhuUTBGTWIwSXNSMEZOZEVJc1VVRk9jMElzUjBGUGRFSXNNa0pCVUhOQ0xFZEJVWEJDTEZOQlVtOUNMRWRCVTNSQ0xGRkJWSE5DTEVkQlZYUkNMRFpDUVZaelFpeEhRVmQwUWl4UlFWaHpRaXhIUVZsNFFpeFJRVnAzUWl4SFFXRXhRaXhSUVdJd1FpeEhRV00xUWl4UlFXUkJPenRCUVdkQ1FTeFZRVUZKTEUxQlFVc3NZMEZCVkN4RlFVRjVRanRCUVVOMlFpeGpRVUZMTEV0QlFVdzdRVUZEUkR0QlFYSkNkME03UVVGelFqRkRPenRCUVRGRWFVSTdRVUZCUVR0QlFVRkJMRGhDUVRSRVZqdEJRVUZCT3p0QlFVTk9MRmxCUVUwc1ZVRkJWU3hUUVVGVExHRkJRVlFzUTBGQmRVSXNTMEZCZGtJc1EwRkJhRUk3TzBGQlJVRXNaMEpCUVZFc1UwRkJVaXhIUVVGdlFpeExRVUZMTEZGQlFYcENPenRCUVVWQkxHRkJRVXNzVDBGQlRDeERRVUZoTEU5QlFXSXNSMEZCZFVJc1VVRkJVU3hWUVVFdlFqczdRVUZGUVR0QlFVTkJMRmxCUVVrc1MwRkJTeXhQUVVGTUxFTkJRV0VzUzBGQllpeExRVUYxUWl4SlFVRXpRaXhGUVVGcFF6dEJRVU12UWl4bFFVRkxMRTlCUVV3c1EwRkJZU3hQUVVGaUxFTkJRWEZDTEdGQlFYSkNMRU5CUVcxRExHVkJRVzVETEVWQlFXOUVMRk5CUVhCRUxFZEJRV2RGTEV0QlFVc3NUMEZCVEN4RFFVRmhMRXRCUVRkRk8wRkJRMFE3TzBGQlJVUTdRVUZEUVN4WlFVRkpMRXRCUVVzc1QwRkJUQ3hEUVVGaExFOUJRV0lzUzBGQmVVSXNTVUZCTjBJc1JVRkJiVU03UVVGRGFrTXNaVUZCU3l4UFFVRk1MRU5CUVdFc1QwRkJZaXhEUVVGeFFpeGhRVUZ5UWl4RFFVRnRReXhqUVVGdVF5eEZRVUZ0UkN4VlFVRnVSQ3hEUVVFNFJDeFRRVUU1UkN4SFFVRXdSU3hMUVVGTExFOUJRVXdzUTBGQllTeFBRVUYyUmp0QlFVTkVMRk5CUmtRc1RVRkZUenRCUVVOTU8wRkJRMEVzWlVGQlN5eGpRVUZNTzBGQlEwUTdPMEZCUlVRN1FVRkRRU3haUVVGSkxFdEJRVXNzVDBGQlRDeERRVUZoTEU5QlFXSXNTMEZCZVVJc1NVRkJla0lzU1VGQmFVTXNUVUZCVFN4UFFVRk9MRU5CUVdNc1MwRkJTeXhQUVVGTUxFTkJRV0VzVDBGQk0wSXNRMEZCY2tNc1JVRkJNRVU3UVVGRGVFVXNZMEZCU1N4TFFVRkxMRTlCUVV3c1EwRkJZU3hQUVVGaUxFTkJRWEZDTEUxQlFYSkNMRWRCUVRoQ0xFTkJRV3hETEVWQlFYRkRPMEZCUTI1RExHbENRVUZMTEU5QlFVd3NRMEZCWVN4UFFVRmlMRU5CUVhGQ0xFOUJRWEpDTEVOQlFUWkNMRlZCUVVNc1RVRkJSQ3hGUVVGWk8wRkJRM1pETEhGQ1FVRkxMRTlCUVV3c1EwRkJZU3hQUVVGaUxFTkJRWEZDTEdGQlFYSkNMRU5CUVcxRExHZENRVUZ1UXl4RlFVRnhSQ3hYUVVGeVJDeERRVUZwUlN4UFFVRkxMRmRCUVV3c1EwRkJhVUlzVFVGQmFrSXNRMEZCYWtVN1FVRkRSQ3hoUVVaRU8wRkJSMFFzVjBGS1JDeE5RVWxQTzBGQlEwd3NhVUpCUVVzc1dVRkJURHRCUVVORU8wRkJRMFlzVTBGU1JDeE5RVkZQTzBGQlEwd3NaVUZCU3l4WlFVRk1PMEZCUTBRN08wRkJSVVFzYVVKQlFWTXNTVUZCVkN4RFFVRmpMRmRCUVdRc1EwRkJNRUlzUzBGQlN5eFBRVUZNTEVOQlFXRXNUMEZCZGtNN08wRkJSVUVzWVVGQlN5eGhRVUZNTzBGQlEwUTdRVUZvUjJsQ08wRkJRVUU3UVVGQlFTeHZRMEZyUjFjN1FVRkJRU3haUVVGcVFpeFZRVUZwUWl4MVJVRkJTaXhGUVVGSk96dEJRVU16UWl4WlFVRk5MRk5CUVZNc1UwRkJVeXhoUVVGVUxFTkJRWFZDTEZGQlFYWkNMRU5CUVdZN1FVRkRRU3hsUVVGUExGbEJRVkFzUTBGQmIwSXNUVUZCY0VJc1JVRkJORUlzVVVGQk5VSTdRVUZEUVN4bFFVRlBMRmxCUVZBc1EwRkJiMElzVDBGQmNFSXNSVUZCTmtJc1YwRkJWeXhMUVVGWUxFbEJRVzlDTEV0QlFXcEVPMEZCUTBFc1pVRkJUeXhaUVVGUUxFTkJRVzlDTEZsQlFYQkNMRVZCUVd0RExGZEJRVmNzUzBGQk4wTTdRVUZEUVN4bFFVRlBMRk5CUVZBc1IwRkJiVUlzVjBGQlZ5eEpRVUU1UWpzN1FVRkZRU3haUVVGSkxGZEJRVmNzVDBGQlppeEZRVUYzUWp0QlFVTjBRaXhwUWtGQlR5eFpRVUZRTEVOQlFXOUNMR05CUVhCQ0xFVkJRVzlETEVsQlFYQkRPMEZCUTBRN08wRkJSVVFzWlVGQlR5eE5RVUZRTzBGQlEwUTdRVUU1UjJsQ08wRkJRVUU3UVVGQlFTeHpRMEZuU0VZN1FVRkRaQ3haUVVGTkxGZEJRVmNzVTBGQlV5eGhRVUZVTEVOQlFYVkNMRXRCUVhaQ0xFTkJRV3BDTzBGQlEwRXNhVUpCUVZNc1dVRkJWQ3hEUVVGelFpeFRRVUYwUWl4RlFVRnBReXhMUVVGTExFVkJRWFJETzBGQlEwRXNhVUpCUVZNc1UwRkJWQ3hEUVVGdFFpeEhRVUZ1UWl4RFFVRjFRaXhwUWtGQmRrSTdPMEZCUlVFc2FVSkJRVk1zU1VGQlZDeERRVUZqTEZkQlFXUXNRMEZCTUVJc1VVRkJNVUk3UVVGRFJEdEJRWFJJYVVJN1FVRkJRVHRCUVVGQkxHOURRWGRJU2p0QlFVTmFMR1ZCUVU4c1UwRkJVeXhoUVVGVUxFOUJRVEpDTEdsQ1FVRXpRaXhyUWtGQmVVUXNTMEZCU3l4RlFVRTVSQ3hSUVVGUU8wRkJRMFE3UVVFeFNHbENPMEZCUVVFN1FVRkJRU3gxUTBFMFNFUTdRVUZEWml4aFFVRkxMRTlCUVV3c1EwRkJZU3hQUVVGaUxFTkJRWEZDTEdGQlFYSkNMRU5CUVcxRExHTkJRVzVETEVWQlFXMUVMRmRCUVc1RUxFTkJRU3RFTEV0QlFVc3NUMEZCVEN4RFFVRmhMRTlCUVdJc1EwRkJjVUlzWVVGQmNrSXNRMEZCYlVNc1kwRkJia01zUlVGQmJVUXNWVUZCYkVnN1FVRkRSRHRCUVRsSWFVSTdRVUZCUVR0QlFVRkJMSEZEUVdkSlNEdEJRVU5pTEZsQlFVMHNVMEZCVXl4TFFVRkxMRTlCUVV3c1EwRkJZU3hQUVVGaUxFTkJRWEZDTEdGQlFYSkNMRU5CUVcxRExHZENRVUZ1UXl4RFFVRm1PMEZCUTBFc1lVRkJTeXhQUVVGTUxFTkJRV0VzVDBGQllpeERRVUZ4UWl4aFFVRnlRaXhEUVVGdFF5eHBRa0ZCYmtNc1JVRkJjMFFzVjBGQmRFUXNRMEZCYTBVc1RVRkJiRVU3UVVGRFJEdEJRVzVKYVVJN1FVRkJRVHRCUVVGQkxDdENRWEZKVkR0QlFVTlFMRmxCUVUwc1owSkJRV2RDTEU5QlFVOHNaMEpCUVZBc1EwRkJkMElzUzBGQlN5eFBRVUZNTEVOQlFXRXNUMEZCY2tNc1EwRkJkRUk3UVVGRFFTeFpRVUZOTEZOQlFWTXNZMEZCWXl4TlFVRmtMRU5CUVhGQ0xFdEJRWEpDTEVOQlFUSkNMRU5CUVROQ0xFVkJRVGhDTEdOQlFXTXNUVUZCWkN4RFFVRnhRaXhOUVVGeVFpeEhRVUU0UWl4RFFVRTFSQ3hEUVVGbU96dEJRVVZCTEZsQlFVMHNUVUZCVHl4UFFVRlBMRmRCUVZBc1IwRkJjVUlzUTBGQmRFSXNSMEZCTkVJc1UwRkJVeXhEUVVGcVJEdEJRVU5CTEdGQlFVc3NUMEZCVEN4RFFVRmhMRTlCUVdJc1EwRkJjVUlzUzBGQmNrSXNRMEZCTWtJc1IwRkJNMElzUjBGQmIwTXNSMEZCY0VNN1FVRkRSRHRCUVROSmFVSTdRVUZCUVR0QlFVRkJMRFpDUVRaSldEdEJRVUZCT3p0QlFVTk1MRmxCUVVrc1MwRkJTeXhQUVVGTUxFTkJRV0VzVDBGQllpeExRVUY1UWl4SlFVRTNRaXhGUVVGdFF6dEJRVU5xUXp0QlFVTkJMR1ZCUVVzc1MwRkJURHRCUVVORU96dEJRVVZFTEZsQlFVa3NTMEZCU3l4UFFVRk1MRU5CUVdFc1QwRkJZaXhEUVVGeFFpeFRRVUZ5UWl4RFFVRXJRaXhSUVVFdlFpeERRVUYzUXl4TlFVRjRReXhEUVVGS0xFVkJRWEZFTzBGQlEyNUVMR2xDUVVGUExFdEJRVkE3UVVGRFJEczdRVUZGUkR0QlFVTkJMRzFDUVVGWExGbEJRVTA3UVVGRFppeHBRa0ZCU3l4WlFVRk1MRU5CUVd0Q0xHbENRVUZOTEVsQlFYaENPMEZCUTBFc2FVSkJRVXNzWVVGQlREczdRVUZGUVN4alFVRk5MRlZCUVZVc1UwRkJWaXhQUVVGVkxFZEJRVTA3UVVGRGNFSXNiVUpCUVVzc1dVRkJUQ3hEUVVGclFpeHBRa0ZCVFN4TFFVRjRRanRCUVVOQkxHMUNRVUZMTEU5QlFVd3NRMEZCWVN4UFFVRmlMRU5CUVhGQ0xHMUNRVUZ5UWl4RFFVRjVReXhwUWtGQlRTeGpRVUV2UXl4RlFVRXJSQ3hQUVVFdlJEczdRVUZGUVR0QlFVTkJMRzFDUVVGTExGbEJRVXc3UVVGRFJDeFhRVTVFT3p0QlFWRkJMR2xDUVVGTExFOUJRVXdzUTBGQllTeFBRVUZpTEVOQlFYRkNMR2RDUVVGeVFpeERRVUZ6UXl4cFFrRkJUU3hqUVVFMVF5eEZRVUUwUkN4UFFVRTFSRHM3UVVGRlFTeHBRa0ZCU3l4UFFVRk1MRU5CUVdFc1QwRkJZaXhEUVVGeFFpeFRRVUZ5UWl4RFFVRXJRaXhIUVVFdlFpeERRVUZ0UXl4TlFVRnVRenM3UVVGRlFTeHBRa0ZCU3l4TlFVRk1PMEZCUTBRc1UwRnFRa1FzUlVGcFFrY3NSVUZxUWtnN08wRkJiVUpCTEdWQlFVOHNTVUZCVUR0QlFVTkVPMEZCTlV0cFFqdEJRVUZCTzBGQlFVRXNjVU5CT0V0SUxFdEJPVXRITEVWQk9FdEpPMEZCUTNCQ0xGbEJRVWtzVFVGQlRTeEpRVUZPTEV0QlFXVXNUMEZCWml4SlFVRXdRaXhOUVVGTkxFOUJRVTRzUzBGQmEwSXNSVUZCTlVNc1NVRkJhMFFzVFVGQlRTeFBRVUZPTEV0QlFXdENMRVZCUVhoRkxFVkJRVFJGTzBGQlF6RkZPMEZCUTBRN08wRkJSVVFzV1VGQlRTeFpRVUZaTEUxQlFVMHNUVUZCVGl4RFFVRmhMRmxCUVdJc1EwRkJNRUlzV1VGQk1VSXNRMEZCYkVJN08wRkJSVUVzV1VGQlNTeFRRVUZLTEVWQlFXVTdRVUZEWWl4bFFVRkxMRmxCUVV3c1EwRkJhMElzVTBGQmJFSTdRVUZEUkRzN1FVRkZSQ3haUVVGSkxFMUJRVTBzVFVGQlRpeERRVUZoTEZsQlFXSXNRMEZCTUVJc1kwRkJNVUlzVFVGQk9FTXNTVUZCYkVRc1JVRkJkMFE3UVVGRGRFUTdRVUZEUkRzN1FVRkZSRHRCUVVOQkxHRkJRVXNzU1VGQlREdEJRVU5FTzBGQkwweHBRanRCUVVGQk8wRkJRVUVzTmtKQmFVMVlPMEZCUVVFN08wRkJRMHdzV1VGQlNTeERRVUZETEV0QlFVc3NUMEZCVEN4RFFVRmhMRTlCUVdJc1EwRkJjVUlzVTBGQmNrSXNRMEZCSzBJc1VVRkJMMElzUTBGQmQwTXNUVUZCZUVNc1EwRkJUQ3hGUVVGelJEdEJRVU53UkN4cFFrRkJUeXhMUVVGUU8wRkJRMFE3TzBGQlJVUXNZVUZCU3l4WlFVRk1MRU5CUVd0Q0xHbENRVUZOTEVsQlFYaENPenRCUVVWQkxHRkJRVXNzV1VGQlREczdRVUZGUVN4aFFVRkxMRTlCUVV3c1EwRkJZU3hQUVVGaUxFTkJRWEZDTEZOQlFYSkNMRU5CUVN0Q0xFZEJRUzlDTEVOQlFXMURMRTFCUVc1RE8wRkJRMEVzWVVGQlN5eFBRVUZNTEVOQlFXRXNUMEZCWWl4RFFVRnhRaXhUUVVGeVFpeERRVUVyUWl4TlFVRXZRaXhEUVVGelF5eE5RVUYwUXpzN1FVRkZRU3haUVVGTkxGZEJRVmNzUzBGQlN5eFhRVUZNTEVWQlFXcENPenRCUVVWQkxGbEJRVTBzVjBGQlZ5eFRRVUZZTEZGQlFWY3NSMEZCVFR0QlFVTnlRaXh0UWtGQlV5eEpRVUZVTEVOQlFXTXNWMEZCWkN4RFFVRXdRaXhSUVVFeFFqczdRVUZGUVN4cFFrRkJTeXhQUVVGTUxFTkJRV0VzVDBGQllpeERRVUZ4UWl4VFFVRnlRaXhEUVVFclFpeE5RVUV2UWl4RFFVRnpReXhOUVVGMFF6czdRVUZGUVN4cFFrRkJTeXhaUVVGTUxFTkJRV3RDTEdsQ1FVRk5MRTFCUVhoQ096dEJRVVZCTEcxQ1FVRlRMRzFDUVVGVUxFTkJRVFpDTEdsQ1FVRk5MR05CUVc1RExFVkJRVzFFTEZGQlFXNUVPenRCUVVWQk8wRkJRMEVzWTBGQlNTeFBRVUZMTEdOQlFWUXNSVUZCZVVJN1FVRkRka0lzY1VKQlFWTXNTVUZCVkN4RFFVRmpMRmRCUVdRc1EwRkJNRUlzVDBGQlN5eFBRVUZNTEVOQlFXRXNUMEZCZGtNN1FVRkRRU3h0UWtGQlN5eFBRVUZNTEVOQlFXRXNUMEZCWWl4SFFVRjFRaXhKUVVGMlFqdEJRVU5FTzBGQlEwWXNVMEZrUkRzN1FVRm5Ra0VzYVVKQlFWTXNaMEpCUVZRc1EwRkJNRUlzYVVKQlFVMHNZMEZCYUVNc1JVRkJaMFFzVVVGQmFFUTdRVUZEUVN4cFFrRkJVeXhUUVVGVUxFTkJRVzFDTEVkQlFXNUNMRU5CUVhWQ0xGTkJRWFpDT3p0QlFVVkJMR1ZCUVU4c1NVRkJVRHRCUVVORU8wRkJiazlwUWp0QlFVRkJPMEZCUVVFc2NVTkJjVTlJTzBGQlFVRTdPMEZCUTJJc1dVRkJUU3hWUVVGVkxFdEJRVXNzVDBGQlRDeERRVUZoTEU5QlFXSXNRMEZCY1VJc1owSkJRWEpDTEVOQlFYTkRMSFZEUVVGMFF5eERRVUZvUWp0QlFVTkJMRmxCUVVrc1QwRkJTaXhGUVVGaE8wRkJRMWdzWjBKQlFVMHNTVUZCVGl4RFFVRlhMRTlCUVZnc1JVRkJiMElzVDBGQmNFSXNRMEZCTkVJN1FVRkJRU3h0UWtGQlZTeFBRVUZMTEdWQlFVd3NRMEZCY1VJc1JVRkJSU3hSUVVGUkxFMUJRVllzUlVGQmEwSXNUMEZCVHl4UFFVRjZRaXhGUVVGeVFpeERRVUZXTzBGQlFVRXNWMEZCTlVJN1FVRkRSRHM3UVVGRlJEdEJRVU5CTzBGQlEwRTdRVUZEUVN4WlFVRkpMRXRCUVVzc1QwRkJUQ3hEUVVGaExGVkJRV3BDTEVWQlFUWkNPMEZCUXpOQ0xHTkJRVTBzVjBGQlZ5eExRVUZMTEZkQlFVd3NSVUZCYWtJN1FVRkRRU3hsUVVGTExHVkJRVXdzUTBGQmNVSXNSVUZCUlN4UlFVRlJMRkZCUVZZc1JVRkJiMElzVDBGQlR5eHBRa0ZCVFN4TFFVRnFReXhGUVVGeVFqdEJRVU5CTEdWQlFVc3NaVUZCVEN4RFFVRnhRaXhGUVVGRkxGRkJRVkVzVVVGQlZpeEZRVUZ2UWl4UFFVRlBMRTlCUVROQ0xFVkJRWEpDTzBGQlEwUTdRVUZEUmp0QlFXNVFhVUk3UVVGQlFUdEJRVUZCTEhGRFFYRlFTRHRCUVVGQk96dEJRVU5pTEZsQlFVMHNWVUZCVlN4TFFVRkxMRTlCUVV3c1EwRkJZU3hQUVVGaUxFTkJRWEZDTEdkQ1FVRnlRaXhEUVVGelF5eDFRMEZCZEVNc1EwRkJhRUk3UVVGRFFTeFpRVUZKTEU5QlFVb3NSVUZCWVR0QlFVTllMR2RDUVVGTkxFbEJRVTRzUTBGQlZ5eFBRVUZZTEVWQlFXOUNMRTlCUVhCQ0xFTkJRVFJDTzBGQlFVRXNiVUpCUVZVc1QwRkJTeXhwUWtGQlRDeERRVUYxUWl4RlFVRkZMRkZCUVZFc1RVRkJWaXhGUVVGclFpeFBRVUZQTEU5QlFYcENMRVZCUVhaQ0xFTkJRVlk3UVVGQlFTeFhRVUUxUWp0QlFVTkVPenRCUVVWRUxGbEJRVWtzUzBGQlN5eFBRVUZNTEVOQlFXRXNWVUZCYWtJc1JVRkJOa0k3UVVGRE0wSXNZMEZCVFN4WFFVRlhMRXRCUVVzc1YwRkJUQ3hGUVVGcVFqdEJRVU5CTEdWQlFVc3NhVUpCUVV3c1EwRkJkVUlzUlVGQlJTeFJRVUZSTEZGQlFWWXNSVUZCYjBJc1QwRkJUeXhwUWtGQlRTeExRVUZxUXl4RlFVRjJRanRCUVVOQkxHVkJRVXNzYVVKQlFVd3NRMEZCZFVJc1JVRkJSU3hSUVVGUkxGRkJRVllzUlVGQmIwSXNUMEZCVHl4UFFVRXpRaXhGUVVGMlFqdEJRVU5FTzBGQlEwWTdRVUZvVVdsQ08wRkJRVUU3UVVGQlFTeHRRMEZyVVVVN1FVRkRiRUlzWlVGQlR5eEpRVUZRTzBGQlEwUTdRVUZ3VVdsQ08wRkJRVUU3UVVGQlFTeHZRMEZ6VVVjc1QwRjBVVWdzUlVGelVWazdRVUZETlVJc2VVZEJRVEpDTEUxQlFUTkNMRVZCUVcxRExFOUJRVzVETzBGQlEwUTdRVUY0VVdsQ096dEJRVUZCTzBGQlFVRTdPMEZCTWxGd1FqczdPenM3T3p0QlFVdEJMRTFCUVUwc1lVRkJZU3hGUVVGdVFqczdRVUZGUVN4TlFVRk5MRlZCUVZVc1UwRkJVeXhuUWtGQlZDeFBRVUU0UWl4SlFVRTVRaXhEUVVGb1FqdEJRVU5CTEUxQlFVa3NUMEZCU2l4RlFVRmhPMEZCUTFnc1ZVRkJUU3hKUVVGT0xFTkJRVmNzVDBGQldDeEZRVUZ2UWl4UFFVRndRaXhEUVVFMFFpeFZRVUZETEU5QlFVUXNSVUZCWVR0QlFVTjJReXhWUVVGTkxGTkJRVk1zTWtOQlFXOUNMRTlCUVhCQ0xFVkJRVFpDTEd0Q1FVRTNRaXhGUVVGcFJDeHhRa0ZCYWtRc1EwRkJaanRCUVVOQkxHRkJRVThzVDBGQlVDeEhRVUZwUWl4UFFVRnFRanM3UVVGRlFTeHBRa0ZCVnl4SlFVRllMRU5CUVdkQ0xFVkJRVVVzWjBKQlFVWXNSVUZCVnl4UlFVRlJMRWxCUVVrc1RVRkJTaXhEUVVGWExFMUJRVmdzUTBGQmJrSXNSVUZCYUVJN1FVRkRSQ3hMUVV4RU8wRkJUVVE3TzBGQlJVUXNWMEZCVXl4blFrRkJWQ3hEUVVFd1FpeFBRVUV4UWl4RlFVRnRReXhWUVVGRExFdEJRVVFzUlVGQlZ6dEJRVU0xUXl4UlFVRk5MR2xDUVVGcFFpeE5RVUZOTEUxQlFVNHNRMEZCWVN4WlFVRmlMRU5CUVRCQ0xHRkJRVEZDTEVOQlFYWkNPMEZCUTBFc1VVRkJTU3hyUWtGQmEwSXNiVUpCUVcxQ0xFbEJRWHBETEVWQlFTdERPMEZCUXpkRExGVkJRVTBzUzBGQlN5eE5RVUZOTEUxQlFVNHNRMEZCWVN4WlFVRmlMRU5CUVRCQ0xHRkJRVEZDTEVOQlFWZzdRVUZEUVN4VlFVRk5MRlZCUVZVc1UwRkJVeXhoUVVGVUxFTkJRWFZDTEVWQlFYWkNMRU5CUVdoQ096dEJRVVZCTEZWQlFVMHNXVUZCV1N4WFFVRlhMRWxCUVZnc1EwRkJaMEk3UVVGQlFTeGxRVUZMTEVWQlFVVXNUMEZCUml4TFFVRmpMRTlCUVc1Q08wRkJRVUVzVDBGQmFFSXNRMEZCYkVJN08wRkJSVUVzVlVGQlNTeERRVUZETEZOQlFVd3NSVUZCWjBJN1FVRkRaRHRCUVVORU96dEJRVVZFTzBGQlEwRXNXVUZCVFN4TlFVRk9MRU5CUVdFc1NVRkJZanM3UVVGRlFTeG5Ra0ZCVlN4TlFVRldMRU5CUVdsQ0xFbEJRV3BDTzBGQlEwUTdRVUZEUml4SFFXcENSRHM3UVVGdFFrRXNVMEZCVHl4TlFVRlFPMEZCUTBRc1EwRm9WR01zUlVGQlpqczdhMEpCYTFSbExFMDdPenM3T3pzN096czdPenM3UVVOMFZHWTdPenM3UVVGRFFUczdPenRCUVVOQk96czdPenM3T3pzclpVRlFRVHM3T3pzN096dEJRVk5CTEVsQlFVMHNVMEZCVlN4WlFVRk5PenRCUVVWd1FqczdPenM3TzBGQlRVRXNUVUZCVFN4UFFVRlBMRkZCUVdJN1FVRkRRU3hOUVVGTkxIRkNRVUZ4UWp0QlFVTjZRaXhoUVVGVExFbEJSR2RDTzBGQlJYcENMRmRCUVU4c1NVRkdhMEk3UVVGSGVrSXNZVUZCVXl4SlFVaG5RanRCUVVsNlFpeG5Ra0ZCV1N4SlFVcGhPMEZCUzNwQ0xGVkJRVTBzU1VGTWJVSTdRVUZOZWtJc1lVRkJVenRCUVU1blFpeEhRVUV6UWp0QlFWRkJMRTFCUVUwc2QwSkJRWGRDTEVOQlF6VkNMRmxCUkRSQ0xFTkJRVGxDT3p0QlFVbEJPenM3T3pzN1FVRnlRbTlDTEUxQk1rSmtMRTFCTTBKak8wRkJRVUU3TzBGQk5rSnNRaXh6UWtGQk1FSTdRVUZCUVN4VlFVRmtMRTlCUVdNc2RVVkJRVW9zUlVGQlNUczdRVUZCUVRzN1FVRkRlRUlzVlVGQlRTeFhRVUZYTEV0QlEycENMR3RFUVVScFFpeEhRVVZtTERSRFFVWmxMRWRCUjJJc09FSkJTR0VzUjBGSldDdzJRa0ZLVnl4SFFVdFVMR2REUVV4VExFZEJUVmdzVVVGT1Z5eEhRVTlZTERKQ1FWQlhMRWRCVVZRc1UwRlNVeXhIUVZOVUxHMURRVlJUTEVkQlZWQXNjME5CVms4c1IwRlhUQ3h2UTBGWVN5eEhRVmxRTEZGQldrOHNSMEZoVkN4UlFXSlRMRWRCWTFnc1VVRmtWeXhIUVdWWUxEWkNRV1pYTEVkQlowSllMRkZCYUVKWExFZEJhVUppTEZGQmFrSmhMRWRCYTBKbUxGRkJiRUpsTEVkQmJVSnFRaXhSUVc1Q1FUczdRVUZ4UWtFc1ZVRkJTU3hEUVVGRExFMUJRVTBzVDBGQlRpeERRVUZqTEZGQlFWRXNUMEZCZEVJc1EwRkJUQ3hGUVVGeFF6dEJRVU51UXl4blFrRkJVU3hQUVVGU0xFZEJRV3RDTEZGQlFWRXNWVUZCVWl4SFFVRnhRaXh0UWtGQmJVSXNUMEZCZUVNc1IwRkJhMFFzUlVGQmNFVTdRVUZEUkRzN1FVRjRRblZDTEd0SVFUQkNiRUlzVDBFeFFtdENMRVZCTUVKVUxGRkJNVUpUT3p0QlFUUkNlRUlzV1VGQlN5eFBRVUZNTEVkQlFXVXNTVUZCWmp0QlFUVkNkMEk3UVVFMlFucENPenRCUVRGRWFVSTdRVUZCUVR0QlFVRkJMRFpDUVRSRVdEdEJRVU5NT3p0QlFVVkJMR0ZCUVVzc1QwRkJUQ3hIUVVGbExHOUNRVUZaTEVWQlFVTXNVMEZCVXl4TFFVRkxMRlZCUVV3c1IwRkJhMElzWVVGQmJFSXNRMEZCWjBNc1UwRkJhRU1zUTBGQlZpeEZRVUZhTEVOQlFXWTdRVUZEUVN4aFFVRkxMRTlCUVV3c1EwRkJZU3hQUVVGaUxFTkJRWEZDTEVsQlFYSkNPMEZCUTBRN1FVRnFSV2xDTzBGQlFVRTdRVUZCUVN3MlFrRnRSVmc3UVVGRFREczdRVUZGUVN4aFFVRkxMRTlCUVV3c1EwRkJZU3hQUVVGaUxFTkJRWEZDTEV0QlFYSkNPMEZCUTBFc1lVRkJTeXhQUVVGTUxFZEJRV1VzU1VGQlpqdEJRVU5FTzBGQmVFVnBRanRCUVVGQk8wRkJRVUVzYlVOQk1FVkZPMEZCUTJ4Q0xHVkJRVThzU1VGQlVEdEJRVU5FTzBGQk5VVnBRanRCUVVGQk8wRkJRVUVzYjBOQk9FVkhMRTlCT1VWSUxFVkJPRVZaTzBGQlF6VkNMR1ZCUVU4c1NVRkJTU3hOUVVGS0xFTkJRVmNzVDBGQldDeERRVUZRTzBGQlEwUTdRVUZvUm1sQ096dEJRVUZCTzBGQlFVRTdPMEZCYlVad1FqczdPenM3T3p0QlFVdEJMRTFCUVUwc1lVRkJZU3hGUVVGdVFqdEJRVU5CTEUxQlFVMHNWVUZCVlN4VFFVRlRMR2RDUVVGVUxFOUJRVGhDTEdkQ1FVRlBMRlZCUVZBc1JVRkJPVUlzUTBGQmFFSTdPMEZCUlVFc1RVRkJTU3hQUVVGS0xFVkJRV0U3UVVGRFdDeFZRVUZOTEVsQlFVNHNRMEZCVnl4UFFVRllMRVZCUVc5Q0xFOUJRWEJDTEVOQlFUUkNMRlZCUVVNc1QwRkJSQ3hGUVVGaE8wRkJRM1pETEZWQlFVMHNVMEZCVXl3eVEwRkJiMElzVDBGQmNFSXNSVUZCTmtJc2EwSkJRVGRDTEVWQlFXbEVMSEZDUVVGcVJDeERRVUZtTzBGQlEwRXNZVUZCVHl4UFFVRlFMRWRCUVdsQ0xFOUJRV3BDT3p0QlFVVkJMRlZCUVVrc1QwRkJUeXhKUVVGUUxFdEJRV2RDTEVsQlFYQkNMRVZCUVRCQ08wRkJRM2hDTzBGQlEwRXNiVUpCUVZjc1NVRkJXQ3hEUVVGblFpeEpRVUZKTEUxQlFVb3NRMEZCVnl4TlFVRllMRU5CUVdoQ08wRkJRMFE3UVVGRFJpeExRVkpFTzBGQlUwUTdPMEZCUlVRc1YwRkJVeXhuUWtGQlZDeERRVUV3UWl4UFFVRXhRaXhGUVVGdFF5eFZRVUZETEV0QlFVUXNSVUZCVnp0QlFVTTFReXhSUVVGTkxHbENRVUZwUWl4TlFVRk5MRTFCUVU0c1EwRkJZU3haUVVGaUxFTkJRVEJDTEdGQlFURkNMRU5CUVhaQ08wRkJRMEVzVVVGQlNTeHJRa0ZCYTBJc2JVSkJRVzFDTEVsQlFYcERMRVZCUVN0RE8wRkJRemRETEZWQlFVMHNTMEZCU3l4TlFVRk5MRTFCUVU0c1EwRkJZU3haUVVGaUxFTkJRVEJDTEdGQlFURkNMRU5CUVZnN1FVRkRRU3hWUVVGTkxGVkJRVlVzVTBGQlV5eGhRVUZVTEVOQlFYVkNMRVZCUVhaQ0xFTkJRV2hDT3p0QlFVVkJMRlZCUVUwc1dVRkJXU3hYUVVGWExFbEJRVmdzUTBGQlowSTdRVUZCUVN4bFFVRkxMRVZCUVVVc1QwRkJSaXhMUVVGakxFOUJRVzVDTzBGQlFVRXNUMEZCYUVJc1EwRkJiRUk3TzBGQlJVRXNWVUZCU1N4RFFVRkRMRk5CUVV3c1JVRkJaMEk3UVVGRFpEdEJRVU5FT3p0QlFVVkVPMEZCUTBFc1dVRkJUU3hOUVVGT0xFTkJRV0VzU1VGQllqczdRVUZGUVN4blFrRkJWU3hOUVVGV0xFTkJRV2xDTEVsQlFXcENPMEZCUTBRN1FVRkRSaXhIUVdwQ1JEczdRVUZ0UWtFc1UwRkJUeXhOUVVGUU8wRkJRMFFzUTBFelNHTXNSVUZCWmpzN2EwSkJOa2hsTEUwN096czdPenM3T3pzN096czdRVU5xU1dZN096czdRVUZEUVRzN096czdPenM3SzJWQlRrRTdPenM3T3pzN1FVRlJRU3hKUVVGTkxGTkJRVlVzV1VGQlRUczdRVUZGY0VJN096czdPenRCUVUxQkxFMUJRVTBzVDBGQlR5eFJRVUZpTzBGQlEwRXNUVUZCVFN4eFFrRkJjVUk3UVVGRGVrSXNZVUZCVXl4SlFVUm5RanRCUVVWNlFpeFhRVUZQTEVsQlJtdENPMEZCUjNwQ0xHRkJRVk1zU1VGSVowSTdRVUZKZWtJc1owSkJRVmtzU1VGS1lUdEJRVXQ2UWl4VlFVRk5MRWxCVEcxQ08wRkJUWHBDTEdGQlFWTXNRMEZEVUR0QlFVTkZMR0ZCUVU4c1VVRkVWRHRCUVVWRkxGbEJRVTBzVVVGR1VqdEJRVWRGTEdWQlFWTXNTVUZJV0R0QlFVbEZMR0ZCUVU4N1FVRktWQ3hMUVVSUExFVkJUMUE3UVVGRFJTeGhRVUZQTEZOQlJGUTdRVUZGUlN4WlFVRk5MRWxCUmxJN1FVRkhSU3hsUVVGVExFbEJTRmc3UVVGSlJTeGhRVUZQTzBGQlNsUXNTMEZRVHp0QlFVNW5RaXhIUVVFelFqdEJRWEZDUVN4TlFVRk5MSGRDUVVGM1FpeERRVU0xUWl4WlFVUTBRaXhEUVVFNVFqczdRVUZKUVRzN096czdPMEZCYkVOdlFpeE5RWGREWkN4TlFYaERZenRCUVVGQk96dEJRVEJEYkVJc2MwSkJRVEJDTzBGQlFVRXNWVUZCWkN4UFFVRmpMSFZGUVVGS0xFVkJRVWs3TzBGQlFVRTdPMEZCUTNoQ0xGVkJRVTBzVjBGQlZ5eExRVU5xUWl4clJFRkVhVUlzUjBGRlppdzBRMEZHWlN4SFFVZGlMRGhDUVVoaExFZEJTVmdzTmtKQlNsY3NSMEZMVkN4blEwRk1VeXhIUVUxWUxGRkJUbGNzUjBGUFdDd3lRa0ZRVnl4SFFWRlVMRk5CVWxNc1IwRlRWQ3h0UkVGVVV5eEhRVlZZTEZGQlZsY3NSMEZYV0N3MlFrRllWeXhIUVZsWUxGRkJXbGNzUjBGaFlpeFJRV0poTEVkQlkyWXNVVUZrWlN4SFFXVnFRaXhSUVdaQk96dEJRV2xDUVN4VlFVRkpMRU5CUVVNc1RVRkJUU3hQUVVGT0xFTkJRV01zVVVGQlVTeFBRVUYwUWl4RFFVRk1MRVZCUVhGRE8wRkJRMjVETEdkQ1FVRlJMRTlCUVZJc1IwRkJhMElzYlVKQlFXMUNMRTlCUVhKRE8wRkJRMFE3TzBGQmNFSjFRaXcyUjBGelFteENMRTlCZEVKclFpeEZRWE5DVkN4UlFYUkNVenRCUVhWQ2VrSTdPMEZCYWtWcFFqdEJRVUZCTzBGQlFVRXNOa0pCYlVWWU8wRkJRMHc3UVVGRFFTeGhRVUZMTEdkQ1FVRk1PMEZCUTBRN1FVRjBSV2xDTzBGQlFVRTdRVUZCUVN3MlFrRjNSVmc3UVVGRFREdEJRVU5CTEdGQlFVc3NaMEpCUVV3N1FVRkRSRHRCUVRORmFVSTdRVUZCUVR0QlFVRkJMR2xEUVRaRlVEdEJRVU5VTEdWQlFVOHNTMEZCU3l4UFFVRk1MRU5CUVdFc1QwRkJZaXhEUVVGeFFpeGhRVUZ5UWl4RFFVRnRReXhsUVVGdVF5eERRVUZRTzBGQlEwUTdRVUV2UldsQ08wRkJRVUU3UVVGQlFTeDVRMEZwUmtNN1FVRkRha0lzWVVGQlN5eGxRVUZNTEVOQlFYRkNMRVZCUVVVc1VVRkJVU3hMUVVGTExGRkJRVXdzUlVGQlZpeEZRVUV5UWl4UFFVRlBMRTlCUVd4RExFVkJRWEpDTzBGQlEwUTdRVUZ1Um1sQ08wRkJRVUU3UVVGQlFTeDVRMEZ4UmtNN1FVRkRha0lzWVVGQlN5eHBRa0ZCVEN4RFFVRjFRaXhGUVVGRkxGRkJRVkVzUzBGQlN5eFJRVUZNTEVWQlFWWXNSVUZCTWtJc1QwRkJUeXhQUVVGc1F5eEZRVUYyUWp0QlFVTkVPMEZCZGtacFFqdEJRVUZCTzBGQlFVRXNjVU5CZVVaSUxFdEJla1pITEVWQmVVWkpPMEZCUTNCQ0xGbEJRVWtzVFVGQlRTeE5RVUZPTEV0QlFXbENMRXRCUVVzc1VVRkJUQ3hGUVVGeVFpeEZRVUZ6UXp0QlFVTndRenRCUVVORU96dEJRVVZFTEhWSVFVRnhRaXhMUVVGeVFqdEJRVU5FTzBGQkwwWnBRanRCUVVGQk8wRkJRVUVzYzBOQmFVZFJPMEZCUVVFc1dVRkJXaXhMUVVGWkxIVkZRVUZLTEVWQlFVazdPMEZCUTNoQ0xHRkJRVXNzVVVGQlRDeEhRVUZuUWl4TFFVRm9RaXhIUVVGM1FpeExRVUY0UWp0QlFVTkVPMEZCYmtkcFFqdEJRVUZCTzBGQlFVRXNjME5CY1VkR08wRkJRMlFzWlVGQlR5eExRVUZMTEZGQlFVd3NSMEZCWjBJc1MwRkJka0k3UVVGRFJEdEJRWFpIYVVJN1FVRkJRVHRCUVVGQkxHMURRWGxIUlR0QlFVTnNRaXhsUVVGUExFbEJRVkE3UVVGRFJEdEJRVE5IYVVJN1FVRkJRVHRCUVVGQkxHOURRVFpIUnl4UFFUZEhTQ3hGUVRaSFdUdEJRVU0xUWl4bFFVRlBMRWxCUVVrc1RVRkJTaXhEUVVGWExFOUJRVmdzUTBGQlVEdEJRVU5FTzBGQkwwZHBRanM3UVVGQlFUdEJRVUZCT3p0QlFXdEljRUk3T3pzN096czdRVUZMUVN4TlFVRk5MR0ZCUVdFc1JVRkJia0k3UVVGRFFTeE5RVUZOTEZWQlFWVXNVMEZCVXl4blFrRkJWQ3hQUVVFNFFpeG5Ra0ZCVHl4VlFVRlFMRVZCUVRsQ0xFTkJRV2hDT3p0QlFVVkJMRTFCUVVrc1QwRkJTaXhGUVVGaE8wRkJRMWdzVlVGQlRTeEpRVUZPTEVOQlFWY3NUMEZCV0N4RlFVRnZRaXhQUVVGd1FpeERRVUUwUWl4VlFVRkRMRTlCUVVRc1JVRkJZVHRCUVVOMlF5eFZRVUZOTEZOQlFWTXNNa05CUVc5Q0xFOUJRWEJDTEVWQlFUWkNMR3RDUVVFM1FpeEZRVUZwUkN4eFFrRkJha1FzUTBGQlpqdEJRVU5CTEdGQlFVOHNUMEZCVUN4SFFVRnBRaXhQUVVGcVFqczdRVUZGUVN4VlFVRkpMRTlCUVU4c1NVRkJVQ3hMUVVGblFpeEpRVUZ3UWl4RlFVRXdRanRCUVVONFFqdEJRVU5CTEcxQ1FVRlhMRWxCUVZnc1EwRkJaMElzU1VGQlNTeE5RVUZLTEVOQlFWY3NUVUZCV0N4RFFVRm9RanRCUVVORU8wRkJRMFlzUzBGU1JEdEJRVk5FT3p0QlFVVkVMRmRCUVZNc1owSkJRVlFzUTBGQk1FSXNUMEZCTVVJc1JVRkJiVU1zVlVGQlF5eExRVUZFTEVWQlFWYzdRVUZETlVNc1VVRkJUU3hwUWtGQmFVSXNUVUZCVFN4TlFVRk9MRU5CUVdFc1dVRkJZaXhEUVVFd1FpeGhRVUV4UWl4RFFVRjJRanRCUVVOQkxGRkJRVWtzYTBKQlFXdENMRzFDUVVGdFFpeEpRVUY2UXl4RlFVRXJRenRCUVVNM1F5eFZRVUZOTEV0QlFVc3NUVUZCVFN4TlFVRk9MRU5CUVdFc1dVRkJZaXhEUVVFd1FpeGhRVUV4UWl4RFFVRllPMEZCUTBFc1ZVRkJUU3hWUVVGVkxGTkJRVk1zWVVGQlZDeERRVUYxUWl4RlFVRjJRaXhEUVVGb1FqczdRVUZGUVN4VlFVRk5MRmxCUVZrc1YwRkJWeXhKUVVGWUxFTkJRV2RDTzBGQlFVRXNaVUZCU3l4RlFVRkZMRTlCUVVZc1MwRkJZeXhQUVVGdVFqdEJRVUZCTEU5QlFXaENMRU5CUVd4Q096dEJRVVZCTEZWQlFVa3NRMEZCUXl4VFFVRk1MRVZCUVdkQ08wRkJRMlE3UVVGRFJEczdRVUZGUkR0QlFVTkJMRmxCUVUwc1RVRkJUaXhEUVVGaExFbEJRV0k3TzBGQlJVRXNaMEpCUVZVc1RVRkJWaXhEUVVGcFFpeEpRVUZxUWp0QlFVTkVPMEZCUTBZc1IwRnFRa1E3TzBGQmJVSkJMRk5CUVU4c1RVRkJVRHRCUVVORUxFTkJNVXBqTEVWQlFXWTdPMnRDUVRSS1pTeE5PenM3T3pzN096czdPenM3TzBGREwwcG1PenM3TzBGQlEwRTdPenM3UVVGRFFUczdRVUZEUVRzN096czdPenM3SzJWQlVrRTdPenM3T3pzN1FVRlZRU3hKUVVGTkxGZEJRVmtzV1VGQlRUdEJRVU4wUWpzN096czdPMEZCVFVFc1RVRkJUU3hQUVVGUExGVkJRV0k3UVVGRFFTeE5RVUZOTEZWQlFWVXNUMEZCYUVJN1FVRkRRU3hOUVVGTkxIRkNRVUZ4UWp0QlFVTjZRaXhoUVVGVExFbEJSR2RDTzBGQlJYcENMR0ZCUVZNc1NVRkdaMEk3UVVGSGVrSXNXVUZCVVR0QlFVaHBRaXhIUVVFelFqdEJRVXRCTEUxQlFVMHNkMEpCUVhkQ0xFTkJRelZDTEZOQlJEUkNMRVZCUlRWQ0xGRkJSalJDTEVOQlFUbENPenRCUVV0Qk96czdPenM3UVVGdVFuTkNMRTFCZVVKb1FpeFJRWHBDWjBJN1FVRkJRVHM3UVVFeVFuQkNMSGRDUVVFd1FqdEJRVUZCTEZWQlFXUXNUMEZCWXl4MVJVRkJTaXhGUVVGSk96dEJRVUZCT3p0QlFVRkJMSE5JUVVOc1FpeEpRVVJyUWl4RlFVTmFMRTlCUkZrc1JVRkRTQ3hyUWtGRVJ5eEZRVU5wUWl4UFFVUnFRaXhGUVVNd1FpeHhRa0ZFTVVJc1JVRkRhVVFzUzBGRWFrUXNSVUZEZDBRc1MwRkVlRVE3TzBGQlIzaENMRlZCUVUwc1YwRkJWeXhOUVVGTExFOUJRVXdzUTBGQllTeFBRVUZpTEVOQlFYRkNMR0ZCUVhKQ0xFTkJRVzFETEdsQ1FVRnVReXhEUVVGcVFqdEJRVU5CTEZWQlFVMHNUMEZCVHl4TlFVRkxMRmRCUVV3c1EwRkJhVUlzVVVGQmFrSXNRMEZCWWpzN1FVRkZRU3haUVVGTExGZEJRVXdzUTBGQmFVSXNTMEZCU3l4TFFVRjBRaXhGUVVFMlFpeExRVUZMTEVsQlFXeERMRVZCUVhkRExFdEJRWGhETzBGQlRuZENPMEZCVDNwQ096dEJRV3hEYlVJN1FVRkJRVHRCUVVGQkxHOURRVzlEY1VNN1FVRkJRU3haUVVFM1F5eExRVUUyUXl4MVJVRkJja01zUlVGQmNVTTdPMEZCUVVFN08wRkJRVUVzV1VGQmFrTXNTVUZCYVVNc2RVVkJRVEZDTEVsQlFUQkNPMEZCUVVFc1dVRkJjRUlzVjBGQmIwSXNkVVZCUVU0c1NVRkJUVHM3UVVGRGRrUXNXVUZCU1N4RFFVRkRMRXRCUVVzc1QwRkJUQ3hEUVVGaExFOUJRV3hDTEVWQlFUSkNPMEZCUTNwQ0xHbENRVUZQTEV0QlFWQTdRVUZEUkRzN1FVRkZSQ3haUVVGSkxHTkJRV01zU1VGQmJFSTdRVUZEUVN4aFFVRkxMRTlCUVV3c1EwRkJZU3hQUVVGaUxFTkJRWEZDTEdGQlFYSkNMRU5CUVcxRExHVkJRVzVETEVWQlFXOUVMRk5CUVhCRUxFZEJRV2RGTEVsQlFXaEZPMEZCUTBFc1lVRkJTeXhQUVVGTUxFTkJRV0VzVDBGQllpeERRVUZ4UWl4aFFVRnlRaXhEUVVGdFF5eHpRa0ZCYmtNc1JVRkJNa1FzUzBGQk0wUXNSMEZCYlVVc1MwRkJia1U3TzBGQlJVRXNXVUZCVFN4UlFVRlJMRXRCUVVzc1QwRkJUQ3hEUVVGaExFOUJRV0lzUTBGQmNVSXNaMEpCUVhKQ0xFTkJRWE5ETEU5QlFYUkRMRXRCUVd0RUxFVkJRV2hGTzBGQlEwRXNXVUZCU1N4WlFVRlpMRXRCUVdoQ096dEJRVVZCTEdOQlFVMHNTVUZCVGl4RFFVRlhMRXRCUVZnc1JVRkJhMElzVDBGQmJFSXNRMEZCTUVJc1ZVRkJReXhKUVVGRUxFVkJRVlU3UVVGRGJFTXNZMEZCU1N4TFFVRkxMRk5CUVV3c1EwRkJaU3hSUVVGbUxFTkJRWGRDTEZWQlFYaENMRU5CUVVvc1JVRkJlVU03UVVGRGRrTXNhVUpCUVVzc1UwRkJUQ3hEUVVGbExFMUJRV1lzUTBGQmMwSXNWVUZCZEVJN1FVRkRSRHM3UVVGRlJDeGpRVUZOTEU5QlFVOHNUMEZCU3l4WFFVRk1MRU5CUVdsQ0xFbEJRV3BDTEVOQlFXSTdPMEZCUlVFc1kwRkJTU3hWUVVGVkxFdEJRVXNzUzBGQmJrSXNSVUZCTUVJN1FVRkRlRUlzWjBKQlFVa3NRMEZCUXl4TFFVRkxMRk5CUVV3c1EwRkJaU3hSUVVGbUxFTkJRWGRDTEZWQlFYaENMRU5CUVV3c1JVRkJNRU03UVVGRGVFTXNiVUpCUVVzc1UwRkJUQ3hEUVVGbExFZEJRV1lzUTBGQmJVSXNWVUZCYmtJN1FVRkRSRHM3UVVGRlJDd3dRa0ZCWXl4TFFVRkxMRWxCUVc1Q08wRkJRMEVzZDBKQlFWa3NTVUZCV2p0QlFVTkVPMEZCUTBZc1UwRm1SRHM3UVVGcFFrRXNXVUZCU1N4bFFVRmxMRk5CUVc1Q0xFVkJRVGhDTzBGQlF6VkNMR1ZCUVVzc1QwRkJUQ3hEUVVGaExFOUJRV0lzUTBGQmNVSXNZVUZCY2tJc1EwRkJiVU1zWlVGQmJrTXNSVUZCYjBRc1UwRkJjRVFzUjBGQlowVXNWMEZCYUVVN1FVRkRSQ3hUUVVaRUxFMUJSVThzU1VGQlNTeGxRVUZsTEVOQlFVTXNVMEZCY0VJc1JVRkJLMEk3UVVGRGNFTXNaMEpCUVUwc1NVRkJTU3hMUVVGS0xFTkJRV0VzU1VGQllpeHhRa0ZCYVVNc1MwRkJha01zTkVOQlFVNDdRVUZEUkRzN1FVRkZSQ3hsUVVGUExFbEJRVkE3UVVGRFJEdEJRWGhGYlVJN1FVRkJRVHRCUVVGQkxHOURRVEJGVGp0QlFVTmFMR1ZCUVU4c1MwRkJTeXhQUVVGTUxFTkJRV0VzVDBGQllpeERRVUZ4UWl4aFFVRnlRaXhEUVVGdFF5eHpRa0ZCYmtNc1JVRkJNa1FzUzBGQmJFVTdRVUZEUkR0QlFUVkZiVUk3UVVGQlFUdEJRVUZCTEc5RFFUaEZTenRCUVVGQkxGbEJRV0lzU1VGQllTeDFSVUZCVGl4SlFVRk5PenRCUVVOMlFpeFpRVUZKTEU5QlFVOHNSVUZCV0R0QlFVTkJMRmxCUVVrc1VVRkJVU3hGUVVGYU96dEJRVVZCTEZsQlFVa3NTVUZCU2l4RlFVRlZPMEZCUTFJc2FVSkJRVThzUzBGQlN5eFpRVUZNTEVOQlFXdENMRmRCUVd4Q0xFdEJRV3RETEV0QlFVc3NVMEZCT1VNN08wRkJSVUVzWTBGQlRTeHRRa0ZCYlVJc1MwRkJTeXhoUVVGTUxFTkJRVzFDTEU5QlFXNUNMRU5CUVhwQ08wRkJRMEVzWTBGQlNTeG5Ra0ZCU2l4RlFVRnpRanRCUVVOd1FpeHRRa0ZCVHl4cFFrRkJhVUlzVTBGQmVFSTdRVUZEUkRzN1FVRkZSQ3hyUWtGQlVTeExRVUZMTEZsQlFVd3NRMEZCYTBJc1dVRkJiRUlzUzBGQmJVTXNSVUZCTTBNN1FVRkRSRHM3UVVGRlJDeGxRVUZQTEVWQlFVVXNWVUZCUml4RlFVRlJMRmxCUVZJc1JVRkJVRHRCUVVORU8wRkJPVVp0UWp0QlFVRkJPMEZCUVVFc2NVTkJaMGRNTEV0QmFFZExMRVZCWjBkRk8wRkJRM0JDTEZsQlFVa3NUVUZCVFN4SlFVRk9MRXRCUVdVc2FVSkJRVTBzUzBGQmVrSXNSVUZCWjBNN1FVRkRPVUlzWTBGQlRTeFhRVUZYTERoQ1FVRnJRaXhOUVVGTkxFMUJRWGhDTEVWQlFXZERMRlZCUVdoRExFTkJRV3BDT3p0QlFVVkJPenM3TzBGQlNVRXNZMEZCU1N4RFFVRkRMRkZCUVVRc1NVRkJZU3hoUVVGaExFdEJRVXNzVlVGQlRDeEZRVUU1UWl4RlFVRnBSRHRCUVVNdlF5eHBRa0ZCU3l4SlFVRk1PMEZCUTBRN1FVRkZSaXhUUVZoRUxFMUJWMDhzU1VGQlNTeE5RVUZOTEVsQlFVNHNTMEZCWlN4UFFVRnVRaXhGUVVFMFFqdEJRVU5xUXl4alFVRk5MRTlCUVU4c09FSkJRV3RDTEUxQlFVMHNUVUZCZUVJc1JVRkJaME1zVFVGQmFFTXNRMEZCWWpzN1FVRkZRU3hqUVVGSkxFbEJRVW9zUlVGQlZUdEJRVU5TTEdkQ1FVRkpMRXRCUVVzc1UwRkJUQ3hEUVVGbExGRkJRV1lzUTBGQmQwSXNWVUZCZUVJc1EwRkJTaXhGUVVGNVF6dEJRVU4yUXp0QlFVTkVPenRCUVVWRUxHZENRVUZOTEZkQlFWY3NTMEZCU3l4WFFVRk1MRU5CUVdsQ0xFbEJRV3BDTEVOQlFXcENPenRCUVVWQkxHZENRVUZKTEV0QlFVc3NWMEZCVEN4UFFVRjFRaXhUUVVGVExFdEJRWEJETEVWQlFUSkRPMEZCUTNwRE8wRkJRMEVzYlVKQlFVc3NWMEZCVEN4RFFVRnBRaXhUUVVGVExFdEJRVEZDTEVWQlFXbERMRk5CUVZNc1NVRkJNVU1zUlVGQlowUXNTMEZCYUVRN1FVRkRRU3hyUWtGQlRTeFRRVUZUTEVWQlFVVXNWVUZCUml4RlFVRlJMRTFCUVUwc1UwRkJVeXhKUVVGMlFpeEZRVUUyUWl4UFFVRlBMRk5CUVZNc1MwRkJOME1zUlVGQlpqdEJRVU5CTEcxQ1FVRkxMRmxCUVV3c1EwRkJhMElzYVVKQlFVMHNZVUZCZUVJc1JVRkJkVU1zVFVGQmRrTTdRVUZEUkRzN1FVRkZSQ3hwUWtGQlN5eEpRVUZNTzBGQlEwRTdRVUZEUkRzN1FVRkZSRHRCUVVOQkxHTkJRVTBzWlVGQlpTdzRRa0ZCYTBJc1RVRkJUU3hOUVVGNFFpeEZRVUZuUXl4bFFVRm9ReXhEUVVGeVFqdEJRVU5CTEdOQlFVa3NXVUZCU2l4RlFVRnJRanRCUVVOb1FqdEJRVU5FT3p0QlFVVkVMR1ZCUVVzc1RVRkJURHRCUVVORU8wRkJRMFk3UVVGNlNXMUNPMEZCUVVFN1FVRkJRU3dyUWtFeVNWZzdRVUZEVUN4WlFVRkpMRXRCUVVzc1QwRkJUQ3hEUVVGaExFOUJRV0lzUTBGQmNVSXNVMEZCY2tJc1EwRkJLMElzVVVGQkwwSXNRMEZCZDBNc1VVRkJlRU1zUTBGQlNpeEZRVUYxUkR0QlFVTnlSQ3hwUWtGQlR5eExRVUZMTEVsQlFVd3NSVUZCVUR0QlFVTkVPenRCUVVWRUxHVkJRVThzUzBGQlN5eEpRVUZNTEVWQlFWQTdRVUZEUkR0QlFXcEtiVUk3UVVGQlFUdEJRVUZCTERaQ1FXMUtZanRCUVVOTUxGbEJRVWtzUzBGQlN5eFBRVUZNTEVOQlFXRXNUMEZCWWl4RFFVRnhRaXhUUVVGeVFpeERRVUVyUWl4UlFVRXZRaXhEUVVGM1F5eFJRVUY0UXl4RFFVRktMRVZCUVhWRU8wRkJRM0pFTEdsQ1FVRlBMRXRCUVZBN1FVRkRSRHM3UVVGRlJDeGhRVUZMTEU5QlFVd3NRMEZCWVN4UFFVRmlMRU5CUVhGQ0xGTkJRWEpDTEVOQlFTdENMRWRCUVM5Q0xFTkJRVzFETEZGQlFXNURPenRCUVVWQkxGbEJRVTBzWlVGQlpTeExRVUZMTEU5QlFVd3NRMEZCWVN4UFFVRmlMRU5CUVhGQ0xHRkJRWEpDTEVOQlFXMURMR2RDUVVGdVF5eERRVUZ5UWpzN1FVRkZRVHRCUVVOQkxIRkNRVUZoTEZOQlFXSXNSMEZCZVVJc1EwRkJla0k3TzBGQlJVRXNZVUZCU3l4WlFVRk1MRU5CUVd0Q0xHbENRVUZOTEVsQlFYaENPMEZCUTBFc1lVRkJTeXhaUVVGTUxFTkJRV3RDTEdsQ1FVRk5MRXRCUVhoQ096dEJRVVZCTEdGQlFVc3NaVUZCVEN4RFFVRnhRaXhGUVVGRkxGRkJRVkVzV1VGQlZpeEZRVUYzUWl4UFFVRlBMRTlCUVM5Q0xFVkJRWEpDTzBGQlEwRXNZVUZCU3l4bFFVRk1MRU5CUVhGQ0xFVkJRVVVzVVVGQlVTeFRRVUZUTEVsQlFXNUNMRVZCUVhsQ0xFOUJRVThzYVVKQlFVMHNTMEZCZEVNc1JVRkJja0k3TzBGQlJVRXNaVUZCVHl4SlFVRlFPMEZCUTBRN1FVRjBTMjFDTzBGQlFVRTdRVUZCUVN3MlFrRjNTMkk3UVVGRFRDeFpRVUZKTEVOQlFVTXNTMEZCU3l4UFFVRk1MRU5CUVdFc1QwRkJZaXhEUVVGeFFpeFRRVUZ5UWl4RFFVRXJRaXhSUVVFdlFpeERRVUYzUXl4UlFVRjRReXhEUVVGTUxFVkJRWGRFTzBGQlEzUkVMR2xDUVVGUExFdEJRVkE3UVVGRFJEczdRVUZGUkN4aFFVRkxMRTlCUVV3c1EwRkJZU3hQUVVGaUxFTkJRWEZDTEZOQlFYSkNMRU5CUVN0Q0xFMUJRUzlDTEVOQlFYTkRMRkZCUVhSRE96dEJRVVZCTEdGQlFVc3NXVUZCVEN4RFFVRnJRaXhwUWtGQlRTeEpRVUY0UWp0QlFVTkJMR0ZCUVVzc1dVRkJUQ3hEUVVGclFpeHBRa0ZCVFN4TlFVRjRRanM3UVVGRlFTeGhRVUZMTEdsQ1FVRk1MRU5CUVhWQ0xFVkJRVVVzVVVGQlVTeExRVUZMTEU5QlFVd3NRMEZCWVN4UFFVRmlMRU5CUVhGQ0xHRkJRWEpDTEVOQlFXMURMR2RDUVVGdVF5eERRVUZXTEVWQlFXZEZMRTlCUVU4c1QwRkJka1VzUlVGQmRrSTdRVUZEUVN4aFFVRkxMR2xDUVVGTUxFTkJRWFZDTEVWQlFVVXNVVUZCVVN4VFFVRlRMRWxCUVc1Q0xFVkJRWGxDTEU5QlFVOHNhVUpCUVUwc1MwRkJkRU1zUlVGQmRrSTdPMEZCUlVFc1pVRkJUeXhKUVVGUU8wRkJRMFE3UVVGMFRHMUNPMEZCUVVFN1FVRkJRU3h0UTBGM1RFRTdRVUZEYkVJc1pVRkJUeXhKUVVGUU8wRkJRMFE3UVVFeFRHMUNPMEZCUVVFN1FVRkJRU3h2UTBFMFRFTXNUMEUxVEVRc1JVRTBURlU3UVVGRE5VSXNOa2RCUVRKQ0xGRkJRVE5DTEVWQlFYRkRMRTlCUVhKRE8wRkJRMFE3UVVFNVRHMUNPenRCUVVGQk8wRkJRVUU3TzBGQmFVMTBRanM3T3pzN096dEJRVXRCTEUxQlFVMHNZVUZCWVN4RlFVRnVRanM3UVVGRlFTeE5RVUZOTEZsQlFWa3NVMEZCVXl4blFrRkJWQ3hQUVVFNFFpeEpRVUU1UWl4RFFVRnNRanRCUVVOQkxFMUJRVWtzVTBGQlNpeEZRVUZsTzBGQlEySXNWVUZCVFN4SlFVRk9MRU5CUVZjc1UwRkJXQ3hGUVVGelFpeFBRVUYwUWl4RFFVRTRRaXhWUVVGRExFOUJRVVFzUlVGQllUdEJRVU42UXl4VlFVRk5MRk5CUVZNc01rTkJRVzlDTEU5QlFYQkNMRVZCUVRaQ0xHdENRVUUzUWl4RlFVRnBSQ3h4UWtGQmFrUXNRMEZCWmp0QlFVTkJMR0ZCUVU4c1QwRkJVQ3hIUVVGcFFpeFBRVUZxUWpzN1FVRkZRU3hWUVVGSkxFTkJRVU1zVDBGQlR5eE5RVUZhTEVWQlFXOUNPMEZCUTJ4Q0xHMUNRVUZYTEVsQlFWZ3NRMEZCWjBJc1NVRkJTU3hSUVVGS0xFTkJRV0VzVFVGQllpeERRVUZvUWp0QlFVTkVPMEZCUTBZc1MwRlFSRHRCUVZGRU96dEJRVVZFTEZkQlFWTXNaMEpCUVZRc1EwRkJNRUlzVDBGQk1VSXNSVUZCYlVNc1ZVRkJReXhMUVVGRUxFVkJRVmM3UVVGRE5VTXNVVUZCVFN4bFFVRmxMRGhDUVVGclFpeE5RVUZOTEUxQlFYaENMRVZCUVdkRExHVkJRV2hETEVOQlFYSkNPMEZCUTBFc1VVRkJTU3haUVVGS0xFVkJRV3RDTzBGQlEyaENPMEZCUTBRN08wRkJSVVFzVVVGQlRTeFhRVUZYTERoQ1FVRnJRaXhOUVVGTkxFMUJRWGhDTEVWQlFXZERMRlZCUVdoRExFTkJRV3BDT3p0QlFVVkJMRkZCUVVrc1VVRkJTaXhGUVVGak8wRkJRMW9zVlVGQlRTeHBRa0ZCYVVJc1UwRkJVeXhaUVVGVUxFTkJRWE5DTEdGQlFYUkNMRU5CUVhaQ08wRkJRMEVzVlVGQlNTeHJRa0ZCYTBJc2JVSkJRVzFDTEVsQlFYSkRMRWxCUVRaRExGRkJRV3BFTEVWQlFUSkVPMEZCUTNwRUxGbEJRVTBzV1VGQldTeFhRVUZYTEVsQlFWZ3NRMEZCWjBJN1FVRkJRU3hwUWtGQlN5eEZRVUZGTEZWQlFVWXNUMEZCYlVJc1VVRkJlRUk3UVVGQlFTeFRRVUZvUWl4RFFVRnNRanM3UVVGRlFTeFpRVUZKTEVOQlFVTXNVMEZCVEN4RlFVRm5RanRCUVVOa08wRkJRMFE3TzBGQlJVUXNhMEpCUVZVc1RVRkJWanRCUVVORU8wRkJRMFk3UVVGRFJpeEhRWEJDUkRzN1FVRnpRa0VzVTBGQlR5eFJRVUZRTzBGQlEwUXNRMEV6VDJkQ0xFVkJRV3BDT3p0clFrRTJUMlVzVVRzN096czdPenM3T3pzN096dEJRMnhRWmpzN096dEJRVU5CT3p0QlFVTkJPenM3T3pzN096c3JaVUZRUVRzN096czdPenRCUVZOQkxFbEJRVTBzYVVKQlFXdENMRmxCUVUwN08wRkJSVFZDT3pzN096czdRVUZOUVN4TlFVRk5MRTlCUVU4c1owSkJRVk1zVlVGQlZDeEZRVUZpTzBGQlEwRXNUVUZCVFN4eFFrRkJjVUk3UVVGRGVrSXNZVUZCVXl4SlFVUm5RanRCUVVWNlFpeGhRVUZUTEVsQlJtZENPMEZCUjNwQ0xGbEJRVkU3UVVGSWFVSXNSMEZCTTBJN1FVRkxRU3hOUVVGTkxIZENRVUYzUWl4RFFVTTFRaXhUUVVRMFFpeEZRVVUxUWl4UlFVWTBRaXhEUVVFNVFqczdRVUZMUVRzN096czdPMEZCYmtJMFFpeE5RWGxDZEVJc1kwRjZRbk5DTzBGQlFVRTdPMEZCTWtJeFFpdzRRa0ZCTUVJN1FVRkJRU3hWUVVGa0xFOUJRV01zZFVWQlFVb3NSVUZCU1RzN1FVRkJRVHM3UVVGQlFTeHJTVUZEYkVJc1QwRkVhMEk3TzBGQlIzaENMRmxCUVVzc2EwSkJRVXdzUjBGQk1FSXNWVUZCUXl4TFFVRkVMRVZCUVZjN1FVRkRia01zV1VGQlRTeFRRVUZUTEUxQlFVMHNUVUZCVGl4RFFVRmhMRXRCUVRWQ096dEJRVVZCTEZsQlFVa3NWMEZCVnl4RlFVRm1MRVZCUVcxQ08wRkJRMnBDTEdkQ1FVRkxMRk5CUVV3N1FVRkRRVHRCUVVORU96dEJRVWRFTEdOQlFVc3NVVUZCVEN4SFFVRm5RaXhQUVVGb1FpeERRVUYzUWl4VlFVRkRMRWxCUVVRc1JVRkJWVHRCUVVOb1F5eGpRVUZOTEV0QlFVc3NUMEZCVHl4TlFVRkxMRTlCUVV3c1EwRkJZU3hWUVVGd1FpeExRVUZ0UXl4VlFVRnVReXhIUVVGblJDeE5RVUZMTEU5QlFVd3NRMEZCWVN4VlFVRTNSQ3hIUVVFd1JTeE5RVUZMTEZWQlFURkdPenRCUVVWQkxHTkJRVWtzUjBGQlJ5eE5RVUZJTEVWQlFWY3NTVUZCV0N4RFFVRktMRVZCUVhOQ08wRkJRM0JDTEdsQ1FVRkxMRTlCUVV3c1EwRkJZU3hMUVVGaUxFTkJRVzFDTEU5QlFXNUNMRWRCUVRaQ0xFOUJRVGRDTzBGQlEwUXNWMEZHUkN4TlFVVlBPMEZCUTB3c2FVSkJRVXNzVDBGQlRDeERRVUZoTEV0QlFXSXNRMEZCYlVJc1QwRkJia0lzUjBGQk5rSXNUVUZCTjBJN1FVRkRSRHRCUVVOR0xGTkJVa1E3UVVGVFJDeFBRV3hDUkRzN1FVRnZRa0VzV1VGQlN5eGpRVUZNTEVkQlFYTkNMR2RDUVVGMFFpeERRVUYxUXl4UFFVRjJReXhGUVVGblJDeE5RVUZMTEd0Q1FVRnlSRHRCUVhaQ2QwSTdRVUYzUW5wQ096dEJRVzVFZVVJN1FVRkJRVHRCUVVGQkxHMURRWEZFVXp0QlFVRkJMRmxCUVhoQ0xFMUJRWGRDTEhWRlFVRm1MRVZCUVdVN1FVRkJRU3haUVVGWUxFbEJRVmNzZFVWQlFVb3NSVUZCU1RzN1FVRkRha01zV1VGQlNTeExRVUZMTEV0QlFVd3NRMEZCVnl4UFFVRllMRU5CUVcxQ0xFMUJRVzVDTEVsQlFUWkNMRU5CUVVNc1EwRkJPVUlzU1VGRFF5eExRVUZMTEVsQlFVd3NRMEZCVlN4UFFVRldMRU5CUVd0Q0xFMUJRV3hDTEVsQlFUUkNMRU5CUVVNc1EwRkViRU1zUlVGRGNVTTdRVUZEYmtNc2FVSkJRVThzU1VGQlVEdEJRVU5FT3p0QlFVVkVMR1ZCUVU4c1MwRkJVRHRCUVVORU8wRkJOVVI1UWp0QlFVRkJPMEZCUVVFc2FVTkJPRVJtTzBGQlFVRTdPMEZCUTFRc1dVRkJTU3hSUVVGUkxFMUJRVTBzU1VGQlRpeERRVUZYTEV0QlFVc3NUMEZCVEN4RFFVRmhMRTlCUVdJc1EwRkJjVUlzWjBKQlFYSkNMRU5CUVhORExFOUJRWFJETEV0QlFXdEVMRVZCUVRkRUxFTkJRVm83UVVGRFFTeG5Ra0ZCVVN4TlFVRk5MRWRCUVU0c1EwRkJWU3hWUVVGRExFbEJRVVFzUlVGQlZUdEJRVU14UWl4alFVRk5MRTlCUVU4c1QwRkJTeXhYUVVGTUxFTkJRV2xDTEVsQlFXcENMRU5CUVdJN1FVRkRRU3hwUWtGQlR5eEZRVUZGTEUxQlFVMHNTMEZCU3l4SlFVRmlMRVZCUVcxQ0xFOUJRVThzUzBGQlN5eExRVUV2UWl4RlFVRnpReXhUUVVGVExFbEJRUzlETEVWQlFWQTdRVUZEUkN4VFFVaFBMRU5CUVZJN08wRkJTMEVzWlVGQlR5eExRVUZRTzBGQlEwUTdRVUYwUlhsQ08wRkJRVUU3UVVGQlFTeHJRMEYzUldRN1FVRkRWaXhoUVVGTExGRkJRVXdzUjBGQlowSXNUMEZCYUVJc1EwRkJkMElzVlVGQlF5eEpRVUZFTEVWQlFWVTdRVUZEYUVNc1kwRkJUU3hKUVVGSkxFbEJRVlk3UVVGRFFTeFpRVUZGTEU5QlFVWXNRMEZCVlN4TFFVRldMRU5CUVdkQ0xFOUJRV2hDTEVkQlFUQkNMRTlCUVRGQ08wRkJRMFFzVTBGSVJEdEJRVWxFTzBGQk4wVjVRanRCUVVGQk8wRkJRVUVzZFVOQkswVlVPMEZCUTJZc1pVRkJUeXhMUVVGTExFOUJRVXdzUTBGQllTeFBRVUZpTEVOQlFYRkNMR0ZCUVhKQ0xFTkJRVzFETEhOQ1FVRnVReXhEUVVGUU8wRkJRMFE3UVVGcVJubENPMEZCUVVFN1FVRkJRU3cyUWtGdFJtNUNPMEZCUTB3c2EwbEJRV3RDTzBGQlEyaENPMEZCUTBFc1pVRkJTeXhqUVVGTUxFZEJRWE5DTEV0QlFYUkNMRWRCUVRoQ0xFVkJRVGxDTzBGQlEwRTdRVUZEUVN4bFFVRkxMRk5CUVV3N1FVRkRSRHRCUVVOR08wRkJNVVo1UWp0QlFVRkJPMEZCUVVFc2IwTkJORVpNTEU5Qk5VWkxMRVZCTkVaSk8wRkJRelZDTEdWQlFVOHNTVUZCU1N4alFVRktMRU5CUVcxQ0xFOUJRVzVDTEVOQlFWQTdRVUZEUkR0QlFUbEdlVUk3TzBGQlFVRTdRVUZCUVRzN1FVRnBSelZDT3pzN096czdPMEZCUzBFc1RVRkJUU3hoUVVGaExFVkJRVzVDTzBGQlEwRXNUVUZCVFN4WlFVRlpMRk5CUVZNc1owSkJRVlFzVDBGQk9FSXNTVUZCT1VJc1EwRkJiRUk3TzBGQlJVRXNUVUZCU1N4VFFVRktMRVZCUVdVN1FVRkRZaXhWUVVGTkxFbEJRVTRzUTBGQlZ5eFRRVUZZTEVWQlFYTkNMRTlCUVhSQ0xFTkJRVGhDTEZWQlFVTXNUMEZCUkN4RlFVRmhPMEZCUTNwRExGVkJRVTBzVTBGQlV5d3lRMEZCYjBJc1QwRkJjRUlzUlVGQk5rSXNhMEpCUVRkQ0xFVkJRV2xFTEhGQ1FVRnFSQ3hEUVVGbU8wRkJRMEVzWVVGQlR5eFBRVUZRTEVkQlFXbENMRTlCUVdwQ096dEJRVVZCTEZWQlFVa3NUMEZCVHl4TlFVRllMRVZCUVcxQ08wRkJRMnBDTzBGQlEwRXNiVUpCUVZjc1NVRkJXQ3hEUVVGblFpeEpRVUZKTEdOQlFVb3NRMEZCYlVJc1RVRkJia0lzUTBGQmFFSTdRVUZEUkR0QlFVTkdMRXRCVWtRN1FVRlRSRHM3UVVGRlJDeE5RVUZKTEZOQlFVb3NSVUZCWlR0QlFVTmlMR0ZCUVZNc1owSkJRVlFzUTBGQk1FSXNUMEZCTVVJc1JVRkJiVU1zVlVGQlF5eExRVUZFTEVWQlFWYzdRVUZETlVNc1ZVRkJUU3hsUVVGbExEaENRVUZyUWl4TlFVRk5MRTFCUVhoQ0xFVkJRV2RETEdWQlFXaERMRU5CUVhKQ08wRkJRMEVzVlVGQlNTeFpRVUZLTEVWQlFXdENPMEZCUTJoQ08wRkJRMFE3TzBGQlJVUXNWVUZCVFN4WFFVRlhMRGhDUVVGclFpeE5RVUZOTEUxQlFYaENMRVZCUVdkRExGVkJRV2hETEVOQlFXcENPenRCUVVWQkxGVkJRVWtzVVVGQlNpeEZRVUZqTzBGQlExb3NXVUZCVFN4cFFrRkJhVUlzVTBGQlV5eFpRVUZVTEVOQlFYTkNMR0ZCUVhSQ0xFTkJRWFpDTzBGQlEwRXNXVUZCU1N4clFrRkJhMElzYlVKQlFXMUNMRWxCUVhKRExFbEJRVFpETEZGQlFXcEVMRVZCUVRKRU8wRkJRM3BFTEdOQlFVMHNXVUZCV1N4WFFVRlhMRWxCUVZnc1EwRkJaMEk3UVVGQlFTeHRRa0ZCU3l4RlFVRkZMRlZCUVVZc1QwRkJiVUlzVVVGQmVFSTdRVUZCUVN4WFFVRm9RaXhEUVVGc1FqczdRVUZGUVN4alFVRkpMRU5CUVVNc1UwRkJUQ3hGUVVGblFqdEJRVU5rTzBGQlEwUTdPMEZCUlVRc2IwSkJRVlVzVFVGQlZqdEJRVU5FTzBGQlEwWTdRVUZEUml4TFFYQkNSRHRCUVhGQ1JEczdRVUZGUkN4VFFVRlBMR05CUVZBN1FVRkRSQ3hEUVRsSmMwSXNSVUZCZGtJN08ydENRV2RLWlN4ak96czdPenM3T3pzN096czdPMEZEY0VwbU96czdPenM3T3pzN095dGxRVXhCT3pzN096czdPMEZCVDBFc1NVRkJUU3hUUVVGVkxGbEJRVTA3UVVGRGNFSTdPenM3T3p0QlFVMUJMRTFCUVUwc1QwRkJUeXhSUVVGaU8wRkJRMEVzVFVGQlRTeFZRVUZWTEU5QlFXaENPMEZCUTBFc1RVRkJUU3h4UWtGQmNVSTdRVUZEZWtJc1lVRkJVeXhKUVVSblFqdEJRVVY2UWl4WFFVRlBMRWxCUm10Q08wRkJSM3BDTEZWQlFVMDdRVUZJYlVJc1IwRkJNMEk3UVVGTFFTeE5RVUZOTEhkQ1FVRjNRaXhGUVVFNVFqczdRVUZGUVRzN096czdPMEZCYUVKdlFpeE5RWE5DWkN4TlFYUkNZenRCUVVGQk96dEJRWGRDYkVJc2MwSkJRVEJDTzBGQlFVRXNWVUZCWkN4UFFVRmpMSFZGUVVGS0xFVkJRVWs3TzBGQlFVRTdPMEZCUjNoQ08wRkJTSGRDTEd0SVFVTnNRaXhKUVVSclFpeEZRVU5hTEU5QlJGa3NSVUZEU0N4clFrRkVSeXhGUVVOcFFpeFBRVVJxUWl4RlFVTXdRaXh4UWtGRU1VSXNSVUZEYVVRc1MwRkVha1FzUlVGRGQwUXNTMEZFZUVRN08wRkJTWGhDTEZWQlFVMHNaMEpCUVdkQ0xFMUJRVXNzVlVGQlRDeEZRVUYwUWp0QlFVTkJMRlZCUVVrc1QwRkJUeXhOUVVGTExFOUJRVXdzUTBGQllTeExRVUZ3UWl4TFFVRTRRaXhSUVVFNVFpeEpRVU5ETEVOQlFVTXNZMEZCWXl4VFFVRmtMRU5CUVhkQ0xGRkJRWGhDTEZsQlFUQkRMRTFCUVVzc1QwRkJUQ3hEUVVGaExFdEJRWFpFTEVOQlJFNHNSVUZEZFVVN1FVRkRja1VzYzBKQlFXTXNVMEZCWkN4RFFVRjNRaXhIUVVGNFFpeFpRVUZ4UXl4TlFVRkxMRTlCUVV3c1EwRkJZU3hMUVVGc1JEdEJRVU5FT3p0QlFVVkVMRmxCUVVzc1ZVRkJUQ3hIUVVGclFpeE5RVUZMTEU5QlFVd3NRMEZCWVN4SlFVRmlMRXRCUVhOQ0xFbEJRWGhETzBGQlZuZENPMEZCVjNwQ096dEJRVzVEYVVJN1FVRkJRVHRCUVVGQkxITkRRWEZEUmp0QlFVTmtMRmxCUVVrc1EwRkJReXhMUVVGTExGVkJRVllzUlVGQmMwSTdRVUZEY0VJc1kwRkJUU3hQUVVGUExFdEJRVXNzVDBGQlRDeERRVUZoTEU5QlFXSXNRMEZCY1VJc2NVSkJRWEpDTEVWQlFXSTdRVUZEUVN4cFFrRkJUeXhMUVVGTExFMUJRVm83UVVGRFJEczdRVUZGUkN4bFFVRlBMRXRCUVVzc1QwRkJUQ3hEUVVGaExFbEJRWEJDTzBGQlEwUTdRVUUxUTJsQ08wRkJRVUU3UVVGQlFTeHRRMEU0UTB3N1FVRkRXQ3hsUVVGUExFdEJRVXNzVDBGQlRDeERRVUZoTEU5QlFXSXNRMEZCY1VJc1lVRkJja0lzUTBGQmJVTXNhVUpCUVc1RExFTkJRVkE3UVVGRFJEdEJRV2hFYVVJN1FVRkJRVHRCUVVGQkxEWkNRV3RFV0R0QlFVTk1MRmxCUVVrc1MwRkJTeXhQUVVGTUxFTkJRV0VzVDBGQllpeERRVUZ4UWl4VFFVRnlRaXhEUVVFclFpeFJRVUV2UWl4RFFVRjNReXhOUVVGNFF5eERRVUZLTEVWQlFYRkVPMEZCUTI1RUxHVkJRVXNzVDBGQlRDeERRVUZoTEU5QlFXSXNRMEZCY1VJc1UwRkJja0lzUTBGQkswSXNUVUZCTDBJc1EwRkJjME1zVFVGQmRFTTdRVUZEUkRzN1FVRkZSQ3haUVVGTkxFOUJRVThzUzBGQlN5eGhRVUZNTEVWQlFXSTdRVUZEUVN4aFFVRkxMRTlCUVV3c1EwRkJZU3hKUVVGaUxFZEJRVzlDTEVsQlFYQkNPenRCUVVWQkxGbEJRVWtzUzBGQlN5eFZRVUZVTEVWQlFYRkNPMEZCUTI1Q0xHVkJRVXNzVDBGQlRDeERRVUZoTEU5QlFXSXNRMEZCY1VJc1MwRkJja0lzUTBGQk1rSXNTMEZCTTBJc1IwRkJjME1zUzBGQlN5eFBRVUZNTEVOQlFXRXNTVUZCYmtRN1FVRkRRU3hsUVVGTExFOUJRVXdzUTBGQllTeFBRVUZpTEVOQlFYRkNMRXRCUVhKQ0xFTkJRVEpDTEUxQlFUTkNMRWRCUVhWRExFdEJRVXNzVDBGQlRDeERRVUZoTEVsQlFYQkVPenRCUVVWQkxHTkJRVTBzWjBKQlFXZENMRXRCUVVzc1ZVRkJUQ3hGUVVGMFFqdEJRVU5CTEhkQ1FVRmpMRXRCUVdRc1EwRkJiMElzUzBGQmNFSXNSMEZCSzBJc1MwRkJTeXhQUVVGTUxFTkJRV0VzU1VGQk5VTTdRVUZEUVN4M1FrRkJZeXhMUVVGa0xFTkJRVzlDTEUxQlFYQkNMRWRCUVdkRExFdEJRVXNzVDBGQlRDeERRVUZoTEVsQlFUZERPMEZCUTBRN08wRkJSVVFzWlVGQlR5eEpRVUZRTzBGQlEwUTdRVUZ3UldsQ08wRkJRVUU3UVVGQlFTeG5RMEZ6UldFN1FVRkJRU3haUVVGMlFpeGpRVUYxUWl4MVJVRkJUaXhKUVVGTk96dEJRVU0zUWl4WlFVRkpMR05CUVVvc1JVRkJiMEk3UVVGRGJFSXNaVUZCU3l4SlFVRk1PMEZCUTBRc1UwRkdSQ3hOUVVWUE8wRkJRMHdzWlVGQlN5eEpRVUZNTzBGQlEwUTdPMEZCUlVRc1dVRkJUU3huUWtGQlowSXNTMEZCU3l4VlFVRk1MRVZCUVhSQ096dEJRVVZCTEZsQlFVa3NhMEpCUTBZc1EwRkJReXhqUVVGakxGTkJRV1FzUTBGQmQwSXNVVUZCZUVJc1EwRkJhVU1zZVVKQlFXcERMRU5CUkVnc1JVRkRaMFU3UVVGRE9VUXNkMEpCUVdNc1UwRkJaQ3hEUVVGM1FpeEhRVUY0UWl4RFFVRTBRaXg1UWtGQk5VSTdRVUZEUVN4cFFrRkJUeXhKUVVGUU8wRkJRMFE3TzBGQlJVUXNXVUZCU1N4RFFVRkRMR05CUVVRc1NVRkRSaXhqUVVGakxGTkJRV1FzUTBGQmQwSXNVVUZCZUVJc1EwRkJhVU1zZVVKQlFXcERMRU5CUkVZc1JVRkRLMFE3UVVGRE4wUXNkMEpCUVdNc1UwRkJaQ3hEUVVGM1FpeE5RVUY0UWl4RFFVRXJRaXg1UWtGQkwwSTdRVUZEUkRzN1FVRkZSQ3hsUVVGUExFbEJRVkE3UVVGRFJEdEJRVE5HYVVJN1FVRkJRVHRCUVVGQkxEWkNRVFpHV0R0QlFVTk1MRmxCUVVrc1EwRkJReXhMUVVGTExFOUJRVXdzUTBGQllTeFBRVUZpTEVOQlFYRkNMRk5CUVhKQ0xFTkJRU3RDTEZGQlFTOUNMRU5CUVhkRExFMUJRWGhETEVOQlFVd3NSVUZCYzBRN1FVRkRjRVFzWlVGQlN5eFBRVUZNTEVOQlFXRXNUMEZCWWl4RFFVRnhRaXhUUVVGeVFpeERRVUVyUWl4SFFVRXZRaXhEUVVGdFF5eE5RVUZ1UXp0QlFVTkVPenRCUVVWRUxHVkJRVThzU1VGQlVEdEJRVU5FTzBGQmJrZHBRanRCUVVGQk8wRkJRVUVzYlVOQmNVZEZPMEZCUTJ4Q0xHVkJRVThzU1VGQlVEdEJRVU5FTzBGQmRrZHBRanRCUVVGQk8wRkJRVUVzYjBOQmVVZEhMRTlCZWtkSUxFVkJlVWRaTzBGQlF6VkNMSGxIUVVFeVFpeE5RVUV6UWl4RlFVRnRReXhQUVVGdVF6dEJRVU5FTzBGQk0wZHBRanM3UVVGQlFUdEJRVUZCT3p0QlFUaEhjRUlzVTBGQlR5eE5RVUZRTzBGQlEwUXNRMEV2UjJNc1JVRkJaanM3YTBKQmFVaGxMRTA3T3pzN096czdPenM3T3pzN1FVTnVTR1k3T3pzN1FVRkRRVHM3T3pzN096czdPenNyWlVGT1FUczdPenM3T3p0QlFWRkJMRWxCUVUwc1pVRkJaMElzV1VGQlRUdEJRVU14UWpzN096czdPMEZCVFVFc1RVRkJUU3hQUVVGUExHTkJRV0k3UVVGRFFTeE5RVUZOTEZWQlFWVXNUMEZCYUVJN1FVRkRRU3hOUVVGTkxIRkNRVUZ4UWp0QlFVTjZRaXhoUVVGVExFbEJSR2RDTzBGQlJYcENMR0ZCUVZNc1JVRkdaMEk3UVVGSGVrSXNaMEpCUVZrc1NVRklZVHRCUVVsNlFpeGhRVUZUTEVsQlNtZENPMEZCUzNwQ0xHZENRVUZaTzBGQlRHRXNSMEZCTTBJN1FVRlBRU3hOUVVGTkxIZENRVUYzUWl4RFFVTTFRaXhUUVVRMFFpeERRVUU1UWpzN1FVRkpRVHM3T3pzN08wRkJjRUl3UWl4TlFUQkNjRUlzV1VFeFFtOUNPMEZCUVVFN08wRkJORUo0UWl3MFFrRkJNRUk3UVVGQlFTeFZRVUZrTEU5QlFXTXNkVVZCUVVvc1JVRkJTVHM3UVVGQlFUczdRVUZCUVN3NFNFRkRiRUlzU1VGRWEwSXNSVUZEV2l4UFFVUlpMRVZCUTBnc2EwSkJSRWNzUlVGRGFVSXNUMEZFYWtJc1JVRkRNRUlzY1VKQlJERkNMRVZCUTJsRUxFbEJSR3BFTEVWQlEzVkVMRXRCUkhaRU96dEJRVWQ0UWl4WlFVRkxMRkZCUVV3c1IwRkJaMElzUzBGRGFFSXNORUpCUkdkQ0xFZEJSV1FzYTBOQlJtTXNSMEZIV2l3MlFrRklXU3hIUVVsYUxIRkdRVXBaTEVkQlMxWXNlVU5CVEZVc1IwRk5XaXhYUVU1WkxFZEJUMlFzVVVGUVl5eEhRVkZvUWl4UlFWSkJPenRCUVZWQkxGVkJRVWtzVFVGQlN5eGpRVUZVTEVWQlFYbENPMEZCUTNaQ0xHTkJRVXNzUzBGQlREdEJRVU5FT3p0QlFVVkVMRmxCUVVzc1pVRkJUQ3hIUVVGMVFpeEpRVUYyUWp0QlFXcENkMEk3UVVGclFucENPenRCUVRsRGRVSTdRVUZCUVR0QlFVRkJMRGhDUVdkRWFFSTdRVUZEVGl4WlFVRk5MRlZCUVZVc1UwRkJVeXhoUVVGVUxFTkJRWFZDTEV0QlFYWkNMRU5CUVdoQ096dEJRVVZCTEdkQ1FVRlJMRk5CUVZJc1IwRkJiMElzUzBGQlN5eFJRVUY2UWpzN1FVRkZRU3hoUVVGTExFOUJRVXdzUTBGQllTeFBRVUZpTEVkQlFYVkNMRkZCUVZFc1ZVRkJMMEk3TzBGQlJVRTdRVUZEUVN4aFFVRkxMRTlCUVV3c1EwRkJZU3hQUVVGaUxFTkJRWEZDTEdGQlFYSkNMRU5CUVcxRExGVkJRVzVETEVWQlFTdERMRk5CUVM5RExFZEJRVEpFTEV0QlFVc3NUMEZCVEN4RFFVRmhMRTlCUVhoRk96dEJRVVZCTEZsQlFVa3NRMEZCUXl4TFFVRkxMRTlCUVV3c1EwRkJZU3hWUVVGc1FpeEZRVUU0UWp0QlFVTTFRaXhsUVVGTExFOUJRVXdzUTBGQllTeFBRVUZpTEVOQlFYRkNMR0ZCUVhKQ0xFTkJRVzFETEZGQlFXNURMRVZCUVRaRExFdEJRVGRETEVOQlFXMUVMRTlCUVc1RUxFZEJRVFpFTEUxQlFUZEVPMEZCUTBRN08wRkJSVVFzYVVKQlFWTXNTVUZCVkN4RFFVRmpMRmRCUVdRc1EwRkJNRUlzUzBGQlN5eFBRVUZNTEVOQlFXRXNUMEZCZGtNN08wRkJSVUVzWVVGQlN5eGhRVUZNTzBGQlEwUTdRVUZxUlhWQ08wRkJRVUU3UVVGQlFTdzJRa0Z0UldwQ08wRkJRVUU3TzBGQlEwd3NXVUZCU1N4TFFVRkxMRTlCUVV3c1EwRkJZU3hQUVVGaUxFdEJRWGxDTEVsQlFUZENMRVZCUVcxRE8wRkJRMnBETzBGQlEwRXNaVUZCU3l4TFFVRk1PMEZCUTBRN08wRkJSVVFzV1VGQlNTeExRVUZMTEU5QlFVd3NRMEZCWVN4UFFVRmlMRU5CUVhGQ0xGTkJRWEpDTEVOQlFTdENMRkZCUVM5Q0xFTkJRWGRETEUxQlFYaERMRU5CUVVvc1JVRkJjVVE3UVVGRGJrUXNhVUpCUVU4c1MwRkJVRHRCUVVORU96dEJRVVZFTzBGQlEwRXNXVUZCU1N4TFFVRkxMRTlCUVV3c1EwRkJZU3hWUVVGcVFpeEZRVUUyUWp0QlFVTXpRaXhsUVVGTExFOUJRVXdzUTBGQllTeFBRVUZpTEVOQlFYRkNMR1ZCUVhKQ0xFTkJRWEZETEU5QlFYSkRPMEZCUTBFc1pVRkJTeXhQUVVGTUxFTkJRV0VzVDBGQllpeERRVUZ4UWl4WlFVRnlRaXhEUVVGclF5eFBRVUZzUXl4RlFVRXlReXhqUVVFelF6czdRVUZGUVN4bFFVRkxMRTlCUVV3c1EwRkJZU3hQUVVGaUxFTkJRWEZDTEZOQlFYSkNMRU5CUVN0Q0xFZEJRUzlDTEZOQlFYbERMRXRCUVVzc1QwRkJUQ3hEUVVGaExGVkJRWFJFTzBGQlEwRXNaVUZCU3l4UFFVRk1MRU5CUVdFc1QwRkJZaXhEUVVGeFFpeGhRVUZ5UWl4RFFVRnRReXhSUVVGdVF5eEZRVUUyUXl4VFFVRTNReXhEUVVGMVJDeEhRVUYyUkN4VlFVRnJSU3hMUVVGTExFOUJRVXdzUTBGQllTeFZRVUV2UlR0QlFVTkVPenRCUVVWRUxGbEJRVWtzUzBGQlN5eFBRVUZNTEVOQlFXRXNWVUZCYWtJc1JVRkJOa0k3UVVGRE0wSTdRVUZEUVN4alFVRk5MR2RDUVVGblFpeExRVUZMTEU5QlFVd3NRMEZCWVN4UFFVRmlMRU5CUVhGQ0xHRkJRWEpDTEVOQlFXMURMRkZCUVc1RExFTkJRWFJDTzBGQlEwRXNaVUZCU3l4bFFVRk1MRU5CUVhGQ0xFVkJRVVVzVVVGQlVTeGhRVUZXTEVWQlFYbENMRTlCUVU4c1QwRkJhRU1zUlVGQmNrSTdRVUZEUkRzN1FVRkZSQ3h0UWtGQlZ5eFpRVUZOTzBGQlEyWXNhVUpCUVVzc1QwRkJUQ3hEUVVGaExFOUJRV0lzUTBGQmNVSXNVMEZCY2tJc1EwRkJLMElzUjBGQkwwSXNRMEZCYlVNc1RVRkJia003TzBGQlJVRTdRVUZEUVN4alFVRk5MSE5DUVVGelFpeFRRVUZUTEdkQ1FVRlVMRU5CUVRCQ0xHOUNRVUV4UWl4TFFVRnRSQ3hGUVVFdlJUdEJRVU5CTEdOQlFVa3NaVUZCWlN4RFFVRnVRanRCUVVOQkxEaENRVUZ2UWl4UFFVRndRaXhEUVVFMFFpeFZRVUZETEZsQlFVUXNSVUZCYTBJN1FVRkROVU1zWjBKQlFVa3NUMEZCU3l4UFFVRk1MRU5CUVdFc1QwRkJZaXhMUVVGNVFpeFpRVUUzUWl4RlFVRXlRenRCUVVONlF5eHJRa0ZCVFN4UlFVRlJMR2xDUVVGcFFpeFpRVUZxUWl4RFFVRmtPMEZCUTBFc09FSkJRV2RDTEdGQlFXRXNXVUZCWWl4SFFVRTBRaXhUUVVGVExFMUJRVTBzV1VGQlppeEZRVUUyUWl4RlFVRTNRaXhEUVVFMVF6dEJRVU5FTzBGQlEwWXNWMEZNUkRzN1FVRlBRU3hwUWtGQlN5eFBRVUZNTEVOQlFXRXNUMEZCWWl4RFFVRnhRaXhMUVVGeVFpeERRVUV5UWl4VFFVRXpRaXh0UWtGQmNVUXNXVUZCY2tRN08wRkJSVUVzYVVKQlFVc3NXVUZCVEN4RFFVRnJRaXhwUWtGQlRTeEpRVUY0UWpzN1FVRkZRU3hqUVVGTkxGVkJRVlVzVTBGQlZpeFBRVUZWTEVkQlFVMDdRVUZEY0VJc2JVSkJRVXNzV1VGQlRDeERRVUZyUWl4cFFrRkJUU3hMUVVGNFFqdEJRVU5CTEcxQ1FVRkxMRTlCUVV3c1EwRkJZU3hQUVVGaUxFTkJRWEZDTEcxQ1FVRnlRaXhEUVVGNVF5eHBRa0ZCVFN4alFVRXZReXhGUVVFclJDeFBRVUV2UkR0QlFVTkVMRmRCU0VRN08wRkJTMEVzYVVKQlFVc3NUMEZCVEN4RFFVRmhMRTlCUVdJc1EwRkJjVUlzWjBKQlFYSkNMRU5CUVhORExHbENRVUZOTEdOQlFUVkRMRVZCUVRSRUxFOUJRVFZFTzBGQlJVUXNVMEY0UWtRc1JVRjNRa2NzUTBGNFFrZzdPMEZCTUVKQkxGbEJRVWtzVDBGQlR5eFRRVUZRTEVOQlFXbENMRXRCUVVzc1QwRkJUQ3hEUVVGaExFOUJRVGxDTEV0QlFUQkRMRXRCUVVzc1QwRkJUQ3hEUVVGaExFOUJRV0lzUjBGQmRVSXNRMEZCY2tVc1JVRkJkMFU3UVVGRGRFVTdRVUZEUVN4bFFVRkxMR1ZCUVV3c1IwRkJkVUlzVjBGQlZ5eFpRVUZOTzBGQlEzUkRMRzFDUVVGTExFbEJRVXc3UVVGRFJDeFhRVVp6UWl4RlFVVndRaXhMUVVGTExFOUJRVXdzUTBGQllTeFBRVUZpTEVkQlFYVkNMRU5CUmtnc1EwRkJka0k3UVVGSFJEczdRVUZGUkN4bFFVRlBMRWxCUVZBN1FVRkRSRHRCUVRsSWRVSTdRVUZCUVR0QlFVRkJMRFpDUVdkSmFrSTdRVUZCUVRzN1FVRkRURHM3T3p0QlFVbEJMRmxCUVVrc1MwRkJTeXhsUVVGVUxFVkJRVEJDTzBGQlEzaENMSFZDUVVGaExFdEJRVXNzWlVGQmJFSTdRVUZEUVN4bFFVRkxMR1ZCUVV3c1IwRkJkVUlzU1VGQmRrSTdRVUZEUkRzN1FVRkZSQ3haUVVGSkxFTkJRVU1zUzBGQlN5eFBRVUZNTEVOQlFXRXNUMEZCWWl4RFFVRnhRaXhUUVVGeVFpeERRVUVyUWl4UlFVRXZRaXhEUVVGM1F5eE5RVUY0UXl4RFFVRk1MRVZCUVhORU8wRkJRM0JFTEdsQ1FVRlBMRXRCUVZBN1FVRkRSRHM3UVVGRlJDeGhRVUZMTEZsQlFVd3NRMEZCYTBJc2FVSkJRVTBzU1VGQmVFSTdPMEZCUlVFc1dVRkJTU3hMUVVGTExFOUJRVXdzUTBGQllTeFZRVUZxUWl4RlFVRTJRanRCUVVNelFpeGpRVUZOTEdkQ1FVRm5RaXhMUVVGTExFOUJRVXdzUTBGQllTeFBRVUZpTEVOQlFYRkNMR0ZCUVhKQ0xFTkJRVzFETEZGQlFXNURMRU5CUVhSQ08wRkJRMEVzWlVGQlN5eHBRa0ZCVEN4RFFVRjFRaXhGUVVGRkxGRkJRVkVzWVVGQlZpeEZRVUY1UWl4UFFVRlBMRTlCUVdoRExFVkJRWFpDTzBGQlEwUTdPMEZCUlVRc1lVRkJTeXhQUVVGTUxFTkJRV0VzVDBGQllpeERRVUZ4UWl4VFFVRnlRaXhEUVVFclFpeE5RVUV2UWl4RFFVRnpReXhOUVVGMFF6dEJRVU5CTEdGQlFVc3NUMEZCVEN4RFFVRmhMRTlCUVdJc1EwRkJjVUlzVTBGQmNrSXNRMEZCSzBJc1IwRkJMMElzUTBGQmJVTXNUVUZCYmtNN08wRkJSVUVzV1VGQlRTeFhRVUZYTEZOQlFWZ3NVVUZCVnl4SFFVRk5PMEZCUTNKQ0xHbENRVUZMTEU5QlFVd3NRMEZCWVN4UFFVRmlMRU5CUVhGQ0xHMUNRVUZ5UWl4RFFVRjVReXhwUWtGQlRTeGpRVUV2UXl4RlFVRXJSQ3hSUVVFdlJEdEJRVU5CTEdsQ1FVRkxMRTlCUVV3c1EwRkJZU3hQUVVGaUxFTkJRWEZDTEZOQlFYSkNMRU5CUVN0Q0xFMUJRUzlDTEVOQlFYTkRMRTFCUVhSRE96dEJRVVZCTEdsQ1FVRkxMRmxCUVV3c1EwRkJhMElzYVVKQlFVMHNUVUZCZUVJN08wRkJSVUVzWTBGQlNTeFBRVUZMTEdOQlFWUXNSVUZCZVVJN1FVRkRka0lzY1VKQlFWTXNTVUZCVkN4RFFVRmpMRmRCUVdRc1EwRkJNRUlzVDBGQlN5eFBRVUZNTEVOQlFXRXNUMEZCZGtNN1FVRkRRU3h0UWtGQlN5eFBRVUZNTEVOQlFXRXNUMEZCWWl4SFFVRjFRaXhKUVVGMlFqdEJRVU5FTzBGQlEwWXNVMEZXUkRzN1FVRlpRU3hoUVVGTExFOUJRVXdzUTBGQllTeFBRVUZpTEVOQlFYRkNMR2RDUVVGeVFpeERRVUZ6UXl4cFFrRkJUU3hqUVVFMVF5eEZRVUUwUkN4UlFVRTFSRHM3UVVGRlFTeGxRVUZQTEVsQlFWQTdRVUZEUkR0QlFYWkxkVUk3UVVGQlFUdEJRVUZCTEhWRFFYbExVRHRCUVVObUxHRkJRVXNzU1VGQlREdEJRVU5FTzBGQk0wdDFRanRCUVVGQk8wRkJRVUVzYlVOQk5rdEtPMEZCUTJ4Q0xHVkJRVThzU1VGQlVEdEJRVU5FTzBGQkwwdDFRanRCUVVGQk8wRkJRVUVzYjBOQmFVeElMRTlCYWt4SExFVkJhVXhOTzBGQlF6VkNMSEZJUVVFeVFpeFpRVUV6UWl4RlFVRjVReXhQUVVGNlF6dEJRVU5FTzBGQmJreDFRanM3UVVGQlFUdEJRVUZCT3p0QlFYTk1NVUlzVTBGQlR5eFpRVUZRTzBGQlEwUXNRMEYyVEc5Q0xFVkJRWEpDT3p0clFrRjVUR1VzV1RzN096czdPenM3T3pzN096dEJRelZNWmpzN096dEJRVU5CT3pzN08wRkJRMEU3TzBGQlEwRTdPenM3T3pzN095dGxRVkpCT3pzN096czdPMEZCVlVFc1NVRkJUU3haUVVGaExGbEJRVTA3UVVGRGRrSTdPenM3T3p0QlFVMUJMRTFCUVUwc1QwRkJUeXhaUVVGaU8wRkJRMEVzVFVGQlRTeFZRVUZWTEU5QlFXaENPMEZCUTBFc1RVRkJUU3h2UWtGQmIwSXNjVUpCUVRGQ08wRkJRMEVzVFVGQlRTeHhRa0ZCY1VJN1FVRkRla0lzWVVGQlV5eEpRVVJuUWp0QlFVVjZRaXhYUVVGUE8wRkJRMHdzVlVGQlNTeExRVVJETzBGQlJVd3NWVUZCU1N4TFFVWkRPMEZCUjB3c1ZVRkJTVHRCUVVoRE8wRkJSbXRDTEVkQlFUTkNPMEZCVVVFc1RVRkJUU3gzUWtGQmQwSXNRMEZETlVJc1QwRkVORUlzUTBGQk9VSTdPMEZCU1VFN096czdPenRCUVhSQ2RVSXNUVUUwUW1wQ0xGTkJOVUpwUWp0QlFVRkJPenRCUVRoQ2NrSXNlVUpCUVRCQ08wRkJRVUVzVlVGQlpDeFBRVUZqTEhWRlFVRktMRVZCUVVrN08wRkJRVUU3TzBGQlFVRXNkMGhCUTJ4Q0xFbEJSR3RDTEVWQlExb3NUMEZFV1N4RlFVTklMR3RDUVVSSExFVkJRMmxDTEU5QlJHcENMRVZCUXpCQ0xIRkNRVVF4UWl4RlFVTnBSQ3hMUVVScVJDeEZRVU4zUkN4SlFVUjRSRHM3UVVGSGVFSXNXVUZCU3l4WFFVRk1MRWRCUVcxQ0xFbEJRVzVDTzBGQlEwRXNXVUZCU3l4WlFVRk1MRWRCUVc5Q0xFbEJRWEJDTzBGQlEwRXNXVUZCU3l4UFFVRk1MRWRCUVdVc1NVRkJaanM3UVVGRlFTeFpRVUZMTEZWQlFVd3NSMEZCYTBJc1EwRkJReXhOUVVGRUxFVkJRVk1zVDBGQlZDeERRVUZzUWpzN1FVRkZRU3hWUVVGTkxFdEJRVXNzUlVGQlJTeE5RVUZOTEVsQlFWSXNSVUZCWXl4UFFVRlBMRTlCUVU4c1ZVRkJVQ3hEUVVGclFpeHJRa0ZCYkVJc1EwRkJja0lzUlVGQldEdEJRVU5CTEZWQlFVMHNTMEZCU3l4RlFVRkZMRTFCUVUwc1NVRkJVaXhGUVVGakxFOUJRVThzVDBGQlR5eFZRVUZRTEVOQlFXdENMRzlDUVVGc1FpeERRVUZ5UWl4RlFVRllPMEZCUTBFc1ZVRkJUU3hMUVVGTExFVkJRVVVzVFVGQlRTeEpRVUZTTEVWQlFXTXNUMEZCVHl4UFFVRlBMRlZCUVZBc1EwRkJhMElzYjBKQlFXeENMRU5CUVhKQ0xFVkJRVmc3UVVGRFFTeFZRVUZOTEV0QlFVc3NSVUZCUlN4TlFVRk5MRWxCUVZJc1JVRkJZeXhQUVVGUExFOUJRVThzVlVGQlVDeERRVUZyUWl4eFFrRkJiRUlzUTBGQmNrSXNSVUZCV0RzN1FVRkZRU3haUVVGTExFdEJRVXdzUjBGQllTeERRVUZETEVWQlFVUXNSVUZCU3l4RlFVRk1MRVZCUVZNc1JVRkJWQ3hGUVVGaExFVkJRV0lzUlVGQmFVSXNUMEZCYWtJc1JVRkJZanM3UVVGRlFTeFpRVUZMTEdOQlFVdzdRVUZEUVN4WlFVRkxMRlZCUVV3N08wRkJSVUVzWVVGQlR5eG5Ra0ZCVUN4RFFVRjNRaXhSUVVGNFFpeEZRVUZyUXp0QlFVRkJMR1ZCUVUwc1RVRkJTeXhWUVVGTUxFVkJRVTQ3UVVGQlFTeFBRVUZzUXl4RlFVRXlSQ3hMUVVFelJEdEJRVzVDZDBJN1FVRnZRbnBDT3p0QlFXeEViMEk3UVVGQlFUdEJRVUZCTEhWRFFXOUVTanRCUVVGQk96dEJRVU5tTEdGQlFVc3NWVUZCVEN4RFFVRm5RaXhMUVVGb1FpeERRVUZ6UWl4VlFVRkRMRk5CUVVRc1JVRkJaVHRCUVVOdVF5eGpRVUZKTEU5QlFVc3NUMEZCVEN4RFFVRmhMRTlCUVdJc1EwRkJjVUlzVTBGQmNrSXNRMEZCSzBJc1VVRkJMMElzYVVKQlFYTkVMRk5CUVhSRUxFTkJRVW9zUlVGQmQwVTdRVUZEZEVVc2JVSkJRVXNzVTBGQlRDeEhRVUZwUWl4VFFVRnFRanRCUVVOQkxHMUNRVUZQTEV0QlFWQTdRVUZEUkR0QlFVTkVMR2xDUVVGUExFbEJRVkE3UVVGRFJDeFRRVTVFTzBGQlQwUTdRVUUxUkc5Q08wRkJRVUU3UVVGQlFTeHRRMEU0UkZJN1FVRkJRVHM3UVVGRFdDeFpRVUZKTEVWQlFVVXNaMEpCUVdkQ0xFMUJRV3hDTEVOQlFVb3NSVUZCSzBJN1FVRkROMEk3UVVGRFJEczdRVUZGUkN4aFFVRkxMRXRCUVV3c1EwRkJWeXhMUVVGWUxFTkJRV2xDTEZWQlFVTXNTVUZCUkN4RlFVRlZPMEZCUTNwQ0xHTkJRVTBzVVVGQlVTeExRVUZMTEV0QlFVd3NRMEZCVnl4TFFVRllMRU5CUVdsQ0xFdEJRV3BDTEVOQlFYVkNMREJDUVVGMlFpeERRVUZrT3p0QlFVVkJMR05CUVVrc1MwRkJTaXhGUVVGWE8wRkJRMVFzWjBKQlFVa3NTMEZCU3l4TFFVRk1MRU5CUVZjc1QwRkJaaXhGUVVGM1FqdEJRVU4wUWl4clFrRkJTU3hQUVVGTExGbEJRVXdzUzBGQmMwSXNTMEZCU3l4SlFVRXZRaXhGUVVGeFF6dEJRVU51UXl4MVFrRkJTeXhSUVVGTUxFTkJRV01zUzBGQlN5eEpRVUZ1UWp0QlFVTkVPMEZCUTBRc2NVSkJRVXNzV1VGQlRDeEhRVUZ2UWl4TFFVRkxMRWxCUVhwQ08wRkJRMEVzY1VKQlFVOHNTMEZCVUR0QlFVTkVPMEZCUTBZN08wRkJSVVFzYVVKQlFVOHNTVUZCVUR0QlFVTkVMRk5CWkVRN1FVRmxSRHRCUVd4R2IwSTdRVUZCUVR0QlFVRkJMSGREUVc5R1NEdEJRVU5vUWl4bFFVRlBMSGxJUVVFeVFpeExRVUZMTEU5QlFVd3NRMEZCWVN4TFFVRmlMRU5CUVcxQ0xFdEJRVXNzV1VGQmVFSXNUVUZCTUVNc1NVRkJOVVU3UVVGRFJEdEJRWFJHYjBJN1FVRkJRVHRCUVVGQkxDdENRWGRHV2l4SlFYaEdXU3hGUVhkR1RqdEJRVU5pTEZsQlFVMHNWVUZCVlN4VFFVRlRMRWxCUVhwQ096dEJRVVZCTEZsQlFVa3NTMEZCU3l4UFFVRk1MRU5CUVdFc1MwRkJZaXhEUVVGdFFpeEpRVUZ1UWl4TlFVRTJRaXhKUVVGcVF5eEZRVUYxUXp0QlFVTnlReXhqUVVGSkxFTkJRVU1zVVVGQlVTeFRRVUZTTEVOQlFXdENMRkZCUVd4Q0xIVkNRVUVyUXl4TFFVRkxMRk5CUVhCRUxFTkJRVXdzUlVGQmRVVTdRVUZEY2tVc2IwSkJRVkVzVTBGQlVpeERRVUZyUWl4SFFVRnNRaXgxUWtGQk1FTXNTMEZCU3l4VFFVRXZRenRCUVVORU96dEJRVVZFTEdWQlFVc3NWMEZCVEN4SFFVRnRRaXhMUVVGdVFqczdRVUZGUVR0QlFVTkJMR1ZCUVVzc1QwRkJUQ3hIUVVGbExFdEJRV1k3UVVGRFFTeGxRVUZMTEVsQlFVdzdRVUZEUVR0QlFVTkJMR1ZCUVVzc1kwRkJURHRCUVVORUxGTkJXa1FzVFVGWlR6dEJRVU5NTEdOQlFVa3NVVUZCVVN4VFFVRlNMRU5CUVd0Q0xGRkJRV3hDTEhWQ1FVRXJReXhMUVVGTExGTkJRWEJFTEVOQlFVb3NSVUZCYzBVN1FVRkRjRVVzYjBKQlFWRXNVMEZCVWl4RFFVRnJRaXhOUVVGc1FpeDFRa0ZCTmtNc1MwRkJTeXhUUVVGc1JEdEJRVU5FT3p0QlFVVkVMR1ZCUVVzc1NVRkJURHRCUVVOQkxHVkJRVXNzVjBGQlRDeEhRVUZ0UWl4SlFVRnVRanRCUVVOQkxHVkJRVXNzVDBGQlRDeEhRVUZsTEVsQlFXWTdRVUZEUkR0QlFVTkdPMEZCYUVodlFqdEJRVUZCTzBGQlFVRXNjVU5CYTBoT0xFdEJiRWhOTEVWQmEwaERPMEZCUTNCQ0xGbEJRVWtzVFVGQlRTeEpRVUZPTEV0QlFXVXNUMEZCWml4SlFVRXdRaXhOUVVGTkxFOUJRVTRzUzBGQmEwSXNSVUZCTlVNc1NVRkJhMFFzVFVGQlRTeFBRVUZPTEV0QlFXdENMRVZCUVhoRkxFVkJRVFJGTzBGQlF6RkZPMEZCUTBRN08wRkJSVVE3UVVGRFFTeGhRVUZMTEVsQlFVdzdRVUZEUkR0QlFYcEliMEk3UVVGQlFUdEJRVUZCTERaQ1FUSklaRHRCUVVGQk96dEJRVU5NTEZsQlFVa3NTMEZCU3l4UFFVRk1MRU5CUVdFc1QwRkJZaXhEUVVGeFFpeFRRVUZ5UWl4RFFVRXJRaXhSUVVFdlFpeERRVUYzUXl4TlFVRjRReXhEUVVGS0xFVkJRWEZFTzBGQlEyNUVMR2xDUVVGUExFdEJRVkE3UVVGRFJEczdRVUZGUkR0QlFVTkJMRzFDUVVGWExGbEJRVTA3UVVGRFppeHBRa0ZCU3l4WlFVRk1MRU5CUVd0Q0xHbENRVUZOTEVsQlFYaENPenRCUVVWQkxHTkJRVTBzVlVGQlZTeFRRVUZXTEU5QlFWVXNSMEZCVFR0QlFVTndRaXh0UWtGQlN5eFpRVUZNTEVOQlFXdENMR2xDUVVGTkxFdEJRWGhDT3p0QlFVVkJMR2RDUVVGSkxFOUJRVXNzVDBGQlZDeEZRVUZyUWp0QlFVTm9RaXh4UWtGQlN5eFBRVUZNTEVOQlFXRXNUMEZCWWl4RFFVRnhRaXh0UWtGQmNrSXNRMEZCZVVNc2FVSkJRVTBzWTBGQkwwTXNSVUZCSzBRc1QwRkJMMFE3UVVGRFFTeHhRa0ZCU3l4UFFVRk1MRU5CUVdFc1QwRkJZaXhEUVVGeFFpeFRRVUZ5UWl4RFFVRXJRaXhOUVVFdlFpeERRVUZ6UXl4VFFVRjBRenRCUVVORU8wRkJRMFlzVjBGUVJEczdRVUZUUVN4alFVRkpMRTlCUVVzc1YwRkJWQ3hGUVVGelFqdEJRVU53UWl4dFFrRkJTeXhqUVVGTU8wRkJRMFE3TzBGQlIwUXNZMEZCU1N4UFFVRkxMRTlCUVZRc1JVRkJhMEk3UVVGRGFFSXNiVUpCUVVzc1QwRkJUQ3hEUVVGaExFOUJRV0lzUTBGQmNVSXNaMEpCUVhKQ0xFTkJRWE5ETEdsQ1FVRk5MR05CUVRWRExFVkJRVFJFTEU5QlFUVkVPMEZCUTBFc2JVSkJRVXNzVDBGQlRDeERRVUZoTEU5QlFXSXNRMEZCY1VJc1UwRkJja0lzUTBGQkswSXNSMEZCTDBJc1EwRkJiVU1zVTBGQmJrTTdRVUZEUkN4WFFVaEVMRTFCUjA4N1FVRkRURHRCUVVOQk8wRkJRMFE3TzBGQlJVUXNhVUpCUVVzc1QwRkJUQ3hEUVVGaExFOUJRV0lzUTBGQmNVSXNVMEZCY2tJc1EwRkJLMElzUjBGQkwwSXNRMEZCYlVNc1RVRkJia003TzBGQlJVRTdRVUZEUVN4cFFrRkJTeXhaUVVGTU8wRkJRMFFzVTBFM1FrUXNSVUUyUWtjc1EwRTNRa2c3TzBGQkswSkJMR1ZCUVU4c1NVRkJVRHRCUVVORU8wRkJha3R2UWp0QlFVRkJPMEZCUVVFc05rSkJiVXRrTzBGQlFVRTdPMEZCUTB3c1dVRkJTU3hEUVVGRExFdEJRVXNzVDBGQlRDeERRVUZoTEU5QlFXSXNRMEZCY1VJc1UwRkJja0lzUTBGQkswSXNVVUZCTDBJc1EwRkJkME1zVFVGQmVFTXNRMEZCVEN4RlFVRnpSRHRCUVVOd1JDeHBRa0ZCVHl4TFFVRlFPMEZCUTBRN08wRkJSVVFzWVVGQlN5eFpRVUZNTEVOQlFXdENMR2xDUVVGTkxFbEJRWGhDT3p0QlFVVkJMR0ZCUVVzc1dVRkJURHM3UVVGRlFTeFpRVUZKTEV0QlFVc3NUMEZCVkN4RlFVRnJRanRCUVVOb1FpeGxRVUZMTEU5QlFVd3NRMEZCWVN4UFFVRmlMRU5CUVhGQ0xGTkJRWEpDTEVOQlFTdENMRWRCUVM5Q0xFTkJRVzFETEZOQlFXNURPMEZCUTBRN08wRkJSVVFzWVVGQlN5eFBRVUZNTEVOQlFXRXNUMEZCWWl4RFFVRnhRaXhUUVVGeVFpeERRVUVyUWl4TlFVRXZRaXhEUVVGelF5eE5RVUYwUXpzN1FVRkZRU3haUVVGSkxFdEJRVXNzVjBGQlZDeEZRVUZ6UWp0QlFVTndRaXhqUVVGTkxGZEJRVmNzUzBGQlN5eFhRVUZNTEVWQlFXcENPenRCUVVWQkxHTkJRVTBzVjBGQlZ5eFRRVUZZTEZGQlFWY3NSMEZCVFR0QlFVTnlRaXhuUWtGQlNTeFBRVUZMTEU5QlFWUXNSVUZCYTBJN1FVRkRhRUlzY1VKQlFVc3NUMEZCVEN4RFFVRmhMRTlCUVdJc1EwRkJjVUlzVTBGQmNrSXNRMEZCSzBJc1RVRkJMMElzUTBGQmMwTXNVMEZCZEVNN1FVRkRSRHM3UVVGRlJDeHhRa0ZCVXl4dFFrRkJWQ3hEUVVFMlFpeHBRa0ZCVFN4alFVRnVReXhGUVVGdFJDeFJRVUZ1UkR0QlFVTkJMRzFDUVVGTExGbEJRVXdzUTBGQmEwSXNhVUpCUVUwc1RVRkJlRUk3UVVGRFFTeHRRa0ZCU3l4alFVRk1PMEZCUTBRc1YwRlNSRHM3UVVGVlFTeHRRa0ZCVXl4blFrRkJWQ3hEUVVFd1FpeHBRa0ZCVFN4alFVRm9ReXhGUVVGblJDeFJRVUZvUkR0QlFVTkJMRzFDUVVGVExGTkJRVlFzUTBGQmJVSXNSMEZCYmtJc1EwRkJkVUlzVTBGQmRrSTdRVUZEUkRzN1FVRkZSQ3hsUVVGUExFbEJRVkE3UVVGRFJEdEJRWEJOYjBJN1FVRkJRVHRCUVVGQkxIVkRRWE5OU2p0QlFVTm1MRmxCUVUwc1YwRkJWeXhUUVVGVExHRkJRVlFzUTBGQmRVSXNTMEZCZGtJc1EwRkJha0k3UVVGRFFTeHBRa0ZCVXl4WlFVRlVMRU5CUVhOQ0xGTkJRWFJDTEVWQlFXbERMRXRCUVVzc1JVRkJkRU03UVVGRFFTeHBRa0ZCVXl4VFFVRlVMRU5CUVcxQ0xFZEJRVzVDTEVOQlFYVkNMR2xDUVVGMlFqczdRVUZGUVN4cFFrRkJVeXhKUVVGVUxFTkJRV01zVjBGQlpDeERRVUV3UWl4UlFVRXhRanRCUVVORU8wRkJOVTF2UWp0QlFVRkJPMEZCUVVFc2IwTkJPRTFRTzBGQlExb3NaVUZCVHl4VFFVRlRMR0ZCUVZRc1QwRkJNa0lzYVVKQlFUTkNMR3RDUVVGNVJDeExRVUZMTEVWQlFUbEVMRkZCUVZBN1FVRkRSRHRCUVdoT2IwSTdRVUZCUVR0QlFVRkJMSFZEUVd0T1NqdEJRVU5tTEZsQlFVMHNWMEZCVnl4TFFVRkxMRmRCUVV3c1JVRkJha0k3UVVGRFFTeFpRVUZKTEZGQlFVb3NSVUZCWXp0QlFVTmFMRzFDUVVGVExFbEJRVlFzUTBGQll5eFhRVUZrTEVOQlFUQkNMRkZCUVRGQ08wRkJRMFE3UVVGRFJqdEJRWFpPYjBJN1FVRkJRVHRCUVVGQkxIRkRRWGxPVGp0QlFVRkJPenRCUVVOaUxGbEJRVTBzYVVKQlFXbENMRXRCUVVzc1QwRkJUQ3hEUVVGaExFOUJRV0lzUTBGQmNVSXNaMEpCUVhKQ0xFTkJRWE5ETEdkQ1FVRjBReXhEUVVGMlFqczdRVUZGUVN4WlFVRkpMR05CUVVvc1JVRkJiMEk3UVVGRGJFSXNaMEpCUVUwc1NVRkJUaXhEUVVGWExHTkJRVmdzUlVGQk1rSXNUMEZCTTBJc1EwRkJiVU03UVVGQlFTeHRRa0ZCVlN4UFFVRkxMR1ZCUVV3c1EwRkJjVUlzUlVGQlJTeFJRVUZSTEUxQlFWWXNSVUZCYTBJc1QwRkJUeXhQUVVGNlFpeEZRVUZ5UWl4RFFVRldPMEZCUVVFc1YwRkJia003UVVGRFJEczdRVUZGUkN4WlFVRkpMRXRCUVVzc1YwRkJWQ3hGUVVGelFqdEJRVU53UWl4alFVRk5MRmRCUVZjc1MwRkJTeXhYUVVGTUxFVkJRV3BDTzBGQlEwRXNaVUZCU3l4bFFVRk1MRU5CUVhGQ0xFVkJRVVVzVVVGQlVTeFJRVUZXTEVWQlFXOUNMRTlCUVU4c2FVSkJRVTBzUzBGQmFrTXNSVUZCY2tJN1FVRkRSRHM3UVVGRlJDeGhRVUZMTEdWQlFVd3NRMEZCY1VJc1JVRkJSU3hSUVVGUkxGRkJRVllzUlVGQmIwSXNUMEZCVHl4UFFVRXpRaXhGUVVGeVFqdEJRVU5FTzBGQmRFOXZRanRCUVVGQk8wRkJRVUVzY1VOQmQwOU9PMEZCUVVFN08wRkJRMklzV1VGQlRTeHBRa0ZCYVVJc1MwRkJTeXhQUVVGTUxFTkJRV0VzVDBGQllpeERRVUZ4UWl4blFrRkJja0lzUTBGQmMwTXNaMEpCUVhSRExFTkJRWFpDT3p0QlFVVkJMRmxCUVVrc1kwRkJTaXhGUVVGdlFqdEJRVU5zUWl4blFrRkJUU3hKUVVGT0xFTkJRVmNzWTBGQldDeEZRVUV5UWl4UFFVRXpRaXhEUVVGdFF6dEJRVUZCTEcxQ1FVRlZMRTlCUVVzc2FVSkJRVXdzUTBGQmRVSXNSVUZCUlN4UlFVRlJMRTFCUVZZc1JVRkJhMElzVDBGQlR5eFBRVUY2UWl4RlFVRjJRaXhEUVVGV08wRkJRVUVzVjBGQmJrTTdRVUZEUkRzN1FVRkZSQ3haUVVGSkxFdEJRVXNzVjBGQlZDeEZRVUZ6UWp0QlFVTndRaXhqUVVGTkxGZEJRVmNzUzBGQlN5eFhRVUZNTEVWQlFXcENPMEZCUTBFc1pVRkJTeXhwUWtGQlRDeERRVUYxUWl4RlFVRkZMRkZCUVZFc1VVRkJWaXhGUVVGdlFpeFBRVUZQTEdsQ1FVRk5MRXRCUVdwRExFVkJRWFpDTzBGQlEwUTdPMEZCUlVRc1lVRkJTeXhwUWtGQlRDeERRVUYxUWl4RlFVRkZMRkZCUVZFc1VVRkJWaXhGUVVGdlFpeFBRVUZQTEU5QlFUTkNMRVZCUVhaQ08wRkJRMFE3UVVGeVVHOUNPMEZCUVVFN1FVRkJRU3h0UTBGMVVFUTdRVUZEYkVJc1pVRkJUeXhKUVVGUU8wRkJRMFE3UVVGNlVHOUNPMEZCUVVFN1FVRkJRU3h2UTBFeVVFRXNUMEV6VUVFc1JVRXlVRk03UVVGRE5VSXNLMGRCUVRKQ0xGTkJRVE5DTEVWQlFYTkRMRTlCUVhSRE8wRkJRMFE3UVVFM1VHOUNPenRCUVVGQk8wRkJRVUU3TzBGQloxRjJRanM3T3pzN096dEJRVXRCTEUxQlFVMHNZVUZCWVN4RlFVRnVRanM3UVVGRlFTeE5RVUZOTEZsQlFWa3NVMEZCVXl4blFrRkJWQ3hQUVVFNFFpeEpRVUU1UWl4RFFVRnNRanRCUVVOQkxFMUJRVWtzVTBGQlNpeEZRVUZsTzBGQlEySXNWVUZCVFN4SlFVRk9MRU5CUVZjc1UwRkJXQ3hGUVVGelFpeFBRVUYwUWl4RFFVRTRRaXhWUVVGRExFOUJRVVFzUlVGQllUdEJRVU42UXl4VlFVRk5MRk5CUVZNc01rTkJRVzlDTEU5QlFYQkNMRVZCUVRaQ0xHdENRVUUzUWl4RlFVRnBSQ3h4UWtGQmFrUXNRMEZCWmp0QlFVTkJMR0ZCUVU4c1QwRkJVQ3hIUVVGcFFpeFBRVUZxUWpzN1FVRkZRU3hwUWtGQlZ5eEpRVUZZTEVOQlFXZENMRVZCUVVVc1owSkJRVVlzUlVGQlZ5eFhRVUZYTEVsQlFVa3NVMEZCU2l4RFFVRmpMRTFCUVdRc1EwRkJkRUlzUlVGQmFFSTdRVUZEUkN4TFFVeEVPMEZCVFVRN08wRkJSVVFzVjBGQlV5eG5Ra0ZCVkN4RFFVRXdRaXhQUVVFeFFpeEZRVUZ0UXl4VlFVRkRMRXRCUVVRc1JVRkJWenRCUVVNMVF5eFJRVUZOTEZOQlFWTXNOa0pCUVdsQ0xFMUJRVTBzVFVGQmRrSXNSVUZCSzBJc1lVRkJMMElzUTBGQlpqdEJRVU5CTEZGQlFVa3NRMEZCUXl4TlFVRk1MRVZCUVdFN1FVRkRXRHRCUVVORU96dEJRVVZFTEZGQlFVMHNhVUpCUVdsQ0xFOUJRVThzV1VGQlVDeERRVUZ2UWl4aFFVRndRaXhEUVVGMlFqdEJRVU5CTEZGQlFVa3NhMEpCUVd0Q0xHMUNRVUZ0UWl4SlFVRjZReXhGUVVFclF6dEJRVU0zUXl4VlFVRk5MRXRCUVVzc1QwRkJUeXhaUVVGUUxFTkJRVzlDTEdGQlFYQkNMRU5CUVZnN1FVRkRRU3hWUVVGTkxGVkJRVlVzVTBGQlV5eGhRVUZVTEVOQlFYVkNMRVZCUVhaQ0xFTkJRV2hDT3p0QlFVVkJMRlZCUVUwc1dVRkJXU3hYUVVGWExFbEJRVmdzUTBGQlowSTdRVUZCUVN4bFFVRkxMRVZCUVVVc1QwRkJSaXhMUVVGakxFOUJRVzVDTzBGQlFVRXNUMEZCYUVJc1EwRkJiRUk3TzBGQlJVRXNWVUZCU1N4RFFVRkRMRk5CUVV3c1JVRkJaMEk3UVVGRFpEdEJRVU5FT3p0QlFVVkVMR0ZCUVU4c1NVRkJVRHM3UVVGRlFTeG5Ra0ZCVlN4VFFVRldMRU5CUVc5Q0xFbEJRWEJDTzBGQlEwUTdRVUZEUml4SFFYSkNSRHM3UVVGMVFrRXNVMEZCVHl4VFFVRlFPMEZCUTBRc1EwRjZVMmxDTEVWQlFXeENPenRyUWtFeVUyVXNVenM3T3pzN096czdPenM3T3p0QlEyaFVaanM3T3p0QlFVTkJPenM3T3pzN096czdPeXRsUVU1Qk96czdPenM3TzBGQlVVRXNTVUZCVFN4WFFVRlpMRmxCUVUwN1FVRkRkRUk3T3pzN096dEJRVTFCTEUxQlFVMHNUMEZCVHl4VlFVRmlPMEZCUTBFc1RVRkJUU3hWUVVGVkxFOUJRV2hDTzBGQlEwRXNUVUZCVFN4eFFrRkJjVUk3UVVGRGVrSXNZVUZCVXl4SlFVUm5RanRCUVVWNlFpeFpRVUZSTEVOQlJtbENPMEZCUjNwQ0xGTkJRVXNzUTBGSWIwSTdRVUZKZWtJc1UwRkJTeXhIUVVwdlFqdEJRVXQ2UWl4WFFVRlBMRXRCVEd0Q08wRkJUWHBDTEdGQlFWTXNTMEZPWjBJN1FVRlBla0lzWjBKQlFWazdRVUZRWVN4SFFVRXpRanRCUVZOQkxFMUJRVTBzZDBKQlFYZENMRU5CUXpWQ0xGRkJSRFJDTEVWQlJUVkNMRXRCUmpSQ0xFVkJSelZDTEV0QlNEUkNMRVZCU1RWQ0xFOUJTalJDTEVWQlN6VkNMRk5CVERSQ0xFVkJUVFZDTEZsQlRqUkNMRU5CUVRsQ096dEJRVk5CT3pzN096czdRVUV6UW5OQ0xFMUJhVU5vUWl4UlFXcERaMEk3UVVGQlFUczdRVUZ0UTNCQ0xIZENRVUV3UWp0QlFVRkJMRlZCUVdRc1QwRkJZeXgxUlVGQlNpeEZRVUZKT3p0QlFVRkJPenRCUVVkNFFqdEJRVWgzUWl4elNFRkRiRUlzU1VGRWEwSXNSVUZEV2l4UFFVUlpMRVZCUTBnc2EwSkJSRWNzUlVGRGFVSXNUMEZFYWtJc1JVRkRNRUlzY1VKQlJERkNMRVZCUTJsRUxFdEJSR3BFTEVWQlEzZEVMRXRCUkhoRU96dEJRVWw0UWl4WlFVRkxMRTlCUVV3c1EwRkJZU3hQUVVGaUxFTkJRWEZDTEV0QlFYSkNMRU5CUVRKQ0xFMUJRVE5DTEVkQlFYVkRMRTFCUVVzc1QwRkJUQ3hEUVVGaExFMUJRWEJFT3p0QlFVVkJPMEZCUTBFc1ZVRkJUU3hqUVVGakxFMUJRVXNzWTBGQlRDeEZRVUZ3UWp0QlFVTkJMR3RDUVVGWkxGbEJRVm9zUTBGQmVVSXNaVUZCZWtJc1QwRkJOa01zVFVGQlN5eFBRVUZNTEVOQlFXRXNSMEZCTVVRN1FVRkRRU3hyUWtGQldTeFpRVUZhTEVOQlFYbENMR1ZCUVhwQ0xFOUJRVFpETEUxQlFVc3NUMEZCVEN4RFFVRmhMRWRCUVRGRU96dEJRVVZCTzBGQlEwRXNWVUZCU1N4TlFVRkxMRTlCUVV3c1EwRkJZU3hQUVVGaUxFbEJRME1zUTBGQlF5eFpRVUZaTEZOQlFWb3NRMEZCYzBJc1VVRkJkRUlzUTBGQkswSXNjMEpCUVM5Q0xFTkJSRTRzUlVGRE9FUTdRVUZETlVRc2IwSkJRVmtzVTBGQldpeERRVUZ6UWl4SFFVRjBRaXhEUVVFd1FpeHpRa0ZCTVVJN1FVRkRSRHM3UVVGRlJEdEJRVU5CTEZWQlFVa3NUMEZCVHl4TlFVRkxMRTlCUVV3c1EwRkJZU3hWUVVGd1FpeExRVUZ0UXl4UlFVRnVReXhKUVVORExFTkJRVU1zV1VGQldTeFRRVUZhTEVOQlFYTkNMRkZCUVhSQ0xGTkJRWEZETEUxQlFVc3NUMEZCVEN4RFFVRmhMRlZCUVd4RUxFTkJSRTRzUlVGRGRVVTdRVUZEY2tVc2IwSkJRVmtzVTBGQldpeERRVUZ6UWl4SFFVRjBRaXhUUVVGblF5eE5RVUZMTEU5QlFVd3NRMEZCWVN4VlFVRTNRenRCUVVORU8wRkJja0oxUWp0QlFYTkNla0k3TzBGQmVrUnRRanRCUVVGQk8wRkJRVUVzZFVOQk1rUklPMEZCUTJZc1pVRkJUeXhMUVVGTExFOUJRVXdzUTBGQllTeFBRVUZpTEVOQlFYRkNMR0ZCUVhKQ0xFTkJRVzFETEdWQlFXNURMRU5CUVZBN1FVRkRSRHRCUVRkRWJVSTdRVUZCUVR0QlFVRkJMRFJDUVN0RVREdEJRVUZCTEZsQlFWZ3NTMEZCVnl4MVJVRkJTQ3hEUVVGSE96dEJRVU5pTEZsQlFVMHNZMEZCWXl4TFFVRkxMR05CUVV3c1JVRkJjRUk3UVVGRFFTeFpRVUZOTEZkQlFWY3NTMEZCU3l4TFFVRk1MRU5CUVZrc1UwRkJVeXhMUVVGTExFOUJRVXdzUTBGQllTeEhRVUZpTEVkQlFXMUNMRXRCUVVzc1QwRkJUQ3hEUVVGaExFZEJRWHBETEVOQlFVUXNSMEZCYTBRc1IwRkJOMFFzUTBGQmFrSTdPMEZCUlVFc1dVRkJTU3hSUVVGUkxFdEJRVXNzVDBGQlRDeERRVUZoTEVkQlFYcENMRVZCUVRoQ08wRkJRelZDTEd0Q1FVRlJMRXRCUVZJc1EwRkJhVUlzU1VGQmFrSXNiVUpCUVcxRExFdEJRVzVETzBGQlEwRXNhVUpCUVU4c1MwRkJVRHRCUVVORU96dEJRVVZFTEZsQlFVa3NVVUZCVVN4TFFVRkxMRTlCUVV3c1EwRkJZU3hIUVVGNlFpeEZRVUU0UWp0QlFVTTFRaXhyUWtGQlVTeExRVUZTTEVOQlFXbENMRWxCUVdwQ0xHMUNRVUZ0UXl4TFFVRnVRenRCUVVOQkxHbENRVUZQTEV0QlFWQTdRVUZEUkRzN1FVRkZSQ3h2UWtGQldTeFpRVUZhTEVOQlFYbENMR1ZCUVhwQ0xFOUJRVFpETEV0QlFUZERPenRCUVVWQk8wRkJRMEVzV1VGQlNTeExRVUZMTEU5QlFVd3NRMEZCWVN4TFFVRnFRaXhGUVVGM1FqdEJRVU4wUWl4elFrRkJXU3hUUVVGYUxFZEJRVEpDTEZGQlFUTkNPMEZCUTBRN08wRkJSVVE3UVVGRFFTeHZRa0ZCV1N4TFFVRmFMRU5CUVd0Q0xFdEJRV3hDTEVkQlFUWkNMRkZCUVRkQ096dEJRVVZCTEdWQlFVOHNTVUZCVUR0QlFVTkVPMEZCZUVadFFqdEJRVUZCTzBGQlFVRXNaME5CTUVaWE8wRkJRVUVzV1VGQmRrSXNZMEZCZFVJc2RVVkJRVTRzU1VGQlRUczdRVUZETjBJc1dVRkJTU3hEUVVGRExFdEJRVXNzVDBGQlRDeERRVUZoTEU5QlFXeENMRVZCUVRKQ08wRkJRM3BDTEd0Q1FVRlJMRXRCUVZJc1EwRkJhVUlzU1VGQmFrSTdRVUZEUVN4cFFrRkJUeXhMUVVGUU8wRkJRMFE3TzBGQlJVUXNXVUZCVFN4alFVRmpMRXRCUVVzc1kwRkJUQ3hGUVVGd1FqczdRVUZGUVN4WlFVRkpMR3RDUVVORExFTkJRVU1zV1VGQldTeFRRVUZhTEVOQlFYTkNMRkZCUVhSQ0xFTkJRU3RDTEhWQ1FVRXZRaXhEUVVST0xFVkJReXRFTzBGQlF6ZEVMSE5DUVVGWkxGTkJRVm9zUTBGQmMwSXNSMEZCZEVJc1EwRkJNRUlzZFVKQlFURkNPMEZCUTBRN08wRkJSVVFzV1VGQlNTeERRVUZETEdOQlFVUXNTVUZEUXl4WlFVRlpMRk5CUVZvc1EwRkJjMElzVVVGQmRFSXNRMEZCSzBJc2RVSkJRUzlDTEVOQlJFd3NSVUZET0VRN1FVRkROVVFzYzBKQlFWa3NVMEZCV2l4RFFVRnpRaXhOUVVGMFFpeERRVUUyUWl4MVFrRkJOMEk3UVVGRFJEczdRVUZGUkN4bFFVRlBMRWxCUVZBN1FVRkRSRHRCUVRkSGJVSTdRVUZCUVR0QlFVRkJMRFpDUVN0SFlqdEJRVU5NTEdGQlFVc3NUMEZCVEN4RFFVRmhMRTlCUVdJc1EwRkJjVUlzUzBGQmNrSXNRMEZCTWtJc1RVRkJNMElzUjBGQmRVTXNTMEZCU3l4UFFVRk1MRU5CUVdFc1RVRkJjRVE3UVVGRFFTeGhRVUZMTEZsQlFVd3NRMEZCYTBJc2FVSkJRVTBzU1VGQmVFSTdRVUZEUVN4aFFVRkxMRmxCUVV3c1EwRkJhMElzYVVKQlFVMHNTMEZCZUVJN08wRkJSVUVzWlVGQlR5eEpRVUZRTzBGQlEwUTdRVUZ5U0cxQ08wRkJRVUU3UVVGQlFTdzJRa0YxU0dJN1FVRkRUQ3hoUVVGTExFOUJRVXdzUTBGQllTeFBRVUZpTEVOQlFYRkNMRXRCUVhKQ0xFTkJRVEpDTEUxQlFUTkNMRWRCUVc5RExFdEJRWEJETzBGQlEwRXNZVUZCU3l4WlFVRk1MRU5CUVd0Q0xHbENRVUZOTEVsQlFYaENPMEZCUTBFc1lVRkJTeXhaUVVGTUxFTkJRV3RDTEdsQ1FVRk5MRTFCUVhoQ096dEJRVVZCTEdWQlFVOHNTVUZCVUR0QlFVTkVPMEZCTjBodFFqdEJRVUZCTzBGQlFVRXNiVU5CSzBoQk8wRkJRMnhDTEdWQlFVOHNTVUZCVUR0QlFVTkVPMEZCYWtsdFFqdEJRVUZCTzBGQlFVRXNiME5CYlVsRExFOUJia2xFTEVWQmJVbFZPMEZCUXpWQ0xEWkhRVUV5UWl4UlFVRXpRaXhGUVVGeFF5eFBRVUZ5UXp0QlFVTkVPMEZCY2tsdFFqczdRVUZCUVR0QlFVRkJPenRCUVhkSmRFSXNVMEZCVHl4UlFVRlFPMEZCUTBRc1EwRjZTV2RDTEVWQlFXcENPenRyUWtFeVNXVXNVVHM3T3pzN096czdPenM3T3p0QlF6bEpaanM3T3p0QlFVTkJPenRCUVVOQk96czdPMEZCUTBFN096czdPenM3T3l0bFFWSkJPenM3T3pzN08wRkJWVUVzU1VGQlRTeE5RVUZQTEZsQlFVMDdRVUZEYWtJN096czdPenRCUVUxQkxFMUJRVTBzVDBGQlR5eExRVUZpTzBGQlEwRXNUVUZCVFN4VlFVRlZMRTlCUVdoQ08wRkJRMEVzVFVGQlRTeHhRa0ZCY1VJc1JVRkJNMEk3UVVGSFFTeE5RVUZOTEhkQ1FVRjNRaXhGUVVFNVFqdEJRVVZCTEUxQlFVMHNkVUpCUVhWQ0xGZEJRVGRDT3p0QlFVVkJPenM3T3pzN1FVRm9RbWxDTEUxQmMwSllMRWRCZEVKWE8wRkJRVUU3TzBGQmQwSm1MRzFDUVVFd1FqdEJRVUZCTEZWQlFXUXNUMEZCWXl4MVJVRkJTaXhGUVVGSk96dEJRVUZCT3p0QlFVRkJMSFZIUVVOc1FpeEpRVVJyUWl4RlFVTmFMRTlCUkZrc1JVRkRTQ3hyUWtGRVJ5eEZRVU5wUWl4UFFVUnFRaXhGUVVNd1FpeHhRa0ZFTVVJc1JVRkRhVVFzUzBGRWFrUXNSVUZEZDBRc1MwRkVlRVE3UVVGRmVrSTdPMEZCTVVKak8wRkJRVUU3UVVGQlFTdzJRa0UwUWxJN1FVRkRUQ3haUVVGSkxFdEJRVXNzVDBGQlRDeERRVUZoTEU5QlFXSXNRMEZCY1VJc1UwRkJja0lzUTBGQkswSXNVVUZCTDBJc1EwRkJkME1zVVVGQmVFTXNRMEZCU2l4RlFVRjFSRHRCUVVOeVJDeHBRa0ZCVHl4TFFVRlFPMEZCUTBRN08wRkJSVVFzV1VGQlRTeExRVUZMTEV0QlFVc3NUMEZCVEN4RFFVRmhMRTlCUVdJc1EwRkJjVUlzV1VGQmNrSXNRMEZCYTBNc1RVRkJiRU1zUTBGQldEdEJRVU5CTEZsQlFVMHNUVUZCVFN3NFFrRkJhMElzUzBGQlN5eFBRVUZNTEVOQlFXRXNUMEZCTDBJc1JVRkJkME1zUzBGQmVFTXNRMEZCV2p0QlFVTkJMRmxCUVUwc1ZVRkJWU3hOUVVGTkxFbEJRVWtzWjBKQlFVb3NiMEpCUVhORExFbEJRWFJETEZGQlFVNHNSMEZCZDBRc1NVRkJlRVU3TzBGQlJVRXNXVUZCU1N4UFFVRktMRVZCUVdFN1FVRkRXQ3huUWtGQlRTeEpRVUZPTEVOQlFWY3NUMEZCV0N4RlFVRnZRaXhQUVVGd1FpeERRVUUwUWl4VlFVRkRMRWRCUVVRc1JVRkJVenRCUVVOdVF5eG5Ra0ZCU1N4SlFVRkpMRk5CUVVvc1EwRkJZeXhSUVVGa0xFTkJRWFZDTEZGQlFYWkNMRU5CUVVvc1JVRkJjME03UVVGRGNFTXNhMEpCUVVrc1UwRkJTaXhEUVVGakxFMUJRV1FzUTBGQmNVSXNVVUZCY2tJN1FVRkRSRHRCUVVORUxHZENRVUZKTEZsQlFVb3NRMEZCYVVJc1pVRkJha0lzUlVGQmEwTXNTMEZCYkVNN1FVRkRSQ3hYUVV4RU8wRkJUVVE3TzBGQlJVUXNZVUZCU3l4UFFVRk1MRU5CUVdFc1QwRkJZaXhEUVVGeFFpeFRRVUZ5UWl4RFFVRXJRaXhIUVVFdlFpeERRVUZ0UXl4UlFVRnVRenRCUVVOQkxHRkJRVXNzVDBGQlRDeERRVUZoTEU5QlFXSXNRMEZCY1VJc1dVRkJja0lzUTBGQmEwTXNaVUZCYkVNc1JVRkJiVVFzU1VGQmJrUTdPMEZCUlVFc1dVRkJUU3hoUVVGaExGTkJRVk1zWVVGQlZDeERRVUYxUWl4RlFVRjJRaXhEUVVGdVFqdEJRVU5CTEZsQlFVMHNZMEZCWXl4WFFVRlhMRlZCUVZnc1EwRkJjMElzWjBKQlFYUkNMRU5CUVhWRExHOUNRVUYyUXl4RFFVRndRanM3UVVGRlFTeFpRVUZKTEZkQlFVb3NSVUZCYVVJN1FVRkRaaXhuUWtGQlRTeEpRVUZPTEVOQlFWY3NWMEZCV0N4RlFVRjNRaXhQUVVGNFFpeERRVUZuUXl4VlFVRkRMRWRCUVVRc1JVRkJVenRCUVVOMlF5eG5Ra0ZCU1N4SlFVRkpMRk5CUVVvc1EwRkJZeXhSUVVGa0xFTkJRWFZDTEZGQlFYWkNMRU5CUVVvc1JVRkJjME03UVVGRGNFTXNhMEpCUVVrc1UwRkJTaXhEUVVGakxFMUJRV1FzUTBGQmNVSXNVVUZCY2tJN1FVRkRSRHRCUVVOR0xGZEJTa1E3UVVGTFJEczdRVUZGUkN4dFFrRkJWeXhUUVVGWUxFTkJRWEZDTEVkQlFYSkNMRU5CUVhsQ0xGTkJRWHBDT3p0QlFVVkJMRzFDUVVGWExGbEJRVTA3UVVGRFppeGpRVUZOTEZkQlFWY3NVMEZCV0N4UlFVRlhMRWRCUVUwN1FVRkRja0lzZFVKQlFWY3NVMEZCV0N4RFFVRnhRaXhOUVVGeVFpeERRVUUwUWl4VFFVRTFRanRCUVVOQkxIVkNRVUZYTEZOQlFWZ3NRMEZCY1VJc1IwRkJja0lzUTBGQmVVSXNVVUZCZWtJN1FVRkRRU3gxUWtGQlZ5eFRRVUZZTEVOQlFYRkNMRTFCUVhKQ0xFTkJRVFJDTEZOQlFUVkNPMEZCUTBFc2RVSkJRVmNzYlVKQlFWZ3NRMEZCSzBJc2FVSkJRVTBzWTBGQmNrTXNSVUZCY1VRc1VVRkJja1E3UVVGRFJDeFhRVXhFT3p0QlFVOUJMSEZDUVVGWExHZENRVUZZTEVOQlFUUkNMR2xDUVVGTkxHTkJRV3hETEVWQlFXdEVMRkZCUVd4RU96dEJRVVZCTEhGQ1FVRlhMRk5CUVZnc1EwRkJjVUlzUjBGQmNrSXNRMEZCZVVJc1UwRkJla0k3UVVGRlJDeFRRVnBFTEVWQldVY3NSVUZhU0RzN1FVRmpRU3hsUVVGUExFbEJRVkE3UVVGRFJEdEJRVGRGWXp0QlFVRkJPMEZCUVVFc05rSkJLMFZTTzBGQlEwd3NXVUZCU1N4RFFVRkRMRXRCUVVzc1QwRkJUQ3hEUVVGaExFOUJRV0lzUTBGQmNVSXNVMEZCY2tJc1EwRkJLMElzVVVGQkwwSXNRMEZCZDBNc1VVRkJlRU1zUTBGQlRDeEZRVUYzUkR0QlFVTjBSQ3hwUWtGQlR5eExRVUZRTzBGQlEwUTdPMEZCUlVRc1dVRkJTU3hMUVVGTExFOUJRVXdzUTBGQllTeFBRVUZpTEVOQlFYRkNMRk5CUVhKQ0xFTkJRU3RDTEZGQlFTOUNMRU5CUVhkRExGRkJRWGhETEVOQlFVb3NSVUZCZFVRN1FVRkRja1FzWlVGQlN5eFBRVUZNTEVOQlFXRXNUMEZCWWl4RFFVRnhRaXhUUVVGeVFpeERRVUVyUWl4TlFVRXZRaXhEUVVGelF5eFJRVUYwUXp0QlFVTkVPenRCUVVWRUxHRkJRVXNzVDBGQlRDeERRVUZoTEU5QlFXSXNRMEZCY1VJc1dVRkJja0lzUTBGQmEwTXNaVUZCYkVNc1JVRkJiVVFzUzBGQmJrUTdPMEZCUlVFc1dVRkJUU3hMUVVGTExFdEJRVXNzVDBGQlRDeERRVUZoTEU5QlFXSXNRMEZCY1VJc1dVRkJja0lzUTBGQmEwTXNUVUZCYkVNc1EwRkJXRHRCUVVOQkxGbEJRVTBzWVVGQllTeFRRVUZUTEdGQlFWUXNRMEZCZFVJc1JVRkJka0lzUTBGQmJrSTdPMEZCUlVFc1dVRkJTU3hYUVVGWExGTkJRVmdzUTBGQmNVSXNVVUZCY2tJc1EwRkJPRUlzVVVGQk9VSXNRMEZCU2l4RlFVRTJRenRCUVVNelF5eHhRa0ZCVnl4VFFVRllMRU5CUVhGQ0xFMUJRWEpDTEVOQlFUUkNMRkZCUVRWQ08wRkJRMFE3TzBGQlJVUXNaVUZCVHl4SlFVRlFPMEZCUTBRN1FVRnNSMk03UVVGQlFUdEJRVUZCTEcxRFFXOUhTenRCUVVOc1FpeGxRVUZQTEVsQlFWQTdRVUZEUkR0QlFYUkhZenRCUVVGQk8wRkJRVUVzYjBOQmQwZE5MRTlCZUVkT0xFVkJkMGRsTzBGQlF6VkNMRzFIUVVFeVFpeEhRVUV6UWl4RlFVRm5ReXhQUVVGb1F6dEJRVU5FTzBGQk1VZGpPenRCUVVGQk8wRkJRVUU3TzBGQk5rZHFRanM3T3pzN096dEJRVXRCTEUxQlFVMHNZVUZCWVN4RlFVRnVRanM3UVVGRlFTeE5RVUZOTEU5QlFVOHNVMEZCVXl4blFrRkJWQ3h2UWtGQk1rTXNTVUZCTTBNc1VVRkJZanRCUVVOQkxFMUJRVWtzU1VGQlNpeEZRVUZWTzBGQlExSXNWVUZCVFN4SlFVRk9MRU5CUVZjc1NVRkJXQ3hGUVVGcFFpeFBRVUZxUWl4RFFVRjVRaXhWUVVGRExFOUJRVVFzUlVGQllUdEJRVU53UXp0QlFVTkJMRlZCUVUwc1UwRkJVeXd5UTBGQmIwSXNUMEZCY0VJc1JVRkJOa0lzYTBKQlFUZENMRVZCUVdsRUxIRkNRVUZxUkN4RFFVRm1PMEZCUTBFc1lVRkJUeXhQUVVGUUxFZEJRV2xDTEU5QlFXcENPenRCUVVWQkxHbENRVUZYTEVsQlFWZ3NRMEZCWjBJc1NVRkJTU3hoUVVGS0xFTkJRV3RDTEUxQlFXeENMRU5CUVdoQ08wRkJRMFFzUzBGT1JEdEJRVTlFT3p0QlFVVkVMRmRCUVZNc1owSkJRVlFzUTBGQk1FSXNUMEZCTVVJc1JVRkJiVU1zVlVGQlF5eExRVUZFTEVWQlFWYzdRVUZETlVNc1VVRkJUU3hwUWtGQmFVSXNUVUZCVFN4TlFVRk9MRU5CUVdFc1dVRkJZaXhEUVVFd1FpeGhRVUV4UWl4RFFVRjJRanRCUVVOQkxGRkJRVWtzYTBKQlFXdENMRzFDUVVGdFFpeEpRVUY2UXl4RlFVRXJRenRCUVVNM1F5eFZRVUZOTEV0QlFVc3NUVUZCVFN4TlFVRk9MRU5CUVdFc1dVRkJZaXhEUVVFd1FpeE5RVUV4UWl4RFFVRllPenRCUVVWQkxGVkJRVTBzV1VGQldTeFhRVUZYTEVsQlFWZ3NRMEZCWjBJN1FVRkJRU3hsUVVGTExFVkJRVVVzVlVGQlJpeEhRVUZsTEZsQlFXWXNRMEZCTkVJc1RVRkJOVUlzVFVGQmQwTXNSVUZCTjBNN1FVRkJRU3hQUVVGb1FpeERRVUZzUWpzN1FVRkZRU3hWUVVGSkxFTkJRVU1zVTBGQlRDeEZRVUZuUWp0QlFVTmtPMEZCUTBRN08wRkJSVVFzWjBKQlFWVXNTVUZCVmp0QlFVTkVPMEZCUTBZc1IwRmlSRHM3UVVGbFFTeFRRVUZQTEVkQlFWQTdRVUZEUkN4RFFTOUpWeXhGUVVGYU96dHJRa0ZwU21Vc1J6czdPenM3T3pzN096czdPenM3TzBGRE0wcG1PenM3T3pzN1FVRk5RU3hKUVVGTkxGTkJRVlVzV1VGQlRUdEJRVU53UWpzN096czdPMEZCVFVFc1RVRkJUU3hQUVVGUExHRkJRV0k3UVVGRFFTeE5RVUZOTEZWQlFWVXNUMEZCYUVJN08wRkJSVUU3T3pzN096dEJRVlp2UWl4TlFXZENaQ3hOUVdoQ1l6dEJRV2xDYkVJc2IwSkJRVmtzVDBGQldpeEZRVUZ4UWl4SlFVRnlRaXhGUVVFeVFqdEJRVUZCT3p0QlFVTjZRaXhYUVVGTExFOUJRVXdzUjBGQlpTeFBRVUZtTzBGQlEwRXNWMEZCU3l4SlFVRk1MRWRCUVZrc1NVRkJXanM3UVVGRlFTeFZRVUZKTEVOQlFVTXNTMEZCU3l4VFFVRk1MRU5CUVdVc1MwRkJTeXhQUVVGd1FpeERRVUZNTEVWQlFXMURPMEZCUTJwRE8wRkJRMFE3TzBGQlJVUTdRVUZEUVN4VlFVRkpMRXRCUVVzc1QwRkJUQ3hEUVVGaExFMUJRV0lzU1VGQmRVSXNTMEZCU3l4UFFVRk1MRU5CUVdFc1RVRkJZaXhIUVVGelFpeERRVUZxUkN4RlFVRnZSRHRCUVVOc1JDeGhRVUZMTEZGQlFVd3NRMEZCWXl4TFFVRkxMRTlCUVc1Q08wRkJRMFFzVDBGR1JDeE5RVVZQTzBGQlEwdzdRVUZEUVN4aFFVRkxMRTlCUVV3c1EwRkJZU3hMUVVGTExFOUJRV3hDTzBGQlEwUTdRVUZEUmpzN1FVRkZSRHM3UVVGc1EydENPMEZCUVVFN096dEJRWGREYkVJN096czdPMEZCZUVOclFpeG5RMEUyUTFJc1QwRTNRMUVzUlVFMlEwTTdRVUZEYWtJc1dVRkJTU3haUVVGWkxFbEJRV2hDTEVWQlFYTkNPMEZCUTNCQ0xHbENRVUZQTEV0QlFWQTdRVUZEUkR0QlFVTkVMR1ZCUVZFc1VVRkJUeXhKUVVGUUxIbERRVUZQTEVsQlFWQXNUMEZCWjBJc1VVRkJhRUlzUjBGQk1rSXNiVUpCUVcxQ0xFbEJRVGxETEVkQlFYRkVMRmRCUVZjc1VVRkJUeXhQUVVGUUxIbERRVUZQTEU5QlFWQXNUMEZCYlVJc1VVRkJPVUlzU1VGQk1FTXNUMEZCVHl4UlFVRlJMRkZCUVdZc1MwRkJORUlzVVVGQmRFVXNTVUZCYTBZc1QwRkJUeXhSUVVGUkxGRkJRV1lzUzBGQk5FSXNVVUZCTTBzN1FVRkRSRHM3UVVGRlJEczdPenM3TzBGQmNFUnJRanRCUVVGQk8wRkJRVUVzT0VKQmVVUldMRTlCZWtSVkxFVkJlVVJFTEVsQmVrUkRMRVZCZVVSTE8wRkJRM0pDTEZsQlFVa3NSVUZCUlN4cFFrRkJhVUlzVDBGQmJrSXNRMEZCU2l4RlFVRnBRenRCUVVNdlFpeHJRa0ZCVVN4VFFVRlNMRWRCUVc5Q0xFbEJRWEJDTzBGQlEwUXNVMEZHUkN4TlFVVlBPMEZCUTB3c2EwSkJRVkVzVjBGQlVpeEhRVUZ6UWl4SlFVRjBRanRCUVVORU8wRkJRMFk3TzBGQlJVUTdPenM3T3p0QlFXcEZhMEk3UVVGQlFUdEJRVUZCTERoQ1FYTkZWaXhQUVhSRlZTeEZRWE5GUkN4SlFYUkZReXhGUVhORlN6dEJRVU55UWl4blFrRkJVU3hUUVVGU0xFZEJRVzlDTEVsQlFYQkNPMEZCUTBRN08wRkJSVVE3T3pzN096czdRVUV4Uld0Q08wRkJRVUU3UVVGQlFTeHRRMEZuUmt3c1QwRm9Sa3NzUlVGblJra3NTVUZvUmtvc1JVRm5SbFVzU1VGb1JsWXNSVUZuUm1kQ08wRkJRMmhETEdkQ1FVRlJMRmxCUVZJc1EwRkJjVUlzU1VGQmNrSXNSVUZCTWtJc1NVRkJNMEk3UVVGRFJEdEJRV3hHYVVJN1FVRkJRVHRCUVVGQkxEaENRVzlHVml4UFFYQkdWU3hGUVc5R1JEdEJRVU5tTEZsQlFVa3NUMEZCVHl4UlFVRlJMRmxCUVZJc1EwRkJjVUlzVjBGQmNrSXNRMEZCV0R0QlFVTkJMRmxCUVVrc1EwRkJReXhKUVVGTUxFVkJRVmM3UVVGRFZEdEJRVU5FT3p0QlFVVkVMR1ZCUVU4c1MwRkJTeXhKUVVGTUxFVkJRVkE3TzBGQlJVRXNXVUZCVFN4SlFVRkpMR2xFUVVGV08wRkJRMEVzV1VGQlNTeFZRVUZLT3p0QlFVVkJMR1ZCUVU4c1NVRkJTU3hGUVVGRkxFbEJRVVlzUTBGQlR5eEpRVUZRTEVOQlFWZ3NSVUZCZVVJN1FVRkRka0lzWTBGQlRTeE5RVUZOTEVWQlFVVXNRMEZCUml4RlFVRkxMRWxCUVV3c1JVRkJXanRCUVVOQkxHTkJRVTBzVVVGQlVTeEZRVUZGTEVOQlFVWXNSVUZCU3l4SlFVRk1MRWRCUVZrc1QwRkJXaXhEUVVGdlFpeEhRVUZ3UWl4RlFVRjVRaXhGUVVGNlFpeERRVUZrTzBGQlEwRXNZMEZCU1N4WlFVRlpMRXRCUVVzc1NVRkJUQ3hEUVVGVkxFdEJRVllzUTBGQmFFSTdPMEZCUlVFc1kwRkJTU3hEUVVGRExFdEJRVXNzU1VGQlRDeERRVUZWTEV0QlFWWXNRMEZCVEN4RlFVRjFRanRCUVVOeVFpeHZRa0ZCVVN4SFFVRlNMRU5CUVdVc1NVRkJaaXh0UWtGQmFVTXNTMEZCYWtNN1FVRkRRU3gzUWtGQldTeExRVUZhTzBGQlEwUTdPMEZCUlVRc1kwRkJUU3hoUVVGaExGRkJRVkVzU1VGQlNTeE5RVUZLTEVOQlFWY3NRMEZCV0N4RlFVRmpMRmRCUVdRc1JVRkJVaXhIUVVGelF5eEpRVUZKTEV0QlFVb3NRMEZCVlN4RFFVRldMRU5CUVhwRU96dEJRVVZCTEdOQlFVa3NTMEZCU3l4VlFVRk1MRU5CUVVvc1JVRkJjMEk3UVVGRGNFSXNhVUpCUVVzc1ZVRkJUQ3hGUVVGcFFpeFBRVUZxUWl4RlFVRXdRaXhUUVVFeFFqdEJRVU5FTEZkQlJrUXNUVUZGVHp0QlFVTk1MR2xDUVVGTExGbEJRVXdzUTBGQmEwSXNUMEZCYkVJc1JVRkJNa0lzUjBGQk0wSXNSVUZCWjBNc1UwRkJhRU03UVVGRFJEdEJRVU5HTzBGQlEwWTdPMEZCUlVRN096czdRVUZ1U0d0Q08wRkJRVUU3UVVGQlFTd3JRa0Z6U0ZRc1QwRjBTRk1zUlVGelNFRTdRVUZCUVRzN1FVRkRhRUlzWTBGQlRTeEpRVUZPTEVOQlFWY3NUMEZCV0N4RlFVRnZRaXhQUVVGd1FpeERRVUUwUWp0QlFVRkJMR2xDUVVGTkxFMUJRVXNzVDBGQlRDeERRVUZoTEVWQlFXSXNRMEZCVGp0QlFVRkJMRk5CUVRWQ08wRkJRMFE3UVVGNFNHbENPMEZCUVVFN1FVRkJRU3d3UWtGdlEwYzdRVUZEYmtJc1pVRkJWU3hKUVVGV0xGTkJRV3RDTEU5QlFXeENPMEZCUTBRN1FVRjBRMmxDT3p0QlFVRkJPMEZCUVVFN08wRkJNa2h3UWl4VFFVRlBMRTFCUVZBN1FVRkRSQ3hEUVRWSVl5eEZRVUZtT3p0clFrRTRTR1VzVFRzN096czdPenM3T3pzN2NXcENRM0JKWmpzN096czdPenRCUVV0Qk96czdPenM3T3p0QlFVVkJMRWxCUVUwc1QwRkJVU3haUVVGTk8wRkJRMnhDT3pzN096czdRVUZOUVN4TlFVRk5MRTlCUVU4c1RVRkJZanRCUVVOQkxFMUJRVTBzVlVGQlZTeFBRVUZvUWp0QlFVTkJMRTFCUVUwc2NVSkJRWEZDTzBGQlEzcENMRzlDUVVGblFpeEpRVVJUTzBGQlJYcENMRmxCUVZFc1NVRkdhVUk3UVVGSGVrSXNZMEZCVlN4SlFVaGxPMEZCU1hwQ0xGVkJRVTA3TzBGQlIxSTdPenM3T3p0QlFWQXlRaXhIUVVFelFqdEJRVlJyUWl4TlFYTkNXaXhKUVhSQ1dUdEJRWFZDYUVJN096czdRVUZKUVN4dlFrRkJNRUk3UVVGQlFTeFZRVUZrTEU5QlFXTXNkVVZCUVVvc1JVRkJTVHM3UVVGQlFUczdRVUZEZUVJc1YwRkJTeXhQUVVGTUxFZEJRV1VzVDBGQlR5eE5RVUZRTEVOQlFXTXNhMEpCUVdRc1JVRkJhME1zVDBGQmJFTXNRMEZCWmpzN1FVRkZRU3hWUVVGSkxFOUJRVThzUzBGQlN5eFBRVUZNTEVOQlFXRXNZMEZCY0VJc1MwRkJkVU1zVVVGQk0wTXNSVUZCY1VRN1FVRkRia1FzWTBGQlRTeEpRVUZKTEV0QlFVb3NRMEZCWVN4SlFVRmlMRGhFUVVGT08wRkJRMFE3TzBGQlJVUXNWVUZCU1N4TFFVRkxMRTlCUVV3c1EwRkJZU3hKUVVGaUxFdEJRWE5DTEVsQlFURkNMRVZCUVdkRE8wRkJRemxDTEdOQlFVMHNTVUZCU1N4TFFVRktMRU5CUVdFc1NVRkJZaXh4UTBGQlRqdEJRVU5FT3p0QlFVVkVMRlZCUVVrc1VVRkJUeXhMUVVGTExFOUJRVXdzUTBGQllTeEpRVUZpTEVOQlFXdENMRXRCUVVzc1QwRkJUQ3hEUVVGaExHTkJRUzlDTEVOQlFWQXNUVUZCTUVRc1VVRkJPVVFzUlVGQmQwVTdRVUZEZEVVc1kwRkJUU3hKUVVGSkxFdEJRVW9zUTBGQllTeEpRVUZpTEcxRlFVRk9PMEZCUTBRN08wRkJSVVFzVjBGQlN5eFRRVUZNTEVOQlFXVXNTMEZCU3l4UFFVRk1MRU5CUVdFc1RVRkJOVUlzUlVGQmIwTXNTMEZCU3l4UFFVRk1MRU5CUVdFc1VVRkJha1E3UVVGRFJEczdRVUV6UTJVN1FVRkJRVHRCUVVGQkxHdERRV2xFU2p0QlFVTldMR1ZCUVU4c1MwRkJTeXhQUVVGTUxFTkJRV0VzVFVGQmNFSTdRVUZEUkR0QlFXNUVaVHRCUVVGQk8wRkJRVUVzTUVOQmNVUkpPMEZCUTJ4Q0xHVkJRVThzUzBGQlN5eFBRVUZNTEVOQlFXRXNZMEZCY0VJN1FVRkRSRHM3UVVGRlJEczdPenM3TzBGQmVrUm5RanRCUVVGQk8wRkJRVUVzWjBOQk9FUk9MRTFCT1VSTkxFVkJPRVJ4UWp0QlFVRkJMRmxCUVc1Q0xGVkJRVzFDTEhWRlFVRk9MRWxCUVUwN08wRkJRMjVETEZsQlFVa3NVVUZCVHl4TFFVRkxMRTlCUVV3c1EwRkJZU3hKUVVGaUxFTkJRV3RDTEUxQlFXeENMRU5CUVZBc1RVRkJjVU1zVVVGQmVrTXNSVUZCYlVRN1FVRkRha1FzYTBKQlFWRXNTMEZCVWl4RFFVRnBRaXhKUVVGcVFpeFZRVUV3UWl4TlFVRXhRaXhyUTBGQk5rUXNTMEZCU3l4UFFVRk1MRU5CUVdFc1kwRkJNVVU3UVVGRFJDeFRRVVpFTEUxQlJVODdRVUZEVEN4bFFVRkxMRTlCUVV3c1EwRkJZU3hOUVVGaUxFZEJRWE5DTEUxQlFYUkNPMEZCUTBRN08wRkJSVVFzV1VGQlNTeFZRVUZLTEVWQlFXZENPMEZCUTJRc1pVRkJTeXhWUVVGTU8wRkJRMFE3UVVGRFJqdEJRWGhGWlR0QlFVRkJPMEZCUVVFc2NVTkJNRVZFTzBGQlEySXNaVUZCVHl4UFFVRlBMRWxCUVZBc1EwRkJXU3hMUVVGTExFOUJRVXdzUTBGQllTeEpRVUY2UWl4RFFVRlFPMEZCUTBRN1FVRTFSV1U3UVVGQlFUdEJRVUZCTEhGRFFUaEZhME03UVVGQlFTeFpRVUZ5UXl4TFFVRnhReXgxUlVGQk4wSXNTVUZCTmtJN1FVRkJRU3haUVVGMlFpeG5Ra0ZCZFVJc2RVVkJRVW9zUlVGQlNUczdRVUZEYUVRc1dVRkJTU3hQUVVGUExFdEJRVkFzUzBGQmFVSXNVVUZCY2tJc1JVRkJLMEk3UVVGRE4wSXNhVUpCUVU4c1UwRkJVRHRCUVVORU96dEJRVVZFTEZsQlFVMHNVVUZCVVN4TlFVRk5MRXRCUVU0c1EwRkJXU3h0UWtGQldpeERRVUZrTzBGQlEwRXNXVUZCU1N4TFFVRktMRVZCUVZjN1FVRkRWQ3hyUWtGQlVTeE5RVUZOTEU5QlFVNHNRMEZCWXl4TlFVRk5MRU5CUVU0c1EwRkJaQ3hGUVVGM1FpeHBRa0ZCYVVJc1RVRkJUU3hEUVVGT0xFTkJRV3BDTEVOQlFYaENMRU5CUVZJN1FVRkRSRHM3UVVGRlJDeFpRVUZKTEUxQlFVMHNTMEZCVGl4RFFVRlpMRzFDUVVGYUxFTkJRVW9zUlVGQmMwTTdRVUZEY0VNc2FVSkJRVThzUzBGQlN5eFpRVUZNTEVOQlFXdENMRXRCUVd4Q0xFVkJRWGxDTEdkQ1FVRjZRaXhEUVVGUU8wRkJRMFE3TzBGQlJVUXNaVUZCVHl4TFFVRlFPMEZCUTBRN1FVRTNSbVU3UVVGQlFUdEJRVUZCTEd0RFFTdEdkVUk3UVVGQlFUczdRVUZCUVN4WlFVRTNRaXhQUVVFMlFpeDFSVUZCYmtJc1NVRkJiVUk3UVVGQlFTeFpRVUZpTEUxQlFXRXNkVVZCUVVvc1JVRkJTVHM3UVVGRGNrTXNXVUZCU1N4UFFVRlBMRXRCUVVzc1QwRkJUQ3hEUVVGaExFbEJRV0lzUTBGQmEwSXNTMEZCU3l4UFFVRk1MRU5CUVdFc1RVRkJMMElzUTBGQldEdEJRVU5CTEZsQlFVa3NRMEZCUXl4SlFVRk1MRVZCUVZjN1FVRkRWQ3hwUWtGQlR5eExRVUZMTEU5QlFVd3NRMEZCWVN4SlFVRmlMRU5CUVd0Q0xFdEJRVXNzVDBGQlRDeERRVUZoTEdOQlFTOUNMRU5CUVZBN1FVRkRSRHM3UVVGRlJDeFpRVUZKTEZsQlFWa3NTVUZCV2l4SlFVRnZRaXhaUVVGWkxFZEJRV2hETEVsQlFYVkRMRTFCUVUwc1QwRkJUaXhEUVVGakxFOUJRV1FzUTBGQk0wTXNSVUZCYlVVN1FVRkRha1VzWTBGQlNTeE5RVUZOTEU5QlFVNHNRMEZCWXl4UFFVRmtMRU5CUVVvc1JVRkJORUk3UVVGRE1VSXNaMEpCUVUwc1QwRkJUeXhQUVVGUExFbEJRVkFzUTBGQldTeEpRVUZhTEVWQlFXdENMRTFCUVd4Q0xFTkJRWGxDTzBGQlFVRXNjVUpCUVU4c1VVRkJVU3hQUVVGU0xFTkJRV2RDTEVkQlFXaENMRWxCUVhWQ0xFTkJRVU1zUTBGQkwwSTdRVUZCUVN4aFFVRjZRaXhEUVVGaU8wRkJRMEVzWjBKQlFVMHNaVUZCWlN4RlFVRnlRanRCUVVOQkxHbENRVUZMTEU5QlFVd3NRMEZCWVN4bFFVRlBPMEZCUTJ4Q0xESkNRVUZoTEVkQlFXSXNTVUZCYjBJc1RVRkJTeXhaUVVGTUxFTkJRV3RDTEV0QlFVc3NSMEZCVEN4RFFVRnNRaXhGUVVFMlFpeE5RVUUzUWl4RFFVRndRanRCUVVORUxHRkJSa1E3UVVGSFFTeHRRa0ZCVHl4WlFVRlFPMEZCUTBRN08wRkJSVVFzWTBGQlRTeFZRVUZWTEVWQlFXaENPMEZCUTBFc1pVRkJTeXhKUVVGTkxFZEJRVmdzU1VGQmEwSXNTVUZCYkVJc1JVRkJkMEk3UVVGRGRFSXNiMEpCUVZFc1IwRkJVaXhKUVVGbExFdEJRVXNzV1VGQlRDeERRVUZyUWl4TFFVRkxMRWRCUVV3c1EwRkJiRUlzUlVGQk5rSXNUVUZCTjBJc1EwRkJaanRCUVVORU96dEJRVVZFTEdsQ1FVRlBMRTlCUVZBN1FVRkRSRHM3UVVGRlJDeGxRVUZQTEV0QlFVc3NXVUZCVEN4RFFVRnJRaXhMUVVGTExFOUJRVXdzUTBGQmJFSXNSVUZCYVVNc1RVRkJha01zUTBGQlVEdEJRVU5FT3p0QlFVVkVPenRCUVRGSVowSTdRVUZCUVR0QlFVRkJMREJDUVRKSVpUdEJRVUZCTEZsQlFUZENMRTlCUVRaQ0xIVkZRVUZ1UWl4SlFVRnRRanRCUVVGQkxGbEJRV0lzVFVGQllTeDFSVUZCU2l4RlFVRkpPenRCUVVNM1FpeGxRVUZQTEV0QlFVc3NVMEZCVEN4RFFVRmxMRTlCUVdZc1JVRkJkMElzVFVGQmVFSXNRMEZCVUR0QlFVTkVPenRCUVVWRU96czdPenRCUVM5SVowSTdRVUZCUVR0QlFVRkJMR2xEUVcxSlRDeFBRVzVKU3l4RlFXMUpTVHRCUVVOc1FpeFpRVUZKTEU5QlFVOHNUMEZCVUN4TFFVRnRRaXhYUVVGMlFpeEZRVUZ2UXp0QlFVTnNReXh2UWtGQlZTeFRRVUZUTEdkQ1FVRlVMRU5CUVRCQ0xHRkJRVEZDTEVOQlFWWTdRVUZEUkRzN1FVRkZSQ3haUVVGSkxFOUJRVThzVDBGQlVDeExRVUZ0UWl4UlFVRjJRaXhGUVVGcFF6dEJRVU12UWl4dlFrRkJWU3hUUVVGVExHRkJRVlFzUTBGQmRVSXNUMEZCZGtJc1EwRkJWanRCUVVORU96dEJRVVZFTERaQ1FVRlhMRTlCUVZnc1JVRkJiMElzUzBGQlN5eERRVUZNTEVWQlFYQkNPMEZCUTBRN08wRkJSVVE3TzBGQkwwbG5RanRCUVVGQk8wRkJRVUVzYjBOQlowcExMRTlCYUVwTUxFVkJaMHBqTzBGQlF6VkNMR1ZCUVU4c1NVRkJTU3hKUVVGS0xFTkJRVk1zVDBGQlZDeERRVUZRTzBGQlEwUTdRVUZzU21VN1FVRkJRVHRCUVVGQkxEQkNRVFpEU3p0QlFVTnVRaXhsUVVGVkxFbEJRVllzVTBGQmEwSXNUMEZCYkVJN1FVRkRSRHRCUVM5RFpUczdRVUZCUVR0QlFVRkJPenRCUVhGS2JFSXNVMEZCVHl4SlFVRlFPMEZCUTBRc1EwRjBTbGtzUlVGQllqczdhMEpCZDBwbExFazdPenM3T3pzN096dHhha0pETDBwbU96czdPenM3UVVGTlFUczdPenRCUVVOQk96czdPenM3T3p0QlFVVkJMRWxCUVUwc1VVRkJVeXhaUVVGTk8wRkJRMjVDT3pzN096czdRVUZOUVN4TlFVRk5MRTlCUVU4c1QwRkJZanRCUVVOQkxFMUJRVTBzVlVGQlZTeFBRVUZvUWp0QlFVTkJMRTFCUVUwc2NVSkJRWEZDTzBGQlEzcENMR2RDUVVGWkxFbEJSR0U3UVVGRmVrSXNZVUZCVXl4SlFVWm5RanRCUVVkNlFpeHBRa0ZCWVN4SlFVaFpPMEZCU1hwQ0xHdENRVUZqTzBGQlNsY3NSMEZCTTBJN08wRkJUMEVzVFVGQlNTeHZRa0ZCU2p0QlFVTkJPenM3T3pzN1FVRnFRbTFDTEUxQmRVSmlMRXRCZGtKaE8wRkJkMEpxUWpzN096czdRVUZMUVN4eFFrRkJNRUk3UVVGQlFTeFZRVUZrTEU5QlFXTXNkVVZCUVVvc1JVRkJTVHM3UVVGQlFUczdRVUZEZUVJc1YwRkJTeXhQUVVGTUxFZEJRV1VzVDBGQlR5eE5RVUZRTEVOQlFXTXNhMEpCUVdRc1JVRkJhME1zVDBGQmJFTXNRMEZCWmpzN1FVRkZRU3hYUVVGTExFdEJRVXdzUjBGQllTeEZRVUZpTzBGQlEwRXNWMEZCU3l4UFFVRk1MRWRCUVdVc1MwRkJaanM3UVVGRlFUdEJRVU5CTEZkQlFVc3NZMEZCVERzN1FVRkZRVHRCUVVOQkxGZEJRVXNzVjBGQlREdEJRVU5FT3p0QlFVVkVPenM3UVVFeFEybENPMEZCUVVFN1FVRkJRU3gzUWtFeVEyWXNVVUV6UTJVc1JVRXlRMHc3UVVGRFZpeGxRVUZQTEZOQlFWTXNZVUZCVkN4RFFVRjFRaXhSUVVGMlFpeERRVUZRTzBGQlEwUTdRVUUzUTJkQ08wRkJRVUU3UVVGQlFTeG5RMEVyUTFBN1FVRkRVaXhsUVVGUExFOUJRVThzVVVGQlVDeERRVUZuUWl4SlFVRm9RaXhEUVVGeFFpeExRVUZ5UWl4RFFVRXlRaXhMUVVGTExFOUJRVXdzUTBGQllTeFZRVUY0UXl4RlFVRnZSQ3hEUVVGd1JDeERRVUZRTzBGQlEwUTdRVUZxUkdkQ08wRkJRVUU3UVVGQlFTeDNRMEZ0UkVNN1FVRkRhRUlzV1VGQlRTeFBRVUZQTEV0QlFVc3NUMEZCVEN4RlFVRmlPMEZCUTBFc1dVRkJUU3hMUVVGTExFbEJRVWtzVFVGQlNpeERRVUZYTEdWQlFWZ3NRMEZCV0R0QlFVTkJMRmxCUVUwc1ZVRkJWU3hIUVVGSExFbEJRVWdzUTBGQlVTeEpRVUZTTEVOQlFXaENPenRCUVVWQkxGbEJRVWtzVjBGQlZ5eFJRVUZSTEVOQlFWSXNRMEZCWml4RlFVRXlRanRCUVVONlFpeHBRa0ZCVHl4UlFVRlJMRU5CUVZJc1EwRkJVRHRCUVVORU96dEJRVVZFTEdWQlFVOHNTVUZCVUR0QlFVTkVPMEZCTjBSblFqdEJRVUZCTzBGQlFVRXNPRUpCSzBSVUxGRkJMMFJUTEVWQkswUkRPMEZCUTJoQ0xHVkJRVThzVVVGQlVDeERRVUZuUWl4SlFVRm9RaXhIUVVFd1FpeExRVUZMTEU5QlFVd3NRMEZCWVN4VlFVRjJReXhUUVVGeFJDeFJRVUZ5UkR0QlFVTkVPMEZCYWtWblFqdEJRVUZCTzBGQlFVRXNhME5CYlVWTUxGTkJia1ZMTEVWQmJVVk5MRk5CYmtWT0xFVkJiVVZwUWp0QlFVTm9ReXhaUVVGTkxGRkJRVkVzUzBGQlN5eFpRVUZNTEVOQlFXdENMRk5CUVd4Q0xFTkJRV1E3UVVGRFFTeFpRVUZOTEZGQlFWRXNTMEZCU3l4WlFVRk1MRU5CUVd0Q0xGTkJRV3hDTEVOQlFXUTdRVUZEUVN4bFFVRlBMRk5CUVZNc1MwRkJWQ3hKUVVGclFpeE5RVUZOTEVsQlFVNHNTMEZCWlN4TlFVRk5MRWxCUVRsRE8wRkJRMFE3TzBGQlJVUTdPenM3TzBGQmVrVnBRanRCUVVGQk8wRkJRVUVzZFVOQk5rVkJPMEZCUVVFN08wRkJRMllzYVVKQlFWTXNaMEpCUVZRc1EwRkJNRUlzVDBGQk1VSXNSVUZCYlVNN1FVRkJRU3hwUWtGQlV5eE5RVUZMTEU5QlFVd3NRMEZCWVN4TFFVRmlMRU5CUVZRN1FVRkJRU3hUUVVGdVF6dEJRVU5CTEdWQlFVOHNaMEpCUVZBc1EwRkJkMElzVlVGQmVFSXNSVUZCYjBNN1FVRkJRU3hwUWtGQlV5eE5RVUZMTEdGQlFVd3NRMEZCYlVJc1MwRkJia0lzUTBGQlZEdEJRVUZCTEZOQlFYQkRPMEZCUTBFc1pVRkJUeXhuUWtGQlVDeERRVUYzUWl4WlFVRjRRaXhGUVVGelF6dEJRVUZCTEdsQ1FVRlRMRTFCUVVzc1dVRkJUQ3hEUVVGclFpeExRVUZzUWl4RFFVRlVPMEZCUVVFc1UwRkJkRU03UVVGRFFTeHBRa0ZCVXl4blFrRkJWQ3hEUVVFd1FpeHJRa0ZCTVVJc1JVRkJPRU03UVVGQlFTeHBRa0ZCVXl4TlFVRkxMRmRCUVV3c1EwRkJhVUlzUzBGQmFrSXNRMEZCVkR0QlFVRkJMRk5CUVRsRE8wRkJRMFE3TzBGQlJVUTdPMEZCY0VacFFqdEJRVUZCT3pzN1FVRXdSbXBDT3p0QlFURkdhVUlzSzBKQk5FWlNMRkZCTlVaUkxFVkJORVp4UXp0QlFVRkJPenRCUVVGQkxGbEJRVzVETEZsQlFXMURMSFZGUVVGd1FpeEpRVUZ2UWp0QlFVRkJMRmxCUVdRc1NVRkJZeXgxUlVGQlVDeExRVUZQT3p0QlFVTndSQ3haUVVGTkxGVkJRVlVzUzBGQlN5eERRVUZNTEVOQlFVOHNWVUZCVUN4RFFVRm9RanRCUVVOQkxGbEJRVWtzVDBGQlNpeEZRVUZoTzBGQlExZ3NZMEZCVFN4alFVRmpMRkZCUVZFc1dVRkJVaXhEUVVGeFFpeFhRVUZ5UWl4RFFVRndRanM3UVVGRlFTeGpRVUZKTEV0QlFVc3NWMEZCVEN4RFFVRnBRaXhSUVVGcVFpeEZRVUV5UWl4WFFVRXpRaXhEUVVGS0xFVkJRVFpETzBGQlF6TkRPMEZCUTBRN08wRkJSVVFzYTBKQlFWRXNVMEZCVWl4RFFVRnJRaXhOUVVGc1FpeERRVUY1UWl4VFFVRjZRanM3UVVGRlFUdEJRVU5CTEdsQ1FVRlBMRTlCUVZBc1EwRkJaU3haUVVGbUxFTkJRVFJDTEVWQlFVVXNUVUZCVFN4WFFVRlNMRVZCUVRWQ0xFVkJRVzFFTEZkQlFXNUVMRVZCUVdkRkxFOUJRVThzVVVGQlVDeERRVUZuUWl4SlFVRm9SanM3UVVGRlFTeGxRVUZMTEdkQ1FVRk1MRU5CUVhOQ0xGZEJRWFJDTEVWQlFXMURMR2xDUVVGTkxFbEJRWHBETzBGQlEwUTdPMEZCUlVRc1lVRkJTeXhuUWtGQlRDeERRVUZ6UWl4UlFVRjBRaXhGUVVGblF5eHBRa0ZCVFN4SlFVRjBRenM3UVVGRlFTeHpRa0ZCWXl4UlFVRmtPenRCUVVWQk8wRkJRMEVzV1VGQlRTeFZRVUZWTEV0QlFVc3NRMEZCVEN4clFrRkJjMElzVVVGQmRFSXNVVUZCYUVJN08wRkJSVUVzWjBKQlFWRXNVMEZCVWl4RFFVRnJRaXhIUVVGc1FpeERRVUZ6UWl4VFFVRjBRanM3UVVGRlFUdEJRVU5CTEZsQlFVMHNXVUZCV1N4TFFVRkxMRmxCUVV3c1EwRkJhMElzVVVGQmJFSXNRMEZCYkVJN08wRkJSVUU3UVVGRFFTeFpRVUZKTEdGQlFXRXNWVUZCVlN4WFFVRldMRVZCUVdwQ0xFVkJRVEJETzBGQlEzaERMRzlDUVVGVkxGbEJRVlk3UVVGRFJEdEJRVU5FT3p0QlFVVkJMRmxCUVVrc1QwRkJTaXhGUVVGaE8wRkJRMWdzWTBGQlRTeGxRVUZqTEZGQlFWRXNXVUZCVWl4RFFVRnhRaXhYUVVGeVFpeERRVUZ3UWp0QlFVTkJPMEZCUTBFc2EwSkJRVkVzU1VGQlVpeEhRVUZsTEVsQlFXWTdRVUZEUVN4clFrRkJVU3huUWtGQlVpeEhRVUV5UWl4WlFVRXpRanM3UVVGRlFTeGpRVUZOTEhGQ1FVRnhRaXhUUVVGeVFpeHJRa0ZCY1VJc1IwRkJUVHRCUVVNdlFpeG5Ra0ZCU1N4UlFVRlJMRk5CUVZJc1EwRkJhMElzVVVGQmJFSXNRMEZCTWtJc1UwRkJNMElzUTBGQlNpeEZRVUV5UXp0QlFVTjZReXh6UWtGQlVTeFRRVUZTTEVOQlFXdENMRTFCUVd4Q0xFTkJRWGxDTEZOQlFYcENPMEZCUTBRN08wRkJSVVFzYjBKQlFWRXNVMEZCVWl4RFFVRnJRaXhOUVVGc1FpeERRVUY1UWl4UlFVRlJMRWxCUVZJc1IwRkJaU3hWUVVGbUxFZEJRVFJDTEZkQlFYSkVPenRCUVVWQkxHMUNRVUZMTEdkQ1FVRk1MRU5CUVhOQ0xGZEJRWFJDTEVWQlFXMURMR2xDUVVGTkxFdEJRWHBETzBGQlEwRXNiVUpCUVVzc1owSkJRVXdzUTBGQmMwSXNVVUZCVVN4blFrRkJPVUlzUlVGQlowUXNhVUpCUVUwc1RVRkJkRVE3TzBGQlJVRXNiMEpCUVZFc2JVSkJRVklzUTBGQk5FSXNhVUpCUVUwc1lVRkJiRU1zUlVGQmFVUXNhMEpCUVdwRU8wRkJRMFFzVjBGWVJEczdRVUZoUVN4alFVRkpMRXRCUVVzc1QwRkJUQ3hEUVVGaExGbEJRV3BDTEVWQlFTdENPMEZCUXpkQ0xHOUNRVUZSTEdkQ1FVRlNMRU5CUVhsQ0xHbENRVUZOTEdGQlFTOUNMRVZCUVRoRExHdENRVUU1UXp0QlFVTkJMRzlDUVVGUkxGTkJRVklzUTBGQmEwSXNSMEZCYkVJc1EwRkJjMElzVTBGQmRFSTdRVUZEUkN4WFFVaEVMRTFCUjA4N1FVRkRURHRCUVVORU96dEJRVVZFTEd0Q1FVRlJMRk5CUVZJc1EwRkJhMElzUjBGQmJFSXNRMEZCYzBJc1QwRkJUeXhWUVVGUUxFZEJRVzlDTEZkQlFURkRPMEZCUTBRN1FVRkRSanRCUVROS1owSTdRVUZCUVR0QlFVRkJMSGxEUVRaS1JTeFJRVGRLUml4RlFUWktXVHRCUVVNelFpeFpRVUZKTEVOQlFVTXNTMEZCU3l4WlFVRk1MRU5CUVd0Q0xGRkJRV3hDTEVOQlFVd3NSVUZCYTBNN1FVRkRhRU1zWlVGQlN5eExRVUZNTEVOQlFWY3NTVUZCV0N4RFFVRm5RaXh0UWtGQlV5eFJRVUZVTEVOQlFXaENPMEZCUTBRN1FVRkRSanRCUVdwTFowSTdRVUZCUVR0QlFVRkJMRzFEUVcxTFNpeFJRVzVMU1N4RlFXMUxUVHRCUVVOeVFpeGxRVUZQTEV0QlFVc3NTMEZCVEN4RFFVRlhMRWxCUVZnc1EwRkJaMEk3UVVGQlFTeHBRa0ZCVVN4TFFVRkxMRWxCUVV3c1MwRkJZeXhSUVVGMFFqdEJRVUZCTEZOQlFXaENMRU5CUVZBN1FVRkRSRHRCUVhKTFowSTdRVUZCUVR0QlFVRkJMRzlEUVhWTFNDeFRRWFpMUnl4RlFYVkxVVHRCUVVOMlFpeGxRVUZQTEV0QlFVc3NTMEZCVEN4RFFVRlhMRTFCUVZnc1EwRkJhMEk3UVVGQlFTeHBRa0ZCVVN4VlFVRlZMRTlCUVZZc1EwRkJhMElzUzBGQlN5eEpRVUYyUWl4SlFVRXJRaXhEUVVGRExFTkJRWGhETzBGQlFVRXNVMEZCYkVJc1EwRkJVRHRCUVVORU8wRkJla3RuUWp0QlFVRkJPMEZCUVVFc2MwTkJNa3RFTEVkQk0wdERMRVZCTWt0Sk8wRkJRMjVDTEdWQlFVOHNTVUZCU1N4TFFVRktMRU5CUVZVc1IwRkJWaXhGUVVGbExFZEJRV1lzUTBGQmJVSTdRVUZCUVN4cFFrRkJVU3hMUVVGTExFbEJRVXdzUlVGQlVqdEJRVUZCTEZOQlFXNUNMRU5CUVZBN1FVRkRSRHRCUVRkTFowSTdRVUZCUVR0QlFVRkJMR2REUVN0TFVDeFJRUzlMVHl4RlFTdExSenRCUVVOc1FpeFpRVUZKTEV0QlFVc3NhVUpCUVV3c1MwRkJNa0lzUjBGQkwwSXNSVUZCYjBNN1FVRkRiRU03UVVGRFFTeGxRVUZMTEV0QlFVd3NRMEZCVnl4UFFVRllMRU5CUVcxQ0xGVkJRVU1zU1VGQlJDeEZRVUZWTzBGQlF6TkNMR2xDUVVGTExHZENRVUZNTEVOQlFYTkNMRkZCUVhSQ08wRkJRMFFzVjBGR1JEdEJRVWRCTzBGQlEwUTdPMEZCUlVRc1dVRkJUU3hoUVVGaExFdEJRVXNzWVVGQlRDeERRVUZ0UWl4TFFVRkxMR1ZCUVV3c1EwRkJjVUlzUzBGQlN5eHBRa0ZCTVVJc1EwRkJia0lzUlVGQmFVVXNTVUZCYWtVc1EwRkJia0k3UVVGRFFTeHRRa0ZCVnl4UFFVRllMRU5CUVcxQ0xGVkJRVU1zU1VGQlJDeEZRVUZWTzBGQlF6TkNMR1ZCUVVzc1owSkJRVXdzUTBGQmMwSXNVVUZCZEVJN1FVRkRSQ3hUUVVaRU8wRkJSMEVzWVVGQlN5eHBRa0ZCVEN4SFFVRjVRaXhKUVVGNlFqdEJRVU5FTzBGQk4weG5RanRCUVVGQk8wRkJRVUVzYTBOQksweE1MRmxCTDB4TExFVkJLMHhuUXp0QlFVRkJMRmxCUVhaQ0xHTkJRWFZDTEhWRlFVRk9MRWxCUVUwN08wRkJReTlETEZsQlFVMHNZVUZCWVN4TFFVRkxMR0ZCUVV3c1EwRkJiVUlzUzBGQlN5eGxRVUZNTEVOQlFYRkNMRXRCUVVzc2FVSkJRVEZDTEVOQlFXNUNMRVZCUVdsRkxFbEJRV3BGTEVOQlFXNUNPMEZCUTBFc2JVSkJRVmNzVDBGQldDeERRVUZ0UWl4VlFVRkRMRWxCUVVRc1JVRkJWVHRCUVVNelFpeGxRVUZMTEZkQlFVd3NRMEZCYVVJc1dVRkJha0k3UVVGRFFTeGpRVUZKTEU5QlFVOHNZMEZCVUN4TFFVRXdRaXhWUVVFNVFpeEZRVUV3UXp0QlFVTjRReXhwUWtGQlN5eHRRa0ZCVEN4RFFVRjVRaXhqUVVGNlFqdEJRVU5FTzBGQlEwWXNVMEZNUkR0QlFVMUJMR0ZCUVVzc2FVSkJRVXdzUjBGQmVVSXNTVUZCZWtJN1FVRkRSRHRCUVhoTlowSTdRVUZCUVR0QlFVRkJMSFZEUVRCTlFTeFJRVEZOUVN4RlFUQk5WU3hUUVRGTlZpeEZRVEJOZVVNN1FVRkJRU3haUVVGd1FpeFhRVUZ2UWl4MVJVRkJUaXhKUVVGTk96dEJRVU40UkN4WlFVRk5MRmxCUVZrc1MwRkJTeXhaUVVGTUxFTkJRV3RDTEZGQlFXeENMRU5CUVd4Q08wRkJRMEVzV1VGQlNTeFRRVUZLTEVWQlFXVTdRVUZEWWl4dlFrRkJWU3hoUVVGV0xFTkJRWGRDTEZOQlFYaENMRVZCUVcxRExGZEJRVzVETzBGQlEwUTdRVUZEUmp0QlFTOU5aMEk3UVVGQlFUdEJRVUZCTERoQ1FXbE9WQ3hMUVdwT1V5eEZRV2xPUmp0QlFVTmlMRmxCUVUwc1YwRkJWeXhOUVVGTkxFMUJRVTRzUTBGQllTeFpRVUZpTEVOQlFUQkNMR1ZCUVRGQ0xFTkJRV3BDTzBGQlEwRXNXVUZCVFN4WFFVRlhMRVZCUVVVc1RVRkJUU3hOUVVGT0xFTkJRV0VzV1VGQllpeERRVUV3UWl4bFFVRXhRaXhOUVVFclF5eE5RVUZxUkN4RFFVRnFRanM3UVVGRlFTeFpRVUZKTEZGQlFVb3NSVUZCWXp0QlFVTmFMR05CUVVrc1lVRkJZU3hQUVVGcVFpeEZRVUV3UWp0QlFVTjRRanRCUVVOQkxHMUNRVUZQTEU5QlFWQXNRMEZCWlN4SlFVRm1PMEZCUTBFN1FVRkRSRHM3UVVGRlJEczdPenM3UVVGTFFTeGpRVUZKTEV0QlFVc3NUMEZCVEN4RFFVRmhMRTlCUVdwQ0xFVkJRVEJDTzBGQlEzaENMR2xDUVVGTExFOUJRVXdzUTBGQllTeFJRVUZpTzBGQlEwUXNWMEZHUkN4TlFVVlBPMEZCUTB3c2FVSkJRVXNzVVVGQlRDeERRVUZqTEZGQlFXUXNSVUZCZDBJc1NVRkJlRUlzUlVGQk9FSXNVVUZCT1VJN1FVRkRSRHRCUVVOR08wRkJRMFk3UVVGMlQyZENPMEZCUVVFN1FVRkJRU3h6UTBGNVQxTTdRVUZCUVN4WlFVRmFMRXRCUVZrc2RVVkJRVW9zUlVGQlNUczdRVUZEZUVJc1dVRkJUU3hYUVVGWExFMUJRVTBzUzBGQlRpeEhRVUZqTEUxQlFVMHNTMEZCVGl4RFFVRlpMRWxCUVRGQ0xFZEJRV2xETEVsQlFXeEVPMEZCUTBFc1dVRkJTU3hEUVVGRExGRkJRVXdzUlVGQlpUdEJRVU5pTzBGQlEwUTdPMEZCUlVRc1lVRkJTeXhSUVVGTUxFTkJRV01zVVVGQlpDeEZRVUYzUWl4SlFVRjRRaXhGUVVFNFFpeEpRVUU1UWp0QlFVTkVPMEZCYUZCblFqdEJRVUZCTzBGQlFVRXNjVU5CYTFCR08wRkJRMklzV1VGQlRTeFRRVUZUTEVOQlFVTXNTMEZCU3l4UFFVRk1MRXRCUVdsQ0xFdEJRVXNzVDBGQlRDeEhRVUZsTEV0QlFXWXNRMEZCY1VJc1IwRkJja0lzUTBGQmFrSXNSMEZCTmtNc1JVRkJPVU1zUlVGQmEwUXNUVUZCYkVRc1EwRkJlVVE3UVVGQlFTeHBRa0ZCU3l4RlFVRkZMRTFCUVVZc1IwRkJWeXhEUVVGb1FqdEJRVUZCTEZOQlFYcEVMRU5CUVdZN1FVRkRRU3haUVVGSkxFOUJRVThzVFVGQlVDeEhRVUZuUWl4RFFVRndRaXhGUVVGMVFqdEJRVU55UWp0QlFVTkJMR2xDUVVGUExFdEJRVkE3UVVGRFJEczdRVUZGUkN4aFFVRkxMR2RDUVVGTUxFTkJRWE5DTEZkQlFYUkNMRVZCUVcxRExHbENRVUZOTEVsQlFYcERMRVZCUVN0RExFMUJRUzlET3p0QlFVVkJMRmxCUVUwc1ZVRkJWU3hMUVVGTExHVkJRVXdzUlVGQmFFSTdRVUZEUVN4WlFVRkpMRTlCUVVvc1JVRkJZVHRCUVVOWUxHVkJRVXNzVVVGQlRDeERRVUZqTEU5QlFXUTdRVUZEUkR0QlFVTkdPenRCUVVWRU96czdPMEZCYWxGcFFqdEJRVUZCTzBGQlFVRXNiME5CYjFGSU8wRkJRVUU3TzBGQlExb3NXVUZCVFN4UlFVRlJMRk5CUVZNc1owSkJRVlFzUTBGQk1FSXNZVUZCTVVJc1EwRkJaRHM3UVVGRlFTeFpRVUZKTEVOQlFVTXNTMEZCVEN4RlFVRlpPMEZCUTFZN1FVRkRSRHM3UVVGRlJDeGpRVUZOTEU5QlFVNHNRMEZCWXl4VlFVRkRMRWxCUVVRc1JVRkJWVHRCUVVOMFFpeGpRVUZKTEZkQlFWY3NTMEZCU3l4WlFVRk1MRU5CUVd0Q0xGZEJRV3hDTEVOQlFXWTdRVUZEUVRzN096dEJRVWxCTEdOQlFVa3NRMEZCUXl4UlFVRk1MRVZCUVdVN1FVRkRZaXgxUWtGQlZ5eExRVUZMTEZGQlFXaENPMEZCUTBRN08wRkJSVVFzYVVKQlFVc3NhMEpCUVV3c1EwRkJkMElzVVVGQmVFSTdRVUZEUkN4VFFWaEVPMEZCV1VRN1FVRjJVbWRDTzBGQlFVRTdRVUZCUVN3MlFrRjVVbFlzVVVGNlVsVXNSVUY1VW5GQ08wRkJRVUVzV1VGQmNrSXNXVUZCY1VJc2RVVkJRVTRzU1VGQlRUczdRVUZEY0VNc1lVRkJTeXhwUWtGQlRDeEhRVUY1UWl4UlFVRjZRanM3UVVGRlFTeFpRVUZKTEdkQ1FVRm5RaXhoUVVGaExFZEJRV3BETEVWQlFYTkRPMEZCUTNCRExHVkJRVXNzYTBKQlFVd3NRMEZCZDBJc1VVRkJlRUk3UVVGRFJEczdRVUZGUkN4bFFVRlBMRWxCUVZBN1FVRkRSRHRCUVdwVFowSTdRVUZCUVR0QlFVRkJMRGhDUVcxVFpUdEJRVUZCTEZsQlFURkNMR2RDUVVFd1FpeDFSVUZCVUN4TFFVRlBPenRCUVVNNVFqdEJRVU5CTEZsQlFVa3NTMEZCU3l4UFFVRlVMRVZCUVd0Q08wRkJRMmhDTEdkQ1FVRk5MRWxCUVVrc1MwRkJTaXhEUVVGaExFbEJRV0lzZVVOQlFVNDdRVUZEUkRzN1FVRkZSQ3hoUVVGTExFOUJRVXdzUjBGQlpTeEpRVUZtT3p0QlFVVkJPMEZCUTBFc1dVRkJTU3hQUVVGUExFOUJRVmdzUlVGQmIwSTdRVUZEYkVJc05rSkJRVzFDTEVsQlFXNUNPMEZCUTBRN08wRkJSVVFzV1VGQlNTeFhRVUZYTEV0QlFVc3NaVUZCVEN4RlFVRm1PMEZCUTBFc1dVRkJTU3hEUVVGRExFdEJRVXNzV1VGQlRDeERRVUZyUWl4UlFVRnNRaXhEUVVGTUxFVkJRV3RETzBGQlEyaERMSEZDUVVGWExFdEJRVXNzVDBGQlRDeERRVUZoTEZkQlFYaENPMEZCUTBRN08wRkJSVVFzV1VGQlNTeHZRa0ZCYjBJc1EwRkJReXhMUVVGTExFOUJRVXdzUTBGQllTeFhRVUYwUXl4RlFVRnRSRHRCUVVOcVJDeG5Ra0ZCVFN4SlFVRkpMRXRCUVVvc1EwRkJZU3hKUVVGaUxESkVRVUZPTzBGQlEwUTdPMEZCUlVRN096czdRVUZKUVN4WlFVRkpMRXRCUVVzc1QwRkJUQ3hEUVVGaExFOUJRV3BDTEVWQlFUQkNPMEZCUTNoQ0xHVkJRVXNzVDBGQlRDeERRVUZoTEZGQlFXSTdRVUZEUkRzN1FVRkZSQ3hoUVVGTExGRkJRVXdzUTBGQll5eHRRa0ZCYlVJc1MwRkJTeXhQUVVGTUxFTkJRV0VzVjBGQmFFTXNSMEZCT0VNc1VVRkJOVVE3UVVGRFJEczdRVUZGUkRzN1FVRndWV2xDTzBGQlFVRTdRVUZCUVN4dlEwRnhWVWtzVDBGeVZVb3NSVUZ4VldFN1FVRkROVUlzWlVGQlR5eEpRVUZKTEV0QlFVb3NRMEZCVlN4UFFVRldMRU5CUVZBN1FVRkRSRHRCUVhaVlowSTdRVUZCUVR0QlFVRkJMREJDUVhOR1NUdEJRVU51UWl4bFFVRlZMRWxCUVZZc1UwRkJhMElzVDBGQmJFSTdRVUZEUkR0QlFYaEdaMEk3TzBGQlFVRTdRVUZCUVRzN1FVRXdWVzVDTEZOQlFVOHNTMEZCVUR0QlFVTkVMRU5CTTFWaExFVkJRV1E3TzJ0Q1FUWlZaU3hMT3pzN096czdPenM3T3p0eGFrSkRkRlptT3pzN096czdRVUZOUVRzN1FVRkRRVHM3T3p0QlFVVkJMRWxCUVUwc1QwRkJVU3haUVVGTk8wRkJRMnhDT3pzN096czdRVUZOUVN4TlFVRk5MRTlCUVU4c1RVRkJZanRCUVVOQkxFMUJRVTBzVlVGQlZTeFBRVUZvUWpzN1FVRkZRU3hOUVVGTkxHOUNRVUZ2UWl4cFFrRkJNVUk3TzBGQlJVRTdPenM3T3p0QlFWcHJRaXhOUVd0Q1dpeEpRV3hDV1R0QlFXMUNhRUk3T3pzN1FVRkpRU3hyUWtGQldTeFJRVUZhTEVWQlFYTkNPMEZCUVVFN08wRkJRM0JDTEZkQlFVc3NTVUZCVEN4SFFVRlpMRkZCUVZvN1FVRkRRU3hYUVVGTExFMUJRVXdzUjBGQll5eEZRVUZrTzBGQlEwRXNWMEZCU3l4WlFVRk1MRWRCUVc5Q0xFbEJRWEJDTzBGQlEwRXNWMEZCU3l4alFVRk1MRWRCUVhOQ0xFbEJRWFJDTzBGQlEwUTdPMEZCUlVRN08wRkJPVUpuUWp0QlFVRkJPenM3UVVGdlEyaENPenM3TzBGQmNFTm5RaXhyUTBGM1EwbzdRVUZEVml4bFFVRlBMRXRCUVVzc1RVRkJXanRCUVVORU96dEJRVVZFT3pzN096dEJRVFZEWjBJN1FVRkJRVHRCUVVGQkxHOURRV2RFUmp0QlFVTmFMR1ZCUVU4c1MwRkJTeXhaUVVGYU8wRkJRMFE3TzBGQlJVUTdPenM3TzBGQmNFUm5RanRCUVVGQk8wRkJRVUVzTUVOQmQwUkpPMEZCUTJ4Q0xHVkJRVThzUzBGQlN5eGpRVUZhTzBGQlEwUTdRVUV4UkdVN1FVRkJRVHRCUVVGQkxIRkRRVFJFUkR0QlFVRkJPenRCUVVOaUxGbEJRVTBzWTBGQll5eFRRVUZUTEdGQlFWUXNhMEpCUVhORExFdEJRVXNzU1VGQk0wTXNVVUZCY0VJN08wRkJSVUVzTmtKQlFWTXNTMEZCU3l4WFFVRk1MRVZCUVZRc1JVRkJOa0lzVlVGQlF5eFJRVUZFTEVWQlFXTTdRVUZEZWtNc1kwRkJTU3hUUVVGVExHZENRVUZWTEU5QlFWWXNSVUZCYlVJc1VVRkJia0lzUlVGQk5rSXNVVUZCTjBJc1JVRkJkVU03UVVGRGJFUXNaMEpCUVVrc1VVRkJTaXhGUVVGak8wRkJRMW9zYjBKQlFVMHNTVUZCVGl4RFFVRlhMRkZCUVZnc1JVRkJjVUlzVDBGQmNrSXNRMEZCTmtJc1ZVRkJReXhGUVVGRUxFVkJRVkU3UVVGRGJrTXNiVUpCUVVjc1UwRkJTQ3hIUVVGbExGRkJRV1k3UVVGRFJDeGxRVVpFTzBGQlIwUXNZVUZLUkN4TlFVbFBPMEZCUTB3c2MwSkJRVkVzVTBGQlVpeEhRVUZ2UWl4UlFVRndRanRCUVVORU8wRkJRMFlzVjBGU1JEczdRVUZWUVN4alFVRkpMRTFCUVVzc2FVSkJRVXdzUlVGQlNpeEZRVUU0UWp0QlFVTTFRaXh4UWtGQlV5eE5RVUZMTEdsQ1FVRk1MRVZCUVZRN1FVRkRSRHM3UVVGRlJDeHBRa0ZCVHl4WFFVRlFMRVZCUVc5Q0xGRkJRWEJDTEVWQlFUaENMRmxCUVZrc1owSkJRVm9zUTBGQk5rSXNhVUpCUVRkQ0xFTkJRVGxDTzBGQlEwUXNVMEZvUWtRc1JVRm5Ra2NzU1VGb1FrZzdRVUZwUWtRN08wRkJSVVE3TzBGQlJVRTdPenM3TzBGQmNFWm5RanRCUVVGQk8wRkJRVUVzZFVOQmQwWkRMRlZCZUVaRUxFVkJkMFpoTzBGQlF6TkNMR0ZCUVVzc1RVRkJUQ3hEUVVGWkxFbEJRVm9zUTBGQmFVSXNWVUZCYWtJN1FVRkRSRHM3UVVGRlJEczdPenM3TzBGQk5VWm5RanRCUVVGQk8wRkJRVUVzYTBOQmFVZEtMRmxCYWtkSkxFVkJhVWRWTzBGQlEzaENMRmxCUVVrc1QwRkJUeXhaUVVGUUxFdEJRWGRDTEZGQlFUVkNMRVZCUVhORE8wRkJRM0JETEdkQ1FVRk5MRWxCUVVrc1MwRkJTaXhEUVVGVkxHbEVRVUZuUkN4WlFVRm9SQ3g1UTBGQlowUXNXVUZCYUVRc1MwRkJLMFFzVjBGQmVrVXNRMEZCVGp0QlFVTkVPMEZCUTBRc1lVRkJTeXhaUVVGTUxFZEJRVzlDTEZsQlFYQkNPMEZCUTBRN08wRkJSVVE3T3pzN08wRkJlRWRuUWp0QlFVRkJPMEZCUVVFc01FTkJORWRKTEdOQk5VZEtMRVZCTkVkdlFqdEJRVU5zUXl4WlFVRkpMRTlCUVU4c1kwRkJVQ3hMUVVFd1FpeFZRVUU1UWl4RlFVRXdRenRCUVVONFF5eG5Ra0ZCVFN4SlFVRkpMRXRCUVVvc1EwRkJWU3c0UkVGQk5rUXNZMEZCTjBRc2VVTkJRVFpFTEdOQlFUZEVMRXRCUVRoRkxGZEJRWGhHTEVOQlFVNDdRVUZEUkR0QlFVTkVMR0ZCUVVzc1kwRkJUQ3hIUVVGelFpeGpRVUYwUWp0QlFVTkVPenRCUVVWRU96czdPenM3UVVGdVNHZENPMEZCUVVFN1FVRkJRU3h2UTBGM1NFWXNVMEY0U0VVc1JVRjNTREpDTzBGQlFVRTdPMEZCUVVFc1dVRkJiRUlzVjBGQmEwSXNkVVZCUVVvc1JVRkJTVHM3UVVGRGVrTXNXVUZCVFN4M1FrRkJjMElzVlVGQlZTeE5RVUZXTEVOQlFXbENMRU5CUVdwQ0xFVkJRVzlDTEZkQlFYQkNMRVZCUVhSQ0xFZEJRVEJFTEZWQlFWVXNTMEZCVml4RFFVRm5RaXhEUVVGb1FpeERRVUZvUlRzN1FVRkZRU3hoUVVGTExFMUJRVXdzUTBGQldTeFBRVUZhTEVOQlFXOUNMRlZCUVVNc1MwRkJSQ3hGUVVGWE8wRkJRemRDTEdOQlFVMHNZVUZCWVN4TlFVRk5MRk5CUVU0c1EwRkJia0k3UVVGRFFTeGpRVUZOTEd0Q1FVRnJRaXhOUVVGTkxHTkJRVTRzUTBGQmVFSTdRVUZEUVN4alFVRkpMRTlCUVU4c1ZVRkJVQ3hMUVVGelFpeFZRVUV4UWl4RlFVRnpRenRCUVVOd1F5eDFRa0ZCVnl4TFFVRllMRk5CUVhWQ0xGZEJRWFpDTzBGQlEwUTdPMEZCUlVRN1FVRkRRU3hqUVVGSkxFOUJRVThzWlVGQlVDeExRVUV5UWl4VlFVRXZRaXhGUVVFeVF6dEJRVU42UXl3MFFrRkJaMElzUzBGQmFFSXNVMEZCTkVJc1YwRkJOVUk3UVVGRFJEdEJRVU5HTEZOQldFUTdPMEZCWVVFc2VVTkJRV3RDTEZOQlFXeENMRVZCUVRaQ0xFdEJRVXNzU1VGQmJFTXNSVUZCZDBNc1YwRkJlRU03UVVGRFJEdEJRWHBKWlR0QlFVRkJPMEZCUVVFc01FSkJaME5MTzBGQlEyNUNMR1ZCUVZVc1NVRkJWaXhUUVVGclFpeFBRVUZzUWp0QlFVTkVPMEZCYkVObE96dEJRVUZCTzBGQlFVRTdPMEZCTkVsc1FpeFRRVUZQTEVsQlFWQTdRVUZEUkN4RFFUZEpXU3hGUVVGaU96dHJRa0VyU1dVc1NUczdPenM3T3pzN08wRkRiRXBtT3pzN08wRkJRMEU3T3pzN1FVRkRRVHM3T3p0QlFVZEJPenM3TzBGQlEwRTdPenM3UVVGRFFUczdPenRCUVVOQk96czdPMEZCUTBFN096czdRVUZEUVRzN096dEJRVU5CT3pzN08wRkJRMEU3T3pzN1FVRkRRVHM3T3p0QlFVTkJPenM3TzBGQlEwRTdPenM3UVVGRFFUczdPenRCUVVOQk96czdPenM3UVVGMlFrRTdPenM3T3p0QlFYbENRU3hKUVVGTkxFMUJRVTBzUlVGQldqczdRVUZGUVRzN096czdPenRCUVdwQ1FUdEJRWE5DUVN4SlFVRkpMRXRCUVVvc1IwRkJXU3hWUVVGRExFOUJRVVFzUlVGQllUdEJRVU4yUWl4TlFVRkpMRTlCUVU4c1NVRkJTU3hOUVVGWUxFdEJRWE5DTEZkQlFURkNMRVZCUVhWRE8wRkJRM0pETEZGQlFVa3NUVUZCU2l4SFFVRmhMR2RDUVVGTkxHRkJRVTRzUTBGQmIwSXNUMEZCY0VJc1EwRkJZanRCUVVORU8wRkJRMFFzVTBGQlR5eEpRVUZKTEUxQlFWZzdRVUZEUkN4RFFVeEVPenRCUVU5Qk96czdPenRCUVV0QkxFbEJRVWtzU1VGQlNpeEhRVUZYTEdWQlFVc3NZVUZCYUVJN08wRkJSVUU3T3pzN08wRkJTMEVzU1VGQlNTeFBRVUZLTEVkQlFXTXNhMEpCUVZFc1lVRkJkRUk3TzBGQlJVRTdPenM3TzBGQlMwRXNTVUZCU1N4WlFVRktMRWRCUVcxQ0xIVkNRVUZoTEdGQlFXaERPenRCUVVWQk96czdPenRCUVV0QkxFbEJRVWtzVFVGQlNpeEhRVUZoTEZWQlFVTXNUMEZCUkN4RlFVRmhPMEZCUTNoQ0xFMUJRVWtzVVVGQlVTeEpRVUZTTEV0QlFXbENMR2xDUVVGUExGVkJRVkFzUlVGQmNrSXNSVUZCTUVNN1FVRkRlRU03UVVGRFFTeFhRVUZQTEdsQ1FVRlBMR0ZCUVZBc1EwRkJjVUlzVDBGQmNrSXNRMEZCVUR0QlFVTkVPenRCUVVWRUxFMUJRVWtzVVVGQlVTeEpRVUZTTEV0QlFXbENMR3RDUVVGUkxGVkJRVklzUlVGQmNrSXNSVUZCTWtNN1FVRkRla003UVVGRFFTeFhRVUZQTEd0Q1FVRlJMR0ZCUVZJc1EwRkJjMElzVDBGQmRFSXNRMEZCVUR0QlFVTkVPenRCUVVWRUxFMUJRVWtzVVVGQlVTeEpRVUZTTEV0QlFXbENMR2xDUVVGaExGVkJRV0lzUlVGQmNrSXNSVUZCWjBRN1FVRkRPVU03UVVGRFFTeFhRVUZQTEdsQ1FVRmhMR0ZCUVdJc1EwRkJNa0lzVDBGQk0wSXNRMEZCVUR0QlFVTkVPenRCUVVWRU8wRkJRMEVzVTBGQlR5eHBRa0ZCVHl4aFFVRlFMRU5CUVhGQ0xFOUJRWEpDTEVOQlFWQTdRVUZEUkN4RFFXeENSRHM3UVVGdlFrRTdPenM3TzBGQlMwRXNTVUZCU1N4UlFVRktMRWRCUVdVc2JVSkJRVk1zWVVGQmVFSTdPMEZCUlVFN096czdPMEZCUzBFc1NVRkJTU3hUUVVGS0xFZEJRV2RDTEc5Q1FVRlZMR0ZCUVRGQ096dEJRVWRCT3pzN096dEJRVXRCTEVsQlFVa3NSMEZCU2l4SFFVRlZMR05CUVVrc1lVRkJaRHM3UVVGRlFUczdPenM3UVVGTFFTeEpRVUZKTEZGQlFVb3NSMEZCWlN4dFFrRkJVeXhoUVVGNFFqczdRVUZGUVRzN096czdRVUZMUVN4SlFVRkpMRTFCUVVvc1IwRkJZU3hwUWtGQlR5eGhRVUZ3UWpzN1FVRkZRVHM3T3pzN1FVRkxRU3hKUVVGSkxGTkJRVW9zUjBGQlowSXNiMEpCUVZVc1lVRkJNVUk3TzBGQlJVRTdPenM3TzBGQlMwRXNTVUZCU1N4UlFVRktMRWRCUVdVc1ZVRkJReXhQUVVGRUxFVkJRV0U3UVVGRE1VSXNUVUZCU1N4UlFVRlJMRTFCUVZvc1JVRkJiMEk3UVVGRGJFSTdRVUZEUVN4WFFVRlBMR2xDUVVGbExHRkJRV1lzUTBGQk5rSXNUMEZCTjBJc1EwRkJVRHRCUVVORU96dEJRVVZFTzBGQlEwRXNVMEZCVHl4dFFrRkJVeXhoUVVGVUxFTkJRWFZDTEU5QlFYWkNMRU5CUVZBN1FVRkRSQ3hEUVZKRU96dEJRVlZCTzBGQlEwRXNUMEZCVHl4TlFVRlFMRWRCUVdkQ0xFZEJRV2hDT3p0clFrRkZaU3hISWl3aVptbHNaU0k2SW1kbGJtVnlZWFJsWkM1cWN5SXNJbk52ZFhKalpWSnZiM1FpT2lJaUxDSnpiM1Z5WTJWelEyOXVkR1Z1ZENJNld5SW9ablZ1WTNScGIyNGdaU2gwTEc0c2NpbDdablZ1WTNScGIyNGdjeWh2TEhVcGUybG1LQ0Z1VzI5ZEtYdHBaaWdoZEZ0dlhTbDdkbUZ5SUdFOWRIbHdaVzltSUhKbGNYVnBjbVU5UFZ3aVpuVnVZM1JwYjI1Y0lpWW1jbVZ4ZFdseVpUdHBaaWdoZFNZbVlTbHlaWFIxY200Z1lTaHZMQ0V3S1R0cFppaHBLWEpsZEhWeWJpQnBLRzhzSVRBcE8zWmhjaUJtUFc1bGR5QkZjbkp2Y2loY0lrTmhibTV2ZENCbWFXNWtJRzF2WkhWc1pTQW5YQ0lyYnl0Y0lpZGNJaWs3ZEdoeWIzY2daaTVqYjJSbFBWd2lUVTlFVlV4RlgwNVBWRjlHVDFWT1JGd2lMR1o5ZG1GeUlHdzlibHR2WFQxN1pYaHdiM0owY3pwN2ZYMDdkRnR2WFZzd1hTNWpZV3hzS0d3dVpYaHdiM0owY3l4bWRXNWpkR2x2YmlobEtYdDJZWElnYmoxMFcyOWRXekZkVzJWZE8zSmxkSFZ5YmlCektHNC9ianBsS1gwc2JDeHNMbVY0Y0c5eWRITXNaU3gwTEc0c2NpbDljbVYwZFhKdUlHNWJiMTB1Wlhod2IzSjBjMzEyWVhJZ2FUMTBlWEJsYjJZZ2NtVnhkV2x5WlQwOVhDSm1kVzVqZEdsdmJsd2lKaVp5WlhGMWFYSmxPMlp2Y2loMllYSWdiejB3TzI4OGNpNXNaVzVuZEdnN2J5c3JLWE1vY2x0dlhTazdjbVYwZFhKdUlITjlLU0lzSW1WNGNHOXlkQ0JtZFc1amRHbHZiaUJrYVhOd1lYUmphRmRwYmtSdlkwVjJaVzUwS0dWMlpXNTBUbUZ0WlN3Z2JXOWtkV3hsVG1GdFpTd2daR1YwWVdsc0lEMGdlMzBwSUh0Y2JpQWdZMjl1YzNRZ1puVnNiRVYyWlc1MFRtRnRaU0E5SUdBa2UyVjJaVzUwVG1GdFpYMHVjR2d1Skh0dGIyUjFiR1ZPWVcxbGZXQmNiaUFnZDJsdVpHOTNMbVJwYzNCaGRHTm9SWFpsYm5Rb2JtVjNJRU4xYzNSdmJVVjJaVzUwS0daMWJHeEZkbVZ1ZEU1aGJXVXNJSHNnWkdWMFlXbHNJSDBwS1Z4dUlDQmtiMk4xYldWdWRDNWthWE53WVhSamFFVjJaVzUwS0c1bGR5QkRkWE4wYjIxRmRtVnVkQ2htZFd4c1JYWmxiblJPWVcxbExDQjdJR1JsZEdGcGJDQjlLU2xjYm4xY2JseHVaWGh3YjNKMElHWjFibU4wYVc5dUlHUnBjM0JoZEdOb1JXeGxiV1Z1ZEVWMlpXNTBLR1J2YlVWc1pXMWxiblFzSUdWMlpXNTBUbUZ0WlN3Z2JXOWtkV3hsVG1GdFpTd2daR1YwWVdsc0lEMGdlMzBwSUh0Y2JpQWdZMjl1YzNRZ1puVnNiRVYyWlc1MFRtRnRaU0E5SUdBa2UyVjJaVzUwVG1GdFpYMHVjR2d1Skh0dGIyUjFiR1ZPWVcxbGZXQmNiaUFnWkc5dFJXeGxiV1Z1ZEM1a2FYTndZWFJqYUVWMlpXNTBLRzVsZHlCRGRYTjBiMjFGZG1WdWRDaG1kV3hzUlhabGJuUk9ZVzFsTENCN0lHUmxkR0ZwYkNCOUtTbGNibjFjYmx4dVpYaHdiM0owSUdaMWJtTjBhVzl1SUdScGMzQmhkR05vVUdGblpVVjJaVzUwS0dWMlpXNTBUbUZ0WlN3Z2NHRm5aVTVoYldVc0lHUmxkR0ZwYkNBOUlIdDlLU0I3WEc0Z0lHTnZibk4wSUdaMWJHeEZkbVZ1ZEU1aGJXVWdQU0JnSkh0d1lXZGxUbUZ0WlgwdUpIdGxkbVZ1ZEU1aGJXVjlZRnh1SUNCM2FXNWtiM2N1WkdsemNHRjBZMmhGZG1WdWRDaHVaWGNnUTNWemRHOXRSWFpsYm5Rb1puVnNiRVYyWlc1MFRtRnRaU3dnZXlCa1pYUmhhV3dnZlNrcFhHNGdJR1J2WTNWdFpXNTBMbVJwYzNCaGRHTm9SWFpsYm5Rb2JtVjNJRU4xYzNSdmJVVjJaVzUwS0daMWJHeEZkbVZ1ZEU1aGJXVXNJSHNnWkdWMFlXbHNJSDBwS1Z4dWZWeHVJaXdpTHk4Z1FIUnZaRzhnYTJWbGNDQS9YRzVwWmlBb2RIbHdaVzltSUhkcGJtUnZkeUFoUFQwZ0ozVnVaR1ZtYVc1bFpDY3BJSHRjYmlBZ2QybHVaRzkzTG1Ga1pFVjJaVzUwVEdsemRHVnVaWElvSjJWeWNtOXlKeXdnS0NrZ1BUNGdlMXh1SUNBZ0lHTnZibk52YkdVdVpYSnliM0lvSjBGdUlHVnljbTl5SUdoaGN5QnZZMk4xY21Wa0lTQlpiM1VnWTJGdUlIQmxiaUJoYmlCcGMzTjFaU0JvWlhKbE9pQm9kSFJ3Y3pvdkwyZHBkR2gxWWk1amIyMHZjWFZoY21zdFpHVjJMMUJvYjI1dmJpMUdjbUZ0WlhkdmNtc3ZhWE56ZFdWekp5bGNiaUFnZlNsY2JuMWNibHh1THk4Z1ZYTmxJR0YyWVdsc1lXSnNaU0JsZG1WdWRITmNibXhsZENCaGRtRnBiR0ZpYkdWRmRtVnVkSE1nUFNCYkoyMXZkWE5sWkc5M2JpY3NJQ2R0YjNWelpXMXZkbVVuTENBbmJXOTFjMlYxY0NkZFhHNXNaWFFnZEc5MVkyaFRZM0psWlc0Z1BTQm1ZV3h6WlZ4dVhHNXBaaUFvZEhsd1pXOW1JSGRwYm1SdmR5QWhQVDBnSjNWdVpHVm1hVzVsWkNjcElIdGNiaUFnYVdZZ0tDZ25iMjUwYjNWamFITjBZWEowSnlCcGJpQjNhVzVrYjNjcElIeDhJSGRwYm1SdmR5NUViMk4xYldWdWRGUnZkV05vSUNZbUlHUnZZM1Z0Wlc1MElHbHVjM1JoYm1ObGIyWWdSRzlqZFcxbGJuUlViM1ZqYUNrZ2UxeHVJQ0FnSUhSdmRXTm9VMk55WldWdUlEMGdkSEoxWlZ4dUlDQWdJR0YyWVdsc1lXSnNaVVYyWlc1MGN5QTlJRnNuZEc5MVkyaHpkR0Z5ZENjc0lDZDBiM1ZqYUcxdmRtVW5MQ0FuZEc5MVkyaGxibVFuTENBbmRHOTFZMmhqWVc1alpXd25YVnh1SUNCOVhHNWNiaUFnYVdZZ0tIZHBibVJ2ZHk1dVlYWnBaMkYwYjNJdWNHOXBiblJsY2tWdVlXSnNaV1FwSUh0Y2JpQWdJQ0JoZG1GcGJHRmliR1ZGZG1WdWRITWdQU0JiSjNCdmFXNTBaWEprYjNkdUp5d2dKM0J2YVc1MFpYSnRiM1psSnl3Z0ozQnZhVzUwWlhKMWNDY3NJQ2R3YjJsdWRHVnlZMkZ1WTJWc0oxMWNiaUFnZlNCbGJITmxJR2xtSUNoM2FXNWtiM2N1Ym1GMmFXZGhkRzl5TG0xelVHOXBiblJsY2tWdVlXSnNaV1FwSUh0Y2JpQWdJQ0JoZG1GcGJHRmliR1ZGZG1WdWRITWdQU0JiSjAxVFVHOXBiblJsY2tSdmQyNG5MQ0FuVFZOUWIybHVkR1Z5VFc5MlpTY3NJQ2ROVTFCdmFXNTBaWEpWY0Njc0lDZE5VMUJ2YVc1MFpYSkRZVzVqWld3blhWeHVJQ0I5WEc1OVhHNWNibU52Ym5OMElHVnNJRDBnWkc5amRXMWxiblF1WTNKbFlYUmxSV3hsYldWdWRDZ25aR2wySnlsY2JtTnZibk4wSUhSeVlXNXphWFJwYjI1eklEMGdXMXh1SUNCN0lHNWhiV1U2SUNkMGNtRnVjMmwwYVc5dUp5d2djM1JoY25RNklDZDBjbUZ1YzJsMGFXOXVjM1JoY25RbkxDQmxibVE2SUNkMGNtRnVjMmwwYVc5dVpXNWtKeUI5TEZ4dUlDQjdJRzVoYldVNklDZE5iM3BVY21GdWMybDBhVzl1Snl3Z2MzUmhjblE2SUNkMGNtRnVjMmwwYVc5dWMzUmhjblFuTENCbGJtUTZJQ2QwY21GdWMybDBhVzl1Wlc1a0p5QjlMRnh1SUNCN0lHNWhiV1U2SUNkdGMxUnlZVzV6YVhScGIyNG5MQ0J6ZEdGeWREb2dKMjF6VkhKaGJuTnBkR2x2YmxOMFlYSjBKeXdnWlc1a09pQW5iWE5VY21GdWMybDBhVzl1Ulc1a0p5QjlMRnh1SUNCN0lHNWhiV1U2SUNkWFpXSnJhWFJVY21GdWMybDBhVzl1Snl3Z2MzUmhjblE2SUNkM1pXSnJhWFJVY21GdWMybDBhVzl1VTNSaGNuUW5MQ0JsYm1RNklDZDNaV0pyYVhSVWNtRnVjMmwwYVc5dVJXNWtKeUI5TEZ4dVhWeHVZMjl1YzNRZ1lXNXBiV0YwYVc5dWN5QTlJRnRjYmlBZ2V5QnVZVzFsT2lBbllXNXBiV0YwYVc5dUp5d2djM1JoY25RNklDZGhibWx0WVhScGIyNXpkR0Z5ZENjc0lHVnVaRG9nSjJGdWFXMWhkR2x2Ym1WdVpDY2dmU3hjYmlBZ2V5QnVZVzFsT2lBblRXOTZRVzVwYldGMGFXOXVKeXdnYzNSaGNuUTZJQ2RoYm1sdFlYUnBiMjV6ZEdGeWRDY3NJR1Z1WkRvZ0oyRnVhVzFoZEdsdmJtVnVaQ2NnZlN4Y2JpQWdleUJ1WVcxbE9pQW5iWE5CYm1sdFlYUnBiMjRuTENCemRHRnlkRG9nSjIxelFXNXBiV0YwYVc5dVUzUmhjblFuTENCbGJtUTZJQ2R0YzBGdWFXMWhkR2x2YmtWdVpDY2dmU3hjYmlBZ2V5QnVZVzFsT2lBblYyVmlhMmwwUVc1cGJXRjBhVzl1Snl3Z2MzUmhjblE2SUNkM1pXSnJhWFJCYm1sdFlYUnBiMjVUZEdGeWRDY3NJR1Z1WkRvZ0ozZGxZbXRwZEVGdWFXMWhkR2x2YmtWdVpDY2dmU3hjYmwxY2JseHVZMjl1YzNRZ2RISmhibk5wZEdsdmJsTjBZWEowSUQwZ2RISmhibk5wZEdsdmJuTXVabWx1WkNoMElEMCtJR1ZzTG5OMGVXeGxXM1F1Ym1GdFpWMGdJVDA5SUhWdVpHVm1hVzVsWkNrdWMzUmhjblJjYm1OdmJuTjBJSFJ5WVc1emFYUnBiMjVGYm1RZ1BTQjBjbUZ1YzJsMGFXOXVjeTVtYVc1a0tIUWdQVDRnWld3dWMzUjViR1ZiZEM1dVlXMWxYU0FoUFQwZ2RXNWtaV1pwYm1Wa0tTNWxibVJjYm1OdmJuTjBJR0Z1YVcxaGRHbHZibE4wWVhKMElEMGdZVzVwYldGMGFXOXVjeTVtYVc1a0tIUWdQVDRnWld3dWMzUjViR1ZiZEM1dVlXMWxYU0FoUFQwZ2RXNWtaV1pwYm1Wa0tTNXpkR0Z5ZEZ4dVkyOXVjM1FnWVc1cGJXRjBhVzl1Ulc1a0lEMGdZVzVwYldGMGFXOXVjeTVtYVc1a0tIUWdQVDRnWld3dWMzUjViR1ZiZEM1dVlXMWxYU0FoUFQwZ2RXNWtaV1pwYm1Wa0tTNWxibVJjYmx4dVpYaHdiM0owSUdSbFptRjFiSFFnZTF4dUlDQXZMeUIwYjNWamFDQnpZM0psWlc0Z2MzVndjRzl5ZEZ4dUlDQlVUMVZEU0Y5VFExSkZSVTQ2SUhSdmRXTm9VMk55WldWdUxGeHVYRzRnSUM4dklHNWxkSGR2Y210Y2JpQWdUa1ZVVjA5U1MxOVBUa3hKVGtVNklDZHZibXhwYm1VbkxGeHVJQ0JPUlZSWFQxSkxYMDlHUmt4SlRrVTZJQ2R2Wm1ac2FXNWxKeXhjYmlBZ1RrVlVWMDlTUzE5U1JVTlBUazVGUTFSSlRrYzZJQ2R5WldOdmJtNWxZM1JwYm1jbkxGeHVJQ0JPUlZSWFQxSkxYMUpGUTA5T1RrVkRWRWxPUjE5VFZVTkRSVk5UT2lBbmNtVmpiMjV1WldOMExuTjFZMk5sYzNNbkxGeHVJQ0JPUlZSWFQxSkxYMUpGUTA5T1RrVkRWRWxPUjE5R1FVbE1WVkpGT2lBbmNtVmpiMjV1WldOMExtWmhhV3gxY21VbkxGeHVYRzRnSUM4dklIVnpaWElnYVc1MFpYSm1ZV05sSUhOMFlYUmxjMXh1SUNCVFNFOVhPaUFuYzJodmR5Y3NYRzRnSUZOSVQxZE9PaUFuYzJodmQyNG5MRnh1SUNCSVNVUkZPaUFuYUdsa1pTY3NYRzRnSUVoSlJFUkZUam9nSjJocFpHUmxiaWNzWEc1Y2JpQWdMeThnYUdGemFGeHVJQ0JJUVZOSU9pQW5hR0Z6YUNjc1hHNWNiaUFnTHk4Z2RHOTFZMmdzSUcxdmRYTmxJR0Z1WkNCd2IybHVkR1Z5SUdWMlpXNTBjeUJ3YjJ4NVptbHNiRnh1SUNCVFZFRlNWRG9nWVhaaGFXeGhZbXhsUlhabGJuUnpXekJkTEZ4dUlDQk5UMVpGT2lCaGRtRnBiR0ZpYkdWRmRtVnVkSE5iTVYwc1hHNGdJRVZPUkRvZ1lYWmhhV3hoWW14bFJYWmxiblJ6V3pKZExGeHVJQ0JEUVU1RFJVdzZJSFI1Y0dWdlppQmhkbUZwYkdGaWJHVkZkbVZ1ZEhOYk0xMGdQVDA5SUNkMWJtUmxabWx1WldRbklEOGdiblZzYkNBNklHRjJZV2xzWVdKc1pVVjJaVzUwYzFzelhTeGNibHh1SUNBdkx5QjBjbUZ1YzJsMGFXOXVjMXh1SUNCVVVrRk9VMGxVU1U5T1gxTlVRVkpVT2lCMGNtRnVjMmwwYVc5dVUzUmhjblFzWEc0Z0lGUlNRVTVUU1ZSSlQwNWZSVTVFT2lCMGNtRnVjMmwwYVc5dVJXNWtMRnh1WEc0Z0lDOHZJR0Z1YVcxaGRHbHZibk5jYmlBZ1FVNUpUVUZVU1U5T1gxTlVRVkpVT2lCaGJtbHRZWFJwYjI1VGRHRnlkQ3hjYmlBZ1FVNUpUVUZVU1U5T1gwVk9SRG9nWVc1cGJXRjBhVzl1Ulc1a0xGeHVYRzRnSUM4dklHUnliM0JrYjNkdVhHNGdJRWxVUlUxZlUwVk1SVU5VUlVRNklDZHBkR1Z0VTJWc1pXTjBaV1FuTEZ4dWZTSXNJaThxS2x4dUlDb2dMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzFjYmlBcUlFeHBZMlZ1YzJWa0lIVnVaR1Z5SUUxSlZDQW9hSFIwY0hNNkx5OW5hWFJvZFdJdVkyOXRMM0YxWVhKckxXUmxkaTlRYUc5dWIyNHRSbkpoYldWM2IzSnJMMkpzYjJJdmJXRnpkR1Z5TDB4SlEwVk9VMFVwWEc0Z0tpQXRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMVnh1SUNvdlhHNWNibWx0Y0c5eWRDQkZkbVZ1ZENCbWNtOXRJQ2N1TGk4dUxpOWpiMjF0YjI0dlpYWmxiblJ6SjF4dWFXMXdiM0owSUVOdmJYQnZibVZ1ZENCbWNtOXRJQ2N1TGk4dUxpOWpiMjF3YjI1bGJuUnpMMk52YlhCdmJtVnVkQ2RjYmx4dVkyOXVjM1FnVG1WMGQyOXlheUE5SUNnb0tTQTlQaUI3WEc0Z0lDOHFLbHh1SUNBZ0tpQXRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMWNiaUFnSUNvZ1EyOXVjM1JoYm5SelhHNGdJQ0FxSUMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFZ4dUlDQWdLaTljYmx4dUlDQmpiMjV6ZENCT1FVMUZJRDBnSjI1bGRIZHZjbXNuWEc0Z0lHTnZibk4wSUZaRlVsTkpUMDRnUFNBbk1pNHdMakFuWEc0Z0lHTnZibk4wSUVSRlJrRlZURlJmVUZKUFVFVlNWRWxGVXlBOUlIdGNiaUFnSUNCbGJHVnRaVzUwT2lCdWRXeHNMRnh1SUNBZ0lHbHVhWFJwWVd4RVpXeGhlVG9nTXpBd01DeGNiaUFnSUNCa1pXeGhlVG9nTlRBd01DeGNiaUFnZlZ4dUlDQmpiMjV6ZENCRVFWUkJYMEZVVkZKVFgxQlNUMUJGVWxSSlJWTWdQU0JiWEc0Z0lGMWNibHh1SUNBdktpcGNiaUFnSUNvZ0xTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdFhHNGdJQ0FxSUVOc1lYTnpJRVJsWm1sdWFYUnBiMjVjYmlBZ0lDb2dMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRYRzRnSUNBcUwxeHVYRzRnSUdOc1lYTnpJRTVsZEhkdmNtc2daWGgwWlc1a2N5QkRiMjF3YjI1bGJuUWdlMXh1SUNBZ0lDOHFLbHh1SUNBZ0lDQXFJRU55WldGMFpYTWdZVzRnYVc1emRHRnVZMlVnYjJZZ1RtVjBkMjl5YXk1Y2JpQWdJQ0FnS2lCQWNHRnlZVzBnZTN0OWZTQmJiM0IwYVc5dWN6MTdmVjFjYmlBZ0lDQWdLaTljYmlBZ0lDQmpiMjV6ZEhKMVkzUnZjaWh2Y0hScGIyNXpJRDBnZTMwcElIdGNiaUFnSUNBZ0lITjFjR1Z5S0U1QlRVVXNJRlpGVWxOSlQwNHNJRVJGUmtGVlRGUmZVRkpQVUVWU1ZFbEZVeXdnYjNCMGFXOXVjeXdnUkVGVVFWOUJWRlJTVTE5UVVrOVFSVkpVU1VWVExDQjBjblZsTENCbVlXeHpaU2xjYmx4dUlDQWdJQ0FnZEdocGN5NTRhSElnUFNCdWRXeHNYRzRnSUNBZ0lDQjBhR2x6TG1Ob1pXTnJTVzUwWlhKMllXd2dQU0J1ZFd4c1hHNWNiaUFnSUNBZ0lIUm9hWE11YzJWMFUzUmhkSFZ6S0VWMlpXNTBMazVGVkZkUFVrdGZUMDVNU1U1RktWeHVYRzRnSUNBZ0lDQnpaWFJVYVcxbGIzVjBLQ2dwSUQwK0lIdGNiaUFnSUNBZ0lDQWdkR2hwY3k1emRHRnlkRU5vWldOcktDbGNiaUFnSUNBZ0lIMHNJSFJvYVhNdWIzQjBhVzl1Y3k1cGJtbDBhV0ZzUkdWc1lYa3BYRzRnSUNBZ2ZWeHVYRzRnSUNBZ1oyVjBVM1JoZEhWektDa2dlMXh1SUNBZ0lDQWdjbVYwZFhKdUlIUm9hWE11YzNSaGRIVnpYRzRnSUNBZ2ZWeHVYRzRnSUNBZ2MyVjBVM1JoZEhWektITjBZWFIxY3lrZ2UxeHVJQ0FnSUNBZ2RHaHBjeTV6ZEdGMGRYTWdQU0J6ZEdGMGRYTmNiaUFnSUNCOVhHNWNiaUFnSUNCemRHRnlkRkpsY1hWbGMzUW9LU0I3WEc0Z0lDQWdJQ0IwYUdsekxuaG9jaUE5SUc1bGR5QllUVXhJZEhSd1VtVnhkV1Z6ZENncFhHNGdJQ0FnSUNCMGFHbHpMbmhvY2k1dlptWnNhVzVsSUQwZ1ptRnNjMlZjYmx4dUlDQWdJQ0FnWTI5dWMzUWdkWEpzSUQwZ1lDOW1ZWFpwWTI5dUxtbGpiejlmUFNSN2JtVjNJRVJoZEdVb0tTNW5aWFJVYVcxbEtDbDlZRnh1WEc0Z0lDQWdJQ0IwYUdsekxuUnlhV2RuWlhKRmRtVnVkQ2hGZG1WdWRDNU9SVlJYVDFKTFgxSkZRMDlPVGtWRFZFbE9SeXdnZXlCa1lYUmxPaUJ1WlhjZ1JHRjBaU2dwSUgwc0lHWmhiSE5sS1NBZ0lDQWdJQ0FnSUNBZ0lGeHVYRzRnSUNBZ0lDQjBhR2x6TG5ob2NpNXZjR1Z1S0NkSVJVRkVKeXdnZFhKc0xDQjBjblZsS1Z4dVhHNGdJQ0FnSUNCMGFHbHpMbmhvY2k1MGFXMWxiM1YwSUQwZ2RHaHBjeTV2Y0hScGIyNXpMbVJsYkdGNUlDMGdNVnh1SUNBZ0lDQWdkR2hwY3k1NGFISXViMjUwYVcxbGIzVjBJRDBnS0NrZ1BUNGdlMXh1SUNBZ0lDQWdJQ0IwYUdsekxuaG9jaTVoWW05eWRDZ3BYRzRnSUNBZ0lDQWdJSFJvYVhNdWVHaHlJRDBnYm5Wc2JGeHVJQ0FnSUNBZ2ZWeHVYRzRnSUNBZ0lDQjBhR2x6TG5ob2NpNXZibXh2WVdRZ1BTQW9LU0E5UGlCN1hHNGdJQ0FnSUNBZ0lIUm9hWE11YjI1VmNDZ3BYRzRnSUNBZ0lDQjlYRzRnSUNBZ0lDQjBhR2x6TG5ob2NpNXZibVZ5Y205eUlEMGdLQ2tnUFQ0Z2UxeHVJQ0FnSUNBZ0lDQjBhR2x6TG05dVJHOTNiaWdwWEc0Z0lDQWdJQ0I5WEc1Y2JpQWdJQ0FnSUhSeWVTQjdYRzRnSUNBZ0lDQWdJSFJvYVhNdWVHaHlMbk5sYm1Rb0tWeHVJQ0FnSUNBZ2ZTQmpZWFJqYUNBb1pTa2dlMXh1SUNBZ0lDQWdJQ0IwYUdsekxtOXVSRzkzYmlncFhHNGdJQ0FnSUNCOVhHNGdJQ0FnZlZ4dVhHNGdJQ0FnYjI1VmNDZ3BJSHRjYmlBZ0lDQWdJSFJvYVhNdWRISnBaMmRsY2tWMlpXNTBLRVYyWlc1MExrNUZWRmRQVWt0ZlVrVkRUMDVPUlVOVVNVNUhYMU5WUTBORlUxTXNJSHNnWkdGMFpUb2dibVYzSUVSaGRHVW9LU0I5TENCbVlXeHpaU2xjYmx4dUlDQWdJQ0FnYVdZZ0tIUm9hWE11WjJWMFUzUmhkSFZ6S0NrZ0lUMDlJRVYyWlc1MExrNUZWRmRQVWt0ZlQwNU1TVTVGS1NCN1hHNGdJQ0FnSUNBZ0lIUm9hWE11ZEhKcFoyZGxja1YyWlc1MEtFVjJaVzUwTGs1RlZGZFBVa3RmVDA1TVNVNUZMQ0I3SUdSaGRHVTZJRzVsZHlCRVlYUmxLQ2tnZlN3Z1ptRnNjMlVwWEc0Z0lDQWdJQ0I5WEc1Y2JpQWdJQ0FnSUhSb2FYTXVjMlYwVTNSaGRIVnpLRVYyWlc1MExrNUZWRmRQVWt0ZlQwNU1TVTVGS1NBZ0lDQWdJRnh1SUNBZ0lIMWNibHh1SUNBZ0lHOXVSRzkzYmlncElIdGNiaUFnSUNBZ0lIUm9hWE11ZEhKcFoyZGxja1YyWlc1MEtFVjJaVzUwTGs1RlZGZFBVa3RmVWtWRFQwNU9SVU5VU1U1SFgwWkJTVXhWVWtVc0lIc2daR0YwWlRvZ2JtVjNJRVJoZEdVb0tTQjlMQ0JtWVd4elpTbGNibHh1SUNBZ0lDQWdhV1lnS0hSb2FYTXVaMlYwVTNSaGRIVnpLQ2tnSVQwOUlFVjJaVzUwTGs1RlZGZFBVa3RmVDBaR1RFbE9SU2tnZTF4dUlDQWdJQ0FnSUNCMGFHbHpMblJ5YVdkblpYSkZkbVZ1ZENoRmRtVnVkQzVPUlZSWFQxSkxYMDlHUmt4SlRrVXNJSHNnWkdGMFpUb2dibVYzSUVSaGRHVW9LU0I5TENCbVlXeHpaU2xjYmlBZ0lDQWdJSDFjYmx4dUlDQWdJQ0FnZEdocGN5NXpaWFJUZEdGMGRYTW9SWFpsYm5RdVRrVlVWMDlTUzE5UFJrWk1TVTVGS1NBZ0lDQWdJRnh1SUNBZ0lIMWNibHh1SUNBZ0lITjBZWEowUTJobFkyc29LU0I3WEc0Z0lDQWdJQ0IwYUdsekxuTjBiM0JEYUdWamF5Z3BYRzVjYmlBZ0lDQWdJSFJvYVhNdWMzUmhjblJTWlhGMVpYTjBLQ2tnSUNBZ0lDQmNibHh1SUNBZ0lDQWdkR2hwY3k1amFHVmphMGx1ZEdWeWRtRnNJRDBnYzJWMFNXNTBaWEoyWVd3b0tDa2dQVDRnZTF4dUlDQWdJQ0FnSUNCMGFHbHpMbk4wWVhKMFVtVnhkV1Z6ZENncFhHNGdJQ0FnSUNCOUxDQjBhR2x6TG05d2RHbHZibk11WkdWc1lYa3BYRzRnSUNBZ2ZWeHVYRzRnSUNBZ2MzUnZjRU5vWldOcktDa2dlMXh1SUNBZ0lDQWdhV1lnS0hSb2FYTXVZMmhsWTJ0SmJuUmxjblpoYkNBaFBUMGdiblZzYkNrZ2UxeHVJQ0FnSUNBZ0lDQmpiR1ZoY2tsdWRHVnlkbUZzS0hSb2FYTXVZMmhsWTJ0SmJuUmxjblpoYkNsY2JpQWdJQ0FnSUNBZ2RHaHBjeTVqYUdWamEwbHVkR1Z5ZG1Gc0lEMGdiblZzYkZ4dUlDQWdJQ0FnZlZ4dUlDQWdJSDFjYmx4dUlDQWdJSE4wWVhScFl5QmZSRTlOU1c1MFpYSm1ZV05sS0c5d2RHbHZibk1wSUh0Y2JpQWdJQ0FnSUhKbGRIVnliaUJ6ZFhCbGNpNWZSRTlOU1c1MFpYSm1ZV05sS0U1bGRIZHZjbXNzSUc5d2RHbHZibk1wWEc0Z0lDQWdmVnh1SUNCOVhHNWNiaUFnY21WMGRYSnVJRTVsZEhkdmNtdGNibjBwS0NsY2JseHVaWGh3YjNKMElHUmxabUYxYkhRZ1RtVjBkMjl5YTF4dUlpd2lYRzVsZUhCdmNuUWdablZ1WTNScGIyNGdiRzloWkVacGJHVW9kWEpzTENCbWJpd2djRzl6ZEVSaGRHRXBJSHRjYmlBZ1kyOXVjM1FnY21WeElEMGdibVYzSUZoTlRFaDBkSEJTWlhGMVpYTjBLQ2xjYmlBZ2FXWWdLSEpsY1M1dmRtVnljbWxrWlUxcGJXVlVlWEJsS1NCeVpYRXViM1psY25KcFpHVk5hVzFsVkhsd1pTZ25kR1Y0ZEM5b2RHMXNPeUJqYUdGeWMyVjBQWFYwWmkwNEp5bGNiaUFnY21WeExtOXVjbVZoWkhsemRHRjBaV05vWVc1blpTQTlJQ2dwSUQwK0lIdGNiaUFnSUNCcFppQW9jbVZ4TG5KbFlXUjVVM1JoZEdVZ1BUMDlJRFFnSmlZZ0tIQmhjbk5sU1c1MEtISmxjUzV6ZEdGMGRYTXNJREV3S1NBOVBUMGdNakF3WEc0Z0lDQWdJQ0I4ZkNBaGNtVnhMbk4wWVhSMWN5QW1KaUJ5WlhFdWNtVnpjRzl1YzJWVVpYaDBMbXhsYm1kMGFDa3BJSHRjYmlBZ0lDQWdJR1p1S0hKbGNTNXlaWE53YjI1elpWUmxlSFFwWEc0Z0lDQWdmVnh1SUNCOVhHNWNiaUFnYVdZZ0tIUjVjR1Z2WmlCd2IzTjBSR0YwWVNBaFBUMGdKM04wY21sdVp5Y3BJSHRjYmlBZ0lDQnlaWEV1YjNCbGJpZ25SMFZVSnl3Z2RYSnNMQ0IwY25WbEtWeHVJQ0FnSUhKbGNTNXpaVzVrS0NjbktWeHVJQ0I5SUdWc2MyVWdlMXh1SUNBZ0lISmxjUzV2Y0dWdUtDZFFUMU5VSnl3Z2RYSnNMQ0IwY25WbEtWeHVJQ0FnSUhKbGNTNXpaWFJTWlhGMVpYTjBTR1ZoWkdWeUtDZERiMjUwWlc1MExYUjVjR1VuTENBbllYQndiR2xqWVhScGIyNHZlQzEzZDNjdFptOXliUzExY214bGJtTnZaR1ZrSnlsY2JpQWdJQ0J5WlhFdWMyVnVaQ2h3YjNOMFJHRjBZU2xjYmlBZ2ZWeHVmVnh1WEc1bGVIQnZjblFnWm5WdVkzUnBiMjRnWjJWdVpYSmhkR1ZKWkNncElIdGNiaUFnY21WMGRYSnVJRTFoZEdndWNtRnVaRzl0S0NrdWRHOVRkSEpwYm1jb016WXBMbk4xWW5OMGNpZ3lMQ0F4TUNsY2JuMWNibHh1Wlhod2IzSjBJR1oxYm1OMGFXOXVJR1pwYm1SVVlYSm5aWFJDZVVOc1lYTnpLSFJoY21kbGRDd2djR0Z5Wlc1MFEyeGhjM01wSUh0Y2JpQWdabTl5SUNnN0lIUmhjbWRsZENBbUppQjBZWEpuWlhRZ0lUMDlJR1J2WTNWdFpXNTBPeUIwWVhKblpYUWdQU0IwWVhKblpYUXVjR0Z5Wlc1MFRtOWtaU2tnZTF4dUlDQWdJR2xtSUNoMFlYSm5aWFF1WTJ4aGMzTk1hWE4wTG1OdmJuUmhhVzV6S0hCaGNtVnVkRU5zWVhOektTa2dlMXh1SUNBZ0lDQWdjbVYwZFhKdUlIUmhjbWRsZEZ4dUlDQWdJSDFjYmlBZ2ZWeHVYRzRnSUhKbGRIVnliaUJ1ZFd4c1hHNTlYRzVjYmx4dVpYaHdiM0owSUdaMWJtTjBhVzl1SUdacGJtUlVZWEpuWlhSQ2VVbGtLSFJoY21kbGRDd2djR0Z5Wlc1MFNXUXBJSHRjYmlBZ1ptOXlJQ2c3SUhSaGNtZGxkQ0FtSmlCMFlYSm5aWFFnSVQwOUlHUnZZM1Z0Wlc1ME95QjBZWEpuWlhRZ1BTQjBZWEpuWlhRdWNHRnlaVzUwVG05a1pTa2dlMXh1SUNBZ0lHbG1JQ2gwWVhKblpYUXVaMlYwUVhSMGNtbGlkWFJsS0NkcFpDY3BJRDA5UFNCd1lYSmxiblJKWkNrZ2UxeHVJQ0FnSUNBZ2NtVjBkWEp1SUhSaGNtZGxkRnh1SUNBZ0lIMWNiaUFnZlZ4dVhHNGdJSEpsZEhWeWJpQnVkV3hzWEc1OVhHNWNibVY0Y0c5eWRDQm1kVzVqZEdsdmJpQm1hVzVrVkdGeVoyVjBRbmxCZEhSeUtIUmhjbWRsZEN3Z1lYUjBjaWtnZTF4dUlDQm1iM0lnS0RzZ2RHRnlaMlYwSUNZbUlIUmhjbWRsZENBaFBUMGdaRzlqZFcxbGJuUTdJSFJoY21kbGRDQTlJSFJoY21kbGRDNXdZWEpsYm5ST2IyUmxLU0I3WEc0Z0lDQWdhV1lnS0hSaGNtZGxkQzVuWlhSQmRIUnlhV0oxZEdVb1lYUjBjaWtnSVQwOUlHNTFiR3dwSUh0Y2JpQWdJQ0FnSUhKbGRIVnliaUIwWVhKblpYUmNiaUFnSUNCOVhHNGdJSDFjYmx4dUlDQnlaWFIxY200Z2JuVnNiRnh1ZlZ4dUlpd2lMeW9xWEc0Z0tpQXRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMVnh1SUNvZ1RHbGpaVzV6WldRZ2RXNWtaWElnVFVsVUlDaG9kSFJ3Y3pvdkwyZHBkR2gxWWk1amIyMHZjWFZoY21zdFpHVjJMMUJvYjI1dmJpMUdjbUZ0WlhkdmNtc3ZZbXh2WWk5dFlYTjBaWEl2VEVsRFJVNVRSU2xjYmlBcUlDMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRYRzRnS2k5Y2JtbHRjRzl5ZENCRGIyMXdiMjVsYm5RZ1puSnZiU0FuTGk0dlkyOXRjRzl1Wlc1MEoxeHVhVzF3YjNKMElFTnZiR3hoY0hObElHWnliMjBnSnk0dUwyTnZiR3hoY0hObEoxeHVhVzF3YjNKMElIc2daMlYwUVhSMGNtbGlkWFJsYzBOdmJtWnBaeUI5SUdaeWIyMGdKeTR1TDJOdmJYQnZibVZ1ZEUxaGJtRm5aWEluWEc1cGJYQnZjblFnZXlCbWFXNWtWR0Z5WjJWMFFubERiR0Z6Y3lCOUlHWnliMjBnSnk0dUx5NHVMMk52YlcxdmJpOTFkR2xzY3lkY2JseHVZMjl1YzNRZ1FXTmpiM0prYVc5dUlEMGdLQ2dwSUQwK0lIdGNiaUFnTHlvcVhHNGdJQ0FxSUMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFZ4dUlDQWdLaUJEYjI1emRHRnVkSE5jYmlBZ0lDb2dMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRYRzRnSUNBcUwxeHVYRzRnSUdOdmJuTjBJRTVCVFVVZ1BTQW5ZV05qYjNKa2FXOXVKMXh1SUNCamIyNXpkQ0JXUlZKVFNVOU9JRDBnSnpJdU1DNHdKMXh1SUNCamIyNXpkQ0JFUlVaQlZVeFVYMUJTVDFCRlVsUkpSVk1nUFNCN1hHNGdJQ0FnWld4bGJXVnVkRG9nYm5Wc2JDeGNiaUFnZlZ4dUlDQmpiMjV6ZENCRVFWUkJYMEZVVkZKVFgxQlNUMUJGVWxSSlJWTWdQU0JiWEc0Z0lGMWNibHh1SUNBdktpcGNiaUFnSUNvZ0xTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdFhHNGdJQ0FxSUVOc1lYTnpJRVJsWm1sdWFYUnBiMjVjYmlBZ0lDb2dMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRYRzRnSUNBcUwxeHVYRzRnSUdOc1lYTnpJRUZqWTI5eVpHbHZiaUJsZUhSbGJtUnpJRU52YlhCdmJtVnVkQ0I3WEc1Y2JpQWdJQ0JqYjI1emRISjFZM1J2Y2lodmNIUnBiMjV6SUQwZ2UzMHBJSHRjYmlBZ0lDQWdJSE4xY0dWeUtFNUJUVVVzSUZaRlVsTkpUMDRzSUVSRlJrRlZURlJmVUZKUFVFVlNWRWxGVXl3Z2IzQjBhVzl1Y3l3Z1JFRlVRVjlCVkZSU1UxOVFVazlRUlZKVVNVVlRMQ0JtWVd4elpTd2dabUZzYzJVcFhHNWNiaUFnSUNBZ0lIUm9hWE11WTI5c2JHRndjMlZ6SUQwZ1cxMWNibHh1SUNBZ0lDQWdZMjl1YzNRZ2RHOW5aMnhsY3lBOUlIUm9hWE11YjNCMGFXOXVjeTVsYkdWdFpXNTBMbkYxWlhKNVUyVnNaV04wYjNKQmJHd29ZRnRrWVhSaExYUnZaMmRzWlQxY0lpUjdUa0ZOUlgxY0lsMWdLVnh1SUNBZ0lDQWdRWEp5WVhrdVpuSnZiU2gwYjJkbmJHVnpLUzVtYjNKRllXTm9LQ2gwYjJkbmJHVXBJRDArSUh0Y2JpQWdJQ0FnSUNBZ1kyOXVjM1FnWTI5c2JHRndjMlZKWkNBOUlIUnZaMmRzWlM1blpYUkJkSFJ5YVdKMWRHVW9KMmh5WldZbktWeHVJQ0FnSUNBZ0lDQmpiMjV6ZENCamIyeHNZWEJ6WlNBOUlHUnZZM1Z0Wlc1MExuRjFaWEo1VTJWc1pXTjBiM0lvWTI5c2JHRndjMlZKWkNsY2JseHVJQ0FnSUNBZ0lDQnBaaUFvWTI5c2JHRndjMlVwSUh0Y2JpQWdJQ0FnSUNBZ0lDQjBhR2x6TG1Ga1pFTnZiR3hoY0hObEtHTnZiR3hoY0hObEtWeHVJQ0FnSUNBZ0lDQjlYRzRnSUNBZ0lDQjlLVnh1SUNBZ0lIMWNibHh1SUNBZ0lHOXVSV3hsYldWdWRFVjJaVzUwS0dWMlpXNTBLU0I3WEc0Z0lDQWdJQ0JqYjI1emRDQnBaQ0E5SUdWMlpXNTBMblJoY21kbGRDNW5aWFJCZEhSeWFXSjFkR1VvSjJoeVpXWW5LVnh1SUNBZ0lDQWdZMjl1YzNRZ1pXeGxiV1Z1ZENBOUlHUnZZM1Z0Wlc1MExuRjFaWEo1VTJWc1pXTjBiM0lvYVdRcFhHNWNiaUFnSUNBZ0lIUm9hWE11YzJWMFEyOXNiR0Z3YzJWektHVnNaVzFsYm5RcFhHNGdJQ0FnZlZ4dVhHNGdJQ0FnWVdSa1EyOXNiR0Z3YzJVb1pXeGxiV1Z1ZENrZ2UxeHVJQ0FnSUNBZ1kyOXVjM1FnWTI5c2JHRndjMlVnUFNCdVpYY2dRMjlzYkdGd2MyVW9lMXh1SUNBZ0lDQWdJQ0JsYkdWdFpXNTBMRnh1SUNBZ0lDQWdmU2xjYmlBZ0lDQWdJSFJvYVhNdVkyOXNiR0Z3YzJWekxuQjFjMmdvWTI5c2JHRndjMlVwWEc1Y2JpQWdJQ0FnSUhKbGRIVnliaUJqYjJ4c1lYQnpaVnh1SUNBZ0lIMWNibHh1SUNBZ0lHZGxkRU52Ykd4aGNITmxLR1ZzWlcxbGJuUXBJSHRjYmlBZ0lDQWdJR3hsZENCamIyeHNZWEJ6WlNBOUlIUm9hWE11WTI5c2JHRndjMlZ6TG1acGJtUW9ZeUE5UGlCakxtOXdkR2x2Ym5NdVpXeGxiV1Z1ZEM1blpYUkJkSFJ5YVdKMWRHVW9KMmxrSnlrZ1BUMDlJR1ZzWlcxbGJuUXVaMlYwUVhSMGNtbGlkWFJsS0NkcFpDY3BLVnh1WEc0Z0lDQWdJQ0JwWmlBb0lXTnZiR3hoY0hObEtTQjdYRzRnSUNBZ0lDQWdJQzh2SUdOeVpXRjBaU0JoSUc1bGR5QmpiMnhzWVhCelpWeHVJQ0FnSUNBZ0lDQmpiMnhzWVhCelpTQTlJSFJvYVhNdVlXUmtRMjlzYkdGd2MyVW9LVnh1SUNBZ0lDQWdmVnh1WEc0Z0lDQWdJQ0J5WlhSMWNtNGdZMjlzYkdGd2MyVmNiaUFnSUNCOVhHNWNiaUFnSUNCblpYUkRiMnhzWVhCelpYTW9LU0I3WEc0Z0lDQWdJQ0J5WlhSMWNtNGdkR2hwY3k1amIyeHNZWEJ6WlhOY2JpQWdJQ0I5WEc1Y2JpQWdJQ0J6WlhSRGIyeHNZWEJ6WlhNb2MyaHZkME52Ykd4aGNITmxLU0I3WEc0Z0lDQWdJQ0JqYjI1emRDQmpiMnhzWVhCelpTQTlJSFJvYVhNdVoyVjBRMjlzYkdGd2MyVW9jMmh2ZDBOdmJHeGhjSE5sS1Z4dUlDQWdJQ0FnZEdocGN5NWpiMnhzWVhCelpYTXVabTl5UldGamFDZ29ZeWtnUFQ0Z2UxeHVJQ0FnSUNBZ0lDQnBaaUFvWXk1dmNIUnBiMjV6TG1Wc1pXMWxiblF1WjJWMFFYUjBjbWxpZFhSbEtDZHBaQ2NwSUNFOVBTQnphRzkzUTI5c2JHRndjMlV1WjJWMFFYUjBjbWxpZFhSbEtDZHBaQ2NwS1NCN1hHNGdJQ0FnSUNBZ0lDQWdZeTVvYVdSbEtDbGNiaUFnSUNBZ0lDQWdmU0JsYkhObElIdGNiaUFnSUNBZ0lDQWdJQ0JqYjJ4c1lYQnpaUzUwYjJkbmJHVW9LVnh1SUNBZ0lDQWdJQ0I5WEc0Z0lDQWdJQ0I5S1Z4dUlDQWdJSDFjYmx4dUlDQWdJSE5vYjNjb1kyOXNiR0Z3YzJWRmJDa2dlMXh1SUNBZ0lDQWdiR1YwSUdOdmJHeGhjSE5sSUQwZ1kyOXNiR0Z3YzJWRmJGeHVJQ0FnSUNBZ2FXWWdLSFI1Y0dWdlppQmpiMnhzWVhCelpVVnNJRDA5UFNBbmMzUnlhVzVuSnlrZ2UxeHVJQ0FnSUNBZ0lDQmpiMnhzWVhCelpTQTlJR1J2WTNWdFpXNTBMbkYxWlhKNVUyVnNaV04wYjNJb1kyOXNiR0Z3YzJWRmJDbGNiaUFnSUNBZ0lIMWNibHh1SUNBZ0lDQWdhV1lnS0NGamIyeHNZWEJ6WlNrZ2UxeHVJQ0FnSUNBZ0lDQjBhSEp2ZHlCdVpYY2dSWEp5YjNJb1lDUjdUa0ZOUlgwdUlGUm9aU0JqYjJ4c1lYQnphV0pzWlNBa2UyTnZiR3hoY0hObFJXeDlJR2x6SUdGdUlHbHVkbUZzYVdRZ1NGUk5URVZzWlcxbGJuUXVZQ2xjYmlBZ0lDQWdJSDFjYmx4dUlDQWdJQ0FnZEdocGN5NXpaWFJEYjJ4c1lYQnpaWE1vWTI5c2JHRndjMlVwWEc1Y2JpQWdJQ0FnSUhKbGRIVnliaUIwY25WbFhHNGdJQ0FnZlZ4dVhHNGdJQ0FnYUdsa1pTaGpiMnhzWVhCelpVVnNLU0I3WEc0Z0lDQWdJQ0JzWlhRZ1kyOXNiR0Z3YzJVZ1BTQmpiMnhzWVhCelpVVnNYRzRnSUNBZ0lDQnBaaUFvZEhsd1pXOW1JR052Ykd4aGNITmxSV3dnUFQwOUlDZHpkSEpwYm1jbktTQjdYRzRnSUNBZ0lDQWdJR052Ykd4aGNITmxJRDBnWkc5amRXMWxiblF1Y1hWbGNubFRaV3hsWTNSdmNpaGpiMnhzWVhCelpVVnNLVnh1SUNBZ0lDQWdmVnh1WEc0Z0lDQWdJQ0JwWmlBb0lXTnZiR3hoY0hObEtTQjdYRzRnSUNBZ0lDQWdJSFJvY205M0lHNWxkeUJGY25KdmNpaGdKSHRPUVUxRmZTNGdWR2hsSUdOdmJHeGhjSE5wWW14bElDUjdZMjlzYkdGd2MyVkZiSDBnYVhNZ1lXNGdhVzUyWVd4cFpDQklWRTFNUld4bGJXVnVkQzVnS1Z4dUlDQWdJQ0FnZlZ4dVhHNGdJQ0FnSUNCamIyNXpkQ0JqYjJ4c1lYQnpaVTlpYWlBOUlIUm9hWE11WjJWMFEyOXNiR0Z3YzJVb1kyOXNiR0Z3YzJVcFhHNGdJQ0FnSUNCeVpYUjFjbTRnWTI5c2JHRndjMlZQWW1vdWFHbGtaU2dwWEc0Z0lDQWdmVnh1WEc0Z0lDQWdjM1JoZEdsaklHbGtaVzUwYVdacFpYSW9LU0I3WEc0Z0lDQWdJQ0J5WlhSMWNtNGdUa0ZOUlZ4dUlDQWdJSDFjYmx4dUlDQWdJSE4wWVhScFl5QmZSRTlOU1c1MFpYSm1ZV05sS0c5d2RHbHZibk1wSUh0Y2JpQWdJQ0FnSUhKbGRIVnliaUJ6ZFhCbGNpNWZSRTlOU1c1MFpYSm1ZV05sS0VGalkyOXlaR2x2Yml3Z2IzQjBhVzl1Y3lsY2JpQWdJQ0I5WEc0Z0lIMWNibHh1SUNBdktpcGNiaUFnSUNvZ0xTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdFhHNGdJQ0FxSUVSUFRTQkJjR2tnYVcxd2JHVnRaVzUwWVhScGIyNWNiaUFnSUNvZ0xTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdFhHNGdJQ0FxTDF4dUlDQmpiMjV6ZENCamIyMXdiMjVsYm5SeklEMGdXMTFjYmx4dUlDQmpiMjV6ZENCaFkyTnZjbVJwYjI1eklEMGdaRzlqZFcxbGJuUXVjWFZsY25sVFpXeGxZM1J2Y2tGc2JDaGdMaVI3VGtGTlJYMWdLVnh1SUNCcFppQW9ZV05qYjNKa2FXOXVjeWtnZTF4dUlDQWdJRUZ5Y21GNUxtWnliMjBvWVdOamIzSmthVzl1Y3lrdVptOXlSV0ZqYUNnb1pXeGxiV1Z1ZENrZ1BUNGdlMXh1SUNBZ0lDQWdZMjl1YzNRZ1kyOXVabWxuSUQwZ1oyVjBRWFIwY21saWRYUmxjME52Ym1acFp5aGxiR1Z0Wlc1MExDQkVSVVpCVlV4VVgxQlNUMUJGVWxSSlJWTXNJRVJCVkVGZlFWUlVVbE5mVUZKUFVFVlNWRWxGVXlsY2JpQWdJQ0FnSUdOdmJtWnBaeTVsYkdWdFpXNTBJRDBnWld4bGJXVnVkRnh1WEc0Z0lDQWdJQ0JqYjIxd2IyNWxiblJ6TG5CMWMyZ29RV05qYjNKa2FXOXVMbDlFVDAxSmJuUmxjbVpoWTJVb1kyOXVabWxuS1NsY2JpQWdJQ0I5S1Z4dUlDQjlYRzVjYmlBZ1pHOWpkVzFsYm5RdVlXUmtSWFpsYm5STWFYTjBaVzVsY2lnblkyeHBZMnNuTENBb1pYWmxiblFwSUQwK0lIdGNiaUFnSUNCamIyNXpkQ0JrWVhSaFZHOW5aMnhsUVhSMGNpQTlJR1YyWlc1MExuUmhjbWRsZEM1blpYUkJkSFJ5YVdKMWRHVW9KMlJoZEdFdGRHOW5aMnhsSnlsY2JpQWdJQ0JwWmlBb1pHRjBZVlJ2WjJkc1pVRjBkSElnSmlZZ1pHRjBZVlJ2WjJkc1pVRjBkSElnUFQwOUlFNUJUVVVwSUh0Y2JpQWdJQ0FnSUdOdmJuTjBJR052Ykd4aGNITmxTV1FnUFNCbGRtVnVkQzUwWVhKblpYUXVaMlYwUVhSMGNtbGlkWFJsS0Nka1lYUmhMWFJoY21kbGRDY3BJSHg4SUdWMlpXNTBMblJoY21kbGRDNW5aWFJCZEhSeWFXSjFkR1VvSjJoeVpXWW5LVnh1SUNBZ0lDQWdZMjl1YzNRZ1kyOXNiR0Z3YzJWRmJDQTlJR1J2WTNWdFpXNTBMbkYxWlhKNVUyVnNaV04wYjNJb1kyOXNiR0Z3YzJWSlpDbGNibHh1SUNBZ0lDQWdZMjl1YzNRZ1lXTmpiM0prYVc5dUlEMGdabWx1WkZSaGNtZGxkRUo1UTJ4aGMzTW9aWFpsYm5RdWRHRnlaMlYwTENBbllXTmpiM0prYVc5dUp5bGNibHh1SUNBZ0lDQWdhV1lnS0dGalkyOXlaR2x2YmlBOVBUMGdiblZzYkNrZ2UxeHVJQ0FnSUNBZ0lDQnlaWFIxY201Y2JpQWdJQ0FnSUgxY2JseHVJQ0FnSUNBZ1kyOXVjM1FnWVdOamIzSmthVzl1U1dRZ1BTQmhZMk52Y21ScGIyNHVaMlYwUVhSMGNtbGlkWFJsS0NkcFpDY3BYRzRnSUNBZ0lDQmpiMjV6ZENCamIyMXdiMjVsYm5RZ1BTQmpiMjF3YjI1bGJuUnpMbVpwYm1Rb1l5QTlQaUJqTG1kbGRFVnNaVzFsYm5Rb0tTNW5aWFJCZEhSeWFXSjFkR1VvSjJsa0p5a2dQVDA5SUdGalkyOXlaR2x2Ymtsa0tWeHVYRzRnSUNBZ0lDQnBaaUFvSVdOdmJYQnZibVZ1ZENrZ2UxeHVJQ0FnSUNBZ0lDQnlaWFIxY201Y2JpQWdJQ0FnSUgxY2JseHVJQ0FnSUNBZ0x5OGdhV1lnZEdobElHTnZiR3hoY0hObElHaGhjeUJpWldWdUlHRmtaR1ZrSUhCeWIyZHlZVzF0WVhScFkyRnNiSGtzSUhkbElHRmtaQ0JwZEZ4dUlDQWdJQ0FnWTI5dWMzUWdkR0Z5WjJWMFEyOXNiR0Z3YzJVZ1BTQmpiMjF3YjI1bGJuUXVaMlYwUTI5c2JHRndjMlZ6S0NrdVptbHVaQ2hqSUQwK0lHTXVaMlYwUld4bGJXVnVkQ2dwSUQwOVBTQmpiMnhzWVhCelpVVnNLVnh1SUNBZ0lDQWdhV1lnS0NGMFlYSm5aWFJEYjJ4c1lYQnpaU2tnZTF4dUlDQWdJQ0FnSUNCamIyMXdiMjVsYm5RdVlXUmtRMjlzYkdGd2MyVW9ZMjlzYkdGd2MyVkZiQ2xjYmlBZ0lDQWdJSDFjYmx4dUlDQWdJQ0FnWTI5dGNHOXVaVzUwTG5Ob2IzY29ZMjlzYkdGd2MyVkpaQ2xjYmlBZ0lDQjlYRzRnSUgwcFhHNWNiaUFnY21WMGRYSnVJRUZqWTI5eVpHbHZibHh1ZlNrb0tWeHVYRzVsZUhCdmNuUWdaR1ZtWVhWc2RDQkJZMk52Y21ScGIyNWNiaUlzSWk4cUtseHVJQ29nTFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMxY2JpQXFJRXhwWTJWdWMyVmtJSFZ1WkdWeUlFMUpWQ0FvYUhSMGNITTZMeTluYVhSb2RXSXVZMjl0TDNGMVlYSnJMV1JsZGk5UWFHOXViMjR0Um5KaGJXVjNiM0pyTDJKc2IySXZiV0Z6ZEdWeUwweEpRMFZPVTBVcFhHNGdLaUF0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFZ4dUlDb3ZYRzVwYlhCdmNuUWdRMjl0Y0c5dVpXNTBJR1p5YjIwZ0p5NHVMMk52YlhCdmJtVnVkQ2RjYm1sdGNHOXlkQ0I3SUdkbGRFRjBkSEpwWW5WMFpYTkRiMjVtYVdjZ2ZTQm1jbTl0SUNjdUxpOWpiMjF3YjI1bGJuUk5ZVzVoWjJWeUoxeHVhVzF3YjNKMElFVjJaVzUwSUdaeWIyMGdKeTR1THk0dUwyTnZiVzF2Ymk5bGRtVnVkSE1uWEc1cGJYQnZjblFnZXlCbWFXNWtWR0Z5WjJWMFFubEJkSFJ5SUgwZ1puSnZiU0FuTGk0dkxpNHZZMjl0Ylc5dUwzVjBhV3h6SjF4dVhHNWpiMjV6ZENCRGIyeHNZWEJ6WlNBOUlDZ29LU0E5UGlCN1hHNGdJQzhxS2x4dUlDQWdLaUF0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzFjYmlBZ0lDb2dRMjl1YzNSaGJuUnpYRzRnSUNBcUlDMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExWeHVJQ0FnS2k5Y2JseHVJQ0JqYjI1emRDQk9RVTFGSUQwZ0oyTnZiR3hoY0hObEoxeHVJQ0JqYjI1emRDQldSVkpUU1U5T0lEMGdKekl1TUM0d0oxeHVJQ0JqYjI1emRDQkVSVVpCVlV4VVgxQlNUMUJGVWxSSlJWTWdQU0I3WEc0Z0lDQWdaV3hsYldWdWREb2diblZzYkN4Y2JpQWdJQ0IwYjJkbmJHVTZJR1poYkhObExGeHVJQ0I5WEc0Z0lHTnZibk4wSUVSQlZFRmZRVlJVVWxOZlVGSlBVRVZTVkVsRlV5QTlJRnRjYmlBZ0lDQW5kRzluWjJ4bEp5eGNiaUFnWFZ4dVhHNGdJQzhxS2x4dUlDQWdLaUF0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzFjYmlBZ0lDb2dRMnhoYzNNZ1JHVm1hVzVwZEdsdmJseHVJQ0FnS2lBdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMxY2JpQWdJQ292WEc1Y2JpQWdZMnhoYzNNZ1EyOXNiR0Z3YzJVZ1pYaDBaVzVrY3lCRGIyMXdiMjVsYm5RZ2UxeHVYRzRnSUNBZ1kyOXVjM1J5ZFdOMGIzSW9iM0IwYVc5dWN5QTlJSHQ5S1NCN1hHNGdJQ0FnSUNCemRYQmxjaWhPUVUxRkxDQldSVkpUU1U5T0xDQkVSVVpCVlV4VVgxQlNUMUJGVWxSSlJWTXNJRzl3ZEdsdmJuTXNJRVJCVkVGZlFWUlVVbE5mVUZKUFVFVlNWRWxGVXl3Z1ptRnNjMlVzSUdaaGJITmxLVnh1WEc0Z0lDQWdJQ0IwYUdsekxtOXVWSEpoYm5OcGRHbHZiaUE5SUdaaGJITmxYRzVjYmlBZ0lDQWdJQzh2SUhSdloyZHNaU0JrYVhKbFkzUnNlVnh1SUNBZ0lDQWdhV1lnS0hSb2FYTXViM0IwYVc5dWN5NTBiMmRuYkdVcElIdGNiaUFnSUNBZ0lDQWdkR2hwY3k1emFHOTNLQ2xjYmlBZ0lDQWdJSDFjYmlBZ0lDQjlYRzVjYmlBZ0lDQm5aWFJJWldsbmFIUW9LU0I3WEc0Z0lDQWdJQ0J5WlhSMWNtNGdkR2hwY3k1dmNIUnBiMjV6TG1Wc1pXMWxiblF1WjJWMFFtOTFibVJwYm1kRGJHbGxiblJTWldOMEtIUm9hWE11YjNCMGFXOXVjeTVsYkdWdFpXNTBLUzVvWldsbmFIUmNiaUFnSUNCOVhHNWNiaUFnSUNCMGIyZG5iR1VvS1NCN1hHNGdJQ0FnSUNCcFppQW9kR2hwY3k1dmNIUnBiMjV6TG1Wc1pXMWxiblF1WTJ4aGMzTk1hWE4wTG1OdmJuUmhhVzV6S0NkemFHOTNKeWtwSUh0Y2JpQWdJQ0FnSUNBZ2NtVjBkWEp1SUhSb2FYTXVhR2xrWlNncFhHNGdJQ0FnSUNCOVhHNWNiaUFnSUNBZ0lISmxkSFZ5YmlCMGFHbHpMbk5vYjNjb0tWeHVJQ0FnSUgxY2JseHVJQ0FnSUhOb2IzY29LU0I3WEc0Z0lDQWdJQ0JwWmlBb2RHaHBjeTV2YmxSeVlXNXphWFJwYjI0cElIdGNiaUFnSUNBZ0lDQWdjbVYwZFhKdUlHWmhiSE5sWEc0Z0lDQWdJQ0I5WEc1Y2JpQWdJQ0FnSUdsbUlDaDBhR2x6TG05d2RHbHZibk11Wld4bGJXVnVkQzVqYkdGemMweHBjM1F1WTI5dWRHRnBibk1vSjNOb2IzY25LU2tnZTF4dUlDQWdJQ0FnSUNCeVpYUjFjbTRnWm1Gc2MyVmNiaUFnSUNBZ0lIMWNibHh1SUNBZ0lDQWdkR2hwY3k1dmJsUnlZVzV6YVhScGIyNGdQU0IwY25WbFhHNWNiaUFnSUNBZ0lHTnZibk4wSUc5dVEyOXNiR0Z3YzJWa0lEMGdLQ2tnUFQ0Z2UxeHVJQ0FnSUNBZ0lDQjBhR2x6TG05d2RHbHZibk11Wld4bGJXVnVkQzVqYkdGemMweHBjM1F1WVdSa0tDZHphRzkzSnlsY2JpQWdJQ0FnSUNBZ2RHaHBjeTV2Y0hScGIyNXpMbVZzWlcxbGJuUXVZMnhoYzNOTWFYTjBMbkpsYlc5MlpTZ25ZMjlzYkdGd2MybHVaeWNwWEc0Z0lDQWdJQ0FnSUhSb2FYTXViM0IwYVc5dWN5NWxiR1Z0Wlc1MExuSmxiVzkyWlVWMlpXNTBUR2x6ZEdWdVpYSW9SWFpsYm5RdVZGSkJUbE5KVkVsUFRsOUZUa1FzSUc5dVEyOXNiR0Z3YzJWa0tWeHVYRzRnSUNBZ0lDQWdJSFJvYVhNdWIzQjBhVzl1Y3k1bGJHVnRaVzUwTG5ObGRFRjBkSEpwWW5WMFpTZ25ZWEpwWVMxbGVIQmhibVJsWkNjc0lIUnlkV1VwWEc1Y2JpQWdJQ0FnSUNBZ2RHaHBjeTV2YmxSeVlXNXphWFJwYjI0Z1BTQm1ZV3h6WlZ4dUlDQWdJQ0FnZlZ4dVhHNGdJQ0FnSUNCcFppQW9JWFJvYVhNdWIzQjBhVzl1Y3k1bGJHVnRaVzUwTG1Oc1lYTnpUR2x6ZEM1amIyNTBZV2x1Y3lnblkyOXNiR0Z3YzJsdVp5Y3BLU0I3WEc0Z0lDQWdJQ0FnSUhSb2FYTXViM0IwYVc5dWN5NWxiR1Z0Wlc1MExtTnNZWE56VEdsemRDNWhaR1FvSjJOdmJHeGhjSE5wYm1jbktWeHVJQ0FnSUNBZ2ZWeHVYRzRnSUNBZ0lDQjBhR2x6TG05d2RHbHZibk11Wld4bGJXVnVkQzVoWkdSRmRtVnVkRXhwYzNSbGJtVnlLRVYyWlc1MExsUlNRVTVUU1ZSSlQwNWZSVTVFTENCdmJrTnZiR3hoY0hObFpDbGNibHh1SUNBZ0lDQWdZMjl1YzNRZ2FHVnBaMmgwSUQwZ2RHaHBjeTVuWlhSSVpXbG5hSFFvS1Z4dVhHNGdJQ0FnSUNCMGFHbHpMbTl3ZEdsdmJuTXVaV3hsYldWdWRDNXpkSGxzWlM1b1pXbG5hSFFnUFNBbk1IQjRKMXh1WEc0Z0lDQWdJQ0J6WlhSVWFXMWxiM1YwS0NncElEMCtJSHRjYmlBZ0lDQWdJQ0FnZEdocGN5NXZjSFJwYjI1ekxtVnNaVzFsYm5RdWMzUjViR1V1YUdWcFoyaDBJRDBnWUNSN2FHVnBaMmgwZlhCNFlGeHVJQ0FnSUNBZ2ZTd2dNakFwWEc1Y2JpQWdJQ0FnSUhKbGRIVnliaUIwY25WbFhHNGdJQ0FnZlZ4dVhHNGdJQ0FnYUdsa1pTZ3BJSHRjYmlBZ0lDQWdJR2xtSUNoMGFHbHpMbTl1VkhKaGJuTnBkR2x2YmlrZ2UxeHVJQ0FnSUNBZ0lDQnlaWFIxY200Z1ptRnNjMlZjYmlBZ0lDQWdJSDFjYmx4dUlDQWdJQ0FnYVdZZ0tDRjBhR2x6TG05d2RHbHZibk11Wld4bGJXVnVkQzVqYkdGemMweHBjM1F1WTI5dWRHRnBibk1vSjNOb2IzY25LU2tnZTF4dUlDQWdJQ0FnSUNCeVpYUjFjbTRnWm1Gc2MyVmNiaUFnSUNBZ0lIMWNibHh1SUNBZ0lDQWdkR2hwY3k1dmJsUnlZVzV6YVhScGIyNGdQU0IwY25WbFhHNWNiaUFnSUNBZ0lHTnZibk4wSUc5dVEyOXNiR0Z3YzJWa0lEMGdLQ2tnUFQ0Z2UxeHVJQ0FnSUNBZ0lDQjBhR2x6TG05d2RHbHZibk11Wld4bGJXVnVkQzVqYkdGemMweHBjM1F1Y21WdGIzWmxLQ2RqYjJ4c1lYQnphVzVuSnlsY2JpQWdJQ0FnSUNBZ2RHaHBjeTV2Y0hScGIyNXpMbVZzWlcxbGJuUXVjM1I1YkdVdWFHVnBaMmgwSUQwZ0oyRjFkRzhuWEc0Z0lDQWdJQ0FnSUhSb2FYTXViM0IwYVc5dWN5NWxiR1Z0Wlc1MExuSmxiVzkyWlVWMlpXNTBUR2x6ZEdWdVpYSW9SWFpsYm5RdVZGSkJUbE5KVkVsUFRsOUZUa1FzSUc5dVEyOXNiR0Z3YzJWa0tWeHVYRzRnSUNBZ0lDQWdJSFJvYVhNdWIzQjBhVzl1Y3k1bGJHVnRaVzUwTG5ObGRFRjBkSEpwWW5WMFpTZ25ZWEpwWVMxbGVIQmhibVJsWkNjc0lHWmhiSE5sS1Z4dVhHNGdJQ0FnSUNBZ0lIUm9hWE11YjI1VWNtRnVjMmwwYVc5dUlEMGdabUZzYzJWY2JpQWdJQ0FnSUgxY2JseHVJQ0FnSUNBZ2RHaHBjeTV2Y0hScGIyNXpMbVZzWlcxbGJuUXVjM1I1YkdVdWFHVnBaMmgwSUQwZ0p6QndlQ2RjYmx4dUlDQWdJQ0FnYVdZZ0tDRjBhR2x6TG05d2RHbHZibk11Wld4bGJXVnVkQzVqYkdGemMweHBjM1F1WTI5dWRHRnBibk1vSjJOdmJHeGhjSE5wYm1jbktTa2dlMXh1SUNBZ0lDQWdJQ0IwYUdsekxtOXdkR2x2Ym5NdVpXeGxiV1Z1ZEM1amJHRnpjMHhwYzNRdVlXUmtLQ2RqYjJ4c1lYQnphVzVuSnlsY2JpQWdJQ0FnSUgxY2JseHVJQ0FnSUNBZ2RHaHBjeTV2Y0hScGIyNXpMbVZzWlcxbGJuUXVZV1JrUlhabGJuUk1hWE4wWlc1bGNpaEZkbVZ1ZEM1VVVrRk9VMGxVU1U5T1gwVk9SQ3dnYjI1RGIyeHNZWEJ6WldRcFhHNWNiaUFnSUNBZ0lIUm9hWE11YjNCMGFXOXVjeTVsYkdWdFpXNTBMbU5zWVhOelRHbHpkQzV5WlcxdmRtVW9KM05vYjNjbktWeHVYRzRnSUNBZ0lDQnlaWFIxY200Z2RISjFaVnh1SUNBZ0lIMWNibHh1SUNBZ0lITjBZWFJwWXlCcFpHVnVkR2xtYVdWeUtDa2dlMXh1SUNBZ0lDQWdjbVYwZFhKdUlFNUJUVVZjYmlBZ0lDQjlYRzVjYmlBZ0lDQnpkR0YwYVdNZ1gwUlBUVWx1ZEdWeVptRmpaU2h2Y0hScGIyNXpLU0I3WEc0Z0lDQWdJQ0J5WlhSMWNtNGdjM1Z3WlhJdVgwUlBUVWx1ZEdWeVptRmpaU2hEYjJ4c1lYQnpaU3dnYjNCMGFXOXVjeWxjYmlBZ0lDQjlYRzRnSUgxY2JseHVJQ0F2S2lwY2JpQWdJQ29nTFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0WEc0Z0lDQXFJRVJQVFNCQmNHa2dhVzF3YkdWdFpXNTBZWFJwYjI1Y2JpQWdJQ29nTFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0WEc0Z0lDQXFMMXh1SUNCamIyNXpkQ0JqYjIxd2IyNWxiblJ6SUQwZ1cxMWNibHh1SUNCamIyNXpkQ0JqYjJ4c1lYQnpaWE1nUFNCa2IyTjFiV1Z1ZEM1eGRXVnllVk5sYkdWamRHOXlRV3hzS0dBdUpIdE9RVTFGZldBcFhHNGdJR2xtSUNoamIyeHNZWEJ6WlhNcElIdGNiaUFnSUNCamIyeHNZWEJ6WlhNdVptOXlSV0ZqYUNnb1pXeGxiV1Z1ZENrZ1BUNGdlMXh1SUNBZ0lDQWdMeThnWTI5dWMzUWdZMjl1Wm1sbklEMGdlMzFjYmlBZ0lDQWdJR052Ym5OMElHTnZibVpwWnlBOUlHZGxkRUYwZEhKcFluVjBaWE5EYjI1bWFXY29aV3hsYldWdWRDd2dSRVZHUVZWTVZGOVFVazlRUlZKVVNVVlRMQ0JFUVZSQlgwRlVWRkpUWDFCU1QxQkZVbFJKUlZNcFhHNGdJQ0FnSUNCamIyNW1hV2N1Wld4bGJXVnVkQ0E5SUdWc1pXMWxiblJjYmx4dUlDQWdJQ0FnWTI5dGNHOXVaVzUwY3k1d2RYTm9LRU52Ykd4aGNITmxMbDlFVDAxSmJuUmxjbVpoWTJVb1kyOXVabWxuS1NsY2JpQWdJQ0I5S1Z4dUlDQjlYRzVjYmlBZ1pHOWpkVzFsYm5RdVlXUmtSWFpsYm5STWFYTjBaVzVsY2lnblkyeHBZMnNuTENBb1pYWmxiblFwSUQwK0lIdGNiaUFnSUNCamIyNXpkQ0IwWVhKblpYUWdQU0JtYVc1a1ZHRnlaMlYwUW5sQmRIUnlLR1YyWlc1MExuUmhjbWRsZEN3Z0oyUmhkR0V0ZEc5bloyeGxKeWxjYmlBZ0lDQnBaaUFvSVhSaGNtZGxkQ2tnZTF4dUlDQWdJQ0FnY21WMGRYSnVYRzRnSUNBZ2ZWeHVYRzRnSUNBZ1kyOXVjM1FnWkdGMFlWUnZaMmRzWlVGMGRISWdQU0IwWVhKblpYUXVaMlYwUVhSMGNtbGlkWFJsS0Nka1lYUmhMWFJ2WjJkc1pTY3BYRzVjYmlBZ0lDQnBaaUFvWkdGMFlWUnZaMmRzWlVGMGRISWdKaVlnWkdGMFlWUnZaMmRzWlVGMGRISWdQVDA5SUU1QlRVVXBJSHRjYmlBZ0lDQWdJR3hsZENCcFpDQTlJSFJoY21kbGRDNW5aWFJCZEhSeWFXSjFkR1VvSjJSaGRHRXRkR0Z5WjJWMEp5a2dmSHdnZEdGeVoyVjBMbWRsZEVGMGRISnBZblYwWlNnbmFISmxaaWNwWEc0Z0lDQWdJQ0JwWkNBOUlHbGtMbkpsY0d4aFkyVW9KeU1uTENBbkp5bGNibHh1SUNBZ0lDQWdZMjl1YzNRZ1kyOXRjRzl1Wlc1MElEMGdZMjl0Y0c5dVpXNTBjeTVtYVc1a0tHTWdQVDRnWXk1blpYUkZiR1Z0Wlc1MEtDa3VaMlYwUVhSMGNtbGlkWFJsS0NkcFpDY3BJRDA5UFNCcFpDbGNibHh1SUNBZ0lDQWdhV1lnS0NGamIyMXdiMjVsYm5RcElIdGNiaUFnSUNBZ0lDQWdjbVYwZFhKdVhHNGdJQ0FnSUNCOVhHNWNiaUFnSUNBZ0lHTnZiWEJ2Ym1WdWRDNTBiMmRuYkdVb0tWeHVJQ0FnSUgxY2JpQWdmU2xjYmx4dUlDQnlaWFIxY200Z1EyOXNiR0Z3YzJWY2JuMHBLQ2xjYmx4dVpYaHdiM0owSUdSbFptRjFiSFFnUTI5c2JHRndjMlZjYmlJc0lpOHFLbHh1SUNvZ0xTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMWNiaUFxSUV4cFkyVnVjMlZrSUhWdVpHVnlJRTFKVkNBb2FIUjBjSE02THk5bmFYUm9kV0l1WTI5dEwzRjFZWEpyTFdSbGRpOVFhRzl1YjI0dFJuSmhiV1YzYjNKckwySnNiMkl2YldGemRHVnlMMHhKUTBWT1UwVXBYRzRnS2lBdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExWeHVJQ292WEc1cGJYQnZjblFnZXlCa2FYTndZWFJqYUVWc1pXMWxiblJGZG1WdWRDd2daR2x6Y0dGMFkyaFhhVzVFYjJORmRtVnVkQ0I5SUdaeWIyMGdKeTR1TDJOdmJXMXZiaTlsZG1WdWRITXZaR2x6Y0dGMFkyZ25YRzVwYlhCdmNuUWdleUJuWlc1bGNtRjBaVWxrSUgwZ1puSnZiU0FuTGk0dlkyOXRiVzl1TDNWMGFXeHpKMXh1YVcxd2IzSjBJRVYyWlc1MElHWnliMjBnSnk0dUwyTnZiVzF2Ymk5bGRtVnVkSE1uWEc1cGJYQnZjblFnUTI5dGNHOXVaVzUwVFdGdVlXZGxjaXdnZXlCelpYUkJkSFJ5YVdKMWRHVnpRMjl1Wm1sbkxDQm5aWFJCZEhSeWFXSjFkR1Z6UTI5dVptbG5JSDBnWm5KdmJTQW5MaTlqYjIxd2IyNWxiblJOWVc1aFoyVnlKMXh1WEc0dktpcGNiaUFxSUMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFZ4dUlDb2dRMnhoYzNNZ1JHVm1hVzVwZEdsdmJseHVJQ29nTFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0WEc0Z0tpOWNibHh1Wlhod2IzSjBJR1JsWm1GMWJIUWdZMnhoYzNNZ1EyOXRjRzl1Wlc1MElIdGNibHh1SUNCamIyNXpkSEoxWTNSdmNpaHVZVzFsTENCMlpYSnphVzl1TENCa1pXWmhkV3gwVDNCMGFXOXVjeUE5SUh0OUxDQnZjSFJwYjI1eklEMGdlMzBzSUc5d2RHbHZia0YwZEhKeklEMGdXMTBzSUhOMWNIQnZjblJFZVc1aGJXbGpSV3hsYldWdWRDQTlJR1poYkhObExDQmhaR1JVYjFOMFlXTnJJRDBnWm1Gc2MyVXBJSHRjYmlBZ0lDQjBhR2x6TG01aGJXVWdQU0J1WVcxbFhHNGdJQ0FnZEdocGN5NTJaWEp6YVc5dUlEMGdkbVZ5YzJsdmJseHVJQ0FnSUhSb2FYTXViM0IwYVc5dWN5QTlJRzl3ZEdsdmJuTmNibHh1SUNBZ0lDOHZJRUIwYjJSdklHdGxaWEEvWEc0Z0lDQWdMeThnZEdocGN5NXZjSFJwYjI1eklEMGdUMkpxWldOMExtRnpjMmxuYmloa1pXWmhkV3gwVDNCMGFXOXVjeXdnYjNCMGFXOXVjeWxjYmlBZ0lDQlBZbXBsWTNRdWEyVjVjeWhrWldaaGRXeDBUM0IwYVc5dWN5a3VabTl5UldGamFDZ29jSEp2Y0NrZ1BUNGdlMXh1SUNBZ0lDQWdhV1lnS0hSNWNHVnZaaUIwYUdsekxtOXdkR2x2Ym5OYmNISnZjRjBnUFQwOUlDZDFibVJsWm1sdVpXUW5LU0I3WEc0Z0lDQWdJQ0FnSUhSb2FYTXViM0IwYVc5dWMxdHdjbTl3WFNBOUlHUmxabUYxYkhSUGNIUnBiMjV6VzNCeWIzQmRYRzRnSUNBZ0lDQjlYRzRnSUNBZ2ZTbGNibHh1SUNBZ0lIUm9hWE11YjNCMGFXOXVRWFIwY25NZ1BTQnZjSFJwYjI1QmRIUnljMXh1SUNBZ0lIUm9hWE11YzNWd2NHOXlkRVI1Ym1GdGFXTkZiR1Z0Wlc1MElEMGdjM1Z3Y0c5eWRFUjVibUZ0YVdORmJHVnRaVzUwWEc0Z0lDQWdkR2hwY3k1aFpHUlViMU4wWVdOcklEMGdZV1JrVkc5VGRHRmphMXh1SUNBZ0lIUm9hWE11YVdRZ1BTQm5aVzVsY21GMFpVbGtLQ2xjYmx4dUlDQWdJR052Ym5OMElHTm9aV05yUld4bGJXVnVkQ0E5SUNGMGFHbHpMbk4xY0hCdmNuUkVlVzVoYldsalJXeGxiV1Z1ZENCOGZDQjBhR2x6TG05d2RHbHZibk11Wld4bGJXVnVkQ0FoUFQwZ2JuVnNiRnh1WEc0Z0lDQWdhV1lnS0hSNWNHVnZaaUIwYUdsekxtOXdkR2x2Ym5NdVpXeGxiV1Z1ZENBOVBUMGdKM04wY21sdVp5Y3BJSHRjYmlBZ0lDQWdJSFJvYVhNdWIzQjBhVzl1Y3k1bGJHVnRaVzUwSUQwZ1pHOWpkVzFsYm5RdWNYVmxjbmxUWld4bFkzUnZjaWgwYUdsekxtOXdkR2x2Ym5NdVpXeGxiV1Z1ZENsY2JpQWdJQ0I5WEc1Y2JpQWdJQ0JwWmlBb1kyaGxZMnRGYkdWdFpXNTBJQ1ltSUNGMGFHbHpMbTl3ZEdsdmJuTXVaV3hsYldWdWRDa2dlMXh1SUNBZ0lDQWdkR2h5YjNjZ2JtVjNJRVZ5Y205eUtHQWtlM1JvYVhNdWJtRnRaWDB1SUZSb1pTQmxiR1Z0Wlc1MElHbHpJRzV2ZENCaElFaFVUVXhGYkdWdFpXNTBMbUFwWEc0Z0lDQWdmVnh1WEc0Z0lDQWdkR2hwY3k1a2VXNWhiV2xqUld4bGJXVnVkQ0E5SUhSb2FYTXViM0IwYVc5dWN5NWxiR1Z0Wlc1MElEMDlQU0J1ZFd4c1hHNGdJQ0FnZEdocGN5NXlaV2RwYzNSbGNtVmtSV3hsYldWdWRITWdQU0JiWFZ4dVhHNGdJQ0FnYVdZZ0tDRjBhR2x6TG1SNWJtRnRhV05GYkdWdFpXNTBLU0I3WEc0Z0lDQWdJQ0F2S2lwY2JpQWdJQ0FnSUNBcUlHbG1JSFJvWlNCbGJHVnRaVzUwSUdWNGFYTjBjeXdnZDJVZ2NtVmhaQ0IwYUdVZ1pHRjBZU0JoZEhSeWFXSjFkR1Z6SUdOdmJtWnBaMXh1SUNBZ0lDQWdJQ29nZEdobGJpQjNaU0J2ZG1WeWQzSnBkR1VnWlhocGMzUnBibWNnWTI5dVptbG5JR3RsZVhNZ2FXNGdTbUYyWVZOamNtbHdkQ3dnYzI4Z2RHaGhkRnh1SUNBZ0lDQWdJQ29nZDJVZ2EyVmxjQ0IwYUdVZ1ptOXNiRzkzYVc1bklHOXlaR1Z5WEc0Z0lDQWdJQ0FnS2lCYk1WMGdaR1ZtWVhWc2RDQktZWFpoVTJOeWFYQjBJR052Ym1acFozVnlZWFJwYjI0Z2IyWWdkR2hsSUdOdmJYQnZibVZ1ZEZ4dUlDQWdJQ0FnSUNvZ1d6SmRJRVJoZEdFZ1lYUjBjbWxpZFhSbGN5QmpiMjVtYVdkMWNtRjBhVzl1SUdsbUlIUm9aU0JsYkdWdFpXNTBJR1Y0YVhOMGN5QnBiaUIwYUdVZ1JFOU5YRzRnSUNBZ0lDQWdLaUJiTTEwZ1NtRjJZVk5qY21sd2RDQmpiMjVtYVdkMWNtRjBhVzl1WEc0Z0lDQWdJQ0FnS2k5Y2JpQWdJQ0FnSUhSb2FYTXViM0IwYVc5dWN5QTlJRTlpYW1WamRDNWhjM05wWjI0b2RHaHBjeTV2Y0hScGIyNXpMQ0IwYUdsekxtRnpjMmxuYmtwelEyOXVabWxuS0hSb2FYTXVaMlYwUVhSMGNtbGlkWFJsY3lncExDQnZjSFJwYjI1ektTbGNibHh1SUNBZ0lDQWdMeThnZEdobGJpd2djMlYwSUhSb1pTQnVaWGNnWkdGMFlTQmhkSFJ5YVdKMWRHVnpJSFJ2SUhSb1pTQmxiR1Z0Wlc1MFhHNGdJQ0FnSUNCMGFHbHpMbk5sZEVGMGRISnBZblYwWlhNb0tWeHVJQ0FnSUgxY2JseHVJQ0FnSUhSb2FYTXVaV3hsYldWdWRFeHBjM1JsYm1WeUlEMGdaWFpsYm5RZ1BUNGdkR2hwY3k1dmJrSmxabTl5WlVWc1pXMWxiblJGZG1WdWRDaGxkbVZ1ZENrZ0lDQWdJQ0FnSUNBZ1hHNGdJSDFjYmx4dUlDQmhjM05wWjI1S2MwTnZibVpwWnloaGRIUnlRMjl1Wm1sbkxDQnZjSFJwYjI1ektTQjdYRzRnSUNBZ2RHaHBjeTV2Y0hScGIyNUJkSFJ5Y3k1bWIzSkZZV05vS0NoclpYa3BJRDArSUh0Y2JpQWdJQ0FnSUdsbUlDaHZjSFJwYjI1elcydGxlVjBwSUh0Y2JpQWdJQ0FnSUNBZ1lYUjBja052Ym1acFoxdHJaWGxkSUQwZ2IzQjBhVzl1YzF0clpYbGRYRzRnSUNBZ0lDQjlYRzRnSUNBZ2ZTbGNibHh1SUNBZ0lISmxkSFZ5YmlCaGRIUnlRMjl1Wm1sblhHNGdJSDFjYmx4dUlDQm5aWFJXWlhKemFXOXVLQ2tnZTF4dUlDQWdJSEpsZEhWeWJpQjBhR2x6TG5abGNuTnBiMjVjYmlBZ2ZWeHVYRzRnSUdkbGRFVnNaVzFsYm5Rb0tTQjdYRzRnSUNBZ2NtVjBkWEp1SUhSb2FYTXViM0IwYVc5dWN5NWxiR1Z0Wlc1MFhHNGdJSDFjYmx4dUlDQm5aWFJKWkNncElIdGNiaUFnSUNCeVpYUjFjbTRnZEdocGN5NXBaRnh1SUNCOVhHNWNiaUFnY21WbmFYTjBaWEpGYkdWdFpXNTBjeWhsYkdWdFpXNTBjeWtnZTF4dUlDQWdJR1ZzWlcxbGJuUnpMbVp2Y2tWaFkyZ29aV3hsYldWdWRDQTlQaUIwYUdsekxuSmxaMmx6ZEdWeVJXeGxiV1Z1ZENobGJHVnRaVzUwS1NsY2JpQWdmVnh1WEc0Z0lISmxaMmx6ZEdWeVJXeGxiV1Z1ZENobGJHVnRaVzUwS1NCN1hHNGdJQ0FnWld4bGJXVnVkQzUwWVhKblpYUXVZV1JrUlhabGJuUk1hWE4wWlc1bGNpaGxiR1Z0Wlc1MExtVjJaVzUwTENCMGFHbHpMbVZzWlcxbGJuUk1hWE4wWlc1bGNpbGNiaUFnSUNCMGFHbHpMbkpsWjJsemRHVnlaV1JGYkdWdFpXNTBjeTV3ZFhOb0tHVnNaVzFsYm5RcFhHNGdJSDFjYmx4dUlDQjFibkpsWjJsemRHVnlSV3hsYldWdWRITW9LU0I3WEc0Z0lDQWdkR2hwY3k1eVpXZHBjM1JsY21Wa1JXeGxiV1Z1ZEhNdVptOXlSV0ZqYUNnb1pXeGxiV1Z1ZENrZ1BUNGdlMXh1SUNBZ0lDQWdkR2hwY3k1MWJuSmxaMmx6ZEdWeVJXeGxiV1Z1ZENobGJHVnRaVzUwS1Z4dUlDQWdJSDBwWEc0Z0lIMWNibHh1SUNCMWJuSmxaMmx6ZEdWeVJXeGxiV1Z1ZENobGJHVnRaVzUwS1NCN1hHNGdJQ0FnWTI5dWMzUWdjbVZuYVhOMFpYSmxaRVZzWlcxbGJuUkpibVJsZUNBOUlIUm9hWE11Y21WbmFYTjBaWEpsWkVWc1pXMWxiblJ6WEc0Z0lDQWdJQ0F1Wm1sdVpFbHVaR1Y0S0dWc0lEMCtJR1ZzTG5SaGNtZGxkQ0E5UFQwZ1pXeGxiV1Z1ZEM1MFlYSm5aWFFnSmlZZ1pXd3VaWFpsYm5RZ1BUMDlJR1ZzWlcxbGJuUXVaWFpsYm5RcFhHNWNiaUFnSUNCcFppQW9jbVZuYVhOMFpYSmxaRVZzWlcxbGJuUkpibVJsZUNBK0lDMHhLU0I3WEc0Z0lDQWdJQ0JsYkdWdFpXNTBMblJoY21kbGRDNXlaVzF2ZG1WRmRtVnVkRXhwYzNSbGJtVnlLR1ZzWlcxbGJuUXVaWFpsYm5Rc0lIUm9hWE11Wld4bGJXVnVkRXhwYzNSbGJtVnlLVnh1SUNBZ0lDQWdkR2hwY3k1eVpXZHBjM1JsY21Wa1JXeGxiV1Z1ZEhNdWMzQnNhV05sS0hKbFoybHpkR1Z5WldSRmJHVnRaVzUwU1c1a1pYZ3NJREVwWEc0Z0lDQWdmU0JsYkhObElIdGNiaUFnSUNBZ0lHTnZibk52YkdVdVpYSnliM0lvWUZkaGNtNXBibWNoSUZWdWEyNXZkMjRnY21WbmFYTjBaWEpsWkNCbGJHVnRaVzUwT2lBa2UyVnNaVzFsYm5RdWRHRnlaMlYwZlNCM2FYUm9JR1YyWlc1ME9pQWtlMlZzWlcxbGJuUXVaWFpsYm5SOUxtQXBYRzRnSUNBZ2ZWeHVJQ0I5WEc1Y2JpQWdkSEpwWjJkbGNrVjJaVzUwS0dWMlpXNTBUbUZ0WlN3Z1pHVjBZV2xzSUQwZ2UzMHNJRzlpYW1WamRFVjJaVzUwVDI1c2VTQTlJR1poYkhObEtTQjdYRzRnSUNBZ2FXWWdLSFI1Y0dWdlppQmxkbVZ1ZEU1aGJXVWdJVDA5SUNkemRISnBibWNuS1NCN1hHNGdJQ0FnSUNCMGFISnZkeUJ1WlhjZ1JYSnliM0lvSjFSb1pTQmxkbVZ1ZENCdVlXMWxJR2x6SUc1dmRDQjJZV3hwWkM0bktWeHVJQ0FnSUgxY2JseHVJQ0FnSUdsbUlDaDBhR2x6TG1Ga1pGUnZVM1JoWTJzcElIdGNiaUFnSUNBZ0lHbG1JQ2hsZG1WdWRFNWhiV1VnUFQwOUlFVjJaVzUwTGxOSVQxY3BJSHRjYmlBZ0lDQWdJQ0FnUTI5dGNHOXVaVzUwVFdGdVlXZGxjaTVoWkdRb2RHaHBjeWxjYmlBZ0lDQWdJSDBnWld4elpTQnBaaUFvWlhabGJuUk9ZVzFsSUQwOVBTQkZkbVZ1ZEM1SVNVUkZLU0I3WEc0Z0lDQWdJQ0FnSUVOdmJYQnZibVZ1ZEUxaGJtRm5aWEl1Y21WdGIzWmxLSFJvYVhNcFhHNGdJQ0FnSUNCOVhHNGdJQ0FnZlZ4dVhHNGdJQ0FnTHk4Z1pYWmxiblFnYm1GdFpYTWdZMkZ1SUdKbElIZHBkR2dnWkc5MElHNXZkR0YwYVc5dUlHeHBhMlVnY21WamIyNXVaV04wYVc1bkxuTjFZMk5sYzNOY2JpQWdJQ0JqYjI1emRDQmxkbVZ1ZEU1aGJXVlBZbXBsWTNRZ1BTQmxkbVZ1ZEU1aGJXVXVjM0JzYVhRb0p5NG5LUzV5WldSMVkyVW9LR0ZqWXl3Z1kzVnljbVZ1ZEN3Z2FXNWtaWGdwSUQwK0lIdGNiaUFnSUNBZ0lHbG1JQ2hwYm1SbGVDQTlQVDBnTUNrZ2UxeHVJQ0FnSUNBZ0lDQnlaWFIxY200Z1kzVnljbVZ1ZEZ4dUlDQWdJQ0FnZlZ4dVhHNGdJQ0FnSUNCeVpYUjFjbTRnWVdOaklDc2dZM1Z5Y21WdWRDNWphR0Z5UVhRb01Da3VkRzlWY0hCbGNrTmhjMlVvS1NBcklHTjFjbkpsYm5RdWMyeHBZMlVvTVNsY2JpQWdJQ0I5S1Z4dVhHNGdJQ0FnWTI5dWMzUWdaWFpsYm5ST1lXMWxRV3hwWVhNZ1BTQmdiMjRrZTJWMlpXNTBUbUZ0WlU5aWFtVmpkQzVqYUdGeVFYUW9NQ2t1ZEc5VmNIQmxja05oYzJVb0tYMGtlMlYyWlc1MFRtRnRaVTlpYW1WamRDNXpiR2xqWlNneEtYMWdYRzVjYmlBZ0lDQXZMeUJ2WW1wbFkzUWdaWFpsYm5SY2JpQWdJQ0JwWmlBb2RIbHdaVzltSUhSb2FYTXViM0IwYVc5dWMxdGxkbVZ1ZEU1aGJXVlBZbXBsWTNSZElEMDlQU0FuWm5WdVkzUnBiMjRuS1NCN1hHNGdJQ0FnSUNCMGFHbHpMbTl3ZEdsdmJuTmJaWFpsYm5ST1lXMWxUMkpxWldOMFhTNWhjSEJzZVNoMGFHbHpMQ0JiWkdWMFlXbHNYU2xjYmlBZ0lDQjlYRzVjYmlBZ0lDQnBaaUFvZEhsd1pXOW1JSFJvYVhNdWIzQjBhVzl1YzF0bGRtVnVkRTVoYldWQmJHbGhjMTBnUFQwOUlDZG1kVzVqZEdsdmJpY3BJSHRjYmlBZ0lDQWdJSFJvYVhNdWIzQjBhVzl1YzF0bGRtVnVkRTVoYldWQmJHbGhjMTB1WVhCd2JIa29kR2hwY3l3Z1cyUmxkR0ZwYkYwcFhHNGdJQ0FnZlZ4dVhHNGdJQ0FnYVdZZ0tHOWlhbVZqZEVWMlpXNTBUMjVzZVNrZ2UxeHVJQ0FnSUNBZ2NtVjBkWEp1WEc0Z0lDQWdmVnh1WEc0Z0lDQWdMeThnWkc5dElHVjJaVzUwWEc0Z0lDQWdhV1lnS0hSb2FYTXViM0IwYVc5dWN5NWxiR1Z0Wlc1MEtTQjdYRzRnSUNBZ0lDQmthWE53WVhSamFFVnNaVzFsYm5SRmRtVnVkQ2gwYUdsekxtOXdkR2x2Ym5NdVpXeGxiV1Z1ZEN3Z1pYWmxiblJPWVcxbExDQjBhR2x6TG01aGJXVXNJR1JsZEdGcGJDbGNiaUFnSUNCOUlHVnNjMlVnZTF4dUlDQWdJQ0FnWkdsemNHRjBZMmhYYVc1RWIyTkZkbVZ1ZENobGRtVnVkRTVoYldVc0lIUm9hWE11Ym1GdFpTd2daR1YwWVdsc0tWeHVJQ0FnSUgxY2JpQWdmVnh1WEc0Z0lITmxkRUYwZEhKcFluVjBaWE1vS1NCN1hHNGdJQ0FnYVdZZ0tIUm9hWE11YjNCMGFXOXVRWFIwY25NdWJHVnVaM1JvSUQ0Z01Da2dlMXh1SUNBZ0lDQWdjMlYwUVhSMGNtbGlkWFJsYzBOdmJtWnBaeWgwYUdsekxtOXdkR2x2Ym5NdVpXeGxiV1Z1ZEN3Z2RHaHBjeTV2Y0hScGIyNXpMQ0IwYUdsekxtOXdkR2x2YmtGMGRISnpLVnh1SUNBZ0lIMWNiaUFnZlZ4dVhHNGdJR2RsZEVGMGRISnBZblYwWlhNb0tTQjdYRzRnSUNBZ1kyOXVjM1FnYjNCMGFXOXVjeUE5SUU5aWFtVmpkQzVoYzNOcFoyNG9lMzBzSUhSb2FYTXViM0IwYVc5dWN5bGNiaUFnSUNCeVpYUjFjbTRnWjJWMFFYUjBjbWxpZFhSbGMwTnZibVpwWnloMGFHbHpMbTl3ZEdsdmJuTXVaV3hsYldWdWRDd2diM0IwYVc5dWN5d2dkR2hwY3k1dmNIUnBiMjVCZEhSeWN5bGNiaUFnZlZ4dVhHNGdJQzhxS2x4dUlDQWdLaUIwYUdVZ2NISmxkbVZ1ZEVOc2IzTmhZbXhsSUcxbGRHaHZaQ0J0WVc1aFoyVnpJR052Ym1OMWNuSmxibU41SUdKbGRIZGxaVzRnWVdOMGFYWmxJR052YlhCdmJtVnVkSE11WEc0Z0lDQXFJRVp2Y2lCbGVHRnRjR3hsTENCcFppQjBhR1Z5WlNCcGN5QmhJSE5vYjNkdUlHOW1aaTFqWVc1MllYTWdZVzVrSUdScFlXeHZaeXdnZEdobElHeGhjM1JjYmlBZ0lDb2djMmh2ZDI0Z1kyOXRjRzl1Wlc1MElHZGhhVzV6SUhSb1pTQndjbTlqWlhOemFXNW5JSEJ5YVc5eWFYUjVYRzRnSUNBcUwxeHVJQ0J3Y21WMlpXNTBRMnh2YzJGaWJHVW9LU0I3WEc0Z0lDQWdjbVYwZFhKdUlIUm9hWE11WVdSa1ZHOVRkR0ZqYXlBbUppQWhRMjl0Y0c5dVpXNTBUV0Z1WVdkbGNpNWpiRzl6WVdKc1pTaDBhR2x6S1Z4dUlDQjlYRzVjYmlBZ2IyNUNaV1p2Y21WRmJHVnRaVzUwUlhabGJuUW9aWFpsYm5RcElIdGNiaUFnSUNCcFppQW9kR2hwY3k1d2NtVjJaVzUwUTJ4dmMyRmliR1VvS1NrZ2UxeHVJQ0FnSUNBZ2NtVjBkWEp1WEc0Z0lDQWdmVnh1WEc0Z0lDQWdkR2hwY3k1dmJrVnNaVzFsYm5SRmRtVnVkQ2hsZG1WdWRDbGNiaUFnZlZ4dVhHNGdJRzl1Uld4bGJXVnVkRVYyWlc1MEtHVjJaVzUwS1NCN1hHNGdJQ0FnTHk5Y2JpQWdmVnh1WEc0Z0lITjBZWFJwWXlCcFpHVnVkR2xtYVdWeUtDa2dlMXh1SUNBZ0lISmxkSFZ5YmlCMGFHbHpMbTVoYldWY2JpQWdmVnh1WEc0Z0lITjBZWFJwWXlCZlJFOU5TVzUwWlhKbVlXTmxLRU52YlhCdmJtVnVkRU5zWVhOekxDQnZjSFJwYjI1ektTQjdYRzRnSUNBZ2NtVjBkWEp1SUc1bGR5QkRiMjF3YjI1bGJuUkRiR0Z6Y3lodmNIUnBiMjV6S1Z4dUlDQjlYRzU5WEc0aUxDSmNibU52Ym5OMElHZGxkRUYwZEhKcFluVjBaU0E5SUNobWFYSnpkQ3dnYzJWamIyNWtLU0E5UGlCN1hHNGdJR2xtSUNobWFYSnpkQ0E5UFQwZ0p5Y3BJSHRjYmlBZ0lDQnlaWFIxY200Z1lHUmhkR0V0Skh0elpXTnZibVI5WUZ4dUlDQjlYRzRnSUhKbGRIVnliaUJnWkdGMFlTMGtlMlpwY25OMGZTMGtlM05sWTI5dVpIMWdYRzU5WEc1Y2JtVjRjRzl5ZENCbWRXNWpkR2x2YmlCelpYUkJkSFJ5YVdKMWRHVnpRMjl1Wm1sbktHVnNaVzFsYm5Rc0lHOWlhaUE5SUh0OUxDQmhkSFJ5Y3l3Z2MzUmhjblFnUFNBbkp5a2dlMXh1SUNCamIyNXpkQ0JyWlhseklEMGdUMkpxWldOMExtdGxlWE1vYjJKcUtWeHVYRzRnSUd0bGVYTXVabTl5UldGamFDZ29hMlY1S1NBOVBpQjdYRzRnSUNBZ2FXWWdLSE4wWVhKMElEMDlQU0FuSnlBbUppQmhkSFJ5Y3k1cGJtUmxlRTltS0d0bGVTa2dQVDA5SUMweEtTQjdYRzRnSUNBZ0lDQXZMeUJqYjI1MGFXNTFaU0IzYVhSb0lHNWxlSFFnYVhSbGNtRjBhVzl1WEc0Z0lDQWdJQ0J5WlhSMWNtNWNiaUFnSUNCOVhHNWNiaUFnSUNCcFppQW9kSGx3Wlc5bUlHOWlhbHRyWlhsZElEMDlQU0FuYjJKcVpXTjBKeUFtSmlCdlltcGJhMlY1WFNBaFBUMGdiblZzYkNrZ2UxeHVJQ0FnSUNBZ2JHVjBJR3RsZVZOMFlYSjBJRDBnYTJWNVhHNGdJQ0FnSUNCcFppQW9jM1JoY25RZ0lUMDlJQ2NuS1NCN1hHNGdJQ0FnSUNBZ0lHdGxlVk4wWVhKMElEMGdZQ1I3YzNSaGNuUjlMU1I3YTJWNWZXQmNiaUFnSUNBZ0lIMWNibHh1SUNBZ0lDQWdjMlYwUVhSMGNtbGlkWFJsYzBOdmJtWnBaeWhsYkdWdFpXNTBMQ0J2WW1wYmEyVjVYU3dnWVhSMGNuTXNJR3RsZVZOMFlYSjBLVnh1SUNBZ0lDQWdjbVYwZFhKdVhHNGdJQ0FnZlZ4dVhHNGdJQ0FnWTI5dWMzUWdZWFIwY2lBOUlHZGxkRUYwZEhKcFluVjBaU2h6ZEdGeWRDd2dhMlY1S1Z4dUlDQWdJR1ZzWlcxbGJuUXVjMlYwUVhSMGNtbGlkWFJsS0dGMGRISXNJRzlpYWx0clpYbGRLVnh1SUNCOUtWeHVmVnh1WEc1bGVIQnZjblFnWm5WdVkzUnBiMjRnWjJWMFFYUjBjbWxpZFhSbGMwTnZibVpwWnlobGJHVnRaVzUwTENCdlltb2dQU0I3ZlN3Z1lYUjBjbk1zSUhOMFlYSjBJRDBnSnljcElIdGNiaUFnWTI5dWMzUWdibVYzVDJKcUlEMGdUMkpxWldOMExtRnpjMmxuYmloN2ZTd2diMkpxS1Z4dUlDQmpiMjV6ZENCclpYbHpJRDBnVDJKcVpXTjBMbXRsZVhNb2IySnFLVnh1WEc0Z0lHdGxlWE11Wm05eVJXRmphQ2dvYTJWNUtTQTlQaUI3WEc0Z0lDQWdhV1lnS0hOMFlYSjBJRDA5UFNBbkp5QW1KaUJoZEhSeWN5NXBibVJsZUU5bUtHdGxlU2tnUFQwOUlDMHhLU0I3WEc0Z0lDQWdJQ0F2THlCamIyNTBhVzUxWlNCM2FYUm9JRzVsZUhRZ2FYUmxjbUYwYVc5dVhHNGdJQ0FnSUNCeVpYUjFjbTVjYmlBZ0lDQjlYRzVjYmlBZ0lDQnBaaUFvYjJKcVcydGxlVjBnSVQwOUlHNTFiR3dnSmlZZ2IySnFXMnRsZVYwdVkyOXVjM1J5ZFdOMGIzSWdQVDA5SUU5aWFtVmpkQ2tnZTF4dUlDQWdJQ0FnYkdWMElHdGxlVk4wWVhKMElEMGdhMlY1WEc0Z0lDQWdJQ0JwWmlBb2MzUmhjblFnSVQwOUlDY25LU0I3WEc0Z0lDQWdJQ0FnSUd0bGVWTjBZWEowSUQwZ1lDUjdjM1JoY25SOUxTUjdhMlY1ZldCY2JpQWdJQ0FnSUgxY2JseHVJQ0FnSUNBZ2JtVjNUMkpxVzJ0bGVWMGdQU0JuWlhSQmRIUnlhV0oxZEdWelEyOXVabWxuS0dWc1pXMWxiblFzSUc5aWFsdHJaWGxkTENCaGRIUnljeXdnYTJWNVUzUmhjblFwWEc0Z0lDQWdJQ0J5WlhSMWNtNWNiaUFnSUNCOVhHNWNiaUFnSUNBdkx5QjFjR1JoZEdVZ2RtRnNkV1ZjYmlBZ0lDQnNaWFFnZG1Gc2RXVWdQU0J2WW1wYmEyVjVYU0F2THlCa1pXWmhkV3gwSUhaaGJIVmxYRzRnSUNBZ1kyOXVjM1FnZEhsd1pTQTlJSFI1Y0dWdlppQjJZV3gxWlZ4dUlDQWdJR052Ym5OMElHRjBkSElnUFNCblpYUkJkSFJ5YVdKMWRHVW9jM1JoY25Rc0lHdGxlU2xjYmlBZ0lDQmpiMjV6ZENCaGRIUnlWbUZzZFdVZ1BTQmxiR1Z0Wlc1MExtZGxkRUYwZEhKcFluVjBaU2hoZEhSeUtWeHVYRzRnSUNBZ2FXWWdLR0YwZEhKV1lXeDFaU0FoUFQwZ2JuVnNiQ2tnZTF4dUlDQWdJQ0FnYVdZZ0tIUjVjR1VnUFQwOUlDZGliMjlzWldGdUp5a2dlMXh1SUNBZ0lDQWdJQ0F2THlCamIyNTJaWEowSUhOMGNtbHVaeUIwYnlCaWIyOXNaV0Z1WEc0Z0lDQWdJQ0FnSUhaaGJIVmxJRDBnWVhSMGNsWmhiSFZsSUQwOVBTQW5kSEoxWlNkY2JpQWdJQ0FnSUgwZ1pXeHpaU0JwWmlBb0lXbHpUbUZPS0dGMGRISldZV3gxWlNrcElIdGNiaUFnSUNBZ0lDQWdkbUZzZFdVZ1BTQndZWEp6WlVsdWRDaGhkSFJ5Vm1Gc2RXVXNJREV3S1Z4dUlDQWdJQ0FnZlNCbGJITmxJSHRjYmlBZ0lDQWdJQ0FnZG1Gc2RXVWdQU0JoZEhSeVZtRnNkV1ZjYmlBZ0lDQWdJSDFjYmlBZ0lDQjlYRzVjYmlBZ0lDQnVaWGRQWW1wYmEyVjVYU0E5SUhaaGJIVmxYRzRnSUgwcFhHNWNiaUFnY21WMGRYSnVJRzVsZDA5aWFseHVmVnh1WEc1amIyNXpkQ0J6ZEdGamF5QTlJRnRkWEc1Y2JtVjRjRzl5ZENCa1pXWmhkV3gwSUh0Y2JpQWdZV1JrS0dOdmJYQnZibVZ1ZENrZ2UxeHVJQ0FnSUhOMFlXTnJMbkIxYzJnb1kyOXRjRzl1Wlc1MEtWeHVJQ0I5TEZ4dUlDQnlaVzF2ZG1Vb1kyOXRjRzl1Wlc1MEtTQjdYRzRnSUNBZ1kyOXVjM1FnYVc1a1pYZ2dQU0J6ZEdGamF5NW1hVzVrU1c1a1pYZ29ZeUE5UGlCUFltcGxZM1F1YVhNb1kyOXRjRzl1Wlc1MExDQmpLU2xjYmlBZ0lDQnBaaUFvYVc1a1pYZ2dQaUF0TVNrZ2UxeHVJQ0FnSUNBZ2MzUmhZMnN1YzNCc2FXTmxLR2x1WkdWNExDQXhLVnh1SUNBZ0lIMWNiaUFnZlN4Y2JpQWdZMnh2YzJGaWJHVW9ZMjl0Y0c5dVpXNTBLU0I3WEc0Z0lDQWdjbVYwZFhKdUlITjBZV05yTG14bGJtZDBhQ0E5UFQwZ01DQjhmQ0JQWW1wbFkzUXVhWE1vYzNSaFkydGJjM1JoWTJzdWJHVnVaM1JvSUMwZ01WMHNJR052YlhCdmJtVnVkQ2xjYmlBZ2ZWeHVmVnh1SWl3aUx5b3FYRzRnS2lBdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExWeHVJQ29nVEdsalpXNXpaV1FnZFc1a1pYSWdUVWxVSUNob2RIUndjem92TDJkcGRHaDFZaTVqYjIwdmNYVmhjbXN0WkdWMkwxQm9iMjV2YmkxR2NtRnRaWGR2Y21zdllteHZZaTl0WVhOMFpYSXZURWxEUlU1VFJTbGNiaUFxSUMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdFhHNGdLaTljYm1sdGNHOXlkQ0JFYVdGc2IyY2dabkp2YlNBbkxpOXBibVJsZUNkY2JtbHRjRzl5ZENCN0lHZGxkRUYwZEhKcFluVjBaWE5EYjI1bWFXY2dmU0JtY205dElDY3VMaTlqYjIxd2IyNWxiblJOWVc1aFoyVnlKMXh1WEc1amIyNXpkQ0JEYjI1bWFYSnRJRDBnS0NncElEMCtJSHRjYmx4dUlDQXZLaXBjYmlBZ0lDb2dMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRYRzRnSUNBcUlFTnZibk4wWVc1MGMxeHVJQ0FnS2lBdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMxY2JpQWdJQ292WEc1Y2JpQWdZMjl1YzNRZ1RrRk5SU0E5SUNkamIyNW1hWEp0SjF4dUlDQmpiMjV6ZENCRVJVWkJWVXhVWDFCU1QxQkZVbFJKUlZNZ1BTQjdYRzRnSUNBZ1pXeGxiV1Z1ZERvZ2JuVnNiQ3hjYmlBZ0lDQjBhWFJzWlRvZ2JuVnNiQ3hjYmlBZ0lDQnRaWE56WVdkbE9pQnVkV3hzTEZ4dUlDQWdJR05oYm1ObGJHRmliR1U2SUhSeWRXVXNYRzRnSUNBZ2RIbHdaVG9nVGtGTlJTeGNiaUFnSUNCaWRYUjBiMjV6T2lCYlhHNGdJQ0FnSUNCN1hHNGdJQ0FnSUNBZ0lHVjJaVzUwT2lBblkyRnVZMlZzSnl4Y2JpQWdJQ0FnSUNBZ2RHVjRkRG9nSjBOaGJtTmxiQ2NzWEc0Z0lDQWdJQ0FnSUdScGMyMXBjM002SUhSeWRXVXNYRzRnSUNBZ0lDQWdJR05zWVhOek9pQW5ZblJ1SUdKMGJpMXpaV052Ym1SaGNua25MRnh1SUNBZ0lDQWdmU3hjYmlBZ0lDQWdJSHRjYmlBZ0lDQWdJQ0FnWlhabGJuUTZJQ2RqYjI1bWFYSnRKeXhjYmlBZ0lDQWdJQ0FnZEdWNGREb2dKMDlySnl4Y2JpQWdJQ0FnSUNBZ1pHbHpiV2x6Y3pvZ2RISjFaU3hjYmlBZ0lDQWdJQ0FnWTJ4aGMzTTZJQ2RpZEc0Z1luUnVMWEJ5YVcxaGNua25MRnh1SUNBZ0lDQWdmU3hjYmlBZ0lDQmRMRnh1SUNCOVhHNGdJR052Ym5OMElFUkJWRUZmUVZSVVVsTmZVRkpQVUVWU1ZFbEZVeUE5SUZ0Y2JpQWdJQ0FuWTJGdVkyVnNZV0pzWlNjc1hHNGdJRjFjYmx4dUlDQXZLaXBjYmlBZ0lDb2dMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRYRzRnSUNBcUlFTnNZWE56SUVSbFptbHVhWFJwYjI1Y2JpQWdJQ29nTFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0WEc0Z0lDQXFMMXh1WEc0Z0lHTnNZWE56SUVOdmJtWnBjbTBnWlhoMFpXNWtjeUJFYVdGc2IyY2dlMXh1WEc0Z0lDQWdZMjl1YzNSeWRXTjBiM0lvYjNCMGFXOXVjeUE5SUh0OUtTQjdYRzRnSUNBZ0lDQmpiMjV6ZENCMFpXMXdiR0YwWlNBOUlDY25JQ3RjYmlBZ0lDQWdJQ2M4WkdsMklHTnNZWE56UFZ3aVpHbGhiRzluWENJZ2RHRmlhVzVrWlhnOVhDSXRNVndpSUhKdmJHVTlYQ0prYVdGc2IyZGNJajRuSUN0Y2JpQWdJQ0FnSUNBZ0p6eGthWFlnWTJ4aGMzTTlYQ0prYVdGc2IyY3RhVzV1WlhKY0lpQnliMnhsUFZ3aVpHOWpkVzFsYm5SY0lqNG5JQ3RjYmlBZ0lDQWdJQ0FnSUNBblBHUnBkaUJqYkdGemN6MWNJbVJwWVd4dlp5MWpiMjUwWlc1MFhDSStKeUFyWEc0Z0lDQWdJQ0FnSUNBZ0lDQW5QR1JwZGlCamJHRnpjejFjSW1ScFlXeHZaeTFvWldGa1pYSmNJajRuSUN0Y2JpQWdJQ0FnSUNBZ0lDQWdJQ0FnSnp4b05TQmpiR0Z6Y3oxY0ltUnBZV3h2WnkxMGFYUnNaVndpUGp3dmFEVStKeUFyWEc0Z0lDQWdJQ0FnSUNBZ0lDQW5QQzlrYVhZK0p5QXJYRzRnSUNBZ0lDQWdJQ0FnSUNBblBHUnBkaUJqYkdGemN6MWNJbVJwWVd4dlp5MWliMlI1WENJK0p5QXJYRzRnSUNBZ0lDQWdJQ0FnSUNBZ0lDYzhjRDQ4TDNBK0p5QXJYRzRnSUNBZ0lDQWdJQ0FnSUNBblBDOWthWFkrSnlBclhHNGdJQ0FnSUNBZ0lDQWdJQ0FuUEdScGRpQmpiR0Z6Y3oxY0ltUnBZV3h2WnkxbWIyOTBaWEpjSWo0bklDdGNiaUFnSUNBZ0lDQWdJQ0FnSUNjOEwyUnBkajRuSUN0Y2JpQWdJQ0FnSUNBZ0lDQW5QQzlrYVhZK0p5QXJYRzRnSUNBZ0lDQWdJQ2M4TDJScGRqNG5JQ3RjYmlBZ0lDQWdJQ2M4TDJScGRqNG5YRzVjYmlBZ0lDQWdJR2xtSUNnaFFYSnlZWGt1YVhOQmNuSmhlU2h2Y0hScGIyNXpMbUoxZEhSdmJuTXBLU0I3WEc0Z0lDQWdJQ0FnSUc5d2RHbHZibk11WW5WMGRHOXVjeUE5SUVSRlJrRlZURlJmVUZKUFVFVlNWRWxGVXk1aWRYUjBiMjV6WEc0Z0lDQWdJQ0I5WEc1Y2JpQWdJQ0FnSUhOMWNHVnlLRzl3ZEdsdmJuTXNJSFJsYlhCc1lYUmxLVnh1SUNBZ0lIMWNibHh1SUNBZ0lITjBZWFJwWXlCcFpHVnVkR2xtYVdWeUtDa2dlMXh1SUNBZ0lDQWdjbVYwZFhKdUlFNUJUVVZjYmlBZ0lDQjlYRzVjYmlBZ0lDQnpkR0YwYVdNZ1gwUlBUVWx1ZEdWeVptRmpaU2h2Y0hScGIyNXpLU0I3WEc0Z0lDQWdJQ0J5WlhSMWNtNGdibVYzSUVOdmJtWnBjbTBvYjNCMGFXOXVjeWxjYmlBZ0lDQjlYRzRnSUgxY2JseHVJQ0F2S2lwY2JpQWdJQ29nTFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0WEc0Z0lDQXFJRVJQVFNCQmNHa2dhVzF3YkdWdFpXNTBZWFJwYjI1Y2JpQWdJQ29nTFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0WEc0Z0lDQXFMMXh1SUNCamIyNXpkQ0JqYjIxd2IyNWxiblJ6SUQwZ1cxMWNiaUFnWTI5dWMzUWdaR2xoYkc5bmN5QTlJR1J2WTNWdFpXNTBMbkYxWlhKNVUyVnNaV04wYjNKQmJHd29ZQzRrZTBScFlXeHZaeTVwWkdWdWRHbG1hV1Z5S0NsOVlDbGNibHh1SUNCcFppQW9aR2xoYkc5bmN5a2dlMXh1SUNBZ0lFRnljbUY1TG1aeWIyMG9aR2xoYkc5bmN5a3VabTl5UldGamFDZ29aV3hsYldWdWRDa2dQVDRnZTF4dUlDQWdJQ0FnWTI5dWMzUWdZMjl1Wm1sbklEMGdaMlYwUVhSMGNtbGlkWFJsYzBOdmJtWnBaeWhsYkdWdFpXNTBMQ0JFUlVaQlZVeFVYMUJTVDFCRlVsUkpSVk1zSUVSQlZFRmZRVlJVVWxOZlVGSlBVRVZTVkVsRlV5bGNiaUFnSUNBZ0lHTnZibVpwWnk1bGJHVnRaVzUwSUQwZ1pXeGxiV1Z1ZEZ4dVhHNGdJQ0FnSUNCcFppQW9ZMjl1Wm1sbkxuUjVjR1VnUFQwOUlFNUJUVVVwSUh0Y2JpQWdJQ0FnSUNBZ0x5OGdZMjl1Wm1seWJWeHVJQ0FnSUNBZ0lDQmpiMjF3YjI1bGJuUnpMbkIxYzJnb2JtVjNJRU52Ym1acGNtMG9ZMjl1Wm1sbktTbGNiaUFnSUNBZ0lIMWNiaUFnSUNCOUtWeHVJQ0I5WEc1Y2JpQWdaRzlqZFcxbGJuUXVZV1JrUlhabGJuUk1hWE4wWlc1bGNpZ25ZMnhwWTJzbkxDQW9aWFpsYm5RcElEMCtJSHRjYmlBZ0lDQmpiMjV6ZENCa1lYUmhWRzluWjJ4bFFYUjBjaUE5SUdWMlpXNTBMblJoY21kbGRDNW5aWFJCZEhSeWFXSjFkR1VvSjJSaGRHRXRkRzluWjJ4bEp5bGNiaUFnSUNCcFppQW9aR0YwWVZSdloyZHNaVUYwZEhJZ0ppWWdaR0YwWVZSdloyZHNaVUYwZEhJZ1BUMDlJRTVCVFVVcElIdGNiaUFnSUNBZ0lHTnZibk4wSUdsa0lEMGdaWFpsYm5RdWRHRnlaMlYwTG1kbGRFRjBkSEpwWW5WMFpTZ25aR0YwWVMxMFlYSm5aWFFuS1Z4dUlDQWdJQ0FnWTI5dWMzUWdaV3hsYldWdWRDQTlJR1J2WTNWdFpXNTBMbkYxWlhKNVUyVnNaV04wYjNJb2FXUXBYRzVjYmlBZ0lDQWdJR052Ym5OMElHTnZiWEJ2Ym1WdWRDQTlJR052YlhCdmJtVnVkSE11Wm1sdVpDaGpJRDArSUdNdVpXeGxiV1Z1ZENBOVBUMGdaV3hsYldWdWRDbGNibHh1SUNBZ0lDQWdhV1lnS0NGamIyMXdiMjVsYm5RcElIdGNiaUFnSUNBZ0lDQWdjbVYwZFhKdVhHNGdJQ0FnSUNCOVhHNWNiaUFnSUNBZ0lDOHZJSEpsYlc5MlpTQjBhR1VnWm05amRYTWdjM1JoZEdVZ2IyWWdkR2hsSUhSeWFXZG5aWEpjYmlBZ0lDQWdJR1YyWlc1MExuUmhjbWRsZEM1aWJIVnlLQ2xjYmx4dUlDQWdJQ0FnWTI5dGNHOXVaVzUwTG1ScFlXeHZaeTV6YUc5M0tDbGNiaUFnSUNCOVhHNGdJSDBwWEc1Y2JpQWdjbVYwZFhKdUlFTnZibVpwY20xY2JuMHBLQ2xjYmx4dVpYaHdiM0owSUdSbFptRjFiSFFnUTI5dVptbHliVnh1SWl3aUx5b3FYRzRnS2lBdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExWeHVJQ29nVEdsalpXNXpaV1FnZFc1a1pYSWdUVWxVSUNob2RIUndjem92TDJkcGRHaDFZaTVqYjIwdmNYVmhjbXN0WkdWMkwxQm9iMjV2YmkxR2NtRnRaWGR2Y21zdllteHZZaTl0WVhOMFpYSXZURWxEUlU1VFJTbGNiaUFxSUMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdFhHNGdLaTljYm1sdGNHOXlkQ0JGZG1WdWRDQm1jbTl0SUNjdUxpOHVMaTlqYjIxdGIyNHZaWFpsYm5SekoxeHVhVzF3YjNKMElFTnZiWEJ2Ym1WdWRDQm1jbTl0SUNjdUxpOWpiMjF3YjI1bGJuUW5YRzVwYlhCdmNuUWdleUJuWlhSQmRIUnlhV0oxZEdWelEyOXVabWxuSUgwZ1puSnZiU0FuTGk0dlkyOXRjRzl1Wlc1MFRXRnVZV2RsY2lkY2JseHVZMjl1YzNRZ1JHbGhiRzluSUQwZ0tDZ3BJRDArSUh0Y2JpQWdMeW9xWEc0Z0lDQXFJQzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMVnh1SUNBZ0tpQkRiMjV6ZEdGdWRITmNiaUFnSUNvZ0xTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdFhHNGdJQ0FxTDF4dVhHNGdJR052Ym5OMElFNUJUVVVnUFNBblpHbGhiRzluSjF4dUlDQmpiMjV6ZENCV1JWSlRTVTlPSUQwZ0p6SXVNQzR3SjF4dUlDQmpiMjV6ZENCQ1FVTkxSRkpQVUY5VFJVeEZRMVJQVWlBOUlDZGthV0ZzYjJjdFltRmphMlJ5YjNBblhHNGdJR052Ym5OMElFUkZSa0ZWVEZSZlVGSlBVRVZTVkVsRlV5QTlJSHRjYmlBZ0lDQmxiR1Z0Wlc1ME9pQnVkV3hzTEZ4dUlDQWdJSFJwZEd4bE9pQnVkV3hzTEZ4dUlDQWdJRzFsYzNOaFoyVTZJRzUxYkd3c1hHNGdJQ0FnWTJGdVkyVnNZV0pzWlRvZ2RISjFaU3hjYmlBZ0lDQmlkWFIwYjI1ek9pQmJYRzRnSUNBZ0lDQjdYRzRnSUNBZ0lDQWdJR1YyWlc1ME9pQW5ZMjl1Wm1seWJTY3NYRzRnSUNBZ0lDQWdJSFJsZUhRNklDZFBheWNzWEc0Z0lDQWdJQ0FnSUdScGMyMXBjM002SUhSeWRXVXNYRzRnSUNBZ0lDQWdJR05zWVhOek9pQW5ZblJ1SUdKMGJpMXdjbWx0WVhKNUp5eGNiaUFnSUNBZ0lIMHNYRzRnSUNBZ1hTeGNiaUFnZlZ4dUlDQmpiMjV6ZENCRVFWUkJYMEZVVkZKVFgxQlNUMUJGVWxSSlJWTWdQU0JiWEc0Z0lDQWdKMk5oYm1ObGJHRmliR1VuTEZ4dUlDQmRYRzVjYmlBZ0x5b3FYRzRnSUNBcUlDMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExWeHVJQ0FnS2lCRGJHRnpjeUJFWldacGJtbDBhVzl1WEc0Z0lDQXFJQzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMVnh1SUNBZ0tpOWNibHh1SUNCamJHRnpjeUJFYVdGc2IyY2daWGgwWlc1a2N5QkRiMjF3YjI1bGJuUWdlMXh1WEc0Z0lDQWdZMjl1YzNSeWRXTjBiM0lvYjNCMGFXOXVjeUE5SUh0OUxDQjBaVzF3YkdGMFpTQTlJRzUxYkd3cElIdGNiaUFnSUNBZ0lITjFjR1Z5S0U1QlRVVXNJRlpGVWxOSlQwNHNJRVJGUmtGVlRGUmZVRkpQVUVWU1ZFbEZVeXdnYjNCMGFXOXVjeXdnUkVGVVFWOUJWRlJTVTE5UVVrOVFSVkpVU1VWVExDQjBjblZsTENCMGNuVmxLVnh1WEc0Z0lDQWdJQ0IwYUdsekxuUmxiWEJzWVhSbElEMGdkR1Z0Y0d4aGRHVWdmSHdnSnljZ0sxeHVJQ0FnSUNBZ0p6eGthWFlnWTJ4aGMzTTlYQ0prYVdGc2IyZGNJaUIwWVdKcGJtUmxlRDFjSWkweFhDSWdjbTlzWlQxY0ltUnBZV3h2WjF3aVBpY2dLMXh1SUNBZ0lDQWdJQ0FuUEdScGRpQmpiR0Z6Y3oxY0ltUnBZV3h2WnkxcGJtNWxjbHdpSUhKdmJHVTlYQ0prYjJOMWJXVnVkRndpUGljZ0sxeHVJQ0FnSUNBZ0lDQWdJQ2M4WkdsMklHTnNZWE56UFZ3aVpHbGhiRzluTFdOdmJuUmxiblJjSWo0bklDdGNiaUFnSUNBZ0lDQWdJQ0FnSUNjOFpHbDJJR05zWVhOelBWd2laR2xoYkc5bkxXaGxZV1JsY2x3aVBpY2dLMXh1SUNBZ0lDQWdJQ0FnSUNBZ0lDQW5QR2cxSUdOc1lYTnpQVndpWkdsaGJHOW5MWFJwZEd4bFhDSStQQzlvTlQ0bklDdGNiaUFnSUNBZ0lDQWdJQ0FnSUNjOEwyUnBkajRuSUN0Y2JpQWdJQ0FnSUNBZ0lDQWdJQ2M4WkdsMklHTnNZWE56UFZ3aVpHbGhiRzluTFdKdlpIbGNJajRuSUN0Y2JpQWdJQ0FnSUNBZ0lDQWdJQ0FnSnp4d1Bqd3ZjRDRuSUN0Y2JpQWdJQ0FnSUNBZ0lDQWdJQ2M4TDJScGRqNG5JQ3RjYmlBZ0lDQWdJQ0FnSUNBZ0lDYzhaR2wySUdOc1lYTnpQVndpWkdsaGJHOW5MV1p2YjNSbGNsd2lQaWNnSzF4dUlDQWdJQ0FnSUNBZ0lDQWdKend2WkdsMlBpY2dLMXh1SUNBZ0lDQWdJQ0FnSUNjOEwyUnBkajRuSUN0Y2JpQWdJQ0FnSUNBZ0p6d3ZaR2wyUGljZ0sxeHVJQ0FnSUNBZ0p6d3ZaR2wyUGlkY2JseHVJQ0FnSUNBZ2FXWWdLSFJvYVhNdVpIbHVZVzFwWTBWc1pXMWxiblFwSUh0Y2JpQWdJQ0FnSUNBZ2RHaHBjeTVpZFdsc1pDZ3BYRzRnSUNBZ0lDQjlYRzRnSUNBZ2ZWeHVYRzRnSUNBZ1luVnBiR1FvS1NCN1hHNGdJQ0FnSUNCamIyNXpkQ0JpZFdsc1pHVnlJRDBnWkc5amRXMWxiblF1WTNKbFlYUmxSV3hsYldWdWRDZ25aR2wySnlsY2JseHVJQ0FnSUNBZ1luVnBiR1JsY2k1cGJtNWxja2hVVFV3Z1BTQjBhR2x6TG5SbGJYQnNZWFJsWEc1Y2JpQWdJQ0FnSUhSb2FYTXViM0IwYVc5dWN5NWxiR1Z0Wlc1MElEMGdZblZwYkdSbGNpNW1hWEp6ZEVOb2FXeGtYRzVjYmlBZ0lDQWdJQzh2SUhScGRHeGxYRzRnSUNBZ0lDQnBaaUFvZEdocGN5NXZjSFJwYjI1ekxuUnBkR3hsSUNFOVBTQnVkV3hzS1NCN1hHNGdJQ0FnSUNBZ0lIUm9hWE11YjNCMGFXOXVjeTVsYkdWdFpXNTBMbkYxWlhKNVUyVnNaV04wYjNJb0p5NWthV0ZzYjJjdGRHbDBiR1VuS1M1cGJtNWxja2hVVFV3Z1BTQjBhR2x6TG05d2RHbHZibk11ZEdsMGJHVmNiaUFnSUNBZ0lIMWNibHh1SUNBZ0lDQWdMeThnYldWemMyRm5aVnh1SUNBZ0lDQWdhV1lnS0hSb2FYTXViM0IwYVc5dWN5NXRaWE56WVdkbElDRTlQU0J1ZFd4c0tTQjdYRzRnSUNBZ0lDQWdJSFJvYVhNdWIzQjBhVzl1Y3k1bGJHVnRaVzUwTG5GMVpYSjVVMlZzWldOMGIzSW9KeTVrYVdGc2IyY3RZbTlrZVNjcExtWnBjbk4wUTJocGJHUXVhVzV1WlhKSVZFMU1JRDBnZEdocGN5NXZjSFJwYjI1ekxtMWxjM05oWjJWY2JpQWdJQ0FnSUgwZ1pXeHpaU0I3WEc0Z0lDQWdJQ0FnSUM4dklISmxiVzkyWlNCd1lYSmhaM0poY0dnZ2JtOWtaVnh1SUNBZ0lDQWdJQ0IwYUdsekxuSmxiVzkyWlZSbGVIUkNiMlI1S0NsY2JpQWdJQ0FnSUgxY2JseHVJQ0FnSUNBZ0x5OGdZblYwZEc5dWMxeHVJQ0FnSUNBZ2FXWWdLSFJvYVhNdWIzQjBhVzl1Y3k1aWRYUjBiMjV6SUNFOVBTQnVkV3hzSUNZbUlFRnljbUY1TG1selFYSnlZWGtvZEdocGN5NXZjSFJwYjI1ekxtSjFkSFJ2Ym5NcEtTQjdYRzRnSUNBZ0lDQWdJR2xtSUNoMGFHbHpMbTl3ZEdsdmJuTXVZblYwZEc5dWN5NXNaVzVuZEdnZ1BpQXdLU0I3WEc0Z0lDQWdJQ0FnSUNBZ2RHaHBjeTV2Y0hScGIyNXpMbUoxZEhSdmJuTXVabTl5UldGamFDZ29ZblYwZEc5dUtTQTlQaUI3WEc0Z0lDQWdJQ0FnSUNBZ0lDQjBhR2x6TG05d2RHbHZibk11Wld4bGJXVnVkQzV4ZFdWeWVWTmxiR1ZqZEc5eUtDY3VaR2xoYkc5bkxXWnZiM1JsY2ljcExtRndjR1Z1WkVOb2FXeGtLSFJvYVhNdVluVnBiR1JDZFhSMGIyNG9ZblYwZEc5dUtTbGNiaUFnSUNBZ0lDQWdJQ0I5S1Z4dUlDQWdJQ0FnSUNCOUlHVnNjMlVnZTF4dUlDQWdJQ0FnSUNBZ0lIUm9hWE11Y21WdGIzWmxSbTl2ZEdWeUtDbGNiaUFnSUNBZ0lDQWdmVnh1SUNBZ0lDQWdmU0JsYkhObElIdGNiaUFnSUNBZ0lDQWdkR2hwY3k1eVpXMXZkbVZHYjI5MFpYSW9LVnh1SUNBZ0lDQWdmVnh1WEc0Z0lDQWdJQ0JrYjJOMWJXVnVkQzVpYjJSNUxtRndjR1Z1WkVOb2FXeGtLSFJvYVhNdWIzQjBhVzl1Y3k1bGJHVnRaVzUwS1Z4dVhHNGdJQ0FnSUNCMGFHbHpMbk5sZEVGMGRISnBZblYwWlhNb0tWeHVJQ0FnSUgxY2JseHVJQ0FnSUdKMWFXeGtRblYwZEc5dUtHSjFkSFJ2YmtsdVptOGdQU0I3ZlNrZ2UxeHVJQ0FnSUNBZ1kyOXVjM1FnWW5WMGRHOXVJRDBnWkc5amRXMWxiblF1WTNKbFlYUmxSV3hsYldWdWRDZ25ZblYwZEc5dUp5bGNiaUFnSUNBZ0lHSjFkSFJ2Ymk1elpYUkJkSFJ5YVdKMWRHVW9KM1I1Y0dVbkxDQW5ZblYwZEc5dUp5bGNiaUFnSUNBZ0lHSjFkSFJ2Ymk1elpYUkJkSFJ5YVdKMWRHVW9KMk5zWVhOekp5d2dZblYwZEc5dVNXNW1ieTVqYkdGemN5QjhmQ0FuWW5SdUp5bGNiaUFnSUNBZ0lHSjFkSFJ2Ymk1elpYUkJkSFJ5YVdKMWRHVW9KMlJoZEdFdFpYWmxiblFuTENCaWRYUjBiMjVKYm1adkxtVjJaVzUwS1Z4dUlDQWdJQ0FnWW5WMGRHOXVMbWx1Ym1WeVNGUk5UQ0E5SUdKMWRIUnZia2x1Wm04dWRHVjRkRnh1WEc0Z0lDQWdJQ0JwWmlBb1luVjBkRzl1U1c1bWJ5NWthWE50YVhOektTQjdYRzRnSUNBZ0lDQWdJR0oxZEhSdmJpNXpaWFJCZEhSeWFXSjFkR1VvSjJSaGRHRXRaR2x6YldsemN5Y3NJRTVCVFVVcFhHNGdJQ0FnSUNCOVhHNWNiaUFnSUNBZ0lISmxkSFZ5YmlCaWRYUjBiMjVjYmlBZ0lDQjlYRzVjYmlBZ0lDQmlkV2xzWkVKaFkydGtjbTl3S0NrZ2UxeHVJQ0FnSUNBZ1kyOXVjM1FnWW1GamEyUnliM0FnUFNCa2IyTjFiV1Z1ZEM1amNtVmhkR1ZGYkdWdFpXNTBLQ2RrYVhZbktWeHVJQ0FnSUNBZ1ltRmphMlJ5YjNBdWMyVjBRWFIwY21saWRYUmxLQ2RrWVhSaExXbGtKeXdnZEdocGN5NXBaQ2xjYmlBZ0lDQWdJR0poWTJ0a2NtOXdMbU5zWVhOelRHbHpkQzVoWkdRb1FrRkRTMFJTVDFCZlUwVk1SVU5VVDFJcFhHNWNiaUFnSUNBZ0lHUnZZM1Z0Wlc1MExtSnZaSGt1WVhCd1pXNWtRMmhwYkdRb1ltRmphMlJ5YjNBcFhHNGdJQ0FnZlZ4dVhHNGdJQ0FnWjJWMFFtRmphMlJ5YjNBb0tTQjdYRzRnSUNBZ0lDQnlaWFIxY200Z1pHOWpkVzFsYm5RdWNYVmxjbmxUWld4bFkzUnZjaWhnTGlSN1FrRkRTMFJTVDFCZlUwVk1SVU5VVDFKOVcyUmhkR0V0YVdROVhDSWtlM1JvYVhNdWFXUjlYQ0pkWUNsY2JpQWdJQ0I5WEc1Y2JpQWdJQ0J5WlcxdmRtVlVaWGgwUW05a2VTZ3BJSHRjYmlBZ0lDQWdJSFJvYVhNdWIzQjBhVzl1Y3k1bGJHVnRaVzUwTG5GMVpYSjVVMlZzWldOMGIzSW9KeTVrYVdGc2IyY3RZbTlrZVNjcExuSmxiVzkyWlVOb2FXeGtLSFJvYVhNdWIzQjBhVzl1Y3k1bGJHVnRaVzUwTG5GMVpYSjVVMlZzWldOMGIzSW9KeTVrYVdGc2IyY3RZbTlrZVNjcExtWnBjbk4wUTJocGJHUXBJQ0FnSUNBZ1hHNGdJQ0FnZlZ4dVhHNGdJQ0FnY21WdGIzWmxSbTl2ZEdWeUtDa2dlMXh1SUNBZ0lDQWdZMjl1YzNRZ1ptOXZkR1Z5SUQwZ2RHaHBjeTV2Y0hScGIyNXpMbVZzWlcxbGJuUXVjWFZsY25sVFpXeGxZM1J2Y2lnbkxtUnBZV3h2WnkxbWIyOTBaWEluS1NBZ0lDQWdJRnh1SUNBZ0lDQWdkR2hwY3k1dmNIUnBiMjV6TG1Wc1pXMWxiblF1Y1hWbGNubFRaV3hsWTNSdmNpZ25MbVJwWVd4dlp5MWpiMjUwWlc1MEp5a3VjbVZ0YjNabFEyaHBiR1FvWm05dmRHVnlLVnh1SUNBZ0lIMWNibHh1SUNBZ0lHTmxiblJsY2lncElIdGNiaUFnSUNBZ0lHTnZibk4wSUdOdmJYQjFkR1ZrVTNSNWJHVWdQU0IzYVc1a2IzY3VaMlYwUTI5dGNIVjBaV1JUZEhsc1pTaDBhR2x6TG05d2RHbHZibk11Wld4bGJXVnVkQ2xjYmlBZ0lDQWdJR052Ym5OMElHaGxhV2RvZENBOUlHTnZiWEIxZEdWa1UzUjViR1V1YUdWcFoyaDBMbk5zYVdObEtEQXNJR052YlhCMWRHVmtVM1I1YkdVdWFHVnBaMmgwTG14bGJtZDBhQ0F0SURJcFhHNWNiaUFnSUNBZ0lHTnZibk4wSUhSdmNDQTlJQ2gzYVc1a2IzY3VhVzV1WlhKSVpXbG5hSFFnTHlBeUtTQXRJQ2hvWldsbmFIUWdMeUF5S1Z4dUlDQWdJQ0FnZEdocGN5NXZjSFJwYjI1ekxtVnNaVzFsYm5RdWMzUjViR1V1ZEc5d0lEMGdZQ1I3ZEc5d2ZYQjRZRnh1SUNBZ0lIMWNibHh1SUNBZ0lITm9iM2NvS1NCN1hHNGdJQ0FnSUNCcFppQW9kR2hwY3k1dmNIUnBiMjV6TG1Wc1pXMWxiblFnUFQwOUlHNTFiR3dwSUh0Y2JpQWdJQ0FnSUNBZ0x5OGdZblZwYkdRZ1lXNWtJR2x1YzJWeWRDQmhJRzVsZHlCRVQwMGdaV3hsYldWdWRGeHVJQ0FnSUNBZ0lDQjBhR2x6TG1KMWFXeGtLQ2xjYmlBZ0lDQWdJSDFjYmx4dUlDQWdJQ0FnYVdZZ0tIUm9hWE11YjNCMGFXOXVjeTVsYkdWdFpXNTBMbU5zWVhOelRHbHpkQzVqYjI1MFlXbHVjeWduYzJodmR5Y3BLU0I3WEc0Z0lDQWdJQ0FnSUhKbGRIVnliaUJtWVd4elpWeHVJQ0FnSUNBZ2ZWeHVYRzRnSUNBZ0lDQXZMeUJoWkdRZ1lTQjBhVzFsYjNWMElITnZJSFJvWVhRZ2RHaGxJRU5UVXlCaGJtbHRZWFJwYjI0Z2QyOXlhM05jYmlBZ0lDQWdJSE5sZEZScGJXVnZkWFFvS0NrZ1BUNGdlMXh1SUNBZ0lDQWdJQ0IwYUdsekxuUnlhV2RuWlhKRmRtVnVkQ2hGZG1WdWRDNVRTRTlYS1Z4dUlDQWdJQ0FnSUNCMGFHbHpMbUoxYVd4a1FtRmphMlJ5YjNBb0tWeHVYRzRnSUNBZ0lDQWdJR052Ym5OMElHOXVVMmh2ZDI0Z1BTQW9LU0E5UGlCN1hHNGdJQ0FnSUNBZ0lDQWdkR2hwY3k1MGNtbG5aMlZ5UlhabGJuUW9SWFpsYm5RdVUwaFBWMDRwWEc0Z0lDQWdJQ0FnSUNBZ2RHaHBjeTV2Y0hScGIyNXpMbVZzWlcxbGJuUXVjbVZ0YjNabFJYWmxiblJNYVhOMFpXNWxjaWhGZG1WdWRDNVVVa0ZPVTBsVVNVOU9YMFZPUkN3Z2IyNVRhRzkzYmlsY2JseHVJQ0FnSUNBZ0lDQWdJQzh2SUdGMGRHRmphQ0JsZG1WdWRGeHVJQ0FnSUNBZ0lDQWdJSFJvYVhNdVlYUjBZV05vUlhabGJuUnpLQ2xjYmlBZ0lDQWdJQ0FnZlZ4dVhHNGdJQ0FnSUNBZ0lIUm9hWE11YjNCMGFXOXVjeTVsYkdWdFpXNTBMbUZrWkVWMlpXNTBUR2x6ZEdWdVpYSW9SWFpsYm5RdVZGSkJUbE5KVkVsUFRsOUZUa1FzSUc5dVUyaHZkMjRwWEc1Y2JpQWdJQ0FnSUNBZ2RHaHBjeTV2Y0hScGIyNXpMbVZzWlcxbGJuUXVZMnhoYzNOTWFYTjBMbUZrWkNnbmMyaHZkeWNwWEc1Y2JpQWdJQ0FnSUNBZ2RHaHBjeTVqWlc1MFpYSW9LVnh1SUNBZ0lDQWdmU3dnTVRBcFhHNWNiaUFnSUNBZ0lISmxkSFZ5YmlCMGNuVmxYRzRnSUNBZ2ZWeHVYRzRnSUNBZ2IyNUZiR1Z0Wlc1MFJYWmxiblFvWlhabGJuUXBJSHRjYmlBZ0lDQWdJR2xtSUNobGRtVnVkQzUwZVhCbElEMDlQU0FuYTJWNWRYQW5JQ1ltSUdWMlpXNTBMbXRsZVVOdlpHVWdJVDA5SURJM0lDWW1JR1YyWlc1MExtdGxlVU52WkdVZ0lUMDlJREV6S1NCN1hHNGdJQ0FnSUNBZ0lISmxkSFZ5Ymx4dUlDQWdJQ0FnZlZ4dVhHNGdJQ0FnSUNCamIyNXpkQ0JsZG1WdWRFNWhiV1VnUFNCbGRtVnVkQzUwWVhKblpYUXVaMlYwUVhSMGNtbGlkWFJsS0Nka1lYUmhMV1YyWlc1MEp5bGNibHh1SUNBZ0lDQWdhV1lnS0dWMlpXNTBUbUZ0WlNrZ2UxeHVJQ0FnSUNBZ0lDQjBhR2x6TG5SeWFXZG5aWEpGZG1WdWRDaGxkbVZ1ZEU1aGJXVXBYRzRnSUNBZ0lDQjlYRzVjYmlBZ0lDQWdJR2xtSUNobGRtVnVkQzUwWVhKblpYUXVaMlYwUVhSMGNtbGlkWFJsS0Nka1lYUmhMV1JwYzIxcGMzTW5LU0FoUFQwZ1RrRk5SU2tnZTF4dUlDQWdJQ0FnSUNCeVpYUjFjbTVjYmlBZ0lDQWdJSDFjYmx4dUlDQWdJQ0FnTHk4Z2FHbGtaU0IwYUdVZ1pHbGhiRzluWEc0Z0lDQWdJQ0IwYUdsekxtaHBaR1VvS1Z4dUlDQWdJSDFjYmx4dUlDQWdJR2hwWkdVb0tTQjdYRzRnSUNBZ0lDQnBaaUFvSVhSb2FYTXViM0IwYVc5dWN5NWxiR1Z0Wlc1MExtTnNZWE56VEdsemRDNWpiMjUwWVdsdWN5Z25jMmh2ZHljcEtTQjdYRzRnSUNBZ0lDQWdJSEpsZEhWeWJpQm1ZV3h6WlZ4dUlDQWdJQ0FnZlZ4dVhHNGdJQ0FnSUNCMGFHbHpMblJ5YVdkblpYSkZkbVZ1ZENoRmRtVnVkQzVJU1VSRktWeHVYRzRnSUNBZ0lDQjBhR2x6TG1SbGRHRmphRVYyWlc1MGN5Z3BYRzVjYmlBZ0lDQWdJSFJvYVhNdWIzQjBhVzl1Y3k1bGJHVnRaVzUwTG1Oc1lYTnpUR2x6ZEM1aFpHUW9KMmhwWkdVbktWeHVJQ0FnSUNBZ2RHaHBjeTV2Y0hScGIyNXpMbVZzWlcxbGJuUXVZMnhoYzNOTWFYTjBMbkpsYlc5MlpTZ25jMmh2ZHljcFhHNWNiaUFnSUNBZ0lHTnZibk4wSUdKaFkydGtjbTl3SUQwZ2RHaHBjeTVuWlhSQ1lXTnJaSEp2Y0NncFhHNWNiaUFnSUNBZ0lHTnZibk4wSUc5dVNHbGtaR1Z1SUQwZ0tDa2dQVDRnZTF4dUlDQWdJQ0FnSUNCa2IyTjFiV1Z1ZEM1aWIyUjVMbkpsYlc5MlpVTm9hV3hrS0dKaFkydGtjbTl3S1Z4dVhHNGdJQ0FnSUNBZ0lIUm9hWE11YjNCMGFXOXVjeTVsYkdWdFpXNTBMbU5zWVhOelRHbHpkQzV5WlcxdmRtVW9KMmhwWkdVbktWeHVYRzRnSUNBZ0lDQWdJSFJvYVhNdWRISnBaMmRsY2tWMlpXNTBLRVYyWlc1MExraEpSRVJGVGlsY2JseHVJQ0FnSUNBZ0lDQmlZV05yWkhKdmNDNXlaVzF2ZG1WRmRtVnVkRXhwYzNSbGJtVnlLRVYyWlc1MExsUlNRVTVUU1ZSSlQwNWZSVTVFTENCdmJraHBaR1JsYmlsY2JseHVJQ0FnSUNBZ0lDQXZMeUJ5WlcxdmRtVWdaMlZ1WlhKaGRHVmtJR1JwWVd4dlozTWdabkp2YlNCMGFHVWdSRTlOWEc0Z0lDQWdJQ0FnSUdsbUlDaDBhR2x6TG1SNWJtRnRhV05GYkdWdFpXNTBLU0I3WEc0Z0lDQWdJQ0FnSUNBZ1pHOWpkVzFsYm5RdVltOWtlUzV5WlcxdmRtVkRhR2xzWkNoMGFHbHpMbTl3ZEdsdmJuTXVaV3hsYldWdWRDbGNiaUFnSUNBZ0lDQWdJQ0IwYUdsekxtOXdkR2x2Ym5NdVpXeGxiV1Z1ZENBOUlHNTFiR3hjYmlBZ0lDQWdJQ0FnZlZ4dUlDQWdJQ0FnZlZ4dVhHNGdJQ0FnSUNCaVlXTnJaSEp2Y0M1aFpHUkZkbVZ1ZEV4cGMzUmxibVZ5S0VWMlpXNTBMbFJTUVU1VFNWUkpUMDVmUlU1RUxDQnZia2hwWkdSbGJpbGNiaUFnSUNBZ0lHSmhZMnRrY205d0xtTnNZWE56VEdsemRDNWhaR1FvSjJaaFpHVnZkWFFuS1Z4dVhHNGdJQ0FnSUNCeVpYUjFjbTRnZEhKMVpWeHVJQ0FnSUgxY2JseHVJQ0FnSUdGMGRHRmphRVYyWlc1MGN5Z3BJSHRjYmlBZ0lDQWdJR052Ym5OMElHSjFkSFJ2Ym5NZ1BTQjBhR2x6TG05d2RHbHZibk11Wld4bGJXVnVkQzV4ZFdWeWVWTmxiR1ZqZEc5eVFXeHNLQ2RiWkdGMFlTMWthWE50YVhOelhTd2dMbVJwWVd4dlp5MW1iMjkwWlhJZ1luVjBkRzl1SnlsY2JpQWdJQ0FnSUdsbUlDaGlkWFIwYjI1ektTQjdYRzRnSUNBZ0lDQWdJRUZ5Y21GNUxtWnliMjBvWW5WMGRHOXVjeWt1Wm05eVJXRmphQ2hpZFhSMGIyNGdQVDRnZEdocGN5NXlaV2RwYzNSbGNrVnNaVzFsYm5Rb2V5QjBZWEpuWlhRNklHSjFkSFJ2Yml3Z1pYWmxiblE2SUNkamJHbGpheWNnZlNrcFhHNGdJQ0FnSUNCOVhHNWNiaUFnSUNBZ0lDOHZJR0ZrWkNCbGRtVnVkSE1nYVdZZ2RHaGxJR1JwWVd4dlp5QnBjeUJqWVc1alpXeGhZbXhsWEc0Z0lDQWdJQ0F2THlCM2FHbGphQ0J0WldGdWN5QjBhR1VnZFhObGNpQmpZVzRnYUdsa1pTQjBhR1VnWkdsaGJHOW5YRzRnSUNBZ0lDQXZMeUJpZVNCd2NtVnpjMmx1WnlCMGFHVWdSVk5ESUd0bGVTQnZjaUJqYkdsamF5QnZkWFJ6YVdSbElIUm9aU0JpWVdOclpISnZjRnh1SUNBZ0lDQWdhV1lnS0hSb2FYTXViM0IwYVc5dWN5NWpZVzVqWld4aFlteGxLU0I3WEc0Z0lDQWdJQ0FnSUdOdmJuTjBJR0poWTJ0a2NtOXdJRDBnZEdocGN5NW5aWFJDWVdOclpISnZjQ2dwWEc0Z0lDQWdJQ0FnSUhSb2FYTXVjbVZuYVhOMFpYSkZiR1Z0Wlc1MEtIc2dkR0Z5WjJWME9pQmlZV05yWkhKdmNDd2daWFpsYm5RNklFVjJaVzUwTGxOVVFWSlVJSDBwWEc0Z0lDQWdJQ0FnSUhSb2FYTXVjbVZuYVhOMFpYSkZiR1Z0Wlc1MEtIc2dkR0Z5WjJWME9pQmtiMk4xYldWdWRDd2daWFpsYm5RNklDZHJaWGwxY0NjZ2ZTbGNiaUFnSUNBZ0lIMWNiaUFnSUNCOVhHNWNiaUFnSUNCa1pYUmhZMmhGZG1WdWRITW9LU0I3WEc0Z0lDQWdJQ0JqYjI1emRDQmlkWFIwYjI1eklEMGdkR2hwY3k1dmNIUnBiMjV6TG1Wc1pXMWxiblF1Y1hWbGNubFRaV3hsWTNSdmNrRnNiQ2duVzJSaGRHRXRaR2x6YldsemMxMHNJQzVrYVdGc2IyY3RabTl2ZEdWeUlHSjFkSFJ2YmljcFhHNGdJQ0FnSUNCcFppQW9ZblYwZEc5dWN5a2dlMXh1SUNBZ0lDQWdJQ0JCY25KaGVTNW1jbTl0S0dKMWRIUnZibk1wTG1admNrVmhZMmdvWW5WMGRHOXVJRDArSUhSb2FYTXVkVzV5WldkcGMzUmxja1ZzWlcxbGJuUW9leUIwWVhKblpYUTZJR0oxZEhSdmJpd2daWFpsYm5RNklDZGpiR2xqYXljZ2ZTa3BYRzRnSUNBZ0lDQjlYRzVjYmlBZ0lDQWdJR2xtSUNoMGFHbHpMbTl3ZEdsdmJuTXVZMkZ1WTJWc1lXSnNaU2tnZTF4dUlDQWdJQ0FnSUNCamIyNXpkQ0JpWVdOclpISnZjQ0E5SUhSb2FYTXVaMlYwUW1GamEyUnliM0FvS1Z4dUlDQWdJQ0FnSUNCMGFHbHpMblZ1Y21WbmFYTjBaWEpGYkdWdFpXNTBLSHNnZEdGeVoyVjBPaUJpWVdOclpISnZjQ3dnWlhabGJuUTZJRVYyWlc1MExsTlVRVkpVSUgwcFhHNGdJQ0FnSUNBZ0lIUm9hWE11ZFc1eVpXZHBjM1JsY2tWc1pXMWxiblFvZXlCMFlYSm5aWFE2SUdSdlkzVnRaVzUwTENCbGRtVnVkRG9nSjJ0bGVYVndKeUI5S1Z4dUlDQWdJQ0FnZlZ4dUlDQWdJSDFjYmx4dUlDQWdJSE4wWVhScFl5QnBaR1Z1ZEdsbWFXVnlLQ2tnZTF4dUlDQWdJQ0FnY21WMGRYSnVJRTVCVFVWY2JpQWdJQ0I5WEc1Y2JpQWdJQ0J6ZEdGMGFXTWdYMFJQVFVsdWRHVnlabUZqWlNodmNIUnBiMjV6S1NCN1hHNGdJQ0FnSUNCeVpYUjFjbTRnYzNWd1pYSXVYMFJQVFVsdWRHVnlabUZqWlNoRWFXRnNiMmNzSUc5d2RHbHZibk1wWEc0Z0lDQWdmVnh1SUNCOVhHNWNiaUFnTHlvcVhHNGdJQ0FxSUMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFZ4dUlDQWdLaUJFVDAwZ1FYQnBJR2x0Y0d4bGJXVnVkR0YwYVc5dVhHNGdJQ0FxSUMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFZ4dUlDQWdLaTljYmlBZ1kyOXVjM1FnWTI5dGNHOXVaVzUwY3lBOUlGdGRYRzVjYmlBZ1kyOXVjM1FnWkdsaGJHOW5jeUE5SUdSdlkzVnRaVzUwTG5GMVpYSjVVMlZzWldOMGIzSkJiR3dvWUM0a2UwNUJUVVY5WUNsY2JpQWdhV1lnS0dScFlXeHZaM01wSUh0Y2JpQWdJQ0JCY25KaGVTNW1jbTl0S0dScFlXeHZaM01wTG1admNrVmhZMmdvS0dWc1pXMWxiblFwSUQwK0lIdGNiaUFnSUNBZ0lHTnZibk4wSUdOdmJtWnBaeUE5SUdkbGRFRjBkSEpwWW5WMFpYTkRiMjVtYVdjb1pXeGxiV1Z1ZEN3Z1JFVkdRVlZNVkY5UVVrOVFSVkpVU1VWVExDQkVRVlJCWDBGVVZGSlRYMUJTVDFCRlVsUkpSVk1wWEc0Z0lDQWdJQ0JqYjI1bWFXY3VaV3hsYldWdWRDQTlJR1ZzWlcxbGJuUmNibHh1SUNBZ0lDQWdZMjl0Y0c5dVpXNTBjeTV3ZFhOb0tIc2daV3hsYldWdWRDd2daR2xoYkc5bk9pQnVaWGNnUkdsaGJHOW5LR052Ym1acFp5a2dmU2xjYmlBZ0lDQjlLVnh1SUNCOVhHNWNiaUFnWkc5amRXMWxiblF1WVdSa1JYWmxiblJNYVhOMFpXNWxjaWduWTJ4cFkyc25MQ0FvWlhabGJuUXBJRDArSUh0Y2JpQWdJQ0JqYjI1emRDQmtZWFJoVkc5bloyeGxRWFIwY2lBOUlHVjJaVzUwTG5SaGNtZGxkQzVuWlhSQmRIUnlhV0oxZEdVb0oyUmhkR0V0ZEc5bloyeGxKeWxjYmlBZ0lDQnBaaUFvWkdGMFlWUnZaMmRzWlVGMGRISWdKaVlnWkdGMFlWUnZaMmRzWlVGMGRISWdQVDA5SUU1QlRVVXBJSHRjYmlBZ0lDQWdJR052Ym5OMElHbGtJRDBnWlhabGJuUXVkR0Z5WjJWMExtZGxkRUYwZEhKcFluVjBaU2duWkdGMFlTMTBZWEpuWlhRbktWeHVJQ0FnSUNBZ1kyOXVjM1FnWld4bGJXVnVkQ0E5SUdSdlkzVnRaVzUwTG5GMVpYSjVVMlZzWldOMGIzSW9hV1FwWEc1Y2JpQWdJQ0FnSUdOdmJuTjBJR052YlhCdmJtVnVkQ0E5SUdOdmJYQnZibVZ1ZEhNdVptbHVaQ2hqSUQwK0lHTXVaV3hsYldWdWRDQTlQVDBnWld4bGJXVnVkQ2xjYmx4dUlDQWdJQ0FnYVdZZ0tDRmpiMjF3YjI1bGJuUXBJSHRjYmlBZ0lDQWdJQ0FnY21WMGRYSnVYRzRnSUNBZ0lDQjlYRzVjYmlBZ0lDQWdJQzh2SUhKbGJXOTJaU0IwYUdVZ1ptOWpkWE1nYzNSaGRHVWdiMllnZEdobElIUnlhV2RuWlhKY2JpQWdJQ0FnSUdWMlpXNTBMblJoY21kbGRDNWliSFZ5S0NsY2JseHVJQ0FnSUNBZ1kyOXRjRzl1Wlc1MExtUnBZV3h2Wnk1emFHOTNLQ2xjYmlBZ0lDQjlYRzRnSUgwcFhHNWNiaUFnY21WMGRYSnVJRVJwWVd4dloxeHVmU2tvS1Z4dVhHNWxlSEJ2Y25RZ1pHVm1ZWFZzZENCRWFXRnNiMmRjYmlJc0lpOHFLbHh1SUNvZ0xTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMWNiaUFxSUV4cFkyVnVjMlZrSUhWdVpHVnlJRTFKVkNBb2FIUjBjSE02THk5bmFYUm9kV0l1WTI5dEwzRjFZWEpyTFdSbGRpOVFhRzl1YjI0dFJuSmhiV1YzYjNKckwySnNiMkl2YldGemRHVnlMMHhKUTBWT1UwVXBYRzRnS2lBdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExWeHVJQ292WEc1cGJYQnZjblFnUkdsaGJHOW5JR1p5YjIwZ0p5NHZhVzVrWlhnblhHNXBiWEJ2Y25RZ1UzQnBibTVsY2lCbWNtOXRJQ2N1TGk5c2IyRmtaWEl2YVc1a1pYZ25YRzVwYlhCdmNuUWdleUJuWlhSQmRIUnlhV0oxZEdWelEyOXVabWxuSUgwZ1puSnZiU0FuTGk0dlkyOXRjRzl1Wlc1MFRXRnVZV2RsY2lkY2JseHVZMjl1YzNRZ1RHOWhaR1Z5SUQwZ0tDZ3BJRDArSUh0Y2JseHVJQ0F2S2lwY2JpQWdJQ29nTFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0WEc0Z0lDQXFJRU52Ym5OMFlXNTBjMXh1SUNBZ0tpQXRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMWNiaUFnSUNvdlhHNWNiaUFnWTI5dWMzUWdUa0ZOUlNBOUlDZHNiMkZrWlhJblhHNGdJR052Ym5OMElFUkZSa0ZWVEZSZlVGSlBVRVZTVkVsRlV5QTlJSHRjYmlBZ0lDQmxiR1Z0Wlc1ME9pQnVkV3hzTEZ4dUlDQWdJSFJwZEd4bE9pQnVkV3hzTEZ4dUlDQWdJRzFsYzNOaFoyVTZJRzUxYkd3c1hHNGdJQ0FnWTJGdVkyVnNZV0pzWlRvZ2RISjFaU3hjYmlBZ0lDQjBlWEJsT2lCT1FVMUZMRnh1SUNBZ0lHSjFkSFJ2Ym5NNklGdGRMRnh1SUNCOVhHNGdJR052Ym5OMElFUkJWRUZmUVZSVVVsTmZVRkpQVUVWU1ZFbEZVeUE5SUZ0Y2JpQWdJQ0FuWTJGdVkyVnNZV0pzWlNjc1hHNGdJRjFjYmx4dUlDQXZLaXBjYmlBZ0lDb2dMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRYRzRnSUNBcUlFTnNZWE56SUVSbFptbHVhWFJwYjI1Y2JpQWdJQ29nTFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0WEc0Z0lDQXFMMXh1WEc0Z0lHTnNZWE56SUV4dllXUmxjaUJsZUhSbGJtUnpJRVJwWVd4dlp5QjdYRzVjYmlBZ0lDQmpiMjV6ZEhKMVkzUnZjaWh2Y0hScGIyNXpJRDBnZTMwcElIdGNiaUFnSUNBZ0lHTnZibk4wSUhSbGJYQnNZWFJsSUQwZ0p5Y2dLMXh1SUNBZ0lDQWdKenhrYVhZZ1kyeGhjM005WENKa2FXRnNiMmRjSWlCMFlXSnBibVJsZUQxY0lpMHhYQ0lnY205c1pUMWNJbVJwWVd4dloxd2lQaWNnSzF4dUlDQWdJQ0FnSUNBblBHUnBkaUJqYkdGemN6MWNJbVJwWVd4dlp5MXBibTVsY2x3aUlISnZiR1U5WENKa2IyTjFiV1Z1ZEZ3aVBpY2dLMXh1SUNBZ0lDQWdJQ0FnSUNjOFpHbDJJR05zWVhOelBWd2laR2xoYkc5bkxXTnZiblJsYm5SY0lqNG5JQ3RjYmlBZ0lDQWdJQ0FnSUNBZ0lDYzhaR2wySUdOc1lYTnpQVndpWkdsaGJHOW5MV2hsWVdSbGNsd2lQaWNnSzF4dUlDQWdJQ0FnSUNBZ0lDQWdJQ0FuUEdnMUlHTnNZWE56UFZ3aVpHbGhiRzluTFhScGRHeGxYQ0krUEM5b05UNG5JQ3RjYmlBZ0lDQWdJQ0FnSUNBZ0lDYzhMMlJwZGo0bklDdGNiaUFnSUNBZ0lDQWdJQ0FnSUNjOFpHbDJJR05zWVhOelBWd2laR2xoYkc5bkxXSnZaSGxjSWo0bklDdGNiaUFnSUNBZ0lDQWdJQ0FnSUNBZ0p6eHdQand2Y0Q0bklDdGNiaUFnSUNBZ0lDQWdJQ0FnSUNBZ0p6eGthWFlnWTJ4aGMzTTlYQ0p0ZUMxaGRYUnZJSFJsZUhRdFkyVnVkR1Z5WENJK0p5QXJYRzRnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdKenhrYVhZZ1kyeGhjM005WENKc2IyRmtaWElnYlhndFlYVjBieUJrTFdKc2IyTnJYQ0krSnlBclhHNGdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQW5QR1JwZGlCamJHRnpjejFjSW14dllXUmxjaTF6Y0dsdWJtVnlYQ0krUEM5a2FYWStKeUFyWEc0Z0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSnp3dlpHbDJQaWNnSzF4dUlDQWdJQ0FnSUNBZ0lDQWdJQ0FuUEM5a2FYWStKeUFyWEc0Z0lDQWdJQ0FnSUNBZ0lDQW5QQzlrYVhZK0p5QXJYRzRnSUNBZ0lDQWdJQ0FnSUNBblBHUnBkaUJqYkdGemN6MWNJbVJwWVd4dlp5MW1iMjkwWlhKY0lqNG5JQ3RjYmlBZ0lDQWdJQ0FnSUNBZ0lDYzhMMlJwZGo0bklDdGNiaUFnSUNBZ0lDQWdJQ0FuUEM5a2FYWStKeUFyWEc0Z0lDQWdJQ0FnSUNjOEwyUnBkajRuSUN0Y2JpQWdJQ0FnSUNjOEwyUnBkajRuWEc1Y2JpQWdJQ0FnSUdsbUlDZ2hRWEp5WVhrdWFYTkJjbkpoZVNodmNIUnBiMjV6TG1KMWRIUnZibk1wS1NCN1hHNGdJQ0FnSUNBZ0lHOXdkR2x2Ym5NdVluVjBkRzl1Y3lBOUlHOXdkR2x2Ym5NdVkyRnVZMlZzWVdKc1pTQS9JRVJGUmtGVlRGUmZVRkpQVUVWU1ZFbEZVeTVpZFhSMGIyNXpJRG9nVzExY2JpQWdJQ0FnSUgxY2JseHVJQ0FnSUNBZ2MzVndaWElvYjNCMGFXOXVjeXdnZEdWdGNHeGhkR1VwWEc1Y2JpQWdJQ0FnSUhSb2FYTXVjM0JwYm01bGNpQTlJRzUxYkd4Y2JpQWdJQ0I5WEc1Y2JpQWdJQ0J6YUc5M0tDa2dlMXh1SUNBZ0lDQWdjM1Z3WlhJdWMyaHZkeWdwWEc1Y2JpQWdJQ0FnSUhSb2FYTXVjM0JwYm01bGNpQTlJRzVsZHlCVGNHbHVibVZ5S0h0bGJHVnRaVzUwT2lCMGFHbHpMbWRsZEVWc1pXMWxiblFvS1M1eGRXVnllVk5sYkdWamRHOXlLQ2N1Ykc5aFpHVnlKeWw5S1Z4dUlDQWdJQ0FnZEdocGN5NXpjR2x1Ym1WeUxtRnVhVzFoZEdVb2RISjFaU2xjYmlBZ0lDQjlYRzVjYmlBZ0lDQm9hV1JsS0NrZ2UxeHVJQ0FnSUNBZ2MzVndaWEl1YUdsa1pTZ3BYRzVjYmlBZ0lDQWdJSFJvYVhNdWMzQnBibTVsY2k1aGJtbHRZWFJsS0daaGJITmxLVnh1SUNBZ0lDQWdkR2hwY3k1emNHbHVibVZ5SUQwZ2JuVnNiRnh1SUNBZ0lIMWNibHh1SUNBZ0lITjBZWFJwWXlCcFpHVnVkR2xtYVdWeUtDa2dlMXh1SUNBZ0lDQWdjbVYwZFhKdUlFNUJUVVZjYmlBZ0lDQjlYRzVjYmlBZ0lDQnpkR0YwYVdNZ1gwUlBUVWx1ZEdWeVptRmpaU2h2Y0hScGIyNXpLU0I3WEc0Z0lDQWdJQ0J5WlhSMWNtNGdibVYzSUV4dllXUmxjaWh2Y0hScGIyNXpLVnh1SUNBZ0lIMWNiaUFnZlZ4dVhHNGdJQzhxS2x4dUlDQWdLaUF0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzFjYmlBZ0lDb2dSRTlOSUVGd2FTQnBiWEJzWlcxbGJuUmhkR2x2Ymx4dUlDQWdLaUF0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzFjYmlBZ0lDb3ZYRzRnSUdOdmJuTjBJR052YlhCdmJtVnVkSE1nUFNCYlhWeHVJQ0JqYjI1emRDQmthV0ZzYjJkeklEMGdaRzlqZFcxbGJuUXVjWFZsY25sVFpXeGxZM1J2Y2tGc2JDaGdMaVI3UkdsaGJHOW5MbWxrWlc1MGFXWnBaWElvS1gxZ0tWeHVYRzRnSUdsbUlDaGthV0ZzYjJkektTQjdYRzRnSUNBZ1FYSnlZWGt1Wm5KdmJTaGthV0ZzYjJkektTNW1iM0pGWVdOb0tDaGxiR1Z0Wlc1MEtTQTlQaUI3WEc0Z0lDQWdJQ0JqYjI1emRDQmpiMjVtYVdjZ1BTQm5aWFJCZEhSeWFXSjFkR1Z6UTI5dVptbG5LR1ZzWlcxbGJuUXNJRVJGUmtGVlRGUmZVRkpQVUVWU1ZFbEZVeXdnUkVGVVFWOUJWRlJTVTE5UVVrOVFSVkpVU1VWVEtWeHVJQ0FnSUNBZ1kyOXVabWxuTG1Wc1pXMWxiblFnUFNCbGJHVnRaVzUwWEc1Y2JpQWdJQ0FnSUdsbUlDaGpiMjVtYVdjdWRIbHdaU0E5UFQwZ1RrRk5SU2tnZTF4dUlDQWdJQ0FnSUNBdkx5QnNiMkZrWlhKY2JpQWdJQ0FnSUNBZ1kyOXRjRzl1Wlc1MGN5NXdkWE5vS0c1bGR5Qk1iMkZrWlhJb1kyOXVabWxuS1NsY2JpQWdJQ0FnSUgxY2JpQWdJQ0I5S1Z4dUlDQjlYRzVjYmlBZ1pHOWpkVzFsYm5RdVlXUmtSWFpsYm5STWFYTjBaVzVsY2lnblkyeHBZMnNuTENBb1pYWmxiblFwSUQwK0lIdGNiaUFnSUNCamIyNXpkQ0JrWVhSaFZHOW5aMnhsUVhSMGNpQTlJR1YyWlc1MExuUmhjbWRsZEM1blpYUkJkSFJ5YVdKMWRHVW9KMlJoZEdFdGRHOW5aMnhsSnlsY2JpQWdJQ0JwWmlBb1pHRjBZVlJ2WjJkc1pVRjBkSElnSmlZZ1pHRjBZVlJ2WjJkc1pVRjBkSElnUFQwOUlFNUJUVVVwSUh0Y2JpQWdJQ0FnSUdOdmJuTjBJR2xrSUQwZ1pYWmxiblF1ZEdGeVoyVjBMbWRsZEVGMGRISnBZblYwWlNnblpHRjBZUzEwWVhKblpYUW5LVnh1SUNBZ0lDQWdZMjl1YzNRZ1pXeGxiV1Z1ZENBOUlHUnZZM1Z0Wlc1MExuRjFaWEo1VTJWc1pXTjBiM0lvYVdRcFhHNWNiaUFnSUNBZ0lHTnZibk4wSUdOdmJYQnZibVZ1ZENBOUlHTnZiWEJ2Ym1WdWRITXVabWx1WkNoaklEMCtJR011Wld4bGJXVnVkQ0E5UFQwZ1pXeGxiV1Z1ZENsY2JseHVJQ0FnSUNBZ2FXWWdLQ0ZqYjIxd2IyNWxiblFwSUh0Y2JpQWdJQ0FnSUNBZ2NtVjBkWEp1WEc0Z0lDQWdJQ0I5WEc1Y2JpQWdJQ0FnSUM4dklISmxiVzkyWlNCMGFHVWdabTlqZFhNZ2MzUmhkR1VnYjJZZ2RHaGxJSFJ5YVdkblpYSmNiaUFnSUNBZ0lHVjJaVzUwTG5SaGNtZGxkQzVpYkhWeUtDbGNibHh1SUNBZ0lDQWdZMjl0Y0c5dVpXNTBMbVJwWVd4dlp5NXphRzkzS0NsY2JpQWdJQ0I5WEc0Z0lIMHBYRzVjYmlBZ2NtVjBkWEp1SUV4dllXUmxjbHh1ZlNrb0tWeHVYRzVsZUhCdmNuUWdaR1ZtWVhWc2RDQk1iMkZrWlhKY2JpSXNJaThxS2x4dUlDb2dMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzFjYmlBcUlFeHBZMlZ1YzJWa0lIVnVaR1Z5SUUxSlZDQW9hSFIwY0hNNkx5OW5hWFJvZFdJdVkyOXRMM0YxWVhKckxXUmxkaTlRYUc5dWIyNHRSbkpoYldWM2IzSnJMMkpzYjJJdmJXRnpkR1Z5TDB4SlEwVk9VMFVwWEc0Z0tpQXRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMVnh1SUNvdlhHNXBiWEJ2Y25RZ1JHbGhiRzluSUdaeWIyMGdKeTR2YVc1a1pYZ25YRzVwYlhCdmNuUWdleUJuWlhSQmRIUnlhV0oxZEdWelEyOXVabWxuSUgwZ1puSnZiU0FuTGk0dlkyOXRjRzl1Wlc1MFRXRnVZV2RsY2lkY2JseHVZMjl1YzNRZ1VISnZiWEIwSUQwZ0tDZ3BJRDArSUh0Y2JseHVJQ0F2S2lwY2JpQWdJQ29nTFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0WEc0Z0lDQXFJRU52Ym5OMFlXNTBjMXh1SUNBZ0tpQXRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMWNiaUFnSUNvdlhHNWNiaUFnWTI5dWMzUWdUa0ZOUlNBOUlDZHdjbTl0Y0hRblhHNGdJR052Ym5OMElFUkZSa0ZWVEZSZlVGSlBVRVZTVkVsRlV5QTlJSHRjYmlBZ0lDQmxiR1Z0Wlc1ME9pQnVkV3hzTEZ4dUlDQWdJSFJwZEd4bE9pQnVkV3hzTEZ4dUlDQWdJRzFsYzNOaFoyVTZJRzUxYkd3c1hHNGdJQ0FnWTJGdVkyVnNZV0pzWlRvZ2RISjFaU3hjYmlBZ0lDQjBlWEJsT2lCT1FVMUZMRnh1SUNBZ0lHSjFkSFJ2Ym5NNklGdGNiaUFnSUNBZ0lIdGNiaUFnSUNBZ0lDQWdaWFpsYm5RNklDZGpZVzVqWld3bkxGeHVJQ0FnSUNBZ0lDQjBaWGgwT2lBblEyRnVZMlZzSnl4Y2JpQWdJQ0FnSUNBZ1pHbHpiV2x6Y3pvZ2RISjFaU3hjYmlBZ0lDQWdJQ0FnWTJ4aGMzTTZJQ2RpZEc0Z1luUnVMWE5sWTI5dVpHRnllU2NzWEc0Z0lDQWdJQ0I5TEZ4dUlDQWdJQ0FnZTF4dUlDQWdJQ0FnSUNCbGRtVnVkRG9nSjJOdmJtWnBjbTBuTEZ4dUlDQWdJQ0FnSUNCMFpYaDBPaUFuVDJzbkxGeHVJQ0FnSUNBZ0lDQmthWE50YVhOek9pQjBjblZsTEZ4dUlDQWdJQ0FnSUNCamJHRnpjem9nSjJKMGJpQmlkRzR0Y0hKcGJXRnllU2NzWEc0Z0lDQWdJQ0I5TEZ4dUlDQWdJRjBzWEc0Z0lIMWNiaUFnWTI5dWMzUWdSRUZVUVY5QlZGUlNVMTlRVWs5UVJWSlVTVVZUSUQwZ1cxeHVJQ0FnSUNkallXNWpaV3hoWW14bEp5eGNiaUFnWFZ4dVhHNGdJQzhxS2x4dUlDQWdLaUF0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzFjYmlBZ0lDb2dRMnhoYzNNZ1JHVm1hVzVwZEdsdmJseHVJQ0FnS2lBdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMxY2JpQWdJQ292WEc1Y2JpQWdZMnhoYzNNZ1VISnZiWEIwSUdWNGRHVnVaSE1nUkdsaGJHOW5JSHRjYmx4dUlDQWdJR052Ym5OMGNuVmpkRzl5S0c5d2RHbHZibk1nUFNCN2ZTa2dlMXh1SUNBZ0lDQWdZMjl1YzNRZ2RHVnRjR3hoZEdVZ1BTQW5KeUFyWEc0Z0lDQWdJQ0FuUEdScGRpQmpiR0Z6Y3oxY0ltUnBZV3h2WjF3aUlIUmhZbWx1WkdWNFBWd2lMVEZjSWlCeWIyeGxQVndpWkdsaGJHOW5YQ0krSnlBclhHNGdJQ0FnSUNBZ0lDYzhaR2wySUdOc1lYTnpQVndpWkdsaGJHOW5MV2x1Ym1WeVhDSWdjbTlzWlQxY0ltUnZZM1Z0Wlc1MFhDSStKeUFyWEc0Z0lDQWdJQ0FnSUNBZ0p6eGthWFlnWTJ4aGMzTTlYQ0prYVdGc2IyY3RZMjl1ZEdWdWRGd2lQaWNnSzF4dUlDQWdJQ0FnSUNBZ0lDQWdKenhrYVhZZ1kyeGhjM005WENKa2FXRnNiMmN0YUdWaFpHVnlYQ0krSnlBclhHNGdJQ0FnSUNBZ0lDQWdJQ0FnSUNjOGFEVWdZMnhoYzNNOVhDSmthV0ZzYjJjdGRHbDBiR1ZjSWo0OEwyZzFQaWNnSzF4dUlDQWdJQ0FnSUNBZ0lDQWdKend2WkdsMlBpY2dLMXh1SUNBZ0lDQWdJQ0FnSUNBZ0p6eGthWFlnWTJ4aGMzTTlYQ0prYVdGc2IyY3RZbTlrZVZ3aVBpY2dLMXh1SUNBZ0lDQWdJQ0FnSUNBZ0lDQW5QSEErUEM5d1BpY2dLMXh1SUNBZ0lDQWdJQ0FnSUNBZ0lDQW5QR2x1Y0hWMElHTnNZWE56UFZ3aVptOXliUzFqYjI1MGNtOXNYQ0lnZEhsd1pUMWNJblJsZUhSY0lpQjJZV3gxWlQxY0lsd2lQaWNnSzF4dUlDQWdJQ0FnSUNBZ0lDQWdKend2WkdsMlBpY2dLMXh1SUNBZ0lDQWdJQ0FnSUNBZ0p6eGthWFlnWTJ4aGMzTTlYQ0prYVdGc2IyY3RabTl2ZEdWeVhDSStKeUFyWEc0Z0lDQWdJQ0FnSUNBZ0lDQW5QQzlrYVhZK0p5QXJYRzRnSUNBZ0lDQWdJQ0FnSnp3dlpHbDJQaWNnSzF4dUlDQWdJQ0FnSUNBblBDOWthWFkrSnlBclhHNGdJQ0FnSUNBblBDOWthWFkrSjF4dVhHNGdJQ0FnSUNCcFppQW9JVUZ5Y21GNUxtbHpRWEp5WVhrb2IzQjBhVzl1Y3k1aWRYUjBiMjV6S1NrZ2UxeHVJQ0FnSUNBZ0lDQnZjSFJwYjI1ekxtSjFkSFJ2Ym5NZ1BTQkVSVVpCVlV4VVgxQlNUMUJGVWxSSlJWTXVZblYwZEc5dWMxeHVJQ0FnSUNBZ2ZWeHVYRzRnSUNBZ0lDQnpkWEJsY2lodmNIUnBiMjV6TENCMFpXMXdiR0YwWlNsY2JpQWdJQ0I5WEc1Y2JpQWdJQ0J6YUc5M0tDa2dlMXh1SUNBZ0lDQWdjM1Z3WlhJdWMyaHZkeWdwWEc0Z0lDQWdJQ0IwYUdsekxtRjBkR0ZqYUVsdWNIVjBSWFpsYm5Rb0tWeHVJQ0FnSUgxY2JseHVJQ0FnSUdocFpHVW9LU0I3WEc0Z0lDQWdJQ0J6ZFhCbGNpNW9hV1JsS0NrZ0lDQmNiaUFnSUNBZ0lIUm9hWE11WkdWMFlXTm9TVzV3ZFhSRmRtVnVkQ2dwSUNBZ1hHNGdJQ0FnZlZ4dVhHNGdJQ0FnWjJWMFNXNXdkWFFvS1NCN1hHNGdJQ0FnSUNCeVpYUjFjbTRnZEdocGN5NXZjSFJwYjI1ekxtVnNaVzFsYm5RdWNYVmxjbmxUWld4bFkzUnZjaWduTG1admNtMHRZMjl1ZEhKdmJDY3BYRzRnSUNBZ2ZWeHVYRzRnSUNBZ1lYUjBZV05vU1c1d2RYUkZkbVZ1ZENncElIdGNiaUFnSUNBZ0lIUm9hWE11Y21WbmFYTjBaWEpGYkdWdFpXNTBLSHNnZEdGeVoyVjBPaUIwYUdsekxtZGxkRWx1Y0hWMEtDa3NJR1YyWlc1ME9pQW5hMlY1ZFhBbklIMHBYRzRnSUNBZ2ZWeHVYRzRnSUNBZ1pHVjBZV05vU1c1d2RYUkZkbVZ1ZENncElIdGNiaUFnSUNBZ0lIUm9hWE11ZFc1eVpXZHBjM1JsY2tWc1pXMWxiblFvZXlCMFlYSm5aWFE2SUhSb2FYTXVaMlYwU1c1d2RYUW9LU3dnWlhabGJuUTZJQ2RyWlhsMWNDY2dmU2tnSUNBZ0lDQWdJQ0JjYmlBZ0lDQjlYRzVjYmlBZ0lDQnZia1ZzWlcxbGJuUkZkbVZ1ZENobGRtVnVkQ2tnZTF4dUlDQWdJQ0FnYVdZZ0tHVjJaVzUwTG5SaGNtZGxkQ0E5UFQwZ2RHaHBjeTVuWlhSSmJuQjFkQ2dwS1NCN1hHNGdJQ0FnSUNBZ0lISmxkSFZ5Ymx4dUlDQWdJQ0FnZlZ4dVhHNGdJQ0FnSUNCemRYQmxjaTV2YmtWc1pXMWxiblJGZG1WdWRDaGxkbVZ1ZENsY2JpQWdJQ0I5WEc1Y2JpQWdJQ0J6WlhSSmJuQjFkRlpoYkhWbEtIWmhiSFZsSUQwZ0p5Y3BJSHRjYmlBZ0lDQWdJSFJvYVhNdVoyVjBTVzV3ZFhRb0tTNTJZV3gxWlNBOUlIWmhiSFZsWEc0Z0lDQWdmVnh1WEc0Z0lDQWdaMlYwU1c1d2RYUldZV3gxWlNncElIdGNiaUFnSUNBZ0lISmxkSFZ5YmlCMGFHbHpMbWRsZEVsdWNIVjBLQ2t1ZG1Gc2RXVmNiaUFnSUNCOVhHNWNiaUFnSUNCemRHRjBhV01nYVdSbGJuUnBabWxsY2lncElIdGNiaUFnSUNBZ0lISmxkSFZ5YmlCT1FVMUZYRzRnSUNBZ2ZWeHVYRzRnSUNBZ2MzUmhkR2xqSUY5RVQwMUpiblJsY21aaFkyVW9iM0IwYVc5dWN5a2dlMXh1SUNBZ0lDQWdjbVYwZFhKdUlHNWxkeUJRY205dGNIUW9iM0IwYVc5dWN5bGNiaUFnSUNCOVhHNGdJSDFjYmx4dUlDQXZLaXBjYmlBZ0lDb2dMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRYRzRnSUNBcUlFUlBUU0JCY0drZ2FXMXdiR1Z0Wlc1MFlYUnBiMjVjYmlBZ0lDb2dMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRYRzRnSUNBcUwxeHVJQ0JqYjI1emRDQmpiMjF3YjI1bGJuUnpJRDBnVzExY2JpQWdZMjl1YzNRZ1pHbGhiRzluY3lBOUlHUnZZM1Z0Wlc1MExuRjFaWEo1VTJWc1pXTjBiM0pCYkd3b1lDNGtlMFJwWVd4dlp5NXBaR1Z1ZEdsbWFXVnlLQ2w5WUNsY2JseHVJQ0JwWmlBb1pHbGhiRzluY3lrZ2UxeHVJQ0FnSUVGeWNtRjVMbVp5YjIwb1pHbGhiRzluY3lrdVptOXlSV0ZqYUNnb1pXeGxiV1Z1ZENrZ1BUNGdlMXh1SUNBZ0lDQWdZMjl1YzNRZ1kyOXVabWxuSUQwZ1oyVjBRWFIwY21saWRYUmxjME52Ym1acFp5aGxiR1Z0Wlc1MExDQkVSVVpCVlV4VVgxQlNUMUJGVWxSSlJWTXNJRVJCVkVGZlFWUlVVbE5mVUZKUFVFVlNWRWxGVXlsY2JpQWdJQ0FnSUdOdmJtWnBaeTVsYkdWdFpXNTBJRDBnWld4bGJXVnVkRnh1WEc0Z0lDQWdJQ0JwWmlBb1kyOXVabWxuTG5SNWNHVWdQVDA5SUU1QlRVVXBJSHRjYmlBZ0lDQWdJQ0FnTHk4Z2NISnZiWEIwWEc0Z0lDQWdJQ0FnSUdOdmJYQnZibVZ1ZEhNdWNIVnphQ2h1WlhjZ1VISnZiWEIwS0dOdmJtWnBaeWtwWEc0Z0lDQWdJQ0I5WEc0Z0lDQWdmU2xjYmlBZ2ZWeHVYRzRnSUdSdlkzVnRaVzUwTG1Ga1pFVjJaVzUwVEdsemRHVnVaWElvSjJOc2FXTnJKeXdnS0dWMlpXNTBLU0E5UGlCN1hHNGdJQ0FnWTI5dWMzUWdaR0YwWVZSdloyZHNaVUYwZEhJZ1BTQmxkbVZ1ZEM1MFlYSm5aWFF1WjJWMFFYUjBjbWxpZFhSbEtDZGtZWFJoTFhSdloyZHNaU2NwWEc0Z0lDQWdhV1lnS0dSaGRHRlViMmRuYkdWQmRIUnlJQ1ltSUdSaGRHRlViMmRuYkdWQmRIUnlJRDA5UFNCT1FVMUZLU0I3WEc0Z0lDQWdJQ0JqYjI1emRDQnBaQ0E5SUdWMlpXNTBMblJoY21kbGRDNW5aWFJCZEhSeWFXSjFkR1VvSjJSaGRHRXRkR0Z5WjJWMEp5bGNiaUFnSUNBZ0lHTnZibk4wSUdWc1pXMWxiblFnUFNCa2IyTjFiV1Z1ZEM1eGRXVnllVk5sYkdWamRHOXlLR2xrS1Z4dVhHNGdJQ0FnSUNCamIyNXpkQ0JqYjIxd2IyNWxiblFnUFNCamIyMXdiMjVsYm5SekxtWnBibVFvWXlBOVBpQmpMbVZzWlcxbGJuUWdQVDA5SUdWc1pXMWxiblFwWEc1Y2JpQWdJQ0FnSUdsbUlDZ2hZMjl0Y0c5dVpXNTBLU0I3WEc0Z0lDQWdJQ0FnSUhKbGRIVnlibHh1SUNBZ0lDQWdmVnh1WEc0Z0lDQWdJQ0F2THlCeVpXMXZkbVVnZEdobElHWnZZM1Z6SUhOMFlYUmxJRzltSUhSb1pTQjBjbWxuWjJWeVhHNGdJQ0FnSUNCbGRtVnVkQzUwWVhKblpYUXVZbXgxY2lncFhHNWNiaUFnSUNBZ0lHTnZiWEJ2Ym1WdWRDNWthV0ZzYjJjdWMyaHZkeWdwWEc0Z0lDQWdmVnh1SUNCOUtWeHVYRzRnSUhKbGRIVnliaUJRY205dGNIUmNibjBwS0NsY2JseHVaWGh3YjNKMElHUmxabUYxYkhRZ1VISnZiWEIwWEc0aUxDSXZLaXBjYmlBcUlDMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRYRzRnS2lCTWFXTmxibk5sWkNCMWJtUmxjaUJOU1ZRZ0tHaDBkSEJ6T2k4dloybDBhSFZpTG1OdmJTOXhkV0Z5YXkxa1pYWXZVR2h2Ym05dUxVWnlZVzFsZDI5eWF5OWliRzlpTDIxaGMzUmxjaTlNU1VORlRsTkZLVnh1SUNvZ0xTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMWNiaUFxTDF4dWFXMXdiM0owSUVOdmJYQnZibVZ1ZENCbWNtOXRJQ2N1TGk5amIyMXdiMjVsYm5RblhHNXBiWEJ2Y25RZ1JYWmxiblFnWm5KdmJTQW5MaTR2TGk0dlkyOXRiVzl1TDJWMlpXNTBjeWRjYm1sdGNHOXlkQ0I3SUdacGJtUlVZWEpuWlhSQ2VVTnNZWE56SUgwZ1puSnZiU0FuTGk0dkxpNHZZMjl0Ylc5dUwzVjBhV3h6SjF4dWFXMXdiM0owSUhzZ1oyVjBRWFIwY21saWRYUmxjME52Ym1acFp5QjlJR1p5YjIwZ0p5NHVMMk52YlhCdmJtVnVkRTFoYm1GblpYSW5YRzVjYm1OdmJuTjBJRVJ5YjNCa2IzZHVJRDBnS0NncElEMCtJSHRjYmlBZ0x5b3FYRzRnSUNBcUlDMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExWeHVJQ0FnS2lCRGIyNXpkR0Z1ZEhOY2JpQWdJQ29nTFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0WEc0Z0lDQXFMMXh1WEc0Z0lHTnZibk4wSUU1QlRVVWdQU0FuWkhKdmNHUnZkMjRuWEc0Z0lHTnZibk4wSUZaRlVsTkpUMDRnUFNBbk1pNHdMakFuWEc0Z0lHTnZibk4wSUVSRlJrRlZURlJmVUZKUFVFVlNWRWxGVXlBOUlIdGNiaUFnSUNCbGJHVnRaVzUwT2lCdWRXeHNMRnh1SUNBZ0lHUmxabUYxYkhRNklIUnlkV1VzWEc0Z0lDQWdjMlZoY21Ob09pQm1ZV3h6WlN4Y2JpQWdmVnh1SUNCamIyNXpkQ0JFUVZSQlgwRlVWRkpUWDFCU1QxQkZVbFJKUlZNZ1BTQmJYRzRnSUNBZ0oyUmxabUYxYkhRbkxGeHVJQ0FnSUNkelpXRnlZMmduTEZ4dUlDQmRYRzVjYmlBZ0x5b3FYRzRnSUNBcUlDMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExWeHVJQ0FnS2lCRGJHRnpjeUJFWldacGJtbDBhVzl1WEc0Z0lDQXFJQzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMVnh1SUNBZ0tpOWNibHh1SUNCamJHRnpjeUJFY205d1pHOTNiaUJsZUhSbGJtUnpJRU52YlhCdmJtVnVkQ0I3WEc1Y2JpQWdJQ0JqYjI1emRISjFZM1J2Y2lodmNIUnBiMjV6SUQwZ2UzMHBJSHRjYmlBZ0lDQWdJSE4xY0dWeUtFNUJUVVVzSUZaRlVsTkpUMDRzSUVSRlJrRlZURlJmVUZKUFVFVlNWRWxGVXl3Z2IzQjBhVzl1Y3l3Z1JFRlVRVjlCVkZSU1UxOVFVazlRUlZKVVNVVlRMQ0JtWVd4elpTd2dabUZzYzJVcFhHNWNiaUFnSUNBZ0lHTnZibk4wSUhObGJHVmpkR1ZrSUQwZ2RHaHBjeTV2Y0hScGIyNXpMbVZzWlcxbGJuUXVjWFZsY25sVFpXeGxZM1J2Y2lnblcyUmhkR0V0YzJWc1pXTjBaV1JkSnlsY2JpQWdJQ0FnSUdOdmJuTjBJR2wwWlcwZ1BTQjBhR2x6TG1kbGRFbDBaVzFFWVhSaEtITmxiR1ZqZEdWa0tWeHVYRzRnSUNBZ0lDQjBhR2x6TG5ObGRGTmxiR1ZqZEdWa0tHbDBaVzB1ZG1Gc2RXVXNJR2wwWlcwdWRHVjRkQ3dnWm1Gc2MyVXBYRzRnSUNBZ2ZWeHVYRzRnSUNBZ2MyVjBVMlZzWldOMFpXUW9kbUZzZFdVZ1BTQW5KeXdnZEdWNGRDQTlJRzUxYkd3c0lHTm9aV05yUlhocGMzUnpJRDBnZEhKMVpTa2dlMXh1SUNBZ0lDQWdhV1lnS0NGMGFHbHpMbTl3ZEdsdmJuTXVaR1ZtWVhWc2RDa2dlMXh1SUNBZ0lDQWdJQ0J5WlhSMWNtNGdabUZzYzJWY2JpQWdJQ0FnSUgxY2JseHVJQ0FnSUNBZ2JHVjBJSFJsZUhSRWFYTndiR0Y1SUQwZ2RHVjRkRnh1SUNBZ0lDQWdkR2hwY3k1dmNIUnBiMjV6TG1Wc1pXMWxiblF1Y1hWbGNubFRaV3hsWTNSdmNpZ25MbVJsWm1GMWJIUXRkR1Y0ZENjcExtbHVibVZ5U0ZSTlRDQTlJSFJsZUhSY2JpQWdJQ0FnSUhSb2FYTXViM0IwYVc5dWN5NWxiR1Z0Wlc1MExuRjFaWEo1VTJWc1pXTjBiM0lvSjJsdWNIVjBXM1I1Y0dVOVhDSm9hV1JrWlc1Y0lsMG5LUzUyWVd4MVpTQTlJSFpoYkhWbFhHNWNiaUFnSUNBZ0lHTnZibk4wSUdsMFpXMXpJRDBnZEdocGN5NXZjSFJwYjI1ekxtVnNaVzFsYm5RdWNYVmxjbmxUWld4bFkzUnZja0ZzYkNnbkxtbDBaVzBuS1NCOGZDQmJYVnh1SUNBZ0lDQWdiR1YwSUdsMFpXMUdiM1Z1WkNBOUlHWmhiSE5sWEc1Y2JpQWdJQ0FnSUVGeWNtRjVMbVp5YjIwb2FYUmxiWE1wTG1admNrVmhZMmdvS0dsMFpXMHBJRDArSUh0Y2JpQWdJQ0FnSUNBZ2FXWWdLR2wwWlcwdVkyeGhjM05NYVhOMExtTnZiblJoYVc1ektDZHpaV3hsWTNSbFpDY3BLU0I3WEc0Z0lDQWdJQ0FnSUNBZ2FYUmxiUzVqYkdGemMweHBjM1F1Y21WdGIzWmxLQ2R6Wld4bFkzUmxaQ2NwWEc0Z0lDQWdJQ0FnSUgxY2JseHVJQ0FnSUNBZ0lDQmpiMjV6ZENCa1lYUmhJRDBnZEdocGN5NW5aWFJKZEdWdFJHRjBZU2hwZEdWdEtWeHVYRzRnSUNBZ0lDQWdJR2xtSUNoMllXeDFaU0E5UFQwZ1pHRjBZUzUyWVd4MVpTa2dlMXh1SUNBZ0lDQWdJQ0FnSUdsbUlDZ2hhWFJsYlM1amJHRnpjMHhwYzNRdVkyOXVkR0ZwYm5Nb0ozTmxiR1ZqZEdWa0p5a3BJSHRjYmlBZ0lDQWdJQ0FnSUNBZ0lHbDBaVzB1WTJ4aGMzTk1hWE4wTG1Ga1pDZ25jMlZzWldOMFpXUW5LVnh1SUNBZ0lDQWdJQ0FnSUgxY2JseHVJQ0FnSUNBZ0lDQWdJSFJsZUhSRWFYTndiR0Y1SUQwZ1pHRjBZUzUwWlhoMFhHNGdJQ0FnSUNBZ0lDQWdhWFJsYlVadmRXNWtJRDBnZEhKMVpWeHVJQ0FnSUNBZ0lDQjlYRzRnSUNBZ0lDQjlLVnh1WEc0Z0lDQWdJQ0JwWmlBb1kyaGxZMnRGZUdsemRITWdKaVlnYVhSbGJVWnZkVzVrS1NCN1hHNGdJQ0FnSUNBZ0lIUm9hWE11YjNCMGFXOXVjeTVsYkdWdFpXNTBMbkYxWlhKNVUyVnNaV04wYjNJb0p5NWtaV1poZFd4MExYUmxlSFFuS1M1cGJtNWxja2hVVFV3Z1BTQjBaWGgwUkdsemNHeGhlVnh1SUNBZ0lDQWdmU0JsYkhObElHbG1JQ2hqYUdWamEwVjRhWE4wY3lBbUppQWhhWFJsYlVadmRXNWtLU0I3WEc0Z0lDQWdJQ0FnSUhSb2NtOTNJRzVsZHlCRmNuSnZjaWhnSkh0T1FVMUZmUzRnVkdobElIWmhiSFZsSUZ3aUpIdDJZV3gxWlgxY0lpQmtiMlZ6SUc1dmRDQmxlR2x6ZENCcGJpQjBhR1VnYkdsemRDQnZaaUJwZEdWdGN5NWdLU0FnSUNBZ0lDQWdYRzRnSUNBZ0lDQjlYRzVjYmlBZ0lDQWdJSEpsZEhWeWJpQjBjblZsWEc0Z0lDQWdmVnh1WEc0Z0lDQWdaMlYwVTJWc1pXTjBaV1FvS1NCN1hHNGdJQ0FnSUNCeVpYUjFjbTRnZEdocGN5NXZjSFJwYjI1ekxtVnNaVzFsYm5RdWNYVmxjbmxUWld4bFkzUnZjaWduYVc1d2RYUmJkSGx3WlQxY0ltaHBaR1JsYmx3aVhTY3BMblpoYkhWbFhHNGdJQ0FnZlZ4dVhHNGdJQ0FnWjJWMFNYUmxiVVJoZEdFb2FYUmxiU0E5SUc1MWJHd3BJSHRjYmlBZ0lDQWdJR3hsZENCMFpYaDBJRDBnSnlkY2JpQWdJQ0FnSUd4bGRDQjJZV3gxWlNBOUlDY25YRzVjYmlBZ0lDQWdJR2xtSUNocGRHVnRLU0I3WEc0Z0lDQWdJQ0FnSUhSbGVIUWdQU0JwZEdWdExtZGxkRUYwZEhKcFluVjBaU2duWkdGMFlTMTBaWGgwSnlrZ2ZId2dhWFJsYlM1cGJtNWxja2hVVFV4Y2JseHVJQ0FnSUNBZ0lDQmpiMjV6ZENCelpXeGxZM1JsWkZSbGVIUk9iMlJsSUQwZ2FYUmxiUzV4ZFdWeWVWTmxiR1ZqZEc5eUtDY3VkR1Y0ZENjcFhHNGdJQ0FnSUNBZ0lHbG1JQ2h6Wld4bFkzUmxaRlJsZUhST2IyUmxLU0I3WEc0Z0lDQWdJQ0FnSUNBZ2RHVjRkQ0E5SUhObGJHVmpkR1ZrVkdWNGRFNXZaR1V1YVc1dVpYSklWRTFNWEc0Z0lDQWdJQ0FnSUgxY2JseHVJQ0FnSUNBZ0lDQjJZV3gxWlNBOUlHbDBaVzB1WjJWMFFYUjBjbWxpZFhSbEtDZGtZWFJoTFhaaGJIVmxKeWtnZkh3Z0p5ZGNiaUFnSUNBZ0lIMWNibHh1SUNBZ0lDQWdjbVYwZFhKdUlIc2dkR1Y0ZEN3Z2RtRnNkV1VnZlZ4dUlDQWdJSDFjYmx4dUlDQWdJRzl1Uld4bGJXVnVkRVYyWlc1MEtHVjJaVzUwS1NCN1hHNGdJQ0FnSUNCcFppQW9aWFpsYm5RdWRIbHdaU0E5UFQwZ1JYWmxiblF1VTFSQlVsUXBJSHRjYmlBZ0lDQWdJQ0FnWTI5dWMzUWdaSEp2Y0dSdmQyNGdQU0JtYVc1a1ZHRnlaMlYwUW5sRGJHRnpjeWhsZG1WdWRDNTBZWEpuWlhRc0lDZGtjbTl3Wkc5M2JpY3BYRzVjYmlBZ0lDQWdJQ0FnTHlwY2JpQWdJQ0FnSUNBZ0lDb2dhR2xrWlNCMGFHVWdZM1Z5Y21WdWRDQmtjbTl3Wkc5M2JpQnZibXg1SUdsbUlIUm9aU0JsZG1WdWRDQmpiMjVqWlhKdWN5QmhibTkwYUdWeUlHUnliM0JrYjNkdVhHNGdJQ0FnSUNBZ0lDQXFJR2hwWkdVZ1lXeHpieUJwWmlCMGFHVWdkWE5sY2lCamJHbGphM01nYjNWMGMybGtaU0JoSUdSeWIzQmtiM2R1WEc0Z0lDQWdJQ0FnSUNBcUwxeHVJQ0FnSUNBZ0lDQnBaaUFvSVdSeWIzQmtiM2R1SUh4OElHUnliM0JrYjNkdUlDRTlQU0IwYUdsekxtZGxkRVZzWlcxbGJuUW9LU2tnZTF4dUlDQWdJQ0FnSUNBZ0lIUm9hWE11YUdsa1pTZ3BYRzRnSUNBZ0lDQWdJSDFjYmx4dUlDQWdJQ0FnZlNCbGJITmxJR2xtSUNobGRtVnVkQzUwZVhCbElEMDlQU0FuWTJ4cFkyc25LU0I3WEc0Z0lDQWdJQ0FnSUdOdmJuTjBJR2wwWlcwZ1BTQm1hVzVrVkdGeVoyVjBRbmxEYkdGemN5aGxkbVZ1ZEM1MFlYSm5aWFFzSUNkcGRHVnRKeWxjYmx4dUlDQWdJQ0FnSUNCcFppQW9hWFJsYlNrZ2UxeHVJQ0FnSUNBZ0lDQWdJR2xtSUNocGRHVnRMbU5zWVhOelRHbHpkQzVqYjI1MFlXbHVjeWduWkdsellXSnNaV1FuS1NrZ2UxeHVJQ0FnSUNBZ0lDQWdJQ0FnY21WMGRYSnVYRzRnSUNBZ0lDQWdJQ0FnZlZ4dVhHNGdJQ0FnSUNBZ0lDQWdZMjl1YzNRZ2FYUmxiVWx1Wm04Z1BTQjBhR2x6TG1kbGRFbDBaVzFFWVhSaEtHbDBaVzBwWEc1Y2JpQWdJQ0FnSUNBZ0lDQnBaaUFvZEdocGN5NW5aWFJUWld4bFkzUmxaQ2dwSUNFOVBTQnBkR1Z0U1c1bWJ5NTJZV3gxWlNrZ2UxeHVJQ0FnSUNBZ0lDQWdJQ0FnTHk4Z2RHaGxJSFZ6WlhJZ2MyVnNaV04wWldRZ1lXNXZkR2hsY2lCMllXeDFaU3dnZDJVZ1pHbHpjR0YwWTJnZ2RHaGxJR1YyWlc1MFhHNGdJQ0FnSUNBZ0lDQWdJQ0IwYUdsekxuTmxkRk5sYkdWamRHVmtLR2wwWlcxSmJtWnZMblpoYkhWbExDQnBkR1Z0U1c1bWJ5NTBaWGgwTENCbVlXeHpaU2xjYmlBZ0lDQWdJQ0FnSUNBZ0lHTnZibk4wSUdSbGRHRnBiQ0E5SUhzZ2FYUmxiU3dnZEdWNGREb2dhWFJsYlVsdVptOHVkR1Y0ZEN3Z2RtRnNkV1U2SUdsMFpXMUpibVp2TG5aaGJIVmxJSDFjYmlBZ0lDQWdJQ0FnSUNBZ0lIUm9hWE11ZEhKcFoyZGxja1YyWlc1MEtFVjJaVzUwTGtsVVJVMWZVMFZNUlVOVVJVUXNJR1JsZEdGcGJDbGNiaUFnSUNBZ0lDQWdJQ0I5WEc1Y2JpQWdJQ0FnSUNBZ0lDQjBhR2x6TG1ocFpHVW9LVnh1SUNBZ0lDQWdJQ0FnSUhKbGRIVnlibHh1SUNBZ0lDQWdJQ0I5WEc1Y2JpQWdJQ0FnSUNBZ0x5OGdaRzl1SjNRZ2RHOW5aMnhsSUhSb1pTQmtjbTl3Wkc5M2JpQnBaaUIwYUdVZ1pYWmxiblFnWTI5dVkyVnlibk1nYUdWaFpHVnljeXdnWkdsMmFXUmxjbk5jYmlBZ0lDQWdJQ0FnWTI5dWMzUWdaSEp2Y0dSdmQyNU5aVzUxSUQwZ1ptbHVaRlJoY21kbGRFSjVRMnhoYzNNb1pYWmxiblF1ZEdGeVoyVjBMQ0FuWkhKdmNHUnZkMjR0YldWdWRTY3BYRzRnSUNBZ0lDQWdJR2xtSUNoa2NtOXdaRzkzYmsxbGJuVXBJSHRjYmlBZ0lDQWdJQ0FnSUNCeVpYUjFjbTVjYmlBZ0lDQWdJQ0FnZlZ4dVhHNGdJQ0FnSUNBZ0lIUm9hWE11ZEc5bloyeGxLQ2xjYmlBZ0lDQWdJSDFjYmlBZ0lDQjlYRzVjYmlBZ0lDQjBiMmRuYkdVb0tTQjdYRzRnSUNBZ0lDQnBaaUFvZEdocGN5NXZjSFJwYjI1ekxtVnNaVzFsYm5RdVkyeGhjM05NYVhOMExtTnZiblJoYVc1ektDZGhZM1JwZG1VbktTa2dlMXh1SUNBZ0lDQWdJQ0J5WlhSMWNtNGdkR2hwY3k1b2FXUmxLQ2xjYmlBZ0lDQWdJSDFjYmx4dUlDQWdJQ0FnY21WMGRYSnVJSFJvYVhNdWMyaHZkeWdwWEc0Z0lDQWdmVnh1WEc0Z0lDQWdjMmh2ZHlncElIdGNiaUFnSUNBZ0lHbG1JQ2gwYUdsekxtOXdkR2x2Ym5NdVpXeGxiV1Z1ZEM1amJHRnpjMHhwYzNRdVkyOXVkR0ZwYm5Nb0oyRmpkR2wyWlNjcEtTQjdYRzRnSUNBZ0lDQWdJSEpsZEhWeWJpQm1ZV3h6WlZ4dUlDQWdJQ0FnZlZ4dVhHNGdJQ0FnSUNCMGFHbHpMbTl3ZEdsdmJuTXVaV3hsYldWdWRDNWpiR0Z6YzB4cGMzUXVZV1JrS0NkaFkzUnBkbVVuS1Z4dVhHNGdJQ0FnSUNCamIyNXpkQ0JrY205d1pHOTNiazFsYm5VZ1BTQjBhR2x6TG05d2RHbHZibk11Wld4bGJXVnVkQzV4ZFdWeWVWTmxiR1ZqZEc5eUtDY3VaSEp2Y0dSdmQyNHRiV1Z1ZFNjcFhHNWNiaUFnSUNBZ0lDOHZJSE5qY205c2JDQjBieUIwYjNCY2JpQWdJQ0FnSUdSeWIzQmtiM2R1VFdWdWRTNXpZM0p2Ykd4VWIzQWdQU0F3WEc1Y2JpQWdJQ0FnSUhSb2FYTXVkSEpwWjJkbGNrVjJaVzUwS0VWMlpXNTBMbE5JVDFjcFhHNGdJQ0FnSUNCMGFHbHpMblJ5YVdkblpYSkZkbVZ1ZENoRmRtVnVkQzVUU0U5WFRpbGNibHh1SUNBZ0lDQWdkR2hwY3k1eVpXZHBjM1JsY2tWc1pXMWxiblFvZXlCMFlYSm5aWFE2SUdSeWIzQmtiM2R1VFdWdWRTd2daWFpsYm5RNklDZGpiR2xqYXljZ2ZTa2dJQ0FnSUNCY2JpQWdJQ0FnSUhSb2FYTXVjbVZuYVhOMFpYSkZiR1Z0Wlc1MEtIc2dkR0Z5WjJWME9pQmtiMk4xYldWdWRDNWliMlI1TENCbGRtVnVkRG9nUlhabGJuUXVVMVJCVWxRZ2ZTbGNibHh1SUNBZ0lDQWdjbVYwZFhKdUlIUnlkV1ZjYmlBZ0lDQjlYRzVjYmlBZ0lDQm9hV1JsS0NrZ2UxeHVJQ0FnSUNBZ2FXWWdLQ0YwYUdsekxtOXdkR2x2Ym5NdVpXeGxiV1Z1ZEM1amJHRnpjMHhwYzNRdVkyOXVkR0ZwYm5Nb0oyRmpkR2wyWlNjcEtTQjdYRzRnSUNBZ0lDQWdJSEpsZEhWeWJpQm1ZV3h6WlZ4dUlDQWdJQ0FnZlZ4dVhHNGdJQ0FnSUNCMGFHbHpMbTl3ZEdsdmJuTXVaV3hsYldWdWRDNWpiR0Z6YzB4cGMzUXVjbVZ0YjNabEtDZGhZM1JwZG1VbktWeHVYRzRnSUNBZ0lDQjBhR2x6TG5SeWFXZG5aWEpGZG1WdWRDaEZkbVZ1ZEM1SVNVUkZLVnh1SUNBZ0lDQWdkR2hwY3k1MGNtbG5aMlZ5UlhabGJuUW9SWFpsYm5RdVNFbEVSRVZPS1Z4dVhHNGdJQ0FnSUNCMGFHbHpMblZ1Y21WbmFYTjBaWEpGYkdWdFpXNTBLSHNnZEdGeVoyVjBPaUIwYUdsekxtOXdkR2x2Ym5NdVpXeGxiV1Z1ZEM1eGRXVnllVk5sYkdWamRHOXlLQ2N1WkhKdmNHUnZkMjR0YldWdWRTY3BMQ0JsZG1WdWREb2dKMk5zYVdOckp5QjlLU0FnSUNBZ0lGeHVJQ0FnSUNBZ2RHaHBjeTUxYm5KbFoybHpkR1Z5Uld4bGJXVnVkQ2g3SUhSaGNtZGxkRG9nWkc5amRXMWxiblF1WW05a2VTd2daWFpsYm5RNklFVjJaVzUwTGxOVVFWSlVJSDBwWEc1Y2JpQWdJQ0FnSUhKbGRIVnliaUIwY25WbFhHNGdJQ0FnZlZ4dVhHNGdJQ0FnYzNSaGRHbGpJR2xrWlc1MGFXWnBaWElvS1NCN1hHNGdJQ0FnSUNCeVpYUjFjbTRnVGtGTlJWeHVJQ0FnSUgxY2JseHVJQ0FnSUhOMFlYUnBZeUJmUkU5TlNXNTBaWEptWVdObEtHOXdkR2x2Ym5NcElIdGNiaUFnSUNBZ0lISmxkSFZ5YmlCemRYQmxjaTVmUkU5TlNXNTBaWEptWVdObEtFUnliM0JrYjNkdUxDQnZjSFJwYjI1ektWeHVJQ0FnSUgxY2JpQWdmVnh1WEc0Z0lDOHFLbHh1SUNBZ0tpQXRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMWNiaUFnSUNvZ1JFOU5JRUZ3YVNCcGJYQnNaVzFsYm5SaGRHbHZibHh1SUNBZ0tpQXRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMWNiaUFnSUNvdlhHNGdJR052Ym5OMElHTnZiWEJ2Ym1WdWRITWdQU0JiWFZ4dVhHNGdJR052Ym5OMElHUnliM0JrYjNkdWN5QTlJR1J2WTNWdFpXNTBMbkYxWlhKNVUyVnNaV04wYjNKQmJHd29ZQzRrZTA1QlRVVjlZQ2xjYmlBZ2FXWWdLR1J5YjNCa2IzZHVjeWtnZTF4dUlDQWdJRUZ5Y21GNUxtWnliMjBvWkhKdmNHUnZkMjV6S1M1bWIzSkZZV05vS0NobGJHVnRaVzUwS1NBOVBpQjdYRzRnSUNBZ0lDQmpiMjV6ZENCamIyNW1hV2NnUFNCblpYUkJkSFJ5YVdKMWRHVnpRMjl1Wm1sbktHVnNaVzFsYm5Rc0lFUkZSa0ZWVEZSZlVGSlBVRVZTVkVsRlV5d2dSRUZVUVY5QlZGUlNVMTlRVWs5UVJWSlVTVVZUS1Z4dUlDQWdJQ0FnWTI5dVptbG5MbVZzWlcxbGJuUWdQU0JsYkdWdFpXNTBYRzVjYmlBZ0lDQWdJR2xtSUNnaFkyOXVabWxuTG5ObFlYSmphQ2tnZTF4dUlDQWdJQ0FnSUNCamIyMXdiMjVsYm5SekxuQjFjMmdvYm1WM0lFUnliM0JrYjNkdUtHTnZibVpwWnlrcFhHNGdJQ0FnSUNCOVhHNGdJQ0FnZlNsY2JpQWdmVnh1WEc0Z0lHUnZZM1Z0Wlc1MExtRmtaRVYyWlc1MFRHbHpkR1Z1WlhJb0oyTnNhV05ySnl3Z0tHVjJaVzUwS1NBOVBpQjdYRzRnSUNBZ1kyOXVjM1FnWkhKdmNHUnZkMjVOWlc1MUlEMGdabWx1WkZSaGNtZGxkRUo1UTJ4aGMzTW9aWFpsYm5RdWRHRnlaMlYwTENBblpISnZjR1J2ZDI0dGJXVnVkU2NwWEc0Z0lDQWdhV1lnS0dSeWIzQmtiM2R1VFdWdWRTa2dlMXh1SUNBZ0lDQWdjbVYwZFhKdVhHNGdJQ0FnZlZ4dVhHNGdJQ0FnWTI5dWMzUWdaSEp2Y0dSdmQyNGdQU0JtYVc1a1ZHRnlaMlYwUW5sRGJHRnpjeWhsZG1WdWRDNTBZWEpuWlhRc0lDZGtjbTl3Wkc5M2JpY3BYRzVjYmlBZ0lDQnBaaUFvWkhKdmNHUnZkMjRwSUh0Y2JpQWdJQ0FnSUdOdmJuTjBJR1JoZEdGVWIyZG5iR1ZCZEhSeUlEMGdaSEp2Y0dSdmQyNHVaMlYwUVhSMGNtbGlkWFJsS0Nka1lYUmhMWFJ2WjJkc1pTY3BYRzRnSUNBZ0lDQnBaaUFvWkdGMFlWUnZaMmRzWlVGMGRISWdKaVlnWkdGMFlWUnZaMmRzWlVGMGRISWdQVDA5SUU1QlRVVWdKaVlnWkhKdmNHUnZkMjRwSUh0Y2JpQWdJQ0FnSUNBZ1kyOXVjM1FnWTI5dGNHOXVaVzUwSUQwZ1kyOXRjRzl1Wlc1MGN5NW1hVzVrS0dNZ1BUNGdZeTVuWlhSRmJHVnRaVzUwS0NrZ1BUMDlJR1J5YjNCa2IzZHVLVnh1WEc0Z0lDQWdJQ0FnSUdsbUlDZ2hZMjl0Y0c5dVpXNTBLU0I3WEc0Z0lDQWdJQ0FnSUNBZ2NtVjBkWEp1WEc0Z0lDQWdJQ0FnSUgxY2JseHVJQ0FnSUNBZ0lDQmpiMjF3YjI1bGJuUXVkRzluWjJ4bEtDbGNiaUFnSUNBZ0lIMWNiaUFnSUNCOVhHNGdJSDBwWEc1Y2JpQWdjbVYwZFhKdUlFUnliM0JrYjNkdVhHNTlLU2dwWEc1Y2JtVjRjRzl5ZENCa1pXWmhkV3gwSUVSeWIzQmtiM2R1WEc0aUxDSXZLaXBjYmlBcUlDMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRYRzRnS2lCTWFXTmxibk5sWkNCMWJtUmxjaUJOU1ZRZ0tHaDBkSEJ6T2k4dloybDBhSFZpTG1OdmJTOXhkV0Z5YXkxa1pYWXZVR2h2Ym05dUxVWnlZVzFsZDI5eWF5OWliRzlpTDIxaGMzUmxjaTlNU1VORlRsTkZLVnh1SUNvZ0xTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMWNiaUFxTDF4dWFXMXdiM0owSUVSeWIzQmtiM2R1SUdaeWIyMGdKeTR2YVc1a1pYZ25YRzVwYlhCdmNuUWdleUJtYVc1a1ZHRnlaMlYwUW5sRGJHRnpjeUI5SUdaeWIyMGdKeTR1THk0dUwyTnZiVzF2Ymk5MWRHbHNjeWRjYm1sdGNHOXlkQ0I3SUdkbGRFRjBkSEpwWW5WMFpYTkRiMjVtYVdjZ2ZTQm1jbTl0SUNjdUxpOWpiMjF3YjI1bGJuUk5ZVzVoWjJWeUoxeHVYRzVqYjI1emRDQkVjbTl3Wkc5M2JsTmxZWEpqYUNBOUlDZ29LU0E5UGlCN1hHNWNiaUFnTHlvcVhHNGdJQ0FxSUMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFZ4dUlDQWdLaUJEYjI1emRHRnVkSE5jYmlBZ0lDb2dMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRYRzRnSUNBcUwxeHVYRzRnSUdOdmJuTjBJRTVCVFVVZ1BTQkVjbTl3Wkc5M2JpNXBaR1Z1ZEdsbWFXVnlLQ2xjYmlBZ1kyOXVjM1FnUkVWR1FWVk1WRjlRVWs5UVJWSlVTVVZUSUQwZ2UxeHVJQ0FnSUdWc1pXMWxiblE2SUc1MWJHd3NYRzRnSUNBZ1pHVm1ZWFZzZERvZ2RISjFaU3hjYmlBZ0lDQnpaV0Z5WTJnNklIUnlkV1VzWEc0Z0lIMWNiaUFnWTI5dWMzUWdSRUZVUVY5QlZGUlNVMTlRVWs5UVJWSlVTVVZUSUQwZ1cxeHVJQ0FnSUNka1pXWmhkV3gwSnl4Y2JpQWdJQ0FuYzJWaGNtTm9KeXhjYmlBZ1hWeHVYRzRnSUM4cUtseHVJQ0FnS2lBdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMxY2JpQWdJQ29nUTJ4aGMzTWdSR1ZtYVc1cGRHbHZibHh1SUNBZ0tpQXRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMWNiaUFnSUNvdlhHNWNiaUFnWTJ4aGMzTWdSSEp2Y0dSdmQyNVRaV0Z5WTJnZ1pYaDBaVzVrY3lCRWNtOXdaRzkzYmlCN1hHNWNiaUFnSUNCamIyNXpkSEoxWTNSdmNpaHZjSFJwYjI1eklEMGdlMzBwSUh0Y2JpQWdJQ0FnSUhOMWNHVnlLRzl3ZEdsdmJuTXBYRzVjYmlBZ0lDQWdJSFJvYVhNdVptbHNkR1Z5U1hSbGJYTklZVzVrYkdWeUlEMGdLR1YyWlc1MEtTQTlQaUI3WEc0Z0lDQWdJQ0FnSUdOdmJuTjBJSE5sWVhKamFDQTlJR1YyWlc1MExuUmhjbWRsZEM1MllXeDFaVnh1WEc0Z0lDQWdJQ0FnSUdsbUlDaHpaV0Z5WTJnZ1BUMDlJQ2NuS1NCN1hHNGdJQ0FnSUNBZ0lDQWdkR2hwY3k1emFHOTNTWFJsYlhNb0tWeHVJQ0FnSUNBZ0lDQWdJSEpsZEhWeWJseHVJQ0FnSUNBZ0lDQjlYRzVjYmx4dUlDQWdJQ0FnSUNCMGFHbHpMbWRsZEVsMFpXMXpLQ2t1Wm05eVJXRmphQ2dvYVhSbGJTa2dQVDRnZTF4dUlDQWdJQ0FnSUNBZ0lHTnZibk4wSUdadUlEMGdkSGx3Wlc5bUlIUm9hWE11YjNCMGFXOXVjeTVtYVd4MFpYSkpkR1Z0SUQwOVBTQW5ablZ1WTNScGIyNG5JRDhnZEdocGN5NXZjSFJwYjI1ekxtWnBiSFJsY2tsMFpXMGdPaUIwYUdsekxtWnBiSFJsY2tsMFpXMWNibHh1SUNBZ0lDQWdJQ0FnSUdsbUlDaG1iaWh6WldGeVkyZ3NJR2wwWlcwcEtTQjdYRzRnSUNBZ0lDQWdJQ0FnSUNCcGRHVnRMbVZzWlcxbGJuUXVjM1I1YkdVdVpHbHpjR3hoZVNBOUlDZGliRzlqYXlkY2JpQWdJQ0FnSUNBZ0lDQjlJR1ZzYzJVZ2UxeHVJQ0FnSUNBZ0lDQWdJQ0FnYVhSbGJTNWxiR1Z0Wlc1MExuTjBlV3hsTG1ScGMzQnNZWGtnUFNBbmJtOXVaU2RjYmlBZ0lDQWdJQ0FnSUNCOVhHNGdJQ0FnSUNBZ0lIMHBYRzRnSUNBZ0lDQjlYRzVjYmlBZ0lDQWdJSFJvYVhNdVoyVjBVMlZoY21Ob1NXNXdkWFFvS1M1aFpHUkZkbVZ1ZEV4cGMzUmxibVZ5S0NkclpYbDFjQ2NzSUhSb2FYTXVabWxzZEdWeVNYUmxiWE5JWVc1a2JHVnlLVnh1SUNBZ0lIMWNibHh1SUNBZ0lHWnBiSFJsY2tsMFpXMG9jMlZoY21Ob0lEMGdKeWNzSUdsMFpXMGdQU0I3ZlNrZ2UxeHVJQ0FnSUNBZ2FXWWdLR2wwWlcwdWRtRnNkV1V1YVc1a1pYaFBaaWh6WldGeVkyZ3BJRDRnTFRGY2JpQWdJQ0FnSUNBZ2ZId2dhWFJsYlM1MFpYaDBMbWx1WkdWNFQyWW9jMlZoY21Ob0tTQStJQzB4S1NCN1hHNGdJQ0FnSUNBZ0lISmxkSFZ5YmlCMGNuVmxYRzRnSUNBZ0lDQjlYRzVjYmlBZ0lDQWdJSEpsZEhWeWJpQm1ZV3h6WlZ4dUlDQWdJSDFjYmx4dUlDQWdJR2RsZEVsMFpXMXpLQ2tnZTF4dUlDQWdJQ0FnYkdWMElHbDBaVzF6SUQwZ1FYSnlZWGt1Wm5KdmJTaDBhR2x6TG05d2RHbHZibk11Wld4bGJXVnVkQzV4ZFdWeWVWTmxiR1ZqZEc5eVFXeHNLQ2N1YVhSbGJTY3BJSHg4SUZ0ZEtWeHVJQ0FnSUNBZ2FYUmxiWE1nUFNCcGRHVnRjeTV0WVhBb0tHbDBaVzBwSUQwK0lIdGNiaUFnSUNBZ0lDQWdZMjl1YzNRZ2FXNW1ieUE5SUhSb2FYTXVaMlYwU1hSbGJVUmhkR0VvYVhSbGJTbGNiaUFnSUNBZ0lDQWdjbVYwZFhKdUlIc2dkR1Y0ZERvZ2FXNW1ieTUwWlhoMExDQjJZV3gxWlRvZ2FXNW1ieTUyWVd4MVpTd2daV3hsYldWdWREb2dhWFJsYlNCOVhHNGdJQ0FnSUNCOUtWeHVYRzRnSUNBZ0lDQnlaWFIxY200Z2FYUmxiWE5jYmlBZ0lDQjlYRzVjYmlBZ0lDQnphRzkzU1hSbGJYTW9LU0I3WEc0Z0lDQWdJQ0IwYUdsekxtZGxkRWwwWlcxektDa3VabTl5UldGamFDZ29hWFJsYlNrZ1BUNGdlMXh1SUNBZ0lDQWdJQ0JqYjI1emRDQnBJRDBnYVhSbGJWeHVJQ0FnSUNBZ0lDQnBMbVZzWlcxbGJuUXVjM1I1YkdVdVpHbHpjR3hoZVNBOUlDZGliRzlqYXlkY2JpQWdJQ0FnSUgwcFhHNGdJQ0FnZlZ4dVhHNGdJQ0FnWjJWMFUyVmhjbU5vU1c1d2RYUW9LU0I3WEc0Z0lDQWdJQ0J5WlhSMWNtNGdkR2hwY3k1dmNIUnBiMjV6TG1Wc1pXMWxiblF1Y1hWbGNubFRaV3hsWTNSdmNpZ25MbVJ5YjNCa2IzZHVMVzFsYm5VZ2FXNXdkWFFuS1Z4dUlDQWdJSDFjYmx4dUlDQWdJR2hwWkdVb0tTQjdYRzRnSUNBZ0lDQnBaaUFvYzNWd1pYSXVhR2xrWlNncEtTQjdYRzRnSUNBZ0lDQWdJQzh2SUhKbGMyVjBJSFJvWlNCMllXeDFaVnh1SUNBZ0lDQWdJQ0IwYUdsekxtZGxkRk5sWVhKamFFbHVjSFYwS0NrdWRtRnNkV1VnUFNBbkoxeHVJQ0FnSUNBZ0lDQXZMeUJ6YUc5M0lHRnNiQ0JwZEdWdGMxeHVJQ0FnSUNBZ0lDQjBhR2x6TG5Ob2IzZEpkR1Z0Y3lncFhHNGdJQ0FnSUNCOVhHNGdJQ0FnZlZ4dVhHNGdJQ0FnYzNSaGRHbGpJRjlFVDAxSmJuUmxjbVpoWTJVb2IzQjBhVzl1Y3lrZ2UxeHVJQ0FnSUNBZ2NtVjBkWEp1SUc1bGR5QkVjbTl3Wkc5M2JsTmxZWEpqYUNodmNIUnBiMjV6S1Z4dUlDQWdJSDFjYmlBZ2ZWeHVYRzRnSUM4cUtseHVJQ0FnS2lBdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMxY2JpQWdJQ29nUkU5TklFRndhU0JwYlhCc1pXMWxiblJoZEdsdmJseHVJQ0FnS2lBdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMxY2JpQWdJQ292WEc0Z0lHTnZibk4wSUdOdmJYQnZibVZ1ZEhNZ1BTQmJYVnh1SUNCamIyNXpkQ0JrY205d1pHOTNibk1nUFNCa2IyTjFiV1Z1ZEM1eGRXVnllVk5sYkdWamRHOXlRV3hzS0dBdUpIdE9RVTFGZldBcFhHNWNiaUFnYVdZZ0tHUnliM0JrYjNkdWN5a2dlMXh1SUNBZ0lFRnljbUY1TG1aeWIyMG9aSEp2Y0dSdmQyNXpLUzVtYjNKRllXTm9LQ2hsYkdWdFpXNTBLU0E5UGlCN1hHNGdJQ0FnSUNCamIyNXpkQ0JqYjI1bWFXY2dQU0JuWlhSQmRIUnlhV0oxZEdWelEyOXVabWxuS0dWc1pXMWxiblFzSUVSRlJrRlZURlJmVUZKUFVFVlNWRWxGVXl3Z1JFRlVRVjlCVkZSU1UxOVFVazlRUlZKVVNVVlRLVnh1SUNBZ0lDQWdZMjl1Wm1sbkxtVnNaVzFsYm5RZ1BTQmxiR1Z0Wlc1MFhHNWNiaUFnSUNBZ0lHbG1JQ2hqYjI1bWFXY3VjMlZoY21Ob0tTQjdYRzRnSUNBZ0lDQWdJQzh2SUhObFlYSmphRnh1SUNBZ0lDQWdJQ0JqYjIxd2IyNWxiblJ6TG5CMWMyZ29ibVYzSUVSeWIzQmtiM2R1VTJWaGNtTm9LR052Ym1acFp5a3BYRzRnSUNBZ0lDQjlYRzRnSUNBZ2ZTbGNiaUFnZlZ4dVhHNGdJR2xtSUNoa2NtOXdaRzkzYm5NcElIdGNiaUFnSUNCa2IyTjFiV1Z1ZEM1aFpHUkZkbVZ1ZEV4cGMzUmxibVZ5S0NkamJHbGpheWNzSUNobGRtVnVkQ2tnUFQ0Z2UxeHVJQ0FnSUNBZ1kyOXVjM1FnWkhKdmNHUnZkMjVOWlc1MUlEMGdabWx1WkZSaGNtZGxkRUo1UTJ4aGMzTW9aWFpsYm5RdWRHRnlaMlYwTENBblpISnZjR1J2ZDI0dGJXVnVkU2NwWEc0Z0lDQWdJQ0JwWmlBb1pISnZjR1J2ZDI1TlpXNTFLU0I3WEc0Z0lDQWdJQ0FnSUhKbGRIVnlibHh1SUNBZ0lDQWdmVnh1WEc0Z0lDQWdJQ0JqYjI1emRDQmtjbTl3Wkc5M2JpQTlJR1pwYm1SVVlYSm5aWFJDZVVOc1lYTnpLR1YyWlc1MExuUmhjbWRsZEN3Z0oyUnliM0JrYjNkdUp5bGNibHh1SUNBZ0lDQWdhV1lnS0dSeWIzQmtiM2R1S1NCN1hHNGdJQ0FnSUNBZ0lHTnZibk4wSUdSaGRHRlViMmRuYkdWQmRIUnlJRDBnWkhKdmNHUnZkMjR1WjJWMFFYUjBjbWxpZFhSbEtDZGtZWFJoTFhSdloyZHNaU2NwWEc0Z0lDQWdJQ0FnSUdsbUlDaGtZWFJoVkc5bloyeGxRWFIwY2lBbUppQmtZWFJoVkc5bloyeGxRWFIwY2lBOVBUMGdUa0ZOUlNBbUppQmtjbTl3Wkc5M2Jpa2dlMXh1SUNBZ0lDQWdJQ0FnSUdOdmJuTjBJR052YlhCdmJtVnVkQ0E5SUdOdmJYQnZibVZ1ZEhNdVptbHVaQ2hqSUQwK0lHTXVaMlYwUld4bGJXVnVkQ2dwSUQwOVBTQmtjbTl3Wkc5M2JpbGNibHh1SUNBZ0lDQWdJQ0FnSUdsbUlDZ2hZMjl0Y0c5dVpXNTBLU0I3WEc0Z0lDQWdJQ0FnSUNBZ0lDQnlaWFIxY201Y2JpQWdJQ0FnSUNBZ0lDQjlYRzVjYmlBZ0lDQWdJQ0FnSUNCamIyMXdiMjVsYm5RdWRHOW5aMnhsS0NsY2JpQWdJQ0FnSUNBZ2ZWeHVJQ0FnSUNBZ2ZWeHVJQ0FnSUgwcFhHNGdJSDFjYmx4dUlDQnlaWFIxY200Z1JISnZjR1J2ZDI1VFpXRnlZMmhjYm4wcEtDbGNibHh1Wlhod2IzSjBJR1JsWm1GMWJIUWdSSEp2Y0dSdmQyNVRaV0Z5WTJoY2JpSXNJaThxS2x4dUlDb2dMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzFjYmlBcUlFeHBZMlZ1YzJWa0lIVnVaR1Z5SUUxSlZDQW9hSFIwY0hNNkx5OW5hWFJvZFdJdVkyOXRMM0YxWVhKckxXUmxkaTlRYUc5dWIyNHRSbkpoYldWM2IzSnJMMkpzYjJJdmJXRnpkR1Z5TDB4SlEwVk9VMFVwWEc0Z0tpQXRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMVnh1SUNvdlhHNXBiWEJ2Y25RZ1EyOXRjRzl1Wlc1MElHWnliMjBnSnk0dUwyTnZiWEJ2Ym1WdWRDZGNibHh1WTI5dWMzUWdURzloWkdWeUlEMGdLQ2dwSUQwK0lIdGNiaUFnTHlvcVhHNGdJQ0FxSUMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFZ4dUlDQWdLaUJEYjI1emRHRnVkSE5jYmlBZ0lDb2dMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRYRzRnSUNBcUwxeHVYRzRnSUdOdmJuTjBJRTVCVFVVZ1BTQW5iRzloWkdWeUoxeHVJQ0JqYjI1emRDQldSVkpUU1U5T0lEMGdKekl1TUM0d0oxeHVJQ0JqYjI1emRDQkVSVVpCVlV4VVgxQlNUMUJGVWxSSlJWTWdQU0I3WEc0Z0lDQWdaV3hsYldWdWREb2diblZzYkN4Y2JpQWdJQ0JqYjJ4dmNqb2diblZzYkN4Y2JpQWdJQ0J6YVhwbE9pQnVkV3hzTEZ4dUlDQjlYRzRnSUdOdmJuTjBJRVJCVkVGZlFWUlVVbE5mVUZKUFVFVlNWRWxGVXlBOUlGdGRYRzVjYmlBZ0x5b3FYRzRnSUNBcUlDMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExWeHVJQ0FnS2lCRGJHRnpjeUJFWldacGJtbDBhVzl1WEc0Z0lDQXFJQzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMVnh1SUNBZ0tpOWNibHh1SUNCamJHRnpjeUJNYjJGa1pYSWdaWGgwWlc1a2N5QkRiMjF3YjI1bGJuUWdlMXh1WEc0Z0lDQWdZMjl1YzNSeWRXTjBiM0lvYjNCMGFXOXVjeUE5SUh0OUtTQjdYRzRnSUNBZ0lDQnpkWEJsY2loT1FVMUZMQ0JXUlZKVFNVOU9MQ0JFUlVaQlZVeFVYMUJTVDFCRlVsUkpSVk1zSUc5d2RHbHZibk1zSUVSQlZFRmZRVlJVVWxOZlVGSlBVRVZTVkVsRlV5d2dabUZzYzJVc0lHWmhiSE5sS1Z4dVhHNGdJQ0FnSUNBdkx5QnpaWFFnWTI5c2IzSmNiaUFnSUNBZ0lHTnZibk4wSUd4dllXUmxjbE53YVc1dVpYSWdQU0IwYUdsekxtZGxkRk53YVc1dVpYSW9LVnh1SUNBZ0lDQWdhV1lnS0hSNWNHVnZaaUIwYUdsekxtOXdkR2x2Ym5NdVkyOXNiM0lnUFQwOUlDZHpkSEpwYm1jblhHNGdJQ0FnSUNBZ0lDWW1JQ0ZzYjJGa1pYSlRjR2x1Ym1WeUxtTnNZWE56VEdsemRDNWpiMjUwWVdsdWN5aGdZMjlzYjNJdEpIdDBhR2x6TG05d2RHbHZibk11WTI5c2IzSjlZQ2twSUh0Y2JpQWdJQ0FnSUNBZ2JHOWhaR1Z5VTNCcGJtNWxjaTVqYkdGemMweHBjM1F1WVdSa0tHQmpiMnh2Y2kwa2UzUm9hWE11YjNCMGFXOXVjeTVqYjJ4dmNuMWdLVnh1SUNBZ0lDQWdmVnh1WEc0Z0lDQWdJQ0IwYUdsekxtTjFjM1J2YlZOcGVtVWdQU0IwYUdsekxtOXdkR2x2Ym5NdWMybDZaU0FoUFQwZ2JuVnNiRnh1SUNBZ0lIMWNibHh1SUNBZ0lHZGxkRU5zYVdWdWRGTnBlbVVvS1NCN1hHNGdJQ0FnSUNCcFppQW9JWFJvYVhNdVkzVnpkRzl0VTJsNlpTa2dlMXh1SUNBZ0lDQWdJQ0JqYjI1emRDQnphWHBsSUQwZ2RHaHBjeTV2Y0hScGIyNXpMbVZzWlcxbGJuUXVaMlYwUW05MWJtUnBibWREYkdsbGJuUlNaV04wS0NrZ0lDQWdJQ0FnSUZ4dUlDQWdJQ0FnSUNCeVpYUjFjbTRnYzJsNlpTNW9aV2xuYUhSY2JpQWdJQ0FnSUgxY2JseHVJQ0FnSUNBZ2NtVjBkWEp1SUhSb2FYTXViM0IwYVc5dWN5NXphWHBsWEc0Z0lDQWdmVnh1WEc0Z0lDQWdaMlYwVTNCcGJtNWxjaWdwSUh0Y2JpQWdJQ0FnSUhKbGRIVnliaUIwYUdsekxtOXdkR2x2Ym5NdVpXeGxiV1Z1ZEM1eGRXVnllVk5sYkdWamRHOXlLQ2N1Ykc5aFpHVnlMWE53YVc1dVpYSW5LVnh1SUNBZ0lIMWNibHh1SUNBZ0lITm9iM2NvS1NCN1hHNGdJQ0FnSUNCcFppQW9kR2hwY3k1dmNIUnBiMjV6TG1Wc1pXMWxiblF1WTJ4aGMzTk1hWE4wTG1OdmJuUmhhVzV6S0Nkb2FXUmxKeWtwSUh0Y2JpQWdJQ0FnSUNBZ2RHaHBjeTV2Y0hScGIyNXpMbVZzWlcxbGJuUXVZMnhoYzNOTWFYTjBMbkpsYlc5MlpTZ25hR2xrWlNjcFhHNGdJQ0FnSUNCOVhHNWNiaUFnSUNBZ0lHTnZibk4wSUhOcGVtVWdQU0IwYUdsekxtZGxkRU5zYVdWdWRGTnBlbVVvS1Z4dUlDQWdJQ0FnZEdocGN5NXZjSFJwYjI1ekxuTnBlbVVnUFNCemFYcGxYRzVjYmlBZ0lDQWdJR2xtSUNoMGFHbHpMbU4xYzNSdmJWTnBlbVVwSUh0Y2JpQWdJQ0FnSUNBZ2RHaHBjeTV2Y0hScGIyNXpMbVZzWlcxbGJuUXVjM1I1YkdVdWQybGtkR2dnUFNCZ0pIdDBhR2x6TG05d2RHbHZibk11YzJsNlpYMXdlR0JjYmlBZ0lDQWdJQ0FnZEdocGN5NXZjSFJwYjI1ekxtVnNaVzFsYm5RdWMzUjViR1V1YUdWcFoyaDBJRDBnWUNSN2RHaHBjeTV2Y0hScGIyNXpMbk5wZW1WOWNIaGdYRzVjYmlBZ0lDQWdJQ0FnWTI5dWMzUWdiRzloWkdWeVUzQnBibTVsY2lBOUlIUm9hWE11WjJWMFUzQnBibTVsY2lncFhHNGdJQ0FnSUNBZ0lHeHZZV1JsY2xOd2FXNXVaWEl1YzNSNWJHVXVkMmxrZEdnZ1BTQmdKSHQwYUdsekxtOXdkR2x2Ym5NdWMybDZaWDF3ZUdCY2JpQWdJQ0FnSUNBZ2JHOWhaR1Z5VTNCcGJtNWxjaTV6ZEhsc1pTNW9aV2xuYUhRZ1BTQmdKSHQwYUdsekxtOXdkR2x2Ym5NdWMybDZaWDF3ZUdCY2JpQWdJQ0FnSUgxY2JseHVJQ0FnSUNBZ2NtVjBkWEp1SUhSeWRXVmNiaUFnSUNCOVhHNWNiaUFnSUNCaGJtbHRZWFJsS0hOMFlYSjBRVzVwYldGMGFXOXVJRDBnZEhKMVpTa2dlMXh1SUNBZ0lDQWdhV1lnS0hOMFlYSjBRVzVwYldGMGFXOXVLU0I3WEc0Z0lDQWdJQ0FnSUhSb2FYTXVjMmh2ZHlncFhHNGdJQ0FnSUNCOUlHVnNjMlVnZTF4dUlDQWdJQ0FnSUNCMGFHbHpMbWhwWkdVb0tWeHVJQ0FnSUNBZ2ZWeHVYRzRnSUNBZ0lDQmpiMjV6ZENCc2IyRmtaWEpUY0dsdWJtVnlJRDBnZEdocGN5NW5aWFJUY0dsdWJtVnlLQ2xjYmx4dUlDQWdJQ0FnYVdZZ0tITjBZWEowUVc1cGJXRjBhVzl1SUNZbVhHNGdJQ0FnSUNBZ0lDRnNiMkZrWlhKVGNHbHVibVZ5TG1Oc1lYTnpUR2x6ZEM1amIyNTBZV2x1Y3lnbmJHOWhaR1Z5TFhOd2FXNXVaWEl0WVc1cGJXRjBaV1FuS1NrZ2UxeHVJQ0FnSUNBZ0lDQnNiMkZrWlhKVGNHbHVibVZ5TG1Oc1lYTnpUR2x6ZEM1aFpHUW9KMnh2WVdSbGNpMXpjR2x1Ym1WeUxXRnVhVzFoZEdWa0p5bGNiaUFnSUNBZ0lDQWdjbVYwZFhKdUlIUnlkV1ZjYmlBZ0lDQWdJSDFjYmx4dUlDQWdJQ0FnYVdZZ0tDRnpkR0Z5ZEVGdWFXMWhkR2x2YmlBbUpseHVJQ0FnSUNBZ0lDQnNiMkZrWlhKVGNHbHVibVZ5TG1Oc1lYTnpUR2x6ZEM1amIyNTBZV2x1Y3lnbmJHOWhaR1Z5TFhOd2FXNXVaWEl0WVc1cGJXRjBaV1FuS1NrZ2UxeHVJQ0FnSUNBZ0lDQnNiMkZrWlhKVGNHbHVibVZ5TG1Oc1lYTnpUR2x6ZEM1eVpXMXZkbVVvSjJ4dllXUmxjaTF6Y0dsdWJtVnlMV0Z1YVcxaGRHVmtKeWxjYmlBZ0lDQWdJSDFjYmx4dUlDQWdJQ0FnY21WMGRYSnVJSFJ5ZFdWY2JpQWdJQ0I5WEc1Y2JpQWdJQ0JvYVdSbEtDa2dlMXh1SUNBZ0lDQWdhV1lnS0NGMGFHbHpMbTl3ZEdsdmJuTXVaV3hsYldWdWRDNWpiR0Z6YzB4cGMzUXVZMjl1ZEdGcGJuTW9KMmhwWkdVbktTa2dlMXh1SUNBZ0lDQWdJQ0IwYUdsekxtOXdkR2x2Ym5NdVpXeGxiV1Z1ZEM1amJHRnpjMHhwYzNRdVlXUmtLQ2RvYVdSbEp5bGNiaUFnSUNBZ0lIMWNibHh1SUNBZ0lDQWdjbVYwZFhKdUlIUnlkV1ZjYmlBZ0lDQjlYRzVjYmlBZ0lDQnpkR0YwYVdNZ2FXUmxiblJwWm1sbGNpZ3BJSHRjYmlBZ0lDQWdJSEpsZEhWeWJpQk9RVTFGWEc0Z0lDQWdmVnh1WEc0Z0lDQWdjM1JoZEdsaklGOUVUMDFKYm5SbGNtWmhZMlVvYjNCMGFXOXVjeWtnZTF4dUlDQWdJQ0FnY21WMGRYSnVJSE4xY0dWeUxsOUVUMDFKYm5SbGNtWmhZMlVvVEc5aFpHVnlMQ0J2Y0hScGIyNXpLVnh1SUNBZ0lIMWNiaUFnZlZ4dVhHNGdJSEpsZEhWeWJpQk1iMkZrWlhKY2JuMHBLQ2xjYmx4dVpYaHdiM0owSUdSbFptRjFiSFFnVEc5aFpHVnlYRzRpTENJdktpcGNiaW9nTFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMxY2Jpb2dUR2xqWlc1elpXUWdkVzVrWlhJZ1RVbFVJQ2hvZEhSd2N6b3ZMMmRwZEdoMVlpNWpiMjB2Y1hWaGNtc3RaR1YyTDFCb2IyNXZiaTFHY21GdFpYZHZjbXN2WW14dllpOXRZWE4wWlhJdlRFbERSVTVUUlNsY2Jpb2dMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzFjYmlvdlhHNXBiWEJ2Y25RZ1JYWmxiblFnWm5KdmJTQW5MaTR2TGk0dlkyOXRiVzl1TDJWMlpXNTBjeWRjYm1sdGNHOXlkQ0JEYjIxd2IyNWxiblFnWm5KdmJTQW5MaTR2WTI5dGNHOXVaVzUwSjF4dVhHNWpiMjV6ZENCT2IzUnBabWxqWVhScGIyNGdQU0FvS0NrZ1BUNGdlMXh1SUNBdktpcGNiaUFnSUNvZ0xTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdFhHNGdJQ29nUTI5dWMzUmhiblJ6WEc0Z0lDb2dMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRYRzRnSUNvdlhHNWNiaUFnWTI5dWMzUWdUa0ZOUlNBOUlDZHViM1JwWm1sallYUnBiMjRuWEc0Z0lHTnZibk4wSUZaRlVsTkpUMDRnUFNBbk1pNHdMakFuWEc0Z0lHTnZibk4wSUVSRlJrRlZURlJmVUZKUFVFVlNWRWxGVXlBOUlIdGNiaUFnSUNCbGJHVnRaVzUwT2lCdWRXeHNMRnh1SUNBZ0lHMWxjM05oWjJVNklDY25MRnh1SUNBZ0lITm9iM2RDZFhSMGIyNDZJSFJ5ZFdVc1hHNGdJQ0FnZEdsdFpXOTFkRG9nYm5Wc2JDeGNiaUFnSUNCaVlXTnJaM0p2ZFc1a09pQW5jSEpwYldGeWVTY3NYRzRnSUgxY2JpQWdZMjl1YzNRZ1JFRlVRVjlCVkZSU1UxOVFVazlRUlZKVVNVVlRJRDBnVzF4dUlDQWdJQ2QwYVcxbGIzVjBKeXhjYmlBZ1hWeHVYRzRnSUM4cUtseHVJQ0FnS2lBdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMxY2JpQWdJQ29nUTJ4aGMzTWdSR1ZtYVc1cGRHbHZibHh1SUNBZ0tpQXRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMWNiaUFnSUNvdlhHNWNiaUFnWTJ4aGMzTWdUbTkwYVdacFkyRjBhVzl1SUdWNGRHVnVaSE1nUTI5dGNHOXVaVzUwSUh0Y2JseHVJQ0FnSUdOdmJuTjBjblZqZEc5eUtHOXdkR2x2Ym5NZ1BTQjdmU2tnZTF4dUlDQWdJQ0FnYzNWd1pYSW9Ua0ZOUlN3Z1ZrVlNVMGxQVGl3Z1JFVkdRVlZNVkY5UVVrOVFSVkpVU1VWVExDQnZjSFJwYjI1ekxDQkVRVlJCWDBGVVZGSlRYMUJTVDFCRlVsUkpSVk1zSUhSeWRXVXNJR1poYkhObEtWeHVYRzRnSUNBZ0lDQjBhR2x6TG5SbGJYQnNZWFJsSUQwZ0p5Y2dLMXh1SUNBZ0lDQWdKenhrYVhZZ1kyeGhjM005WENKdWIzUnBabWxqWVhScGIyNWNJajRuSUN0Y2JpQWdJQ0FnSUNBZ0p6eGthWFlnWTJ4aGMzTTlYQ0p1YjNScFptbGpZWFJwYjI0dGFXNXVaWEpjSWo0bklDdGNiaUFnSUNBZ0lDQWdJQ0FuUEdScGRpQmpiR0Z6Y3oxY0ltMWxjM05oWjJWY0lqNDhMMlJwZGo0bklDdGNiaUFnSUNBZ0lDQWdJQ0FuUEdKMWRIUnZiaUIwZVhCbFBWd2lZblYwZEc5dVhDSWdZMnhoYzNNOVhDSmpiRzl6WlZ3aUlHUmhkR0V0WkdsemJXbHpjejFjSW01dmRHbG1hV05oZEdsdmJsd2lJR0Z5YVdFdGJHRmlaV3c5WENKRGJHOXpaVndpUGljZ0sxeHVJQ0FnSUNBZ0lDQWdJQ0FnSnp4emNHRnVJR0Z5YVdFdGFHbGtaR1Z1UFZ3aWRISjFaVndpUGlaMGFXMWxjenM4TDNOd1lXNCtKeUFyWEc0Z0lDQWdJQ0FnSUNBZ0p6d3ZZblYwZEc5dVBpY2dLMXh1SUNBZ0lDQWdJQ0FuUEM5a2FYWStKeUFyWEc0Z0lDQWdJQ0FuUEM5a2FYWStKMXh1WEc0Z0lDQWdJQ0JwWmlBb2RHaHBjeTVrZVc1aGJXbGpSV3hsYldWdWRDa2dlMXh1SUNBZ0lDQWdJQ0IwYUdsekxtSjFhV3hrS0NsY2JpQWdJQ0FnSUgxY2JseHVJQ0FnSUNBZ2RHaHBjeTUwYVcxbGIzVjBRMkZzYkdKaFkyc2dQU0J1ZFd4c1hHNGdJQ0FnZlZ4dVhHNGdJQ0FnWW5WcGJHUW9LU0I3WEc0Z0lDQWdJQ0JqYjI1emRDQmlkV2xzWkdWeUlEMGdaRzlqZFcxbGJuUXVZM0psWVhSbFJXeGxiV1Z1ZENnblpHbDJKeWxjYmx4dUlDQWdJQ0FnWW5WcGJHUmxjaTVwYm01bGNraFVUVXdnUFNCMGFHbHpMblJsYlhCc1lYUmxYRzVjYmlBZ0lDQWdJSFJvYVhNdWIzQjBhVzl1Y3k1bGJHVnRaVzUwSUQwZ1luVnBiR1JsY2k1bWFYSnpkRU5vYVd4a1hHNWNiaUFnSUNBZ0lDOHZJSFJsZUhRZ2JXVnpjMkZuWlZ4dUlDQWdJQ0FnZEdocGN5NXZjSFJwYjI1ekxtVnNaVzFsYm5RdWNYVmxjbmxUWld4bFkzUnZjaWduTG0xbGMzTmhaMlVuS1M1cGJtNWxja2hVVFV3Z1BTQjBhR2x6TG05d2RHbHZibk11YldWemMyRm5aVnh1WEc0Z0lDQWdJQ0JwWmlBb0lYUm9hWE11YjNCMGFXOXVjeTV6YUc5M1FuVjBkRzl1S1NCN1hHNGdJQ0FnSUNBZ0lIUm9hWE11YjNCMGFXOXVjeTVsYkdWdFpXNTBMbkYxWlhKNVUyVnNaV04wYjNJb0oySjFkSFJ2YmljcExuTjBlV3hsTG1ScGMzQnNZWGtnUFNBbmJtOXVaU2RjYmlBZ0lDQWdJSDFjYmx4dUlDQWdJQ0FnWkc5amRXMWxiblF1WW05a2VTNWhjSEJsYm1SRGFHbHNaQ2gwYUdsekxtOXdkR2x2Ym5NdVpXeGxiV1Z1ZENsY2JseHVJQ0FnSUNBZ2RHaHBjeTV6WlhSQmRIUnlhV0oxZEdWektDbGNiaUFnSUNCOVhHNWNiaUFnSUNCemFHOTNLQ2tnZTF4dUlDQWdJQ0FnYVdZZ0tIUm9hWE11YjNCMGFXOXVjeTVsYkdWdFpXNTBJRDA5UFNCdWRXeHNLU0I3WEc0Z0lDQWdJQ0FnSUM4dklHSjFhV3hrSUdGdVpDQnBibk5sY25RZ1lTQnVaWGNnUkU5TklHVnNaVzFsYm5SY2JpQWdJQ0FnSUNBZ2RHaHBjeTVpZFdsc1pDZ3BYRzRnSUNBZ0lDQjlYRzVjYmlBZ0lDQWdJR2xtSUNoMGFHbHpMbTl3ZEdsdmJuTXVaV3hsYldWdWRDNWpiR0Z6YzB4cGMzUXVZMjl1ZEdGcGJuTW9KM05vYjNjbktTa2dlMXh1SUNBZ0lDQWdJQ0J5WlhSMWNtNGdabUZzYzJWY2JpQWdJQ0FnSUgxY2JseHVJQ0FnSUNBZ0x5OGdjbVZ6WlhRZ1kyOXNiM0pjYmlBZ0lDQWdJR2xtSUNoMGFHbHpMbTl3ZEdsdmJuTXVZbUZqYTJkeWIzVnVaQ2tnZTF4dUlDQWdJQ0FnSUNCMGFHbHpMbTl3ZEdsdmJuTXVaV3hsYldWdWRDNXlaVzF2ZG1WQmRIUnlhV0oxZEdVb0oyTnNZWE56SnlsY2JpQWdJQ0FnSUNBZ2RHaHBjeTV2Y0hScGIyNXpMbVZzWlcxbGJuUXVjMlYwUVhSMGNtbGlkWFJsS0NkamJHRnpjeWNzSUNkdWIzUnBabWxqWVhScGIyNG5LVnh1WEc0Z0lDQWdJQ0FnSUhSb2FYTXViM0IwYVc5dWN5NWxiR1Z0Wlc1MExtTnNZWE56VEdsemRDNWhaR1FvWUdKbkxTUjdkR2hwY3k1dmNIUnBiMjV6TG1KaFkydG5jbTkxYm1SOVlDbGNiaUFnSUNBZ0lDQWdkR2hwY3k1dmNIUnBiMjV6TG1Wc1pXMWxiblF1Y1hWbGNubFRaV3hsWTNSdmNpZ25ZblYwZEc5dUp5a3VZMnhoYzNOTWFYTjBMbUZrWkNoZ1luUnVMU1I3ZEdocGN5NXZjSFJwYjI1ekxtSmhZMnRuY205MWJtUjlZQ2xjYmlBZ0lDQWdJSDFjYmx4dUlDQWdJQ0FnYVdZZ0tIUm9hWE11YjNCMGFXOXVjeTV6YUc5M1FuVjBkRzl1S1NCN1hHNGdJQ0FnSUNBZ0lDOHZJR0YwZEdGamFDQjBhR1VnWW5WMGRHOXVJR2hoYm1Sc1pYSmNiaUFnSUNBZ0lDQWdZMjl1YzNRZ1luVjBkRzl1Uld4bGJXVnVkQ0E5SUhSb2FYTXViM0IwYVc5dWN5NWxiR1Z0Wlc1MExuRjFaWEo1VTJWc1pXTjBiM0lvSjJKMWRIUnZiaWNwWEc0Z0lDQWdJQ0FnSUhSb2FYTXVjbVZuYVhOMFpYSkZiR1Z0Wlc1MEtIc2dkR0Z5WjJWME9pQmlkWFIwYjI1RmJHVnRaVzUwTENCbGRtVnVkRG9nSjJOc2FXTnJKeUI5S1Z4dUlDQWdJQ0FnZlZ4dVhHNGdJQ0FnSUNCelpYUlVhVzFsYjNWMEtDZ3BJRDArSUh0Y2JpQWdJQ0FnSUNBZ2RHaHBjeTV2Y0hScGIyNXpMbVZzWlcxbGJuUXVZMnhoYzNOTWFYTjBMbUZrWkNnbmMyaHZkeWNwWEc1Y2JpQWdJQ0FnSUNBZ0x5OGdjMlYwSUhCdmMybDBhVzl1WEc0Z0lDQWdJQ0FnSUdOdmJuTjBJR0ZqZEdsMlpVNXZkR2xtYVdOaGRHbHZibk1nUFNCa2IyTjFiV1Z1ZEM1eGRXVnllVk5sYkdWamRHOXlRV3hzS0NjdWJtOTBhV1pwWTJGMGFXOXVMbk5vYjNjbktTQjhmQ0JiWFZ4dUlDQWdJQ0FnSUNCc1pYUWdjSFZ6YUVScGMzUmhibU5sSUQwZ01GeHVJQ0FnSUNBZ0lDQmhZM1JwZG1WT2IzUnBabWxqWVhScGIyNXpMbVp2Y2tWaFkyZ29LRzV2ZEdsbWFXTmhkR2x2YmlrZ1BUNGdlMXh1SUNBZ0lDQWdJQ0FnSUdsbUlDaDBhR2x6TG05d2RHbHZibk11Wld4bGJXVnVkQ0FoUFQwZ2JtOTBhV1pwWTJGMGFXOXVLU0I3WEc0Z0lDQWdJQ0FnSUNBZ0lDQmpiMjV6ZENCemRIbHNaU0E5SUdkbGRFTnZiWEIxZEdWa1UzUjViR1VvYm05MGFXWnBZMkYwYVc5dUtWeHVJQ0FnSUNBZ0lDQWdJQ0FnY0hWemFFUnBjM1JoYm1ObElDczlJRzV2ZEdsbWFXTmhkR2x2Ymk1dlptWnpaWFJJWldsbmFIUWdLeUJ3WVhKelpVbHVkQ2h6ZEhsc1pTNXRZWEpuYVc1Q2IzUjBiMjBzSURFd0tWeHVJQ0FnSUNBZ0lDQWdJSDFjYmlBZ0lDQWdJQ0FnZlNsY2JseHVJQ0FnSUNBZ0lDQjBhR2x6TG05d2RHbHZibk11Wld4bGJXVnVkQzV6ZEhsc1pTNTBjbUZ1YzJadmNtMGdQU0JnZEhKaGJuTnNZWFJsV1Nna2UzQjFjMmhFYVhOMFlXNWpaWDF3ZUNsZ1hHNWNiaUFnSUNBZ0lDQWdkR2hwY3k1MGNtbG5aMlZ5UlhabGJuUW9SWFpsYm5RdVUwaFBWeWxjYmx4dUlDQWdJQ0FnSUNCamIyNXpkQ0J2YmxOb2IzZHVJRDBnS0NrZ1BUNGdlMXh1SUNBZ0lDQWdJQ0FnSUhSb2FYTXVkSEpwWjJkbGNrVjJaVzUwS0VWMlpXNTBMbE5JVDFkT0tWeHVJQ0FnSUNBZ0lDQWdJSFJvYVhNdWIzQjBhVzl1Y3k1bGJHVnRaVzUwTG5KbGJXOTJaVVYyWlc1MFRHbHpkR1Z1WlhJb1JYWmxiblF1VkZKQlRsTkpWRWxQVGw5RlRrUXNJRzl1VTJodmQyNHBYRzRnSUNBZ0lDQWdJSDFjYmx4dUlDQWdJQ0FnSUNCMGFHbHpMbTl3ZEdsdmJuTXVaV3hsYldWdWRDNWhaR1JGZG1WdWRFeHBjM1JsYm1WeUtFVjJaVzUwTGxSU1FVNVRTVlJKVDA1ZlJVNUVMQ0J2YmxOb2IzZHVLVnh1WEc0Z0lDQWdJQ0I5TENBeEtWeHVYRzRnSUNBZ0lDQnBaaUFvVG5WdFltVnlMbWx6U1c1MFpXZGxjaWgwYUdsekxtOXdkR2x2Ym5NdWRHbHRaVzkxZENrZ0ppWWdkR2hwY3k1dmNIUnBiMjV6TG5ScGJXVnZkWFFnUGlBd0tTQjdYRzRnSUNBZ0lDQWdJQzh2SUdsbUlIUm9aWEpsSUdseklHRWdkR2x0Wlc5MWRDd2dZWFYwYnlCb2FXUmxJSFJvWlNCdWIzUnBabWxqWVhScGIyNWNiaUFnSUNBZ0lDQWdkR2hwY3k1MGFXMWxiM1YwUTJGc2JHSmhZMnNnUFNCelpYUlVhVzFsYjNWMEtDZ3BJRDArSUh0Y2JpQWdJQ0FnSUNBZ0lDQjBhR2x6TG1ocFpHVW9LVnh1SUNBZ0lDQWdJQ0I5TENCMGFHbHpMbTl3ZEdsdmJuTXVkR2x0Wlc5MWRDQXJJREVwWEc0Z0lDQWdJQ0I5WEc1Y2JpQWdJQ0FnSUhKbGRIVnliaUIwY25WbFhHNGdJQ0FnZlZ4dVhHNGdJQ0FnYUdsa1pTZ3BJSHRjYmlBZ0lDQWdJQzhxWEc0Z0lDQWdJQ0FnS2lCd2NtVjJaVzUwSUhSdklHTnNiM05sSUdFZ2JtOTBhV1pwWTJGMGFXOXVJSGRwZEdnZ1lTQjBhVzFsYjNWMFhHNGdJQ0FnSUNBZ0tpQnBaaUIwYUdVZ2RYTmxjaUJvWVhNZ1lXeHlaV0ZrZVNCamJHbGphMlZrSUc5dUlIUm9aU0JpZFhSMGIyNWNiaUFnSUNBZ0lDQXFMMXh1SUNBZ0lDQWdhV1lnS0hSb2FYTXVkR2x0Wlc5MWRFTmhiR3hpWVdOcktTQjdYRzRnSUNBZ0lDQWdJR05zWldGeVZHbHRaVzkxZENoMGFHbHpMblJwYldWdmRYUkRZV3hzWW1GamF5bGNiaUFnSUNBZ0lDQWdkR2hwY3k1MGFXMWxiM1YwUTJGc2JHSmhZMnNnUFNCdWRXeHNYRzRnSUNBZ0lDQjlYRzVjYmlBZ0lDQWdJR2xtSUNnaGRHaHBjeTV2Y0hScGIyNXpMbVZzWlcxbGJuUXVZMnhoYzNOTWFYTjBMbU52Ym5SaGFXNXpLQ2R6YUc5M0p5a3BJSHRjYmlBZ0lDQWdJQ0FnY21WMGRYSnVJR1poYkhObFhHNGdJQ0FnSUNCOVhHNWNiaUFnSUNBZ0lIUm9hWE11ZEhKcFoyZGxja1YyWlc1MEtFVjJaVzUwTGtoSlJFVXBYRzVjYmlBZ0lDQWdJR2xtSUNoMGFHbHpMbTl3ZEdsdmJuTXVjMmh2ZDBKMWRIUnZiaWtnZTF4dUlDQWdJQ0FnSUNCamIyNXpkQ0JpZFhSMGIyNUZiR1Z0Wlc1MElEMGdkR2hwY3k1dmNIUnBiMjV6TG1Wc1pXMWxiblF1Y1hWbGNubFRaV3hsWTNSdmNpZ25ZblYwZEc5dUp5bGNiaUFnSUNBZ0lDQWdkR2hwY3k1MWJuSmxaMmx6ZEdWeVJXeGxiV1Z1ZENoN0lIUmhjbWRsZERvZ1luVjBkRzl1Uld4bGJXVnVkQ3dnWlhabGJuUTZJQ2RqYkdsamF5Y2dmU2xjYmlBZ0lDQWdJSDFjYmx4dUlDQWdJQ0FnZEdocGN5NXZjSFJwYjI1ekxtVnNaVzFsYm5RdVkyeGhjM05NYVhOMExuSmxiVzkyWlNnbmMyaHZkeWNwWEc0Z0lDQWdJQ0IwYUdsekxtOXdkR2x2Ym5NdVpXeGxiV1Z1ZEM1amJHRnpjMHhwYzNRdVlXUmtLQ2RvYVdSbEp5bGNibHh1SUNBZ0lDQWdZMjl1YzNRZ2IyNUlhV1JrWlc0Z1BTQW9LU0E5UGlCN1hHNGdJQ0FnSUNBZ0lIUm9hWE11YjNCMGFXOXVjeTVsYkdWdFpXNTBMbkpsYlc5MlpVVjJaVzUwVEdsemRHVnVaWElvUlhabGJuUXVWRkpCVGxOSlZFbFBUbDlGVGtRc0lHOXVTR2xrWkdWdUtWeHVJQ0FnSUNBZ0lDQjBhR2x6TG05d2RHbHZibk11Wld4bGJXVnVkQzVqYkdGemMweHBjM1F1Y21WdGIzWmxLQ2RvYVdSbEp5bGNibHh1SUNBZ0lDQWdJQ0IwYUdsekxuUnlhV2RuWlhKRmRtVnVkQ2hGZG1WdWRDNUlTVVJFUlU0cFhHNWNiaUFnSUNBZ0lDQWdhV1lnS0hSb2FYTXVaSGx1WVcxcFkwVnNaVzFsYm5RcElIdGNiaUFnSUNBZ0lDQWdJQ0JrYjJOMWJXVnVkQzVpYjJSNUxuSmxiVzkyWlVOb2FXeGtLSFJvYVhNdWIzQjBhVzl1Y3k1bGJHVnRaVzUwS1Z4dUlDQWdJQ0FnSUNBZ0lIUm9hWE11YjNCMGFXOXVjeTVsYkdWdFpXNTBJRDBnYm5Wc2JGeHVJQ0FnSUNBZ0lDQjlYRzRnSUNBZ0lDQjlYRzVjYmlBZ0lDQWdJSFJvYVhNdWIzQjBhVzl1Y3k1bGJHVnRaVzUwTG1Ga1pFVjJaVzUwVEdsemRHVnVaWElvUlhabGJuUXVWRkpCVGxOSlZFbFBUbDlGVGtRc0lHOXVTR2xrWkdWdUtWeHVYRzRnSUNBZ0lDQnlaWFIxY200Z2RISjFaVnh1SUNBZ0lIMWNibHh1SUNBZ0lHOXVSV3hsYldWdWRFVjJaVzUwS0NrZ2UxeHVJQ0FnSUNBZ2RHaHBjeTVvYVdSbEtDbGNiaUFnSUNCOVhHNWNiaUFnSUNCemRHRjBhV01nYVdSbGJuUnBabWxsY2lncElIdGNiaUFnSUNBZ0lISmxkSFZ5YmlCT1FVMUZYRzRnSUNBZ2ZWeHVYRzRnSUNBZ2MzUmhkR2xqSUY5RVQwMUpiblJsY21aaFkyVW9iM0IwYVc5dWN5a2dlMXh1SUNBZ0lDQWdjbVYwZFhKdUlITjFjR1Z5TGw5RVQwMUpiblJsY21aaFkyVW9UbTkwYVdacFkyRjBhVzl1TENCdmNIUnBiMjV6S1Z4dUlDQWdJSDFjYmlBZ2ZWeHVYRzRnSUhKbGRIVnliaUJPYjNScFptbGpZWFJwYjI1Y2JuMHBLQ2xjYmx4dVpYaHdiM0owSUdSbFptRjFiSFFnVG05MGFXWnBZMkYwYVc5dVhHNGlMQ0l2S2lwY2JpQXFJQzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0WEc0Z0tpQk1hV05sYm5ObFpDQjFibVJsY2lCTlNWUWdLR2gwZEhCek9pOHZaMmwwYUhWaUxtTnZiUzl4ZFdGeWF5MWtaWFl2VUdodmJtOXVMVVp5WVcxbGQyOXlheTlpYkc5aUwyMWhjM1JsY2k5TVNVTkZUbE5GS1Z4dUlDb2dMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzFjYmlBcUwxeHVhVzF3YjNKMElFVjJaVzUwSUdaeWIyMGdKeTR1THk0dUwyTnZiVzF2Ymk5bGRtVnVkSE1uWEc1cGJYQnZjblFnUTI5dGNHOXVaVzUwSUdaeWIyMGdKeTR1TDJOdmJYQnZibVZ1ZENkY2JtbHRjRzl5ZENCN0lHZGxkRUYwZEhKcFluVjBaWE5EYjI1bWFXY2dmU0JtY205dElDY3VMaTlqYjIxd2IyNWxiblJOWVc1aFoyVnlKMXh1YVcxd2IzSjBJSHNnWm1sdVpGUmhjbWRsZEVKNVFYUjBjaUI5SUdaeWIyMGdKeTR1THk0dUwyTnZiVzF2Ymk5MWRHbHNjeWRjYmx4dVkyOXVjM1FnVDJabVEyRnVkbUZ6SUQwZ0tDZ3BJRDArSUh0Y2JpQWdMeW9xWEc0Z0lDQXFJQzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMVnh1SUNBZ0tpQkRiMjV6ZEdGdWRITmNiaUFnSUNvZ0xTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdFhHNGdJQ0FxTDF4dVhHNGdJR052Ym5OMElFNUJUVVVnUFNBbmIyWm1MV05oYm5aaGN5ZGNiaUFnWTI5dWMzUWdWa1ZTVTBsUFRpQTlJQ2N5TGpBdU1DZGNiaUFnWTI5dWMzUWdRa0ZEUzBSU1QxQmZVMFZNUlVOVVQxSWdQU0FuYjJabUxXTmhiblpoY3kxaVlXTnJaSEp2Y0NkY2JpQWdZMjl1YzNRZ1JFVkdRVlZNVkY5UVVrOVFSVkpVU1VWVElEMGdlMXh1SUNBZ0lHVnNaVzFsYm5RNklHNTFiR3dzWEc0Z0lDQWdZWE5wWkdVNklIdGNiaUFnSUNBZ0lHMWtPaUJtWVd4elpTeGNiaUFnSUNBZ0lHeG5PaUJtWVd4elpTeGNiaUFnSUNBZ0lIaHNPaUJtWVd4elpTeGNiaUFnSUNCOUxGeHVJQ0I5WEc0Z0lHTnZibk4wSUVSQlZFRmZRVlJVVWxOZlVGSlBVRVZTVkVsRlV5QTlJRnRjYmlBZ0lDQW5ZWE5wWkdVbkxGeHVJQ0JkWEc1Y2JpQWdMeW9xWEc0Z0lDQXFJQzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMVnh1SUNBZ0tpQkRiR0Z6Y3lCRVpXWnBibWwwYVc5dVhHNGdJQ0FxSUMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFZ4dUlDQWdLaTljYmx4dUlDQmpiR0Z6Y3lCUFptWkRZVzUyWVhNZ1pYaDBaVzVrY3lCRGIyMXdiMjVsYm5RZ2UxeHVYRzRnSUNBZ1kyOXVjM1J5ZFdOMGIzSW9iM0IwYVc5dWN5QTlJSHQ5S1NCN1hHNGdJQ0FnSUNCemRYQmxjaWhPUVUxRkxDQldSVkpUU1U5T0xDQkVSVVpCVlV4VVgxQlNUMUJGVWxSSlJWTXNJRzl3ZEdsdmJuTXNJRVJCVkVGZlFWUlVVbE5mVUZKUFVFVlNWRWxGVXl3Z1ptRnNjMlVzSUhSeWRXVXBYRzVjYmlBZ0lDQWdJSFJvYVhNdWRYTmxRbUZqYTJSeWIzQWdQU0IwY25WbFhHNGdJQ0FnSUNCMGFHbHpMbU4xY25KbGJuUlhhV1IwYUNBOUlHNTFiR3hjYmlBZ0lDQWdJSFJvYVhNdVlXNXBiV0YwWlNBOUlIUnlkV1ZjYmx4dUlDQWdJQ0FnZEdocGN5NWthWEpsWTNScGIyNXpJRDBnV3lkc1pXWjBKeXdnSjNKcFoyaDBKMTFjYmx4dUlDQWdJQ0FnWTI5dWMzUWdjMjBnUFNCN0lHNWhiV1U2SUNkemJTY3NJRzFsWkdsaE9pQjNhVzVrYjNjdWJXRjBZMmhOWldScFlTZ25LRzFwYmkxM2FXUjBhRG9nTVhCNEtTY3BJSDFjYmlBZ0lDQWdJR052Ym5OMElHMWtJRDBnZXlCdVlXMWxPaUFuYldRbkxDQnRaV1JwWVRvZ2QybHVaRzkzTG0xaGRHTm9UV1ZrYVdFb0p5aHRhVzR0ZDJsa2RHZzZJRGMyT0hCNEtTY3BJSDFjYmlBZ0lDQWdJR052Ym5OMElHeG5JRDBnZXlCdVlXMWxPaUFuYkdjbkxDQnRaV1JwWVRvZ2QybHVaRzkzTG0xaGRHTm9UV1ZrYVdFb0p5aHRhVzR0ZDJsa2RHZzZJRGs1TW5CNEtTY3BJSDFjYmlBZ0lDQWdJR052Ym5OMElIaHNJRDBnZXlCdVlXMWxPaUFuZUd3bkxDQnRaV1JwWVRvZ2QybHVaRzkzTG0xaGRHTm9UV1ZrYVdFb0p5aHRhVzR0ZDJsa2RHZzZJREV5TURCd2VDa25LU0I5WEc1Y2JpQWdJQ0FnSUhSb2FYTXVjMmw2WlhNZ1BTQmJjMjBzSUcxa0xDQnNaeXdnZUd4ZExuSmxkbVZ5YzJVb0tWeHVYRzRnSUNBZ0lDQjBhR2x6TG1Ob1pXTnJSR2x5WldOMGFXOXVLQ2xjYmlBZ0lDQWdJSFJvYVhNdVkyaGxZMnRYYVdSMGFDZ3BYRzVjYmlBZ0lDQWdJSGRwYm1SdmR5NWhaR1JGZG1WdWRFeHBjM1JsYm1WeUtDZHlaWE5wZW1VbkxDQW9LU0E5UGlCMGFHbHpMbU5vWldOclYybGtkR2dvS1N3Z1ptRnNjMlVwSUNBZ0lDQWdYRzRnSUNBZ2ZWeHVYRzRnSUNBZ1kyaGxZMnRFYVhKbFkzUnBiMjRvS1NCN1hHNGdJQ0FnSUNCMGFHbHpMbVJwY21WamRHbHZibk11WlhabGNua29LR1JwY21WamRHbHZiaWtnUFQ0Z2UxeHVJQ0FnSUNBZ0lDQnBaaUFvZEdocGN5NXZjSFJwYjI1ekxtVnNaVzFsYm5RdVkyeGhjM05NYVhOMExtTnZiblJoYVc1ektHQnZabVl0WTJGdWRtRnpMU1I3WkdseVpXTjBhVzl1ZldBcEtTQjdYRzRnSUNBZ0lDQWdJQ0FnZEdocGN5NWthWEpsWTNScGIyNGdQU0JrYVhKbFkzUnBiMjVjYmlBZ0lDQWdJQ0FnSUNCeVpYUjFjbTRnWm1Gc2MyVmNiaUFnSUNBZ0lDQWdmVnh1SUNBZ0lDQWdJQ0J5WlhSMWNtNGdkSEoxWlZ4dUlDQWdJQ0FnZlNsY2JpQWdJQ0I5WEc1Y2JpQWdJQ0JqYUdWamExZHBaSFJvS0NrZ2UxeHVJQ0FnSUNBZ2FXWWdLQ0VvSjIxaGRHTm9UV1ZrYVdFbklHbHVJSGRwYm1SdmR5a3BJSHRjYmlBZ0lDQWdJQ0FnY21WMGRYSnVYRzRnSUNBZ0lDQjlYRzVjYmlBZ0lDQWdJSFJvYVhNdWMybDZaWE11WlhabGNua29LSE5wZW1VcElEMCtJSHRjYmlBZ0lDQWdJQ0FnWTI5dWMzUWdiV0YwWTJnZ1BTQnphWHBsTG0xbFpHbGhMbTFsWkdsaExtMWhkR05vS0M5YllTMTZYVDh0ZDJsa2RHZzZYRnh6UHloYk1DMDVYU3NwTHlsY2JseHVJQ0FnSUNBZ0lDQnBaaUFvYldGMFkyZ3BJSHRjYmlBZ0lDQWdJQ0FnSUNCcFppQW9jMmw2WlM1dFpXUnBZUzV0WVhSamFHVnpLU0I3WEc0Z0lDQWdJQ0FnSUNBZ0lDQnBaaUFvZEdocGN5NWpkWEp5Wlc1MFYybGtkR2dnSVQwOUlITnBlbVV1Ym1GdFpTa2dlMXh1SUNBZ0lDQWdJQ0FnSUNBZ0lDQjBhR2x6TG5ObGRFRnphV1JsS0hOcGVtVXVibUZ0WlNsY2JpQWdJQ0FnSUNBZ0lDQWdJSDFjYmlBZ0lDQWdJQ0FnSUNBZ0lIUm9hWE11WTNWeWNtVnVkRmRwWkhSb0lEMGdjMmw2WlM1dVlXMWxYRzRnSUNBZ0lDQWdJQ0FnSUNCeVpYUjFjbTRnWm1Gc2MyVmNiaUFnSUNBZ0lDQWdJQ0I5WEc0Z0lDQWdJQ0FnSUgxY2JseHVJQ0FnSUNBZ0lDQnlaWFIxY200Z2RISjFaVnh1SUNBZ0lDQWdmU2xjYmlBZ0lDQjlYRzVjYmlBZ0lDQndjbVYyWlc1MFEyeHZjMkZpYkdVb0tTQjdYRzRnSUNBZ0lDQnlaWFIxY200Z2MzVndaWEl1Y0hKbGRtVnVkRU5zYjNOaFlteGxLQ2tnZkh3Z2RHaHBjeTV2Y0hScGIyNXpMbUZ6YVdSbFczUm9hWE11WTNWeWNtVnVkRmRwWkhSb1hTQTlQVDBnZEhKMVpWeHVJQ0FnSUgxY2JseHVJQ0FnSUhObGRFRnphV1JsS0c1aGJXVXBJSHRjYmlBZ0lDQWdJR052Ym5OMElHTnZiblJsYm5RZ1BTQmtiMk4xYldWdWRDNWliMlI1WEc1Y2JpQWdJQ0FnSUdsbUlDaDBhR2x6TG05d2RHbHZibk11WVhOcFpHVmJibUZ0WlYwZ1BUMDlJSFJ5ZFdVcElIdGNiaUFnSUNBZ0lDQWdhV1lnS0NGamIyNTBaVzUwTG1Oc1lYTnpUR2x6ZEM1amIyNTBZV2x1Y3loZ2IyWm1MV05oYm5aaGN5MWhjMmxrWlMwa2UzUm9hWE11WkdseVpXTjBhVzl1ZldBcEtTQjdYRzRnSUNBZ0lDQWdJQ0FnWTI5dWRHVnVkQzVqYkdGemMweHBjM1F1WVdSa0tHQnZabVl0WTJGdWRtRnpMV0Z6YVdSbExTUjdkR2hwY3k1a2FYSmxZM1JwYjI1OVlDbGNiaUFnSUNBZ0lDQWdmVnh1WEc0Z0lDQWdJQ0FnSUhSb2FYTXVkWE5sUW1GamEyUnliM0FnUFNCbVlXeHpaVnh1WEc0Z0lDQWdJQ0FnSUM4dklHRjJiMmxrSUdGdWFXMWhkR2x2YmlCaWVTQnpaWFIwYVc1bklHRnVhVzFoZEdVZ2RHOGdabUZzYzJWY2JpQWdJQ0FnSUNBZ2RHaHBjeTVoYm1sdFlYUmxJRDBnWm1Gc2MyVmNiaUFnSUNBZ0lDQWdkR2hwY3k1emFHOTNLQ2xjYmlBZ0lDQWdJQ0FnTHk4Z2NtVnRiM1psSUhCeVpYWnBiM1Z6SUdKaFkydGtjbTl3WEc0Z0lDQWdJQ0FnSUhSb2FYTXVjbVZ0YjNabFFtRmphMlJ5YjNBb0tWeHVJQ0FnSUNBZ2ZTQmxiSE5sSUh0Y2JpQWdJQ0FnSUNBZ2FXWWdLR052Ym5SbGJuUXVZMnhoYzNOTWFYTjBMbU52Ym5SaGFXNXpLR0J2Wm1ZdFkyRnVkbUZ6TFdGemFXUmxMU1I3ZEdocGN5NWthWEpsWTNScGIyNTlZQ2twSUh0Y2JpQWdJQ0FnSUNBZ0lDQmpiMjUwWlc1MExtTnNZWE56VEdsemRDNXlaVzF2ZG1Vb1lHOW1aaTFqWVc1MllYTXRZWE5wWkdVdEpIdDBhR2x6TG1ScGNtVmpkR2x2Ym4xZ0tWeHVJQ0FnSUNBZ0lDQjlYRzVjYmlBZ0lDQWdJQ0FnZEdocGN5NW9hV1JsS0NsY2JpQWdJQ0FnSUNBZ2RHaHBjeTUxYzJWQ1lXTnJaSEp2Y0NBOUlIUnlkV1ZjYmlBZ0lDQWdJQ0FnZEdocGN5NWhibWx0WVhSbElEMGdkSEoxWlZ4dUlDQWdJQ0FnZlZ4dUlDQWdJSDFjYmx4dUlDQWdJRzl1Uld4bGJXVnVkRVYyWlc1MEtHVjJaVzUwS1NCN1hHNGdJQ0FnSUNCcFppQW9aWFpsYm5RdWRIbHdaU0E5UFQwZ0oydGxlWFZ3SnlBbUppQmxkbVZ1ZEM1clpYbERiMlJsSUNFOVBTQXlOeUFtSmlCbGRtVnVkQzVyWlhsRGIyUmxJQ0U5UFNBeE15a2dlMXh1SUNBZ0lDQWdJQ0J5WlhSMWNtNWNiaUFnSUNBZ0lIMWNibHh1SUNBZ0lDQWdMeThnYUdsa1pTQjBhR1VnYjJabUxXTmhiblpoYzF4dUlDQWdJQ0FnZEdocGN5NW9hV1JsS0NsY2JpQWdJQ0I5WEc1Y2JpQWdJQ0J6YUc5M0tDa2dlMXh1SUNBZ0lDQWdhV1lnS0hSb2FYTXViM0IwYVc5dWN5NWxiR1Z0Wlc1MExtTnNZWE56VEdsemRDNWpiMjUwWVdsdWN5Z25jMmh2ZHljcEtTQjdYRzRnSUNBZ0lDQWdJSEpsZEhWeWJpQm1ZV3h6WlZ4dUlDQWdJQ0FnZlZ4dVhHNGdJQ0FnSUNBdkx5QmhaR1FnWVNCMGFXMWxiM1YwSUhOdklIUm9ZWFFnZEdobElFTlRVeUJoYm1sdFlYUnBiMjRnZDI5eWEzTmNiaUFnSUNBZ0lITmxkRlJwYldWdmRYUW9LQ2tnUFQ0Z2UxeHVJQ0FnSUNBZ0lDQjBhR2x6TG5SeWFXZG5aWEpGZG1WdWRDaEZkbVZ1ZEM1VFNFOVhLVnh1WEc0Z0lDQWdJQ0FnSUdOdmJuTjBJRzl1VTJodmQyNGdQU0FvS1NBOVBpQjdYRzRnSUNBZ0lDQWdJQ0FnZEdocGN5NTBjbWxuWjJWeVJYWmxiblFvUlhabGJuUXVVMGhQVjA0cFhHNWNiaUFnSUNBZ0lDQWdJQ0JwWmlBb2RHaHBjeTVoYm1sdFlYUmxLU0I3WEc0Z0lDQWdJQ0FnSUNBZ0lDQjBhR2x6TG05d2RHbHZibk11Wld4bGJXVnVkQzV5WlcxdmRtVkZkbVZ1ZEV4cGMzUmxibVZ5S0VWMlpXNTBMbFJTUVU1VFNWUkpUMDVmUlU1RUxDQnZibE5vYjNkdUtWeHVJQ0FnSUNBZ0lDQWdJQ0FnZEdocGN5NXZjSFJwYjI1ekxtVnNaVzFsYm5RdVkyeGhjM05NYVhOMExuSmxiVzkyWlNnbllXNXBiV0YwWlNjcFhHNGdJQ0FnSUNBZ0lDQWdmVnh1SUNBZ0lDQWdJQ0I5WEc1Y2JpQWdJQ0FnSUNBZ2FXWWdLSFJvYVhNdWRYTmxRbUZqYTJSeWIzQXBJSHRjYmlBZ0lDQWdJQ0FnSUNCMGFHbHpMbU55WldGMFpVSmhZMnRrY205d0tDbGNiaUFnSUNBZ0lDQWdmVnh1WEc1Y2JpQWdJQ0FnSUNBZ2FXWWdLSFJvYVhNdVlXNXBiV0YwWlNrZ2UxeHVJQ0FnSUNBZ0lDQWdJSFJvYVhNdWIzQjBhVzl1Y3k1bGJHVnRaVzUwTG1Ga1pFVjJaVzUwVEdsemRHVnVaWElvUlhabGJuUXVWRkpCVGxOSlZFbFBUbDlGVGtRc0lHOXVVMmh2ZDI0cElDQWdJQ0FnSUNCY2JpQWdJQ0FnSUNBZ0lDQjBhR2x6TG05d2RHbHZibk11Wld4bGJXVnVkQzVqYkdGemMweHBjM1F1WVdSa0tDZGhibWx0WVhSbEp5bGNiaUFnSUNBZ0lDQWdmU0JsYkhObElIdGNiaUFnSUNBZ0lDQWdJQ0F2THlCa2FYSmxZM1JzZVNCMGNtbG5aMlZ5SUhSb1pTQnZibE5vYjNkdVhHNGdJQ0FnSUNBZ0lDQWdiMjVUYUc5M2JpZ3BYRzRnSUNBZ0lDQWdJSDFjYmx4dUlDQWdJQ0FnSUNCMGFHbHpMbTl3ZEdsdmJuTXVaV3hsYldWdWRDNWpiR0Z6YzB4cGMzUXVZV1JrS0NkemFHOTNKeWtnSUNBZ0lDQWdJRnh1WEc0Z0lDQWdJQ0FnSUM4dklHRjBkR0ZqYUNCbGRtVnVkRnh1SUNBZ0lDQWdJQ0IwYUdsekxtRjBkR0ZqYUVWMlpXNTBjeWdwWEc0Z0lDQWdJQ0I5TENBeEtWeHVYRzRnSUNBZ0lDQnlaWFIxY200Z2RISjFaVnh1SUNBZ0lIMWNibHh1SUNBZ0lHaHBaR1VvS1NCN1hHNGdJQ0FnSUNCcFppQW9JWFJvYVhNdWIzQjBhVzl1Y3k1bGJHVnRaVzUwTG1Oc1lYTnpUR2x6ZEM1amIyNTBZV2x1Y3lnbmMyaHZkeWNwS1NCN1hHNGdJQ0FnSUNBZ0lISmxkSFZ5YmlCbVlXeHpaVnh1SUNBZ0lDQWdmVnh1WEc0Z0lDQWdJQ0IwYUdsekxuUnlhV2RuWlhKRmRtVnVkQ2hGZG1WdWRDNUlTVVJGS1Z4dVhHNGdJQ0FnSUNCMGFHbHpMbVJsZEdGamFFVjJaVzUwY3lncFhHNWNiaUFnSUNBZ0lHbG1JQ2gwYUdsekxtRnVhVzFoZEdVcElIdGNiaUFnSUNBZ0lDQWdkR2hwY3k1dmNIUnBiMjV6TG1Wc1pXMWxiblF1WTJ4aGMzTk1hWE4wTG1Ga1pDZ25ZVzVwYldGMFpTY3BYRzRnSUNBZ0lDQjlYRzVjYmlBZ0lDQWdJSFJvYVhNdWIzQjBhVzl1Y3k1bGJHVnRaVzUwTG1Oc1lYTnpUR2x6ZEM1eVpXMXZkbVVvSjNOb2IzY25LVnh1WEc0Z0lDQWdJQ0JwWmlBb2RHaHBjeTUxYzJWQ1lXTnJaSEp2Y0NrZ2UxeHVJQ0FnSUNBZ0lDQmpiMjV6ZENCaVlXTnJaSEp2Y0NBOUlIUm9hWE11WjJWMFFtRmphMlJ5YjNBb0tWeHVYRzRnSUNBZ0lDQWdJR052Ym5OMElHOXVTR2xrWkdWdUlEMGdLQ2tnUFQ0Z2UxeHVJQ0FnSUNBZ0lDQWdJR2xtSUNoMGFHbHpMbUZ1YVcxaGRHVXBJSHRjYmlBZ0lDQWdJQ0FnSUNBZ0lIUm9hWE11YjNCMGFXOXVjeTVsYkdWdFpXNTBMbU5zWVhOelRHbHpkQzV5WlcxdmRtVW9KMkZ1YVcxaGRHVW5LVnh1SUNBZ0lDQWdJQ0FnSUgxY2JseHVJQ0FnSUNBZ0lDQWdJR0poWTJ0a2NtOXdMbkpsYlc5MlpVVjJaVzUwVEdsemRHVnVaWElvUlhabGJuUXVWRkpCVGxOSlZFbFBUbDlGVGtRc0lHOXVTR2xrWkdWdUtWeHVJQ0FnSUNBZ0lDQWdJSFJvYVhNdWRISnBaMmRsY2tWMlpXNTBLRVYyWlc1MExraEpSRVJGVGlrZ0lDQWdJQ0FnSUZ4dUlDQWdJQ0FnSUNBZ0lIUm9hWE11Y21WdGIzWmxRbUZqYTJSeWIzQW9LVnh1SUNBZ0lDQWdJQ0I5WEc1Y2JpQWdJQ0FnSUNBZ1ltRmphMlJ5YjNBdVlXUmtSWFpsYm5STWFYTjBaVzVsY2loRmRtVnVkQzVVVWtGT1UwbFVTVTlPWDBWT1JDd2diMjVJYVdSa1pXNHBYRzRnSUNBZ0lDQWdJR0poWTJ0a2NtOXdMbU5zWVhOelRHbHpkQzVoWkdRb0oyWmhaR1Z2ZFhRbktWeHVJQ0FnSUNBZ2ZWeHVYRzRnSUNBZ0lDQnlaWFIxY200Z2RISjFaVnh1SUNBZ0lIMWNibHh1SUNBZ0lHTnlaV0YwWlVKaFkydGtjbTl3S0NrZ2UxeHVJQ0FnSUNBZ1kyOXVjM1FnWW1GamEyUnliM0FnUFNCa2IyTjFiV1Z1ZEM1amNtVmhkR1ZGYkdWdFpXNTBLQ2RrYVhZbktWeHVJQ0FnSUNBZ1ltRmphMlJ5YjNBdWMyVjBRWFIwY21saWRYUmxLQ2RrWVhSaExXbGtKeXdnZEdocGN5NXBaQ2xjYmlBZ0lDQWdJR0poWTJ0a2NtOXdMbU5zWVhOelRHbHpkQzVoWkdRb1FrRkRTMFJTVDFCZlUwVk1SVU5VVDFJcFhHNWNiaUFnSUNBZ0lHUnZZM1Z0Wlc1MExtSnZaSGt1WVhCd1pXNWtRMmhwYkdRb1ltRmphMlJ5YjNBcFhHNGdJQ0FnZlZ4dVhHNGdJQ0FnWjJWMFFtRmphMlJ5YjNBb0tTQjdYRzRnSUNBZ0lDQnlaWFIxY200Z1pHOWpkVzFsYm5RdWNYVmxjbmxUWld4bFkzUnZjaWhnTGlSN1FrRkRTMFJTVDFCZlUwVk1SVU5VVDFKOVcyUmhkR0V0YVdROVhDSWtlM1JvYVhNdWFXUjlYQ0pkWUNsY2JpQWdJQ0I5WEc1Y2JpQWdJQ0J5WlcxdmRtVkNZV05yWkhKdmNDZ3BJSHRjYmlBZ0lDQWdJR052Ym5OMElHSmhZMnRrY205d0lEMGdkR2hwY3k1blpYUkNZV05yWkhKdmNDZ3BYRzRnSUNBZ0lDQnBaaUFvWW1GamEyUnliM0FwSUh0Y2JpQWdJQ0FnSUNBZ1pHOWpkVzFsYm5RdVltOWtlUzV5WlcxdmRtVkRhR2xzWkNoaVlXTnJaSEp2Y0NsY2JpQWdJQ0FnSUgxY2JpQWdJQ0I5WEc1Y2JpQWdJQ0JoZEhSaFkyaEZkbVZ1ZEhNb0tTQjdYRzRnSUNBZ0lDQmpiMjV6ZENCa2FYTnRhWE56UW5WMGRHOXVjeUE5SUhSb2FYTXViM0IwYVc5dWN5NWxiR1Z0Wlc1MExuRjFaWEo1VTJWc1pXTjBiM0pCYkd3b0oxdGtZWFJoTFdScGMyMXBjM05kSnlsY2JseHVJQ0FnSUNBZ2FXWWdLR1JwYzIxcGMzTkNkWFIwYjI1ektTQjdYRzRnSUNBZ0lDQWdJRUZ5Y21GNUxtWnliMjBvWkdsemJXbHpjMEoxZEhSdmJuTXBMbVp2Y2tWaFkyZ29ZblYwZEc5dUlEMCtJSFJvYVhNdWNtVm5hWE4wWlhKRmJHVnRaVzUwS0hzZ2RHRnlaMlYwT2lCaWRYUjBiMjRzSUdWMlpXNTBPaUFuWTJ4cFkyc25JSDBwS1Z4dUlDQWdJQ0FnZlZ4dVhHNGdJQ0FnSUNCcFppQW9kR2hwY3k1MWMyVkNZV05yWkhKdmNDa2dlMXh1SUNBZ0lDQWdJQ0JqYjI1emRDQmlZV05yWkhKdmNDQTlJSFJvYVhNdVoyVjBRbUZqYTJSeWIzQW9LU0FnSUNBZ0lGeHVJQ0FnSUNBZ0lDQjBhR2x6TG5KbFoybHpkR1Z5Uld4bGJXVnVkQ2g3SUhSaGNtZGxkRG9nWW1GamEyUnliM0FzSUdWMlpXNTBPaUJGZG1WdWRDNVRWRUZTVkNCOUtWeHVJQ0FnSUNBZ2ZWeHVYRzRnSUNBZ0lDQjBhR2x6TG5KbFoybHpkR1Z5Uld4bGJXVnVkQ2g3SUhSaGNtZGxkRG9nWkc5amRXMWxiblFzSUdWMlpXNTBPaUFuYTJWNWRYQW5JSDBwWEc0Z0lDQWdmVnh1WEc0Z0lDQWdaR1YwWVdOb1JYWmxiblJ6S0NrZ2UxeHVJQ0FnSUNBZ1kyOXVjM1FnWkdsemJXbHpjMEoxZEhSdmJuTWdQU0IwYUdsekxtOXdkR2x2Ym5NdVpXeGxiV1Z1ZEM1eGRXVnllVk5sYkdWamRHOXlRV3hzS0NkYlpHRjBZUzFrYVhOdGFYTnpYU2NwWEc1Y2JpQWdJQ0FnSUdsbUlDaGthWE50YVhOelFuVjBkRzl1Y3lrZ2UxeHVJQ0FnSUNBZ0lDQkJjbkpoZVM1bWNtOXRLR1JwYzIxcGMzTkNkWFIwYjI1ektTNW1iM0pGWVdOb0tHSjFkSFJ2YmlBOVBpQjBhR2x6TG5WdWNtVm5hWE4wWlhKRmJHVnRaVzUwS0hzZ2RHRnlaMlYwT2lCaWRYUjBiMjRzSUdWMlpXNTBPaUFuWTJ4cFkyc25JSDBwS1Z4dUlDQWdJQ0FnZlZ4dVhHNGdJQ0FnSUNCcFppQW9kR2hwY3k1MWMyVkNZV05yWkhKdmNDa2dlMXh1SUNBZ0lDQWdJQ0JqYjI1emRDQmlZV05yWkhKdmNDQTlJSFJvYVhNdVoyVjBRbUZqYTJSeWIzQW9LVnh1SUNBZ0lDQWdJQ0IwYUdsekxuVnVjbVZuYVhOMFpYSkZiR1Z0Wlc1MEtIc2dkR0Z5WjJWME9pQmlZV05yWkhKdmNDd2daWFpsYm5RNklFVjJaVzUwTGxOVVFWSlVJSDBwWEc0Z0lDQWdJQ0I5WEc1Y2JpQWdJQ0FnSUhSb2FYTXVkVzV5WldkcGMzUmxja1ZzWlcxbGJuUW9leUIwWVhKblpYUTZJR1J2WTNWdFpXNTBMQ0JsZG1WdWREb2dKMnRsZVhWd0p5QjlLVnh1SUNBZ0lIMWNibHh1SUNBZ0lITjBZWFJwWXlCcFpHVnVkR2xtYVdWeUtDa2dlMXh1SUNBZ0lDQWdjbVYwZFhKdUlFNUJUVVZjYmlBZ0lDQjlYRzVjYmlBZ0lDQnpkR0YwYVdNZ1gwUlBUVWx1ZEdWeVptRmpaU2h2Y0hScGIyNXpLU0I3WEc0Z0lDQWdJQ0J5WlhSMWNtNGdjM1Z3WlhJdVgwUlBUVWx1ZEdWeVptRmpaU2hQWm1aRFlXNTJZWE1zSUc5d2RHbHZibk1wWEc0Z0lDQWdmVnh1SUNCOVhHNWNiaUFnTHlvcVhHNGdJQ0FxSUMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFZ4dUlDQWdLaUJFVDAwZ1FYQnBJR2x0Y0d4bGJXVnVkR0YwYVc5dVhHNGdJQ0FxSUMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFZ4dUlDQWdLaTljYmlBZ1kyOXVjM1FnWTI5dGNHOXVaVzUwY3lBOUlGdGRYRzVjYmlBZ1kyOXVjM1FnYjJabVEyRnVkbUZ6SUQwZ1pHOWpkVzFsYm5RdWNYVmxjbmxUWld4bFkzUnZja0ZzYkNoZ0xpUjdUa0ZOUlgxZ0tWeHVJQ0JwWmlBb2IyWm1RMkZ1ZG1GektTQjdYRzRnSUNBZ1FYSnlZWGt1Wm5KdmJTaHZabVpEWVc1MllYTXBMbVp2Y2tWaFkyZ29LR1ZzWlcxbGJuUXBJRDArSUh0Y2JpQWdJQ0FnSUdOdmJuTjBJR052Ym1acFp5QTlJR2RsZEVGMGRISnBZblYwWlhORGIyNW1hV2NvWld4bGJXVnVkQ3dnUkVWR1FWVk1WRjlRVWs5UVJWSlVTVVZUTENCRVFWUkJYMEZVVkZKVFgxQlNUMUJGVWxSSlJWTXBYRzRnSUNBZ0lDQmpiMjVtYVdjdVpXeGxiV1Z1ZENBOUlHVnNaVzFsYm5SY2JseHVJQ0FnSUNBZ1kyOXRjRzl1Wlc1MGN5NXdkWE5vS0hzZ1pXeGxiV1Z1ZEN3Z2IyWm1RMkZ1ZG1Gek9pQnVaWGNnVDJabVEyRnVkbUZ6S0dOdmJtWnBaeWtnZlNsY2JpQWdJQ0I5S1Z4dUlDQjlYRzVjYmlBZ1pHOWpkVzFsYm5RdVlXUmtSWFpsYm5STWFYTjBaVzVsY2lnblkyeHBZMnNuTENBb1pYWmxiblFwSUQwK0lIdGNiaUFnSUNCamIyNXpkQ0IwWVhKblpYUWdQU0JtYVc1a1ZHRnlaMlYwUW5sQmRIUnlLR1YyWlc1MExuUmhjbWRsZEN3Z0oyUmhkR0V0ZEc5bloyeGxKeWxjYmlBZ0lDQnBaaUFvSVhSaGNtZGxkQ2tnZTF4dUlDQWdJQ0FnY21WMGRYSnVYRzRnSUNBZ2ZWeHVYRzRnSUNBZ1kyOXVjM1FnWkdGMFlWUnZaMmRzWlVGMGRISWdQU0IwWVhKblpYUXVaMlYwUVhSMGNtbGlkWFJsS0Nka1lYUmhMWFJ2WjJkc1pTY3BYRzRnSUNBZ2FXWWdLR1JoZEdGVWIyZG5iR1ZCZEhSeUlDWW1JR1JoZEdGVWIyZG5iR1ZCZEhSeUlEMDlQU0JPUVUxRktTQjdYRzRnSUNBZ0lDQmpiMjV6ZENCcFpDQTlJSFJoY21kbGRDNW5aWFJCZEhSeWFXSjFkR1VvSjJSaGRHRXRkR0Z5WjJWMEp5bGNiaUFnSUNBZ0lHTnZibk4wSUdWc1pXMWxiblFnUFNCa2IyTjFiV1Z1ZEM1eGRXVnllVk5sYkdWamRHOXlLR2xrS1Z4dVhHNGdJQ0FnSUNCamIyNXpkQ0JqYjIxd2IyNWxiblFnUFNCamIyMXdiMjVsYm5SekxtWnBibVFvWXlBOVBpQmpMbVZzWlcxbGJuUWdQVDA5SUdWc1pXMWxiblFwWEc1Y2JpQWdJQ0FnSUdsbUlDZ2hZMjl0Y0c5dVpXNTBLU0I3WEc0Z0lDQWdJQ0FnSUhKbGRIVnlibHh1SUNBZ0lDQWdmVnh1WEc0Z0lDQWdJQ0IwWVhKblpYUXVZbXgxY2lncFhHNWNiaUFnSUNBZ0lHTnZiWEJ2Ym1WdWRDNXZabVpEWVc1MllYTXVjMmh2ZHlncFhHNGdJQ0FnZlZ4dUlDQjlLVnh1WEc0Z0lISmxkSFZ5YmlCUFptWkRZVzUyWVhOY2JuMHBLQ2xjYmx4dVpYaHdiM0owSUdSbFptRjFiSFFnVDJabVEyRnVkbUZ6WEc0aUxDSXZLaXBjYmlBcUlDMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRYRzRnS2lCTWFXTmxibk5sWkNCMWJtUmxjaUJOU1ZRZ0tHaDBkSEJ6T2k4dloybDBhSFZpTG1OdmJTOXhkV0Z5YXkxa1pYWXZVR2h2Ym05dUxVWnlZVzFsZDI5eWF5OWliRzlpTDIxaGMzUmxjaTlNU1VORlRsTkZLVnh1SUNvZ0xTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMWNiaUFxTDF4dWFXMXdiM0owSUVOdmJYQnZibVZ1ZENCbWNtOXRJQ2N1TGk5amIyMXdiMjVsYm5RblhHNXBiWEJ2Y25RZ1JYWmxiblFnWm5KdmJTQW5MaTR2TGk0dlkyOXRiVzl1TDJWMlpXNTBjeWRjYmx4dVkyOXVjM1FnVUhKdlozSmxjM01nUFNBb0tDa2dQVDRnZTF4dUlDQXZLaXBjYmlBZ0lDb2dMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRYRzRnSUNBcUlFTnZibk4wWVc1MGMxeHVJQ0FnS2lBdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMxY2JpQWdJQ292WEc1Y2JpQWdZMjl1YzNRZ1RrRk5SU0E5SUNkd2NtOW5jbVZ6Y3lkY2JpQWdZMjl1YzNRZ1ZrVlNVMGxQVGlBOUlDY3lMakF1TUNkY2JpQWdZMjl1YzNRZ1JFVkdRVlZNVkY5UVVrOVFSVkpVU1VWVElEMGdlMXh1SUNBZ0lHVnNaVzFsYm5RNklHNTFiR3dzWEc0Z0lDQWdhR1ZwWjJoME9pQTFMRnh1SUNBZ0lHMXBiam9nTUN4Y2JpQWdJQ0J0WVhnNklERXdNQ3hjYmlBZ0lDQnNZV0psYkRvZ1ptRnNjMlVzWEc0Z0lDQWdjM1J5YVhCbFpEb2dabUZzYzJVc1hHNGdJQ0FnWW1GamEyZHliM1Z1WkRvZ2JuVnNiQ3hjYmlBZ2ZWeHVJQ0JqYjI1emRDQkVRVlJCWDBGVVZGSlRYMUJTVDFCRlVsUkpSVk1nUFNCYlhHNGdJQ0FnSjJobGFXZG9kQ2NzWEc0Z0lDQWdKMjFwYmljc1hHNGdJQ0FnSjIxaGVDY3NYRzRnSUNBZ0oyeGhZbVZzSnl4Y2JpQWdJQ0FuYzNSeWFYQmxaQ2NzWEc0Z0lDQWdKMkpoWTJ0bmNtOTFibVFuTEZ4dUlDQmRYRzVjYmlBZ0x5b3FYRzRnSUNBcUlDMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExWeHVJQ0FnS2lCRGJHRnpjeUJFWldacGJtbDBhVzl1WEc0Z0lDQXFJQzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMVnh1SUNBZ0tpOWNibHh1SUNCamJHRnpjeUJRY205bmNtVnpjeUJsZUhSbGJtUnpJRU52YlhCdmJtVnVkQ0I3WEc1Y2JpQWdJQ0JqYjI1emRISjFZM1J2Y2lodmNIUnBiMjV6SUQwZ2UzMHBJSHRjYmlBZ0lDQWdJSE4xY0dWeUtFNUJUVVVzSUZaRlVsTkpUMDRzSUVSRlJrRlZURlJmVUZKUFVFVlNWRWxGVXl3Z2IzQjBhVzl1Y3l3Z1JFRlVRVjlCVkZSU1UxOVFVazlRUlZKVVNVVlRMQ0JtWVd4elpTd2dabUZzYzJVcFhHNWNiaUFnSUNBZ0lDOHZJSE5sZENCMGFHVWdkMkZ1ZEdWa0lHaGxhV2RvZEZ4dUlDQWdJQ0FnZEdocGN5NXZjSFJwYjI1ekxtVnNaVzFsYm5RdWMzUjViR1V1YUdWcFoyaDBJRDBnWUNSN2RHaHBjeTV2Y0hScGIyNXpMbWhsYVdkb2RIMXdlR0JjYmx4dUlDQWdJQ0FnTHk4Z2MyVjBJRzFwYmlCaGJtUWdiV0Y0SUhaaGJIVmxjMXh1SUNBZ0lDQWdZMjl1YzNRZ2NISnZaM0psYzNOQ1lYSWdQU0IwYUdsekxtZGxkRkJ5YjJkeVpYTnpRbUZ5S0NsY2JpQWdJQ0FnSUhCeWIyZHlaWE56UW1GeUxuTmxkRUYwZEhKcFluVjBaU2duWVhKcFlTMTJZV3gxWlcxcGJpY3NJR0FrZTNSb2FYTXViM0IwYVc5dWN5NXRhVzU5WUNsY2JpQWdJQ0FnSUhCeWIyZHlaWE56UW1GeUxuTmxkRUYwZEhKcFluVjBaU2duWVhKcFlTMTJZV3gxWlcxaGVDY3NJR0FrZTNSb2FYTXViM0IwYVc5dWN5NXRZWGg5WUNsY2JseHVJQ0FnSUNBZ0x5OGdjMlYwSUhOMGNtbHdaV1JjYmlBZ0lDQWdJR2xtSUNoMGFHbHpMbTl3ZEdsdmJuTXVjM1J5YVhCbFpGeHVJQ0FnSUNBZ0lDQW1KaUFoY0hKdlozSmxjM05DWVhJdVkyeGhjM05NYVhOMExtTnZiblJoYVc1ektDZHdjbTluY21WemN5MWlZWEl0YzNSeWFYQmxaQ2NwS1NCN1hHNGdJQ0FnSUNBZ0lIQnliMmR5WlhOelFtRnlMbU5zWVhOelRHbHpkQzVoWkdRb0ozQnliMmR5WlhOekxXSmhjaTF6ZEhKcGNHVmtKeWxjYmlBZ0lDQWdJSDFjYmx4dUlDQWdJQ0FnTHk4Z2MyVjBJR0poWTJ0bmNtOTFibVJjYmlBZ0lDQWdJR2xtSUNoMGVYQmxiMllnZEdocGN5NXZjSFJwYjI1ekxtSmhZMnRuY205MWJtUWdQVDA5SUNkemRISnBibWNuWEc0Z0lDQWdJQ0FnSUNZbUlDRndjbTluY21WemMwSmhjaTVqYkdGemMweHBjM1F1WTI5dWRHRnBibk1vWUdKbkxTUjdkR2hwY3k1dmNIUnBiMjV6TG1KaFkydG5jbTkxYm1SOVlDa3BJSHRjYmlBZ0lDQWdJQ0FnY0hKdlozSmxjM05DWVhJdVkyeGhjM05NYVhOMExtRmtaQ2hnWW1jdEpIdDBhR2x6TG05d2RHbHZibk11WW1GamEyZHliM1Z1WkgxZ0tWeHVJQ0FnSUNBZ2ZWeHVJQ0FnSUgxY2JseHVJQ0FnSUdkbGRGQnliMmR5WlhOelFtRnlLQ2tnZTF4dUlDQWdJQ0FnY21WMGRYSnVJSFJvYVhNdWIzQjBhVzl1Y3k1bGJHVnRaVzUwTG5GMVpYSjVVMlZzWldOMGIzSW9KeTV3Y205bmNtVnpjeTFpWVhJbktWeHVJQ0FnSUgxY2JseHVJQ0FnSUhObGRDaDJZV3gxWlNBOUlEQXBJSHRjYmlBZ0lDQWdJR052Ym5OMElIQnliMmR5WlhOelFtRnlJRDBnZEdocGN5NW5aWFJRY205bmNtVnpjMEpoY2lncFhHNGdJQ0FnSUNCamIyNXpkQ0J3Y205bmNtVnpjeUE5SUUxaGRHZ3VjbTkxYm1Rb0tIWmhiSFZsSUM4Z0tIUm9hWE11YjNCMGFXOXVjeTV0YVc0Z0t5QjBhR2x6TG05d2RHbHZibk11YldGNEtTa2dLaUF4TURBcFhHNWNiaUFnSUNBZ0lHbG1JQ2gyWVd4MVpTQThJSFJvYVhNdWIzQjBhVzl1Y3k1dGFXNHBJSHRjYmlBZ0lDQWdJQ0FnWTI5dWMyOXNaUzVsY25KdmNpaGdKSHRPUVUxRmZTNGdWMkZ5Ym1sdVp5d2dKSHQyWVd4MVpYMGdhWE1nZFc1a1pYSWdiV2x1SUhaaGJIVmxMbUFwWEc0Z0lDQWdJQ0FnSUhKbGRIVnliaUJtWVd4elpWeHVJQ0FnSUNBZ2ZWeHVYRzRnSUNBZ0lDQnBaaUFvZG1Gc2RXVWdQaUIwYUdsekxtOXdkR2x2Ym5NdWJXRjRLU0I3WEc0Z0lDQWdJQ0FnSUdOdmJuTnZiR1V1WlhKeWIzSW9ZQ1I3VGtGTlJYMHVJRmRoY201cGJtY3NJQ1I3ZG1Gc2RXVjlJR2x6SUdGaWIzWmxJRzFoZUNCMllXeDFaUzVnS1NBZ0lDQWdJQ0FnSUNCY2JpQWdJQ0FnSUNBZ2NtVjBkWEp1SUdaaGJITmxYRzRnSUNBZ0lDQjlYRzVjYmlBZ0lDQWdJSEJ5YjJkeVpYTnpRbUZ5TG5ObGRFRjBkSEpwWW5WMFpTZ25ZWEpwWVMxMllXeDFaVzV2ZHljc0lHQWtlM1poYkhWbGZXQXBJQ0FnSUNBZ1hHNWNiaUFnSUNBZ0lDOHZJSE5sZENCc1lXSmxiRnh1SUNBZ0lDQWdhV1lnS0hSb2FYTXViM0IwYVc5dWN5NXNZV0psYkNrZ2UxeHVJQ0FnSUNBZ0lDQndjbTluY21WemMwSmhjaTVwYm01bGNraFVUVXdnUFNCZ0pIdHdjbTluY21WemMzMGxZRnh1SUNBZ0lDQWdmVnh1WEc0Z0lDQWdJQ0F2THlCelpYUWdjR1Z5WTJWdWRHRm5aVnh1SUNBZ0lDQWdjSEp2WjNKbGMzTkNZWEl1YzNSNWJHVXVkMmxrZEdnZ1BTQmdKSHR3Y205bmNtVnpjMzBsWUZ4dVhHNGdJQ0FnSUNCeVpYUjFjbTRnZEhKMVpWeHVJQ0FnSUgxY2JseHVJQ0FnSUdGdWFXMWhkR1VvYzNSaGNuUkJibWx0WVhScGIyNGdQU0IwY25WbEtTQjdYRzRnSUNBZ0lDQnBaaUFvSVhSb2FYTXViM0IwYVc5dWN5NXpkSEpwY0dWa0tTQjdYRzRnSUNBZ0lDQWdJR052Ym5OdmJHVXVaWEp5YjNJb1lDUjdUa0ZOUlgwdUlFRnVhVzFoZEdsdmJpQjNiM0pyY3lCdmJteDVJSGRwZEdnZ2MzUnlhWEJsWkNCd2NtOW5jbVZ6Y3k1Z0tWeHVJQ0FnSUNBZ0lDQnlaWFIxY200Z1ptRnNjMlZjYmlBZ0lDQWdJSDFjYmx4dUlDQWdJQ0FnWTI5dWMzUWdjSEp2WjNKbGMzTkNZWElnUFNCMGFHbHpMbWRsZEZCeWIyZHlaWE56UW1GeUtDbGNibHh1SUNBZ0lDQWdhV1lnS0hOMFlYSjBRVzVwYldGMGFXOXVYRzRnSUNBZ0lDQWdJQ1ltSUNGd2NtOW5jbVZ6YzBKaGNpNWpiR0Z6YzB4cGMzUXVZMjl1ZEdGcGJuTW9KM0J5YjJkeVpYTnpMV0poY2kxaGJtbHRZWFJsWkNjcEtTQjdYRzRnSUNBZ0lDQWdJSEJ5YjJkeVpYTnpRbUZ5TG1Oc1lYTnpUR2x6ZEM1aFpHUW9KM0J5YjJkeVpYTnpMV0poY2kxaGJtbHRZWFJsWkNjcFhHNGdJQ0FnSUNCOVhHNWNiaUFnSUNBZ0lHbG1JQ2doYzNSaGNuUkJibWx0WVhScGIyNWNiaUFnSUNBZ0lDQWdKaVlnY0hKdlozSmxjM05DWVhJdVkyeGhjM05NYVhOMExtTnZiblJoYVc1ektDZHdjbTluY21WemN5MWlZWEl0WVc1cGJXRjBaV1FuS1NrZ2UxeHVJQ0FnSUNBZ0lDQndjbTluY21WemMwSmhjaTVqYkdGemMweHBjM1F1Y21WdGIzWmxLQ2R3Y205bmNtVnpjeTFpWVhJdFlXNXBiV0YwWldRbktWeHVJQ0FnSUNBZ2ZWeHVYRzRnSUNBZ0lDQnlaWFIxY200Z2RISjFaVnh1SUNBZ0lIMWNibHh1SUNBZ0lITm9iM2NvS1NCN1hHNGdJQ0FnSUNCMGFHbHpMbTl3ZEdsdmJuTXVaV3hsYldWdWRDNXpkSGxzWlM1b1pXbG5hSFFnUFNCZ0pIdDBhR2x6TG05d2RHbHZibk11YUdWcFoyaDBmWEI0WUZ4dUlDQWdJQ0FnZEdocGN5NTBjbWxuWjJWeVJYWmxiblFvUlhabGJuUXVVMGhQVnlsY2JpQWdJQ0FnSUhSb2FYTXVkSEpwWjJkbGNrVjJaVzUwS0VWMlpXNTBMbE5JVDFkT0tWeHVYRzRnSUNBZ0lDQnlaWFIxY200Z2RISjFaVnh1SUNBZ0lIMWNibHh1SUNBZ0lHaHBaR1VvS1NCN1hHNGdJQ0FnSUNCMGFHbHpMbTl3ZEdsdmJuTXVaV3hsYldWdWRDNXpkSGxzWlM1b1pXbG5hSFFnUFNBbk1IQjRKMXh1SUNBZ0lDQWdkR2hwY3k1MGNtbG5aMlZ5UlhabGJuUW9SWFpsYm5RdVNFbEVSU2xjYmlBZ0lDQWdJSFJvYVhNdWRISnBaMmRsY2tWMlpXNTBLRVYyWlc1MExraEpSRVJGVGlsY2JseHVJQ0FnSUNBZ2NtVjBkWEp1SUhSeWRXVmNiaUFnSUNCOVhHNWNiaUFnSUNCemRHRjBhV01nYVdSbGJuUnBabWxsY2lncElIdGNiaUFnSUNBZ0lISmxkSFZ5YmlCT1FVMUZYRzRnSUNBZ2ZWeHVYRzRnSUNBZ2MzUmhkR2xqSUY5RVQwMUpiblJsY21aaFkyVW9iM0IwYVc5dWN5a2dlMXh1SUNBZ0lDQWdjbVYwZFhKdUlITjFjR1Z5TGw5RVQwMUpiblJsY21aaFkyVW9VSEp2WjNKbGMzTXNJRzl3ZEdsdmJuTXBYRzRnSUNBZ2ZWeHVJQ0I5WEc1Y2JpQWdjbVYwZFhKdUlGQnliMmR5WlhOelhHNTlLU2dwWEc1Y2JtVjRjRzl5ZENCa1pXWmhkV3gwSUZCeWIyZHlaWE56WEc0aUxDSXZLaXBjYmlBcUlDMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRYRzRnS2lCTWFXTmxibk5sWkNCMWJtUmxjaUJOU1ZRZ0tHaDBkSEJ6T2k4dloybDBhSFZpTG1OdmJTOXhkV0Z5YXkxa1pYWXZVR2h2Ym05dUxVWnlZVzFsZDI5eWF5OWliRzlpTDIxaGMzUmxjaTlNU1VORlRsTkZLVnh1SUNvZ0xTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMWNiaUFxTDF4dWFXMXdiM0owSUVOdmJYQnZibVZ1ZENCbWNtOXRJQ2N1TGk5amIyMXdiMjVsYm5RblhHNXBiWEJ2Y25RZ2V5Qm5aWFJCZEhSeWFXSjFkR1Z6UTI5dVptbG5JSDBnWm5KdmJTQW5MaTR2WTI5dGNHOXVaVzUwVFdGdVlXZGxjaWRjYm1sdGNHOXlkQ0JGZG1WdWRDQm1jbTl0SUNjdUxpOHVMaTlqYjIxdGIyNHZaWFpsYm5SekoxeHVhVzF3YjNKMElIc2dabWx1WkZSaGNtZGxkRUo1UTJ4aGMzTWdmU0JtY205dElDY3VMaTh1TGk5amIyMXRiMjR2ZFhScGJITW5YRzVjYm1OdmJuTjBJRlJoWWlBOUlDZ29LU0E5UGlCN1hHNGdJQzhxS2x4dUlDQWdLaUF0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzFjYmlBZ0lDb2dRMjl1YzNSaGJuUnpYRzRnSUNBcUlDMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExWeHVJQ0FnS2k5Y2JseHVJQ0JqYjI1emRDQk9RVTFGSUQwZ0ozUmhZaWRjYmlBZ1kyOXVjM1FnVmtWU1UwbFBUaUE5SUNjeUxqQXVNQ2RjYmlBZ1kyOXVjM1FnUkVWR1FWVk1WRjlRVWs5UVJWSlVTVVZUSUQwZ2UxeHVYRzRnSUgxY2JpQWdZMjl1YzNRZ1JFRlVRVjlCVkZSU1UxOVFVazlRUlZKVVNVVlRJRDBnVzF4dUlDQmRYRzRnSUdOdmJuTjBJRlJCUWw5RFQwNVVSVTVVWDFORlRFVkRWRTlTSUQwZ0p5NTBZV0l0Y0dGdVpTZGNibHh1SUNBdktpcGNiaUFnSUNvZ0xTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdFhHNGdJQ0FxSUVOc1lYTnpJRVJsWm1sdWFYUnBiMjVjYmlBZ0lDb2dMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRYRzRnSUNBcUwxeHVYRzRnSUdOc1lYTnpJRlJoWWlCbGVIUmxibVJ6SUVOdmJYQnZibVZ1ZENCN1hHNWNiaUFnSUNCamIyNXpkSEoxWTNSdmNpaHZjSFJwYjI1eklEMGdlMzBwSUh0Y2JpQWdJQ0FnSUhOMWNHVnlLRTVCVFVVc0lGWkZVbE5KVDA0c0lFUkZSa0ZWVEZSZlVGSlBVRVZTVkVsRlV5d2diM0IwYVc5dWN5d2dSRUZVUVY5QlZGUlNVMTlRVWs5UVJWSlVTVVZUTENCbVlXeHpaU3dnWm1Gc2MyVXBYRzRnSUNBZ2ZWeHVYRzRnSUNBZ2MyaHZkeWdwSUh0Y2JpQWdJQ0FnSUdsbUlDaDBhR2x6TG05d2RHbHZibk11Wld4bGJXVnVkQzVqYkdGemMweHBjM1F1WTI5dWRHRnBibk1vSjJGamRHbDJaU2NwS1NCN1hHNGdJQ0FnSUNBZ0lISmxkSFZ5YmlCbVlXeHpaVnh1SUNBZ0lDQWdmVnh1WEc0Z0lDQWdJQ0JqYjI1emRDQnBaQ0E5SUhSb2FYTXViM0IwYVc5dWN5NWxiR1Z0Wlc1MExtZGxkRUYwZEhKcFluVjBaU2duYUhKbFppY3BYRzRnSUNBZ0lDQmpiMjV6ZENCdVlYWWdQU0JtYVc1a1ZHRnlaMlYwUW5sRGJHRnpjeWgwYUdsekxtOXdkR2x2Ym5NdVpXeGxiV1Z1ZEN3Z0oyNWhkaWNwWEc0Z0lDQWdJQ0JqYjI1emRDQnVZWFpVWVdKeklEMGdibUYySUQ4Z2JtRjJMbkYxWlhKNVUyVnNaV04wYjNKQmJHd29ZRnRrWVhSaExYUnZaMmRzWlQxY0lpUjdUa0ZOUlgxY0lsMWdLU0E2SUc1MWJHeGNibHh1SUNBZ0lDQWdhV1lnS0c1aGRsUmhZbk1wSUh0Y2JpQWdJQ0FnSUNBZ1FYSnlZWGt1Wm5KdmJTaHVZWFpVWVdKektTNW1iM0pGWVdOb0tDaDBZV0lwSUQwK0lIdGNiaUFnSUNBZ0lDQWdJQ0JwWmlBb2RHRmlMbU5zWVhOelRHbHpkQzVqYjI1MFlXbHVjeWduWVdOMGFYWmxKeWtwSUh0Y2JpQWdJQ0FnSUNBZ0lDQWdJSFJoWWk1amJHRnpjMHhwYzNRdWNtVnRiM1psS0NkaFkzUnBkbVVuS1Z4dUlDQWdJQ0FnSUNBZ0lIMWNiaUFnSUNBZ0lDQWdJQ0IwWVdJdWMyVjBRWFIwY21saWRYUmxLQ2RoY21saExYTmxiR1ZqZEdWa0p5d2dabUZzYzJVcFhHNGdJQ0FnSUNBZ0lIMHBYRzRnSUNBZ0lDQjlYRzVjYmlBZ0lDQWdJSFJvYVhNdWIzQjBhVzl1Y3k1bGJHVnRaVzUwTG1Oc1lYTnpUR2x6ZEM1aFpHUW9KMkZqZEdsMlpTY3BYRzRnSUNBZ0lDQjBhR2x6TG05d2RHbHZibk11Wld4bGJXVnVkQzV6WlhSQmRIUnlhV0oxZEdVb0oyRnlhV0V0YzJWc1pXTjBaV1FuTENCMGNuVmxLVnh1WEc0Z0lDQWdJQ0JqYjI1emRDQjBZV0pEYjI1MFpXNTBJRDBnWkc5amRXMWxiblF1Y1hWbGNubFRaV3hsWTNSdmNpaHBaQ2xjYmlBZ0lDQWdJR052Ym5OMElIUmhZa052Ym5SbGJuUnpJRDBnZEdGaVEyOXVkR1Z1ZEM1d1lYSmxiblJPYjJSbExuRjFaWEo1VTJWc1pXTjBiM0pCYkd3b1ZFRkNYME5QVGxSRlRsUmZVMFZNUlVOVVQxSXBYRzVjYmlBZ0lDQWdJR2xtSUNoMFlXSkRiMjUwWlc1MGN5a2dlMXh1SUNBZ0lDQWdJQ0JCY25KaGVTNW1jbTl0S0hSaFlrTnZiblJsYm5SektTNW1iM0pGWVdOb0tDaDBZV0lwSUQwK0lIdGNiaUFnSUNBZ0lDQWdJQ0JwWmlBb2RHRmlMbU5zWVhOelRHbHpkQzVqYjI1MFlXbHVjeWduWVdOMGFYWmxKeWtwSUh0Y2JpQWdJQ0FnSUNBZ0lDQWdJSFJoWWk1amJHRnpjMHhwYzNRdWNtVnRiM1psS0NkaFkzUnBkbVVuS1Z4dUlDQWdJQ0FnSUNBZ0lIMWNiaUFnSUNBZ0lDQWdmU2xjYmlBZ0lDQWdJSDFjYmx4dUlDQWdJQ0FnZEdGaVEyOXVkR1Z1ZEM1amJHRnpjMHhwYzNRdVlXUmtLQ2R6YUc5M2FXNW5KeWxjYmx4dUlDQWdJQ0FnYzJWMFZHbHRaVzkxZENnb0tTQTlQaUI3WEc0Z0lDQWdJQ0FnSUdOdmJuTjBJRzl1VTJodmQyVmtJRDBnS0NrZ1BUNGdlMXh1SUNBZ0lDQWdJQ0FnSUhSaFlrTnZiblJsYm5RdVkyeGhjM05NYVhOMExuSmxiVzkyWlNnbllXNXBiV0YwWlNjcFhHNGdJQ0FnSUNBZ0lDQWdkR0ZpUTI5dWRHVnVkQzVqYkdGemMweHBjM1F1WVdSa0tDZGhZM1JwZG1VbktWeHVJQ0FnSUNBZ0lDQWdJSFJoWWtOdmJuUmxiblF1WTJ4aGMzTk1hWE4wTG5KbGJXOTJaU2duYzJodmQybHVaeWNwWEc0Z0lDQWdJQ0FnSUNBZ2RHRmlRMjl1ZEdWdWRDNXlaVzF2ZG1WRmRtVnVkRXhwYzNSbGJtVnlLRVYyWlc1MExsUlNRVTVUU1ZSSlQwNWZSVTVFTENCdmJsTm9iM2RsWkNsY2JpQWdJQ0FnSUNBZ2ZWeHVYRzRnSUNBZ0lDQWdJSFJoWWtOdmJuUmxiblF1WVdSa1JYWmxiblJNYVhOMFpXNWxjaWhGZG1WdWRDNVVVa0ZPVTBsVVNVOU9YMFZPUkN3Z2IyNVRhRzkzWldRcFhHNWNiaUFnSUNBZ0lDQWdkR0ZpUTI5dWRHVnVkQzVqYkdGemMweHBjM1F1WVdSa0tDZGhibWx0WVhSbEp5bGNibHh1SUNBZ0lDQWdmU3dnTWpBcFhHNWNiaUFnSUNBZ0lISmxkSFZ5YmlCMGNuVmxYRzRnSUNBZ2ZWeHVYRzRnSUNBZ2FHbGtaU2dwSUh0Y2JpQWdJQ0FnSUdsbUlDZ2hkR2hwY3k1dmNIUnBiMjV6TG1Wc1pXMWxiblF1WTJ4aGMzTk1hWE4wTG1OdmJuUmhhVzV6S0NkaFkzUnBkbVVuS1NrZ2UxeHVJQ0FnSUNBZ0lDQnlaWFIxY200Z1ptRnNjMlZjYmlBZ0lDQWdJSDFjYmx4dUlDQWdJQ0FnYVdZZ0tIUm9hWE11YjNCMGFXOXVjeTVsYkdWdFpXNTBMbU5zWVhOelRHbHpkQzVqYjI1MFlXbHVjeWduWVdOMGFYWmxKeWtwSUh0Y2JpQWdJQ0FnSUNBZ2RHaHBjeTV2Y0hScGIyNXpMbVZzWlcxbGJuUXVZMnhoYzNOTWFYTjBMbkpsYlc5MlpTZ25ZV04wYVhabEp5bGNiaUFnSUNBZ0lIMWNibHh1SUNBZ0lDQWdkR2hwY3k1dmNIUnBiMjV6TG1Wc1pXMWxiblF1YzJWMFFYUjBjbWxpZFhSbEtDZGhjbWxoTFhObGJHVmpkR1ZrSnl3Z1ptRnNjMlVwWEc1Y2JpQWdJQ0FnSUdOdmJuTjBJR2xrSUQwZ2RHaHBjeTV2Y0hScGIyNXpMbVZzWlcxbGJuUXVaMlYwUVhSMGNtbGlkWFJsS0Nkb2NtVm1KeWxjYmlBZ0lDQWdJR052Ym5OMElIUmhZa052Ym5SbGJuUWdQU0JrYjJOMWJXVnVkQzV4ZFdWeWVWTmxiR1ZqZEc5eUtHbGtLVnh1WEc0Z0lDQWdJQ0JwWmlBb2RHRmlRMjl1ZEdWdWRDNWpiR0Z6YzB4cGMzUXVZMjl1ZEdGcGJuTW9KMkZqZEdsMlpTY3BLU0I3WEc0Z0lDQWdJQ0FnSUhSaFlrTnZiblJsYm5RdVkyeGhjM05NYVhOMExuSmxiVzkyWlNnbllXTjBhWFpsSnlsY2JpQWdJQ0FnSUgxY2JseHVJQ0FnSUNBZ2NtVjBkWEp1SUhSeWRXVmNiaUFnSUNCOVhHNWNiaUFnSUNCemRHRjBhV01nYVdSbGJuUnBabWxsY2lncElIdGNiaUFnSUNBZ0lISmxkSFZ5YmlCT1FVMUZYRzRnSUNBZ2ZWeHVYRzRnSUNBZ2MzUmhkR2xqSUY5RVQwMUpiblJsY21aaFkyVW9iM0IwYVc5dWN5a2dlMXh1SUNBZ0lDQWdjbVYwZFhKdUlITjFjR1Z5TGw5RVQwMUpiblJsY21aaFkyVW9WR0ZpTENCdmNIUnBiMjV6S1Z4dUlDQWdJSDFjYmlBZ2ZWeHVYRzRnSUM4cUtseHVJQ0FnS2lBdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMxY2JpQWdJQ29nUkU5TklFRndhU0JwYlhCc1pXMWxiblJoZEdsdmJseHVJQ0FnS2lBdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMxY2JpQWdJQ292WEc0Z0lHTnZibk4wSUdOdmJYQnZibVZ1ZEhNZ1BTQmJYVnh1WEc0Z0lHTnZibk4wSUhSaFluTWdQU0JrYjJOMWJXVnVkQzV4ZFdWeWVWTmxiR1ZqZEc5eVFXeHNLR0JiWkdGMFlTMTBiMmRuYkdVOVhDSWtlMDVCVFVWOVhDSmRZQ2xjYmlBZ2FXWWdLSFJoWW5NcElIdGNiaUFnSUNCQmNuSmhlUzVtY205dEtIUmhZbk1wTG1admNrVmhZMmdvS0dWc1pXMWxiblFwSUQwK0lIdGNiaUFnSUNBZ0lDOHZJR052Ym5OMElHTnZibVpwWnlBOUlIdDlYRzRnSUNBZ0lDQmpiMjV6ZENCamIyNW1hV2NnUFNCblpYUkJkSFJ5YVdKMWRHVnpRMjl1Wm1sbktHVnNaVzFsYm5Rc0lFUkZSa0ZWVEZSZlVGSlBVRVZTVkVsRlV5d2dSRUZVUVY5QlZGUlNVMTlRVWs5UVJWSlVTVVZUS1Z4dUlDQWdJQ0FnWTI5dVptbG5MbVZzWlcxbGJuUWdQU0JsYkdWdFpXNTBYRzVjYmlBZ0lDQWdJR052YlhCdmJtVnVkSE11Y0hWemFDaFVZV0l1WDBSUFRVbHVkR1Z5Wm1GalpTaGpiMjVtYVdjcEtWeHVJQ0FnSUgwcFhHNGdJSDFjYmx4dUlDQmtiMk4xYldWdWRDNWhaR1JGZG1WdWRFeHBjM1JsYm1WeUtDZGpiR2xqYXljc0lDaGxkbVZ1ZENrZ1BUNGdlMXh1SUNBZ0lHTnZibk4wSUdSaGRHRlViMmRuYkdWQmRIUnlJRDBnWlhabGJuUXVkR0Z5WjJWMExtZGxkRUYwZEhKcFluVjBaU2duWkdGMFlTMTBiMmRuYkdVbktWeHVJQ0FnSUdsbUlDaGtZWFJoVkc5bloyeGxRWFIwY2lBbUppQmtZWFJoVkc5bloyeGxRWFIwY2lBOVBUMGdUa0ZOUlNrZ2UxeHVJQ0FnSUNBZ1kyOXVjM1FnYVdRZ1BTQmxkbVZ1ZEM1MFlYSm5aWFF1WjJWMFFYUjBjbWxpZFhSbEtDZG9jbVZtSnlsY2JseHVJQ0FnSUNBZ1kyOXVjM1FnWTI5dGNHOXVaVzUwSUQwZ1kyOXRjRzl1Wlc1MGN5NW1hVzVrS0dNZ1BUNGdZeTVuWlhSRmJHVnRaVzUwS0NrdVoyVjBRWFIwY21saWRYUmxLQ2RvY21WbUp5a2dQVDA5SUdsa0tWeHVYRzRnSUNBZ0lDQnBaaUFvSVdOdmJYQnZibVZ1ZENrZ2UxeHVJQ0FnSUNBZ0lDQnlaWFIxY201Y2JpQWdJQ0FnSUgxY2JseHVJQ0FnSUNBZ1kyOXRjRzl1Wlc1MExuTm9iM2NvS1Z4dUlDQWdJSDFjYmlBZ2ZTbGNibHh1SUNCeVpYUjFjbTRnVkdGaVhHNTlLU2dwWEc1Y2JtVjRjRzl5ZENCa1pXWmhkV3gwSUZSaFlseHVJaXdpTHlvcVhHNHFJQzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0WEc0cUlFeHBZMlZ1YzJWa0lIVnVaR1Z5SUUxSlZDQW9hSFIwY0hNNkx5OW5hWFJvZFdJdVkyOXRMM0YxWVhKckxXUmxkaTlRYUc5dWIyNHRSbkpoYldWM2IzSnJMMkpzYjJJdmJXRnpkR1Z5TDB4SlEwVk9VMFVwWEc0cUlDMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRYRzRxTDF4dVhHNWpiMjV6ZENCQ2FXNWtaWElnUFNBb0tDa2dQVDRnZTF4dUlDQXZLaXBjYmlBZ0tpQXRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMWNiaUFnS2lCRGIyNXpkR0Z1ZEhOY2JpQWdLaUF0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzFjYmlBZ0tpOWNibHh1SUNCamIyNXpkQ0JPUVUxRklEMGdKMmx1ZEd3dFltbHVaR1Z5SjF4dUlDQmpiMjV6ZENCV1JWSlRTVTlPSUQwZ0p6SXVNQzR3SjF4dVhHNGdJQzhxS2x4dUlDQWdLaUF0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzFjYmlBZ0lDb2dRMnhoYzNNZ1JHVm1hVzVwZEdsdmJseHVJQ0FnS2lBdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMxY2JpQWdJQ292WEc1Y2JpQWdZMnhoYzNNZ1FtbHVaR1Z5SUh0Y2JpQWdJQ0JqYjI1emRISjFZM1J2Y2lobGJHVnRaVzUwTENCa1lYUmhLU0I3WEc0Z0lDQWdJQ0IwYUdsekxtVnNaVzFsYm5RZ1BTQmxiR1Z0Wlc1MFhHNGdJQ0FnSUNCMGFHbHpMbVJoZEdFZ1BTQmtZWFJoWEc1Y2JpQWdJQ0FnSUdsbUlDZ2hkR2hwY3k1cGMwVnNaVzFsYm5Rb2RHaHBjeTVsYkdWdFpXNTBLU2tnZTF4dUlDQWdJQ0FnSUNCeVpYUjFjbTVjYmlBZ0lDQWdJSDFjYmx4dUlDQWdJQ0FnTHk4Z1lYSnlZWGtnYjJZZ1NGUk5URVZzWlcxbGJuUmNiaUFnSUNBZ0lHbG1JQ2gwYUdsekxtVnNaVzFsYm5RdWJHVnVaM1JvSUNZbUlIUm9hWE11Wld4bGJXVnVkQzVzWlc1bmRHZ2dQaUF3S1NCN1hHNGdJQ0FnSUNBZ0lIUm9hWE11YzJWMFRtOWtaWE1vZEdocGN5NWxiR1Z0Wlc1MEtWeHVJQ0FnSUNBZ2ZTQmxiSE5sSUh0Y2JpQWdJQ0FnSUNBZ0x5OGdjMmx1WjJ4bElFaFVUVXhGYkdWdFpXNTBYRzRnSUNBZ0lDQWdJSFJvYVhNdWMyVjBUbTlrWlNoMGFHbHpMbVZzWlcxbGJuUXBYRzRnSUNBZ0lDQjlYRzRnSUNBZ2ZWeHVYRzRnSUNBZ0x5OGdaMlYwZEdWeWMxeHVYRzRnSUNBZ2MzUmhkR2xqSUdkbGRDQjJaWEp6YVc5dUtDa2dlMXh1SUNBZ0lDQWdjbVYwZFhKdUlHQWtlMDVCVFVWOUxpUjdWa1ZTVTBsUFRuMWdYRzRnSUNBZ2ZWeHVYRzRnSUNBZ0x5b3FYRzRnSUNBZ0lDb2dRMmhsWTJ0eklHbG1JSFJvWlNCbmFYWmxiaUJoY21kMWJXVnVkQ0JwY3lCaElFUlBUU0JsYkdWdFpXNTBYRzRnSUNBZ0lDb2dRSEJoY21GdElIdElWRTFNUld4bGJXVnVkSDBnZEdobElHRnlaM1Z0Wlc1MElIUnZJSFJsYzNSY2JpQWdJQ0FnS2lCQWNtVjBkWEp1SUh0aWIyOXNaV0Z1ZlNCMGNuVmxJR2xtSUhSb1pTQnZZbXBsWTNRZ2FYTWdZU0JFVDAwZ1pXeGxiV1Z1ZEN3Z1ptRnNjMlVnYjNSb1pYSjNhWE5sWEc0Z0lDQWdJQ292WEc0Z0lDQWdhWE5GYkdWdFpXNTBLR1ZzWlcxbGJuUXBJSHRjYmlBZ0lDQWdJR2xtSUNobGJHVnRaVzUwSUQwOVBTQnVkV3hzS1NCN1hHNGdJQ0FnSUNBZ0lISmxkSFZ5YmlCbVlXeHpaVnh1SUNBZ0lDQWdmVnh1SUNBZ0lDQWdjbVYwZFhKdUlDaDBlWEJsYjJZZ1RtOWtaU0E5UFQwZ0oyOWlhbVZqZENjZ1B5QmxiR1Z0Wlc1MElHbHVjM1JoYm1ObGIyWWdUbTlrWlNBNklHVnNaVzFsYm5RZ0ppWWdkSGx3Wlc5bUlHVnNaVzFsYm5RZ1BUMDlJQ2R2WW1wbFkzUW5JQ1ltSUhSNWNHVnZaaUJsYkdWdFpXNTBMbTV2WkdWVWVYQmxJRDA5UFNBbmJuVnRZbVZ5SnlBbUppQjBlWEJsYjJZZ1pXeGxiV1Z1ZEM1dWIyUmxUbUZ0WlNBOVBUMGdKM04wY21sdVp5Y3BYRzRnSUNBZ2ZWeHVYRzRnSUNBZ0x5b3FYRzRnSUNBZ0tpQkNhVzVrY3lCemIyMWxJSFJsZUhRZ2RHOGdkR2hsSUdkcGRtVnVJRVJQVFNCbGJHVnRaVzUwWEc0Z0lDQWdLaUJBY0dGeVlXMGdlMGhVVFV4RmJHVnRaVzUwZlNCbGJHVnRaVzUwWEc0Z0lDQWdLaUJBY0dGeVlXMGdlMU4wY21sdVozMGdkR1Y0ZEZ4dUlDQWdJQ292WEc0Z0lDQWdjMlYwVkdWNGRDaGxiR1Z0Wlc1MExDQjBaWGgwS1NCN1hHNGdJQ0FnSUNCcFppQW9JU2duZEdWNGRFTnZiblJsYm5RbklHbHVJR1ZzWlcxbGJuUXBLU0I3WEc0Z0lDQWdJQ0FnSUdWc1pXMWxiblF1YVc1dVpYSlVaWGgwSUQwZ2RHVjRkRnh1SUNBZ0lDQWdmU0JsYkhObElIdGNiaUFnSUNBZ0lDQWdaV3hsYldWdWRDNTBaWGgwUTI5dWRHVnVkQ0E5SUhSbGVIUmNiaUFnSUNBZ0lIMWNiaUFnSUNCOVhHNWNiaUFnSUNBdktpcGNiaUFnSUNBZ0tpQkNhVzVrY3lCemIyMWxJR2gwYld3Z2RHOGdkR2hsSUdkcGRtVnVJRVJQVFNCbGJHVnRaVzUwWEc0Z0lDQWdJQ29nUUhCaGNtRnRJSHRJVkUxTVJXeGxiV1Z1ZEgwZ1pXeGxiV1Z1ZEZ4dUlDQWdJQ0FxSUVCd1lYSmhiU0I3YzNSeWFXNW5mU0IwWlhoMFhHNGdJQ0FnSUNvdlhHNGdJQ0FnYzJWMFNIUnRiQ2hsYkdWdFpXNTBMQ0IwWlhoMEtTQjdYRzRnSUNBZ0lDQmxiR1Z0Wlc1MExtbHVibVZ5U0ZSTlRDQTlJSFJsZUhSY2JpQWdJQ0I5WEc1Y2JpQWdJQ0F2S2lwY2JpQWdJQ0FnS2lCQ2FXNWtjeUJqZFhOMGIyMGdZWFIwY21saWRYUmxjeUIwYnlCMGFHVWdaMmwyWlc0Z1JFOU5JR1ZzWlcxbGJuUmNiaUFnSUNBZ0tpQkFjR0Z5WVcwZ2UwaFVUVXhGYkdWdFpXNTBmU0JsYkdWdFpXNTBYRzRnSUNBZ0lDb2dRSEJoY21GdElIdFRkSEpwYm1kOUlHRjBkSEpjYmlBZ0lDQWdLaUJBY0dGeVlXMGdlMU4wY21sdVozMGdkR1Y0ZEZ4dUlDQWdJQ0FxTDF4dUlDQWdJSE5sZEVGMGRISnBZblYwWlNobGJHVnRaVzUwTENCaGRIUnlMQ0IwWlhoMEtTQjdYRzRnSUNBZ0lDQmxiR1Z0Wlc1MExuTmxkRUYwZEhKcFluVjBaU2hoZEhSeUxDQjBaWGgwS1Z4dUlDQWdJSDFjYmx4dUlDQWdJSE5sZEU1dlpHVW9aV3hsYldWdWRDa2dlMXh1SUNBZ0lDQWdiR1YwSUdGMGRISWdQU0JsYkdWdFpXNTBMbWRsZEVGMGRISnBZblYwWlNnblpHRjBZUzFwTVRodUp5bGNiaUFnSUNBZ0lHbG1JQ2doWVhSMGNpa2dlMXh1SUNBZ0lDQWdJQ0J5WlhSMWNtNWNiaUFnSUNBZ0lIMWNibHh1SUNBZ0lDQWdZWFIwY2lBOUlHRjBkSEl1ZEhKcGJTZ3BYRzVjYmlBZ0lDQWdJR052Ym5OMElISWdQU0F2S0Q4NlhGeHpmRjRwS0Z0QkxWcGhMWG90WHpBdE9WMHJLVHBjWEhNcUtDNHFQeWtvUHoxY1hITXJYRngzS3pwOEpDa3ZaMXh1SUNBZ0lDQWdiR1YwSUcxY2JseHVJQ0FnSUNBZ2QyaHBiR1VnS0cwZ1BTQnlMbVY0WldNb1lYUjBjaWtwSUh0Y2JpQWdJQ0FnSUNBZ1kyOXVjM1FnYTJWNUlEMGdiVnN4WFM1MGNtbHRLQ2xjYmlBZ0lDQWdJQ0FnWTI5dWMzUWdkbUZzZFdVZ1BTQnRXekpkTG5SeWFXMG9LUzV5WlhCc1lXTmxLQ2NzSnl3Z0p5Y3BYRzRnSUNBZ0lDQWdJR3hsZENCcGJuUnNWbUZzZFdVZ1BTQjBhR2x6TG1SaGRHRmJkbUZzZFdWZFhHNWNiaUFnSUNBZ0lDQWdhV1lnS0NGMGFHbHpMbVJoZEdGYmRtRnNkV1ZkS1NCN1hHNGdJQ0FnSUNBZ0lDQWdZMjl1YzI5c1pTNXNiMmNvWUNSN1RrRk5SWDB1SUZkaGNtNXBibWNzSUNSN2RtRnNkV1Y5SUdSdlpYTWdibTkwSUdWNGFYTjBMbUFwWEc0Z0lDQWdJQ0FnSUNBZ2FXNTBiRlpoYkhWbElEMGdkbUZzZFdWY2JpQWdJQ0FnSUNBZ2ZWeHVYRzRnSUNBZ0lDQWdJR052Ym5OMElHMWxkR2h2WkU1aGJXVWdQU0FuYzJWMEp5QXJJR3RsZVM1amFHRnlRWFFvTUNrdWRHOVZjSEJsY2tOaGMyVW9LU0FySUd0bGVTNXpiR2xqWlNneEtWeHVYRzRnSUNBZ0lDQWdJR2xtSUNoMGFHbHpXMjFsZEdodlpFNWhiV1ZkS1NCN1hHNGdJQ0FnSUNBZ0lDQWdkR2hwYzF0dFpYUm9iMlJPWVcxbFhTaGxiR1Z0Wlc1MExDQnBiblJzVm1Gc2RXVXBYRzRnSUNBZ0lDQWdJSDBnWld4elpTQjdYRzRnSUNBZ0lDQWdJQ0FnZEdocGN5NXpaWFJCZEhSeWFXSjFkR1VvWld4bGJXVnVkQ3dnYTJWNUxDQnBiblJzVm1Gc2RXVXBYRzRnSUNBZ0lDQWdJSDFjYmlBZ0lDQWdJSDFjYmlBZ0lDQjlYRzVjYmlBZ0lDQXZLaXBjYmlBZ0lDQXFJRk5sZENCMllXeDFaWE1nZEc4Z1JFOU5JRzV2WkdWelhHNGdJQ0FnS2k5Y2JpQWdJQ0J6WlhST2IyUmxjeWhsYkdWdFpXNTBLU0I3WEc0Z0lDQWdJQ0JCY25KaGVTNW1jbTl0S0dWc1pXMWxiblFwTG1admNrVmhZMmdvWld3Z1BUNGdkR2hwY3k1elpYUk9iMlJsS0dWc0tTbGNiaUFnSUNCOVhHNGdJSDFjYmx4dUlDQnlaWFIxY200Z1FtbHVaR1Z5WEc1OUtTZ3BYRzVjYm1WNGNHOXlkQ0JrWldaaGRXeDBJRUpwYm1SbGNseHVJaXdpTHlvcVhHNGdLaUF0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFZ4dUlDb2dUR2xqWlc1elpXUWdkVzVrWlhJZ1RVbFVJQ2hvZEhSd2N6b3ZMMmRwZEdoMVlpNWpiMjB2Y1hWaGNtc3RaR1YyTDFCb2IyNXZiaTFHY21GdFpYZHZjbXN2WW14dllpOXRZWE4wWlhJdlRFbERSVTVUUlNsY2JpQXFJQzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0WEc0Z0tpOWNibWx0Y0c5eWRDQkNhVzVrWlhJZ1puSnZiU0FuTGk5aWFXNWtaWEluWEc1Y2JtTnZibk4wSUVsdWRHd2dQU0FvS0NrZ1BUNGdlMXh1SUNBdktpcGNiaUFnSUNvZ0xTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdFhHNGdJQ0FxSUVOdmJuTjBZVzUwYzF4dUlDQWdLaUF0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzFjYmlBZ0lDb3ZYRzVjYmlBZ1kyOXVjM1FnVGtGTlJTQTlJQ2RKYm5Sc0oxeHVJQ0JqYjI1emRDQldSVkpUU1U5T0lEMGdKekl1TUM0d0oxeHVJQ0JqYjI1emRDQkVSVVpCVlV4VVgxQlNUMUJGVWxSSlJWTWdQU0I3WEc0Z0lDQWdabUZzYkdKaFkydE1iMk5oYkdVNklDZGxiaWNzWEc0Z0lDQWdiRzlqWVd4bE9pQW5aVzRuTEZ4dUlDQWdJR0YxZEc5Q2FXNWtPaUIwY25WbExGeHVJQ0FnSUdSaGRHRTZJRzUxYkd3c1hHNGdJSDFjYmx4dUlDQXZLaXBjYmlBZ0lDb2dMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRYRzRnSUNBcUlFTnNZWE56SUVSbFptbHVhWFJwYjI1Y2JpQWdJQ29nTFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0WEc0Z0lDQXFMMXh1WEc0Z0lHTnNZWE56SUVsdWRHd2dlMXh1SUNBZ0lDOHFLbHh1SUNBZ0lDQXFJRU55WldGMFpYTWdZVzRnYVc1emRHRnVZMlVnYjJZZ1NXNTBiQzVjYmlBZ0lDQWdLaUJBY0dGeVlXMGdlMlpoYkd4aVlXTnJURzlqWVd4bE9pQnpkSEpwYm1jc0lHeHZZMkZzWlRvZ2MzUnlhVzVuTENCaGRYUnZRbWx1WkRvZ1ltOXZiR1ZoYml3Z1pHRjBZVG9nZTF0c1lXNW5PaUJ6ZEhKcGJtZGRPaUI3VzJ0bGVUb2djM1J5YVc1blhUb2djM1J5YVc1bmZYMTlYRzRnSUNBZ0lDb3ZYRzRnSUNBZ1kyOXVjM1J5ZFdOMGIzSW9iM0IwYVc5dWN5QTlJSHQ5S1NCN1hHNGdJQ0FnSUNCMGFHbHpMbTl3ZEdsdmJuTWdQU0JQWW1wbFkzUXVZWE56YVdkdUtFUkZSa0ZWVEZSZlVGSlBVRVZTVkVsRlV5d2diM0IwYVc5dWN5bGNibHh1SUNBZ0lDQWdhV1lnS0hSNWNHVnZaaUIwYUdsekxtOXdkR2x2Ym5NdVptRnNiR0poWTJ0TWIyTmhiR1VnSVQwOUlDZHpkSEpwYm1jbktTQjdYRzRnSUNBZ0lDQWdJSFJvY205M0lHNWxkeUJGY25KdmNpaGdKSHRPUVUxRmZTNGdWR2hsSUdaaGJHeGlZV05ySUd4dlkyRnNaU0JwY3lCdFlXNWtZWFJ2Y25rZ1lXNWtJRzExYzNRZ1ltVWdZU0J6ZEhKcGJtY3VZQ2xjYmlBZ0lDQWdJSDFjYmx4dUlDQWdJQ0FnYVdZZ0tIUm9hWE11YjNCMGFXOXVjeTVrWVhSaElEMDlQU0J1ZFd4c0tTQjdYRzRnSUNBZ0lDQWdJSFJvY205M0lHNWxkeUJGY25KdmNpaGdKSHRPUVUxRmZTNGdWR2hsY21VZ2FYTWdibThnZEhKaGJuTnNZWFJwYjI0Z1pHRjBZUzVnS1Z4dUlDQWdJQ0FnZlZ4dVhHNGdJQ0FnSUNCcFppQW9kSGx3Wlc5bUlIUm9hWE11YjNCMGFXOXVjeTVrWVhSaFczUm9hWE11YjNCMGFXOXVjeTVtWVd4c1ltRmphMHh2WTJGc1pWMGdJVDA5SUNkdlltcGxZM1FuS1NCN1hHNGdJQ0FnSUNBZ0lIUm9jbTkzSUc1bGR5QkZjbkp2Y2loZ0pIdE9RVTFGZlM0Z1ZHaGxJR1poYkd4aVlXTnJJR3h2WTJGc1pTQnRkWE4wSUc1bFkyVnpjMkZ5YVd4NUlHaGhkbVVnZEhKaGJuTnNZWFJwYjI0Z1pHRjBZUzVnS1Z4dUlDQWdJQ0FnZlZ4dVhHNGdJQ0FnSUNCMGFHbHpMbk5sZEV4dlkyRnNaU2gwYUdsekxtOXdkR2x2Ym5NdWJHOWpZV3hsTENCMGFHbHpMbTl3ZEdsdmJuTXVZWFYwYjBKcGJtUXBYRzRnSUNBZ2ZWeHVYRzRnSUNBZ2MzUmhkR2xqSUdkbGRDQjJaWEp6YVc5dUtDa2dlMXh1SUNBZ0lDQWdjbVYwZFhKdUlHQWtlMDVCVFVWOUxpUjdWa1ZTVTBsUFRuMWdYRzRnSUNBZ2ZWeHVYRzRnSUNBZ1oyVjBURzlqWVd4bEtDa2dlMXh1SUNBZ0lDQWdjbVYwZFhKdUlIUm9hWE11YjNCMGFXOXVjeTVzYjJOaGJHVmNiaUFnSUNCOVhHNWNiaUFnSUNCblpYUkdZV3hzWW1GamEweHZZMkZzWlNncElIdGNiaUFnSUNBZ0lISmxkSFZ5YmlCMGFHbHpMbTl3ZEdsdmJuTXVabUZzYkdKaFkydE1iMk5oYkdWY2JpQWdJQ0I5WEc1Y2JpQWdJQ0F2S2lwY2JpQWdJQ0FnS2lCVFpYUWdaR1ZtWVhWc2RDQnNiMk5oYkdWY2JpQWdJQ0FnS2lCQWNHRnlZVzBnZTNOMGNtbHVaMzBnYkc5allXeGxYRzRnSUNBZ0lDb2dRSEJoY21GdElIdGliMjlzWldGdWZTQmJkWEJrWVhSbFNGUk5URDEwY25WbFhWeHVJQ0FnSUNBcUwxeHVJQ0FnSUhObGRFeHZZMkZzWlNoc2IyTmhiR1VzSUhWd1pHRjBaVWhVVFV3Z1BTQjBjblZsS1NCN1hHNGdJQ0FnSUNCcFppQW9kSGx3Wlc5bUlIUm9hWE11YjNCMGFXOXVjeTVrWVhSaFcyeHZZMkZzWlYwZ0lUMDlJQ2R2WW1wbFkzUW5LU0I3WEc0Z0lDQWdJQ0FnSUdOdmJuTnZiR1V1WlhKeWIzSW9ZQ1I3VGtGTlJYMHVJQ1I3Ykc5allXeGxmU0JvWVhNZ2JtOGdaR0YwWVN3Z1ptRnNiR0poWTJzZ2FXNGdKSHQwYUdsekxtOXdkR2x2Ym5NdVptRnNiR0poWTJ0TWIyTmhiR1Y5TG1BcFhHNGdJQ0FnSUNCOUlHVnNjMlVnZTF4dUlDQWdJQ0FnSUNCMGFHbHpMbTl3ZEdsdmJuTXViRzlqWVd4bElEMGdiRzlqWVd4bFhHNGdJQ0FnSUNCOVhHNWNiaUFnSUNBZ0lHbG1JQ2gxY0dSaGRHVklWRTFNS1NCN1hHNGdJQ0FnSUNBZ0lIUm9hWE11ZFhCa1lYUmxTSFJ0YkNncFhHNGdJQ0FnSUNCOVhHNGdJQ0FnZlZ4dVhHNGdJQ0FnWjJWMFRHRnVaM1ZoWjJWektDa2dlMXh1SUNBZ0lDQWdjbVYwZFhKdUlFOWlhbVZqZEM1clpYbHpLSFJvYVhNdWIzQjBhVzl1Y3k1a1lYUmhLVnh1SUNBZ0lIMWNibHh1SUNBZ0lHbHVjMlZ5ZEZaaGJIVmxjeWgyWVd4MVpTQTlJRzUxYkd3c0lHbHVhbVZqZEdGaWJHVldZV3gxWlhNZ1BTQjdmU2tnZTF4dUlDQWdJQ0FnYVdZZ0tIUjVjR1Z2WmlCMllXeDFaU0FoUFQwZ0ozTjBjbWx1WnljcElIdGNiaUFnSUNBZ0lDQWdjbVYwZFhKdUlIVnVaR1ZtYVc1bFpGeHVJQ0FnSUNBZ2ZWeHVYRzRnSUNBZ0lDQmpiMjV6ZENCdFlYUmphQ0E5SUhaaGJIVmxMbTFoZEdOb0tDODZLRnRoTFhwQkxWb3RYekF0T1YwcktTOHBYRzRnSUNBZ0lDQnBaaUFvYldGMFkyZ3BJSHRjYmlBZ0lDQWdJQ0FnZG1Gc2RXVWdQU0IyWVd4MVpTNXlaWEJzWVdObEtHMWhkR05vV3pCZExDQnBibXBsWTNSaFlteGxWbUZzZFdWelcyMWhkR05vV3pGZFhTbGNiaUFnSUNBZ0lIMWNibHh1SUNBZ0lDQWdhV1lnS0haaGJIVmxMbTFoZEdOb0tDODZLRnRoTFhwQkxWb3RYekF0T1YwcktTOHBLU0I3WEc0Z0lDQWdJQ0FnSUhKbGRIVnliaUIwYUdsekxtbHVjMlZ5ZEZaaGJIVmxjeWgyWVd4MVpTd2dhVzVxWldOMFlXSnNaVlpoYkhWbGN5bGNiaUFnSUNBZ0lIMWNibHh1SUNBZ0lDQWdjbVYwZFhKdUlIWmhiSFZsWEc0Z0lDQWdmVnh1WEc0Z0lDQWdkSEpoYm5Oc1lYUmxLR3RsZVU1aGJXVWdQU0J1ZFd4c0xDQnBibXBsWTNRZ1BTQjdmU2tnZTF4dUlDQWdJQ0FnYkdWMElHUmhkR0VnUFNCMGFHbHpMbTl3ZEdsdmJuTXVaR0YwWVZ0MGFHbHpMbTl3ZEdsdmJuTXViRzlqWVd4bFhWeHVJQ0FnSUNBZ2FXWWdLQ0ZrWVhSaEtTQjdYRzRnSUNBZ0lDQWdJR1JoZEdFZ1BTQjBhR2x6TG05d2RHbHZibk11WkdGMFlWdDBhR2x6TG05d2RHbHZibk11Wm1Gc2JHSmhZMnRNYjJOaGJHVmRYRzRnSUNBZ0lDQjlYRzVjYmlBZ0lDQWdJR2xtSUNoclpYbE9ZVzFsSUQwOVBTQnVkV3hzSUh4OElHdGxlVTVoYldVZ1BUMDlJQ2NxSnlCOGZDQkJjbkpoZVM1cGMwRnljbUY1S0d0bGVVNWhiV1VwS1NCN1hHNGdJQ0FnSUNBZ0lHbG1JQ2hCY25KaGVTNXBjMEZ5Y21GNUtHdGxlVTVoYldVcEtTQjdYRzRnSUNBZ0lDQWdJQ0FnWTI5dWMzUWdhMlY1Y3lBOUlFOWlhbVZqZEM1clpYbHpLR1JoZEdFcExtWnBiSFJsY2loclpYa2dQVDRnYTJWNVRtRnRaUzVwYm1SbGVFOW1LR3RsZVNrZ1BpQXRNU2xjYmlBZ0lDQWdJQ0FnSUNCamIyNXpkQ0JtYVd4MFpYSmxaRVJoZEdFZ1BTQjdmVnh1SUNBZ0lDQWdJQ0FnSUd0bGVYTXVabTl5UldGamFDaHJaWGtnUFQ0Z2UxeHVJQ0FnSUNBZ0lDQWdJQ0FnWm1sc2RHVnlaV1JFWVhSaFcydGxlVjBnUFNCMGFHbHpMbWx1YzJWeWRGWmhiSFZsY3loa1lYUmhXMnRsZVYwc0lHbHVhbVZqZENsY2JpQWdJQ0FnSUNBZ0lDQjlLVnh1SUNBZ0lDQWdJQ0FnSUdSaGRHRWdQU0JtYVd4MFpYSmxaRVJoZEdGY2JpQWdJQ0FnSUNBZ2ZWeHVYRzRnSUNBZ0lDQWdJR052Ym5OMElHUmhkR0ZOWVhBZ1BTQjdmVnh1SUNBZ0lDQWdJQ0JtYjNJZ0tHTnZibk4wSUd0bGVTQnBiaUJrWVhSaEtTQjdYRzRnSUNBZ0lDQWdJQ0FnWkdGMFlVMWhjRnRyWlhsZElEMGdkR2hwY3k1cGJuTmxjblJXWVd4MVpYTW9aR0YwWVZ0clpYbGRMQ0JwYm1wbFkzUXBYRzRnSUNBZ0lDQWdJSDFjYmx4dUlDQWdJQ0FnSUNCeVpYUjFjbTRnWkdGMFlVMWhjRnh1SUNBZ0lDQWdmVnh1WEc0Z0lDQWdJQ0J5WlhSMWNtNGdkR2hwY3k1cGJuTmxjblJXWVd4MVpYTW9aR0YwWVZ0clpYbE9ZVzFsWFN3Z2FXNXFaV04wS1Z4dUlDQWdJSDFjYmx4dUlDQWdJQzh2SUdGc2FXRnpJRzltSUhRb0tWeHVJQ0FnSUhRb2EyVjVUbUZ0WlNBOUlHNTFiR3dzSUdsdWFtVmpkQ0E5SUh0OUtTQjdYRzRnSUNBZ0lDQnlaWFIxY200Z2RHaHBjeTUwY21GdWMyeGhkR1VvYTJWNVRtRnRaU3dnYVc1cVpXTjBLVnh1SUNBZ0lIMWNibHh1SUNBZ0lDOHFLbHh1SUNBZ0lDQXFJRlZ3WkdGMFpYTWdkR2hsSUVoVVRVd2dkbWxsZDNOY2JpQWdJQ0FnS2lCQWNHRnlZVzBnZTBoVVRVeEZiR1Z0Wlc1MGZTQmxiR1Z0Wlc1MFhHNGdJQ0FnSUNvdlhHNGdJQ0FnZFhCa1lYUmxTSFJ0YkNobGJHVnRaVzUwS1NCN1hHNGdJQ0FnSUNCcFppQW9kSGx3Wlc5bUlHVnNaVzFsYm5RZ1BUMDlJQ2QxYm1SbFptbHVaV1FuS1NCN1hHNGdJQ0FnSUNBZ0lHVnNaVzFsYm5RZ1BTQmtiMk4xYldWdWRDNXhkV1Z5ZVZObGJHVmpkRzl5UVd4c0tDZGJaR0YwWVMxcE1UaHVYU2NwWEc0Z0lDQWdJQ0I5WEc1Y2JpQWdJQ0FnSUdsbUlDaDBlWEJsYjJZZ1pXeGxiV1Z1ZENBOVBUMGdKM04wY21sdVp5Y3BJSHRjYmlBZ0lDQWdJQ0FnWld4bGJXVnVkQ0E5SUdSdlkzVnRaVzUwTG5GMVpYSjVVMlZzWldOMGIzSW9aV3hsYldWdWRDbGNiaUFnSUNBZ0lIMWNibHh1SUNBZ0lDQWdibVYzSUVKcGJtUmxjaWhsYkdWdFpXNTBMQ0IwYUdsekxuUW9LU2xjYmlBZ0lDQjlYRzVjYmlBZ0lDQXZMeUJ6ZEdGMGFXTmNiaUFnSUNCemRHRjBhV01nWDBSUFRVbHVkR1Z5Wm1GalpTaHZjSFJwYjI1ektTQjdYRzRnSUNBZ0lDQnlaWFIxY200Z2JtVjNJRWx1ZEd3b2IzQjBhVzl1Y3lsY2JpQWdJQ0I5WEc0Z0lIMWNibHh1SUNCeVpYUjFjbTRnU1c1MGJGeHVmU2tvS1Z4dVhHNWxlSEJ2Y25RZ1pHVm1ZWFZzZENCSmJuUnNYRzRpTENJdktpcGNiaUFxSUMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdFhHNGdLaUJNYVdObGJuTmxaQ0IxYm1SbGNpQk5TVlFnS0doMGRIQnpPaTh2WjJsMGFIVmlMbU52YlM5eGRXRnlheTFrWlhZdlVHaHZibTl1TFVaeVlXMWxkMjl5YXk5aWJHOWlMMjFoYzNSbGNpOU1TVU5GVGxORktWeHVJQ29nTFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMxY2JpQXFMMXh1WEc1cGJYQnZjblFnVUdGblpTQm1jbTl0SUNjdUwzQmhaMlVuWEc1cGJYQnZjblFnUlhabGJuUWdabkp2YlNBbkxpNHZMaTR2WTI5dGJXOXVMMlYyWlc1MGN5ZGNibHh1WTI5dWMzUWdVR0ZuWlhJZ1BTQW9LQ2tnUFQ0Z2UxeHVJQ0F2S2lwY2JpQWdJQ29nTFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0WEc0Z0lDQXFJRU52Ym5OMFlXNTBjMXh1SUNBZ0tpQXRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMWNiaUFnSUNvdlhHNWNiaUFnWTI5dWMzUWdUa0ZOUlNBOUlDZHdZV2RsY2lkY2JpQWdZMjl1YzNRZ1ZrVlNVMGxQVGlBOUlDY3lMakF1TUNkY2JpQWdZMjl1YzNRZ1JFVkdRVlZNVkY5UVVrOVFSVkpVU1VWVElEMGdlMXh1SUNBZ0lHaGhjMmhRY21WbWFYZzZJQ2NqSVNjc1hHNGdJQ0FnZFhObFNHRnphRG9nZEhKMVpTeGNiaUFnSUNCa1pXWmhkV3gwVUdGblpUb2diblZzYkN4Y2JpQWdJQ0JoYm1sdFlYUmxVR0ZuWlhNNklIUnlkV1VzWEc0Z0lIMWNibHh1SUNCc1pYUWdZM1Z5Y21WdWRGQmhaMlZjYmlBZ0x5b3FYRzRnSUNBcUlDMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExWeHVJQ0FnS2lCRGJHRnpjeUJFWldacGJtbDBhVzl1WEc0Z0lDQXFJQzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMVnh1SUNBZ0tpOWNibHh1SUNCamJHRnpjeUJRWVdkbGNpQjdYRzRnSUNBZ0x5b3FYRzRnSUNBZ0lDb2dRR052Ym5OMGNuVmpkRzl5WEc0Z0lDQWdJQ3BjYmlBZ0lDQWdLaUJBY0dGeVlXMGdiM0IwYVc5dWN5QjdUMkpxWldOMGZWeHVJQ0FnSUNBcUwxeHVJQ0FnSUdOdmJuTjBjblZqZEc5eUtHOXdkR2x2Ym5NZ1BTQjdmU2tnZTF4dUlDQWdJQ0FnZEdocGN5NXZjSFJwYjI1eklEMGdUMkpxWldOMExtRnpjMmxuYmloRVJVWkJWVXhVWDFCU1QxQkZVbFJKUlZNc0lHOXdkR2x2Ym5NcFhHNWNiaUFnSUNBZ0lIUm9hWE11Y0dGblpYTWdQU0JiWFZ4dUlDQWdJQ0FnZEdocGN5NXpkR0Z5ZEdWa0lEMGdabUZzYzJWY2JseHVJQ0FnSUNBZ0x5OGdZV1JrSUdkc2IySmhiQ0JzYVhOMFpXNWxjbk1nYzNWamFDQmhjMmdnYUdGemFDQmphR0Z1WjJVc0lHNWhkbWxuWVhScGIyNHNJR1YwWXk1Y2JpQWdJQ0FnSUhSb2FYTXVZV1JrVUdGblpYSkZkbVZ1ZEhNb0tWeHVYRzRnSUNBZ0lDQXZMeUJtWVhOMFpYSWdkMkY1SUhSdklHbHVhWFFnY0dGblpYTWdZbVZtYjNKbElIUm9aU0JFVDAwZ2FYTWdjbVZoWkhsY2JpQWdJQ0FnSUhSb2FYTXViMjVFVDAxTWIyRmtaV1FvS1Z4dUlDQWdJSDFjYmx4dUlDQWdJQzh2SUhCeWFYWmhkR1ZjYmlBZ0lDQmZLSE5sYkdWamRHOXlLU0I3WEc0Z0lDQWdJQ0J5WlhSMWNtNGdaRzlqZFcxbGJuUXVjWFZsY25sVFpXeGxZM1J2Y2loelpXeGxZM1J2Y2lsY2JpQWdJQ0I5WEc1Y2JpQWdJQ0JuWlhSSVlYTm9LQ2tnZTF4dUlDQWdJQ0FnY21WMGRYSnVJSGRwYm1SdmR5NXNiMk5oZEdsdmJpNW9ZWE5vTG5Od2JHbDBLSFJvYVhNdWIzQjBhVzl1Y3k1b1lYTm9VSEpsWm1sNEtWc3hYVnh1SUNBZ0lIMWNibHh1SUNBZ0lHZGxkRkJoWjJWR2NtOXRTR0Z6YUNncElIdGNiaUFnSUNBZ0lHTnZibk4wSUdoaGMyZ2dQU0IwYUdsekxtZGxkRWhoYzJnb0tWeHVJQ0FnSUNBZ1kyOXVjM1FnY21VZ1BTQnVaWGNnVW1WblJYaHdLQ2RiUDF4Y0wxMG9XMTVjWEM5ZEtpa25LVnh1SUNBZ0lDQWdZMjl1YzNRZ2JXRjBZMmhsY3lBOUlISmxMbVY0WldNb2FHRnphQ2xjYmx4dUlDQWdJQ0FnYVdZZ0tHMWhkR05vWlhNZ0ppWWdiV0YwWTJobGMxc3hYU2tnZTF4dUlDQWdJQ0FnSUNCeVpYUjFjbTRnYldGMFkyaGxjMXN4WFZ4dUlDQWdJQ0FnZlZ4dVhHNGdJQ0FnSUNCeVpYUjFjbTRnYm5Wc2JGeHVJQ0FnSUgxY2JseHVJQ0FnSUhObGRFaGhjMmdvY0dGblpVNWhiV1VwSUh0Y2JpQWdJQ0FnSUhkcGJtUnZkeTVzYjJOaGRHbHZiaTVvWVhOb0lEMGdZQ1I3ZEdocGN5NXZjSFJwYjI1ekxtaGhjMmhRY21WbWFYaDlMeVI3Y0dGblpVNWhiV1Y5WUZ4dUlDQWdJSDFjYmx4dUlDQWdJR0Z5WlZOaGJXVlFZV2RsS0hCaFoyVk9ZVzFsTVN3Z2NHRm5aVTVoYldVeUtTQjdYRzRnSUNBZ0lDQmpiMjV6ZENCd1lXZGxNU0E5SUhSb2FYTXVaMlYwVUdGblpVMXZaR1ZzS0hCaFoyVk9ZVzFsTVNsY2JpQWdJQ0FnSUdOdmJuTjBJSEJoWjJVeUlEMGdkR2hwY3k1blpYUlFZV2RsVFc5a1pXd29jR0ZuWlU1aGJXVXlLVnh1SUNBZ0lDQWdjbVYwZFhKdUlIQmhaMlV4SUNZbUlIQmhaMlV5SUNZbUlIQmhaMlV4TG01aGJXVWdQVDA5SUhCaFoyVXlMbTVoYldWY2JpQWdJQ0I5WEc1Y2JpQWdJQ0F2S2lwY2JpQWdJQ0FnS2lCQmRIUmhZMmhsY3lCMGFHVWdiV0ZwYmlCbGRtVnVkSE1nWm05eUlIUnlZV05yYVc1bklHaGhjMmdnWTJoaGJtZGxjeXhjYmlBZ0lDQWdLaUJqYkdsamF5QnZiaUJ1WVhacFoyRjBhVzl1SUdKMWRIUnZibk1nWVc1a0lHeHBibXR6SUdGdVpDQmlZV05ySUdocGMzUnZjbmxjYmlBZ0lDQWdLaTljYmlBZ0lDQmhaR1JRWVdkbGNrVjJaVzUwY3lncElIdGNiaUFnSUNBZ0lHUnZZM1Z0Wlc1MExtRmtaRVYyWlc1MFRHbHpkR1Z1WlhJb0oyTnNhV05ySnl3Z1pYWmxiblFnUFQ0Z2RHaHBjeTV2YmtOc2FXTnJLR1YyWlc1MEtTbGNiaUFnSUNBZ0lIZHBibVJ2ZHk1aFpHUkZkbVZ1ZEV4cGMzUmxibVZ5S0Nkd2IzQnpkR0YwWlNjc0lHVjJaVzUwSUQwK0lIUm9hWE11YjI1Q1lXTnJTR2x6ZEc5eWVTaGxkbVZ1ZENrcFhHNGdJQ0FnSUNCM2FXNWtiM2N1WVdSa1JYWmxiblJNYVhOMFpXNWxjaWduYUdGemFHTm9ZVzVuWlNjc0lHVjJaVzUwSUQwK0lIUm9hWE11YjI1SVlYTm9RMmhoYm1kbEtHVjJaVzUwS1NsY2JpQWdJQ0FnSUdSdlkzVnRaVzUwTG1Ga1pFVjJaVzUwVEdsemRHVnVaWElvSjBSUFRVTnZiblJsYm5STWIyRmtaV1FuTENCbGRtVnVkQ0E5UGlCMGFHbHpMbTl1UkU5TlRHOWhaR1ZrS0dWMlpXNTBLU2xjYmlBZ0lDQjlYRzVjYmlBZ0lDQXZMeUJuWlhSMFpYSnpYRzVjYmlBZ0lDQnpkR0YwYVdNZ1oyVjBJSFpsY25OcGIyNG9LU0I3WEc0Z0lDQWdJQ0J5WlhSMWNtNGdZQ1I3VGtGTlJYMHVKSHRXUlZKVFNVOU9mV0JjYmlBZ0lDQjlYRzVjYmlBZ0lDQXZMeUJ3ZFdKc2FXTmNibHh1SUNBZ0lITm9iM2RRWVdkbEtIQmhaMlZPWVcxbExDQmhaR1JVYjBocGMzUnZjbmtnUFNCMGNuVmxMQ0JpWVdOcklEMGdabUZzYzJVcElIdGNiaUFnSUNBZ0lHTnZibk4wSUc5c1pGQmhaMlVnUFNCMGFHbHpMbDhvSnk1amRYSnlaVzUwSnlsY2JpQWdJQ0FnSUdsbUlDaHZiR1JRWVdkbEtTQjdYRzRnSUNBZ0lDQWdJR052Ym5OMElHOXNaRkJoWjJWT1lXMWxJRDBnYjJ4a1VHRm5aUzVuWlhSQmRIUnlhV0oxZEdVb0oyUmhkR0V0Y0dGblpTY3BYRzVjYmlBZ0lDQWdJQ0FnYVdZZ0tIUm9hWE11WVhKbFUyRnRaVkJoWjJVb2NHRm5aVTVoYldVc0lHOXNaRkJoWjJWT1lXMWxLU2tnZTF4dUlDQWdJQ0FnSUNBZ0lISmxkSFZ5Ymx4dUlDQWdJQ0FnSUNCOVhHNWNiaUFnSUNBZ0lDQWdiMnhrVUdGblpTNWpiR0Z6YzB4cGMzUXVjbVZ0YjNabEtDZGpkWEp5Wlc1MEp5bGNibHh1SUNBZ0lDQWdJQ0F2THlCb2FYTjBiM0o1WEc0Z0lDQWdJQ0FnSUhkcGJtUnZkeTVvYVhOMGIzSjVMbkpsY0d4aFkyVlRkR0YwWlNoN0lIQmhaMlU2SUc5c1pGQmhaMlZPWVcxbElIMHNJRzlzWkZCaFoyVk9ZVzFsTENCM2FXNWtiM2N1Ykc5allYUnBiMjR1YUhKbFppbGNibHh1SUNBZ0lDQWdJQ0IwYUdsekxuUnlhV2RuWlhKUVlXZGxSWFpsYm5Rb2IyeGtVR0ZuWlU1aGJXVXNJRVYyWlc1MExraEpSRVVwWEc0Z0lDQWdJQ0I5WEc1Y2JpQWdJQ0FnSUhSb2FYTXVkSEpwWjJkbGNsQmhaMlZGZG1WdWRDaHdZV2RsVG1GdFpTd2dSWFpsYm5RdVUwaFBWeWxjYmx4dUlDQWdJQ0FnWTNWeWNtVnVkRkJoWjJVZ1BTQndZV2RsVG1GdFpWeHVYRzRnSUNBZ0lDQXZMeUJ1WlhjZ2NHRm5aVnh1SUNBZ0lDQWdZMjl1YzNRZ2JtVjNVR0ZuWlNBOUlIUm9hWE11WHloZ1cyUmhkR0V0Y0dGblpUMWNJaVI3Y0dGblpVNWhiV1Y5WENKZFlDbGNibHh1SUNBZ0lDQWdibVYzVUdGblpTNWpiR0Z6YzB4cGMzUXVZV1JrS0NkamRYSnlaVzUwSnlsY2JseHVJQ0FnSUNBZ0x5OGdkR1Z0Y0d4aGRHVWdiRzloWkdWeVhHNGdJQ0FnSUNCamIyNXpkQ0J3WVdkbFRXOWtaV3dnUFNCMGFHbHpMbWRsZEZCaFoyVk5iMlJsYkNod1lXZGxUbUZ0WlNsY2JseHVJQ0FnSUNBZ0x5OGdRSFJ2Wkc4NklIVnpaU0IwWlcxd2JHRjBaU0JqWVdOb1pUOWNiaUFnSUNBZ0lHbG1JQ2h3WVdkbFRXOWtaV3dnSmlZZ2NHRm5aVTF2WkdWc0xtZGxkRlJsYlhCc1lYUmxLQ2twSUh0Y2JpQWdJQ0FnSUNBZ2NHRm5aVTF2WkdWc0xteHZZV1JVWlcxd2JHRjBaU2dwWEc0Z0lDQWdJQ0I5WEc0Z0lDQWdJQ0F2THlCbGJtUmNibHh1SUNBZ0lDQWdhV1lnS0c5c1pGQmhaMlVwSUh0Y2JpQWdJQ0FnSUNBZ1kyOXVjM1FnYjJ4a1VHRm5aVTVoYldVZ1BTQnZiR1JRWVdkbExtZGxkRUYwZEhKcFluVjBaU2duWkdGMFlTMXdZV2RsSnlsY2JpQWdJQ0FnSUNBZ0x5OGdkWE5sSUc5bUlIQnliM1J2ZEhsd1pTMXZjbWxsYm5SbFpDQnNZVzVuZFdGblpWeHVJQ0FnSUNBZ0lDQnZiR1JRWVdkbExtSmhZMnNnUFNCaVlXTnJYRzRnSUNBZ0lDQWdJRzlzWkZCaFoyVXVjSEpsZG1sdmRYTlFZV2RsVG1GdFpTQTlJRzlzWkZCaFoyVk9ZVzFsWEc1Y2JpQWdJQ0FnSUNBZ1kyOXVjM1FnYjI1UVlXZGxRVzVwYldGMGFXOXVSVzVrSUQwZ0tDa2dQVDRnZTF4dUlDQWdJQ0FnSUNBZ0lHbG1JQ2h2YkdSUVlXZGxMbU5zWVhOelRHbHpkQzVqYjI1MFlXbHVjeWduWVc1cGJXRjBaU2NwS1NCN1hHNGdJQ0FnSUNBZ0lDQWdJQ0J2YkdSUVlXZGxMbU5zWVhOelRHbHpkQzV5WlcxdmRtVW9KMkZ1YVcxaGRHVW5LVnh1SUNBZ0lDQWdJQ0FnSUgxY2JseHVJQ0FnSUNBZ0lDQWdJRzlzWkZCaFoyVXVZMnhoYzNOTWFYTjBMbkpsYlc5MlpTaHZiR1JRWVdkbExtSmhZMnNnUHlBbmNHOXdMWEJoWjJVbklEb2dKM0IxYzJndGNHRm5aU2NwWEc1Y2JpQWdJQ0FnSUNBZ0lDQjBhR2x6TG5SeWFXZG5aWEpRWVdkbFJYWmxiblFvWTNWeWNtVnVkRkJoWjJVc0lFVjJaVzUwTGxOSVQxZE9LVnh1SUNBZ0lDQWdJQ0FnSUhSb2FYTXVkSEpwWjJkbGNsQmhaMlZGZG1WdWRDaHZiR1JRWVdkbExuQnlaWFpwYjNWelVHRm5aVTVoYldVc0lFVjJaVzUwTGtoSlJFUkZUaWxjYmx4dUlDQWdJQ0FnSUNBZ0lHOXNaRkJoWjJVdWNtVnRiM1psUlhabGJuUk1hWE4wWlc1bGNpaEZkbVZ1ZEM1QlRrbE5RVlJKVDA1ZlJVNUVMQ0J2YmxCaFoyVkJibWx0WVhScGIyNUZibVFwWEc0Z0lDQWdJQ0FnSUgxY2JseHVJQ0FnSUNBZ0lDQnBaaUFvZEdocGN5NXZjSFJwYjI1ekxtRnVhVzFoZEdWUVlXZGxjeWtnZTF4dUlDQWdJQ0FnSUNBZ0lHOXNaRkJoWjJVdVlXUmtSWFpsYm5STWFYTjBaVzVsY2loRmRtVnVkQzVCVGtsTlFWUkpUMDVmUlU1RUxDQnZibEJoWjJWQmJtbHRZWFJwYjI1RmJtUXBYRzRnSUNBZ0lDQWdJQ0FnYjJ4a1VHRm5aUzVqYkdGemMweHBjM1F1WVdSa0tDZGhibWx0WVhSbEp5bGNiaUFnSUNBZ0lDQWdmU0JsYkhObElIdGNiaUFnSUNBZ0lDQWdJQ0J2YmxCaFoyVkJibWx0WVhScGIyNUZibVFvS1Z4dUlDQWdJQ0FnSUNCOVhHNWNiaUFnSUNBZ0lDQWdiMnhrVUdGblpTNWpiR0Z6YzB4cGMzUXVZV1JrS0dKaFkyc2dQeUFuY0c5d0xYQmhaMlVuSURvZ0ozQjFjMmd0Y0dGblpTY3BYRzRnSUNBZ0lDQjlYRzRnSUNBZ2ZWeHVYRzRnSUNBZ1lXUmtWVzVwY1hWbFVHRm5aVTF2WkdWc0tIQmhaMlZPWVcxbEtTQjdYRzRnSUNBZ0lDQnBaaUFvSVhSb2FYTXVaMlYwVUdGblpVMXZaR1ZzS0hCaFoyVk9ZVzFsS1NrZ2UxeHVJQ0FnSUNBZ0lDQjBhR2x6TG5CaFoyVnpMbkIxYzJnb2JtVjNJRkJoWjJVb2NHRm5aVTVoYldVcEtWeHVJQ0FnSUNBZ2ZWeHVJQ0FnSUgxY2JseHVJQ0FnSUdkbGRGQmhaMlZOYjJSbGJDaHdZV2RsVG1GdFpTa2dlMXh1SUNBZ0lDQWdjbVYwZFhKdUlIUm9hWE11Y0dGblpYTXVabWx1WkNod1lXZGxJRDArSUhCaFoyVXVibUZ0WlNBOVBUMGdjR0ZuWlU1aGJXVXBYRzRnSUNBZ2ZWeHVYRzRnSUNBZ1oyVjBVR0ZuWlhOTmIyUmxiQ2h3WVdkbFRtRnRaWE1wSUh0Y2JpQWdJQ0FnSUhKbGRIVnliaUIwYUdsekxuQmhaMlZ6TG1acGJIUmxjaWh3WVdkbElEMCtJSEJoWjJWT1lXMWxjeTVwYm1SbGVFOW1LSEJoWjJVdWJtRnRaU2tnUGlBdE1TbGNiaUFnSUNCOVhHNWNiaUFnSUNCelpXeGxZM1J2Y2xSdlFYSnlZWGtvYzNSeUtTQjdYRzRnSUNBZ0lDQnlaWFIxY200Z2MzUnlMbk53YkdsMEtDY3NKeWt1YldGd0tHbDBaVzBnUFQ0Z2FYUmxiUzUwY21sdEtDa3BYRzRnSUNBZ2ZWeHVYRzRnSUNBZ1lXUmtSWFpsYm5SektHTmhiR3hpWVdOcktTQjdYRzRnSUNBZ0lDQnBaaUFvZEdocGN5NWpZV05vWlZCaFoyVlRaV3hsWTNSdmNpQTlQVDBnSnlvbktTQjdYRzRnSUNBZ0lDQWdJQzh2SUdGa1pDQjBieUJoYkd3Z2NHRm5aU0J0YjJSbGJITmNiaUFnSUNBZ0lDQWdkR2hwY3k1d1lXZGxjeTVtYjNKRllXTm9LQ2h3WVdkbEtTQTlQaUI3WEc0Z0lDQWdJQ0FnSUNBZ2NHRm5aUzVoWkdSRmRtVnVkRU5oYkd4aVlXTnJLR05oYkd4aVlXTnJLVnh1SUNBZ0lDQWdJQ0I5S1Z4dUlDQWdJQ0FnSUNCeVpYUjFjbTVjYmlBZ0lDQWdJSDFjYmx4dUlDQWdJQ0FnWTI5dWMzUWdjR0ZuWlUxdlpHVnNjeUE5SUhSb2FYTXVaMlYwVUdGblpYTk5iMlJsYkNoMGFHbHpMbk5sYkdWamRHOXlWRzlCY25KaGVTaDBhR2x6TG1OaFkyaGxVR0ZuWlZObGJHVmpkRzl5S1N3Z2RISjFaU2xjYmlBZ0lDQWdJSEJoWjJWTmIyUmxiSE11Wm05eVJXRmphQ2dvY0dGblpTa2dQVDRnZTF4dUlDQWdJQ0FnSUNCd1lXZGxMbUZrWkVWMlpXNTBRMkZzYkdKaFkyc29ZMkZzYkdKaFkyc3BYRzRnSUNBZ0lDQjlLVnh1SUNBZ0lDQWdkR2hwY3k1allXTm9aVkJoWjJWVFpXeGxZM1J2Y2lBOUlHNTFiR3hjYmlBZ0lDQjlYRzVjYmlBZ0lDQjFjMlZVWlcxd2JHRjBaU2gwWlcxd2JHRjBaVkJoZEdnc0lISmxibVJsY2taMWJtTjBhVzl1SUQwZ2JuVnNiQ2tnZTF4dUlDQWdJQ0FnWTI5dWMzUWdjR0ZuWlUxdlpHVnNjeUE5SUhSb2FYTXVaMlYwVUdGblpYTk5iMlJsYkNoMGFHbHpMbk5sYkdWamRHOXlWRzlCY25KaGVTaDBhR2x6TG1OaFkyaGxVR0ZuWlZObGJHVmpkRzl5S1N3Z2RISjFaU2xjYmlBZ0lDQWdJSEJoWjJWTmIyUmxiSE11Wm05eVJXRmphQ2dvY0dGblpTa2dQVDRnZTF4dUlDQWdJQ0FnSUNCd1lXZGxMblZ6WlZSbGJYQnNZWFJsS0hSbGJYQnNZWFJsVUdGMGFDbGNiaUFnSUNBZ0lDQWdhV1lnS0hSNWNHVnZaaUJ5Wlc1a1pYSkdkVzVqZEdsdmJpQTlQVDBnSjJaMWJtTjBhVzl1SnlrZ2UxeHVJQ0FnSUNBZ0lDQWdJSEJoWjJVdWRYTmxWR1Z0Y0d4aGRHVlNaVzVrWlhKbGNpaHlaVzVrWlhKR2RXNWpkR2x2YmlsY2JpQWdJQ0FnSUNBZ2ZWeHVJQ0FnSUNBZ2ZTbGNiaUFnSUNBZ0lIUm9hWE11WTJGamFHVlFZV2RsVTJWc1pXTjBiM0lnUFNCdWRXeHNYRzRnSUNBZ2ZWeHVYRzRnSUNBZ2RISnBaMmRsY2xCaFoyVkZkbVZ1ZENod1lXZGxUbUZ0WlN3Z1pYWmxiblJPWVcxbExDQmxkbVZ1ZEZCaGNtRnRjeUE5SUc1MWJHd3BJSHRjYmlBZ0lDQWdJR052Ym5OMElIQmhaMlZOYjJSbGJDQTlJSFJvYVhNdVoyVjBVR0ZuWlUxdlpHVnNLSEJoWjJWT1lXMWxLVnh1SUNBZ0lDQWdhV1lnS0hCaFoyVk5iMlJsYkNrZ2UxeHVJQ0FnSUNBZ0lDQndZV2RsVFc5a1pXd3VkSEpwWjJkbGNsTmpiM0JsY3lobGRtVnVkRTVoYldVc0lHVjJaVzUwVUdGeVlXMXpLVnh1SUNBZ0lDQWdmVnh1SUNBZ0lIMWNibHh1SUNBZ0lHOXVRMnhwWTJzb1pYWmxiblFwSUh0Y2JpQWdJQ0FnSUdOdmJuTjBJSEJoWjJWT1lXMWxJRDBnWlhabGJuUXVkR0Z5WjJWMExtZGxkRUYwZEhKcFluVjBaU2duWkdGMFlTMXVZWFpwWjJGMFpTY3BYRzRnSUNBZ0lDQmpiMjV6ZENCd2RYTm9VR0ZuWlNBOUlDRW9aWFpsYm5RdWRHRnlaMlYwTG1kbGRFRjBkSEpwWW5WMFpTZ25aR0YwWVMxd2IzQXRjR0ZuWlNjcElEMDlQU0FuZEhKMVpTY3BYRzVjYmlBZ0lDQWdJR2xtSUNod1lXZGxUbUZ0WlNrZ2UxeHVJQ0FnSUNBZ0lDQnBaaUFvY0dGblpVNWhiV1VnUFQwOUlDY2tZbUZqYXljcElIdGNiaUFnSUNBZ0lDQWdJQ0F2THlCMGFHVWdjRzl3YzNSaGRHVWdaWFpsYm5RZ2QybHNiQ0JpWlNCMGNtbG5aMlZ5WldSY2JpQWdJQ0FnSUNBZ0lDQjNhVzVrYjNjdWFHbHpkRzl5ZVM1aVlXTnJLQ2xjYmlBZ0lDQWdJQ0FnSUNCeVpYUjFjbTVjYmlBZ0lDQWdJQ0FnZlZ4dVhHNGdJQ0FnSUNBZ0lDOHFYRzRnSUNBZ0lDQWdJQ0FxSUVsbUlIZGxJR2hsSUhWelpTQjBhR1VnYUdGemFDQmhjeUIwY21sbloyVnlMRnh1SUNBZ0lDQWdJQ0FnS2lCM1pTQmphR0Z1WjJVZ2FYUWdaSGx1WVcxcFkyRnNiSGtnYzI4Z2RHaGhkQ0IwYUdVZ2FHRnphR05vWVc1blpTQmxkbVZ1ZENCcGN5QmpZV3hzWldSY2JpQWdJQ0FnSUNBZ0lDb2dUM1JvWlhKM2FYTmxMQ0IzWlNCemFHOTNJSFJvWlNCd1lXZGxYRzRnSUNBZ0lDQWdJQ0FxTDF4dUlDQWdJQ0FnSUNCcFppQW9kR2hwY3k1dmNIUnBiMjV6TG5WelpVaGhjMmdwSUh0Y2JpQWdJQ0FnSUNBZ0lDQjBhR2x6TG5ObGRFaGhjMmdvY0dGblpVNWhiV1VwWEc0Z0lDQWdJQ0FnSUgwZ1pXeHpaU0I3WEc0Z0lDQWdJQ0FnSUNBZ2RHaHBjeTV6YUc5M1VHRm5aU2h3WVdkbFRtRnRaU3dnZEhKMVpTd2djSFZ6YUZCaFoyVXBYRzRnSUNBZ0lDQWdJSDFjYmlBZ0lDQWdJSDFjYmlBZ0lDQjlYRzVjYmlBZ0lDQnZia0poWTJ0SWFYTjBiM0o1S0dWMlpXNTBJRDBnZTMwcElIdGNiaUFnSUNBZ0lHTnZibk4wSUhCaFoyVk9ZVzFsSUQwZ1pYWmxiblF1YzNSaGRHVWdQeUJsZG1WdWRDNXpkR0YwWlM1d1lXZGxJRG9nYm5Wc2JGeHVJQ0FnSUNBZ2FXWWdLQ0Z3WVdkbFRtRnRaU2tnZTF4dUlDQWdJQ0FnSUNCeVpYUjFjbTVjYmlBZ0lDQWdJSDFjYmx4dUlDQWdJQ0FnZEdocGN5NXphRzkzVUdGblpTaHdZV2RsVG1GdFpTd2dkSEoxWlN3Z2RISjFaU2xjYmlBZ0lDQjlYRzVjYmlBZ0lDQnZia2hoYzJoRGFHRnVaMlVvS1NCN1hHNGdJQ0FnSUNCamIyNXpkQ0J3WVhKaGJYTWdQU0FvZEdocGN5NW5aWFJJWVhOb0tDa2dQeUIwYUdsekxtZGxkRWhoYzJnb0tTNXpjR3hwZENnbkx5Y3BJRG9nVzEwcExtWnBiSFJsY2lod0lEMCtJSEF1YkdWdVozUm9JRDRnTUNsY2JpQWdJQ0FnSUdsbUlDaHdZWEpoYlhNdWJHVnVaM1JvSUQ0Z01Da2dlMXh1SUNBZ0lDQWdJQ0F2THlCeVpXMXZkbVVnWm1seWMzUWdkbUZzZFdVZ2QyaHBZMmdnYVhNZ2RHaGxJSEJoWjJVZ2JtRnRaVnh1SUNBZ0lDQWdJQ0J3WVhKaGJYTXVjMmhwWm5Rb0tWeHVJQ0FnSUNBZ2ZWeHVYRzRnSUNBZ0lDQjBhR2x6TG5SeWFXZG5aWEpRWVdkbFJYWmxiblFvWTNWeWNtVnVkRkJoWjJVc0lFVjJaVzUwTGtoQlUwZ3NJSEJoY21GdGN5bGNibHh1SUNBZ0lDQWdZMjl1YzNRZ2JtRjJVR0ZuWlNBOUlIUm9hWE11WjJWMFVHRm5aVVp5YjIxSVlYTm9LQ2xjYmlBZ0lDQWdJR2xtSUNodVlYWlFZV2RsS1NCN1hHNGdJQ0FnSUNBZ0lIUm9hWE11YzJodmQxQmhaMlVvYm1GMlVHRm5aU2xjYmlBZ0lDQWdJSDFjYmlBZ0lDQjlYRzVjYmlBZ0lDQXZLaXBjYmlBZ0lDQWdLaUJSZFdWeWFXVnpJSFJvWlNCd1lXZGxJRzV2WkdWeklHbHVJSFJvWlNCRVQwMWNiaUFnSUNBZ0tpOWNiaUFnSUNCdmJrUlBUVXh2WVdSbFpDZ3BJSHRjYmlBZ0lDQWdJR052Ym5OMElIQmhaMlZ6SUQwZ1pHOWpkVzFsYm5RdWNYVmxjbmxUWld4bFkzUnZja0ZzYkNnblcyUmhkR0V0Y0dGblpWMG5LVnh1WEc0Z0lDQWdJQ0JwWmlBb0lYQmhaMlZ6S1NCN1hHNGdJQ0FnSUNBZ0lISmxkSFZ5Ymx4dUlDQWdJQ0FnZlZ4dVhHNGdJQ0FnSUNCd1lXZGxjeTVtYjNKRllXTm9LQ2h3WVdkbEtTQTlQaUI3WEc0Z0lDQWdJQ0FnSUd4bGRDQndZV2RsVG1GdFpTQTlJSEJoWjJVdVoyVjBRWFIwY21saWRYUmxLQ2RrWVhSaExYQmhaMlVuS1Z4dUlDQWdJQ0FnSUNBdktseHVJQ0FnSUNBZ0lDQWdLaUIwYUdVZ2NHRm5aU0J1WVcxbElHTmhiaUJpWlNCbmFYWmxiaUIzYVhSb0lIUm9aU0JoZEhSeWFXSjFkR1VnWkdGMFlTMXdZV2RsWEc0Z0lDQWdJQ0FnSUNBcUlHOXlJSGRwZEdnZ2FYUnpJRzV2WkdVZ2JtRnRaVnh1SUNBZ0lDQWdJQ0FnS2k5Y2JpQWdJQ0FnSUNBZ2FXWWdLQ0Z3WVdkbFRtRnRaU2tnZTF4dUlDQWdJQ0FnSUNBZ0lIQmhaMlZPWVcxbElEMGdjR0ZuWlM1dWIyUmxUbUZ0WlZ4dUlDQWdJQ0FnSUNCOVhHNWNiaUFnSUNBZ0lDQWdkR2hwY3k1aFpHUlZibWx4ZFdWUVlXZGxUVzlrWld3b2NHRm5aVTVoYldVcFhHNGdJQ0FnSUNCOUtWeHVJQ0FnSUgxY2JseHVJQ0FnSUhObGJHVmpkQ2h3WVdkbFRtRnRaU3dnWVdSa1VHRm5aVTF2WkdWc0lEMGdkSEoxWlNrZ2UxeHVJQ0FnSUNBZ2RHaHBjeTVqWVdOb1pWQmhaMlZUWld4bFkzUnZjaUE5SUhCaFoyVk9ZVzFsWEc1Y2JpQWdJQ0FnSUdsbUlDaGhaR1JRWVdkbFRXOWtaV3dnSmlZZ2NHRm5aVTVoYldVZ0lUMDlJQ2NxSnlrZ2UxeHVJQ0FnSUNBZ0lDQjBhR2x6TG1Ga1pGVnVhWEYxWlZCaFoyVk5iMlJsYkNod1lXZGxUbUZ0WlNsY2JpQWdJQ0FnSUgxY2JseHVJQ0FnSUNBZ2NtVjBkWEp1SUhSb2FYTmNiaUFnSUNCOVhHNWNiaUFnSUNCemRHRnlkQ2htYjNKalpVUmxabUYxYkhSUVlXZGxJRDBnWm1Gc2MyVXBJSHRjYmlBZ0lDQWdJQzh2SUdOb1pXTnJJR2xtSUhSb1pTQmhjSEFnYUdGeklHSmxaVzRnWVd4eVpXRmtlU0J6ZEdGeWRHVmtYRzRnSUNBZ0lDQnBaaUFvZEdocGN5NXpkR0Z5ZEdWa0tTQjdYRzRnSUNBZ0lDQWdJSFJvY205M0lHNWxkeUJGY25KdmNpaGdKSHRPUVUxRmZTNGdWR2hsSUdGd2NDQm9ZWE1nWW1WbGJpQmhiSEpsWVdSNUlITjBZWEowWldRdVlDbGNiaUFnSUNBZ0lIMWNibHh1SUNBZ0lDQWdkR2hwY3k1emRHRnlkR1ZrSUQwZ2RISjFaVnh1WEc0Z0lDQWdJQ0F2THlCbWIzSmpaU0JrWldaaGRXeDBJSEJoWjJVZ2IyNGdRMjl5Wkc5MllWeHVJQ0FnSUNBZ2FXWWdLSGRwYm1SdmR5NWpiM0prYjNaaEtTQjdYRzRnSUNBZ0lDQWdJR1p2Y21ObFJHVm1ZWFZzZEZCaFoyVWdQU0IwY25WbFhHNGdJQ0FnSUNCOVhHNWNiaUFnSUNBZ0lHeGxkQ0J3WVdkbFRtRnRaU0E5SUhSb2FYTXVaMlYwVUdGblpVWnliMjFJWVhOb0tDbGNiaUFnSUNBZ0lHbG1JQ2doZEdocGN5NW5aWFJRWVdkbFRXOWtaV3dvY0dGblpVNWhiV1VwS1NCN1hHNGdJQ0FnSUNBZ0lIQmhaMlZPWVcxbElEMGdkR2hwY3k1dmNIUnBiMjV6TG1SbFptRjFiSFJRWVdkbFhHNGdJQ0FnSUNCOVhHNWNiaUFnSUNBZ0lHbG1JQ2htYjNKalpVUmxabUYxYkhSUVlXZGxJQ1ltSUNGMGFHbHpMbTl3ZEdsdmJuTXVaR1ZtWVhWc2RGQmhaMlVwSUh0Y2JpQWdJQ0FnSUNBZ2RHaHliM2NnYm1WM0lFVnljbTl5S0dBa2UwNUJUVVY5TGlCVWFHVWdaR1ZtWVhWc2RDQndZV2RsSUcxMWMzUWdaWGhwYzNRZ1ptOXlJR1p2Y21OcGJtY2dhWFJ6SUd4aGRXNWphQ0ZnS1Z4dUlDQWdJQ0FnZlZ4dVhHNGdJQ0FnSUNBdktseHVJQ0FnSUNBZ0lDb2dhV1lnZEdobElHRndjQ0JwY3lCamIyNW1hV2QxY21GMFpXUWdkRzhnZFhObElHaGhjMmdnZEhKaFkydHBibWRjYmlBZ0lDQWdJQ0FxSUhkbElHRmtaQ0IwYUdVZ2NHRm5aU0JrZVc1aGJXbGpZV3hzZVNCcGJpQjBhR1VnZFhKc1hHNGdJQ0FnSUNBZ0tpOWNiaUFnSUNBZ0lHbG1JQ2gwYUdsekxtOXdkR2x2Ym5NdWRYTmxTR0Z6YUNrZ2UxeHVJQ0FnSUNBZ0lDQjBhR2x6TG5ObGRFaGhjMmdvY0dGblpVNWhiV1VwWEc0Z0lDQWdJQ0I5WEc1Y2JpQWdJQ0FnSUhSb2FYTXVjMmh2ZDFCaFoyVW9abTl5WTJWRVpXWmhkV3gwVUdGblpTQS9JSFJvYVhNdWIzQjBhVzl1Y3k1a1pXWmhkV3gwVUdGblpTQTZJSEJoWjJWT1lXMWxLVnh1SUNBZ0lIMWNibHh1SUNBZ0lDOHZJSE4wWVhScFkxeHVJQ0FnSUhOMFlYUnBZeUJmUkU5TlNXNTBaWEptWVdObEtHOXdkR2x2Ym5NcElIdGNiaUFnSUNBZ0lISmxkSFZ5YmlCdVpYY2dVR0ZuWlhJb2IzQjBhVzl1Y3lsY2JpQWdJQ0I5WEc0Z0lIMWNibHh1SUNCeVpYUjFjbTRnVUdGblpYSmNibjBwS0NsY2JseHVaWGh3YjNKMElHUmxabUYxYkhRZ1VHRm5aWEpjYmlJc0lpOHFLbHh1SUNvZ0xTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMWNiaUFxSUV4cFkyVnVjMlZrSUhWdVpHVnlJRTFKVkNBb2FIUjBjSE02THk5bmFYUm9kV0l1WTI5dEwzRjFZWEpyTFdSbGRpOVFhRzl1YjI0dFJuSmhiV1YzYjNKckwySnNiMkl2YldGemRHVnlMMHhKUTBWT1UwVXBYRzRnS2lBdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExWeHVJQ292WEc1Y2JtbHRjRzl5ZENCN0lHeHZZV1JHYVd4bElIMGdabkp2YlNBbkxpNHZMaTR2WTI5dGJXOXVMM1YwYVd4ekoxeHVhVzF3YjNKMElIc2daR2x6Y0dGMFkyaFFZV2RsUlhabGJuUWdmU0JtY205dElDY3VMaTh1TGk5amIyMXRiMjR2WlhabGJuUnpMMlJwYzNCaGRHTm9KMXh1WEc1amIyNXpkQ0JRWVdkbElEMGdLQ2dwSUQwK0lIdGNiaUFnTHlvcVhHNGdJQ0FxSUMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFZ4dUlDQWdLaUJEYjI1emRHRnVkSE5jYmlBZ0lDb2dMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRYRzRnSUNBcUwxeHVYRzRnSUdOdmJuTjBJRTVCVFVVZ1BTQW5jR0ZuWlNkY2JpQWdZMjl1YzNRZ1ZrVlNVMGxQVGlBOUlDY3lMakF1TUNkY2JseHVJQ0JqYjI1emRDQlVSVTFRVEVGVVJWOVRSVXhGUTFSUFVpQTlJQ2RiWkdGMFlTMTBaVzF3YkdGMFpWMG5YRzVjYmlBZ0x5b3FYRzRnSUNBcUlDMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExWeHVJQ0FnS2lCRGJHRnpjeUJFWldacGJtbDBhVzl1WEc0Z0lDQXFJQzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMVnh1SUNBZ0tpOWNibHh1SUNCamJHRnpjeUJRWVdkbElIdGNiaUFnSUNBdktpcGNiaUFnSUNBZ0tpQkRjbVZoZEdWeklHRnVJR2x1YzNSaGJtTmxJRzltSUZCaFoyVXVYRzRnSUNBZ0lDb2dRSEJoY21GdElIdHpkSEpwYm1kOUlIQmhaMlZPWVcxbFhHNGdJQ0FnSUNvdlhHNGdJQ0FnWTI5dWMzUnlkV04wYjNJb2NHRm5aVTVoYldVcElIdGNiaUFnSUNBZ0lIUm9hWE11Ym1GdFpTQTlJSEJoWjJWT1lXMWxYRzRnSUNBZ0lDQjBhR2x6TG1WMlpXNTBjeUE5SUZ0ZFhHNGdJQ0FnSUNCMGFHbHpMblJsYlhCc1lYUmxVR0YwYUNBOUlHNTFiR3hjYmlBZ0lDQWdJSFJvYVhNdWNtVnVaR1Z5Um5WdVkzUnBiMjRnUFNCdWRXeHNYRzRnSUNBZ2ZWeHVYRzRnSUNBZ0x5OGdaMlYwZEdWeWMxeHVYRzRnSUNBZ2MzUmhkR2xqSUdkbGRDQjJaWEp6YVc5dUtDa2dlMXh1SUNBZ0lDQWdjbVYwZFhKdUlHQWtlMDVCVFVWOUxpUjdWa1ZTVTBsUFRuMWdYRzRnSUNBZ2ZWeHVYRzRnSUNBZ0x5b3FYRzRnSUNBZ0lDb2dSMlYwSUdWMlpXNTBjMXh1SUNBZ0lDQXFJRUJ5WlhSMWNtNXpJSHRHZFc1amRHbHZibHRkZlZ4dUlDQWdJQ0FxTDF4dUlDQWdJR2RsZEVWMlpXNTBjeWdwSUh0Y2JpQWdJQ0FnSUhKbGRIVnliaUIwYUdsekxtVjJaVzUwYzF4dUlDQWdJSDFjYmx4dUlDQWdJQzhxS2x4dUlDQWdJQ0FxSUVkbGRDQjBaVzF3YkdGMFpWeHVJQ0FnSUNBcUlFQnlaWFIxY201eklIdHpkSEpwYm1kOVhHNGdJQ0FnSUNvdlhHNGdJQ0FnWjJWMFZHVnRjR3hoZEdVb0tTQjdYRzRnSUNBZ0lDQnlaWFIxY200Z2RHaHBjeTUwWlcxd2JHRjBaVkJoZEdoY2JpQWdJQ0I5WEc1Y2JpQWdJQ0F2S2lwY2JpQWdJQ0FnS2lCSFpYUWdjbVZ1WkdWeUlHWjFibU4wYVc5dVhHNGdJQ0FnSUNvZ1FISmxkSFZ5Ym5NZ2UwWjFibU4wYVc5dWZWeHVJQ0FnSUNBcUwxeHVJQ0FnSUdkbGRGSmxibVJsY2taMWJtTjBhVzl1S0NrZ2UxeHVJQ0FnSUNBZ2NtVjBkWEp1SUhSb2FYTXVjbVZ1WkdWeVJuVnVZM1JwYjI1Y2JpQWdJQ0I5WEc1Y2JpQWdJQ0JzYjJGa1ZHVnRjR3hoZEdVb0tTQjdYRzRnSUNBZ0lDQmpiMjV6ZENCd1lXZGxSV3hsYldWdWRDQTlJR1J2WTNWdFpXNTBMbkYxWlhKNVUyVnNaV04wYjNJb1lGdGtZWFJoTFhCaFoyVTlYQ0lrZTNSb2FYTXVibUZ0WlgxY0lsMWdLVnh1WEc0Z0lDQWdJQ0JzYjJGa1JtbHNaU2gwYUdsekxtZGxkRlJsYlhCc1lYUmxLQ2tzSUNoMFpXMXdiR0YwWlNrZ1BUNGdlMXh1SUNBZ0lDQWdJQ0JzWlhRZ2NtVnVaR1Z5SUQwZ1puVnVZM1JwYjI0Z0tFUlBUVkJoWjJVc0lIUmxiWEJzWVhSbExDQmxiR1Z0Wlc1MGN5a2dlMXh1SUNBZ0lDQWdJQ0FnSUdsbUlDaGxiR1Z0Wlc1MGN5a2dlMXh1SUNBZ0lDQWdJQ0FnSUNBZ1FYSnlZWGt1Wm5KdmJTaGxiR1Z0Wlc1MGN5a3VabTl5UldGamFDZ29aV3dwSUQwK0lIdGNiaUFnSUNBZ0lDQWdJQ0FnSUNBZ1pXd3VhVzV1WlhKSVZFMU1JRDBnZEdWdGNHeGhkR1ZjYmlBZ0lDQWdJQ0FnSUNBZ0lIMHBYRzRnSUNBZ0lDQWdJQ0FnZlNCbGJITmxJSHRjYmlBZ0lDQWdJQ0FnSUNBZ0lFUlBUVkJoWjJVdWFXNXVaWEpJVkUxTUlEMGdkR1Z0Y0d4aGRHVmNiaUFnSUNBZ0lDQWdJQ0I5WEc0Z0lDQWdJQ0FnSUgxY2JseHVJQ0FnSUNBZ0lDQnBaaUFvZEdocGN5NW5aWFJTWlc1a1pYSkdkVzVqZEdsdmJpZ3BLU0I3WEc0Z0lDQWdJQ0FnSUNBZ2NtVnVaR1Z5SUQwZ2RHaHBjeTVuWlhSU1pXNWtaWEpHZFc1amRHbHZiaWdwWEc0Z0lDQWdJQ0FnSUgxY2JseHVJQ0FnSUNBZ0lDQnlaVzVrWlhJb2NHRm5aVVZzWlcxbGJuUXNJSFJsYlhCc1lYUmxMQ0J3WVdkbFJXeGxiV1Z1ZEM1eGRXVnllVk5sYkdWamRHOXlRV3hzS0ZSRlRWQk1RVlJGWDFORlRFVkRWRTlTS1NsY2JpQWdJQ0FnSUgwc0lHNTFiR3dwWEc0Z0lDQWdmVnh1WEc0Z0lDQWdMeThnY0hWaWJHbGpYRzVjYmlBZ0lDQXZLaXBjYmlBZ0lDQWdLbHh1SUNBZ0lDQXFJRUJ3WVhKaGJTQjdLbjBnWTJGc2JHSmhZMnRHYmx4dUlDQWdJQ0FxTDF4dUlDQWdJR0ZrWkVWMlpXNTBRMkZzYkdKaFkyc29ZMkZzYkdKaFkydEdiaWtnZTF4dUlDQWdJQ0FnZEdocGN5NWxkbVZ1ZEhNdWNIVnphQ2hqWVd4c1ltRmphMFp1S1Z4dUlDQWdJSDFjYmx4dUlDQWdJQzhxS2x4dUlDQWdJQ0FxSUZWelpTQjBhR1VnWjJsMlpXNGdkR1Z0Y0d4aGRHVmNiaUFnSUNBZ0tseHVJQ0FnSUNBcUlFQndZWEpoYlNCN2MzUnlhVzVuZlNCMFpXMXdiR0YwWlZCaGRHaGNiaUFnSUNBZ0tpOWNiaUFnSUNCMWMyVlVaVzF3YkdGMFpTaDBaVzF3YkdGMFpWQmhkR2dwSUh0Y2JpQWdJQ0FnSUdsbUlDaDBlWEJsYjJZZ2RHVnRjR3hoZEdWUVlYUm9JQ0U5UFNBbmMzUnlhVzVuSnlrZ2UxeHVJQ0FnSUNBZ0lDQjBhSEp2ZHlCdVpYY2dSWEp5YjNJb0oxUm9aU0IwWlcxd2JHRjBaU0J3WVhSb0lHMTFjM1FnWW1VZ1lTQnpkSEpwYm1jdUlDY2dLeUIwZVhCbGIyWWdkR1Z0Y0d4aGRHVlFZWFJvSUNzZ0p5QnBjeUJuYVhabGJpY3BYRzRnSUNBZ0lDQjlYRzRnSUNBZ0lDQjBhR2x6TG5SbGJYQnNZWFJsVUdGMGFDQTlJSFJsYlhCc1lYUmxVR0YwYUZ4dUlDQWdJSDFjYmx4dUlDQWdJQzhxS2x4dUlDQWdJQ0FxSUZWelpTQjBhR1VnWjJsMlpXNGdkR1Z0Y0d4aGRHVWdjbVZ1WkdWeVpYSmNiaUFnSUNBZ0tpQkFjR0Z5WVcwZ2UwWjFibU4wYVc5dWZTQnlaVzVrWlhKR2RXNWpkR2x2Ymx4dUlDQWdJQ0FxTDF4dUlDQWdJSFZ6WlZSbGJYQnNZWFJsVW1WdVpHVnlaWElvY21WdVpHVnlSblZ1WTNScGIyNHBJSHRjYmlBZ0lDQWdJR2xtSUNoMGVYQmxiMllnY21WdVpHVnlSblZ1WTNScGIyNGdJVDA5SUNkbWRXNWpkR2x2YmljcElIdGNiaUFnSUNBZ0lDQWdkR2h5YjNjZ2JtVjNJRVZ5Y205eUtDZFVhR1VnWTNWemRHOXRJSFJsYlhCc1lYUmxJSEpsYm1SbGNtVnlJRzExYzNRZ1ltVWdZU0JtZFc1amRHbHZiaTRnSnlBcklIUjVjR1Z2WmlCeVpXNWtaWEpHZFc1amRHbHZiaUFySUNjZ2FYTWdaMmwyWlc0bktWeHVJQ0FnSUNBZ2ZWeHVJQ0FnSUNBZ2RHaHBjeTV5Wlc1a1pYSkdkVzVqZEdsdmJpQTlJSEpsYm1SbGNrWjFibU4wYVc5dVhHNGdJQ0FnZlZ4dVhHNGdJQ0FnTHlvcVhHNGdJQ0FnSUNvZ1ZISnBaMmRsY2lCelkyOXdaWE5jYmlBZ0lDQWdLaUJBY0dGeVlXMGdlM04wY21sdVozMGdaWFpsYm5ST1lXMWxYRzRnSUNBZ0lDb2dRSEJoY21GdElIdDdmWDBnVzJWMlpXNTBVR0Z5WVcxelBYdDlYVnh1SUNBZ0lDQXFMMXh1SUNBZ0lIUnlhV2RuWlhKVFkyOXdaWE1vWlhabGJuUk9ZVzFsTENCbGRtVnVkRkJoY21GdGN5QTlJSHQ5S1NCN1hHNGdJQ0FnSUNCamIyNXpkQ0JsZG1WdWRFNWhiV1ZCYkdsaGN5QTlJR0J2YmlSN1pYWmxiblJPWVcxbExtTm9ZWEpCZENnd0tTNTBiMVZ3Y0dWeVEyRnpaU2dwZlNSN1pYWmxiblJPWVcxbExuTnNhV05sS0RFcGZXQmNibHh1SUNBZ0lDQWdkR2hwY3k1bGRtVnVkSE11Wm05eVJXRmphQ2dvYzJOdmNHVXBJRDArSUh0Y2JpQWdJQ0FnSUNBZ1kyOXVjM1FnYzJOdmNHVkZkbVZ1ZENBOUlITmpiM0JsVzJWMlpXNTBUbUZ0WlYxY2JpQWdJQ0FnSUNBZ1kyOXVjM1FnYzJOdmNHVkZkbVZ1ZEVGc2FXRnpJRDBnYzJOdmNHVmJaWFpsYm5ST1lXMWxRV3hwWVhOZFhHNGdJQ0FnSUNBZ0lHbG1JQ2gwZVhCbGIyWWdjMk52Y0dWRmRtVnVkQ0E5UFQwZ0oyWjFibU4wYVc5dUp5a2dlMXh1SUNBZ0lDQWdJQ0FnSUhOamIzQmxSWFpsYm5RdVlYQndiSGtvZEdocGN5d2daWFpsYm5SUVlYSmhiWE1wWEc0Z0lDQWdJQ0FnSUgxY2JseHVJQ0FnSUNBZ0lDQXZMeUIwY21sbloyVnlJSFJvWlNCbGRtVnVkQ0JoYkdsaGMxeHVJQ0FnSUNBZ0lDQnBaaUFvZEhsd1pXOW1JSE5qYjNCbFJYWmxiblJCYkdsaGN5QTlQVDBnSjJaMWJtTjBhVzl1SnlrZ2UxeHVJQ0FnSUNBZ0lDQWdJSE5qYjNCbFJYWmxiblJCYkdsaGN5NWhjSEJzZVNoMGFHbHpMQ0JsZG1WdWRGQmhjbUZ0Y3lsY2JpQWdJQ0FnSUNBZ2ZWeHVJQ0FnSUNBZ2ZTbGNibHh1SUNBZ0lDQWdaR2x6Y0dGMFkyaFFZV2RsUlhabGJuUW9aWFpsYm5ST1lXMWxMQ0IwYUdsekxtNWhiV1VzSUdWMlpXNTBVR0Z5WVcxektWeHVJQ0FnSUgxY2JpQWdmVnh1WEc0Z0lISmxkSFZ5YmlCUVlXZGxYRzU5S1NncFhHNWNibVY0Y0c5eWRDQmtaV1poZFd4MElGQmhaMlZjYmlJc0lpOHFLbHh1SUNvZ0xTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMWNiaUFxSUV4cFkyVnVjMlZrSUhWdVpHVnlJRTFKVkNBb2FIUjBjSE02THk5bmFYUm9kV0l1WTI5dEwzRjFZWEpyTFdSbGRpOVFhRzl1YjI0dFJuSmhiV1YzYjNKckwySnNiMkl2YldGemRHVnlMMHhKUTBWT1UwVXBYRzRnS2lBdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExWeHVJQ292WEc1Y2JtbHRjRzl5ZENCUVlXZGxjaUJtY205dElDY3VMMmg1WW5KcFpDMWhjSEJ6TDNCaFoyVnlMMmx1WkdWNEoxeHVhVzF3YjNKMElFbHVkR3dnWm5KdmJTQW5MaTlvZVdKeWFXUXRZWEJ3Y3k5cGJuUnNKMXh1YVcxd2IzSjBJRTVsZEhkdmNtc2dabkp2YlNBbkxpOWpiMjF0YjI0dmJtVjBkMjl5YXlkY2JseHVMeThnWTI5dGNHOXVaVzUwYzF4dWFXMXdiM0owSUVScFlXeHZaeUJtY205dElDY3VMMk52YlhCdmJtVnVkSE12WkdsaGJHOW5KMXh1YVcxd2IzSjBJRkJ5YjIxd2RDQm1jbTl0SUNjdUwyTnZiWEJ2Ym1WdWRITXZaR2xoYkc5bkwzQnliMjF3ZENkY2JtbHRjRzl5ZENCRGIyNW1hWEp0SUdaeWIyMGdKeTR2WTI5dGNHOXVaVzUwY3k5a2FXRnNiMmN2WTI5dVptbHliU2RjYm1sdGNHOXlkQ0JFYVdGc2IyZE1iMkZrWlhJZ1puSnZiU0FuTGk5amIyMXdiMjVsYm5SekwyUnBZV3h2Wnk5c2IyRmtaWEluWEc1cGJYQnZjblFnVG05MGFXWnBZMkYwYVc5dUlHWnliMjBnSnk0dlkyOXRjRzl1Wlc1MGN5OXViM1JwWm1sallYUnBiMjRuWEc1cGJYQnZjblFnUTI5c2JHRndjMlVnWm5KdmJTQW5MaTlqYjIxd2IyNWxiblJ6TDJOdmJHeGhjSE5sSjF4dWFXMXdiM0owSUVGalkyOXlaR2x2YmlCbWNtOXRJQ2N1TDJOdmJYQnZibVZ1ZEhNdllXTmpiM0prYVc5dUoxeHVhVzF3YjNKMElGUmhZaUJtY205dElDY3VMMk52YlhCdmJtVnVkSE12ZEdGaUoxeHVhVzF3YjNKMElGQnliMmR5WlhOeklHWnliMjBnSnk0dlkyOXRjRzl1Wlc1MGN5OXdjbTluY21WemN5ZGNibWx0Y0c5eWRDQk1iMkZrWlhJZ1puSnZiU0FuTGk5amIyMXdiMjVsYm5SekwyeHZZV1JsY2lkY2JtbHRjRzl5ZENCUFptWkRZVzUyWVhNZ1puSnZiU0FuTGk5amIyMXdiMjVsYm5SekwyOW1aaTFqWVc1MllYTW5YRzVwYlhCdmNuUWdSSEp2Y0dSdmQyNGdabkp2YlNBbkxpOWpiMjF3YjI1bGJuUnpMMlJ5YjNCa2IzZHVKMXh1YVcxd2IzSjBJRVJ5YjNCa2IzZHVVMlZoY21Ob0lHWnliMjBnSnk0dlkyOXRjRzl1Wlc1MGN5OWtjbTl3Wkc5M2JpOXpaV0Z5WTJnblhHNWNibU52Ym5OMElHRndhU0E5SUh0OVhHNWNiaThxS2x4dUlDb2dMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRYRzRnS2lCUVlXZGxjbHh1SUNvZ0xTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdFhHNGdLaTljYm1Gd2FTNXdZV2RsY2lBOUlDaHZjSFJwYjI1ektTQTlQaUI3WEc0Z0lHbG1JQ2gwZVhCbGIyWWdZWEJwTGw5d1lXZGxjaUE5UFQwZ0ozVnVaR1ZtYVc1bFpDY3BJSHRjYmlBZ0lDQmhjR2t1WDNCaFoyVnlJRDBnVUdGblpYSXVYMFJQVFVsdWRHVnlabUZqWlNodmNIUnBiMjV6S1Z4dUlDQjlYRzRnSUhKbGRIVnliaUJoY0drdVgzQmhaMlZ5WEc1OVhHNWNiaThxS2x4dUlDb2dMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRYRzRnS2lCSmJuUnNYRzRnS2lBdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMxY2JpQXFMMXh1WVhCcExtbHVkR3dnUFNCSmJuUnNMbDlFVDAxSmJuUmxjbVpoWTJWY2JseHVMeW9xWEc0Z0tpQXRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMWNiaUFxSUU1bGRIZHZjbXRjYmlBcUlDMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExWeHVJQ292WEc1aGNHa3VibVYwZDI5eWF5QTlJRTVsZEhkdmNtc3VYMFJQVFVsdWRHVnlabUZqWlZ4dVhHNHZLaXBjYmlBcUlDMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExWeHVJQ29nVG05MGFXWnBZMkYwYVc5dVhHNGdLaUF0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzFjYmlBcUwxeHVZWEJwTG01dmRHbG1hV05oZEdsdmJpQTlJRTV2ZEdsbWFXTmhkR2x2Ymk1ZlJFOU5TVzUwWlhKbVlXTmxYRzVjYmk4cUtseHVJQ29nTFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0WEc0Z0tpQkVhV0ZzYjJkY2JpQXFJQzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMVnh1SUNvdlhHNWhjR2t1WkdsaGJHOW5JRDBnS0c5d2RHbHZibk1wSUQwK0lIdGNiaUFnYVdZZ0tHOXdkR2x2Ym5NdWRIbHdaU0E5UFQwZ1VISnZiWEIwTG1sa1pXNTBhV1pwWlhJb0tTa2dlMXh1SUNBZ0lDOHZJSEJ5YjIxd2RDQmthV0ZzYjJkY2JpQWdJQ0J5WlhSMWNtNGdVSEp2YlhCMExsOUVUMDFKYm5SbGNtWmhZMlVvYjNCMGFXOXVjeWxjYmlBZ2ZWeHVYRzRnSUdsbUlDaHZjSFJwYjI1ekxuUjVjR1VnUFQwOUlFTnZibVpwY20wdWFXUmxiblJwWm1sbGNpZ3BLU0I3WEc0Z0lDQWdMeThnWTI5dVptbHliU0JrYVdGc2IyZGNiaUFnSUNCeVpYUjFjbTRnUTI5dVptbHliUzVmUkU5TlNXNTBaWEptWVdObEtHOXdkR2x2Ym5NcFhHNGdJSDFjYmx4dUlDQnBaaUFvYjNCMGFXOXVjeTUwZVhCbElEMDlQU0JFYVdGc2IyZE1iMkZrWlhJdWFXUmxiblJwWm1sbGNpZ3BLU0I3WEc0Z0lDQWdMeThnWTI5dVptbHliU0JrYVdGc2IyZGNiaUFnSUNCeVpYUjFjbTRnUkdsaGJHOW5URzloWkdWeUxsOUVUMDFKYm5SbGNtWmhZMlVvYjNCMGFXOXVjeWxjYmlBZ2ZWeHVYRzRnSUM4dklHZGxibVZ5YVdNZ1pHbGhiRzluWEc0Z0lISmxkSFZ5YmlCRWFXRnNiMmN1WDBSUFRVbHVkR1Z5Wm1GalpTaHZjSFJwYjI1ektWeHVmVnh1WEc0dktpcGNiaUFxSUMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFZ4dUlDb2dRMjlzYkdGd2MyVmNiaUFxSUMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFZ4dUlDb3ZYRzVoY0drdVkyOXNiR0Z3YzJVZ1BTQkRiMnhzWVhCelpTNWZSRTlOU1c1MFpYSm1ZV05sWEc1Y2JpOHFLbHh1SUNvZ0xTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdFhHNGdLaUJCWTJOdmNtUnBiMjVjYmlBcUlDMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExWeHVJQ292WEc1aGNHa3VZV05qYjNKa2FXOXVJRDBnUVdOamIzSmthVzl1TGw5RVQwMUpiblJsY21aaFkyVmNibHh1WEc0dktpcGNiaUFxSUMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFZ4dUlDb2dWR0ZpWEc0Z0tpQXRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMWNiaUFxTDF4dVlYQnBMblJoWWlBOUlGUmhZaTVmUkU5TlNXNTBaWEptWVdObFhHNWNiaThxS2x4dUlDb2dMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRYRzRnS2lCUWNtOW5jbVZ6YzF4dUlDb2dMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRYRzRnS2k5Y2JtRndhUzV3Y205bmNtVnpjeUE5SUZCeWIyZHlaWE56TGw5RVQwMUpiblJsY21aaFkyVmNibHh1THlvcVhHNGdLaUF0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzFjYmlBcUlFeHZZV1JsY2x4dUlDb2dMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRYRzRnS2k5Y2JtRndhUzVzYjJGa1pYSWdQU0JNYjJGa1pYSXVYMFJQVFVsdWRHVnlabUZqWlZ4dVhHNHZLaXBjYmlBcUlDMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExWeHVJQ29nVDJabUlHTmhiblpoYzF4dUlDb2dMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRYRzRnS2k5Y2JtRndhUzV2Wm1aRFlXNTJZWE1nUFNCUFptWkRZVzUyWVhNdVgwUlBUVWx1ZEdWeVptRmpaVnh1WEc0dktpcGNiaUFxSUMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFZ4dUlDb2dSSEp2Y0dSdmQyNWNiaUFxSUMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFZ4dUlDb3ZYRzVoY0drdVpISnZjR1J2ZDI0Z1BTQW9iM0IwYVc5dWN5a2dQVDRnZTF4dUlDQnBaaUFvYjNCMGFXOXVjeTV6WldGeVkyZ3BJSHRjYmlBZ0lDQXZMeUJ6WldGeVkyZ2daSEp2Y0dSdmQyNWNiaUFnSUNCeVpYUjFjbTRnUkhKdmNHUnZkMjVUWldGeVkyZ3VYMFJQVFVsdWRHVnlabUZqWlNodmNIUnBiMjV6S1Z4dUlDQjlYRzVjYmlBZ0x5OGdaMlZ1WlhKcFl5QmtjbTl3Wkc5M2JseHVJQ0J5WlhSMWNtNGdSSEp2Y0dSdmQyNHVYMFJQVFVsdWRHVnlabUZqWlNodmNIUnBiMjV6S1Z4dWZWeHVYRzR2THlCTllXdGxJSFJvWlNCQlVFa2diR2wyWlZ4dWQybHVaRzkzTG5Cb2IyNXZiaUE5SUdGd2FWeHVYRzVsZUhCdmNuUWdaR1ZtWVhWc2RDQmhjR2xjYmlKZGZRPT0ifQ==
