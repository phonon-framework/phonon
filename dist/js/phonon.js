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

  if (accordions) {
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
  }

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

  if (collapses) {
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
  }

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
    cancelable: true
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

      _this.template = template || '' + '<div class="dialog" tabindex="-1" role="dialog">' + '<div class="dialog-inner" role="document">' + '<div class="dialog-content">' + '<div class="dialog-header">' + '<h5 class="dialog-title"></h5>' + '</div>' + '<div class="dialog-body">' + '<p></p>' + '</div>' + '<div class="dialog-footer">' + '<button type="button" class="btn btn-primary" data-dismiss="dialog">Ok</button>' + '</div>' + '</div>' + '</div>' + '</div>';

      if (_this.dynamicElement) {
        _this.build();
      }
      return _this;
    }

    _createClass(Dialog, [{
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

            // attach event
            _this2.attachEvents();
          };

          _this2.options.element.addEventListener(_events2.default.TRANSITION_END, onShown);

          _this2.options.element.classList.add('show');

          _this2.center();
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
          Array.from(dismissButtons).forEach(function (button) {
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
          Array.from(dismissButtons).forEach(function (button) {
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

  if (dialogs) {
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
  }

  return Dialog;
}();

exports.default = Dialog;

},{"../../common/events":2,"../component":7,"../componentManager":8}],10:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

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


var Prompt = function () {

  /**
   * ------------------------------------------------------------------------
   * Constants
   * ------------------------------------------------------------------------
   */

  var NAME = 'dialog';
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

  var Prompt = function (_Dialog) {
    _inherits(Prompt, _Dialog);

    function Prompt() {
      var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

      _classCallCheck(this, Prompt);

      var template = '' + '<div class="dialog" tabindex="-1" role="dialog">' + '<div class="dialog-inner" role="document">' + '<div class="dialog-content">' + '<div class="dialog-header">' + '<h5 class="dialog-title"></h5>' + '</div>' + '<div class="dialog-body">' + '<input class="form-control" type="text" value="">' + '</div>' + '<div class="dialog-footer">' + '<button type="button" class="btn btn-primary" data-dismiss="dialog">Ok</button>' + '</div>' + '</div>' + '</div>' + '</div>';

      return _possibleConstructorReturn(this, (Prompt.__proto__ || Object.getPrototypeOf(Prompt)).call(this, options, template));
    }

    _createClass(Prompt, null, [{
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
  var dialogs = document.querySelectorAll('.' + NAME);

  if (dialogs) {
    Array.from(dialogs).forEach(function (element) {
      var config = (0, _componentManager.getAttributesConfig)(element, DEFAULT_PROPERTIES, DATA_ATTRS_PROPERTIES);
      config.element = element;

      if (config.type === 'alert') {
        // prompt
        components.push(new Prompt(config));
      }
    });
  }

  if (dialogs) {
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

  return Prompt;
}();

exports.default = Prompt;

},{"../../common/utils":4,"../componentManager":8,"./index":9}],11:[function(require,module,exports){
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

  return Dropdown;
}();

exports.default = Dropdown;

},{"../../common/events":2,"../../common/utils":4,"../component":7,"../componentManager":8}],12:[function(require,module,exports){
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
          item.element.style.display = 'block';
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

},{"../../common/utils":4,"../componentManager":8,"./index":11}],13:[function(require,module,exports){
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

},{"../component":7}],14:[function(require,module,exports){
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

},{"../../common/events":2,"../component":7}],15:[function(require,module,exports){
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

  if (offCanvas) {
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
  }

  return OffCanvas;
}();

exports.default = OffCanvas;

},{"../../common/events":2,"../../common/utils":4,"../component":7,"../componentManager":8}],16:[function(require,module,exports){
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

},{"../../common/events":2,"../component":7}],17:[function(require,module,exports){
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

  if (tabs) {
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
  }

  return Tab;
}();

exports.default = Tab;

},{"../../common/events":2,"../../common/utils":4,"../component":7,"../componentManager":8}],18:[function(require,module,exports){
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

},{}],19:[function(require,module,exports){
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

},{"./binder":18}],20:[function(require,module,exports){
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
}();

exports.default = Pager;

},{"../../common/events":2,"./page":21}],21:[function(require,module,exports){
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

},{"../../common/events/dispatch":1,"../../common/utils":4}],22:[function(require,module,exports){
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

var _loader = require('./components/loader');

var _loader2 = _interopRequireDefault(_loader);

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
 * Configuration
 * ------------------------------------------------------------------------
 */


// components
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

setTimeout(function () {
  _prompt2.default._DOMInterface({
    element: null,
    title: 'HELLOW',
    message: null,
    cancelable: true
  }).show();
}, 1000);

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
api.loader = _loader2.default._DOMInterface;

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
    // generic dropdown
    return _dropdown2.default._DOMInterface;
  } else {
    // search dropdown
    return _search2.default._DOMInterface;
  }
};

// Make the API live
window.phonon = api;

exports.default = api;

},{"./common/network":3,"./components/accordion":5,"./components/collapse":6,"./components/dialog":9,"./components/dialog/prompt":10,"./components/dropdown":11,"./components/dropdown/search":12,"./components/loader":13,"./components/notification":14,"./components/off-canvas":15,"./components/progress":16,"./components/tab":17,"./hybrid-apps/intl":19,"./hybrid-apps/pager/index":20}]},{},[22])

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvanMvY29tbW9uL2V2ZW50cy9kaXNwYXRjaC5qcyIsInNyYy9qcy9jb21tb24vZXZlbnRzL2luZGV4LmpzIiwic3JjL2pzL2NvbW1vbi9uZXR3b3JrL2luZGV4LmpzIiwic3JjL2pzL2NvbW1vbi91dGlscy9pbmRleC5qcyIsInNyYy9qcy9jb21wb25lbnRzL2FjY29yZGlvbi9pbmRleC5qcyIsInNyYy9qcy9jb21wb25lbnRzL2NvbGxhcHNlL2luZGV4LmpzIiwic3JjL2pzL2NvbXBvbmVudHMvY29tcG9uZW50LmpzIiwic3JjL2pzL2NvbXBvbmVudHMvY29tcG9uZW50TWFuYWdlci5qcyIsInNyYy9qcy9jb21wb25lbnRzL2RpYWxvZy9pbmRleC5qcyIsInNyYy9qcy9jb21wb25lbnRzL2RpYWxvZy9wcm9tcHQuanMiLCJzcmMvanMvY29tcG9uZW50cy9kcm9wZG93bi9pbmRleC5qcyIsInNyYy9qcy9jb21wb25lbnRzL2Ryb3Bkb3duL3NlYXJjaC5qcyIsInNyYy9qcy9jb21wb25lbnRzL2xvYWRlci9pbmRleC5qcyIsInNyYy9qcy9jb21wb25lbnRzL25vdGlmaWNhdGlvbi9pbmRleC5qcyIsInNyYy9qcy9jb21wb25lbnRzL29mZi1jYW52YXMvaW5kZXguanMiLCJzcmMvanMvY29tcG9uZW50cy9wcm9ncmVzcy9pbmRleC5qcyIsInNyYy9qcy9jb21wb25lbnRzL3RhYi9pbmRleC5qcyIsInNyYy9qcy9oeWJyaWQtYXBwcy9pbnRsL2JpbmRlci5qcyIsInNyYy9qcy9oeWJyaWQtYXBwcy9pbnRsL2luZGV4LmpzIiwic3JjL2pzL2h5YnJpZC1hcHBzL3BhZ2VyL2luZGV4LmpzIiwic3JjL2pzL2h5YnJpZC1hcHBzL3BhZ2VyL3BhZ2UuanMiLCJzcmMvanMvaW5kZXguanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7OztRQ0FnQixtQixHQUFBLG1CO1FBTUEs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QTs7Ozs7QUFLQSxJQUFJLFFBQUosR0FBZSxtQkFBUyxhQUF4Qjs7QUFFQTs7Ozs7QUFLQSxJQUFJLE1BQUosR0FBYSxpQkFBTyxhQUFwQjs7QUFFQTs7Ozs7QUFLQSxJQUFJLFNBQUosR0FBZ0Isb0JBQVUsYUFBMUI7O0FBRUE7Ozs7O0FBS0EsSUFBSSxRQUFKLEdBQWUsVUFBQyxPQUFELEVBQWE7QUFDMUIsTUFBSSxRQUFRLE1BQVosRUFBb0I7QUFDbEI7QUFDQSxXQUFPLG1CQUFTLGFBQWhCO0FBQ0QsR0FIRCxNQUdPO0FBQ0w7QUFDQSxXQUFPLGlCQUFlLGFBQXRCO0FBQ0Q7QUFDRixDQVJEOztBQVVBO0FBQ0EsT0FBTyxNQUFQLEdBQWdCLEdBQWhCOztrQkFFZSxHIiwiZmlsZSI6InBob25vbi5qcyIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiZXhwb3J0IGZ1bmN0aW9uIGRpc3BhdGNoV2luRG9jRXZlbnQoZXZlbnROYW1lLCBtb2R1bGVOYW1lLCBkZXRhaWwgPSB7fSkge1xuICBjb25zdCBmdWxsRXZlbnROYW1lID0gYCR7ZXZlbnROYW1lfS5waC4ke21vZHVsZU5hbWV9YFxuICB3aW5kb3cuZGlzcGF0Y2hFdmVudChuZXcgQ3VzdG9tRXZlbnQoZnVsbEV2ZW50TmFtZSwgeyBkZXRhaWwgfSkpXG4gIGRvY3VtZW50LmRpc3BhdGNoRXZlbnQobmV3IEN1c3RvbUV2ZW50KGZ1bGxFdmVudE5hbWUsIHsgZGV0YWlsIH0pKVxufVxuXG5leHBvcnQgZnVuY3Rpb24gZGlzcGF0Y2hFbGVtZW50RXZlbnQoZG9tRWxlbWVudCwgZXZlbnROYW1lLCBtb2R1bGVOYW1lLCBkZXRhaWwgPSB7fSkge1xuICBjb25zdCBmdWxsRXZlbnROYW1lID0gYCR7ZXZlbnROYW1lfS5waC4ke21vZHVsZU5hbWV9YFxuICBkb21FbGVtZW50LmRpc3BhdGNoRXZlbnQobmV3IEN1c3RvbUV2ZW50KGZ1bGxFdmVudE5hbWUsIHsgZGV0YWlsIH0pKVxufVxuXG5leHBvcnQgZnVuY3Rpb24gZGlzcGF0Y2hQYWdlRXZlbnQoZXZlbnROYW1lLCBwYWdlTmFtZSwgZGV0YWlsID0ge30pIHtcbiAgY29uc3QgZnVsbEV2ZW50TmFtZSA9IGAke3BhZ2VOYW1lfS4ke2V2ZW50TmFtZX1gXG4gIHdpbmRvdy5kaXNwYXRjaEV2ZW50KG5ldyBDdXN0b21FdmVudChmdWxsRXZlbnROYW1lLCB7IGRldGFpbCB9KSlcbiAgZG9jdW1lbnQuZGlzcGF0Y2hFdmVudChuZXcgQ3VzdG9tRXZlbnQoZnVsbEV2ZW50TmFtZSwgeyBkZXRhaWwgfSkpXG59XG4iLCIvLyBAdG9kbyBrZWVwID9cbmlmICh0eXBlb2Ygd2luZG93ICE9PSAndW5kZWZpbmVkJykge1xuICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcignZXJyb3InLCAoKSA9PiB7XG4gICAgY29uc29sZS5lcnJvcignQW4gZXJyb3IgaGFzIG9jY3VyZWQhIFlvdSBjYW4gcGVuIGFuIGlzc3VlIGhlcmU6IGh0dHBzOi8vZ2l0aHViLmNvbS9xdWFyay1kZXYvUGhvbm9uLUZyYW1ld29yay9pc3N1ZXMnKVxuICB9KVxufVxuXG4vLyBVc2UgYXZhaWxhYmxlIGV2ZW50c1xubGV0IGF2YWlsYWJsZUV2ZW50cyA9IFsnbW91c2Vkb3duJywgJ21vdXNlbW92ZScsICdtb3VzZXVwJ11cbmxldCB0b3VjaFNjcmVlbiA9IGZhbHNlXG5cbmlmICh0eXBlb2Ygd2luZG93ICE9PSAndW5kZWZpbmVkJykge1xuICBpZiAoKCdvbnRvdWNoc3RhcnQnIGluIHdpbmRvdykgfHwgd2luZG93LkRvY3VtZW50VG91Y2ggJiYgZG9jdW1lbnQgaW5zdGFuY2VvZiBEb2N1bWVudFRvdWNoKSB7XG4gICAgdG91Y2hTY3JlZW4gPSB0cnVlXG4gICAgYXZhaWxhYmxlRXZlbnRzID0gWyd0b3VjaHN0YXJ0JywgJ3RvdWNobW92ZScsICd0b3VjaGVuZCcsICd0b3VjaGNhbmNlbCddXG4gIH1cblxuICBpZiAod2luZG93Lm5hdmlnYXRvci5wb2ludGVyRW5hYmxlZCkge1xuICAgIGF2YWlsYWJsZUV2ZW50cyA9IFsncG9pbnRlcmRvd24nLCAncG9pbnRlcm1vdmUnLCAncG9pbnRlcnVwJywgJ3BvaW50ZXJjYW5jZWwnXVxuICB9IGVsc2UgaWYgKHdpbmRvdy5uYXZpZ2F0b3IubXNQb2ludGVyRW5hYmxlZCkge1xuICAgIGF2YWlsYWJsZUV2ZW50cyA9IFsnTVNQb2ludGVyRG93bicsICdNU1BvaW50ZXJNb3ZlJywgJ01TUG9pbnRlclVwJywgJ01TUG9pbnRlckNhbmNlbCddXG4gIH1cbn1cblxuY29uc3QgZWwgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKVxuY29uc3QgdHJhbnNpdGlvbnMgPSBbXG4gIHsgbmFtZTogJ3RyYW5zaXRpb24nLCBzdGFydDogJ3RyYW5zaXRpb25zdGFydCcsIGVuZDogJ3RyYW5zaXRpb25lbmQnIH0sXG4gIHsgbmFtZTogJ01velRyYW5zaXRpb24nLCBzdGFydDogJ3RyYW5zaXRpb25zdGFydCcsIGVuZDogJ3RyYW5zaXRpb25lbmQnIH0sXG4gIHsgbmFtZTogJ21zVHJhbnNpdGlvbicsIHN0YXJ0OiAnbXNUcmFuc2l0aW9uU3RhcnQnLCBlbmQ6ICdtc1RyYW5zaXRpb25FbmQnIH0sXG4gIHsgbmFtZTogJ1dlYmtpdFRyYW5zaXRpb24nLCBzdGFydDogJ3dlYmtpdFRyYW5zaXRpb25TdGFydCcsIGVuZDogJ3dlYmtpdFRyYW5zaXRpb25FbmQnIH0sXG5dXG5jb25zdCBhbmltYXRpb25zID0gW1xuICB7IG5hbWU6ICdhbmltYXRpb24nLCBzdGFydDogJ2FuaW1hdGlvbnN0YXJ0JywgZW5kOiAnYW5pbWF0aW9uZW5kJyB9LFxuICB7IG5hbWU6ICdNb3pBbmltYXRpb24nLCBzdGFydDogJ2FuaW1hdGlvbnN0YXJ0JywgZW5kOiAnYW5pbWF0aW9uZW5kJyB9LFxuICB7IG5hbWU6ICdtc0FuaW1hdGlvbicsIHN0YXJ0OiAnbXNBbmltYXRpb25TdGFydCcsIGVuZDogJ21zQW5pbWF0aW9uRW5kJyB9LFxuICB7IG5hbWU6ICdXZWJraXRBbmltYXRpb24nLCBzdGFydDogJ3dlYmtpdEFuaW1hdGlvblN0YXJ0JywgZW5kOiAnd2Via2l0QW5pbWF0aW9uRW5kJyB9LFxuXVxuXG5jb25zdCB0cmFuc2l0aW9uU3RhcnQgPSB0cmFuc2l0aW9ucy5maW5kKHQgPT4gZWwuc3R5bGVbdC5uYW1lXSAhPT0gdW5kZWZpbmVkKS5zdGFydFxuY29uc3QgdHJhbnNpdGlvbkVuZCA9IHRyYW5zaXRpb25zLmZpbmQodCA9PiBlbC5zdHlsZVt0Lm5hbWVdICE9PSB1bmRlZmluZWQpLmVuZFxuY29uc3QgYW5pbWF0aW9uU3RhcnQgPSBhbmltYXRpb25zLmZpbmQodCA9PiBlbC5zdHlsZVt0Lm5hbWVdICE9PSB1bmRlZmluZWQpLnN0YXJ0XG5jb25zdCBhbmltYXRpb25FbmQgPSBhbmltYXRpb25zLmZpbmQodCA9PiBlbC5zdHlsZVt0Lm5hbWVdICE9PSB1bmRlZmluZWQpLmVuZFxuXG5leHBvcnQgZGVmYXVsdCB7XG4gIC8vIHRvdWNoIHNjcmVlbiBzdXBwb3J0XG4gIFRPVUNIX1NDUkVFTjogdG91Y2hTY3JlZW4sXG5cbiAgLy8gbmV0d29ya1xuICBORVRXT1JLX09OTElORTogJ29ubGluZScsXG4gIE5FVFdPUktfT0ZGTElORTogJ29mZmxpbmUnLFxuICBORVRXT1JLX1JFQ09OTkVDVElORzogJ3JlY29ubmVjdGluZycsXG4gIE5FVFdPUktfUkVDT05ORUNUSU5HX1NVQ0NFU1M6ICdyZWNvbm5lY3Quc3VjY2VzcycsXG4gIE5FVFdPUktfUkVDT05ORUNUSU5HX0ZBSUxVUkU6ICdyZWNvbm5lY3QuZmFpbHVyZScsXG5cbiAgLy8gdXNlciBpbnRlcmZhY2Ugc3RhdGVzXG4gIFNIT1c6ICdzaG93JyxcbiAgU0hPV046ICdzaG93bicsXG4gIEhJREU6ICdoaWRlJyxcbiAgSElEREVOOiAnaGlkZGVuJyxcblxuICAvLyBoYXNoXG4gIEhBU0g6ICdoYXNoJyxcblxuICAvLyB0b3VjaCwgbW91c2UgYW5kIHBvaW50ZXIgZXZlbnRzIHBvbHlmaWxsXG4gIFNUQVJUOiBhdmFpbGFibGVFdmVudHNbMF0sXG4gIE1PVkU6IGF2YWlsYWJsZUV2ZW50c1sxXSxcbiAgRU5EOiBhdmFpbGFibGVFdmVudHNbMl0sXG4gIENBTkNFTDogdHlwZW9mIGF2YWlsYWJsZUV2ZW50c1szXSA9PT0gJ3VuZGVmaW5lZCcgPyBudWxsIDogYXZhaWxhYmxlRXZlbnRzWzNdLFxuXG4gIC8vIHRyYW5zaXRpb25zXG4gIFRSQU5TSVRJT05fU1RBUlQ6IHRyYW5zaXRpb25TdGFydCxcbiAgVFJBTlNJVElPTl9FTkQ6IHRyYW5zaXRpb25FbmQsXG5cbiAgLy8gYW5pbWF0aW9uc1xuICBBTklNQVRJT05fU1RBUlQ6IGFuaW1hdGlvblN0YXJ0LFxuICBBTklNQVRJT05fRU5EOiBhbmltYXRpb25FbmQsXG5cbiAgLy8gZHJvcGRvd25cbiAgSVRFTV9TRUxFQ1RFRDogJ2l0ZW1TZWxlY3RlZCcsXG59IiwiLyoqXG4gKiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICogTGljZW5zZWQgdW5kZXIgTUlUIChodHRwczovL2dpdGh1Yi5jb20vcXVhcmstZGV2L1Bob25vbi1GcmFtZXdvcmsvYmxvYi9tYXN0ZXIvTElDRU5TRSlcbiAqIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gKi9cblxuaW1wb3J0IEV2ZW50IGZyb20gJy4uLy4uL2NvbW1vbi9ldmVudHMnXG5pbXBvcnQgQ29tcG9uZW50IGZyb20gJy4uLy4uL2NvbXBvbmVudHMvY29tcG9uZW50J1xuXG5jb25zdCBOZXR3b3JrID0gKCgpID0+IHtcbiAgLyoqXG4gICAqIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgKiBDb25zdGFudHNcbiAgICogLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAqL1xuXG4gIGNvbnN0IE5BTUUgPSAnbmV0d29yaydcbiAgY29uc3QgVkVSU0lPTiA9ICcyLjAuMCdcbiAgY29uc3QgREVGQVVMVF9QUk9QRVJUSUVTID0ge1xuICAgIGVsZW1lbnQ6IG51bGwsXG4gICAgaW5pdGlhbERlbGF5OiAzMDAwLFxuICAgIGRlbGF5OiA1MDAwLFxuICB9XG4gIGNvbnN0IERBVEFfQVRUUlNfUFJPUEVSVElFUyA9IFtcbiAgXVxuXG4gIC8qKlxuICAgKiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICogQ2xhc3MgRGVmaW5pdGlvblxuICAgKiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICovXG5cbiAgY2xhc3MgTmV0d29yayBleHRlbmRzIENvbXBvbmVudCB7XG4gICAgLyoqXG4gICAgICogQ3JlYXRlcyBhbiBpbnN0YW5jZSBvZiBOZXR3b3JrLlxuICAgICAqIEBwYXJhbSB7e319IFtvcHRpb25zPXt9XVxuICAgICAqL1xuICAgIGNvbnN0cnVjdG9yKG9wdGlvbnMgPSB7fSkge1xuICAgICAgc3VwZXIoTkFNRSwgVkVSU0lPTiwgREVGQVVMVF9QUk9QRVJUSUVTLCBvcHRpb25zLCBEQVRBX0FUVFJTX1BST1BFUlRJRVMsIHRydWUsIGZhbHNlKVxuXG4gICAgICB0aGlzLnhociA9IG51bGxcbiAgICAgIHRoaXMuY2hlY2tJbnRlcnZhbCA9IG51bGxcblxuICAgICAgdGhpcy5zZXRTdGF0dXMoRXZlbnQuTkVUV09SS19PTkxJTkUpXG5cbiAgICAgIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgICB0aGlzLnN0YXJ0Q2hlY2soKVxuICAgICAgfSwgdGhpcy5vcHRpb25zLmluaXRpYWxEZWxheSlcbiAgICB9XG5cbiAgICBnZXRTdGF0dXMoKSB7XG4gICAgICByZXR1cm4gdGhpcy5zdGF0dXNcbiAgICB9XG5cbiAgICBzZXRTdGF0dXMoc3RhdHVzKSB7XG4gICAgICB0aGlzLnN0YXR1cyA9IHN0YXR1c1xuICAgIH1cblxuICAgIHN0YXJ0UmVxdWVzdCgpIHtcbiAgICAgIHRoaXMueGhyID0gbmV3IFhNTEh0dHBSZXF1ZXN0KClcbiAgICAgIHRoaXMueGhyLm9mZmxpbmUgPSBmYWxzZVxuXG4gICAgICBjb25zdCB1cmwgPSBgL2Zhdmljb24uaWNvP189JHtuZXcgRGF0ZSgpLmdldFRpbWUoKX1gXG5cbiAgICAgIHRoaXMudHJpZ2dlckV2ZW50KEV2ZW50Lk5FVFdPUktfUkVDT05ORUNUSU5HLCB7IGRhdGU6IG5ldyBEYXRlKCkgfSwgZmFsc2UpICAgICAgICAgICAgXG5cbiAgICAgIHRoaXMueGhyLm9wZW4oJ0hFQUQnLCB1cmwsIHRydWUpXG5cbiAgICAgIHRoaXMueGhyLnRpbWVvdXQgPSB0aGlzLm9wdGlvbnMuZGVsYXkgLSAxXG4gICAgICB0aGlzLnhoci5vbnRpbWVvdXQgPSAoKSA9PiB7XG4gICAgICAgIHRoaXMueGhyLmFib3J0KClcbiAgICAgICAgdGhpcy54aHIgPSBudWxsXG4gICAgICB9XG5cbiAgICAgIHRoaXMueGhyLm9ubG9hZCA9ICgpID0+IHtcbiAgICAgICAgdGhpcy5vblVwKClcbiAgICAgIH1cbiAgICAgIHRoaXMueGhyLm9uZXJyb3IgPSAoKSA9PiB7XG4gICAgICAgIHRoaXMub25Eb3duKClcbiAgICAgIH1cblxuICAgICAgdHJ5IHtcbiAgICAgICAgdGhpcy54aHIuc2VuZCgpXG4gICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgIHRoaXMub25Eb3duKClcbiAgICAgIH1cbiAgICB9XG5cbiAgICBvblVwKCkge1xuICAgICAgdGhpcy50cmlnZ2VyRXZlbnQoRXZlbnQuTkVUV09SS19SRUNPTk5FQ1RJTkdfU1VDQ0VTUywgeyBkYXRlOiBuZXcgRGF0ZSgpIH0sIGZhbHNlKVxuXG4gICAgICBpZiAodGhpcy5nZXRTdGF0dXMoKSAhPT0gRXZlbnQuTkVUV09SS19PTkxJTkUpIHtcbiAgICAgICAgdGhpcy50cmlnZ2VyRXZlbnQoRXZlbnQuTkVUV09SS19PTkxJTkUsIHsgZGF0ZTogbmV3IERhdGUoKSB9LCBmYWxzZSlcbiAgICAgIH1cblxuICAgICAgdGhpcy5zZXRTdGF0dXMoRXZlbnQuTkVUV09SS19PTkxJTkUpICAgICAgXG4gICAgfVxuXG4gICAgb25Eb3duKCkge1xuICAgICAgdGhpcy50cmlnZ2VyRXZlbnQoRXZlbnQuTkVUV09SS19SRUNPTk5FQ1RJTkdfRkFJTFVSRSwgeyBkYXRlOiBuZXcgRGF0ZSgpIH0sIGZhbHNlKVxuXG4gICAgICBpZiAodGhpcy5nZXRTdGF0dXMoKSAhPT0gRXZlbnQuTkVUV09SS19PRkZMSU5FKSB7XG4gICAgICAgIHRoaXMudHJpZ2dlckV2ZW50KEV2ZW50Lk5FVFdPUktfT0ZGTElORSwgeyBkYXRlOiBuZXcgRGF0ZSgpIH0sIGZhbHNlKVxuICAgICAgfVxuXG4gICAgICB0aGlzLnNldFN0YXR1cyhFdmVudC5ORVRXT1JLX09GRkxJTkUpICAgICAgXG4gICAgfVxuXG4gICAgc3RhcnRDaGVjaygpIHtcbiAgICAgIHRoaXMuc3RvcENoZWNrKClcblxuICAgICAgdGhpcy5zdGFydFJlcXVlc3QoKSAgICAgIFxuXG4gICAgICB0aGlzLmNoZWNrSW50ZXJ2YWwgPSBzZXRJbnRlcnZhbCgoKSA9PiB7XG4gICAgICAgIHRoaXMuc3RhcnRSZXF1ZXN0KClcbiAgICAgIH0sIHRoaXMub3B0aW9ucy5kZWxheSlcbiAgICB9XG5cbiAgICBzdG9wQ2hlY2soKSB7XG4gICAgICBpZiAodGhpcy5jaGVja0ludGVydmFsICE9PSBudWxsKSB7XG4gICAgICAgIGNsZWFySW50ZXJ2YWwodGhpcy5jaGVja0ludGVydmFsKVxuICAgICAgICB0aGlzLmNoZWNrSW50ZXJ2YWwgPSBudWxsXG4gICAgICB9XG4gICAgfVxuXG4gICAgc3RhdGljIF9ET01JbnRlcmZhY2Uob3B0aW9ucykge1xuICAgICAgcmV0dXJuIHN1cGVyLl9ET01JbnRlcmZhY2UoTmV0d29yaywgb3B0aW9ucylcbiAgICB9XG4gIH1cblxuICByZXR1cm4gTmV0d29ya1xufSkoKVxuXG5leHBvcnQgZGVmYXVsdCBOZXR3b3JrXG4iLCJcbmV4cG9ydCBmdW5jdGlvbiBsb2FkRmlsZSh1cmwsIGZuLCBwb3N0RGF0YSkge1xuICBjb25zdCByZXEgPSBuZXcgWE1MSHR0cFJlcXVlc3QoKVxuICBpZiAocmVxLm92ZXJyaWRlTWltZVR5cGUpIHJlcS5vdmVycmlkZU1pbWVUeXBlKCd0ZXh0L2h0bWw7IGNoYXJzZXQ9dXRmLTgnKVxuICByZXEub25yZWFkeXN0YXRlY2hhbmdlID0gKCkgPT4ge1xuICAgIGlmIChyZXEucmVhZHlTdGF0ZSA9PT0gNCAmJiAocGFyc2VJbnQocmVxLnN0YXR1cywgMTApID09PSAyMDBcbiAgICAgIHx8ICFyZXEuc3RhdHVzICYmIHJlcS5yZXNwb25zZVRleHQubGVuZ3RoKSkge1xuICAgICAgZm4ocmVxLnJlc3BvbnNlVGV4dClcbiAgICB9XG4gIH1cblxuICBpZiAodHlwZW9mIHBvc3REYXRhICE9PSAnc3RyaW5nJykge1xuICAgIHJlcS5vcGVuKCdHRVQnLCB1cmwsIHRydWUpXG4gICAgcmVxLnNlbmQoJycpXG4gIH0gZWxzZSB7XG4gICAgcmVxLm9wZW4oJ1BPU1QnLCB1cmwsIHRydWUpXG4gICAgcmVxLnNldFJlcXVlc3RIZWFkZXIoJ0NvbnRlbnQtdHlwZScsICdhcHBsaWNhdGlvbi94LXd3dy1mb3JtLXVybGVuY29kZWQnKVxuICAgIHJlcS5zZW5kKHBvc3REYXRhKVxuICB9XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBnZW5lcmF0ZUlkKCkge1xuICByZXR1cm4gTWF0aC5yYW5kb20oKS50b1N0cmluZygzNikuc3Vic3RyKDIsIDEwKVxufVxuXG5leHBvcnQgZnVuY3Rpb24gZmluZFRhcmdldEJ5Q2xhc3ModGFyZ2V0LCBwYXJlbnRDbGFzcykge1xuICBmb3IgKDsgdGFyZ2V0ICYmIHRhcmdldCAhPT0gZG9jdW1lbnQ7IHRhcmdldCA9IHRhcmdldC5wYXJlbnROb2RlKSB7XG4gICAgaWYgKHRhcmdldC5jbGFzc0xpc3QuY29udGFpbnMocGFyZW50Q2xhc3MpKSB7XG4gICAgICByZXR1cm4gdGFyZ2V0XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIG51bGxcbn1cblxuXG5leHBvcnQgZnVuY3Rpb24gZmluZFRhcmdldEJ5SWQodGFyZ2V0LCBwYXJlbnRJZCkge1xuICBmb3IgKDsgdGFyZ2V0ICYmIHRhcmdldCAhPT0gZG9jdW1lbnQ7IHRhcmdldCA9IHRhcmdldC5wYXJlbnROb2RlKSB7XG4gICAgaWYgKHRhcmdldC5nZXRBdHRyaWJ1dGUoJ2lkJykgPT09IHBhcmVudElkKSB7XG4gICAgICByZXR1cm4gdGFyZ2V0XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIG51bGxcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGZpbmRUYXJnZXRCeUF0dHIodGFyZ2V0LCBhdHRyKSB7XG4gIGZvciAoOyB0YXJnZXQgJiYgdGFyZ2V0ICE9PSBkb2N1bWVudDsgdGFyZ2V0ID0gdGFyZ2V0LnBhcmVudE5vZGUpIHtcbiAgICBpZiAodGFyZ2V0LmdldEF0dHJpYnV0ZShhdHRyKSAhPT0gbnVsbCkge1xuICAgICAgcmV0dXJuIHRhcmdldFxuICAgIH1cbiAgfVxuXG4gIHJldHVybiBudWxsXG59XG4iLCIvKipcbiAqIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gKiBMaWNlbnNlZCB1bmRlciBNSVQgKGh0dHBzOi8vZ2l0aHViLmNvbS9xdWFyay1kZXYvUGhvbm9uLUZyYW1ld29yay9ibG9iL21hc3Rlci9MSUNFTlNFKVxuICogLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAqL1xuaW1wb3J0IENvbXBvbmVudCBmcm9tICcuLi9jb21wb25lbnQnXG5pbXBvcnQgQ29sbGFwc2UgZnJvbSAnLi4vY29sbGFwc2UnXG5pbXBvcnQgeyBnZXRBdHRyaWJ1dGVzQ29uZmlnIH0gZnJvbSAnLi4vY29tcG9uZW50TWFuYWdlcidcbmltcG9ydCB7IGZpbmRUYXJnZXRCeUNsYXNzIH0gZnJvbSAnLi4vLi4vY29tbW9uL3V0aWxzJ1xuXG5jb25zdCBBY2NvcmRpb24gPSAoKCkgPT4ge1xuICAvKipcbiAgICogLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAqIENvbnN0YW50c1xuICAgKiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICovXG5cbiAgY29uc3QgTkFNRSA9ICdhY2NvcmRpb24nXG4gIGNvbnN0IFZFUlNJT04gPSAnMi4wLjAnXG4gIGNvbnN0IERFRkFVTFRfUFJPUEVSVElFUyA9IHtcbiAgICBlbGVtZW50OiBudWxsLFxuICB9XG4gIGNvbnN0IERBVEFfQVRUUlNfUFJPUEVSVElFUyA9IFtcbiAgXVxuXG4gIC8qKlxuICAgKiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICogQ2xhc3MgRGVmaW5pdGlvblxuICAgKiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICovXG5cbiAgY2xhc3MgQWNjb3JkaW9uIGV4dGVuZHMgQ29tcG9uZW50IHtcblxuICAgIGNvbnN0cnVjdG9yKG9wdGlvbnMgPSB7fSkge1xuICAgICAgc3VwZXIoTkFNRSwgVkVSU0lPTiwgREVGQVVMVF9QUk9QRVJUSUVTLCBvcHRpb25zLCBEQVRBX0FUVFJTX1BST1BFUlRJRVMsIGZhbHNlLCBmYWxzZSlcblxuICAgICAgdGhpcy5jb2xsYXBzZXMgPSBbXVxuXG4gICAgICBjb25zdCB0b2dnbGVzID0gdGhpcy5vcHRpb25zLmVsZW1lbnQucXVlcnlTZWxlY3RvckFsbChgW2RhdGEtdG9nZ2xlPVwiJHtOQU1FfVwiXWApXG4gICAgICBBcnJheS5mcm9tKHRvZ2dsZXMpLmZvckVhY2goKHRvZ2dsZSkgPT4ge1xuICAgICAgICBjb25zdCBjb2xsYXBzZUlkID0gdG9nZ2xlLmdldEF0dHJpYnV0ZSgnaHJlZicpXG4gICAgICAgIGNvbnN0IGNvbGxhcHNlID0gZG9jdW1lbnQucXVlcnlTZWxlY3Rvcihjb2xsYXBzZUlkKVxuXG4gICAgICAgIGlmIChjb2xsYXBzZSkge1xuICAgICAgICAgIHRoaXMuYWRkQ29sbGFwc2UoY29sbGFwc2UpXG4gICAgICAgIH1cbiAgICAgIH0pXG4gICAgfVxuXG4gICAgb25FbGVtZW50RXZlbnQoZXZlbnQpIHtcbiAgICAgIGNvbnN0IGlkID0gZXZlbnQudGFyZ2V0LmdldEF0dHJpYnV0ZSgnaHJlZicpXG4gICAgICBjb25zdCBlbGVtZW50ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihpZClcblxuICAgICAgdGhpcy5zZXRDb2xsYXBzZXMoZWxlbWVudClcbiAgICB9XG5cbiAgICBhZGRDb2xsYXBzZShlbGVtZW50KSB7XG4gICAgICBjb25zdCBjb2xsYXBzZSA9IG5ldyBDb2xsYXBzZSh7XG4gICAgICAgIGVsZW1lbnQsXG4gICAgICB9KVxuICAgICAgdGhpcy5jb2xsYXBzZXMucHVzaChjb2xsYXBzZSlcblxuICAgICAgcmV0dXJuIGNvbGxhcHNlXG4gICAgfVxuXG4gICAgZ2V0Q29sbGFwc2UoZWxlbWVudCkge1xuICAgICAgbGV0IGNvbGxhcHNlID0gdGhpcy5jb2xsYXBzZXMuZmluZChjID0+IGMub3B0aW9ucy5lbGVtZW50LmdldEF0dHJpYnV0ZSgnaWQnKSA9PT0gZWxlbWVudC5nZXRBdHRyaWJ1dGUoJ2lkJykpXG5cbiAgICAgIGlmICghY29sbGFwc2UpIHtcbiAgICAgICAgLy8gY3JlYXRlIGEgbmV3IGNvbGxhcHNlXG4gICAgICAgIGNvbGxhcHNlID0gdGhpcy5hZGRDb2xsYXBzZSgpXG4gICAgICB9XG5cbiAgICAgIHJldHVybiBjb2xsYXBzZVxuICAgIH1cblxuICAgIGdldENvbGxhcHNlcygpIHtcbiAgICAgIHJldHVybiB0aGlzLmNvbGxhcHNlc1xuICAgIH1cblxuICAgIHNldENvbGxhcHNlcyhzaG93Q29sbGFwc2UpIHtcbiAgICAgIGNvbnN0IGNvbGxhcHNlID0gdGhpcy5nZXRDb2xsYXBzZShzaG93Q29sbGFwc2UpXG4gICAgICB0aGlzLmNvbGxhcHNlcy5mb3JFYWNoKChjKSA9PiB7XG4gICAgICAgIGlmIChjLm9wdGlvbnMuZWxlbWVudC5nZXRBdHRyaWJ1dGUoJ2lkJykgIT09IHNob3dDb2xsYXBzZS5nZXRBdHRyaWJ1dGUoJ2lkJykpIHtcbiAgICAgICAgICBjLmhpZGUoKVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGNvbGxhcHNlLnRvZ2dsZSgpXG4gICAgICAgIH1cbiAgICAgIH0pXG4gICAgfVxuXG4gICAgc2hvdyhjb2xsYXBzZUVsKSB7XG4gICAgICBsZXQgY29sbGFwc2UgPSBjb2xsYXBzZUVsXG4gICAgICBpZiAodHlwZW9mIGNvbGxhcHNlRWwgPT09ICdzdHJpbmcnKSB7XG4gICAgICAgIGNvbGxhcHNlID0gZG9jdW1lbnQucXVlcnlTZWxlY3Rvcihjb2xsYXBzZUVsKVxuICAgICAgfVxuXG4gICAgICBpZiAoIWNvbGxhcHNlKSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcihgJHtOQU1FfS4gVGhlIGNvbGxhcHNpYmxlICR7Y29sbGFwc2VFbH0gaXMgYW4gaW52YWxpZCBIVE1MRWxlbWVudC5gKVxuICAgICAgfVxuXG4gICAgICB0aGlzLnNldENvbGxhcHNlcyhjb2xsYXBzZSlcblxuICAgICAgcmV0dXJuIHRydWVcbiAgICB9XG5cbiAgICBoaWRlKGNvbGxhcHNlRWwpIHtcbiAgICAgIGxldCBjb2xsYXBzZSA9IGNvbGxhcHNlRWxcbiAgICAgIGlmICh0eXBlb2YgY29sbGFwc2VFbCA9PT0gJ3N0cmluZycpIHtcbiAgICAgICAgY29sbGFwc2UgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKGNvbGxhcHNlRWwpXG4gICAgICB9XG5cbiAgICAgIGlmICghY29sbGFwc2UpIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKGAke05BTUV9LiBUaGUgY29sbGFwc2libGUgJHtjb2xsYXBzZUVsfSBpcyBhbiBpbnZhbGlkIEhUTUxFbGVtZW50LmApXG4gICAgICB9XG5cbiAgICAgIGNvbnN0IGNvbGxhcHNlT2JqID0gdGhpcy5nZXRDb2xsYXBzZShjb2xsYXBzZSlcbiAgICAgIHJldHVybiBjb2xsYXBzZU9iai5oaWRlKClcbiAgICB9XG5cbiAgICBzdGF0aWMgaWRlbnRpZmllcigpIHtcbiAgICAgIHJldHVybiBOQU1FXG4gICAgfVxuXG4gICAgc3RhdGljIF9ET01JbnRlcmZhY2Uob3B0aW9ucykge1xuICAgICAgcmV0dXJuIHN1cGVyLl9ET01JbnRlcmZhY2UoQWNjb3JkaW9uLCBvcHRpb25zKVxuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICogRE9NIEFwaSBpbXBsZW1lbnRhdGlvblxuICAgKiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICovXG4gIGNvbnN0IGNvbXBvbmVudHMgPSBbXVxuXG4gIGNvbnN0IGFjY29yZGlvbnMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKGAuJHtOQU1FfWApXG4gIGlmIChhY2NvcmRpb25zKSB7XG4gICAgQXJyYXkuZnJvbShhY2NvcmRpb25zKS5mb3JFYWNoKChlbGVtZW50KSA9PiB7XG4gICAgICBjb25zdCBjb25maWcgPSBnZXRBdHRyaWJ1dGVzQ29uZmlnKGVsZW1lbnQsIERFRkFVTFRfUFJPUEVSVElFUywgREFUQV9BVFRSU19QUk9QRVJUSUVTKVxuICAgICAgY29uZmlnLmVsZW1lbnQgPSBlbGVtZW50XG5cbiAgICAgIGNvbXBvbmVudHMucHVzaChBY2NvcmRpb24uX0RPTUludGVyZmFjZShjb25maWcpKVxuICAgIH0pXG4gIH1cblxuICBpZiAoYWNjb3JkaW9ucykge1xuICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKGV2ZW50KSA9PiB7XG4gICAgICBjb25zdCBkYXRhVG9nZ2xlQXR0ciA9IGV2ZW50LnRhcmdldC5nZXRBdHRyaWJ1dGUoJ2RhdGEtdG9nZ2xlJylcbiAgICAgIGlmIChkYXRhVG9nZ2xlQXR0ciAmJiBkYXRhVG9nZ2xlQXR0ciA9PT0gTkFNRSkge1xuICAgICAgICBjb25zdCBjb2xsYXBzZUlkID0gZXZlbnQudGFyZ2V0LmdldEF0dHJpYnV0ZSgnZGF0YS10YXJnZXQnKSB8fCBldmVudC50YXJnZXQuZ2V0QXR0cmlidXRlKCdocmVmJylcbiAgICAgICAgY29uc3QgY29sbGFwc2VFbCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoY29sbGFwc2VJZClcblxuICAgICAgICBjb25zdCBhY2NvcmRpb24gPSBmaW5kVGFyZ2V0QnlDbGFzcyhldmVudC50YXJnZXQsICdhY2NvcmRpb24nKVxuXG4gICAgICAgIGlmIChhY2NvcmRpb24gPT09IG51bGwpIHtcbiAgICAgICAgICByZXR1cm5cbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IGFjY29yZGlvbklkID0gYWNjb3JkaW9uLmdldEF0dHJpYnV0ZSgnaWQnKVxuICAgICAgICBjb25zdCBjb21wb25lbnQgPSBjb21wb25lbnRzLmZpbmQoYyA9PiBjLmdldEVsZW1lbnQoKS5nZXRBdHRyaWJ1dGUoJ2lkJykgPT09IGFjY29yZGlvbklkKVxuXG4gICAgICAgIGlmICghY29tcG9uZW50KSB7XG4gICAgICAgICAgcmV0dXJuXG4gICAgICAgIH1cblxuICAgICAgICAvLyBpZiB0aGUgY29sbGFwc2UgaGFzIGJlZW4gYWRkZWQgcHJvZ3JhbW1hdGljYWxseSwgd2UgYWRkIGl0XG4gICAgICAgIGNvbnN0IHRhcmdldENvbGxhcHNlID0gY29tcG9uZW50LmdldENvbGxhcHNlcygpLmZpbmQoYyA9PiBjLmdldEVsZW1lbnQoKSA9PT0gY29sbGFwc2VFbClcbiAgICAgICAgaWYgKCF0YXJnZXRDb2xsYXBzZSkge1xuICAgICAgICAgIGNvbXBvbmVudC5hZGRDb2xsYXBzZShjb2xsYXBzZUVsKVxuICAgICAgICB9XG5cbiAgICAgICAgY29tcG9uZW50LnNob3coY29sbGFwc2VJZClcbiAgICAgIH1cbiAgICB9KVxuICB9XG5cbiAgcmV0dXJuIEFjY29yZGlvblxufSkoKVxuXG5leHBvcnQgZGVmYXVsdCBBY2NvcmRpb25cbiIsIi8qKlxuICogLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAqIExpY2Vuc2VkIHVuZGVyIE1JVCAoaHR0cHM6Ly9naXRodWIuY29tL3F1YXJrLWRldi9QaG9ub24tRnJhbWV3b3JrL2Jsb2IvbWFzdGVyL0xJQ0VOU0UpXG4gKiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICovXG5pbXBvcnQgQ29tcG9uZW50IGZyb20gJy4uL2NvbXBvbmVudCdcbmltcG9ydCB7IGdldEF0dHJpYnV0ZXNDb25maWcgfSBmcm9tICcuLi9jb21wb25lbnRNYW5hZ2VyJ1xuaW1wb3J0IEV2ZW50IGZyb20gJy4uLy4uL2NvbW1vbi9ldmVudHMnXG5pbXBvcnQgeyBmaW5kVGFyZ2V0QnlBdHRyIH0gZnJvbSAnLi4vLi4vY29tbW9uL3V0aWxzJ1xuXG5jb25zdCBDb2xsYXBzZSA9ICgoKSA9PiB7XG4gIC8qKlxuICAgKiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICogQ29uc3RhbnRzXG4gICAqIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgKi9cblxuICBjb25zdCBOQU1FID0gJ2NvbGxhcHNlJ1xuICBjb25zdCBWRVJTSU9OID0gJzIuMC4wJ1xuICBjb25zdCBERUZBVUxUX1BST1BFUlRJRVMgPSB7XG4gICAgZWxlbWVudDogbnVsbCxcbiAgICB0b2dnbGU6IGZhbHNlLFxuICB9XG4gIGNvbnN0IERBVEFfQVRUUlNfUFJPUEVSVElFUyA9IFtcbiAgICAndG9nZ2xlJyxcbiAgXVxuXG4gIC8qKlxuICAgKiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICogQ2xhc3MgRGVmaW5pdGlvblxuICAgKiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICovXG5cbiAgY2xhc3MgQ29sbGFwc2UgZXh0ZW5kcyBDb21wb25lbnQge1xuXG4gICAgY29uc3RydWN0b3Iob3B0aW9ucyA9IHt9KSB7XG4gICAgICBzdXBlcihOQU1FLCBWRVJTSU9OLCBERUZBVUxUX1BST1BFUlRJRVMsIG9wdGlvbnMsIERBVEFfQVRUUlNfUFJPUEVSVElFUywgZmFsc2UsIGZhbHNlKVxuXG4gICAgICB0aGlzLm9uVHJhbnNpdGlvbiA9IGZhbHNlXG5cbiAgICAgIC8vIHRvZ2dsZSBkaXJlY3RseVxuICAgICAgaWYgKHRoaXMub3B0aW9ucy50b2dnbGUpIHtcbiAgICAgICAgdGhpcy5zaG93KClcbiAgICAgIH1cbiAgICB9XG5cbiAgICBnZXRIZWlnaHQoKSB7XG4gICAgICByZXR1cm4gdGhpcy5vcHRpb25zLmVsZW1lbnQuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KHRoaXMub3B0aW9ucy5lbGVtZW50KS5oZWlnaHRcbiAgICB9XG5cbiAgICB0b2dnbGUoKSB7XG4gICAgICBpZiAodGhpcy5vcHRpb25zLmVsZW1lbnQuY2xhc3NMaXN0LmNvbnRhaW5zKCdzaG93JykpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuaGlkZSgpXG4gICAgICB9XG5cbiAgICAgIHJldHVybiB0aGlzLnNob3coKVxuICAgIH1cblxuICAgIHNob3coKSB7XG4gICAgICBpZiAodGhpcy5vblRyYW5zaXRpb24pIHtcbiAgICAgICAgcmV0dXJuIGZhbHNlXG4gICAgICB9XG5cbiAgICAgIGlmICh0aGlzLm9wdGlvbnMuZWxlbWVudC5jbGFzc0xpc3QuY29udGFpbnMoJ3Nob3cnKSkge1xuICAgICAgICByZXR1cm4gZmFsc2VcbiAgICAgIH1cblxuICAgICAgdGhpcy5vblRyYW5zaXRpb24gPSB0cnVlXG5cbiAgICAgIGNvbnN0IG9uQ29sbGFwc2VkID0gKCkgPT4ge1xuICAgICAgICB0aGlzLm9wdGlvbnMuZWxlbWVudC5jbGFzc0xpc3QuYWRkKCdzaG93JylcbiAgICAgICAgdGhpcy5vcHRpb25zLmVsZW1lbnQuY2xhc3NMaXN0LnJlbW92ZSgnY29sbGFwc2luZycpXG4gICAgICAgIHRoaXMub3B0aW9ucy5lbGVtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoRXZlbnQuVFJBTlNJVElPTl9FTkQsIG9uQ29sbGFwc2VkKVxuXG4gICAgICAgIHRoaXMub3B0aW9ucy5lbGVtZW50LnNldEF0dHJpYnV0ZSgnYXJpYS1leHBhbmRlZCcsIHRydWUpXG5cbiAgICAgICAgdGhpcy5vblRyYW5zaXRpb24gPSBmYWxzZVxuICAgICAgfVxuXG4gICAgICBpZiAoIXRoaXMub3B0aW9ucy5lbGVtZW50LmNsYXNzTGlzdC5jb250YWlucygnY29sbGFwc2luZycpKSB7XG4gICAgICAgIHRoaXMub3B0aW9ucy5lbGVtZW50LmNsYXNzTGlzdC5hZGQoJ2NvbGxhcHNpbmcnKVxuICAgICAgfVxuXG4gICAgICB0aGlzLm9wdGlvbnMuZWxlbWVudC5hZGRFdmVudExpc3RlbmVyKEV2ZW50LlRSQU5TSVRJT05fRU5ELCBvbkNvbGxhcHNlZClcblxuICAgICAgY29uc3QgaGVpZ2h0ID0gdGhpcy5nZXRIZWlnaHQoKVxuXG4gICAgICB0aGlzLm9wdGlvbnMuZWxlbWVudC5zdHlsZS5oZWlnaHQgPSAnMHB4J1xuXG4gICAgICBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgICAgdGhpcy5vcHRpb25zLmVsZW1lbnQuc3R5bGUuaGVpZ2h0ID0gYCR7aGVpZ2h0fXB4YFxuICAgICAgfSwgMjApXG5cbiAgICAgIHJldHVybiB0cnVlXG4gICAgfVxuXG4gICAgaGlkZSgpIHtcbiAgICAgIGlmICh0aGlzLm9uVHJhbnNpdGlvbikge1xuICAgICAgICByZXR1cm4gZmFsc2VcbiAgICAgIH1cblxuICAgICAgaWYgKCF0aGlzLm9wdGlvbnMuZWxlbWVudC5jbGFzc0xpc3QuY29udGFpbnMoJ3Nob3cnKSkge1xuICAgICAgICByZXR1cm4gZmFsc2VcbiAgICAgIH1cblxuICAgICAgdGhpcy5vblRyYW5zaXRpb24gPSB0cnVlXG5cbiAgICAgIGNvbnN0IG9uQ29sbGFwc2VkID0gKCkgPT4ge1xuICAgICAgICB0aGlzLm9wdGlvbnMuZWxlbWVudC5jbGFzc0xpc3QucmVtb3ZlKCdjb2xsYXBzaW5nJylcbiAgICAgICAgdGhpcy5vcHRpb25zLmVsZW1lbnQuc3R5bGUuaGVpZ2h0ID0gJ2F1dG8nXG4gICAgICAgIHRoaXMub3B0aW9ucy5lbGVtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoRXZlbnQuVFJBTlNJVElPTl9FTkQsIG9uQ29sbGFwc2VkKVxuXG4gICAgICAgIHRoaXMub3B0aW9ucy5lbGVtZW50LnNldEF0dHJpYnV0ZSgnYXJpYS1leHBhbmRlZCcsIGZhbHNlKVxuXG4gICAgICAgIHRoaXMub25UcmFuc2l0aW9uID0gZmFsc2VcbiAgICAgIH1cblxuICAgICAgdGhpcy5vcHRpb25zLmVsZW1lbnQuc3R5bGUuaGVpZ2h0ID0gJzBweCdcblxuICAgICAgaWYgKCF0aGlzLm9wdGlvbnMuZWxlbWVudC5jbGFzc0xpc3QuY29udGFpbnMoJ2NvbGxhcHNpbmcnKSkge1xuICAgICAgICB0aGlzLm9wdGlvbnMuZWxlbWVudC5jbGFzc0xpc3QuYWRkKCdjb2xsYXBzaW5nJylcbiAgICAgIH1cblxuICAgICAgdGhpcy5vcHRpb25zLmVsZW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihFdmVudC5UUkFOU0lUSU9OX0VORCwgb25Db2xsYXBzZWQpXG5cbiAgICAgIHRoaXMub3B0aW9ucy5lbGVtZW50LmNsYXNzTGlzdC5yZW1vdmUoJ3Nob3cnKVxuXG4gICAgICByZXR1cm4gdHJ1ZVxuICAgIH1cblxuICAgIHN0YXRpYyBpZGVudGlmaWVyKCkge1xuICAgICAgcmV0dXJuIE5BTUVcbiAgICB9XG5cbiAgICBzdGF0aWMgX0RPTUludGVyZmFjZShvcHRpb25zKSB7XG4gICAgICByZXR1cm4gc3VwZXIuX0RPTUludGVyZmFjZShDb2xsYXBzZSwgb3B0aW9ucylcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAqIERPTSBBcGkgaW1wbGVtZW50YXRpb25cbiAgICogLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAqL1xuICBjb25zdCBjb21wb25lbnRzID0gW11cblxuICBjb25zdCBjb2xsYXBzZXMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKGAuJHtOQU1FfWApXG4gIGlmIChjb2xsYXBzZXMpIHtcbiAgICBjb2xsYXBzZXMuZm9yRWFjaCgoZWxlbWVudCkgPT4ge1xuICAgICAgLy8gY29uc3QgY29uZmlnID0ge31cbiAgICAgIGNvbnN0IGNvbmZpZyA9IGdldEF0dHJpYnV0ZXNDb25maWcoZWxlbWVudCwgREVGQVVMVF9QUk9QRVJUSUVTLCBEQVRBX0FUVFJTX1BST1BFUlRJRVMpXG4gICAgICBjb25maWcuZWxlbWVudCA9IGVsZW1lbnRcblxuICAgICAgY29tcG9uZW50cy5wdXNoKENvbGxhcHNlLl9ET01JbnRlcmZhY2UoY29uZmlnKSlcbiAgICB9KVxuICB9XG5cbiAgaWYgKGNvbGxhcHNlcykge1xuICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKGV2ZW50KSA9PiB7XG4gICAgICBjb25zdCB0YXJnZXQgPSBmaW5kVGFyZ2V0QnlBdHRyKGV2ZW50LnRhcmdldCwgJ2RhdGEtdG9nZ2xlJylcbiAgICAgIGlmICghdGFyZ2V0KSB7XG4gICAgICAgIHJldHVyblxuICAgICAgfVxuXG4gICAgICBjb25zdCBkYXRhVG9nZ2xlQXR0ciA9IHRhcmdldC5nZXRBdHRyaWJ1dGUoJ2RhdGEtdG9nZ2xlJylcblxuICAgICAgaWYgKGRhdGFUb2dnbGVBdHRyICYmIGRhdGFUb2dnbGVBdHRyID09PSBOQU1FKSB7XG4gICAgICAgIGxldCBpZCA9IHRhcmdldC5nZXRBdHRyaWJ1dGUoJ2RhdGEtdGFyZ2V0JykgfHwgdGFyZ2V0LmdldEF0dHJpYnV0ZSgnaHJlZicpXG4gICAgICAgIGlkID0gaWQucmVwbGFjZSgnIycsICcnKVxuXG4gICAgICAgIGNvbnN0IGNvbXBvbmVudCA9IGNvbXBvbmVudHMuZmluZChjID0+IGMuZ2V0RWxlbWVudCgpLmdldEF0dHJpYnV0ZSgnaWQnKSA9PT0gaWQpXG5cbiAgICAgICAgaWYgKCFjb21wb25lbnQpIHtcbiAgICAgICAgICByZXR1cm5cbiAgICAgICAgfVxuXG4gICAgICAgIGNvbXBvbmVudC50b2dnbGUoKVxuICAgICAgfVxuICAgIH0pXG4gIH1cblxuICByZXR1cm4gQ29sbGFwc2Vcbn0pKClcblxuZXhwb3J0IGRlZmF1bHQgQ29sbGFwc2VcbiIsIi8qKlxuICogLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAqIExpY2Vuc2VkIHVuZGVyIE1JVCAoaHR0cHM6Ly9naXRodWIuY29tL3F1YXJrLWRldi9QaG9ub24tRnJhbWV3b3JrL2Jsb2IvbWFzdGVyL0xJQ0VOU0UpXG4gKiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICovXG5pbXBvcnQgeyBkaXNwYXRjaEVsZW1lbnRFdmVudCwgZGlzcGF0Y2hXaW5Eb2NFdmVudCB9IGZyb20gJy4uL2NvbW1vbi9ldmVudHMvZGlzcGF0Y2gnXG5pbXBvcnQgeyBnZW5lcmF0ZUlkIH0gZnJvbSAnLi4vY29tbW9uL3V0aWxzJ1xuaW1wb3J0IEV2ZW50IGZyb20gJy4uL2NvbW1vbi9ldmVudHMnXG5pbXBvcnQgQ29tcG9uZW50TWFuYWdlciwgeyBzZXRBdHRyaWJ1dGVzQ29uZmlnLCBnZXRBdHRyaWJ1dGVzQ29uZmlnIH0gZnJvbSAnLi9jb21wb25lbnRNYW5hZ2VyJ1xuXG4vKipcbiAqIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICogQ2xhc3MgRGVmaW5pdGlvblxuICogLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gKi9cblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgQ29tcG9uZW50IHtcblxuICBjb25zdHJ1Y3RvcihuYW1lLCB2ZXJzaW9uLCBkZWZhdWx0T3B0aW9ucyA9IHt9LCBvcHRpb25zID0ge30sIG9wdGlvbkF0dHJzID0gW10sIHN1cHBvcnREeW5hbWljRWxlbWVudCA9IGZhbHNlLCBhZGRUb1N0YWNrID0gZmFsc2UpIHtcbiAgICB0aGlzLm5hbWUgPSBuYW1lXG4gICAgdGhpcy52ZXJzaW9uID0gdmVyc2lvblxuICAgIHRoaXMub3B0aW9ucyA9IG9wdGlvbnNcblxuICAgIC8vIEB0b2RvIGtlZXA/XG4gICAgLy8gdGhpcy5vcHRpb25zID0gT2JqZWN0LmFzc2lnbihkZWZhdWx0T3B0aW9ucywgb3B0aW9ucylcbiAgICBPYmplY3Qua2V5cyhkZWZhdWx0T3B0aW9ucykuZm9yRWFjaCgocHJvcCkgPT4ge1xuICAgICAgaWYgKHR5cGVvZiB0aGlzLm9wdGlvbnNbcHJvcF0gPT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgIHRoaXMub3B0aW9uc1twcm9wXSA9IGRlZmF1bHRPcHRpb25zW3Byb3BdXG4gICAgICB9XG4gICAgfSlcblxuICAgIHRoaXMub3B0aW9uQXR0cnMgPSBvcHRpb25BdHRyc1xuICAgIHRoaXMuc3VwcG9ydER5bmFtaWNFbGVtZW50ID0gc3VwcG9ydER5bmFtaWNFbGVtZW50XG4gICAgdGhpcy5hZGRUb1N0YWNrID0gYWRkVG9TdGFja1xuICAgIHRoaXMuaWQgPSBnZW5lcmF0ZUlkKClcblxuICAgIGNvbnN0IGNoZWNrRWxlbWVudCA9ICF0aGlzLnN1cHBvcnREeW5hbWljRWxlbWVudCB8fCB0aGlzLm9wdGlvbnMuZWxlbWVudCAhPT0gbnVsbFxuXG4gICAgaWYgKHR5cGVvZiB0aGlzLm9wdGlvbnMuZWxlbWVudCA9PT0gJ3N0cmluZycpIHtcbiAgICAgIHRoaXMub3B0aW9ucy5lbGVtZW50ID0gZG9jdW1lbnQucXVlcnlTZWxlY3Rvcih0aGlzLm9wdGlvbnMuZWxlbWVudClcbiAgICB9XG5cbiAgICBpZiAoY2hlY2tFbGVtZW50ICYmICF0aGlzLm9wdGlvbnMuZWxlbWVudCkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKGAke3RoaXMubmFtZX0uIFRoZSBlbGVtZW50IGlzIG5vdCBhIEhUTUxFbGVtZW50LmApXG4gICAgfVxuXG4gICAgdGhpcy5keW5hbWljRWxlbWVudCA9IHRoaXMub3B0aW9ucy5lbGVtZW50ID09PSBudWxsXG4gICAgdGhpcy5yZWdpc3RlcmVkRWxlbWVudHMgPSBbXVxuXG4gICAgaWYgKCF0aGlzLmR5bmFtaWNFbGVtZW50KSB7XG4gICAgICAvKipcbiAgICAgICAqIGlmIHRoZSBlbGVtZW50IGV4aXN0cywgd2UgcmVhZCB0aGUgZGF0YSBhdHRyaWJ1dGVzIGNvbmZpZ1xuICAgICAgICogdGhlbiB3ZSBvdmVyd3JpdGUgZXhpc3RpbmcgY29uZmlnIGtleXMgaW4gSmF2YVNjcmlwdCwgc28gdGhhdFxuICAgICAgICogd2Uga2VlcCB0aGUgZm9sbG93aW5nIG9yZGVyXG4gICAgICAgKiBbMV0gZGVmYXVsdCBKYXZhU2NyaXB0IGNvbmZpZ3VyYXRpb24gb2YgdGhlIGNvbXBvbmVudFxuICAgICAgICogWzJdIERhdGEgYXR0cmlidXRlcyBjb25maWd1cmF0aW9uIGlmIHRoZSBlbGVtZW50IGV4aXN0cyBpbiB0aGUgRE9NXG4gICAgICAgKiBbM10gSmF2YVNjcmlwdCBjb25maWd1cmF0aW9uXG4gICAgICAgKi9cbiAgICAgIHRoaXMub3B0aW9ucyA9IE9iamVjdC5hc3NpZ24odGhpcy5vcHRpb25zLCB0aGlzLmFzc2lnbkpzQ29uZmlnKHRoaXMuZ2V0QXR0cmlidXRlcygpLCBvcHRpb25zKSlcblxuICAgICAgLy8gdGhlbiwgc2V0IHRoZSBuZXcgZGF0YSBhdHRyaWJ1dGVzIHRvIHRoZSBlbGVtZW50XG4gICAgICB0aGlzLnNldEF0dHJpYnV0ZXMoKVxuICAgIH1cblxuICAgIHRoaXMuZWxlbWVudExpc3RlbmVyID0gZXZlbnQgPT4gdGhpcy5vbkJlZm9yZUVsZW1lbnRFdmVudChldmVudCkgICAgICAgICAgXG4gIH1cblxuICBhc3NpZ25Kc0NvbmZpZyhhdHRyQ29uZmlnLCBvcHRpb25zKSB7XG4gICAgdGhpcy5vcHRpb25BdHRycy5mb3JFYWNoKChrZXkpID0+IHtcbiAgICAgIGlmIChvcHRpb25zW2tleV0pIHtcbiAgICAgICAgYXR0ckNvbmZpZ1trZXldID0gb3B0aW9uc1trZXldXG4gICAgICB9XG4gICAgfSlcblxuICAgIHJldHVybiBhdHRyQ29uZmlnXG4gIH1cblxuICBnZXRWZXJzaW9uKCkge1xuICAgIHJldHVybiB0aGlzLnZlcnNpb25cbiAgfVxuXG4gIGdldEVsZW1lbnQoKSB7XG4gICAgcmV0dXJuIHRoaXMub3B0aW9ucy5lbGVtZW50XG4gIH1cblxuICBnZXRJZCgpIHtcbiAgICByZXR1cm4gdGhpcy5pZFxuICB9XG5cbiAgcmVnaXN0ZXJFbGVtZW50cyhlbGVtZW50cykge1xuICAgIGVsZW1lbnRzLmZvckVhY2goZWxlbWVudCA9PiB0aGlzLnJlZ2lzdGVyRWxlbWVudChlbGVtZW50KSlcbiAgfVxuXG4gIHJlZ2lzdGVyRWxlbWVudChlbGVtZW50KSB7XG4gICAgZWxlbWVudC50YXJnZXQuYWRkRXZlbnRMaXN0ZW5lcihlbGVtZW50LmV2ZW50LCB0aGlzLmVsZW1lbnRMaXN0ZW5lcilcbiAgICB0aGlzLnJlZ2lzdGVyZWRFbGVtZW50cy5wdXNoKGVsZW1lbnQpXG4gIH1cblxuICB1bnJlZ2lzdGVyRWxlbWVudHMoKSB7XG4gICAgdGhpcy5yZWdpc3RlcmVkRWxlbWVudHMuZm9yRWFjaCgoZWxlbWVudCkgPT4ge1xuICAgICAgdGhpcy51bnJlZ2lzdGVyRWxlbWVudChlbGVtZW50KVxuICAgIH0pXG4gIH1cblxuICB1bnJlZ2lzdGVyRWxlbWVudChlbGVtZW50KSB7XG4gICAgY29uc3QgcmVnaXN0ZXJlZEVsZW1lbnRJbmRleCA9IHRoaXMucmVnaXN0ZXJlZEVsZW1lbnRzXG4gICAgICAuZmluZEluZGV4KGVsID0+IGVsLnRhcmdldCA9PT0gZWxlbWVudC50YXJnZXQgJiYgZWwuZXZlbnQgPT09IGVsZW1lbnQuZXZlbnQpXG5cbiAgICBpZiAocmVnaXN0ZXJlZEVsZW1lbnRJbmRleCA+IC0xKSB7XG4gICAgICBlbGVtZW50LnRhcmdldC5yZW1vdmVFdmVudExpc3RlbmVyKGVsZW1lbnQuZXZlbnQsIHRoaXMuZWxlbWVudExpc3RlbmVyKVxuICAgICAgdGhpcy5yZWdpc3RlcmVkRWxlbWVudHMuc3BsaWNlKHJlZ2lzdGVyZWRFbGVtZW50SW5kZXgsIDEpXG4gICAgfSBlbHNlIHtcbiAgICAgIGNvbnNvbGUuZXJyb3IoYFdhcm5pbmchIFVua25vd24gcmVnaXN0ZXJlZCBlbGVtZW50OiAke2VsZW1lbnQudGFyZ2V0fSB3aXRoIGV2ZW50OiAke2VsZW1lbnQuZXZlbnR9LmApXG4gICAgfVxuICB9XG5cbiAgdHJpZ2dlckV2ZW50KGV2ZW50TmFtZSwgZGV0YWlsID0ge30sIG9iamVjdEV2ZW50T25seSA9IGZhbHNlKSB7XG4gICAgaWYgKHR5cGVvZiBldmVudE5hbWUgIT09ICdzdHJpbmcnKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ1RoZSBldmVudCBuYW1lIGlzIG5vdCB2YWxpZC4nKVxuICAgIH1cblxuICAgIGlmICh0aGlzLmFkZFRvU3RhY2spIHtcbiAgICAgIGlmIChldmVudE5hbWUgPT09IEV2ZW50LlNIT1cpIHtcbiAgICAgICAgQ29tcG9uZW50TWFuYWdlci5hZGQodGhpcylcbiAgICAgIH0gZWxzZSBpZiAoZXZlbnROYW1lID09PSBFdmVudC5ISURFKSB7XG4gICAgICAgIENvbXBvbmVudE1hbmFnZXIucmVtb3ZlKHRoaXMpXG4gICAgICB9XG4gICAgfVxuXG4gICAgLy8gZXZlbnQgbmFtZXMgY2FuIGJlIHdpdGggZG90IG5vdGF0aW9uIGxpa2UgcmVjb25uZWN0aW5nLnN1Y2Nlc3NcbiAgICBjb25zdCBldmVudE5hbWVPYmplY3QgPSBldmVudE5hbWUuc3BsaXQoJy4nKS5yZWR1Y2UoKGFjYywgY3VycmVudCwgaW5kZXgpID0+IHtcbiAgICAgIGlmIChpbmRleCA9PT0gMCkge1xuICAgICAgICByZXR1cm4gY3VycmVudFxuICAgICAgfVxuXG4gICAgICByZXR1cm4gYWNjICsgY3VycmVudC5jaGFyQXQoMCkudG9VcHBlckNhc2UoKSArIGN1cnJlbnQuc2xpY2UoMSlcbiAgICB9KVxuXG4gICAgY29uc3QgZXZlbnROYW1lQWxpYXMgPSBgb24ke2V2ZW50TmFtZU9iamVjdC5jaGFyQXQoMCkudG9VcHBlckNhc2UoKX0ke2V2ZW50TmFtZU9iamVjdC5zbGljZSgxKX1gXG5cbiAgICAvLyBvYmplY3QgZXZlbnRcbiAgICBpZiAodHlwZW9mIHRoaXMub3B0aW9uc1tldmVudE5hbWVPYmplY3RdID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICB0aGlzLm9wdGlvbnNbZXZlbnROYW1lT2JqZWN0XS5hcHBseSh0aGlzLCBbZGV0YWlsXSlcbiAgICB9XG5cbiAgICBpZiAodHlwZW9mIHRoaXMub3B0aW9uc1tldmVudE5hbWVBbGlhc10gPT09ICdmdW5jdGlvbicpIHtcbiAgICAgIHRoaXMub3B0aW9uc1tldmVudE5hbWVBbGlhc10uYXBwbHkodGhpcywgW2RldGFpbF0pXG4gICAgfVxuXG4gICAgaWYgKG9iamVjdEV2ZW50T25seSkge1xuICAgICAgcmV0dXJuXG4gICAgfVxuXG4gICAgLy8gZG9tIGV2ZW50XG4gICAgaWYgKHRoaXMub3B0aW9ucy5lbGVtZW50KSB7XG4gICAgICBkaXNwYXRjaEVsZW1lbnRFdmVudCh0aGlzLm9wdGlvbnMuZWxlbWVudCwgZXZlbnROYW1lLCB0aGlzLm5hbWUsIGRldGFpbClcbiAgICB9IGVsc2Uge1xuICAgICAgZGlzcGF0Y2hXaW5Eb2NFdmVudChldmVudE5hbWUsIHRoaXMubmFtZSwgZGV0YWlsKVxuICAgIH1cbiAgfVxuXG4gIHNldEF0dHJpYnV0ZXMoKSB7XG4gICAgaWYgKHRoaXMub3B0aW9uQXR0cnMubGVuZ3RoID4gMCkge1xuICAgICAgc2V0QXR0cmlidXRlc0NvbmZpZyh0aGlzLm9wdGlvbnMuZWxlbWVudCwgdGhpcy5vcHRpb25zLCB0aGlzLm9wdGlvbkF0dHJzKVxuICAgIH1cbiAgfVxuXG4gIGdldEF0dHJpYnV0ZXMoKSB7XG4gICAgY29uc3Qgb3B0aW9ucyA9IE9iamVjdC5hc3NpZ24oe30sIHRoaXMub3B0aW9ucylcbiAgICByZXR1cm4gZ2V0QXR0cmlidXRlc0NvbmZpZyh0aGlzLm9wdGlvbnMuZWxlbWVudCwgb3B0aW9ucywgdGhpcy5vcHRpb25BdHRycylcbiAgfVxuXG4gIC8qKlxuICAgKiB0aGUgcHJldmVudENsb3NhYmxlIG1ldGhvZCBtYW5hZ2VzIGNvbmN1cnJlbmN5IGJldHdlZW4gYWN0aXZlIGNvbXBvbmVudHMuXG4gICAqIEZvciBleGFtcGxlLCBpZiB0aGVyZSBpcyBhIHNob3duIG9mZi1jYW52YXMgYW5kIGRpYWxvZywgdGhlIGxhc3RcbiAgICogc2hvd24gY29tcG9uZW50IGdhaW5zIHRoZSBwcm9jZXNzaW5nIHByaW9yaXR5XG4gICAqL1xuICBwcmV2ZW50Q2xvc2FibGUoKSB7XG4gICAgcmV0dXJuIHRoaXMuYWRkVG9TdGFjayAmJiAhQ29tcG9uZW50TWFuYWdlci5jbG9zYWJsZSh0aGlzKVxuICB9XG5cbiAgb25CZWZvcmVFbGVtZW50RXZlbnQoZXZlbnQpIHtcbiAgICBpZiAodGhpcy5wcmV2ZW50Q2xvc2FibGUoKSkge1xuICAgICAgcmV0dXJuXG4gICAgfVxuXG4gICAgdGhpcy5vbkVsZW1lbnRFdmVudChldmVudClcbiAgfVxuXG4gIG9uRWxlbWVudEV2ZW50KGV2ZW50KSB7XG4gICAgLy9cbiAgfVxuXG4gIHN0YXRpYyBpZGVudGlmaWVyKCkge1xuICAgIHJldHVybiB0aGlzLm5hbWVcbiAgfVxuXG4gIHN0YXRpYyBfRE9NSW50ZXJmYWNlKENvbXBvbmVudENsYXNzLCBvcHRpb25zKSB7XG4gICAgcmV0dXJuIG5ldyBDb21wb25lbnRDbGFzcyhvcHRpb25zKVxuICB9XG59XG4iLCJcbmNvbnN0IGdldEF0dHJpYnV0ZSA9IChmaXJzdCwgc2Vjb25kKSA9PiB7XG4gIGlmIChmaXJzdCA9PT0gJycpIHtcbiAgICByZXR1cm4gYGRhdGEtJHtzZWNvbmR9YFxuICB9XG4gIHJldHVybiBgZGF0YS0ke2ZpcnN0fS0ke3NlY29uZH1gXG59XG5cbmV4cG9ydCBmdW5jdGlvbiBzZXRBdHRyaWJ1dGVzQ29uZmlnKGVsZW1lbnQsIG9iaiA9IHt9LCBhdHRycywgc3RhcnQgPSAnJykge1xuICBjb25zdCBrZXlzID0gT2JqZWN0LmtleXMob2JqKVxuXG4gIGtleXMuZm9yRWFjaCgoa2V5KSA9PiB7XG4gICAgaWYgKHN0YXJ0ID09PSAnJyAmJiBhdHRycy5pbmRleE9mKGtleSkgPT09IC0xKSB7XG4gICAgICAvLyBjb250aW51ZSB3aXRoIG5leHQgaXRlcmF0aW9uXG4gICAgICByZXR1cm5cbiAgICB9XG5cbiAgICBpZiAodHlwZW9mIG9ialtrZXldID09PSAnb2JqZWN0JyAmJiBvYmpba2V5XSAhPT0gbnVsbCkge1xuICAgICAgbGV0IGtleVN0YXJ0ID0ga2V5XG4gICAgICBpZiAoc3RhcnQgIT09ICcnKSB7XG4gICAgICAgIGtleVN0YXJ0ID0gYCR7c3RhcnR9LSR7a2V5fWBcbiAgICAgIH1cblxuICAgICAgc2V0QXR0cmlidXRlc0NvbmZpZyhlbGVtZW50LCBvYmpba2V5XSwgYXR0cnMsIGtleVN0YXJ0KVxuICAgICAgcmV0dXJuXG4gICAgfVxuXG4gICAgY29uc3QgYXR0ciA9IGdldEF0dHJpYnV0ZShzdGFydCwga2V5KVxuICAgIGVsZW1lbnQuc2V0QXR0cmlidXRlKGF0dHIsIG9ialtrZXldKVxuICB9KVxufVxuXG5leHBvcnQgZnVuY3Rpb24gZ2V0QXR0cmlidXRlc0NvbmZpZyhlbGVtZW50LCBvYmogPSB7fSwgYXR0cnMsIHN0YXJ0ID0gJycpIHtcbiAgY29uc3QgbmV3T2JqID0gT2JqZWN0LmFzc2lnbih7fSwgb2JqKVxuICBjb25zdCBrZXlzID0gT2JqZWN0LmtleXMob2JqKVxuXG4gIGtleXMuZm9yRWFjaCgoa2V5KSA9PiB7XG4gICAgaWYgKHN0YXJ0ID09PSAnJyAmJiBhdHRycy5pbmRleE9mKGtleSkgPT09IC0xKSB7XG4gICAgICAvLyBjb250aW51ZSB3aXRoIG5leHQgaXRlcmF0aW9uXG4gICAgICByZXR1cm5cbiAgICB9XG5cbiAgICBpZiAob2JqW2tleV0gIT09IG51bGwgJiYgb2JqW2tleV0uY29uc3RydWN0b3IgPT09IE9iamVjdCkge1xuICAgICAgbGV0IGtleVN0YXJ0ID0ga2V5XG4gICAgICBpZiAoc3RhcnQgIT09ICcnKSB7XG4gICAgICAgIGtleVN0YXJ0ID0gYCR7c3RhcnR9LSR7a2V5fWBcbiAgICAgIH1cblxuICAgICAgbmV3T2JqW2tleV0gPSBnZXRBdHRyaWJ1dGVzQ29uZmlnKGVsZW1lbnQsIG9ialtrZXldLCBhdHRycywga2V5U3RhcnQpXG4gICAgICByZXR1cm5cbiAgICB9XG5cbiAgICAvLyB1cGRhdGUgdmFsdWVcbiAgICBsZXQgdmFsdWUgPSBvYmpba2V5XSAvLyBkZWZhdWx0IHZhbHVlXG4gICAgY29uc3QgdHlwZSA9IHR5cGVvZiB2YWx1ZVxuICAgIGNvbnN0IGF0dHIgPSBnZXRBdHRyaWJ1dGUoc3RhcnQsIGtleSlcbiAgICBjb25zdCBhdHRyVmFsdWUgPSBlbGVtZW50LmdldEF0dHJpYnV0ZShhdHRyKVxuXG4gICAgaWYgKGF0dHJWYWx1ZSAhPT0gbnVsbCkge1xuICAgICAgaWYgKHR5cGUgPT09ICdib29sZWFuJykge1xuICAgICAgICAvLyBjb252ZXJ0IHN0cmluZyB0byBib29sZWFuXG4gICAgICAgIHZhbHVlID0gYXR0clZhbHVlID09PSAndHJ1ZSdcbiAgICAgIH0gZWxzZSBpZiAoIWlzTmFOKGF0dHJWYWx1ZSkpIHtcbiAgICAgICAgdmFsdWUgPSBwYXJzZUludChhdHRyVmFsdWUsIDEwKVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdmFsdWUgPSBhdHRyVmFsdWVcbiAgICAgIH1cbiAgICB9XG5cbiAgICBuZXdPYmpba2V5XSA9IHZhbHVlXG4gIH0pXG5cbiAgcmV0dXJuIG5ld09ialxufVxuXG5jb25zdCBzdGFjayA9IFtdXG5cbmV4cG9ydCBkZWZhdWx0IHtcbiAgYWRkKGNvbXBvbmVudCkge1xuICAgIHN0YWNrLnB1c2goY29tcG9uZW50KVxuICB9LFxuICByZW1vdmUoY29tcG9uZW50KSB7XG4gICAgY29uc3QgaW5kZXggPSBzdGFjay5maW5kSW5kZXgoYyA9PiBPYmplY3QuaXMoY29tcG9uZW50LCBjKSlcbiAgICBpZiAoaW5kZXggPiAtMSkge1xuICAgICAgc3RhY2suc3BsaWNlKGluZGV4LCAxKVxuICAgIH1cbiAgfSxcbiAgY2xvc2FibGUoY29tcG9uZW50KSB7XG4gICAgcmV0dXJuIHN0YWNrLmxlbmd0aCA9PT0gMCB8fCBPYmplY3QuaXMoc3RhY2tbc3RhY2subGVuZ3RoIC0gMV0sIGNvbXBvbmVudClcbiAgfVxufVxuIiwiLyoqXG4gKiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICogTGljZW5zZWQgdW5kZXIgTUlUIChodHRwczovL2dpdGh1Yi5jb20vcXVhcmstZGV2L1Bob25vbi1GcmFtZXdvcmsvYmxvYi9tYXN0ZXIvTElDRU5TRSlcbiAqIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gKi9cbmltcG9ydCBFdmVudCBmcm9tICcuLi8uLi9jb21tb24vZXZlbnRzJ1xuaW1wb3J0IENvbXBvbmVudCBmcm9tICcuLi9jb21wb25lbnQnXG5pbXBvcnQgeyBnZXRBdHRyaWJ1dGVzQ29uZmlnIH0gZnJvbSAnLi4vY29tcG9uZW50TWFuYWdlcidcblxuY29uc3QgRGlhbG9nID0gKCgpID0+IHtcbiAgLyoqXG4gICAqIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgKiBDb25zdGFudHNcbiAgICogLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAqL1xuXG4gIGNvbnN0IE5BTUUgPSAnZGlhbG9nJ1xuICBjb25zdCBWRVJTSU9OID0gJzIuMC4wJ1xuICBjb25zdCBCQUNLRFJPUF9TRUxFQ1RPUiA9ICdkaWFsb2ctYmFja2Ryb3AnXG4gIGNvbnN0IERFRkFVTFRfUFJPUEVSVElFUyA9IHtcbiAgICBlbGVtZW50OiBudWxsLFxuICAgIHRpdGxlOiBudWxsLFxuICAgIG1lc3NhZ2U6IG51bGwsXG4gICAgY2FuY2VsYWJsZTogdHJ1ZSxcbiAgfVxuICBjb25zdCBEQVRBX0FUVFJTX1BST1BFUlRJRVMgPSBbXG4gICAgJ2NhbmNlbGFibGUnLFxuICBdXG5cbiAgLyoqXG4gICAqIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgKiBDbGFzcyBEZWZpbml0aW9uXG4gICAqIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgKi9cblxuICBjbGFzcyBEaWFsb2cgZXh0ZW5kcyBDb21wb25lbnQge1xuXG4gICAgY29uc3RydWN0b3Iob3B0aW9ucyA9IHt9LCB0ZW1wbGF0ZSA9IG51bGwpIHtcbiAgICAgIHN1cGVyKE5BTUUsIFZFUlNJT04sIERFRkFVTFRfUFJPUEVSVElFUywgb3B0aW9ucywgREFUQV9BVFRSU19QUk9QRVJUSUVTLCB0cnVlLCB0cnVlKVxuXG4gICAgICB0aGlzLnRlbXBsYXRlID0gdGVtcGxhdGUgfHwgJycgK1xuICAgICAgJzxkaXYgY2xhc3M9XCJkaWFsb2dcIiB0YWJpbmRleD1cIi0xXCIgcm9sZT1cImRpYWxvZ1wiPicgK1xuICAgICAgICAnPGRpdiBjbGFzcz1cImRpYWxvZy1pbm5lclwiIHJvbGU9XCJkb2N1bWVudFwiPicgK1xuICAgICAgICAgICc8ZGl2IGNsYXNzPVwiZGlhbG9nLWNvbnRlbnRcIj4nICtcbiAgICAgICAgICAgICc8ZGl2IGNsYXNzPVwiZGlhbG9nLWhlYWRlclwiPicgK1xuICAgICAgICAgICAgICAnPGg1IGNsYXNzPVwiZGlhbG9nLXRpdGxlXCI+PC9oNT4nICtcbiAgICAgICAgICAgICc8L2Rpdj4nICtcbiAgICAgICAgICAgICc8ZGl2IGNsYXNzPVwiZGlhbG9nLWJvZHlcIj4nICtcbiAgICAgICAgICAgICAgJzxwPjwvcD4nICtcbiAgICAgICAgICAgICc8L2Rpdj4nICtcbiAgICAgICAgICAgICc8ZGl2IGNsYXNzPVwiZGlhbG9nLWZvb3RlclwiPicgK1xuICAgICAgICAgICAgICAnPGJ1dHRvbiB0eXBlPVwiYnV0dG9uXCIgY2xhc3M9XCJidG4gYnRuLXByaW1hcnlcIiBkYXRhLWRpc21pc3M9XCJkaWFsb2dcIj5PazwvYnV0dG9uPicgK1xuICAgICAgICAgICAgJzwvZGl2PicgK1xuICAgICAgICAgICc8L2Rpdj4nICtcbiAgICAgICAgJzwvZGl2PicgK1xuICAgICAgJzwvZGl2PidcblxuICAgICAgaWYgKHRoaXMuZHluYW1pY0VsZW1lbnQpIHtcbiAgICAgICAgdGhpcy5idWlsZCgpXG4gICAgICB9XG4gICAgfVxuXG4gICAgYnVpbGQoKSB7XG4gICAgICBjb25zdCBidWlsZGVyID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2JylcblxuICAgICAgYnVpbGRlci5pbm5lckhUTUwgPSB0aGlzLnRlbXBsYXRlXG5cbiAgICAgIHRoaXMub3B0aW9ucy5lbGVtZW50ID0gYnVpbGRlci5maXJzdENoaWxkXG5cbiAgICAgIC8vIHRpdGxlXG4gICAgICBpZiAodGhpcy5vcHRpb25zLnRpdGxlICE9PSBudWxsKSB7XG4gICAgICAgIHRoaXMub3B0aW9ucy5lbGVtZW50LnF1ZXJ5U2VsZWN0b3IoJy5kaWFsb2ctdGl0bGUnKS5pbm5lckhUTUwgPSB0aGlzLm9wdGlvbnMudGl0bGVcbiAgICAgIH1cblxuICAgICAgLy8gbWVzc2FnZVxuICAgICAgaWYgKHRoaXMub3B0aW9ucy5tZXNzYWdlICE9PSBudWxsKSB7XG4gICAgICAgIHRoaXMub3B0aW9ucy5lbGVtZW50LnF1ZXJ5U2VsZWN0b3IoJy5kaWFsb2ctYm9keScpLmZpcnN0Q2hpbGQuaW5uZXJIVE1MID0gdGhpcy5vcHRpb25zLm1lc3NhZ2VcbiAgICAgIH1cblxuICAgICAgZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZCh0aGlzLm9wdGlvbnMuZWxlbWVudClcblxuICAgICAgdGhpcy5zZXRBdHRyaWJ1dGVzKClcbiAgICB9XG5cbiAgICBidWlsZEJhY2tkcm9wKCkge1xuICAgICAgY29uc3QgYmFja2Ryb3AgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKVxuICAgICAgYmFja2Ryb3Auc2V0QXR0cmlidXRlKCdkYXRhLWlkJywgdGhpcy5pZClcbiAgICAgIGJhY2tkcm9wLmNsYXNzTGlzdC5hZGQoQkFDS0RST1BfU0VMRUNUT1IpXG5cbiAgICAgIGRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQoYmFja2Ryb3ApXG4gICAgfVxuXG4gICAgZ2V0QmFja2Ryb3AoKSB7XG4gICAgICByZXR1cm4gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihgLiR7QkFDS0RST1BfU0VMRUNUT1J9W2RhdGEtaWQ9XCIke3RoaXMuaWR9XCJdYClcbiAgICB9XG5cbiAgICBjZW50ZXIoKSB7XG4gICAgICBjb25zdCBjb21wdXRlZFN0eWxlID0gd2luZG93LmdldENvbXB1dGVkU3R5bGUodGhpcy5vcHRpb25zLmVsZW1lbnQpXG4gICAgICAvLyBjb25zdCB3aWR0aCA9IGNvbXB1dGVkU3R5bGUud2lkdGguc2xpY2UoMCwgY29tcHV0ZWRTdHlsZS53aWR0aC5sZW5ndGggLSAyKVxuICAgICAgY29uc3QgaGVpZ2h0ID0gY29tcHV0ZWRTdHlsZS5oZWlnaHQuc2xpY2UoMCwgY29tcHV0ZWRTdHlsZS5oZWlnaHQubGVuZ3RoIC0gMilcblxuICAgICAgY29uc3QgdG9wID0gKHdpbmRvdy5pbm5lckhlaWdodCAvIDIpIC0gKGhlaWdodCAvIDIpXG4gICAgICB0aGlzLm9wdGlvbnMuZWxlbWVudC5zdHlsZS50b3AgPSBgJHt0b3B9cHhgXG4gICAgfVxuXG4gICAgc2hvdygpIHtcbiAgICAgIGlmICh0aGlzLm9wdGlvbnMuZWxlbWVudCA9PT0gbnVsbCkge1xuICAgICAgICAvLyBidWlsZCBhbmQgaW5zZXJ0IGEgbmV3IERPTSBlbGVtZW50XG4gICAgICAgIHRoaXMuYnVpbGQoKVxuICAgICAgfVxuXG4gICAgICBpZiAodGhpcy5vcHRpb25zLmVsZW1lbnQuY2xhc3NMaXN0LmNvbnRhaW5zKCdzaG93JykpIHtcbiAgICAgICAgcmV0dXJuIGZhbHNlXG4gICAgICB9XG5cbiAgICAgIC8vIGFkZCBhIHRpbWVvdXQgc28gdGhhdCB0aGUgQ1NTIGFuaW1hdGlvbiB3b3Jrc1xuICAgICAgc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICAgIHRoaXMudHJpZ2dlckV2ZW50KEV2ZW50LlNIT1cpXG4gICAgICAgIHRoaXMuYnVpbGRCYWNrZHJvcCgpXG5cbiAgICAgICAgY29uc3Qgb25TaG93biA9ICgpID0+IHtcbiAgICAgICAgICB0aGlzLnRyaWdnZXJFdmVudChFdmVudC5TSE9XTilcbiAgICAgICAgICB0aGlzLm9wdGlvbnMuZWxlbWVudC5yZW1vdmVFdmVudExpc3RlbmVyKEV2ZW50LlRSQU5TSVRJT05fRU5ELCBvblNob3duKVxuXG4gICAgICAgICAgLy8gYXR0YWNoIGV2ZW50XG4gICAgICAgICAgdGhpcy5hdHRhY2hFdmVudHMoKVxuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5vcHRpb25zLmVsZW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihFdmVudC5UUkFOU0lUSU9OX0VORCwgb25TaG93bilcblxuICAgICAgICB0aGlzLm9wdGlvbnMuZWxlbWVudC5jbGFzc0xpc3QuYWRkKCdzaG93JylcblxuICAgICAgICB0aGlzLmNlbnRlcigpXG4gICAgICB9LCAxMClcblxuICAgICAgcmV0dXJuIHRydWVcbiAgICB9XG5cbiAgICBvbkVsZW1lbnRFdmVudChldmVudCkge1xuICAgICAgaWYgKGV2ZW50LnR5cGUgPT09ICdrZXl1cCcgJiYgZXZlbnQua2V5Q29kZSAhPT0gMjcgJiYgZXZlbnQua2V5Q29kZSAhPT0gMTMpIHtcbiAgICAgICAgcmV0dXJuXG4gICAgICB9XG5cbiAgICAgIC8vIGhpZGUgdGhlIGRpYWxvZ1xuICAgICAgdGhpcy5oaWRlKClcbiAgICB9XG5cbiAgICBoaWRlKCkge1xuICAgICAgaWYgKCF0aGlzLm9wdGlvbnMuZWxlbWVudC5jbGFzc0xpc3QuY29udGFpbnMoJ3Nob3cnKSkge1xuICAgICAgICByZXR1cm4gZmFsc2VcbiAgICAgIH1cblxuICAgICAgdGhpcy50cmlnZ2VyRXZlbnQoRXZlbnQuSElERSlcblxuICAgICAgdGhpcy5kZXRhY2hFdmVudHMoKVxuXG4gICAgICB0aGlzLm9wdGlvbnMuZWxlbWVudC5jbGFzc0xpc3QuYWRkKCdoaWRlJylcbiAgICAgIHRoaXMub3B0aW9ucy5lbGVtZW50LmNsYXNzTGlzdC5yZW1vdmUoJ3Nob3cnKVxuXG4gICAgICBjb25zdCBiYWNrZHJvcCA9IHRoaXMuZ2V0QmFja2Ryb3AoKVxuXG4gICAgICBjb25zdCBvbkhpZGRlbiA9ICgpID0+IHtcbiAgICAgICAgZG9jdW1lbnQuYm9keS5yZW1vdmVDaGlsZChiYWNrZHJvcClcblxuICAgICAgICB0aGlzLm9wdGlvbnMuZWxlbWVudC5jbGFzc0xpc3QucmVtb3ZlKCdoaWRlJylcblxuICAgICAgICB0aGlzLnRyaWdnZXJFdmVudChFdmVudC5ISURERU4pXG5cbiAgICAgICAgYmFja2Ryb3AucmVtb3ZlRXZlbnRMaXN0ZW5lcihFdmVudC5UUkFOU0lUSU9OX0VORCwgb25IaWRkZW4pXG5cbiAgICAgICAgLy8gcmVtb3ZlIGdlbmVyYXRlZCBkaWFsb2dzIGZyb20gdGhlIERPTVxuICAgICAgICBpZiAodGhpcy5keW5hbWljRWxlbWVudCkge1xuICAgICAgICAgIGRvY3VtZW50LmJvZHkucmVtb3ZlQ2hpbGQodGhpcy5vcHRpb25zLmVsZW1lbnQpXG4gICAgICAgICAgdGhpcy5vcHRpb25zLmVsZW1lbnQgPSBudWxsXG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgYmFja2Ryb3AuYWRkRXZlbnRMaXN0ZW5lcihFdmVudC5UUkFOU0lUSU9OX0VORCwgb25IaWRkZW4pXG4gICAgICBiYWNrZHJvcC5jbGFzc0xpc3QuYWRkKCdmYWRlb3V0JylcblxuICAgICAgcmV0dXJuIHRydWVcbiAgICB9XG5cbiAgICBhdHRhY2hFdmVudHMoKSB7XG4gICAgICBjb25zdCBkaXNtaXNzQnV0dG9ucyA9IHRoaXMub3B0aW9ucy5lbGVtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJ1tkYXRhLWRpc21pc3NdJylcbiAgICAgIGlmIChkaXNtaXNzQnV0dG9ucykge1xuICAgICAgICBBcnJheS5mcm9tKGRpc21pc3NCdXR0b25zKS5mb3JFYWNoKGJ1dHRvbiA9PiB0aGlzLnJlZ2lzdGVyRWxlbWVudCh7IHRhcmdldDogYnV0dG9uLCBldmVudDogJ2NsaWNrJyB9KSlcbiAgICAgIH1cblxuICAgICAgLy8gYWRkIGV2ZW50cyBpZiB0aGUgZGlhbG9nIGlzIGNhbmNlbGFibGVcbiAgICAgIC8vIHdoaWNoIG1lYW5zIHRoZSB1c2VyIGNhbiBoaWRlIHRoZSBkaWFsb2dcbiAgICAgIC8vIGJ5IHByZXNzaW5nIHRoZSBFU0Mga2V5IG9yIGNsaWNrIG91dHNpZGUgdGhlIGJhY2tkcm9wXG4gICAgICBpZiAodGhpcy5vcHRpb25zLmNhbmNlbGFibGUpIHtcbiAgICAgICAgY29uc3QgYmFja2Ryb3AgPSB0aGlzLmdldEJhY2tkcm9wKClcbiAgICAgICAgdGhpcy5yZWdpc3RlckVsZW1lbnQoeyB0YXJnZXQ6IGJhY2tkcm9wLCBldmVudDogRXZlbnQuU1RBUlQgfSlcbiAgICAgICAgdGhpcy5yZWdpc3RlckVsZW1lbnQoeyB0YXJnZXQ6IGRvY3VtZW50LCBldmVudDogJ2tleXVwJyB9KVxuICAgICAgfVxuICAgIH1cblxuICAgIGRldGFjaEV2ZW50cygpIHtcbiAgICAgIGNvbnN0IGRpc21pc3NCdXR0b25zID0gdGhpcy5vcHRpb25zLmVsZW1lbnQucXVlcnlTZWxlY3RvckFsbCgnW2RhdGEtZGlzbWlzc10nKVxuICAgICAgaWYgKGRpc21pc3NCdXR0b25zKSB7XG4gICAgICAgIEFycmF5LmZyb20oZGlzbWlzc0J1dHRvbnMpLmZvckVhY2goYnV0dG9uID0+IHRoaXMudW5yZWdpc3RlckVsZW1lbnQoeyB0YXJnZXQ6IGJ1dHRvbiwgZXZlbnQ6ICdjbGljaycgfSkpXG4gICAgICB9XG5cbiAgICAgIGlmICh0aGlzLm9wdGlvbnMuY2FuY2VsYWJsZSkge1xuICAgICAgICBjb25zdCBiYWNrZHJvcCA9IHRoaXMuZ2V0QmFja2Ryb3AoKVxuICAgICAgICB0aGlzLnVucmVnaXN0ZXJFbGVtZW50KHsgdGFyZ2V0OiBiYWNrZHJvcCwgZXZlbnQ6IEV2ZW50LlNUQVJUIH0pXG4gICAgICAgIHRoaXMudW5yZWdpc3RlckVsZW1lbnQoeyB0YXJnZXQ6IGRvY3VtZW50LCBldmVudDogJ2tleXVwJyB9KVxuICAgICAgfVxuICAgIH1cblxuICAgIHN0YXRpYyBpZGVudGlmaWVyKCkge1xuICAgICAgcmV0dXJuIE5BTUVcbiAgICB9XG5cbiAgICBzdGF0aWMgX0RPTUludGVyZmFjZShvcHRpb25zKSB7XG4gICAgICByZXR1cm4gc3VwZXIuX0RPTUludGVyZmFjZShEaWFsb2csIG9wdGlvbnMpXG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgKiBET00gQXBpIGltcGxlbWVudGF0aW9uXG4gICAqIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgKi9cbiAgY29uc3QgY29tcG9uZW50cyA9IFtdXG5cbiAgY29uc3QgZGlhbG9ncyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoYC4ke05BTUV9YClcbiAgaWYgKGRpYWxvZ3MpIHtcbiAgICBBcnJheS5mcm9tKGRpYWxvZ3MpLmZvckVhY2goKGVsZW1lbnQpID0+IHtcbiAgICAgIGNvbnN0IGNvbmZpZyA9IGdldEF0dHJpYnV0ZXNDb25maWcoZWxlbWVudCwgREVGQVVMVF9QUk9QRVJUSUVTLCBEQVRBX0FUVFJTX1BST1BFUlRJRVMpXG4gICAgICBjb25maWcuZWxlbWVudCA9IGVsZW1lbnRcblxuICAgICAgY29tcG9uZW50cy5wdXNoKHsgZWxlbWVudCwgZGlhbG9nOiBuZXcgRGlhbG9nKGNvbmZpZykgfSlcbiAgICB9KVxuICB9XG5cbiAgaWYgKGRpYWxvZ3MpIHtcbiAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIChldmVudCkgPT4ge1xuICAgICAgY29uc3QgZGF0YVRvZ2dsZUF0dHIgPSBldmVudC50YXJnZXQuZ2V0QXR0cmlidXRlKCdkYXRhLXRvZ2dsZScpXG4gICAgICBpZiAoZGF0YVRvZ2dsZUF0dHIgJiYgZGF0YVRvZ2dsZUF0dHIgPT09IE5BTUUpIHtcbiAgICAgICAgY29uc3QgaWQgPSBldmVudC50YXJnZXQuZ2V0QXR0cmlidXRlKCdkYXRhLXRhcmdldCcpXG4gICAgICAgIGNvbnN0IGVsZW1lbnQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKGlkKVxuXG4gICAgICAgIGNvbnN0IGNvbXBvbmVudCA9IGNvbXBvbmVudHMuZmluZChjID0+IGMuZWxlbWVudCA9PT0gZWxlbWVudClcblxuICAgICAgICBpZiAoIWNvbXBvbmVudCkge1xuICAgICAgICAgIHJldHVyblxuICAgICAgICB9XG5cbiAgICAgICAgLy8gcmVtb3ZlIHRoZSBmb2N1cyBzdGF0ZSBvZiB0aGUgdHJpZ2dlclxuICAgICAgICBldmVudC50YXJnZXQuYmx1cigpXG5cbiAgICAgICAgY29tcG9uZW50LmRpYWxvZy5zaG93KClcbiAgICAgIH1cbiAgICB9KVxuICB9XG5cbiAgcmV0dXJuIERpYWxvZ1xufSkoKVxuXG5leHBvcnQgZGVmYXVsdCBEaWFsb2dcbiIsIi8qKlxuICogLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAqIExpY2Vuc2VkIHVuZGVyIE1JVCAoaHR0cHM6Ly9naXRodWIuY29tL3F1YXJrLWRldi9QaG9ub24tRnJhbWV3b3JrL2Jsb2IvbWFzdGVyL0xJQ0VOU0UpXG4gKiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICovXG5pbXBvcnQgRGlhbG9nIGZyb20gJy4vaW5kZXgnXG5pbXBvcnQgeyBmaW5kVGFyZ2V0QnlDbGFzcyB9IGZyb20gJy4uLy4uL2NvbW1vbi91dGlscydcbmltcG9ydCB7IGdldEF0dHJpYnV0ZXNDb25maWcgfSBmcm9tICcuLi9jb21wb25lbnRNYW5hZ2VyJ1xuXG5jb25zdCBQcm9tcHQgPSAoKCkgPT4ge1xuXG4gIC8qKlxuICAgKiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICogQ29uc3RhbnRzXG4gICAqIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgKi9cblxuICBjb25zdCBOQU1FID0gJ2RpYWxvZydcbiAgY29uc3QgQkFDS0RST1BfU0VMRUNUT1IgPSAnZGlhbG9nLWJhY2tkcm9wJ1xuICBjb25zdCBERUZBVUxUX1BST1BFUlRJRVMgPSB7XG4gICAgZWxlbWVudDogbnVsbCxcbiAgICB0aXRsZTogbnVsbCxcbiAgICBtZXNzYWdlOiBudWxsLFxuICAgIGNhbmNlbGFibGU6IHRydWUsXG4gIH1cbiAgY29uc3QgREFUQV9BVFRSU19QUk9QRVJUSUVTID0gW1xuICAgICdjYW5jZWxhYmxlJyxcbiAgXVxuXG4gIC8qKlxuICAgKiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICogQ2xhc3MgRGVmaW5pdGlvblxuICAgKiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICovXG5cbiAgY2xhc3MgUHJvbXB0IGV4dGVuZHMgRGlhbG9nIHtcblxuICAgIGNvbnN0cnVjdG9yKG9wdGlvbnMgPSB7fSkge1xuICAgICAgY29uc3QgdGVtcGxhdGUgPSAnJyArXG4gICAgICAnPGRpdiBjbGFzcz1cImRpYWxvZ1wiIHRhYmluZGV4PVwiLTFcIiByb2xlPVwiZGlhbG9nXCI+JyArXG4gICAgICAgICc8ZGl2IGNsYXNzPVwiZGlhbG9nLWlubmVyXCIgcm9sZT1cImRvY3VtZW50XCI+JyArXG4gICAgICAgICAgJzxkaXYgY2xhc3M9XCJkaWFsb2ctY29udGVudFwiPicgK1xuICAgICAgICAgICAgJzxkaXYgY2xhc3M9XCJkaWFsb2ctaGVhZGVyXCI+JyArXG4gICAgICAgICAgICAgICc8aDUgY2xhc3M9XCJkaWFsb2ctdGl0bGVcIj48L2g1PicgK1xuICAgICAgICAgICAgJzwvZGl2PicgK1xuICAgICAgICAgICAgJzxkaXYgY2xhc3M9XCJkaWFsb2ctYm9keVwiPicgK1xuICAgICAgICAgICAgICAnPGlucHV0IGNsYXNzPVwiZm9ybS1jb250cm9sXCIgdHlwZT1cInRleHRcIiB2YWx1ZT1cIlwiPicgK1xuICAgICAgICAgICAgJzwvZGl2PicgK1xuICAgICAgICAgICAgJzxkaXYgY2xhc3M9XCJkaWFsb2ctZm9vdGVyXCI+JyArXG4gICAgICAgICAgICAgICc8YnV0dG9uIHR5cGU9XCJidXR0b25cIiBjbGFzcz1cImJ0biBidG4tcHJpbWFyeVwiIGRhdGEtZGlzbWlzcz1cImRpYWxvZ1wiPk9rPC9idXR0b24+JyArXG4gICAgICAgICAgICAnPC9kaXY+JyArXG4gICAgICAgICAgJzwvZGl2PicgK1xuICAgICAgICAnPC9kaXY+JyArXG4gICAgICAnPC9kaXY+J1xuXG4gICAgICBzdXBlcihvcHRpb25zLCB0ZW1wbGF0ZSlcbiAgICB9XG5cbiAgICBzdGF0aWMgX0RPTUludGVyZmFjZShvcHRpb25zKSB7XG4gICAgICByZXR1cm4gbmV3IFByb21wdChvcHRpb25zKVxuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICogRE9NIEFwaSBpbXBsZW1lbnRhdGlvblxuICAgKiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICovXG4gIGNvbnN0IGNvbXBvbmVudHMgPSBbXVxuICBjb25zdCBkaWFsb2dzID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChgLiR7TkFNRX1gKVxuXG4gIGlmIChkaWFsb2dzKSB7XG4gICAgQXJyYXkuZnJvbShkaWFsb2dzKS5mb3JFYWNoKChlbGVtZW50KSA9PiB7XG4gICAgICBjb25zdCBjb25maWcgPSBnZXRBdHRyaWJ1dGVzQ29uZmlnKGVsZW1lbnQsIERFRkFVTFRfUFJPUEVSVElFUywgREFUQV9BVFRSU19QUk9QRVJUSUVTKVxuICAgICAgY29uZmlnLmVsZW1lbnQgPSBlbGVtZW50XG5cbiAgICAgIGlmIChjb25maWcudHlwZSA9PT0gJ2FsZXJ0Jykge1xuICAgICAgICAvLyBwcm9tcHRcbiAgICAgICAgY29tcG9uZW50cy5wdXNoKG5ldyBQcm9tcHQoY29uZmlnKSlcbiAgICAgIH1cbiAgICB9KVxuICB9XG5cbiAgaWYgKGRpYWxvZ3MpIHtcbiAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIChldmVudCkgPT4ge1xuICAgICAgY29uc3QgZHJvcGRvd25NZW51ID0gZmluZFRhcmdldEJ5Q2xhc3MoZXZlbnQudGFyZ2V0LCAnZHJvcGRvd24tbWVudScpXG4gICAgICBpZiAoZHJvcGRvd25NZW51KSB7XG4gICAgICAgIHJldHVyblxuICAgICAgfVxuXG4gICAgICBjb25zdCBkcm9wZG93biA9IGZpbmRUYXJnZXRCeUNsYXNzKGV2ZW50LnRhcmdldCwgJ2Ryb3Bkb3duJylcblxuICAgICAgaWYgKGRyb3Bkb3duKSB7XG4gICAgICAgIGNvbnN0IGRhdGFUb2dnbGVBdHRyID0gZHJvcGRvd24uZ2V0QXR0cmlidXRlKCdkYXRhLXRvZ2dsZScpXG4gICAgICAgIGlmIChkYXRhVG9nZ2xlQXR0ciAmJiBkYXRhVG9nZ2xlQXR0ciA9PT0gTkFNRSAmJiBkcm9wZG93bikge1xuICAgICAgICAgIGNvbnN0IGNvbXBvbmVudCA9IGNvbXBvbmVudHMuZmluZChjID0+IGMuZ2V0RWxlbWVudCgpID09PSBkcm9wZG93bilcblxuICAgICAgICAgIGlmICghY29tcG9uZW50KSB7XG4gICAgICAgICAgICByZXR1cm5cbiAgICAgICAgICB9XG5cbiAgICAgICAgICBjb21wb25lbnQudG9nZ2xlKClcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0pXG4gIH1cblxuICByZXR1cm4gUHJvbXB0XG59KSgpXG5cbmV4cG9ydCBkZWZhdWx0IFByb21wdFxuIiwiLyoqXG4gKiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICogTGljZW5zZWQgdW5kZXIgTUlUIChodHRwczovL2dpdGh1Yi5jb20vcXVhcmstZGV2L1Bob25vbi1GcmFtZXdvcmsvYmxvYi9tYXN0ZXIvTElDRU5TRSlcbiAqIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gKi9cbmltcG9ydCBDb21wb25lbnQgZnJvbSAnLi4vY29tcG9uZW50J1xuaW1wb3J0IEV2ZW50IGZyb20gJy4uLy4uL2NvbW1vbi9ldmVudHMnXG5pbXBvcnQgeyBmaW5kVGFyZ2V0QnlDbGFzcyB9IGZyb20gJy4uLy4uL2NvbW1vbi91dGlscydcbmltcG9ydCB7IGdldEF0dHJpYnV0ZXNDb25maWcgfSBmcm9tICcuLi9jb21wb25lbnRNYW5hZ2VyJ1xuXG5jb25zdCBEcm9wZG93biA9ICgoKSA9PiB7XG4gIC8qKlxuICAgKiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICogQ29uc3RhbnRzXG4gICAqIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgKi9cblxuICBjb25zdCBOQU1FID0gJ2Ryb3Bkb3duJ1xuICBjb25zdCBWRVJTSU9OID0gJzIuMC4wJ1xuICBjb25zdCBERUZBVUxUX1BST1BFUlRJRVMgPSB7XG4gICAgZWxlbWVudDogbnVsbCxcbiAgICBkZWZhdWx0OiB0cnVlLFxuICAgIHNlYXJjaDogZmFsc2UsXG4gIH1cbiAgY29uc3QgREFUQV9BVFRSU19QUk9QRVJUSUVTID0gW1xuICAgICdkZWZhdWx0JyxcbiAgICAnc2VhcmNoJywgICAgXG4gIF1cblxuICAvKipcbiAgICogLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAqIENsYXNzIERlZmluaXRpb25cbiAgICogLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAqL1xuXG4gIGNsYXNzIERyb3Bkb3duIGV4dGVuZHMgQ29tcG9uZW50IHtcblxuICAgIGNvbnN0cnVjdG9yKG9wdGlvbnMgPSB7fSkge1xuICAgICAgc3VwZXIoTkFNRSwgVkVSU0lPTiwgREVGQVVMVF9QUk9QRVJUSUVTLCBvcHRpb25zLCBEQVRBX0FUVFJTX1BST1BFUlRJRVMsIGZhbHNlLCBmYWxzZSlcblxuICAgICAgY29uc3Qgc2VsZWN0ZWQgPSB0aGlzLm9wdGlvbnMuZWxlbWVudC5xdWVyeVNlbGVjdG9yKCdbZGF0YS1zZWxlY3RlZF0nKVxuICAgICAgY29uc3QgaXRlbSA9IHRoaXMuZ2V0SXRlbURhdGEoc2VsZWN0ZWQpXG5cbiAgICAgIHRoaXMuc2V0U2VsZWN0ZWQoaXRlbS52YWx1ZSwgaXRlbS50ZXh0LCBmYWxzZSlcbiAgICB9XG5cbiAgICBzZXRTZWxlY3RlZCh2YWx1ZSA9ICcnLCB0ZXh0ID0gbnVsbCwgY2hlY2tFeGlzdHMgPSB0cnVlKSB7XG4gICAgICBpZiAoIXRoaXMub3B0aW9ucy5kZWZhdWx0KSB7XG4gICAgICAgIHJldHVybiBmYWxzZVxuICAgICAgfVxuXG4gICAgICBsZXQgdGV4dERpc3BsYXkgPSB0ZXh0XG4gICAgICB0aGlzLm9wdGlvbnMuZWxlbWVudC5xdWVyeVNlbGVjdG9yKCcuZGVmYXVsdC10ZXh0JykuaW5uZXJIVE1MID0gdGV4dFxuICAgICAgdGhpcy5vcHRpb25zLmVsZW1lbnQucXVlcnlTZWxlY3RvcignaW5wdXRbdHlwZT1cImhpZGRlblwiXScpLnZhbHVlID0gdmFsdWVcblxuICAgICAgY29uc3QgaXRlbXMgPSB0aGlzLm9wdGlvbnMuZWxlbWVudC5xdWVyeVNlbGVjdG9yQWxsKCcuaXRlbScpIHx8IFtdXG4gICAgICBsZXQgaXRlbUZvdW5kID0gZmFsc2VcblxuICAgICAgQXJyYXkuZnJvbShpdGVtcykuZm9yRWFjaCgoaXRlbSkgPT4ge1xuICAgICAgICBpZiAoaXRlbS5jbGFzc0xpc3QuY29udGFpbnMoJ3NlbGVjdGVkJykpIHtcbiAgICAgICAgICBpdGVtLmNsYXNzTGlzdC5yZW1vdmUoJ3NlbGVjdGVkJylcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IGRhdGEgPSB0aGlzLmdldEl0ZW1EYXRhKGl0ZW0pXG5cbiAgICAgICAgaWYgKHZhbHVlID09PSBkYXRhLnZhbHVlKSB7XG4gICAgICAgICAgaWYgKCFpdGVtLmNsYXNzTGlzdC5jb250YWlucygnc2VsZWN0ZWQnKSkge1xuICAgICAgICAgICAgaXRlbS5jbGFzc0xpc3QuYWRkKCdzZWxlY3RlZCcpXG4gICAgICAgICAgfVxuXG4gICAgICAgICAgdGV4dERpc3BsYXkgPSBkYXRhLnRleHRcbiAgICAgICAgICBpdGVtRm91bmQgPSB0cnVlXG4gICAgICAgIH1cbiAgICAgIH0pXG5cbiAgICAgIGlmIChjaGVja0V4aXN0cyAmJiBpdGVtRm91bmQpIHtcbiAgICAgICAgdGhpcy5vcHRpb25zLmVsZW1lbnQucXVlcnlTZWxlY3RvcignLmRlZmF1bHQtdGV4dCcpLmlubmVySFRNTCA9IHRleHREaXNwbGF5XG4gICAgICB9IGVsc2UgaWYgKGNoZWNrRXhpc3RzICYmICFpdGVtRm91bmQpIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKGAke05BTUV9LiBUaGUgdmFsdWUgXCIke3ZhbHVlfVwiIGRvZXMgbm90IGV4aXN0IGluIHRoZSBsaXN0IG9mIGl0ZW1zLmApICAgICAgICBcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIHRydWVcbiAgICB9XG5cbiAgICBnZXRTZWxlY3RlZCgpIHtcbiAgICAgIHJldHVybiB0aGlzLm9wdGlvbnMuZWxlbWVudC5xdWVyeVNlbGVjdG9yKCdpbnB1dFt0eXBlPVwiaGlkZGVuXCJdJykudmFsdWVcbiAgICB9XG5cbiAgICBnZXRJdGVtRGF0YShpdGVtID0gbnVsbCkge1xuICAgICAgbGV0IHRleHQgPSAnJ1xuICAgICAgbGV0IHZhbHVlID0gJydcblxuICAgICAgaWYgKGl0ZW0pIHtcbiAgICAgICAgdGV4dCA9IGl0ZW0uZ2V0QXR0cmlidXRlKCdkYXRhLXRleHQnKSB8fCBpdGVtLmlubmVySFRNTFxuXG4gICAgICAgIGNvbnN0IHNlbGVjdGVkVGV4dE5vZGUgPSBpdGVtLnF1ZXJ5U2VsZWN0b3IoJy50ZXh0JylcbiAgICAgICAgaWYgKHNlbGVjdGVkVGV4dE5vZGUpIHtcbiAgICAgICAgICB0ZXh0ID0gc2VsZWN0ZWRUZXh0Tm9kZS5pbm5lckhUTUxcbiAgICAgICAgfVxuXG4gICAgICAgIHZhbHVlID0gaXRlbS5nZXRBdHRyaWJ1dGUoJ2RhdGEtdmFsdWUnKSB8fCAnJ1xuICAgICAgfVxuXG4gICAgICByZXR1cm4geyB0ZXh0LCB2YWx1ZSB9XG4gICAgfVxuXG4gICAgb25FbGVtZW50RXZlbnQoZXZlbnQpIHtcbiAgICAgIGlmIChldmVudC50eXBlID09PSBFdmVudC5TVEFSVCkge1xuICAgICAgICBjb25zdCBkcm9wZG93biA9IGZpbmRUYXJnZXRCeUNsYXNzKGV2ZW50LnRhcmdldCwgJ2Ryb3Bkb3duJylcblxuICAgICAgICAvKlxuICAgICAgICAgKiBoaWRlIHRoZSBjdXJyZW50IGRyb3Bkb3duIG9ubHkgaWYgdGhlIGV2ZW50IGNvbmNlcm5zIGFub3RoZXIgZHJvcGRvd25cbiAgICAgICAgICogaGlkZSBhbHNvIGlmIHRoZSB1c2VyIGNsaWNrcyBvdXRzaWRlIGEgZHJvcGRvd25cbiAgICAgICAgICovXG4gICAgICAgIGlmICghZHJvcGRvd24gfHwgZHJvcGRvd24gIT09IHRoaXMuZ2V0RWxlbWVudCgpKSB7XG4gICAgICAgICAgdGhpcy5oaWRlKClcbiAgICAgICAgfVxuXG4gICAgICB9IGVsc2UgaWYgKGV2ZW50LnR5cGUgPT09ICdjbGljaycpIHtcbiAgICAgICAgY29uc3QgaXRlbSA9IGZpbmRUYXJnZXRCeUNsYXNzKGV2ZW50LnRhcmdldCwgJ2l0ZW0nKVxuXG4gICAgICAgIGlmIChpdGVtKSB7XG4gICAgICAgICAgaWYgKGl0ZW0uY2xhc3NMaXN0LmNvbnRhaW5zKCdkaXNhYmxlZCcpKSB7XG4gICAgICAgICAgICByZXR1cm5cbiAgICAgICAgICB9XG5cbiAgICAgICAgICBjb25zdCBpdGVtSW5mbyA9IHRoaXMuZ2V0SXRlbURhdGEoaXRlbSlcblxuICAgICAgICAgIGlmICh0aGlzLmdldFNlbGVjdGVkKCkgIT09IGl0ZW1JbmZvLnZhbHVlKSB7XG4gICAgICAgICAgICAvLyB0aGUgdXNlciBzZWxlY3RlZCBhbm90aGVyIHZhbHVlLCB3ZSBkaXNwYXRjaCB0aGUgZXZlbnRcbiAgICAgICAgICAgIHRoaXMuc2V0U2VsZWN0ZWQoaXRlbUluZm8udmFsdWUsIGl0ZW1JbmZvLnRleHQsIGZhbHNlKVxuICAgICAgICAgICAgY29uc3QgZGV0YWlsID0geyBpdGVtLCB0ZXh0OiBpdGVtSW5mby50ZXh0LCB2YWx1ZTogaXRlbUluZm8udmFsdWUgfVxuICAgICAgICAgICAgdGhpcy50cmlnZ2VyRXZlbnQoRXZlbnQuSVRFTV9TRUxFQ1RFRCwgZGV0YWlsKVxuICAgICAgICAgIH1cblxuICAgICAgICAgIHRoaXMuaGlkZSgpXG4gICAgICAgICAgcmV0dXJuXG4gICAgICAgIH1cblxuICAgICAgICAvLyBkb24ndCB0b2dnbGUgdGhlIGRyb3Bkb3duIGlmIHRoZSBldmVudCBjb25jZXJucyBoZWFkZXJzLCBkaXZpZGVyc1xuICAgICAgICBjb25zdCBkcm9wZG93bk1lbnUgPSBmaW5kVGFyZ2V0QnlDbGFzcyhldmVudC50YXJnZXQsICdkcm9wZG93bi1tZW51JylcbiAgICAgICAgaWYgKGRyb3Bkb3duTWVudSkge1xuICAgICAgICAgIHJldHVyblxuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy50b2dnbGUoKVxuICAgICAgfVxuICAgIH1cblxuICAgIHRvZ2dsZSgpIHtcbiAgICAgIGlmICh0aGlzLm9wdGlvbnMuZWxlbWVudC5jbGFzc0xpc3QuY29udGFpbnMoJ2FjdGl2ZScpKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmhpZGUoKVxuICAgICAgfVxuXG4gICAgICByZXR1cm4gdGhpcy5zaG93KClcbiAgICB9XG5cbiAgICBzaG93KCkge1xuICAgICAgaWYgKHRoaXMub3B0aW9ucy5lbGVtZW50LmNsYXNzTGlzdC5jb250YWlucygnYWN0aXZlJykpIHtcbiAgICAgICAgcmV0dXJuIGZhbHNlXG4gICAgICB9XG5cbiAgICAgIHRoaXMub3B0aW9ucy5lbGVtZW50LmNsYXNzTGlzdC5hZGQoJ2FjdGl2ZScpXG5cbiAgICAgIGNvbnN0IGRyb3Bkb3duTWVudSA9IHRoaXMub3B0aW9ucy5lbGVtZW50LnF1ZXJ5U2VsZWN0b3IoJy5kcm9wZG93bi1tZW51JylcblxuICAgICAgLy8gc2Nyb2xsIHRvIHRvcFxuICAgICAgZHJvcGRvd25NZW51LnNjcm9sbFRvcCA9IDBcblxuICAgICAgdGhpcy50cmlnZ2VyRXZlbnQoRXZlbnQuU0hPVylcbiAgICAgIHRoaXMudHJpZ2dlckV2ZW50KEV2ZW50LlNIT1dOKVxuXG4gICAgICB0aGlzLnJlZ2lzdGVyRWxlbWVudCh7IHRhcmdldDogZHJvcGRvd25NZW51LCBldmVudDogJ2NsaWNrJyB9KSAgICAgIFxuICAgICAgdGhpcy5yZWdpc3RlckVsZW1lbnQoeyB0YXJnZXQ6IGRvY3VtZW50LmJvZHksIGV2ZW50OiBFdmVudC5TVEFSVCB9KVxuXG4gICAgICByZXR1cm4gdHJ1ZVxuICAgIH1cblxuICAgIGhpZGUoKSB7XG4gICAgICBpZiAoIXRoaXMub3B0aW9ucy5lbGVtZW50LmNsYXNzTGlzdC5jb250YWlucygnYWN0aXZlJykpIHtcbiAgICAgICAgcmV0dXJuIGZhbHNlXG4gICAgICB9XG5cbiAgICAgIHRoaXMub3B0aW9ucy5lbGVtZW50LmNsYXNzTGlzdC5yZW1vdmUoJ2FjdGl2ZScpXG5cbiAgICAgIHRoaXMudHJpZ2dlckV2ZW50KEV2ZW50LkhJREUpXG4gICAgICB0aGlzLnRyaWdnZXJFdmVudChFdmVudC5ISURERU4pXG5cbiAgICAgIHRoaXMudW5yZWdpc3RlckVsZW1lbnQoeyB0YXJnZXQ6IHRoaXMub3B0aW9ucy5lbGVtZW50LnF1ZXJ5U2VsZWN0b3IoJy5kcm9wZG93bi1tZW51JyksIGV2ZW50OiAnY2xpY2snIH0pICAgICAgXG4gICAgICB0aGlzLnVucmVnaXN0ZXJFbGVtZW50KHsgdGFyZ2V0OiBkb2N1bWVudC5ib2R5LCBldmVudDogRXZlbnQuU1RBUlQgfSlcblxuICAgICAgcmV0dXJuIHRydWVcbiAgICB9XG5cbiAgICBzdGF0aWMgaWRlbnRpZmllcigpIHtcbiAgICAgIHJldHVybiBOQU1FXG4gICAgfVxuXG4gICAgc3RhdGljIF9ET01JbnRlcmZhY2Uob3B0aW9ucykge1xuICAgICAgcmV0dXJuIHN1cGVyLl9ET01JbnRlcmZhY2UoRHJvcGRvd24sIG9wdGlvbnMpXG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgKiBET00gQXBpIGltcGxlbWVudGF0aW9uXG4gICAqIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgKi9cbiAgY29uc3QgY29tcG9uZW50cyA9IFtdXG5cbiAgY29uc3QgZHJvcGRvd25zID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChgLiR7TkFNRX1gKVxuICBpZiAoZHJvcGRvd25zKSB7XG4gICAgQXJyYXkuZnJvbShkcm9wZG93bnMpLmZvckVhY2goKGVsZW1lbnQpID0+IHtcbiAgICAgIGNvbnN0IGNvbmZpZyA9IGdldEF0dHJpYnV0ZXNDb25maWcoZWxlbWVudCwgREVGQVVMVF9QUk9QRVJUSUVTLCBEQVRBX0FUVFJTX1BST1BFUlRJRVMpXG4gICAgICBjb25maWcuZWxlbWVudCA9IGVsZW1lbnRcblxuICAgICAgaWYgKCFjb25maWcuc2VhcmNoKSB7XG4gICAgICAgIGNvbXBvbmVudHMucHVzaChuZXcgRHJvcGRvd24oY29uZmlnKSlcbiAgICAgIH1cbiAgICB9KVxuICB9XG5cbiAgaWYgKGRyb3Bkb3ducykge1xuICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKGV2ZW50KSA9PiB7XG4gICAgICBjb25zdCBkcm9wZG93bk1lbnUgPSBmaW5kVGFyZ2V0QnlDbGFzcyhldmVudC50YXJnZXQsICdkcm9wZG93bi1tZW51JylcbiAgICAgIGlmIChkcm9wZG93bk1lbnUpIHtcbiAgICAgICAgcmV0dXJuXG4gICAgICB9XG5cbiAgICAgIGNvbnN0IGRyb3Bkb3duID0gZmluZFRhcmdldEJ5Q2xhc3MoZXZlbnQudGFyZ2V0LCAnZHJvcGRvd24nKVxuXG4gICAgICBpZiAoZHJvcGRvd24pIHtcbiAgICAgICAgY29uc3QgZGF0YVRvZ2dsZUF0dHIgPSBkcm9wZG93bi5nZXRBdHRyaWJ1dGUoJ2RhdGEtdG9nZ2xlJylcbiAgICAgICAgaWYgKGRhdGFUb2dnbGVBdHRyICYmIGRhdGFUb2dnbGVBdHRyID09PSBOQU1FICYmIGRyb3Bkb3duKSB7XG4gICAgICAgICAgY29uc3QgY29tcG9uZW50ID0gY29tcG9uZW50cy5maW5kKGMgPT4gYy5nZXRFbGVtZW50KCkgPT09IGRyb3Bkb3duKVxuXG4gICAgICAgICAgaWYgKCFjb21wb25lbnQpIHtcbiAgICAgICAgICAgIHJldHVyblxuICAgICAgICAgIH1cblxuICAgICAgICAgIGNvbXBvbmVudC50b2dnbGUoKVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfSlcbiAgfVxuXG4gIHJldHVybiBEcm9wZG93blxufSkoKVxuXG5leHBvcnQgZGVmYXVsdCBEcm9wZG93blxuIiwiLyoqXG4gKiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICogTGljZW5zZWQgdW5kZXIgTUlUIChodHRwczovL2dpdGh1Yi5jb20vcXVhcmstZGV2L1Bob25vbi1GcmFtZXdvcmsvYmxvYi9tYXN0ZXIvTElDRU5TRSlcbiAqIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gKi9cbmltcG9ydCBEcm9wZG93biBmcm9tICcuL2luZGV4J1xuaW1wb3J0IHsgZmluZFRhcmdldEJ5Q2xhc3MgfSBmcm9tICcuLi8uLi9jb21tb24vdXRpbHMnXG5pbXBvcnQgeyBnZXRBdHRyaWJ1dGVzQ29uZmlnIH0gZnJvbSAnLi4vY29tcG9uZW50TWFuYWdlcidcblxuY29uc3QgRHJvcGRvd25TZWFyY2ggPSAoKCkgPT4ge1xuXG4gIC8qKlxuICAgKiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICogQ29uc3RhbnRzXG4gICAqIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgKi9cblxuICBjb25zdCBOQU1FID0gRHJvcGRvd24uaWRlbnRpZmllcigpXG4gIGNvbnN0IERFRkFVTFRfUFJPUEVSVElFUyA9IHtcbiAgICBlbGVtZW50OiBudWxsLFxuICAgIGRlZmF1bHQ6IHRydWUsXG4gICAgc2VhcmNoOiB0cnVlLFxuICB9XG4gIGNvbnN0IERBVEFfQVRUUlNfUFJPUEVSVElFUyA9IFtcbiAgICAnZGVmYXVsdCcsXG4gICAgJ3NlYXJjaCcsXG4gIF1cblxuICAvKipcbiAgICogLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAqIENsYXNzIERlZmluaXRpb25cbiAgICogLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAqL1xuXG4gIGNsYXNzIERyb3Bkb3duU2VhcmNoIGV4dGVuZHMgRHJvcGRvd24ge1xuXG4gICAgY29uc3RydWN0b3Iob3B0aW9ucyA9IHt9KSB7XG4gICAgICBzdXBlcihvcHRpb25zKVxuXG4gICAgICB0aGlzLmZpbHRlckl0ZW1zSGFuZGxlciA9IChldmVudCkgPT4ge1xuICAgICAgICBjb25zdCBzZWFyY2ggPSBldmVudC50YXJnZXQudmFsdWVcblxuICAgICAgICBpZiAoc2VhcmNoID09PSAnJykge1xuICAgICAgICAgIHRoaXMuc2hvd0l0ZW1zKClcbiAgICAgICAgICByZXR1cm5cbiAgICAgICAgfVxuXG5cbiAgICAgICAgdGhpcy5nZXRJdGVtcygpLmZvckVhY2goKGl0ZW0pID0+IHtcbiAgICAgICAgICBjb25zdCBmbiA9IHR5cGVvZiB0aGlzLm9wdGlvbnMuZmlsdGVySXRlbSA9PT0gJ2Z1bmN0aW9uJyA/IHRoaXMub3B0aW9ucy5maWx0ZXJJdGVtIDogdGhpcy5maWx0ZXJJdGVtXG5cbiAgICAgICAgICBpZiAoZm4oc2VhcmNoLCBpdGVtKSkge1xuICAgICAgICAgICAgaXRlbS5lbGVtZW50LnN0eWxlLmRpc3BsYXkgPSAnYmxvY2snXG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGl0ZW0uZWxlbWVudC5zdHlsZS5kaXNwbGF5ID0gJ25vbmUnXG4gICAgICAgICAgfVxuICAgICAgICB9KVxuICAgICAgfVxuXG4gICAgICB0aGlzLmdldFNlYXJjaElucHV0KCkuYWRkRXZlbnRMaXN0ZW5lcigna2V5dXAnLCB0aGlzLmZpbHRlckl0ZW1zSGFuZGxlcilcbiAgICB9XG5cbiAgICBmaWx0ZXJJdGVtKHNlYXJjaCA9ICcnLCBpdGVtID0ge30pIHtcbiAgICAgIGlmIChpdGVtLnZhbHVlLmluZGV4T2Yoc2VhcmNoKSA+IC0xXG4gICAgICAgIHx8IGl0ZW0udGV4dC5pbmRleE9mKHNlYXJjaCkgPiAtMSkge1xuICAgICAgICByZXR1cm4gdHJ1ZVxuICAgICAgfVxuXG4gICAgICByZXR1cm4gZmFsc2VcbiAgICB9XG5cbiAgICBnZXRJdGVtcygpIHtcbiAgICAgIGxldCBpdGVtcyA9IEFycmF5LmZyb20odGhpcy5vcHRpb25zLmVsZW1lbnQucXVlcnlTZWxlY3RvckFsbCgnLml0ZW0nKSB8fCBbXSlcbiAgICAgIGl0ZW1zID0gaXRlbXMubWFwKChpdGVtKSA9PiB7XG4gICAgICAgIGNvbnN0IGluZm8gPSB0aGlzLmdldEl0ZW1EYXRhKGl0ZW0pXG4gICAgICAgIHJldHVybiB7IHRleHQ6IGluZm8udGV4dCwgdmFsdWU6IGluZm8udmFsdWUsIGVsZW1lbnQ6IGl0ZW0gfVxuICAgICAgfSlcblxuICAgICAgcmV0dXJuIGl0ZW1zXG4gICAgfVxuXG4gICAgc2hvd0l0ZW1zKCkge1xuICAgICAgdGhpcy5nZXRJdGVtcygpLmZvckVhY2goKGl0ZW0pID0+IHtcbiAgICAgICAgaXRlbS5lbGVtZW50LnN0eWxlLmRpc3BsYXkgPSAnYmxvY2snXG4gICAgICB9KVxuICAgIH1cblxuICAgIGdldFNlYXJjaElucHV0KCkge1xuICAgICAgcmV0dXJuIHRoaXMub3B0aW9ucy5lbGVtZW50LnF1ZXJ5U2VsZWN0b3IoJy5kcm9wZG93bi1tZW51IGlucHV0JylcbiAgICB9XG5cbiAgICBoaWRlKCkge1xuICAgICAgaWYgKHN1cGVyLmhpZGUoKSkge1xuICAgICAgICAvLyByZXNldCB0aGUgdmFsdWVcbiAgICAgICAgdGhpcy5nZXRTZWFyY2hJbnB1dCgpLnZhbHVlID0gJydcbiAgICAgICAgLy8gc2hvdyBhbGwgaXRlbXNcbiAgICAgICAgdGhpcy5zaG93SXRlbXMoKVxuICAgICAgfVxuICAgIH1cblxuICAgIHN0YXRpYyBfRE9NSW50ZXJmYWNlKG9wdGlvbnMpIHtcbiAgICAgIHJldHVybiBuZXcgRHJvcGRvd25TZWFyY2gob3B0aW9ucylcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAqIERPTSBBcGkgaW1wbGVtZW50YXRpb25cbiAgICogLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAqL1xuICBjb25zdCBjb21wb25lbnRzID0gW11cbiAgY29uc3QgZHJvcGRvd25zID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChgLiR7TkFNRX1gKVxuXG4gIGlmIChkcm9wZG93bnMpIHtcbiAgICBBcnJheS5mcm9tKGRyb3Bkb3ducykuZm9yRWFjaCgoZWxlbWVudCkgPT4ge1xuICAgICAgY29uc3QgY29uZmlnID0gZ2V0QXR0cmlidXRlc0NvbmZpZyhlbGVtZW50LCBERUZBVUxUX1BST1BFUlRJRVMsIERBVEFfQVRUUlNfUFJPUEVSVElFUylcbiAgICAgIGNvbmZpZy5lbGVtZW50ID0gZWxlbWVudFxuXG4gICAgICBpZiAoY29uZmlnLnNlYXJjaCkge1xuICAgICAgICAvLyBzZWFyY2hcbiAgICAgICAgY29tcG9uZW50cy5wdXNoKG5ldyBEcm9wZG93blNlYXJjaChjb25maWcpKVxuICAgICAgfVxuICAgIH0pXG4gIH1cblxuICBpZiAoZHJvcGRvd25zKSB7XG4gICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoZXZlbnQpID0+IHtcbiAgICAgIGNvbnN0IGRyb3Bkb3duTWVudSA9IGZpbmRUYXJnZXRCeUNsYXNzKGV2ZW50LnRhcmdldCwgJ2Ryb3Bkb3duLW1lbnUnKVxuICAgICAgaWYgKGRyb3Bkb3duTWVudSkge1xuICAgICAgICByZXR1cm5cbiAgICAgIH1cblxuICAgICAgY29uc3QgZHJvcGRvd24gPSBmaW5kVGFyZ2V0QnlDbGFzcyhldmVudC50YXJnZXQsICdkcm9wZG93bicpXG5cbiAgICAgIGlmIChkcm9wZG93bikge1xuICAgICAgICBjb25zdCBkYXRhVG9nZ2xlQXR0ciA9IGRyb3Bkb3duLmdldEF0dHJpYnV0ZSgnZGF0YS10b2dnbGUnKVxuICAgICAgICBpZiAoZGF0YVRvZ2dsZUF0dHIgJiYgZGF0YVRvZ2dsZUF0dHIgPT09IE5BTUUgJiYgZHJvcGRvd24pIHtcbiAgICAgICAgICBjb25zdCBjb21wb25lbnQgPSBjb21wb25lbnRzLmZpbmQoYyA9PiBjLmdldEVsZW1lbnQoKSA9PT0gZHJvcGRvd24pXG5cbiAgICAgICAgICBpZiAoIWNvbXBvbmVudCkge1xuICAgICAgICAgICAgcmV0dXJuXG4gICAgICAgICAgfVxuXG4gICAgICAgICAgY29tcG9uZW50LnRvZ2dsZSgpXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9KVxuICB9XG5cbiAgcmV0dXJuIERyb3Bkb3duU2VhcmNoXG59KSgpXG5cbmV4cG9ydCBkZWZhdWx0IERyb3Bkb3duU2VhcmNoXG4iLCIvKipcbiAqIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gKiBMaWNlbnNlZCB1bmRlciBNSVQgKGh0dHBzOi8vZ2l0aHViLmNvbS9xdWFyay1kZXYvUGhvbm9uLUZyYW1ld29yay9ibG9iL21hc3Rlci9MSUNFTlNFKVxuICogLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAqL1xuaW1wb3J0IENvbXBvbmVudCBmcm9tICcuLi9jb21wb25lbnQnXG5cbmNvbnN0IExvYWRlciA9ICgoKSA9PiB7XG4gIC8qKlxuICAgKiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICogQ29uc3RhbnRzXG4gICAqIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgKi9cblxuICBjb25zdCBOQU1FID0gJ2xvYWRlcidcbiAgY29uc3QgVkVSU0lPTiA9ICcyLjAuMCdcbiAgY29uc3QgREVGQVVMVF9QUk9QRVJUSUVTID0ge1xuICAgIGVsZW1lbnQ6IG51bGwsXG4gICAgY29sb3I6IG51bGwsXG4gICAgc2l6ZTogbnVsbCxcbiAgfVxuICBjb25zdCBEQVRBX0FUVFJTX1BST1BFUlRJRVMgPSBbXVxuXG4gIC8qKlxuICAgKiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICogQ2xhc3MgRGVmaW5pdGlvblxuICAgKiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICovXG5cbiAgY2xhc3MgTG9hZGVyIGV4dGVuZHMgQ29tcG9uZW50IHtcblxuICAgIGNvbnN0cnVjdG9yKG9wdGlvbnMgPSB7fSkge1xuICAgICAgc3VwZXIoTkFNRSwgVkVSU0lPTiwgREVGQVVMVF9QUk9QRVJUSUVTLCBvcHRpb25zLCBEQVRBX0FUVFJTX1BST1BFUlRJRVMsIGZhbHNlLCBmYWxzZSlcblxuICAgICAgLy8gc2V0IGNvbG9yXG4gICAgICBjb25zdCBsb2FkZXJTcGlubmVyID0gdGhpcy5nZXRTcGlubmVyKClcbiAgICAgIGlmICh0eXBlb2YgdGhpcy5vcHRpb25zLmNvbG9yID09PSAnc3RyaW5nJ1xuICAgICAgICAmJiAhbG9hZGVyU3Bpbm5lci5jbGFzc0xpc3QuY29udGFpbnMoYGNvbG9yLSR7dGhpcy5vcHRpb25zLmNvbG9yfWApKSB7XG4gICAgICAgIGxvYWRlclNwaW5uZXIuY2xhc3NMaXN0LmFkZChgY29sb3ItJHt0aGlzLm9wdGlvbnMuY29sb3J9YClcbiAgICAgIH1cblxuICAgICAgdGhpcy5jdXN0b21TaXplID0gdGhpcy5vcHRpb25zLnNpemUgIT09IG51bGxcbiAgICB9XG5cbiAgICBnZXRDbGllbnRTaXplKCkge1xuICAgICAgaWYgKCF0aGlzLmN1c3RvbVNpemUpIHtcbiAgICAgICAgY29uc3Qgc2l6ZSA9IHRoaXMub3B0aW9ucy5lbGVtZW50LmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpICAgICAgICBcbiAgICAgICAgcmV0dXJuIHNpemUuaGVpZ2h0XG4gICAgICB9XG5cbiAgICAgIHJldHVybiB0aGlzLm9wdGlvbnMuc2l6ZVxuICAgIH1cblxuICAgIGdldFNwaW5uZXIoKSB7XG4gICAgICByZXR1cm4gdGhpcy5vcHRpb25zLmVsZW1lbnQucXVlcnlTZWxlY3RvcignLmxvYWRlci1zcGlubmVyJylcbiAgICB9XG5cbiAgICBzaG93KCkge1xuICAgICAgaWYgKHRoaXMub3B0aW9ucy5lbGVtZW50LmNsYXNzTGlzdC5jb250YWlucygnaGlkZScpKSB7XG4gICAgICAgIHRoaXMub3B0aW9ucy5lbGVtZW50LmNsYXNzTGlzdC5yZW1vdmUoJ2hpZGUnKVxuICAgICAgfVxuXG4gICAgICBjb25zdCBzaXplID0gdGhpcy5nZXRDbGllbnRTaXplKClcbiAgICAgIHRoaXMub3B0aW9ucy5zaXplID0gc2l6ZVxuXG4gICAgICBpZiAodGhpcy5jdXN0b21TaXplKSB7XG4gICAgICAgIHRoaXMub3B0aW9ucy5lbGVtZW50LnN0eWxlLndpZHRoID0gYCR7dGhpcy5vcHRpb25zLnNpemV9cHhgXG4gICAgICAgIHRoaXMub3B0aW9ucy5lbGVtZW50LnN0eWxlLmhlaWdodCA9IGAke3RoaXMub3B0aW9ucy5zaXplfXB4YFxuXG4gICAgICAgIGNvbnN0IGxvYWRlclNwaW5uZXIgPSB0aGlzLmdldFNwaW5uZXIoKVxuICAgICAgICBsb2FkZXJTcGlubmVyLnN0eWxlLndpZHRoID0gYCR7dGhpcy5vcHRpb25zLnNpemV9cHhgXG4gICAgICAgIGxvYWRlclNwaW5uZXIuc3R5bGUuaGVpZ2h0ID0gYCR7dGhpcy5vcHRpb25zLnNpemV9cHhgXG4gICAgICB9XG5cbiAgICAgIHJldHVybiB0cnVlXG4gICAgfVxuXG4gICAgYW5pbWF0ZShzdGFydEFuaW1hdGlvbiA9IHRydWUpIHtcbiAgICAgIGlmIChzdGFydEFuaW1hdGlvbikge1xuICAgICAgICB0aGlzLnNob3coKVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy5oaWRlKClcbiAgICAgIH1cblxuICAgICAgY29uc3QgbG9hZGVyU3Bpbm5lciA9IHRoaXMuZ2V0U3Bpbm5lcigpXG5cbiAgICAgIGlmIChzdGFydEFuaW1hdGlvbiAmJlxuICAgICAgICAhbG9hZGVyU3Bpbm5lci5jbGFzc0xpc3QuY29udGFpbnMoJ2xvYWRlci1zcGlubmVyLWFuaW1hdGVkJykpIHtcbiAgICAgICAgbG9hZGVyU3Bpbm5lci5jbGFzc0xpc3QuYWRkKCdsb2FkZXItc3Bpbm5lci1hbmltYXRlZCcpXG4gICAgICAgIHJldHVybiB0cnVlXG4gICAgICB9XG5cbiAgICAgIGlmICghc3RhcnRBbmltYXRpb24gJiZcbiAgICAgICAgbG9hZGVyU3Bpbm5lci5jbGFzc0xpc3QuY29udGFpbnMoJ2xvYWRlci1zcGlubmVyLWFuaW1hdGVkJykpIHtcbiAgICAgICAgbG9hZGVyU3Bpbm5lci5jbGFzc0xpc3QucmVtb3ZlKCdsb2FkZXItc3Bpbm5lci1hbmltYXRlZCcpXG4gICAgICB9XG5cbiAgICAgIHJldHVybiB0cnVlXG4gICAgfVxuXG4gICAgaGlkZSgpIHtcbiAgICAgIGlmICghdGhpcy5vcHRpb25zLmVsZW1lbnQuY2xhc3NMaXN0LmNvbnRhaW5zKCdoaWRlJykpIHtcbiAgICAgICAgdGhpcy5vcHRpb25zLmVsZW1lbnQuY2xhc3NMaXN0LmFkZCgnaGlkZScpXG4gICAgICB9XG5cbiAgICAgIHJldHVybiB0cnVlXG4gICAgfVxuXG4gICAgc3RhdGljIGlkZW50aWZpZXIoKSB7XG4gICAgICByZXR1cm4gTkFNRVxuICAgIH1cblxuICAgIHN0YXRpYyBfRE9NSW50ZXJmYWNlKG9wdGlvbnMpIHtcbiAgICAgIHJldHVybiBzdXBlci5fRE9NSW50ZXJmYWNlKExvYWRlciwgb3B0aW9ucylcbiAgICB9XG4gIH1cblxuICByZXR1cm4gTG9hZGVyXG59KSgpXG5cbmV4cG9ydCBkZWZhdWx0IExvYWRlclxuIiwiLyoqXG4qIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4qIExpY2Vuc2VkIHVuZGVyIE1JVCAoaHR0cHM6Ly9naXRodWIuY29tL3F1YXJrLWRldi9QaG9ub24tRnJhbWV3b3JrL2Jsb2IvbWFzdGVyL0xJQ0VOU0UpXG4qIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4qL1xuaW1wb3J0IEV2ZW50IGZyb20gJy4uLy4uL2NvbW1vbi9ldmVudHMnXG5pbXBvcnQgQ29tcG9uZW50IGZyb20gJy4uL2NvbXBvbmVudCdcblxuY29uc3QgTm90aWZpY2F0aW9uID0gKCgpID0+IHtcbiAgLyoqXG4gICAqIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAqIENvbnN0YW50c1xuICAqIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAqL1xuXG4gIGNvbnN0IE5BTUUgPSAnbm90aWZpY2F0aW9uJ1xuICBjb25zdCBWRVJTSU9OID0gJzIuMC4wJ1xuICBjb25zdCBERUZBVUxUX1BST1BFUlRJRVMgPSB7XG4gICAgZWxlbWVudDogbnVsbCxcbiAgICBtZXNzYWdlOiAnJyxcbiAgICBzaG93QnV0dG9uOiB0cnVlLFxuICAgIHRpbWVvdXQ6IG51bGwsXG4gICAgYmFja2dyb3VuZDogJ3ByaW1hcnknLFxuICB9XG4gIGNvbnN0IERBVEFfQVRUUlNfUFJPUEVSVElFUyA9IFtcbiAgICAndGltZW91dCcsXG4gIF1cblxuICAvKipcbiAgICogLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAqIENsYXNzIERlZmluaXRpb25cbiAgICogLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAqL1xuXG4gIGNsYXNzIE5vdGlmaWNhdGlvbiBleHRlbmRzIENvbXBvbmVudCB7XG5cbiAgICBjb25zdHJ1Y3RvcihvcHRpb25zID0ge30pIHtcbiAgICAgIHN1cGVyKE5BTUUsIFZFUlNJT04sIERFRkFVTFRfUFJPUEVSVElFUywgb3B0aW9ucywgREFUQV9BVFRSU19QUk9QRVJUSUVTLCB0cnVlLCBmYWxzZSlcblxuICAgICAgdGhpcy50ZW1wbGF0ZSA9ICcnICtcbiAgICAgICc8ZGl2IGNsYXNzPVwibm90aWZpY2F0aW9uXCI+JyArXG4gICAgICAgICc8ZGl2IGNsYXNzPVwibm90aWZpY2F0aW9uLWlubmVyXCI+JyArXG4gICAgICAgICAgJzxkaXYgY2xhc3M9XCJtZXNzYWdlXCI+PC9kaXY+JyArXG4gICAgICAgICAgJzxidXR0b24gdHlwZT1cImJ1dHRvblwiIGNsYXNzPVwiY2xvc2VcIiBkYXRhLWRpc21pc3M9XCJub3RpZmljYXRpb25cIiBhcmlhLWxhYmVsPVwiQ2xvc2VcIj4nICtcbiAgICAgICAgICAgICc8c3BhbiBhcmlhLWhpZGRlbj1cInRydWVcIj4mdGltZXM7PC9zcGFuPicgK1xuICAgICAgICAgICc8L2J1dHRvbj4nICtcbiAgICAgICAgJzwvZGl2PicgK1xuICAgICAgJzwvZGl2PidcblxuICAgICAgaWYgKHRoaXMuZHluYW1pY0VsZW1lbnQpIHtcbiAgICAgICAgdGhpcy5idWlsZCgpXG4gICAgICB9XG5cbiAgICAgIHRoaXMudGltZW91dENhbGxiYWNrID0gbnVsbFxuICAgIH1cblxuICAgIGJ1aWxkKCkge1xuICAgICAgY29uc3QgYnVpbGRlciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpXG5cbiAgICAgIGJ1aWxkZXIuaW5uZXJIVE1MID0gdGhpcy50ZW1wbGF0ZVxuXG4gICAgICB0aGlzLm9wdGlvbnMuZWxlbWVudCA9IGJ1aWxkZXIuZmlyc3RDaGlsZFxuXG4gICAgICAvLyB0ZXh0IG1lc3NhZ2VcbiAgICAgIHRoaXMub3B0aW9ucy5lbGVtZW50LnF1ZXJ5U2VsZWN0b3IoJy5tZXNzYWdlJykuaW5uZXJIVE1MID0gdGhpcy5vcHRpb25zLm1lc3NhZ2VcblxuICAgICAgaWYgKCF0aGlzLm9wdGlvbnMuc2hvd0J1dHRvbikge1xuICAgICAgICB0aGlzLm9wdGlvbnMuZWxlbWVudC5xdWVyeVNlbGVjdG9yKCdidXR0b24nKS5zdHlsZS5kaXNwbGF5ID0gJ25vbmUnXG4gICAgICB9XG5cbiAgICAgIGRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQodGhpcy5vcHRpb25zLmVsZW1lbnQpXG5cbiAgICAgIHRoaXMuc2V0QXR0cmlidXRlcygpXG4gICAgfVxuXG4gICAgc2hvdygpIHtcbiAgICAgIGlmICh0aGlzLm9wdGlvbnMuZWxlbWVudCA9PT0gbnVsbCkge1xuICAgICAgICAvLyBidWlsZCBhbmQgaW5zZXJ0IGEgbmV3IERPTSBlbGVtZW50XG4gICAgICAgIHRoaXMuYnVpbGQoKVxuICAgICAgfVxuXG4gICAgICBpZiAodGhpcy5vcHRpb25zLmVsZW1lbnQuY2xhc3NMaXN0LmNvbnRhaW5zKCdzaG93JykpIHtcbiAgICAgICAgcmV0dXJuIGZhbHNlXG4gICAgICB9XG5cbiAgICAgIC8vIHJlc2V0IGNvbG9yXG4gICAgICBpZiAodGhpcy5vcHRpb25zLmJhY2tncm91bmQpIHtcbiAgICAgICAgdGhpcy5vcHRpb25zLmVsZW1lbnQucmVtb3ZlQXR0cmlidXRlKCdjbGFzcycpXG4gICAgICAgIHRoaXMub3B0aW9ucy5lbGVtZW50LnNldEF0dHJpYnV0ZSgnY2xhc3MnLCAnbm90aWZpY2F0aW9uJylcblxuICAgICAgICB0aGlzLm9wdGlvbnMuZWxlbWVudC5jbGFzc0xpc3QuYWRkKGBiZy0ke3RoaXMub3B0aW9ucy5iYWNrZ3JvdW5kfWApXG4gICAgICAgIHRoaXMub3B0aW9ucy5lbGVtZW50LnF1ZXJ5U2VsZWN0b3IoJ2J1dHRvbicpLmNsYXNzTGlzdC5hZGQoYGJ0bi0ke3RoaXMub3B0aW9ucy5iYWNrZ3JvdW5kfWApXG4gICAgICB9XG5cbiAgICAgIGlmICh0aGlzLm9wdGlvbnMuc2hvd0J1dHRvbikge1xuICAgICAgICAvLyBhdHRhY2ggdGhlIGJ1dHRvbiBoYW5kbGVyXG4gICAgICAgIGNvbnN0IGJ1dHRvbkVsZW1lbnQgPSB0aGlzLm9wdGlvbnMuZWxlbWVudC5xdWVyeVNlbGVjdG9yKCdidXR0b24nKVxuICAgICAgICB0aGlzLnJlZ2lzdGVyRWxlbWVudCh7IHRhcmdldDogYnV0dG9uRWxlbWVudCwgZXZlbnQ6ICdjbGljaycgfSlcbiAgICAgIH1cblxuICAgICAgc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICAgIHRoaXMub3B0aW9ucy5lbGVtZW50LmNsYXNzTGlzdC5hZGQoJ3Nob3cnKVxuXG4gICAgICAgIC8vIHNldCBwb3NpdGlvblxuICAgICAgICBjb25zdCBhY3RpdmVOb3RpZmljYXRpb25zID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnLm5vdGlmaWNhdGlvbi5zaG93JykgfHwgW11cbiAgICAgICAgbGV0IHB1c2hEaXN0YW5jZSA9IDBcbiAgICAgICAgYWN0aXZlTm90aWZpY2F0aW9ucy5mb3JFYWNoKChub3RpZmljYXRpb24pID0+IHtcbiAgICAgICAgICBpZiAodGhpcy5vcHRpb25zLmVsZW1lbnQgIT09IG5vdGlmaWNhdGlvbikge1xuICAgICAgICAgICAgY29uc3Qgc3R5bGUgPSBnZXRDb21wdXRlZFN0eWxlKG5vdGlmaWNhdGlvbilcbiAgICAgICAgICAgIHB1c2hEaXN0YW5jZSArPSBub3RpZmljYXRpb24ub2Zmc2V0SGVpZ2h0ICsgcGFyc2VJbnQoc3R5bGUubWFyZ2luQm90dG9tLCAxMClcbiAgICAgICAgICB9XG4gICAgICAgIH0pXG5cbiAgICAgICAgdGhpcy5vcHRpb25zLmVsZW1lbnQuc3R5bGUudHJhbnNmb3JtID0gYHRyYW5zbGF0ZVkoJHtwdXNoRGlzdGFuY2V9cHgpYFxuXG4gICAgICAgIHRoaXMudHJpZ2dlckV2ZW50KEV2ZW50LlNIT1cpXG5cbiAgICAgICAgY29uc3Qgb25TaG93biA9ICgpID0+IHtcbiAgICAgICAgICB0aGlzLnRyaWdnZXJFdmVudChFdmVudC5TSE9XTilcbiAgICAgICAgICB0aGlzLm9wdGlvbnMuZWxlbWVudC5yZW1vdmVFdmVudExpc3RlbmVyKEV2ZW50LlRSQU5TSVRJT05fRU5ELCBvblNob3duKVxuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5vcHRpb25zLmVsZW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihFdmVudC5UUkFOU0lUSU9OX0VORCwgb25TaG93bilcblxuICAgICAgfSwgMSlcblxuICAgICAgaWYgKE51bWJlci5pc0ludGVnZXIodGhpcy5vcHRpb25zLnRpbWVvdXQpICYmIHRoaXMub3B0aW9ucy50aW1lb3V0ID4gMCkge1xuICAgICAgICAvLyBpZiB0aGVyZSBpcyBhIHRpbWVvdXQsIGF1dG8gaGlkZSB0aGUgbm90aWZpY2F0aW9uXG4gICAgICAgIHRoaXMudGltZW91dENhbGxiYWNrID0gc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICAgICAgdGhpcy5oaWRlKClcbiAgICAgICAgfSwgdGhpcy5vcHRpb25zLnRpbWVvdXQgKyAxKVxuICAgICAgfVxuXG4gICAgICByZXR1cm4gdHJ1ZVxuICAgIH1cblxuICAgIGhpZGUoKSB7XG4gICAgICAvKlxuICAgICAgICogcHJldmVudCB0byBjbG9zZSBhIG5vdGlmaWNhdGlvbiB3aXRoIGEgdGltZW91dFxuICAgICAgICogaWYgdGhlIHVzZXIgaGFzIGFscmVhZHkgY2xpY2tlZCBvbiB0aGUgYnV0dG9uXG4gICAgICAgKi9cbiAgICAgIGlmICh0aGlzLnRpbWVvdXRDYWxsYmFjaykge1xuICAgICAgICBjbGVhclRpbWVvdXQodGhpcy50aW1lb3V0Q2FsbGJhY2spXG4gICAgICAgIHRoaXMudGltZW91dENhbGxiYWNrID0gbnVsbFxuICAgICAgfVxuXG4gICAgICBpZiAoIXRoaXMub3B0aW9ucy5lbGVtZW50LmNsYXNzTGlzdC5jb250YWlucygnc2hvdycpKSB7XG4gICAgICAgIHJldHVybiBmYWxzZVxuICAgICAgfVxuXG4gICAgICB0aGlzLnRyaWdnZXJFdmVudChFdmVudC5ISURFKVxuXG4gICAgICBpZiAodGhpcy5vcHRpb25zLnNob3dCdXR0b24pIHtcbiAgICAgICAgY29uc3QgYnV0dG9uRWxlbWVudCA9IHRoaXMub3B0aW9ucy5lbGVtZW50LnF1ZXJ5U2VsZWN0b3IoJ2J1dHRvbicpXG4gICAgICAgIHRoaXMudW5yZWdpc3RlckVsZW1lbnQoeyB0YXJnZXQ6IGJ1dHRvbkVsZW1lbnQsIGV2ZW50OiAnY2xpY2snIH0pXG4gICAgICB9XG5cbiAgICAgIHRoaXMub3B0aW9ucy5lbGVtZW50LmNsYXNzTGlzdC5yZW1vdmUoJ3Nob3cnKVxuICAgICAgdGhpcy5vcHRpb25zLmVsZW1lbnQuY2xhc3NMaXN0LmFkZCgnaGlkZScpXG5cbiAgICAgIGNvbnN0IG9uSGlkZGVuID0gKCkgPT4ge1xuICAgICAgICB0aGlzLm9wdGlvbnMuZWxlbWVudC5yZW1vdmVFdmVudExpc3RlbmVyKEV2ZW50LlRSQU5TSVRJT05fRU5ELCBvbkhpZGRlbilcbiAgICAgICAgdGhpcy5vcHRpb25zLmVsZW1lbnQuY2xhc3NMaXN0LnJlbW92ZSgnaGlkZScpXG5cbiAgICAgICAgdGhpcy50cmlnZ2VyRXZlbnQoRXZlbnQuSElEREVOKVxuXG4gICAgICAgIGlmICh0aGlzLmR5bmFtaWNFbGVtZW50KSB7XG4gICAgICAgICAgZG9jdW1lbnQuYm9keS5yZW1vdmVDaGlsZCh0aGlzLm9wdGlvbnMuZWxlbWVudClcbiAgICAgICAgICB0aGlzLm9wdGlvbnMuZWxlbWVudCA9IG51bGxcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICB0aGlzLm9wdGlvbnMuZWxlbWVudC5hZGRFdmVudExpc3RlbmVyKEV2ZW50LlRSQU5TSVRJT05fRU5ELCBvbkhpZGRlbilcblxuICAgICAgcmV0dXJuIHRydWVcbiAgICB9XG5cbiAgICBvbkVsZW1lbnRFdmVudCgpIHtcbiAgICAgIHRoaXMuaGlkZSgpXG4gICAgfVxuXG4gICAgc3RhdGljIGlkZW50aWZpZXIoKSB7XG4gICAgICByZXR1cm4gTkFNRVxuICAgIH1cblxuICAgIHN0YXRpYyBfRE9NSW50ZXJmYWNlKG9wdGlvbnMpIHtcbiAgICAgIHJldHVybiBzdXBlci5fRE9NSW50ZXJmYWNlKE5vdGlmaWNhdGlvbiwgb3B0aW9ucylcbiAgICB9XG4gIH1cblxuICByZXR1cm4gTm90aWZpY2F0aW9uXG59KSgpXG5cbmV4cG9ydCBkZWZhdWx0IE5vdGlmaWNhdGlvblxuIiwiLyoqXG4gKiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICogTGljZW5zZWQgdW5kZXIgTUlUIChodHRwczovL2dpdGh1Yi5jb20vcXVhcmstZGV2L1Bob25vbi1GcmFtZXdvcmsvYmxvYi9tYXN0ZXIvTElDRU5TRSlcbiAqIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gKi9cbmltcG9ydCBFdmVudCBmcm9tICcuLi8uLi9jb21tb24vZXZlbnRzJ1xuaW1wb3J0IENvbXBvbmVudCBmcm9tICcuLi9jb21wb25lbnQnXG5pbXBvcnQgeyBnZXRBdHRyaWJ1dGVzQ29uZmlnIH0gZnJvbSAnLi4vY29tcG9uZW50TWFuYWdlcidcbmltcG9ydCB7IGZpbmRUYXJnZXRCeUF0dHIgfSBmcm9tICcuLi8uLi9jb21tb24vdXRpbHMnXG5cbmNvbnN0IE9mZkNhbnZhcyA9ICgoKSA9PiB7XG4gIC8qKlxuICAgKiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICogQ29uc3RhbnRzXG4gICAqIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgKi9cblxuICBjb25zdCBOQU1FID0gJ29mZi1jYW52YXMnXG4gIGNvbnN0IFZFUlNJT04gPSAnMi4wLjAnXG4gIGNvbnN0IEJBQ0tEUk9QX1NFTEVDVE9SID0gJ29mZi1jYW52YXMtYmFja2Ryb3AnXG4gIGNvbnN0IERFRkFVTFRfUFJPUEVSVElFUyA9IHtcbiAgICBlbGVtZW50OiBudWxsLFxuICAgIGFzaWRlOiB7XG4gICAgICBtZDogZmFsc2UsXG4gICAgICBsZzogZmFsc2UsXG4gICAgICB4bDogZmFsc2UsXG4gICAgfSxcbiAgfVxuICBjb25zdCBEQVRBX0FUVFJTX1BST1BFUlRJRVMgPSBbXG4gICAgJ2FzaWRlJyxcbiAgXVxuXG4gIC8qKlxuICAgKiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICogQ2xhc3MgRGVmaW5pdGlvblxuICAgKiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICovXG5cbiAgY2xhc3MgT2ZmQ2FudmFzIGV4dGVuZHMgQ29tcG9uZW50IHtcblxuICAgIGNvbnN0cnVjdG9yKG9wdGlvbnMgPSB7fSkge1xuICAgICAgc3VwZXIoTkFNRSwgVkVSU0lPTiwgREVGQVVMVF9QUk9QRVJUSUVTLCBvcHRpb25zLCBEQVRBX0FUVFJTX1BST1BFUlRJRVMsIGZhbHNlLCB0cnVlKVxuXG4gICAgICB0aGlzLnVzZUJhY2tkcm9wID0gdHJ1ZVxuICAgICAgdGhpcy5jdXJyZW50V2lkdGggPSBudWxsXG4gICAgICB0aGlzLmFuaW1hdGUgPSB0cnVlXG5cbiAgICAgIHRoaXMuZGlyZWN0aW9ucyA9IFsnbGVmdCcsICdyaWdodCddXG5cbiAgICAgIGNvbnN0IHNtID0geyBuYW1lOiAnc20nLCBtZWRpYTogd2luZG93Lm1hdGNoTWVkaWEoJyhtaW4td2lkdGg6IDFweCknKSB9XG4gICAgICBjb25zdCBtZCA9IHsgbmFtZTogJ21kJywgbWVkaWE6IHdpbmRvdy5tYXRjaE1lZGlhKCcobWluLXdpZHRoOiA3NjhweCknKSB9XG4gICAgICBjb25zdCBsZyA9IHsgbmFtZTogJ2xnJywgbWVkaWE6IHdpbmRvdy5tYXRjaE1lZGlhKCcobWluLXdpZHRoOiA5OTJweCknKSB9XG4gICAgICBjb25zdCB4bCA9IHsgbmFtZTogJ3hsJywgbWVkaWE6IHdpbmRvdy5tYXRjaE1lZGlhKCcobWluLXdpZHRoOiAxMjAwcHgpJykgfVxuXG4gICAgICB0aGlzLnNpemVzID0gW3NtLCBtZCwgbGcsIHhsXS5yZXZlcnNlKClcblxuICAgICAgdGhpcy5jaGVja0RpcmVjdGlvbigpXG4gICAgICB0aGlzLmNoZWNrV2lkdGgoKVxuXG4gICAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcigncmVzaXplJywgKCkgPT4gdGhpcy5jaGVja1dpZHRoKCksIGZhbHNlKSAgICAgIFxuICAgIH1cblxuICAgIGNoZWNrRGlyZWN0aW9uKCkge1xuICAgICAgdGhpcy5kaXJlY3Rpb25zLmV2ZXJ5KChkaXJlY3Rpb24pID0+IHtcbiAgICAgICAgaWYgKHRoaXMub3B0aW9ucy5lbGVtZW50LmNsYXNzTGlzdC5jb250YWlucyhgb2ZmLWNhbnZhcy0ke2RpcmVjdGlvbn1gKSkge1xuICAgICAgICAgIHRoaXMuZGlyZWN0aW9uID0gZGlyZWN0aW9uXG4gICAgICAgICAgcmV0dXJuIGZhbHNlXG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRydWVcbiAgICAgIH0pXG4gICAgfVxuXG4gICAgY2hlY2tXaWR0aCgpIHtcbiAgICAgIGlmICghKCdtYXRjaE1lZGlhJyBpbiB3aW5kb3cpKSB7XG4gICAgICAgIHJldHVyblxuICAgICAgfVxuXG4gICAgICB0aGlzLnNpemVzLmV2ZXJ5KChzaXplKSA9PiB7XG4gICAgICAgIGNvbnN0IG1hdGNoID0gc2l6ZS5tZWRpYS5tZWRpYS5tYXRjaCgvW2Etel0/LXdpZHRoOlxccz8oWzAtOV0rKS8pXG5cbiAgICAgICAgaWYgKG1hdGNoKSB7XG4gICAgICAgICAgaWYgKHNpemUubWVkaWEubWF0Y2hlcykge1xuICAgICAgICAgICAgaWYgKHRoaXMuY3VycmVudFdpZHRoICE9PSBzaXplLm5hbWUpIHtcbiAgICAgICAgICAgICAgdGhpcy5zZXRBc2lkZShzaXplLm5hbWUpXG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB0aGlzLmN1cnJlbnRXaWR0aCA9IHNpemUubmFtZVxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlXG4gICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHRydWVcbiAgICAgIH0pXG4gICAgfVxuXG4gICAgcHJldmVudENsb3NhYmxlKCkge1xuICAgICAgcmV0dXJuIHN1cGVyLnByZXZlbnRDbG9zYWJsZSgpIHx8IHRoaXMub3B0aW9ucy5hc2lkZVt0aGlzLmN1cnJlbnRXaWR0aF0gPT09IHRydWVcbiAgICB9XG5cbiAgICBzZXRBc2lkZShuYW1lKSB7XG4gICAgICBjb25zdCBjb250ZW50ID0gZG9jdW1lbnQuYm9keVxuXG4gICAgICBpZiAodGhpcy5vcHRpb25zLmFzaWRlW25hbWVdID09PSB0cnVlKSB7XG4gICAgICAgIGlmICghY29udGVudC5jbGFzc0xpc3QuY29udGFpbnMoYG9mZi1jYW52YXMtYXNpZGUtJHt0aGlzLmRpcmVjdGlvbn1gKSkge1xuICAgICAgICAgIGNvbnRlbnQuY2xhc3NMaXN0LmFkZChgb2ZmLWNhbnZhcy1hc2lkZS0ke3RoaXMuZGlyZWN0aW9ufWApXG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLnVzZUJhY2tkcm9wID0gZmFsc2VcblxuICAgICAgICAvLyBhdm9pZCBhbmltYXRpb24gYnkgc2V0dGluZyBhbmltYXRlIHRvIGZhbHNlXG4gICAgICAgIHRoaXMuYW5pbWF0ZSA9IGZhbHNlXG4gICAgICAgIHRoaXMuc2hvdygpXG4gICAgICAgIC8vIHJlbW92ZSBwcmV2aW91cyBiYWNrZHJvcFxuICAgICAgICB0aGlzLnJlbW92ZUJhY2tkcm9wKClcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGlmIChjb250ZW50LmNsYXNzTGlzdC5jb250YWlucyhgb2ZmLWNhbnZhcy1hc2lkZS0ke3RoaXMuZGlyZWN0aW9ufWApKSB7XG4gICAgICAgICAgY29udGVudC5jbGFzc0xpc3QucmVtb3ZlKGBvZmYtY2FudmFzLWFzaWRlLSR7dGhpcy5kaXJlY3Rpb259YClcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuaGlkZSgpXG4gICAgICAgIHRoaXMudXNlQmFja2Ryb3AgPSB0cnVlXG4gICAgICAgIHRoaXMuYW5pbWF0ZSA9IHRydWVcbiAgICAgIH1cbiAgICB9XG5cbiAgICBvbkVsZW1lbnRFdmVudChldmVudCkge1xuICAgICAgaWYgKGV2ZW50LnR5cGUgPT09ICdrZXl1cCcgJiYgZXZlbnQua2V5Q29kZSAhPT0gMjcgJiYgZXZlbnQua2V5Q29kZSAhPT0gMTMpIHtcbiAgICAgICAgcmV0dXJuXG4gICAgICB9XG5cbiAgICAgIC8vIGhpZGUgdGhlIG9mZi1jYW52YXNcbiAgICAgIHRoaXMuaGlkZSgpXG4gICAgfVxuXG4gICAgc2hvdygpIHtcbiAgICAgIGlmICh0aGlzLm9wdGlvbnMuZWxlbWVudC5jbGFzc0xpc3QuY29udGFpbnMoJ3Nob3cnKSkge1xuICAgICAgICByZXR1cm4gZmFsc2VcbiAgICAgIH1cblxuICAgICAgLy8gYWRkIGEgdGltZW91dCBzbyB0aGF0IHRoZSBDU1MgYW5pbWF0aW9uIHdvcmtzXG4gICAgICBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgICAgdGhpcy50cmlnZ2VyRXZlbnQoRXZlbnQuU0hPVylcblxuICAgICAgICBjb25zdCBvblNob3duID0gKCkgPT4ge1xuICAgICAgICAgIHRoaXMudHJpZ2dlckV2ZW50KEV2ZW50LlNIT1dOKVxuXG4gICAgICAgICAgaWYgKHRoaXMuYW5pbWF0ZSkge1xuICAgICAgICAgICAgdGhpcy5vcHRpb25zLmVsZW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcihFdmVudC5UUkFOU0lUSU9OX0VORCwgb25TaG93bilcbiAgICAgICAgICAgIHRoaXMub3B0aW9ucy5lbGVtZW50LmNsYXNzTGlzdC5yZW1vdmUoJ2FuaW1hdGUnKVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGlmICh0aGlzLnVzZUJhY2tkcm9wKSB7XG4gICAgICAgICAgdGhpcy5jcmVhdGVCYWNrZHJvcCgpXG4gICAgICAgIH1cblxuXG4gICAgICAgIGlmICh0aGlzLmFuaW1hdGUpIHtcbiAgICAgICAgICB0aGlzLm9wdGlvbnMuZWxlbWVudC5hZGRFdmVudExpc3RlbmVyKEV2ZW50LlRSQU5TSVRJT05fRU5ELCBvblNob3duKSAgICAgICAgXG4gICAgICAgICAgdGhpcy5vcHRpb25zLmVsZW1lbnQuY2xhc3NMaXN0LmFkZCgnYW5pbWF0ZScpXG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgLy8gZGlyZWN0bHkgdHJpZ2dlciB0aGUgb25TaG93blxuICAgICAgICAgIG9uU2hvd24oKVxuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5vcHRpb25zLmVsZW1lbnQuY2xhc3NMaXN0LmFkZCgnc2hvdycpICAgICAgICBcblxuICAgICAgICAvLyBhdHRhY2ggZXZlbnRcbiAgICAgICAgdGhpcy5hdHRhY2hFdmVudHMoKVxuICAgICAgfSwgMSlcblxuICAgICAgcmV0dXJuIHRydWVcbiAgICB9XG5cbiAgICBoaWRlKCkge1xuICAgICAgaWYgKCF0aGlzLm9wdGlvbnMuZWxlbWVudC5jbGFzc0xpc3QuY29udGFpbnMoJ3Nob3cnKSkge1xuICAgICAgICByZXR1cm4gZmFsc2VcbiAgICAgIH1cblxuICAgICAgdGhpcy50cmlnZ2VyRXZlbnQoRXZlbnQuSElERSlcblxuICAgICAgdGhpcy5kZXRhY2hFdmVudHMoKVxuXG4gICAgICBpZiAodGhpcy5hbmltYXRlKSB7XG4gICAgICAgIHRoaXMub3B0aW9ucy5lbGVtZW50LmNsYXNzTGlzdC5hZGQoJ2FuaW1hdGUnKVxuICAgICAgfVxuXG4gICAgICB0aGlzLm9wdGlvbnMuZWxlbWVudC5jbGFzc0xpc3QucmVtb3ZlKCdzaG93JylcblxuICAgICAgaWYgKHRoaXMudXNlQmFja2Ryb3ApIHtcbiAgICAgICAgY29uc3QgYmFja2Ryb3AgPSB0aGlzLmdldEJhY2tkcm9wKClcblxuICAgICAgICBjb25zdCBvbkhpZGRlbiA9ICgpID0+IHtcbiAgICAgICAgICBpZiAodGhpcy5hbmltYXRlKSB7XG4gICAgICAgICAgICB0aGlzLm9wdGlvbnMuZWxlbWVudC5jbGFzc0xpc3QucmVtb3ZlKCdhbmltYXRlJylcbiAgICAgICAgICB9XG5cbiAgICAgICAgICBiYWNrZHJvcC5yZW1vdmVFdmVudExpc3RlbmVyKEV2ZW50LlRSQU5TSVRJT05fRU5ELCBvbkhpZGRlbilcbiAgICAgICAgICB0aGlzLnRyaWdnZXJFdmVudChFdmVudC5ISURERU4pICAgICAgICBcbiAgICAgICAgICB0aGlzLnJlbW92ZUJhY2tkcm9wKClcbiAgICAgICAgfVxuXG4gICAgICAgIGJhY2tkcm9wLmFkZEV2ZW50TGlzdGVuZXIoRXZlbnQuVFJBTlNJVElPTl9FTkQsIG9uSGlkZGVuKVxuICAgICAgICBiYWNrZHJvcC5jbGFzc0xpc3QuYWRkKCdmYWRlb3V0JylcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIHRydWVcbiAgICB9XG5cbiAgICBjcmVhdGVCYWNrZHJvcCgpIHtcbiAgICAgIGNvbnN0IGJhY2tkcm9wID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2JylcbiAgICAgIGJhY2tkcm9wLnNldEF0dHJpYnV0ZSgnZGF0YS1pZCcsIHRoaXMuaWQpXG4gICAgICBiYWNrZHJvcC5jbGFzc0xpc3QuYWRkKEJBQ0tEUk9QX1NFTEVDVE9SKVxuXG4gICAgICBkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKGJhY2tkcm9wKVxuICAgIH1cblxuICAgIGdldEJhY2tkcm9wKCkge1xuICAgICAgcmV0dXJuIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoYC4ke0JBQ0tEUk9QX1NFTEVDVE9SfVtkYXRhLWlkPVwiJHt0aGlzLmlkfVwiXWApXG4gICAgfVxuXG4gICAgcmVtb3ZlQmFja2Ryb3AoKSB7XG4gICAgICBjb25zdCBiYWNrZHJvcCA9IHRoaXMuZ2V0QmFja2Ryb3AoKVxuICAgICAgaWYgKGJhY2tkcm9wKSB7XG4gICAgICAgIGRvY3VtZW50LmJvZHkucmVtb3ZlQ2hpbGQoYmFja2Ryb3ApXG4gICAgICB9XG4gICAgfVxuXG4gICAgYXR0YWNoRXZlbnRzKCkge1xuICAgICAgY29uc3QgZGlzbWlzc0J1dHRvbnMgPSB0aGlzLm9wdGlvbnMuZWxlbWVudC5xdWVyeVNlbGVjdG9yQWxsKCdbZGF0YS1kaXNtaXNzXScpXG5cbiAgICAgIGlmIChkaXNtaXNzQnV0dG9ucykge1xuICAgICAgICBBcnJheS5mcm9tKGRpc21pc3NCdXR0b25zKS5mb3JFYWNoKGJ1dHRvbiA9PiB0aGlzLnJlZ2lzdGVyRWxlbWVudCh7IHRhcmdldDogYnV0dG9uLCBldmVudDogJ2NsaWNrJyB9KSlcbiAgICAgIH1cblxuICAgICAgaWYgKHRoaXMudXNlQmFja2Ryb3ApIHtcbiAgICAgICAgY29uc3QgYmFja2Ryb3AgPSB0aGlzLmdldEJhY2tkcm9wKCkgICAgICBcbiAgICAgICAgdGhpcy5yZWdpc3RlckVsZW1lbnQoeyB0YXJnZXQ6IGJhY2tkcm9wLCBldmVudDogRXZlbnQuU1RBUlQgfSlcbiAgICAgIH1cblxuICAgICAgdGhpcy5yZWdpc3RlckVsZW1lbnQoeyB0YXJnZXQ6IGRvY3VtZW50LCBldmVudDogJ2tleXVwJyB9KVxuICAgIH1cblxuICAgIGRldGFjaEV2ZW50cygpIHtcbiAgICAgIGNvbnN0IGRpc21pc3NCdXR0b25zID0gdGhpcy5vcHRpb25zLmVsZW1lbnQucXVlcnlTZWxlY3RvckFsbCgnW2RhdGEtZGlzbWlzc10nKVxuXG4gICAgICBpZiAoZGlzbWlzc0J1dHRvbnMpIHtcbiAgICAgICAgQXJyYXkuZnJvbShkaXNtaXNzQnV0dG9ucykuZm9yRWFjaChidXR0b24gPT4gdGhpcy51bnJlZ2lzdGVyRWxlbWVudCh7IHRhcmdldDogYnV0dG9uLCBldmVudDogJ2NsaWNrJyB9KSlcbiAgICAgIH1cblxuICAgICAgaWYgKHRoaXMudXNlQmFja2Ryb3ApIHtcbiAgICAgICAgY29uc3QgYmFja2Ryb3AgPSB0aGlzLmdldEJhY2tkcm9wKClcbiAgICAgICAgdGhpcy51bnJlZ2lzdGVyRWxlbWVudCh7IHRhcmdldDogYmFja2Ryb3AsIGV2ZW50OiBFdmVudC5TVEFSVCB9KVxuICAgICAgfVxuXG4gICAgICB0aGlzLnVucmVnaXN0ZXJFbGVtZW50KHsgdGFyZ2V0OiBkb2N1bWVudCwgZXZlbnQ6ICdrZXl1cCcgfSlcbiAgICB9XG5cbiAgICBzdGF0aWMgaWRlbnRpZmllcigpIHtcbiAgICAgIHJldHVybiBOQU1FXG4gICAgfVxuXG4gICAgc3RhdGljIF9ET01JbnRlcmZhY2Uob3B0aW9ucykge1xuICAgICAgcmV0dXJuIHN1cGVyLl9ET01JbnRlcmZhY2UoT2ZmQ2FudmFzLCBvcHRpb25zKVxuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICogRE9NIEFwaSBpbXBsZW1lbnRhdGlvblxuICAgKiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICovXG4gIGNvbnN0IGNvbXBvbmVudHMgPSBbXVxuXG4gIGNvbnN0IG9mZkNhbnZhcyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoYC4ke05BTUV9YClcbiAgaWYgKG9mZkNhbnZhcykge1xuICAgIEFycmF5LmZyb20ob2ZmQ2FudmFzKS5mb3JFYWNoKChlbGVtZW50KSA9PiB7XG4gICAgICBjb25zdCBjb25maWcgPSBnZXRBdHRyaWJ1dGVzQ29uZmlnKGVsZW1lbnQsIERFRkFVTFRfUFJPUEVSVElFUywgREFUQV9BVFRSU19QUk9QRVJUSUVTKVxuICAgICAgY29uZmlnLmVsZW1lbnQgPSBlbGVtZW50XG5cbiAgICAgIGNvbXBvbmVudHMucHVzaCh7IGVsZW1lbnQsIG9mZkNhbnZhczogbmV3IE9mZkNhbnZhcyhjb25maWcpIH0pXG4gICAgfSlcbiAgfVxuXG4gIGlmIChvZmZDYW52YXMpIHtcbiAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIChldmVudCkgPT4ge1xuICAgICAgY29uc3QgdGFyZ2V0ID0gZmluZFRhcmdldEJ5QXR0cihldmVudC50YXJnZXQsICdkYXRhLXRvZ2dsZScpXG4gICAgICBpZiAoIXRhcmdldCkge1xuICAgICAgICByZXR1cm5cbiAgICAgIH1cblxuICAgICAgY29uc3QgZGF0YVRvZ2dsZUF0dHIgPSB0YXJnZXQuZ2V0QXR0cmlidXRlKCdkYXRhLXRvZ2dsZScpXG4gICAgICBpZiAoZGF0YVRvZ2dsZUF0dHIgJiYgZGF0YVRvZ2dsZUF0dHIgPT09IE5BTUUpIHtcbiAgICAgICAgY29uc3QgaWQgPSB0YXJnZXQuZ2V0QXR0cmlidXRlKCdkYXRhLXRhcmdldCcpXG4gICAgICAgIGNvbnN0IGVsZW1lbnQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKGlkKVxuXG4gICAgICAgIGNvbnN0IGNvbXBvbmVudCA9IGNvbXBvbmVudHMuZmluZChjID0+IGMuZWxlbWVudCA9PT0gZWxlbWVudClcblxuICAgICAgICBpZiAoIWNvbXBvbmVudCkge1xuICAgICAgICAgIHJldHVyblxuICAgICAgICB9XG5cbiAgICAgICAgdGFyZ2V0LmJsdXIoKVxuXG4gICAgICAgIGNvbXBvbmVudC5vZmZDYW52YXMuc2hvdygpXG4gICAgICB9XG4gICAgfSlcbiAgfVxuXG4gIHJldHVybiBPZmZDYW52YXNcbn0pKClcblxuZXhwb3J0IGRlZmF1bHQgT2ZmQ2FudmFzXG4iLCIvKipcbiAqIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gKiBMaWNlbnNlZCB1bmRlciBNSVQgKGh0dHBzOi8vZ2l0aHViLmNvbS9xdWFyay1kZXYvUGhvbm9uLUZyYW1ld29yay9ibG9iL21hc3Rlci9MSUNFTlNFKVxuICogLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAqL1xuaW1wb3J0IENvbXBvbmVudCBmcm9tICcuLi9jb21wb25lbnQnXG5pbXBvcnQgRXZlbnQgZnJvbSAnLi4vLi4vY29tbW9uL2V2ZW50cydcblxuY29uc3QgUHJvZ3Jlc3MgPSAoKCkgPT4ge1xuICAvKipcbiAgICogLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAqIENvbnN0YW50c1xuICAgKiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICovXG5cbiAgY29uc3QgTkFNRSA9ICdwcm9ncmVzcydcbiAgY29uc3QgVkVSU0lPTiA9ICcyLjAuMCdcbiAgY29uc3QgREVGQVVMVF9QUk9QRVJUSUVTID0ge1xuICAgIGVsZW1lbnQ6IG51bGwsXG4gICAgaGVpZ2h0OiA1LFxuICAgIG1pbjogMCxcbiAgICBtYXg6IDEwMCxcbiAgICBsYWJlbDogZmFsc2UsXG4gICAgc3RyaXBlZDogZmFsc2UsXG4gICAgYmFja2dyb3VuZDogbnVsbCxcbiAgfVxuICBjb25zdCBEQVRBX0FUVFJTX1BST1BFUlRJRVMgPSBbXG4gICAgJ2hlaWdodCcsXG4gICAgJ21pbicsXG4gICAgJ21heCcsXG4gICAgJ2xhYmVsJyxcbiAgICAnc3RyaXBlZCcsXG4gICAgJ2JhY2tncm91bmQnLFxuICBdXG5cbiAgLyoqXG4gICAqIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgKiBDbGFzcyBEZWZpbml0aW9uXG4gICAqIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgKi9cblxuICBjbGFzcyBQcm9ncmVzcyBleHRlbmRzIENvbXBvbmVudCB7XG5cbiAgICBjb25zdHJ1Y3RvcihvcHRpb25zID0ge30pIHtcbiAgICAgIHN1cGVyKE5BTUUsIFZFUlNJT04sIERFRkFVTFRfUFJPUEVSVElFUywgb3B0aW9ucywgREFUQV9BVFRSU19QUk9QRVJUSUVTLCBmYWxzZSwgZmFsc2UpXG5cbiAgICAgIC8vIHNldCB0aGUgd2FudGVkIGhlaWdodFxuICAgICAgdGhpcy5vcHRpb25zLmVsZW1lbnQuc3R5bGUuaGVpZ2h0ID0gYCR7dGhpcy5vcHRpb25zLmhlaWdodH1weGBcblxuICAgICAgLy8gc2V0IG1pbiBhbmQgbWF4IHZhbHVlc1xuICAgICAgY29uc3QgcHJvZ3Jlc3NCYXIgPSB0aGlzLmdldFByb2dyZXNzQmFyKClcbiAgICAgIHByb2dyZXNzQmFyLnNldEF0dHJpYnV0ZSgnYXJpYS12YWx1ZW1pbicsIGAke3RoaXMub3B0aW9ucy5taW59YClcbiAgICAgIHByb2dyZXNzQmFyLnNldEF0dHJpYnV0ZSgnYXJpYS12YWx1ZW1heCcsIGAke3RoaXMub3B0aW9ucy5tYXh9YClcblxuICAgICAgLy8gc2V0IHN0cmlwZWRcbiAgICAgIGlmICh0aGlzLm9wdGlvbnMuc3RyaXBlZFxuICAgICAgICAmJiAhcHJvZ3Jlc3NCYXIuY2xhc3NMaXN0LmNvbnRhaW5zKCdwcm9ncmVzcy1iYXItc3RyaXBlZCcpKSB7XG4gICAgICAgIHByb2dyZXNzQmFyLmNsYXNzTGlzdC5hZGQoJ3Byb2dyZXNzLWJhci1zdHJpcGVkJylcbiAgICAgIH1cblxuICAgICAgLy8gc2V0IGJhY2tncm91bmRcbiAgICAgIGlmICh0eXBlb2YgdGhpcy5vcHRpb25zLmJhY2tncm91bmQgPT09ICdzdHJpbmcnXG4gICAgICAgICYmICFwcm9ncmVzc0Jhci5jbGFzc0xpc3QuY29udGFpbnMoYGJnLSR7dGhpcy5vcHRpb25zLmJhY2tncm91bmR9YCkpIHtcbiAgICAgICAgcHJvZ3Jlc3NCYXIuY2xhc3NMaXN0LmFkZChgYmctJHt0aGlzLm9wdGlvbnMuYmFja2dyb3VuZH1gKVxuICAgICAgfVxuICAgIH1cblxuICAgIGdldFByb2dyZXNzQmFyKCkge1xuICAgICAgcmV0dXJuIHRoaXMub3B0aW9ucy5lbGVtZW50LnF1ZXJ5U2VsZWN0b3IoJy5wcm9ncmVzcy1iYXInKVxuICAgIH1cblxuICAgIHNldCh2YWx1ZSA9IDApIHtcbiAgICAgIGNvbnN0IHByb2dyZXNzQmFyID0gdGhpcy5nZXRQcm9ncmVzc0JhcigpXG4gICAgICBjb25zdCBwcm9ncmVzcyA9IE1hdGgucm91bmQoKHZhbHVlIC8gKHRoaXMub3B0aW9ucy5taW4gKyB0aGlzLm9wdGlvbnMubWF4KSkgKiAxMDApXG5cbiAgICAgIGlmICh2YWx1ZSA8IHRoaXMub3B0aW9ucy5taW4pIHtcbiAgICAgICAgY29uc29sZS5lcnJvcihgJHtOQU1FfS4gV2FybmluZywgJHt2YWx1ZX0gaXMgdW5kZXIgbWluIHZhbHVlLmApXG4gICAgICAgIHJldHVybiBmYWxzZVxuICAgICAgfVxuXG4gICAgICBpZiAodmFsdWUgPiB0aGlzLm9wdGlvbnMubWF4KSB7XG4gICAgICAgIGNvbnNvbGUuZXJyb3IoYCR7TkFNRX0uIFdhcm5pbmcsICR7dmFsdWV9IGlzIGFib3ZlIG1heCB2YWx1ZS5gKSAgICAgICAgICBcbiAgICAgICAgcmV0dXJuIGZhbHNlXG4gICAgICB9XG5cbiAgICAgIHByb2dyZXNzQmFyLnNldEF0dHJpYnV0ZSgnYXJpYS12YWx1ZW5vdycsIGAke3ZhbHVlfWApICAgICAgXG5cbiAgICAgIC8vIHNldCBsYWJlbFxuICAgICAgaWYgKHRoaXMub3B0aW9ucy5sYWJlbCkge1xuICAgICAgICBwcm9ncmVzc0Jhci5pbm5lckhUTUwgPSBgJHtwcm9ncmVzc30lYFxuICAgICAgfVxuXG4gICAgICAvLyBzZXQgcGVyY2VudGFnZVxuICAgICAgcHJvZ3Jlc3NCYXIuc3R5bGUud2lkdGggPSBgJHtwcm9ncmVzc30lYFxuXG4gICAgICByZXR1cm4gdHJ1ZVxuICAgIH1cblxuICAgIGFuaW1hdGUoc3RhcnRBbmltYXRpb24gPSB0cnVlKSB7XG4gICAgICBpZiAoIXRoaXMub3B0aW9ucy5zdHJpcGVkKSB7XG4gICAgICAgIGNvbnNvbGUuZXJyb3IoYCR7TkFNRX0uIEFuaW1hdGlvbiB3b3JrcyBvbmx5IHdpdGggc3RyaXBlZCBwcm9ncmVzcy5gKVxuICAgICAgICByZXR1cm4gZmFsc2VcbiAgICAgIH1cblxuICAgICAgY29uc3QgcHJvZ3Jlc3NCYXIgPSB0aGlzLmdldFByb2dyZXNzQmFyKClcblxuICAgICAgaWYgKHN0YXJ0QW5pbWF0aW9uXG4gICAgICAgICYmICFwcm9ncmVzc0Jhci5jbGFzc0xpc3QuY29udGFpbnMoJ3Byb2dyZXNzLWJhci1hbmltYXRlZCcpKSB7XG4gICAgICAgIHByb2dyZXNzQmFyLmNsYXNzTGlzdC5hZGQoJ3Byb2dyZXNzLWJhci1hbmltYXRlZCcpXG4gICAgICB9XG5cbiAgICAgIGlmICghc3RhcnRBbmltYXRpb25cbiAgICAgICAgJiYgcHJvZ3Jlc3NCYXIuY2xhc3NMaXN0LmNvbnRhaW5zKCdwcm9ncmVzcy1iYXItYW5pbWF0ZWQnKSkge1xuICAgICAgICBwcm9ncmVzc0Jhci5jbGFzc0xpc3QucmVtb3ZlKCdwcm9ncmVzcy1iYXItYW5pbWF0ZWQnKVxuICAgICAgfVxuXG4gICAgICByZXR1cm4gdHJ1ZVxuICAgIH1cblxuICAgIHNob3coKSB7XG4gICAgICB0aGlzLm9wdGlvbnMuZWxlbWVudC5zdHlsZS5oZWlnaHQgPSBgJHt0aGlzLm9wdGlvbnMuaGVpZ2h0fXB4YFxuICAgICAgdGhpcy50cmlnZ2VyRXZlbnQoRXZlbnQuU0hPVylcbiAgICAgIHRoaXMudHJpZ2dlckV2ZW50KEV2ZW50LlNIT1dOKVxuXG4gICAgICByZXR1cm4gdHJ1ZVxuICAgIH1cblxuICAgIGhpZGUoKSB7XG4gICAgICB0aGlzLm9wdGlvbnMuZWxlbWVudC5zdHlsZS5oZWlnaHQgPSAnMHB4J1xuICAgICAgdGhpcy50cmlnZ2VyRXZlbnQoRXZlbnQuSElERSlcbiAgICAgIHRoaXMudHJpZ2dlckV2ZW50KEV2ZW50LkhJRERFTilcblxuICAgICAgcmV0dXJuIHRydWVcbiAgICB9XG5cbiAgICBzdGF0aWMgaWRlbnRpZmllcigpIHtcbiAgICAgIHJldHVybiBOQU1FXG4gICAgfVxuXG4gICAgc3RhdGljIF9ET01JbnRlcmZhY2Uob3B0aW9ucykge1xuICAgICAgcmV0dXJuIHN1cGVyLl9ET01JbnRlcmZhY2UoUHJvZ3Jlc3MsIG9wdGlvbnMpXG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIFByb2dyZXNzXG59KSgpXG5cbmV4cG9ydCBkZWZhdWx0IFByb2dyZXNzXG4iLCIvKipcbiAqIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gKiBMaWNlbnNlZCB1bmRlciBNSVQgKGh0dHBzOi8vZ2l0aHViLmNvbS9xdWFyay1kZXYvUGhvbm9uLUZyYW1ld29yay9ibG9iL21hc3Rlci9MSUNFTlNFKVxuICogLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAqL1xuaW1wb3J0IENvbXBvbmVudCBmcm9tICcuLi9jb21wb25lbnQnXG5pbXBvcnQgeyBnZXRBdHRyaWJ1dGVzQ29uZmlnIH0gZnJvbSAnLi4vY29tcG9uZW50TWFuYWdlcidcbmltcG9ydCBFdmVudCBmcm9tICcuLi8uLi9jb21tb24vZXZlbnRzJ1xuaW1wb3J0IHsgZmluZFRhcmdldEJ5Q2xhc3MgfSBmcm9tICcuLi8uLi9jb21tb24vdXRpbHMnXG5cbmNvbnN0IFRhYiA9ICgoKSA9PiB7XG4gIC8qKlxuICAgKiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICogQ29uc3RhbnRzXG4gICAqIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgKi9cblxuICBjb25zdCBOQU1FID0gJ3RhYidcbiAgY29uc3QgVkVSU0lPTiA9ICcyLjAuMCdcbiAgY29uc3QgREVGQVVMVF9QUk9QRVJUSUVTID0ge1xuXG4gIH1cbiAgY29uc3QgREFUQV9BVFRSU19QUk9QRVJUSUVTID0gW1xuICBdXG4gIGNvbnN0IFRBQl9DT05URU5UX1NFTEVDVE9SID0gJy50YWItcGFuZSdcblxuICAvKipcbiAgICogLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAqIENsYXNzIERlZmluaXRpb25cbiAgICogLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAqL1xuXG4gIGNsYXNzIFRhYiBleHRlbmRzIENvbXBvbmVudCB7XG5cbiAgICBjb25zdHJ1Y3RvcihvcHRpb25zID0ge30pIHtcbiAgICAgIHN1cGVyKE5BTUUsIFZFUlNJT04sIERFRkFVTFRfUFJPUEVSVElFUywgb3B0aW9ucywgREFUQV9BVFRSU19QUk9QRVJUSUVTLCBmYWxzZSwgZmFsc2UpXG4gICAgfVxuXG4gICAgc2hvdygpIHtcbiAgICAgIGlmICh0aGlzLm9wdGlvbnMuZWxlbWVudC5jbGFzc0xpc3QuY29udGFpbnMoJ2FjdGl2ZScpKSB7XG4gICAgICAgIHJldHVybiBmYWxzZVxuICAgICAgfVxuXG4gICAgICBjb25zdCBpZCA9IHRoaXMub3B0aW9ucy5lbGVtZW50LmdldEF0dHJpYnV0ZSgnaHJlZicpXG4gICAgICBjb25zdCBuYXYgPSBmaW5kVGFyZ2V0QnlDbGFzcyh0aGlzLm9wdGlvbnMuZWxlbWVudCwgJ25hdicpXG4gICAgICBjb25zdCBuYXZUYWJzID0gbmF2ID8gbmF2LnF1ZXJ5U2VsZWN0b3JBbGwoYFtkYXRhLXRvZ2dsZT1cIiR7TkFNRX1cIl1gKSA6IG51bGxcblxuICAgICAgaWYgKG5hdlRhYnMpIHtcbiAgICAgICAgQXJyYXkuZnJvbShuYXZUYWJzKS5mb3JFYWNoKCh0YWIpID0+IHtcbiAgICAgICAgICBpZiAodGFiLmNsYXNzTGlzdC5jb250YWlucygnYWN0aXZlJykpIHtcbiAgICAgICAgICAgIHRhYi5jbGFzc0xpc3QucmVtb3ZlKCdhY3RpdmUnKVxuICAgICAgICAgIH1cbiAgICAgICAgICB0YWIuc2V0QXR0cmlidXRlKCdhcmlhLXNlbGVjdGVkJywgZmFsc2UpXG4gICAgICAgIH0pXG4gICAgICB9XG5cbiAgICAgIHRoaXMub3B0aW9ucy5lbGVtZW50LmNsYXNzTGlzdC5hZGQoJ2FjdGl2ZScpXG4gICAgICB0aGlzLm9wdGlvbnMuZWxlbWVudC5zZXRBdHRyaWJ1dGUoJ2FyaWEtc2VsZWN0ZWQnLCB0cnVlKVxuXG4gICAgICBjb25zdCB0YWJDb250ZW50ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihpZClcbiAgICAgIGNvbnN0IHRhYkNvbnRlbnRzID0gdGFiQ29udGVudC5wYXJlbnROb2RlLnF1ZXJ5U2VsZWN0b3JBbGwoVEFCX0NPTlRFTlRfU0VMRUNUT1IpXG5cbiAgICAgIGlmICh0YWJDb250ZW50cykge1xuICAgICAgICBBcnJheS5mcm9tKHRhYkNvbnRlbnRzKS5mb3JFYWNoKCh0YWIpID0+IHtcbiAgICAgICAgICBpZiAodGFiLmNsYXNzTGlzdC5jb250YWlucygnYWN0aXZlJykpIHtcbiAgICAgICAgICAgIHRhYi5jbGFzc0xpc3QucmVtb3ZlKCdhY3RpdmUnKVxuICAgICAgICAgIH1cbiAgICAgICAgfSlcbiAgICAgIH1cblxuICAgICAgdGFiQ29udGVudC5jbGFzc0xpc3QuYWRkKCdzaG93aW5nJylcblxuICAgICAgc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICAgIGNvbnN0IG9uU2hvd2VkID0gKCkgPT4ge1xuICAgICAgICAgIHRhYkNvbnRlbnQuY2xhc3NMaXN0LnJlbW92ZSgnYW5pbWF0ZScpXG4gICAgICAgICAgdGFiQ29udGVudC5jbGFzc0xpc3QuYWRkKCdhY3RpdmUnKVxuICAgICAgICAgIHRhYkNvbnRlbnQuY2xhc3NMaXN0LnJlbW92ZSgnc2hvd2luZycpXG4gICAgICAgICAgdGFiQ29udGVudC5yZW1vdmVFdmVudExpc3RlbmVyKEV2ZW50LlRSQU5TSVRJT05fRU5ELCBvblNob3dlZClcbiAgICAgICAgfVxuXG4gICAgICAgIHRhYkNvbnRlbnQuYWRkRXZlbnRMaXN0ZW5lcihFdmVudC5UUkFOU0lUSU9OX0VORCwgb25TaG93ZWQpXG5cbiAgICAgICAgdGFiQ29udGVudC5jbGFzc0xpc3QuYWRkKCdhbmltYXRlJylcblxuICAgICAgfSwgMjApXG5cbiAgICAgIHJldHVybiB0cnVlXG4gICAgfVxuXG4gICAgaGlkZSgpIHtcbiAgICAgIGlmICghdGhpcy5vcHRpb25zLmVsZW1lbnQuY2xhc3NMaXN0LmNvbnRhaW5zKCdhY3RpdmUnKSkge1xuICAgICAgICByZXR1cm4gZmFsc2VcbiAgICAgIH1cblxuICAgICAgaWYgKHRoaXMub3B0aW9ucy5lbGVtZW50LmNsYXNzTGlzdC5jb250YWlucygnYWN0aXZlJykpIHtcbiAgICAgICAgdGhpcy5vcHRpb25zLmVsZW1lbnQuY2xhc3NMaXN0LnJlbW92ZSgnYWN0aXZlJylcbiAgICAgIH1cblxuICAgICAgdGhpcy5vcHRpb25zLmVsZW1lbnQuc2V0QXR0cmlidXRlKCdhcmlhLXNlbGVjdGVkJywgZmFsc2UpXG5cbiAgICAgIGNvbnN0IGlkID0gdGhpcy5vcHRpb25zLmVsZW1lbnQuZ2V0QXR0cmlidXRlKCdocmVmJylcbiAgICAgIGNvbnN0IHRhYkNvbnRlbnQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKGlkKVxuXG4gICAgICBpZiAodGFiQ29udGVudC5jbGFzc0xpc3QuY29udGFpbnMoJ2FjdGl2ZScpKSB7XG4gICAgICAgIHRhYkNvbnRlbnQuY2xhc3NMaXN0LnJlbW92ZSgnYWN0aXZlJylcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIHRydWVcbiAgICB9XG5cbiAgICBzdGF0aWMgaWRlbnRpZmllcigpIHtcbiAgICAgIHJldHVybiBOQU1FXG4gICAgfVxuXG4gICAgc3RhdGljIF9ET01JbnRlcmZhY2Uob3B0aW9ucykge1xuICAgICAgcmV0dXJuIHN1cGVyLl9ET01JbnRlcmZhY2UoVGFiLCBvcHRpb25zKVxuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICogRE9NIEFwaSBpbXBsZW1lbnRhdGlvblxuICAgKiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICovXG4gIGNvbnN0IGNvbXBvbmVudHMgPSBbXVxuXG4gIGNvbnN0IHRhYnMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKGBbZGF0YS10b2dnbGU9XCIke05BTUV9XCJdYClcbiAgaWYgKHRhYnMpIHtcbiAgICBBcnJheS5mcm9tKHRhYnMpLmZvckVhY2goKGVsZW1lbnQpID0+IHtcbiAgICAgIC8vIGNvbnN0IGNvbmZpZyA9IHt9XG4gICAgICBjb25zdCBjb25maWcgPSBnZXRBdHRyaWJ1dGVzQ29uZmlnKGVsZW1lbnQsIERFRkFVTFRfUFJPUEVSVElFUywgREFUQV9BVFRSU19QUk9QRVJUSUVTKVxuICAgICAgY29uZmlnLmVsZW1lbnQgPSBlbGVtZW50XG5cbiAgICAgIGNvbXBvbmVudHMucHVzaChUYWIuX0RPTUludGVyZmFjZShjb25maWcpKVxuICAgIH0pXG4gIH1cblxuICBpZiAodGFicykge1xuICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKGV2ZW50KSA9PiB7XG4gICAgICBjb25zdCBkYXRhVG9nZ2xlQXR0ciA9IGV2ZW50LnRhcmdldC5nZXRBdHRyaWJ1dGUoJ2RhdGEtdG9nZ2xlJylcbiAgICAgIGlmIChkYXRhVG9nZ2xlQXR0ciAmJiBkYXRhVG9nZ2xlQXR0ciA9PT0gTkFNRSkge1xuICAgICAgICBjb25zdCBpZCA9IGV2ZW50LnRhcmdldC5nZXRBdHRyaWJ1dGUoJ2hyZWYnKVxuXG4gICAgICAgIGNvbnN0IGNvbXBvbmVudCA9IGNvbXBvbmVudHMuZmluZChjID0+IGMuZ2V0RWxlbWVudCgpLmdldEF0dHJpYnV0ZSgnaHJlZicpID09PSBpZClcblxuICAgICAgICBpZiAoIWNvbXBvbmVudCkge1xuICAgICAgICAgIHJldHVyblxuICAgICAgICB9XG5cbiAgICAgICAgY29tcG9uZW50LnNob3coKVxuICAgICAgfVxuICAgIH0pXG4gIH1cblxuICByZXR1cm4gVGFiXG59KSgpXG5cbmV4cG9ydCBkZWZhdWx0IFRhYlxuIiwiLyoqXG4qIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4qIExpY2Vuc2VkIHVuZGVyIE1JVCAoaHR0cHM6Ly9naXRodWIuY29tL3F1YXJrLWRldi9QaG9ub24tRnJhbWV3b3JrL2Jsb2IvbWFzdGVyL0xJQ0VOU0UpXG4qIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4qL1xuXG5jb25zdCBCaW5kZXIgPSAoKCkgPT4ge1xuICAvKipcbiAgKiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgKiBDb25zdGFudHNcbiAgKiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgKi9cblxuICBjb25zdCBOQU1FID0gJ2ludGwtYmluZGVyJ1xuICBjb25zdCBWRVJTSU9OID0gJzIuMC4wJ1xuXG4gIC8qKlxuICAgKiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICogQ2xhc3MgRGVmaW5pdGlvblxuICAgKiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICovXG5cbiAgY2xhc3MgQmluZGVyIHtcbiAgICBjb25zdHJ1Y3RvcihlbGVtZW50LCBkYXRhKSB7XG4gICAgICB0aGlzLmVsZW1lbnQgPSBlbGVtZW50XG4gICAgICB0aGlzLmRhdGEgPSBkYXRhXG5cbiAgICAgIGlmICghdGhpcy5pc0VsZW1lbnQodGhpcy5lbGVtZW50KSkge1xuICAgICAgICByZXR1cm5cbiAgICAgIH1cblxuICAgICAgLy8gYXJyYXkgb2YgSFRNTEVsZW1lbnRcbiAgICAgIGlmICh0aGlzLmVsZW1lbnQubGVuZ3RoICYmIHRoaXMuZWxlbWVudC5sZW5ndGggPiAwKSB7XG4gICAgICAgIHRoaXMuc2V0Tm9kZXModGhpcy5lbGVtZW50KVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgLy8gc2luZ2xlIEhUTUxFbGVtZW50XG4gICAgICAgIHRoaXMuc2V0Tm9kZSh0aGlzLmVsZW1lbnQpXG4gICAgICB9XG4gICAgfVxuXG4gICAgLy8gZ2V0dGVyc1xuXG4gICAgc3RhdGljIGdldCB2ZXJzaW9uKCkge1xuICAgICAgcmV0dXJuIGAke05BTUV9LiR7VkVSU0lPTn1gXG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQ2hlY2tzIGlmIHRoZSBnaXZlbiBhcmd1bWVudCBpcyBhIERPTSBlbGVtZW50XG4gICAgICogQHBhcmFtIHtIVE1MRWxlbWVudH0gdGhlIGFyZ3VtZW50IHRvIHRlc3RcbiAgICAgKiBAcmV0dXJuIHtib29sZWFufSB0cnVlIGlmIHRoZSBvYmplY3QgaXMgYSBET00gZWxlbWVudCwgZmFsc2Ugb3RoZXJ3aXNlXG4gICAgICovXG4gICAgaXNFbGVtZW50KGVsZW1lbnQpIHtcbiAgICAgIGlmIChlbGVtZW50ID09PSBudWxsKSB7XG4gICAgICAgIHJldHVybiBmYWxzZVxuICAgICAgfVxuICAgICAgcmV0dXJuICh0eXBlb2YgTm9kZSA9PT0gJ29iamVjdCcgPyBlbGVtZW50IGluc3RhbmNlb2YgTm9kZSA6IGVsZW1lbnQgJiYgdHlwZW9mIGVsZW1lbnQgPT09ICdvYmplY3QnICYmIHR5cGVvZiBlbGVtZW50Lm5vZGVUeXBlID09PSAnbnVtYmVyJyAmJiB0eXBlb2YgZWxlbWVudC5ub2RlTmFtZSA9PT0gJ3N0cmluZycpXG4gICAgfVxuXG4gICAgLyoqXG4gICAgKiBCaW5kcyBzb21lIHRleHQgdG8gdGhlIGdpdmVuIERPTSBlbGVtZW50XG4gICAgKiBAcGFyYW0ge0hUTUxFbGVtZW50fSBlbGVtZW50XG4gICAgKiBAcGFyYW0ge1N0cmluZ30gdGV4dFxuICAgICovXG4gICAgc2V0VGV4dChlbGVtZW50LCB0ZXh0KSB7XG4gICAgICBpZiAoISgndGV4dENvbnRlbnQnIGluIGVsZW1lbnQpKSB7XG4gICAgICAgIGVsZW1lbnQuaW5uZXJUZXh0ID0gdGV4dFxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgZWxlbWVudC50ZXh0Q29udGVudCA9IHRleHRcbiAgICAgIH1cbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBCaW5kcyBzb21lIGh0bWwgdG8gdGhlIGdpdmVuIERPTSBlbGVtZW50XG4gICAgICogQHBhcmFtIHtIVE1MRWxlbWVudH0gZWxlbWVudFxuICAgICAqIEBwYXJhbSB7c3RyaW5nfSB0ZXh0XG4gICAgICovXG4gICAgc2V0SHRtbChlbGVtZW50LCB0ZXh0KSB7XG4gICAgICBlbGVtZW50LmlubmVySFRNTCA9IHRleHRcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBCaW5kcyBjdXN0b20gYXR0cmlidXRlcyB0byB0aGUgZ2l2ZW4gRE9NIGVsZW1lbnRcbiAgICAgKiBAcGFyYW0ge0hUTUxFbGVtZW50fSBlbGVtZW50XG4gICAgICogQHBhcmFtIHtTdHJpbmd9IGF0dHJcbiAgICAgKiBAcGFyYW0ge1N0cmluZ30gdGV4dFxuICAgICAqL1xuICAgIHNldEF0dHJpYnV0ZShlbGVtZW50LCBhdHRyLCB0ZXh0KSB7XG4gICAgICBlbGVtZW50LnNldEF0dHJpYnV0ZShhdHRyLCB0ZXh0KVxuICAgIH1cblxuICAgIHNldE5vZGUoZWxlbWVudCkge1xuICAgICAgbGV0IGF0dHIgPSBlbGVtZW50LmdldEF0dHJpYnV0ZSgnZGF0YS1pMThuJylcbiAgICAgIGlmICghYXR0cikge1xuICAgICAgICByZXR1cm5cbiAgICAgIH1cblxuICAgICAgYXR0ciA9IGF0dHIudHJpbSgpXG5cbiAgICAgIGNvbnN0IHIgPSAvKD86XFxzfF4pKFtBLVphLXotXzAtOV0rKTpcXHMqKC4qPykoPz1cXHMrXFx3Kzp8JCkvZ1xuICAgICAgbGV0IG1cblxuICAgICAgd2hpbGUgKG0gPSByLmV4ZWMoYXR0cikpIHtcbiAgICAgICAgY29uc3Qga2V5ID0gbVsxXS50cmltKClcbiAgICAgICAgY29uc3QgdmFsdWUgPSBtWzJdLnRyaW0oKS5yZXBsYWNlKCcsJywgJycpXG4gICAgICAgIGxldCBpbnRsVmFsdWUgPSB0aGlzLmRhdGFbdmFsdWVdXG5cbiAgICAgICAgaWYgKCF0aGlzLmRhdGFbdmFsdWVdKSB7XG4gICAgICAgICAgY29uc29sZS5sb2coYCR7TkFNRX0uIFdhcm5pbmcsICR7dmFsdWV9IGRvZXMgbm90IGV4aXN0LmApXG4gICAgICAgICAgaW50bFZhbHVlID0gdmFsdWVcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IG1ldGhvZE5hbWUgPSAnc2V0JyArIGtleS5jaGFyQXQoMCkudG9VcHBlckNhc2UoKSArIGtleS5zbGljZSgxKVxuXG4gICAgICAgIGlmICh0aGlzW21ldGhvZE5hbWVdKSB7XG4gICAgICAgICAgdGhpc1ttZXRob2ROYW1lXShlbGVtZW50LCBpbnRsVmFsdWUpXG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgdGhpcy5zZXRBdHRyaWJ1dGUoZWxlbWVudCwga2V5LCBpbnRsVmFsdWUpXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG5cbiAgICAvKipcbiAgICAqIFNldCB2YWx1ZXMgdG8gRE9NIG5vZGVzXG4gICAgKi9cbiAgICBzZXROb2RlcyhlbGVtZW50KSB7XG4gICAgICBBcnJheS5mcm9tKGVsZW1lbnQpLmZvckVhY2goZWwgPT4gdGhpcy5zZXROb2RlKGVsKSlcbiAgICB9XG4gIH1cblxuICByZXR1cm4gQmluZGVyXG59KSgpXG5cbmV4cG9ydCBkZWZhdWx0IEJpbmRlclxuIiwiLyoqXG4gKiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICogTGljZW5zZWQgdW5kZXIgTUlUIChodHRwczovL2dpdGh1Yi5jb20vcXVhcmstZGV2L1Bob25vbi1GcmFtZXdvcmsvYmxvYi9tYXN0ZXIvTElDRU5TRSlcbiAqIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gKi9cbmltcG9ydCBCaW5kZXIgZnJvbSAnLi9iaW5kZXInXG5cbmNvbnN0IEludGwgPSAoKCkgPT4ge1xuICAvKipcbiAgICogLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAqIENvbnN0YW50c1xuICAgKiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICovXG5cbiAgY29uc3QgTkFNRSA9ICdJbnRsJ1xuICBjb25zdCBWRVJTSU9OID0gJzIuMC4wJ1xuICBjb25zdCBERUZBVUxUX1BST1BFUlRJRVMgPSB7XG4gICAgZmFsbGJhY2tMb2NhbGU6ICdlbicsXG4gICAgbG9jYWxlOiAnZW4nLFxuICAgIGF1dG9CaW5kOiB0cnVlLFxuICAgIGRhdGE6IG51bGwsXG4gIH1cblxuICAvKipcbiAgICogLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAqIENsYXNzIERlZmluaXRpb25cbiAgICogLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAqL1xuXG4gIGNsYXNzIEludGwge1xuICAgIC8qKlxuICAgICAqIENyZWF0ZXMgYW4gaW5zdGFuY2Ugb2YgSW50bC5cbiAgICAgKiBAcGFyYW0ge2ZhbGxiYWNrTG9jYWxlOiBzdHJpbmcsIGxvY2FsZTogc3RyaW5nLCBhdXRvQmluZDogYm9vbGVhbiwgZGF0YToge1tsYW5nOiBzdHJpbmddOiB7W2tleTogc3RyaW5nXTogc3RyaW5nfX19XG4gICAgICovXG4gICAgY29uc3RydWN0b3Iob3B0aW9ucyA9IHt9KSB7XG4gICAgICB0aGlzLm9wdGlvbnMgPSBPYmplY3QuYXNzaWduKERFRkFVTFRfUFJPUEVSVElFUywgb3B0aW9ucylcblxuICAgICAgaWYgKHR5cGVvZiB0aGlzLm9wdGlvbnMuZmFsbGJhY2tMb2NhbGUgIT09ICdzdHJpbmcnKSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcihgJHtOQU1FfS4gVGhlIGZhbGxiYWNrIGxvY2FsZSBpcyBtYW5kYXRvcnkgYW5kIG11c3QgYmUgYSBzdHJpbmcuYClcbiAgICAgIH1cblxuICAgICAgaWYgKHRoaXMub3B0aW9ucy5kYXRhID09PSBudWxsKSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcihgJHtOQU1FfS4gVGhlcmUgaXMgbm8gdHJhbnNsYXRpb24gZGF0YS5gKVxuICAgICAgfVxuXG4gICAgICBpZiAodHlwZW9mIHRoaXMub3B0aW9ucy5kYXRhW3RoaXMub3B0aW9ucy5mYWxsYmFja0xvY2FsZV0gIT09ICdvYmplY3QnKSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcihgJHtOQU1FfS4gVGhlIGZhbGxiYWNrIGxvY2FsZSBtdXN0IG5lY2Vzc2FyaWx5IGhhdmUgdHJhbnNsYXRpb24gZGF0YS5gKVxuICAgICAgfVxuXG4gICAgICB0aGlzLnNldExvY2FsZSh0aGlzLm9wdGlvbnMubG9jYWxlLCB0aGlzLm9wdGlvbnMuYXV0b0JpbmQpXG4gICAgfVxuXG4gICAgc3RhdGljIGdldCB2ZXJzaW9uKCkge1xuICAgICAgcmV0dXJuIGAke05BTUV9LiR7VkVSU0lPTn1gXG4gICAgfVxuXG4gICAgZ2V0TG9jYWxlKCkge1xuICAgICAgcmV0dXJuIHRoaXMub3B0aW9ucy5sb2NhbGVcbiAgICB9XG5cbiAgICBnZXRGYWxsYmFja0xvY2FsZSgpIHtcbiAgICAgIHJldHVybiB0aGlzLm9wdGlvbnMuZmFsbGJhY2tMb2NhbGVcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBTZXQgZGVmYXVsdCBsb2NhbGVcbiAgICAgKiBAcGFyYW0ge3N0cmluZ30gbG9jYWxlXG4gICAgICogQHBhcmFtIHtib29sZWFufSBbdXBkYXRlSFRNTD10cnVlXVxuICAgICAqL1xuICAgIHNldExvY2FsZShsb2NhbGUsIHVwZGF0ZUhUTUwgPSB0cnVlKSB7XG4gICAgICBpZiAodHlwZW9mIHRoaXMub3B0aW9ucy5kYXRhW2xvY2FsZV0gIT09ICdvYmplY3QnKSB7XG4gICAgICAgIGNvbnNvbGUuZXJyb3IoYCR7TkFNRX0uICR7bG9jYWxlfSBoYXMgbm8gZGF0YSwgZmFsbGJhY2sgaW4gJHt0aGlzLm9wdGlvbnMuZmFsbGJhY2tMb2NhbGV9LmApXG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLm9wdGlvbnMubG9jYWxlID0gbG9jYWxlXG4gICAgICB9XG5cbiAgICAgIGlmICh1cGRhdGVIVE1MKSB7XG4gICAgICAgIHRoaXMudXBkYXRlSHRtbCgpXG4gICAgICB9XG4gICAgfVxuXG4gICAgZ2V0TGFuZ3VhZ2VzKCkge1xuICAgICAgcmV0dXJuIE9iamVjdC5rZXlzKHRoaXMub3B0aW9ucy5kYXRhKVxuICAgIH1cblxuICAgIGluc2VydFZhbHVlcyh2YWx1ZSA9IG51bGwsIGluamVjdGFibGVWYWx1ZXMgPSB7fSkge1xuICAgICAgaWYgKHR5cGVvZiB2YWx1ZSAhPT0gJ3N0cmluZycpIHtcbiAgICAgICAgcmV0dXJuIHVuZGVmaW5lZFxuICAgICAgfVxuXG4gICAgICBjb25zdCBtYXRjaCA9IHZhbHVlLm1hdGNoKC86KFthLXpBLVotXzAtOV0rKS8pXG4gICAgICBpZiAobWF0Y2gpIHtcbiAgICAgICAgdmFsdWUgPSB2YWx1ZS5yZXBsYWNlKG1hdGNoWzBdLCBpbmplY3RhYmxlVmFsdWVzW21hdGNoWzFdXSlcbiAgICAgIH1cblxuICAgICAgaWYgKHZhbHVlLm1hdGNoKC86KFthLXpBLVotXzAtOV0rKS8pKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmluc2VydFZhbHVlcyh2YWx1ZSwgaW5qZWN0YWJsZVZhbHVlcylcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIHZhbHVlXG4gICAgfVxuXG4gICAgdHJhbnNsYXRlKGtleU5hbWUgPSBudWxsLCBpbmplY3QgPSB7fSkge1xuICAgICAgbGV0IGRhdGEgPSB0aGlzLm9wdGlvbnMuZGF0YVt0aGlzLm9wdGlvbnMubG9jYWxlXVxuICAgICAgaWYgKCFkYXRhKSB7XG4gICAgICAgIGRhdGEgPSB0aGlzLm9wdGlvbnMuZGF0YVt0aGlzLm9wdGlvbnMuZmFsbGJhY2tMb2NhbGVdXG4gICAgICB9XG5cbiAgICAgIGlmIChrZXlOYW1lID09PSBudWxsIHx8IGtleU5hbWUgPT09ICcqJyB8fCBBcnJheS5pc0FycmF5KGtleU5hbWUpKSB7XG4gICAgICAgIGlmIChBcnJheS5pc0FycmF5KGtleU5hbWUpKSB7XG4gICAgICAgICAgY29uc3Qga2V5cyA9IE9iamVjdC5rZXlzKGRhdGEpLmZpbHRlcihrZXkgPT4ga2V5TmFtZS5pbmRleE9mKGtleSkgPiAtMSlcbiAgICAgICAgICBjb25zdCBmaWx0ZXJlZERhdGEgPSB7fVxuICAgICAgICAgIGtleXMuZm9yRWFjaChrZXkgPT4ge1xuICAgICAgICAgICAgZmlsdGVyZWREYXRhW2tleV0gPSB0aGlzLmluc2VydFZhbHVlcyhkYXRhW2tleV0sIGluamVjdClcbiAgICAgICAgICB9KVxuICAgICAgICAgIGRhdGEgPSBmaWx0ZXJlZERhdGFcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IGRhdGFNYXAgPSB7fVxuICAgICAgICBmb3IgKGNvbnN0IGtleSBpbiBkYXRhKSB7XG4gICAgICAgICAgZGF0YU1hcFtrZXldID0gdGhpcy5pbnNlcnRWYWx1ZXMoZGF0YVtrZXldLCBpbmplY3QpXG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gZGF0YU1hcFxuICAgICAgfVxuXG4gICAgICByZXR1cm4gdGhpcy5pbnNlcnRWYWx1ZXMoZGF0YVtrZXlOYW1lXSwgaW5qZWN0KVxuICAgIH1cblxuICAgIC8vIGFsaWFzIG9mIHQoKVxuICAgIHQoa2V5TmFtZSA9IG51bGwsIGluamVjdCA9IHt9KSB7XG4gICAgICByZXR1cm4gdGhpcy50cmFuc2xhdGUoa2V5TmFtZSwgaW5qZWN0KVxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFVwZGF0ZXMgdGhlIEhUTUwgdmlld3NcbiAgICAgKiBAcGFyYW0ge0hUTUxFbGVtZW50fSBlbGVtZW50XG4gICAgICovXG4gICAgdXBkYXRlSHRtbChlbGVtZW50KSB7XG4gICAgICBpZiAodHlwZW9mIGVsZW1lbnQgPT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgIGVsZW1lbnQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCdbZGF0YS1pMThuXScpXG4gICAgICB9XG5cbiAgICAgIGlmICh0eXBlb2YgZWxlbWVudCA9PT0gJ3N0cmluZycpIHtcbiAgICAgICAgZWxlbWVudCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoZWxlbWVudClcbiAgICAgIH1cblxuICAgICAgbmV3IEJpbmRlcihlbGVtZW50LCB0aGlzLnQoKSlcbiAgICB9XG5cbiAgICAvLyBzdGF0aWNcbiAgICBzdGF0aWMgX0RPTUludGVyZmFjZShvcHRpb25zKSB7XG4gICAgICByZXR1cm4gbmV3IEludGwob3B0aW9ucylcbiAgICB9XG4gIH1cblxuICByZXR1cm4gSW50bFxufSkoKVxuXG5leHBvcnQgZGVmYXVsdCBJbnRsXG4iLCIvKipcbiAqIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gKiBMaWNlbnNlZCB1bmRlciBNSVQgKGh0dHBzOi8vZ2l0aHViLmNvbS9xdWFyay1kZXYvUGhvbm9uLUZyYW1ld29yay9ibG9iL21hc3Rlci9MSUNFTlNFKVxuICogLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAqL1xuXG5pbXBvcnQgUGFnZSBmcm9tICcuL3BhZ2UnXG5pbXBvcnQgRXZlbnQgZnJvbSAnLi4vLi4vY29tbW9uL2V2ZW50cydcblxuY29uc3QgUGFnZXIgPSAoKCkgPT4ge1xuICAvKipcbiAgICogLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAqIENvbnN0YW50c1xuICAgKiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICovXG5cbiAgY29uc3QgTkFNRSA9ICdwYWdlcidcbiAgY29uc3QgVkVSU0lPTiA9ICcyLjAuMCdcbiAgY29uc3QgREVGQVVMVF9QUk9QRVJUSUVTID0ge1xuICAgIGhhc2hQcmVmaXg6ICcjIScsXG4gICAgdXNlSGFzaDogdHJ1ZSxcbiAgICBkZWZhdWx0UGFnZTogbnVsbCxcbiAgICBhbmltYXRlUGFnZXM6IHRydWUsXG4gIH1cblxuICBsZXQgY3VycmVudFBhZ2VcbiAgLyoqXG4gICAqIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgKiBDbGFzcyBEZWZpbml0aW9uXG4gICAqIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgKi9cblxuICBjbGFzcyBQYWdlciB7XG4gICAgLyoqXG4gICAgICogQGNvbnN0cnVjdG9yXG4gICAgICpcbiAgICAgKiBAcGFyYW0gb3B0aW9ucyB7T2JqZWN0fVxuICAgICAqL1xuICAgIGNvbnN0cnVjdG9yKG9wdGlvbnMgPSB7fSkge1xuICAgICAgdGhpcy5vcHRpb25zID0gT2JqZWN0LmFzc2lnbihERUZBVUxUX1BST1BFUlRJRVMsIG9wdGlvbnMpXG5cbiAgICAgIHRoaXMucGFnZXMgPSBbXVxuICAgICAgdGhpcy5zdGFydGVkID0gZmFsc2VcblxuICAgICAgLy8gYWRkIGdsb2JhbCBsaXN0ZW5lcnMgc3VjaCBhc2ggaGFzaCBjaGFuZ2UsIG5hdmlnYXRpb24sIGV0Yy5cbiAgICAgIHRoaXMuYWRkUGFnZXJFdmVudHMoKVxuXG4gICAgICAvLyBmYXN0ZXIgd2F5IHRvIGluaXQgcGFnZXMgYmVmb3JlIHRoZSBET00gaXMgcmVhZHlcbiAgICAgIHRoaXMub25ET01Mb2FkZWQoKVxuICAgIH1cblxuICAgIC8vIHByaXZhdGVcbiAgICBfKHNlbGVjdG9yKSB7XG4gICAgICByZXR1cm4gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihzZWxlY3RvcilcbiAgICB9XG5cbiAgICBnZXRIYXNoKCkge1xuICAgICAgcmV0dXJuIHdpbmRvdy5sb2NhdGlvbi5oYXNoLnNwbGl0KHRoaXMub3B0aW9ucy5oYXNoUHJlZml4KVsxXVxuICAgIH1cblxuICAgIGdldFBhZ2VGcm9tSGFzaCgpIHtcbiAgICAgIGNvbnN0IGhhc2ggPSB0aGlzLmdldEhhc2goKVxuICAgICAgY29uc3QgcmUgPSBuZXcgUmVnRXhwKCdbP1xcL10oW15cXC9dKiknKVxuICAgICAgY29uc3QgbWF0Y2hlcyA9IHJlLmV4ZWMoaGFzaClcblxuICAgICAgaWYgKG1hdGNoZXMgJiYgbWF0Y2hlc1sxXSkge1xuICAgICAgICByZXR1cm4gbWF0Y2hlc1sxXVxuICAgICAgfVxuXG4gICAgICByZXR1cm4gbnVsbFxuICAgIH1cblxuICAgIHNldEhhc2gocGFnZU5hbWUpIHtcbiAgICAgIHdpbmRvdy5sb2NhdGlvbi5oYXNoID0gYCR7dGhpcy5vcHRpb25zLmhhc2hQcmVmaXh9LyR7cGFnZU5hbWV9YFxuICAgIH1cblxuICAgIGFyZVNhbWVQYWdlKHBhZ2VOYW1lMSwgcGFnZU5hbWUyKSB7XG4gICAgICBjb25zdCBwYWdlMSA9IHRoaXMuZ2V0UGFnZU1vZGVsKHBhZ2VOYW1lMSlcbiAgICAgIGNvbnN0IHBhZ2UyID0gdGhpcy5nZXRQYWdlTW9kZWwocGFnZU5hbWUyKVxuICAgICAgcmV0dXJuIHBhZ2UxICYmIHBhZ2UyICYmIHBhZ2UxLm5hbWUgPT09IHBhZ2UyLm5hbWVcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBBdHRhY2hlcyB0aGUgbWFpbiBldmVudHMgZm9yIHRyYWNraW5nIGhhc2ggY2hhbmdlcyxcbiAgICAgKiBjbGljayBvbiBuYXZpZ2F0aW9uIGJ1dHRvbnMgYW5kIGxpbmtzIGFuZCBiYWNrIGhpc3RvcnlcbiAgICAgKi9cbiAgICBhZGRQYWdlckV2ZW50cygpIHtcbiAgICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgZXZlbnQgPT4gdGhpcy5vbkNsaWNrKGV2ZW50KSlcbiAgICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdwb3BzdGF0ZScsIGV2ZW50ID0+IHRoaXMub25CYWNrSGlzdG9yeShldmVudCkpXG4gICAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcignaGFzaGNoYW5nZScsIGV2ZW50ID0+IHRoaXMub25IYXNoQ2hhbmdlKGV2ZW50KSlcbiAgICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ0RPTUNvbnRlbnRMb2FkZWQnLCBldmVudCA9PiB0aGlzLm9uRE9NTG9hZGVkKGV2ZW50KSlcbiAgICB9XG5cbiAgICAvLyBnZXR0ZXJzXG5cbiAgICBzdGF0aWMgZ2V0IHZlcnNpb24oKSB7XG4gICAgICByZXR1cm4gYCR7TkFNRX0uJHtWRVJTSU9OfWBcbiAgICB9XG5cbiAgICAvLyBwdWJsaWNcblxuICAgIHNob3dQYWdlKHBhZ2VOYW1lLCBhZGRUb0hpc3RvcnkgPSB0cnVlLCBiYWNrID0gZmFsc2UpIHtcbiAgICAgIGNvbnN0IG9sZFBhZ2UgPSB0aGlzLl8oJy5jdXJyZW50JylcbiAgICAgIGlmIChvbGRQYWdlKSB7XG4gICAgICAgIGNvbnN0IG9sZFBhZ2VOYW1lID0gb2xkUGFnZS5nZXRBdHRyaWJ1dGUoJ2RhdGEtcGFnZScpXG5cbiAgICAgICAgaWYgKHRoaXMuYXJlU2FtZVBhZ2UocGFnZU5hbWUsIG9sZFBhZ2VOYW1lKSkge1xuICAgICAgICAgIHJldHVyblxuICAgICAgICB9XG5cbiAgICAgICAgb2xkUGFnZS5jbGFzc0xpc3QucmVtb3ZlKCdjdXJyZW50JylcblxuICAgICAgICAvLyBoaXN0b3J5XG4gICAgICAgIHdpbmRvdy5oaXN0b3J5LnJlcGxhY2VTdGF0ZSh7IHBhZ2U6IG9sZFBhZ2VOYW1lIH0sIG9sZFBhZ2VOYW1lLCB3aW5kb3cubG9jYXRpb24uaHJlZilcblxuICAgICAgICB0aGlzLnRyaWdnZXJQYWdlRXZlbnQob2xkUGFnZU5hbWUsIEV2ZW50LkhJREUpXG4gICAgICB9XG5cbiAgICAgIHRoaXMudHJpZ2dlclBhZ2VFdmVudChwYWdlTmFtZSwgRXZlbnQuU0hPVylcblxuICAgICAgY3VycmVudFBhZ2UgPSBwYWdlTmFtZVxuXG4gICAgICAvLyBuZXcgcGFnZVxuICAgICAgY29uc3QgbmV3UGFnZSA9IHRoaXMuXyhgW2RhdGEtcGFnZT1cIiR7cGFnZU5hbWV9XCJdYClcblxuICAgICAgbmV3UGFnZS5jbGFzc0xpc3QuYWRkKCdjdXJyZW50JylcblxuICAgICAgLy8gdGVtcGxhdGUgbG9hZGVyXG4gICAgICBjb25zdCBwYWdlTW9kZWwgPSB0aGlzLmdldFBhZ2VNb2RlbChwYWdlTmFtZSlcblxuICAgICAgLy8gQHRvZG86IHVzZSB0ZW1wbGF0ZSBjYWNoZT9cbiAgICAgIGlmIChwYWdlTW9kZWwgJiYgcGFnZU1vZGVsLmdldFRlbXBsYXRlKCkpIHtcbiAgICAgICAgcGFnZU1vZGVsLmxvYWRUZW1wbGF0ZSgpXG4gICAgICB9XG4gICAgICAvLyBlbmRcblxuICAgICAgaWYgKG9sZFBhZ2UpIHtcbiAgICAgICAgY29uc3Qgb2xkUGFnZU5hbWUgPSBvbGRQYWdlLmdldEF0dHJpYnV0ZSgnZGF0YS1wYWdlJylcbiAgICAgICAgLy8gdXNlIG9mIHByb3RvdHlwZS1vcmllbnRlZCBsYW5ndWFnZVxuICAgICAgICBvbGRQYWdlLmJhY2sgPSBiYWNrXG4gICAgICAgIG9sZFBhZ2UucHJldmlvdXNQYWdlTmFtZSA9IG9sZFBhZ2VOYW1lXG5cbiAgICAgICAgY29uc3Qgb25QYWdlQW5pbWF0aW9uRW5kID0gKCkgPT4ge1xuICAgICAgICAgIGlmIChvbGRQYWdlLmNsYXNzTGlzdC5jb250YWlucygnYW5pbWF0ZScpKSB7XG4gICAgICAgICAgICBvbGRQYWdlLmNsYXNzTGlzdC5yZW1vdmUoJ2FuaW1hdGUnKVxuICAgICAgICAgIH1cblxuICAgICAgICAgIG9sZFBhZ2UuY2xhc3NMaXN0LnJlbW92ZShvbGRQYWdlLmJhY2sgPyAncG9wLXBhZ2UnIDogJ3B1c2gtcGFnZScpXG5cbiAgICAgICAgICB0aGlzLnRyaWdnZXJQYWdlRXZlbnQoY3VycmVudFBhZ2UsIEV2ZW50LlNIT1dOKVxuICAgICAgICAgIHRoaXMudHJpZ2dlclBhZ2VFdmVudChvbGRQYWdlLnByZXZpb3VzUGFnZU5hbWUsIEV2ZW50LkhJRERFTilcblxuICAgICAgICAgIG9sZFBhZ2UucmVtb3ZlRXZlbnRMaXN0ZW5lcihFdmVudC5BTklNQVRJT05fRU5ELCBvblBhZ2VBbmltYXRpb25FbmQpXG4gICAgICAgIH1cblxuICAgICAgICBpZiAodGhpcy5vcHRpb25zLmFuaW1hdGVQYWdlcykge1xuICAgICAgICAgIG9sZFBhZ2UuYWRkRXZlbnRMaXN0ZW5lcihFdmVudC5BTklNQVRJT05fRU5ELCBvblBhZ2VBbmltYXRpb25FbmQpXG4gICAgICAgICAgb2xkUGFnZS5jbGFzc0xpc3QuYWRkKCdhbmltYXRlJylcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBvblBhZ2VBbmltYXRpb25FbmQoKVxuICAgICAgICB9XG5cbiAgICAgICAgb2xkUGFnZS5jbGFzc0xpc3QuYWRkKGJhY2sgPyAncG9wLXBhZ2UnIDogJ3B1c2gtcGFnZScpXG4gICAgICB9XG4gICAgfVxuXG4gICAgYWRkVW5pcXVlUGFnZU1vZGVsKHBhZ2VOYW1lKSB7XG4gICAgICBpZiAoIXRoaXMuZ2V0UGFnZU1vZGVsKHBhZ2VOYW1lKSkge1xuICAgICAgICB0aGlzLnBhZ2VzLnB1c2gobmV3IFBhZ2UocGFnZU5hbWUpKVxuICAgICAgfVxuICAgIH1cblxuICAgIGdldFBhZ2VNb2RlbChwYWdlTmFtZSkge1xuICAgICAgcmV0dXJuIHRoaXMucGFnZXMuZmluZChwYWdlID0+IHBhZ2UubmFtZSA9PT0gcGFnZU5hbWUpXG4gICAgfVxuXG4gICAgZ2V0UGFnZXNNb2RlbChwYWdlTmFtZXMpIHtcbiAgICAgIHJldHVybiB0aGlzLnBhZ2VzLmZpbHRlcihwYWdlID0+IHBhZ2VOYW1lcy5pbmRleE9mKHBhZ2UubmFtZSkgPiAtMSlcbiAgICB9XG5cbiAgICBzZWxlY3RvclRvQXJyYXkoc3RyKSB7XG4gICAgICByZXR1cm4gc3RyLnNwbGl0KCcsJykubWFwKGl0ZW0gPT4gaXRlbS50cmltKCkpXG4gICAgfVxuXG4gICAgYWRkRXZlbnRzKGNhbGxiYWNrKSB7XG4gICAgICBpZiAodGhpcy5jYWNoZVBhZ2VTZWxlY3RvciA9PT0gJyonKSB7XG4gICAgICAgIC8vIGFkZCB0byBhbGwgcGFnZSBtb2RlbHNcbiAgICAgICAgdGhpcy5wYWdlcy5mb3JFYWNoKChwYWdlKSA9PiB7XG4gICAgICAgICAgcGFnZS5hZGRFdmVudENhbGxiYWNrKGNhbGxiYWNrKVxuICAgICAgICB9KVxuICAgICAgICByZXR1cm5cbiAgICAgIH1cblxuICAgICAgY29uc3QgcGFnZU1vZGVscyA9IHRoaXMuZ2V0UGFnZXNNb2RlbCh0aGlzLnNlbGVjdG9yVG9BcnJheSh0aGlzLmNhY2hlUGFnZVNlbGVjdG9yKSwgdHJ1ZSlcbiAgICAgIHBhZ2VNb2RlbHMuZm9yRWFjaCgocGFnZSkgPT4ge1xuICAgICAgICBwYWdlLmFkZEV2ZW50Q2FsbGJhY2soY2FsbGJhY2spXG4gICAgICB9KVxuICAgICAgdGhpcy5jYWNoZVBhZ2VTZWxlY3RvciA9IG51bGxcbiAgICB9XG5cbiAgICB1c2VUZW1wbGF0ZSh0ZW1wbGF0ZVBhdGgsIHJlbmRlckZ1bmN0aW9uID0gbnVsbCkge1xuICAgICAgY29uc3QgcGFnZU1vZGVscyA9IHRoaXMuZ2V0UGFnZXNNb2RlbCh0aGlzLnNlbGVjdG9yVG9BcnJheSh0aGlzLmNhY2hlUGFnZVNlbGVjdG9yKSwgdHJ1ZSlcbiAgICAgIHBhZ2VNb2RlbHMuZm9yRWFjaCgocGFnZSkgPT4ge1xuICAgICAgICBwYWdlLnVzZVRlbXBsYXRlKHRlbXBsYXRlUGF0aClcbiAgICAgICAgaWYgKHR5cGVvZiByZW5kZXJGdW5jdGlvbiA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICAgIHBhZ2UudXNlVGVtcGxhdGVSZW5kZXJlcihyZW5kZXJGdW5jdGlvbilcbiAgICAgICAgfVxuICAgICAgfSlcbiAgICAgIHRoaXMuY2FjaGVQYWdlU2VsZWN0b3IgPSBudWxsXG4gICAgfVxuXG4gICAgdHJpZ2dlclBhZ2VFdmVudChwYWdlTmFtZSwgZXZlbnROYW1lLCBldmVudFBhcmFtcyA9IG51bGwpIHtcbiAgICAgIGNvbnN0IHBhZ2VNb2RlbCA9IHRoaXMuZ2V0UGFnZU1vZGVsKHBhZ2VOYW1lKVxuICAgICAgaWYgKHBhZ2VNb2RlbCkge1xuICAgICAgICBwYWdlTW9kZWwudHJpZ2dlclNjb3BlcyhldmVudE5hbWUsIGV2ZW50UGFyYW1zKVxuICAgICAgfVxuICAgIH1cblxuICAgIG9uQ2xpY2soZXZlbnQpIHtcbiAgICAgIGNvbnN0IHBhZ2VOYW1lID0gZXZlbnQudGFyZ2V0LmdldEF0dHJpYnV0ZSgnZGF0YS1uYXZpZ2F0ZScpXG4gICAgICBjb25zdCBwdXNoUGFnZSA9ICEoZXZlbnQudGFyZ2V0LmdldEF0dHJpYnV0ZSgnZGF0YS1wb3AtcGFnZScpID09PSAndHJ1ZScpXG5cbiAgICAgIGlmIChwYWdlTmFtZSkge1xuICAgICAgICBpZiAocGFnZU5hbWUgPT09ICckYmFjaycpIHtcbiAgICAgICAgICAvLyB0aGUgcG9wc3RhdGUgZXZlbnQgd2lsbCBiZSB0cmlnZ2VyZWRcbiAgICAgICAgICB3aW5kb3cuaGlzdG9yeS5iYWNrKClcbiAgICAgICAgICByZXR1cm5cbiAgICAgICAgfVxuXG4gICAgICAgIC8qXG4gICAgICAgICAqIElmIHdlIGhlIHVzZSB0aGUgaGFzaCBhcyB0cmlnZ2VyLFxuICAgICAgICAgKiB3ZSBjaGFuZ2UgaXQgZHluYW1pY2FsbHkgc28gdGhhdCB0aGUgaGFzaGNoYW5nZSBldmVudCBpcyBjYWxsZWRcbiAgICAgICAgICogT3RoZXJ3aXNlLCB3ZSBzaG93IHRoZSBwYWdlXG4gICAgICAgICAqL1xuICAgICAgICBpZiAodGhpcy5vcHRpb25zLnVzZUhhc2gpIHtcbiAgICAgICAgICB0aGlzLnNldEhhc2gocGFnZU5hbWUpXG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgdGhpcy5zaG93UGFnZShwYWdlTmFtZSwgdHJ1ZSwgcHVzaFBhZ2UpXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG5cbiAgICBvbkJhY2tIaXN0b3J5KGV2ZW50ID0ge30pIHtcbiAgICAgIGNvbnN0IHBhZ2VOYW1lID0gZXZlbnQuc3RhdGUgPyBldmVudC5zdGF0ZS5wYWdlIDogbnVsbFxuICAgICAgaWYgKCFwYWdlTmFtZSkge1xuICAgICAgICByZXR1cm5cbiAgICAgIH1cblxuICAgICAgdGhpcy5zaG93UGFnZShwYWdlTmFtZSwgdHJ1ZSwgdHJ1ZSlcbiAgICB9XG5cbiAgICBvbkhhc2hDaGFuZ2UoKSB7XG4gICAgICBjb25zdCBwYXJhbXMgPSAodGhpcy5nZXRIYXNoKCkgPyB0aGlzLmdldEhhc2goKS5zcGxpdCgnLycpIDogW10pLmZpbHRlcihwID0+IHAubGVuZ3RoID4gMClcbiAgICAgIGlmIChwYXJhbXMubGVuZ3RoID4gMCkge1xuICAgICAgICAvLyByZW1vdmUgZmlyc3QgdmFsdWUgd2hpY2ggaXMgdGhlIHBhZ2UgbmFtZVxuICAgICAgICBwYXJhbXMuc2hpZnQoKVxuICAgICAgfVxuXG4gICAgICB0aGlzLnRyaWdnZXJQYWdlRXZlbnQoY3VycmVudFBhZ2UsIEV2ZW50LkhBU0gsIHBhcmFtcylcblxuICAgICAgY29uc3QgbmF2UGFnZSA9IHRoaXMuZ2V0UGFnZUZyb21IYXNoKClcbiAgICAgIGlmIChuYXZQYWdlKSB7XG4gICAgICAgIHRoaXMuc2hvd1BhZ2UobmF2UGFnZSlcbiAgICAgIH1cbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBRdWVyaWVzIHRoZSBwYWdlIG5vZGVzIGluIHRoZSBET01cbiAgICAgKi9cbiAgICBvbkRPTUxvYWRlZCgpIHtcbiAgICAgIGNvbnN0IHBhZ2VzID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnW2RhdGEtcGFnZV0nKVxuXG4gICAgICBpZiAoIXBhZ2VzKSB7XG4gICAgICAgIHJldHVyblxuICAgICAgfVxuXG4gICAgICBwYWdlcy5mb3JFYWNoKChwYWdlKSA9PiB7XG4gICAgICAgIGxldCBwYWdlTmFtZSA9IHBhZ2UuZ2V0QXR0cmlidXRlKCdkYXRhLXBhZ2UnKVxuICAgICAgICAvKlxuICAgICAgICAgKiB0aGUgcGFnZSBuYW1lIGNhbiBiZSBnaXZlbiB3aXRoIHRoZSBhdHRyaWJ1dGUgZGF0YS1wYWdlXG4gICAgICAgICAqIG9yIHdpdGggaXRzIG5vZGUgbmFtZVxuICAgICAgICAgKi9cbiAgICAgICAgaWYgKCFwYWdlTmFtZSkge1xuICAgICAgICAgIHBhZ2VOYW1lID0gcGFnZS5ub2RlTmFtZVxuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5hZGRVbmlxdWVQYWdlTW9kZWwocGFnZU5hbWUpXG4gICAgICB9KVxuICAgIH1cblxuICAgIHNlbGVjdChwYWdlTmFtZSwgYWRkUGFnZU1vZGVsID0gdHJ1ZSkge1xuICAgICAgdGhpcy5jYWNoZVBhZ2VTZWxlY3RvciA9IHBhZ2VOYW1lXG5cbiAgICAgIGlmIChhZGRQYWdlTW9kZWwgJiYgcGFnZU5hbWUgIT09ICcqJykge1xuICAgICAgICB0aGlzLmFkZFVuaXF1ZVBhZ2VNb2RlbChwYWdlTmFtZSlcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIHRoaXNcbiAgICB9XG5cbiAgICBzdGFydChmb3JjZURlZmF1bHRQYWdlID0gZmFsc2UpIHtcbiAgICAgIC8vIGNoZWNrIGlmIHRoZSBhcHAgaGFzIGJlZW4gYWxyZWFkeSBzdGFydGVkXG4gICAgICBpZiAodGhpcy5zdGFydGVkKSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcihgJHtOQU1FfS4gVGhlIGFwcCBoYXMgYmVlbiBhbHJlYWR5IHN0YXJ0ZWQuYClcbiAgICAgIH1cblxuICAgICAgdGhpcy5zdGFydGVkID0gdHJ1ZVxuXG4gICAgICAvLyBmb3JjZSBkZWZhdWx0IHBhZ2Ugb24gQ29yZG92YVxuICAgICAgaWYgKHdpbmRvdy5jb3Jkb3ZhKSB7XG4gICAgICAgIGZvcmNlRGVmYXVsdFBhZ2UgPSB0cnVlXG4gICAgICB9XG5cbiAgICAgIGxldCBwYWdlTmFtZSA9IHRoaXMuZ2V0UGFnZUZyb21IYXNoKClcbiAgICAgIGlmICghdGhpcy5nZXRQYWdlTW9kZWwocGFnZU5hbWUpKSB7XG4gICAgICAgIHBhZ2VOYW1lID0gdGhpcy5vcHRpb25zLmRlZmF1bHRQYWdlXG4gICAgICB9XG5cbiAgICAgIGlmIChmb3JjZURlZmF1bHRQYWdlICYmICF0aGlzLm9wdGlvbnMuZGVmYXVsdFBhZ2UpIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKGAke05BTUV9LiBUaGUgZGVmYXVsdCBwYWdlIG11c3QgZXhpc3QgZm9yIGZvcmNpbmcgaXRzIGxhdW5jaCFgKVxuICAgICAgfVxuXG4gICAgICAvLyBMb2cgdGhlIGRldmljZSBpbmZvXG4gICAgICBpZiAocGhvbm9uLmRlYnVnKSB7XG4gICAgICAgIGNvbnNvbGUubG9nKCdTdGFydGluZyBQaG9ub24gaW4gJyArIHBsYXRmb3JtLmRlc2NyaXB0aW9uKVxuICAgICAgICBjb25zb2xlLmxvZyh0aGlzLnBhZ2VzLmxlbmd0aCArICcgcGFnZXMgZm91bmQnKVxuICAgICAgICBjb25zb2xlLmxvZygnTG9hZGluZyAnICsgcGFnZU5hbWUpXG4gICAgICB9XG5cbiAgICAgIC8qXG4gICAgICAgKiBpZiB0aGUgYXBwIGlzIGNvbmZpZ3VyYXRlZCB0byB1c2UgaGFzaCB0cmFja2luZ1xuICAgICAgICogd2UgYWRkIHRoZSBwYWdlIGR5bmFtaWNhbGx5IGluIHRoZSB1cmxcbiAgICAgICAqL1xuICAgICAgaWYgKHRoaXMub3B0aW9ucy51c2VIYXNoKSB7XG4gICAgICAgIHRoaXMuc2V0SGFzaChwYWdlTmFtZSlcbiAgICAgIH1cblxuICAgICAgdGhpcy5zaG93UGFnZShmb3JjZURlZmF1bHRQYWdlID8gdGhpcy5vcHRpb25zLmRlZmF1bHRQYWdlIDogcGFnZU5hbWUpXG4gICAgfVxuXG4gICAgLy8gc3RhdGljXG4gICAgc3RhdGljIF9ET01JbnRlcmZhY2Uob3B0aW9ucykge1xuICAgICAgcmV0dXJuIG5ldyBQYWdlcihvcHRpb25zKVxuICAgIH1cbiAgfVxuXG4gIHJldHVybiBQYWdlclxufSkoKVxuXG5leHBvcnQgZGVmYXVsdCBQYWdlclxuIiwiLyoqXG4gKiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICogTGljZW5zZWQgdW5kZXIgTUlUIChodHRwczovL2dpdGh1Yi5jb20vcXVhcmstZGV2L1Bob25vbi1GcmFtZXdvcmsvYmxvYi9tYXN0ZXIvTElDRU5TRSlcbiAqIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gKi9cblxuaW1wb3J0IHsgbG9hZEZpbGUgfSBmcm9tICcuLi8uLi9jb21tb24vdXRpbHMnXG5pbXBvcnQgeyBkaXNwYXRjaFBhZ2VFdmVudCB9IGZyb20gJy4uLy4uL2NvbW1vbi9ldmVudHMvZGlzcGF0Y2gnXG5cbmNvbnN0IFBhZ2UgPSAoKCkgPT4ge1xuICAvKipcbiAgICogLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAqIENvbnN0YW50c1xuICAgKiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICovXG5cbiAgY29uc3QgTkFNRSA9ICdwYWdlJ1xuICBjb25zdCBWRVJTSU9OID0gJzIuMC4wJ1xuXG4gIGNvbnN0IFRFTVBMQVRFX1NFTEVDVE9SID0gJ1tkYXRhLXRlbXBsYXRlXSdcblxuICAvKipcbiAgICogLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAqIENsYXNzIERlZmluaXRpb25cbiAgICogLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAqL1xuXG4gIGNsYXNzIFBhZ2Uge1xuICAgIC8qKlxuICAgICAqIENyZWF0ZXMgYW4gaW5zdGFuY2Ugb2YgUGFnZS5cbiAgICAgKiBAcGFyYW0ge3N0cmluZ30gcGFnZU5hbWVcbiAgICAgKi9cbiAgICBjb25zdHJ1Y3RvcihwYWdlTmFtZSkge1xuICAgICAgdGhpcy5uYW1lID0gcGFnZU5hbWVcbiAgICAgIHRoaXMuZXZlbnRzID0gW11cbiAgICAgIHRoaXMudGVtcGxhdGVQYXRoID0gbnVsbFxuICAgICAgdGhpcy5yZW5kZXJGdW5jdGlvbiA9IG51bGxcbiAgICB9XG5cbiAgICAvLyBnZXR0ZXJzXG5cbiAgICBzdGF0aWMgZ2V0IHZlcnNpb24oKSB7XG4gICAgICByZXR1cm4gYCR7TkFNRX0uJHtWRVJTSU9OfWBcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBHZXQgZXZlbnRzXG4gICAgICogQHJldHVybnMge0Z1bmN0aW9uW119XG4gICAgICovXG4gICAgZ2V0RXZlbnRzKCkge1xuICAgICAgcmV0dXJuIHRoaXMuZXZlbnRzXG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogR2V0IHRlbXBsYXRlXG4gICAgICogQHJldHVybnMge3N0cmluZ31cbiAgICAgKi9cbiAgICBnZXRUZW1wbGF0ZSgpIHtcbiAgICAgIHJldHVybiB0aGlzLnRlbXBsYXRlUGF0aFxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEdldCByZW5kZXIgZnVuY3Rpb25cbiAgICAgKiBAcmV0dXJucyB7RnVuY3Rpb259XG4gICAgICovXG4gICAgZ2V0UmVuZGVyRnVuY3Rpb24oKSB7XG4gICAgICByZXR1cm4gdGhpcy5yZW5kZXJGdW5jdGlvblxuICAgIH1cblxuICAgIGxvYWRUZW1wbGF0ZSgpIHtcbiAgICAgIGNvbnN0IHBhZ2VFbGVtZW50ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihgW2RhdGEtcGFnZT1cIiR7dGhpcy5uYW1lfVwiXWApXG5cbiAgICAgIGxvYWRGaWxlKHRoaXMuZ2V0VGVtcGxhdGUoKSwgKHRlbXBsYXRlKSA9PiB7XG4gICAgICAgIGxldCByZW5kZXIgPSBmdW5jdGlvbiAoRE9NUGFnZSwgdGVtcGxhdGUsIGVsZW1lbnRzKSB7XG4gICAgICAgICAgaWYgKGVsZW1lbnRzKSB7XG4gICAgICAgICAgICBBcnJheS5mcm9tKGVsZW1lbnRzKS5mb3JFYWNoKChlbCkgPT4ge1xuICAgICAgICAgICAgICBlbC5pbm5lckhUTUwgPSB0ZW1wbGF0ZVxuICAgICAgICAgICAgfSlcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgRE9NUGFnZS5pbm5lckhUTUwgPSB0ZW1wbGF0ZVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGlmICh0aGlzLmdldFJlbmRlckZ1bmN0aW9uKCkpIHtcbiAgICAgICAgICByZW5kZXIgPSB0aGlzLmdldFJlbmRlckZ1bmN0aW9uKClcbiAgICAgICAgfVxuXG4gICAgICAgIHJlbmRlcihwYWdlRWxlbWVudCwgdGVtcGxhdGUsIHBhZ2VFbGVtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoVEVNUExBVEVfU0VMRUNUT1IpKVxuICAgICAgfSwgbnVsbClcbiAgICB9XG5cbiAgICAvLyBwdWJsaWNcblxuICAgIC8qKlxuICAgICAqXG4gICAgICogQHBhcmFtIHsqfSBjYWxsYmFja0ZuXG4gICAgICovXG4gICAgYWRkRXZlbnRDYWxsYmFjayhjYWxsYmFja0ZuKSB7XG4gICAgICB0aGlzLmV2ZW50cy5wdXNoKGNhbGxiYWNrRm4pXG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogVXNlIHRoZSBnaXZlbiB0ZW1wbGF0ZVxuICAgICAqXG4gICAgICogQHBhcmFtIHtzdHJpbmd9IHRlbXBsYXRlUGF0aFxuICAgICAqL1xuICAgIHVzZVRlbXBsYXRlKHRlbXBsYXRlUGF0aCkge1xuICAgICAgaWYgKHR5cGVvZiB0ZW1wbGF0ZVBhdGggIT09ICdzdHJpbmcnKSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcignVGhlIHRlbXBsYXRlIHBhdGggbXVzdCBiZSBhIHN0cmluZy4gJyArIHR5cGVvZiB0ZW1wbGF0ZVBhdGggKyAnIGlzIGdpdmVuJylcbiAgICAgIH1cbiAgICAgIHRoaXMudGVtcGxhdGVQYXRoID0gdGVtcGxhdGVQYXRoXG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogVXNlIHRoZSBnaXZlbiB0ZW1wbGF0ZSByZW5kZXJlclxuICAgICAqIEBwYXJhbSB7RnVuY3Rpb259IHJlbmRlckZ1bmN0aW9uXG4gICAgICovXG4gICAgdXNlVGVtcGxhdGVSZW5kZXJlcihyZW5kZXJGdW5jdGlvbikge1xuICAgICAgaWYgKHR5cGVvZiByZW5kZXJGdW5jdGlvbiAhPT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ1RoZSBjdXN0b20gdGVtcGxhdGUgcmVuZGVyZXIgbXVzdCBiZSBhIGZ1bmN0aW9uLiAnICsgdHlwZW9mIHJlbmRlckZ1bmN0aW9uICsgJyBpcyBnaXZlbicpXG4gICAgICB9XG4gICAgICB0aGlzLnJlbmRlckZ1bmN0aW9uID0gcmVuZGVyRnVuY3Rpb25cbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBUcmlnZ2VyIHNjb3Blc1xuICAgICAqIEBwYXJhbSB7c3RyaW5nfSBldmVudE5hbWVcbiAgICAgKiBAcGFyYW0ge3t9fSBbZXZlbnRQYXJhbXM9e31dXG4gICAgICovXG4gICAgdHJpZ2dlclNjb3BlcyhldmVudE5hbWUsIGV2ZW50UGFyYW1zID0ge30pIHtcbiAgICAgIGNvbnN0IGV2ZW50TmFtZUFsaWFzID0gYG9uJHtldmVudE5hbWUuY2hhckF0KDApLnRvVXBwZXJDYXNlKCl9JHtldmVudE5hbWUuc2xpY2UoMSl9YFxuXG4gICAgICB0aGlzLmV2ZW50cy5mb3JFYWNoKChzY29wZSkgPT4ge1xuICAgICAgICBjb25zdCBzY29wZUV2ZW50ID0gc2NvcGVbZXZlbnROYW1lXVxuICAgICAgICBjb25zdCBzY29wZUV2ZW50QWxpYXMgPSBzY29wZVtldmVudE5hbWVBbGlhc11cbiAgICAgICAgaWYgKHR5cGVvZiBzY29wZUV2ZW50ID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgICAgc2NvcGVFdmVudC5hcHBseSh0aGlzLCBldmVudFBhcmFtcylcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIHRyaWdnZXIgdGhlIGV2ZW50IGFsaWFzXG4gICAgICAgIGlmICh0eXBlb2Ygc2NvcGVFdmVudEFsaWFzID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgICAgc2NvcGVFdmVudEFsaWFzLmFwcGx5KHRoaXMsIGV2ZW50UGFyYW1zKVxuICAgICAgICB9XG4gICAgICB9KVxuXG4gICAgICBkaXNwYXRjaFBhZ2VFdmVudChldmVudE5hbWUsIHRoaXMubmFtZSwgZXZlbnRQYXJhbXMpXG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIFBhZ2Vcbn0pKClcblxuZXhwb3J0IGRlZmF1bHQgUGFnZVxuIiwiLyoqXG4gKiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICogTGljZW5zZWQgdW5kZXIgTUlUIChodHRwczovL2dpdGh1Yi5jb20vcXVhcmstZGV2L1Bob25vbi1GcmFtZXdvcmsvYmxvYi9tYXN0ZXIvTElDRU5TRSlcbiAqIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gKi9cblxuaW1wb3J0IFBhZ2VyIGZyb20gJy4vaHlicmlkLWFwcHMvcGFnZXIvaW5kZXgnXG5pbXBvcnQgSW50bCBmcm9tICcuL2h5YnJpZC1hcHBzL2ludGwnXG5pbXBvcnQgTmV0d29yayBmcm9tICcuL2NvbW1vbi9uZXR3b3JrJ1xuXG4vLyBjb21wb25lbnRzXG5pbXBvcnQgRGlhbG9nIGZyb20gJy4vY29tcG9uZW50cy9kaWFsb2cnXG5pbXBvcnQgUHJvbXB0IGZyb20gJy4vY29tcG9uZW50cy9kaWFsb2cvcHJvbXB0J1xuaW1wb3J0IE5vdGlmaWNhdGlvbiBmcm9tICcuL2NvbXBvbmVudHMvbm90aWZpY2F0aW9uJ1xuaW1wb3J0IENvbGxhcHNlIGZyb20gJy4vY29tcG9uZW50cy9jb2xsYXBzZSdcbmltcG9ydCBBY2NvcmRpb24gZnJvbSAnLi9jb21wb25lbnRzL2FjY29yZGlvbidcbmltcG9ydCBUYWIgZnJvbSAnLi9jb21wb25lbnRzL3RhYidcbmltcG9ydCBQcm9ncmVzcyBmcm9tICcuL2NvbXBvbmVudHMvcHJvZ3Jlc3MnXG5pbXBvcnQgTG9hZGVyIGZyb20gJy4vY29tcG9uZW50cy9sb2FkZXInXG5pbXBvcnQgT2ZmQ2FudmFzIGZyb20gJy4vY29tcG9uZW50cy9vZmYtY2FudmFzJ1xuaW1wb3J0IERyb3Bkb3duIGZyb20gJy4vY29tcG9uZW50cy9kcm9wZG93bidcbmltcG9ydCBEcm9wZG93blNlYXJjaCBmcm9tICcuL2NvbXBvbmVudHMvZHJvcGRvd24vc2VhcmNoJ1xuXG5jb25zdCBhcGkgPSB7fVxuXG4vKipcbiAqIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICogQ29uZmlndXJhdGlvblxuICogLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gKi9cbmFwaS5jb25maWcgPSB7XG4gIC8vIGdsb2JhbCBjb25maWdcbiAgZGVidWc6IHRydWUsXG59XG5cbi8qKlxuICogLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gKiBQYWdlclxuICogLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gKi9cbmFwaS5wYWdlciA9IChvcHRpb25zKSA9PiB7XG4gIGlmICh0eXBlb2YgYXBpLl9wYWdlciA9PT0gJ3VuZGVmaW5lZCcpIHtcbiAgICBhcGkuX3BhZ2VyID0gUGFnZXIuX0RPTUludGVyZmFjZShvcHRpb25zKVxuICB9XG4gIHJldHVybiBhcGkuX3BhZ2VyXG59XG5cbi8qKlxuICogLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gKiBJbnRsXG4gKiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAqL1xuYXBpLmludGwgPSBJbnRsLl9ET01JbnRlcmZhY2VcblxuLyoqXG4gKiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAqIE5ldHdvcmtcbiAqIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICovXG5hcGkubmV0d29yayA9IE5ldHdvcmsuX0RPTUludGVyZmFjZVxuXG4vKipcbiAqIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICogTm90aWZpY2F0aW9uXG4gKiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAqL1xuYXBpLm5vdGlmaWNhdGlvbiA9IE5vdGlmaWNhdGlvbi5fRE9NSW50ZXJmYWNlXG5cbi8qKlxuICogLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gKiBEaWFsb2dcbiAqIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICovXG5hcGkuZGlhbG9nID0gRGlhbG9nLl9ET01JbnRlcmZhY2Vcblxuc2V0VGltZW91dCgoKSA9PiB7XG4gIFByb21wdC5fRE9NSW50ZXJmYWNlKHtcbiAgICBlbGVtZW50OiBudWxsLFxuICAgIHRpdGxlOiAnSEVMTE9XJyxcbiAgICBtZXNzYWdlOiBudWxsLFxuICAgIGNhbmNlbGFibGU6IHRydWUsXG4gIH0pLnNob3coKVxufSwgMTAwMClcblxuLyoqXG4gKiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAqIENvbGxhcHNlXG4gKiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAqL1xuYXBpLmNvbGxhcHNlID0gQ29sbGFwc2UuX0RPTUludGVyZmFjZVxuXG4vKipcbiAqIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICogQWNjb3JkaW9uXG4gKiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAqL1xuYXBpLmFjY29yZGlvbiA9IEFjY29yZGlvbi5fRE9NSW50ZXJmYWNlXG5cblxuLyoqXG4gKiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAqIFRhYlxuICogLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gKi9cbmFwaS50YWIgPSBUYWIuX0RPTUludGVyZmFjZVxuXG4vKipcbiAqIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICogUHJvZ3Jlc3NcbiAqIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICovXG5hcGkucHJvZ3Jlc3MgPSBQcm9ncmVzcy5fRE9NSW50ZXJmYWNlXG5cbi8qKlxuICogLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gKiBMb2FkZXJcbiAqIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICovXG5hcGkubG9hZGVyID0gTG9hZGVyLl9ET01JbnRlcmZhY2VcblxuLyoqXG4gKiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAqIE9mZiBjYW52YXNcbiAqIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICovXG5hcGkub2ZmQ2FudmFzID0gT2ZmQ2FudmFzLl9ET01JbnRlcmZhY2VcblxuLyoqXG4gKiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAqIERyb3Bkb3duXG4gKiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAqL1xuYXBpLmRyb3Bkb3duID0gKG9wdGlvbnMpID0+IHtcbiAgaWYgKG9wdGlvbnMuc2VhcmNoKSB7XG4gICAgLy8gZ2VuZXJpYyBkcm9wZG93blxuICAgIHJldHVybiBEcm9wZG93bi5fRE9NSW50ZXJmYWNlXG4gIH0gZWxzZSB7XG4gICAgLy8gc2VhcmNoIGRyb3Bkb3duXG4gICAgcmV0dXJuIERyb3Bkb3duU2VhcmNoLl9ET01JbnRlcmZhY2VcbiAgfVxufVxuXG4vLyBNYWtlIHRoZSBBUEkgbGl2ZVxud2luZG93LnBob25vbiA9IGFwaVxuXG5leHBvcnQgZGVmYXVsdCBhcGlcbiJdLCJwcmVFeGlzdGluZ0NvbW1lbnQiOiIvLyMgc291cmNlTWFwcGluZ1VSTD1kYXRhOmFwcGxpY2F0aW9uL2pzb247Y2hhcnNldD11dGYtODtiYXNlNjQsZXlKMlpYSnphVzl1SWpvekxDSnpiM1Z5WTJWeklqcGJJbTV2WkdWZmJXOWtkV3hsY3k5aWNtOTNjMlZ5TFhCaFkyc3ZYM0J5Wld4MVpHVXVhbk1pTENKemNtTXZhbk12WTI5dGJXOXVMMlYyWlc1MGN5OWthWE53WVhSamFDNXFjeUlzSW5OeVl5OXFjeTlqYjIxdGIyNHZaWFpsYm5SekwybHVaR1Y0TG1weklpd2ljM0pqTDJwekwyTnZiVzF2Ymk5dVpYUjNiM0pyTDJsdVpHVjRMbXB6SWl3aWMzSmpMMnB6TDJOdmJXMXZiaTkxZEdsc2N5OXBibVJsZUM1cWN5SXNJbk55WXk5cWN5OWpiMjF3YjI1bGJuUnpMMkZqWTI5eVpHbHZiaTlwYm1SbGVDNXFjeUlzSW5OeVl5OXFjeTlqYjIxd2IyNWxiblJ6TDJOdmJHeGhjSE5sTDJsdVpHVjRMbXB6SWl3aWMzSmpMMnB6TDJOdmJYQnZibVZ1ZEhNdlkyOXRjRzl1Wlc1MExtcHpJaXdpYzNKakwycHpMMk52YlhCdmJtVnVkSE12WTI5dGNHOXVaVzUwVFdGdVlXZGxjaTVxY3lJc0luTnlZeTlxY3k5amIyMXdiMjVsYm5SekwyUnBZV3h2Wnk5cGJtUmxlQzVxY3lJc0luTnlZeTlxY3k5amIyMXdiMjVsYm5SekwyUnBZV3h2Wnk5d2NtOXRjSFF1YW5NaUxDSnpjbU12YW5NdlkyOXRjRzl1Wlc1MGN5OWtjbTl3Wkc5M2JpOXBibVJsZUM1cWN5SXNJbk55WXk5cWN5OWpiMjF3YjI1bGJuUnpMMlJ5YjNCa2IzZHVMM05sWVhKamFDNXFjeUlzSW5OeVl5OXFjeTlqYjIxd2IyNWxiblJ6TDJ4dllXUmxjaTlwYm1SbGVDNXFjeUlzSW5OeVl5OXFjeTlqYjIxd2IyNWxiblJ6TDI1dmRHbG1hV05oZEdsdmJpOXBibVJsZUM1cWN5SXNJbk55WXk5cWN5OWpiMjF3YjI1bGJuUnpMMjltWmkxallXNTJZWE12YVc1a1pYZ3Vhbk1pTENKemNtTXZhbk12WTI5dGNHOXVaVzUwY3k5d2NtOW5jbVZ6Y3k5cGJtUmxlQzVxY3lJc0luTnlZeTlxY3k5amIyMXdiMjVsYm5SekwzUmhZaTlwYm1SbGVDNXFjeUlzSW5OeVl5OXFjeTlvZVdKeWFXUXRZWEJ3Y3k5cGJuUnNMMkpwYm1SbGNpNXFjeUlzSW5OeVl5OXFjeTlvZVdKeWFXUXRZWEJ3Y3k5cGJuUnNMMmx1WkdWNExtcHpJaXdpYzNKakwycHpMMmg1WW5KcFpDMWhjSEJ6TDNCaFoyVnlMMmx1WkdWNExtcHpJaXdpYzNKakwycHpMMmg1WW5KcFpDMWhjSEJ6TDNCaFoyVnlMM0JoWjJVdWFuTWlMQ0p6Y21NdmFuTXZhVzVrWlhndWFuTWlYU3dpYm1GdFpYTWlPbHRkTENKdFlYQndhVzVuY3lJNklrRkJRVUU3T3pzN096dFJRMEZuUWl4dFFpeEhRVUZCTEcxQ08xRkJUVUVzYjBJc1IwRkJRU3h2UWp0UlFVdEJMR2xDTEVkQlFVRXNhVUk3UVVGWVZDeFRRVUZUTEcxQ1FVRlVMRU5CUVRaQ0xGTkJRVGRDTEVWQlFYZERMRlZCUVhoRExFVkJRV2xGTzBGQlFVRXNUVUZCWWl4TlFVRmhMSFZGUVVGS0xFVkJRVWs3TzBGQlEzUkZMRTFCUVUwc1owSkJRVzFDTEZOQlFXNUNMRmxCUVcxRExGVkJRWHBETzBGQlEwRXNVMEZCVHl4aFFVRlFMRU5CUVhGQ0xFbEJRVWtzVjBGQlNpeERRVUZuUWl4aFFVRm9RaXhGUVVFclFpeEZRVUZGTEdOQlFVWXNSVUZCTDBJc1EwRkJja0k3UVVGRFFTeFhRVUZUTEdGQlFWUXNRMEZCZFVJc1NVRkJTU3hYUVVGS0xFTkJRV2RDTEdGQlFXaENMRVZCUVN0Q0xFVkJRVVVzWTBGQlJpeEZRVUV2UWl4RFFVRjJRanRCUVVORU96dEJRVVZOTEZOQlFWTXNiMEpCUVZRc1EwRkJPRUlzVlVGQk9VSXNSVUZCTUVNc1UwRkJNVU1zUlVGQmNVUXNWVUZCY2tRc1JVRkJPRVU3UVVGQlFTeE5RVUZpTEUxQlFXRXNkVVZCUVVvc1JVRkJTVHM3UVVGRGJrWXNUVUZCVFN4blFrRkJiVUlzVTBGQmJrSXNXVUZCYlVNc1ZVRkJla003UVVGRFFTeGhRVUZYTEdGQlFWZ3NRMEZCZVVJc1NVRkJTU3hYUVVGS0xFTkJRV2RDTEdGQlFXaENMRVZCUVN0Q0xFVkJRVVVzWTBGQlJpeEZRVUV2UWl4RFFVRjZRanRCUVVORU96dEJRVVZOTEZOQlFWTXNhVUpCUVZRc1EwRkJNa0lzVTBGQk0wSXNSVUZCYzBNc1VVRkJkRU1zUlVGQk5rUTdRVUZCUVN4TlFVRmlMRTFCUVdFc2RVVkJRVW9zUlVGQlNUczdRVUZEYkVVc1RVRkJUU3huUWtGQmJVSXNVVUZCYmtJc1UwRkJLMElzVTBGQmNrTTdRVUZEUVN4VFFVRlBMR0ZCUVZBc1EwRkJjVUlzU1VGQlNTeFhRVUZLTEVOQlFXZENMR0ZCUVdoQ0xFVkJRU3RDTEVWQlFVVXNZMEZCUml4RlFVRXZRaXhEUVVGeVFqdEJRVU5CTEZkQlFWTXNZVUZCVkN4RFFVRjFRaXhKUVVGSkxGZEJRVW9zUTBGQlowSXNZVUZCYUVJc1JVRkJLMElzUlVGQlJTeGpRVUZHTEVWQlFTOUNMRU5CUVhaQ08wRkJRMFE3T3pzN096czdPMEZEWmtRN1FVRkRRU3hKUVVGSkxFOUJRVThzVFVGQlVDeExRVUZyUWl4WFFVRjBRaXhGUVVGdFF6dEJRVU5xUXl4VFFVRlBMR2RDUVVGUUxFTkJRWGRDTEU5QlFYaENMRVZCUVdsRExGbEJRVTA3UVVGRGNrTXNXVUZCVVN4TFFVRlNMRU5CUVdNc2RVZEJRV1E3UVVGRFJDeEhRVVpFTzBGQlIwUTdPMEZCUlVRN1FVRkRRU3hKUVVGSkxHdENRVUZyUWl4RFFVRkRMRmRCUVVRc1JVRkJZeXhYUVVGa0xFVkJRVEpDTEZOQlFUTkNMRU5CUVhSQ08wRkJRMEVzU1VGQlNTeGpRVUZqTEV0QlFXeENPenRCUVVWQkxFbEJRVWtzVDBGQlR5eE5RVUZRTEV0QlFXdENMRmRCUVhSQ0xFVkJRVzFETzBGQlEycERMRTFCUVVzc2EwSkJRV3RDTEUxQlFXNUNMRWxCUVRoQ0xFOUJRVThzWVVGQlVDeEpRVUYzUWl4dlFrRkJiMElzWVVGQk9VVXNSVUZCTmtZN1FVRkRNMFlzYTBKQlFXTXNTVUZCWkR0QlFVTkJMSE5DUVVGclFpeERRVUZETEZsQlFVUXNSVUZCWlN4WFFVRm1MRVZCUVRSQ0xGVkJRVFZDTEVWQlFYZERMR0ZCUVhoRExFTkJRV3hDTzBGQlEwUTdPMEZCUlVRc1RVRkJTU3hQUVVGUExGTkJRVkFzUTBGQmFVSXNZMEZCY2tJc1JVRkJjVU03UVVGRGJrTXNjMEpCUVd0Q0xFTkJRVU1zWVVGQlJDeEZRVUZuUWl4aFFVRm9RaXhGUVVFclFpeFhRVUV2UWl4RlFVRTBReXhsUVVFMVF5eERRVUZzUWp0QlFVTkVMRWRCUmtRc1RVRkZUeXhKUVVGSkxFOUJRVThzVTBGQlVDeERRVUZwUWl4blFrRkJja0lzUlVGQmRVTTdRVUZETlVNc2MwSkJRV3RDTEVOQlFVTXNaVUZCUkN4RlFVRnJRaXhsUVVGc1FpeEZRVUZ0UXl4aFFVRnVReXhGUVVGclJDeHBRa0ZCYkVRc1EwRkJiRUk3UVVGRFJEdEJRVU5HT3p0QlFVVkVMRWxCUVUwc1MwRkJTeXhUUVVGVExHRkJRVlFzUTBGQmRVSXNTMEZCZGtJc1EwRkJXRHRCUVVOQkxFbEJRVTBzWTBGQll5eERRVU5zUWl4RlFVRkZMRTFCUVUwc1dVRkJVaXhGUVVGelFpeFBRVUZQTEdsQ1FVRTNRaXhGUVVGblJDeExRVUZMTEdWQlFYSkVMRVZCUkd0Q0xFVkJSV3hDTEVWQlFVVXNUVUZCVFN4bFFVRlNMRVZCUVhsQ0xFOUJRVThzYVVKQlFXaERMRVZCUVcxRUxFdEJRVXNzWlVGQmVFUXNSVUZHYTBJc1JVRkhiRUlzUlVGQlJTeE5RVUZOTEdOQlFWSXNSVUZCZDBJc1QwRkJUeXh0UWtGQkwwSXNSVUZCYjBRc1MwRkJTeXhwUWtGQmVrUXNSVUZJYTBJc1JVRkpiRUlzUlVGQlJTeE5RVUZOTEd0Q1FVRlNMRVZCUVRSQ0xFOUJRVThzZFVKQlFXNURMRVZCUVRSRUxFdEJRVXNzY1VKQlFXcEZMRVZCU210Q0xFTkJRWEJDTzBGQlRVRXNTVUZCVFN4aFFVRmhMRU5CUTJwQ0xFVkJRVVVzVFVGQlRTeFhRVUZTTEVWQlFYRkNMRTlCUVU4c1owSkJRVFZDTEVWQlFUaERMRXRCUVVzc1kwRkJia1FzUlVGRWFVSXNSVUZGYWtJc1JVRkJSU3hOUVVGTkxHTkJRVklzUlVGQmQwSXNUMEZCVHl4blFrRkJMMElzUlVGQmFVUXNTMEZCU3l4alFVRjBSQ3hGUVVacFFpeEZRVWRxUWl4RlFVRkZMRTFCUVUwc1lVRkJVaXhGUVVGMVFpeFBRVUZQTEd0Q1FVRTVRaXhGUVVGclJDeExRVUZMTEdkQ1FVRjJSQ3hGUVVocFFpeEZRVWxxUWl4RlFVRkZMRTFCUVUwc2FVSkJRVklzUlVGQk1rSXNUMEZCVHl4elFrRkJiRU1zUlVGQk1FUXNTMEZCU3l4dlFrRkJMMFFzUlVGS2FVSXNRMEZCYmtJN08wRkJUMEVzU1VGQlRTeHJRa0ZCYTBJc1dVRkJXU3hKUVVGYUxFTkJRV2xDTzBGQlFVRXNVMEZCU3l4SFFVRkhMRXRCUVVnc1EwRkJVeXhGUVVGRkxFbEJRVmdzVFVGQmNVSXNVMEZCTVVJN1FVRkJRU3hEUVVGcVFpeEZRVUZ6UkN4TFFVRTVSVHRCUVVOQkxFbEJRVTBzWjBKQlFXZENMRmxCUVZrc1NVRkJXaXhEUVVGcFFqdEJRVUZCTEZOQlFVc3NSMEZCUnl4TFFVRklMRU5CUVZNc1JVRkJSU3hKUVVGWUxFMUJRWEZDTEZOQlFURkNPMEZCUVVFc1EwRkJha0lzUlVGQmMwUXNSMEZCTlVVN1FVRkRRU3hKUVVGTkxHbENRVUZwUWl4WFFVRlhMRWxCUVZnc1EwRkJaMEk3UVVGQlFTeFRRVUZMTEVkQlFVY3NTMEZCU0N4RFFVRlRMRVZCUVVVc1NVRkJXQ3hOUVVGeFFpeFRRVUV4UWp0QlFVRkJMRU5CUVdoQ0xFVkJRWEZFTEV0QlFUVkZPMEZCUTBFc1NVRkJUU3hsUVVGbExGZEJRVmNzU1VGQldDeERRVUZuUWp0QlFVRkJMRk5CUVVzc1IwRkJSeXhMUVVGSUxFTkJRVk1zUlVGQlJTeEpRVUZZTEUxQlFYRkNMRk5CUVRGQ08wRkJRVUVzUTBGQmFFSXNSVUZCY1VRc1IwRkJNVVU3TzJ0Q1FVVmxPMEZCUTJJN1FVRkRRU3huUWtGQll5eFhRVVpFT3p0QlFVbGlPMEZCUTBFc2EwSkJRV2RDTEZGQlRFZzdRVUZOWWl4dFFrRkJhVUlzVTBGT1NqdEJRVTlpTEhkQ1FVRnpRaXhqUVZCVU8wRkJVV0lzWjBOQlFUaENMRzFDUVZKcVFqdEJRVk5pTEdkRFFVRTRRaXh0UWtGVWFrSTdPMEZCVjJJN1FVRkRRU3hSUVVGTkxFMUJXazg3UVVGaFlpeFRRVUZQTEU5QllrMDdRVUZqWWl4UlFVRk5MRTFCWkU4N1FVRmxZaXhWUVVGUkxGRkJaa3M3TzBGQmFVSmlPMEZCUTBFc1VVRkJUU3hOUVd4Q1R6czdRVUZ2UW1JN1FVRkRRU3hUUVVGUExHZENRVUZuUWl4RFFVRm9RaXhEUVhKQ1RUdEJRWE5DWWl4UlFVRk5MR2RDUVVGblFpeERRVUZvUWl4RFFYUkNUenRCUVhWQ1lpeFBRVUZMTEdkQ1FVRm5RaXhEUVVGb1FpeERRWFpDVVR0QlFYZENZaXhWUVVGUkxFOUJRVThzWjBKQlFXZENMRU5CUVdoQ0xFTkJRVkFzUzBGQk9FSXNWMEZCT1VJc1IwRkJORU1zU1VGQk5VTXNSMEZCYlVRc1owSkJRV2RDTEVOQlFXaENMRU5CZUVJNVF6czdRVUV3UW1JN1FVRkRRU3h2UWtGQmEwSXNaVUV6UWt3N1FVRTBRbUlzYTBKQlFXZENMR0ZCTlVKSU96dEJRVGhDWWp0QlFVTkJMRzFDUVVGcFFpeGpRUzlDU2p0QlFXZERZaXhwUWtGQlpTeFpRV2hEUmpzN1FVRnJRMkk3UVVGRFFTeHBRa0ZCWlR0QlFXNURSaXhET3pzN096czdPenM3T3pzN08wRkRja05tT3pzN08wRkJRMEU3T3pzN096czdPenM3SzJWQlVFRTdPenM3T3p0QlFWTkJMRWxCUVUwc1ZVRkJWeXhaUVVGTk8wRkJRM0pDT3pzN096czdRVUZOUVN4TlFVRk5MRTlCUVU4c1UwRkJZanRCUVVOQkxFMUJRVTBzVlVGQlZTeFBRVUZvUWp0QlFVTkJMRTFCUVUwc2NVSkJRWEZDTzBGQlEzcENMR0ZCUVZNc1NVRkVaMEk3UVVGRmVrSXNhMEpCUVdNc1NVRkdWenRCUVVkNlFpeFhRVUZQTzBGQlNHdENMRWRCUVROQ08wRkJTMEVzVFVGQlRTeDNRa0ZCZDBJc1JVRkJPVUk3TzBGQlIwRTdPenM3T3p0QlFXcENjVUlzVFVGMVFtWXNUMEYyUW1VN1FVRkJRVHM3UVVGM1FtNUNPenM3TzBGQlNVRXNkVUpCUVRCQ08wRkJRVUVzVlVGQlpDeFBRVUZqTEhWRlFVRktMRVZCUVVrN08wRkJRVUU3TzBGQlFVRXNiMGhCUTJ4Q0xFbEJSR3RDTEVWQlExb3NUMEZFV1N4RlFVTklMR3RDUVVSSExFVkJRMmxDTEU5QlJHcENMRVZCUXpCQ0xIRkNRVVF4UWl4RlFVTnBSQ3hKUVVScVJDeEZRVU4xUkN4TFFVUjJSRHM3UVVGSGVFSXNXVUZCU3l4SFFVRk1MRWRCUVZjc1NVRkJXRHRCUVVOQkxGbEJRVXNzWVVGQlRDeEhRVUZ4UWl4SlFVRnlRanM3UVVGRlFTeFpRVUZMTEZOQlFVd3NRMEZCWlN4cFFrRkJUU3hqUVVGeVFqczdRVUZGUVN4cFFrRkJWeXhaUVVGTk8wRkJRMllzWTBGQlN5eFZRVUZNTzBGQlEwUXNUMEZHUkN4RlFVVkhMRTFCUVVzc1QwRkJUQ3hEUVVGaExGbEJSbWhDTzBGQlVuZENPMEZCVjNwQ096dEJRWFpEYTBJN1FVRkJRVHRCUVVGQkxHdERRWGxEVUR0QlFVTldMR1ZCUVU4c1MwRkJTeXhOUVVGYU8wRkJRMFE3UVVFelEydENPMEZCUVVFN1FVRkJRU3huUTBFMlExUXNUVUUzUTFNc1JVRTJRMFE3UVVGRGFFSXNZVUZCU3l4TlFVRk1MRWRCUVdNc1RVRkJaRHRCUVVORU8wRkJMME5yUWp0QlFVRkJPMEZCUVVFc2NVTkJhVVJLTzBGQlFVRTdPMEZCUTJJc1lVRkJTeXhIUVVGTUxFZEJRVmNzU1VGQlNTeGpRVUZLTEVWQlFWZzdRVUZEUVN4aFFVRkxMRWRCUVV3c1EwRkJVeXhQUVVGVUxFZEJRVzFDTEV0QlFXNUNPenRCUVVWQkxGbEJRVTBzTUVKQlFYZENMRWxCUVVrc1NVRkJTaXhIUVVGWExFOUJRVmdzUlVGQk9VSTdPMEZCUlVFc1lVRkJTeXhaUVVGTUxFTkJRV3RDTEdsQ1FVRk5MRzlDUVVGNFFpeEZRVUU0UXl4RlFVRkZMRTFCUVUwc1NVRkJTU3hKUVVGS0xFVkJRVklzUlVGQk9VTXNSVUZCYjBVc1MwRkJjRVU3TzBGQlJVRXNZVUZCU3l4SFFVRk1MRU5CUVZNc1NVRkJWQ3hEUVVGakxFMUJRV1FzUlVGQmMwSXNSMEZCZEVJc1JVRkJNa0lzU1VGQk0wSTdPMEZCUlVFc1lVRkJTeXhIUVVGTUxFTkJRVk1zVDBGQlZDeEhRVUZ0UWl4TFFVRkxMRTlCUVV3c1EwRkJZU3hMUVVGaUxFZEJRWEZDTEVOQlFYaERPMEZCUTBFc1lVRkJTeXhIUVVGTUxFTkJRVk1zVTBGQlZDeEhRVUZ4UWl4WlFVRk5PMEZCUTNwQ0xHbENRVUZMTEVkQlFVd3NRMEZCVXl4TFFVRlVPMEZCUTBFc2FVSkJRVXNzUjBGQlRDeEhRVUZYTEVsQlFWZzdRVUZEUkN4VFFVaEVPenRCUVV0QkxHRkJRVXNzUjBGQlRDeERRVUZUTEUxQlFWUXNSMEZCYTBJc1dVRkJUVHRCUVVOMFFpeHBRa0ZCU3l4SlFVRk1PMEZCUTBRc1UwRkdSRHRCUVVkQkxHRkJRVXNzUjBGQlRDeERRVUZUTEU5QlFWUXNSMEZCYlVJc1dVRkJUVHRCUVVOMlFpeHBRa0ZCU3l4TlFVRk1PMEZCUTBRc1UwRkdSRHM3UVVGSlFTeFpRVUZKTzBGQlEwWXNaVUZCU3l4SFFVRk1MRU5CUVZNc1NVRkJWRHRCUVVORUxGTkJSa1FzUTBGRlJTeFBRVUZQTEVOQlFWQXNSVUZCVlR0QlFVTldMR1ZCUVVzc1RVRkJURHRCUVVORU8wRkJRMFk3UVVFM1JXdENPMEZCUVVFN1FVRkJRU3cyUWtFclJWbzdRVUZEVEN4aFFVRkxMRmxCUVV3c1EwRkJhMElzYVVKQlFVMHNORUpCUVhoQ0xFVkJRWE5FTEVWQlFVVXNUVUZCVFN4SlFVRkpMRWxCUVVvc1JVRkJVaXhGUVVGMFJDeEZRVUUwUlN4TFFVRTFSVHM3UVVGRlFTeFpRVUZKTEV0QlFVc3NVMEZCVEN4UFFVRnhRaXhwUWtGQlRTeGpRVUV2UWl4RlFVRXJRenRCUVVNM1F5eGxRVUZMTEZsQlFVd3NRMEZCYTBJc2FVSkJRVTBzWTBGQmVFSXNSVUZCZDBNc1JVRkJSU3hOUVVGTkxFbEJRVWtzU1VGQlNpeEZRVUZTTEVWQlFYaERMRVZCUVRoRUxFdEJRVGxFTzBGQlEwUTdPMEZCUlVRc1lVRkJTeXhUUVVGTUxFTkJRV1VzYVVKQlFVMHNZMEZCY2tJN1FVRkRSRHRCUVhaR2EwSTdRVUZCUVR0QlFVRkJMQ3RDUVhsR1ZqdEJRVU5RTEdGQlFVc3NXVUZCVEN4RFFVRnJRaXhwUWtGQlRTdzBRa0ZCZUVJc1JVRkJjMFFzUlVGQlJTeE5RVUZOTEVsQlFVa3NTVUZCU2l4RlFVRlNMRVZCUVhSRUxFVkJRVFJGTEV0QlFUVkZPenRCUVVWQkxGbEJRVWtzUzBGQlN5eFRRVUZNTEU5QlFYRkNMR2xDUVVGTkxHVkJRUzlDTEVWQlFXZEVPMEZCUXpsRExHVkJRVXNzV1VGQlRDeERRVUZyUWl4cFFrRkJUU3hsUVVGNFFpeEZRVUY1UXl4RlFVRkZMRTFCUVUwc1NVRkJTU3hKUVVGS0xFVkJRVklzUlVGQmVrTXNSVUZCSzBRc1MwRkJMMFE3UVVGRFJEczdRVUZGUkN4aFFVRkxMRk5CUVV3c1EwRkJaU3hwUWtGQlRTeGxRVUZ5UWp0QlFVTkVPMEZCYWtkclFqdEJRVUZCTzBGQlFVRXNiVU5CYlVkT08wRkJRVUU3TzBGQlExZ3NZVUZCU3l4VFFVRk1PenRCUVVWQkxHRkJRVXNzV1VGQlREczdRVUZGUVN4aFFVRkxMR0ZCUVV3c1IwRkJjVUlzV1VGQldTeFpRVUZOTzBGQlEzSkRMR2xDUVVGTExGbEJRVXc3UVVGRFJDeFRRVVp2UWl4RlFVVnNRaXhMUVVGTExFOUJRVXdzUTBGQllTeExRVVpMTEVOQlFYSkNPMEZCUjBRN1FVRXpSMnRDTzBGQlFVRTdRVUZCUVN4clEwRTJSMUE3UVVGRFZpeFpRVUZKTEV0QlFVc3NZVUZCVEN4TFFVRjFRaXhKUVVFelFpeEZRVUZwUXp0QlFVTXZRaXgzUWtGQll5eExRVUZMTEdGQlFXNUNPMEZCUTBFc1pVRkJTeXhoUVVGTUxFZEJRWEZDTEVsQlFYSkNPMEZCUTBRN1FVRkRSanRCUVd4SWEwSTdRVUZCUVR0QlFVRkJMRzlEUVc5SVJTeFBRWEJJUml4RlFXOUlWenRCUVVNMVFpd3lSMEZCTWtJc1QwRkJNMElzUlVGQmIwTXNUMEZCY0VNN1FVRkRSRHRCUVhSSWEwSTdPMEZCUVVFN1FVRkJRVHM3UVVGNVNISkNMRk5CUVU4c1QwRkJVRHRCUVVORUxFTkJNVWhsTEVWQlFXaENPenRyUWtFMFNHVXNUenM3T3pzN096czdVVU53U1VNc1VTeEhRVUZCTEZFN1VVRnZRa0VzVlN4SFFVRkJMRlU3VVVGSlFTeHBRaXhIUVVGQkxHbENPMUZCVjBFc1l5eEhRVUZCTEdNN1VVRlZRU3huUWl4SFFVRkJMR2RDTzBGQk4wTlVMRk5CUVZNc1VVRkJWQ3hEUVVGclFpeEhRVUZzUWl4RlFVRjFRaXhGUVVGMlFpeEZRVUV5UWl4UlFVRXpRaXhGUVVGeFF6dEJRVU14UXl4TlFVRk5MRTFCUVUwc1NVRkJTU3hqUVVGS0xFVkJRVm83UVVGRFFTeE5RVUZKTEVsQlFVa3NaMEpCUVZJc1JVRkJNRUlzU1VGQlNTeG5Ra0ZCU2l4RFFVRnhRaXd3UWtGQmNrSTdRVUZETVVJc1RVRkJTU3hyUWtGQlNpeEhRVUY1UWl4WlFVRk5PMEZCUXpkQ0xGRkJRVWtzU1VGQlNTeFZRVUZLTEV0QlFXMUNMRU5CUVc1Q0xFdEJRWGxDTEZOQlFWTXNTVUZCU1N4TlFVRmlMRVZCUVhGQ0xFVkJRWEpDTEUxQlFUWkNMRWRCUVRkQ0xFbEJRM2hDTEVOQlFVTXNTVUZCU1N4TlFVRk1MRWxCUVdVc1NVRkJTU3haUVVGS0xFTkJRV2xDTEUxQlJHcERMRU5CUVVvc1JVRkRPRU03UVVGRE5VTXNVMEZCUnl4SlFVRkpMRmxCUVZBN1FVRkRSRHRCUVVOR0xFZEJURVE3TzBGQlQwRXNUVUZCU1N4UFFVRlBMRkZCUVZBc1MwRkJiMElzVVVGQmVFSXNSVUZCYTBNN1FVRkRhRU1zVVVGQlNTeEpRVUZLTEVOQlFWTXNTMEZCVkN4RlFVRm5RaXhIUVVGb1FpeEZRVUZ4UWl4SlFVRnlRanRCUVVOQkxGRkJRVWtzU1VGQlNpeERRVUZUTEVWQlFWUTdRVUZEUkN4SFFVaEVMRTFCUjA4N1FVRkRUQ3hSUVVGSkxFbEJRVW9zUTBGQlV5eE5RVUZVTEVWQlFXbENMRWRCUVdwQ0xFVkJRWE5DTEVsQlFYUkNPMEZCUTBFc1VVRkJTU3huUWtGQlNpeERRVUZ4UWl4alFVRnlRaXhGUVVGeFF5eHRRMEZCY2tNN1FVRkRRU3hSUVVGSkxFbEJRVW9zUTBGQlV5eFJRVUZVTzBGQlEwUTdRVUZEUmpzN1FVRkZUU3hUUVVGVExGVkJRVlFzUjBGQmMwSTdRVUZETTBJc1UwRkJUeXhMUVVGTExFMUJRVXdzUjBGQll5eFJRVUZrTEVOQlFYVkNMRVZCUVhaQ0xFVkJRVEpDTEUxQlFUTkNMRU5CUVd0RExFTkJRV3hETEVWQlFYRkRMRVZCUVhKRExFTkJRVkE3UVVGRFJEczdRVUZGVFN4VFFVRlRMR2xDUVVGVUxFTkJRVEpDTEUxQlFUTkNMRVZCUVcxRExGZEJRVzVETEVWQlFXZEVPMEZCUTNKRUxGTkJRVThzVlVGQlZTeFhRVUZYTEZGQlFUVkNMRVZCUVhORExGTkJRVk1zVDBGQlR5eFZRVUYwUkN4RlFVRnJSVHRCUVVOb1JTeFJRVUZKTEU5QlFVOHNVMEZCVUN4RFFVRnBRaXhSUVVGcVFpeERRVUV3UWl4WFFVRXhRaXhEUVVGS0xFVkJRVFJETzBGQlF6RkRMR0ZCUVU4c1RVRkJVRHRCUVVORU8wRkJRMFk3TzBGQlJVUXNVMEZCVHl4SlFVRlFPMEZCUTBRN08wRkJSMDBzVTBGQlV5eGpRVUZVTEVOQlFYZENMRTFCUVhoQ0xFVkJRV2RETEZGQlFXaERMRVZCUVRCRE8wRkJReTlETEZOQlFVOHNWVUZCVlN4WFFVRlhMRkZCUVRWQ0xFVkJRWE5ETEZOQlFWTXNUMEZCVHl4VlFVRjBSQ3hGUVVGclJUdEJRVU5vUlN4UlFVRkpMRTlCUVU4c1dVRkJVQ3hEUVVGdlFpeEpRVUZ3UWl4TlFVRTRRaXhSUVVGc1F5eEZRVUUwUXp0QlFVTXhReXhoUVVGUExFMUJRVkE3UVVGRFJEdEJRVU5HT3p0QlFVVkVMRk5CUVU4c1NVRkJVRHRCUVVORU96dEJRVVZOTEZOQlFWTXNaMEpCUVZRc1EwRkJNRUlzVFVGQk1VSXNSVUZCYTBNc1NVRkJiRU1zUlVGQmQwTTdRVUZETjBNc1UwRkJUeXhWUVVGVkxGZEJRVmNzVVVGQk5VSXNSVUZCYzBNc1UwRkJVeXhQUVVGUExGVkJRWFJFTEVWQlFXdEZPMEZCUTJoRkxGRkJRVWtzVDBGQlR5eFpRVUZRTEVOQlFXOUNMRWxCUVhCQ0xFMUJRVGhDTEVsQlFXeERMRVZCUVhkRE8wRkJRM1JETEdGQlFVOHNUVUZCVUR0QlFVTkVPMEZCUTBZN08wRkJSVVFzVTBGQlR5eEpRVUZRTzBGQlEwUTdPenM3T3pzN096czdPenM3UVVOcVJFUTdPenM3UVVGRFFUczdPenRCUVVOQk96dEJRVU5CT3pzN096czdPenNyWlVGU1FUczdPenM3T3p0QlFWVkJMRWxCUVUwc1dVRkJZU3haUVVGTk8wRkJRM1pDT3pzN096czdRVUZOUVN4TlFVRk5MRTlCUVU4c1YwRkJZanRCUVVOQkxFMUJRVTBzVlVGQlZTeFBRVUZvUWp0QlFVTkJMRTFCUVUwc2NVSkJRWEZDTzBGQlEzcENMR0ZCUVZNN1FVRkVaMElzUjBGQk0wSTdRVUZIUVN4TlFVRk5MSGRDUVVGM1FpeEZRVUU1UWpzN1FVRkhRVHM3T3pzN08wRkJablZDTEUxQmNVSnFRaXhUUVhKQ2FVSTdRVUZCUVRzN1FVRjFRbkpDTEhsQ1FVRXdRanRCUVVGQkxGVkJRV1FzVDBGQll5eDFSVUZCU2l4RlFVRkpPenRCUVVGQk96dEJRVUZCTEhkSVFVTnNRaXhKUVVSclFpeEZRVU5hTEU5QlJGa3NSVUZEU0N4clFrRkVSeXhGUVVOcFFpeFBRVVJxUWl4RlFVTXdRaXh4UWtGRU1VSXNSVUZEYVVRc1MwRkVha1FzUlVGRGQwUXNTMEZFZUVRN08wRkJSM2hDTEZsQlFVc3NVMEZCVEN4SFFVRnBRaXhGUVVGcVFqczdRVUZGUVN4VlFVRk5MRlZCUVZVc1RVRkJTeXhQUVVGTUxFTkJRV0VzVDBGQllpeERRVUZ4UWl4blFrRkJja0lzYjBKQlFYVkVMRWxCUVhaRUxGRkJRV2hDTzBGQlEwRXNXVUZCVFN4SlFVRk9MRU5CUVZjc1QwRkJXQ3hGUVVGdlFpeFBRVUZ3UWl4RFFVRTBRaXhWUVVGRExFMUJRVVFzUlVGQldUdEJRVU4wUXl4WlFVRk5MR0ZCUVdFc1QwRkJUeXhaUVVGUUxFTkJRVzlDTEUxQlFYQkNMRU5CUVc1Q08wRkJRMEVzV1VGQlRTeFhRVUZYTEZOQlFWTXNZVUZCVkN4RFFVRjFRaXhWUVVGMlFpeERRVUZxUWpzN1FVRkZRU3haUVVGSkxGRkJRVW9zUlVGQll6dEJRVU5hTEdkQ1FVRkxMRmRCUVV3c1EwRkJhVUlzVVVGQmFrSTdRVUZEUkR0QlFVTkdMRTlCVUVRN1FVRk9kMEk3UVVGamVrSTdPMEZCY2tOdlFqdEJRVUZCTzBGQlFVRXNjVU5CZFVOT0xFdEJka05OTEVWQmRVTkRPMEZCUTNCQ0xGbEJRVTBzUzBGQlN5eE5RVUZOTEUxQlFVNHNRMEZCWVN4WlFVRmlMRU5CUVRCQ0xFMUJRVEZDTEVOQlFWZzdRVUZEUVN4WlFVRk5MRlZCUVZVc1UwRkJVeXhoUVVGVUxFTkJRWFZDTEVWQlFYWkNMRU5CUVdoQ096dEJRVVZCTEdGQlFVc3NXVUZCVEN4RFFVRnJRaXhQUVVGc1FqdEJRVU5FTzBGQk5VTnZRanRCUVVGQk8wRkJRVUVzYTBOQk9FTlVMRTlCT1VOVExFVkJPRU5CTzBGQlEyNUNMRmxCUVUwc1YwRkJWeXgxUWtGQllUdEJRVU0xUWp0QlFVUTBRaXhUUVVGaUxFTkJRV3BDTzBGQlIwRXNZVUZCU3l4VFFVRk1MRU5CUVdVc1NVRkJaaXhEUVVGdlFpeFJRVUZ3UWpzN1FVRkZRU3hsUVVGUExGRkJRVkE3UVVGRFJEdEJRWEpFYjBJN1FVRkJRVHRCUVVGQkxHdERRWFZFVkN4UFFYWkVVeXhGUVhWRVFUdEJRVU51UWl4WlFVRkpMRmRCUVZjc1MwRkJTeXhUUVVGTUxFTkJRV1VzU1VGQlppeERRVUZ2UWp0QlFVRkJMR2xDUVVGTExFVkJRVVVzVDBGQlJpeERRVUZWTEU5QlFWWXNRMEZCYTBJc1dVRkJiRUlzUTBGQkswSXNTVUZCTDBJc1RVRkJlVU1zVVVGQlVTeFpRVUZTTEVOQlFYRkNMRWxCUVhKQ0xFTkJRVGxETzBGQlFVRXNVMEZCY0VJc1EwRkJaanM3UVVGRlFTeFpRVUZKTEVOQlFVTXNVVUZCVEN4RlFVRmxPMEZCUTJJN1FVRkRRU3h4UWtGQlZ5eExRVUZMTEZkQlFVd3NSVUZCV0R0QlFVTkVPenRCUVVWRUxHVkJRVThzVVVGQlVEdEJRVU5FTzBGQmFFVnZRanRCUVVGQk8wRkJRVUVzY1VOQmEwVk9PMEZCUTJJc1pVRkJUeXhMUVVGTExGTkJRVm83UVVGRFJEdEJRWEJGYjBJN1FVRkJRVHRCUVVGQkxHMURRWE5GVWl4WlFYUkZVU3hGUVhORlRUdEJRVU42UWl4WlFVRk5MRmRCUVZjc1MwRkJTeXhYUVVGTUxFTkJRV2xDTEZsQlFXcENMRU5CUVdwQ08wRkJRMEVzWVVGQlN5eFRRVUZNTEVOQlFXVXNUMEZCWml4RFFVRjFRaXhWUVVGRExFTkJRVVFzUlVGQlR6dEJRVU0xUWl4alFVRkpMRVZCUVVVc1QwRkJSaXhEUVVGVkxFOUJRVllzUTBGQmEwSXNXVUZCYkVJc1EwRkJLMElzU1VGQkwwSXNUVUZCZVVNc1lVRkJZU3haUVVGaUxFTkJRVEJDTEVsQlFURkNMRU5CUVRkRExFVkJRVGhGTzBGQlF6VkZMR05CUVVVc1NVRkJSanRCUVVORUxGZEJSa1FzVFVGRlR6dEJRVU5NTEhGQ1FVRlRMRTFCUVZRN1FVRkRSRHRCUVVOR0xGTkJUa1E3UVVGUFJEdEJRUzlGYjBJN1FVRkJRVHRCUVVGQkxESkNRV2xHYUVJc1ZVRnFSbWRDTEVWQmFVWktPMEZCUTJZc1dVRkJTU3hYUVVGWExGVkJRV1k3UVVGRFFTeFpRVUZKTEU5QlFVOHNWVUZCVUN4TFFVRnpRaXhSUVVFeFFpeEZRVUZ2UXp0QlFVTnNReXh4UWtGQlZ5eFRRVUZUTEdGQlFWUXNRMEZCZFVJc1ZVRkJka0lzUTBGQldEdEJRVU5FT3p0QlFVVkVMRmxCUVVrc1EwRkJReXhSUVVGTUxFVkJRV1U3UVVGRFlpeG5Ra0ZCVFN4SlFVRkpMRXRCUVVvc1EwRkJZU3hKUVVGaUxEQkNRVUZ6UXl4VlFVRjBReXhwUTBGQlRqdEJRVU5FT3p0QlFVVkVMR0ZCUVVzc1dVRkJUQ3hEUVVGclFpeFJRVUZzUWpzN1FVRkZRU3hsUVVGUExFbEJRVkE3UVVGRFJEdEJRVGxHYjBJN1FVRkJRVHRCUVVGQkxESkNRV2RIYUVJc1ZVRm9SMmRDTEVWQlowZEtPMEZCUTJZc1dVRkJTU3hYUVVGWExGVkJRV1k3UVVGRFFTeFpRVUZKTEU5QlFVOHNWVUZCVUN4TFFVRnpRaXhSUVVFeFFpeEZRVUZ2UXp0QlFVTnNReXh4UWtGQlZ5eFRRVUZUTEdGQlFWUXNRMEZCZFVJc1ZVRkJka0lzUTBGQldEdEJRVU5FT3p0QlFVVkVMRmxCUVVrc1EwRkJReXhSUVVGTUxFVkJRV1U3UVVGRFlpeG5Ra0ZCVFN4SlFVRkpMRXRCUVVvc1EwRkJZU3hKUVVGaUxEQkNRVUZ6UXl4VlFVRjBReXhwUTBGQlRqdEJRVU5FT3p0QlFVVkVMRmxCUVUwc1kwRkJZeXhMUVVGTExGZEJRVXdzUTBGQmFVSXNVVUZCYWtJc1EwRkJjRUk3UVVGRFFTeGxRVUZQTEZsQlFWa3NTVUZCV2l4RlFVRlFPMEZCUTBRN1FVRTFSMjlDTzBGQlFVRTdRVUZCUVN4dFEwRTRSMFE3UVVGRGJFSXNaVUZCVHl4SlFVRlFPMEZCUTBRN1FVRm9TRzlDTzBGQlFVRTdRVUZCUVN4dlEwRnJTRUVzVDBGc1NFRXNSVUZyU0ZNN1FVRkROVUlzSzBkQlFUSkNMRk5CUVROQ0xFVkJRWE5ETEU5QlFYUkRPMEZCUTBRN1FVRndTRzlDT3p0QlFVRkJPMEZCUVVFN08wRkJkVWgyUWpzN096czdPenRCUVV0QkxFMUJRVTBzWVVGQllTeEZRVUZ1UWpzN1FVRkZRU3hOUVVGTkxHRkJRV0VzVTBGQlV5eG5Ra0ZCVkN4UFFVRTRRaXhKUVVFNVFpeERRVUZ1UWp0QlFVTkJMRTFCUVVrc1ZVRkJTaXhGUVVGblFqdEJRVU5rTEZWQlFVMHNTVUZCVGl4RFFVRlhMRlZCUVZnc1JVRkJkVUlzVDBGQmRrSXNRMEZCSzBJc1ZVRkJReXhQUVVGRUxFVkJRV0U3UVVGRE1VTXNWVUZCVFN4VFFVRlRMREpEUVVGdlFpeFBRVUZ3UWl4RlFVRTJRaXhyUWtGQk4wSXNSVUZCYVVRc2NVSkJRV3BFTEVOQlFXWTdRVUZEUVN4aFFVRlBMRTlCUVZBc1IwRkJhVUlzVDBGQmFrSTdPMEZCUlVFc2FVSkJRVmNzU1VGQldDeERRVUZuUWl4VlFVRlZMR0ZCUVZZc1EwRkJkMElzVFVGQmVFSXNRMEZCYUVJN1FVRkRSQ3hMUVV4RU8wRkJUVVE3TzBGQlJVUXNUVUZCU1N4VlFVRktMRVZCUVdkQ08wRkJRMlFzWVVGQlV5eG5Ra0ZCVkN4RFFVRXdRaXhQUVVFeFFpeEZRVUZ0UXl4VlFVRkRMRXRCUVVRc1JVRkJWenRCUVVNMVF5eFZRVUZOTEdsQ1FVRnBRaXhOUVVGTkxFMUJRVTRzUTBGQllTeFpRVUZpTEVOQlFUQkNMR0ZCUVRGQ0xFTkJRWFpDTzBGQlEwRXNWVUZCU1N4clFrRkJhMElzYlVKQlFXMUNMRWxCUVhwRExFVkJRU3RETzBGQlF6ZERMRmxCUVUwc1lVRkJZU3hOUVVGTkxFMUJRVTRzUTBGQllTeFpRVUZpTEVOQlFUQkNMR0ZCUVRGQ0xFdEJRVFJETEUxQlFVMHNUVUZCVGl4RFFVRmhMRmxCUVdJc1EwRkJNRUlzVFVGQk1VSXNRMEZCTDBRN1FVRkRRU3haUVVGTkxHRkJRV0VzVTBGQlV5eGhRVUZVTEVOQlFYVkNMRlZCUVhaQ0xFTkJRVzVDT3p0QlFVVkJMRmxCUVUwc1dVRkJXU3c0UWtGQmEwSXNUVUZCVFN4TlFVRjRRaXhGUVVGblF5eFhRVUZvUXl4RFFVRnNRanM3UVVGRlFTeFpRVUZKTEdOQlFXTXNTVUZCYkVJc1JVRkJkMEk3UVVGRGRFSTdRVUZEUkRzN1FVRkZSQ3haUVVGTkxHTkJRV01zVlVGQlZTeFpRVUZXTEVOQlFYVkNMRWxCUVhaQ0xFTkJRWEJDTzBGQlEwRXNXVUZCVFN4WlFVRlpMRmRCUVZjc1NVRkJXQ3hEUVVGblFqdEJRVUZCTEdsQ1FVRkxMRVZCUVVVc1ZVRkJSaXhIUVVGbExGbEJRV1lzUTBGQk5FSXNTVUZCTlVJc1RVRkJjME1zVjBGQk0wTTdRVUZCUVN4VFFVRm9RaXhEUVVGc1FqczdRVUZGUVN4WlFVRkpMRU5CUVVNc1UwRkJUQ3hGUVVGblFqdEJRVU5rTzBGQlEwUTdPMEZCUlVRN1FVRkRRU3haUVVGTkxHbENRVUZwUWl4VlFVRlZMRmxCUVZZc1IwRkJlVUlzU1VGQmVrSXNRMEZCT0VJN1FVRkJRU3hwUWtGQlN5eEZRVUZGTEZWQlFVWXNUMEZCYlVJc1ZVRkJlRUk3UVVGQlFTeFRRVUU1UWl4RFFVRjJRanRCUVVOQkxGbEJRVWtzUTBGQlF5eGpRVUZNTEVWQlFYRkNPMEZCUTI1Q0xHOUNRVUZWTEZkQlFWWXNRMEZCYzBJc1ZVRkJkRUk3UVVGRFJEczdRVUZGUkN4clFrRkJWU3hKUVVGV0xFTkJRV1VzVlVGQlpqdEJRVU5FTzBGQlEwWXNTMEV6UWtRN1FVRTBRa1E3TzBGQlJVUXNVMEZCVHl4VFFVRlFPMEZCUTBRc1EwRjRTMmxDTEVWQlFXeENPenRyUWtFd1MyVXNVenM3T3pzN096czdPenM3T3p0QlF5OUxaanM3T3p0QlFVTkJPenRCUVVOQk96czdPMEZCUTBFN096czdPenM3T3l0bFFWSkJPenM3T3pzN08wRkJWVUVzU1VGQlRTeFhRVUZaTEZsQlFVMDdRVUZEZEVJN096czdPenRCUVUxQkxFMUJRVTBzVDBGQlR5eFZRVUZpTzBGQlEwRXNUVUZCVFN4VlFVRlZMRTlCUVdoQ08wRkJRMEVzVFVGQlRTeHhRa0ZCY1VJN1FVRkRla0lzWVVGQlV5eEpRVVJuUWp0QlFVVjZRaXhaUVVGUk8wRkJSbWxDTEVkQlFUTkNPMEZCU1VFc1RVRkJUU3gzUWtGQmQwSXNRMEZETlVJc1VVRkVORUlzUTBGQk9VSTdPMEZCU1VFN096czdPenRCUVdwQ2MwSXNUVUYxUW1oQ0xGRkJka0puUWp0QlFVRkJPenRCUVhsQ2NFSXNkMEpCUVRCQ08wRkJRVUVzVlVGQlpDeFBRVUZqTEhWRlFVRktMRVZCUVVrN08wRkJRVUU3TzBGQlFVRXNjMGhCUTJ4Q0xFbEJSR3RDTEVWQlExb3NUMEZFV1N4RlFVTklMR3RDUVVSSExFVkJRMmxDTEU5QlJHcENMRVZCUXpCQ0xIRkNRVVF4UWl4RlFVTnBSQ3hMUVVScVJDeEZRVU4zUkN4TFFVUjRSRHM3UVVGSGVFSXNXVUZCU3l4WlFVRk1MRWRCUVc5Q0xFdEJRWEJDT3p0QlFVVkJPMEZCUTBFc1ZVRkJTU3hOUVVGTExFOUJRVXdzUTBGQllTeE5RVUZxUWl4RlFVRjVRanRCUVVOMlFpeGpRVUZMTEVsQlFVdzdRVUZEUkR0QlFWSjFRanRCUVZONlFqczdRVUZzUTIxQ08wRkJRVUU3UVVGQlFTeHJRMEZ2UTFJN1FVRkRWaXhsUVVGUExFdEJRVXNzVDBGQlRDeERRVUZoTEU5QlFXSXNRMEZCY1VJc2NVSkJRWEpDTEVOQlFUSkRMRXRCUVVzc1QwRkJUQ3hEUVVGaExFOUJRWGhFTEVWQlFXbEZMRTFCUVhoRk8wRkJRMFE3UVVGMFEyMUNPMEZCUVVFN1FVRkJRU3dyUWtGM1ExZzdRVUZEVUN4WlFVRkpMRXRCUVVzc1QwRkJUQ3hEUVVGaExFOUJRV0lzUTBGQmNVSXNVMEZCY2tJc1EwRkJLMElzVVVGQkwwSXNRMEZCZDBNc1RVRkJlRU1zUTBGQlNpeEZRVUZ4UkR0QlFVTnVSQ3hwUWtGQlR5eExRVUZMTEVsQlFVd3NSVUZCVUR0QlFVTkVPenRCUVVWRUxHVkJRVThzUzBGQlN5eEpRVUZNTEVWQlFWQTdRVUZEUkR0QlFUbERiVUk3UVVGQlFUdEJRVUZCTERaQ1FXZEVZanRCUVVGQk96dEJRVU5NTEZsQlFVa3NTMEZCU3l4WlFVRlVMRVZCUVhWQ08wRkJRM0pDTEdsQ1FVRlBMRXRCUVZBN1FVRkRSRHM3UVVGRlJDeFpRVUZKTEV0QlFVc3NUMEZCVEN4RFFVRmhMRTlCUVdJc1EwRkJjVUlzVTBGQmNrSXNRMEZCSzBJc1VVRkJMMElzUTBGQmQwTXNUVUZCZUVNc1EwRkJTaXhGUVVGeFJEdEJRVU51UkN4cFFrRkJUeXhMUVVGUU8wRkJRMFE3TzBGQlJVUXNZVUZCU3l4WlFVRk1MRWRCUVc5Q0xFbEJRWEJDT3p0QlFVVkJMRmxCUVUwc1kwRkJZeXhUUVVGa0xGZEJRV01zUjBGQlRUdEJRVU40UWl4cFFrRkJTeXhQUVVGTUxFTkJRV0VzVDBGQllpeERRVUZ4UWl4VFFVRnlRaXhEUVVFclFpeEhRVUV2UWl4RFFVRnRReXhOUVVGdVF6dEJRVU5CTEdsQ1FVRkxMRTlCUVV3c1EwRkJZU3hQUVVGaUxFTkJRWEZDTEZOQlFYSkNMRU5CUVN0Q0xFMUJRUzlDTEVOQlFYTkRMRmxCUVhSRE8wRkJRMEVzYVVKQlFVc3NUMEZCVEN4RFFVRmhMRTlCUVdJc1EwRkJjVUlzYlVKQlFYSkNMRU5CUVhsRExHbENRVUZOTEdOQlFTOURMRVZCUVN0RUxGZEJRUzlFT3p0QlFVVkJMR2xDUVVGTExFOUJRVXdzUTBGQllTeFBRVUZpTEVOQlFYRkNMRmxCUVhKQ0xFTkJRV3RETEdWQlFXeERMRVZCUVcxRUxFbEJRVzVFT3p0QlFVVkJMR2xDUVVGTExGbEJRVXdzUjBGQmIwSXNTMEZCY0VJN1FVRkRSQ3hUUVZKRU96dEJRVlZCTEZsQlFVa3NRMEZCUXl4TFFVRkxMRTlCUVV3c1EwRkJZU3hQUVVGaUxFTkJRWEZDTEZOQlFYSkNMRU5CUVN0Q0xGRkJRUzlDTEVOQlFYZERMRmxCUVhoRExFTkJRVXdzUlVGQk5FUTdRVUZETVVRc1pVRkJTeXhQUVVGTUxFTkJRV0VzVDBGQllpeERRVUZ4UWl4VFFVRnlRaXhEUVVFclFpeEhRVUV2UWl4RFFVRnRReXhaUVVGdVF6dEJRVU5FT3p0QlFVVkVMR0ZCUVVzc1QwRkJUQ3hEUVVGaExFOUJRV0lzUTBGQmNVSXNaMEpCUVhKQ0xFTkJRWE5ETEdsQ1FVRk5MR05CUVRWRExFVkJRVFJFTEZkQlFUVkVPenRCUVVWQkxGbEJRVTBzVTBGQlV5eExRVUZMTEZOQlFVd3NSVUZCWmpzN1FVRkZRU3hoUVVGTExFOUJRVXdzUTBGQllTeFBRVUZpTEVOQlFYRkNMRXRCUVhKQ0xFTkJRVEpDTEUxQlFUTkNMRWRCUVc5RExFdEJRWEJET3p0QlFVVkJMRzFDUVVGWExGbEJRVTA3UVVGRFppeHBRa0ZCU3l4UFFVRk1MRU5CUVdFc1QwRkJZaXhEUVVGeFFpeExRVUZ5UWl4RFFVRXlRaXhOUVVFelFpeEhRVUYxUXl4TlFVRjJRenRCUVVORUxGTkJSa1FzUlVGRlJ5eEZRVVpJT3p0QlFVbEJMR1ZCUVU4c1NVRkJVRHRCUVVORU8wRkJjRVp0UWp0QlFVRkJPMEZCUVVFc05rSkJjMFppTzBGQlFVRTdPMEZCUTB3c1dVRkJTU3hMUVVGTExGbEJRVlFzUlVGQmRVSTdRVUZEY2tJc2FVSkJRVThzUzBGQlVEdEJRVU5FT3p0QlFVVkVMRmxCUVVrc1EwRkJReXhMUVVGTExFOUJRVXdzUTBGQllTeFBRVUZpTEVOQlFYRkNMRk5CUVhKQ0xFTkJRU3RDTEZGQlFTOUNMRU5CUVhkRExFMUJRWGhETEVOQlFVd3NSVUZCYzBRN1FVRkRjRVFzYVVKQlFVOHNTMEZCVUR0QlFVTkVPenRCUVVWRUxHRkJRVXNzV1VGQlRDeEhRVUZ2UWl4SlFVRndRanM3UVVGRlFTeFpRVUZOTEdOQlFXTXNVMEZCWkN4WFFVRmpMRWRCUVUwN1FVRkRlRUlzYVVKQlFVc3NUMEZCVEN4RFFVRmhMRTlCUVdJc1EwRkJjVUlzVTBGQmNrSXNRMEZCSzBJc1RVRkJMMElzUTBGQmMwTXNXVUZCZEVNN1FVRkRRU3hwUWtGQlN5eFBRVUZNTEVOQlFXRXNUMEZCWWl4RFFVRnhRaXhMUVVGeVFpeERRVUV5UWl4TlFVRXpRaXhIUVVGdlF5eE5RVUZ3UXp0QlFVTkJMR2xDUVVGTExFOUJRVXdzUTBGQllTeFBRVUZpTEVOQlFYRkNMRzFDUVVGeVFpeERRVUY1UXl4cFFrRkJUU3hqUVVFdlF5eEZRVUVyUkN4WFFVRXZSRHM3UVVGRlFTeHBRa0ZCU3l4UFFVRk1MRU5CUVdFc1QwRkJZaXhEUVVGeFFpeFpRVUZ5UWl4RFFVRnJReXhsUVVGc1F5eEZRVUZ0UkN4TFFVRnVSRHM3UVVGRlFTeHBRa0ZCU3l4WlFVRk1MRWRCUVc5Q0xFdEJRWEJDTzBGQlEwUXNVMEZTUkRzN1FVRlZRU3hoUVVGTExFOUJRVXdzUTBGQllTeFBRVUZpTEVOQlFYRkNMRXRCUVhKQ0xFTkJRVEpDTEUxQlFUTkNMRWRCUVc5RExFdEJRWEJET3p0QlFVVkJMRmxCUVVrc1EwRkJReXhMUVVGTExFOUJRVXdzUTBGQllTeFBRVUZpTEVOQlFYRkNMRk5CUVhKQ0xFTkJRU3RDTEZGQlFTOUNMRU5CUVhkRExGbEJRWGhETEVOQlFVd3NSVUZCTkVRN1FVRkRNVVFzWlVGQlN5eFBRVUZNTEVOQlFXRXNUMEZCWWl4RFFVRnhRaXhUUVVGeVFpeERRVUVyUWl4SFFVRXZRaXhEUVVGdFF5eFpRVUZ1UXp0QlFVTkVPenRCUVVWRUxHRkJRVXNzVDBGQlRDeERRVUZoTEU5QlFXSXNRMEZCY1VJc1owSkJRWEpDTEVOQlFYTkRMR2xDUVVGTkxHTkJRVFZETEVWQlFUUkVMRmRCUVRWRU96dEJRVVZCTEdGQlFVc3NUMEZCVEN4RFFVRmhMRTlCUVdJc1EwRkJjVUlzVTBGQmNrSXNRMEZCSzBJc1RVRkJMMElzUTBGQmMwTXNUVUZCZEVNN08wRkJSVUVzWlVGQlR5eEpRVUZRTzBGQlEwUTdRVUYwU0cxQ08wRkJRVUU3UVVGQlFTeHRRMEYzU0VFN1FVRkRiRUlzWlVGQlR5eEpRVUZRTzBGQlEwUTdRVUV4U0cxQ08wRkJRVUU3UVVGQlFTeHZRMEUwU0VNc1QwRTFTRVFzUlVFMFNGVTdRVUZETlVJc05rZEJRVEpDTEZGQlFUTkNMRVZCUVhGRExFOUJRWEpETzBGQlEwUTdRVUU1U0cxQ096dEJRVUZCTzBGQlFVRTdPMEZCYVVsMFFqczdPenM3T3p0QlFVdEJMRTFCUVUwc1lVRkJZU3hGUVVGdVFqczdRVUZGUVN4TlFVRk5MRmxCUVZrc1UwRkJVeXhuUWtGQlZDeFBRVUU0UWl4SlFVRTVRaXhEUVVGc1FqdEJRVU5CTEUxQlFVa3NVMEZCU2l4RlFVRmxPMEZCUTJJc1kwRkJWU3hQUVVGV0xFTkJRV3RDTEZWQlFVTXNUMEZCUkN4RlFVRmhPMEZCUXpkQ08wRkJRMEVzVlVGQlRTeFRRVUZUTERKRFFVRnZRaXhQUVVGd1FpeEZRVUUyUWl4clFrRkJOMElzUlVGQmFVUXNjVUpCUVdwRUxFTkJRV1k3UVVGRFFTeGhRVUZQTEU5QlFWQXNSMEZCYVVJc1QwRkJha0k3TzBGQlJVRXNhVUpCUVZjc1NVRkJXQ3hEUVVGblFpeFRRVUZUTEdGQlFWUXNRMEZCZFVJc1RVRkJka0lzUTBGQmFFSTdRVUZEUkN4TFFVNUVPMEZCVDBRN08wRkJSVVFzVFVGQlNTeFRRVUZLTEVWQlFXVTdRVUZEWWl4aFFVRlRMR2RDUVVGVUxFTkJRVEJDTEU5QlFURkNMRVZCUVcxRExGVkJRVU1zUzBGQlJDeEZRVUZYTzBGQlF6VkRMRlZCUVUwc1UwRkJVeXcyUWtGQmFVSXNUVUZCVFN4TlFVRjJRaXhGUVVFclFpeGhRVUV2UWl4RFFVRm1PMEZCUTBFc1ZVRkJTU3hEUVVGRExFMUJRVXdzUlVGQllUdEJRVU5ZTzBGQlEwUTdPMEZCUlVRc1ZVRkJUU3hwUWtGQmFVSXNUMEZCVHl4WlFVRlFMRU5CUVc5Q0xHRkJRWEJDTEVOQlFYWkNPenRCUVVWQkxGVkJRVWtzYTBKQlFXdENMRzFDUVVGdFFpeEpRVUY2UXl4RlFVRXJRenRCUVVNM1F5eFpRVUZKTEV0QlFVc3NUMEZCVHl4WlFVRlFMRU5CUVc5Q0xHRkJRWEJDTEV0QlFYTkRMRTlCUVU4c1dVRkJVQ3hEUVVGdlFpeE5RVUZ3UWl4RFFVRXZRenRCUVVOQkxHRkJRVXNzUjBGQlJ5eFBRVUZJTEVOQlFWY3NSMEZCV0N4RlFVRm5RaXhGUVVGb1FpeERRVUZNT3p0QlFVVkJMRmxCUVUwc1dVRkJXU3hYUVVGWExFbEJRVmdzUTBGQlowSTdRVUZCUVN4cFFrRkJTeXhGUVVGRkxGVkJRVVlzUjBGQlpTeFpRVUZtTEVOQlFUUkNMRWxCUVRWQ0xFMUJRWE5ETEVWQlFUTkRPMEZCUVVFc1UwRkJhRUlzUTBGQmJFSTdPMEZCUlVFc1dVRkJTU3hEUVVGRExGTkJRVXdzUlVGQlowSTdRVUZEWkR0QlFVTkVPenRCUVVWRUxHdENRVUZWTEUxQlFWWTdRVUZEUkR0QlFVTkdMRXRCY0VKRU8wRkJjVUpFT3p0QlFVVkVMRk5CUVU4c1VVRkJVRHRCUVVORUxFTkJOVXRuUWl4RlFVRnFRanM3YTBKQk9FdGxMRkU3T3pzN096czdPenR4YWtKRGVFeG1PenM3T3pzN08wRkJTMEU3TzBGQlEwRTdPMEZCUTBFN096czdRVUZEUVRzN096czdPenM3UVVGRlFUczdPenM3TzBsQlRYRkNMRk03UVVGRmJrSXNjVUpCUVZrc1NVRkJXaXhGUVVGclFpeFBRVUZzUWl4RlFVRnRTVHRCUVVGQkxGRkJRWGhITEdOQlFYZEhMSFZGUVVGMlJpeEZRVUYxUmp0QlFVRkJMRkZCUVc1R0xFOUJRVzFHTEhWRlFVRjZSU3hGUVVGNVJUdEJRVUZCTEZGQlFYSkZMRmRCUVhGRkxIVkZRVUYyUkN4RlFVRjFSRHM3UVVGQlFUczdRVUZCUVN4UlFVRnVSQ3h4UWtGQmJVUXNkVVZCUVROQ0xFdEJRVEpDTzBGQlFVRXNVVUZCY0VJc1ZVRkJiMElzZFVWQlFWQXNTMEZCVHpzN1FVRkJRVHM3UVVGRGFra3NVMEZCU3l4SlFVRk1MRWRCUVZrc1NVRkJXanRCUVVOQkxGTkJRVXNzVDBGQlRDeEhRVUZsTEU5QlFXWTdRVUZEUVN4VFFVRkxMRTlCUVV3c1IwRkJaU3hQUVVGbU96dEJRVVZCTzBGQlEwRTdRVUZEUVN4WFFVRlBMRWxCUVZBc1EwRkJXU3hqUVVGYUxFVkJRVFJDTEU5QlFUVkNMRU5CUVc5RExGVkJRVU1zU1VGQlJDeEZRVUZWTzBGQlF6VkRMRlZCUVVrc1QwRkJUeXhOUVVGTExFOUJRVXdzUTBGQllTeEpRVUZpTEVOQlFWQXNTMEZCT0VJc1YwRkJiRU1zUlVGQkswTTdRVUZETjBNc1kwRkJTeXhQUVVGTUxFTkJRV0VzU1VGQllpeEpRVUZ4UWl4bFFVRmxMRWxCUVdZc1EwRkJja0k3UVVGRFJEdEJRVU5HTEV0QlNrUTdPMEZCVFVFc1UwRkJTeXhYUVVGTUxFZEJRVzFDTEZkQlFXNUNPMEZCUTBFc1UwRkJTeXh4UWtGQlRDeEhRVUUyUWl4eFFrRkJOMEk3UVVGRFFTeFRRVUZMTEZWQlFVd3NSMEZCYTBJc1ZVRkJiRUk3UVVGRFFTeFRRVUZMTEVWQlFVd3NSMEZCVlN4M1FrRkJWanM3UVVGRlFTeFJRVUZOTEdWQlFXVXNRMEZCUXl4TFFVRkxMSEZDUVVGT0xFbEJRU3RDTEV0QlFVc3NUMEZCVEN4RFFVRmhMRTlCUVdJc1MwRkJlVUlzU1VGQk4wVTdPMEZCUlVFc1VVRkJTU3hQUVVGUExFdEJRVXNzVDBGQlRDeERRVUZoTEU5QlFYQkNMRXRCUVdkRExGRkJRWEJETEVWQlFUaERPMEZCUXpWRExGZEJRVXNzVDBGQlRDeERRVUZoTEU5QlFXSXNSMEZCZFVJc1UwRkJVeXhoUVVGVUxFTkJRWFZDTEV0QlFVc3NUMEZCVEN4RFFVRmhMRTlCUVhCRExFTkJRWFpDTzBGQlEwUTdPMEZCUlVRc1VVRkJTU3huUWtGQlowSXNRMEZCUXl4TFFVRkxMRTlCUVV3c1EwRkJZU3hQUVVGc1F5eEZRVUV5UXp0QlFVTjZReXhaUVVGTkxFbEJRVWtzUzBGQlNpeERRVUZoTEV0QlFVc3NTVUZCYkVJc2VVTkJRVTQ3UVVGRFJEczdRVUZGUkN4VFFVRkxMR05CUVV3c1IwRkJjMElzUzBGQlN5eFBRVUZNTEVOQlFXRXNUMEZCWWl4TFFVRjVRaXhKUVVFdlF6dEJRVU5CTEZOQlFVc3NhMEpCUVV3c1IwRkJNRUlzUlVGQk1VSTdPMEZCUlVFc1VVRkJTU3hEUVVGRExFdEJRVXNzWTBGQlZpeEZRVUV3UWp0QlFVTjRRanM3T3pzN096czdRVUZSUVN4WFFVRkxMRTlCUVV3c1IwRkJaU3hQUVVGUExFMUJRVkFzUTBGQll5eExRVUZMTEU5QlFXNUNMRVZCUVRSQ0xFdEJRVXNzWTBGQlRDeERRVUZ2UWl4TFFVRkxMR0ZCUVV3c1JVRkJjRUlzUlVGQk1FTXNUMEZCTVVNc1EwRkJOVUlzUTBGQlpqczdRVUZGUVR0QlFVTkJMRmRCUVVzc1lVRkJURHRCUVVORU96dEJRVVZFTEZOQlFVc3NaVUZCVEN4SFFVRjFRanRCUVVGQkxHRkJRVk1zVFVGQlN5eHZRa0ZCVEN4RFFVRXdRaXhMUVVFeFFpeERRVUZVTzBGQlFVRXNTMEZCZGtJN1FVRkRSRHM3T3p0dFEwRkZZeXhWTEVWQlFWa3NUeXhGUVVGVE8wRkJRMnhETEZkQlFVc3NWMEZCVEN4RFFVRnBRaXhQUVVGcVFpeERRVUY1UWl4VlFVRkRMRWRCUVVRc1JVRkJVenRCUVVOb1F5eFpRVUZKTEZGQlFWRXNSMEZCVWl4RFFVRktMRVZCUVd0Q08wRkJRMmhDTEhGQ1FVRlhMRWRCUVZnc1NVRkJhMElzVVVGQlVTeEhRVUZTTEVOQlFXeENPMEZCUTBRN1FVRkRSaXhQUVVwRU96dEJRVTFCTEdGQlFVOHNWVUZCVUR0QlFVTkVPenM3YVVOQlJWazdRVUZEV0N4aFFVRlBMRXRCUVVzc1QwRkJXanRCUVVORU96czdhVU5CUlZrN1FVRkRXQ3hoUVVGUExFdEJRVXNzVDBGQlRDeERRVUZoTEU5QlFYQkNPMEZCUTBRN096czBRa0ZGVHp0QlFVTk9MR0ZCUVU4c1MwRkJTeXhGUVVGYU8wRkJRMFE3T3p0eFEwRkZaMElzVVN4RlFVRlZPMEZCUVVFN08wRkJRM3BDTEdWQlFWTXNUMEZCVkN4RFFVRnBRanRCUVVGQkxHVkJRVmNzVDBGQlN5eGxRVUZNTEVOQlFYRkNMRTlCUVhKQ0xFTkJRVmc3UVVGQlFTeFBRVUZxUWp0QlFVTkVPenM3YjBOQlJXVXNUeXhGUVVGVE8wRkJRM1pDTEdOQlFWRXNUVUZCVWl4RFFVRmxMR2RDUVVGbUxFTkJRV2RETEZGQlFWRXNTMEZCZUVNc1JVRkJLME1zUzBGQlN5eGxRVUZ3UkR0QlFVTkJMRmRCUVVzc2EwSkJRVXdzUTBGQmQwSXNTVUZCZUVJc1EwRkJOa0lzVDBGQk4wSTdRVUZEUkRzN08zbERRVVZ2UWp0QlFVRkJPenRCUVVOdVFpeFhRVUZMTEd0Q1FVRk1MRU5CUVhkQ0xFOUJRWGhDTEVOQlFXZERMRlZCUVVNc1QwRkJSQ3hGUVVGaE8wRkJRek5ETEdWQlFVc3NhVUpCUVV3c1EwRkJkVUlzVDBGQmRrSTdRVUZEUkN4UFFVWkVPMEZCUjBRN096dHpRMEZGYVVJc1R5eEZRVUZUTzBGQlEzcENMRlZCUVUwc2VVSkJRWGxDTEV0QlFVc3NhMEpCUVV3c1EwRkROVUlzVTBGRU5FSXNRMEZEYkVJN1FVRkJRU3hsUVVGTkxFZEJRVWNzVFVGQlNDeExRVUZqTEZGQlFWRXNUVUZCZEVJc1NVRkJaME1zUjBGQlJ5eExRVUZJTEV0QlFXRXNVVUZCVVN4TFFVRXpSRHRCUVVGQkxFOUJSR3RDTEVOQlFTOUNPenRCUVVkQkxGVkJRVWtzZVVKQlFYbENMRU5CUVVNc1EwRkJPVUlzUlVGQmFVTTdRVUZETDBJc1owSkJRVkVzVFVGQlVpeERRVUZsTEcxQ1FVRm1MRU5CUVcxRExGRkJRVkVzUzBGQk0wTXNSVUZCYTBRc1MwRkJTeXhsUVVGMlJEdEJRVU5CTEdGQlFVc3NhMEpCUVV3c1EwRkJkMElzVFVGQmVFSXNRMEZCSzBJc2MwSkJRUzlDTEVWQlFYVkVMRU5CUVhaRU8wRkJRMFFzVDBGSVJDeE5RVWRQTzBGQlEwd3NaMEpCUVZFc1MwRkJVaXd5UTBGQmMwUXNVVUZCVVN4TlFVRTVSQ3h4UWtGQmIwWXNVVUZCVVN4TFFVRTFSanRCUVVORU8wRkJRMFk3T3p0cFEwRkZXU3hUTEVWQlFXbEVPMEZCUVVFc1ZVRkJkRU1zVFVGQmMwTXNkVVZCUVRkQ0xFVkJRVFpDTzBGQlFVRXNWVUZCZWtJc1pVRkJlVUlzZFVWQlFWQXNTMEZCVHpzN1FVRkROVVFzVlVGQlNTeFBRVUZQTEZOQlFWQXNTMEZCY1VJc1VVRkJla0lzUlVGQmJVTTdRVUZEYWtNc1kwRkJUU3hKUVVGSkxFdEJRVW9zUTBGQlZTdzRRa0ZCVml4RFFVRk9PMEZCUTBRN08wRkJSVVFzVlVGQlNTeExRVUZMTEZWQlFWUXNSVUZCY1VJN1FVRkRia0lzV1VGQlNTeGpRVUZqTEdsQ1FVRk5MRWxCUVhoQ0xFVkJRVGhDTzBGQlF6VkNMSEZEUVVGcFFpeEhRVUZxUWl4RFFVRnhRaXhKUVVGeVFqdEJRVU5FTEZOQlJrUXNUVUZGVHl4SlFVRkpMR05CUVdNc2FVSkJRVTBzU1VGQmVFSXNSVUZCT0VJN1FVRkRia01zY1VOQlFXbENMRTFCUVdwQ0xFTkJRWGRDTEVsQlFYaENPMEZCUTBRN1FVRkRSanM3UVVGRlJEdEJRVU5CTEZWQlFVMHNhMEpCUVd0Q0xGVkJRVlVzUzBGQlZpeERRVUZuUWl4SFFVRm9RaXhGUVVGeFFpeE5RVUZ5UWl4RFFVRTBRaXhWUVVGRExFZEJRVVFzUlVGQlRTeFBRVUZPTEVWQlFXVXNTMEZCWml4RlFVRjVRanRCUVVNelJTeFpRVUZKTEZWQlFWVXNRMEZCWkN4RlFVRnBRanRCUVVObUxHbENRVUZQTEU5QlFWQTdRVUZEUkRzN1FVRkZSQ3hsUVVGUExFMUJRVTBzVVVGQlVTeE5RVUZTTEVOQlFXVXNRMEZCWml4RlFVRnJRaXhYUVVGc1FpeEZRVUZPTEVkQlFYZERMRkZCUVZFc1MwRkJVaXhEUVVGakxFTkJRV1FzUTBGQkwwTTdRVUZEUkN4UFFVNTFRaXhEUVVGNFFqczdRVUZSUVN4VlFVRk5MSGRDUVVGelFpeG5Ra0ZCWjBJc1RVRkJhRUlzUTBGQmRVSXNRMEZCZGtJc1JVRkJNRUlzVjBGQk1VSXNSVUZCZEVJc1IwRkJaMFVzWjBKQlFXZENMRXRCUVdoQ0xFTkJRWE5DTEVOQlFYUkNMRU5CUVhSRk96dEJRVVZCTzBGQlEwRXNWVUZCU1N4UFFVRlBMRXRCUVVzc1QwRkJUQ3hEUVVGaExHVkJRV0lzUTBGQlVDeExRVUY1UXl4VlFVRTNReXhGUVVGNVJEdEJRVU4yUkN4aFFVRkxMRTlCUVV3c1EwRkJZU3hsUVVGaUxFVkJRVGhDTEV0QlFUbENMRU5CUVc5RExFbEJRWEJETEVWQlFUQkRMRU5CUVVNc1RVRkJSQ3hEUVVFeFF6dEJRVU5FT3p0QlFVVkVMRlZCUVVrc1QwRkJUeXhMUVVGTExFOUJRVXdzUTBGQllTeGpRVUZpTEVOQlFWQXNTMEZCZDBNc1ZVRkJOVU1zUlVGQmQwUTdRVUZEZEVRc1lVRkJTeXhQUVVGTUxFTkJRV0VzWTBGQllpeEZRVUUyUWl4TFFVRTNRaXhEUVVGdFF5eEpRVUZ1UXl4RlFVRjVReXhEUVVGRExFMUJRVVFzUTBGQmVrTTdRVUZEUkRzN1FVRkZSQ3hWUVVGSkxHVkJRVW9zUlVGQmNVSTdRVUZEYmtJN1FVRkRSRHM3UVVGRlJEdEJRVU5CTEZWQlFVa3NTMEZCU3l4UFFVRk1MRU5CUVdFc1QwRkJha0lzUlVGQk1FSTdRVUZEZUVJc05FTkJRWEZDTEV0QlFVc3NUMEZCVEN4RFFVRmhMRTlCUVd4RExFVkJRVEpETEZOQlFUTkRMRVZCUVhORUxFdEJRVXNzU1VGQk0wUXNSVUZCYVVVc1RVRkJha1U3UVVGRFJDeFBRVVpFTEUxQlJVODdRVUZEVEN3eVEwRkJiMElzVTBGQmNFSXNSVUZCSzBJc1MwRkJTeXhKUVVGd1F5eEZRVUV3UXl4TlFVRXhRenRCUVVORU8wRkJRMFk3T3p0dlEwRkZaVHRCUVVOa0xGVkJRVWtzUzBGQlN5eFhRVUZNTEVOQlFXbENMRTFCUVdwQ0xFZEJRVEJDTEVOQlFUbENMRVZCUVdsRE8wRkJReTlDTEcxRVFVRnZRaXhMUVVGTExFOUJRVXdzUTBGQllTeFBRVUZxUXl4RlFVRXdReXhMUVVGTExFOUJRUzlETEVWQlFYZEVMRXRCUVVzc1YwRkJOMFE3UVVGRFJEdEJRVU5HT3pzN2IwTkJSV1U3UVVGRFpDeFZRVUZOTEZWQlFWVXNUMEZCVHl4TlFVRlFMRU5CUVdNc1JVRkJaQ3hGUVVGclFpeExRVUZMTEU5QlFYWkNMRU5CUVdoQ08wRkJRMEVzWVVGQlR5d3lRMEZCYjBJc1MwRkJTeXhQUVVGTUxFTkJRV0VzVDBGQmFrTXNSVUZCTUVNc1QwRkJNVU1zUlVGQmJVUXNTMEZCU3l4WFFVRjRSQ3hEUVVGUU8wRkJRMFE3TzBGQlJVUTdPenM3T3pzN08zTkRRVXRyUWp0QlFVTm9RaXhoUVVGUExFdEJRVXNzVlVGQlRDeEpRVUZ0UWl4RFFVRkRMREpDUVVGcFFpeFJRVUZxUWl4RFFVRXdRaXhKUVVFeFFpeERRVUV6UWp0QlFVTkVPenM3ZVVOQlJXOUNMRXNzUlVGQlR6dEJRVU14UWl4VlFVRkpMRXRCUVVzc1pVRkJUQ3hGUVVGS0xFVkJRVFJDTzBGQlF6RkNPMEZCUTBRN08wRkJSVVFzVjBGQlN5eGpRVUZNTEVOQlFXOUNMRXRCUVhCQ08wRkJRMFE3T3p0dFEwRkZZeXhMTEVWQlFVODdRVUZEY0VJN1FVRkRSRHM3TzJsRFFVVnRRanRCUVVOc1FpeGhRVUZQTEV0QlFVc3NTVUZCV2p0QlFVTkVPenM3YTBOQlJXOUNMR01zUlVGQlowSXNUeXhGUVVGVE8wRkJRelZETEdGQlFVOHNTVUZCU1N4alFVRktMRU5CUVcxQ0xFOUJRVzVDTEVOQlFWQTdRVUZEUkRzN096czdPMnRDUVhaTWEwSXNVenM3T3pzN096czdPenM3VVVOU1RDeHRRaXhIUVVGQkxHMUNPMUZCZDBKQkxHMUNMRWRCUVVFc2JVSTdPMEZCTDBKb1FpeEpRVUZOTEdWQlFXVXNVMEZCWml4WlFVRmxMRU5CUVVNc1MwRkJSQ3hGUVVGUkxFMUJRVklzUlVGQmJVSTdRVUZEZEVNc1RVRkJTU3hWUVVGVkxFVkJRV1FzUlVGQmEwSTdRVUZEYUVJc2NVSkJRV1VzVFVGQlpqdEJRVU5FTzBGQlEwUXNiVUpCUVdVc1MwRkJaaXhUUVVGM1FpeE5RVUY0UWp0QlFVTkVMRU5CVEVRN08wRkJUMDhzVTBGQlV5eHRRa0ZCVkN4RFFVRTJRaXhQUVVFM1FpeEZRVUZ0UlR0QlFVRkJMRTFCUVRkQ0xFZEJRVFpDTEhWRlFVRjJRaXhGUVVGMVFqdEJRVUZCTEUxQlFXNUNMRXRCUVcxQ08wRkJRVUVzVFVGQldpeExRVUZaTEhWRlFVRktMRVZCUVVrN08wRkJRM2hGTEUxQlFVMHNUMEZCVHl4UFFVRlBMRWxCUVZBc1EwRkJXU3hIUVVGYUxFTkJRV0k3TzBGQlJVRXNUMEZCU3l4UFFVRk1MRU5CUVdFc1ZVRkJReXhIUVVGRUxFVkJRVk03UVVGRGNFSXNVVUZCU1N4VlFVRlZMRVZCUVZZc1NVRkJaMElzVFVGQlRTeFBRVUZPTEVOQlFXTXNSMEZCWkN4TlFVRjFRaXhEUVVGRExFTkJRVFZETEVWQlFTdERPMEZCUXpkRE8wRkJRMEU3UVVGRFJEczdRVUZGUkN4UlFVRkpMRkZCUVU4c1NVRkJTU3hIUVVGS0xFTkJRVkFzVFVGQmIwSXNVVUZCY0VJc1NVRkJaME1zU1VGQlNTeEhRVUZLTEUxQlFXRXNTVUZCYWtRc1JVRkJkVVE3UVVGRGNrUXNWVUZCU1N4WFFVRlhMRWRCUVdZN1FVRkRRU3hWUVVGSkxGVkJRVlVzUlVGQlpDeEZRVUZyUWp0QlFVTm9RaXh0UWtGQll5eExRVUZrTEZOQlFYVkNMRWRCUVhaQ08wRkJRMFE3TzBGQlJVUXNNRUpCUVc5Q0xFOUJRWEJDTEVWQlFUWkNMRWxCUVVrc1IwRkJTaXhEUVVFM1FpeEZRVUYxUXl4TFFVRjJReXhGUVVFNFF5eFJRVUU1UXp0QlFVTkJPMEZCUTBRN08wRkJSVVFzVVVGQlRTeFBRVUZQTEdGQlFXRXNTMEZCWWl4RlFVRnZRaXhIUVVGd1FpeERRVUZpTzBGQlEwRXNXVUZCVVN4WlFVRlNMRU5CUVhGQ0xFbEJRWEpDTEVWQlFUSkNMRWxCUVVrc1IwRkJTaXhEUVVFelFqdEJRVU5FTEVkQmJFSkVPMEZCYlVKRU96dEJRVVZOTEZOQlFWTXNiVUpCUVZRc1EwRkJOa0lzVDBGQk4wSXNSVUZCYlVVN1FVRkJRU3hOUVVFM1FpeEhRVUUyUWl4MVJVRkJka0lzUlVGQmRVSTdRVUZCUVN4TlFVRnVRaXhMUVVGdFFqdEJRVUZCTEUxQlFWb3NTMEZCV1N4MVJVRkJTaXhGUVVGSk96dEJRVU40UlN4TlFVRk5MRk5CUVZNc1QwRkJUeXhOUVVGUUxFTkJRV01zUlVGQlpDeEZRVUZyUWl4SFFVRnNRaXhEUVVGbU8wRkJRMEVzVFVGQlRTeFBRVUZQTEU5QlFVOHNTVUZCVUN4RFFVRlpMRWRCUVZvc1EwRkJZanM3UVVGRlFTeFBRVUZMTEU5QlFVd3NRMEZCWVN4VlFVRkRMRWRCUVVRc1JVRkJVenRCUVVOd1FpeFJRVUZKTEZWQlFWVXNSVUZCVml4SlFVRm5RaXhOUVVGTkxFOUJRVTRzUTBGQll5eEhRVUZrTEUxQlFYVkNMRU5CUVVNc1EwRkJOVU1zUlVGQkswTTdRVUZETjBNN1FVRkRRVHRCUVVORU96dEJRVVZFTEZGQlFVa3NTVUZCU1N4SFFVRktMRTFCUVdFc1NVRkJZaXhKUVVGeFFpeEpRVUZKTEVkQlFVb3NSVUZCVXl4WFFVRlVMRXRCUVhsQ0xFMUJRV3hFTEVWQlFUQkVPMEZCUTNoRUxGVkJRVWtzVjBGQlZ5eEhRVUZtTzBGQlEwRXNWVUZCU1N4VlFVRlZMRVZCUVdRc1JVRkJhMEk3UVVGRGFFSXNiVUpCUVdNc1MwRkJaQ3hUUVVGMVFpeEhRVUYyUWp0QlFVTkVPenRCUVVWRUxHRkJRVThzUjBGQlVDeEpRVUZqTEc5Q1FVRnZRaXhQUVVGd1FpeEZRVUUyUWl4SlFVRkpMRWRCUVVvc1EwRkJOMElzUlVGQmRVTXNTMEZCZGtNc1JVRkJPRU1zVVVGQk9VTXNRMEZCWkR0QlFVTkJPMEZCUTBRN08wRkJSVVE3UVVGRFFTeFJRVUZKTEZGQlFWRXNTVUZCU1N4SFFVRktMRU5CUVZvc1EwRnFRbTlDTEVOQmFVSkRPMEZCUTNKQ0xGRkJRVTBzWTBGQll5eExRVUZrTEhsRFFVRmpMRXRCUVdRc1EwRkJUanRCUVVOQkxGRkJRVTBzVDBGQlR5eGhRVUZoTEV0QlFXSXNSVUZCYjBJc1IwRkJjRUlzUTBGQllqdEJRVU5CTEZGQlFVMHNXVUZCV1N4UlFVRlJMRmxCUVZJc1EwRkJjVUlzU1VGQmNrSXNRMEZCYkVJN08wRkJSVUVzVVVGQlNTeGpRVUZqTEVsQlFXeENMRVZCUVhkQ08wRkJRM1JDTEZWQlFVa3NVMEZCVXl4VFFVRmlMRVZCUVhkQ08wRkJRM1JDTzBGQlEwRXNaMEpCUVZFc1kwRkJZeXhOUVVGMFFqdEJRVU5FTEU5QlNFUXNUVUZIVHl4SlFVRkpMRU5CUVVNc1RVRkJUU3hUUVVGT0xFTkJRVXdzUlVGQmRVSTdRVUZETlVJc1owSkJRVkVzVTBGQlV5eFRRVUZVTEVWQlFXOUNMRVZCUVhCQ0xFTkJRVkk3UVVGRFJDeFBRVVpOTEUxQlJVRTdRVUZEVEN4blFrRkJVU3hUUVVGU08wRkJRMFE3UVVGRFJqczdRVUZGUkN4WFFVRlBMRWRCUVZBc1NVRkJZeXhMUVVGa08wRkJRMFFzUjBGc1EwUTdPMEZCYjBOQkxGTkJRVThzVFVGQlVEdEJRVU5FT3p0QlFVVkVMRWxCUVUwc1VVRkJVU3hGUVVGa096dHJRa0ZGWlR0QlFVTmlMRXRCUkdFc1pVRkRWQ3hUUVVSVExFVkJRMFU3UVVGRFlpeFZRVUZOTEVsQlFVNHNRMEZCVnl4VFFVRllPMEZCUTBRc1IwRklXVHRCUVVsaUxGRkJTbUVzYTBKQlNVNHNVMEZLVFN4RlFVbExPMEZCUTJoQ0xGRkJRVTBzVVVGQlVTeE5RVUZOTEZOQlFVNHNRMEZCWjBJN1FVRkJRU3hoUVVGTExFOUJRVThzUlVGQlVDeERRVUZWTEZOQlFWWXNSVUZCY1VJc1EwRkJja0lzUTBGQlREdEJRVUZCTEV0QlFXaENMRU5CUVdRN1FVRkRRU3hSUVVGSkxGRkJRVkVzUTBGQlF5eERRVUZpTEVWQlFXZENPMEZCUTJRc1dVRkJUU3hOUVVGT0xFTkJRV0VzUzBGQllpeEZRVUZ2UWl4RFFVRndRanRCUVVORU8wRkJRMFlzUjBGVVdUdEJRVlZpTEZWQlZtRXNiMEpCVlVvc1UwRldTU3hGUVZWUE8wRkJRMnhDTEZkQlFVOHNUVUZCVFN4TlFVRk9MRXRCUVdsQ0xFTkJRV3BDTEVsQlFYTkNMRTlCUVU4c1JVRkJVQ3hEUVVGVkxFMUJRVTBzVFVGQlRTeE5RVUZPTEVkQlFXVXNRMEZCY2tJc1EwRkJWaXhGUVVGdFF5eFRRVUZ1UXl4RFFVRTNRanRCUVVORU8wRkJXbGtzUXpzN096czdPenM3T3pzN096dEJRM2hGWmpzN096dEJRVU5CT3pzN08wRkJRMEU3T3pzN096czdPeXRsUVZCQk96czdPenM3TzBGQlUwRXNTVUZCVFN4VFFVRlZMRmxCUVUwN1FVRkRjRUk3T3pzN096dEJRVTFCTEUxQlFVMHNUMEZCVHl4UlFVRmlPMEZCUTBFc1RVRkJUU3hWUVVGVkxFOUJRV2hDTzBGQlEwRXNUVUZCVFN4dlFrRkJiMElzYVVKQlFURkNPMEZCUTBFc1RVRkJUU3h4UWtGQmNVSTdRVUZEZWtJc1lVRkJVeXhKUVVSblFqdEJRVVY2UWl4WFFVRlBMRWxCUm10Q08wRkJSM3BDTEdGQlFWTXNTVUZJWjBJN1FVRkpla0lzWjBKQlFWazdRVUZLWVN4SFFVRXpRanRCUVUxQkxFMUJRVTBzZDBKQlFYZENMRU5CUXpWQ0xGbEJSRFJDTEVOQlFUbENPenRCUVVsQk96czdPenM3UVVGd1FtOUNMRTFCTUVKa0xFMUJNVUpqTzBGQlFVRTdPMEZCTkVKc1FpeHpRa0ZCTWtNN1FVRkJRU3hWUVVFdlFpeFBRVUVyUWl4MVJVRkJja0lzUlVGQmNVSTdRVUZCUVN4VlFVRnFRaXhSUVVGcFFpeDFSVUZCVGl4SlFVRk5PenRCUVVGQk96dEJRVUZCTEd0SVFVTnVReXhKUVVSdFF5eEZRVU0zUWl4UFFVUTJRaXhGUVVOd1FpeHJRa0ZFYjBJc1JVRkRRU3hQUVVSQkxFVkJRMU1zY1VKQlJGUXNSVUZEWjBNc1NVRkVhRU1zUlVGRGMwTXNTVUZFZEVNN08wRkJSM3BETEZsQlFVc3NVVUZCVEN4SFFVRm5RaXhaUVVGWkxFdEJRelZDTEd0RVFVUTBRaXhIUVVVeFFpdzBRMEZHTUVJc1IwRkhlRUlzT0VKQlNIZENMRWRCU1hSQ0xEWkNRVXB6UWl4SFFVdHdRaXhuUTBGTWIwSXNSMEZOZEVJc1VVRk9jMElzUjBGUGRFSXNNa0pCVUhOQ0xFZEJVWEJDTEZOQlVtOUNMRWRCVTNSQ0xGRkJWSE5DTEVkQlZYUkNMRFpDUVZaelFpeEhRVmR3UWl4cFJrRlliMElzUjBGWmRFSXNVVUZhYzBJc1IwRmhlRUlzVVVGaWQwSXNSMEZqTVVJc1VVRmtNRUlzUjBGbE5VSXNVVUZtUVRzN1FVRnBRa0VzVlVGQlNTeE5RVUZMTEdOQlFWUXNSVUZCZVVJN1FVRkRka0lzWTBGQlN5eExRVUZNTzBGQlEwUTdRVUYwUW5kRE8wRkJkVUl4UXpzN1FVRnVSR2xDTzBGQlFVRTdRVUZCUVN3NFFrRnhSRlk3UVVGRFRpeFpRVUZOTEZWQlFWVXNVMEZCVXl4aFFVRlVMRU5CUVhWQ0xFdEJRWFpDTEVOQlFXaENPenRCUVVWQkxHZENRVUZSTEZOQlFWSXNSMEZCYjBJc1MwRkJTeXhSUVVGNlFqczdRVUZGUVN4aFFVRkxMRTlCUVV3c1EwRkJZU3hQUVVGaUxFZEJRWFZDTEZGQlFWRXNWVUZCTDBJN08wRkJSVUU3UVVGRFFTeFpRVUZKTEV0QlFVc3NUMEZCVEN4RFFVRmhMRXRCUVdJc1MwRkJkVUlzU1VGQk0wSXNSVUZCYVVNN1FVRkRMMElzWlVGQlN5eFBRVUZNTEVOQlFXRXNUMEZCWWl4RFFVRnhRaXhoUVVGeVFpeERRVUZ0UXl4bFFVRnVReXhGUVVGdlJDeFRRVUZ3UkN4SFFVRm5SU3hMUVVGTExFOUJRVXdzUTBGQllTeExRVUUzUlR0QlFVTkVPenRCUVVWRU8wRkJRMEVzV1VGQlNTeExRVUZMTEU5QlFVd3NRMEZCWVN4UFFVRmlMRXRCUVhsQ0xFbEJRVGRDTEVWQlFXMURPMEZCUTJwRExHVkJRVXNzVDBGQlRDeERRVUZoTEU5QlFXSXNRMEZCY1VJc1lVRkJja0lzUTBGQmJVTXNZMEZCYmtNc1JVRkJiVVFzVlVGQmJrUXNRMEZCT0VRc1UwRkJPVVFzUjBGQk1FVXNTMEZCU3l4UFFVRk1MRU5CUVdFc1QwRkJka1k3UVVGRFJEczdRVUZGUkN4cFFrRkJVeXhKUVVGVUxFTkJRV01zVjBGQlpDeERRVUV3UWl4TFFVRkxMRTlCUVV3c1EwRkJZU3hQUVVGMlF6czdRVUZGUVN4aFFVRkxMR0ZCUVV3N1FVRkRSRHRCUVhwRmFVSTdRVUZCUVR0QlFVRkJMSE5EUVRKRlJqdEJRVU5rTEZsQlFVMHNWMEZCVnl4VFFVRlRMR0ZCUVZRc1EwRkJkVUlzUzBGQmRrSXNRMEZCYWtJN1FVRkRRU3hwUWtGQlV5eFpRVUZVTEVOQlFYTkNMRk5CUVhSQ0xFVkJRV2xETEV0QlFVc3NSVUZCZEVNN1FVRkRRU3hwUWtGQlV5eFRRVUZVTEVOQlFXMUNMRWRCUVc1Q0xFTkJRWFZDTEdsQ1FVRjJRanM3UVVGRlFTeHBRa0ZCVXl4SlFVRlVMRU5CUVdNc1YwRkJaQ3hEUVVFd1FpeFJRVUV4UWp0QlFVTkVPMEZCYWtacFFqdEJRVUZCTzBGQlFVRXNiME5CYlVaS08wRkJRMW9zWlVGQlR5eFRRVUZUTEdGQlFWUXNUMEZCTWtJc2FVSkJRVE5DTEd0Q1FVRjVSQ3hMUVVGTExFVkJRVGxFTEZGQlFWQTdRVUZEUkR0QlFYSkdhVUk3UVVGQlFUdEJRVUZCTEN0Q1FYVkdWRHRCUVVOUUxGbEJRVTBzWjBKQlFXZENMRTlCUVU4c1owSkJRVkFzUTBGQmQwSXNTMEZCU3l4UFFVRk1MRU5CUVdFc1QwRkJja01zUTBGQmRFSTdRVUZEUVR0QlFVTkJMRmxCUVUwc1UwRkJVeXhqUVVGakxFMUJRV1FzUTBGQmNVSXNTMEZCY2tJc1EwRkJNa0lzUTBGQk0wSXNSVUZCT0VJc1kwRkJZeXhOUVVGa0xFTkJRWEZDTEUxQlFYSkNMRWRCUVRoQ0xFTkJRVFZFTEVOQlFXWTdPMEZCUlVFc1dVRkJUU3hOUVVGUExFOUJRVThzVjBGQlVDeEhRVUZ4UWl4RFFVRjBRaXhIUVVFMFFpeFRRVUZUTEVOQlFXcEVPMEZCUTBFc1lVRkJTeXhQUVVGTUxFTkJRV0VzVDBGQllpeERRVUZ4UWl4TFFVRnlRaXhEUVVFeVFpeEhRVUV6UWl4SFFVRnZReXhIUVVGd1F6dEJRVU5FTzBGQk9VWnBRanRCUVVGQk8wRkJRVUVzTmtKQlowZFlPMEZCUVVFN08wRkJRMHdzV1VGQlNTeExRVUZMTEU5QlFVd3NRMEZCWVN4UFFVRmlMRXRCUVhsQ0xFbEJRVGRDTEVWQlFXMURPMEZCUTJwRE8wRkJRMEVzWlVGQlN5eExRVUZNTzBGQlEwUTdPMEZCUlVRc1dVRkJTU3hMUVVGTExFOUJRVXdzUTBGQllTeFBRVUZpTEVOQlFYRkNMRk5CUVhKQ0xFTkJRU3RDTEZGQlFTOUNMRU5CUVhkRExFMUJRWGhETEVOQlFVb3NSVUZCY1VRN1FVRkRia1FzYVVKQlFVOHNTMEZCVUR0QlFVTkVPenRCUVVWRU8wRkJRMEVzYlVKQlFWY3NXVUZCVFR0QlFVTm1MR2xDUVVGTExGbEJRVXdzUTBGQmEwSXNhVUpCUVUwc1NVRkJlRUk3UVVGRFFTeHBRa0ZCU3l4aFFVRk1PenRCUVVWQkxHTkJRVTBzVlVGQlZTeFRRVUZXTEU5QlFWVXNSMEZCVFR0QlFVTndRaXh0UWtGQlN5eFpRVUZNTEVOQlFXdENMR2xDUVVGTkxFdEJRWGhDTzBGQlEwRXNiVUpCUVVzc1QwRkJUQ3hEUVVGaExFOUJRV0lzUTBGQmNVSXNiVUpCUVhKQ0xFTkJRWGxETEdsQ1FVRk5MR05CUVM5RExFVkJRU3RFTEU5QlFTOUVPenRCUVVWQk8wRkJRMEVzYlVKQlFVc3NXVUZCVER0QlFVTkVMRmRCVGtRN08wRkJVVUVzYVVKQlFVc3NUMEZCVEN4RFFVRmhMRTlCUVdJc1EwRkJjVUlzWjBKQlFYSkNMRU5CUVhORExHbENRVUZOTEdOQlFUVkRMRVZCUVRSRUxFOUJRVFZFT3p0QlFVVkJMR2xDUVVGTExFOUJRVXdzUTBGQllTeFBRVUZpTEVOQlFYRkNMRk5CUVhKQ0xFTkJRU3RDTEVkQlFTOUNMRU5CUVcxRExFMUJRVzVET3p0QlFVVkJMR2xDUVVGTExFMUJRVXc3UVVGRFJDeFRRV3BDUkN4RlFXbENSeXhGUVdwQ1NEczdRVUZ0UWtFc1pVRkJUeXhKUVVGUU8wRkJRMFE3UVVFdlNHbENPMEZCUVVFN1FVRkJRU3h4UTBGcFNVZ3NTMEZxU1Vjc1JVRnBTVWs3UVVGRGNFSXNXVUZCU1N4TlFVRk5MRWxCUVU0c1MwRkJaU3hQUVVGbUxFbEJRVEJDTEUxQlFVMHNUMEZCVGl4TFFVRnJRaXhGUVVFMVF5eEpRVUZyUkN4TlFVRk5MRTlCUVU0c1MwRkJhMElzUlVGQmVFVXNSVUZCTkVVN1FVRkRNVVU3UVVGRFJEczdRVUZGUkR0QlFVTkJMR0ZCUVVzc1NVRkJURHRCUVVORU8wRkJlRWxwUWp0QlFVRkJPMEZCUVVFc05rSkJNRWxZTzBGQlFVRTdPMEZCUTB3c1dVRkJTU3hEUVVGRExFdEJRVXNzVDBGQlRDeERRVUZoTEU5QlFXSXNRMEZCY1VJc1UwRkJja0lzUTBGQkswSXNVVUZCTDBJc1EwRkJkME1zVFVGQmVFTXNRMEZCVEN4RlFVRnpSRHRCUVVOd1JDeHBRa0ZCVHl4TFFVRlFPMEZCUTBRN08wRkJSVVFzWVVGQlN5eFpRVUZNTEVOQlFXdENMR2xDUVVGTkxFbEJRWGhDT3p0QlFVVkJMR0ZCUVVzc1dVRkJURHM3UVVGRlFTeGhRVUZMTEU5QlFVd3NRMEZCWVN4UFFVRmlMRU5CUVhGQ0xGTkJRWEpDTEVOQlFTdENMRWRCUVM5Q0xFTkJRVzFETEUxQlFXNURPMEZCUTBFc1lVRkJTeXhQUVVGTUxFTkJRV0VzVDBGQllpeERRVUZ4UWl4VFFVRnlRaXhEUVVFclFpeE5RVUV2UWl4RFFVRnpReXhOUVVGMFF6czdRVUZGUVN4WlFVRk5MRmRCUVZjc1MwRkJTeXhYUVVGTUxFVkJRV3BDT3p0QlFVVkJMRmxCUVUwc1YwRkJWeXhUUVVGWUxGRkJRVmNzUjBGQlRUdEJRVU55UWl4dFFrRkJVeXhKUVVGVUxFTkJRV01zVjBGQlpDeERRVUV3UWl4UlFVRXhRanM3UVVGRlFTeHBRa0ZCU3l4UFFVRk1MRU5CUVdFc1QwRkJZaXhEUVVGeFFpeFRRVUZ5UWl4RFFVRXJRaXhOUVVFdlFpeERRVUZ6UXl4TlFVRjBRenM3UVVGRlFTeHBRa0ZCU3l4WlFVRk1MRU5CUVd0Q0xHbENRVUZOTEUxQlFYaENPenRCUVVWQkxHMUNRVUZUTEcxQ1FVRlVMRU5CUVRaQ0xHbENRVUZOTEdOQlFXNURMRVZCUVcxRUxGRkJRVzVFT3p0QlFVVkJPMEZCUTBFc1kwRkJTU3hQUVVGTExHTkJRVlFzUlVGQmVVSTdRVUZEZGtJc2NVSkJRVk1zU1VGQlZDeERRVUZqTEZkQlFXUXNRMEZCTUVJc1QwRkJTeXhQUVVGTUxFTkJRV0VzVDBGQmRrTTdRVUZEUVN4dFFrRkJTeXhQUVVGTUxFTkJRV0VzVDBGQllpeEhRVUYxUWl4SlFVRjJRanRCUVVORU8wRkJRMFlzVTBGa1JEczdRVUZuUWtFc2FVSkJRVk1zWjBKQlFWUXNRMEZCTUVJc2FVSkJRVTBzWTBGQmFFTXNSVUZCWjBRc1VVRkJhRVE3UVVGRFFTeHBRa0ZCVXl4VFFVRlVMRU5CUVcxQ0xFZEJRVzVDTEVOQlFYVkNMRk5CUVhaQ096dEJRVVZCTEdWQlFVOHNTVUZCVUR0QlFVTkVPMEZCTlV0cFFqdEJRVUZCTzBGQlFVRXNjVU5CT0V0SU8wRkJRVUU3TzBGQlEySXNXVUZCVFN4cFFrRkJhVUlzUzBGQlN5eFBRVUZNTEVOQlFXRXNUMEZCWWl4RFFVRnhRaXhuUWtGQmNrSXNRMEZCYzBNc1owSkJRWFJETEVOQlFYWkNPMEZCUTBFc1dVRkJTU3hqUVVGS0xFVkJRVzlDTzBGQlEyeENMR2RDUVVGTkxFbEJRVTRzUTBGQlZ5eGpRVUZZTEVWQlFUSkNMRTlCUVROQ0xFTkJRVzFETzBGQlFVRXNiVUpCUVZVc1QwRkJTeXhsUVVGTUxFTkJRWEZDTEVWQlFVVXNVVUZCVVN4TlFVRldMRVZCUVd0Q0xFOUJRVThzVDBGQmVrSXNSVUZCY2tJc1EwRkJWanRCUVVGQkxGZEJRVzVETzBGQlEwUTdPMEZCUlVRN1FVRkRRVHRCUVVOQk8wRkJRMEVzV1VGQlNTeExRVUZMTEU5QlFVd3NRMEZCWVN4VlFVRnFRaXhGUVVFMlFqdEJRVU16UWl4alFVRk5MRmRCUVZjc1MwRkJTeXhYUVVGTUxFVkJRV3BDTzBGQlEwRXNaVUZCU3l4bFFVRk1MRU5CUVhGQ0xFVkJRVVVzVVVGQlVTeFJRVUZXTEVWQlFXOUNMRTlCUVU4c2FVSkJRVTBzUzBGQmFrTXNSVUZCY2tJN1FVRkRRU3hsUVVGTExHVkJRVXdzUTBGQmNVSXNSVUZCUlN4UlFVRlJMRkZCUVZZc1JVRkJiMElzVDBGQlR5eFBRVUV6UWl4RlFVRnlRanRCUVVORU8wRkJRMFk3UVVFMVRHbENPMEZCUVVFN1FVRkJRU3h4UTBFNFRFZzdRVUZCUVRzN1FVRkRZaXhaUVVGTkxHbENRVUZwUWl4TFFVRkxMRTlCUVV3c1EwRkJZU3hQUVVGaUxFTkJRWEZDTEdkQ1FVRnlRaXhEUVVGelF5eG5Ra0ZCZEVNc1EwRkJka0k3UVVGRFFTeFpRVUZKTEdOQlFVb3NSVUZCYjBJN1FVRkRiRUlzWjBKQlFVMHNTVUZCVGl4RFFVRlhMR05CUVZnc1JVRkJNa0lzVDBGQk0wSXNRMEZCYlVNN1FVRkJRU3h0UWtGQlZTeFBRVUZMTEdsQ1FVRk1MRU5CUVhWQ0xFVkJRVVVzVVVGQlVTeE5RVUZXTEVWQlFXdENMRTlCUVU4c1QwRkJla0lzUlVGQmRrSXNRMEZCVmp0QlFVRkJMRmRCUVc1RE8wRkJRMFE3TzBGQlJVUXNXVUZCU1N4TFFVRkxMRTlCUVV3c1EwRkJZU3hWUVVGcVFpeEZRVUUyUWp0QlFVTXpRaXhqUVVGTkxGZEJRVmNzUzBGQlN5eFhRVUZNTEVWQlFXcENPMEZCUTBFc1pVRkJTeXhwUWtGQlRDeERRVUYxUWl4RlFVRkZMRkZCUVZFc1VVRkJWaXhGUVVGdlFpeFBRVUZQTEdsQ1FVRk5MRXRCUVdwRExFVkJRWFpDTzBGQlEwRXNaVUZCU3l4cFFrRkJUQ3hEUVVGMVFpeEZRVUZGTEZGQlFWRXNVVUZCVml4RlFVRnZRaXhQUVVGUExFOUJRVE5DTEVWQlFYWkNPMEZCUTBRN1FVRkRSanRCUVhwTmFVSTdRVUZCUVR0QlFVRkJMRzFEUVRKTlJUdEJRVU5zUWl4bFFVRlBMRWxCUVZBN1FVRkRSRHRCUVRkTmFVSTdRVUZCUVR0QlFVRkJMRzlEUVN0TlJ5eFBRUzlOU0N4RlFTdE5XVHRCUVVNMVFpeDVSMEZCTWtJc1RVRkJNMElzUlVGQmJVTXNUMEZCYmtNN1FVRkRSRHRCUVdwT2FVSTdPMEZCUVVFN1FVRkJRVHM3UVVGdlRuQkNPenM3T3pzN08wRkJTMEVzVFVGQlRTeGhRVUZoTEVWQlFXNUNPenRCUVVWQkxFMUJRVTBzVlVGQlZTeFRRVUZUTEdkQ1FVRlVMRTlCUVRoQ0xFbEJRVGxDTEVOQlFXaENPMEZCUTBFc1RVRkJTU3hQUVVGS0xFVkJRV0U3UVVGRFdDeFZRVUZOTEVsQlFVNHNRMEZCVnl4UFFVRllMRVZCUVc5Q0xFOUJRWEJDTEVOQlFUUkNMRlZCUVVNc1QwRkJSQ3hGUVVGaE8wRkJRM1pETEZWQlFVMHNVMEZCVXl3eVEwRkJiMElzVDBGQmNFSXNSVUZCTmtJc2EwSkJRVGRDTEVWQlFXbEVMSEZDUVVGcVJDeERRVUZtTzBGQlEwRXNZVUZCVHl4UFFVRlFMRWRCUVdsQ0xFOUJRV3BDT3p0QlFVVkJMR2xDUVVGWExFbEJRVmdzUTBGQlowSXNSVUZCUlN4blFrRkJSaXhGUVVGWExGRkJRVkVzU1VGQlNTeE5RVUZLTEVOQlFWY3NUVUZCV0N4RFFVRnVRaXhGUVVGb1FqdEJRVU5FTEV0QlRFUTdRVUZOUkRzN1FVRkZSQ3hOUVVGSkxFOUJRVW9zUlVGQllUdEJRVU5ZTEdGQlFWTXNaMEpCUVZRc1EwRkJNRUlzVDBGQk1VSXNSVUZCYlVNc1ZVRkJReXhMUVVGRUxFVkJRVmM3UVVGRE5VTXNWVUZCVFN4cFFrRkJhVUlzVFVGQlRTeE5RVUZPTEVOQlFXRXNXVUZCWWl4RFFVRXdRaXhoUVVFeFFpeERRVUYyUWp0QlFVTkJMRlZCUVVrc2EwSkJRV3RDTEcxQ1FVRnRRaXhKUVVGNlF5eEZRVUVyUXp0QlFVTTNReXhaUVVGTkxFdEJRVXNzVFVGQlRTeE5RVUZPTEVOQlFXRXNXVUZCWWl4RFFVRXdRaXhoUVVFeFFpeERRVUZZTzBGQlEwRXNXVUZCVFN4VlFVRlZMRk5CUVZNc1lVRkJWQ3hEUVVGMVFpeEZRVUYyUWl4RFFVRm9RanM3UVVGRlFTeFpRVUZOTEZsQlFWa3NWMEZCVnl4SlFVRllMRU5CUVdkQ08wRkJRVUVzYVVKQlFVc3NSVUZCUlN4UFFVRkdMRXRCUVdNc1QwRkJia0k3UVVGQlFTeFRRVUZvUWl4RFFVRnNRanM3UVVGRlFTeFpRVUZKTEVOQlFVTXNVMEZCVEN4RlFVRm5RanRCUVVOa08wRkJRMFE3TzBGQlJVUTdRVUZEUVN4alFVRk5MRTFCUVU0c1EwRkJZU3hKUVVGaU96dEJRVVZCTEd0Q1FVRlZMRTFCUVZZc1EwRkJhVUlzU1VGQmFrSTdRVUZEUkR0QlFVTkdMRXRCYWtKRU8wRkJhMEpFT3p0QlFVVkVMRk5CUVU4c1RVRkJVRHRCUVVORUxFTkJNMUJqTEVWQlFXWTdPMnRDUVRaUVpTeE5PenM3T3pzN096czdPenRCUTJwUlpqczdPenRCUVVOQk96dEJRVU5CT3pzN096czdPenNyWlVGUVFUczdPenM3T3p0QlFWTkJMRWxCUVUwc1UwRkJWU3haUVVGTk96dEJRVVZ3UWpzN096czdPMEZCVFVFc1RVRkJUU3hQUVVGUExGRkJRV0k3UVVGRFFTeE5RVUZOTEc5Q1FVRnZRaXhwUWtGQk1VSTdRVUZEUVN4TlFVRk5MSEZDUVVGeFFqdEJRVU42UWl4aFFVRlRMRWxCUkdkQ08wRkJSWHBDTEZkQlFVOHNTVUZHYTBJN1FVRkhla0lzWVVGQlV5eEpRVWhuUWp0QlFVbDZRaXhuUWtGQldUdEJRVXBoTEVkQlFUTkNPMEZCVFVFc1RVRkJUU3gzUWtGQmQwSXNRMEZETlVJc1dVRkVORUlzUTBGQk9VSTdPMEZCU1VFN096czdPenRCUVhCQ2IwSXNUVUV3UW1Rc1RVRXhRbU03UVVGQlFUczdRVUUwUW14Q0xITkNRVUV3UWp0QlFVRkJMRlZCUVdRc1QwRkJZeXgxUlVGQlNpeEZRVUZKT3p0QlFVRkJPenRCUVVONFFpeFZRVUZOTEZkQlFWY3NTMEZEYWtJc2EwUkJSR2xDTEVkQlJXWXNORU5CUm1Vc1IwRkhZaXc0UWtGSVlTeEhRVWxZTERaQ1FVcFhMRWRCUzFRc1owTkJURk1zUjBGTldDeFJRVTVYTEVkQlQxZ3NNa0pCVUZjc1IwRlJWQ3h0UkVGU1V5eEhRVk5ZTEZGQlZGY3NSMEZWV0N3MlFrRldWeXhIUVZkVUxHbEdRVmhUTEVkQldWZ3NVVUZhVnl4SFFXRmlMRkZCWW1Fc1IwRmpaaXhSUVdSbExFZEJaV3BDTEZGQlprRTdPMEZCUkhkQ0xEWkhRV3RDYkVJc1QwRnNRbXRDTEVWQmEwSlVMRkZCYkVKVE8wRkJiVUo2UWpzN1FVRXZRMmxDTzBGQlFVRTdRVUZCUVN4dlEwRnBSRWNzVDBGcVJFZ3NSVUZwUkZrN1FVRkROVUlzWlVGQlR5eEpRVUZKTEUxQlFVb3NRMEZCVnl4UFFVRllMRU5CUVZBN1FVRkRSRHRCUVc1RWFVSTdPMEZCUVVFN1FVRkJRVHM3UVVGelJIQkNPenM3T3pzN08wRkJTMEVzVFVGQlRTeGhRVUZoTEVWQlFXNUNPMEZCUTBFc1RVRkJUU3hWUVVGVkxGTkJRVk1zWjBKQlFWUXNUMEZCT0VJc1NVRkJPVUlzUTBGQmFFSTdPMEZCUlVFc1RVRkJTU3hQUVVGS0xFVkJRV0U3UVVGRFdDeFZRVUZOTEVsQlFVNHNRMEZCVnl4UFFVRllMRVZCUVc5Q0xFOUJRWEJDTEVOQlFUUkNMRlZCUVVNc1QwRkJSQ3hGUVVGaE8wRkJRM1pETEZWQlFVMHNVMEZCVXl3eVEwRkJiMElzVDBGQmNFSXNSVUZCTmtJc2EwSkJRVGRDTEVWQlFXbEVMSEZDUVVGcVJDeERRVUZtTzBGQlEwRXNZVUZCVHl4UFFVRlFMRWRCUVdsQ0xFOUJRV3BDT3p0QlFVVkJMRlZCUVVrc1QwRkJUeXhKUVVGUUxFdEJRV2RDTEU5QlFYQkNMRVZCUVRaQ08wRkJRek5DTzBGQlEwRXNiVUpCUVZjc1NVRkJXQ3hEUVVGblFpeEpRVUZKTEUxQlFVb3NRMEZCVnl4TlFVRllMRU5CUVdoQ08wRkJRMFE3UVVGRFJpeExRVkpFTzBGQlUwUTdPMEZCUlVRc1RVRkJTU3hQUVVGS0xFVkJRV0U3UVVGRFdDeGhRVUZUTEdkQ1FVRlVMRU5CUVRCQ0xFOUJRVEZDTEVWQlFXMURMRlZCUVVNc1MwRkJSQ3hGUVVGWE8wRkJRelZETEZWQlFVMHNaVUZCWlN3NFFrRkJhMElzVFVGQlRTeE5RVUY0UWl4RlFVRm5ReXhsUVVGb1F5eERRVUZ5UWp0QlFVTkJMRlZCUVVrc1dVRkJTaXhGUVVGclFqdEJRVU5vUWp0QlFVTkVPenRCUVVWRUxGVkJRVTBzVjBGQlZ5dzRRa0ZCYTBJc1RVRkJUU3hOUVVGNFFpeEZRVUZuUXl4VlFVRm9ReXhEUVVGcVFqczdRVUZGUVN4VlFVRkpMRkZCUVVvc1JVRkJZenRCUVVOYUxGbEJRVTBzYVVKQlFXbENMRk5CUVZNc1dVRkJWQ3hEUVVGelFpeGhRVUYwUWl4RFFVRjJRanRCUVVOQkxGbEJRVWtzYTBKQlFXdENMRzFDUVVGdFFpeEpRVUZ5UXl4SlFVRTJReXhSUVVGcVJDeEZRVUV5UkR0QlFVTjZSQ3hqUVVGTkxGbEJRVmtzVjBGQlZ5eEpRVUZZTEVOQlFXZENPMEZCUVVFc2JVSkJRVXNzUlVGQlJTeFZRVUZHTEU5QlFXMUNMRkZCUVhoQ08wRkJRVUVzVjBGQmFFSXNRMEZCYkVJN08wRkJSVUVzWTBGQlNTeERRVUZETEZOQlFVd3NSVUZCWjBJN1FVRkRaRHRCUVVORU96dEJRVVZFTEc5Q1FVRlZMRTFCUVZZN1FVRkRSRHRCUVVOR08wRkJRMFlzUzBGd1FrUTdRVUZ4UWtRN08wRkJSVVFzVTBGQlR5eE5RVUZRTzBGQlEwUXNRMEZ1UjJNc1JVRkJaanM3YTBKQmNVZGxMRTA3T3pzN096czdPenM3T3pzN1FVTjZSMlk3T3pzN1FVRkRRVHM3T3p0QlFVTkJPenRCUVVOQk96czdPenM3T3pzclpVRlNRVHM3T3pzN096dEJRVlZCTEVsQlFVMHNWMEZCV1N4WlFVRk5PMEZCUTNSQ096czdPenM3UVVGTlFTeE5RVUZOTEU5QlFVOHNWVUZCWWp0QlFVTkJMRTFCUVUwc1ZVRkJWU3hQUVVGb1FqdEJRVU5CTEUxQlFVMHNjVUpCUVhGQ08wRkJRM3BDTEdGQlFWTXNTVUZFWjBJN1FVRkZla0lzWVVGQlV5eEpRVVpuUWp0QlFVZDZRaXhaUVVGUk8wRkJTR2xDTEVkQlFUTkNPMEZCUzBFc1RVRkJUU3gzUWtGQmQwSXNRMEZETlVJc1UwRkVORUlzUlVGRk5VSXNVVUZHTkVJc1EwRkJPVUk3TzBGQlMwRTdPenM3T3p0QlFXNUNjMElzVFVGNVFtaENMRkZCZWtKblFqdEJRVUZCT3p0QlFUSkNjRUlzZDBKQlFUQkNPMEZCUVVFc1ZVRkJaQ3hQUVVGakxIVkZRVUZLTEVWQlFVazdPMEZCUVVFN08wRkJRVUVzYzBoQlEyeENMRWxCUkd0Q0xFVkJRMW9zVDBGRVdTeEZRVU5JTEd0Q1FVUkhMRVZCUTJsQ0xFOUJSR3BDTEVWQlF6QkNMSEZDUVVReFFpeEZRVU5wUkN4TFFVUnFSQ3hGUVVOM1JDeExRVVI0UkRzN1FVRkhlRUlzVlVGQlRTeFhRVUZYTEUxQlFVc3NUMEZCVEN4RFFVRmhMRTlCUVdJc1EwRkJjVUlzWVVGQmNrSXNRMEZCYlVNc2FVSkJRVzVETEVOQlFXcENPMEZCUTBFc1ZVRkJUU3hQUVVGUExFMUJRVXNzVjBGQlRDeERRVUZwUWl4UlFVRnFRaXhEUVVGaU96dEJRVVZCTEZsQlFVc3NWMEZCVEN4RFFVRnBRaXhMUVVGTExFdEJRWFJDTEVWQlFUWkNMRXRCUVVzc1NVRkJiRU1zUlVGQmQwTXNTMEZCZUVNN1FVRk9kMEk3UVVGUGVrSTdPMEZCYkVOdFFqdEJRVUZCTzBGQlFVRXNiME5CYjBOeFF6dEJRVUZCTEZsQlFUZERMRXRCUVRaRExIVkZRVUZ5UXl4RlFVRnhRenM3UVVGQlFUczdRVUZCUVN4WlFVRnFReXhKUVVGcFF5eDFSVUZCTVVJc1NVRkJNRUk3UVVGQlFTeFpRVUZ3UWl4WFFVRnZRaXgxUlVGQlRpeEpRVUZOT3p0QlFVTjJSQ3haUVVGSkxFTkJRVU1zUzBGQlN5eFBRVUZNTEVOQlFXRXNUMEZCYkVJc1JVRkJNa0k3UVVGRGVrSXNhVUpCUVU4c1MwRkJVRHRCUVVORU96dEJRVVZFTEZsQlFVa3NZMEZCWXl4SlFVRnNRanRCUVVOQkxHRkJRVXNzVDBGQlRDeERRVUZoTEU5QlFXSXNRMEZCY1VJc1lVRkJja0lzUTBGQmJVTXNaVUZCYmtNc1JVRkJiMFFzVTBGQmNFUXNSMEZCWjBVc1NVRkJhRVU3UVVGRFFTeGhRVUZMTEU5QlFVd3NRMEZCWVN4UFFVRmlMRU5CUVhGQ0xHRkJRWEpDTEVOQlFXMURMSE5DUVVGdVF5eEZRVUV5UkN4TFFVRXpSQ3hIUVVGdFJTeExRVUZ1UlRzN1FVRkZRU3haUVVGTkxGRkJRVkVzUzBGQlN5eFBRVUZNTEVOQlFXRXNUMEZCWWl4RFFVRnhRaXhuUWtGQmNrSXNRMEZCYzBNc1QwRkJkRU1zUzBGQmEwUXNSVUZCYUVVN1FVRkRRU3haUVVGSkxGbEJRVmtzUzBGQmFFSTdPMEZCUlVFc1kwRkJUU3hKUVVGT0xFTkJRVmNzUzBGQldDeEZRVUZyUWl4UFFVRnNRaXhEUVVFd1FpeFZRVUZETEVsQlFVUXNSVUZCVlR0QlFVTnNReXhqUVVGSkxFdEJRVXNzVTBGQlRDeERRVUZsTEZGQlFXWXNRMEZCZDBJc1ZVRkJlRUlzUTBGQlNpeEZRVUY1UXp0QlFVTjJReXhwUWtGQlN5eFRRVUZNTEVOQlFXVXNUVUZCWml4RFFVRnpRaXhWUVVGMFFqdEJRVU5FT3p0QlFVVkVMR05CUVUwc1QwRkJUeXhQUVVGTExGZEJRVXdzUTBGQmFVSXNTVUZCYWtJc1EwRkJZanM3UVVGRlFTeGpRVUZKTEZWQlFWVXNTMEZCU3l4TFFVRnVRaXhGUVVFd1FqdEJRVU40UWl4blFrRkJTU3hEUVVGRExFdEJRVXNzVTBGQlRDeERRVUZsTEZGQlFXWXNRMEZCZDBJc1ZVRkJlRUlzUTBGQlRDeEZRVUV3UXp0QlFVTjRReXh0UWtGQlN5eFRRVUZNTEVOQlFXVXNSMEZCWml4RFFVRnRRaXhWUVVGdVFqdEJRVU5FT3p0QlFVVkVMREJDUVVGakxFdEJRVXNzU1VGQmJrSTdRVUZEUVN4M1FrRkJXU3hKUVVGYU8wRkJRMFE3UVVGRFJpeFRRV1pFT3p0QlFXbENRU3haUVVGSkxHVkJRV1VzVTBGQmJrSXNSVUZCT0VJN1FVRkROVUlzWlVGQlN5eFBRVUZNTEVOQlFXRXNUMEZCWWl4RFFVRnhRaXhoUVVGeVFpeERRVUZ0UXl4bFFVRnVReXhGUVVGdlJDeFRRVUZ3UkN4SFFVRm5SU3hYUVVGb1JUdEJRVU5FTEZOQlJrUXNUVUZGVHl4SlFVRkpMR1ZCUVdVc1EwRkJReXhUUVVGd1FpeEZRVUVyUWp0QlFVTndReXhuUWtGQlRTeEpRVUZKTEV0QlFVb3NRMEZCWVN4SlFVRmlMSEZDUVVGcFF5eExRVUZxUXl3MFEwRkJUanRCUVVORU96dEJRVVZFTEdWQlFVOHNTVUZCVUR0QlFVTkVPMEZCZUVWdFFqdEJRVUZCTzBGQlFVRXNiME5CTUVWT08wRkJRMW9zWlVGQlR5eExRVUZMTEU5QlFVd3NRMEZCWVN4UFFVRmlMRU5CUVhGQ0xHRkJRWEpDTEVOQlFXMURMSE5DUVVGdVF5eEZRVUV5UkN4TFFVRnNSVHRCUVVORU8wRkJOVVZ0UWp0QlFVRkJPMEZCUVVFc2IwTkJPRVZMTzBGQlFVRXNXVUZCWWl4SlFVRmhMSFZGUVVGT0xFbEJRVTA3TzBGQlEzWkNMRmxCUVVrc1QwRkJUeXhGUVVGWU8wRkJRMEVzV1VGQlNTeFJRVUZSTEVWQlFWbzdPMEZCUlVFc1dVRkJTU3hKUVVGS0xFVkJRVlU3UVVGRFVpeHBRa0ZCVHl4TFFVRkxMRmxCUVV3c1EwRkJhMElzVjBGQmJFSXNTMEZCYTBNc1MwRkJTeXhUUVVFNVF6czdRVUZGUVN4alFVRk5MRzFDUVVGdFFpeExRVUZMTEdGQlFVd3NRMEZCYlVJc1QwRkJia0lzUTBGQmVrSTdRVUZEUVN4alFVRkpMR2RDUVVGS0xFVkJRWE5DTzBGQlEzQkNMRzFDUVVGUExHbENRVUZwUWl4VFFVRjRRanRCUVVORU96dEJRVVZFTEd0Q1FVRlJMRXRCUVVzc1dVRkJUQ3hEUVVGclFpeFpRVUZzUWl4TFFVRnRReXhGUVVFelF6dEJRVU5FT3p0QlFVVkVMR1ZCUVU4c1JVRkJSU3hWUVVGR0xFVkJRVkVzV1VGQlVpeEZRVUZRTzBGQlEwUTdRVUU1Um0xQ08wRkJRVUU3UVVGQlFTeHhRMEZuUjB3c1MwRm9SMHNzUlVGblIwVTdRVUZEY0VJc1dVRkJTU3hOUVVGTkxFbEJRVTRzUzBGQlpTeHBRa0ZCVFN4TFFVRjZRaXhGUVVGblF6dEJRVU01UWl4alFVRk5MRmRCUVZjc09FSkJRV3RDTEUxQlFVMHNUVUZCZUVJc1JVRkJaME1zVlVGQmFFTXNRMEZCYWtJN08wRkJSVUU3T3pzN1FVRkpRU3hqUVVGSkxFTkJRVU1zVVVGQlJDeEpRVUZoTEdGQlFXRXNTMEZCU3l4VlFVRk1MRVZCUVRsQ0xFVkJRV2xFTzBGQlF5OURMR2xDUVVGTExFbEJRVXc3UVVGRFJEdEJRVVZHTEZOQldFUXNUVUZYVHl4SlFVRkpMRTFCUVUwc1NVRkJUaXhMUVVGbExFOUJRVzVDTEVWQlFUUkNPMEZCUTJwRExHTkJRVTBzVDBGQlR5dzRRa0ZCYTBJc1RVRkJUU3hOUVVGNFFpeEZRVUZuUXl4TlFVRm9ReXhEUVVGaU96dEJRVVZCTEdOQlFVa3NTVUZCU2l4RlFVRlZPMEZCUTFJc1owSkJRVWtzUzBGQlN5eFRRVUZNTEVOQlFXVXNVVUZCWml4RFFVRjNRaXhWUVVGNFFpeERRVUZLTEVWQlFYbERPMEZCUTNaRE8wRkJRMFE3TzBGQlJVUXNaMEpCUVUwc1YwRkJWeXhMUVVGTExGZEJRVXdzUTBGQmFVSXNTVUZCYWtJc1EwRkJha0k3TzBGQlJVRXNaMEpCUVVrc1MwRkJTeXhYUVVGTUxFOUJRWFZDTEZOQlFWTXNTMEZCY0VNc1JVRkJNa003UVVGRGVrTTdRVUZEUVN4dFFrRkJTeXhYUVVGTUxFTkJRV2xDTEZOQlFWTXNTMEZCTVVJc1JVRkJhVU1zVTBGQlV5eEpRVUV4UXl4RlFVRm5SQ3hMUVVGb1JEdEJRVU5CTEd0Q1FVRk5MRk5CUVZNc1JVRkJSU3hWUVVGR0xFVkJRVkVzVFVGQlRTeFRRVUZUTEVsQlFYWkNMRVZCUVRaQ0xFOUJRVThzVTBGQlV5eExRVUUzUXl4RlFVRm1PMEZCUTBFc2JVSkJRVXNzV1VGQlRDeERRVUZyUWl4cFFrRkJUU3hoUVVGNFFpeEZRVUYxUXl4TlFVRjJRenRCUVVORU96dEJRVVZFTEdsQ1FVRkxMRWxCUVV3N1FVRkRRVHRCUVVORU96dEJRVVZFTzBGQlEwRXNZMEZCVFN4bFFVRmxMRGhDUVVGclFpeE5RVUZOTEUxQlFYaENMRVZCUVdkRExHVkJRV2hETEVOQlFYSkNPMEZCUTBFc1kwRkJTU3haUVVGS0xFVkJRV3RDTzBGQlEyaENPMEZCUTBRN08wRkJSVVFzWlVGQlN5eE5RVUZNTzBGQlEwUTdRVUZEUmp0QlFYcEpiVUk3UVVGQlFUdEJRVUZCTEN0Q1FUSkpXRHRCUVVOUUxGbEJRVWtzUzBGQlN5eFBRVUZNTEVOQlFXRXNUMEZCWWl4RFFVRnhRaXhUUVVGeVFpeERRVUVyUWl4UlFVRXZRaXhEUVVGM1F5eFJRVUY0UXl4RFFVRktMRVZCUVhWRU8wRkJRM0pFTEdsQ1FVRlBMRXRCUVVzc1NVRkJUQ3hGUVVGUU8wRkJRMFE3TzBGQlJVUXNaVUZCVHl4TFFVRkxMRWxCUVV3c1JVRkJVRHRCUVVORU8wRkJha3B0UWp0QlFVRkJPMEZCUVVFc05rSkJiVXBpTzBGQlEwd3NXVUZCU1N4TFFVRkxMRTlCUVV3c1EwRkJZU3hQUVVGaUxFTkJRWEZDTEZOQlFYSkNMRU5CUVN0Q0xGRkJRUzlDTEVOQlFYZERMRkZCUVhoRExFTkJRVW9zUlVGQmRVUTdRVUZEY2tRc2FVSkJRVThzUzBGQlVEdEJRVU5FT3p0QlFVVkVMR0ZCUVVzc1QwRkJUQ3hEUVVGaExFOUJRV0lzUTBGQmNVSXNVMEZCY2tJc1EwRkJLMElzUjBGQkwwSXNRMEZCYlVNc1VVRkJia003TzBGQlJVRXNXVUZCVFN4bFFVRmxMRXRCUVVzc1QwRkJUQ3hEUVVGaExFOUJRV0lzUTBGQmNVSXNZVUZCY2tJc1EwRkJiVU1zWjBKQlFXNURMRU5CUVhKQ096dEJRVVZCTzBGQlEwRXNjVUpCUVdFc1UwRkJZaXhIUVVGNVFpeERRVUY2UWpzN1FVRkZRU3hoUVVGTExGbEJRVXdzUTBGQmEwSXNhVUpCUVUwc1NVRkJlRUk3UVVGRFFTeGhRVUZMTEZsQlFVd3NRMEZCYTBJc2FVSkJRVTBzUzBGQmVFSTdPMEZCUlVFc1lVRkJTeXhsUVVGTUxFTkJRWEZDTEVWQlFVVXNVVUZCVVN4WlFVRldMRVZCUVhkQ0xFOUJRVThzVDBGQkwwSXNSVUZCY2tJN1FVRkRRU3hoUVVGTExHVkJRVXdzUTBGQmNVSXNSVUZCUlN4UlFVRlJMRk5CUVZNc1NVRkJia0lzUlVGQmVVSXNUMEZCVHl4cFFrRkJUU3hMUVVGMFF5eEZRVUZ5UWpzN1FVRkZRU3hsUVVGUExFbEJRVkE3UVVGRFJEdEJRWFJMYlVJN1FVRkJRVHRCUVVGQkxEWkNRWGRMWWp0QlFVTk1MRmxCUVVrc1EwRkJReXhMUVVGTExFOUJRVXdzUTBGQllTeFBRVUZpTEVOQlFYRkNMRk5CUVhKQ0xFTkJRU3RDTEZGQlFTOUNMRU5CUVhkRExGRkJRWGhETEVOQlFVd3NSVUZCZDBRN1FVRkRkRVFzYVVKQlFVOHNTMEZCVUR0QlFVTkVPenRCUVVWRUxHRkJRVXNzVDBGQlRDeERRVUZoTEU5QlFXSXNRMEZCY1VJc1UwRkJja0lzUTBGQkswSXNUVUZCTDBJc1EwRkJjME1zVVVGQmRFTTdPMEZCUlVFc1lVRkJTeXhaUVVGTUxFTkJRV3RDTEdsQ1FVRk5MRWxCUVhoQ08wRkJRMEVzWVVGQlN5eFpRVUZNTEVOQlFXdENMR2xDUVVGTkxFMUJRWGhDT3p0QlFVVkJMR0ZCUVVzc2FVSkJRVXdzUTBGQmRVSXNSVUZCUlN4UlFVRlJMRXRCUVVzc1QwRkJUQ3hEUVVGaExFOUJRV0lzUTBGQmNVSXNZVUZCY2tJc1EwRkJiVU1zWjBKQlFXNURMRU5CUVZZc1JVRkJaMFVzVDBGQlR5eFBRVUYyUlN4RlFVRjJRanRCUVVOQkxHRkJRVXNzYVVKQlFVd3NRMEZCZFVJc1JVRkJSU3hSUVVGUkxGTkJRVk1zU1VGQmJrSXNSVUZCZVVJc1QwRkJUeXhwUWtGQlRTeExRVUYwUXl4RlFVRjJRanM3UVVGRlFTeGxRVUZQTEVsQlFWQTdRVUZEUkR0QlFYUk1iVUk3UVVGQlFUdEJRVUZCTEcxRFFYZE1RVHRCUVVOc1FpeGxRVUZQTEVsQlFWQTdRVUZEUkR0QlFURk1iVUk3UVVGQlFUdEJRVUZCTEc5RFFUUk1ReXhQUVRWTVJDeEZRVFJNVlR0QlFVTTFRaXcyUjBGQk1rSXNVVUZCTTBJc1JVRkJjVU1zVDBGQmNrTTdRVUZEUkR0QlFUbE1iVUk3TzBGQlFVRTdRVUZCUVRzN1FVRnBUWFJDT3pzN096czdPMEZCUzBFc1RVRkJUU3hoUVVGaExFVkJRVzVDT3p0QlFVVkJMRTFCUVUwc1dVRkJXU3hUUVVGVExHZENRVUZVTEU5QlFUaENMRWxCUVRsQ0xFTkJRV3hDTzBGQlEwRXNUVUZCU1N4VFFVRktMRVZCUVdVN1FVRkRZaXhWUVVGTkxFbEJRVTRzUTBGQlZ5eFRRVUZZTEVWQlFYTkNMRTlCUVhSQ0xFTkJRVGhDTEZWQlFVTXNUMEZCUkN4RlFVRmhPMEZCUTNwRExGVkJRVTBzVTBGQlV5d3lRMEZCYjBJc1QwRkJjRUlzUlVGQk5rSXNhMEpCUVRkQ0xFVkJRV2xFTEhGQ1FVRnFSQ3hEUVVGbU8wRkJRMEVzWVVGQlR5eFBRVUZRTEVkQlFXbENMRTlCUVdwQ096dEJRVVZCTEZWQlFVa3NRMEZCUXl4UFFVRlBMRTFCUVZvc1JVRkJiMEk3UVVGRGJFSXNiVUpCUVZjc1NVRkJXQ3hEUVVGblFpeEpRVUZKTEZGQlFVb3NRMEZCWVN4TlFVRmlMRU5CUVdoQ08wRkJRMFE3UVVGRFJpeExRVkJFTzBGQlVVUTdPMEZCUlVRc1RVRkJTU3hUUVVGS0xFVkJRV1U3UVVGRFlpeGhRVUZUTEdkQ1FVRlVMRU5CUVRCQ0xFOUJRVEZDTEVWQlFXMURMRlZCUVVNc1MwRkJSQ3hGUVVGWE8wRkJRelZETEZWQlFVMHNaVUZCWlN3NFFrRkJhMElzVFVGQlRTeE5RVUY0UWl4RlFVRm5ReXhsUVVGb1F5eERRVUZ5UWp0QlFVTkJMRlZCUVVrc1dVRkJTaXhGUVVGclFqdEJRVU5vUWp0QlFVTkVPenRCUVVWRUxGVkJRVTBzVjBGQlZ5dzRRa0ZCYTBJc1RVRkJUU3hOUVVGNFFpeEZRVUZuUXl4VlFVRm9ReXhEUVVGcVFqczdRVUZGUVN4VlFVRkpMRkZCUVVvc1JVRkJZenRCUVVOYUxGbEJRVTBzYVVKQlFXbENMRk5CUVZNc1dVRkJWQ3hEUVVGelFpeGhRVUYwUWl4RFFVRjJRanRCUVVOQkxGbEJRVWtzYTBKQlFXdENMRzFDUVVGdFFpeEpRVUZ5UXl4SlFVRTJReXhSUVVGcVJDeEZRVUV5UkR0QlFVTjZSQ3hqUVVGTkxGbEJRVmtzVjBGQlZ5eEpRVUZZTEVOQlFXZENPMEZCUVVFc2JVSkJRVXNzUlVGQlJTeFZRVUZHTEU5QlFXMUNMRkZCUVhoQ08wRkJRVUVzVjBGQmFFSXNRMEZCYkVJN08wRkJSVUVzWTBGQlNTeERRVUZETEZOQlFVd3NSVUZCWjBJN1FVRkRaRHRCUVVORU96dEJRVVZFTEc5Q1FVRlZMRTFCUVZZN1FVRkRSRHRCUVVOR08wRkJRMFlzUzBGd1FrUTdRVUZ4UWtRN08wRkJSVVFzVTBGQlR5eFJRVUZRTzBGQlEwUXNRMEUzVDJkQ0xFVkJRV3BDT3p0clFrRXJUMlVzVVRzN096czdPenM3T3pzN096dEJRM0JRWmpzN096dEJRVU5CT3p0QlFVTkJPenM3T3pzN096c3JaVUZRUVRzN096czdPenRCUVZOQkxFbEJRVTBzYVVKQlFXdENMRmxCUVUwN08wRkJSVFZDT3pzN096czdRVUZOUVN4TlFVRk5MRTlCUVU4c1owSkJRVk1zVlVGQlZDeEZRVUZpTzBGQlEwRXNUVUZCVFN4eFFrRkJjVUk3UVVGRGVrSXNZVUZCVXl4SlFVUm5RanRCUVVWNlFpeGhRVUZUTEVsQlJtZENPMEZCUjNwQ0xGbEJRVkU3UVVGSWFVSXNSMEZCTTBJN1FVRkxRU3hOUVVGTkxIZENRVUYzUWl4RFFVTTFRaXhUUVVRMFFpeEZRVVUxUWl4UlFVWTBRaXhEUVVFNVFqczdRVUZMUVRzN096czdPMEZCYmtJMFFpeE5RWGxDZEVJc1kwRjZRbk5DTzBGQlFVRTdPMEZCTWtJeFFpdzRRa0ZCTUVJN1FVRkJRU3hWUVVGa0xFOUJRV01zZFVWQlFVb3NSVUZCU1RzN1FVRkJRVHM3UVVGQlFTeHJTVUZEYkVJc1QwRkVhMEk3TzBGQlIzaENMRmxCUVVzc2EwSkJRVXdzUjBGQk1FSXNWVUZCUXl4TFFVRkVMRVZCUVZjN1FVRkRia01zV1VGQlRTeFRRVUZUTEUxQlFVMHNUVUZCVGl4RFFVRmhMRXRCUVRWQ096dEJRVVZCTEZsQlFVa3NWMEZCVnl4RlFVRm1MRVZCUVcxQ08wRkJRMnBDTEdkQ1FVRkxMRk5CUVV3N1FVRkRRVHRCUVVORU96dEJRVWRFTEdOQlFVc3NVVUZCVEN4SFFVRm5RaXhQUVVGb1FpeERRVUYzUWl4VlFVRkRMRWxCUVVRc1JVRkJWVHRCUVVOb1F5eGpRVUZOTEV0QlFVc3NUMEZCVHl4TlFVRkxMRTlCUVV3c1EwRkJZU3hWUVVGd1FpeExRVUZ0UXl4VlFVRnVReXhIUVVGblJDeE5RVUZMTEU5QlFVd3NRMEZCWVN4VlFVRTNSQ3hIUVVFd1JTeE5RVUZMTEZWQlFURkdPenRCUVVWQkxHTkJRVWtzUjBGQlJ5eE5RVUZJTEVWQlFWY3NTVUZCV0N4RFFVRktMRVZCUVhOQ08wRkJRM0JDTEdsQ1FVRkxMRTlCUVV3c1EwRkJZU3hMUVVGaUxFTkJRVzFDTEU5QlFXNUNMRWRCUVRaQ0xFOUJRVGRDTzBGQlEwUXNWMEZHUkN4TlFVVlBPMEZCUTB3c2FVSkJRVXNzVDBGQlRDeERRVUZoTEV0QlFXSXNRMEZCYlVJc1QwRkJia0lzUjBGQk5rSXNUVUZCTjBJN1FVRkRSRHRCUVVOR0xGTkJVa1E3UVVGVFJDeFBRV3hDUkRzN1FVRnZRa0VzV1VGQlN5eGpRVUZNTEVkQlFYTkNMR2RDUVVGMFFpeERRVUYxUXl4UFFVRjJReXhGUVVGblJDeE5RVUZMTEd0Q1FVRnlSRHRCUVhaQ2QwSTdRVUYzUW5wQ096dEJRVzVFZVVJN1FVRkJRVHRCUVVGQkxHMURRWEZFVXp0QlFVRkJMRmxCUVhoQ0xFMUJRWGRDTEhWRlFVRm1MRVZCUVdVN1FVRkJRU3haUVVGWUxFbEJRVmNzZFVWQlFVb3NSVUZCU1RzN1FVRkRha01zV1VGQlNTeExRVUZMTEV0QlFVd3NRMEZCVnl4UFFVRllMRU5CUVcxQ0xFMUJRVzVDTEVsQlFUWkNMRU5CUVVNc1EwRkJPVUlzU1VGRFF5eExRVUZMTEVsQlFVd3NRMEZCVlN4UFFVRldMRU5CUVd0Q0xFMUJRV3hDTEVsQlFUUkNMRU5CUVVNc1EwRkViRU1zUlVGRGNVTTdRVUZEYmtNc2FVSkJRVThzU1VGQlVEdEJRVU5FT3p0QlFVVkVMR1ZCUVU4c1MwRkJVRHRCUVVORU8wRkJOVVI1UWp0QlFVRkJPMEZCUVVFc2FVTkJPRVJtTzBGQlFVRTdPMEZCUTFRc1dVRkJTU3hSUVVGUkxFMUJRVTBzU1VGQlRpeERRVUZYTEV0QlFVc3NUMEZCVEN4RFFVRmhMRTlCUVdJc1EwRkJjVUlzWjBKQlFYSkNMRU5CUVhORExFOUJRWFJETEV0QlFXdEVMRVZCUVRkRUxFTkJRVm83UVVGRFFTeG5Ra0ZCVVN4TlFVRk5MRWRCUVU0c1EwRkJWU3hWUVVGRExFbEJRVVFzUlVGQlZUdEJRVU14UWl4alFVRk5MRTlCUVU4c1QwRkJTeXhYUVVGTUxFTkJRV2xDTEVsQlFXcENMRU5CUVdJN1FVRkRRU3hwUWtGQlR5eEZRVUZGTEUxQlFVMHNTMEZCU3l4SlFVRmlMRVZCUVcxQ0xFOUJRVThzUzBGQlN5eExRVUV2UWl4RlFVRnpReXhUUVVGVExFbEJRUzlETEVWQlFWQTdRVUZEUkN4VFFVaFBMRU5CUVZJN08wRkJTMEVzWlVGQlR5eExRVUZRTzBGQlEwUTdRVUYwUlhsQ08wRkJRVUU3UVVGQlFTeHJRMEYzUldRN1FVRkRWaXhoUVVGTExGRkJRVXdzUjBGQlowSXNUMEZCYUVJc1EwRkJkMElzVlVGQlF5eEpRVUZFTEVWQlFWVTdRVUZEYUVNc1pVRkJTeXhQUVVGTUxFTkJRV0VzUzBGQllpeERRVUZ0UWl4UFFVRnVRaXhIUVVFMlFpeFBRVUUzUWp0QlFVTkVMRk5CUmtRN1FVRkhSRHRCUVRWRmVVSTdRVUZCUVR0QlFVRkJMSFZEUVRoRlZEdEJRVU5tTEdWQlFVOHNTMEZCU3l4UFFVRk1MRU5CUVdFc1QwRkJZaXhEUVVGeFFpeGhRVUZ5UWl4RFFVRnRReXh6UWtGQmJrTXNRMEZCVUR0QlFVTkVPMEZCYUVaNVFqdEJRVUZCTzBGQlFVRXNOa0pCYTBadVFqdEJRVU5NTEd0SlFVRnJRanRCUVVOb1FqdEJRVU5CTEdWQlFVc3NZMEZCVEN4SFFVRnpRaXhMUVVGMFFpeEhRVUU0UWl4RlFVRTVRanRCUVVOQk8wRkJRMEVzWlVGQlN5eFRRVUZNTzBGQlEwUTdRVUZEUmp0QlFYcEdlVUk3UVVGQlFUdEJRVUZCTEc5RFFUSkdUQ3hQUVROR1N5eEZRVEpHU1R0QlFVTTFRaXhsUVVGUExFbEJRVWtzWTBGQlNpeERRVUZ0UWl4UFFVRnVRaXhEUVVGUU8wRkJRMFE3UVVFM1JubENPenRCUVVGQk8wRkJRVUU3TzBGQlowYzFRanM3T3pzN096dEJRVXRCTEUxQlFVMHNZVUZCWVN4RlFVRnVRanRCUVVOQkxFMUJRVTBzV1VGQldTeFRRVUZUTEdkQ1FVRlVMRTlCUVRoQ0xFbEJRVGxDTEVOQlFXeENPenRCUVVWQkxFMUJRVWtzVTBGQlNpeEZRVUZsTzBGQlEySXNWVUZCVFN4SlFVRk9MRU5CUVZjc1UwRkJXQ3hGUVVGelFpeFBRVUYwUWl4RFFVRTRRaXhWUVVGRExFOUJRVVFzUlVGQllUdEJRVU42UXl4VlFVRk5MRk5CUVZNc01rTkJRVzlDTEU5QlFYQkNMRVZCUVRaQ0xHdENRVUUzUWl4RlFVRnBSQ3h4UWtGQmFrUXNRMEZCWmp0QlFVTkJMR0ZCUVU4c1QwRkJVQ3hIUVVGcFFpeFBRVUZxUWpzN1FVRkZRU3hWUVVGSkxFOUJRVThzVFVGQldDeEZRVUZ0UWp0QlFVTnFRanRCUVVOQkxHMUNRVUZYTEVsQlFWZ3NRMEZCWjBJc1NVRkJTU3hqUVVGS0xFTkJRVzFDTEUxQlFXNUNMRU5CUVdoQ08wRkJRMFE3UVVGRFJpeExRVkpFTzBGQlUwUTdPMEZCUlVRc1RVRkJTU3hUUVVGS0xFVkJRV1U3UVVGRFlpeGhRVUZUTEdkQ1FVRlVMRU5CUVRCQ0xFOUJRVEZDTEVWQlFXMURMRlZCUVVNc1MwRkJSQ3hGUVVGWE8wRkJRelZETEZWQlFVMHNaVUZCWlN3NFFrRkJhMElzVFVGQlRTeE5RVUY0UWl4RlFVRm5ReXhsUVVGb1F5eERRVUZ5UWp0QlFVTkJMRlZCUVVrc1dVRkJTaXhGUVVGclFqdEJRVU5vUWp0QlFVTkVPenRCUVVWRUxGVkJRVTBzVjBGQlZ5dzRRa0ZCYTBJc1RVRkJUU3hOUVVGNFFpeEZRVUZuUXl4VlFVRm9ReXhEUVVGcVFqczdRVUZGUVN4VlFVRkpMRkZCUVVvc1JVRkJZenRCUVVOYUxGbEJRVTBzYVVKQlFXbENMRk5CUVZNc1dVRkJWQ3hEUVVGelFpeGhRVUYwUWl4RFFVRjJRanRCUVVOQkxGbEJRVWtzYTBKQlFXdENMRzFDUVVGdFFpeEpRVUZ5UXl4SlFVRTJReXhSUVVGcVJDeEZRVUV5UkR0QlFVTjZSQ3hqUVVGTkxGbEJRVmtzVjBGQlZ5eEpRVUZZTEVOQlFXZENPMEZCUVVFc2JVSkJRVXNzUlVGQlJTeFZRVUZHTEU5QlFXMUNMRkZCUVhoQ08wRkJRVUVzVjBGQmFFSXNRMEZCYkVJN08wRkJSVUVzWTBGQlNTeERRVUZETEZOQlFVd3NSVUZCWjBJN1FVRkRaRHRCUVVORU96dEJRVVZFTEc5Q1FVRlZMRTFCUVZZN1FVRkRSRHRCUVVOR08wRkJRMFlzUzBGd1FrUTdRVUZ4UWtRN08wRkJSVVFzVTBGQlR5eGpRVUZRTzBGQlEwUXNRMEUzU1hOQ0xFVkJRWFpDT3p0clFrRXJTV1VzWXpzN096czdPenM3T3pzN096dEJRMjVLWmpzN096czdPenM3T3pzclpVRk1RVHM3T3pzN096dEJRVTlCTEVsQlFVMHNVMEZCVlN4WlFVRk5PMEZCUTNCQ096czdPenM3UVVGTlFTeE5RVUZOTEU5QlFVOHNVVUZCWWp0QlFVTkJMRTFCUVUwc1ZVRkJWU3hQUVVGb1FqdEJRVU5CTEUxQlFVMHNjVUpCUVhGQ08wRkJRM3BDTEdGQlFWTXNTVUZFWjBJN1FVRkZla0lzVjBGQlR5eEpRVVpyUWp0QlFVZDZRaXhWUVVGTk8wRkJTRzFDTEVkQlFUTkNPMEZCUzBFc1RVRkJUU3gzUWtGQmQwSXNSVUZCT1VJN08wRkJSVUU3T3pzN096dEJRV2hDYjBJc1RVRnpRbVFzVFVGMFFtTTdRVUZCUVRzN1FVRjNRbXhDTEhOQ1FVRXdRanRCUVVGQkxGVkJRV1FzVDBGQll5eDFSVUZCU2l4RlFVRkpPenRCUVVGQk96dEJRVWQ0UWp0QlFVaDNRaXhyU0VGRGJFSXNTVUZFYTBJc1JVRkRXaXhQUVVSWkxFVkJRMGdzYTBKQlJFY3NSVUZEYVVJc1QwRkVha0lzUlVGRE1FSXNjVUpCUkRGQ0xFVkJRMmxFTEV0QlJHcEVMRVZCUTNkRUxFdEJSSGhFT3p0QlFVbDRRaXhWUVVGTkxHZENRVUZuUWl4TlFVRkxMRlZCUVV3c1JVRkJkRUk3UVVGRFFTeFZRVUZKTEU5QlFVOHNUVUZCU3l4UFFVRk1MRU5CUVdFc1MwRkJjRUlzUzBGQk9FSXNVVUZCT1VJc1NVRkRReXhEUVVGRExHTkJRV01zVTBGQlpDeERRVUYzUWl4UlFVRjRRaXhaUVVFd1F5eE5RVUZMTEU5QlFVd3NRMEZCWVN4TFFVRjJSQ3hEUVVST0xFVkJRM1ZGTzBGQlEzSkZMSE5DUVVGakxGTkJRV1FzUTBGQmQwSXNSMEZCZUVJc1dVRkJjVU1zVFVGQlN5eFBRVUZNTEVOQlFXRXNTMEZCYkVRN1FVRkRSRHM3UVVGRlJDeFpRVUZMTEZWQlFVd3NSMEZCYTBJc1RVRkJTeXhQUVVGTUxFTkJRV0VzU1VGQllpeExRVUZ6UWl4SlFVRjRRenRCUVZaM1FqdEJRVmQ2UWpzN1FVRnVRMmxDTzBGQlFVRTdRVUZCUVN4elEwRnhRMFk3UVVGRFpDeFpRVUZKTEVOQlFVTXNTMEZCU3l4VlFVRldMRVZCUVhOQ08wRkJRM0JDTEdOQlFVMHNUMEZCVHl4TFFVRkxMRTlCUVV3c1EwRkJZU3hQUVVGaUxFTkJRWEZDTEhGQ1FVRnlRaXhGUVVGaU8wRkJRMEVzYVVKQlFVOHNTMEZCU3l4TlFVRmFPMEZCUTBRN08wRkJSVVFzWlVGQlR5eExRVUZMTEU5QlFVd3NRMEZCWVN4SlFVRndRanRCUVVORU8wRkJOVU5wUWp0QlFVRkJPMEZCUVVFc2JVTkJPRU5NTzBGQlExZ3NaVUZCVHl4TFFVRkxMRTlCUVV3c1EwRkJZU3hQUVVGaUxFTkJRWEZDTEdGQlFYSkNMRU5CUVcxRExHbENRVUZ1UXl4RFFVRlFPMEZCUTBRN1FVRm9SR2xDTzBGQlFVRTdRVUZCUVN3MlFrRnJSRmc3UVVGRFRDeFpRVUZKTEV0QlFVc3NUMEZCVEN4RFFVRmhMRTlCUVdJc1EwRkJjVUlzVTBGQmNrSXNRMEZCSzBJc1VVRkJMMElzUTBGQmQwTXNUVUZCZUVNc1EwRkJTaXhGUVVGeFJEdEJRVU51UkN4bFFVRkxMRTlCUVV3c1EwRkJZU3hQUVVGaUxFTkJRWEZDTEZOQlFYSkNMRU5CUVN0Q0xFMUJRUzlDTEVOQlFYTkRMRTFCUVhSRE8wRkJRMFE3TzBGQlJVUXNXVUZCVFN4UFFVRlBMRXRCUVVzc1lVRkJUQ3hGUVVGaU8wRkJRMEVzWVVGQlN5eFBRVUZNTEVOQlFXRXNTVUZCWWl4SFFVRnZRaXhKUVVGd1FqczdRVUZGUVN4WlFVRkpMRXRCUVVzc1ZVRkJWQ3hGUVVGeFFqdEJRVU51UWl4bFFVRkxMRTlCUVV3c1EwRkJZU3hQUVVGaUxFTkJRWEZDTEV0QlFYSkNMRU5CUVRKQ0xFdEJRVE5DTEVkQlFYTkRMRXRCUVVzc1QwRkJUQ3hEUVVGaExFbEJRVzVFTzBGQlEwRXNaVUZCU3l4UFFVRk1MRU5CUVdFc1QwRkJZaXhEUVVGeFFpeExRVUZ5UWl4RFFVRXlRaXhOUVVFelFpeEhRVUYxUXl4TFFVRkxMRTlCUVV3c1EwRkJZU3hKUVVGd1JEczdRVUZGUVN4alFVRk5MR2RDUVVGblFpeExRVUZMTEZWQlFVd3NSVUZCZEVJN1FVRkRRU3gzUWtGQll5eExRVUZrTEVOQlFXOUNMRXRCUVhCQ0xFZEJRU3RDTEV0QlFVc3NUMEZCVEN4RFFVRmhMRWxCUVRWRE8wRkJRMEVzZDBKQlFXTXNTMEZCWkN4RFFVRnZRaXhOUVVGd1FpeEhRVUZuUXl4TFFVRkxMRTlCUVV3c1EwRkJZU3hKUVVFM1F6dEJRVU5FT3p0QlFVVkVMR1ZCUVU4c1NVRkJVRHRCUVVORU8wRkJjRVZwUWp0QlFVRkJPMEZCUVVFc1owTkJjMFZoTzBGQlFVRXNXVUZCZGtJc1kwRkJkVUlzZFVWQlFVNHNTVUZCVFRzN1FVRkROMElzV1VGQlNTeGpRVUZLTEVWQlFXOUNPMEZCUTJ4Q0xHVkJRVXNzU1VGQlREdEJRVU5FTEZOQlJrUXNUVUZGVHp0QlFVTk1MR1ZCUVVzc1NVRkJURHRCUVVORU96dEJRVVZFTEZsQlFVMHNaMEpCUVdkQ0xFdEJRVXNzVlVGQlRDeEZRVUYwUWpzN1FVRkZRU3haUVVGSkxHdENRVU5HTEVOQlFVTXNZMEZCWXl4VFFVRmtMRU5CUVhkQ0xGRkJRWGhDTEVOQlFXbERMSGxDUVVGcVF5eERRVVJJTEVWQlEyZEZPMEZCUXpsRUxIZENRVUZqTEZOQlFXUXNRMEZCZDBJc1IwRkJlRUlzUTBGQk5FSXNlVUpCUVRWQ08wRkJRMEVzYVVKQlFVOHNTVUZCVUR0QlFVTkVPenRCUVVWRUxGbEJRVWtzUTBGQlF5eGpRVUZFTEVsQlEwWXNZMEZCWXl4VFFVRmtMRU5CUVhkQ0xGRkJRWGhDTEVOQlFXbERMSGxDUVVGcVF5eERRVVJHTEVWQlF5dEVPMEZCUXpkRUxIZENRVUZqTEZOQlFXUXNRMEZCZDBJc1RVRkJlRUlzUTBGQkswSXNlVUpCUVM5Q08wRkJRMFE3TzBGQlJVUXNaVUZCVHl4SlFVRlFPMEZCUTBRN1FVRXpSbWxDTzBGQlFVRTdRVUZCUVN3MlFrRTJSbGc3UVVGRFRDeFpRVUZKTEVOQlFVTXNTMEZCU3l4UFFVRk1MRU5CUVdFc1QwRkJZaXhEUVVGeFFpeFRRVUZ5UWl4RFFVRXJRaXhSUVVFdlFpeERRVUYzUXl4TlFVRjRReXhEUVVGTUxFVkJRWE5FTzBGQlEzQkVMR1ZCUVVzc1QwRkJUQ3hEUVVGaExFOUJRV0lzUTBGQmNVSXNVMEZCY2tJc1EwRkJLMElzUjBGQkwwSXNRMEZCYlVNc1RVRkJia003UVVGRFJEczdRVUZGUkN4bFFVRlBMRWxCUVZBN1FVRkRSRHRCUVc1SGFVSTdRVUZCUVR0QlFVRkJMRzFEUVhGSFJUdEJRVU5zUWl4bFFVRlBMRWxCUVZBN1FVRkRSRHRCUVhaSGFVSTdRVUZCUVR0QlFVRkJMRzlEUVhsSFJ5eFBRWHBIU0N4RlFYbEhXVHRCUVVNMVFpeDVSMEZCTWtJc1RVRkJNMElzUlVGQmJVTXNUMEZCYmtNN1FVRkRSRHRCUVROSGFVSTdPMEZCUVVFN1FVRkJRVHM3UVVFNFIzQkNMRk5CUVU4c1RVRkJVRHRCUVVORUxFTkJMMGRqTEVWQlFXWTdPMnRDUVdsSVpTeE5PenM3T3pzN096czdPenM3TzBGRGJraG1PenM3TzBGQlEwRTdPenM3T3pzN096czdLMlZCVGtFN096czdPenM3UVVGUlFTeEpRVUZOTEdWQlFXZENMRmxCUVUwN1FVRkRNVUk3T3pzN096dEJRVTFCTEUxQlFVMHNUMEZCVHl4alFVRmlPMEZCUTBFc1RVRkJUU3hWUVVGVkxFOUJRV2hDTzBGQlEwRXNUVUZCVFN4eFFrRkJjVUk3UVVGRGVrSXNZVUZCVXl4SlFVUm5RanRCUVVWNlFpeGhRVUZUTEVWQlJtZENPMEZCUjNwQ0xHZENRVUZaTEVsQlNHRTdRVUZKZWtJc1lVRkJVeXhKUVVwblFqdEJRVXQ2UWl4blFrRkJXVHRCUVV4aExFZEJRVE5DTzBGQlQwRXNUVUZCVFN4M1FrRkJkMElzUTBGRE5VSXNVMEZFTkVJc1EwRkJPVUk3TzBGQlNVRTdPenM3T3p0QlFYQkNNRUlzVFVFd1FuQkNMRmxCTVVKdlFqdEJRVUZCT3p0QlFUUkNlRUlzTkVKQlFUQkNPMEZCUVVFc1ZVRkJaQ3hQUVVGakxIVkZRVUZLTEVWQlFVazdPMEZCUVVFN08wRkJRVUVzT0VoQlEyeENMRWxCUkd0Q0xFVkJRMW9zVDBGRVdTeEZRVU5JTEd0Q1FVUkhMRVZCUTJsQ0xFOUJSR3BDTEVWQlF6QkNMSEZDUVVReFFpeEZRVU5wUkN4SlFVUnFSQ3hGUVVOMVJDeExRVVIyUkRzN1FVRkhlRUlzV1VGQlN5eFJRVUZNTEVkQlFXZENMRXRCUTJoQ0xEUkNRVVJuUWl4SFFVVmtMR3REUVVaakxFZEJSMW9zTmtKQlNGa3NSMEZKV2l4eFJrRktXU3hIUVV0V0xIbERRVXhWTEVkQlRWb3NWMEZPV1N4SFFVOWtMRkZCVUdNc1IwRlJhRUlzVVVGU1FUczdRVUZWUVN4VlFVRkpMRTFCUVVzc1kwRkJWQ3hGUVVGNVFqdEJRVU4yUWl4alFVRkxMRXRCUVV3N1FVRkRSRHM3UVVGRlJDeFpRVUZMTEdWQlFVd3NSMEZCZFVJc1NVRkJka0k3UVVGcVFuZENPMEZCYTBKNlFqczdRVUU1UTNWQ08wRkJRVUU3UVVGQlFTdzRRa0ZuUkdoQ08wRkJRMDRzV1VGQlRTeFZRVUZWTEZOQlFWTXNZVUZCVkN4RFFVRjFRaXhMUVVGMlFpeERRVUZvUWpzN1FVRkZRU3huUWtGQlVTeFRRVUZTTEVkQlFXOUNMRXRCUVVzc1VVRkJla0k3TzBGQlJVRXNZVUZCU3l4UFFVRk1MRU5CUVdFc1QwRkJZaXhIUVVGMVFpeFJRVUZSTEZWQlFTOUNPenRCUVVWQk8wRkJRMEVzWVVGQlN5eFBRVUZNTEVOQlFXRXNUMEZCWWl4RFFVRnhRaXhoUVVGeVFpeERRVUZ0UXl4VlFVRnVReXhGUVVFclF5eFRRVUV2UXl4SFFVRXlSQ3hMUVVGTExFOUJRVXdzUTBGQllTeFBRVUY0UlRzN1FVRkZRU3haUVVGSkxFTkJRVU1zUzBGQlN5eFBRVUZNTEVOQlFXRXNWVUZCYkVJc1JVRkJPRUk3UVVGRE5VSXNaVUZCU3l4UFFVRk1MRU5CUVdFc1QwRkJZaXhEUVVGeFFpeGhRVUZ5UWl4RFFVRnRReXhSUVVGdVF5eEZRVUUyUXl4TFFVRTNReXhEUVVGdFJDeFBRVUZ1UkN4SFFVRTJSQ3hOUVVFM1JEdEJRVU5FT3p0QlFVVkVMR2xDUVVGVExFbEJRVlFzUTBGQll5eFhRVUZrTEVOQlFUQkNMRXRCUVVzc1QwRkJUQ3hEUVVGaExFOUJRWFpET3p0QlFVVkJMR0ZCUVVzc1lVRkJURHRCUVVORU8wRkJha1YxUWp0QlFVRkJPMEZCUVVFc05rSkJiVVZxUWp0QlFVRkJPenRCUVVOTUxGbEJRVWtzUzBGQlN5eFBRVUZNTEVOQlFXRXNUMEZCWWl4TFFVRjVRaXhKUVVFM1FpeEZRVUZ0UXp0QlFVTnFRenRCUVVOQkxHVkJRVXNzUzBGQlREdEJRVU5FT3p0QlFVVkVMRmxCUVVrc1MwRkJTeXhQUVVGTUxFTkJRV0VzVDBGQllpeERRVUZ4UWl4VFFVRnlRaXhEUVVFclFpeFJRVUV2UWl4RFFVRjNReXhOUVVGNFF5eERRVUZLTEVWQlFYRkVPMEZCUTI1RUxHbENRVUZQTEV0QlFWQTdRVUZEUkRzN1FVRkZSRHRCUVVOQkxGbEJRVWtzUzBGQlN5eFBRVUZNTEVOQlFXRXNWVUZCYWtJc1JVRkJOa0k3UVVGRE0wSXNaVUZCU3l4UFFVRk1MRU5CUVdFc1QwRkJZaXhEUVVGeFFpeGxRVUZ5UWl4RFFVRnhReXhQUVVGeVF6dEJRVU5CTEdWQlFVc3NUMEZCVEN4RFFVRmhMRTlCUVdJc1EwRkJjVUlzV1VGQmNrSXNRMEZCYTBNc1QwRkJiRU1zUlVGQk1rTXNZMEZCTTBNN08wRkJSVUVzWlVGQlN5eFBRVUZNTEVOQlFXRXNUMEZCWWl4RFFVRnhRaXhUUVVGeVFpeERRVUVyUWl4SFFVRXZRaXhUUVVGNVF5eExRVUZMTEU5QlFVd3NRMEZCWVN4VlFVRjBSRHRCUVVOQkxHVkJRVXNzVDBGQlRDeERRVUZoTEU5QlFXSXNRMEZCY1VJc1lVRkJja0lzUTBGQmJVTXNVVUZCYmtNc1JVRkJOa01zVTBGQk4wTXNRMEZCZFVRc1IwRkJka1FzVlVGQmEwVXNTMEZCU3l4UFFVRk1MRU5CUVdFc1ZVRkJMMFU3UVVGRFJEczdRVUZGUkN4WlFVRkpMRXRCUVVzc1QwRkJUQ3hEUVVGaExGVkJRV3BDTEVWQlFUWkNPMEZCUXpOQ08wRkJRMEVzWTBGQlRTeG5Ra0ZCWjBJc1MwRkJTeXhQUVVGTUxFTkJRV0VzVDBGQllpeERRVUZ4UWl4aFFVRnlRaXhEUVVGdFF5eFJRVUZ1UXl4RFFVRjBRanRCUVVOQkxHVkJRVXNzWlVGQlRDeERRVUZ4UWl4RlFVRkZMRkZCUVZFc1lVRkJWaXhGUVVGNVFpeFBRVUZQTEU5QlFXaERMRVZCUVhKQ08wRkJRMFE3TzBGQlJVUXNiVUpCUVZjc1dVRkJUVHRCUVVObUxHbENRVUZMTEU5QlFVd3NRMEZCWVN4UFFVRmlMRU5CUVhGQ0xGTkJRWEpDTEVOQlFTdENMRWRCUVM5Q0xFTkJRVzFETEUxQlFXNURPenRCUVVWQk8wRkJRMEVzWTBGQlRTeHpRa0ZCYzBJc1UwRkJVeXhuUWtGQlZDeERRVUV3UWl4dlFrRkJNVUlzUzBGQmJVUXNSVUZCTDBVN1FVRkRRU3hqUVVGSkxHVkJRV1VzUTBGQmJrSTdRVUZEUVN3NFFrRkJiMElzVDBGQmNFSXNRMEZCTkVJc1ZVRkJReXhaUVVGRUxFVkJRV3RDTzBGQlF6VkRMR2RDUVVGSkxFOUJRVXNzVDBGQlRDeERRVUZoTEU5QlFXSXNTMEZCZVVJc1dVRkJOMElzUlVGQk1rTTdRVUZEZWtNc2EwSkJRVTBzVVVGQlVTeHBRa0ZCYVVJc1dVRkJha0lzUTBGQlpEdEJRVU5CTERoQ1FVRm5RaXhoUVVGaExGbEJRV0lzUjBGQk5FSXNVMEZCVXl4TlFVRk5MRmxCUVdZc1JVRkJOa0lzUlVGQk4wSXNRMEZCTlVNN1FVRkRSRHRCUVVOR0xGZEJURVE3TzBGQlQwRXNhVUpCUVVzc1QwRkJUQ3hEUVVGaExFOUJRV0lzUTBGQmNVSXNTMEZCY2tJc1EwRkJNa0lzVTBGQk0wSXNiVUpCUVhGRUxGbEJRWEpFT3p0QlFVVkJMR2xDUVVGTExGbEJRVXdzUTBGQmEwSXNhVUpCUVUwc1NVRkJlRUk3TzBGQlJVRXNZMEZCVFN4VlFVRlZMRk5CUVZZc1QwRkJWU3hIUVVGTk8wRkJRM0JDTEcxQ1FVRkxMRmxCUVV3c1EwRkJhMElzYVVKQlFVMHNTMEZCZUVJN1FVRkRRU3h0UWtGQlN5eFBRVUZNTEVOQlFXRXNUMEZCWWl4RFFVRnhRaXh0UWtGQmNrSXNRMEZCZVVNc2FVSkJRVTBzWTBGQkwwTXNSVUZCSzBRc1QwRkJMMFE3UVVGRFJDeFhRVWhFT3p0QlFVdEJMR2xDUVVGTExFOUJRVXdzUTBGQllTeFBRVUZpTEVOQlFYRkNMR2RDUVVGeVFpeERRVUZ6UXl4cFFrRkJUU3hqUVVFMVF5eEZRVUUwUkN4UFFVRTFSRHRCUVVWRUxGTkJlRUpFTEVWQmQwSkhMRU5CZUVKSU96dEJRVEJDUVN4WlFVRkpMRTlCUVU4c1UwRkJVQ3hEUVVGcFFpeExRVUZMTEU5QlFVd3NRMEZCWVN4UFFVRTVRaXhMUVVFd1F5eExRVUZMTEU5QlFVd3NRMEZCWVN4UFFVRmlMRWRCUVhWQ0xFTkJRWEpGTEVWQlFYZEZPMEZCUTNSRk8wRkJRMEVzWlVGQlN5eGxRVUZNTEVkQlFYVkNMRmRCUVZjc1dVRkJUVHRCUVVOMFF5eHRRa0ZCU3l4SlFVRk1PMEZCUTBRc1YwRkdjMElzUlVGRmNFSXNTMEZCU3l4UFFVRk1MRU5CUVdFc1QwRkJZaXhIUVVGMVFpeERRVVpJTEVOQlFYWkNPMEZCUjBRN08wRkJSVVFzWlVGQlR5eEpRVUZRTzBGQlEwUTdRVUU1U0hWQ08wRkJRVUU3UVVGQlFTdzJRa0ZuU1dwQ08wRkJRVUU3TzBGQlEwdzdPenM3UVVGSlFTeFpRVUZKTEV0QlFVc3NaVUZCVkN4RlFVRXdRanRCUVVONFFpeDFRa0ZCWVN4TFFVRkxMR1ZCUVd4Q08wRkJRMEVzWlVGQlN5eGxRVUZNTEVkQlFYVkNMRWxCUVhaQ08wRkJRMFE3TzBGQlJVUXNXVUZCU1N4RFFVRkRMRXRCUVVzc1QwRkJUQ3hEUVVGaExFOUJRV0lzUTBGQmNVSXNVMEZCY2tJc1EwRkJLMElzVVVGQkwwSXNRMEZCZDBNc1RVRkJlRU1zUTBGQlRDeEZRVUZ6UkR0QlFVTndSQ3hwUWtGQlR5eExRVUZRTzBGQlEwUTdPMEZCUlVRc1lVRkJTeXhaUVVGTUxFTkJRV3RDTEdsQ1FVRk5MRWxCUVhoQ096dEJRVVZCTEZsQlFVa3NTMEZCU3l4UFFVRk1MRU5CUVdFc1ZVRkJha0lzUlVGQk5rSTdRVUZETTBJc1kwRkJUU3huUWtGQlowSXNTMEZCU3l4UFFVRk1MRU5CUVdFc1QwRkJZaXhEUVVGeFFpeGhRVUZ5UWl4RFFVRnRReXhSUVVGdVF5eERRVUYwUWp0QlFVTkJMR1ZCUVVzc2FVSkJRVXdzUTBGQmRVSXNSVUZCUlN4UlFVRlJMR0ZCUVZZc1JVRkJlVUlzVDBGQlR5eFBRVUZvUXl4RlFVRjJRanRCUVVORU96dEJRVVZFTEdGQlFVc3NUMEZCVEN4RFFVRmhMRTlCUVdJc1EwRkJjVUlzVTBGQmNrSXNRMEZCSzBJc1RVRkJMMElzUTBGQmMwTXNUVUZCZEVNN1FVRkRRU3hoUVVGTExFOUJRVXdzUTBGQllTeFBRVUZpTEVOQlFYRkNMRk5CUVhKQ0xFTkJRU3RDTEVkQlFTOUNMRU5CUVcxRExFMUJRVzVET3p0QlFVVkJMRmxCUVUwc1YwRkJWeXhUUVVGWUxGRkJRVmNzUjBGQlRUdEJRVU55UWl4cFFrRkJTeXhQUVVGTUxFTkJRV0VzVDBGQllpeERRVUZ4UWl4dFFrRkJja0lzUTBGQmVVTXNhVUpCUVUwc1kwRkJMME1zUlVGQkswUXNVVUZCTDBRN1FVRkRRU3hwUWtGQlN5eFBRVUZNTEVOQlFXRXNUMEZCWWl4RFFVRnhRaXhUUVVGeVFpeERRVUVyUWl4TlFVRXZRaXhEUVVGelF5eE5RVUYwUXpzN1FVRkZRU3hwUWtGQlN5eFpRVUZNTEVOQlFXdENMR2xDUVVGTkxFMUJRWGhDT3p0QlFVVkJMR05CUVVrc1QwRkJTeXhqUVVGVUxFVkJRWGxDTzBGQlEzWkNMSEZDUVVGVExFbEJRVlFzUTBGQll5eFhRVUZrTEVOQlFUQkNMRTlCUVVzc1QwRkJUQ3hEUVVGaExFOUJRWFpETzBGQlEwRXNiVUpCUVVzc1QwRkJUQ3hEUVVGaExFOUJRV0lzUjBGQmRVSXNTVUZCZGtJN1FVRkRSRHRCUVVOR0xGTkJWa1E3TzBGQldVRXNZVUZCU3l4UFFVRk1MRU5CUVdFc1QwRkJZaXhEUVVGeFFpeG5Ra0ZCY2tJc1EwRkJjME1zYVVKQlFVMHNZMEZCTlVNc1JVRkJORVFzVVVGQk5VUTdPMEZCUlVFc1pVRkJUeXhKUVVGUU8wRkJRMFE3UVVGMlMzVkNPMEZCUVVFN1FVRkJRU3gxUTBGNVMxQTdRVUZEWml4aFFVRkxMRWxCUVV3N1FVRkRSRHRCUVROTGRVSTdRVUZCUVR0QlFVRkJMRzFEUVRaTFNqdEJRVU5zUWl4bFFVRlBMRWxCUVZBN1FVRkRSRHRCUVM5TGRVSTdRVUZCUVR0QlFVRkJMRzlEUVdsTVNDeFBRV3BNUnl4RlFXbE1UVHRCUVVNMVFpeHhTRUZCTWtJc1dVRkJNMElzUlVGQmVVTXNUMEZCZWtNN1FVRkRSRHRCUVc1TWRVSTdPMEZCUVVFN1FVRkJRVHM3UVVGelRERkNMRk5CUVU4c1dVRkJVRHRCUVVORUxFTkJka3h2UWl4RlFVRnlRanM3YTBKQmVVeGxMRms3T3pzN096czdPenM3T3pzN1FVTTFUR1k3T3pzN1FVRkRRVHM3T3p0QlFVTkJPenRCUVVOQk96czdPenM3T3pzclpVRlNRVHM3T3pzN096dEJRVlZCTEVsQlFVMHNXVUZCWVN4WlFVRk5PMEZCUTNaQ096czdPenM3UVVGTlFTeE5RVUZOTEU5QlFVOHNXVUZCWWp0QlFVTkJMRTFCUVUwc1ZVRkJWU3hQUVVGb1FqdEJRVU5CTEUxQlFVMHNiMEpCUVc5Q0xIRkNRVUV4UWp0QlFVTkJMRTFCUVUwc2NVSkJRWEZDTzBGQlEzcENMR0ZCUVZNc1NVRkVaMEk3UVVGRmVrSXNWMEZCVHp0QlFVTk1MRlZCUVVrc1MwRkVRenRCUVVWTUxGVkJRVWtzUzBGR1F6dEJRVWRNTEZWQlFVazdRVUZJUXp0QlFVWnJRaXhIUVVFelFqdEJRVkZCTEUxQlFVMHNkMEpCUVhkQ0xFTkJRelZDTEU5QlJEUkNMRU5CUVRsQ096dEJRVWxCT3pzN096czdRVUYwUW5WQ0xFMUJORUpxUWl4VFFUVkNhVUk3UVVGQlFUczdRVUU0UW5KQ0xIbENRVUV3UWp0QlFVRkJMRlZCUVdRc1QwRkJZeXgxUlVGQlNpeEZRVUZKT3p0QlFVRkJPenRCUVVGQkxIZElRVU5zUWl4SlFVUnJRaXhGUVVOYUxFOUJSRmtzUlVGRFNDeHJRa0ZFUnl4RlFVTnBRaXhQUVVScVFpeEZRVU13UWl4eFFrRkVNVUlzUlVGRGFVUXNTMEZFYWtRc1JVRkRkMFFzU1VGRWVFUTdPMEZCUjNoQ0xGbEJRVXNzVjBGQlRDeEhRVUZ0UWl4SlFVRnVRanRCUVVOQkxGbEJRVXNzV1VGQlRDeEhRVUZ2UWl4SlFVRndRanRCUVVOQkxGbEJRVXNzVDBGQlRDeEhRVUZsTEVsQlFXWTdPMEZCUlVFc1dVRkJTeXhWUVVGTUxFZEJRV3RDTEVOQlFVTXNUVUZCUkN4RlFVRlRMRTlCUVZRc1EwRkJiRUk3TzBGQlJVRXNWVUZCVFN4TFFVRkxMRVZCUVVVc1RVRkJUU3hKUVVGU0xFVkJRV01zVDBGQlR5eFBRVUZQTEZWQlFWQXNRMEZCYTBJc2EwSkJRV3hDTEVOQlFYSkNMRVZCUVZnN1FVRkRRU3hWUVVGTkxFdEJRVXNzUlVGQlJTeE5RVUZOTEVsQlFWSXNSVUZCWXl4UFFVRlBMRTlCUVU4c1ZVRkJVQ3hEUVVGclFpeHZRa0ZCYkVJc1EwRkJja0lzUlVGQldEdEJRVU5CTEZWQlFVMHNTMEZCU3l4RlFVRkZMRTFCUVUwc1NVRkJVaXhGUVVGakxFOUJRVThzVDBGQlR5eFZRVUZRTEVOQlFXdENMRzlDUVVGc1FpeERRVUZ5UWl4RlFVRllPMEZCUTBFc1ZVRkJUU3hMUVVGTExFVkJRVVVzVFVGQlRTeEpRVUZTTEVWQlFXTXNUMEZCVHl4UFFVRlBMRlZCUVZBc1EwRkJhMElzY1VKQlFXeENMRU5CUVhKQ0xFVkJRVmc3TzBGQlJVRXNXVUZCU3l4TFFVRk1MRWRCUVdFc1EwRkJReXhGUVVGRUxFVkJRVXNzUlVGQlRDeEZRVUZUTEVWQlFWUXNSVUZCWVN4RlFVRmlMRVZCUVdsQ0xFOUJRV3BDTEVWQlFXSTdPMEZCUlVFc1dVRkJTeXhqUVVGTU8wRkJRMEVzV1VGQlN5eFZRVUZNT3p0QlFVVkJMR0ZCUVU4c1owSkJRVkFzUTBGQmQwSXNVVUZCZUVJc1JVRkJhME03UVVGQlFTeGxRVUZOTEUxQlFVc3NWVUZCVEN4RlFVRk9PMEZCUVVFc1QwRkJiRU1zUlVGQk1rUXNTMEZCTTBRN1FVRnVRbmRDTzBGQmIwSjZRanM3UVVGc1JHOUNPMEZCUVVFN1FVRkJRU3gxUTBGdlJFbzdRVUZCUVRzN1FVRkRaaXhoUVVGTExGVkJRVXdzUTBGQlowSXNTMEZCYUVJc1EwRkJjMElzVlVGQlF5eFRRVUZFTEVWQlFXVTdRVUZEYmtNc1kwRkJTU3hQUVVGTExFOUJRVXdzUTBGQllTeFBRVUZpTEVOQlFYRkNMRk5CUVhKQ0xFTkJRU3RDTEZGQlFTOUNMR2xDUVVGelJDeFRRVUYwUkN4RFFVRktMRVZCUVhkRk8wRkJRM1JGTEcxQ1FVRkxMRk5CUVV3c1IwRkJhVUlzVTBGQmFrSTdRVUZEUVN4dFFrRkJUeXhMUVVGUU8wRkJRMFE3UVVGRFJDeHBRa0ZCVHl4SlFVRlFPMEZCUTBRc1UwRk9SRHRCUVU5RU8wRkJOVVJ2UWp0QlFVRkJPMEZCUVVFc2JVTkJPRVJTTzBGQlFVRTdPMEZCUTFnc1dVRkJTU3hGUVVGRkxHZENRVUZuUWl4TlFVRnNRaXhEUVVGS0xFVkJRU3RDTzBGQlF6ZENPMEZCUTBRN08wRkJSVVFzWVVGQlN5eExRVUZNTEVOQlFWY3NTMEZCV0N4RFFVRnBRaXhWUVVGRExFbEJRVVFzUlVGQlZUdEJRVU42UWl4alFVRk5MRkZCUVZFc1MwRkJTeXhMUVVGTUxFTkJRVmNzUzBGQldDeERRVUZwUWl4TFFVRnFRaXhEUVVGMVFpd3dRa0ZCZGtJc1EwRkJaRHM3UVVGRlFTeGpRVUZKTEV0QlFVb3NSVUZCVnp0QlFVTlVMR2RDUVVGSkxFdEJRVXNzUzBGQlRDeERRVUZYTEU5QlFXWXNSVUZCZDBJN1FVRkRkRUlzYTBKQlFVa3NUMEZCU3l4WlFVRk1MRXRCUVhOQ0xFdEJRVXNzU1VGQkwwSXNSVUZCY1VNN1FVRkRia01zZFVKQlFVc3NVVUZCVEN4RFFVRmpMRXRCUVVzc1NVRkJia0k3UVVGRFJEdEJRVU5FTEhGQ1FVRkxMRmxCUVV3c1IwRkJiMElzUzBGQlN5eEpRVUY2UWp0QlFVTkJMSEZDUVVGUExFdEJRVkE3UVVGRFJEdEJRVU5HT3p0QlFVVkVMR2xDUVVGUExFbEJRVkE3UVVGRFJDeFRRV1JFTzBGQlpVUTdRVUZzUm05Q08wRkJRVUU3UVVGQlFTeDNRMEZ2UmtnN1FVRkRhRUlzWlVGQlR5eDVTRUZCTWtJc1MwRkJTeXhQUVVGTUxFTkJRV0VzUzBGQllpeERRVUZ0UWl4TFFVRkxMRmxCUVhoQ0xFMUJRVEJETEVsQlFUVkZPMEZCUTBRN1FVRjBSbTlDTzBGQlFVRTdRVUZCUVN3clFrRjNSbG9zU1VGNFJsa3NSVUYzUms0N1FVRkRZaXhaUVVGTkxGVkJRVlVzVTBGQlV5eEpRVUY2UWpzN1FVRkZRU3haUVVGSkxFdEJRVXNzVDBGQlRDeERRVUZoTEV0QlFXSXNRMEZCYlVJc1NVRkJia0lzVFVGQk5rSXNTVUZCYWtNc1JVRkJkVU03UVVGRGNrTXNZMEZCU1N4RFFVRkRMRkZCUVZFc1UwRkJVaXhEUVVGclFpeFJRVUZzUWl4MVFrRkJLME1zUzBGQlN5eFRRVUZ3UkN4RFFVRk1MRVZCUVhWRk8wRkJRM0pGTEc5Q1FVRlJMRk5CUVZJc1EwRkJhMElzUjBGQmJFSXNkVUpCUVRCRExFdEJRVXNzVTBGQkwwTTdRVUZEUkRzN1FVRkZSQ3hsUVVGTExGZEJRVXdzUjBGQmJVSXNTMEZCYmtJN08wRkJSVUU3UVVGRFFTeGxRVUZMTEU5QlFVd3NSMEZCWlN4TFFVRm1PMEZCUTBFc1pVRkJTeXhKUVVGTU8wRkJRMEU3UVVGRFFTeGxRVUZMTEdOQlFVdzdRVUZEUkN4VFFWcEVMRTFCV1U4N1FVRkRUQ3hqUVVGSkxGRkJRVkVzVTBGQlVpeERRVUZyUWl4UlFVRnNRaXgxUWtGQkswTXNTMEZCU3l4VFFVRndSQ3hEUVVGS0xFVkJRWE5GTzBGQlEzQkZMRzlDUVVGUkxGTkJRVklzUTBGQmEwSXNUVUZCYkVJc2RVSkJRVFpETEV0QlFVc3NVMEZCYkVRN1FVRkRSRHM3UVVGRlJDeGxRVUZMTEVsQlFVdzdRVUZEUVN4bFFVRkxMRmRCUVV3c1IwRkJiVUlzU1VGQmJrSTdRVUZEUVN4bFFVRkxMRTlCUVV3c1IwRkJaU3hKUVVGbU8wRkJRMFE3UVVGRFJqdEJRV2hJYjBJN1FVRkJRVHRCUVVGQkxIRkRRV3RJVGl4TFFXeElUU3hGUVd0SVF6dEJRVU53UWl4WlFVRkpMRTFCUVUwc1NVRkJUaXhMUVVGbExFOUJRV1lzU1VGQk1FSXNUVUZCVFN4UFFVRk9MRXRCUVd0Q0xFVkJRVFZETEVsQlFXdEVMRTFCUVUwc1QwRkJUaXhMUVVGclFpeEZRVUY0UlN4RlFVRTBSVHRCUVVNeFJUdEJRVU5FT3p0QlFVVkVPMEZCUTBFc1lVRkJTeXhKUVVGTU8wRkJRMFE3UVVGNlNHOUNPMEZCUVVFN1FVRkJRU3cyUWtFeVNHUTdRVUZCUVRzN1FVRkRUQ3haUVVGSkxFdEJRVXNzVDBGQlRDeERRVUZoTEU5QlFXSXNRMEZCY1VJc1UwRkJja0lzUTBGQkswSXNVVUZCTDBJc1EwRkJkME1zVFVGQmVFTXNRMEZCU2l4RlFVRnhSRHRCUVVOdVJDeHBRa0ZCVHl4TFFVRlFPMEZCUTBRN08wRkJSVVE3UVVGRFFTeHRRa0ZCVnl4WlFVRk5PMEZCUTJZc2FVSkJRVXNzV1VGQlRDeERRVUZyUWl4cFFrRkJUU3hKUVVGNFFqczdRVUZGUVN4alFVRk5MRlZCUVZVc1UwRkJWaXhQUVVGVkxFZEJRVTA3UVVGRGNFSXNiVUpCUVVzc1dVRkJUQ3hEUVVGclFpeHBRa0ZCVFN4TFFVRjRRanM3UVVGRlFTeG5Ra0ZCU1N4UFFVRkxMRTlCUVZRc1JVRkJhMEk3UVVGRGFFSXNjVUpCUVVzc1QwRkJUQ3hEUVVGaExFOUJRV0lzUTBGQmNVSXNiVUpCUVhKQ0xFTkJRWGxETEdsQ1FVRk5MR05CUVM5RExFVkJRU3RFTEU5QlFTOUVPMEZCUTBFc2NVSkJRVXNzVDBGQlRDeERRVUZoTEU5QlFXSXNRMEZCY1VJc1UwRkJja0lzUTBGQkswSXNUVUZCTDBJc1EwRkJjME1zVTBGQmRFTTdRVUZEUkR0QlFVTkdMRmRCVUVRN08wRkJVMEVzWTBGQlNTeFBRVUZMTEZkQlFWUXNSVUZCYzBJN1FVRkRjRUlzYlVKQlFVc3NZMEZCVER0QlFVTkVPenRCUVVkRUxHTkJRVWtzVDBGQlN5eFBRVUZVTEVWQlFXdENPMEZCUTJoQ0xHMUNRVUZMTEU5QlFVd3NRMEZCWVN4UFFVRmlMRU5CUVhGQ0xHZENRVUZ5UWl4RFFVRnpReXhwUWtGQlRTeGpRVUUxUXl4RlFVRTBSQ3hQUVVFMVJEdEJRVU5CTEcxQ1FVRkxMRTlCUVV3c1EwRkJZU3hQUVVGaUxFTkJRWEZDTEZOQlFYSkNMRU5CUVN0Q0xFZEJRUzlDTEVOQlFXMURMRk5CUVc1RE8wRkJRMFFzVjBGSVJDeE5RVWRQTzBGQlEwdzdRVUZEUVR0QlFVTkVPenRCUVVWRUxHbENRVUZMTEU5QlFVd3NRMEZCWVN4UFFVRmlMRU5CUVhGQ0xGTkJRWEpDTEVOQlFTdENMRWRCUVM5Q0xFTkJRVzFETEUxQlFXNURPenRCUVVWQk8wRkJRMEVzYVVKQlFVc3NXVUZCVER0QlFVTkVMRk5CTjBKRUxFVkJOa0pITEVOQk4wSklPenRCUVN0Q1FTeGxRVUZQTEVsQlFWQTdRVUZEUkR0QlFXcExiMEk3UVVGQlFUdEJRVUZCTERaQ1FXMUxaRHRCUVVGQk96dEJRVU5NTEZsQlFVa3NRMEZCUXl4TFFVRkxMRTlCUVV3c1EwRkJZU3hQUVVGaUxFTkJRWEZDTEZOQlFYSkNMRU5CUVN0Q0xGRkJRUzlDTEVOQlFYZERMRTFCUVhoRExFTkJRVXdzUlVGQmMwUTdRVUZEY0VRc2FVSkJRVThzUzBGQlVEdEJRVU5FT3p0QlFVVkVMR0ZCUVVzc1dVRkJUQ3hEUVVGclFpeHBRa0ZCVFN4SlFVRjRRanM3UVVGRlFTeGhRVUZMTEZsQlFVdzdPMEZCUlVFc1dVRkJTU3hMUVVGTExFOUJRVlFzUlVGQmEwSTdRVUZEYUVJc1pVRkJTeXhQUVVGTUxFTkJRV0VzVDBGQllpeERRVUZ4UWl4VFFVRnlRaXhEUVVFclFpeEhRVUV2UWl4RFFVRnRReXhUUVVGdVF6dEJRVU5FT3p0QlFVVkVMR0ZCUVVzc1QwRkJUQ3hEUVVGaExFOUJRV0lzUTBGQmNVSXNVMEZCY2tJc1EwRkJLMElzVFVGQkwwSXNRMEZCYzBNc1RVRkJkRU03TzBGQlJVRXNXVUZCU1N4TFFVRkxMRmRCUVZRc1JVRkJjMEk3UVVGRGNFSXNZMEZCVFN4WFFVRlhMRXRCUVVzc1YwRkJUQ3hGUVVGcVFqczdRVUZGUVN4alFVRk5MRmRCUVZjc1UwRkJXQ3hSUVVGWExFZEJRVTA3UVVGRGNrSXNaMEpCUVVrc1QwRkJTeXhQUVVGVUxFVkJRV3RDTzBGQlEyaENMSEZDUVVGTExFOUJRVXdzUTBGQllTeFBRVUZpTEVOQlFYRkNMRk5CUVhKQ0xFTkJRU3RDTEUxQlFTOUNMRU5CUVhORExGTkJRWFJETzBGQlEwUTdPMEZCUlVRc2NVSkJRVk1zYlVKQlFWUXNRMEZCTmtJc2FVSkJRVTBzWTBGQmJrTXNSVUZCYlVRc1VVRkJia1E3UVVGRFFTeHRRa0ZCU3l4WlFVRk1MRU5CUVd0Q0xHbENRVUZOTEUxQlFYaENPMEZCUTBFc2JVSkJRVXNzWTBGQlREdEJRVU5FTEZkQlVrUTdPMEZCVlVFc2JVSkJRVk1zWjBKQlFWUXNRMEZCTUVJc2FVSkJRVTBzWTBGQmFFTXNSVUZCWjBRc1VVRkJhRVE3UVVGRFFTeHRRa0ZCVXl4VFFVRlVMRU5CUVcxQ0xFZEJRVzVDTEVOQlFYVkNMRk5CUVhaQ08wRkJRMFE3TzBGQlJVUXNaVUZCVHl4SlFVRlFPMEZCUTBRN1FVRndUVzlDTzBGQlFVRTdRVUZCUVN4MVEwRnpUVW83UVVGRFppeFpRVUZOTEZkQlFWY3NVMEZCVXl4aFFVRlVMRU5CUVhWQ0xFdEJRWFpDTEVOQlFXcENPMEZCUTBFc2FVSkJRVk1zV1VGQlZDeERRVUZ6UWl4VFFVRjBRaXhGUVVGcFF5eExRVUZMTEVWQlFYUkRPMEZCUTBFc2FVSkJRVk1zVTBGQlZDeERRVUZ0UWl4SFFVRnVRaXhEUVVGMVFpeHBRa0ZCZGtJN08wRkJSVUVzYVVKQlFWTXNTVUZCVkN4RFFVRmpMRmRCUVdRc1EwRkJNRUlzVVVGQk1VSTdRVUZEUkR0QlFUVk5iMEk3UVVGQlFUdEJRVUZCTEc5RFFUaE5VRHRCUVVOYUxHVkJRVThzVTBGQlV5eGhRVUZVTEU5QlFUSkNMR2xDUVVFelFpeHJRa0ZCZVVRc1MwRkJTeXhGUVVFNVJDeFJRVUZRTzBGQlEwUTdRVUZvVG05Q08wRkJRVUU3UVVGQlFTeDFRMEZyVGtvN1FVRkRaaXhaUVVGTkxGZEJRVmNzUzBGQlN5eFhRVUZNTEVWQlFXcENPMEZCUTBFc1dVRkJTU3hSUVVGS0xFVkJRV003UVVGRFdpeHRRa0ZCVXl4SlFVRlVMRU5CUVdNc1YwRkJaQ3hEUVVFd1FpeFJRVUV4UWp0QlFVTkVPMEZCUTBZN1FVRjJUbTlDTzBGQlFVRTdRVUZCUVN4eFEwRjVUazQ3UVVGQlFUczdRVUZEWWl4WlFVRk5MR2xDUVVGcFFpeExRVUZMTEU5QlFVd3NRMEZCWVN4UFFVRmlMRU5CUVhGQ0xHZENRVUZ5UWl4RFFVRnpReXhuUWtGQmRFTXNRMEZCZGtJN08wRkJSVUVzV1VGQlNTeGpRVUZLTEVWQlFXOUNPMEZCUTJ4Q0xHZENRVUZOTEVsQlFVNHNRMEZCVnl4alFVRllMRVZCUVRKQ0xFOUJRVE5DTEVOQlFXMURPMEZCUVVFc2JVSkJRVlVzVDBGQlN5eGxRVUZNTEVOQlFYRkNMRVZCUVVVc1VVRkJVU3hOUVVGV0xFVkJRV3RDTEU5QlFVOHNUMEZCZWtJc1JVRkJja0lzUTBGQlZqdEJRVUZCTEZkQlFXNURPMEZCUTBRN08wRkJSVVFzV1VGQlNTeExRVUZMTEZkQlFWUXNSVUZCYzBJN1FVRkRjRUlzWTBGQlRTeFhRVUZYTEV0QlFVc3NWMEZCVEN4RlFVRnFRanRCUVVOQkxHVkJRVXNzWlVGQlRDeERRVUZ4UWl4RlFVRkZMRkZCUVZFc1VVRkJWaXhGUVVGdlFpeFBRVUZQTEdsQ1FVRk5MRXRCUVdwRExFVkJRWEpDTzBGQlEwUTdPMEZCUlVRc1lVRkJTeXhsUVVGTUxFTkJRWEZDTEVWQlFVVXNVVUZCVVN4UlFVRldMRVZCUVc5Q0xFOUJRVThzVDBGQk0wSXNSVUZCY2tJN1FVRkRSRHRCUVhSUGIwSTdRVUZCUVR0QlFVRkJMSEZEUVhkUFRqdEJRVUZCT3p0QlFVTmlMRmxCUVUwc2FVSkJRV2xDTEV0QlFVc3NUMEZCVEN4RFFVRmhMRTlCUVdJc1EwRkJjVUlzWjBKQlFYSkNMRU5CUVhORExHZENRVUYwUXl4RFFVRjJRanM3UVVGRlFTeFpRVUZKTEdOQlFVb3NSVUZCYjBJN1FVRkRiRUlzWjBKQlFVMHNTVUZCVGl4RFFVRlhMR05CUVZnc1JVRkJNa0lzVDBGQk0wSXNRMEZCYlVNN1FVRkJRU3h0UWtGQlZTeFBRVUZMTEdsQ1FVRk1MRU5CUVhWQ0xFVkJRVVVzVVVGQlVTeE5RVUZXTEVWQlFXdENMRTlCUVU4c1QwRkJla0lzUlVGQmRrSXNRMEZCVmp0QlFVRkJMRmRCUVc1RE8wRkJRMFE3TzBGQlJVUXNXVUZCU1N4TFFVRkxMRmRCUVZRc1JVRkJjMEk3UVVGRGNFSXNZMEZCVFN4WFFVRlhMRXRCUVVzc1YwRkJUQ3hGUVVGcVFqdEJRVU5CTEdWQlFVc3NhVUpCUVV3c1EwRkJkVUlzUlVGQlJTeFJRVUZSTEZGQlFWWXNSVUZCYjBJc1QwRkJUeXhwUWtGQlRTeExRVUZxUXl4RlFVRjJRanRCUVVORU96dEJRVVZFTEdGQlFVc3NhVUpCUVV3c1EwRkJkVUlzUlVGQlJTeFJRVUZSTEZGQlFWWXNSVUZCYjBJc1QwRkJUeXhQUVVFelFpeEZRVUYyUWp0QlFVTkVPMEZCY2xCdlFqdEJRVUZCTzBGQlFVRXNiVU5CZFZCRU8wRkJRMnhDTEdWQlFVOHNTVUZCVUR0QlFVTkVPMEZCZWxCdlFqdEJRVUZCTzBGQlFVRXNiME5CTWxCQkxFOUJNMUJCTEVWQk1sQlRPMEZCUXpWQ0xDdEhRVUV5UWl4VFFVRXpRaXhGUVVGelF5eFBRVUYwUXp0QlFVTkVPMEZCTjFCdlFqczdRVUZCUVR0QlFVRkJPenRCUVdkUmRrSTdPenM3T3pzN1FVRkxRU3hOUVVGTkxHRkJRV0VzUlVGQmJrSTdPMEZCUlVFc1RVRkJUU3haUVVGWkxGTkJRVk1zWjBKQlFWUXNUMEZCT0VJc1NVRkJPVUlzUTBGQmJFSTdRVUZEUVN4TlFVRkpMRk5CUVVvc1JVRkJaVHRCUVVOaUxGVkJRVTBzU1VGQlRpeERRVUZYTEZOQlFWZ3NSVUZCYzBJc1QwRkJkRUlzUTBGQk9FSXNWVUZCUXl4UFFVRkVMRVZCUVdFN1FVRkRla01zVlVGQlRTeFRRVUZUTERKRFFVRnZRaXhQUVVGd1FpeEZRVUUyUWl4clFrRkJOMElzUlVGQmFVUXNjVUpCUVdwRUxFTkJRV1k3UVVGRFFTeGhRVUZQTEU5QlFWQXNSMEZCYVVJc1QwRkJha0k3TzBGQlJVRXNhVUpCUVZjc1NVRkJXQ3hEUVVGblFpeEZRVUZGTEdkQ1FVRkdMRVZCUVZjc1YwRkJWeXhKUVVGSkxGTkJRVW9zUTBGQll5eE5RVUZrTEVOQlFYUkNMRVZCUVdoQ08wRkJRMFFzUzBGTVJEdEJRVTFFT3p0QlFVVkVMRTFCUVVrc1UwRkJTaXhGUVVGbE8wRkJRMklzWVVGQlV5eG5Ra0ZCVkN4RFFVRXdRaXhQUVVFeFFpeEZRVUZ0UXl4VlFVRkRMRXRCUVVRc1JVRkJWenRCUVVNMVF5eFZRVUZOTEZOQlFWTXNOa0pCUVdsQ0xFMUJRVTBzVFVGQmRrSXNSVUZCSzBJc1lVRkJMMElzUTBGQlpqdEJRVU5CTEZWQlFVa3NRMEZCUXl4TlFVRk1MRVZCUVdFN1FVRkRXRHRCUVVORU96dEJRVVZFTEZWQlFVMHNhVUpCUVdsQ0xFOUJRVThzV1VGQlVDeERRVUZ2UWl4aFFVRndRaXhEUVVGMlFqdEJRVU5CTEZWQlFVa3NhMEpCUVd0Q0xHMUNRVUZ0UWl4SlFVRjZReXhGUVVFclF6dEJRVU0zUXl4WlFVRk5MRXRCUVVzc1QwRkJUeXhaUVVGUUxFTkJRVzlDTEdGQlFYQkNMRU5CUVZnN1FVRkRRU3haUVVGTkxGVkJRVlVzVTBGQlV5eGhRVUZVTEVOQlFYVkNMRVZCUVhaQ0xFTkJRV2hDT3p0QlFVVkJMRmxCUVUwc1dVRkJXU3hYUVVGWExFbEJRVmdzUTBGQlowSTdRVUZCUVN4cFFrRkJTeXhGUVVGRkxFOUJRVVlzUzBGQll5eFBRVUZ1UWp0QlFVRkJMRk5CUVdoQ0xFTkJRV3hDT3p0QlFVVkJMRmxCUVVrc1EwRkJReXhUUVVGTUxFVkJRV2RDTzBGQlEyUTdRVUZEUkRzN1FVRkZSQ3hsUVVGUExFbEJRVkE3TzBGQlJVRXNhMEpCUVZVc1UwRkJWaXhEUVVGdlFpeEpRVUZ3UWp0QlFVTkVPMEZCUTBZc1MwRnlRa1E3UVVGelFrUTdPMEZCUlVRc1UwRkJUeXhUUVVGUU8wRkJRMFFzUTBFelUybENMRVZCUVd4Q096dHJRa0UyVTJVc1V6czdPenM3T3pzN096czdPenRCUTJ4VVpqczdPenRCUVVOQk96czdPenM3T3pzN095dGxRVTVCT3pzN096czdPMEZCVVVFc1NVRkJUU3hYUVVGWkxGbEJRVTA3UVVGRGRFSTdPenM3T3p0QlFVMUJMRTFCUVUwc1QwRkJUeXhWUVVGaU8wRkJRMEVzVFVGQlRTeFZRVUZWTEU5QlFXaENPMEZCUTBFc1RVRkJUU3h4UWtGQmNVSTdRVUZEZWtJc1lVRkJVeXhKUVVSblFqdEJRVVY2UWl4WlFVRlJMRU5CUm1sQ08wRkJSM3BDTEZOQlFVc3NRMEZJYjBJN1FVRkpla0lzVTBGQlN5eEhRVXB2UWp0QlFVdDZRaXhYUVVGUExFdEJUR3RDTzBGQlRYcENMR0ZCUVZNc1MwRk9aMEk3UVVGUGVrSXNaMEpCUVZrN1FVRlFZU3hIUVVFelFqdEJRVk5CTEUxQlFVMHNkMEpCUVhkQ0xFTkJRelZDTEZGQlJEUkNMRVZCUlRWQ0xFdEJSalJDTEVWQlJ6VkNMRXRCU0RSQ0xFVkJTVFZDTEU5QlNqUkNMRVZCU3pWQ0xGTkJURFJDTEVWQlRUVkNMRmxCVGpSQ0xFTkJRVGxDT3p0QlFWTkJPenM3T3pzN1FVRXpRbk5DTEUxQmFVTm9RaXhSUVdwRFowSTdRVUZCUVRzN1FVRnRRM0JDTEhkQ1FVRXdRanRCUVVGQkxGVkJRV1FzVDBGQll5eDFSVUZCU2l4RlFVRkpPenRCUVVGQk96dEJRVWQ0UWp0QlFVaDNRaXh6U0VGRGJFSXNTVUZFYTBJc1JVRkRXaXhQUVVSWkxFVkJRMGdzYTBKQlJFY3NSVUZEYVVJc1QwRkVha0lzUlVGRE1FSXNjVUpCUkRGQ0xFVkJRMmxFTEV0QlJHcEVMRVZCUTNkRUxFdEJSSGhFT3p0QlFVbDRRaXhaUVVGTExFOUJRVXdzUTBGQllTeFBRVUZpTEVOQlFYRkNMRXRCUVhKQ0xFTkJRVEpDTEUxQlFUTkNMRWRCUVhWRExFMUJRVXNzVDBGQlRDeERRVUZoTEUxQlFYQkVPenRCUVVWQk8wRkJRMEVzVlVGQlRTeGpRVUZqTEUxQlFVc3NZMEZCVEN4RlFVRndRanRCUVVOQkxHdENRVUZaTEZsQlFWb3NRMEZCZVVJc1pVRkJla0lzVDBGQk5rTXNUVUZCU3l4UFFVRk1MRU5CUVdFc1IwRkJNVVE3UVVGRFFTeHJRa0ZCV1N4WlFVRmFMRU5CUVhsQ0xHVkJRWHBDTEU5QlFUWkRMRTFCUVVzc1QwRkJUQ3hEUVVGaExFZEJRVEZFT3p0QlFVVkJPMEZCUTBFc1ZVRkJTU3hOUVVGTExFOUJRVXdzUTBGQllTeFBRVUZpTEVsQlEwTXNRMEZCUXl4WlFVRlpMRk5CUVZvc1EwRkJjMElzVVVGQmRFSXNRMEZCSzBJc2MwSkJRUzlDTEVOQlJFNHNSVUZET0VRN1FVRkROVVFzYjBKQlFWa3NVMEZCV2l4RFFVRnpRaXhIUVVGMFFpeERRVUV3UWl4elFrRkJNVUk3UVVGRFJEczdRVUZGUkR0QlFVTkJMRlZCUVVrc1QwRkJUeXhOUVVGTExFOUJRVXdzUTBGQllTeFZRVUZ3UWl4TFFVRnRReXhSUVVGdVF5eEpRVU5ETEVOQlFVTXNXVUZCV1N4VFFVRmFMRU5CUVhOQ0xGRkJRWFJDTEZOQlFYRkRMRTFCUVVzc1QwRkJUQ3hEUVVGaExGVkJRV3hFTEVOQlJFNHNSVUZEZFVVN1FVRkRja1VzYjBKQlFWa3NVMEZCV2l4RFFVRnpRaXhIUVVGMFFpeFRRVUZuUXl4TlFVRkxMRTlCUVV3c1EwRkJZU3hWUVVFM1F6dEJRVU5FTzBGQmNrSjFRanRCUVhOQ2VrSTdPMEZCZWtSdFFqdEJRVUZCTzBGQlFVRXNkVU5CTWtSSU8wRkJRMllzWlVGQlR5eExRVUZMTEU5QlFVd3NRMEZCWVN4UFFVRmlMRU5CUVhGQ0xHRkJRWEpDTEVOQlFXMURMR1ZCUVc1RExFTkJRVkE3UVVGRFJEdEJRVGRFYlVJN1FVRkJRVHRCUVVGQkxEUkNRU3RFVER0QlFVRkJMRmxCUVZnc1MwRkJWeXgxUlVGQlNDeERRVUZIT3p0QlFVTmlMRmxCUVUwc1kwRkJZeXhMUVVGTExHTkJRVXdzUlVGQmNFSTdRVUZEUVN4WlFVRk5MRmRCUVZjc1MwRkJTeXhMUVVGTUxFTkJRVmtzVTBGQlV5eExRVUZMTEU5QlFVd3NRMEZCWVN4SFFVRmlMRWRCUVcxQ0xFdEJRVXNzVDBGQlRDeERRVUZoTEVkQlFYcERMRU5CUVVRc1IwRkJhMFFzUjBGQk4wUXNRMEZCYWtJN08wRkJSVUVzV1VGQlNTeFJRVUZSTEV0QlFVc3NUMEZCVEN4RFFVRmhMRWRCUVhwQ0xFVkJRVGhDTzBGQlF6VkNMR3RDUVVGUkxFdEJRVklzUTBGQmFVSXNTVUZCYWtJc2JVSkJRVzFETEV0QlFXNURPMEZCUTBFc2FVSkJRVThzUzBGQlVEdEJRVU5FT3p0QlFVVkVMRmxCUVVrc1VVRkJVU3hMUVVGTExFOUJRVXdzUTBGQllTeEhRVUY2UWl4RlFVRTRRanRCUVVNMVFpeHJRa0ZCVVN4TFFVRlNMRU5CUVdsQ0xFbEJRV3BDTEcxQ1FVRnRReXhMUVVGdVF6dEJRVU5CTEdsQ1FVRlBMRXRCUVZBN1FVRkRSRHM3UVVGRlJDeHZRa0ZCV1N4WlFVRmFMRU5CUVhsQ0xHVkJRWHBDTEU5QlFUWkRMRXRCUVRkRE96dEJRVVZCTzBGQlEwRXNXVUZCU1N4TFFVRkxMRTlCUVV3c1EwRkJZU3hMUVVGcVFpeEZRVUYzUWp0QlFVTjBRaXh6UWtGQldTeFRRVUZhTEVkQlFUSkNMRkZCUVROQ08wRkJRMFE3TzBGQlJVUTdRVUZEUVN4dlFrRkJXU3hMUVVGYUxFTkJRV3RDTEV0QlFXeENMRWRCUVRaQ0xGRkJRVGRDT3p0QlFVVkJMR1ZCUVU4c1NVRkJVRHRCUVVORU8wRkJlRVp0UWp0QlFVRkJPMEZCUVVFc1owTkJNRVpYTzBGQlFVRXNXVUZCZGtJc1kwRkJkVUlzZFVWQlFVNHNTVUZCVFRzN1FVRkROMElzV1VGQlNTeERRVUZETEV0QlFVc3NUMEZCVEN4RFFVRmhMRTlCUVd4Q0xFVkJRVEpDTzBGQlEzcENMR3RDUVVGUkxFdEJRVklzUTBGQmFVSXNTVUZCYWtJN1FVRkRRU3hwUWtGQlR5eExRVUZRTzBGQlEwUTdPMEZCUlVRc1dVRkJUU3hqUVVGakxFdEJRVXNzWTBGQlRDeEZRVUZ3UWpzN1FVRkZRU3haUVVGSkxHdENRVU5ETEVOQlFVTXNXVUZCV1N4VFFVRmFMRU5CUVhOQ0xGRkJRWFJDTEVOQlFTdENMSFZDUVVFdlFpeERRVVJPTEVWQlF5dEVPMEZCUXpkRUxITkNRVUZaTEZOQlFWb3NRMEZCYzBJc1IwRkJkRUlzUTBGQk1FSXNkVUpCUVRGQ08wRkJRMFE3TzBGQlJVUXNXVUZCU1N4RFFVRkRMR05CUVVRc1NVRkRReXhaUVVGWkxGTkJRVm9zUTBGQmMwSXNVVUZCZEVJc1EwRkJLMElzZFVKQlFTOUNMRU5CUkV3c1JVRkRPRVE3UVVGRE5VUXNjMEpCUVZrc1UwRkJXaXhEUVVGelFpeE5RVUYwUWl4RFFVRTJRaXgxUWtGQk4wSTdRVUZEUkRzN1FVRkZSQ3hsUVVGUExFbEJRVkE3UVVGRFJEdEJRVGRIYlVJN1FVRkJRVHRCUVVGQkxEWkNRU3RIWWp0QlFVTk1MR0ZCUVVzc1QwRkJUQ3hEUVVGaExFOUJRV0lzUTBGQmNVSXNTMEZCY2tJc1EwRkJNa0lzVFVGQk0wSXNSMEZCZFVNc1MwRkJTeXhQUVVGTUxFTkJRV0VzVFVGQmNFUTdRVUZEUVN4aFFVRkxMRmxCUVV3c1EwRkJhMElzYVVKQlFVMHNTVUZCZUVJN1FVRkRRU3hoUVVGTExGbEJRVXdzUTBGQmEwSXNhVUpCUVUwc1MwRkJlRUk3TzBGQlJVRXNaVUZCVHl4SlFVRlFPMEZCUTBRN1FVRnlTRzFDTzBGQlFVRTdRVUZCUVN3MlFrRjFTR0k3UVVGRFRDeGhRVUZMTEU5QlFVd3NRMEZCWVN4UFFVRmlMRU5CUVhGQ0xFdEJRWEpDTEVOQlFUSkNMRTFCUVROQ0xFZEJRVzlETEV0QlFYQkRPMEZCUTBFc1lVRkJTeXhaUVVGTUxFTkJRV3RDTEdsQ1FVRk5MRWxCUVhoQ08wRkJRMEVzWVVGQlN5eFpRVUZNTEVOQlFXdENMR2xDUVVGTkxFMUJRWGhDT3p0QlFVVkJMR1ZCUVU4c1NVRkJVRHRCUVVORU8wRkJOMGh0UWp0QlFVRkJPMEZCUVVFc2JVTkJLMGhCTzBGQlEyeENMR1ZCUVU4c1NVRkJVRHRCUVVORU8wRkJha2x0UWp0QlFVRkJPMEZCUVVFc2IwTkJiVWxETEU5QmJrbEVMRVZCYlVsVk8wRkJRelZDTERaSFFVRXlRaXhSUVVFelFpeEZRVUZ4UXl4UFFVRnlRenRCUVVORU8wRkJja2x0UWpzN1FVRkJRVHRCUVVGQk96dEJRWGRKZEVJc1UwRkJUeXhSUVVGUU8wRkJRMFFzUTBGNlNXZENMRVZCUVdwQ096dHJRa0V5U1dVc1VUczdPenM3T3pzN096czdPenRCUXpsSlpqczdPenRCUVVOQk96dEJRVU5CT3pzN08wRkJRMEU3T3pzN096czdPeXRsUVZKQk96czdPenM3TzBGQlZVRXNTVUZCVFN4TlFVRlBMRmxCUVUwN1FVRkRha0k3T3pzN096dEJRVTFCTEUxQlFVMHNUMEZCVHl4TFFVRmlPMEZCUTBFc1RVRkJUU3hWUVVGVkxFOUJRV2hDTzBGQlEwRXNUVUZCVFN4eFFrRkJjVUlzUlVGQk0wSTdRVUZIUVN4TlFVRk5MSGRDUVVGM1FpeEZRVUU1UWp0QlFVVkJMRTFCUVUwc2RVSkJRWFZDTEZkQlFUZENPenRCUVVWQk96czdPenM3UVVGb1FtbENMRTFCYzBKWUxFZEJkRUpYTzBGQlFVRTdPMEZCZDBKbUxHMUNRVUV3UWp0QlFVRkJMRlZCUVdRc1QwRkJZeXgxUlVGQlNpeEZRVUZKT3p0QlFVRkJPenRCUVVGQkxIVkhRVU5zUWl4SlFVUnJRaXhGUVVOYUxFOUJSRmtzUlVGRFNDeHJRa0ZFUnl4RlFVTnBRaXhQUVVScVFpeEZRVU13UWl4eFFrRkVNVUlzUlVGRGFVUXNTMEZFYWtRc1JVRkRkMFFzUzBGRWVFUTdRVUZGZWtJN08wRkJNVUpqTzBGQlFVRTdRVUZCUVN3MlFrRTBRbEk3UVVGRFRDeFpRVUZKTEV0QlFVc3NUMEZCVEN4RFFVRmhMRTlCUVdJc1EwRkJjVUlzVTBGQmNrSXNRMEZCSzBJc1VVRkJMMElzUTBGQmQwTXNVVUZCZUVNc1EwRkJTaXhGUVVGMVJEdEJRVU55UkN4cFFrRkJUeXhMUVVGUU8wRkJRMFE3TzBGQlJVUXNXVUZCVFN4TFFVRkxMRXRCUVVzc1QwRkJUQ3hEUVVGaExFOUJRV0lzUTBGQmNVSXNXVUZCY2tJc1EwRkJhME1zVFVGQmJFTXNRMEZCV0R0QlFVTkJMRmxCUVUwc1RVRkJUU3c0UWtGQmEwSXNTMEZCU3l4UFFVRk1MRU5CUVdFc1QwRkJMMElzUlVGQmQwTXNTMEZCZUVNc1EwRkJXanRCUVVOQkxGbEJRVTBzVlVGQlZTeE5RVUZOTEVsQlFVa3NaMEpCUVVvc2IwSkJRWE5ETEVsQlFYUkRMRkZCUVU0c1IwRkJkMFFzU1VGQmVFVTdPMEZCUlVFc1dVRkJTU3hQUVVGS0xFVkJRV0U3UVVGRFdDeG5Ra0ZCVFN4SlFVRk9MRU5CUVZjc1QwRkJXQ3hGUVVGdlFpeFBRVUZ3UWl4RFFVRTBRaXhWUVVGRExFZEJRVVFzUlVGQlV6dEJRVU51UXl4blFrRkJTU3hKUVVGSkxGTkJRVW9zUTBGQll5eFJRVUZrTEVOQlFYVkNMRkZCUVhaQ0xFTkJRVW9zUlVGQmMwTTdRVUZEY0VNc2EwSkJRVWtzVTBGQlNpeERRVUZqTEUxQlFXUXNRMEZCY1VJc1VVRkJja0k3UVVGRFJEdEJRVU5FTEdkQ1FVRkpMRmxCUVVvc1EwRkJhVUlzWlVGQmFrSXNSVUZCYTBNc1MwRkJiRU03UVVGRFJDeFhRVXhFTzBGQlRVUTdPMEZCUlVRc1lVRkJTeXhQUVVGTUxFTkJRV0VzVDBGQllpeERRVUZ4UWl4VFFVRnlRaXhEUVVFclFpeEhRVUV2UWl4RFFVRnRReXhSUVVGdVF6dEJRVU5CTEdGQlFVc3NUMEZCVEN4RFFVRmhMRTlCUVdJc1EwRkJjVUlzV1VGQmNrSXNRMEZCYTBNc1pVRkJiRU1zUlVGQmJVUXNTVUZCYmtRN08wRkJSVUVzV1VGQlRTeGhRVUZoTEZOQlFWTXNZVUZCVkN4RFFVRjFRaXhGUVVGMlFpeERRVUZ1UWp0QlFVTkJMRmxCUVUwc1kwRkJZeXhYUVVGWExGVkJRVmdzUTBGQmMwSXNaMEpCUVhSQ0xFTkJRWFZETEc5Q1FVRjJReXhEUVVGd1FqczdRVUZGUVN4WlFVRkpMRmRCUVVvc1JVRkJhVUk3UVVGRFppeG5Ra0ZCVFN4SlFVRk9MRU5CUVZjc1YwRkJXQ3hGUVVGM1FpeFBRVUY0UWl4RFFVRm5ReXhWUVVGRExFZEJRVVFzUlVGQlV6dEJRVU4yUXl4blFrRkJTU3hKUVVGSkxGTkJRVW9zUTBGQll5eFJRVUZrTEVOQlFYVkNMRkZCUVhaQ0xFTkJRVW9zUlVGQmMwTTdRVUZEY0VNc2EwSkJRVWtzVTBGQlNpeERRVUZqTEUxQlFXUXNRMEZCY1VJc1VVRkJja0k3UVVGRFJEdEJRVU5HTEZkQlNrUTdRVUZMUkRzN1FVRkZSQ3h0UWtGQlZ5eFRRVUZZTEVOQlFYRkNMRWRCUVhKQ0xFTkJRWGxDTEZOQlFYcENPenRCUVVWQkxHMUNRVUZYTEZsQlFVMDdRVUZEWml4alFVRk5MRmRCUVZjc1UwRkJXQ3hSUVVGWExFZEJRVTA3UVVGRGNrSXNkVUpCUVZjc1UwRkJXQ3hEUVVGeFFpeE5RVUZ5UWl4RFFVRTBRaXhUUVVFMVFqdEJRVU5CTEhWQ1FVRlhMRk5CUVZnc1EwRkJjVUlzUjBGQmNrSXNRMEZCZVVJc1VVRkJla0k3UVVGRFFTeDFRa0ZCVnl4VFFVRllMRU5CUVhGQ0xFMUJRWEpDTEVOQlFUUkNMRk5CUVRWQ08wRkJRMEVzZFVKQlFWY3NiVUpCUVZnc1EwRkJLMElzYVVKQlFVMHNZMEZCY2tNc1JVRkJjVVFzVVVGQmNrUTdRVUZEUkN4WFFVeEVPenRCUVU5QkxIRkNRVUZYTEdkQ1FVRllMRU5CUVRSQ0xHbENRVUZOTEdOQlFXeERMRVZCUVd0RUxGRkJRV3hFT3p0QlFVVkJMSEZDUVVGWExGTkJRVmdzUTBGQmNVSXNSMEZCY2tJc1EwRkJlVUlzVTBGQmVrSTdRVUZGUkN4VFFWcEVMRVZCV1Vjc1JVRmFTRHM3UVVGalFTeGxRVUZQTEVsQlFWQTdRVUZEUkR0QlFUZEZZenRCUVVGQk8wRkJRVUVzTmtKQkswVlNPMEZCUTB3c1dVRkJTU3hEUVVGRExFdEJRVXNzVDBGQlRDeERRVUZoTEU5QlFXSXNRMEZCY1VJc1UwRkJja0lzUTBGQkswSXNVVUZCTDBJc1EwRkJkME1zVVVGQmVFTXNRMEZCVEN4RlFVRjNSRHRCUVVOMFJDeHBRa0ZCVHl4TFFVRlFPMEZCUTBRN08wRkJSVVFzV1VGQlNTeExRVUZMTEU5QlFVd3NRMEZCWVN4UFFVRmlMRU5CUVhGQ0xGTkJRWEpDTEVOQlFTdENMRkZCUVM5Q0xFTkJRWGRETEZGQlFYaERMRU5CUVVvc1JVRkJkVVE3UVVGRGNrUXNaVUZCU3l4UFFVRk1MRU5CUVdFc1QwRkJZaXhEUVVGeFFpeFRRVUZ5UWl4RFFVRXJRaXhOUVVFdlFpeERRVUZ6UXl4UlFVRjBRenRCUVVORU96dEJRVVZFTEdGQlFVc3NUMEZCVEN4RFFVRmhMRTlCUVdJc1EwRkJjVUlzV1VGQmNrSXNRMEZCYTBNc1pVRkJiRU1zUlVGQmJVUXNTMEZCYmtRN08wRkJSVUVzV1VGQlRTeExRVUZMTEV0QlFVc3NUMEZCVEN4RFFVRmhMRTlCUVdJc1EwRkJjVUlzV1VGQmNrSXNRMEZCYTBNc1RVRkJiRU1zUTBGQldEdEJRVU5CTEZsQlFVMHNZVUZCWVN4VFFVRlRMR0ZCUVZRc1EwRkJkVUlzUlVGQmRrSXNRMEZCYmtJN08wRkJSVUVzV1VGQlNTeFhRVUZYTEZOQlFWZ3NRMEZCY1VJc1VVRkJja0lzUTBGQk9FSXNVVUZCT1VJc1EwRkJTaXhGUVVFMlF6dEJRVU16UXl4eFFrRkJWeXhUUVVGWUxFTkJRWEZDTEUxQlFYSkNMRU5CUVRSQ0xGRkJRVFZDTzBGQlEwUTdPMEZCUlVRc1pVRkJUeXhKUVVGUU8wRkJRMFE3UVVGc1IyTTdRVUZCUVR0QlFVRkJMRzFEUVc5SFN6dEJRVU5zUWl4bFFVRlBMRWxCUVZBN1FVRkRSRHRCUVhSSFl6dEJRVUZCTzBGQlFVRXNiME5CZDBkTkxFOUJlRWRPTEVWQmQwZGxPMEZCUXpWQ0xHMUhRVUV5UWl4SFFVRXpRaXhGUVVGblF5eFBRVUZvUXp0QlFVTkVPMEZCTVVkak96dEJRVUZCTzBGQlFVRTdPMEZCTmtkcVFqczdPenM3T3p0QlFVdEJMRTFCUVUwc1lVRkJZU3hGUVVGdVFqczdRVUZGUVN4TlFVRk5MRTlCUVU4c1UwRkJVeXhuUWtGQlZDeHZRa0ZCTWtNc1NVRkJNME1zVVVGQllqdEJRVU5CTEUxQlFVa3NTVUZCU2l4RlFVRlZPMEZCUTFJc1ZVRkJUU3hKUVVGT0xFTkJRVmNzU1VGQldDeEZRVUZwUWl4UFFVRnFRaXhEUVVGNVFpeFZRVUZETEU5QlFVUXNSVUZCWVR0QlFVTndRenRCUVVOQkxGVkJRVTBzVTBGQlV5d3lRMEZCYjBJc1QwRkJjRUlzUlVGQk5rSXNhMEpCUVRkQ0xFVkJRV2xFTEhGQ1FVRnFSQ3hEUVVGbU8wRkJRMEVzWVVGQlR5eFBRVUZRTEVkQlFXbENMRTlCUVdwQ096dEJRVVZCTEdsQ1FVRlhMRWxCUVZnc1EwRkJaMElzU1VGQlNTeGhRVUZLTEVOQlFXdENMRTFCUVd4Q0xFTkJRV2hDTzBGQlEwUXNTMEZPUkR0QlFVOUVPenRCUVVWRUxFMUJRVWtzU1VGQlNpeEZRVUZWTzBGQlExSXNZVUZCVXl4blFrRkJWQ3hEUVVFd1FpeFBRVUV4UWl4RlFVRnRReXhWUVVGRExFdEJRVVFzUlVGQlZ6dEJRVU0xUXl4VlFVRk5MR2xDUVVGcFFpeE5RVUZOTEUxQlFVNHNRMEZCWVN4WlFVRmlMRU5CUVRCQ0xHRkJRVEZDTEVOQlFYWkNPMEZCUTBFc1ZVRkJTU3hyUWtGQmEwSXNiVUpCUVcxQ0xFbEJRWHBETEVWQlFTdERPMEZCUXpkRExGbEJRVTBzUzBGQlN5eE5RVUZOTEUxQlFVNHNRMEZCWVN4WlFVRmlMRU5CUVRCQ0xFMUJRVEZDTEVOQlFWZzdPMEZCUlVFc1dVRkJUU3haUVVGWkxGZEJRVmNzU1VGQldDeERRVUZuUWp0QlFVRkJMR2xDUVVGTExFVkJRVVVzVlVGQlJpeEhRVUZsTEZsQlFXWXNRMEZCTkVJc1RVRkJOVUlzVFVGQmQwTXNSVUZCTjBNN1FVRkJRU3hUUVVGb1FpeERRVUZzUWpzN1FVRkZRU3haUVVGSkxFTkJRVU1zVTBGQlRDeEZRVUZuUWp0QlFVTmtPMEZCUTBRN08wRkJSVVFzYTBKQlFWVXNTVUZCVmp0QlFVTkVPMEZCUTBZc1MwRmlSRHRCUVdORU96dEJRVVZFTEZOQlFVOHNSMEZCVUR0QlFVTkVMRU5CYWtwWExFVkJRVm83TzJ0Q1FXMUtaU3hIT3pzN096czdPenM3T3pzN096czdRVU0zU21ZN096czdPenRCUVUxQkxFbEJRVTBzVTBGQlZTeFpRVUZOTzBGQlEzQkNPenM3T3pzN1FVRk5RU3hOUVVGTkxFOUJRVThzWVVGQllqdEJRVU5CTEUxQlFVMHNWVUZCVlN4UFFVRm9RanM3UVVGRlFUczdPenM3TzBGQlZtOUNMRTFCWjBKa0xFMUJhRUpqTzBGQmFVSnNRaXh2UWtGQldTeFBRVUZhTEVWQlFYRkNMRWxCUVhKQ0xFVkJRVEpDTzBGQlFVRTdPMEZCUTNwQ0xGZEJRVXNzVDBGQlRDeEhRVUZsTEU5QlFXWTdRVUZEUVN4WFFVRkxMRWxCUVV3c1IwRkJXU3hKUVVGYU96dEJRVVZCTEZWQlFVa3NRMEZCUXl4TFFVRkxMRk5CUVV3c1EwRkJaU3hMUVVGTExFOUJRWEJDTEVOQlFVd3NSVUZCYlVNN1FVRkRha003UVVGRFJEczdRVUZGUkR0QlFVTkJMRlZCUVVrc1MwRkJTeXhQUVVGTUxFTkJRV0VzVFVGQllpeEpRVUYxUWl4TFFVRkxMRTlCUVV3c1EwRkJZU3hOUVVGaUxFZEJRWE5DTEVOQlFXcEVMRVZCUVc5RU8wRkJRMnhFTEdGQlFVc3NVVUZCVEN4RFFVRmpMRXRCUVVzc1QwRkJia0k3UVVGRFJDeFBRVVpFTEUxQlJVODdRVUZEVER0QlFVTkJMR0ZCUVVzc1QwRkJUQ3hEUVVGaExFdEJRVXNzVDBGQmJFSTdRVUZEUkR0QlFVTkdPenRCUVVWRU96dEJRV3hEYTBJN1FVRkJRVHM3TzBGQmQwTnNRanM3T3pzN1FVRjRRMnRDTEdkRFFUWkRVaXhQUVRkRFVTeEZRVFpEUXp0QlFVTnFRaXhaUVVGSkxGbEJRVmtzU1VGQmFFSXNSVUZCYzBJN1FVRkRjRUlzYVVKQlFVOHNTMEZCVUR0QlFVTkVPMEZCUTBRc1pVRkJVU3hSUVVGUExFbEJRVkFzZVVOQlFVOHNTVUZCVUN4UFFVRm5RaXhSUVVGb1FpeEhRVUV5UWl4dFFrRkJiVUlzU1VGQk9VTXNSMEZCY1VRc1YwRkJWeXhSUVVGUExFOUJRVkFzZVVOQlFVOHNUMEZCVUN4UFFVRnRRaXhSUVVFNVFpeEpRVUV3UXl4UFFVRlBMRkZCUVZFc1VVRkJaaXhMUVVFMFFpeFJRVUYwUlN4SlFVRnJSaXhQUVVGUExGRkJRVkVzVVVGQlppeExRVUUwUWl4UlFVRXpTenRCUVVORU96dEJRVVZFT3pzN096czdRVUZ3Ukd0Q08wRkJRVUU3UVVGQlFTdzRRa0Y1UkZZc1QwRjZSRlVzUlVGNVJFUXNTVUY2UkVNc1JVRjVSRXM3UVVGRGNrSXNXVUZCU1N4RlFVRkZMR2xDUVVGcFFpeFBRVUZ1UWl4RFFVRktMRVZCUVdsRE8wRkJReTlDTEd0Q1FVRlJMRk5CUVZJc1IwRkJiMElzU1VGQmNFSTdRVUZEUkN4VFFVWkVMRTFCUlU4N1FVRkRUQ3hyUWtGQlVTeFhRVUZTTEVkQlFYTkNMRWxCUVhSQ08wRkJRMFE3UVVGRFJqczdRVUZGUkRzN096czdPMEZCYWtWclFqdEJRVUZCTzBGQlFVRXNPRUpCYzBWV0xFOUJkRVZWTEVWQmMwVkVMRWxCZEVWRExFVkJjMFZMTzBGQlEzSkNMR2RDUVVGUkxGTkJRVklzUjBGQmIwSXNTVUZCY0VJN1FVRkRSRHM3UVVGRlJEczdPenM3T3p0QlFURkZhMEk3UVVGQlFUdEJRVUZCTEcxRFFXZEdUQ3hQUVdoR1N5eEZRV2RHU1N4SlFXaEdTaXhGUVdkR1ZTeEpRV2hHVml4RlFXZEdaMEk3UVVGRGFFTXNaMEpCUVZFc1dVRkJVaXhEUVVGeFFpeEpRVUZ5UWl4RlFVRXlRaXhKUVVFelFqdEJRVU5FTzBGQmJFWnBRanRCUVVGQk8wRkJRVUVzT0VKQmIwWldMRTlCY0VaVkxFVkJiMFpFTzBGQlEyWXNXVUZCU1N4UFFVRlBMRkZCUVZFc1dVRkJVaXhEUVVGeFFpeFhRVUZ5UWl4RFFVRllPMEZCUTBFc1dVRkJTU3hEUVVGRExFbEJRVXdzUlVGQlZ6dEJRVU5VTzBGQlEwUTdPMEZCUlVRc1pVRkJUeXhMUVVGTExFbEJRVXdzUlVGQlVEczdRVUZGUVN4WlFVRk5MRWxCUVVrc2FVUkJRVlk3UVVGRFFTeFpRVUZKTEZWQlFVbzdPMEZCUlVFc1pVRkJUeXhKUVVGSkxFVkJRVVVzU1VGQlJpeERRVUZQTEVsQlFWQXNRMEZCV0N4RlFVRjVRanRCUVVOMlFpeGpRVUZOTEUxQlFVMHNSVUZCUlN4RFFVRkdMRVZCUVVzc1NVRkJUQ3hGUVVGYU8wRkJRMEVzWTBGQlRTeFJRVUZSTEVWQlFVVXNRMEZCUml4RlFVRkxMRWxCUVV3c1IwRkJXU3hQUVVGYUxFTkJRVzlDTEVkQlFYQkNMRVZCUVhsQ0xFVkJRWHBDTEVOQlFXUTdRVUZEUVN4alFVRkpMRmxCUVZrc1MwRkJTeXhKUVVGTUxFTkJRVlVzUzBGQlZpeERRVUZvUWpzN1FVRkZRU3hqUVVGSkxFTkJRVU1zUzBGQlN5eEpRVUZNTEVOQlFWVXNTMEZCVml4RFFVRk1MRVZCUVhWQ08wRkJRM0pDTEc5Q1FVRlJMRWRCUVZJc1EwRkJaU3hKUVVGbUxHMUNRVUZwUXl4TFFVRnFRenRCUVVOQkxIZENRVUZaTEV0QlFWbzdRVUZEUkRzN1FVRkZSQ3hqUVVGTkxHRkJRV0VzVVVGQlVTeEpRVUZKTEUxQlFVb3NRMEZCVnl4RFFVRllMRVZCUVdNc1YwRkJaQ3hGUVVGU0xFZEJRWE5ETEVsQlFVa3NTMEZCU2l4RFFVRlZMRU5CUVZZc1EwRkJla1E3TzBGQlJVRXNZMEZCU1N4TFFVRkxMRlZCUVV3c1EwRkJTaXhGUVVGelFqdEJRVU53UWl4cFFrRkJTeXhWUVVGTUxFVkJRV2xDTEU5QlFXcENMRVZCUVRCQ0xGTkJRVEZDTzBGQlEwUXNWMEZHUkN4TlFVVlBPMEZCUTB3c2FVSkJRVXNzV1VGQlRDeERRVUZyUWl4UFFVRnNRaXhGUVVFeVFpeEhRVUV6UWl4RlFVRm5ReXhUUVVGb1F6dEJRVU5FTzBGQlEwWTdRVUZEUmpzN1FVRkZSRHM3T3p0QlFXNUlhMEk3UVVGQlFUdEJRVUZCTEN0Q1FYTklWQ3hQUVhSSVV5eEZRWE5JUVR0QlFVRkJPenRCUVVOb1FpeGpRVUZOTEVsQlFVNHNRMEZCVnl4UFFVRllMRVZCUVc5Q0xFOUJRWEJDTEVOQlFUUkNPMEZCUVVFc2FVSkJRVTBzVFVGQlN5eFBRVUZNTEVOQlFXRXNSVUZCWWl4RFFVRk9PMEZCUVVFc1UwRkJOVUk3UVVGRFJEdEJRWGhJYVVJN1FVRkJRVHRCUVVGQkxEQkNRVzlEUnp0QlFVTnVRaXhsUVVGVkxFbEJRVllzVTBGQmEwSXNUMEZCYkVJN1FVRkRSRHRCUVhSRGFVSTdPMEZCUVVFN1FVRkJRVHM3UVVFeVNIQkNMRk5CUVU4c1RVRkJVRHRCUVVORUxFTkJOVWhqTEVWQlFXWTdPMnRDUVRoSVpTeE5PenM3T3pzN096czdPenR4YWtKRGNFbG1PenM3T3pzN08wRkJTMEU3T3pzN096czdPMEZCUlVFc1NVRkJUU3hQUVVGUkxGbEJRVTA3UVVGRGJFSTdPenM3T3p0QlFVMUJMRTFCUVUwc1QwRkJUeXhOUVVGaU8wRkJRMEVzVFVGQlRTeFZRVUZWTEU5QlFXaENPMEZCUTBFc1RVRkJUU3h4UWtGQmNVSTdRVUZEZWtJc2IwSkJRV2RDTEVsQlJGTTdRVUZGZWtJc1dVRkJVU3hKUVVacFFqdEJRVWQ2UWl4alFVRlZMRWxCU0dVN1FVRkpla0lzVlVGQlRUczdRVUZIVWpzN096czdPMEZCVURKQ0xFZEJRVE5DTzBGQlZHdENMRTFCYzBKYUxFbEJkRUpaTzBGQmRVSm9RanM3T3p0QlFVbEJMRzlDUVVFd1FqdEJRVUZCTEZWQlFXUXNUMEZCWXl4MVJVRkJTaXhGUVVGSk96dEJRVUZCT3p0QlFVTjRRaXhYUVVGTExFOUJRVXdzUjBGQlpTeFBRVUZQTEUxQlFWQXNRMEZCWXl4clFrRkJaQ3hGUVVGclF5eFBRVUZzUXl4RFFVRm1PenRCUVVWQkxGVkJRVWtzVDBGQlR5eExRVUZMTEU5QlFVd3NRMEZCWVN4alFVRndRaXhMUVVGMVF5eFJRVUV6UXl4RlFVRnhSRHRCUVVOdVJDeGpRVUZOTEVsQlFVa3NTMEZCU2l4RFFVRmhMRWxCUVdJc09FUkJRVTQ3UVVGRFJEczdRVUZGUkN4VlFVRkpMRXRCUVVzc1QwRkJUQ3hEUVVGaExFbEJRV0lzUzBGQmMwSXNTVUZCTVVJc1JVRkJaME03UVVGRE9VSXNZMEZCVFN4SlFVRkpMRXRCUVVvc1EwRkJZU3hKUVVGaUxIRkRRVUZPTzBGQlEwUTdPMEZCUlVRc1ZVRkJTU3hSUVVGUExFdEJRVXNzVDBGQlRDeERRVUZoTEVsQlFXSXNRMEZCYTBJc1MwRkJTeXhQUVVGTUxFTkJRV0VzWTBGQkwwSXNRMEZCVUN4TlFVRXdSQ3hSUVVFNVJDeEZRVUYzUlR0QlFVTjBSU3hqUVVGTkxFbEJRVWtzUzBGQlNpeERRVUZoTEVsQlFXSXNiVVZCUVU0N1FVRkRSRHM3UVVGRlJDeFhRVUZMTEZOQlFVd3NRMEZCWlN4TFFVRkxMRTlCUVV3c1EwRkJZU3hOUVVFMVFpeEZRVUZ2UXl4TFFVRkxMRTlCUVV3c1EwRkJZU3hSUVVGcVJEdEJRVU5FT3p0QlFUTkRaVHRCUVVGQk8wRkJRVUVzYTBOQmFVUktPMEZCUTFZc1pVRkJUeXhMUVVGTExFOUJRVXdzUTBGQllTeE5RVUZ3UWp0QlFVTkVPMEZCYmtSbE8wRkJRVUU3UVVGQlFTd3dRMEZ4UkVrN1FVRkRiRUlzWlVGQlR5eExRVUZMTEU5QlFVd3NRMEZCWVN4alFVRndRanRCUVVORU96dEJRVVZFT3pzN096czdRVUY2UkdkQ08wRkJRVUU3UVVGQlFTeG5RMEU0UkU0c1RVRTVSRTBzUlVFNFJIRkNPMEZCUVVFc1dVRkJia0lzVlVGQmJVSXNkVVZCUVU0c1NVRkJUVHM3UVVGRGJrTXNXVUZCU1N4UlFVRlBMRXRCUVVzc1QwRkJUQ3hEUVVGaExFbEJRV0lzUTBGQmEwSXNUVUZCYkVJc1EwRkJVQ3hOUVVGeFF5eFJRVUY2UXl4RlFVRnRSRHRCUVVOcVJDeHJRa0ZCVVN4TFFVRlNMRU5CUVdsQ0xFbEJRV3BDTEZWQlFUQkNMRTFCUVRGQ0xHdERRVUUyUkN4TFFVRkxMRTlCUVV3c1EwRkJZU3hqUVVFeFJUdEJRVU5FTEZOQlJrUXNUVUZGVHp0QlFVTk1MR1ZCUVVzc1QwRkJUQ3hEUVVGaExFMUJRV0lzUjBGQmMwSXNUVUZCZEVJN1FVRkRSRHM3UVVGRlJDeFpRVUZKTEZWQlFVb3NSVUZCWjBJN1FVRkRaQ3hsUVVGTExGVkJRVXc3UVVGRFJEdEJRVU5HTzBGQmVFVmxPMEZCUVVFN1FVRkJRU3h4UTBFd1JVUTdRVUZEWWl4bFFVRlBMRTlCUVU4c1NVRkJVQ3hEUVVGWkxFdEJRVXNzVDBGQlRDeERRVUZoTEVsQlFYcENMRU5CUVZBN1FVRkRSRHRCUVRWRlpUdEJRVUZCTzBGQlFVRXNjVU5CT0VWclF6dEJRVUZCTEZsQlFYSkRMRXRCUVhGRExIVkZRVUUzUWl4SlFVRTJRanRCUVVGQkxGbEJRWFpDTEdkQ1FVRjFRaXgxUlVGQlNpeEZRVUZKT3p0QlFVTm9SQ3haUVVGSkxFOUJRVThzUzBGQlVDeExRVUZwUWl4UlFVRnlRaXhGUVVFclFqdEJRVU0zUWl4cFFrRkJUeXhUUVVGUU8wRkJRMFE3TzBGQlJVUXNXVUZCVFN4UlFVRlJMRTFCUVUwc1MwRkJUaXhEUVVGWkxHMUNRVUZhTEVOQlFXUTdRVUZEUVN4WlFVRkpMRXRCUVVvc1JVRkJWenRCUVVOVUxHdENRVUZSTEUxQlFVMHNUMEZCVGl4RFFVRmpMRTFCUVUwc1EwRkJUaXhEUVVGa0xFVkJRWGRDTEdsQ1FVRnBRaXhOUVVGTkxFTkJRVTRzUTBGQmFrSXNRMEZCZUVJc1EwRkJVanRCUVVORU96dEJRVVZFTEZsQlFVa3NUVUZCVFN4TFFVRk9MRU5CUVZrc2JVSkJRVm9zUTBGQlNpeEZRVUZ6UXp0QlFVTndReXhwUWtGQlR5eExRVUZMTEZsQlFVd3NRMEZCYTBJc1MwRkJiRUlzUlVGQmVVSXNaMEpCUVhwQ0xFTkJRVkE3UVVGRFJEczdRVUZGUkN4bFFVRlBMRXRCUVZBN1FVRkRSRHRCUVRkR1pUdEJRVUZCTzBGQlFVRXNhME5CSzBaMVFqdEJRVUZCT3p0QlFVRkJMRmxCUVRkQ0xFOUJRVFpDTEhWRlFVRnVRaXhKUVVGdFFqdEJRVUZCTEZsQlFXSXNUVUZCWVN4MVJVRkJTaXhGUVVGSk96dEJRVU55UXl4WlFVRkpMRTlCUVU4c1MwRkJTeXhQUVVGTUxFTkJRV0VzU1VGQllpeERRVUZyUWl4TFFVRkxMRTlCUVV3c1EwRkJZU3hOUVVFdlFpeERRVUZZTzBGQlEwRXNXVUZCU1N4RFFVRkRMRWxCUVV3c1JVRkJWenRCUVVOVUxHbENRVUZQTEV0QlFVc3NUMEZCVEN4RFFVRmhMRWxCUVdJc1EwRkJhMElzUzBGQlN5eFBRVUZNTEVOQlFXRXNZMEZCTDBJc1EwRkJVRHRCUVVORU96dEJRVVZFTEZsQlFVa3NXVUZCV1N4SlFVRmFMRWxCUVc5Q0xGbEJRVmtzUjBGQmFFTXNTVUZCZFVNc1RVRkJUU3hQUVVGT0xFTkJRV01zVDBGQlpDeERRVUV6UXl4RlFVRnRSVHRCUVVOcVJTeGpRVUZKTEUxQlFVMHNUMEZCVGl4RFFVRmpMRTlCUVdRc1EwRkJTaXhGUVVFMFFqdEJRVU14UWl4blFrRkJUU3hQUVVGUExFOUJRVThzU1VGQlVDeERRVUZaTEVsQlFWb3NSVUZCYTBJc1RVRkJiRUlzUTBGQmVVSTdRVUZCUVN4eFFrRkJUeXhSUVVGUkxFOUJRVklzUTBGQlowSXNSMEZCYUVJc1NVRkJkVUlzUTBGQlF5eERRVUV2UWp0QlFVRkJMR0ZCUVhwQ0xFTkJRV0k3UVVGRFFTeG5Ra0ZCVFN4bFFVRmxMRVZCUVhKQ08wRkJRMEVzYVVKQlFVc3NUMEZCVEN4RFFVRmhMR1ZCUVU4N1FVRkRiRUlzTWtKQlFXRXNSMEZCWWl4SlFVRnZRaXhOUVVGTExGbEJRVXdzUTBGQmEwSXNTMEZCU3l4SFFVRk1MRU5CUVd4Q0xFVkJRVFpDTEUxQlFUZENMRU5CUVhCQ08wRkJRMFFzWVVGR1JEdEJRVWRCTEcxQ1FVRlBMRmxCUVZBN1FVRkRSRHM3UVVGRlJDeGpRVUZOTEZWQlFWVXNSVUZCYUVJN1FVRkRRU3hsUVVGTExFbEJRVTBzUjBGQldDeEpRVUZyUWl4SlFVRnNRaXhGUVVGM1FqdEJRVU4wUWl4dlFrRkJVU3hIUVVGU0xFbEJRV1VzUzBGQlN5eFpRVUZNTEVOQlFXdENMRXRCUVVzc1IwRkJUQ3hEUVVGc1FpeEZRVUUyUWl4TlFVRTNRaXhEUVVGbU8wRkJRMFE3TzBGQlJVUXNhVUpCUVU4c1QwRkJVRHRCUVVORU96dEJRVVZFTEdWQlFVOHNTMEZCU3l4WlFVRk1MRU5CUVd0Q0xFdEJRVXNzVDBGQlRDeERRVUZzUWl4RlFVRnBReXhOUVVGcVF5eERRVUZRTzBGQlEwUTdPMEZCUlVRN08wRkJNVWhuUWp0QlFVRkJPMEZCUVVFc01FSkJNa2hsTzBGQlFVRXNXVUZCTjBJc1QwRkJOa0lzZFVWQlFXNUNMRWxCUVcxQ08wRkJRVUVzV1VGQllpeE5RVUZoTEhWRlFVRktMRVZCUVVrN08wRkJRemRDTEdWQlFVOHNTMEZCU3l4VFFVRk1MRU5CUVdVc1QwRkJaaXhGUVVGM1FpeE5RVUY0UWl4RFFVRlFPMEZCUTBRN08wRkJSVVE3T3pzN08wRkJMMGhuUWp0QlFVRkJPMEZCUVVFc2FVTkJiVWxNTEU5QmJrbExMRVZCYlVsSk8wRkJRMnhDTEZsQlFVa3NUMEZCVHl4UFFVRlFMRXRCUVcxQ0xGZEJRWFpDTEVWQlFXOURPMEZCUTJ4RExHOUNRVUZWTEZOQlFWTXNaMEpCUVZRc1EwRkJNRUlzWVVGQk1VSXNRMEZCVmp0QlFVTkVPenRCUVVWRUxGbEJRVWtzVDBGQlR5eFBRVUZRTEV0QlFXMUNMRkZCUVhaQ0xFVkJRV2xETzBGQlF5OUNMRzlDUVVGVkxGTkJRVk1zWVVGQlZDeERRVUYxUWl4UFFVRjJRaXhEUVVGV08wRkJRMFE3TzBGQlJVUXNOa0pCUVZjc1QwRkJXQ3hGUVVGdlFpeExRVUZMTEVOQlFVd3NSVUZCY0VJN1FVRkRSRHM3UVVGRlJEczdRVUV2U1dkQ08wRkJRVUU3UVVGQlFTeHZRMEZuU2tzc1QwRm9Ta3dzUlVGblNtTTdRVUZETlVJc1pVRkJUeXhKUVVGSkxFbEJRVW9zUTBGQlV5eFBRVUZVTEVOQlFWQTdRVUZEUkR0QlFXeEtaVHRCUVVGQk8wRkJRVUVzTUVKQk5rTkxPMEZCUTI1Q0xHVkJRVlVzU1VGQlZpeFRRVUZyUWl4UFFVRnNRanRCUVVORU8wRkJMME5sT3p0QlFVRkJPMEZCUVVFN08wRkJjVXBzUWl4VFFVRlBMRWxCUVZBN1FVRkRSQ3hEUVhSS1dTeEZRVUZpT3p0clFrRjNTbVVzU1RzN096czdPenM3TzNGcVFrTXZTbVk3T3pzN096dEJRVTFCT3pzN08wRkJRMEU3T3pzN096czdPMEZCUlVFc1NVRkJUU3hSUVVGVExGbEJRVTA3UVVGRGJrSTdPenM3T3p0QlFVMUJMRTFCUVUwc1QwRkJUeXhQUVVGaU8wRkJRMEVzVFVGQlRTeFZRVUZWTEU5QlFXaENPMEZCUTBFc1RVRkJUU3h4UWtGQmNVSTdRVUZEZWtJc1owSkJRVmtzU1VGRVlUdEJRVVY2UWl4aFFVRlRMRWxCUm1kQ08wRkJSM3BDTEdsQ1FVRmhMRWxCU0ZrN1FVRkpla0lzYTBKQlFXTTdRVUZLVnl4SFFVRXpRanM3UVVGUFFTeE5RVUZKTEc5Q1FVRktPMEZCUTBFN096czdPenRCUVdwQ2JVSXNUVUYxUW1Jc1MwRjJRbUU3UVVGM1FtcENPenM3T3p0QlFVdEJMSEZDUVVFd1FqdEJRVUZCTEZWQlFXUXNUMEZCWXl4MVJVRkJTaXhGUVVGSk96dEJRVUZCT3p0QlFVTjRRaXhYUVVGTExFOUJRVXdzUjBGQlpTeFBRVUZQTEUxQlFWQXNRMEZCWXl4clFrRkJaQ3hGUVVGclF5eFBRVUZzUXl4RFFVRm1PenRCUVVWQkxGZEJRVXNzUzBGQlRDeEhRVUZoTEVWQlFXSTdRVUZEUVN4WFFVRkxMRTlCUVV3c1IwRkJaU3hMUVVGbU96dEJRVVZCTzBGQlEwRXNWMEZCU3l4alFVRk1PenRCUVVWQk8wRkJRMEVzVjBGQlN5eFhRVUZNTzBGQlEwUTdPMEZCUlVRN096dEJRVEZEYVVJN1FVRkJRVHRCUVVGQkxIZENRVEpEWml4UlFUTkRaU3hGUVRKRFREdEJRVU5XTEdWQlFVOHNVMEZCVXl4aFFVRlVMRU5CUVhWQ0xGRkJRWFpDTEVOQlFWQTdRVUZEUkR0QlFUZERaMEk3UVVGQlFUdEJRVUZCTEdkRFFTdERVRHRCUVVOU0xHVkJRVThzVDBGQlR5eFJRVUZRTEVOQlFXZENMRWxCUVdoQ0xFTkJRWEZDTEV0QlFYSkNMRU5CUVRKQ0xFdEJRVXNzVDBGQlRDeERRVUZoTEZWQlFYaERMRVZCUVc5RUxFTkJRWEJFTEVOQlFWQTdRVUZEUkR0QlFXcEVaMEk3UVVGQlFUdEJRVUZCTEhkRFFXMUVRenRCUVVOb1FpeFpRVUZOTEU5QlFVOHNTMEZCU3l4UFFVRk1MRVZCUVdJN1FVRkRRU3haUVVGTkxFdEJRVXNzU1VGQlNTeE5RVUZLTEVOQlFWY3NaVUZCV0N4RFFVRllPMEZCUTBFc1dVRkJUU3hWUVVGVkxFZEJRVWNzU1VGQlNDeERRVUZSTEVsQlFWSXNRMEZCYUVJN08wRkJSVUVzV1VGQlNTeFhRVUZYTEZGQlFWRXNRMEZCVWl4RFFVRm1MRVZCUVRKQ08wRkJRM3BDTEdsQ1FVRlBMRkZCUVZFc1EwRkJVaXhEUVVGUU8wRkJRMFE3TzBGQlJVUXNaVUZCVHl4SlFVRlFPMEZCUTBRN1FVRTNSR2RDTzBGQlFVRTdRVUZCUVN3NFFrRXJSRlFzVVVFdlJGTXNSVUVyUkVNN1FVRkRhRUlzWlVGQlR5eFJRVUZRTEVOQlFXZENMRWxCUVdoQ0xFZEJRVEJDTEV0QlFVc3NUMEZCVEN4RFFVRmhMRlZCUVhaRExGTkJRWEZFTEZGQlFYSkVPMEZCUTBRN1FVRnFSV2RDTzBGQlFVRTdRVUZCUVN4clEwRnRSVXdzVTBGdVJVc3NSVUZ0UlUwc1UwRnVSVTRzUlVGdFJXbENPMEZCUTJoRExGbEJRVTBzVVVGQlVTeExRVUZMTEZsQlFVd3NRMEZCYTBJc1UwRkJiRUlzUTBGQlpEdEJRVU5CTEZsQlFVMHNVVUZCVVN4TFFVRkxMRmxCUVV3c1EwRkJhMElzVTBGQmJFSXNRMEZCWkR0QlFVTkJMR1ZCUVU4c1UwRkJVeXhMUVVGVUxFbEJRV3RDTEUxQlFVMHNTVUZCVGl4TFFVRmxMRTFCUVUwc1NVRkJPVU03UVVGRFJEczdRVUZGUkRzN096czdRVUY2UldsQ08wRkJRVUU3UVVGQlFTeDFRMEUyUlVFN1FVRkJRVHM3UVVGRFppeHBRa0ZCVXl4blFrRkJWQ3hEUVVFd1FpeFBRVUV4UWl4RlFVRnRRenRCUVVGQkxHbENRVUZUTEUxQlFVc3NUMEZCVEN4RFFVRmhMRXRCUVdJc1EwRkJWRHRCUVVGQkxGTkJRVzVETzBGQlEwRXNaVUZCVHl4blFrRkJVQ3hEUVVGM1FpeFZRVUY0UWl4RlFVRnZRenRCUVVGQkxHbENRVUZUTEUxQlFVc3NZVUZCVEN4RFFVRnRRaXhMUVVGdVFpeERRVUZVTzBGQlFVRXNVMEZCY0VNN1FVRkRRU3hsUVVGUExHZENRVUZRTEVOQlFYZENMRmxCUVhoQ0xFVkJRWE5ETzBGQlFVRXNhVUpCUVZNc1RVRkJTeXhaUVVGTUxFTkJRV3RDTEV0QlFXeENMRU5CUVZRN1FVRkJRU3hUUVVGMFF6dEJRVU5CTEdsQ1FVRlRMR2RDUVVGVUxFTkJRVEJDTEd0Q1FVRXhRaXhGUVVFNFF6dEJRVUZCTEdsQ1FVRlRMRTFCUVVzc1YwRkJUQ3hEUVVGcFFpeExRVUZxUWl4RFFVRlVPMEZCUVVFc1UwRkJPVU03UVVGRFJEczdRVUZGUkRzN1FVRndSbWxDTzBGQlFVRTdPenRCUVRCR2FrSTdPMEZCTVVacFFpd3JRa0UwUmxJc1VVRTFSbEVzUlVFMFJuRkRPMEZCUVVFN08wRkJRVUVzV1VGQmJrTXNXVUZCYlVNc2RVVkJRWEJDTEVsQlFXOUNPMEZCUVVFc1dVRkJaQ3hKUVVGakxIVkZRVUZRTEV0QlFVODdPMEZCUTNCRUxGbEJRVTBzVlVGQlZTeExRVUZMTEVOQlFVd3NRMEZCVHl4VlFVRlFMRU5CUVdoQ08wRkJRMEVzV1VGQlNTeFBRVUZLTEVWQlFXRTdRVUZEV0N4alFVRk5MR05CUVdNc1VVRkJVU3haUVVGU0xFTkJRWEZDTEZkQlFYSkNMRU5CUVhCQ096dEJRVVZCTEdOQlFVa3NTMEZCU3l4WFFVRk1MRU5CUVdsQ0xGRkJRV3BDTEVWQlFUSkNMRmRCUVROQ0xFTkJRVW9zUlVGQk5rTTdRVUZETTBNN1FVRkRSRHM3UVVGRlJDeHJRa0ZCVVN4VFFVRlNMRU5CUVd0Q0xFMUJRV3hDTEVOQlFYbENMRk5CUVhwQ096dEJRVVZCTzBGQlEwRXNhVUpCUVU4c1QwRkJVQ3hEUVVGbExGbEJRV1lzUTBGQk5FSXNSVUZCUlN4TlFVRk5MRmRCUVZJc1JVRkJOVUlzUlVGQmJVUXNWMEZCYmtRc1JVRkJaMFVzVDBGQlR5eFJRVUZRTEVOQlFXZENMRWxCUVdoR096dEJRVVZCTEdWQlFVc3NaMEpCUVV3c1EwRkJjMElzVjBGQmRFSXNSVUZCYlVNc2FVSkJRVTBzU1VGQmVrTTdRVUZEUkRzN1FVRkZSQ3hoUVVGTExHZENRVUZNTEVOQlFYTkNMRkZCUVhSQ0xFVkJRV2RETEdsQ1FVRk5MRWxCUVhSRE96dEJRVVZCTEhOQ1FVRmpMRkZCUVdRN08wRkJSVUU3UVVGRFFTeFpRVUZOTEZWQlFWVXNTMEZCU3l4RFFVRk1MR3RDUVVGelFpeFJRVUYwUWl4UlFVRm9RanM3UVVGRlFTeG5Ra0ZCVVN4VFFVRlNMRU5CUVd0Q0xFZEJRV3hDTEVOQlFYTkNMRk5CUVhSQ096dEJRVVZCTzBGQlEwRXNXVUZCVFN4WlFVRlpMRXRCUVVzc1dVRkJUQ3hEUVVGclFpeFJRVUZzUWl4RFFVRnNRanM3UVVGRlFUdEJRVU5CTEZsQlFVa3NZVUZCWVN4VlFVRlZMRmRCUVZZc1JVRkJha0lzUlVGQk1FTTdRVUZEZUVNc2IwSkJRVlVzV1VGQlZqdEJRVU5FTzBGQlEwUTdPMEZCUlVFc1dVRkJTU3hQUVVGS0xFVkJRV0U3UVVGRFdDeGpRVUZOTEdWQlFXTXNVVUZCVVN4WlFVRlNMRU5CUVhGQ0xGZEJRWEpDTEVOQlFYQkNPMEZCUTBFN1FVRkRRU3hyUWtGQlVTeEpRVUZTTEVkQlFXVXNTVUZCWmp0QlFVTkJMR3RDUVVGUkxHZENRVUZTTEVkQlFUSkNMRmxCUVROQ096dEJRVVZCTEdOQlFVMHNjVUpCUVhGQ0xGTkJRWEpDTEd0Q1FVRnhRaXhIUVVGTk8wRkJReTlDTEdkQ1FVRkpMRkZCUVZFc1UwRkJVaXhEUVVGclFpeFJRVUZzUWl4RFFVRXlRaXhUUVVFelFpeERRVUZLTEVWQlFUSkRPMEZCUTNwRExITkNRVUZSTEZOQlFWSXNRMEZCYTBJc1RVRkJiRUlzUTBGQmVVSXNVMEZCZWtJN1FVRkRSRHM3UVVGRlJDeHZRa0ZCVVN4VFFVRlNMRU5CUVd0Q0xFMUJRV3hDTEVOQlFYbENMRkZCUVZFc1NVRkJVaXhIUVVGbExGVkJRV1lzUjBGQk5FSXNWMEZCY2tRN08wRkJSVUVzYlVKQlFVc3NaMEpCUVV3c1EwRkJjMElzVjBGQmRFSXNSVUZCYlVNc2FVSkJRVTBzUzBGQmVrTTdRVUZEUVN4dFFrRkJTeXhuUWtGQlRDeERRVUZ6UWl4UlFVRlJMR2RDUVVFNVFpeEZRVUZuUkN4cFFrRkJUU3hOUVVGMFJEczdRVUZGUVN4dlFrRkJVU3h0UWtGQlVpeERRVUUwUWl4cFFrRkJUU3hoUVVGc1F5eEZRVUZwUkN4clFrRkJha1E3UVVGRFJDeFhRVmhFT3p0QlFXRkJMR05CUVVrc1MwRkJTeXhQUVVGTUxFTkJRV0VzV1VGQmFrSXNSVUZCSzBJN1FVRkROMElzYjBKQlFWRXNaMEpCUVZJc1EwRkJlVUlzYVVKQlFVMHNZVUZCTDBJc1JVRkJPRU1zYTBKQlFUbERPMEZCUTBFc2IwSkJRVkVzVTBGQlVpeERRVUZyUWl4SFFVRnNRaXhEUVVGelFpeFRRVUYwUWp0QlFVTkVMRmRCU0VRc1RVRkhUenRCUVVOTU8wRkJRMFE3TzBGQlJVUXNhMEpCUVZFc1UwRkJVaXhEUVVGclFpeEhRVUZzUWl4RFFVRnpRaXhQUVVGUExGVkJRVkFzUjBGQmIwSXNWMEZCTVVNN1FVRkRSRHRCUVVOR08wRkJNMHBuUWp0QlFVRkJPMEZCUVVFc2VVTkJOa3BGTEZGQk4wcEdMRVZCTmtwWk8wRkJRek5DTEZsQlFVa3NRMEZCUXl4TFFVRkxMRmxCUVV3c1EwRkJhMElzVVVGQmJFSXNRMEZCVEN4RlFVRnJRenRCUVVOb1F5eGxRVUZMTEV0QlFVd3NRMEZCVnl4SlFVRllMRU5CUVdkQ0xHMUNRVUZUTEZGQlFWUXNRMEZCYUVJN1FVRkRSRHRCUVVOR08wRkJha3RuUWp0QlFVRkJPMEZCUVVFc2JVTkJiVXRLTEZGQmJrdEpMRVZCYlV0Tk8wRkJRM0pDTEdWQlFVOHNTMEZCU3l4TFFVRk1MRU5CUVZjc1NVRkJXQ3hEUVVGblFqdEJRVUZCTEdsQ1FVRlJMRXRCUVVzc1NVRkJUQ3hMUVVGakxGRkJRWFJDTzBGQlFVRXNVMEZCYUVJc1EwRkJVRHRCUVVORU8wRkJja3RuUWp0QlFVRkJPMEZCUVVFc2IwTkJkVXRJTEZOQmRrdEhMRVZCZFV0Uk8wRkJRM1pDTEdWQlFVOHNTMEZCU3l4TFFVRk1MRU5CUVZjc1RVRkJXQ3hEUVVGclFqdEJRVUZCTEdsQ1FVRlJMRlZCUVZVc1QwRkJWaXhEUVVGclFpeExRVUZMTEVsQlFYWkNMRWxCUVN0Q0xFTkJRVU1zUTBGQmVFTTdRVUZCUVN4VFFVRnNRaXhEUVVGUU8wRkJRMFE3UVVGNlMyZENPMEZCUVVFN1FVRkJRU3h6UTBFeVMwUXNSMEV6UzBNc1JVRXlTMGs3UVVGRGJrSXNaVUZCVHl4SlFVRkpMRXRCUVVvc1EwRkJWU3hIUVVGV0xFVkJRV1VzUjBGQlppeERRVUZ0UWp0QlFVRkJMR2xDUVVGUkxFdEJRVXNzU1VGQlRDeEZRVUZTTzBGQlFVRXNVMEZCYmtJc1EwRkJVRHRCUVVORU8wRkJOMHRuUWp0QlFVRkJPMEZCUVVFc1owTkJLMHRRTEZGQkwwdFBMRVZCSzB0SE8wRkJRMnhDTEZsQlFVa3NTMEZCU3l4cFFrRkJUQ3hMUVVFeVFpeEhRVUV2UWl4RlFVRnZRenRCUVVOc1F6dEJRVU5CTEdWQlFVc3NTMEZCVEN4RFFVRlhMRTlCUVZnc1EwRkJiVUlzVlVGQlF5eEpRVUZFTEVWQlFWVTdRVUZETTBJc2FVSkJRVXNzWjBKQlFVd3NRMEZCYzBJc1VVRkJkRUk3UVVGRFJDeFhRVVpFTzBGQlIwRTdRVUZEUkRzN1FVRkZSQ3haUVVGTkxHRkJRV0VzUzBGQlN5eGhRVUZNTEVOQlFXMUNMRXRCUVVzc1pVRkJUQ3hEUVVGeFFpeExRVUZMTEdsQ1FVRXhRaXhEUVVGdVFpeEZRVUZwUlN4SlFVRnFSU3hEUVVGdVFqdEJRVU5CTEcxQ1FVRlhMRTlCUVZnc1EwRkJiVUlzVlVGQlF5eEpRVUZFTEVWQlFWVTdRVUZETTBJc1pVRkJTeXhuUWtGQlRDeERRVUZ6UWl4UlFVRjBRanRCUVVORUxGTkJSa1E3UVVGSFFTeGhRVUZMTEdsQ1FVRk1MRWRCUVhsQ0xFbEJRWHBDTzBGQlEwUTdRVUUzVEdkQ08wRkJRVUU3UVVGQlFTeHJRMEVyVEV3c1dVRXZURXNzUlVFclRHZERPMEZCUVVFc1dVRkJka0lzWTBGQmRVSXNkVVZCUVU0c1NVRkJUVHM3UVVGREwwTXNXVUZCVFN4aFFVRmhMRXRCUVVzc1lVRkJUQ3hEUVVGdFFpeExRVUZMTEdWQlFVd3NRMEZCY1VJc1MwRkJTeXhwUWtGQk1VSXNRMEZCYmtJc1JVRkJhVVVzU1VGQmFrVXNRMEZCYmtJN1FVRkRRU3h0UWtGQlZ5eFBRVUZZTEVOQlFXMUNMRlZCUVVNc1NVRkJSQ3hGUVVGVk8wRkJRek5DTEdWQlFVc3NWMEZCVEN4RFFVRnBRaXhaUVVGcVFqdEJRVU5CTEdOQlFVa3NUMEZCVHl4alFVRlFMRXRCUVRCQ0xGVkJRVGxDTEVWQlFUQkRPMEZCUTNoRExHbENRVUZMTEcxQ1FVRk1MRU5CUVhsQ0xHTkJRWHBDTzBGQlEwUTdRVUZEUml4VFFVeEVPMEZCVFVFc1lVRkJTeXhwUWtGQlRDeEhRVUY1UWl4SlFVRjZRanRCUVVORU8wRkJlRTFuUWp0QlFVRkJPMEZCUVVFc2RVTkJNRTFCTEZGQk1VMUJMRVZCTUUxVkxGTkJNVTFXTEVWQk1FMTVRenRCUVVGQkxGbEJRWEJDTEZkQlFXOUNMSFZGUVVGT0xFbEJRVTA3TzBGQlEzaEVMRmxCUVUwc1dVRkJXU3hMUVVGTExGbEJRVXdzUTBGQmEwSXNVVUZCYkVJc1EwRkJiRUk3UVVGRFFTeFpRVUZKTEZOQlFVb3NSVUZCWlR0QlFVTmlMRzlDUVVGVkxHRkJRVllzUTBGQmQwSXNVMEZCZUVJc1JVRkJiVU1zVjBGQmJrTTdRVUZEUkR0QlFVTkdPMEZCTDAxblFqdEJRVUZCTzBGQlFVRXNPRUpCYVU1VUxFdEJhazVUTEVWQmFVNUdPMEZCUTJJc1dVRkJUU3hYUVVGWExFMUJRVTBzVFVGQlRpeERRVUZoTEZsQlFXSXNRMEZCTUVJc1pVRkJNVUlzUTBGQmFrSTdRVUZEUVN4WlFVRk5MRmRCUVZjc1JVRkJSU3hOUVVGTkxFMUJRVTRzUTBGQllTeFpRVUZpTEVOQlFUQkNMR1ZCUVRGQ0xFMUJRU3RETEUxQlFXcEVMRU5CUVdwQ096dEJRVVZCTEZsQlFVa3NVVUZCU2l4RlFVRmpPMEZCUTFvc1kwRkJTU3hoUVVGaExFOUJRV3BDTEVWQlFUQkNPMEZCUTNoQ08wRkJRMEVzYlVKQlFVOHNUMEZCVUN4RFFVRmxMRWxCUVdZN1FVRkRRVHRCUVVORU96dEJRVVZFT3pzN096dEJRVXRCTEdOQlFVa3NTMEZCU3l4UFFVRk1MRU5CUVdFc1QwRkJha0lzUlVGQk1FSTdRVUZEZUVJc2FVSkJRVXNzVDBGQlRDeERRVUZoTEZGQlFXSTdRVUZEUkN4WFFVWkVMRTFCUlU4N1FVRkRUQ3hwUWtGQlN5eFJRVUZNTEVOQlFXTXNVVUZCWkN4RlFVRjNRaXhKUVVGNFFpeEZRVUU0UWl4UlFVRTVRanRCUVVORU8wRkJRMFk3UVVGRFJqdEJRWFpQWjBJN1FVRkJRVHRCUVVGQkxITkRRWGxQVXp0QlFVRkJMRmxCUVZvc1MwRkJXU3gxUlVGQlNpeEZRVUZKT3p0QlFVTjRRaXhaUVVGTkxGZEJRVmNzVFVGQlRTeExRVUZPTEVkQlFXTXNUVUZCVFN4TFFVRk9MRU5CUVZrc1NVRkJNVUlzUjBGQmFVTXNTVUZCYkVRN1FVRkRRU3haUVVGSkxFTkJRVU1zVVVGQlRDeEZRVUZsTzBGQlEySTdRVUZEUkRzN1FVRkZSQ3hoUVVGTExGRkJRVXdzUTBGQll5eFJRVUZrTEVWQlFYZENMRWxCUVhoQ0xFVkJRVGhDTEVsQlFUbENPMEZCUTBRN1FVRm9VR2RDTzBGQlFVRTdRVUZCUVN4eFEwRnJVRVk3UVVGRFlpeFpRVUZOTEZOQlFWTXNRMEZCUXl4TFFVRkxMRTlCUVV3c1MwRkJhVUlzUzBGQlN5eFBRVUZNTEVkQlFXVXNTMEZCWml4RFFVRnhRaXhIUVVGeVFpeERRVUZxUWl4SFFVRTJReXhGUVVFNVF5eEZRVUZyUkN4TlFVRnNSQ3hEUVVGNVJEdEJRVUZCTEdsQ1FVRkxMRVZCUVVVc1RVRkJSaXhIUVVGWExFTkJRV2hDTzBGQlFVRXNVMEZCZWtRc1EwRkJaanRCUVVOQkxGbEJRVWtzVDBGQlR5eE5RVUZRTEVkQlFXZENMRU5CUVhCQ0xFVkJRWFZDTzBGQlEzSkNPMEZCUTBFc2FVSkJRVThzUzBGQlVEdEJRVU5FT3p0QlFVVkVMR0ZCUVVzc1owSkJRVXdzUTBGQmMwSXNWMEZCZEVJc1JVRkJiVU1zYVVKQlFVMHNTVUZCZWtNc1JVRkJLME1zVFVGQkwwTTdPMEZCUlVFc1dVRkJUU3hWUVVGVkxFdEJRVXNzWlVGQlRDeEZRVUZvUWp0QlFVTkJMRmxCUVVrc1QwRkJTaXhGUVVGaE8wRkJRMWdzWlVGQlN5eFJRVUZNTEVOQlFXTXNUMEZCWkR0QlFVTkVPMEZCUTBZN08wRkJSVVE3T3pzN1FVRnFVV2xDTzBGQlFVRTdRVUZCUVN4dlEwRnZVVWc3UVVGQlFUczdRVUZEV2l4WlFVRk5MRkZCUVZFc1UwRkJVeXhuUWtGQlZDeERRVUV3UWl4aFFVRXhRaXhEUVVGa096dEJRVVZCTEZsQlFVa3NRMEZCUXl4TFFVRk1MRVZCUVZrN1FVRkRWanRCUVVORU96dEJRVVZFTEdOQlFVMHNUMEZCVGl4RFFVRmpMRlZCUVVNc1NVRkJSQ3hGUVVGVk8wRkJRM1JDTEdOQlFVa3NWMEZCVnl4TFFVRkxMRmxCUVV3c1EwRkJhMElzVjBGQmJFSXNRMEZCWmp0QlFVTkJPenM3TzBGQlNVRXNZMEZCU1N4RFFVRkRMRkZCUVV3c1JVRkJaVHRCUVVOaUxIVkNRVUZYTEV0QlFVc3NVVUZCYUVJN1FVRkRSRHM3UVVGRlJDeHBRa0ZCU3l4clFrRkJUQ3hEUVVGM1FpeFJRVUY0UWp0QlFVTkVMRk5CV0VRN1FVRlpSRHRCUVhaU1owSTdRVUZCUVR0QlFVRkJMRFpDUVhsU1ZpeFJRWHBTVlN4RlFYbFNjVUk3UVVGQlFTeFpRVUZ5UWl4WlFVRnhRaXgxUlVGQlRpeEpRVUZOT3p0QlFVTndReXhoUVVGTExHbENRVUZNTEVkQlFYbENMRkZCUVhwQ096dEJRVVZCTEZsQlFVa3NaMEpCUVdkQ0xHRkJRV0VzUjBGQmFrTXNSVUZCYzBNN1FVRkRjRU1zWlVGQlN5eHJRa0ZCVEN4RFFVRjNRaXhSUVVGNFFqdEJRVU5FT3p0QlFVVkVMR1ZCUVU4c1NVRkJVRHRCUVVORU8wRkJhbE5uUWp0QlFVRkJPMEZCUVVFc09FSkJiVk5sTzBGQlFVRXNXVUZCTVVJc1owSkJRVEJDTEhWRlFVRlFMRXRCUVU4N08wRkJRemxDTzBGQlEwRXNXVUZCU1N4TFFVRkxMRTlCUVZRc1JVRkJhMEk3UVVGRGFFSXNaMEpCUVUwc1NVRkJTU3hMUVVGS0xFTkJRV0VzU1VGQllpeDVRMEZCVGp0QlFVTkVPenRCUVVWRUxHRkJRVXNzVDBGQlRDeEhRVUZsTEVsQlFXWTdPMEZCUlVFN1FVRkRRU3haUVVGSkxFOUJRVThzVDBGQldDeEZRVUZ2UWp0QlFVTnNRaXcyUWtGQmJVSXNTVUZCYmtJN1FVRkRSRHM3UVVGRlJDeFpRVUZKTEZkQlFWY3NTMEZCU3l4bFFVRk1MRVZCUVdZN1FVRkRRU3haUVVGSkxFTkJRVU1zUzBGQlN5eFpRVUZNTEVOQlFXdENMRkZCUVd4Q0xFTkJRVXdzUlVGQmEwTTdRVUZEYUVNc2NVSkJRVmNzUzBGQlN5eFBRVUZNTEVOQlFXRXNWMEZCZUVJN1FVRkRSRHM3UVVGRlJDeFpRVUZKTEc5Q1FVRnZRaXhEUVVGRExFdEJRVXNzVDBGQlRDeERRVUZoTEZkQlFYUkRMRVZCUVcxRU8wRkJRMnBFTEdkQ1FVRk5MRWxCUVVrc1MwRkJTaXhEUVVGaExFbEJRV0lzTWtSQlFVNDdRVUZEUkRzN1FVRkZSRHRCUVVOQkxGbEJRVWtzVDBGQlR5eExRVUZZTEVWQlFXdENPMEZCUTJoQ0xHdENRVUZSTEVkQlFWSXNRMEZCV1N4M1FrRkJkMElzVTBGQlV5eFhRVUUzUXp0QlFVTkJMR3RDUVVGUkxFZEJRVklzUTBGQldTeExRVUZMTEV0QlFVd3NRMEZCVnl4TlFVRllMRWRCUVc5Q0xHTkJRV2hETzBGQlEwRXNhMEpCUVZFc1IwRkJVaXhEUVVGWkxHRkJRV0VzVVVGQmVrSTdRVUZEUkRzN1FVRkZSRHM3T3p0QlFVbEJMRmxCUVVrc1MwRkJTeXhQUVVGTUxFTkJRV0VzVDBGQmFrSXNSVUZCTUVJN1FVRkRlRUlzWlVGQlN5eFBRVUZNTEVOQlFXRXNVVUZCWWp0QlFVTkVPenRCUVVWRUxHRkJRVXNzVVVGQlRDeERRVUZqTEcxQ1FVRnRRaXhMUVVGTExFOUJRVXdzUTBGQllTeFhRVUZvUXl4SFFVRTRReXhSUVVFMVJEdEJRVU5FT3p0QlFVVkVPenRCUVROVmFVSTdRVUZCUVR0QlFVRkJMRzlEUVRSVlNTeFBRVFZWU2l4RlFUUlZZVHRCUVVNMVFpeGxRVUZQTEVsQlFVa3NTMEZCU2l4RFFVRlZMRTlCUVZZc1EwRkJVRHRCUVVORU8wRkJPVlZuUWp0QlFVRkJPMEZCUVVFc01FSkJjMFpKTzBGQlEyNUNMR1ZCUVZVc1NVRkJWaXhUUVVGclFpeFBRVUZzUWp0QlFVTkVPMEZCZUVablFqczdRVUZCUVR0QlFVRkJPenRCUVdsV2JrSXNVMEZCVHl4TFFVRlFPMEZCUTBRc1EwRnNWbUVzUlVGQlpEczdhMEpCYjFabExFczdPenM3T3pzN096czdPM0ZxUWtNM1ZtWTdPenM3T3p0QlFVMUJPenRCUVVOQk96czdPMEZCUlVFc1NVRkJUU3hQUVVGUkxGbEJRVTA3UVVGRGJFSTdPenM3T3p0QlFVMUJMRTFCUVUwc1QwRkJUeXhOUVVGaU8wRkJRMEVzVFVGQlRTeFZRVUZWTEU5QlFXaENPenRCUVVWQkxFMUJRVTBzYjBKQlFXOUNMR2xDUVVFeFFqczdRVUZGUVRzN096czdPMEZCV210Q0xFMUJhMEphTEVsQmJFSlpPMEZCYlVKb1FqczdPenRCUVVsQkxHdENRVUZaTEZGQlFWb3NSVUZCYzBJN1FVRkJRVHM3UVVGRGNFSXNWMEZCU3l4SlFVRk1MRWRCUVZrc1VVRkJXanRCUVVOQkxGZEJRVXNzVFVGQlRDeEhRVUZqTEVWQlFXUTdRVUZEUVN4WFFVRkxMRmxCUVV3c1IwRkJiMElzU1VGQmNFSTdRVUZEUVN4WFFVRkxMR05CUVV3c1IwRkJjMElzU1VGQmRFSTdRVUZEUkRzN1FVRkZSRHM3UVVFNVFtZENPMEZCUVVFN096dEJRVzlEYUVJN096czdRVUZ3UTJkQ0xHdERRWGREU2p0QlFVTldMR1ZCUVU4c1MwRkJTeXhOUVVGYU8wRkJRMFE3TzBGQlJVUTdPenM3TzBGQk5VTm5RanRCUVVGQk8wRkJRVUVzYjBOQlowUkdPMEZCUTFvc1pVRkJUeXhMUVVGTExGbEJRVm83UVVGRFJEczdRVUZGUkRzN096czdRVUZ3UkdkQ08wRkJRVUU3UVVGQlFTd3dRMEYzUkVrN1FVRkRiRUlzWlVGQlR5eExRVUZMTEdOQlFWbzdRVUZEUkR0QlFURkVaVHRCUVVGQk8wRkJRVUVzY1VOQk5FUkVPMEZCUVVFN08wRkJRMklzV1VGQlRTeGpRVUZqTEZOQlFWTXNZVUZCVkN4clFrRkJjME1zUzBGQlN5eEpRVUV6UXl4UlFVRndRanM3UVVGRlFTdzJRa0ZCVXl4TFFVRkxMRmRCUVV3c1JVRkJWQ3hGUVVFMlFpeFZRVUZETEZGQlFVUXNSVUZCWXp0QlFVTjZReXhqUVVGSkxGTkJRVk1zWjBKQlFWVXNUMEZCVml4RlFVRnRRaXhSUVVGdVFpeEZRVUUyUWl4UlFVRTNRaXhGUVVGMVF6dEJRVU5zUkN4blFrRkJTU3hSUVVGS0xFVkJRV003UVVGRFdpeHZRa0ZCVFN4SlFVRk9MRU5CUVZjc1VVRkJXQ3hGUVVGeFFpeFBRVUZ5UWl4RFFVRTJRaXhWUVVGRExFVkJRVVFzUlVGQlVUdEJRVU51UXl4dFFrRkJSeXhUUVVGSUxFZEJRV1VzVVVGQlpqdEJRVU5FTEdWQlJrUTdRVUZIUkN4aFFVcEVMRTFCU1U4N1FVRkRUQ3h6UWtGQlVTeFRRVUZTTEVkQlFXOUNMRkZCUVhCQ08wRkJRMFE3UVVGRFJpeFhRVkpFT3p0QlFWVkJMR05CUVVrc1RVRkJTeXhwUWtGQlRDeEZRVUZLTEVWQlFUaENPMEZCUXpWQ0xIRkNRVUZUTEUxQlFVc3NhVUpCUVV3c1JVRkJWRHRCUVVORU96dEJRVVZFTEdsQ1FVRlBMRmRCUVZBc1JVRkJiMElzVVVGQmNFSXNSVUZCT0VJc1dVRkJXU3huUWtGQldpeERRVUUyUWl4cFFrRkJOMElzUTBGQk9VSTdRVUZEUkN4VFFXaENSQ3hGUVdkQ1J5eEpRV2hDU0R0QlFXbENSRHM3UVVGRlJEczdRVUZGUVRzN096czdRVUZ3Um1kQ08wRkJRVUU3UVVGQlFTeDFRMEYzUmtNc1ZVRjRSa1FzUlVGM1JtRTdRVUZETTBJc1lVRkJTeXhOUVVGTUxFTkJRVmtzU1VGQldpeERRVUZwUWl4VlFVRnFRanRCUVVORU96dEJRVVZFT3pzN096czdRVUUxUm1kQ08wRkJRVUU3UVVGQlFTeHJRMEZwUjBvc1dVRnFSMGtzUlVGcFIxVTdRVUZEZUVJc1dVRkJTU3hQUVVGUExGbEJRVkFzUzBGQmQwSXNVVUZCTlVJc1JVRkJjME03UVVGRGNFTXNaMEpCUVUwc1NVRkJTU3hMUVVGS0xFTkJRVlVzYVVSQlFXZEVMRmxCUVdoRUxIbERRVUZuUkN4WlFVRm9SQ3hMUVVFclJDeFhRVUY2UlN4RFFVRk9PMEZCUTBRN1FVRkRSQ3hoUVVGTExGbEJRVXdzUjBGQmIwSXNXVUZCY0VJN1FVRkRSRHM3UVVGRlJEczdPenM3UVVGNFIyZENPMEZCUVVFN1FVRkJRU3d3UTBFMFIwa3NZMEUxUjBvc1JVRTBSMjlDTzBGQlEyeERMRmxCUVVrc1QwRkJUeXhqUVVGUUxFdEJRVEJDTEZWQlFUbENMRVZCUVRCRE8wRkJRM2hETEdkQ1FVRk5MRWxCUVVrc1MwRkJTaXhEUVVGVkxEaEVRVUUyUkN4alFVRTNSQ3g1UTBGQk5rUXNZMEZCTjBRc1MwRkJPRVVzVjBGQmVFWXNRMEZCVGp0QlFVTkVPMEZCUTBRc1lVRkJTeXhqUVVGTUxFZEJRWE5DTEdOQlFYUkNPMEZCUTBRN08wRkJSVVE3T3pzN096dEJRVzVJWjBJN1FVRkJRVHRCUVVGQkxHOURRWGRJUml4VFFYaElSU3hGUVhkSU1rSTdRVUZCUVRzN1FVRkJRU3haUVVGc1FpeFhRVUZyUWl4MVJVRkJTaXhGUVVGSk96dEJRVU42UXl4WlFVRk5MSGRDUVVGelFpeFZRVUZWTEUxQlFWWXNRMEZCYVVJc1EwRkJha0lzUlVGQmIwSXNWMEZCY0VJc1JVRkJkRUlzUjBGQk1FUXNWVUZCVlN4TFFVRldMRU5CUVdkQ0xFTkJRV2hDTEVOQlFXaEZPenRCUVVWQkxHRkJRVXNzVFVGQlRDeERRVUZaTEU5QlFWb3NRMEZCYjBJc1ZVRkJReXhMUVVGRUxFVkJRVmM3UVVGRE4wSXNZMEZCVFN4aFFVRmhMRTFCUVUwc1UwRkJUaXhEUVVGdVFqdEJRVU5CTEdOQlFVMHNhMEpCUVd0Q0xFMUJRVTBzWTBGQlRpeERRVUY0UWp0QlFVTkJMR05CUVVrc1QwRkJUeXhWUVVGUUxFdEJRWE5DTEZWQlFURkNMRVZCUVhORE8wRkJRM0JETEhWQ1FVRlhMRXRCUVZnc1UwRkJkVUlzVjBGQmRrSTdRVUZEUkRzN1FVRkZSRHRCUVVOQkxHTkJRVWtzVDBGQlR5eGxRVUZRTEV0QlFUSkNMRlZCUVM5Q0xFVkJRVEpETzBGQlEzcERMRFJDUVVGblFpeExRVUZvUWl4VFFVRTBRaXhYUVVFMVFqdEJRVU5FTzBGQlEwWXNVMEZZUkRzN1FVRmhRU3g1UTBGQmEwSXNVMEZCYkVJc1JVRkJOa0lzUzBGQlN5eEpRVUZzUXl4RlFVRjNReXhYUVVGNFF6dEJRVU5FTzBGQmVrbGxPMEZCUVVFN1FVRkJRU3d3UWtGblEwczdRVUZEYmtJc1pVRkJWU3hKUVVGV0xGTkJRV3RDTEU5QlFXeENPMEZCUTBRN1FVRnNRMlU3TzBGQlFVRTdRVUZCUVRzN1FVRTBTV3hDTEZOQlFVOHNTVUZCVUR0QlFVTkVMRU5CTjBsWkxFVkJRV0k3TzJ0Q1FTdEpaU3hKT3pzN096czdPenM3UVVOc1NtWTdPenM3UVVGRFFUczdPenRCUVVOQk96czdPMEZCUjBFN096czdRVUZEUVRzN096dEJRVU5CT3pzN08wRkJRMEU3T3pzN1FVRkRRVHM3T3p0QlFVTkJPenM3TzBGQlEwRTdPenM3UVVGRFFUczdPenRCUVVOQk96czdPMEZCUTBFN096czdRVUZEUVRzN096czdPMEZCY2tKQk96czdPenM3UVVGMVFrRXNTVUZCVFN4TlFVRk5MRVZCUVZvN08wRkJSVUU3T3pzN096czdRVUZtUVR0QlFXOUNRU3hKUVVGSkxFMUJRVW9zUjBGQllUdEJRVU5ZTzBGQlEwRXNVMEZCVHpzN1FVRkhWRHM3T3pzN1FVRk1ZU3hEUVVGaUxFTkJWVUVzU1VGQlNTeExRVUZLTEVkQlFWa3NWVUZCUXl4UFFVRkVMRVZCUVdFN1FVRkRka0lzVFVGQlNTeFBRVUZQTEVsQlFVa3NUVUZCV0N4TFFVRnpRaXhYUVVFeFFpeEZRVUYxUXp0QlFVTnlReXhSUVVGSkxFMUJRVW9zUjBGQllTeG5Ra0ZCVFN4aFFVRk9MRU5CUVc5Q0xFOUJRWEJDTEVOQlFXSTdRVUZEUkR0QlFVTkVMRk5CUVU4c1NVRkJTU3hOUVVGWU8wRkJRMFFzUTBGTVJEczdRVUZQUVRzN096czdRVUZMUVN4SlFVRkpMRWxCUVVvc1IwRkJWeXhsUVVGTExHRkJRV2hDT3p0QlFVVkJPenM3T3p0QlFVdEJMRWxCUVVrc1QwRkJTaXhIUVVGakxHdENRVUZSTEdGQlFYUkNPenRCUVVWQk96czdPenRCUVV0QkxFbEJRVWtzV1VGQlNpeEhRVUZ0UWl4MVFrRkJZU3hoUVVGb1F6czdRVUZGUVRzN096czdRVUZMUVN4SlFVRkpMRTFCUVVvc1IwRkJZU3hwUWtGQlR5eGhRVUZ3UWpzN1FVRkZRU3hYUVVGWExGbEJRVTA3UVVGRFppeHRRa0ZCVHl4aFFVRlFMRU5CUVhGQ08wRkJRMjVDTEdGQlFWTXNTVUZFVlR0QlFVVnVRaXhYUVVGUExGRkJSbGs3UVVGSGJrSXNZVUZCVXl4SlFVaFZPMEZCU1c1Q0xHZENRVUZaTzBGQlNrOHNSMEZCY2tJc1JVRkxSeXhKUVV4SU8wRkJUVVFzUTBGUVJDeEZRVTlITEVsQlVFZzdPMEZCVTBFN096czdPMEZCUzBFc1NVRkJTU3hSUVVGS0xFZEJRV1VzYlVKQlFWTXNZVUZCZUVJN08wRkJSVUU3T3pzN08wRkJTMEVzU1VGQlNTeFRRVUZLTEVkQlFXZENMRzlDUVVGVkxHRkJRVEZDT3p0QlFVZEJPenM3T3p0QlFVdEJMRWxCUVVrc1IwRkJTaXhIUVVGVkxHTkJRVWtzWVVGQlpEczdRVUZGUVRzN096czdRVUZMUVN4SlFVRkpMRkZCUVVvc1IwRkJaU3h0UWtGQlV5eGhRVUY0UWpzN1FVRkZRVHM3T3pzN1FVRkxRU3hKUVVGSkxFMUJRVW9zUjBGQllTeHBRa0ZCVHl4aFFVRndRanM3UVVGRlFUczdPenM3UVVGTFFTeEpRVUZKTEZOQlFVb3NSMEZCWjBJc2IwSkJRVlVzWVVGQk1VSTdPMEZCUlVFN096czdPMEZCUzBFc1NVRkJTU3hSUVVGS0xFZEJRV1VzVlVGQlF5eFBRVUZFTEVWQlFXRTdRVUZETVVJc1RVRkJTU3hSUVVGUkxFMUJRVm9zUlVGQmIwSTdRVUZEYkVJN1FVRkRRU3hYUVVGUExHMUNRVUZUTEdGQlFXaENPMEZCUTBRc1IwRklSQ3hOUVVkUE8wRkJRMHc3UVVGRFFTeFhRVUZQTEdsQ1FVRmxMR0ZCUVhSQ08wRkJRMFE3UVVGRFJpeERRVkpFT3p0QlFWVkJPMEZCUTBFc1QwRkJUeXhOUVVGUUxFZEJRV2RDTEVkQlFXaENPenRyUWtGRlpTeEhJaXdpWm1sc1pTSTZJbWRsYm1WeVlYUmxaQzVxY3lJc0luTnZkWEpqWlZKdmIzUWlPaUlpTENKemIzVnlZMlZ6UTI5dWRHVnVkQ0k2V3lJb1puVnVZM1JwYjI0Z1pTaDBMRzRzY2lsN1puVnVZM1JwYjI0Z2N5aHZMSFVwZTJsbUtDRnVXMjlkS1h0cFppZ2hkRnR2WFNsN2RtRnlJR0U5ZEhsd1pXOW1JSEpsY1hWcGNtVTlQVndpWm5WdVkzUnBiMjVjSWlZbWNtVnhkV2x5WlR0cFppZ2hkU1ltWVNseVpYUjFjbTRnWVNodkxDRXdLVHRwWmlocEtYSmxkSFZ5YmlCcEtHOHNJVEFwTzNaaGNpQm1QVzVsZHlCRmNuSnZjaWhjSWtOaGJtNXZkQ0JtYVc1a0lHMXZaSFZzWlNBblhDSXJieXRjSWlkY0lpazdkR2h5YjNjZ1ppNWpiMlJsUFZ3aVRVOUVWVXhGWDA1UFZGOUdUMVZPUkZ3aUxHWjlkbUZ5SUd3OWJsdHZYVDE3Wlhod2IzSjBjenA3ZlgwN2RGdHZYVnN3WFM1allXeHNLR3d1Wlhod2IzSjBjeXhtZFc1amRHbHZiaWhsS1h0MllYSWdiajEwVzI5ZFd6RmRXMlZkTzNKbGRIVnliaUJ6S0c0L2JqcGxLWDBzYkN4c0xtVjRjRzl5ZEhNc1pTeDBMRzRzY2lsOWNtVjBkWEp1SUc1YmIxMHVaWGh3YjNKMGMzMTJZWElnYVQxMGVYQmxiMllnY21WeGRXbHlaVDA5WENKbWRXNWpkR2x2Ymx3aUppWnlaWEYxYVhKbE8yWnZjaWgyWVhJZ2J6MHdPMjg4Y2k1c1pXNW5kR2c3YnlzcktYTW9jbHR2WFNrN2NtVjBkWEp1SUhOOUtTSXNJbVY0Y0c5eWRDQm1kVzVqZEdsdmJpQmthWE53WVhSamFGZHBia1J2WTBWMlpXNTBLR1YyWlc1MFRtRnRaU3dnYlc5a2RXeGxUbUZ0WlN3Z1pHVjBZV2xzSUQwZ2UzMHBJSHRjYmlBZ1kyOXVjM1FnWm5Wc2JFVjJaVzUwVG1GdFpTQTlJR0FrZTJWMlpXNTBUbUZ0WlgwdWNHZ3VKSHR0YjJSMWJHVk9ZVzFsZldCY2JpQWdkMmx1Wkc5M0xtUnBjM0JoZEdOb1JYWmxiblFvYm1WM0lFTjFjM1J2YlVWMlpXNTBLR1oxYkd4RmRtVnVkRTVoYldVc0lIc2daR1YwWVdsc0lIMHBLVnh1SUNCa2IyTjFiV1Z1ZEM1a2FYTndZWFJqYUVWMlpXNTBLRzVsZHlCRGRYTjBiMjFGZG1WdWRDaG1kV3hzUlhabGJuUk9ZVzFsTENCN0lHUmxkR0ZwYkNCOUtTbGNibjFjYmx4dVpYaHdiM0owSUdaMWJtTjBhVzl1SUdScGMzQmhkR05vUld4bGJXVnVkRVYyWlc1MEtHUnZiVVZzWlcxbGJuUXNJR1YyWlc1MFRtRnRaU3dnYlc5a2RXeGxUbUZ0WlN3Z1pHVjBZV2xzSUQwZ2UzMHBJSHRjYmlBZ1kyOXVjM1FnWm5Wc2JFVjJaVzUwVG1GdFpTQTlJR0FrZTJWMlpXNTBUbUZ0WlgwdWNHZ3VKSHR0YjJSMWJHVk9ZVzFsZldCY2JpQWdaRzl0Uld4bGJXVnVkQzVrYVhOd1lYUmphRVYyWlc1MEtHNWxkeUJEZFhOMGIyMUZkbVZ1ZENobWRXeHNSWFpsYm5ST1lXMWxMQ0I3SUdSbGRHRnBiQ0I5S1NsY2JuMWNibHh1Wlhod2IzSjBJR1oxYm1OMGFXOXVJR1JwYzNCaGRHTm9VR0ZuWlVWMlpXNTBLR1YyWlc1MFRtRnRaU3dnY0dGblpVNWhiV1VzSUdSbGRHRnBiQ0E5SUh0OUtTQjdYRzRnSUdOdmJuTjBJR1oxYkd4RmRtVnVkRTVoYldVZ1BTQmdKSHR3WVdkbFRtRnRaWDB1Skh0bGRtVnVkRTVoYldWOVlGeHVJQ0IzYVc1a2IzY3VaR2x6Y0dGMFkyaEZkbVZ1ZENodVpYY2dRM1Z6ZEc5dFJYWmxiblFvWm5Wc2JFVjJaVzUwVG1GdFpTd2dleUJrWlhSaGFXd2dmU2twWEc0Z0lHUnZZM1Z0Wlc1MExtUnBjM0JoZEdOb1JYWmxiblFvYm1WM0lFTjFjM1J2YlVWMlpXNTBLR1oxYkd4RmRtVnVkRTVoYldVc0lIc2daR1YwWVdsc0lIMHBLVnh1ZlZ4dUlpd2lMeThnUUhSdlpHOGdhMlZsY0NBL1hHNXBaaUFvZEhsd1pXOW1JSGRwYm1SdmR5QWhQVDBnSjNWdVpHVm1hVzVsWkNjcElIdGNiaUFnZDJsdVpHOTNMbUZrWkVWMlpXNTBUR2x6ZEdWdVpYSW9KMlZ5Y205eUp5d2dLQ2tnUFQ0Z2UxeHVJQ0FnSUdOdmJuTnZiR1V1WlhKeWIzSW9KMEZ1SUdWeWNtOXlJR2hoY3lCdlkyTjFjbVZrSVNCWmIzVWdZMkZ1SUhCbGJpQmhiaUJwYzNOMVpTQm9aWEpsT2lCb2RIUndjem92TDJkcGRHaDFZaTVqYjIwdmNYVmhjbXN0WkdWMkwxQm9iMjV2YmkxR2NtRnRaWGR2Y21zdmFYTnpkV1Z6SnlsY2JpQWdmU2xjYm4xY2JseHVMeThnVlhObElHRjJZV2xzWVdKc1pTQmxkbVZ1ZEhOY2JteGxkQ0JoZG1GcGJHRmliR1ZGZG1WdWRITWdQU0JiSjIxdmRYTmxaRzkzYmljc0lDZHRiM1Z6WlcxdmRtVW5MQ0FuYlc5MWMyVjFjQ2RkWEc1c1pYUWdkRzkxWTJoVFkzSmxaVzRnUFNCbVlXeHpaVnh1WEc1cFppQW9kSGx3Wlc5bUlIZHBibVJ2ZHlBaFBUMGdKM1Z1WkdWbWFXNWxaQ2NwSUh0Y2JpQWdhV1lnS0NnbmIyNTBiM1ZqYUhOMFlYSjBKeUJwYmlCM2FXNWtiM2NwSUh4OElIZHBibVJ2ZHk1RWIyTjFiV1Z1ZEZSdmRXTm9JQ1ltSUdSdlkzVnRaVzUwSUdsdWMzUmhibU5sYjJZZ1JHOWpkVzFsYm5SVWIzVmphQ2tnZTF4dUlDQWdJSFJ2ZFdOb1UyTnlaV1Z1SUQwZ2RISjFaVnh1SUNBZ0lHRjJZV2xzWVdKc1pVVjJaVzUwY3lBOUlGc25kRzkxWTJoemRHRnlkQ2NzSUNkMGIzVmphRzF2ZG1VbkxDQW5kRzkxWTJobGJtUW5MQ0FuZEc5MVkyaGpZVzVqWld3blhWeHVJQ0I5WEc1Y2JpQWdhV1lnS0hkcGJtUnZkeTV1WVhacFoyRjBiM0l1Y0c5cGJuUmxja1Z1WVdKc1pXUXBJSHRjYmlBZ0lDQmhkbUZwYkdGaWJHVkZkbVZ1ZEhNZ1BTQmJKM0J2YVc1MFpYSmtiM2R1Snl3Z0ozQnZhVzUwWlhKdGIzWmxKeXdnSjNCdmFXNTBaWEoxY0Njc0lDZHdiMmx1ZEdWeVkyRnVZMlZzSjExY2JpQWdmU0JsYkhObElHbG1JQ2gzYVc1a2IzY3VibUYyYVdkaGRHOXlMbTF6VUc5cGJuUmxja1Z1WVdKc1pXUXBJSHRjYmlBZ0lDQmhkbUZwYkdGaWJHVkZkbVZ1ZEhNZ1BTQmJKMDFUVUc5cGJuUmxja1J2ZDI0bkxDQW5UVk5RYjJsdWRHVnlUVzkyWlNjc0lDZE5VMUJ2YVc1MFpYSlZjQ2NzSUNkTlUxQnZhVzUwWlhKRFlXNWpaV3duWFZ4dUlDQjlYRzU5WEc1Y2JtTnZibk4wSUdWc0lEMGdaRzlqZFcxbGJuUXVZM0psWVhSbFJXeGxiV1Z1ZENnblpHbDJKeWxjYm1OdmJuTjBJSFJ5WVc1emFYUnBiMjV6SUQwZ1cxeHVJQ0I3SUc1aGJXVTZJQ2QwY21GdWMybDBhVzl1Snl3Z2MzUmhjblE2SUNkMGNtRnVjMmwwYVc5dWMzUmhjblFuTENCbGJtUTZJQ2QwY21GdWMybDBhVzl1Wlc1a0p5QjlMRnh1SUNCN0lHNWhiV1U2SUNkTmIzcFVjbUZ1YzJsMGFXOXVKeXdnYzNSaGNuUTZJQ2QwY21GdWMybDBhVzl1YzNSaGNuUW5MQ0JsYm1RNklDZDBjbUZ1YzJsMGFXOXVaVzVrSnlCOUxGeHVJQ0I3SUc1aGJXVTZJQ2R0YzFSeVlXNXphWFJwYjI0bkxDQnpkR0Z5ZERvZ0oyMXpWSEpoYm5OcGRHbHZibE4wWVhKMEp5d2daVzVrT2lBbmJYTlVjbUZ1YzJsMGFXOXVSVzVrSnlCOUxGeHVJQ0I3SUc1aGJXVTZJQ2RYWldKcmFYUlVjbUZ1YzJsMGFXOXVKeXdnYzNSaGNuUTZJQ2QzWldKcmFYUlVjbUZ1YzJsMGFXOXVVM1JoY25RbkxDQmxibVE2SUNkM1pXSnJhWFJVY21GdWMybDBhVzl1Ulc1a0p5QjlMRnh1WFZ4dVkyOXVjM1FnWVc1cGJXRjBhVzl1Y3lBOUlGdGNiaUFnZXlCdVlXMWxPaUFuWVc1cGJXRjBhVzl1Snl3Z2MzUmhjblE2SUNkaGJtbHRZWFJwYjI1emRHRnlkQ2NzSUdWdVpEb2dKMkZ1YVcxaGRHbHZibVZ1WkNjZ2ZTeGNiaUFnZXlCdVlXMWxPaUFuVFc5NlFXNXBiV0YwYVc5dUp5d2djM1JoY25RNklDZGhibWx0WVhScGIyNXpkR0Z5ZENjc0lHVnVaRG9nSjJGdWFXMWhkR2x2Ym1WdVpDY2dmU3hjYmlBZ2V5QnVZVzFsT2lBbmJYTkJibWx0WVhScGIyNG5MQ0J6ZEdGeWREb2dKMjF6UVc1cGJXRjBhVzl1VTNSaGNuUW5MQ0JsYm1RNklDZHRjMEZ1YVcxaGRHbHZia1Z1WkNjZ2ZTeGNiaUFnZXlCdVlXMWxPaUFuVjJWaWEybDBRVzVwYldGMGFXOXVKeXdnYzNSaGNuUTZJQ2QzWldKcmFYUkJibWx0WVhScGIyNVRkR0Z5ZENjc0lHVnVaRG9nSjNkbFltdHBkRUZ1YVcxaGRHbHZia1Z1WkNjZ2ZTeGNibDFjYmx4dVkyOXVjM1FnZEhKaGJuTnBkR2x2YmxOMFlYSjBJRDBnZEhKaGJuTnBkR2x2Ym5NdVptbHVaQ2gwSUQwK0lHVnNMbk4wZVd4bFczUXVibUZ0WlYwZ0lUMDlJSFZ1WkdWbWFXNWxaQ2t1YzNSaGNuUmNibU52Ym5OMElIUnlZVzV6YVhScGIyNUZibVFnUFNCMGNtRnVjMmwwYVc5dWN5NW1hVzVrS0hRZ1BUNGdaV3d1YzNSNWJHVmJkQzV1WVcxbFhTQWhQVDBnZFc1a1pXWnBibVZrS1M1bGJtUmNibU52Ym5OMElHRnVhVzFoZEdsdmJsTjBZWEowSUQwZ1lXNXBiV0YwYVc5dWN5NW1hVzVrS0hRZ1BUNGdaV3d1YzNSNWJHVmJkQzV1WVcxbFhTQWhQVDBnZFc1a1pXWnBibVZrS1M1emRHRnlkRnh1WTI5dWMzUWdZVzVwYldGMGFXOXVSVzVrSUQwZ1lXNXBiV0YwYVc5dWN5NW1hVzVrS0hRZ1BUNGdaV3d1YzNSNWJHVmJkQzV1WVcxbFhTQWhQVDBnZFc1a1pXWnBibVZrS1M1bGJtUmNibHh1Wlhod2IzSjBJR1JsWm1GMWJIUWdlMXh1SUNBdkx5QjBiM1ZqYUNCelkzSmxaVzRnYzNWd2NHOXlkRnh1SUNCVVQxVkRTRjlUUTFKRlJVNDZJSFJ2ZFdOb1UyTnlaV1Z1TEZ4dVhHNGdJQzh2SUc1bGRIZHZjbXRjYmlBZ1RrVlVWMDlTUzE5UFRreEpUa1U2SUNkdmJteHBibVVuTEZ4dUlDQk9SVlJYVDFKTFgwOUdSa3hKVGtVNklDZHZabVpzYVc1bEp5eGNiaUFnVGtWVVYwOVNTMTlTUlVOUFRrNUZRMVJKVGtjNklDZHlaV052Ym01bFkzUnBibWNuTEZ4dUlDQk9SVlJYVDFKTFgxSkZRMDlPVGtWRFZFbE9SMTlUVlVORFJWTlRPaUFuY21WamIyNXVaV04wTG5OMVkyTmxjM01uTEZ4dUlDQk9SVlJYVDFKTFgxSkZRMDlPVGtWRFZFbE9SMTlHUVVsTVZWSkZPaUFuY21WamIyNXVaV04wTG1aaGFXeDFjbVVuTEZ4dVhHNGdJQzh2SUhWelpYSWdhVzUwWlhKbVlXTmxJSE4wWVhSbGMxeHVJQ0JUU0U5WE9pQW5jMmh2ZHljc1hHNGdJRk5JVDFkT09pQW5jMmh2ZDI0bkxGeHVJQ0JJU1VSRk9pQW5hR2xrWlNjc1hHNGdJRWhKUkVSRlRqb2dKMmhwWkdSbGJpY3NYRzVjYmlBZ0x5OGdhR0Z6YUZ4dUlDQklRVk5JT2lBbmFHRnphQ2NzWEc1Y2JpQWdMeThnZEc5MVkyZ3NJRzF2ZFhObElHRnVaQ0J3YjJsdWRHVnlJR1YyWlc1MGN5QndiMng1Wm1sc2JGeHVJQ0JUVkVGU1ZEb2dZWFpoYVd4aFlteGxSWFpsYm5Seld6QmRMRnh1SUNCTlQxWkZPaUJoZG1GcGJHRmliR1ZGZG1WdWRITmJNVjBzWEc0Z0lFVk9SRG9nWVhaaGFXeGhZbXhsUlhabGJuUnpXekpkTEZ4dUlDQkRRVTVEUlV3NklIUjVjR1Z2WmlCaGRtRnBiR0ZpYkdWRmRtVnVkSE5iTTEwZ1BUMDlJQ2QxYm1SbFptbHVaV1FuSUQ4Z2JuVnNiQ0E2SUdGMllXbHNZV0pzWlVWMlpXNTBjMXN6WFN4Y2JseHVJQ0F2THlCMGNtRnVjMmwwYVc5dWMxeHVJQ0JVVWtGT1UwbFVTVTlPWDFOVVFWSlVPaUIwY21GdWMybDBhVzl1VTNSaGNuUXNYRzRnSUZSU1FVNVRTVlJKVDA1ZlJVNUVPaUIwY21GdWMybDBhVzl1Ulc1a0xGeHVYRzRnSUM4dklHRnVhVzFoZEdsdmJuTmNiaUFnUVU1SlRVRlVTVTlPWDFOVVFWSlVPaUJoYm1sdFlYUnBiMjVUZEdGeWRDeGNiaUFnUVU1SlRVRlVTVTlPWDBWT1JEb2dZVzVwYldGMGFXOXVSVzVrTEZ4dVhHNGdJQzh2SUdSeWIzQmtiM2R1WEc0Z0lFbFVSVTFmVTBWTVJVTlVSVVE2SUNkcGRHVnRVMlZzWldOMFpXUW5MRnh1ZlNJc0lpOHFLbHh1SUNvZ0xTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMWNiaUFxSUV4cFkyVnVjMlZrSUhWdVpHVnlJRTFKVkNBb2FIUjBjSE02THk5bmFYUm9kV0l1WTI5dEwzRjFZWEpyTFdSbGRpOVFhRzl1YjI0dFJuSmhiV1YzYjNKckwySnNiMkl2YldGemRHVnlMMHhKUTBWT1UwVXBYRzRnS2lBdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExWeHVJQ292WEc1Y2JtbHRjRzl5ZENCRmRtVnVkQ0JtY205dElDY3VMaTh1TGk5amIyMXRiMjR2WlhabGJuUnpKMXh1YVcxd2IzSjBJRU52YlhCdmJtVnVkQ0JtY205dElDY3VMaTh1TGk5amIyMXdiMjVsYm5SekwyTnZiWEJ2Ym1WdWRDZGNibHh1WTI5dWMzUWdUbVYwZDI5eWF5QTlJQ2dvS1NBOVBpQjdYRzRnSUM4cUtseHVJQ0FnS2lBdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMxY2JpQWdJQ29nUTI5dWMzUmhiblJ6WEc0Z0lDQXFJQzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMVnh1SUNBZ0tpOWNibHh1SUNCamIyNXpkQ0JPUVUxRklEMGdKMjVsZEhkdmNtc25YRzRnSUdOdmJuTjBJRlpGVWxOSlQwNGdQU0FuTWk0d0xqQW5YRzRnSUdOdmJuTjBJRVJGUmtGVlRGUmZVRkpQVUVWU1ZFbEZVeUE5SUh0Y2JpQWdJQ0JsYkdWdFpXNTBPaUJ1ZFd4c0xGeHVJQ0FnSUdsdWFYUnBZV3hFWld4aGVUb2dNekF3TUN4Y2JpQWdJQ0JrWld4aGVUb2dOVEF3TUN4Y2JpQWdmVnh1SUNCamIyNXpkQ0JFUVZSQlgwRlVWRkpUWDFCU1QxQkZVbFJKUlZNZ1BTQmJYRzRnSUYxY2JseHVJQ0F2S2lwY2JpQWdJQ29nTFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0WEc0Z0lDQXFJRU5zWVhOeklFUmxabWx1YVhScGIyNWNiaUFnSUNvZ0xTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdFhHNGdJQ0FxTDF4dVhHNGdJR05zWVhOeklFNWxkSGR2Y21zZ1pYaDBaVzVrY3lCRGIyMXdiMjVsYm5RZ2UxeHVJQ0FnSUM4cUtseHVJQ0FnSUNBcUlFTnlaV0YwWlhNZ1lXNGdhVzV6ZEdGdVkyVWdiMllnVG1WMGQyOXlheTVjYmlBZ0lDQWdLaUJBY0dGeVlXMGdlM3Q5ZlNCYmIzQjBhVzl1Y3oxN2ZWMWNiaUFnSUNBZ0tpOWNiaUFnSUNCamIyNXpkSEoxWTNSdmNpaHZjSFJwYjI1eklEMGdlMzBwSUh0Y2JpQWdJQ0FnSUhOMWNHVnlLRTVCVFVVc0lGWkZVbE5KVDA0c0lFUkZSa0ZWVEZSZlVGSlBVRVZTVkVsRlV5d2diM0IwYVc5dWN5d2dSRUZVUVY5QlZGUlNVMTlRVWs5UVJWSlVTVVZUTENCMGNuVmxMQ0JtWVd4elpTbGNibHh1SUNBZ0lDQWdkR2hwY3k1NGFISWdQU0J1ZFd4c1hHNGdJQ0FnSUNCMGFHbHpMbU5vWldOclNXNTBaWEoyWVd3Z1BTQnVkV3hzWEc1Y2JpQWdJQ0FnSUhSb2FYTXVjMlYwVTNSaGRIVnpLRVYyWlc1MExrNUZWRmRQVWt0ZlQwNU1TVTVGS1Z4dVhHNGdJQ0FnSUNCelpYUlVhVzFsYjNWMEtDZ3BJRDArSUh0Y2JpQWdJQ0FnSUNBZ2RHaHBjeTV6ZEdGeWRFTm9aV05yS0NsY2JpQWdJQ0FnSUgwc0lIUm9hWE11YjNCMGFXOXVjeTVwYm1sMGFXRnNSR1ZzWVhrcFhHNGdJQ0FnZlZ4dVhHNGdJQ0FnWjJWMFUzUmhkSFZ6S0NrZ2UxeHVJQ0FnSUNBZ2NtVjBkWEp1SUhSb2FYTXVjM1JoZEhWelhHNGdJQ0FnZlZ4dVhHNGdJQ0FnYzJWMFUzUmhkSFZ6S0hOMFlYUjFjeWtnZTF4dUlDQWdJQ0FnZEdocGN5NXpkR0YwZFhNZ1BTQnpkR0YwZFhOY2JpQWdJQ0I5WEc1Y2JpQWdJQ0J6ZEdGeWRGSmxjWFZsYzNRb0tTQjdYRzRnSUNBZ0lDQjBhR2x6TG5ob2NpQTlJRzVsZHlCWVRVeElkSFJ3VW1WeGRXVnpkQ2dwWEc0Z0lDQWdJQ0IwYUdsekxuaG9jaTV2Wm1ac2FXNWxJRDBnWm1Gc2MyVmNibHh1SUNBZ0lDQWdZMjl1YzNRZ2RYSnNJRDBnWUM5bVlYWnBZMjl1TG1samJ6OWZQU1I3Ym1WM0lFUmhkR1VvS1M1blpYUlVhVzFsS0NsOVlGeHVYRzRnSUNBZ0lDQjBhR2x6TG5SeWFXZG5aWEpGZG1WdWRDaEZkbVZ1ZEM1T1JWUlhUMUpMWDFKRlEwOU9Ua1ZEVkVsT1J5d2dleUJrWVhSbE9pQnVaWGNnUkdGMFpTZ3BJSDBzSUdaaGJITmxLU0FnSUNBZ0lDQWdJQ0FnSUZ4dVhHNGdJQ0FnSUNCMGFHbHpMbmhvY2k1dmNHVnVLQ2RJUlVGRUp5d2dkWEpzTENCMGNuVmxLVnh1WEc0Z0lDQWdJQ0IwYUdsekxuaG9jaTUwYVcxbGIzVjBJRDBnZEdocGN5NXZjSFJwYjI1ekxtUmxiR0Y1SUMwZ01WeHVJQ0FnSUNBZ2RHaHBjeTU0YUhJdWIyNTBhVzFsYjNWMElEMGdLQ2tnUFQ0Z2UxeHVJQ0FnSUNBZ0lDQjBhR2x6TG5ob2NpNWhZbTl5ZENncFhHNGdJQ0FnSUNBZ0lIUm9hWE11ZUdoeUlEMGdiblZzYkZ4dUlDQWdJQ0FnZlZ4dVhHNGdJQ0FnSUNCMGFHbHpMbmhvY2k1dmJteHZZV1FnUFNBb0tTQTlQaUI3WEc0Z0lDQWdJQ0FnSUhSb2FYTXViMjVWY0NncFhHNGdJQ0FnSUNCOVhHNGdJQ0FnSUNCMGFHbHpMbmhvY2k1dmJtVnljbTl5SUQwZ0tDa2dQVDRnZTF4dUlDQWdJQ0FnSUNCMGFHbHpMbTl1Ukc5M2JpZ3BYRzRnSUNBZ0lDQjlYRzVjYmlBZ0lDQWdJSFJ5ZVNCN1hHNGdJQ0FnSUNBZ0lIUm9hWE11ZUdoeUxuTmxibVFvS1Z4dUlDQWdJQ0FnZlNCallYUmphQ0FvWlNrZ2UxeHVJQ0FnSUNBZ0lDQjBhR2x6TG05dVJHOTNiaWdwWEc0Z0lDQWdJQ0I5WEc0Z0lDQWdmVnh1WEc0Z0lDQWdiMjVWY0NncElIdGNiaUFnSUNBZ0lIUm9hWE11ZEhKcFoyZGxja1YyWlc1MEtFVjJaVzUwTGs1RlZGZFBVa3RmVWtWRFQwNU9SVU5VU1U1SFgxTlZRME5GVTFNc0lIc2daR0YwWlRvZ2JtVjNJRVJoZEdVb0tTQjlMQ0JtWVd4elpTbGNibHh1SUNBZ0lDQWdhV1lnS0hSb2FYTXVaMlYwVTNSaGRIVnpLQ2tnSVQwOUlFVjJaVzUwTGs1RlZGZFBVa3RmVDA1TVNVNUZLU0I3WEc0Z0lDQWdJQ0FnSUhSb2FYTXVkSEpwWjJkbGNrVjJaVzUwS0VWMlpXNTBMazVGVkZkUFVrdGZUMDVNU1U1RkxDQjdJR1JoZEdVNklHNWxkeUJFWVhSbEtDa2dmU3dnWm1Gc2MyVXBYRzRnSUNBZ0lDQjlYRzVjYmlBZ0lDQWdJSFJvYVhNdWMyVjBVM1JoZEhWektFVjJaVzUwTGs1RlZGZFBVa3RmVDA1TVNVNUZLU0FnSUNBZ0lGeHVJQ0FnSUgxY2JseHVJQ0FnSUc5dVJHOTNiaWdwSUh0Y2JpQWdJQ0FnSUhSb2FYTXVkSEpwWjJkbGNrVjJaVzUwS0VWMlpXNTBMazVGVkZkUFVrdGZVa1ZEVDA1T1JVTlVTVTVIWDBaQlNVeFZVa1VzSUhzZ1pHRjBaVG9nYm1WM0lFUmhkR1VvS1NCOUxDQm1ZV3h6WlNsY2JseHVJQ0FnSUNBZ2FXWWdLSFJvYVhNdVoyVjBVM1JoZEhWektDa2dJVDA5SUVWMlpXNTBMazVGVkZkUFVrdGZUMFpHVEVsT1JTa2dlMXh1SUNBZ0lDQWdJQ0IwYUdsekxuUnlhV2RuWlhKRmRtVnVkQ2hGZG1WdWRDNU9SVlJYVDFKTFgwOUdSa3hKVGtVc0lIc2daR0YwWlRvZ2JtVjNJRVJoZEdVb0tTQjlMQ0JtWVd4elpTbGNiaUFnSUNBZ0lIMWNibHh1SUNBZ0lDQWdkR2hwY3k1elpYUlRkR0YwZFhNb1JYWmxiblF1VGtWVVYwOVNTMTlQUmtaTVNVNUZLU0FnSUNBZ0lGeHVJQ0FnSUgxY2JseHVJQ0FnSUhOMFlYSjBRMmhsWTJzb0tTQjdYRzRnSUNBZ0lDQjBhR2x6TG5OMGIzQkRhR1ZqYXlncFhHNWNiaUFnSUNBZ0lIUm9hWE11YzNSaGNuUlNaWEYxWlhOMEtDa2dJQ0FnSUNCY2JseHVJQ0FnSUNBZ2RHaHBjeTVqYUdWamEwbHVkR1Z5ZG1Gc0lEMGdjMlYwU1c1MFpYSjJZV3dvS0NrZ1BUNGdlMXh1SUNBZ0lDQWdJQ0IwYUdsekxuTjBZWEowVW1WeGRXVnpkQ2dwWEc0Z0lDQWdJQ0I5TENCMGFHbHpMbTl3ZEdsdmJuTXVaR1ZzWVhrcFhHNGdJQ0FnZlZ4dVhHNGdJQ0FnYzNSdmNFTm9aV05yS0NrZ2UxeHVJQ0FnSUNBZ2FXWWdLSFJvYVhNdVkyaGxZMnRKYm5SbGNuWmhiQ0FoUFQwZ2JuVnNiQ2tnZTF4dUlDQWdJQ0FnSUNCamJHVmhja2x1ZEdWeWRtRnNLSFJvYVhNdVkyaGxZMnRKYm5SbGNuWmhiQ2xjYmlBZ0lDQWdJQ0FnZEdocGN5NWphR1ZqYTBsdWRHVnlkbUZzSUQwZ2JuVnNiRnh1SUNBZ0lDQWdmVnh1SUNBZ0lIMWNibHh1SUNBZ0lITjBZWFJwWXlCZlJFOU5TVzUwWlhKbVlXTmxLRzl3ZEdsdmJuTXBJSHRjYmlBZ0lDQWdJSEpsZEhWeWJpQnpkWEJsY2k1ZlJFOU5TVzUwWlhKbVlXTmxLRTVsZEhkdmNtc3NJRzl3ZEdsdmJuTXBYRzRnSUNBZ2ZWeHVJQ0I5WEc1Y2JpQWdjbVYwZFhKdUlFNWxkSGR2Y210Y2JuMHBLQ2xjYmx4dVpYaHdiM0owSUdSbFptRjFiSFFnVG1WMGQyOXlhMXh1SWl3aVhHNWxlSEJ2Y25RZ1puVnVZM1JwYjI0Z2JHOWhaRVpwYkdVb2RYSnNMQ0JtYml3Z2NHOXpkRVJoZEdFcElIdGNiaUFnWTI5dWMzUWdjbVZ4SUQwZ2JtVjNJRmhOVEVoMGRIQlNaWEYxWlhOMEtDbGNiaUFnYVdZZ0tISmxjUzV2ZG1WeWNtbGtaVTFwYldWVWVYQmxLU0J5WlhFdWIzWmxjbkpwWkdWTmFXMWxWSGx3WlNnbmRHVjRkQzlvZEcxc095QmphR0Z5YzJWMFBYVjBaaTA0SnlsY2JpQWdjbVZ4TG05dWNtVmhaSGx6ZEdGMFpXTm9ZVzVuWlNBOUlDZ3BJRDArSUh0Y2JpQWdJQ0JwWmlBb2NtVnhMbkpsWVdSNVUzUmhkR1VnUFQwOUlEUWdKaVlnS0hCaGNuTmxTVzUwS0hKbGNTNXpkR0YwZFhNc0lERXdLU0E5UFQwZ01qQXdYRzRnSUNBZ0lDQjhmQ0FoY21WeExuTjBZWFIxY3lBbUppQnlaWEV1Y21WemNHOXVjMlZVWlhoMExteGxibWQwYUNrcElIdGNiaUFnSUNBZ0lHWnVLSEpsY1M1eVpYTndiMjV6WlZSbGVIUXBYRzRnSUNBZ2ZWeHVJQ0I5WEc1Y2JpQWdhV1lnS0hSNWNHVnZaaUJ3YjNOMFJHRjBZU0FoUFQwZ0ozTjBjbWx1WnljcElIdGNiaUFnSUNCeVpYRXViM0JsYmlnblIwVlVKeXdnZFhKc0xDQjBjblZsS1Z4dUlDQWdJSEpsY1M1elpXNWtLQ2NuS1Z4dUlDQjlJR1ZzYzJVZ2UxeHVJQ0FnSUhKbGNTNXZjR1Z1S0NkUVQxTlVKeXdnZFhKc0xDQjBjblZsS1Z4dUlDQWdJSEpsY1M1elpYUlNaWEYxWlhOMFNHVmhaR1Z5S0NkRGIyNTBaVzUwTFhSNWNHVW5MQ0FuWVhCd2JHbGpZWFJwYjI0dmVDMTNkM2N0Wm05eWJTMTFjbXhsYm1OdlpHVmtKeWxjYmlBZ0lDQnlaWEV1YzJWdVpDaHdiM04wUkdGMFlTbGNiaUFnZlZ4dWZWeHVYRzVsZUhCdmNuUWdablZ1WTNScGIyNGdaMlZ1WlhKaGRHVkpaQ2dwSUh0Y2JpQWdjbVYwZFhKdUlFMWhkR2d1Y21GdVpHOXRLQ2t1ZEc5VGRISnBibWNvTXpZcExuTjFZbk4wY2lneUxDQXhNQ2xjYm4xY2JseHVaWGh3YjNKMElHWjFibU4wYVc5dUlHWnBibVJVWVhKblpYUkNlVU5zWVhOektIUmhjbWRsZEN3Z2NHRnlaVzUwUTJ4aGMzTXBJSHRjYmlBZ1ptOXlJQ2c3SUhSaGNtZGxkQ0FtSmlCMFlYSm5aWFFnSVQwOUlHUnZZM1Z0Wlc1ME95QjBZWEpuWlhRZ1BTQjBZWEpuWlhRdWNHRnlaVzUwVG05a1pTa2dlMXh1SUNBZ0lHbG1JQ2gwWVhKblpYUXVZMnhoYzNOTWFYTjBMbU52Ym5SaGFXNXpLSEJoY21WdWRFTnNZWE56S1NrZ2UxeHVJQ0FnSUNBZ2NtVjBkWEp1SUhSaGNtZGxkRnh1SUNBZ0lIMWNiaUFnZlZ4dVhHNGdJSEpsZEhWeWJpQnVkV3hzWEc1OVhHNWNibHh1Wlhod2IzSjBJR1oxYm1OMGFXOXVJR1pwYm1SVVlYSm5aWFJDZVVsa0tIUmhjbWRsZEN3Z2NHRnlaVzUwU1dRcElIdGNiaUFnWm05eUlDZzdJSFJoY21kbGRDQW1KaUIwWVhKblpYUWdJVDA5SUdSdlkzVnRaVzUwT3lCMFlYSm5aWFFnUFNCMFlYSm5aWFF1Y0dGeVpXNTBUbTlrWlNrZ2UxeHVJQ0FnSUdsbUlDaDBZWEpuWlhRdVoyVjBRWFIwY21saWRYUmxLQ2RwWkNjcElEMDlQU0J3WVhKbGJuUkpaQ2tnZTF4dUlDQWdJQ0FnY21WMGRYSnVJSFJoY21kbGRGeHVJQ0FnSUgxY2JpQWdmVnh1WEc0Z0lISmxkSFZ5YmlCdWRXeHNYRzU5WEc1Y2JtVjRjRzl5ZENCbWRXNWpkR2x2YmlCbWFXNWtWR0Z5WjJWMFFubEJkSFJ5S0hSaGNtZGxkQ3dnWVhSMGNpa2dlMXh1SUNCbWIzSWdLRHNnZEdGeVoyVjBJQ1ltSUhSaGNtZGxkQ0FoUFQwZ1pHOWpkVzFsYm5RN0lIUmhjbWRsZENBOUlIUmhjbWRsZEM1d1lYSmxiblJPYjJSbEtTQjdYRzRnSUNBZ2FXWWdLSFJoY21kbGRDNW5aWFJCZEhSeWFXSjFkR1VvWVhSMGNpa2dJVDA5SUc1MWJHd3BJSHRjYmlBZ0lDQWdJSEpsZEhWeWJpQjBZWEpuWlhSY2JpQWdJQ0I5WEc0Z0lIMWNibHh1SUNCeVpYUjFjbTRnYm5Wc2JGeHVmVnh1SWl3aUx5b3FYRzRnS2lBdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExWeHVJQ29nVEdsalpXNXpaV1FnZFc1a1pYSWdUVWxVSUNob2RIUndjem92TDJkcGRHaDFZaTVqYjIwdmNYVmhjbXN0WkdWMkwxQm9iMjV2YmkxR2NtRnRaWGR2Y21zdllteHZZaTl0WVhOMFpYSXZURWxEUlU1VFJTbGNiaUFxSUMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdFhHNGdLaTljYm1sdGNHOXlkQ0JEYjIxd2IyNWxiblFnWm5KdmJTQW5MaTR2WTI5dGNHOXVaVzUwSjF4dWFXMXdiM0owSUVOdmJHeGhjSE5sSUdaeWIyMGdKeTR1TDJOdmJHeGhjSE5sSjF4dWFXMXdiM0owSUhzZ1oyVjBRWFIwY21saWRYUmxjME52Ym1acFp5QjlJR1p5YjIwZ0p5NHVMMk52YlhCdmJtVnVkRTFoYm1GblpYSW5YRzVwYlhCdmNuUWdleUJtYVc1a1ZHRnlaMlYwUW5sRGJHRnpjeUI5SUdaeWIyMGdKeTR1THk0dUwyTnZiVzF2Ymk5MWRHbHNjeWRjYmx4dVkyOXVjM1FnUVdOamIzSmthVzl1SUQwZ0tDZ3BJRDArSUh0Y2JpQWdMeW9xWEc0Z0lDQXFJQzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMVnh1SUNBZ0tpQkRiMjV6ZEdGdWRITmNiaUFnSUNvZ0xTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdFhHNGdJQ0FxTDF4dVhHNGdJR052Ym5OMElFNUJUVVVnUFNBbllXTmpiM0prYVc5dUoxeHVJQ0JqYjI1emRDQldSVkpUU1U5T0lEMGdKekl1TUM0d0oxeHVJQ0JqYjI1emRDQkVSVVpCVlV4VVgxQlNUMUJGVWxSSlJWTWdQU0I3WEc0Z0lDQWdaV3hsYldWdWREb2diblZzYkN4Y2JpQWdmVnh1SUNCamIyNXpkQ0JFUVZSQlgwRlVWRkpUWDFCU1QxQkZVbFJKUlZNZ1BTQmJYRzRnSUYxY2JseHVJQ0F2S2lwY2JpQWdJQ29nTFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0WEc0Z0lDQXFJRU5zWVhOeklFUmxabWx1YVhScGIyNWNiaUFnSUNvZ0xTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdFhHNGdJQ0FxTDF4dVhHNGdJR05zWVhOeklFRmpZMjl5WkdsdmJpQmxlSFJsYm1SeklFTnZiWEJ2Ym1WdWRDQjdYRzVjYmlBZ0lDQmpiMjV6ZEhKMVkzUnZjaWh2Y0hScGIyNXpJRDBnZTMwcElIdGNiaUFnSUNBZ0lITjFjR1Z5S0U1QlRVVXNJRlpGVWxOSlQwNHNJRVJGUmtGVlRGUmZVRkpQVUVWU1ZFbEZVeXdnYjNCMGFXOXVjeXdnUkVGVVFWOUJWRlJTVTE5UVVrOVFSVkpVU1VWVExDQm1ZV3h6WlN3Z1ptRnNjMlVwWEc1Y2JpQWdJQ0FnSUhSb2FYTXVZMjlzYkdGd2MyVnpJRDBnVzExY2JseHVJQ0FnSUNBZ1kyOXVjM1FnZEc5bloyeGxjeUE5SUhSb2FYTXViM0IwYVc5dWN5NWxiR1Z0Wlc1MExuRjFaWEo1VTJWc1pXTjBiM0pCYkd3b1lGdGtZWFJoTFhSdloyZHNaVDFjSWlSN1RrRk5SWDFjSWwxZ0tWeHVJQ0FnSUNBZ1FYSnlZWGt1Wm5KdmJTaDBiMmRuYkdWektTNW1iM0pGWVdOb0tDaDBiMmRuYkdVcElEMCtJSHRjYmlBZ0lDQWdJQ0FnWTI5dWMzUWdZMjlzYkdGd2MyVkpaQ0E5SUhSdloyZHNaUzVuWlhSQmRIUnlhV0oxZEdVb0oyaHlaV1luS1Z4dUlDQWdJQ0FnSUNCamIyNXpkQ0JqYjJ4c1lYQnpaU0E5SUdSdlkzVnRaVzUwTG5GMVpYSjVVMlZzWldOMGIzSW9ZMjlzYkdGd2MyVkpaQ2xjYmx4dUlDQWdJQ0FnSUNCcFppQW9ZMjlzYkdGd2MyVXBJSHRjYmlBZ0lDQWdJQ0FnSUNCMGFHbHpMbUZrWkVOdmJHeGhjSE5sS0dOdmJHeGhjSE5sS1Z4dUlDQWdJQ0FnSUNCOVhHNGdJQ0FnSUNCOUtWeHVJQ0FnSUgxY2JseHVJQ0FnSUc5dVJXeGxiV1Z1ZEVWMlpXNTBLR1YyWlc1MEtTQjdYRzRnSUNBZ0lDQmpiMjV6ZENCcFpDQTlJR1YyWlc1MExuUmhjbWRsZEM1blpYUkJkSFJ5YVdKMWRHVW9KMmh5WldZbktWeHVJQ0FnSUNBZ1kyOXVjM1FnWld4bGJXVnVkQ0E5SUdSdlkzVnRaVzUwTG5GMVpYSjVVMlZzWldOMGIzSW9hV1FwWEc1Y2JpQWdJQ0FnSUhSb2FYTXVjMlYwUTI5c2JHRndjMlZ6S0dWc1pXMWxiblFwWEc0Z0lDQWdmVnh1WEc0Z0lDQWdZV1JrUTI5c2JHRndjMlVvWld4bGJXVnVkQ2tnZTF4dUlDQWdJQ0FnWTI5dWMzUWdZMjlzYkdGd2MyVWdQU0J1WlhjZ1EyOXNiR0Z3YzJVb2UxeHVJQ0FnSUNBZ0lDQmxiR1Z0Wlc1MExGeHVJQ0FnSUNBZ2ZTbGNiaUFnSUNBZ0lIUm9hWE11WTI5c2JHRndjMlZ6TG5CMWMyZ29ZMjlzYkdGd2MyVXBYRzVjYmlBZ0lDQWdJSEpsZEhWeWJpQmpiMnhzWVhCelpWeHVJQ0FnSUgxY2JseHVJQ0FnSUdkbGRFTnZiR3hoY0hObEtHVnNaVzFsYm5RcElIdGNiaUFnSUNBZ0lHeGxkQ0JqYjJ4c1lYQnpaU0E5SUhSb2FYTXVZMjlzYkdGd2MyVnpMbVpwYm1Rb1l5QTlQaUJqTG05d2RHbHZibk11Wld4bGJXVnVkQzVuWlhSQmRIUnlhV0oxZEdVb0oybGtKeWtnUFQwOUlHVnNaVzFsYm5RdVoyVjBRWFIwY21saWRYUmxLQ2RwWkNjcEtWeHVYRzRnSUNBZ0lDQnBaaUFvSVdOdmJHeGhjSE5sS1NCN1hHNGdJQ0FnSUNBZ0lDOHZJR055WldGMFpTQmhJRzVsZHlCamIyeHNZWEJ6WlZ4dUlDQWdJQ0FnSUNCamIyeHNZWEJ6WlNBOUlIUm9hWE11WVdSa1EyOXNiR0Z3YzJVb0tWeHVJQ0FnSUNBZ2ZWeHVYRzRnSUNBZ0lDQnlaWFIxY200Z1kyOXNiR0Z3YzJWY2JpQWdJQ0I5WEc1Y2JpQWdJQ0JuWlhSRGIyeHNZWEJ6WlhNb0tTQjdYRzRnSUNBZ0lDQnlaWFIxY200Z2RHaHBjeTVqYjJ4c1lYQnpaWE5jYmlBZ0lDQjlYRzVjYmlBZ0lDQnpaWFJEYjJ4c1lYQnpaWE1vYzJodmQwTnZiR3hoY0hObEtTQjdYRzRnSUNBZ0lDQmpiMjV6ZENCamIyeHNZWEJ6WlNBOUlIUm9hWE11WjJWMFEyOXNiR0Z3YzJVb2MyaHZkME52Ykd4aGNITmxLVnh1SUNBZ0lDQWdkR2hwY3k1amIyeHNZWEJ6WlhNdVptOXlSV0ZqYUNnb1l5a2dQVDRnZTF4dUlDQWdJQ0FnSUNCcFppQW9ZeTV2Y0hScGIyNXpMbVZzWlcxbGJuUXVaMlYwUVhSMGNtbGlkWFJsS0NkcFpDY3BJQ0U5UFNCemFHOTNRMjlzYkdGd2MyVXVaMlYwUVhSMGNtbGlkWFJsS0NkcFpDY3BLU0I3WEc0Z0lDQWdJQ0FnSUNBZ1l5NW9hV1JsS0NsY2JpQWdJQ0FnSUNBZ2ZTQmxiSE5sSUh0Y2JpQWdJQ0FnSUNBZ0lDQmpiMnhzWVhCelpTNTBiMmRuYkdVb0tWeHVJQ0FnSUNBZ0lDQjlYRzRnSUNBZ0lDQjlLVnh1SUNBZ0lIMWNibHh1SUNBZ0lITm9iM2NvWTI5c2JHRndjMlZGYkNrZ2UxeHVJQ0FnSUNBZ2JHVjBJR052Ykd4aGNITmxJRDBnWTI5c2JHRndjMlZGYkZ4dUlDQWdJQ0FnYVdZZ0tIUjVjR1Z2WmlCamIyeHNZWEJ6WlVWc0lEMDlQU0FuYzNSeWFXNW5KeWtnZTF4dUlDQWdJQ0FnSUNCamIyeHNZWEJ6WlNBOUlHUnZZM1Z0Wlc1MExuRjFaWEo1VTJWc1pXTjBiM0lvWTI5c2JHRndjMlZGYkNsY2JpQWdJQ0FnSUgxY2JseHVJQ0FnSUNBZ2FXWWdLQ0ZqYjJ4c1lYQnpaU2tnZTF4dUlDQWdJQ0FnSUNCMGFISnZkeUJ1WlhjZ1JYSnliM0lvWUNSN1RrRk5SWDB1SUZSb1pTQmpiMnhzWVhCemFXSnNaU0FrZTJOdmJHeGhjSE5sUld4OUlHbHpJR0Z1SUdsdWRtRnNhV1FnU0ZSTlRFVnNaVzFsYm5RdVlDbGNiaUFnSUNBZ0lIMWNibHh1SUNBZ0lDQWdkR2hwY3k1elpYUkRiMnhzWVhCelpYTW9ZMjlzYkdGd2MyVXBYRzVjYmlBZ0lDQWdJSEpsZEhWeWJpQjBjblZsWEc0Z0lDQWdmVnh1WEc0Z0lDQWdhR2xrWlNoamIyeHNZWEJ6WlVWc0tTQjdYRzRnSUNBZ0lDQnNaWFFnWTI5c2JHRndjMlVnUFNCamIyeHNZWEJ6WlVWc1hHNGdJQ0FnSUNCcFppQW9kSGx3Wlc5bUlHTnZiR3hoY0hObFJXd2dQVDA5SUNkemRISnBibWNuS1NCN1hHNGdJQ0FnSUNBZ0lHTnZiR3hoY0hObElEMGdaRzlqZFcxbGJuUXVjWFZsY25sVFpXeGxZM1J2Y2loamIyeHNZWEJ6WlVWc0tWeHVJQ0FnSUNBZ2ZWeHVYRzRnSUNBZ0lDQnBaaUFvSVdOdmJHeGhjSE5sS1NCN1hHNGdJQ0FnSUNBZ0lIUm9jbTkzSUc1bGR5QkZjbkp2Y2loZ0pIdE9RVTFGZlM0Z1ZHaGxJR052Ykd4aGNITnBZbXhsSUNSN1kyOXNiR0Z3YzJWRmJIMGdhWE1nWVc0Z2FXNTJZV3hwWkNCSVZFMU1SV3hsYldWdWRDNWdLVnh1SUNBZ0lDQWdmVnh1WEc0Z0lDQWdJQ0JqYjI1emRDQmpiMnhzWVhCelpVOWlhaUE5SUhSb2FYTXVaMlYwUTI5c2JHRndjMlVvWTI5c2JHRndjMlVwWEc0Z0lDQWdJQ0J5WlhSMWNtNGdZMjlzYkdGd2MyVlBZbW91YUdsa1pTZ3BYRzRnSUNBZ2ZWeHVYRzRnSUNBZ2MzUmhkR2xqSUdsa1pXNTBhV1pwWlhJb0tTQjdYRzRnSUNBZ0lDQnlaWFIxY200Z1RrRk5SVnh1SUNBZ0lIMWNibHh1SUNBZ0lITjBZWFJwWXlCZlJFOU5TVzUwWlhKbVlXTmxLRzl3ZEdsdmJuTXBJSHRjYmlBZ0lDQWdJSEpsZEhWeWJpQnpkWEJsY2k1ZlJFOU5TVzUwWlhKbVlXTmxLRUZqWTI5eVpHbHZiaXdnYjNCMGFXOXVjeWxjYmlBZ0lDQjlYRzRnSUgxY2JseHVJQ0F2S2lwY2JpQWdJQ29nTFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0WEc0Z0lDQXFJRVJQVFNCQmNHa2dhVzF3YkdWdFpXNTBZWFJwYjI1Y2JpQWdJQ29nTFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0WEc0Z0lDQXFMMXh1SUNCamIyNXpkQ0JqYjIxd2IyNWxiblJ6SUQwZ1cxMWNibHh1SUNCamIyNXpkQ0JoWTJOdmNtUnBiMjV6SUQwZ1pHOWpkVzFsYm5RdWNYVmxjbmxUWld4bFkzUnZja0ZzYkNoZ0xpUjdUa0ZOUlgxZ0tWeHVJQ0JwWmlBb1lXTmpiM0prYVc5dWN5a2dlMXh1SUNBZ0lFRnljbUY1TG1aeWIyMG9ZV05qYjNKa2FXOXVjeWt1Wm05eVJXRmphQ2dvWld4bGJXVnVkQ2tnUFQ0Z2UxeHVJQ0FnSUNBZ1kyOXVjM1FnWTI5dVptbG5JRDBnWjJWMFFYUjBjbWxpZFhSbGMwTnZibVpwWnlobGJHVnRaVzUwTENCRVJVWkJWVXhVWDFCU1QxQkZVbFJKUlZNc0lFUkJWRUZmUVZSVVVsTmZVRkpQVUVWU1ZFbEZVeWxjYmlBZ0lDQWdJR052Ym1acFp5NWxiR1Z0Wlc1MElEMGdaV3hsYldWdWRGeHVYRzRnSUNBZ0lDQmpiMjF3YjI1bGJuUnpMbkIxYzJnb1FXTmpiM0prYVc5dUxsOUVUMDFKYm5SbGNtWmhZMlVvWTI5dVptbG5LU2xjYmlBZ0lDQjlLVnh1SUNCOVhHNWNiaUFnYVdZZ0tHRmpZMjl5WkdsdmJuTXBJSHRjYmlBZ0lDQmtiMk4xYldWdWRDNWhaR1JGZG1WdWRFeHBjM1JsYm1WeUtDZGpiR2xqYXljc0lDaGxkbVZ1ZENrZ1BUNGdlMXh1SUNBZ0lDQWdZMjl1YzNRZ1pHRjBZVlJ2WjJkc1pVRjBkSElnUFNCbGRtVnVkQzUwWVhKblpYUXVaMlYwUVhSMGNtbGlkWFJsS0Nka1lYUmhMWFJ2WjJkc1pTY3BYRzRnSUNBZ0lDQnBaaUFvWkdGMFlWUnZaMmRzWlVGMGRISWdKaVlnWkdGMFlWUnZaMmRzWlVGMGRISWdQVDA5SUU1QlRVVXBJSHRjYmlBZ0lDQWdJQ0FnWTI5dWMzUWdZMjlzYkdGd2MyVkpaQ0E5SUdWMlpXNTBMblJoY21kbGRDNW5aWFJCZEhSeWFXSjFkR1VvSjJSaGRHRXRkR0Z5WjJWMEp5a2dmSHdnWlhabGJuUXVkR0Z5WjJWMExtZGxkRUYwZEhKcFluVjBaU2duYUhKbFppY3BYRzRnSUNBZ0lDQWdJR052Ym5OMElHTnZiR3hoY0hObFJXd2dQU0JrYjJOMWJXVnVkQzV4ZFdWeWVWTmxiR1ZqZEc5eUtHTnZiR3hoY0hObFNXUXBYRzVjYmlBZ0lDQWdJQ0FnWTI5dWMzUWdZV05qYjNKa2FXOXVJRDBnWm1sdVpGUmhjbWRsZEVKNVEyeGhjM01vWlhabGJuUXVkR0Z5WjJWMExDQW5ZV05qYjNKa2FXOXVKeWxjYmx4dUlDQWdJQ0FnSUNCcFppQW9ZV05qYjNKa2FXOXVJRDA5UFNCdWRXeHNLU0I3WEc0Z0lDQWdJQ0FnSUNBZ2NtVjBkWEp1WEc0Z0lDQWdJQ0FnSUgxY2JseHVJQ0FnSUNBZ0lDQmpiMjV6ZENCaFkyTnZjbVJwYjI1SlpDQTlJR0ZqWTI5eVpHbHZiaTVuWlhSQmRIUnlhV0oxZEdVb0oybGtKeWxjYmlBZ0lDQWdJQ0FnWTI5dWMzUWdZMjl0Y0c5dVpXNTBJRDBnWTI5dGNHOXVaVzUwY3k1bWFXNWtLR01nUFQ0Z1l5NW5aWFJGYkdWdFpXNTBLQ2t1WjJWMFFYUjBjbWxpZFhSbEtDZHBaQ2NwSUQwOVBTQmhZMk52Y21ScGIyNUpaQ2xjYmx4dUlDQWdJQ0FnSUNCcFppQW9JV052YlhCdmJtVnVkQ2tnZTF4dUlDQWdJQ0FnSUNBZ0lISmxkSFZ5Ymx4dUlDQWdJQ0FnSUNCOVhHNWNiaUFnSUNBZ0lDQWdMeThnYVdZZ2RHaGxJR052Ykd4aGNITmxJR2hoY3lCaVpXVnVJR0ZrWkdWa0lIQnliMmR5WVcxdFlYUnBZMkZzYkhrc0lIZGxJR0ZrWkNCcGRGeHVJQ0FnSUNBZ0lDQmpiMjV6ZENCMFlYSm5aWFJEYjJ4c1lYQnpaU0E5SUdOdmJYQnZibVZ1ZEM1blpYUkRiMnhzWVhCelpYTW9LUzVtYVc1a0tHTWdQVDRnWXk1blpYUkZiR1Z0Wlc1MEtDa2dQVDA5SUdOdmJHeGhjSE5sUld3cFhHNGdJQ0FnSUNBZ0lHbG1JQ2doZEdGeVoyVjBRMjlzYkdGd2MyVXBJSHRjYmlBZ0lDQWdJQ0FnSUNCamIyMXdiMjVsYm5RdVlXUmtRMjlzYkdGd2MyVW9ZMjlzYkdGd2MyVkZiQ2xjYmlBZ0lDQWdJQ0FnZlZ4dVhHNGdJQ0FnSUNBZ0lHTnZiWEJ2Ym1WdWRDNXphRzkzS0dOdmJHeGhjSE5sU1dRcFhHNGdJQ0FnSUNCOVhHNGdJQ0FnZlNsY2JpQWdmVnh1WEc0Z0lISmxkSFZ5YmlCQlkyTnZjbVJwYjI1Y2JuMHBLQ2xjYmx4dVpYaHdiM0owSUdSbFptRjFiSFFnUVdOamIzSmthVzl1WEc0aUxDSXZLaXBjYmlBcUlDMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRYRzRnS2lCTWFXTmxibk5sWkNCMWJtUmxjaUJOU1ZRZ0tHaDBkSEJ6T2k4dloybDBhSFZpTG1OdmJTOXhkV0Z5YXkxa1pYWXZVR2h2Ym05dUxVWnlZVzFsZDI5eWF5OWliRzlpTDIxaGMzUmxjaTlNU1VORlRsTkZLVnh1SUNvZ0xTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMWNiaUFxTDF4dWFXMXdiM0owSUVOdmJYQnZibVZ1ZENCbWNtOXRJQ2N1TGk5amIyMXdiMjVsYm5RblhHNXBiWEJ2Y25RZ2V5Qm5aWFJCZEhSeWFXSjFkR1Z6UTI5dVptbG5JSDBnWm5KdmJTQW5MaTR2WTI5dGNHOXVaVzUwVFdGdVlXZGxjaWRjYm1sdGNHOXlkQ0JGZG1WdWRDQm1jbTl0SUNjdUxpOHVMaTlqYjIxdGIyNHZaWFpsYm5SekoxeHVhVzF3YjNKMElIc2dabWx1WkZSaGNtZGxkRUo1UVhSMGNpQjlJR1p5YjIwZ0p5NHVMeTR1TDJOdmJXMXZiaTkxZEdsc2N5ZGNibHh1WTI5dWMzUWdRMjlzYkdGd2MyVWdQU0FvS0NrZ1BUNGdlMXh1SUNBdktpcGNiaUFnSUNvZ0xTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdFhHNGdJQ0FxSUVOdmJuTjBZVzUwYzF4dUlDQWdLaUF0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzFjYmlBZ0lDb3ZYRzVjYmlBZ1kyOXVjM1FnVGtGTlJTQTlJQ2RqYjJ4c1lYQnpaU2RjYmlBZ1kyOXVjM1FnVmtWU1UwbFBUaUE5SUNjeUxqQXVNQ2RjYmlBZ1kyOXVjM1FnUkVWR1FWVk1WRjlRVWs5UVJWSlVTVVZUSUQwZ2UxeHVJQ0FnSUdWc1pXMWxiblE2SUc1MWJHd3NYRzRnSUNBZ2RHOW5aMnhsT2lCbVlXeHpaU3hjYmlBZ2ZWeHVJQ0JqYjI1emRDQkVRVlJCWDBGVVZGSlRYMUJTVDFCRlVsUkpSVk1nUFNCYlhHNGdJQ0FnSjNSdloyZHNaU2NzWEc0Z0lGMWNibHh1SUNBdktpcGNiaUFnSUNvZ0xTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdFhHNGdJQ0FxSUVOc1lYTnpJRVJsWm1sdWFYUnBiMjVjYmlBZ0lDb2dMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRYRzRnSUNBcUwxeHVYRzRnSUdOc1lYTnpJRU52Ykd4aGNITmxJR1Y0ZEdWdVpITWdRMjl0Y0c5dVpXNTBJSHRjYmx4dUlDQWdJR052Ym5OMGNuVmpkRzl5S0c5d2RHbHZibk1nUFNCN2ZTa2dlMXh1SUNBZ0lDQWdjM1Z3WlhJb1RrRk5SU3dnVmtWU1UwbFBUaXdnUkVWR1FWVk1WRjlRVWs5UVJWSlVTVVZUTENCdmNIUnBiMjV6TENCRVFWUkJYMEZVVkZKVFgxQlNUMUJGVWxSSlJWTXNJR1poYkhObExDQm1ZV3h6WlNsY2JseHVJQ0FnSUNBZ2RHaHBjeTV2YmxSeVlXNXphWFJwYjI0Z1BTQm1ZV3h6WlZ4dVhHNGdJQ0FnSUNBdkx5QjBiMmRuYkdVZ1pHbHlaV04wYkhsY2JpQWdJQ0FnSUdsbUlDaDBhR2x6TG05d2RHbHZibk11ZEc5bloyeGxLU0I3WEc0Z0lDQWdJQ0FnSUhSb2FYTXVjMmh2ZHlncFhHNGdJQ0FnSUNCOVhHNGdJQ0FnZlZ4dVhHNGdJQ0FnWjJWMFNHVnBaMmgwS0NrZ2UxeHVJQ0FnSUNBZ2NtVjBkWEp1SUhSb2FYTXViM0IwYVc5dWN5NWxiR1Z0Wlc1MExtZGxkRUp2ZFc1a2FXNW5RMnhwWlc1MFVtVmpkQ2gwYUdsekxtOXdkR2x2Ym5NdVpXeGxiV1Z1ZENrdWFHVnBaMmgwWEc0Z0lDQWdmVnh1WEc0Z0lDQWdkRzluWjJ4bEtDa2dlMXh1SUNBZ0lDQWdhV1lnS0hSb2FYTXViM0IwYVc5dWN5NWxiR1Z0Wlc1MExtTnNZWE56VEdsemRDNWpiMjUwWVdsdWN5Z25jMmh2ZHljcEtTQjdYRzRnSUNBZ0lDQWdJSEpsZEhWeWJpQjBhR2x6TG1ocFpHVW9LVnh1SUNBZ0lDQWdmVnh1WEc0Z0lDQWdJQ0J5WlhSMWNtNGdkR2hwY3k1emFHOTNLQ2xjYmlBZ0lDQjlYRzVjYmlBZ0lDQnphRzkzS0NrZ2UxeHVJQ0FnSUNBZ2FXWWdLSFJvYVhNdWIyNVVjbUZ1YzJsMGFXOXVLU0I3WEc0Z0lDQWdJQ0FnSUhKbGRIVnliaUJtWVd4elpWeHVJQ0FnSUNBZ2ZWeHVYRzRnSUNBZ0lDQnBaaUFvZEdocGN5NXZjSFJwYjI1ekxtVnNaVzFsYm5RdVkyeGhjM05NYVhOMExtTnZiblJoYVc1ektDZHphRzkzSnlrcElIdGNiaUFnSUNBZ0lDQWdjbVYwZFhKdUlHWmhiSE5sWEc0Z0lDQWdJQ0I5WEc1Y2JpQWdJQ0FnSUhSb2FYTXViMjVVY21GdWMybDBhVzl1SUQwZ2RISjFaVnh1WEc0Z0lDQWdJQ0JqYjI1emRDQnZia052Ykd4aGNITmxaQ0E5SUNncElEMCtJSHRjYmlBZ0lDQWdJQ0FnZEdocGN5NXZjSFJwYjI1ekxtVnNaVzFsYm5RdVkyeGhjM05NYVhOMExtRmtaQ2duYzJodmR5Y3BYRzRnSUNBZ0lDQWdJSFJvYVhNdWIzQjBhVzl1Y3k1bGJHVnRaVzUwTG1Oc1lYTnpUR2x6ZEM1eVpXMXZkbVVvSjJOdmJHeGhjSE5wYm1jbktWeHVJQ0FnSUNBZ0lDQjBhR2x6TG05d2RHbHZibk11Wld4bGJXVnVkQzV5WlcxdmRtVkZkbVZ1ZEV4cGMzUmxibVZ5S0VWMlpXNTBMbFJTUVU1VFNWUkpUMDVmUlU1RUxDQnZia052Ykd4aGNITmxaQ2xjYmx4dUlDQWdJQ0FnSUNCMGFHbHpMbTl3ZEdsdmJuTXVaV3hsYldWdWRDNXpaWFJCZEhSeWFXSjFkR1VvSjJGeWFXRXRaWGh3WVc1a1pXUW5MQ0IwY25WbEtWeHVYRzRnSUNBZ0lDQWdJSFJvYVhNdWIyNVVjbUZ1YzJsMGFXOXVJRDBnWm1Gc2MyVmNiaUFnSUNBZ0lIMWNibHh1SUNBZ0lDQWdhV1lnS0NGMGFHbHpMbTl3ZEdsdmJuTXVaV3hsYldWdWRDNWpiR0Z6YzB4cGMzUXVZMjl1ZEdGcGJuTW9KMk52Ykd4aGNITnBibWNuS1NrZ2UxeHVJQ0FnSUNBZ0lDQjBhR2x6TG05d2RHbHZibk11Wld4bGJXVnVkQzVqYkdGemMweHBjM1F1WVdSa0tDZGpiMnhzWVhCemFXNW5KeWxjYmlBZ0lDQWdJSDFjYmx4dUlDQWdJQ0FnZEdocGN5NXZjSFJwYjI1ekxtVnNaVzFsYm5RdVlXUmtSWFpsYm5STWFYTjBaVzVsY2loRmRtVnVkQzVVVWtGT1UwbFVTVTlPWDBWT1JDd2diMjVEYjJ4c1lYQnpaV1FwWEc1Y2JpQWdJQ0FnSUdOdmJuTjBJR2hsYVdkb2RDQTlJSFJvYVhNdVoyVjBTR1ZwWjJoMEtDbGNibHh1SUNBZ0lDQWdkR2hwY3k1dmNIUnBiMjV6TG1Wc1pXMWxiblF1YzNSNWJHVXVhR1ZwWjJoMElEMGdKekJ3ZUNkY2JseHVJQ0FnSUNBZ2MyVjBWR2x0Wlc5MWRDZ29LU0E5UGlCN1hHNGdJQ0FnSUNBZ0lIUm9hWE11YjNCMGFXOXVjeTVsYkdWdFpXNTBMbk4wZVd4bExtaGxhV2RvZENBOUlHQWtlMmhsYVdkb2RIMXdlR0JjYmlBZ0lDQWdJSDBzSURJd0tWeHVYRzRnSUNBZ0lDQnlaWFIxY200Z2RISjFaVnh1SUNBZ0lIMWNibHh1SUNBZ0lHaHBaR1VvS1NCN1hHNGdJQ0FnSUNCcFppQW9kR2hwY3k1dmJsUnlZVzV6YVhScGIyNHBJSHRjYmlBZ0lDQWdJQ0FnY21WMGRYSnVJR1poYkhObFhHNGdJQ0FnSUNCOVhHNWNiaUFnSUNBZ0lHbG1JQ2doZEdocGN5NXZjSFJwYjI1ekxtVnNaVzFsYm5RdVkyeGhjM05NYVhOMExtTnZiblJoYVc1ektDZHphRzkzSnlrcElIdGNiaUFnSUNBZ0lDQWdjbVYwZFhKdUlHWmhiSE5sWEc0Z0lDQWdJQ0I5WEc1Y2JpQWdJQ0FnSUhSb2FYTXViMjVVY21GdWMybDBhVzl1SUQwZ2RISjFaVnh1WEc0Z0lDQWdJQ0JqYjI1emRDQnZia052Ykd4aGNITmxaQ0E5SUNncElEMCtJSHRjYmlBZ0lDQWdJQ0FnZEdocGN5NXZjSFJwYjI1ekxtVnNaVzFsYm5RdVkyeGhjM05NYVhOMExuSmxiVzkyWlNnblkyOXNiR0Z3YzJsdVp5Y3BYRzRnSUNBZ0lDQWdJSFJvYVhNdWIzQjBhVzl1Y3k1bGJHVnRaVzUwTG5OMGVXeGxMbWhsYVdkb2RDQTlJQ2RoZFhSdkoxeHVJQ0FnSUNBZ0lDQjBhR2x6TG05d2RHbHZibk11Wld4bGJXVnVkQzV5WlcxdmRtVkZkbVZ1ZEV4cGMzUmxibVZ5S0VWMlpXNTBMbFJTUVU1VFNWUkpUMDVmUlU1RUxDQnZia052Ykd4aGNITmxaQ2xjYmx4dUlDQWdJQ0FnSUNCMGFHbHpMbTl3ZEdsdmJuTXVaV3hsYldWdWRDNXpaWFJCZEhSeWFXSjFkR1VvSjJGeWFXRXRaWGh3WVc1a1pXUW5MQ0JtWVd4elpTbGNibHh1SUNBZ0lDQWdJQ0IwYUdsekxtOXVWSEpoYm5OcGRHbHZiaUE5SUdaaGJITmxYRzRnSUNBZ0lDQjlYRzVjYmlBZ0lDQWdJSFJvYVhNdWIzQjBhVzl1Y3k1bGJHVnRaVzUwTG5OMGVXeGxMbWhsYVdkb2RDQTlJQ2N3Y0hnblhHNWNiaUFnSUNBZ0lHbG1JQ2doZEdocGN5NXZjSFJwYjI1ekxtVnNaVzFsYm5RdVkyeGhjM05NYVhOMExtTnZiblJoYVc1ektDZGpiMnhzWVhCemFXNW5KeWtwSUh0Y2JpQWdJQ0FnSUNBZ2RHaHBjeTV2Y0hScGIyNXpMbVZzWlcxbGJuUXVZMnhoYzNOTWFYTjBMbUZrWkNnblkyOXNiR0Z3YzJsdVp5Y3BYRzRnSUNBZ0lDQjlYRzVjYmlBZ0lDQWdJSFJvYVhNdWIzQjBhVzl1Y3k1bGJHVnRaVzUwTG1Ga1pFVjJaVzUwVEdsemRHVnVaWElvUlhabGJuUXVWRkpCVGxOSlZFbFBUbDlGVGtRc0lHOXVRMjlzYkdGd2MyVmtLVnh1WEc0Z0lDQWdJQ0IwYUdsekxtOXdkR2x2Ym5NdVpXeGxiV1Z1ZEM1amJHRnpjMHhwYzNRdWNtVnRiM1psS0NkemFHOTNKeWxjYmx4dUlDQWdJQ0FnY21WMGRYSnVJSFJ5ZFdWY2JpQWdJQ0I5WEc1Y2JpQWdJQ0J6ZEdGMGFXTWdhV1JsYm5ScFptbGxjaWdwSUh0Y2JpQWdJQ0FnSUhKbGRIVnliaUJPUVUxRlhHNGdJQ0FnZlZ4dVhHNGdJQ0FnYzNSaGRHbGpJRjlFVDAxSmJuUmxjbVpoWTJVb2IzQjBhVzl1Y3lrZ2UxeHVJQ0FnSUNBZ2NtVjBkWEp1SUhOMWNHVnlMbDlFVDAxSmJuUmxjbVpoWTJVb1EyOXNiR0Z3YzJVc0lHOXdkR2x2Ym5NcFhHNGdJQ0FnZlZ4dUlDQjlYRzVjYmlBZ0x5b3FYRzRnSUNBcUlDMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExWeHVJQ0FnS2lCRVQwMGdRWEJwSUdsdGNHeGxiV1Z1ZEdGMGFXOXVYRzRnSUNBcUlDMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExWeHVJQ0FnS2k5Y2JpQWdZMjl1YzNRZ1kyOXRjRzl1Wlc1MGN5QTlJRnRkWEc1Y2JpQWdZMjl1YzNRZ1kyOXNiR0Z3YzJWeklEMGdaRzlqZFcxbGJuUXVjWFZsY25sVFpXeGxZM1J2Y2tGc2JDaGdMaVI3VGtGTlJYMWdLVnh1SUNCcFppQW9ZMjlzYkdGd2MyVnpLU0I3WEc0Z0lDQWdZMjlzYkdGd2MyVnpMbVp2Y2tWaFkyZ29LR1ZzWlcxbGJuUXBJRDArSUh0Y2JpQWdJQ0FnSUM4dklHTnZibk4wSUdOdmJtWnBaeUE5SUh0OVhHNGdJQ0FnSUNCamIyNXpkQ0JqYjI1bWFXY2dQU0JuWlhSQmRIUnlhV0oxZEdWelEyOXVabWxuS0dWc1pXMWxiblFzSUVSRlJrRlZURlJmVUZKUFVFVlNWRWxGVXl3Z1JFRlVRVjlCVkZSU1UxOVFVazlRUlZKVVNVVlRLVnh1SUNBZ0lDQWdZMjl1Wm1sbkxtVnNaVzFsYm5RZ1BTQmxiR1Z0Wlc1MFhHNWNiaUFnSUNBZ0lHTnZiWEJ2Ym1WdWRITXVjSFZ6YUNoRGIyeHNZWEJ6WlM1ZlJFOU5TVzUwWlhKbVlXTmxLR052Ym1acFp5a3BYRzRnSUNBZ2ZTbGNiaUFnZlZ4dVhHNGdJR2xtSUNoamIyeHNZWEJ6WlhNcElIdGNiaUFnSUNCa2IyTjFiV1Z1ZEM1aFpHUkZkbVZ1ZEV4cGMzUmxibVZ5S0NkamJHbGpheWNzSUNobGRtVnVkQ2tnUFQ0Z2UxeHVJQ0FnSUNBZ1kyOXVjM1FnZEdGeVoyVjBJRDBnWm1sdVpGUmhjbWRsZEVKNVFYUjBjaWhsZG1WdWRDNTBZWEpuWlhRc0lDZGtZWFJoTFhSdloyZHNaU2NwWEc0Z0lDQWdJQ0JwWmlBb0lYUmhjbWRsZENrZ2UxeHVJQ0FnSUNBZ0lDQnlaWFIxY201Y2JpQWdJQ0FnSUgxY2JseHVJQ0FnSUNBZ1kyOXVjM1FnWkdGMFlWUnZaMmRzWlVGMGRISWdQU0IwWVhKblpYUXVaMlYwUVhSMGNtbGlkWFJsS0Nka1lYUmhMWFJ2WjJkc1pTY3BYRzVjYmlBZ0lDQWdJR2xtSUNoa1lYUmhWRzluWjJ4bFFYUjBjaUFtSmlCa1lYUmhWRzluWjJ4bFFYUjBjaUE5UFQwZ1RrRk5SU2tnZTF4dUlDQWdJQ0FnSUNCc1pYUWdhV1FnUFNCMFlYSm5aWFF1WjJWMFFYUjBjbWxpZFhSbEtDZGtZWFJoTFhSaGNtZGxkQ2NwSUh4OElIUmhjbWRsZEM1blpYUkJkSFJ5YVdKMWRHVW9KMmh5WldZbktWeHVJQ0FnSUNBZ0lDQnBaQ0E5SUdsa0xuSmxjR3hoWTJVb0p5TW5MQ0FuSnlsY2JseHVJQ0FnSUNBZ0lDQmpiMjV6ZENCamIyMXdiMjVsYm5RZ1BTQmpiMjF3YjI1bGJuUnpMbVpwYm1Rb1l5QTlQaUJqTG1kbGRFVnNaVzFsYm5Rb0tTNW5aWFJCZEhSeWFXSjFkR1VvSjJsa0p5a2dQVDA5SUdsa0tWeHVYRzRnSUNBZ0lDQWdJR2xtSUNnaFkyOXRjRzl1Wlc1MEtTQjdYRzRnSUNBZ0lDQWdJQ0FnY21WMGRYSnVYRzRnSUNBZ0lDQWdJSDFjYmx4dUlDQWdJQ0FnSUNCamIyMXdiMjVsYm5RdWRHOW5aMnhsS0NsY2JpQWdJQ0FnSUgxY2JpQWdJQ0I5S1Z4dUlDQjlYRzVjYmlBZ2NtVjBkWEp1SUVOdmJHeGhjSE5sWEc1OUtTZ3BYRzVjYm1WNGNHOXlkQ0JrWldaaGRXeDBJRU52Ykd4aGNITmxYRzRpTENJdktpcGNiaUFxSUMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdFhHNGdLaUJNYVdObGJuTmxaQ0IxYm1SbGNpQk5TVlFnS0doMGRIQnpPaTh2WjJsMGFIVmlMbU52YlM5eGRXRnlheTFrWlhZdlVHaHZibTl1TFVaeVlXMWxkMjl5YXk5aWJHOWlMMjFoYzNSbGNpOU1TVU5GVGxORktWeHVJQ29nTFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMxY2JpQXFMMXh1YVcxd2IzSjBJSHNnWkdsemNHRjBZMmhGYkdWdFpXNTBSWFpsYm5Rc0lHUnBjM0JoZEdOb1YybHVSRzlqUlhabGJuUWdmU0JtY205dElDY3VMaTlqYjIxdGIyNHZaWFpsYm5SekwyUnBjM0JoZEdOb0oxeHVhVzF3YjNKMElIc2daMlZ1WlhKaGRHVkpaQ0I5SUdaeWIyMGdKeTR1TDJOdmJXMXZiaTkxZEdsc2N5ZGNibWx0Y0c5eWRDQkZkbVZ1ZENCbWNtOXRJQ2N1TGk5amIyMXRiMjR2WlhabGJuUnpKMXh1YVcxd2IzSjBJRU52YlhCdmJtVnVkRTFoYm1GblpYSXNJSHNnYzJWMFFYUjBjbWxpZFhSbGMwTnZibVpwWnl3Z1oyVjBRWFIwY21saWRYUmxjME52Ym1acFp5QjlJR1p5YjIwZ0p5NHZZMjl0Y0c5dVpXNTBUV0Z1WVdkbGNpZGNibHh1THlvcVhHNGdLaUF0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzFjYmlBcUlFTnNZWE56SUVSbFptbHVhWFJwYjI1Y2JpQXFJQzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMVnh1SUNvdlhHNWNibVY0Y0c5eWRDQmtaV1poZFd4MElHTnNZWE56SUVOdmJYQnZibVZ1ZENCN1hHNWNiaUFnWTI5dWMzUnlkV04wYjNJb2JtRnRaU3dnZG1WeWMybHZiaXdnWkdWbVlYVnNkRTl3ZEdsdmJuTWdQU0I3ZlN3Z2IzQjBhVzl1Y3lBOUlIdDlMQ0J2Y0hScGIyNUJkSFJ5Y3lBOUlGdGRMQ0J6ZFhCd2IzSjBSSGx1WVcxcFkwVnNaVzFsYm5RZ1BTQm1ZV3h6WlN3Z1lXUmtWRzlUZEdGamF5QTlJR1poYkhObEtTQjdYRzRnSUNBZ2RHaHBjeTV1WVcxbElEMGdibUZ0WlZ4dUlDQWdJSFJvYVhNdWRtVnljMmx2YmlBOUlIWmxjbk5wYjI1Y2JpQWdJQ0IwYUdsekxtOXdkR2x2Ym5NZ1BTQnZjSFJwYjI1elhHNWNiaUFnSUNBdkx5QkFkRzlrYnlCclpXVndQMXh1SUNBZ0lDOHZJSFJvYVhNdWIzQjBhVzl1Y3lBOUlFOWlhbVZqZEM1aGMzTnBaMjRvWkdWbVlYVnNkRTl3ZEdsdmJuTXNJRzl3ZEdsdmJuTXBYRzRnSUNBZ1QySnFaV04wTG10bGVYTW9aR1ZtWVhWc2RFOXdkR2x2Ym5NcExtWnZja1ZoWTJnb0tIQnliM0FwSUQwK0lIdGNiaUFnSUNBZ0lHbG1JQ2gwZVhCbGIyWWdkR2hwY3k1dmNIUnBiMjV6VzNCeWIzQmRJRDA5UFNBbmRXNWtaV1pwYm1Wa0p5a2dlMXh1SUNBZ0lDQWdJQ0IwYUdsekxtOXdkR2x2Ym5OYmNISnZjRjBnUFNCa1pXWmhkV3gwVDNCMGFXOXVjMXR3Y205d1hWeHVJQ0FnSUNBZ2ZWeHVJQ0FnSUgwcFhHNWNiaUFnSUNCMGFHbHpMbTl3ZEdsdmJrRjBkSEp6SUQwZ2IzQjBhVzl1UVhSMGNuTmNiaUFnSUNCMGFHbHpMbk4xY0hCdmNuUkVlVzVoYldsalJXeGxiV1Z1ZENBOUlITjFjSEJ2Y25SRWVXNWhiV2xqUld4bGJXVnVkRnh1SUNBZ0lIUm9hWE11WVdSa1ZHOVRkR0ZqYXlBOUlHRmtaRlJ2VTNSaFkydGNiaUFnSUNCMGFHbHpMbWxrSUQwZ1oyVnVaWEpoZEdWSlpDZ3BYRzVjYmlBZ0lDQmpiMjV6ZENCamFHVmphMFZzWlcxbGJuUWdQU0FoZEdocGN5NXpkWEJ3YjNKMFJIbHVZVzFwWTBWc1pXMWxiblFnZkh3Z2RHaHBjeTV2Y0hScGIyNXpMbVZzWlcxbGJuUWdJVDA5SUc1MWJHeGNibHh1SUNBZ0lHbG1JQ2gwZVhCbGIyWWdkR2hwY3k1dmNIUnBiMjV6TG1Wc1pXMWxiblFnUFQwOUlDZHpkSEpwYm1jbktTQjdYRzRnSUNBZ0lDQjBhR2x6TG05d2RHbHZibk11Wld4bGJXVnVkQ0E5SUdSdlkzVnRaVzUwTG5GMVpYSjVVMlZzWldOMGIzSW9kR2hwY3k1dmNIUnBiMjV6TG1Wc1pXMWxiblFwWEc0Z0lDQWdmVnh1WEc0Z0lDQWdhV1lnS0dOb1pXTnJSV3hsYldWdWRDQW1KaUFoZEdocGN5NXZjSFJwYjI1ekxtVnNaVzFsYm5RcElIdGNiaUFnSUNBZ0lIUm9jbTkzSUc1bGR5QkZjbkp2Y2loZ0pIdDBhR2x6TG01aGJXVjlMaUJVYUdVZ1pXeGxiV1Z1ZENCcGN5QnViM1FnWVNCSVZFMU1SV3hsYldWdWRDNWdLVnh1SUNBZ0lIMWNibHh1SUNBZ0lIUm9hWE11WkhsdVlXMXBZMFZzWlcxbGJuUWdQU0IwYUdsekxtOXdkR2x2Ym5NdVpXeGxiV1Z1ZENBOVBUMGdiblZzYkZ4dUlDQWdJSFJvYVhNdWNtVm5hWE4wWlhKbFpFVnNaVzFsYm5SeklEMGdXMTFjYmx4dUlDQWdJR2xtSUNnaGRHaHBjeTVrZVc1aGJXbGpSV3hsYldWdWRDa2dlMXh1SUNBZ0lDQWdMeW9xWEc0Z0lDQWdJQ0FnS2lCcFppQjBhR1VnWld4bGJXVnVkQ0JsZUdsemRITXNJSGRsSUhKbFlXUWdkR2hsSUdSaGRHRWdZWFIwY21saWRYUmxjeUJqYjI1bWFXZGNiaUFnSUNBZ0lDQXFJSFJvWlc0Z2QyVWdiM1psY25keWFYUmxJR1Y0YVhOMGFXNW5JR052Ym1acFp5QnJaWGx6SUdsdUlFcGhkbUZUWTNKcGNIUXNJSE52SUhSb1lYUmNiaUFnSUNBZ0lDQXFJSGRsSUd0bFpYQWdkR2hsSUdadmJHeHZkMmx1WnlCdmNtUmxjbHh1SUNBZ0lDQWdJQ29nV3pGZElHUmxabUYxYkhRZ1NtRjJZVk5qY21sd2RDQmpiMjVtYVdkMWNtRjBhVzl1SUc5bUlIUm9aU0JqYjIxd2IyNWxiblJjYmlBZ0lDQWdJQ0FxSUZzeVhTQkVZWFJoSUdGMGRISnBZblYwWlhNZ1kyOXVabWxuZFhKaGRHbHZiaUJwWmlCMGFHVWdaV3hsYldWdWRDQmxlR2x6ZEhNZ2FXNGdkR2hsSUVSUFRWeHVJQ0FnSUNBZ0lDb2dXek5kSUVwaGRtRlRZM0pwY0hRZ1kyOXVabWxuZFhKaGRHbHZibHh1SUNBZ0lDQWdJQ292WEc0Z0lDQWdJQ0IwYUdsekxtOXdkR2x2Ym5NZ1BTQlBZbXBsWTNRdVlYTnphV2R1S0hSb2FYTXViM0IwYVc5dWN5d2dkR2hwY3k1aGMzTnBaMjVLYzBOdmJtWnBaeWgwYUdsekxtZGxkRUYwZEhKcFluVjBaWE1vS1N3Z2IzQjBhVzl1Y3lrcFhHNWNiaUFnSUNBZ0lDOHZJSFJvWlc0c0lITmxkQ0IwYUdVZ2JtVjNJR1JoZEdFZ1lYUjBjbWxpZFhSbGN5QjBieUIwYUdVZ1pXeGxiV1Z1ZEZ4dUlDQWdJQ0FnZEdocGN5NXpaWFJCZEhSeWFXSjFkR1Z6S0NsY2JpQWdJQ0I5WEc1Y2JpQWdJQ0IwYUdsekxtVnNaVzFsYm5STWFYTjBaVzVsY2lBOUlHVjJaVzUwSUQwK0lIUm9hWE11YjI1Q1pXWnZjbVZGYkdWdFpXNTBSWFpsYm5Rb1pYWmxiblFwSUNBZ0lDQWdJQ0FnSUZ4dUlDQjlYRzVjYmlBZ1lYTnphV2R1U25ORGIyNW1hV2NvWVhSMGNrTnZibVpwWnl3Z2IzQjBhVzl1Y3lrZ2UxeHVJQ0FnSUhSb2FYTXViM0IwYVc5dVFYUjBjbk11Wm05eVJXRmphQ2dvYTJWNUtTQTlQaUI3WEc0Z0lDQWdJQ0JwWmlBb2IzQjBhVzl1YzF0clpYbGRLU0I3WEc0Z0lDQWdJQ0FnSUdGMGRISkRiMjVtYVdkYmEyVjVYU0E5SUc5d2RHbHZibk5iYTJWNVhWeHVJQ0FnSUNBZ2ZWeHVJQ0FnSUgwcFhHNWNiaUFnSUNCeVpYUjFjbTRnWVhSMGNrTnZibVpwWjF4dUlDQjlYRzVjYmlBZ1oyVjBWbVZ5YzJsdmJpZ3BJSHRjYmlBZ0lDQnlaWFIxY200Z2RHaHBjeTUyWlhKemFXOXVYRzRnSUgxY2JseHVJQ0JuWlhSRmJHVnRaVzUwS0NrZ2UxeHVJQ0FnSUhKbGRIVnliaUIwYUdsekxtOXdkR2x2Ym5NdVpXeGxiV1Z1ZEZ4dUlDQjlYRzVjYmlBZ1oyVjBTV1FvS1NCN1hHNGdJQ0FnY21WMGRYSnVJSFJvYVhNdWFXUmNiaUFnZlZ4dVhHNGdJSEpsWjJsemRHVnlSV3hsYldWdWRITW9aV3hsYldWdWRITXBJSHRjYmlBZ0lDQmxiR1Z0Wlc1MGN5NW1iM0pGWVdOb0tHVnNaVzFsYm5RZ1BUNGdkR2hwY3k1eVpXZHBjM1JsY2tWc1pXMWxiblFvWld4bGJXVnVkQ2twWEc0Z0lIMWNibHh1SUNCeVpXZHBjM1JsY2tWc1pXMWxiblFvWld4bGJXVnVkQ2tnZTF4dUlDQWdJR1ZzWlcxbGJuUXVkR0Z5WjJWMExtRmtaRVYyWlc1MFRHbHpkR1Z1WlhJb1pXeGxiV1Z1ZEM1bGRtVnVkQ3dnZEdocGN5NWxiR1Z0Wlc1MFRHbHpkR1Z1WlhJcFhHNGdJQ0FnZEdocGN5NXlaV2RwYzNSbGNtVmtSV3hsYldWdWRITXVjSFZ6YUNobGJHVnRaVzUwS1Z4dUlDQjlYRzVjYmlBZ2RXNXlaV2RwYzNSbGNrVnNaVzFsYm5SektDa2dlMXh1SUNBZ0lIUm9hWE11Y21WbmFYTjBaWEpsWkVWc1pXMWxiblJ6TG1admNrVmhZMmdvS0dWc1pXMWxiblFwSUQwK0lIdGNiaUFnSUNBZ0lIUm9hWE11ZFc1eVpXZHBjM1JsY2tWc1pXMWxiblFvWld4bGJXVnVkQ2xjYmlBZ0lDQjlLVnh1SUNCOVhHNWNiaUFnZFc1eVpXZHBjM1JsY2tWc1pXMWxiblFvWld4bGJXVnVkQ2tnZTF4dUlDQWdJR052Ym5OMElISmxaMmx6ZEdWeVpXUkZiR1Z0Wlc1MFNXNWtaWGdnUFNCMGFHbHpMbkpsWjJsemRHVnlaV1JGYkdWdFpXNTBjMXh1SUNBZ0lDQWdMbVpwYm1SSmJtUmxlQ2hsYkNBOVBpQmxiQzUwWVhKblpYUWdQVDA5SUdWc1pXMWxiblF1ZEdGeVoyVjBJQ1ltSUdWc0xtVjJaVzUwSUQwOVBTQmxiR1Z0Wlc1MExtVjJaVzUwS1Z4dVhHNGdJQ0FnYVdZZ0tISmxaMmx6ZEdWeVpXUkZiR1Z0Wlc1MFNXNWtaWGdnUGlBdE1Ta2dlMXh1SUNBZ0lDQWdaV3hsYldWdWRDNTBZWEpuWlhRdWNtVnRiM1psUlhabGJuUk1hWE4wWlc1bGNpaGxiR1Z0Wlc1MExtVjJaVzUwTENCMGFHbHpMbVZzWlcxbGJuUk1hWE4wWlc1bGNpbGNiaUFnSUNBZ0lIUm9hWE11Y21WbmFYTjBaWEpsWkVWc1pXMWxiblJ6TG5Od2JHbGpaU2h5WldkcGMzUmxjbVZrUld4bGJXVnVkRWx1WkdWNExDQXhLVnh1SUNBZ0lIMGdaV3h6WlNCN1hHNGdJQ0FnSUNCamIyNXpiMnhsTG1WeWNtOXlLR0JYWVhKdWFXNW5JU0JWYm10dWIzZHVJSEpsWjJsemRHVnlaV1FnWld4bGJXVnVkRG9nSkh0bGJHVnRaVzUwTG5SaGNtZGxkSDBnZDJsMGFDQmxkbVZ1ZERvZ0pIdGxiR1Z0Wlc1MExtVjJaVzUwZlM1Z0tWeHVJQ0FnSUgxY2JpQWdmVnh1WEc0Z0lIUnlhV2RuWlhKRmRtVnVkQ2hsZG1WdWRFNWhiV1VzSUdSbGRHRnBiQ0E5SUh0OUxDQnZZbXBsWTNSRmRtVnVkRTl1YkhrZ1BTQm1ZV3h6WlNrZ2UxeHVJQ0FnSUdsbUlDaDBlWEJsYjJZZ1pYWmxiblJPWVcxbElDRTlQU0FuYzNSeWFXNW5KeWtnZTF4dUlDQWdJQ0FnZEdoeWIzY2dibVYzSUVWeWNtOXlLQ2RVYUdVZ1pYWmxiblFnYm1GdFpTQnBjeUJ1YjNRZ2RtRnNhV1F1SnlsY2JpQWdJQ0I5WEc1Y2JpQWdJQ0JwWmlBb2RHaHBjeTVoWkdSVWIxTjBZV05yS1NCN1hHNGdJQ0FnSUNCcFppQW9aWFpsYm5ST1lXMWxJRDA5UFNCRmRtVnVkQzVUU0U5WEtTQjdYRzRnSUNBZ0lDQWdJRU52YlhCdmJtVnVkRTFoYm1GblpYSXVZV1JrS0hSb2FYTXBYRzRnSUNBZ0lDQjlJR1ZzYzJVZ2FXWWdLR1YyWlc1MFRtRnRaU0E5UFQwZ1JYWmxiblF1U0VsRVJTa2dlMXh1SUNBZ0lDQWdJQ0JEYjIxd2IyNWxiblJOWVc1aFoyVnlMbkpsYlc5MlpTaDBhR2x6S1Z4dUlDQWdJQ0FnZlZ4dUlDQWdJSDFjYmx4dUlDQWdJQzh2SUdWMlpXNTBJRzVoYldWeklHTmhiaUJpWlNCM2FYUm9JR1J2ZENCdWIzUmhkR2x2YmlCc2FXdGxJSEpsWTI5dWJtVmpkR2x1Wnk1emRXTmpaWE56WEc0Z0lDQWdZMjl1YzNRZ1pYWmxiblJPWVcxbFQySnFaV04wSUQwZ1pYWmxiblJPWVcxbExuTndiR2wwS0NjdUp5a3VjbVZrZFdObEtDaGhZMk1zSUdOMWNuSmxiblFzSUdsdVpHVjRLU0E5UGlCN1hHNGdJQ0FnSUNCcFppQW9hVzVrWlhnZ1BUMDlJREFwSUh0Y2JpQWdJQ0FnSUNBZ2NtVjBkWEp1SUdOMWNuSmxiblJjYmlBZ0lDQWdJSDFjYmx4dUlDQWdJQ0FnY21WMGRYSnVJR0ZqWXlBcklHTjFjbkpsYm5RdVkyaGhja0YwS0RBcExuUnZWWEJ3WlhKRFlYTmxLQ2tnS3lCamRYSnlaVzUwTG5Oc2FXTmxLREVwWEc0Z0lDQWdmU2xjYmx4dUlDQWdJR052Ym5OMElHVjJaVzUwVG1GdFpVRnNhV0Z6SUQwZ1lHOXVKSHRsZG1WdWRFNWhiV1ZQWW1wbFkzUXVZMmhoY2tGMEtEQXBMblJ2VlhCd1pYSkRZWE5sS0NsOUpIdGxkbVZ1ZEU1aGJXVlBZbXBsWTNRdWMyeHBZMlVvTVNsOVlGeHVYRzRnSUNBZ0x5OGdiMkpxWldOMElHVjJaVzUwWEc0Z0lDQWdhV1lnS0hSNWNHVnZaaUIwYUdsekxtOXdkR2x2Ym5OYlpYWmxiblJPWVcxbFQySnFaV04wWFNBOVBUMGdKMloxYm1OMGFXOXVKeWtnZTF4dUlDQWdJQ0FnZEdocGN5NXZjSFJwYjI1elcyVjJaVzUwVG1GdFpVOWlhbVZqZEYwdVlYQndiSGtvZEdocGN5d2dXMlJsZEdGcGJGMHBYRzRnSUNBZ2ZWeHVYRzRnSUNBZ2FXWWdLSFI1Y0dWdlppQjBhR2x6TG05d2RHbHZibk5iWlhabGJuUk9ZVzFsUVd4cFlYTmRJRDA5UFNBblpuVnVZM1JwYjI0bktTQjdYRzRnSUNBZ0lDQjBhR2x6TG05d2RHbHZibk5iWlhabGJuUk9ZVzFsUVd4cFlYTmRMbUZ3Y0d4NUtIUm9hWE1zSUZ0a1pYUmhhV3hkS1Z4dUlDQWdJSDFjYmx4dUlDQWdJR2xtSUNodlltcGxZM1JGZG1WdWRFOXViSGtwSUh0Y2JpQWdJQ0FnSUhKbGRIVnlibHh1SUNBZ0lIMWNibHh1SUNBZ0lDOHZJR1J2YlNCbGRtVnVkRnh1SUNBZ0lHbG1JQ2gwYUdsekxtOXdkR2x2Ym5NdVpXeGxiV1Z1ZENrZ2UxeHVJQ0FnSUNBZ1pHbHpjR0YwWTJoRmJHVnRaVzUwUlhabGJuUW9kR2hwY3k1dmNIUnBiMjV6TG1Wc1pXMWxiblFzSUdWMlpXNTBUbUZ0WlN3Z2RHaHBjeTV1WVcxbExDQmtaWFJoYVd3cFhHNGdJQ0FnZlNCbGJITmxJSHRjYmlBZ0lDQWdJR1JwYzNCaGRHTm9WMmx1Ukc5alJYWmxiblFvWlhabGJuUk9ZVzFsTENCMGFHbHpMbTVoYldVc0lHUmxkR0ZwYkNsY2JpQWdJQ0I5WEc0Z0lIMWNibHh1SUNCelpYUkJkSFJ5YVdKMWRHVnpLQ2tnZTF4dUlDQWdJR2xtSUNoMGFHbHpMbTl3ZEdsdmJrRjBkSEp6TG14bGJtZDBhQ0ErSURBcElIdGNiaUFnSUNBZ0lITmxkRUYwZEhKcFluVjBaWE5EYjI1bWFXY29kR2hwY3k1dmNIUnBiMjV6TG1Wc1pXMWxiblFzSUhSb2FYTXViM0IwYVc5dWN5d2dkR2hwY3k1dmNIUnBiMjVCZEhSeWN5bGNiaUFnSUNCOVhHNGdJSDFjYmx4dUlDQm5aWFJCZEhSeWFXSjFkR1Z6S0NrZ2UxeHVJQ0FnSUdOdmJuTjBJRzl3ZEdsdmJuTWdQU0JQWW1wbFkzUXVZWE56YVdkdUtIdDlMQ0IwYUdsekxtOXdkR2x2Ym5NcFhHNGdJQ0FnY21WMGRYSnVJR2RsZEVGMGRISnBZblYwWlhORGIyNW1hV2NvZEdocGN5NXZjSFJwYjI1ekxtVnNaVzFsYm5Rc0lHOXdkR2x2Ym5Nc0lIUm9hWE11YjNCMGFXOXVRWFIwY25NcFhHNGdJSDFjYmx4dUlDQXZLaXBjYmlBZ0lDb2dkR2hsSUhCeVpYWmxiblJEYkc5ellXSnNaU0J0WlhSb2IyUWdiV0Z1WVdkbGN5QmpiMjVqZFhKeVpXNWplU0JpWlhSM1pXVnVJR0ZqZEdsMlpTQmpiMjF3YjI1bGJuUnpMbHh1SUNBZ0tpQkdiM0lnWlhoaGJYQnNaU3dnYVdZZ2RHaGxjbVVnYVhNZ1lTQnphRzkzYmlCdlptWXRZMkZ1ZG1GeklHRnVaQ0JrYVdGc2IyY3NJSFJvWlNCc1lYTjBYRzRnSUNBcUlITm9iM2R1SUdOdmJYQnZibVZ1ZENCbllXbHVjeUIwYUdVZ2NISnZZMlZ6YzJsdVp5QndjbWx2Y21sMGVWeHVJQ0FnS2k5Y2JpQWdjSEpsZG1WdWRFTnNiM05oWW14bEtDa2dlMXh1SUNBZ0lISmxkSFZ5YmlCMGFHbHpMbUZrWkZSdlUzUmhZMnNnSmlZZ0lVTnZiWEJ2Ym1WdWRFMWhibUZuWlhJdVkyeHZjMkZpYkdVb2RHaHBjeWxjYmlBZ2ZWeHVYRzRnSUc5dVFtVm1iM0psUld4bGJXVnVkRVYyWlc1MEtHVjJaVzUwS1NCN1hHNGdJQ0FnYVdZZ0tIUm9hWE11Y0hKbGRtVnVkRU5zYjNOaFlteGxLQ2twSUh0Y2JpQWdJQ0FnSUhKbGRIVnlibHh1SUNBZ0lIMWNibHh1SUNBZ0lIUm9hWE11YjI1RmJHVnRaVzUwUlhabGJuUW9aWFpsYm5RcFhHNGdJSDFjYmx4dUlDQnZia1ZzWlcxbGJuUkZkbVZ1ZENobGRtVnVkQ2tnZTF4dUlDQWdJQzh2WEc0Z0lIMWNibHh1SUNCemRHRjBhV01nYVdSbGJuUnBabWxsY2lncElIdGNiaUFnSUNCeVpYUjFjbTRnZEdocGN5NXVZVzFsWEc0Z0lIMWNibHh1SUNCemRHRjBhV01nWDBSUFRVbHVkR1Z5Wm1GalpTaERiMjF3YjI1bGJuUkRiR0Z6Y3l3Z2IzQjBhVzl1Y3lrZ2UxeHVJQ0FnSUhKbGRIVnliaUJ1WlhjZ1EyOXRjRzl1Wlc1MFEyeGhjM01vYjNCMGFXOXVjeWxjYmlBZ2ZWeHVmVnh1SWl3aVhHNWpiMjV6ZENCblpYUkJkSFJ5YVdKMWRHVWdQU0FvWm1seWMzUXNJSE5sWTI5dVpDa2dQVDRnZTF4dUlDQnBaaUFvWm1seWMzUWdQVDA5SUNjbktTQjdYRzRnSUNBZ2NtVjBkWEp1SUdCa1lYUmhMU1I3YzJWamIyNWtmV0JjYmlBZ2ZWeHVJQ0J5WlhSMWNtNGdZR1JoZEdFdEpIdG1hWEp6ZEgwdEpIdHpaV052Ym1SOVlGeHVmVnh1WEc1bGVIQnZjblFnWm5WdVkzUnBiMjRnYzJWMFFYUjBjbWxpZFhSbGMwTnZibVpwWnlobGJHVnRaVzUwTENCdlltb2dQU0I3ZlN3Z1lYUjBjbk1zSUhOMFlYSjBJRDBnSnljcElIdGNiaUFnWTI5dWMzUWdhMlY1Y3lBOUlFOWlhbVZqZEM1clpYbHpLRzlpYWlsY2JseHVJQ0JyWlhsekxtWnZja1ZoWTJnb0tHdGxlU2tnUFQ0Z2UxeHVJQ0FnSUdsbUlDaHpkR0Z5ZENBOVBUMGdKeWNnSmlZZ1lYUjBjbk11YVc1a1pYaFBaaWhyWlhrcElEMDlQU0F0TVNrZ2UxeHVJQ0FnSUNBZ0x5OGdZMjl1ZEdsdWRXVWdkMmwwYUNCdVpYaDBJR2wwWlhKaGRHbHZibHh1SUNBZ0lDQWdjbVYwZFhKdVhHNGdJQ0FnZlZ4dVhHNGdJQ0FnYVdZZ0tIUjVjR1Z2WmlCdlltcGJhMlY1WFNBOVBUMGdKMjlpYW1WamRDY2dKaVlnYjJKcVcydGxlVjBnSVQwOUlHNTFiR3dwSUh0Y2JpQWdJQ0FnSUd4bGRDQnJaWGxUZEdGeWRDQTlJR3RsZVZ4dUlDQWdJQ0FnYVdZZ0tITjBZWEowSUNFOVBTQW5KeWtnZTF4dUlDQWdJQ0FnSUNCclpYbFRkR0Z5ZENBOUlHQWtlM04wWVhKMGZTMGtlMnRsZVgxZ1hHNGdJQ0FnSUNCOVhHNWNiaUFnSUNBZ0lITmxkRUYwZEhKcFluVjBaWE5EYjI1bWFXY29aV3hsYldWdWRDd2diMkpxVzJ0bGVWMHNJR0YwZEhKekxDQnJaWGxUZEdGeWRDbGNiaUFnSUNBZ0lISmxkSFZ5Ymx4dUlDQWdJSDFjYmx4dUlDQWdJR052Ym5OMElHRjBkSElnUFNCblpYUkJkSFJ5YVdKMWRHVW9jM1JoY25Rc0lHdGxlU2xjYmlBZ0lDQmxiR1Z0Wlc1MExuTmxkRUYwZEhKcFluVjBaU2hoZEhSeUxDQnZZbXBiYTJWNVhTbGNiaUFnZlNsY2JuMWNibHh1Wlhod2IzSjBJR1oxYm1OMGFXOXVJR2RsZEVGMGRISnBZblYwWlhORGIyNW1hV2NvWld4bGJXVnVkQ3dnYjJKcUlEMGdlMzBzSUdGMGRISnpMQ0J6ZEdGeWRDQTlJQ2NuS1NCN1hHNGdJR052Ym5OMElHNWxkMDlpYWlBOUlFOWlhbVZqZEM1aGMzTnBaMjRvZTMwc0lHOWlhaWxjYmlBZ1kyOXVjM1FnYTJWNWN5QTlJRTlpYW1WamRDNXJaWGx6S0c5aWFpbGNibHh1SUNCclpYbHpMbVp2Y2tWaFkyZ29LR3RsZVNrZ1BUNGdlMXh1SUNBZ0lHbG1JQ2h6ZEdGeWRDQTlQVDBnSnljZ0ppWWdZWFIwY25NdWFXNWtaWGhQWmloclpYa3BJRDA5UFNBdE1Ta2dlMXh1SUNBZ0lDQWdMeThnWTI5dWRHbHVkV1VnZDJsMGFDQnVaWGgwSUdsMFpYSmhkR2x2Ymx4dUlDQWdJQ0FnY21WMGRYSnVYRzRnSUNBZ2ZWeHVYRzRnSUNBZ2FXWWdLRzlpYWx0clpYbGRJQ0U5UFNCdWRXeHNJQ1ltSUc5aWFsdHJaWGxkTG1OdmJuTjBjblZqZEc5eUlEMDlQU0JQWW1wbFkzUXBJSHRjYmlBZ0lDQWdJR3hsZENCclpYbFRkR0Z5ZENBOUlHdGxlVnh1SUNBZ0lDQWdhV1lnS0hOMFlYSjBJQ0U5UFNBbkp5a2dlMXh1SUNBZ0lDQWdJQ0JyWlhsVGRHRnlkQ0E5SUdBa2UzTjBZWEowZlMwa2UydGxlWDFnWEc0Z0lDQWdJQ0I5WEc1Y2JpQWdJQ0FnSUc1bGQwOWlhbHRyWlhsZElEMGdaMlYwUVhSMGNtbGlkWFJsYzBOdmJtWnBaeWhsYkdWdFpXNTBMQ0J2WW1wYmEyVjVYU3dnWVhSMGNuTXNJR3RsZVZOMFlYSjBLVnh1SUNBZ0lDQWdjbVYwZFhKdVhHNGdJQ0FnZlZ4dVhHNGdJQ0FnTHk4Z2RYQmtZWFJsSUhaaGJIVmxYRzRnSUNBZ2JHVjBJSFpoYkhWbElEMGdiMkpxVzJ0bGVWMGdMeThnWkdWbVlYVnNkQ0IyWVd4MVpWeHVJQ0FnSUdOdmJuTjBJSFI1Y0dVZ1BTQjBlWEJsYjJZZ2RtRnNkV1ZjYmlBZ0lDQmpiMjV6ZENCaGRIUnlJRDBnWjJWMFFYUjBjbWxpZFhSbEtITjBZWEowTENCclpYa3BYRzRnSUNBZ1kyOXVjM1FnWVhSMGNsWmhiSFZsSUQwZ1pXeGxiV1Z1ZEM1blpYUkJkSFJ5YVdKMWRHVW9ZWFIwY2lsY2JseHVJQ0FnSUdsbUlDaGhkSFJ5Vm1Gc2RXVWdJVDA5SUc1MWJHd3BJSHRjYmlBZ0lDQWdJR2xtSUNoMGVYQmxJRDA5UFNBblltOXZiR1ZoYmljcElIdGNiaUFnSUNBZ0lDQWdMeThnWTI5dWRtVnlkQ0J6ZEhKcGJtY2dkRzhnWW05dmJHVmhibHh1SUNBZ0lDQWdJQ0IyWVd4MVpTQTlJR0YwZEhKV1lXeDFaU0E5UFQwZ0ozUnlkV1VuWEc0Z0lDQWdJQ0I5SUdWc2MyVWdhV1lnS0NGcGMwNWhUaWhoZEhSeVZtRnNkV1VwS1NCN1hHNGdJQ0FnSUNBZ0lIWmhiSFZsSUQwZ2NHRnljMlZKYm5Rb1lYUjBjbFpoYkhWbExDQXhNQ2xjYmlBZ0lDQWdJSDBnWld4elpTQjdYRzRnSUNBZ0lDQWdJSFpoYkhWbElEMGdZWFIwY2xaaGJIVmxYRzRnSUNBZ0lDQjlYRzRnSUNBZ2ZWeHVYRzRnSUNBZ2JtVjNUMkpxVzJ0bGVWMGdQU0IyWVd4MVpWeHVJQ0I5S1Z4dVhHNGdJSEpsZEhWeWJpQnVaWGRQWW1wY2JuMWNibHh1WTI5dWMzUWdjM1JoWTJzZ1BTQmJYVnh1WEc1bGVIQnZjblFnWkdWbVlYVnNkQ0I3WEc0Z0lHRmtaQ2hqYjIxd2IyNWxiblFwSUh0Y2JpQWdJQ0J6ZEdGamF5NXdkWE5vS0dOdmJYQnZibVZ1ZENsY2JpQWdmU3hjYmlBZ2NtVnRiM1psS0dOdmJYQnZibVZ1ZENrZ2UxeHVJQ0FnSUdOdmJuTjBJR2x1WkdWNElEMGdjM1JoWTJzdVptbHVaRWx1WkdWNEtHTWdQVDRnVDJKcVpXTjBMbWx6S0dOdmJYQnZibVZ1ZEN3Z1l5a3BYRzRnSUNBZ2FXWWdLR2x1WkdWNElENGdMVEVwSUh0Y2JpQWdJQ0FnSUhOMFlXTnJMbk53YkdsalpTaHBibVJsZUN3Z01TbGNiaUFnSUNCOVhHNGdJSDBzWEc0Z0lHTnNiM05oWW14bEtHTnZiWEJ2Ym1WdWRDa2dlMXh1SUNBZ0lISmxkSFZ5YmlCemRHRmpheTVzWlc1bmRHZ2dQVDA5SURBZ2ZId2dUMkpxWldOMExtbHpLSE4wWVdOclczTjBZV05yTG14bGJtZDBhQ0F0SURGZExDQmpiMjF3YjI1bGJuUXBYRzRnSUgxY2JuMWNiaUlzSWk4cUtseHVJQ29nTFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMxY2JpQXFJRXhwWTJWdWMyVmtJSFZ1WkdWeUlFMUpWQ0FvYUhSMGNITTZMeTluYVhSb2RXSXVZMjl0TDNGMVlYSnJMV1JsZGk5UWFHOXViMjR0Um5KaGJXVjNiM0pyTDJKc2IySXZiV0Z6ZEdWeUwweEpRMFZPVTBVcFhHNGdLaUF0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFZ4dUlDb3ZYRzVwYlhCdmNuUWdSWFpsYm5RZ1puSnZiU0FuTGk0dkxpNHZZMjl0Ylc5dUwyVjJaVzUwY3lkY2JtbHRjRzl5ZENCRGIyMXdiMjVsYm5RZ1puSnZiU0FuTGk0dlkyOXRjRzl1Wlc1MEoxeHVhVzF3YjNKMElIc2daMlYwUVhSMGNtbGlkWFJsYzBOdmJtWnBaeUI5SUdaeWIyMGdKeTR1TDJOdmJYQnZibVZ1ZEUxaGJtRm5aWEluWEc1Y2JtTnZibk4wSUVScFlXeHZaeUE5SUNnb0tTQTlQaUI3WEc0Z0lDOHFLbHh1SUNBZ0tpQXRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMWNiaUFnSUNvZ1EyOXVjM1JoYm5SelhHNGdJQ0FxSUMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFZ4dUlDQWdLaTljYmx4dUlDQmpiMjV6ZENCT1FVMUZJRDBnSjJScFlXeHZaeWRjYmlBZ1kyOXVjM1FnVmtWU1UwbFBUaUE5SUNjeUxqQXVNQ2RjYmlBZ1kyOXVjM1FnUWtGRFMwUlNUMUJmVTBWTVJVTlVUMUlnUFNBblpHbGhiRzluTFdKaFkydGtjbTl3SjF4dUlDQmpiMjV6ZENCRVJVWkJWVXhVWDFCU1QxQkZVbFJKUlZNZ1BTQjdYRzRnSUNBZ1pXeGxiV1Z1ZERvZ2JuVnNiQ3hjYmlBZ0lDQjBhWFJzWlRvZ2JuVnNiQ3hjYmlBZ0lDQnRaWE56WVdkbE9pQnVkV3hzTEZ4dUlDQWdJR05oYm1ObGJHRmliR1U2SUhSeWRXVXNYRzRnSUgxY2JpQWdZMjl1YzNRZ1JFRlVRVjlCVkZSU1UxOVFVazlRUlZKVVNVVlRJRDBnVzF4dUlDQWdJQ2RqWVc1alpXeGhZbXhsSnl4Y2JpQWdYVnh1WEc0Z0lDOHFLbHh1SUNBZ0tpQXRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMWNiaUFnSUNvZ1EyeGhjM01nUkdWbWFXNXBkR2x2Ymx4dUlDQWdLaUF0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzFjYmlBZ0lDb3ZYRzVjYmlBZ1kyeGhjM01nUkdsaGJHOW5JR1Y0ZEdWdVpITWdRMjl0Y0c5dVpXNTBJSHRjYmx4dUlDQWdJR052Ym5OMGNuVmpkRzl5S0c5d2RHbHZibk1nUFNCN2ZTd2dkR1Z0Y0d4aGRHVWdQU0J1ZFd4c0tTQjdYRzRnSUNBZ0lDQnpkWEJsY2loT1FVMUZMQ0JXUlZKVFNVOU9MQ0JFUlVaQlZVeFVYMUJTVDFCRlVsUkpSVk1zSUc5d2RHbHZibk1zSUVSQlZFRmZRVlJVVWxOZlVGSlBVRVZTVkVsRlV5d2dkSEoxWlN3Z2RISjFaU2xjYmx4dUlDQWdJQ0FnZEdocGN5NTBaVzF3YkdGMFpTQTlJSFJsYlhCc1lYUmxJSHg4SUNjbklDdGNiaUFnSUNBZ0lDYzhaR2wySUdOc1lYTnpQVndpWkdsaGJHOW5YQ0lnZEdGaWFXNWtaWGc5WENJdE1Wd2lJSEp2YkdVOVhDSmthV0ZzYjJkY0lqNG5JQ3RjYmlBZ0lDQWdJQ0FnSnp4a2FYWWdZMnhoYzNNOVhDSmthV0ZzYjJjdGFXNXVaWEpjSWlCeWIyeGxQVndpWkc5amRXMWxiblJjSWo0bklDdGNiaUFnSUNBZ0lDQWdJQ0FuUEdScGRpQmpiR0Z6Y3oxY0ltUnBZV3h2WnkxamIyNTBaVzUwWENJK0p5QXJYRzRnSUNBZ0lDQWdJQ0FnSUNBblBHUnBkaUJqYkdGemN6MWNJbVJwWVd4dlp5MW9aV0ZrWlhKY0lqNG5JQ3RjYmlBZ0lDQWdJQ0FnSUNBZ0lDQWdKenhvTlNCamJHRnpjejFjSW1ScFlXeHZaeTEwYVhSc1pWd2lQand2YURVK0p5QXJYRzRnSUNBZ0lDQWdJQ0FnSUNBblBDOWthWFkrSnlBclhHNGdJQ0FnSUNBZ0lDQWdJQ0FuUEdScGRpQmpiR0Z6Y3oxY0ltUnBZV3h2WnkxaWIyUjVYQ0krSnlBclhHNGdJQ0FnSUNBZ0lDQWdJQ0FnSUNjOGNENDhMM0ErSnlBclhHNGdJQ0FnSUNBZ0lDQWdJQ0FuUEM5a2FYWStKeUFyWEc0Z0lDQWdJQ0FnSUNBZ0lDQW5QR1JwZGlCamJHRnpjejFjSW1ScFlXeHZaeTFtYjI5MFpYSmNJajRuSUN0Y2JpQWdJQ0FnSUNBZ0lDQWdJQ0FnSnp4aWRYUjBiMjRnZEhsd1pUMWNJbUoxZEhSdmJsd2lJR05zWVhOelBWd2lZblJ1SUdKMGJpMXdjbWx0WVhKNVhDSWdaR0YwWVMxa2FYTnRhWE56UFZ3aVpHbGhiRzluWENJK1QyczhMMkoxZEhSdmJqNG5JQ3RjYmlBZ0lDQWdJQ0FnSUNBZ0lDYzhMMlJwZGo0bklDdGNiaUFnSUNBZ0lDQWdJQ0FuUEM5a2FYWStKeUFyWEc0Z0lDQWdJQ0FnSUNjOEwyUnBkajRuSUN0Y2JpQWdJQ0FnSUNjOEwyUnBkajRuWEc1Y2JpQWdJQ0FnSUdsbUlDaDBhR2x6TG1SNWJtRnRhV05GYkdWdFpXNTBLU0I3WEc0Z0lDQWdJQ0FnSUhSb2FYTXVZblZwYkdRb0tWeHVJQ0FnSUNBZ2ZWeHVJQ0FnSUgxY2JseHVJQ0FnSUdKMWFXeGtLQ2tnZTF4dUlDQWdJQ0FnWTI5dWMzUWdZblZwYkdSbGNpQTlJR1J2WTNWdFpXNTBMbU55WldGMFpVVnNaVzFsYm5Rb0oyUnBkaWNwWEc1Y2JpQWdJQ0FnSUdKMWFXeGtaWEl1YVc1dVpYSklWRTFNSUQwZ2RHaHBjeTUwWlcxd2JHRjBaVnh1WEc0Z0lDQWdJQ0IwYUdsekxtOXdkR2x2Ym5NdVpXeGxiV1Z1ZENBOUlHSjFhV3hrWlhJdVptbHljM1JEYUdsc1pGeHVYRzRnSUNBZ0lDQXZMeUIwYVhSc1pWeHVJQ0FnSUNBZ2FXWWdLSFJvYVhNdWIzQjBhVzl1Y3k1MGFYUnNaU0FoUFQwZ2JuVnNiQ2tnZTF4dUlDQWdJQ0FnSUNCMGFHbHpMbTl3ZEdsdmJuTXVaV3hsYldWdWRDNXhkV1Z5ZVZObGJHVmpkRzl5S0NjdVpHbGhiRzluTFhScGRHeGxKeWt1YVc1dVpYSklWRTFNSUQwZ2RHaHBjeTV2Y0hScGIyNXpMblJwZEd4bFhHNGdJQ0FnSUNCOVhHNWNiaUFnSUNBZ0lDOHZJRzFsYzNOaFoyVmNiaUFnSUNBZ0lHbG1JQ2gwYUdsekxtOXdkR2x2Ym5NdWJXVnpjMkZuWlNBaFBUMGdiblZzYkNrZ2UxeHVJQ0FnSUNBZ0lDQjBhR2x6TG05d2RHbHZibk11Wld4bGJXVnVkQzV4ZFdWeWVWTmxiR1ZqZEc5eUtDY3VaR2xoYkc5bkxXSnZaSGtuS1M1bWFYSnpkRU5vYVd4a0xtbHVibVZ5U0ZSTlRDQTlJSFJvYVhNdWIzQjBhVzl1Y3k1dFpYTnpZV2RsWEc0Z0lDQWdJQ0I5WEc1Y2JpQWdJQ0FnSUdSdlkzVnRaVzUwTG1KdlpIa3VZWEJ3Wlc1a1EyaHBiR1FvZEdocGN5NXZjSFJwYjI1ekxtVnNaVzFsYm5RcFhHNWNiaUFnSUNBZ0lIUm9hWE11YzJWMFFYUjBjbWxpZFhSbGN5Z3BYRzRnSUNBZ2ZWeHVYRzRnSUNBZ1luVnBiR1JDWVdOclpISnZjQ2dwSUh0Y2JpQWdJQ0FnSUdOdmJuTjBJR0poWTJ0a2NtOXdJRDBnWkc5amRXMWxiblF1WTNKbFlYUmxSV3hsYldWdWRDZ25aR2wySnlsY2JpQWdJQ0FnSUdKaFkydGtjbTl3TG5ObGRFRjBkSEpwWW5WMFpTZ25aR0YwWVMxcFpDY3NJSFJvYVhNdWFXUXBYRzRnSUNBZ0lDQmlZV05yWkhKdmNDNWpiR0Z6YzB4cGMzUXVZV1JrS0VKQlEwdEVVazlRWDFORlRFVkRWRTlTS1Z4dVhHNGdJQ0FnSUNCa2IyTjFiV1Z1ZEM1aWIyUjVMbUZ3Y0dWdVpFTm9hV3hrS0dKaFkydGtjbTl3S1Z4dUlDQWdJSDFjYmx4dUlDQWdJR2RsZEVKaFkydGtjbTl3S0NrZ2UxeHVJQ0FnSUNBZ2NtVjBkWEp1SUdSdlkzVnRaVzUwTG5GMVpYSjVVMlZzWldOMGIzSW9ZQzRrZTBKQlEwdEVVazlRWDFORlRFVkRWRTlTZlZ0a1lYUmhMV2xrUFZ3aUpIdDBhR2x6TG1sa2ZWd2lYV0FwWEc0Z0lDQWdmVnh1WEc0Z0lDQWdZMlZ1ZEdWeUtDa2dlMXh1SUNBZ0lDQWdZMjl1YzNRZ1kyOXRjSFYwWldSVGRIbHNaU0E5SUhkcGJtUnZkeTVuWlhSRGIyMXdkWFJsWkZOMGVXeGxLSFJvYVhNdWIzQjBhVzl1Y3k1bGJHVnRaVzUwS1Z4dUlDQWdJQ0FnTHk4Z1kyOXVjM1FnZDJsa2RHZ2dQU0JqYjIxd2RYUmxaRk4wZVd4bExuZHBaSFJvTG5Oc2FXTmxLREFzSUdOdmJYQjFkR1ZrVTNSNWJHVXVkMmxrZEdndWJHVnVaM1JvSUMwZ01pbGNiaUFnSUNBZ0lHTnZibk4wSUdobGFXZG9kQ0E5SUdOdmJYQjFkR1ZrVTNSNWJHVXVhR1ZwWjJoMExuTnNhV05sS0RBc0lHTnZiWEIxZEdWa1UzUjViR1V1YUdWcFoyaDBMbXhsYm1kMGFDQXRJRElwWEc1Y2JpQWdJQ0FnSUdOdmJuTjBJSFJ2Y0NBOUlDaDNhVzVrYjNjdWFXNXVaWEpJWldsbmFIUWdMeUF5S1NBdElDaG9aV2xuYUhRZ0x5QXlLVnh1SUNBZ0lDQWdkR2hwY3k1dmNIUnBiMjV6TG1Wc1pXMWxiblF1YzNSNWJHVXVkRzl3SUQwZ1lDUjdkRzl3ZlhCNFlGeHVJQ0FnSUgxY2JseHVJQ0FnSUhOb2IzY29LU0I3WEc0Z0lDQWdJQ0JwWmlBb2RHaHBjeTV2Y0hScGIyNXpMbVZzWlcxbGJuUWdQVDA5SUc1MWJHd3BJSHRjYmlBZ0lDQWdJQ0FnTHk4Z1luVnBiR1FnWVc1a0lHbHVjMlZ5ZENCaElHNWxkeUJFVDAwZ1pXeGxiV1Z1ZEZ4dUlDQWdJQ0FnSUNCMGFHbHpMbUoxYVd4a0tDbGNiaUFnSUNBZ0lIMWNibHh1SUNBZ0lDQWdhV1lnS0hSb2FYTXViM0IwYVc5dWN5NWxiR1Z0Wlc1MExtTnNZWE56VEdsemRDNWpiMjUwWVdsdWN5Z25jMmh2ZHljcEtTQjdYRzRnSUNBZ0lDQWdJSEpsZEhWeWJpQm1ZV3h6WlZ4dUlDQWdJQ0FnZlZ4dVhHNGdJQ0FnSUNBdkx5QmhaR1FnWVNCMGFXMWxiM1YwSUhOdklIUm9ZWFFnZEdobElFTlRVeUJoYm1sdFlYUnBiMjRnZDI5eWEzTmNiaUFnSUNBZ0lITmxkRlJwYldWdmRYUW9LQ2tnUFQ0Z2UxeHVJQ0FnSUNBZ0lDQjBhR2x6TG5SeWFXZG5aWEpGZG1WdWRDaEZkbVZ1ZEM1VFNFOVhLVnh1SUNBZ0lDQWdJQ0IwYUdsekxtSjFhV3hrUW1GamEyUnliM0FvS1Z4dVhHNGdJQ0FnSUNBZ0lHTnZibk4wSUc5dVUyaHZkMjRnUFNBb0tTQTlQaUI3WEc0Z0lDQWdJQ0FnSUNBZ2RHaHBjeTUwY21sbloyVnlSWFpsYm5Rb1JYWmxiblF1VTBoUFYwNHBYRzRnSUNBZ0lDQWdJQ0FnZEdocGN5NXZjSFJwYjI1ekxtVnNaVzFsYm5RdWNtVnRiM1psUlhabGJuUk1hWE4wWlc1bGNpaEZkbVZ1ZEM1VVVrRk9VMGxVU1U5T1gwVk9SQ3dnYjI1VGFHOTNiaWxjYmx4dUlDQWdJQ0FnSUNBZ0lDOHZJR0YwZEdGamFDQmxkbVZ1ZEZ4dUlDQWdJQ0FnSUNBZ0lIUm9hWE11WVhSMFlXTm9SWFpsYm5SektDbGNiaUFnSUNBZ0lDQWdmVnh1WEc0Z0lDQWdJQ0FnSUhSb2FYTXViM0IwYVc5dWN5NWxiR1Z0Wlc1MExtRmtaRVYyWlc1MFRHbHpkR1Z1WlhJb1JYWmxiblF1VkZKQlRsTkpWRWxQVGw5RlRrUXNJRzl1VTJodmQyNHBYRzVjYmlBZ0lDQWdJQ0FnZEdocGN5NXZjSFJwYjI1ekxtVnNaVzFsYm5RdVkyeGhjM05NYVhOMExtRmtaQ2duYzJodmR5Y3BYRzVjYmlBZ0lDQWdJQ0FnZEdocGN5NWpaVzUwWlhJb0tWeHVJQ0FnSUNBZ2ZTd2dNVEFwWEc1Y2JpQWdJQ0FnSUhKbGRIVnliaUIwY25WbFhHNGdJQ0FnZlZ4dVhHNGdJQ0FnYjI1RmJHVnRaVzUwUlhabGJuUW9aWFpsYm5RcElIdGNiaUFnSUNBZ0lHbG1JQ2hsZG1WdWRDNTBlWEJsSUQwOVBTQW5hMlY1ZFhBbklDWW1JR1YyWlc1MExtdGxlVU52WkdVZ0lUMDlJREkzSUNZbUlHVjJaVzUwTG10bGVVTnZaR1VnSVQwOUlERXpLU0I3WEc0Z0lDQWdJQ0FnSUhKbGRIVnlibHh1SUNBZ0lDQWdmVnh1WEc0Z0lDQWdJQ0F2THlCb2FXUmxJSFJvWlNCa2FXRnNiMmRjYmlBZ0lDQWdJSFJvYVhNdWFHbGtaU2dwWEc0Z0lDQWdmVnh1WEc0Z0lDQWdhR2xrWlNncElIdGNiaUFnSUNBZ0lHbG1JQ2doZEdocGN5NXZjSFJwYjI1ekxtVnNaVzFsYm5RdVkyeGhjM05NYVhOMExtTnZiblJoYVc1ektDZHphRzkzSnlrcElIdGNiaUFnSUNBZ0lDQWdjbVYwZFhKdUlHWmhiSE5sWEc0Z0lDQWdJQ0I5WEc1Y2JpQWdJQ0FnSUhSb2FYTXVkSEpwWjJkbGNrVjJaVzUwS0VWMlpXNTBMa2hKUkVVcFhHNWNiaUFnSUNBZ0lIUm9hWE11WkdWMFlXTm9SWFpsYm5SektDbGNibHh1SUNBZ0lDQWdkR2hwY3k1dmNIUnBiMjV6TG1Wc1pXMWxiblF1WTJ4aGMzTk1hWE4wTG1Ga1pDZ25hR2xrWlNjcFhHNGdJQ0FnSUNCMGFHbHpMbTl3ZEdsdmJuTXVaV3hsYldWdWRDNWpiR0Z6YzB4cGMzUXVjbVZ0YjNabEtDZHphRzkzSnlsY2JseHVJQ0FnSUNBZ1kyOXVjM1FnWW1GamEyUnliM0FnUFNCMGFHbHpMbWRsZEVKaFkydGtjbTl3S0NsY2JseHVJQ0FnSUNBZ1kyOXVjM1FnYjI1SWFXUmtaVzRnUFNBb0tTQTlQaUI3WEc0Z0lDQWdJQ0FnSUdSdlkzVnRaVzUwTG1KdlpIa3VjbVZ0YjNabFEyaHBiR1FvWW1GamEyUnliM0FwWEc1Y2JpQWdJQ0FnSUNBZ2RHaHBjeTV2Y0hScGIyNXpMbVZzWlcxbGJuUXVZMnhoYzNOTWFYTjBMbkpsYlc5MlpTZ25hR2xrWlNjcFhHNWNiaUFnSUNBZ0lDQWdkR2hwY3k1MGNtbG5aMlZ5UlhabGJuUW9SWFpsYm5RdVNFbEVSRVZPS1Z4dVhHNGdJQ0FnSUNBZ0lHSmhZMnRrY205d0xuSmxiVzkyWlVWMlpXNTBUR2x6ZEdWdVpYSW9SWFpsYm5RdVZGSkJUbE5KVkVsUFRsOUZUa1FzSUc5dVNHbGtaR1Z1S1Z4dVhHNGdJQ0FnSUNBZ0lDOHZJSEpsYlc5MlpTQm5aVzVsY21GMFpXUWdaR2xoYkc5bmN5Qm1jbTl0SUhSb1pTQkVUMDFjYmlBZ0lDQWdJQ0FnYVdZZ0tIUm9hWE11WkhsdVlXMXBZMFZzWlcxbGJuUXBJSHRjYmlBZ0lDQWdJQ0FnSUNCa2IyTjFiV1Z1ZEM1aWIyUjVMbkpsYlc5MlpVTm9hV3hrS0hSb2FYTXViM0IwYVc5dWN5NWxiR1Z0Wlc1MEtWeHVJQ0FnSUNBZ0lDQWdJSFJvYVhNdWIzQjBhVzl1Y3k1bGJHVnRaVzUwSUQwZ2JuVnNiRnh1SUNBZ0lDQWdJQ0I5WEc0Z0lDQWdJQ0I5WEc1Y2JpQWdJQ0FnSUdKaFkydGtjbTl3TG1Ga1pFVjJaVzUwVEdsemRHVnVaWElvUlhabGJuUXVWRkpCVGxOSlZFbFBUbDlGVGtRc0lHOXVTR2xrWkdWdUtWeHVJQ0FnSUNBZ1ltRmphMlJ5YjNBdVkyeGhjM05NYVhOMExtRmtaQ2duWm1Ga1pXOTFkQ2NwWEc1Y2JpQWdJQ0FnSUhKbGRIVnliaUIwY25WbFhHNGdJQ0FnZlZ4dVhHNGdJQ0FnWVhSMFlXTm9SWFpsYm5SektDa2dlMXh1SUNBZ0lDQWdZMjl1YzNRZ1pHbHpiV2x6YzBKMWRIUnZibk1nUFNCMGFHbHpMbTl3ZEdsdmJuTXVaV3hsYldWdWRDNXhkV1Z5ZVZObGJHVmpkRzl5UVd4c0tDZGJaR0YwWVMxa2FYTnRhWE56WFNjcFhHNGdJQ0FnSUNCcFppQW9aR2x6YldsemMwSjFkSFJ2Ym5NcElIdGNiaUFnSUNBZ0lDQWdRWEp5WVhrdVpuSnZiU2hrYVhOdGFYTnpRblYwZEc5dWN5a3VabTl5UldGamFDaGlkWFIwYjI0Z1BUNGdkR2hwY3k1eVpXZHBjM1JsY2tWc1pXMWxiblFvZXlCMFlYSm5aWFE2SUdKMWRIUnZiaXdnWlhabGJuUTZJQ2RqYkdsamF5Y2dmU2twWEc0Z0lDQWdJQ0I5WEc1Y2JpQWdJQ0FnSUM4dklHRmtaQ0JsZG1WdWRITWdhV1lnZEdobElHUnBZV3h2WnlCcGN5QmpZVzVqWld4aFlteGxYRzRnSUNBZ0lDQXZMeUIzYUdsamFDQnRaV0Z1Y3lCMGFHVWdkWE5sY2lCallXNGdhR2xrWlNCMGFHVWdaR2xoYkc5blhHNGdJQ0FnSUNBdkx5QmllU0J3Y21WemMybHVaeUIwYUdVZ1JWTkRJR3RsZVNCdmNpQmpiR2xqYXlCdmRYUnphV1JsSUhSb1pTQmlZV05yWkhKdmNGeHVJQ0FnSUNBZ2FXWWdLSFJvYVhNdWIzQjBhVzl1Y3k1allXNWpaV3hoWW14bEtTQjdYRzRnSUNBZ0lDQWdJR052Ym5OMElHSmhZMnRrY205d0lEMGdkR2hwY3k1blpYUkNZV05yWkhKdmNDZ3BYRzRnSUNBZ0lDQWdJSFJvYVhNdWNtVm5hWE4wWlhKRmJHVnRaVzUwS0hzZ2RHRnlaMlYwT2lCaVlXTnJaSEp2Y0N3Z1pYWmxiblE2SUVWMlpXNTBMbE5VUVZKVUlIMHBYRzRnSUNBZ0lDQWdJSFJvYVhNdWNtVm5hWE4wWlhKRmJHVnRaVzUwS0hzZ2RHRnlaMlYwT2lCa2IyTjFiV1Z1ZEN3Z1pYWmxiblE2SUNkclpYbDFjQ2NnZlNsY2JpQWdJQ0FnSUgxY2JpQWdJQ0I5WEc1Y2JpQWdJQ0JrWlhSaFkyaEZkbVZ1ZEhNb0tTQjdYRzRnSUNBZ0lDQmpiMjV6ZENCa2FYTnRhWE56UW5WMGRHOXVjeUE5SUhSb2FYTXViM0IwYVc5dWN5NWxiR1Z0Wlc1MExuRjFaWEo1VTJWc1pXTjBiM0pCYkd3b0oxdGtZWFJoTFdScGMyMXBjM05kSnlsY2JpQWdJQ0FnSUdsbUlDaGthWE50YVhOelFuVjBkRzl1Y3lrZ2UxeHVJQ0FnSUNBZ0lDQkJjbkpoZVM1bWNtOXRLR1JwYzIxcGMzTkNkWFIwYjI1ektTNW1iM0pGWVdOb0tHSjFkSFJ2YmlBOVBpQjBhR2x6TG5WdWNtVm5hWE4wWlhKRmJHVnRaVzUwS0hzZ2RHRnlaMlYwT2lCaWRYUjBiMjRzSUdWMlpXNTBPaUFuWTJ4cFkyc25JSDBwS1Z4dUlDQWdJQ0FnZlZ4dVhHNGdJQ0FnSUNCcFppQW9kR2hwY3k1dmNIUnBiMjV6TG1OaGJtTmxiR0ZpYkdVcElIdGNiaUFnSUNBZ0lDQWdZMjl1YzNRZ1ltRmphMlJ5YjNBZ1BTQjBhR2x6TG1kbGRFSmhZMnRrY205d0tDbGNiaUFnSUNBZ0lDQWdkR2hwY3k1MWJuSmxaMmx6ZEdWeVJXeGxiV1Z1ZENoN0lIUmhjbWRsZERvZ1ltRmphMlJ5YjNBc0lHVjJaVzUwT2lCRmRtVnVkQzVUVkVGU1ZDQjlLVnh1SUNBZ0lDQWdJQ0IwYUdsekxuVnVjbVZuYVhOMFpYSkZiR1Z0Wlc1MEtIc2dkR0Z5WjJWME9pQmtiMk4xYldWdWRDd2daWFpsYm5RNklDZHJaWGwxY0NjZ2ZTbGNiaUFnSUNBZ0lIMWNiaUFnSUNCOVhHNWNiaUFnSUNCemRHRjBhV01nYVdSbGJuUnBabWxsY2lncElIdGNiaUFnSUNBZ0lISmxkSFZ5YmlCT1FVMUZYRzRnSUNBZ2ZWeHVYRzRnSUNBZ2MzUmhkR2xqSUY5RVQwMUpiblJsY21aaFkyVW9iM0IwYVc5dWN5a2dlMXh1SUNBZ0lDQWdjbVYwZFhKdUlITjFjR1Z5TGw5RVQwMUpiblJsY21aaFkyVW9SR2xoYkc5bkxDQnZjSFJwYjI1ektWeHVJQ0FnSUgxY2JpQWdmVnh1WEc0Z0lDOHFLbHh1SUNBZ0tpQXRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMWNiaUFnSUNvZ1JFOU5JRUZ3YVNCcGJYQnNaVzFsYm5SaGRHbHZibHh1SUNBZ0tpQXRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMWNiaUFnSUNvdlhHNGdJR052Ym5OMElHTnZiWEJ2Ym1WdWRITWdQU0JiWFZ4dVhHNGdJR052Ym5OMElHUnBZV3h2WjNNZ1BTQmtiMk4xYldWdWRDNXhkV1Z5ZVZObGJHVmpkRzl5UVd4c0tHQXVKSHRPUVUxRmZXQXBYRzRnSUdsbUlDaGthV0ZzYjJkektTQjdYRzRnSUNBZ1FYSnlZWGt1Wm5KdmJTaGthV0ZzYjJkektTNW1iM0pGWVdOb0tDaGxiR1Z0Wlc1MEtTQTlQaUI3WEc0Z0lDQWdJQ0JqYjI1emRDQmpiMjVtYVdjZ1BTQm5aWFJCZEhSeWFXSjFkR1Z6UTI5dVptbG5LR1ZzWlcxbGJuUXNJRVJGUmtGVlRGUmZVRkpQVUVWU1ZFbEZVeXdnUkVGVVFWOUJWRlJTVTE5UVVrOVFSVkpVU1VWVEtWeHVJQ0FnSUNBZ1kyOXVabWxuTG1Wc1pXMWxiblFnUFNCbGJHVnRaVzUwWEc1Y2JpQWdJQ0FnSUdOdmJYQnZibVZ1ZEhNdWNIVnphQ2g3SUdWc1pXMWxiblFzSUdScFlXeHZaem9nYm1WM0lFUnBZV3h2WnloamIyNW1hV2NwSUgwcFhHNGdJQ0FnZlNsY2JpQWdmVnh1WEc0Z0lHbG1JQ2hrYVdGc2IyZHpLU0I3WEc0Z0lDQWdaRzlqZFcxbGJuUXVZV1JrUlhabGJuUk1hWE4wWlc1bGNpZ25ZMnhwWTJzbkxDQW9aWFpsYm5RcElEMCtJSHRjYmlBZ0lDQWdJR052Ym5OMElHUmhkR0ZVYjJkbmJHVkJkSFJ5SUQwZ1pYWmxiblF1ZEdGeVoyVjBMbWRsZEVGMGRISnBZblYwWlNnblpHRjBZUzEwYjJkbmJHVW5LVnh1SUNBZ0lDQWdhV1lnS0dSaGRHRlViMmRuYkdWQmRIUnlJQ1ltSUdSaGRHRlViMmRuYkdWQmRIUnlJRDA5UFNCT1FVMUZLU0I3WEc0Z0lDQWdJQ0FnSUdOdmJuTjBJR2xrSUQwZ1pYWmxiblF1ZEdGeVoyVjBMbWRsZEVGMGRISnBZblYwWlNnblpHRjBZUzEwWVhKblpYUW5LVnh1SUNBZ0lDQWdJQ0JqYjI1emRDQmxiR1Z0Wlc1MElEMGdaRzlqZFcxbGJuUXVjWFZsY25sVFpXeGxZM1J2Y2locFpDbGNibHh1SUNBZ0lDQWdJQ0JqYjI1emRDQmpiMjF3YjI1bGJuUWdQU0JqYjIxd2IyNWxiblJ6TG1acGJtUW9ZeUE5UGlCakxtVnNaVzFsYm5RZ1BUMDlJR1ZzWlcxbGJuUXBYRzVjYmlBZ0lDQWdJQ0FnYVdZZ0tDRmpiMjF3YjI1bGJuUXBJSHRjYmlBZ0lDQWdJQ0FnSUNCeVpYUjFjbTVjYmlBZ0lDQWdJQ0FnZlZ4dVhHNGdJQ0FnSUNBZ0lDOHZJSEpsYlc5MlpTQjBhR1VnWm05amRYTWdjM1JoZEdVZ2IyWWdkR2hsSUhSeWFXZG5aWEpjYmlBZ0lDQWdJQ0FnWlhabGJuUXVkR0Z5WjJWMExtSnNkWElvS1Z4dVhHNGdJQ0FnSUNBZ0lHTnZiWEJ2Ym1WdWRDNWthV0ZzYjJjdWMyaHZkeWdwWEc0Z0lDQWdJQ0I5WEc0Z0lDQWdmU2xjYmlBZ2ZWeHVYRzRnSUhKbGRIVnliaUJFYVdGc2IyZGNibjBwS0NsY2JseHVaWGh3YjNKMElHUmxabUYxYkhRZ1JHbGhiRzluWEc0aUxDSXZLaXBjYmlBcUlDMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRYRzRnS2lCTWFXTmxibk5sWkNCMWJtUmxjaUJOU1ZRZ0tHaDBkSEJ6T2k4dloybDBhSFZpTG1OdmJTOXhkV0Z5YXkxa1pYWXZVR2h2Ym05dUxVWnlZVzFsZDI5eWF5OWliRzlpTDIxaGMzUmxjaTlNU1VORlRsTkZLVnh1SUNvZ0xTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMWNiaUFxTDF4dWFXMXdiM0owSUVScFlXeHZaeUJtY205dElDY3VMMmx1WkdWNEoxeHVhVzF3YjNKMElIc2dabWx1WkZSaGNtZGxkRUo1UTJ4aGMzTWdmU0JtY205dElDY3VMaTh1TGk5amIyMXRiMjR2ZFhScGJITW5YRzVwYlhCdmNuUWdleUJuWlhSQmRIUnlhV0oxZEdWelEyOXVabWxuSUgwZ1puSnZiU0FuTGk0dlkyOXRjRzl1Wlc1MFRXRnVZV2RsY2lkY2JseHVZMjl1YzNRZ1VISnZiWEIwSUQwZ0tDZ3BJRDArSUh0Y2JseHVJQ0F2S2lwY2JpQWdJQ29nTFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0WEc0Z0lDQXFJRU52Ym5OMFlXNTBjMXh1SUNBZ0tpQXRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMWNiaUFnSUNvdlhHNWNiaUFnWTI5dWMzUWdUa0ZOUlNBOUlDZGthV0ZzYjJjblhHNGdJR052Ym5OMElFSkJRMHRFVWs5UVgxTkZURVZEVkU5U0lEMGdKMlJwWVd4dlp5MWlZV05yWkhKdmNDZGNiaUFnWTI5dWMzUWdSRVZHUVZWTVZGOVFVazlRUlZKVVNVVlRJRDBnZTF4dUlDQWdJR1ZzWlcxbGJuUTZJRzUxYkd3c1hHNGdJQ0FnZEdsMGJHVTZJRzUxYkd3c1hHNGdJQ0FnYldWemMyRm5aVG9nYm5Wc2JDeGNiaUFnSUNCallXNWpaV3hoWW14bE9pQjBjblZsTEZ4dUlDQjlYRzRnSUdOdmJuTjBJRVJCVkVGZlFWUlVVbE5mVUZKUFVFVlNWRWxGVXlBOUlGdGNiaUFnSUNBblkyRnVZMlZzWVdKc1pTY3NYRzRnSUYxY2JseHVJQ0F2S2lwY2JpQWdJQ29nTFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0WEc0Z0lDQXFJRU5zWVhOeklFUmxabWx1YVhScGIyNWNiaUFnSUNvZ0xTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdFhHNGdJQ0FxTDF4dVhHNGdJR05zWVhOeklGQnliMjF3ZENCbGVIUmxibVJ6SUVScFlXeHZaeUI3WEc1Y2JpQWdJQ0JqYjI1emRISjFZM1J2Y2lodmNIUnBiMjV6SUQwZ2UzMHBJSHRjYmlBZ0lDQWdJR052Ym5OMElIUmxiWEJzWVhSbElEMGdKeWNnSzF4dUlDQWdJQ0FnSnp4a2FYWWdZMnhoYzNNOVhDSmthV0ZzYjJkY0lpQjBZV0pwYm1SbGVEMWNJaTB4WENJZ2NtOXNaVDFjSW1ScFlXeHZaMXdpUGljZ0sxeHVJQ0FnSUNBZ0lDQW5QR1JwZGlCamJHRnpjejFjSW1ScFlXeHZaeTFwYm01bGNsd2lJSEp2YkdVOVhDSmtiMk4xYldWdWRGd2lQaWNnSzF4dUlDQWdJQ0FnSUNBZ0lDYzhaR2wySUdOc1lYTnpQVndpWkdsaGJHOW5MV052Ym5SbGJuUmNJajRuSUN0Y2JpQWdJQ0FnSUNBZ0lDQWdJQ2M4WkdsMklHTnNZWE56UFZ3aVpHbGhiRzluTFdobFlXUmxjbHdpUGljZ0sxeHVJQ0FnSUNBZ0lDQWdJQ0FnSUNBblBHZzFJR05zWVhOelBWd2laR2xoYkc5bkxYUnBkR3hsWENJK1BDOW9OVDRuSUN0Y2JpQWdJQ0FnSUNBZ0lDQWdJQ2M4TDJScGRqNG5JQ3RjYmlBZ0lDQWdJQ0FnSUNBZ0lDYzhaR2wySUdOc1lYTnpQVndpWkdsaGJHOW5MV0p2WkhsY0lqNG5JQ3RjYmlBZ0lDQWdJQ0FnSUNBZ0lDQWdKenhwYm5CMWRDQmpiR0Z6Y3oxY0ltWnZjbTB0WTI5dWRISnZiRndpSUhSNWNHVTlYQ0owWlhoMFhDSWdkbUZzZFdVOVhDSmNJajRuSUN0Y2JpQWdJQ0FnSUNBZ0lDQWdJQ2M4TDJScGRqNG5JQ3RjYmlBZ0lDQWdJQ0FnSUNBZ0lDYzhaR2wySUdOc1lYTnpQVndpWkdsaGJHOW5MV1p2YjNSbGNsd2lQaWNnSzF4dUlDQWdJQ0FnSUNBZ0lDQWdJQ0FuUEdKMWRIUnZiaUIwZVhCbFBWd2lZblYwZEc5dVhDSWdZMnhoYzNNOVhDSmlkRzRnWW5SdUxYQnlhVzFoY25sY0lpQmtZWFJoTFdScGMyMXBjM005WENKa2FXRnNiMmRjSWo1UGF6d3ZZblYwZEc5dVBpY2dLMXh1SUNBZ0lDQWdJQ0FnSUNBZ0p6d3ZaR2wyUGljZ0sxeHVJQ0FnSUNBZ0lDQWdJQ2M4TDJScGRqNG5JQ3RjYmlBZ0lDQWdJQ0FnSnp3dlpHbDJQaWNnSzF4dUlDQWdJQ0FnSnp3dlpHbDJQaWRjYmx4dUlDQWdJQ0FnYzNWd1pYSW9iM0IwYVc5dWN5d2dkR1Z0Y0d4aGRHVXBYRzRnSUNBZ2ZWeHVYRzRnSUNBZ2MzUmhkR2xqSUY5RVQwMUpiblJsY21aaFkyVW9iM0IwYVc5dWN5a2dlMXh1SUNBZ0lDQWdjbVYwZFhKdUlHNWxkeUJRY205dGNIUW9iM0IwYVc5dWN5bGNiaUFnSUNCOVhHNGdJSDFjYmx4dUlDQXZLaXBjYmlBZ0lDb2dMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRYRzRnSUNBcUlFUlBUU0JCY0drZ2FXMXdiR1Z0Wlc1MFlYUnBiMjVjYmlBZ0lDb2dMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRYRzRnSUNBcUwxeHVJQ0JqYjI1emRDQmpiMjF3YjI1bGJuUnpJRDBnVzExY2JpQWdZMjl1YzNRZ1pHbGhiRzluY3lBOUlHUnZZM1Z0Wlc1MExuRjFaWEo1VTJWc1pXTjBiM0pCYkd3b1lDNGtlMDVCVFVWOVlDbGNibHh1SUNCcFppQW9aR2xoYkc5bmN5a2dlMXh1SUNBZ0lFRnljbUY1TG1aeWIyMG9aR2xoYkc5bmN5a3VabTl5UldGamFDZ29aV3hsYldWdWRDa2dQVDRnZTF4dUlDQWdJQ0FnWTI5dWMzUWdZMjl1Wm1sbklEMGdaMlYwUVhSMGNtbGlkWFJsYzBOdmJtWnBaeWhsYkdWdFpXNTBMQ0JFUlVaQlZVeFVYMUJTVDFCRlVsUkpSVk1zSUVSQlZFRmZRVlJVVWxOZlVGSlBVRVZTVkVsRlV5bGNiaUFnSUNBZ0lHTnZibVpwWnk1bGJHVnRaVzUwSUQwZ1pXeGxiV1Z1ZEZ4dVhHNGdJQ0FnSUNCcFppQW9ZMjl1Wm1sbkxuUjVjR1VnUFQwOUlDZGhiR1Z5ZENjcElIdGNiaUFnSUNBZ0lDQWdMeThnY0hKdmJYQjBYRzRnSUNBZ0lDQWdJR052YlhCdmJtVnVkSE11Y0hWemFDaHVaWGNnVUhKdmJYQjBLR052Ym1acFp5a3BYRzRnSUNBZ0lDQjlYRzRnSUNBZ2ZTbGNiaUFnZlZ4dVhHNGdJR2xtSUNoa2FXRnNiMmR6S1NCN1hHNGdJQ0FnWkc5amRXMWxiblF1WVdSa1JYWmxiblJNYVhOMFpXNWxjaWduWTJ4cFkyc25MQ0FvWlhabGJuUXBJRDArSUh0Y2JpQWdJQ0FnSUdOdmJuTjBJR1J5YjNCa2IzZHVUV1Z1ZFNBOUlHWnBibVJVWVhKblpYUkNlVU5zWVhOektHVjJaVzUwTG5SaGNtZGxkQ3dnSjJSeWIzQmtiM2R1TFcxbGJuVW5LVnh1SUNBZ0lDQWdhV1lnS0dSeWIzQmtiM2R1VFdWdWRTa2dlMXh1SUNBZ0lDQWdJQ0J5WlhSMWNtNWNiaUFnSUNBZ0lIMWNibHh1SUNBZ0lDQWdZMjl1YzNRZ1pISnZjR1J2ZDI0Z1BTQm1hVzVrVkdGeVoyVjBRbmxEYkdGemN5aGxkbVZ1ZEM1MFlYSm5aWFFzSUNka2NtOXdaRzkzYmljcFhHNWNiaUFnSUNBZ0lHbG1JQ2hrY205d1pHOTNiaWtnZTF4dUlDQWdJQ0FnSUNCamIyNXpkQ0JrWVhSaFZHOW5aMnhsUVhSMGNpQTlJR1J5YjNCa2IzZHVMbWRsZEVGMGRISnBZblYwWlNnblpHRjBZUzEwYjJkbmJHVW5LVnh1SUNBZ0lDQWdJQ0JwWmlBb1pHRjBZVlJ2WjJkc1pVRjBkSElnSmlZZ1pHRjBZVlJ2WjJkc1pVRjBkSElnUFQwOUlFNUJUVVVnSmlZZ1pISnZjR1J2ZDI0cElIdGNiaUFnSUNBZ0lDQWdJQ0JqYjI1emRDQmpiMjF3YjI1bGJuUWdQU0JqYjIxd2IyNWxiblJ6TG1acGJtUW9ZeUE5UGlCakxtZGxkRVZzWlcxbGJuUW9LU0E5UFQwZ1pISnZjR1J2ZDI0cFhHNWNiaUFnSUNBZ0lDQWdJQ0JwWmlBb0lXTnZiWEJ2Ym1WdWRDa2dlMXh1SUNBZ0lDQWdJQ0FnSUNBZ2NtVjBkWEp1WEc0Z0lDQWdJQ0FnSUNBZ2ZWeHVYRzRnSUNBZ0lDQWdJQ0FnWTI5dGNHOXVaVzUwTG5SdloyZHNaU2dwWEc0Z0lDQWdJQ0FnSUgxY2JpQWdJQ0FnSUgxY2JpQWdJQ0I5S1Z4dUlDQjlYRzVjYmlBZ2NtVjBkWEp1SUZCeWIyMXdkRnh1ZlNrb0tWeHVYRzVsZUhCdmNuUWdaR1ZtWVhWc2RDQlFjbTl0Y0hSY2JpSXNJaThxS2x4dUlDb2dMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzFjYmlBcUlFeHBZMlZ1YzJWa0lIVnVaR1Z5SUUxSlZDQW9hSFIwY0hNNkx5OW5hWFJvZFdJdVkyOXRMM0YxWVhKckxXUmxkaTlRYUc5dWIyNHRSbkpoYldWM2IzSnJMMkpzYjJJdmJXRnpkR1Z5TDB4SlEwVk9VMFVwWEc0Z0tpQXRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMVnh1SUNvdlhHNXBiWEJ2Y25RZ1EyOXRjRzl1Wlc1MElHWnliMjBnSnk0dUwyTnZiWEJ2Ym1WdWRDZGNibWx0Y0c5eWRDQkZkbVZ1ZENCbWNtOXRJQ2N1TGk4dUxpOWpiMjF0YjI0dlpYWmxiblJ6SjF4dWFXMXdiM0owSUhzZ1ptbHVaRlJoY21kbGRFSjVRMnhoYzNNZ2ZTQm1jbTl0SUNjdUxpOHVMaTlqYjIxdGIyNHZkWFJwYkhNblhHNXBiWEJ2Y25RZ2V5Qm5aWFJCZEhSeWFXSjFkR1Z6UTI5dVptbG5JSDBnWm5KdmJTQW5MaTR2WTI5dGNHOXVaVzUwVFdGdVlXZGxjaWRjYmx4dVkyOXVjM1FnUkhKdmNHUnZkMjRnUFNBb0tDa2dQVDRnZTF4dUlDQXZLaXBjYmlBZ0lDb2dMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRYRzRnSUNBcUlFTnZibk4wWVc1MGMxeHVJQ0FnS2lBdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMxY2JpQWdJQ292WEc1Y2JpQWdZMjl1YzNRZ1RrRk5SU0E5SUNka2NtOXdaRzkzYmlkY2JpQWdZMjl1YzNRZ1ZrVlNVMGxQVGlBOUlDY3lMakF1TUNkY2JpQWdZMjl1YzNRZ1JFVkdRVlZNVkY5UVVrOVFSVkpVU1VWVElEMGdlMXh1SUNBZ0lHVnNaVzFsYm5RNklHNTFiR3dzWEc0Z0lDQWdaR1ZtWVhWc2REb2dkSEoxWlN4Y2JpQWdJQ0J6WldGeVkyZzZJR1poYkhObExGeHVJQ0I5WEc0Z0lHTnZibk4wSUVSQlZFRmZRVlJVVWxOZlVGSlBVRVZTVkVsRlV5QTlJRnRjYmlBZ0lDQW5aR1ZtWVhWc2RDY3NYRzRnSUNBZ0ozTmxZWEpqYUNjc0lDQWdJRnh1SUNCZFhHNWNiaUFnTHlvcVhHNGdJQ0FxSUMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFZ4dUlDQWdLaUJEYkdGemN5QkVaV1pwYm1sMGFXOXVYRzRnSUNBcUlDMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExWeHVJQ0FnS2k5Y2JseHVJQ0JqYkdGemN5QkVjbTl3Wkc5M2JpQmxlSFJsYm1SeklFTnZiWEJ2Ym1WdWRDQjdYRzVjYmlBZ0lDQmpiMjV6ZEhKMVkzUnZjaWh2Y0hScGIyNXpJRDBnZTMwcElIdGNiaUFnSUNBZ0lITjFjR1Z5S0U1QlRVVXNJRlpGVWxOSlQwNHNJRVJGUmtGVlRGUmZVRkpQVUVWU1ZFbEZVeXdnYjNCMGFXOXVjeXdnUkVGVVFWOUJWRlJTVTE5UVVrOVFSVkpVU1VWVExDQm1ZV3h6WlN3Z1ptRnNjMlVwWEc1Y2JpQWdJQ0FnSUdOdmJuTjBJSE5sYkdWamRHVmtJRDBnZEdocGN5NXZjSFJwYjI1ekxtVnNaVzFsYm5RdWNYVmxjbmxUWld4bFkzUnZjaWduVzJSaGRHRXRjMlZzWldOMFpXUmRKeWxjYmlBZ0lDQWdJR052Ym5OMElHbDBaVzBnUFNCMGFHbHpMbWRsZEVsMFpXMUVZWFJoS0hObGJHVmpkR1ZrS1Z4dVhHNGdJQ0FnSUNCMGFHbHpMbk5sZEZObGJHVmpkR1ZrS0dsMFpXMHVkbUZzZFdVc0lHbDBaVzB1ZEdWNGRDd2dabUZzYzJVcFhHNGdJQ0FnZlZ4dVhHNGdJQ0FnYzJWMFUyVnNaV04wWldRb2RtRnNkV1VnUFNBbkp5d2dkR1Y0ZENBOUlHNTFiR3dzSUdOb1pXTnJSWGhwYzNSeklEMGdkSEoxWlNrZ2UxeHVJQ0FnSUNBZ2FXWWdLQ0YwYUdsekxtOXdkR2x2Ym5NdVpHVm1ZWFZzZENrZ2UxeHVJQ0FnSUNBZ0lDQnlaWFIxY200Z1ptRnNjMlZjYmlBZ0lDQWdJSDFjYmx4dUlDQWdJQ0FnYkdWMElIUmxlSFJFYVhOd2JHRjVJRDBnZEdWNGRGeHVJQ0FnSUNBZ2RHaHBjeTV2Y0hScGIyNXpMbVZzWlcxbGJuUXVjWFZsY25sVFpXeGxZM1J2Y2lnbkxtUmxabUYxYkhRdGRHVjRkQ2NwTG1sdWJtVnlTRlJOVENBOUlIUmxlSFJjYmlBZ0lDQWdJSFJvYVhNdWIzQjBhVzl1Y3k1bGJHVnRaVzUwTG5GMVpYSjVVMlZzWldOMGIzSW9KMmx1Y0hWMFczUjVjR1U5WENKb2FXUmtaVzVjSWwwbktTNTJZV3gxWlNBOUlIWmhiSFZsWEc1Y2JpQWdJQ0FnSUdOdmJuTjBJR2wwWlcxeklEMGdkR2hwY3k1dmNIUnBiMjV6TG1Wc1pXMWxiblF1Y1hWbGNubFRaV3hsWTNSdmNrRnNiQ2duTG1sMFpXMG5LU0I4ZkNCYlhWeHVJQ0FnSUNBZ2JHVjBJR2wwWlcxR2IzVnVaQ0E5SUdaaGJITmxYRzVjYmlBZ0lDQWdJRUZ5Y21GNUxtWnliMjBvYVhSbGJYTXBMbVp2Y2tWaFkyZ29LR2wwWlcwcElEMCtJSHRjYmlBZ0lDQWdJQ0FnYVdZZ0tHbDBaVzB1WTJ4aGMzTk1hWE4wTG1OdmJuUmhhVzV6S0NkelpXeGxZM1JsWkNjcEtTQjdYRzRnSUNBZ0lDQWdJQ0FnYVhSbGJTNWpiR0Z6YzB4cGMzUXVjbVZ0YjNabEtDZHpaV3hsWTNSbFpDY3BYRzRnSUNBZ0lDQWdJSDFjYmx4dUlDQWdJQ0FnSUNCamIyNXpkQ0JrWVhSaElEMGdkR2hwY3k1blpYUkpkR1Z0UkdGMFlTaHBkR1Z0S1Z4dVhHNGdJQ0FnSUNBZ0lHbG1JQ2gyWVd4MVpTQTlQVDBnWkdGMFlTNTJZV3gxWlNrZ2UxeHVJQ0FnSUNBZ0lDQWdJR2xtSUNnaGFYUmxiUzVqYkdGemMweHBjM1F1WTI5dWRHRnBibk1vSjNObGJHVmpkR1ZrSnlrcElIdGNiaUFnSUNBZ0lDQWdJQ0FnSUdsMFpXMHVZMnhoYzNOTWFYTjBMbUZrWkNnbmMyVnNaV04wWldRbktWeHVJQ0FnSUNBZ0lDQWdJSDFjYmx4dUlDQWdJQ0FnSUNBZ0lIUmxlSFJFYVhOd2JHRjVJRDBnWkdGMFlTNTBaWGgwWEc0Z0lDQWdJQ0FnSUNBZ2FYUmxiVVp2ZFc1a0lEMGdkSEoxWlZ4dUlDQWdJQ0FnSUNCOVhHNGdJQ0FnSUNCOUtWeHVYRzRnSUNBZ0lDQnBaaUFvWTJobFkydEZlR2x6ZEhNZ0ppWWdhWFJsYlVadmRXNWtLU0I3WEc0Z0lDQWdJQ0FnSUhSb2FYTXViM0IwYVc5dWN5NWxiR1Z0Wlc1MExuRjFaWEo1VTJWc1pXTjBiM0lvSnk1a1pXWmhkV3gwTFhSbGVIUW5LUzVwYm01bGNraFVUVXdnUFNCMFpYaDBSR2x6Y0d4aGVWeHVJQ0FnSUNBZ2ZTQmxiSE5sSUdsbUlDaGphR1ZqYTBWNGFYTjBjeUFtSmlBaGFYUmxiVVp2ZFc1a0tTQjdYRzRnSUNBZ0lDQWdJSFJvY205M0lHNWxkeUJGY25KdmNpaGdKSHRPUVUxRmZTNGdWR2hsSUhaaGJIVmxJRndpSkh0MllXeDFaWDFjSWlCa2IyVnpJRzV2ZENCbGVHbHpkQ0JwYmlCMGFHVWdiR2x6ZENCdlppQnBkR1Z0Y3k1Z0tTQWdJQ0FnSUNBZ1hHNGdJQ0FnSUNCOVhHNWNiaUFnSUNBZ0lISmxkSFZ5YmlCMGNuVmxYRzRnSUNBZ2ZWeHVYRzRnSUNBZ1oyVjBVMlZzWldOMFpXUW9LU0I3WEc0Z0lDQWdJQ0J5WlhSMWNtNGdkR2hwY3k1dmNIUnBiMjV6TG1Wc1pXMWxiblF1Y1hWbGNubFRaV3hsWTNSdmNpZ25hVzV3ZFhSYmRIbHdaVDFjSW1ocFpHUmxibHdpWFNjcExuWmhiSFZsWEc0Z0lDQWdmVnh1WEc0Z0lDQWdaMlYwU1hSbGJVUmhkR0VvYVhSbGJTQTlJRzUxYkd3cElIdGNiaUFnSUNBZ0lHeGxkQ0IwWlhoMElEMGdKeWRjYmlBZ0lDQWdJR3hsZENCMllXeDFaU0E5SUNjblhHNWNiaUFnSUNBZ0lHbG1JQ2hwZEdWdEtTQjdYRzRnSUNBZ0lDQWdJSFJsZUhRZ1BTQnBkR1Z0TG1kbGRFRjBkSEpwWW5WMFpTZ25aR0YwWVMxMFpYaDBKeWtnZkh3Z2FYUmxiUzVwYm01bGNraFVUVXhjYmx4dUlDQWdJQ0FnSUNCamIyNXpkQ0J6Wld4bFkzUmxaRlJsZUhST2IyUmxJRDBnYVhSbGJTNXhkV1Z5ZVZObGJHVmpkRzl5S0NjdWRHVjRkQ2NwWEc0Z0lDQWdJQ0FnSUdsbUlDaHpaV3hsWTNSbFpGUmxlSFJPYjJSbEtTQjdYRzRnSUNBZ0lDQWdJQ0FnZEdWNGRDQTlJSE5sYkdWamRHVmtWR1Y0ZEU1dlpHVXVhVzV1WlhKSVZFMU1YRzRnSUNBZ0lDQWdJSDFjYmx4dUlDQWdJQ0FnSUNCMllXeDFaU0E5SUdsMFpXMHVaMlYwUVhSMGNtbGlkWFJsS0Nka1lYUmhMWFpoYkhWbEp5a2dmSHdnSnlkY2JpQWdJQ0FnSUgxY2JseHVJQ0FnSUNBZ2NtVjBkWEp1SUhzZ2RHVjRkQ3dnZG1Gc2RXVWdmVnh1SUNBZ0lIMWNibHh1SUNBZ0lHOXVSV3hsYldWdWRFVjJaVzUwS0dWMlpXNTBLU0I3WEc0Z0lDQWdJQ0JwWmlBb1pYWmxiblF1ZEhsd1pTQTlQVDBnUlhabGJuUXVVMVJCVWxRcElIdGNiaUFnSUNBZ0lDQWdZMjl1YzNRZ1pISnZjR1J2ZDI0Z1BTQm1hVzVrVkdGeVoyVjBRbmxEYkdGemN5aGxkbVZ1ZEM1MFlYSm5aWFFzSUNka2NtOXdaRzkzYmljcFhHNWNiaUFnSUNBZ0lDQWdMeXBjYmlBZ0lDQWdJQ0FnSUNvZ2FHbGtaU0IwYUdVZ1kzVnljbVZ1ZENCa2NtOXdaRzkzYmlCdmJteDVJR2xtSUhSb1pTQmxkbVZ1ZENCamIyNWpaWEp1Y3lCaGJtOTBhR1Z5SUdSeWIzQmtiM2R1WEc0Z0lDQWdJQ0FnSUNBcUlHaHBaR1VnWVd4emJ5QnBaaUIwYUdVZ2RYTmxjaUJqYkdsamEzTWdiM1YwYzJsa1pTQmhJR1J5YjNCa2IzZHVYRzRnSUNBZ0lDQWdJQ0FxTDF4dUlDQWdJQ0FnSUNCcFppQW9JV1J5YjNCa2IzZHVJSHg4SUdSeWIzQmtiM2R1SUNFOVBTQjBhR2x6TG1kbGRFVnNaVzFsYm5Rb0tTa2dlMXh1SUNBZ0lDQWdJQ0FnSUhSb2FYTXVhR2xrWlNncFhHNGdJQ0FnSUNBZ0lIMWNibHh1SUNBZ0lDQWdmU0JsYkhObElHbG1JQ2hsZG1WdWRDNTBlWEJsSUQwOVBTQW5ZMnhwWTJzbktTQjdYRzRnSUNBZ0lDQWdJR052Ym5OMElHbDBaVzBnUFNCbWFXNWtWR0Z5WjJWMFFubERiR0Z6Y3lobGRtVnVkQzUwWVhKblpYUXNJQ2RwZEdWdEp5bGNibHh1SUNBZ0lDQWdJQ0JwWmlBb2FYUmxiU2tnZTF4dUlDQWdJQ0FnSUNBZ0lHbG1JQ2hwZEdWdExtTnNZWE56VEdsemRDNWpiMjUwWVdsdWN5Z25aR2x6WVdKc1pXUW5LU2tnZTF4dUlDQWdJQ0FnSUNBZ0lDQWdjbVYwZFhKdVhHNGdJQ0FnSUNBZ0lDQWdmVnh1WEc0Z0lDQWdJQ0FnSUNBZ1kyOXVjM1FnYVhSbGJVbHVabThnUFNCMGFHbHpMbWRsZEVsMFpXMUVZWFJoS0dsMFpXMHBYRzVjYmlBZ0lDQWdJQ0FnSUNCcFppQW9kR2hwY3k1blpYUlRaV3hsWTNSbFpDZ3BJQ0U5UFNCcGRHVnRTVzVtYnk1MllXeDFaU2tnZTF4dUlDQWdJQ0FnSUNBZ0lDQWdMeThnZEdobElIVnpaWElnYzJWc1pXTjBaV1FnWVc1dmRHaGxjaUIyWVd4MVpTd2dkMlVnWkdsemNHRjBZMmdnZEdobElHVjJaVzUwWEc0Z0lDQWdJQ0FnSUNBZ0lDQjBhR2x6TG5ObGRGTmxiR1ZqZEdWa0tHbDBaVzFKYm1adkxuWmhiSFZsTENCcGRHVnRTVzVtYnk1MFpYaDBMQ0JtWVd4elpTbGNiaUFnSUNBZ0lDQWdJQ0FnSUdOdmJuTjBJR1JsZEdGcGJDQTlJSHNnYVhSbGJTd2dkR1Y0ZERvZ2FYUmxiVWx1Wm04dWRHVjRkQ3dnZG1Gc2RXVTZJR2wwWlcxSmJtWnZMblpoYkhWbElIMWNiaUFnSUNBZ0lDQWdJQ0FnSUhSb2FYTXVkSEpwWjJkbGNrVjJaVzUwS0VWMlpXNTBMa2xVUlUxZlUwVk1SVU5VUlVRc0lHUmxkR0ZwYkNsY2JpQWdJQ0FnSUNBZ0lDQjlYRzVjYmlBZ0lDQWdJQ0FnSUNCMGFHbHpMbWhwWkdVb0tWeHVJQ0FnSUNBZ0lDQWdJSEpsZEhWeWJseHVJQ0FnSUNBZ0lDQjlYRzVjYmlBZ0lDQWdJQ0FnTHk4Z1pHOXVKM1FnZEc5bloyeGxJSFJvWlNCa2NtOXdaRzkzYmlCcFppQjBhR1VnWlhabGJuUWdZMjl1WTJWeWJuTWdhR1ZoWkdWeWN5d2daR2wyYVdSbGNuTmNiaUFnSUNBZ0lDQWdZMjl1YzNRZ1pISnZjR1J2ZDI1TlpXNTFJRDBnWm1sdVpGUmhjbWRsZEVKNVEyeGhjM01vWlhabGJuUXVkR0Z5WjJWMExDQW5aSEp2Y0dSdmQyNHRiV1Z1ZFNjcFhHNGdJQ0FnSUNBZ0lHbG1JQ2hrY205d1pHOTNiazFsYm5VcElIdGNiaUFnSUNBZ0lDQWdJQ0J5WlhSMWNtNWNiaUFnSUNBZ0lDQWdmVnh1WEc0Z0lDQWdJQ0FnSUhSb2FYTXVkRzluWjJ4bEtDbGNiaUFnSUNBZ0lIMWNiaUFnSUNCOVhHNWNiaUFnSUNCMGIyZG5iR1VvS1NCN1hHNGdJQ0FnSUNCcFppQW9kR2hwY3k1dmNIUnBiMjV6TG1Wc1pXMWxiblF1WTJ4aGMzTk1hWE4wTG1OdmJuUmhhVzV6S0NkaFkzUnBkbVVuS1NrZ2UxeHVJQ0FnSUNBZ0lDQnlaWFIxY200Z2RHaHBjeTVvYVdSbEtDbGNiaUFnSUNBZ0lIMWNibHh1SUNBZ0lDQWdjbVYwZFhKdUlIUm9hWE11YzJodmR5Z3BYRzRnSUNBZ2ZWeHVYRzRnSUNBZ2MyaHZkeWdwSUh0Y2JpQWdJQ0FnSUdsbUlDaDBhR2x6TG05d2RHbHZibk11Wld4bGJXVnVkQzVqYkdGemMweHBjM1F1WTI5dWRHRnBibk1vSjJGamRHbDJaU2NwS1NCN1hHNGdJQ0FnSUNBZ0lISmxkSFZ5YmlCbVlXeHpaVnh1SUNBZ0lDQWdmVnh1WEc0Z0lDQWdJQ0IwYUdsekxtOXdkR2x2Ym5NdVpXeGxiV1Z1ZEM1amJHRnpjMHhwYzNRdVlXUmtLQ2RoWTNScGRtVW5LVnh1WEc0Z0lDQWdJQ0JqYjI1emRDQmtjbTl3Wkc5M2JrMWxiblVnUFNCMGFHbHpMbTl3ZEdsdmJuTXVaV3hsYldWdWRDNXhkV1Z5ZVZObGJHVmpkRzl5S0NjdVpISnZjR1J2ZDI0dGJXVnVkU2NwWEc1Y2JpQWdJQ0FnSUM4dklITmpjbTlzYkNCMGJ5QjBiM0JjYmlBZ0lDQWdJR1J5YjNCa2IzZHVUV1Z1ZFM1elkzSnZiR3hVYjNBZ1BTQXdYRzVjYmlBZ0lDQWdJSFJvYVhNdWRISnBaMmRsY2tWMlpXNTBLRVYyWlc1MExsTklUMWNwWEc0Z0lDQWdJQ0IwYUdsekxuUnlhV2RuWlhKRmRtVnVkQ2hGZG1WdWRDNVRTRTlYVGlsY2JseHVJQ0FnSUNBZ2RHaHBjeTV5WldkcGMzUmxja1ZzWlcxbGJuUW9leUIwWVhKblpYUTZJR1J5YjNCa2IzZHVUV1Z1ZFN3Z1pYWmxiblE2SUNkamJHbGpheWNnZlNrZ0lDQWdJQ0JjYmlBZ0lDQWdJSFJvYVhNdWNtVm5hWE4wWlhKRmJHVnRaVzUwS0hzZ2RHRnlaMlYwT2lCa2IyTjFiV1Z1ZEM1aWIyUjVMQ0JsZG1WdWREb2dSWFpsYm5RdVUxUkJVbFFnZlNsY2JseHVJQ0FnSUNBZ2NtVjBkWEp1SUhSeWRXVmNiaUFnSUNCOVhHNWNiaUFnSUNCb2FXUmxLQ2tnZTF4dUlDQWdJQ0FnYVdZZ0tDRjBhR2x6TG05d2RHbHZibk11Wld4bGJXVnVkQzVqYkdGemMweHBjM1F1WTI5dWRHRnBibk1vSjJGamRHbDJaU2NwS1NCN1hHNGdJQ0FnSUNBZ0lISmxkSFZ5YmlCbVlXeHpaVnh1SUNBZ0lDQWdmVnh1WEc0Z0lDQWdJQ0IwYUdsekxtOXdkR2x2Ym5NdVpXeGxiV1Z1ZEM1amJHRnpjMHhwYzNRdWNtVnRiM1psS0NkaFkzUnBkbVVuS1Z4dVhHNGdJQ0FnSUNCMGFHbHpMblJ5YVdkblpYSkZkbVZ1ZENoRmRtVnVkQzVJU1VSRktWeHVJQ0FnSUNBZ2RHaHBjeTUwY21sbloyVnlSWFpsYm5Rb1JYWmxiblF1U0VsRVJFVk9LVnh1WEc0Z0lDQWdJQ0IwYUdsekxuVnVjbVZuYVhOMFpYSkZiR1Z0Wlc1MEtIc2dkR0Z5WjJWME9pQjBhR2x6TG05d2RHbHZibk11Wld4bGJXVnVkQzV4ZFdWeWVWTmxiR1ZqZEc5eUtDY3VaSEp2Y0dSdmQyNHRiV1Z1ZFNjcExDQmxkbVZ1ZERvZ0oyTnNhV05ySnlCOUtTQWdJQ0FnSUZ4dUlDQWdJQ0FnZEdocGN5NTFibkpsWjJsemRHVnlSV3hsYldWdWRDaDdJSFJoY21kbGREb2daRzlqZFcxbGJuUXVZbTlrZVN3Z1pYWmxiblE2SUVWMlpXNTBMbE5VUVZKVUlIMHBYRzVjYmlBZ0lDQWdJSEpsZEhWeWJpQjBjblZsWEc0Z0lDQWdmVnh1WEc0Z0lDQWdjM1JoZEdsaklHbGtaVzUwYVdacFpYSW9LU0I3WEc0Z0lDQWdJQ0J5WlhSMWNtNGdUa0ZOUlZ4dUlDQWdJSDFjYmx4dUlDQWdJSE4wWVhScFl5QmZSRTlOU1c1MFpYSm1ZV05sS0c5d2RHbHZibk1wSUh0Y2JpQWdJQ0FnSUhKbGRIVnliaUJ6ZFhCbGNpNWZSRTlOU1c1MFpYSm1ZV05sS0VSeWIzQmtiM2R1TENCdmNIUnBiMjV6S1Z4dUlDQWdJSDFjYmlBZ2ZWeHVYRzRnSUM4cUtseHVJQ0FnS2lBdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMxY2JpQWdJQ29nUkU5TklFRndhU0JwYlhCc1pXMWxiblJoZEdsdmJseHVJQ0FnS2lBdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMxY2JpQWdJQ292WEc0Z0lHTnZibk4wSUdOdmJYQnZibVZ1ZEhNZ1BTQmJYVnh1WEc0Z0lHTnZibk4wSUdSeWIzQmtiM2R1Y3lBOUlHUnZZM1Z0Wlc1MExuRjFaWEo1VTJWc1pXTjBiM0pCYkd3b1lDNGtlMDVCVFVWOVlDbGNiaUFnYVdZZ0tHUnliM0JrYjNkdWN5a2dlMXh1SUNBZ0lFRnljbUY1TG1aeWIyMG9aSEp2Y0dSdmQyNXpLUzVtYjNKRllXTm9LQ2hsYkdWdFpXNTBLU0E5UGlCN1hHNGdJQ0FnSUNCamIyNXpkQ0JqYjI1bWFXY2dQU0JuWlhSQmRIUnlhV0oxZEdWelEyOXVabWxuS0dWc1pXMWxiblFzSUVSRlJrRlZURlJmVUZKUFVFVlNWRWxGVXl3Z1JFRlVRVjlCVkZSU1UxOVFVazlRUlZKVVNVVlRLVnh1SUNBZ0lDQWdZMjl1Wm1sbkxtVnNaVzFsYm5RZ1BTQmxiR1Z0Wlc1MFhHNWNiaUFnSUNBZ0lHbG1JQ2doWTI5dVptbG5Mbk5sWVhKamFDa2dlMXh1SUNBZ0lDQWdJQ0JqYjIxd2IyNWxiblJ6TG5CMWMyZ29ibVYzSUVSeWIzQmtiM2R1S0dOdmJtWnBaeWtwWEc0Z0lDQWdJQ0I5WEc0Z0lDQWdmU2xjYmlBZ2ZWeHVYRzRnSUdsbUlDaGtjbTl3Wkc5M2JuTXBJSHRjYmlBZ0lDQmtiMk4xYldWdWRDNWhaR1JGZG1WdWRFeHBjM1JsYm1WeUtDZGpiR2xqYXljc0lDaGxkbVZ1ZENrZ1BUNGdlMXh1SUNBZ0lDQWdZMjl1YzNRZ1pISnZjR1J2ZDI1TlpXNTFJRDBnWm1sdVpGUmhjbWRsZEVKNVEyeGhjM01vWlhabGJuUXVkR0Z5WjJWMExDQW5aSEp2Y0dSdmQyNHRiV1Z1ZFNjcFhHNGdJQ0FnSUNCcFppQW9aSEp2Y0dSdmQyNU5aVzUxS1NCN1hHNGdJQ0FnSUNBZ0lISmxkSFZ5Ymx4dUlDQWdJQ0FnZlZ4dVhHNGdJQ0FnSUNCamIyNXpkQ0JrY205d1pHOTNiaUE5SUdacGJtUlVZWEpuWlhSQ2VVTnNZWE56S0dWMlpXNTBMblJoY21kbGRDd2dKMlJ5YjNCa2IzZHVKeWxjYmx4dUlDQWdJQ0FnYVdZZ0tHUnliM0JrYjNkdUtTQjdYRzRnSUNBZ0lDQWdJR052Ym5OMElHUmhkR0ZVYjJkbmJHVkJkSFJ5SUQwZ1pISnZjR1J2ZDI0dVoyVjBRWFIwY21saWRYUmxLQ2RrWVhSaExYUnZaMmRzWlNjcFhHNGdJQ0FnSUNBZ0lHbG1JQ2hrWVhSaFZHOW5aMnhsUVhSMGNpQW1KaUJrWVhSaFZHOW5aMnhsUVhSMGNpQTlQVDBnVGtGTlJTQW1KaUJrY205d1pHOTNiaWtnZTF4dUlDQWdJQ0FnSUNBZ0lHTnZibk4wSUdOdmJYQnZibVZ1ZENBOUlHTnZiWEJ2Ym1WdWRITXVabWx1WkNoaklEMCtJR011WjJWMFJXeGxiV1Z1ZENncElEMDlQU0JrY205d1pHOTNiaWxjYmx4dUlDQWdJQ0FnSUNBZ0lHbG1JQ2doWTI5dGNHOXVaVzUwS1NCN1hHNGdJQ0FnSUNBZ0lDQWdJQ0J5WlhSMWNtNWNiaUFnSUNBZ0lDQWdJQ0I5WEc1Y2JpQWdJQ0FnSUNBZ0lDQmpiMjF3YjI1bGJuUXVkRzluWjJ4bEtDbGNiaUFnSUNBZ0lDQWdmVnh1SUNBZ0lDQWdmVnh1SUNBZ0lIMHBYRzRnSUgxY2JseHVJQ0J5WlhSMWNtNGdSSEp2Y0dSdmQyNWNibjBwS0NsY2JseHVaWGh3YjNKMElHUmxabUYxYkhRZ1JISnZjR1J2ZDI1Y2JpSXNJaThxS2x4dUlDb2dMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzFjYmlBcUlFeHBZMlZ1YzJWa0lIVnVaR1Z5SUUxSlZDQW9hSFIwY0hNNkx5OW5hWFJvZFdJdVkyOXRMM0YxWVhKckxXUmxkaTlRYUc5dWIyNHRSbkpoYldWM2IzSnJMMkpzYjJJdmJXRnpkR1Z5TDB4SlEwVk9VMFVwWEc0Z0tpQXRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMVnh1SUNvdlhHNXBiWEJ2Y25RZ1JISnZjR1J2ZDI0Z1puSnZiU0FuTGk5cGJtUmxlQ2RjYm1sdGNHOXlkQ0I3SUdacGJtUlVZWEpuWlhSQ2VVTnNZWE56SUgwZ1puSnZiU0FuTGk0dkxpNHZZMjl0Ylc5dUwzVjBhV3h6SjF4dWFXMXdiM0owSUhzZ1oyVjBRWFIwY21saWRYUmxjME52Ym1acFp5QjlJR1p5YjIwZ0p5NHVMMk52YlhCdmJtVnVkRTFoYm1GblpYSW5YRzVjYm1OdmJuTjBJRVJ5YjNCa2IzZHVVMlZoY21Ob0lEMGdLQ2dwSUQwK0lIdGNibHh1SUNBdktpcGNiaUFnSUNvZ0xTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdFhHNGdJQ0FxSUVOdmJuTjBZVzUwYzF4dUlDQWdLaUF0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzFjYmlBZ0lDb3ZYRzVjYmlBZ1kyOXVjM1FnVGtGTlJTQTlJRVJ5YjNCa2IzZHVMbWxrWlc1MGFXWnBaWElvS1Z4dUlDQmpiMjV6ZENCRVJVWkJWVXhVWDFCU1QxQkZVbFJKUlZNZ1BTQjdYRzRnSUNBZ1pXeGxiV1Z1ZERvZ2JuVnNiQ3hjYmlBZ0lDQmtaV1poZFd4ME9pQjBjblZsTEZ4dUlDQWdJSE5sWVhKamFEb2dkSEoxWlN4Y2JpQWdmVnh1SUNCamIyNXpkQ0JFUVZSQlgwRlVWRkpUWDFCU1QxQkZVbFJKUlZNZ1BTQmJYRzRnSUNBZ0oyUmxabUYxYkhRbkxGeHVJQ0FnSUNkelpXRnlZMmduTEZ4dUlDQmRYRzVjYmlBZ0x5b3FYRzRnSUNBcUlDMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExWeHVJQ0FnS2lCRGJHRnpjeUJFWldacGJtbDBhVzl1WEc0Z0lDQXFJQzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMVnh1SUNBZ0tpOWNibHh1SUNCamJHRnpjeUJFY205d1pHOTNibE5sWVhKamFDQmxlSFJsYm1SeklFUnliM0JrYjNkdUlIdGNibHh1SUNBZ0lHTnZibk4wY25WamRHOXlLRzl3ZEdsdmJuTWdQU0I3ZlNrZ2UxeHVJQ0FnSUNBZ2MzVndaWElvYjNCMGFXOXVjeWxjYmx4dUlDQWdJQ0FnZEdocGN5NW1hV3gwWlhKSmRHVnRjMGhoYm1Sc1pYSWdQU0FvWlhabGJuUXBJRDArSUh0Y2JpQWdJQ0FnSUNBZ1kyOXVjM1FnYzJWaGNtTm9JRDBnWlhabGJuUXVkR0Z5WjJWMExuWmhiSFZsWEc1Y2JpQWdJQ0FnSUNBZ2FXWWdLSE5sWVhKamFDQTlQVDBnSnljcElIdGNiaUFnSUNBZ0lDQWdJQ0IwYUdsekxuTm9iM2RKZEdWdGN5Z3BYRzRnSUNBZ0lDQWdJQ0FnY21WMGRYSnVYRzRnSUNBZ0lDQWdJSDFjYmx4dVhHNGdJQ0FnSUNBZ0lIUm9hWE11WjJWMFNYUmxiWE1vS1M1bWIzSkZZV05vS0NocGRHVnRLU0E5UGlCN1hHNGdJQ0FnSUNBZ0lDQWdZMjl1YzNRZ1ptNGdQU0IwZVhCbGIyWWdkR2hwY3k1dmNIUnBiMjV6TG1acGJIUmxja2wwWlcwZ1BUMDlJQ2RtZFc1amRHbHZiaWNnUHlCMGFHbHpMbTl3ZEdsdmJuTXVabWxzZEdWeVNYUmxiU0E2SUhSb2FYTXVabWxzZEdWeVNYUmxiVnh1WEc0Z0lDQWdJQ0FnSUNBZ2FXWWdLR1p1S0hObFlYSmphQ3dnYVhSbGJTa3BJSHRjYmlBZ0lDQWdJQ0FnSUNBZ0lHbDBaVzB1Wld4bGJXVnVkQzV6ZEhsc1pTNWthWE53YkdGNUlEMGdKMkpzYjJOckoxeHVJQ0FnSUNBZ0lDQWdJSDBnWld4elpTQjdYRzRnSUNBZ0lDQWdJQ0FnSUNCcGRHVnRMbVZzWlcxbGJuUXVjM1I1YkdVdVpHbHpjR3hoZVNBOUlDZHViMjVsSjF4dUlDQWdJQ0FnSUNBZ0lIMWNiaUFnSUNBZ0lDQWdmU2xjYmlBZ0lDQWdJSDFjYmx4dUlDQWdJQ0FnZEdocGN5NW5aWFJUWldGeVkyaEpibkIxZENncExtRmtaRVYyWlc1MFRHbHpkR1Z1WlhJb0oydGxlWFZ3Snl3Z2RHaHBjeTVtYVd4MFpYSkpkR1Z0YzBoaGJtUnNaWElwWEc0Z0lDQWdmVnh1WEc0Z0lDQWdabWxzZEdWeVNYUmxiU2h6WldGeVkyZ2dQU0FuSnl3Z2FYUmxiU0E5SUh0OUtTQjdYRzRnSUNBZ0lDQnBaaUFvYVhSbGJTNTJZV3gxWlM1cGJtUmxlRTltS0hObFlYSmphQ2tnUGlBdE1WeHVJQ0FnSUNBZ0lDQjhmQ0JwZEdWdExuUmxlSFF1YVc1a1pYaFBaaWh6WldGeVkyZ3BJRDRnTFRFcElIdGNiaUFnSUNBZ0lDQWdjbVYwZFhKdUlIUnlkV1ZjYmlBZ0lDQWdJSDFjYmx4dUlDQWdJQ0FnY21WMGRYSnVJR1poYkhObFhHNGdJQ0FnZlZ4dVhHNGdJQ0FnWjJWMFNYUmxiWE1vS1NCN1hHNGdJQ0FnSUNCc1pYUWdhWFJsYlhNZ1BTQkJjbkpoZVM1bWNtOXRLSFJvYVhNdWIzQjBhVzl1Y3k1bGJHVnRaVzUwTG5GMVpYSjVVMlZzWldOMGIzSkJiR3dvSnk1cGRHVnRKeWtnZkh3Z1cxMHBYRzRnSUNBZ0lDQnBkR1Z0Y3lBOUlHbDBaVzF6TG0xaGNDZ29hWFJsYlNrZ1BUNGdlMXh1SUNBZ0lDQWdJQ0JqYjI1emRDQnBibVp2SUQwZ2RHaHBjeTVuWlhSSmRHVnRSR0YwWVNocGRHVnRLVnh1SUNBZ0lDQWdJQ0J5WlhSMWNtNGdleUIwWlhoME9pQnBibVp2TG5SbGVIUXNJSFpoYkhWbE9pQnBibVp2TG5aaGJIVmxMQ0JsYkdWdFpXNTBPaUJwZEdWdElIMWNiaUFnSUNBZ0lIMHBYRzVjYmlBZ0lDQWdJSEpsZEhWeWJpQnBkR1Z0YzF4dUlDQWdJSDFjYmx4dUlDQWdJSE5vYjNkSmRHVnRjeWdwSUh0Y2JpQWdJQ0FnSUhSb2FYTXVaMlYwU1hSbGJYTW9LUzVtYjNKRllXTm9LQ2hwZEdWdEtTQTlQaUI3WEc0Z0lDQWdJQ0FnSUdsMFpXMHVaV3hsYldWdWRDNXpkSGxzWlM1a2FYTndiR0Y1SUQwZ0oySnNiMk5ySjF4dUlDQWdJQ0FnZlNsY2JpQWdJQ0I5WEc1Y2JpQWdJQ0JuWlhSVFpXRnlZMmhKYm5CMWRDZ3BJSHRjYmlBZ0lDQWdJSEpsZEhWeWJpQjBhR2x6TG05d2RHbHZibk11Wld4bGJXVnVkQzV4ZFdWeWVWTmxiR1ZqZEc5eUtDY3VaSEp2Y0dSdmQyNHRiV1Z1ZFNCcGJuQjFkQ2NwWEc0Z0lDQWdmVnh1WEc0Z0lDQWdhR2xrWlNncElIdGNiaUFnSUNBZ0lHbG1JQ2h6ZFhCbGNpNW9hV1JsS0NrcElIdGNiaUFnSUNBZ0lDQWdMeThnY21WelpYUWdkR2hsSUhaaGJIVmxYRzRnSUNBZ0lDQWdJSFJvYVhNdVoyVjBVMlZoY21Ob1NXNXdkWFFvS1M1MllXeDFaU0E5SUNjblhHNGdJQ0FnSUNBZ0lDOHZJSE5vYjNjZ1lXeHNJR2wwWlcxelhHNGdJQ0FnSUNBZ0lIUm9hWE11YzJodmQwbDBaVzF6S0NsY2JpQWdJQ0FnSUgxY2JpQWdJQ0I5WEc1Y2JpQWdJQ0J6ZEdGMGFXTWdYMFJQVFVsdWRHVnlabUZqWlNodmNIUnBiMjV6S1NCN1hHNGdJQ0FnSUNCeVpYUjFjbTRnYm1WM0lFUnliM0JrYjNkdVUyVmhjbU5vS0c5d2RHbHZibk1wWEc0Z0lDQWdmVnh1SUNCOVhHNWNiaUFnTHlvcVhHNGdJQ0FxSUMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFZ4dUlDQWdLaUJFVDAwZ1FYQnBJR2x0Y0d4bGJXVnVkR0YwYVc5dVhHNGdJQ0FxSUMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFZ4dUlDQWdLaTljYmlBZ1kyOXVjM1FnWTI5dGNHOXVaVzUwY3lBOUlGdGRYRzRnSUdOdmJuTjBJR1J5YjNCa2IzZHVjeUE5SUdSdlkzVnRaVzUwTG5GMVpYSjVVMlZzWldOMGIzSkJiR3dvWUM0a2UwNUJUVVY5WUNsY2JseHVJQ0JwWmlBb1pISnZjR1J2ZDI1ektTQjdYRzRnSUNBZ1FYSnlZWGt1Wm5KdmJTaGtjbTl3Wkc5M2JuTXBMbVp2Y2tWaFkyZ29LR1ZzWlcxbGJuUXBJRDArSUh0Y2JpQWdJQ0FnSUdOdmJuTjBJR052Ym1acFp5QTlJR2RsZEVGMGRISnBZblYwWlhORGIyNW1hV2NvWld4bGJXVnVkQ3dnUkVWR1FWVk1WRjlRVWs5UVJWSlVTVVZUTENCRVFWUkJYMEZVVkZKVFgxQlNUMUJGVWxSSlJWTXBYRzRnSUNBZ0lDQmpiMjVtYVdjdVpXeGxiV1Z1ZENBOUlHVnNaVzFsYm5SY2JseHVJQ0FnSUNBZ2FXWWdLR052Ym1acFp5NXpaV0Z5WTJncElIdGNiaUFnSUNBZ0lDQWdMeThnYzJWaGNtTm9YRzRnSUNBZ0lDQWdJR052YlhCdmJtVnVkSE11Y0hWemFDaHVaWGNnUkhKdmNHUnZkMjVUWldGeVkyZ29ZMjl1Wm1sbktTbGNiaUFnSUNBZ0lIMWNiaUFnSUNCOUtWeHVJQ0I5WEc1Y2JpQWdhV1lnS0dSeWIzQmtiM2R1Y3lrZ2UxeHVJQ0FnSUdSdlkzVnRaVzUwTG1Ga1pFVjJaVzUwVEdsemRHVnVaWElvSjJOc2FXTnJKeXdnS0dWMlpXNTBLU0E5UGlCN1hHNGdJQ0FnSUNCamIyNXpkQ0JrY205d1pHOTNiazFsYm5VZ1BTQm1hVzVrVkdGeVoyVjBRbmxEYkdGemN5aGxkbVZ1ZEM1MFlYSm5aWFFzSUNka2NtOXdaRzkzYmkxdFpXNTFKeWxjYmlBZ0lDQWdJR2xtSUNoa2NtOXdaRzkzYmsxbGJuVXBJSHRjYmlBZ0lDQWdJQ0FnY21WMGRYSnVYRzRnSUNBZ0lDQjlYRzVjYmlBZ0lDQWdJR052Ym5OMElHUnliM0JrYjNkdUlEMGdabWx1WkZSaGNtZGxkRUo1UTJ4aGMzTW9aWFpsYm5RdWRHRnlaMlYwTENBblpISnZjR1J2ZDI0bktWeHVYRzRnSUNBZ0lDQnBaaUFvWkhKdmNHUnZkMjRwSUh0Y2JpQWdJQ0FnSUNBZ1kyOXVjM1FnWkdGMFlWUnZaMmRzWlVGMGRISWdQU0JrY205d1pHOTNiaTVuWlhSQmRIUnlhV0oxZEdVb0oyUmhkR0V0ZEc5bloyeGxKeWxjYmlBZ0lDQWdJQ0FnYVdZZ0tHUmhkR0ZVYjJkbmJHVkJkSFJ5SUNZbUlHUmhkR0ZVYjJkbmJHVkJkSFJ5SUQwOVBTQk9RVTFGSUNZbUlHUnliM0JrYjNkdUtTQjdYRzRnSUNBZ0lDQWdJQ0FnWTI5dWMzUWdZMjl0Y0c5dVpXNTBJRDBnWTI5dGNHOXVaVzUwY3k1bWFXNWtLR01nUFQ0Z1l5NW5aWFJGYkdWdFpXNTBLQ2tnUFQwOUlHUnliM0JrYjNkdUtWeHVYRzRnSUNBZ0lDQWdJQ0FnYVdZZ0tDRmpiMjF3YjI1bGJuUXBJSHRjYmlBZ0lDQWdJQ0FnSUNBZ0lISmxkSFZ5Ymx4dUlDQWdJQ0FnSUNBZ0lIMWNibHh1SUNBZ0lDQWdJQ0FnSUdOdmJYQnZibVZ1ZEM1MGIyZG5iR1VvS1Z4dUlDQWdJQ0FnSUNCOVhHNGdJQ0FnSUNCOVhHNGdJQ0FnZlNsY2JpQWdmVnh1WEc0Z0lISmxkSFZ5YmlCRWNtOXdaRzkzYmxObFlYSmphRnh1ZlNrb0tWeHVYRzVsZUhCdmNuUWdaR1ZtWVhWc2RDQkVjbTl3Wkc5M2JsTmxZWEpqYUZ4dUlpd2lMeW9xWEc0Z0tpQXRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMVnh1SUNvZ1RHbGpaVzV6WldRZ2RXNWtaWElnVFVsVUlDaG9kSFJ3Y3pvdkwyZHBkR2gxWWk1amIyMHZjWFZoY21zdFpHVjJMMUJvYjI1dmJpMUdjbUZ0WlhkdmNtc3ZZbXh2WWk5dFlYTjBaWEl2VEVsRFJVNVRSU2xjYmlBcUlDMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRYRzRnS2k5Y2JtbHRjRzl5ZENCRGIyMXdiMjVsYm5RZ1puSnZiU0FuTGk0dlkyOXRjRzl1Wlc1MEoxeHVYRzVqYjI1emRDQk1iMkZrWlhJZ1BTQW9LQ2tnUFQ0Z2UxeHVJQ0F2S2lwY2JpQWdJQ29nTFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0WEc0Z0lDQXFJRU52Ym5OMFlXNTBjMXh1SUNBZ0tpQXRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMWNiaUFnSUNvdlhHNWNiaUFnWTI5dWMzUWdUa0ZOUlNBOUlDZHNiMkZrWlhJblhHNGdJR052Ym5OMElGWkZVbE5KVDA0Z1BTQW5NaTR3TGpBblhHNGdJR052Ym5OMElFUkZSa0ZWVEZSZlVGSlBVRVZTVkVsRlV5QTlJSHRjYmlBZ0lDQmxiR1Z0Wlc1ME9pQnVkV3hzTEZ4dUlDQWdJR052Ykc5eU9pQnVkV3hzTEZ4dUlDQWdJSE5wZW1VNklHNTFiR3dzWEc0Z0lIMWNiaUFnWTI5dWMzUWdSRUZVUVY5QlZGUlNVMTlRVWs5UVJWSlVTVVZUSUQwZ1cxMWNibHh1SUNBdktpcGNiaUFnSUNvZ0xTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdFhHNGdJQ0FxSUVOc1lYTnpJRVJsWm1sdWFYUnBiMjVjYmlBZ0lDb2dMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRYRzRnSUNBcUwxeHVYRzRnSUdOc1lYTnpJRXh2WVdSbGNpQmxlSFJsYm1SeklFTnZiWEJ2Ym1WdWRDQjdYRzVjYmlBZ0lDQmpiMjV6ZEhKMVkzUnZjaWh2Y0hScGIyNXpJRDBnZTMwcElIdGNiaUFnSUNBZ0lITjFjR1Z5S0U1QlRVVXNJRlpGVWxOSlQwNHNJRVJGUmtGVlRGUmZVRkpQVUVWU1ZFbEZVeXdnYjNCMGFXOXVjeXdnUkVGVVFWOUJWRlJTVTE5UVVrOVFSVkpVU1VWVExDQm1ZV3h6WlN3Z1ptRnNjMlVwWEc1Y2JpQWdJQ0FnSUM4dklITmxkQ0JqYjJ4dmNseHVJQ0FnSUNBZ1kyOXVjM1FnYkc5aFpHVnlVM0JwYm01bGNpQTlJSFJvYVhNdVoyVjBVM0JwYm01bGNpZ3BYRzRnSUNBZ0lDQnBaaUFvZEhsd1pXOW1JSFJvYVhNdWIzQjBhVzl1Y3k1amIyeHZjaUE5UFQwZ0ozTjBjbWx1WnlkY2JpQWdJQ0FnSUNBZ0ppWWdJV3h2WVdSbGNsTndhVzV1WlhJdVkyeGhjM05NYVhOMExtTnZiblJoYVc1ektHQmpiMnh2Y2kwa2UzUm9hWE11YjNCMGFXOXVjeTVqYjJ4dmNuMWdLU2tnZTF4dUlDQWdJQ0FnSUNCc2IyRmtaWEpUY0dsdWJtVnlMbU5zWVhOelRHbHpkQzVoWkdRb1lHTnZiRzl5TFNSN2RHaHBjeTV2Y0hScGIyNXpMbU52Ykc5eWZXQXBYRzRnSUNBZ0lDQjlYRzVjYmlBZ0lDQWdJSFJvYVhNdVkzVnpkRzl0VTJsNlpTQTlJSFJvYVhNdWIzQjBhVzl1Y3k1emFYcGxJQ0U5UFNCdWRXeHNYRzRnSUNBZ2ZWeHVYRzRnSUNBZ1oyVjBRMnhwWlc1MFUybDZaU2dwSUh0Y2JpQWdJQ0FnSUdsbUlDZ2hkR2hwY3k1amRYTjBiMjFUYVhwbEtTQjdYRzRnSUNBZ0lDQWdJR052Ym5OMElITnBlbVVnUFNCMGFHbHpMbTl3ZEdsdmJuTXVaV3hsYldWdWRDNW5aWFJDYjNWdVpHbHVaME5zYVdWdWRGSmxZM1FvS1NBZ0lDQWdJQ0FnWEc0Z0lDQWdJQ0FnSUhKbGRIVnliaUJ6YVhwbExtaGxhV2RvZEZ4dUlDQWdJQ0FnZlZ4dVhHNGdJQ0FnSUNCeVpYUjFjbTRnZEdocGN5NXZjSFJwYjI1ekxuTnBlbVZjYmlBZ0lDQjlYRzVjYmlBZ0lDQm5aWFJUY0dsdWJtVnlLQ2tnZTF4dUlDQWdJQ0FnY21WMGRYSnVJSFJvYVhNdWIzQjBhVzl1Y3k1bGJHVnRaVzUwTG5GMVpYSjVVMlZzWldOMGIzSW9KeTVzYjJGa1pYSXRjM0JwYm01bGNpY3BYRzRnSUNBZ2ZWeHVYRzRnSUNBZ2MyaHZkeWdwSUh0Y2JpQWdJQ0FnSUdsbUlDaDBhR2x6TG05d2RHbHZibk11Wld4bGJXVnVkQzVqYkdGemMweHBjM1F1WTI5dWRHRnBibk1vSjJocFpHVW5LU2tnZTF4dUlDQWdJQ0FnSUNCMGFHbHpMbTl3ZEdsdmJuTXVaV3hsYldWdWRDNWpiR0Z6YzB4cGMzUXVjbVZ0YjNabEtDZG9hV1JsSnlsY2JpQWdJQ0FnSUgxY2JseHVJQ0FnSUNBZ1kyOXVjM1FnYzJsNlpTQTlJSFJvYVhNdVoyVjBRMnhwWlc1MFUybDZaU2dwWEc0Z0lDQWdJQ0IwYUdsekxtOXdkR2x2Ym5NdWMybDZaU0E5SUhOcGVtVmNibHh1SUNBZ0lDQWdhV1lnS0hSb2FYTXVZM1Z6ZEc5dFUybDZaU2tnZTF4dUlDQWdJQ0FnSUNCMGFHbHpMbTl3ZEdsdmJuTXVaV3hsYldWdWRDNXpkSGxzWlM1M2FXUjBhQ0E5SUdBa2UzUm9hWE11YjNCMGFXOXVjeTV6YVhwbGZYQjRZRnh1SUNBZ0lDQWdJQ0IwYUdsekxtOXdkR2x2Ym5NdVpXeGxiV1Z1ZEM1emRIbHNaUzVvWldsbmFIUWdQU0JnSkh0MGFHbHpMbTl3ZEdsdmJuTXVjMmw2Wlgxd2VHQmNibHh1SUNBZ0lDQWdJQ0JqYjI1emRDQnNiMkZrWlhKVGNHbHVibVZ5SUQwZ2RHaHBjeTVuWlhSVGNHbHVibVZ5S0NsY2JpQWdJQ0FnSUNBZ2JHOWhaR1Z5VTNCcGJtNWxjaTV6ZEhsc1pTNTNhV1IwYUNBOUlHQWtlM1JvYVhNdWIzQjBhVzl1Y3k1emFYcGxmWEI0WUZ4dUlDQWdJQ0FnSUNCc2IyRmtaWEpUY0dsdWJtVnlMbk4wZVd4bExtaGxhV2RvZENBOUlHQWtlM1JvYVhNdWIzQjBhVzl1Y3k1emFYcGxmWEI0WUZ4dUlDQWdJQ0FnZlZ4dVhHNGdJQ0FnSUNCeVpYUjFjbTRnZEhKMVpWeHVJQ0FnSUgxY2JseHVJQ0FnSUdGdWFXMWhkR1VvYzNSaGNuUkJibWx0WVhScGIyNGdQU0IwY25WbEtTQjdYRzRnSUNBZ0lDQnBaaUFvYzNSaGNuUkJibWx0WVhScGIyNHBJSHRjYmlBZ0lDQWdJQ0FnZEdocGN5NXphRzkzS0NsY2JpQWdJQ0FnSUgwZ1pXeHpaU0I3WEc0Z0lDQWdJQ0FnSUhSb2FYTXVhR2xrWlNncFhHNGdJQ0FnSUNCOVhHNWNiaUFnSUNBZ0lHTnZibk4wSUd4dllXUmxjbE53YVc1dVpYSWdQU0IwYUdsekxtZGxkRk53YVc1dVpYSW9LVnh1WEc0Z0lDQWdJQ0JwWmlBb2MzUmhjblJCYm1sdFlYUnBiMjRnSmlaY2JpQWdJQ0FnSUNBZ0lXeHZZV1JsY2xOd2FXNXVaWEl1WTJ4aGMzTk1hWE4wTG1OdmJuUmhhVzV6S0Nkc2IyRmtaWEl0YzNCcGJtNWxjaTFoYm1sdFlYUmxaQ2NwS1NCN1hHNGdJQ0FnSUNBZ0lHeHZZV1JsY2xOd2FXNXVaWEl1WTJ4aGMzTk1hWE4wTG1Ga1pDZ25iRzloWkdWeUxYTndhVzV1WlhJdFlXNXBiV0YwWldRbktWeHVJQ0FnSUNBZ0lDQnlaWFIxY200Z2RISjFaVnh1SUNBZ0lDQWdmVnh1WEc0Z0lDQWdJQ0JwWmlBb0lYTjBZWEowUVc1cGJXRjBhVzl1SUNZbVhHNGdJQ0FnSUNBZ0lHeHZZV1JsY2xOd2FXNXVaWEl1WTJ4aGMzTk1hWE4wTG1OdmJuUmhhVzV6S0Nkc2IyRmtaWEl0YzNCcGJtNWxjaTFoYm1sdFlYUmxaQ2NwS1NCN1hHNGdJQ0FnSUNBZ0lHeHZZV1JsY2xOd2FXNXVaWEl1WTJ4aGMzTk1hWE4wTG5KbGJXOTJaU2duYkc5aFpHVnlMWE53YVc1dVpYSXRZVzVwYldGMFpXUW5LVnh1SUNBZ0lDQWdmVnh1WEc0Z0lDQWdJQ0J5WlhSMWNtNGdkSEoxWlZ4dUlDQWdJSDFjYmx4dUlDQWdJR2hwWkdVb0tTQjdYRzRnSUNBZ0lDQnBaaUFvSVhSb2FYTXViM0IwYVc5dWN5NWxiR1Z0Wlc1MExtTnNZWE56VEdsemRDNWpiMjUwWVdsdWN5Z25hR2xrWlNjcEtTQjdYRzRnSUNBZ0lDQWdJSFJvYVhNdWIzQjBhVzl1Y3k1bGJHVnRaVzUwTG1Oc1lYTnpUR2x6ZEM1aFpHUW9KMmhwWkdVbktWeHVJQ0FnSUNBZ2ZWeHVYRzRnSUNBZ0lDQnlaWFIxY200Z2RISjFaVnh1SUNBZ0lIMWNibHh1SUNBZ0lITjBZWFJwWXlCcFpHVnVkR2xtYVdWeUtDa2dlMXh1SUNBZ0lDQWdjbVYwZFhKdUlFNUJUVVZjYmlBZ0lDQjlYRzVjYmlBZ0lDQnpkR0YwYVdNZ1gwUlBUVWx1ZEdWeVptRmpaU2h2Y0hScGIyNXpLU0I3WEc0Z0lDQWdJQ0J5WlhSMWNtNGdjM1Z3WlhJdVgwUlBUVWx1ZEdWeVptRmpaU2hNYjJGa1pYSXNJRzl3ZEdsdmJuTXBYRzRnSUNBZ2ZWeHVJQ0I5WEc1Y2JpQWdjbVYwZFhKdUlFeHZZV1JsY2x4dWZTa29LVnh1WEc1bGVIQnZjblFnWkdWbVlYVnNkQ0JNYjJGa1pYSmNiaUlzSWk4cUtseHVLaUF0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFZ4dUtpQk1hV05sYm5ObFpDQjFibVJsY2lCTlNWUWdLR2gwZEhCek9pOHZaMmwwYUhWaUxtTnZiUzl4ZFdGeWF5MWtaWFl2VUdodmJtOXVMVVp5WVcxbGQyOXlheTlpYkc5aUwyMWhjM1JsY2k5TVNVTkZUbE5GS1Z4dUtpQXRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMVnh1S2k5Y2JtbHRjRzl5ZENCRmRtVnVkQ0JtY205dElDY3VMaTh1TGk5amIyMXRiMjR2WlhabGJuUnpKMXh1YVcxd2IzSjBJRU52YlhCdmJtVnVkQ0JtY205dElDY3VMaTlqYjIxd2IyNWxiblFuWEc1Y2JtTnZibk4wSUU1dmRHbG1hV05oZEdsdmJpQTlJQ2dvS1NBOVBpQjdYRzRnSUM4cUtseHVJQ0FnS2lBdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMxY2JpQWdLaUJEYjI1emRHRnVkSE5jYmlBZ0tpQXRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMWNiaUFnS2k5Y2JseHVJQ0JqYjI1emRDQk9RVTFGSUQwZ0oyNXZkR2xtYVdOaGRHbHZiaWRjYmlBZ1kyOXVjM1FnVmtWU1UwbFBUaUE5SUNjeUxqQXVNQ2RjYmlBZ1kyOXVjM1FnUkVWR1FWVk1WRjlRVWs5UVJWSlVTVVZUSUQwZ2UxeHVJQ0FnSUdWc1pXMWxiblE2SUc1MWJHd3NYRzRnSUNBZ2JXVnpjMkZuWlRvZ0p5Y3NYRzRnSUNBZ2MyaHZkMEoxZEhSdmJqb2dkSEoxWlN4Y2JpQWdJQ0IwYVcxbGIzVjBPaUJ1ZFd4c0xGeHVJQ0FnSUdKaFkydG5jbTkxYm1RNklDZHdjbWx0WVhKNUp5eGNiaUFnZlZ4dUlDQmpiMjV6ZENCRVFWUkJYMEZVVkZKVFgxQlNUMUJGVWxSSlJWTWdQU0JiWEc0Z0lDQWdKM1JwYldWdmRYUW5MRnh1SUNCZFhHNWNiaUFnTHlvcVhHNGdJQ0FxSUMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFZ4dUlDQWdLaUJEYkdGemN5QkVaV1pwYm1sMGFXOXVYRzRnSUNBcUlDMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExWeHVJQ0FnS2k5Y2JseHVJQ0JqYkdGemN5Qk9iM1JwWm1sallYUnBiMjRnWlhoMFpXNWtjeUJEYjIxd2IyNWxiblFnZTF4dVhHNGdJQ0FnWTI5dWMzUnlkV04wYjNJb2IzQjBhVzl1Y3lBOUlIdDlLU0I3WEc0Z0lDQWdJQ0J6ZFhCbGNpaE9RVTFGTENCV1JWSlRTVTlPTENCRVJVWkJWVXhVWDFCU1QxQkZVbFJKUlZNc0lHOXdkR2x2Ym5Nc0lFUkJWRUZmUVZSVVVsTmZVRkpQVUVWU1ZFbEZVeXdnZEhKMVpTd2dabUZzYzJVcFhHNWNiaUFnSUNBZ0lIUm9hWE11ZEdWdGNHeGhkR1VnUFNBbkp5QXJYRzRnSUNBZ0lDQW5QR1JwZGlCamJHRnpjejFjSW01dmRHbG1hV05oZEdsdmJsd2lQaWNnSzF4dUlDQWdJQ0FnSUNBblBHUnBkaUJqYkdGemN6MWNJbTV2ZEdsbWFXTmhkR2x2YmkxcGJtNWxjbHdpUGljZ0sxeHVJQ0FnSUNBZ0lDQWdJQ2M4WkdsMklHTnNZWE56UFZ3aWJXVnpjMkZuWlZ3aVBqd3ZaR2wyUGljZ0sxeHVJQ0FnSUNBZ0lDQWdJQ2M4WW5WMGRHOXVJSFI1Y0dVOVhDSmlkWFIwYjI1Y0lpQmpiR0Z6Y3oxY0ltTnNiM05sWENJZ1pHRjBZUzFrYVhOdGFYTnpQVndpYm05MGFXWnBZMkYwYVc5dVhDSWdZWEpwWVMxc1lXSmxiRDFjSWtOc2IzTmxYQ0krSnlBclhHNGdJQ0FnSUNBZ0lDQWdJQ0FuUEhOd1lXNGdZWEpwWVMxb2FXUmtaVzQ5WENKMGNuVmxYQ0krSm5ScGJXVnpPend2YzNCaGJqNG5JQ3RjYmlBZ0lDQWdJQ0FnSUNBblBDOWlkWFIwYjI0K0p5QXJYRzRnSUNBZ0lDQWdJQ2M4TDJScGRqNG5JQ3RjYmlBZ0lDQWdJQ2M4TDJScGRqNG5YRzVjYmlBZ0lDQWdJR2xtSUNoMGFHbHpMbVI1Ym1GdGFXTkZiR1Z0Wlc1MEtTQjdYRzRnSUNBZ0lDQWdJSFJvYVhNdVluVnBiR1FvS1Z4dUlDQWdJQ0FnZlZ4dVhHNGdJQ0FnSUNCMGFHbHpMblJwYldWdmRYUkRZV3hzWW1GamF5QTlJRzUxYkd4Y2JpQWdJQ0I5WEc1Y2JpQWdJQ0JpZFdsc1pDZ3BJSHRjYmlBZ0lDQWdJR052Ym5OMElHSjFhV3hrWlhJZ1BTQmtiMk4xYldWdWRDNWpjbVZoZEdWRmJHVnRaVzUwS0Nka2FYWW5LVnh1WEc0Z0lDQWdJQ0JpZFdsc1pHVnlMbWx1Ym1WeVNGUk5UQ0E5SUhSb2FYTXVkR1Z0Y0d4aGRHVmNibHh1SUNBZ0lDQWdkR2hwY3k1dmNIUnBiMjV6TG1Wc1pXMWxiblFnUFNCaWRXbHNaR1Z5TG1acGNuTjBRMmhwYkdSY2JseHVJQ0FnSUNBZ0x5OGdkR1Y0ZENCdFpYTnpZV2RsWEc0Z0lDQWdJQ0IwYUdsekxtOXdkR2x2Ym5NdVpXeGxiV1Z1ZEM1eGRXVnllVk5sYkdWamRHOXlLQ2N1YldWemMyRm5aU2NwTG1sdWJtVnlTRlJOVENBOUlIUm9hWE11YjNCMGFXOXVjeTV0WlhOellXZGxYRzVjYmlBZ0lDQWdJR2xtSUNnaGRHaHBjeTV2Y0hScGIyNXpMbk5vYjNkQ2RYUjBiMjRwSUh0Y2JpQWdJQ0FnSUNBZ2RHaHBjeTV2Y0hScGIyNXpMbVZzWlcxbGJuUXVjWFZsY25sVFpXeGxZM1J2Y2lnblluVjBkRzl1SnlrdWMzUjViR1V1WkdsemNHeGhlU0E5SUNkdWIyNWxKMXh1SUNBZ0lDQWdmVnh1WEc0Z0lDQWdJQ0JrYjJOMWJXVnVkQzVpYjJSNUxtRndjR1Z1WkVOb2FXeGtLSFJvYVhNdWIzQjBhVzl1Y3k1bGJHVnRaVzUwS1Z4dVhHNGdJQ0FnSUNCMGFHbHpMbk5sZEVGMGRISnBZblYwWlhNb0tWeHVJQ0FnSUgxY2JseHVJQ0FnSUhOb2IzY29LU0I3WEc0Z0lDQWdJQ0JwWmlBb2RHaHBjeTV2Y0hScGIyNXpMbVZzWlcxbGJuUWdQVDA5SUc1MWJHd3BJSHRjYmlBZ0lDQWdJQ0FnTHk4Z1luVnBiR1FnWVc1a0lHbHVjMlZ5ZENCaElHNWxkeUJFVDAwZ1pXeGxiV1Z1ZEZ4dUlDQWdJQ0FnSUNCMGFHbHpMbUoxYVd4a0tDbGNiaUFnSUNBZ0lIMWNibHh1SUNBZ0lDQWdhV1lnS0hSb2FYTXViM0IwYVc5dWN5NWxiR1Z0Wlc1MExtTnNZWE56VEdsemRDNWpiMjUwWVdsdWN5Z25jMmh2ZHljcEtTQjdYRzRnSUNBZ0lDQWdJSEpsZEhWeWJpQm1ZV3h6WlZ4dUlDQWdJQ0FnZlZ4dVhHNGdJQ0FnSUNBdkx5QnlaWE5sZENCamIyeHZjbHh1SUNBZ0lDQWdhV1lnS0hSb2FYTXViM0IwYVc5dWN5NWlZV05yWjNKdmRXNWtLU0I3WEc0Z0lDQWdJQ0FnSUhSb2FYTXViM0IwYVc5dWN5NWxiR1Z0Wlc1MExuSmxiVzkyWlVGMGRISnBZblYwWlNnblkyeGhjM01uS1Z4dUlDQWdJQ0FnSUNCMGFHbHpMbTl3ZEdsdmJuTXVaV3hsYldWdWRDNXpaWFJCZEhSeWFXSjFkR1VvSjJOc1lYTnpKeXdnSjI1dmRHbG1hV05oZEdsdmJpY3BYRzVjYmlBZ0lDQWdJQ0FnZEdocGN5NXZjSFJwYjI1ekxtVnNaVzFsYm5RdVkyeGhjM05NYVhOMExtRmtaQ2hnWW1jdEpIdDBhR2x6TG05d2RHbHZibk11WW1GamEyZHliM1Z1WkgxZ0tWeHVJQ0FnSUNBZ0lDQjBhR2x6TG05d2RHbHZibk11Wld4bGJXVnVkQzV4ZFdWeWVWTmxiR1ZqZEc5eUtDZGlkWFIwYjI0bktTNWpiR0Z6YzB4cGMzUXVZV1JrS0dCaWRHNHRKSHQwYUdsekxtOXdkR2x2Ym5NdVltRmphMmR5YjNWdVpIMWdLVnh1SUNBZ0lDQWdmVnh1WEc0Z0lDQWdJQ0JwWmlBb2RHaHBjeTV2Y0hScGIyNXpMbk5vYjNkQ2RYUjBiMjRwSUh0Y2JpQWdJQ0FnSUNBZ0x5OGdZWFIwWVdOb0lIUm9aU0JpZFhSMGIyNGdhR0Z1Wkd4bGNseHVJQ0FnSUNBZ0lDQmpiMjV6ZENCaWRYUjBiMjVGYkdWdFpXNTBJRDBnZEdocGN5NXZjSFJwYjI1ekxtVnNaVzFsYm5RdWNYVmxjbmxUWld4bFkzUnZjaWduWW5WMGRHOXVKeWxjYmlBZ0lDQWdJQ0FnZEdocGN5NXlaV2RwYzNSbGNrVnNaVzFsYm5Rb2V5QjBZWEpuWlhRNklHSjFkSFJ2YmtWc1pXMWxiblFzSUdWMlpXNTBPaUFuWTJ4cFkyc25JSDBwWEc0Z0lDQWdJQ0I5WEc1Y2JpQWdJQ0FnSUhObGRGUnBiV1Z2ZFhRb0tDa2dQVDRnZTF4dUlDQWdJQ0FnSUNCMGFHbHpMbTl3ZEdsdmJuTXVaV3hsYldWdWRDNWpiR0Z6YzB4cGMzUXVZV1JrS0NkemFHOTNKeWxjYmx4dUlDQWdJQ0FnSUNBdkx5QnpaWFFnY0c5emFYUnBiMjVjYmlBZ0lDQWdJQ0FnWTI5dWMzUWdZV04wYVhabFRtOTBhV1pwWTJGMGFXOXVjeUE5SUdSdlkzVnRaVzUwTG5GMVpYSjVVMlZzWldOMGIzSkJiR3dvSnk1dWIzUnBabWxqWVhScGIyNHVjMmh2ZHljcElIeDhJRnRkWEc0Z0lDQWdJQ0FnSUd4bGRDQndkWE5vUkdsemRHRnVZMlVnUFNBd1hHNGdJQ0FnSUNBZ0lHRmpkR2wyWlU1dmRHbG1hV05oZEdsdmJuTXVabTl5UldGamFDZ29ibTkwYVdacFkyRjBhVzl1S1NBOVBpQjdYRzRnSUNBZ0lDQWdJQ0FnYVdZZ0tIUm9hWE11YjNCMGFXOXVjeTVsYkdWdFpXNTBJQ0U5UFNCdWIzUnBabWxqWVhScGIyNHBJSHRjYmlBZ0lDQWdJQ0FnSUNBZ0lHTnZibk4wSUhOMGVXeGxJRDBnWjJWMFEyOXRjSFYwWldSVGRIbHNaU2h1YjNScFptbGpZWFJwYjI0cFhHNGdJQ0FnSUNBZ0lDQWdJQ0J3ZFhOb1JHbHpkR0Z1WTJVZ0t6MGdibTkwYVdacFkyRjBhVzl1TG05bVpuTmxkRWhsYVdkb2RDQXJJSEJoY25ObFNXNTBLSE4wZVd4bExtMWhjbWRwYmtKdmRIUnZiU3dnTVRBcFhHNGdJQ0FnSUNBZ0lDQWdmVnh1SUNBZ0lDQWdJQ0I5S1Z4dVhHNGdJQ0FnSUNBZ0lIUm9hWE11YjNCMGFXOXVjeTVsYkdWdFpXNTBMbk4wZVd4bExuUnlZVzV6Wm05eWJTQTlJR0IwY21GdWMyeGhkR1ZaS0NSN2NIVnphRVJwYzNSaGJtTmxmWEI0S1dCY2JseHVJQ0FnSUNBZ0lDQjBhR2x6TG5SeWFXZG5aWEpGZG1WdWRDaEZkbVZ1ZEM1VFNFOVhLVnh1WEc0Z0lDQWdJQ0FnSUdOdmJuTjBJRzl1VTJodmQyNGdQU0FvS1NBOVBpQjdYRzRnSUNBZ0lDQWdJQ0FnZEdocGN5NTBjbWxuWjJWeVJYWmxiblFvUlhabGJuUXVVMGhQVjA0cFhHNGdJQ0FnSUNBZ0lDQWdkR2hwY3k1dmNIUnBiMjV6TG1Wc1pXMWxiblF1Y21WdGIzWmxSWFpsYm5STWFYTjBaVzVsY2loRmRtVnVkQzVVVWtGT1UwbFVTVTlPWDBWT1JDd2diMjVUYUc5M2JpbGNiaUFnSUNBZ0lDQWdmVnh1WEc0Z0lDQWdJQ0FnSUhSb2FYTXViM0IwYVc5dWN5NWxiR1Z0Wlc1MExtRmtaRVYyWlc1MFRHbHpkR1Z1WlhJb1JYWmxiblF1VkZKQlRsTkpWRWxQVGw5RlRrUXNJRzl1VTJodmQyNHBYRzVjYmlBZ0lDQWdJSDBzSURFcFhHNWNiaUFnSUNBZ0lHbG1JQ2hPZFcxaVpYSXVhWE5KYm5SbFoyVnlLSFJvYVhNdWIzQjBhVzl1Y3k1MGFXMWxiM1YwS1NBbUppQjBhR2x6TG05d2RHbHZibk11ZEdsdFpXOTFkQ0ErSURBcElIdGNiaUFnSUNBZ0lDQWdMeThnYVdZZ2RHaGxjbVVnYVhNZ1lTQjBhVzFsYjNWMExDQmhkWFJ2SUdocFpHVWdkR2hsSUc1dmRHbG1hV05oZEdsdmJseHVJQ0FnSUNBZ0lDQjBhR2x6TG5ScGJXVnZkWFJEWVd4c1ltRmpheUE5SUhObGRGUnBiV1Z2ZFhRb0tDa2dQVDRnZTF4dUlDQWdJQ0FnSUNBZ0lIUm9hWE11YUdsa1pTZ3BYRzRnSUNBZ0lDQWdJSDBzSUhSb2FYTXViM0IwYVc5dWN5NTBhVzFsYjNWMElDc2dNU2xjYmlBZ0lDQWdJSDFjYmx4dUlDQWdJQ0FnY21WMGRYSnVJSFJ5ZFdWY2JpQWdJQ0I5WEc1Y2JpQWdJQ0JvYVdSbEtDa2dlMXh1SUNBZ0lDQWdMeXBjYmlBZ0lDQWdJQ0FxSUhCeVpYWmxiblFnZEc4Z1kyeHZjMlVnWVNCdWIzUnBabWxqWVhScGIyNGdkMmwwYUNCaElIUnBiV1Z2ZFhSY2JpQWdJQ0FnSUNBcUlHbG1JSFJvWlNCMWMyVnlJR2hoY3lCaGJISmxZV1I1SUdOc2FXTnJaV1FnYjI0Z2RHaGxJR0oxZEhSdmJseHVJQ0FnSUNBZ0lDb3ZYRzRnSUNBZ0lDQnBaaUFvZEdocGN5NTBhVzFsYjNWMFEyRnNiR0poWTJzcElIdGNiaUFnSUNBZ0lDQWdZMnhsWVhKVWFXMWxiM1YwS0hSb2FYTXVkR2x0Wlc5MWRFTmhiR3hpWVdOcktWeHVJQ0FnSUNBZ0lDQjBhR2x6TG5ScGJXVnZkWFJEWVd4c1ltRmpheUE5SUc1MWJHeGNiaUFnSUNBZ0lIMWNibHh1SUNBZ0lDQWdhV1lnS0NGMGFHbHpMbTl3ZEdsdmJuTXVaV3hsYldWdWRDNWpiR0Z6YzB4cGMzUXVZMjl1ZEdGcGJuTW9KM05vYjNjbktTa2dlMXh1SUNBZ0lDQWdJQ0J5WlhSMWNtNGdabUZzYzJWY2JpQWdJQ0FnSUgxY2JseHVJQ0FnSUNBZ2RHaHBjeTUwY21sbloyVnlSWFpsYm5Rb1JYWmxiblF1U0VsRVJTbGNibHh1SUNBZ0lDQWdhV1lnS0hSb2FYTXViM0IwYVc5dWN5NXphRzkzUW5WMGRHOXVLU0I3WEc0Z0lDQWdJQ0FnSUdOdmJuTjBJR0oxZEhSdmJrVnNaVzFsYm5RZ1BTQjBhR2x6TG05d2RHbHZibk11Wld4bGJXVnVkQzV4ZFdWeWVWTmxiR1ZqZEc5eUtDZGlkWFIwYjI0bktWeHVJQ0FnSUNBZ0lDQjBhR2x6TG5WdWNtVm5hWE4wWlhKRmJHVnRaVzUwS0hzZ2RHRnlaMlYwT2lCaWRYUjBiMjVGYkdWdFpXNTBMQ0JsZG1WdWREb2dKMk5zYVdOckp5QjlLVnh1SUNBZ0lDQWdmVnh1WEc0Z0lDQWdJQ0IwYUdsekxtOXdkR2x2Ym5NdVpXeGxiV1Z1ZEM1amJHRnpjMHhwYzNRdWNtVnRiM1psS0NkemFHOTNKeWxjYmlBZ0lDQWdJSFJvYVhNdWIzQjBhVzl1Y3k1bGJHVnRaVzUwTG1Oc1lYTnpUR2x6ZEM1aFpHUW9KMmhwWkdVbktWeHVYRzRnSUNBZ0lDQmpiMjV6ZENCdmJraHBaR1JsYmlBOUlDZ3BJRDArSUh0Y2JpQWdJQ0FnSUNBZ2RHaHBjeTV2Y0hScGIyNXpMbVZzWlcxbGJuUXVjbVZ0YjNabFJYWmxiblJNYVhOMFpXNWxjaWhGZG1WdWRDNVVVa0ZPVTBsVVNVOU9YMFZPUkN3Z2IyNUlhV1JrWlc0cFhHNGdJQ0FnSUNBZ0lIUm9hWE11YjNCMGFXOXVjeTVsYkdWdFpXNTBMbU5zWVhOelRHbHpkQzV5WlcxdmRtVW9KMmhwWkdVbktWeHVYRzRnSUNBZ0lDQWdJSFJvYVhNdWRISnBaMmRsY2tWMlpXNTBLRVYyWlc1MExraEpSRVJGVGlsY2JseHVJQ0FnSUNBZ0lDQnBaaUFvZEdocGN5NWtlVzVoYldsalJXeGxiV1Z1ZENrZ2UxeHVJQ0FnSUNBZ0lDQWdJR1J2WTNWdFpXNTBMbUp2WkhrdWNtVnRiM1psUTJocGJHUW9kR2hwY3k1dmNIUnBiMjV6TG1Wc1pXMWxiblFwWEc0Z0lDQWdJQ0FnSUNBZ2RHaHBjeTV2Y0hScGIyNXpMbVZzWlcxbGJuUWdQU0J1ZFd4c1hHNGdJQ0FnSUNBZ0lIMWNiaUFnSUNBZ0lIMWNibHh1SUNBZ0lDQWdkR2hwY3k1dmNIUnBiMjV6TG1Wc1pXMWxiblF1WVdSa1JYWmxiblJNYVhOMFpXNWxjaWhGZG1WdWRDNVVVa0ZPVTBsVVNVOU9YMFZPUkN3Z2IyNUlhV1JrWlc0cFhHNWNiaUFnSUNBZ0lISmxkSFZ5YmlCMGNuVmxYRzRnSUNBZ2ZWeHVYRzRnSUNBZ2IyNUZiR1Z0Wlc1MFJYWmxiblFvS1NCN1hHNGdJQ0FnSUNCMGFHbHpMbWhwWkdVb0tWeHVJQ0FnSUgxY2JseHVJQ0FnSUhOMFlYUnBZeUJwWkdWdWRHbG1hV1Z5S0NrZ2UxeHVJQ0FnSUNBZ2NtVjBkWEp1SUU1QlRVVmNiaUFnSUNCOVhHNWNiaUFnSUNCemRHRjBhV01nWDBSUFRVbHVkR1Z5Wm1GalpTaHZjSFJwYjI1ektTQjdYRzRnSUNBZ0lDQnlaWFIxY200Z2MzVndaWEl1WDBSUFRVbHVkR1Z5Wm1GalpTaE9iM1JwWm1sallYUnBiMjRzSUc5d2RHbHZibk1wWEc0Z0lDQWdmVnh1SUNCOVhHNWNiaUFnY21WMGRYSnVJRTV2ZEdsbWFXTmhkR2x2Ymx4dWZTa29LVnh1WEc1bGVIQnZjblFnWkdWbVlYVnNkQ0JPYjNScFptbGpZWFJwYjI1Y2JpSXNJaThxS2x4dUlDb2dMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzFjYmlBcUlFeHBZMlZ1YzJWa0lIVnVaR1Z5SUUxSlZDQW9hSFIwY0hNNkx5OW5hWFJvZFdJdVkyOXRMM0YxWVhKckxXUmxkaTlRYUc5dWIyNHRSbkpoYldWM2IzSnJMMkpzYjJJdmJXRnpkR1Z5TDB4SlEwVk9VMFVwWEc0Z0tpQXRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMVnh1SUNvdlhHNXBiWEJ2Y25RZ1JYWmxiblFnWm5KdmJTQW5MaTR2TGk0dlkyOXRiVzl1TDJWMlpXNTBjeWRjYm1sdGNHOXlkQ0JEYjIxd2IyNWxiblFnWm5KdmJTQW5MaTR2WTI5dGNHOXVaVzUwSjF4dWFXMXdiM0owSUhzZ1oyVjBRWFIwY21saWRYUmxjME52Ym1acFp5QjlJR1p5YjIwZ0p5NHVMMk52YlhCdmJtVnVkRTFoYm1GblpYSW5YRzVwYlhCdmNuUWdleUJtYVc1a1ZHRnlaMlYwUW5sQmRIUnlJSDBnWm5KdmJTQW5MaTR2TGk0dlkyOXRiVzl1TDNWMGFXeHpKMXh1WEc1amIyNXpkQ0JQWm1aRFlXNTJZWE1nUFNBb0tDa2dQVDRnZTF4dUlDQXZLaXBjYmlBZ0lDb2dMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRYRzRnSUNBcUlFTnZibk4wWVc1MGMxeHVJQ0FnS2lBdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMxY2JpQWdJQ292WEc1Y2JpQWdZMjl1YzNRZ1RrRk5SU0E5SUNkdlptWXRZMkZ1ZG1GekoxeHVJQ0JqYjI1emRDQldSVkpUU1U5T0lEMGdKekl1TUM0d0oxeHVJQ0JqYjI1emRDQkNRVU5MUkZKUFVGOVRSVXhGUTFSUFVpQTlJQ2R2Wm1ZdFkyRnVkbUZ6TFdKaFkydGtjbTl3SjF4dUlDQmpiMjV6ZENCRVJVWkJWVXhVWDFCU1QxQkZVbFJKUlZNZ1BTQjdYRzRnSUNBZ1pXeGxiV1Z1ZERvZ2JuVnNiQ3hjYmlBZ0lDQmhjMmxrWlRvZ2UxeHVJQ0FnSUNBZ2JXUTZJR1poYkhObExGeHVJQ0FnSUNBZ2JHYzZJR1poYkhObExGeHVJQ0FnSUNBZ2VHdzZJR1poYkhObExGeHVJQ0FnSUgwc1hHNGdJSDFjYmlBZ1kyOXVjM1FnUkVGVVFWOUJWRlJTVTE5UVVrOVFSVkpVU1VWVElEMGdXMXh1SUNBZ0lDZGhjMmxrWlNjc1hHNGdJRjFjYmx4dUlDQXZLaXBjYmlBZ0lDb2dMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRYRzRnSUNBcUlFTnNZWE56SUVSbFptbHVhWFJwYjI1Y2JpQWdJQ29nTFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0WEc0Z0lDQXFMMXh1WEc0Z0lHTnNZWE56SUU5bVprTmhiblpoY3lCbGVIUmxibVJ6SUVOdmJYQnZibVZ1ZENCN1hHNWNiaUFnSUNCamIyNXpkSEoxWTNSdmNpaHZjSFJwYjI1eklEMGdlMzBwSUh0Y2JpQWdJQ0FnSUhOMWNHVnlLRTVCVFVVc0lGWkZVbE5KVDA0c0lFUkZSa0ZWVEZSZlVGSlBVRVZTVkVsRlV5d2diM0IwYVc5dWN5d2dSRUZVUVY5QlZGUlNVMTlRVWs5UVJWSlVTVVZUTENCbVlXeHpaU3dnZEhKMVpTbGNibHh1SUNBZ0lDQWdkR2hwY3k1MWMyVkNZV05yWkhKdmNDQTlJSFJ5ZFdWY2JpQWdJQ0FnSUhSb2FYTXVZM1Z5Y21WdWRGZHBaSFJvSUQwZ2JuVnNiRnh1SUNBZ0lDQWdkR2hwY3k1aGJtbHRZWFJsSUQwZ2RISjFaVnh1WEc0Z0lDQWdJQ0IwYUdsekxtUnBjbVZqZEdsdmJuTWdQU0JiSjJ4bFpuUW5MQ0FuY21sbmFIUW5YVnh1WEc0Z0lDQWdJQ0JqYjI1emRDQnpiU0E5SUhzZ2JtRnRaVG9nSjNOdEp5d2diV1ZrYVdFNklIZHBibVJ2ZHk1dFlYUmphRTFsWkdsaEtDY29iV2x1TFhkcFpIUm9PaUF4Y0hncEp5a2dmVnh1SUNBZ0lDQWdZMjl1YzNRZ2JXUWdQU0I3SUc1aGJXVTZJQ2R0WkNjc0lHMWxaR2xoT2lCM2FXNWtiM2N1YldGMFkyaE5aV1JwWVNnbktHMXBiaTEzYVdSMGFEb2dOelk0Y0hncEp5a2dmVnh1SUNBZ0lDQWdZMjl1YzNRZ2JHY2dQU0I3SUc1aGJXVTZJQ2RzWnljc0lHMWxaR2xoT2lCM2FXNWtiM2N1YldGMFkyaE5aV1JwWVNnbktHMXBiaTEzYVdSMGFEb2dPVGt5Y0hncEp5a2dmVnh1SUNBZ0lDQWdZMjl1YzNRZ2VHd2dQU0I3SUc1aGJXVTZJQ2Q0YkNjc0lHMWxaR2xoT2lCM2FXNWtiM2N1YldGMFkyaE5aV1JwWVNnbktHMXBiaTEzYVdSMGFEb2dNVEl3TUhCNEtTY3BJSDFjYmx4dUlDQWdJQ0FnZEdocGN5NXphWHBsY3lBOUlGdHpiU3dnYldRc0lHeG5MQ0I0YkYwdWNtVjJaWEp6WlNncFhHNWNiaUFnSUNBZ0lIUm9hWE11WTJobFkydEVhWEpsWTNScGIyNG9LVnh1SUNBZ0lDQWdkR2hwY3k1amFHVmphMWRwWkhSb0tDbGNibHh1SUNBZ0lDQWdkMmx1Wkc5M0xtRmtaRVYyWlc1MFRHbHpkR1Z1WlhJb0ozSmxjMmw2WlNjc0lDZ3BJRDArSUhSb2FYTXVZMmhsWTJ0WGFXUjBhQ2dwTENCbVlXeHpaU2tnSUNBZ0lDQmNiaUFnSUNCOVhHNWNiaUFnSUNCamFHVmphMFJwY21WamRHbHZiaWdwSUh0Y2JpQWdJQ0FnSUhSb2FYTXVaR2x5WldOMGFXOXVjeTVsZG1WeWVTZ29aR2x5WldOMGFXOXVLU0E5UGlCN1hHNGdJQ0FnSUNBZ0lHbG1JQ2gwYUdsekxtOXdkR2x2Ym5NdVpXeGxiV1Z1ZEM1amJHRnpjMHhwYzNRdVkyOXVkR0ZwYm5Nb1lHOW1aaTFqWVc1MllYTXRKSHRrYVhKbFkzUnBiMjU5WUNrcElIdGNiaUFnSUNBZ0lDQWdJQ0IwYUdsekxtUnBjbVZqZEdsdmJpQTlJR1JwY21WamRHbHZibHh1SUNBZ0lDQWdJQ0FnSUhKbGRIVnliaUJtWVd4elpWeHVJQ0FnSUNBZ0lDQjlYRzRnSUNBZ0lDQWdJSEpsZEhWeWJpQjBjblZsWEc0Z0lDQWdJQ0I5S1Z4dUlDQWdJSDFjYmx4dUlDQWdJR05vWldOclYybGtkR2dvS1NCN1hHNGdJQ0FnSUNCcFppQW9JU2duYldGMFkyaE5aV1JwWVNjZ2FXNGdkMmx1Wkc5M0tTa2dlMXh1SUNBZ0lDQWdJQ0J5WlhSMWNtNWNiaUFnSUNBZ0lIMWNibHh1SUNBZ0lDQWdkR2hwY3k1emFYcGxjeTVsZG1WeWVTZ29jMmw2WlNrZ1BUNGdlMXh1SUNBZ0lDQWdJQ0JqYjI1emRDQnRZWFJqYUNBOUlITnBlbVV1YldWa2FXRXViV1ZrYVdFdWJXRjBZMmdvTDF0aExYcGRQeTEzYVdSMGFEcGNYSE0vS0Zzd0xUbGRLeWt2S1Z4dVhHNGdJQ0FnSUNBZ0lHbG1JQ2h0WVhSamFDa2dlMXh1SUNBZ0lDQWdJQ0FnSUdsbUlDaHphWHBsTG0xbFpHbGhMbTFoZEdOb1pYTXBJSHRjYmlBZ0lDQWdJQ0FnSUNBZ0lHbG1JQ2gwYUdsekxtTjFjbkpsYm5SWGFXUjBhQ0FoUFQwZ2MybDZaUzV1WVcxbEtTQjdYRzRnSUNBZ0lDQWdJQ0FnSUNBZ0lIUm9hWE11YzJWMFFYTnBaR1VvYzJsNlpTNXVZVzFsS1Z4dUlDQWdJQ0FnSUNBZ0lDQWdmVnh1SUNBZ0lDQWdJQ0FnSUNBZ2RHaHBjeTVqZFhKeVpXNTBWMmxrZEdnZ1BTQnphWHBsTG01aGJXVmNiaUFnSUNBZ0lDQWdJQ0FnSUhKbGRIVnliaUJtWVd4elpWeHVJQ0FnSUNBZ0lDQWdJSDFjYmlBZ0lDQWdJQ0FnZlZ4dVhHNGdJQ0FnSUNBZ0lISmxkSFZ5YmlCMGNuVmxYRzRnSUNBZ0lDQjlLVnh1SUNBZ0lIMWNibHh1SUNBZ0lIQnlaWFpsYm5SRGJHOXpZV0pzWlNncElIdGNiaUFnSUNBZ0lISmxkSFZ5YmlCemRYQmxjaTV3Y21WMlpXNTBRMnh2YzJGaWJHVW9LU0I4ZkNCMGFHbHpMbTl3ZEdsdmJuTXVZWE5wWkdWYmRHaHBjeTVqZFhKeVpXNTBWMmxrZEdoZElEMDlQU0IwY25WbFhHNGdJQ0FnZlZ4dVhHNGdJQ0FnYzJWMFFYTnBaR1VvYm1GdFpTa2dlMXh1SUNBZ0lDQWdZMjl1YzNRZ1kyOXVkR1Z1ZENBOUlHUnZZM1Z0Wlc1MExtSnZaSGxjYmx4dUlDQWdJQ0FnYVdZZ0tIUm9hWE11YjNCMGFXOXVjeTVoYzJsa1pWdHVZVzFsWFNBOVBUMGdkSEoxWlNrZ2UxeHVJQ0FnSUNBZ0lDQnBaaUFvSVdOdmJuUmxiblF1WTJ4aGMzTk1hWE4wTG1OdmJuUmhhVzV6S0dCdlptWXRZMkZ1ZG1GekxXRnphV1JsTFNSN2RHaHBjeTVrYVhKbFkzUnBiMjU5WUNrcElIdGNiaUFnSUNBZ0lDQWdJQ0JqYjI1MFpXNTBMbU5zWVhOelRHbHpkQzVoWkdRb1lHOW1aaTFqWVc1MllYTXRZWE5wWkdVdEpIdDBhR2x6TG1ScGNtVmpkR2x2Ym4xZ0tWeHVJQ0FnSUNBZ0lDQjlYRzVjYmlBZ0lDQWdJQ0FnZEdocGN5NTFjMlZDWVdOclpISnZjQ0E5SUdaaGJITmxYRzVjYmlBZ0lDQWdJQ0FnTHk4Z1lYWnZhV1FnWVc1cGJXRjBhVzl1SUdKNUlITmxkSFJwYm1jZ1lXNXBiV0YwWlNCMGJ5Qm1ZV3h6WlZ4dUlDQWdJQ0FnSUNCMGFHbHpMbUZ1YVcxaGRHVWdQU0JtWVd4elpWeHVJQ0FnSUNBZ0lDQjBhR2x6TG5Ob2IzY29LVnh1SUNBZ0lDQWdJQ0F2THlCeVpXMXZkbVVnY0hKbGRtbHZkWE1nWW1GamEyUnliM0JjYmlBZ0lDQWdJQ0FnZEdocGN5NXlaVzF2ZG1WQ1lXTnJaSEp2Y0NncFhHNGdJQ0FnSUNCOUlHVnNjMlVnZTF4dUlDQWdJQ0FnSUNCcFppQW9ZMjl1ZEdWdWRDNWpiR0Z6YzB4cGMzUXVZMjl1ZEdGcGJuTW9ZRzltWmkxallXNTJZWE10WVhOcFpHVXRKSHQwYUdsekxtUnBjbVZqZEdsdmJuMWdLU2tnZTF4dUlDQWdJQ0FnSUNBZ0lHTnZiblJsYm5RdVkyeGhjM05NYVhOMExuSmxiVzkyWlNoZ2IyWm1MV05oYm5aaGN5MWhjMmxrWlMwa2UzUm9hWE11WkdseVpXTjBhVzl1ZldBcFhHNGdJQ0FnSUNBZ0lIMWNibHh1SUNBZ0lDQWdJQ0IwYUdsekxtaHBaR1VvS1Z4dUlDQWdJQ0FnSUNCMGFHbHpMblZ6WlVKaFkydGtjbTl3SUQwZ2RISjFaVnh1SUNBZ0lDQWdJQ0IwYUdsekxtRnVhVzFoZEdVZ1BTQjBjblZsWEc0Z0lDQWdJQ0I5WEc0Z0lDQWdmVnh1WEc0Z0lDQWdiMjVGYkdWdFpXNTBSWFpsYm5Rb1pYWmxiblFwSUh0Y2JpQWdJQ0FnSUdsbUlDaGxkbVZ1ZEM1MGVYQmxJRDA5UFNBbmEyVjVkWEFuSUNZbUlHVjJaVzUwTG10bGVVTnZaR1VnSVQwOUlESTNJQ1ltSUdWMlpXNTBMbXRsZVVOdlpHVWdJVDA5SURFektTQjdYRzRnSUNBZ0lDQWdJSEpsZEhWeWJseHVJQ0FnSUNBZ2ZWeHVYRzRnSUNBZ0lDQXZMeUJvYVdSbElIUm9aU0J2Wm1ZdFkyRnVkbUZ6WEc0Z0lDQWdJQ0IwYUdsekxtaHBaR1VvS1Z4dUlDQWdJSDFjYmx4dUlDQWdJSE5vYjNjb0tTQjdYRzRnSUNBZ0lDQnBaaUFvZEdocGN5NXZjSFJwYjI1ekxtVnNaVzFsYm5RdVkyeGhjM05NYVhOMExtTnZiblJoYVc1ektDZHphRzkzSnlrcElIdGNiaUFnSUNBZ0lDQWdjbVYwZFhKdUlHWmhiSE5sWEc0Z0lDQWdJQ0I5WEc1Y2JpQWdJQ0FnSUM4dklHRmtaQ0JoSUhScGJXVnZkWFFnYzI4Z2RHaGhkQ0IwYUdVZ1ExTlRJR0Z1YVcxaGRHbHZiaUIzYjNKcmMxeHVJQ0FnSUNBZ2MyVjBWR2x0Wlc5MWRDZ29LU0E5UGlCN1hHNGdJQ0FnSUNBZ0lIUm9hWE11ZEhKcFoyZGxja1YyWlc1MEtFVjJaVzUwTGxOSVQxY3BYRzVjYmlBZ0lDQWdJQ0FnWTI5dWMzUWdiMjVUYUc5M2JpQTlJQ2dwSUQwK0lIdGNiaUFnSUNBZ0lDQWdJQ0IwYUdsekxuUnlhV2RuWlhKRmRtVnVkQ2hGZG1WdWRDNVRTRTlYVGlsY2JseHVJQ0FnSUNBZ0lDQWdJR2xtSUNoMGFHbHpMbUZ1YVcxaGRHVXBJSHRjYmlBZ0lDQWdJQ0FnSUNBZ0lIUm9hWE11YjNCMGFXOXVjeTVsYkdWdFpXNTBMbkpsYlc5MlpVVjJaVzUwVEdsemRHVnVaWElvUlhabGJuUXVWRkpCVGxOSlZFbFBUbDlGVGtRc0lHOXVVMmh2ZDI0cFhHNGdJQ0FnSUNBZ0lDQWdJQ0IwYUdsekxtOXdkR2x2Ym5NdVpXeGxiV1Z1ZEM1amJHRnpjMHhwYzNRdWNtVnRiM1psS0NkaGJtbHRZWFJsSnlsY2JpQWdJQ0FnSUNBZ0lDQjlYRzRnSUNBZ0lDQWdJSDFjYmx4dUlDQWdJQ0FnSUNCcFppQW9kR2hwY3k1MWMyVkNZV05yWkhKdmNDa2dlMXh1SUNBZ0lDQWdJQ0FnSUhSb2FYTXVZM0psWVhSbFFtRmphMlJ5YjNBb0tWeHVJQ0FnSUNBZ0lDQjlYRzVjYmx4dUlDQWdJQ0FnSUNCcFppQW9kR2hwY3k1aGJtbHRZWFJsS1NCN1hHNGdJQ0FnSUNBZ0lDQWdkR2hwY3k1dmNIUnBiMjV6TG1Wc1pXMWxiblF1WVdSa1JYWmxiblJNYVhOMFpXNWxjaWhGZG1WdWRDNVVVa0ZPVTBsVVNVOU9YMFZPUkN3Z2IyNVRhRzkzYmlrZ0lDQWdJQ0FnSUZ4dUlDQWdJQ0FnSUNBZ0lIUm9hWE11YjNCMGFXOXVjeTVsYkdWdFpXNTBMbU5zWVhOelRHbHpkQzVoWkdRb0oyRnVhVzFoZEdVbktWeHVJQ0FnSUNBZ0lDQjlJR1ZzYzJVZ2UxeHVJQ0FnSUNBZ0lDQWdJQzh2SUdScGNtVmpkR3g1SUhSeWFXZG5aWElnZEdobElHOXVVMmh2ZDI1Y2JpQWdJQ0FnSUNBZ0lDQnZibE5vYjNkdUtDbGNiaUFnSUNBZ0lDQWdmVnh1WEc0Z0lDQWdJQ0FnSUhSb2FYTXViM0IwYVc5dWN5NWxiR1Z0Wlc1MExtTnNZWE56VEdsemRDNWhaR1FvSjNOb2IzY25LU0FnSUNBZ0lDQWdYRzVjYmlBZ0lDQWdJQ0FnTHk4Z1lYUjBZV05vSUdWMlpXNTBYRzRnSUNBZ0lDQWdJSFJvYVhNdVlYUjBZV05vUlhabGJuUnpLQ2xjYmlBZ0lDQWdJSDBzSURFcFhHNWNiaUFnSUNBZ0lISmxkSFZ5YmlCMGNuVmxYRzRnSUNBZ2ZWeHVYRzRnSUNBZ2FHbGtaU2dwSUh0Y2JpQWdJQ0FnSUdsbUlDZ2hkR2hwY3k1dmNIUnBiMjV6TG1Wc1pXMWxiblF1WTJ4aGMzTk1hWE4wTG1OdmJuUmhhVzV6S0NkemFHOTNKeWtwSUh0Y2JpQWdJQ0FnSUNBZ2NtVjBkWEp1SUdaaGJITmxYRzRnSUNBZ0lDQjlYRzVjYmlBZ0lDQWdJSFJvYVhNdWRISnBaMmRsY2tWMlpXNTBLRVYyWlc1MExraEpSRVVwWEc1Y2JpQWdJQ0FnSUhSb2FYTXVaR1YwWVdOb1JYWmxiblJ6S0NsY2JseHVJQ0FnSUNBZ2FXWWdLSFJvYVhNdVlXNXBiV0YwWlNrZ2UxeHVJQ0FnSUNBZ0lDQjBhR2x6TG05d2RHbHZibk11Wld4bGJXVnVkQzVqYkdGemMweHBjM1F1WVdSa0tDZGhibWx0WVhSbEp5bGNiaUFnSUNBZ0lIMWNibHh1SUNBZ0lDQWdkR2hwY3k1dmNIUnBiMjV6TG1Wc1pXMWxiblF1WTJ4aGMzTk1hWE4wTG5KbGJXOTJaU2duYzJodmR5Y3BYRzVjYmlBZ0lDQWdJR2xtSUNoMGFHbHpMblZ6WlVKaFkydGtjbTl3S1NCN1hHNGdJQ0FnSUNBZ0lHTnZibk4wSUdKaFkydGtjbTl3SUQwZ2RHaHBjeTVuWlhSQ1lXTnJaSEp2Y0NncFhHNWNiaUFnSUNBZ0lDQWdZMjl1YzNRZ2IyNUlhV1JrWlc0Z1BTQW9LU0E5UGlCN1hHNGdJQ0FnSUNBZ0lDQWdhV1lnS0hSb2FYTXVZVzVwYldGMFpTa2dlMXh1SUNBZ0lDQWdJQ0FnSUNBZ2RHaHBjeTV2Y0hScGIyNXpMbVZzWlcxbGJuUXVZMnhoYzNOTWFYTjBMbkpsYlc5MlpTZ25ZVzVwYldGMFpTY3BYRzRnSUNBZ0lDQWdJQ0FnZlZ4dVhHNGdJQ0FnSUNBZ0lDQWdZbUZqYTJSeWIzQXVjbVZ0YjNabFJYWmxiblJNYVhOMFpXNWxjaWhGZG1WdWRDNVVVa0ZPVTBsVVNVOU9YMFZPUkN3Z2IyNUlhV1JrWlc0cFhHNGdJQ0FnSUNBZ0lDQWdkR2hwY3k1MGNtbG5aMlZ5UlhabGJuUW9SWFpsYm5RdVNFbEVSRVZPS1NBZ0lDQWdJQ0FnWEc0Z0lDQWdJQ0FnSUNBZ2RHaHBjeTV5WlcxdmRtVkNZV05yWkhKdmNDZ3BYRzRnSUNBZ0lDQWdJSDFjYmx4dUlDQWdJQ0FnSUNCaVlXTnJaSEp2Y0M1aFpHUkZkbVZ1ZEV4cGMzUmxibVZ5S0VWMlpXNTBMbFJTUVU1VFNWUkpUMDVmUlU1RUxDQnZia2hwWkdSbGJpbGNiaUFnSUNBZ0lDQWdZbUZqYTJSeWIzQXVZMnhoYzNOTWFYTjBMbUZrWkNnblptRmtaVzkxZENjcFhHNGdJQ0FnSUNCOVhHNWNiaUFnSUNBZ0lISmxkSFZ5YmlCMGNuVmxYRzRnSUNBZ2ZWeHVYRzRnSUNBZ1kzSmxZWFJsUW1GamEyUnliM0FvS1NCN1hHNGdJQ0FnSUNCamIyNXpkQ0JpWVdOclpISnZjQ0E5SUdSdlkzVnRaVzUwTG1OeVpXRjBaVVZzWlcxbGJuUW9KMlJwZGljcFhHNGdJQ0FnSUNCaVlXTnJaSEp2Y0M1elpYUkJkSFJ5YVdKMWRHVW9KMlJoZEdFdGFXUW5MQ0IwYUdsekxtbGtLVnh1SUNBZ0lDQWdZbUZqYTJSeWIzQXVZMnhoYzNOTWFYTjBMbUZrWkNoQ1FVTkxSRkpQVUY5VFJVeEZRMVJQVWlsY2JseHVJQ0FnSUNBZ1pHOWpkVzFsYm5RdVltOWtlUzVoY0hCbGJtUkRhR2xzWkNoaVlXTnJaSEp2Y0NsY2JpQWdJQ0I5WEc1Y2JpQWdJQ0JuWlhSQ1lXTnJaSEp2Y0NncElIdGNiaUFnSUNBZ0lISmxkSFZ5YmlCa2IyTjFiV1Z1ZEM1eGRXVnllVk5sYkdWamRHOXlLR0F1Skh0Q1FVTkxSRkpQVUY5VFJVeEZRMVJQVW4xYlpHRjBZUzFwWkQxY0lpUjdkR2hwY3k1cFpIMWNJbDFnS1Z4dUlDQWdJSDFjYmx4dUlDQWdJSEpsYlc5MlpVSmhZMnRrY205d0tDa2dlMXh1SUNBZ0lDQWdZMjl1YzNRZ1ltRmphMlJ5YjNBZ1BTQjBhR2x6TG1kbGRFSmhZMnRrY205d0tDbGNiaUFnSUNBZ0lHbG1JQ2hpWVdOclpISnZjQ2tnZTF4dUlDQWdJQ0FnSUNCa2IyTjFiV1Z1ZEM1aWIyUjVMbkpsYlc5MlpVTm9hV3hrS0dKaFkydGtjbTl3S1Z4dUlDQWdJQ0FnZlZ4dUlDQWdJSDFjYmx4dUlDQWdJR0YwZEdGamFFVjJaVzUwY3lncElIdGNiaUFnSUNBZ0lHTnZibk4wSUdScGMyMXBjM05DZFhSMGIyNXpJRDBnZEdocGN5NXZjSFJwYjI1ekxtVnNaVzFsYm5RdWNYVmxjbmxUWld4bFkzUnZja0ZzYkNnblcyUmhkR0V0WkdsemJXbHpjMTBuS1Z4dVhHNGdJQ0FnSUNCcFppQW9aR2x6YldsemMwSjFkSFJ2Ym5NcElIdGNiaUFnSUNBZ0lDQWdRWEp5WVhrdVpuSnZiU2hrYVhOdGFYTnpRblYwZEc5dWN5a3VabTl5UldGamFDaGlkWFIwYjI0Z1BUNGdkR2hwY3k1eVpXZHBjM1JsY2tWc1pXMWxiblFvZXlCMFlYSm5aWFE2SUdKMWRIUnZiaXdnWlhabGJuUTZJQ2RqYkdsamF5Y2dmU2twWEc0Z0lDQWdJQ0I5WEc1Y2JpQWdJQ0FnSUdsbUlDaDBhR2x6TG5WelpVSmhZMnRrY205d0tTQjdYRzRnSUNBZ0lDQWdJR052Ym5OMElHSmhZMnRrY205d0lEMGdkR2hwY3k1blpYUkNZV05yWkhKdmNDZ3BJQ0FnSUNBZ1hHNGdJQ0FnSUNBZ0lIUm9hWE11Y21WbmFYTjBaWEpGYkdWdFpXNTBLSHNnZEdGeVoyVjBPaUJpWVdOclpISnZjQ3dnWlhabGJuUTZJRVYyWlc1MExsTlVRVkpVSUgwcFhHNGdJQ0FnSUNCOVhHNWNiaUFnSUNBZ0lIUm9hWE11Y21WbmFYTjBaWEpGYkdWdFpXNTBLSHNnZEdGeVoyVjBPaUJrYjJOMWJXVnVkQ3dnWlhabGJuUTZJQ2RyWlhsMWNDY2dmU2xjYmlBZ0lDQjlYRzVjYmlBZ0lDQmtaWFJoWTJoRmRtVnVkSE1vS1NCN1hHNGdJQ0FnSUNCamIyNXpkQ0JrYVhOdGFYTnpRblYwZEc5dWN5QTlJSFJvYVhNdWIzQjBhVzl1Y3k1bGJHVnRaVzUwTG5GMVpYSjVVMlZzWldOMGIzSkJiR3dvSjF0a1lYUmhMV1JwYzIxcGMzTmRKeWxjYmx4dUlDQWdJQ0FnYVdZZ0tHUnBjMjFwYzNOQ2RYUjBiMjV6S1NCN1hHNGdJQ0FnSUNBZ0lFRnljbUY1TG1aeWIyMG9aR2x6YldsemMwSjFkSFJ2Ym5NcExtWnZja1ZoWTJnb1luVjBkRzl1SUQwK0lIUm9hWE11ZFc1eVpXZHBjM1JsY2tWc1pXMWxiblFvZXlCMFlYSm5aWFE2SUdKMWRIUnZiaXdnWlhabGJuUTZJQ2RqYkdsamF5Y2dmU2twWEc0Z0lDQWdJQ0I5WEc1Y2JpQWdJQ0FnSUdsbUlDaDBhR2x6TG5WelpVSmhZMnRrY205d0tTQjdYRzRnSUNBZ0lDQWdJR052Ym5OMElHSmhZMnRrY205d0lEMGdkR2hwY3k1blpYUkNZV05yWkhKdmNDZ3BYRzRnSUNBZ0lDQWdJSFJvYVhNdWRXNXlaV2RwYzNSbGNrVnNaVzFsYm5Rb2V5QjBZWEpuWlhRNklHSmhZMnRrY205d0xDQmxkbVZ1ZERvZ1JYWmxiblF1VTFSQlVsUWdmU2xjYmlBZ0lDQWdJSDFjYmx4dUlDQWdJQ0FnZEdocGN5NTFibkpsWjJsemRHVnlSV3hsYldWdWRDaDdJSFJoY21kbGREb2daRzlqZFcxbGJuUXNJR1YyWlc1ME9pQW5hMlY1ZFhBbklIMHBYRzRnSUNBZ2ZWeHVYRzRnSUNBZ2MzUmhkR2xqSUdsa1pXNTBhV1pwWlhJb0tTQjdYRzRnSUNBZ0lDQnlaWFIxY200Z1RrRk5SVnh1SUNBZ0lIMWNibHh1SUNBZ0lITjBZWFJwWXlCZlJFOU5TVzUwWlhKbVlXTmxLRzl3ZEdsdmJuTXBJSHRjYmlBZ0lDQWdJSEpsZEhWeWJpQnpkWEJsY2k1ZlJFOU5TVzUwWlhKbVlXTmxLRTltWmtOaGJuWmhjeXdnYjNCMGFXOXVjeWxjYmlBZ0lDQjlYRzRnSUgxY2JseHVJQ0F2S2lwY2JpQWdJQ29nTFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0WEc0Z0lDQXFJRVJQVFNCQmNHa2dhVzF3YkdWdFpXNTBZWFJwYjI1Y2JpQWdJQ29nTFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0WEc0Z0lDQXFMMXh1SUNCamIyNXpkQ0JqYjIxd2IyNWxiblJ6SUQwZ1cxMWNibHh1SUNCamIyNXpkQ0J2Wm1aRFlXNTJZWE1nUFNCa2IyTjFiV1Z1ZEM1eGRXVnllVk5sYkdWamRHOXlRV3hzS0dBdUpIdE9RVTFGZldBcFhHNGdJR2xtSUNodlptWkRZVzUyWVhNcElIdGNiaUFnSUNCQmNuSmhlUzVtY205dEtHOW1aa05oYm5aaGN5a3VabTl5UldGamFDZ29aV3hsYldWdWRDa2dQVDRnZTF4dUlDQWdJQ0FnWTI5dWMzUWdZMjl1Wm1sbklEMGdaMlYwUVhSMGNtbGlkWFJsYzBOdmJtWnBaeWhsYkdWdFpXNTBMQ0JFUlVaQlZVeFVYMUJTVDFCRlVsUkpSVk1zSUVSQlZFRmZRVlJVVWxOZlVGSlBVRVZTVkVsRlV5bGNiaUFnSUNBZ0lHTnZibVpwWnk1bGJHVnRaVzUwSUQwZ1pXeGxiV1Z1ZEZ4dVhHNGdJQ0FnSUNCamIyMXdiMjVsYm5SekxuQjFjMmdvZXlCbGJHVnRaVzUwTENCdlptWkRZVzUyWVhNNklHNWxkeUJQWm1aRFlXNTJZWE1vWTI5dVptbG5LU0I5S1Z4dUlDQWdJSDBwWEc0Z0lIMWNibHh1SUNCcFppQW9iMlptUTJGdWRtRnpLU0I3WEc0Z0lDQWdaRzlqZFcxbGJuUXVZV1JrUlhabGJuUk1hWE4wWlc1bGNpZ25ZMnhwWTJzbkxDQW9aWFpsYm5RcElEMCtJSHRjYmlBZ0lDQWdJR052Ym5OMElIUmhjbWRsZENBOUlHWnBibVJVWVhKblpYUkNlVUYwZEhJb1pYWmxiblF1ZEdGeVoyVjBMQ0FuWkdGMFlTMTBiMmRuYkdVbktWeHVJQ0FnSUNBZ2FXWWdLQ0YwWVhKblpYUXBJSHRjYmlBZ0lDQWdJQ0FnY21WMGRYSnVYRzRnSUNBZ0lDQjlYRzVjYmlBZ0lDQWdJR052Ym5OMElHUmhkR0ZVYjJkbmJHVkJkSFJ5SUQwZ2RHRnlaMlYwTG1kbGRFRjBkSEpwWW5WMFpTZ25aR0YwWVMxMGIyZG5iR1VuS1Z4dUlDQWdJQ0FnYVdZZ0tHUmhkR0ZVYjJkbmJHVkJkSFJ5SUNZbUlHUmhkR0ZVYjJkbmJHVkJkSFJ5SUQwOVBTQk9RVTFGS1NCN1hHNGdJQ0FnSUNBZ0lHTnZibk4wSUdsa0lEMGdkR0Z5WjJWMExtZGxkRUYwZEhKcFluVjBaU2duWkdGMFlTMTBZWEpuWlhRbktWeHVJQ0FnSUNBZ0lDQmpiMjV6ZENCbGJHVnRaVzUwSUQwZ1pHOWpkVzFsYm5RdWNYVmxjbmxUWld4bFkzUnZjaWhwWkNsY2JseHVJQ0FnSUNBZ0lDQmpiMjV6ZENCamIyMXdiMjVsYm5RZ1BTQmpiMjF3YjI1bGJuUnpMbVpwYm1Rb1l5QTlQaUJqTG1Wc1pXMWxiblFnUFQwOUlHVnNaVzFsYm5RcFhHNWNiaUFnSUNBZ0lDQWdhV1lnS0NGamIyMXdiMjVsYm5RcElIdGNiaUFnSUNBZ0lDQWdJQ0J5WlhSMWNtNWNiaUFnSUNBZ0lDQWdmVnh1WEc0Z0lDQWdJQ0FnSUhSaGNtZGxkQzVpYkhWeUtDbGNibHh1SUNBZ0lDQWdJQ0JqYjIxd2IyNWxiblF1YjJabVEyRnVkbUZ6TG5Ob2IzY29LVnh1SUNBZ0lDQWdmVnh1SUNBZ0lIMHBYRzRnSUgxY2JseHVJQ0J5WlhSMWNtNGdUMlptUTJGdWRtRnpYRzU5S1NncFhHNWNibVY0Y0c5eWRDQmtaV1poZFd4MElFOW1aa05oYm5aaGMxeHVJaXdpTHlvcVhHNGdLaUF0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFZ4dUlDb2dUR2xqWlc1elpXUWdkVzVrWlhJZ1RVbFVJQ2hvZEhSd2N6b3ZMMmRwZEdoMVlpNWpiMjB2Y1hWaGNtc3RaR1YyTDFCb2IyNXZiaTFHY21GdFpYZHZjbXN2WW14dllpOXRZWE4wWlhJdlRFbERSVTVUUlNsY2JpQXFJQzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0WEc0Z0tpOWNibWx0Y0c5eWRDQkRiMjF3YjI1bGJuUWdabkp2YlNBbkxpNHZZMjl0Y0c5dVpXNTBKMXh1YVcxd2IzSjBJRVYyWlc1MElHWnliMjBnSnk0dUx5NHVMMk52YlcxdmJpOWxkbVZ1ZEhNblhHNWNibU52Ym5OMElGQnliMmR5WlhOeklEMGdLQ2dwSUQwK0lIdGNiaUFnTHlvcVhHNGdJQ0FxSUMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFZ4dUlDQWdLaUJEYjI1emRHRnVkSE5jYmlBZ0lDb2dMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRYRzRnSUNBcUwxeHVYRzRnSUdOdmJuTjBJRTVCVFVVZ1BTQW5jSEp2WjNKbGMzTW5YRzRnSUdOdmJuTjBJRlpGVWxOSlQwNGdQU0FuTWk0d0xqQW5YRzRnSUdOdmJuTjBJRVJGUmtGVlRGUmZVRkpQVUVWU1ZFbEZVeUE5SUh0Y2JpQWdJQ0JsYkdWdFpXNTBPaUJ1ZFd4c0xGeHVJQ0FnSUdobGFXZG9kRG9nTlN4Y2JpQWdJQ0J0YVc0NklEQXNYRzRnSUNBZ2JXRjRPaUF4TURBc1hHNGdJQ0FnYkdGaVpXdzZJR1poYkhObExGeHVJQ0FnSUhOMGNtbHdaV1E2SUdaaGJITmxMRnh1SUNBZ0lHSmhZMnRuY205MWJtUTZJRzUxYkd3c1hHNGdJSDFjYmlBZ1kyOXVjM1FnUkVGVVFWOUJWRlJTVTE5UVVrOVFSVkpVU1VWVElEMGdXMXh1SUNBZ0lDZG9aV2xuYUhRbkxGeHVJQ0FnSUNkdGFXNG5MRnh1SUNBZ0lDZHRZWGduTEZ4dUlDQWdJQ2RzWVdKbGJDY3NYRzRnSUNBZ0ozTjBjbWx3WldRbkxGeHVJQ0FnSUNkaVlXTnJaM0p2ZFc1a0p5eGNiaUFnWFZ4dVhHNGdJQzhxS2x4dUlDQWdLaUF0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzFjYmlBZ0lDb2dRMnhoYzNNZ1JHVm1hVzVwZEdsdmJseHVJQ0FnS2lBdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMxY2JpQWdJQ292WEc1Y2JpQWdZMnhoYzNNZ1VISnZaM0psYzNNZ1pYaDBaVzVrY3lCRGIyMXdiMjVsYm5RZ2UxeHVYRzRnSUNBZ1kyOXVjM1J5ZFdOMGIzSW9iM0IwYVc5dWN5QTlJSHQ5S1NCN1hHNGdJQ0FnSUNCemRYQmxjaWhPUVUxRkxDQldSVkpUU1U5T0xDQkVSVVpCVlV4VVgxQlNUMUJGVWxSSlJWTXNJRzl3ZEdsdmJuTXNJRVJCVkVGZlFWUlVVbE5mVUZKUFVFVlNWRWxGVXl3Z1ptRnNjMlVzSUdaaGJITmxLVnh1WEc0Z0lDQWdJQ0F2THlCelpYUWdkR2hsSUhkaGJuUmxaQ0JvWldsbmFIUmNiaUFnSUNBZ0lIUm9hWE11YjNCMGFXOXVjeTVsYkdWdFpXNTBMbk4wZVd4bExtaGxhV2RvZENBOUlHQWtlM1JvYVhNdWIzQjBhVzl1Y3k1b1pXbG5hSFI5Y0hoZ1hHNWNiaUFnSUNBZ0lDOHZJSE5sZENCdGFXNGdZVzVrSUcxaGVDQjJZV3gxWlhOY2JpQWdJQ0FnSUdOdmJuTjBJSEJ5YjJkeVpYTnpRbUZ5SUQwZ2RHaHBjeTVuWlhSUWNtOW5jbVZ6YzBKaGNpZ3BYRzRnSUNBZ0lDQndjbTluY21WemMwSmhjaTV6WlhSQmRIUnlhV0oxZEdVb0oyRnlhV0V0ZG1Gc2RXVnRhVzRuTENCZ0pIdDBhR2x6TG05d2RHbHZibk11YldsdWZXQXBYRzRnSUNBZ0lDQndjbTluY21WemMwSmhjaTV6WlhSQmRIUnlhV0oxZEdVb0oyRnlhV0V0ZG1Gc2RXVnRZWGduTENCZ0pIdDBhR2x6TG05d2RHbHZibk11YldGNGZXQXBYRzVjYmlBZ0lDQWdJQzh2SUhObGRDQnpkSEpwY0dWa1hHNGdJQ0FnSUNCcFppQW9kR2hwY3k1dmNIUnBiMjV6TG5OMGNtbHdaV1JjYmlBZ0lDQWdJQ0FnSmlZZ0lYQnliMmR5WlhOelFtRnlMbU5zWVhOelRHbHpkQzVqYjI1MFlXbHVjeWduY0hKdlozSmxjM010WW1GeUxYTjBjbWx3WldRbktTa2dlMXh1SUNBZ0lDQWdJQ0J3Y205bmNtVnpjMEpoY2k1amJHRnpjMHhwYzNRdVlXUmtLQ2R3Y205bmNtVnpjeTFpWVhJdGMzUnlhWEJsWkNjcFhHNGdJQ0FnSUNCOVhHNWNiaUFnSUNBZ0lDOHZJSE5sZENCaVlXTnJaM0p2ZFc1a1hHNGdJQ0FnSUNCcFppQW9kSGx3Wlc5bUlIUm9hWE11YjNCMGFXOXVjeTVpWVdOclozSnZkVzVrSUQwOVBTQW5jM1J5YVc1bkoxeHVJQ0FnSUNBZ0lDQW1KaUFoY0hKdlozSmxjM05DWVhJdVkyeGhjM05NYVhOMExtTnZiblJoYVc1ektHQmlaeTBrZTNSb2FYTXViM0IwYVc5dWN5NWlZV05yWjNKdmRXNWtmV0FwS1NCN1hHNGdJQ0FnSUNBZ0lIQnliMmR5WlhOelFtRnlMbU5zWVhOelRHbHpkQzVoWkdRb1lHSm5MU1I3ZEdocGN5NXZjSFJwYjI1ekxtSmhZMnRuY205MWJtUjlZQ2xjYmlBZ0lDQWdJSDFjYmlBZ0lDQjlYRzVjYmlBZ0lDQm5aWFJRY205bmNtVnpjMEpoY2lncElIdGNiaUFnSUNBZ0lISmxkSFZ5YmlCMGFHbHpMbTl3ZEdsdmJuTXVaV3hsYldWdWRDNXhkV1Z5ZVZObGJHVmpkRzl5S0NjdWNISnZaM0psYzNNdFltRnlKeWxjYmlBZ0lDQjlYRzVjYmlBZ0lDQnpaWFFvZG1Gc2RXVWdQU0F3S1NCN1hHNGdJQ0FnSUNCamIyNXpkQ0J3Y205bmNtVnpjMEpoY2lBOUlIUm9hWE11WjJWMFVISnZaM0psYzNOQ1lYSW9LVnh1SUNBZ0lDQWdZMjl1YzNRZ2NISnZaM0psYzNNZ1BTQk5ZWFJvTG5KdmRXNWtLQ2gyWVd4MVpTQXZJQ2gwYUdsekxtOXdkR2x2Ym5NdWJXbHVJQ3NnZEdocGN5NXZjSFJwYjI1ekxtMWhlQ2twSUNvZ01UQXdLVnh1WEc0Z0lDQWdJQ0JwWmlBb2RtRnNkV1VnUENCMGFHbHpMbTl3ZEdsdmJuTXViV2x1S1NCN1hHNGdJQ0FnSUNBZ0lHTnZibk52YkdVdVpYSnliM0lvWUNSN1RrRk5SWDB1SUZkaGNtNXBibWNzSUNSN2RtRnNkV1Y5SUdseklIVnVaR1Z5SUcxcGJpQjJZV3gxWlM1Z0tWeHVJQ0FnSUNBZ0lDQnlaWFIxY200Z1ptRnNjMlZjYmlBZ0lDQWdJSDFjYmx4dUlDQWdJQ0FnYVdZZ0tIWmhiSFZsSUQ0Z2RHaHBjeTV2Y0hScGIyNXpMbTFoZUNrZ2UxeHVJQ0FnSUNBZ0lDQmpiMjV6YjJ4bExtVnljbTl5S0dBa2UwNUJUVVY5TGlCWFlYSnVhVzVuTENBa2UzWmhiSFZsZlNCcGN5QmhZbTkyWlNCdFlYZ2dkbUZzZFdVdVlDa2dJQ0FnSUNBZ0lDQWdYRzRnSUNBZ0lDQWdJSEpsZEhWeWJpQm1ZV3h6WlZ4dUlDQWdJQ0FnZlZ4dVhHNGdJQ0FnSUNCd2NtOW5jbVZ6YzBKaGNpNXpaWFJCZEhSeWFXSjFkR1VvSjJGeWFXRXRkbUZzZFdWdWIzY25MQ0JnSkh0MllXeDFaWDFnS1NBZ0lDQWdJRnh1WEc0Z0lDQWdJQ0F2THlCelpYUWdiR0ZpWld4Y2JpQWdJQ0FnSUdsbUlDaDBhR2x6TG05d2RHbHZibk11YkdGaVpXd3BJSHRjYmlBZ0lDQWdJQ0FnY0hKdlozSmxjM05DWVhJdWFXNXVaWEpJVkUxTUlEMGdZQ1I3Y0hKdlozSmxjM045SldCY2JpQWdJQ0FnSUgxY2JseHVJQ0FnSUNBZ0x5OGdjMlYwSUhCbGNtTmxiblJoWjJWY2JpQWdJQ0FnSUhCeWIyZHlaWE56UW1GeUxuTjBlV3hsTG5kcFpIUm9JRDBnWUNSN2NISnZaM0psYzNOOUpXQmNibHh1SUNBZ0lDQWdjbVYwZFhKdUlIUnlkV1ZjYmlBZ0lDQjlYRzVjYmlBZ0lDQmhibWx0WVhSbEtITjBZWEowUVc1cGJXRjBhVzl1SUQwZ2RISjFaU2tnZTF4dUlDQWdJQ0FnYVdZZ0tDRjBhR2x6TG05d2RHbHZibk11YzNSeWFYQmxaQ2tnZTF4dUlDQWdJQ0FnSUNCamIyNXpiMnhsTG1WeWNtOXlLR0FrZTA1QlRVVjlMaUJCYm1sdFlYUnBiMjRnZDI5eWEzTWdiMjVzZVNCM2FYUm9JSE4wY21sd1pXUWdjSEp2WjNKbGMzTXVZQ2xjYmlBZ0lDQWdJQ0FnY21WMGRYSnVJR1poYkhObFhHNGdJQ0FnSUNCOVhHNWNiaUFnSUNBZ0lHTnZibk4wSUhCeWIyZHlaWE56UW1GeUlEMGdkR2hwY3k1blpYUlFjbTluY21WemMwSmhjaWdwWEc1Y2JpQWdJQ0FnSUdsbUlDaHpkR0Z5ZEVGdWFXMWhkR2x2Ymx4dUlDQWdJQ0FnSUNBbUppQWhjSEp2WjNKbGMzTkNZWEl1WTJ4aGMzTk1hWE4wTG1OdmJuUmhhVzV6S0Nkd2NtOW5jbVZ6Y3kxaVlYSXRZVzVwYldGMFpXUW5LU2tnZTF4dUlDQWdJQ0FnSUNCd2NtOW5jbVZ6YzBKaGNpNWpiR0Z6YzB4cGMzUXVZV1JrS0Nkd2NtOW5jbVZ6Y3kxaVlYSXRZVzVwYldGMFpXUW5LVnh1SUNBZ0lDQWdmVnh1WEc0Z0lDQWdJQ0JwWmlBb0lYTjBZWEowUVc1cGJXRjBhVzl1WEc0Z0lDQWdJQ0FnSUNZbUlIQnliMmR5WlhOelFtRnlMbU5zWVhOelRHbHpkQzVqYjI1MFlXbHVjeWduY0hKdlozSmxjM010WW1GeUxXRnVhVzFoZEdWa0p5a3BJSHRjYmlBZ0lDQWdJQ0FnY0hKdlozSmxjM05DWVhJdVkyeGhjM05NYVhOMExuSmxiVzkyWlNnbmNISnZaM0psYzNNdFltRnlMV0Z1YVcxaGRHVmtKeWxjYmlBZ0lDQWdJSDFjYmx4dUlDQWdJQ0FnY21WMGRYSnVJSFJ5ZFdWY2JpQWdJQ0I5WEc1Y2JpQWdJQ0J6YUc5M0tDa2dlMXh1SUNBZ0lDQWdkR2hwY3k1dmNIUnBiMjV6TG1Wc1pXMWxiblF1YzNSNWJHVXVhR1ZwWjJoMElEMGdZQ1I3ZEdocGN5NXZjSFJwYjI1ekxtaGxhV2RvZEgxd2VHQmNiaUFnSUNBZ0lIUm9hWE11ZEhKcFoyZGxja1YyWlc1MEtFVjJaVzUwTGxOSVQxY3BYRzRnSUNBZ0lDQjBhR2x6TG5SeWFXZG5aWEpGZG1WdWRDaEZkbVZ1ZEM1VFNFOVhUaWxjYmx4dUlDQWdJQ0FnY21WMGRYSnVJSFJ5ZFdWY2JpQWdJQ0I5WEc1Y2JpQWdJQ0JvYVdSbEtDa2dlMXh1SUNBZ0lDQWdkR2hwY3k1dmNIUnBiMjV6TG1Wc1pXMWxiblF1YzNSNWJHVXVhR1ZwWjJoMElEMGdKekJ3ZUNkY2JpQWdJQ0FnSUhSb2FYTXVkSEpwWjJkbGNrVjJaVzUwS0VWMlpXNTBMa2hKUkVVcFhHNGdJQ0FnSUNCMGFHbHpMblJ5YVdkblpYSkZkbVZ1ZENoRmRtVnVkQzVJU1VSRVJVNHBYRzVjYmlBZ0lDQWdJSEpsZEhWeWJpQjBjblZsWEc0Z0lDQWdmVnh1WEc0Z0lDQWdjM1JoZEdsaklHbGtaVzUwYVdacFpYSW9LU0I3WEc0Z0lDQWdJQ0J5WlhSMWNtNGdUa0ZOUlZ4dUlDQWdJSDFjYmx4dUlDQWdJSE4wWVhScFl5QmZSRTlOU1c1MFpYSm1ZV05sS0c5d2RHbHZibk1wSUh0Y2JpQWdJQ0FnSUhKbGRIVnliaUJ6ZFhCbGNpNWZSRTlOU1c1MFpYSm1ZV05sS0ZCeWIyZHlaWE56TENCdmNIUnBiMjV6S1Z4dUlDQWdJSDFjYmlBZ2ZWeHVYRzRnSUhKbGRIVnliaUJRY205bmNtVnpjMXh1ZlNrb0tWeHVYRzVsZUhCdmNuUWdaR1ZtWVhWc2RDQlFjbTluY21WemMxeHVJaXdpTHlvcVhHNGdLaUF0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFZ4dUlDb2dUR2xqWlc1elpXUWdkVzVrWlhJZ1RVbFVJQ2hvZEhSd2N6b3ZMMmRwZEdoMVlpNWpiMjB2Y1hWaGNtc3RaR1YyTDFCb2IyNXZiaTFHY21GdFpYZHZjbXN2WW14dllpOXRZWE4wWlhJdlRFbERSVTVUUlNsY2JpQXFJQzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0WEc0Z0tpOWNibWx0Y0c5eWRDQkRiMjF3YjI1bGJuUWdabkp2YlNBbkxpNHZZMjl0Y0c5dVpXNTBKMXh1YVcxd2IzSjBJSHNnWjJWMFFYUjBjbWxpZFhSbGMwTnZibVpwWnlCOUlHWnliMjBnSnk0dUwyTnZiWEJ2Ym1WdWRFMWhibUZuWlhJblhHNXBiWEJ2Y25RZ1JYWmxiblFnWm5KdmJTQW5MaTR2TGk0dlkyOXRiVzl1TDJWMlpXNTBjeWRjYm1sdGNHOXlkQ0I3SUdacGJtUlVZWEpuWlhSQ2VVTnNZWE56SUgwZ1puSnZiU0FuTGk0dkxpNHZZMjl0Ylc5dUwzVjBhV3h6SjF4dVhHNWpiMjV6ZENCVVlXSWdQU0FvS0NrZ1BUNGdlMXh1SUNBdktpcGNiaUFnSUNvZ0xTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdFhHNGdJQ0FxSUVOdmJuTjBZVzUwYzF4dUlDQWdLaUF0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzFjYmlBZ0lDb3ZYRzVjYmlBZ1kyOXVjM1FnVGtGTlJTQTlJQ2QwWVdJblhHNGdJR052Ym5OMElGWkZVbE5KVDA0Z1BTQW5NaTR3TGpBblhHNGdJR052Ym5OMElFUkZSa0ZWVEZSZlVGSlBVRVZTVkVsRlV5QTlJSHRjYmx4dUlDQjlYRzRnSUdOdmJuTjBJRVJCVkVGZlFWUlVVbE5mVUZKUFVFVlNWRWxGVXlBOUlGdGNiaUFnWFZ4dUlDQmpiMjV6ZENCVVFVSmZRMDlPVkVWT1ZGOVRSVXhGUTFSUFVpQTlJQ2N1ZEdGaUxYQmhibVVuWEc1Y2JpQWdMeW9xWEc0Z0lDQXFJQzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMVnh1SUNBZ0tpQkRiR0Z6Y3lCRVpXWnBibWwwYVc5dVhHNGdJQ0FxSUMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFZ4dUlDQWdLaTljYmx4dUlDQmpiR0Z6Y3lCVVlXSWdaWGgwWlc1a2N5QkRiMjF3YjI1bGJuUWdlMXh1WEc0Z0lDQWdZMjl1YzNSeWRXTjBiM0lvYjNCMGFXOXVjeUE5SUh0OUtTQjdYRzRnSUNBZ0lDQnpkWEJsY2loT1FVMUZMQ0JXUlZKVFNVOU9MQ0JFUlVaQlZVeFVYMUJTVDFCRlVsUkpSVk1zSUc5d2RHbHZibk1zSUVSQlZFRmZRVlJVVWxOZlVGSlBVRVZTVkVsRlV5d2dabUZzYzJVc0lHWmhiSE5sS1Z4dUlDQWdJSDFjYmx4dUlDQWdJSE5vYjNjb0tTQjdYRzRnSUNBZ0lDQnBaaUFvZEdocGN5NXZjSFJwYjI1ekxtVnNaVzFsYm5RdVkyeGhjM05NYVhOMExtTnZiblJoYVc1ektDZGhZM1JwZG1VbktTa2dlMXh1SUNBZ0lDQWdJQ0J5WlhSMWNtNGdabUZzYzJWY2JpQWdJQ0FnSUgxY2JseHVJQ0FnSUNBZ1kyOXVjM1FnYVdRZ1BTQjBhR2x6TG05d2RHbHZibk11Wld4bGJXVnVkQzVuWlhSQmRIUnlhV0oxZEdVb0oyaHlaV1luS1Z4dUlDQWdJQ0FnWTI5dWMzUWdibUYySUQwZ1ptbHVaRlJoY21kbGRFSjVRMnhoYzNNb2RHaHBjeTV2Y0hScGIyNXpMbVZzWlcxbGJuUXNJQ2R1WVhZbktWeHVJQ0FnSUNBZ1kyOXVjM1FnYm1GMlZHRmljeUE5SUc1aGRpQS9JRzVoZGk1eGRXVnllVk5sYkdWamRHOXlRV3hzS0dCYlpHRjBZUzEwYjJkbmJHVTlYQ0lrZTA1QlRVVjlYQ0pkWUNrZ09pQnVkV3hzWEc1Y2JpQWdJQ0FnSUdsbUlDaHVZWFpVWVdKektTQjdYRzRnSUNBZ0lDQWdJRUZ5Y21GNUxtWnliMjBvYm1GMlZHRmljeWt1Wm05eVJXRmphQ2dvZEdGaUtTQTlQaUI3WEc0Z0lDQWdJQ0FnSUNBZ2FXWWdLSFJoWWk1amJHRnpjMHhwYzNRdVkyOXVkR0ZwYm5Nb0oyRmpkR2wyWlNjcEtTQjdYRzRnSUNBZ0lDQWdJQ0FnSUNCMFlXSXVZMnhoYzNOTWFYTjBMbkpsYlc5MlpTZ25ZV04wYVhabEp5bGNiaUFnSUNBZ0lDQWdJQ0I5WEc0Z0lDQWdJQ0FnSUNBZ2RHRmlMbk5sZEVGMGRISnBZblYwWlNnbllYSnBZUzF6Wld4bFkzUmxaQ2NzSUdaaGJITmxLVnh1SUNBZ0lDQWdJQ0I5S1Z4dUlDQWdJQ0FnZlZ4dVhHNGdJQ0FnSUNCMGFHbHpMbTl3ZEdsdmJuTXVaV3hsYldWdWRDNWpiR0Z6YzB4cGMzUXVZV1JrS0NkaFkzUnBkbVVuS1Z4dUlDQWdJQ0FnZEdocGN5NXZjSFJwYjI1ekxtVnNaVzFsYm5RdWMyVjBRWFIwY21saWRYUmxLQ2RoY21saExYTmxiR1ZqZEdWa0p5d2dkSEoxWlNsY2JseHVJQ0FnSUNBZ1kyOXVjM1FnZEdGaVEyOXVkR1Z1ZENBOUlHUnZZM1Z0Wlc1MExuRjFaWEo1VTJWc1pXTjBiM0lvYVdRcFhHNGdJQ0FnSUNCamIyNXpkQ0IwWVdKRGIyNTBaVzUwY3lBOUlIUmhZa052Ym5SbGJuUXVjR0Z5Wlc1MFRtOWtaUzV4ZFdWeWVWTmxiR1ZqZEc5eVFXeHNLRlJCUWw5RFQwNVVSVTVVWDFORlRFVkRWRTlTS1Z4dVhHNGdJQ0FnSUNCcFppQW9kR0ZpUTI5dWRHVnVkSE1wSUh0Y2JpQWdJQ0FnSUNBZ1FYSnlZWGt1Wm5KdmJTaDBZV0pEYjI1MFpXNTBjeWt1Wm05eVJXRmphQ2dvZEdGaUtTQTlQaUI3WEc0Z0lDQWdJQ0FnSUNBZ2FXWWdLSFJoWWk1amJHRnpjMHhwYzNRdVkyOXVkR0ZwYm5Nb0oyRmpkR2wyWlNjcEtTQjdYRzRnSUNBZ0lDQWdJQ0FnSUNCMFlXSXVZMnhoYzNOTWFYTjBMbkpsYlc5MlpTZ25ZV04wYVhabEp5bGNiaUFnSUNBZ0lDQWdJQ0I5WEc0Z0lDQWdJQ0FnSUgwcFhHNGdJQ0FnSUNCOVhHNWNiaUFnSUNBZ0lIUmhZa052Ym5SbGJuUXVZMnhoYzNOTWFYTjBMbUZrWkNnbmMyaHZkMmx1WnljcFhHNWNiaUFnSUNBZ0lITmxkRlJwYldWdmRYUW9LQ2tnUFQ0Z2UxeHVJQ0FnSUNBZ0lDQmpiMjV6ZENCdmJsTm9iM2RsWkNBOUlDZ3BJRDArSUh0Y2JpQWdJQ0FnSUNBZ0lDQjBZV0pEYjI1MFpXNTBMbU5zWVhOelRHbHpkQzV5WlcxdmRtVW9KMkZ1YVcxaGRHVW5LVnh1SUNBZ0lDQWdJQ0FnSUhSaFlrTnZiblJsYm5RdVkyeGhjM05NYVhOMExtRmtaQ2duWVdOMGFYWmxKeWxjYmlBZ0lDQWdJQ0FnSUNCMFlXSkRiMjUwWlc1MExtTnNZWE56VEdsemRDNXlaVzF2ZG1Vb0ozTm9iM2RwYm1jbktWeHVJQ0FnSUNBZ0lDQWdJSFJoWWtOdmJuUmxiblF1Y21WdGIzWmxSWFpsYm5STWFYTjBaVzVsY2loRmRtVnVkQzVVVWtGT1UwbFVTVTlPWDBWT1JDd2diMjVUYUc5M1pXUXBYRzRnSUNBZ0lDQWdJSDFjYmx4dUlDQWdJQ0FnSUNCMFlXSkRiMjUwWlc1MExtRmtaRVYyWlc1MFRHbHpkR1Z1WlhJb1JYWmxiblF1VkZKQlRsTkpWRWxQVGw5RlRrUXNJRzl1VTJodmQyVmtLVnh1WEc0Z0lDQWdJQ0FnSUhSaFlrTnZiblJsYm5RdVkyeGhjM05NYVhOMExtRmtaQ2duWVc1cGJXRjBaU2NwWEc1Y2JpQWdJQ0FnSUgwc0lESXdLVnh1WEc0Z0lDQWdJQ0J5WlhSMWNtNGdkSEoxWlZ4dUlDQWdJSDFjYmx4dUlDQWdJR2hwWkdVb0tTQjdYRzRnSUNBZ0lDQnBaaUFvSVhSb2FYTXViM0IwYVc5dWN5NWxiR1Z0Wlc1MExtTnNZWE56VEdsemRDNWpiMjUwWVdsdWN5Z25ZV04wYVhabEp5a3BJSHRjYmlBZ0lDQWdJQ0FnY21WMGRYSnVJR1poYkhObFhHNGdJQ0FnSUNCOVhHNWNiaUFnSUNBZ0lHbG1JQ2gwYUdsekxtOXdkR2x2Ym5NdVpXeGxiV1Z1ZEM1amJHRnpjMHhwYzNRdVkyOXVkR0ZwYm5Nb0oyRmpkR2wyWlNjcEtTQjdYRzRnSUNBZ0lDQWdJSFJvYVhNdWIzQjBhVzl1Y3k1bGJHVnRaVzUwTG1Oc1lYTnpUR2x6ZEM1eVpXMXZkbVVvSjJGamRHbDJaU2NwWEc0Z0lDQWdJQ0I5WEc1Y2JpQWdJQ0FnSUhSb2FYTXViM0IwYVc5dWN5NWxiR1Z0Wlc1MExuTmxkRUYwZEhKcFluVjBaU2duWVhKcFlTMXpaV3hsWTNSbFpDY3NJR1poYkhObEtWeHVYRzRnSUNBZ0lDQmpiMjV6ZENCcFpDQTlJSFJvYVhNdWIzQjBhVzl1Y3k1bGJHVnRaVzUwTG1kbGRFRjBkSEpwWW5WMFpTZ25hSEpsWmljcFhHNGdJQ0FnSUNCamIyNXpkQ0IwWVdKRGIyNTBaVzUwSUQwZ1pHOWpkVzFsYm5RdWNYVmxjbmxUWld4bFkzUnZjaWhwWkNsY2JseHVJQ0FnSUNBZ2FXWWdLSFJoWWtOdmJuUmxiblF1WTJ4aGMzTk1hWE4wTG1OdmJuUmhhVzV6S0NkaFkzUnBkbVVuS1NrZ2UxeHVJQ0FnSUNBZ0lDQjBZV0pEYjI1MFpXNTBMbU5zWVhOelRHbHpkQzV5WlcxdmRtVW9KMkZqZEdsMlpTY3BYRzRnSUNBZ0lDQjlYRzVjYmlBZ0lDQWdJSEpsZEhWeWJpQjBjblZsWEc0Z0lDQWdmVnh1WEc0Z0lDQWdjM1JoZEdsaklHbGtaVzUwYVdacFpYSW9LU0I3WEc0Z0lDQWdJQ0J5WlhSMWNtNGdUa0ZOUlZ4dUlDQWdJSDFjYmx4dUlDQWdJSE4wWVhScFl5QmZSRTlOU1c1MFpYSm1ZV05sS0c5d2RHbHZibk1wSUh0Y2JpQWdJQ0FnSUhKbGRIVnliaUJ6ZFhCbGNpNWZSRTlOU1c1MFpYSm1ZV05sS0ZSaFlpd2diM0IwYVc5dWN5bGNiaUFnSUNCOVhHNGdJSDFjYmx4dUlDQXZLaXBjYmlBZ0lDb2dMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRYRzRnSUNBcUlFUlBUU0JCY0drZ2FXMXdiR1Z0Wlc1MFlYUnBiMjVjYmlBZ0lDb2dMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRYRzRnSUNBcUwxeHVJQ0JqYjI1emRDQmpiMjF3YjI1bGJuUnpJRDBnVzExY2JseHVJQ0JqYjI1emRDQjBZV0p6SUQwZ1pHOWpkVzFsYm5RdWNYVmxjbmxUWld4bFkzUnZja0ZzYkNoZ1cyUmhkR0V0ZEc5bloyeGxQVndpSkh0T1FVMUZmVndpWFdBcFhHNGdJR2xtSUNoMFlXSnpLU0I3WEc0Z0lDQWdRWEp5WVhrdVpuSnZiU2gwWVdKektTNW1iM0pGWVdOb0tDaGxiR1Z0Wlc1MEtTQTlQaUI3WEc0Z0lDQWdJQ0F2THlCamIyNXpkQ0JqYjI1bWFXY2dQU0I3ZlZ4dUlDQWdJQ0FnWTI5dWMzUWdZMjl1Wm1sbklEMGdaMlYwUVhSMGNtbGlkWFJsYzBOdmJtWnBaeWhsYkdWdFpXNTBMQ0JFUlVaQlZVeFVYMUJTVDFCRlVsUkpSVk1zSUVSQlZFRmZRVlJVVWxOZlVGSlBVRVZTVkVsRlV5bGNiaUFnSUNBZ0lHTnZibVpwWnk1bGJHVnRaVzUwSUQwZ1pXeGxiV1Z1ZEZ4dVhHNGdJQ0FnSUNCamIyMXdiMjVsYm5SekxuQjFjMmdvVkdGaUxsOUVUMDFKYm5SbGNtWmhZMlVvWTI5dVptbG5LU2xjYmlBZ0lDQjlLVnh1SUNCOVhHNWNiaUFnYVdZZ0tIUmhZbk1wSUh0Y2JpQWdJQ0JrYjJOMWJXVnVkQzVoWkdSRmRtVnVkRXhwYzNSbGJtVnlLQ2RqYkdsamF5Y3NJQ2hsZG1WdWRDa2dQVDRnZTF4dUlDQWdJQ0FnWTI5dWMzUWdaR0YwWVZSdloyZHNaVUYwZEhJZ1BTQmxkbVZ1ZEM1MFlYSm5aWFF1WjJWMFFYUjBjbWxpZFhSbEtDZGtZWFJoTFhSdloyZHNaU2NwWEc0Z0lDQWdJQ0JwWmlBb1pHRjBZVlJ2WjJkc1pVRjBkSElnSmlZZ1pHRjBZVlJ2WjJkc1pVRjBkSElnUFQwOUlFNUJUVVVwSUh0Y2JpQWdJQ0FnSUNBZ1kyOXVjM1FnYVdRZ1BTQmxkbVZ1ZEM1MFlYSm5aWFF1WjJWMFFYUjBjbWxpZFhSbEtDZG9jbVZtSnlsY2JseHVJQ0FnSUNBZ0lDQmpiMjV6ZENCamIyMXdiMjVsYm5RZ1BTQmpiMjF3YjI1bGJuUnpMbVpwYm1Rb1l5QTlQaUJqTG1kbGRFVnNaVzFsYm5Rb0tTNW5aWFJCZEhSeWFXSjFkR1VvSjJoeVpXWW5LU0E5UFQwZ2FXUXBYRzVjYmlBZ0lDQWdJQ0FnYVdZZ0tDRmpiMjF3YjI1bGJuUXBJSHRjYmlBZ0lDQWdJQ0FnSUNCeVpYUjFjbTVjYmlBZ0lDQWdJQ0FnZlZ4dVhHNGdJQ0FnSUNBZ0lHTnZiWEJ2Ym1WdWRDNXphRzkzS0NsY2JpQWdJQ0FnSUgxY2JpQWdJQ0I5S1Z4dUlDQjlYRzVjYmlBZ2NtVjBkWEp1SUZSaFlseHVmU2tvS1Z4dVhHNWxlSEJ2Y25RZ1pHVm1ZWFZzZENCVVlXSmNiaUlzSWk4cUtseHVLaUF0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFZ4dUtpQk1hV05sYm5ObFpDQjFibVJsY2lCTlNWUWdLR2gwZEhCek9pOHZaMmwwYUhWaUxtTnZiUzl4ZFdGeWF5MWtaWFl2VUdodmJtOXVMVVp5WVcxbGQyOXlheTlpYkc5aUwyMWhjM1JsY2k5TVNVTkZUbE5GS1Z4dUtpQXRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMVnh1S2k5Y2JseHVZMjl1YzNRZ1FtbHVaR1Z5SUQwZ0tDZ3BJRDArSUh0Y2JpQWdMeW9xWEc0Z0lDb2dMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRYRzRnSUNvZ1EyOXVjM1JoYm5SelhHNGdJQ29nTFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0WEc0Z0lDb3ZYRzVjYmlBZ1kyOXVjM1FnVGtGTlJTQTlJQ2RwYm5Sc0xXSnBibVJsY2lkY2JpQWdZMjl1YzNRZ1ZrVlNVMGxQVGlBOUlDY3lMakF1TUNkY2JseHVJQ0F2S2lwY2JpQWdJQ29nTFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0WEc0Z0lDQXFJRU5zWVhOeklFUmxabWx1YVhScGIyNWNiaUFnSUNvZ0xTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdFhHNGdJQ0FxTDF4dVhHNGdJR05zWVhOeklFSnBibVJsY2lCN1hHNGdJQ0FnWTI5dWMzUnlkV04wYjNJb1pXeGxiV1Z1ZEN3Z1pHRjBZU2tnZTF4dUlDQWdJQ0FnZEdocGN5NWxiR1Z0Wlc1MElEMGdaV3hsYldWdWRGeHVJQ0FnSUNBZ2RHaHBjeTVrWVhSaElEMGdaR0YwWVZ4dVhHNGdJQ0FnSUNCcFppQW9JWFJvYVhNdWFYTkZiR1Z0Wlc1MEtIUm9hWE11Wld4bGJXVnVkQ2twSUh0Y2JpQWdJQ0FnSUNBZ2NtVjBkWEp1WEc0Z0lDQWdJQ0I5WEc1Y2JpQWdJQ0FnSUM4dklHRnljbUY1SUc5bUlFaFVUVXhGYkdWdFpXNTBYRzRnSUNBZ0lDQnBaaUFvZEdocGN5NWxiR1Z0Wlc1MExteGxibWQwYUNBbUppQjBhR2x6TG1Wc1pXMWxiblF1YkdWdVozUm9JRDRnTUNrZ2UxeHVJQ0FnSUNBZ0lDQjBhR2x6TG5ObGRFNXZaR1Z6S0hSb2FYTXVaV3hsYldWdWRDbGNiaUFnSUNBZ0lIMGdaV3h6WlNCN1hHNGdJQ0FnSUNBZ0lDOHZJSE5wYm1kc1pTQklWRTFNUld4bGJXVnVkRnh1SUNBZ0lDQWdJQ0IwYUdsekxuTmxkRTV2WkdVb2RHaHBjeTVsYkdWdFpXNTBLVnh1SUNBZ0lDQWdmVnh1SUNBZ0lIMWNibHh1SUNBZ0lDOHZJR2RsZEhSbGNuTmNibHh1SUNBZ0lITjBZWFJwWXlCblpYUWdkbVZ5YzJsdmJpZ3BJSHRjYmlBZ0lDQWdJSEpsZEhWeWJpQmdKSHRPUVUxRmZTNGtlMVpGVWxOSlQwNTlZRnh1SUNBZ0lIMWNibHh1SUNBZ0lDOHFLbHh1SUNBZ0lDQXFJRU5vWldOcmN5QnBaaUIwYUdVZ1oybDJaVzRnWVhKbmRXMWxiblFnYVhNZ1lTQkVUMDBnWld4bGJXVnVkRnh1SUNBZ0lDQXFJRUJ3WVhKaGJTQjdTRlJOVEVWc1pXMWxiblI5SUhSb1pTQmhjbWQxYldWdWRDQjBieUIwWlhOMFhHNGdJQ0FnSUNvZ1FISmxkSFZ5YmlCN1ltOXZiR1ZoYm4wZ2RISjFaU0JwWmlCMGFHVWdiMkpxWldOMElHbHpJR0VnUkU5TklHVnNaVzFsYm5Rc0lHWmhiSE5sSUc5MGFHVnlkMmx6WlZ4dUlDQWdJQ0FxTDF4dUlDQWdJR2x6Uld4bGJXVnVkQ2hsYkdWdFpXNTBLU0I3WEc0Z0lDQWdJQ0JwWmlBb1pXeGxiV1Z1ZENBOVBUMGdiblZzYkNrZ2UxeHVJQ0FnSUNBZ0lDQnlaWFIxY200Z1ptRnNjMlZjYmlBZ0lDQWdJSDFjYmlBZ0lDQWdJSEpsZEhWeWJpQW9kSGx3Wlc5bUlFNXZaR1VnUFQwOUlDZHZZbXBsWTNRbklEOGdaV3hsYldWdWRDQnBibk4wWVc1alpXOW1JRTV2WkdVZ09pQmxiR1Z0Wlc1MElDWW1JSFI1Y0dWdlppQmxiR1Z0Wlc1MElEMDlQU0FuYjJKcVpXTjBKeUFtSmlCMGVYQmxiMllnWld4bGJXVnVkQzV1YjJSbFZIbHdaU0E5UFQwZ0oyNTFiV0psY2ljZ0ppWWdkSGx3Wlc5bUlHVnNaVzFsYm5RdWJtOWtaVTVoYldVZ1BUMDlJQ2R6ZEhKcGJtY25LVnh1SUNBZ0lIMWNibHh1SUNBZ0lDOHFLbHh1SUNBZ0lDb2dRbWx1WkhNZ2MyOXRaU0IwWlhoMElIUnZJSFJvWlNCbmFYWmxiaUJFVDAwZ1pXeGxiV1Z1ZEZ4dUlDQWdJQ29nUUhCaGNtRnRJSHRJVkUxTVJXeGxiV1Z1ZEgwZ1pXeGxiV1Z1ZEZ4dUlDQWdJQ29nUUhCaGNtRnRJSHRUZEhKcGJtZDlJSFJsZUhSY2JpQWdJQ0FxTDF4dUlDQWdJSE5sZEZSbGVIUW9aV3hsYldWdWRDd2dkR1Y0ZENrZ2UxeHVJQ0FnSUNBZ2FXWWdLQ0VvSjNSbGVIUkRiMjUwWlc1MEp5QnBiaUJsYkdWdFpXNTBLU2tnZTF4dUlDQWdJQ0FnSUNCbGJHVnRaVzUwTG1sdWJtVnlWR1Y0ZENBOUlIUmxlSFJjYmlBZ0lDQWdJSDBnWld4elpTQjdYRzRnSUNBZ0lDQWdJR1ZzWlcxbGJuUXVkR1Y0ZEVOdmJuUmxiblFnUFNCMFpYaDBYRzRnSUNBZ0lDQjlYRzRnSUNBZ2ZWeHVYRzRnSUNBZ0x5b3FYRzRnSUNBZ0lDb2dRbWx1WkhNZ2MyOXRaU0JvZEcxc0lIUnZJSFJvWlNCbmFYWmxiaUJFVDAwZ1pXeGxiV1Z1ZEZ4dUlDQWdJQ0FxSUVCd1lYSmhiU0I3U0ZSTlRFVnNaVzFsYm5SOUlHVnNaVzFsYm5SY2JpQWdJQ0FnS2lCQWNHRnlZVzBnZTNOMGNtbHVaMzBnZEdWNGRGeHVJQ0FnSUNBcUwxeHVJQ0FnSUhObGRFaDBiV3dvWld4bGJXVnVkQ3dnZEdWNGRDa2dlMXh1SUNBZ0lDQWdaV3hsYldWdWRDNXBibTVsY2toVVRVd2dQU0IwWlhoMFhHNGdJQ0FnZlZ4dVhHNGdJQ0FnTHlvcVhHNGdJQ0FnSUNvZ1FtbHVaSE1nWTNWemRHOXRJR0YwZEhKcFluVjBaWE1nZEc4Z2RHaGxJR2RwZG1WdUlFUlBUU0JsYkdWdFpXNTBYRzRnSUNBZ0lDb2dRSEJoY21GdElIdElWRTFNUld4bGJXVnVkSDBnWld4bGJXVnVkRnh1SUNBZ0lDQXFJRUJ3WVhKaGJTQjdVM1J5YVc1bmZTQmhkSFJ5WEc0Z0lDQWdJQ29nUUhCaGNtRnRJSHRUZEhKcGJtZDlJSFJsZUhSY2JpQWdJQ0FnS2k5Y2JpQWdJQ0J6WlhSQmRIUnlhV0oxZEdVb1pXeGxiV1Z1ZEN3Z1lYUjBjaXdnZEdWNGRDa2dlMXh1SUNBZ0lDQWdaV3hsYldWdWRDNXpaWFJCZEhSeWFXSjFkR1VvWVhSMGNpd2dkR1Y0ZENsY2JpQWdJQ0I5WEc1Y2JpQWdJQ0J6WlhST2IyUmxLR1ZzWlcxbGJuUXBJSHRjYmlBZ0lDQWdJR3hsZENCaGRIUnlJRDBnWld4bGJXVnVkQzVuWlhSQmRIUnlhV0oxZEdVb0oyUmhkR0V0YVRFNGJpY3BYRzRnSUNBZ0lDQnBaaUFvSVdGMGRISXBJSHRjYmlBZ0lDQWdJQ0FnY21WMGRYSnVYRzRnSUNBZ0lDQjlYRzVjYmlBZ0lDQWdJR0YwZEhJZ1BTQmhkSFJ5TG5SeWFXMG9LVnh1WEc0Z0lDQWdJQ0JqYjI1emRDQnlJRDBnTHlnL09seGNjM3hlS1NoYlFTMWFZUzE2TFY4d0xUbGRLeWs2WEZ4ektpZ3VLajhwS0Q4OVhGeHpLMXhjZHlzNmZDUXBMMmRjYmlBZ0lDQWdJR3hsZENCdFhHNWNiaUFnSUNBZ0lIZG9hV3hsSUNodElEMGdjaTVsZUdWaktHRjBkSElwS1NCN1hHNGdJQ0FnSUNBZ0lHTnZibk4wSUd0bGVTQTlJRzFiTVYwdWRISnBiU2dwWEc0Z0lDQWdJQ0FnSUdOdmJuTjBJSFpoYkhWbElEMGdiVnN5WFM1MGNtbHRLQ2t1Y21Wd2JHRmpaU2duTENjc0lDY25LVnh1SUNBZ0lDQWdJQ0JzWlhRZ2FXNTBiRlpoYkhWbElEMGdkR2hwY3k1a1lYUmhXM1poYkhWbFhWeHVYRzRnSUNBZ0lDQWdJR2xtSUNnaGRHaHBjeTVrWVhSaFczWmhiSFZsWFNrZ2UxeHVJQ0FnSUNBZ0lDQWdJR052Ym5OdmJHVXViRzluS0dBa2UwNUJUVVY5TGlCWFlYSnVhVzVuTENBa2UzWmhiSFZsZlNCa2IyVnpJRzV2ZENCbGVHbHpkQzVnS1Z4dUlDQWdJQ0FnSUNBZ0lHbHVkR3hXWVd4MVpTQTlJSFpoYkhWbFhHNGdJQ0FnSUNBZ0lIMWNibHh1SUNBZ0lDQWdJQ0JqYjI1emRDQnRaWFJvYjJST1lXMWxJRDBnSjNObGRDY2dLeUJyWlhrdVkyaGhja0YwS0RBcExuUnZWWEJ3WlhKRFlYTmxLQ2tnS3lCclpYa3VjMnhwWTJVb01TbGNibHh1SUNBZ0lDQWdJQ0JwWmlBb2RHaHBjMXR0WlhSb2IyUk9ZVzFsWFNrZ2UxeHVJQ0FnSUNBZ0lDQWdJSFJvYVhOYmJXVjBhRzlrVG1GdFpWMG9aV3hsYldWdWRDd2dhVzUwYkZaaGJIVmxLVnh1SUNBZ0lDQWdJQ0I5SUdWc2MyVWdlMXh1SUNBZ0lDQWdJQ0FnSUhSb2FYTXVjMlYwUVhSMGNtbGlkWFJsS0dWc1pXMWxiblFzSUd0bGVTd2dhVzUwYkZaaGJIVmxLVnh1SUNBZ0lDQWdJQ0I5WEc0Z0lDQWdJQ0I5WEc0Z0lDQWdmVnh1WEc0Z0lDQWdMeW9xWEc0Z0lDQWdLaUJUWlhRZ2RtRnNkV1Z6SUhSdklFUlBUU0J1YjJSbGMxeHVJQ0FnSUNvdlhHNGdJQ0FnYzJWMFRtOWtaWE1vWld4bGJXVnVkQ2tnZTF4dUlDQWdJQ0FnUVhKeVlYa3Vabkp2YlNobGJHVnRaVzUwS1M1bWIzSkZZV05vS0dWc0lEMCtJSFJvYVhNdWMyVjBUbTlrWlNobGJDa3BYRzRnSUNBZ2ZWeHVJQ0I5WEc1Y2JpQWdjbVYwZFhKdUlFSnBibVJsY2x4dWZTa29LVnh1WEc1bGVIQnZjblFnWkdWbVlYVnNkQ0JDYVc1a1pYSmNiaUlzSWk4cUtseHVJQ29nTFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMxY2JpQXFJRXhwWTJWdWMyVmtJSFZ1WkdWeUlFMUpWQ0FvYUhSMGNITTZMeTluYVhSb2RXSXVZMjl0TDNGMVlYSnJMV1JsZGk5UWFHOXViMjR0Um5KaGJXVjNiM0pyTDJKc2IySXZiV0Z6ZEdWeUwweEpRMFZPVTBVcFhHNGdLaUF0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFZ4dUlDb3ZYRzVwYlhCdmNuUWdRbWx1WkdWeUlHWnliMjBnSnk0dlltbHVaR1Z5SjF4dVhHNWpiMjV6ZENCSmJuUnNJRDBnS0NncElEMCtJSHRjYmlBZ0x5b3FYRzRnSUNBcUlDMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExWeHVJQ0FnS2lCRGIyNXpkR0Z1ZEhOY2JpQWdJQ29nTFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0WEc0Z0lDQXFMMXh1WEc0Z0lHTnZibk4wSUU1QlRVVWdQU0FuU1c1MGJDZGNiaUFnWTI5dWMzUWdWa1ZTVTBsUFRpQTlJQ2N5TGpBdU1DZGNiaUFnWTI5dWMzUWdSRVZHUVZWTVZGOVFVazlRUlZKVVNVVlRJRDBnZTF4dUlDQWdJR1poYkd4aVlXTnJURzlqWVd4bE9pQW5aVzRuTEZ4dUlDQWdJR3h2WTJGc1pUb2dKMlZ1Snl4Y2JpQWdJQ0JoZFhSdlFtbHVaRG9nZEhKMVpTeGNiaUFnSUNCa1lYUmhPaUJ1ZFd4c0xGeHVJQ0I5WEc1Y2JpQWdMeW9xWEc0Z0lDQXFJQzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMVnh1SUNBZ0tpQkRiR0Z6Y3lCRVpXWnBibWwwYVc5dVhHNGdJQ0FxSUMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFZ4dUlDQWdLaTljYmx4dUlDQmpiR0Z6Y3lCSmJuUnNJSHRjYmlBZ0lDQXZLaXBjYmlBZ0lDQWdLaUJEY21WaGRHVnpJR0Z1SUdsdWMzUmhibU5sSUc5bUlFbHVkR3d1WEc0Z0lDQWdJQ29nUUhCaGNtRnRJSHRtWVd4c1ltRmphMHh2WTJGc1pUb2djM1J5YVc1bkxDQnNiMk5oYkdVNklITjBjbWx1Wnl3Z1lYVjBiMEpwYm1RNklHSnZiMnhsWVc0c0lHUmhkR0U2SUh0YmJHRnVaem9nYzNSeWFXNW5YVG9nZTF0clpYazZJSE4wY21sdVoxMDZJSE4wY21sdVozMTlmVnh1SUNBZ0lDQXFMMXh1SUNBZ0lHTnZibk4wY25WamRHOXlLRzl3ZEdsdmJuTWdQU0I3ZlNrZ2UxeHVJQ0FnSUNBZ2RHaHBjeTV2Y0hScGIyNXpJRDBnVDJKcVpXTjBMbUZ6YzJsbmJpaEVSVVpCVlV4VVgxQlNUMUJGVWxSSlJWTXNJRzl3ZEdsdmJuTXBYRzVjYmlBZ0lDQWdJR2xtSUNoMGVYQmxiMllnZEdocGN5NXZjSFJwYjI1ekxtWmhiR3hpWVdOclRHOWpZV3hsSUNFOVBTQW5jM1J5YVc1bkp5a2dlMXh1SUNBZ0lDQWdJQ0IwYUhKdmR5QnVaWGNnUlhKeWIzSW9ZQ1I3VGtGTlJYMHVJRlJvWlNCbVlXeHNZbUZqYXlCc2IyTmhiR1VnYVhNZ2JXRnVaR0YwYjNKNUlHRnVaQ0J0ZFhOMElHSmxJR0VnYzNSeWFXNW5MbUFwWEc0Z0lDQWdJQ0I5WEc1Y2JpQWdJQ0FnSUdsbUlDaDBhR2x6TG05d2RHbHZibk11WkdGMFlTQTlQVDBnYm5Wc2JDa2dlMXh1SUNBZ0lDQWdJQ0IwYUhKdmR5QnVaWGNnUlhKeWIzSW9ZQ1I3VGtGTlJYMHVJRlJvWlhKbElHbHpJRzV2SUhSeVlXNXpiR0YwYVc5dUlHUmhkR0V1WUNsY2JpQWdJQ0FnSUgxY2JseHVJQ0FnSUNBZ2FXWWdLSFI1Y0dWdlppQjBhR2x6TG05d2RHbHZibk11WkdGMFlWdDBhR2x6TG05d2RHbHZibk11Wm1Gc2JHSmhZMnRNYjJOaGJHVmRJQ0U5UFNBbmIySnFaV04wSnlrZ2UxeHVJQ0FnSUNBZ0lDQjBhSEp2ZHlCdVpYY2dSWEp5YjNJb1lDUjdUa0ZOUlgwdUlGUm9aU0JtWVd4c1ltRmpheUJzYjJOaGJHVWdiWFZ6ZENCdVpXTmxjM05oY21sc2VTQm9ZWFpsSUhSeVlXNXpiR0YwYVc5dUlHUmhkR0V1WUNsY2JpQWdJQ0FnSUgxY2JseHVJQ0FnSUNBZ2RHaHBjeTV6WlhSTWIyTmhiR1VvZEdocGN5NXZjSFJwYjI1ekxteHZZMkZzWlN3Z2RHaHBjeTV2Y0hScGIyNXpMbUYxZEc5Q2FXNWtLVnh1SUNBZ0lIMWNibHh1SUNBZ0lITjBZWFJwWXlCblpYUWdkbVZ5YzJsdmJpZ3BJSHRjYmlBZ0lDQWdJSEpsZEhWeWJpQmdKSHRPUVUxRmZTNGtlMVpGVWxOSlQwNTlZRnh1SUNBZ0lIMWNibHh1SUNBZ0lHZGxkRXh2WTJGc1pTZ3BJSHRjYmlBZ0lDQWdJSEpsZEhWeWJpQjBhR2x6TG05d2RHbHZibk11Ykc5allXeGxYRzRnSUNBZ2ZWeHVYRzRnSUNBZ1oyVjBSbUZzYkdKaFkydE1iMk5oYkdVb0tTQjdYRzRnSUNBZ0lDQnlaWFIxY200Z2RHaHBjeTV2Y0hScGIyNXpMbVpoYkd4aVlXTnJURzlqWVd4bFhHNGdJQ0FnZlZ4dVhHNGdJQ0FnTHlvcVhHNGdJQ0FnSUNvZ1UyVjBJR1JsWm1GMWJIUWdiRzlqWVd4bFhHNGdJQ0FnSUNvZ1FIQmhjbUZ0SUh0emRISnBibWQ5SUd4dlkyRnNaVnh1SUNBZ0lDQXFJRUJ3WVhKaGJTQjdZbTl2YkdWaGJuMGdXM1Z3WkdGMFpVaFVUVXc5ZEhKMVpWMWNiaUFnSUNBZ0tpOWNiaUFnSUNCelpYUk1iMk5oYkdVb2JHOWpZV3hsTENCMWNHUmhkR1ZJVkUxTUlEMGdkSEoxWlNrZ2UxeHVJQ0FnSUNBZ2FXWWdLSFI1Y0dWdlppQjBhR2x6TG05d2RHbHZibk11WkdGMFlWdHNiMk5oYkdWZElDRTlQU0FuYjJKcVpXTjBKeWtnZTF4dUlDQWdJQ0FnSUNCamIyNXpiMnhsTG1WeWNtOXlLR0FrZTA1QlRVVjlMaUFrZTJ4dlkyRnNaWDBnYUdGeklHNXZJR1JoZEdFc0lHWmhiR3hpWVdOcklHbHVJQ1I3ZEdocGN5NXZjSFJwYjI1ekxtWmhiR3hpWVdOclRHOWpZV3hsZlM1Z0tWeHVJQ0FnSUNBZ2ZTQmxiSE5sSUh0Y2JpQWdJQ0FnSUNBZ2RHaHBjeTV2Y0hScGIyNXpMbXh2WTJGc1pTQTlJR3h2WTJGc1pWeHVJQ0FnSUNBZ2ZWeHVYRzRnSUNBZ0lDQnBaaUFvZFhCa1lYUmxTRlJOVENrZ2UxeHVJQ0FnSUNBZ0lDQjBhR2x6TG5Wd1pHRjBaVWgwYld3b0tWeHVJQ0FnSUNBZ2ZWeHVJQ0FnSUgxY2JseHVJQ0FnSUdkbGRFeGhibWQxWVdkbGN5Z3BJSHRjYmlBZ0lDQWdJSEpsZEhWeWJpQlBZbXBsWTNRdWEyVjVjeWgwYUdsekxtOXdkR2x2Ym5NdVpHRjBZU2xjYmlBZ0lDQjlYRzVjYmlBZ0lDQnBibk5sY25SV1lXeDFaWE1vZG1Gc2RXVWdQU0J1ZFd4c0xDQnBibXBsWTNSaFlteGxWbUZzZFdWeklEMGdlMzBwSUh0Y2JpQWdJQ0FnSUdsbUlDaDBlWEJsYjJZZ2RtRnNkV1VnSVQwOUlDZHpkSEpwYm1jbktTQjdYRzRnSUNBZ0lDQWdJSEpsZEhWeWJpQjFibVJsWm1sdVpXUmNiaUFnSUNBZ0lIMWNibHh1SUNBZ0lDQWdZMjl1YzNRZ2JXRjBZMmdnUFNCMllXeDFaUzV0WVhSamFDZ3ZPaWhiWVMxNlFTMWFMVjh3TFRsZEt5a3ZLVnh1SUNBZ0lDQWdhV1lnS0cxaGRHTm9LU0I3WEc0Z0lDQWdJQ0FnSUhaaGJIVmxJRDBnZG1Gc2RXVXVjbVZ3YkdGalpTaHRZWFJqYUZzd1hTd2dhVzVxWldOMFlXSnNaVlpoYkhWbGMxdHRZWFJqYUZzeFhWMHBYRzRnSUNBZ0lDQjlYRzVjYmlBZ0lDQWdJR2xtSUNoMllXeDFaUzV0WVhSamFDZ3ZPaWhiWVMxNlFTMWFMVjh3TFRsZEt5a3ZLU2tnZTF4dUlDQWdJQ0FnSUNCeVpYUjFjbTRnZEdocGN5NXBibk5sY25SV1lXeDFaWE1vZG1Gc2RXVXNJR2x1YW1WamRHRmliR1ZXWVd4MVpYTXBYRzRnSUNBZ0lDQjlYRzVjYmlBZ0lDQWdJSEpsZEhWeWJpQjJZV3gxWlZ4dUlDQWdJSDFjYmx4dUlDQWdJSFJ5WVc1emJHRjBaU2hyWlhsT1lXMWxJRDBnYm5Wc2JDd2dhVzVxWldOMElEMGdlMzBwSUh0Y2JpQWdJQ0FnSUd4bGRDQmtZWFJoSUQwZ2RHaHBjeTV2Y0hScGIyNXpMbVJoZEdGYmRHaHBjeTV2Y0hScGIyNXpMbXh2WTJGc1pWMWNiaUFnSUNBZ0lHbG1JQ2doWkdGMFlTa2dlMXh1SUNBZ0lDQWdJQ0JrWVhSaElEMGdkR2hwY3k1dmNIUnBiMjV6TG1SaGRHRmJkR2hwY3k1dmNIUnBiMjV6TG1aaGJHeGlZV05yVEc5allXeGxYVnh1SUNBZ0lDQWdmVnh1WEc0Z0lDQWdJQ0JwWmlBb2EyVjVUbUZ0WlNBOVBUMGdiblZzYkNCOGZDQnJaWGxPWVcxbElEMDlQU0FuS2ljZ2ZId2dRWEp5WVhrdWFYTkJjbkpoZVNoclpYbE9ZVzFsS1NrZ2UxeHVJQ0FnSUNBZ0lDQnBaaUFvUVhKeVlYa3VhWE5CY25KaGVTaHJaWGxPWVcxbEtTa2dlMXh1SUNBZ0lDQWdJQ0FnSUdOdmJuTjBJR3RsZVhNZ1BTQlBZbXBsWTNRdWEyVjVjeWhrWVhSaEtTNW1hV3gwWlhJb2EyVjVJRDArSUd0bGVVNWhiV1V1YVc1a1pYaFBaaWhyWlhrcElENGdMVEVwWEc0Z0lDQWdJQ0FnSUNBZ1kyOXVjM1FnWm1sc2RHVnlaV1JFWVhSaElEMGdlMzFjYmlBZ0lDQWdJQ0FnSUNCclpYbHpMbVp2Y2tWaFkyZ29hMlY1SUQwK0lIdGNiaUFnSUNBZ0lDQWdJQ0FnSUdacGJIUmxjbVZrUkdGMFlWdHJaWGxkSUQwZ2RHaHBjeTVwYm5ObGNuUldZV3gxWlhNb1pHRjBZVnRyWlhsZExDQnBibXBsWTNRcFhHNGdJQ0FnSUNBZ0lDQWdmU2xjYmlBZ0lDQWdJQ0FnSUNCa1lYUmhJRDBnWm1sc2RHVnlaV1JFWVhSaFhHNGdJQ0FnSUNBZ0lIMWNibHh1SUNBZ0lDQWdJQ0JqYjI1emRDQmtZWFJoVFdGd0lEMGdlMzFjYmlBZ0lDQWdJQ0FnWm05eUlDaGpiMjV6ZENCclpYa2dhVzRnWkdGMFlTa2dlMXh1SUNBZ0lDQWdJQ0FnSUdSaGRHRk5ZWEJiYTJWNVhTQTlJSFJvYVhNdWFXNXpaWEowVm1Gc2RXVnpLR1JoZEdGYmEyVjVYU3dnYVc1cVpXTjBLVnh1SUNBZ0lDQWdJQ0I5WEc1Y2JpQWdJQ0FnSUNBZ2NtVjBkWEp1SUdSaGRHRk5ZWEJjYmlBZ0lDQWdJSDFjYmx4dUlDQWdJQ0FnY21WMGRYSnVJSFJvYVhNdWFXNXpaWEowVm1Gc2RXVnpLR1JoZEdGYmEyVjVUbUZ0WlYwc0lHbHVhbVZqZENsY2JpQWdJQ0I5WEc1Y2JpQWdJQ0F2THlCaGJHbGhjeUJ2WmlCMEtDbGNiaUFnSUNCMEtHdGxlVTVoYldVZ1BTQnVkV3hzTENCcGJtcGxZM1FnUFNCN2ZTa2dlMXh1SUNBZ0lDQWdjbVYwZFhKdUlIUm9hWE11ZEhKaGJuTnNZWFJsS0d0bGVVNWhiV1VzSUdsdWFtVmpkQ2xjYmlBZ0lDQjlYRzVjYmlBZ0lDQXZLaXBjYmlBZ0lDQWdLaUJWY0dSaGRHVnpJSFJvWlNCSVZFMU1JSFpwWlhkelhHNGdJQ0FnSUNvZ1FIQmhjbUZ0SUh0SVZFMU1SV3hsYldWdWRIMGdaV3hsYldWdWRGeHVJQ0FnSUNBcUwxeHVJQ0FnSUhWd1pHRjBaVWgwYld3b1pXeGxiV1Z1ZENrZ2UxeHVJQ0FnSUNBZ2FXWWdLSFI1Y0dWdlppQmxiR1Z0Wlc1MElEMDlQU0FuZFc1a1pXWnBibVZrSnlrZ2UxeHVJQ0FnSUNBZ0lDQmxiR1Z0Wlc1MElEMGdaRzlqZFcxbGJuUXVjWFZsY25sVFpXeGxZM1J2Y2tGc2JDZ25XMlJoZEdFdGFURTRibDBuS1Z4dUlDQWdJQ0FnZlZ4dVhHNGdJQ0FnSUNCcFppQW9kSGx3Wlc5bUlHVnNaVzFsYm5RZ1BUMDlJQ2R6ZEhKcGJtY25LU0I3WEc0Z0lDQWdJQ0FnSUdWc1pXMWxiblFnUFNCa2IyTjFiV1Z1ZEM1eGRXVnllVk5sYkdWamRHOXlLR1ZzWlcxbGJuUXBYRzRnSUNBZ0lDQjlYRzVjYmlBZ0lDQWdJRzVsZHlCQ2FXNWtaWElvWld4bGJXVnVkQ3dnZEdocGN5NTBLQ2twWEc0Z0lDQWdmVnh1WEc0Z0lDQWdMeThnYzNSaGRHbGpYRzRnSUNBZ2MzUmhkR2xqSUY5RVQwMUpiblJsY21aaFkyVW9iM0IwYVc5dWN5a2dlMXh1SUNBZ0lDQWdjbVYwZFhKdUlHNWxkeUJKYm5Sc0tHOXdkR2x2Ym5NcFhHNGdJQ0FnZlZ4dUlDQjlYRzVjYmlBZ2NtVjBkWEp1SUVsdWRHeGNibjBwS0NsY2JseHVaWGh3YjNKMElHUmxabUYxYkhRZ1NXNTBiRnh1SWl3aUx5b3FYRzRnS2lBdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExWeHVJQ29nVEdsalpXNXpaV1FnZFc1a1pYSWdUVWxVSUNob2RIUndjem92TDJkcGRHaDFZaTVqYjIwdmNYVmhjbXN0WkdWMkwxQm9iMjV2YmkxR2NtRnRaWGR2Y21zdllteHZZaTl0WVhOMFpYSXZURWxEUlU1VFJTbGNiaUFxSUMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdFhHNGdLaTljYmx4dWFXMXdiM0owSUZCaFoyVWdabkp2YlNBbkxpOXdZV2RsSjF4dWFXMXdiM0owSUVWMlpXNTBJR1p5YjIwZ0p5NHVMeTR1TDJOdmJXMXZiaTlsZG1WdWRITW5YRzVjYm1OdmJuTjBJRkJoWjJWeUlEMGdLQ2dwSUQwK0lIdGNiaUFnTHlvcVhHNGdJQ0FxSUMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFZ4dUlDQWdLaUJEYjI1emRHRnVkSE5jYmlBZ0lDb2dMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRYRzRnSUNBcUwxeHVYRzRnSUdOdmJuTjBJRTVCVFVVZ1BTQW5jR0ZuWlhJblhHNGdJR052Ym5OMElGWkZVbE5KVDA0Z1BTQW5NaTR3TGpBblhHNGdJR052Ym5OMElFUkZSa0ZWVEZSZlVGSlBVRVZTVkVsRlV5QTlJSHRjYmlBZ0lDQm9ZWE5vVUhKbFptbDRPaUFuSXlFbkxGeHVJQ0FnSUhWelpVaGhjMmc2SUhSeWRXVXNYRzRnSUNBZ1pHVm1ZWFZzZEZCaFoyVTZJRzUxYkd3c1hHNGdJQ0FnWVc1cGJXRjBaVkJoWjJWek9pQjBjblZsTEZ4dUlDQjlYRzVjYmlBZ2JHVjBJR04xY25KbGJuUlFZV2RsWEc0Z0lDOHFLbHh1SUNBZ0tpQXRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMWNiaUFnSUNvZ1EyeGhjM01nUkdWbWFXNXBkR2x2Ymx4dUlDQWdLaUF0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzFjYmlBZ0lDb3ZYRzVjYmlBZ1kyeGhjM01nVUdGblpYSWdlMXh1SUNBZ0lDOHFLbHh1SUNBZ0lDQXFJRUJqYjI1emRISjFZM1J2Y2x4dUlDQWdJQ0FxWEc0Z0lDQWdJQ29nUUhCaGNtRnRJRzl3ZEdsdmJuTWdlMDlpYW1WamRIMWNiaUFnSUNBZ0tpOWNiaUFnSUNCamIyNXpkSEoxWTNSdmNpaHZjSFJwYjI1eklEMGdlMzBwSUh0Y2JpQWdJQ0FnSUhSb2FYTXViM0IwYVc5dWN5QTlJRTlpYW1WamRDNWhjM05wWjI0b1JFVkdRVlZNVkY5UVVrOVFSVkpVU1VWVExDQnZjSFJwYjI1ektWeHVYRzRnSUNBZ0lDQjBhR2x6TG5CaFoyVnpJRDBnVzExY2JpQWdJQ0FnSUhSb2FYTXVjM1JoY25SbFpDQTlJR1poYkhObFhHNWNiaUFnSUNBZ0lDOHZJR0ZrWkNCbmJHOWlZV3dnYkdsemRHVnVaWEp6SUhOMVkyZ2dZWE5vSUdoaGMyZ2dZMmhoYm1kbExDQnVZWFpwWjJGMGFXOXVMQ0JsZEdNdVhHNGdJQ0FnSUNCMGFHbHpMbUZrWkZCaFoyVnlSWFpsYm5SektDbGNibHh1SUNBZ0lDQWdMeThnWm1GemRHVnlJSGRoZVNCMGJ5QnBibWwwSUhCaFoyVnpJR0psWm05eVpTQjBhR1VnUkU5TklHbHpJSEpsWVdSNVhHNGdJQ0FnSUNCMGFHbHpMbTl1UkU5TlRHOWhaR1ZrS0NsY2JpQWdJQ0I5WEc1Y2JpQWdJQ0F2THlCd2NtbDJZWFJsWEc0Z0lDQWdYeWh6Wld4bFkzUnZjaWtnZTF4dUlDQWdJQ0FnY21WMGRYSnVJR1J2WTNWdFpXNTBMbkYxWlhKNVUyVnNaV04wYjNJb2MyVnNaV04wYjNJcFhHNGdJQ0FnZlZ4dVhHNGdJQ0FnWjJWMFNHRnphQ2dwSUh0Y2JpQWdJQ0FnSUhKbGRIVnliaUIzYVc1a2IzY3ViRzlqWVhScGIyNHVhR0Z6YUM1emNHeHBkQ2gwYUdsekxtOXdkR2x2Ym5NdWFHRnphRkJ5WldacGVDbGJNVjFjYmlBZ0lDQjlYRzVjYmlBZ0lDQm5aWFJRWVdkbFJuSnZiVWhoYzJnb0tTQjdYRzRnSUNBZ0lDQmpiMjV6ZENCb1lYTm9JRDBnZEdocGN5NW5aWFJJWVhOb0tDbGNiaUFnSUNBZ0lHTnZibk4wSUhKbElEMGdibVYzSUZKbFowVjRjQ2duV3o5Y1hDOWRLRnRlWEZ3dlhTb3BKeWxjYmlBZ0lDQWdJR052Ym5OMElHMWhkR05vWlhNZ1BTQnlaUzVsZUdWaktHaGhjMmdwWEc1Y2JpQWdJQ0FnSUdsbUlDaHRZWFJqYUdWeklDWW1JRzFoZEdOb1pYTmJNVjBwSUh0Y2JpQWdJQ0FnSUNBZ2NtVjBkWEp1SUcxaGRHTm9aWE5iTVYxY2JpQWdJQ0FnSUgxY2JseHVJQ0FnSUNBZ2NtVjBkWEp1SUc1MWJHeGNiaUFnSUNCOVhHNWNiaUFnSUNCelpYUklZWE5vS0hCaFoyVk9ZVzFsS1NCN1hHNGdJQ0FnSUNCM2FXNWtiM2N1Ykc5allYUnBiMjR1YUdGemFDQTlJR0FrZTNSb2FYTXViM0IwYVc5dWN5NW9ZWE5vVUhKbFptbDRmUzhrZTNCaFoyVk9ZVzFsZldCY2JpQWdJQ0I5WEc1Y2JpQWdJQ0JoY21WVFlXMWxVR0ZuWlNod1lXZGxUbUZ0WlRFc0lIQmhaMlZPWVcxbE1pa2dlMXh1SUNBZ0lDQWdZMjl1YzNRZ2NHRm5aVEVnUFNCMGFHbHpMbWRsZEZCaFoyVk5iMlJsYkNod1lXZGxUbUZ0WlRFcFhHNGdJQ0FnSUNCamIyNXpkQ0J3WVdkbE1pQTlJSFJvYVhNdVoyVjBVR0ZuWlUxdlpHVnNLSEJoWjJWT1lXMWxNaWxjYmlBZ0lDQWdJSEpsZEhWeWJpQndZV2RsTVNBbUppQndZV2RsTWlBbUppQndZV2RsTVM1dVlXMWxJRDA5UFNCd1lXZGxNaTV1WVcxbFhHNGdJQ0FnZlZ4dVhHNGdJQ0FnTHlvcVhHNGdJQ0FnSUNvZ1FYUjBZV05vWlhNZ2RHaGxJRzFoYVc0Z1pYWmxiblJ6SUdadmNpQjBjbUZqYTJsdVp5Qm9ZWE5vSUdOb1lXNW5aWE1zWEc0Z0lDQWdJQ29nWTJ4cFkyc2diMjRnYm1GMmFXZGhkR2x2YmlCaWRYUjBiMjV6SUdGdVpDQnNhVzVyY3lCaGJtUWdZbUZqYXlCb2FYTjBiM0o1WEc0Z0lDQWdJQ292WEc0Z0lDQWdZV1JrVUdGblpYSkZkbVZ1ZEhNb0tTQjdYRzRnSUNBZ0lDQmtiMk4xYldWdWRDNWhaR1JGZG1WdWRFeHBjM1JsYm1WeUtDZGpiR2xqYXljc0lHVjJaVzUwSUQwK0lIUm9hWE11YjI1RGJHbGpheWhsZG1WdWRDa3BYRzRnSUNBZ0lDQjNhVzVrYjNjdVlXUmtSWFpsYm5STWFYTjBaVzVsY2lnbmNHOXdjM1JoZEdVbkxDQmxkbVZ1ZENBOVBpQjBhR2x6TG05dVFtRmphMGhwYzNSdmNua29aWFpsYm5RcEtWeHVJQ0FnSUNBZ2QybHVaRzkzTG1Ga1pFVjJaVzUwVEdsemRHVnVaWElvSjJoaGMyaGphR0Z1WjJVbkxDQmxkbVZ1ZENBOVBpQjBhR2x6TG05dVNHRnphRU5vWVc1blpTaGxkbVZ1ZENrcFhHNGdJQ0FnSUNCa2IyTjFiV1Z1ZEM1aFpHUkZkbVZ1ZEV4cGMzUmxibVZ5S0NkRVQwMURiMjUwWlc1MFRHOWhaR1ZrSnl3Z1pYWmxiblFnUFQ0Z2RHaHBjeTV2YmtSUFRVeHZZV1JsWkNobGRtVnVkQ2twWEc0Z0lDQWdmVnh1WEc0Z0lDQWdMeThnWjJWMGRHVnljMXh1WEc0Z0lDQWdjM1JoZEdsaklHZGxkQ0IyWlhKemFXOXVLQ2tnZTF4dUlDQWdJQ0FnY21WMGRYSnVJR0FrZTA1QlRVVjlMaVI3VmtWU1UwbFBUbjFnWEc0Z0lDQWdmVnh1WEc0Z0lDQWdMeThnY0hWaWJHbGpYRzVjYmlBZ0lDQnphRzkzVUdGblpTaHdZV2RsVG1GdFpTd2dZV1JrVkc5SWFYTjBiM0o1SUQwZ2RISjFaU3dnWW1GamF5QTlJR1poYkhObEtTQjdYRzRnSUNBZ0lDQmpiMjV6ZENCdmJHUlFZV2RsSUQwZ2RHaHBjeTVmS0NjdVkzVnljbVZ1ZENjcFhHNGdJQ0FnSUNCcFppQW9iMnhrVUdGblpTa2dlMXh1SUNBZ0lDQWdJQ0JqYjI1emRDQnZiR1JRWVdkbFRtRnRaU0E5SUc5c1pGQmhaMlV1WjJWMFFYUjBjbWxpZFhSbEtDZGtZWFJoTFhCaFoyVW5LVnh1WEc0Z0lDQWdJQ0FnSUdsbUlDaDBhR2x6TG1GeVpWTmhiV1ZRWVdkbEtIQmhaMlZPWVcxbExDQnZiR1JRWVdkbFRtRnRaU2twSUh0Y2JpQWdJQ0FnSUNBZ0lDQnlaWFIxY201Y2JpQWdJQ0FnSUNBZ2ZWeHVYRzRnSUNBZ0lDQWdJRzlzWkZCaFoyVXVZMnhoYzNOTWFYTjBMbkpsYlc5MlpTZ25ZM1Z5Y21WdWRDY3BYRzVjYmlBZ0lDQWdJQ0FnTHk4Z2FHbHpkRzl5ZVZ4dUlDQWdJQ0FnSUNCM2FXNWtiM2N1YUdsemRHOXllUzV5WlhCc1lXTmxVM1JoZEdVb2V5QndZV2RsT2lCdmJHUlFZV2RsVG1GdFpTQjlMQ0J2YkdSUVlXZGxUbUZ0WlN3Z2QybHVaRzkzTG14dlkyRjBhVzl1TG1oeVpXWXBYRzVjYmlBZ0lDQWdJQ0FnZEdocGN5NTBjbWxuWjJWeVVHRm5aVVYyWlc1MEtHOXNaRkJoWjJWT1lXMWxMQ0JGZG1WdWRDNUlTVVJGS1Z4dUlDQWdJQ0FnZlZ4dVhHNGdJQ0FnSUNCMGFHbHpMblJ5YVdkblpYSlFZV2RsUlhabGJuUW9jR0ZuWlU1aGJXVXNJRVYyWlc1MExsTklUMWNwWEc1Y2JpQWdJQ0FnSUdOMWNuSmxiblJRWVdkbElEMGdjR0ZuWlU1aGJXVmNibHh1SUNBZ0lDQWdMeThnYm1WM0lIQmhaMlZjYmlBZ0lDQWdJR052Ym5OMElHNWxkMUJoWjJVZ1BTQjBhR2x6TGw4b1lGdGtZWFJoTFhCaFoyVTlYQ0lrZTNCaFoyVk9ZVzFsZlZ3aVhXQXBYRzVjYmlBZ0lDQWdJRzVsZDFCaFoyVXVZMnhoYzNOTWFYTjBMbUZrWkNnblkzVnljbVZ1ZENjcFhHNWNiaUFnSUNBZ0lDOHZJSFJsYlhCc1lYUmxJR3h2WVdSbGNseHVJQ0FnSUNBZ1kyOXVjM1FnY0dGblpVMXZaR1ZzSUQwZ2RHaHBjeTVuWlhSUVlXZGxUVzlrWld3b2NHRm5aVTVoYldVcFhHNWNiaUFnSUNBZ0lDOHZJRUIwYjJSdk9pQjFjMlVnZEdWdGNHeGhkR1VnWTJGamFHVS9YRzRnSUNBZ0lDQnBaaUFvY0dGblpVMXZaR1ZzSUNZbUlIQmhaMlZOYjJSbGJDNW5aWFJVWlcxd2JHRjBaU2dwS1NCN1hHNGdJQ0FnSUNBZ0lIQmhaMlZOYjJSbGJDNXNiMkZrVkdWdGNHeGhkR1VvS1Z4dUlDQWdJQ0FnZlZ4dUlDQWdJQ0FnTHk4Z1pXNWtYRzVjYmlBZ0lDQWdJR2xtSUNodmJHUlFZV2RsS1NCN1hHNGdJQ0FnSUNBZ0lHTnZibk4wSUc5c1pGQmhaMlZPWVcxbElEMGdiMnhrVUdGblpTNW5aWFJCZEhSeWFXSjFkR1VvSjJSaGRHRXRjR0ZuWlNjcFhHNGdJQ0FnSUNBZ0lDOHZJSFZ6WlNCdlppQndjbTkwYjNSNWNHVXRiM0pwWlc1MFpXUWdiR0Z1WjNWaFoyVmNiaUFnSUNBZ0lDQWdiMnhrVUdGblpTNWlZV05ySUQwZ1ltRmphMXh1SUNBZ0lDQWdJQ0J2YkdSUVlXZGxMbkJ5WlhacGIzVnpVR0ZuWlU1aGJXVWdQU0J2YkdSUVlXZGxUbUZ0WlZ4dVhHNGdJQ0FnSUNBZ0lHTnZibk4wSUc5dVVHRm5aVUZ1YVcxaGRHbHZia1Z1WkNBOUlDZ3BJRDArSUh0Y2JpQWdJQ0FnSUNBZ0lDQnBaaUFvYjJ4a1VHRm5aUzVqYkdGemMweHBjM1F1WTI5dWRHRnBibk1vSjJGdWFXMWhkR1VuS1NrZ2UxeHVJQ0FnSUNBZ0lDQWdJQ0FnYjJ4a1VHRm5aUzVqYkdGemMweHBjM1F1Y21WdGIzWmxLQ2RoYm1sdFlYUmxKeWxjYmlBZ0lDQWdJQ0FnSUNCOVhHNWNiaUFnSUNBZ0lDQWdJQ0J2YkdSUVlXZGxMbU5zWVhOelRHbHpkQzV5WlcxdmRtVW9iMnhrVUdGblpTNWlZV05ySUQ4Z0ozQnZjQzF3WVdkbEp5QTZJQ2R3ZFhOb0xYQmhaMlVuS1Z4dVhHNGdJQ0FnSUNBZ0lDQWdkR2hwY3k1MGNtbG5aMlZ5VUdGblpVVjJaVzUwS0dOMWNuSmxiblJRWVdkbExDQkZkbVZ1ZEM1VFNFOVhUaWxjYmlBZ0lDQWdJQ0FnSUNCMGFHbHpMblJ5YVdkblpYSlFZV2RsUlhabGJuUW9iMnhrVUdGblpTNXdjbVYyYVc5MWMxQmhaMlZPWVcxbExDQkZkbVZ1ZEM1SVNVUkVSVTRwWEc1Y2JpQWdJQ0FnSUNBZ0lDQnZiR1JRWVdkbExuSmxiVzkyWlVWMlpXNTBUR2x6ZEdWdVpYSW9SWFpsYm5RdVFVNUpUVUZVU1U5T1gwVk9SQ3dnYjI1UVlXZGxRVzVwYldGMGFXOXVSVzVrS1Z4dUlDQWdJQ0FnSUNCOVhHNWNiaUFnSUNBZ0lDQWdhV1lnS0hSb2FYTXViM0IwYVc5dWN5NWhibWx0WVhSbFVHRm5aWE1wSUh0Y2JpQWdJQ0FnSUNBZ0lDQnZiR1JRWVdkbExtRmtaRVYyWlc1MFRHbHpkR1Z1WlhJb1JYWmxiblF1UVU1SlRVRlVTVTlPWDBWT1JDd2diMjVRWVdkbFFXNXBiV0YwYVc5dVJXNWtLVnh1SUNBZ0lDQWdJQ0FnSUc5c1pGQmhaMlV1WTJ4aGMzTk1hWE4wTG1Ga1pDZ25ZVzVwYldGMFpTY3BYRzRnSUNBZ0lDQWdJSDBnWld4elpTQjdYRzRnSUNBZ0lDQWdJQ0FnYjI1UVlXZGxRVzVwYldGMGFXOXVSVzVrS0NsY2JpQWdJQ0FnSUNBZ2ZWeHVYRzRnSUNBZ0lDQWdJRzlzWkZCaFoyVXVZMnhoYzNOTWFYTjBMbUZrWkNoaVlXTnJJRDhnSjNCdmNDMXdZV2RsSnlBNklDZHdkWE5vTFhCaFoyVW5LVnh1SUNBZ0lDQWdmVnh1SUNBZ0lIMWNibHh1SUNBZ0lHRmtaRlZ1YVhGMVpWQmhaMlZOYjJSbGJDaHdZV2RsVG1GdFpTa2dlMXh1SUNBZ0lDQWdhV1lnS0NGMGFHbHpMbWRsZEZCaFoyVk5iMlJsYkNod1lXZGxUbUZ0WlNrcElIdGNiaUFnSUNBZ0lDQWdkR2hwY3k1d1lXZGxjeTV3ZFhOb0tHNWxkeUJRWVdkbEtIQmhaMlZPWVcxbEtTbGNiaUFnSUNBZ0lIMWNiaUFnSUNCOVhHNWNiaUFnSUNCblpYUlFZV2RsVFc5a1pXd29jR0ZuWlU1aGJXVXBJSHRjYmlBZ0lDQWdJSEpsZEhWeWJpQjBhR2x6TG5CaFoyVnpMbVpwYm1Rb2NHRm5aU0E5UGlCd1lXZGxMbTVoYldVZ1BUMDlJSEJoWjJWT1lXMWxLVnh1SUNBZ0lIMWNibHh1SUNBZ0lHZGxkRkJoWjJWelRXOWtaV3dvY0dGblpVNWhiV1Z6S1NCN1hHNGdJQ0FnSUNCeVpYUjFjbTRnZEdocGN5NXdZV2RsY3k1bWFXeDBaWElvY0dGblpTQTlQaUJ3WVdkbFRtRnRaWE11YVc1a1pYaFBaaWh3WVdkbExtNWhiV1VwSUQ0Z0xURXBYRzRnSUNBZ2ZWeHVYRzRnSUNBZ2MyVnNaV04wYjNKVWIwRnljbUY1S0hOMGNpa2dlMXh1SUNBZ0lDQWdjbVYwZFhKdUlITjBjaTV6Y0d4cGRDZ25MQ2NwTG0xaGNDaHBkR1Z0SUQwK0lHbDBaVzB1ZEhKcGJTZ3BLVnh1SUNBZ0lIMWNibHh1SUNBZ0lHRmtaRVYyWlc1MGN5aGpZV3hzWW1GamF5a2dlMXh1SUNBZ0lDQWdhV1lnS0hSb2FYTXVZMkZqYUdWUVlXZGxVMlZzWldOMGIzSWdQVDA5SUNjcUp5a2dlMXh1SUNBZ0lDQWdJQ0F2THlCaFpHUWdkRzhnWVd4c0lIQmhaMlVnYlc5a1pXeHpYRzRnSUNBZ0lDQWdJSFJvYVhNdWNHRm5aWE11Wm05eVJXRmphQ2dvY0dGblpTa2dQVDRnZTF4dUlDQWdJQ0FnSUNBZ0lIQmhaMlV1WVdSa1JYWmxiblJEWVd4c1ltRmpheWhqWVd4c1ltRmpheWxjYmlBZ0lDQWdJQ0FnZlNsY2JpQWdJQ0FnSUNBZ2NtVjBkWEp1WEc0Z0lDQWdJQ0I5WEc1Y2JpQWdJQ0FnSUdOdmJuTjBJSEJoWjJWTmIyUmxiSE1nUFNCMGFHbHpMbWRsZEZCaFoyVnpUVzlrWld3b2RHaHBjeTV6Wld4bFkzUnZjbFJ2UVhKeVlYa29kR2hwY3k1allXTm9aVkJoWjJWVFpXeGxZM1J2Y2lrc0lIUnlkV1VwWEc0Z0lDQWdJQ0J3WVdkbFRXOWtaV3h6TG1admNrVmhZMmdvS0hCaFoyVXBJRDArSUh0Y2JpQWdJQ0FnSUNBZ2NHRm5aUzVoWkdSRmRtVnVkRU5oYkd4aVlXTnJLR05oYkd4aVlXTnJLVnh1SUNBZ0lDQWdmU2xjYmlBZ0lDQWdJSFJvYVhNdVkyRmphR1ZRWVdkbFUyVnNaV04wYjNJZ1BTQnVkV3hzWEc0Z0lDQWdmVnh1WEc0Z0lDQWdkWE5sVkdWdGNHeGhkR1VvZEdWdGNHeGhkR1ZRWVhSb0xDQnlaVzVrWlhKR2RXNWpkR2x2YmlBOUlHNTFiR3dwSUh0Y2JpQWdJQ0FnSUdOdmJuTjBJSEJoWjJWTmIyUmxiSE1nUFNCMGFHbHpMbWRsZEZCaFoyVnpUVzlrWld3b2RHaHBjeTV6Wld4bFkzUnZjbFJ2UVhKeVlYa29kR2hwY3k1allXTm9aVkJoWjJWVFpXeGxZM1J2Y2lrc0lIUnlkV1VwWEc0Z0lDQWdJQ0J3WVdkbFRXOWtaV3h6TG1admNrVmhZMmdvS0hCaFoyVXBJRDArSUh0Y2JpQWdJQ0FnSUNBZ2NHRm5aUzUxYzJWVVpXMXdiR0YwWlNoMFpXMXdiR0YwWlZCaGRHZ3BYRzRnSUNBZ0lDQWdJR2xtSUNoMGVYQmxiMllnY21WdVpHVnlSblZ1WTNScGIyNGdQVDA5SUNkbWRXNWpkR2x2YmljcElIdGNiaUFnSUNBZ0lDQWdJQ0J3WVdkbExuVnpaVlJsYlhCc1lYUmxVbVZ1WkdWeVpYSW9jbVZ1WkdWeVJuVnVZM1JwYjI0cFhHNGdJQ0FnSUNBZ0lIMWNiaUFnSUNBZ0lIMHBYRzRnSUNBZ0lDQjBhR2x6TG1OaFkyaGxVR0ZuWlZObGJHVmpkRzl5SUQwZ2JuVnNiRnh1SUNBZ0lIMWNibHh1SUNBZ0lIUnlhV2RuWlhKUVlXZGxSWFpsYm5Rb2NHRm5aVTVoYldVc0lHVjJaVzUwVG1GdFpTd2daWFpsYm5SUVlYSmhiWE1nUFNCdWRXeHNLU0I3WEc0Z0lDQWdJQ0JqYjI1emRDQndZV2RsVFc5a1pXd2dQU0IwYUdsekxtZGxkRkJoWjJWTmIyUmxiQ2h3WVdkbFRtRnRaU2xjYmlBZ0lDQWdJR2xtSUNod1lXZGxUVzlrWld3cElIdGNiaUFnSUNBZ0lDQWdjR0ZuWlUxdlpHVnNMblJ5YVdkblpYSlRZMjl3WlhNb1pYWmxiblJPWVcxbExDQmxkbVZ1ZEZCaGNtRnRjeWxjYmlBZ0lDQWdJSDFjYmlBZ0lDQjlYRzVjYmlBZ0lDQnZia05zYVdOcktHVjJaVzUwS1NCN1hHNGdJQ0FnSUNCamIyNXpkQ0J3WVdkbFRtRnRaU0E5SUdWMlpXNTBMblJoY21kbGRDNW5aWFJCZEhSeWFXSjFkR1VvSjJSaGRHRXRibUYyYVdkaGRHVW5LVnh1SUNBZ0lDQWdZMjl1YzNRZ2NIVnphRkJoWjJVZ1BTQWhLR1YyWlc1MExuUmhjbWRsZEM1blpYUkJkSFJ5YVdKMWRHVW9KMlJoZEdFdGNHOXdMWEJoWjJVbktTQTlQVDBnSjNSeWRXVW5LVnh1WEc0Z0lDQWdJQ0JwWmlBb2NHRm5aVTVoYldVcElIdGNiaUFnSUNBZ0lDQWdhV1lnS0hCaFoyVk9ZVzFsSUQwOVBTQW5KR0poWTJzbktTQjdYRzRnSUNBZ0lDQWdJQ0FnTHk4Z2RHaGxJSEJ2Y0hOMFlYUmxJR1YyWlc1MElIZHBiR3dnWW1VZ2RISnBaMmRsY21Wa1hHNGdJQ0FnSUNBZ0lDQWdkMmx1Wkc5M0xtaHBjM1J2Y25rdVltRmpheWdwWEc0Z0lDQWdJQ0FnSUNBZ2NtVjBkWEp1WEc0Z0lDQWdJQ0FnSUgxY2JseHVJQ0FnSUNBZ0lDQXZLbHh1SUNBZ0lDQWdJQ0FnS2lCSlppQjNaU0JvWlNCMWMyVWdkR2hsSUdoaGMyZ2dZWE1nZEhKcFoyZGxjaXhjYmlBZ0lDQWdJQ0FnSUNvZ2QyVWdZMmhoYm1kbElHbDBJR1I1Ym1GdGFXTmhiR3g1SUhOdklIUm9ZWFFnZEdobElHaGhjMmhqYUdGdVoyVWdaWFpsYm5RZ2FYTWdZMkZzYkdWa1hHNGdJQ0FnSUNBZ0lDQXFJRTkwYUdWeWQybHpaU3dnZDJVZ2MyaHZkeUIwYUdVZ2NHRm5aVnh1SUNBZ0lDQWdJQ0FnS2k5Y2JpQWdJQ0FnSUNBZ2FXWWdLSFJvYVhNdWIzQjBhVzl1Y3k1MWMyVklZWE5vS1NCN1hHNGdJQ0FnSUNBZ0lDQWdkR2hwY3k1elpYUklZWE5vS0hCaFoyVk9ZVzFsS1Z4dUlDQWdJQ0FnSUNCOUlHVnNjMlVnZTF4dUlDQWdJQ0FnSUNBZ0lIUm9hWE11YzJodmQxQmhaMlVvY0dGblpVNWhiV1VzSUhSeWRXVXNJSEIxYzJoUVlXZGxLVnh1SUNBZ0lDQWdJQ0I5WEc0Z0lDQWdJQ0I5WEc0Z0lDQWdmVnh1WEc0Z0lDQWdiMjVDWVdOclNHbHpkRzl5ZVNobGRtVnVkQ0E5SUh0OUtTQjdYRzRnSUNBZ0lDQmpiMjV6ZENCd1lXZGxUbUZ0WlNBOUlHVjJaVzUwTG5OMFlYUmxJRDhnWlhabGJuUXVjM1JoZEdVdWNHRm5aU0E2SUc1MWJHeGNiaUFnSUNBZ0lHbG1JQ2doY0dGblpVNWhiV1VwSUh0Y2JpQWdJQ0FnSUNBZ2NtVjBkWEp1WEc0Z0lDQWdJQ0I5WEc1Y2JpQWdJQ0FnSUhSb2FYTXVjMmh2ZDFCaFoyVW9jR0ZuWlU1aGJXVXNJSFJ5ZFdVc0lIUnlkV1VwWEc0Z0lDQWdmVnh1WEc0Z0lDQWdiMjVJWVhOb1EyaGhibWRsS0NrZ2UxeHVJQ0FnSUNBZ1kyOXVjM1FnY0dGeVlXMXpJRDBnS0hSb2FYTXVaMlYwU0dGemFDZ3BJRDhnZEdocGN5NW5aWFJJWVhOb0tDa3VjM0JzYVhRb0p5OG5LU0E2SUZ0ZEtTNW1hV3gwWlhJb2NDQTlQaUJ3TG14bGJtZDBhQ0ErSURBcFhHNGdJQ0FnSUNCcFppQW9jR0Z5WVcxekxteGxibWQwYUNBK0lEQXBJSHRjYmlBZ0lDQWdJQ0FnTHk4Z2NtVnRiM1psSUdacGNuTjBJSFpoYkhWbElIZG9hV05vSUdseklIUm9aU0J3WVdkbElHNWhiV1ZjYmlBZ0lDQWdJQ0FnY0dGeVlXMXpMbk5vYVdaMEtDbGNiaUFnSUNBZ0lIMWNibHh1SUNBZ0lDQWdkR2hwY3k1MGNtbG5aMlZ5VUdGblpVVjJaVzUwS0dOMWNuSmxiblJRWVdkbExDQkZkbVZ1ZEM1SVFWTklMQ0J3WVhKaGJYTXBYRzVjYmlBZ0lDQWdJR052Ym5OMElHNWhkbEJoWjJVZ1BTQjBhR2x6TG1kbGRGQmhaMlZHY205dFNHRnphQ2dwWEc0Z0lDQWdJQ0JwWmlBb2JtRjJVR0ZuWlNrZ2UxeHVJQ0FnSUNBZ0lDQjBhR2x6TG5Ob2IzZFFZV2RsS0c1aGRsQmhaMlVwWEc0Z0lDQWdJQ0I5WEc0Z0lDQWdmVnh1WEc0Z0lDQWdMeW9xWEc0Z0lDQWdJQ29nVVhWbGNtbGxjeUIwYUdVZ2NHRm5aU0J1YjJSbGN5QnBiaUIwYUdVZ1JFOU5YRzRnSUNBZ0lDb3ZYRzRnSUNBZ2IyNUVUMDFNYjJGa1pXUW9LU0I3WEc0Z0lDQWdJQ0JqYjI1emRDQndZV2RsY3lBOUlHUnZZM1Z0Wlc1MExuRjFaWEo1VTJWc1pXTjBiM0pCYkd3b0oxdGtZWFJoTFhCaFoyVmRKeWxjYmx4dUlDQWdJQ0FnYVdZZ0tDRndZV2RsY3lrZ2UxeHVJQ0FnSUNBZ0lDQnlaWFIxY201Y2JpQWdJQ0FnSUgxY2JseHVJQ0FnSUNBZ2NHRm5aWE11Wm05eVJXRmphQ2dvY0dGblpTa2dQVDRnZTF4dUlDQWdJQ0FnSUNCc1pYUWdjR0ZuWlU1aGJXVWdQU0J3WVdkbExtZGxkRUYwZEhKcFluVjBaU2duWkdGMFlTMXdZV2RsSnlsY2JpQWdJQ0FnSUNBZ0x5cGNiaUFnSUNBZ0lDQWdJQ29nZEdobElIQmhaMlVnYm1GdFpTQmpZVzRnWW1VZ1oybDJaVzRnZDJsMGFDQjBhR1VnWVhSMGNtbGlkWFJsSUdSaGRHRXRjR0ZuWlZ4dUlDQWdJQ0FnSUNBZ0tpQnZjaUIzYVhSb0lHbDBjeUJ1YjJSbElHNWhiV1ZjYmlBZ0lDQWdJQ0FnSUNvdlhHNGdJQ0FnSUNBZ0lHbG1JQ2doY0dGblpVNWhiV1VwSUh0Y2JpQWdJQ0FnSUNBZ0lDQndZV2RsVG1GdFpTQTlJSEJoWjJVdWJtOWtaVTVoYldWY2JpQWdJQ0FnSUNBZ2ZWeHVYRzRnSUNBZ0lDQWdJSFJvYVhNdVlXUmtWVzVwY1hWbFVHRm5aVTF2WkdWc0tIQmhaMlZPWVcxbEtWeHVJQ0FnSUNBZ2ZTbGNiaUFnSUNCOVhHNWNiaUFnSUNCelpXeGxZM1FvY0dGblpVNWhiV1VzSUdGa1pGQmhaMlZOYjJSbGJDQTlJSFJ5ZFdVcElIdGNiaUFnSUNBZ0lIUm9hWE11WTJGamFHVlFZV2RsVTJWc1pXTjBiM0lnUFNCd1lXZGxUbUZ0WlZ4dVhHNGdJQ0FnSUNCcFppQW9ZV1JrVUdGblpVMXZaR1ZzSUNZbUlIQmhaMlZPWVcxbElDRTlQU0FuS2ljcElIdGNiaUFnSUNBZ0lDQWdkR2hwY3k1aFpHUlZibWx4ZFdWUVlXZGxUVzlrWld3b2NHRm5aVTVoYldVcFhHNGdJQ0FnSUNCOVhHNWNiaUFnSUNBZ0lISmxkSFZ5YmlCMGFHbHpYRzRnSUNBZ2ZWeHVYRzRnSUNBZ2MzUmhjblFvWm05eVkyVkVaV1poZFd4MFVHRm5aU0E5SUdaaGJITmxLU0I3WEc0Z0lDQWdJQ0F2THlCamFHVmpheUJwWmlCMGFHVWdZWEJ3SUdoaGN5QmlaV1Z1SUdGc2NtVmhaSGtnYzNSaGNuUmxaRnh1SUNBZ0lDQWdhV1lnS0hSb2FYTXVjM1JoY25SbFpDa2dlMXh1SUNBZ0lDQWdJQ0IwYUhKdmR5QnVaWGNnUlhKeWIzSW9ZQ1I3VGtGTlJYMHVJRlJvWlNCaGNIQWdhR0Z6SUdKbFpXNGdZV3h5WldGa2VTQnpkR0Z5ZEdWa0xtQXBYRzRnSUNBZ0lDQjlYRzVjYmlBZ0lDQWdJSFJvYVhNdWMzUmhjblJsWkNBOUlIUnlkV1ZjYmx4dUlDQWdJQ0FnTHk4Z1ptOXlZMlVnWkdWbVlYVnNkQ0J3WVdkbElHOXVJRU52Y21SdmRtRmNiaUFnSUNBZ0lHbG1JQ2gzYVc1a2IzY3VZMjl5Wkc5MllTa2dlMXh1SUNBZ0lDQWdJQ0JtYjNKalpVUmxabUYxYkhSUVlXZGxJRDBnZEhKMVpWeHVJQ0FnSUNBZ2ZWeHVYRzRnSUNBZ0lDQnNaWFFnY0dGblpVNWhiV1VnUFNCMGFHbHpMbWRsZEZCaFoyVkdjbTl0U0dGemFDZ3BYRzRnSUNBZ0lDQnBaaUFvSVhSb2FYTXVaMlYwVUdGblpVMXZaR1ZzS0hCaFoyVk9ZVzFsS1NrZ2UxeHVJQ0FnSUNBZ0lDQndZV2RsVG1GdFpTQTlJSFJvYVhNdWIzQjBhVzl1Y3k1a1pXWmhkV3gwVUdGblpWeHVJQ0FnSUNBZ2ZWeHVYRzRnSUNBZ0lDQnBaaUFvWm05eVkyVkVaV1poZFd4MFVHRm5aU0FtSmlBaGRHaHBjeTV2Y0hScGIyNXpMbVJsWm1GMWJIUlFZV2RsS1NCN1hHNGdJQ0FnSUNBZ0lIUm9jbTkzSUc1bGR5QkZjbkp2Y2loZ0pIdE9RVTFGZlM0Z1ZHaGxJR1JsWm1GMWJIUWdjR0ZuWlNCdGRYTjBJR1Y0YVhOMElHWnZjaUJtYjNKamFXNW5JR2wwY3lCc1lYVnVZMmdoWUNsY2JpQWdJQ0FnSUgxY2JseHVJQ0FnSUNBZ0x5OGdURzluSUhSb1pTQmtaWFpwWTJVZ2FXNW1iMXh1SUNBZ0lDQWdhV1lnS0hCb2IyNXZiaTVrWldKMVp5a2dlMXh1SUNBZ0lDQWdJQ0JqYjI1emIyeGxMbXh2WnlnblUzUmhjblJwYm1jZ1VHaHZibTl1SUdsdUlDY2dLeUJ3YkdGMFptOXliUzVrWlhOamNtbHdkR2x2YmlsY2JpQWdJQ0FnSUNBZ1kyOXVjMjlzWlM1c2IyY29kR2hwY3k1d1lXZGxjeTVzWlc1bmRHZ2dLeUFuSUhCaFoyVnpJR1p2ZFc1a0p5bGNiaUFnSUNBZ0lDQWdZMjl1YzI5c1pTNXNiMmNvSjB4dllXUnBibWNnSnlBcklIQmhaMlZPWVcxbEtWeHVJQ0FnSUNBZ2ZWeHVYRzRnSUNBZ0lDQXZLbHh1SUNBZ0lDQWdJQ29nYVdZZ2RHaGxJR0Z3Y0NCcGN5QmpiMjVtYVdkMWNtRjBaV1FnZEc4Z2RYTmxJR2hoYzJnZ2RISmhZMnRwYm1kY2JpQWdJQ0FnSUNBcUlIZGxJR0ZrWkNCMGFHVWdjR0ZuWlNCa2VXNWhiV2xqWVd4c2VTQnBiaUIwYUdVZ2RYSnNYRzRnSUNBZ0lDQWdLaTljYmlBZ0lDQWdJR2xtSUNoMGFHbHpMbTl3ZEdsdmJuTXVkWE5sU0dGemFDa2dlMXh1SUNBZ0lDQWdJQ0IwYUdsekxuTmxkRWhoYzJnb2NHRm5aVTVoYldVcFhHNGdJQ0FnSUNCOVhHNWNiaUFnSUNBZ0lIUm9hWE11YzJodmQxQmhaMlVvWm05eVkyVkVaV1poZFd4MFVHRm5aU0EvSUhSb2FYTXViM0IwYVc5dWN5NWtaV1poZFd4MFVHRm5aU0E2SUhCaFoyVk9ZVzFsS1Z4dUlDQWdJSDFjYmx4dUlDQWdJQzh2SUhOMFlYUnBZMXh1SUNBZ0lITjBZWFJwWXlCZlJFOU5TVzUwWlhKbVlXTmxLRzl3ZEdsdmJuTXBJSHRjYmlBZ0lDQWdJSEpsZEhWeWJpQnVaWGNnVUdGblpYSW9iM0IwYVc5dWN5bGNiaUFnSUNCOVhHNGdJSDFjYmx4dUlDQnlaWFIxY200Z1VHRm5aWEpjYm4wcEtDbGNibHh1Wlhod2IzSjBJR1JsWm1GMWJIUWdVR0ZuWlhKY2JpSXNJaThxS2x4dUlDb2dMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzFjYmlBcUlFeHBZMlZ1YzJWa0lIVnVaR1Z5SUUxSlZDQW9hSFIwY0hNNkx5OW5hWFJvZFdJdVkyOXRMM0YxWVhKckxXUmxkaTlRYUc5dWIyNHRSbkpoYldWM2IzSnJMMkpzYjJJdmJXRnpkR1Z5TDB4SlEwVk9VMFVwWEc0Z0tpQXRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMVnh1SUNvdlhHNWNibWx0Y0c5eWRDQjdJR3h2WVdSR2FXeGxJSDBnWm5KdmJTQW5MaTR2TGk0dlkyOXRiVzl1TDNWMGFXeHpKMXh1YVcxd2IzSjBJSHNnWkdsemNHRjBZMmhRWVdkbFJYWmxiblFnZlNCbWNtOXRJQ2N1TGk4dUxpOWpiMjF0YjI0dlpYWmxiblJ6TDJScGMzQmhkR05vSjF4dVhHNWpiMjV6ZENCUVlXZGxJRDBnS0NncElEMCtJSHRjYmlBZ0x5b3FYRzRnSUNBcUlDMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExWeHVJQ0FnS2lCRGIyNXpkR0Z1ZEhOY2JpQWdJQ29nTFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0WEc0Z0lDQXFMMXh1WEc0Z0lHTnZibk4wSUU1QlRVVWdQU0FuY0dGblpTZGNiaUFnWTI5dWMzUWdWa1ZTVTBsUFRpQTlJQ2N5TGpBdU1DZGNibHh1SUNCamIyNXpkQ0JVUlUxUVRFRlVSVjlUUlV4RlExUlBVaUE5SUNkYlpHRjBZUzEwWlcxd2JHRjBaVjBuWEc1Y2JpQWdMeW9xWEc0Z0lDQXFJQzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMVnh1SUNBZ0tpQkRiR0Z6Y3lCRVpXWnBibWwwYVc5dVhHNGdJQ0FxSUMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFZ4dUlDQWdLaTljYmx4dUlDQmpiR0Z6Y3lCUVlXZGxJSHRjYmlBZ0lDQXZLaXBjYmlBZ0lDQWdLaUJEY21WaGRHVnpJR0Z1SUdsdWMzUmhibU5sSUc5bUlGQmhaMlV1WEc0Z0lDQWdJQ29nUUhCaGNtRnRJSHR6ZEhKcGJtZDlJSEJoWjJWT1lXMWxYRzRnSUNBZ0lDb3ZYRzRnSUNBZ1kyOXVjM1J5ZFdOMGIzSW9jR0ZuWlU1aGJXVXBJSHRjYmlBZ0lDQWdJSFJvYVhNdWJtRnRaU0E5SUhCaFoyVk9ZVzFsWEc0Z0lDQWdJQ0IwYUdsekxtVjJaVzUwY3lBOUlGdGRYRzRnSUNBZ0lDQjBhR2x6TG5SbGJYQnNZWFJsVUdGMGFDQTlJRzUxYkd4Y2JpQWdJQ0FnSUhSb2FYTXVjbVZ1WkdWeVJuVnVZM1JwYjI0Z1BTQnVkV3hzWEc0Z0lDQWdmVnh1WEc0Z0lDQWdMeThnWjJWMGRHVnljMXh1WEc0Z0lDQWdjM1JoZEdsaklHZGxkQ0IyWlhKemFXOXVLQ2tnZTF4dUlDQWdJQ0FnY21WMGRYSnVJR0FrZTA1QlRVVjlMaVI3VmtWU1UwbFBUbjFnWEc0Z0lDQWdmVnh1WEc0Z0lDQWdMeW9xWEc0Z0lDQWdJQ29nUjJWMElHVjJaVzUwYzF4dUlDQWdJQ0FxSUVCeVpYUjFjbTV6SUh0R2RXNWpkR2x2Ymx0ZGZWeHVJQ0FnSUNBcUwxeHVJQ0FnSUdkbGRFVjJaVzUwY3lncElIdGNiaUFnSUNBZ0lISmxkSFZ5YmlCMGFHbHpMbVYyWlc1MGMxeHVJQ0FnSUgxY2JseHVJQ0FnSUM4cUtseHVJQ0FnSUNBcUlFZGxkQ0IwWlcxd2JHRjBaVnh1SUNBZ0lDQXFJRUJ5WlhSMWNtNXpJSHR6ZEhKcGJtZDlYRzRnSUNBZ0lDb3ZYRzRnSUNBZ1oyVjBWR1Z0Y0d4aGRHVW9LU0I3WEc0Z0lDQWdJQ0J5WlhSMWNtNGdkR2hwY3k1MFpXMXdiR0YwWlZCaGRHaGNiaUFnSUNCOVhHNWNiaUFnSUNBdktpcGNiaUFnSUNBZ0tpQkhaWFFnY21WdVpHVnlJR1oxYm1OMGFXOXVYRzRnSUNBZ0lDb2dRSEpsZEhWeWJuTWdlMFoxYm1OMGFXOXVmVnh1SUNBZ0lDQXFMMXh1SUNBZ0lHZGxkRkpsYm1SbGNrWjFibU4wYVc5dUtDa2dlMXh1SUNBZ0lDQWdjbVYwZFhKdUlIUm9hWE11Y21WdVpHVnlSblZ1WTNScGIyNWNiaUFnSUNCOVhHNWNiaUFnSUNCc2IyRmtWR1Z0Y0d4aGRHVW9LU0I3WEc0Z0lDQWdJQ0JqYjI1emRDQndZV2RsUld4bGJXVnVkQ0E5SUdSdlkzVnRaVzUwTG5GMVpYSjVVMlZzWldOMGIzSW9ZRnRrWVhSaExYQmhaMlU5WENJa2UzUm9hWE11Ym1GdFpYMWNJbDFnS1Z4dVhHNGdJQ0FnSUNCc2IyRmtSbWxzWlNoMGFHbHpMbWRsZEZSbGJYQnNZWFJsS0Nrc0lDaDBaVzF3YkdGMFpTa2dQVDRnZTF4dUlDQWdJQ0FnSUNCc1pYUWdjbVZ1WkdWeUlEMGdablZ1WTNScGIyNGdLRVJQVFZCaFoyVXNJSFJsYlhCc1lYUmxMQ0JsYkdWdFpXNTBjeWtnZTF4dUlDQWdJQ0FnSUNBZ0lHbG1JQ2hsYkdWdFpXNTBjeWtnZTF4dUlDQWdJQ0FnSUNBZ0lDQWdRWEp5WVhrdVpuSnZiU2hsYkdWdFpXNTBjeWt1Wm05eVJXRmphQ2dvWld3cElEMCtJSHRjYmlBZ0lDQWdJQ0FnSUNBZ0lDQWdaV3d1YVc1dVpYSklWRTFNSUQwZ2RHVnRjR3hoZEdWY2JpQWdJQ0FnSUNBZ0lDQWdJSDBwWEc0Z0lDQWdJQ0FnSUNBZ2ZTQmxiSE5sSUh0Y2JpQWdJQ0FnSUNBZ0lDQWdJRVJQVFZCaFoyVXVhVzV1WlhKSVZFMU1JRDBnZEdWdGNHeGhkR1ZjYmlBZ0lDQWdJQ0FnSUNCOVhHNGdJQ0FnSUNBZ0lIMWNibHh1SUNBZ0lDQWdJQ0JwWmlBb2RHaHBjeTVuWlhSU1pXNWtaWEpHZFc1amRHbHZiaWdwS1NCN1hHNGdJQ0FnSUNBZ0lDQWdjbVZ1WkdWeUlEMGdkR2hwY3k1blpYUlNaVzVrWlhKR2RXNWpkR2x2YmlncFhHNGdJQ0FnSUNBZ0lIMWNibHh1SUNBZ0lDQWdJQ0J5Wlc1a1pYSW9jR0ZuWlVWc1pXMWxiblFzSUhSbGJYQnNZWFJsTENCd1lXZGxSV3hsYldWdWRDNXhkV1Z5ZVZObGJHVmpkRzl5UVd4c0tGUkZUVkJNUVZSRlgxTkZURVZEVkU5U0tTbGNiaUFnSUNBZ0lIMHNJRzUxYkd3cFhHNGdJQ0FnZlZ4dVhHNGdJQ0FnTHk4Z2NIVmliR2xqWEc1Y2JpQWdJQ0F2S2lwY2JpQWdJQ0FnS2x4dUlDQWdJQ0FxSUVCd1lYSmhiU0I3S24wZ1kyRnNiR0poWTJ0R2JseHVJQ0FnSUNBcUwxeHVJQ0FnSUdGa1pFVjJaVzUwUTJGc2JHSmhZMnNvWTJGc2JHSmhZMnRHYmlrZ2UxeHVJQ0FnSUNBZ2RHaHBjeTVsZG1WdWRITXVjSFZ6YUNoallXeHNZbUZqYTBadUtWeHVJQ0FnSUgxY2JseHVJQ0FnSUM4cUtseHVJQ0FnSUNBcUlGVnpaU0IwYUdVZ1oybDJaVzRnZEdWdGNHeGhkR1ZjYmlBZ0lDQWdLbHh1SUNBZ0lDQXFJRUJ3WVhKaGJTQjdjM1J5YVc1bmZTQjBaVzF3YkdGMFpWQmhkR2hjYmlBZ0lDQWdLaTljYmlBZ0lDQjFjMlZVWlcxd2JHRjBaU2gwWlcxd2JHRjBaVkJoZEdncElIdGNiaUFnSUNBZ0lHbG1JQ2gwZVhCbGIyWWdkR1Z0Y0d4aGRHVlFZWFJvSUNFOVBTQW5jM1J5YVc1bkp5a2dlMXh1SUNBZ0lDQWdJQ0IwYUhKdmR5QnVaWGNnUlhKeWIzSW9KMVJvWlNCMFpXMXdiR0YwWlNCd1lYUm9JRzExYzNRZ1ltVWdZU0J6ZEhKcGJtY3VJQ2NnS3lCMGVYQmxiMllnZEdWdGNHeGhkR1ZRWVhSb0lDc2dKeUJwY3lCbmFYWmxiaWNwWEc0Z0lDQWdJQ0I5WEc0Z0lDQWdJQ0IwYUdsekxuUmxiWEJzWVhSbFVHRjBhQ0E5SUhSbGJYQnNZWFJsVUdGMGFGeHVJQ0FnSUgxY2JseHVJQ0FnSUM4cUtseHVJQ0FnSUNBcUlGVnpaU0IwYUdVZ1oybDJaVzRnZEdWdGNHeGhkR1VnY21WdVpHVnlaWEpjYmlBZ0lDQWdLaUJBY0dGeVlXMGdlMFoxYm1OMGFXOXVmU0J5Wlc1a1pYSkdkVzVqZEdsdmJseHVJQ0FnSUNBcUwxeHVJQ0FnSUhWelpWUmxiWEJzWVhSbFVtVnVaR1Z5WlhJb2NtVnVaR1Z5Um5WdVkzUnBiMjRwSUh0Y2JpQWdJQ0FnSUdsbUlDaDBlWEJsYjJZZ2NtVnVaR1Z5Um5WdVkzUnBiMjRnSVQwOUlDZG1kVzVqZEdsdmJpY3BJSHRjYmlBZ0lDQWdJQ0FnZEdoeWIzY2dibVYzSUVWeWNtOXlLQ2RVYUdVZ1kzVnpkRzl0SUhSbGJYQnNZWFJsSUhKbGJtUmxjbVZ5SUcxMWMzUWdZbVVnWVNCbWRXNWpkR2x2Ymk0Z0p5QXJJSFI1Y0dWdlppQnlaVzVrWlhKR2RXNWpkR2x2YmlBcklDY2dhWE1nWjJsMlpXNG5LVnh1SUNBZ0lDQWdmVnh1SUNBZ0lDQWdkR2hwY3k1eVpXNWtaWEpHZFc1amRHbHZiaUE5SUhKbGJtUmxja1oxYm1OMGFXOXVYRzRnSUNBZ2ZWeHVYRzRnSUNBZ0x5b3FYRzRnSUNBZ0lDb2dWSEpwWjJkbGNpQnpZMjl3WlhOY2JpQWdJQ0FnS2lCQWNHRnlZVzBnZTNOMGNtbHVaMzBnWlhabGJuUk9ZVzFsWEc0Z0lDQWdJQ29nUUhCaGNtRnRJSHQ3ZlgwZ1cyVjJaVzUwVUdGeVlXMXpQWHQ5WFZ4dUlDQWdJQ0FxTDF4dUlDQWdJSFJ5YVdkblpYSlRZMjl3WlhNb1pYWmxiblJPWVcxbExDQmxkbVZ1ZEZCaGNtRnRjeUE5SUh0OUtTQjdYRzRnSUNBZ0lDQmpiMjV6ZENCbGRtVnVkRTVoYldWQmJHbGhjeUE5SUdCdmJpUjdaWFpsYm5ST1lXMWxMbU5vWVhKQmRDZ3dLUzUwYjFWd2NHVnlRMkZ6WlNncGZTUjdaWFpsYm5ST1lXMWxMbk5zYVdObEtERXBmV0JjYmx4dUlDQWdJQ0FnZEdocGN5NWxkbVZ1ZEhNdVptOXlSV0ZqYUNnb2MyTnZjR1VwSUQwK0lIdGNiaUFnSUNBZ0lDQWdZMjl1YzNRZ2MyTnZjR1ZGZG1WdWRDQTlJSE5qYjNCbFcyVjJaVzUwVG1GdFpWMWNiaUFnSUNBZ0lDQWdZMjl1YzNRZ2MyTnZjR1ZGZG1WdWRFRnNhV0Z6SUQwZ2MyTnZjR1ZiWlhabGJuUk9ZVzFsUVd4cFlYTmRYRzRnSUNBZ0lDQWdJR2xtSUNoMGVYQmxiMllnYzJOdmNHVkZkbVZ1ZENBOVBUMGdKMloxYm1OMGFXOXVKeWtnZTF4dUlDQWdJQ0FnSUNBZ0lITmpiM0JsUlhabGJuUXVZWEJ3Ykhrb2RHaHBjeXdnWlhabGJuUlFZWEpoYlhNcFhHNGdJQ0FnSUNBZ0lIMWNibHh1SUNBZ0lDQWdJQ0F2THlCMGNtbG5aMlZ5SUhSb1pTQmxkbVZ1ZENCaGJHbGhjMXh1SUNBZ0lDQWdJQ0JwWmlBb2RIbHdaVzltSUhOamIzQmxSWFpsYm5SQmJHbGhjeUE5UFQwZ0oyWjFibU4wYVc5dUp5a2dlMXh1SUNBZ0lDQWdJQ0FnSUhOamIzQmxSWFpsYm5SQmJHbGhjeTVoY0hCc2VTaDBhR2x6TENCbGRtVnVkRkJoY21GdGN5bGNiaUFnSUNBZ0lDQWdmVnh1SUNBZ0lDQWdmU2xjYmx4dUlDQWdJQ0FnWkdsemNHRjBZMmhRWVdkbFJYWmxiblFvWlhabGJuUk9ZVzFsTENCMGFHbHpMbTVoYldVc0lHVjJaVzUwVUdGeVlXMXpLVnh1SUNBZ0lIMWNiaUFnZlZ4dVhHNGdJSEpsZEhWeWJpQlFZV2RsWEc1OUtTZ3BYRzVjYm1WNGNHOXlkQ0JrWldaaGRXeDBJRkJoWjJWY2JpSXNJaThxS2x4dUlDb2dMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzFjYmlBcUlFeHBZMlZ1YzJWa0lIVnVaR1Z5SUUxSlZDQW9hSFIwY0hNNkx5OW5hWFJvZFdJdVkyOXRMM0YxWVhKckxXUmxkaTlRYUc5dWIyNHRSbkpoYldWM2IzSnJMMkpzYjJJdmJXRnpkR1Z5TDB4SlEwVk9VMFVwWEc0Z0tpQXRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMVnh1SUNvdlhHNWNibWx0Y0c5eWRDQlFZV2RsY2lCbWNtOXRJQ2N1TDJoNVluSnBaQzFoY0hCekwzQmhaMlZ5TDJsdVpHVjRKMXh1YVcxd2IzSjBJRWx1ZEd3Z1puSnZiU0FuTGk5b2VXSnlhV1F0WVhCd2N5OXBiblJzSjF4dWFXMXdiM0owSUU1bGRIZHZjbXNnWm5KdmJTQW5MaTlqYjIxdGIyNHZibVYwZDI5eWF5ZGNibHh1THk4Z1kyOXRjRzl1Wlc1MGMxeHVhVzF3YjNKMElFUnBZV3h2WnlCbWNtOXRJQ2N1TDJOdmJYQnZibVZ1ZEhNdlpHbGhiRzluSjF4dWFXMXdiM0owSUZCeWIyMXdkQ0JtY205dElDY3VMMk52YlhCdmJtVnVkSE12WkdsaGJHOW5MM0J5YjIxd2RDZGNibWx0Y0c5eWRDQk9iM1JwWm1sallYUnBiMjRnWm5KdmJTQW5MaTlqYjIxd2IyNWxiblJ6TDI1dmRHbG1hV05oZEdsdmJpZGNibWx0Y0c5eWRDQkRiMnhzWVhCelpTQm1jbTl0SUNjdUwyTnZiWEJ2Ym1WdWRITXZZMjlzYkdGd2MyVW5YRzVwYlhCdmNuUWdRV05qYjNKa2FXOXVJR1p5YjIwZ0p5NHZZMjl0Y0c5dVpXNTBjeTloWTJOdmNtUnBiMjRuWEc1cGJYQnZjblFnVkdGaUlHWnliMjBnSnk0dlkyOXRjRzl1Wlc1MGN5OTBZV0luWEc1cGJYQnZjblFnVUhKdlozSmxjM01nWm5KdmJTQW5MaTlqYjIxd2IyNWxiblJ6TDNCeWIyZHlaWE56SjF4dWFXMXdiM0owSUV4dllXUmxjaUJtY205dElDY3VMMk52YlhCdmJtVnVkSE12Ykc5aFpHVnlKMXh1YVcxd2IzSjBJRTltWmtOaGJuWmhjeUJtY205dElDY3VMMk52YlhCdmJtVnVkSE12YjJabUxXTmhiblpoY3lkY2JtbHRjRzl5ZENCRWNtOXdaRzkzYmlCbWNtOXRJQ2N1TDJOdmJYQnZibVZ1ZEhNdlpISnZjR1J2ZDI0blhHNXBiWEJ2Y25RZ1JISnZjR1J2ZDI1VFpXRnlZMmdnWm5KdmJTQW5MaTlqYjIxd2IyNWxiblJ6TDJSeWIzQmtiM2R1TDNObFlYSmphQ2RjYmx4dVkyOXVjM1FnWVhCcElEMGdlMzFjYmx4dUx5b3FYRzRnS2lBdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMxY2JpQXFJRU52Ym1acFozVnlZWFJwYjI1Y2JpQXFJQzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMVnh1SUNvdlhHNWhjR2t1WTI5dVptbG5JRDBnZTF4dUlDQXZMeUJuYkc5aVlXd2dZMjl1Wm1sblhHNGdJR1JsWW5Wbk9pQjBjblZsTEZ4dWZWeHVYRzR2S2lwY2JpQXFJQzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMVnh1SUNvZ1VHRm5aWEpjYmlBcUlDMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExWeHVJQ292WEc1aGNHa3VjR0ZuWlhJZ1BTQW9iM0IwYVc5dWN5a2dQVDRnZTF4dUlDQnBaaUFvZEhsd1pXOW1JR0Z3YVM1ZmNHRm5aWElnUFQwOUlDZDFibVJsWm1sdVpXUW5LU0I3WEc0Z0lDQWdZWEJwTGw5d1lXZGxjaUE5SUZCaFoyVnlMbDlFVDAxSmJuUmxjbVpoWTJVb2IzQjBhVzl1Y3lsY2JpQWdmVnh1SUNCeVpYUjFjbTRnWVhCcExsOXdZV2RsY2x4dWZWeHVYRzR2S2lwY2JpQXFJQzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMVnh1SUNvZ1NXNTBiRnh1SUNvZ0xTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdFhHNGdLaTljYm1Gd2FTNXBiblJzSUQwZ1NXNTBiQzVmUkU5TlNXNTBaWEptWVdObFhHNWNiaThxS2x4dUlDb2dMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRYRzRnS2lCT1pYUjNiM0pyWEc0Z0tpQXRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMWNiaUFxTDF4dVlYQnBMbTVsZEhkdmNtc2dQU0JPWlhSM2IzSnJMbDlFVDAxSmJuUmxjbVpoWTJWY2JseHVMeW9xWEc0Z0tpQXRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMWNiaUFxSUU1dmRHbG1hV05oZEdsdmJseHVJQ29nTFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0WEc0Z0tpOWNibUZ3YVM1dWIzUnBabWxqWVhScGIyNGdQU0JPYjNScFptbGpZWFJwYjI0dVgwUlBUVWx1ZEdWeVptRmpaVnh1WEc0dktpcGNiaUFxSUMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFZ4dUlDb2dSR2xoYkc5blhHNGdLaUF0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzFjYmlBcUwxeHVZWEJwTG1ScFlXeHZaeUE5SUVScFlXeHZaeTVmUkU5TlNXNTBaWEptWVdObFhHNWNibk5sZEZScGJXVnZkWFFvS0NrZ1BUNGdlMXh1SUNCUWNtOXRjSFF1WDBSUFRVbHVkR1Z5Wm1GalpTaDdYRzRnSUNBZ1pXeGxiV1Z1ZERvZ2JuVnNiQ3hjYmlBZ0lDQjBhWFJzWlRvZ0owaEZURXhQVnljc1hHNGdJQ0FnYldWemMyRm5aVG9nYm5Wc2JDeGNiaUFnSUNCallXNWpaV3hoWW14bE9pQjBjblZsTEZ4dUlDQjlLUzV6YUc5M0tDbGNibjBzSURFd01EQXBYRzVjYmk4cUtseHVJQ29nTFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0WEc0Z0tpQkRiMnhzWVhCelpWeHVJQ29nTFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0WEc0Z0tpOWNibUZ3YVM1amIyeHNZWEJ6WlNBOUlFTnZiR3hoY0hObExsOUVUMDFKYm5SbGNtWmhZMlZjYmx4dUx5b3FYRzRnS2lBdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMxY2JpQXFJRUZqWTI5eVpHbHZibHh1SUNvZ0xTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdFhHNGdLaTljYm1Gd2FTNWhZMk52Y21ScGIyNGdQU0JCWTJOdmNtUnBiMjR1WDBSUFRVbHVkR1Z5Wm1GalpWeHVYRzVjYmk4cUtseHVJQ29nTFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0WEc0Z0tpQlVZV0pjYmlBcUlDMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExWeHVJQ292WEc1aGNHa3VkR0ZpSUQwZ1ZHRmlMbDlFVDAxSmJuUmxjbVpoWTJWY2JseHVMeW9xWEc0Z0tpQXRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMWNiaUFxSUZCeWIyZHlaWE56WEc0Z0tpQXRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMWNiaUFxTDF4dVlYQnBMbkJ5YjJkeVpYTnpJRDBnVUhKdlozSmxjM011WDBSUFRVbHVkR1Z5Wm1GalpWeHVYRzR2S2lwY2JpQXFJQzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMVnh1SUNvZ1RHOWhaR1Z5WEc0Z0tpQXRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMWNiaUFxTDF4dVlYQnBMbXh2WVdSbGNpQTlJRXh2WVdSbGNpNWZSRTlOU1c1MFpYSm1ZV05sWEc1Y2JpOHFLbHh1SUNvZ0xTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdFhHNGdLaUJQWm1ZZ1kyRnVkbUZ6WEc0Z0tpQXRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMWNiaUFxTDF4dVlYQnBMbTltWmtOaGJuWmhjeUE5SUU5bVprTmhiblpoY3k1ZlJFOU5TVzUwWlhKbVlXTmxYRzVjYmk4cUtseHVJQ29nTFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0WEc0Z0tpQkVjbTl3Wkc5M2JseHVJQ29nTFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0WEc0Z0tpOWNibUZ3YVM1a2NtOXdaRzkzYmlBOUlDaHZjSFJwYjI1ektTQTlQaUI3WEc0Z0lHbG1JQ2h2Y0hScGIyNXpMbk5sWVhKamFDa2dlMXh1SUNBZ0lDOHZJR2RsYm1WeWFXTWdaSEp2Y0dSdmQyNWNiaUFnSUNCeVpYUjFjbTRnUkhKdmNHUnZkMjR1WDBSUFRVbHVkR1Z5Wm1GalpWeHVJQ0I5SUdWc2MyVWdlMXh1SUNBZ0lDOHZJSE5sWVhKamFDQmtjbTl3Wkc5M2JseHVJQ0FnSUhKbGRIVnliaUJFY205d1pHOTNibE5sWVhKamFDNWZSRTlOU1c1MFpYSm1ZV05sWEc0Z0lIMWNibjFjYmx4dUx5OGdUV0ZyWlNCMGFHVWdRVkJKSUd4cGRtVmNibmRwYm1SdmR5NXdhRzl1YjI0Z1BTQmhjR2xjYmx4dVpYaHdiM0owSUdSbFptRjFiSFFnWVhCcFhHNGlYWDA9In0=
