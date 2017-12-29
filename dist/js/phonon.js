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
      text: 'Cancel',
      dismiss: true,
      class: 'btn btn-secondary'
    }, {
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

        var dismissButtons = this.options.element.querySelectorAll('[data-dismiss]');
        if (dismissButtons) {
          Array.from(dismissButtons).forEach(function (button) {
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

        var dismissButtons = this.options.element.querySelectorAll('[data-dismiss]');
        if (dismissButtons) {
          Array.from(dismissButtons).forEach(function (button) {
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
    buttons: [{
      text: 'Cancel',
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
      text: 'Cancel',
      dismiss: true,
      class: 'btn btn-secondary'
    }, {
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

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvanMvY29tbW9uL2V2ZW50cy9kaXNwYXRjaC5qcyIsInNyYy9qcy9jb21tb24vZXZlbnRzL2luZGV4LmpzIiwic3JjL2pzL2NvbW1vbi9uZXR3b3JrL2luZGV4LmpzIiwic3JjL2pzL2NvbW1vbi91dGlscy9pbmRleC5qcyIsInNyYy9qcy9jb21wb25lbnRzL2FjY29yZGlvbi9pbmRleC5qcyIsInNyYy9qcy9jb21wb25lbnRzL2NvbGxhcHNlL2luZGV4LmpzIiwic3JjL2pzL2NvbXBvbmVudHMvY29tcG9uZW50LmpzIiwic3JjL2pzL2NvbXBvbmVudHMvY29tcG9uZW50TWFuYWdlci5qcyIsInNyYy9qcy9jb21wb25lbnRzL2RpYWxvZy9jb25maXJtLmpzIiwic3JjL2pzL2NvbXBvbmVudHMvZGlhbG9nL2luZGV4LmpzIiwic3JjL2pzL2NvbXBvbmVudHMvZGlhbG9nL2xvYWRlci5qcyIsInNyYy9qcy9jb21wb25lbnRzL2RpYWxvZy9wcm9tcHQuanMiLCJzcmMvanMvY29tcG9uZW50cy9kcm9wZG93bi9pbmRleC5qcyIsInNyYy9qcy9jb21wb25lbnRzL2Ryb3Bkb3duL3NlYXJjaC5qcyIsInNyYy9qcy9jb21wb25lbnRzL2xvYWRlci9pbmRleC5qcyIsInNyYy9qcy9jb21wb25lbnRzL25vdGlmaWNhdGlvbi9pbmRleC5qcyIsInNyYy9qcy9jb21wb25lbnRzL29mZi1jYW52YXMvaW5kZXguanMiLCJzcmMvanMvY29tcG9uZW50cy9wcm9ncmVzcy9pbmRleC5qcyIsInNyYy9qcy9jb21wb25lbnRzL3RhYi9pbmRleC5qcyIsInNyYy9qcy9oeWJyaWQtYXBwcy9pbnRsL2JpbmRlci5qcyIsInNyYy9qcy9oeWJyaWQtYXBwcy9pbnRsL2luZGV4LmpzIiwic3JjL2pzL2h5YnJpZC1hcHBzL3BhZ2VyL2luZGV4LmpzIiwic3JjL2pzL2h5YnJpZC1hcHBzL3BhZ2VyL3BhZ2UuanMi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SSxRQUFRLElBQVIsS0FBaUIsa0JBQVEsVUFBUixFQUFyQixFQUEyQztBQUN6QztBQUNBLFdBQU8sa0JBQVEsYUFBUixDQUFzQixPQUF0QixDQUFQO0FBQ0Q7O0FBRUQsTUFBSSxRQUFRLElBQVIsS0FBaUIsaUJBQWEsVUFBYixFQUFyQixFQUFnRDtBQUM5QztBQUNBLFdBQU8saUJBQWEsYUFBYixDQUEyQixPQUEzQixDQUFQO0FBQ0Q7O0FBRUQ7QUFDQSxTQUFPLGlCQUFPLGFBQVAsQ0FBcUIsT0FBckIsQ0FBUDtBQUNELENBbEJEOztBQW9CQTs7Ozs7QUFLQSxJQUFJLFFBQUosR0FBZSxtQkFBUyxhQUF4Qjs7QUFFQTs7Ozs7QUFLQSxJQUFJLFNBQUosR0FBZ0Isb0JBQVUsYUFBMUI7O0FBR0E7Ozs7O0FBS0EsSUFBSSxHQUFKLEdBQVUsY0FBSSxhQUFkOztBQUVBOzs7OztBQUtBLElBQUksUUFBSixHQUFlLG1CQUFTLGFBQXhCOztBQUVBOzs7OztBQUtBLElBQUksTUFBSixHQUFhLGlCQUFPLGFBQXBCOztBQUVBOzs7OztBQUtBLElBQUksU0FBSixHQUFnQixvQkFBVSxhQUExQjs7QUFFQTs7Ozs7QUFLQSxJQUFJLFFBQUosR0FBZSxVQUFDLE9BQUQsRUFBYTtBQUMxQixNQUFJLFFBQVEsTUFBWixFQUFvQjtBQUNsQjtBQUNBLFdBQU8saUJBQWUsYUFBZixDQUE2QixPQUE3QixDQUFQO0FBQ0Q7O0FBRUQ7QUFDQSxTQUFPLG1CQUFTLGFBQVQsQ0FBdUIsT0FBdkIsQ0FBUDtBQUNELENBUkQ7O0FBVUE7QUFDQSxPQUFPLE1BQVAsR0FBZ0IsR0FBaEI7O2tCQUVlLEciLCJmaWxlIjoicGhvbm9uLmpzIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCJleHBvcnQgZnVuY3Rpb24gZGlzcGF0Y2hXaW5Eb2NFdmVudChldmVudE5hbWUsIG1vZHVsZU5hbWUsIGRldGFpbCA9IHt9KSB7XG4gIGNvbnN0IGZ1bGxFdmVudE5hbWUgPSBgJHtldmVudE5hbWV9LnBoLiR7bW9kdWxlTmFtZX1gXG4gIHdpbmRvdy5kaXNwYXRjaEV2ZW50KG5ldyBDdXN0b21FdmVudChmdWxsRXZlbnROYW1lLCB7IGRldGFpbCB9KSlcbiAgZG9jdW1lbnQuZGlzcGF0Y2hFdmVudChuZXcgQ3VzdG9tRXZlbnQoZnVsbEV2ZW50TmFtZSwgeyBkZXRhaWwgfSkpXG59XG5cbmV4cG9ydCBmdW5jdGlvbiBkaXNwYXRjaEVsZW1lbnRFdmVudChkb21FbGVtZW50LCBldmVudE5hbWUsIG1vZHVsZU5hbWUsIGRldGFpbCA9IHt9KSB7XG4gIGNvbnN0IGZ1bGxFdmVudE5hbWUgPSBgJHtldmVudE5hbWV9LnBoLiR7bW9kdWxlTmFtZX1gXG4gIGRvbUVsZW1lbnQuZGlzcGF0Y2hFdmVudChuZXcgQ3VzdG9tRXZlbnQoZnVsbEV2ZW50TmFtZSwgeyBkZXRhaWwgfSkpXG59XG5cbmV4cG9ydCBmdW5jdGlvbiBkaXNwYXRjaFBhZ2VFdmVudChldmVudE5hbWUsIHBhZ2VOYW1lLCBkZXRhaWwgPSB7fSkge1xuICBjb25zdCBmdWxsRXZlbnROYW1lID0gYCR7cGFnZU5hbWV9LiR7ZXZlbnROYW1lfWBcbiAgd2luZG93LmRpc3BhdGNoRXZlbnQobmV3IEN1c3RvbUV2ZW50KGZ1bGxFdmVudE5hbWUsIHsgZGV0YWlsIH0pKVxuICBkb2N1bWVudC5kaXNwYXRjaEV2ZW50KG5ldyBDdXN0b21FdmVudChmdWxsRXZlbnROYW1lLCB7IGRldGFpbCB9KSlcbn1cbiIsIi8vIEB0b2RvIGtlZXAgP1xuaWYgKHR5cGVvZiB3aW5kb3cgIT09ICd1bmRlZmluZWQnKSB7XG4gIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdlcnJvcicsICgpID0+IHtcbiAgICBjb25zb2xlLmVycm9yKCdBbiBlcnJvciBoYXMgb2NjdXJlZCEgWW91IGNhbiBwZW4gYW4gaXNzdWUgaGVyZTogaHR0cHM6Ly9naXRodWIuY29tL3F1YXJrLWRldi9QaG9ub24tRnJhbWV3b3JrL2lzc3VlcycpXG4gIH0pXG59XG5cbi8vIFVzZSBhdmFpbGFibGUgZXZlbnRzXG5sZXQgYXZhaWxhYmxlRXZlbnRzID0gWydtb3VzZWRvd24nLCAnbW91c2Vtb3ZlJywgJ21vdXNldXAnXVxubGV0IHRvdWNoU2NyZWVuID0gZmFsc2VcblxuaWYgKHR5cGVvZiB3aW5kb3cgIT09ICd1bmRlZmluZWQnKSB7XG4gIGlmICgoJ29udG91Y2hzdGFydCcgaW4gd2luZG93KSB8fCB3aW5kb3cuRG9jdW1lbnRUb3VjaCAmJiBkb2N1bWVudCBpbnN0YW5jZW9mIERvY3VtZW50VG91Y2gpIHtcbiAgICB0b3VjaFNjcmVlbiA9IHRydWVcbiAgICBhdmFpbGFibGVFdmVudHMgPSBbJ3RvdWNoc3RhcnQnLCAndG91Y2htb3ZlJywgJ3RvdWNoZW5kJywgJ3RvdWNoY2FuY2VsJ11cbiAgfVxuXG4gIGlmICh3aW5kb3cubmF2aWdhdG9yLnBvaW50ZXJFbmFibGVkKSB7XG4gICAgYXZhaWxhYmxlRXZlbnRzID0gWydwb2ludGVyZG93bicsICdwb2ludGVybW92ZScsICdwb2ludGVydXAnLCAncG9pbnRlcmNhbmNlbCddXG4gIH0gZWxzZSBpZiAod2luZG93Lm5hdmlnYXRvci5tc1BvaW50ZXJFbmFibGVkKSB7XG4gICAgYXZhaWxhYmxlRXZlbnRzID0gWydNU1BvaW50ZXJEb3duJywgJ01TUG9pbnRlck1vdmUnLCAnTVNQb2ludGVyVXAnLCAnTVNQb2ludGVyQ2FuY2VsJ11cbiAgfVxufVxuXG5jb25zdCBlbCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpXG5jb25zdCB0cmFuc2l0aW9ucyA9IFtcbiAgeyBuYW1lOiAndHJhbnNpdGlvbicsIHN0YXJ0OiAndHJhbnNpdGlvbnN0YXJ0JywgZW5kOiAndHJhbnNpdGlvbmVuZCcgfSxcbiAgeyBuYW1lOiAnTW96VHJhbnNpdGlvbicsIHN0YXJ0OiAndHJhbnNpdGlvbnN0YXJ0JywgZW5kOiAndHJhbnNpdGlvbmVuZCcgfSxcbiAgeyBuYW1lOiAnbXNUcmFuc2l0aW9uJywgc3RhcnQ6ICdtc1RyYW5zaXRpb25TdGFydCcsIGVuZDogJ21zVHJhbnNpdGlvbkVuZCcgfSxcbiAgeyBuYW1lOiAnV2Via2l0VHJhbnNpdGlvbicsIHN0YXJ0OiAnd2Via2l0VHJhbnNpdGlvblN0YXJ0JywgZW5kOiAnd2Via2l0VHJhbnNpdGlvbkVuZCcgfSxcbl1cbmNvbnN0IGFuaW1hdGlvbnMgPSBbXG4gIHsgbmFtZTogJ2FuaW1hdGlvbicsIHN0YXJ0OiAnYW5pbWF0aW9uc3RhcnQnLCBlbmQ6ICdhbmltYXRpb25lbmQnIH0sXG4gIHsgbmFtZTogJ01vekFuaW1hdGlvbicsIHN0YXJ0OiAnYW5pbWF0aW9uc3RhcnQnLCBlbmQ6ICdhbmltYXRpb25lbmQnIH0sXG4gIHsgbmFtZTogJ21zQW5pbWF0aW9uJywgc3RhcnQ6ICdtc0FuaW1hdGlvblN0YXJ0JywgZW5kOiAnbXNBbmltYXRpb25FbmQnIH0sXG4gIHsgbmFtZTogJ1dlYmtpdEFuaW1hdGlvbicsIHN0YXJ0OiAnd2Via2l0QW5pbWF0aW9uU3RhcnQnLCBlbmQ6ICd3ZWJraXRBbmltYXRpb25FbmQnIH0sXG5dXG5cbmNvbnN0IHRyYW5zaXRpb25TdGFydCA9IHRyYW5zaXRpb25zLmZpbmQodCA9PiBlbC5zdHlsZVt0Lm5hbWVdICE9PSB1bmRlZmluZWQpLnN0YXJ0XG5jb25zdCB0cmFuc2l0aW9uRW5kID0gdHJhbnNpdGlvbnMuZmluZCh0ID0+IGVsLnN0eWxlW3QubmFtZV0gIT09IHVuZGVmaW5lZCkuZW5kXG5jb25zdCBhbmltYXRpb25TdGFydCA9IGFuaW1hdGlvbnMuZmluZCh0ID0+IGVsLnN0eWxlW3QubmFtZV0gIT09IHVuZGVmaW5lZCkuc3RhcnRcbmNvbnN0IGFuaW1hdGlvbkVuZCA9IGFuaW1hdGlvbnMuZmluZCh0ID0+IGVsLnN0eWxlW3QubmFtZV0gIT09IHVuZGVmaW5lZCkuZW5kXG5cbmV4cG9ydCBkZWZhdWx0IHtcbiAgLy8gdG91Y2ggc2NyZWVuIHN1cHBvcnRcbiAgVE9VQ0hfU0NSRUVOOiB0b3VjaFNjcmVlbixcblxuICAvLyBuZXR3b3JrXG4gIE5FVFdPUktfT05MSU5FOiAnb25saW5lJyxcbiAgTkVUV09SS19PRkZMSU5FOiAnb2ZmbGluZScsXG4gIE5FVFdPUktfUkVDT05ORUNUSU5HOiAncmVjb25uZWN0aW5nJyxcbiAgTkVUV09SS19SRUNPTk5FQ1RJTkdfU1VDQ0VTUzogJ3JlY29ubmVjdC5zdWNjZXNzJyxcbiAgTkVUV09SS19SRUNPTk5FQ1RJTkdfRkFJTFVSRTogJ3JlY29ubmVjdC5mYWlsdXJlJyxcblxuICAvLyB1c2VyIGludGVyZmFjZSBzdGF0ZXNcbiAgU0hPVzogJ3Nob3cnLFxuICBTSE9XTjogJ3Nob3duJyxcbiAgSElERTogJ2hpZGUnLFxuICBISURERU46ICdoaWRkZW4nLFxuXG4gIC8vIGhhc2hcbiAgSEFTSDogJ2hhc2gnLFxuXG4gIC8vIHRvdWNoLCBtb3VzZSBhbmQgcG9pbnRlciBldmVudHMgcG9seWZpbGxcbiAgU1RBUlQ6IGF2YWlsYWJsZUV2ZW50c1swXSxcbiAgTU9WRTogYXZhaWxhYmxlRXZlbnRzWzFdLFxuICBFTkQ6IGF2YWlsYWJsZUV2ZW50c1syXSxcbiAgQ0FOQ0VMOiB0eXBlb2YgYXZhaWxhYmxlRXZlbnRzWzNdID09PSAndW5kZWZpbmVkJyA/IG51bGwgOiBhdmFpbGFibGVFdmVudHNbM10sXG5cbiAgLy8gdHJhbnNpdGlvbnNcbiAgVFJBTlNJVElPTl9TVEFSVDogdHJhbnNpdGlvblN0YXJ0LFxuICBUUkFOU0lUSU9OX0VORDogdHJhbnNpdGlvbkVuZCxcblxuICAvLyBhbmltYXRpb25zXG4gIEFOSU1BVElPTl9TVEFSVDogYW5pbWF0aW9uU3RhcnQsXG4gIEFOSU1BVElPTl9FTkQ6IGFuaW1hdGlvbkVuZCxcblxuICAvLyBkcm9wZG93blxuICBJVEVNX1NFTEVDVEVEOiAnaXRlbVNlbGVjdGVkJyxcbn0iLCIvKipcbiAqIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gKiBMaWNlbnNlZCB1bmRlciBNSVQgKGh0dHBzOi8vZ2l0aHViLmNvbS9xdWFyay1kZXYvUGhvbm9uLUZyYW1ld29yay9ibG9iL21hc3Rlci9MSUNFTlNFKVxuICogLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAqL1xuXG5pbXBvcnQgRXZlbnQgZnJvbSAnLi4vLi4vY29tbW9uL2V2ZW50cydcbmltcG9ydCBDb21wb25lbnQgZnJvbSAnLi4vLi4vY29tcG9uZW50cy9jb21wb25lbnQnXG5cbmNvbnN0IE5ldHdvcmsgPSAoKCkgPT4ge1xuICAvKipcbiAgICogLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAqIENvbnN0YW50c1xuICAgKiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICovXG5cbiAgY29uc3QgTkFNRSA9ICduZXR3b3JrJ1xuICBjb25zdCBWRVJTSU9OID0gJzIuMC4wJ1xuICBjb25zdCBERUZBVUxUX1BST1BFUlRJRVMgPSB7XG4gICAgZWxlbWVudDogbnVsbCxcbiAgICBpbml0aWFsRGVsYXk6IDMwMDAsXG4gICAgZGVsYXk6IDUwMDAsXG4gIH1cbiAgY29uc3QgREFUQV9BVFRSU19QUk9QRVJUSUVTID0gW1xuICBdXG5cbiAgLyoqXG4gICAqIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgKiBDbGFzcyBEZWZpbml0aW9uXG4gICAqIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgKi9cblxuICBjbGFzcyBOZXR3b3JrIGV4dGVuZHMgQ29tcG9uZW50IHtcbiAgICAvKipcbiAgICAgKiBDcmVhdGVzIGFuIGluc3RhbmNlIG9mIE5ldHdvcmsuXG4gICAgICogQHBhcmFtIHt7fX0gW29wdGlvbnM9e31dXG4gICAgICovXG4gICAgY29uc3RydWN0b3Iob3B0aW9ucyA9IHt9KSB7XG4gICAgICBzdXBlcihOQU1FLCBWRVJTSU9OLCBERUZBVUxUX1BST1BFUlRJRVMsIG9wdGlvbnMsIERBVEFfQVRUUlNfUFJPUEVSVElFUywgdHJ1ZSwgZmFsc2UpXG5cbiAgICAgIHRoaXMueGhyID0gbnVsbFxuICAgICAgdGhpcy5jaGVja0ludGVydmFsID0gbnVsbFxuXG4gICAgICB0aGlzLnNldFN0YXR1cyhFdmVudC5ORVRXT1JLX09OTElORSlcblxuICAgICAgc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICAgIHRoaXMuc3RhcnRDaGVjaygpXG4gICAgICB9LCB0aGlzLm9wdGlvbnMuaW5pdGlhbERlbGF5KVxuICAgIH1cblxuICAgIGdldFN0YXR1cygpIHtcbiAgICAgIHJldHVybiB0aGlzLnN0YXR1c1xuICAgIH1cblxuICAgIHNldFN0YXR1cyhzdGF0dXMpIHtcbiAgICAgIHRoaXMuc3RhdHVzID0gc3RhdHVzXG4gICAgfVxuXG4gICAgc3RhcnRSZXF1ZXN0KCkge1xuICAgICAgdGhpcy54aHIgPSBuZXcgWE1MSHR0cFJlcXVlc3QoKVxuICAgICAgdGhpcy54aHIub2ZmbGluZSA9IGZhbHNlXG5cbiAgICAgIGNvbnN0IHVybCA9IGAvZmF2aWNvbi5pY28/Xz0ke25ldyBEYXRlKCkuZ2V0VGltZSgpfWBcblxuICAgICAgdGhpcy50cmlnZ2VyRXZlbnQoRXZlbnQuTkVUV09SS19SRUNPTk5FQ1RJTkcsIHsgZGF0ZTogbmV3IERhdGUoKSB9LCBmYWxzZSkgICAgICAgICAgICBcblxuICAgICAgdGhpcy54aHIub3BlbignSEVBRCcsIHVybCwgdHJ1ZSlcblxuICAgICAgdGhpcy54aHIudGltZW91dCA9IHRoaXMub3B0aW9ucy5kZWxheSAtIDFcbiAgICAgIHRoaXMueGhyLm9udGltZW91dCA9ICgpID0+IHtcbiAgICAgICAgdGhpcy54aHIuYWJvcnQoKVxuICAgICAgICB0aGlzLnhociA9IG51bGxcbiAgICAgIH1cblxuICAgICAgdGhpcy54aHIub25sb2FkID0gKCkgPT4ge1xuICAgICAgICB0aGlzLm9uVXAoKVxuICAgICAgfVxuICAgICAgdGhpcy54aHIub25lcnJvciA9ICgpID0+IHtcbiAgICAgICAgdGhpcy5vbkRvd24oKVxuICAgICAgfVxuXG4gICAgICB0cnkge1xuICAgICAgICB0aGlzLnhoci5zZW5kKClcbiAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgdGhpcy5vbkRvd24oKVxuICAgICAgfVxuICAgIH1cblxuICAgIG9uVXAoKSB7XG4gICAgICB0aGlzLnRyaWdnZXJFdmVudChFdmVudC5ORVRXT1JLX1JFQ09OTkVDVElOR19TVUNDRVNTLCB7IGRhdGU6IG5ldyBEYXRlKCkgfSwgZmFsc2UpXG5cbiAgICAgIGlmICh0aGlzLmdldFN0YXR1cygpICE9PSBFdmVudC5ORVRXT1JLX09OTElORSkge1xuICAgICAgICB0aGlzLnRyaWdnZXJFdmVudChFdmVudC5ORVRXT1JLX09OTElORSwgeyBkYXRlOiBuZXcgRGF0ZSgpIH0sIGZhbHNlKVxuICAgICAgfVxuXG4gICAgICB0aGlzLnNldFN0YXR1cyhFdmVudC5ORVRXT1JLX09OTElORSkgICAgICBcbiAgICB9XG5cbiAgICBvbkRvd24oKSB7XG4gICAgICB0aGlzLnRyaWdnZXJFdmVudChFdmVudC5ORVRXT1JLX1JFQ09OTkVDVElOR19GQUlMVVJFLCB7IGRhdGU6IG5ldyBEYXRlKCkgfSwgZmFsc2UpXG5cbiAgICAgIGlmICh0aGlzLmdldFN0YXR1cygpICE9PSBFdmVudC5ORVRXT1JLX09GRkxJTkUpIHtcbiAgICAgICAgdGhpcy50cmlnZ2VyRXZlbnQoRXZlbnQuTkVUV09SS19PRkZMSU5FLCB7IGRhdGU6IG5ldyBEYXRlKCkgfSwgZmFsc2UpXG4gICAgICB9XG5cbiAgICAgIHRoaXMuc2V0U3RhdHVzKEV2ZW50Lk5FVFdPUktfT0ZGTElORSkgICAgICBcbiAgICB9XG5cbiAgICBzdGFydENoZWNrKCkge1xuICAgICAgdGhpcy5zdG9wQ2hlY2soKVxuXG4gICAgICB0aGlzLnN0YXJ0UmVxdWVzdCgpICAgICAgXG5cbiAgICAgIHRoaXMuY2hlY2tJbnRlcnZhbCA9IHNldEludGVydmFsKCgpID0+IHtcbiAgICAgICAgdGhpcy5zdGFydFJlcXVlc3QoKVxuICAgICAgfSwgdGhpcy5vcHRpb25zLmRlbGF5KVxuICAgIH1cblxuICAgIHN0b3BDaGVjaygpIHtcbiAgICAgIGlmICh0aGlzLmNoZWNrSW50ZXJ2YWwgIT09IG51bGwpIHtcbiAgICAgICAgY2xlYXJJbnRlcnZhbCh0aGlzLmNoZWNrSW50ZXJ2YWwpXG4gICAgICAgIHRoaXMuY2hlY2tJbnRlcnZhbCA9IG51bGxcbiAgICAgIH1cbiAgICB9XG5cbiAgICBzdGF0aWMgX0RPTUludGVyZmFjZShvcHRpb25zKSB7XG4gICAgICByZXR1cm4gc3VwZXIuX0RPTUludGVyZmFjZShOZXR3b3JrLCBvcHRpb25zKVxuICAgIH1cbiAgfVxuXG4gIHJldHVybiBOZXR3b3JrXG59KSgpXG5cbmV4cG9ydCBkZWZhdWx0IE5ldHdvcmtcbiIsIlxuZXhwb3J0IGZ1bmN0aW9uIGxvYWRGaWxlKHVybCwgZm4sIHBvc3REYXRhKSB7XG4gIGNvbnN0IHJlcSA9IG5ldyBYTUxIdHRwUmVxdWVzdCgpXG4gIGlmIChyZXEub3ZlcnJpZGVNaW1lVHlwZSkgcmVxLm92ZXJyaWRlTWltZVR5cGUoJ3RleHQvaHRtbDsgY2hhcnNldD11dGYtOCcpXG4gIHJlcS5vbnJlYWR5c3RhdGVjaGFuZ2UgPSAoKSA9PiB7XG4gICAgaWYgKHJlcS5yZWFkeVN0YXRlID09PSA0ICYmIChwYXJzZUludChyZXEuc3RhdHVzLCAxMCkgPT09IDIwMFxuICAgICAgfHwgIXJlcS5zdGF0dXMgJiYgcmVxLnJlc3BvbnNlVGV4dC5sZW5ndGgpKSB7XG4gICAgICBmbihyZXEucmVzcG9uc2VUZXh0KVxuICAgIH1cbiAgfVxuXG4gIGlmICh0eXBlb2YgcG9zdERhdGEgIT09ICdzdHJpbmcnKSB7XG4gICAgcmVxLm9wZW4oJ0dFVCcsIHVybCwgdHJ1ZSlcbiAgICByZXEuc2VuZCgnJylcbiAgfSBlbHNlIHtcbiAgICByZXEub3BlbignUE9TVCcsIHVybCwgdHJ1ZSlcbiAgICByZXEuc2V0UmVxdWVzdEhlYWRlcignQ29udGVudC10eXBlJywgJ2FwcGxpY2F0aW9uL3gtd3d3LWZvcm0tdXJsZW5jb2RlZCcpXG4gICAgcmVxLnNlbmQocG9zdERhdGEpXG4gIH1cbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGdlbmVyYXRlSWQoKSB7XG4gIHJldHVybiBNYXRoLnJhbmRvbSgpLnRvU3RyaW5nKDM2KS5zdWJzdHIoMiwgMTApXG59XG5cbmV4cG9ydCBmdW5jdGlvbiBmaW5kVGFyZ2V0QnlDbGFzcyh0YXJnZXQsIHBhcmVudENsYXNzKSB7XG4gIGZvciAoOyB0YXJnZXQgJiYgdGFyZ2V0ICE9PSBkb2N1bWVudDsgdGFyZ2V0ID0gdGFyZ2V0LnBhcmVudE5vZGUpIHtcbiAgICBpZiAodGFyZ2V0LmNsYXNzTGlzdC5jb250YWlucyhwYXJlbnRDbGFzcykpIHtcbiAgICAgIHJldHVybiB0YXJnZXRcbiAgICB9XG4gIH1cblxuICByZXR1cm4gbnVsbFxufVxuXG5cbmV4cG9ydCBmdW5jdGlvbiBmaW5kVGFyZ2V0QnlJZCh0YXJnZXQsIHBhcmVudElkKSB7XG4gIGZvciAoOyB0YXJnZXQgJiYgdGFyZ2V0ICE9PSBkb2N1bWVudDsgdGFyZ2V0ID0gdGFyZ2V0LnBhcmVudE5vZGUpIHtcbiAgICBpZiAodGFyZ2V0LmdldEF0dHJpYnV0ZSgnaWQnKSA9PT0gcGFyZW50SWQpIHtcbiAgICAgIHJldHVybiB0YXJnZXRcbiAgICB9XG4gIH1cblxuICByZXR1cm4gbnVsbFxufVxuXG5leHBvcnQgZnVuY3Rpb24gZmluZFRhcmdldEJ5QXR0cih0YXJnZXQsIGF0dHIpIHtcbiAgZm9yICg7IHRhcmdldCAmJiB0YXJnZXQgIT09IGRvY3VtZW50OyB0YXJnZXQgPSB0YXJnZXQucGFyZW50Tm9kZSkge1xuICAgIGlmICh0YXJnZXQuZ2V0QXR0cmlidXRlKGF0dHIpICE9PSBudWxsKSB7XG4gICAgICByZXR1cm4gdGFyZ2V0XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIG51bGxcbn1cbiIsIi8qKlxuICogLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAqIExpY2Vuc2VkIHVuZGVyIE1JVCAoaHR0cHM6Ly9naXRodWIuY29tL3F1YXJrLWRldi9QaG9ub24tRnJhbWV3b3JrL2Jsb2IvbWFzdGVyL0xJQ0VOU0UpXG4gKiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICovXG5pbXBvcnQgQ29tcG9uZW50IGZyb20gJy4uL2NvbXBvbmVudCdcbmltcG9ydCBDb2xsYXBzZSBmcm9tICcuLi9jb2xsYXBzZSdcbmltcG9ydCB7IGdldEF0dHJpYnV0ZXNDb25maWcgfSBmcm9tICcuLi9jb21wb25lbnRNYW5hZ2VyJ1xuaW1wb3J0IHsgZmluZFRhcmdldEJ5Q2xhc3MgfSBmcm9tICcuLi8uLi9jb21tb24vdXRpbHMnXG5cbmNvbnN0IEFjY29yZGlvbiA9ICgoKSA9PiB7XG4gIC8qKlxuICAgKiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICogQ29uc3RhbnRzXG4gICAqIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgKi9cblxuICBjb25zdCBOQU1FID0gJ2FjY29yZGlvbidcbiAgY29uc3QgVkVSU0lPTiA9ICcyLjAuMCdcbiAgY29uc3QgREVGQVVMVF9QUk9QRVJUSUVTID0ge1xuICAgIGVsZW1lbnQ6IG51bGwsXG4gIH1cbiAgY29uc3QgREFUQV9BVFRSU19QUk9QRVJUSUVTID0gW1xuICBdXG5cbiAgLyoqXG4gICAqIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgKiBDbGFzcyBEZWZpbml0aW9uXG4gICAqIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgKi9cblxuICBjbGFzcyBBY2NvcmRpb24gZXh0ZW5kcyBDb21wb25lbnQge1xuXG4gICAgY29uc3RydWN0b3Iob3B0aW9ucyA9IHt9KSB7XG4gICAgICBzdXBlcihOQU1FLCBWRVJTSU9OLCBERUZBVUxUX1BST1BFUlRJRVMsIG9wdGlvbnMsIERBVEFfQVRUUlNfUFJPUEVSVElFUywgZmFsc2UsIGZhbHNlKVxuXG4gICAgICB0aGlzLmNvbGxhcHNlcyA9IFtdXG5cbiAgICAgIGNvbnN0IHRvZ2dsZXMgPSB0aGlzLm9wdGlvbnMuZWxlbWVudC5xdWVyeVNlbGVjdG9yQWxsKGBbZGF0YS10b2dnbGU9XCIke05BTUV9XCJdYClcbiAgICAgIEFycmF5LmZyb20odG9nZ2xlcykuZm9yRWFjaCgodG9nZ2xlKSA9PiB7XG4gICAgICAgIGNvbnN0IGNvbGxhcHNlSWQgPSB0b2dnbGUuZ2V0QXR0cmlidXRlKCdocmVmJylcbiAgICAgICAgY29uc3QgY29sbGFwc2UgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKGNvbGxhcHNlSWQpXG5cbiAgICAgICAgaWYgKGNvbGxhcHNlKSB7XG4gICAgICAgICAgdGhpcy5hZGRDb2xsYXBzZShjb2xsYXBzZSlcbiAgICAgICAgfVxuICAgICAgfSlcbiAgICB9XG5cbiAgICBvbkVsZW1lbnRFdmVudChldmVudCkge1xuICAgICAgY29uc3QgaWQgPSBldmVudC50YXJnZXQuZ2V0QXR0cmlidXRlKCdocmVmJylcbiAgICAgIGNvbnN0IGVsZW1lbnQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKGlkKVxuXG4gICAgICB0aGlzLnNldENvbGxhcHNlcyhlbGVtZW50KVxuICAgIH1cblxuICAgIGFkZENvbGxhcHNlKGVsZW1lbnQpIHtcbiAgICAgIGNvbnN0IGNvbGxhcHNlID0gbmV3IENvbGxhcHNlKHtcbiAgICAgICAgZWxlbWVudCxcbiAgICAgIH0pXG4gICAgICB0aGlzLmNvbGxhcHNlcy5wdXNoKGNvbGxhcHNlKVxuXG4gICAgICByZXR1cm4gY29sbGFwc2VcbiAgICB9XG5cbiAgICBnZXRDb2xsYXBzZShlbGVtZW50KSB7XG4gICAgICBsZXQgY29sbGFwc2UgPSB0aGlzLmNvbGxhcHNlcy5maW5kKGMgPT4gYy5vcHRpb25zLmVsZW1lbnQuZ2V0QXR0cmlidXRlKCdpZCcpID09PSBlbGVtZW50LmdldEF0dHJpYnV0ZSgnaWQnKSlcblxuICAgICAgaWYgKCFjb2xsYXBzZSkge1xuICAgICAgICAvLyBjcmVhdGUgYSBuZXcgY29sbGFwc2VcbiAgICAgICAgY29sbGFwc2UgPSB0aGlzLmFkZENvbGxhcHNlKClcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIGNvbGxhcHNlXG4gICAgfVxuXG4gICAgZ2V0Q29sbGFwc2VzKCkge1xuICAgICAgcmV0dXJuIHRoaXMuY29sbGFwc2VzXG4gICAgfVxuXG4gICAgc2V0Q29sbGFwc2VzKHNob3dDb2xsYXBzZSkge1xuICAgICAgY29uc3QgY29sbGFwc2UgPSB0aGlzLmdldENvbGxhcHNlKHNob3dDb2xsYXBzZSlcbiAgICAgIHRoaXMuY29sbGFwc2VzLmZvckVhY2goKGMpID0+IHtcbiAgICAgICAgaWYgKGMub3B0aW9ucy5lbGVtZW50LmdldEF0dHJpYnV0ZSgnaWQnKSAhPT0gc2hvd0NvbGxhcHNlLmdldEF0dHJpYnV0ZSgnaWQnKSkge1xuICAgICAgICAgIGMuaGlkZSgpXG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgY29sbGFwc2UudG9nZ2xlKClcbiAgICAgICAgfVxuICAgICAgfSlcbiAgICB9XG5cbiAgICBzaG93KGNvbGxhcHNlRWwpIHtcbiAgICAgIGxldCBjb2xsYXBzZSA9IGNvbGxhcHNlRWxcbiAgICAgIGlmICh0eXBlb2YgY29sbGFwc2VFbCA9PT0gJ3N0cmluZycpIHtcbiAgICAgICAgY29sbGFwc2UgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKGNvbGxhcHNlRWwpXG4gICAgICB9XG5cbiAgICAgIGlmICghY29sbGFwc2UpIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKGAke05BTUV9LiBUaGUgY29sbGFwc2libGUgJHtjb2xsYXBzZUVsfSBpcyBhbiBpbnZhbGlkIEhUTUxFbGVtZW50LmApXG4gICAgICB9XG5cbiAgICAgIHRoaXMuc2V0Q29sbGFwc2VzKGNvbGxhcHNlKVxuXG4gICAgICByZXR1cm4gdHJ1ZVxuICAgIH1cblxuICAgIGhpZGUoY29sbGFwc2VFbCkge1xuICAgICAgbGV0IGNvbGxhcHNlID0gY29sbGFwc2VFbFxuICAgICAgaWYgKHR5cGVvZiBjb2xsYXBzZUVsID09PSAnc3RyaW5nJykge1xuICAgICAgICBjb2xsYXBzZSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoY29sbGFwc2VFbClcbiAgICAgIH1cblxuICAgICAgaWYgKCFjb2xsYXBzZSkge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYCR7TkFNRX0uIFRoZSBjb2xsYXBzaWJsZSAke2NvbGxhcHNlRWx9IGlzIGFuIGludmFsaWQgSFRNTEVsZW1lbnQuYClcbiAgICAgIH1cblxuICAgICAgY29uc3QgY29sbGFwc2VPYmogPSB0aGlzLmdldENvbGxhcHNlKGNvbGxhcHNlKVxuICAgICAgcmV0dXJuIGNvbGxhcHNlT2JqLmhpZGUoKVxuICAgIH1cblxuICAgIHN0YXRpYyBpZGVudGlmaWVyKCkge1xuICAgICAgcmV0dXJuIE5BTUVcbiAgICB9XG5cbiAgICBzdGF0aWMgX0RPTUludGVyZmFjZShvcHRpb25zKSB7XG4gICAgICByZXR1cm4gc3VwZXIuX0RPTUludGVyZmFjZShBY2NvcmRpb24sIG9wdGlvbnMpXG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgKiBET00gQXBpIGltcGxlbWVudGF0aW9uXG4gICAqIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgKi9cbiAgY29uc3QgY29tcG9uZW50cyA9IFtdXG5cbiAgY29uc3QgYWNjb3JkaW9ucyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoYC4ke05BTUV9YClcbiAgaWYgKGFjY29yZGlvbnMpIHtcbiAgICBBcnJheS5mcm9tKGFjY29yZGlvbnMpLmZvckVhY2goKGVsZW1lbnQpID0+IHtcbiAgICAgIGNvbnN0IGNvbmZpZyA9IGdldEF0dHJpYnV0ZXNDb25maWcoZWxlbWVudCwgREVGQVVMVF9QUk9QRVJUSUVTLCBEQVRBX0FUVFJTX1BST1BFUlRJRVMpXG4gICAgICBjb25maWcuZWxlbWVudCA9IGVsZW1lbnRcblxuICAgICAgY29tcG9uZW50cy5wdXNoKEFjY29yZGlvbi5fRE9NSW50ZXJmYWNlKGNvbmZpZykpXG4gICAgfSlcbiAgfVxuXG4gIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKGV2ZW50KSA9PiB7XG4gICAgY29uc3QgZGF0YVRvZ2dsZUF0dHIgPSBldmVudC50YXJnZXQuZ2V0QXR0cmlidXRlKCdkYXRhLXRvZ2dsZScpXG4gICAgaWYgKGRhdGFUb2dnbGVBdHRyICYmIGRhdGFUb2dnbGVBdHRyID09PSBOQU1FKSB7XG4gICAgICBjb25zdCBjb2xsYXBzZUlkID0gZXZlbnQudGFyZ2V0LmdldEF0dHJpYnV0ZSgnZGF0YS10YXJnZXQnKSB8fCBldmVudC50YXJnZXQuZ2V0QXR0cmlidXRlKCdocmVmJylcbiAgICAgIGNvbnN0IGNvbGxhcHNlRWwgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKGNvbGxhcHNlSWQpXG5cbiAgICAgIGNvbnN0IGFjY29yZGlvbiA9IGZpbmRUYXJnZXRCeUNsYXNzKGV2ZW50LnRhcmdldCwgJ2FjY29yZGlvbicpXG5cbiAgICAgIGlmIChhY2NvcmRpb24gPT09IG51bGwpIHtcbiAgICAgICAgcmV0dXJuXG4gICAgICB9XG5cbiAgICAgIGNvbnN0IGFjY29yZGlvbklkID0gYWNjb3JkaW9uLmdldEF0dHJpYnV0ZSgnaWQnKVxuICAgICAgY29uc3QgY29tcG9uZW50ID0gY29tcG9uZW50cy5maW5kKGMgPT4gYy5nZXRFbGVtZW50KCkuZ2V0QXR0cmlidXRlKCdpZCcpID09PSBhY2NvcmRpb25JZClcblxuICAgICAgaWYgKCFjb21wb25lbnQpIHtcbiAgICAgICAgcmV0dXJuXG4gICAgICB9XG5cbiAgICAgIC8vIGlmIHRoZSBjb2xsYXBzZSBoYXMgYmVlbiBhZGRlZCBwcm9ncmFtbWF0aWNhbGx5LCB3ZSBhZGQgaXRcbiAgICAgIGNvbnN0IHRhcmdldENvbGxhcHNlID0gY29tcG9uZW50LmdldENvbGxhcHNlcygpLmZpbmQoYyA9PiBjLmdldEVsZW1lbnQoKSA9PT0gY29sbGFwc2VFbClcbiAgICAgIGlmICghdGFyZ2V0Q29sbGFwc2UpIHtcbiAgICAgICAgY29tcG9uZW50LmFkZENvbGxhcHNlKGNvbGxhcHNlRWwpXG4gICAgICB9XG5cbiAgICAgIGNvbXBvbmVudC5zaG93KGNvbGxhcHNlSWQpXG4gICAgfVxuICB9KVxuXG4gIHJldHVybiBBY2NvcmRpb25cbn0pKClcblxuZXhwb3J0IGRlZmF1bHQgQWNjb3JkaW9uXG4iLCIvKipcbiAqIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gKiBMaWNlbnNlZCB1bmRlciBNSVQgKGh0dHBzOi8vZ2l0aHViLmNvbS9xdWFyay1kZXYvUGhvbm9uLUZyYW1ld29yay9ibG9iL21hc3Rlci9MSUNFTlNFKVxuICogLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAqL1xuaW1wb3J0IENvbXBvbmVudCBmcm9tICcuLi9jb21wb25lbnQnXG5pbXBvcnQgeyBnZXRBdHRyaWJ1dGVzQ29uZmlnIH0gZnJvbSAnLi4vY29tcG9uZW50TWFuYWdlcidcbmltcG9ydCBFdmVudCBmcm9tICcuLi8uLi9jb21tb24vZXZlbnRzJ1xuaW1wb3J0IHsgZmluZFRhcmdldEJ5QXR0ciB9IGZyb20gJy4uLy4uL2NvbW1vbi91dGlscydcblxuY29uc3QgQ29sbGFwc2UgPSAoKCkgPT4ge1xuICAvKipcbiAgICogLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAqIENvbnN0YW50c1xuICAgKiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICovXG5cbiAgY29uc3QgTkFNRSA9ICdjb2xsYXBzZSdcbiAgY29uc3QgVkVSU0lPTiA9ICcyLjAuMCdcbiAgY29uc3QgREVGQVVMVF9QUk9QRVJUSUVTID0ge1xuICAgIGVsZW1lbnQ6IG51bGwsXG4gICAgdG9nZ2xlOiBmYWxzZSxcbiAgfVxuICBjb25zdCBEQVRBX0FUVFJTX1BST1BFUlRJRVMgPSBbXG4gICAgJ3RvZ2dsZScsXG4gIF1cblxuICAvKipcbiAgICogLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAqIENsYXNzIERlZmluaXRpb25cbiAgICogLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAqL1xuXG4gIGNsYXNzIENvbGxhcHNlIGV4dGVuZHMgQ29tcG9uZW50IHtcblxuICAgIGNvbnN0cnVjdG9yKG9wdGlvbnMgPSB7fSkge1xuICAgICAgc3VwZXIoTkFNRSwgVkVSU0lPTiwgREVGQVVMVF9QUk9QRVJUSUVTLCBvcHRpb25zLCBEQVRBX0FUVFJTX1BST1BFUlRJRVMsIGZhbHNlLCBmYWxzZSlcblxuICAgICAgdGhpcy5vblRyYW5zaXRpb24gPSBmYWxzZVxuXG4gICAgICAvLyB0b2dnbGUgZGlyZWN0bHlcbiAgICAgIGlmICh0aGlzLm9wdGlvbnMudG9nZ2xlKSB7XG4gICAgICAgIHRoaXMuc2hvdygpXG4gICAgICB9XG4gICAgfVxuXG4gICAgZ2V0SGVpZ2h0KCkge1xuICAgICAgcmV0dXJuIHRoaXMub3B0aW9ucy5lbGVtZW50LmdldEJvdW5kaW5nQ2xpZW50UmVjdCh0aGlzLm9wdGlvbnMuZWxlbWVudCkuaGVpZ2h0XG4gICAgfVxuXG4gICAgdG9nZ2xlKCkge1xuICAgICAgaWYgKHRoaXMub3B0aW9ucy5lbGVtZW50LmNsYXNzTGlzdC5jb250YWlucygnc2hvdycpKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmhpZGUoKVxuICAgICAgfVxuXG4gICAgICByZXR1cm4gdGhpcy5zaG93KClcbiAgICB9XG5cbiAgICBzaG93KCkge1xuICAgICAgaWYgKHRoaXMub25UcmFuc2l0aW9uKSB7XG4gICAgICAgIHJldHVybiBmYWxzZVxuICAgICAgfVxuXG4gICAgICBpZiAodGhpcy5vcHRpb25zLmVsZW1lbnQuY2xhc3NMaXN0LmNvbnRhaW5zKCdzaG93JykpIHtcbiAgICAgICAgcmV0dXJuIGZhbHNlXG4gICAgICB9XG5cbiAgICAgIHRoaXMub25UcmFuc2l0aW9uID0gdHJ1ZVxuXG4gICAgICBjb25zdCBvbkNvbGxhcHNlZCA9ICgpID0+IHtcbiAgICAgICAgdGhpcy5vcHRpb25zLmVsZW1lbnQuY2xhc3NMaXN0LmFkZCgnc2hvdycpXG4gICAgICAgIHRoaXMub3B0aW9ucy5lbGVtZW50LmNsYXNzTGlzdC5yZW1vdmUoJ2NvbGxhcHNpbmcnKVxuICAgICAgICB0aGlzLm9wdGlvbnMuZWxlbWVudC5yZW1vdmVFdmVudExpc3RlbmVyKEV2ZW50LlRSQU5TSVRJT05fRU5ELCBvbkNvbGxhcHNlZClcblxuICAgICAgICB0aGlzLm9wdGlvbnMuZWxlbWVudC5zZXRBdHRyaWJ1dGUoJ2FyaWEtZXhwYW5kZWQnLCB0cnVlKVxuXG4gICAgICAgIHRoaXMub25UcmFuc2l0aW9uID0gZmFsc2VcbiAgICAgIH1cblxuICAgICAgaWYgKCF0aGlzLm9wdGlvbnMuZWxlbWVudC5jbGFzc0xpc3QuY29udGFpbnMoJ2NvbGxhcHNpbmcnKSkge1xuICAgICAgICB0aGlzLm9wdGlvbnMuZWxlbWVudC5jbGFzc0xpc3QuYWRkKCdjb2xsYXBzaW5nJylcbiAgICAgIH1cblxuICAgICAgdGhpcy5vcHRpb25zLmVsZW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihFdmVudC5UUkFOU0lUSU9OX0VORCwgb25Db2xsYXBzZWQpXG5cbiAgICAgIGNvbnN0IGhlaWdodCA9IHRoaXMuZ2V0SGVpZ2h0KClcblxuICAgICAgdGhpcy5vcHRpb25zLmVsZW1lbnQuc3R5bGUuaGVpZ2h0ID0gJzBweCdcblxuICAgICAgc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICAgIHRoaXMub3B0aW9ucy5lbGVtZW50LnN0eWxlLmhlaWdodCA9IGAke2hlaWdodH1weGBcbiAgICAgIH0sIDIwKVxuXG4gICAgICByZXR1cm4gdHJ1ZVxuICAgIH1cblxuICAgIGhpZGUoKSB7XG4gICAgICBpZiAodGhpcy5vblRyYW5zaXRpb24pIHtcbiAgICAgICAgcmV0dXJuIGZhbHNlXG4gICAgICB9XG5cbiAgICAgIGlmICghdGhpcy5vcHRpb25zLmVsZW1lbnQuY2xhc3NMaXN0LmNvbnRhaW5zKCdzaG93JykpIHtcbiAgICAgICAgcmV0dXJuIGZhbHNlXG4gICAgICB9XG5cbiAgICAgIHRoaXMub25UcmFuc2l0aW9uID0gdHJ1ZVxuXG4gICAgICBjb25zdCBvbkNvbGxhcHNlZCA9ICgpID0+IHtcbiAgICAgICAgdGhpcy5vcHRpb25zLmVsZW1lbnQuY2xhc3NMaXN0LnJlbW92ZSgnY29sbGFwc2luZycpXG4gICAgICAgIHRoaXMub3B0aW9ucy5lbGVtZW50LnN0eWxlLmhlaWdodCA9ICdhdXRvJ1xuICAgICAgICB0aGlzLm9wdGlvbnMuZWxlbWVudC5yZW1vdmVFdmVudExpc3RlbmVyKEV2ZW50LlRSQU5TSVRJT05fRU5ELCBvbkNvbGxhcHNlZClcblxuICAgICAgICB0aGlzLm9wdGlvbnMuZWxlbWVudC5zZXRBdHRyaWJ1dGUoJ2FyaWEtZXhwYW5kZWQnLCBmYWxzZSlcblxuICAgICAgICB0aGlzLm9uVHJhbnNpdGlvbiA9IGZhbHNlXG4gICAgICB9XG5cbiAgICAgIHRoaXMub3B0aW9ucy5lbGVtZW50LnN0eWxlLmhlaWdodCA9ICcwcHgnXG5cbiAgICAgIGlmICghdGhpcy5vcHRpb25zLmVsZW1lbnQuY2xhc3NMaXN0LmNvbnRhaW5zKCdjb2xsYXBzaW5nJykpIHtcbiAgICAgICAgdGhpcy5vcHRpb25zLmVsZW1lbnQuY2xhc3NMaXN0LmFkZCgnY29sbGFwc2luZycpXG4gICAgICB9XG5cbiAgICAgIHRoaXMub3B0aW9ucy5lbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIoRXZlbnQuVFJBTlNJVElPTl9FTkQsIG9uQ29sbGFwc2VkKVxuXG4gICAgICB0aGlzLm9wdGlvbnMuZWxlbWVudC5jbGFzc0xpc3QucmVtb3ZlKCdzaG93JylcblxuICAgICAgcmV0dXJuIHRydWVcbiAgICB9XG5cbiAgICBzdGF0aWMgaWRlbnRpZmllcigpIHtcbiAgICAgIHJldHVybiBOQU1FXG4gICAgfVxuXG4gICAgc3RhdGljIF9ET01JbnRlcmZhY2Uob3B0aW9ucykge1xuICAgICAgcmV0dXJuIHN1cGVyLl9ET01JbnRlcmZhY2UoQ29sbGFwc2UsIG9wdGlvbnMpXG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgKiBET00gQXBpIGltcGxlbWVudGF0aW9uXG4gICAqIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgKi9cbiAgY29uc3QgY29tcG9uZW50cyA9IFtdXG5cbiAgY29uc3QgY29sbGFwc2VzID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChgLiR7TkFNRX1gKVxuICBpZiAoY29sbGFwc2VzKSB7XG4gICAgY29sbGFwc2VzLmZvckVhY2goKGVsZW1lbnQpID0+IHtcbiAgICAgIC8vIGNvbnN0IGNvbmZpZyA9IHt9XG4gICAgICBjb25zdCBjb25maWcgPSBnZXRBdHRyaWJ1dGVzQ29uZmlnKGVsZW1lbnQsIERFRkFVTFRfUFJPUEVSVElFUywgREFUQV9BVFRSU19QUk9QRVJUSUVTKVxuICAgICAgY29uZmlnLmVsZW1lbnQgPSBlbGVtZW50XG5cbiAgICAgIGNvbXBvbmVudHMucHVzaChDb2xsYXBzZS5fRE9NSW50ZXJmYWNlKGNvbmZpZykpXG4gICAgfSlcbiAgfVxuXG4gIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKGV2ZW50KSA9PiB7XG4gICAgY29uc3QgdGFyZ2V0ID0gZmluZFRhcmdldEJ5QXR0cihldmVudC50YXJnZXQsICdkYXRhLXRvZ2dsZScpXG4gICAgaWYgKCF0YXJnZXQpIHtcbiAgICAgIHJldHVyblxuICAgIH1cblxuICAgIGNvbnN0IGRhdGFUb2dnbGVBdHRyID0gdGFyZ2V0LmdldEF0dHJpYnV0ZSgnZGF0YS10b2dnbGUnKVxuXG4gICAgaWYgKGRhdGFUb2dnbGVBdHRyICYmIGRhdGFUb2dnbGVBdHRyID09PSBOQU1FKSB7XG4gICAgICBsZXQgaWQgPSB0YXJnZXQuZ2V0QXR0cmlidXRlKCdkYXRhLXRhcmdldCcpIHx8IHRhcmdldC5nZXRBdHRyaWJ1dGUoJ2hyZWYnKVxuICAgICAgaWQgPSBpZC5yZXBsYWNlKCcjJywgJycpXG5cbiAgICAgIGNvbnN0IGNvbXBvbmVudCA9IGNvbXBvbmVudHMuZmluZChjID0+IGMuZ2V0RWxlbWVudCgpLmdldEF0dHJpYnV0ZSgnaWQnKSA9PT0gaWQpXG5cbiAgICAgIGlmICghY29tcG9uZW50KSB7XG4gICAgICAgIHJldHVyblxuICAgICAgfVxuXG4gICAgICBjb21wb25lbnQudG9nZ2xlKClcbiAgICB9XG4gIH0pXG5cbiAgcmV0dXJuIENvbGxhcHNlXG59KSgpXG5cbmV4cG9ydCBkZWZhdWx0IENvbGxhcHNlXG4iLCIvKipcbiAqIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gKiBMaWNlbnNlZCB1bmRlciBNSVQgKGh0dHBzOi8vZ2l0aHViLmNvbS9xdWFyay1kZXYvUGhvbm9uLUZyYW1ld29yay9ibG9iL21hc3Rlci9MSUNFTlNFKVxuICogLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAqL1xuaW1wb3J0IHsgZGlzcGF0Y2hFbGVtZW50RXZlbnQsIGRpc3BhdGNoV2luRG9jRXZlbnQgfSBmcm9tICcuLi9jb21tb24vZXZlbnRzL2Rpc3BhdGNoJ1xuaW1wb3J0IHsgZ2VuZXJhdGVJZCB9IGZyb20gJy4uL2NvbW1vbi91dGlscydcbmltcG9ydCBFdmVudCBmcm9tICcuLi9jb21tb24vZXZlbnRzJ1xuaW1wb3J0IENvbXBvbmVudE1hbmFnZXIsIHsgc2V0QXR0cmlidXRlc0NvbmZpZywgZ2V0QXR0cmlidXRlc0NvbmZpZyB9IGZyb20gJy4vY29tcG9uZW50TWFuYWdlcidcblxuLyoqXG4gKiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAqIENsYXNzIERlZmluaXRpb25cbiAqIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICovXG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIENvbXBvbmVudCB7XG5cbiAgY29uc3RydWN0b3IobmFtZSwgdmVyc2lvbiwgZGVmYXVsdE9wdGlvbnMgPSB7fSwgb3B0aW9ucyA9IHt9LCBvcHRpb25BdHRycyA9IFtdLCBzdXBwb3J0RHluYW1pY0VsZW1lbnQgPSBmYWxzZSwgYWRkVG9TdGFjayA9IGZhbHNlKSB7XG4gICAgdGhpcy5uYW1lID0gbmFtZVxuICAgIHRoaXMudmVyc2lvbiA9IHZlcnNpb25cbiAgICB0aGlzLm9wdGlvbnMgPSBvcHRpb25zXG5cbiAgICAvLyBAdG9kbyBrZWVwP1xuICAgIC8vIHRoaXMub3B0aW9ucyA9IE9iamVjdC5hc3NpZ24oZGVmYXVsdE9wdGlvbnMsIG9wdGlvbnMpXG4gICAgT2JqZWN0LmtleXMoZGVmYXVsdE9wdGlvbnMpLmZvckVhY2goKHByb3ApID0+IHtcbiAgICAgIGlmICh0eXBlb2YgdGhpcy5vcHRpb25zW3Byb3BdID09PSAndW5kZWZpbmVkJykge1xuICAgICAgICB0aGlzLm9wdGlvbnNbcHJvcF0gPSBkZWZhdWx0T3B0aW9uc1twcm9wXVxuICAgICAgfVxuICAgIH0pXG5cbiAgICB0aGlzLm9wdGlvbkF0dHJzID0gb3B0aW9uQXR0cnNcbiAgICB0aGlzLnN1cHBvcnREeW5hbWljRWxlbWVudCA9IHN1cHBvcnREeW5hbWljRWxlbWVudFxuICAgIHRoaXMuYWRkVG9TdGFjayA9IGFkZFRvU3RhY2tcbiAgICB0aGlzLmlkID0gZ2VuZXJhdGVJZCgpXG5cbiAgICBjb25zdCBjaGVja0VsZW1lbnQgPSAhdGhpcy5zdXBwb3J0RHluYW1pY0VsZW1lbnQgfHwgdGhpcy5vcHRpb25zLmVsZW1lbnQgIT09IG51bGxcblxuICAgIGlmICh0eXBlb2YgdGhpcy5vcHRpb25zLmVsZW1lbnQgPT09ICdzdHJpbmcnKSB7XG4gICAgICB0aGlzLm9wdGlvbnMuZWxlbWVudCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IodGhpcy5vcHRpb25zLmVsZW1lbnQpXG4gICAgfVxuXG4gICAgaWYgKGNoZWNrRWxlbWVudCAmJiAhdGhpcy5vcHRpb25zLmVsZW1lbnQpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihgJHt0aGlzLm5hbWV9LiBUaGUgZWxlbWVudCBpcyBub3QgYSBIVE1MRWxlbWVudC5gKVxuICAgIH1cblxuICAgIHRoaXMuZHluYW1pY0VsZW1lbnQgPSB0aGlzLm9wdGlvbnMuZWxlbWVudCA9PT0gbnVsbFxuICAgIHRoaXMucmVnaXN0ZXJlZEVsZW1lbnRzID0gW11cblxuICAgIGlmICghdGhpcy5keW5hbWljRWxlbWVudCkge1xuICAgICAgLyoqXG4gICAgICAgKiBpZiB0aGUgZWxlbWVudCBleGlzdHMsIHdlIHJlYWQgdGhlIGRhdGEgYXR0cmlidXRlcyBjb25maWdcbiAgICAgICAqIHRoZW4gd2Ugb3ZlcndyaXRlIGV4aXN0aW5nIGNvbmZpZyBrZXlzIGluIEphdmFTY3JpcHQsIHNvIHRoYXRcbiAgICAgICAqIHdlIGtlZXAgdGhlIGZvbGxvd2luZyBvcmRlclxuICAgICAgICogWzFdIGRlZmF1bHQgSmF2YVNjcmlwdCBjb25maWd1cmF0aW9uIG9mIHRoZSBjb21wb25lbnRcbiAgICAgICAqIFsyXSBEYXRhIGF0dHJpYnV0ZXMgY29uZmlndXJhdGlvbiBpZiB0aGUgZWxlbWVudCBleGlzdHMgaW4gdGhlIERPTVxuICAgICAgICogWzNdIEphdmFTY3JpcHQgY29uZmlndXJhdGlvblxuICAgICAgICovXG4gICAgICB0aGlzLm9wdGlvbnMgPSBPYmplY3QuYXNzaWduKHRoaXMub3B0aW9ucywgdGhpcy5hc3NpZ25Kc0NvbmZpZyh0aGlzLmdldEF0dHJpYnV0ZXMoKSwgb3B0aW9ucykpXG5cbiAgICAgIC8vIHRoZW4sIHNldCB0aGUgbmV3IGRhdGEgYXR0cmlidXRlcyB0byB0aGUgZWxlbWVudFxuICAgICAgdGhpcy5zZXRBdHRyaWJ1dGVzKClcbiAgICB9XG5cbiAgICB0aGlzLmVsZW1lbnRMaXN0ZW5lciA9IGV2ZW50ID0+IHRoaXMub25CZWZvcmVFbGVtZW50RXZlbnQoZXZlbnQpICAgICAgICAgIFxuICB9XG5cbiAgYXNzaWduSnNDb25maWcoYXR0ckNvbmZpZywgb3B0aW9ucykge1xuICAgIHRoaXMub3B0aW9uQXR0cnMuZm9yRWFjaCgoa2V5KSA9PiB7XG4gICAgICBpZiAob3B0aW9uc1trZXldKSB7XG4gICAgICAgIGF0dHJDb25maWdba2V5XSA9IG9wdGlvbnNba2V5XVxuICAgICAgfVxuICAgIH0pXG5cbiAgICByZXR1cm4gYXR0ckNvbmZpZ1xuICB9XG5cbiAgZ2V0VmVyc2lvbigpIHtcbiAgICByZXR1cm4gdGhpcy52ZXJzaW9uXG4gIH1cblxuICBnZXRFbGVtZW50KCkge1xuICAgIHJldHVybiB0aGlzLm9wdGlvbnMuZWxlbWVudFxuICB9XG5cbiAgZ2V0SWQoKSB7XG4gICAgcmV0dXJuIHRoaXMuaWRcbiAgfVxuXG4gIHJlZ2lzdGVyRWxlbWVudHMoZWxlbWVudHMpIHtcbiAgICBlbGVtZW50cy5mb3JFYWNoKGVsZW1lbnQgPT4gdGhpcy5yZWdpc3RlckVsZW1lbnQoZWxlbWVudCkpXG4gIH1cblxuICByZWdpc3RlckVsZW1lbnQoZWxlbWVudCkge1xuICAgIGVsZW1lbnQudGFyZ2V0LmFkZEV2ZW50TGlzdGVuZXIoZWxlbWVudC5ldmVudCwgdGhpcy5lbGVtZW50TGlzdGVuZXIpXG4gICAgdGhpcy5yZWdpc3RlcmVkRWxlbWVudHMucHVzaChlbGVtZW50KVxuICB9XG5cbiAgdW5yZWdpc3RlckVsZW1lbnRzKCkge1xuICAgIHRoaXMucmVnaXN0ZXJlZEVsZW1lbnRzLmZvckVhY2goKGVsZW1lbnQpID0+IHtcbiAgICAgIHRoaXMudW5yZWdpc3RlckVsZW1lbnQoZWxlbWVudClcbiAgICB9KVxuICB9XG5cbiAgdW5yZWdpc3RlckVsZW1lbnQoZWxlbWVudCkge1xuICAgIGNvbnN0IHJlZ2lzdGVyZWRFbGVtZW50SW5kZXggPSB0aGlzLnJlZ2lzdGVyZWRFbGVtZW50c1xuICAgICAgLmZpbmRJbmRleChlbCA9PiBlbC50YXJnZXQgPT09IGVsZW1lbnQudGFyZ2V0ICYmIGVsLmV2ZW50ID09PSBlbGVtZW50LmV2ZW50KVxuXG4gICAgaWYgKHJlZ2lzdGVyZWRFbGVtZW50SW5kZXggPiAtMSkge1xuICAgICAgZWxlbWVudC50YXJnZXQucmVtb3ZlRXZlbnRMaXN0ZW5lcihlbGVtZW50LmV2ZW50LCB0aGlzLmVsZW1lbnRMaXN0ZW5lcilcbiAgICAgIHRoaXMucmVnaXN0ZXJlZEVsZW1lbnRzLnNwbGljZShyZWdpc3RlcmVkRWxlbWVudEluZGV4LCAxKVxuICAgIH0gZWxzZSB7XG4gICAgICBjb25zb2xlLmVycm9yKGBXYXJuaW5nISBVbmtub3duIHJlZ2lzdGVyZWQgZWxlbWVudDogJHtlbGVtZW50LnRhcmdldH0gd2l0aCBldmVudDogJHtlbGVtZW50LmV2ZW50fS5gKVxuICAgIH1cbiAgfVxuXG4gIHRyaWdnZXJFdmVudChldmVudE5hbWUsIGRldGFpbCA9IHt9LCBvYmplY3RFdmVudE9ubHkgPSBmYWxzZSkge1xuICAgIGlmICh0eXBlb2YgZXZlbnROYW1lICE9PSAnc3RyaW5nJykge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdUaGUgZXZlbnQgbmFtZSBpcyBub3QgdmFsaWQuJylcbiAgICB9XG5cbiAgICBpZiAodGhpcy5hZGRUb1N0YWNrKSB7XG4gICAgICBpZiAoZXZlbnROYW1lID09PSBFdmVudC5TSE9XKSB7XG4gICAgICAgIENvbXBvbmVudE1hbmFnZXIuYWRkKHRoaXMpXG4gICAgICB9IGVsc2UgaWYgKGV2ZW50TmFtZSA9PT0gRXZlbnQuSElERSkge1xuICAgICAgICBDb21wb25lbnRNYW5hZ2VyLnJlbW92ZSh0aGlzKVxuICAgICAgfVxuICAgIH1cblxuICAgIC8vIGV2ZW50IG5hbWVzIGNhbiBiZSB3aXRoIGRvdCBub3RhdGlvbiBsaWtlIHJlY29ubmVjdGluZy5zdWNjZXNzXG4gICAgY29uc3QgZXZlbnROYW1lT2JqZWN0ID0gZXZlbnROYW1lLnNwbGl0KCcuJykucmVkdWNlKChhY2MsIGN1cnJlbnQsIGluZGV4KSA9PiB7XG4gICAgICBpZiAoaW5kZXggPT09IDApIHtcbiAgICAgICAgcmV0dXJuIGN1cnJlbnRcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIGFjYyArIGN1cnJlbnQuY2hhckF0KDApLnRvVXBwZXJDYXNlKCkgKyBjdXJyZW50LnNsaWNlKDEpXG4gICAgfSlcblxuICAgIGNvbnN0IGV2ZW50TmFtZUFsaWFzID0gYG9uJHtldmVudE5hbWVPYmplY3QuY2hhckF0KDApLnRvVXBwZXJDYXNlKCl9JHtldmVudE5hbWVPYmplY3Quc2xpY2UoMSl9YFxuXG4gICAgLy8gb2JqZWN0IGV2ZW50XG4gICAgaWYgKHR5cGVvZiB0aGlzLm9wdGlvbnNbZXZlbnROYW1lT2JqZWN0XSA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgdGhpcy5vcHRpb25zW2V2ZW50TmFtZU9iamVjdF0uYXBwbHkodGhpcywgW2RldGFpbF0pXG4gICAgfVxuXG4gICAgaWYgKHR5cGVvZiB0aGlzLm9wdGlvbnNbZXZlbnROYW1lQWxpYXNdID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICB0aGlzLm9wdGlvbnNbZXZlbnROYW1lQWxpYXNdLmFwcGx5KHRoaXMsIFtkZXRhaWxdKVxuICAgIH1cblxuICAgIGlmIChvYmplY3RFdmVudE9ubHkpIHtcbiAgICAgIHJldHVyblxuICAgIH1cblxuICAgIC8vIGRvbSBldmVudFxuICAgIGlmICh0aGlzLm9wdGlvbnMuZWxlbWVudCkge1xuICAgICAgZGlzcGF0Y2hFbGVtZW50RXZlbnQodGhpcy5vcHRpb25zLmVsZW1lbnQsIGV2ZW50TmFtZSwgdGhpcy5uYW1lLCBkZXRhaWwpXG4gICAgfSBlbHNlIHtcbiAgICAgIGRpc3BhdGNoV2luRG9jRXZlbnQoZXZlbnROYW1lLCB0aGlzLm5hbWUsIGRldGFpbClcbiAgICB9XG4gIH1cblxuICBzZXRBdHRyaWJ1dGVzKCkge1xuICAgIGlmICh0aGlzLm9wdGlvbkF0dHJzLmxlbmd0aCA+IDApIHtcbiAgICAgIHNldEF0dHJpYnV0ZXNDb25maWcodGhpcy5vcHRpb25zLmVsZW1lbnQsIHRoaXMub3B0aW9ucywgdGhpcy5vcHRpb25BdHRycylcbiAgICB9XG4gIH1cblxuICBnZXRBdHRyaWJ1dGVzKCkge1xuICAgIGNvbnN0IG9wdGlvbnMgPSBPYmplY3QuYXNzaWduKHt9LCB0aGlzLm9wdGlvbnMpXG4gICAgcmV0dXJuIGdldEF0dHJpYnV0ZXNDb25maWcodGhpcy5vcHRpb25zLmVsZW1lbnQsIG9wdGlvbnMsIHRoaXMub3B0aW9uQXR0cnMpXG4gIH1cblxuICAvKipcbiAgICogdGhlIHByZXZlbnRDbG9zYWJsZSBtZXRob2QgbWFuYWdlcyBjb25jdXJyZW5jeSBiZXR3ZWVuIGFjdGl2ZSBjb21wb25lbnRzLlxuICAgKiBGb3IgZXhhbXBsZSwgaWYgdGhlcmUgaXMgYSBzaG93biBvZmYtY2FudmFzIGFuZCBkaWFsb2csIHRoZSBsYXN0XG4gICAqIHNob3duIGNvbXBvbmVudCBnYWlucyB0aGUgcHJvY2Vzc2luZyBwcmlvcml0eVxuICAgKi9cbiAgcHJldmVudENsb3NhYmxlKCkge1xuICAgIHJldHVybiB0aGlzLmFkZFRvU3RhY2sgJiYgIUNvbXBvbmVudE1hbmFnZXIuY2xvc2FibGUodGhpcylcbiAgfVxuXG4gIG9uQmVmb3JlRWxlbWVudEV2ZW50KGV2ZW50KSB7XG4gICAgaWYgKHRoaXMucHJldmVudENsb3NhYmxlKCkpIHtcbiAgICAgIHJldHVyblxuICAgIH1cblxuICAgIHRoaXMub25FbGVtZW50RXZlbnQoZXZlbnQpXG4gIH1cblxuICBvbkVsZW1lbnRFdmVudChldmVudCkge1xuICAgIC8vXG4gIH1cblxuICBzdGF0aWMgaWRlbnRpZmllcigpIHtcbiAgICByZXR1cm4gdGhpcy5uYW1lXG4gIH1cblxuICBzdGF0aWMgX0RPTUludGVyZmFjZShDb21wb25lbnRDbGFzcywgb3B0aW9ucykge1xuICAgIHJldHVybiBuZXcgQ29tcG9uZW50Q2xhc3Mob3B0aW9ucylcbiAgfVxufVxuIiwiXG5jb25zdCBnZXRBdHRyaWJ1dGUgPSAoZmlyc3QsIHNlY29uZCkgPT4ge1xuICBpZiAoZmlyc3QgPT09ICcnKSB7XG4gICAgcmV0dXJuIGBkYXRhLSR7c2Vjb25kfWBcbiAgfVxuICByZXR1cm4gYGRhdGEtJHtmaXJzdH0tJHtzZWNvbmR9YFxufVxuXG5leHBvcnQgZnVuY3Rpb24gc2V0QXR0cmlidXRlc0NvbmZpZyhlbGVtZW50LCBvYmogPSB7fSwgYXR0cnMsIHN0YXJ0ID0gJycpIHtcbiAgY29uc3Qga2V5cyA9IE9iamVjdC5rZXlzKG9iailcblxuICBrZXlzLmZvckVhY2goKGtleSkgPT4ge1xuICAgIGlmIChzdGFydCA9PT0gJycgJiYgYXR0cnMuaW5kZXhPZihrZXkpID09PSAtMSkge1xuICAgICAgLy8gY29udGludWUgd2l0aCBuZXh0IGl0ZXJhdGlvblxuICAgICAgcmV0dXJuXG4gICAgfVxuXG4gICAgaWYgKHR5cGVvZiBvYmpba2V5XSA9PT0gJ29iamVjdCcgJiYgb2JqW2tleV0gIT09IG51bGwpIHtcbiAgICAgIGxldCBrZXlTdGFydCA9IGtleVxuICAgICAgaWYgKHN0YXJ0ICE9PSAnJykge1xuICAgICAgICBrZXlTdGFydCA9IGAke3N0YXJ0fS0ke2tleX1gXG4gICAgICB9XG5cbiAgICAgIHNldEF0dHJpYnV0ZXNDb25maWcoZWxlbWVudCwgb2JqW2tleV0sIGF0dHJzLCBrZXlTdGFydClcbiAgICAgIHJldHVyblxuICAgIH1cblxuICAgIGNvbnN0IGF0dHIgPSBnZXRBdHRyaWJ1dGUoc3RhcnQsIGtleSlcbiAgICBlbGVtZW50LnNldEF0dHJpYnV0ZShhdHRyLCBvYmpba2V5XSlcbiAgfSlcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGdldEF0dHJpYnV0ZXNDb25maWcoZWxlbWVudCwgb2JqID0ge30sIGF0dHJzLCBzdGFydCA9ICcnKSB7XG4gIGNvbnN0IG5ld09iaiA9IE9iamVjdC5hc3NpZ24oe30sIG9iailcbiAgY29uc3Qga2V5cyA9IE9iamVjdC5rZXlzKG9iailcblxuICBrZXlzLmZvckVhY2goKGtleSkgPT4ge1xuICAgIGlmIChzdGFydCA9PT0gJycgJiYgYXR0cnMuaW5kZXhPZihrZXkpID09PSAtMSkge1xuICAgICAgLy8gY29udGludWUgd2l0aCBuZXh0IGl0ZXJhdGlvblxuICAgICAgcmV0dXJuXG4gICAgfVxuXG4gICAgaWYgKG9ialtrZXldICE9PSBudWxsICYmIG9ialtrZXldLmNvbnN0cnVjdG9yID09PSBPYmplY3QpIHtcbiAgICAgIGxldCBrZXlTdGFydCA9IGtleVxuICAgICAgaWYgKHN0YXJ0ICE9PSAnJykge1xuICAgICAgICBrZXlTdGFydCA9IGAke3N0YXJ0fS0ke2tleX1gXG4gICAgICB9XG5cbiAgICAgIG5ld09ialtrZXldID0gZ2V0QXR0cmlidXRlc0NvbmZpZyhlbGVtZW50LCBvYmpba2V5XSwgYXR0cnMsIGtleVN0YXJ0KVxuICAgICAgcmV0dXJuXG4gICAgfVxuXG4gICAgLy8gdXBkYXRlIHZhbHVlXG4gICAgbGV0IHZhbHVlID0gb2JqW2tleV0gLy8gZGVmYXVsdCB2YWx1ZVxuICAgIGNvbnN0IHR5cGUgPSB0eXBlb2YgdmFsdWVcbiAgICBjb25zdCBhdHRyID0gZ2V0QXR0cmlidXRlKHN0YXJ0LCBrZXkpXG4gICAgY29uc3QgYXR0clZhbHVlID0gZWxlbWVudC5nZXRBdHRyaWJ1dGUoYXR0cilcblxuICAgIGlmIChhdHRyVmFsdWUgIT09IG51bGwpIHtcbiAgICAgIGlmICh0eXBlID09PSAnYm9vbGVhbicpIHtcbiAgICAgICAgLy8gY29udmVydCBzdHJpbmcgdG8gYm9vbGVhblxuICAgICAgICB2YWx1ZSA9IGF0dHJWYWx1ZSA9PT0gJ3RydWUnXG4gICAgICB9IGVsc2UgaWYgKCFpc05hTihhdHRyVmFsdWUpKSB7XG4gICAgICAgIHZhbHVlID0gcGFyc2VJbnQoYXR0clZhbHVlLCAxMClcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHZhbHVlID0gYXR0clZhbHVlXG4gICAgICB9XG4gICAgfVxuXG4gICAgbmV3T2JqW2tleV0gPSB2YWx1ZVxuICB9KVxuXG4gIHJldHVybiBuZXdPYmpcbn1cblxuY29uc3Qgc3RhY2sgPSBbXVxuXG5leHBvcnQgZGVmYXVsdCB7XG4gIGFkZChjb21wb25lbnQpIHtcbiAgICBzdGFjay5wdXNoKGNvbXBvbmVudClcbiAgfSxcbiAgcmVtb3ZlKGNvbXBvbmVudCkge1xuICAgIGNvbnN0IGluZGV4ID0gc3RhY2suZmluZEluZGV4KGMgPT4gT2JqZWN0LmlzKGNvbXBvbmVudCwgYykpXG4gICAgaWYgKGluZGV4ID4gLTEpIHtcbiAgICAgIHN0YWNrLnNwbGljZShpbmRleCwgMSlcbiAgICB9XG4gIH0sXG4gIGNsb3NhYmxlKGNvbXBvbmVudCkge1xuICAgIHJldHVybiBzdGFjay5sZW5ndGggPT09IDAgfHwgT2JqZWN0LmlzKHN0YWNrW3N0YWNrLmxlbmd0aCAtIDFdLCBjb21wb25lbnQpXG4gIH1cbn1cbiIsIi8qKlxuICogLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAqIExpY2Vuc2VkIHVuZGVyIE1JVCAoaHR0cHM6Ly9naXRodWIuY29tL3F1YXJrLWRldi9QaG9ub24tRnJhbWV3b3JrL2Jsb2IvbWFzdGVyL0xJQ0VOU0UpXG4gKiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICovXG5pbXBvcnQgRGlhbG9nIGZyb20gJy4vaW5kZXgnXG5pbXBvcnQgeyBnZXRBdHRyaWJ1dGVzQ29uZmlnIH0gZnJvbSAnLi4vY29tcG9uZW50TWFuYWdlcidcblxuY29uc3QgQ29uZmlybSA9ICgoKSA9PiB7XG5cbiAgLyoqXG4gICAqIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgKiBDb25zdGFudHNcbiAgICogLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAqL1xuXG4gIGNvbnN0IE5BTUUgPSAnY29uZmlybSdcbiAgY29uc3QgREVGQVVMVF9QUk9QRVJUSUVTID0ge1xuICAgIGVsZW1lbnQ6IG51bGwsXG4gICAgdGl0bGU6IG51bGwsXG4gICAgbWVzc2FnZTogbnVsbCxcbiAgICBjYW5jZWxhYmxlOiB0cnVlLFxuICAgIHR5cGU6IE5BTUUsXG4gICAgYnV0dG9uczogW1xuICAgICAge1xuICAgICAgICB0ZXh0OiAnQ2FuY2VsJyxcbiAgICAgICAgZGlzbWlzczogdHJ1ZSxcbiAgICAgICAgY2xhc3M6ICdidG4gYnRuLXNlY29uZGFyeScsXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICB0ZXh0OiAnT2snLFxuICAgICAgICBkaXNtaXNzOiB0cnVlLFxuICAgICAgICBjbGFzczogJ2J0biBidG4tcHJpbWFyeScsXG4gICAgICB9LFxuICAgIF0sXG4gIH1cbiAgY29uc3QgREFUQV9BVFRSU19QUk9QRVJUSUVTID0gW1xuICAgICdjYW5jZWxhYmxlJyxcbiAgXVxuXG4gIC8qKlxuICAgKiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICogQ2xhc3MgRGVmaW5pdGlvblxuICAgKiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICovXG5cbiAgY2xhc3MgQ29uZmlybSBleHRlbmRzIERpYWxvZyB7XG5cbiAgICBjb25zdHJ1Y3RvcihvcHRpb25zID0ge30pIHtcbiAgICAgIGNvbnN0IHRlbXBsYXRlID0gJycgK1xuICAgICAgJzxkaXYgY2xhc3M9XCJkaWFsb2dcIiB0YWJpbmRleD1cIi0xXCIgcm9sZT1cImRpYWxvZ1wiPicgK1xuICAgICAgICAnPGRpdiBjbGFzcz1cImRpYWxvZy1pbm5lclwiIHJvbGU9XCJkb2N1bWVudFwiPicgK1xuICAgICAgICAgICc8ZGl2IGNsYXNzPVwiZGlhbG9nLWNvbnRlbnRcIj4nICtcbiAgICAgICAgICAgICc8ZGl2IGNsYXNzPVwiZGlhbG9nLWhlYWRlclwiPicgK1xuICAgICAgICAgICAgICAnPGg1IGNsYXNzPVwiZGlhbG9nLXRpdGxlXCI+PC9oNT4nICtcbiAgICAgICAgICAgICc8L2Rpdj4nICtcbiAgICAgICAgICAgICc8ZGl2IGNsYXNzPVwiZGlhbG9nLWJvZHlcIj4nICtcbiAgICAgICAgICAgICAgJzxwPjwvcD4nICtcbiAgICAgICAgICAgICc8L2Rpdj4nICtcbiAgICAgICAgICAgICc8ZGl2IGNsYXNzPVwiZGlhbG9nLWZvb3RlclwiPicgK1xuICAgICAgICAgICAgJzwvZGl2PicgK1xuICAgICAgICAgICc8L2Rpdj4nICtcbiAgICAgICAgJzwvZGl2PicgK1xuICAgICAgJzwvZGl2PidcblxuICAgICAgaWYgKCFBcnJheS5pc0FycmF5KG9wdGlvbnMuYnV0dG9ucykpIHtcbiAgICAgICAgb3B0aW9ucy5idXR0b25zID0gREVGQVVMVF9QUk9QRVJUSUVTLmJ1dHRvbnNcbiAgICAgIH1cblxuICAgICAgc3VwZXIob3B0aW9ucywgdGVtcGxhdGUpXG4gICAgfVxuXG4gICAgc3RhdGljIGlkZW50aWZpZXIoKSB7XG4gICAgICByZXR1cm4gTkFNRVxuICAgIH1cblxuICAgIHN0YXRpYyBfRE9NSW50ZXJmYWNlKG9wdGlvbnMpIHtcbiAgICAgIHJldHVybiBuZXcgQ29uZmlybShvcHRpb25zKVxuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICogRE9NIEFwaSBpbXBsZW1lbnRhdGlvblxuICAgKiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICovXG4gIGNvbnN0IGNvbXBvbmVudHMgPSBbXVxuICBjb25zdCBkaWFsb2dzID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChgLiR7RGlhbG9nLmlkZW50aWZpZXIoKX1gKVxuXG4gIGlmIChkaWFsb2dzKSB7XG4gICAgQXJyYXkuZnJvbShkaWFsb2dzKS5mb3JFYWNoKChlbGVtZW50KSA9PiB7XG4gICAgICBjb25zdCBjb25maWcgPSBnZXRBdHRyaWJ1dGVzQ29uZmlnKGVsZW1lbnQsIERFRkFVTFRfUFJPUEVSVElFUywgREFUQV9BVFRSU19QUk9QRVJUSUVTKVxuICAgICAgY29uZmlnLmVsZW1lbnQgPSBlbGVtZW50XG5cbiAgICAgIGlmIChjb25maWcudHlwZSA9PT0gTkFNRSkge1xuICAgICAgICAvLyBjb25maXJtXG4gICAgICAgIGNvbXBvbmVudHMucHVzaChuZXcgQ29uZmlybShjb25maWcpKVxuICAgICAgfVxuICAgIH0pXG4gIH1cblxuICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIChldmVudCkgPT4ge1xuICAgIGNvbnN0IGRhdGFUb2dnbGVBdHRyID0gZXZlbnQudGFyZ2V0LmdldEF0dHJpYnV0ZSgnZGF0YS10b2dnbGUnKVxuICAgIGlmIChkYXRhVG9nZ2xlQXR0ciAmJiBkYXRhVG9nZ2xlQXR0ciA9PT0gTkFNRSkge1xuICAgICAgY29uc3QgaWQgPSBldmVudC50YXJnZXQuZ2V0QXR0cmlidXRlKCdkYXRhLXRhcmdldCcpXG4gICAgICBjb25zdCBlbGVtZW50ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihpZClcblxuICAgICAgY29uc3QgY29tcG9uZW50ID0gY29tcG9uZW50cy5maW5kKGMgPT4gYy5lbGVtZW50ID09PSBlbGVtZW50KVxuXG4gICAgICBpZiAoIWNvbXBvbmVudCkge1xuICAgICAgICByZXR1cm5cbiAgICAgIH1cblxuICAgICAgLy8gcmVtb3ZlIHRoZSBmb2N1cyBzdGF0ZSBvZiB0aGUgdHJpZ2dlclxuICAgICAgZXZlbnQudGFyZ2V0LmJsdXIoKVxuXG4gICAgICBjb21wb25lbnQuZGlhbG9nLnNob3coKVxuICAgIH1cbiAgfSlcblxuICByZXR1cm4gQ29uZmlybVxufSkoKVxuXG5leHBvcnQgZGVmYXVsdCBDb25maXJtXG4iLCIvKipcbiAqIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gKiBMaWNlbnNlZCB1bmRlciBNSVQgKGh0dHBzOi8vZ2l0aHViLmNvbS9xdWFyay1kZXYvUGhvbm9uLUZyYW1ld29yay9ibG9iL21hc3Rlci9MSUNFTlNFKVxuICogLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAqL1xuaW1wb3J0IEV2ZW50IGZyb20gJy4uLy4uL2NvbW1vbi9ldmVudHMnXG5pbXBvcnQgQ29tcG9uZW50IGZyb20gJy4uL2NvbXBvbmVudCdcbmltcG9ydCB7IGdldEF0dHJpYnV0ZXNDb25maWcgfSBmcm9tICcuLi9jb21wb25lbnRNYW5hZ2VyJ1xuXG5jb25zdCBEaWFsb2cgPSAoKCkgPT4ge1xuICAvKipcbiAgICogLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAqIENvbnN0YW50c1xuICAgKiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICovXG5cbiAgY29uc3QgTkFNRSA9ICdkaWFsb2cnXG4gIGNvbnN0IFZFUlNJT04gPSAnMi4wLjAnXG4gIGNvbnN0IEJBQ0tEUk9QX1NFTEVDVE9SID0gJ2RpYWxvZy1iYWNrZHJvcCdcbiAgY29uc3QgREVGQVVMVF9QUk9QRVJUSUVTID0ge1xuICAgIGVsZW1lbnQ6IG51bGwsXG4gICAgdGl0bGU6IG51bGwsXG4gICAgbWVzc2FnZTogbnVsbCxcbiAgICBjYW5jZWxhYmxlOiB0cnVlLFxuICAgIGJ1dHRvbnM6IFtcbiAgICAgIHtcbiAgICAgICAgdGV4dDogJ09rJyxcbiAgICAgICAgZGlzbWlzczogdHJ1ZSxcbiAgICAgICAgY2xhc3M6ICdidG4gYnRuLXByaW1hcnknLFxuICAgICAgfSxcbiAgICBdLFxuICB9XG4gIGNvbnN0IERBVEFfQVRUUlNfUFJPUEVSVElFUyA9IFtcbiAgICAnY2FuY2VsYWJsZScsXG4gIF1cblxuICAvKipcbiAgICogLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAqIENsYXNzIERlZmluaXRpb25cbiAgICogLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAqL1xuXG4gIGNsYXNzIERpYWxvZyBleHRlbmRzIENvbXBvbmVudCB7XG5cbiAgICBjb25zdHJ1Y3RvcihvcHRpb25zID0ge30sIHRlbXBsYXRlID0gbnVsbCkge1xuICAgICAgc3VwZXIoTkFNRSwgVkVSU0lPTiwgREVGQVVMVF9QUk9QRVJUSUVTLCBvcHRpb25zLCBEQVRBX0FUVFJTX1BST1BFUlRJRVMsIHRydWUsIHRydWUpXG5cbiAgICAgIHRoaXMudGVtcGxhdGUgPSB0ZW1wbGF0ZSB8fCAnJyArXG4gICAgICAnPGRpdiBjbGFzcz1cImRpYWxvZ1wiIHRhYmluZGV4PVwiLTFcIiByb2xlPVwiZGlhbG9nXCI+JyArXG4gICAgICAgICc8ZGl2IGNsYXNzPVwiZGlhbG9nLWlubmVyXCIgcm9sZT1cImRvY3VtZW50XCI+JyArXG4gICAgICAgICAgJzxkaXYgY2xhc3M9XCJkaWFsb2ctY29udGVudFwiPicgK1xuICAgICAgICAgICAgJzxkaXYgY2xhc3M9XCJkaWFsb2ctaGVhZGVyXCI+JyArXG4gICAgICAgICAgICAgICc8aDUgY2xhc3M9XCJkaWFsb2ctdGl0bGVcIj48L2g1PicgK1xuICAgICAgICAgICAgJzwvZGl2PicgK1xuICAgICAgICAgICAgJzxkaXYgY2xhc3M9XCJkaWFsb2ctYm9keVwiPicgK1xuICAgICAgICAgICAgICAnPHA+PC9wPicgK1xuICAgICAgICAgICAgJzwvZGl2PicgK1xuICAgICAgICAgICAgJzxkaXYgY2xhc3M9XCJkaWFsb2ctZm9vdGVyXCI+JyArXG4gICAgICAgICAgICAnPC9kaXY+JyArXG4gICAgICAgICAgJzwvZGl2PicgK1xuICAgICAgICAnPC9kaXY+JyArXG4gICAgICAnPC9kaXY+J1xuXG4gICAgICBpZiAodGhpcy5keW5hbWljRWxlbWVudCkge1xuICAgICAgICB0aGlzLmJ1aWxkKClcbiAgICAgIH1cbiAgICB9XG5cbiAgICBidWlsZCgpIHtcbiAgICAgIGNvbnN0IGJ1aWxkZXIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKVxuXG4gICAgICBidWlsZGVyLmlubmVySFRNTCA9IHRoaXMudGVtcGxhdGVcblxuICAgICAgdGhpcy5vcHRpb25zLmVsZW1lbnQgPSBidWlsZGVyLmZpcnN0Q2hpbGRcblxuICAgICAgLy8gdGl0bGVcbiAgICAgIGlmICh0aGlzLm9wdGlvbnMudGl0bGUgIT09IG51bGwpIHtcbiAgICAgICAgdGhpcy5vcHRpb25zLmVsZW1lbnQucXVlcnlTZWxlY3RvcignLmRpYWxvZy10aXRsZScpLmlubmVySFRNTCA9IHRoaXMub3B0aW9ucy50aXRsZVxuICAgICAgfVxuXG4gICAgICAvLyBtZXNzYWdlXG4gICAgICBpZiAodGhpcy5vcHRpb25zLm1lc3NhZ2UgIT09IG51bGwpIHtcbiAgICAgICAgdGhpcy5vcHRpb25zLmVsZW1lbnQucXVlcnlTZWxlY3RvcignLmRpYWxvZy1ib2R5JykuZmlyc3RDaGlsZC5pbm5lckhUTUwgPSB0aGlzLm9wdGlvbnMubWVzc2FnZVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgLy8gcmVtb3ZlIHBhcmFncmFwaCBub2RlXG4gICAgICAgIHRoaXMucmVtb3ZlVGV4dEJvZHkoKVxuICAgICAgfVxuXG4gICAgICAvLyBidXR0b25zXG4gICAgICBpZiAodGhpcy5vcHRpb25zLmJ1dHRvbnMgIT09IG51bGwgJiYgQXJyYXkuaXNBcnJheSh0aGlzLm9wdGlvbnMuYnV0dG9ucykpIHtcbiAgICAgICAgaWYgKHRoaXMub3B0aW9ucy5idXR0b25zLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICB0aGlzLm9wdGlvbnMuYnV0dG9ucy5mb3JFYWNoKChidXR0b24pID0+IHtcbiAgICAgICAgICAgIHRoaXMub3B0aW9ucy5lbGVtZW50LnF1ZXJ5U2VsZWN0b3IoJy5kaWFsb2ctZm9vdGVyJykuYXBwZW5kQ2hpbGQodGhpcy5idWlsZEJ1dHRvbihidXR0b24pKVxuICAgICAgICAgIH0pXG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgdGhpcy5yZW1vdmVGb290ZXIoKVxuICAgICAgICB9XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLnJlbW92ZUZvb3RlcigpXG4gICAgICB9XG5cbiAgICAgIGRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQodGhpcy5vcHRpb25zLmVsZW1lbnQpXG5cbiAgICAgIHRoaXMuc2V0QXR0cmlidXRlcygpXG4gICAgfVxuXG4gICAgYnVpbGRCdXR0b24oYnV0dG9uSW5mbyA9IHt9KSB7XG4gICAgICBjb25zdCBidXR0b24gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdidXR0b24nKVxuICAgICAgYnV0dG9uLnNldEF0dHJpYnV0ZSgndHlwZScsICdidXR0b24nKVxuICAgICAgYnV0dG9uLnNldEF0dHJpYnV0ZSgnY2xhc3MnLCBidXR0b25JbmZvLmNsYXNzIHx8ICdidG4nKVxuICAgICAgYnV0dG9uLmlubmVySFRNTCA9IGJ1dHRvbkluZm8udGV4dFxuXG4gICAgICBpZiAoYnV0dG9uSW5mby5kaXNtaXNzKSB7XG4gICAgICAgIGJ1dHRvbi5zZXRBdHRyaWJ1dGUoJ2RhdGEtZGlzbWlzcycsIE5BTUUpXG4gICAgICB9XG5cbiAgICAgIHJldHVybiBidXR0b25cbiAgICB9XG5cbiAgICBidWlsZEJhY2tkcm9wKCkge1xuICAgICAgY29uc3QgYmFja2Ryb3AgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKVxuICAgICAgYmFja2Ryb3Auc2V0QXR0cmlidXRlKCdkYXRhLWlkJywgdGhpcy5pZClcbiAgICAgIGJhY2tkcm9wLmNsYXNzTGlzdC5hZGQoQkFDS0RST1BfU0VMRUNUT1IpXG5cbiAgICAgIGRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQoYmFja2Ryb3ApXG4gICAgfVxuXG4gICAgZ2V0QmFja2Ryb3AoKSB7XG4gICAgICByZXR1cm4gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihgLiR7QkFDS0RST1BfU0VMRUNUT1J9W2RhdGEtaWQ9XCIke3RoaXMuaWR9XCJdYClcbiAgICB9XG5cbiAgICByZW1vdmVUZXh0Qm9keSgpIHtcbiAgICAgIHRoaXMub3B0aW9ucy5lbGVtZW50LnF1ZXJ5U2VsZWN0b3IoJy5kaWFsb2ctYm9keScpLnJlbW92ZUNoaWxkKHRoaXMub3B0aW9ucy5lbGVtZW50LnF1ZXJ5U2VsZWN0b3IoJy5kaWFsb2ctYm9keScpLmZpcnN0Q2hpbGQpICAgICAgXG4gICAgfVxuXG4gICAgcmVtb3ZlRm9vdGVyKCkge1xuICAgICAgY29uc3QgZm9vdGVyID0gdGhpcy5vcHRpb25zLmVsZW1lbnQucXVlcnlTZWxlY3RvcignLmRpYWxvZy1mb290ZXInKSAgICAgIFxuICAgICAgdGhpcy5vcHRpb25zLmVsZW1lbnQucXVlcnlTZWxlY3RvcignLmRpYWxvZy1jb250ZW50JykucmVtb3ZlQ2hpbGQoZm9vdGVyKVxuICAgIH1cblxuICAgIGNlbnRlcigpIHtcbiAgICAgIGNvbnN0IGNvbXB1dGVkU3R5bGUgPSB3aW5kb3cuZ2V0Q29tcHV0ZWRTdHlsZSh0aGlzLm9wdGlvbnMuZWxlbWVudClcbiAgICAgIGNvbnN0IGhlaWdodCA9IGNvbXB1dGVkU3R5bGUuaGVpZ2h0LnNsaWNlKDAsIGNvbXB1dGVkU3R5bGUuaGVpZ2h0Lmxlbmd0aCAtIDIpXG5cbiAgICAgIGNvbnN0IHRvcCA9ICh3aW5kb3cuaW5uZXJIZWlnaHQgLyAyKSAtIChoZWlnaHQgLyAyKVxuICAgICAgdGhpcy5vcHRpb25zLmVsZW1lbnQuc3R5bGUudG9wID0gYCR7dG9wfXB4YFxuICAgIH1cblxuICAgIHNob3coKSB7XG4gICAgICBpZiAodGhpcy5vcHRpb25zLmVsZW1lbnQgPT09IG51bGwpIHtcbiAgICAgICAgLy8gYnVpbGQgYW5kIGluc2VydCBhIG5ldyBET00gZWxlbWVudFxuICAgICAgICB0aGlzLmJ1aWxkKClcbiAgICAgIH1cblxuICAgICAgaWYgKHRoaXMub3B0aW9ucy5lbGVtZW50LmNsYXNzTGlzdC5jb250YWlucygnc2hvdycpKSB7XG4gICAgICAgIHJldHVybiBmYWxzZVxuICAgICAgfVxuXG4gICAgICAvLyBhZGQgYSB0aW1lb3V0IHNvIHRoYXQgdGhlIENTUyBhbmltYXRpb24gd29ya3NcbiAgICAgIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgICB0aGlzLnRyaWdnZXJFdmVudChFdmVudC5TSE9XKVxuICAgICAgICB0aGlzLmJ1aWxkQmFja2Ryb3AoKVxuXG4gICAgICAgIGNvbnN0IG9uU2hvd24gPSAoKSA9PiB7XG4gICAgICAgICAgdGhpcy50cmlnZ2VyRXZlbnQoRXZlbnQuU0hPV04pXG4gICAgICAgICAgdGhpcy5vcHRpb25zLmVsZW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcihFdmVudC5UUkFOU0lUSU9OX0VORCwgb25TaG93bilcblxuICAgICAgICAgIC8vIGF0dGFjaCBldmVudFxuICAgICAgICAgIHRoaXMuYXR0YWNoRXZlbnRzKClcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMub3B0aW9ucy5lbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIoRXZlbnQuVFJBTlNJVElPTl9FTkQsIG9uU2hvd24pXG5cbiAgICAgICAgdGhpcy5vcHRpb25zLmVsZW1lbnQuY2xhc3NMaXN0LmFkZCgnc2hvdycpXG5cbiAgICAgICAgdGhpcy5jZW50ZXIoKVxuICAgICAgfSwgMTApXG5cbiAgICAgIHJldHVybiB0cnVlXG4gICAgfVxuXG4gICAgb25FbGVtZW50RXZlbnQoZXZlbnQpIHtcbiAgICAgIGlmIChldmVudC50eXBlID09PSAna2V5dXAnICYmIGV2ZW50LmtleUNvZGUgIT09IDI3ICYmIGV2ZW50LmtleUNvZGUgIT09IDEzKSB7XG4gICAgICAgIHJldHVyblxuICAgICAgfVxuXG4gICAgICAvLyBoaWRlIHRoZSBkaWFsb2dcbiAgICAgIHRoaXMuaGlkZSgpXG4gICAgfVxuXG4gICAgaGlkZSgpIHtcbiAgICAgIGlmICghdGhpcy5vcHRpb25zLmVsZW1lbnQuY2xhc3NMaXN0LmNvbnRhaW5zKCdzaG93JykpIHtcbiAgICAgICAgcmV0dXJuIGZhbHNlXG4gICAgICB9XG5cbiAgICAgIHRoaXMudHJpZ2dlckV2ZW50KEV2ZW50LkhJREUpXG5cbiAgICAgIHRoaXMuZGV0YWNoRXZlbnRzKClcblxuICAgICAgdGhpcy5vcHRpb25zLmVsZW1lbnQuY2xhc3NMaXN0LmFkZCgnaGlkZScpXG4gICAgICB0aGlzLm9wdGlvbnMuZWxlbWVudC5jbGFzc0xpc3QucmVtb3ZlKCdzaG93JylcblxuICAgICAgY29uc3QgYmFja2Ryb3AgPSB0aGlzLmdldEJhY2tkcm9wKClcblxuICAgICAgY29uc3Qgb25IaWRkZW4gPSAoKSA9PiB7XG4gICAgICAgIGRvY3VtZW50LmJvZHkucmVtb3ZlQ2hpbGQoYmFja2Ryb3ApXG5cbiAgICAgICAgdGhpcy5vcHRpb25zLmVsZW1lbnQuY2xhc3NMaXN0LnJlbW92ZSgnaGlkZScpXG5cbiAgICAgICAgdGhpcy50cmlnZ2VyRXZlbnQoRXZlbnQuSElEREVOKVxuXG4gICAgICAgIGJhY2tkcm9wLnJlbW92ZUV2ZW50TGlzdGVuZXIoRXZlbnQuVFJBTlNJVElPTl9FTkQsIG9uSGlkZGVuKVxuXG4gICAgICAgIC8vIHJlbW92ZSBnZW5lcmF0ZWQgZGlhbG9ncyBmcm9tIHRoZSBET01cbiAgICAgICAgaWYgKHRoaXMuZHluYW1pY0VsZW1lbnQpIHtcbiAgICAgICAgICBkb2N1bWVudC5ib2R5LnJlbW92ZUNoaWxkKHRoaXMub3B0aW9ucy5lbGVtZW50KVxuICAgICAgICAgIHRoaXMub3B0aW9ucy5lbGVtZW50ID0gbnVsbFxuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIGJhY2tkcm9wLmFkZEV2ZW50TGlzdGVuZXIoRXZlbnQuVFJBTlNJVElPTl9FTkQsIG9uSGlkZGVuKVxuICAgICAgYmFja2Ryb3AuY2xhc3NMaXN0LmFkZCgnZmFkZW91dCcpXG5cbiAgICAgIHJldHVybiB0cnVlXG4gICAgfVxuXG4gICAgYXR0YWNoRXZlbnRzKCkge1xuICAgICAgY29uc3QgZGlzbWlzc0J1dHRvbnMgPSB0aGlzLm9wdGlvbnMuZWxlbWVudC5xdWVyeVNlbGVjdG9yQWxsKCdbZGF0YS1kaXNtaXNzXScpXG4gICAgICBpZiAoZGlzbWlzc0J1dHRvbnMpIHtcbiAgICAgICAgQXJyYXkuZnJvbShkaXNtaXNzQnV0dG9ucykuZm9yRWFjaChidXR0b24gPT4gdGhpcy5yZWdpc3RlckVsZW1lbnQoeyB0YXJnZXQ6IGJ1dHRvbiwgZXZlbnQ6ICdjbGljaycgfSkpXG4gICAgICB9XG5cbiAgICAgIC8vIGFkZCBldmVudHMgaWYgdGhlIGRpYWxvZyBpcyBjYW5jZWxhYmxlXG4gICAgICAvLyB3aGljaCBtZWFucyB0aGUgdXNlciBjYW4gaGlkZSB0aGUgZGlhbG9nXG4gICAgICAvLyBieSBwcmVzc2luZyB0aGUgRVNDIGtleSBvciBjbGljayBvdXRzaWRlIHRoZSBiYWNrZHJvcFxuICAgICAgaWYgKHRoaXMub3B0aW9ucy5jYW5jZWxhYmxlKSB7XG4gICAgICAgIGNvbnN0IGJhY2tkcm9wID0gdGhpcy5nZXRCYWNrZHJvcCgpXG4gICAgICAgIHRoaXMucmVnaXN0ZXJFbGVtZW50KHsgdGFyZ2V0OiBiYWNrZHJvcCwgZXZlbnQ6IEV2ZW50LlNUQVJUIH0pXG4gICAgICAgIHRoaXMucmVnaXN0ZXJFbGVtZW50KHsgdGFyZ2V0OiBkb2N1bWVudCwgZXZlbnQ6ICdrZXl1cCcgfSlcbiAgICAgIH1cbiAgICB9XG5cbiAgICBkZXRhY2hFdmVudHMoKSB7XG4gICAgICBjb25zdCBkaXNtaXNzQnV0dG9ucyA9IHRoaXMub3B0aW9ucy5lbGVtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJ1tkYXRhLWRpc21pc3NdJylcbiAgICAgIGlmIChkaXNtaXNzQnV0dG9ucykge1xuICAgICAgICBBcnJheS5mcm9tKGRpc21pc3NCdXR0b25zKS5mb3JFYWNoKGJ1dHRvbiA9PiB0aGlzLnVucmVnaXN0ZXJFbGVtZW50KHsgdGFyZ2V0OiBidXR0b24sIGV2ZW50OiAnY2xpY2snIH0pKVxuICAgICAgfVxuXG4gICAgICBpZiAodGhpcy5vcHRpb25zLmNhbmNlbGFibGUpIHtcbiAgICAgICAgY29uc3QgYmFja2Ryb3AgPSB0aGlzLmdldEJhY2tkcm9wKClcbiAgICAgICAgdGhpcy51bnJlZ2lzdGVyRWxlbWVudCh7IHRhcmdldDogYmFja2Ryb3AsIGV2ZW50OiBFdmVudC5TVEFSVCB9KVxuICAgICAgICB0aGlzLnVucmVnaXN0ZXJFbGVtZW50KHsgdGFyZ2V0OiBkb2N1bWVudCwgZXZlbnQ6ICdrZXl1cCcgfSlcbiAgICAgIH1cbiAgICB9XG5cbiAgICBzdGF0aWMgaWRlbnRpZmllcigpIHtcbiAgICAgIHJldHVybiBOQU1FXG4gICAgfVxuXG4gICAgc3RhdGljIF9ET01JbnRlcmZhY2Uob3B0aW9ucykge1xuICAgICAgcmV0dXJuIHN1cGVyLl9ET01JbnRlcmZhY2UoRGlhbG9nLCBvcHRpb25zKVxuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICogRE9NIEFwaSBpbXBsZW1lbnRhdGlvblxuICAgKiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICovXG4gIGNvbnN0IGNvbXBvbmVudHMgPSBbXVxuXG4gIGNvbnN0IGRpYWxvZ3MgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKGAuJHtOQU1FfWApXG4gIGlmIChkaWFsb2dzKSB7XG4gICAgQXJyYXkuZnJvbShkaWFsb2dzKS5mb3JFYWNoKChlbGVtZW50KSA9PiB7XG4gICAgICBjb25zdCBjb25maWcgPSBnZXRBdHRyaWJ1dGVzQ29uZmlnKGVsZW1lbnQsIERFRkFVTFRfUFJPUEVSVElFUywgREFUQV9BVFRSU19QUk9QRVJUSUVTKVxuICAgICAgY29uZmlnLmVsZW1lbnQgPSBlbGVtZW50XG5cbiAgICAgIGNvbXBvbmVudHMucHVzaCh7IGVsZW1lbnQsIGRpYWxvZzogbmV3IERpYWxvZyhjb25maWcpIH0pXG4gICAgfSlcbiAgfVxuXG4gIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKGV2ZW50KSA9PiB7XG4gICAgY29uc3QgZGF0YVRvZ2dsZUF0dHIgPSBldmVudC50YXJnZXQuZ2V0QXR0cmlidXRlKCdkYXRhLXRvZ2dsZScpXG4gICAgaWYgKGRhdGFUb2dnbGVBdHRyICYmIGRhdGFUb2dnbGVBdHRyID09PSBOQU1FKSB7XG4gICAgICBjb25zdCBpZCA9IGV2ZW50LnRhcmdldC5nZXRBdHRyaWJ1dGUoJ2RhdGEtdGFyZ2V0JylcbiAgICAgIGNvbnN0IGVsZW1lbnQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKGlkKVxuXG4gICAgICBjb25zdCBjb21wb25lbnQgPSBjb21wb25lbnRzLmZpbmQoYyA9PiBjLmVsZW1lbnQgPT09IGVsZW1lbnQpXG5cbiAgICAgIGlmICghY29tcG9uZW50KSB7XG4gICAgICAgIHJldHVyblxuICAgICAgfVxuXG4gICAgICAvLyByZW1vdmUgdGhlIGZvY3VzIHN0YXRlIG9mIHRoZSB0cmlnZ2VyXG4gICAgICBldmVudC50YXJnZXQuYmx1cigpXG5cbiAgICAgIGNvbXBvbmVudC5kaWFsb2cuc2hvdygpXG4gICAgfVxuICB9KVxuXG4gIHJldHVybiBEaWFsb2dcbn0pKClcblxuZXhwb3J0IGRlZmF1bHQgRGlhbG9nXG4iLCIvKipcbiAqIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gKiBMaWNlbnNlZCB1bmRlciBNSVQgKGh0dHBzOi8vZ2l0aHViLmNvbS9xdWFyay1kZXYvUGhvbm9uLUZyYW1ld29yay9ibG9iL21hc3Rlci9MSUNFTlNFKVxuICogLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAqL1xuaW1wb3J0IERpYWxvZyBmcm9tICcuL2luZGV4J1xuaW1wb3J0IFNwaW5uZXIgZnJvbSAnLi4vbG9hZGVyL2luZGV4J1xuaW1wb3J0IHsgZ2V0QXR0cmlidXRlc0NvbmZpZyB9IGZyb20gJy4uL2NvbXBvbmVudE1hbmFnZXInXG5cbmNvbnN0IExvYWRlciA9ICgoKSA9PiB7XG5cbiAgLyoqXG4gICAqIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgKiBDb25zdGFudHNcbiAgICogLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAqL1xuXG4gIGNvbnN0IE5BTUUgPSAnbG9hZGVyJ1xuICBjb25zdCBERUZBVUxUX1BST1BFUlRJRVMgPSB7XG4gICAgZWxlbWVudDogbnVsbCxcbiAgICB0aXRsZTogbnVsbCxcbiAgICBtZXNzYWdlOiBudWxsLFxuICAgIGNhbmNlbGFibGU6IHRydWUsXG4gICAgdHlwZTogTkFNRSxcbiAgICBidXR0b25zOiBbXG4gICAgICB7XG4gICAgICAgIHRleHQ6ICdDYW5jZWwnLFxuICAgICAgICBkaXNtaXNzOiB0cnVlLFxuICAgICAgICBjbGFzczogJ2J0biBidG4tcHJpbWFyeScsXG4gICAgICB9LFxuICAgIF0sXG4gIH1cbiAgY29uc3QgREFUQV9BVFRSU19QUk9QRVJUSUVTID0gW1xuICAgICdjYW5jZWxhYmxlJyxcbiAgXVxuXG4gIC8qKlxuICAgKiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICogQ2xhc3MgRGVmaW5pdGlvblxuICAgKiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICovXG5cbiAgY2xhc3MgTG9hZGVyIGV4dGVuZHMgRGlhbG9nIHtcblxuICAgIGNvbnN0cnVjdG9yKG9wdGlvbnMgPSB7fSkge1xuICAgICAgY29uc3QgdGVtcGxhdGUgPSAnJyArXG4gICAgICAnPGRpdiBjbGFzcz1cImRpYWxvZ1wiIHRhYmluZGV4PVwiLTFcIiByb2xlPVwiZGlhbG9nXCI+JyArXG4gICAgICAgICc8ZGl2IGNsYXNzPVwiZGlhbG9nLWlubmVyXCIgcm9sZT1cImRvY3VtZW50XCI+JyArXG4gICAgICAgICAgJzxkaXYgY2xhc3M9XCJkaWFsb2ctY29udGVudFwiPicgK1xuICAgICAgICAgICAgJzxkaXYgY2xhc3M9XCJkaWFsb2ctaGVhZGVyXCI+JyArXG4gICAgICAgICAgICAgICc8aDUgY2xhc3M9XCJkaWFsb2ctdGl0bGVcIj48L2g1PicgK1xuICAgICAgICAgICAgJzwvZGl2PicgK1xuICAgICAgICAgICAgJzxkaXYgY2xhc3M9XCJkaWFsb2ctYm9keVwiPicgK1xuICAgICAgICAgICAgICAnPHA+PC9wPicgK1xuICAgICAgICAgICAgICAnPGRpdiBjbGFzcz1cIm14LWF1dG8gdGV4dC1jZW50ZXJcIj4nICtcbiAgICAgICAgICAgICAgICAnPGRpdiBjbGFzcz1cImxvYWRlciBteC1hdXRvIGQtYmxvY2tcIj4nICtcbiAgICAgICAgICAgICAgICAgICc8ZGl2IGNsYXNzPVwibG9hZGVyLXNwaW5uZXJcIj48L2Rpdj4nICtcbiAgICAgICAgICAgICAgICAnPC9kaXY+JyArXG4gICAgICAgICAgICAgICc8L2Rpdj4nICtcbiAgICAgICAgICAgICc8L2Rpdj4nICtcbiAgICAgICAgICAgICc8ZGl2IGNsYXNzPVwiZGlhbG9nLWZvb3RlclwiPicgK1xuICAgICAgICAgICAgJzwvZGl2PicgK1xuICAgICAgICAgICc8L2Rpdj4nICtcbiAgICAgICAgJzwvZGl2PicgK1xuICAgICAgJzwvZGl2PidcblxuICAgICAgaWYgKCFBcnJheS5pc0FycmF5KG9wdGlvbnMuYnV0dG9ucykpIHtcbiAgICAgICAgb3B0aW9ucy5idXR0b25zID0gb3B0aW9ucy5jYW5jZWxhYmxlID8gREVGQVVMVF9QUk9QRVJUSUVTLmJ1dHRvbnMgOiBbXVxuICAgICAgfVxuXG4gICAgICBzdXBlcihvcHRpb25zLCB0ZW1wbGF0ZSlcblxuICAgICAgdGhpcy5zcGlubmVyID0gbnVsbFxuICAgIH1cblxuICAgIHNob3coKSB7XG4gICAgICBzdXBlci5zaG93KClcblxuICAgICAgdGhpcy5zcGlubmVyID0gbmV3IFNwaW5uZXIoe2VsZW1lbnQ6IHRoaXMuZ2V0RWxlbWVudCgpLnF1ZXJ5U2VsZWN0b3IoJy5sb2FkZXInKX0pXG4gICAgICB0aGlzLnNwaW5uZXIuYW5pbWF0ZSh0cnVlKVxuICAgIH1cblxuICAgIGhpZGUoKSB7XG4gICAgICBzdXBlci5oaWRlKClcblxuICAgICAgdGhpcy5zcGlubmVyLmFuaW1hdGUoZmFsc2UpXG4gICAgICB0aGlzLnNwaW5uZXIgPSBudWxsXG4gICAgfVxuXG4gICAgc3RhdGljIGlkZW50aWZpZXIoKSB7XG4gICAgICByZXR1cm4gTkFNRVxuICAgIH1cblxuICAgIHN0YXRpYyBfRE9NSW50ZXJmYWNlKG9wdGlvbnMpIHtcbiAgICAgIHJldHVybiBuZXcgTG9hZGVyKG9wdGlvbnMpXG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgKiBET00gQXBpIGltcGxlbWVudGF0aW9uXG4gICAqIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgKi9cbiAgY29uc3QgY29tcG9uZW50cyA9IFtdXG4gIGNvbnN0IGRpYWxvZ3MgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKGAuJHtEaWFsb2cuaWRlbnRpZmllcigpfWApXG5cbiAgaWYgKGRpYWxvZ3MpIHtcbiAgICBBcnJheS5mcm9tKGRpYWxvZ3MpLmZvckVhY2goKGVsZW1lbnQpID0+IHtcbiAgICAgIGNvbnN0IGNvbmZpZyA9IGdldEF0dHJpYnV0ZXNDb25maWcoZWxlbWVudCwgREVGQVVMVF9QUk9QRVJUSUVTLCBEQVRBX0FUVFJTX1BST1BFUlRJRVMpXG4gICAgICBjb25maWcuZWxlbWVudCA9IGVsZW1lbnRcblxuICAgICAgaWYgKGNvbmZpZy50eXBlID09PSBOQU1FKSB7XG4gICAgICAgIC8vIGxvYWRlclxuICAgICAgICBjb21wb25lbnRzLnB1c2gobmV3IExvYWRlcihjb25maWcpKVxuICAgICAgfVxuICAgIH0pXG4gIH1cblxuICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIChldmVudCkgPT4ge1xuICAgIGNvbnN0IGRhdGFUb2dnbGVBdHRyID0gZXZlbnQudGFyZ2V0LmdldEF0dHJpYnV0ZSgnZGF0YS10b2dnbGUnKVxuICAgIGlmIChkYXRhVG9nZ2xlQXR0ciAmJiBkYXRhVG9nZ2xlQXR0ciA9PT0gTkFNRSkge1xuICAgICAgY29uc3QgaWQgPSBldmVudC50YXJnZXQuZ2V0QXR0cmlidXRlKCdkYXRhLXRhcmdldCcpXG4gICAgICBjb25zdCBlbGVtZW50ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihpZClcblxuICAgICAgY29uc3QgY29tcG9uZW50ID0gY29tcG9uZW50cy5maW5kKGMgPT4gYy5lbGVtZW50ID09PSBlbGVtZW50KVxuXG4gICAgICBpZiAoIWNvbXBvbmVudCkge1xuICAgICAgICByZXR1cm5cbiAgICAgIH1cblxuICAgICAgLy8gcmVtb3ZlIHRoZSBmb2N1cyBzdGF0ZSBvZiB0aGUgdHJpZ2dlclxuICAgICAgZXZlbnQudGFyZ2V0LmJsdXIoKVxuXG4gICAgICBjb21wb25lbnQuZGlhbG9nLnNob3coKVxuICAgIH1cbiAgfSlcblxuICByZXR1cm4gTG9hZGVyXG59KSgpXG5cbmV4cG9ydCBkZWZhdWx0IExvYWRlclxuIiwiLyoqXG4gKiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICogTGljZW5zZWQgdW5kZXIgTUlUIChodHRwczovL2dpdGh1Yi5jb20vcXVhcmstZGV2L1Bob25vbi1GcmFtZXdvcmsvYmxvYi9tYXN0ZXIvTElDRU5TRSlcbiAqIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gKi9cbmltcG9ydCBEaWFsb2cgZnJvbSAnLi9pbmRleCdcbmltcG9ydCB7IGdldEF0dHJpYnV0ZXNDb25maWcgfSBmcm9tICcuLi9jb21wb25lbnRNYW5hZ2VyJ1xuXG5jb25zdCBQcm9tcHQgPSAoKCkgPT4ge1xuXG4gIC8qKlxuICAgKiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICogQ29uc3RhbnRzXG4gICAqIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgKi9cblxuICBjb25zdCBOQU1FID0gJ3Byb21wdCdcbiAgY29uc3QgREVGQVVMVF9QUk9QRVJUSUVTID0ge1xuICAgIGVsZW1lbnQ6IG51bGwsXG4gICAgdGl0bGU6IG51bGwsXG4gICAgbWVzc2FnZTogbnVsbCxcbiAgICBjYW5jZWxhYmxlOiB0cnVlLFxuICAgIHR5cGU6IE5BTUUsXG4gICAgYnV0dG9uczogW1xuICAgICAge1xuICAgICAgICB0ZXh0OiAnQ2FuY2VsJyxcbiAgICAgICAgZGlzbWlzczogdHJ1ZSxcbiAgICAgICAgY2xhc3M6ICdidG4gYnRuLXNlY29uZGFyeScsXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICB0ZXh0OiAnT2snLFxuICAgICAgICBkaXNtaXNzOiB0cnVlLFxuICAgICAgICBjbGFzczogJ2J0biBidG4tcHJpbWFyeScsXG4gICAgICB9LFxuICAgIF0sXG4gIH1cbiAgY29uc3QgREFUQV9BVFRSU19QUk9QRVJUSUVTID0gW1xuICAgICdjYW5jZWxhYmxlJyxcbiAgXVxuXG4gIC8qKlxuICAgKiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICogQ2xhc3MgRGVmaW5pdGlvblxuICAgKiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICovXG5cbiAgY2xhc3MgUHJvbXB0IGV4dGVuZHMgRGlhbG9nIHtcblxuICAgIGNvbnN0cnVjdG9yKG9wdGlvbnMgPSB7fSkge1xuICAgICAgY29uc3QgdGVtcGxhdGUgPSAnJyArXG4gICAgICAnPGRpdiBjbGFzcz1cImRpYWxvZ1wiIHRhYmluZGV4PVwiLTFcIiByb2xlPVwiZGlhbG9nXCI+JyArXG4gICAgICAgICc8ZGl2IGNsYXNzPVwiZGlhbG9nLWlubmVyXCIgcm9sZT1cImRvY3VtZW50XCI+JyArXG4gICAgICAgICAgJzxkaXYgY2xhc3M9XCJkaWFsb2ctY29udGVudFwiPicgK1xuICAgICAgICAgICAgJzxkaXYgY2xhc3M9XCJkaWFsb2ctaGVhZGVyXCI+JyArXG4gICAgICAgICAgICAgICc8aDUgY2xhc3M9XCJkaWFsb2ctdGl0bGVcIj48L2g1PicgK1xuICAgICAgICAgICAgJzwvZGl2PicgK1xuICAgICAgICAgICAgJzxkaXYgY2xhc3M9XCJkaWFsb2ctYm9keVwiPicgK1xuICAgICAgICAgICAgICAnPHA+PC9wPicgK1xuICAgICAgICAgICAgICAnPGlucHV0IGNsYXNzPVwiZm9ybS1jb250cm9sXCIgdHlwZT1cInRleHRcIiB2YWx1ZT1cIlwiPicgK1xuICAgICAgICAgICAgJzwvZGl2PicgK1xuICAgICAgICAgICAgJzxkaXYgY2xhc3M9XCJkaWFsb2ctZm9vdGVyXCI+JyArXG4gICAgICAgICAgICAnPC9kaXY+JyArXG4gICAgICAgICAgJzwvZGl2PicgK1xuICAgICAgICAnPC9kaXY+JyArXG4gICAgICAnPC9kaXY+J1xuXG4gICAgICBpZiAoIUFycmF5LmlzQXJyYXkob3B0aW9ucy5idXR0b25zKSkge1xuICAgICAgICBvcHRpb25zLmJ1dHRvbnMgPSBERUZBVUxUX1BST1BFUlRJRVMuYnV0dG9uc1xuICAgICAgfVxuXG4gICAgICBzdXBlcihvcHRpb25zLCB0ZW1wbGF0ZSlcbiAgICB9XG5cbiAgICBzaG93KCkge1xuICAgICAgc3VwZXIuc2hvdygpXG4gICAgICB0aGlzLmF0dGFjaElucHV0RXZlbnQoKVxuICAgIH1cblxuICAgIGhpZGUoKSB7XG4gICAgICBzdXBlci5oaWRlKCkgICBcbiAgICAgIHRoaXMuZGV0YWNoSW5wdXRFdmVudCgpICAgXG4gICAgfVxuXG4gICAgZ2V0SW5wdXQoKSB7XG4gICAgICByZXR1cm4gdGhpcy5vcHRpb25zLmVsZW1lbnQucXVlcnlTZWxlY3RvcignLmZvcm0tY29udHJvbCcpXG4gICAgfVxuXG4gICAgYXR0YWNoSW5wdXRFdmVudCgpIHtcbiAgICAgIHRoaXMucmVnaXN0ZXJFbGVtZW50KHsgdGFyZ2V0OiB0aGlzLmdldElucHV0KCksIGV2ZW50OiAna2V5dXAnIH0pXG4gICAgfVxuXG4gICAgZGV0YWNoSW5wdXRFdmVudCgpIHtcbiAgICAgIHRoaXMudW5yZWdpc3RlckVsZW1lbnQoeyB0YXJnZXQ6IHRoaXMuZ2V0SW5wdXQoKSwgZXZlbnQ6ICdrZXl1cCcgfSkgICAgICAgICBcbiAgICB9XG5cbiAgICBvbkVsZW1lbnRFdmVudChldmVudCkge1xuICAgICAgaWYgKGV2ZW50LnRhcmdldCA9PT0gdGhpcy5nZXRJbnB1dCgpKSB7XG4gICAgICAgIHJldHVyblxuICAgICAgfVxuXG4gICAgICBzdXBlci5vbkVsZW1lbnRFdmVudChldmVudClcbiAgICB9XG5cbiAgICBzZXRJbnB1dFZhbHVlKHZhbHVlID0gJycpIHtcbiAgICAgIHRoaXMuZ2V0SW5wdXQoKS52YWx1ZSA9IHZhbHVlXG4gICAgfVxuXG4gICAgZ2V0SW5wdXRWYWx1ZSgpIHtcbiAgICAgIHJldHVybiB0aGlzLmdldElucHV0KCkudmFsdWVcbiAgICB9XG5cbiAgICBzdGF0aWMgaWRlbnRpZmllcigpIHtcbiAgICAgIHJldHVybiBOQU1FXG4gICAgfVxuXG4gICAgc3RhdGljIF9ET01JbnRlcmZhY2Uob3B0aW9ucykge1xuICAgICAgcmV0dXJuIG5ldyBQcm9tcHQob3B0aW9ucylcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAqIERPTSBBcGkgaW1wbGVtZW50YXRpb25cbiAgICogLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAqL1xuICBjb25zdCBjb21wb25lbnRzID0gW11cbiAgY29uc3QgZGlhbG9ncyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoYC4ke0RpYWxvZy5pZGVudGlmaWVyKCl9YClcblxuICBpZiAoZGlhbG9ncykge1xuICAgIEFycmF5LmZyb20oZGlhbG9ncykuZm9yRWFjaCgoZWxlbWVudCkgPT4ge1xuICAgICAgY29uc3QgY29uZmlnID0gZ2V0QXR0cmlidXRlc0NvbmZpZyhlbGVtZW50LCBERUZBVUxUX1BST1BFUlRJRVMsIERBVEFfQVRUUlNfUFJPUEVSVElFUylcbiAgICAgIGNvbmZpZy5lbGVtZW50ID0gZWxlbWVudFxuXG4gICAgICBpZiAoY29uZmlnLnR5cGUgPT09IE5BTUUpIHtcbiAgICAgICAgLy8gcHJvbXB0XG4gICAgICAgIGNvbXBvbmVudHMucHVzaChuZXcgUHJvbXB0KGNvbmZpZykpXG4gICAgICB9XG4gICAgfSlcbiAgfVxuXG4gIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKGV2ZW50KSA9PiB7XG4gICAgY29uc3QgZGF0YVRvZ2dsZUF0dHIgPSBldmVudC50YXJnZXQuZ2V0QXR0cmlidXRlKCdkYXRhLXRvZ2dsZScpXG4gICAgaWYgKGRhdGFUb2dnbGVBdHRyICYmIGRhdGFUb2dnbGVBdHRyID09PSBOQU1FKSB7XG4gICAgICBjb25zdCBpZCA9IGV2ZW50LnRhcmdldC5nZXRBdHRyaWJ1dGUoJ2RhdGEtdGFyZ2V0JylcbiAgICAgIGNvbnN0IGVsZW1lbnQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKGlkKVxuXG4gICAgICBjb25zdCBjb21wb25lbnQgPSBjb21wb25lbnRzLmZpbmQoYyA9PiBjLmVsZW1lbnQgPT09IGVsZW1lbnQpXG5cbiAgICAgIGlmICghY29tcG9uZW50KSB7XG4gICAgICAgIHJldHVyblxuICAgICAgfVxuXG4gICAgICAvLyByZW1vdmUgdGhlIGZvY3VzIHN0YXRlIG9mIHRoZSB0cmlnZ2VyXG4gICAgICBldmVudC50YXJnZXQuYmx1cigpXG5cbiAgICAgIGNvbXBvbmVudC5kaWFsb2cuc2hvdygpXG4gICAgfVxuICB9KVxuXG4gIHJldHVybiBQcm9tcHRcbn0pKClcblxuZXhwb3J0IGRlZmF1bHQgUHJvbXB0XG4iLCIvKipcbiAqIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gKiBMaWNlbnNlZCB1bmRlciBNSVQgKGh0dHBzOi8vZ2l0aHViLmNvbS9xdWFyay1kZXYvUGhvbm9uLUZyYW1ld29yay9ibG9iL21hc3Rlci9MSUNFTlNFKVxuICogLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAqL1xuaW1wb3J0IENvbXBvbmVudCBmcm9tICcuLi9jb21wb25lbnQnXG5pbXBvcnQgRXZlbnQgZnJvbSAnLi4vLi4vY29tbW9uL2V2ZW50cydcbmltcG9ydCB7IGZpbmRUYXJnZXRCeUNsYXNzIH0gZnJvbSAnLi4vLi4vY29tbW9uL3V0aWxzJ1xuaW1wb3J0IHsgZ2V0QXR0cmlidXRlc0NvbmZpZyB9IGZyb20gJy4uL2NvbXBvbmVudE1hbmFnZXInXG5cbmNvbnN0IERyb3Bkb3duID0gKCgpID0+IHtcbiAgLyoqXG4gICAqIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgKiBDb25zdGFudHNcbiAgICogLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAqL1xuXG4gIGNvbnN0IE5BTUUgPSAnZHJvcGRvd24nXG4gIGNvbnN0IFZFUlNJT04gPSAnMi4wLjAnXG4gIGNvbnN0IERFRkFVTFRfUFJPUEVSVElFUyA9IHtcbiAgICBlbGVtZW50OiBudWxsLFxuICAgIGRlZmF1bHQ6IHRydWUsXG4gICAgc2VhcmNoOiBmYWxzZSxcbiAgfVxuICBjb25zdCBEQVRBX0FUVFJTX1BST1BFUlRJRVMgPSBbXG4gICAgJ2RlZmF1bHQnLFxuICAgICdzZWFyY2gnLFxuICBdXG5cbiAgLyoqXG4gICAqIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgKiBDbGFzcyBEZWZpbml0aW9uXG4gICAqIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgKi9cblxuICBjbGFzcyBEcm9wZG93biBleHRlbmRzIENvbXBvbmVudCB7XG5cbiAgICBjb25zdHJ1Y3RvcihvcHRpb25zID0ge30pIHtcbiAgICAgIHN1cGVyKE5BTUUsIFZFUlNJT04sIERFRkFVTFRfUFJPUEVSVElFUywgb3B0aW9ucywgREFUQV9BVFRSU19QUk9QRVJUSUVTLCBmYWxzZSwgZmFsc2UpXG5cbiAgICAgIGNvbnN0IHNlbGVjdGVkID0gdGhpcy5vcHRpb25zLmVsZW1lbnQucXVlcnlTZWxlY3RvcignW2RhdGEtc2VsZWN0ZWRdJylcbiAgICAgIGNvbnN0IGl0ZW0gPSB0aGlzLmdldEl0ZW1EYXRhKHNlbGVjdGVkKVxuXG4gICAgICB0aGlzLnNldFNlbGVjdGVkKGl0ZW0udmFsdWUsIGl0ZW0udGV4dCwgZmFsc2UpXG4gICAgfVxuXG4gICAgc2V0U2VsZWN0ZWQodmFsdWUgPSAnJywgdGV4dCA9IG51bGwsIGNoZWNrRXhpc3RzID0gdHJ1ZSkge1xuICAgICAgaWYgKCF0aGlzLm9wdGlvbnMuZGVmYXVsdCkge1xuICAgICAgICByZXR1cm4gZmFsc2VcbiAgICAgIH1cblxuICAgICAgbGV0IHRleHREaXNwbGF5ID0gdGV4dFxuICAgICAgdGhpcy5vcHRpb25zLmVsZW1lbnQucXVlcnlTZWxlY3RvcignLmRlZmF1bHQtdGV4dCcpLmlubmVySFRNTCA9IHRleHRcbiAgICAgIHRoaXMub3B0aW9ucy5lbGVtZW50LnF1ZXJ5U2VsZWN0b3IoJ2lucHV0W3R5cGU9XCJoaWRkZW5cIl0nKS52YWx1ZSA9IHZhbHVlXG5cbiAgICAgIGNvbnN0IGl0ZW1zID0gdGhpcy5vcHRpb25zLmVsZW1lbnQucXVlcnlTZWxlY3RvckFsbCgnLml0ZW0nKSB8fCBbXVxuICAgICAgbGV0IGl0ZW1Gb3VuZCA9IGZhbHNlXG5cbiAgICAgIEFycmF5LmZyb20oaXRlbXMpLmZvckVhY2goKGl0ZW0pID0+IHtcbiAgICAgICAgaWYgKGl0ZW0uY2xhc3NMaXN0LmNvbnRhaW5zKCdzZWxlY3RlZCcpKSB7XG4gICAgICAgICAgaXRlbS5jbGFzc0xpc3QucmVtb3ZlKCdzZWxlY3RlZCcpXG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCBkYXRhID0gdGhpcy5nZXRJdGVtRGF0YShpdGVtKVxuXG4gICAgICAgIGlmICh2YWx1ZSA9PT0gZGF0YS52YWx1ZSkge1xuICAgICAgICAgIGlmICghaXRlbS5jbGFzc0xpc3QuY29udGFpbnMoJ3NlbGVjdGVkJykpIHtcbiAgICAgICAgICAgIGl0ZW0uY2xhc3NMaXN0LmFkZCgnc2VsZWN0ZWQnKVxuICAgICAgICAgIH1cblxuICAgICAgICAgIHRleHREaXNwbGF5ID0gZGF0YS50ZXh0XG4gICAgICAgICAgaXRlbUZvdW5kID0gdHJ1ZVxuICAgICAgICB9XG4gICAgICB9KVxuXG4gICAgICBpZiAoY2hlY2tFeGlzdHMgJiYgaXRlbUZvdW5kKSB7XG4gICAgICAgIHRoaXMub3B0aW9ucy5lbGVtZW50LnF1ZXJ5U2VsZWN0b3IoJy5kZWZhdWx0LXRleHQnKS5pbm5lckhUTUwgPSB0ZXh0RGlzcGxheVxuICAgICAgfSBlbHNlIGlmIChjaGVja0V4aXN0cyAmJiAhaXRlbUZvdW5kKSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcihgJHtOQU1FfS4gVGhlIHZhbHVlIFwiJHt2YWx1ZX1cIiBkb2VzIG5vdCBleGlzdCBpbiB0aGUgbGlzdCBvZiBpdGVtcy5gKSAgICAgICAgXG4gICAgICB9XG5cbiAgICAgIHJldHVybiB0cnVlXG4gICAgfVxuXG4gICAgZ2V0U2VsZWN0ZWQoKSB7XG4gICAgICByZXR1cm4gdGhpcy5vcHRpb25zLmVsZW1lbnQucXVlcnlTZWxlY3RvcignaW5wdXRbdHlwZT1cImhpZGRlblwiXScpLnZhbHVlXG4gICAgfVxuXG4gICAgZ2V0SXRlbURhdGEoaXRlbSA9IG51bGwpIHtcbiAgICAgIGxldCB0ZXh0ID0gJydcbiAgICAgIGxldCB2YWx1ZSA9ICcnXG5cbiAgICAgIGlmIChpdGVtKSB7XG4gICAgICAgIHRleHQgPSBpdGVtLmdldEF0dHJpYnV0ZSgnZGF0YS10ZXh0JykgfHwgaXRlbS5pbm5lckhUTUxcblxuICAgICAgICBjb25zdCBzZWxlY3RlZFRleHROb2RlID0gaXRlbS5xdWVyeVNlbGVjdG9yKCcudGV4dCcpXG4gICAgICAgIGlmIChzZWxlY3RlZFRleHROb2RlKSB7XG4gICAgICAgICAgdGV4dCA9IHNlbGVjdGVkVGV4dE5vZGUuaW5uZXJIVE1MXG4gICAgICAgIH1cblxuICAgICAgICB2YWx1ZSA9IGl0ZW0uZ2V0QXR0cmlidXRlKCdkYXRhLXZhbHVlJykgfHwgJydcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIHsgdGV4dCwgdmFsdWUgfVxuICAgIH1cblxuICAgIG9uRWxlbWVudEV2ZW50KGV2ZW50KSB7XG4gICAgICBpZiAoZXZlbnQudHlwZSA9PT0gRXZlbnQuU1RBUlQpIHtcbiAgICAgICAgY29uc3QgZHJvcGRvd24gPSBmaW5kVGFyZ2V0QnlDbGFzcyhldmVudC50YXJnZXQsICdkcm9wZG93bicpXG5cbiAgICAgICAgLypcbiAgICAgICAgICogaGlkZSB0aGUgY3VycmVudCBkcm9wZG93biBvbmx5IGlmIHRoZSBldmVudCBjb25jZXJucyBhbm90aGVyIGRyb3Bkb3duXG4gICAgICAgICAqIGhpZGUgYWxzbyBpZiB0aGUgdXNlciBjbGlja3Mgb3V0c2lkZSBhIGRyb3Bkb3duXG4gICAgICAgICAqL1xuICAgICAgICBpZiAoIWRyb3Bkb3duIHx8IGRyb3Bkb3duICE9PSB0aGlzLmdldEVsZW1lbnQoKSkge1xuICAgICAgICAgIHRoaXMuaGlkZSgpXG4gICAgICAgIH1cblxuICAgICAgfSBlbHNlIGlmIChldmVudC50eXBlID09PSAnY2xpY2snKSB7XG4gICAgICAgIGNvbnN0IGl0ZW0gPSBmaW5kVGFyZ2V0QnlDbGFzcyhldmVudC50YXJnZXQsICdpdGVtJylcblxuICAgICAgICBpZiAoaXRlbSkge1xuICAgICAgICAgIGlmIChpdGVtLmNsYXNzTGlzdC5jb250YWlucygnZGlzYWJsZWQnKSkge1xuICAgICAgICAgICAgcmV0dXJuXG4gICAgICAgICAgfVxuXG4gICAgICAgICAgY29uc3QgaXRlbUluZm8gPSB0aGlzLmdldEl0ZW1EYXRhKGl0ZW0pXG5cbiAgICAgICAgICBpZiAodGhpcy5nZXRTZWxlY3RlZCgpICE9PSBpdGVtSW5mby52YWx1ZSkge1xuICAgICAgICAgICAgLy8gdGhlIHVzZXIgc2VsZWN0ZWQgYW5vdGhlciB2YWx1ZSwgd2UgZGlzcGF0Y2ggdGhlIGV2ZW50XG4gICAgICAgICAgICB0aGlzLnNldFNlbGVjdGVkKGl0ZW1JbmZvLnZhbHVlLCBpdGVtSW5mby50ZXh0LCBmYWxzZSlcbiAgICAgICAgICAgIGNvbnN0IGRldGFpbCA9IHsgaXRlbSwgdGV4dDogaXRlbUluZm8udGV4dCwgdmFsdWU6IGl0ZW1JbmZvLnZhbHVlIH1cbiAgICAgICAgICAgIHRoaXMudHJpZ2dlckV2ZW50KEV2ZW50LklURU1fU0VMRUNURUQsIGRldGFpbClcbiAgICAgICAgICB9XG5cbiAgICAgICAgICB0aGlzLmhpZGUoKVxuICAgICAgICAgIHJldHVyblxuICAgICAgICB9XG5cbiAgICAgICAgLy8gZG9uJ3QgdG9nZ2xlIHRoZSBkcm9wZG93biBpZiB0aGUgZXZlbnQgY29uY2VybnMgaGVhZGVycywgZGl2aWRlcnNcbiAgICAgICAgY29uc3QgZHJvcGRvd25NZW51ID0gZmluZFRhcmdldEJ5Q2xhc3MoZXZlbnQudGFyZ2V0LCAnZHJvcGRvd24tbWVudScpXG4gICAgICAgIGlmIChkcm9wZG93bk1lbnUpIHtcbiAgICAgICAgICByZXR1cm5cbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMudG9nZ2xlKClcbiAgICAgIH1cbiAgICB9XG5cbiAgICB0b2dnbGUoKSB7XG4gICAgICBpZiAodGhpcy5vcHRpb25zLmVsZW1lbnQuY2xhc3NMaXN0LmNvbnRhaW5zKCdhY3RpdmUnKSkge1xuICAgICAgICByZXR1cm4gdGhpcy5oaWRlKClcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIHRoaXMuc2hvdygpXG4gICAgfVxuXG4gICAgc2hvdygpIHtcbiAgICAgIGlmICh0aGlzLm9wdGlvbnMuZWxlbWVudC5jbGFzc0xpc3QuY29udGFpbnMoJ2FjdGl2ZScpKSB7XG4gICAgICAgIHJldHVybiBmYWxzZVxuICAgICAgfVxuXG4gICAgICB0aGlzLm9wdGlvbnMuZWxlbWVudC5jbGFzc0xpc3QuYWRkKCdhY3RpdmUnKVxuXG4gICAgICBjb25zdCBkcm9wZG93bk1lbnUgPSB0aGlzLm9wdGlvbnMuZWxlbWVudC5xdWVyeVNlbGVjdG9yKCcuZHJvcGRvd24tbWVudScpXG5cbiAgICAgIC8vIHNjcm9sbCB0byB0b3BcbiAgICAgIGRyb3Bkb3duTWVudS5zY3JvbGxUb3AgPSAwXG5cbiAgICAgIHRoaXMudHJpZ2dlckV2ZW50KEV2ZW50LlNIT1cpXG4gICAgICB0aGlzLnRyaWdnZXJFdmVudChFdmVudC5TSE9XTilcblxuICAgICAgdGhpcy5yZWdpc3RlckVsZW1lbnQoeyB0YXJnZXQ6IGRyb3Bkb3duTWVudSwgZXZlbnQ6ICdjbGljaycgfSkgICAgICBcbiAgICAgIHRoaXMucmVnaXN0ZXJFbGVtZW50KHsgdGFyZ2V0OiBkb2N1bWVudC5ib2R5LCBldmVudDogRXZlbnQuU1RBUlQgfSlcblxuICAgICAgcmV0dXJuIHRydWVcbiAgICB9XG5cbiAgICBoaWRlKCkge1xuICAgICAgaWYgKCF0aGlzLm9wdGlvbnMuZWxlbWVudC5jbGFzc0xpc3QuY29udGFpbnMoJ2FjdGl2ZScpKSB7XG4gICAgICAgIHJldHVybiBmYWxzZVxuICAgICAgfVxuXG4gICAgICB0aGlzLm9wdGlvbnMuZWxlbWVudC5jbGFzc0xpc3QucmVtb3ZlKCdhY3RpdmUnKVxuXG4gICAgICB0aGlzLnRyaWdnZXJFdmVudChFdmVudC5ISURFKVxuICAgICAgdGhpcy50cmlnZ2VyRXZlbnQoRXZlbnQuSElEREVOKVxuXG4gICAgICB0aGlzLnVucmVnaXN0ZXJFbGVtZW50KHsgdGFyZ2V0OiB0aGlzLm9wdGlvbnMuZWxlbWVudC5xdWVyeVNlbGVjdG9yKCcuZHJvcGRvd24tbWVudScpLCBldmVudDogJ2NsaWNrJyB9KSAgICAgIFxuICAgICAgdGhpcy51bnJlZ2lzdGVyRWxlbWVudCh7IHRhcmdldDogZG9jdW1lbnQuYm9keSwgZXZlbnQ6IEV2ZW50LlNUQVJUIH0pXG5cbiAgICAgIHJldHVybiB0cnVlXG4gICAgfVxuXG4gICAgc3RhdGljIGlkZW50aWZpZXIoKSB7XG4gICAgICByZXR1cm4gTkFNRVxuICAgIH1cblxuICAgIHN0YXRpYyBfRE9NSW50ZXJmYWNlKG9wdGlvbnMpIHtcbiAgICAgIHJldHVybiBzdXBlci5fRE9NSW50ZXJmYWNlKERyb3Bkb3duLCBvcHRpb25zKVxuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICogRE9NIEFwaSBpbXBsZW1lbnRhdGlvblxuICAgKiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICovXG4gIGNvbnN0IGNvbXBvbmVudHMgPSBbXVxuXG4gIGNvbnN0IGRyb3Bkb3ducyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoYC4ke05BTUV9YClcbiAgaWYgKGRyb3Bkb3ducykge1xuICAgIEFycmF5LmZyb20oZHJvcGRvd25zKS5mb3JFYWNoKChlbGVtZW50KSA9PiB7XG4gICAgICBjb25zdCBjb25maWcgPSBnZXRBdHRyaWJ1dGVzQ29uZmlnKGVsZW1lbnQsIERFRkFVTFRfUFJPUEVSVElFUywgREFUQV9BVFRSU19QUk9QRVJUSUVTKVxuICAgICAgY29uZmlnLmVsZW1lbnQgPSBlbGVtZW50XG5cbiAgICAgIGlmICghY29uZmlnLnNlYXJjaCkge1xuICAgICAgICBjb21wb25lbnRzLnB1c2gobmV3IERyb3Bkb3duKGNvbmZpZykpXG4gICAgICB9XG4gICAgfSlcbiAgfVxuXG4gIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKGV2ZW50KSA9PiB7XG4gICAgY29uc3QgZHJvcGRvd25NZW51ID0gZmluZFRhcmdldEJ5Q2xhc3MoZXZlbnQudGFyZ2V0LCAnZHJvcGRvd24tbWVudScpXG4gICAgaWYgKGRyb3Bkb3duTWVudSkge1xuICAgICAgcmV0dXJuXG4gICAgfVxuXG4gICAgY29uc3QgZHJvcGRvd24gPSBmaW5kVGFyZ2V0QnlDbGFzcyhldmVudC50YXJnZXQsICdkcm9wZG93bicpXG5cbiAgICBpZiAoZHJvcGRvd24pIHtcbiAgICAgIGNvbnN0IGRhdGFUb2dnbGVBdHRyID0gZHJvcGRvd24uZ2V0QXR0cmlidXRlKCdkYXRhLXRvZ2dsZScpXG4gICAgICBpZiAoZGF0YVRvZ2dsZUF0dHIgJiYgZGF0YVRvZ2dsZUF0dHIgPT09IE5BTUUgJiYgZHJvcGRvd24pIHtcbiAgICAgICAgY29uc3QgY29tcG9uZW50ID0gY29tcG9uZW50cy5maW5kKGMgPT4gYy5nZXRFbGVtZW50KCkgPT09IGRyb3Bkb3duKVxuXG4gICAgICAgIGlmICghY29tcG9uZW50KSB7XG4gICAgICAgICAgcmV0dXJuXG4gICAgICAgIH1cblxuICAgICAgICBjb21wb25lbnQudG9nZ2xlKClcbiAgICAgIH1cbiAgICB9XG4gIH0pXG5cbiAgcmV0dXJuIERyb3Bkb3duXG59KSgpXG5cbmV4cG9ydCBkZWZhdWx0IERyb3Bkb3duXG4iLCIvKipcbiAqIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gKiBMaWNlbnNlZCB1bmRlciBNSVQgKGh0dHBzOi8vZ2l0aHViLmNvbS9xdWFyay1kZXYvUGhvbm9uLUZyYW1ld29yay9ibG9iL21hc3Rlci9MSUNFTlNFKVxuICogLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAqL1xuaW1wb3J0IERyb3Bkb3duIGZyb20gJy4vaW5kZXgnXG5pbXBvcnQgeyBmaW5kVGFyZ2V0QnlDbGFzcyB9IGZyb20gJy4uLy4uL2NvbW1vbi91dGlscydcbmltcG9ydCB7IGdldEF0dHJpYnV0ZXNDb25maWcgfSBmcm9tICcuLi9jb21wb25lbnRNYW5hZ2VyJ1xuXG5jb25zdCBEcm9wZG93blNlYXJjaCA9ICgoKSA9PiB7XG5cbiAgLyoqXG4gICAqIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgKiBDb25zdGFudHNcbiAgICogLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAqL1xuXG4gIGNvbnN0IE5BTUUgPSBEcm9wZG93bi5pZGVudGlmaWVyKClcbiAgY29uc3QgREVGQVVMVF9QUk9QRVJUSUVTID0ge1xuICAgIGVsZW1lbnQ6IG51bGwsXG4gICAgZGVmYXVsdDogdHJ1ZSxcbiAgICBzZWFyY2g6IHRydWUsXG4gIH1cbiAgY29uc3QgREFUQV9BVFRSU19QUk9QRVJUSUVTID0gW1xuICAgICdkZWZhdWx0JyxcbiAgICAnc2VhcmNoJyxcbiAgXVxuXG4gIC8qKlxuICAgKiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICogQ2xhc3MgRGVmaW5pdGlvblxuICAgKiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICovXG5cbiAgY2xhc3MgRHJvcGRvd25TZWFyY2ggZXh0ZW5kcyBEcm9wZG93biB7XG5cbiAgICBjb25zdHJ1Y3RvcihvcHRpb25zID0ge30pIHtcbiAgICAgIHN1cGVyKG9wdGlvbnMpXG5cbiAgICAgIHRoaXMuZmlsdGVySXRlbXNIYW5kbGVyID0gKGV2ZW50KSA9PiB7XG4gICAgICAgIGNvbnN0IHNlYXJjaCA9IGV2ZW50LnRhcmdldC52YWx1ZVxuXG4gICAgICAgIGlmIChzZWFyY2ggPT09ICcnKSB7XG4gICAgICAgICAgdGhpcy5zaG93SXRlbXMoKVxuICAgICAgICAgIHJldHVyblxuICAgICAgICB9XG5cblxuICAgICAgICB0aGlzLmdldEl0ZW1zKCkuZm9yRWFjaCgoaXRlbSkgPT4ge1xuICAgICAgICAgIGNvbnN0IGZuID0gdHlwZW9mIHRoaXMub3B0aW9ucy5maWx0ZXJJdGVtID09PSAnZnVuY3Rpb24nID8gdGhpcy5vcHRpb25zLmZpbHRlckl0ZW0gOiB0aGlzLmZpbHRlckl0ZW1cblxuICAgICAgICAgIGlmIChmbihzZWFyY2gsIGl0ZW0pKSB7XG4gICAgICAgICAgICBpdGVtLmVsZW1lbnQuc3R5bGUuZGlzcGxheSA9ICdibG9jaydcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgaXRlbS5lbGVtZW50LnN0eWxlLmRpc3BsYXkgPSAnbm9uZSdcbiAgICAgICAgICB9XG4gICAgICAgIH0pXG4gICAgICB9XG5cbiAgICAgIHRoaXMuZ2V0U2VhcmNoSW5wdXQoKS5hZGRFdmVudExpc3RlbmVyKCdrZXl1cCcsIHRoaXMuZmlsdGVySXRlbXNIYW5kbGVyKVxuICAgIH1cblxuICAgIGZpbHRlckl0ZW0oc2VhcmNoID0gJycsIGl0ZW0gPSB7fSkge1xuICAgICAgaWYgKGl0ZW0udmFsdWUuaW5kZXhPZihzZWFyY2gpID4gLTFcbiAgICAgICAgfHwgaXRlbS50ZXh0LmluZGV4T2Yoc2VhcmNoKSA+IC0xKSB7XG4gICAgICAgIHJldHVybiB0cnVlXG4gICAgICB9XG5cbiAgICAgIHJldHVybiBmYWxzZVxuICAgIH1cblxuICAgIGdldEl0ZW1zKCkge1xuICAgICAgbGV0IGl0ZW1zID0gQXJyYXkuZnJvbSh0aGlzLm9wdGlvbnMuZWxlbWVudC5xdWVyeVNlbGVjdG9yQWxsKCcuaXRlbScpIHx8IFtdKVxuICAgICAgaXRlbXMgPSBpdGVtcy5tYXAoKGl0ZW0pID0+IHtcbiAgICAgICAgY29uc3QgaW5mbyA9IHRoaXMuZ2V0SXRlbURhdGEoaXRlbSlcbiAgICAgICAgcmV0dXJuIHsgdGV4dDogaW5mby50ZXh0LCB2YWx1ZTogaW5mby52YWx1ZSwgZWxlbWVudDogaXRlbSB9XG4gICAgICB9KVxuXG4gICAgICByZXR1cm4gaXRlbXNcbiAgICB9XG5cbiAgICBzaG93SXRlbXMoKSB7XG4gICAgICB0aGlzLmdldEl0ZW1zKCkuZm9yRWFjaCgoaXRlbSkgPT4ge1xuICAgICAgICBjb25zdCBpID0gaXRlbVxuICAgICAgICBpLmVsZW1lbnQuc3R5bGUuZGlzcGxheSA9ICdibG9jaydcbiAgICAgIH0pXG4gICAgfVxuXG4gICAgZ2V0U2VhcmNoSW5wdXQoKSB7XG4gICAgICByZXR1cm4gdGhpcy5vcHRpb25zLmVsZW1lbnQucXVlcnlTZWxlY3RvcignLmRyb3Bkb3duLW1lbnUgaW5wdXQnKVxuICAgIH1cblxuICAgIGhpZGUoKSB7XG4gICAgICBpZiAoc3VwZXIuaGlkZSgpKSB7XG4gICAgICAgIC8vIHJlc2V0IHRoZSB2YWx1ZVxuICAgICAgICB0aGlzLmdldFNlYXJjaElucHV0KCkudmFsdWUgPSAnJ1xuICAgICAgICAvLyBzaG93IGFsbCBpdGVtc1xuICAgICAgICB0aGlzLnNob3dJdGVtcygpXG4gICAgICB9XG4gICAgfVxuXG4gICAgc3RhdGljIF9ET01JbnRlcmZhY2Uob3B0aW9ucykge1xuICAgICAgcmV0dXJuIG5ldyBEcm9wZG93blNlYXJjaChvcHRpb25zKVxuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICogRE9NIEFwaSBpbXBsZW1lbnRhdGlvblxuICAgKiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICovXG4gIGNvbnN0IGNvbXBvbmVudHMgPSBbXVxuICBjb25zdCBkcm9wZG93bnMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKGAuJHtOQU1FfWApXG5cbiAgaWYgKGRyb3Bkb3ducykge1xuICAgIEFycmF5LmZyb20oZHJvcGRvd25zKS5mb3JFYWNoKChlbGVtZW50KSA9PiB7XG4gICAgICBjb25zdCBjb25maWcgPSBnZXRBdHRyaWJ1dGVzQ29uZmlnKGVsZW1lbnQsIERFRkFVTFRfUFJPUEVSVElFUywgREFUQV9BVFRSU19QUk9QRVJUSUVTKVxuICAgICAgY29uZmlnLmVsZW1lbnQgPSBlbGVtZW50XG5cbiAgICAgIGlmIChjb25maWcuc2VhcmNoKSB7XG4gICAgICAgIC8vIHNlYXJjaFxuICAgICAgICBjb21wb25lbnRzLnB1c2gobmV3IERyb3Bkb3duU2VhcmNoKGNvbmZpZykpXG4gICAgICB9XG4gICAgfSlcbiAgfVxuXG4gIGlmIChkcm9wZG93bnMpIHtcbiAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIChldmVudCkgPT4ge1xuICAgICAgY29uc3QgZHJvcGRvd25NZW51ID0gZmluZFRhcmdldEJ5Q2xhc3MoZXZlbnQudGFyZ2V0LCAnZHJvcGRvd24tbWVudScpXG4gICAgICBpZiAoZHJvcGRvd25NZW51KSB7XG4gICAgICAgIHJldHVyblxuICAgICAgfVxuXG4gICAgICBjb25zdCBkcm9wZG93biA9IGZpbmRUYXJnZXRCeUNsYXNzKGV2ZW50LnRhcmdldCwgJ2Ryb3Bkb3duJylcblxuICAgICAgaWYgKGRyb3Bkb3duKSB7XG4gICAgICAgIGNvbnN0IGRhdGFUb2dnbGVBdHRyID0gZHJvcGRvd24uZ2V0QXR0cmlidXRlKCdkYXRhLXRvZ2dsZScpXG4gICAgICAgIGlmIChkYXRhVG9nZ2xlQXR0ciAmJiBkYXRhVG9nZ2xlQXR0ciA9PT0gTkFNRSAmJiBkcm9wZG93bikge1xuICAgICAgICAgIGNvbnN0IGNvbXBvbmVudCA9IGNvbXBvbmVudHMuZmluZChjID0+IGMuZ2V0RWxlbWVudCgpID09PSBkcm9wZG93bilcblxuICAgICAgICAgIGlmICghY29tcG9uZW50KSB7XG4gICAgICAgICAgICByZXR1cm5cbiAgICAgICAgICB9XG5cbiAgICAgICAgICBjb21wb25lbnQudG9nZ2xlKClcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0pXG4gIH1cblxuICByZXR1cm4gRHJvcGRvd25TZWFyY2hcbn0pKClcblxuZXhwb3J0IGRlZmF1bHQgRHJvcGRvd25TZWFyY2hcbiIsIi8qKlxuICogLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAqIExpY2Vuc2VkIHVuZGVyIE1JVCAoaHR0cHM6Ly9naXRodWIuY29tL3F1YXJrLWRldi9QaG9ub24tRnJhbWV3b3JrL2Jsb2IvbWFzdGVyL0xJQ0VOU0UpXG4gKiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICovXG5pbXBvcnQgQ29tcG9uZW50IGZyb20gJy4uL2NvbXBvbmVudCdcblxuY29uc3QgTG9hZGVyID0gKCgpID0+IHtcbiAgLyoqXG4gICAqIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgKiBDb25zdGFudHNcbiAgICogLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAqL1xuXG4gIGNvbnN0IE5BTUUgPSAnbG9hZGVyJ1xuICBjb25zdCBWRVJTSU9OID0gJzIuMC4wJ1xuICBjb25zdCBERUZBVUxUX1BST1BFUlRJRVMgPSB7XG4gICAgZWxlbWVudDogbnVsbCxcbiAgICBjb2xvcjogbnVsbCxcbiAgICBzaXplOiBudWxsLFxuICB9XG4gIGNvbnN0IERBVEFfQVRUUlNfUFJPUEVSVElFUyA9IFtdXG5cbiAgLyoqXG4gICAqIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgKiBDbGFzcyBEZWZpbml0aW9uXG4gICAqIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgKi9cblxuICBjbGFzcyBMb2FkZXIgZXh0ZW5kcyBDb21wb25lbnQge1xuXG4gICAgY29uc3RydWN0b3Iob3B0aW9ucyA9IHt9KSB7XG4gICAgICBzdXBlcihOQU1FLCBWRVJTSU9OLCBERUZBVUxUX1BST1BFUlRJRVMsIG9wdGlvbnMsIERBVEFfQVRUUlNfUFJPUEVSVElFUywgZmFsc2UsIGZhbHNlKVxuXG4gICAgICAvLyBzZXQgY29sb3JcbiAgICAgIGNvbnN0IGxvYWRlclNwaW5uZXIgPSB0aGlzLmdldFNwaW5uZXIoKVxuICAgICAgaWYgKHR5cGVvZiB0aGlzLm9wdGlvbnMuY29sb3IgPT09ICdzdHJpbmcnXG4gICAgICAgICYmICFsb2FkZXJTcGlubmVyLmNsYXNzTGlzdC5jb250YWlucyhgY29sb3ItJHt0aGlzLm9wdGlvbnMuY29sb3J9YCkpIHtcbiAgICAgICAgbG9hZGVyU3Bpbm5lci5jbGFzc0xpc3QuYWRkKGBjb2xvci0ke3RoaXMub3B0aW9ucy5jb2xvcn1gKVxuICAgICAgfVxuXG4gICAgICB0aGlzLmN1c3RvbVNpemUgPSB0aGlzLm9wdGlvbnMuc2l6ZSAhPT0gbnVsbFxuICAgIH1cblxuICAgIGdldENsaWVudFNpemUoKSB7XG4gICAgICBpZiAoIXRoaXMuY3VzdG9tU2l6ZSkge1xuICAgICAgICBjb25zdCBzaXplID0gdGhpcy5vcHRpb25zLmVsZW1lbnQuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCkgICAgICAgIFxuICAgICAgICByZXR1cm4gc2l6ZS5oZWlnaHRcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIHRoaXMub3B0aW9ucy5zaXplXG4gICAgfVxuXG4gICAgZ2V0U3Bpbm5lcigpIHtcbiAgICAgIHJldHVybiB0aGlzLm9wdGlvbnMuZWxlbWVudC5xdWVyeVNlbGVjdG9yKCcubG9hZGVyLXNwaW5uZXInKVxuICAgIH1cblxuICAgIHNob3coKSB7XG4gICAgICBpZiAodGhpcy5vcHRpb25zLmVsZW1lbnQuY2xhc3NMaXN0LmNvbnRhaW5zKCdoaWRlJykpIHtcbiAgICAgICAgdGhpcy5vcHRpb25zLmVsZW1lbnQuY2xhc3NMaXN0LnJlbW92ZSgnaGlkZScpXG4gICAgICB9XG5cbiAgICAgIGNvbnN0IHNpemUgPSB0aGlzLmdldENsaWVudFNpemUoKVxuICAgICAgdGhpcy5vcHRpb25zLnNpemUgPSBzaXplXG5cbiAgICAgIGlmICh0aGlzLmN1c3RvbVNpemUpIHtcbiAgICAgICAgdGhpcy5vcHRpb25zLmVsZW1lbnQuc3R5bGUud2lkdGggPSBgJHt0aGlzLm9wdGlvbnMuc2l6ZX1weGBcbiAgICAgICAgdGhpcy5vcHRpb25zLmVsZW1lbnQuc3R5bGUuaGVpZ2h0ID0gYCR7dGhpcy5vcHRpb25zLnNpemV9cHhgXG5cbiAgICAgICAgY29uc3QgbG9hZGVyU3Bpbm5lciA9IHRoaXMuZ2V0U3Bpbm5lcigpXG4gICAgICAgIGxvYWRlclNwaW5uZXIuc3R5bGUud2lkdGggPSBgJHt0aGlzLm9wdGlvbnMuc2l6ZX1weGBcbiAgICAgICAgbG9hZGVyU3Bpbm5lci5zdHlsZS5oZWlnaHQgPSBgJHt0aGlzLm9wdGlvbnMuc2l6ZX1weGBcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIHRydWVcbiAgICB9XG5cbiAgICBhbmltYXRlKHN0YXJ0QW5pbWF0aW9uID0gdHJ1ZSkge1xuICAgICAgaWYgKHN0YXJ0QW5pbWF0aW9uKSB7XG4gICAgICAgIHRoaXMuc2hvdygpXG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLmhpZGUoKVxuICAgICAgfVxuXG4gICAgICBjb25zdCBsb2FkZXJTcGlubmVyID0gdGhpcy5nZXRTcGlubmVyKClcblxuICAgICAgaWYgKHN0YXJ0QW5pbWF0aW9uICYmXG4gICAgICAgICFsb2FkZXJTcGlubmVyLmNsYXNzTGlzdC5jb250YWlucygnbG9hZGVyLXNwaW5uZXItYW5pbWF0ZWQnKSkge1xuICAgICAgICBsb2FkZXJTcGlubmVyLmNsYXNzTGlzdC5hZGQoJ2xvYWRlci1zcGlubmVyLWFuaW1hdGVkJylcbiAgICAgICAgcmV0dXJuIHRydWVcbiAgICAgIH1cblxuICAgICAgaWYgKCFzdGFydEFuaW1hdGlvbiAmJlxuICAgICAgICBsb2FkZXJTcGlubmVyLmNsYXNzTGlzdC5jb250YWlucygnbG9hZGVyLXNwaW5uZXItYW5pbWF0ZWQnKSkge1xuICAgICAgICBsb2FkZXJTcGlubmVyLmNsYXNzTGlzdC5yZW1vdmUoJ2xvYWRlci1zcGlubmVyLWFuaW1hdGVkJylcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIHRydWVcbiAgICB9XG5cbiAgICBoaWRlKCkge1xuICAgICAgaWYgKCF0aGlzLm9wdGlvbnMuZWxlbWVudC5jbGFzc0xpc3QuY29udGFpbnMoJ2hpZGUnKSkge1xuICAgICAgICB0aGlzLm9wdGlvbnMuZWxlbWVudC5jbGFzc0xpc3QuYWRkKCdoaWRlJylcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIHRydWVcbiAgICB9XG5cbiAgICBzdGF0aWMgaWRlbnRpZmllcigpIHtcbiAgICAgIHJldHVybiBOQU1FXG4gICAgfVxuXG4gICAgc3RhdGljIF9ET01JbnRlcmZhY2Uob3B0aW9ucykge1xuICAgICAgcmV0dXJuIHN1cGVyLl9ET01JbnRlcmZhY2UoTG9hZGVyLCBvcHRpb25zKVxuICAgIH1cbiAgfVxuXG4gIHJldHVybiBMb2FkZXJcbn0pKClcblxuZXhwb3J0IGRlZmF1bHQgTG9hZGVyXG4iLCIvKipcbiogLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiogTGljZW5zZWQgdW5kZXIgTUlUIChodHRwczovL2dpdGh1Yi5jb20vcXVhcmstZGV2L1Bob25vbi1GcmFtZXdvcmsvYmxvYi9tYXN0ZXIvTElDRU5TRSlcbiogLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiovXG5pbXBvcnQgRXZlbnQgZnJvbSAnLi4vLi4vY29tbW9uL2V2ZW50cydcbmltcG9ydCBDb21wb25lbnQgZnJvbSAnLi4vY29tcG9uZW50J1xuXG5jb25zdCBOb3RpZmljYXRpb24gPSAoKCkgPT4ge1xuICAvKipcbiAgICogLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICogQ29uc3RhbnRzXG4gICogLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICovXG5cbiAgY29uc3QgTkFNRSA9ICdub3RpZmljYXRpb24nXG4gIGNvbnN0IFZFUlNJT04gPSAnMi4wLjAnXG4gIGNvbnN0IERFRkFVTFRfUFJPUEVSVElFUyA9IHtcbiAgICBlbGVtZW50OiBudWxsLFxuICAgIG1lc3NhZ2U6ICcnLFxuICAgIHNob3dCdXR0b246IHRydWUsXG4gICAgdGltZW91dDogbnVsbCxcbiAgICBiYWNrZ3JvdW5kOiAncHJpbWFyeScsXG4gIH1cbiAgY29uc3QgREFUQV9BVFRSU19QUk9QRVJUSUVTID0gW1xuICAgICd0aW1lb3V0JyxcbiAgXVxuXG4gIC8qKlxuICAgKiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICogQ2xhc3MgRGVmaW5pdGlvblxuICAgKiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICovXG5cbiAgY2xhc3MgTm90aWZpY2F0aW9uIGV4dGVuZHMgQ29tcG9uZW50IHtcblxuICAgIGNvbnN0cnVjdG9yKG9wdGlvbnMgPSB7fSkge1xuICAgICAgc3VwZXIoTkFNRSwgVkVSU0lPTiwgREVGQVVMVF9QUk9QRVJUSUVTLCBvcHRpb25zLCBEQVRBX0FUVFJTX1BST1BFUlRJRVMsIHRydWUsIGZhbHNlKVxuXG4gICAgICB0aGlzLnRlbXBsYXRlID0gJycgK1xuICAgICAgJzxkaXYgY2xhc3M9XCJub3RpZmljYXRpb25cIj4nICtcbiAgICAgICAgJzxkaXYgY2xhc3M9XCJub3RpZmljYXRpb24taW5uZXJcIj4nICtcbiAgICAgICAgICAnPGRpdiBjbGFzcz1cIm1lc3NhZ2VcIj48L2Rpdj4nICtcbiAgICAgICAgICAnPGJ1dHRvbiB0eXBlPVwiYnV0dG9uXCIgY2xhc3M9XCJjbG9zZVwiIGRhdGEtZGlzbWlzcz1cIm5vdGlmaWNhdGlvblwiIGFyaWEtbGFiZWw9XCJDbG9zZVwiPicgK1xuICAgICAgICAgICAgJzxzcGFuIGFyaWEtaGlkZGVuPVwidHJ1ZVwiPiZ0aW1lczs8L3NwYW4+JyArXG4gICAgICAgICAgJzwvYnV0dG9uPicgK1xuICAgICAgICAnPC9kaXY+JyArXG4gICAgICAnPC9kaXY+J1xuXG4gICAgICBpZiAodGhpcy5keW5hbWljRWxlbWVudCkge1xuICAgICAgICB0aGlzLmJ1aWxkKClcbiAgICAgIH1cblxuICAgICAgdGhpcy50aW1lb3V0Q2FsbGJhY2sgPSBudWxsXG4gICAgfVxuXG4gICAgYnVpbGQoKSB7XG4gICAgICBjb25zdCBidWlsZGVyID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2JylcblxuICAgICAgYnVpbGRlci5pbm5lckhUTUwgPSB0aGlzLnRlbXBsYXRlXG5cbiAgICAgIHRoaXMub3B0aW9ucy5lbGVtZW50ID0gYnVpbGRlci5maXJzdENoaWxkXG5cbiAgICAgIC8vIHRleHQgbWVzc2FnZVxuICAgICAgdGhpcy5vcHRpb25zLmVsZW1lbnQucXVlcnlTZWxlY3RvcignLm1lc3NhZ2UnKS5pbm5lckhUTUwgPSB0aGlzLm9wdGlvbnMubWVzc2FnZVxuXG4gICAgICBpZiAoIXRoaXMub3B0aW9ucy5zaG93QnV0dG9uKSB7XG4gICAgICAgIHRoaXMub3B0aW9ucy5lbGVtZW50LnF1ZXJ5U2VsZWN0b3IoJ2J1dHRvbicpLnN0eWxlLmRpc3BsYXkgPSAnbm9uZSdcbiAgICAgIH1cblxuICAgICAgZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZCh0aGlzLm9wdGlvbnMuZWxlbWVudClcblxuICAgICAgdGhpcy5zZXRBdHRyaWJ1dGVzKClcbiAgICB9XG5cbiAgICBzaG93KCkge1xuICAgICAgaWYgKHRoaXMub3B0aW9ucy5lbGVtZW50ID09PSBudWxsKSB7XG4gICAgICAgIC8vIGJ1aWxkIGFuZCBpbnNlcnQgYSBuZXcgRE9NIGVsZW1lbnRcbiAgICAgICAgdGhpcy5idWlsZCgpXG4gICAgICB9XG5cbiAgICAgIGlmICh0aGlzLm9wdGlvbnMuZWxlbWVudC5jbGFzc0xpc3QuY29udGFpbnMoJ3Nob3cnKSkge1xuICAgICAgICByZXR1cm4gZmFsc2VcbiAgICAgIH1cblxuICAgICAgLy8gcmVzZXQgY29sb3JcbiAgICAgIGlmICh0aGlzLm9wdGlvbnMuYmFja2dyb3VuZCkge1xuICAgICAgICB0aGlzLm9wdGlvbnMuZWxlbWVudC5yZW1vdmVBdHRyaWJ1dGUoJ2NsYXNzJylcbiAgICAgICAgdGhpcy5vcHRpb25zLmVsZW1lbnQuc2V0QXR0cmlidXRlKCdjbGFzcycsICdub3RpZmljYXRpb24nKVxuXG4gICAgICAgIHRoaXMub3B0aW9ucy5lbGVtZW50LmNsYXNzTGlzdC5hZGQoYGJnLSR7dGhpcy5vcHRpb25zLmJhY2tncm91bmR9YClcbiAgICAgICAgdGhpcy5vcHRpb25zLmVsZW1lbnQucXVlcnlTZWxlY3RvcignYnV0dG9uJykuY2xhc3NMaXN0LmFkZChgYnRuLSR7dGhpcy5vcHRpb25zLmJhY2tncm91bmR9YClcbiAgICAgIH1cblxuICAgICAgaWYgKHRoaXMub3B0aW9ucy5zaG93QnV0dG9uKSB7XG4gICAgICAgIC8vIGF0dGFjaCB0aGUgYnV0dG9uIGhhbmRsZXJcbiAgICAgICAgY29uc3QgYnV0dG9uRWxlbWVudCA9IHRoaXMub3B0aW9ucy5lbGVtZW50LnF1ZXJ5U2VsZWN0b3IoJ2J1dHRvbicpXG4gICAgICAgIHRoaXMucmVnaXN0ZXJFbGVtZW50KHsgdGFyZ2V0OiBidXR0b25FbGVtZW50LCBldmVudDogJ2NsaWNrJyB9KVxuICAgICAgfVxuXG4gICAgICBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgICAgdGhpcy5vcHRpb25zLmVsZW1lbnQuY2xhc3NMaXN0LmFkZCgnc2hvdycpXG5cbiAgICAgICAgLy8gc2V0IHBvc2l0aW9uXG4gICAgICAgIGNvbnN0IGFjdGl2ZU5vdGlmaWNhdGlvbnMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCcubm90aWZpY2F0aW9uLnNob3cnKSB8fCBbXVxuICAgICAgICBsZXQgcHVzaERpc3RhbmNlID0gMFxuICAgICAgICBhY3RpdmVOb3RpZmljYXRpb25zLmZvckVhY2goKG5vdGlmaWNhdGlvbikgPT4ge1xuICAgICAgICAgIGlmICh0aGlzLm9wdGlvbnMuZWxlbWVudCAhPT0gbm90aWZpY2F0aW9uKSB7XG4gICAgICAgICAgICBjb25zdCBzdHlsZSA9IGdldENvbXB1dGVkU3R5bGUobm90aWZpY2F0aW9uKVxuICAgICAgICAgICAgcHVzaERpc3RhbmNlICs9IG5vdGlmaWNhdGlvbi5vZmZzZXRIZWlnaHQgKyBwYXJzZUludChzdHlsZS5tYXJnaW5Cb3R0b20sIDEwKVxuICAgICAgICAgIH1cbiAgICAgICAgfSlcblxuICAgICAgICB0aGlzLm9wdGlvbnMuZWxlbWVudC5zdHlsZS50cmFuc2Zvcm0gPSBgdHJhbnNsYXRlWSgke3B1c2hEaXN0YW5jZX1weClgXG5cbiAgICAgICAgdGhpcy50cmlnZ2VyRXZlbnQoRXZlbnQuU0hPVylcblxuICAgICAgICBjb25zdCBvblNob3duID0gKCkgPT4ge1xuICAgICAgICAgIHRoaXMudHJpZ2dlckV2ZW50KEV2ZW50LlNIT1dOKVxuICAgICAgICAgIHRoaXMub3B0aW9ucy5lbGVtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoRXZlbnQuVFJBTlNJVElPTl9FTkQsIG9uU2hvd24pXG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLm9wdGlvbnMuZWxlbWVudC5hZGRFdmVudExpc3RlbmVyKEV2ZW50LlRSQU5TSVRJT05fRU5ELCBvblNob3duKVxuXG4gICAgICB9LCAxKVxuXG4gICAgICBpZiAoTnVtYmVyLmlzSW50ZWdlcih0aGlzLm9wdGlvbnMudGltZW91dCkgJiYgdGhpcy5vcHRpb25zLnRpbWVvdXQgPiAwKSB7XG4gICAgICAgIC8vIGlmIHRoZXJlIGlzIGEgdGltZW91dCwgYXV0byBoaWRlIHRoZSBub3RpZmljYXRpb25cbiAgICAgICAgdGhpcy50aW1lb3V0Q2FsbGJhY2sgPSBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgICAgICB0aGlzLmhpZGUoKVxuICAgICAgICB9LCB0aGlzLm9wdGlvbnMudGltZW91dCArIDEpXG4gICAgICB9XG5cbiAgICAgIHJldHVybiB0cnVlXG4gICAgfVxuXG4gICAgaGlkZSgpIHtcbiAgICAgIC8qXG4gICAgICAgKiBwcmV2ZW50IHRvIGNsb3NlIGEgbm90aWZpY2F0aW9uIHdpdGggYSB0aW1lb3V0XG4gICAgICAgKiBpZiB0aGUgdXNlciBoYXMgYWxyZWFkeSBjbGlja2VkIG9uIHRoZSBidXR0b25cbiAgICAgICAqL1xuICAgICAgaWYgKHRoaXMudGltZW91dENhbGxiYWNrKSB7XG4gICAgICAgIGNsZWFyVGltZW91dCh0aGlzLnRpbWVvdXRDYWxsYmFjaylcbiAgICAgICAgdGhpcy50aW1lb3V0Q2FsbGJhY2sgPSBudWxsXG4gICAgICB9XG5cbiAgICAgIGlmICghdGhpcy5vcHRpb25zLmVsZW1lbnQuY2xhc3NMaXN0LmNvbnRhaW5zKCdzaG93JykpIHtcbiAgICAgICAgcmV0dXJuIGZhbHNlXG4gICAgICB9XG5cbiAgICAgIHRoaXMudHJpZ2dlckV2ZW50KEV2ZW50LkhJREUpXG5cbiAgICAgIGlmICh0aGlzLm9wdGlvbnMuc2hvd0J1dHRvbikge1xuICAgICAgICBjb25zdCBidXR0b25FbGVtZW50ID0gdGhpcy5vcHRpb25zLmVsZW1lbnQucXVlcnlTZWxlY3RvcignYnV0dG9uJylcbiAgICAgICAgdGhpcy51bnJlZ2lzdGVyRWxlbWVudCh7IHRhcmdldDogYnV0dG9uRWxlbWVudCwgZXZlbnQ6ICdjbGljaycgfSlcbiAgICAgIH1cblxuICAgICAgdGhpcy5vcHRpb25zLmVsZW1lbnQuY2xhc3NMaXN0LnJlbW92ZSgnc2hvdycpXG4gICAgICB0aGlzLm9wdGlvbnMuZWxlbWVudC5jbGFzc0xpc3QuYWRkKCdoaWRlJylcblxuICAgICAgY29uc3Qgb25IaWRkZW4gPSAoKSA9PiB7XG4gICAgICAgIHRoaXMub3B0aW9ucy5lbGVtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoRXZlbnQuVFJBTlNJVElPTl9FTkQsIG9uSGlkZGVuKVxuICAgICAgICB0aGlzLm9wdGlvbnMuZWxlbWVudC5jbGFzc0xpc3QucmVtb3ZlKCdoaWRlJylcblxuICAgICAgICB0aGlzLnRyaWdnZXJFdmVudChFdmVudC5ISURERU4pXG5cbiAgICAgICAgaWYgKHRoaXMuZHluYW1pY0VsZW1lbnQpIHtcbiAgICAgICAgICBkb2N1bWVudC5ib2R5LnJlbW92ZUNoaWxkKHRoaXMub3B0aW9ucy5lbGVtZW50KVxuICAgICAgICAgIHRoaXMub3B0aW9ucy5lbGVtZW50ID0gbnVsbFxuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIHRoaXMub3B0aW9ucy5lbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIoRXZlbnQuVFJBTlNJVElPTl9FTkQsIG9uSGlkZGVuKVxuXG4gICAgICByZXR1cm4gdHJ1ZVxuICAgIH1cblxuICAgIG9uRWxlbWVudEV2ZW50KCkge1xuICAgICAgdGhpcy5oaWRlKClcbiAgICB9XG5cbiAgICBzdGF0aWMgaWRlbnRpZmllcigpIHtcbiAgICAgIHJldHVybiBOQU1FXG4gICAgfVxuXG4gICAgc3RhdGljIF9ET01JbnRlcmZhY2Uob3B0aW9ucykge1xuICAgICAgcmV0dXJuIHN1cGVyLl9ET01JbnRlcmZhY2UoTm90aWZpY2F0aW9uLCBvcHRpb25zKVxuICAgIH1cbiAgfVxuXG4gIHJldHVybiBOb3RpZmljYXRpb25cbn0pKClcblxuZXhwb3J0IGRlZmF1bHQgTm90aWZpY2F0aW9uXG4iLCIvKipcbiAqIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gKiBMaWNlbnNlZCB1bmRlciBNSVQgKGh0dHBzOi8vZ2l0aHViLmNvbS9xdWFyay1kZXYvUGhvbm9uLUZyYW1ld29yay9ibG9iL21hc3Rlci9MSUNFTlNFKVxuICogLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAqL1xuaW1wb3J0IEV2ZW50IGZyb20gJy4uLy4uL2NvbW1vbi9ldmVudHMnXG5pbXBvcnQgQ29tcG9uZW50IGZyb20gJy4uL2NvbXBvbmVudCdcbmltcG9ydCB7IGdldEF0dHJpYnV0ZXNDb25maWcgfSBmcm9tICcuLi9jb21wb25lbnRNYW5hZ2VyJ1xuaW1wb3J0IHsgZmluZFRhcmdldEJ5QXR0ciB9IGZyb20gJy4uLy4uL2NvbW1vbi91dGlscydcblxuY29uc3QgT2ZmQ2FudmFzID0gKCgpID0+IHtcbiAgLyoqXG4gICAqIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgKiBDb25zdGFudHNcbiAgICogLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAqL1xuXG4gIGNvbnN0IE5BTUUgPSAnb2ZmLWNhbnZhcydcbiAgY29uc3QgVkVSU0lPTiA9ICcyLjAuMCdcbiAgY29uc3QgQkFDS0RST1BfU0VMRUNUT1IgPSAnb2ZmLWNhbnZhcy1iYWNrZHJvcCdcbiAgY29uc3QgREVGQVVMVF9QUk9QRVJUSUVTID0ge1xuICAgIGVsZW1lbnQ6IG51bGwsXG4gICAgYXNpZGU6IHtcbiAgICAgIG1kOiBmYWxzZSxcbiAgICAgIGxnOiBmYWxzZSxcbiAgICAgIHhsOiBmYWxzZSxcbiAgICB9LFxuICB9XG4gIGNvbnN0IERBVEFfQVRUUlNfUFJPUEVSVElFUyA9IFtcbiAgICAnYXNpZGUnLFxuICBdXG5cbiAgLyoqXG4gICAqIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgKiBDbGFzcyBEZWZpbml0aW9uXG4gICAqIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgKi9cblxuICBjbGFzcyBPZmZDYW52YXMgZXh0ZW5kcyBDb21wb25lbnQge1xuXG4gICAgY29uc3RydWN0b3Iob3B0aW9ucyA9IHt9KSB7XG4gICAgICBzdXBlcihOQU1FLCBWRVJTSU9OLCBERUZBVUxUX1BST1BFUlRJRVMsIG9wdGlvbnMsIERBVEFfQVRUUlNfUFJPUEVSVElFUywgZmFsc2UsIHRydWUpXG5cbiAgICAgIHRoaXMudXNlQmFja2Ryb3AgPSB0cnVlXG4gICAgICB0aGlzLmN1cnJlbnRXaWR0aCA9IG51bGxcbiAgICAgIHRoaXMuYW5pbWF0ZSA9IHRydWVcblxuICAgICAgdGhpcy5kaXJlY3Rpb25zID0gWydsZWZ0JywgJ3JpZ2h0J11cblxuICAgICAgY29uc3Qgc20gPSB7IG5hbWU6ICdzbScsIG1lZGlhOiB3aW5kb3cubWF0Y2hNZWRpYSgnKG1pbi13aWR0aDogMXB4KScpIH1cbiAgICAgIGNvbnN0IG1kID0geyBuYW1lOiAnbWQnLCBtZWRpYTogd2luZG93Lm1hdGNoTWVkaWEoJyhtaW4td2lkdGg6IDc2OHB4KScpIH1cbiAgICAgIGNvbnN0IGxnID0geyBuYW1lOiAnbGcnLCBtZWRpYTogd2luZG93Lm1hdGNoTWVkaWEoJyhtaW4td2lkdGg6IDk5MnB4KScpIH1cbiAgICAgIGNvbnN0IHhsID0geyBuYW1lOiAneGwnLCBtZWRpYTogd2luZG93Lm1hdGNoTWVkaWEoJyhtaW4td2lkdGg6IDEyMDBweCknKSB9XG5cbiAgICAgIHRoaXMuc2l6ZXMgPSBbc20sIG1kLCBsZywgeGxdLnJldmVyc2UoKVxuXG4gICAgICB0aGlzLmNoZWNrRGlyZWN0aW9uKClcbiAgICAgIHRoaXMuY2hlY2tXaWR0aCgpXG5cbiAgICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdyZXNpemUnLCAoKSA9PiB0aGlzLmNoZWNrV2lkdGgoKSwgZmFsc2UpICAgICAgXG4gICAgfVxuXG4gICAgY2hlY2tEaXJlY3Rpb24oKSB7XG4gICAgICB0aGlzLmRpcmVjdGlvbnMuZXZlcnkoKGRpcmVjdGlvbikgPT4ge1xuICAgICAgICBpZiAodGhpcy5vcHRpb25zLmVsZW1lbnQuY2xhc3NMaXN0LmNvbnRhaW5zKGBvZmYtY2FudmFzLSR7ZGlyZWN0aW9ufWApKSB7XG4gICAgICAgICAgdGhpcy5kaXJlY3Rpb24gPSBkaXJlY3Rpb25cbiAgICAgICAgICByZXR1cm4gZmFsc2VcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdHJ1ZVxuICAgICAgfSlcbiAgICB9XG5cbiAgICBjaGVja1dpZHRoKCkge1xuICAgICAgaWYgKCEoJ21hdGNoTWVkaWEnIGluIHdpbmRvdykpIHtcbiAgICAgICAgcmV0dXJuXG4gICAgICB9XG5cbiAgICAgIHRoaXMuc2l6ZXMuZXZlcnkoKHNpemUpID0+IHtcbiAgICAgICAgY29uc3QgbWF0Y2ggPSBzaXplLm1lZGlhLm1lZGlhLm1hdGNoKC9bYS16XT8td2lkdGg6XFxzPyhbMC05XSspLylcblxuICAgICAgICBpZiAobWF0Y2gpIHtcbiAgICAgICAgICBpZiAoc2l6ZS5tZWRpYS5tYXRjaGVzKSB7XG4gICAgICAgICAgICBpZiAodGhpcy5jdXJyZW50V2lkdGggIT09IHNpemUubmFtZSkge1xuICAgICAgICAgICAgICB0aGlzLnNldEFzaWRlKHNpemUubmFtZSlcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHRoaXMuY3VycmVudFdpZHRoID0gc2l6ZS5uYW1lXG4gICAgICAgICAgICByZXR1cm4gZmFsc2VcbiAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gdHJ1ZVxuICAgICAgfSlcbiAgICB9XG5cbiAgICBwcmV2ZW50Q2xvc2FibGUoKSB7XG4gICAgICByZXR1cm4gc3VwZXIucHJldmVudENsb3NhYmxlKCkgfHwgdGhpcy5vcHRpb25zLmFzaWRlW3RoaXMuY3VycmVudFdpZHRoXSA9PT0gdHJ1ZVxuICAgIH1cblxuICAgIHNldEFzaWRlKG5hbWUpIHtcbiAgICAgIGNvbnN0IGNvbnRlbnQgPSBkb2N1bWVudC5ib2R5XG5cbiAgICAgIGlmICh0aGlzLm9wdGlvbnMuYXNpZGVbbmFtZV0gPT09IHRydWUpIHtcbiAgICAgICAgaWYgKCFjb250ZW50LmNsYXNzTGlzdC5jb250YWlucyhgb2ZmLWNhbnZhcy1hc2lkZS0ke3RoaXMuZGlyZWN0aW9ufWApKSB7XG4gICAgICAgICAgY29udGVudC5jbGFzc0xpc3QuYWRkKGBvZmYtY2FudmFzLWFzaWRlLSR7dGhpcy5kaXJlY3Rpb259YClcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMudXNlQmFja2Ryb3AgPSBmYWxzZVxuXG4gICAgICAgIC8vIGF2b2lkIGFuaW1hdGlvbiBieSBzZXR0aW5nIGFuaW1hdGUgdG8gZmFsc2VcbiAgICAgICAgdGhpcy5hbmltYXRlID0gZmFsc2VcbiAgICAgICAgdGhpcy5zaG93KClcbiAgICAgICAgLy8gcmVtb3ZlIHByZXZpb3VzIGJhY2tkcm9wXG4gICAgICAgIHRoaXMucmVtb3ZlQmFja2Ryb3AoKVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgaWYgKGNvbnRlbnQuY2xhc3NMaXN0LmNvbnRhaW5zKGBvZmYtY2FudmFzLWFzaWRlLSR7dGhpcy5kaXJlY3Rpb259YCkpIHtcbiAgICAgICAgICBjb250ZW50LmNsYXNzTGlzdC5yZW1vdmUoYG9mZi1jYW52YXMtYXNpZGUtJHt0aGlzLmRpcmVjdGlvbn1gKVxuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5oaWRlKClcbiAgICAgICAgdGhpcy51c2VCYWNrZHJvcCA9IHRydWVcbiAgICAgICAgdGhpcy5hbmltYXRlID0gdHJ1ZVxuICAgICAgfVxuICAgIH1cblxuICAgIG9uRWxlbWVudEV2ZW50KGV2ZW50KSB7XG4gICAgICBpZiAoZXZlbnQudHlwZSA9PT0gJ2tleXVwJyAmJiBldmVudC5rZXlDb2RlICE9PSAyNyAmJiBldmVudC5rZXlDb2RlICE9PSAxMykge1xuICAgICAgICByZXR1cm5cbiAgICAgIH1cblxuICAgICAgLy8gaGlkZSB0aGUgb2ZmLWNhbnZhc1xuICAgICAgdGhpcy5oaWRlKClcbiAgICB9XG5cbiAgICBzaG93KCkge1xuICAgICAgaWYgKHRoaXMub3B0aW9ucy5lbGVtZW50LmNsYXNzTGlzdC5jb250YWlucygnc2hvdycpKSB7XG4gICAgICAgIHJldHVybiBmYWxzZVxuICAgICAgfVxuXG4gICAgICAvLyBhZGQgYSB0aW1lb3V0IHNvIHRoYXQgdGhlIENTUyBhbmltYXRpb24gd29ya3NcbiAgICAgIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgICB0aGlzLnRyaWdnZXJFdmVudChFdmVudC5TSE9XKVxuXG4gICAgICAgIGNvbnN0IG9uU2hvd24gPSAoKSA9PiB7XG4gICAgICAgICAgdGhpcy50cmlnZ2VyRXZlbnQoRXZlbnQuU0hPV04pXG5cbiAgICAgICAgICBpZiAodGhpcy5hbmltYXRlKSB7XG4gICAgICAgICAgICB0aGlzLm9wdGlvbnMuZWxlbWVudC5yZW1vdmVFdmVudExpc3RlbmVyKEV2ZW50LlRSQU5TSVRJT05fRU5ELCBvblNob3duKVxuICAgICAgICAgICAgdGhpcy5vcHRpb25zLmVsZW1lbnQuY2xhc3NMaXN0LnJlbW92ZSgnYW5pbWF0ZScpXG4gICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHRoaXMudXNlQmFja2Ryb3ApIHtcbiAgICAgICAgICB0aGlzLmNyZWF0ZUJhY2tkcm9wKClcbiAgICAgICAgfVxuXG5cbiAgICAgICAgaWYgKHRoaXMuYW5pbWF0ZSkge1xuICAgICAgICAgIHRoaXMub3B0aW9ucy5lbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIoRXZlbnQuVFJBTlNJVElPTl9FTkQsIG9uU2hvd24pICAgICAgICBcbiAgICAgICAgICB0aGlzLm9wdGlvbnMuZWxlbWVudC5jbGFzc0xpc3QuYWRkKCdhbmltYXRlJylcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAvLyBkaXJlY3RseSB0cmlnZ2VyIHRoZSBvblNob3duXG4gICAgICAgICAgb25TaG93bigpXG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLm9wdGlvbnMuZWxlbWVudC5jbGFzc0xpc3QuYWRkKCdzaG93JykgICAgICAgIFxuXG4gICAgICAgIC8vIGF0dGFjaCBldmVudFxuICAgICAgICB0aGlzLmF0dGFjaEV2ZW50cygpXG4gICAgICB9LCAxKVxuXG4gICAgICByZXR1cm4gdHJ1ZVxuICAgIH1cblxuICAgIGhpZGUoKSB7XG4gICAgICBpZiAoIXRoaXMub3B0aW9ucy5lbGVtZW50LmNsYXNzTGlzdC5jb250YWlucygnc2hvdycpKSB7XG4gICAgICAgIHJldHVybiBmYWxzZVxuICAgICAgfVxuXG4gICAgICB0aGlzLnRyaWdnZXJFdmVudChFdmVudC5ISURFKVxuXG4gICAgICB0aGlzLmRldGFjaEV2ZW50cygpXG5cbiAgICAgIGlmICh0aGlzLmFuaW1hdGUpIHtcbiAgICAgICAgdGhpcy5vcHRpb25zLmVsZW1lbnQuY2xhc3NMaXN0LmFkZCgnYW5pbWF0ZScpXG4gICAgICB9XG5cbiAgICAgIHRoaXMub3B0aW9ucy5lbGVtZW50LmNsYXNzTGlzdC5yZW1vdmUoJ3Nob3cnKVxuXG4gICAgICBpZiAodGhpcy51c2VCYWNrZHJvcCkge1xuICAgICAgICBjb25zdCBiYWNrZHJvcCA9IHRoaXMuZ2V0QmFja2Ryb3AoKVxuXG4gICAgICAgIGNvbnN0IG9uSGlkZGVuID0gKCkgPT4ge1xuICAgICAgICAgIGlmICh0aGlzLmFuaW1hdGUpIHtcbiAgICAgICAgICAgIHRoaXMub3B0aW9ucy5lbGVtZW50LmNsYXNzTGlzdC5yZW1vdmUoJ2FuaW1hdGUnKVxuICAgICAgICAgIH1cblxuICAgICAgICAgIGJhY2tkcm9wLnJlbW92ZUV2ZW50TGlzdGVuZXIoRXZlbnQuVFJBTlNJVElPTl9FTkQsIG9uSGlkZGVuKVxuICAgICAgICAgIHRoaXMudHJpZ2dlckV2ZW50KEV2ZW50LkhJRERFTikgICAgICAgIFxuICAgICAgICAgIHRoaXMucmVtb3ZlQmFja2Ryb3AoKVxuICAgICAgICB9XG5cbiAgICAgICAgYmFja2Ryb3AuYWRkRXZlbnRMaXN0ZW5lcihFdmVudC5UUkFOU0lUSU9OX0VORCwgb25IaWRkZW4pXG4gICAgICAgIGJhY2tkcm9wLmNsYXNzTGlzdC5hZGQoJ2ZhZGVvdXQnKVxuICAgICAgfVxuXG4gICAgICByZXR1cm4gdHJ1ZVxuICAgIH1cblxuICAgIGNyZWF0ZUJhY2tkcm9wKCkge1xuICAgICAgY29uc3QgYmFja2Ryb3AgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKVxuICAgICAgYmFja2Ryb3Auc2V0QXR0cmlidXRlKCdkYXRhLWlkJywgdGhpcy5pZClcbiAgICAgIGJhY2tkcm9wLmNsYXNzTGlzdC5hZGQoQkFDS0RST1BfU0VMRUNUT1IpXG5cbiAgICAgIGRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQoYmFja2Ryb3ApXG4gICAgfVxuXG4gICAgZ2V0QmFja2Ryb3AoKSB7XG4gICAgICByZXR1cm4gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihgLiR7QkFDS0RST1BfU0VMRUNUT1J9W2RhdGEtaWQ9XCIke3RoaXMuaWR9XCJdYClcbiAgICB9XG5cbiAgICByZW1vdmVCYWNrZHJvcCgpIHtcbiAgICAgIGNvbnN0IGJhY2tkcm9wID0gdGhpcy5nZXRCYWNrZHJvcCgpXG4gICAgICBpZiAoYmFja2Ryb3ApIHtcbiAgICAgICAgZG9jdW1lbnQuYm9keS5yZW1vdmVDaGlsZChiYWNrZHJvcClcbiAgICAgIH1cbiAgICB9XG5cbiAgICBhdHRhY2hFdmVudHMoKSB7XG4gICAgICBjb25zdCBkaXNtaXNzQnV0dG9ucyA9IHRoaXMub3B0aW9ucy5lbGVtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJ1tkYXRhLWRpc21pc3NdJylcblxuICAgICAgaWYgKGRpc21pc3NCdXR0b25zKSB7XG4gICAgICAgIEFycmF5LmZyb20oZGlzbWlzc0J1dHRvbnMpLmZvckVhY2goYnV0dG9uID0+IHRoaXMucmVnaXN0ZXJFbGVtZW50KHsgdGFyZ2V0OiBidXR0b24sIGV2ZW50OiAnY2xpY2snIH0pKVxuICAgICAgfVxuXG4gICAgICBpZiAodGhpcy51c2VCYWNrZHJvcCkge1xuICAgICAgICBjb25zdCBiYWNrZHJvcCA9IHRoaXMuZ2V0QmFja2Ryb3AoKSAgICAgIFxuICAgICAgICB0aGlzLnJlZ2lzdGVyRWxlbWVudCh7IHRhcmdldDogYmFja2Ryb3AsIGV2ZW50OiBFdmVudC5TVEFSVCB9KVxuICAgICAgfVxuXG4gICAgICB0aGlzLnJlZ2lzdGVyRWxlbWVudCh7IHRhcmdldDogZG9jdW1lbnQsIGV2ZW50OiAna2V5dXAnIH0pXG4gICAgfVxuXG4gICAgZGV0YWNoRXZlbnRzKCkge1xuICAgICAgY29uc3QgZGlzbWlzc0J1dHRvbnMgPSB0aGlzLm9wdGlvbnMuZWxlbWVudC5xdWVyeVNlbGVjdG9yQWxsKCdbZGF0YS1kaXNtaXNzXScpXG5cbiAgICAgIGlmIChkaXNtaXNzQnV0dG9ucykge1xuICAgICAgICBBcnJheS5mcm9tKGRpc21pc3NCdXR0b25zKS5mb3JFYWNoKGJ1dHRvbiA9PiB0aGlzLnVucmVnaXN0ZXJFbGVtZW50KHsgdGFyZ2V0OiBidXR0b24sIGV2ZW50OiAnY2xpY2snIH0pKVxuICAgICAgfVxuXG4gICAgICBpZiAodGhpcy51c2VCYWNrZHJvcCkge1xuICAgICAgICBjb25zdCBiYWNrZHJvcCA9IHRoaXMuZ2V0QmFja2Ryb3AoKVxuICAgICAgICB0aGlzLnVucmVnaXN0ZXJFbGVtZW50KHsgdGFyZ2V0OiBiYWNrZHJvcCwgZXZlbnQ6IEV2ZW50LlNUQVJUIH0pXG4gICAgICB9XG5cbiAgICAgIHRoaXMudW5yZWdpc3RlckVsZW1lbnQoeyB0YXJnZXQ6IGRvY3VtZW50LCBldmVudDogJ2tleXVwJyB9KVxuICAgIH1cblxuICAgIHN0YXRpYyBpZGVudGlmaWVyKCkge1xuICAgICAgcmV0dXJuIE5BTUVcbiAgICB9XG5cbiAgICBzdGF0aWMgX0RPTUludGVyZmFjZShvcHRpb25zKSB7XG4gICAgICByZXR1cm4gc3VwZXIuX0RPTUludGVyZmFjZShPZmZDYW52YXMsIG9wdGlvbnMpXG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgKiBET00gQXBpIGltcGxlbWVudGF0aW9uXG4gICAqIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgKi9cbiAgY29uc3QgY29tcG9uZW50cyA9IFtdXG5cbiAgY29uc3Qgb2ZmQ2FudmFzID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChgLiR7TkFNRX1gKVxuICBpZiAob2ZmQ2FudmFzKSB7XG4gICAgQXJyYXkuZnJvbShvZmZDYW52YXMpLmZvckVhY2goKGVsZW1lbnQpID0+IHtcbiAgICAgIGNvbnN0IGNvbmZpZyA9IGdldEF0dHJpYnV0ZXNDb25maWcoZWxlbWVudCwgREVGQVVMVF9QUk9QRVJUSUVTLCBEQVRBX0FUVFJTX1BST1BFUlRJRVMpXG4gICAgICBjb25maWcuZWxlbWVudCA9IGVsZW1lbnRcblxuICAgICAgY29tcG9uZW50cy5wdXNoKHsgZWxlbWVudCwgb2ZmQ2FudmFzOiBuZXcgT2ZmQ2FudmFzKGNvbmZpZykgfSlcbiAgICB9KVxuICB9XG5cbiAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoZXZlbnQpID0+IHtcbiAgICBjb25zdCB0YXJnZXQgPSBmaW5kVGFyZ2V0QnlBdHRyKGV2ZW50LnRhcmdldCwgJ2RhdGEtdG9nZ2xlJylcbiAgICBpZiAoIXRhcmdldCkge1xuICAgICAgcmV0dXJuXG4gICAgfVxuXG4gICAgY29uc3QgZGF0YVRvZ2dsZUF0dHIgPSB0YXJnZXQuZ2V0QXR0cmlidXRlKCdkYXRhLXRvZ2dsZScpXG4gICAgaWYgKGRhdGFUb2dnbGVBdHRyICYmIGRhdGFUb2dnbGVBdHRyID09PSBOQU1FKSB7XG4gICAgICBjb25zdCBpZCA9IHRhcmdldC5nZXRBdHRyaWJ1dGUoJ2RhdGEtdGFyZ2V0JylcbiAgICAgIGNvbnN0IGVsZW1lbnQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKGlkKVxuXG4gICAgICBjb25zdCBjb21wb25lbnQgPSBjb21wb25lbnRzLmZpbmQoYyA9PiBjLmVsZW1lbnQgPT09IGVsZW1lbnQpXG5cbiAgICAgIGlmICghY29tcG9uZW50KSB7XG4gICAgICAgIHJldHVyblxuICAgICAgfVxuXG4gICAgICB0YXJnZXQuYmx1cigpXG5cbiAgICAgIGNvbXBvbmVudC5vZmZDYW52YXMuc2hvdygpXG4gICAgfVxuICB9KVxuXG4gIHJldHVybiBPZmZDYW52YXNcbn0pKClcblxuZXhwb3J0IGRlZmF1bHQgT2ZmQ2FudmFzXG4iLCIvKipcbiAqIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gKiBMaWNlbnNlZCB1bmRlciBNSVQgKGh0dHBzOi8vZ2l0aHViLmNvbS9xdWFyay1kZXYvUGhvbm9uLUZyYW1ld29yay9ibG9iL21hc3Rlci9MSUNFTlNFKVxuICogLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAqL1xuaW1wb3J0IENvbXBvbmVudCBmcm9tICcuLi9jb21wb25lbnQnXG5pbXBvcnQgRXZlbnQgZnJvbSAnLi4vLi4vY29tbW9uL2V2ZW50cydcblxuY29uc3QgUHJvZ3Jlc3MgPSAoKCkgPT4ge1xuICAvKipcbiAgICogLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAqIENvbnN0YW50c1xuICAgKiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICovXG5cbiAgY29uc3QgTkFNRSA9ICdwcm9ncmVzcydcbiAgY29uc3QgVkVSU0lPTiA9ICcyLjAuMCdcbiAgY29uc3QgREVGQVVMVF9QUk9QRVJUSUVTID0ge1xuICAgIGVsZW1lbnQ6IG51bGwsXG4gICAgaGVpZ2h0OiA1LFxuICAgIG1pbjogMCxcbiAgICBtYXg6IDEwMCxcbiAgICBsYWJlbDogZmFsc2UsXG4gICAgc3RyaXBlZDogZmFsc2UsXG4gICAgYmFja2dyb3VuZDogbnVsbCxcbiAgfVxuICBjb25zdCBEQVRBX0FUVFJTX1BST1BFUlRJRVMgPSBbXG4gICAgJ2hlaWdodCcsXG4gICAgJ21pbicsXG4gICAgJ21heCcsXG4gICAgJ2xhYmVsJyxcbiAgICAnc3RyaXBlZCcsXG4gICAgJ2JhY2tncm91bmQnLFxuICBdXG5cbiAgLyoqXG4gICAqIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgKiBDbGFzcyBEZWZpbml0aW9uXG4gICAqIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgKi9cblxuICBjbGFzcyBQcm9ncmVzcyBleHRlbmRzIENvbXBvbmVudCB7XG5cbiAgICBjb25zdHJ1Y3RvcihvcHRpb25zID0ge30pIHtcbiAgICAgIHN1cGVyKE5BTUUsIFZFUlNJT04sIERFRkFVTFRfUFJPUEVSVElFUywgb3B0aW9ucywgREFUQV9BVFRSU19QUk9QRVJUSUVTLCBmYWxzZSwgZmFsc2UpXG5cbiAgICAgIC8vIHNldCB0aGUgd2FudGVkIGhlaWdodFxuICAgICAgdGhpcy5vcHRpb25zLmVsZW1lbnQuc3R5bGUuaGVpZ2h0ID0gYCR7dGhpcy5vcHRpb25zLmhlaWdodH1weGBcblxuICAgICAgLy8gc2V0IG1pbiBhbmQgbWF4IHZhbHVlc1xuICAgICAgY29uc3QgcHJvZ3Jlc3NCYXIgPSB0aGlzLmdldFByb2dyZXNzQmFyKClcbiAgICAgIHByb2dyZXNzQmFyLnNldEF0dHJpYnV0ZSgnYXJpYS12YWx1ZW1pbicsIGAke3RoaXMub3B0aW9ucy5taW59YClcbiAgICAgIHByb2dyZXNzQmFyLnNldEF0dHJpYnV0ZSgnYXJpYS12YWx1ZW1heCcsIGAke3RoaXMub3B0aW9ucy5tYXh9YClcblxuICAgICAgLy8gc2V0IHN0cmlwZWRcbiAgICAgIGlmICh0aGlzLm9wdGlvbnMuc3RyaXBlZFxuICAgICAgICAmJiAhcHJvZ3Jlc3NCYXIuY2xhc3NMaXN0LmNvbnRhaW5zKCdwcm9ncmVzcy1iYXItc3RyaXBlZCcpKSB7XG4gICAgICAgIHByb2dyZXNzQmFyLmNsYXNzTGlzdC5hZGQoJ3Byb2dyZXNzLWJhci1zdHJpcGVkJylcbiAgICAgIH1cblxuICAgICAgLy8gc2V0IGJhY2tncm91bmRcbiAgICAgIGlmICh0eXBlb2YgdGhpcy5vcHRpb25zLmJhY2tncm91bmQgPT09ICdzdHJpbmcnXG4gICAgICAgICYmICFwcm9ncmVzc0Jhci5jbGFzc0xpc3QuY29udGFpbnMoYGJnLSR7dGhpcy5vcHRpb25zLmJhY2tncm91bmR9YCkpIHtcbiAgICAgICAgcHJvZ3Jlc3NCYXIuY2xhc3NMaXN0LmFkZChgYmctJHt0aGlzLm9wdGlvbnMuYmFja2dyb3VuZH1gKVxuICAgICAgfVxuICAgIH1cblxuICAgIGdldFByb2dyZXNzQmFyKCkge1xuICAgICAgcmV0dXJuIHRoaXMub3B0aW9ucy5lbGVtZW50LnF1ZXJ5U2VsZWN0b3IoJy5wcm9ncmVzcy1iYXInKVxuICAgIH1cblxuICAgIHNldCh2YWx1ZSA9IDApIHtcbiAgICAgIGNvbnN0IHByb2dyZXNzQmFyID0gdGhpcy5nZXRQcm9ncmVzc0JhcigpXG4gICAgICBjb25zdCBwcm9ncmVzcyA9IE1hdGgucm91bmQoKHZhbHVlIC8gKHRoaXMub3B0aW9ucy5taW4gKyB0aGlzLm9wdGlvbnMubWF4KSkgKiAxMDApXG5cbiAgICAgIGlmICh2YWx1ZSA8IHRoaXMub3B0aW9ucy5taW4pIHtcbiAgICAgICAgY29uc29sZS5lcnJvcihgJHtOQU1FfS4gV2FybmluZywgJHt2YWx1ZX0gaXMgdW5kZXIgbWluIHZhbHVlLmApXG4gICAgICAgIHJldHVybiBmYWxzZVxuICAgICAgfVxuXG4gICAgICBpZiAodmFsdWUgPiB0aGlzLm9wdGlvbnMubWF4KSB7XG4gICAgICAgIGNvbnNvbGUuZXJyb3IoYCR7TkFNRX0uIFdhcm5pbmcsICR7dmFsdWV9IGlzIGFib3ZlIG1heCB2YWx1ZS5gKSAgICAgICAgICBcbiAgICAgICAgcmV0dXJuIGZhbHNlXG4gICAgICB9XG5cbiAgICAgIHByb2dyZXNzQmFyLnNldEF0dHJpYnV0ZSgnYXJpYS12YWx1ZW5vdycsIGAke3ZhbHVlfWApICAgICAgXG5cbiAgICAgIC8vIHNldCBsYWJlbFxuICAgICAgaWYgKHRoaXMub3B0aW9ucy5sYWJlbCkge1xuICAgICAgICBwcm9ncmVzc0Jhci5pbm5lckhUTUwgPSBgJHtwcm9ncmVzc30lYFxuICAgICAgfVxuXG4gICAgICAvLyBzZXQgcGVyY2VudGFnZVxuICAgICAgcHJvZ3Jlc3NCYXIuc3R5bGUud2lkdGggPSBgJHtwcm9ncmVzc30lYFxuXG4gICAgICByZXR1cm4gdHJ1ZVxuICAgIH1cblxuICAgIGFuaW1hdGUoc3RhcnRBbmltYXRpb24gPSB0cnVlKSB7XG4gICAgICBpZiAoIXRoaXMub3B0aW9ucy5zdHJpcGVkKSB7XG4gICAgICAgIGNvbnNvbGUuZXJyb3IoYCR7TkFNRX0uIEFuaW1hdGlvbiB3b3JrcyBvbmx5IHdpdGggc3RyaXBlZCBwcm9ncmVzcy5gKVxuICAgICAgICByZXR1cm4gZmFsc2VcbiAgICAgIH1cblxuICAgICAgY29uc3QgcHJvZ3Jlc3NCYXIgPSB0aGlzLmdldFByb2dyZXNzQmFyKClcblxuICAgICAgaWYgKHN0YXJ0QW5pbWF0aW9uXG4gICAgICAgICYmICFwcm9ncmVzc0Jhci5jbGFzc0xpc3QuY29udGFpbnMoJ3Byb2dyZXNzLWJhci1hbmltYXRlZCcpKSB7XG4gICAgICAgIHByb2dyZXNzQmFyLmNsYXNzTGlzdC5hZGQoJ3Byb2dyZXNzLWJhci1hbmltYXRlZCcpXG4gICAgICB9XG5cbiAgICAgIGlmICghc3RhcnRBbmltYXRpb25cbiAgICAgICAgJiYgcHJvZ3Jlc3NCYXIuY2xhc3NMaXN0LmNvbnRhaW5zKCdwcm9ncmVzcy1iYXItYW5pbWF0ZWQnKSkge1xuICAgICAgICBwcm9ncmVzc0Jhci5jbGFzc0xpc3QucmVtb3ZlKCdwcm9ncmVzcy1iYXItYW5pbWF0ZWQnKVxuICAgICAgfVxuXG4gICAgICByZXR1cm4gdHJ1ZVxuICAgIH1cblxuICAgIHNob3coKSB7XG4gICAgICB0aGlzLm9wdGlvbnMuZWxlbWVudC5zdHlsZS5oZWlnaHQgPSBgJHt0aGlzLm9wdGlvbnMuaGVpZ2h0fXB4YFxuICAgICAgdGhpcy50cmlnZ2VyRXZlbnQoRXZlbnQuU0hPVylcbiAgICAgIHRoaXMudHJpZ2dlckV2ZW50KEV2ZW50LlNIT1dOKVxuXG4gICAgICByZXR1cm4gdHJ1ZVxuICAgIH1cblxuICAgIGhpZGUoKSB7XG4gICAgICB0aGlzLm9wdGlvbnMuZWxlbWVudC5zdHlsZS5oZWlnaHQgPSAnMHB4J1xuICAgICAgdGhpcy50cmlnZ2VyRXZlbnQoRXZlbnQuSElERSlcbiAgICAgIHRoaXMudHJpZ2dlckV2ZW50KEV2ZW50LkhJRERFTilcblxuICAgICAgcmV0dXJuIHRydWVcbiAgICB9XG5cbiAgICBzdGF0aWMgaWRlbnRpZmllcigpIHtcbiAgICAgIHJldHVybiBOQU1FXG4gICAgfVxuXG4gICAgc3RhdGljIF9ET01JbnRlcmZhY2Uob3B0aW9ucykge1xuICAgICAgcmV0dXJuIHN1cGVyLl9ET01JbnRlcmZhY2UoUHJvZ3Jlc3MsIG9wdGlvbnMpXG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIFByb2dyZXNzXG59KSgpXG5cbmV4cG9ydCBkZWZhdWx0IFByb2dyZXNzXG4iLCIvKipcbiAqIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gKiBMaWNlbnNlZCB1bmRlciBNSVQgKGh0dHBzOi8vZ2l0aHViLmNvbS9xdWFyay1kZXYvUGhvbm9uLUZyYW1ld29yay9ibG9iL21hc3Rlci9MSUNFTlNFKVxuICogLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAqL1xuaW1wb3J0IENvbXBvbmVudCBmcm9tICcuLi9jb21wb25lbnQnXG5pbXBvcnQgeyBnZXRBdHRyaWJ1dGVzQ29uZmlnIH0gZnJvbSAnLi4vY29tcG9uZW50TWFuYWdlcidcbmltcG9ydCBFdmVudCBmcm9tICcuLi8uLi9jb21tb24vZXZlbnRzJ1xuaW1wb3J0IHsgZmluZFRhcmdldEJ5Q2xhc3MgfSBmcm9tICcuLi8uLi9jb21tb24vdXRpbHMnXG5cbmNvbnN0IFRhYiA9ICgoKSA9PiB7XG4gIC8qKlxuICAgKiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICogQ29uc3RhbnRzXG4gICAqIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgKi9cblxuICBjb25zdCBOQU1FID0gJ3RhYidcbiAgY29uc3QgVkVSU0lPTiA9ICcyLjAuMCdcbiAgY29uc3QgREVGQVVMVF9QUk9QRVJUSUVTID0ge1xuXG4gIH1cbiAgY29uc3QgREFUQV9BVFRSU19QUk9QRVJUSUVTID0gW1xuICBdXG4gIGNvbnN0IFRBQl9DT05URU5UX1NFTEVDVE9SID0gJy50YWItcGFuZSdcblxuICAvKipcbiAgICogLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAqIENsYXNzIERlZmluaXRpb25cbiAgICogLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAqL1xuXG4gIGNsYXNzIFRhYiBleHRlbmRzIENvbXBvbmVudCB7XG5cbiAgICBjb25zdHJ1Y3RvcihvcHRpb25zID0ge30pIHtcbiAgICAgIHN1cGVyKE5BTUUsIFZFUlNJT04sIERFRkFVTFRfUFJPUEVSVElFUywgb3B0aW9ucywgREFUQV9BVFRSU19QUk9QRVJUSUVTLCBmYWxzZSwgZmFsc2UpXG4gICAgfVxuXG4gICAgc2hvdygpIHtcbiAgICAgIGlmICh0aGlzLm9wdGlvbnMuZWxlbWVudC5jbGFzc0xpc3QuY29udGFpbnMoJ2FjdGl2ZScpKSB7XG4gICAgICAgIHJldHVybiBmYWxzZVxuICAgICAgfVxuXG4gICAgICBjb25zdCBpZCA9IHRoaXMub3B0aW9ucy5lbGVtZW50LmdldEF0dHJpYnV0ZSgnaHJlZicpXG4gICAgICBjb25zdCBuYXYgPSBmaW5kVGFyZ2V0QnlDbGFzcyh0aGlzLm9wdGlvbnMuZWxlbWVudCwgJ25hdicpXG4gICAgICBjb25zdCBuYXZUYWJzID0gbmF2ID8gbmF2LnF1ZXJ5U2VsZWN0b3JBbGwoYFtkYXRhLXRvZ2dsZT1cIiR7TkFNRX1cIl1gKSA6IG51bGxcblxuICAgICAgaWYgKG5hdlRhYnMpIHtcbiAgICAgICAgQXJyYXkuZnJvbShuYXZUYWJzKS5mb3JFYWNoKCh0YWIpID0+IHtcbiAgICAgICAgICBpZiAodGFiLmNsYXNzTGlzdC5jb250YWlucygnYWN0aXZlJykpIHtcbiAgICAgICAgICAgIHRhYi5jbGFzc0xpc3QucmVtb3ZlKCdhY3RpdmUnKVxuICAgICAgICAgIH1cbiAgICAgICAgICB0YWIuc2V0QXR0cmlidXRlKCdhcmlhLXNlbGVjdGVkJywgZmFsc2UpXG4gICAgICAgIH0pXG4gICAgICB9XG5cbiAgICAgIHRoaXMub3B0aW9ucy5lbGVtZW50LmNsYXNzTGlzdC5hZGQoJ2FjdGl2ZScpXG4gICAgICB0aGlzLm9wdGlvbnMuZWxlbWVudC5zZXRBdHRyaWJ1dGUoJ2FyaWEtc2VsZWN0ZWQnLCB0cnVlKVxuXG4gICAgICBjb25zdCB0YWJDb250ZW50ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihpZClcbiAgICAgIGNvbnN0IHRhYkNvbnRlbnRzID0gdGFiQ29udGVudC5wYXJlbnROb2RlLnF1ZXJ5U2VsZWN0b3JBbGwoVEFCX0NPTlRFTlRfU0VMRUNUT1IpXG5cbiAgICAgIGlmICh0YWJDb250ZW50cykge1xuICAgICAgICBBcnJheS5mcm9tKHRhYkNvbnRlbnRzKS5mb3JFYWNoKCh0YWIpID0+IHtcbiAgICAgICAgICBpZiAodGFiLmNsYXNzTGlzdC5jb250YWlucygnYWN0aXZlJykpIHtcbiAgICAgICAgICAgIHRhYi5jbGFzc0xpc3QucmVtb3ZlKCdhY3RpdmUnKVxuICAgICAgICAgIH1cbiAgICAgICAgfSlcbiAgICAgIH1cblxuICAgICAgdGFiQ29udGVudC5jbGFzc0xpc3QuYWRkKCdzaG93aW5nJylcblxuICAgICAgc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICAgIGNvbnN0IG9uU2hvd2VkID0gKCkgPT4ge1xuICAgICAgICAgIHRhYkNvbnRlbnQuY2xhc3NMaXN0LnJlbW92ZSgnYW5pbWF0ZScpXG4gICAgICAgICAgdGFiQ29udGVudC5jbGFzc0xpc3QuYWRkKCdhY3RpdmUnKVxuICAgICAgICAgIHRhYkNvbnRlbnQuY2xhc3NMaXN0LnJlbW92ZSgnc2hvd2luZycpXG4gICAgICAgICAgdGFiQ29udGVudC5yZW1vdmVFdmVudExpc3RlbmVyKEV2ZW50LlRSQU5TSVRJT05fRU5ELCBvblNob3dlZClcbiAgICAgICAgfVxuXG4gICAgICAgIHRhYkNvbnRlbnQuYWRkRXZlbnRMaXN0ZW5lcihFdmVudC5UUkFOU0lUSU9OX0VORCwgb25TaG93ZWQpXG5cbiAgICAgICAgdGFiQ29udGVudC5jbGFzc0xpc3QuYWRkKCdhbmltYXRlJylcblxuICAgICAgfSwgMjApXG5cbiAgICAgIHJldHVybiB0cnVlXG4gICAgfVxuXG4gICAgaGlkZSgpIHtcbiAgICAgIGlmICghdGhpcy5vcHRpb25zLmVsZW1lbnQuY2xhc3NMaXN0LmNvbnRhaW5zKCdhY3RpdmUnKSkge1xuICAgICAgICByZXR1cm4gZmFsc2VcbiAgICAgIH1cblxuICAgICAgaWYgKHRoaXMub3B0aW9ucy5lbGVtZW50LmNsYXNzTGlzdC5jb250YWlucygnYWN0aXZlJykpIHtcbiAgICAgICAgdGhpcy5vcHRpb25zLmVsZW1lbnQuY2xhc3NMaXN0LnJlbW92ZSgnYWN0aXZlJylcbiAgICAgIH1cblxuICAgICAgdGhpcy5vcHRpb25zLmVsZW1lbnQuc2V0QXR0cmlidXRlKCdhcmlhLXNlbGVjdGVkJywgZmFsc2UpXG5cbiAgICAgIGNvbnN0IGlkID0gdGhpcy5vcHRpb25zLmVsZW1lbnQuZ2V0QXR0cmlidXRlKCdocmVmJylcbiAgICAgIGNvbnN0IHRhYkNvbnRlbnQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKGlkKVxuXG4gICAgICBpZiAodGFiQ29udGVudC5jbGFzc0xpc3QuY29udGFpbnMoJ2FjdGl2ZScpKSB7XG4gICAgICAgIHRhYkNvbnRlbnQuY2xhc3NMaXN0LnJlbW92ZSgnYWN0aXZlJylcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIHRydWVcbiAgICB9XG5cbiAgICBzdGF0aWMgaWRlbnRpZmllcigpIHtcbiAgICAgIHJldHVybiBOQU1FXG4gICAgfVxuXG4gICAgc3RhdGljIF9ET01JbnRlcmZhY2Uob3B0aW9ucykge1xuICAgICAgcmV0dXJuIHN1cGVyLl9ET01JbnRlcmZhY2UoVGFiLCBvcHRpb25zKVxuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICogRE9NIEFwaSBpbXBsZW1lbnRhdGlvblxuICAgKiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICovXG4gIGNvbnN0IGNvbXBvbmVudHMgPSBbXVxuXG4gIGNvbnN0IHRhYnMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKGBbZGF0YS10b2dnbGU9XCIke05BTUV9XCJdYClcbiAgaWYgKHRhYnMpIHtcbiAgICBBcnJheS5mcm9tKHRhYnMpLmZvckVhY2goKGVsZW1lbnQpID0+IHtcbiAgICAgIC8vIGNvbnN0IGNvbmZpZyA9IHt9XG4gICAgICBjb25zdCBjb25maWcgPSBnZXRBdHRyaWJ1dGVzQ29uZmlnKGVsZW1lbnQsIERFRkFVTFRfUFJPUEVSVElFUywgREFUQV9BVFRSU19QUk9QRVJUSUVTKVxuICAgICAgY29uZmlnLmVsZW1lbnQgPSBlbGVtZW50XG5cbiAgICAgIGNvbXBvbmVudHMucHVzaChUYWIuX0RPTUludGVyZmFjZShjb25maWcpKVxuICAgIH0pXG4gIH1cblxuICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIChldmVudCkgPT4ge1xuICAgIGNvbnN0IGRhdGFUb2dnbGVBdHRyID0gZXZlbnQudGFyZ2V0LmdldEF0dHJpYnV0ZSgnZGF0YS10b2dnbGUnKVxuICAgIGlmIChkYXRhVG9nZ2xlQXR0ciAmJiBkYXRhVG9nZ2xlQXR0ciA9PT0gTkFNRSkge1xuICAgICAgY29uc3QgaWQgPSBldmVudC50YXJnZXQuZ2V0QXR0cmlidXRlKCdocmVmJylcblxuICAgICAgY29uc3QgY29tcG9uZW50ID0gY29tcG9uZW50cy5maW5kKGMgPT4gYy5nZXRFbGVtZW50KCkuZ2V0QXR0cmlidXRlKCdocmVmJykgPT09IGlkKVxuXG4gICAgICBpZiAoIWNvbXBvbmVudCkge1xuICAgICAgICByZXR1cm5cbiAgICAgIH1cblxuICAgICAgY29tcG9uZW50LnNob3coKVxuICAgIH1cbiAgfSlcblxuICByZXR1cm4gVGFiXG59KSgpXG5cbmV4cG9ydCBkZWZhdWx0IFRhYlxuIiwiLyoqXG4qIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4qIExpY2Vuc2VkIHVuZGVyIE1JVCAoaHR0cHM6Ly9naXRodWIuY29tL3F1YXJrLWRldi9QaG9ub24tRnJhbWV3b3JrL2Jsb2IvbWFzdGVyL0xJQ0VOU0UpXG4qIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4qL1xuXG5jb25zdCBCaW5kZXIgPSAoKCkgPT4ge1xuICAvKipcbiAgKiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgKiBDb25zdGFudHNcbiAgKiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgKi9cblxuICBjb25zdCBOQU1FID0gJ2ludGwtYmluZGVyJ1xuICBjb25zdCBWRVJTSU9OID0gJzIuMC4wJ1xuXG4gIC8qKlxuICAgKiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICogQ2xhc3MgRGVmaW5pdGlvblxuICAgKiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICovXG5cbiAgY2xhc3MgQmluZGVyIHtcbiAgICBjb25zdHJ1Y3RvcihlbGVtZW50LCBkYXRhKSB7XG4gICAgICB0aGlzLmVsZW1lbnQgPSBlbGVtZW50XG4gICAgICB0aGlzLmRhdGEgPSBkYXRhXG5cbiAgICAgIGlmICghdGhpcy5pc0VsZW1lbnQodGhpcy5lbGVtZW50KSkge1xuICAgICAgICByZXR1cm5cbiAgICAgIH1cblxuICAgICAgLy8gYXJyYXkgb2YgSFRNTEVsZW1lbnRcbiAgICAgIGlmICh0aGlzLmVsZW1lbnQubGVuZ3RoICYmIHRoaXMuZWxlbWVudC5sZW5ndGggPiAwKSB7XG4gICAgICAgIHRoaXMuc2V0Tm9kZXModGhpcy5lbGVtZW50KVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgLy8gc2luZ2xlIEhUTUxFbGVtZW50XG4gICAgICAgIHRoaXMuc2V0Tm9kZSh0aGlzLmVsZW1lbnQpXG4gICAgICB9XG4gICAgfVxuXG4gICAgLy8gZ2V0dGVyc1xuXG4gICAgc3RhdGljIGdldCB2ZXJzaW9uKCkge1xuICAgICAgcmV0dXJuIGAke05BTUV9LiR7VkVSU0lPTn1gXG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQ2hlY2tzIGlmIHRoZSBnaXZlbiBhcmd1bWVudCBpcyBhIERPTSBlbGVtZW50XG4gICAgICogQHBhcmFtIHtIVE1MRWxlbWVudH0gdGhlIGFyZ3VtZW50IHRvIHRlc3RcbiAgICAgKiBAcmV0dXJuIHtib29sZWFufSB0cnVlIGlmIHRoZSBvYmplY3QgaXMgYSBET00gZWxlbWVudCwgZmFsc2Ugb3RoZXJ3aXNlXG4gICAgICovXG4gICAgaXNFbGVtZW50KGVsZW1lbnQpIHtcbiAgICAgIGlmIChlbGVtZW50ID09PSBudWxsKSB7XG4gICAgICAgIHJldHVybiBmYWxzZVxuICAgICAgfVxuICAgICAgcmV0dXJuICh0eXBlb2YgTm9kZSA9PT0gJ29iamVjdCcgPyBlbGVtZW50IGluc3RhbmNlb2YgTm9kZSA6IGVsZW1lbnQgJiYgdHlwZW9mIGVsZW1lbnQgPT09ICdvYmplY3QnICYmIHR5cGVvZiBlbGVtZW50Lm5vZGVUeXBlID09PSAnbnVtYmVyJyAmJiB0eXBlb2YgZWxlbWVudC5ub2RlTmFtZSA9PT0gJ3N0cmluZycpXG4gICAgfVxuXG4gICAgLyoqXG4gICAgKiBCaW5kcyBzb21lIHRleHQgdG8gdGhlIGdpdmVuIERPTSBlbGVtZW50XG4gICAgKiBAcGFyYW0ge0hUTUxFbGVtZW50fSBlbGVtZW50XG4gICAgKiBAcGFyYW0ge1N0cmluZ30gdGV4dFxuICAgICovXG4gICAgc2V0VGV4dChlbGVtZW50LCB0ZXh0KSB7XG4gICAgICBpZiAoISgndGV4dENvbnRlbnQnIGluIGVsZW1lbnQpKSB7XG4gICAgICAgIGVsZW1lbnQuaW5uZXJUZXh0ID0gdGV4dFxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgZWxlbWVudC50ZXh0Q29udGVudCA9IHRleHRcbiAgICAgIH1cbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBCaW5kcyBzb21lIGh0bWwgdG8gdGhlIGdpdmVuIERPTSBlbGVtZW50XG4gICAgICogQHBhcmFtIHtIVE1MRWxlbWVudH0gZWxlbWVudFxuICAgICAqIEBwYXJhbSB7c3RyaW5nfSB0ZXh0XG4gICAgICovXG4gICAgc2V0SHRtbChlbGVtZW50LCB0ZXh0KSB7XG4gICAgICBlbGVtZW50LmlubmVySFRNTCA9IHRleHRcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBCaW5kcyBjdXN0b20gYXR0cmlidXRlcyB0byB0aGUgZ2l2ZW4gRE9NIGVsZW1lbnRcbiAgICAgKiBAcGFyYW0ge0hUTUxFbGVtZW50fSBlbGVtZW50XG4gICAgICogQHBhcmFtIHtTdHJpbmd9IGF0dHJcbiAgICAgKiBAcGFyYW0ge1N0cmluZ30gdGV4dFxuICAgICAqL1xuICAgIHNldEF0dHJpYnV0ZShlbGVtZW50LCBhdHRyLCB0ZXh0KSB7XG4gICAgICBlbGVtZW50LnNldEF0dHJpYnV0ZShhdHRyLCB0ZXh0KVxuICAgIH1cblxuICAgIHNldE5vZGUoZWxlbWVudCkge1xuICAgICAgbGV0IGF0dHIgPSBlbGVtZW50LmdldEF0dHJpYnV0ZSgnZGF0YS1pMThuJylcbiAgICAgIGlmICghYXR0cikge1xuICAgICAgICByZXR1cm5cbiAgICAgIH1cblxuICAgICAgYXR0ciA9IGF0dHIudHJpbSgpXG5cbiAgICAgIGNvbnN0IHIgPSAvKD86XFxzfF4pKFtBLVphLXotXzAtOV0rKTpcXHMqKC4qPykoPz1cXHMrXFx3Kzp8JCkvZ1xuICAgICAgbGV0IG1cblxuICAgICAgd2hpbGUgKG0gPSByLmV4ZWMoYXR0cikpIHtcbiAgICAgICAgY29uc3Qga2V5ID0gbVsxXS50cmltKClcbiAgICAgICAgY29uc3QgdmFsdWUgPSBtWzJdLnRyaW0oKS5yZXBsYWNlKCcsJywgJycpXG4gICAgICAgIGxldCBpbnRsVmFsdWUgPSB0aGlzLmRhdGFbdmFsdWVdXG5cbiAgICAgICAgaWYgKCF0aGlzLmRhdGFbdmFsdWVdKSB7XG4gICAgICAgICAgY29uc29sZS5sb2coYCR7TkFNRX0uIFdhcm5pbmcsICR7dmFsdWV9IGRvZXMgbm90IGV4aXN0LmApXG4gICAgICAgICAgaW50bFZhbHVlID0gdmFsdWVcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IG1ldGhvZE5hbWUgPSAnc2V0JyArIGtleS5jaGFyQXQoMCkudG9VcHBlckNhc2UoKSArIGtleS5zbGljZSgxKVxuXG4gICAgICAgIGlmICh0aGlzW21ldGhvZE5hbWVdKSB7XG4gICAgICAgICAgdGhpc1ttZXRob2ROYW1lXShlbGVtZW50LCBpbnRsVmFsdWUpXG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgdGhpcy5zZXRBdHRyaWJ1dGUoZWxlbWVudCwga2V5LCBpbnRsVmFsdWUpXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG5cbiAgICAvKipcbiAgICAqIFNldCB2YWx1ZXMgdG8gRE9NIG5vZGVzXG4gICAgKi9cbiAgICBzZXROb2RlcyhlbGVtZW50KSB7XG4gICAgICBBcnJheS5mcm9tKGVsZW1lbnQpLmZvckVhY2goZWwgPT4gdGhpcy5zZXROb2RlKGVsKSlcbiAgICB9XG4gIH1cblxuICByZXR1cm4gQmluZGVyXG59KSgpXG5cbmV4cG9ydCBkZWZhdWx0IEJpbmRlclxuIiwiLyoqXG4gKiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICogTGljZW5zZWQgdW5kZXIgTUlUIChodHRwczovL2dpdGh1Yi5jb20vcXVhcmstZGV2L1Bob25vbi1GcmFtZXdvcmsvYmxvYi9tYXN0ZXIvTElDRU5TRSlcbiAqIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gKi9cbmltcG9ydCBCaW5kZXIgZnJvbSAnLi9iaW5kZXInXG5cbmNvbnN0IEludGwgPSAoKCkgPT4ge1xuICAvKipcbiAgICogLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAqIENvbnN0YW50c1xuICAgKiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICovXG5cbiAgY29uc3QgTkFNRSA9ICdJbnRsJ1xuICBjb25zdCBWRVJTSU9OID0gJzIuMC4wJ1xuICBjb25zdCBERUZBVUxUX1BST1BFUlRJRVMgPSB7XG4gICAgZmFsbGJhY2tMb2NhbGU6ICdlbicsXG4gICAgbG9jYWxlOiAnZW4nLFxuICAgIGF1dG9CaW5kOiB0cnVlLFxuICAgIGRhdGE6IG51bGwsXG4gIH1cblxuICAvKipcbiAgICogLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAqIENsYXNzIERlZmluaXRpb25cbiAgICogLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAqL1xuXG4gIGNsYXNzIEludGwge1xuICAgIC8qKlxuICAgICAqIENyZWF0ZXMgYW4gaW5zdGFuY2Ugb2YgSW50bC5cbiAgICAgKiBAcGFyYW0ge2ZhbGxiYWNrTG9jYWxlOiBzdHJpbmcsIGxvY2FsZTogc3RyaW5nLCBhdXRvQmluZDogYm9vbGVhbiwgZGF0YToge1tsYW5nOiBzdHJpbmddOiB7W2tleTogc3RyaW5nXTogc3RyaW5nfX19XG4gICAgICovXG4gICAgY29uc3RydWN0b3Iob3B0aW9ucyA9IHt9KSB7XG4gICAgICB0aGlzLm9wdGlvbnMgPSBPYmplY3QuYXNzaWduKERFRkFVTFRfUFJPUEVSVElFUywgb3B0aW9ucylcblxuICAgICAgaWYgKHR5cGVvZiB0aGlzLm9wdGlvbnMuZmFsbGJhY2tMb2NhbGUgIT09ICdzdHJpbmcnKSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcihgJHtOQU1FfS4gVGhlIGZhbGxiYWNrIGxvY2FsZSBpcyBtYW5kYXRvcnkgYW5kIG11c3QgYmUgYSBzdHJpbmcuYClcbiAgICAgIH1cblxuICAgICAgaWYgKHRoaXMub3B0aW9ucy5kYXRhID09PSBudWxsKSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcihgJHtOQU1FfS4gVGhlcmUgaXMgbm8gdHJhbnNsYXRpb24gZGF0YS5gKVxuICAgICAgfVxuXG4gICAgICBpZiAodHlwZW9mIHRoaXMub3B0aW9ucy5kYXRhW3RoaXMub3B0aW9ucy5mYWxsYmFja0xvY2FsZV0gIT09ICdvYmplY3QnKSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcihgJHtOQU1FfS4gVGhlIGZhbGxiYWNrIGxvY2FsZSBtdXN0IG5lY2Vzc2FyaWx5IGhhdmUgdHJhbnNsYXRpb24gZGF0YS5gKVxuICAgICAgfVxuXG4gICAgICB0aGlzLnNldExvY2FsZSh0aGlzLm9wdGlvbnMubG9jYWxlLCB0aGlzLm9wdGlvbnMuYXV0b0JpbmQpXG4gICAgfVxuXG4gICAgc3RhdGljIGdldCB2ZXJzaW9uKCkge1xuICAgICAgcmV0dXJuIGAke05BTUV9LiR7VkVSU0lPTn1gXG4gICAgfVxuXG4gICAgZ2V0TG9jYWxlKCkge1xuICAgICAgcmV0dXJuIHRoaXMub3B0aW9ucy5sb2NhbGVcbiAgICB9XG5cbiAgICBnZXRGYWxsYmFja0xvY2FsZSgpIHtcbiAgICAgIHJldHVybiB0aGlzLm9wdGlvbnMuZmFsbGJhY2tMb2NhbGVcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBTZXQgZGVmYXVsdCBsb2NhbGVcbiAgICAgKiBAcGFyYW0ge3N0cmluZ30gbG9jYWxlXG4gICAgICogQHBhcmFtIHtib29sZWFufSBbdXBkYXRlSFRNTD10cnVlXVxuICAgICAqL1xuICAgIHNldExvY2FsZShsb2NhbGUsIHVwZGF0ZUhUTUwgPSB0cnVlKSB7XG4gICAgICBpZiAodHlwZW9mIHRoaXMub3B0aW9ucy5kYXRhW2xvY2FsZV0gIT09ICdvYmplY3QnKSB7XG4gICAgICAgIGNvbnNvbGUuZXJyb3IoYCR7TkFNRX0uICR7bG9jYWxlfSBoYXMgbm8gZGF0YSwgZmFsbGJhY2sgaW4gJHt0aGlzLm9wdGlvbnMuZmFsbGJhY2tMb2NhbGV9LmApXG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLm9wdGlvbnMubG9jYWxlID0gbG9jYWxlXG4gICAgICB9XG5cbiAgICAgIGlmICh1cGRhdGVIVE1MKSB7XG4gICAgICAgIHRoaXMudXBkYXRlSHRtbCgpXG4gICAgICB9XG4gICAgfVxuXG4gICAgZ2V0TGFuZ3VhZ2VzKCkge1xuICAgICAgcmV0dXJuIE9iamVjdC5rZXlzKHRoaXMub3B0aW9ucy5kYXRhKVxuICAgIH1cblxuICAgIGluc2VydFZhbHVlcyh2YWx1ZSA9IG51bGwsIGluamVjdGFibGVWYWx1ZXMgPSB7fSkge1xuICAgICAgaWYgKHR5cGVvZiB2YWx1ZSAhPT0gJ3N0cmluZycpIHtcbiAgICAgICAgcmV0dXJuIHVuZGVmaW5lZFxuICAgICAgfVxuXG4gICAgICBjb25zdCBtYXRjaCA9IHZhbHVlLm1hdGNoKC86KFthLXpBLVotXzAtOV0rKS8pXG4gICAgICBpZiAobWF0Y2gpIHtcbiAgICAgICAgdmFsdWUgPSB2YWx1ZS5yZXBsYWNlKG1hdGNoWzBdLCBpbmplY3RhYmxlVmFsdWVzW21hdGNoWzFdXSlcbiAgICAgIH1cblxuICAgICAgaWYgKHZhbHVlLm1hdGNoKC86KFthLXpBLVotXzAtOV0rKS8pKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmluc2VydFZhbHVlcyh2YWx1ZSwgaW5qZWN0YWJsZVZhbHVlcylcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIHZhbHVlXG4gICAgfVxuXG4gICAgdHJhbnNsYXRlKGtleU5hbWUgPSBudWxsLCBpbmplY3QgPSB7fSkge1xuICAgICAgbGV0IGRhdGEgPSB0aGlzLm9wdGlvbnMuZGF0YVt0aGlzLm9wdGlvbnMubG9jYWxlXVxuICAgICAgaWYgKCFkYXRhKSB7XG4gICAgICAgIGRhdGEgPSB0aGlzLm9wdGlvbnMuZGF0YVt0aGlzLm9wdGlvbnMuZmFsbGJhY2tMb2NhbGVdXG4gICAgICB9XG5cbiAgICAgIGlmIChrZXlOYW1lID09PSBudWxsIHx8IGtleU5hbWUgPT09ICcqJyB8fCBBcnJheS5pc0FycmF5KGtleU5hbWUpKSB7XG4gICAgICAgIGlmIChBcnJheS5pc0FycmF5KGtleU5hbWUpKSB7XG4gICAgICAgICAgY29uc3Qga2V5cyA9IE9iamVjdC5rZXlzKGRhdGEpLmZpbHRlcihrZXkgPT4ga2V5TmFtZS5pbmRleE9mKGtleSkgPiAtMSlcbiAgICAgICAgICBjb25zdCBmaWx0ZXJlZERhdGEgPSB7fVxuICAgICAgICAgIGtleXMuZm9yRWFjaChrZXkgPT4ge1xuICAgICAgICAgICAgZmlsdGVyZWREYXRhW2tleV0gPSB0aGlzLmluc2VydFZhbHVlcyhkYXRhW2tleV0sIGluamVjdClcbiAgICAgICAgICB9KVxuICAgICAgICAgIGRhdGEgPSBmaWx0ZXJlZERhdGFcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IGRhdGFNYXAgPSB7fVxuICAgICAgICBmb3IgKGNvbnN0IGtleSBpbiBkYXRhKSB7XG4gICAgICAgICAgZGF0YU1hcFtrZXldID0gdGhpcy5pbnNlcnRWYWx1ZXMoZGF0YVtrZXldLCBpbmplY3QpXG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gZGF0YU1hcFxuICAgICAgfVxuXG4gICAgICByZXR1cm4gdGhpcy5pbnNlcnRWYWx1ZXMoZGF0YVtrZXlOYW1lXSwgaW5qZWN0KVxuICAgIH1cblxuICAgIC8vIGFsaWFzIG9mIHQoKVxuICAgIHQoa2V5TmFtZSA9IG51bGwsIGluamVjdCA9IHt9KSB7XG4gICAgICByZXR1cm4gdGhpcy50cmFuc2xhdGUoa2V5TmFtZSwgaW5qZWN0KVxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFVwZGF0ZXMgdGhlIEhUTUwgdmlld3NcbiAgICAgKiBAcGFyYW0ge0hUTUxFbGVtZW50fSBlbGVtZW50XG4gICAgICovXG4gICAgdXBkYXRlSHRtbChlbGVtZW50KSB7XG4gICAgICBpZiAodHlwZW9mIGVsZW1lbnQgPT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgIGVsZW1lbnQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCdbZGF0YS1pMThuXScpXG4gICAgICB9XG5cbiAgICAgIGlmICh0eXBlb2YgZWxlbWVudCA9PT0gJ3N0cmluZycpIHtcbiAgICAgICAgZWxlbWVudCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoZWxlbWVudClcbiAgICAgIH1cblxuICAgICAgbmV3IEJpbmRlcihlbGVtZW50LCB0aGlzLnQoKSlcbiAgICB9XG5cbiAgICAvLyBzdGF0aWNcbiAgICBzdGF0aWMgX0RPTUludGVyZmFjZShvcHRpb25zKSB7XG4gICAgICByZXR1cm4gbmV3IEludGwob3B0aW9ucylcbiAgICB9XG4gIH1cblxuICByZXR1cm4gSW50bFxufSkoKVxuXG5leHBvcnQgZGVmYXVsdCBJbnRsXG4iLCIvKipcbiAqIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gKiBMaWNlbnNlZCB1bmRlciBNSVQgKGh0dHBzOi8vZ2l0aHViLmNvbS9xdWFyay1kZXYvUGhvbm9uLUZyYW1ld29yay9ibG9iL21hc3Rlci9MSUNFTlNFKVxuICogLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAqL1xuXG5pbXBvcnQgUGFnZSBmcm9tICcuL3BhZ2UnXG5pbXBvcnQgRXZlbnQgZnJvbSAnLi4vLi4vY29tbW9uL2V2ZW50cydcblxuY29uc3QgUGFnZXIgPSAoKCkgPT4ge1xuICAvKipcbiAgICogLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAqIENvbnN0YW50c1xuICAgKiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICovXG5cbiAgY29uc3QgTkFNRSA9ICdwYWdlcidcbiAgY29uc3QgVkVSU0lPTiA9ICcyLjAuMCdcbiAgY29uc3QgREVGQVVMVF9QUk9QRVJUSUVTID0ge1xuICAgIGhhc2hQcmVmaXg6ICcjIScsXG4gICAgdXNlSGFzaDogdHJ1ZSxcbiAgICBkZWZhdWx0UGFnZTogbnVsbCxcbiAgICBhbmltYXRlUGFnZXM6IHRydWUsXG4gIH1cblxuICBsZXQgY3VycmVudFBhZ2VcbiAgLyoqXG4gICAqIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgKiBDbGFzcyBEZWZpbml0aW9uXG4gICAqIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgKi9cblxuICBjbGFzcyBQYWdlciB7XG4gICAgLyoqXG4gICAgICogQGNvbnN0cnVjdG9yXG4gICAgICpcbiAgICAgKiBAcGFyYW0gb3B0aW9ucyB7T2JqZWN0fVxuICAgICAqL1xuICAgIGNvbnN0cnVjdG9yKG9wdGlvbnMgPSB7fSkge1xuICAgICAgdGhpcy5vcHRpb25zID0gT2JqZWN0LmFzc2lnbihERUZBVUxUX1BST1BFUlRJRVMsIG9wdGlvbnMpXG5cbiAgICAgIHRoaXMucGFnZXMgPSBbXVxuICAgICAgdGhpcy5zdGFydGVkID0gZmFsc2VcblxuICAgICAgLy8gYWRkIGdsb2JhbCBsaXN0ZW5lcnMgc3VjaCBhc2ggaGFzaCBjaGFuZ2UsIG5hdmlnYXRpb24sIGV0Yy5cbiAgICAgIHRoaXMuYWRkUGFnZXJFdmVudHMoKVxuXG4gICAgICAvLyBmYXN0ZXIgd2F5IHRvIGluaXQgcGFnZXMgYmVmb3JlIHRoZSBET00gaXMgcmVhZHlcbiAgICAgIHRoaXMub25ET01Mb2FkZWQoKVxuICAgIH1cblxuICAgIC8vIHByaXZhdGVcbiAgICBfKHNlbGVjdG9yKSB7XG4gICAgICByZXR1cm4gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihzZWxlY3RvcilcbiAgICB9XG5cbiAgICBnZXRIYXNoKCkge1xuICAgICAgcmV0dXJuIHdpbmRvdy5sb2NhdGlvbi5oYXNoLnNwbGl0KHRoaXMub3B0aW9ucy5oYXNoUHJlZml4KVsxXVxuICAgIH1cblxuICAgIGdldFBhZ2VGcm9tSGFzaCgpIHtcbiAgICAgIGNvbnN0IGhhc2ggPSB0aGlzLmdldEhhc2goKVxuICAgICAgY29uc3QgcmUgPSBuZXcgUmVnRXhwKCdbP1xcL10oW15cXC9dKiknKVxuICAgICAgY29uc3QgbWF0Y2hlcyA9IHJlLmV4ZWMoaGFzaClcblxuICAgICAgaWYgKG1hdGNoZXMgJiYgbWF0Y2hlc1sxXSkge1xuICAgICAgICByZXR1cm4gbWF0Y2hlc1sxXVxuICAgICAgfVxuXG4gICAgICByZXR1cm4gbnVsbFxuICAgIH1cblxuICAgIHNldEhhc2gocGFnZU5hbWUpIHtcbiAgICAgIHdpbmRvdy5sb2NhdGlvbi5oYXNoID0gYCR7dGhpcy5vcHRpb25zLmhhc2hQcmVmaXh9LyR7cGFnZU5hbWV9YFxuICAgIH1cblxuICAgIGFyZVNhbWVQYWdlKHBhZ2VOYW1lMSwgcGFnZU5hbWUyKSB7XG4gICAgICBjb25zdCBwYWdlMSA9IHRoaXMuZ2V0UGFnZU1vZGVsKHBhZ2VOYW1lMSlcbiAgICAgIGNvbnN0IHBhZ2UyID0gdGhpcy5nZXRQYWdlTW9kZWwocGFnZU5hbWUyKVxuICAgICAgcmV0dXJuIHBhZ2UxICYmIHBhZ2UyICYmIHBhZ2UxLm5hbWUgPT09IHBhZ2UyLm5hbWVcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBBdHRhY2hlcyB0aGUgbWFpbiBldmVudHMgZm9yIHRyYWNraW5nIGhhc2ggY2hhbmdlcyxcbiAgICAgKiBjbGljayBvbiBuYXZpZ2F0aW9uIGJ1dHRvbnMgYW5kIGxpbmtzIGFuZCBiYWNrIGhpc3RvcnlcbiAgICAgKi9cbiAgICBhZGRQYWdlckV2ZW50cygpIHtcbiAgICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgZXZlbnQgPT4gdGhpcy5vbkNsaWNrKGV2ZW50KSlcbiAgICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdwb3BzdGF0ZScsIGV2ZW50ID0+IHRoaXMub25CYWNrSGlzdG9yeShldmVudCkpXG4gICAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcignaGFzaGNoYW5nZScsIGV2ZW50ID0+IHRoaXMub25IYXNoQ2hhbmdlKGV2ZW50KSlcbiAgICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ0RPTUNvbnRlbnRMb2FkZWQnLCBldmVudCA9PiB0aGlzLm9uRE9NTG9hZGVkKGV2ZW50KSlcbiAgICB9XG5cbiAgICAvLyBnZXR0ZXJzXG5cbiAgICBzdGF0aWMgZ2V0IHZlcnNpb24oKSB7XG4gICAgICByZXR1cm4gYCR7TkFNRX0uJHtWRVJTSU9OfWBcbiAgICB9XG5cbiAgICAvLyBwdWJsaWNcblxuICAgIHNob3dQYWdlKHBhZ2VOYW1lLCBhZGRUb0hpc3RvcnkgPSB0cnVlLCBiYWNrID0gZmFsc2UpIHtcbiAgICAgIGNvbnN0IG9sZFBhZ2UgPSB0aGlzLl8oJy5jdXJyZW50JylcbiAgICAgIGlmIChvbGRQYWdlKSB7XG4gICAgICAgIGNvbnN0IG9sZFBhZ2VOYW1lID0gb2xkUGFnZS5nZXRBdHRyaWJ1dGUoJ2RhdGEtcGFnZScpXG5cbiAgICAgICAgaWYgKHRoaXMuYXJlU2FtZVBhZ2UocGFnZU5hbWUsIG9sZFBhZ2VOYW1lKSkge1xuICAgICAgICAgIHJldHVyblxuICAgICAgICB9XG5cbiAgICAgICAgb2xkUGFnZS5jbGFzc0xpc3QucmVtb3ZlKCdjdXJyZW50JylcblxuICAgICAgICAvLyBoaXN0b3J5XG4gICAgICAgIHdpbmRvdy5oaXN0b3J5LnJlcGxhY2VTdGF0ZSh7IHBhZ2U6IG9sZFBhZ2VOYW1lIH0sIG9sZFBhZ2VOYW1lLCB3aW5kb3cubG9jYXRpb24uaHJlZilcblxuICAgICAgICB0aGlzLnRyaWdnZXJQYWdlRXZlbnQob2xkUGFnZU5hbWUsIEV2ZW50LkhJREUpXG4gICAgICB9XG5cbiAgICAgIHRoaXMudHJpZ2dlclBhZ2VFdmVudChwYWdlTmFtZSwgRXZlbnQuU0hPVylcblxuICAgICAgY3VycmVudFBhZ2UgPSBwYWdlTmFtZVxuXG4gICAgICAvLyBuZXcgcGFnZVxuICAgICAgY29uc3QgbmV3UGFnZSA9IHRoaXMuXyhgW2RhdGEtcGFnZT1cIiR7cGFnZU5hbWV9XCJdYClcblxuICAgICAgbmV3UGFnZS5jbGFzc0xpc3QuYWRkKCdjdXJyZW50JylcblxuICAgICAgLy8gdGVtcGxhdGUgbG9hZGVyXG4gICAgICBjb25zdCBwYWdlTW9kZWwgPSB0aGlzLmdldFBhZ2VNb2RlbChwYWdlTmFtZSlcblxuICAgICAgLy8gQHRvZG86IHVzZSB0ZW1wbGF0ZSBjYWNoZT9cbiAgICAgIGlmIChwYWdlTW9kZWwgJiYgcGFnZU1vZGVsLmdldFRlbXBsYXRlKCkpIHtcbiAgICAgICAgcGFnZU1vZGVsLmxvYWRUZW1wbGF0ZSgpXG4gICAgICB9XG4gICAgICAvLyBlbmRcblxuICAgICAgaWYgKG9sZFBhZ2UpIHtcbiAgICAgICAgY29uc3Qgb2xkUGFnZU5hbWUgPSBvbGRQYWdlLmdldEF0dHJpYnV0ZSgnZGF0YS1wYWdlJylcbiAgICAgICAgLy8gdXNlIG9mIHByb3RvdHlwZS1vcmllbnRlZCBsYW5ndWFnZVxuICAgICAgICBvbGRQYWdlLmJhY2sgPSBiYWNrXG4gICAgICAgIG9sZFBhZ2UucHJldmlvdXNQYWdlTmFtZSA9IG9sZFBhZ2VOYW1lXG5cbiAgICAgICAgY29uc3Qgb25QYWdlQW5pbWF0aW9uRW5kID0gKCkgPT4ge1xuICAgICAgICAgIGlmIChvbGRQYWdlLmNsYXNzTGlzdC5jb250YWlucygnYW5pbWF0ZScpKSB7XG4gICAgICAgICAgICBvbGRQYWdlLmNsYXNzTGlzdC5yZW1vdmUoJ2FuaW1hdGUnKVxuICAgICAgICAgIH1cblxuICAgICAgICAgIG9sZFBhZ2UuY2xhc3NMaXN0LnJlbW92ZShvbGRQYWdlLmJhY2sgPyAncG9wLXBhZ2UnIDogJ3B1c2gtcGFnZScpXG5cbiAgICAgICAgICB0aGlzLnRyaWdnZXJQYWdlRXZlbnQoY3VycmVudFBhZ2UsIEV2ZW50LlNIT1dOKVxuICAgICAgICAgIHRoaXMudHJpZ2dlclBhZ2VFdmVudChvbGRQYWdlLnByZXZpb3VzUGFnZU5hbWUsIEV2ZW50LkhJRERFTilcblxuICAgICAgICAgIG9sZFBhZ2UucmVtb3ZlRXZlbnRMaXN0ZW5lcihFdmVudC5BTklNQVRJT05fRU5ELCBvblBhZ2VBbmltYXRpb25FbmQpXG4gICAgICAgIH1cblxuICAgICAgICBpZiAodGhpcy5vcHRpb25zLmFuaW1hdGVQYWdlcykge1xuICAgICAgICAgIG9sZFBhZ2UuYWRkRXZlbnRMaXN0ZW5lcihFdmVudC5BTklNQVRJT05fRU5ELCBvblBhZ2VBbmltYXRpb25FbmQpXG4gICAgICAgICAgb2xkUGFnZS5jbGFzc0xpc3QuYWRkKCdhbmltYXRlJylcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBvblBhZ2VBbmltYXRpb25FbmQoKVxuICAgICAgICB9XG5cbiAgICAgICAgb2xkUGFnZS5jbGFzc0xpc3QuYWRkKGJhY2sgPyAncG9wLXBhZ2UnIDogJ3B1c2gtcGFnZScpXG4gICAgICB9XG4gICAgfVxuXG4gICAgYWRkVW5pcXVlUGFnZU1vZGVsKHBhZ2VOYW1lKSB7XG4gICAgICBpZiAoIXRoaXMuZ2V0UGFnZU1vZGVsKHBhZ2VOYW1lKSkge1xuICAgICAgICB0aGlzLnBhZ2VzLnB1c2gobmV3IFBhZ2UocGFnZU5hbWUpKVxuICAgICAgfVxuICAgIH1cblxuICAgIGdldFBhZ2VNb2RlbChwYWdlTmFtZSkge1xuICAgICAgcmV0dXJuIHRoaXMucGFnZXMuZmluZChwYWdlID0+IHBhZ2UubmFtZSA9PT0gcGFnZU5hbWUpXG4gICAgfVxuXG4gICAgZ2V0UGFnZXNNb2RlbChwYWdlTmFtZXMpIHtcbiAgICAgIHJldHVybiB0aGlzLnBhZ2VzLmZpbHRlcihwYWdlID0+IHBhZ2VOYW1lcy5pbmRleE9mKHBhZ2UubmFtZSkgPiAtMSlcbiAgICB9XG5cbiAgICBzZWxlY3RvclRvQXJyYXkoc3RyKSB7XG4gICAgICByZXR1cm4gc3RyLnNwbGl0KCcsJykubWFwKGl0ZW0gPT4gaXRlbS50cmltKCkpXG4gICAgfVxuXG4gICAgYWRkRXZlbnRzKGNhbGxiYWNrKSB7XG4gICAgICBpZiAodGhpcy5jYWNoZVBhZ2VTZWxlY3RvciA9PT0gJyonKSB7XG4gICAgICAgIC8vIGFkZCB0byBhbGwgcGFnZSBtb2RlbHNcbiAgICAgICAgdGhpcy5wYWdlcy5mb3JFYWNoKChwYWdlKSA9PiB7XG4gICAgICAgICAgcGFnZS5hZGRFdmVudENhbGxiYWNrKGNhbGxiYWNrKVxuICAgICAgICB9KVxuICAgICAgICByZXR1cm5cbiAgICAgIH1cblxuICAgICAgY29uc3QgcGFnZU1vZGVscyA9IHRoaXMuZ2V0UGFnZXNNb2RlbCh0aGlzLnNlbGVjdG9yVG9BcnJheSh0aGlzLmNhY2hlUGFnZVNlbGVjdG9yKSwgdHJ1ZSlcbiAgICAgIHBhZ2VNb2RlbHMuZm9yRWFjaCgocGFnZSkgPT4ge1xuICAgICAgICBwYWdlLmFkZEV2ZW50Q2FsbGJhY2soY2FsbGJhY2spXG4gICAgICB9KVxuICAgICAgdGhpcy5jYWNoZVBhZ2VTZWxlY3RvciA9IG51bGxcbiAgICB9XG5cbiAgICB1c2VUZW1wbGF0ZSh0ZW1wbGF0ZVBhdGgsIHJlbmRlckZ1bmN0aW9uID0gbnVsbCkge1xuICAgICAgY29uc3QgcGFnZU1vZGVscyA9IHRoaXMuZ2V0UGFnZXNNb2RlbCh0aGlzLnNlbGVjdG9yVG9BcnJheSh0aGlzLmNhY2hlUGFnZVNlbGVjdG9yKSwgdHJ1ZSlcbiAgICAgIHBhZ2VNb2RlbHMuZm9yRWFjaCgocGFnZSkgPT4ge1xuICAgICAgICBwYWdlLnVzZVRlbXBsYXRlKHRlbXBsYXRlUGF0aClcbiAgICAgICAgaWYgKHR5cGVvZiByZW5kZXJGdW5jdGlvbiA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICAgIHBhZ2UudXNlVGVtcGxhdGVSZW5kZXJlcihyZW5kZXJGdW5jdGlvbilcbiAgICAgICAgfVxuICAgICAgfSlcbiAgICAgIHRoaXMuY2FjaGVQYWdlU2VsZWN0b3IgPSBudWxsXG4gICAgfVxuXG4gICAgdHJpZ2dlclBhZ2VFdmVudChwYWdlTmFtZSwgZXZlbnROYW1lLCBldmVudFBhcmFtcyA9IG51bGwpIHtcbiAgICAgIGNvbnN0IHBhZ2VNb2RlbCA9IHRoaXMuZ2V0UGFnZU1vZGVsKHBhZ2VOYW1lKVxuICAgICAgaWYgKHBhZ2VNb2RlbCkge1xuICAgICAgICBwYWdlTW9kZWwudHJpZ2dlclNjb3BlcyhldmVudE5hbWUsIGV2ZW50UGFyYW1zKVxuICAgICAgfVxuICAgIH1cblxuICAgIG9uQ2xpY2soZXZlbnQpIHtcbiAgICAgIGNvbnN0IHBhZ2VOYW1lID0gZXZlbnQudGFyZ2V0LmdldEF0dHJpYnV0ZSgnZGF0YS1uYXZpZ2F0ZScpXG4gICAgICBjb25zdCBwdXNoUGFnZSA9ICEoZXZlbnQudGFyZ2V0LmdldEF0dHJpYnV0ZSgnZGF0YS1wb3AtcGFnZScpID09PSAndHJ1ZScpXG5cbiAgICAgIGlmIChwYWdlTmFtZSkge1xuICAgICAgICBpZiAocGFnZU5hbWUgPT09ICckYmFjaycpIHtcbiAgICAgICAgICAvLyB0aGUgcG9wc3RhdGUgZXZlbnQgd2lsbCBiZSB0cmlnZ2VyZWRcbiAgICAgICAgICB3aW5kb3cuaGlzdG9yeS5iYWNrKClcbiAgICAgICAgICByZXR1cm5cbiAgICAgICAgfVxuXG4gICAgICAgIC8qXG4gICAgICAgICAqIElmIHdlIGhlIHVzZSB0aGUgaGFzaCBhcyB0cmlnZ2VyLFxuICAgICAgICAgKiB3ZSBjaGFuZ2UgaXQgZHluYW1pY2FsbHkgc28gdGhhdCB0aGUgaGFzaGNoYW5nZSBldmVudCBpcyBjYWxsZWRcbiAgICAgICAgICogT3RoZXJ3aXNlLCB3ZSBzaG93IHRoZSBwYWdlXG4gICAgICAgICAqL1xuICAgICAgICBpZiAodGhpcy5vcHRpb25zLnVzZUhhc2gpIHtcbiAgICAgICAgICB0aGlzLnNldEhhc2gocGFnZU5hbWUpXG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgdGhpcy5zaG93UGFnZShwYWdlTmFtZSwgdHJ1ZSwgcHVzaFBhZ2UpXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG5cbiAgICBvbkJhY2tIaXN0b3J5KGV2ZW50ID0ge30pIHtcbiAgICAgIGNvbnN0IHBhZ2VOYW1lID0gZXZlbnQuc3RhdGUgPyBldmVudC5zdGF0ZS5wYWdlIDogbnVsbFxuICAgICAgaWYgKCFwYWdlTmFtZSkge1xuICAgICAgICByZXR1cm5cbiAgICAgIH1cblxuICAgICAgdGhpcy5zaG93UGFnZShwYWdlTmFtZSwgdHJ1ZSwgdHJ1ZSlcbiAgICB9XG5cbiAgICBvbkhhc2hDaGFuZ2UoKSB7XG4gICAgICBjb25zdCBwYXJhbXMgPSAodGhpcy5nZXRIYXNoKCkgPyB0aGlzLmdldEhhc2goKS5zcGxpdCgnLycpIDogW10pLmZpbHRlcihwID0+IHAubGVuZ3RoID4gMClcbiAgICAgIGlmIChwYXJhbXMubGVuZ3RoID4gMCkge1xuICAgICAgICAvLyByZW1vdmUgZmlyc3QgdmFsdWUgd2hpY2ggaXMgdGhlIHBhZ2UgbmFtZVxuICAgICAgICBwYXJhbXMuc2hpZnQoKVxuICAgICAgfVxuXG4gICAgICB0aGlzLnRyaWdnZXJQYWdlRXZlbnQoY3VycmVudFBhZ2UsIEV2ZW50LkhBU0gsIHBhcmFtcylcblxuICAgICAgY29uc3QgbmF2UGFnZSA9IHRoaXMuZ2V0UGFnZUZyb21IYXNoKClcbiAgICAgIGlmIChuYXZQYWdlKSB7XG4gICAgICAgIHRoaXMuc2hvd1BhZ2UobmF2UGFnZSlcbiAgICAgIH1cbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBRdWVyaWVzIHRoZSBwYWdlIG5vZGVzIGluIHRoZSBET01cbiAgICAgKi9cbiAgICBvbkRPTUxvYWRlZCgpIHtcbiAgICAgIGNvbnN0IHBhZ2VzID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnW2RhdGEtcGFnZV0nKVxuXG4gICAgICBpZiAoIXBhZ2VzKSB7XG4gICAgICAgIHJldHVyblxuICAgICAgfVxuXG4gICAgICBwYWdlcy5mb3JFYWNoKChwYWdlKSA9PiB7XG4gICAgICAgIGxldCBwYWdlTmFtZSA9IHBhZ2UuZ2V0QXR0cmlidXRlKCdkYXRhLXBhZ2UnKVxuICAgICAgICAvKlxuICAgICAgICAgKiB0aGUgcGFnZSBuYW1lIGNhbiBiZSBnaXZlbiB3aXRoIHRoZSBhdHRyaWJ1dGUgZGF0YS1wYWdlXG4gICAgICAgICAqIG9yIHdpdGggaXRzIG5vZGUgbmFtZVxuICAgICAgICAgKi9cbiAgICAgICAgaWYgKCFwYWdlTmFtZSkge1xuICAgICAgICAgIHBhZ2VOYW1lID0gcGFnZS5ub2RlTmFtZVxuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5hZGRVbmlxdWVQYWdlTW9kZWwocGFnZU5hbWUpXG4gICAgICB9KVxuICAgIH1cblxuICAgIHNlbGVjdChwYWdlTmFtZSwgYWRkUGFnZU1vZGVsID0gdHJ1ZSkge1xuICAgICAgdGhpcy5jYWNoZVBhZ2VTZWxlY3RvciA9IHBhZ2VOYW1lXG5cbiAgICAgIGlmIChhZGRQYWdlTW9kZWwgJiYgcGFnZU5hbWUgIT09ICcqJykge1xuICAgICAgICB0aGlzLmFkZFVuaXF1ZVBhZ2VNb2RlbChwYWdlTmFtZSlcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIHRoaXNcbiAgICB9XG5cbiAgICBzdGFydChmb3JjZURlZmF1bHRQYWdlID0gZmFsc2UpIHtcbiAgICAgIC8vIGNoZWNrIGlmIHRoZSBhcHAgaGFzIGJlZW4gYWxyZWFkeSBzdGFydGVkXG4gICAgICBpZiAodGhpcy5zdGFydGVkKSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcihgJHtOQU1FfS4gVGhlIGFwcCBoYXMgYmVlbiBhbHJlYWR5IHN0YXJ0ZWQuYClcbiAgICAgIH1cblxuICAgICAgdGhpcy5zdGFydGVkID0gdHJ1ZVxuXG4gICAgICAvLyBmb3JjZSBkZWZhdWx0IHBhZ2Ugb24gQ29yZG92YVxuICAgICAgaWYgKHdpbmRvdy5jb3Jkb3ZhKSB7XG4gICAgICAgIGZvcmNlRGVmYXVsdFBhZ2UgPSB0cnVlXG4gICAgICB9XG5cbiAgICAgIGxldCBwYWdlTmFtZSA9IHRoaXMuZ2V0UGFnZUZyb21IYXNoKClcbiAgICAgIGlmICghdGhpcy5nZXRQYWdlTW9kZWwocGFnZU5hbWUpKSB7XG4gICAgICAgIHBhZ2VOYW1lID0gdGhpcy5vcHRpb25zLmRlZmF1bHRQYWdlXG4gICAgICB9XG5cbiAgICAgIGlmIChmb3JjZURlZmF1bHRQYWdlICYmICF0aGlzLm9wdGlvbnMuZGVmYXVsdFBhZ2UpIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKGAke05BTUV9LiBUaGUgZGVmYXVsdCBwYWdlIG11c3QgZXhpc3QgZm9yIGZvcmNpbmcgaXRzIGxhdW5jaCFgKVxuICAgICAgfVxuXG4gICAgICAvKlxuICAgICAgICogaWYgdGhlIGFwcCBpcyBjb25maWd1cmF0ZWQgdG8gdXNlIGhhc2ggdHJhY2tpbmdcbiAgICAgICAqIHdlIGFkZCB0aGUgcGFnZSBkeW5hbWljYWxseSBpbiB0aGUgdXJsXG4gICAgICAgKi9cbiAgICAgIGlmICh0aGlzLm9wdGlvbnMudXNlSGFzaCkge1xuICAgICAgICB0aGlzLnNldEhhc2gocGFnZU5hbWUpXG4gICAgICB9XG5cbiAgICAgIHRoaXMuc2hvd1BhZ2UoZm9yY2VEZWZhdWx0UGFnZSA/IHRoaXMub3B0aW9ucy5kZWZhdWx0UGFnZSA6IHBhZ2VOYW1lKVxuICAgIH1cblxuICAgIC8vIHN0YXRpY1xuICAgIHN0YXRpYyBfRE9NSW50ZXJmYWNlKG9wdGlvbnMpIHtcbiAgICAgIHJldHVybiBuZXcgUGFnZXIob3B0aW9ucylcbiAgICB9XG4gIH1cblxuICByZXR1cm4gUGFnZXJcbn0pKClcblxuZXhwb3J0IGRlZmF1bHQgUGFnZXJcbiIsIi8qKlxuICogLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAqIExpY2Vuc2VkIHVuZGVyIE1JVCAoaHR0cHM6Ly9naXRodWIuY29tL3F1YXJrLWRldi9QaG9ub24tRnJhbWV3b3JrL2Jsb2IvbWFzdGVyL0xJQ0VOU0UpXG4gKiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICovXG5cbmltcG9ydCB7IGxvYWRGaWxlIH0gZnJvbSAnLi4vLi4vY29tbW9uL3V0aWxzJ1xuaW1wb3J0IHsgZGlzcGF0Y2hQYWdlRXZlbnQgfSBmcm9tICcuLi8uLi9jb21tb24vZXZlbnRzL2Rpc3BhdGNoJ1xuXG5jb25zdCBQYWdlID0gKCgpID0+IHtcbiAgLyoqXG4gICAqIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgKiBDb25zdGFudHNcbiAgICogLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAqL1xuXG4gIGNvbnN0IE5BTUUgPSAncGFnZSdcbiAgY29uc3QgVkVSU0lPTiA9ICcyLjAuMCdcblxuICBjb25zdCBURU1QTEFURV9TRUxFQ1RPUiA9ICdbZGF0YS10ZW1wbGF0ZV0nXG5cbiAgLyoqXG4gICAqIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgKiBDbGFzcyBEZWZpbml0aW9uXG4gICAqIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgKi9cblxuICBjbGFzcyBQYWdlIHtcbiAgICAvKipcbiAgICAgKiBDcmVhdGVzIGFuIGluc3RhbmNlIG9mIFBhZ2UuXG4gICAgICogQHBhcmFtIHtzdHJpbmd9IHBhZ2VOYW1lXG4gICAgICovXG4gICAgY29uc3RydWN0b3IocGFnZU5hbWUpIHtcbiAgICAgIHRoaXMubmFtZSA9IHBhZ2VOYW1lXG4gICAgICB0aGlzLmV2ZW50cyA9IFtdXG4gICAgICB0aGlzLnRlbXBsYXRlUGF0aCA9IG51bGxcbiAgICAgIHRoaXMucmVuZGVyRnVuY3Rpb24gPSBudWxsXG4gICAgfVxuXG4gICAgLy8gZ2V0dGVyc1xuXG4gICAgc3RhdGljIGdldCB2ZXJzaW9uKCkge1xuICAgICAgcmV0dXJuIGAke05BTUV9LiR7VkVSU0lPTn1gXG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogR2V0IGV2ZW50c1xuICAgICAqIEByZXR1cm5zIHtGdW5jdGlvbltdfVxuICAgICAqL1xuICAgIGdldEV2ZW50cygpIHtcbiAgICAgIHJldHVybiB0aGlzLmV2ZW50c1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEdldCB0ZW1wbGF0ZVxuICAgICAqIEByZXR1cm5zIHtzdHJpbmd9XG4gICAgICovXG4gICAgZ2V0VGVtcGxhdGUoKSB7XG4gICAgICByZXR1cm4gdGhpcy50ZW1wbGF0ZVBhdGhcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBHZXQgcmVuZGVyIGZ1bmN0aW9uXG4gICAgICogQHJldHVybnMge0Z1bmN0aW9ufVxuICAgICAqL1xuICAgIGdldFJlbmRlckZ1bmN0aW9uKCkge1xuICAgICAgcmV0dXJuIHRoaXMucmVuZGVyRnVuY3Rpb25cbiAgICB9XG5cbiAgICBsb2FkVGVtcGxhdGUoKSB7XG4gICAgICBjb25zdCBwYWdlRWxlbWVudCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoYFtkYXRhLXBhZ2U9XCIke3RoaXMubmFtZX1cIl1gKVxuXG4gICAgICBsb2FkRmlsZSh0aGlzLmdldFRlbXBsYXRlKCksICh0ZW1wbGF0ZSkgPT4ge1xuICAgICAgICBsZXQgcmVuZGVyID0gZnVuY3Rpb24gKERPTVBhZ2UsIHRlbXBsYXRlLCBlbGVtZW50cykge1xuICAgICAgICAgIGlmIChlbGVtZW50cykge1xuICAgICAgICAgICAgQXJyYXkuZnJvbShlbGVtZW50cykuZm9yRWFjaCgoZWwpID0+IHtcbiAgICAgICAgICAgICAgZWwuaW5uZXJIVE1MID0gdGVtcGxhdGVcbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIERPTVBhZ2UuaW5uZXJIVE1MID0gdGVtcGxhdGVcbiAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBpZiAodGhpcy5nZXRSZW5kZXJGdW5jdGlvbigpKSB7XG4gICAgICAgICAgcmVuZGVyID0gdGhpcy5nZXRSZW5kZXJGdW5jdGlvbigpXG4gICAgICAgIH1cblxuICAgICAgICByZW5kZXIocGFnZUVsZW1lbnQsIHRlbXBsYXRlLCBwYWdlRWxlbWVudC5xdWVyeVNlbGVjdG9yQWxsKFRFTVBMQVRFX1NFTEVDVE9SKSlcbiAgICAgIH0sIG51bGwpXG4gICAgfVxuXG4gICAgLy8gcHVibGljXG5cbiAgICAvKipcbiAgICAgKlxuICAgICAqIEBwYXJhbSB7Kn0gY2FsbGJhY2tGblxuICAgICAqL1xuICAgIGFkZEV2ZW50Q2FsbGJhY2soY2FsbGJhY2tGbikge1xuICAgICAgdGhpcy5ldmVudHMucHVzaChjYWxsYmFja0ZuKVxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFVzZSB0aGUgZ2l2ZW4gdGVtcGxhdGVcbiAgICAgKlxuICAgICAqIEBwYXJhbSB7c3RyaW5nfSB0ZW1wbGF0ZVBhdGhcbiAgICAgKi9cbiAgICB1c2VUZW1wbGF0ZSh0ZW1wbGF0ZVBhdGgpIHtcbiAgICAgIGlmICh0eXBlb2YgdGVtcGxhdGVQYXRoICE9PSAnc3RyaW5nJykge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ1RoZSB0ZW1wbGF0ZSBwYXRoIG11c3QgYmUgYSBzdHJpbmcuICcgKyB0eXBlb2YgdGVtcGxhdGVQYXRoICsgJyBpcyBnaXZlbicpXG4gICAgICB9XG4gICAgICB0aGlzLnRlbXBsYXRlUGF0aCA9IHRlbXBsYXRlUGF0aFxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFVzZSB0aGUgZ2l2ZW4gdGVtcGxhdGUgcmVuZGVyZXJcbiAgICAgKiBAcGFyYW0ge0Z1bmN0aW9ufSByZW5kZXJGdW5jdGlvblxuICAgICAqL1xuICAgIHVzZVRlbXBsYXRlUmVuZGVyZXIocmVuZGVyRnVuY3Rpb24pIHtcbiAgICAgIGlmICh0eXBlb2YgcmVuZGVyRnVuY3Rpb24gIT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdUaGUgY3VzdG9tIHRlbXBsYXRlIHJlbmRlcmVyIG11c3QgYmUgYSBmdW5jdGlvbi4gJyArIHR5cGVvZiByZW5kZXJGdW5jdGlvbiArICcgaXMgZ2l2ZW4nKVxuICAgICAgfVxuICAgICAgdGhpcy5yZW5kZXJGdW5jdGlvbiA9IHJlbmRlckZ1bmN0aW9uXG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogVHJpZ2dlciBzY29wZXNcbiAgICAgKiBAcGFyYW0ge3N0cmluZ30gZXZlbnROYW1lXG4gICAgICogQHBhcmFtIHt7fX0gW2V2ZW50UGFyYW1zPXt9XVxuICAgICAqL1xuICAgIHRyaWdnZXJTY29wZXMoZXZlbnROYW1lLCBldmVudFBhcmFtcyA9IHt9KSB7XG4gICAgICBjb25zdCBldmVudE5hbWVBbGlhcyA9IGBvbiR7ZXZlbnROYW1lLmNoYXJBdCgwKS50b1VwcGVyQ2FzZSgpfSR7ZXZlbnROYW1lLnNsaWNlKDEpfWBcblxuICAgICAgdGhpcy5ldmVudHMuZm9yRWFjaCgoc2NvcGUpID0+IHtcbiAgICAgICAgY29uc3Qgc2NvcGVFdmVudCA9IHNjb3BlW2V2ZW50TmFtZV1cbiAgICAgICAgY29uc3Qgc2NvcGVFdmVudEFsaWFzID0gc2NvcGVbZXZlbnROYW1lQWxpYXNdXG4gICAgICAgIGlmICh0eXBlb2Ygc2NvcGVFdmVudCA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICAgIHNjb3BlRXZlbnQuYXBwbHkodGhpcywgZXZlbnRQYXJhbXMpXG4gICAgICAgIH1cblxuICAgICAgICAvLyB0cmlnZ2VyIHRoZSBldmVudCBhbGlhc1xuICAgICAgICBpZiAodHlwZW9mIHNjb3BlRXZlbnRBbGlhcyA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICAgIHNjb3BlRXZlbnRBbGlhcy5hcHBseSh0aGlzLCBldmVudFBhcmFtcylcbiAgICAgICAgfVxuICAgICAgfSlcblxuICAgICAgZGlzcGF0Y2hQYWdlRXZlbnQoZXZlbnROYW1lLCB0aGlzLm5hbWUsIGV2ZW50UGFyYW1zKVxuICAgIH1cbiAgfVxuXG4gIHJldHVybiBQYWdlXG59KSgpXG5cbmV4cG9ydCBkZWZhdWx0IFBhZ2VcbiIsIi8qKlxuICogLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAqIExpY2Vuc2VkIHVuZGVyIE1JVCAoaHR0cHM6Ly9naXRodWIuY29tL3F1YXJrLWRldi9QaG9ub24tRnJhbWV3b3JrL2Jsb2IvbWFzdGVyL0xJQ0VOU0UpXG4gKiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICovXG5cbmltcG9ydCBQYWdlciBmcm9tICcuL2h5YnJpZC1hcHBzL3BhZ2VyL2luZGV4J1xuaW1wb3J0IEludGwgZnJvbSAnLi9oeWJyaWQtYXBwcy9pbnRsJ1xuaW1wb3J0IE5ldHdvcmsgZnJvbSAnLi9jb21tb24vbmV0d29yaydcblxuLy8gY29tcG9uZW50c1xuaW1wb3J0IERpYWxvZyBmcm9tICcuL2NvbXBvbmVudHMvZGlhbG9nJ1xuaW1wb3J0IFByb21wdCBmcm9tICcuL2NvbXBvbmVudHMvZGlhbG9nL3Byb21wdCdcbmltcG9ydCBDb25maXJtIGZyb20gJy4vY29tcG9uZW50cy9kaWFsb2cvY29uZmlybSdcbmltcG9ydCBEaWFsb2dMb2FkZXIgZnJvbSAnLi9jb21wb25lbnRzL2RpYWxvZy9sb2FkZXInXG5pbXBvcnQgTm90aWZpY2F0aW9uIGZyb20gJy4vY29tcG9uZW50cy9ub3RpZmljYXRpb24nXG5pbXBvcnQgQ29sbGFwc2UgZnJvbSAnLi9jb21wb25lbnRzL2NvbGxhcHNlJ1xuaW1wb3J0IEFjY29yZGlvbiBmcm9tICcuL2NvbXBvbmVudHMvYWNjb3JkaW9uJ1xuaW1wb3J0IFRhYiBmcm9tICcuL2NvbXBvbmVudHMvdGFiJ1xuaW1wb3J0IFByb2dyZXNzIGZyb20gJy4vY29tcG9uZW50cy9wcm9ncmVzcydcbmltcG9ydCBMb2FkZXIgZnJvbSAnLi9jb21wb25lbnRzL2xvYWRlcidcbmltcG9ydCBPZmZDYW52YXMgZnJvbSAnLi9jb21wb25lbnRzL29mZi1jYW52YXMnXG5pbXBvcnQgRHJvcGRvd24gZnJvbSAnLi9jb21wb25lbnRzL2Ryb3Bkb3duJ1xuaW1wb3J0IERyb3Bkb3duU2VhcmNoIGZyb20gJy4vY29tcG9uZW50cy9kcm9wZG93bi9zZWFyY2gnXG5cbmNvbnN0IGFwaSA9IHt9XG5cbi8qKlxuICogLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gKiBQYWdlclxuICogLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gKi9cbmFwaS5wYWdlciA9IChvcHRpb25zKSA9PiB7XG4gIGlmICh0eXBlb2YgYXBpLl9wYWdlciA9PT0gJ3VuZGVmaW5lZCcpIHtcbiAgICBhcGkuX3BhZ2VyID0gUGFnZXIuX0RPTUludGVyZmFjZShvcHRpb25zKVxuICB9XG4gIHJldHVybiBhcGkuX3BhZ2VyXG59XG5cbi8qKlxuICogLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gKiBJbnRsXG4gKiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAqL1xuYXBpLmludGwgPSBJbnRsLl9ET01JbnRlcmZhY2VcblxuLyoqXG4gKiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAqIE5ldHdvcmtcbiAqIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICovXG5hcGkubmV0d29yayA9IE5ldHdvcmsuX0RPTUludGVyZmFjZVxuXG4vKipcbiAqIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICogTm90aWZpY2F0aW9uXG4gKiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAqL1xuYXBpLm5vdGlmaWNhdGlvbiA9IE5vdGlmaWNhdGlvbi5fRE9NSW50ZXJmYWNlXG5cbi8qKlxuICogLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gKiBEaWFsb2dcbiAqIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICovXG5hcGkuZGlhbG9nID0gKG9wdGlvbnMpID0+IHtcbiAgaWYgKG9wdGlvbnMudHlwZSA9PT0gUHJvbXB0LmlkZW50aWZpZXIoKSkge1xuICAgIC8vIHByb21wdCBkaWFsb2dcbiAgICByZXR1cm4gUHJvbXB0Ll9ET01JbnRlcmZhY2Uob3B0aW9ucylcbiAgfVxuXG4gIGlmIChvcHRpb25zLnR5cGUgPT09IENvbmZpcm0uaWRlbnRpZmllcigpKSB7XG4gICAgLy8gY29uZmlybSBkaWFsb2dcbiAgICByZXR1cm4gQ29uZmlybS5fRE9NSW50ZXJmYWNlKG9wdGlvbnMpXG4gIH1cblxuICBpZiAob3B0aW9ucy50eXBlID09PSBEaWFsb2dMb2FkZXIuaWRlbnRpZmllcigpKSB7XG4gICAgLy8gY29uZmlybSBkaWFsb2dcbiAgICByZXR1cm4gRGlhbG9nTG9hZGVyLl9ET01JbnRlcmZhY2Uob3B0aW9ucylcbiAgfVxuXG4gIC8vIGdlbmVyaWMgZGlhbG9nXG4gIHJldHVybiBEaWFsb2cuX0RPTUludGVyZmFjZShvcHRpb25zKVxufVxuXG4vKipcbiAqIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICogQ29sbGFwc2VcbiAqIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICovXG5hcGkuY29sbGFwc2UgPSBDb2xsYXBzZS5fRE9NSW50ZXJmYWNlXG5cbi8qKlxuICogLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gKiBBY2NvcmRpb25cbiAqIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICovXG5hcGkuYWNjb3JkaW9uID0gQWNjb3JkaW9uLl9ET01JbnRlcmZhY2VcblxuXG4vKipcbiAqIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICogVGFiXG4gKiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAqL1xuYXBpLnRhYiA9IFRhYi5fRE9NSW50ZXJmYWNlXG5cbi8qKlxuICogLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gKiBQcm9ncmVzc1xuICogLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gKi9cbmFwaS5wcm9ncmVzcyA9IFByb2dyZXNzLl9ET01JbnRlcmZhY2VcblxuLyoqXG4gKiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAqIExvYWRlclxuICogLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gKi9cbmFwaS5sb2FkZXIgPSBMb2FkZXIuX0RPTUludGVyZmFjZVxuXG4vKipcbiAqIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICogT2ZmIGNhbnZhc1xuICogLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gKi9cbmFwaS5vZmZDYW52YXMgPSBPZmZDYW52YXMuX0RPTUludGVyZmFjZVxuXG4vKipcbiAqIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICogRHJvcGRvd25cbiAqIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICovXG5hcGkuZHJvcGRvd24gPSAob3B0aW9ucykgPT4ge1xuICBpZiAob3B0aW9ucy5zZWFyY2gpIHtcbiAgICAvLyBzZWFyY2ggZHJvcGRvd25cbiAgICByZXR1cm4gRHJvcGRvd25TZWFyY2guX0RPTUludGVyZmFjZShvcHRpb25zKVxuICB9XG5cbiAgLy8gZ2VuZXJpYyBkcm9wZG93blxuICByZXR1cm4gRHJvcGRvd24uX0RPTUludGVyZmFjZShvcHRpb25zKVxufVxuXG4vLyBNYWtlIHRoZSBBUEkgbGl2ZVxud2luZG93LnBob25vbiA9IGFwaVxuXG5leHBvcnQgZGVmYXVsdCBhcGlcbiJdLCJwcmVFeGlzdGluZ0NvbW1lbnQiOiIvLyMgc291cmNlTWFwcGluZ1VSTD1kYXRhOmFwcGxpY2F0aW9uL2pzb247Y2hhcnNldD11dGYtODtiYXNlNjQsZXlKMlpYSnphVzl1SWpvekxDSnpiM1Z5WTJWeklqcGJJbTV2WkdWZmJXOWtkV3hsY3k5aWNtOTNjMlZ5TFhCaFkyc3ZYM0J5Wld4MVpHVXVhbk1pTENKemNtTXZhbk12WTI5dGJXOXVMMlYyWlc1MGN5OWthWE53WVhSamFDNXFjeUlzSW5OeVl5OXFjeTlqYjIxdGIyNHZaWFpsYm5SekwybHVaR1Y0TG1weklpd2ljM0pqTDJwekwyTnZiVzF2Ymk5dVpYUjNiM0pyTDJsdVpHVjRMbXB6SWl3aWMzSmpMMnB6TDJOdmJXMXZiaTkxZEdsc2N5OXBibVJsZUM1cWN5SXNJbk55WXk5cWN5OWpiMjF3YjI1bGJuUnpMMkZqWTI5eVpHbHZiaTlwYm1SbGVDNXFjeUlzSW5OeVl5OXFjeTlqYjIxd2IyNWxiblJ6TDJOdmJHeGhjSE5sTDJsdVpHVjRMbXB6SWl3aWMzSmpMMnB6TDJOdmJYQnZibVZ1ZEhNdlkyOXRjRzl1Wlc1MExtcHpJaXdpYzNKakwycHpMMk52YlhCdmJtVnVkSE12WTI5dGNHOXVaVzUwVFdGdVlXZGxjaTVxY3lJc0luTnlZeTlxY3k5amIyMXdiMjVsYm5SekwyUnBZV3h2Wnk5amIyNW1hWEp0TG1weklpd2ljM0pqTDJwekwyTnZiWEJ2Ym1WdWRITXZaR2xoYkc5bkwybHVaR1Y0TG1weklpd2ljM0pqTDJwekwyTnZiWEJ2Ym1WdWRITXZaR2xoYkc5bkwyeHZZV1JsY2k1cWN5SXNJbk55WXk5cWN5OWpiMjF3YjI1bGJuUnpMMlJwWVd4dlp5OXdjbTl0Y0hRdWFuTWlMQ0p6Y21NdmFuTXZZMjl0Y0c5dVpXNTBjeTlrY205d1pHOTNiaTlwYm1SbGVDNXFjeUlzSW5OeVl5OXFjeTlqYjIxd2IyNWxiblJ6TDJSeWIzQmtiM2R1TDNObFlYSmphQzVxY3lJc0luTnlZeTlxY3k5amIyMXdiMjVsYm5SekwyeHZZV1JsY2k5cGJtUmxlQzVxY3lJc0luTnlZeTlxY3k5amIyMXdiMjVsYm5SekwyNXZkR2xtYVdOaGRHbHZiaTlwYm1SbGVDNXFjeUlzSW5OeVl5OXFjeTlqYjIxd2IyNWxiblJ6TDI5bVppMWpZVzUyWVhNdmFXNWtaWGd1YW5NaUxDSnpjbU12YW5NdlkyOXRjRzl1Wlc1MGN5OXdjbTluY21WemN5OXBibVJsZUM1cWN5SXNJbk55WXk5cWN5OWpiMjF3YjI1bGJuUnpMM1JoWWk5cGJtUmxlQzVxY3lJc0luTnlZeTlxY3k5b2VXSnlhV1F0WVhCd2N5OXBiblJzTDJKcGJtUmxjaTVxY3lJc0luTnlZeTlxY3k5b2VXSnlhV1F0WVhCd2N5OXBiblJzTDJsdVpHVjRMbXB6SWl3aWMzSmpMMnB6TDJoNVluSnBaQzFoY0hCekwzQmhaMlZ5TDJsdVpHVjRMbXB6SWl3aWMzSmpMMnB6TDJoNVluSnBaQzFoY0hCekwzQmhaMlZ5TDNCaFoyVXVhbk1pTENKemNtTXZhbk12YVc1a1pYZ3Vhbk1pWFN3aWJtRnRaWE1pT2x0ZExDSnRZWEJ3YVc1bmN5STZJa0ZCUVVFN096czdPenRSUTBGblFpeHRRaXhIUVVGQkxHMUNPMUZCVFVFc2IwSXNSMEZCUVN4dlFqdFJRVXRCTEdsQ0xFZEJRVUVzYVVJN1FVRllWQ3hUUVVGVExHMUNRVUZVTEVOQlFUWkNMRk5CUVRkQ0xFVkJRWGRETEZWQlFYaERMRVZCUVdsRk8wRkJRVUVzVFVGQllpeE5RVUZoTEhWRlFVRktMRVZCUVVrN08wRkJRM1JGTEUxQlFVMHNaMEpCUVcxQ0xGTkJRVzVDTEZsQlFXMURMRlZCUVhwRE8wRkJRMEVzVTBGQlR5eGhRVUZRTEVOQlFYRkNMRWxCUVVrc1YwRkJTaXhEUVVGblFpeGhRVUZvUWl4RlFVRXJRaXhGUVVGRkxHTkJRVVlzUlVGQkwwSXNRMEZCY2tJN1FVRkRRU3hYUVVGVExHRkJRVlFzUTBGQmRVSXNTVUZCU1N4WFFVRktMRU5CUVdkQ0xHRkJRV2hDTEVWQlFTdENMRVZCUVVVc1kwRkJSaXhGUVVFdlFpeERRVUYyUWp0QlFVTkVPenRCUVVWTkxGTkJRVk1zYjBKQlFWUXNRMEZCT0VJc1ZVRkJPVUlzUlVGQk1FTXNVMEZCTVVNc1JVRkJjVVFzVlVGQmNrUXNSVUZCT0VVN1FVRkJRU3hOUVVGaUxFMUJRV0VzZFVWQlFVb3NSVUZCU1RzN1FVRkRia1lzVFVGQlRTeG5Ra0ZCYlVJc1UwRkJia0lzV1VGQmJVTXNWVUZCZWtNN1FVRkRRU3hoUVVGWExHRkJRVmdzUTBGQmVVSXNTVUZCU1N4WFFVRktMRU5CUVdkQ0xHRkJRV2hDTEVWQlFTdENMRVZCUVVVc1kwRkJSaXhGUVVFdlFpeERRVUY2UWp0QlFVTkVPenRCUVVWTkxGTkJRVk1zYVVKQlFWUXNRMEZCTWtJc1UwRkJNMElzUlVGQmMwTXNVVUZCZEVNc1JVRkJOa1E3UVVGQlFTeE5RVUZpTEUxQlFXRXNkVVZCUVVvc1JVRkJTVHM3UVVGRGJFVXNUVUZCVFN4blFrRkJiVUlzVVVGQmJrSXNVMEZCSzBJc1UwRkJja003UVVGRFFTeFRRVUZQTEdGQlFWQXNRMEZCY1VJc1NVRkJTU3hYUVVGS0xFTkJRV2RDTEdGQlFXaENMRVZCUVN0Q0xFVkJRVVVzWTBGQlJpeEZRVUV2UWl4RFFVRnlRanRCUVVOQkxGZEJRVk1zWVVGQlZDeERRVUYxUWl4SlFVRkpMRmRCUVVvc1EwRkJaMElzWVVGQmFFSXNSVUZCSzBJc1JVRkJSU3hqUVVGR0xFVkJRUzlDTEVOQlFYWkNPMEZCUTBRN096czdPenM3TzBGRFprUTdRVUZEUVN4SlFVRkpMRTlCUVU4c1RVRkJVQ3hMUVVGclFpeFhRVUYwUWl4RlFVRnRRenRCUVVOcVF5eFRRVUZQTEdkQ1FVRlFMRU5CUVhkQ0xFOUJRWGhDTEVWQlFXbERMRmxCUVUwN1FVRkRja01zV1VGQlVTeExRVUZTTEVOQlFXTXNkVWRCUVdRN1FVRkRSQ3hIUVVaRU8wRkJSMFE3TzBGQlJVUTdRVUZEUVN4SlFVRkpMR3RDUVVGclFpeERRVUZETEZkQlFVUXNSVUZCWXl4WFFVRmtMRVZCUVRKQ0xGTkJRVE5DTEVOQlFYUkNPMEZCUTBFc1NVRkJTU3hqUVVGakxFdEJRV3hDT3p0QlFVVkJMRWxCUVVrc1QwRkJUeXhOUVVGUUxFdEJRV3RDTEZkQlFYUkNMRVZCUVcxRE8wRkJRMnBETEUxQlFVc3NhMEpCUVd0Q0xFMUJRVzVDTEVsQlFUaENMRTlCUVU4c1lVRkJVQ3hKUVVGM1FpeHZRa0ZCYjBJc1lVRkJPVVVzUlVGQk5rWTdRVUZETTBZc2EwSkJRV01zU1VGQlpEdEJRVU5CTEhOQ1FVRnJRaXhEUVVGRExGbEJRVVFzUlVGQlpTeFhRVUZtTEVWQlFUUkNMRlZCUVRWQ0xFVkJRWGRETEdGQlFYaERMRU5CUVd4Q08wRkJRMFE3TzBGQlJVUXNUVUZCU1N4UFFVRlBMRk5CUVZBc1EwRkJhVUlzWTBGQmNrSXNSVUZCY1VNN1FVRkRia01zYzBKQlFXdENMRU5CUVVNc1lVRkJSQ3hGUVVGblFpeGhRVUZvUWl4RlFVRXJRaXhYUVVFdlFpeEZRVUUwUXl4bFFVRTFReXhEUVVGc1FqdEJRVU5FTEVkQlJrUXNUVUZGVHl4SlFVRkpMRTlCUVU4c1UwRkJVQ3hEUVVGcFFpeG5Ra0ZCY2tJc1JVRkJkVU03UVVGRE5VTXNjMEpCUVd0Q0xFTkJRVU1zWlVGQlJDeEZRVUZyUWl4bFFVRnNRaXhGUVVGdFF5eGhRVUZ1UXl4RlFVRnJSQ3hwUWtGQmJFUXNRMEZCYkVJN1FVRkRSRHRCUVVOR096dEJRVVZFTEVsQlFVMHNTMEZCU3l4VFFVRlRMR0ZCUVZRc1EwRkJkVUlzUzBGQmRrSXNRMEZCV0R0QlFVTkJMRWxCUVUwc1kwRkJZeXhEUVVOc1FpeEZRVUZGTEUxQlFVMHNXVUZCVWl4RlFVRnpRaXhQUVVGUExHbENRVUUzUWl4RlFVRm5SQ3hMUVVGTExHVkJRWEpFTEVWQlJHdENMRVZCUld4Q0xFVkJRVVVzVFVGQlRTeGxRVUZTTEVWQlFYbENMRTlCUVU4c2FVSkJRV2hETEVWQlFXMUVMRXRCUVVzc1pVRkJlRVFzUlVGR2EwSXNSVUZIYkVJc1JVRkJSU3hOUVVGTkxHTkJRVklzUlVGQmQwSXNUMEZCVHl4dFFrRkJMMElzUlVGQmIwUXNTMEZCU3l4cFFrRkJla1FzUlVGSWEwSXNSVUZKYkVJc1JVRkJSU3hOUVVGTkxHdENRVUZTTEVWQlFUUkNMRTlCUVU4c2RVSkJRVzVETEVWQlFUUkVMRXRCUVVzc2NVSkJRV3BGTEVWQlNtdENMRU5CUVhCQ08wRkJUVUVzU1VGQlRTeGhRVUZoTEVOQlEycENMRVZCUVVVc1RVRkJUU3hYUVVGU0xFVkJRWEZDTEU5QlFVOHNaMEpCUVRWQ0xFVkJRVGhETEV0QlFVc3NZMEZCYmtRc1JVRkVhVUlzUlVGRmFrSXNSVUZCUlN4TlFVRk5MR05CUVZJc1JVRkJkMElzVDBGQlR5eG5Ra0ZCTDBJc1JVRkJhVVFzUzBGQlN5eGpRVUYwUkN4RlFVWnBRaXhGUVVkcVFpeEZRVUZGTEUxQlFVMHNZVUZCVWl4RlFVRjFRaXhQUVVGUExHdENRVUU1UWl4RlFVRnJSQ3hMUVVGTExHZENRVUYyUkN4RlFVaHBRaXhGUVVscVFpeEZRVUZGTEUxQlFVMHNhVUpCUVZJc1JVRkJNa0lzVDBGQlR5eHpRa0ZCYkVNc1JVRkJNRVFzUzBGQlN5eHZRa0ZCTDBRc1JVRkthVUlzUTBGQmJrSTdPMEZCVDBFc1NVRkJUU3hyUWtGQmEwSXNXVUZCV1N4SlFVRmFMRU5CUVdsQ08wRkJRVUVzVTBGQlN5eEhRVUZITEV0QlFVZ3NRMEZCVXl4RlFVRkZMRWxCUVZnc1RVRkJjVUlzVTBGQk1VSTdRVUZCUVN4RFFVRnFRaXhGUVVGelJDeExRVUU1UlR0QlFVTkJMRWxCUVUwc1owSkJRV2RDTEZsQlFWa3NTVUZCV2l4RFFVRnBRanRCUVVGQkxGTkJRVXNzUjBGQlJ5eExRVUZJTEVOQlFWTXNSVUZCUlN4SlFVRllMRTFCUVhGQ0xGTkJRVEZDTzBGQlFVRXNRMEZCYWtJc1JVRkJjMFFzUjBGQk5VVTdRVUZEUVN4SlFVRk5MR2xDUVVGcFFpeFhRVUZYTEVsQlFWZ3NRMEZCWjBJN1FVRkJRU3hUUVVGTExFZEJRVWNzUzBGQlNDeERRVUZUTEVWQlFVVXNTVUZCV0N4TlFVRnhRaXhUUVVFeFFqdEJRVUZCTEVOQlFXaENMRVZCUVhGRUxFdEJRVFZGTzBGQlEwRXNTVUZCVFN4bFFVRmxMRmRCUVZjc1NVRkJXQ3hEUVVGblFqdEJRVUZCTEZOQlFVc3NSMEZCUnl4TFFVRklMRU5CUVZNc1JVRkJSU3hKUVVGWUxFMUJRWEZDTEZOQlFURkNPMEZCUVVFc1EwRkJhRUlzUlVGQmNVUXNSMEZCTVVVN08ydENRVVZsTzBGQlEySTdRVUZEUVN4blFrRkJZeXhYUVVaRU96dEJRVWxpTzBGQlEwRXNhMEpCUVdkQ0xGRkJURWc3UVVGTllpeHRRa0ZCYVVJc1UwRk9TanRCUVU5aUxIZENRVUZ6UWl4alFWQlVPMEZCVVdJc1owTkJRVGhDTEcxQ1FWSnFRanRCUVZOaUxHZERRVUU0UWl4dFFrRlVha0k3TzBGQlYySTdRVUZEUVN4UlFVRk5MRTFCV2s4N1FVRmhZaXhUUVVGUExFOUJZazA3UVVGallpeFJRVUZOTEUxQlpFODdRVUZsWWl4VlFVRlJMRkZCWmtzN08wRkJhVUppTzBGQlEwRXNVVUZCVFN4TlFXeENUenM3UVVGdlFtSTdRVUZEUVN4VFFVRlBMR2RDUVVGblFpeERRVUZvUWl4RFFYSkNUVHRCUVhOQ1lpeFJRVUZOTEdkQ1FVRm5RaXhEUVVGb1FpeERRWFJDVHp0QlFYVkNZaXhQUVVGTExHZENRVUZuUWl4RFFVRm9RaXhEUVhaQ1VUdEJRWGRDWWl4VlFVRlJMRTlCUVU4c1owSkJRV2RDTEVOQlFXaENMRU5CUVZBc1MwRkJPRUlzVjBGQk9VSXNSMEZCTkVNc1NVRkJOVU1zUjBGQmJVUXNaMEpCUVdkQ0xFTkJRV2hDTEVOQmVFSTVRenM3UVVFd1FtSTdRVUZEUVN4dlFrRkJhMElzWlVFelFrdzdRVUUwUW1Jc2EwSkJRV2RDTEdGQk5VSklPenRCUVRoQ1lqdEJRVU5CTEcxQ1FVRnBRaXhqUVM5Q1NqdEJRV2REWWl4cFFrRkJaU3haUVdoRFJqczdRVUZyUTJJN1FVRkRRU3hwUWtGQlpUdEJRVzVEUml4RE96czdPenM3T3pzN096czdPMEZEY2tObU96czdPMEZCUTBFN096czdPenM3T3pzN0syVkJVRUU3T3pzN096dEJRVk5CTEVsQlFVMHNWVUZCVnl4WlFVRk5PMEZCUTNKQ096czdPenM3UVVGTlFTeE5RVUZOTEU5QlFVOHNVMEZCWWp0QlFVTkJMRTFCUVUwc1ZVRkJWU3hQUVVGb1FqdEJRVU5CTEUxQlFVMHNjVUpCUVhGQ08wRkJRM3BDTEdGQlFWTXNTVUZFWjBJN1FVRkZla0lzYTBKQlFXTXNTVUZHVnp0QlFVZDZRaXhYUVVGUE8wRkJTR3RDTEVkQlFUTkNPMEZCUzBFc1RVRkJUU3gzUWtGQmQwSXNSVUZCT1VJN08wRkJSMEU3T3pzN096dEJRV3BDY1VJc1RVRjFRbVlzVDBGMlFtVTdRVUZCUVRzN1FVRjNRbTVDT3pzN08wRkJTVUVzZFVKQlFUQkNPMEZCUVVFc1ZVRkJaQ3hQUVVGakxIVkZRVUZLTEVWQlFVazdPMEZCUVVFN08wRkJRVUVzYjBoQlEyeENMRWxCUkd0Q0xFVkJRMW9zVDBGRVdTeEZRVU5JTEd0Q1FVUkhMRVZCUTJsQ0xFOUJSR3BDTEVWQlF6QkNMSEZDUVVReFFpeEZRVU5wUkN4SlFVUnFSQ3hGUVVOMVJDeExRVVIyUkRzN1FVRkhlRUlzV1VGQlN5eEhRVUZNTEVkQlFWY3NTVUZCV0R0QlFVTkJMRmxCUVVzc1lVRkJUQ3hIUVVGeFFpeEpRVUZ5UWpzN1FVRkZRU3haUVVGTExGTkJRVXdzUTBGQlpTeHBRa0ZCVFN4alFVRnlRanM3UVVGRlFTeHBRa0ZCVnl4WlFVRk5PMEZCUTJZc1kwRkJTeXhWUVVGTU8wRkJRMFFzVDBGR1JDeEZRVVZITEUxQlFVc3NUMEZCVEN4RFFVRmhMRmxCUm1oQ08wRkJVbmRDTzBGQlYzcENPenRCUVhaRGEwSTdRVUZCUVR0QlFVRkJMR3REUVhsRFVEdEJRVU5XTEdWQlFVOHNTMEZCU3l4TlFVRmFPMEZCUTBRN1FVRXpRMnRDTzBGQlFVRTdRVUZCUVN4blEwRTJRMVFzVFVFM1ExTXNSVUUyUTBRN1FVRkRhRUlzWVVGQlN5eE5RVUZNTEVkQlFXTXNUVUZCWkR0QlFVTkVPMEZCTDBOclFqdEJRVUZCTzBGQlFVRXNjVU5CYVVSS08wRkJRVUU3TzBGQlEySXNZVUZCU3l4SFFVRk1MRWRCUVZjc1NVRkJTU3hqUVVGS0xFVkJRVmc3UVVGRFFTeGhRVUZMTEVkQlFVd3NRMEZCVXl4UFFVRlVMRWRCUVcxQ0xFdEJRVzVDT3p0QlFVVkJMRmxCUVUwc01FSkJRWGRDTEVsQlFVa3NTVUZCU2l4SFFVRlhMRTlCUVZnc1JVRkJPVUk3TzBGQlJVRXNZVUZCU3l4WlFVRk1MRU5CUVd0Q0xHbENRVUZOTEc5Q1FVRjRRaXhGUVVFNFF5eEZRVUZGTEUxQlFVMHNTVUZCU1N4SlFVRktMRVZCUVZJc1JVRkJPVU1zUlVGQmIwVXNTMEZCY0VVN08wRkJSVUVzWVVGQlN5eEhRVUZNTEVOQlFWTXNTVUZCVkN4RFFVRmpMRTFCUVdRc1JVRkJjMElzUjBGQmRFSXNSVUZCTWtJc1NVRkJNMEk3TzBGQlJVRXNZVUZCU3l4SFFVRk1MRU5CUVZNc1QwRkJWQ3hIUVVGdFFpeExRVUZMTEU5QlFVd3NRMEZCWVN4TFFVRmlMRWRCUVhGQ0xFTkJRWGhETzBGQlEwRXNZVUZCU3l4SFFVRk1MRU5CUVZNc1UwRkJWQ3hIUVVGeFFpeFpRVUZOTzBGQlEzcENMR2xDUVVGTExFZEJRVXdzUTBGQlV5eExRVUZVTzBGQlEwRXNhVUpCUVVzc1IwRkJUQ3hIUVVGWExFbEJRVmc3UVVGRFJDeFRRVWhFT3p0QlFVdEJMR0ZCUVVzc1IwRkJUQ3hEUVVGVExFMUJRVlFzUjBGQmEwSXNXVUZCVFR0QlFVTjBRaXhwUWtGQlN5eEpRVUZNTzBGQlEwUXNVMEZHUkR0QlFVZEJMR0ZCUVVzc1IwRkJUQ3hEUVVGVExFOUJRVlFzUjBGQmJVSXNXVUZCVFR0QlFVTjJRaXhwUWtGQlN5eE5RVUZNTzBGQlEwUXNVMEZHUkRzN1FVRkpRU3haUVVGSk8wRkJRMFlzWlVGQlN5eEhRVUZNTEVOQlFWTXNTVUZCVkR0QlFVTkVMRk5CUmtRc1EwRkZSU3hQUVVGUExFTkJRVkFzUlVGQlZUdEJRVU5XTEdWQlFVc3NUVUZCVER0QlFVTkVPMEZCUTBZN1FVRTNSV3RDTzBGQlFVRTdRVUZCUVN3MlFrRXJSVm83UVVGRFRDeGhRVUZMTEZsQlFVd3NRMEZCYTBJc2FVSkJRVTBzTkVKQlFYaENMRVZCUVhORUxFVkJRVVVzVFVGQlRTeEpRVUZKTEVsQlFVb3NSVUZCVWl4RlFVRjBSQ3hGUVVFMFJTeExRVUUxUlRzN1FVRkZRU3haUVVGSkxFdEJRVXNzVTBGQlRDeFBRVUZ4UWl4cFFrRkJUU3hqUVVFdlFpeEZRVUVyUXp0QlFVTTNReXhsUVVGTExGbEJRVXdzUTBGQmEwSXNhVUpCUVUwc1kwRkJlRUlzUlVGQmQwTXNSVUZCUlN4TlFVRk5MRWxCUVVrc1NVRkJTaXhGUVVGU0xFVkJRWGhETEVWQlFUaEVMRXRCUVRsRU8wRkJRMFE3TzBGQlJVUXNZVUZCU3l4VFFVRk1MRU5CUVdVc2FVSkJRVTBzWTBGQmNrSTdRVUZEUkR0QlFYWkdhMEk3UVVGQlFUdEJRVUZCTEN0Q1FYbEdWanRCUVVOUUxHRkJRVXNzV1VGQlRDeERRVUZyUWl4cFFrRkJUU3cwUWtGQmVFSXNSVUZCYzBRc1JVRkJSU3hOUVVGTkxFbEJRVWtzU1VGQlNpeEZRVUZTTEVWQlFYUkVMRVZCUVRSRkxFdEJRVFZGT3p0QlFVVkJMRmxCUVVrc1MwRkJTeXhUUVVGTUxFOUJRWEZDTEdsQ1FVRk5MR1ZCUVM5Q0xFVkJRV2RFTzBGQlF6bERMR1ZCUVVzc1dVRkJUQ3hEUVVGclFpeHBRa0ZCVFN4bFFVRjRRaXhGUVVGNVF5eEZRVUZGTEUxQlFVMHNTVUZCU1N4SlFVRktMRVZCUVZJc1JVRkJla01zUlVGQkswUXNTMEZCTDBRN1FVRkRSRHM3UVVGRlJDeGhRVUZMTEZOQlFVd3NRMEZCWlN4cFFrRkJUU3hsUVVGeVFqdEJRVU5FTzBGQmFrZHJRanRCUVVGQk8wRkJRVUVzYlVOQmJVZE9PMEZCUVVFN08wRkJRMWdzWVVGQlN5eFRRVUZNT3p0QlFVVkJMR0ZCUVVzc1dVRkJURHM3UVVGRlFTeGhRVUZMTEdGQlFVd3NSMEZCY1VJc1dVRkJXU3haUVVGTk8wRkJRM0pETEdsQ1FVRkxMRmxCUVV3N1FVRkRSQ3hUUVVadlFpeEZRVVZzUWl4TFFVRkxMRTlCUVV3c1EwRkJZU3hMUVVaTExFTkJRWEpDTzBGQlIwUTdRVUV6UjJ0Q08wRkJRVUU3UVVGQlFTeHJRMEUyUjFBN1FVRkRWaXhaUVVGSkxFdEJRVXNzWVVGQlRDeExRVUYxUWl4SlFVRXpRaXhGUVVGcFF6dEJRVU12UWl4M1FrRkJZeXhMUVVGTExHRkJRVzVDTzBGQlEwRXNaVUZCU3l4aFFVRk1MRWRCUVhGQ0xFbEJRWEpDTzBGQlEwUTdRVUZEUmp0QlFXeElhMEk3UVVGQlFUdEJRVUZCTEc5RFFXOUlSU3hQUVhCSVJpeEZRVzlJVnp0QlFVTTFRaXd5UjBGQk1rSXNUMEZCTTBJc1JVRkJiME1zVDBGQmNFTTdRVUZEUkR0QlFYUklhMEk3TzBGQlFVRTdRVUZCUVRzN1FVRjVTSEpDTEZOQlFVOHNUMEZCVUR0QlFVTkVMRU5CTVVobExFVkJRV2hDT3p0clFrRTBTR1VzVHpzN096czdPenM3VVVOd1NVTXNVU3hIUVVGQkxGRTdVVUZ2UWtFc1ZTeEhRVUZCTEZVN1VVRkpRU3hwUWl4SFFVRkJMR2xDTzFGQlYwRXNZeXhIUVVGQkxHTTdVVUZWUVN4blFpeEhRVUZCTEdkQ08wRkJOME5VTEZOQlFWTXNVVUZCVkN4RFFVRnJRaXhIUVVGc1FpeEZRVUYxUWl4RlFVRjJRaXhGUVVFeVFpeFJRVUV6UWl4RlFVRnhRenRCUVVNeFF5eE5RVUZOTEUxQlFVMHNTVUZCU1N4alFVRktMRVZCUVZvN1FVRkRRU3hOUVVGSkxFbEJRVWtzWjBKQlFWSXNSVUZCTUVJc1NVRkJTU3huUWtGQlNpeERRVUZ4UWl3d1FrRkJja0k3UVVGRE1VSXNUVUZCU1N4clFrRkJTaXhIUVVGNVFpeFpRVUZOTzBGQlF6ZENMRkZCUVVrc1NVRkJTU3hWUVVGS0xFdEJRVzFDTEVOQlFXNUNMRXRCUVhsQ0xGTkJRVk1zU1VGQlNTeE5RVUZpTEVWQlFYRkNMRVZCUVhKQ0xFMUJRVFpDTEVkQlFUZENMRWxCUTNoQ0xFTkJRVU1zU1VGQlNTeE5RVUZNTEVsQlFXVXNTVUZCU1N4WlFVRktMRU5CUVdsQ0xFMUJSR3BETEVOQlFVb3NSVUZET0VNN1FVRkROVU1zVTBGQlJ5eEpRVUZKTEZsQlFWQTdRVUZEUkR0QlFVTkdMRWRCVEVRN08wRkJUMEVzVFVGQlNTeFBRVUZQTEZGQlFWQXNTMEZCYjBJc1VVRkJlRUlzUlVGQmEwTTdRVUZEYUVNc1VVRkJTU3hKUVVGS0xFTkJRVk1zUzBGQlZDeEZRVUZuUWl4SFFVRm9RaXhGUVVGeFFpeEpRVUZ5UWp0QlFVTkJMRkZCUVVrc1NVRkJTaXhEUVVGVExFVkJRVlE3UVVGRFJDeEhRVWhFTEUxQlIwODdRVUZEVEN4UlFVRkpMRWxCUVVvc1EwRkJVeXhOUVVGVUxFVkJRV2xDTEVkQlFXcENMRVZCUVhOQ0xFbEJRWFJDTzBGQlEwRXNVVUZCU1N4blFrRkJTaXhEUVVGeFFpeGpRVUZ5UWl4RlFVRnhReXh0UTBGQmNrTTdRVUZEUVN4UlFVRkpMRWxCUVVvc1EwRkJVeXhSUVVGVU8wRkJRMFE3UVVGRFJqczdRVUZGVFN4VFFVRlRMRlZCUVZRc1IwRkJjMEk3UVVGRE0wSXNVMEZCVHl4TFFVRkxMRTFCUVV3c1IwRkJZeXhSUVVGa0xFTkJRWFZDTEVWQlFYWkNMRVZCUVRKQ0xFMUJRVE5DTEVOQlFXdERMRU5CUVd4RExFVkJRWEZETEVWQlFYSkRMRU5CUVZBN1FVRkRSRHM3UVVGRlRTeFRRVUZUTEdsQ1FVRlVMRU5CUVRKQ0xFMUJRVE5DTEVWQlFXMURMRmRCUVc1RExFVkJRV2RFTzBGQlEzSkVMRk5CUVU4c1ZVRkJWU3hYUVVGWExGRkJRVFZDTEVWQlFYTkRMRk5CUVZNc1QwRkJUeXhWUVVGMFJDeEZRVUZyUlR0QlFVTm9SU3hSUVVGSkxFOUJRVThzVTBGQlVDeERRVUZwUWl4UlFVRnFRaXhEUVVFd1FpeFhRVUV4UWl4RFFVRktMRVZCUVRSRE8wRkJRekZETEdGQlFVOHNUVUZCVUR0QlFVTkVPMEZCUTBZN08wRkJSVVFzVTBGQlR5eEpRVUZRTzBGQlEwUTdPMEZCUjAwc1UwRkJVeXhqUVVGVUxFTkJRWGRDTEUxQlFYaENMRVZCUVdkRExGRkJRV2hETEVWQlFUQkRPMEZCUXk5RExGTkJRVThzVlVGQlZTeFhRVUZYTEZGQlFUVkNMRVZCUVhORExGTkJRVk1zVDBGQlR5eFZRVUYwUkN4RlFVRnJSVHRCUVVOb1JTeFJRVUZKTEU5QlFVOHNXVUZCVUN4RFFVRnZRaXhKUVVGd1FpeE5RVUU0UWl4UlFVRnNReXhGUVVFMFF6dEJRVU14UXl4aFFVRlBMRTFCUVZBN1FVRkRSRHRCUVVOR096dEJRVVZFTEZOQlFVOHNTVUZCVUR0QlFVTkVPenRCUVVWTkxGTkJRVk1zWjBKQlFWUXNRMEZCTUVJc1RVRkJNVUlzUlVGQmEwTXNTVUZCYkVNc1JVRkJkME03UVVGRE4wTXNVMEZCVHl4VlFVRlZMRmRCUVZjc1VVRkJOVUlzUlVGQmMwTXNVMEZCVXl4UFFVRlBMRlZCUVhSRUxFVkJRV3RGTzBGQlEyaEZMRkZCUVVrc1QwRkJUeXhaUVVGUUxFTkJRVzlDTEVsQlFYQkNMRTFCUVRoQ0xFbEJRV3hETEVWQlFYZERPMEZCUTNSRExHRkJRVThzVFVGQlVEdEJRVU5FTzBGQlEwWTdPMEZCUlVRc1UwRkJUeXhKUVVGUU8wRkJRMFE3T3pzN096czdPenM3T3pzN1FVTnFSRVE3T3pzN1FVRkRRVHM3T3p0QlFVTkJPenRCUVVOQk96czdPenM3T3pzclpVRlNRVHM3T3pzN096dEJRVlZCTEVsQlFVMHNXVUZCWVN4WlFVRk5PMEZCUTNaQ096czdPenM3UVVGTlFTeE5RVUZOTEU5QlFVOHNWMEZCWWp0QlFVTkJMRTFCUVUwc1ZVRkJWU3hQUVVGb1FqdEJRVU5CTEUxQlFVMHNjVUpCUVhGQ08wRkJRM3BDTEdGQlFWTTdRVUZFWjBJc1IwRkJNMEk3UVVGSFFTeE5RVUZOTEhkQ1FVRjNRaXhGUVVFNVFqczdRVUZIUVRzN096czdPMEZCWm5WQ0xFMUJjVUpxUWl4VFFYSkNhVUk3UVVGQlFUczdRVUYxUW5KQ0xIbENRVUV3UWp0QlFVRkJMRlZCUVdRc1QwRkJZeXgxUlVGQlNpeEZRVUZKT3p0QlFVRkJPenRCUVVGQkxIZElRVU5zUWl4SlFVUnJRaXhGUVVOYUxFOUJSRmtzUlVGRFNDeHJRa0ZFUnl4RlFVTnBRaXhQUVVScVFpeEZRVU13UWl4eFFrRkVNVUlzUlVGRGFVUXNTMEZFYWtRc1JVRkRkMFFzUzBGRWVFUTdPMEZCUjNoQ0xGbEJRVXNzVTBGQlRDeEhRVUZwUWl4RlFVRnFRanM3UVVGRlFTeFZRVUZOTEZWQlFWVXNUVUZCU3l4UFFVRk1MRU5CUVdFc1QwRkJZaXhEUVVGeFFpeG5Ra0ZCY2tJc2IwSkJRWFZFTEVsQlFYWkVMRkZCUVdoQ08wRkJRMEVzV1VGQlRTeEpRVUZPTEVOQlFWY3NUMEZCV0N4RlFVRnZRaXhQUVVGd1FpeERRVUUwUWl4VlFVRkRMRTFCUVVRc1JVRkJXVHRCUVVOMFF5eFpRVUZOTEdGQlFXRXNUMEZCVHl4WlFVRlFMRU5CUVc5Q0xFMUJRWEJDTEVOQlFXNUNPMEZCUTBFc1dVRkJUU3hYUVVGWExGTkJRVk1zWVVGQlZDeERRVUYxUWl4VlFVRjJRaXhEUVVGcVFqczdRVUZGUVN4WlFVRkpMRkZCUVVvc1JVRkJZenRCUVVOYUxHZENRVUZMTEZkQlFVd3NRMEZCYVVJc1VVRkJha0k3UVVGRFJEdEJRVU5HTEU5QlVFUTdRVUZPZDBJN1FVRmpla0k3TzBGQmNrTnZRanRCUVVGQk8wRkJRVUVzY1VOQmRVTk9MRXRCZGtOTkxFVkJkVU5ETzBGQlEzQkNMRmxCUVUwc1MwRkJTeXhOUVVGTkxFMUJRVTRzUTBGQllTeFpRVUZpTEVOQlFUQkNMRTFCUVRGQ0xFTkJRVmc3UVVGRFFTeFpRVUZOTEZWQlFWVXNVMEZCVXl4aFFVRlVMRU5CUVhWQ0xFVkJRWFpDTEVOQlFXaENPenRCUVVWQkxHRkJRVXNzV1VGQlRDeERRVUZyUWl4UFFVRnNRanRCUVVORU8wRkJOVU52UWp0QlFVRkJPMEZCUVVFc2EwTkJPRU5VTEU5Qk9VTlRMRVZCT0VOQk8wRkJRMjVDTEZsQlFVMHNWMEZCVnl4MVFrRkJZVHRCUVVNMVFqdEJRVVEwUWl4VFFVRmlMRU5CUVdwQ08wRkJSMEVzWVVGQlN5eFRRVUZNTEVOQlFXVXNTVUZCWml4RFFVRnZRaXhSUVVGd1FqczdRVUZGUVN4bFFVRlBMRkZCUVZBN1FVRkRSRHRCUVhKRWIwSTdRVUZCUVR0QlFVRkJMR3REUVhWRVZDeFBRWFpFVXl4RlFYVkVRVHRCUVVOdVFpeFpRVUZKTEZkQlFWY3NTMEZCU3l4VFFVRk1MRU5CUVdVc1NVRkJaaXhEUVVGdlFqdEJRVUZCTEdsQ1FVRkxMRVZCUVVVc1QwRkJSaXhEUVVGVkxFOUJRVllzUTBGQmEwSXNXVUZCYkVJc1EwRkJLMElzU1VGQkwwSXNUVUZCZVVNc1VVRkJVU3haUVVGU0xFTkJRWEZDTEVsQlFYSkNMRU5CUVRsRE8wRkJRVUVzVTBGQmNFSXNRMEZCWmpzN1FVRkZRU3haUVVGSkxFTkJRVU1zVVVGQlRDeEZRVUZsTzBGQlEySTdRVUZEUVN4eFFrRkJWeXhMUVVGTExGZEJRVXdzUlVGQldEdEJRVU5FT3p0QlFVVkVMR1ZCUVU4c1VVRkJVRHRCUVVORU8wRkJhRVZ2UWp0QlFVRkJPMEZCUVVFc2NVTkJhMFZPTzBGQlEySXNaVUZCVHl4TFFVRkxMRk5CUVZvN1FVRkRSRHRCUVhCRmIwSTdRVUZCUVR0QlFVRkJMRzFEUVhORlVpeFpRWFJGVVN4RlFYTkZUVHRCUVVONlFpeFpRVUZOTEZkQlFWY3NTMEZCU3l4WFFVRk1MRU5CUVdsQ0xGbEJRV3BDTEVOQlFXcENPMEZCUTBFc1lVRkJTeXhUUVVGTUxFTkJRV1VzVDBGQlppeERRVUYxUWl4VlFVRkRMRU5CUVVRc1JVRkJUenRCUVVNMVFpeGpRVUZKTEVWQlFVVXNUMEZCUml4RFFVRlZMRTlCUVZZc1EwRkJhMElzV1VGQmJFSXNRMEZCSzBJc1NVRkJMMElzVFVGQmVVTXNZVUZCWVN4WlFVRmlMRU5CUVRCQ0xFbEJRVEZDTEVOQlFUZERMRVZCUVRoRk8wRkJRelZGTEdOQlFVVXNTVUZCUmp0QlFVTkVMRmRCUmtRc1RVRkZUenRCUVVOTUxIRkNRVUZUTEUxQlFWUTdRVUZEUkR0QlFVTkdMRk5CVGtRN1FVRlBSRHRCUVM5RmIwSTdRVUZCUVR0QlFVRkJMREpDUVdsR2FFSXNWVUZxUm1kQ0xFVkJhVVpLTzBGQlEyWXNXVUZCU1N4WFFVRlhMRlZCUVdZN1FVRkRRU3haUVVGSkxFOUJRVThzVlVGQlVDeExRVUZ6UWl4UlFVRXhRaXhGUVVGdlF6dEJRVU5zUXl4eFFrRkJWeXhUUVVGVExHRkJRVlFzUTBGQmRVSXNWVUZCZGtJc1EwRkJXRHRCUVVORU96dEJRVVZFTEZsQlFVa3NRMEZCUXl4UlFVRk1MRVZCUVdVN1FVRkRZaXhuUWtGQlRTeEpRVUZKTEV0QlFVb3NRMEZCWVN4SlFVRmlMREJDUVVGelF5eFZRVUYwUXl4cFEwRkJUanRCUVVORU96dEJRVVZFTEdGQlFVc3NXVUZCVEN4RFFVRnJRaXhSUVVGc1FqczdRVUZGUVN4bFFVRlBMRWxCUVZBN1FVRkRSRHRCUVRsR2IwSTdRVUZCUVR0QlFVRkJMREpDUVdkSGFFSXNWVUZvUjJkQ0xFVkJaMGRLTzBGQlEyWXNXVUZCU1N4WFFVRlhMRlZCUVdZN1FVRkRRU3haUVVGSkxFOUJRVThzVlVGQlVDeExRVUZ6UWl4UlFVRXhRaXhGUVVGdlF6dEJRVU5zUXl4eFFrRkJWeXhUUVVGVExHRkJRVlFzUTBGQmRVSXNWVUZCZGtJc1EwRkJXRHRCUVVORU96dEJRVVZFTEZsQlFVa3NRMEZCUXl4UlFVRk1MRVZCUVdVN1FVRkRZaXhuUWtGQlRTeEpRVUZKTEV0QlFVb3NRMEZCWVN4SlFVRmlMREJDUVVGelF5eFZRVUYwUXl4cFEwRkJUanRCUVVORU96dEJRVVZFTEZsQlFVMHNZMEZCWXl4TFFVRkxMRmRCUVV3c1EwRkJhVUlzVVVGQmFrSXNRMEZCY0VJN1FVRkRRU3hsUVVGUExGbEJRVmtzU1VGQldpeEZRVUZRTzBGQlEwUTdRVUUxUjI5Q08wRkJRVUU3UVVGQlFTeHRRMEU0UjBRN1FVRkRiRUlzWlVGQlR5eEpRVUZRTzBGQlEwUTdRVUZvU0c5Q08wRkJRVUU3UVVGQlFTeHZRMEZyU0VFc1QwRnNTRUVzUlVGclNGTTdRVUZETlVJc0swZEJRVEpDTEZOQlFUTkNMRVZCUVhORExFOUJRWFJETzBGQlEwUTdRVUZ3U0c5Q096dEJRVUZCTzBGQlFVRTdPMEZCZFVoMlFqczdPenM3T3p0QlFVdEJMRTFCUVUwc1lVRkJZU3hGUVVGdVFqczdRVUZGUVN4TlFVRk5MR0ZCUVdFc1UwRkJVeXhuUWtGQlZDeFBRVUU0UWl4SlFVRTVRaXhEUVVGdVFqdEJRVU5CTEUxQlFVa3NWVUZCU2l4RlFVRm5RanRCUVVOa0xGVkJRVTBzU1VGQlRpeERRVUZYTEZWQlFWZ3NSVUZCZFVJc1QwRkJka0lzUTBGQkswSXNWVUZCUXl4UFFVRkVMRVZCUVdFN1FVRkRNVU1zVlVGQlRTeFRRVUZUTERKRFFVRnZRaXhQUVVGd1FpeEZRVUUyUWl4clFrRkJOMElzUlVGQmFVUXNjVUpCUVdwRUxFTkJRV1k3UVVGRFFTeGhRVUZQTEU5QlFWQXNSMEZCYVVJc1QwRkJha0k3TzBGQlJVRXNhVUpCUVZjc1NVRkJXQ3hEUVVGblFpeFZRVUZWTEdGQlFWWXNRMEZCZDBJc1RVRkJlRUlzUTBGQmFFSTdRVUZEUkN4TFFVeEVPMEZCVFVRN08wRkJSVVFzVjBGQlV5eG5Ra0ZCVkN4RFFVRXdRaXhQUVVFeFFpeEZRVUZ0UXl4VlFVRkRMRXRCUVVRc1JVRkJWenRCUVVNMVF5eFJRVUZOTEdsQ1FVRnBRaXhOUVVGTkxFMUJRVTRzUTBGQllTeFpRVUZpTEVOQlFUQkNMR0ZCUVRGQ0xFTkJRWFpDTzBGQlEwRXNVVUZCU1N4clFrRkJhMElzYlVKQlFXMUNMRWxCUVhwRExFVkJRU3RETzBGQlF6ZERMRlZCUVUwc1lVRkJZU3hOUVVGTkxFMUJRVTRzUTBGQllTeFpRVUZpTEVOQlFUQkNMR0ZCUVRGQ0xFdEJRVFJETEUxQlFVMHNUVUZCVGl4RFFVRmhMRmxCUVdJc1EwRkJNRUlzVFVGQk1VSXNRMEZCTDBRN1FVRkRRU3hWUVVGTkxHRkJRV0VzVTBGQlV5eGhRVUZVTEVOQlFYVkNMRlZCUVhaQ0xFTkJRVzVDT3p0QlFVVkJMRlZCUVUwc1dVRkJXU3c0UWtGQmEwSXNUVUZCVFN4TlFVRjRRaXhGUVVGblF5eFhRVUZvUXl4RFFVRnNRanM3UVVGRlFTeFZRVUZKTEdOQlFXTXNTVUZCYkVJc1JVRkJkMEk3UVVGRGRFSTdRVUZEUkRzN1FVRkZSQ3hWUVVGTkxHTkJRV01zVlVGQlZTeFpRVUZXTEVOQlFYVkNMRWxCUVhaQ0xFTkJRWEJDTzBGQlEwRXNWVUZCVFN4WlFVRlpMRmRCUVZjc1NVRkJXQ3hEUVVGblFqdEJRVUZCTEdWQlFVc3NSVUZCUlN4VlFVRkdMRWRCUVdVc1dVRkJaaXhEUVVFMFFpeEpRVUUxUWl4TlFVRnpReXhYUVVFelF6dEJRVUZCTEU5QlFXaENMRU5CUVd4Q096dEJRVVZCTEZWQlFVa3NRMEZCUXl4VFFVRk1MRVZCUVdkQ08wRkJRMlE3UVVGRFJEczdRVUZGUkR0QlFVTkJMRlZCUVUwc2FVSkJRV2xDTEZWQlFWVXNXVUZCVml4SFFVRjVRaXhKUVVGNlFpeERRVUU0UWp0QlFVRkJMR1ZCUVVzc1JVRkJSU3hWUVVGR0xFOUJRVzFDTEZWQlFYaENPMEZCUVVFc1QwRkJPVUlzUTBGQmRrSTdRVUZEUVN4VlFVRkpMRU5CUVVNc1kwRkJUQ3hGUVVGeFFqdEJRVU51UWl4clFrRkJWU3hYUVVGV0xFTkJRWE5DTEZWQlFYUkNPMEZCUTBRN08wRkJSVVFzWjBKQlFWVXNTVUZCVml4RFFVRmxMRlZCUVdZN1FVRkRSRHRCUVVOR0xFZEJNMEpFT3p0QlFUWkNRU3hUUVVGUExGTkJRVkE3UVVGRFJDeERRWFJMYVVJc1JVRkJiRUk3TzJ0Q1FYZExaU3hUT3pzN096czdPenM3T3pzN08wRkROMHRtT3pzN08wRkJRMEU3TzBGQlEwRTdPenM3UVVGRFFUczdPenM3T3pzN0syVkJVa0U3T3pzN096czdRVUZWUVN4SlFVRk5MRmRCUVZrc1dVRkJUVHRCUVVOMFFqczdPenM3TzBGQlRVRXNUVUZCVFN4UFFVRlBMRlZCUVdJN1FVRkRRU3hOUVVGTkxGVkJRVlVzVDBGQmFFSTdRVUZEUVN4TlFVRk5MSEZDUVVGeFFqdEJRVU42UWl4aFFVRlRMRWxCUkdkQ08wRkJSWHBDTEZsQlFWRTdRVUZHYVVJc1IwRkJNMEk3UVVGSlFTeE5RVUZOTEhkQ1FVRjNRaXhEUVVNMVFpeFJRVVEwUWl4RFFVRTVRanM3UVVGSlFUczdPenM3TzBGQmFrSnpRaXhOUVhWQ2FFSXNVVUYyUW1kQ08wRkJRVUU3TzBGQmVVSndRaXgzUWtGQk1FSTdRVUZCUVN4VlFVRmtMRTlCUVdNc2RVVkJRVW9zUlVGQlNUczdRVUZCUVRzN1FVRkJRU3h6U0VGRGJFSXNTVUZFYTBJc1JVRkRXaXhQUVVSWkxFVkJRMGdzYTBKQlJFY3NSVUZEYVVJc1QwRkVha0lzUlVGRE1FSXNjVUpCUkRGQ0xFVkJRMmxFTEV0QlJHcEVMRVZCUTNkRUxFdEJSSGhFT3p0QlFVZDRRaXhaUVVGTExGbEJRVXdzUjBGQmIwSXNTMEZCY0VJN08wRkJSVUU3UVVGRFFTeFZRVUZKTEUxQlFVc3NUMEZCVEN4RFFVRmhMRTFCUVdwQ0xFVkJRWGxDTzBGQlEzWkNMR05CUVVzc1NVRkJURHRCUVVORU8wRkJVblZDTzBGQlUzcENPenRCUVd4RGJVSTdRVUZCUVR0QlFVRkJMR3REUVc5RFVqdEJRVU5XTEdWQlFVOHNTMEZCU3l4UFFVRk1MRU5CUVdFc1QwRkJZaXhEUVVGeFFpeHhRa0ZCY2tJc1EwRkJNa01zUzBGQlN5eFBRVUZNTEVOQlFXRXNUMEZCZUVRc1JVRkJhVVVzVFVGQmVFVTdRVUZEUkR0QlFYUkRiVUk3UVVGQlFUdEJRVUZCTEN0Q1FYZERXRHRCUVVOUUxGbEJRVWtzUzBGQlN5eFBRVUZNTEVOQlFXRXNUMEZCWWl4RFFVRnhRaXhUUVVGeVFpeERRVUVyUWl4UlFVRXZRaXhEUVVGM1F5eE5RVUY0UXl4RFFVRktMRVZCUVhGRU8wRkJRMjVFTEdsQ1FVRlBMRXRCUVVzc1NVRkJUQ3hGUVVGUU8wRkJRMFE3TzBGQlJVUXNaVUZCVHl4TFFVRkxMRWxCUVV3c1JVRkJVRHRCUVVORU8wRkJPVU50UWp0QlFVRkJPMEZCUVVFc05rSkJaMFJpTzBGQlFVRTdPMEZCUTB3c1dVRkJTU3hMUVVGTExGbEJRVlFzUlVGQmRVSTdRVUZEY2tJc2FVSkJRVThzUzBGQlVEdEJRVU5FT3p0QlFVVkVMRmxCUVVrc1MwRkJTeXhQUVVGTUxFTkJRV0VzVDBGQllpeERRVUZ4UWl4VFFVRnlRaXhEUVVFclFpeFJRVUV2UWl4RFFVRjNReXhOUVVGNFF5eERRVUZLTEVWQlFYRkVPMEZCUTI1RUxHbENRVUZQTEV0QlFWQTdRVUZEUkRzN1FVRkZSQ3hoUVVGTExGbEJRVXdzUjBGQmIwSXNTVUZCY0VJN08wRkJSVUVzV1VGQlRTeGpRVUZqTEZOQlFXUXNWMEZCWXl4SFFVRk5PMEZCUTNoQ0xHbENRVUZMTEU5QlFVd3NRMEZCWVN4UFFVRmlMRU5CUVhGQ0xGTkJRWEpDTEVOQlFTdENMRWRCUVM5Q0xFTkJRVzFETEUxQlFXNURPMEZCUTBFc2FVSkJRVXNzVDBGQlRDeERRVUZoTEU5QlFXSXNRMEZCY1VJc1UwRkJja0lzUTBGQkswSXNUVUZCTDBJc1EwRkJjME1zV1VGQmRFTTdRVUZEUVN4cFFrRkJTeXhQUVVGTUxFTkJRV0VzVDBGQllpeERRVUZ4UWl4dFFrRkJja0lzUTBGQmVVTXNhVUpCUVUwc1kwRkJMME1zUlVGQkswUXNWMEZCTDBRN08wRkJSVUVzYVVKQlFVc3NUMEZCVEN4RFFVRmhMRTlCUVdJc1EwRkJjVUlzV1VGQmNrSXNRMEZCYTBNc1pVRkJiRU1zUlVGQmJVUXNTVUZCYmtRN08wRkJSVUVzYVVKQlFVc3NXVUZCVEN4SFFVRnZRaXhMUVVGd1FqdEJRVU5FTEZOQlVrUTdPMEZCVlVFc1dVRkJTU3hEUVVGRExFdEJRVXNzVDBGQlRDeERRVUZoTEU5QlFXSXNRMEZCY1VJc1UwRkJja0lzUTBGQkswSXNVVUZCTDBJc1EwRkJkME1zV1VGQmVFTXNRMEZCVEN4RlFVRTBSRHRCUVVNeFJDeGxRVUZMTEU5QlFVd3NRMEZCWVN4UFFVRmlMRU5CUVhGQ0xGTkJRWEpDTEVOQlFTdENMRWRCUVM5Q0xFTkJRVzFETEZsQlFXNURPMEZCUTBRN08wRkJSVVFzWVVGQlN5eFBRVUZNTEVOQlFXRXNUMEZCWWl4RFFVRnhRaXhuUWtGQmNrSXNRMEZCYzBNc2FVSkJRVTBzWTBGQk5VTXNSVUZCTkVRc1YwRkJOVVE3TzBGQlJVRXNXVUZCVFN4VFFVRlRMRXRCUVVzc1UwRkJUQ3hGUVVGbU96dEJRVVZCTEdGQlFVc3NUMEZCVEN4RFFVRmhMRTlCUVdJc1EwRkJjVUlzUzBGQmNrSXNRMEZCTWtJc1RVRkJNMElzUjBGQmIwTXNTMEZCY0VNN08wRkJSVUVzYlVKQlFWY3NXVUZCVFR0QlFVTm1MR2xDUVVGTExFOUJRVXdzUTBGQllTeFBRVUZpTEVOQlFYRkNMRXRCUVhKQ0xFTkJRVEpDTEUxQlFUTkNMRWRCUVhWRExFMUJRWFpETzBGQlEwUXNVMEZHUkN4RlFVVkhMRVZCUmtnN08wRkJTVUVzWlVGQlR5eEpRVUZRTzBGQlEwUTdRVUZ3Um0xQ08wRkJRVUU3UVVGQlFTdzJRa0Z6Um1JN1FVRkJRVHM3UVVGRFRDeFpRVUZKTEV0QlFVc3NXVUZCVkN4RlFVRjFRanRCUVVOeVFpeHBRa0ZCVHl4TFFVRlFPMEZCUTBRN08wRkJSVVFzV1VGQlNTeERRVUZETEV0QlFVc3NUMEZCVEN4RFFVRmhMRTlCUVdJc1EwRkJjVUlzVTBGQmNrSXNRMEZCSzBJc1VVRkJMMElzUTBGQmQwTXNUVUZCZUVNc1EwRkJUQ3hGUVVGelJEdEJRVU53UkN4cFFrRkJUeXhMUVVGUU8wRkJRMFE3TzBGQlJVUXNZVUZCU3l4WlFVRk1MRWRCUVc5Q0xFbEJRWEJDT3p0QlFVVkJMRmxCUVUwc1kwRkJZeXhUUVVGa0xGZEJRV01zUjBGQlRUdEJRVU40UWl4cFFrRkJTeXhQUVVGTUxFTkJRV0VzVDBGQllpeERRVUZ4UWl4VFFVRnlRaXhEUVVFclFpeE5RVUV2UWl4RFFVRnpReXhaUVVGMFF6dEJRVU5CTEdsQ1FVRkxMRTlCUVV3c1EwRkJZU3hQUVVGaUxFTkJRWEZDTEV0QlFYSkNMRU5CUVRKQ0xFMUJRVE5DTEVkQlFXOURMRTFCUVhCRE8wRkJRMEVzYVVKQlFVc3NUMEZCVEN4RFFVRmhMRTlCUVdJc1EwRkJjVUlzYlVKQlFYSkNMRU5CUVhsRExHbENRVUZOTEdOQlFTOURMRVZCUVN0RUxGZEJRUzlFT3p0QlFVVkJMR2xDUVVGTExFOUJRVXdzUTBGQllTeFBRVUZpTEVOQlFYRkNMRmxCUVhKQ0xFTkJRV3RETEdWQlFXeERMRVZCUVcxRUxFdEJRVzVFT3p0QlFVVkJMR2xDUVVGTExGbEJRVXdzUjBGQmIwSXNTMEZCY0VJN1FVRkRSQ3hUUVZKRU96dEJRVlZCTEdGQlFVc3NUMEZCVEN4RFFVRmhMRTlCUVdJc1EwRkJjVUlzUzBGQmNrSXNRMEZCTWtJc1RVRkJNMElzUjBGQmIwTXNTMEZCY0VNN08wRkJSVUVzV1VGQlNTeERRVUZETEV0QlFVc3NUMEZCVEN4RFFVRmhMRTlCUVdJc1EwRkJjVUlzVTBGQmNrSXNRMEZCSzBJc1VVRkJMMElzUTBGQmQwTXNXVUZCZUVNc1EwRkJUQ3hGUVVFMFJEdEJRVU14UkN4bFFVRkxMRTlCUVV3c1EwRkJZU3hQUVVGaUxFTkJRWEZDTEZOQlFYSkNMRU5CUVN0Q0xFZEJRUzlDTEVOQlFXMURMRmxCUVc1RE8wRkJRMFE3TzBGQlJVUXNZVUZCU3l4UFFVRk1MRU5CUVdFc1QwRkJZaXhEUVVGeFFpeG5Ra0ZCY2tJc1EwRkJjME1zYVVKQlFVMHNZMEZCTlVNc1JVRkJORVFzVjBGQk5VUTdPMEZCUlVFc1lVRkJTeXhQUVVGTUxFTkJRV0VzVDBGQllpeERRVUZ4UWl4VFFVRnlRaXhEUVVFclFpeE5RVUV2UWl4RFFVRnpReXhOUVVGMFF6czdRVUZGUVN4bFFVRlBMRWxCUVZBN1FVRkRSRHRCUVhSSWJVSTdRVUZCUVR0QlFVRkJMRzFEUVhkSVFUdEJRVU5zUWl4bFFVRlBMRWxCUVZBN1FVRkRSRHRCUVRGSWJVSTdRVUZCUVR0QlFVRkJMRzlEUVRSSVF5eFBRVFZJUkN4RlFUUklWVHRCUVVNMVFpdzJSMEZCTWtJc1VVRkJNMElzUlVGQmNVTXNUMEZCY2tNN1FVRkRSRHRCUVRsSWJVSTdPMEZCUVVFN1FVRkJRVHM3UVVGcFNYUkNPenM3T3pzN08wRkJTMEVzVFVGQlRTeGhRVUZoTEVWQlFXNUNPenRCUVVWQkxFMUJRVTBzV1VGQldTeFRRVUZUTEdkQ1FVRlVMRTlCUVRoQ0xFbEJRVGxDTEVOQlFXeENPMEZCUTBFc1RVRkJTU3hUUVVGS0xFVkJRV1U3UVVGRFlpeGpRVUZWTEU5QlFWWXNRMEZCYTBJc1ZVRkJReXhQUVVGRUxFVkJRV0U3UVVGRE4wSTdRVUZEUVN4VlFVRk5MRk5CUVZNc01rTkJRVzlDTEU5QlFYQkNMRVZCUVRaQ0xHdENRVUUzUWl4RlFVRnBSQ3h4UWtGQmFrUXNRMEZCWmp0QlFVTkJMR0ZCUVU4c1QwRkJVQ3hIUVVGcFFpeFBRVUZxUWpzN1FVRkZRU3hwUWtGQlZ5eEpRVUZZTEVOQlFXZENMRk5CUVZNc1lVRkJWQ3hEUVVGMVFpeE5RVUYyUWl4RFFVRm9RanRCUVVORUxFdEJUa1E3UVVGUFJEczdRVUZGUkN4WFFVRlRMR2RDUVVGVUxFTkJRVEJDTEU5QlFURkNMRVZCUVcxRExGVkJRVU1zUzBGQlJDeEZRVUZYTzBGQlF6VkRMRkZCUVUwc1UwRkJVeXcyUWtGQmFVSXNUVUZCVFN4TlFVRjJRaXhGUVVFclFpeGhRVUV2UWl4RFFVRm1PMEZCUTBFc1VVRkJTU3hEUVVGRExFMUJRVXdzUlVGQllUdEJRVU5ZTzBGQlEwUTdPMEZCUlVRc1VVRkJUU3hwUWtGQmFVSXNUMEZCVHl4WlFVRlFMRU5CUVc5Q0xHRkJRWEJDTEVOQlFYWkNPenRCUVVWQkxGRkJRVWtzYTBKQlFXdENMRzFDUVVGdFFpeEpRVUY2UXl4RlFVRXJRenRCUVVNM1F5eFZRVUZKTEV0QlFVc3NUMEZCVHl4WlFVRlFMRU5CUVc5Q0xHRkJRWEJDTEV0QlFYTkRMRTlCUVU4c1dVRkJVQ3hEUVVGdlFpeE5RVUZ3UWl4RFFVRXZRenRCUVVOQkxGZEJRVXNzUjBGQlJ5eFBRVUZJTEVOQlFWY3NSMEZCV0N4RlFVRm5RaXhGUVVGb1FpeERRVUZNT3p0QlFVVkJMRlZCUVUwc1dVRkJXU3hYUVVGWExFbEJRVmdzUTBGQlowSTdRVUZCUVN4bFFVRkxMRVZCUVVVc1ZVRkJSaXhIUVVGbExGbEJRV1lzUTBGQk5FSXNTVUZCTlVJc1RVRkJjME1zUlVGQk0wTTdRVUZCUVN4UFFVRm9RaXhEUVVGc1FqczdRVUZGUVN4VlFVRkpMRU5CUVVNc1UwRkJUQ3hGUVVGblFqdEJRVU5rTzBGQlEwUTdPMEZCUlVRc1owSkJRVlVzVFVGQlZqdEJRVU5FTzBGQlEwWXNSMEZ3UWtRN08wRkJjMEpCTEZOQlFVOHNVVUZCVUR0QlFVTkVMRU5CTVV0blFpeEZRVUZxUWpzN2EwSkJORXRsTEZFN096czdPenM3T3p0eGFrSkRkRXhtT3pzN096czdPMEZCUzBFN08wRkJRMEU3TzBGQlEwRTdPenM3UVVGRFFUczdPenM3T3pzN1FVRkZRVHM3T3pzN08wbEJUWEZDTEZNN1FVRkZia0lzY1VKQlFWa3NTVUZCV2l4RlFVRnJRaXhQUVVGc1FpeEZRVUZ0U1R0QlFVRkJMRkZCUVhoSExHTkJRWGRITEhWRlFVRjJSaXhGUVVGMVJqdEJRVUZCTEZGQlFXNUdMRTlCUVcxR0xIVkZRVUY2UlN4RlFVRjVSVHRCUVVGQkxGRkJRWEpGTEZkQlFYRkZMSFZGUVVGMlJDeEZRVUYxUkRzN1FVRkJRVHM3UVVGQlFTeFJRVUZ1UkN4eFFrRkJiVVFzZFVWQlFUTkNMRXRCUVRKQ08wRkJRVUVzVVVGQmNFSXNWVUZCYjBJc2RVVkJRVkFzUzBGQlR6czdRVUZCUVRzN1FVRkRha2tzVTBGQlN5eEpRVUZNTEVkQlFWa3NTVUZCV2p0QlFVTkJMRk5CUVVzc1QwRkJUQ3hIUVVGbExFOUJRV1k3UVVGRFFTeFRRVUZMTEU5QlFVd3NSMEZCWlN4UFFVRm1PenRCUVVWQk8wRkJRMEU3UVVGRFFTeFhRVUZQTEVsQlFWQXNRMEZCV1N4alFVRmFMRVZCUVRSQ0xFOUJRVFZDTEVOQlFXOURMRlZCUVVNc1NVRkJSQ3hGUVVGVk8wRkJRelZETEZWQlFVa3NUMEZCVHl4TlFVRkxMRTlCUVV3c1EwRkJZU3hKUVVGaUxFTkJRVkFzUzBGQk9FSXNWMEZCYkVNc1JVRkJLME03UVVGRE4wTXNZMEZCU3l4UFFVRk1MRU5CUVdFc1NVRkJZaXhKUVVGeFFpeGxRVUZsTEVsQlFXWXNRMEZCY2tJN1FVRkRSRHRCUVVOR0xFdEJTa1E3TzBGQlRVRXNVMEZCU3l4WFFVRk1MRWRCUVcxQ0xGZEJRVzVDTzBGQlEwRXNVMEZCU3l4eFFrRkJUQ3hIUVVFMlFpeHhRa0ZCTjBJN1FVRkRRU3hUUVVGTExGVkJRVXdzUjBGQmEwSXNWVUZCYkVJN1FVRkRRU3hUUVVGTExFVkJRVXdzUjBGQlZTeDNRa0ZCVmpzN1FVRkZRU3hSUVVGTkxHVkJRV1VzUTBGQlF5eExRVUZMTEhGQ1FVRk9MRWxCUVN0Q0xFdEJRVXNzVDBGQlRDeERRVUZoTEU5QlFXSXNTMEZCZVVJc1NVRkJOMFU3TzBGQlJVRXNVVUZCU1N4UFFVRlBMRXRCUVVzc1QwRkJUQ3hEUVVGaExFOUJRWEJDTEV0QlFXZERMRkZCUVhCRExFVkJRVGhETzBGQlF6VkRMRmRCUVVzc1QwRkJUQ3hEUVVGaExFOUJRV0lzUjBGQmRVSXNVMEZCVXl4aFFVRlVMRU5CUVhWQ0xFdEJRVXNzVDBGQlRDeERRVUZoTEU5QlFYQkRMRU5CUVhaQ08wRkJRMFE3TzBGQlJVUXNVVUZCU1N4blFrRkJaMElzUTBGQlF5eExRVUZMTEU5QlFVd3NRMEZCWVN4UFFVRnNReXhGUVVFeVF6dEJRVU42UXl4WlFVRk5MRWxCUVVrc1MwRkJTaXhEUVVGaExFdEJRVXNzU1VGQmJFSXNlVU5CUVU0N1FVRkRSRHM3UVVGRlJDeFRRVUZMTEdOQlFVd3NSMEZCYzBJc1MwRkJTeXhQUVVGTUxFTkJRV0VzVDBGQllpeExRVUY1UWl4SlFVRXZRenRCUVVOQkxGTkJRVXNzYTBKQlFVd3NSMEZCTUVJc1JVRkJNVUk3TzBGQlJVRXNVVUZCU1N4RFFVRkRMRXRCUVVzc1kwRkJWaXhGUVVFd1FqdEJRVU40UWpzN096czdPenM3UVVGUlFTeFhRVUZMTEU5QlFVd3NSMEZCWlN4UFFVRlBMRTFCUVZBc1EwRkJZeXhMUVVGTExFOUJRVzVDTEVWQlFUUkNMRXRCUVVzc1kwRkJUQ3hEUVVGdlFpeExRVUZMTEdGQlFVd3NSVUZCY0VJc1JVRkJNRU1zVDBGQk1VTXNRMEZCTlVJc1EwRkJaanM3UVVGRlFUdEJRVU5CTEZkQlFVc3NZVUZCVER0QlFVTkVPenRCUVVWRUxGTkJRVXNzWlVGQlRDeEhRVUYxUWp0QlFVRkJMR0ZCUVZNc1RVRkJTeXh2UWtGQlRDeERRVUV3UWl4TFFVRXhRaXhEUVVGVU8wRkJRVUVzUzBGQmRrSTdRVUZEUkRzN096dHRRMEZGWXl4VkxFVkJRVmtzVHl4RlFVRlRPMEZCUTJ4RExGZEJRVXNzVjBGQlRDeERRVUZwUWl4UFFVRnFRaXhEUVVGNVFpeFZRVUZETEVkQlFVUXNSVUZCVXp0QlFVTm9ReXhaUVVGSkxGRkJRVkVzUjBGQlVpeERRVUZLTEVWQlFXdENPMEZCUTJoQ0xIRkNRVUZYTEVkQlFWZ3NTVUZCYTBJc1VVRkJVU3hIUVVGU0xFTkJRV3hDTzBGQlEwUTdRVUZEUml4UFFVcEVPenRCUVUxQkxHRkJRVThzVlVGQlVEdEJRVU5FT3pzN2FVTkJSVms3UVVGRFdDeGhRVUZQTEV0QlFVc3NUMEZCV2p0QlFVTkVPenM3YVVOQlJWazdRVUZEV0N4aFFVRlBMRXRCUVVzc1QwRkJUQ3hEUVVGaExFOUJRWEJDTzBGQlEwUTdPenMwUWtGRlR6dEJRVU5PTEdGQlFVOHNTMEZCU3l4RlFVRmFPMEZCUTBRN096dHhRMEZGWjBJc1VTeEZRVUZWTzBGQlFVRTdPMEZCUTNwQ0xHVkJRVk1zVDBGQlZDeERRVUZwUWp0QlFVRkJMR1ZCUVZjc1QwRkJTeXhsUVVGTUxFTkJRWEZDTEU5QlFYSkNMRU5CUVZnN1FVRkJRU3hQUVVGcVFqdEJRVU5FT3pzN2IwTkJSV1VzVHl4RlFVRlRPMEZCUTNaQ0xHTkJRVkVzVFVGQlVpeERRVUZsTEdkQ1FVRm1MRU5CUVdkRExGRkJRVkVzUzBGQmVFTXNSVUZCSzBNc1MwRkJTeXhsUVVGd1JEdEJRVU5CTEZkQlFVc3NhMEpCUVV3c1EwRkJkMElzU1VGQmVFSXNRMEZCTmtJc1QwRkJOMEk3UVVGRFJEczdPM2xEUVVWdlFqdEJRVUZCT3p0QlFVTnVRaXhYUVVGTExHdENRVUZNTEVOQlFYZENMRTlCUVhoQ0xFTkJRV2RETEZWQlFVTXNUMEZCUkN4RlFVRmhPMEZCUXpORExHVkJRVXNzYVVKQlFVd3NRMEZCZFVJc1QwRkJka0k3UVVGRFJDeFBRVVpFTzBGQlIwUTdPenR6UTBGRmFVSXNUeXhGUVVGVE8wRkJRM3BDTEZWQlFVMHNlVUpCUVhsQ0xFdEJRVXNzYTBKQlFVd3NRMEZETlVJc1UwRkVORUlzUTBGRGJFSTdRVUZCUVN4bFFVRk5MRWRCUVVjc1RVRkJTQ3hMUVVGakxGRkJRVkVzVFVGQmRFSXNTVUZCWjBNc1IwRkJSeXhMUVVGSUxFdEJRV0VzVVVGQlVTeExRVUV6UkR0QlFVRkJMRTlCUkd0Q0xFTkJRUzlDT3p0QlFVZEJMRlZCUVVrc2VVSkJRWGxDTEVOQlFVTXNRMEZCT1VJc1JVRkJhVU03UVVGREwwSXNaMEpCUVZFc1RVRkJVaXhEUVVGbExHMUNRVUZtTEVOQlFXMURMRkZCUVZFc1MwRkJNME1zUlVGQmEwUXNTMEZCU3l4bFFVRjJSRHRCUVVOQkxHRkJRVXNzYTBKQlFVd3NRMEZCZDBJc1RVRkJlRUlzUTBGQkswSXNjMEpCUVM5Q0xFVkJRWFZFTEVOQlFYWkVPMEZCUTBRc1QwRklSQ3hOUVVkUE8wRkJRMHdzWjBKQlFWRXNTMEZCVWl3eVEwRkJjMFFzVVVGQlVTeE5RVUU1UkN4eFFrRkJiMFlzVVVGQlVTeExRVUUxUmp0QlFVTkVPMEZCUTBZN096dHBRMEZGV1N4VExFVkJRV2xFTzBGQlFVRXNWVUZCZEVNc1RVRkJjME1zZFVWQlFUZENMRVZCUVRaQ08wRkJRVUVzVlVGQmVrSXNaVUZCZVVJc2RVVkJRVkFzUzBGQlR6czdRVUZETlVRc1ZVRkJTU3hQUVVGUExGTkJRVkFzUzBGQmNVSXNVVUZCZWtJc1JVRkJiVU03UVVGRGFrTXNZMEZCVFN4SlFVRkpMRXRCUVVvc1EwRkJWU3c0UWtGQlZpeERRVUZPTzBGQlEwUTdPMEZCUlVRc1ZVRkJTU3hMUVVGTExGVkJRVlFzUlVGQmNVSTdRVUZEYmtJc1dVRkJTU3hqUVVGakxHbENRVUZOTEVsQlFYaENMRVZCUVRoQ08wRkJRelZDTEhGRFFVRnBRaXhIUVVGcVFpeERRVUZ4UWl4SlFVRnlRanRCUVVORUxGTkJSa1FzVFVGRlR5eEpRVUZKTEdOQlFXTXNhVUpCUVUwc1NVRkJlRUlzUlVGQk9FSTdRVUZEYmtNc2NVTkJRV2xDTEUxQlFXcENMRU5CUVhkQ0xFbEJRWGhDTzBGQlEwUTdRVUZEUmpzN1FVRkZSRHRCUVVOQkxGVkJRVTBzYTBKQlFXdENMRlZCUVZVc1MwRkJWaXhEUVVGblFpeEhRVUZvUWl4RlFVRnhRaXhOUVVGeVFpeERRVUUwUWl4VlFVRkRMRWRCUVVRc1JVRkJUU3hQUVVGT0xFVkJRV1VzUzBGQlppeEZRVUY1UWp0QlFVTXpSU3haUVVGSkxGVkJRVlVzUTBGQlpDeEZRVUZwUWp0QlFVTm1MR2xDUVVGUExFOUJRVkE3UVVGRFJEczdRVUZGUkN4bFFVRlBMRTFCUVUwc1VVRkJVU3hOUVVGU0xFTkJRV1VzUTBGQlppeEZRVUZyUWl4WFFVRnNRaXhGUVVGT0xFZEJRWGRETEZGQlFWRXNTMEZCVWl4RFFVRmpMRU5CUVdRc1EwRkJMME03UVVGRFJDeFBRVTUxUWl4RFFVRjRRanM3UVVGUlFTeFZRVUZOTEhkQ1FVRnpRaXhuUWtGQlowSXNUVUZCYUVJc1EwRkJkVUlzUTBGQmRrSXNSVUZCTUVJc1YwRkJNVUlzUlVGQmRFSXNSMEZCWjBVc1owSkJRV2RDTEV0QlFXaENMRU5CUVhOQ0xFTkJRWFJDTEVOQlFYUkZPenRCUVVWQk8wRkJRMEVzVlVGQlNTeFBRVUZQTEV0QlFVc3NUMEZCVEN4RFFVRmhMR1ZCUVdJc1EwRkJVQ3hMUVVGNVF5eFZRVUUzUXl4RlFVRjVSRHRCUVVOMlJDeGhRVUZMTEU5QlFVd3NRMEZCWVN4bFFVRmlMRVZCUVRoQ0xFdEJRVGxDTEVOQlFXOURMRWxCUVhCRExFVkJRVEJETEVOQlFVTXNUVUZCUkN4RFFVRXhRenRCUVVORU96dEJRVVZFTEZWQlFVa3NUMEZCVHl4TFFVRkxMRTlCUVV3c1EwRkJZU3hqUVVGaUxFTkJRVkFzUzBGQmQwTXNWVUZCTlVNc1JVRkJkMFE3UVVGRGRFUXNZVUZCU3l4UFFVRk1MRU5CUVdFc1kwRkJZaXhGUVVFMlFpeExRVUUzUWl4RFFVRnRReXhKUVVGdVF5eEZRVUY1UXl4RFFVRkRMRTFCUVVRc1EwRkJla003UVVGRFJEczdRVUZGUkN4VlFVRkpMR1ZCUVVvc1JVRkJjVUk3UVVGRGJrSTdRVUZEUkRzN1FVRkZSRHRCUVVOQkxGVkJRVWtzUzBGQlN5eFBRVUZNTEVOQlFXRXNUMEZCYWtJc1JVRkJNRUk3UVVGRGVFSXNORU5CUVhGQ0xFdEJRVXNzVDBGQlRDeERRVUZoTEU5QlFXeERMRVZCUVRKRExGTkJRVE5ETEVWQlFYTkVMRXRCUVVzc1NVRkJNMFFzUlVGQmFVVXNUVUZCYWtVN1FVRkRSQ3hQUVVaRUxFMUJSVTg3UVVGRFRDd3lRMEZCYjBJc1UwRkJjRUlzUlVGQkswSXNTMEZCU3l4SlFVRndReXhGUVVFd1F5eE5RVUV4UXp0QlFVTkVPMEZCUTBZN096dHZRMEZGWlR0QlFVTmtMRlZCUVVrc1MwRkJTeXhYUVVGTUxFTkJRV2xDTEUxQlFXcENMRWRCUVRCQ0xFTkJRVGxDTEVWQlFXbERPMEZCUXk5Q0xHMUVRVUZ2UWl4TFFVRkxMRTlCUVV3c1EwRkJZU3hQUVVGcVF5eEZRVUV3UXl4TFFVRkxMRTlCUVM5RExFVkJRWGRFTEV0QlFVc3NWMEZCTjBRN1FVRkRSRHRCUVVOR096czdiME5CUldVN1FVRkRaQ3hWUVVGTkxGVkJRVlVzVDBGQlR5eE5RVUZRTEVOQlFXTXNSVUZCWkN4RlFVRnJRaXhMUVVGTExFOUJRWFpDTEVOQlFXaENPMEZCUTBFc1lVRkJUeXd5UTBGQmIwSXNTMEZCU3l4UFFVRk1MRU5CUVdFc1QwRkJha01zUlVGQk1FTXNUMEZCTVVNc1JVRkJiVVFzUzBGQlN5eFhRVUY0UkN4RFFVRlFPMEZCUTBRN08wRkJSVVE3T3pzN096czdPM05EUVV0clFqdEJRVU5vUWl4aFFVRlBMRXRCUVVzc1ZVRkJUQ3hKUVVGdFFpeERRVUZETERKQ1FVRnBRaXhSUVVGcVFpeERRVUV3UWl4SlFVRXhRaXhEUVVFelFqdEJRVU5FT3pzN2VVTkJSVzlDTEVzc1JVRkJUenRCUVVNeFFpeFZRVUZKTEV0QlFVc3NaVUZCVEN4RlFVRktMRVZCUVRSQ08wRkJRekZDTzBGQlEwUTdPMEZCUlVRc1YwRkJTeXhqUVVGTUxFTkJRVzlDTEV0QlFYQkNPMEZCUTBRN096dHRRMEZGWXl4TExFVkJRVTg3UVVGRGNFSTdRVUZEUkRzN08ybERRVVZ0UWp0QlFVTnNRaXhoUVVGUExFdEJRVXNzU1VGQldqdEJRVU5FT3pzN2EwTkJSVzlDTEdNc1JVRkJaMElzVHl4RlFVRlRPMEZCUXpWRExHRkJRVThzU1VGQlNTeGpRVUZLTEVOQlFXMUNMRTlCUVc1Q0xFTkJRVkE3UVVGRFJEczdPenM3TzJ0Q1FYWk1hMElzVXpzN096czdPenM3T3pzN1VVTlNUQ3h0UWl4SFFVRkJMRzFDTzFGQmQwSkJMRzFDTEVkQlFVRXNiVUk3TzBGQkwwSm9RaXhKUVVGTkxHVkJRV1VzVTBGQlppeFpRVUZsTEVOQlFVTXNTMEZCUkN4RlFVRlJMRTFCUVZJc1JVRkJiVUk3UVVGRGRFTXNUVUZCU1N4VlFVRlZMRVZCUVdRc1JVRkJhMEk3UVVGRGFFSXNjVUpCUVdVc1RVRkJaanRCUVVORU8wRkJRMFFzYlVKQlFXVXNTMEZCWml4VFFVRjNRaXhOUVVGNFFqdEJRVU5FTEVOQlRFUTdPMEZCVDA4c1UwRkJVeXh0UWtGQlZDeERRVUUyUWl4UFFVRTNRaXhGUVVGdFJUdEJRVUZCTEUxQlFUZENMRWRCUVRaQ0xIVkZRVUYyUWl4RlFVRjFRanRCUVVGQkxFMUJRVzVDTEV0QlFXMUNPMEZCUVVFc1RVRkJXaXhMUVVGWkxIVkZRVUZLTEVWQlFVazdPMEZCUTNoRkxFMUJRVTBzVDBGQlR5eFBRVUZQTEVsQlFWQXNRMEZCV1N4SFFVRmFMRU5CUVdJN08wRkJSVUVzVDBGQlN5eFBRVUZNTEVOQlFXRXNWVUZCUXl4SFFVRkVMRVZCUVZNN1FVRkRjRUlzVVVGQlNTeFZRVUZWTEVWQlFWWXNTVUZCWjBJc1RVRkJUU3hQUVVGT0xFTkJRV01zUjBGQlpDeE5RVUYxUWl4RFFVRkRMRU5CUVRWRExFVkJRU3RETzBGQlF6ZERPMEZCUTBFN1FVRkRSRHM3UVVGRlJDeFJRVUZKTEZGQlFVOHNTVUZCU1N4SFFVRktMRU5CUVZBc1RVRkJiMElzVVVGQmNFSXNTVUZCWjBNc1NVRkJTU3hIUVVGS0xFMUJRV0VzU1VGQmFrUXNSVUZCZFVRN1FVRkRja1FzVlVGQlNTeFhRVUZYTEVkQlFXWTdRVUZEUVN4VlFVRkpMRlZCUVZVc1JVRkJaQ3hGUVVGclFqdEJRVU5vUWl4dFFrRkJZeXhMUVVGa0xGTkJRWFZDTEVkQlFYWkNPMEZCUTBRN08wRkJSVVFzTUVKQlFXOUNMRTlCUVhCQ0xFVkJRVFpDTEVsQlFVa3NSMEZCU2l4RFFVRTNRaXhGUVVGMVF5eExRVUYyUXl4RlFVRTRReXhSUVVFNVF6dEJRVU5CTzBGQlEwUTdPMEZCUlVRc1VVRkJUU3hQUVVGUExHRkJRV0VzUzBGQllpeEZRVUZ2UWl4SFFVRndRaXhEUVVGaU8wRkJRMEVzV1VGQlVTeFpRVUZTTEVOQlFYRkNMRWxCUVhKQ0xFVkJRVEpDTEVsQlFVa3NSMEZCU2l4RFFVRXpRanRCUVVORUxFZEJiRUpFTzBGQmJVSkVPenRCUVVWTkxGTkJRVk1zYlVKQlFWUXNRMEZCTmtJc1QwRkJOMElzUlVGQmJVVTdRVUZCUVN4TlFVRTNRaXhIUVVFMlFpeDFSVUZCZGtJc1JVRkJkVUk3UVVGQlFTeE5RVUZ1UWl4TFFVRnRRanRCUVVGQkxFMUJRVm9zUzBGQldTeDFSVUZCU2l4RlFVRkpPenRCUVVONFJTeE5RVUZOTEZOQlFWTXNUMEZCVHl4TlFVRlFMRU5CUVdNc1JVRkJaQ3hGUVVGclFpeEhRVUZzUWl4RFFVRm1PMEZCUTBFc1RVRkJUU3hQUVVGUExFOUJRVThzU1VGQlVDeERRVUZaTEVkQlFWb3NRMEZCWWpzN1FVRkZRU3hQUVVGTExFOUJRVXdzUTBGQllTeFZRVUZETEVkQlFVUXNSVUZCVXp0QlFVTndRaXhSUVVGSkxGVkJRVlVzUlVGQlZpeEpRVUZuUWl4TlFVRk5MRTlCUVU0c1EwRkJZeXhIUVVGa0xFMUJRWFZDTEVOQlFVTXNRMEZCTlVNc1JVRkJLME03UVVGRE4wTTdRVUZEUVR0QlFVTkVPenRCUVVWRUxGRkJRVWtzU1VGQlNTeEhRVUZLTEUxQlFXRXNTVUZCWWl4SlFVRnhRaXhKUVVGSkxFZEJRVW9zUlVGQlV5eFhRVUZVTEV0QlFYbENMRTFCUVd4RUxFVkJRVEJFTzBGQlEzaEVMRlZCUVVrc1YwRkJWeXhIUVVGbU8wRkJRMEVzVlVGQlNTeFZRVUZWTEVWQlFXUXNSVUZCYTBJN1FVRkRhRUlzYlVKQlFXTXNTMEZCWkN4VFFVRjFRaXhIUVVGMlFqdEJRVU5FT3p0QlFVVkVMR0ZCUVU4c1IwRkJVQ3hKUVVGakxHOUNRVUZ2UWl4UFFVRndRaXhGUVVFMlFpeEpRVUZKTEVkQlFVb3NRMEZCTjBJc1JVRkJkVU1zUzBGQmRrTXNSVUZCT0VNc1VVRkJPVU1zUTBGQlpEdEJRVU5CTzBGQlEwUTdPMEZCUlVRN1FVRkRRU3hSUVVGSkxGRkJRVkVzU1VGQlNTeEhRVUZLTEVOQlFWb3NRMEZxUW05Q0xFTkJhVUpETzBGQlEzSkNMRkZCUVUwc1kwRkJZeXhMUVVGa0xIbERRVUZqTEV0QlFXUXNRMEZCVGp0QlFVTkJMRkZCUVUwc1QwRkJUeXhoUVVGaExFdEJRV0lzUlVGQmIwSXNSMEZCY0VJc1EwRkJZanRCUVVOQkxGRkJRVTBzV1VGQldTeFJRVUZSTEZsQlFWSXNRMEZCY1VJc1NVRkJja0lzUTBGQmJFSTdPMEZCUlVFc1VVRkJTU3hqUVVGakxFbEJRV3hDTEVWQlFYZENPMEZCUTNSQ0xGVkJRVWtzVTBGQlV5eFRRVUZpTEVWQlFYZENPMEZCUTNSQ08wRkJRMEVzWjBKQlFWRXNZMEZCWXl4TlFVRjBRanRCUVVORUxFOUJTRVFzVFVGSFR5eEpRVUZKTEVOQlFVTXNUVUZCVFN4VFFVRk9MRU5CUVV3c1JVRkJkVUk3UVVGRE5VSXNaMEpCUVZFc1UwRkJVeXhUUVVGVUxFVkJRVzlDTEVWQlFYQkNMRU5CUVZJN1FVRkRSQ3hQUVVaTkxFMUJSVUU3UVVGRFRDeG5Ra0ZCVVN4VFFVRlNPMEZCUTBRN1FVRkRSanM3UVVGRlJDeFhRVUZQTEVkQlFWQXNTVUZCWXl4TFFVRmtPMEZCUTBRc1IwRnNRMFE3TzBGQmIwTkJMRk5CUVU4c1RVRkJVRHRCUVVORU96dEJRVVZFTEVsQlFVMHNVVUZCVVN4RlFVRmtPenRyUWtGRlpUdEJRVU5pTEV0QlJHRXNaVUZEVkN4VFFVUlRMRVZCUTBVN1FVRkRZaXhWUVVGTkxFbEJRVTRzUTBGQlZ5eFRRVUZZTzBGQlEwUXNSMEZJV1R0QlFVbGlMRkZCU21Fc2EwSkJTVTRzVTBGS1RTeEZRVWxMTzBGQlEyaENMRkZCUVUwc1VVRkJVU3hOUVVGTkxGTkJRVTRzUTBGQlowSTdRVUZCUVN4aFFVRkxMRTlCUVU4c1JVRkJVQ3hEUVVGVkxGTkJRVllzUlVGQmNVSXNRMEZCY2tJc1EwRkJURHRCUVVGQkxFdEJRV2hDTEVOQlFXUTdRVUZEUVN4UlFVRkpMRkZCUVZFc1EwRkJReXhEUVVGaUxFVkJRV2RDTzBGQlEyUXNXVUZCVFN4TlFVRk9MRU5CUVdFc1MwRkJZaXhGUVVGdlFpeERRVUZ3UWp0QlFVTkVPMEZCUTBZc1IwRlVXVHRCUVZWaUxGVkJWbUVzYjBKQlZVb3NVMEZXU1N4RlFWVlBPMEZCUTJ4Q0xGZEJRVThzVFVGQlRTeE5RVUZPTEV0QlFXbENMRU5CUVdwQ0xFbEJRWE5DTEU5QlFVOHNSVUZCVUN4RFFVRlZMRTFCUVUwc1RVRkJUU3hOUVVGT0xFZEJRV1VzUTBGQmNrSXNRMEZCVml4RlFVRnRReXhUUVVGdVF5eERRVUUzUWp0QlFVTkVPMEZCV2xrc1F6czdPenM3T3pzN096czdRVU40UldZN096czdRVUZEUVRzN096czdPenM3SzJWQlRrRTdPenM3T3pzN1FVRlJRU3hKUVVGTkxGVkJRVmNzV1VGQlRUczdRVUZGY2tJN096czdPenRCUVUxQkxFMUJRVTBzVDBGQlR5eFRRVUZpTzBGQlEwRXNUVUZCVFN4eFFrRkJjVUk3UVVGRGVrSXNZVUZCVXl4SlFVUm5RanRCUVVWNlFpeFhRVUZQTEVsQlJtdENPMEZCUjNwQ0xHRkJRVk1zU1VGSVowSTdRVUZKZWtJc1owSkJRVmtzU1VGS1lUdEJRVXQ2UWl4VlFVRk5MRWxCVEcxQ08wRkJUWHBDTEdGQlFWTXNRMEZEVUR0QlFVTkZMRmxCUVUwc1VVRkVVanRCUVVWRkxHVkJRVk1zU1VGR1dEdEJRVWRGTEdGQlFVODdRVUZJVkN4TFFVUlBMRVZCVFZBN1FVRkRSU3haUVVGTkxFbEJSRkk3UVVGRlJTeGxRVUZUTEVsQlJsZzdRVUZIUlN4aFFVRlBPMEZCU0ZRc1MwRk9UenRCUVU1blFpeEhRVUV6UWp0QlFXMUNRU3hOUVVGTkxIZENRVUYzUWl4RFFVTTFRaXhaUVVRMFFpeERRVUU1UWpzN1FVRkpRVHM3T3pzN08wRkJhRU54UWl4TlFYTkRaaXhQUVhSRFpUdEJRVUZCT3p0QlFYZERia0lzZFVKQlFUQkNPMEZCUVVFc1ZVRkJaQ3hQUVVGakxIVkZRVUZLTEVWQlFVazdPMEZCUVVFN08wRkJRM2hDTEZWQlFVMHNWMEZCVnl4TFFVTnFRaXhyUkVGRWFVSXNSMEZGWml3MFEwRkdaU3hIUVVkaUxEaENRVWhoTEVkQlNWZ3NOa0pCU2xjc1IwRkxWQ3huUTBGTVV5eEhRVTFZTEZGQlRsY3NSMEZQV0N3eVFrRlFWeXhIUVZGVUxGTkJVbE1zUjBGVFdDeFJRVlJYTEVkQlZWZ3NOa0pCVmxjc1IwRlhXQ3hSUVZoWExFZEJXV0lzVVVGYVlTeEhRV0ZtTEZGQlltVXNSMEZqYWtJc1VVRmtRVHM3UVVGblFrRXNWVUZCU1N4RFFVRkRMRTFCUVUwc1QwRkJUaXhEUVVGakxGRkJRVkVzVDBGQmRFSXNRMEZCVEN4RlFVRnhRenRCUVVOdVF5eG5Ra0ZCVVN4UFFVRlNMRWRCUVd0Q0xHMUNRVUZ0UWl4UFFVRnlRenRCUVVORU96dEJRVzVDZFVJc0swZEJjVUpzUWl4UFFYSkNhMElzUlVGeFFsUXNVVUZ5UWxNN1FVRnpRbnBDT3p0QlFUbEVhMEk3UVVGQlFUdEJRVUZCTEcxRFFXZEZRenRCUVVOc1FpeGxRVUZQTEVsQlFWQTdRVUZEUkR0QlFXeEZhMEk3UVVGQlFUdEJRVUZCTEc5RFFXOUZSU3hQUVhCRlJpeEZRVzlGVnp0QlFVTTFRaXhsUVVGUExFbEJRVWtzVDBGQlNpeERRVUZaTEU5QlFWb3NRMEZCVUR0QlFVTkVPMEZCZEVWclFqczdRVUZCUVR0QlFVRkJPenRCUVhsRmNrSTdPenM3T3pzN1FVRkxRU3hOUVVGTkxHRkJRV0VzUlVGQmJrSTdRVUZEUVN4TlFVRk5MRlZCUVZVc1UwRkJVeXhuUWtGQlZDeFBRVUU0UWl4blFrRkJUeXhWUVVGUUxFVkJRVGxDTEVOQlFXaENPenRCUVVWQkxFMUJRVWtzVDBGQlNpeEZRVUZoTzBGQlExZ3NWVUZCVFN4SlFVRk9MRU5CUVZjc1QwRkJXQ3hGUVVGdlFpeFBRVUZ3UWl4RFFVRTBRaXhWUVVGRExFOUJRVVFzUlVGQllUdEJRVU4yUXl4VlFVRk5MRk5CUVZNc01rTkJRVzlDTEU5QlFYQkNMRVZCUVRaQ0xHdENRVUUzUWl4RlFVRnBSQ3h4UWtGQmFrUXNRMEZCWmp0QlFVTkJMR0ZCUVU4c1QwRkJVQ3hIUVVGcFFpeFBRVUZxUWpzN1FVRkZRU3hWUVVGSkxFOUJRVThzU1VGQlVDeExRVUZuUWl4SlFVRndRaXhGUVVFd1FqdEJRVU40UWp0QlFVTkJMRzFDUVVGWExFbEJRVmdzUTBGQlowSXNTVUZCU1N4UFFVRktMRU5CUVZrc1RVRkJXaXhEUVVGb1FqdEJRVU5FTzBGQlEwWXNTMEZTUkR0QlFWTkVPenRCUVVWRUxGZEJRVk1zWjBKQlFWUXNRMEZCTUVJc1QwRkJNVUlzUlVGQmJVTXNWVUZCUXl4TFFVRkVMRVZCUVZjN1FVRkROVU1zVVVGQlRTeHBRa0ZCYVVJc1RVRkJUU3hOUVVGT0xFTkJRV0VzV1VGQllpeERRVUV3UWl4aFFVRXhRaXhEUVVGMlFqdEJRVU5CTEZGQlFVa3NhMEpCUVd0Q0xHMUNRVUZ0UWl4SlFVRjZReXhGUVVFclF6dEJRVU0zUXl4VlFVRk5MRXRCUVVzc1RVRkJUU3hOUVVGT0xFTkJRV0VzV1VGQllpeERRVUV3UWl4aFFVRXhRaXhEUVVGWU8wRkJRMEVzVlVGQlRTeFZRVUZWTEZOQlFWTXNZVUZCVkN4RFFVRjFRaXhGUVVGMlFpeERRVUZvUWpzN1FVRkZRU3hWUVVGTkxGbEJRVmtzVjBGQlZ5eEpRVUZZTEVOQlFXZENPMEZCUVVFc1pVRkJTeXhGUVVGRkxFOUJRVVlzUzBGQll5eFBRVUZ1UWp0QlFVRkJMRTlCUVdoQ0xFTkJRV3hDT3p0QlFVVkJMRlZCUVVrc1EwRkJReXhUUVVGTUxFVkJRV2RDTzBGQlEyUTdRVUZEUkRzN1FVRkZSRHRCUVVOQkxGbEJRVTBzVFVGQlRpeERRVUZoTEVsQlFXSTdPMEZCUlVFc1owSkJRVlVzVFVGQlZpeERRVUZwUWl4SlFVRnFRanRCUVVORU8wRkJRMFlzUjBGcVFrUTdPMEZCYlVKQkxGTkJRVThzVDBGQlVEdEJRVU5FTEVOQmFraGxMRVZCUVdoQ096dHJRa0Z0U0dVc1R6czdPenM3T3pzN096czdPenRCUTNSSVpqczdPenRCUVVOQk96czdPMEZCUTBFN096czdPenM3T3l0bFFWQkJPenM3T3pzN08wRkJVMEVzU1VGQlRTeFRRVUZWTEZsQlFVMDdRVUZEY0VJN096czdPenRCUVUxQkxFMUJRVTBzVDBGQlR5eFJRVUZpTzBGQlEwRXNUVUZCVFN4VlFVRlZMRTlCUVdoQ08wRkJRMEVzVFVGQlRTeHZRa0ZCYjBJc2FVSkJRVEZDTzBGQlEwRXNUVUZCVFN4eFFrRkJjVUk3UVVGRGVrSXNZVUZCVXl4SlFVUm5RanRCUVVWNlFpeFhRVUZQTEVsQlJtdENPMEZCUjNwQ0xHRkJRVk1zU1VGSVowSTdRVUZKZWtJc1owSkJRVmtzU1VGS1lUdEJRVXQ2UWl4aFFVRlRMRU5CUTFBN1FVRkRSU3haUVVGTkxFbEJSRkk3UVVGRlJTeGxRVUZUTEVsQlJsZzdRVUZIUlN4aFFVRlBPMEZCU0ZRc1MwRkVUenRCUVV4blFpeEhRVUV6UWp0QlFXRkJMRTFCUVUwc2QwSkJRWGRDTEVOQlF6VkNMRmxCUkRSQ0xFTkJRVGxDT3p0QlFVbEJPenM3T3pzN1FVRXpRbTlDTEUxQmFVTmtMRTFCYWtOak8wRkJRVUU3TzBGQmJVTnNRaXh6UWtGQk1rTTdRVUZCUVN4VlFVRXZRaXhQUVVFclFpeDFSVUZCY2tJc1JVRkJjVUk3UVVGQlFTeFZRVUZxUWl4UlFVRnBRaXgxUlVGQlRpeEpRVUZOT3p0QlFVRkJPenRCUVVGQkxHdElRVU51UXl4SlFVUnRReXhGUVVNM1FpeFBRVVEyUWl4RlFVTndRaXhyUWtGRWIwSXNSVUZEUVN4UFFVUkJMRVZCUTFNc2NVSkJSRlFzUlVGRFowTXNTVUZFYUVNc1JVRkRjME1zU1VGRWRFTTdPMEZCUjNwRExGbEJRVXNzVVVGQlRDeEhRVUZuUWl4WlFVRlpMRXRCUXpWQ0xHdEVRVVEwUWl4SFFVVXhRaXcwUTBGR01FSXNSMEZIZUVJc09FSkJTSGRDTEVkQlNYUkNMRFpDUVVwelFpeEhRVXR3UWl4blEwRk1iMElzUjBGTmRFSXNVVUZPYzBJc1IwRlBkRUlzTWtKQlVITkNMRWRCVVhCQ0xGTkJVbTlDTEVkQlUzUkNMRkZCVkhOQ0xFZEJWWFJDTERaQ1FWWnpRaXhIUVZkMFFpeFJRVmh6UWl4SFFWbDRRaXhSUVZwM1FpeEhRV0V4UWl4UlFXSXdRaXhIUVdNMVFpeFJRV1JCT3p0QlFXZENRU3hWUVVGSkxFMUJRVXNzWTBGQlZDeEZRVUY1UWp0QlFVTjJRaXhqUVVGTExFdEJRVXc3UVVGRFJEdEJRWEpDZDBNN1FVRnpRakZET3p0QlFYcEVhVUk3UVVGQlFUdEJRVUZCTERoQ1FUSkVWanRCUVVGQk96dEJRVU5PTEZsQlFVMHNWVUZCVlN4VFFVRlRMR0ZCUVZRc1EwRkJkVUlzUzBGQmRrSXNRMEZCYUVJN08wRkJSVUVzWjBKQlFWRXNVMEZCVWl4SFFVRnZRaXhMUVVGTExGRkJRWHBDT3p0QlFVVkJMR0ZCUVVzc1QwRkJUQ3hEUVVGaExFOUJRV0lzUjBGQmRVSXNVVUZCVVN4VlFVRXZRanM3UVVGRlFUdEJRVU5CTEZsQlFVa3NTMEZCU3l4UFFVRk1MRU5CUVdFc1MwRkJZaXhMUVVGMVFpeEpRVUV6UWl4RlFVRnBRenRCUVVNdlFpeGxRVUZMTEU5QlFVd3NRMEZCWVN4UFFVRmlMRU5CUVhGQ0xHRkJRWEpDTEVOQlFXMURMR1ZCUVc1RExFVkJRVzlFTEZOQlFYQkVMRWRCUVdkRkxFdEJRVXNzVDBGQlRDeERRVUZoTEV0QlFUZEZPMEZCUTBRN08wRkJSVVE3UVVGRFFTeFpRVUZKTEV0QlFVc3NUMEZCVEN4RFFVRmhMRTlCUVdJc1MwRkJlVUlzU1VGQk4wSXNSVUZCYlVNN1FVRkRha01zWlVGQlN5eFBRVUZNTEVOQlFXRXNUMEZCWWl4RFFVRnhRaXhoUVVGeVFpeERRVUZ0UXl4alFVRnVReXhGUVVGdFJDeFZRVUZ1UkN4RFFVRTRSQ3hUUVVFNVJDeEhRVUV3UlN4TFFVRkxMRTlCUVV3c1EwRkJZU3hQUVVGMlJqdEJRVU5FTEZOQlJrUXNUVUZGVHp0QlFVTk1PMEZCUTBFc1pVRkJTeXhqUVVGTU8wRkJRMFE3TzBGQlJVUTdRVUZEUVN4WlFVRkpMRXRCUVVzc1QwRkJUQ3hEUVVGaExFOUJRV0lzUzBGQmVVSXNTVUZCZWtJc1NVRkJhVU1zVFVGQlRTeFBRVUZPTEVOQlFXTXNTMEZCU3l4UFFVRk1MRU5CUVdFc1QwRkJNMElzUTBGQmNrTXNSVUZCTUVVN1FVRkRlRVVzWTBGQlNTeExRVUZMTEU5QlFVd3NRMEZCWVN4UFFVRmlMRU5CUVhGQ0xFMUJRWEpDTEVkQlFUaENMRU5CUVd4RExFVkJRWEZETzBGQlEyNURMR2xDUVVGTExFOUJRVXdzUTBGQllTeFBRVUZpTEVOQlFYRkNMRTlCUVhKQ0xFTkJRVFpDTEZWQlFVTXNUVUZCUkN4RlFVRlpPMEZCUTNaRExIRkNRVUZMTEU5QlFVd3NRMEZCWVN4UFFVRmlMRU5CUVhGQ0xHRkJRWEpDTEVOQlFXMURMR2RDUVVGdVF5eEZRVUZ4UkN4WFFVRnlSQ3hEUVVGcFJTeFBRVUZMTEZkQlFVd3NRMEZCYVVJc1RVRkJha0lzUTBGQmFrVTdRVUZEUkN4aFFVWkVPMEZCUjBRc1YwRktSQ3hOUVVsUE8wRkJRMHdzYVVKQlFVc3NXVUZCVER0QlFVTkVPMEZCUTBZc1UwRlNSQ3hOUVZGUE8wRkJRMHdzWlVGQlN5eFpRVUZNTzBGQlEwUTdPMEZCUlVRc2FVSkJRVk1zU1VGQlZDeERRVUZqTEZkQlFXUXNRMEZCTUVJc1MwRkJTeXhQUVVGTUxFTkJRV0VzVDBGQmRrTTdPMEZCUlVFc1lVRkJTeXhoUVVGTU8wRkJRMFE3UVVFdlJtbENPMEZCUVVFN1FVRkJRU3h2UTBGcFIxYzdRVUZCUVN4WlFVRnFRaXhWUVVGcFFpeDFSVUZCU2l4RlFVRkpPenRCUVVNelFpeFpRVUZOTEZOQlFWTXNVMEZCVXl4aFFVRlVMRU5CUVhWQ0xGRkJRWFpDTEVOQlFXWTdRVUZEUVN4bFFVRlBMRmxCUVZBc1EwRkJiMElzVFVGQmNFSXNSVUZCTkVJc1VVRkJOVUk3UVVGRFFTeGxRVUZQTEZsQlFWQXNRMEZCYjBJc1QwRkJjRUlzUlVGQk5rSXNWMEZCVnl4TFFVRllMRWxCUVc5Q0xFdEJRV3BFTzBGQlEwRXNaVUZCVHl4VFFVRlFMRWRCUVcxQ0xGZEJRVmNzU1VGQk9VSTdPMEZCUlVFc1dVRkJTU3hYUVVGWExFOUJRV1lzUlVGQmQwSTdRVUZEZEVJc2FVSkJRVThzV1VGQlVDeERRVUZ2UWl4alFVRndRaXhGUVVGdlF5eEpRVUZ3UXp0QlFVTkVPenRCUVVWRUxHVkJRVThzVFVGQlVEdEJRVU5FTzBGQk5VZHBRanRCUVVGQk8wRkJRVUVzYzBOQk9FZEdPMEZCUTJRc1dVRkJUU3hYUVVGWExGTkJRVk1zWVVGQlZDeERRVUYxUWl4TFFVRjJRaXhEUVVGcVFqdEJRVU5CTEdsQ1FVRlRMRmxCUVZRc1EwRkJjMElzVTBGQmRFSXNSVUZCYVVNc1MwRkJTeXhGUVVGMFF6dEJRVU5CTEdsQ1FVRlRMRk5CUVZRc1EwRkJiVUlzUjBGQmJrSXNRMEZCZFVJc2FVSkJRWFpDT3p0QlFVVkJMR2xDUVVGVExFbEJRVlFzUTBGQll5eFhRVUZrTEVOQlFUQkNMRkZCUVRGQ08wRkJRMFE3UVVGd1NHbENPMEZCUVVFN1FVRkJRU3h2UTBGelNFbzdRVUZEV2l4bFFVRlBMRk5CUVZNc1lVRkJWQ3hQUVVFeVFpeHBRa0ZCTTBJc2EwSkJRWGxFTEV0QlFVc3NSVUZCT1VRc1VVRkJVRHRCUVVORU8wRkJlRWhwUWp0QlFVRkJPMEZCUVVFc2RVTkJNRWhFTzBGQlEyWXNZVUZCU3l4UFFVRk1MRU5CUVdFc1QwRkJZaXhEUVVGeFFpeGhRVUZ5UWl4RFFVRnRReXhqUVVGdVF5eEZRVUZ0UkN4WFFVRnVSQ3hEUVVFclJDeExRVUZMTEU5QlFVd3NRMEZCWVN4UFFVRmlMRU5CUVhGQ0xHRkJRWEpDTEVOQlFXMURMR05CUVc1RExFVkJRVzFFTEZWQlFXeElPMEZCUTBRN1FVRTFTR2xDTzBGQlFVRTdRVUZCUVN4eFEwRTRTRWc3UVVGRFlpeFpRVUZOTEZOQlFWTXNTMEZCU3l4UFFVRk1MRU5CUVdFc1QwRkJZaXhEUVVGeFFpeGhRVUZ5UWl4RFFVRnRReXhuUWtGQmJrTXNRMEZCWmp0QlFVTkJMR0ZCUVVzc1QwRkJUQ3hEUVVGaExFOUJRV0lzUTBGQmNVSXNZVUZCY2tJc1EwRkJiVU1zYVVKQlFXNURMRVZCUVhORUxGZEJRWFJFTEVOQlFXdEZMRTFCUVd4Rk8wRkJRMFE3UVVGcVNXbENPMEZCUVVFN1FVRkJRU3dyUWtGdFNWUTdRVUZEVUN4WlFVRk5MR2RDUVVGblFpeFBRVUZQTEdkQ1FVRlFMRU5CUVhkQ0xFdEJRVXNzVDBGQlRDeERRVUZoTEU5QlFYSkRMRU5CUVhSQ08wRkJRMEVzV1VGQlRTeFRRVUZUTEdOQlFXTXNUVUZCWkN4RFFVRnhRaXhMUVVGeVFpeERRVUV5UWl4RFFVRXpRaXhGUVVFNFFpeGpRVUZqTEUxQlFXUXNRMEZCY1VJc1RVRkJja0lzUjBGQk9FSXNRMEZCTlVRc1EwRkJaanM3UVVGRlFTeFpRVUZOTEUxQlFVOHNUMEZCVHl4WFFVRlFMRWRCUVhGQ0xFTkJRWFJDTEVkQlFUUkNMRk5CUVZNc1EwRkJha1E3UVVGRFFTeGhRVUZMTEU5QlFVd3NRMEZCWVN4UFFVRmlMRU5CUVhGQ0xFdEJRWEpDTEVOQlFUSkNMRWRCUVROQ0xFZEJRVzlETEVkQlFYQkRPMEZCUTBRN1FVRjZTV2xDTzBGQlFVRTdRVUZCUVN3MlFrRXlTVmc3UVVGQlFUczdRVUZEVEN4WlFVRkpMRXRCUVVzc1QwRkJUQ3hEUVVGaExFOUJRV0lzUzBGQmVVSXNTVUZCTjBJc1JVRkJiVU03UVVGRGFrTTdRVUZEUVN4bFFVRkxMRXRCUVV3N1FVRkRSRHM3UVVGRlJDeFpRVUZKTEV0QlFVc3NUMEZCVEN4RFFVRmhMRTlCUVdJc1EwRkJjVUlzVTBGQmNrSXNRMEZCSzBJc1VVRkJMMElzUTBGQmQwTXNUVUZCZUVNc1EwRkJTaXhGUVVGeFJEdEJRVU51UkN4cFFrRkJUeXhMUVVGUU8wRkJRMFE3TzBGQlJVUTdRVUZEUVN4dFFrRkJWeXhaUVVGTk8wRkJRMllzYVVKQlFVc3NXVUZCVEN4RFFVRnJRaXhwUWtGQlRTeEpRVUY0UWp0QlFVTkJMR2xDUVVGTExHRkJRVXc3TzBGQlJVRXNZMEZCVFN4VlFVRlZMRk5CUVZZc1QwRkJWU3hIUVVGTk8wRkJRM0JDTEcxQ1FVRkxMRmxCUVV3c1EwRkJhMElzYVVKQlFVMHNTMEZCZUVJN1FVRkRRU3h0UWtGQlN5eFBRVUZNTEVOQlFXRXNUMEZCWWl4RFFVRnhRaXh0UWtGQmNrSXNRMEZCZVVNc2FVSkJRVTBzWTBGQkwwTXNSVUZCSzBRc1QwRkJMMFE3TzBGQlJVRTdRVUZEUVN4dFFrRkJTeXhaUVVGTU8wRkJRMFFzVjBGT1JEczdRVUZSUVN4cFFrRkJTeXhQUVVGTUxFTkJRV0VzVDBGQllpeERRVUZ4UWl4blFrRkJja0lzUTBGQmMwTXNhVUpCUVUwc1kwRkJOVU1zUlVGQk5FUXNUMEZCTlVRN08wRkJSVUVzYVVKQlFVc3NUMEZCVEN4RFFVRmhMRTlCUVdJc1EwRkJjVUlzVTBGQmNrSXNRMEZCSzBJc1IwRkJMMElzUTBGQmJVTXNUVUZCYmtNN08wRkJSVUVzYVVKQlFVc3NUVUZCVER0QlFVTkVMRk5CYWtKRUxFVkJhVUpITEVWQmFrSklPenRCUVcxQ1FTeGxRVUZQTEVsQlFWQTdRVUZEUkR0QlFURkxhVUk3UVVGQlFUdEJRVUZCTEhGRFFUUkxTQ3hMUVRWTFJ5eEZRVFJMU1R0QlFVTndRaXhaUVVGSkxFMUJRVTBzU1VGQlRpeExRVUZsTEU5QlFXWXNTVUZCTUVJc1RVRkJUU3hQUVVGT0xFdEJRV3RDTEVWQlFUVkRMRWxCUVd0RUxFMUJRVTBzVDBGQlRpeExRVUZyUWl4RlFVRjRSU3hGUVVFMFJUdEJRVU14UlR0QlFVTkVPenRCUVVWRU8wRkJRMEVzWVVGQlN5eEpRVUZNTzBGQlEwUTdRVUZ1VEdsQ08wRkJRVUU3UVVGQlFTdzJRa0Z4VEZnN1FVRkJRVHM3UVVGRFRDeFpRVUZKTEVOQlFVTXNTMEZCU3l4UFFVRk1MRU5CUVdFc1QwRkJZaXhEUVVGeFFpeFRRVUZ5UWl4RFFVRXJRaXhSUVVFdlFpeERRVUYzUXl4TlFVRjRReXhEUVVGTUxFVkJRWE5FTzBGQlEzQkVMR2xDUVVGUExFdEJRVkE3UVVGRFJEczdRVUZGUkN4aFFVRkxMRmxCUVV3c1EwRkJhMElzYVVKQlFVMHNTVUZCZUVJN08wRkJSVUVzWVVGQlN5eFpRVUZNT3p0QlFVVkJMR0ZCUVVzc1QwRkJUQ3hEUVVGaExFOUJRV0lzUTBGQmNVSXNVMEZCY2tJc1EwRkJLMElzUjBGQkwwSXNRMEZCYlVNc1RVRkJia003UVVGRFFTeGhRVUZMTEU5QlFVd3NRMEZCWVN4UFFVRmlMRU5CUVhGQ0xGTkJRWEpDTEVOQlFTdENMRTFCUVM5Q0xFTkJRWE5ETEUxQlFYUkRPenRCUVVWQkxGbEJRVTBzVjBGQlZ5eExRVUZMTEZkQlFVd3NSVUZCYWtJN08wRkJSVUVzV1VGQlRTeFhRVUZYTEZOQlFWZ3NVVUZCVnl4SFFVRk5PMEZCUTNKQ0xHMUNRVUZUTEVsQlFWUXNRMEZCWXl4WFFVRmtMRU5CUVRCQ0xGRkJRVEZDT3p0QlFVVkJMR2xDUVVGTExFOUJRVXdzUTBGQllTeFBRVUZpTEVOQlFYRkNMRk5CUVhKQ0xFTkJRU3RDTEUxQlFTOUNMRU5CUVhORExFMUJRWFJET3p0QlFVVkJMR2xDUVVGTExGbEJRVXdzUTBGQmEwSXNhVUpCUVUwc1RVRkJlRUk3TzBGQlJVRXNiVUpCUVZNc2JVSkJRVlFzUTBGQk5rSXNhVUpCUVUwc1kwRkJia01zUlVGQmJVUXNVVUZCYmtRN08wRkJSVUU3UVVGRFFTeGpRVUZKTEU5QlFVc3NZMEZCVkN4RlFVRjVRanRCUVVOMlFpeHhRa0ZCVXl4SlFVRlVMRU5CUVdNc1YwRkJaQ3hEUVVFd1FpeFBRVUZMTEU5QlFVd3NRMEZCWVN4UFFVRjJRenRCUVVOQkxHMUNRVUZMTEU5QlFVd3NRMEZCWVN4UFFVRmlMRWRCUVhWQ0xFbEJRWFpDTzBGQlEwUTdRVUZEUml4VFFXUkVPenRCUVdkQ1FTeHBRa0ZCVXl4blFrRkJWQ3hEUVVFd1FpeHBRa0ZCVFN4alFVRm9ReXhGUVVGblJDeFJRVUZvUkR0QlFVTkJMR2xDUVVGVExGTkJRVlFzUTBGQmJVSXNSMEZCYmtJc1EwRkJkVUlzVTBGQmRrSTdPMEZCUlVFc1pVRkJUeXhKUVVGUU8wRkJRMFE3UVVGMlRtbENPMEZCUVVFN1FVRkJRU3h4UTBGNVRrZzdRVUZCUVRzN1FVRkRZaXhaUVVGTkxHbENRVUZwUWl4TFFVRkxMRTlCUVV3c1EwRkJZU3hQUVVGaUxFTkJRWEZDTEdkQ1FVRnlRaXhEUVVGelF5eG5Ra0ZCZEVNc1EwRkJka0k3UVVGRFFTeFpRVUZKTEdOQlFVb3NSVUZCYjBJN1FVRkRiRUlzWjBKQlFVMHNTVUZCVGl4RFFVRlhMR05CUVZnc1JVRkJNa0lzVDBGQk0wSXNRMEZCYlVNN1FVRkJRU3h0UWtGQlZTeFBRVUZMTEdWQlFVd3NRMEZCY1VJc1JVRkJSU3hSUVVGUkxFMUJRVllzUlVGQmEwSXNUMEZCVHl4UFFVRjZRaXhGUVVGeVFpeERRVUZXTzBGQlFVRXNWMEZCYmtNN1FVRkRSRHM3UVVGRlJEdEJRVU5CTzBGQlEwRTdRVUZEUVN4WlFVRkpMRXRCUVVzc1QwRkJUQ3hEUVVGaExGVkJRV3BDTEVWQlFUWkNPMEZCUXpOQ0xHTkJRVTBzVjBGQlZ5eExRVUZMTEZkQlFVd3NSVUZCYWtJN1FVRkRRU3hsUVVGTExHVkJRVXdzUTBGQmNVSXNSVUZCUlN4UlFVRlJMRkZCUVZZc1JVRkJiMElzVDBGQlR5eHBRa0ZCVFN4TFFVRnFReXhGUVVGeVFqdEJRVU5CTEdWQlFVc3NaVUZCVEN4RFFVRnhRaXhGUVVGRkxGRkJRVkVzVVVGQlZpeEZRVUZ2UWl4UFFVRlBMRTlCUVROQ0xFVkJRWEpDTzBGQlEwUTdRVUZEUmp0QlFYWlBhVUk3UVVGQlFUdEJRVUZCTEhGRFFYbFBTRHRCUVVGQk96dEJRVU5pTEZsQlFVMHNhVUpCUVdsQ0xFdEJRVXNzVDBGQlRDeERRVUZoTEU5QlFXSXNRMEZCY1VJc1owSkJRWEpDTEVOQlFYTkRMR2RDUVVGMFF5eERRVUYyUWp0QlFVTkJMRmxCUVVrc1kwRkJTaXhGUVVGdlFqdEJRVU5zUWl4blFrRkJUU3hKUVVGT0xFTkJRVmNzWTBGQldDeEZRVUV5UWl4UFFVRXpRaXhEUVVGdFF6dEJRVUZCTEcxQ1FVRlZMRTlCUVVzc2FVSkJRVXdzUTBGQmRVSXNSVUZCUlN4UlFVRlJMRTFCUVZZc1JVRkJhMElzVDBGQlR5eFBRVUY2UWl4RlFVRjJRaXhEUVVGV08wRkJRVUVzVjBGQmJrTTdRVUZEUkRzN1FVRkZSQ3haUVVGSkxFdEJRVXNzVDBGQlRDeERRVUZoTEZWQlFXcENMRVZCUVRaQ08wRkJRek5DTEdOQlFVMHNWMEZCVnl4TFFVRkxMRmRCUVV3c1JVRkJha0k3UVVGRFFTeGxRVUZMTEdsQ1FVRk1MRU5CUVhWQ0xFVkJRVVVzVVVGQlVTeFJRVUZXTEVWQlFXOUNMRTlCUVU4c2FVSkJRVTBzUzBGQmFrTXNSVUZCZGtJN1FVRkRRU3hsUVVGTExHbENRVUZNTEVOQlFYVkNMRVZCUVVVc1VVRkJVU3hSUVVGV0xFVkJRVzlDTEU5QlFVOHNUMEZCTTBJc1JVRkJka0k3UVVGRFJEdEJRVU5HTzBGQmNGQnBRanRCUVVGQk8wRkJRVUVzYlVOQmMxQkZPMEZCUTJ4Q0xHVkJRVThzU1VGQlVEdEJRVU5FTzBGQmVGQnBRanRCUVVGQk8wRkJRVUVzYjBOQk1GQkhMRTlCTVZCSUxFVkJNRkJaTzBGQlF6VkNMSGxIUVVFeVFpeE5RVUV6UWl4RlFVRnRReXhQUVVGdVF6dEJRVU5FTzBGQk5WQnBRanM3UVVGQlFUdEJRVUZCT3p0QlFTdFFjRUk3T3pzN096czdRVUZMUVN4TlFVRk5MR0ZCUVdFc1JVRkJia0k3TzBGQlJVRXNUVUZCVFN4VlFVRlZMRk5CUVZNc1owSkJRVlFzVDBGQk9FSXNTVUZCT1VJc1EwRkJhRUk3UVVGRFFTeE5RVUZKTEU5QlFVb3NSVUZCWVR0QlFVTllMRlZCUVUwc1NVRkJUaXhEUVVGWExFOUJRVmdzUlVGQmIwSXNUMEZCY0VJc1EwRkJORUlzVlVGQlF5eFBRVUZFTEVWQlFXRTdRVUZEZGtNc1ZVRkJUU3hUUVVGVExESkRRVUZ2UWl4UFFVRndRaXhGUVVFMlFpeHJRa0ZCTjBJc1JVRkJhVVFzY1VKQlFXcEVMRU5CUVdZN1FVRkRRU3hoUVVGUExFOUJRVkFzUjBGQmFVSXNUMEZCYWtJN08wRkJSVUVzYVVKQlFWY3NTVUZCV0N4RFFVRm5RaXhGUVVGRkxHZENRVUZHTEVWQlFWY3NVVUZCVVN4SlFVRkpMRTFCUVVvc1EwRkJWeXhOUVVGWUxFTkJRVzVDTEVWQlFXaENPMEZCUTBRc1MwRk1SRHRCUVUxRU96dEJRVVZFTEZkQlFWTXNaMEpCUVZRc1EwRkJNRUlzVDBGQk1VSXNSVUZCYlVNc1ZVRkJReXhMUVVGRUxFVkJRVmM3UVVGRE5VTXNVVUZCVFN4cFFrRkJhVUlzVFVGQlRTeE5RVUZPTEVOQlFXRXNXVUZCWWl4RFFVRXdRaXhoUVVFeFFpeERRVUYyUWp0QlFVTkJMRkZCUVVrc2EwSkJRV3RDTEcxQ1FVRnRRaXhKUVVGNlF5eEZRVUVyUXp0QlFVTTNReXhWUVVGTkxFdEJRVXNzVFVGQlRTeE5RVUZPTEVOQlFXRXNXVUZCWWl4RFFVRXdRaXhoUVVFeFFpeERRVUZZTzBGQlEwRXNWVUZCVFN4VlFVRlZMRk5CUVZNc1lVRkJWQ3hEUVVGMVFpeEZRVUYyUWl4RFFVRm9RanM3UVVGRlFTeFZRVUZOTEZsQlFWa3NWMEZCVnl4SlFVRllMRU5CUVdkQ08wRkJRVUVzWlVGQlN5eEZRVUZGTEU5QlFVWXNTMEZCWXl4UFFVRnVRanRCUVVGQkxFOUJRV2hDTEVOQlFXeENPenRCUVVWQkxGVkJRVWtzUTBGQlF5eFRRVUZNTEVWQlFXZENPMEZCUTJRN1FVRkRSRHM3UVVGRlJEdEJRVU5CTEZsQlFVMHNUVUZCVGl4RFFVRmhMRWxCUVdJN08wRkJSVUVzWjBKQlFWVXNUVUZCVml4RFFVRnBRaXhKUVVGcVFqdEJRVU5FTzBGQlEwWXNSMEZxUWtRN08wRkJiVUpCTEZOQlFVOHNUVUZCVUR0QlFVTkVMRU5CY0ZOakxFVkJRV1k3TzJ0Q1FYTlRaU3hOT3pzN096czdPenM3T3pzN08wRkRNVk5tT3pzN08wRkJRMEU3T3pzN1FVRkRRVHM3T3pzN096czdLMlZCVUVFN096czdPenM3UVVGVFFTeEpRVUZOTEZOQlFWVXNXVUZCVFRzN1FVRkZjRUk3T3pzN096dEJRVTFCTEUxQlFVMHNUMEZCVHl4UlFVRmlPMEZCUTBFc1RVRkJUU3h4UWtGQmNVSTdRVUZEZWtJc1lVRkJVeXhKUVVSblFqdEJRVVY2UWl4WFFVRlBMRWxCUm10Q08wRkJSM3BDTEdGQlFWTXNTVUZJWjBJN1FVRkpla0lzWjBKQlFWa3NTVUZLWVR0QlFVdDZRaXhWUVVGTkxFbEJURzFDTzBGQlRYcENMR0ZCUVZNc1EwRkRVRHRCUVVORkxGbEJRVTBzVVVGRVVqdEJRVVZGTEdWQlFWTXNTVUZHV0R0QlFVZEZMR0ZCUVU4N1FVRklWQ3hMUVVSUE8wRkJUbWRDTEVkQlFUTkNPMEZCWTBFc1RVRkJUU3gzUWtGQmQwSXNRMEZETlVJc1dVRkVORUlzUTBGQk9VSTdPMEZCU1VFN096czdPenRCUVROQ2IwSXNUVUZwUTJRc1RVRnFRMk03UVVGQlFUczdRVUZ0UTJ4Q0xITkNRVUV3UWp0QlFVRkJMRlZCUVdRc1QwRkJZeXgxUlVGQlNpeEZRVUZKT3p0QlFVRkJPenRCUVVONFFpeFZRVUZOTEZkQlFWY3NTMEZEYWtJc2EwUkJSR2xDTEVkQlJXWXNORU5CUm1Vc1IwRkhZaXc0UWtGSVlTeEhRVWxZTERaQ1FVcFhMRWRCUzFRc1owTkJURk1zUjBGTldDeFJRVTVYTEVkQlQxZ3NNa0pCVUZjc1IwRlJWQ3hUUVZKVExFZEJVMVFzYlVOQlZGTXNSMEZWVUN4elEwRldUeXhIUVZkTUxHOURRVmhMTEVkQldWQXNVVUZhVHl4SFFXRlVMRkZCWWxNc1IwRmpXQ3hSUVdSWExFZEJaVmdzTmtKQlpsY3NSMEZuUWxnc1VVRm9RbGNzUjBGcFFtSXNVVUZxUW1Fc1IwRnJRbVlzVVVGc1FtVXNSMEZ0UW1wQ0xGRkJia0pCT3p0QlFYRkNRU3hWUVVGSkxFTkJRVU1zVFVGQlRTeFBRVUZPTEVOQlFXTXNVVUZCVVN4UFFVRjBRaXhEUVVGTUxFVkJRWEZETzBGQlEyNURMR2RDUVVGUkxFOUJRVklzUjBGQmEwSXNVVUZCVVN4VlFVRlNMRWRCUVhGQ0xHMUNRVUZ0UWl4UFFVRjRReXhIUVVGclJDeEZRVUZ3UlR0QlFVTkVPenRCUVhoQ2RVSXNhMGhCTUVKc1FpeFBRVEZDYTBJc1JVRXdRbFFzVVVFeFFsTTdPMEZCTkVKNFFpeFpRVUZMTEU5QlFVd3NSMEZCWlN4SlFVRm1PMEZCTlVKM1FqdEJRVFpDZWtJN08wRkJhRVZwUWp0QlFVRkJPMEZCUVVFc05rSkJhMFZZTzBGQlEwdzdPMEZCUlVFc1lVRkJTeXhQUVVGTUxFZEJRV1VzYjBKQlFWa3NSVUZCUXl4VFFVRlRMRXRCUVVzc1ZVRkJUQ3hIUVVGclFpeGhRVUZzUWl4RFFVRm5ReXhUUVVGb1F5eERRVUZXTEVWQlFWb3NRMEZCWmp0QlFVTkJMR0ZCUVVzc1QwRkJUQ3hEUVVGaExFOUJRV0lzUTBGQmNVSXNTVUZCY2tJN1FVRkRSRHRCUVhaRmFVSTdRVUZCUVR0QlFVRkJMRFpDUVhsRldEdEJRVU5NT3p0QlFVVkJMR0ZCUVVzc1QwRkJUQ3hEUVVGaExFOUJRV0lzUTBGQmNVSXNTMEZCY2tJN1FVRkRRU3hoUVVGTExFOUJRVXdzUjBGQlpTeEpRVUZtTzBGQlEwUTdRVUU1UldsQ08wRkJRVUU3UVVGQlFTeHRRMEZuUmtVN1FVRkRiRUlzWlVGQlR5eEpRVUZRTzBGQlEwUTdRVUZzUm1sQ08wRkJRVUU3UVVGQlFTeHZRMEZ2Umtjc1QwRndSa2dzUlVGdlJsazdRVUZETlVJc1pVRkJUeXhKUVVGSkxFMUJRVW9zUTBGQlZ5eFBRVUZZTEVOQlFWQTdRVUZEUkR0QlFYUkdhVUk3TzBGQlFVRTdRVUZCUVRzN1FVRjVSbkJDT3pzN096czdPMEZCUzBFc1RVRkJUU3hoUVVGaExFVkJRVzVDTzBGQlEwRXNUVUZCVFN4VlFVRlZMRk5CUVZNc1owSkJRVlFzVDBGQk9FSXNaMEpCUVU4c1ZVRkJVQ3hGUVVFNVFpeERRVUZvUWpzN1FVRkZRU3hOUVVGSkxFOUJRVW9zUlVGQllUdEJRVU5ZTEZWQlFVMHNTVUZCVGl4RFFVRlhMRTlCUVZnc1JVRkJiMElzVDBGQmNFSXNRMEZCTkVJc1ZVRkJReXhQUVVGRUxFVkJRV0U3UVVGRGRrTXNWVUZCVFN4VFFVRlRMREpEUVVGdlFpeFBRVUZ3UWl4RlFVRTJRaXhyUWtGQk4wSXNSVUZCYVVRc2NVSkJRV3BFTEVOQlFXWTdRVUZEUVN4aFFVRlBMRTlCUVZBc1IwRkJhVUlzVDBGQmFrSTdPMEZCUlVFc1ZVRkJTU3hQUVVGUExFbEJRVkFzUzBGQlowSXNTVUZCY0VJc1JVRkJNRUk3UVVGRGVFSTdRVUZEUVN4dFFrRkJWeXhKUVVGWUxFTkJRV2RDTEVsQlFVa3NUVUZCU2l4RFFVRlhMRTFCUVZnc1EwRkJhRUk3UVVGRFJEdEJRVU5HTEV0QlVrUTdRVUZUUkRzN1FVRkZSQ3hYUVVGVExHZENRVUZVTEVOQlFUQkNMRTlCUVRGQ0xFVkJRVzFETEZWQlFVTXNTMEZCUkN4RlFVRlhPMEZCUXpWRExGRkJRVTBzYVVKQlFXbENMRTFCUVUwc1RVRkJUaXhEUVVGaExGbEJRV0lzUTBGQk1FSXNZVUZCTVVJc1EwRkJka0k3UVVGRFFTeFJRVUZKTEd0Q1FVRnJRaXh0UWtGQmJVSXNTVUZCZWtNc1JVRkJLME03UVVGRE4wTXNWVUZCVFN4TFFVRkxMRTFCUVUwc1RVRkJUaXhEUVVGaExGbEJRV0lzUTBGQk1FSXNZVUZCTVVJc1EwRkJXRHRCUVVOQkxGVkJRVTBzVlVGQlZTeFRRVUZUTEdGQlFWUXNRMEZCZFVJc1JVRkJka0lzUTBGQmFFSTdPMEZCUlVFc1ZVRkJUU3haUVVGWkxGZEJRVmNzU1VGQldDeERRVUZuUWp0QlFVRkJMR1ZCUVVzc1JVRkJSU3hQUVVGR0xFdEJRV01zVDBGQmJrSTdRVUZCUVN4UFFVRm9RaXhEUVVGc1FqczdRVUZGUVN4VlFVRkpMRU5CUVVNc1UwRkJUQ3hGUVVGblFqdEJRVU5rTzBGQlEwUTdPMEZCUlVRN1FVRkRRU3haUVVGTkxFMUJRVTRzUTBGQllTeEpRVUZpT3p0QlFVVkJMR2RDUVVGVkxFMUJRVllzUTBGQmFVSXNTVUZCYWtJN1FVRkRSRHRCUVVOR0xFZEJha0pFT3p0QlFXMUNRU3hUUVVGUExFMUJRVkE3UVVGRFJDeERRV3BKWXl4RlFVRm1PenRyUWtGdFNXVXNUVHM3T3pzN096czdPenM3T3p0QlEzWkpaanM3T3p0QlFVTkJPenM3T3pzN096c3JaVUZPUVRzN096czdPenRCUVZGQkxFbEJRVTBzVTBGQlZTeFpRVUZOT3p0QlFVVndRanM3T3pzN08wRkJUVUVzVFVGQlRTeFBRVUZQTEZGQlFXSTdRVUZEUVN4TlFVRk5MSEZDUVVGeFFqdEJRVU42UWl4aFFVRlRMRWxCUkdkQ08wRkJSWHBDTEZkQlFVOHNTVUZHYTBJN1FVRkhla0lzWVVGQlV5eEpRVWhuUWp0QlFVbDZRaXhuUWtGQldTeEpRVXBoTzBGQlMzcENMRlZCUVUwc1NVRk1iVUk3UVVGTmVrSXNZVUZCVXl4RFFVTlFPMEZCUTBVc1dVRkJUU3hSUVVSU08wRkJSVVVzWlVGQlV5eEpRVVpZTzBGQlIwVXNZVUZCVHp0QlFVaFVMRXRCUkU4c1JVRk5VRHRCUVVORkxGbEJRVTBzU1VGRVVqdEJRVVZGTEdWQlFWTXNTVUZHV0R0QlFVZEZMR0ZCUVU4N1FVRklWQ3hMUVU1UE8wRkJUbWRDTEVkQlFUTkNPMEZCYlVKQkxFMUJRVTBzZDBKQlFYZENMRU5CUXpWQ0xGbEJSRFJDTEVOQlFUbENPenRCUVVsQk96czdPenM3UVVGb1EyOUNMRTFCYzBOa0xFMUJkRU5qTzBGQlFVRTdPMEZCZDBOc1FpeHpRa0ZCTUVJN1FVRkJRU3hWUVVGa0xFOUJRV01zZFVWQlFVb3NSVUZCU1RzN1FVRkJRVHM3UVVGRGVFSXNWVUZCVFN4WFFVRlhMRXRCUTJwQ0xHdEVRVVJwUWl4SFFVVm1MRFJEUVVabExFZEJSMklzT0VKQlNHRXNSMEZKV0N3MlFrRktWeXhIUVV0VUxHZERRVXhUTEVkQlRWZ3NVVUZPVnl4SFFVOVlMREpDUVZCWExFZEJVVlFzVTBGU1V5eEhRVk5VTEcxRVFWUlRMRWRCVlZnc1VVRldWeXhIUVZkWUxEWkNRVmhYTEVkQldWZ3NVVUZhVnl4SFFXRmlMRkZCWW1Fc1IwRmpaaXhSUVdSbExFZEJaV3BDTEZGQlprRTdPMEZCYVVKQkxGVkJRVWtzUTBGQlF5eE5RVUZOTEU5QlFVNHNRMEZCWXl4UlFVRlJMRTlCUVhSQ0xFTkJRVXdzUlVGQmNVTTdRVUZEYmtNc1owSkJRVkVzVDBGQlVpeEhRVUZyUWl4dFFrRkJiVUlzVDBGQmNrTTdRVUZEUkRzN1FVRndRblZDTERaSFFYTkNiRUlzVDBGMFFtdENMRVZCYzBKVUxGRkJkRUpUTzBGQmRVSjZRanM3UVVFdlJHbENPMEZCUVVFN1FVRkJRU3cyUWtGcFJWZzdRVUZEVER0QlFVTkJMR0ZCUVVzc1owSkJRVXc3UVVGRFJEdEJRWEJGYVVJN1FVRkJRVHRCUVVGQkxEWkNRWE5GV0R0QlFVTk1PMEZCUTBFc1lVRkJTeXhuUWtGQlREdEJRVU5FTzBGQmVrVnBRanRCUVVGQk8wRkJRVUVzYVVOQk1rVlFPMEZCUTFRc1pVRkJUeXhMUVVGTExFOUJRVXdzUTBGQllTeFBRVUZpTEVOQlFYRkNMR0ZCUVhKQ0xFTkJRVzFETEdWQlFXNURMRU5CUVZBN1FVRkRSRHRCUVRkRmFVSTdRVUZCUVR0QlFVRkJMSGxEUVN0RlF6dEJRVU5xUWl4aFFVRkxMR1ZCUVV3c1EwRkJjVUlzUlVGQlJTeFJRVUZSTEV0QlFVc3NVVUZCVEN4RlFVRldMRVZCUVRKQ0xFOUJRVThzVDBGQmJFTXNSVUZCY2tJN1FVRkRSRHRCUVdwR2FVSTdRVUZCUVR0QlFVRkJMSGxEUVcxR1F6dEJRVU5xUWl4aFFVRkxMR2xDUVVGTUxFTkJRWFZDTEVWQlFVVXNVVUZCVVN4TFFVRkxMRkZCUVV3c1JVRkJWaXhGUVVFeVFpeFBRVUZQTEU5QlFXeERMRVZCUVhaQ08wRkJRMFE3UVVGeVJtbENPMEZCUVVFN1FVRkJRU3h4UTBGMVJrZ3NTMEYyUmtjc1JVRjFSa2s3UVVGRGNFSXNXVUZCU1N4TlFVRk5MRTFCUVU0c1MwRkJhVUlzUzBGQlN5eFJRVUZNTEVWQlFYSkNMRVZCUVhORE8wRkJRM0JETzBGQlEwUTdPMEZCUlVRc2RVaEJRWEZDTEV0QlFYSkNPMEZCUTBRN1FVRTNSbWxDTzBGQlFVRTdRVUZCUVN4elEwRXJSbEU3UVVGQlFTeFpRVUZhTEV0QlFWa3NkVVZCUVVvc1JVRkJTVHM3UVVGRGVFSXNZVUZCU3l4UlFVRk1MRWRCUVdkQ0xFdEJRV2hDTEVkQlFYZENMRXRCUVhoQ08wRkJRMFE3UVVGcVIybENPMEZCUVVFN1FVRkJRU3h6UTBGdFIwWTdRVUZEWkN4bFFVRlBMRXRCUVVzc1VVRkJUQ3hIUVVGblFpeExRVUYyUWp0QlFVTkVPMEZCY2tkcFFqdEJRVUZCTzBGQlFVRXNiVU5CZFVkRk8wRkJRMnhDTEdWQlFVOHNTVUZCVUR0QlFVTkVPMEZCZWtkcFFqdEJRVUZCTzBGQlFVRXNiME5CTWtkSExFOUJNMGRJTEVWQk1rZFpPMEZCUXpWQ0xHVkJRVThzU1VGQlNTeE5RVUZLTEVOQlFWY3NUMEZCV0N4RFFVRlFPMEZCUTBRN1FVRTNSMmxDT3p0QlFVRkJPMEZCUVVFN08wRkJaMGh3UWpzN096czdPenRCUVV0QkxFMUJRVTBzWVVGQllTeEZRVUZ1UWp0QlFVTkJMRTFCUVUwc1ZVRkJWU3hUUVVGVExHZENRVUZVTEU5QlFUaENMR2RDUVVGUExGVkJRVkFzUlVGQk9VSXNRMEZCYUVJN08wRkJSVUVzVFVGQlNTeFBRVUZLTEVWQlFXRTdRVUZEV0N4VlFVRk5MRWxCUVU0c1EwRkJWeXhQUVVGWUxFVkJRVzlDTEU5QlFYQkNMRU5CUVRSQ0xGVkJRVU1zVDBGQlJDeEZRVUZoTzBGQlEzWkRMRlZCUVUwc1UwRkJVeXd5UTBGQmIwSXNUMEZCY0VJc1JVRkJOa0lzYTBKQlFUZENMRVZCUVdsRUxIRkNRVUZxUkN4RFFVRm1PMEZCUTBFc1lVRkJUeXhQUVVGUUxFZEJRV2xDTEU5QlFXcENPenRCUVVWQkxGVkJRVWtzVDBGQlR5eEpRVUZRTEV0QlFXZENMRWxCUVhCQ0xFVkJRVEJDTzBGQlEzaENPMEZCUTBFc2JVSkJRVmNzU1VGQldDeERRVUZuUWl4SlFVRkpMRTFCUVVvc1EwRkJWeXhOUVVGWUxFTkJRV2hDTzBGQlEwUTdRVUZEUml4TFFWSkVPMEZCVTBRN08wRkJSVVFzVjBGQlV5eG5Ra0ZCVkN4RFFVRXdRaXhQUVVFeFFpeEZRVUZ0UXl4VlFVRkRMRXRCUVVRc1JVRkJWenRCUVVNMVF5eFJRVUZOTEdsQ1FVRnBRaXhOUVVGTkxFMUJRVTRzUTBGQllTeFpRVUZpTEVOQlFUQkNMR0ZCUVRGQ0xFTkJRWFpDTzBGQlEwRXNVVUZCU1N4clFrRkJhMElzYlVKQlFXMUNMRWxCUVhwRExFVkJRU3RETzBGQlF6ZERMRlZCUVUwc1MwRkJTeXhOUVVGTkxFMUJRVTRzUTBGQllTeFpRVUZpTEVOQlFUQkNMR0ZCUVRGQ0xFTkJRVmc3UVVGRFFTeFZRVUZOTEZWQlFWVXNVMEZCVXl4aFFVRlVMRU5CUVhWQ0xFVkJRWFpDTEVOQlFXaENPenRCUVVWQkxGVkJRVTBzV1VGQldTeFhRVUZYTEVsQlFWZ3NRMEZCWjBJN1FVRkJRU3hsUVVGTExFVkJRVVVzVDBGQlJpeExRVUZqTEU5QlFXNUNPMEZCUVVFc1QwRkJhRUlzUTBGQmJFSTdPMEZCUlVFc1ZVRkJTU3hEUVVGRExGTkJRVXdzUlVGQlowSTdRVUZEWkR0QlFVTkVPenRCUVVWRU8wRkJRMEVzV1VGQlRTeE5RVUZPTEVOQlFXRXNTVUZCWWpzN1FVRkZRU3huUWtGQlZTeE5RVUZXTEVOQlFXbENMRWxCUVdwQ08wRkJRMFE3UVVGRFJpeEhRV3BDUkRzN1FVRnRRa0VzVTBGQlR5eE5RVUZRTzBGQlEwUXNRMEY0U21Nc1JVRkJaanM3YTBKQk1FcGxMRTA3T3pzN096czdPenM3T3pzN1FVTTNTbVk3T3pzN1FVRkRRVHM3T3p0QlFVTkJPenRCUVVOQk96czdPenM3T3pzclpVRlNRVHM3T3pzN096dEJRVlZCTEVsQlFVMHNWMEZCV1N4WlFVRk5PMEZCUTNSQ096czdPenM3UVVGTlFTeE5RVUZOTEU5QlFVOHNWVUZCWWp0QlFVTkJMRTFCUVUwc1ZVRkJWU3hQUVVGb1FqdEJRVU5CTEUxQlFVMHNjVUpCUVhGQ08wRkJRM3BDTEdGQlFWTXNTVUZFWjBJN1FVRkZla0lzWVVGQlV5eEpRVVpuUWp0QlFVZDZRaXhaUVVGUk8wRkJTR2xDTEVkQlFUTkNPMEZCUzBFc1RVRkJUU3gzUWtGQmQwSXNRMEZETlVJc1UwRkVORUlzUlVGRk5VSXNVVUZHTkVJc1EwRkJPVUk3TzBGQlMwRTdPenM3T3p0QlFXNUNjMElzVFVGNVFtaENMRkZCZWtKblFqdEJRVUZCT3p0QlFUSkNjRUlzZDBKQlFUQkNPMEZCUVVFc1ZVRkJaQ3hQUVVGakxIVkZRVUZLTEVWQlFVazdPMEZCUVVFN08wRkJRVUVzYzBoQlEyeENMRWxCUkd0Q0xFVkJRMW9zVDBGRVdTeEZRVU5JTEd0Q1FVUkhMRVZCUTJsQ0xFOUJSR3BDTEVWQlF6QkNMSEZDUVVReFFpeEZRVU5wUkN4TFFVUnFSQ3hGUVVOM1JDeExRVVI0UkRzN1FVRkhlRUlzVlVGQlRTeFhRVUZYTEUxQlFVc3NUMEZCVEN4RFFVRmhMRTlCUVdJc1EwRkJjVUlzWVVGQmNrSXNRMEZCYlVNc2FVSkJRVzVETEVOQlFXcENPMEZCUTBFc1ZVRkJUU3hQUVVGUExFMUJRVXNzVjBGQlRDeERRVUZwUWl4UlFVRnFRaXhEUVVGaU96dEJRVVZCTEZsQlFVc3NWMEZCVEN4RFFVRnBRaXhMUVVGTExFdEJRWFJDTEVWQlFUWkNMRXRCUVVzc1NVRkJiRU1zUlVGQmQwTXNTMEZCZUVNN1FVRk9kMEk3UVVGUGVrSTdPMEZCYkVOdFFqdEJRVUZCTzBGQlFVRXNiME5CYjBOeFF6dEJRVUZCTEZsQlFUZERMRXRCUVRaRExIVkZRVUZ5UXl4RlFVRnhRenM3UVVGQlFUczdRVUZCUVN4WlFVRnFReXhKUVVGcFF5eDFSVUZCTVVJc1NVRkJNRUk3UVVGQlFTeFpRVUZ3UWl4WFFVRnZRaXgxUlVGQlRpeEpRVUZOT3p0QlFVTjJSQ3haUVVGSkxFTkJRVU1zUzBGQlN5eFBRVUZNTEVOQlFXRXNUMEZCYkVJc1JVRkJNa0k3UVVGRGVrSXNhVUpCUVU4c1MwRkJVRHRCUVVORU96dEJRVVZFTEZsQlFVa3NZMEZCWXl4SlFVRnNRanRCUVVOQkxHRkJRVXNzVDBGQlRDeERRVUZoTEU5QlFXSXNRMEZCY1VJc1lVRkJja0lzUTBGQmJVTXNaVUZCYmtNc1JVRkJiMFFzVTBGQmNFUXNSMEZCWjBVc1NVRkJhRVU3UVVGRFFTeGhRVUZMTEU5QlFVd3NRMEZCWVN4UFFVRmlMRU5CUVhGQ0xHRkJRWEpDTEVOQlFXMURMSE5DUVVGdVF5eEZRVUV5UkN4TFFVRXpSQ3hIUVVGdFJTeExRVUZ1UlRzN1FVRkZRU3haUVVGTkxGRkJRVkVzUzBGQlN5eFBRVUZNTEVOQlFXRXNUMEZCWWl4RFFVRnhRaXhuUWtGQmNrSXNRMEZCYzBNc1QwRkJkRU1zUzBGQmEwUXNSVUZCYUVVN1FVRkRRU3haUVVGSkxGbEJRVmtzUzBGQmFFSTdPMEZCUlVFc1kwRkJUU3hKUVVGT0xFTkJRVmNzUzBGQldDeEZRVUZyUWl4UFFVRnNRaXhEUVVFd1FpeFZRVUZETEVsQlFVUXNSVUZCVlR0QlFVTnNReXhqUVVGSkxFdEJRVXNzVTBGQlRDeERRVUZsTEZGQlFXWXNRMEZCZDBJc1ZVRkJlRUlzUTBGQlNpeEZRVUY1UXp0QlFVTjJReXhwUWtGQlN5eFRRVUZNTEVOQlFXVXNUVUZCWml4RFFVRnpRaXhWUVVGMFFqdEJRVU5FT3p0QlFVVkVMR05CUVUwc1QwRkJUeXhQUVVGTExGZEJRVXdzUTBGQmFVSXNTVUZCYWtJc1EwRkJZanM3UVVGRlFTeGpRVUZKTEZWQlFWVXNTMEZCU3l4TFFVRnVRaXhGUVVFd1FqdEJRVU40UWl4blFrRkJTU3hEUVVGRExFdEJRVXNzVTBGQlRDeERRVUZsTEZGQlFXWXNRMEZCZDBJc1ZVRkJlRUlzUTBGQlRDeEZRVUV3UXp0QlFVTjRReXh0UWtGQlN5eFRRVUZNTEVOQlFXVXNSMEZCWml4RFFVRnRRaXhWUVVGdVFqdEJRVU5FT3p0QlFVVkVMREJDUVVGakxFdEJRVXNzU1VGQmJrSTdRVUZEUVN4M1FrRkJXU3hKUVVGYU8wRkJRMFE3UVVGRFJpeFRRV1pFT3p0QlFXbENRU3haUVVGSkxHVkJRV1VzVTBGQmJrSXNSVUZCT0VJN1FVRkROVUlzWlVGQlN5eFBRVUZNTEVOQlFXRXNUMEZCWWl4RFFVRnhRaXhoUVVGeVFpeERRVUZ0UXl4bFFVRnVReXhGUVVGdlJDeFRRVUZ3UkN4SFFVRm5SU3hYUVVGb1JUdEJRVU5FTEZOQlJrUXNUVUZGVHl4SlFVRkpMR1ZCUVdVc1EwRkJReXhUUVVGd1FpeEZRVUVyUWp0QlFVTndReXhuUWtGQlRTeEpRVUZKTEV0QlFVb3NRMEZCWVN4SlFVRmlMSEZDUVVGcFF5eExRVUZxUXl3MFEwRkJUanRCUVVORU96dEJRVVZFTEdWQlFVOHNTVUZCVUR0QlFVTkVPMEZCZUVWdFFqdEJRVUZCTzBGQlFVRXNiME5CTUVWT08wRkJRMW9zWlVGQlR5eExRVUZMTEU5QlFVd3NRMEZCWVN4UFFVRmlMRU5CUVhGQ0xHRkJRWEpDTEVOQlFXMURMSE5DUVVGdVF5eEZRVUV5UkN4TFFVRnNSVHRCUVVORU8wRkJOVVZ0UWp0QlFVRkJPMEZCUVVFc2IwTkJPRVZMTzBGQlFVRXNXVUZCWWl4SlFVRmhMSFZGUVVGT0xFbEJRVTA3TzBGQlEzWkNMRmxCUVVrc1QwRkJUeXhGUVVGWU8wRkJRMEVzV1VGQlNTeFJRVUZSTEVWQlFWbzdPMEZCUlVFc1dVRkJTU3hKUVVGS0xFVkJRVlU3UVVGRFVpeHBRa0ZCVHl4TFFVRkxMRmxCUVV3c1EwRkJhMElzVjBGQmJFSXNTMEZCYTBNc1MwRkJTeXhUUVVFNVF6czdRVUZGUVN4alFVRk5MRzFDUVVGdFFpeExRVUZMTEdGQlFVd3NRMEZCYlVJc1QwRkJia0lzUTBGQmVrSTdRVUZEUVN4alFVRkpMR2RDUVVGS0xFVkJRWE5DTzBGQlEzQkNMRzFDUVVGUExHbENRVUZwUWl4VFFVRjRRanRCUVVORU96dEJRVVZFTEd0Q1FVRlJMRXRCUVVzc1dVRkJUQ3hEUVVGclFpeFpRVUZzUWl4TFFVRnRReXhGUVVFelF6dEJRVU5FT3p0QlFVVkVMR1ZCUVU4c1JVRkJSU3hWUVVGR0xFVkJRVkVzV1VGQlVpeEZRVUZRTzBGQlEwUTdRVUU1Um0xQ08wRkJRVUU3UVVGQlFTeHhRMEZuUjB3c1MwRm9SMHNzUlVGblIwVTdRVUZEY0VJc1dVRkJTU3hOUVVGTkxFbEJRVTRzUzBGQlpTeHBRa0ZCVFN4TFFVRjZRaXhGUVVGblF6dEJRVU01UWl4alFVRk5MRmRCUVZjc09FSkJRV3RDTEUxQlFVMHNUVUZCZUVJc1JVRkJaME1zVlVGQmFFTXNRMEZCYWtJN08wRkJSVUU3T3pzN1FVRkpRU3hqUVVGSkxFTkJRVU1zVVVGQlJDeEpRVUZoTEdGQlFXRXNTMEZCU3l4VlFVRk1MRVZCUVRsQ0xFVkJRV2xFTzBGQlF5OURMR2xDUVVGTExFbEJRVXc3UVVGRFJEdEJRVVZHTEZOQldFUXNUVUZYVHl4SlFVRkpMRTFCUVUwc1NVRkJUaXhMUVVGbExFOUJRVzVDTEVWQlFUUkNPMEZCUTJwRExHTkJRVTBzVDBGQlR5dzRRa0ZCYTBJc1RVRkJUU3hOUVVGNFFpeEZRVUZuUXl4TlFVRm9ReXhEUVVGaU96dEJRVVZCTEdOQlFVa3NTVUZCU2l4RlFVRlZPMEZCUTFJc1owSkJRVWtzUzBGQlN5eFRRVUZNTEVOQlFXVXNVVUZCWml4RFFVRjNRaXhWUVVGNFFpeERRVUZLTEVWQlFYbERPMEZCUTNaRE8wRkJRMFE3TzBGQlJVUXNaMEpCUVUwc1YwRkJWeXhMUVVGTExGZEJRVXdzUTBGQmFVSXNTVUZCYWtJc1EwRkJha0k3TzBGQlJVRXNaMEpCUVVrc1MwRkJTeXhYUVVGTUxFOUJRWFZDTEZOQlFWTXNTMEZCY0VNc1JVRkJNa003UVVGRGVrTTdRVUZEUVN4dFFrRkJTeXhYUVVGTUxFTkJRV2xDTEZOQlFWTXNTMEZCTVVJc1JVRkJhVU1zVTBGQlV5eEpRVUV4UXl4RlFVRm5SQ3hMUVVGb1JEdEJRVU5CTEd0Q1FVRk5MRk5CUVZNc1JVRkJSU3hWUVVGR0xFVkJRVkVzVFVGQlRTeFRRVUZUTEVsQlFYWkNMRVZCUVRaQ0xFOUJRVThzVTBGQlV5eExRVUUzUXl4RlFVRm1PMEZCUTBFc2JVSkJRVXNzV1VGQlRDeERRVUZyUWl4cFFrRkJUU3hoUVVGNFFpeEZRVUYxUXl4TlFVRjJRenRCUVVORU96dEJRVVZFTEdsQ1FVRkxMRWxCUVV3N1FVRkRRVHRCUVVORU96dEJRVVZFTzBGQlEwRXNZMEZCVFN4bFFVRmxMRGhDUVVGclFpeE5RVUZOTEUxQlFYaENMRVZCUVdkRExHVkJRV2hETEVOQlFYSkNPMEZCUTBFc1kwRkJTU3haUVVGS0xFVkJRV3RDTzBGQlEyaENPMEZCUTBRN08wRkJSVVFzWlVGQlN5eE5RVUZNTzBGQlEwUTdRVUZEUmp0QlFYcEpiVUk3UVVGQlFUdEJRVUZCTEN0Q1FUSkpXRHRCUVVOUUxGbEJRVWtzUzBGQlN5eFBRVUZNTEVOQlFXRXNUMEZCWWl4RFFVRnhRaXhUUVVGeVFpeERRVUVyUWl4UlFVRXZRaXhEUVVGM1F5eFJRVUY0UXl4RFFVRktMRVZCUVhWRU8wRkJRM0pFTEdsQ1FVRlBMRXRCUVVzc1NVRkJUQ3hGUVVGUU8wRkJRMFE3TzBGQlJVUXNaVUZCVHl4TFFVRkxMRWxCUVV3c1JVRkJVRHRCUVVORU8wRkJha3B0UWp0QlFVRkJPMEZCUVVFc05rSkJiVXBpTzBGQlEwd3NXVUZCU1N4TFFVRkxMRTlCUVV3c1EwRkJZU3hQUVVGaUxFTkJRWEZDTEZOQlFYSkNMRU5CUVN0Q0xGRkJRUzlDTEVOQlFYZERMRkZCUVhoRExFTkJRVW9zUlVGQmRVUTdRVUZEY2tRc2FVSkJRVThzUzBGQlVEdEJRVU5FT3p0QlFVVkVMR0ZCUVVzc1QwRkJUQ3hEUVVGaExFOUJRV0lzUTBGQmNVSXNVMEZCY2tJc1EwRkJLMElzUjBGQkwwSXNRMEZCYlVNc1VVRkJia003TzBGQlJVRXNXVUZCVFN4bFFVRmxMRXRCUVVzc1QwRkJUQ3hEUVVGaExFOUJRV0lzUTBGQmNVSXNZVUZCY2tJc1EwRkJiVU1zWjBKQlFXNURMRU5CUVhKQ096dEJRVVZCTzBGQlEwRXNjVUpCUVdFc1UwRkJZaXhIUVVGNVFpeERRVUY2UWpzN1FVRkZRU3hoUVVGTExGbEJRVXdzUTBGQmEwSXNhVUpCUVUwc1NVRkJlRUk3UVVGRFFTeGhRVUZMTEZsQlFVd3NRMEZCYTBJc2FVSkJRVTBzUzBGQmVFSTdPMEZCUlVFc1lVRkJTeXhsUVVGTUxFTkJRWEZDTEVWQlFVVXNVVUZCVVN4WlFVRldMRVZCUVhkQ0xFOUJRVThzVDBGQkwwSXNSVUZCY2tJN1FVRkRRU3hoUVVGTExHVkJRVXdzUTBGQmNVSXNSVUZCUlN4UlFVRlJMRk5CUVZNc1NVRkJia0lzUlVGQmVVSXNUMEZCVHl4cFFrRkJUU3hMUVVGMFF5eEZRVUZ5UWpzN1FVRkZRU3hsUVVGUExFbEJRVkE3UVVGRFJEdEJRWFJMYlVJN1FVRkJRVHRCUVVGQkxEWkNRWGRMWWp0QlFVTk1MRmxCUVVrc1EwRkJReXhMUVVGTExFOUJRVXdzUTBGQllTeFBRVUZpTEVOQlFYRkNMRk5CUVhKQ0xFTkJRU3RDTEZGQlFTOUNMRU5CUVhkRExGRkJRWGhETEVOQlFVd3NSVUZCZDBRN1FVRkRkRVFzYVVKQlFVOHNTMEZCVUR0QlFVTkVPenRCUVVWRUxHRkJRVXNzVDBGQlRDeERRVUZoTEU5QlFXSXNRMEZCY1VJc1UwRkJja0lzUTBGQkswSXNUVUZCTDBJc1EwRkJjME1zVVVGQmRFTTdPMEZCUlVFc1lVRkJTeXhaUVVGTUxFTkJRV3RDTEdsQ1FVRk5MRWxCUVhoQ08wRkJRMEVzWVVGQlN5eFpRVUZNTEVOQlFXdENMR2xDUVVGTkxFMUJRWGhDT3p0QlFVVkJMR0ZCUVVzc2FVSkJRVXdzUTBGQmRVSXNSVUZCUlN4UlFVRlJMRXRCUVVzc1QwRkJUQ3hEUVVGaExFOUJRV0lzUTBGQmNVSXNZVUZCY2tJc1EwRkJiVU1zWjBKQlFXNURMRU5CUVZZc1JVRkJaMFVzVDBGQlR5eFBRVUYyUlN4RlFVRjJRanRCUVVOQkxHRkJRVXNzYVVKQlFVd3NRMEZCZFVJc1JVRkJSU3hSUVVGUkxGTkJRVk1zU1VGQmJrSXNSVUZCZVVJc1QwRkJUeXhwUWtGQlRTeExRVUYwUXl4RlFVRjJRanM3UVVGRlFTeGxRVUZQTEVsQlFWQTdRVUZEUkR0QlFYUk1iVUk3UVVGQlFUdEJRVUZCTEcxRFFYZE1RVHRCUVVOc1FpeGxRVUZQTEVsQlFWQTdRVUZEUkR0QlFURk1iVUk3UVVGQlFUdEJRVUZCTEc5RFFUUk1ReXhQUVRWTVJDeEZRVFJNVlR0QlFVTTFRaXcyUjBGQk1rSXNVVUZCTTBJc1JVRkJjVU1zVDBGQmNrTTdRVUZEUkR0QlFUbE1iVUk3TzBGQlFVRTdRVUZCUVRzN1FVRnBUWFJDT3pzN096czdPMEZCUzBFc1RVRkJUU3hoUVVGaExFVkJRVzVDT3p0QlFVVkJMRTFCUVUwc1dVRkJXU3hUUVVGVExHZENRVUZVTEU5QlFUaENMRWxCUVRsQ0xFTkJRV3hDTzBGQlEwRXNUVUZCU1N4VFFVRktMRVZCUVdVN1FVRkRZaXhWUVVGTkxFbEJRVTRzUTBGQlZ5eFRRVUZZTEVWQlFYTkNMRTlCUVhSQ0xFTkJRVGhDTEZWQlFVTXNUMEZCUkN4RlFVRmhPMEZCUTNwRExGVkJRVTBzVTBGQlV5d3lRMEZCYjBJc1QwRkJjRUlzUlVGQk5rSXNhMEpCUVRkQ0xFVkJRV2xFTEhGQ1FVRnFSQ3hEUVVGbU8wRkJRMEVzWVVGQlR5eFBRVUZRTEVkQlFXbENMRTlCUVdwQ096dEJRVVZCTEZWQlFVa3NRMEZCUXl4UFFVRlBMRTFCUVZvc1JVRkJiMEk3UVVGRGJFSXNiVUpCUVZjc1NVRkJXQ3hEUVVGblFpeEpRVUZKTEZGQlFVb3NRMEZCWVN4TlFVRmlMRU5CUVdoQ08wRkJRMFE3UVVGRFJpeExRVkJFTzBGQlVVUTdPMEZCUlVRc1YwRkJVeXhuUWtGQlZDeERRVUV3UWl4UFFVRXhRaXhGUVVGdFF5eFZRVUZETEV0QlFVUXNSVUZCVnp0QlFVTTFReXhSUVVGTkxHVkJRV1VzT0VKQlFXdENMRTFCUVUwc1RVRkJlRUlzUlVGQlowTXNaVUZCYUVNc1EwRkJja0k3UVVGRFFTeFJRVUZKTEZsQlFVb3NSVUZCYTBJN1FVRkRhRUk3UVVGRFJEczdRVUZGUkN4UlFVRk5MRmRCUVZjc09FSkJRV3RDTEUxQlFVMHNUVUZCZUVJc1JVRkJaME1zVlVGQmFFTXNRMEZCYWtJN08wRkJSVUVzVVVGQlNTeFJRVUZLTEVWQlFXTTdRVUZEV2l4VlFVRk5MR2xDUVVGcFFpeFRRVUZUTEZsQlFWUXNRMEZCYzBJc1lVRkJkRUlzUTBGQmRrSTdRVUZEUVN4VlFVRkpMR3RDUVVGclFpeHRRa0ZCYlVJc1NVRkJja01zU1VGQk5rTXNVVUZCYWtRc1JVRkJNa1E3UVVGRGVrUXNXVUZCVFN4WlFVRlpMRmRCUVZjc1NVRkJXQ3hEUVVGblFqdEJRVUZCTEdsQ1FVRkxMRVZCUVVVc1ZVRkJSaXhQUVVGdFFpeFJRVUY0UWp0QlFVRkJMRk5CUVdoQ0xFTkJRV3hDT3p0QlFVVkJMRmxCUVVrc1EwRkJReXhUUVVGTUxFVkJRV2RDTzBGQlEyUTdRVUZEUkRzN1FVRkZSQ3hyUWtGQlZTeE5RVUZXTzBGQlEwUTdRVUZEUmp0QlFVTkdMRWRCY0VKRU96dEJRWE5DUVN4VFFVRlBMRkZCUVZBN1FVRkRSQ3hEUVROUFowSXNSVUZCYWtJN08ydENRVFpQWlN4Uk96czdPenM3T3pzN096czdPMEZEYkZCbU96czdPMEZCUTBFN08wRkJRMEU3T3pzN096czdPeXRsUVZCQk96czdPenM3TzBGQlUwRXNTVUZCVFN4cFFrRkJhMElzV1VGQlRUczdRVUZGTlVJN096czdPenRCUVUxQkxFMUJRVTBzVDBGQlR5eG5Ra0ZCVXl4VlFVRlVMRVZCUVdJN1FVRkRRU3hOUVVGTkxIRkNRVUZ4UWp0QlFVTjZRaXhoUVVGVExFbEJSR2RDTzBGQlJYcENMR0ZCUVZNc1NVRkdaMEk3UVVGSGVrSXNXVUZCVVR0QlFVaHBRaXhIUVVFelFqdEJRVXRCTEUxQlFVMHNkMEpCUVhkQ0xFTkJRelZDTEZOQlJEUkNMRVZCUlRWQ0xGRkJSalJDTEVOQlFUbENPenRCUVV0Qk96czdPenM3UVVGdVFqUkNMRTFCZVVKMFFpeGpRWHBDYzBJN1FVRkJRVHM3UVVFeVFqRkNMRGhDUVVFd1FqdEJRVUZCTEZWQlFXUXNUMEZCWXl4MVJVRkJTaXhGUVVGSk96dEJRVUZCT3p0QlFVRkJMR3RKUVVOc1FpeFBRVVJyUWpzN1FVRkhlRUlzV1VGQlN5eHJRa0ZCVEN4SFFVRXdRaXhWUVVGRExFdEJRVVFzUlVGQlZ6dEJRVU51UXl4WlFVRk5MRk5CUVZNc1RVRkJUU3hOUVVGT0xFTkJRV0VzUzBGQk5VSTdPMEZCUlVFc1dVRkJTU3hYUVVGWExFVkJRV1lzUlVGQmJVSTdRVUZEYWtJc1owSkJRVXNzVTBGQlREdEJRVU5CTzBGQlEwUTdPMEZCUjBRc1kwRkJTeXhSUVVGTUxFZEJRV2RDTEU5QlFXaENMRU5CUVhkQ0xGVkJRVU1zU1VGQlJDeEZRVUZWTzBGQlEyaERMR05CUVUwc1MwRkJTeXhQUVVGUExFMUJRVXNzVDBGQlRDeERRVUZoTEZWQlFYQkNMRXRCUVcxRExGVkJRVzVETEVkQlFXZEVMRTFCUVVzc1QwRkJUQ3hEUVVGaExGVkJRVGRFTEVkQlFUQkZMRTFCUVVzc1ZVRkJNVVk3TzBGQlJVRXNZMEZCU1N4SFFVRkhMRTFCUVVnc1JVRkJWeXhKUVVGWUxFTkJRVW9zUlVGQmMwSTdRVUZEY0VJc2FVSkJRVXNzVDBGQlRDeERRVUZoTEV0QlFXSXNRMEZCYlVJc1QwRkJia0lzUjBGQk5rSXNUMEZCTjBJN1FVRkRSQ3hYUVVaRUxFMUJSVTg3UVVGRFRDeHBRa0ZCU3l4UFFVRk1MRU5CUVdFc1MwRkJZaXhEUVVGdFFpeFBRVUZ1UWl4SFFVRTJRaXhOUVVFM1FqdEJRVU5FTzBGQlEwWXNVMEZTUkR0QlFWTkVMRTlCYkVKRU96dEJRVzlDUVN4WlFVRkxMR05CUVV3c1IwRkJjMElzWjBKQlFYUkNMRU5CUVhWRExFOUJRWFpETEVWQlFXZEVMRTFCUVVzc2EwSkJRWEpFTzBGQmRrSjNRanRCUVhkQ2VrSTdPMEZCYmtSNVFqdEJRVUZCTzBGQlFVRXNiVU5CY1VSVE8wRkJRVUVzV1VGQmVFSXNUVUZCZDBJc2RVVkJRV1lzUlVGQlpUdEJRVUZCTEZsQlFWZ3NTVUZCVnl4MVJVRkJTaXhGUVVGSk96dEJRVU5xUXl4WlFVRkpMRXRCUVVzc1MwRkJUQ3hEUVVGWExFOUJRVmdzUTBGQmJVSXNUVUZCYmtJc1NVRkJOa0lzUTBGQlF5eERRVUU1UWl4SlFVTkRMRXRCUVVzc1NVRkJUQ3hEUVVGVkxFOUJRVllzUTBGQmEwSXNUVUZCYkVJc1NVRkJORUlzUTBGQlF5eERRVVJzUXl4RlFVTnhRenRCUVVOdVF5eHBRa0ZCVHl4SlFVRlFPMEZCUTBRN08wRkJSVVFzWlVGQlR5eExRVUZRTzBGQlEwUTdRVUUxUkhsQ08wRkJRVUU3UVVGQlFTeHBRMEU0UkdZN1FVRkJRVHM3UVVGRFZDeFpRVUZKTEZGQlFWRXNUVUZCVFN4SlFVRk9MRU5CUVZjc1MwRkJTeXhQUVVGTUxFTkJRV0VzVDBGQllpeERRVUZ4UWl4blFrRkJja0lzUTBGQmMwTXNUMEZCZEVNc1MwRkJhMFFzUlVGQk4wUXNRMEZCV2p0QlFVTkJMR2RDUVVGUkxFMUJRVTBzUjBGQlRpeERRVUZWTEZWQlFVTXNTVUZCUkN4RlFVRlZPMEZCUXpGQ0xHTkJRVTBzVDBGQlR5eFBRVUZMTEZkQlFVd3NRMEZCYVVJc1NVRkJha0lzUTBGQllqdEJRVU5CTEdsQ1FVRlBMRVZCUVVVc1RVRkJUU3hMUVVGTExFbEJRV0lzUlVGQmJVSXNUMEZCVHl4TFFVRkxMRXRCUVM5Q0xFVkJRWE5ETEZOQlFWTXNTVUZCTDBNc1JVRkJVRHRCUVVORUxGTkJTRThzUTBGQlVqczdRVUZMUVN4bFFVRlBMRXRCUVZBN1FVRkRSRHRCUVhSRmVVSTdRVUZCUVR0QlFVRkJMR3REUVhkRlpEdEJRVU5XTEdGQlFVc3NVVUZCVEN4SFFVRm5RaXhQUVVGb1FpeERRVUYzUWl4VlFVRkRMRWxCUVVRc1JVRkJWVHRCUVVOb1F5eGpRVUZOTEVsQlFVa3NTVUZCVmp0QlFVTkJMRmxCUVVVc1QwRkJSaXhEUVVGVkxFdEJRVllzUTBGQlowSXNUMEZCYUVJc1IwRkJNRUlzVDBGQk1VSTdRVUZEUkN4VFFVaEVPMEZCU1VRN1FVRTNSWGxDTzBGQlFVRTdRVUZCUVN4MVEwRXJSVlE3UVVGRFppeGxRVUZQTEV0QlFVc3NUMEZCVEN4RFFVRmhMRTlCUVdJc1EwRkJjVUlzWVVGQmNrSXNRMEZCYlVNc2MwSkJRVzVETEVOQlFWQTdRVUZEUkR0QlFXcEdlVUk3UVVGQlFUdEJRVUZCTERaQ1FXMUdia0k3UVVGRFRDeHJTVUZCYTBJN1FVRkRhRUk3UVVGRFFTeGxRVUZMTEdOQlFVd3NSMEZCYzBJc1MwRkJkRUlzUjBGQk9FSXNSVUZCT1VJN1FVRkRRVHRCUVVOQkxHVkJRVXNzVTBGQlREdEJRVU5FTzBGQlEwWTdRVUV4Um5sQ08wRkJRVUU3UVVGQlFTeHZRMEUwUmt3c1QwRTFSa3NzUlVFMFJrazdRVUZETlVJc1pVRkJUeXhKUVVGSkxHTkJRVW9zUTBGQmJVSXNUMEZCYmtJc1EwRkJVRHRCUVVORU8wRkJPVVo1UWpzN1FVRkJRVHRCUVVGQk96dEJRV2xITlVJN096czdPenM3UVVGTFFTeE5RVUZOTEdGQlFXRXNSVUZCYmtJN1FVRkRRU3hOUVVGTkxGbEJRVmtzVTBGQlV5eG5Ra0ZCVkN4UFFVRTRRaXhKUVVFNVFpeERRVUZzUWpzN1FVRkZRU3hOUVVGSkxGTkJRVW9zUlVGQlpUdEJRVU5pTEZWQlFVMHNTVUZCVGl4RFFVRlhMRk5CUVZnc1JVRkJjMElzVDBGQmRFSXNRMEZCT0VJc1ZVRkJReXhQUVVGRUxFVkJRV0U3UVVGRGVrTXNWVUZCVFN4VFFVRlRMREpEUVVGdlFpeFBRVUZ3UWl4RlFVRTJRaXhyUWtGQk4wSXNSVUZCYVVRc2NVSkJRV3BFTEVOQlFXWTdRVUZEUVN4aFFVRlBMRTlCUVZBc1IwRkJhVUlzVDBGQmFrSTdPMEZCUlVFc1ZVRkJTU3hQUVVGUExFMUJRVmdzUlVGQmJVSTdRVUZEYWtJN1FVRkRRU3h0UWtGQlZ5eEpRVUZZTEVOQlFXZENMRWxCUVVrc1kwRkJTaXhEUVVGdFFpeE5RVUZ1UWl4RFFVRm9RanRCUVVORU8wRkJRMFlzUzBGU1JEdEJRVk5FT3p0QlFVVkVMRTFCUVVrc1UwRkJTaXhGUVVGbE8wRkJRMklzWVVGQlV5eG5Ra0ZCVkN4RFFVRXdRaXhQUVVFeFFpeEZRVUZ0UXl4VlFVRkRMRXRCUVVRc1JVRkJWenRCUVVNMVF5eFZRVUZOTEdWQlFXVXNPRUpCUVd0Q0xFMUJRVTBzVFVGQmVFSXNSVUZCWjBNc1pVRkJhRU1zUTBGQmNrSTdRVUZEUVN4VlFVRkpMRmxCUVVvc1JVRkJhMEk3UVVGRGFFSTdRVUZEUkRzN1FVRkZSQ3hWUVVGTkxGZEJRVmNzT0VKQlFXdENMRTFCUVUwc1RVRkJlRUlzUlVGQlowTXNWVUZCYUVNc1EwRkJha0k3TzBGQlJVRXNWVUZCU1N4UlFVRktMRVZCUVdNN1FVRkRXaXhaUVVGTkxHbENRVUZwUWl4VFFVRlRMRmxCUVZRc1EwRkJjMElzWVVGQmRFSXNRMEZCZGtJN1FVRkRRU3haUVVGSkxHdENRVUZyUWl4dFFrRkJiVUlzU1VGQmNrTXNTVUZCTmtNc1VVRkJha1FzUlVGQk1rUTdRVUZEZWtRc1kwRkJUU3haUVVGWkxGZEJRVmNzU1VGQldDeERRVUZuUWp0QlFVRkJMRzFDUVVGTExFVkJRVVVzVlVGQlJpeFBRVUZ0UWl4UlFVRjRRanRCUVVGQkxGZEJRV2hDTEVOQlFXeENPenRCUVVWQkxHTkJRVWtzUTBGQlF5eFRRVUZNTEVWQlFXZENPMEZCUTJRN1FVRkRSRHM3UVVGRlJDeHZRa0ZCVlN4TlFVRldPMEZCUTBRN1FVRkRSanRCUVVOR0xFdEJjRUpFTzBGQmNVSkVPenRCUVVWRUxGTkJRVThzWTBGQlVEdEJRVU5FTEVOQk9VbHpRaXhGUVVGMlFqczdhMEpCWjBwbExHTTdPenM3T3pzN096czdPenM3UVVOd1NtWTdPenM3T3pzN096czdLMlZCVEVFN096czdPenM3UVVGUFFTeEpRVUZOTEZOQlFWVXNXVUZCVFR0QlFVTndRanM3T3pzN08wRkJUVUVzVFVGQlRTeFBRVUZQTEZGQlFXSTdRVUZEUVN4TlFVRk5MRlZCUVZVc1QwRkJhRUk3UVVGRFFTeE5RVUZOTEhGQ1FVRnhRanRCUVVONlFpeGhRVUZUTEVsQlJHZENPMEZCUlhwQ0xGZEJRVThzU1VGR2EwSTdRVUZIZWtJc1ZVRkJUVHRCUVVodFFpeEhRVUV6UWp0QlFVdEJMRTFCUVUwc2QwSkJRWGRDTEVWQlFUbENPenRCUVVWQk96czdPenM3UVVGb1FtOUNMRTFCYzBKa0xFMUJkRUpqTzBGQlFVRTdPMEZCZDBKc1FpeHpRa0ZCTUVJN1FVRkJRU3hWUVVGa0xFOUJRV01zZFVWQlFVb3NSVUZCU1RzN1FVRkJRVHM3UVVGSGVFSTdRVUZJZDBJc2EwaEJRMnhDTEVsQlJHdENMRVZCUTFvc1QwRkVXU3hGUVVOSUxHdENRVVJITEVWQlEybENMRTlCUkdwQ0xFVkJRekJDTEhGQ1FVUXhRaXhGUVVOcFJDeExRVVJxUkN4RlFVTjNSQ3hMUVVSNFJEczdRVUZKZUVJc1ZVRkJUU3huUWtGQlowSXNUVUZCU3l4VlFVRk1MRVZCUVhSQ08wRkJRMEVzVlVGQlNTeFBRVUZQTEUxQlFVc3NUMEZCVEN4RFFVRmhMRXRCUVhCQ0xFdEJRVGhDTEZGQlFUbENMRWxCUTBNc1EwRkJReXhqUVVGakxGTkJRV1FzUTBGQmQwSXNVVUZCZUVJc1dVRkJNRU1zVFVGQlN5eFBRVUZNTEVOQlFXRXNTMEZCZGtRc1EwRkVUaXhGUVVOMVJUdEJRVU55UlN4elFrRkJZeXhUUVVGa0xFTkJRWGRDTEVkQlFYaENMRmxCUVhGRExFMUJRVXNzVDBGQlRDeERRVUZoTEV0QlFXeEVPMEZCUTBRN08wRkJSVVFzV1VGQlN5eFZRVUZNTEVkQlFXdENMRTFCUVVzc1QwRkJUQ3hEUVVGaExFbEJRV0lzUzBGQmMwSXNTVUZCZUVNN1FVRldkMEk3UVVGWGVrSTdPMEZCYmtOcFFqdEJRVUZCTzBGQlFVRXNjME5CY1VOR08wRkJRMlFzV1VGQlNTeERRVUZETEV0QlFVc3NWVUZCVml4RlFVRnpRanRCUVVOd1FpeGpRVUZOTEU5QlFVOHNTMEZCU3l4UFFVRk1MRU5CUVdFc1QwRkJZaXhEUVVGeFFpeHhRa0ZCY2tJc1JVRkJZanRCUVVOQkxHbENRVUZQTEV0QlFVc3NUVUZCV2p0QlFVTkVPenRCUVVWRUxHVkJRVThzUzBGQlN5eFBRVUZNTEVOQlFXRXNTVUZCY0VJN1FVRkRSRHRCUVRWRGFVSTdRVUZCUVR0QlFVRkJMRzFEUVRoRFREdEJRVU5ZTEdWQlFVOHNTMEZCU3l4UFFVRk1MRU5CUVdFc1QwRkJZaXhEUVVGeFFpeGhRVUZ5UWl4RFFVRnRReXhwUWtGQmJrTXNRMEZCVUR0QlFVTkVPMEZCYUVScFFqdEJRVUZCTzBGQlFVRXNOa0pCYTBSWU8wRkJRMHdzV1VGQlNTeExRVUZMTEU5QlFVd3NRMEZCWVN4UFFVRmlMRU5CUVhGQ0xGTkJRWEpDTEVOQlFTdENMRkZCUVM5Q0xFTkJRWGRETEUxQlFYaERMRU5CUVVvc1JVRkJjVVE3UVVGRGJrUXNaVUZCU3l4UFFVRk1MRU5CUVdFc1QwRkJZaXhEUVVGeFFpeFRRVUZ5UWl4RFFVRXJRaXhOUVVFdlFpeERRVUZ6UXl4TlFVRjBRenRCUVVORU96dEJRVVZFTEZsQlFVMHNUMEZCVHl4TFFVRkxMR0ZCUVV3c1JVRkJZanRCUVVOQkxHRkJRVXNzVDBGQlRDeERRVUZoTEVsQlFXSXNSMEZCYjBJc1NVRkJjRUk3TzBGQlJVRXNXVUZCU1N4TFFVRkxMRlZCUVZRc1JVRkJjVUk3UVVGRGJrSXNaVUZCU3l4UFFVRk1MRU5CUVdFc1QwRkJZaXhEUVVGeFFpeExRVUZ5UWl4RFFVRXlRaXhMUVVFelFpeEhRVUZ6UXl4TFFVRkxMRTlCUVV3c1EwRkJZU3hKUVVGdVJEdEJRVU5CTEdWQlFVc3NUMEZCVEN4RFFVRmhMRTlCUVdJc1EwRkJjVUlzUzBGQmNrSXNRMEZCTWtJc1RVRkJNMElzUjBGQmRVTXNTMEZCU3l4UFFVRk1MRU5CUVdFc1NVRkJjRVE3TzBGQlJVRXNZMEZCVFN4blFrRkJaMElzUzBGQlN5eFZRVUZNTEVWQlFYUkNPMEZCUTBFc2QwSkJRV01zUzBGQlpDeERRVUZ2UWl4TFFVRndRaXhIUVVFclFpeExRVUZMTEU5QlFVd3NRMEZCWVN4SlFVRTFRenRCUVVOQkxIZENRVUZqTEV0QlFXUXNRMEZCYjBJc1RVRkJjRUlzUjBGQlowTXNTMEZCU3l4UFFVRk1MRU5CUVdFc1NVRkJOME03UVVGRFJEczdRVUZGUkN4bFFVRlBMRWxCUVZBN1FVRkRSRHRCUVhCRmFVSTdRVUZCUVR0QlFVRkJMR2REUVhORllUdEJRVUZCTEZsQlFYWkNMR05CUVhWQ0xIVkZRVUZPTEVsQlFVMDdPMEZCUXpkQ0xGbEJRVWtzWTBGQlNpeEZRVUZ2UWp0QlFVTnNRaXhsUVVGTExFbEJRVXc3UVVGRFJDeFRRVVpFTEUxQlJVODdRVUZEVEN4bFFVRkxMRWxCUVV3N1FVRkRSRHM3UVVGRlJDeFpRVUZOTEdkQ1FVRm5RaXhMUVVGTExGVkJRVXdzUlVGQmRFSTdPMEZCUlVFc1dVRkJTU3hyUWtGRFJpeERRVUZETEdOQlFXTXNVMEZCWkN4RFFVRjNRaXhSUVVGNFFpeERRVUZwUXl4NVFrRkJha01zUTBGRVNDeEZRVU5uUlR0QlFVTTVSQ3gzUWtGQll5eFRRVUZrTEVOQlFYZENMRWRCUVhoQ0xFTkJRVFJDTEhsQ1FVRTFRanRCUVVOQkxHbENRVUZQTEVsQlFWQTdRVUZEUkRzN1FVRkZSQ3haUVVGSkxFTkJRVU1zWTBGQlJDeEpRVU5HTEdOQlFXTXNVMEZCWkN4RFFVRjNRaXhSUVVGNFFpeERRVUZwUXl4NVFrRkJha01zUTBGRVJpeEZRVU1yUkR0QlFVTTNSQ3gzUWtGQll5eFRRVUZrTEVOQlFYZENMRTFCUVhoQ0xFTkJRU3RDTEhsQ1FVRXZRanRCUVVORU96dEJRVVZFTEdWQlFVOHNTVUZCVUR0QlFVTkVPMEZCTTBacFFqdEJRVUZCTzBGQlFVRXNOa0pCTmtaWU8wRkJRMHdzV1VGQlNTeERRVUZETEV0QlFVc3NUMEZCVEN4RFFVRmhMRTlCUVdJc1EwRkJjVUlzVTBGQmNrSXNRMEZCSzBJc1VVRkJMMElzUTBGQmQwTXNUVUZCZUVNc1EwRkJUQ3hGUVVGelJEdEJRVU53UkN4bFFVRkxMRTlCUVV3c1EwRkJZU3hQUVVGaUxFTkJRWEZDTEZOQlFYSkNMRU5CUVN0Q0xFZEJRUzlDTEVOQlFXMURMRTFCUVc1RE8wRkJRMFE3TzBGQlJVUXNaVUZCVHl4SlFVRlFPMEZCUTBRN1FVRnVSMmxDTzBGQlFVRTdRVUZCUVN4dFEwRnhSMFU3UVVGRGJFSXNaVUZCVHl4SlFVRlFPMEZCUTBRN1FVRjJSMmxDTzBGQlFVRTdRVUZCUVN4dlEwRjVSMGNzVDBGNlIwZ3NSVUY1UjFrN1FVRkROVUlzZVVkQlFUSkNMRTFCUVROQ0xFVkJRVzFETEU5QlFXNURPMEZCUTBRN1FVRXpSMmxDT3p0QlFVRkJPMEZCUVVFN08wRkJPRWR3UWl4VFFVRlBMRTFCUVZBN1FVRkRSQ3hEUVM5SFl5eEZRVUZtT3p0clFrRnBTR1VzVFRzN096czdPenM3T3pzN096dEJRMjVJWmpzN096dEJRVU5CT3pzN096czdPenM3T3l0bFFVNUJPenM3T3pzN08wRkJVVUVzU1VGQlRTeGxRVUZuUWl4WlFVRk5PMEZCUXpGQ096czdPenM3UVVGTlFTeE5RVUZOTEU5QlFVOHNZMEZCWWp0QlFVTkJMRTFCUVUwc1ZVRkJWU3hQUVVGb1FqdEJRVU5CTEUxQlFVMHNjVUpCUVhGQ08wRkJRM3BDTEdGQlFWTXNTVUZFWjBJN1FVRkZla0lzWVVGQlV5eEZRVVpuUWp0QlFVZDZRaXhuUWtGQldTeEpRVWhoTzBGQlNYcENMR0ZCUVZNc1NVRktaMEk3UVVGTGVrSXNaMEpCUVZrN1FVRk1ZU3hIUVVFelFqdEJRVTlCTEUxQlFVMHNkMEpCUVhkQ0xFTkJRelZDTEZOQlJEUkNMRU5CUVRsQ096dEJRVWxCT3pzN096czdRVUZ3UWpCQ0xFMUJNRUp3UWl4WlFURkNiMEk3UVVGQlFUczdRVUUwUW5oQ0xEUkNRVUV3UWp0QlFVRkJMRlZCUVdRc1QwRkJZeXgxUlVGQlNpeEZRVUZKT3p0QlFVRkJPenRCUVVGQkxEaElRVU5zUWl4SlFVUnJRaXhGUVVOYUxFOUJSRmtzUlVGRFNDeHJRa0ZFUnl4RlFVTnBRaXhQUVVScVFpeEZRVU13UWl4eFFrRkVNVUlzUlVGRGFVUXNTVUZFYWtRc1JVRkRkVVFzUzBGRWRrUTdPMEZCUjNoQ0xGbEJRVXNzVVVGQlRDeEhRVUZuUWl4TFFVTm9RaXcwUWtGRVowSXNSMEZGWkN4clEwRkdZeXhIUVVkYUxEWkNRVWhaTEVkQlNWb3NjVVpCU2xrc1IwRkxWaXg1UTBGTVZTeEhRVTFhTEZkQlRsa3NSMEZQWkN4UlFWQmpMRWRCVVdoQ0xGRkJVa0U3TzBGQlZVRXNWVUZCU1N4TlFVRkxMR05CUVZRc1JVRkJlVUk3UVVGRGRrSXNZMEZCU3l4TFFVRk1PMEZCUTBRN08wRkJSVVFzV1VGQlN5eGxRVUZNTEVkQlFYVkNMRWxCUVhaQ08wRkJha0ozUWp0QlFXdENla0k3TzBGQk9VTjFRanRCUVVGQk8wRkJRVUVzT0VKQlowUm9RanRCUVVOT0xGbEJRVTBzVlVGQlZTeFRRVUZUTEdGQlFWUXNRMEZCZFVJc1MwRkJka0lzUTBGQmFFSTdPMEZCUlVFc1owSkJRVkVzVTBGQlVpeEhRVUZ2UWl4TFFVRkxMRkZCUVhwQ096dEJRVVZCTEdGQlFVc3NUMEZCVEN4RFFVRmhMRTlCUVdJc1IwRkJkVUlzVVVGQlVTeFZRVUV2UWpzN1FVRkZRVHRCUVVOQkxHRkJRVXNzVDBGQlRDeERRVUZoTEU5QlFXSXNRMEZCY1VJc1lVRkJja0lzUTBGQmJVTXNWVUZCYmtNc1JVRkJLME1zVTBGQkwwTXNSMEZCTWtRc1MwRkJTeXhQUVVGTUxFTkJRV0VzVDBGQmVFVTdPMEZCUlVFc1dVRkJTU3hEUVVGRExFdEJRVXNzVDBGQlRDeERRVUZoTEZWQlFXeENMRVZCUVRoQ08wRkJRelZDTEdWQlFVc3NUMEZCVEN4RFFVRmhMRTlCUVdJc1EwRkJjVUlzWVVGQmNrSXNRMEZCYlVNc1VVRkJia01zUlVGQk5rTXNTMEZCTjBNc1EwRkJiVVFzVDBGQmJrUXNSMEZCTmtRc1RVRkJOMFE3UVVGRFJEczdRVUZGUkN4cFFrRkJVeXhKUVVGVUxFTkJRV01zVjBGQlpDeERRVUV3UWl4TFFVRkxMRTlCUVV3c1EwRkJZU3hQUVVGMlF6czdRVUZGUVN4aFFVRkxMR0ZCUVV3N1FVRkRSRHRCUVdwRmRVSTdRVUZCUVR0QlFVRkJMRFpDUVcxRmFrSTdRVUZCUVRzN1FVRkRUQ3haUVVGSkxFdEJRVXNzVDBGQlRDeERRVUZoTEU5QlFXSXNTMEZCZVVJc1NVRkJOMElzUlVGQmJVTTdRVUZEYWtNN1FVRkRRU3hsUVVGTExFdEJRVXc3UVVGRFJEczdRVUZGUkN4WlFVRkpMRXRCUVVzc1QwRkJUQ3hEUVVGaExFOUJRV0lzUTBGQmNVSXNVMEZCY2tJc1EwRkJLMElzVVVGQkwwSXNRMEZCZDBNc1RVRkJlRU1zUTBGQlNpeEZRVUZ4UkR0QlFVTnVSQ3hwUWtGQlR5eExRVUZRTzBGQlEwUTdPMEZCUlVRN1FVRkRRU3haUVVGSkxFdEJRVXNzVDBGQlRDeERRVUZoTEZWQlFXcENMRVZCUVRaQ08wRkJRek5DTEdWQlFVc3NUMEZCVEN4RFFVRmhMRTlCUVdJc1EwRkJjVUlzWlVGQmNrSXNRMEZCY1VNc1QwRkJja003UVVGRFFTeGxRVUZMTEU5QlFVd3NRMEZCWVN4UFFVRmlMRU5CUVhGQ0xGbEJRWEpDTEVOQlFXdERMRTlCUVd4RExFVkJRVEpETEdOQlFUTkRPenRCUVVWQkxHVkJRVXNzVDBGQlRDeERRVUZoTEU5QlFXSXNRMEZCY1VJc1UwRkJja0lzUTBGQkswSXNSMEZCTDBJc1UwRkJlVU1zUzBGQlN5eFBRVUZNTEVOQlFXRXNWVUZCZEVRN1FVRkRRU3hsUVVGTExFOUJRVXdzUTBGQllTeFBRVUZpTEVOQlFYRkNMR0ZCUVhKQ0xFTkJRVzFETEZGQlFXNURMRVZCUVRaRExGTkJRVGRETEVOQlFYVkVMRWRCUVhaRUxGVkJRV3RGTEV0QlFVc3NUMEZCVEN4RFFVRmhMRlZCUVM5Rk8wRkJRMFE3TzBGQlJVUXNXVUZCU1N4TFFVRkxMRTlCUVV3c1EwRkJZU3hWUVVGcVFpeEZRVUUyUWp0QlFVTXpRanRCUVVOQkxHTkJRVTBzWjBKQlFXZENMRXRCUVVzc1QwRkJUQ3hEUVVGaExFOUJRV0lzUTBGQmNVSXNZVUZCY2tJc1EwRkJiVU1zVVVGQmJrTXNRMEZCZEVJN1FVRkRRU3hsUVVGTExHVkJRVXdzUTBGQmNVSXNSVUZCUlN4UlFVRlJMR0ZCUVZZc1JVRkJlVUlzVDBGQlR5eFBRVUZvUXl4RlFVRnlRanRCUVVORU96dEJRVVZFTEcxQ1FVRlhMRmxCUVUwN1FVRkRaaXhwUWtGQlN5eFBRVUZNTEVOQlFXRXNUMEZCWWl4RFFVRnhRaXhUUVVGeVFpeERRVUVyUWl4SFFVRXZRaXhEUVVGdFF5eE5RVUZ1UXpzN1FVRkZRVHRCUVVOQkxHTkJRVTBzYzBKQlFYTkNMRk5CUVZNc1owSkJRVlFzUTBGQk1FSXNiMEpCUVRGQ0xFdEJRVzFFTEVWQlFTOUZPMEZCUTBFc1kwRkJTU3hsUVVGbExFTkJRVzVDTzBGQlEwRXNPRUpCUVc5Q0xFOUJRWEJDTEVOQlFUUkNMRlZCUVVNc1dVRkJSQ3hGUVVGclFqdEJRVU0xUXl4blFrRkJTU3hQUVVGTExFOUJRVXdzUTBGQllTeFBRVUZpTEV0QlFYbENMRmxCUVRkQ0xFVkJRVEpETzBGQlEzcERMR3RDUVVGTkxGRkJRVkVzYVVKQlFXbENMRmxCUVdwQ0xFTkJRV1E3UVVGRFFTdzRRa0ZCWjBJc1lVRkJZU3haUVVGaUxFZEJRVFJDTEZOQlFWTXNUVUZCVFN4WlFVRm1MRVZCUVRaQ0xFVkJRVGRDTEVOQlFUVkRPMEZCUTBRN1FVRkRSaXhYUVV4RU96dEJRVTlCTEdsQ1FVRkxMRTlCUVV3c1EwRkJZU3hQUVVGaUxFTkJRWEZDTEV0QlFYSkNMRU5CUVRKQ0xGTkJRVE5DTEcxQ1FVRnhSQ3haUVVGeVJEczdRVUZGUVN4cFFrRkJTeXhaUVVGTUxFTkJRV3RDTEdsQ1FVRk5MRWxCUVhoQ096dEJRVVZCTEdOQlFVMHNWVUZCVlN4VFFVRldMRTlCUVZVc1IwRkJUVHRCUVVOd1FpeHRRa0ZCU3l4WlFVRk1MRU5CUVd0Q0xHbENRVUZOTEV0QlFYaENPMEZCUTBFc2JVSkJRVXNzVDBGQlRDeERRVUZoTEU5QlFXSXNRMEZCY1VJc2JVSkJRWEpDTEVOQlFYbERMR2xDUVVGTkxHTkJRUzlETEVWQlFTdEVMRTlCUVM5RU8wRkJRMFFzVjBGSVJEczdRVUZMUVN4cFFrRkJTeXhQUVVGTUxFTkJRV0VzVDBGQllpeERRVUZ4UWl4blFrRkJja0lzUTBGQmMwTXNhVUpCUVUwc1kwRkJOVU1zUlVGQk5FUXNUMEZCTlVRN1FVRkZSQ3hUUVhoQ1JDeEZRWGRDUnl4RFFYaENTRHM3UVVFd1FrRXNXVUZCU1N4UFFVRlBMRk5CUVZBc1EwRkJhVUlzUzBGQlN5eFBRVUZNTEVOQlFXRXNUMEZCT1VJc1MwRkJNRU1zUzBGQlN5eFBRVUZNTEVOQlFXRXNUMEZCWWl4SFFVRjFRaXhEUVVGeVJTeEZRVUYzUlR0QlFVTjBSVHRCUVVOQkxHVkJRVXNzWlVGQlRDeEhRVUYxUWl4WFFVRlhMRmxCUVUwN1FVRkRkRU1zYlVKQlFVc3NTVUZCVER0QlFVTkVMRmRCUm5OQ0xFVkJSWEJDTEV0QlFVc3NUMEZCVEN4RFFVRmhMRTlCUVdJc1IwRkJkVUlzUTBGR1NDeERRVUYyUWp0QlFVZEVPenRCUVVWRUxHVkJRVThzU1VGQlVEdEJRVU5FTzBGQk9VaDFRanRCUVVGQk8wRkJRVUVzTmtKQlowbHFRanRCUVVGQk96dEJRVU5NT3pzN08wRkJTVUVzV1VGQlNTeExRVUZMTEdWQlFWUXNSVUZCTUVJN1FVRkRlRUlzZFVKQlFXRXNTMEZCU3l4bFFVRnNRanRCUVVOQkxHVkJRVXNzWlVGQlRDeEhRVUYxUWl4SlFVRjJRanRCUVVORU96dEJRVVZFTEZsQlFVa3NRMEZCUXl4TFFVRkxMRTlCUVV3c1EwRkJZU3hQUVVGaUxFTkJRWEZDTEZOQlFYSkNMRU5CUVN0Q0xGRkJRUzlDTEVOQlFYZERMRTFCUVhoRExFTkJRVXdzUlVGQmMwUTdRVUZEY0VRc2FVSkJRVThzUzBGQlVEdEJRVU5FT3p0QlFVVkVMR0ZCUVVzc1dVRkJUQ3hEUVVGclFpeHBRa0ZCVFN4SlFVRjRRanM3UVVGRlFTeFpRVUZKTEV0QlFVc3NUMEZCVEN4RFFVRmhMRlZCUVdwQ0xFVkJRVFpDTzBGQlF6TkNMR05CUVUwc1owSkJRV2RDTEV0QlFVc3NUMEZCVEN4RFFVRmhMRTlCUVdJc1EwRkJjVUlzWVVGQmNrSXNRMEZCYlVNc1VVRkJia01zUTBGQmRFSTdRVUZEUVN4bFFVRkxMR2xDUVVGTUxFTkJRWFZDTEVWQlFVVXNVVUZCVVN4aFFVRldMRVZCUVhsQ0xFOUJRVThzVDBGQmFFTXNSVUZCZGtJN1FVRkRSRHM3UVVGRlJDeGhRVUZMTEU5QlFVd3NRMEZCWVN4UFFVRmlMRU5CUVhGQ0xGTkJRWEpDTEVOQlFTdENMRTFCUVM5Q0xFTkJRWE5ETEUxQlFYUkRPMEZCUTBFc1lVRkJTeXhQUVVGTUxFTkJRV0VzVDBGQllpeERRVUZ4UWl4VFFVRnlRaXhEUVVFclFpeEhRVUV2UWl4RFFVRnRReXhOUVVGdVF6czdRVUZGUVN4WlFVRk5MRmRCUVZjc1UwRkJXQ3hSUVVGWExFZEJRVTA3UVVGRGNrSXNhVUpCUVVzc1QwRkJUQ3hEUVVGaExFOUJRV0lzUTBGQmNVSXNiVUpCUVhKQ0xFTkJRWGxETEdsQ1FVRk5MR05CUVM5RExFVkJRU3RFTEZGQlFTOUVPMEZCUTBFc2FVSkJRVXNzVDBGQlRDeERRVUZoTEU5QlFXSXNRMEZCY1VJc1UwRkJja0lzUTBGQkswSXNUVUZCTDBJc1EwRkJjME1zVFVGQmRFTTdPMEZCUlVFc2FVSkJRVXNzV1VGQlRDeERRVUZyUWl4cFFrRkJUU3hOUVVGNFFqczdRVUZGUVN4alFVRkpMRTlCUVVzc1kwRkJWQ3hGUVVGNVFqdEJRVU4yUWl4eFFrRkJVeXhKUVVGVUxFTkJRV01zVjBGQlpDeERRVUV3UWl4UFFVRkxMRTlCUVV3c1EwRkJZU3hQUVVGMlF6dEJRVU5CTEcxQ1FVRkxMRTlCUVV3c1EwRkJZU3hQUVVGaUxFZEJRWFZDTEVsQlFYWkNPMEZCUTBRN1FVRkRSaXhUUVZaRU96dEJRVmxCTEdGQlFVc3NUMEZCVEN4RFFVRmhMRTlCUVdJc1EwRkJjVUlzWjBKQlFYSkNMRU5CUVhORExHbENRVUZOTEdOQlFUVkRMRVZCUVRSRUxGRkJRVFZFT3p0QlFVVkJMR1ZCUVU4c1NVRkJVRHRCUVVORU8wRkJka3QxUWp0QlFVRkJPMEZCUVVFc2RVTkJlVXRRTzBGQlEyWXNZVUZCU3l4SlFVRk1PMEZCUTBRN1FVRXpTM1ZDTzBGQlFVRTdRVUZCUVN4dFEwRTJTMG83UVVGRGJFSXNaVUZCVHl4SlFVRlFPMEZCUTBRN1FVRXZTM1ZDTzBGQlFVRTdRVUZCUVN4dlEwRnBURWdzVDBGcVRFY3NSVUZwVEUwN1FVRkROVUlzY1VoQlFUSkNMRmxCUVROQ0xFVkJRWGxETEU5QlFYcERPMEZCUTBRN1FVRnVUSFZDT3p0QlFVRkJPMEZCUVVFN08wRkJjMHd4UWl4VFFVRlBMRmxCUVZBN1FVRkRSQ3hEUVhaTWIwSXNSVUZCY2tJN08ydENRWGxNWlN4Wk96czdPenM3T3pzN096czdPMEZETlV4bU96czdPMEZCUTBFN096czdRVUZEUVRzN1FVRkRRVHM3T3pzN096czdLMlZCVWtFN096czdPenM3UVVGVlFTeEpRVUZOTEZsQlFXRXNXVUZCVFR0QlFVTjJRanM3T3pzN08wRkJUVUVzVFVGQlRTeFBRVUZQTEZsQlFXSTdRVUZEUVN4TlFVRk5MRlZCUVZVc1QwRkJhRUk3UVVGRFFTeE5RVUZOTEc5Q1FVRnZRaXh4UWtGQk1VSTdRVUZEUVN4TlFVRk5MSEZDUVVGeFFqdEJRVU42UWl4aFFVRlRMRWxCUkdkQ08wRkJSWHBDTEZkQlFVODdRVUZEVEN4VlFVRkpMRXRCUkVNN1FVRkZUQ3hWUVVGSkxFdEJSa003UVVGSFRDeFZRVUZKTzBGQlNFTTdRVUZHYTBJc1IwRkJNMEk3UVVGUlFTeE5RVUZOTEhkQ1FVRjNRaXhEUVVNMVFpeFBRVVEwUWl4RFFVRTVRanM3UVVGSlFUczdPenM3TzBGQmRFSjFRaXhOUVRSQ2FrSXNVMEUxUW1sQ08wRkJRVUU3TzBGQk9FSnlRaXg1UWtGQk1FSTdRVUZCUVN4VlFVRmtMRTlCUVdNc2RVVkJRVW9zUlVGQlNUczdRVUZCUVRzN1FVRkJRU3gzU0VGRGJFSXNTVUZFYTBJc1JVRkRXaXhQUVVSWkxFVkJRMGdzYTBKQlJFY3NSVUZEYVVJc1QwRkVha0lzUlVGRE1FSXNjVUpCUkRGQ0xFVkJRMmxFTEV0QlJHcEVMRVZCUTNkRUxFbEJSSGhFT3p0QlFVZDRRaXhaUVVGTExGZEJRVXdzUjBGQmJVSXNTVUZCYmtJN1FVRkRRU3haUVVGTExGbEJRVXdzUjBGQmIwSXNTVUZCY0VJN1FVRkRRU3haUVVGTExFOUJRVXdzUjBGQlpTeEpRVUZtT3p0QlFVVkJMRmxCUVVzc1ZVRkJUQ3hIUVVGclFpeERRVUZETEUxQlFVUXNSVUZCVXl4UFFVRlVMRU5CUVd4Q096dEJRVVZCTEZWQlFVMHNTMEZCU3l4RlFVRkZMRTFCUVUwc1NVRkJVaXhGUVVGakxFOUJRVThzVDBGQlR5eFZRVUZRTEVOQlFXdENMR3RDUVVGc1FpeERRVUZ5UWl4RlFVRllPMEZCUTBFc1ZVRkJUU3hMUVVGTExFVkJRVVVzVFVGQlRTeEpRVUZTTEVWQlFXTXNUMEZCVHl4UFFVRlBMRlZCUVZBc1EwRkJhMElzYjBKQlFXeENMRU5CUVhKQ0xFVkJRVmc3UVVGRFFTeFZRVUZOTEV0QlFVc3NSVUZCUlN4TlFVRk5MRWxCUVZJc1JVRkJZeXhQUVVGUExFOUJRVThzVlVGQlVDeERRVUZyUWl4dlFrRkJiRUlzUTBGQmNrSXNSVUZCV0R0QlFVTkJMRlZCUVUwc1MwRkJTeXhGUVVGRkxFMUJRVTBzU1VGQlVpeEZRVUZqTEU5QlFVOHNUMEZCVHl4VlFVRlFMRU5CUVd0Q0xIRkNRVUZzUWl4RFFVRnlRaXhGUVVGWU96dEJRVVZCTEZsQlFVc3NTMEZCVEN4SFFVRmhMRU5CUVVNc1JVRkJSQ3hGUVVGTExFVkJRVXdzUlVGQlV5eEZRVUZVTEVWQlFXRXNSVUZCWWl4RlFVRnBRaXhQUVVGcVFpeEZRVUZpT3p0QlFVVkJMRmxCUVVzc1kwRkJURHRCUVVOQkxGbEJRVXNzVlVGQlREczdRVUZGUVN4aFFVRlBMR2RDUVVGUUxFTkJRWGRDTEZGQlFYaENMRVZCUVd0RE8wRkJRVUVzWlVGQlRTeE5RVUZMTEZWQlFVd3NSVUZCVGp0QlFVRkJMRTlCUVd4RExFVkJRVEpFTEV0QlFUTkVPMEZCYmtKM1FqdEJRVzlDZWtJN08wRkJiRVJ2UWp0QlFVRkJPMEZCUVVFc2RVTkJiMFJLTzBGQlFVRTdPMEZCUTJZc1lVRkJTeXhWUVVGTUxFTkJRV2RDTEV0QlFXaENMRU5CUVhOQ0xGVkJRVU1zVTBGQlJDeEZRVUZsTzBGQlEyNURMR05CUVVrc1QwRkJTeXhQUVVGTUxFTkJRV0VzVDBGQllpeERRVUZ4UWl4VFFVRnlRaXhEUVVFclFpeFJRVUV2UWl4cFFrRkJjMFFzVTBGQmRFUXNRMEZCU2l4RlFVRjNSVHRCUVVOMFJTeHRRa0ZCU3l4VFFVRk1MRWRCUVdsQ0xGTkJRV3BDTzBGQlEwRXNiVUpCUVU4c1MwRkJVRHRCUVVORU8wRkJRMFFzYVVKQlFVOHNTVUZCVUR0QlFVTkVMRk5CVGtRN1FVRlBSRHRCUVRWRWIwSTdRVUZCUVR0QlFVRkJMRzFEUVRoRVVqdEJRVUZCT3p0QlFVTllMRmxCUVVrc1JVRkJSU3huUWtGQlowSXNUVUZCYkVJc1EwRkJTaXhGUVVFclFqdEJRVU0zUWp0QlFVTkVPenRCUVVWRUxHRkJRVXNzUzBGQlRDeERRVUZYTEV0QlFWZ3NRMEZCYVVJc1ZVRkJReXhKUVVGRUxFVkJRVlU3UVVGRGVrSXNZMEZCVFN4UlFVRlJMRXRCUVVzc1MwRkJUQ3hEUVVGWExFdEJRVmdzUTBGQmFVSXNTMEZCYWtJc1EwRkJkVUlzTUVKQlFYWkNMRU5CUVdRN08wRkJSVUVzWTBGQlNTeExRVUZLTEVWQlFWYzdRVUZEVkN4blFrRkJTU3hMUVVGTExFdEJRVXdzUTBGQlZ5eFBRVUZtTEVWQlFYZENPMEZCUTNSQ0xHdENRVUZKTEU5QlFVc3NXVUZCVEN4TFFVRnpRaXhMUVVGTExFbEJRUzlDTEVWQlFYRkRPMEZCUTI1RExIVkNRVUZMTEZGQlFVd3NRMEZCWXl4TFFVRkxMRWxCUVc1Q08wRkJRMFE3UVVGRFJDeHhRa0ZCU3l4WlFVRk1MRWRCUVc5Q0xFdEJRVXNzU1VGQmVrSTdRVUZEUVN4eFFrRkJUeXhMUVVGUU8wRkJRMFE3UVVGRFJqczdRVUZGUkN4cFFrRkJUeXhKUVVGUU8wRkJRMFFzVTBGa1JEdEJRV1ZFTzBGQmJFWnZRanRCUVVGQk8wRkJRVUVzZDBOQmIwWklPMEZCUTJoQ0xHVkJRVThzZVVoQlFUSkNMRXRCUVVzc1QwRkJUQ3hEUVVGaExFdEJRV0lzUTBGQmJVSXNTMEZCU3l4WlFVRjRRaXhOUVVFd1F5eEpRVUUxUlR0QlFVTkVPMEZCZEVadlFqdEJRVUZCTzBGQlFVRXNLMEpCZDBaYUxFbEJlRVpaTEVWQmQwWk9PMEZCUTJJc1dVRkJUU3hWUVVGVkxGTkJRVk1zU1VGQmVrSTdPMEZCUlVFc1dVRkJTU3hMUVVGTExFOUJRVXdzUTBGQllTeExRVUZpTEVOQlFXMUNMRWxCUVc1Q0xFMUJRVFpDTEVsQlFXcERMRVZCUVhWRE8wRkJRM0pETEdOQlFVa3NRMEZCUXl4UlFVRlJMRk5CUVZJc1EwRkJhMElzVVVGQmJFSXNkVUpCUVN0RExFdEJRVXNzVTBGQmNFUXNRMEZCVEN4RlFVRjFSVHRCUVVOeVJTeHZRa0ZCVVN4VFFVRlNMRU5CUVd0Q0xFZEJRV3hDTEhWQ1FVRXdReXhMUVVGTExGTkJRUzlETzBGQlEwUTdPMEZCUlVRc1pVRkJTeXhYUVVGTUxFZEJRVzFDTEV0QlFXNUNPenRCUVVWQk8wRkJRMEVzWlVGQlN5eFBRVUZNTEVkQlFXVXNTMEZCWmp0QlFVTkJMR1ZCUVVzc1NVRkJURHRCUVVOQk8wRkJRMEVzWlVGQlN5eGpRVUZNTzBGQlEwUXNVMEZhUkN4TlFWbFBPMEZCUTB3c1kwRkJTU3hSUVVGUkxGTkJRVklzUTBGQmEwSXNVVUZCYkVJc2RVSkJRU3RETEV0QlFVc3NVMEZCY0VRc1EwRkJTaXhGUVVGelJUdEJRVU53UlN4dlFrRkJVU3hUUVVGU0xFTkJRV3RDTEUxQlFXeENMSFZDUVVFMlF5eExRVUZMTEZOQlFXeEVPMEZCUTBRN08wRkJSVVFzWlVGQlN5eEpRVUZNTzBGQlEwRXNaVUZCU3l4WFFVRk1MRWRCUVcxQ0xFbEJRVzVDTzBGQlEwRXNaVUZCU3l4UFFVRk1MRWRCUVdVc1NVRkJaanRCUVVORU8wRkJRMFk3UVVGb1NHOUNPMEZCUVVFN1FVRkJRU3h4UTBGclNFNHNTMEZzU0Uwc1JVRnJTRU03UVVGRGNFSXNXVUZCU1N4TlFVRk5MRWxCUVU0c1MwRkJaU3hQUVVGbUxFbEJRVEJDTEUxQlFVMHNUMEZCVGl4TFFVRnJRaXhGUVVFMVF5eEpRVUZyUkN4TlFVRk5MRTlCUVU0c1MwRkJhMElzUlVGQmVFVXNSVUZCTkVVN1FVRkRNVVU3UVVGRFJEczdRVUZGUkR0QlFVTkJMR0ZCUVVzc1NVRkJURHRCUVVORU8wRkJla2h2UWp0QlFVRkJPMEZCUVVFc05rSkJNa2hrTzBGQlFVRTdPMEZCUTB3c1dVRkJTU3hMUVVGTExFOUJRVXdzUTBGQllTeFBRVUZpTEVOQlFYRkNMRk5CUVhKQ0xFTkJRU3RDTEZGQlFTOUNMRU5CUVhkRExFMUJRWGhETEVOQlFVb3NSVUZCY1VRN1FVRkRia1FzYVVKQlFVOHNTMEZCVUR0QlFVTkVPenRCUVVWRU8wRkJRMEVzYlVKQlFWY3NXVUZCVFR0QlFVTm1MR2xDUVVGTExGbEJRVXdzUTBGQmEwSXNhVUpCUVUwc1NVRkJlRUk3TzBGQlJVRXNZMEZCVFN4VlFVRlZMRk5CUVZZc1QwRkJWU3hIUVVGTk8wRkJRM0JDTEcxQ1FVRkxMRmxCUVV3c1EwRkJhMElzYVVKQlFVMHNTMEZCZUVJN08wRkJSVUVzWjBKQlFVa3NUMEZCU3l4UFFVRlVMRVZCUVd0Q08wRkJRMmhDTEhGQ1FVRkxMRTlCUVV3c1EwRkJZU3hQUVVGaUxFTkJRWEZDTEcxQ1FVRnlRaXhEUVVGNVF5eHBRa0ZCVFN4alFVRXZReXhGUVVFclJDeFBRVUV2UkR0QlFVTkJMSEZDUVVGTExFOUJRVXdzUTBGQllTeFBRVUZpTEVOQlFYRkNMRk5CUVhKQ0xFTkJRU3RDTEUxQlFTOUNMRU5CUVhORExGTkJRWFJETzBGQlEwUTdRVUZEUml4WFFWQkVPenRCUVZOQkxHTkJRVWtzVDBGQlN5eFhRVUZVTEVWQlFYTkNPMEZCUTNCQ0xHMUNRVUZMTEdOQlFVdzdRVUZEUkRzN1FVRkhSQ3hqUVVGSkxFOUJRVXNzVDBGQlZDeEZRVUZyUWp0QlFVTm9RaXh0UWtGQlN5eFBRVUZNTEVOQlFXRXNUMEZCWWl4RFFVRnhRaXhuUWtGQmNrSXNRMEZCYzBNc2FVSkJRVTBzWTBGQk5VTXNSVUZCTkVRc1QwRkJOVVE3UVVGRFFTeHRRa0ZCU3l4UFFVRk1MRU5CUVdFc1QwRkJZaXhEUVVGeFFpeFRRVUZ5UWl4RFFVRXJRaXhIUVVFdlFpeERRVUZ0UXl4VFFVRnVRenRCUVVORUxGZEJTRVFzVFVGSFR6dEJRVU5NTzBGQlEwRTdRVUZEUkRzN1FVRkZSQ3hwUWtGQlN5eFBRVUZNTEVOQlFXRXNUMEZCWWl4RFFVRnhRaXhUUVVGeVFpeERRVUVyUWl4SFFVRXZRaXhEUVVGdFF5eE5RVUZ1UXpzN1FVRkZRVHRCUVVOQkxHbENRVUZMTEZsQlFVdzdRVUZEUkN4VFFUZENSQ3hGUVRaQ1J5eERRVGRDU0RzN1FVRXJRa0VzWlVGQlR5eEpRVUZRTzBGQlEwUTdRVUZxUzI5Q08wRkJRVUU3UVVGQlFTdzJRa0Z0UzJRN1FVRkJRVHM3UVVGRFRDeFpRVUZKTEVOQlFVTXNTMEZCU3l4UFFVRk1MRU5CUVdFc1QwRkJZaXhEUVVGeFFpeFRRVUZ5UWl4RFFVRXJRaXhSUVVFdlFpeERRVUYzUXl4TlFVRjRReXhEUVVGTUxFVkJRWE5FTzBGQlEzQkVMR2xDUVVGUExFdEJRVkE3UVVGRFJEczdRVUZGUkN4aFFVRkxMRmxCUVV3c1EwRkJhMElzYVVKQlFVMHNTVUZCZUVJN08wRkJSVUVzWVVGQlN5eFpRVUZNT3p0QlFVVkJMRmxCUVVrc1MwRkJTeXhQUVVGVUxFVkJRV3RDTzBGQlEyaENMR1ZCUVVzc1QwRkJUQ3hEUVVGaExFOUJRV0lzUTBGQmNVSXNVMEZCY2tJc1EwRkJLMElzUjBGQkwwSXNRMEZCYlVNc1UwRkJia003UVVGRFJEczdRVUZGUkN4aFFVRkxMRTlCUVV3c1EwRkJZU3hQUVVGaUxFTkJRWEZDTEZOQlFYSkNMRU5CUVN0Q0xFMUJRUzlDTEVOQlFYTkRMRTFCUVhSRE96dEJRVVZCTEZsQlFVa3NTMEZCU3l4WFFVRlVMRVZCUVhOQ08wRkJRM0JDTEdOQlFVMHNWMEZCVnl4TFFVRkxMRmRCUVV3c1JVRkJha0k3TzBGQlJVRXNZMEZCVFN4WFFVRlhMRk5CUVZnc1VVRkJWeXhIUVVGTk8wRkJRM0pDTEdkQ1FVRkpMRTlCUVVzc1QwRkJWQ3hGUVVGclFqdEJRVU5vUWl4eFFrRkJTeXhQUVVGTUxFTkJRV0VzVDBGQllpeERRVUZ4UWl4VFFVRnlRaXhEUVVFclFpeE5RVUV2UWl4RFFVRnpReXhUUVVGMFF6dEJRVU5FT3p0QlFVVkVMSEZDUVVGVExHMUNRVUZVTEVOQlFUWkNMR2xDUVVGTkxHTkJRVzVETEVWQlFXMUVMRkZCUVc1RU8wRkJRMEVzYlVKQlFVc3NXVUZCVEN4RFFVRnJRaXhwUWtGQlRTeE5RVUY0UWp0QlFVTkJMRzFDUVVGTExHTkJRVXc3UVVGRFJDeFhRVkpFT3p0QlFWVkJMRzFDUVVGVExHZENRVUZVTEVOQlFUQkNMR2xDUVVGTkxHTkJRV2hETEVWQlFXZEVMRkZCUVdoRU8wRkJRMEVzYlVKQlFWTXNVMEZCVkN4RFFVRnRRaXhIUVVGdVFpeERRVUYxUWl4VFFVRjJRanRCUVVORU96dEJRVVZFTEdWQlFVOHNTVUZCVUR0QlFVTkVPMEZCY0UxdlFqdEJRVUZCTzBGQlFVRXNkVU5CYzAxS08wRkJRMllzV1VGQlRTeFhRVUZYTEZOQlFWTXNZVUZCVkN4RFFVRjFRaXhMUVVGMlFpeERRVUZxUWp0QlFVTkJMR2xDUVVGVExGbEJRVlFzUTBGQmMwSXNVMEZCZEVJc1JVRkJhVU1zUzBGQlN5eEZRVUYwUXp0QlFVTkJMR2xDUVVGVExGTkJRVlFzUTBGQmJVSXNSMEZCYmtJc1EwRkJkVUlzYVVKQlFYWkNPenRCUVVWQkxHbENRVUZUTEVsQlFWUXNRMEZCWXl4WFFVRmtMRU5CUVRCQ0xGRkJRVEZDTzBGQlEwUTdRVUUxVFc5Q08wRkJRVUU3UVVGQlFTeHZRMEU0VFZBN1FVRkRXaXhsUVVGUExGTkJRVk1zWVVGQlZDeFBRVUV5UWl4cFFrRkJNMElzYTBKQlFYbEVMRXRCUVVzc1JVRkJPVVFzVVVGQlVEdEJRVU5FTzBGQmFFNXZRanRCUVVGQk8wRkJRVUVzZFVOQmEwNUtPMEZCUTJZc1dVRkJUU3hYUVVGWExFdEJRVXNzVjBGQlRDeEZRVUZxUWp0QlFVTkJMRmxCUVVrc1VVRkJTaXhGUVVGak8wRkJRMW9zYlVKQlFWTXNTVUZCVkN4RFFVRmpMRmRCUVdRc1EwRkJNRUlzVVVGQk1VSTdRVUZEUkR0QlFVTkdPMEZCZGs1dlFqdEJRVUZCTzBGQlFVRXNjVU5CZVU1T08wRkJRVUU3TzBGQlEySXNXVUZCVFN4cFFrRkJhVUlzUzBGQlN5eFBRVUZNTEVOQlFXRXNUMEZCWWl4RFFVRnhRaXhuUWtGQmNrSXNRMEZCYzBNc1owSkJRWFJETEVOQlFYWkNPenRCUVVWQkxGbEJRVWtzWTBGQlNpeEZRVUZ2UWp0QlFVTnNRaXhuUWtGQlRTeEpRVUZPTEVOQlFWY3NZMEZCV0N4RlFVRXlRaXhQUVVFelFpeERRVUZ0UXp0QlFVRkJMRzFDUVVGVkxFOUJRVXNzWlVGQlRDeERRVUZ4UWl4RlFVRkZMRkZCUVZFc1RVRkJWaXhGUVVGclFpeFBRVUZQTEU5QlFYcENMRVZCUVhKQ0xFTkJRVlk3UVVGQlFTeFhRVUZ1UXp0QlFVTkVPenRCUVVWRUxGbEJRVWtzUzBGQlN5eFhRVUZVTEVWQlFYTkNPMEZCUTNCQ0xHTkJRVTBzVjBGQlZ5eExRVUZMTEZkQlFVd3NSVUZCYWtJN1FVRkRRU3hsUVVGTExHVkJRVXdzUTBGQmNVSXNSVUZCUlN4UlFVRlJMRkZCUVZZc1JVRkJiMElzVDBGQlR5eHBRa0ZCVFN4TFFVRnFReXhGUVVGeVFqdEJRVU5FT3p0QlFVVkVMR0ZCUVVzc1pVRkJUQ3hEUVVGeFFpeEZRVUZGTEZGQlFWRXNVVUZCVml4RlFVRnZRaXhQUVVGUExFOUJRVE5DTEVWQlFYSkNPMEZCUTBRN1FVRjBUMjlDTzBGQlFVRTdRVUZCUVN4eFEwRjNUMDQ3UVVGQlFUczdRVUZEWWl4WlFVRk5MR2xDUVVGcFFpeExRVUZMTEU5QlFVd3NRMEZCWVN4UFFVRmlMRU5CUVhGQ0xHZENRVUZ5UWl4RFFVRnpReXhuUWtGQmRFTXNRMEZCZGtJN08wRkJSVUVzV1VGQlNTeGpRVUZLTEVWQlFXOUNPMEZCUTJ4Q0xHZENRVUZOTEVsQlFVNHNRMEZCVnl4alFVRllMRVZCUVRKQ0xFOUJRVE5DTEVOQlFXMURPMEZCUVVFc2JVSkJRVlVzVDBGQlN5eHBRa0ZCVEN4RFFVRjFRaXhGUVVGRkxGRkJRVkVzVFVGQlZpeEZRVUZyUWl4UFFVRlBMRTlCUVhwQ0xFVkJRWFpDTEVOQlFWWTdRVUZCUVN4WFFVRnVRenRCUVVORU96dEJRVVZFTEZsQlFVa3NTMEZCU3l4WFFVRlVMRVZCUVhOQ08wRkJRM0JDTEdOQlFVMHNWMEZCVnl4TFFVRkxMRmRCUVV3c1JVRkJha0k3UVVGRFFTeGxRVUZMTEdsQ1FVRk1MRU5CUVhWQ0xFVkJRVVVzVVVGQlVTeFJRVUZXTEVWQlFXOUNMRTlCUVU4c2FVSkJRVTBzUzBGQmFrTXNSVUZCZGtJN1FVRkRSRHM3UVVGRlJDeGhRVUZMTEdsQ1FVRk1MRU5CUVhWQ0xFVkJRVVVzVVVGQlVTeFJRVUZXTEVWQlFXOUNMRTlCUVU4c1QwRkJNMElzUlVGQmRrSTdRVUZEUkR0QlFYSlFiMEk3UVVGQlFUdEJRVUZCTEcxRFFYVlFSRHRCUVVOc1FpeGxRVUZQTEVsQlFWQTdRVUZEUkR0QlFYcFFiMEk3UVVGQlFUdEJRVUZCTEc5RFFUSlFRU3hQUVROUVFTeEZRVEpRVXp0QlFVTTFRaXdyUjBGQk1rSXNVMEZCTTBJc1JVRkJjME1zVDBGQmRFTTdRVUZEUkR0QlFUZFFiMEk3TzBGQlFVRTdRVUZCUVRzN1FVRm5VWFpDT3pzN096czdPMEZCUzBFc1RVRkJUU3hoUVVGaExFVkJRVzVDT3p0QlFVVkJMRTFCUVUwc1dVRkJXU3hUUVVGVExHZENRVUZVTEU5QlFUaENMRWxCUVRsQ0xFTkJRV3hDTzBGQlEwRXNUVUZCU1N4VFFVRktMRVZCUVdVN1FVRkRZaXhWUVVGTkxFbEJRVTRzUTBGQlZ5eFRRVUZZTEVWQlFYTkNMRTlCUVhSQ0xFTkJRVGhDTEZWQlFVTXNUMEZCUkN4RlFVRmhPMEZCUTNwRExGVkJRVTBzVTBGQlV5d3lRMEZCYjBJc1QwRkJjRUlzUlVGQk5rSXNhMEpCUVRkQ0xFVkJRV2xFTEhGQ1FVRnFSQ3hEUVVGbU8wRkJRMEVzWVVGQlR5eFBRVUZRTEVkQlFXbENMRTlCUVdwQ096dEJRVVZCTEdsQ1FVRlhMRWxCUVZnc1EwRkJaMElzUlVGQlJTeG5Ra0ZCUml4RlFVRlhMRmRCUVZjc1NVRkJTU3hUUVVGS0xFTkJRV01zVFVGQlpDeERRVUYwUWl4RlFVRm9RanRCUVVORUxFdEJURVE3UVVGTlJEczdRVUZGUkN4WFFVRlRMR2RDUVVGVUxFTkJRVEJDTEU5QlFURkNMRVZCUVcxRExGVkJRVU1zUzBGQlJDeEZRVUZYTzBGQlF6VkRMRkZCUVUwc1UwRkJVeXcyUWtGQmFVSXNUVUZCVFN4TlFVRjJRaXhGUVVFclFpeGhRVUV2UWl4RFFVRm1PMEZCUTBFc1VVRkJTU3hEUVVGRExFMUJRVXdzUlVGQllUdEJRVU5ZTzBGQlEwUTdPMEZCUlVRc1VVRkJUU3hwUWtGQmFVSXNUMEZCVHl4WlFVRlFMRU5CUVc5Q0xHRkJRWEJDTEVOQlFYWkNPMEZCUTBFc1VVRkJTU3hyUWtGQmEwSXNiVUpCUVcxQ0xFbEJRWHBETEVWQlFTdERPMEZCUXpkRExGVkJRVTBzUzBGQlN5eFBRVUZQTEZsQlFWQXNRMEZCYjBJc1lVRkJjRUlzUTBGQldEdEJRVU5CTEZWQlFVMHNWVUZCVlN4VFFVRlRMR0ZCUVZRc1EwRkJkVUlzUlVGQmRrSXNRMEZCYUVJN08wRkJSVUVzVlVGQlRTeFpRVUZaTEZkQlFWY3NTVUZCV0N4RFFVRm5RanRCUVVGQkxHVkJRVXNzUlVGQlJTeFBRVUZHTEV0QlFXTXNUMEZCYmtJN1FVRkJRU3hQUVVGb1FpeERRVUZzUWpzN1FVRkZRU3hWUVVGSkxFTkJRVU1zVTBGQlRDeEZRVUZuUWp0QlFVTmtPMEZCUTBRN08wRkJSVVFzWVVGQlR5eEpRVUZRT3p0QlFVVkJMR2RDUVVGVkxGTkJRVllzUTBGQmIwSXNTVUZCY0VJN1FVRkRSRHRCUVVOR0xFZEJja0pFT3p0QlFYVkNRU3hUUVVGUExGTkJRVkE3UVVGRFJDeERRWHBUYVVJc1JVRkJiRUk3TzJ0Q1FUSlRaU3hUT3pzN096czdPenM3T3pzN08wRkRhRlJtT3pzN08wRkJRMEU3T3pzN096czdPenM3SzJWQlRrRTdPenM3T3pzN1FVRlJRU3hKUVVGTkxGZEJRVmtzV1VGQlRUdEJRVU4wUWpzN096czdPMEZCVFVFc1RVRkJUU3hQUVVGUExGVkJRV0k3UVVGRFFTeE5RVUZOTEZWQlFWVXNUMEZCYUVJN1FVRkRRU3hOUVVGTkxIRkNRVUZ4UWp0QlFVTjZRaXhoUVVGVExFbEJSR2RDTzBGQlJYcENMRmxCUVZFc1EwRkdhVUk3UVVGSGVrSXNVMEZCU3l4RFFVaHZRanRCUVVsNlFpeFRRVUZMTEVkQlNtOUNPMEZCUzNwQ0xGZEJRVThzUzBGTWEwSTdRVUZOZWtJc1lVRkJVeXhMUVU1blFqdEJRVTk2UWl4blFrRkJXVHRCUVZCaExFZEJRVE5DTzBGQlUwRXNUVUZCVFN4M1FrRkJkMElzUTBGRE5VSXNVVUZFTkVJc1JVRkZOVUlzUzBGR05FSXNSVUZITlVJc1MwRklORUlzUlVGSk5VSXNUMEZLTkVJc1JVRkxOVUlzVTBGTU5FSXNSVUZOTlVJc1dVRk9ORUlzUTBGQk9VSTdPMEZCVTBFN096czdPenRCUVROQ2MwSXNUVUZwUTJoQ0xGRkJha05uUWp0QlFVRkJPenRCUVcxRGNFSXNkMEpCUVRCQ08wRkJRVUVzVlVGQlpDeFBRVUZqTEhWRlFVRktMRVZCUVVrN08wRkJRVUU3TzBGQlIzaENPMEZCU0hkQ0xITklRVU5zUWl4SlFVUnJRaXhGUVVOYUxFOUJSRmtzUlVGRFNDeHJRa0ZFUnl4RlFVTnBRaXhQUVVScVFpeEZRVU13UWl4eFFrRkVNVUlzUlVGRGFVUXNTMEZFYWtRc1JVRkRkMFFzUzBGRWVFUTdPMEZCU1hoQ0xGbEJRVXNzVDBGQlRDeERRVUZoTEU5QlFXSXNRMEZCY1VJc1MwRkJja0lzUTBGQk1rSXNUVUZCTTBJc1IwRkJkVU1zVFVGQlN5eFBRVUZNTEVOQlFXRXNUVUZCY0VRN08wRkJSVUU3UVVGRFFTeFZRVUZOTEdOQlFXTXNUVUZCU3l4alFVRk1MRVZCUVhCQ08wRkJRMEVzYTBKQlFWa3NXVUZCV2l4RFFVRjVRaXhsUVVGNlFpeFBRVUUyUXl4TlFVRkxMRTlCUVV3c1EwRkJZU3hIUVVFeFJEdEJRVU5CTEd0Q1FVRlpMRmxCUVZvc1EwRkJlVUlzWlVGQmVrSXNUMEZCTmtNc1RVRkJTeXhQUVVGTUxFTkJRV0VzUjBGQk1VUTdPMEZCUlVFN1FVRkRRU3hWUVVGSkxFMUJRVXNzVDBGQlRDeERRVUZoTEU5QlFXSXNTVUZEUXl4RFFVRkRMRmxCUVZrc1UwRkJXaXhEUVVGelFpeFJRVUYwUWl4RFFVRXJRaXh6UWtGQkwwSXNRMEZFVGl4RlFVTTRSRHRCUVVNMVJDeHZRa0ZCV1N4VFFVRmFMRU5CUVhOQ0xFZEJRWFJDTEVOQlFUQkNMSE5DUVVFeFFqdEJRVU5FT3p0QlFVVkVPMEZCUTBFc1ZVRkJTU3hQUVVGUExFMUJRVXNzVDBGQlRDeERRVUZoTEZWQlFYQkNMRXRCUVcxRExGRkJRVzVETEVsQlEwTXNRMEZCUXl4WlFVRlpMRk5CUVZvc1EwRkJjMElzVVVGQmRFSXNVMEZCY1VNc1RVRkJTeXhQUVVGTUxFTkJRV0VzVlVGQmJFUXNRMEZFVGl4RlFVTjFSVHRCUVVOeVJTeHZRa0ZCV1N4VFFVRmFMRU5CUVhOQ0xFZEJRWFJDTEZOQlFXZERMRTFCUVVzc1QwRkJUQ3hEUVVGaExGVkJRVGRETzBGQlEwUTdRVUZ5UW5WQ08wRkJjMEo2UWpzN1FVRjZSRzFDTzBGQlFVRTdRVUZCUVN4MVEwRXlSRWc3UVVGRFppeGxRVUZQTEV0QlFVc3NUMEZCVEN4RFFVRmhMRTlCUVdJc1EwRkJjVUlzWVVGQmNrSXNRMEZCYlVNc1pVRkJia01zUTBGQlVEdEJRVU5FTzBGQk4wUnRRanRCUVVGQk8wRkJRVUVzTkVKQkswUk1PMEZCUVVFc1dVRkJXQ3hMUVVGWExIVkZRVUZJTEVOQlFVYzdPMEZCUTJJc1dVRkJUU3hqUVVGakxFdEJRVXNzWTBGQlRDeEZRVUZ3UWp0QlFVTkJMRmxCUVUwc1YwRkJWeXhMUVVGTExFdEJRVXdzUTBGQldTeFRRVUZUTEV0QlFVc3NUMEZCVEN4RFFVRmhMRWRCUVdJc1IwRkJiVUlzUzBGQlN5eFBRVUZNTEVOQlFXRXNSMEZCZWtNc1EwRkJSQ3hIUVVGclJDeEhRVUUzUkN4RFFVRnFRanM3UVVGRlFTeFpRVUZKTEZGQlFWRXNTMEZCU3l4UFFVRk1MRU5CUVdFc1IwRkJla0lzUlVGQk9FSTdRVUZETlVJc2EwSkJRVkVzUzBGQlVpeERRVUZwUWl4SlFVRnFRaXh0UWtGQmJVTXNTMEZCYmtNN1FVRkRRU3hwUWtGQlR5eExRVUZRTzBGQlEwUTdPMEZCUlVRc1dVRkJTU3hSUVVGUkxFdEJRVXNzVDBGQlRDeERRVUZoTEVkQlFYcENMRVZCUVRoQ08wRkJRelZDTEd0Q1FVRlJMRXRCUVZJc1EwRkJhVUlzU1VGQmFrSXNiVUpCUVcxRExFdEJRVzVETzBGQlEwRXNhVUpCUVU4c1MwRkJVRHRCUVVORU96dEJRVVZFTEc5Q1FVRlpMRmxCUVZvc1EwRkJlVUlzWlVGQmVrSXNUMEZCTmtNc1MwRkJOME03TzBGQlJVRTdRVUZEUVN4WlFVRkpMRXRCUVVzc1QwRkJUQ3hEUVVGaExFdEJRV3BDTEVWQlFYZENPMEZCUTNSQ0xITkNRVUZaTEZOQlFWb3NSMEZCTWtJc1VVRkJNMEk3UVVGRFJEczdRVUZGUkR0QlFVTkJMRzlDUVVGWkxFdEJRVm9zUTBGQmEwSXNTMEZCYkVJc1IwRkJOa0lzVVVGQk4wSTdPMEZCUlVFc1pVRkJUeXhKUVVGUU8wRkJRMFE3UVVGNFJtMUNPMEZCUVVFN1FVRkJRU3huUTBFd1JsYzdRVUZCUVN4WlFVRjJRaXhqUVVGMVFpeDFSVUZCVGl4SlFVRk5PenRCUVVNM1FpeFpRVUZKTEVOQlFVTXNTMEZCU3l4UFFVRk1MRU5CUVdFc1QwRkJiRUlzUlVGQk1rSTdRVUZEZWtJc2EwSkJRVkVzUzBGQlVpeERRVUZwUWl4SlFVRnFRanRCUVVOQkxHbENRVUZQTEV0QlFWQTdRVUZEUkRzN1FVRkZSQ3haUVVGTkxHTkJRV01zUzBGQlN5eGpRVUZNTEVWQlFYQkNPenRCUVVWQkxGbEJRVWtzYTBKQlEwTXNRMEZCUXl4WlFVRlpMRk5CUVZvc1EwRkJjMElzVVVGQmRFSXNRMEZCSzBJc2RVSkJRUzlDTEVOQlJFNHNSVUZESzBRN1FVRkROMFFzYzBKQlFWa3NVMEZCV2l4RFFVRnpRaXhIUVVGMFFpeERRVUV3UWl4MVFrRkJNVUk3UVVGRFJEczdRVUZGUkN4WlFVRkpMRU5CUVVNc1kwRkJSQ3hKUVVORExGbEJRVmtzVTBGQldpeERRVUZ6UWl4UlFVRjBRaXhEUVVFclFpeDFRa0ZCTDBJc1EwRkVUQ3hGUVVNNFJEdEJRVU0xUkN4elFrRkJXU3hUUVVGYUxFTkJRWE5DTEUxQlFYUkNMRU5CUVRaQ0xIVkNRVUUzUWp0QlFVTkVPenRCUVVWRUxHVkJRVThzU1VGQlVEdEJRVU5FTzBGQk4wZHRRanRCUVVGQk8wRkJRVUVzTmtKQkswZGlPMEZCUTB3c1lVRkJTeXhQUVVGTUxFTkJRV0VzVDBGQllpeERRVUZ4UWl4TFFVRnlRaXhEUVVFeVFpeE5RVUV6UWl4SFFVRjFReXhMUVVGTExFOUJRVXdzUTBGQllTeE5RVUZ3UkR0QlFVTkJMR0ZCUVVzc1dVRkJUQ3hEUVVGclFpeHBRa0ZCVFN4SlFVRjRRanRCUVVOQkxHRkJRVXNzV1VGQlRDeERRVUZyUWl4cFFrRkJUU3hMUVVGNFFqczdRVUZGUVN4bFFVRlBMRWxCUVZBN1FVRkRSRHRCUVhKSWJVSTdRVUZCUVR0QlFVRkJMRFpDUVhWSVlqdEJRVU5NTEdGQlFVc3NUMEZCVEN4RFFVRmhMRTlCUVdJc1EwRkJjVUlzUzBGQmNrSXNRMEZCTWtJc1RVRkJNMElzUjBGQmIwTXNTMEZCY0VNN1FVRkRRU3hoUVVGTExGbEJRVXdzUTBGQmEwSXNhVUpCUVUwc1NVRkJlRUk3UVVGRFFTeGhRVUZMTEZsQlFVd3NRMEZCYTBJc2FVSkJRVTBzVFVGQmVFSTdPMEZCUlVFc1pVRkJUeXhKUVVGUU8wRkJRMFE3UVVFM1NHMUNPMEZCUVVFN1FVRkJRU3h0UTBFclNFRTdRVUZEYkVJc1pVRkJUeXhKUVVGUU8wRkJRMFE3UVVGcVNXMUNPMEZCUVVFN1FVRkJRU3h2UTBGdFNVTXNUMEZ1U1VRc1JVRnRTVlU3UVVGRE5VSXNOa2RCUVRKQ0xGRkJRVE5DTEVWQlFYRkRMRTlCUVhKRE8wRkJRMFE3UVVGeVNXMUNPenRCUVVGQk8wRkJRVUU3TzBGQmQwbDBRaXhUUVVGUExGRkJRVkE3UVVGRFJDeERRWHBKWjBJc1JVRkJha0k3TzJ0Q1FUSkpaU3hST3pzN096czdPenM3T3pzN08wRkRPVWxtT3pzN08wRkJRMEU3TzBGQlEwRTdPenM3UVVGRFFUczdPenM3T3pzN0syVkJVa0U3T3pzN096czdRVUZWUVN4SlFVRk5MRTFCUVU4c1dVRkJUVHRCUVVOcVFqczdPenM3TzBGQlRVRXNUVUZCVFN4UFFVRlBMRXRCUVdJN1FVRkRRU3hOUVVGTkxGVkJRVlVzVDBGQmFFSTdRVUZEUVN4TlFVRk5MSEZDUVVGeFFpeEZRVUV6UWp0QlFVZEJMRTFCUVUwc2QwSkJRWGRDTEVWQlFUbENPMEZCUlVFc1RVRkJUU3gxUWtGQmRVSXNWMEZCTjBJN08wRkJSVUU3T3pzN096dEJRV2hDYVVJc1RVRnpRbGdzUjBGMFFsYzdRVUZCUVRzN1FVRjNRbVlzYlVKQlFUQkNPMEZCUVVFc1ZVRkJaQ3hQUVVGakxIVkZRVUZLTEVWQlFVazdPMEZCUVVFN08wRkJRVUVzZFVkQlEyeENMRWxCUkd0Q0xFVkJRMW9zVDBGRVdTeEZRVU5JTEd0Q1FVUkhMRVZCUTJsQ0xFOUJSR3BDTEVWQlF6QkNMSEZDUVVReFFpeEZRVU5wUkN4TFFVUnFSQ3hGUVVOM1JDeExRVVI0UkR0QlFVVjZRanM3UVVFeFFtTTdRVUZCUVR0QlFVRkJMRFpDUVRSQ1VqdEJRVU5NTEZsQlFVa3NTMEZCU3l4UFFVRk1MRU5CUVdFc1QwRkJZaXhEUVVGeFFpeFRRVUZ5UWl4RFFVRXJRaXhSUVVFdlFpeERRVUYzUXl4UlFVRjRReXhEUVVGS0xFVkJRWFZFTzBGQlEzSkVMR2xDUVVGUExFdEJRVkE3UVVGRFJEczdRVUZGUkN4WlFVRk5MRXRCUVVzc1MwRkJTeXhQUVVGTUxFTkJRV0VzVDBGQllpeERRVUZ4UWl4WlFVRnlRaXhEUVVGclF5eE5RVUZzUXl4RFFVRllPMEZCUTBFc1dVRkJUU3hOUVVGTkxEaENRVUZyUWl4TFFVRkxMRTlCUVV3c1EwRkJZU3hQUVVFdlFpeEZRVUYzUXl4TFFVRjRReXhEUVVGYU8wRkJRMEVzV1VGQlRTeFZRVUZWTEUxQlFVMHNTVUZCU1N4blFrRkJTaXh2UWtGQmMwTXNTVUZCZEVNc1VVRkJUaXhIUVVGM1JDeEpRVUY0UlRzN1FVRkZRU3haUVVGSkxFOUJRVW9zUlVGQllUdEJRVU5ZTEdkQ1FVRk5MRWxCUVU0c1EwRkJWeXhQUVVGWUxFVkJRVzlDTEU5QlFYQkNMRU5CUVRSQ0xGVkJRVU1zUjBGQlJDeEZRVUZUTzBGQlEyNURMR2RDUVVGSkxFbEJRVWtzVTBGQlNpeERRVUZqTEZGQlFXUXNRMEZCZFVJc1VVRkJka0lzUTBGQlNpeEZRVUZ6UXp0QlFVTndReXhyUWtGQlNTeFRRVUZLTEVOQlFXTXNUVUZCWkN4RFFVRnhRaXhSUVVGeVFqdEJRVU5FTzBGQlEwUXNaMEpCUVVrc1dVRkJTaXhEUVVGcFFpeGxRVUZxUWl4RlFVRnJReXhMUVVGc1F6dEJRVU5FTEZkQlRFUTdRVUZOUkRzN1FVRkZSQ3hoUVVGTExFOUJRVXdzUTBGQllTeFBRVUZpTEVOQlFYRkNMRk5CUVhKQ0xFTkJRU3RDTEVkQlFTOUNMRU5CUVcxRExGRkJRVzVETzBGQlEwRXNZVUZCU3l4UFFVRk1MRU5CUVdFc1QwRkJZaXhEUVVGeFFpeFpRVUZ5UWl4RFFVRnJReXhsUVVGc1F5eEZRVUZ0UkN4SlFVRnVSRHM3UVVGRlFTeFpRVUZOTEdGQlFXRXNVMEZCVXl4aFFVRlVMRU5CUVhWQ0xFVkJRWFpDTEVOQlFXNUNPMEZCUTBFc1dVRkJUU3hqUVVGakxGZEJRVmNzVlVGQldDeERRVUZ6UWl4blFrRkJkRUlzUTBGQmRVTXNiMEpCUVhaRExFTkJRWEJDT3p0QlFVVkJMRmxCUVVrc1YwRkJTaXhGUVVGcFFqdEJRVU5tTEdkQ1FVRk5MRWxCUVU0c1EwRkJWeXhYUVVGWUxFVkJRWGRDTEU5QlFYaENMRU5CUVdkRExGVkJRVU1zUjBGQlJDeEZRVUZUTzBGQlEzWkRMR2RDUVVGSkxFbEJRVWtzVTBGQlNpeERRVUZqTEZGQlFXUXNRMEZCZFVJc1VVRkJka0lzUTBGQlNpeEZRVUZ6UXp0QlFVTndReXhyUWtGQlNTeFRRVUZLTEVOQlFXTXNUVUZCWkN4RFFVRnhRaXhSUVVGeVFqdEJRVU5FTzBGQlEwWXNWMEZLUkR0QlFVdEVPenRCUVVWRUxHMUNRVUZYTEZOQlFWZ3NRMEZCY1VJc1IwRkJja0lzUTBGQmVVSXNVMEZCZWtJN08wRkJSVUVzYlVKQlFWY3NXVUZCVFR0QlFVTm1MR05CUVUwc1YwRkJWeXhUUVVGWUxGRkJRVmNzUjBGQlRUdEJRVU55UWl4MVFrRkJWeXhUUVVGWUxFTkJRWEZDTEUxQlFYSkNMRU5CUVRSQ0xGTkJRVFZDTzBGQlEwRXNkVUpCUVZjc1UwRkJXQ3hEUVVGeFFpeEhRVUZ5UWl4RFFVRjVRaXhSUVVGNlFqdEJRVU5CTEhWQ1FVRlhMRk5CUVZnc1EwRkJjVUlzVFVGQmNrSXNRMEZCTkVJc1UwRkJOVUk3UVVGRFFTeDFRa0ZCVnl4dFFrRkJXQ3hEUVVFclFpeHBRa0ZCVFN4alFVRnlReXhGUVVGeFJDeFJRVUZ5UkR0QlFVTkVMRmRCVEVRN08wRkJUMEVzY1VKQlFWY3NaMEpCUVZnc1EwRkJORUlzYVVKQlFVMHNZMEZCYkVNc1JVRkJhMFFzVVVGQmJFUTdPMEZCUlVFc2NVSkJRVmNzVTBGQldDeERRVUZ4UWl4SFFVRnlRaXhEUVVGNVFpeFRRVUY2UWp0QlFVVkVMRk5CV2tRc1JVRlpSeXhGUVZwSU96dEJRV05CTEdWQlFVOHNTVUZCVUR0QlFVTkVPMEZCTjBWak8wRkJRVUU3UVVGQlFTdzJRa0VyUlZJN1FVRkRUQ3haUVVGSkxFTkJRVU1zUzBGQlN5eFBRVUZNTEVOQlFXRXNUMEZCWWl4RFFVRnhRaXhUUVVGeVFpeERRVUVyUWl4UlFVRXZRaXhEUVVGM1F5eFJRVUY0UXl4RFFVRk1MRVZCUVhkRU8wRkJRM1JFTEdsQ1FVRlBMRXRCUVZBN1FVRkRSRHM3UVVGRlJDeFpRVUZKTEV0QlFVc3NUMEZCVEN4RFFVRmhMRTlCUVdJc1EwRkJjVUlzVTBGQmNrSXNRMEZCSzBJc1VVRkJMMElzUTBGQmQwTXNVVUZCZUVNc1EwRkJTaXhGUVVGMVJEdEJRVU55UkN4bFFVRkxMRTlCUVV3c1EwRkJZU3hQUVVGaUxFTkJRWEZDTEZOQlFYSkNMRU5CUVN0Q0xFMUJRUzlDTEVOQlFYTkRMRkZCUVhSRE8wRkJRMFE3TzBGQlJVUXNZVUZCU3l4UFFVRk1MRU5CUVdFc1QwRkJZaXhEUVVGeFFpeFpRVUZ5UWl4RFFVRnJReXhsUVVGc1F5eEZRVUZ0UkN4TFFVRnVSRHM3UVVGRlFTeFpRVUZOTEV0QlFVc3NTMEZCU3l4UFFVRk1MRU5CUVdFc1QwRkJZaXhEUVVGeFFpeFpRVUZ5UWl4RFFVRnJReXhOUVVGc1F5eERRVUZZTzBGQlEwRXNXVUZCVFN4aFFVRmhMRk5CUVZNc1lVRkJWQ3hEUVVGMVFpeEZRVUYyUWl4RFFVRnVRanM3UVVGRlFTeFpRVUZKTEZkQlFWY3NVMEZCV0N4RFFVRnhRaXhSUVVGeVFpeERRVUU0UWl4UlFVRTVRaXhEUVVGS0xFVkJRVFpETzBGQlF6TkRMSEZDUVVGWExGTkJRVmdzUTBGQmNVSXNUVUZCY2tJc1EwRkJORUlzVVVGQk5VSTdRVUZEUkRzN1FVRkZSQ3hsUVVGUExFbEJRVkE3UVVGRFJEdEJRV3hIWXp0QlFVRkJPMEZCUVVFc2JVTkJiMGRMTzBGQlEyeENMR1ZCUVU4c1NVRkJVRHRCUVVORU8wRkJkRWRqTzBGQlFVRTdRVUZCUVN4dlEwRjNSMDBzVDBGNFIwNHNSVUYzUjJVN1FVRkROVUlzYlVkQlFUSkNMRWRCUVROQ0xFVkJRV2RETEU5QlFXaERPMEZCUTBRN1FVRXhSMk03TzBGQlFVRTdRVUZCUVRzN1FVRTJSMnBDT3pzN096czdPMEZCUzBFc1RVRkJUU3hoUVVGaExFVkJRVzVDT3p0QlFVVkJMRTFCUVUwc1QwRkJUeXhUUVVGVExHZENRVUZVTEc5Q1FVRXlReXhKUVVFelF5eFJRVUZpTzBGQlEwRXNUVUZCU1N4SlFVRktMRVZCUVZVN1FVRkRVaXhWUVVGTkxFbEJRVTRzUTBGQlZ5eEpRVUZZTEVWQlFXbENMRTlCUVdwQ0xFTkJRWGxDTEZWQlFVTXNUMEZCUkN4RlFVRmhPMEZCUTNCRE8wRkJRMEVzVlVGQlRTeFRRVUZUTERKRFFVRnZRaXhQUVVGd1FpeEZRVUUyUWl4clFrRkJOMElzUlVGQmFVUXNjVUpCUVdwRUxFTkJRV1k3UVVGRFFTeGhRVUZQTEU5QlFWQXNSMEZCYVVJc1QwRkJha0k3TzBGQlJVRXNhVUpCUVZjc1NVRkJXQ3hEUVVGblFpeEpRVUZKTEdGQlFVb3NRMEZCYTBJc1RVRkJiRUlzUTBGQmFFSTdRVUZEUkN4TFFVNUVPMEZCVDBRN08wRkJSVVFzVjBGQlV5eG5Ra0ZCVkN4RFFVRXdRaXhQUVVFeFFpeEZRVUZ0UXl4VlFVRkRMRXRCUVVRc1JVRkJWenRCUVVNMVF5eFJRVUZOTEdsQ1FVRnBRaXhOUVVGTkxFMUJRVTRzUTBGQllTeFpRVUZpTEVOQlFUQkNMR0ZCUVRGQ0xFTkJRWFpDTzBGQlEwRXNVVUZCU1N4clFrRkJhMElzYlVKQlFXMUNMRWxCUVhwRExFVkJRU3RETzBGQlF6ZERMRlZCUVUwc1MwRkJTeXhOUVVGTkxFMUJRVTRzUTBGQllTeFpRVUZpTEVOQlFUQkNMRTFCUVRGQ0xFTkJRVmc3TzBGQlJVRXNWVUZCVFN4WlFVRlpMRmRCUVZjc1NVRkJXQ3hEUVVGblFqdEJRVUZCTEdWQlFVc3NSVUZCUlN4VlFVRkdMRWRCUVdVc1dVRkJaaXhEUVVFMFFpeE5RVUUxUWl4TlFVRjNReXhGUVVFM1F6dEJRVUZCTEU5QlFXaENMRU5CUVd4Q096dEJRVVZCTEZWQlFVa3NRMEZCUXl4VFFVRk1MRVZCUVdkQ08wRkJRMlE3UVVGRFJEczdRVUZGUkN4blFrRkJWU3hKUVVGV08wRkJRMFE3UVVGRFJpeEhRV0pFT3p0QlFXVkJMRk5CUVU4c1IwRkJVRHRCUVVORUxFTkJMMGxYTEVWQlFWbzdPMnRDUVdsS1pTeEhPenM3T3pzN096czdPenM3T3pzN1FVTXpTbVk3T3pzN096dEJRVTFCTEVsQlFVMHNVMEZCVlN4WlFVRk5PMEZCUTNCQ096czdPenM3UVVGTlFTeE5RVUZOTEU5QlFVOHNZVUZCWWp0QlFVTkJMRTFCUVUwc1ZVRkJWU3hQUVVGb1FqczdRVUZGUVRzN096czdPMEZCVm05Q0xFMUJaMEprTEUxQmFFSmpPMEZCYVVKc1FpeHZRa0ZCV1N4UFFVRmFMRVZCUVhGQ0xFbEJRWEpDTEVWQlFUSkNPMEZCUVVFN08wRkJRM3BDTEZkQlFVc3NUMEZCVEN4SFFVRmxMRTlCUVdZN1FVRkRRU3hYUVVGTExFbEJRVXdzUjBGQldTeEpRVUZhT3p0QlFVVkJMRlZCUVVrc1EwRkJReXhMUVVGTExGTkJRVXdzUTBGQlpTeExRVUZMTEU5QlFYQkNMRU5CUVV3c1JVRkJiVU03UVVGRGFrTTdRVUZEUkRzN1FVRkZSRHRCUVVOQkxGVkJRVWtzUzBGQlN5eFBRVUZNTEVOQlFXRXNUVUZCWWl4SlFVRjFRaXhMUVVGTExFOUJRVXdzUTBGQllTeE5RVUZpTEVkQlFYTkNMRU5CUVdwRUxFVkJRVzlFTzBGQlEyeEVMR0ZCUVVzc1VVRkJUQ3hEUVVGakxFdEJRVXNzVDBGQmJrSTdRVUZEUkN4UFFVWkVMRTFCUlU4N1FVRkRURHRCUVVOQkxHRkJRVXNzVDBGQlRDeERRVUZoTEV0QlFVc3NUMEZCYkVJN1FVRkRSRHRCUVVOR096dEJRVVZFT3p0QlFXeERhMEk3UVVGQlFUczdPMEZCZDBOc1FqczdPenM3UVVGNFEydENMR2REUVRaRFVpeFBRVGREVVN4RlFUWkRRenRCUVVOcVFpeFpRVUZKTEZsQlFWa3NTVUZCYUVJc1JVRkJjMEk3UVVGRGNFSXNhVUpCUVU4c1MwRkJVRHRCUVVORU8wRkJRMFFzWlVGQlVTeFJRVUZQTEVsQlFWQXNlVU5CUVU4c1NVRkJVQ3hQUVVGblFpeFJRVUZvUWl4SFFVRXlRaXh0UWtGQmJVSXNTVUZCT1VNc1IwRkJjVVFzVjBGQlZ5eFJRVUZQTEU5QlFWQXNlVU5CUVU4c1QwRkJVQ3hQUVVGdFFpeFJRVUU1UWl4SlFVRXdReXhQUVVGUExGRkJRVkVzVVVGQlppeExRVUUwUWl4UlFVRjBSU3hKUVVGclJpeFBRVUZQTEZGQlFWRXNVVUZCWml4TFFVRTBRaXhSUVVFelN6dEJRVU5FT3p0QlFVVkVPenM3T3pzN1FVRndSR3RDTzBGQlFVRTdRVUZCUVN3NFFrRjVSRllzVDBGNlJGVXNSVUY1UkVRc1NVRjZSRU1zUlVGNVJFczdRVUZEY2tJc1dVRkJTU3hGUVVGRkxHbENRVUZwUWl4UFFVRnVRaXhEUVVGS0xFVkJRV2xETzBGQlF5OUNMR3RDUVVGUkxGTkJRVklzUjBGQmIwSXNTVUZCY0VJN1FVRkRSQ3hUUVVaRUxFMUJSVTg3UVVGRFRDeHJRa0ZCVVN4WFFVRlNMRWRCUVhOQ0xFbEJRWFJDTzBGQlEwUTdRVUZEUmpzN1FVRkZSRHM3T3pzN08wRkJha1ZyUWp0QlFVRkJPMEZCUVVFc09FSkJjMFZXTEU5QmRFVlZMRVZCYzBWRUxFbEJkRVZETEVWQmMwVkxPMEZCUTNKQ0xHZENRVUZSTEZOQlFWSXNSMEZCYjBJc1NVRkJjRUk3UVVGRFJEczdRVUZGUkRzN096czdPenRCUVRGRmEwSTdRVUZCUVR0QlFVRkJMRzFEUVdkR1RDeFBRV2hHU3l4RlFXZEdTU3hKUVdoR1NpeEZRV2RHVlN4SlFXaEdWaXhGUVdkR1owSTdRVUZEYUVNc1owSkJRVkVzV1VGQlVpeERRVUZ4UWl4SlFVRnlRaXhGUVVFeVFpeEpRVUV6UWp0QlFVTkVPMEZCYkVacFFqdEJRVUZCTzBGQlFVRXNPRUpCYjBaV0xFOUJjRVpWTEVWQmIwWkVPMEZCUTJZc1dVRkJTU3hQUVVGUExGRkJRVkVzV1VGQlVpeERRVUZ4UWl4WFFVRnlRaXhEUVVGWU8wRkJRMEVzV1VGQlNTeERRVUZETEVsQlFVd3NSVUZCVnp0QlFVTlVPMEZCUTBRN08wRkJSVVFzWlVGQlR5eExRVUZMTEVsQlFVd3NSVUZCVURzN1FVRkZRU3haUVVGTkxFbEJRVWtzYVVSQlFWWTdRVUZEUVN4WlFVRkpMRlZCUVVvN08wRkJSVUVzWlVGQlR5eEpRVUZKTEVWQlFVVXNTVUZCUml4RFFVRlBMRWxCUVZBc1EwRkJXQ3hGUVVGNVFqdEJRVU4yUWl4alFVRk5MRTFCUVUwc1JVRkJSU3hEUVVGR0xFVkJRVXNzU1VGQlRDeEZRVUZhTzBGQlEwRXNZMEZCVFN4UlFVRlJMRVZCUVVVc1EwRkJSaXhGUVVGTExFbEJRVXdzUjBGQldTeFBRVUZhTEVOQlFXOUNMRWRCUVhCQ0xFVkJRWGxDTEVWQlFYcENMRU5CUVdRN1FVRkRRU3hqUVVGSkxGbEJRVmtzUzBGQlN5eEpRVUZNTEVOQlFWVXNTMEZCVml4RFFVRm9RanM3UVVGRlFTeGpRVUZKTEVOQlFVTXNTMEZCU3l4SlFVRk1MRU5CUVZVc1MwRkJWaXhEUVVGTUxFVkJRWFZDTzBGQlEzSkNMRzlDUVVGUkxFZEJRVklzUTBGQlpTeEpRVUZtTEcxQ1FVRnBReXhMUVVGcVF6dEJRVU5CTEhkQ1FVRlpMRXRCUVZvN1FVRkRSRHM3UVVGRlJDeGpRVUZOTEdGQlFXRXNVVUZCVVN4SlFVRkpMRTFCUVVvc1EwRkJWeXhEUVVGWUxFVkJRV01zVjBGQlpDeEZRVUZTTEVkQlFYTkRMRWxCUVVrc1MwRkJTaXhEUVVGVkxFTkJRVllzUTBGQmVrUTdPMEZCUlVFc1kwRkJTU3hMUVVGTExGVkJRVXdzUTBGQlNpeEZRVUZ6UWp0QlFVTndRaXhwUWtGQlN5eFZRVUZNTEVWQlFXbENMRTlCUVdwQ0xFVkJRVEJDTEZOQlFURkNPMEZCUTBRc1YwRkdSQ3hOUVVWUE8wRkJRMHdzYVVKQlFVc3NXVUZCVEN4RFFVRnJRaXhQUVVGc1FpeEZRVUV5UWl4SFFVRXpRaXhGUVVGblF5eFRRVUZvUXp0QlFVTkVPMEZCUTBZN1FVRkRSanM3UVVGRlJEczdPenRCUVc1SWEwSTdRVUZCUVR0QlFVRkJMQ3RDUVhOSVZDeFBRWFJJVXl4RlFYTklRVHRCUVVGQk96dEJRVU5vUWl4alFVRk5MRWxCUVU0c1EwRkJWeXhQUVVGWUxFVkJRVzlDTEU5QlFYQkNMRU5CUVRSQ08wRkJRVUVzYVVKQlFVMHNUVUZCU3l4UFFVRk1MRU5CUVdFc1JVRkJZaXhEUVVGT08wRkJRVUVzVTBGQk5VSTdRVUZEUkR0QlFYaElhVUk3UVVGQlFUdEJRVUZCTERCQ1FXOURSenRCUVVOdVFpeGxRVUZWTEVsQlFWWXNVMEZCYTBJc1QwRkJiRUk3UVVGRFJEdEJRWFJEYVVJN08wRkJRVUU3UVVGQlFUczdRVUV5U0hCQ0xGTkJRVThzVFVGQlVEdEJRVU5FTEVOQk5VaGpMRVZCUVdZN08ydENRVGhJWlN4Tk96czdPenM3T3pzN096dHhha0pEY0VsbU96czdPenM3TzBGQlMwRTdPenM3T3pzN08wRkJSVUVzU1VGQlRTeFBRVUZSTEZsQlFVMDdRVUZEYkVJN096czdPenRCUVUxQkxFMUJRVTBzVDBGQlR5eE5RVUZpTzBGQlEwRXNUVUZCVFN4VlFVRlZMRTlCUVdoQ08wRkJRMEVzVFVGQlRTeHhRa0ZCY1VJN1FVRkRla0lzYjBKQlFXZENMRWxCUkZNN1FVRkZla0lzV1VGQlVTeEpRVVpwUWp0QlFVZDZRaXhqUVVGVkxFbEJTR1U3UVVGSmVrSXNWVUZCVFRzN1FVRkhVanM3T3pzN08wRkJVREpDTEVkQlFUTkNPMEZCVkd0Q0xFMUJjMEphTEVsQmRFSlpPMEZCZFVKb1FqczdPenRCUVVsQkxHOUNRVUV3UWp0QlFVRkJMRlZCUVdRc1QwRkJZeXgxUlVGQlNpeEZRVUZKT3p0QlFVRkJPenRCUVVONFFpeFhRVUZMTEU5QlFVd3NSMEZCWlN4UFFVRlBMRTFCUVZBc1EwRkJZeXhyUWtGQlpDeEZRVUZyUXl4UFFVRnNReXhEUVVGbU96dEJRVVZCTEZWQlFVa3NUMEZCVHl4TFFVRkxMRTlCUVV3c1EwRkJZU3hqUVVGd1FpeExRVUYxUXl4UlFVRXpReXhGUVVGeFJEdEJRVU51UkN4alFVRk5MRWxCUVVrc1MwRkJTaXhEUVVGaExFbEJRV0lzT0VSQlFVNDdRVUZEUkRzN1FVRkZSQ3hWUVVGSkxFdEJRVXNzVDBGQlRDeERRVUZoTEVsQlFXSXNTMEZCYzBJc1NVRkJNVUlzUlVGQlowTTdRVUZET1VJc1kwRkJUU3hKUVVGSkxFdEJRVW9zUTBGQllTeEpRVUZpTEhGRFFVRk9PMEZCUTBRN08wRkJSVVFzVlVGQlNTeFJRVUZQTEV0QlFVc3NUMEZCVEN4RFFVRmhMRWxCUVdJc1EwRkJhMElzUzBGQlN5eFBRVUZNTEVOQlFXRXNZMEZCTDBJc1EwRkJVQ3hOUVVFd1JDeFJRVUU1UkN4RlFVRjNSVHRCUVVOMFJTeGpRVUZOTEVsQlFVa3NTMEZCU2l4RFFVRmhMRWxCUVdJc2JVVkJRVTQ3UVVGRFJEczdRVUZGUkN4WFFVRkxMRk5CUVV3c1EwRkJaU3hMUVVGTExFOUJRVXdzUTBGQllTeE5RVUUxUWl4RlFVRnZReXhMUVVGTExFOUJRVXdzUTBGQllTeFJRVUZxUkR0QlFVTkVPenRCUVRORFpUdEJRVUZCTzBGQlFVRXNhME5CYVVSS08wRkJRMVlzWlVGQlR5eExRVUZMTEU5QlFVd3NRMEZCWVN4TlFVRndRanRCUVVORU8wRkJia1JsTzBGQlFVRTdRVUZCUVN3d1EwRnhSRWs3UVVGRGJFSXNaVUZCVHl4TFFVRkxMRTlCUVV3c1EwRkJZU3hqUVVGd1FqdEJRVU5FT3p0QlFVVkVPenM3T3pzN1FVRjZSR2RDTzBGQlFVRTdRVUZCUVN4blEwRTRSRTRzVFVFNVJFMHNSVUU0UkhGQ08wRkJRVUVzV1VGQmJrSXNWVUZCYlVJc2RVVkJRVTRzU1VGQlRUczdRVUZEYmtNc1dVRkJTU3hSUVVGUExFdEJRVXNzVDBGQlRDeERRVUZoTEVsQlFXSXNRMEZCYTBJc1RVRkJiRUlzUTBGQlVDeE5RVUZ4UXl4UlFVRjZReXhGUVVGdFJEdEJRVU5xUkN4clFrRkJVU3hMUVVGU0xFTkJRV2xDTEVsQlFXcENMRlZCUVRCQ0xFMUJRVEZDTEd0RFFVRTJSQ3hMUVVGTExFOUJRVXdzUTBGQllTeGpRVUV4UlR0QlFVTkVMRk5CUmtRc1RVRkZUenRCUVVOTUxHVkJRVXNzVDBGQlRDeERRVUZoTEUxQlFXSXNSMEZCYzBJc1RVRkJkRUk3UVVGRFJEczdRVUZGUkN4WlFVRkpMRlZCUVVvc1JVRkJaMEk3UVVGRFpDeGxRVUZMTEZWQlFVdzdRVUZEUkR0QlFVTkdPMEZCZUVWbE8wRkJRVUU3UVVGQlFTeHhRMEV3UlVRN1FVRkRZaXhsUVVGUExFOUJRVThzU1VGQlVDeERRVUZaTEV0QlFVc3NUMEZCVEN4RFFVRmhMRWxCUVhwQ0xFTkJRVkE3UVVGRFJEdEJRVFZGWlR0QlFVRkJPMEZCUVVFc2NVTkJPRVZyUXp0QlFVRkJMRmxCUVhKRExFdEJRWEZETEhWRlFVRTNRaXhKUVVFMlFqdEJRVUZCTEZsQlFYWkNMR2RDUVVGMVFpeDFSVUZCU2l4RlFVRkpPenRCUVVOb1JDeFpRVUZKTEU5QlFVOHNTMEZCVUN4TFFVRnBRaXhSUVVGeVFpeEZRVUVyUWp0QlFVTTNRaXhwUWtGQlR5eFRRVUZRTzBGQlEwUTdPMEZCUlVRc1dVRkJUU3hSUVVGUkxFMUJRVTBzUzBGQlRpeERRVUZaTEcxQ1FVRmFMRU5CUVdRN1FVRkRRU3haUVVGSkxFdEJRVW9zUlVGQlZ6dEJRVU5VTEd0Q1FVRlJMRTFCUVUwc1QwRkJUaXhEUVVGakxFMUJRVTBzUTBGQlRpeERRVUZrTEVWQlFYZENMR2xDUVVGcFFpeE5RVUZOTEVOQlFVNHNRMEZCYWtJc1EwRkJlRUlzUTBGQlVqdEJRVU5FT3p0QlFVVkVMRmxCUVVrc1RVRkJUU3hMUVVGT0xFTkJRVmtzYlVKQlFWb3NRMEZCU2l4RlFVRnpRenRCUVVOd1F5eHBRa0ZCVHl4TFFVRkxMRmxCUVV3c1EwRkJhMElzUzBGQmJFSXNSVUZCZVVJc1owSkJRWHBDTEVOQlFWQTdRVUZEUkRzN1FVRkZSQ3hsUVVGUExFdEJRVkE3UVVGRFJEdEJRVGRHWlR0QlFVRkJPMEZCUVVFc2EwTkJLMFoxUWp0QlFVRkJPenRCUVVGQkxGbEJRVGRDTEU5QlFUWkNMSFZGUVVGdVFpeEpRVUZ0UWp0QlFVRkJMRmxCUVdJc1RVRkJZU3gxUlVGQlNpeEZRVUZKT3p0QlFVTnlReXhaUVVGSkxFOUJRVThzUzBGQlN5eFBRVUZNTEVOQlFXRXNTVUZCWWl4RFFVRnJRaXhMUVVGTExFOUJRVXdzUTBGQllTeE5RVUV2UWl4RFFVRllPMEZCUTBFc1dVRkJTU3hEUVVGRExFbEJRVXdzUlVGQlZ6dEJRVU5VTEdsQ1FVRlBMRXRCUVVzc1QwRkJUQ3hEUVVGaExFbEJRV0lzUTBGQmEwSXNTMEZCU3l4UFFVRk1MRU5CUVdFc1kwRkJMMElzUTBGQlVEdEJRVU5FT3p0QlFVVkVMRmxCUVVrc1dVRkJXU3hKUVVGYUxFbEJRVzlDTEZsQlFWa3NSMEZCYUVNc1NVRkJkVU1zVFVGQlRTeFBRVUZPTEVOQlFXTXNUMEZCWkN4RFFVRXpReXhGUVVGdFJUdEJRVU5xUlN4alFVRkpMRTFCUVUwc1QwRkJUaXhEUVVGakxFOUJRV1FzUTBGQlNpeEZRVUUwUWp0QlFVTXhRaXhuUWtGQlRTeFBRVUZQTEU5QlFVOHNTVUZCVUN4RFFVRlpMRWxCUVZvc1JVRkJhMElzVFVGQmJFSXNRMEZCZVVJN1FVRkJRU3h4UWtGQlR5eFJRVUZSTEU5QlFWSXNRMEZCWjBJc1IwRkJhRUlzU1VGQmRVSXNRMEZCUXl4RFFVRXZRanRCUVVGQkxHRkJRWHBDTEVOQlFXSTdRVUZEUVN4blFrRkJUU3hsUVVGbExFVkJRWEpDTzBGQlEwRXNhVUpCUVVzc1QwRkJUQ3hEUVVGaExHVkJRVTg3UVVGRGJFSXNNa0pCUVdFc1IwRkJZaXhKUVVGdlFpeE5RVUZMTEZsQlFVd3NRMEZCYTBJc1MwRkJTeXhIUVVGTUxFTkJRV3hDTEVWQlFUWkNMRTFCUVRkQ0xFTkJRWEJDTzBGQlEwUXNZVUZHUkR0QlFVZEJMRzFDUVVGUExGbEJRVkE3UVVGRFJEczdRVUZGUkN4alFVRk5MRlZCUVZVc1JVRkJhRUk3UVVGRFFTeGxRVUZMTEVsQlFVMHNSMEZCV0N4SlFVRnJRaXhKUVVGc1FpeEZRVUYzUWp0QlFVTjBRaXh2UWtGQlVTeEhRVUZTTEVsQlFXVXNTMEZCU3l4WlFVRk1MRU5CUVd0Q0xFdEJRVXNzUjBGQlRDeERRVUZzUWl4RlFVRTJRaXhOUVVFM1FpeERRVUZtTzBGQlEwUTdPMEZCUlVRc2FVSkJRVThzVDBGQlVEdEJRVU5FT3p0QlFVVkVMR1ZCUVU4c1MwRkJTeXhaUVVGTUxFTkJRV3RDTEV0QlFVc3NUMEZCVEN4RFFVRnNRaXhGUVVGcFF5eE5RVUZxUXl4RFFVRlFPMEZCUTBRN08wRkJSVVE3TzBGQk1VaG5RanRCUVVGQk8wRkJRVUVzTUVKQk1raGxPMEZCUVVFc1dVRkJOMElzVDBGQk5rSXNkVVZCUVc1Q0xFbEJRVzFDTzBGQlFVRXNXVUZCWWl4TlFVRmhMSFZGUVVGS0xFVkJRVWs3TzBGQlF6ZENMR1ZCUVU4c1MwRkJTeXhUUVVGTUxFTkJRV1VzVDBGQlppeEZRVUYzUWl4TlFVRjRRaXhEUVVGUU8wRkJRMFE3TzBGQlJVUTdPenM3TzBGQkwwaG5RanRCUVVGQk8wRkJRVUVzYVVOQmJVbE1MRTlCYmtsTExFVkJiVWxKTzBGQlEyeENMRmxCUVVrc1QwRkJUeXhQUVVGUUxFdEJRVzFDTEZkQlFYWkNMRVZCUVc5RE8wRkJRMnhETEc5Q1FVRlZMRk5CUVZNc1owSkJRVlFzUTBGQk1FSXNZVUZCTVVJc1EwRkJWanRCUVVORU96dEJRVVZFTEZsQlFVa3NUMEZCVHl4UFFVRlFMRXRCUVcxQ0xGRkJRWFpDTEVWQlFXbERPMEZCUXk5Q0xHOUNRVUZWTEZOQlFWTXNZVUZCVkN4RFFVRjFRaXhQUVVGMlFpeERRVUZXTzBGQlEwUTdPMEZCUlVRc05rSkJRVmNzVDBGQldDeEZRVUZ2UWl4TFFVRkxMRU5CUVV3c1JVRkJjRUk3UVVGRFJEczdRVUZGUkRzN1FVRXZTV2RDTzBGQlFVRTdRVUZCUVN4dlEwRm5Ta3NzVDBGb1Nrd3NSVUZuU21NN1FVRkROVUlzWlVGQlR5eEpRVUZKTEVsQlFVb3NRMEZCVXl4UFFVRlVMRU5CUVZBN1FVRkRSRHRCUVd4S1pUdEJRVUZCTzBGQlFVRXNNRUpCTmtOTE8wRkJRMjVDTEdWQlFWVXNTVUZCVml4VFFVRnJRaXhQUVVGc1FqdEJRVU5FTzBGQkwwTmxPenRCUVVGQk8wRkJRVUU3TzBGQmNVcHNRaXhUUVVGUExFbEJRVkE3UVVGRFJDeERRWFJLV1N4RlFVRmlPenRyUWtGM1NtVXNTVHM3T3pzN096czdPM0ZxUWtNdlNtWTdPenM3T3p0QlFVMUJPenM3TzBGQlEwRTdPenM3T3pzN08wRkJSVUVzU1VGQlRTeFJRVUZUTEZsQlFVMDdRVUZEYmtJN096czdPenRCUVUxQkxFMUJRVTBzVDBGQlR5eFBRVUZpTzBGQlEwRXNUVUZCVFN4VlFVRlZMRTlCUVdoQ08wRkJRMEVzVFVGQlRTeHhRa0ZCY1VJN1FVRkRla0lzWjBKQlFWa3NTVUZFWVR0QlFVVjZRaXhoUVVGVExFbEJSbWRDTzBGQlIzcENMR2xDUVVGaExFbEJTRms3UVVGSmVrSXNhMEpCUVdNN1FVRktWeXhIUVVFelFqczdRVUZQUVN4TlFVRkpMRzlDUVVGS08wRkJRMEU3T3pzN096dEJRV3BDYlVJc1RVRjFRbUlzUzBGMlFtRTdRVUYzUW1wQ096czdPenRCUVV0QkxIRkNRVUV3UWp0QlFVRkJMRlZCUVdRc1QwRkJZeXgxUlVGQlNpeEZRVUZKT3p0QlFVRkJPenRCUVVONFFpeFhRVUZMTEU5QlFVd3NSMEZCWlN4UFFVRlBMRTFCUVZBc1EwRkJZeXhyUWtGQlpDeEZRVUZyUXl4UFFVRnNReXhEUVVGbU96dEJRVVZCTEZkQlFVc3NTMEZCVEN4SFFVRmhMRVZCUVdJN1FVRkRRU3hYUVVGTExFOUJRVXdzUjBGQlpTeExRVUZtT3p0QlFVVkJPMEZCUTBFc1YwRkJTeXhqUVVGTU96dEJRVVZCTzBGQlEwRXNWMEZCU3l4WFFVRk1PMEZCUTBRN08wRkJSVVE3T3p0QlFURkRhVUk3UVVGQlFUdEJRVUZCTEhkQ1FUSkRaaXhSUVRORFpTeEZRVEpEVER0QlFVTldMR1ZCUVU4c1UwRkJVeXhoUVVGVUxFTkJRWFZDTEZGQlFYWkNMRU5CUVZBN1FVRkRSRHRCUVRkRFowSTdRVUZCUVR0QlFVRkJMR2REUVN0RFVEdEJRVU5TTEdWQlFVOHNUMEZCVHl4UlFVRlFMRU5CUVdkQ0xFbEJRV2hDTEVOQlFYRkNMRXRCUVhKQ0xFTkJRVEpDTEV0QlFVc3NUMEZCVEN4RFFVRmhMRlZCUVhoRExFVkJRVzlFTEVOQlFYQkVMRU5CUVZBN1FVRkRSRHRCUVdwRVowSTdRVUZCUVR0QlFVRkJMSGREUVcxRVF6dEJRVU5vUWl4WlFVRk5MRTlCUVU4c1MwRkJTeXhQUVVGTUxFVkJRV0k3UVVGRFFTeFpRVUZOTEV0QlFVc3NTVUZCU1N4TlFVRktMRU5CUVZjc1pVRkJXQ3hEUVVGWU8wRkJRMEVzV1VGQlRTeFZRVUZWTEVkQlFVY3NTVUZCU0N4RFFVRlJMRWxCUVZJc1EwRkJhRUk3TzBGQlJVRXNXVUZCU1N4WFFVRlhMRkZCUVZFc1EwRkJVaXhEUVVGbUxFVkJRVEpDTzBGQlEzcENMR2xDUVVGUExGRkJRVkVzUTBGQlVpeERRVUZRTzBGQlEwUTdPMEZCUlVRc1pVRkJUeXhKUVVGUU8wRkJRMFE3UVVFM1JHZENPMEZCUVVFN1FVRkJRU3c0UWtFclJGUXNVVUV2UkZNc1JVRXJSRU03UVVGRGFFSXNaVUZCVHl4UlFVRlFMRU5CUVdkQ0xFbEJRV2hDTEVkQlFUQkNMRXRCUVVzc1QwRkJUQ3hEUVVGaExGVkJRWFpETEZOQlFYRkVMRkZCUVhKRU8wRkJRMFE3UVVGcVJXZENPMEZCUVVFN1FVRkJRU3hyUTBGdFJVd3NVMEZ1UlVzc1JVRnRSVTBzVTBGdVJVNHNSVUZ0UldsQ08wRkJRMmhETEZsQlFVMHNVVUZCVVN4TFFVRkxMRmxCUVV3c1EwRkJhMElzVTBGQmJFSXNRMEZCWkR0QlFVTkJMRmxCUVUwc1VVRkJVU3hMUVVGTExGbEJRVXdzUTBGQmEwSXNVMEZCYkVJc1EwRkJaRHRCUVVOQkxHVkJRVThzVTBGQlV5eExRVUZVTEVsQlFXdENMRTFCUVUwc1NVRkJUaXhMUVVGbExFMUJRVTBzU1VGQk9VTTdRVUZEUkRzN1FVRkZSRHM3T3pzN1FVRjZSV2xDTzBGQlFVRTdRVUZCUVN4MVEwRTJSVUU3UVVGQlFUczdRVUZEWml4cFFrRkJVeXhuUWtGQlZDeERRVUV3UWl4UFFVRXhRaXhGUVVGdFF6dEJRVUZCTEdsQ1FVRlRMRTFCUVVzc1QwRkJUQ3hEUVVGaExFdEJRV0lzUTBGQlZEdEJRVUZCTEZOQlFXNURPMEZCUTBFc1pVRkJUeXhuUWtGQlVDeERRVUYzUWl4VlFVRjRRaXhGUVVGdlF6dEJRVUZCTEdsQ1FVRlRMRTFCUVVzc1lVRkJUQ3hEUVVGdFFpeExRVUZ1UWl4RFFVRlVPMEZCUVVFc1UwRkJjRU03UVVGRFFTeGxRVUZQTEdkQ1FVRlFMRU5CUVhkQ0xGbEJRWGhDTEVWQlFYTkRPMEZCUVVFc2FVSkJRVk1zVFVGQlN5eFpRVUZNTEVOQlFXdENMRXRCUVd4Q0xFTkJRVlE3UVVGQlFTeFRRVUYwUXp0QlFVTkJMR2xDUVVGVExHZENRVUZVTEVOQlFUQkNMR3RDUVVFeFFpeEZRVUU0UXp0QlFVRkJMR2xDUVVGVExFMUJRVXNzVjBGQlRDeERRVUZwUWl4TFFVRnFRaXhEUVVGVU8wRkJRVUVzVTBGQk9VTTdRVUZEUkRzN1FVRkZSRHM3UVVGd1JtbENPMEZCUVVFN096dEJRVEJHYWtJN08wRkJNVVpwUWl3clFrRTBSbElzVVVFMVJsRXNSVUUwUm5GRE8wRkJRVUU3TzBGQlFVRXNXVUZCYmtNc1dVRkJiVU1zZFVWQlFYQkNMRWxCUVc5Q08wRkJRVUVzV1VGQlpDeEpRVUZqTEhWRlFVRlFMRXRCUVU4N08wRkJRM0JFTEZsQlFVMHNWVUZCVlN4TFFVRkxMRU5CUVV3c1EwRkJUeXhWUVVGUUxFTkJRV2hDTzBGQlEwRXNXVUZCU1N4UFFVRktMRVZCUVdFN1FVRkRXQ3hqUVVGTkxHTkJRV01zVVVGQlVTeFpRVUZTTEVOQlFYRkNMRmRCUVhKQ0xFTkJRWEJDT3p0QlFVVkJMR05CUVVrc1MwRkJTeXhYUVVGTUxFTkJRV2xDTEZGQlFXcENMRVZCUVRKQ0xGZEJRVE5DTEVOQlFVb3NSVUZCTmtNN1FVRkRNME03UVVGRFJEczdRVUZGUkN4clFrRkJVU3hUUVVGU0xFTkJRV3RDTEUxQlFXeENMRU5CUVhsQ0xGTkJRWHBDT3p0QlFVVkJPMEZCUTBFc2FVSkJRVThzVDBGQlVDeERRVUZsTEZsQlFXWXNRMEZCTkVJc1JVRkJSU3hOUVVGTkxGZEJRVklzUlVGQk5VSXNSVUZCYlVRc1YwRkJia1FzUlVGQlowVXNUMEZCVHl4UlFVRlFMRU5CUVdkQ0xFbEJRV2hHT3p0QlFVVkJMR1ZCUVVzc1owSkJRVXdzUTBGQmMwSXNWMEZCZEVJc1JVRkJiVU1zYVVKQlFVMHNTVUZCZWtNN1FVRkRSRHM3UVVGRlJDeGhRVUZMTEdkQ1FVRk1MRU5CUVhOQ0xGRkJRWFJDTEVWQlFXZERMR2xDUVVGTkxFbEJRWFJET3p0QlFVVkJMSE5DUVVGakxGRkJRV1E3TzBGQlJVRTdRVUZEUVN4WlFVRk5MRlZCUVZVc1MwRkJTeXhEUVVGTUxHdENRVUZ6UWl4UlFVRjBRaXhSUVVGb1FqczdRVUZGUVN4blFrRkJVU3hUUVVGU0xFTkJRV3RDTEVkQlFXeENMRU5CUVhOQ0xGTkJRWFJDT3p0QlFVVkJPMEZCUTBFc1dVRkJUU3haUVVGWkxFdEJRVXNzV1VGQlRDeERRVUZyUWl4UlFVRnNRaXhEUVVGc1FqczdRVUZGUVR0QlFVTkJMRmxCUVVrc1lVRkJZU3hWUVVGVkxGZEJRVllzUlVGQmFrSXNSVUZCTUVNN1FVRkRlRU1zYjBKQlFWVXNXVUZCVmp0QlFVTkVPMEZCUTBRN08wRkJSVUVzV1VGQlNTeFBRVUZLTEVWQlFXRTdRVUZEV0N4alFVRk5MR1ZCUVdNc1VVRkJVU3haUVVGU0xFTkJRWEZDTEZkQlFYSkNMRU5CUVhCQ08wRkJRMEU3UVVGRFFTeHJRa0ZCVVN4SlFVRlNMRWRCUVdVc1NVRkJaanRCUVVOQkxHdENRVUZSTEdkQ1FVRlNMRWRCUVRKQ0xGbEJRVE5DT3p0QlFVVkJMR05CUVUwc2NVSkJRWEZDTEZOQlFYSkNMR3RDUVVGeFFpeEhRVUZOTzBGQlF5OUNMR2RDUVVGSkxGRkJRVkVzVTBGQlVpeERRVUZyUWl4UlFVRnNRaXhEUVVFeVFpeFRRVUV6UWl4RFFVRktMRVZCUVRKRE8wRkJRM3BETEhOQ1FVRlJMRk5CUVZJc1EwRkJhMElzVFVGQmJFSXNRMEZCZVVJc1UwRkJla0k3UVVGRFJEczdRVUZGUkN4dlFrRkJVU3hUUVVGU0xFTkJRV3RDTEUxQlFXeENMRU5CUVhsQ0xGRkJRVkVzU1VGQlVpeEhRVUZsTEZWQlFXWXNSMEZCTkVJc1YwRkJja1E3TzBGQlJVRXNiVUpCUVVzc1owSkJRVXdzUTBGQmMwSXNWMEZCZEVJc1JVRkJiVU1zYVVKQlFVMHNTMEZCZWtNN1FVRkRRU3h0UWtGQlN5eG5Ra0ZCVEN4RFFVRnpRaXhSUVVGUkxHZENRVUU1UWl4RlFVRm5SQ3hwUWtGQlRTeE5RVUYwUkRzN1FVRkZRU3h2UWtGQlVTeHRRa0ZCVWl4RFFVRTBRaXhwUWtGQlRTeGhRVUZzUXl4RlFVRnBSQ3hyUWtGQmFrUTdRVUZEUkN4WFFWaEVPenRCUVdGQkxHTkJRVWtzUzBGQlN5eFBRVUZNTEVOQlFXRXNXVUZCYWtJc1JVRkJLMEk3UVVGRE4wSXNiMEpCUVZFc1owSkJRVklzUTBGQmVVSXNhVUpCUVUwc1lVRkJMMElzUlVGQk9FTXNhMEpCUVRsRE8wRkJRMEVzYjBKQlFWRXNVMEZCVWl4RFFVRnJRaXhIUVVGc1FpeERRVUZ6UWl4VFFVRjBRanRCUVVORUxGZEJTRVFzVFVGSFR6dEJRVU5NTzBGQlEwUTdPMEZCUlVRc2EwSkJRVkVzVTBGQlVpeERRVUZyUWl4SFFVRnNRaXhEUVVGelFpeFBRVUZQTEZWQlFWQXNSMEZCYjBJc1YwRkJNVU03UVVGRFJEdEJRVU5HTzBGQk0wcG5RanRCUVVGQk8wRkJRVUVzZVVOQk5rcEZMRkZCTjBwR0xFVkJOa3BaTzBGQlF6TkNMRmxCUVVrc1EwRkJReXhMUVVGTExGbEJRVXdzUTBGQmEwSXNVVUZCYkVJc1EwRkJUQ3hGUVVGclF6dEJRVU5vUXl4bFFVRkxMRXRCUVV3c1EwRkJWeXhKUVVGWUxFTkJRV2RDTEcxQ1FVRlRMRkZCUVZRc1EwRkJhRUk3UVVGRFJEdEJRVU5HTzBGQmFrdG5RanRCUVVGQk8wRkJRVUVzYlVOQmJVdEtMRkZCYmt0SkxFVkJiVXROTzBGQlEzSkNMR1ZCUVU4c1MwRkJTeXhMUVVGTUxFTkJRVmNzU1VGQldDeERRVUZuUWp0QlFVRkJMR2xDUVVGUkxFdEJRVXNzU1VGQlRDeExRVUZqTEZGQlFYUkNPMEZCUVVFc1UwRkJhRUlzUTBGQlVEdEJRVU5FTzBGQmNrdG5RanRCUVVGQk8wRkJRVUVzYjBOQmRVdElMRk5CZGt0SExFVkJkVXRSTzBGQlEzWkNMR1ZCUVU4c1MwRkJTeXhMUVVGTUxFTkJRVmNzVFVGQldDeERRVUZyUWp0QlFVRkJMR2xDUVVGUkxGVkJRVlVzVDBGQlZpeERRVUZyUWl4TFFVRkxMRWxCUVhaQ0xFbEJRU3RDTEVOQlFVTXNRMEZCZUVNN1FVRkJRU3hUUVVGc1FpeERRVUZRTzBGQlEwUTdRVUY2UzJkQ08wRkJRVUU3UVVGQlFTeHpRMEV5UzBRc1IwRXpTME1zUlVFeVMwazdRVUZEYmtJc1pVRkJUeXhKUVVGSkxFdEJRVW9zUTBGQlZTeEhRVUZXTEVWQlFXVXNSMEZCWml4RFFVRnRRanRCUVVGQkxHbENRVUZSTEV0QlFVc3NTVUZCVEN4RlFVRlNPMEZCUVVFc1UwRkJia0lzUTBGQlVEdEJRVU5FTzBGQk4wdG5RanRCUVVGQk8wRkJRVUVzWjBOQkswdFFMRkZCTDB0UExFVkJLMHRITzBGQlEyeENMRmxCUVVrc1MwRkJTeXhwUWtGQlRDeExRVUV5UWl4SFFVRXZRaXhGUVVGdlF6dEJRVU5zUXp0QlFVTkJMR1ZCUVVzc1MwRkJUQ3hEUVVGWExFOUJRVmdzUTBGQmJVSXNWVUZCUXl4SlFVRkVMRVZCUVZVN1FVRkRNMElzYVVKQlFVc3NaMEpCUVV3c1EwRkJjMElzVVVGQmRFSTdRVUZEUkN4WFFVWkVPMEZCUjBFN1FVRkRSRHM3UVVGRlJDeFpRVUZOTEdGQlFXRXNTMEZCU3l4aFFVRk1MRU5CUVcxQ0xFdEJRVXNzWlVGQlRDeERRVUZ4UWl4TFFVRkxMR2xDUVVFeFFpeERRVUZ1UWl4RlFVRnBSU3hKUVVGcVJTeERRVUZ1UWp0QlFVTkJMRzFDUVVGWExFOUJRVmdzUTBGQmJVSXNWVUZCUXl4SlFVRkVMRVZCUVZVN1FVRkRNMElzWlVGQlN5eG5Ra0ZCVEN4RFFVRnpRaXhSUVVGMFFqdEJRVU5FTEZOQlJrUTdRVUZIUVN4aFFVRkxMR2xDUVVGTUxFZEJRWGxDTEVsQlFYcENPMEZCUTBRN1FVRTNUR2RDTzBGQlFVRTdRVUZCUVN4clEwRXJURXdzV1VFdlRFc3NSVUVyVEdkRE8wRkJRVUVzV1VGQmRrSXNZMEZCZFVJc2RVVkJRVTRzU1VGQlRUczdRVUZETDBNc1dVRkJUU3hoUVVGaExFdEJRVXNzWVVGQlRDeERRVUZ0UWl4TFFVRkxMR1ZCUVV3c1EwRkJjVUlzUzBGQlN5eHBRa0ZCTVVJc1EwRkJia0lzUlVGQmFVVXNTVUZCYWtVc1EwRkJia0k3UVVGRFFTeHRRa0ZCVnl4UFFVRllMRU5CUVcxQ0xGVkJRVU1zU1VGQlJDeEZRVUZWTzBGQlF6TkNMR1ZCUVVzc1YwRkJUQ3hEUVVGcFFpeFpRVUZxUWp0QlFVTkJMR05CUVVrc1QwRkJUeXhqUVVGUUxFdEJRVEJDTEZWQlFUbENMRVZCUVRCRE8wRkJRM2hETEdsQ1FVRkxMRzFDUVVGTUxFTkJRWGxDTEdOQlFYcENPMEZCUTBRN1FVRkRSaXhUUVV4RU8wRkJUVUVzWVVGQlN5eHBRa0ZCVEN4SFFVRjVRaXhKUVVGNlFqdEJRVU5FTzBGQmVFMW5RanRCUVVGQk8wRkJRVUVzZFVOQk1FMUJMRkZCTVUxQkxFVkJNRTFWTEZOQk1VMVdMRVZCTUUxNVF6dEJRVUZCTEZsQlFYQkNMRmRCUVc5Q0xIVkZRVUZPTEVsQlFVMDdPMEZCUTNoRUxGbEJRVTBzV1VGQldTeExRVUZMTEZsQlFVd3NRMEZCYTBJc1VVRkJiRUlzUTBGQmJFSTdRVUZEUVN4WlFVRkpMRk5CUVVvc1JVRkJaVHRCUVVOaUxHOUNRVUZWTEdGQlFWWXNRMEZCZDBJc1UwRkJlRUlzUlVGQmJVTXNWMEZCYmtNN1FVRkRSRHRCUVVOR08wRkJMMDFuUWp0QlFVRkJPMEZCUVVFc09FSkJhVTVVTEV0QmFrNVRMRVZCYVU1R08wRkJRMklzV1VGQlRTeFhRVUZYTEUxQlFVMHNUVUZCVGl4RFFVRmhMRmxCUVdJc1EwRkJNRUlzWlVGQk1VSXNRMEZCYWtJN1FVRkRRU3haUVVGTkxGZEJRVmNzUlVGQlJTeE5RVUZOTEUxQlFVNHNRMEZCWVN4WlFVRmlMRU5CUVRCQ0xHVkJRVEZDTEUxQlFTdERMRTFCUVdwRUxFTkJRV3BDT3p0QlFVVkJMRmxCUVVrc1VVRkJTaXhGUVVGak8wRkJRMW9zWTBGQlNTeGhRVUZoTEU5QlFXcENMRVZCUVRCQ08wRkJRM2hDTzBGQlEwRXNiVUpCUVU4c1QwRkJVQ3hEUVVGbExFbEJRV1k3UVVGRFFUdEJRVU5FT3p0QlFVVkVPenM3T3p0QlFVdEJMR05CUVVrc1MwRkJTeXhQUVVGTUxFTkJRV0VzVDBGQmFrSXNSVUZCTUVJN1FVRkRlRUlzYVVKQlFVc3NUMEZCVEN4RFFVRmhMRkZCUVdJN1FVRkRSQ3hYUVVaRUxFMUJSVTg3UVVGRFRDeHBRa0ZCU3l4UlFVRk1MRU5CUVdNc1VVRkJaQ3hGUVVGM1FpeEpRVUY0UWl4RlFVRTRRaXhSUVVFNVFqdEJRVU5FTzBGQlEwWTdRVUZEUmp0QlFYWlBaMEk3UVVGQlFUdEJRVUZCTEhORFFYbFBVenRCUVVGQkxGbEJRVm9zUzBGQldTeDFSVUZCU2l4RlFVRkpPenRCUVVONFFpeFpRVUZOTEZkQlFWY3NUVUZCVFN4TFFVRk9MRWRCUVdNc1RVRkJUU3hMUVVGT0xFTkJRVmtzU1VGQk1VSXNSMEZCYVVNc1NVRkJiRVE3UVVGRFFTeFpRVUZKTEVOQlFVTXNVVUZCVEN4RlFVRmxPMEZCUTJJN1FVRkRSRHM3UVVGRlJDeGhRVUZMTEZGQlFVd3NRMEZCWXl4UlFVRmtMRVZCUVhkQ0xFbEJRWGhDTEVWQlFUaENMRWxCUVRsQ08wRkJRMFE3UVVGb1VHZENPMEZCUVVFN1FVRkJRU3h4UTBGclVFWTdRVUZEWWl4WlFVRk5MRk5CUVZNc1EwRkJReXhMUVVGTExFOUJRVXdzUzBGQmFVSXNTMEZCU3l4UFFVRk1MRWRCUVdVc1MwRkJaaXhEUVVGeFFpeEhRVUZ5UWl4RFFVRnFRaXhIUVVFMlF5eEZRVUU1UXl4RlFVRnJSQ3hOUVVGc1JDeERRVUY1UkR0QlFVRkJMR2xDUVVGTExFVkJRVVVzVFVGQlJpeEhRVUZYTEVOQlFXaENPMEZCUVVFc1UwRkJla1FzUTBGQlpqdEJRVU5CTEZsQlFVa3NUMEZCVHl4TlFVRlFMRWRCUVdkQ0xFTkJRWEJDTEVWQlFYVkNPMEZCUTNKQ08wRkJRMEVzYVVKQlFVOHNTMEZCVUR0QlFVTkVPenRCUVVWRUxHRkJRVXNzWjBKQlFVd3NRMEZCYzBJc1YwRkJkRUlzUlVGQmJVTXNhVUpCUVUwc1NVRkJla01zUlVGQkswTXNUVUZCTDBNN08wRkJSVUVzV1VGQlRTeFZRVUZWTEV0QlFVc3NaVUZCVEN4RlFVRm9RanRCUVVOQkxGbEJRVWtzVDBGQlNpeEZRVUZoTzBGQlExZ3NaVUZCU3l4UlFVRk1MRU5CUVdNc1QwRkJaRHRCUVVORU8wRkJRMFk3TzBGQlJVUTdPenM3UVVGcVVXbENPMEZCUVVFN1FVRkJRU3h2UTBGdlVVZzdRVUZCUVRzN1FVRkRXaXhaUVVGTkxGRkJRVkVzVTBGQlV5eG5Ra0ZCVkN4RFFVRXdRaXhoUVVFeFFpeERRVUZrT3p0QlFVVkJMRmxCUVVrc1EwRkJReXhMUVVGTUxFVkJRVms3UVVGRFZqdEJRVU5FT3p0QlFVVkVMR05CUVUwc1QwRkJUaXhEUVVGakxGVkJRVU1zU1VGQlJDeEZRVUZWTzBGQlEzUkNMR05CUVVrc1YwRkJWeXhMUVVGTExGbEJRVXdzUTBGQmEwSXNWMEZCYkVJc1EwRkJaanRCUVVOQk96czdPMEZCU1VFc1kwRkJTU3hEUVVGRExGRkJRVXdzUlVGQlpUdEJRVU5pTEhWQ1FVRlhMRXRCUVVzc1VVRkJhRUk3UVVGRFJEczdRVUZGUkN4cFFrRkJTeXhyUWtGQlRDeERRVUYzUWl4UlFVRjRRanRCUVVORUxGTkJXRVE3UVVGWlJEdEJRWFpTWjBJN1FVRkJRVHRCUVVGQkxEWkNRWGxTVml4UlFYcFNWU3hGUVhsU2NVSTdRVUZCUVN4WlFVRnlRaXhaUVVGeFFpeDFSVUZCVGl4SlFVRk5PenRCUVVOd1F5eGhRVUZMTEdsQ1FVRk1MRWRCUVhsQ0xGRkJRWHBDT3p0QlFVVkJMRmxCUVVrc1owSkJRV2RDTEdGQlFXRXNSMEZCYWtNc1JVRkJjME03UVVGRGNFTXNaVUZCU3l4clFrRkJUQ3hEUVVGM1FpeFJRVUY0UWp0QlFVTkVPenRCUVVWRUxHVkJRVThzU1VGQlVEdEJRVU5FTzBGQmFsTm5RanRCUVVGQk8wRkJRVUVzT0VKQmJWTmxPMEZCUVVFc1dVRkJNVUlzWjBKQlFUQkNMSFZGUVVGUUxFdEJRVTg3TzBGQlF6bENPMEZCUTBFc1dVRkJTU3hMUVVGTExFOUJRVlFzUlVGQmEwSTdRVUZEYUVJc1owSkJRVTBzU1VGQlNTeExRVUZLTEVOQlFXRXNTVUZCWWl4NVEwRkJUanRCUVVORU96dEJRVVZFTEdGQlFVc3NUMEZCVEN4SFFVRmxMRWxCUVdZN08wRkJSVUU3UVVGRFFTeFpRVUZKTEU5QlFVOHNUMEZCV0N4RlFVRnZRanRCUVVOc1FpdzJRa0ZCYlVJc1NVRkJia0k3UVVGRFJEczdRVUZGUkN4WlFVRkpMRmRCUVZjc1MwRkJTeXhsUVVGTUxFVkJRV1k3UVVGRFFTeFpRVUZKTEVOQlFVTXNTMEZCU3l4WlFVRk1MRU5CUVd0Q0xGRkJRV3hDTEVOQlFVd3NSVUZCYTBNN1FVRkRhRU1zY1VKQlFWY3NTMEZCU3l4UFFVRk1MRU5CUVdFc1YwRkJlRUk3UVVGRFJEczdRVUZGUkN4WlFVRkpMRzlDUVVGdlFpeERRVUZETEV0QlFVc3NUMEZCVEN4RFFVRmhMRmRCUVhSRExFVkJRVzFFTzBGQlEycEVMR2RDUVVGTkxFbEJRVWtzUzBGQlNpeERRVUZoTEVsQlFXSXNNa1JCUVU0N1FVRkRSRHM3UVVGRlJEczdPenRCUVVsQkxGbEJRVWtzUzBGQlN5eFBRVUZNTEVOQlFXRXNUMEZCYWtJc1JVRkJNRUk3UVVGRGVFSXNaVUZCU3l4UFFVRk1MRU5CUVdFc1VVRkJZanRCUVVORU96dEJRVVZFTEdGQlFVc3NVVUZCVEN4RFFVRmpMRzFDUVVGdFFpeExRVUZMTEU5QlFVd3NRMEZCWVN4WFFVRm9ReXhIUVVFNFF5eFJRVUUxUkR0QlFVTkVPenRCUVVWRU96dEJRWEJWYVVJN1FVRkJRVHRCUVVGQkxHOURRWEZWU1N4UFFYSlZTaXhGUVhGVllUdEJRVU0xUWl4bFFVRlBMRWxCUVVrc1MwRkJTaXhEUVVGVkxFOUJRVllzUTBGQlVEdEJRVU5FTzBGQmRsVm5RanRCUVVGQk8wRkJRVUVzTUVKQmMwWkpPMEZCUTI1Q0xHVkJRVlVzU1VGQlZpeFRRVUZyUWl4UFFVRnNRanRCUVVORU8wRkJlRVpuUWpzN1FVRkJRVHRCUVVGQk96dEJRVEJWYmtJc1UwRkJUeXhMUVVGUU8wRkJRMFFzUTBFelZXRXNSVUZCWkRzN2EwSkJObFZsTEVzN096czdPenM3T3pzN08zRnFRa04wVm1ZN096czdPenRCUVUxQk96dEJRVU5CT3pzN08wRkJSVUVzU1VGQlRTeFBRVUZSTEZsQlFVMDdRVUZEYkVJN096czdPenRCUVUxQkxFMUJRVTBzVDBGQlR5eE5RVUZpTzBGQlEwRXNUVUZCVFN4VlFVRlZMRTlCUVdoQ096dEJRVVZCTEUxQlFVMHNiMEpCUVc5Q0xHbENRVUV4UWpzN1FVRkZRVHM3T3pzN08wRkJXbXRDTEUxQmEwSmFMRWxCYkVKWk8wRkJiVUpvUWpzN096dEJRVWxCTEd0Q1FVRlpMRkZCUVZvc1JVRkJjMEk3UVVGQlFUczdRVUZEY0VJc1YwRkJTeXhKUVVGTUxFZEJRVmtzVVVGQldqdEJRVU5CTEZkQlFVc3NUVUZCVEN4SFFVRmpMRVZCUVdRN1FVRkRRU3hYUVVGTExGbEJRVXdzUjBGQmIwSXNTVUZCY0VJN1FVRkRRU3hYUVVGTExHTkJRVXdzUjBGQmMwSXNTVUZCZEVJN1FVRkRSRHM3UVVGRlJEczdRVUU1UW1kQ08wRkJRVUU3T3p0QlFXOURhRUk3T3pzN1FVRndRMmRDTEd0RFFYZERTanRCUVVOV0xHVkJRVThzUzBGQlN5eE5RVUZhTzBGQlEwUTdPMEZCUlVRN096czdPMEZCTlVOblFqdEJRVUZCTzBGQlFVRXNiME5CWjBSR08wRkJRMW9zWlVGQlR5eExRVUZMTEZsQlFWbzdRVUZEUkRzN1FVRkZSRHM3T3pzN1FVRndSR2RDTzBGQlFVRTdRVUZCUVN3d1EwRjNSRWs3UVVGRGJFSXNaVUZCVHl4TFFVRkxMR05CUVZvN1FVRkRSRHRCUVRGRVpUdEJRVUZCTzBGQlFVRXNjVU5CTkVSRU8wRkJRVUU3TzBGQlEySXNXVUZCVFN4alFVRmpMRk5CUVZNc1lVRkJWQ3hyUWtGQmMwTXNTMEZCU3l4SlFVRXpReXhSUVVGd1FqczdRVUZGUVN3MlFrRkJVeXhMUVVGTExGZEJRVXdzUlVGQlZDeEZRVUUyUWl4VlFVRkRMRkZCUVVRc1JVRkJZenRCUVVONlF5eGpRVUZKTEZOQlFWTXNaMEpCUVZVc1QwRkJWaXhGUVVGdFFpeFJRVUZ1UWl4RlFVRTJRaXhSUVVFM1FpeEZRVUYxUXp0QlFVTnNSQ3huUWtGQlNTeFJRVUZLTEVWQlFXTTdRVUZEV2l4dlFrRkJUU3hKUVVGT0xFTkJRVmNzVVVGQldDeEZRVUZ4UWl4UFFVRnlRaXhEUVVFMlFpeFZRVUZETEVWQlFVUXNSVUZCVVR0QlFVTnVReXh0UWtGQlJ5eFRRVUZJTEVkQlFXVXNVVUZCWmp0QlFVTkVMR1ZCUmtRN1FVRkhSQ3hoUVVwRUxFMUJTVTg3UVVGRFRDeHpRa0ZCVVN4VFFVRlNMRWRCUVc5Q0xGRkJRWEJDTzBGQlEwUTdRVUZEUml4WFFWSkVPenRCUVZWQkxHTkJRVWtzVFVGQlN5eHBRa0ZCVEN4RlFVRktMRVZCUVRoQ08wRkJRelZDTEhGQ1FVRlRMRTFCUVVzc2FVSkJRVXdzUlVGQlZEdEJRVU5FT3p0QlFVVkVMR2xDUVVGUExGZEJRVkFzUlVGQmIwSXNVVUZCY0VJc1JVRkJPRUlzV1VGQldTeG5Ra0ZCV2l4RFFVRTJRaXhwUWtGQk4wSXNRMEZCT1VJN1FVRkRSQ3hUUVdoQ1JDeEZRV2RDUnl4SlFXaENTRHRCUVdsQ1JEczdRVUZGUkRzN1FVRkZRVHM3T3pzN1FVRndSbWRDTzBGQlFVRTdRVUZCUVN4MVEwRjNSa01zVlVGNFJrUXNSVUYzUm1FN1FVRkRNMElzWVVGQlN5eE5RVUZNTEVOQlFWa3NTVUZCV2l4RFFVRnBRaXhWUVVGcVFqdEJRVU5FT3p0QlFVVkVPenM3T3pzN1FVRTFSbWRDTzBGQlFVRTdRVUZCUVN4clEwRnBSMG9zV1VGcVIwa3NSVUZwUjFVN1FVRkRlRUlzV1VGQlNTeFBRVUZQTEZsQlFWQXNTMEZCZDBJc1VVRkJOVUlzUlVGQmMwTTdRVUZEY0VNc1owSkJRVTBzU1VGQlNTeExRVUZLTEVOQlFWVXNhVVJCUVdkRUxGbEJRV2hFTEhsRFFVRm5SQ3haUVVGb1JDeExRVUVyUkN4WFFVRjZSU3hEUVVGT08wRkJRMFE3UVVGRFJDeGhRVUZMTEZsQlFVd3NSMEZCYjBJc1dVRkJjRUk3UVVGRFJEczdRVUZGUkRzN096czdRVUY0UjJkQ08wRkJRVUU3UVVGQlFTd3dRMEUwUjBrc1kwRTFSMG9zUlVFMFIyOUNPMEZCUTJ4RExGbEJRVWtzVDBGQlR5eGpRVUZRTEV0QlFUQkNMRlZCUVRsQ0xFVkJRVEJETzBGQlEzaERMR2RDUVVGTkxFbEJRVWtzUzBGQlNpeERRVUZWTERoRVFVRTJSQ3hqUVVFM1JDeDVRMEZCTmtRc1kwRkJOMFFzUzBGQk9FVXNWMEZCZUVZc1EwRkJUanRCUVVORU8wRkJRMFFzWVVGQlN5eGpRVUZNTEVkQlFYTkNMR05CUVhSQ08wRkJRMFE3TzBGQlJVUTdPenM3T3p0QlFXNUlaMEk3UVVGQlFUdEJRVUZCTEc5RFFYZElSaXhUUVhoSVJTeEZRWGRJTWtJN1FVRkJRVHM3UVVGQlFTeFpRVUZzUWl4WFFVRnJRaXgxUlVGQlNpeEZRVUZKT3p0QlFVTjZReXhaUVVGTkxIZENRVUZ6UWl4VlFVRlZMRTFCUVZZc1EwRkJhVUlzUTBGQmFrSXNSVUZCYjBJc1YwRkJjRUlzUlVGQmRFSXNSMEZCTUVRc1ZVRkJWU3hMUVVGV0xFTkJRV2RDTEVOQlFXaENMRU5CUVdoRk96dEJRVVZCTEdGQlFVc3NUVUZCVEN4RFFVRlpMRTlCUVZvc1EwRkJiMElzVlVGQlF5eExRVUZFTEVWQlFWYzdRVUZETjBJc1kwRkJUU3hoUVVGaExFMUJRVTBzVTBGQlRpeERRVUZ1UWp0QlFVTkJMR05CUVUwc2EwSkJRV3RDTEUxQlFVMHNZMEZCVGl4RFFVRjRRanRCUVVOQkxHTkJRVWtzVDBGQlR5eFZRVUZRTEV0QlFYTkNMRlZCUVRGQ0xFVkJRWE5ETzBGQlEzQkRMSFZDUVVGWExFdEJRVmdzVTBGQmRVSXNWMEZCZGtJN1FVRkRSRHM3UVVGRlJEdEJRVU5CTEdOQlFVa3NUMEZCVHl4bFFVRlFMRXRCUVRKQ0xGVkJRUzlDTEVWQlFUSkRPMEZCUTNwRExEUkNRVUZuUWl4TFFVRm9RaXhUUVVFMFFpeFhRVUUxUWp0QlFVTkVPMEZCUTBZc1UwRllSRHM3UVVGaFFTeDVRMEZCYTBJc1UwRkJiRUlzUlVGQk5rSXNTMEZCU3l4SlFVRnNReXhGUVVGM1F5eFhRVUY0UXp0QlFVTkVPMEZCZWtsbE8wRkJRVUU3UVVGQlFTd3dRa0ZuUTBzN1FVRkRia0lzWlVGQlZTeEpRVUZXTEZOQlFXdENMRTlCUVd4Q08wRkJRMFE3UVVGc1EyVTdPMEZCUVVFN1FVRkJRVHM3UVVFMFNXeENMRk5CUVU4c1NVRkJVRHRCUVVORUxFTkJOMGxaTEVWQlFXSTdPMnRDUVN0SlpTeEpPenM3T3pzN096czdRVU5zU21ZN096czdRVUZEUVRzN096dEJRVU5CT3pzN08wRkJSMEU3T3pzN1FVRkRRVHM3T3p0QlFVTkJPenM3TzBGQlEwRTdPenM3UVVGRFFUczdPenRCUVVOQk96czdPMEZCUTBFN096czdRVUZEUVRzN096dEJRVU5CT3pzN08wRkJRMEU3T3pzN1FVRkRRVHM3T3p0QlFVTkJPenM3TzBGQlEwRTdPenM3T3p0QlFYWkNRVHM3T3pzN08wRkJlVUpCTEVsQlFVMHNUVUZCVFN4RlFVRmFPenRCUVVWQk96czdPenM3TzBGQmFrSkJPMEZCYzBKQkxFbEJRVWtzUzBGQlNpeEhRVUZaTEZWQlFVTXNUMEZCUkN4RlFVRmhPMEZCUTNaQ0xFMUJRVWtzVDBGQlR5eEpRVUZKTEUxQlFWZ3NTMEZCYzBJc1YwRkJNVUlzUlVGQmRVTTdRVUZEY2tNc1VVRkJTU3hOUVVGS0xFZEJRV0VzWjBKQlFVMHNZVUZCVGl4RFFVRnZRaXhQUVVGd1FpeERRVUZpTzBGQlEwUTdRVUZEUkN4VFFVRlBMRWxCUVVrc1RVRkJXRHRCUVVORUxFTkJURVE3TzBGQlQwRTdPenM3TzBGQlMwRXNTVUZCU1N4SlFVRktMRWRCUVZjc1pVRkJTeXhoUVVGb1FqczdRVUZGUVRzN096czdRVUZMUVN4SlFVRkpMRTlCUVVvc1IwRkJZeXhyUWtGQlVTeGhRVUYwUWpzN1FVRkZRVHM3T3pzN1FVRkxRU3hKUVVGSkxGbEJRVW9zUjBGQmJVSXNkVUpCUVdFc1lVRkJhRU03TzBGQlJVRTdPenM3TzBGQlMwRXNTVUZCU1N4TlFVRktMRWRCUVdFc1ZVRkJReXhQUVVGRUxFVkJRV0U3UVVGRGVFSXNUVUZCU1N4UlFVRlJMRWxCUVZJc1MwRkJhVUlzYVVKQlFVOHNWVUZCVUN4RlFVRnlRaXhGUVVFd1F6dEJRVU40UXp0QlFVTkJMRmRCUVU4c2FVSkJRVThzWVVGQlVDeERRVUZ4UWl4UFFVRnlRaXhEUVVGUU8wRkJRMFE3TzBGQlJVUXNUVUZCU1N4UlFVRlJMRWxCUVZJc1MwRkJhVUlzYTBKQlFWRXNWVUZCVWl4RlFVRnlRaXhGUVVFeVF6dEJRVU42UXp0QlFVTkJMRmRCUVU4c2EwSkJRVkVzWVVGQlVpeERRVUZ6UWl4UFFVRjBRaXhEUVVGUU8wRkJRMFE3TzBGQlJVUXNUVUZCU1N4UlFVRlJMRWxCUVZJc1MwRkJhVUlzYVVKQlFXRXNWVUZCWWl4RlFVRnlRaXhGUVVGblJEdEJRVU01UXp0QlFVTkJMRmRCUVU4c2FVSkJRV0VzWVVGQllpeERRVUV5UWl4UFFVRXpRaXhEUVVGUU8wRkJRMFE3TzBGQlJVUTdRVUZEUVN4VFFVRlBMR2xDUVVGUExHRkJRVkFzUTBGQmNVSXNUMEZCY2tJc1EwRkJVRHRCUVVORUxFTkJiRUpFT3p0QlFXOUNRVHM3T3pzN1FVRkxRU3hKUVVGSkxGRkJRVW9zUjBGQlpTeHRRa0ZCVXl4aFFVRjRRanM3UVVGRlFUczdPenM3UVVGTFFTeEpRVUZKTEZOQlFVb3NSMEZCWjBJc2IwSkJRVlVzWVVGQk1VSTdPMEZCUjBFN096czdPMEZCUzBFc1NVRkJTU3hIUVVGS0xFZEJRVlVzWTBGQlNTeGhRVUZrT3p0QlFVVkJPenM3T3p0QlFVdEJMRWxCUVVrc1VVRkJTaXhIUVVGbExHMUNRVUZUTEdGQlFYaENPenRCUVVWQk96czdPenRCUVV0QkxFbEJRVWtzVFVGQlNpeEhRVUZoTEdsQ1FVRlBMR0ZCUVhCQ096dEJRVVZCT3pzN096dEJRVXRCTEVsQlFVa3NVMEZCU2l4SFFVRm5RaXh2UWtGQlZTeGhRVUV4UWpzN1FVRkZRVHM3T3pzN1FVRkxRU3hKUVVGSkxGRkJRVW9zUjBGQlpTeFZRVUZETEU5QlFVUXNSVUZCWVR0QlFVTXhRaXhOUVVGSkxGRkJRVkVzVFVGQldpeEZRVUZ2UWp0QlFVTnNRanRCUVVOQkxGZEJRVThzYVVKQlFXVXNZVUZCWml4RFFVRTJRaXhQUVVFM1FpeERRVUZRTzBGQlEwUTdPMEZCUlVRN1FVRkRRU3hUUVVGUExHMUNRVUZUTEdGQlFWUXNRMEZCZFVJc1QwRkJka0lzUTBGQlVEdEJRVU5FTEVOQlVrUTdPMEZCVlVFN1FVRkRRU3hQUVVGUExFMUJRVkFzUjBGQlowSXNSMEZCYUVJN08ydENRVVZsTEVjaUxDSm1hV3hsSWpvaVoyVnVaWEpoZEdWa0xtcHpJaXdpYzI5MWNtTmxVbTl2ZENJNklpSXNJbk52ZFhKalpYTkRiMjUwWlc1MElqcGJJaWhtZFc1amRHbHZiaUJsS0hRc2JpeHlLWHRtZFc1amRHbHZiaUJ6S0c4c2RTbDdhV1lvSVc1YmIxMHBlMmxtS0NGMFcyOWRLWHQyWVhJZ1lUMTBlWEJsYjJZZ2NtVnhkV2x5WlQwOVhDSm1kVzVqZEdsdmJsd2lKaVp5WlhGMWFYSmxPMmxtS0NGMUppWmhLWEpsZEhWeWJpQmhLRzhzSVRBcE8ybG1LR2twY21WMGRYSnVJR2tvYnl3aE1DazdkbUZ5SUdZOWJtVjNJRVZ5Y205eUtGd2lRMkZ1Ym05MElHWnBibVFnYlc5a2RXeGxJQ2RjSWl0dksxd2lKMXdpS1R0MGFISnZkeUJtTG1OdlpHVTlYQ0pOVDBSVlRFVmZUazlVWDBaUFZVNUVYQ0lzWm4xMllYSWdiRDF1VzI5ZFBYdGxlSEJ2Y25Sek9udDlmVHQwVzI5ZFd6QmRMbU5oYkd3b2JDNWxlSEJ2Y25SekxHWjFibU4wYVc5dUtHVXBlM1poY2lCdVBYUmJiMTFiTVYxYlpWMDdjbVYwZFhKdUlITW9iajl1T21VcGZTeHNMR3d1Wlhod2IzSjBjeXhsTEhRc2JpeHlLWDF5WlhSMWNtNGdibHR2WFM1bGVIQnZjblJ6ZlhaaGNpQnBQWFI1Y0dWdlppQnlaWEYxYVhKbFBUMWNJbVoxYm1OMGFXOXVYQ0ltSm5KbGNYVnBjbVU3Wm05eUtIWmhjaUJ2UFRBN2J6eHlMbXhsYm1kMGFEdHZLeXNwY3loeVcyOWRLVHR5WlhSMWNtNGdjMzBwSWl3aVpYaHdiM0owSUdaMWJtTjBhVzl1SUdScGMzQmhkR05vVjJsdVJHOWpSWFpsYm5Rb1pYWmxiblJPWVcxbExDQnRiMlIxYkdWT1lXMWxMQ0JrWlhSaGFXd2dQU0I3ZlNrZ2UxeHVJQ0JqYjI1emRDQm1kV3hzUlhabGJuUk9ZVzFsSUQwZ1lDUjdaWFpsYm5ST1lXMWxmUzV3YUM0a2UyMXZaSFZzWlU1aGJXVjlZRnh1SUNCM2FXNWtiM2N1WkdsemNHRjBZMmhGZG1WdWRDaHVaWGNnUTNWemRHOXRSWFpsYm5Rb1puVnNiRVYyWlc1MFRtRnRaU3dnZXlCa1pYUmhhV3dnZlNrcFhHNGdJR1J2WTNWdFpXNTBMbVJwYzNCaGRHTm9SWFpsYm5Rb2JtVjNJRU4xYzNSdmJVVjJaVzUwS0daMWJHeEZkbVZ1ZEU1aGJXVXNJSHNnWkdWMFlXbHNJSDBwS1Z4dWZWeHVYRzVsZUhCdmNuUWdablZ1WTNScGIyNGdaR2x6Y0dGMFkyaEZiR1Z0Wlc1MFJYWmxiblFvWkc5dFJXeGxiV1Z1ZEN3Z1pYWmxiblJPWVcxbExDQnRiMlIxYkdWT1lXMWxMQ0JrWlhSaGFXd2dQU0I3ZlNrZ2UxeHVJQ0JqYjI1emRDQm1kV3hzUlhabGJuUk9ZVzFsSUQwZ1lDUjdaWFpsYm5ST1lXMWxmUzV3YUM0a2UyMXZaSFZzWlU1aGJXVjlZRnh1SUNCa2IyMUZiR1Z0Wlc1MExtUnBjM0JoZEdOb1JYWmxiblFvYm1WM0lFTjFjM1J2YlVWMlpXNTBLR1oxYkd4RmRtVnVkRTVoYldVc0lIc2daR1YwWVdsc0lIMHBLVnh1ZlZ4dVhHNWxlSEJ2Y25RZ1puVnVZM1JwYjI0Z1pHbHpjR0YwWTJoUVlXZGxSWFpsYm5Rb1pYWmxiblJPWVcxbExDQndZV2RsVG1GdFpTd2daR1YwWVdsc0lEMGdlMzBwSUh0Y2JpQWdZMjl1YzNRZ1puVnNiRVYyWlc1MFRtRnRaU0E5SUdBa2UzQmhaMlZPWVcxbGZTNGtlMlYyWlc1MFRtRnRaWDFnWEc0Z0lIZHBibVJ2ZHk1a2FYTndZWFJqYUVWMlpXNTBLRzVsZHlCRGRYTjBiMjFGZG1WdWRDaG1kV3hzUlhabGJuUk9ZVzFsTENCN0lHUmxkR0ZwYkNCOUtTbGNiaUFnWkc5amRXMWxiblF1WkdsemNHRjBZMmhGZG1WdWRDaHVaWGNnUTNWemRHOXRSWFpsYm5Rb1puVnNiRVYyWlc1MFRtRnRaU3dnZXlCa1pYUmhhV3dnZlNrcFhHNTlYRzRpTENJdkx5QkFkRzlrYnlCclpXVndJRDljYm1sbUlDaDBlWEJsYjJZZ2QybHVaRzkzSUNFOVBTQW5kVzVrWldacGJtVmtKeWtnZTF4dUlDQjNhVzVrYjNjdVlXUmtSWFpsYm5STWFYTjBaVzVsY2lnblpYSnliM0luTENBb0tTQTlQaUI3WEc0Z0lDQWdZMjl1YzI5c1pTNWxjbkp2Y2lnblFXNGdaWEp5YjNJZ2FHRnpJRzlqWTNWeVpXUWhJRmx2ZFNCallXNGdjR1Z1SUdGdUlHbHpjM1ZsSUdobGNtVTZJR2gwZEhCek9pOHZaMmwwYUhWaUxtTnZiUzl4ZFdGeWF5MWtaWFl2VUdodmJtOXVMVVp5WVcxbGQyOXlheTlwYzNOMVpYTW5LVnh1SUNCOUtWeHVmVnh1WEc0dkx5QlZjMlVnWVhaaGFXeGhZbXhsSUdWMlpXNTBjMXh1YkdWMElHRjJZV2xzWVdKc1pVVjJaVzUwY3lBOUlGc25iVzkxYzJWa2IzZHVKeXdnSjIxdmRYTmxiVzkyWlNjc0lDZHRiM1Z6WlhWd0oxMWNibXhsZENCMGIzVmphRk5qY21WbGJpQTlJR1poYkhObFhHNWNibWxtSUNoMGVYQmxiMllnZDJsdVpHOTNJQ0U5UFNBbmRXNWtaV1pwYm1Wa0p5a2dlMXh1SUNCcFppQW9LQ2R2Ym5SdmRXTm9jM1JoY25RbklHbHVJSGRwYm1SdmR5a2dmSHdnZDJsdVpHOTNMa1J2WTNWdFpXNTBWRzkxWTJnZ0ppWWdaRzlqZFcxbGJuUWdhVzV6ZEdGdVkyVnZaaUJFYjJOMWJXVnVkRlJ2ZFdOb0tTQjdYRzRnSUNBZ2RHOTFZMmhUWTNKbFpXNGdQU0IwY25WbFhHNGdJQ0FnWVhaaGFXeGhZbXhsUlhabGJuUnpJRDBnV3lkMGIzVmphSE4wWVhKMEp5d2dKM1J2ZFdOb2JXOTJaU2NzSUNkMGIzVmphR1Z1WkNjc0lDZDBiM1ZqYUdOaGJtTmxiQ2RkWEc0Z0lIMWNibHh1SUNCcFppQW9kMmx1Wkc5M0xtNWhkbWxuWVhSdmNpNXdiMmx1ZEdWeVJXNWhZbXhsWkNrZ2UxeHVJQ0FnSUdGMllXbHNZV0pzWlVWMlpXNTBjeUE5SUZzbmNHOXBiblJsY21SdmQyNG5MQ0FuY0c5cGJuUmxjbTF2ZG1VbkxDQW5jRzlwYm5SbGNuVndKeXdnSjNCdmFXNTBaWEpqWVc1alpXd25YVnh1SUNCOUlHVnNjMlVnYVdZZ0tIZHBibVJ2ZHk1dVlYWnBaMkYwYjNJdWJYTlFiMmx1ZEdWeVJXNWhZbXhsWkNrZ2UxeHVJQ0FnSUdGMllXbHNZV0pzWlVWMlpXNTBjeUE5SUZzblRWTlFiMmx1ZEdWeVJHOTNiaWNzSUNkTlUxQnZhVzUwWlhKTmIzWmxKeXdnSjAxVFVHOXBiblJsY2xWd0p5d2dKMDFUVUc5cGJuUmxja05oYm1ObGJDZGRYRzRnSUgxY2JuMWNibHh1WTI5dWMzUWdaV3dnUFNCa2IyTjFiV1Z1ZEM1amNtVmhkR1ZGYkdWdFpXNTBLQ2RrYVhZbktWeHVZMjl1YzNRZ2RISmhibk5wZEdsdmJuTWdQU0JiWEc0Z0lIc2dibUZ0WlRvZ0ozUnlZVzV6YVhScGIyNG5MQ0J6ZEdGeWREb2dKM1J5WVc1emFYUnBiMjV6ZEdGeWRDY3NJR1Z1WkRvZ0ozUnlZVzV6YVhScGIyNWxibVFuSUgwc1hHNGdJSHNnYm1GdFpUb2dKMDF2ZWxSeVlXNXphWFJwYjI0bkxDQnpkR0Z5ZERvZ0ozUnlZVzV6YVhScGIyNXpkR0Z5ZENjc0lHVnVaRG9nSjNSeVlXNXphWFJwYjI1bGJtUW5JSDBzWEc0Z0lIc2dibUZ0WlRvZ0oyMXpWSEpoYm5OcGRHbHZiaWNzSUhOMFlYSjBPaUFuYlhOVWNtRnVjMmwwYVc5dVUzUmhjblFuTENCbGJtUTZJQ2R0YzFSeVlXNXphWFJwYjI1RmJtUW5JSDBzWEc0Z0lIc2dibUZ0WlRvZ0oxZGxZbXRwZEZSeVlXNXphWFJwYjI0bkxDQnpkR0Z5ZERvZ0ozZGxZbXRwZEZSeVlXNXphWFJwYjI1VGRHRnlkQ2NzSUdWdVpEb2dKM2RsWW10cGRGUnlZVzV6YVhScGIyNUZibVFuSUgwc1hHNWRYRzVqYjI1emRDQmhibWx0WVhScGIyNXpJRDBnVzF4dUlDQjdJRzVoYldVNklDZGhibWx0WVhScGIyNG5MQ0J6ZEdGeWREb2dKMkZ1YVcxaGRHbHZibk4wWVhKMEp5d2daVzVrT2lBbllXNXBiV0YwYVc5dVpXNWtKeUI5TEZ4dUlDQjdJRzVoYldVNklDZE5iM3BCYm1sdFlYUnBiMjRuTENCemRHRnlkRG9nSjJGdWFXMWhkR2x2Ym5OMFlYSjBKeXdnWlc1a09pQW5ZVzVwYldGMGFXOXVaVzVrSnlCOUxGeHVJQ0I3SUc1aGJXVTZJQ2R0YzBGdWFXMWhkR2x2Ymljc0lITjBZWEowT2lBbmJYTkJibWx0WVhScGIyNVRkR0Z5ZENjc0lHVnVaRG9nSjIxelFXNXBiV0YwYVc5dVJXNWtKeUI5TEZ4dUlDQjdJRzVoYldVNklDZFhaV0pyYVhSQmJtbHRZWFJwYjI0bkxDQnpkR0Z5ZERvZ0ozZGxZbXRwZEVGdWFXMWhkR2x2YmxOMFlYSjBKeXdnWlc1a09pQW5kMlZpYTJsMFFXNXBiV0YwYVc5dVJXNWtKeUI5TEZ4dVhWeHVYRzVqYjI1emRDQjBjbUZ1YzJsMGFXOXVVM1JoY25RZ1BTQjBjbUZ1YzJsMGFXOXVjeTVtYVc1a0tIUWdQVDRnWld3dWMzUjViR1ZiZEM1dVlXMWxYU0FoUFQwZ2RXNWtaV1pwYm1Wa0tTNXpkR0Z5ZEZ4dVkyOXVjM1FnZEhKaGJuTnBkR2x2YmtWdVpDQTlJSFJ5WVc1emFYUnBiMjV6TG1acGJtUW9kQ0E5UGlCbGJDNXpkSGxzWlZ0MExtNWhiV1ZkSUNFOVBTQjFibVJsWm1sdVpXUXBMbVZ1WkZ4dVkyOXVjM1FnWVc1cGJXRjBhVzl1VTNSaGNuUWdQU0JoYm1sdFlYUnBiMjV6TG1acGJtUW9kQ0E5UGlCbGJDNXpkSGxzWlZ0MExtNWhiV1ZkSUNFOVBTQjFibVJsWm1sdVpXUXBMbk4wWVhKMFhHNWpiMjV6ZENCaGJtbHRZWFJwYjI1RmJtUWdQU0JoYm1sdFlYUnBiMjV6TG1acGJtUW9kQ0E5UGlCbGJDNXpkSGxzWlZ0MExtNWhiV1ZkSUNFOVBTQjFibVJsWm1sdVpXUXBMbVZ1WkZ4dVhHNWxlSEJ2Y25RZ1pHVm1ZWFZzZENCN1hHNGdJQzh2SUhSdmRXTm9JSE5qY21WbGJpQnpkWEJ3YjNKMFhHNGdJRlJQVlVOSVgxTkRVa1ZGVGpvZ2RHOTFZMmhUWTNKbFpXNHNYRzVjYmlBZ0x5OGdibVYwZDI5eWExeHVJQ0JPUlZSWFQxSkxYMDlPVEVsT1JUb2dKMjl1YkdsdVpTY3NYRzRnSUU1RlZGZFBVa3RmVDBaR1RFbE9SVG9nSjI5bVpteHBibVVuTEZ4dUlDQk9SVlJYVDFKTFgxSkZRMDlPVGtWRFZFbE9Sem9nSjNKbFkyOXVibVZqZEdsdVp5Y3NYRzRnSUU1RlZGZFBVa3RmVWtWRFQwNU9SVU5VU1U1SFgxTlZRME5GVTFNNklDZHlaV052Ym01bFkzUXVjM1ZqWTJWemN5Y3NYRzRnSUU1RlZGZFBVa3RmVWtWRFQwNU9SVU5VU1U1SFgwWkJTVXhWVWtVNklDZHlaV052Ym01bFkzUXVabUZwYkhWeVpTY3NYRzVjYmlBZ0x5OGdkWE5sY2lCcGJuUmxjbVpoWTJVZ2MzUmhkR1Z6WEc0Z0lGTklUMWM2SUNkemFHOTNKeXhjYmlBZ1UwaFBWMDQ2SUNkemFHOTNiaWNzWEc0Z0lFaEpSRVU2SUNkb2FXUmxKeXhjYmlBZ1NFbEVSRVZPT2lBbmFHbGtaR1Z1Snl4Y2JseHVJQ0F2THlCb1lYTm9YRzRnSUVoQlUwZzZJQ2RvWVhOb0p5eGNibHh1SUNBdkx5QjBiM1ZqYUN3Z2JXOTFjMlVnWVc1a0lIQnZhVzUwWlhJZ1pYWmxiblJ6SUhCdmJIbG1hV3hzWEc0Z0lGTlVRVkpVT2lCaGRtRnBiR0ZpYkdWRmRtVnVkSE5iTUYwc1hHNGdJRTFQVmtVNklHRjJZV2xzWVdKc1pVVjJaVzUwYzFzeFhTeGNiaUFnUlU1RU9pQmhkbUZwYkdGaWJHVkZkbVZ1ZEhOYk1sMHNYRzRnSUVOQlRrTkZURG9nZEhsd1pXOW1JR0YyWVdsc1lXSnNaVVYyWlc1MGMxc3pYU0E5UFQwZ0ozVnVaR1ZtYVc1bFpDY2dQeUJ1ZFd4c0lEb2dZWFpoYVd4aFlteGxSWFpsYm5Seld6TmRMRnh1WEc0Z0lDOHZJSFJ5WVc1emFYUnBiMjV6WEc0Z0lGUlNRVTVUU1ZSSlQwNWZVMVJCVWxRNklIUnlZVzV6YVhScGIyNVRkR0Z5ZEN4Y2JpQWdWRkpCVGxOSlZFbFBUbDlGVGtRNklIUnlZVzV6YVhScGIyNUZibVFzWEc1Y2JpQWdMeThnWVc1cGJXRjBhVzl1YzF4dUlDQkJUa2xOUVZSSlQwNWZVMVJCVWxRNklHRnVhVzFoZEdsdmJsTjBZWEowTEZ4dUlDQkJUa2xOUVZSSlQwNWZSVTVFT2lCaGJtbHRZWFJwYjI1RmJtUXNYRzVjYmlBZ0x5OGdaSEp2Y0dSdmQyNWNiaUFnU1ZSRlRWOVRSVXhGUTFSRlJEb2dKMmwwWlcxVFpXeGxZM1JsWkNjc1hHNTlJaXdpTHlvcVhHNGdLaUF0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFZ4dUlDb2dUR2xqWlc1elpXUWdkVzVrWlhJZ1RVbFVJQ2hvZEhSd2N6b3ZMMmRwZEdoMVlpNWpiMjB2Y1hWaGNtc3RaR1YyTDFCb2IyNXZiaTFHY21GdFpYZHZjbXN2WW14dllpOXRZWE4wWlhJdlRFbERSVTVUUlNsY2JpQXFJQzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0WEc0Z0tpOWNibHh1YVcxd2IzSjBJRVYyWlc1MElHWnliMjBnSnk0dUx5NHVMMk52YlcxdmJpOWxkbVZ1ZEhNblhHNXBiWEJ2Y25RZ1EyOXRjRzl1Wlc1MElHWnliMjBnSnk0dUx5NHVMMk52YlhCdmJtVnVkSE12WTI5dGNHOXVaVzUwSjF4dVhHNWpiMjV6ZENCT1pYUjNiM0pySUQwZ0tDZ3BJRDArSUh0Y2JpQWdMeW9xWEc0Z0lDQXFJQzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMVnh1SUNBZ0tpQkRiMjV6ZEdGdWRITmNiaUFnSUNvZ0xTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdFhHNGdJQ0FxTDF4dVhHNGdJR052Ym5OMElFNUJUVVVnUFNBbmJtVjBkMjl5YXlkY2JpQWdZMjl1YzNRZ1ZrVlNVMGxQVGlBOUlDY3lMakF1TUNkY2JpQWdZMjl1YzNRZ1JFVkdRVlZNVkY5UVVrOVFSVkpVU1VWVElEMGdlMXh1SUNBZ0lHVnNaVzFsYm5RNklHNTFiR3dzWEc0Z0lDQWdhVzVwZEdsaGJFUmxiR0Y1T2lBek1EQXdMRnh1SUNBZ0lHUmxiR0Y1T2lBMU1EQXdMRnh1SUNCOVhHNGdJR052Ym5OMElFUkJWRUZmUVZSVVVsTmZVRkpQVUVWU1ZFbEZVeUE5SUZ0Y2JpQWdYVnh1WEc0Z0lDOHFLbHh1SUNBZ0tpQXRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMWNiaUFnSUNvZ1EyeGhjM01nUkdWbWFXNXBkR2x2Ymx4dUlDQWdLaUF0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzFjYmlBZ0lDb3ZYRzVjYmlBZ1kyeGhjM01nVG1WMGQyOXlheUJsZUhSbGJtUnpJRU52YlhCdmJtVnVkQ0I3WEc0Z0lDQWdMeW9xWEc0Z0lDQWdJQ29nUTNKbFlYUmxjeUJoYmlCcGJuTjBZVzVqWlNCdlppQk9aWFIzYjNKckxseHVJQ0FnSUNBcUlFQndZWEpoYlNCN2UzMTlJRnR2Y0hScGIyNXpQWHQ5WFZ4dUlDQWdJQ0FxTDF4dUlDQWdJR052Ym5OMGNuVmpkRzl5S0c5d2RHbHZibk1nUFNCN2ZTa2dlMXh1SUNBZ0lDQWdjM1Z3WlhJb1RrRk5SU3dnVmtWU1UwbFBUaXdnUkVWR1FWVk1WRjlRVWs5UVJWSlVTVVZUTENCdmNIUnBiMjV6TENCRVFWUkJYMEZVVkZKVFgxQlNUMUJGVWxSSlJWTXNJSFJ5ZFdVc0lHWmhiSE5sS1Z4dVhHNGdJQ0FnSUNCMGFHbHpMbmhvY2lBOUlHNTFiR3hjYmlBZ0lDQWdJSFJvYVhNdVkyaGxZMnRKYm5SbGNuWmhiQ0E5SUc1MWJHeGNibHh1SUNBZ0lDQWdkR2hwY3k1elpYUlRkR0YwZFhNb1JYWmxiblF1VGtWVVYwOVNTMTlQVGt4SlRrVXBYRzVjYmlBZ0lDQWdJSE5sZEZScGJXVnZkWFFvS0NrZ1BUNGdlMXh1SUNBZ0lDQWdJQ0IwYUdsekxuTjBZWEowUTJobFkyc29LVnh1SUNBZ0lDQWdmU3dnZEdocGN5NXZjSFJwYjI1ekxtbHVhWFJwWVd4RVpXeGhlU2xjYmlBZ0lDQjlYRzVjYmlBZ0lDQm5aWFJUZEdGMGRYTW9LU0I3WEc0Z0lDQWdJQ0J5WlhSMWNtNGdkR2hwY3k1emRHRjBkWE5jYmlBZ0lDQjlYRzVjYmlBZ0lDQnpaWFJUZEdGMGRYTW9jM1JoZEhWektTQjdYRzRnSUNBZ0lDQjBhR2x6TG5OMFlYUjFjeUE5SUhOMFlYUjFjMXh1SUNBZ0lIMWNibHh1SUNBZ0lITjBZWEowVW1WeGRXVnpkQ2dwSUh0Y2JpQWdJQ0FnSUhSb2FYTXVlR2h5SUQwZ2JtVjNJRmhOVEVoMGRIQlNaWEYxWlhOMEtDbGNiaUFnSUNBZ0lIUm9hWE11ZUdoeUxtOW1abXhwYm1VZ1BTQm1ZV3h6WlZ4dVhHNGdJQ0FnSUNCamIyNXpkQ0IxY213Z1BTQmdMMlpoZG1samIyNHVhV052UDE4OUpIdHVaWGNnUkdGMFpTZ3BMbWRsZEZScGJXVW9LWDFnWEc1Y2JpQWdJQ0FnSUhSb2FYTXVkSEpwWjJkbGNrVjJaVzUwS0VWMlpXNTBMazVGVkZkUFVrdGZVa1ZEVDA1T1JVTlVTVTVITENCN0lHUmhkR1U2SUc1bGR5QkVZWFJsS0NrZ2ZTd2dabUZzYzJVcElDQWdJQ0FnSUNBZ0lDQWdYRzVjYmlBZ0lDQWdJSFJvYVhNdWVHaHlMbTl3Wlc0b0owaEZRVVFuTENCMWNtd3NJSFJ5ZFdVcFhHNWNiaUFnSUNBZ0lIUm9hWE11ZUdoeUxuUnBiV1Z2ZFhRZ1BTQjBhR2x6TG05d2RHbHZibk11WkdWc1lYa2dMU0F4WEc0Z0lDQWdJQ0IwYUdsekxuaG9jaTV2Ym5ScGJXVnZkWFFnUFNBb0tTQTlQaUI3WEc0Z0lDQWdJQ0FnSUhSb2FYTXVlR2h5TG1GaWIzSjBLQ2xjYmlBZ0lDQWdJQ0FnZEdocGN5NTRhSElnUFNCdWRXeHNYRzRnSUNBZ0lDQjlYRzVjYmlBZ0lDQWdJSFJvYVhNdWVHaHlMbTl1Ykc5aFpDQTlJQ2dwSUQwK0lIdGNiaUFnSUNBZ0lDQWdkR2hwY3k1dmJsVndLQ2xjYmlBZ0lDQWdJSDFjYmlBZ0lDQWdJSFJvYVhNdWVHaHlMbTl1WlhKeWIzSWdQU0FvS1NBOVBpQjdYRzRnSUNBZ0lDQWdJSFJvYVhNdWIyNUViM2R1S0NsY2JpQWdJQ0FnSUgxY2JseHVJQ0FnSUNBZ2RISjVJSHRjYmlBZ0lDQWdJQ0FnZEdocGN5NTRhSEl1YzJWdVpDZ3BYRzRnSUNBZ0lDQjlJR05oZEdOb0lDaGxLU0I3WEc0Z0lDQWdJQ0FnSUhSb2FYTXViMjVFYjNkdUtDbGNiaUFnSUNBZ0lIMWNiaUFnSUNCOVhHNWNiaUFnSUNCdmJsVndLQ2tnZTF4dUlDQWdJQ0FnZEdocGN5NTBjbWxuWjJWeVJYWmxiblFvUlhabGJuUXVUa1ZVVjA5U1MxOVNSVU5QVGs1RlExUkpUa2RmVTFWRFEwVlRVeXdnZXlCa1lYUmxPaUJ1WlhjZ1JHRjBaU2dwSUgwc0lHWmhiSE5sS1Z4dVhHNGdJQ0FnSUNCcFppQW9kR2hwY3k1blpYUlRkR0YwZFhNb0tTQWhQVDBnUlhabGJuUXVUa1ZVVjA5U1MxOVBUa3hKVGtVcElIdGNiaUFnSUNBZ0lDQWdkR2hwY3k1MGNtbG5aMlZ5UlhabGJuUW9SWFpsYm5RdVRrVlVWMDlTUzE5UFRreEpUa1VzSUhzZ1pHRjBaVG9nYm1WM0lFUmhkR1VvS1NCOUxDQm1ZV3h6WlNsY2JpQWdJQ0FnSUgxY2JseHVJQ0FnSUNBZ2RHaHBjeTV6WlhSVGRHRjBkWE1vUlhabGJuUXVUa1ZVVjA5U1MxOVBUa3hKVGtVcElDQWdJQ0FnWEc0Z0lDQWdmVnh1WEc0Z0lDQWdiMjVFYjNkdUtDa2dlMXh1SUNBZ0lDQWdkR2hwY3k1MGNtbG5aMlZ5UlhabGJuUW9SWFpsYm5RdVRrVlVWMDlTUzE5U1JVTlBUazVGUTFSSlRrZGZSa0ZKVEZWU1JTd2dleUJrWVhSbE9pQnVaWGNnUkdGMFpTZ3BJSDBzSUdaaGJITmxLVnh1WEc0Z0lDQWdJQ0JwWmlBb2RHaHBjeTVuWlhSVGRHRjBkWE1vS1NBaFBUMGdSWFpsYm5RdVRrVlVWMDlTUzE5UFJrWk1TVTVGS1NCN1hHNGdJQ0FnSUNBZ0lIUm9hWE11ZEhKcFoyZGxja1YyWlc1MEtFVjJaVzUwTGs1RlZGZFBVa3RmVDBaR1RFbE9SU3dnZXlCa1lYUmxPaUJ1WlhjZ1JHRjBaU2dwSUgwc0lHWmhiSE5sS1Z4dUlDQWdJQ0FnZlZ4dVhHNGdJQ0FnSUNCMGFHbHpMbk5sZEZOMFlYUjFjeWhGZG1WdWRDNU9SVlJYVDFKTFgwOUdSa3hKVGtVcElDQWdJQ0FnWEc0Z0lDQWdmVnh1WEc0Z0lDQWdjM1JoY25SRGFHVmpheWdwSUh0Y2JpQWdJQ0FnSUhSb2FYTXVjM1J2Y0VOb1pXTnJLQ2xjYmx4dUlDQWdJQ0FnZEdocGN5NXpkR0Z5ZEZKbGNYVmxjM1FvS1NBZ0lDQWdJRnh1WEc0Z0lDQWdJQ0IwYUdsekxtTm9aV05yU1c1MFpYSjJZV3dnUFNCelpYUkpiblJsY25aaGJDZ29LU0E5UGlCN1hHNGdJQ0FnSUNBZ0lIUm9hWE11YzNSaGNuUlNaWEYxWlhOMEtDbGNiaUFnSUNBZ0lIMHNJSFJvYVhNdWIzQjBhVzl1Y3k1a1pXeGhlU2xjYmlBZ0lDQjlYRzVjYmlBZ0lDQnpkRzl3UTJobFkyc29LU0I3WEc0Z0lDQWdJQ0JwWmlBb2RHaHBjeTVqYUdWamEwbHVkR1Z5ZG1Gc0lDRTlQU0J1ZFd4c0tTQjdYRzRnSUNBZ0lDQWdJR05zWldGeVNXNTBaWEoyWVd3b2RHaHBjeTVqYUdWamEwbHVkR1Z5ZG1Gc0tWeHVJQ0FnSUNBZ0lDQjBhR2x6TG1Ob1pXTnJTVzUwWlhKMllXd2dQU0J1ZFd4c1hHNGdJQ0FnSUNCOVhHNGdJQ0FnZlZ4dVhHNGdJQ0FnYzNSaGRHbGpJRjlFVDAxSmJuUmxjbVpoWTJVb2IzQjBhVzl1Y3lrZ2UxeHVJQ0FnSUNBZ2NtVjBkWEp1SUhOMWNHVnlMbDlFVDAxSmJuUmxjbVpoWTJVb1RtVjBkMjl5YXl3Z2IzQjBhVzl1Y3lsY2JpQWdJQ0I5WEc0Z0lIMWNibHh1SUNCeVpYUjFjbTRnVG1WMGQyOXlhMXh1ZlNrb0tWeHVYRzVsZUhCdmNuUWdaR1ZtWVhWc2RDQk9aWFIzYjNKclhHNGlMQ0pjYm1WNGNHOXlkQ0JtZFc1amRHbHZiaUJzYjJGa1JtbHNaU2gxY213c0lHWnVMQ0J3YjNOMFJHRjBZU2tnZTF4dUlDQmpiMjV6ZENCeVpYRWdQU0J1WlhjZ1dFMU1TSFIwY0ZKbGNYVmxjM1FvS1Z4dUlDQnBaaUFvY21WeExtOTJaWEp5YVdSbFRXbHRaVlI1Y0dVcElISmxjUzV2ZG1WeWNtbGtaVTFwYldWVWVYQmxLQ2QwWlhoMEwyaDBiV3c3SUdOb1lYSnpaWFE5ZFhSbUxUZ25LVnh1SUNCeVpYRXViMjV5WldGa2VYTjBZWFJsWTJoaGJtZGxJRDBnS0NrZ1BUNGdlMXh1SUNBZ0lHbG1JQ2h5WlhFdWNtVmhaSGxUZEdGMFpTQTlQVDBnTkNBbUppQW9jR0Z5YzJWSmJuUW9jbVZ4TG5OMFlYUjFjeXdnTVRBcElEMDlQU0F5TURCY2JpQWdJQ0FnSUh4OElDRnlaWEV1YzNSaGRIVnpJQ1ltSUhKbGNTNXlaWE53YjI1elpWUmxlSFF1YkdWdVozUm9LU2tnZTF4dUlDQWdJQ0FnWm00b2NtVnhMbkpsYzNCdmJuTmxWR1Y0ZENsY2JpQWdJQ0I5WEc0Z0lIMWNibHh1SUNCcFppQW9kSGx3Wlc5bUlIQnZjM1JFWVhSaElDRTlQU0FuYzNSeWFXNW5KeWtnZTF4dUlDQWdJSEpsY1M1dmNHVnVLQ2RIUlZRbkxDQjFjbXdzSUhSeWRXVXBYRzRnSUNBZ2NtVnhMbk5sYm1Rb0p5Y3BYRzRnSUgwZ1pXeHpaU0I3WEc0Z0lDQWdjbVZ4TG05d1pXNG9KMUJQVTFRbkxDQjFjbXdzSUhSeWRXVXBYRzRnSUNBZ2NtVnhMbk5sZEZKbGNYVmxjM1JJWldGa1pYSW9KME52Ym5SbGJuUXRkSGx3WlNjc0lDZGhjSEJzYVdOaGRHbHZiaTk0TFhkM2R5MW1iM0p0TFhWeWJHVnVZMjlrWldRbktWeHVJQ0FnSUhKbGNTNXpaVzVrS0hCdmMzUkVZWFJoS1Z4dUlDQjlYRzU5WEc1Y2JtVjRjRzl5ZENCbWRXNWpkR2x2YmlCblpXNWxjbUYwWlVsa0tDa2dlMXh1SUNCeVpYUjFjbTRnVFdGMGFDNXlZVzVrYjIwb0tTNTBiMU4wY21sdVp5Z3pOaWt1YzNWaWMzUnlLRElzSURFd0tWeHVmVnh1WEc1bGVIQnZjblFnWm5WdVkzUnBiMjRnWm1sdVpGUmhjbWRsZEVKNVEyeGhjM01vZEdGeVoyVjBMQ0J3WVhKbGJuUkRiR0Z6Y3lrZ2UxeHVJQ0JtYjNJZ0tEc2dkR0Z5WjJWMElDWW1JSFJoY21kbGRDQWhQVDBnWkc5amRXMWxiblE3SUhSaGNtZGxkQ0E5SUhSaGNtZGxkQzV3WVhKbGJuUk9iMlJsS1NCN1hHNGdJQ0FnYVdZZ0tIUmhjbWRsZEM1amJHRnpjMHhwYzNRdVkyOXVkR0ZwYm5Nb2NHRnlaVzUwUTJ4aGMzTXBLU0I3WEc0Z0lDQWdJQ0J5WlhSMWNtNGdkR0Z5WjJWMFhHNGdJQ0FnZlZ4dUlDQjlYRzVjYmlBZ2NtVjBkWEp1SUc1MWJHeGNibjFjYmx4dVhHNWxlSEJ2Y25RZ1puVnVZM1JwYjI0Z1ptbHVaRlJoY21kbGRFSjVTV1FvZEdGeVoyVjBMQ0J3WVhKbGJuUkpaQ2tnZTF4dUlDQm1iM0lnS0RzZ2RHRnlaMlYwSUNZbUlIUmhjbWRsZENBaFBUMGdaRzlqZFcxbGJuUTdJSFJoY21kbGRDQTlJSFJoY21kbGRDNXdZWEpsYm5ST2IyUmxLU0I3WEc0Z0lDQWdhV1lnS0hSaGNtZGxkQzVuWlhSQmRIUnlhV0oxZEdVb0oybGtKeWtnUFQwOUlIQmhjbVZ1ZEVsa0tTQjdYRzRnSUNBZ0lDQnlaWFIxY200Z2RHRnlaMlYwWEc0Z0lDQWdmVnh1SUNCOVhHNWNiaUFnY21WMGRYSnVJRzUxYkd4Y2JuMWNibHh1Wlhod2IzSjBJR1oxYm1OMGFXOXVJR1pwYm1SVVlYSm5aWFJDZVVGMGRISW9kR0Z5WjJWMExDQmhkSFJ5S1NCN1hHNGdJR1p2Y2lBb095QjBZWEpuWlhRZ0ppWWdkR0Z5WjJWMElDRTlQU0JrYjJOMWJXVnVkRHNnZEdGeVoyVjBJRDBnZEdGeVoyVjBMbkJoY21WdWRFNXZaR1VwSUh0Y2JpQWdJQ0JwWmlBb2RHRnlaMlYwTG1kbGRFRjBkSEpwWW5WMFpTaGhkSFJ5S1NBaFBUMGdiblZzYkNrZ2UxeHVJQ0FnSUNBZ2NtVjBkWEp1SUhSaGNtZGxkRnh1SUNBZ0lIMWNiaUFnZlZ4dVhHNGdJSEpsZEhWeWJpQnVkV3hzWEc1OVhHNGlMQ0l2S2lwY2JpQXFJQzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0WEc0Z0tpQk1hV05sYm5ObFpDQjFibVJsY2lCTlNWUWdLR2gwZEhCek9pOHZaMmwwYUhWaUxtTnZiUzl4ZFdGeWF5MWtaWFl2VUdodmJtOXVMVVp5WVcxbGQyOXlheTlpYkc5aUwyMWhjM1JsY2k5TVNVTkZUbE5GS1Z4dUlDb2dMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzFjYmlBcUwxeHVhVzF3YjNKMElFTnZiWEJ2Ym1WdWRDQm1jbTl0SUNjdUxpOWpiMjF3YjI1bGJuUW5YRzVwYlhCdmNuUWdRMjlzYkdGd2MyVWdabkp2YlNBbkxpNHZZMjlzYkdGd2MyVW5YRzVwYlhCdmNuUWdleUJuWlhSQmRIUnlhV0oxZEdWelEyOXVabWxuSUgwZ1puSnZiU0FuTGk0dlkyOXRjRzl1Wlc1MFRXRnVZV2RsY2lkY2JtbHRjRzl5ZENCN0lHWnBibVJVWVhKblpYUkNlVU5zWVhOeklIMGdabkp2YlNBbkxpNHZMaTR2WTI5dGJXOXVMM1YwYVd4ekoxeHVYRzVqYjI1emRDQkJZMk52Y21ScGIyNGdQU0FvS0NrZ1BUNGdlMXh1SUNBdktpcGNiaUFnSUNvZ0xTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdFhHNGdJQ0FxSUVOdmJuTjBZVzUwYzF4dUlDQWdLaUF0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzFjYmlBZ0lDb3ZYRzVjYmlBZ1kyOXVjM1FnVGtGTlJTQTlJQ2RoWTJOdmNtUnBiMjRuWEc0Z0lHTnZibk4wSUZaRlVsTkpUMDRnUFNBbk1pNHdMakFuWEc0Z0lHTnZibk4wSUVSRlJrRlZURlJmVUZKUFVFVlNWRWxGVXlBOUlIdGNiaUFnSUNCbGJHVnRaVzUwT2lCdWRXeHNMRnh1SUNCOVhHNGdJR052Ym5OMElFUkJWRUZmUVZSVVVsTmZVRkpQVUVWU1ZFbEZVeUE5SUZ0Y2JpQWdYVnh1WEc0Z0lDOHFLbHh1SUNBZ0tpQXRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMWNiaUFnSUNvZ1EyeGhjM01nUkdWbWFXNXBkR2x2Ymx4dUlDQWdLaUF0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzFjYmlBZ0lDb3ZYRzVjYmlBZ1kyeGhjM01nUVdOamIzSmthVzl1SUdWNGRHVnVaSE1nUTI5dGNHOXVaVzUwSUh0Y2JseHVJQ0FnSUdOdmJuTjBjblZqZEc5eUtHOXdkR2x2Ym5NZ1BTQjdmU2tnZTF4dUlDQWdJQ0FnYzNWd1pYSW9Ua0ZOUlN3Z1ZrVlNVMGxQVGl3Z1JFVkdRVlZNVkY5UVVrOVFSVkpVU1VWVExDQnZjSFJwYjI1ekxDQkVRVlJCWDBGVVZGSlRYMUJTVDFCRlVsUkpSVk1zSUdaaGJITmxMQ0JtWVd4elpTbGNibHh1SUNBZ0lDQWdkR2hwY3k1amIyeHNZWEJ6WlhNZ1BTQmJYVnh1WEc0Z0lDQWdJQ0JqYjI1emRDQjBiMmRuYkdWeklEMGdkR2hwY3k1dmNIUnBiMjV6TG1Wc1pXMWxiblF1Y1hWbGNubFRaV3hsWTNSdmNrRnNiQ2hnVzJSaGRHRXRkRzluWjJ4bFBWd2lKSHRPUVUxRmZWd2lYV0FwWEc0Z0lDQWdJQ0JCY25KaGVTNW1jbTl0S0hSdloyZHNaWE1wTG1admNrVmhZMmdvS0hSdloyZHNaU2tnUFQ0Z2UxeHVJQ0FnSUNBZ0lDQmpiMjV6ZENCamIyeHNZWEJ6WlVsa0lEMGdkRzluWjJ4bExtZGxkRUYwZEhKcFluVjBaU2duYUhKbFppY3BYRzRnSUNBZ0lDQWdJR052Ym5OMElHTnZiR3hoY0hObElEMGdaRzlqZFcxbGJuUXVjWFZsY25sVFpXeGxZM1J2Y2loamIyeHNZWEJ6WlVsa0tWeHVYRzRnSUNBZ0lDQWdJR2xtSUNoamIyeHNZWEJ6WlNrZ2UxeHVJQ0FnSUNBZ0lDQWdJSFJvYVhNdVlXUmtRMjlzYkdGd2MyVW9ZMjlzYkdGd2MyVXBYRzRnSUNBZ0lDQWdJSDFjYmlBZ0lDQWdJSDBwWEc0Z0lDQWdmVnh1WEc0Z0lDQWdiMjVGYkdWdFpXNTBSWFpsYm5Rb1pYWmxiblFwSUh0Y2JpQWdJQ0FnSUdOdmJuTjBJR2xrSUQwZ1pYWmxiblF1ZEdGeVoyVjBMbWRsZEVGMGRISnBZblYwWlNnbmFISmxaaWNwWEc0Z0lDQWdJQ0JqYjI1emRDQmxiR1Z0Wlc1MElEMGdaRzlqZFcxbGJuUXVjWFZsY25sVFpXeGxZM1J2Y2locFpDbGNibHh1SUNBZ0lDQWdkR2hwY3k1elpYUkRiMnhzWVhCelpYTW9aV3hsYldWdWRDbGNiaUFnSUNCOVhHNWNiaUFnSUNCaFpHUkRiMnhzWVhCelpTaGxiR1Z0Wlc1MEtTQjdYRzRnSUNBZ0lDQmpiMjV6ZENCamIyeHNZWEJ6WlNBOUlHNWxkeUJEYjJ4c1lYQnpaU2g3WEc0Z0lDQWdJQ0FnSUdWc1pXMWxiblFzWEc0Z0lDQWdJQ0I5S1Z4dUlDQWdJQ0FnZEdocGN5NWpiMnhzWVhCelpYTXVjSFZ6YUNoamIyeHNZWEJ6WlNsY2JseHVJQ0FnSUNBZ2NtVjBkWEp1SUdOdmJHeGhjSE5sWEc0Z0lDQWdmVnh1WEc0Z0lDQWdaMlYwUTI5c2JHRndjMlVvWld4bGJXVnVkQ2tnZTF4dUlDQWdJQ0FnYkdWMElHTnZiR3hoY0hObElEMGdkR2hwY3k1amIyeHNZWEJ6WlhNdVptbHVaQ2hqSUQwK0lHTXViM0IwYVc5dWN5NWxiR1Z0Wlc1MExtZGxkRUYwZEhKcFluVjBaU2duYVdRbktTQTlQVDBnWld4bGJXVnVkQzVuWlhSQmRIUnlhV0oxZEdVb0oybGtKeWtwWEc1Y2JpQWdJQ0FnSUdsbUlDZ2hZMjlzYkdGd2MyVXBJSHRjYmlBZ0lDQWdJQ0FnTHk4Z1kzSmxZWFJsSUdFZ2JtVjNJR052Ykd4aGNITmxYRzRnSUNBZ0lDQWdJR052Ykd4aGNITmxJRDBnZEdocGN5NWhaR1JEYjJ4c1lYQnpaU2dwWEc0Z0lDQWdJQ0I5WEc1Y2JpQWdJQ0FnSUhKbGRIVnliaUJqYjJ4c1lYQnpaVnh1SUNBZ0lIMWNibHh1SUNBZ0lHZGxkRU52Ykd4aGNITmxjeWdwSUh0Y2JpQWdJQ0FnSUhKbGRIVnliaUIwYUdsekxtTnZiR3hoY0hObGMxeHVJQ0FnSUgxY2JseHVJQ0FnSUhObGRFTnZiR3hoY0hObGN5aHphRzkzUTI5c2JHRndjMlVwSUh0Y2JpQWdJQ0FnSUdOdmJuTjBJR052Ykd4aGNITmxJRDBnZEdocGN5NW5aWFJEYjJ4c1lYQnpaU2h6YUc5M1EyOXNiR0Z3YzJVcFhHNGdJQ0FnSUNCMGFHbHpMbU52Ykd4aGNITmxjeTVtYjNKRllXTm9LQ2hqS1NBOVBpQjdYRzRnSUNBZ0lDQWdJR2xtSUNoakxtOXdkR2x2Ym5NdVpXeGxiV1Z1ZEM1blpYUkJkSFJ5YVdKMWRHVW9KMmxrSnlrZ0lUMDlJSE5vYjNkRGIyeHNZWEJ6WlM1blpYUkJkSFJ5YVdKMWRHVW9KMmxrSnlrcElIdGNiaUFnSUNBZ0lDQWdJQ0JqTG1ocFpHVW9LVnh1SUNBZ0lDQWdJQ0I5SUdWc2MyVWdlMXh1SUNBZ0lDQWdJQ0FnSUdOdmJHeGhjSE5sTG5SdloyZHNaU2dwWEc0Z0lDQWdJQ0FnSUgxY2JpQWdJQ0FnSUgwcFhHNGdJQ0FnZlZ4dVhHNGdJQ0FnYzJodmR5aGpiMnhzWVhCelpVVnNLU0I3WEc0Z0lDQWdJQ0JzWlhRZ1kyOXNiR0Z3YzJVZ1BTQmpiMnhzWVhCelpVVnNYRzRnSUNBZ0lDQnBaaUFvZEhsd1pXOW1JR052Ykd4aGNITmxSV3dnUFQwOUlDZHpkSEpwYm1jbktTQjdYRzRnSUNBZ0lDQWdJR052Ykd4aGNITmxJRDBnWkc5amRXMWxiblF1Y1hWbGNubFRaV3hsWTNSdmNpaGpiMnhzWVhCelpVVnNLVnh1SUNBZ0lDQWdmVnh1WEc0Z0lDQWdJQ0JwWmlBb0lXTnZiR3hoY0hObEtTQjdYRzRnSUNBZ0lDQWdJSFJvY205M0lHNWxkeUJGY25KdmNpaGdKSHRPUVUxRmZTNGdWR2hsSUdOdmJHeGhjSE5wWW14bElDUjdZMjlzYkdGd2MyVkZiSDBnYVhNZ1lXNGdhVzUyWVd4cFpDQklWRTFNUld4bGJXVnVkQzVnS1Z4dUlDQWdJQ0FnZlZ4dVhHNGdJQ0FnSUNCMGFHbHpMbk5sZEVOdmJHeGhjSE5sY3loamIyeHNZWEJ6WlNsY2JseHVJQ0FnSUNBZ2NtVjBkWEp1SUhSeWRXVmNiaUFnSUNCOVhHNWNiaUFnSUNCb2FXUmxLR052Ykd4aGNITmxSV3dwSUh0Y2JpQWdJQ0FnSUd4bGRDQmpiMnhzWVhCelpTQTlJR052Ykd4aGNITmxSV3hjYmlBZ0lDQWdJR2xtSUNoMGVYQmxiMllnWTI5c2JHRndjMlZGYkNBOVBUMGdKM04wY21sdVp5Y3BJSHRjYmlBZ0lDQWdJQ0FnWTI5c2JHRndjMlVnUFNCa2IyTjFiV1Z1ZEM1eGRXVnllVk5sYkdWamRHOXlLR052Ykd4aGNITmxSV3dwWEc0Z0lDQWdJQ0I5WEc1Y2JpQWdJQ0FnSUdsbUlDZ2hZMjlzYkdGd2MyVXBJSHRjYmlBZ0lDQWdJQ0FnZEdoeWIzY2dibVYzSUVWeWNtOXlLR0FrZTA1QlRVVjlMaUJVYUdVZ1kyOXNiR0Z3YzJsaWJHVWdKSHRqYjJ4c1lYQnpaVVZzZlNCcGN5QmhiaUJwYm5aaGJHbGtJRWhVVFV4RmJHVnRaVzUwTG1BcFhHNGdJQ0FnSUNCOVhHNWNiaUFnSUNBZ0lHTnZibk4wSUdOdmJHeGhjSE5sVDJKcUlEMGdkR2hwY3k1blpYUkRiMnhzWVhCelpTaGpiMnhzWVhCelpTbGNiaUFnSUNBZ0lISmxkSFZ5YmlCamIyeHNZWEJ6WlU5aWFpNW9hV1JsS0NsY2JpQWdJQ0I5WEc1Y2JpQWdJQ0J6ZEdGMGFXTWdhV1JsYm5ScFptbGxjaWdwSUh0Y2JpQWdJQ0FnSUhKbGRIVnliaUJPUVUxRlhHNGdJQ0FnZlZ4dVhHNGdJQ0FnYzNSaGRHbGpJRjlFVDAxSmJuUmxjbVpoWTJVb2IzQjBhVzl1Y3lrZ2UxeHVJQ0FnSUNBZ2NtVjBkWEp1SUhOMWNHVnlMbDlFVDAxSmJuUmxjbVpoWTJVb1FXTmpiM0prYVc5dUxDQnZjSFJwYjI1ektWeHVJQ0FnSUgxY2JpQWdmVnh1WEc0Z0lDOHFLbHh1SUNBZ0tpQXRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMWNiaUFnSUNvZ1JFOU5JRUZ3YVNCcGJYQnNaVzFsYm5SaGRHbHZibHh1SUNBZ0tpQXRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMWNiaUFnSUNvdlhHNGdJR052Ym5OMElHTnZiWEJ2Ym1WdWRITWdQU0JiWFZ4dVhHNGdJR052Ym5OMElHRmpZMjl5WkdsdmJuTWdQU0JrYjJOMWJXVnVkQzV4ZFdWeWVWTmxiR1ZqZEc5eVFXeHNLR0F1Skh0T1FVMUZmV0FwWEc0Z0lHbG1JQ2hoWTJOdmNtUnBiMjV6S1NCN1hHNGdJQ0FnUVhKeVlYa3Vabkp2YlNoaFkyTnZjbVJwYjI1ektTNW1iM0pGWVdOb0tDaGxiR1Z0Wlc1MEtTQTlQaUI3WEc0Z0lDQWdJQ0JqYjI1emRDQmpiMjVtYVdjZ1BTQm5aWFJCZEhSeWFXSjFkR1Z6UTI5dVptbG5LR1ZzWlcxbGJuUXNJRVJGUmtGVlRGUmZVRkpQVUVWU1ZFbEZVeXdnUkVGVVFWOUJWRlJTVTE5UVVrOVFSVkpVU1VWVEtWeHVJQ0FnSUNBZ1kyOXVabWxuTG1Wc1pXMWxiblFnUFNCbGJHVnRaVzUwWEc1Y2JpQWdJQ0FnSUdOdmJYQnZibVZ1ZEhNdWNIVnphQ2hCWTJOdmNtUnBiMjR1WDBSUFRVbHVkR1Z5Wm1GalpTaGpiMjVtYVdjcEtWeHVJQ0FnSUgwcFhHNGdJSDFjYmx4dUlDQmtiMk4xYldWdWRDNWhaR1JGZG1WdWRFeHBjM1JsYm1WeUtDZGpiR2xqYXljc0lDaGxkbVZ1ZENrZ1BUNGdlMXh1SUNBZ0lHTnZibk4wSUdSaGRHRlViMmRuYkdWQmRIUnlJRDBnWlhabGJuUXVkR0Z5WjJWMExtZGxkRUYwZEhKcFluVjBaU2duWkdGMFlTMTBiMmRuYkdVbktWeHVJQ0FnSUdsbUlDaGtZWFJoVkc5bloyeGxRWFIwY2lBbUppQmtZWFJoVkc5bloyeGxRWFIwY2lBOVBUMGdUa0ZOUlNrZ2UxeHVJQ0FnSUNBZ1kyOXVjM1FnWTI5c2JHRndjMlZKWkNBOUlHVjJaVzUwTG5SaGNtZGxkQzVuWlhSQmRIUnlhV0oxZEdVb0oyUmhkR0V0ZEdGeVoyVjBKeWtnZkh3Z1pYWmxiblF1ZEdGeVoyVjBMbWRsZEVGMGRISnBZblYwWlNnbmFISmxaaWNwWEc0Z0lDQWdJQ0JqYjI1emRDQmpiMnhzWVhCelpVVnNJRDBnWkc5amRXMWxiblF1Y1hWbGNubFRaV3hsWTNSdmNpaGpiMnhzWVhCelpVbGtLVnh1WEc0Z0lDQWdJQ0JqYjI1emRDQmhZMk52Y21ScGIyNGdQU0JtYVc1a1ZHRnlaMlYwUW5sRGJHRnpjeWhsZG1WdWRDNTBZWEpuWlhRc0lDZGhZMk52Y21ScGIyNG5LVnh1WEc0Z0lDQWdJQ0JwWmlBb1lXTmpiM0prYVc5dUlEMDlQU0J1ZFd4c0tTQjdYRzRnSUNBZ0lDQWdJSEpsZEhWeWJseHVJQ0FnSUNBZ2ZWeHVYRzRnSUNBZ0lDQmpiMjV6ZENCaFkyTnZjbVJwYjI1SlpDQTlJR0ZqWTI5eVpHbHZiaTVuWlhSQmRIUnlhV0oxZEdVb0oybGtKeWxjYmlBZ0lDQWdJR052Ym5OMElHTnZiWEJ2Ym1WdWRDQTlJR052YlhCdmJtVnVkSE11Wm1sdVpDaGpJRDArSUdNdVoyVjBSV3hsYldWdWRDZ3BMbWRsZEVGMGRISnBZblYwWlNnbmFXUW5LU0E5UFQwZ1lXTmpiM0prYVc5dVNXUXBYRzVjYmlBZ0lDQWdJR2xtSUNnaFkyOXRjRzl1Wlc1MEtTQjdYRzRnSUNBZ0lDQWdJSEpsZEhWeWJseHVJQ0FnSUNBZ2ZWeHVYRzRnSUNBZ0lDQXZMeUJwWmlCMGFHVWdZMjlzYkdGd2MyVWdhR0Z6SUdKbFpXNGdZV1JrWldRZ2NISnZaM0poYlcxaGRHbGpZV3hzZVN3Z2QyVWdZV1JrSUdsMFhHNGdJQ0FnSUNCamIyNXpkQ0IwWVhKblpYUkRiMnhzWVhCelpTQTlJR052YlhCdmJtVnVkQzVuWlhSRGIyeHNZWEJ6WlhNb0tTNW1hVzVrS0dNZ1BUNGdZeTVuWlhSRmJHVnRaVzUwS0NrZ1BUMDlJR052Ykd4aGNITmxSV3dwWEc0Z0lDQWdJQ0JwWmlBb0lYUmhjbWRsZEVOdmJHeGhjSE5sS1NCN1hHNGdJQ0FnSUNBZ0lHTnZiWEJ2Ym1WdWRDNWhaR1JEYjJ4c1lYQnpaU2hqYjJ4c1lYQnpaVVZzS1Z4dUlDQWdJQ0FnZlZ4dVhHNGdJQ0FnSUNCamIyMXdiMjVsYm5RdWMyaHZkeWhqYjJ4c1lYQnpaVWxrS1Z4dUlDQWdJSDFjYmlBZ2ZTbGNibHh1SUNCeVpYUjFjbTRnUVdOamIzSmthVzl1WEc1OUtTZ3BYRzVjYm1WNGNHOXlkQ0JrWldaaGRXeDBJRUZqWTI5eVpHbHZibHh1SWl3aUx5b3FYRzRnS2lBdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExWeHVJQ29nVEdsalpXNXpaV1FnZFc1a1pYSWdUVWxVSUNob2RIUndjem92TDJkcGRHaDFZaTVqYjIwdmNYVmhjbXN0WkdWMkwxQm9iMjV2YmkxR2NtRnRaWGR2Y21zdllteHZZaTl0WVhOMFpYSXZURWxEUlU1VFJTbGNiaUFxSUMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdFhHNGdLaTljYm1sdGNHOXlkQ0JEYjIxd2IyNWxiblFnWm5KdmJTQW5MaTR2WTI5dGNHOXVaVzUwSjF4dWFXMXdiM0owSUhzZ1oyVjBRWFIwY21saWRYUmxjME52Ym1acFp5QjlJR1p5YjIwZ0p5NHVMMk52YlhCdmJtVnVkRTFoYm1GblpYSW5YRzVwYlhCdmNuUWdSWFpsYm5RZ1puSnZiU0FuTGk0dkxpNHZZMjl0Ylc5dUwyVjJaVzUwY3lkY2JtbHRjRzl5ZENCN0lHWnBibVJVWVhKblpYUkNlVUYwZEhJZ2ZTQm1jbTl0SUNjdUxpOHVMaTlqYjIxdGIyNHZkWFJwYkhNblhHNWNibU52Ym5OMElFTnZiR3hoY0hObElEMGdLQ2dwSUQwK0lIdGNiaUFnTHlvcVhHNGdJQ0FxSUMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFZ4dUlDQWdLaUJEYjI1emRHRnVkSE5jYmlBZ0lDb2dMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRYRzRnSUNBcUwxeHVYRzRnSUdOdmJuTjBJRTVCVFVVZ1BTQW5ZMjlzYkdGd2MyVW5YRzRnSUdOdmJuTjBJRlpGVWxOSlQwNGdQU0FuTWk0d0xqQW5YRzRnSUdOdmJuTjBJRVJGUmtGVlRGUmZVRkpQVUVWU1ZFbEZVeUE5SUh0Y2JpQWdJQ0JsYkdWdFpXNTBPaUJ1ZFd4c0xGeHVJQ0FnSUhSdloyZHNaVG9nWm1Gc2MyVXNYRzRnSUgxY2JpQWdZMjl1YzNRZ1JFRlVRVjlCVkZSU1UxOVFVazlRUlZKVVNVVlRJRDBnVzF4dUlDQWdJQ2QwYjJkbmJHVW5MRnh1SUNCZFhHNWNiaUFnTHlvcVhHNGdJQ0FxSUMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFZ4dUlDQWdLaUJEYkdGemN5QkVaV1pwYm1sMGFXOXVYRzRnSUNBcUlDMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExWeHVJQ0FnS2k5Y2JseHVJQ0JqYkdGemN5QkRiMnhzWVhCelpTQmxlSFJsYm1SeklFTnZiWEJ2Ym1WdWRDQjdYRzVjYmlBZ0lDQmpiMjV6ZEhKMVkzUnZjaWh2Y0hScGIyNXpJRDBnZTMwcElIdGNiaUFnSUNBZ0lITjFjR1Z5S0U1QlRVVXNJRlpGVWxOSlQwNHNJRVJGUmtGVlRGUmZVRkpQVUVWU1ZFbEZVeXdnYjNCMGFXOXVjeXdnUkVGVVFWOUJWRlJTVTE5UVVrOVFSVkpVU1VWVExDQm1ZV3h6WlN3Z1ptRnNjMlVwWEc1Y2JpQWdJQ0FnSUhSb2FYTXViMjVVY21GdWMybDBhVzl1SUQwZ1ptRnNjMlZjYmx4dUlDQWdJQ0FnTHk4Z2RHOW5aMnhsSUdScGNtVmpkR3g1WEc0Z0lDQWdJQ0JwWmlBb2RHaHBjeTV2Y0hScGIyNXpMblJ2WjJkc1pTa2dlMXh1SUNBZ0lDQWdJQ0IwYUdsekxuTm9iM2NvS1Z4dUlDQWdJQ0FnZlZ4dUlDQWdJSDFjYmx4dUlDQWdJR2RsZEVobGFXZG9kQ2dwSUh0Y2JpQWdJQ0FnSUhKbGRIVnliaUIwYUdsekxtOXdkR2x2Ym5NdVpXeGxiV1Z1ZEM1blpYUkNiM1Z1WkdsdVowTnNhV1Z1ZEZKbFkzUW9kR2hwY3k1dmNIUnBiMjV6TG1Wc1pXMWxiblFwTG1obGFXZG9kRnh1SUNBZ0lIMWNibHh1SUNBZ0lIUnZaMmRzWlNncElIdGNiaUFnSUNBZ0lHbG1JQ2gwYUdsekxtOXdkR2x2Ym5NdVpXeGxiV1Z1ZEM1amJHRnpjMHhwYzNRdVkyOXVkR0ZwYm5Nb0ozTm9iM2NuS1NrZ2UxeHVJQ0FnSUNBZ0lDQnlaWFIxY200Z2RHaHBjeTVvYVdSbEtDbGNiaUFnSUNBZ0lIMWNibHh1SUNBZ0lDQWdjbVYwZFhKdUlIUm9hWE11YzJodmR5Z3BYRzRnSUNBZ2ZWeHVYRzRnSUNBZ2MyaHZkeWdwSUh0Y2JpQWdJQ0FnSUdsbUlDaDBhR2x6TG05dVZISmhibk5wZEdsdmJpa2dlMXh1SUNBZ0lDQWdJQ0J5WlhSMWNtNGdabUZzYzJWY2JpQWdJQ0FnSUgxY2JseHVJQ0FnSUNBZ2FXWWdLSFJvYVhNdWIzQjBhVzl1Y3k1bGJHVnRaVzUwTG1Oc1lYTnpUR2x6ZEM1amIyNTBZV2x1Y3lnbmMyaHZkeWNwS1NCN1hHNGdJQ0FnSUNBZ0lISmxkSFZ5YmlCbVlXeHpaVnh1SUNBZ0lDQWdmVnh1WEc0Z0lDQWdJQ0IwYUdsekxtOXVWSEpoYm5OcGRHbHZiaUE5SUhSeWRXVmNibHh1SUNBZ0lDQWdZMjl1YzNRZ2IyNURiMnhzWVhCelpXUWdQU0FvS1NBOVBpQjdYRzRnSUNBZ0lDQWdJSFJvYVhNdWIzQjBhVzl1Y3k1bGJHVnRaVzUwTG1Oc1lYTnpUR2x6ZEM1aFpHUW9KM05vYjNjbktWeHVJQ0FnSUNBZ0lDQjBhR2x6TG05d2RHbHZibk11Wld4bGJXVnVkQzVqYkdGemMweHBjM1F1Y21WdGIzWmxLQ2RqYjJ4c1lYQnphVzVuSnlsY2JpQWdJQ0FnSUNBZ2RHaHBjeTV2Y0hScGIyNXpMbVZzWlcxbGJuUXVjbVZ0YjNabFJYWmxiblJNYVhOMFpXNWxjaWhGZG1WdWRDNVVVa0ZPVTBsVVNVOU9YMFZPUkN3Z2IyNURiMnhzWVhCelpXUXBYRzVjYmlBZ0lDQWdJQ0FnZEdocGN5NXZjSFJwYjI1ekxtVnNaVzFsYm5RdWMyVjBRWFIwY21saWRYUmxLQ2RoY21saExXVjRjR0Z1WkdWa0p5d2dkSEoxWlNsY2JseHVJQ0FnSUNBZ0lDQjBhR2x6TG05dVZISmhibk5wZEdsdmJpQTlJR1poYkhObFhHNGdJQ0FnSUNCOVhHNWNiaUFnSUNBZ0lHbG1JQ2doZEdocGN5NXZjSFJwYjI1ekxtVnNaVzFsYm5RdVkyeGhjM05NYVhOMExtTnZiblJoYVc1ektDZGpiMnhzWVhCemFXNW5KeWtwSUh0Y2JpQWdJQ0FnSUNBZ2RHaHBjeTV2Y0hScGIyNXpMbVZzWlcxbGJuUXVZMnhoYzNOTWFYTjBMbUZrWkNnblkyOXNiR0Z3YzJsdVp5Y3BYRzRnSUNBZ0lDQjlYRzVjYmlBZ0lDQWdJSFJvYVhNdWIzQjBhVzl1Y3k1bGJHVnRaVzUwTG1Ga1pFVjJaVzUwVEdsemRHVnVaWElvUlhabGJuUXVWRkpCVGxOSlZFbFBUbDlGVGtRc0lHOXVRMjlzYkdGd2MyVmtLVnh1WEc0Z0lDQWdJQ0JqYjI1emRDQm9aV2xuYUhRZ1BTQjBhR2x6TG1kbGRFaGxhV2RvZENncFhHNWNiaUFnSUNBZ0lIUm9hWE11YjNCMGFXOXVjeTVsYkdWdFpXNTBMbk4wZVd4bExtaGxhV2RvZENBOUlDY3djSGduWEc1Y2JpQWdJQ0FnSUhObGRGUnBiV1Z2ZFhRb0tDa2dQVDRnZTF4dUlDQWdJQ0FnSUNCMGFHbHpMbTl3ZEdsdmJuTXVaV3hsYldWdWRDNXpkSGxzWlM1b1pXbG5hSFFnUFNCZ0pIdG9aV2xuYUhSOWNIaGdYRzRnSUNBZ0lDQjlMQ0F5TUNsY2JseHVJQ0FnSUNBZ2NtVjBkWEp1SUhSeWRXVmNiaUFnSUNCOVhHNWNiaUFnSUNCb2FXUmxLQ2tnZTF4dUlDQWdJQ0FnYVdZZ0tIUm9hWE11YjI1VWNtRnVjMmwwYVc5dUtTQjdYRzRnSUNBZ0lDQWdJSEpsZEhWeWJpQm1ZV3h6WlZ4dUlDQWdJQ0FnZlZ4dVhHNGdJQ0FnSUNCcFppQW9JWFJvYVhNdWIzQjBhVzl1Y3k1bGJHVnRaVzUwTG1Oc1lYTnpUR2x6ZEM1amIyNTBZV2x1Y3lnbmMyaHZkeWNwS1NCN1hHNGdJQ0FnSUNBZ0lISmxkSFZ5YmlCbVlXeHpaVnh1SUNBZ0lDQWdmVnh1WEc0Z0lDQWdJQ0IwYUdsekxtOXVWSEpoYm5OcGRHbHZiaUE5SUhSeWRXVmNibHh1SUNBZ0lDQWdZMjl1YzNRZ2IyNURiMnhzWVhCelpXUWdQU0FvS1NBOVBpQjdYRzRnSUNBZ0lDQWdJSFJvYVhNdWIzQjBhVzl1Y3k1bGJHVnRaVzUwTG1Oc1lYTnpUR2x6ZEM1eVpXMXZkbVVvSjJOdmJHeGhjSE5wYm1jbktWeHVJQ0FnSUNBZ0lDQjBhR2x6TG05d2RHbHZibk11Wld4bGJXVnVkQzV6ZEhsc1pTNW9aV2xuYUhRZ1BTQW5ZWFYwYnlkY2JpQWdJQ0FnSUNBZ2RHaHBjeTV2Y0hScGIyNXpMbVZzWlcxbGJuUXVjbVZ0YjNabFJYWmxiblJNYVhOMFpXNWxjaWhGZG1WdWRDNVVVa0ZPVTBsVVNVOU9YMFZPUkN3Z2IyNURiMnhzWVhCelpXUXBYRzVjYmlBZ0lDQWdJQ0FnZEdocGN5NXZjSFJwYjI1ekxtVnNaVzFsYm5RdWMyVjBRWFIwY21saWRYUmxLQ2RoY21saExXVjRjR0Z1WkdWa0p5d2dabUZzYzJVcFhHNWNiaUFnSUNBZ0lDQWdkR2hwY3k1dmJsUnlZVzV6YVhScGIyNGdQU0JtWVd4elpWeHVJQ0FnSUNBZ2ZWeHVYRzRnSUNBZ0lDQjBhR2x6TG05d2RHbHZibk11Wld4bGJXVnVkQzV6ZEhsc1pTNW9aV2xuYUhRZ1BTQW5NSEI0SjF4dVhHNGdJQ0FnSUNCcFppQW9JWFJvYVhNdWIzQjBhVzl1Y3k1bGJHVnRaVzUwTG1Oc1lYTnpUR2x6ZEM1amIyNTBZV2x1Y3lnblkyOXNiR0Z3YzJsdVp5Y3BLU0I3WEc0Z0lDQWdJQ0FnSUhSb2FYTXViM0IwYVc5dWN5NWxiR1Z0Wlc1MExtTnNZWE56VEdsemRDNWhaR1FvSjJOdmJHeGhjSE5wYm1jbktWeHVJQ0FnSUNBZ2ZWeHVYRzRnSUNBZ0lDQjBhR2x6TG05d2RHbHZibk11Wld4bGJXVnVkQzVoWkdSRmRtVnVkRXhwYzNSbGJtVnlLRVYyWlc1MExsUlNRVTVUU1ZSSlQwNWZSVTVFTENCdmJrTnZiR3hoY0hObFpDbGNibHh1SUNBZ0lDQWdkR2hwY3k1dmNIUnBiMjV6TG1Wc1pXMWxiblF1WTJ4aGMzTk1hWE4wTG5KbGJXOTJaU2duYzJodmR5Y3BYRzVjYmlBZ0lDQWdJSEpsZEhWeWJpQjBjblZsWEc0Z0lDQWdmVnh1WEc0Z0lDQWdjM1JoZEdsaklHbGtaVzUwYVdacFpYSW9LU0I3WEc0Z0lDQWdJQ0J5WlhSMWNtNGdUa0ZOUlZ4dUlDQWdJSDFjYmx4dUlDQWdJSE4wWVhScFl5QmZSRTlOU1c1MFpYSm1ZV05sS0c5d2RHbHZibk1wSUh0Y2JpQWdJQ0FnSUhKbGRIVnliaUJ6ZFhCbGNpNWZSRTlOU1c1MFpYSm1ZV05sS0VOdmJHeGhjSE5sTENCdmNIUnBiMjV6S1Z4dUlDQWdJSDFjYmlBZ2ZWeHVYRzRnSUM4cUtseHVJQ0FnS2lBdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMxY2JpQWdJQ29nUkU5TklFRndhU0JwYlhCc1pXMWxiblJoZEdsdmJseHVJQ0FnS2lBdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMxY2JpQWdJQ292WEc0Z0lHTnZibk4wSUdOdmJYQnZibVZ1ZEhNZ1BTQmJYVnh1WEc0Z0lHTnZibk4wSUdOdmJHeGhjSE5sY3lBOUlHUnZZM1Z0Wlc1MExuRjFaWEo1VTJWc1pXTjBiM0pCYkd3b1lDNGtlMDVCVFVWOVlDbGNiaUFnYVdZZ0tHTnZiR3hoY0hObGN5a2dlMXh1SUNBZ0lHTnZiR3hoY0hObGN5NW1iM0pGWVdOb0tDaGxiR1Z0Wlc1MEtTQTlQaUI3WEc0Z0lDQWdJQ0F2THlCamIyNXpkQ0JqYjI1bWFXY2dQU0I3ZlZ4dUlDQWdJQ0FnWTI5dWMzUWdZMjl1Wm1sbklEMGdaMlYwUVhSMGNtbGlkWFJsYzBOdmJtWnBaeWhsYkdWdFpXNTBMQ0JFUlVaQlZVeFVYMUJTVDFCRlVsUkpSVk1zSUVSQlZFRmZRVlJVVWxOZlVGSlBVRVZTVkVsRlV5bGNiaUFnSUNBZ0lHTnZibVpwWnk1bGJHVnRaVzUwSUQwZ1pXeGxiV1Z1ZEZ4dVhHNGdJQ0FnSUNCamIyMXdiMjVsYm5SekxuQjFjMmdvUTI5c2JHRndjMlV1WDBSUFRVbHVkR1Z5Wm1GalpTaGpiMjVtYVdjcEtWeHVJQ0FnSUgwcFhHNGdJSDFjYmx4dUlDQmtiMk4xYldWdWRDNWhaR1JGZG1WdWRFeHBjM1JsYm1WeUtDZGpiR2xqYXljc0lDaGxkbVZ1ZENrZ1BUNGdlMXh1SUNBZ0lHTnZibk4wSUhSaGNtZGxkQ0E5SUdacGJtUlVZWEpuWlhSQ2VVRjBkSElvWlhabGJuUXVkR0Z5WjJWMExDQW5aR0YwWVMxMGIyZG5iR1VuS1Z4dUlDQWdJR2xtSUNnaGRHRnlaMlYwS1NCN1hHNGdJQ0FnSUNCeVpYUjFjbTVjYmlBZ0lDQjlYRzVjYmlBZ0lDQmpiMjV6ZENCa1lYUmhWRzluWjJ4bFFYUjBjaUE5SUhSaGNtZGxkQzVuWlhSQmRIUnlhV0oxZEdVb0oyUmhkR0V0ZEc5bloyeGxKeWxjYmx4dUlDQWdJR2xtSUNoa1lYUmhWRzluWjJ4bFFYUjBjaUFtSmlCa1lYUmhWRzluWjJ4bFFYUjBjaUE5UFQwZ1RrRk5SU2tnZTF4dUlDQWdJQ0FnYkdWMElHbGtJRDBnZEdGeVoyVjBMbWRsZEVGMGRISnBZblYwWlNnblpHRjBZUzEwWVhKblpYUW5LU0I4ZkNCMFlYSm5aWFF1WjJWMFFYUjBjbWxpZFhSbEtDZG9jbVZtSnlsY2JpQWdJQ0FnSUdsa0lEMGdhV1F1Y21Wd2JHRmpaU2duSXljc0lDY25LVnh1WEc0Z0lDQWdJQ0JqYjI1emRDQmpiMjF3YjI1bGJuUWdQU0JqYjIxd2IyNWxiblJ6TG1acGJtUW9ZeUE5UGlCakxtZGxkRVZzWlcxbGJuUW9LUzVuWlhSQmRIUnlhV0oxZEdVb0oybGtKeWtnUFQwOUlHbGtLVnh1WEc0Z0lDQWdJQ0JwWmlBb0lXTnZiWEJ2Ym1WdWRDa2dlMXh1SUNBZ0lDQWdJQ0J5WlhSMWNtNWNiaUFnSUNBZ0lIMWNibHh1SUNBZ0lDQWdZMjl0Y0c5dVpXNTBMblJ2WjJkc1pTZ3BYRzRnSUNBZ2ZWeHVJQ0I5S1Z4dVhHNGdJSEpsZEhWeWJpQkRiMnhzWVhCelpWeHVmU2tvS1Z4dVhHNWxlSEJ2Y25RZ1pHVm1ZWFZzZENCRGIyeHNZWEJ6WlZ4dUlpd2lMeW9xWEc0Z0tpQXRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMVnh1SUNvZ1RHbGpaVzV6WldRZ2RXNWtaWElnVFVsVUlDaG9kSFJ3Y3pvdkwyZHBkR2gxWWk1amIyMHZjWFZoY21zdFpHVjJMMUJvYjI1dmJpMUdjbUZ0WlhkdmNtc3ZZbXh2WWk5dFlYTjBaWEl2VEVsRFJVNVRSU2xjYmlBcUlDMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRYRzRnS2k5Y2JtbHRjRzl5ZENCN0lHUnBjM0JoZEdOb1JXeGxiV1Z1ZEVWMlpXNTBMQ0JrYVhOd1lYUmphRmRwYmtSdlkwVjJaVzUwSUgwZ1puSnZiU0FuTGk0dlkyOXRiVzl1TDJWMlpXNTBjeTlrYVhOd1lYUmphQ2RjYm1sdGNHOXlkQ0I3SUdkbGJtVnlZWFJsU1dRZ2ZTQm1jbTl0SUNjdUxpOWpiMjF0YjI0dmRYUnBiSE1uWEc1cGJYQnZjblFnUlhabGJuUWdabkp2YlNBbkxpNHZZMjl0Ylc5dUwyVjJaVzUwY3lkY2JtbHRjRzl5ZENCRGIyMXdiMjVsYm5STllXNWhaMlZ5TENCN0lITmxkRUYwZEhKcFluVjBaWE5EYjI1bWFXY3NJR2RsZEVGMGRISnBZblYwWlhORGIyNW1hV2NnZlNCbWNtOXRJQ2N1TDJOdmJYQnZibVZ1ZEUxaGJtRm5aWEluWEc1Y2JpOHFLbHh1SUNvZ0xTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdFhHNGdLaUJEYkdGemN5QkVaV1pwYm1sMGFXOXVYRzRnS2lBdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMxY2JpQXFMMXh1WEc1bGVIQnZjblFnWkdWbVlYVnNkQ0JqYkdGemN5QkRiMjF3YjI1bGJuUWdlMXh1WEc0Z0lHTnZibk4wY25WamRHOXlLRzVoYldVc0lIWmxjbk5wYjI0c0lHUmxabUYxYkhSUGNIUnBiMjV6SUQwZ2UzMHNJRzl3ZEdsdmJuTWdQU0I3ZlN3Z2IzQjBhVzl1UVhSMGNuTWdQU0JiWFN3Z2MzVndjRzl5ZEVSNWJtRnRhV05GYkdWdFpXNTBJRDBnWm1Gc2MyVXNJR0ZrWkZSdlUzUmhZMnNnUFNCbVlXeHpaU2tnZTF4dUlDQWdJSFJvYVhNdWJtRnRaU0E5SUc1aGJXVmNiaUFnSUNCMGFHbHpMblpsY25OcGIyNGdQU0IyWlhKemFXOXVYRzRnSUNBZ2RHaHBjeTV2Y0hScGIyNXpJRDBnYjNCMGFXOXVjMXh1WEc0Z0lDQWdMeThnUUhSdlpHOGdhMlZsY0Q5Y2JpQWdJQ0F2THlCMGFHbHpMbTl3ZEdsdmJuTWdQU0JQWW1wbFkzUXVZWE56YVdkdUtHUmxabUYxYkhSUGNIUnBiMjV6TENCdmNIUnBiMjV6S1Z4dUlDQWdJRTlpYW1WamRDNXJaWGx6S0dSbFptRjFiSFJQY0hScGIyNXpLUzVtYjNKRllXTm9LQ2h3Y205d0tTQTlQaUI3WEc0Z0lDQWdJQ0JwWmlBb2RIbHdaVzltSUhSb2FYTXViM0IwYVc5dWMxdHdjbTl3WFNBOVBUMGdKM1Z1WkdWbWFXNWxaQ2NwSUh0Y2JpQWdJQ0FnSUNBZ2RHaHBjeTV2Y0hScGIyNXpXM0J5YjNCZElEMGdaR1ZtWVhWc2RFOXdkR2x2Ym5OYmNISnZjRjFjYmlBZ0lDQWdJSDFjYmlBZ0lDQjlLVnh1WEc0Z0lDQWdkR2hwY3k1dmNIUnBiMjVCZEhSeWN5QTlJRzl3ZEdsdmJrRjBkSEp6WEc0Z0lDQWdkR2hwY3k1emRYQndiM0owUkhsdVlXMXBZMFZzWlcxbGJuUWdQU0J6ZFhCd2IzSjBSSGx1WVcxcFkwVnNaVzFsYm5SY2JpQWdJQ0IwYUdsekxtRmtaRlJ2VTNSaFkyc2dQU0JoWkdSVWIxTjBZV05yWEc0Z0lDQWdkR2hwY3k1cFpDQTlJR2RsYm1WeVlYUmxTV1FvS1Z4dVhHNGdJQ0FnWTI5dWMzUWdZMmhsWTJ0RmJHVnRaVzUwSUQwZ0lYUm9hWE11YzNWd2NHOXlkRVI1Ym1GdGFXTkZiR1Z0Wlc1MElIeDhJSFJvYVhNdWIzQjBhVzl1Y3k1bGJHVnRaVzUwSUNFOVBTQnVkV3hzWEc1Y2JpQWdJQ0JwWmlBb2RIbHdaVzltSUhSb2FYTXViM0IwYVc5dWN5NWxiR1Z0Wlc1MElEMDlQU0FuYzNSeWFXNW5KeWtnZTF4dUlDQWdJQ0FnZEdocGN5NXZjSFJwYjI1ekxtVnNaVzFsYm5RZ1BTQmtiMk4xYldWdWRDNXhkV1Z5ZVZObGJHVmpkRzl5S0hSb2FYTXViM0IwYVc5dWN5NWxiR1Z0Wlc1MEtWeHVJQ0FnSUgxY2JseHVJQ0FnSUdsbUlDaGphR1ZqYTBWc1pXMWxiblFnSmlZZ0lYUm9hWE11YjNCMGFXOXVjeTVsYkdWdFpXNTBLU0I3WEc0Z0lDQWdJQ0IwYUhKdmR5QnVaWGNnUlhKeWIzSW9ZQ1I3ZEdocGN5NXVZVzFsZlM0Z1ZHaGxJR1ZzWlcxbGJuUWdhWE1nYm05MElHRWdTRlJOVEVWc1pXMWxiblF1WUNsY2JpQWdJQ0I5WEc1Y2JpQWdJQ0IwYUdsekxtUjVibUZ0YVdORmJHVnRaVzUwSUQwZ2RHaHBjeTV2Y0hScGIyNXpMbVZzWlcxbGJuUWdQVDA5SUc1MWJHeGNiaUFnSUNCMGFHbHpMbkpsWjJsemRHVnlaV1JGYkdWdFpXNTBjeUE5SUZ0ZFhHNWNiaUFnSUNCcFppQW9JWFJvYVhNdVpIbHVZVzFwWTBWc1pXMWxiblFwSUh0Y2JpQWdJQ0FnSUM4cUtseHVJQ0FnSUNBZ0lDb2dhV1lnZEdobElHVnNaVzFsYm5RZ1pYaHBjM1J6TENCM1pTQnlaV0ZrSUhSb1pTQmtZWFJoSUdGMGRISnBZblYwWlhNZ1kyOXVabWxuWEc0Z0lDQWdJQ0FnS2lCMGFHVnVJSGRsSUc5MlpYSjNjbWwwWlNCbGVHbHpkR2x1WnlCamIyNW1hV2NnYTJWNWN5QnBiaUJLWVhaaFUyTnlhWEIwTENCemJ5QjBhR0YwWEc0Z0lDQWdJQ0FnS2lCM1pTQnJaV1Z3SUhSb1pTQm1iMnhzYjNkcGJtY2diM0prWlhKY2JpQWdJQ0FnSUNBcUlGc3hYU0JrWldaaGRXeDBJRXBoZG1GVFkzSnBjSFFnWTI5dVptbG5kWEpoZEdsdmJpQnZaaUIwYUdVZ1kyOXRjRzl1Wlc1MFhHNGdJQ0FnSUNBZ0tpQmJNbDBnUkdGMFlTQmhkSFJ5YVdKMWRHVnpJR052Ym1acFozVnlZWFJwYjI0Z2FXWWdkR2hsSUdWc1pXMWxiblFnWlhocGMzUnpJR2x1SUhSb1pTQkVUMDFjYmlBZ0lDQWdJQ0FxSUZzelhTQktZWFpoVTJOeWFYQjBJR052Ym1acFozVnlZWFJwYjI1Y2JpQWdJQ0FnSUNBcUwxeHVJQ0FnSUNBZ2RHaHBjeTV2Y0hScGIyNXpJRDBnVDJKcVpXTjBMbUZ6YzJsbmJpaDBhR2x6TG05d2RHbHZibk1zSUhSb2FYTXVZWE56YVdkdVNuTkRiMjVtYVdjb2RHaHBjeTVuWlhSQmRIUnlhV0oxZEdWektDa3NJRzl3ZEdsdmJuTXBLVnh1WEc0Z0lDQWdJQ0F2THlCMGFHVnVMQ0J6WlhRZ2RHaGxJRzVsZHlCa1lYUmhJR0YwZEhKcFluVjBaWE1nZEc4Z2RHaGxJR1ZzWlcxbGJuUmNiaUFnSUNBZ0lIUm9hWE11YzJWMFFYUjBjbWxpZFhSbGN5Z3BYRzRnSUNBZ2ZWeHVYRzRnSUNBZ2RHaHBjeTVsYkdWdFpXNTBUR2x6ZEdWdVpYSWdQU0JsZG1WdWRDQTlQaUIwYUdsekxtOXVRbVZtYjNKbFJXeGxiV1Z1ZEVWMlpXNTBLR1YyWlc1MEtTQWdJQ0FnSUNBZ0lDQmNiaUFnZlZ4dVhHNGdJR0Z6YzJsbmJrcHpRMjl1Wm1sbktHRjBkSEpEYjI1bWFXY3NJRzl3ZEdsdmJuTXBJSHRjYmlBZ0lDQjBhR2x6TG05d2RHbHZia0YwZEhKekxtWnZja1ZoWTJnb0tHdGxlU2tnUFQ0Z2UxeHVJQ0FnSUNBZ2FXWWdLRzl3ZEdsdmJuTmJhMlY1WFNrZ2UxeHVJQ0FnSUNBZ0lDQmhkSFJ5UTI5dVptbG5XMnRsZVYwZ1BTQnZjSFJwYjI1elcydGxlVjFjYmlBZ0lDQWdJSDFjYmlBZ0lDQjlLVnh1WEc0Z0lDQWdjbVYwZFhKdUlHRjBkSEpEYjI1bWFXZGNiaUFnZlZ4dVhHNGdJR2RsZEZabGNuTnBiMjRvS1NCN1hHNGdJQ0FnY21WMGRYSnVJSFJvYVhNdWRtVnljMmx2Ymx4dUlDQjlYRzVjYmlBZ1oyVjBSV3hsYldWdWRDZ3BJSHRjYmlBZ0lDQnlaWFIxY200Z2RHaHBjeTV2Y0hScGIyNXpMbVZzWlcxbGJuUmNiaUFnZlZ4dVhHNGdJR2RsZEVsa0tDa2dlMXh1SUNBZ0lISmxkSFZ5YmlCMGFHbHpMbWxrWEc0Z0lIMWNibHh1SUNCeVpXZHBjM1JsY2tWc1pXMWxiblJ6S0dWc1pXMWxiblJ6S1NCN1hHNGdJQ0FnWld4bGJXVnVkSE11Wm05eVJXRmphQ2hsYkdWdFpXNTBJRDArSUhSb2FYTXVjbVZuYVhOMFpYSkZiR1Z0Wlc1MEtHVnNaVzFsYm5RcEtWeHVJQ0I5WEc1Y2JpQWdjbVZuYVhOMFpYSkZiR1Z0Wlc1MEtHVnNaVzFsYm5RcElIdGNiaUFnSUNCbGJHVnRaVzUwTG5SaGNtZGxkQzVoWkdSRmRtVnVkRXhwYzNSbGJtVnlLR1ZzWlcxbGJuUXVaWFpsYm5Rc0lIUm9hWE11Wld4bGJXVnVkRXhwYzNSbGJtVnlLVnh1SUNBZ0lIUm9hWE11Y21WbmFYTjBaWEpsWkVWc1pXMWxiblJ6TG5CMWMyZ29aV3hsYldWdWRDbGNiaUFnZlZ4dVhHNGdJSFZ1Y21WbmFYTjBaWEpGYkdWdFpXNTBjeWdwSUh0Y2JpQWdJQ0IwYUdsekxuSmxaMmx6ZEdWeVpXUkZiR1Z0Wlc1MGN5NW1iM0pGWVdOb0tDaGxiR1Z0Wlc1MEtTQTlQaUI3WEc0Z0lDQWdJQ0IwYUdsekxuVnVjbVZuYVhOMFpYSkZiR1Z0Wlc1MEtHVnNaVzFsYm5RcFhHNGdJQ0FnZlNsY2JpQWdmVnh1WEc0Z0lIVnVjbVZuYVhOMFpYSkZiR1Z0Wlc1MEtHVnNaVzFsYm5RcElIdGNiaUFnSUNCamIyNXpkQ0J5WldkcGMzUmxjbVZrUld4bGJXVnVkRWx1WkdWNElEMGdkR2hwY3k1eVpXZHBjM1JsY21Wa1JXeGxiV1Z1ZEhOY2JpQWdJQ0FnSUM1bWFXNWtTVzVrWlhnb1pXd2dQVDRnWld3dWRHRnlaMlYwSUQwOVBTQmxiR1Z0Wlc1MExuUmhjbWRsZENBbUppQmxiQzVsZG1WdWRDQTlQVDBnWld4bGJXVnVkQzVsZG1WdWRDbGNibHh1SUNBZ0lHbG1JQ2h5WldkcGMzUmxjbVZrUld4bGJXVnVkRWx1WkdWNElENGdMVEVwSUh0Y2JpQWdJQ0FnSUdWc1pXMWxiblF1ZEdGeVoyVjBMbkpsYlc5MlpVVjJaVzUwVEdsemRHVnVaWElvWld4bGJXVnVkQzVsZG1WdWRDd2dkR2hwY3k1bGJHVnRaVzUwVEdsemRHVnVaWElwWEc0Z0lDQWdJQ0IwYUdsekxuSmxaMmx6ZEdWeVpXUkZiR1Z0Wlc1MGN5NXpjR3hwWTJVb2NtVm5hWE4wWlhKbFpFVnNaVzFsYm5SSmJtUmxlQ3dnTVNsY2JpQWdJQ0I5SUdWc2MyVWdlMXh1SUNBZ0lDQWdZMjl1YzI5c1pTNWxjbkp2Y2loZ1YyRnlibWx1WnlFZ1ZXNXJibTkzYmlCeVpXZHBjM1JsY21Wa0lHVnNaVzFsYm5RNklDUjdaV3hsYldWdWRDNTBZWEpuWlhSOUlIZHBkR2dnWlhabGJuUTZJQ1I3Wld4bGJXVnVkQzVsZG1WdWRIMHVZQ2xjYmlBZ0lDQjlYRzRnSUgxY2JseHVJQ0IwY21sbloyVnlSWFpsYm5Rb1pYWmxiblJPWVcxbExDQmtaWFJoYVd3Z1BTQjdmU3dnYjJKcVpXTjBSWFpsYm5SUGJteDVJRDBnWm1Gc2MyVXBJSHRjYmlBZ0lDQnBaaUFvZEhsd1pXOW1JR1YyWlc1MFRtRnRaU0FoUFQwZ0ozTjBjbWx1WnljcElIdGNiaUFnSUNBZ0lIUm9jbTkzSUc1bGR5QkZjbkp2Y2lnblZHaGxJR1YyWlc1MElHNWhiV1VnYVhNZ2JtOTBJSFpoYkdsa0xpY3BYRzRnSUNBZ2ZWeHVYRzRnSUNBZ2FXWWdLSFJvYVhNdVlXUmtWRzlUZEdGamF5a2dlMXh1SUNBZ0lDQWdhV1lnS0dWMlpXNTBUbUZ0WlNBOVBUMGdSWFpsYm5RdVUwaFBWeWtnZTF4dUlDQWdJQ0FnSUNCRGIyMXdiMjVsYm5STllXNWhaMlZ5TG1Ga1pDaDBhR2x6S1Z4dUlDQWdJQ0FnZlNCbGJITmxJR2xtSUNobGRtVnVkRTVoYldVZ1BUMDlJRVYyWlc1MExraEpSRVVwSUh0Y2JpQWdJQ0FnSUNBZ1EyOXRjRzl1Wlc1MFRXRnVZV2RsY2k1eVpXMXZkbVVvZEdocGN5bGNiaUFnSUNBZ0lIMWNiaUFnSUNCOVhHNWNiaUFnSUNBdkx5QmxkbVZ1ZENCdVlXMWxjeUJqWVc0Z1ltVWdkMmwwYUNCa2IzUWdibTkwWVhScGIyNGdiR2xyWlNCeVpXTnZibTVsWTNScGJtY3VjM1ZqWTJWemMxeHVJQ0FnSUdOdmJuTjBJR1YyWlc1MFRtRnRaVTlpYW1WamRDQTlJR1YyWlc1MFRtRnRaUzV6Y0d4cGRDZ25MaWNwTG5KbFpIVmpaU2dvWVdOakxDQmpkWEp5Wlc1MExDQnBibVJsZUNrZ1BUNGdlMXh1SUNBZ0lDQWdhV1lnS0dsdVpHVjRJRDA5UFNBd0tTQjdYRzRnSUNBZ0lDQWdJSEpsZEhWeWJpQmpkWEp5Wlc1MFhHNGdJQ0FnSUNCOVhHNWNiaUFnSUNBZ0lISmxkSFZ5YmlCaFkyTWdLeUJqZFhKeVpXNTBMbU5vWVhKQmRDZ3dLUzUwYjFWd2NHVnlRMkZ6WlNncElDc2dZM1Z5Y21WdWRDNXpiR2xqWlNneEtWeHVJQ0FnSUgwcFhHNWNiaUFnSUNCamIyNXpkQ0JsZG1WdWRFNWhiV1ZCYkdsaGN5QTlJR0J2YmlSN1pYWmxiblJPWVcxbFQySnFaV04wTG1Ob1lYSkJkQ2d3S1M1MGIxVndjR1Z5UTJGelpTZ3BmU1I3WlhabGJuUk9ZVzFsVDJKcVpXTjBMbk5zYVdObEtERXBmV0JjYmx4dUlDQWdJQzh2SUc5aWFtVmpkQ0JsZG1WdWRGeHVJQ0FnSUdsbUlDaDBlWEJsYjJZZ2RHaHBjeTV2Y0hScGIyNXpXMlYyWlc1MFRtRnRaVTlpYW1WamRGMGdQVDA5SUNkbWRXNWpkR2x2YmljcElIdGNiaUFnSUNBZ0lIUm9hWE11YjNCMGFXOXVjMXRsZG1WdWRFNWhiV1ZQWW1wbFkzUmRMbUZ3Y0d4NUtIUm9hWE1zSUZ0a1pYUmhhV3hkS1Z4dUlDQWdJSDFjYmx4dUlDQWdJR2xtSUNoMGVYQmxiMllnZEdocGN5NXZjSFJwYjI1elcyVjJaVzUwVG1GdFpVRnNhV0Z6WFNBOVBUMGdKMloxYm1OMGFXOXVKeWtnZTF4dUlDQWdJQ0FnZEdocGN5NXZjSFJwYjI1elcyVjJaVzUwVG1GdFpVRnNhV0Z6WFM1aGNIQnNlU2gwYUdsekxDQmJaR1YwWVdsc1hTbGNiaUFnSUNCOVhHNWNiaUFnSUNCcFppQW9iMkpxWldOMFJYWmxiblJQYm14NUtTQjdYRzRnSUNBZ0lDQnlaWFIxY201Y2JpQWdJQ0I5WEc1Y2JpQWdJQ0F2THlCa2IyMGdaWFpsYm5SY2JpQWdJQ0JwWmlBb2RHaHBjeTV2Y0hScGIyNXpMbVZzWlcxbGJuUXBJSHRjYmlBZ0lDQWdJR1JwYzNCaGRHTm9SV3hsYldWdWRFVjJaVzUwS0hSb2FYTXViM0IwYVc5dWN5NWxiR1Z0Wlc1MExDQmxkbVZ1ZEU1aGJXVXNJSFJvYVhNdWJtRnRaU3dnWkdWMFlXbHNLVnh1SUNBZ0lIMGdaV3h6WlNCN1hHNGdJQ0FnSUNCa2FYTndZWFJqYUZkcGJrUnZZMFYyWlc1MEtHVjJaVzUwVG1GdFpTd2dkR2hwY3k1dVlXMWxMQ0JrWlhSaGFXd3BYRzRnSUNBZ2ZWeHVJQ0I5WEc1Y2JpQWdjMlYwUVhSMGNtbGlkWFJsY3lncElIdGNiaUFnSUNCcFppQW9kR2hwY3k1dmNIUnBiMjVCZEhSeWN5NXNaVzVuZEdnZ1BpQXdLU0I3WEc0Z0lDQWdJQ0J6WlhSQmRIUnlhV0oxZEdWelEyOXVabWxuS0hSb2FYTXViM0IwYVc5dWN5NWxiR1Z0Wlc1MExDQjBhR2x6TG05d2RHbHZibk1zSUhSb2FYTXViM0IwYVc5dVFYUjBjbk1wWEc0Z0lDQWdmVnh1SUNCOVhHNWNiaUFnWjJWMFFYUjBjbWxpZFhSbGN5Z3BJSHRjYmlBZ0lDQmpiMjV6ZENCdmNIUnBiMjV6SUQwZ1QySnFaV04wTG1GemMybG5iaWg3ZlN3Z2RHaHBjeTV2Y0hScGIyNXpLVnh1SUNBZ0lISmxkSFZ5YmlCblpYUkJkSFJ5YVdKMWRHVnpRMjl1Wm1sbktIUm9hWE11YjNCMGFXOXVjeTVsYkdWdFpXNTBMQ0J2Y0hScGIyNXpMQ0IwYUdsekxtOXdkR2x2YmtGMGRISnpLVnh1SUNCOVhHNWNiaUFnTHlvcVhHNGdJQ0FxSUhSb1pTQndjbVYyWlc1MFEyeHZjMkZpYkdVZ2JXVjBhRzlrSUcxaGJtRm5aWE1nWTI5dVkzVnljbVZ1WTNrZ1ltVjBkMlZsYmlCaFkzUnBkbVVnWTI5dGNHOXVaVzUwY3k1Y2JpQWdJQ29nUm05eUlHVjRZVzF3YkdVc0lHbG1JSFJvWlhKbElHbHpJR0VnYzJodmQyNGdiMlptTFdOaGJuWmhjeUJoYm1RZ1pHbGhiRzluTENCMGFHVWdiR0Z6ZEZ4dUlDQWdLaUJ6YUc5M2JpQmpiMjF3YjI1bGJuUWdaMkZwYm5NZ2RHaGxJSEJ5YjJObGMzTnBibWNnY0hKcGIzSnBkSGxjYmlBZ0lDb3ZYRzRnSUhCeVpYWmxiblJEYkc5ellXSnNaU2dwSUh0Y2JpQWdJQ0J5WlhSMWNtNGdkR2hwY3k1aFpHUlViMU4wWVdOcklDWW1JQ0ZEYjIxd2IyNWxiblJOWVc1aFoyVnlMbU5zYjNOaFlteGxLSFJvYVhNcFhHNGdJSDFjYmx4dUlDQnZia0psWm05eVpVVnNaVzFsYm5SRmRtVnVkQ2hsZG1WdWRDa2dlMXh1SUNBZ0lHbG1JQ2gwYUdsekxuQnlaWFpsYm5SRGJHOXpZV0pzWlNncEtTQjdYRzRnSUNBZ0lDQnlaWFIxY201Y2JpQWdJQ0I5WEc1Y2JpQWdJQ0IwYUdsekxtOXVSV3hsYldWdWRFVjJaVzUwS0dWMlpXNTBLVnh1SUNCOVhHNWNiaUFnYjI1RmJHVnRaVzUwUlhabGJuUW9aWFpsYm5RcElIdGNiaUFnSUNBdkwxeHVJQ0I5WEc1Y2JpQWdjM1JoZEdsaklHbGtaVzUwYVdacFpYSW9LU0I3WEc0Z0lDQWdjbVYwZFhKdUlIUm9hWE11Ym1GdFpWeHVJQ0I5WEc1Y2JpQWdjM1JoZEdsaklGOUVUMDFKYm5SbGNtWmhZMlVvUTI5dGNHOXVaVzUwUTJ4aGMzTXNJRzl3ZEdsdmJuTXBJSHRjYmlBZ0lDQnlaWFIxY200Z2JtVjNJRU52YlhCdmJtVnVkRU5zWVhOektHOXdkR2x2Ym5NcFhHNGdJSDFjYm4xY2JpSXNJbHh1WTI5dWMzUWdaMlYwUVhSMGNtbGlkWFJsSUQwZ0tHWnBjbk4wTENCelpXTnZibVFwSUQwK0lIdGNiaUFnYVdZZ0tHWnBjbk4wSUQwOVBTQW5KeWtnZTF4dUlDQWdJSEpsZEhWeWJpQmdaR0YwWVMwa2UzTmxZMjl1WkgxZ1hHNGdJSDFjYmlBZ2NtVjBkWEp1SUdCa1lYUmhMU1I3Wm1seWMzUjlMU1I3YzJWamIyNWtmV0JjYm4xY2JseHVaWGh3YjNKMElHWjFibU4wYVc5dUlITmxkRUYwZEhKcFluVjBaWE5EYjI1bWFXY29aV3hsYldWdWRDd2diMkpxSUQwZ2UzMHNJR0YwZEhKekxDQnpkR0Z5ZENBOUlDY25LU0I3WEc0Z0lHTnZibk4wSUd0bGVYTWdQU0JQWW1wbFkzUXVhMlY1Y3lodlltb3BYRzVjYmlBZ2EyVjVjeTVtYjNKRllXTm9LQ2hyWlhrcElEMCtJSHRjYmlBZ0lDQnBaaUFvYzNSaGNuUWdQVDA5SUNjbklDWW1JR0YwZEhKekxtbHVaR1Y0VDJZb2EyVjVLU0E5UFQwZ0xURXBJSHRjYmlBZ0lDQWdJQzh2SUdOdmJuUnBiblZsSUhkcGRHZ2dibVY0ZENCcGRHVnlZWFJwYjI1Y2JpQWdJQ0FnSUhKbGRIVnlibHh1SUNBZ0lIMWNibHh1SUNBZ0lHbG1JQ2gwZVhCbGIyWWdiMkpxVzJ0bGVWMGdQVDA5SUNkdlltcGxZM1FuSUNZbUlHOWlhbHRyWlhsZElDRTlQU0J1ZFd4c0tTQjdYRzRnSUNBZ0lDQnNaWFFnYTJWNVUzUmhjblFnUFNCclpYbGNiaUFnSUNBZ0lHbG1JQ2h6ZEdGeWRDQWhQVDBnSnljcElIdGNiaUFnSUNBZ0lDQWdhMlY1VTNSaGNuUWdQU0JnSkh0emRHRnlkSDB0Skh0clpYbDlZRnh1SUNBZ0lDQWdmVnh1WEc0Z0lDQWdJQ0J6WlhSQmRIUnlhV0oxZEdWelEyOXVabWxuS0dWc1pXMWxiblFzSUc5aWFsdHJaWGxkTENCaGRIUnljeXdnYTJWNVUzUmhjblFwWEc0Z0lDQWdJQ0J5WlhSMWNtNWNiaUFnSUNCOVhHNWNiaUFnSUNCamIyNXpkQ0JoZEhSeUlEMGdaMlYwUVhSMGNtbGlkWFJsS0hOMFlYSjBMQ0JyWlhrcFhHNGdJQ0FnWld4bGJXVnVkQzV6WlhSQmRIUnlhV0oxZEdVb1lYUjBjaXdnYjJKcVcydGxlVjBwWEc0Z0lIMHBYRzU5WEc1Y2JtVjRjRzl5ZENCbWRXNWpkR2x2YmlCblpYUkJkSFJ5YVdKMWRHVnpRMjl1Wm1sbktHVnNaVzFsYm5Rc0lHOWlhaUE5SUh0OUxDQmhkSFJ5Y3l3Z2MzUmhjblFnUFNBbkp5a2dlMXh1SUNCamIyNXpkQ0J1WlhkUFltb2dQU0JQWW1wbFkzUXVZWE56YVdkdUtIdDlMQ0J2WW1vcFhHNGdJR052Ym5OMElHdGxlWE1nUFNCUFltcGxZM1F1YTJWNWN5aHZZbW9wWEc1Y2JpQWdhMlY1Y3k1bWIzSkZZV05vS0NoclpYa3BJRDArSUh0Y2JpQWdJQ0JwWmlBb2MzUmhjblFnUFQwOUlDY25JQ1ltSUdGMGRISnpMbWx1WkdWNFQyWW9hMlY1S1NBOVBUMGdMVEVwSUh0Y2JpQWdJQ0FnSUM4dklHTnZiblJwYm5WbElIZHBkR2dnYm1WNGRDQnBkR1Z5WVhScGIyNWNiaUFnSUNBZ0lISmxkSFZ5Ymx4dUlDQWdJSDFjYmx4dUlDQWdJR2xtSUNodlltcGJhMlY1WFNBaFBUMGdiblZzYkNBbUppQnZZbXBiYTJWNVhTNWpiMjV6ZEhKMVkzUnZjaUE5UFQwZ1QySnFaV04wS1NCN1hHNGdJQ0FnSUNCc1pYUWdhMlY1VTNSaGNuUWdQU0JyWlhsY2JpQWdJQ0FnSUdsbUlDaHpkR0Z5ZENBaFBUMGdKeWNwSUh0Y2JpQWdJQ0FnSUNBZ2EyVjVVM1JoY25RZ1BTQmdKSHR6ZEdGeWRIMHRKSHRyWlhsOVlGeHVJQ0FnSUNBZ2ZWeHVYRzRnSUNBZ0lDQnVaWGRQWW1wYmEyVjVYU0E5SUdkbGRFRjBkSEpwWW5WMFpYTkRiMjVtYVdjb1pXeGxiV1Z1ZEN3Z2IySnFXMnRsZVYwc0lHRjBkSEp6TENCclpYbFRkR0Z5ZENsY2JpQWdJQ0FnSUhKbGRIVnlibHh1SUNBZ0lIMWNibHh1SUNBZ0lDOHZJSFZ3WkdGMFpTQjJZV3gxWlZ4dUlDQWdJR3hsZENCMllXeDFaU0E5SUc5aWFsdHJaWGxkSUM4dklHUmxabUYxYkhRZ2RtRnNkV1ZjYmlBZ0lDQmpiMjV6ZENCMGVYQmxJRDBnZEhsd1pXOW1JSFpoYkhWbFhHNGdJQ0FnWTI5dWMzUWdZWFIwY2lBOUlHZGxkRUYwZEhKcFluVjBaU2h6ZEdGeWRDd2dhMlY1S1Z4dUlDQWdJR052Ym5OMElHRjBkSEpXWVd4MVpTQTlJR1ZzWlcxbGJuUXVaMlYwUVhSMGNtbGlkWFJsS0dGMGRISXBYRzVjYmlBZ0lDQnBaaUFvWVhSMGNsWmhiSFZsSUNFOVBTQnVkV3hzS1NCN1hHNGdJQ0FnSUNCcFppQW9kSGx3WlNBOVBUMGdKMkp2YjJ4bFlXNG5LU0I3WEc0Z0lDQWdJQ0FnSUM4dklHTnZiblpsY25RZ2MzUnlhVzVuSUhSdklHSnZiMnhsWVc1Y2JpQWdJQ0FnSUNBZ2RtRnNkV1VnUFNCaGRIUnlWbUZzZFdVZ1BUMDlJQ2QwY25WbEoxeHVJQ0FnSUNBZ2ZTQmxiSE5sSUdsbUlDZ2hhWE5PWVU0b1lYUjBjbFpoYkhWbEtTa2dlMXh1SUNBZ0lDQWdJQ0IyWVd4MVpTQTlJSEJoY25ObFNXNTBLR0YwZEhKV1lXeDFaU3dnTVRBcFhHNGdJQ0FnSUNCOUlHVnNjMlVnZTF4dUlDQWdJQ0FnSUNCMllXeDFaU0E5SUdGMGRISldZV3gxWlZ4dUlDQWdJQ0FnZlZ4dUlDQWdJSDFjYmx4dUlDQWdJRzVsZDA5aWFsdHJaWGxkSUQwZ2RtRnNkV1ZjYmlBZ2ZTbGNibHh1SUNCeVpYUjFjbTRnYm1WM1QySnFYRzU5WEc1Y2JtTnZibk4wSUhOMFlXTnJJRDBnVzExY2JseHVaWGh3YjNKMElHUmxabUYxYkhRZ2UxeHVJQ0JoWkdRb1kyOXRjRzl1Wlc1MEtTQjdYRzRnSUNBZ2MzUmhZMnN1Y0hWemFDaGpiMjF3YjI1bGJuUXBYRzRnSUgwc1hHNGdJSEpsYlc5MlpTaGpiMjF3YjI1bGJuUXBJSHRjYmlBZ0lDQmpiMjV6ZENCcGJtUmxlQ0E5SUhOMFlXTnJMbVpwYm1SSmJtUmxlQ2hqSUQwK0lFOWlhbVZqZEM1cGN5aGpiMjF3YjI1bGJuUXNJR01wS1Z4dUlDQWdJR2xtSUNocGJtUmxlQ0ErSUMweEtTQjdYRzRnSUNBZ0lDQnpkR0ZqYXk1emNHeHBZMlVvYVc1a1pYZ3NJREVwWEc0Z0lDQWdmVnh1SUNCOUxGeHVJQ0JqYkc5ellXSnNaU2hqYjIxd2IyNWxiblFwSUh0Y2JpQWdJQ0J5WlhSMWNtNGdjM1JoWTJzdWJHVnVaM1JvSUQwOVBTQXdJSHg4SUU5aWFtVmpkQzVwY3loemRHRmphMXR6ZEdGamF5NXNaVzVuZEdnZ0xTQXhYU3dnWTI5dGNHOXVaVzUwS1Z4dUlDQjlYRzU5WEc0aUxDSXZLaXBjYmlBcUlDMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRYRzRnS2lCTWFXTmxibk5sWkNCMWJtUmxjaUJOU1ZRZ0tHaDBkSEJ6T2k4dloybDBhSFZpTG1OdmJTOXhkV0Z5YXkxa1pYWXZVR2h2Ym05dUxVWnlZVzFsZDI5eWF5OWliRzlpTDIxaGMzUmxjaTlNU1VORlRsTkZLVnh1SUNvZ0xTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMWNiaUFxTDF4dWFXMXdiM0owSUVScFlXeHZaeUJtY205dElDY3VMMmx1WkdWNEoxeHVhVzF3YjNKMElIc2daMlYwUVhSMGNtbGlkWFJsYzBOdmJtWnBaeUI5SUdaeWIyMGdKeTR1TDJOdmJYQnZibVZ1ZEUxaGJtRm5aWEluWEc1Y2JtTnZibk4wSUVOdmJtWnBjbTBnUFNBb0tDa2dQVDRnZTF4dVhHNGdJQzhxS2x4dUlDQWdLaUF0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzFjYmlBZ0lDb2dRMjl1YzNSaGJuUnpYRzRnSUNBcUlDMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExWeHVJQ0FnS2k5Y2JseHVJQ0JqYjI1emRDQk9RVTFGSUQwZ0oyTnZibVpwY20wblhHNGdJR052Ym5OMElFUkZSa0ZWVEZSZlVGSlBVRVZTVkVsRlV5QTlJSHRjYmlBZ0lDQmxiR1Z0Wlc1ME9pQnVkV3hzTEZ4dUlDQWdJSFJwZEd4bE9pQnVkV3hzTEZ4dUlDQWdJRzFsYzNOaFoyVTZJRzUxYkd3c1hHNGdJQ0FnWTJGdVkyVnNZV0pzWlRvZ2RISjFaU3hjYmlBZ0lDQjBlWEJsT2lCT1FVMUZMRnh1SUNBZ0lHSjFkSFJ2Ym5NNklGdGNiaUFnSUNBZ0lIdGNiaUFnSUNBZ0lDQWdkR1Y0ZERvZ0owTmhibU5sYkNjc1hHNGdJQ0FnSUNBZ0lHUnBjMjFwYzNNNklIUnlkV1VzWEc0Z0lDQWdJQ0FnSUdOc1lYTnpPaUFuWW5SdUlHSjBiaTF6WldOdmJtUmhjbmtuTEZ4dUlDQWdJQ0FnZlN4Y2JpQWdJQ0FnSUh0Y2JpQWdJQ0FnSUNBZ2RHVjRkRG9nSjA5ckp5eGNiaUFnSUNBZ0lDQWdaR2x6YldsemN6b2dkSEoxWlN4Y2JpQWdJQ0FnSUNBZ1kyeGhjM002SUNkaWRHNGdZblJ1TFhCeWFXMWhjbmtuTEZ4dUlDQWdJQ0FnZlN4Y2JpQWdJQ0JkTEZ4dUlDQjlYRzRnSUdOdmJuTjBJRVJCVkVGZlFWUlVVbE5mVUZKUFVFVlNWRWxGVXlBOUlGdGNiaUFnSUNBblkyRnVZMlZzWVdKc1pTY3NYRzRnSUYxY2JseHVJQ0F2S2lwY2JpQWdJQ29nTFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0WEc0Z0lDQXFJRU5zWVhOeklFUmxabWx1YVhScGIyNWNiaUFnSUNvZ0xTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdFhHNGdJQ0FxTDF4dVhHNGdJR05zWVhOeklFTnZibVpwY20wZ1pYaDBaVzVrY3lCRWFXRnNiMmNnZTF4dVhHNGdJQ0FnWTI5dWMzUnlkV04wYjNJb2IzQjBhVzl1Y3lBOUlIdDlLU0I3WEc0Z0lDQWdJQ0JqYjI1emRDQjBaVzF3YkdGMFpTQTlJQ2NuSUN0Y2JpQWdJQ0FnSUNjOFpHbDJJR05zWVhOelBWd2laR2xoYkc5blhDSWdkR0ZpYVc1a1pYZzlYQ0l0TVZ3aUlISnZiR1U5WENKa2FXRnNiMmRjSWo0bklDdGNiaUFnSUNBZ0lDQWdKenhrYVhZZ1kyeGhjM005WENKa2FXRnNiMmN0YVc1dVpYSmNJaUJ5YjJ4bFBWd2laRzlqZFcxbGJuUmNJajRuSUN0Y2JpQWdJQ0FnSUNBZ0lDQW5QR1JwZGlCamJHRnpjejFjSW1ScFlXeHZaeTFqYjI1MFpXNTBYQ0krSnlBclhHNGdJQ0FnSUNBZ0lDQWdJQ0FuUEdScGRpQmpiR0Z6Y3oxY0ltUnBZV3h2Wnkxb1pXRmtaWEpjSWo0bklDdGNiaUFnSUNBZ0lDQWdJQ0FnSUNBZ0p6eG9OU0JqYkdGemN6MWNJbVJwWVd4dlp5MTBhWFJzWlZ3aVBqd3ZhRFUrSnlBclhHNGdJQ0FnSUNBZ0lDQWdJQ0FuUEM5a2FYWStKeUFyWEc0Z0lDQWdJQ0FnSUNBZ0lDQW5QR1JwZGlCamJHRnpjejFjSW1ScFlXeHZaeTFpYjJSNVhDSStKeUFyWEc0Z0lDQWdJQ0FnSUNBZ0lDQWdJQ2M4Y0Q0OEwzQStKeUFyWEc0Z0lDQWdJQ0FnSUNBZ0lDQW5QQzlrYVhZK0p5QXJYRzRnSUNBZ0lDQWdJQ0FnSUNBblBHUnBkaUJqYkdGemN6MWNJbVJwWVd4dlp5MW1iMjkwWlhKY0lqNG5JQ3RjYmlBZ0lDQWdJQ0FnSUNBZ0lDYzhMMlJwZGo0bklDdGNiaUFnSUNBZ0lDQWdJQ0FuUEM5a2FYWStKeUFyWEc0Z0lDQWdJQ0FnSUNjOEwyUnBkajRuSUN0Y2JpQWdJQ0FnSUNjOEwyUnBkajRuWEc1Y2JpQWdJQ0FnSUdsbUlDZ2hRWEp5WVhrdWFYTkJjbkpoZVNodmNIUnBiMjV6TG1KMWRIUnZibk1wS1NCN1hHNGdJQ0FnSUNBZ0lHOXdkR2x2Ym5NdVluVjBkRzl1Y3lBOUlFUkZSa0ZWVEZSZlVGSlBVRVZTVkVsRlV5NWlkWFIwYjI1elhHNGdJQ0FnSUNCOVhHNWNiaUFnSUNBZ0lITjFjR1Z5S0c5d2RHbHZibk1zSUhSbGJYQnNZWFJsS1Z4dUlDQWdJSDFjYmx4dUlDQWdJSE4wWVhScFl5QnBaR1Z1ZEdsbWFXVnlLQ2tnZTF4dUlDQWdJQ0FnY21WMGRYSnVJRTVCVFVWY2JpQWdJQ0I5WEc1Y2JpQWdJQ0J6ZEdGMGFXTWdYMFJQVFVsdWRHVnlabUZqWlNodmNIUnBiMjV6S1NCN1hHNGdJQ0FnSUNCeVpYUjFjbTRnYm1WM0lFTnZibVpwY20wb2IzQjBhVzl1Y3lsY2JpQWdJQ0I5WEc0Z0lIMWNibHh1SUNBdktpcGNiaUFnSUNvZ0xTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdFhHNGdJQ0FxSUVSUFRTQkJjR2tnYVcxd2JHVnRaVzUwWVhScGIyNWNiaUFnSUNvZ0xTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdFhHNGdJQ0FxTDF4dUlDQmpiMjV6ZENCamIyMXdiMjVsYm5SeklEMGdXMTFjYmlBZ1kyOXVjM1FnWkdsaGJHOW5jeUE5SUdSdlkzVnRaVzUwTG5GMVpYSjVVMlZzWldOMGIzSkJiR3dvWUM0a2UwUnBZV3h2Wnk1cFpHVnVkR2xtYVdWeUtDbDlZQ2xjYmx4dUlDQnBaaUFvWkdsaGJHOW5jeWtnZTF4dUlDQWdJRUZ5Y21GNUxtWnliMjBvWkdsaGJHOW5jeWt1Wm05eVJXRmphQ2dvWld4bGJXVnVkQ2tnUFQ0Z2UxeHVJQ0FnSUNBZ1kyOXVjM1FnWTI5dVptbG5JRDBnWjJWMFFYUjBjbWxpZFhSbGMwTnZibVpwWnlobGJHVnRaVzUwTENCRVJVWkJWVXhVWDFCU1QxQkZVbFJKUlZNc0lFUkJWRUZmUVZSVVVsTmZVRkpQVUVWU1ZFbEZVeWxjYmlBZ0lDQWdJR052Ym1acFp5NWxiR1Z0Wlc1MElEMGdaV3hsYldWdWRGeHVYRzRnSUNBZ0lDQnBaaUFvWTI5dVptbG5MblI1Y0dVZ1BUMDlJRTVCVFVVcElIdGNiaUFnSUNBZ0lDQWdMeThnWTI5dVptbHliVnh1SUNBZ0lDQWdJQ0JqYjIxd2IyNWxiblJ6TG5CMWMyZ29ibVYzSUVOdmJtWnBjbTBvWTI5dVptbG5LU2xjYmlBZ0lDQWdJSDFjYmlBZ0lDQjlLVnh1SUNCOVhHNWNiaUFnWkc5amRXMWxiblF1WVdSa1JYWmxiblJNYVhOMFpXNWxjaWduWTJ4cFkyc25MQ0FvWlhabGJuUXBJRDArSUh0Y2JpQWdJQ0JqYjI1emRDQmtZWFJoVkc5bloyeGxRWFIwY2lBOUlHVjJaVzUwTG5SaGNtZGxkQzVuWlhSQmRIUnlhV0oxZEdVb0oyUmhkR0V0ZEc5bloyeGxKeWxjYmlBZ0lDQnBaaUFvWkdGMFlWUnZaMmRzWlVGMGRISWdKaVlnWkdGMFlWUnZaMmRzWlVGMGRISWdQVDA5SUU1QlRVVXBJSHRjYmlBZ0lDQWdJR052Ym5OMElHbGtJRDBnWlhabGJuUXVkR0Z5WjJWMExtZGxkRUYwZEhKcFluVjBaU2duWkdGMFlTMTBZWEpuWlhRbktWeHVJQ0FnSUNBZ1kyOXVjM1FnWld4bGJXVnVkQ0E5SUdSdlkzVnRaVzUwTG5GMVpYSjVVMlZzWldOMGIzSW9hV1FwWEc1Y2JpQWdJQ0FnSUdOdmJuTjBJR052YlhCdmJtVnVkQ0E5SUdOdmJYQnZibVZ1ZEhNdVptbHVaQ2hqSUQwK0lHTXVaV3hsYldWdWRDQTlQVDBnWld4bGJXVnVkQ2xjYmx4dUlDQWdJQ0FnYVdZZ0tDRmpiMjF3YjI1bGJuUXBJSHRjYmlBZ0lDQWdJQ0FnY21WMGRYSnVYRzRnSUNBZ0lDQjlYRzVjYmlBZ0lDQWdJQzh2SUhKbGJXOTJaU0IwYUdVZ1ptOWpkWE1nYzNSaGRHVWdiMllnZEdobElIUnlhV2RuWlhKY2JpQWdJQ0FnSUdWMlpXNTBMblJoY21kbGRDNWliSFZ5S0NsY2JseHVJQ0FnSUNBZ1kyOXRjRzl1Wlc1MExtUnBZV3h2Wnk1emFHOTNLQ2xjYmlBZ0lDQjlYRzRnSUgwcFhHNWNiaUFnY21WMGRYSnVJRU52Ym1acGNtMWNibjBwS0NsY2JseHVaWGh3YjNKMElHUmxabUYxYkhRZ1EyOXVabWx5YlZ4dUlpd2lMeW9xWEc0Z0tpQXRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMVnh1SUNvZ1RHbGpaVzV6WldRZ2RXNWtaWElnVFVsVUlDaG9kSFJ3Y3pvdkwyZHBkR2gxWWk1amIyMHZjWFZoY21zdFpHVjJMMUJvYjI1dmJpMUdjbUZ0WlhkdmNtc3ZZbXh2WWk5dFlYTjBaWEl2VEVsRFJVNVRSU2xjYmlBcUlDMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRYRzRnS2k5Y2JtbHRjRzl5ZENCRmRtVnVkQ0JtY205dElDY3VMaTh1TGk5amIyMXRiMjR2WlhabGJuUnpKMXh1YVcxd2IzSjBJRU52YlhCdmJtVnVkQ0JtY205dElDY3VMaTlqYjIxd2IyNWxiblFuWEc1cGJYQnZjblFnZXlCblpYUkJkSFJ5YVdKMWRHVnpRMjl1Wm1sbklIMGdabkp2YlNBbkxpNHZZMjl0Y0c5dVpXNTBUV0Z1WVdkbGNpZGNibHh1WTI5dWMzUWdSR2xoYkc5bklEMGdLQ2dwSUQwK0lIdGNiaUFnTHlvcVhHNGdJQ0FxSUMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFZ4dUlDQWdLaUJEYjI1emRHRnVkSE5jYmlBZ0lDb2dMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRYRzRnSUNBcUwxeHVYRzRnSUdOdmJuTjBJRTVCVFVVZ1BTQW5aR2xoYkc5bkoxeHVJQ0JqYjI1emRDQldSVkpUU1U5T0lEMGdKekl1TUM0d0oxeHVJQ0JqYjI1emRDQkNRVU5MUkZKUFVGOVRSVXhGUTFSUFVpQTlJQ2RrYVdGc2IyY3RZbUZqYTJSeWIzQW5YRzRnSUdOdmJuTjBJRVJGUmtGVlRGUmZVRkpQVUVWU1ZFbEZVeUE5SUh0Y2JpQWdJQ0JsYkdWdFpXNTBPaUJ1ZFd4c0xGeHVJQ0FnSUhScGRHeGxPaUJ1ZFd4c0xGeHVJQ0FnSUcxbGMzTmhaMlU2SUc1MWJHd3NYRzRnSUNBZ1kyRnVZMlZzWVdKc1pUb2dkSEoxWlN4Y2JpQWdJQ0JpZFhSMGIyNXpPaUJiWEc0Z0lDQWdJQ0I3WEc0Z0lDQWdJQ0FnSUhSbGVIUTZJQ2RQYXljc1hHNGdJQ0FnSUNBZ0lHUnBjMjFwYzNNNklIUnlkV1VzWEc0Z0lDQWdJQ0FnSUdOc1lYTnpPaUFuWW5SdUlHSjBiaTF3Y21sdFlYSjVKeXhjYmlBZ0lDQWdJSDBzWEc0Z0lDQWdYU3hjYmlBZ2ZWeHVJQ0JqYjI1emRDQkVRVlJCWDBGVVZGSlRYMUJTVDFCRlVsUkpSVk1nUFNCYlhHNGdJQ0FnSjJOaGJtTmxiR0ZpYkdVbkxGeHVJQ0JkWEc1Y2JpQWdMeW9xWEc0Z0lDQXFJQzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMVnh1SUNBZ0tpQkRiR0Z6Y3lCRVpXWnBibWwwYVc5dVhHNGdJQ0FxSUMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFZ4dUlDQWdLaTljYmx4dUlDQmpiR0Z6Y3lCRWFXRnNiMmNnWlhoMFpXNWtjeUJEYjIxd2IyNWxiblFnZTF4dVhHNGdJQ0FnWTI5dWMzUnlkV04wYjNJb2IzQjBhVzl1Y3lBOUlIdDlMQ0IwWlcxd2JHRjBaU0E5SUc1MWJHd3BJSHRjYmlBZ0lDQWdJSE4xY0dWeUtFNUJUVVVzSUZaRlVsTkpUMDRzSUVSRlJrRlZURlJmVUZKUFVFVlNWRWxGVXl3Z2IzQjBhVzl1Y3l3Z1JFRlVRVjlCVkZSU1UxOVFVazlRUlZKVVNVVlRMQ0IwY25WbExDQjBjblZsS1Z4dVhHNGdJQ0FnSUNCMGFHbHpMblJsYlhCc1lYUmxJRDBnZEdWdGNHeGhkR1VnZkh3Z0p5Y2dLMXh1SUNBZ0lDQWdKenhrYVhZZ1kyeGhjM005WENKa2FXRnNiMmRjSWlCMFlXSnBibVJsZUQxY0lpMHhYQ0lnY205c1pUMWNJbVJwWVd4dloxd2lQaWNnSzF4dUlDQWdJQ0FnSUNBblBHUnBkaUJqYkdGemN6MWNJbVJwWVd4dlp5MXBibTVsY2x3aUlISnZiR1U5WENKa2IyTjFiV1Z1ZEZ3aVBpY2dLMXh1SUNBZ0lDQWdJQ0FnSUNjOFpHbDJJR05zWVhOelBWd2laR2xoYkc5bkxXTnZiblJsYm5SY0lqNG5JQ3RjYmlBZ0lDQWdJQ0FnSUNBZ0lDYzhaR2wySUdOc1lYTnpQVndpWkdsaGJHOW5MV2hsWVdSbGNsd2lQaWNnSzF4dUlDQWdJQ0FnSUNBZ0lDQWdJQ0FuUEdnMUlHTnNZWE56UFZ3aVpHbGhiRzluTFhScGRHeGxYQ0krUEM5b05UNG5JQ3RjYmlBZ0lDQWdJQ0FnSUNBZ0lDYzhMMlJwZGo0bklDdGNiaUFnSUNBZ0lDQWdJQ0FnSUNjOFpHbDJJR05zWVhOelBWd2laR2xoYkc5bkxXSnZaSGxjSWo0bklDdGNiaUFnSUNBZ0lDQWdJQ0FnSUNBZ0p6eHdQand2Y0Q0bklDdGNiaUFnSUNBZ0lDQWdJQ0FnSUNjOEwyUnBkajRuSUN0Y2JpQWdJQ0FnSUNBZ0lDQWdJQ2M4WkdsMklHTnNZWE56UFZ3aVpHbGhiRzluTFdadmIzUmxjbHdpUGljZ0sxeHVJQ0FnSUNBZ0lDQWdJQ0FnSnp3dlpHbDJQaWNnSzF4dUlDQWdJQ0FnSUNBZ0lDYzhMMlJwZGo0bklDdGNiaUFnSUNBZ0lDQWdKend2WkdsMlBpY2dLMXh1SUNBZ0lDQWdKend2WkdsMlBpZGNibHh1SUNBZ0lDQWdhV1lnS0hSb2FYTXVaSGx1WVcxcFkwVnNaVzFsYm5RcElIdGNiaUFnSUNBZ0lDQWdkR2hwY3k1aWRXbHNaQ2dwWEc0Z0lDQWdJQ0I5WEc0Z0lDQWdmVnh1WEc0Z0lDQWdZblZwYkdRb0tTQjdYRzRnSUNBZ0lDQmpiMjV6ZENCaWRXbHNaR1Z5SUQwZ1pHOWpkVzFsYm5RdVkzSmxZWFJsUld4bGJXVnVkQ2duWkdsMkp5bGNibHh1SUNBZ0lDQWdZblZwYkdSbGNpNXBibTVsY2toVVRVd2dQU0IwYUdsekxuUmxiWEJzWVhSbFhHNWNiaUFnSUNBZ0lIUm9hWE11YjNCMGFXOXVjeTVsYkdWdFpXNTBJRDBnWW5WcGJHUmxjaTVtYVhKemRFTm9hV3hrWEc1Y2JpQWdJQ0FnSUM4dklIUnBkR3hsWEc0Z0lDQWdJQ0JwWmlBb2RHaHBjeTV2Y0hScGIyNXpMblJwZEd4bElDRTlQU0J1ZFd4c0tTQjdYRzRnSUNBZ0lDQWdJSFJvYVhNdWIzQjBhVzl1Y3k1bGJHVnRaVzUwTG5GMVpYSjVVMlZzWldOMGIzSW9KeTVrYVdGc2IyY3RkR2wwYkdVbktTNXBibTVsY2toVVRVd2dQU0IwYUdsekxtOXdkR2x2Ym5NdWRHbDBiR1ZjYmlBZ0lDQWdJSDFjYmx4dUlDQWdJQ0FnTHk4Z2JXVnpjMkZuWlZ4dUlDQWdJQ0FnYVdZZ0tIUm9hWE11YjNCMGFXOXVjeTV0WlhOellXZGxJQ0U5UFNCdWRXeHNLU0I3WEc0Z0lDQWdJQ0FnSUhSb2FYTXViM0IwYVc5dWN5NWxiR1Z0Wlc1MExuRjFaWEo1VTJWc1pXTjBiM0lvSnk1a2FXRnNiMmN0WW05a2VTY3BMbVpwY25OMFEyaHBiR1F1YVc1dVpYSklWRTFNSUQwZ2RHaHBjeTV2Y0hScGIyNXpMbTFsYzNOaFoyVmNiaUFnSUNBZ0lIMGdaV3h6WlNCN1hHNGdJQ0FnSUNBZ0lDOHZJSEpsYlc5MlpTQndZWEpoWjNKaGNHZ2dibTlrWlZ4dUlDQWdJQ0FnSUNCMGFHbHpMbkpsYlc5MlpWUmxlSFJDYjJSNUtDbGNiaUFnSUNBZ0lIMWNibHh1SUNBZ0lDQWdMeThnWW5WMGRHOXVjMXh1SUNBZ0lDQWdhV1lnS0hSb2FYTXViM0IwYVc5dWN5NWlkWFIwYjI1eklDRTlQU0J1ZFd4c0lDWW1JRUZ5Y21GNUxtbHpRWEp5WVhrb2RHaHBjeTV2Y0hScGIyNXpMbUoxZEhSdmJuTXBLU0I3WEc0Z0lDQWdJQ0FnSUdsbUlDaDBhR2x6TG05d2RHbHZibk11WW5WMGRHOXVjeTVzWlc1bmRHZ2dQaUF3S1NCN1hHNGdJQ0FnSUNBZ0lDQWdkR2hwY3k1dmNIUnBiMjV6TG1KMWRIUnZibk11Wm05eVJXRmphQ2dvWW5WMGRHOXVLU0E5UGlCN1hHNGdJQ0FnSUNBZ0lDQWdJQ0IwYUdsekxtOXdkR2x2Ym5NdVpXeGxiV1Z1ZEM1eGRXVnllVk5sYkdWamRHOXlLQ2N1WkdsaGJHOW5MV1p2YjNSbGNpY3BMbUZ3Y0dWdVpFTm9hV3hrS0hSb2FYTXVZblZwYkdSQ2RYUjBiMjRvWW5WMGRHOXVLU2xjYmlBZ0lDQWdJQ0FnSUNCOUtWeHVJQ0FnSUNBZ0lDQjlJR1ZzYzJVZ2UxeHVJQ0FnSUNBZ0lDQWdJSFJvYVhNdWNtVnRiM1psUm05dmRHVnlLQ2xjYmlBZ0lDQWdJQ0FnZlZ4dUlDQWdJQ0FnZlNCbGJITmxJSHRjYmlBZ0lDQWdJQ0FnZEdocGN5NXlaVzF2ZG1WR2IyOTBaWElvS1Z4dUlDQWdJQ0FnZlZ4dVhHNGdJQ0FnSUNCa2IyTjFiV1Z1ZEM1aWIyUjVMbUZ3Y0dWdVpFTm9hV3hrS0hSb2FYTXViM0IwYVc5dWN5NWxiR1Z0Wlc1MEtWeHVYRzRnSUNBZ0lDQjBhR2x6TG5ObGRFRjBkSEpwWW5WMFpYTW9LVnh1SUNBZ0lIMWNibHh1SUNBZ0lHSjFhV3hrUW5WMGRHOXVLR0oxZEhSdmJrbHVabThnUFNCN2ZTa2dlMXh1SUNBZ0lDQWdZMjl1YzNRZ1luVjBkRzl1SUQwZ1pHOWpkVzFsYm5RdVkzSmxZWFJsUld4bGJXVnVkQ2duWW5WMGRHOXVKeWxjYmlBZ0lDQWdJR0oxZEhSdmJpNXpaWFJCZEhSeWFXSjFkR1VvSjNSNWNHVW5MQ0FuWW5WMGRHOXVKeWxjYmlBZ0lDQWdJR0oxZEhSdmJpNXpaWFJCZEhSeWFXSjFkR1VvSjJOc1lYTnpKeXdnWW5WMGRHOXVTVzVtYnk1amJHRnpjeUI4ZkNBblluUnVKeWxjYmlBZ0lDQWdJR0oxZEhSdmJpNXBibTVsY2toVVRVd2dQU0JpZFhSMGIyNUpibVp2TG5SbGVIUmNibHh1SUNBZ0lDQWdhV1lnS0dKMWRIUnZia2x1Wm04dVpHbHpiV2x6Y3lrZ2UxeHVJQ0FnSUNBZ0lDQmlkWFIwYjI0dWMyVjBRWFIwY21saWRYUmxLQ2RrWVhSaExXUnBjMjFwYzNNbkxDQk9RVTFGS1Z4dUlDQWdJQ0FnZlZ4dVhHNGdJQ0FnSUNCeVpYUjFjbTRnWW5WMGRHOXVYRzRnSUNBZ2ZWeHVYRzRnSUNBZ1luVnBiR1JDWVdOclpISnZjQ2dwSUh0Y2JpQWdJQ0FnSUdOdmJuTjBJR0poWTJ0a2NtOXdJRDBnWkc5amRXMWxiblF1WTNKbFlYUmxSV3hsYldWdWRDZ25aR2wySnlsY2JpQWdJQ0FnSUdKaFkydGtjbTl3TG5ObGRFRjBkSEpwWW5WMFpTZ25aR0YwWVMxcFpDY3NJSFJvYVhNdWFXUXBYRzRnSUNBZ0lDQmlZV05yWkhKdmNDNWpiR0Z6YzB4cGMzUXVZV1JrS0VKQlEwdEVVazlRWDFORlRFVkRWRTlTS1Z4dVhHNGdJQ0FnSUNCa2IyTjFiV1Z1ZEM1aWIyUjVMbUZ3Y0dWdVpFTm9hV3hrS0dKaFkydGtjbTl3S1Z4dUlDQWdJSDFjYmx4dUlDQWdJR2RsZEVKaFkydGtjbTl3S0NrZ2UxeHVJQ0FnSUNBZ2NtVjBkWEp1SUdSdlkzVnRaVzUwTG5GMVpYSjVVMlZzWldOMGIzSW9ZQzRrZTBKQlEwdEVVazlRWDFORlRFVkRWRTlTZlZ0a1lYUmhMV2xrUFZ3aUpIdDBhR2x6TG1sa2ZWd2lYV0FwWEc0Z0lDQWdmVnh1WEc0Z0lDQWdjbVZ0YjNabFZHVjRkRUp2Wkhrb0tTQjdYRzRnSUNBZ0lDQjBhR2x6TG05d2RHbHZibk11Wld4bGJXVnVkQzV4ZFdWeWVWTmxiR1ZqZEc5eUtDY3VaR2xoYkc5bkxXSnZaSGtuS1M1eVpXMXZkbVZEYUdsc1pDaDBhR2x6TG05d2RHbHZibk11Wld4bGJXVnVkQzV4ZFdWeWVWTmxiR1ZqZEc5eUtDY3VaR2xoYkc5bkxXSnZaSGtuS1M1bWFYSnpkRU5vYVd4a0tTQWdJQ0FnSUZ4dUlDQWdJSDFjYmx4dUlDQWdJSEpsYlc5MlpVWnZiM1JsY2lncElIdGNiaUFnSUNBZ0lHTnZibk4wSUdadmIzUmxjaUE5SUhSb2FYTXViM0IwYVc5dWN5NWxiR1Z0Wlc1MExuRjFaWEo1VTJWc1pXTjBiM0lvSnk1a2FXRnNiMmN0Wm05dmRHVnlKeWtnSUNBZ0lDQmNiaUFnSUNBZ0lIUm9hWE11YjNCMGFXOXVjeTVsYkdWdFpXNTBMbkYxWlhKNVUyVnNaV04wYjNJb0p5NWthV0ZzYjJjdFkyOXVkR1Z1ZENjcExuSmxiVzkyWlVOb2FXeGtLR1p2YjNSbGNpbGNiaUFnSUNCOVhHNWNiaUFnSUNCalpXNTBaWElvS1NCN1hHNGdJQ0FnSUNCamIyNXpkQ0JqYjIxd2RYUmxaRk4wZVd4bElEMGdkMmx1Wkc5M0xtZGxkRU52YlhCMWRHVmtVM1I1YkdVb2RHaHBjeTV2Y0hScGIyNXpMbVZzWlcxbGJuUXBYRzRnSUNBZ0lDQmpiMjV6ZENCb1pXbG5hSFFnUFNCamIyMXdkWFJsWkZOMGVXeGxMbWhsYVdkb2RDNXpiR2xqWlNnd0xDQmpiMjF3ZFhSbFpGTjBlV3hsTG1obGFXZG9kQzVzWlc1bmRHZ2dMU0F5S1Z4dVhHNGdJQ0FnSUNCamIyNXpkQ0IwYjNBZ1BTQW9kMmx1Wkc5M0xtbHVibVZ5U0dWcFoyaDBJQzhnTWlrZ0xTQW9hR1ZwWjJoMElDOGdNaWxjYmlBZ0lDQWdJSFJvYVhNdWIzQjBhVzl1Y3k1bGJHVnRaVzUwTG5OMGVXeGxMblJ2Y0NBOUlHQWtlM1J2Y0gxd2VHQmNiaUFnSUNCOVhHNWNiaUFnSUNCemFHOTNLQ2tnZTF4dUlDQWdJQ0FnYVdZZ0tIUm9hWE11YjNCMGFXOXVjeTVsYkdWdFpXNTBJRDA5UFNCdWRXeHNLU0I3WEc0Z0lDQWdJQ0FnSUM4dklHSjFhV3hrSUdGdVpDQnBibk5sY25RZ1lTQnVaWGNnUkU5TklHVnNaVzFsYm5SY2JpQWdJQ0FnSUNBZ2RHaHBjeTVpZFdsc1pDZ3BYRzRnSUNBZ0lDQjlYRzVjYmlBZ0lDQWdJR2xtSUNoMGFHbHpMbTl3ZEdsdmJuTXVaV3hsYldWdWRDNWpiR0Z6YzB4cGMzUXVZMjl1ZEdGcGJuTW9KM05vYjNjbktTa2dlMXh1SUNBZ0lDQWdJQ0J5WlhSMWNtNGdabUZzYzJWY2JpQWdJQ0FnSUgxY2JseHVJQ0FnSUNBZ0x5OGdZV1JrSUdFZ2RHbHRaVzkxZENCemJ5QjBhR0YwSUhSb1pTQkRVMU1nWVc1cGJXRjBhVzl1SUhkdmNtdHpYRzRnSUNBZ0lDQnpaWFJVYVcxbGIzVjBLQ2dwSUQwK0lIdGNiaUFnSUNBZ0lDQWdkR2hwY3k1MGNtbG5aMlZ5UlhabGJuUW9SWFpsYm5RdVUwaFBWeWxjYmlBZ0lDQWdJQ0FnZEdocGN5NWlkV2xzWkVKaFkydGtjbTl3S0NsY2JseHVJQ0FnSUNBZ0lDQmpiMjV6ZENCdmJsTm9iM2R1SUQwZ0tDa2dQVDRnZTF4dUlDQWdJQ0FnSUNBZ0lIUm9hWE11ZEhKcFoyZGxja1YyWlc1MEtFVjJaVzUwTGxOSVQxZE9LVnh1SUNBZ0lDQWdJQ0FnSUhSb2FYTXViM0IwYVc5dWN5NWxiR1Z0Wlc1MExuSmxiVzkyWlVWMlpXNTBUR2x6ZEdWdVpYSW9SWFpsYm5RdVZGSkJUbE5KVkVsUFRsOUZUa1FzSUc5dVUyaHZkMjRwWEc1Y2JpQWdJQ0FnSUNBZ0lDQXZMeUJoZEhSaFkyZ2daWFpsYm5SY2JpQWdJQ0FnSUNBZ0lDQjBhR2x6TG1GMGRHRmphRVYyWlc1MGN5Z3BYRzRnSUNBZ0lDQWdJSDFjYmx4dUlDQWdJQ0FnSUNCMGFHbHpMbTl3ZEdsdmJuTXVaV3hsYldWdWRDNWhaR1JGZG1WdWRFeHBjM1JsYm1WeUtFVjJaVzUwTGxSU1FVNVRTVlJKVDA1ZlJVNUVMQ0J2YmxOb2IzZHVLVnh1WEc0Z0lDQWdJQ0FnSUhSb2FYTXViM0IwYVc5dWN5NWxiR1Z0Wlc1MExtTnNZWE56VEdsemRDNWhaR1FvSjNOb2IzY25LVnh1WEc0Z0lDQWdJQ0FnSUhSb2FYTXVZMlZ1ZEdWeUtDbGNiaUFnSUNBZ0lIMHNJREV3S1Z4dVhHNGdJQ0FnSUNCeVpYUjFjbTRnZEhKMVpWeHVJQ0FnSUgxY2JseHVJQ0FnSUc5dVJXeGxiV1Z1ZEVWMlpXNTBLR1YyWlc1MEtTQjdYRzRnSUNBZ0lDQnBaaUFvWlhabGJuUXVkSGx3WlNBOVBUMGdKMnRsZVhWd0p5QW1KaUJsZG1WdWRDNXJaWGxEYjJSbElDRTlQU0F5TnlBbUppQmxkbVZ1ZEM1clpYbERiMlJsSUNFOVBTQXhNeWtnZTF4dUlDQWdJQ0FnSUNCeVpYUjFjbTVjYmlBZ0lDQWdJSDFjYmx4dUlDQWdJQ0FnTHk4Z2FHbGtaU0IwYUdVZ1pHbGhiRzluWEc0Z0lDQWdJQ0IwYUdsekxtaHBaR1VvS1Z4dUlDQWdJSDFjYmx4dUlDQWdJR2hwWkdVb0tTQjdYRzRnSUNBZ0lDQnBaaUFvSVhSb2FYTXViM0IwYVc5dWN5NWxiR1Z0Wlc1MExtTnNZWE56VEdsemRDNWpiMjUwWVdsdWN5Z25jMmh2ZHljcEtTQjdYRzRnSUNBZ0lDQWdJSEpsZEhWeWJpQm1ZV3h6WlZ4dUlDQWdJQ0FnZlZ4dVhHNGdJQ0FnSUNCMGFHbHpMblJ5YVdkblpYSkZkbVZ1ZENoRmRtVnVkQzVJU1VSRktWeHVYRzRnSUNBZ0lDQjBhR2x6TG1SbGRHRmphRVYyWlc1MGN5Z3BYRzVjYmlBZ0lDQWdJSFJvYVhNdWIzQjBhVzl1Y3k1bGJHVnRaVzUwTG1Oc1lYTnpUR2x6ZEM1aFpHUW9KMmhwWkdVbktWeHVJQ0FnSUNBZ2RHaHBjeTV2Y0hScGIyNXpMbVZzWlcxbGJuUXVZMnhoYzNOTWFYTjBMbkpsYlc5MlpTZ25jMmh2ZHljcFhHNWNiaUFnSUNBZ0lHTnZibk4wSUdKaFkydGtjbTl3SUQwZ2RHaHBjeTVuWlhSQ1lXTnJaSEp2Y0NncFhHNWNiaUFnSUNBZ0lHTnZibk4wSUc5dVNHbGtaR1Z1SUQwZ0tDa2dQVDRnZTF4dUlDQWdJQ0FnSUNCa2IyTjFiV1Z1ZEM1aWIyUjVMbkpsYlc5MlpVTm9hV3hrS0dKaFkydGtjbTl3S1Z4dVhHNGdJQ0FnSUNBZ0lIUm9hWE11YjNCMGFXOXVjeTVsYkdWdFpXNTBMbU5zWVhOelRHbHpkQzV5WlcxdmRtVW9KMmhwWkdVbktWeHVYRzRnSUNBZ0lDQWdJSFJvYVhNdWRISnBaMmRsY2tWMlpXNTBLRVYyWlc1MExraEpSRVJGVGlsY2JseHVJQ0FnSUNBZ0lDQmlZV05yWkhKdmNDNXlaVzF2ZG1WRmRtVnVkRXhwYzNSbGJtVnlLRVYyWlc1MExsUlNRVTVUU1ZSSlQwNWZSVTVFTENCdmJraHBaR1JsYmlsY2JseHVJQ0FnSUNBZ0lDQXZMeUJ5WlcxdmRtVWdaMlZ1WlhKaGRHVmtJR1JwWVd4dlozTWdabkp2YlNCMGFHVWdSRTlOWEc0Z0lDQWdJQ0FnSUdsbUlDaDBhR2x6TG1SNWJtRnRhV05GYkdWdFpXNTBLU0I3WEc0Z0lDQWdJQ0FnSUNBZ1pHOWpkVzFsYm5RdVltOWtlUzV5WlcxdmRtVkRhR2xzWkNoMGFHbHpMbTl3ZEdsdmJuTXVaV3hsYldWdWRDbGNiaUFnSUNBZ0lDQWdJQ0IwYUdsekxtOXdkR2x2Ym5NdVpXeGxiV1Z1ZENBOUlHNTFiR3hjYmlBZ0lDQWdJQ0FnZlZ4dUlDQWdJQ0FnZlZ4dVhHNGdJQ0FnSUNCaVlXTnJaSEp2Y0M1aFpHUkZkbVZ1ZEV4cGMzUmxibVZ5S0VWMlpXNTBMbFJTUVU1VFNWUkpUMDVmUlU1RUxDQnZia2hwWkdSbGJpbGNiaUFnSUNBZ0lHSmhZMnRrY205d0xtTnNZWE56VEdsemRDNWhaR1FvSjJaaFpHVnZkWFFuS1Z4dVhHNGdJQ0FnSUNCeVpYUjFjbTRnZEhKMVpWeHVJQ0FnSUgxY2JseHVJQ0FnSUdGMGRHRmphRVYyWlc1MGN5Z3BJSHRjYmlBZ0lDQWdJR052Ym5OMElHUnBjMjFwYzNOQ2RYUjBiMjV6SUQwZ2RHaHBjeTV2Y0hScGIyNXpMbVZzWlcxbGJuUXVjWFZsY25sVFpXeGxZM1J2Y2tGc2JDZ25XMlJoZEdFdFpHbHpiV2x6YzEwbktWeHVJQ0FnSUNBZ2FXWWdLR1JwYzIxcGMzTkNkWFIwYjI1ektTQjdYRzRnSUNBZ0lDQWdJRUZ5Y21GNUxtWnliMjBvWkdsemJXbHpjMEoxZEhSdmJuTXBMbVp2Y2tWaFkyZ29ZblYwZEc5dUlEMCtJSFJvYVhNdWNtVm5hWE4wWlhKRmJHVnRaVzUwS0hzZ2RHRnlaMlYwT2lCaWRYUjBiMjRzSUdWMlpXNTBPaUFuWTJ4cFkyc25JSDBwS1Z4dUlDQWdJQ0FnZlZ4dVhHNGdJQ0FnSUNBdkx5QmhaR1FnWlhabGJuUnpJR2xtSUhSb1pTQmthV0ZzYjJjZ2FYTWdZMkZ1WTJWc1lXSnNaVnh1SUNBZ0lDQWdMeThnZDJocFkyZ2diV1ZoYm5NZ2RHaGxJSFZ6WlhJZ1kyRnVJR2hwWkdVZ2RHaGxJR1JwWVd4dloxeHVJQ0FnSUNBZ0x5OGdZbmtnY0hKbGMzTnBibWNnZEdobElFVlRReUJyWlhrZ2IzSWdZMnhwWTJzZ2IzVjBjMmxrWlNCMGFHVWdZbUZqYTJSeWIzQmNiaUFnSUNBZ0lHbG1JQ2gwYUdsekxtOXdkR2x2Ym5NdVkyRnVZMlZzWVdKc1pTa2dlMXh1SUNBZ0lDQWdJQ0JqYjI1emRDQmlZV05yWkhKdmNDQTlJSFJvYVhNdVoyVjBRbUZqYTJSeWIzQW9LVnh1SUNBZ0lDQWdJQ0IwYUdsekxuSmxaMmx6ZEdWeVJXeGxiV1Z1ZENoN0lIUmhjbWRsZERvZ1ltRmphMlJ5YjNBc0lHVjJaVzUwT2lCRmRtVnVkQzVUVkVGU1ZDQjlLVnh1SUNBZ0lDQWdJQ0IwYUdsekxuSmxaMmx6ZEdWeVJXeGxiV1Z1ZENoN0lIUmhjbWRsZERvZ1pHOWpkVzFsYm5Rc0lHVjJaVzUwT2lBbmEyVjVkWEFuSUgwcFhHNGdJQ0FnSUNCOVhHNGdJQ0FnZlZ4dVhHNGdJQ0FnWkdWMFlXTm9SWFpsYm5SektDa2dlMXh1SUNBZ0lDQWdZMjl1YzNRZ1pHbHpiV2x6YzBKMWRIUnZibk1nUFNCMGFHbHpMbTl3ZEdsdmJuTXVaV3hsYldWdWRDNXhkV1Z5ZVZObGJHVmpkRzl5UVd4c0tDZGJaR0YwWVMxa2FYTnRhWE56WFNjcFhHNGdJQ0FnSUNCcFppQW9aR2x6YldsemMwSjFkSFJ2Ym5NcElIdGNiaUFnSUNBZ0lDQWdRWEp5WVhrdVpuSnZiU2hrYVhOdGFYTnpRblYwZEc5dWN5a3VabTl5UldGamFDaGlkWFIwYjI0Z1BUNGdkR2hwY3k1MWJuSmxaMmx6ZEdWeVJXeGxiV1Z1ZENoN0lIUmhjbWRsZERvZ1luVjBkRzl1TENCbGRtVnVkRG9nSjJOc2FXTnJKeUI5S1NsY2JpQWdJQ0FnSUgxY2JseHVJQ0FnSUNBZ2FXWWdLSFJvYVhNdWIzQjBhVzl1Y3k1allXNWpaV3hoWW14bEtTQjdYRzRnSUNBZ0lDQWdJR052Ym5OMElHSmhZMnRrY205d0lEMGdkR2hwY3k1blpYUkNZV05yWkhKdmNDZ3BYRzRnSUNBZ0lDQWdJSFJvYVhNdWRXNXlaV2RwYzNSbGNrVnNaVzFsYm5Rb2V5QjBZWEpuWlhRNklHSmhZMnRrY205d0xDQmxkbVZ1ZERvZ1JYWmxiblF1VTFSQlVsUWdmU2xjYmlBZ0lDQWdJQ0FnZEdocGN5NTFibkpsWjJsemRHVnlSV3hsYldWdWRDaDdJSFJoY21kbGREb2daRzlqZFcxbGJuUXNJR1YyWlc1ME9pQW5hMlY1ZFhBbklIMHBYRzRnSUNBZ0lDQjlYRzRnSUNBZ2ZWeHVYRzRnSUNBZ2MzUmhkR2xqSUdsa1pXNTBhV1pwWlhJb0tTQjdYRzRnSUNBZ0lDQnlaWFIxY200Z1RrRk5SVnh1SUNBZ0lIMWNibHh1SUNBZ0lITjBZWFJwWXlCZlJFOU5TVzUwWlhKbVlXTmxLRzl3ZEdsdmJuTXBJSHRjYmlBZ0lDQWdJSEpsZEhWeWJpQnpkWEJsY2k1ZlJFOU5TVzUwWlhKbVlXTmxLRVJwWVd4dlp5d2diM0IwYVc5dWN5bGNiaUFnSUNCOVhHNGdJSDFjYmx4dUlDQXZLaXBjYmlBZ0lDb2dMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRYRzRnSUNBcUlFUlBUU0JCY0drZ2FXMXdiR1Z0Wlc1MFlYUnBiMjVjYmlBZ0lDb2dMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRYRzRnSUNBcUwxeHVJQ0JqYjI1emRDQmpiMjF3YjI1bGJuUnpJRDBnVzExY2JseHVJQ0JqYjI1emRDQmthV0ZzYjJkeklEMGdaRzlqZFcxbGJuUXVjWFZsY25sVFpXeGxZM1J2Y2tGc2JDaGdMaVI3VGtGTlJYMWdLVnh1SUNCcFppQW9aR2xoYkc5bmN5a2dlMXh1SUNBZ0lFRnljbUY1TG1aeWIyMG9aR2xoYkc5bmN5a3VabTl5UldGamFDZ29aV3hsYldWdWRDa2dQVDRnZTF4dUlDQWdJQ0FnWTI5dWMzUWdZMjl1Wm1sbklEMGdaMlYwUVhSMGNtbGlkWFJsYzBOdmJtWnBaeWhsYkdWdFpXNTBMQ0JFUlVaQlZVeFVYMUJTVDFCRlVsUkpSVk1zSUVSQlZFRmZRVlJVVWxOZlVGSlBVRVZTVkVsRlV5bGNiaUFnSUNBZ0lHTnZibVpwWnk1bGJHVnRaVzUwSUQwZ1pXeGxiV1Z1ZEZ4dVhHNGdJQ0FnSUNCamIyMXdiMjVsYm5SekxuQjFjMmdvZXlCbGJHVnRaVzUwTENCa2FXRnNiMmM2SUc1bGR5QkVhV0ZzYjJjb1kyOXVabWxuS1NCOUtWeHVJQ0FnSUgwcFhHNGdJSDFjYmx4dUlDQmtiMk4xYldWdWRDNWhaR1JGZG1WdWRFeHBjM1JsYm1WeUtDZGpiR2xqYXljc0lDaGxkbVZ1ZENrZ1BUNGdlMXh1SUNBZ0lHTnZibk4wSUdSaGRHRlViMmRuYkdWQmRIUnlJRDBnWlhabGJuUXVkR0Z5WjJWMExtZGxkRUYwZEhKcFluVjBaU2duWkdGMFlTMTBiMmRuYkdVbktWeHVJQ0FnSUdsbUlDaGtZWFJoVkc5bloyeGxRWFIwY2lBbUppQmtZWFJoVkc5bloyeGxRWFIwY2lBOVBUMGdUa0ZOUlNrZ2UxeHVJQ0FnSUNBZ1kyOXVjM1FnYVdRZ1BTQmxkbVZ1ZEM1MFlYSm5aWFF1WjJWMFFYUjBjbWxpZFhSbEtDZGtZWFJoTFhSaGNtZGxkQ2NwWEc0Z0lDQWdJQ0JqYjI1emRDQmxiR1Z0Wlc1MElEMGdaRzlqZFcxbGJuUXVjWFZsY25sVFpXeGxZM1J2Y2locFpDbGNibHh1SUNBZ0lDQWdZMjl1YzNRZ1kyOXRjRzl1Wlc1MElEMGdZMjl0Y0c5dVpXNTBjeTVtYVc1a0tHTWdQVDRnWXk1bGJHVnRaVzUwSUQwOVBTQmxiR1Z0Wlc1MEtWeHVYRzRnSUNBZ0lDQnBaaUFvSVdOdmJYQnZibVZ1ZENrZ2UxeHVJQ0FnSUNBZ0lDQnlaWFIxY201Y2JpQWdJQ0FnSUgxY2JseHVJQ0FnSUNBZ0x5OGdjbVZ0YjNabElIUm9aU0JtYjJOMWN5QnpkR0YwWlNCdlppQjBhR1VnZEhKcFoyZGxjbHh1SUNBZ0lDQWdaWFpsYm5RdWRHRnlaMlYwTG1Kc2RYSW9LVnh1WEc0Z0lDQWdJQ0JqYjIxd2IyNWxiblF1WkdsaGJHOW5Mbk5vYjNjb0tWeHVJQ0FnSUgxY2JpQWdmU2xjYmx4dUlDQnlaWFIxY200Z1JHbGhiRzluWEc1OUtTZ3BYRzVjYm1WNGNHOXlkQ0JrWldaaGRXeDBJRVJwWVd4dloxeHVJaXdpTHlvcVhHNGdLaUF0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFZ4dUlDb2dUR2xqWlc1elpXUWdkVzVrWlhJZ1RVbFVJQ2hvZEhSd2N6b3ZMMmRwZEdoMVlpNWpiMjB2Y1hWaGNtc3RaR1YyTDFCb2IyNXZiaTFHY21GdFpYZHZjbXN2WW14dllpOXRZWE4wWlhJdlRFbERSVTVUUlNsY2JpQXFJQzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0WEc0Z0tpOWNibWx0Y0c5eWRDQkVhV0ZzYjJjZ1puSnZiU0FuTGk5cGJtUmxlQ2RjYm1sdGNHOXlkQ0JUY0dsdWJtVnlJR1p5YjIwZ0p5NHVMMnh2WVdSbGNpOXBibVJsZUNkY2JtbHRjRzl5ZENCN0lHZGxkRUYwZEhKcFluVjBaWE5EYjI1bWFXY2dmU0JtY205dElDY3VMaTlqYjIxd2IyNWxiblJOWVc1aFoyVnlKMXh1WEc1amIyNXpkQ0JNYjJGa1pYSWdQU0FvS0NrZ1BUNGdlMXh1WEc0Z0lDOHFLbHh1SUNBZ0tpQXRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMWNiaUFnSUNvZ1EyOXVjM1JoYm5SelhHNGdJQ0FxSUMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFZ4dUlDQWdLaTljYmx4dUlDQmpiMjV6ZENCT1FVMUZJRDBnSjJ4dllXUmxjaWRjYmlBZ1kyOXVjM1FnUkVWR1FWVk1WRjlRVWs5UVJWSlVTVVZUSUQwZ2UxeHVJQ0FnSUdWc1pXMWxiblE2SUc1MWJHd3NYRzRnSUNBZ2RHbDBiR1U2SUc1MWJHd3NYRzRnSUNBZ2JXVnpjMkZuWlRvZ2JuVnNiQ3hjYmlBZ0lDQmpZVzVqWld4aFlteGxPaUIwY25WbExGeHVJQ0FnSUhSNWNHVTZJRTVCVFVVc1hHNGdJQ0FnWW5WMGRHOXVjem9nVzF4dUlDQWdJQ0FnZTF4dUlDQWdJQ0FnSUNCMFpYaDBPaUFuUTJGdVkyVnNKeXhjYmlBZ0lDQWdJQ0FnWkdsemJXbHpjem9nZEhKMVpTeGNiaUFnSUNBZ0lDQWdZMnhoYzNNNklDZGlkRzRnWW5SdUxYQnlhVzFoY25rbkxGeHVJQ0FnSUNBZ2ZTeGNiaUFnSUNCZExGeHVJQ0I5WEc0Z0lHTnZibk4wSUVSQlZFRmZRVlJVVWxOZlVGSlBVRVZTVkVsRlV5QTlJRnRjYmlBZ0lDQW5ZMkZ1WTJWc1lXSnNaU2NzWEc0Z0lGMWNibHh1SUNBdktpcGNiaUFnSUNvZ0xTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdFhHNGdJQ0FxSUVOc1lYTnpJRVJsWm1sdWFYUnBiMjVjYmlBZ0lDb2dMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRYRzRnSUNBcUwxeHVYRzRnSUdOc1lYTnpJRXh2WVdSbGNpQmxlSFJsYm1SeklFUnBZV3h2WnlCN1hHNWNiaUFnSUNCamIyNXpkSEoxWTNSdmNpaHZjSFJwYjI1eklEMGdlMzBwSUh0Y2JpQWdJQ0FnSUdOdmJuTjBJSFJsYlhCc1lYUmxJRDBnSnljZ0sxeHVJQ0FnSUNBZ0p6eGthWFlnWTJ4aGMzTTlYQ0prYVdGc2IyZGNJaUIwWVdKcGJtUmxlRDFjSWkweFhDSWdjbTlzWlQxY0ltUnBZV3h2WjF3aVBpY2dLMXh1SUNBZ0lDQWdJQ0FuUEdScGRpQmpiR0Z6Y3oxY0ltUnBZV3h2WnkxcGJtNWxjbHdpSUhKdmJHVTlYQ0prYjJOMWJXVnVkRndpUGljZ0sxeHVJQ0FnSUNBZ0lDQWdJQ2M4WkdsMklHTnNZWE56UFZ3aVpHbGhiRzluTFdOdmJuUmxiblJjSWo0bklDdGNiaUFnSUNBZ0lDQWdJQ0FnSUNjOFpHbDJJR05zWVhOelBWd2laR2xoYkc5bkxXaGxZV1JsY2x3aVBpY2dLMXh1SUNBZ0lDQWdJQ0FnSUNBZ0lDQW5QR2cxSUdOc1lYTnpQVndpWkdsaGJHOW5MWFJwZEd4bFhDSStQQzlvTlQ0bklDdGNiaUFnSUNBZ0lDQWdJQ0FnSUNjOEwyUnBkajRuSUN0Y2JpQWdJQ0FnSUNBZ0lDQWdJQ2M4WkdsMklHTnNZWE56UFZ3aVpHbGhiRzluTFdKdlpIbGNJajRuSUN0Y2JpQWdJQ0FnSUNBZ0lDQWdJQ0FnSnp4d1Bqd3ZjRDRuSUN0Y2JpQWdJQ0FnSUNBZ0lDQWdJQ0FnSnp4a2FYWWdZMnhoYzNNOVhDSnRlQzFoZFhSdklIUmxlSFF0WTJWdWRHVnlYQ0krSnlBclhHNGdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0p6eGthWFlnWTJ4aGMzTTlYQ0pzYjJGa1pYSWdiWGd0WVhWMGJ5QmtMV0pzYjJOclhDSStKeUFyWEc0Z0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBblBHUnBkaUJqYkdGemN6MWNJbXh2WVdSbGNpMXpjR2x1Ym1WeVhDSStQQzlrYVhZK0p5QXJYRzRnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdKend2WkdsMlBpY2dLMXh1SUNBZ0lDQWdJQ0FnSUNBZ0lDQW5QQzlrYVhZK0p5QXJYRzRnSUNBZ0lDQWdJQ0FnSUNBblBDOWthWFkrSnlBclhHNGdJQ0FnSUNBZ0lDQWdJQ0FuUEdScGRpQmpiR0Z6Y3oxY0ltUnBZV3h2WnkxbWIyOTBaWEpjSWo0bklDdGNiaUFnSUNBZ0lDQWdJQ0FnSUNjOEwyUnBkajRuSUN0Y2JpQWdJQ0FnSUNBZ0lDQW5QQzlrYVhZK0p5QXJYRzRnSUNBZ0lDQWdJQ2M4TDJScGRqNG5JQ3RjYmlBZ0lDQWdJQ2M4TDJScGRqNG5YRzVjYmlBZ0lDQWdJR2xtSUNnaFFYSnlZWGt1YVhOQmNuSmhlU2h2Y0hScGIyNXpMbUoxZEhSdmJuTXBLU0I3WEc0Z0lDQWdJQ0FnSUc5d2RHbHZibk11WW5WMGRHOXVjeUE5SUc5d2RHbHZibk11WTJGdVkyVnNZV0pzWlNBL0lFUkZSa0ZWVEZSZlVGSlBVRVZTVkVsRlV5NWlkWFIwYjI1eklEb2dXMTFjYmlBZ0lDQWdJSDFjYmx4dUlDQWdJQ0FnYzNWd1pYSW9iM0IwYVc5dWN5d2dkR1Z0Y0d4aGRHVXBYRzVjYmlBZ0lDQWdJSFJvYVhNdWMzQnBibTVsY2lBOUlHNTFiR3hjYmlBZ0lDQjlYRzVjYmlBZ0lDQnphRzkzS0NrZ2UxeHVJQ0FnSUNBZ2MzVndaWEl1YzJodmR5Z3BYRzVjYmlBZ0lDQWdJSFJvYVhNdWMzQnBibTVsY2lBOUlHNWxkeUJUY0dsdWJtVnlLSHRsYkdWdFpXNTBPaUIwYUdsekxtZGxkRVZzWlcxbGJuUW9LUzV4ZFdWeWVWTmxiR1ZqZEc5eUtDY3ViRzloWkdWeUp5bDlLVnh1SUNBZ0lDQWdkR2hwY3k1emNHbHVibVZ5TG1GdWFXMWhkR1VvZEhKMVpTbGNiaUFnSUNCOVhHNWNiaUFnSUNCb2FXUmxLQ2tnZTF4dUlDQWdJQ0FnYzNWd1pYSXVhR2xrWlNncFhHNWNiaUFnSUNBZ0lIUm9hWE11YzNCcGJtNWxjaTVoYm1sdFlYUmxLR1poYkhObEtWeHVJQ0FnSUNBZ2RHaHBjeTV6Y0dsdWJtVnlJRDBnYm5Wc2JGeHVJQ0FnSUgxY2JseHVJQ0FnSUhOMFlYUnBZeUJwWkdWdWRHbG1hV1Z5S0NrZ2UxeHVJQ0FnSUNBZ2NtVjBkWEp1SUU1QlRVVmNiaUFnSUNCOVhHNWNiaUFnSUNCemRHRjBhV01nWDBSUFRVbHVkR1Z5Wm1GalpTaHZjSFJwYjI1ektTQjdYRzRnSUNBZ0lDQnlaWFIxY200Z2JtVjNJRXh2WVdSbGNpaHZjSFJwYjI1ektWeHVJQ0FnSUgxY2JpQWdmVnh1WEc0Z0lDOHFLbHh1SUNBZ0tpQXRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMWNiaUFnSUNvZ1JFOU5JRUZ3YVNCcGJYQnNaVzFsYm5SaGRHbHZibHh1SUNBZ0tpQXRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMWNiaUFnSUNvdlhHNGdJR052Ym5OMElHTnZiWEJ2Ym1WdWRITWdQU0JiWFZ4dUlDQmpiMjV6ZENCa2FXRnNiMmR6SUQwZ1pHOWpkVzFsYm5RdWNYVmxjbmxUWld4bFkzUnZja0ZzYkNoZ0xpUjdSR2xoYkc5bkxtbGtaVzUwYVdacFpYSW9LWDFnS1Z4dVhHNGdJR2xtSUNoa2FXRnNiMmR6S1NCN1hHNGdJQ0FnUVhKeVlYa3Vabkp2YlNoa2FXRnNiMmR6S1M1bWIzSkZZV05vS0NobGJHVnRaVzUwS1NBOVBpQjdYRzRnSUNBZ0lDQmpiMjV6ZENCamIyNW1hV2NnUFNCblpYUkJkSFJ5YVdKMWRHVnpRMjl1Wm1sbktHVnNaVzFsYm5Rc0lFUkZSa0ZWVEZSZlVGSlBVRVZTVkVsRlV5d2dSRUZVUVY5QlZGUlNVMTlRVWs5UVJWSlVTVVZUS1Z4dUlDQWdJQ0FnWTI5dVptbG5MbVZzWlcxbGJuUWdQU0JsYkdWdFpXNTBYRzVjYmlBZ0lDQWdJR2xtSUNoamIyNW1hV2N1ZEhsd1pTQTlQVDBnVGtGTlJTa2dlMXh1SUNBZ0lDQWdJQ0F2THlCc2IyRmtaWEpjYmlBZ0lDQWdJQ0FnWTI5dGNHOXVaVzUwY3k1d2RYTm9LRzVsZHlCTWIyRmtaWElvWTI5dVptbG5LU2xjYmlBZ0lDQWdJSDFjYmlBZ0lDQjlLVnh1SUNCOVhHNWNiaUFnWkc5amRXMWxiblF1WVdSa1JYWmxiblJNYVhOMFpXNWxjaWduWTJ4cFkyc25MQ0FvWlhabGJuUXBJRDArSUh0Y2JpQWdJQ0JqYjI1emRDQmtZWFJoVkc5bloyeGxRWFIwY2lBOUlHVjJaVzUwTG5SaGNtZGxkQzVuWlhSQmRIUnlhV0oxZEdVb0oyUmhkR0V0ZEc5bloyeGxKeWxjYmlBZ0lDQnBaaUFvWkdGMFlWUnZaMmRzWlVGMGRISWdKaVlnWkdGMFlWUnZaMmRzWlVGMGRISWdQVDA5SUU1QlRVVXBJSHRjYmlBZ0lDQWdJR052Ym5OMElHbGtJRDBnWlhabGJuUXVkR0Z5WjJWMExtZGxkRUYwZEhKcFluVjBaU2duWkdGMFlTMTBZWEpuWlhRbktWeHVJQ0FnSUNBZ1kyOXVjM1FnWld4bGJXVnVkQ0E5SUdSdlkzVnRaVzUwTG5GMVpYSjVVMlZzWldOMGIzSW9hV1FwWEc1Y2JpQWdJQ0FnSUdOdmJuTjBJR052YlhCdmJtVnVkQ0E5SUdOdmJYQnZibVZ1ZEhNdVptbHVaQ2hqSUQwK0lHTXVaV3hsYldWdWRDQTlQVDBnWld4bGJXVnVkQ2xjYmx4dUlDQWdJQ0FnYVdZZ0tDRmpiMjF3YjI1bGJuUXBJSHRjYmlBZ0lDQWdJQ0FnY21WMGRYSnVYRzRnSUNBZ0lDQjlYRzVjYmlBZ0lDQWdJQzh2SUhKbGJXOTJaU0IwYUdVZ1ptOWpkWE1nYzNSaGRHVWdiMllnZEdobElIUnlhV2RuWlhKY2JpQWdJQ0FnSUdWMlpXNTBMblJoY21kbGRDNWliSFZ5S0NsY2JseHVJQ0FnSUNBZ1kyOXRjRzl1Wlc1MExtUnBZV3h2Wnk1emFHOTNLQ2xjYmlBZ0lDQjlYRzRnSUgwcFhHNWNiaUFnY21WMGRYSnVJRXh2WVdSbGNseHVmU2tvS1Z4dVhHNWxlSEJ2Y25RZ1pHVm1ZWFZzZENCTWIyRmtaWEpjYmlJc0lpOHFLbHh1SUNvZ0xTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMWNiaUFxSUV4cFkyVnVjMlZrSUhWdVpHVnlJRTFKVkNBb2FIUjBjSE02THk5bmFYUm9kV0l1WTI5dEwzRjFZWEpyTFdSbGRpOVFhRzl1YjI0dFJuSmhiV1YzYjNKckwySnNiMkl2YldGemRHVnlMMHhKUTBWT1UwVXBYRzRnS2lBdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExWeHVJQ292WEc1cGJYQnZjblFnUkdsaGJHOW5JR1p5YjIwZ0p5NHZhVzVrWlhnblhHNXBiWEJ2Y25RZ2V5Qm5aWFJCZEhSeWFXSjFkR1Z6UTI5dVptbG5JSDBnWm5KdmJTQW5MaTR2WTI5dGNHOXVaVzUwVFdGdVlXZGxjaWRjYmx4dVkyOXVjM1FnVUhKdmJYQjBJRDBnS0NncElEMCtJSHRjYmx4dUlDQXZLaXBjYmlBZ0lDb2dMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRYRzRnSUNBcUlFTnZibk4wWVc1MGMxeHVJQ0FnS2lBdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMxY2JpQWdJQ292WEc1Y2JpQWdZMjl1YzNRZ1RrRk5SU0E5SUNkd2NtOXRjSFFuWEc0Z0lHTnZibk4wSUVSRlJrRlZURlJmVUZKUFVFVlNWRWxGVXlBOUlIdGNiaUFnSUNCbGJHVnRaVzUwT2lCdWRXeHNMRnh1SUNBZ0lIUnBkR3hsT2lCdWRXeHNMRnh1SUNBZ0lHMWxjM05oWjJVNklHNTFiR3dzWEc0Z0lDQWdZMkZ1WTJWc1lXSnNaVG9nZEhKMVpTeGNiaUFnSUNCMGVYQmxPaUJPUVUxRkxGeHVJQ0FnSUdKMWRIUnZibk02SUZ0Y2JpQWdJQ0FnSUh0Y2JpQWdJQ0FnSUNBZ2RHVjRkRG9nSjBOaGJtTmxiQ2NzWEc0Z0lDQWdJQ0FnSUdScGMyMXBjM002SUhSeWRXVXNYRzRnSUNBZ0lDQWdJR05zWVhOek9pQW5ZblJ1SUdKMGJpMXpaV052Ym1SaGNua25MRnh1SUNBZ0lDQWdmU3hjYmlBZ0lDQWdJSHRjYmlBZ0lDQWdJQ0FnZEdWNGREb2dKMDlySnl4Y2JpQWdJQ0FnSUNBZ1pHbHpiV2x6Y3pvZ2RISjFaU3hjYmlBZ0lDQWdJQ0FnWTJ4aGMzTTZJQ2RpZEc0Z1luUnVMWEJ5YVcxaGNua25MRnh1SUNBZ0lDQWdmU3hjYmlBZ0lDQmRMRnh1SUNCOVhHNGdJR052Ym5OMElFUkJWRUZmUVZSVVVsTmZVRkpQVUVWU1ZFbEZVeUE5SUZ0Y2JpQWdJQ0FuWTJGdVkyVnNZV0pzWlNjc1hHNGdJRjFjYmx4dUlDQXZLaXBjYmlBZ0lDb2dMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRYRzRnSUNBcUlFTnNZWE56SUVSbFptbHVhWFJwYjI1Y2JpQWdJQ29nTFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0WEc0Z0lDQXFMMXh1WEc0Z0lHTnNZWE56SUZCeWIyMXdkQ0JsZUhSbGJtUnpJRVJwWVd4dlp5QjdYRzVjYmlBZ0lDQmpiMjV6ZEhKMVkzUnZjaWh2Y0hScGIyNXpJRDBnZTMwcElIdGNiaUFnSUNBZ0lHTnZibk4wSUhSbGJYQnNZWFJsSUQwZ0p5Y2dLMXh1SUNBZ0lDQWdKenhrYVhZZ1kyeGhjM005WENKa2FXRnNiMmRjSWlCMFlXSnBibVJsZUQxY0lpMHhYQ0lnY205c1pUMWNJbVJwWVd4dloxd2lQaWNnSzF4dUlDQWdJQ0FnSUNBblBHUnBkaUJqYkdGemN6MWNJbVJwWVd4dlp5MXBibTVsY2x3aUlISnZiR1U5WENKa2IyTjFiV1Z1ZEZ3aVBpY2dLMXh1SUNBZ0lDQWdJQ0FnSUNjOFpHbDJJR05zWVhOelBWd2laR2xoYkc5bkxXTnZiblJsYm5SY0lqNG5JQ3RjYmlBZ0lDQWdJQ0FnSUNBZ0lDYzhaR2wySUdOc1lYTnpQVndpWkdsaGJHOW5MV2hsWVdSbGNsd2lQaWNnSzF4dUlDQWdJQ0FnSUNBZ0lDQWdJQ0FuUEdnMUlHTnNZWE56UFZ3aVpHbGhiRzluTFhScGRHeGxYQ0krUEM5b05UNG5JQ3RjYmlBZ0lDQWdJQ0FnSUNBZ0lDYzhMMlJwZGo0bklDdGNiaUFnSUNBZ0lDQWdJQ0FnSUNjOFpHbDJJR05zWVhOelBWd2laR2xoYkc5bkxXSnZaSGxjSWo0bklDdGNiaUFnSUNBZ0lDQWdJQ0FnSUNBZ0p6eHdQand2Y0Q0bklDdGNiaUFnSUNBZ0lDQWdJQ0FnSUNBZ0p6eHBibkIxZENCamJHRnpjejFjSW1admNtMHRZMjl1ZEhKdmJGd2lJSFI1Y0dVOVhDSjBaWGgwWENJZ2RtRnNkV1U5WENKY0lqNG5JQ3RjYmlBZ0lDQWdJQ0FnSUNBZ0lDYzhMMlJwZGo0bklDdGNiaUFnSUNBZ0lDQWdJQ0FnSUNjOFpHbDJJR05zWVhOelBWd2laR2xoYkc5bkxXWnZiM1JsY2x3aVBpY2dLMXh1SUNBZ0lDQWdJQ0FnSUNBZ0p6d3ZaR2wyUGljZ0sxeHVJQ0FnSUNBZ0lDQWdJQ2M4TDJScGRqNG5JQ3RjYmlBZ0lDQWdJQ0FnSnp3dlpHbDJQaWNnSzF4dUlDQWdJQ0FnSnp3dlpHbDJQaWRjYmx4dUlDQWdJQ0FnYVdZZ0tDRkJjbkpoZVM1cGMwRnljbUY1S0c5d2RHbHZibk11WW5WMGRHOXVjeWtwSUh0Y2JpQWdJQ0FnSUNBZ2IzQjBhVzl1Y3k1aWRYUjBiMjV6SUQwZ1JFVkdRVlZNVkY5UVVrOVFSVkpVU1VWVExtSjFkSFJ2Ym5OY2JpQWdJQ0FnSUgxY2JseHVJQ0FnSUNBZ2MzVndaWElvYjNCMGFXOXVjeXdnZEdWdGNHeGhkR1VwWEc0Z0lDQWdmVnh1WEc0Z0lDQWdjMmh2ZHlncElIdGNiaUFnSUNBZ0lITjFjR1Z5TG5Ob2IzY29LVnh1SUNBZ0lDQWdkR2hwY3k1aGRIUmhZMmhKYm5CMWRFVjJaVzUwS0NsY2JpQWdJQ0I5WEc1Y2JpQWdJQ0JvYVdSbEtDa2dlMXh1SUNBZ0lDQWdjM1Z3WlhJdWFHbGtaU2dwSUNBZ1hHNGdJQ0FnSUNCMGFHbHpMbVJsZEdGamFFbHVjSFYwUlhabGJuUW9LU0FnSUZ4dUlDQWdJSDFjYmx4dUlDQWdJR2RsZEVsdWNIVjBLQ2tnZTF4dUlDQWdJQ0FnY21WMGRYSnVJSFJvYVhNdWIzQjBhVzl1Y3k1bGJHVnRaVzUwTG5GMVpYSjVVMlZzWldOMGIzSW9KeTVtYjNKdExXTnZiblJ5YjJ3bktWeHVJQ0FnSUgxY2JseHVJQ0FnSUdGMGRHRmphRWx1Y0hWMFJYWmxiblFvS1NCN1hHNGdJQ0FnSUNCMGFHbHpMbkpsWjJsemRHVnlSV3hsYldWdWRDaDdJSFJoY21kbGREb2dkR2hwY3k1blpYUkpibkIxZENncExDQmxkbVZ1ZERvZ0oydGxlWFZ3SnlCOUtWeHVJQ0FnSUgxY2JseHVJQ0FnSUdSbGRHRmphRWx1Y0hWMFJYWmxiblFvS1NCN1hHNGdJQ0FnSUNCMGFHbHpMblZ1Y21WbmFYTjBaWEpGYkdWdFpXNTBLSHNnZEdGeVoyVjBPaUIwYUdsekxtZGxkRWx1Y0hWMEtDa3NJR1YyWlc1ME9pQW5hMlY1ZFhBbklIMHBJQ0FnSUNBZ0lDQWdYRzRnSUNBZ2ZWeHVYRzRnSUNBZ2IyNUZiR1Z0Wlc1MFJYWmxiblFvWlhabGJuUXBJSHRjYmlBZ0lDQWdJR2xtSUNobGRtVnVkQzUwWVhKblpYUWdQVDA5SUhSb2FYTXVaMlYwU1c1d2RYUW9LU2tnZTF4dUlDQWdJQ0FnSUNCeVpYUjFjbTVjYmlBZ0lDQWdJSDFjYmx4dUlDQWdJQ0FnYzNWd1pYSXViMjVGYkdWdFpXNTBSWFpsYm5Rb1pYWmxiblFwWEc0Z0lDQWdmVnh1WEc0Z0lDQWdjMlYwU1c1d2RYUldZV3gxWlNoMllXeDFaU0E5SUNjbktTQjdYRzRnSUNBZ0lDQjBhR2x6TG1kbGRFbHVjSFYwS0NrdWRtRnNkV1VnUFNCMllXeDFaVnh1SUNBZ0lIMWNibHh1SUNBZ0lHZGxkRWx1Y0hWMFZtRnNkV1VvS1NCN1hHNGdJQ0FnSUNCeVpYUjFjbTRnZEdocGN5NW5aWFJKYm5CMWRDZ3BMblpoYkhWbFhHNGdJQ0FnZlZ4dVhHNGdJQ0FnYzNSaGRHbGpJR2xrWlc1MGFXWnBaWElvS1NCN1hHNGdJQ0FnSUNCeVpYUjFjbTRnVGtGTlJWeHVJQ0FnSUgxY2JseHVJQ0FnSUhOMFlYUnBZeUJmUkU5TlNXNTBaWEptWVdObEtHOXdkR2x2Ym5NcElIdGNiaUFnSUNBZ0lISmxkSFZ5YmlCdVpYY2dVSEp2YlhCMEtHOXdkR2x2Ym5NcFhHNGdJQ0FnZlZ4dUlDQjlYRzVjYmlBZ0x5b3FYRzRnSUNBcUlDMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExWeHVJQ0FnS2lCRVQwMGdRWEJwSUdsdGNHeGxiV1Z1ZEdGMGFXOXVYRzRnSUNBcUlDMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExWeHVJQ0FnS2k5Y2JpQWdZMjl1YzNRZ1kyOXRjRzl1Wlc1MGN5QTlJRnRkWEc0Z0lHTnZibk4wSUdScFlXeHZaM01nUFNCa2IyTjFiV1Z1ZEM1eGRXVnllVk5sYkdWamRHOXlRV3hzS0dBdUpIdEVhV0ZzYjJjdWFXUmxiblJwWm1sbGNpZ3BmV0FwWEc1Y2JpQWdhV1lnS0dScFlXeHZaM01wSUh0Y2JpQWdJQ0JCY25KaGVTNW1jbTl0S0dScFlXeHZaM01wTG1admNrVmhZMmdvS0dWc1pXMWxiblFwSUQwK0lIdGNiaUFnSUNBZ0lHTnZibk4wSUdOdmJtWnBaeUE5SUdkbGRFRjBkSEpwWW5WMFpYTkRiMjVtYVdjb1pXeGxiV1Z1ZEN3Z1JFVkdRVlZNVkY5UVVrOVFSVkpVU1VWVExDQkVRVlJCWDBGVVZGSlRYMUJTVDFCRlVsUkpSVk1wWEc0Z0lDQWdJQ0JqYjI1bWFXY3VaV3hsYldWdWRDQTlJR1ZzWlcxbGJuUmNibHh1SUNBZ0lDQWdhV1lnS0dOdmJtWnBaeTUwZVhCbElEMDlQU0JPUVUxRktTQjdYRzRnSUNBZ0lDQWdJQzh2SUhCeWIyMXdkRnh1SUNBZ0lDQWdJQ0JqYjIxd2IyNWxiblJ6TG5CMWMyZ29ibVYzSUZCeWIyMXdkQ2hqYjI1bWFXY3BLVnh1SUNBZ0lDQWdmVnh1SUNBZ0lIMHBYRzRnSUgxY2JseHVJQ0JrYjJOMWJXVnVkQzVoWkdSRmRtVnVkRXhwYzNSbGJtVnlLQ2RqYkdsamF5Y3NJQ2hsZG1WdWRDa2dQVDRnZTF4dUlDQWdJR052Ym5OMElHUmhkR0ZVYjJkbmJHVkJkSFJ5SUQwZ1pYWmxiblF1ZEdGeVoyVjBMbWRsZEVGMGRISnBZblYwWlNnblpHRjBZUzEwYjJkbmJHVW5LVnh1SUNBZ0lHbG1JQ2hrWVhSaFZHOW5aMnhsUVhSMGNpQW1KaUJrWVhSaFZHOW5aMnhsUVhSMGNpQTlQVDBnVGtGTlJTa2dlMXh1SUNBZ0lDQWdZMjl1YzNRZ2FXUWdQU0JsZG1WdWRDNTBZWEpuWlhRdVoyVjBRWFIwY21saWRYUmxLQ2RrWVhSaExYUmhjbWRsZENjcFhHNGdJQ0FnSUNCamIyNXpkQ0JsYkdWdFpXNTBJRDBnWkc5amRXMWxiblF1Y1hWbGNubFRaV3hsWTNSdmNpaHBaQ2xjYmx4dUlDQWdJQ0FnWTI5dWMzUWdZMjl0Y0c5dVpXNTBJRDBnWTI5dGNHOXVaVzUwY3k1bWFXNWtLR01nUFQ0Z1l5NWxiR1Z0Wlc1MElEMDlQU0JsYkdWdFpXNTBLVnh1WEc0Z0lDQWdJQ0JwWmlBb0lXTnZiWEJ2Ym1WdWRDa2dlMXh1SUNBZ0lDQWdJQ0J5WlhSMWNtNWNiaUFnSUNBZ0lIMWNibHh1SUNBZ0lDQWdMeThnY21WdGIzWmxJSFJvWlNCbWIyTjFjeUJ6ZEdGMFpTQnZaaUIwYUdVZ2RISnBaMmRsY2x4dUlDQWdJQ0FnWlhabGJuUXVkR0Z5WjJWMExtSnNkWElvS1Z4dVhHNGdJQ0FnSUNCamIyMXdiMjVsYm5RdVpHbGhiRzluTG5Ob2IzY29LVnh1SUNBZ0lIMWNiaUFnZlNsY2JseHVJQ0J5WlhSMWNtNGdVSEp2YlhCMFhHNTlLU2dwWEc1Y2JtVjRjRzl5ZENCa1pXWmhkV3gwSUZCeWIyMXdkRnh1SWl3aUx5b3FYRzRnS2lBdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExWeHVJQ29nVEdsalpXNXpaV1FnZFc1a1pYSWdUVWxVSUNob2RIUndjem92TDJkcGRHaDFZaTVqYjIwdmNYVmhjbXN0WkdWMkwxQm9iMjV2YmkxR2NtRnRaWGR2Y21zdllteHZZaTl0WVhOMFpYSXZURWxEUlU1VFJTbGNiaUFxSUMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdFhHNGdLaTljYm1sdGNHOXlkQ0JEYjIxd2IyNWxiblFnWm5KdmJTQW5MaTR2WTI5dGNHOXVaVzUwSjF4dWFXMXdiM0owSUVWMlpXNTBJR1p5YjIwZ0p5NHVMeTR1TDJOdmJXMXZiaTlsZG1WdWRITW5YRzVwYlhCdmNuUWdleUJtYVc1a1ZHRnlaMlYwUW5sRGJHRnpjeUI5SUdaeWIyMGdKeTR1THk0dUwyTnZiVzF2Ymk5MWRHbHNjeWRjYm1sdGNHOXlkQ0I3SUdkbGRFRjBkSEpwWW5WMFpYTkRiMjVtYVdjZ2ZTQm1jbTl0SUNjdUxpOWpiMjF3YjI1bGJuUk5ZVzVoWjJWeUoxeHVYRzVqYjI1emRDQkVjbTl3Wkc5M2JpQTlJQ2dvS1NBOVBpQjdYRzRnSUM4cUtseHVJQ0FnS2lBdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMxY2JpQWdJQ29nUTI5dWMzUmhiblJ6WEc0Z0lDQXFJQzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMVnh1SUNBZ0tpOWNibHh1SUNCamIyNXpkQ0JPUVUxRklEMGdKMlJ5YjNCa2IzZHVKMXh1SUNCamIyNXpkQ0JXUlZKVFNVOU9JRDBnSnpJdU1DNHdKMXh1SUNCamIyNXpkQ0JFUlVaQlZVeFVYMUJTVDFCRlVsUkpSVk1nUFNCN1hHNGdJQ0FnWld4bGJXVnVkRG9nYm5Wc2JDeGNiaUFnSUNCa1pXWmhkV3gwT2lCMGNuVmxMRnh1SUNBZ0lITmxZWEpqYURvZ1ptRnNjMlVzWEc0Z0lIMWNiaUFnWTI5dWMzUWdSRUZVUVY5QlZGUlNVMTlRVWs5UVJWSlVTVVZUSUQwZ1cxeHVJQ0FnSUNka1pXWmhkV3gwSnl4Y2JpQWdJQ0FuYzJWaGNtTm9KeXhjYmlBZ1hWeHVYRzRnSUM4cUtseHVJQ0FnS2lBdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMxY2JpQWdJQ29nUTJ4aGMzTWdSR1ZtYVc1cGRHbHZibHh1SUNBZ0tpQXRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMWNiaUFnSUNvdlhHNWNiaUFnWTJ4aGMzTWdSSEp2Y0dSdmQyNGdaWGgwWlc1a2N5QkRiMjF3YjI1bGJuUWdlMXh1WEc0Z0lDQWdZMjl1YzNSeWRXTjBiM0lvYjNCMGFXOXVjeUE5SUh0OUtTQjdYRzRnSUNBZ0lDQnpkWEJsY2loT1FVMUZMQ0JXUlZKVFNVOU9MQ0JFUlVaQlZVeFVYMUJTVDFCRlVsUkpSVk1zSUc5d2RHbHZibk1zSUVSQlZFRmZRVlJVVWxOZlVGSlBVRVZTVkVsRlV5d2dabUZzYzJVc0lHWmhiSE5sS1Z4dVhHNGdJQ0FnSUNCamIyNXpkQ0J6Wld4bFkzUmxaQ0E5SUhSb2FYTXViM0IwYVc5dWN5NWxiR1Z0Wlc1MExuRjFaWEo1VTJWc1pXTjBiM0lvSjF0a1lYUmhMWE5sYkdWamRHVmtYU2NwWEc0Z0lDQWdJQ0JqYjI1emRDQnBkR1Z0SUQwZ2RHaHBjeTVuWlhSSmRHVnRSR0YwWVNoelpXeGxZM1JsWkNsY2JseHVJQ0FnSUNBZ2RHaHBjeTV6WlhSVFpXeGxZM1JsWkNocGRHVnRMblpoYkhWbExDQnBkR1Z0TG5SbGVIUXNJR1poYkhObEtWeHVJQ0FnSUgxY2JseHVJQ0FnSUhObGRGTmxiR1ZqZEdWa0tIWmhiSFZsSUQwZ0p5Y3NJSFJsZUhRZ1BTQnVkV3hzTENCamFHVmphMFY0YVhOMGN5QTlJSFJ5ZFdVcElIdGNiaUFnSUNBZ0lHbG1JQ2doZEdocGN5NXZjSFJwYjI1ekxtUmxabUYxYkhRcElIdGNiaUFnSUNBZ0lDQWdjbVYwZFhKdUlHWmhiSE5sWEc0Z0lDQWdJQ0I5WEc1Y2JpQWdJQ0FnSUd4bGRDQjBaWGgwUkdsemNHeGhlU0E5SUhSbGVIUmNiaUFnSUNBZ0lIUm9hWE11YjNCMGFXOXVjeTVsYkdWdFpXNTBMbkYxWlhKNVUyVnNaV04wYjNJb0p5NWtaV1poZFd4MExYUmxlSFFuS1M1cGJtNWxja2hVVFV3Z1BTQjBaWGgwWEc0Z0lDQWdJQ0IwYUdsekxtOXdkR2x2Ym5NdVpXeGxiV1Z1ZEM1eGRXVnllVk5sYkdWamRHOXlLQ2RwYm5CMWRGdDBlWEJsUFZ3aWFHbGtaR1Z1WENKZEp5a3VkbUZzZFdVZ1BTQjJZV3gxWlZ4dVhHNGdJQ0FnSUNCamIyNXpkQ0JwZEdWdGN5QTlJSFJvYVhNdWIzQjBhVzl1Y3k1bGJHVnRaVzUwTG5GMVpYSjVVMlZzWldOMGIzSkJiR3dvSnk1cGRHVnRKeWtnZkh3Z1cxMWNiaUFnSUNBZ0lHeGxkQ0JwZEdWdFJtOTFibVFnUFNCbVlXeHpaVnh1WEc0Z0lDQWdJQ0JCY25KaGVTNW1jbTl0S0dsMFpXMXpLUzVtYjNKRllXTm9LQ2hwZEdWdEtTQTlQaUI3WEc0Z0lDQWdJQ0FnSUdsbUlDaHBkR1Z0TG1Oc1lYTnpUR2x6ZEM1amIyNTBZV2x1Y3lnbmMyVnNaV04wWldRbktTa2dlMXh1SUNBZ0lDQWdJQ0FnSUdsMFpXMHVZMnhoYzNOTWFYTjBMbkpsYlc5MlpTZ25jMlZzWldOMFpXUW5LVnh1SUNBZ0lDQWdJQ0I5WEc1Y2JpQWdJQ0FnSUNBZ1kyOXVjM1FnWkdGMFlTQTlJSFJvYVhNdVoyVjBTWFJsYlVSaGRHRW9hWFJsYlNsY2JseHVJQ0FnSUNBZ0lDQnBaaUFvZG1Gc2RXVWdQVDA5SUdSaGRHRXVkbUZzZFdVcElIdGNiaUFnSUNBZ0lDQWdJQ0JwWmlBb0lXbDBaVzB1WTJ4aGMzTk1hWE4wTG1OdmJuUmhhVzV6S0NkelpXeGxZM1JsWkNjcEtTQjdYRzRnSUNBZ0lDQWdJQ0FnSUNCcGRHVnRMbU5zWVhOelRHbHpkQzVoWkdRb0ozTmxiR1ZqZEdWa0p5bGNiaUFnSUNBZ0lDQWdJQ0I5WEc1Y2JpQWdJQ0FnSUNBZ0lDQjBaWGgwUkdsemNHeGhlU0E5SUdSaGRHRXVkR1Y0ZEZ4dUlDQWdJQ0FnSUNBZ0lHbDBaVzFHYjNWdVpDQTlJSFJ5ZFdWY2JpQWdJQ0FnSUNBZ2ZWeHVJQ0FnSUNBZ2ZTbGNibHh1SUNBZ0lDQWdhV1lnS0dOb1pXTnJSWGhwYzNSeklDWW1JR2wwWlcxR2IzVnVaQ2tnZTF4dUlDQWdJQ0FnSUNCMGFHbHpMbTl3ZEdsdmJuTXVaV3hsYldWdWRDNXhkV1Z5ZVZObGJHVmpkRzl5S0NjdVpHVm1ZWFZzZEMxMFpYaDBKeWt1YVc1dVpYSklWRTFNSUQwZ2RHVjRkRVJwYzNCc1lYbGNiaUFnSUNBZ0lIMGdaV3h6WlNCcFppQW9ZMmhsWTJ0RmVHbHpkSE1nSmlZZ0lXbDBaVzFHYjNWdVpDa2dlMXh1SUNBZ0lDQWdJQ0IwYUhKdmR5QnVaWGNnUlhKeWIzSW9ZQ1I3VGtGTlJYMHVJRlJvWlNCMllXeDFaU0JjSWlSN2RtRnNkV1Y5WENJZ1pHOWxjeUJ1YjNRZ1pYaHBjM1FnYVc0Z2RHaGxJR3hwYzNRZ2IyWWdhWFJsYlhNdVlDa2dJQ0FnSUNBZ0lGeHVJQ0FnSUNBZ2ZWeHVYRzRnSUNBZ0lDQnlaWFIxY200Z2RISjFaVnh1SUNBZ0lIMWNibHh1SUNBZ0lHZGxkRk5sYkdWamRHVmtLQ2tnZTF4dUlDQWdJQ0FnY21WMGRYSnVJSFJvYVhNdWIzQjBhVzl1Y3k1bGJHVnRaVzUwTG5GMVpYSjVVMlZzWldOMGIzSW9KMmx1Y0hWMFczUjVjR1U5WENKb2FXUmtaVzVjSWwwbktTNTJZV3gxWlZ4dUlDQWdJSDFjYmx4dUlDQWdJR2RsZEVsMFpXMUVZWFJoS0dsMFpXMGdQU0J1ZFd4c0tTQjdYRzRnSUNBZ0lDQnNaWFFnZEdWNGRDQTlJQ2NuWEc0Z0lDQWdJQ0JzWlhRZ2RtRnNkV1VnUFNBbkoxeHVYRzRnSUNBZ0lDQnBaaUFvYVhSbGJTa2dlMXh1SUNBZ0lDQWdJQ0IwWlhoMElEMGdhWFJsYlM1blpYUkJkSFJ5YVdKMWRHVW9KMlJoZEdFdGRHVjRkQ2NwSUh4OElHbDBaVzB1YVc1dVpYSklWRTFNWEc1Y2JpQWdJQ0FnSUNBZ1kyOXVjM1FnYzJWc1pXTjBaV1JVWlhoMFRtOWtaU0E5SUdsMFpXMHVjWFZsY25sVFpXeGxZM1J2Y2lnbkxuUmxlSFFuS1Z4dUlDQWdJQ0FnSUNCcFppQW9jMlZzWldOMFpXUlVaWGgwVG05a1pTa2dlMXh1SUNBZ0lDQWdJQ0FnSUhSbGVIUWdQU0J6Wld4bFkzUmxaRlJsZUhST2IyUmxMbWx1Ym1WeVNGUk5URnh1SUNBZ0lDQWdJQ0I5WEc1Y2JpQWdJQ0FnSUNBZ2RtRnNkV1VnUFNCcGRHVnRMbWRsZEVGMGRISnBZblYwWlNnblpHRjBZUzEyWVd4MVpTY3BJSHg4SUNjblhHNGdJQ0FnSUNCOVhHNWNiaUFnSUNBZ0lISmxkSFZ5YmlCN0lIUmxlSFFzSUhaaGJIVmxJSDFjYmlBZ0lDQjlYRzVjYmlBZ0lDQnZia1ZzWlcxbGJuUkZkbVZ1ZENobGRtVnVkQ2tnZTF4dUlDQWdJQ0FnYVdZZ0tHVjJaVzUwTG5SNWNHVWdQVDA5SUVWMlpXNTBMbE5VUVZKVUtTQjdYRzRnSUNBZ0lDQWdJR052Ym5OMElHUnliM0JrYjNkdUlEMGdabWx1WkZSaGNtZGxkRUo1UTJ4aGMzTW9aWFpsYm5RdWRHRnlaMlYwTENBblpISnZjR1J2ZDI0bktWeHVYRzRnSUNBZ0lDQWdJQzhxWEc0Z0lDQWdJQ0FnSUNBcUlHaHBaR1VnZEdobElHTjFjbkpsYm5RZ1pISnZjR1J2ZDI0Z2IyNXNlU0JwWmlCMGFHVWdaWFpsYm5RZ1kyOXVZMlZ5Ym5NZ1lXNXZkR2hsY2lCa2NtOXdaRzkzYmx4dUlDQWdJQ0FnSUNBZ0tpQm9hV1JsSUdGc2MyOGdhV1lnZEdobElIVnpaWElnWTJ4cFkydHpJRzkxZEhOcFpHVWdZU0JrY205d1pHOTNibHh1SUNBZ0lDQWdJQ0FnS2k5Y2JpQWdJQ0FnSUNBZ2FXWWdLQ0ZrY205d1pHOTNiaUI4ZkNCa2NtOXdaRzkzYmlBaFBUMGdkR2hwY3k1blpYUkZiR1Z0Wlc1MEtDa3BJSHRjYmlBZ0lDQWdJQ0FnSUNCMGFHbHpMbWhwWkdVb0tWeHVJQ0FnSUNBZ0lDQjlYRzVjYmlBZ0lDQWdJSDBnWld4elpTQnBaaUFvWlhabGJuUXVkSGx3WlNBOVBUMGdKMk5zYVdOckp5a2dlMXh1SUNBZ0lDQWdJQ0JqYjI1emRDQnBkR1Z0SUQwZ1ptbHVaRlJoY21kbGRFSjVRMnhoYzNNb1pYWmxiblF1ZEdGeVoyVjBMQ0FuYVhSbGJTY3BYRzVjYmlBZ0lDQWdJQ0FnYVdZZ0tHbDBaVzBwSUh0Y2JpQWdJQ0FnSUNBZ0lDQnBaaUFvYVhSbGJTNWpiR0Z6YzB4cGMzUXVZMjl1ZEdGcGJuTW9KMlJwYzJGaWJHVmtKeWtwSUh0Y2JpQWdJQ0FnSUNBZ0lDQWdJSEpsZEhWeWJseHVJQ0FnSUNBZ0lDQWdJSDFjYmx4dUlDQWdJQ0FnSUNBZ0lHTnZibk4wSUdsMFpXMUpibVp2SUQwZ2RHaHBjeTVuWlhSSmRHVnRSR0YwWVNocGRHVnRLVnh1WEc0Z0lDQWdJQ0FnSUNBZ2FXWWdLSFJvYVhNdVoyVjBVMlZzWldOMFpXUW9LU0FoUFQwZ2FYUmxiVWx1Wm04dWRtRnNkV1VwSUh0Y2JpQWdJQ0FnSUNBZ0lDQWdJQzh2SUhSb1pTQjFjMlZ5SUhObGJHVmpkR1ZrSUdGdWIzUm9aWElnZG1Gc2RXVXNJSGRsSUdScGMzQmhkR05vSUhSb1pTQmxkbVZ1ZEZ4dUlDQWdJQ0FnSUNBZ0lDQWdkR2hwY3k1elpYUlRaV3hsWTNSbFpDaHBkR1Z0U1c1bWJ5NTJZV3gxWlN3Z2FYUmxiVWx1Wm04dWRHVjRkQ3dnWm1Gc2MyVXBYRzRnSUNBZ0lDQWdJQ0FnSUNCamIyNXpkQ0JrWlhSaGFXd2dQU0I3SUdsMFpXMHNJSFJsZUhRNklHbDBaVzFKYm1adkxuUmxlSFFzSUhaaGJIVmxPaUJwZEdWdFNXNW1ieTUyWVd4MVpTQjlYRzRnSUNBZ0lDQWdJQ0FnSUNCMGFHbHpMblJ5YVdkblpYSkZkbVZ1ZENoRmRtVnVkQzVKVkVWTlgxTkZURVZEVkVWRUxDQmtaWFJoYVd3cFhHNGdJQ0FnSUNBZ0lDQWdmVnh1WEc0Z0lDQWdJQ0FnSUNBZ2RHaHBjeTVvYVdSbEtDbGNiaUFnSUNBZ0lDQWdJQ0J5WlhSMWNtNWNiaUFnSUNBZ0lDQWdmVnh1WEc0Z0lDQWdJQ0FnSUM4dklHUnZiaWQwSUhSdloyZHNaU0IwYUdVZ1pISnZjR1J2ZDI0Z2FXWWdkR2hsSUdWMlpXNTBJR052Ym1ObGNtNXpJR2hsWVdSbGNuTXNJR1JwZG1sa1pYSnpYRzRnSUNBZ0lDQWdJR052Ym5OMElHUnliM0JrYjNkdVRXVnVkU0E5SUdacGJtUlVZWEpuWlhSQ2VVTnNZWE56S0dWMlpXNTBMblJoY21kbGRDd2dKMlJ5YjNCa2IzZHVMVzFsYm5VbktWeHVJQ0FnSUNBZ0lDQnBaaUFvWkhKdmNHUnZkMjVOWlc1MUtTQjdYRzRnSUNBZ0lDQWdJQ0FnY21WMGRYSnVYRzRnSUNBZ0lDQWdJSDFjYmx4dUlDQWdJQ0FnSUNCMGFHbHpMblJ2WjJkc1pTZ3BYRzRnSUNBZ0lDQjlYRzRnSUNBZ2ZWeHVYRzRnSUNBZ2RHOW5aMnhsS0NrZ2UxeHVJQ0FnSUNBZ2FXWWdLSFJvYVhNdWIzQjBhVzl1Y3k1bGJHVnRaVzUwTG1Oc1lYTnpUR2x6ZEM1amIyNTBZV2x1Y3lnbllXTjBhWFpsSnlrcElIdGNiaUFnSUNBZ0lDQWdjbVYwZFhKdUlIUm9hWE11YUdsa1pTZ3BYRzRnSUNBZ0lDQjlYRzVjYmlBZ0lDQWdJSEpsZEhWeWJpQjBhR2x6TG5Ob2IzY29LVnh1SUNBZ0lIMWNibHh1SUNBZ0lITm9iM2NvS1NCN1hHNGdJQ0FnSUNCcFppQW9kR2hwY3k1dmNIUnBiMjV6TG1Wc1pXMWxiblF1WTJ4aGMzTk1hWE4wTG1OdmJuUmhhVzV6S0NkaFkzUnBkbVVuS1NrZ2UxeHVJQ0FnSUNBZ0lDQnlaWFIxY200Z1ptRnNjMlZjYmlBZ0lDQWdJSDFjYmx4dUlDQWdJQ0FnZEdocGN5NXZjSFJwYjI1ekxtVnNaVzFsYm5RdVkyeGhjM05NYVhOMExtRmtaQ2duWVdOMGFYWmxKeWxjYmx4dUlDQWdJQ0FnWTI5dWMzUWdaSEp2Y0dSdmQyNU5aVzUxSUQwZ2RHaHBjeTV2Y0hScGIyNXpMbVZzWlcxbGJuUXVjWFZsY25sVFpXeGxZM1J2Y2lnbkxtUnliM0JrYjNkdUxXMWxiblVuS1Z4dVhHNGdJQ0FnSUNBdkx5QnpZM0p2Ykd3Z2RHOGdkRzl3WEc0Z0lDQWdJQ0JrY205d1pHOTNiazFsYm5VdWMyTnliMnhzVkc5d0lEMGdNRnh1WEc0Z0lDQWdJQ0IwYUdsekxuUnlhV2RuWlhKRmRtVnVkQ2hGZG1WdWRDNVRTRTlYS1Z4dUlDQWdJQ0FnZEdocGN5NTBjbWxuWjJWeVJYWmxiblFvUlhabGJuUXVVMGhQVjA0cFhHNWNiaUFnSUNBZ0lIUm9hWE11Y21WbmFYTjBaWEpGYkdWdFpXNTBLSHNnZEdGeVoyVjBPaUJrY205d1pHOTNiazFsYm5Vc0lHVjJaVzUwT2lBblkyeHBZMnNuSUgwcElDQWdJQ0FnWEc0Z0lDQWdJQ0IwYUdsekxuSmxaMmx6ZEdWeVJXeGxiV1Z1ZENoN0lIUmhjbWRsZERvZ1pHOWpkVzFsYm5RdVltOWtlU3dnWlhabGJuUTZJRVYyWlc1MExsTlVRVkpVSUgwcFhHNWNiaUFnSUNBZ0lISmxkSFZ5YmlCMGNuVmxYRzRnSUNBZ2ZWeHVYRzRnSUNBZ2FHbGtaU2dwSUh0Y2JpQWdJQ0FnSUdsbUlDZ2hkR2hwY3k1dmNIUnBiMjV6TG1Wc1pXMWxiblF1WTJ4aGMzTk1hWE4wTG1OdmJuUmhhVzV6S0NkaFkzUnBkbVVuS1NrZ2UxeHVJQ0FnSUNBZ0lDQnlaWFIxY200Z1ptRnNjMlZjYmlBZ0lDQWdJSDFjYmx4dUlDQWdJQ0FnZEdocGN5NXZjSFJwYjI1ekxtVnNaVzFsYm5RdVkyeGhjM05NYVhOMExuSmxiVzkyWlNnbllXTjBhWFpsSnlsY2JseHVJQ0FnSUNBZ2RHaHBjeTUwY21sbloyVnlSWFpsYm5Rb1JYWmxiblF1U0VsRVJTbGNiaUFnSUNBZ0lIUm9hWE11ZEhKcFoyZGxja1YyWlc1MEtFVjJaVzUwTGtoSlJFUkZUaWxjYmx4dUlDQWdJQ0FnZEdocGN5NTFibkpsWjJsemRHVnlSV3hsYldWdWRDaDdJSFJoY21kbGREb2dkR2hwY3k1dmNIUnBiMjV6TG1Wc1pXMWxiblF1Y1hWbGNubFRaV3hsWTNSdmNpZ25MbVJ5YjNCa2IzZHVMVzFsYm5VbktTd2daWFpsYm5RNklDZGpiR2xqYXljZ2ZTa2dJQ0FnSUNCY2JpQWdJQ0FnSUhSb2FYTXVkVzV5WldkcGMzUmxja1ZzWlcxbGJuUW9leUIwWVhKblpYUTZJR1J2WTNWdFpXNTBMbUp2Wkhrc0lHVjJaVzUwT2lCRmRtVnVkQzVUVkVGU1ZDQjlLVnh1WEc0Z0lDQWdJQ0J5WlhSMWNtNGdkSEoxWlZ4dUlDQWdJSDFjYmx4dUlDQWdJSE4wWVhScFl5QnBaR1Z1ZEdsbWFXVnlLQ2tnZTF4dUlDQWdJQ0FnY21WMGRYSnVJRTVCVFVWY2JpQWdJQ0I5WEc1Y2JpQWdJQ0J6ZEdGMGFXTWdYMFJQVFVsdWRHVnlabUZqWlNodmNIUnBiMjV6S1NCN1hHNGdJQ0FnSUNCeVpYUjFjbTRnYzNWd1pYSXVYMFJQVFVsdWRHVnlabUZqWlNoRWNtOXdaRzkzYml3Z2IzQjBhVzl1Y3lsY2JpQWdJQ0I5WEc0Z0lIMWNibHh1SUNBdktpcGNiaUFnSUNvZ0xTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdFhHNGdJQ0FxSUVSUFRTQkJjR2tnYVcxd2JHVnRaVzUwWVhScGIyNWNiaUFnSUNvZ0xTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdFhHNGdJQ0FxTDF4dUlDQmpiMjV6ZENCamIyMXdiMjVsYm5SeklEMGdXMTFjYmx4dUlDQmpiMjV6ZENCa2NtOXdaRzkzYm5NZ1BTQmtiMk4xYldWdWRDNXhkV1Z5ZVZObGJHVmpkRzl5UVd4c0tHQXVKSHRPUVUxRmZXQXBYRzRnSUdsbUlDaGtjbTl3Wkc5M2JuTXBJSHRjYmlBZ0lDQkJjbkpoZVM1bWNtOXRLR1J5YjNCa2IzZHVjeWt1Wm05eVJXRmphQ2dvWld4bGJXVnVkQ2tnUFQ0Z2UxeHVJQ0FnSUNBZ1kyOXVjM1FnWTI5dVptbG5JRDBnWjJWMFFYUjBjbWxpZFhSbGMwTnZibVpwWnlobGJHVnRaVzUwTENCRVJVWkJWVXhVWDFCU1QxQkZVbFJKUlZNc0lFUkJWRUZmUVZSVVVsTmZVRkpQVUVWU1ZFbEZVeWxjYmlBZ0lDQWdJR052Ym1acFp5NWxiR1Z0Wlc1MElEMGdaV3hsYldWdWRGeHVYRzRnSUNBZ0lDQnBaaUFvSVdOdmJtWnBaeTV6WldGeVkyZ3BJSHRjYmlBZ0lDQWdJQ0FnWTI5dGNHOXVaVzUwY3k1d2RYTm9LRzVsZHlCRWNtOXdaRzkzYmloamIyNW1hV2NwS1Z4dUlDQWdJQ0FnZlZ4dUlDQWdJSDBwWEc0Z0lIMWNibHh1SUNCa2IyTjFiV1Z1ZEM1aFpHUkZkbVZ1ZEV4cGMzUmxibVZ5S0NkamJHbGpheWNzSUNobGRtVnVkQ2tnUFQ0Z2UxeHVJQ0FnSUdOdmJuTjBJR1J5YjNCa2IzZHVUV1Z1ZFNBOUlHWnBibVJVWVhKblpYUkNlVU5zWVhOektHVjJaVzUwTG5SaGNtZGxkQ3dnSjJSeWIzQmtiM2R1TFcxbGJuVW5LVnh1SUNBZ0lHbG1JQ2hrY205d1pHOTNiazFsYm5VcElIdGNiaUFnSUNBZ0lISmxkSFZ5Ymx4dUlDQWdJSDFjYmx4dUlDQWdJR052Ym5OMElHUnliM0JrYjNkdUlEMGdabWx1WkZSaGNtZGxkRUo1UTJ4aGMzTW9aWFpsYm5RdWRHRnlaMlYwTENBblpISnZjR1J2ZDI0bktWeHVYRzRnSUNBZ2FXWWdLR1J5YjNCa2IzZHVLU0I3WEc0Z0lDQWdJQ0JqYjI1emRDQmtZWFJoVkc5bloyeGxRWFIwY2lBOUlHUnliM0JrYjNkdUxtZGxkRUYwZEhKcFluVjBaU2duWkdGMFlTMTBiMmRuYkdVbktWeHVJQ0FnSUNBZ2FXWWdLR1JoZEdGVWIyZG5iR1ZCZEhSeUlDWW1JR1JoZEdGVWIyZG5iR1ZCZEhSeUlEMDlQU0JPUVUxRklDWW1JR1J5YjNCa2IzZHVLU0I3WEc0Z0lDQWdJQ0FnSUdOdmJuTjBJR052YlhCdmJtVnVkQ0E5SUdOdmJYQnZibVZ1ZEhNdVptbHVaQ2hqSUQwK0lHTXVaMlYwUld4bGJXVnVkQ2dwSUQwOVBTQmtjbTl3Wkc5M2JpbGNibHh1SUNBZ0lDQWdJQ0JwWmlBb0lXTnZiWEJ2Ym1WdWRDa2dlMXh1SUNBZ0lDQWdJQ0FnSUhKbGRIVnlibHh1SUNBZ0lDQWdJQ0I5WEc1Y2JpQWdJQ0FnSUNBZ1kyOXRjRzl1Wlc1MExuUnZaMmRzWlNncFhHNGdJQ0FnSUNCOVhHNGdJQ0FnZlZ4dUlDQjlLVnh1WEc0Z0lISmxkSFZ5YmlCRWNtOXdaRzkzYmx4dWZTa29LVnh1WEc1bGVIQnZjblFnWkdWbVlYVnNkQ0JFY205d1pHOTNibHh1SWl3aUx5b3FYRzRnS2lBdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExWeHVJQ29nVEdsalpXNXpaV1FnZFc1a1pYSWdUVWxVSUNob2RIUndjem92TDJkcGRHaDFZaTVqYjIwdmNYVmhjbXN0WkdWMkwxQm9iMjV2YmkxR2NtRnRaWGR2Y21zdllteHZZaTl0WVhOMFpYSXZURWxEUlU1VFJTbGNiaUFxSUMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdFhHNGdLaTljYm1sdGNHOXlkQ0JFY205d1pHOTNiaUJtY205dElDY3VMMmx1WkdWNEoxeHVhVzF3YjNKMElIc2dabWx1WkZSaGNtZGxkRUo1UTJ4aGMzTWdmU0JtY205dElDY3VMaTh1TGk5amIyMXRiMjR2ZFhScGJITW5YRzVwYlhCdmNuUWdleUJuWlhSQmRIUnlhV0oxZEdWelEyOXVabWxuSUgwZ1puSnZiU0FuTGk0dlkyOXRjRzl1Wlc1MFRXRnVZV2RsY2lkY2JseHVZMjl1YzNRZ1JISnZjR1J2ZDI1VFpXRnlZMmdnUFNBb0tDa2dQVDRnZTF4dVhHNGdJQzhxS2x4dUlDQWdLaUF0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzFjYmlBZ0lDb2dRMjl1YzNSaGJuUnpYRzRnSUNBcUlDMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExWeHVJQ0FnS2k5Y2JseHVJQ0JqYjI1emRDQk9RVTFGSUQwZ1JISnZjR1J2ZDI0dWFXUmxiblJwWm1sbGNpZ3BYRzRnSUdOdmJuTjBJRVJGUmtGVlRGUmZVRkpQVUVWU1ZFbEZVeUE5SUh0Y2JpQWdJQ0JsYkdWdFpXNTBPaUJ1ZFd4c0xGeHVJQ0FnSUdSbFptRjFiSFE2SUhSeWRXVXNYRzRnSUNBZ2MyVmhjbU5vT2lCMGNuVmxMRnh1SUNCOVhHNGdJR052Ym5OMElFUkJWRUZmUVZSVVVsTmZVRkpQVUVWU1ZFbEZVeUE5SUZ0Y2JpQWdJQ0FuWkdWbVlYVnNkQ2NzWEc0Z0lDQWdKM05sWVhKamFDY3NYRzRnSUYxY2JseHVJQ0F2S2lwY2JpQWdJQ29nTFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0WEc0Z0lDQXFJRU5zWVhOeklFUmxabWx1YVhScGIyNWNiaUFnSUNvZ0xTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdFhHNGdJQ0FxTDF4dVhHNGdJR05zWVhOeklFUnliM0JrYjNkdVUyVmhjbU5vSUdWNGRHVnVaSE1nUkhKdmNHUnZkMjRnZTF4dVhHNGdJQ0FnWTI5dWMzUnlkV04wYjNJb2IzQjBhVzl1Y3lBOUlIdDlLU0I3WEc0Z0lDQWdJQ0J6ZFhCbGNpaHZjSFJwYjI1ektWeHVYRzRnSUNBZ0lDQjBhR2x6TG1acGJIUmxja2wwWlcxelNHRnVaR3hsY2lBOUlDaGxkbVZ1ZENrZ1BUNGdlMXh1SUNBZ0lDQWdJQ0JqYjI1emRDQnpaV0Z5WTJnZ1BTQmxkbVZ1ZEM1MFlYSm5aWFF1ZG1Gc2RXVmNibHh1SUNBZ0lDQWdJQ0JwWmlBb2MyVmhjbU5vSUQwOVBTQW5KeWtnZTF4dUlDQWdJQ0FnSUNBZ0lIUm9hWE11YzJodmQwbDBaVzF6S0NsY2JpQWdJQ0FnSUNBZ0lDQnlaWFIxY201Y2JpQWdJQ0FnSUNBZ2ZWeHVYRzVjYmlBZ0lDQWdJQ0FnZEdocGN5NW5aWFJKZEdWdGN5Z3BMbVp2Y2tWaFkyZ29LR2wwWlcwcElEMCtJSHRjYmlBZ0lDQWdJQ0FnSUNCamIyNXpkQ0JtYmlBOUlIUjVjR1Z2WmlCMGFHbHpMbTl3ZEdsdmJuTXVabWxzZEdWeVNYUmxiU0E5UFQwZ0oyWjFibU4wYVc5dUp5QS9JSFJvYVhNdWIzQjBhVzl1Y3k1bWFXeDBaWEpKZEdWdElEb2dkR2hwY3k1bWFXeDBaWEpKZEdWdFhHNWNiaUFnSUNBZ0lDQWdJQ0JwWmlBb1ptNG9jMlZoY21Ob0xDQnBkR1Z0S1NrZ2UxeHVJQ0FnSUNBZ0lDQWdJQ0FnYVhSbGJTNWxiR1Z0Wlc1MExuTjBlV3hsTG1ScGMzQnNZWGtnUFNBbllteHZZMnNuWEc0Z0lDQWdJQ0FnSUNBZ2ZTQmxiSE5sSUh0Y2JpQWdJQ0FnSUNBZ0lDQWdJR2wwWlcwdVpXeGxiV1Z1ZEM1emRIbHNaUzVrYVhOd2JHRjVJRDBnSjI1dmJtVW5YRzRnSUNBZ0lDQWdJQ0FnZlZ4dUlDQWdJQ0FnSUNCOUtWeHVJQ0FnSUNBZ2ZWeHVYRzRnSUNBZ0lDQjBhR2x6TG1kbGRGTmxZWEpqYUVsdWNIVjBLQ2t1WVdSa1JYWmxiblJNYVhOMFpXNWxjaWduYTJWNWRYQW5MQ0IwYUdsekxtWnBiSFJsY2tsMFpXMXpTR0Z1Wkd4bGNpbGNiaUFnSUNCOVhHNWNiaUFnSUNCbWFXeDBaWEpKZEdWdEtITmxZWEpqYUNBOUlDY25MQ0JwZEdWdElEMGdlMzBwSUh0Y2JpQWdJQ0FnSUdsbUlDaHBkR1Z0TG5aaGJIVmxMbWx1WkdWNFQyWW9jMlZoY21Ob0tTQStJQzB4WEc0Z0lDQWdJQ0FnSUh4OElHbDBaVzB1ZEdWNGRDNXBibVJsZUU5bUtITmxZWEpqYUNrZ1BpQXRNU2tnZTF4dUlDQWdJQ0FnSUNCeVpYUjFjbTRnZEhKMVpWeHVJQ0FnSUNBZ2ZWeHVYRzRnSUNBZ0lDQnlaWFIxY200Z1ptRnNjMlZjYmlBZ0lDQjlYRzVjYmlBZ0lDQm5aWFJKZEdWdGN5Z3BJSHRjYmlBZ0lDQWdJR3hsZENCcGRHVnRjeUE5SUVGeWNtRjVMbVp5YjIwb2RHaHBjeTV2Y0hScGIyNXpMbVZzWlcxbGJuUXVjWFZsY25sVFpXeGxZM1J2Y2tGc2JDZ25MbWwwWlcwbktTQjhmQ0JiWFNsY2JpQWdJQ0FnSUdsMFpXMXpJRDBnYVhSbGJYTXViV0Z3S0NocGRHVnRLU0E5UGlCN1hHNGdJQ0FnSUNBZ0lHTnZibk4wSUdsdVptOGdQU0IwYUdsekxtZGxkRWwwWlcxRVlYUmhLR2wwWlcwcFhHNGdJQ0FnSUNBZ0lISmxkSFZ5YmlCN0lIUmxlSFE2SUdsdVptOHVkR1Y0ZEN3Z2RtRnNkV1U2SUdsdVptOHVkbUZzZFdVc0lHVnNaVzFsYm5RNklHbDBaVzBnZlZ4dUlDQWdJQ0FnZlNsY2JseHVJQ0FnSUNBZ2NtVjBkWEp1SUdsMFpXMXpYRzRnSUNBZ2ZWeHVYRzRnSUNBZ2MyaHZkMGwwWlcxektDa2dlMXh1SUNBZ0lDQWdkR2hwY3k1blpYUkpkR1Z0Y3lncExtWnZja1ZoWTJnb0tHbDBaVzBwSUQwK0lIdGNiaUFnSUNBZ0lDQWdZMjl1YzNRZ2FTQTlJR2wwWlcxY2JpQWdJQ0FnSUNBZ2FTNWxiR1Z0Wlc1MExuTjBlV3hsTG1ScGMzQnNZWGtnUFNBbllteHZZMnNuWEc0Z0lDQWdJQ0I5S1Z4dUlDQWdJSDFjYmx4dUlDQWdJR2RsZEZObFlYSmphRWx1Y0hWMEtDa2dlMXh1SUNBZ0lDQWdjbVYwZFhKdUlIUm9hWE11YjNCMGFXOXVjeTVsYkdWdFpXNTBMbkYxWlhKNVUyVnNaV04wYjNJb0p5NWtjbTl3Wkc5M2JpMXRaVzUxSUdsdWNIVjBKeWxjYmlBZ0lDQjlYRzVjYmlBZ0lDQm9hV1JsS0NrZ2UxeHVJQ0FnSUNBZ2FXWWdLSE4xY0dWeUxtaHBaR1VvS1NrZ2UxeHVJQ0FnSUNBZ0lDQXZMeUJ5WlhObGRDQjBhR1VnZG1Gc2RXVmNiaUFnSUNBZ0lDQWdkR2hwY3k1blpYUlRaV0Z5WTJoSmJuQjFkQ2dwTG5aaGJIVmxJRDBnSnlkY2JpQWdJQ0FnSUNBZ0x5OGdjMmh2ZHlCaGJHd2dhWFJsYlhOY2JpQWdJQ0FnSUNBZ2RHaHBjeTV6YUc5M1NYUmxiWE1vS1Z4dUlDQWdJQ0FnZlZ4dUlDQWdJSDFjYmx4dUlDQWdJSE4wWVhScFl5QmZSRTlOU1c1MFpYSm1ZV05sS0c5d2RHbHZibk1wSUh0Y2JpQWdJQ0FnSUhKbGRIVnliaUJ1WlhjZ1JISnZjR1J2ZDI1VFpXRnlZMmdvYjNCMGFXOXVjeWxjYmlBZ0lDQjlYRzRnSUgxY2JseHVJQ0F2S2lwY2JpQWdJQ29nTFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0WEc0Z0lDQXFJRVJQVFNCQmNHa2dhVzF3YkdWdFpXNTBZWFJwYjI1Y2JpQWdJQ29nTFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0WEc0Z0lDQXFMMXh1SUNCamIyNXpkQ0JqYjIxd2IyNWxiblJ6SUQwZ1cxMWNiaUFnWTI5dWMzUWdaSEp2Y0dSdmQyNXpJRDBnWkc5amRXMWxiblF1Y1hWbGNubFRaV3hsWTNSdmNrRnNiQ2hnTGlSN1RrRk5SWDFnS1Z4dVhHNGdJR2xtSUNoa2NtOXdaRzkzYm5NcElIdGNiaUFnSUNCQmNuSmhlUzVtY205dEtHUnliM0JrYjNkdWN5a3VabTl5UldGamFDZ29aV3hsYldWdWRDa2dQVDRnZTF4dUlDQWdJQ0FnWTI5dWMzUWdZMjl1Wm1sbklEMGdaMlYwUVhSMGNtbGlkWFJsYzBOdmJtWnBaeWhsYkdWdFpXNTBMQ0JFUlVaQlZVeFVYMUJTVDFCRlVsUkpSVk1zSUVSQlZFRmZRVlJVVWxOZlVGSlBVRVZTVkVsRlV5bGNiaUFnSUNBZ0lHTnZibVpwWnk1bGJHVnRaVzUwSUQwZ1pXeGxiV1Z1ZEZ4dVhHNGdJQ0FnSUNCcFppQW9ZMjl1Wm1sbkxuTmxZWEpqYUNrZ2UxeHVJQ0FnSUNBZ0lDQXZMeUJ6WldGeVkyaGNiaUFnSUNBZ0lDQWdZMjl0Y0c5dVpXNTBjeTV3ZFhOb0tHNWxkeUJFY205d1pHOTNibE5sWVhKamFDaGpiMjVtYVdjcEtWeHVJQ0FnSUNBZ2ZWeHVJQ0FnSUgwcFhHNGdJSDFjYmx4dUlDQnBaaUFvWkhKdmNHUnZkMjV6S1NCN1hHNGdJQ0FnWkc5amRXMWxiblF1WVdSa1JYWmxiblJNYVhOMFpXNWxjaWduWTJ4cFkyc25MQ0FvWlhabGJuUXBJRDArSUh0Y2JpQWdJQ0FnSUdOdmJuTjBJR1J5YjNCa2IzZHVUV1Z1ZFNBOUlHWnBibVJVWVhKblpYUkNlVU5zWVhOektHVjJaVzUwTG5SaGNtZGxkQ3dnSjJSeWIzQmtiM2R1TFcxbGJuVW5LVnh1SUNBZ0lDQWdhV1lnS0dSeWIzQmtiM2R1VFdWdWRTa2dlMXh1SUNBZ0lDQWdJQ0J5WlhSMWNtNWNiaUFnSUNBZ0lIMWNibHh1SUNBZ0lDQWdZMjl1YzNRZ1pISnZjR1J2ZDI0Z1BTQm1hVzVrVkdGeVoyVjBRbmxEYkdGemN5aGxkbVZ1ZEM1MFlYSm5aWFFzSUNka2NtOXdaRzkzYmljcFhHNWNiaUFnSUNBZ0lHbG1JQ2hrY205d1pHOTNiaWtnZTF4dUlDQWdJQ0FnSUNCamIyNXpkQ0JrWVhSaFZHOW5aMnhsUVhSMGNpQTlJR1J5YjNCa2IzZHVMbWRsZEVGMGRISnBZblYwWlNnblpHRjBZUzEwYjJkbmJHVW5LVnh1SUNBZ0lDQWdJQ0JwWmlBb1pHRjBZVlJ2WjJkc1pVRjBkSElnSmlZZ1pHRjBZVlJ2WjJkc1pVRjBkSElnUFQwOUlFNUJUVVVnSmlZZ1pISnZjR1J2ZDI0cElIdGNiaUFnSUNBZ0lDQWdJQ0JqYjI1emRDQmpiMjF3YjI1bGJuUWdQU0JqYjIxd2IyNWxiblJ6TG1acGJtUW9ZeUE5UGlCakxtZGxkRVZzWlcxbGJuUW9LU0E5UFQwZ1pISnZjR1J2ZDI0cFhHNWNiaUFnSUNBZ0lDQWdJQ0JwWmlBb0lXTnZiWEJ2Ym1WdWRDa2dlMXh1SUNBZ0lDQWdJQ0FnSUNBZ2NtVjBkWEp1WEc0Z0lDQWdJQ0FnSUNBZ2ZWeHVYRzRnSUNBZ0lDQWdJQ0FnWTI5dGNHOXVaVzUwTG5SdloyZHNaU2dwWEc0Z0lDQWdJQ0FnSUgxY2JpQWdJQ0FnSUgxY2JpQWdJQ0I5S1Z4dUlDQjlYRzVjYmlBZ2NtVjBkWEp1SUVSeWIzQmtiM2R1VTJWaGNtTm9YRzU5S1NncFhHNWNibVY0Y0c5eWRDQmtaV1poZFd4MElFUnliM0JrYjNkdVUyVmhjbU5vWEc0aUxDSXZLaXBjYmlBcUlDMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRYRzRnS2lCTWFXTmxibk5sWkNCMWJtUmxjaUJOU1ZRZ0tHaDBkSEJ6T2k4dloybDBhSFZpTG1OdmJTOXhkV0Z5YXkxa1pYWXZVR2h2Ym05dUxVWnlZVzFsZDI5eWF5OWliRzlpTDIxaGMzUmxjaTlNU1VORlRsTkZLVnh1SUNvZ0xTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMWNiaUFxTDF4dWFXMXdiM0owSUVOdmJYQnZibVZ1ZENCbWNtOXRJQ2N1TGk5amIyMXdiMjVsYm5RblhHNWNibU52Ym5OMElFeHZZV1JsY2lBOUlDZ29LU0E5UGlCN1hHNGdJQzhxS2x4dUlDQWdLaUF0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzFjYmlBZ0lDb2dRMjl1YzNSaGJuUnpYRzRnSUNBcUlDMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExWeHVJQ0FnS2k5Y2JseHVJQ0JqYjI1emRDQk9RVTFGSUQwZ0oyeHZZV1JsY2lkY2JpQWdZMjl1YzNRZ1ZrVlNVMGxQVGlBOUlDY3lMakF1TUNkY2JpQWdZMjl1YzNRZ1JFVkdRVlZNVkY5UVVrOVFSVkpVU1VWVElEMGdlMXh1SUNBZ0lHVnNaVzFsYm5RNklHNTFiR3dzWEc0Z0lDQWdZMjlzYjNJNklHNTFiR3dzWEc0Z0lDQWdjMmw2WlRvZ2JuVnNiQ3hjYmlBZ2ZWeHVJQ0JqYjI1emRDQkVRVlJCWDBGVVZGSlRYMUJTVDFCRlVsUkpSVk1nUFNCYlhWeHVYRzRnSUM4cUtseHVJQ0FnS2lBdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMxY2JpQWdJQ29nUTJ4aGMzTWdSR1ZtYVc1cGRHbHZibHh1SUNBZ0tpQXRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMWNiaUFnSUNvdlhHNWNiaUFnWTJ4aGMzTWdURzloWkdWeUlHVjRkR1Z1WkhNZ1EyOXRjRzl1Wlc1MElIdGNibHh1SUNBZ0lHTnZibk4wY25WamRHOXlLRzl3ZEdsdmJuTWdQU0I3ZlNrZ2UxeHVJQ0FnSUNBZ2MzVndaWElvVGtGTlJTd2dWa1ZTVTBsUFRpd2dSRVZHUVZWTVZGOVFVazlRUlZKVVNVVlRMQ0J2Y0hScGIyNXpMQ0JFUVZSQlgwRlVWRkpUWDFCU1QxQkZVbFJKUlZNc0lHWmhiSE5sTENCbVlXeHpaU2xjYmx4dUlDQWdJQ0FnTHk4Z2MyVjBJR052Ykc5eVhHNGdJQ0FnSUNCamIyNXpkQ0JzYjJGa1pYSlRjR2x1Ym1WeUlEMGdkR2hwY3k1blpYUlRjR2x1Ym1WeUtDbGNiaUFnSUNBZ0lHbG1JQ2gwZVhCbGIyWWdkR2hwY3k1dmNIUnBiMjV6TG1OdmJHOXlJRDA5UFNBbmMzUnlhVzVuSjF4dUlDQWdJQ0FnSUNBbUppQWhiRzloWkdWeVUzQnBibTVsY2k1amJHRnpjMHhwYzNRdVkyOXVkR0ZwYm5Nb1lHTnZiRzl5TFNSN2RHaHBjeTV2Y0hScGIyNXpMbU52Ykc5eWZXQXBLU0I3WEc0Z0lDQWdJQ0FnSUd4dllXUmxjbE53YVc1dVpYSXVZMnhoYzNOTWFYTjBMbUZrWkNoZ1kyOXNiM0l0Skh0MGFHbHpMbTl3ZEdsdmJuTXVZMjlzYjNKOVlDbGNiaUFnSUNBZ0lIMWNibHh1SUNBZ0lDQWdkR2hwY3k1amRYTjBiMjFUYVhwbElEMGdkR2hwY3k1dmNIUnBiMjV6TG5OcGVtVWdJVDA5SUc1MWJHeGNiaUFnSUNCOVhHNWNiaUFnSUNCblpYUkRiR2xsYm5SVGFYcGxLQ2tnZTF4dUlDQWdJQ0FnYVdZZ0tDRjBhR2x6TG1OMWMzUnZiVk5wZW1VcElIdGNiaUFnSUNBZ0lDQWdZMjl1YzNRZ2MybDZaU0E5SUhSb2FYTXViM0IwYVc5dWN5NWxiR1Z0Wlc1MExtZGxkRUp2ZFc1a2FXNW5RMnhwWlc1MFVtVmpkQ2dwSUNBZ0lDQWdJQ0JjYmlBZ0lDQWdJQ0FnY21WMGRYSnVJSE5wZW1VdWFHVnBaMmgwWEc0Z0lDQWdJQ0I5WEc1Y2JpQWdJQ0FnSUhKbGRIVnliaUIwYUdsekxtOXdkR2x2Ym5NdWMybDZaVnh1SUNBZ0lIMWNibHh1SUNBZ0lHZGxkRk53YVc1dVpYSW9LU0I3WEc0Z0lDQWdJQ0J5WlhSMWNtNGdkR2hwY3k1dmNIUnBiMjV6TG1Wc1pXMWxiblF1Y1hWbGNubFRaV3hsWTNSdmNpZ25MbXh2WVdSbGNpMXpjR2x1Ym1WeUp5bGNiaUFnSUNCOVhHNWNiaUFnSUNCemFHOTNLQ2tnZTF4dUlDQWdJQ0FnYVdZZ0tIUm9hWE11YjNCMGFXOXVjeTVsYkdWdFpXNTBMbU5zWVhOelRHbHpkQzVqYjI1MFlXbHVjeWduYUdsa1pTY3BLU0I3WEc0Z0lDQWdJQ0FnSUhSb2FYTXViM0IwYVc5dWN5NWxiR1Z0Wlc1MExtTnNZWE56VEdsemRDNXlaVzF2ZG1Vb0oyaHBaR1VuS1Z4dUlDQWdJQ0FnZlZ4dVhHNGdJQ0FnSUNCamIyNXpkQ0J6YVhwbElEMGdkR2hwY3k1blpYUkRiR2xsYm5SVGFYcGxLQ2xjYmlBZ0lDQWdJSFJvYVhNdWIzQjBhVzl1Y3k1emFYcGxJRDBnYzJsNlpWeHVYRzRnSUNBZ0lDQnBaaUFvZEdocGN5NWpkWE4wYjIxVGFYcGxLU0I3WEc0Z0lDQWdJQ0FnSUhSb2FYTXViM0IwYVc5dWN5NWxiR1Z0Wlc1MExuTjBlV3hsTG5kcFpIUm9JRDBnWUNSN2RHaHBjeTV2Y0hScGIyNXpMbk5wZW1WOWNIaGdYRzRnSUNBZ0lDQWdJSFJvYVhNdWIzQjBhVzl1Y3k1bGJHVnRaVzUwTG5OMGVXeGxMbWhsYVdkb2RDQTlJR0FrZTNSb2FYTXViM0IwYVc5dWN5NXphWHBsZlhCNFlGeHVYRzRnSUNBZ0lDQWdJR052Ym5OMElHeHZZV1JsY2xOd2FXNXVaWElnUFNCMGFHbHpMbWRsZEZOd2FXNXVaWElvS1Z4dUlDQWdJQ0FnSUNCc2IyRmtaWEpUY0dsdWJtVnlMbk4wZVd4bExuZHBaSFJvSUQwZ1lDUjdkR2hwY3k1dmNIUnBiMjV6TG5OcGVtVjljSGhnWEc0Z0lDQWdJQ0FnSUd4dllXUmxjbE53YVc1dVpYSXVjM1I1YkdVdWFHVnBaMmgwSUQwZ1lDUjdkR2hwY3k1dmNIUnBiMjV6TG5OcGVtVjljSGhnWEc0Z0lDQWdJQ0I5WEc1Y2JpQWdJQ0FnSUhKbGRIVnliaUIwY25WbFhHNGdJQ0FnZlZ4dVhHNGdJQ0FnWVc1cGJXRjBaU2h6ZEdGeWRFRnVhVzFoZEdsdmJpQTlJSFJ5ZFdVcElIdGNiaUFnSUNBZ0lHbG1JQ2h6ZEdGeWRFRnVhVzFoZEdsdmJpa2dlMXh1SUNBZ0lDQWdJQ0IwYUdsekxuTm9iM2NvS1Z4dUlDQWdJQ0FnZlNCbGJITmxJSHRjYmlBZ0lDQWdJQ0FnZEdocGN5NW9hV1JsS0NsY2JpQWdJQ0FnSUgxY2JseHVJQ0FnSUNBZ1kyOXVjM1FnYkc5aFpHVnlVM0JwYm01bGNpQTlJSFJvYVhNdVoyVjBVM0JwYm01bGNpZ3BYRzVjYmlBZ0lDQWdJR2xtSUNoemRHRnlkRUZ1YVcxaGRHbHZiaUFtSmx4dUlDQWdJQ0FnSUNBaGJHOWhaR1Z5VTNCcGJtNWxjaTVqYkdGemMweHBjM1F1WTI5dWRHRnBibk1vSjJ4dllXUmxjaTF6Y0dsdWJtVnlMV0Z1YVcxaGRHVmtKeWtwSUh0Y2JpQWdJQ0FnSUNBZ2JHOWhaR1Z5VTNCcGJtNWxjaTVqYkdGemMweHBjM1F1WVdSa0tDZHNiMkZrWlhJdGMzQnBibTVsY2kxaGJtbHRZWFJsWkNjcFhHNGdJQ0FnSUNBZ0lISmxkSFZ5YmlCMGNuVmxYRzRnSUNBZ0lDQjlYRzVjYmlBZ0lDQWdJR2xtSUNnaGMzUmhjblJCYm1sdFlYUnBiMjRnSmlaY2JpQWdJQ0FnSUNBZ2JHOWhaR1Z5VTNCcGJtNWxjaTVqYkdGemMweHBjM1F1WTI5dWRHRnBibk1vSjJ4dllXUmxjaTF6Y0dsdWJtVnlMV0Z1YVcxaGRHVmtKeWtwSUh0Y2JpQWdJQ0FnSUNBZ2JHOWhaR1Z5VTNCcGJtNWxjaTVqYkdGemMweHBjM1F1Y21WdGIzWmxLQ2RzYjJGa1pYSXRjM0JwYm01bGNpMWhibWx0WVhSbFpDY3BYRzRnSUNBZ0lDQjlYRzVjYmlBZ0lDQWdJSEpsZEhWeWJpQjBjblZsWEc0Z0lDQWdmVnh1WEc0Z0lDQWdhR2xrWlNncElIdGNiaUFnSUNBZ0lHbG1JQ2doZEdocGN5NXZjSFJwYjI1ekxtVnNaVzFsYm5RdVkyeGhjM05NYVhOMExtTnZiblJoYVc1ektDZG9hV1JsSnlrcElIdGNiaUFnSUNBZ0lDQWdkR2hwY3k1dmNIUnBiMjV6TG1Wc1pXMWxiblF1WTJ4aGMzTk1hWE4wTG1Ga1pDZ25hR2xrWlNjcFhHNGdJQ0FnSUNCOVhHNWNiaUFnSUNBZ0lISmxkSFZ5YmlCMGNuVmxYRzRnSUNBZ2ZWeHVYRzRnSUNBZ2MzUmhkR2xqSUdsa1pXNTBhV1pwWlhJb0tTQjdYRzRnSUNBZ0lDQnlaWFIxY200Z1RrRk5SVnh1SUNBZ0lIMWNibHh1SUNBZ0lITjBZWFJwWXlCZlJFOU5TVzUwWlhKbVlXTmxLRzl3ZEdsdmJuTXBJSHRjYmlBZ0lDQWdJSEpsZEhWeWJpQnpkWEJsY2k1ZlJFOU5TVzUwWlhKbVlXTmxLRXh2WVdSbGNpd2diM0IwYVc5dWN5bGNiaUFnSUNCOVhHNGdJSDFjYmx4dUlDQnlaWFIxY200Z1RHOWhaR1Z5WEc1OUtTZ3BYRzVjYm1WNGNHOXlkQ0JrWldaaGRXeDBJRXh2WVdSbGNseHVJaXdpTHlvcVhHNHFJQzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0WEc0cUlFeHBZMlZ1YzJWa0lIVnVaR1Z5SUUxSlZDQW9hSFIwY0hNNkx5OW5hWFJvZFdJdVkyOXRMM0YxWVhKckxXUmxkaTlRYUc5dWIyNHRSbkpoYldWM2IzSnJMMkpzYjJJdmJXRnpkR1Z5TDB4SlEwVk9VMFVwWEc0cUlDMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRYRzRxTDF4dWFXMXdiM0owSUVWMlpXNTBJR1p5YjIwZ0p5NHVMeTR1TDJOdmJXMXZiaTlsZG1WdWRITW5YRzVwYlhCdmNuUWdRMjl0Y0c5dVpXNTBJR1p5YjIwZ0p5NHVMMk52YlhCdmJtVnVkQ2RjYmx4dVkyOXVjM1FnVG05MGFXWnBZMkYwYVc5dUlEMGdLQ2dwSUQwK0lIdGNiaUFnTHlvcVhHNGdJQ0FxSUMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFZ4dUlDQXFJRU52Ym5OMFlXNTBjMXh1SUNBcUlDMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExWeHVJQ0FxTDF4dVhHNGdJR052Ym5OMElFNUJUVVVnUFNBbmJtOTBhV1pwWTJGMGFXOXVKMXh1SUNCamIyNXpkQ0JXUlZKVFNVOU9JRDBnSnpJdU1DNHdKMXh1SUNCamIyNXpkQ0JFUlVaQlZVeFVYMUJTVDFCRlVsUkpSVk1nUFNCN1hHNGdJQ0FnWld4bGJXVnVkRG9nYm5Wc2JDeGNiaUFnSUNCdFpYTnpZV2RsT2lBbkp5eGNiaUFnSUNCemFHOTNRblYwZEc5dU9pQjBjblZsTEZ4dUlDQWdJSFJwYldWdmRYUTZJRzUxYkd3c1hHNGdJQ0FnWW1GamEyZHliM1Z1WkRvZ0ozQnlhVzFoY25rbkxGeHVJQ0I5WEc0Z0lHTnZibk4wSUVSQlZFRmZRVlJVVWxOZlVGSlBVRVZTVkVsRlV5QTlJRnRjYmlBZ0lDQW5kR2x0Wlc5MWRDY3NYRzRnSUYxY2JseHVJQ0F2S2lwY2JpQWdJQ29nTFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0WEc0Z0lDQXFJRU5zWVhOeklFUmxabWx1YVhScGIyNWNiaUFnSUNvZ0xTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdFhHNGdJQ0FxTDF4dVhHNGdJR05zWVhOeklFNXZkR2xtYVdOaGRHbHZiaUJsZUhSbGJtUnpJRU52YlhCdmJtVnVkQ0I3WEc1Y2JpQWdJQ0JqYjI1emRISjFZM1J2Y2lodmNIUnBiMjV6SUQwZ2UzMHBJSHRjYmlBZ0lDQWdJSE4xY0dWeUtFNUJUVVVzSUZaRlVsTkpUMDRzSUVSRlJrRlZURlJmVUZKUFVFVlNWRWxGVXl3Z2IzQjBhVzl1Y3l3Z1JFRlVRVjlCVkZSU1UxOVFVazlRUlZKVVNVVlRMQ0IwY25WbExDQm1ZV3h6WlNsY2JseHVJQ0FnSUNBZ2RHaHBjeTUwWlcxd2JHRjBaU0E5SUNjbklDdGNiaUFnSUNBZ0lDYzhaR2wySUdOc1lYTnpQVndpYm05MGFXWnBZMkYwYVc5dVhDSStKeUFyWEc0Z0lDQWdJQ0FnSUNjOFpHbDJJR05zWVhOelBWd2libTkwYVdacFkyRjBhVzl1TFdsdWJtVnlYQ0krSnlBclhHNGdJQ0FnSUNBZ0lDQWdKenhrYVhZZ1kyeGhjM005WENKdFpYTnpZV2RsWENJK1BDOWthWFkrSnlBclhHNGdJQ0FnSUNBZ0lDQWdKenhpZFhSMGIyNGdkSGx3WlQxY0ltSjFkSFJ2Ymx3aUlHTnNZWE56UFZ3aVkyeHZjMlZjSWlCa1lYUmhMV1JwYzIxcGMzTTlYQ0p1YjNScFptbGpZWFJwYjI1Y0lpQmhjbWxoTFd4aFltVnNQVndpUTJ4dmMyVmNJajRuSUN0Y2JpQWdJQ0FnSUNBZ0lDQWdJQ2M4YzNCaGJpQmhjbWxoTFdocFpHUmxiajFjSW5SeWRXVmNJajRtZEdsdFpYTTdQQzl6Y0dGdVBpY2dLMXh1SUNBZ0lDQWdJQ0FnSUNjOEwySjFkSFJ2Ymo0bklDdGNiaUFnSUNBZ0lDQWdKend2WkdsMlBpY2dLMXh1SUNBZ0lDQWdKend2WkdsMlBpZGNibHh1SUNBZ0lDQWdhV1lnS0hSb2FYTXVaSGx1WVcxcFkwVnNaVzFsYm5RcElIdGNiaUFnSUNBZ0lDQWdkR2hwY3k1aWRXbHNaQ2dwWEc0Z0lDQWdJQ0I5WEc1Y2JpQWdJQ0FnSUhSb2FYTXVkR2x0Wlc5MWRFTmhiR3hpWVdOcklEMGdiblZzYkZ4dUlDQWdJSDFjYmx4dUlDQWdJR0oxYVd4a0tDa2dlMXh1SUNBZ0lDQWdZMjl1YzNRZ1luVnBiR1JsY2lBOUlHUnZZM1Z0Wlc1MExtTnlaV0YwWlVWc1pXMWxiblFvSjJScGRpY3BYRzVjYmlBZ0lDQWdJR0oxYVd4a1pYSXVhVzV1WlhKSVZFMU1JRDBnZEdocGN5NTBaVzF3YkdGMFpWeHVYRzRnSUNBZ0lDQjBhR2x6TG05d2RHbHZibk11Wld4bGJXVnVkQ0E5SUdKMWFXeGtaWEl1Wm1seWMzUkRhR2xzWkZ4dVhHNGdJQ0FnSUNBdkx5QjBaWGgwSUcxbGMzTmhaMlZjYmlBZ0lDQWdJSFJvYVhNdWIzQjBhVzl1Y3k1bGJHVnRaVzUwTG5GMVpYSjVVMlZzWldOMGIzSW9KeTV0WlhOellXZGxKeWt1YVc1dVpYSklWRTFNSUQwZ2RHaHBjeTV2Y0hScGIyNXpMbTFsYzNOaFoyVmNibHh1SUNBZ0lDQWdhV1lnS0NGMGFHbHpMbTl3ZEdsdmJuTXVjMmh2ZDBKMWRIUnZiaWtnZTF4dUlDQWdJQ0FnSUNCMGFHbHpMbTl3ZEdsdmJuTXVaV3hsYldWdWRDNXhkV1Z5ZVZObGJHVmpkRzl5S0NkaWRYUjBiMjRuS1M1emRIbHNaUzVrYVhOd2JHRjVJRDBnSjI1dmJtVW5YRzRnSUNBZ0lDQjlYRzVjYmlBZ0lDQWdJR1J2WTNWdFpXNTBMbUp2WkhrdVlYQndaVzVrUTJocGJHUW9kR2hwY3k1dmNIUnBiMjV6TG1Wc1pXMWxiblFwWEc1Y2JpQWdJQ0FnSUhSb2FYTXVjMlYwUVhSMGNtbGlkWFJsY3lncFhHNGdJQ0FnZlZ4dVhHNGdJQ0FnYzJodmR5Z3BJSHRjYmlBZ0lDQWdJR2xtSUNoMGFHbHpMbTl3ZEdsdmJuTXVaV3hsYldWdWRDQTlQVDBnYm5Wc2JDa2dlMXh1SUNBZ0lDQWdJQ0F2THlCaWRXbHNaQ0JoYm1RZ2FXNXpaWEowSUdFZ2JtVjNJRVJQVFNCbGJHVnRaVzUwWEc0Z0lDQWdJQ0FnSUhSb2FYTXVZblZwYkdRb0tWeHVJQ0FnSUNBZ2ZWeHVYRzRnSUNBZ0lDQnBaaUFvZEdocGN5NXZjSFJwYjI1ekxtVnNaVzFsYm5RdVkyeGhjM05NYVhOMExtTnZiblJoYVc1ektDZHphRzkzSnlrcElIdGNiaUFnSUNBZ0lDQWdjbVYwZFhKdUlHWmhiSE5sWEc0Z0lDQWdJQ0I5WEc1Y2JpQWdJQ0FnSUM4dklISmxjMlYwSUdOdmJHOXlYRzRnSUNBZ0lDQnBaaUFvZEdocGN5NXZjSFJwYjI1ekxtSmhZMnRuY205MWJtUXBJSHRjYmlBZ0lDQWdJQ0FnZEdocGN5NXZjSFJwYjI1ekxtVnNaVzFsYm5RdWNtVnRiM1psUVhSMGNtbGlkWFJsS0NkamJHRnpjeWNwWEc0Z0lDQWdJQ0FnSUhSb2FYTXViM0IwYVc5dWN5NWxiR1Z0Wlc1MExuTmxkRUYwZEhKcFluVjBaU2duWTJ4aGMzTW5MQ0FuYm05MGFXWnBZMkYwYVc5dUp5bGNibHh1SUNBZ0lDQWdJQ0IwYUdsekxtOXdkR2x2Ym5NdVpXeGxiV1Z1ZEM1amJHRnpjMHhwYzNRdVlXUmtLR0JpWnkwa2UzUm9hWE11YjNCMGFXOXVjeTVpWVdOclozSnZkVzVrZldBcFhHNGdJQ0FnSUNBZ0lIUm9hWE11YjNCMGFXOXVjeTVsYkdWdFpXNTBMbkYxWlhKNVUyVnNaV04wYjNJb0oySjFkSFJ2YmljcExtTnNZWE56VEdsemRDNWhaR1FvWUdKMGJpMGtlM1JvYVhNdWIzQjBhVzl1Y3k1aVlXTnJaM0p2ZFc1a2ZXQXBYRzRnSUNBZ0lDQjlYRzVjYmlBZ0lDQWdJR2xtSUNoMGFHbHpMbTl3ZEdsdmJuTXVjMmh2ZDBKMWRIUnZiaWtnZTF4dUlDQWdJQ0FnSUNBdkx5QmhkSFJoWTJnZ2RHaGxJR0oxZEhSdmJpQm9ZVzVrYkdWeVhHNGdJQ0FnSUNBZ0lHTnZibk4wSUdKMWRIUnZia1ZzWlcxbGJuUWdQU0IwYUdsekxtOXdkR2x2Ym5NdVpXeGxiV1Z1ZEM1eGRXVnllVk5sYkdWamRHOXlLQ2RpZFhSMGIyNG5LVnh1SUNBZ0lDQWdJQ0IwYUdsekxuSmxaMmx6ZEdWeVJXeGxiV1Z1ZENoN0lIUmhjbWRsZERvZ1luVjBkRzl1Uld4bGJXVnVkQ3dnWlhabGJuUTZJQ2RqYkdsamF5Y2dmU2xjYmlBZ0lDQWdJSDFjYmx4dUlDQWdJQ0FnYzJWMFZHbHRaVzkxZENnb0tTQTlQaUI3WEc0Z0lDQWdJQ0FnSUhSb2FYTXViM0IwYVc5dWN5NWxiR1Z0Wlc1MExtTnNZWE56VEdsemRDNWhaR1FvSjNOb2IzY25LVnh1WEc0Z0lDQWdJQ0FnSUM4dklITmxkQ0J3YjNOcGRHbHZibHh1SUNBZ0lDQWdJQ0JqYjI1emRDQmhZM1JwZG1WT2IzUnBabWxqWVhScGIyNXpJRDBnWkc5amRXMWxiblF1Y1hWbGNubFRaV3hsWTNSdmNrRnNiQ2duTG01dmRHbG1hV05oZEdsdmJpNXphRzkzSnlrZ2ZId2dXMTFjYmlBZ0lDQWdJQ0FnYkdWMElIQjFjMmhFYVhOMFlXNWpaU0E5SURCY2JpQWdJQ0FnSUNBZ1lXTjBhWFpsVG05MGFXWnBZMkYwYVc5dWN5NW1iM0pGWVdOb0tDaHViM1JwWm1sallYUnBiMjRwSUQwK0lIdGNiaUFnSUNBZ0lDQWdJQ0JwWmlBb2RHaHBjeTV2Y0hScGIyNXpMbVZzWlcxbGJuUWdJVDA5SUc1dmRHbG1hV05oZEdsdmJpa2dlMXh1SUNBZ0lDQWdJQ0FnSUNBZ1kyOXVjM1FnYzNSNWJHVWdQU0JuWlhSRGIyMXdkWFJsWkZOMGVXeGxLRzV2ZEdsbWFXTmhkR2x2YmlsY2JpQWdJQ0FnSUNBZ0lDQWdJSEIxYzJoRWFYTjBZVzVqWlNBclBTQnViM1JwWm1sallYUnBiMjR1YjJabWMyVjBTR1ZwWjJoMElDc2djR0Z5YzJWSmJuUW9jM1I1YkdVdWJXRnlaMmx1UW05MGRHOXRMQ0F4TUNsY2JpQWdJQ0FnSUNBZ0lDQjlYRzRnSUNBZ0lDQWdJSDBwWEc1Y2JpQWdJQ0FnSUNBZ2RHaHBjeTV2Y0hScGIyNXpMbVZzWlcxbGJuUXVjM1I1YkdVdWRISmhibk5tYjNKdElEMGdZSFJ5WVc1emJHRjBaVmtvSkh0d2RYTm9SR2x6ZEdGdVkyVjljSGdwWUZ4dVhHNGdJQ0FnSUNBZ0lIUm9hWE11ZEhKcFoyZGxja1YyWlc1MEtFVjJaVzUwTGxOSVQxY3BYRzVjYmlBZ0lDQWdJQ0FnWTI5dWMzUWdiMjVUYUc5M2JpQTlJQ2dwSUQwK0lIdGNiaUFnSUNBZ0lDQWdJQ0IwYUdsekxuUnlhV2RuWlhKRmRtVnVkQ2hGZG1WdWRDNVRTRTlYVGlsY2JpQWdJQ0FnSUNBZ0lDQjBhR2x6TG05d2RHbHZibk11Wld4bGJXVnVkQzV5WlcxdmRtVkZkbVZ1ZEV4cGMzUmxibVZ5S0VWMlpXNTBMbFJTUVU1VFNWUkpUMDVmUlU1RUxDQnZibE5vYjNkdUtWeHVJQ0FnSUNBZ0lDQjlYRzVjYmlBZ0lDQWdJQ0FnZEdocGN5NXZjSFJwYjI1ekxtVnNaVzFsYm5RdVlXUmtSWFpsYm5STWFYTjBaVzVsY2loRmRtVnVkQzVVVWtGT1UwbFVTVTlPWDBWT1JDd2diMjVUYUc5M2JpbGNibHh1SUNBZ0lDQWdmU3dnTVNsY2JseHVJQ0FnSUNBZ2FXWWdLRTUxYldKbGNpNXBjMGx1ZEdWblpYSW9kR2hwY3k1dmNIUnBiMjV6TG5ScGJXVnZkWFFwSUNZbUlIUm9hWE11YjNCMGFXOXVjeTUwYVcxbGIzVjBJRDRnTUNrZ2UxeHVJQ0FnSUNBZ0lDQXZMeUJwWmlCMGFHVnlaU0JwY3lCaElIUnBiV1Z2ZFhRc0lHRjFkRzhnYUdsa1pTQjBhR1VnYm05MGFXWnBZMkYwYVc5dVhHNGdJQ0FnSUNBZ0lIUm9hWE11ZEdsdFpXOTFkRU5oYkd4aVlXTnJJRDBnYzJWMFZHbHRaVzkxZENnb0tTQTlQaUI3WEc0Z0lDQWdJQ0FnSUNBZ2RHaHBjeTVvYVdSbEtDbGNiaUFnSUNBZ0lDQWdmU3dnZEdocGN5NXZjSFJwYjI1ekxuUnBiV1Z2ZFhRZ0t5QXhLVnh1SUNBZ0lDQWdmVnh1WEc0Z0lDQWdJQ0J5WlhSMWNtNGdkSEoxWlZ4dUlDQWdJSDFjYmx4dUlDQWdJR2hwWkdVb0tTQjdYRzRnSUNBZ0lDQXZLbHh1SUNBZ0lDQWdJQ29nY0hKbGRtVnVkQ0IwYnlCamJHOXpaU0JoSUc1dmRHbG1hV05oZEdsdmJpQjNhWFJvSUdFZ2RHbHRaVzkxZEZ4dUlDQWdJQ0FnSUNvZ2FXWWdkR2hsSUhWelpYSWdhR0Z6SUdGc2NtVmhaSGtnWTJ4cFkydGxaQ0J2YmlCMGFHVWdZblYwZEc5dVhHNGdJQ0FnSUNBZ0tpOWNiaUFnSUNBZ0lHbG1JQ2gwYUdsekxuUnBiV1Z2ZFhSRFlXeHNZbUZqYXlrZ2UxeHVJQ0FnSUNBZ0lDQmpiR1ZoY2xScGJXVnZkWFFvZEdocGN5NTBhVzFsYjNWMFEyRnNiR0poWTJzcFhHNGdJQ0FnSUNBZ0lIUm9hWE11ZEdsdFpXOTFkRU5oYkd4aVlXTnJJRDBnYm5Wc2JGeHVJQ0FnSUNBZ2ZWeHVYRzRnSUNBZ0lDQnBaaUFvSVhSb2FYTXViM0IwYVc5dWN5NWxiR1Z0Wlc1MExtTnNZWE56VEdsemRDNWpiMjUwWVdsdWN5Z25jMmh2ZHljcEtTQjdYRzRnSUNBZ0lDQWdJSEpsZEhWeWJpQm1ZV3h6WlZ4dUlDQWdJQ0FnZlZ4dVhHNGdJQ0FnSUNCMGFHbHpMblJ5YVdkblpYSkZkbVZ1ZENoRmRtVnVkQzVJU1VSRktWeHVYRzRnSUNBZ0lDQnBaaUFvZEdocGN5NXZjSFJwYjI1ekxuTm9iM2RDZFhSMGIyNHBJSHRjYmlBZ0lDQWdJQ0FnWTI5dWMzUWdZblYwZEc5dVJXeGxiV1Z1ZENBOUlIUm9hWE11YjNCMGFXOXVjeTVsYkdWdFpXNTBMbkYxWlhKNVUyVnNaV04wYjNJb0oySjFkSFJ2YmljcFhHNGdJQ0FnSUNBZ0lIUm9hWE11ZFc1eVpXZHBjM1JsY2tWc1pXMWxiblFvZXlCMFlYSm5aWFE2SUdKMWRIUnZia1ZzWlcxbGJuUXNJR1YyWlc1ME9pQW5ZMnhwWTJzbklIMHBYRzRnSUNBZ0lDQjlYRzVjYmlBZ0lDQWdJSFJvYVhNdWIzQjBhVzl1Y3k1bGJHVnRaVzUwTG1Oc1lYTnpUR2x6ZEM1eVpXMXZkbVVvSjNOb2IzY25LVnh1SUNBZ0lDQWdkR2hwY3k1dmNIUnBiMjV6TG1Wc1pXMWxiblF1WTJ4aGMzTk1hWE4wTG1Ga1pDZ25hR2xrWlNjcFhHNWNiaUFnSUNBZ0lHTnZibk4wSUc5dVNHbGtaR1Z1SUQwZ0tDa2dQVDRnZTF4dUlDQWdJQ0FnSUNCMGFHbHpMbTl3ZEdsdmJuTXVaV3hsYldWdWRDNXlaVzF2ZG1WRmRtVnVkRXhwYzNSbGJtVnlLRVYyWlc1MExsUlNRVTVUU1ZSSlQwNWZSVTVFTENCdmJraHBaR1JsYmlsY2JpQWdJQ0FnSUNBZ2RHaHBjeTV2Y0hScGIyNXpMbVZzWlcxbGJuUXVZMnhoYzNOTWFYTjBMbkpsYlc5MlpTZ25hR2xrWlNjcFhHNWNiaUFnSUNBZ0lDQWdkR2hwY3k1MGNtbG5aMlZ5UlhabGJuUW9SWFpsYm5RdVNFbEVSRVZPS1Z4dVhHNGdJQ0FnSUNBZ0lHbG1JQ2gwYUdsekxtUjVibUZ0YVdORmJHVnRaVzUwS1NCN1hHNGdJQ0FnSUNBZ0lDQWdaRzlqZFcxbGJuUXVZbTlrZVM1eVpXMXZkbVZEYUdsc1pDaDBhR2x6TG05d2RHbHZibk11Wld4bGJXVnVkQ2xjYmlBZ0lDQWdJQ0FnSUNCMGFHbHpMbTl3ZEdsdmJuTXVaV3hsYldWdWRDQTlJRzUxYkd4Y2JpQWdJQ0FnSUNBZ2ZWeHVJQ0FnSUNBZ2ZWeHVYRzRnSUNBZ0lDQjBhR2x6TG05d2RHbHZibk11Wld4bGJXVnVkQzVoWkdSRmRtVnVkRXhwYzNSbGJtVnlLRVYyWlc1MExsUlNRVTVUU1ZSSlQwNWZSVTVFTENCdmJraHBaR1JsYmlsY2JseHVJQ0FnSUNBZ2NtVjBkWEp1SUhSeWRXVmNiaUFnSUNCOVhHNWNiaUFnSUNCdmJrVnNaVzFsYm5SRmRtVnVkQ2dwSUh0Y2JpQWdJQ0FnSUhSb2FYTXVhR2xrWlNncFhHNGdJQ0FnZlZ4dVhHNGdJQ0FnYzNSaGRHbGpJR2xrWlc1MGFXWnBaWElvS1NCN1hHNGdJQ0FnSUNCeVpYUjFjbTRnVGtGTlJWeHVJQ0FnSUgxY2JseHVJQ0FnSUhOMFlYUnBZeUJmUkU5TlNXNTBaWEptWVdObEtHOXdkR2x2Ym5NcElIdGNiaUFnSUNBZ0lISmxkSFZ5YmlCemRYQmxjaTVmUkU5TlNXNTBaWEptWVdObEtFNXZkR2xtYVdOaGRHbHZiaXdnYjNCMGFXOXVjeWxjYmlBZ0lDQjlYRzRnSUgxY2JseHVJQ0J5WlhSMWNtNGdUbTkwYVdacFkyRjBhVzl1WEc1OUtTZ3BYRzVjYm1WNGNHOXlkQ0JrWldaaGRXeDBJRTV2ZEdsbWFXTmhkR2x2Ymx4dUlpd2lMeW9xWEc0Z0tpQXRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMVnh1SUNvZ1RHbGpaVzV6WldRZ2RXNWtaWElnVFVsVUlDaG9kSFJ3Y3pvdkwyZHBkR2gxWWk1amIyMHZjWFZoY21zdFpHVjJMMUJvYjI1dmJpMUdjbUZ0WlhkdmNtc3ZZbXh2WWk5dFlYTjBaWEl2VEVsRFJVNVRSU2xjYmlBcUlDMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRYRzRnS2k5Y2JtbHRjRzl5ZENCRmRtVnVkQ0JtY205dElDY3VMaTh1TGk5amIyMXRiMjR2WlhabGJuUnpKMXh1YVcxd2IzSjBJRU52YlhCdmJtVnVkQ0JtY205dElDY3VMaTlqYjIxd2IyNWxiblFuWEc1cGJYQnZjblFnZXlCblpYUkJkSFJ5YVdKMWRHVnpRMjl1Wm1sbklIMGdabkp2YlNBbkxpNHZZMjl0Y0c5dVpXNTBUV0Z1WVdkbGNpZGNibWx0Y0c5eWRDQjdJR1pwYm1SVVlYSm5aWFJDZVVGMGRISWdmU0JtY205dElDY3VMaTh1TGk5amIyMXRiMjR2ZFhScGJITW5YRzVjYm1OdmJuTjBJRTltWmtOaGJuWmhjeUE5SUNnb0tTQTlQaUI3WEc0Z0lDOHFLbHh1SUNBZ0tpQXRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMWNiaUFnSUNvZ1EyOXVjM1JoYm5SelhHNGdJQ0FxSUMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFZ4dUlDQWdLaTljYmx4dUlDQmpiMjV6ZENCT1FVMUZJRDBnSjI5bVppMWpZVzUyWVhNblhHNGdJR052Ym5OMElGWkZVbE5KVDA0Z1BTQW5NaTR3TGpBblhHNGdJR052Ym5OMElFSkJRMHRFVWs5UVgxTkZURVZEVkU5U0lEMGdKMjltWmkxallXNTJZWE10WW1GamEyUnliM0FuWEc0Z0lHTnZibk4wSUVSRlJrRlZURlJmVUZKUFVFVlNWRWxGVXlBOUlIdGNiaUFnSUNCbGJHVnRaVzUwT2lCdWRXeHNMRnh1SUNBZ0lHRnphV1JsT2lCN1hHNGdJQ0FnSUNCdFpEb2dabUZzYzJVc1hHNGdJQ0FnSUNCc1p6b2dabUZzYzJVc1hHNGdJQ0FnSUNCNGJEb2dabUZzYzJVc1hHNGdJQ0FnZlN4Y2JpQWdmVnh1SUNCamIyNXpkQ0JFUVZSQlgwRlVWRkpUWDFCU1QxQkZVbFJKUlZNZ1BTQmJYRzRnSUNBZ0oyRnphV1JsSnl4Y2JpQWdYVnh1WEc0Z0lDOHFLbHh1SUNBZ0tpQXRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMWNiaUFnSUNvZ1EyeGhjM01nUkdWbWFXNXBkR2x2Ymx4dUlDQWdLaUF0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzFjYmlBZ0lDb3ZYRzVjYmlBZ1kyeGhjM01nVDJabVEyRnVkbUZ6SUdWNGRHVnVaSE1nUTI5dGNHOXVaVzUwSUh0Y2JseHVJQ0FnSUdOdmJuTjBjblZqZEc5eUtHOXdkR2x2Ym5NZ1BTQjdmU2tnZTF4dUlDQWdJQ0FnYzNWd1pYSW9Ua0ZOUlN3Z1ZrVlNVMGxQVGl3Z1JFVkdRVlZNVkY5UVVrOVFSVkpVU1VWVExDQnZjSFJwYjI1ekxDQkVRVlJCWDBGVVZGSlRYMUJTVDFCRlVsUkpSVk1zSUdaaGJITmxMQ0IwY25WbEtWeHVYRzRnSUNBZ0lDQjBhR2x6TG5WelpVSmhZMnRrY205d0lEMGdkSEoxWlZ4dUlDQWdJQ0FnZEdocGN5NWpkWEp5Wlc1MFYybGtkR2dnUFNCdWRXeHNYRzRnSUNBZ0lDQjBhR2x6TG1GdWFXMWhkR1VnUFNCMGNuVmxYRzVjYmlBZ0lDQWdJSFJvYVhNdVpHbHlaV04wYVc5dWN5QTlJRnNuYkdWbWRDY3NJQ2R5YVdkb2RDZGRYRzVjYmlBZ0lDQWdJR052Ym5OMElITnRJRDBnZXlCdVlXMWxPaUFuYzIwbkxDQnRaV1JwWVRvZ2QybHVaRzkzTG0xaGRHTm9UV1ZrYVdFb0p5aHRhVzR0ZDJsa2RHZzZJREZ3ZUNrbktTQjlYRzRnSUNBZ0lDQmpiMjV6ZENCdFpDQTlJSHNnYm1GdFpUb2dKMjFrSnl3Z2JXVmthV0U2SUhkcGJtUnZkeTV0WVhSamFFMWxaR2xoS0Njb2JXbHVMWGRwWkhSb09pQTNOamh3ZUNrbktTQjlYRzRnSUNBZ0lDQmpiMjV6ZENCc1p5QTlJSHNnYm1GdFpUb2dKMnhuSnl3Z2JXVmthV0U2SUhkcGJtUnZkeTV0WVhSamFFMWxaR2xoS0Njb2JXbHVMWGRwWkhSb09pQTVPVEp3ZUNrbktTQjlYRzRnSUNBZ0lDQmpiMjV6ZENCNGJDQTlJSHNnYm1GdFpUb2dKM2hzSnl3Z2JXVmthV0U2SUhkcGJtUnZkeTV0WVhSamFFMWxaR2xoS0Njb2JXbHVMWGRwWkhSb09pQXhNakF3Y0hncEp5a2dmVnh1WEc0Z0lDQWdJQ0IwYUdsekxuTnBlbVZ6SUQwZ1czTnRMQ0J0WkN3Z2JHY3NJSGhzWFM1eVpYWmxjbk5sS0NsY2JseHVJQ0FnSUNBZ2RHaHBjeTVqYUdWamEwUnBjbVZqZEdsdmJpZ3BYRzRnSUNBZ0lDQjBhR2x6TG1Ob1pXTnJWMmxrZEdnb0tWeHVYRzRnSUNBZ0lDQjNhVzVrYjNjdVlXUmtSWFpsYm5STWFYTjBaVzVsY2lnbmNtVnphWHBsSnl3Z0tDa2dQVDRnZEdocGN5NWphR1ZqYTFkcFpIUm9LQ2tzSUdaaGJITmxLU0FnSUNBZ0lGeHVJQ0FnSUgxY2JseHVJQ0FnSUdOb1pXTnJSR2x5WldOMGFXOXVLQ2tnZTF4dUlDQWdJQ0FnZEdocGN5NWthWEpsWTNScGIyNXpMbVYyWlhKNUtDaGthWEpsWTNScGIyNHBJRDArSUh0Y2JpQWdJQ0FnSUNBZ2FXWWdLSFJvYVhNdWIzQjBhVzl1Y3k1bGJHVnRaVzUwTG1Oc1lYTnpUR2x6ZEM1amIyNTBZV2x1Y3loZ2IyWm1MV05oYm5aaGN5MGtlMlJwY21WamRHbHZibjFnS1NrZ2UxeHVJQ0FnSUNBZ0lDQWdJSFJvYVhNdVpHbHlaV04wYVc5dUlEMGdaR2x5WldOMGFXOXVYRzRnSUNBZ0lDQWdJQ0FnY21WMGRYSnVJR1poYkhObFhHNGdJQ0FnSUNBZ0lIMWNiaUFnSUNBZ0lDQWdjbVYwZFhKdUlIUnlkV1ZjYmlBZ0lDQWdJSDBwWEc0Z0lDQWdmVnh1WEc0Z0lDQWdZMmhsWTJ0WGFXUjBhQ2dwSUh0Y2JpQWdJQ0FnSUdsbUlDZ2hLQ2R0WVhSamFFMWxaR2xoSnlCcGJpQjNhVzVrYjNjcEtTQjdYRzRnSUNBZ0lDQWdJSEpsZEhWeWJseHVJQ0FnSUNBZ2ZWeHVYRzRnSUNBZ0lDQjBhR2x6TG5OcGVtVnpMbVYyWlhKNUtDaHphWHBsS1NBOVBpQjdYRzRnSUNBZ0lDQWdJR052Ym5OMElHMWhkR05vSUQwZ2MybDZaUzV0WldScFlTNXRaV1JwWVM1dFlYUmphQ2d2VzJFdGVsMC9MWGRwWkhSb09seGNjejhvV3pBdE9WMHJLUzhwWEc1Y2JpQWdJQ0FnSUNBZ2FXWWdLRzFoZEdOb0tTQjdYRzRnSUNBZ0lDQWdJQ0FnYVdZZ0tITnBlbVV1YldWa2FXRXViV0YwWTJobGN5a2dlMXh1SUNBZ0lDQWdJQ0FnSUNBZ2FXWWdLSFJvYVhNdVkzVnljbVZ1ZEZkcFpIUm9JQ0U5UFNCemFYcGxMbTVoYldVcElIdGNiaUFnSUNBZ0lDQWdJQ0FnSUNBZ2RHaHBjeTV6WlhSQmMybGtaU2h6YVhwbExtNWhiV1VwWEc0Z0lDQWdJQ0FnSUNBZ0lDQjlYRzRnSUNBZ0lDQWdJQ0FnSUNCMGFHbHpMbU4xY25KbGJuUlhhV1IwYUNBOUlITnBlbVV1Ym1GdFpWeHVJQ0FnSUNBZ0lDQWdJQ0FnY21WMGRYSnVJR1poYkhObFhHNGdJQ0FnSUNBZ0lDQWdmVnh1SUNBZ0lDQWdJQ0I5WEc1Y2JpQWdJQ0FnSUNBZ2NtVjBkWEp1SUhSeWRXVmNiaUFnSUNBZ0lIMHBYRzRnSUNBZ2ZWeHVYRzRnSUNBZ2NISmxkbVZ1ZEVOc2IzTmhZbXhsS0NrZ2UxeHVJQ0FnSUNBZ2NtVjBkWEp1SUhOMWNHVnlMbkJ5WlhabGJuUkRiRzl6WVdKc1pTZ3BJSHg4SUhSb2FYTXViM0IwYVc5dWN5NWhjMmxrWlZ0MGFHbHpMbU4xY25KbGJuUlhhV1IwYUYwZ1BUMDlJSFJ5ZFdWY2JpQWdJQ0I5WEc1Y2JpQWdJQ0J6WlhSQmMybGtaU2h1WVcxbEtTQjdYRzRnSUNBZ0lDQmpiMjV6ZENCamIyNTBaVzUwSUQwZ1pHOWpkVzFsYm5RdVltOWtlVnh1WEc0Z0lDQWdJQ0JwWmlBb2RHaHBjeTV2Y0hScGIyNXpMbUZ6YVdSbFcyNWhiV1ZkSUQwOVBTQjBjblZsS1NCN1hHNGdJQ0FnSUNBZ0lHbG1JQ2doWTI5dWRHVnVkQzVqYkdGemMweHBjM1F1WTI5dWRHRnBibk1vWUc5bVppMWpZVzUyWVhNdFlYTnBaR1V0Skh0MGFHbHpMbVJwY21WamRHbHZibjFnS1NrZ2UxeHVJQ0FnSUNBZ0lDQWdJR052Ym5SbGJuUXVZMnhoYzNOTWFYTjBMbUZrWkNoZ2IyWm1MV05oYm5aaGN5MWhjMmxrWlMwa2UzUm9hWE11WkdseVpXTjBhVzl1ZldBcFhHNGdJQ0FnSUNBZ0lIMWNibHh1SUNBZ0lDQWdJQ0IwYUdsekxuVnpaVUpoWTJ0a2NtOXdJRDBnWm1Gc2MyVmNibHh1SUNBZ0lDQWdJQ0F2THlCaGRtOXBaQ0JoYm1sdFlYUnBiMjRnWW5rZ2MyVjBkR2x1WnlCaGJtbHRZWFJsSUhSdklHWmhiSE5sWEc0Z0lDQWdJQ0FnSUhSb2FYTXVZVzVwYldGMFpTQTlJR1poYkhObFhHNGdJQ0FnSUNBZ0lIUm9hWE11YzJodmR5Z3BYRzRnSUNBZ0lDQWdJQzh2SUhKbGJXOTJaU0J3Y21WMmFXOTFjeUJpWVdOclpISnZjRnh1SUNBZ0lDQWdJQ0IwYUdsekxuSmxiVzkyWlVKaFkydGtjbTl3S0NsY2JpQWdJQ0FnSUgwZ1pXeHpaU0I3WEc0Z0lDQWdJQ0FnSUdsbUlDaGpiMjUwWlc1MExtTnNZWE56VEdsemRDNWpiMjUwWVdsdWN5aGdiMlptTFdOaGJuWmhjeTFoYzJsa1pTMGtlM1JvYVhNdVpHbHlaV04wYVc5dWZXQXBLU0I3WEc0Z0lDQWdJQ0FnSUNBZ1kyOXVkR1Z1ZEM1amJHRnpjMHhwYzNRdWNtVnRiM1psS0dCdlptWXRZMkZ1ZG1GekxXRnphV1JsTFNSN2RHaHBjeTVrYVhKbFkzUnBiMjU5WUNsY2JpQWdJQ0FnSUNBZ2ZWeHVYRzRnSUNBZ0lDQWdJSFJvYVhNdWFHbGtaU2dwWEc0Z0lDQWdJQ0FnSUhSb2FYTXVkWE5sUW1GamEyUnliM0FnUFNCMGNuVmxYRzRnSUNBZ0lDQWdJSFJvYVhNdVlXNXBiV0YwWlNBOUlIUnlkV1ZjYmlBZ0lDQWdJSDFjYmlBZ0lDQjlYRzVjYmlBZ0lDQnZia1ZzWlcxbGJuUkZkbVZ1ZENobGRtVnVkQ2tnZTF4dUlDQWdJQ0FnYVdZZ0tHVjJaVzUwTG5SNWNHVWdQVDA5SUNkclpYbDFjQ2NnSmlZZ1pYWmxiblF1YTJWNVEyOWtaU0FoUFQwZ01qY2dKaVlnWlhabGJuUXVhMlY1UTI5a1pTQWhQVDBnTVRNcElIdGNiaUFnSUNBZ0lDQWdjbVYwZFhKdVhHNGdJQ0FnSUNCOVhHNWNiaUFnSUNBZ0lDOHZJR2hwWkdVZ2RHaGxJRzltWmkxallXNTJZWE5jYmlBZ0lDQWdJSFJvYVhNdWFHbGtaU2dwWEc0Z0lDQWdmVnh1WEc0Z0lDQWdjMmh2ZHlncElIdGNiaUFnSUNBZ0lHbG1JQ2gwYUdsekxtOXdkR2x2Ym5NdVpXeGxiV1Z1ZEM1amJHRnpjMHhwYzNRdVkyOXVkR0ZwYm5Nb0ozTm9iM2NuS1NrZ2UxeHVJQ0FnSUNBZ0lDQnlaWFIxY200Z1ptRnNjMlZjYmlBZ0lDQWdJSDFjYmx4dUlDQWdJQ0FnTHk4Z1lXUmtJR0VnZEdsdFpXOTFkQ0J6YnlCMGFHRjBJSFJvWlNCRFUxTWdZVzVwYldGMGFXOXVJSGR2Y210elhHNGdJQ0FnSUNCelpYUlVhVzFsYjNWMEtDZ3BJRDArSUh0Y2JpQWdJQ0FnSUNBZ2RHaHBjeTUwY21sbloyVnlSWFpsYm5Rb1JYWmxiblF1VTBoUFZ5bGNibHh1SUNBZ0lDQWdJQ0JqYjI1emRDQnZibE5vYjNkdUlEMGdLQ2tnUFQ0Z2UxeHVJQ0FnSUNBZ0lDQWdJSFJvYVhNdWRISnBaMmRsY2tWMlpXNTBLRVYyWlc1MExsTklUMWRPS1Z4dVhHNGdJQ0FnSUNBZ0lDQWdhV1lnS0hSb2FYTXVZVzVwYldGMFpTa2dlMXh1SUNBZ0lDQWdJQ0FnSUNBZ2RHaHBjeTV2Y0hScGIyNXpMbVZzWlcxbGJuUXVjbVZ0YjNabFJYWmxiblJNYVhOMFpXNWxjaWhGZG1WdWRDNVVVa0ZPVTBsVVNVOU9YMFZPUkN3Z2IyNVRhRzkzYmlsY2JpQWdJQ0FnSUNBZ0lDQWdJSFJvYVhNdWIzQjBhVzl1Y3k1bGJHVnRaVzUwTG1Oc1lYTnpUR2x6ZEM1eVpXMXZkbVVvSjJGdWFXMWhkR1VuS1Z4dUlDQWdJQ0FnSUNBZ0lIMWNiaUFnSUNBZ0lDQWdmVnh1WEc0Z0lDQWdJQ0FnSUdsbUlDaDBhR2x6TG5WelpVSmhZMnRrY205d0tTQjdYRzRnSUNBZ0lDQWdJQ0FnZEdocGN5NWpjbVZoZEdWQ1lXTnJaSEp2Y0NncFhHNGdJQ0FnSUNBZ0lIMWNibHh1WEc0Z0lDQWdJQ0FnSUdsbUlDaDBhR2x6TG1GdWFXMWhkR1VwSUh0Y2JpQWdJQ0FnSUNBZ0lDQjBhR2x6TG05d2RHbHZibk11Wld4bGJXVnVkQzVoWkdSRmRtVnVkRXhwYzNSbGJtVnlLRVYyWlc1MExsUlNRVTVUU1ZSSlQwNWZSVTVFTENCdmJsTm9iM2R1S1NBZ0lDQWdJQ0FnWEc0Z0lDQWdJQ0FnSUNBZ2RHaHBjeTV2Y0hScGIyNXpMbVZzWlcxbGJuUXVZMnhoYzNOTWFYTjBMbUZrWkNnbllXNXBiV0YwWlNjcFhHNGdJQ0FnSUNBZ0lIMGdaV3h6WlNCN1hHNGdJQ0FnSUNBZ0lDQWdMeThnWkdseVpXTjBiSGtnZEhKcFoyZGxjaUIwYUdVZ2IyNVRhRzkzYmx4dUlDQWdJQ0FnSUNBZ0lHOXVVMmh2ZDI0b0tWeHVJQ0FnSUNBZ0lDQjlYRzVjYmlBZ0lDQWdJQ0FnZEdocGN5NXZjSFJwYjI1ekxtVnNaVzFsYm5RdVkyeGhjM05NYVhOMExtRmtaQ2duYzJodmR5Y3BJQ0FnSUNBZ0lDQmNibHh1SUNBZ0lDQWdJQ0F2THlCaGRIUmhZMmdnWlhabGJuUmNiaUFnSUNBZ0lDQWdkR2hwY3k1aGRIUmhZMmhGZG1WdWRITW9LVnh1SUNBZ0lDQWdmU3dnTVNsY2JseHVJQ0FnSUNBZ2NtVjBkWEp1SUhSeWRXVmNiaUFnSUNCOVhHNWNiaUFnSUNCb2FXUmxLQ2tnZTF4dUlDQWdJQ0FnYVdZZ0tDRjBhR2x6TG05d2RHbHZibk11Wld4bGJXVnVkQzVqYkdGemMweHBjM1F1WTI5dWRHRnBibk1vSjNOb2IzY25LU2tnZTF4dUlDQWdJQ0FnSUNCeVpYUjFjbTRnWm1Gc2MyVmNiaUFnSUNBZ0lIMWNibHh1SUNBZ0lDQWdkR2hwY3k1MGNtbG5aMlZ5UlhabGJuUW9SWFpsYm5RdVNFbEVSU2xjYmx4dUlDQWdJQ0FnZEdocGN5NWtaWFJoWTJoRmRtVnVkSE1vS1Z4dVhHNGdJQ0FnSUNCcFppQW9kR2hwY3k1aGJtbHRZWFJsS1NCN1hHNGdJQ0FnSUNBZ0lIUm9hWE11YjNCMGFXOXVjeTVsYkdWdFpXNTBMbU5zWVhOelRHbHpkQzVoWkdRb0oyRnVhVzFoZEdVbktWeHVJQ0FnSUNBZ2ZWeHVYRzRnSUNBZ0lDQjBhR2x6TG05d2RHbHZibk11Wld4bGJXVnVkQzVqYkdGemMweHBjM1F1Y21WdGIzWmxLQ2R6YUc5M0p5bGNibHh1SUNBZ0lDQWdhV1lnS0hSb2FYTXVkWE5sUW1GamEyUnliM0FwSUh0Y2JpQWdJQ0FnSUNBZ1kyOXVjM1FnWW1GamEyUnliM0FnUFNCMGFHbHpMbWRsZEVKaFkydGtjbTl3S0NsY2JseHVJQ0FnSUNBZ0lDQmpiMjV6ZENCdmJraHBaR1JsYmlBOUlDZ3BJRDArSUh0Y2JpQWdJQ0FnSUNBZ0lDQnBaaUFvZEdocGN5NWhibWx0WVhSbEtTQjdYRzRnSUNBZ0lDQWdJQ0FnSUNCMGFHbHpMbTl3ZEdsdmJuTXVaV3hsYldWdWRDNWpiR0Z6YzB4cGMzUXVjbVZ0YjNabEtDZGhibWx0WVhSbEp5bGNiaUFnSUNBZ0lDQWdJQ0I5WEc1Y2JpQWdJQ0FnSUNBZ0lDQmlZV05yWkhKdmNDNXlaVzF2ZG1WRmRtVnVkRXhwYzNSbGJtVnlLRVYyWlc1MExsUlNRVTVUU1ZSSlQwNWZSVTVFTENCdmJraHBaR1JsYmlsY2JpQWdJQ0FnSUNBZ0lDQjBhR2x6TG5SeWFXZG5aWEpGZG1WdWRDaEZkbVZ1ZEM1SVNVUkVSVTRwSUNBZ0lDQWdJQ0JjYmlBZ0lDQWdJQ0FnSUNCMGFHbHpMbkpsYlc5MlpVSmhZMnRrY205d0tDbGNiaUFnSUNBZ0lDQWdmVnh1WEc0Z0lDQWdJQ0FnSUdKaFkydGtjbTl3TG1Ga1pFVjJaVzUwVEdsemRHVnVaWElvUlhabGJuUXVWRkpCVGxOSlZFbFBUbDlGVGtRc0lHOXVTR2xrWkdWdUtWeHVJQ0FnSUNBZ0lDQmlZV05yWkhKdmNDNWpiR0Z6YzB4cGMzUXVZV1JrS0NkbVlXUmxiM1YwSnlsY2JpQWdJQ0FnSUgxY2JseHVJQ0FnSUNBZ2NtVjBkWEp1SUhSeWRXVmNiaUFnSUNCOVhHNWNiaUFnSUNCamNtVmhkR1ZDWVdOclpISnZjQ2dwSUh0Y2JpQWdJQ0FnSUdOdmJuTjBJR0poWTJ0a2NtOXdJRDBnWkc5amRXMWxiblF1WTNKbFlYUmxSV3hsYldWdWRDZ25aR2wySnlsY2JpQWdJQ0FnSUdKaFkydGtjbTl3TG5ObGRFRjBkSEpwWW5WMFpTZ25aR0YwWVMxcFpDY3NJSFJvYVhNdWFXUXBYRzRnSUNBZ0lDQmlZV05yWkhKdmNDNWpiR0Z6YzB4cGMzUXVZV1JrS0VKQlEwdEVVazlRWDFORlRFVkRWRTlTS1Z4dVhHNGdJQ0FnSUNCa2IyTjFiV1Z1ZEM1aWIyUjVMbUZ3Y0dWdVpFTm9hV3hrS0dKaFkydGtjbTl3S1Z4dUlDQWdJSDFjYmx4dUlDQWdJR2RsZEVKaFkydGtjbTl3S0NrZ2UxeHVJQ0FnSUNBZ2NtVjBkWEp1SUdSdlkzVnRaVzUwTG5GMVpYSjVVMlZzWldOMGIzSW9ZQzRrZTBKQlEwdEVVazlRWDFORlRFVkRWRTlTZlZ0a1lYUmhMV2xrUFZ3aUpIdDBhR2x6TG1sa2ZWd2lYV0FwWEc0Z0lDQWdmVnh1WEc0Z0lDQWdjbVZ0YjNabFFtRmphMlJ5YjNBb0tTQjdYRzRnSUNBZ0lDQmpiMjV6ZENCaVlXTnJaSEp2Y0NBOUlIUm9hWE11WjJWMFFtRmphMlJ5YjNBb0tWeHVJQ0FnSUNBZ2FXWWdLR0poWTJ0a2NtOXdLU0I3WEc0Z0lDQWdJQ0FnSUdSdlkzVnRaVzUwTG1KdlpIa3VjbVZ0YjNabFEyaHBiR1FvWW1GamEyUnliM0FwWEc0Z0lDQWdJQ0I5WEc0Z0lDQWdmVnh1WEc0Z0lDQWdZWFIwWVdOb1JYWmxiblJ6S0NrZ2UxeHVJQ0FnSUNBZ1kyOXVjM1FnWkdsemJXbHpjMEoxZEhSdmJuTWdQU0IwYUdsekxtOXdkR2x2Ym5NdVpXeGxiV1Z1ZEM1eGRXVnllVk5sYkdWamRHOXlRV3hzS0NkYlpHRjBZUzFrYVhOdGFYTnpYU2NwWEc1Y2JpQWdJQ0FnSUdsbUlDaGthWE50YVhOelFuVjBkRzl1Y3lrZ2UxeHVJQ0FnSUNBZ0lDQkJjbkpoZVM1bWNtOXRLR1JwYzIxcGMzTkNkWFIwYjI1ektTNW1iM0pGWVdOb0tHSjFkSFJ2YmlBOVBpQjBhR2x6TG5KbFoybHpkR1Z5Uld4bGJXVnVkQ2g3SUhSaGNtZGxkRG9nWW5WMGRHOXVMQ0JsZG1WdWREb2dKMk5zYVdOckp5QjlLU2xjYmlBZ0lDQWdJSDFjYmx4dUlDQWdJQ0FnYVdZZ0tIUm9hWE11ZFhObFFtRmphMlJ5YjNBcElIdGNiaUFnSUNBZ0lDQWdZMjl1YzNRZ1ltRmphMlJ5YjNBZ1BTQjBhR2x6TG1kbGRFSmhZMnRrY205d0tDa2dJQ0FnSUNCY2JpQWdJQ0FnSUNBZ2RHaHBjeTV5WldkcGMzUmxja1ZzWlcxbGJuUW9leUIwWVhKblpYUTZJR0poWTJ0a2NtOXdMQ0JsZG1WdWREb2dSWFpsYm5RdVUxUkJVbFFnZlNsY2JpQWdJQ0FnSUgxY2JseHVJQ0FnSUNBZ2RHaHBjeTV5WldkcGMzUmxja1ZzWlcxbGJuUW9leUIwWVhKblpYUTZJR1J2WTNWdFpXNTBMQ0JsZG1WdWREb2dKMnRsZVhWd0p5QjlLVnh1SUNBZ0lIMWNibHh1SUNBZ0lHUmxkR0ZqYUVWMlpXNTBjeWdwSUh0Y2JpQWdJQ0FnSUdOdmJuTjBJR1JwYzIxcGMzTkNkWFIwYjI1eklEMGdkR2hwY3k1dmNIUnBiMjV6TG1Wc1pXMWxiblF1Y1hWbGNubFRaV3hsWTNSdmNrRnNiQ2duVzJSaGRHRXRaR2x6YldsemMxMG5LVnh1WEc0Z0lDQWdJQ0JwWmlBb1pHbHpiV2x6YzBKMWRIUnZibk1wSUh0Y2JpQWdJQ0FnSUNBZ1FYSnlZWGt1Wm5KdmJTaGthWE50YVhOelFuVjBkRzl1Y3lrdVptOXlSV0ZqYUNoaWRYUjBiMjRnUFQ0Z2RHaHBjeTUxYm5KbFoybHpkR1Z5Uld4bGJXVnVkQ2g3SUhSaGNtZGxkRG9nWW5WMGRHOXVMQ0JsZG1WdWREb2dKMk5zYVdOckp5QjlLU2xjYmlBZ0lDQWdJSDFjYmx4dUlDQWdJQ0FnYVdZZ0tIUm9hWE11ZFhObFFtRmphMlJ5YjNBcElIdGNiaUFnSUNBZ0lDQWdZMjl1YzNRZ1ltRmphMlJ5YjNBZ1BTQjBhR2x6TG1kbGRFSmhZMnRrY205d0tDbGNiaUFnSUNBZ0lDQWdkR2hwY3k1MWJuSmxaMmx6ZEdWeVJXeGxiV1Z1ZENoN0lIUmhjbWRsZERvZ1ltRmphMlJ5YjNBc0lHVjJaVzUwT2lCRmRtVnVkQzVUVkVGU1ZDQjlLVnh1SUNBZ0lDQWdmVnh1WEc0Z0lDQWdJQ0IwYUdsekxuVnVjbVZuYVhOMFpYSkZiR1Z0Wlc1MEtIc2dkR0Z5WjJWME9pQmtiMk4xYldWdWRDd2daWFpsYm5RNklDZHJaWGwxY0NjZ2ZTbGNiaUFnSUNCOVhHNWNiaUFnSUNCemRHRjBhV01nYVdSbGJuUnBabWxsY2lncElIdGNiaUFnSUNBZ0lISmxkSFZ5YmlCT1FVMUZYRzRnSUNBZ2ZWeHVYRzRnSUNBZ2MzUmhkR2xqSUY5RVQwMUpiblJsY21aaFkyVW9iM0IwYVc5dWN5a2dlMXh1SUNBZ0lDQWdjbVYwZFhKdUlITjFjR1Z5TGw5RVQwMUpiblJsY21aaFkyVW9UMlptUTJGdWRtRnpMQ0J2Y0hScGIyNXpLVnh1SUNBZ0lIMWNiaUFnZlZ4dVhHNGdJQzhxS2x4dUlDQWdLaUF0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzFjYmlBZ0lDb2dSRTlOSUVGd2FTQnBiWEJzWlcxbGJuUmhkR2x2Ymx4dUlDQWdLaUF0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzFjYmlBZ0lDb3ZYRzRnSUdOdmJuTjBJR052YlhCdmJtVnVkSE1nUFNCYlhWeHVYRzRnSUdOdmJuTjBJRzltWmtOaGJuWmhjeUE5SUdSdlkzVnRaVzUwTG5GMVpYSjVVMlZzWldOMGIzSkJiR3dvWUM0a2UwNUJUVVY5WUNsY2JpQWdhV1lnS0c5bVprTmhiblpoY3lrZ2UxeHVJQ0FnSUVGeWNtRjVMbVp5YjIwb2IyWm1RMkZ1ZG1GektTNW1iM0pGWVdOb0tDaGxiR1Z0Wlc1MEtTQTlQaUI3WEc0Z0lDQWdJQ0JqYjI1emRDQmpiMjVtYVdjZ1BTQm5aWFJCZEhSeWFXSjFkR1Z6UTI5dVptbG5LR1ZzWlcxbGJuUXNJRVJGUmtGVlRGUmZVRkpQVUVWU1ZFbEZVeXdnUkVGVVFWOUJWRlJTVTE5UVVrOVFSVkpVU1VWVEtWeHVJQ0FnSUNBZ1kyOXVabWxuTG1Wc1pXMWxiblFnUFNCbGJHVnRaVzUwWEc1Y2JpQWdJQ0FnSUdOdmJYQnZibVZ1ZEhNdWNIVnphQ2g3SUdWc1pXMWxiblFzSUc5bVprTmhiblpoY3pvZ2JtVjNJRTltWmtOaGJuWmhjeWhqYjI1bWFXY3BJSDBwWEc0Z0lDQWdmU2xjYmlBZ2ZWeHVYRzRnSUdSdlkzVnRaVzUwTG1Ga1pFVjJaVzUwVEdsemRHVnVaWElvSjJOc2FXTnJKeXdnS0dWMlpXNTBLU0E5UGlCN1hHNGdJQ0FnWTI5dWMzUWdkR0Z5WjJWMElEMGdabWx1WkZSaGNtZGxkRUo1UVhSMGNpaGxkbVZ1ZEM1MFlYSm5aWFFzSUNka1lYUmhMWFJ2WjJkc1pTY3BYRzRnSUNBZ2FXWWdLQ0YwWVhKblpYUXBJSHRjYmlBZ0lDQWdJSEpsZEhWeWJseHVJQ0FnSUgxY2JseHVJQ0FnSUdOdmJuTjBJR1JoZEdGVWIyZG5iR1ZCZEhSeUlEMGdkR0Z5WjJWMExtZGxkRUYwZEhKcFluVjBaU2duWkdGMFlTMTBiMmRuYkdVbktWeHVJQ0FnSUdsbUlDaGtZWFJoVkc5bloyeGxRWFIwY2lBbUppQmtZWFJoVkc5bloyeGxRWFIwY2lBOVBUMGdUa0ZOUlNrZ2UxeHVJQ0FnSUNBZ1kyOXVjM1FnYVdRZ1BTQjBZWEpuWlhRdVoyVjBRWFIwY21saWRYUmxLQ2RrWVhSaExYUmhjbWRsZENjcFhHNGdJQ0FnSUNCamIyNXpkQ0JsYkdWdFpXNTBJRDBnWkc5amRXMWxiblF1Y1hWbGNubFRaV3hsWTNSdmNpaHBaQ2xjYmx4dUlDQWdJQ0FnWTI5dWMzUWdZMjl0Y0c5dVpXNTBJRDBnWTI5dGNHOXVaVzUwY3k1bWFXNWtLR01nUFQ0Z1l5NWxiR1Z0Wlc1MElEMDlQU0JsYkdWdFpXNTBLVnh1WEc0Z0lDQWdJQ0JwWmlBb0lXTnZiWEJ2Ym1WdWRDa2dlMXh1SUNBZ0lDQWdJQ0J5WlhSMWNtNWNiaUFnSUNBZ0lIMWNibHh1SUNBZ0lDQWdkR0Z5WjJWMExtSnNkWElvS1Z4dVhHNGdJQ0FnSUNCamIyMXdiMjVsYm5RdWIyWm1RMkZ1ZG1GekxuTm9iM2NvS1Z4dUlDQWdJSDFjYmlBZ2ZTbGNibHh1SUNCeVpYUjFjbTRnVDJabVEyRnVkbUZ6WEc1OUtTZ3BYRzVjYm1WNGNHOXlkQ0JrWldaaGRXeDBJRTltWmtOaGJuWmhjMXh1SWl3aUx5b3FYRzRnS2lBdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExWeHVJQ29nVEdsalpXNXpaV1FnZFc1a1pYSWdUVWxVSUNob2RIUndjem92TDJkcGRHaDFZaTVqYjIwdmNYVmhjbXN0WkdWMkwxQm9iMjV2YmkxR2NtRnRaWGR2Y21zdllteHZZaTl0WVhOMFpYSXZURWxEUlU1VFJTbGNiaUFxSUMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdFhHNGdLaTljYm1sdGNHOXlkQ0JEYjIxd2IyNWxiblFnWm5KdmJTQW5MaTR2WTI5dGNHOXVaVzUwSjF4dWFXMXdiM0owSUVWMlpXNTBJR1p5YjIwZ0p5NHVMeTR1TDJOdmJXMXZiaTlsZG1WdWRITW5YRzVjYm1OdmJuTjBJRkJ5YjJkeVpYTnpJRDBnS0NncElEMCtJSHRjYmlBZ0x5b3FYRzRnSUNBcUlDMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExWeHVJQ0FnS2lCRGIyNXpkR0Z1ZEhOY2JpQWdJQ29nTFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0WEc0Z0lDQXFMMXh1WEc0Z0lHTnZibk4wSUU1QlRVVWdQU0FuY0hKdlozSmxjM01uWEc0Z0lHTnZibk4wSUZaRlVsTkpUMDRnUFNBbk1pNHdMakFuWEc0Z0lHTnZibk4wSUVSRlJrRlZURlJmVUZKUFVFVlNWRWxGVXlBOUlIdGNiaUFnSUNCbGJHVnRaVzUwT2lCdWRXeHNMRnh1SUNBZ0lHaGxhV2RvZERvZ05TeGNiaUFnSUNCdGFXNDZJREFzWEc0Z0lDQWdiV0Y0T2lBeE1EQXNYRzRnSUNBZ2JHRmlaV3c2SUdaaGJITmxMRnh1SUNBZ0lITjBjbWx3WldRNklHWmhiSE5sTEZ4dUlDQWdJR0poWTJ0bmNtOTFibVE2SUc1MWJHd3NYRzRnSUgxY2JpQWdZMjl1YzNRZ1JFRlVRVjlCVkZSU1UxOVFVazlRUlZKVVNVVlRJRDBnVzF4dUlDQWdJQ2RvWldsbmFIUW5MRnh1SUNBZ0lDZHRhVzRuTEZ4dUlDQWdJQ2R0WVhnbkxGeHVJQ0FnSUNkc1lXSmxiQ2NzWEc0Z0lDQWdKM04wY21sd1pXUW5MRnh1SUNBZ0lDZGlZV05yWjNKdmRXNWtKeXhjYmlBZ1hWeHVYRzRnSUM4cUtseHVJQ0FnS2lBdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMxY2JpQWdJQ29nUTJ4aGMzTWdSR1ZtYVc1cGRHbHZibHh1SUNBZ0tpQXRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMWNiaUFnSUNvdlhHNWNiaUFnWTJ4aGMzTWdVSEp2WjNKbGMzTWdaWGgwWlc1a2N5QkRiMjF3YjI1bGJuUWdlMXh1WEc0Z0lDQWdZMjl1YzNSeWRXTjBiM0lvYjNCMGFXOXVjeUE5SUh0OUtTQjdYRzRnSUNBZ0lDQnpkWEJsY2loT1FVMUZMQ0JXUlZKVFNVOU9MQ0JFUlVaQlZVeFVYMUJTVDFCRlVsUkpSVk1zSUc5d2RHbHZibk1zSUVSQlZFRmZRVlJVVWxOZlVGSlBVRVZTVkVsRlV5d2dabUZzYzJVc0lHWmhiSE5sS1Z4dVhHNGdJQ0FnSUNBdkx5QnpaWFFnZEdobElIZGhiblJsWkNCb1pXbG5hSFJjYmlBZ0lDQWdJSFJvYVhNdWIzQjBhVzl1Y3k1bGJHVnRaVzUwTG5OMGVXeGxMbWhsYVdkb2RDQTlJR0FrZTNSb2FYTXViM0IwYVc5dWN5NW9aV2xuYUhSOWNIaGdYRzVjYmlBZ0lDQWdJQzh2SUhObGRDQnRhVzRnWVc1a0lHMWhlQ0IyWVd4MVpYTmNiaUFnSUNBZ0lHTnZibk4wSUhCeWIyZHlaWE56UW1GeUlEMGdkR2hwY3k1blpYUlFjbTluY21WemMwSmhjaWdwWEc0Z0lDQWdJQ0J3Y205bmNtVnpjMEpoY2k1elpYUkJkSFJ5YVdKMWRHVW9KMkZ5YVdFdGRtRnNkV1Z0YVc0bkxDQmdKSHQwYUdsekxtOXdkR2x2Ym5NdWJXbHVmV0FwWEc0Z0lDQWdJQ0J3Y205bmNtVnpjMEpoY2k1elpYUkJkSFJ5YVdKMWRHVW9KMkZ5YVdFdGRtRnNkV1Z0WVhnbkxDQmdKSHQwYUdsekxtOXdkR2x2Ym5NdWJXRjRmV0FwWEc1Y2JpQWdJQ0FnSUM4dklITmxkQ0J6ZEhKcGNHVmtYRzRnSUNBZ0lDQnBaaUFvZEdocGN5NXZjSFJwYjI1ekxuTjBjbWx3WldSY2JpQWdJQ0FnSUNBZ0ppWWdJWEJ5YjJkeVpYTnpRbUZ5TG1Oc1lYTnpUR2x6ZEM1amIyNTBZV2x1Y3lnbmNISnZaM0psYzNNdFltRnlMWE4wY21sd1pXUW5LU2tnZTF4dUlDQWdJQ0FnSUNCd2NtOW5jbVZ6YzBKaGNpNWpiR0Z6YzB4cGMzUXVZV1JrS0Nkd2NtOW5jbVZ6Y3kxaVlYSXRjM1J5YVhCbFpDY3BYRzRnSUNBZ0lDQjlYRzVjYmlBZ0lDQWdJQzh2SUhObGRDQmlZV05yWjNKdmRXNWtYRzRnSUNBZ0lDQnBaaUFvZEhsd1pXOW1JSFJvYVhNdWIzQjBhVzl1Y3k1aVlXTnJaM0p2ZFc1a0lEMDlQU0FuYzNSeWFXNW5KMXh1SUNBZ0lDQWdJQ0FtSmlBaGNISnZaM0psYzNOQ1lYSXVZMnhoYzNOTWFYTjBMbU52Ym5SaGFXNXpLR0JpWnkwa2UzUm9hWE11YjNCMGFXOXVjeTVpWVdOclozSnZkVzVrZldBcEtTQjdYRzRnSUNBZ0lDQWdJSEJ5YjJkeVpYTnpRbUZ5TG1Oc1lYTnpUR2x6ZEM1aFpHUW9ZR0puTFNSN2RHaHBjeTV2Y0hScGIyNXpMbUpoWTJ0bmNtOTFibVI5WUNsY2JpQWdJQ0FnSUgxY2JpQWdJQ0I5WEc1Y2JpQWdJQ0JuWlhSUWNtOW5jbVZ6YzBKaGNpZ3BJSHRjYmlBZ0lDQWdJSEpsZEhWeWJpQjBhR2x6TG05d2RHbHZibk11Wld4bGJXVnVkQzV4ZFdWeWVWTmxiR1ZqZEc5eUtDY3VjSEp2WjNKbGMzTXRZbUZ5SnlsY2JpQWdJQ0I5WEc1Y2JpQWdJQ0J6WlhRb2RtRnNkV1VnUFNBd0tTQjdYRzRnSUNBZ0lDQmpiMjV6ZENCd2NtOW5jbVZ6YzBKaGNpQTlJSFJvYVhNdVoyVjBVSEp2WjNKbGMzTkNZWElvS1Z4dUlDQWdJQ0FnWTI5dWMzUWdjSEp2WjNKbGMzTWdQU0JOWVhSb0xuSnZkVzVrS0NoMllXeDFaU0F2SUNoMGFHbHpMbTl3ZEdsdmJuTXViV2x1SUNzZ2RHaHBjeTV2Y0hScGIyNXpMbTFoZUNrcElDb2dNVEF3S1Z4dVhHNGdJQ0FnSUNCcFppQW9kbUZzZFdVZ1BDQjBhR2x6TG05d2RHbHZibk11YldsdUtTQjdYRzRnSUNBZ0lDQWdJR052Ym5OdmJHVXVaWEp5YjNJb1lDUjdUa0ZOUlgwdUlGZGhjbTVwYm1jc0lDUjdkbUZzZFdWOUlHbHpJSFZ1WkdWeUlHMXBiaUIyWVd4MVpTNWdLVnh1SUNBZ0lDQWdJQ0J5WlhSMWNtNGdabUZzYzJWY2JpQWdJQ0FnSUgxY2JseHVJQ0FnSUNBZ2FXWWdLSFpoYkhWbElENGdkR2hwY3k1dmNIUnBiMjV6TG0xaGVDa2dlMXh1SUNBZ0lDQWdJQ0JqYjI1emIyeGxMbVZ5Y205eUtHQWtlMDVCVFVWOUxpQlhZWEp1YVc1bkxDQWtlM1poYkhWbGZTQnBjeUJoWW05MlpTQnRZWGdnZG1Gc2RXVXVZQ2tnSUNBZ0lDQWdJQ0FnWEc0Z0lDQWdJQ0FnSUhKbGRIVnliaUJtWVd4elpWeHVJQ0FnSUNBZ2ZWeHVYRzRnSUNBZ0lDQndjbTluY21WemMwSmhjaTV6WlhSQmRIUnlhV0oxZEdVb0oyRnlhV0V0ZG1Gc2RXVnViM2NuTENCZ0pIdDJZV3gxWlgxZ0tTQWdJQ0FnSUZ4dVhHNGdJQ0FnSUNBdkx5QnpaWFFnYkdGaVpXeGNiaUFnSUNBZ0lHbG1JQ2gwYUdsekxtOXdkR2x2Ym5NdWJHRmlaV3dwSUh0Y2JpQWdJQ0FnSUNBZ2NISnZaM0psYzNOQ1lYSXVhVzV1WlhKSVZFMU1JRDBnWUNSN2NISnZaM0psYzNOOUpXQmNiaUFnSUNBZ0lIMWNibHh1SUNBZ0lDQWdMeThnYzJWMElIQmxjbU5sYm5SaFoyVmNiaUFnSUNBZ0lIQnliMmR5WlhOelFtRnlMbk4wZVd4bExuZHBaSFJvSUQwZ1lDUjdjSEp2WjNKbGMzTjlKV0JjYmx4dUlDQWdJQ0FnY21WMGRYSnVJSFJ5ZFdWY2JpQWdJQ0I5WEc1Y2JpQWdJQ0JoYm1sdFlYUmxLSE4wWVhKMFFXNXBiV0YwYVc5dUlEMGdkSEoxWlNrZ2UxeHVJQ0FnSUNBZ2FXWWdLQ0YwYUdsekxtOXdkR2x2Ym5NdWMzUnlhWEJsWkNrZ2UxeHVJQ0FnSUNBZ0lDQmpiMjV6YjJ4bExtVnljbTl5S0dBa2UwNUJUVVY5TGlCQmJtbHRZWFJwYjI0Z2QyOXlhM01nYjI1c2VTQjNhWFJvSUhOMGNtbHdaV1FnY0hKdlozSmxjM011WUNsY2JpQWdJQ0FnSUNBZ2NtVjBkWEp1SUdaaGJITmxYRzRnSUNBZ0lDQjlYRzVjYmlBZ0lDQWdJR052Ym5OMElIQnliMmR5WlhOelFtRnlJRDBnZEdocGN5NW5aWFJRY205bmNtVnpjMEpoY2lncFhHNWNiaUFnSUNBZ0lHbG1JQ2h6ZEdGeWRFRnVhVzFoZEdsdmJseHVJQ0FnSUNBZ0lDQW1KaUFoY0hKdlozSmxjM05DWVhJdVkyeGhjM05NYVhOMExtTnZiblJoYVc1ektDZHdjbTluY21WemN5MWlZWEl0WVc1cGJXRjBaV1FuS1NrZ2UxeHVJQ0FnSUNBZ0lDQndjbTluY21WemMwSmhjaTVqYkdGemMweHBjM1F1WVdSa0tDZHdjbTluY21WemN5MWlZWEl0WVc1cGJXRjBaV1FuS1Z4dUlDQWdJQ0FnZlZ4dVhHNGdJQ0FnSUNCcFppQW9JWE4wWVhKMFFXNXBiV0YwYVc5dVhHNGdJQ0FnSUNBZ0lDWW1JSEJ5YjJkeVpYTnpRbUZ5TG1Oc1lYTnpUR2x6ZEM1amIyNTBZV2x1Y3lnbmNISnZaM0psYzNNdFltRnlMV0Z1YVcxaGRHVmtKeWtwSUh0Y2JpQWdJQ0FnSUNBZ2NISnZaM0psYzNOQ1lYSXVZMnhoYzNOTWFYTjBMbkpsYlc5MlpTZ25jSEp2WjNKbGMzTXRZbUZ5TFdGdWFXMWhkR1ZrSnlsY2JpQWdJQ0FnSUgxY2JseHVJQ0FnSUNBZ2NtVjBkWEp1SUhSeWRXVmNiaUFnSUNCOVhHNWNiaUFnSUNCemFHOTNLQ2tnZTF4dUlDQWdJQ0FnZEdocGN5NXZjSFJwYjI1ekxtVnNaVzFsYm5RdWMzUjViR1V1YUdWcFoyaDBJRDBnWUNSN2RHaHBjeTV2Y0hScGIyNXpMbWhsYVdkb2RIMXdlR0JjYmlBZ0lDQWdJSFJvYVhNdWRISnBaMmRsY2tWMlpXNTBLRVYyWlc1MExsTklUMWNwWEc0Z0lDQWdJQ0IwYUdsekxuUnlhV2RuWlhKRmRtVnVkQ2hGZG1WdWRDNVRTRTlYVGlsY2JseHVJQ0FnSUNBZ2NtVjBkWEp1SUhSeWRXVmNiaUFnSUNCOVhHNWNiaUFnSUNCb2FXUmxLQ2tnZTF4dUlDQWdJQ0FnZEdocGN5NXZjSFJwYjI1ekxtVnNaVzFsYm5RdWMzUjViR1V1YUdWcFoyaDBJRDBnSnpCd2VDZGNiaUFnSUNBZ0lIUm9hWE11ZEhKcFoyZGxja1YyWlc1MEtFVjJaVzUwTGtoSlJFVXBYRzRnSUNBZ0lDQjBhR2x6TG5SeWFXZG5aWEpGZG1WdWRDaEZkbVZ1ZEM1SVNVUkVSVTRwWEc1Y2JpQWdJQ0FnSUhKbGRIVnliaUIwY25WbFhHNGdJQ0FnZlZ4dVhHNGdJQ0FnYzNSaGRHbGpJR2xrWlc1MGFXWnBaWElvS1NCN1hHNGdJQ0FnSUNCeVpYUjFjbTRnVGtGTlJWeHVJQ0FnSUgxY2JseHVJQ0FnSUhOMFlYUnBZeUJmUkU5TlNXNTBaWEptWVdObEtHOXdkR2x2Ym5NcElIdGNiaUFnSUNBZ0lISmxkSFZ5YmlCemRYQmxjaTVmUkU5TlNXNTBaWEptWVdObEtGQnliMmR5WlhOekxDQnZjSFJwYjI1ektWeHVJQ0FnSUgxY2JpQWdmVnh1WEc0Z0lISmxkSFZ5YmlCUWNtOW5jbVZ6YzF4dWZTa29LVnh1WEc1bGVIQnZjblFnWkdWbVlYVnNkQ0JRY205bmNtVnpjMXh1SWl3aUx5b3FYRzRnS2lBdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExWeHVJQ29nVEdsalpXNXpaV1FnZFc1a1pYSWdUVWxVSUNob2RIUndjem92TDJkcGRHaDFZaTVqYjIwdmNYVmhjbXN0WkdWMkwxQm9iMjV2YmkxR2NtRnRaWGR2Y21zdllteHZZaTl0WVhOMFpYSXZURWxEUlU1VFJTbGNiaUFxSUMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdFhHNGdLaTljYm1sdGNHOXlkQ0JEYjIxd2IyNWxiblFnWm5KdmJTQW5MaTR2WTI5dGNHOXVaVzUwSjF4dWFXMXdiM0owSUhzZ1oyVjBRWFIwY21saWRYUmxjME52Ym1acFp5QjlJR1p5YjIwZ0p5NHVMMk52YlhCdmJtVnVkRTFoYm1GblpYSW5YRzVwYlhCdmNuUWdSWFpsYm5RZ1puSnZiU0FuTGk0dkxpNHZZMjl0Ylc5dUwyVjJaVzUwY3lkY2JtbHRjRzl5ZENCN0lHWnBibVJVWVhKblpYUkNlVU5zWVhOeklIMGdabkp2YlNBbkxpNHZMaTR2WTI5dGJXOXVMM1YwYVd4ekoxeHVYRzVqYjI1emRDQlVZV0lnUFNBb0tDa2dQVDRnZTF4dUlDQXZLaXBjYmlBZ0lDb2dMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRYRzRnSUNBcUlFTnZibk4wWVc1MGMxeHVJQ0FnS2lBdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMxY2JpQWdJQ292WEc1Y2JpQWdZMjl1YzNRZ1RrRk5SU0E5SUNkMFlXSW5YRzRnSUdOdmJuTjBJRlpGVWxOSlQwNGdQU0FuTWk0d0xqQW5YRzRnSUdOdmJuTjBJRVJGUmtGVlRGUmZVRkpQVUVWU1ZFbEZVeUE5SUh0Y2JseHVJQ0I5WEc0Z0lHTnZibk4wSUVSQlZFRmZRVlJVVWxOZlVGSlBVRVZTVkVsRlV5QTlJRnRjYmlBZ1hWeHVJQ0JqYjI1emRDQlVRVUpmUTA5T1ZFVk9WRjlUUlV4RlExUlBVaUE5SUNjdWRHRmlMWEJoYm1VblhHNWNiaUFnTHlvcVhHNGdJQ0FxSUMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFZ4dUlDQWdLaUJEYkdGemN5QkVaV1pwYm1sMGFXOXVYRzRnSUNBcUlDMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExWeHVJQ0FnS2k5Y2JseHVJQ0JqYkdGemN5QlVZV0lnWlhoMFpXNWtjeUJEYjIxd2IyNWxiblFnZTF4dVhHNGdJQ0FnWTI5dWMzUnlkV04wYjNJb2IzQjBhVzl1Y3lBOUlIdDlLU0I3WEc0Z0lDQWdJQ0J6ZFhCbGNpaE9RVTFGTENCV1JWSlRTVTlPTENCRVJVWkJWVXhVWDFCU1QxQkZVbFJKUlZNc0lHOXdkR2x2Ym5Nc0lFUkJWRUZmUVZSVVVsTmZVRkpQVUVWU1ZFbEZVeXdnWm1Gc2MyVXNJR1poYkhObEtWeHVJQ0FnSUgxY2JseHVJQ0FnSUhOb2IzY29LU0I3WEc0Z0lDQWdJQ0JwWmlBb2RHaHBjeTV2Y0hScGIyNXpMbVZzWlcxbGJuUXVZMnhoYzNOTWFYTjBMbU52Ym5SaGFXNXpLQ2RoWTNScGRtVW5LU2tnZTF4dUlDQWdJQ0FnSUNCeVpYUjFjbTRnWm1Gc2MyVmNiaUFnSUNBZ0lIMWNibHh1SUNBZ0lDQWdZMjl1YzNRZ2FXUWdQU0IwYUdsekxtOXdkR2x2Ym5NdVpXeGxiV1Z1ZEM1blpYUkJkSFJ5YVdKMWRHVW9KMmh5WldZbktWeHVJQ0FnSUNBZ1kyOXVjM1FnYm1GMklEMGdabWx1WkZSaGNtZGxkRUo1UTJ4aGMzTW9kR2hwY3k1dmNIUnBiMjV6TG1Wc1pXMWxiblFzSUNkdVlYWW5LVnh1SUNBZ0lDQWdZMjl1YzNRZ2JtRjJWR0ZpY3lBOUlHNWhkaUEvSUc1aGRpNXhkV1Z5ZVZObGJHVmpkRzl5UVd4c0tHQmJaR0YwWVMxMGIyZG5iR1U5WENJa2UwNUJUVVY5WENKZFlDa2dPaUJ1ZFd4c1hHNWNiaUFnSUNBZ0lHbG1JQ2h1WVhaVVlXSnpLU0I3WEc0Z0lDQWdJQ0FnSUVGeWNtRjVMbVp5YjIwb2JtRjJWR0ZpY3lrdVptOXlSV0ZqYUNnb2RHRmlLU0E5UGlCN1hHNGdJQ0FnSUNBZ0lDQWdhV1lnS0hSaFlpNWpiR0Z6YzB4cGMzUXVZMjl1ZEdGcGJuTW9KMkZqZEdsMlpTY3BLU0I3WEc0Z0lDQWdJQ0FnSUNBZ0lDQjBZV0l1WTJ4aGMzTk1hWE4wTG5KbGJXOTJaU2duWVdOMGFYWmxKeWxjYmlBZ0lDQWdJQ0FnSUNCOVhHNGdJQ0FnSUNBZ0lDQWdkR0ZpTG5ObGRFRjBkSEpwWW5WMFpTZ25ZWEpwWVMxelpXeGxZM1JsWkNjc0lHWmhiSE5sS1Z4dUlDQWdJQ0FnSUNCOUtWeHVJQ0FnSUNBZ2ZWeHVYRzRnSUNBZ0lDQjBhR2x6TG05d2RHbHZibk11Wld4bGJXVnVkQzVqYkdGemMweHBjM1F1WVdSa0tDZGhZM1JwZG1VbktWeHVJQ0FnSUNBZ2RHaHBjeTV2Y0hScGIyNXpMbVZzWlcxbGJuUXVjMlYwUVhSMGNtbGlkWFJsS0NkaGNtbGhMWE5sYkdWamRHVmtKeXdnZEhKMVpTbGNibHh1SUNBZ0lDQWdZMjl1YzNRZ2RHRmlRMjl1ZEdWdWRDQTlJR1J2WTNWdFpXNTBMbkYxWlhKNVUyVnNaV04wYjNJb2FXUXBYRzRnSUNBZ0lDQmpiMjV6ZENCMFlXSkRiMjUwWlc1MGN5QTlJSFJoWWtOdmJuUmxiblF1Y0dGeVpXNTBUbTlrWlM1eGRXVnllVk5sYkdWamRHOXlRV3hzS0ZSQlFsOURUMDVVUlU1VVgxTkZURVZEVkU5U0tWeHVYRzRnSUNBZ0lDQnBaaUFvZEdGaVEyOXVkR1Z1ZEhNcElIdGNiaUFnSUNBZ0lDQWdRWEp5WVhrdVpuSnZiU2gwWVdKRGIyNTBaVzUwY3lrdVptOXlSV0ZqYUNnb2RHRmlLU0E5UGlCN1hHNGdJQ0FnSUNBZ0lDQWdhV1lnS0hSaFlpNWpiR0Z6YzB4cGMzUXVZMjl1ZEdGcGJuTW9KMkZqZEdsMlpTY3BLU0I3WEc0Z0lDQWdJQ0FnSUNBZ0lDQjBZV0l1WTJ4aGMzTk1hWE4wTG5KbGJXOTJaU2duWVdOMGFYWmxKeWxjYmlBZ0lDQWdJQ0FnSUNCOVhHNGdJQ0FnSUNBZ0lIMHBYRzRnSUNBZ0lDQjlYRzVjYmlBZ0lDQWdJSFJoWWtOdmJuUmxiblF1WTJ4aGMzTk1hWE4wTG1Ga1pDZ25jMmh2ZDJsdVp5Y3BYRzVjYmlBZ0lDQWdJSE5sZEZScGJXVnZkWFFvS0NrZ1BUNGdlMXh1SUNBZ0lDQWdJQ0JqYjI1emRDQnZibE5vYjNkbFpDQTlJQ2dwSUQwK0lIdGNiaUFnSUNBZ0lDQWdJQ0IwWVdKRGIyNTBaVzUwTG1Oc1lYTnpUR2x6ZEM1eVpXMXZkbVVvSjJGdWFXMWhkR1VuS1Z4dUlDQWdJQ0FnSUNBZ0lIUmhZa052Ym5SbGJuUXVZMnhoYzNOTWFYTjBMbUZrWkNnbllXTjBhWFpsSnlsY2JpQWdJQ0FnSUNBZ0lDQjBZV0pEYjI1MFpXNTBMbU5zWVhOelRHbHpkQzV5WlcxdmRtVW9KM05vYjNkcGJtY25LVnh1SUNBZ0lDQWdJQ0FnSUhSaFlrTnZiblJsYm5RdWNtVnRiM1psUlhabGJuUk1hWE4wWlc1bGNpaEZkbVZ1ZEM1VVVrRk9VMGxVU1U5T1gwVk9SQ3dnYjI1VGFHOTNaV1FwWEc0Z0lDQWdJQ0FnSUgxY2JseHVJQ0FnSUNBZ0lDQjBZV0pEYjI1MFpXNTBMbUZrWkVWMlpXNTBUR2x6ZEdWdVpYSW9SWFpsYm5RdVZGSkJUbE5KVkVsUFRsOUZUa1FzSUc5dVUyaHZkMlZrS1Z4dVhHNGdJQ0FnSUNBZ0lIUmhZa052Ym5SbGJuUXVZMnhoYzNOTWFYTjBMbUZrWkNnbllXNXBiV0YwWlNjcFhHNWNiaUFnSUNBZ0lIMHNJREl3S1Z4dVhHNGdJQ0FnSUNCeVpYUjFjbTRnZEhKMVpWeHVJQ0FnSUgxY2JseHVJQ0FnSUdocFpHVW9LU0I3WEc0Z0lDQWdJQ0JwWmlBb0lYUm9hWE11YjNCMGFXOXVjeTVsYkdWdFpXNTBMbU5zWVhOelRHbHpkQzVqYjI1MFlXbHVjeWduWVdOMGFYWmxKeWtwSUh0Y2JpQWdJQ0FnSUNBZ2NtVjBkWEp1SUdaaGJITmxYRzRnSUNBZ0lDQjlYRzVjYmlBZ0lDQWdJR2xtSUNoMGFHbHpMbTl3ZEdsdmJuTXVaV3hsYldWdWRDNWpiR0Z6YzB4cGMzUXVZMjl1ZEdGcGJuTW9KMkZqZEdsMlpTY3BLU0I3WEc0Z0lDQWdJQ0FnSUhSb2FYTXViM0IwYVc5dWN5NWxiR1Z0Wlc1MExtTnNZWE56VEdsemRDNXlaVzF2ZG1Vb0oyRmpkR2wyWlNjcFhHNGdJQ0FnSUNCOVhHNWNiaUFnSUNBZ0lIUm9hWE11YjNCMGFXOXVjeTVsYkdWdFpXNTBMbk5sZEVGMGRISnBZblYwWlNnbllYSnBZUzF6Wld4bFkzUmxaQ2NzSUdaaGJITmxLVnh1WEc0Z0lDQWdJQ0JqYjI1emRDQnBaQ0E5SUhSb2FYTXViM0IwYVc5dWN5NWxiR1Z0Wlc1MExtZGxkRUYwZEhKcFluVjBaU2duYUhKbFppY3BYRzRnSUNBZ0lDQmpiMjV6ZENCMFlXSkRiMjUwWlc1MElEMGdaRzlqZFcxbGJuUXVjWFZsY25sVFpXeGxZM1J2Y2locFpDbGNibHh1SUNBZ0lDQWdhV1lnS0hSaFlrTnZiblJsYm5RdVkyeGhjM05NYVhOMExtTnZiblJoYVc1ektDZGhZM1JwZG1VbktTa2dlMXh1SUNBZ0lDQWdJQ0IwWVdKRGIyNTBaVzUwTG1Oc1lYTnpUR2x6ZEM1eVpXMXZkbVVvSjJGamRHbDJaU2NwWEc0Z0lDQWdJQ0I5WEc1Y2JpQWdJQ0FnSUhKbGRIVnliaUIwY25WbFhHNGdJQ0FnZlZ4dVhHNGdJQ0FnYzNSaGRHbGpJR2xrWlc1MGFXWnBaWElvS1NCN1hHNGdJQ0FnSUNCeVpYUjFjbTRnVGtGTlJWeHVJQ0FnSUgxY2JseHVJQ0FnSUhOMFlYUnBZeUJmUkU5TlNXNTBaWEptWVdObEtHOXdkR2x2Ym5NcElIdGNiaUFnSUNBZ0lISmxkSFZ5YmlCemRYQmxjaTVmUkU5TlNXNTBaWEptWVdObEtGUmhZaXdnYjNCMGFXOXVjeWxjYmlBZ0lDQjlYRzRnSUgxY2JseHVJQ0F2S2lwY2JpQWdJQ29nTFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0WEc0Z0lDQXFJRVJQVFNCQmNHa2dhVzF3YkdWdFpXNTBZWFJwYjI1Y2JpQWdJQ29nTFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0WEc0Z0lDQXFMMXh1SUNCamIyNXpkQ0JqYjIxd2IyNWxiblJ6SUQwZ1cxMWNibHh1SUNCamIyNXpkQ0IwWVdKeklEMGdaRzlqZFcxbGJuUXVjWFZsY25sVFpXeGxZM1J2Y2tGc2JDaGdXMlJoZEdFdGRHOW5aMnhsUFZ3aUpIdE9RVTFGZlZ3aVhXQXBYRzRnSUdsbUlDaDBZV0p6S1NCN1hHNGdJQ0FnUVhKeVlYa3Vabkp2YlNoMFlXSnpLUzVtYjNKRllXTm9LQ2hsYkdWdFpXNTBLU0E5UGlCN1hHNGdJQ0FnSUNBdkx5QmpiMjV6ZENCamIyNW1hV2NnUFNCN2ZWeHVJQ0FnSUNBZ1kyOXVjM1FnWTI5dVptbG5JRDBnWjJWMFFYUjBjbWxpZFhSbGMwTnZibVpwWnlobGJHVnRaVzUwTENCRVJVWkJWVXhVWDFCU1QxQkZVbFJKUlZNc0lFUkJWRUZmUVZSVVVsTmZVRkpQVUVWU1ZFbEZVeWxjYmlBZ0lDQWdJR052Ym1acFp5NWxiR1Z0Wlc1MElEMGdaV3hsYldWdWRGeHVYRzRnSUNBZ0lDQmpiMjF3YjI1bGJuUnpMbkIxYzJnb1ZHRmlMbDlFVDAxSmJuUmxjbVpoWTJVb1kyOXVabWxuS1NsY2JpQWdJQ0I5S1Z4dUlDQjlYRzVjYmlBZ1pHOWpkVzFsYm5RdVlXUmtSWFpsYm5STWFYTjBaVzVsY2lnblkyeHBZMnNuTENBb1pYWmxiblFwSUQwK0lIdGNiaUFnSUNCamIyNXpkQ0JrWVhSaFZHOW5aMnhsUVhSMGNpQTlJR1YyWlc1MExuUmhjbWRsZEM1blpYUkJkSFJ5YVdKMWRHVW9KMlJoZEdFdGRHOW5aMnhsSnlsY2JpQWdJQ0JwWmlBb1pHRjBZVlJ2WjJkc1pVRjBkSElnSmlZZ1pHRjBZVlJ2WjJkc1pVRjBkSElnUFQwOUlFNUJUVVVwSUh0Y2JpQWdJQ0FnSUdOdmJuTjBJR2xrSUQwZ1pYWmxiblF1ZEdGeVoyVjBMbWRsZEVGMGRISnBZblYwWlNnbmFISmxaaWNwWEc1Y2JpQWdJQ0FnSUdOdmJuTjBJR052YlhCdmJtVnVkQ0E5SUdOdmJYQnZibVZ1ZEhNdVptbHVaQ2hqSUQwK0lHTXVaMlYwUld4bGJXVnVkQ2dwTG1kbGRFRjBkSEpwWW5WMFpTZ25hSEpsWmljcElEMDlQU0JwWkNsY2JseHVJQ0FnSUNBZ2FXWWdLQ0ZqYjIxd2IyNWxiblFwSUh0Y2JpQWdJQ0FnSUNBZ2NtVjBkWEp1WEc0Z0lDQWdJQ0I5WEc1Y2JpQWdJQ0FnSUdOdmJYQnZibVZ1ZEM1emFHOTNLQ2xjYmlBZ0lDQjlYRzRnSUgwcFhHNWNiaUFnY21WMGRYSnVJRlJoWWx4dWZTa29LVnh1WEc1bGVIQnZjblFnWkdWbVlYVnNkQ0JVWVdKY2JpSXNJaThxS2x4dUtpQXRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMVnh1S2lCTWFXTmxibk5sWkNCMWJtUmxjaUJOU1ZRZ0tHaDBkSEJ6T2k4dloybDBhSFZpTG1OdmJTOXhkV0Z5YXkxa1pYWXZVR2h2Ym05dUxVWnlZVzFsZDI5eWF5OWliRzlpTDIxaGMzUmxjaTlNU1VORlRsTkZLVnh1S2lBdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExWeHVLaTljYmx4dVkyOXVjM1FnUW1sdVpHVnlJRDBnS0NncElEMCtJSHRjYmlBZ0x5b3FYRzRnSUNvZ0xTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdFhHNGdJQ29nUTI5dWMzUmhiblJ6WEc0Z0lDb2dMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRYRzRnSUNvdlhHNWNiaUFnWTI5dWMzUWdUa0ZOUlNBOUlDZHBiblJzTFdKcGJtUmxjaWRjYmlBZ1kyOXVjM1FnVmtWU1UwbFBUaUE5SUNjeUxqQXVNQ2RjYmx4dUlDQXZLaXBjYmlBZ0lDb2dMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRYRzRnSUNBcUlFTnNZWE56SUVSbFptbHVhWFJwYjI1Y2JpQWdJQ29nTFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0WEc0Z0lDQXFMMXh1WEc0Z0lHTnNZWE56SUVKcGJtUmxjaUI3WEc0Z0lDQWdZMjl1YzNSeWRXTjBiM0lvWld4bGJXVnVkQ3dnWkdGMFlTa2dlMXh1SUNBZ0lDQWdkR2hwY3k1bGJHVnRaVzUwSUQwZ1pXeGxiV1Z1ZEZ4dUlDQWdJQ0FnZEdocGN5NWtZWFJoSUQwZ1pHRjBZVnh1WEc0Z0lDQWdJQ0JwWmlBb0lYUm9hWE11YVhORmJHVnRaVzUwS0hSb2FYTXVaV3hsYldWdWRDa3BJSHRjYmlBZ0lDQWdJQ0FnY21WMGRYSnVYRzRnSUNBZ0lDQjlYRzVjYmlBZ0lDQWdJQzh2SUdGeWNtRjVJRzltSUVoVVRVeEZiR1Z0Wlc1MFhHNGdJQ0FnSUNCcFppQW9kR2hwY3k1bGJHVnRaVzUwTG14bGJtZDBhQ0FtSmlCMGFHbHpMbVZzWlcxbGJuUXViR1Z1WjNSb0lENGdNQ2tnZTF4dUlDQWdJQ0FnSUNCMGFHbHpMbk5sZEU1dlpHVnpLSFJvYVhNdVpXeGxiV1Z1ZENsY2JpQWdJQ0FnSUgwZ1pXeHpaU0I3WEc0Z0lDQWdJQ0FnSUM4dklITnBibWRzWlNCSVZFMU1SV3hsYldWdWRGeHVJQ0FnSUNBZ0lDQjBhR2x6TG5ObGRFNXZaR1VvZEdocGN5NWxiR1Z0Wlc1MEtWeHVJQ0FnSUNBZ2ZWeHVJQ0FnSUgxY2JseHVJQ0FnSUM4dklHZGxkSFJsY25OY2JseHVJQ0FnSUhOMFlYUnBZeUJuWlhRZ2RtVnljMmx2YmlncElIdGNiaUFnSUNBZ0lISmxkSFZ5YmlCZ0pIdE9RVTFGZlM0a2UxWkZVbE5KVDA1OVlGeHVJQ0FnSUgxY2JseHVJQ0FnSUM4cUtseHVJQ0FnSUNBcUlFTm9aV05yY3lCcFppQjBhR1VnWjJsMlpXNGdZWEpuZFcxbGJuUWdhWE1nWVNCRVQwMGdaV3hsYldWdWRGeHVJQ0FnSUNBcUlFQndZWEpoYlNCN1NGUk5URVZzWlcxbGJuUjlJSFJvWlNCaGNtZDFiV1Z1ZENCMGJ5QjBaWE4wWEc0Z0lDQWdJQ29nUUhKbGRIVnliaUI3WW05dmJHVmhibjBnZEhKMVpTQnBaaUIwYUdVZ2IySnFaV04wSUdseklHRWdSRTlOSUdWc1pXMWxiblFzSUdaaGJITmxJRzkwYUdWeWQybHpaVnh1SUNBZ0lDQXFMMXh1SUNBZ0lHbHpSV3hsYldWdWRDaGxiR1Z0Wlc1MEtTQjdYRzRnSUNBZ0lDQnBaaUFvWld4bGJXVnVkQ0E5UFQwZ2JuVnNiQ2tnZTF4dUlDQWdJQ0FnSUNCeVpYUjFjbTRnWm1Gc2MyVmNiaUFnSUNBZ0lIMWNiaUFnSUNBZ0lISmxkSFZ5YmlBb2RIbHdaVzltSUU1dlpHVWdQVDA5SUNkdlltcGxZM1FuSUQ4Z1pXeGxiV1Z1ZENCcGJuTjBZVzVqWlc5bUlFNXZaR1VnT2lCbGJHVnRaVzUwSUNZbUlIUjVjR1Z2WmlCbGJHVnRaVzUwSUQwOVBTQW5iMkpxWldOMEp5QW1KaUIwZVhCbGIyWWdaV3hsYldWdWRDNXViMlJsVkhsd1pTQTlQVDBnSjI1MWJXSmxjaWNnSmlZZ2RIbHdaVzltSUdWc1pXMWxiblF1Ym05a1pVNWhiV1VnUFQwOUlDZHpkSEpwYm1jbktWeHVJQ0FnSUgxY2JseHVJQ0FnSUM4cUtseHVJQ0FnSUNvZ1FtbHVaSE1nYzI5dFpTQjBaWGgwSUhSdklIUm9aU0JuYVhabGJpQkVUMDBnWld4bGJXVnVkRnh1SUNBZ0lDb2dRSEJoY21GdElIdElWRTFNUld4bGJXVnVkSDBnWld4bGJXVnVkRnh1SUNBZ0lDb2dRSEJoY21GdElIdFRkSEpwYm1kOUlIUmxlSFJjYmlBZ0lDQXFMMXh1SUNBZ0lITmxkRlJsZUhRb1pXeGxiV1Z1ZEN3Z2RHVjRkQ2tnZTF4dUlDQWdJQ0FnYVdZZ0tDRW9KM1JsZUhSRGIyNTBaVzUwSnlCcGJpQmxiR1Z0Wlc1MEtTa2dlMXh1SUNBZ0lDQWdJQ0JsYkdWdFpXNTBMbWx1Ym1WeVZHVjRkQ0E5SUhSbGVIUmNiaUFnSUNBZ0lIMGdaV3h6WlNCN1hHNGdJQ0FnSUNBZ0lHVnNaVzFsYm5RdWRHVjRkRU52Ym5SbGJuUWdQU0IwWlhoMFhHNGdJQ0FnSUNCOVhHNGdJQ0FnZlZ4dVhHNGdJQ0FnTHlvcVhHNGdJQ0FnSUNvZ1FtbHVaSE1nYzI5dFpTQm9kRzFzSUhSdklIUm9aU0JuYVhabGJpQkVUMDBnWld4bGJXVnVkRnh1SUNBZ0lDQXFJRUJ3WVhKaGJTQjdTRlJOVEVWc1pXMWxiblI5SUdWc1pXMWxiblJjYmlBZ0lDQWdLaUJBY0dGeVlXMGdlM04wY21sdVozMGdkR1Y0ZEZ4dUlDQWdJQ0FxTDF4dUlDQWdJSE5sZEVoMGJXd29aV3hsYldWdWRDd2dkR1Y0ZENrZ2UxeHVJQ0FnSUNBZ1pXeGxiV1Z1ZEM1cGJtNWxja2hVVFV3Z1BTQjBaWGgwWEc0Z0lDQWdmVnh1WEc0Z0lDQWdMeW9xWEc0Z0lDQWdJQ29nUW1sdVpITWdZM1Z6ZEc5dElHRjBkSEpwWW5WMFpYTWdkRzhnZEdobElHZHBkbVZ1SUVSUFRTQmxiR1Z0Wlc1MFhHNGdJQ0FnSUNvZ1FIQmhjbUZ0SUh0SVZFMU1SV3hsYldWdWRIMGdaV3hsYldWdWRGeHVJQ0FnSUNBcUlFQndZWEpoYlNCN1UzUnlhVzVuZlNCaGRIUnlYRzRnSUNBZ0lDb2dRSEJoY21GdElIdFRkSEpwYm1kOUlIUmxlSFJjYmlBZ0lDQWdLaTljYmlBZ0lDQnpaWFJCZEhSeWFXSjFkR1VvWld4bGJXVnVkQ3dnWVhSMGNpd2dkR1Y0ZENrZ2UxeHVJQ0FnSUNBZ1pXeGxiV1Z1ZEM1elpYUkJkSFJ5YVdKMWRHVW9ZWFIwY2l3Z2RHVjRkQ2xjYmlBZ0lDQjlYRzVjYmlBZ0lDQnpaWFJPYjJSbEtHVnNaVzFsYm5RcElIdGNiaUFnSUNBZ0lHeGxkQ0JoZEhSeUlEMGdaV3hsYldWdWRDNW5aWFJCZEhSeWFXSjFkR1VvSjJSaGRHRXRhVEU0YmljcFhHNGdJQ0FnSUNCcFppQW9JV0YwZEhJcElIdGNiaUFnSUNBZ0lDQWdjbVYwZFhKdVhHNGdJQ0FnSUNCOVhHNWNiaUFnSUNBZ0lHRjBkSElnUFNCaGRIUnlMblJ5YVcwb0tWeHVYRzRnSUNBZ0lDQmpiMjV6ZENCeUlEMGdMeWcvT2x4Y2MzeGVLU2hiUVMxYVlTMTZMVjh3TFRsZEt5azZYRnh6S2lndUtqOHBLRDg5WEZ4eksxeGNkeXM2ZkNRcEwyZGNiaUFnSUNBZ0lHeGxkQ0J0WEc1Y2JpQWdJQ0FnSUhkb2FXeGxJQ2h0SUQwZ2NpNWxlR1ZqS0dGMGRISXBLU0I3WEc0Z0lDQWdJQ0FnSUdOdmJuTjBJR3RsZVNBOUlHMWJNVjB1ZEhKcGJTZ3BYRzRnSUNBZ0lDQWdJR052Ym5OMElIWmhiSFZsSUQwZ2JWc3lYUzUwY21sdEtDa3VjbVZ3YkdGalpTZ25MQ2NzSUNjbktWeHVJQ0FnSUNBZ0lDQnNaWFFnYVc1MGJGWmhiSFZsSUQwZ2RHaHBjeTVrWVhSaFczWmhiSFZsWFZ4dVhHNGdJQ0FnSUNBZ0lHbG1JQ2doZEdocGN5NWtZWFJoVzNaaGJIVmxYU2tnZTF4dUlDQWdJQ0FnSUNBZ0lHTnZibk52YkdVdWJHOW5LR0FrZTA1QlRVVjlMaUJYWVhKdWFXNW5MQ0FrZTNaaGJIVmxmU0JrYjJWeklHNXZkQ0JsZUdsemRDNWdLVnh1SUNBZ0lDQWdJQ0FnSUdsdWRHeFdZV3gxWlNBOUlIWmhiSFZsWEc0Z0lDQWdJQ0FnSUgxY2JseHVJQ0FnSUNBZ0lDQmpiMjV6ZENCdFpYUm9iMlJPWVcxbElEMGdKM05sZENjZ0t5QnJaWGt1WTJoaGNrRjBLREFwTG5SdlZYQndaWEpEWVhObEtDa2dLeUJyWlhrdWMyeHBZMlVvTVNsY2JseHVJQ0FnSUNBZ0lDQnBaaUFvZEdocGMxdHRaWFJvYjJST1lXMWxYU2tnZTF4dUlDQWdJQ0FnSUNBZ0lIUm9hWE5iYldWMGFHOWtUbUZ0WlYwb1pXeGxiV1Z1ZEN3Z2FXNTBiRlpoYkhWbEtWeHVJQ0FnSUNBZ0lDQjlJR1ZzYzJVZ2UxeHVJQ0FnSUNBZ0lDQWdJSFJvYVhNdWMyVjBRWFIwY21saWRYUmxLR1ZzWlcxbGJuUXNJR3RsZVN3Z2FXNTBiRlpoYkhWbEtWeHVJQ0FnSUNBZ0lDQjlYRzRnSUNBZ0lDQjlYRzRnSUNBZ2ZWeHVYRzRnSUNBZ0x5b3FYRzRnSUNBZ0tpQlRaWFFnZG1Gc2RXVnpJSFJ2SUVSUFRTQnViMlJsYzF4dUlDQWdJQ292WEc0Z0lDQWdjMlYwVG05a1pYTW9aV3hsYldWdWRDa2dlMXh1SUNBZ0lDQWdRWEp5WVhrdVpuSnZiU2hsYkdWdFpXNTBLUzVtYjNKRllXTm9LR1ZzSUQwK0lIUm9hWE11YzJWMFRtOWtaU2hsYkNrcFhHNGdJQ0FnZlZ4dUlDQjlYRzVjYmlBZ2NtVjBkWEp1SUVKcGJtUmxjbHh1ZlNrb0tWeHVYRzVsZUhCdmNuUWdaR1ZtWVhWc2RDQkNhVzVrWlhKY2JpSXNJaThxS2x4dUlDb2dMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzFjYmlBcUlFeHBZMlZ1YzJWa0lIVnVaR1Z5SUUxSlZDQW9hSFIwY0hNNkx5OW5hWFJvZFdJdVkyOXRMM0YxWVhKckxXUmxkaTlRYUc5dWIyNHRSbkpoYldWM2IzSnJMMkpzYjJJdmJXRnpkR1Z5TDB4SlEwVk9VMFVwWEc0Z0tpQXRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMVnh1SUNvdlhHNXBiWEJ2Y25RZ1FtbHVaR1Z5SUdaeWIyMGdKeTR2WW1sdVpHVnlKMXh1WEc1amIyNXpkQ0JKYm5Sc0lEMGdLQ2dwSUQwK0lIdGNiaUFnTHlvcVhHNGdJQ0FxSUMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFZ4dUlDQWdLaUJEYjI1emRHRnVkSE5jYmlBZ0lDb2dMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRYRzRnSUNBcUwxeHVYRzRnSUdOdmJuTjBJRTVCVFVVZ1BTQW5TVzUwYkNkY2JpQWdZMjl1YzNRZ1ZrVlNVMGxQVGlBOUlDY3lMakF1TUNkY2JpQWdZMjl1YzNRZ1JFVkdRVlZNVkY5UVVrOVFSVkpVU1VWVElEMGdlMXh1SUNBZ0lHWmhiR3hpWVdOclRHOWpZV3hsT2lBblpXNG5MRnh1SUNBZ0lHeHZZMkZzWlRvZ0oyVnVKeXhjYmlBZ0lDQmhkWFJ2UW1sdVpEb2dkSEoxWlN4Y2JpQWdJQ0JrWVhSaE9pQnVkV3hzTEZ4dUlDQjlYRzVjYmlBZ0x5b3FYRzRnSUNBcUlDMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExWeHVJQ0FnS2lCRGJHRnpjeUJFWldacGJtbDBhVzl1WEc0Z0lDQXFJQzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMVnh1SUNBZ0tpOWNibHh1SUNCamJHRnpjeUJKYm5Sc0lIdGNiaUFnSUNBdktpcGNiaUFnSUNBZ0tpQkRjbVZoZEdWeklHRnVJR2x1YzNSaGJtTmxJRzltSUVsdWRHd3VYRzRnSUNBZ0lDb2dRSEJoY21GdElIdG1ZV3hzWW1GamEweHZZMkZzWlRvZ2MzUnlhVzVuTENCc2IyTmhiR1U2SUhOMGNtbHVaeXdnWVhWMGIwSnBibVE2SUdKdmIyeGxZVzRzSUdSaGRHRTZJSHRiYkdGdVp6b2djM1J5YVc1blhUb2dlMXRyWlhrNklITjBjbWx1WjEwNklITjBjbWx1WjMxOWZWeHVJQ0FnSUNBcUwxeHVJQ0FnSUdOdmJuTjBjblZqZEc5eUtHOXdkR2x2Ym5NZ1BTQjdmU2tnZTF4dUlDQWdJQ0FnZEdocGN5NXZjSFJwYjI1eklEMGdUMkpxWldOMExtRnpjMmxuYmloRVJVWkJWVXhVWDFCU1QxQkZVbFJKUlZNc0lHOXdkR2x2Ym5NcFhHNWNiaUFnSUNBZ0lHbG1JQ2gwZVhCbGIyWWdkR2hwY3k1dmNIUnBiMjV6TG1aaGJHeGlZV05yVEc5allXeGxJQ0U5UFNBbmMzUnlhVzVuSnlrZ2UxeHVJQ0FnSUNBZ0lDQjBhSEp2ZHlCdVpYY2dSWEp5YjNJb1lDUjdUa0ZOUlgwdUlGUm9aU0JtWVd4c1ltRmpheUJzYjJOaGJHVWdhWE1nYldGdVpHRjBiM0o1SUdGdVpDQnRkWE4wSUdKbElHRWdjM1J5YVc1bkxtQXBYRzRnSUNBZ0lDQjlYRzVjYmlBZ0lDQWdJR2xtSUNoMGFHbHpMbTl3ZEdsdmJuTXVaR0YwWVNBOVBUMGdiblZzYkNrZ2UxeHVJQ0FnSUNBZ0lDQjBhSEp2ZHlCdVpYY2dSWEp5YjNJb1lDUjdUa0ZOUlgwdUlGUm9aWEpsSUdseklHNXZJSFJ5WVc1emJHRjBhVzl1SUdSaGRHRXVZQ2xjYmlBZ0lDQWdJSDFjYmx4dUlDQWdJQ0FnYVdZZ0tIUjVjR1Z2WmlCMGFHbHpMbTl3ZEdsdmJuTXVaR0YwWVZ0MGFHbHpMbTl3ZEdsdmJuTXVabUZzYkdKaFkydE1iMk5oYkdWZElDRTlQU0FuYjJKcVpXTjBKeWtnZTF4dUlDQWdJQ0FnSUNCMGFISnZkeUJ1WlhjZ1JYSnliM0lvWUNSN1RrRk5SWDB1SUZSb1pTQm1ZV3hzWW1GamF5QnNiMk5oYkdVZ2JYVnpkQ0J1WldObGMzTmhjbWxzZVNCb1lYWmxJSFJ5WVc1emJHRjBhVzl1SUdSaGRHRXVZQ2xjYmlBZ0lDQWdJSDFjYmx4dUlDQWdJQ0FnZEdocGN5NXpaWFJNYjJOaGJHVW9kR2hwY3k1dmNIUnBiMjV6TG14dlkyRnNaU3dnZEdocGN5NXZjSFJwYjI1ekxtRjFkRzlDYVc1a0tWeHVJQ0FnSUgxY2JseHVJQ0FnSUhOMFlYUnBZeUJuWlhRZ2RtVnljMmx2YmlncElIdGNiaUFnSUNBZ0lISmxkSFZ5YmlCZ0pIdE9RVTFGZlM0a2UxWkZVbE5KVDA1OVlGeHVJQ0FnSUgxY2JseHVJQ0FnSUdkbGRFeHZZMkZzWlNncElIdGNiaUFnSUNBZ0lISmxkSFZ5YmlCMGFHbHpMbTl3ZEdsdmJuTXViRzlqWVd4bFhHNGdJQ0FnZlZ4dVhHNGdJQ0FnWjJWMFJtRnNiR0poWTJ0TWIyTmhiR1VvS1NCN1hHNGdJQ0FnSUNCeVpYUjFjbTRnZEdocGN5NXZjSFJwYjI1ekxtWmhiR3hpWVdOclRHOWpZV3hsWEc0Z0lDQWdmVnh1WEc0Z0lDQWdMeW9xWEc0Z0lDQWdJQ29nVTJWMElHUmxabUYxYkhRZ2JHOWpZV3hsWEc0Z0lDQWdJQ29nUUhCaGNtRnRJSHR6ZEhKcGJtZDlJR3h2WTJGc1pWeHVJQ0FnSUNBcUlFQndZWEpoYlNCN1ltOXZiR1ZoYm4wZ1czVndaR0YwWlVoVVRVdzlkSEoxWlYxY2JpQWdJQ0FnS2k5Y2JpQWdJQ0J6WlhSTWIyTmhiR1VvYkc5allXeGxMQ0IxY0dSaGRHVklWRTFNSUQwZ2RISjFaU2tnZTF4dUlDQWdJQ0FnYVdZZ0tIUjVjR1Z2WmlCMGFHbHpMbTl3ZEdsdmJuTXVaR0YwWVZ0c2IyTmhiR1ZkSUNFOVBTQW5iMkpxWldOMEp5a2dlMXh1SUNBZ0lDQWdJQ0JqYjI1emIyeGxMbVZ5Y205eUtHQWtlMDVCVFVWOUxpQWtlMnh2WTJGc1pYMGdhR0Z6SUc1dklHUmhkR0VzSUdaaGJHeGlZV05ySUdsdUlDUjdkR2hwY3k1dmNIUnBiMjV6TG1aaGJHeGlZV05yVEc5allXeGxmUzVnS1Z4dUlDQWdJQ0FnZlNCbGJITmxJSHRjYmlBZ0lDQWdJQ0FnZEdocGN5NXZjSFJwYjI1ekxteHZZMkZzWlNBOUlHeHZZMkZzWlZ4dUlDQWdJQ0FnZlZ4dVhHNGdJQ0FnSUNCcFppQW9kWEJrWVhSbFNGUk5UQ2tnZTF4dUlDQWdJQ0FnSUNCMGFHbHpMblZ3WkdGMFpVaDBiV3dvS1Z4dUlDQWdJQ0FnZlZ4dUlDQWdJSDFjYmx4dUlDQWdJR2RsZEV4aGJtZDFZV2RsY3lncElIdGNiaUFnSUNBZ0lISmxkSFZ5YmlCUFltcGxZM1F1YTJWNWN5aDBhR2x6TG05d2RHbHZibk11WkdGMFlTbGNiaUFnSUNCOVhHNWNiaUFnSUNCcGJuTmxjblJXWVd4MVpYTW9kbUZzZFdVZ1BTQnVkV3hzTENCcGJtcGxZM1JoWW14bFZtRnNkV1Z6SUQwZ2UzMHBJSHRjYmlBZ0lDQWdJR2xtSUNoMGVYQmxiMllnZG1Gc2RXVWdJVDA5SUNkemRISnBibWNuS1NCN1hHNGdJQ0FnSUNBZ0lISmxkSFZ5YmlCMWJtUmxabWx1WldSY2JpQWdJQ0FnSUgxY2JseHVJQ0FnSUNBZ1kyOXVjM1FnYldGMFkyZ2dQU0IyWVd4MVpTNXRZWFJqYUNndk9paGJZUzE2UVMxYUxWOHdMVGxkS3lrdktWeHVJQ0FnSUNBZ2FXWWdLRzFoZEdOb0tTQjdYRzRnSUNBZ0lDQWdJSFpoYkhWbElEMGdkbUZzZFdVdWNtVndiR0ZqWlNodFlYUmphRnN3WFN3Z2FXNXFaV04wWVdKc1pWWmhiSFZsYzF0dFlYUmphRnN4WFYwcFhHNGdJQ0FnSUNCOVhHNWNiaUFnSUNBZ0lHbG1JQ2gyWVd4MVpTNXRZWFJqYUNndk9paGJZUzE2UVMxYUxWOHdMVGxkS3lrdktTa2dlMXh1SUNBZ0lDQWdJQ0J5WlhSMWNtNGdkR2hwY3k1cGJuTmxjblJXWVd4MVpYTW9kbUZzZFdVc0lHbHVhbVZqZEdGaWJHVldZV3gxWlhNcFhHNGdJQ0FnSUNCOVhHNWNiaUFnSUNBZ0lISmxkSFZ5YmlCMllXeDFaVnh1SUNBZ0lIMWNibHh1SUNBZ0lIUnlZVzV6YkdGMFpTaHJaWGxPWVcxbElEMGdiblZzYkN3Z2FXNXFaV04wSUQwZ2UzMHBJSHRjYmlBZ0lDQWdJR3hsZENCa1lYUmhJRDBnZEdocGN5NXZjSFJwYjI1ekxtUmhkR0ZiZEdocGN5NXZjSFJwYjI1ekxteHZZMkZzWlYxY2JpQWdJQ0FnSUdsbUlDZ2haR0YwWVNrZ2UxeHVJQ0FnSUNBZ0lDQmtZWFJoSUQwZ2RHaHBjeTV2Y0hScGIyNXpMbVJoZEdGYmRHaHBjeTV2Y0hScGIyNXpMbVpoYkd4aVlXTnJURzlqWVd4bFhWeHVJQ0FnSUNBZ2ZWeHVYRzRnSUNBZ0lDQnBaaUFvYTJWNVRtRnRaU0E5UFQwZ2JuVnNiQ0I4ZkNCclpYbE9ZVzFsSUQwOVBTQW5LaWNnZkh3Z1FYSnlZWGt1YVhOQmNuSmhlU2hyWlhsT1lXMWxLU2tnZTF4dUlDQWdJQ0FnSUNCcFppQW9RWEp5WVhrdWFYTkJjbkpoZVNoclpYbE9ZVzFsS1NrZ2UxeHVJQ0FnSUNBZ0lDQWdJR052Ym5OMElHdGxlWE1nUFNCUFltcGxZM1F1YTJWNWN5aGtZWFJoS1M1bWFXeDBaWElvYTJWNUlEMCtJR3RsZVU1aGJXVXVhVzVrWlhoUFppaHJaWGtwSUQ0Z0xURXBYRzRnSUNBZ0lDQWdJQ0FnWTI5dWMzUWdabWxzZEdWeVpXUkVZWFJoSUQwZ2UzMWNiaUFnSUNBZ0lDQWdJQ0JyWlhsekxtWnZja1ZoWTJnb2EyVjVJRDArSUh0Y2JpQWdJQ0FnSUNBZ0lDQWdJR1pwYkhSbGNtVmtSR0YwWVZ0clpYbGRJRDBnZEdocGN5NXBibk5sY25SV1lXeDFaWE1vWkdGMFlWdHJaWGxkTENCcGJtcGxZM1FwWEc0Z0lDQWdJQ0FnSUNBZ2ZTbGNiaUFnSUNBZ0lDQWdJQ0JrWVhSaElEMGdabWxzZEdWeVpXUkVZWFJoWEc0Z0lDQWdJQ0FnSUgxY2JseHVJQ0FnSUNBZ0lDQmpiMjV6ZENCa1lYUmhUV0Z3SUQwZ2UzMWNiaUFnSUNBZ0lDQWdabTl5SUNoamIyNXpkQ0JyWlhrZ2FXNGdaR0YwWVNrZ2UxeHVJQ0FnSUNBZ0lDQWdJR1JoZEdGTllYQmJhMlY1WFNBOUlIUm9hWE11YVc1elpYSjBWbUZzZFdWektHUmhkR0ZiYTJWNVhTd2dhVzVxWldOMEtWeHVJQ0FnSUNBZ0lDQjlYRzVjYmlBZ0lDQWdJQ0FnY21WMGRYSnVJR1JoZEdGTllYQmNiaUFnSUNBZ0lIMWNibHh1SUNBZ0lDQWdjbVYwZFhKdUlIUm9hWE11YVc1elpYSjBWbUZzZFdWektHUmhkR0ZiYTJWNVRtRnRaVjBzSUdsdWFtVmpkQ2xjYmlBZ0lDQjlYRzVjYmlBZ0lDQXZMeUJoYkdsaGN5QnZaaUIwS0NsY2JpQWdJQ0IwS0d0bGVVNWhiV1VnUFNCdWRXeHNMQ0JwYm1wbFkzUWdQU0I3ZlNrZ2UxeHVJQ0FnSUNBZ2NtVjBkWEp1SUhSb2FYTXVkSEpoYm5Oc1lYUmxLR3RsZVU1aGJXVXNJR2x1YW1WamRDbGNiaUFnSUNCOVhHNWNiaUFnSUNBdktpcGNiaUFnSUNBZ0tpQlZjR1JoZEdWeklIUm9aU0JJVkUxTUlIWnBaWGR6WEc0Z0lDQWdJQ29nUUhCaGNtRnRJSHRJVkUxTVJXeGxiV1Z1ZEgwZ1pXeGxiV1Z1ZEZ4dUlDQWdJQ0FxTDF4dUlDQWdJSFZ3WkdGMFpVaDBiV3dvWld4bGJXVnVkQ2tnZTF4dUlDQWdJQ0FnYVdZZ0tIUjVjR1Z2WmlCbGJHVnRaVzUwSUQwOVBTQW5kVzVrWldacGJtVmtKeWtnZTF4dUlDQWdJQ0FnSUNCbGJHVnRaVzUwSUQwZ1pHOWpkVzFsYm5RdWNYVmxjbmxUWld4bFkzUnZja0ZzYkNnblcyUmhkR0V0YVRFNGJsMG5LVnh1SUNBZ0lDQWdmVnh1WEc0Z0lDQWdJQ0JwWmlBb2RIbHdaVzltSUdWc1pXMWxiblFnUFQwOUlDZHpkSEpwYm1jbktTQjdYRzRnSUNBZ0lDQWdJR1ZzWlcxbGJuUWdQU0JrYjJOMWJXVnVkQzV4ZFdWeWVWTmxiR1ZqZEc5eUtHVnNaVzFsYm5RcFhHNGdJQ0FnSUNCOVhHNWNiaUFnSUNBZ0lHNWxkeUJDYVc1a1pYSW9aV3hsYldWdWRDd2dkR2hwY3k1MEtDa3BYRzRnSUNBZ2ZWeHVYRzRnSUNBZ0x5OGdjM1JoZEdsalhHNGdJQ0FnYzNSaGRHbGpJRjlFVDAxSmJuUmxjbVpoWTJVb2IzQjBhVzl1Y3lrZ2UxeHVJQ0FnSUNBZ2NtVjBkWEp1SUc1bGR5QkpiblJzS0c5d2RHbHZibk1wWEc0Z0lDQWdmVnh1SUNCOVhHNWNiaUFnY21WMGRYSnVJRWx1ZEd4Y2JuMHBLQ2xjYmx4dVpYaHdiM0owSUdSbFptRjFiSFFnU1c1MGJGeHVJaXdpTHlvcVhHNGdLaUF0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFZ4dUlDb2dUR2xqWlc1elpXUWdkVzVrWlhJZ1RVbFVJQ2hvZEhSd2N6b3ZMMmRwZEdoMVlpNWpiMjB2Y1hWaGNtc3RaR1YyTDFCb2IyNXZiaTFHY21GdFpYZHZjbXN2WW14dllpOXRZWE4wWlhJdlRFbERSVTVUUlNsY2JpQXFJQzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0WEc0Z0tpOWNibHh1YVcxd2IzSjBJRkJoWjJVZ1puSnZiU0FuTGk5d1lXZGxKMXh1YVcxd2IzSjBJRVYyWlc1MElHWnliMjBnSnk0dUx5NHVMMk52YlcxdmJpOWxkbVZ1ZEhNblhHNWNibU52Ym5OMElGQmhaMlZ5SUQwZ0tDZ3BJRDArSUh0Y2JpQWdMeW9xWEc0Z0lDQXFJQzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMVnh1SUNBZ0tpQkRiMjV6ZEdGdWRITmNiaUFnSUNvZ0xTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdFhHNGdJQ0FxTDF4dVhHNGdJR052Ym5OMElFNUJUVVVnUFNBbmNHRm5aWEluWEc0Z0lHTnZibk4wSUZaRlVsTkpUMDRnUFNBbk1pNHdMakFuWEc0Z0lHTnZibk4wSUVSRlJrRlZURlJmVUZKUFVFVlNWRWxGVXlBOUlIdGNiaUFnSUNCb1lYTm9VSEpsWm1sNE9pQW5JeUVuTEZ4dUlDQWdJSFZ6WlVoaGMyZzZJSFJ5ZFdVc1hHNGdJQ0FnWkdWbVlYVnNkRkJoWjJVNklHNTFiR3dzWEc0Z0lDQWdZVzVwYldGMFpWQmhaMlZ6T2lCMGNuVmxMRnh1SUNCOVhHNWNiaUFnYkdWMElHTjFjbkpsYm5SUVlXZGxYRzRnSUM4cUtseHVJQ0FnS2lBdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMxY2JpQWdJQ29nUTJ4aGMzTWdSR1ZtYVc1cGRHbHZibHh1SUNBZ0tpQXRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMWNiaUFnSUNvdlhHNWNiaUFnWTJ4aGMzTWdVR0ZuWlhJZ2UxeHVJQ0FnSUM4cUtseHVJQ0FnSUNBcUlFQmpiMjV6ZEhKMVkzUnZjbHh1SUNBZ0lDQXFYRzRnSUNBZ0lDb2dRSEJoY21GdElHOXdkR2x2Ym5NZ2UwOWlhbVZqZEgxY2JpQWdJQ0FnS2k5Y2JpQWdJQ0JqYjI1emRISjFZM1J2Y2lodmNIUnBiMjV6SUQwZ2UzMHBJSHRjYmlBZ0lDQWdJSFJvYVhNdWIzQjBhVzl1Y3lBOUlFOWlhbVZqZEM1aGMzTnBaMjRvUkVWR1FWVk1WRjlRVWs5UVJWSlVTVVZUTENCdmNIUnBiMjV6S1Z4dVhHNGdJQ0FnSUNCMGFHbHpMbkJoWjJWeklEMGdXMTFjYmlBZ0lDQWdJSFJvYVhNdWMzUmhjblJsWkNBOUlHWmhiSE5sWEc1Y2JpQWdJQ0FnSUM4dklHRmtaQ0JuYkc5aVlXd2diR2x6ZEdWdVpYSnpJSE4xWTJnZ1lYTm9JR2hoYzJnZ1kyaGhibWRsTENCdVlYWnBaMkYwYVc5dUxDQmxkR011WEc0Z0lDQWdJQ0IwYUdsekxtRmtaRkJoWjJWeVJYWmxiblJ6S0NsY2JseHVJQ0FnSUNBZ0x5OGdabUZ6ZEdWeUlIZGhlU0IwYnlCcGJtbDBJSEJoWjJWeklHSmxabTl5WlNCMGFHVWdSRTlOSUdseklISmxZV1I1WEc0Z0lDQWdJQ0IwYUdsekxtOXVSRTlOVEc5aFpHVmtLQ2xjYmlBZ0lDQjlYRzVjYmlBZ0lDQXZMeUJ3Y21sMllYUmxYRzRnSUNBZ1h5aHpaV3hsWTNSdmNpa2dlMXh1SUNBZ0lDQWdjbVYwZFhKdUlHUnZZM1Z0Wlc1MExuRjFaWEo1VTJWc1pXTjBiM0lvYzJWc1pXTjBiM0lwWEc0Z0lDQWdmVnh1WEc0Z0lDQWdaMlYwU0dGemFDZ3BJSHRjYmlBZ0lDQWdJSEpsZEhWeWJpQjNhVzVrYjNjdWJHOWpZWFJwYjI0dWFHRnphQzV6Y0d4cGRDaDBhR2x6TG05d2RHbHZibk11YUdGemFGQnlaV1pwZUNsYk1WMWNiaUFnSUNCOVhHNWNiaUFnSUNCblpYUlFZV2RsUm5KdmJVaGhjMmdvS1NCN1hHNGdJQ0FnSUNCamIyNXpkQ0JvWVhOb0lEMGdkR2hwY3k1blpYUklZWE5vS0NsY2JpQWdJQ0FnSUdOdmJuTjBJSEpsSUQwZ2JtVjNJRkpsWjBWNGNDZ25XejljWEM5ZEtGdGVYRnd2WFNvcEp5bGNiaUFnSUNBZ0lHTnZibk4wSUcxaGRHTm9aWE1nUFNCeVpTNWxlR1ZqS0doaGMyZ3BYRzVjYmlBZ0lDQWdJR2xtSUNodFlYUmphR1Z6SUNZbUlHMWhkR05vWlhOYk1WMHBJSHRjYmlBZ0lDQWdJQ0FnY21WMGRYSnVJRzFoZEdOb1pYTmJNVjFjYmlBZ0lDQWdJSDFjYmx4dUlDQWdJQ0FnY21WMGRYSnVJRzUxYkd4Y2JpQWdJQ0I5WEc1Y2JpQWdJQ0J6WlhSSVlYTm9LSEJoWjJWT1lXMWxLU0I3WEc0Z0lDQWdJQ0IzYVc1a2IzY3ViRzlqWVhScGIyNHVhR0Z6YUNBOUlHQWtlM1JvYVhNdWIzQjBhVzl1Y3k1b1lYTm9VSEpsWm1sNGZTOGtlM0JoWjJWT1lXMWxmV0JjYmlBZ0lDQjlYRzVjYmlBZ0lDQmhjbVZUWVcxbFVHRm5aU2h3WVdkbFRtRnRaVEVzSUhCaFoyVk9ZVzFsTWlrZ2UxeHVJQ0FnSUNBZ1kyOXVjM1FnY0dGblpURWdQU0IwYUdsekxtZGxkRkJoWjJWTmIyUmxiQ2h3WVdkbFRtRnRaVEVwWEc0Z0lDQWdJQ0JqYjI1emRDQndZV2RsTWlBOUlIUm9hWE11WjJWMFVHRm5aVTF2WkdWc0tIQmhaMlZPWVcxbE1pbGNiaUFnSUNBZ0lISmxkSFZ5YmlCd1lXZGxNU0FtSmlCd1lXZGxNaUFtSmlCd1lXZGxNUzV1WVcxbElEMDlQU0J3WVdkbE1pNXVZVzFsWEc0Z0lDQWdmVnh1WEc0Z0lDQWdMeW9xWEc0Z0lDQWdJQ29nUVhSMFlXTm9aWE1nZEdobElHMWhhVzRnWlhabGJuUnpJR1p2Y2lCMGNtRmphMmx1WnlCb1lYTm9JR05vWVc1blpYTXNYRzRnSUNBZ0lDb2dZMnhwWTJzZ2IyNGdibUYyYVdkaGRHbHZiaUJpZFhSMGIyNXpJR0Z1WkNCc2FXNXJjeUJoYm1RZ1ltRmpheUJvYVhOMGIzSjVYRzRnSUNBZ0lDb3ZYRzRnSUNBZ1lXUmtVR0ZuWlhKRmRtVnVkSE1vS1NCN1hHNGdJQ0FnSUNCa2IyTjFiV1Z1ZEM1aFpHUkZkbVZ1ZEV4cGMzUmxibVZ5S0NkamJHbGpheWNzSUdWMlpXNTBJRDArSUhSb2FYTXViMjVEYkdsamF5aGxkbVZ1ZENrcFhHNGdJQ0FnSUNCM2FXNWtiM2N1WVdSa1JYWmxiblJNYVhOMFpXNWxjaWduY0c5d2MzUmhkR1VuTENCbGRtVnVkQ0E5UGlCMGFHbHpMbTl1UW1GamEwaHBjM1J2Y25rb1pYWmxiblFwS1Z4dUlDQWdJQ0FnZDJsdVpHOTNMbUZrWkVWMlpXNTBUR2x6ZEdWdVpYSW9KMmhoYzJoamFHRnVaMlVuTENCbGRtVnVkQ0E5UGlCMGFHbHpMbTl1U0dGemFFTm9ZVzVuWlNobGRtVnVkQ2twWEc0Z0lDQWdJQ0JrYjJOMWJXVnVkQzVoWkdSRmRtVnVkRXhwYzNSbGJtVnlLQ2RFVDAxRGIyNTBaVzUwVEc5aFpHVmtKeXdnWlhabGJuUWdQVDRnZEdocGN5NXZia1JQVFV4dllXUmxaQ2hsZG1WdWRDa3BYRzRnSUNBZ2ZWeHVYRzRnSUNBZ0x5OGdaMlYwZEdWeWMxeHVYRzRnSUNBZ2MzUmhkR2xqSUdkbGRDQjJaWEp6YVc5dUtDa2dlMXh1SUNBZ0lDQWdjbVYwZFhKdUlHQWtlMDVCVFVWOUxpUjdWa1ZTVTBsUFRuMWdYRzRnSUNBZ2ZWeHVYRzRnSUNBZ0x5OGdjSFZpYkdsalhHNWNiaUFnSUNCemFHOTNVR0ZuWlNod1lXZGxUbUZ0WlN3Z1lXUmtWRzlJYVhOMGIzSjVJRDBnZEhKMVpTd2dZbUZqYXlBOUlHWmhiSE5sS1NCN1hHNGdJQ0FnSUNCamIyNXpkQ0J2YkdSUVlXZGxJRDBnZEdocGN5NWZLQ2N1WTNWeWNtVnVkQ2NwWEc0Z0lDQWdJQ0JwWmlBb2IyeGtVR0ZuWlNrZ2UxeHVJQ0FnSUNBZ0lDQmpiMjV6ZENCdmJHUlFZV2RsVG1GdFpTQTlJRzlzWkZCaFoyVXVaMlYwUVhSMGNtbGlkWFJsS0Nka1lYUmhMWEJoWjJVbktWeHVYRzRnSUNBZ0lDQWdJR2xtSUNoMGFHbHpMbUZ5WlZOaGJXVlFZV2RsS0hCaFoyVk9ZVzFsTENCdmJHUlFZV2RsVG1GdFpTa3BJSHRjYmlBZ0lDQWdJQ0FnSUNCeVpYUjFjbTVjYmlBZ0lDQWdJQ0FnZlZ4dVhHNGdJQ0FnSUNBZ0lHOXNaRkJoWjJVdVkyeGhjM05NYVhOMExuSmxiVzkyWlNnblkzVnljbVZ1ZENjcFhHNWNiaUFnSUNBZ0lDQWdMeThnYUdsemRHOXllVnh1SUNBZ0lDQWdJQ0IzYVc1a2IzY3VhR2x6ZEc5eWVTNXlaWEJzWVdObFUzUmhkR1VvZXlCd1lXZGxPaUJ2YkdSUVlXZGxUbUZ0WlNCOUxDQnZiR1JRWVdkbFRtRnRaU3dnZDJsdVpHOTNMbXh2WTJGMGFXOXVMbWh5WldZcFhHNWNiaUFnSUNBZ0lDQWdkR2hwY3k1MGNtbG5aMlZ5VUdGblpVVjJaVzUwS0c5c1pGQmhaMlZPWVcxbExDQkZkbVZ1ZEM1SVNVUkZLVnh1SUNBZ0lDQWdmVnh1WEc0Z0lDQWdJQ0IwYUdsekxuUnlhV2RuWlhKUVlXZGxSWFpsYm5Rb2NHRm5aVTVoYldVc0lFVjJaVzUwTGxOSVQxY3BYRzVjYmlBZ0lDQWdJR04xY25KbGJuUlFZV2RsSUQwZ2NHRm5aVTVoYldWY2JseHVJQ0FnSUNBZ0x5OGdibVYzSUhCaFoyVmNiaUFnSUNBZ0lHTnZibk4wSUc1bGQxQmhaMlVnUFNCMGFHbHpMbDhvWUZ0a1lYUmhMWEJoWjJVOVhDSWtlM0JoWjJWT1lXMWxmVndpWFdBcFhHNWNiaUFnSUNBZ0lHNWxkMUJoWjJVdVkyeGhjM05NYVhOMExtRmtaQ2duWTNWeWNtVnVkQ2NwWEc1Y2JpQWdJQ0FnSUM4dklIUmxiWEJzWVhSbElHeHZZV1JsY2x4dUlDQWdJQ0FnWTI5dWMzUWdjR0ZuWlUxdlpHVnNJRDBnZEdocGN5NW5aWFJRWVdkbFRXOWtaV3dvY0dGblpVNWhiV1VwWEc1Y2JpQWdJQ0FnSUM4dklFQjBiMlJ2T2lCMWMyVWdkR1Z0Y0d4aGRHVWdZMkZqYUdVL1hHNGdJQ0FnSUNCcFppQW9jR0ZuWlUxdlpHVnNJQ1ltSUhCaFoyVk5iMlJsYkM1blpYUlVaVzF3YkdGMFpTZ3BLU0I3WEc0Z0lDQWdJQ0FnSUhCaFoyVk5iMlJsYkM1c2IyRmtWR1Z0Y0d4aGRHVW9LVnh1SUNBZ0lDQWdmVnh1SUNBZ0lDQWdMeThnWlc1a1hHNWNiaUFnSUNBZ0lHbG1JQ2h2YkdSUVlXZGxLU0I3WEc0Z0lDQWdJQ0FnSUdOdmJuTjBJRzlzWkZCaFoyVk9ZVzFsSUQwZ2IyeGtVR0ZuWlM1blpYUkJkSFJ5YVdKMWRHVW9KMlJoZEdFdGNHRm5aU2NwWEc0Z0lDQWdJQ0FnSUM4dklIVnpaU0J2WmlCd2NtOTBiM1I1Y0dVdGIzSnBaVzUwWldRZ2JHRnVaM1ZoWjJWY2JpQWdJQ0FnSUNBZ2IyeGtVR0ZuWlM1aVlXTnJJRDBnWW1GamExeHVJQ0FnSUNBZ0lDQnZiR1JRWVdkbExuQnlaWFpwYjNWelVHRm5aVTVoYldVZ1BTQnZiR1JRWVdkbFRtRnRaVnh1WEc0Z0lDQWdJQ0FnSUdOdmJuTjBJRzl1VUdGblpVRnVhVzFoZEdsdmJrVnVaQ0E5SUNncElEMCtJSHRjYmlBZ0lDQWdJQ0FnSUNCcFppQW9iMnhrVUdGblpTNWpiR0Z6YzB4cGMzUXVZMjl1ZEdGcGJuTW9KMkZ1YVcxaGRHVW5LU2tnZTF4dUlDQWdJQ0FnSUNBZ0lDQWdiMnhrVUdGblpTNWpiR0Z6YzB4cGMzUXVjbVZ0YjNabEtDZGhibWx0WVhSbEp5bGNiaUFnSUNBZ0lDQWdJQ0I5WEc1Y2JpQWdJQ0FnSUNBZ0lDQnZiR1JRWVdkbExtTnNZWE56VEdsemRDNXlaVzF2ZG1Vb2IyeGtVR0ZuWlM1aVlXTnJJRDhnSjNCdmNDMXdZV2RsSnlBNklDZHdkWE5vTFhCaFoyVW5LVnh1WEc0Z0lDQWdJQ0FnSUNBZ2RHaHBjeTUwY21sbloyVnlVR0ZuWlVWMlpXNTBLR04xY25KbGJuUlFZV2RsTENCRmRtVnVkQzVUU0U5WFRpbGNiaUFnSUNBZ0lDQWdJQ0IwYUdsekxuUnlhV2RuWlhKUVlXZGxSWFpsYm5Rb2IyeGtVR0ZuWlM1d2NtVjJhVzkxYzFCaFoyVk9ZVzFsTENCRmRtVnVkQzVJU1VSRVJVNHBYRzVjYmlBZ0lDQWdJQ0FnSUNCdmJHUlFZV2RsTG5KbGJXOTJaVVYyWlc1MFRHbHpkR1Z1WlhJb1JYWmxiblF1UVU1SlRVRlVTVTlPWDBWT1JDd2diMjVRWVdkbFFXNXBiV0YwYVc5dVJXNWtLVnh1SUNBZ0lDQWdJQ0I5WEc1Y2JpQWdJQ0FnSUNBZ2FXWWdLSFJvYVhNdWIzQjBhVzl1Y3k1aGJtbHRZWFJsVUdGblpYTXBJSHRjYmlBZ0lDQWdJQ0FnSUNCdmJHUlFZV2RsTG1Ga1pFVjJaVzUwVEdsemRHVnVaWElvUlhabGJuUXVRVTVKVFVGVVNVOU9YMFZPUkN3Z2IyNVFZV2RsUVc1cGJXRjBhVzl1Ulc1a0tWeHVJQ0FnSUNBZ0lDQWdJRzlzWkZCaFoyVXVZMnhoYzNOTWFYTjBMbUZrWkNnbllXNXBiV0YwWlNjcFhHNGdJQ0FnSUNBZ0lIMGdaV3h6WlNCN1hHNGdJQ0FnSUNBZ0lDQWdiMjVRWVdkbFFXNXBiV0YwYVc5dVJXNWtLQ2xjYmlBZ0lDQWdJQ0FnZlZ4dVhHNGdJQ0FnSUNBZ0lHOXNaRkJoWjJVdVkyeGhjM05NYVhOMExtRmtaQ2hpWVdOcklEOGdKM0J2Y0Mxd1lXZGxKeUE2SUNkd2RYTm9MWEJoWjJVbktWeHVJQ0FnSUNBZ2ZWeHVJQ0FnSUgxY2JseHVJQ0FnSUdGa1pGVnVhWEYxWlZCaFoyVk5iMlJsYkNod1lXZGxUbUZ0WlNrZ2UxeHVJQ0FnSUNBZ2FXWWdLQ0YwYUdsekxtZGxkRkJoWjJWTmIyUmxiQ2h3WVdkbFRtRnRaU2twSUh0Y2JpQWdJQ0FnSUNBZ2RHaHBjeTV3WVdkbGN5NXdkWE5vS0c1bGR5QlFZV2RsS0hCaFoyVk9ZVzFsS1NsY2JpQWdJQ0FnSUgxY2JpQWdJQ0I5WEc1Y2JpQWdJQ0JuWlhSUVlXZGxUVzlrWld3b2NHRm5aVTVoYldVcElIdGNiaUFnSUNBZ0lISmxkSFZ5YmlCMGFHbHpMbkJoWjJWekxtWnBibVFvY0dGblpTQTlQaUJ3WVdkbExtNWhiV1VnUFQwOUlIQmhaMlZPWVcxbEtWeHVJQ0FnSUgxY2JseHVJQ0FnSUdkbGRGQmhaMlZ6VFc5a1pXd29jR0ZuWlU1aGJXVnpLU0I3WEc0Z0lDQWdJQ0J5WlhSMWNtNGdkR2hwY3k1d1lXZGxjeTVtYVd4MFpYSW9jR0ZuWlNBOVBpQndZV2RsVG1GdFpYTXVhVzVrWlhoUFppaHdZV2RsTG01aGJXVXBJRDRnTFRFcFhHNGdJQ0FnZlZ4dVhHNGdJQ0FnYzJWc1pXTjBiM0pVYjBGeWNtRjVLSE4wY2lrZ2UxeHVJQ0FnSUNBZ2NtVjBkWEp1SUhOMGNpNXpjR3hwZENnbkxDY3BMbTFoY0NocGRHVnRJRDArSUdsMFpXMHVkSEpwYlNncEtWeHVJQ0FnSUgxY2JseHVJQ0FnSUdGa1pFVjJaVzUwY3loallXeHNZbUZqYXlrZ2UxeHVJQ0FnSUNBZ2FXWWdLSFJvYVhNdVkyRmphR1ZRWVdkbFUyVnNaV04wYjNJZ1BUMDlJQ2NxSnlrZ2UxeHVJQ0FnSUNBZ0lDQXZMeUJoWkdRZ2RHOGdZV3hzSUhCaFoyVWdiVzlrWld4elhHNGdJQ0FnSUNBZ0lIUm9hWE11Y0dGblpYTXVabTl5UldGamFDZ29jR0ZuWlNrZ1BUNGdlMXh1SUNBZ0lDQWdJQ0FnSUhCaFoyVXVZV1JrUlhabGJuUkRZV3hzWW1GamF5aGpZV3hzWW1GamF5bGNiaUFnSUNBZ0lDQWdmU2xjYmlBZ0lDQWdJQ0FnY21WMGRYSnVYRzRnSUNBZ0lDQjlYRzVjYmlBZ0lDQWdJR052Ym5OMElIQmhaMlZOYjJSbGJITWdQU0IwYUdsekxtZGxkRkJoWjJWelRXOWtaV3dvZEdocGN5NXpaV3hsWTNSdmNsUnZRWEp5WVhrb2RHaHBjeTVqWVdOb1pWQmhaMlZUWld4bFkzUnZjaWtzSUhSeWRXVXBYRzRnSUNBZ0lDQndZV2RsVFc5a1pXeHpMbVp2Y2tWaFkyZ29LSEJoWjJVcElEMCtJSHRjYmlBZ0lDQWdJQ0FnY0dGblpTNWhaR1JGZG1WdWRFTmhiR3hpWVdOcktHTmhiR3hpWVdOcktWeHVJQ0FnSUNBZ2ZTbGNiaUFnSUNBZ0lIUm9hWE11WTJGamFHVlFZV2RsVTJWc1pXTjBiM0lnUFNCdWRXeHNYRzRnSUNBZ2ZWeHVYRzRnSUNBZ2RYTmxWR1Z0Y0d4aGRHVW9kR1Z0Y0d4aGRHVlFZWFJvTENCeVpXNWtaWEpHZFc1amRHbHZiaUE5SUc1MWJHd3BJSHRjYmlBZ0lDQWdJR052Ym5OMElIQmhaMlZOYjJSbGJITWdQU0IwYUdsekxtZGxkRkJoWjJWelRXOWtaV3dvZEdocGN5NXpaV3hsWTNSdmNsUnZRWEp5WVhrb2RHaHBjeTVqWVdOb1pWQmhaMlZUWld4bFkzUnZjaWtzSUhSeWRXVXBYRzRnSUNBZ0lDQndZV2RsVFc5a1pXeHpMbVp2Y2tWaFkyZ29LSEJoWjJVcElEMCtJSHRjYmlBZ0lDQWdJQ0FnY0dGblpTNTFjMlZVWlcxd2JHRjBaU2gwWlcxd2JHRjBaVkJoZEdncFhHNGdJQ0FnSUNBZ0lHbG1JQ2gwZVhCbGIyWWdjbVZ1WkdWeVJuVnVZM1JwYjI0Z1BUMDlJQ2RtZFc1amRHbHZiaWNwSUh0Y2JpQWdJQ0FnSUNBZ0lDQndZV2RsTG5WelpWUmxiWEJzWVhSbFVtVnVaR1Z5WlhJb2NtVnVaR1Z5Um5WdVkzUnBiMjRwWEc0Z0lDQWdJQ0FnSUgxY2JpQWdJQ0FnSUgwcFhHNGdJQ0FnSUNCMGFHbHpMbU5oWTJobFVHRm5aVk5sYkdWamRHOXlJRDBnYm5Wc2JGeHVJQ0FnSUgxY2JseHVJQ0FnSUhSeWFXZG5aWEpRWVdkbFJYWmxiblFvY0dGblpVNWhiV1VzSUdWMlpXNTBUbUZ0WlN3Z1pYWmxiblJRWVhKaGJYTWdQU0J1ZFd4c0tTQjdYRzRnSUNBZ0lDQmpiMjV6ZENCd1lXZGxUVzlrWld3Z1BTQjBhR2x6TG1kbGRGQmhaMlZOYjJSbGJDaHdZV2RsVG1GdFpTbGNiaUFnSUNBZ0lHbG1JQ2h3WVdkbFRXOWtaV3dwSUh0Y2JpQWdJQ0FnSUNBZ2NHRm5aVTF2WkdWc0xuUnlhV2RuWlhKVFkyOXdaWE1vWlhabGJuUk9ZVzFsTENCbGRtVnVkRkJoY21GdGN5bGNiaUFnSUNBZ0lIMWNiaUFnSUNCOVhHNWNiaUFnSUNCdmJrTnNhV05yS0dWMlpXNTBLU0I3WEc0Z0lDQWdJQ0JqYjI1emRDQndZV2RsVG1GdFpTQTlJR1YyWlc1MExuUmhjbWRsZEM1blpYUkJkSFJ5YVdKMWRHVW9KMlJoZEdFdGJtRjJhV2RoZEdVbktWeHVJQ0FnSUNBZ1kyOXVjM1FnY0hWemFGQmhaMlVnUFNBaEtHVjJaVzUwTG5SaGNtZGxkQzVuWlhSQmRIUnlhV0oxZEdVb0oyUmhkR0V0Y0c5d0xYQmhaMlVuS1NBOVBUMGdKM1J5ZFdVbktWeHVYRzRnSUNBZ0lDQnBaaUFvY0dGblpVNWhiV1VwSUh0Y2JpQWdJQ0FnSUNBZ2FXWWdLSEJoWjJWT1lXMWxJRDA5UFNBbkpHSmhZMnNuS1NCN1hHNGdJQ0FnSUNBZ0lDQWdMeThnZEdobElIQnZjSE4wWVhSbElHVjJaVzUwSUhkcGJHd2dZbVVnZEhKcFoyZGxjbVZrWEc0Z0lDQWdJQ0FnSUNBZ2QybHVaRzkzTG1ocGMzUnZjbmt1WW1GamF5Z3BYRzRnSUNBZ0lDQWdJQ0FnY21WMGRYSnVYRzRnSUNBZ0lDQWdJSDFjYmx4dUlDQWdJQ0FnSUNBdktseHVJQ0FnSUNBZ0lDQWdLaUJKWmlCM1pTQm9aU0IxYzJVZ2RHaGxJR2hoYzJnZ1lYTWdkSEpwWjJkbGNpeGNiaUFnSUNBZ0lDQWdJQ29nZDJVZ1kyaGhibWRsSUdsMElHUjVibUZ0YVdOaGJHeDVJSE52SUhSb1lYUWdkR2hsSUdoaGMyaGphR0Z1WjJVZ1pYWmxiblFnYVhNZ1kyRnNiR1ZrWEc0Z0lDQWdJQ0FnSUNBcUlFOTBhR1Z5ZDJselpTd2dkMlVnYzJodmR5QjBhR1VnY0dGblpWeHVJQ0FnSUNBZ0lDQWdLaTljYmlBZ0lDQWdJQ0FnYVdZZ0tIUm9hWE11YjNCMGFXOXVjeTUxYzJWSVlYTm9LU0I3WEc0Z0lDQWdJQ0FnSUNBZ2RHaHBjeTV6WlhSSVlYTm9LSEJoWjJWT1lXMWxLVnh1SUNBZ0lDQWdJQ0I5SUdWc2MyVWdlMXh1SUNBZ0lDQWdJQ0FnSUhSb2FYTXVjMmh2ZDFCaFoyVW9jR0ZuWlU1aGJXVXNJSFJ5ZFdVc0lIQjFjMmhRWVdkbEtWeHVJQ0FnSUNBZ0lDQjlYRzRnSUNBZ0lDQjlYRzRnSUNBZ2ZWeHVYRzRnSUNBZ2IyNUNZV05yU0dsemRHOXllU2hsZG1WdWRDQTlJSHQ5S1NCN1hHNGdJQ0FnSUNCamIyNXpkQ0J3WVdkbFRtRnRaU0E5SUdWMlpXNTBMbk4wWVhSbElEOGdaWFpsYm5RdWMzUmhkR1V1Y0dGblpTQTZJRzUxYkd4Y2JpQWdJQ0FnSUdsbUlDZ2hjR0ZuWlU1aGJXVXBJSHRjYmlBZ0lDQWdJQ0FnY21WMGRYSnVYRzRnSUNBZ0lDQjlYRzVjYmlBZ0lDQWdJSFJvYVhNdWMyaHZkMUJoWjJVb2NHRm5aVTVoYldVc0lIUnlkV1VzSUhSeWRXVXBYRzRnSUNBZ2ZWeHVYRzRnSUNBZ2IyNUlZWE5vUTJoaGJtZGxLQ2tnZTF4dUlDQWdJQ0FnWTI5dWMzUWdjR0Z5WVcxeklEMGdLSFJvYVhNdVoyVjBTR0Z6YUNncElEOGdkR2hwY3k1blpYUklZWE5vS0NrdWMzQnNhWFFvSnk4bktTQTZJRnRkS1M1bWFXeDBaWElvY0NBOVBpQndMbXhsYm1kMGFDQStJREFwWEc0Z0lDQWdJQ0JwWmlBb2NHRnlZVzF6TG14bGJtZDBhQ0ErSURBcElIdGNiaUFnSUNBZ0lDQWdMeThnY21WdGIzWmxJR1pwY25OMElIWmhiSFZsSUhkb2FXTm9JR2x6SUhSb1pTQndZV2RsSUc1aGJXVmNiaUFnSUNBZ0lDQWdjR0Z5WVcxekxuTm9hV1owS0NsY2JpQWdJQ0FnSUgxY2JseHVJQ0FnSUNBZ2RHaHBjeTUwY21sbloyVnlVR0ZuWlVWMlpXNTBLR04xY25KbGJuUlFZV2RsTENCRmRtVnVkQzVJUVZOSUxDQndZWEpoYlhNcFhHNWNiaUFnSUNBZ0lHTnZibk4wSUc1aGRsQmhaMlVnUFNCMGFHbHpMbWRsZEZCaFoyVkdjbTl0U0dGemFDZ3BYRzRnSUNBZ0lDQnBaaUFvYm1GMlVHRm5aU2tnZTF4dUlDQWdJQ0FnSUNCMGFHbHpMbk5vYjNkUVlXZGxLRzVoZGxCaFoyVXBYRzRnSUNBZ0lDQjlYRzRnSUNBZ2ZWeHVYRzRnSUNBZ0x5b3FYRzRnSUNBZ0lDb2dVWFZsY21sbGN5QjBhR1VnY0dGblpTQnViMlJsY3lCcGJpQjBhR1VnUkU5TlhHNGdJQ0FnSUNvdlhHNGdJQ0FnYjI1RVQwMU1iMkZrWldRb0tTQjdYRzRnSUNBZ0lDQmpiMjV6ZENCd1lXZGxjeUE5SUdSdlkzVnRaVzUwTG5GMVpYSjVVMlZzWldOMGIzSkJiR3dvSjF0a1lYUmhMWEJoWjJWZEp5bGNibHh1SUNBZ0lDQWdhV1lnS0NGd1lXZGxjeWtnZTF4dUlDQWdJQ0FnSUNCeVpYUjFjbTVjYmlBZ0lDQWdJSDFjYmx4dUlDQWdJQ0FnY0dGblpYTXVabTl5UldGamFDZ29jR0ZuWlNrZ1BUNGdlMXh1SUNBZ0lDQWdJQ0JzWlhRZ2NHRm5aVTVoYldVZ1BTQndZV2RsTG1kbGRFRjBkSEpwWW5WMFpTZ25aR0YwWVMxd1lXZGxKeWxjYmlBZ0lDQWdJQ0FnTHlwY2JpQWdJQ0FnSUNBZ0lDb2dkR2hsSUhCaFoyVWdibUZ0WlNCallXNGdZbVVnWjJsMlpXNGdkMmwwYUNCMGFHVWdZWFIwY21saWRYUmxJR1JoZEdFdGNHRm5aVnh1SUNBZ0lDQWdJQ0FnS2lCdmNpQjNhWFJvSUdsMGN5QnViMlJsSUc1aGJXVmNiaUFnSUNBZ0lDQWdJQ292WEc0Z0lDQWdJQ0FnSUdsbUlDZ2hjR0ZuWlU1aGJXVXBJSHRjYmlBZ0lDQWdJQ0FnSUNCd1lXZGxUbUZ0WlNBOUlIQmhaMlV1Ym05a1pVNWhiV1ZjYmlBZ0lDQWdJQ0FnZlZ4dVhHNGdJQ0FnSUNBZ0lIUm9hWE11WVdSa1ZXNXBjWFZsVUdGblpVMXZaR1ZzS0hCaFoyVk9ZVzFsS1Z4dUlDQWdJQ0FnZlNsY2JpQWdJQ0I5WEc1Y2JpQWdJQ0J6Wld4bFkzUW9jR0ZuWlU1aGJXVXNJR0ZrWkZCaFoyVk5iMlJsYkNBOUlIUnlkV1VwSUh0Y2JpQWdJQ0FnSUhSb2FYTXVZMkZqYUdWUVlXZGxVMlZzWldOMGIzSWdQU0J3WVdkbFRtRnRaVnh1WEc0Z0lDQWdJQ0JwWmlBb1lXUmtVR0ZuWlUxdlpHVnNJQ1ltSUhCaFoyVk9ZVzFsSUNFOVBTQW5LaWNwSUh0Y2JpQWdJQ0FnSUNBZ2RHaHBjeTVoWkdSVmJtbHhkV1ZRWVdkbFRXOWtaV3dvY0dGblpVNWhiV1VwWEc0Z0lDQWdJQ0I5WEc1Y2JpQWdJQ0FnSUhKbGRIVnliaUIwYUdselhHNGdJQ0FnZlZ4dVhHNGdJQ0FnYzNSaGNuUW9abTl5WTJWRVpXWmhkV3gwVUdGblpTQTlJR1poYkhObEtTQjdYRzRnSUNBZ0lDQXZMeUJqYUdWamF5QnBaaUIwYUdVZ1lYQndJR2hoY3lCaVpXVnVJR0ZzY21WaFpIa2djM1JoY25SbFpGeHVJQ0FnSUNBZ2FXWWdLSFJvYVhNdWMzUmhjblJsWkNrZ2UxeHVJQ0FnSUNBZ0lDQjBhSEp2ZHlCdVpYY2dSWEp5YjNJb1lDUjdUa0ZOUlgwdUlGUm9aU0JoY0hBZ2FHRnpJR0psWlc0Z1lXeHlaV0ZrZVNCemRHRnlkR1ZrTG1BcFhHNGdJQ0FnSUNCOVhHNWNiaUFnSUNBZ0lIUm9hWE11YzNSaGNuUmxaQ0E5SUhSeWRXVmNibHh1SUNBZ0lDQWdMeThnWm05eVkyVWdaR1ZtWVhWc2RDQndZV2RsSUc5dUlFTnZjbVJ2ZG1GY2JpQWdJQ0FnSUdsbUlDaDNhVzVrYjNjdVkyOXlaRzkyWVNrZ2UxeHVJQ0FnSUNBZ0lDQm1iM0pqWlVSbFptRjFiSFJRWVdkbElEMGdkSEoxWlZ4dUlDQWdJQ0FnZlZ4dVhHNGdJQ0FnSUNCc1pYUWdjR0ZuWlU1aGJXVWdQU0IwYUdsekxtZGxkRkJoWjJWR2NtOXRTR0Z6YUNncFhHNGdJQ0FnSUNCcFppQW9JWFJvYVhNdVoyVjBVR0ZuWlUxdlpHVnNLSEJoWjJWT1lXMWxLU2tnZTF4dUlDQWdJQ0FnSUNCd1lXZGxUbUZ0WlNBOUlIUm9hWE11YjNCMGFXOXVjeTVrWldaaGRXeDBVR0ZuWlZ4dUlDQWdJQ0FnZlZ4dVhHNGdJQ0FnSUNCcFppQW9abTl5WTJWRVpXWmhkV3gwVUdGblpTQW1KaUFoZEdocGN5NXZjSFJwYjI1ekxtUmxabUYxYkhSUVlXZGxLU0I3WEc0Z0lDQWdJQ0FnSUhSb2NtOTNJRzVsZHlCRmNuSnZjaWhnSkh0T1FVMUZmUzRnVkdobElHUmxabUYxYkhRZ2NHRm5aU0J0ZFhOMElHVjRhWE4wSUdadmNpQm1iM0pqYVc1bklHbDBjeUJzWVhWdVkyZ2hZQ2xjYmlBZ0lDQWdJSDFjYmx4dUlDQWdJQ0FnTHlwY2JpQWdJQ0FnSUNBcUlHbG1JSFJvWlNCaGNIQWdhWE1nWTI5dVptbG5kWEpoZEdWa0lIUnZJSFZ6WlNCb1lYTm9JSFJ5WVdOcmFXNW5YRzRnSUNBZ0lDQWdLaUIzWlNCaFpHUWdkR2hsSUhCaFoyVWdaSGx1WVcxcFkyRnNiSGtnYVc0Z2RHaGxJSFZ5YkZ4dUlDQWdJQ0FnSUNvdlhHNGdJQ0FnSUNCcFppQW9kR2hwY3k1dmNIUnBiMjV6TG5WelpVaGhjMmdwSUh0Y2JpQWdJQ0FnSUNBZ2RHaHBjeTV6WlhSSVlYTm9LSEJoWjJWT1lXMWxLVnh1SUNBZ0lDQWdmVnh1WEc0Z0lDQWdJQ0IwYUdsekxuTm9iM2RRWVdkbEtHWnZjbU5sUkdWbVlYVnNkRkJoWjJVZ1B5QjBhR2x6TG05d2RHbHZibk11WkdWbVlYVnNkRkJoWjJVZ09pQndZV2RsVG1GdFpTbGNiaUFnSUNCOVhHNWNiaUFnSUNBdkx5QnpkR0YwYVdOY2JpQWdJQ0J6ZEdGMGFXTWdYMFJQVFVsdWRHVnlabUZqWlNodmNIUnBiMjV6S1NCN1hHNGdJQ0FnSUNCeVpYUjFjbTRnYm1WM0lGQmhaMlZ5S0c5d2RHbHZibk1wWEc0Z0lDQWdmVnh1SUNCOVhHNWNiaUFnY21WMGRYSnVJRkJoWjJWeVhHNTlLU2dwWEc1Y2JtVjRjRzl5ZENCa1pXWmhkV3gwSUZCaFoyVnlYRzRpTENJdktpcGNiaUFxSUMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdFhHNGdLaUJNYVdObGJuTmxaQ0IxYm1SbGNpQk5TVlFnS0doMGRIQnpPaTh2WjJsMGFIVmlMbU52YlM5eGRXRnlheTFrWlhZdlVHaHZibTl1TFVaeVlXMWxkMjl5YXk5aWJHOWlMMjFoYzNSbGNpOU1TVU5GVGxORktWeHVJQ29nTFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMxY2JpQXFMMXh1WEc1cGJYQnZjblFnZXlCc2IyRmtSbWxzWlNCOUlHWnliMjBnSnk0dUx5NHVMMk52YlcxdmJpOTFkR2xzY3lkY2JtbHRjRzl5ZENCN0lHUnBjM0JoZEdOb1VHRm5aVVYyWlc1MElIMGdabkp2YlNBbkxpNHZMaTR2WTI5dGJXOXVMMlYyWlc1MGN5OWthWE53WVhSamFDZGNibHh1WTI5dWMzUWdVR0ZuWlNBOUlDZ29LU0E5UGlCN1hHNGdJQzhxS2x4dUlDQWdLaUF0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzFjYmlBZ0lDb2dRMjl1YzNSaGJuUnpYRzRnSUNBcUlDMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExWeHVJQ0FnS2k5Y2JseHVJQ0JqYjI1emRDQk9RVTFGSUQwZ0ozQmhaMlVuWEc0Z0lHTnZibk4wSUZaRlVsTkpUMDRnUFNBbk1pNHdMakFuWEc1Y2JpQWdZMjl1YzNRZ1ZFVk5VRXhCVkVWZlUwVk1SVU5VVDFJZ1BTQW5XMlJoZEdFdGRHVnRjR3hoZEdWZEoxeHVYRzRnSUM4cUtseHVJQ0FnS2lBdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMxY2JpQWdJQ29nUTJ4aGMzTWdSR1ZtYVc1cGRHbHZibHh1SUNBZ0tpQXRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMWNiaUFnSUNvdlhHNWNiaUFnWTJ4aGMzTWdVR0ZuWlNCN1hHNGdJQ0FnTHlvcVhHNGdJQ0FnSUNvZ1EzSmxZWFJsY3lCaGJpQnBibk4wWVc1alpTQnZaaUJRWVdkbExseHVJQ0FnSUNBcUlFQndZWEpoYlNCN2MzUnlhVzVuZlNCd1lXZGxUbUZ0WlZ4dUlDQWdJQ0FxTDF4dUlDQWdJR052Ym5OMGNuVmpkRzl5S0hCaFoyVk9ZVzFsS1NCN1hHNGdJQ0FnSUNCMGFHbHpMbTVoYldVZ1BTQndZV2RsVG1GdFpWeHVJQ0FnSUNBZ2RHaHBjeTVsZG1WdWRITWdQU0JiWFZ4dUlDQWdJQ0FnZEdocGN5NTBaVzF3YkdGMFpWQmhkR2dnUFNCdWRXeHNYRzRnSUNBZ0lDQjBhR2x6TG5KbGJtUmxja1oxYm1OMGFXOXVJRDBnYm5Wc2JGeHVJQ0FnSUgxY2JseHVJQ0FnSUM4dklHZGxkSFJsY25OY2JseHVJQ0FnSUhOMFlYUnBZeUJuWlhRZ2RtVnljMmx2YmlncElIdGNiaUFnSUNBZ0lISmxkSFZ5YmlCZ0pIdE9RVTFGZlM0a2UxWkZVbE5KVDA1OVlGeHVJQ0FnSUgxY2JseHVJQ0FnSUM4cUtseHVJQ0FnSUNBcUlFZGxkQ0JsZG1WdWRITmNiaUFnSUNBZ0tpQkFjbVYwZFhKdWN5QjdSblZ1WTNScGIyNWJYWDFjYmlBZ0lDQWdLaTljYmlBZ0lDQm5aWFJGZG1WdWRITW9LU0I3WEc0Z0lDQWdJQ0J5WlhSMWNtNGdkR2hwY3k1bGRtVnVkSE5jYmlBZ0lDQjlYRzVjYmlBZ0lDQXZLaXBjYmlBZ0lDQWdLaUJIWlhRZ2RHVnRjR3hoZEdWY2JpQWdJQ0FnS2lCQWNtVjBkWEp1Y3lCN2MzUnlhVzVuZlZ4dUlDQWdJQ0FxTDF4dUlDQWdJR2RsZEZSbGJYQnNZWFJsS0NrZ2UxeHVJQ0FnSUNBZ2NtVjBkWEp1SUhSb2FYTXVkR1Z0Y0d4aGRHVlFZWFJvWEc0Z0lDQWdmVnh1WEc0Z0lDQWdMeW9xWEc0Z0lDQWdJQ29nUjJWMElISmxibVJsY2lCbWRXNWpkR2x2Ymx4dUlDQWdJQ0FxSUVCeVpYUjFjbTV6SUh0R2RXNWpkR2x2Ym4xY2JpQWdJQ0FnS2k5Y2JpQWdJQ0JuWlhSU1pXNWtaWEpHZFc1amRHbHZiaWdwSUh0Y2JpQWdJQ0FnSUhKbGRIVnliaUIwYUdsekxuSmxibVJsY2taMWJtTjBhVzl1WEc0Z0lDQWdmVnh1WEc0Z0lDQWdiRzloWkZSbGJYQnNZWFJsS0NrZ2UxeHVJQ0FnSUNBZ1kyOXVjM1FnY0dGblpVVnNaVzFsYm5RZ1BTQmtiMk4xYldWdWRDNXhkV1Z5ZVZObGJHVmpkRzl5S0dCYlpHRjBZUzF3WVdkbFBWd2lKSHQwYUdsekxtNWhiV1Y5WENKZFlDbGNibHh1SUNBZ0lDQWdiRzloWkVacGJHVW9kR2hwY3k1blpYUlVaVzF3YkdGMFpTZ3BMQ0FvZEdWdGNHeGhkR1VwSUQwK0lIdGNiaUFnSUNBZ0lDQWdiR1YwSUhKbGJtUmxjaUE5SUdaMWJtTjBhVzl1SUNoRVQwMVFZV2RsTENCMFpXMXdiR0YwWlN3Z1pXeGxiV1Z1ZEhNcElIdGNiaUFnSUNBZ0lDQWdJQ0JwWmlBb1pXeGxiV1Z1ZEhNcElIdGNiaUFnSUNBZ0lDQWdJQ0FnSUVGeWNtRjVMbVp5YjIwb1pXeGxiV1Z1ZEhNcExtWnZja1ZoWTJnb0tHVnNLU0E5UGlCN1hHNGdJQ0FnSUNBZ0lDQWdJQ0FnSUdWc0xtbHVibVZ5U0ZSTlRDQTlJSFJsYlhCc1lYUmxYRzRnSUNBZ0lDQWdJQ0FnSUNCOUtWeHVJQ0FnSUNBZ0lDQWdJSDBnWld4elpTQjdYRzRnSUNBZ0lDQWdJQ0FnSUNCRVQwMVFZV2RsTG1sdWJtVnlTRlJOVENBOUlIUmxiWEJzWVhSbFhHNGdJQ0FnSUNBZ0lDQWdmVnh1SUNBZ0lDQWdJQ0I5WEc1Y2JpQWdJQ0FnSUNBZ2FXWWdLSFJvYVhNdVoyVjBVbVZ1WkdWeVJuVnVZM1JwYjI0b0tTa2dlMXh1SUNBZ0lDQWdJQ0FnSUhKbGJtUmxjaUE5SUhSb2FYTXVaMlYwVW1WdVpHVnlSblZ1WTNScGIyNG9LVnh1SUNBZ0lDQWdJQ0I5WEc1Y2JpQWdJQ0FnSUNBZ2NtVnVaR1Z5S0hCaFoyVkZiR1Z0Wlc1MExDQjBaVzF3YkdGMFpTd2djR0ZuWlVWc1pXMWxiblF1Y1hWbGNubFRaV3hsWTNSdmNrRnNiQ2hVUlUxUVRFRlVSVjlUUlV4RlExUlBVaWtwWEc0Z0lDQWdJQ0I5TENCdWRXeHNLVnh1SUNBZ0lIMWNibHh1SUNBZ0lDOHZJSEIxWW14cFkxeHVYRzRnSUNBZ0x5b3FYRzRnSUNBZ0lDcGNiaUFnSUNBZ0tpQkFjR0Z5WVcwZ2V5cDlJR05oYkd4aVlXTnJSbTVjYmlBZ0lDQWdLaTljYmlBZ0lDQmhaR1JGZG1WdWRFTmhiR3hpWVdOcktHTmhiR3hpWVdOclJtNHBJSHRjYmlBZ0lDQWdJSFJvYVhNdVpYWmxiblJ6TG5CMWMyZ29ZMkZzYkdKaFkydEdiaWxjYmlBZ0lDQjlYRzVjYmlBZ0lDQXZLaXBjYmlBZ0lDQWdLaUJWYzJVZ2RHaGxJR2RwZG1WdUlIUmxiWEJzWVhSbFhHNGdJQ0FnSUNwY2JpQWdJQ0FnS2lCQWNHRnlZVzBnZTNOMGNtbHVaMzBnZEdWdGNHeGhkR1ZRWVhSb1hHNGdJQ0FnSUNvdlhHNGdJQ0FnZFhObFZHVnRjR3hoZEdVb2RHVnRjR3hoZEdWUVlYUm9LU0I3WEc0Z0lDQWdJQ0JwWmlBb2RIbHdaVzltSUhSbGJYQnNZWFJsVUdGMGFDQWhQVDBnSjNOMGNtbHVaeWNwSUh0Y2JpQWdJQ0FnSUNBZ2RHaHliM2NnYm1WM0lFVnljbTl5S0NkVWFHVWdkR1Z0Y0d4aGRHVWdjR0YwYUNCdGRYTjBJR0psSUdFZ2MzUnlhVzVuTGlBbklDc2dkSGx3Wlc5bUlIUmxiWEJzWVhSbFVHRjBhQ0FySUNjZ2FYTWdaMmwyWlc0bktWeHVJQ0FnSUNBZ2ZWeHVJQ0FnSUNBZ2RHaHBjeTUwWlcxd2JHRjBaVkJoZEdnZ1BTQjBaVzF3YkdGMFpWQmhkR2hjYmlBZ0lDQjlYRzVjYmlBZ0lDQXZLaXBjYmlBZ0lDQWdLaUJWYzJVZ2RHaGxJR2RwZG1WdUlIUmxiWEJzWVhSbElISmxibVJsY21WeVhHNGdJQ0FnSUNvZ1FIQmhjbUZ0SUh0R2RXNWpkR2x2Ym4wZ2NtVnVaR1Z5Um5WdVkzUnBiMjVjYmlBZ0lDQWdLaTljYmlBZ0lDQjFjMlZVWlcxd2JHRjBaVkpsYm1SbGNtVnlLSEpsYm1SbGNrWjFibU4wYVc5dUtTQjdYRzRnSUNBZ0lDQnBaaUFvZEhsd1pXOW1JSEpsYm1SbGNrWjFibU4wYVc5dUlDRTlQU0FuWm5WdVkzUnBiMjRuS1NCN1hHNGdJQ0FnSUNBZ0lIUm9jbTkzSUc1bGR5QkZjbkp2Y2lnblZHaGxJR04xYzNSdmJTQjBaVzF3YkdGMFpTQnlaVzVrWlhKbGNpQnRkWE4wSUdKbElHRWdablZ1WTNScGIyNHVJQ2NnS3lCMGVYQmxiMllnY21WdVpHVnlSblZ1WTNScGIyNGdLeUFuSUdseklHZHBkbVZ1SnlsY2JpQWdJQ0FnSUgxY2JpQWdJQ0FnSUhSb2FYTXVjbVZ1WkdWeVJuVnVZM1JwYjI0Z1BTQnlaVzVrWlhKR2RXNWpkR2x2Ymx4dUlDQWdJSDFjYmx4dUlDQWdJQzhxS2x4dUlDQWdJQ0FxSUZSeWFXZG5aWElnYzJOdmNHVnpYRzRnSUNBZ0lDb2dRSEJoY21GdElIdHpkSEpwYm1kOUlHVjJaVzUwVG1GdFpWeHVJQ0FnSUNBcUlFQndZWEpoYlNCN2UzMTlJRnRsZG1WdWRGQmhjbUZ0Y3oxN2ZWMWNiaUFnSUNBZ0tpOWNiaUFnSUNCMGNtbG5aMlZ5VTJOdmNHVnpLR1YyWlc1MFRtRnRaU3dnWlhabGJuUlFZWEpoYlhNZ1BTQjdmU2tnZTF4dUlDQWdJQ0FnWTI5dWMzUWdaWFpsYm5ST1lXMWxRV3hwWVhNZ1BTQmdiMjRrZTJWMlpXNTBUbUZ0WlM1amFHRnlRWFFvTUNrdWRHOVZjSEJsY2tOaGMyVW9LWDBrZTJWMlpXNTBUbUZ0WlM1emJHbGpaU2d4S1gxZ1hHNWNiaUFnSUNBZ0lIUm9hWE11WlhabGJuUnpMbVp2Y2tWaFkyZ29LSE5qYjNCbEtTQTlQaUI3WEc0Z0lDQWdJQ0FnSUdOdmJuTjBJSE5qYjNCbFJYWmxiblFnUFNCelkyOXdaVnRsZG1WdWRFNWhiV1ZkWEc0Z0lDQWdJQ0FnSUdOdmJuTjBJSE5qYjNCbFJYWmxiblJCYkdsaGN5QTlJSE5qYjNCbFcyVjJaVzUwVG1GdFpVRnNhV0Z6WFZ4dUlDQWdJQ0FnSUNCcFppQW9kSGx3Wlc5bUlITmpiM0JsUlhabGJuUWdQVDA5SUNkbWRXNWpkR2x2YmljcElIdGNiaUFnSUNBZ0lDQWdJQ0J6WTI5d1pVVjJaVzUwTG1Gd2NHeDVLSFJvYVhNc0lHVjJaVzUwVUdGeVlXMXpLVnh1SUNBZ0lDQWdJQ0I5WEc1Y2JpQWdJQ0FnSUNBZ0x5OGdkSEpwWjJkbGNpQjBhR1VnWlhabGJuUWdZV3hwWVhOY2JpQWdJQ0FnSUNBZ2FXWWdLSFI1Y0dWdlppQnpZMjl3WlVWMlpXNTBRV3hwWVhNZ1BUMDlJQ2RtZFc1amRHbHZiaWNwSUh0Y2JpQWdJQ0FnSUNBZ0lDQnpZMjl3WlVWMlpXNTBRV3hwWVhNdVlYQndiSGtvZEdocGN5d2daWFpsYm5SUVlYSmhiWE1wWEc0Z0lDQWdJQ0FnSUgxY2JpQWdJQ0FnSUgwcFhHNWNiaUFnSUNBZ0lHUnBjM0JoZEdOb1VHRm5aVVYyWlc1MEtHVjJaVzUwVG1GdFpTd2dkR2hwY3k1dVlXMWxMQ0JsZG1WdWRGQmhjbUZ0Y3lsY2JpQWdJQ0I5WEc0Z0lIMWNibHh1SUNCeVpYUjFjbTRnVUdGblpWeHVmU2tvS1Z4dVhHNWxlSEJ2Y25RZ1pHVm1ZWFZzZENCUVlXZGxYRzRpTENJdktpcGNiaUFxSUMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdFhHNGdLaUJNYVdObGJuTmxaQ0IxYm1SbGNpQk5TVlFnS0doMGRIQnpPaTh2WjJsMGFIVmlMbU52YlM5eGRXRnlheTFrWlhZdlVHaHZibTl1TFVaeVlXMWxkMjl5YXk5aWJHOWlMMjFoYzNSbGNpOU1TVU5GVGxORktWeHVJQ29nTFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMxY2JpQXFMMXh1WEc1cGJYQnZjblFnVUdGblpYSWdabkp2YlNBbkxpOW9lV0p5YVdRdFlYQndjeTl3WVdkbGNpOXBibVJsZUNkY2JtbHRjRzl5ZENCSmJuUnNJR1p5YjIwZ0p5NHZhSGxpY21sa0xXRndjSE12YVc1MGJDZGNibWx0Y0c5eWRDQk9aWFIzYjNKcklHWnliMjBnSnk0dlkyOXRiVzl1TDI1bGRIZHZjbXNuWEc1Y2JpOHZJR052YlhCdmJtVnVkSE5jYm1sdGNHOXlkQ0JFYVdGc2IyY2dabkp2YlNBbkxpOWpiMjF3YjI1bGJuUnpMMlJwWVd4dlp5ZGNibWx0Y0c5eWRDQlFjbTl0Y0hRZ1puSnZiU0FuTGk5amIyMXdiMjVsYm5SekwyUnBZV3h2Wnk5d2NtOXRjSFFuWEc1cGJYQnZjblFnUTI5dVptbHliU0JtY205dElDY3VMMk52YlhCdmJtVnVkSE12WkdsaGJHOW5MMk52Ym1acGNtMG5YRzVwYlhCdmNuUWdSR2xoYkc5blRHOWhaR1Z5SUdaeWIyMGdKeTR2WTI5dGNHOXVaVzUwY3k5a2FXRnNiMmN2Ykc5aFpHVnlKMXh1YVcxd2IzSjBJRTV2ZEdsbWFXTmhkR2x2YmlCbWNtOXRJQ2N1TDJOdmJYQnZibVZ1ZEhNdmJtOTBhV1pwWTJGMGFXOXVKMXh1YVcxd2IzSjBJRU52Ykd4aGNITmxJR1p5YjIwZ0p5NHZZMjl0Y0c5dVpXNTBjeTlqYjJ4c1lYQnpaU2RjYm1sdGNHOXlkQ0JCWTJOdmNtUnBiMjRnWm5KdmJTQW5MaTlqYjIxd2IyNWxiblJ6TDJGalkyOXlaR2x2YmlkY2JtbHRjRzl5ZENCVVlXSWdabkp2YlNBbkxpOWpiMjF3YjI1bGJuUnpMM1JoWWlkY2JtbHRjRzl5ZENCUWNtOW5jbVZ6Y3lCbWNtOXRJQ2N1TDJOdmJYQnZibVZ1ZEhNdmNISnZaM0psYzNNblhHNXBiWEJ2Y25RZ1RHOWhaR1Z5SUdaeWIyMGdKeTR2WTI5dGNHOXVaVzUwY3k5c2IyRmtaWEluWEc1cGJYQnZjblFnVDJabVEyRnVkbUZ6SUdaeWIyMGdKeTR2WTI5dGNHOXVaVzUwY3k5dlptWXRZMkZ1ZG1GekoxeHVhVzF3YjNKMElFUnliM0JrYjNkdUlHWnliMjBnSnk0dlkyOXRjRzl1Wlc1MGN5OWtjbTl3Wkc5M2JpZGNibWx0Y0c5eWRDQkVjbTl3Wkc5M2JsTmxZWEpqYUNCbWNtOXRJQ2N1TDJOdmJYQnZibVZ1ZEhNdlpISnZjR1J2ZDI0dmMyVmhjbU5vSjF4dVhHNWpiMjV6ZENCaGNHa2dQU0I3ZlZ4dVhHNHZLaXBjYmlBcUlDMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExWeHVJQ29nVUdGblpYSmNiaUFxSUMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFZ4dUlDb3ZYRzVoY0drdWNHRm5aWElnUFNBb2IzQjBhVzl1Y3lrZ1BUNGdlMXh1SUNCcFppQW9kSGx3Wlc5bUlHRndhUzVmY0dGblpYSWdQVDA5SUNkMWJtUmxabWx1WldRbktTQjdYRzRnSUNBZ1lYQnBMbDl3WVdkbGNpQTlJRkJoWjJWeUxsOUVUMDFKYm5SbGNtWmhZMlVvYjNCMGFXOXVjeWxjYmlBZ2ZWeHVJQ0J5WlhSMWNtNGdZWEJwTGw5d1lXZGxjbHh1ZlZ4dVhHNHZLaXBjYmlBcUlDMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExWeHVJQ29nU1c1MGJGeHVJQ29nTFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0WEc0Z0tpOWNibUZ3YVM1cGJuUnNJRDBnU1c1MGJDNWZSRTlOU1c1MFpYSm1ZV05sWEc1Y2JpOHFLbHh1SUNvZ0xTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdFhHNGdLaUJPWlhSM2IzSnJYRzRnS2lBdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMxY2JpQXFMMXh1WVhCcExtNWxkSGR2Y21zZ1BTQk9aWFIzYjNKckxsOUVUMDFKYm5SbGNtWmhZMlZjYmx4dUx5b3FYRzRnS2lBdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMxY2JpQXFJRTV2ZEdsbWFXTmhkR2x2Ymx4dUlDb2dMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRYRzRnS2k5Y2JtRndhUzV1YjNScFptbGpZWFJwYjI0Z1BTQk9iM1JwWm1sallYUnBiMjR1WDBSUFRVbHVkR1Z5Wm1GalpWeHVYRzR2S2lwY2JpQXFJQzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMVnh1SUNvZ1JHbGhiRzluWEc0Z0tpQXRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMWNiaUFxTDF4dVlYQnBMbVJwWVd4dlp5QTlJQ2h2Y0hScGIyNXpLU0E5UGlCN1hHNGdJR2xtSUNodmNIUnBiMjV6TG5SNWNHVWdQVDA5SUZCeWIyMXdkQzVwWkdWdWRHbG1hV1Z5S0NrcElIdGNiaUFnSUNBdkx5QndjbTl0Y0hRZ1pHbGhiRzluWEc0Z0lDQWdjbVYwZFhKdUlGQnliMjF3ZEM1ZlJFOU5TVzUwWlhKbVlXTmxLRzl3ZEdsdmJuTXBYRzRnSUgxY2JseHVJQ0JwWmlBb2IzQjBhVzl1Y3k1MGVYQmxJRDA5UFNCRGIyNW1hWEp0TG1sa1pXNTBhV1pwWlhJb0tTa2dlMXh1SUNBZ0lDOHZJR052Ym1acGNtMGdaR2xoYkc5blhHNGdJQ0FnY21WMGRYSnVJRU52Ym1acGNtMHVYMFJQVFVsdWRHVnlabUZqWlNodmNIUnBiMjV6S1Z4dUlDQjlYRzVjYmlBZ2FXWWdLRzl3ZEdsdmJuTXVkSGx3WlNBOVBUMGdSR2xoYkc5blRHOWhaR1Z5TG1sa1pXNTBhV1pwWlhJb0tTa2dlMXh1SUNBZ0lDOHZJR052Ym1acGNtMGdaR2xoYkc5blhHNGdJQ0FnY21WMGRYSnVJRVJwWVd4dloweHZZV1JsY2k1ZlJFOU5TVzUwWlhKbVlXTmxLRzl3ZEdsdmJuTXBYRzRnSUgxY2JseHVJQ0F2THlCblpXNWxjbWxqSUdScFlXeHZaMXh1SUNCeVpYUjFjbTRnUkdsaGJHOW5MbDlFVDAxSmJuUmxjbVpoWTJVb2IzQjBhVzl1Y3lsY2JuMWNibHh1THlvcVhHNGdLaUF0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzFjYmlBcUlFTnZiR3hoY0hObFhHNGdLaUF0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzFjYmlBcUwxeHVZWEJwTG1OdmJHeGhjSE5sSUQwZ1EyOXNiR0Z3YzJVdVgwUlBUVWx1ZEdWeVptRmpaVnh1WEc0dktpcGNiaUFxSUMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFZ4dUlDb2dRV05qYjNKa2FXOXVYRzRnS2lBdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMxY2JpQXFMMXh1WVhCcExtRmpZMjl5WkdsdmJpQTlJRUZqWTI5eVpHbHZiaTVmUkU5TlNXNTBaWEptWVdObFhHNWNibHh1THlvcVhHNGdLaUF0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzFjYmlBcUlGUmhZbHh1SUNvZ0xTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdFhHNGdLaTljYm1Gd2FTNTBZV0lnUFNCVVlXSXVYMFJQVFVsdWRHVnlabUZqWlZ4dVhHNHZLaXBjYmlBcUlDMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExWeHVJQ29nVUhKdlozSmxjM05jYmlBcUlDMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExWeHVJQ292WEc1aGNHa3VjSEp2WjNKbGMzTWdQU0JRY205bmNtVnpjeTVmUkU5TlNXNTBaWEptWVdObFhHNWNiaThxS2x4dUlDb2dMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRYRzRnS2lCTWIyRmtaWEpjYmlBcUlDMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExWeHVJQ292WEc1aGNHa3ViRzloWkdWeUlEMGdURzloWkdWeUxsOUVUMDFKYm5SbGNtWmhZMlZjYmx4dUx5b3FYRzRnS2lBdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMxY2JpQXFJRTltWmlCallXNTJZWE5jYmlBcUlDMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExWeHVJQ292WEc1aGNHa3ViMlptUTJGdWRtRnpJRDBnVDJabVEyRnVkbUZ6TGw5RVQwMUpiblJsY21aaFkyVmNibHh1THlvcVhHNGdLaUF0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzFjYmlBcUlFUnliM0JrYjNkdVhHNGdLaUF0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzFjYmlBcUwxeHVZWEJwTG1SeWIzQmtiM2R1SUQwZ0tHOXdkR2x2Ym5NcElEMCtJSHRjYmlBZ2FXWWdLRzl3ZEdsdmJuTXVjMlZoY21Ob0tTQjdYRzRnSUNBZ0x5OGdjMlZoY21Ob0lHUnliM0JrYjNkdVhHNGdJQ0FnY21WMGRYSnVJRVJ5YjNCa2IzZHVVMlZoY21Ob0xsOUVUMDFKYm5SbGNtWmhZMlVvYjNCMGFXOXVjeWxjYmlBZ2ZWeHVYRzRnSUM4dklHZGxibVZ5YVdNZ1pISnZjR1J2ZDI1Y2JpQWdjbVYwZFhKdUlFUnliM0JrYjNkdUxsOUVUMDFKYm5SbGNtWmhZMlVvYjNCMGFXOXVjeWxjYm4xY2JseHVMeThnVFdGclpTQjBhR1VnUVZCSklHeHBkbVZjYm5kcGJtUnZkeTV3YUc5dWIyNGdQU0JoY0dsY2JseHVaWGh3YjNKMElHUmxabUYxYkhRZ1lYQnBYRzRpWFgwPSJ9
