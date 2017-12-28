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

},{}],4:[function(require,module,exports){
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

},{"../../common/utils":3,"../collapse":5,"../component":6,"../componentManager":7}],5:[function(require,module,exports){
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

},{"../../common/events":2,"../../common/utils":3,"../component":6,"../componentManager":7}],6:[function(require,module,exports){
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

},{"../common/events":2,"../common/events/dispatch":1,"../common/utils":3,"./componentManager":7}],7:[function(require,module,exports){
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

},{}],8:[function(require,module,exports){
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

},{"../../common/events":2,"../component":6,"../componentManager":7}],9:[function(require,module,exports){
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

},{"../../common/utils":3,"../componentManager":7,"./index":8}],10:[function(require,module,exports){
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

},{"../../common/events":2,"../../common/utils":3,"../component":6,"../componentManager":7}],11:[function(require,module,exports){
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

},{"../../common/utils":3,"../componentManager":7,"./index":10}],12:[function(require,module,exports){
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

},{"../component":6}],13:[function(require,module,exports){
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

},{"../../common/events":2,"../component":6}],14:[function(require,module,exports){
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

},{"../../common/events":2,"../../common/utils":3,"../component":6,"../componentManager":7}],15:[function(require,module,exports){
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

},{"../../common/events":2,"../component":6}],16:[function(require,module,exports){
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

},{"../../common/events":2,"../../common/utils":3,"../component":6,"../componentManager":7}],17:[function(require,module,exports){
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

},{}],18:[function(require,module,exports){
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

},{"./binder":17}],19:[function(require,module,exports){
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

},{"../../common/events":2,"./page":20}],20:[function(require,module,exports){
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

},{"../../common/events/dispatch":1,"../../common/utils":3}],21:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _index = require('./hybrid-apps/pager/index');

var _index2 = _interopRequireDefault(_index);

var _intl = require('./hybrid-apps/intl');

var _intl2 = _interopRequireDefault(_intl);

var _network = require('./utilities/network');

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

},{"./components/accordion":4,"./components/collapse":5,"./components/dialog":8,"./components/dialog/prompt":9,"./components/dropdown":10,"./components/dropdown/search":11,"./components/loader":12,"./components/notification":13,"./components/off-canvas":14,"./components/progress":15,"./components/tab":16,"./hybrid-apps/intl":18,"./hybrid-apps/pager/index":19,"./utilities/network":22}],22:[function(require,module,exports){
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

},{"../../common/events":2,"../../components/component":6}]},{},[21])

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvanMvY29tbW9uL2V2ZW50cy9kaXNwYXRjaC5qcyIsInNyYy9qcy9jb21tb24vZXZlbnRzL2luZGV4LmpzIiwic3JjL2pzL2NvbW1vbi91dGlscy9pbmRleC5qcyIsInNyYy9qcy9jb21wb25lbnRzL2FjY29yZGlvbi9pbmRleC5qcyIsInNyYy9qcy9jb21wb25lbnRzL2NvbGxhcHNlL2luZGV4LmpzIiwic3JjL2pzL2NvbXBvbmVudHMvY29tcG9uZW50LmpzIiwic3JjL2pzL2NvbXBvbmVudHMvY29tcG9uZW50TWFuYWdlci5qcyIsInNyYy9qcy9jb21wb25lbnRzL2RpYWxvZy9pbmRleC5qcyIsInNyYy9qcy9jb21wb25lbnRzL2RpYWxvZy9wcm9tcHQuanMiLCJzcmMvanMvY29tcG9uZW50cy9kcm9wZG93bi9pbmRleC5qcyIsInNyYy9qcy9jb21wb25lbnRzL2Ryb3Bkb3duL3NlYXJjaC5qcyIsInNyYy9qcy9jb21wb25lbnRzL2xvYWRlci9pbmRleC5qcyIsInNyYy9qcy9jb21wb25lbnRzL25vdGlmaWNhdGlvbi9pbmRleC5qcyIsInNyYy9qcy9jb21wb25lbnRzL29mZi1jYW52YXMvaW5kZXguanMiLCJzcmMvanMvY29tcG9uZW50cy9wcm9ncmVzcy9pbmRleC5qcyIsInNyYy9qcy9jb21wb25lbnRzL3RhYi9pbmRleC5qcyIsInNyYy9qcy9oeWJyaWQtYXBwcy9pbnRsL2JpbmRlci5qcyIsInNyYy9qcy9oeWJyaWQtYXBwcy9pbnRsL2luZGV4LmpzIiwic3JjL2pzL2h5YnJpZC1hcHBzL3BhZ2VyL2luZGV4LmpzIiwic3JjL2pzL2h5YnJpZC1hcHBzL3BhZ2VyL3BhZ2UuanMiLCJzcmMvanMvaW5kZXguanMiLCJzcmMvanMvdXRpbGl0aWVzL25ldHdvcmsvaW5kZXguanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7OztRQ0FnQixtQixHQUFBLG1CO1FBTUEsb0IsR0FBQSxvQjtRQUtBLGlCLEdBQUEsaUI7QUFYVCxTQUFTLG1CQUFULENBQTZCLFNBQTdCLEVBQXdDLFVBQXhDLEVBQWlFO0FBQUEsTUFBYixNQUFhLHVFQUFKLEVBQUk7O0FBQ3RFLE1BQU0sZ0JBQW1CLFNBQW5CLFlBQW1DLFVBQXpDO0FBQ0EsU0FBTyxhQUFQLENBQXFCLElBQUksV0FBSixDQUFnQixhQUFoQixFQUErQixFQUFFLGNBQUYsRUFBL0IsQ0FBckI7QUFDQSxXQUFTLGFBQVQsQ0FBdUIsSUFBSSxXQUFKLENBQWdCLGFBQWhCLEVBQStCLEVBQUUsY0FBRixFQUEvQixDQUF2QjtBQUNEOztBQUVNLFNBQVMsb0JBQVQsQ0FBOEIsVUFBOUIsRUFBMEMsU0FBMUMsRUFBcUQsVUFBckQsRUFBOEU7QUFBQSxNQUFiLE1BQWEsdUVBQUosRUFBSTs7QUFDbkYsTUFBTSxnQkFBbUIsU0FBbkIsWUFBbUMsVUFBekM7QUFDQSxhQUFXLGFBQVgsQ0FBeUIsSUFBSSxXQUFKLENBQWdCLGFBQWhCLEVBQStCLEVBQUUsY0FBRixFQUEvQixDQUF6QjtBQUNEOztBQUVNLFNBQVMsaUJBQVQsQ0FBMkIsU0FBM0IsRUFBc0MsUUFBdEMsRUFBNkQ7QUFBQSxNQUFiLE1BQWEsdUVBQUosRUFBSTs7QUFDbEUsTUFBTSxnQkFBbUIsUUFBbkIsU0FBK0IsU0FBckM7QUFDQSxTQUFPLGFBQVAsQ0FBcUIsSUFBSSxXQUFKLENBQWdCLGFBQWhCLEVBQStCLEVBQUUsY0FBRixFQUEvQixDQUFyQjtBQUNBLFdBQVMsYUFBVCxDQUF1QixJQUFJLFdBQUosQ0FBZ0IsYUFBaEIsRUFBK0IsRUFBRSxjQUFGLEVBQS9CLENBQXZCO0FBQ0Q7Ozs7Ozs7O0FDZkQ7QUFDQSxJQUFJLE9BQU8sTUFBUCxLQUFrQixXQUF0QixFQUFtQztBQUNqQyxTQUFPLGdCQUFQLENBQXdCLE9BQXhCLEVBQWlDLFlBQU07QUFDckMsWUFBUSxLQUFSLENBQWMsdUdBQWQ7QUFDRCxHQUZEO0FBR0Q7O0FBRUQ7QUFDQSxJQUFJLGtCQUFrQixDQUFDLFdBQUQsRUFBYyxXQUFkLEVBQTJCLFNBQTNCLENBQXRCO0FBQ0EsSUFBSSxjQUFjLEtBQWxCOztBQUVBLElBQUksT0FBTyxNQUFQLEtBQWtCLFdBQXRCLEVBQW1DO0FBQ2pDLE1BQUssa0JBQWtCLE1BQW5CLElBQThCLE9BQU8sYUFBUCxJQUF3QixvQkFBb0IsYUFBOUUsRUFBNkY7QUFDM0Ysa0JBQWMsSUFBZDtBQUNBLHNCQUFrQixDQUFDLFlBQUQsRUFBZSxXQUFmLEVBQTRCLFVBQTVCLEVBQXdDLGFBQXhDLENBQWxCO0FBQ0Q7O0FBRUQsTUFBSSxPQUFPLFNBQVAsQ0FBaUIsY0FBckIsRUFBcUM7QUFDbkMsc0JBQWtCLENBQUMsYUFBRCxFQUFnQixhQUFoQixFQUErQixXQUEvQixFQUE0QyxlQUE1QyxDQUFsQjtBQUNELEdBRkQsTUFFTyxJQUFJLE9BQU8sU0FBUCxDQUFpQixnQkFBckIsRUFBdUM7QUFDNUMsc0JBQWtCLENBQUMsZUFBRCxFQUFrQixlQUFsQixFQUFtQyxhQUFuQyxFQUFrRCxpQkFBbEQsQ0FBbEI7QUFDRDtBQUNGOztBQUVELElBQU0sS0FBSyxTQUFTLGFBQVQsQ0FBdUIsS0FBdkIsQ0FBWDtBQUNBLElBQU0sY0FBYyxDQUNsQixFQUFFLE1BQU0sWUFBUixFQUFzQixPQUFPLGlCQUE3QixFQUFnRCxLQUFLLGVBQXJELEVBRGtCLEVBRWxCLEVBQUUsTUFBTSxlQUFSLEVBQXlCLE9BQU8saUJBQWhDLEVBQW1ELEtBQUssZUFBeEQsRUFGa0IsRUFHbEIsRUFBRSxNQUFNLGNBQVIsRUFBd0IsT0FBTyxtQkFBL0IsRUFBb0QsS0FBSyxpQkFBekQsRUFIa0IsRUFJbEIsRUFBRSxNQUFNLGtCQUFSLEVBQTRCLE9BQU8sdUJBQW5DLEVBQTRELEtBQUsscUJBQWpFLEVBSmtCLENBQXBCO0FBTUEsSUFBTSxhQUFhLENBQ2pCLEVBQUUsTUFBTSxXQUFSLEVBQXFCLE9BQU8sZ0JBQTVCLEVBQThDLEtBQUssY0FBbkQsRUFEaUIsRUFFakIsRUFBRSxNQUFNLGNBQVIsRUFBd0IsT0FBTyxnQkFBL0IsRUFBaUQsS0FBSyxjQUF0RCxFQUZpQixFQUdqQixFQUFFLE1BQU0sYUFBUixFQUF1QixPQUFPLGtCQUE5QixFQUFrRCxLQUFLLGdCQUF2RCxFQUhpQixFQUlqQixFQUFFLE1BQU0saUJBQVIsRUFBMkIsT0FBTyxzQkFBbEMsRUFBMEQsS0FBSyxvQkFBL0QsRUFKaUIsQ0FBbkI7O0FBT0EsSUFBTSxrQkFBa0IsWUFBWSxJQUFaLENBQWlCO0FBQUEsU0FBSyxHQUFHLEtBQUgsQ0FBUyxFQUFFLElBQVgsTUFBcUIsU0FBMUI7QUFBQSxDQUFqQixFQUFzRCxLQUE5RTtBQUNBLElBQU0sZ0JBQWdCLFlBQVksSUFBWixDQUFpQjtBQUFBLFNBQUssR0FBRyxLQUFILENBQVMsRUFBRSxJQUFYLE1BQXFCLFNBQTFCO0FBQUEsQ0FBakIsRUFBc0QsR0FBNUU7QUFDQSxJQUFNLGlCQUFpQixXQUFXLElBQVgsQ0FBZ0I7QUFBQSxTQUFLLEdBQUcsS0FBSCxDQUFTLEVBQUUsSUFBWCxNQUFxQixTQUExQjtBQUFBLENBQWhCLEVBQXFELEtBQTVFO0FBQ0EsSUFBTSxlQUFlLFdBQVcsSUFBWCxDQUFnQjtBQUFBLFNBQUssR0FBRyxLQUFILENBQVMsRUFBRSxJQUFYLE1BQXFCLFNBQTFCO0FBQUEsQ0FBaEIsRUFBcUQsR0FBMUU7O2tCQUVlO0FBQ2I7QUFDQSxnQkFBYyxXQUZEOztBQUliO0FBQ0Esa0JBQWdCLFFBTEg7QUFNYixtQkFBaUIsU0FOSjtBQU9iLHdCQUFzQixjQVBUO0FBUWIsZ0NBQThCLG1CQVJqQjtBQVNiLGdDQUE4QixtQkFUakI7O0FBV2I7QUFDQSxRQUFNLE1BWk87QUFhYixTQUFPLE9BYk07QUFjYixRQUFNLE1BZE87QUFlYixVQUFRLFFBZks7O0FBaUJiO0FBQ0EsUUFBTSxNQWxCTzs7QUFvQmI7QUFDQSxTQUFPLGdCQUFnQixDQUFoQixDQXJCTTtBQXNCYixRQUFNLGdCQUFnQixDQUFoQixDQXRCTztBQXVCYixPQUFLLGdCQUFnQixDQUFoQixDQXZCUTtBQXdCYixVQUFRLE9BQU8sZ0JBQWdCLENBQWhCLENBQVAsS0FBOEIsV0FBOUIsR0FBNEMsSUFBNUMsR0FBbUQsZ0JBQWdCLENBQWhCLENBeEI5Qzs7QUEwQmI7QUFDQSxvQkFBa0IsZUEzQkw7QUE0QmIsa0JBQWdCLGFBNUJIOztBQThCYjtBQUNBLG1CQUFpQixjQS9CSjtBQWdDYixpQkFBZSxZQWhDRjs7QUFrQ2I7QUFDQSxpQkFBZTtBQW5DRixDOzs7Ozs7OztRQzFDQyxRLEdBQUEsUTtRQW9CQSxVLEdBQUEsVTtRQUlBLGlCLEdBQUEsaUI7UUFXQSxjLEdBQUEsYztRQVVBLGdCLEdBQUEsZ0I7QUE3Q1QsU0FBUyxRQUFULENBQWtCLEdBQWxCLEVBQXVCLEVBQXZCLEVBQTJCLFFBQTNCLEVBQXFDO0FBQzFDLE1BQU0sTUFBTSxJQUFJLGNBQUosRUFBWjtBQUNBLE1BQUksSUFBSSxnQkFBUixFQUEwQixJQUFJLGdCQUFKLENBQXFCLDBCQUFyQjtBQUMxQixNQUFJLGtCQUFKLEdBQXlCLFlBQU07QUFDN0IsUUFBSSxJQUFJLFVBQUosS0FBbUIsQ0FBbkIsS0FBeUIsU0FBUyxJQUFJLE1BQWIsRUFBcUIsRUFBckIsTUFBNkIsR0FBN0IsSUFDeEIsQ0FBQyxJQUFJLE1BQUwsSUFBZSxJQUFJLFlBQUosQ0FBaUIsTUFEakMsQ0FBSixFQUM4QztBQUM1QyxTQUFHLElBQUksWUFBUDtBQUNEO0FBQ0YsR0FMRDs7QUFPQSxNQUFJLE9BQU8sUUFBUCxLQUFvQixRQUF4QixFQUFrQztBQUNoQyxRQUFJLElBQUosQ0FBUyxLQUFULEVBQWdCLEdBQWhCLEVBQXFCLElBQXJCO0FBQ0EsUUFBSSxJQUFKLENBQVMsRUFBVDtBQUNELEdBSEQsTUFHTztBQUNMLFFBQUksSUFBSixDQUFTLE1BQVQsRUFBaUIsR0FBakIsRUFBc0IsSUFBdEI7QUFDQSxRQUFJLGdCQUFKLENBQXFCLGNBQXJCLEVBQXFDLG1DQUFyQztBQUNBLFFBQUksSUFBSixDQUFTLFFBQVQ7QUFDRDtBQUNGOztBQUVNLFNBQVMsVUFBVCxHQUFzQjtBQUMzQixTQUFPLEtBQUssTUFBTCxHQUFjLFFBQWQsQ0FBdUIsRUFBdkIsRUFBMkIsTUFBM0IsQ0FBa0MsQ0FBbEMsRUFBcUMsRUFBckMsQ0FBUDtBQUNEOztBQUVNLFNBQVMsaUJBQVQsQ0FBMkIsTUFBM0IsRUFBbUMsV0FBbkMsRUFBZ0Q7QUFDckQsU0FBTyxVQUFVLFdBQVcsUUFBNUIsRUFBc0MsU0FBUyxPQUFPLFVBQXRELEVBQWtFO0FBQ2hFLFFBQUksT0FBTyxTQUFQLENBQWlCLFFBQWpCLENBQTBCLFdBQTFCLENBQUosRUFBNEM7QUFDMUMsYUFBTyxNQUFQO0FBQ0Q7QUFDRjs7QUFFRCxTQUFPLElBQVA7QUFDRDs7QUFHTSxTQUFTLGNBQVQsQ0FBd0IsTUFBeEIsRUFBZ0MsUUFBaEMsRUFBMEM7QUFDL0MsU0FBTyxVQUFVLFdBQVcsUUFBNUIsRUFBc0MsU0FBUyxPQUFPLFVBQXRELEVBQWtFO0FBQ2hFLFFBQUksT0FBTyxZQUFQLENBQW9CLElBQXBCLE1BQThCLFFBQWxDLEVBQTRDO0FBQzFDLGFBQU8sTUFBUDtBQUNEO0FBQ0Y7O0FBRUQsU0FBTyxJQUFQO0FBQ0Q7O0FBRU0sU0FBUyxnQkFBVCxDQUEwQixNQUExQixFQUFrQyxJQUFsQyxFQUF3QztBQUM3QyxTQUFPLFVBQVUsV0FBVyxRQUE1QixFQUFzQyxTQUFTLE9BQU8sVUFBdEQsRUFBa0U7QUFDaEUsUUFBSSxPQUFPLFlBQVAsQ0FBb0IsSUFBcEIsTUFBOEIsSUFBbEMsRUFBd0M7QUFDdEMsYUFBTyxNQUFQO0FBQ0Q7QUFDRjs7QUFFRCxTQUFPLElBQVA7QUFDRDs7Ozs7Ozs7Ozs7OztBQ2pERDs7OztBQUNBOzs7O0FBQ0E7O0FBQ0E7Ozs7Ozs7OytlQVJBOzs7Ozs7O0FBVUEsSUFBTSxZQUFhLFlBQU07QUFDdkI7Ozs7OztBQU1BLE1BQU0sT0FBTyxXQUFiO0FBQ0EsTUFBTSxVQUFVLE9BQWhCO0FBQ0EsTUFBTSxxQkFBcUI7QUFDekIsYUFBUztBQURnQixHQUEzQjtBQUdBLE1BQU0sd0JBQXdCLEVBQTlCOztBQUdBOzs7Ozs7QUFmdUIsTUFxQmpCLFNBckJpQjtBQUFBOztBQXVCckIseUJBQTBCO0FBQUEsVUFBZCxPQUFjLHVFQUFKLEVBQUk7O0FBQUE7O0FBQUEsd0hBQ2xCLElBRGtCLEVBQ1osT0FEWSxFQUNILGtCQURHLEVBQ2lCLE9BRGpCLEVBQzBCLHFCQUQxQixFQUNpRCxLQURqRCxFQUN3RCxLQUR4RDs7QUFHeEIsWUFBSyxTQUFMLEdBQWlCLEVBQWpCOztBQUVBLFVBQU0sVUFBVSxNQUFLLE9BQUwsQ0FBYSxPQUFiLENBQXFCLGdCQUFyQixvQkFBdUQsSUFBdkQsUUFBaEI7QUFDQSxZQUFNLElBQU4sQ0FBVyxPQUFYLEVBQW9CLE9BQXBCLENBQTRCLFVBQUMsTUFBRCxFQUFZO0FBQ3RDLFlBQU0sYUFBYSxPQUFPLFlBQVAsQ0FBb0IsTUFBcEIsQ0FBbkI7QUFDQSxZQUFNLFdBQVcsU0FBUyxhQUFULENBQXVCLFVBQXZCLENBQWpCOztBQUVBLFlBQUksUUFBSixFQUFjO0FBQ1osZ0JBQUssV0FBTCxDQUFpQixRQUFqQjtBQUNEO0FBQ0YsT0FQRDtBQU53QjtBQWN6Qjs7QUFyQ29CO0FBQUE7QUFBQSxxQ0F1Q04sS0F2Q00sRUF1Q0M7QUFDcEIsWUFBTSxLQUFLLE1BQU0sTUFBTixDQUFhLFlBQWIsQ0FBMEIsTUFBMUIsQ0FBWDtBQUNBLFlBQU0sVUFBVSxTQUFTLGFBQVQsQ0FBdUIsRUFBdkIsQ0FBaEI7O0FBRUEsYUFBSyxZQUFMLENBQWtCLE9BQWxCO0FBQ0Q7QUE1Q29CO0FBQUE7QUFBQSxrQ0E4Q1QsT0E5Q1MsRUE4Q0E7QUFDbkIsWUFBTSxXQUFXLHVCQUFhO0FBQzVCO0FBRDRCLFNBQWIsQ0FBakI7QUFHQSxhQUFLLFNBQUwsQ0FBZSxJQUFmLENBQW9CLFFBQXBCOztBQUVBLGVBQU8sUUFBUDtBQUNEO0FBckRvQjtBQUFBO0FBQUEsa0NBdURULE9BdkRTLEVBdURBO0FBQ25CLFlBQUksV0FBVyxLQUFLLFNBQUwsQ0FBZSxJQUFmLENBQW9CO0FBQUEsaUJBQUssRUFBRSxPQUFGLENBQVUsT0FBVixDQUFrQixZQUFsQixDQUErQixJQUEvQixNQUF5QyxRQUFRLFlBQVIsQ0FBcUIsSUFBckIsQ0FBOUM7QUFBQSxTQUFwQixDQUFmOztBQUVBLFlBQUksQ0FBQyxRQUFMLEVBQWU7QUFDYjtBQUNBLHFCQUFXLEtBQUssV0FBTCxFQUFYO0FBQ0Q7O0FBRUQsZUFBTyxRQUFQO0FBQ0Q7QUFoRW9CO0FBQUE7QUFBQSxxQ0FrRU47QUFDYixlQUFPLEtBQUssU0FBWjtBQUNEO0FBcEVvQjtBQUFBO0FBQUEsbUNBc0VSLFlBdEVRLEVBc0VNO0FBQ3pCLFlBQU0sV0FBVyxLQUFLLFdBQUwsQ0FBaUIsWUFBakIsQ0FBakI7QUFDQSxhQUFLLFNBQUwsQ0FBZSxPQUFmLENBQXVCLFVBQUMsQ0FBRCxFQUFPO0FBQzVCLGNBQUksRUFBRSxPQUFGLENBQVUsT0FBVixDQUFrQixZQUFsQixDQUErQixJQUEvQixNQUF5QyxhQUFhLFlBQWIsQ0FBMEIsSUFBMUIsQ0FBN0MsRUFBOEU7QUFDNUUsY0FBRSxJQUFGO0FBQ0QsV0FGRCxNQUVPO0FBQ0wscUJBQVMsTUFBVDtBQUNEO0FBQ0YsU0FORDtBQU9EO0FBL0VvQjtBQUFBO0FBQUEsMkJBaUZoQixVQWpGZ0IsRUFpRko7QUFDZixZQUFJLFdBQVcsVUFBZjtBQUNBLFlBQUksT0FBTyxVQUFQLEtBQXNCLFFBQTFCLEVBQW9DO0FBQ2xDLHFCQUFXLFNBQVMsYUFBVCxDQUF1QixVQUF2QixDQUFYO0FBQ0Q7O0FBRUQsWUFBSSxDQUFDLFFBQUwsRUFBZTtBQUNiLGdCQUFNLElBQUksS0FBSixDQUFhLElBQWIsMEJBQXNDLFVBQXRDLGlDQUFOO0FBQ0Q7O0FBRUQsYUFBSyxZQUFMLENBQWtCLFFBQWxCOztBQUVBLGVBQU8sSUFBUDtBQUNEO0FBOUZvQjtBQUFBO0FBQUEsMkJBZ0doQixVQWhHZ0IsRUFnR0o7QUFDZixZQUFJLFdBQVcsVUFBZjtBQUNBLFlBQUksT0FBTyxVQUFQLEtBQXNCLFFBQTFCLEVBQW9DO0FBQ2xDLHFCQUFXLFNBQVMsYUFBVCxDQUF1QixVQUF2QixDQUFYO0FBQ0Q7O0FBRUQsWUFBSSxDQUFDLFFBQUwsRUFBZTtBQUNiLGdCQUFNLElBQUksS0FBSixDQUFhLElBQWIsMEJBQXNDLFVBQXRDLGlDQUFOO0FBQ0Q7O0FBRUQsWUFBTSxjQUFjLEtBQUssV0FBTCxDQUFpQixRQUFqQixDQUFwQjtBQUNBLGVBQU8sWUFBWSxJQUFaLEVBQVA7QUFDRDtBQTVHb0I7QUFBQTtBQUFBLG1DQThHRDtBQUNsQixlQUFPLElBQVA7QUFDRDtBQWhIb0I7QUFBQTtBQUFBLG9DQWtIQSxPQWxIQSxFQWtIUztBQUM1QiwrR0FBMkIsU0FBM0IsRUFBc0MsT0FBdEM7QUFDRDtBQXBIb0I7O0FBQUE7QUFBQTs7QUF1SHZCOzs7Ozs7O0FBS0EsTUFBTSxhQUFhLEVBQW5COztBQUVBLE1BQU0sYUFBYSxTQUFTLGdCQUFULE9BQThCLElBQTlCLENBQW5CO0FBQ0EsTUFBSSxVQUFKLEVBQWdCO0FBQ2QsVUFBTSxJQUFOLENBQVcsVUFBWCxFQUF1QixPQUF2QixDQUErQixVQUFDLE9BQUQsRUFBYTtBQUMxQyxVQUFNLFNBQVMsMkNBQW9CLE9BQXBCLEVBQTZCLGtCQUE3QixFQUFpRCxxQkFBakQsQ0FBZjtBQUNBLGFBQU8sT0FBUCxHQUFpQixPQUFqQjs7QUFFQSxpQkFBVyxJQUFYLENBQWdCLFVBQVUsYUFBVixDQUF3QixNQUF4QixDQUFoQjtBQUNELEtBTEQ7QUFNRDs7QUFFRCxNQUFJLFVBQUosRUFBZ0I7QUFDZCxhQUFTLGdCQUFULENBQTBCLE9BQTFCLEVBQW1DLFVBQUMsS0FBRCxFQUFXO0FBQzVDLFVBQU0saUJBQWlCLE1BQU0sTUFBTixDQUFhLFlBQWIsQ0FBMEIsYUFBMUIsQ0FBdkI7QUFDQSxVQUFJLGtCQUFrQixtQkFBbUIsSUFBekMsRUFBK0M7QUFDN0MsWUFBTSxhQUFhLE1BQU0sTUFBTixDQUFhLFlBQWIsQ0FBMEIsYUFBMUIsS0FBNEMsTUFBTSxNQUFOLENBQWEsWUFBYixDQUEwQixNQUExQixDQUEvRDtBQUNBLFlBQU0sYUFBYSxTQUFTLGFBQVQsQ0FBdUIsVUFBdkIsQ0FBbkI7O0FBRUEsWUFBTSxZQUFZLDhCQUFrQixNQUFNLE1BQXhCLEVBQWdDLFdBQWhDLENBQWxCOztBQUVBLFlBQUksY0FBYyxJQUFsQixFQUF3QjtBQUN0QjtBQUNEOztBQUVELFlBQU0sY0FBYyxVQUFVLFlBQVYsQ0FBdUIsSUFBdkIsQ0FBcEI7QUFDQSxZQUFNLFlBQVksV0FBVyxJQUFYLENBQWdCO0FBQUEsaUJBQUssRUFBRSxVQUFGLEdBQWUsWUFBZixDQUE0QixJQUE1QixNQUFzQyxXQUEzQztBQUFBLFNBQWhCLENBQWxCOztBQUVBLFlBQUksQ0FBQyxTQUFMLEVBQWdCO0FBQ2Q7QUFDRDs7QUFFRDtBQUNBLFlBQU0saUJBQWlCLFVBQVUsWUFBVixHQUF5QixJQUF6QixDQUE4QjtBQUFBLGlCQUFLLEVBQUUsVUFBRixPQUFtQixVQUF4QjtBQUFBLFNBQTlCLENBQXZCO0FBQ0EsWUFBSSxDQUFDLGNBQUwsRUFBcUI7QUFDbkIsb0JBQVUsV0FBVixDQUFzQixVQUF0QjtBQUNEOztBQUVELGtCQUFVLElBQVYsQ0FBZSxVQUFmO0FBQ0Q7QUFDRixLQTNCRDtBQTRCRDs7QUFFRCxTQUFPLFNBQVA7QUFDRCxDQXhLaUIsRUFBbEI7O2tCQTBLZSxTOzs7Ozs7Ozs7Ozs7O0FDL0tmOzs7O0FBQ0E7O0FBQ0E7Ozs7QUFDQTs7Ozs7Ozs7K2VBUkE7Ozs7Ozs7QUFVQSxJQUFNLFdBQVksWUFBTTtBQUN0Qjs7Ozs7O0FBTUEsTUFBTSxPQUFPLFVBQWI7QUFDQSxNQUFNLFVBQVUsT0FBaEI7QUFDQSxNQUFNLHFCQUFxQjtBQUN6QixhQUFTLElBRGdCO0FBRXpCLFlBQVE7QUFGaUIsR0FBM0I7QUFJQSxNQUFNLHdCQUF3QixDQUM1QixRQUQ0QixDQUE5Qjs7QUFJQTs7Ozs7O0FBakJzQixNQXVCaEIsUUF2QmdCO0FBQUE7O0FBeUJwQix3QkFBMEI7QUFBQSxVQUFkLE9BQWMsdUVBQUosRUFBSTs7QUFBQTs7QUFBQSxzSEFDbEIsSUFEa0IsRUFDWixPQURZLEVBQ0gsa0JBREcsRUFDaUIsT0FEakIsRUFDMEIscUJBRDFCLEVBQ2lELEtBRGpELEVBQ3dELEtBRHhEOztBQUd4QixZQUFLLFlBQUwsR0FBb0IsS0FBcEI7O0FBRUE7QUFDQSxVQUFJLE1BQUssT0FBTCxDQUFhLE1BQWpCLEVBQXlCO0FBQ3ZCLGNBQUssSUFBTDtBQUNEO0FBUnVCO0FBU3pCOztBQWxDbUI7QUFBQTtBQUFBLGtDQW9DUjtBQUNWLGVBQU8sS0FBSyxPQUFMLENBQWEsT0FBYixDQUFxQixxQkFBckIsQ0FBMkMsS0FBSyxPQUFMLENBQWEsT0FBeEQsRUFBaUUsTUFBeEU7QUFDRDtBQXRDbUI7QUFBQTtBQUFBLCtCQXdDWDtBQUNQLFlBQUksS0FBSyxPQUFMLENBQWEsT0FBYixDQUFxQixTQUFyQixDQUErQixRQUEvQixDQUF3QyxNQUF4QyxDQUFKLEVBQXFEO0FBQ25ELGlCQUFPLEtBQUssSUFBTCxFQUFQO0FBQ0Q7O0FBRUQsZUFBTyxLQUFLLElBQUwsRUFBUDtBQUNEO0FBOUNtQjtBQUFBO0FBQUEsNkJBZ0RiO0FBQUE7O0FBQ0wsWUFBSSxLQUFLLFlBQVQsRUFBdUI7QUFDckIsaUJBQU8sS0FBUDtBQUNEOztBQUVELFlBQUksS0FBSyxPQUFMLENBQWEsT0FBYixDQUFxQixTQUFyQixDQUErQixRQUEvQixDQUF3QyxNQUF4QyxDQUFKLEVBQXFEO0FBQ25ELGlCQUFPLEtBQVA7QUFDRDs7QUFFRCxhQUFLLFlBQUwsR0FBb0IsSUFBcEI7O0FBRUEsWUFBTSxjQUFjLFNBQWQsV0FBYyxHQUFNO0FBQ3hCLGlCQUFLLE9BQUwsQ0FBYSxPQUFiLENBQXFCLFNBQXJCLENBQStCLEdBQS9CLENBQW1DLE1BQW5DO0FBQ0EsaUJBQUssT0FBTCxDQUFhLE9BQWIsQ0FBcUIsU0FBckIsQ0FBK0IsTUFBL0IsQ0FBc0MsWUFBdEM7QUFDQSxpQkFBSyxPQUFMLENBQWEsT0FBYixDQUFxQixtQkFBckIsQ0FBeUMsaUJBQU0sY0FBL0MsRUFBK0QsV0FBL0Q7O0FBRUEsaUJBQUssT0FBTCxDQUFhLE9BQWIsQ0FBcUIsWUFBckIsQ0FBa0MsZUFBbEMsRUFBbUQsSUFBbkQ7O0FBRUEsaUJBQUssWUFBTCxHQUFvQixLQUFwQjtBQUNELFNBUkQ7O0FBVUEsWUFBSSxDQUFDLEtBQUssT0FBTCxDQUFhLE9BQWIsQ0FBcUIsU0FBckIsQ0FBK0IsUUFBL0IsQ0FBd0MsWUFBeEMsQ0FBTCxFQUE0RDtBQUMxRCxlQUFLLE9BQUwsQ0FBYSxPQUFiLENBQXFCLFNBQXJCLENBQStCLEdBQS9CLENBQW1DLFlBQW5DO0FBQ0Q7O0FBRUQsYUFBSyxPQUFMLENBQWEsT0FBYixDQUFxQixnQkFBckIsQ0FBc0MsaUJBQU0sY0FBNUMsRUFBNEQsV0FBNUQ7O0FBRUEsWUFBTSxTQUFTLEtBQUssU0FBTCxFQUFmOztBQUVBLGFBQUssT0FBTCxDQUFhLE9BQWIsQ0FBcUIsS0FBckIsQ0FBMkIsTUFBM0IsR0FBb0MsS0FBcEM7O0FBRUEsbUJBQVcsWUFBTTtBQUNmLGlCQUFLLE9BQUwsQ0FBYSxPQUFiLENBQXFCLEtBQXJCLENBQTJCLE1BQTNCLEdBQXVDLE1BQXZDO0FBQ0QsU0FGRCxFQUVHLEVBRkg7O0FBSUEsZUFBTyxJQUFQO0FBQ0Q7QUFwRm1CO0FBQUE7QUFBQSw2QkFzRmI7QUFBQTs7QUFDTCxZQUFJLEtBQUssWUFBVCxFQUF1QjtBQUNyQixpQkFBTyxLQUFQO0FBQ0Q7O0FBRUQsWUFBSSxDQUFDLEtBQUssT0FBTCxDQUFhLE9BQWIsQ0FBcUIsU0FBckIsQ0FBK0IsUUFBL0IsQ0FBd0MsTUFBeEMsQ0FBTCxFQUFzRDtBQUNwRCxpQkFBTyxLQUFQO0FBQ0Q7O0FBRUQsYUFBSyxZQUFMLEdBQW9CLElBQXBCOztBQUVBLFlBQU0sY0FBYyxTQUFkLFdBQWMsR0FBTTtBQUN4QixpQkFBSyxPQUFMLENBQWEsT0FBYixDQUFxQixTQUFyQixDQUErQixNQUEvQixDQUFzQyxZQUF0QztBQUNBLGlCQUFLLE9BQUwsQ0FBYSxPQUFiLENBQXFCLEtBQXJCLENBQTJCLE1BQTNCLEdBQW9DLE1BQXBDO0FBQ0EsaUJBQUssT0FBTCxDQUFhLE9BQWIsQ0FBcUIsbUJBQXJCLENBQXlDLGlCQUFNLGNBQS9DLEVBQStELFdBQS9EOztBQUVBLGlCQUFLLE9BQUwsQ0FBYSxPQUFiLENBQXFCLFlBQXJCLENBQWtDLGVBQWxDLEVBQW1ELEtBQW5EOztBQUVBLGlCQUFLLFlBQUwsR0FBb0IsS0FBcEI7QUFDRCxTQVJEOztBQVVBLGFBQUssT0FBTCxDQUFhLE9BQWIsQ0FBcUIsS0FBckIsQ0FBMkIsTUFBM0IsR0FBb0MsS0FBcEM7O0FBRUEsWUFBSSxDQUFDLEtBQUssT0FBTCxDQUFhLE9BQWIsQ0FBcUIsU0FBckIsQ0FBK0IsUUFBL0IsQ0FBd0MsWUFBeEMsQ0FBTCxFQUE0RDtBQUMxRCxlQUFLLE9BQUwsQ0FBYSxPQUFiLENBQXFCLFNBQXJCLENBQStCLEdBQS9CLENBQW1DLFlBQW5DO0FBQ0Q7O0FBRUQsYUFBSyxPQUFMLENBQWEsT0FBYixDQUFxQixnQkFBckIsQ0FBc0MsaUJBQU0sY0FBNUMsRUFBNEQsV0FBNUQ7O0FBRUEsYUFBSyxPQUFMLENBQWEsT0FBYixDQUFxQixTQUFyQixDQUErQixNQUEvQixDQUFzQyxNQUF0Qzs7QUFFQSxlQUFPLElBQVA7QUFDRDtBQXRIbUI7QUFBQTtBQUFBLG1DQXdIQTtBQUNsQixlQUFPLElBQVA7QUFDRDtBQTFIbUI7QUFBQTtBQUFBLG9DQTRIQyxPQTVIRCxFQTRIVTtBQUM1Qiw2R0FBMkIsUUFBM0IsRUFBcUMsT0FBckM7QUFDRDtBQTlIbUI7O0FBQUE7QUFBQTs7QUFpSXRCOzs7Ozs7O0FBS0EsTUFBTSxhQUFhLEVBQW5COztBQUVBLE1BQU0sWUFBWSxTQUFTLGdCQUFULE9BQThCLElBQTlCLENBQWxCO0FBQ0EsTUFBSSxTQUFKLEVBQWU7QUFDYixjQUFVLE9BQVYsQ0FBa0IsVUFBQyxPQUFELEVBQWE7QUFDN0I7QUFDQSxVQUFNLFNBQVMsMkNBQW9CLE9BQXBCLEVBQTZCLGtCQUE3QixFQUFpRCxxQkFBakQsQ0FBZjtBQUNBLGFBQU8sT0FBUCxHQUFpQixPQUFqQjs7QUFFQSxpQkFBVyxJQUFYLENBQWdCLFNBQVMsYUFBVCxDQUF1QixNQUF2QixDQUFoQjtBQUNELEtBTkQ7QUFPRDs7QUFFRCxNQUFJLFNBQUosRUFBZTtBQUNiLGFBQVMsZ0JBQVQsQ0FBMEIsT0FBMUIsRUFBbUMsVUFBQyxLQUFELEVBQVc7QUFDNUMsVUFBTSxTQUFTLDZCQUFpQixNQUFNLE1BQXZCLEVBQStCLGFBQS9CLENBQWY7QUFDQSxVQUFJLENBQUMsTUFBTCxFQUFhO0FBQ1g7QUFDRDs7QUFFRCxVQUFNLGlCQUFpQixPQUFPLFlBQVAsQ0FBb0IsYUFBcEIsQ0FBdkI7O0FBRUEsVUFBSSxrQkFBa0IsbUJBQW1CLElBQXpDLEVBQStDO0FBQzdDLFlBQUksS0FBSyxPQUFPLFlBQVAsQ0FBb0IsYUFBcEIsS0FBc0MsT0FBTyxZQUFQLENBQW9CLE1BQXBCLENBQS9DO0FBQ0EsYUFBSyxHQUFHLE9BQUgsQ0FBVyxHQUFYLEVBQWdCLEVBQWhCLENBQUw7O0FBRUEsWUFBTSxZQUFZLFdBQVcsSUFBWCxDQUFnQjtBQUFBLGlCQUFLLEVBQUUsVUFBRixHQUFlLFlBQWYsQ0FBNEIsSUFBNUIsTUFBc0MsRUFBM0M7QUFBQSxTQUFoQixDQUFsQjs7QUFFQSxZQUFJLENBQUMsU0FBTCxFQUFnQjtBQUNkO0FBQ0Q7O0FBRUQsa0JBQVUsTUFBVjtBQUNEO0FBQ0YsS0FwQkQ7QUFxQkQ7O0FBRUQsU0FBTyxRQUFQO0FBQ0QsQ0E1S2dCLEVBQWpCOztrQkE4S2UsUTs7Ozs7Ozs7O3FqQkN4TGY7Ozs7Ozs7QUFLQTs7QUFDQTs7QUFDQTs7OztBQUNBOzs7Ozs7OztBQUVBOzs7Ozs7SUFNcUIsUztBQUVuQixxQkFBWSxJQUFaLEVBQWtCLE9BQWxCLEVBQW1JO0FBQUEsUUFBeEcsY0FBd0csdUVBQXZGLEVBQXVGO0FBQUEsUUFBbkYsT0FBbUYsdUVBQXpFLEVBQXlFO0FBQUEsUUFBckUsV0FBcUUsdUVBQXZELEVBQXVEOztBQUFBOztBQUFBLFFBQW5ELHFCQUFtRCx1RUFBM0IsS0FBMkI7QUFBQSxRQUFwQixVQUFvQix1RUFBUCxLQUFPOztBQUFBOztBQUNqSSxTQUFLLElBQUwsR0FBWSxJQUFaO0FBQ0EsU0FBSyxPQUFMLEdBQWUsT0FBZjtBQUNBLFNBQUssT0FBTCxHQUFlLE9BQWY7O0FBRUE7QUFDQTtBQUNBLFdBQU8sSUFBUCxDQUFZLGNBQVosRUFBNEIsT0FBNUIsQ0FBb0MsVUFBQyxJQUFELEVBQVU7QUFDNUMsVUFBSSxPQUFPLE1BQUssT0FBTCxDQUFhLElBQWIsQ0FBUCxLQUE4QixXQUFsQyxFQUErQztBQUM3QyxjQUFLLE9BQUwsQ0FBYSxJQUFiLElBQXFCLGVBQWUsSUFBZixDQUFyQjtBQUNEO0FBQ0YsS0FKRDs7QUFNQSxTQUFLLFdBQUwsR0FBbUIsV0FBbkI7QUFDQSxTQUFLLHFCQUFMLEdBQTZCLHFCQUE3QjtBQUNBLFNBQUssVUFBTCxHQUFrQixVQUFsQjtBQUNBLFNBQUssRUFBTCxHQUFVLHdCQUFWOztBQUVBLFFBQU0sZUFBZSxDQUFDLEtBQUsscUJBQU4sSUFBK0IsS0FBSyxPQUFMLENBQWEsT0FBYixLQUF5QixJQUE3RTs7QUFFQSxRQUFJLE9BQU8sS0FBSyxPQUFMLENBQWEsT0FBcEIsS0FBZ0MsUUFBcEMsRUFBOEM7QUFDNUMsV0FBSyxPQUFMLENBQWEsT0FBYixHQUF1QixTQUFTLGFBQVQsQ0FBdUIsS0FBSyxPQUFMLENBQWEsT0FBcEMsQ0FBdkI7QUFDRDs7QUFFRCxRQUFJLGdCQUFnQixDQUFDLEtBQUssT0FBTCxDQUFhLE9BQWxDLEVBQTJDO0FBQ3pDLFlBQU0sSUFBSSxLQUFKLENBQWEsS0FBSyxJQUFsQix5Q0FBTjtBQUNEOztBQUVELFNBQUssY0FBTCxHQUFzQixLQUFLLE9BQUwsQ0FBYSxPQUFiLEtBQXlCLElBQS9DO0FBQ0EsU0FBSyxrQkFBTCxHQUEwQixFQUExQjs7QUFFQSxRQUFJLENBQUMsS0FBSyxjQUFWLEVBQTBCO0FBQ3hCOzs7Ozs7OztBQVFBLFdBQUssT0FBTCxHQUFlLE9BQU8sTUFBUCxDQUFjLEtBQUssT0FBbkIsRUFBNEIsS0FBSyxjQUFMLENBQW9CLEtBQUssYUFBTCxFQUFwQixFQUEwQyxPQUExQyxDQUE1QixDQUFmOztBQUVBO0FBQ0EsV0FBSyxhQUFMO0FBQ0Q7O0FBRUQsU0FBSyxlQUFMLEdBQXVCO0FBQUEsYUFBUyxNQUFLLG9CQUFMLENBQTBCLEtBQTFCLENBQVQ7QUFBQSxLQUF2QjtBQUNEOzs7O21DQUVjLFUsRUFBWSxPLEVBQVM7QUFDbEMsV0FBSyxXQUFMLENBQWlCLE9BQWpCLENBQXlCLFVBQUMsR0FBRCxFQUFTO0FBQ2hDLFlBQUksUUFBUSxHQUFSLENBQUosRUFBa0I7QUFDaEIscUJBQVcsR0FBWCxJQUFrQixRQUFRLEdBQVIsQ0FBbEI7QUFDRDtBQUNGLE9BSkQ7O0FBTUEsYUFBTyxVQUFQO0FBQ0Q7OztpQ0FFWTtBQUNYLGFBQU8sS0FBSyxPQUFaO0FBQ0Q7OztpQ0FFWTtBQUNYLGFBQU8sS0FBSyxPQUFMLENBQWEsT0FBcEI7QUFDRDs7OzRCQUVPO0FBQ04sYUFBTyxLQUFLLEVBQVo7QUFDRDs7O3FDQUVnQixRLEVBQVU7QUFBQTs7QUFDekIsZUFBUyxPQUFULENBQWlCO0FBQUEsZUFBVyxPQUFLLGVBQUwsQ0FBcUIsT0FBckIsQ0FBWDtBQUFBLE9BQWpCO0FBQ0Q7OztvQ0FFZSxPLEVBQVM7QUFDdkIsY0FBUSxNQUFSLENBQWUsZ0JBQWYsQ0FBZ0MsUUFBUSxLQUF4QyxFQUErQyxLQUFLLGVBQXBEO0FBQ0EsV0FBSyxrQkFBTCxDQUF3QixJQUF4QixDQUE2QixPQUE3QjtBQUNEOzs7eUNBRW9CO0FBQUE7O0FBQ25CLFdBQUssa0JBQUwsQ0FBd0IsT0FBeEIsQ0FBZ0MsVUFBQyxPQUFELEVBQWE7QUFDM0MsZUFBSyxpQkFBTCxDQUF1QixPQUF2QjtBQUNELE9BRkQ7QUFHRDs7O3NDQUVpQixPLEVBQVM7QUFDekIsVUFBTSx5QkFBeUIsS0FBSyxrQkFBTCxDQUM1QixTQUQ0QixDQUNsQjtBQUFBLGVBQU0sR0FBRyxNQUFILEtBQWMsUUFBUSxNQUF0QixJQUFnQyxHQUFHLEtBQUgsS0FBYSxRQUFRLEtBQTNEO0FBQUEsT0FEa0IsQ0FBL0I7O0FBR0EsVUFBSSx5QkFBeUIsQ0FBQyxDQUE5QixFQUFpQztBQUMvQixnQkFBUSxNQUFSLENBQWUsbUJBQWYsQ0FBbUMsUUFBUSxLQUEzQyxFQUFrRCxLQUFLLGVBQXZEO0FBQ0EsYUFBSyxrQkFBTCxDQUF3QixNQUF4QixDQUErQixzQkFBL0IsRUFBdUQsQ0FBdkQ7QUFDRCxPQUhELE1BR087QUFDTCxnQkFBUSxLQUFSLDJDQUFzRCxRQUFRLE1BQTlELHFCQUFvRixRQUFRLEtBQTVGO0FBQ0Q7QUFDRjs7O2lDQUVZLFMsRUFBaUQ7QUFBQSxVQUF0QyxNQUFzQyx1RUFBN0IsRUFBNkI7QUFBQSxVQUF6QixlQUF5Qix1RUFBUCxLQUFPOztBQUM1RCxVQUFJLE9BQU8sU0FBUCxLQUFxQixRQUF6QixFQUFtQztBQUNqQyxjQUFNLElBQUksS0FBSixDQUFVLDhCQUFWLENBQU47QUFDRDs7QUFFRCxVQUFJLEtBQUssVUFBVCxFQUFxQjtBQUNuQixZQUFJLGNBQWMsaUJBQU0sSUFBeEIsRUFBOEI7QUFDNUIscUNBQWlCLEdBQWpCLENBQXFCLElBQXJCO0FBQ0QsU0FGRCxNQUVPLElBQUksY0FBYyxpQkFBTSxJQUF4QixFQUE4QjtBQUNuQyxxQ0FBaUIsTUFBakIsQ0FBd0IsSUFBeEI7QUFDRDtBQUNGOztBQUVEO0FBQ0EsVUFBTSxrQkFBa0IsVUFBVSxLQUFWLENBQWdCLEdBQWhCLEVBQXFCLE1BQXJCLENBQTRCLFVBQUMsR0FBRCxFQUFNLE9BQU4sRUFBZSxLQUFmLEVBQXlCO0FBQzNFLFlBQUksVUFBVSxDQUFkLEVBQWlCO0FBQ2YsaUJBQU8sT0FBUDtBQUNEOztBQUVELGVBQU8sTUFBTSxRQUFRLE1BQVIsQ0FBZSxDQUFmLEVBQWtCLFdBQWxCLEVBQU4sR0FBd0MsUUFBUSxLQUFSLENBQWMsQ0FBZCxDQUEvQztBQUNELE9BTnVCLENBQXhCOztBQVFBLFVBQU0sd0JBQXNCLGdCQUFnQixNQUFoQixDQUF1QixDQUF2QixFQUEwQixXQUExQixFQUF0QixHQUFnRSxnQkFBZ0IsS0FBaEIsQ0FBc0IsQ0FBdEIsQ0FBdEU7O0FBRUE7QUFDQSxVQUFJLE9BQU8sS0FBSyxPQUFMLENBQWEsZUFBYixDQUFQLEtBQXlDLFVBQTdDLEVBQXlEO0FBQ3ZELGFBQUssT0FBTCxDQUFhLGVBQWIsRUFBOEIsS0FBOUIsQ0FBb0MsSUFBcEMsRUFBMEMsQ0FBQyxNQUFELENBQTFDO0FBQ0Q7O0FBRUQsVUFBSSxPQUFPLEtBQUssT0FBTCxDQUFhLGNBQWIsQ0FBUCxLQUF3QyxVQUE1QyxFQUF3RDtBQUN0RCxhQUFLLE9BQUwsQ0FBYSxjQUFiLEVBQTZCLEtBQTdCLENBQW1DLElBQW5DLEVBQXlDLENBQUMsTUFBRCxDQUF6QztBQUNEOztBQUVELFVBQUksZUFBSixFQUFxQjtBQUNuQjtBQUNEOztBQUVEO0FBQ0EsVUFBSSxLQUFLLE9BQUwsQ0FBYSxPQUFqQixFQUEwQjtBQUN4Qiw0Q0FBcUIsS0FBSyxPQUFMLENBQWEsT0FBbEMsRUFBMkMsU0FBM0MsRUFBc0QsS0FBSyxJQUEzRCxFQUFpRSxNQUFqRTtBQUNELE9BRkQsTUFFTztBQUNMLDJDQUFvQixTQUFwQixFQUErQixLQUFLLElBQXBDLEVBQTBDLE1BQTFDO0FBQ0Q7QUFDRjs7O29DQUVlO0FBQ2QsVUFBSSxLQUFLLFdBQUwsQ0FBaUIsTUFBakIsR0FBMEIsQ0FBOUIsRUFBaUM7QUFDL0IsbURBQW9CLEtBQUssT0FBTCxDQUFhLE9BQWpDLEVBQTBDLEtBQUssT0FBL0MsRUFBd0QsS0FBSyxXQUE3RDtBQUNEO0FBQ0Y7OztvQ0FFZTtBQUNkLFVBQU0sVUFBVSxPQUFPLE1BQVAsQ0FBYyxFQUFkLEVBQWtCLEtBQUssT0FBdkIsQ0FBaEI7QUFDQSxhQUFPLDJDQUFvQixLQUFLLE9BQUwsQ0FBYSxPQUFqQyxFQUEwQyxPQUExQyxFQUFtRCxLQUFLLFdBQXhELENBQVA7QUFDRDs7QUFFRDs7Ozs7Ozs7c0NBS2tCO0FBQ2hCLGFBQU8sS0FBSyxVQUFMLElBQW1CLENBQUMsMkJBQWlCLFFBQWpCLENBQTBCLElBQTFCLENBQTNCO0FBQ0Q7Ozt5Q0FFb0IsSyxFQUFPO0FBQzFCLFVBQUksS0FBSyxlQUFMLEVBQUosRUFBNEI7QUFDMUI7QUFDRDs7QUFFRCxXQUFLLGNBQUwsQ0FBb0IsS0FBcEI7QUFDRDs7O21DQUVjLEssRUFBTztBQUNwQjtBQUNEOzs7aUNBRW1CO0FBQ2xCLGFBQU8sS0FBSyxJQUFaO0FBQ0Q7OztrQ0FFb0IsYyxFQUFnQixPLEVBQVM7QUFDNUMsYUFBTyxJQUFJLGNBQUosQ0FBbUIsT0FBbkIsQ0FBUDtBQUNEOzs7Ozs7a0JBdkxrQixTOzs7Ozs7Ozs7OztRQ1JMLG1CLEdBQUEsbUI7UUF3QkEsbUIsR0FBQSxtQjs7QUEvQmhCLElBQU0sZUFBZSxTQUFmLFlBQWUsQ0FBQyxLQUFELEVBQVEsTUFBUixFQUFtQjtBQUN0QyxNQUFJLFVBQVUsRUFBZCxFQUFrQjtBQUNoQixxQkFBZSxNQUFmO0FBQ0Q7QUFDRCxtQkFBZSxLQUFmLFNBQXdCLE1BQXhCO0FBQ0QsQ0FMRDs7QUFPTyxTQUFTLG1CQUFULENBQTZCLE9BQTdCLEVBQW1FO0FBQUEsTUFBN0IsR0FBNkIsdUVBQXZCLEVBQXVCO0FBQUEsTUFBbkIsS0FBbUI7QUFBQSxNQUFaLEtBQVksdUVBQUosRUFBSTs7QUFDeEUsTUFBTSxPQUFPLE9BQU8sSUFBUCxDQUFZLEdBQVosQ0FBYjs7QUFFQSxPQUFLLE9BQUwsQ0FBYSxVQUFDLEdBQUQsRUFBUztBQUNwQixRQUFJLFVBQVUsRUFBVixJQUFnQixNQUFNLE9BQU4sQ0FBYyxHQUFkLE1BQXVCLENBQUMsQ0FBNUMsRUFBK0M7QUFDN0M7QUFDQTtBQUNEOztBQUVELFFBQUksUUFBTyxJQUFJLEdBQUosQ0FBUCxNQUFvQixRQUFwQixJQUFnQyxJQUFJLEdBQUosTUFBYSxJQUFqRCxFQUF1RDtBQUNyRCxVQUFJLFdBQVcsR0FBZjtBQUNBLFVBQUksVUFBVSxFQUFkLEVBQWtCO0FBQ2hCLG1CQUFjLEtBQWQsU0FBdUIsR0FBdkI7QUFDRDs7QUFFRCwwQkFBb0IsT0FBcEIsRUFBNkIsSUFBSSxHQUFKLENBQTdCLEVBQXVDLEtBQXZDLEVBQThDLFFBQTlDO0FBQ0E7QUFDRDs7QUFFRCxRQUFNLE9BQU8sYUFBYSxLQUFiLEVBQW9CLEdBQXBCLENBQWI7QUFDQSxZQUFRLFlBQVIsQ0FBcUIsSUFBckIsRUFBMkIsSUFBSSxHQUFKLENBQTNCO0FBQ0QsR0FsQkQ7QUFtQkQ7O0FBRU0sU0FBUyxtQkFBVCxDQUE2QixPQUE3QixFQUFtRTtBQUFBLE1BQTdCLEdBQTZCLHVFQUF2QixFQUF1QjtBQUFBLE1BQW5CLEtBQW1CO0FBQUEsTUFBWixLQUFZLHVFQUFKLEVBQUk7O0FBQ3hFLE1BQU0sU0FBUyxPQUFPLE1BQVAsQ0FBYyxFQUFkLEVBQWtCLEdBQWxCLENBQWY7QUFDQSxNQUFNLE9BQU8sT0FBTyxJQUFQLENBQVksR0FBWixDQUFiOztBQUVBLE9BQUssT0FBTCxDQUFhLFVBQUMsR0FBRCxFQUFTO0FBQ3BCLFFBQUksVUFBVSxFQUFWLElBQWdCLE1BQU0sT0FBTixDQUFjLEdBQWQsTUFBdUIsQ0FBQyxDQUE1QyxFQUErQztBQUM3QztBQUNBO0FBQ0Q7O0FBRUQsUUFBSSxJQUFJLEdBQUosTUFBYSxJQUFiLElBQXFCLElBQUksR0FBSixFQUFTLFdBQVQsS0FBeUIsTUFBbEQsRUFBMEQ7QUFDeEQsVUFBSSxXQUFXLEdBQWY7QUFDQSxVQUFJLFVBQVUsRUFBZCxFQUFrQjtBQUNoQixtQkFBYyxLQUFkLFNBQXVCLEdBQXZCO0FBQ0Q7O0FBRUQsYUFBTyxHQUFQLElBQWMsb0JBQW9CLE9BQXBCLEVBQTZCLElBQUksR0FBSixDQUE3QixFQUF1QyxLQUF2QyxFQUE4QyxRQUE5QyxDQUFkO0FBQ0E7QUFDRDs7QUFFRDtBQUNBLFFBQUksUUFBUSxJQUFJLEdBQUosQ0FBWixDQWpCb0IsQ0FpQkM7QUFDckIsUUFBTSxjQUFjLEtBQWQseUNBQWMsS0FBZCxDQUFOO0FBQ0EsUUFBTSxPQUFPLGFBQWEsS0FBYixFQUFvQixHQUFwQixDQUFiO0FBQ0EsUUFBTSxZQUFZLFFBQVEsWUFBUixDQUFxQixJQUFyQixDQUFsQjs7QUFFQSxRQUFJLGNBQWMsSUFBbEIsRUFBd0I7QUFDdEIsVUFBSSxTQUFTLFNBQWIsRUFBd0I7QUFDdEI7QUFDQSxnQkFBUSxjQUFjLE1BQXRCO0FBQ0QsT0FIRCxNQUdPLElBQUksQ0FBQyxNQUFNLFNBQU4sQ0FBTCxFQUF1QjtBQUM1QixnQkFBUSxTQUFTLFNBQVQsRUFBb0IsRUFBcEIsQ0FBUjtBQUNELE9BRk0sTUFFQTtBQUNMLGdCQUFRLFNBQVI7QUFDRDtBQUNGOztBQUVELFdBQU8sR0FBUCxJQUFjLEtBQWQ7QUFDRCxHQWxDRDs7QUFvQ0EsU0FBTyxNQUFQO0FBQ0Q7O0FBRUQsSUFBTSxRQUFRLEVBQWQ7O2tCQUVlO0FBQ2IsS0FEYSxlQUNULFNBRFMsRUFDRTtBQUNiLFVBQU0sSUFBTixDQUFXLFNBQVg7QUFDRCxHQUhZO0FBSWIsUUFKYSxrQkFJTixTQUpNLEVBSUs7QUFDaEIsUUFBTSxRQUFRLE1BQU0sU0FBTixDQUFnQjtBQUFBLGFBQUssT0FBTyxFQUFQLENBQVUsU0FBVixFQUFxQixDQUFyQixDQUFMO0FBQUEsS0FBaEIsQ0FBZDtBQUNBLFFBQUksUUFBUSxDQUFDLENBQWIsRUFBZ0I7QUFDZCxZQUFNLE1BQU4sQ0FBYSxLQUFiLEVBQW9CLENBQXBCO0FBQ0Q7QUFDRixHQVRZO0FBVWIsVUFWYSxvQkFVSixTQVZJLEVBVU87QUFDbEIsV0FBTyxNQUFNLE1BQU4sS0FBaUIsQ0FBakIsSUFBc0IsT0FBTyxFQUFQLENBQVUsTUFBTSxNQUFNLE1BQU4sR0FBZSxDQUFyQixDQUFWLEVBQW1DLFNBQW5DLENBQTdCO0FBQ0Q7QUFaWSxDOzs7Ozs7Ozs7Ozs7O0FDeEVmOzs7O0FBQ0E7Ozs7QUFDQTs7Ozs7Ozs7K2VBUEE7Ozs7Ozs7QUFTQSxJQUFNLFNBQVUsWUFBTTtBQUNwQjs7Ozs7O0FBTUEsTUFBTSxPQUFPLFFBQWI7QUFDQSxNQUFNLFVBQVUsT0FBaEI7QUFDQSxNQUFNLG9CQUFvQixpQkFBMUI7QUFDQSxNQUFNLHFCQUFxQjtBQUN6QixhQUFTLElBRGdCO0FBRXpCLFdBQU8sSUFGa0I7QUFHekIsYUFBUyxJQUhnQjtBQUl6QixnQkFBWTtBQUphLEdBQTNCO0FBTUEsTUFBTSx3QkFBd0IsQ0FDNUIsWUFENEIsQ0FBOUI7O0FBSUE7Ozs7OztBQXBCb0IsTUEwQmQsTUExQmM7QUFBQTs7QUE0QmxCLHNCQUEyQztBQUFBLFVBQS9CLE9BQStCLHVFQUFyQixFQUFxQjtBQUFBLFVBQWpCLFFBQWlCLHVFQUFOLElBQU07O0FBQUE7O0FBQUEsa0hBQ25DLElBRG1DLEVBQzdCLE9BRDZCLEVBQ3BCLGtCQURvQixFQUNBLE9BREEsRUFDUyxxQkFEVCxFQUNnQyxJQURoQyxFQUNzQyxJQUR0Qzs7QUFHekMsWUFBSyxRQUFMLEdBQWdCLFlBQVksS0FDNUIsa0RBRDRCLEdBRTFCLDRDQUYwQixHQUd4Qiw4QkFId0IsR0FJdEIsNkJBSnNCLEdBS3BCLGdDQUxvQixHQU10QixRQU5zQixHQU90QiwyQkFQc0IsR0FRcEIsU0FSb0IsR0FTdEIsUUFUc0IsR0FVdEIsNkJBVnNCLEdBV3BCLGlGQVhvQixHQVl0QixRQVpzQixHQWF4QixRQWJ3QixHQWMxQixRQWQwQixHQWU1QixRQWZBOztBQWlCQSxVQUFJLE1BQUssY0FBVCxFQUF5QjtBQUN2QixjQUFLLEtBQUw7QUFDRDtBQXRCd0M7QUF1QjFDOztBQW5EaUI7QUFBQTtBQUFBLDhCQXFEVjtBQUNOLFlBQU0sVUFBVSxTQUFTLGFBQVQsQ0FBdUIsS0FBdkIsQ0FBaEI7O0FBRUEsZ0JBQVEsU0FBUixHQUFvQixLQUFLLFFBQXpCOztBQUVBLGFBQUssT0FBTCxDQUFhLE9BQWIsR0FBdUIsUUFBUSxVQUEvQjs7QUFFQTtBQUNBLFlBQUksS0FBSyxPQUFMLENBQWEsS0FBYixLQUF1QixJQUEzQixFQUFpQztBQUMvQixlQUFLLE9BQUwsQ0FBYSxPQUFiLENBQXFCLGFBQXJCLENBQW1DLGVBQW5DLEVBQW9ELFNBQXBELEdBQWdFLEtBQUssT0FBTCxDQUFhLEtBQTdFO0FBQ0Q7O0FBRUQ7QUFDQSxZQUFJLEtBQUssT0FBTCxDQUFhLE9BQWIsS0FBeUIsSUFBN0IsRUFBbUM7QUFDakMsZUFBSyxPQUFMLENBQWEsT0FBYixDQUFxQixhQUFyQixDQUFtQyxjQUFuQyxFQUFtRCxVQUFuRCxDQUE4RCxTQUE5RCxHQUEwRSxLQUFLLE9BQUwsQ0FBYSxPQUF2RjtBQUNEOztBQUVELGlCQUFTLElBQVQsQ0FBYyxXQUFkLENBQTBCLEtBQUssT0FBTCxDQUFhLE9BQXZDOztBQUVBLGFBQUssYUFBTDtBQUNEO0FBekVpQjtBQUFBO0FBQUEsc0NBMkVGO0FBQ2QsWUFBTSxXQUFXLFNBQVMsYUFBVCxDQUF1QixLQUF2QixDQUFqQjtBQUNBLGlCQUFTLFlBQVQsQ0FBc0IsU0FBdEIsRUFBaUMsS0FBSyxFQUF0QztBQUNBLGlCQUFTLFNBQVQsQ0FBbUIsR0FBbkIsQ0FBdUIsaUJBQXZCOztBQUVBLGlCQUFTLElBQVQsQ0FBYyxXQUFkLENBQTBCLFFBQTFCO0FBQ0Q7QUFqRmlCO0FBQUE7QUFBQSxvQ0FtRko7QUFDWixlQUFPLFNBQVMsYUFBVCxPQUEyQixpQkFBM0Isa0JBQXlELEtBQUssRUFBOUQsUUFBUDtBQUNEO0FBckZpQjtBQUFBO0FBQUEsK0JBdUZUO0FBQ1AsWUFBTSxnQkFBZ0IsT0FBTyxnQkFBUCxDQUF3QixLQUFLLE9BQUwsQ0FBYSxPQUFyQyxDQUF0QjtBQUNBO0FBQ0EsWUFBTSxTQUFTLGNBQWMsTUFBZCxDQUFxQixLQUFyQixDQUEyQixDQUEzQixFQUE4QixjQUFjLE1BQWQsQ0FBcUIsTUFBckIsR0FBOEIsQ0FBNUQsQ0FBZjs7QUFFQSxZQUFNLE1BQU8sT0FBTyxXQUFQLEdBQXFCLENBQXRCLEdBQTRCLFNBQVMsQ0FBakQ7QUFDQSxhQUFLLE9BQUwsQ0FBYSxPQUFiLENBQXFCLEtBQXJCLENBQTJCLEdBQTNCLEdBQW9DLEdBQXBDO0FBQ0Q7QUE5RmlCO0FBQUE7QUFBQSw2QkFnR1g7QUFBQTs7QUFDTCxZQUFJLEtBQUssT0FBTCxDQUFhLE9BQWIsS0FBeUIsSUFBN0IsRUFBbUM7QUFDakM7QUFDQSxlQUFLLEtBQUw7QUFDRDs7QUFFRCxZQUFJLEtBQUssT0FBTCxDQUFhLE9BQWIsQ0FBcUIsU0FBckIsQ0FBK0IsUUFBL0IsQ0FBd0MsTUFBeEMsQ0FBSixFQUFxRDtBQUNuRCxpQkFBTyxLQUFQO0FBQ0Q7O0FBRUQ7QUFDQSxtQkFBVyxZQUFNO0FBQ2YsaUJBQUssWUFBTCxDQUFrQixpQkFBTSxJQUF4QjtBQUNBLGlCQUFLLGFBQUw7O0FBRUEsY0FBTSxVQUFVLFNBQVYsT0FBVSxHQUFNO0FBQ3BCLG1CQUFLLFlBQUwsQ0FBa0IsaUJBQU0sS0FBeEI7QUFDQSxtQkFBSyxPQUFMLENBQWEsT0FBYixDQUFxQixtQkFBckIsQ0FBeUMsaUJBQU0sY0FBL0MsRUFBK0QsT0FBL0Q7O0FBRUE7QUFDQSxtQkFBSyxZQUFMO0FBQ0QsV0FORDs7QUFRQSxpQkFBSyxPQUFMLENBQWEsT0FBYixDQUFxQixnQkFBckIsQ0FBc0MsaUJBQU0sY0FBNUMsRUFBNEQsT0FBNUQ7O0FBRUEsaUJBQUssT0FBTCxDQUFhLE9BQWIsQ0FBcUIsU0FBckIsQ0FBK0IsR0FBL0IsQ0FBbUMsTUFBbkM7O0FBRUEsaUJBQUssTUFBTDtBQUNELFNBakJELEVBaUJHLEVBakJIOztBQW1CQSxlQUFPLElBQVA7QUFDRDtBQS9IaUI7QUFBQTtBQUFBLHFDQWlJSCxLQWpJRyxFQWlJSTtBQUNwQixZQUFJLE1BQU0sSUFBTixLQUFlLE9BQWYsSUFBMEIsTUFBTSxPQUFOLEtBQWtCLEVBQTVDLElBQWtELE1BQU0sT0FBTixLQUFrQixFQUF4RSxFQUE0RTtBQUMxRTtBQUNEOztBQUVEO0FBQ0EsYUFBSyxJQUFMO0FBQ0Q7QUF4SWlCO0FBQUE7QUFBQSw2QkEwSVg7QUFBQTs7QUFDTCxZQUFJLENBQUMsS0FBSyxPQUFMLENBQWEsT0FBYixDQUFxQixTQUFyQixDQUErQixRQUEvQixDQUF3QyxNQUF4QyxDQUFMLEVBQXNEO0FBQ3BELGlCQUFPLEtBQVA7QUFDRDs7QUFFRCxhQUFLLFlBQUwsQ0FBa0IsaUJBQU0sSUFBeEI7O0FBRUEsYUFBSyxZQUFMOztBQUVBLGFBQUssT0FBTCxDQUFhLE9BQWIsQ0FBcUIsU0FBckIsQ0FBK0IsR0FBL0IsQ0FBbUMsTUFBbkM7QUFDQSxhQUFLLE9BQUwsQ0FBYSxPQUFiLENBQXFCLFNBQXJCLENBQStCLE1BQS9CLENBQXNDLE1BQXRDOztBQUVBLFlBQU0sV0FBVyxLQUFLLFdBQUwsRUFBakI7O0FBRUEsWUFBTSxXQUFXLFNBQVgsUUFBVyxHQUFNO0FBQ3JCLG1CQUFTLElBQVQsQ0FBYyxXQUFkLENBQTBCLFFBQTFCOztBQUVBLGlCQUFLLE9BQUwsQ0FBYSxPQUFiLENBQXFCLFNBQXJCLENBQStCLE1BQS9CLENBQXNDLE1BQXRDOztBQUVBLGlCQUFLLFlBQUwsQ0FBa0IsaUJBQU0sTUFBeEI7O0FBRUEsbUJBQVMsbUJBQVQsQ0FBNkIsaUJBQU0sY0FBbkMsRUFBbUQsUUFBbkQ7O0FBRUE7QUFDQSxjQUFJLE9BQUssY0FBVCxFQUF5QjtBQUN2QixxQkFBUyxJQUFULENBQWMsV0FBZCxDQUEwQixPQUFLLE9BQUwsQ0FBYSxPQUF2QztBQUNBLG1CQUFLLE9BQUwsQ0FBYSxPQUFiLEdBQXVCLElBQXZCO0FBQ0Q7QUFDRixTQWREOztBQWdCQSxpQkFBUyxnQkFBVCxDQUEwQixpQkFBTSxjQUFoQyxFQUFnRCxRQUFoRDtBQUNBLGlCQUFTLFNBQVQsQ0FBbUIsR0FBbkIsQ0FBdUIsU0FBdkI7O0FBRUEsZUFBTyxJQUFQO0FBQ0Q7QUE1S2lCO0FBQUE7QUFBQSxxQ0E4S0g7QUFBQTs7QUFDYixZQUFNLGlCQUFpQixLQUFLLE9BQUwsQ0FBYSxPQUFiLENBQXFCLGdCQUFyQixDQUFzQyxnQkFBdEMsQ0FBdkI7QUFDQSxZQUFJLGNBQUosRUFBb0I7QUFDbEIsZ0JBQU0sSUFBTixDQUFXLGNBQVgsRUFBMkIsT0FBM0IsQ0FBbUM7QUFBQSxtQkFBVSxPQUFLLGVBQUwsQ0FBcUIsRUFBRSxRQUFRLE1BQVYsRUFBa0IsT0FBTyxPQUF6QixFQUFyQixDQUFWO0FBQUEsV0FBbkM7QUFDRDs7QUFFRDtBQUNBO0FBQ0E7QUFDQSxZQUFJLEtBQUssT0FBTCxDQUFhLFVBQWpCLEVBQTZCO0FBQzNCLGNBQU0sV0FBVyxLQUFLLFdBQUwsRUFBakI7QUFDQSxlQUFLLGVBQUwsQ0FBcUIsRUFBRSxRQUFRLFFBQVYsRUFBb0IsT0FBTyxpQkFBTSxLQUFqQyxFQUFyQjtBQUNBLGVBQUssZUFBTCxDQUFxQixFQUFFLFFBQVEsUUFBVixFQUFvQixPQUFPLE9BQTNCLEVBQXJCO0FBQ0Q7QUFDRjtBQTVMaUI7QUFBQTtBQUFBLHFDQThMSDtBQUFBOztBQUNiLFlBQU0saUJBQWlCLEtBQUssT0FBTCxDQUFhLE9BQWIsQ0FBcUIsZ0JBQXJCLENBQXNDLGdCQUF0QyxDQUF2QjtBQUNBLFlBQUksY0FBSixFQUFvQjtBQUNsQixnQkFBTSxJQUFOLENBQVcsY0FBWCxFQUEyQixPQUEzQixDQUFtQztBQUFBLG1CQUFVLE9BQUssaUJBQUwsQ0FBdUIsRUFBRSxRQUFRLE1BQVYsRUFBa0IsT0FBTyxPQUF6QixFQUF2QixDQUFWO0FBQUEsV0FBbkM7QUFDRDs7QUFFRCxZQUFJLEtBQUssT0FBTCxDQUFhLFVBQWpCLEVBQTZCO0FBQzNCLGNBQU0sV0FBVyxLQUFLLFdBQUwsRUFBakI7QUFDQSxlQUFLLGlCQUFMLENBQXVCLEVBQUUsUUFBUSxRQUFWLEVBQW9CLE9BQU8saUJBQU0sS0FBakMsRUFBdkI7QUFDQSxlQUFLLGlCQUFMLENBQXVCLEVBQUUsUUFBUSxRQUFWLEVBQW9CLE9BQU8sT0FBM0IsRUFBdkI7QUFDRDtBQUNGO0FBek1pQjtBQUFBO0FBQUEsbUNBMk1FO0FBQ2xCLGVBQU8sSUFBUDtBQUNEO0FBN01pQjtBQUFBO0FBQUEsb0NBK01HLE9BL01ILEVBK01ZO0FBQzVCLHlHQUEyQixNQUEzQixFQUFtQyxPQUFuQztBQUNEO0FBak5pQjs7QUFBQTtBQUFBOztBQW9OcEI7Ozs7Ozs7QUFLQSxNQUFNLGFBQWEsRUFBbkI7O0FBRUEsTUFBTSxVQUFVLFNBQVMsZ0JBQVQsT0FBOEIsSUFBOUIsQ0FBaEI7QUFDQSxNQUFJLE9BQUosRUFBYTtBQUNYLFVBQU0sSUFBTixDQUFXLE9BQVgsRUFBb0IsT0FBcEIsQ0FBNEIsVUFBQyxPQUFELEVBQWE7QUFDdkMsVUFBTSxTQUFTLDJDQUFvQixPQUFwQixFQUE2QixrQkFBN0IsRUFBaUQscUJBQWpELENBQWY7QUFDQSxhQUFPLE9BQVAsR0FBaUIsT0FBakI7O0FBRUEsaUJBQVcsSUFBWCxDQUFnQixFQUFFLGdCQUFGLEVBQVcsUUFBUSxJQUFJLE1BQUosQ0FBVyxNQUFYLENBQW5CLEVBQWhCO0FBQ0QsS0FMRDtBQU1EOztBQUVELE1BQUksT0FBSixFQUFhO0FBQ1gsYUFBUyxnQkFBVCxDQUEwQixPQUExQixFQUFtQyxVQUFDLEtBQUQsRUFBVztBQUM1QyxVQUFNLGlCQUFpQixNQUFNLE1BQU4sQ0FBYSxZQUFiLENBQTBCLGFBQTFCLENBQXZCO0FBQ0EsVUFBSSxrQkFBa0IsbUJBQW1CLElBQXpDLEVBQStDO0FBQzdDLFlBQU0sS0FBSyxNQUFNLE1BQU4sQ0FBYSxZQUFiLENBQTBCLGFBQTFCLENBQVg7QUFDQSxZQUFNLFVBQVUsU0FBUyxhQUFULENBQXVCLEVBQXZCLENBQWhCOztBQUVBLFlBQU0sWUFBWSxXQUFXLElBQVgsQ0FBZ0I7QUFBQSxpQkFBSyxFQUFFLE9BQUYsS0FBYyxPQUFuQjtBQUFBLFNBQWhCLENBQWxCOztBQUVBLFlBQUksQ0FBQyxTQUFMLEVBQWdCO0FBQ2Q7QUFDRDs7QUFFRDtBQUNBLGNBQU0sTUFBTixDQUFhLElBQWI7O0FBRUEsa0JBQVUsTUFBVixDQUFpQixJQUFqQjtBQUNEO0FBQ0YsS0FqQkQ7QUFrQkQ7O0FBRUQsU0FBTyxNQUFQO0FBQ0QsQ0EzUGMsRUFBZjs7a0JBNlBlLE07Ozs7Ozs7Ozs7O0FDalFmOzs7O0FBQ0E7O0FBQ0E7Ozs7Ozs7OytlQVBBOzs7Ozs7O0FBU0EsSUFBTSxTQUFVLFlBQU07O0FBRXBCOzs7Ozs7QUFNQSxNQUFNLE9BQU8sUUFBYjtBQUNBLE1BQU0sb0JBQW9CLGlCQUExQjtBQUNBLE1BQU0scUJBQXFCO0FBQ3pCLGFBQVMsSUFEZ0I7QUFFekIsV0FBTyxJQUZrQjtBQUd6QixhQUFTLElBSGdCO0FBSXpCLGdCQUFZO0FBSmEsR0FBM0I7QUFNQSxNQUFNLHdCQUF3QixDQUM1QixZQUQ0QixDQUE5Qjs7QUFJQTs7Ozs7O0FBcEJvQixNQTBCZCxNQTFCYztBQUFBOztBQTRCbEIsc0JBQTBCO0FBQUEsVUFBZCxPQUFjLHVFQUFKLEVBQUk7O0FBQUE7O0FBQ3hCLFVBQU0sV0FBVyxLQUNqQixrREFEaUIsR0FFZiw0Q0FGZSxHQUdiLDhCQUhhLEdBSVgsNkJBSlcsR0FLVCxnQ0FMUyxHQU1YLFFBTlcsR0FPWCwyQkFQVyxHQVFULG1EQVJTLEdBU1gsUUFUVyxHQVVYLDZCQVZXLEdBV1QsaUZBWFMsR0FZWCxRQVpXLEdBYWIsUUFiYSxHQWNmLFFBZGUsR0FlakIsUUFmQTs7QUFEd0IsNkdBa0JsQixPQWxCa0IsRUFrQlQsUUFsQlM7QUFtQnpCOztBQS9DaUI7QUFBQTtBQUFBLG9DQWlERyxPQWpESCxFQWlEWTtBQUM1QixlQUFPLElBQUksTUFBSixDQUFXLE9BQVgsQ0FBUDtBQUNEO0FBbkRpQjs7QUFBQTtBQUFBOztBQXNEcEI7Ozs7Ozs7QUFLQSxNQUFNLGFBQWEsRUFBbkI7QUFDQSxNQUFNLFVBQVUsU0FBUyxnQkFBVCxPQUE4QixJQUE5QixDQUFoQjs7QUFFQSxNQUFJLE9BQUosRUFBYTtBQUNYLFVBQU0sSUFBTixDQUFXLE9BQVgsRUFBb0IsT0FBcEIsQ0FBNEIsVUFBQyxPQUFELEVBQWE7QUFDdkMsVUFBTSxTQUFTLDJDQUFvQixPQUFwQixFQUE2QixrQkFBN0IsRUFBaUQscUJBQWpELENBQWY7QUFDQSxhQUFPLE9BQVAsR0FBaUIsT0FBakI7O0FBRUEsVUFBSSxPQUFPLElBQVAsS0FBZ0IsT0FBcEIsRUFBNkI7QUFDM0I7QUFDQSxtQkFBVyxJQUFYLENBQWdCLElBQUksTUFBSixDQUFXLE1BQVgsQ0FBaEI7QUFDRDtBQUNGLEtBUkQ7QUFTRDs7QUFFRCxNQUFJLE9BQUosRUFBYTtBQUNYLGFBQVMsZ0JBQVQsQ0FBMEIsT0FBMUIsRUFBbUMsVUFBQyxLQUFELEVBQVc7QUFDNUMsVUFBTSxlQUFlLDhCQUFrQixNQUFNLE1BQXhCLEVBQWdDLGVBQWhDLENBQXJCO0FBQ0EsVUFBSSxZQUFKLEVBQWtCO0FBQ2hCO0FBQ0Q7O0FBRUQsVUFBTSxXQUFXLDhCQUFrQixNQUFNLE1BQXhCLEVBQWdDLFVBQWhDLENBQWpCOztBQUVBLFVBQUksUUFBSixFQUFjO0FBQ1osWUFBTSxpQkFBaUIsU0FBUyxZQUFULENBQXNCLGFBQXRCLENBQXZCO0FBQ0EsWUFBSSxrQkFBa0IsbUJBQW1CLElBQXJDLElBQTZDLFFBQWpELEVBQTJEO0FBQ3pELGNBQU0sWUFBWSxXQUFXLElBQVgsQ0FBZ0I7QUFBQSxtQkFBSyxFQUFFLFVBQUYsT0FBbUIsUUFBeEI7QUFBQSxXQUFoQixDQUFsQjs7QUFFQSxjQUFJLENBQUMsU0FBTCxFQUFnQjtBQUNkO0FBQ0Q7O0FBRUQsb0JBQVUsTUFBVjtBQUNEO0FBQ0Y7QUFDRixLQXBCRDtBQXFCRDs7QUFFRCxTQUFPLE1BQVA7QUFDRCxDQW5HYyxFQUFmOztrQkFxR2UsTTs7Ozs7Ozs7Ozs7OztBQ3pHZjs7OztBQUNBOzs7O0FBQ0E7O0FBQ0E7Ozs7Ozs7OytlQVJBOzs7Ozs7O0FBVUEsSUFBTSxXQUFZLFlBQU07QUFDdEI7Ozs7OztBQU1BLE1BQU0sT0FBTyxVQUFiO0FBQ0EsTUFBTSxVQUFVLE9BQWhCO0FBQ0EsTUFBTSxxQkFBcUI7QUFDekIsYUFBUyxJQURnQjtBQUV6QixhQUFTLElBRmdCO0FBR3pCLFlBQVE7QUFIaUIsR0FBM0I7QUFLQSxNQUFNLHdCQUF3QixDQUM1QixTQUQ0QixFQUU1QixRQUY0QixDQUE5Qjs7QUFLQTs7Ozs7O0FBbkJzQixNQXlCaEIsUUF6QmdCO0FBQUE7O0FBMkJwQix3QkFBMEI7QUFBQSxVQUFkLE9BQWMsdUVBQUosRUFBSTs7QUFBQTs7QUFBQSxzSEFDbEIsSUFEa0IsRUFDWixPQURZLEVBQ0gsa0JBREcsRUFDaUIsT0FEakIsRUFDMEIscUJBRDFCLEVBQ2lELEtBRGpELEVBQ3dELEtBRHhEOztBQUd4QixVQUFNLFdBQVcsTUFBSyxPQUFMLENBQWEsT0FBYixDQUFxQixhQUFyQixDQUFtQyxpQkFBbkMsQ0FBakI7QUFDQSxVQUFNLE9BQU8sTUFBSyxXQUFMLENBQWlCLFFBQWpCLENBQWI7O0FBRUEsWUFBSyxXQUFMLENBQWlCLEtBQUssS0FBdEIsRUFBNkIsS0FBSyxJQUFsQyxFQUF3QyxLQUF4QztBQU53QjtBQU96Qjs7QUFsQ21CO0FBQUE7QUFBQSxvQ0FvQ3FDO0FBQUEsWUFBN0MsS0FBNkMsdUVBQXJDLEVBQXFDOztBQUFBOztBQUFBLFlBQWpDLElBQWlDLHVFQUExQixJQUEwQjtBQUFBLFlBQXBCLFdBQW9CLHVFQUFOLElBQU07O0FBQ3ZELFlBQUksQ0FBQyxLQUFLLE9BQUwsQ0FBYSxPQUFsQixFQUEyQjtBQUN6QixpQkFBTyxLQUFQO0FBQ0Q7O0FBRUQsWUFBSSxjQUFjLElBQWxCO0FBQ0EsYUFBSyxPQUFMLENBQWEsT0FBYixDQUFxQixhQUFyQixDQUFtQyxlQUFuQyxFQUFvRCxTQUFwRCxHQUFnRSxJQUFoRTtBQUNBLGFBQUssT0FBTCxDQUFhLE9BQWIsQ0FBcUIsYUFBckIsQ0FBbUMsc0JBQW5DLEVBQTJELEtBQTNELEdBQW1FLEtBQW5FOztBQUVBLFlBQU0sUUFBUSxLQUFLLE9BQUwsQ0FBYSxPQUFiLENBQXFCLGdCQUFyQixDQUFzQyxPQUF0QyxLQUFrRCxFQUFoRTtBQUNBLFlBQUksWUFBWSxLQUFoQjs7QUFFQSxjQUFNLElBQU4sQ0FBVyxLQUFYLEVBQWtCLE9BQWxCLENBQTBCLFVBQUMsSUFBRCxFQUFVO0FBQ2xDLGNBQUksS0FBSyxTQUFMLENBQWUsUUFBZixDQUF3QixVQUF4QixDQUFKLEVBQXlDO0FBQ3ZDLGlCQUFLLFNBQUwsQ0FBZSxNQUFmLENBQXNCLFVBQXRCO0FBQ0Q7O0FBRUQsY0FBTSxPQUFPLE9BQUssV0FBTCxDQUFpQixJQUFqQixDQUFiOztBQUVBLGNBQUksVUFBVSxLQUFLLEtBQW5CLEVBQTBCO0FBQ3hCLGdCQUFJLENBQUMsS0FBSyxTQUFMLENBQWUsUUFBZixDQUF3QixVQUF4QixDQUFMLEVBQTBDO0FBQ3hDLG1CQUFLLFNBQUwsQ0FBZSxHQUFmLENBQW1CLFVBQW5CO0FBQ0Q7O0FBRUQsMEJBQWMsS0FBSyxJQUFuQjtBQUNBLHdCQUFZLElBQVo7QUFDRDtBQUNGLFNBZkQ7O0FBaUJBLFlBQUksZUFBZSxTQUFuQixFQUE4QjtBQUM1QixlQUFLLE9BQUwsQ0FBYSxPQUFiLENBQXFCLGFBQXJCLENBQW1DLGVBQW5DLEVBQW9ELFNBQXBELEdBQWdFLFdBQWhFO0FBQ0QsU0FGRCxNQUVPLElBQUksZUFBZSxDQUFDLFNBQXBCLEVBQStCO0FBQ3BDLGdCQUFNLElBQUksS0FBSixDQUFhLElBQWIscUJBQWlDLEtBQWpDLDRDQUFOO0FBQ0Q7O0FBRUQsZUFBTyxJQUFQO0FBQ0Q7QUF4RW1CO0FBQUE7QUFBQSxvQ0EwRU47QUFDWixlQUFPLEtBQUssT0FBTCxDQUFhLE9BQWIsQ0FBcUIsYUFBckIsQ0FBbUMsc0JBQW5DLEVBQTJELEtBQWxFO0FBQ0Q7QUE1RW1CO0FBQUE7QUFBQSxvQ0E4RUs7QUFBQSxZQUFiLElBQWEsdUVBQU4sSUFBTTs7QUFDdkIsWUFBSSxPQUFPLEVBQVg7QUFDQSxZQUFJLFFBQVEsRUFBWjs7QUFFQSxZQUFJLElBQUosRUFBVTtBQUNSLGlCQUFPLEtBQUssWUFBTCxDQUFrQixXQUFsQixLQUFrQyxLQUFLLFNBQTlDOztBQUVBLGNBQU0sbUJBQW1CLEtBQUssYUFBTCxDQUFtQixPQUFuQixDQUF6QjtBQUNBLGNBQUksZ0JBQUosRUFBc0I7QUFDcEIsbUJBQU8saUJBQWlCLFNBQXhCO0FBQ0Q7O0FBRUQsa0JBQVEsS0FBSyxZQUFMLENBQWtCLFlBQWxCLEtBQW1DLEVBQTNDO0FBQ0Q7O0FBRUQsZUFBTyxFQUFFLFVBQUYsRUFBUSxZQUFSLEVBQVA7QUFDRDtBQTlGbUI7QUFBQTtBQUFBLHFDQWdHTCxLQWhHSyxFQWdHRTtBQUNwQixZQUFJLE1BQU0sSUFBTixLQUFlLGlCQUFNLEtBQXpCLEVBQWdDO0FBQzlCLGNBQU0sV0FBVyw4QkFBa0IsTUFBTSxNQUF4QixFQUFnQyxVQUFoQyxDQUFqQjs7QUFFQTs7OztBQUlBLGNBQUksQ0FBQyxRQUFELElBQWEsYUFBYSxLQUFLLFVBQUwsRUFBOUIsRUFBaUQ7QUFDL0MsaUJBQUssSUFBTDtBQUNEO0FBRUYsU0FYRCxNQVdPLElBQUksTUFBTSxJQUFOLEtBQWUsT0FBbkIsRUFBNEI7QUFDakMsY0FBTSxPQUFPLDhCQUFrQixNQUFNLE1BQXhCLEVBQWdDLE1BQWhDLENBQWI7O0FBRUEsY0FBSSxJQUFKLEVBQVU7QUFDUixnQkFBSSxLQUFLLFNBQUwsQ0FBZSxRQUFmLENBQXdCLFVBQXhCLENBQUosRUFBeUM7QUFDdkM7QUFDRDs7QUFFRCxnQkFBTSxXQUFXLEtBQUssV0FBTCxDQUFpQixJQUFqQixDQUFqQjs7QUFFQSxnQkFBSSxLQUFLLFdBQUwsT0FBdUIsU0FBUyxLQUFwQyxFQUEyQztBQUN6QztBQUNBLG1CQUFLLFdBQUwsQ0FBaUIsU0FBUyxLQUExQixFQUFpQyxTQUFTLElBQTFDLEVBQWdELEtBQWhEO0FBQ0Esa0JBQU0sU0FBUyxFQUFFLFVBQUYsRUFBUSxNQUFNLFNBQVMsSUFBdkIsRUFBNkIsT0FBTyxTQUFTLEtBQTdDLEVBQWY7QUFDQSxtQkFBSyxZQUFMLENBQWtCLGlCQUFNLGFBQXhCLEVBQXVDLE1BQXZDO0FBQ0Q7O0FBRUQsaUJBQUssSUFBTDtBQUNBO0FBQ0Q7O0FBRUQ7QUFDQSxjQUFNLGVBQWUsOEJBQWtCLE1BQU0sTUFBeEIsRUFBZ0MsZUFBaEMsQ0FBckI7QUFDQSxjQUFJLFlBQUosRUFBa0I7QUFDaEI7QUFDRDs7QUFFRCxlQUFLLE1BQUw7QUFDRDtBQUNGO0FBekltQjtBQUFBO0FBQUEsK0JBMklYO0FBQ1AsWUFBSSxLQUFLLE9BQUwsQ0FBYSxPQUFiLENBQXFCLFNBQXJCLENBQStCLFFBQS9CLENBQXdDLFFBQXhDLENBQUosRUFBdUQ7QUFDckQsaUJBQU8sS0FBSyxJQUFMLEVBQVA7QUFDRDs7QUFFRCxlQUFPLEtBQUssSUFBTCxFQUFQO0FBQ0Q7QUFqSm1CO0FBQUE7QUFBQSw2QkFtSmI7QUFDTCxZQUFJLEtBQUssT0FBTCxDQUFhLE9BQWIsQ0FBcUIsU0FBckIsQ0FBK0IsUUFBL0IsQ0FBd0MsUUFBeEMsQ0FBSixFQUF1RDtBQUNyRCxpQkFBTyxLQUFQO0FBQ0Q7O0FBRUQsYUFBSyxPQUFMLENBQWEsT0FBYixDQUFxQixTQUFyQixDQUErQixHQUEvQixDQUFtQyxRQUFuQzs7QUFFQSxZQUFNLGVBQWUsS0FBSyxPQUFMLENBQWEsT0FBYixDQUFxQixhQUFyQixDQUFtQyxnQkFBbkMsQ0FBckI7O0FBRUE7QUFDQSxxQkFBYSxTQUFiLEdBQXlCLENBQXpCOztBQUVBLGFBQUssWUFBTCxDQUFrQixpQkFBTSxJQUF4QjtBQUNBLGFBQUssWUFBTCxDQUFrQixpQkFBTSxLQUF4Qjs7QUFFQSxhQUFLLGVBQUwsQ0FBcUIsRUFBRSxRQUFRLFlBQVYsRUFBd0IsT0FBTyxPQUEvQixFQUFyQjtBQUNBLGFBQUssZUFBTCxDQUFxQixFQUFFLFFBQVEsU0FBUyxJQUFuQixFQUF5QixPQUFPLGlCQUFNLEtBQXRDLEVBQXJCOztBQUVBLGVBQU8sSUFBUDtBQUNEO0FBdEttQjtBQUFBO0FBQUEsNkJBd0tiO0FBQ0wsWUFBSSxDQUFDLEtBQUssT0FBTCxDQUFhLE9BQWIsQ0FBcUIsU0FBckIsQ0FBK0IsUUFBL0IsQ0FBd0MsUUFBeEMsQ0FBTCxFQUF3RDtBQUN0RCxpQkFBTyxLQUFQO0FBQ0Q7O0FBRUQsYUFBSyxPQUFMLENBQWEsT0FBYixDQUFxQixTQUFyQixDQUErQixNQUEvQixDQUFzQyxRQUF0Qzs7QUFFQSxhQUFLLFlBQUwsQ0FBa0IsaUJBQU0sSUFBeEI7QUFDQSxhQUFLLFlBQUwsQ0FBa0IsaUJBQU0sTUFBeEI7O0FBRUEsYUFBSyxpQkFBTCxDQUF1QixFQUFFLFFBQVEsS0FBSyxPQUFMLENBQWEsT0FBYixDQUFxQixhQUFyQixDQUFtQyxnQkFBbkMsQ0FBVixFQUFnRSxPQUFPLE9BQXZFLEVBQXZCO0FBQ0EsYUFBSyxpQkFBTCxDQUF1QixFQUFFLFFBQVEsU0FBUyxJQUFuQixFQUF5QixPQUFPLGlCQUFNLEtBQXRDLEVBQXZCOztBQUVBLGVBQU8sSUFBUDtBQUNEO0FBdExtQjtBQUFBO0FBQUEsbUNBd0xBO0FBQ2xCLGVBQU8sSUFBUDtBQUNEO0FBMUxtQjtBQUFBO0FBQUEsb0NBNExDLE9BNUxELEVBNExVO0FBQzVCLDZHQUEyQixRQUEzQixFQUFxQyxPQUFyQztBQUNEO0FBOUxtQjs7QUFBQTtBQUFBOztBQWlNdEI7Ozs7Ozs7QUFLQSxNQUFNLGFBQWEsRUFBbkI7O0FBRUEsTUFBTSxZQUFZLFNBQVMsZ0JBQVQsT0FBOEIsSUFBOUIsQ0FBbEI7QUFDQSxNQUFJLFNBQUosRUFBZTtBQUNiLFVBQU0sSUFBTixDQUFXLFNBQVgsRUFBc0IsT0FBdEIsQ0FBOEIsVUFBQyxPQUFELEVBQWE7QUFDekMsVUFBTSxTQUFTLDJDQUFvQixPQUFwQixFQUE2QixrQkFBN0IsRUFBaUQscUJBQWpELENBQWY7QUFDQSxhQUFPLE9BQVAsR0FBaUIsT0FBakI7O0FBRUEsVUFBSSxDQUFDLE9BQU8sTUFBWixFQUFvQjtBQUNsQixtQkFBVyxJQUFYLENBQWdCLElBQUksUUFBSixDQUFhLE1BQWIsQ0FBaEI7QUFDRDtBQUNGLEtBUEQ7QUFRRDs7QUFFRCxNQUFJLFNBQUosRUFBZTtBQUNiLGFBQVMsZ0JBQVQsQ0FBMEIsT0FBMUIsRUFBbUMsVUFBQyxLQUFELEVBQVc7QUFDNUMsVUFBTSxlQUFlLDhCQUFrQixNQUFNLE1BQXhCLEVBQWdDLGVBQWhDLENBQXJCO0FBQ0EsVUFBSSxZQUFKLEVBQWtCO0FBQ2hCO0FBQ0Q7O0FBRUQsVUFBTSxXQUFXLDhCQUFrQixNQUFNLE1BQXhCLEVBQWdDLFVBQWhDLENBQWpCOztBQUVBLFVBQUksUUFBSixFQUFjO0FBQ1osWUFBTSxpQkFBaUIsU0FBUyxZQUFULENBQXNCLGFBQXRCLENBQXZCO0FBQ0EsWUFBSSxrQkFBa0IsbUJBQW1CLElBQXJDLElBQTZDLFFBQWpELEVBQTJEO0FBQ3pELGNBQU0sWUFBWSxXQUFXLElBQVgsQ0FBZ0I7QUFBQSxtQkFBSyxFQUFFLFVBQUYsT0FBbUIsUUFBeEI7QUFBQSxXQUFoQixDQUFsQjs7QUFFQSxjQUFJLENBQUMsU0FBTCxFQUFnQjtBQUNkO0FBQ0Q7O0FBRUQsb0JBQVUsTUFBVjtBQUNEO0FBQ0Y7QUFDRixLQXBCRDtBQXFCRDs7QUFFRCxTQUFPLFFBQVA7QUFDRCxDQTdPZ0IsRUFBakI7O2tCQStPZSxROzs7Ozs7Ozs7Ozs7O0FDcFBmOzs7O0FBQ0E7O0FBQ0E7Ozs7Ozs7OytlQVBBOzs7Ozs7O0FBU0EsSUFBTSxpQkFBa0IsWUFBTTs7QUFFNUI7Ozs7OztBQU1BLE1BQU0sT0FBTyxnQkFBUyxVQUFULEVBQWI7QUFDQSxNQUFNLHFCQUFxQjtBQUN6QixhQUFTLElBRGdCO0FBRXpCLGFBQVMsSUFGZ0I7QUFHekIsWUFBUTtBQUhpQixHQUEzQjtBQUtBLE1BQU0sd0JBQXdCLENBQzVCLFNBRDRCLEVBRTVCLFFBRjRCLENBQTlCOztBQUtBOzs7Ozs7QUFuQjRCLE1BeUJ0QixjQXpCc0I7QUFBQTs7QUEyQjFCLDhCQUEwQjtBQUFBLFVBQWQsT0FBYyx1RUFBSixFQUFJOztBQUFBOztBQUFBLGtJQUNsQixPQURrQjs7QUFHeEIsWUFBSyxrQkFBTCxHQUEwQixVQUFDLEtBQUQsRUFBVztBQUNuQyxZQUFNLFNBQVMsTUFBTSxNQUFOLENBQWEsS0FBNUI7O0FBRUEsWUFBSSxXQUFXLEVBQWYsRUFBbUI7QUFDakIsZ0JBQUssU0FBTDtBQUNBO0FBQ0Q7O0FBR0QsY0FBSyxRQUFMLEdBQWdCLE9BQWhCLENBQXdCLFVBQUMsSUFBRCxFQUFVO0FBQ2hDLGNBQU0sS0FBSyxPQUFPLE1BQUssT0FBTCxDQUFhLFVBQXBCLEtBQW1DLFVBQW5DLEdBQWdELE1BQUssT0FBTCxDQUFhLFVBQTdELEdBQTBFLE1BQUssVUFBMUY7O0FBRUEsY0FBSSxHQUFHLE1BQUgsRUFBVyxJQUFYLENBQUosRUFBc0I7QUFDcEIsaUJBQUssT0FBTCxDQUFhLEtBQWIsQ0FBbUIsT0FBbkIsR0FBNkIsT0FBN0I7QUFDRCxXQUZELE1BRU87QUFDTCxpQkFBSyxPQUFMLENBQWEsS0FBYixDQUFtQixPQUFuQixHQUE2QixNQUE3QjtBQUNEO0FBQ0YsU0FSRDtBQVNELE9BbEJEOztBQW9CQSxZQUFLLGNBQUwsR0FBc0IsZ0JBQXRCLENBQXVDLE9BQXZDLEVBQWdELE1BQUssa0JBQXJEO0FBdkJ3QjtBQXdCekI7O0FBbkR5QjtBQUFBO0FBQUEsbUNBcURTO0FBQUEsWUFBeEIsTUFBd0IsdUVBQWYsRUFBZTtBQUFBLFlBQVgsSUFBVyx1RUFBSixFQUFJOztBQUNqQyxZQUFJLEtBQUssS0FBTCxDQUFXLE9BQVgsQ0FBbUIsTUFBbkIsSUFBNkIsQ0FBQyxDQUE5QixJQUNDLEtBQUssSUFBTCxDQUFVLE9BQVYsQ0FBa0IsTUFBbEIsSUFBNEIsQ0FBQyxDQURsQyxFQUNxQztBQUNuQyxpQkFBTyxJQUFQO0FBQ0Q7O0FBRUQsZUFBTyxLQUFQO0FBQ0Q7QUE1RHlCO0FBQUE7QUFBQSxpQ0E4RGY7QUFBQTs7QUFDVCxZQUFJLFFBQVEsTUFBTSxJQUFOLENBQVcsS0FBSyxPQUFMLENBQWEsT0FBYixDQUFxQixnQkFBckIsQ0FBc0MsT0FBdEMsS0FBa0QsRUFBN0QsQ0FBWjtBQUNBLGdCQUFRLE1BQU0sR0FBTixDQUFVLFVBQUMsSUFBRCxFQUFVO0FBQzFCLGNBQU0sT0FBTyxPQUFLLFdBQUwsQ0FBaUIsSUFBakIsQ0FBYjtBQUNBLGlCQUFPLEVBQUUsTUFBTSxLQUFLLElBQWIsRUFBbUIsT0FBTyxLQUFLLEtBQS9CLEVBQXNDLFNBQVMsSUFBL0MsRUFBUDtBQUNELFNBSE8sQ0FBUjs7QUFLQSxlQUFPLEtBQVA7QUFDRDtBQXRFeUI7QUFBQTtBQUFBLGtDQXdFZDtBQUNWLGFBQUssUUFBTCxHQUFnQixPQUFoQixDQUF3QixVQUFDLElBQUQsRUFBVTtBQUNoQyxlQUFLLE9BQUwsQ0FBYSxLQUFiLENBQW1CLE9BQW5CLEdBQTZCLE9BQTdCO0FBQ0QsU0FGRDtBQUdEO0FBNUV5QjtBQUFBO0FBQUEsdUNBOEVUO0FBQ2YsZUFBTyxLQUFLLE9BQUwsQ0FBYSxPQUFiLENBQXFCLGFBQXJCLENBQW1DLHNCQUFuQyxDQUFQO0FBQ0Q7QUFoRnlCO0FBQUE7QUFBQSw2QkFrRm5CO0FBQ0wsa0lBQWtCO0FBQ2hCO0FBQ0EsZUFBSyxjQUFMLEdBQXNCLEtBQXRCLEdBQThCLEVBQTlCO0FBQ0E7QUFDQSxlQUFLLFNBQUw7QUFDRDtBQUNGO0FBekZ5QjtBQUFBO0FBQUEsb0NBMkZMLE9BM0ZLLEVBMkZJO0FBQzVCLGVBQU8sSUFBSSxjQUFKLENBQW1CLE9BQW5CLENBQVA7QUFDRDtBQTdGeUI7O0FBQUE7QUFBQTs7QUFnRzVCOzs7Ozs7O0FBS0EsTUFBTSxhQUFhLEVBQW5CO0FBQ0EsTUFBTSxZQUFZLFNBQVMsZ0JBQVQsT0FBOEIsSUFBOUIsQ0FBbEI7O0FBRUEsTUFBSSxTQUFKLEVBQWU7QUFDYixVQUFNLElBQU4sQ0FBVyxTQUFYLEVBQXNCLE9BQXRCLENBQThCLFVBQUMsT0FBRCxFQUFhO0FBQ3pDLFVBQU0sU0FBUywyQ0FBb0IsT0FBcEIsRUFBNkIsa0JBQTdCLEVBQWlELHFCQUFqRCxDQUFmO0FBQ0EsYUFBTyxPQUFQLEdBQWlCLE9BQWpCOztBQUVBLFVBQUksT0FBTyxNQUFYLEVBQW1CO0FBQ2pCO0FBQ0EsbUJBQVcsSUFBWCxDQUFnQixJQUFJLGNBQUosQ0FBbUIsTUFBbkIsQ0FBaEI7QUFDRDtBQUNGLEtBUkQ7QUFTRDs7QUFFRCxNQUFJLFNBQUosRUFBZTtBQUNiLGFBQVMsZ0JBQVQsQ0FBMEIsT0FBMUIsRUFBbUMsVUFBQyxLQUFELEVBQVc7QUFDNUMsVUFBTSxlQUFlLDhCQUFrQixNQUFNLE1BQXhCLEVBQWdDLGVBQWhDLENBQXJCO0FBQ0EsVUFBSSxZQUFKLEVBQWtCO0FBQ2hCO0FBQ0Q7O0FBRUQsVUFBTSxXQUFXLDhCQUFrQixNQUFNLE1BQXhCLEVBQWdDLFVBQWhDLENBQWpCOztBQUVBLFVBQUksUUFBSixFQUFjO0FBQ1osWUFBTSxpQkFBaUIsU0FBUyxZQUFULENBQXNCLGFBQXRCLENBQXZCO0FBQ0EsWUFBSSxrQkFBa0IsbUJBQW1CLElBQXJDLElBQTZDLFFBQWpELEVBQTJEO0FBQ3pELGNBQU0sWUFBWSxXQUFXLElBQVgsQ0FBZ0I7QUFBQSxtQkFBSyxFQUFFLFVBQUYsT0FBbUIsUUFBeEI7QUFBQSxXQUFoQixDQUFsQjs7QUFFQSxjQUFJLENBQUMsU0FBTCxFQUFnQjtBQUNkO0FBQ0Q7O0FBRUQsb0JBQVUsTUFBVjtBQUNEO0FBQ0Y7QUFDRixLQXBCRDtBQXFCRDs7QUFFRCxTQUFPLGNBQVA7QUFDRCxDQTdJc0IsRUFBdkI7O2tCQStJZSxjOzs7Ozs7Ozs7Ozs7O0FDbkpmOzs7Ozs7Ozs7OytlQUxBOzs7Ozs7O0FBT0EsSUFBTSxTQUFVLFlBQU07QUFDcEI7Ozs7OztBQU1BLE1BQU0sT0FBTyxRQUFiO0FBQ0EsTUFBTSxVQUFVLE9BQWhCO0FBQ0EsTUFBTSxxQkFBcUI7QUFDekIsYUFBUyxJQURnQjtBQUV6QixXQUFPLElBRmtCO0FBR3pCLFVBQU07QUFIbUIsR0FBM0I7QUFLQSxNQUFNLHdCQUF3QixFQUE5Qjs7QUFFQTs7Ozs7O0FBaEJvQixNQXNCZCxNQXRCYztBQUFBOztBQXdCbEIsc0JBQTBCO0FBQUEsVUFBZCxPQUFjLHVFQUFKLEVBQUk7O0FBQUE7O0FBR3hCO0FBSHdCLGtIQUNsQixJQURrQixFQUNaLE9BRFksRUFDSCxrQkFERyxFQUNpQixPQURqQixFQUMwQixxQkFEMUIsRUFDaUQsS0FEakQsRUFDd0QsS0FEeEQ7O0FBSXhCLFVBQU0sZ0JBQWdCLE1BQUssVUFBTCxFQUF0QjtBQUNBLFVBQUksT0FBTyxNQUFLLE9BQUwsQ0FBYSxLQUFwQixLQUE4QixRQUE5QixJQUNDLENBQUMsY0FBYyxTQUFkLENBQXdCLFFBQXhCLFlBQTBDLE1BQUssT0FBTCxDQUFhLEtBQXZELENBRE4sRUFDdUU7QUFDckUsc0JBQWMsU0FBZCxDQUF3QixHQUF4QixZQUFxQyxNQUFLLE9BQUwsQ0FBYSxLQUFsRDtBQUNEOztBQUVELFlBQUssVUFBTCxHQUFrQixNQUFLLE9BQUwsQ0FBYSxJQUFiLEtBQXNCLElBQXhDO0FBVndCO0FBV3pCOztBQW5DaUI7QUFBQTtBQUFBLHNDQXFDRjtBQUNkLFlBQUksQ0FBQyxLQUFLLFVBQVYsRUFBc0I7QUFDcEIsY0FBTSxPQUFPLEtBQUssT0FBTCxDQUFhLE9BQWIsQ0FBcUIscUJBQXJCLEVBQWI7QUFDQSxpQkFBTyxLQUFLLE1BQVo7QUFDRDs7QUFFRCxlQUFPLEtBQUssT0FBTCxDQUFhLElBQXBCO0FBQ0Q7QUE1Q2lCO0FBQUE7QUFBQSxtQ0E4Q0w7QUFDWCxlQUFPLEtBQUssT0FBTCxDQUFhLE9BQWIsQ0FBcUIsYUFBckIsQ0FBbUMsaUJBQW5DLENBQVA7QUFDRDtBQWhEaUI7QUFBQTtBQUFBLDZCQWtEWDtBQUNMLFlBQUksS0FBSyxPQUFMLENBQWEsT0FBYixDQUFxQixTQUFyQixDQUErQixRQUEvQixDQUF3QyxNQUF4QyxDQUFKLEVBQXFEO0FBQ25ELGVBQUssT0FBTCxDQUFhLE9BQWIsQ0FBcUIsU0FBckIsQ0FBK0IsTUFBL0IsQ0FBc0MsTUFBdEM7QUFDRDs7QUFFRCxZQUFNLE9BQU8sS0FBSyxhQUFMLEVBQWI7QUFDQSxhQUFLLE9BQUwsQ0FBYSxJQUFiLEdBQW9CLElBQXBCOztBQUVBLFlBQUksS0FBSyxVQUFULEVBQXFCO0FBQ25CLGVBQUssT0FBTCxDQUFhLE9BQWIsQ0FBcUIsS0FBckIsQ0FBMkIsS0FBM0IsR0FBc0MsS0FBSyxPQUFMLENBQWEsSUFBbkQ7QUFDQSxlQUFLLE9BQUwsQ0FBYSxPQUFiLENBQXFCLEtBQXJCLENBQTJCLE1BQTNCLEdBQXVDLEtBQUssT0FBTCxDQUFhLElBQXBEOztBQUVBLGNBQU0sZ0JBQWdCLEtBQUssVUFBTCxFQUF0QjtBQUNBLHdCQUFjLEtBQWQsQ0FBb0IsS0FBcEIsR0FBK0IsS0FBSyxPQUFMLENBQWEsSUFBNUM7QUFDQSx3QkFBYyxLQUFkLENBQW9CLE1BQXBCLEdBQWdDLEtBQUssT0FBTCxDQUFhLElBQTdDO0FBQ0Q7O0FBRUQsZUFBTyxJQUFQO0FBQ0Q7QUFwRWlCO0FBQUE7QUFBQSxnQ0FzRWE7QUFBQSxZQUF2QixjQUF1Qix1RUFBTixJQUFNOztBQUM3QixZQUFJLGNBQUosRUFBb0I7QUFDbEIsZUFBSyxJQUFMO0FBQ0QsU0FGRCxNQUVPO0FBQ0wsZUFBSyxJQUFMO0FBQ0Q7O0FBRUQsWUFBTSxnQkFBZ0IsS0FBSyxVQUFMLEVBQXRCOztBQUVBLFlBQUksa0JBQ0YsQ0FBQyxjQUFjLFNBQWQsQ0FBd0IsUUFBeEIsQ0FBaUMseUJBQWpDLENBREgsRUFDZ0U7QUFDOUQsd0JBQWMsU0FBZCxDQUF3QixHQUF4QixDQUE0Qix5QkFBNUI7QUFDQSxpQkFBTyxJQUFQO0FBQ0Q7O0FBRUQsWUFBSSxDQUFDLGNBQUQsSUFDRixjQUFjLFNBQWQsQ0FBd0IsUUFBeEIsQ0FBaUMseUJBQWpDLENBREYsRUFDK0Q7QUFDN0Qsd0JBQWMsU0FBZCxDQUF3QixNQUF4QixDQUErQix5QkFBL0I7QUFDRDs7QUFFRCxlQUFPLElBQVA7QUFDRDtBQTNGaUI7QUFBQTtBQUFBLDZCQTZGWDtBQUNMLFlBQUksQ0FBQyxLQUFLLE9BQUwsQ0FBYSxPQUFiLENBQXFCLFNBQXJCLENBQStCLFFBQS9CLENBQXdDLE1BQXhDLENBQUwsRUFBc0Q7QUFDcEQsZUFBSyxPQUFMLENBQWEsT0FBYixDQUFxQixTQUFyQixDQUErQixHQUEvQixDQUFtQyxNQUFuQztBQUNEOztBQUVELGVBQU8sSUFBUDtBQUNEO0FBbkdpQjtBQUFBO0FBQUEsbUNBcUdFO0FBQ2xCLGVBQU8sSUFBUDtBQUNEO0FBdkdpQjtBQUFBO0FBQUEsb0NBeUdHLE9BekdILEVBeUdZO0FBQzVCLHlHQUEyQixNQUEzQixFQUFtQyxPQUFuQztBQUNEO0FBM0dpQjs7QUFBQTtBQUFBOztBQThHcEIsU0FBTyxNQUFQO0FBQ0QsQ0EvR2MsRUFBZjs7a0JBaUhlLE07Ozs7Ozs7Ozs7Ozs7QUNuSGY7Ozs7QUFDQTs7Ozs7Ozs7OzsrZUFOQTs7Ozs7OztBQVFBLElBQU0sZUFBZ0IsWUFBTTtBQUMxQjs7Ozs7O0FBTUEsTUFBTSxPQUFPLGNBQWI7QUFDQSxNQUFNLFVBQVUsT0FBaEI7QUFDQSxNQUFNLHFCQUFxQjtBQUN6QixhQUFTLElBRGdCO0FBRXpCLGFBQVMsRUFGZ0I7QUFHekIsZ0JBQVksSUFIYTtBQUl6QixhQUFTLElBSmdCO0FBS3pCLGdCQUFZO0FBTGEsR0FBM0I7QUFPQSxNQUFNLHdCQUF3QixDQUM1QixTQUQ0QixDQUE5Qjs7QUFJQTs7Ozs7O0FBcEIwQixNQTBCcEIsWUExQm9CO0FBQUE7O0FBNEJ4Qiw0QkFBMEI7QUFBQSxVQUFkLE9BQWMsdUVBQUosRUFBSTs7QUFBQTs7QUFBQSw4SEFDbEIsSUFEa0IsRUFDWixPQURZLEVBQ0gsa0JBREcsRUFDaUIsT0FEakIsRUFDMEIscUJBRDFCLEVBQ2lELElBRGpELEVBQ3VELEtBRHZEOztBQUd4QixZQUFLLFFBQUwsR0FBZ0IsS0FDaEIsNEJBRGdCLEdBRWQsa0NBRmMsR0FHWiw2QkFIWSxHQUlaLHFGQUpZLEdBS1YseUNBTFUsR0FNWixXQU5ZLEdBT2QsUUFQYyxHQVFoQixRQVJBOztBQVVBLFVBQUksTUFBSyxjQUFULEVBQXlCO0FBQ3ZCLGNBQUssS0FBTDtBQUNEOztBQUVELFlBQUssZUFBTCxHQUF1QixJQUF2QjtBQWpCd0I7QUFrQnpCOztBQTlDdUI7QUFBQTtBQUFBLDhCQWdEaEI7QUFDTixZQUFNLFVBQVUsU0FBUyxhQUFULENBQXVCLEtBQXZCLENBQWhCOztBQUVBLGdCQUFRLFNBQVIsR0FBb0IsS0FBSyxRQUF6Qjs7QUFFQSxhQUFLLE9BQUwsQ0FBYSxPQUFiLEdBQXVCLFFBQVEsVUFBL0I7O0FBRUE7QUFDQSxhQUFLLE9BQUwsQ0FBYSxPQUFiLENBQXFCLGFBQXJCLENBQW1DLFVBQW5DLEVBQStDLFNBQS9DLEdBQTJELEtBQUssT0FBTCxDQUFhLE9BQXhFOztBQUVBLFlBQUksQ0FBQyxLQUFLLE9BQUwsQ0FBYSxVQUFsQixFQUE4QjtBQUM1QixlQUFLLE9BQUwsQ0FBYSxPQUFiLENBQXFCLGFBQXJCLENBQW1DLFFBQW5DLEVBQTZDLEtBQTdDLENBQW1ELE9BQW5ELEdBQTZELE1BQTdEO0FBQ0Q7O0FBRUQsaUJBQVMsSUFBVCxDQUFjLFdBQWQsQ0FBMEIsS0FBSyxPQUFMLENBQWEsT0FBdkM7O0FBRUEsYUFBSyxhQUFMO0FBQ0Q7QUFqRXVCO0FBQUE7QUFBQSw2QkFtRWpCO0FBQUE7O0FBQ0wsWUFBSSxLQUFLLE9BQUwsQ0FBYSxPQUFiLEtBQXlCLElBQTdCLEVBQW1DO0FBQ2pDO0FBQ0EsZUFBSyxLQUFMO0FBQ0Q7O0FBRUQsWUFBSSxLQUFLLE9BQUwsQ0FBYSxPQUFiLENBQXFCLFNBQXJCLENBQStCLFFBQS9CLENBQXdDLE1BQXhDLENBQUosRUFBcUQ7QUFDbkQsaUJBQU8sS0FBUDtBQUNEOztBQUVEO0FBQ0EsWUFBSSxLQUFLLE9BQUwsQ0FBYSxVQUFqQixFQUE2QjtBQUMzQixlQUFLLE9BQUwsQ0FBYSxPQUFiLENBQXFCLGVBQXJCLENBQXFDLE9BQXJDO0FBQ0EsZUFBSyxPQUFMLENBQWEsT0FBYixDQUFxQixZQUFyQixDQUFrQyxPQUFsQyxFQUEyQyxjQUEzQzs7QUFFQSxlQUFLLE9BQUwsQ0FBYSxPQUFiLENBQXFCLFNBQXJCLENBQStCLEdBQS9CLFNBQXlDLEtBQUssT0FBTCxDQUFhLFVBQXREO0FBQ0EsZUFBSyxPQUFMLENBQWEsT0FBYixDQUFxQixhQUFyQixDQUFtQyxRQUFuQyxFQUE2QyxTQUE3QyxDQUF1RCxHQUF2RCxVQUFrRSxLQUFLLE9BQUwsQ0FBYSxVQUEvRTtBQUNEOztBQUVELFlBQUksS0FBSyxPQUFMLENBQWEsVUFBakIsRUFBNkI7QUFDM0I7QUFDQSxjQUFNLGdCQUFnQixLQUFLLE9BQUwsQ0FBYSxPQUFiLENBQXFCLGFBQXJCLENBQW1DLFFBQW5DLENBQXRCO0FBQ0EsZUFBSyxlQUFMLENBQXFCLEVBQUUsUUFBUSxhQUFWLEVBQXlCLE9BQU8sT0FBaEMsRUFBckI7QUFDRDs7QUFFRCxtQkFBVyxZQUFNO0FBQ2YsaUJBQUssT0FBTCxDQUFhLE9BQWIsQ0FBcUIsU0FBckIsQ0FBK0IsR0FBL0IsQ0FBbUMsTUFBbkM7O0FBRUE7QUFDQSxjQUFNLHNCQUFzQixTQUFTLGdCQUFULENBQTBCLG9CQUExQixLQUFtRCxFQUEvRTtBQUNBLGNBQUksZUFBZSxDQUFuQjtBQUNBLDhCQUFvQixPQUFwQixDQUE0QixVQUFDLFlBQUQsRUFBa0I7QUFDNUMsZ0JBQUksT0FBSyxPQUFMLENBQWEsT0FBYixLQUF5QixZQUE3QixFQUEyQztBQUN6QyxrQkFBTSxRQUFRLGlCQUFpQixZQUFqQixDQUFkO0FBQ0EsOEJBQWdCLGFBQWEsWUFBYixHQUE0QixTQUFTLE1BQU0sWUFBZixFQUE2QixFQUE3QixDQUE1QztBQUNEO0FBQ0YsV0FMRDs7QUFPQSxpQkFBSyxPQUFMLENBQWEsT0FBYixDQUFxQixLQUFyQixDQUEyQixTQUEzQixtQkFBcUQsWUFBckQ7O0FBRUEsaUJBQUssWUFBTCxDQUFrQixpQkFBTSxJQUF4Qjs7QUFFQSxjQUFNLFVBQVUsU0FBVixPQUFVLEdBQU07QUFDcEIsbUJBQUssWUFBTCxDQUFrQixpQkFBTSxLQUF4QjtBQUNBLG1CQUFLLE9BQUwsQ0FBYSxPQUFiLENBQXFCLG1CQUFyQixDQUF5QyxpQkFBTSxjQUEvQyxFQUErRCxPQUEvRDtBQUNELFdBSEQ7O0FBS0EsaUJBQUssT0FBTCxDQUFhLE9BQWIsQ0FBcUIsZ0JBQXJCLENBQXNDLGlCQUFNLGNBQTVDLEVBQTRELE9BQTVEO0FBRUQsU0F4QkQsRUF3QkcsQ0F4Qkg7O0FBMEJBLFlBQUksT0FBTyxTQUFQLENBQWlCLEtBQUssT0FBTCxDQUFhLE9BQTlCLEtBQTBDLEtBQUssT0FBTCxDQUFhLE9BQWIsR0FBdUIsQ0FBckUsRUFBd0U7QUFDdEU7QUFDQSxlQUFLLGVBQUwsR0FBdUIsV0FBVyxZQUFNO0FBQ3RDLG1CQUFLLElBQUw7QUFDRCxXQUZzQixFQUVwQixLQUFLLE9BQUwsQ0FBYSxPQUFiLEdBQXVCLENBRkgsQ0FBdkI7QUFHRDs7QUFFRCxlQUFPLElBQVA7QUFDRDtBQTlIdUI7QUFBQTtBQUFBLDZCQWdJakI7QUFBQTs7QUFDTDs7OztBQUlBLFlBQUksS0FBSyxlQUFULEVBQTBCO0FBQ3hCLHVCQUFhLEtBQUssZUFBbEI7QUFDQSxlQUFLLGVBQUwsR0FBdUIsSUFBdkI7QUFDRDs7QUFFRCxZQUFJLENBQUMsS0FBSyxPQUFMLENBQWEsT0FBYixDQUFxQixTQUFyQixDQUErQixRQUEvQixDQUF3QyxNQUF4QyxDQUFMLEVBQXNEO0FBQ3BELGlCQUFPLEtBQVA7QUFDRDs7QUFFRCxhQUFLLFlBQUwsQ0FBa0IsaUJBQU0sSUFBeEI7O0FBRUEsWUFBSSxLQUFLLE9BQUwsQ0FBYSxVQUFqQixFQUE2QjtBQUMzQixjQUFNLGdCQUFnQixLQUFLLE9BQUwsQ0FBYSxPQUFiLENBQXFCLGFBQXJCLENBQW1DLFFBQW5DLENBQXRCO0FBQ0EsZUFBSyxpQkFBTCxDQUF1QixFQUFFLFFBQVEsYUFBVixFQUF5QixPQUFPLE9BQWhDLEVBQXZCO0FBQ0Q7O0FBRUQsYUFBSyxPQUFMLENBQWEsT0FBYixDQUFxQixTQUFyQixDQUErQixNQUEvQixDQUFzQyxNQUF0QztBQUNBLGFBQUssT0FBTCxDQUFhLE9BQWIsQ0FBcUIsU0FBckIsQ0FBK0IsR0FBL0IsQ0FBbUMsTUFBbkM7O0FBRUEsWUFBTSxXQUFXLFNBQVgsUUFBVyxHQUFNO0FBQ3JCLGlCQUFLLE9BQUwsQ0FBYSxPQUFiLENBQXFCLG1CQUFyQixDQUF5QyxpQkFBTSxjQUEvQyxFQUErRCxRQUEvRDtBQUNBLGlCQUFLLE9BQUwsQ0FBYSxPQUFiLENBQXFCLFNBQXJCLENBQStCLE1BQS9CLENBQXNDLE1BQXRDOztBQUVBLGlCQUFLLFlBQUwsQ0FBa0IsaUJBQU0sTUFBeEI7O0FBRUEsY0FBSSxPQUFLLGNBQVQsRUFBeUI7QUFDdkIscUJBQVMsSUFBVCxDQUFjLFdBQWQsQ0FBMEIsT0FBSyxPQUFMLENBQWEsT0FBdkM7QUFDQSxtQkFBSyxPQUFMLENBQWEsT0FBYixHQUF1QixJQUF2QjtBQUNEO0FBQ0YsU0FWRDs7QUFZQSxhQUFLLE9BQUwsQ0FBYSxPQUFiLENBQXFCLGdCQUFyQixDQUFzQyxpQkFBTSxjQUE1QyxFQUE0RCxRQUE1RDs7QUFFQSxlQUFPLElBQVA7QUFDRDtBQXZLdUI7QUFBQTtBQUFBLHVDQXlLUDtBQUNmLGFBQUssSUFBTDtBQUNEO0FBM0t1QjtBQUFBO0FBQUEsbUNBNktKO0FBQ2xCLGVBQU8sSUFBUDtBQUNEO0FBL0t1QjtBQUFBO0FBQUEsb0NBaUxILE9BakxHLEVBaUxNO0FBQzVCLHFIQUEyQixZQUEzQixFQUF5QyxPQUF6QztBQUNEO0FBbkx1Qjs7QUFBQTtBQUFBOztBQXNMMUIsU0FBTyxZQUFQO0FBQ0QsQ0F2TG9CLEVBQXJCOztrQkF5TGUsWTs7Ozs7Ozs7Ozs7OztBQzVMZjs7OztBQUNBOzs7O0FBQ0E7O0FBQ0E7Ozs7Ozs7OytlQVJBOzs7Ozs7O0FBVUEsSUFBTSxZQUFhLFlBQU07QUFDdkI7Ozs7OztBQU1BLE1BQU0sT0FBTyxZQUFiO0FBQ0EsTUFBTSxVQUFVLE9BQWhCO0FBQ0EsTUFBTSxvQkFBb0IscUJBQTFCO0FBQ0EsTUFBTSxxQkFBcUI7QUFDekIsYUFBUyxJQURnQjtBQUV6QixXQUFPO0FBQ0wsVUFBSSxLQURDO0FBRUwsVUFBSSxLQUZDO0FBR0wsVUFBSTtBQUhDO0FBRmtCLEdBQTNCO0FBUUEsTUFBTSx3QkFBd0IsQ0FDNUIsT0FENEIsQ0FBOUI7O0FBSUE7Ozs7OztBQXRCdUIsTUE0QmpCLFNBNUJpQjtBQUFBOztBQThCckIseUJBQTBCO0FBQUEsVUFBZCxPQUFjLHVFQUFKLEVBQUk7O0FBQUE7O0FBQUEsd0hBQ2xCLElBRGtCLEVBQ1osT0FEWSxFQUNILGtCQURHLEVBQ2lCLE9BRGpCLEVBQzBCLHFCQUQxQixFQUNpRCxLQURqRCxFQUN3RCxJQUR4RDs7QUFHeEIsWUFBSyxXQUFMLEdBQW1CLElBQW5CO0FBQ0EsWUFBSyxZQUFMLEdBQW9CLElBQXBCO0FBQ0EsWUFBSyxPQUFMLEdBQWUsSUFBZjs7QUFFQSxZQUFLLFVBQUwsR0FBa0IsQ0FBQyxNQUFELEVBQVMsT0FBVCxDQUFsQjs7QUFFQSxVQUFNLEtBQUssRUFBRSxNQUFNLElBQVIsRUFBYyxPQUFPLE9BQU8sVUFBUCxDQUFrQixrQkFBbEIsQ0FBckIsRUFBWDtBQUNBLFVBQU0sS0FBSyxFQUFFLE1BQU0sSUFBUixFQUFjLE9BQU8sT0FBTyxVQUFQLENBQWtCLG9CQUFsQixDQUFyQixFQUFYO0FBQ0EsVUFBTSxLQUFLLEVBQUUsTUFBTSxJQUFSLEVBQWMsT0FBTyxPQUFPLFVBQVAsQ0FBa0Isb0JBQWxCLENBQXJCLEVBQVg7QUFDQSxVQUFNLEtBQUssRUFBRSxNQUFNLElBQVIsRUFBYyxPQUFPLE9BQU8sVUFBUCxDQUFrQixxQkFBbEIsQ0FBckIsRUFBWDs7QUFFQSxZQUFLLEtBQUwsR0FBYSxDQUFDLEVBQUQsRUFBSyxFQUFMLEVBQVMsRUFBVCxFQUFhLEVBQWIsRUFBaUIsT0FBakIsRUFBYjs7QUFFQSxZQUFLLGNBQUw7QUFDQSxZQUFLLFVBQUw7O0FBRUEsYUFBTyxnQkFBUCxDQUF3QixRQUF4QixFQUFrQztBQUFBLGVBQU0sTUFBSyxVQUFMLEVBQU47QUFBQSxPQUFsQyxFQUEyRCxLQUEzRDtBQW5Cd0I7QUFvQnpCOztBQWxEb0I7QUFBQTtBQUFBLHVDQW9ESjtBQUFBOztBQUNmLGFBQUssVUFBTCxDQUFnQixLQUFoQixDQUFzQixVQUFDLFNBQUQsRUFBZTtBQUNuQyxjQUFJLE9BQUssT0FBTCxDQUFhLE9BQWIsQ0FBcUIsU0FBckIsQ0FBK0IsUUFBL0IsaUJBQXNELFNBQXRELENBQUosRUFBd0U7QUFDdEUsbUJBQUssU0FBTCxHQUFpQixTQUFqQjtBQUNBLG1CQUFPLEtBQVA7QUFDRDtBQUNELGlCQUFPLElBQVA7QUFDRCxTQU5EO0FBT0Q7QUE1RG9CO0FBQUE7QUFBQSxtQ0E4RFI7QUFBQTs7QUFDWCxZQUFJLEVBQUUsZ0JBQWdCLE1BQWxCLENBQUosRUFBK0I7QUFDN0I7QUFDRDs7QUFFRCxhQUFLLEtBQUwsQ0FBVyxLQUFYLENBQWlCLFVBQUMsSUFBRCxFQUFVO0FBQ3pCLGNBQU0sUUFBUSxLQUFLLEtBQUwsQ0FBVyxLQUFYLENBQWlCLEtBQWpCLENBQXVCLDBCQUF2QixDQUFkOztBQUVBLGNBQUksS0FBSixFQUFXO0FBQ1QsZ0JBQUksS0FBSyxLQUFMLENBQVcsT0FBZixFQUF3QjtBQUN0QixrQkFBSSxPQUFLLFlBQUwsS0FBc0IsS0FBSyxJQUEvQixFQUFxQztBQUNuQyx1QkFBSyxRQUFMLENBQWMsS0FBSyxJQUFuQjtBQUNEO0FBQ0QscUJBQUssWUFBTCxHQUFvQixLQUFLLElBQXpCO0FBQ0EscUJBQU8sS0FBUDtBQUNEO0FBQ0Y7O0FBRUQsaUJBQU8sSUFBUDtBQUNELFNBZEQ7QUFlRDtBQWxGb0I7QUFBQTtBQUFBLHdDQW9GSDtBQUNoQixlQUFPLHlIQUEyQixLQUFLLE9BQUwsQ0FBYSxLQUFiLENBQW1CLEtBQUssWUFBeEIsTUFBMEMsSUFBNUU7QUFDRDtBQXRGb0I7QUFBQTtBQUFBLCtCQXdGWixJQXhGWSxFQXdGTjtBQUNiLFlBQU0sVUFBVSxTQUFTLElBQXpCOztBQUVBLFlBQUksS0FBSyxPQUFMLENBQWEsS0FBYixDQUFtQixJQUFuQixNQUE2QixJQUFqQyxFQUF1QztBQUNyQyxjQUFJLENBQUMsUUFBUSxTQUFSLENBQWtCLFFBQWxCLHVCQUErQyxLQUFLLFNBQXBELENBQUwsRUFBdUU7QUFDckUsb0JBQVEsU0FBUixDQUFrQixHQUFsQix1QkFBMEMsS0FBSyxTQUEvQztBQUNEOztBQUVELGVBQUssV0FBTCxHQUFtQixLQUFuQjs7QUFFQTtBQUNBLGVBQUssT0FBTCxHQUFlLEtBQWY7QUFDQSxlQUFLLElBQUw7QUFDQTtBQUNBLGVBQUssY0FBTDtBQUNELFNBWkQsTUFZTztBQUNMLGNBQUksUUFBUSxTQUFSLENBQWtCLFFBQWxCLHVCQUErQyxLQUFLLFNBQXBELENBQUosRUFBc0U7QUFDcEUsb0JBQVEsU0FBUixDQUFrQixNQUFsQix1QkFBNkMsS0FBSyxTQUFsRDtBQUNEOztBQUVELGVBQUssSUFBTDtBQUNBLGVBQUssV0FBTCxHQUFtQixJQUFuQjtBQUNBLGVBQUssT0FBTCxHQUFlLElBQWY7QUFDRDtBQUNGO0FBaEhvQjtBQUFBO0FBQUEscUNBa0hOLEtBbEhNLEVBa0hDO0FBQ3BCLFlBQUksTUFBTSxJQUFOLEtBQWUsT0FBZixJQUEwQixNQUFNLE9BQU4sS0FBa0IsRUFBNUMsSUFBa0QsTUFBTSxPQUFOLEtBQWtCLEVBQXhFLEVBQTRFO0FBQzFFO0FBQ0Q7O0FBRUQ7QUFDQSxhQUFLLElBQUw7QUFDRDtBQXpIb0I7QUFBQTtBQUFBLDZCQTJIZDtBQUFBOztBQUNMLFlBQUksS0FBSyxPQUFMLENBQWEsT0FBYixDQUFxQixTQUFyQixDQUErQixRQUEvQixDQUF3QyxNQUF4QyxDQUFKLEVBQXFEO0FBQ25ELGlCQUFPLEtBQVA7QUFDRDs7QUFFRDtBQUNBLG1CQUFXLFlBQU07QUFDZixpQkFBSyxZQUFMLENBQWtCLGlCQUFNLElBQXhCOztBQUVBLGNBQU0sVUFBVSxTQUFWLE9BQVUsR0FBTTtBQUNwQixtQkFBSyxZQUFMLENBQWtCLGlCQUFNLEtBQXhCOztBQUVBLGdCQUFJLE9BQUssT0FBVCxFQUFrQjtBQUNoQixxQkFBSyxPQUFMLENBQWEsT0FBYixDQUFxQixtQkFBckIsQ0FBeUMsaUJBQU0sY0FBL0MsRUFBK0QsT0FBL0Q7QUFDQSxxQkFBSyxPQUFMLENBQWEsT0FBYixDQUFxQixTQUFyQixDQUErQixNQUEvQixDQUFzQyxTQUF0QztBQUNEO0FBQ0YsV0FQRDs7QUFTQSxjQUFJLE9BQUssV0FBVCxFQUFzQjtBQUNwQixtQkFBSyxjQUFMO0FBQ0Q7O0FBR0QsY0FBSSxPQUFLLE9BQVQsRUFBa0I7QUFDaEIsbUJBQUssT0FBTCxDQUFhLE9BQWIsQ0FBcUIsZ0JBQXJCLENBQXNDLGlCQUFNLGNBQTVDLEVBQTRELE9BQTVEO0FBQ0EsbUJBQUssT0FBTCxDQUFhLE9BQWIsQ0FBcUIsU0FBckIsQ0FBK0IsR0FBL0IsQ0FBbUMsU0FBbkM7QUFDRCxXQUhELE1BR087QUFDTDtBQUNBO0FBQ0Q7O0FBRUQsaUJBQUssT0FBTCxDQUFhLE9BQWIsQ0FBcUIsU0FBckIsQ0FBK0IsR0FBL0IsQ0FBbUMsTUFBbkM7O0FBRUE7QUFDQSxpQkFBSyxZQUFMO0FBQ0QsU0E3QkQsRUE2QkcsQ0E3Qkg7O0FBK0JBLGVBQU8sSUFBUDtBQUNEO0FBaktvQjtBQUFBO0FBQUEsNkJBbUtkO0FBQUE7O0FBQ0wsWUFBSSxDQUFDLEtBQUssT0FBTCxDQUFhLE9BQWIsQ0FBcUIsU0FBckIsQ0FBK0IsUUFBL0IsQ0FBd0MsTUFBeEMsQ0FBTCxFQUFzRDtBQUNwRCxpQkFBTyxLQUFQO0FBQ0Q7O0FBRUQsYUFBSyxZQUFMLENBQWtCLGlCQUFNLElBQXhCOztBQUVBLGFBQUssWUFBTDs7QUFFQSxZQUFJLEtBQUssT0FBVCxFQUFrQjtBQUNoQixlQUFLLE9BQUwsQ0FBYSxPQUFiLENBQXFCLFNBQXJCLENBQStCLEdBQS9CLENBQW1DLFNBQW5DO0FBQ0Q7O0FBRUQsYUFBSyxPQUFMLENBQWEsT0FBYixDQUFxQixTQUFyQixDQUErQixNQUEvQixDQUFzQyxNQUF0Qzs7QUFFQSxZQUFJLEtBQUssV0FBVCxFQUFzQjtBQUNwQixjQUFNLFdBQVcsS0FBSyxXQUFMLEVBQWpCOztBQUVBLGNBQU0sV0FBVyxTQUFYLFFBQVcsR0FBTTtBQUNyQixnQkFBSSxPQUFLLE9BQVQsRUFBa0I7QUFDaEIscUJBQUssT0FBTCxDQUFhLE9BQWIsQ0FBcUIsU0FBckIsQ0FBK0IsTUFBL0IsQ0FBc0MsU0FBdEM7QUFDRDs7QUFFRCxxQkFBUyxtQkFBVCxDQUE2QixpQkFBTSxjQUFuQyxFQUFtRCxRQUFuRDtBQUNBLG1CQUFLLFlBQUwsQ0FBa0IsaUJBQU0sTUFBeEI7QUFDQSxtQkFBSyxjQUFMO0FBQ0QsV0FSRDs7QUFVQSxtQkFBUyxnQkFBVCxDQUEwQixpQkFBTSxjQUFoQyxFQUFnRCxRQUFoRDtBQUNBLG1CQUFTLFNBQVQsQ0FBbUIsR0FBbkIsQ0FBdUIsU0FBdkI7QUFDRDs7QUFFRCxlQUFPLElBQVA7QUFDRDtBQXBNb0I7QUFBQTtBQUFBLHVDQXNNSjtBQUNmLFlBQU0sV0FBVyxTQUFTLGFBQVQsQ0FBdUIsS0FBdkIsQ0FBakI7QUFDQSxpQkFBUyxZQUFULENBQXNCLFNBQXRCLEVBQWlDLEtBQUssRUFBdEM7QUFDQSxpQkFBUyxTQUFULENBQW1CLEdBQW5CLENBQXVCLGlCQUF2Qjs7QUFFQSxpQkFBUyxJQUFULENBQWMsV0FBZCxDQUEwQixRQUExQjtBQUNEO0FBNU1vQjtBQUFBO0FBQUEsb0NBOE1QO0FBQ1osZUFBTyxTQUFTLGFBQVQsT0FBMkIsaUJBQTNCLGtCQUF5RCxLQUFLLEVBQTlELFFBQVA7QUFDRDtBQWhOb0I7QUFBQTtBQUFBLHVDQWtOSjtBQUNmLFlBQU0sV0FBVyxLQUFLLFdBQUwsRUFBakI7QUFDQSxZQUFJLFFBQUosRUFBYztBQUNaLG1CQUFTLElBQVQsQ0FBYyxXQUFkLENBQTBCLFFBQTFCO0FBQ0Q7QUFDRjtBQXZOb0I7QUFBQTtBQUFBLHFDQXlOTjtBQUFBOztBQUNiLFlBQU0saUJBQWlCLEtBQUssT0FBTCxDQUFhLE9BQWIsQ0FBcUIsZ0JBQXJCLENBQXNDLGdCQUF0QyxDQUF2Qjs7QUFFQSxZQUFJLGNBQUosRUFBb0I7QUFDbEIsZ0JBQU0sSUFBTixDQUFXLGNBQVgsRUFBMkIsT0FBM0IsQ0FBbUM7QUFBQSxtQkFBVSxPQUFLLGVBQUwsQ0FBcUIsRUFBRSxRQUFRLE1BQVYsRUFBa0IsT0FBTyxPQUF6QixFQUFyQixDQUFWO0FBQUEsV0FBbkM7QUFDRDs7QUFFRCxZQUFJLEtBQUssV0FBVCxFQUFzQjtBQUNwQixjQUFNLFdBQVcsS0FBSyxXQUFMLEVBQWpCO0FBQ0EsZUFBSyxlQUFMLENBQXFCLEVBQUUsUUFBUSxRQUFWLEVBQW9CLE9BQU8saUJBQU0sS0FBakMsRUFBckI7QUFDRDs7QUFFRCxhQUFLLGVBQUwsQ0FBcUIsRUFBRSxRQUFRLFFBQVYsRUFBb0IsT0FBTyxPQUEzQixFQUFyQjtBQUNEO0FBdE9vQjtBQUFBO0FBQUEscUNBd09OO0FBQUE7O0FBQ2IsWUFBTSxpQkFBaUIsS0FBSyxPQUFMLENBQWEsT0FBYixDQUFxQixnQkFBckIsQ0FBc0MsZ0JBQXRDLENBQXZCOztBQUVBLFlBQUksY0FBSixFQUFvQjtBQUNsQixnQkFBTSxJQUFOLENBQVcsY0FBWCxFQUEyQixPQUEzQixDQUFtQztBQUFBLG1CQUFVLE9BQUssaUJBQUwsQ0FBdUIsRUFBRSxRQUFRLE1BQVYsRUFBa0IsT0FBTyxPQUF6QixFQUF2QixDQUFWO0FBQUEsV0FBbkM7QUFDRDs7QUFFRCxZQUFJLEtBQUssV0FBVCxFQUFzQjtBQUNwQixjQUFNLFdBQVcsS0FBSyxXQUFMLEVBQWpCO0FBQ0EsZUFBSyxpQkFBTCxDQUF1QixFQUFFLFFBQVEsUUFBVixFQUFvQixPQUFPLGlCQUFNLEtBQWpDLEVBQXZCO0FBQ0Q7O0FBRUQsYUFBSyxpQkFBTCxDQUF1QixFQUFFLFFBQVEsUUFBVixFQUFvQixPQUFPLE9BQTNCLEVBQXZCO0FBQ0Q7QUFyUG9CO0FBQUE7QUFBQSxtQ0F1UEQ7QUFDbEIsZUFBTyxJQUFQO0FBQ0Q7QUF6UG9CO0FBQUE7QUFBQSxvQ0EyUEEsT0EzUEEsRUEyUFM7QUFDNUIsK0dBQTJCLFNBQTNCLEVBQXNDLE9BQXRDO0FBQ0Q7QUE3UG9COztBQUFBO0FBQUE7O0FBZ1F2Qjs7Ozs7OztBQUtBLE1BQU0sYUFBYSxFQUFuQjs7QUFFQSxNQUFNLFlBQVksU0FBUyxnQkFBVCxPQUE4QixJQUE5QixDQUFsQjtBQUNBLE1BQUksU0FBSixFQUFlO0FBQ2IsVUFBTSxJQUFOLENBQVcsU0FBWCxFQUFzQixPQUF0QixDQUE4QixVQUFDLE9BQUQsRUFBYTtBQUN6QyxVQUFNLFNBQVMsMkNBQW9CLE9BQXBCLEVBQTZCLGtCQUE3QixFQUFpRCxxQkFBakQsQ0FBZjtBQUNBLGFBQU8sT0FBUCxHQUFpQixPQUFqQjs7QUFFQSxpQkFBVyxJQUFYLENBQWdCLEVBQUUsZ0JBQUYsRUFBVyxXQUFXLElBQUksU0FBSixDQUFjLE1BQWQsQ0FBdEIsRUFBaEI7QUFDRCxLQUxEO0FBTUQ7O0FBRUQsTUFBSSxTQUFKLEVBQWU7QUFDYixhQUFTLGdCQUFULENBQTBCLE9BQTFCLEVBQW1DLFVBQUMsS0FBRCxFQUFXO0FBQzVDLFVBQU0sU0FBUyw2QkFBaUIsTUFBTSxNQUF2QixFQUErQixhQUEvQixDQUFmO0FBQ0EsVUFBSSxDQUFDLE1BQUwsRUFBYTtBQUNYO0FBQ0Q7O0FBRUQsVUFBTSxpQkFBaUIsT0FBTyxZQUFQLENBQW9CLGFBQXBCLENBQXZCO0FBQ0EsVUFBSSxrQkFBa0IsbUJBQW1CLElBQXpDLEVBQStDO0FBQzdDLFlBQU0sS0FBSyxPQUFPLFlBQVAsQ0FBb0IsYUFBcEIsQ0FBWDtBQUNBLFlBQU0sVUFBVSxTQUFTLGFBQVQsQ0FBdUIsRUFBdkIsQ0FBaEI7O0FBRUEsWUFBTSxZQUFZLFdBQVcsSUFBWCxDQUFnQjtBQUFBLGlCQUFLLEVBQUUsT0FBRixLQUFjLE9BQW5CO0FBQUEsU0FBaEIsQ0FBbEI7O0FBRUEsWUFBSSxDQUFDLFNBQUwsRUFBZ0I7QUFDZDtBQUNEOztBQUVELGVBQU8sSUFBUDs7QUFFQSxrQkFBVSxTQUFWLENBQW9CLElBQXBCO0FBQ0Q7QUFDRixLQXJCRDtBQXNCRDs7QUFFRCxTQUFPLFNBQVA7QUFDRCxDQTNTaUIsRUFBbEI7O2tCQTZTZSxTOzs7Ozs7Ozs7Ozs7O0FDbFRmOzs7O0FBQ0E7Ozs7Ozs7Ozs7K2VBTkE7Ozs7Ozs7QUFRQSxJQUFNLFdBQVksWUFBTTtBQUN0Qjs7Ozs7O0FBTUEsTUFBTSxPQUFPLFVBQWI7QUFDQSxNQUFNLFVBQVUsT0FBaEI7QUFDQSxNQUFNLHFCQUFxQjtBQUN6QixhQUFTLElBRGdCO0FBRXpCLFlBQVEsQ0FGaUI7QUFHekIsU0FBSyxDQUhvQjtBQUl6QixTQUFLLEdBSm9CO0FBS3pCLFdBQU8sS0FMa0I7QUFNekIsYUFBUyxLQU5nQjtBQU96QixnQkFBWTtBQVBhLEdBQTNCO0FBU0EsTUFBTSx3QkFBd0IsQ0FDNUIsUUFENEIsRUFFNUIsS0FGNEIsRUFHNUIsS0FINEIsRUFJNUIsT0FKNEIsRUFLNUIsU0FMNEIsRUFNNUIsWUFONEIsQ0FBOUI7O0FBU0E7Ozs7OztBQTNCc0IsTUFpQ2hCLFFBakNnQjtBQUFBOztBQW1DcEIsd0JBQTBCO0FBQUEsVUFBZCxPQUFjLHVFQUFKLEVBQUk7O0FBQUE7O0FBR3hCO0FBSHdCLHNIQUNsQixJQURrQixFQUNaLE9BRFksRUFDSCxrQkFERyxFQUNpQixPQURqQixFQUMwQixxQkFEMUIsRUFDaUQsS0FEakQsRUFDd0QsS0FEeEQ7O0FBSXhCLFlBQUssT0FBTCxDQUFhLE9BQWIsQ0FBcUIsS0FBckIsQ0FBMkIsTUFBM0IsR0FBdUMsTUFBSyxPQUFMLENBQWEsTUFBcEQ7O0FBRUE7QUFDQSxVQUFNLGNBQWMsTUFBSyxjQUFMLEVBQXBCO0FBQ0Esa0JBQVksWUFBWixDQUF5QixlQUF6QixPQUE2QyxNQUFLLE9BQUwsQ0FBYSxHQUExRDtBQUNBLGtCQUFZLFlBQVosQ0FBeUIsZUFBekIsT0FBNkMsTUFBSyxPQUFMLENBQWEsR0FBMUQ7O0FBRUE7QUFDQSxVQUFJLE1BQUssT0FBTCxDQUFhLE9BQWIsSUFDQyxDQUFDLFlBQVksU0FBWixDQUFzQixRQUF0QixDQUErQixzQkFBL0IsQ0FETixFQUM4RDtBQUM1RCxvQkFBWSxTQUFaLENBQXNCLEdBQXRCLENBQTBCLHNCQUExQjtBQUNEOztBQUVEO0FBQ0EsVUFBSSxPQUFPLE1BQUssT0FBTCxDQUFhLFVBQXBCLEtBQW1DLFFBQW5DLElBQ0MsQ0FBQyxZQUFZLFNBQVosQ0FBc0IsUUFBdEIsU0FBcUMsTUFBSyxPQUFMLENBQWEsVUFBbEQsQ0FETixFQUN1RTtBQUNyRSxvQkFBWSxTQUFaLENBQXNCLEdBQXRCLFNBQWdDLE1BQUssT0FBTCxDQUFhLFVBQTdDO0FBQ0Q7QUFyQnVCO0FBc0J6Qjs7QUF6RG1CO0FBQUE7QUFBQSx1Q0EyREg7QUFDZixlQUFPLEtBQUssT0FBTCxDQUFhLE9BQWIsQ0FBcUIsYUFBckIsQ0FBbUMsZUFBbkMsQ0FBUDtBQUNEO0FBN0RtQjtBQUFBO0FBQUEsNEJBK0RMO0FBQUEsWUFBWCxLQUFXLHVFQUFILENBQUc7O0FBQ2IsWUFBTSxjQUFjLEtBQUssY0FBTCxFQUFwQjtBQUNBLFlBQU0sV0FBVyxLQUFLLEtBQUwsQ0FBWSxTQUFTLEtBQUssT0FBTCxDQUFhLEdBQWIsR0FBbUIsS0FBSyxPQUFMLENBQWEsR0FBekMsQ0FBRCxHQUFrRCxHQUE3RCxDQUFqQjs7QUFFQSxZQUFJLFFBQVEsS0FBSyxPQUFMLENBQWEsR0FBekIsRUFBOEI7QUFDNUIsa0JBQVEsS0FBUixDQUFpQixJQUFqQixtQkFBbUMsS0FBbkM7QUFDQSxpQkFBTyxLQUFQO0FBQ0Q7O0FBRUQsWUFBSSxRQUFRLEtBQUssT0FBTCxDQUFhLEdBQXpCLEVBQThCO0FBQzVCLGtCQUFRLEtBQVIsQ0FBaUIsSUFBakIsbUJBQW1DLEtBQW5DO0FBQ0EsaUJBQU8sS0FBUDtBQUNEOztBQUVELG9CQUFZLFlBQVosQ0FBeUIsZUFBekIsT0FBNkMsS0FBN0M7O0FBRUE7QUFDQSxZQUFJLEtBQUssT0FBTCxDQUFhLEtBQWpCLEVBQXdCO0FBQ3RCLHNCQUFZLFNBQVosR0FBMkIsUUFBM0I7QUFDRDs7QUFFRDtBQUNBLG9CQUFZLEtBQVosQ0FBa0IsS0FBbEIsR0FBNkIsUUFBN0I7O0FBRUEsZUFBTyxJQUFQO0FBQ0Q7QUF4Rm1CO0FBQUE7QUFBQSxnQ0EwRlc7QUFBQSxZQUF2QixjQUF1Qix1RUFBTixJQUFNOztBQUM3QixZQUFJLENBQUMsS0FBSyxPQUFMLENBQWEsT0FBbEIsRUFBMkI7QUFDekIsa0JBQVEsS0FBUixDQUFpQixJQUFqQjtBQUNBLGlCQUFPLEtBQVA7QUFDRDs7QUFFRCxZQUFNLGNBQWMsS0FBSyxjQUFMLEVBQXBCOztBQUVBLFlBQUksa0JBQ0MsQ0FBQyxZQUFZLFNBQVosQ0FBc0IsUUFBdEIsQ0FBK0IsdUJBQS9CLENBRE4sRUFDK0Q7QUFDN0Qsc0JBQVksU0FBWixDQUFzQixHQUF0QixDQUEwQix1QkFBMUI7QUFDRDs7QUFFRCxZQUFJLENBQUMsY0FBRCxJQUNDLFlBQVksU0FBWixDQUFzQixRQUF0QixDQUErQix1QkFBL0IsQ0FETCxFQUM4RDtBQUM1RCxzQkFBWSxTQUFaLENBQXNCLE1BQXRCLENBQTZCLHVCQUE3QjtBQUNEOztBQUVELGVBQU8sSUFBUDtBQUNEO0FBN0dtQjtBQUFBO0FBQUEsNkJBK0diO0FBQ0wsYUFBSyxPQUFMLENBQWEsT0FBYixDQUFxQixLQUFyQixDQUEyQixNQUEzQixHQUF1QyxLQUFLLE9BQUwsQ0FBYSxNQUFwRDtBQUNBLGFBQUssWUFBTCxDQUFrQixpQkFBTSxJQUF4QjtBQUNBLGFBQUssWUFBTCxDQUFrQixpQkFBTSxLQUF4Qjs7QUFFQSxlQUFPLElBQVA7QUFDRDtBQXJIbUI7QUFBQTtBQUFBLDZCQXVIYjtBQUNMLGFBQUssT0FBTCxDQUFhLE9BQWIsQ0FBcUIsS0FBckIsQ0FBMkIsTUFBM0IsR0FBb0MsS0FBcEM7QUFDQSxhQUFLLFlBQUwsQ0FBa0IsaUJBQU0sSUFBeEI7QUFDQSxhQUFLLFlBQUwsQ0FBa0IsaUJBQU0sTUFBeEI7O0FBRUEsZUFBTyxJQUFQO0FBQ0Q7QUE3SG1CO0FBQUE7QUFBQSxtQ0ErSEE7QUFDbEIsZUFBTyxJQUFQO0FBQ0Q7QUFqSW1CO0FBQUE7QUFBQSxvQ0FtSUMsT0FuSUQsRUFtSVU7QUFDNUIsNkdBQTJCLFFBQTNCLEVBQXFDLE9BQXJDO0FBQ0Q7QUFySW1COztBQUFBO0FBQUE7O0FBd0l0QixTQUFPLFFBQVA7QUFDRCxDQXpJZ0IsRUFBakI7O2tCQTJJZSxROzs7Ozs7Ozs7Ozs7O0FDOUlmOzs7O0FBQ0E7O0FBQ0E7Ozs7QUFDQTs7Ozs7Ozs7K2VBUkE7Ozs7Ozs7QUFVQSxJQUFNLE1BQU8sWUFBTTtBQUNqQjs7Ozs7O0FBTUEsTUFBTSxPQUFPLEtBQWI7QUFDQSxNQUFNLFVBQVUsT0FBaEI7QUFDQSxNQUFNLHFCQUFxQixFQUEzQjtBQUdBLE1BQU0sd0JBQXdCLEVBQTlCO0FBRUEsTUFBTSx1QkFBdUIsV0FBN0I7O0FBRUE7Ozs7OztBQWhCaUIsTUFzQlgsR0F0Qlc7QUFBQTs7QUF3QmYsbUJBQTBCO0FBQUEsVUFBZCxPQUFjLHVFQUFKLEVBQUk7O0FBQUE7O0FBQUEsdUdBQ2xCLElBRGtCLEVBQ1osT0FEWSxFQUNILGtCQURHLEVBQ2lCLE9BRGpCLEVBQzBCLHFCQUQxQixFQUNpRCxLQURqRCxFQUN3RCxLQUR4RDtBQUV6Qjs7QUExQmM7QUFBQTtBQUFBLDZCQTRCUjtBQUNMLFlBQUksS0FBSyxPQUFMLENBQWEsT0FBYixDQUFxQixTQUFyQixDQUErQixRQUEvQixDQUF3QyxRQUF4QyxDQUFKLEVBQXVEO0FBQ3JELGlCQUFPLEtBQVA7QUFDRDs7QUFFRCxZQUFNLEtBQUssS0FBSyxPQUFMLENBQWEsT0FBYixDQUFxQixZQUFyQixDQUFrQyxNQUFsQyxDQUFYO0FBQ0EsWUFBTSxNQUFNLDhCQUFrQixLQUFLLE9BQUwsQ0FBYSxPQUEvQixFQUF3QyxLQUF4QyxDQUFaO0FBQ0EsWUFBTSxVQUFVLE1BQU0sSUFBSSxnQkFBSixvQkFBc0MsSUFBdEMsUUFBTixHQUF3RCxJQUF4RTs7QUFFQSxZQUFJLE9BQUosRUFBYTtBQUNYLGdCQUFNLElBQU4sQ0FBVyxPQUFYLEVBQW9CLE9BQXBCLENBQTRCLFVBQUMsR0FBRCxFQUFTO0FBQ25DLGdCQUFJLElBQUksU0FBSixDQUFjLFFBQWQsQ0FBdUIsUUFBdkIsQ0FBSixFQUFzQztBQUNwQyxrQkFBSSxTQUFKLENBQWMsTUFBZCxDQUFxQixRQUFyQjtBQUNEO0FBQ0QsZ0JBQUksWUFBSixDQUFpQixlQUFqQixFQUFrQyxLQUFsQztBQUNELFdBTEQ7QUFNRDs7QUFFRCxhQUFLLE9BQUwsQ0FBYSxPQUFiLENBQXFCLFNBQXJCLENBQStCLEdBQS9CLENBQW1DLFFBQW5DO0FBQ0EsYUFBSyxPQUFMLENBQWEsT0FBYixDQUFxQixZQUFyQixDQUFrQyxlQUFsQyxFQUFtRCxJQUFuRDs7QUFFQSxZQUFNLGFBQWEsU0FBUyxhQUFULENBQXVCLEVBQXZCLENBQW5CO0FBQ0EsWUFBTSxjQUFjLFdBQVcsVUFBWCxDQUFzQixnQkFBdEIsQ0FBdUMsb0JBQXZDLENBQXBCOztBQUVBLFlBQUksV0FBSixFQUFpQjtBQUNmLGdCQUFNLElBQU4sQ0FBVyxXQUFYLEVBQXdCLE9BQXhCLENBQWdDLFVBQUMsR0FBRCxFQUFTO0FBQ3ZDLGdCQUFJLElBQUksU0FBSixDQUFjLFFBQWQsQ0FBdUIsUUFBdkIsQ0FBSixFQUFzQztBQUNwQyxrQkFBSSxTQUFKLENBQWMsTUFBZCxDQUFxQixRQUFyQjtBQUNEO0FBQ0YsV0FKRDtBQUtEOztBQUVELG1CQUFXLFNBQVgsQ0FBcUIsR0FBckIsQ0FBeUIsU0FBekI7O0FBRUEsbUJBQVcsWUFBTTtBQUNmLGNBQU0sV0FBVyxTQUFYLFFBQVcsR0FBTTtBQUNyQix1QkFBVyxTQUFYLENBQXFCLE1BQXJCLENBQTRCLFNBQTVCO0FBQ0EsdUJBQVcsU0FBWCxDQUFxQixHQUFyQixDQUF5QixRQUF6QjtBQUNBLHVCQUFXLFNBQVgsQ0FBcUIsTUFBckIsQ0FBNEIsU0FBNUI7QUFDQSx1QkFBVyxtQkFBWCxDQUErQixpQkFBTSxjQUFyQyxFQUFxRCxRQUFyRDtBQUNELFdBTEQ7O0FBT0EscUJBQVcsZ0JBQVgsQ0FBNEIsaUJBQU0sY0FBbEMsRUFBa0QsUUFBbEQ7O0FBRUEscUJBQVcsU0FBWCxDQUFxQixHQUFyQixDQUF5QixTQUF6QjtBQUVELFNBWkQsRUFZRyxFQVpIOztBQWNBLGVBQU8sSUFBUDtBQUNEO0FBN0VjO0FBQUE7QUFBQSw2QkErRVI7QUFDTCxZQUFJLENBQUMsS0FBSyxPQUFMLENBQWEsT0FBYixDQUFxQixTQUFyQixDQUErQixRQUEvQixDQUF3QyxRQUF4QyxDQUFMLEVBQXdEO0FBQ3RELGlCQUFPLEtBQVA7QUFDRDs7QUFFRCxZQUFJLEtBQUssT0FBTCxDQUFhLE9BQWIsQ0FBcUIsU0FBckIsQ0FBK0IsUUFBL0IsQ0FBd0MsUUFBeEMsQ0FBSixFQUF1RDtBQUNyRCxlQUFLLE9BQUwsQ0FBYSxPQUFiLENBQXFCLFNBQXJCLENBQStCLE1BQS9CLENBQXNDLFFBQXRDO0FBQ0Q7O0FBRUQsYUFBSyxPQUFMLENBQWEsT0FBYixDQUFxQixZQUFyQixDQUFrQyxlQUFsQyxFQUFtRCxLQUFuRDs7QUFFQSxZQUFNLEtBQUssS0FBSyxPQUFMLENBQWEsT0FBYixDQUFxQixZQUFyQixDQUFrQyxNQUFsQyxDQUFYO0FBQ0EsWUFBTSxhQUFhLFNBQVMsYUFBVCxDQUF1QixFQUF2QixDQUFuQjs7QUFFQSxZQUFJLFdBQVcsU0FBWCxDQUFxQixRQUFyQixDQUE4QixRQUE5QixDQUFKLEVBQTZDO0FBQzNDLHFCQUFXLFNBQVgsQ0FBcUIsTUFBckIsQ0FBNEIsUUFBNUI7QUFDRDs7QUFFRCxlQUFPLElBQVA7QUFDRDtBQWxHYztBQUFBO0FBQUEsbUNBb0dLO0FBQ2xCLGVBQU8sSUFBUDtBQUNEO0FBdEdjO0FBQUE7QUFBQSxvQ0F3R00sT0F4R04sRUF3R2U7QUFDNUIsbUdBQTJCLEdBQTNCLEVBQWdDLE9BQWhDO0FBQ0Q7QUExR2M7O0FBQUE7QUFBQTs7QUE2R2pCOzs7Ozs7O0FBS0EsTUFBTSxhQUFhLEVBQW5COztBQUVBLE1BQU0sT0FBTyxTQUFTLGdCQUFULG9CQUEyQyxJQUEzQyxRQUFiO0FBQ0EsTUFBSSxJQUFKLEVBQVU7QUFDUixVQUFNLElBQU4sQ0FBVyxJQUFYLEVBQWlCLE9BQWpCLENBQXlCLFVBQUMsT0FBRCxFQUFhO0FBQ3BDO0FBQ0EsVUFBTSxTQUFTLDJDQUFvQixPQUFwQixFQUE2QixrQkFBN0IsRUFBaUQscUJBQWpELENBQWY7QUFDQSxhQUFPLE9BQVAsR0FBaUIsT0FBakI7O0FBRUEsaUJBQVcsSUFBWCxDQUFnQixJQUFJLGFBQUosQ0FBa0IsTUFBbEIsQ0FBaEI7QUFDRCxLQU5EO0FBT0Q7O0FBRUQsTUFBSSxJQUFKLEVBQVU7QUFDUixhQUFTLGdCQUFULENBQTBCLE9BQTFCLEVBQW1DLFVBQUMsS0FBRCxFQUFXO0FBQzVDLFVBQU0saUJBQWlCLE1BQU0sTUFBTixDQUFhLFlBQWIsQ0FBMEIsYUFBMUIsQ0FBdkI7QUFDQSxVQUFJLGtCQUFrQixtQkFBbUIsSUFBekMsRUFBK0M7QUFDN0MsWUFBTSxLQUFLLE1BQU0sTUFBTixDQUFhLFlBQWIsQ0FBMEIsTUFBMUIsQ0FBWDs7QUFFQSxZQUFNLFlBQVksV0FBVyxJQUFYLENBQWdCO0FBQUEsaUJBQUssRUFBRSxVQUFGLEdBQWUsWUFBZixDQUE0QixNQUE1QixNQUF3QyxFQUE3QztBQUFBLFNBQWhCLENBQWxCOztBQUVBLFlBQUksQ0FBQyxTQUFMLEVBQWdCO0FBQ2Q7QUFDRDs7QUFFRCxrQkFBVSxJQUFWO0FBQ0Q7QUFDRixLQWJEO0FBY0Q7O0FBRUQsU0FBTyxHQUFQO0FBQ0QsQ0FqSlcsRUFBWjs7a0JBbUplLEc7Ozs7Ozs7Ozs7Ozs7OztBQzdKZjs7Ozs7O0FBTUEsSUFBTSxTQUFVLFlBQU07QUFDcEI7Ozs7OztBQU1BLE1BQU0sT0FBTyxhQUFiO0FBQ0EsTUFBTSxVQUFVLE9BQWhCOztBQUVBOzs7Ozs7QUFWb0IsTUFnQmQsTUFoQmM7QUFpQmxCLG9CQUFZLE9BQVosRUFBcUIsSUFBckIsRUFBMkI7QUFBQTs7QUFDekIsV0FBSyxPQUFMLEdBQWUsT0FBZjtBQUNBLFdBQUssSUFBTCxHQUFZLElBQVo7O0FBRUEsVUFBSSxDQUFDLEtBQUssU0FBTCxDQUFlLEtBQUssT0FBcEIsQ0FBTCxFQUFtQztBQUNqQztBQUNEOztBQUVEO0FBQ0EsVUFBSSxLQUFLLE9BQUwsQ0FBYSxNQUFiLElBQXVCLEtBQUssT0FBTCxDQUFhLE1BQWIsR0FBc0IsQ0FBakQsRUFBb0Q7QUFDbEQsYUFBSyxRQUFMLENBQWMsS0FBSyxPQUFuQjtBQUNELE9BRkQsTUFFTztBQUNMO0FBQ0EsYUFBSyxPQUFMLENBQWEsS0FBSyxPQUFsQjtBQUNEO0FBQ0Y7O0FBRUQ7O0FBbENrQjtBQUFBOzs7QUF3Q2xCOzs7OztBQXhDa0IsZ0NBNkNSLE9BN0NRLEVBNkNDO0FBQ2pCLFlBQUksWUFBWSxJQUFoQixFQUFzQjtBQUNwQixpQkFBTyxLQUFQO0FBQ0Q7QUFDRCxlQUFRLFFBQU8sSUFBUCx5Q0FBTyxJQUFQLE9BQWdCLFFBQWhCLEdBQTJCLG1CQUFtQixJQUE5QyxHQUFxRCxXQUFXLFFBQU8sT0FBUCx5Q0FBTyxPQUFQLE9BQW1CLFFBQTlCLElBQTBDLE9BQU8sUUFBUSxRQUFmLEtBQTRCLFFBQXRFLElBQWtGLE9BQU8sUUFBUSxRQUFmLEtBQTRCLFFBQTNLO0FBQ0Q7O0FBRUQ7Ozs7OztBQXBEa0I7QUFBQTtBQUFBLDhCQXlEVixPQXpEVSxFQXlERCxJQXpEQyxFQXlESztBQUNyQixZQUFJLEVBQUUsaUJBQWlCLE9BQW5CLENBQUosRUFBaUM7QUFDL0Isa0JBQVEsU0FBUixHQUFvQixJQUFwQjtBQUNELFNBRkQsTUFFTztBQUNMLGtCQUFRLFdBQVIsR0FBc0IsSUFBdEI7QUFDRDtBQUNGOztBQUVEOzs7Ozs7QUFqRWtCO0FBQUE7QUFBQSw4QkFzRVYsT0F0RVUsRUFzRUQsSUF0RUMsRUFzRUs7QUFDckIsZ0JBQVEsU0FBUixHQUFvQixJQUFwQjtBQUNEOztBQUVEOzs7Ozs7O0FBMUVrQjtBQUFBO0FBQUEsbUNBZ0ZMLE9BaEZLLEVBZ0ZJLElBaEZKLEVBZ0ZVLElBaEZWLEVBZ0ZnQjtBQUNoQyxnQkFBUSxZQUFSLENBQXFCLElBQXJCLEVBQTJCLElBQTNCO0FBQ0Q7QUFsRmlCO0FBQUE7QUFBQSw4QkFvRlYsT0FwRlUsRUFvRkQ7QUFDZixZQUFJLE9BQU8sUUFBUSxZQUFSLENBQXFCLFdBQXJCLENBQVg7QUFDQSxZQUFJLENBQUMsSUFBTCxFQUFXO0FBQ1Q7QUFDRDs7QUFFRCxlQUFPLEtBQUssSUFBTCxFQUFQOztBQUVBLFlBQU0sSUFBSSxpREFBVjtBQUNBLFlBQUksVUFBSjs7QUFFQSxlQUFPLElBQUksRUFBRSxJQUFGLENBQU8sSUFBUCxDQUFYLEVBQXlCO0FBQ3ZCLGNBQU0sTUFBTSxFQUFFLENBQUYsRUFBSyxJQUFMLEVBQVo7QUFDQSxjQUFNLFFBQVEsRUFBRSxDQUFGLEVBQUssSUFBTCxHQUFZLE9BQVosQ0FBb0IsR0FBcEIsRUFBeUIsRUFBekIsQ0FBZDtBQUNBLGNBQUksWUFBWSxLQUFLLElBQUwsQ0FBVSxLQUFWLENBQWhCOztBQUVBLGNBQUksQ0FBQyxLQUFLLElBQUwsQ0FBVSxLQUFWLENBQUwsRUFBdUI7QUFDckIsb0JBQVEsR0FBUixDQUFlLElBQWYsbUJBQWlDLEtBQWpDO0FBQ0Esd0JBQVksS0FBWjtBQUNEOztBQUVELGNBQU0sYUFBYSxRQUFRLElBQUksTUFBSixDQUFXLENBQVgsRUFBYyxXQUFkLEVBQVIsR0FBc0MsSUFBSSxLQUFKLENBQVUsQ0FBVixDQUF6RDs7QUFFQSxjQUFJLEtBQUssVUFBTCxDQUFKLEVBQXNCO0FBQ3BCLGlCQUFLLFVBQUwsRUFBaUIsT0FBakIsRUFBMEIsU0FBMUI7QUFDRCxXQUZELE1BRU87QUFDTCxpQkFBSyxZQUFMLENBQWtCLE9BQWxCLEVBQTJCLEdBQTNCLEVBQWdDLFNBQWhDO0FBQ0Q7QUFDRjtBQUNGOztBQUVEOzs7O0FBbkhrQjtBQUFBO0FBQUEsK0JBc0hULE9BdEhTLEVBc0hBO0FBQUE7O0FBQ2hCLGNBQU0sSUFBTixDQUFXLE9BQVgsRUFBb0IsT0FBcEIsQ0FBNEI7QUFBQSxpQkFBTSxNQUFLLE9BQUwsQ0FBYSxFQUFiLENBQU47QUFBQSxTQUE1QjtBQUNEO0FBeEhpQjtBQUFBO0FBQUEsMEJBb0NHO0FBQ25CLGVBQVUsSUFBVixTQUFrQixPQUFsQjtBQUNEO0FBdENpQjs7QUFBQTtBQUFBOztBQTJIcEIsU0FBTyxNQUFQO0FBQ0QsQ0E1SGMsRUFBZjs7a0JBOEhlLE07Ozs7Ozs7Ozs7O3FqQkNwSWY7Ozs7Ozs7QUFLQTs7Ozs7Ozs7QUFFQSxJQUFNLE9BQVEsWUFBTTtBQUNsQjs7Ozs7O0FBTUEsTUFBTSxPQUFPLE1BQWI7QUFDQSxNQUFNLFVBQVUsT0FBaEI7QUFDQSxNQUFNLHFCQUFxQjtBQUN6QixvQkFBZ0IsSUFEUztBQUV6QixZQUFRLElBRmlCO0FBR3pCLGNBQVUsSUFIZTtBQUl6QixVQUFNOztBQUdSOzs7Ozs7QUFQMkIsR0FBM0I7QUFUa0IsTUFzQlosSUF0Qlk7QUF1QmhCOzs7O0FBSUEsb0JBQTBCO0FBQUEsVUFBZCxPQUFjLHVFQUFKLEVBQUk7O0FBQUE7O0FBQ3hCLFdBQUssT0FBTCxHQUFlLE9BQU8sTUFBUCxDQUFjLGtCQUFkLEVBQWtDLE9BQWxDLENBQWY7O0FBRUEsVUFBSSxPQUFPLEtBQUssT0FBTCxDQUFhLGNBQXBCLEtBQXVDLFFBQTNDLEVBQXFEO0FBQ25ELGNBQU0sSUFBSSxLQUFKLENBQWEsSUFBYiw4REFBTjtBQUNEOztBQUVELFVBQUksS0FBSyxPQUFMLENBQWEsSUFBYixLQUFzQixJQUExQixFQUFnQztBQUM5QixjQUFNLElBQUksS0FBSixDQUFhLElBQWIscUNBQU47QUFDRDs7QUFFRCxVQUFJLFFBQU8sS0FBSyxPQUFMLENBQWEsSUFBYixDQUFrQixLQUFLLE9BQUwsQ0FBYSxjQUEvQixDQUFQLE1BQTBELFFBQTlELEVBQXdFO0FBQ3RFLGNBQU0sSUFBSSxLQUFKLENBQWEsSUFBYixtRUFBTjtBQUNEOztBQUVELFdBQUssU0FBTCxDQUFlLEtBQUssT0FBTCxDQUFhLE1BQTVCLEVBQW9DLEtBQUssT0FBTCxDQUFhLFFBQWpEO0FBQ0Q7O0FBM0NlO0FBQUE7QUFBQSxrQ0FpREo7QUFDVixlQUFPLEtBQUssT0FBTCxDQUFhLE1BQXBCO0FBQ0Q7QUFuRGU7QUFBQTtBQUFBLDBDQXFESTtBQUNsQixlQUFPLEtBQUssT0FBTCxDQUFhLGNBQXBCO0FBQ0Q7O0FBRUQ7Ozs7OztBQXpEZ0I7QUFBQTtBQUFBLGdDQThETixNQTlETSxFQThEcUI7QUFBQSxZQUFuQixVQUFtQix1RUFBTixJQUFNOztBQUNuQyxZQUFJLFFBQU8sS0FBSyxPQUFMLENBQWEsSUFBYixDQUFrQixNQUFsQixDQUFQLE1BQXFDLFFBQXpDLEVBQW1EO0FBQ2pELGtCQUFRLEtBQVIsQ0FBaUIsSUFBakIsVUFBMEIsTUFBMUIsa0NBQTZELEtBQUssT0FBTCxDQUFhLGNBQTFFO0FBQ0QsU0FGRCxNQUVPO0FBQ0wsZUFBSyxPQUFMLENBQWEsTUFBYixHQUFzQixNQUF0QjtBQUNEOztBQUVELFlBQUksVUFBSixFQUFnQjtBQUNkLGVBQUssVUFBTDtBQUNEO0FBQ0Y7QUF4RWU7QUFBQTtBQUFBLHFDQTBFRDtBQUNiLGVBQU8sT0FBTyxJQUFQLENBQVksS0FBSyxPQUFMLENBQWEsSUFBekIsQ0FBUDtBQUNEO0FBNUVlO0FBQUE7QUFBQSxxQ0E4RWtDO0FBQUEsWUFBckMsS0FBcUMsdUVBQTdCLElBQTZCO0FBQUEsWUFBdkIsZ0JBQXVCLHVFQUFKLEVBQUk7O0FBQ2hELFlBQUksT0FBTyxLQUFQLEtBQWlCLFFBQXJCLEVBQStCO0FBQzdCLGlCQUFPLFNBQVA7QUFDRDs7QUFFRCxZQUFNLFFBQVEsTUFBTSxLQUFOLENBQVksbUJBQVosQ0FBZDtBQUNBLFlBQUksS0FBSixFQUFXO0FBQ1Qsa0JBQVEsTUFBTSxPQUFOLENBQWMsTUFBTSxDQUFOLENBQWQsRUFBd0IsaUJBQWlCLE1BQU0sQ0FBTixDQUFqQixDQUF4QixDQUFSO0FBQ0Q7O0FBRUQsWUFBSSxNQUFNLEtBQU4sQ0FBWSxtQkFBWixDQUFKLEVBQXNDO0FBQ3BDLGlCQUFPLEtBQUssWUFBTCxDQUFrQixLQUFsQixFQUF5QixnQkFBekIsQ0FBUDtBQUNEOztBQUVELGVBQU8sS0FBUDtBQUNEO0FBN0ZlO0FBQUE7QUFBQSxrQ0ErRnVCO0FBQUE7O0FBQUEsWUFBN0IsT0FBNkIsdUVBQW5CLElBQW1CO0FBQUEsWUFBYixNQUFhLHVFQUFKLEVBQUk7O0FBQ3JDLFlBQUksT0FBTyxLQUFLLE9BQUwsQ0FBYSxJQUFiLENBQWtCLEtBQUssT0FBTCxDQUFhLE1BQS9CLENBQVg7QUFDQSxZQUFJLENBQUMsSUFBTCxFQUFXO0FBQ1QsaUJBQU8sS0FBSyxPQUFMLENBQWEsSUFBYixDQUFrQixLQUFLLE9BQUwsQ0FBYSxjQUEvQixDQUFQO0FBQ0Q7O0FBRUQsWUFBSSxZQUFZLElBQVosSUFBb0IsWUFBWSxHQUFoQyxJQUF1QyxNQUFNLE9BQU4sQ0FBYyxPQUFkLENBQTNDLEVBQW1FO0FBQ2pFLGNBQUksTUFBTSxPQUFOLENBQWMsT0FBZCxDQUFKLEVBQTRCO0FBQzFCLGdCQUFNLE9BQU8sT0FBTyxJQUFQLENBQVksSUFBWixFQUFrQixNQUFsQixDQUF5QjtBQUFBLHFCQUFPLFFBQVEsT0FBUixDQUFnQixHQUFoQixJQUF1QixDQUFDLENBQS9CO0FBQUEsYUFBekIsQ0FBYjtBQUNBLGdCQUFNLGVBQWUsRUFBckI7QUFDQSxpQkFBSyxPQUFMLENBQWEsZUFBTztBQUNsQiwyQkFBYSxHQUFiLElBQW9CLE1BQUssWUFBTCxDQUFrQixLQUFLLEdBQUwsQ0FBbEIsRUFBNkIsTUFBN0IsQ0FBcEI7QUFDRCxhQUZEO0FBR0EsbUJBQU8sWUFBUDtBQUNEOztBQUVELGNBQU0sVUFBVSxFQUFoQjtBQUNBLGVBQUssSUFBTSxHQUFYLElBQWtCLElBQWxCLEVBQXdCO0FBQ3RCLG9CQUFRLEdBQVIsSUFBZSxLQUFLLFlBQUwsQ0FBa0IsS0FBSyxHQUFMLENBQWxCLEVBQTZCLE1BQTdCLENBQWY7QUFDRDs7QUFFRCxpQkFBTyxPQUFQO0FBQ0Q7O0FBRUQsZUFBTyxLQUFLLFlBQUwsQ0FBa0IsS0FBSyxPQUFMLENBQWxCLEVBQWlDLE1BQWpDLENBQVA7QUFDRDs7QUFFRDs7QUExSGdCO0FBQUE7QUFBQSwwQkEySGU7QUFBQSxZQUE3QixPQUE2Qix1RUFBbkIsSUFBbUI7QUFBQSxZQUFiLE1BQWEsdUVBQUosRUFBSTs7QUFDN0IsZUFBTyxLQUFLLFNBQUwsQ0FBZSxPQUFmLEVBQXdCLE1BQXhCLENBQVA7QUFDRDs7QUFFRDs7Ozs7QUEvSGdCO0FBQUE7QUFBQSxpQ0FtSUwsT0FuSUssRUFtSUk7QUFDbEIsWUFBSSxPQUFPLE9BQVAsS0FBbUIsV0FBdkIsRUFBb0M7QUFDbEMsb0JBQVUsU0FBUyxnQkFBVCxDQUEwQixhQUExQixDQUFWO0FBQ0Q7O0FBRUQsWUFBSSxPQUFPLE9BQVAsS0FBbUIsUUFBdkIsRUFBaUM7QUFDL0Isb0JBQVUsU0FBUyxhQUFULENBQXVCLE9BQXZCLENBQVY7QUFDRDs7QUFFRCw2QkFBVyxPQUFYLEVBQW9CLEtBQUssQ0FBTCxFQUFwQjtBQUNEOztBQUVEOztBQS9JZ0I7QUFBQTtBQUFBLG9DQWdKSyxPQWhKTCxFQWdKYztBQUM1QixlQUFPLElBQUksSUFBSixDQUFTLE9BQVQsQ0FBUDtBQUNEO0FBbEplO0FBQUE7QUFBQSwwQkE2Q0s7QUFDbkIsZUFBVSxJQUFWLFNBQWtCLE9BQWxCO0FBQ0Q7QUEvQ2U7O0FBQUE7QUFBQTs7QUFxSmxCLFNBQU8sSUFBUDtBQUNELENBdEpZLEVBQWI7O2tCQXdKZSxJOzs7Ozs7Ozs7cWpCQy9KZjs7Ozs7O0FBTUE7Ozs7QUFDQTs7Ozs7Ozs7QUFFQSxJQUFNLFFBQVMsWUFBTTtBQUNuQjs7Ozs7O0FBTUEsTUFBTSxPQUFPLE9BQWI7QUFDQSxNQUFNLFVBQVUsT0FBaEI7QUFDQSxNQUFNLHFCQUFxQjtBQUN6QixnQkFBWSxJQURhO0FBRXpCLGFBQVMsSUFGZ0I7QUFHekIsaUJBQWEsSUFIWTtBQUl6QixrQkFBYztBQUpXLEdBQTNCOztBQU9BLE1BQUksb0JBQUo7QUFDQTs7Ozs7O0FBakJtQixNQXVCYixLQXZCYTtBQXdCakI7Ozs7O0FBS0EscUJBQTBCO0FBQUEsVUFBZCxPQUFjLHVFQUFKLEVBQUk7O0FBQUE7O0FBQ3hCLFdBQUssT0FBTCxHQUFlLE9BQU8sTUFBUCxDQUFjLGtCQUFkLEVBQWtDLE9BQWxDLENBQWY7O0FBRUEsV0FBSyxLQUFMLEdBQWEsRUFBYjtBQUNBLFdBQUssT0FBTCxHQUFlLEtBQWY7O0FBRUE7QUFDQSxXQUFLLGNBQUw7O0FBRUE7QUFDQSxXQUFLLFdBQUw7QUFDRDs7QUFFRDs7O0FBMUNpQjtBQUFBO0FBQUEsd0JBMkNmLFFBM0NlLEVBMkNMO0FBQ1YsZUFBTyxTQUFTLGFBQVQsQ0FBdUIsUUFBdkIsQ0FBUDtBQUNEO0FBN0NnQjtBQUFBO0FBQUEsZ0NBK0NQO0FBQ1IsZUFBTyxPQUFPLFFBQVAsQ0FBZ0IsSUFBaEIsQ0FBcUIsS0FBckIsQ0FBMkIsS0FBSyxPQUFMLENBQWEsVUFBeEMsRUFBb0QsQ0FBcEQsQ0FBUDtBQUNEO0FBakRnQjtBQUFBO0FBQUEsd0NBbURDO0FBQ2hCLFlBQU0sT0FBTyxLQUFLLE9BQUwsRUFBYjtBQUNBLFlBQU0sS0FBSyxJQUFJLE1BQUosQ0FBVyxlQUFYLENBQVg7QUFDQSxZQUFNLFVBQVUsR0FBRyxJQUFILENBQVEsSUFBUixDQUFoQjs7QUFFQSxZQUFJLFdBQVcsUUFBUSxDQUFSLENBQWYsRUFBMkI7QUFDekIsaUJBQU8sUUFBUSxDQUFSLENBQVA7QUFDRDs7QUFFRCxlQUFPLElBQVA7QUFDRDtBQTdEZ0I7QUFBQTtBQUFBLDhCQStEVCxRQS9EUyxFQStEQztBQUNoQixlQUFPLFFBQVAsQ0FBZ0IsSUFBaEIsR0FBMEIsS0FBSyxPQUFMLENBQWEsVUFBdkMsU0FBcUQsUUFBckQ7QUFDRDtBQWpFZ0I7QUFBQTtBQUFBLGtDQW1FTCxTQW5FSyxFQW1FTSxTQW5FTixFQW1FaUI7QUFDaEMsWUFBTSxRQUFRLEtBQUssWUFBTCxDQUFrQixTQUFsQixDQUFkO0FBQ0EsWUFBTSxRQUFRLEtBQUssWUFBTCxDQUFrQixTQUFsQixDQUFkO0FBQ0EsZUFBTyxTQUFTLEtBQVQsSUFBa0IsTUFBTSxJQUFOLEtBQWUsTUFBTSxJQUE5QztBQUNEOztBQUVEOzs7OztBQXpFaUI7QUFBQTtBQUFBLHVDQTZFQTtBQUFBOztBQUNmLGlCQUFTLGdCQUFULENBQTBCLE9BQTFCLEVBQW1DO0FBQUEsaUJBQVMsTUFBSyxPQUFMLENBQWEsS0FBYixDQUFUO0FBQUEsU0FBbkM7QUFDQSxlQUFPLGdCQUFQLENBQXdCLFVBQXhCLEVBQW9DO0FBQUEsaUJBQVMsTUFBSyxhQUFMLENBQW1CLEtBQW5CLENBQVQ7QUFBQSxTQUFwQztBQUNBLGVBQU8sZ0JBQVAsQ0FBd0IsWUFBeEIsRUFBc0M7QUFBQSxpQkFBUyxNQUFLLFlBQUwsQ0FBa0IsS0FBbEIsQ0FBVDtBQUFBLFNBQXRDO0FBQ0EsaUJBQVMsZ0JBQVQsQ0FBMEIsa0JBQTFCLEVBQThDO0FBQUEsaUJBQVMsTUFBSyxXQUFMLENBQWlCLEtBQWpCLENBQVQ7QUFBQSxTQUE5QztBQUNEOztBQUVEOztBQXBGaUI7QUFBQTs7O0FBMEZqQjs7QUExRmlCLCtCQTRGUixRQTVGUSxFQTRGcUM7QUFBQTs7QUFBQSxZQUFuQyxZQUFtQyx1RUFBcEIsSUFBb0I7QUFBQSxZQUFkLElBQWMsdUVBQVAsS0FBTzs7QUFDcEQsWUFBTSxVQUFVLEtBQUssQ0FBTCxDQUFPLFVBQVAsQ0FBaEI7QUFDQSxZQUFJLE9BQUosRUFBYTtBQUNYLGNBQU0sY0FBYyxRQUFRLFlBQVIsQ0FBcUIsV0FBckIsQ0FBcEI7O0FBRUEsY0FBSSxLQUFLLFdBQUwsQ0FBaUIsUUFBakIsRUFBMkIsV0FBM0IsQ0FBSixFQUE2QztBQUMzQztBQUNEOztBQUVELGtCQUFRLFNBQVIsQ0FBa0IsTUFBbEIsQ0FBeUIsU0FBekI7O0FBRUE7QUFDQSxpQkFBTyxPQUFQLENBQWUsWUFBZixDQUE0QixFQUFFLE1BQU0sV0FBUixFQUE1QixFQUFtRCxXQUFuRCxFQUFnRSxPQUFPLFFBQVAsQ0FBZ0IsSUFBaEY7O0FBRUEsZUFBSyxnQkFBTCxDQUFzQixXQUF0QixFQUFtQyxpQkFBTSxJQUF6QztBQUNEOztBQUVELGFBQUssZ0JBQUwsQ0FBc0IsUUFBdEIsRUFBZ0MsaUJBQU0sSUFBdEM7O0FBRUEsc0JBQWMsUUFBZDs7QUFFQTtBQUNBLFlBQU0sVUFBVSxLQUFLLENBQUwsa0JBQXNCLFFBQXRCLFFBQWhCOztBQUVBLGdCQUFRLFNBQVIsQ0FBa0IsR0FBbEIsQ0FBc0IsU0FBdEI7O0FBRUE7QUFDQSxZQUFNLFlBQVksS0FBSyxZQUFMLENBQWtCLFFBQWxCLENBQWxCOztBQUVBO0FBQ0EsWUFBSSxhQUFhLFVBQVUsV0FBVixFQUFqQixFQUEwQztBQUN4QyxvQkFBVSxZQUFWO0FBQ0Q7QUFDRDs7QUFFQSxZQUFJLE9BQUosRUFBYTtBQUNYLGNBQU0sZUFBYyxRQUFRLFlBQVIsQ0FBcUIsV0FBckIsQ0FBcEI7QUFDQTtBQUNBLGtCQUFRLElBQVIsR0FBZSxJQUFmO0FBQ0Esa0JBQVEsZ0JBQVIsR0FBMkIsWUFBM0I7O0FBRUEsY0FBTSxxQkFBcUIsU0FBckIsa0JBQXFCLEdBQU07QUFDL0IsZ0JBQUksUUFBUSxTQUFSLENBQWtCLFFBQWxCLENBQTJCLFNBQTNCLENBQUosRUFBMkM7QUFDekMsc0JBQVEsU0FBUixDQUFrQixNQUFsQixDQUF5QixTQUF6QjtBQUNEOztBQUVELG9CQUFRLFNBQVIsQ0FBa0IsTUFBbEIsQ0FBeUIsUUFBUSxJQUFSLEdBQWUsVUFBZixHQUE0QixXQUFyRDs7QUFFQSxtQkFBSyxnQkFBTCxDQUFzQixXQUF0QixFQUFtQyxpQkFBTSxLQUF6QztBQUNBLG1CQUFLLGdCQUFMLENBQXNCLFFBQVEsZ0JBQTlCLEVBQWdELGlCQUFNLE1BQXREOztBQUVBLG9CQUFRLG1CQUFSLENBQTRCLGlCQUFNLGFBQWxDLEVBQWlELGtCQUFqRDtBQUNELFdBWEQ7O0FBYUEsY0FBSSxLQUFLLE9BQUwsQ0FBYSxZQUFqQixFQUErQjtBQUM3QixvQkFBUSxnQkFBUixDQUF5QixpQkFBTSxhQUEvQixFQUE4QyxrQkFBOUM7QUFDQSxvQkFBUSxTQUFSLENBQWtCLEdBQWxCLENBQXNCLFNBQXRCO0FBQ0QsV0FIRCxNQUdPO0FBQ0w7QUFDRDs7QUFFRCxrQkFBUSxTQUFSLENBQWtCLEdBQWxCLENBQXNCLE9BQU8sVUFBUCxHQUFvQixXQUExQztBQUNEO0FBQ0Y7QUEzSmdCO0FBQUE7QUFBQSx5Q0E2SkUsUUE3SkYsRUE2Slk7QUFDM0IsWUFBSSxDQUFDLEtBQUssWUFBTCxDQUFrQixRQUFsQixDQUFMLEVBQWtDO0FBQ2hDLGVBQUssS0FBTCxDQUFXLElBQVgsQ0FBZ0IsbUJBQVMsUUFBVCxDQUFoQjtBQUNEO0FBQ0Y7QUFqS2dCO0FBQUE7QUFBQSxtQ0FtS0osUUFuS0ksRUFtS007QUFDckIsZUFBTyxLQUFLLEtBQUwsQ0FBVyxJQUFYLENBQWdCO0FBQUEsaUJBQVEsS0FBSyxJQUFMLEtBQWMsUUFBdEI7QUFBQSxTQUFoQixDQUFQO0FBQ0Q7QUFyS2dCO0FBQUE7QUFBQSxvQ0F1S0gsU0F2S0csRUF1S1E7QUFDdkIsZUFBTyxLQUFLLEtBQUwsQ0FBVyxNQUFYLENBQWtCO0FBQUEsaUJBQVEsVUFBVSxPQUFWLENBQWtCLEtBQUssSUFBdkIsSUFBK0IsQ0FBQyxDQUF4QztBQUFBLFNBQWxCLENBQVA7QUFDRDtBQXpLZ0I7QUFBQTtBQUFBLHNDQTJLRCxHQTNLQyxFQTJLSTtBQUNuQixlQUFPLElBQUksS0FBSixDQUFVLEdBQVYsRUFBZSxHQUFmLENBQW1CO0FBQUEsaUJBQVEsS0FBSyxJQUFMLEVBQVI7QUFBQSxTQUFuQixDQUFQO0FBQ0Q7QUE3S2dCO0FBQUE7QUFBQSxnQ0ErS1AsUUEvS08sRUErS0c7QUFDbEIsWUFBSSxLQUFLLGlCQUFMLEtBQTJCLEdBQS9CLEVBQW9DO0FBQ2xDO0FBQ0EsZUFBSyxLQUFMLENBQVcsT0FBWCxDQUFtQixVQUFDLElBQUQsRUFBVTtBQUMzQixpQkFBSyxnQkFBTCxDQUFzQixRQUF0QjtBQUNELFdBRkQ7QUFHQTtBQUNEOztBQUVELFlBQU0sYUFBYSxLQUFLLGFBQUwsQ0FBbUIsS0FBSyxlQUFMLENBQXFCLEtBQUssaUJBQTFCLENBQW5CLEVBQWlFLElBQWpFLENBQW5CO0FBQ0EsbUJBQVcsT0FBWCxDQUFtQixVQUFDLElBQUQsRUFBVTtBQUMzQixlQUFLLGdCQUFMLENBQXNCLFFBQXRCO0FBQ0QsU0FGRDtBQUdBLGFBQUssaUJBQUwsR0FBeUIsSUFBekI7QUFDRDtBQTdMZ0I7QUFBQTtBQUFBLGtDQStMTCxZQS9MSyxFQStMZ0M7QUFBQSxZQUF2QixjQUF1Qix1RUFBTixJQUFNOztBQUMvQyxZQUFNLGFBQWEsS0FBSyxhQUFMLENBQW1CLEtBQUssZUFBTCxDQUFxQixLQUFLLGlCQUExQixDQUFuQixFQUFpRSxJQUFqRSxDQUFuQjtBQUNBLG1CQUFXLE9BQVgsQ0FBbUIsVUFBQyxJQUFELEVBQVU7QUFDM0IsZUFBSyxXQUFMLENBQWlCLFlBQWpCO0FBQ0EsY0FBSSxPQUFPLGNBQVAsS0FBMEIsVUFBOUIsRUFBMEM7QUFDeEMsaUJBQUssbUJBQUwsQ0FBeUIsY0FBekI7QUFDRDtBQUNGLFNBTEQ7QUFNQSxhQUFLLGlCQUFMLEdBQXlCLElBQXpCO0FBQ0Q7QUF4TWdCO0FBQUE7QUFBQSx1Q0EwTUEsUUExTUEsRUEwTVUsU0ExTVYsRUEwTXlDO0FBQUEsWUFBcEIsV0FBb0IsdUVBQU4sSUFBTTs7QUFDeEQsWUFBTSxZQUFZLEtBQUssWUFBTCxDQUFrQixRQUFsQixDQUFsQjtBQUNBLFlBQUksU0FBSixFQUFlO0FBQ2Isb0JBQVUsYUFBVixDQUF3QixTQUF4QixFQUFtQyxXQUFuQztBQUNEO0FBQ0Y7QUEvTWdCO0FBQUE7QUFBQSw4QkFpTlQsS0FqTlMsRUFpTkY7QUFDYixZQUFNLFdBQVcsTUFBTSxNQUFOLENBQWEsWUFBYixDQUEwQixlQUExQixDQUFqQjtBQUNBLFlBQU0sV0FBVyxFQUFFLE1BQU0sTUFBTixDQUFhLFlBQWIsQ0FBMEIsZUFBMUIsTUFBK0MsTUFBakQsQ0FBakI7O0FBRUEsWUFBSSxRQUFKLEVBQWM7QUFDWixjQUFJLGFBQWEsT0FBakIsRUFBMEI7QUFDeEI7QUFDQSxtQkFBTyxPQUFQLENBQWUsSUFBZjtBQUNBO0FBQ0Q7O0FBRUQ7Ozs7O0FBS0EsY0FBSSxLQUFLLE9BQUwsQ0FBYSxPQUFqQixFQUEwQjtBQUN4QixpQkFBSyxPQUFMLENBQWEsUUFBYjtBQUNELFdBRkQsTUFFTztBQUNMLGlCQUFLLFFBQUwsQ0FBYyxRQUFkLEVBQXdCLElBQXhCLEVBQThCLFFBQTlCO0FBQ0Q7QUFDRjtBQUNGO0FBdk9nQjtBQUFBO0FBQUEsc0NBeU9TO0FBQUEsWUFBWixLQUFZLHVFQUFKLEVBQUk7O0FBQ3hCLFlBQU0sV0FBVyxNQUFNLEtBQU4sR0FBYyxNQUFNLEtBQU4sQ0FBWSxJQUExQixHQUFpQyxJQUFsRDtBQUNBLFlBQUksQ0FBQyxRQUFMLEVBQWU7QUFDYjtBQUNEOztBQUVELGFBQUssUUFBTCxDQUFjLFFBQWQsRUFBd0IsSUFBeEIsRUFBOEIsSUFBOUI7QUFDRDtBQWhQZ0I7QUFBQTtBQUFBLHFDQWtQRjtBQUNiLFlBQU0sU0FBUyxDQUFDLEtBQUssT0FBTCxLQUFpQixLQUFLLE9BQUwsR0FBZSxLQUFmLENBQXFCLEdBQXJCLENBQWpCLEdBQTZDLEVBQTlDLEVBQWtELE1BQWxELENBQXlEO0FBQUEsaUJBQUssRUFBRSxNQUFGLEdBQVcsQ0FBaEI7QUFBQSxTQUF6RCxDQUFmO0FBQ0EsWUFBSSxPQUFPLE1BQVAsR0FBZ0IsQ0FBcEIsRUFBdUI7QUFDckI7QUFDQSxpQkFBTyxLQUFQO0FBQ0Q7O0FBRUQsYUFBSyxnQkFBTCxDQUFzQixXQUF0QixFQUFtQyxpQkFBTSxJQUF6QyxFQUErQyxNQUEvQzs7QUFFQSxZQUFNLFVBQVUsS0FBSyxlQUFMLEVBQWhCO0FBQ0EsWUFBSSxPQUFKLEVBQWE7QUFDWCxlQUFLLFFBQUwsQ0FBYyxPQUFkO0FBQ0Q7QUFDRjs7QUFFRDs7OztBQWpRaUI7QUFBQTtBQUFBLG9DQW9RSDtBQUFBOztBQUNaLFlBQU0sUUFBUSxTQUFTLGdCQUFULENBQTBCLGFBQTFCLENBQWQ7O0FBRUEsWUFBSSxDQUFDLEtBQUwsRUFBWTtBQUNWO0FBQ0Q7O0FBRUQsY0FBTSxPQUFOLENBQWMsVUFBQyxJQUFELEVBQVU7QUFDdEIsY0FBSSxXQUFXLEtBQUssWUFBTCxDQUFrQixXQUFsQixDQUFmO0FBQ0E7Ozs7QUFJQSxjQUFJLENBQUMsUUFBTCxFQUFlO0FBQ2IsdUJBQVcsS0FBSyxRQUFoQjtBQUNEOztBQUVELGlCQUFLLGtCQUFMLENBQXdCLFFBQXhCO0FBQ0QsU0FYRDtBQVlEO0FBdlJnQjtBQUFBO0FBQUEsNkJBeVJWLFFBelJVLEVBeVJxQjtBQUFBLFlBQXJCLFlBQXFCLHVFQUFOLElBQU07O0FBQ3BDLGFBQUssaUJBQUwsR0FBeUIsUUFBekI7O0FBRUEsWUFBSSxnQkFBZ0IsYUFBYSxHQUFqQyxFQUFzQztBQUNwQyxlQUFLLGtCQUFMLENBQXdCLFFBQXhCO0FBQ0Q7O0FBRUQsZUFBTyxJQUFQO0FBQ0Q7QUFqU2dCO0FBQUE7QUFBQSw4QkFtU2U7QUFBQSxZQUExQixnQkFBMEIsdUVBQVAsS0FBTzs7QUFDOUI7QUFDQSxZQUFJLEtBQUssT0FBVCxFQUFrQjtBQUNoQixnQkFBTSxJQUFJLEtBQUosQ0FBYSxJQUFiLHlDQUFOO0FBQ0Q7O0FBRUQsYUFBSyxPQUFMLEdBQWUsSUFBZjs7QUFFQTtBQUNBLFlBQUksT0FBTyxPQUFYLEVBQW9CO0FBQ2xCLDZCQUFtQixJQUFuQjtBQUNEOztBQUVELFlBQUksV0FBVyxLQUFLLGVBQUwsRUFBZjtBQUNBLFlBQUksQ0FBQyxLQUFLLFlBQUwsQ0FBa0IsUUFBbEIsQ0FBTCxFQUFrQztBQUNoQyxxQkFBVyxLQUFLLE9BQUwsQ0FBYSxXQUF4QjtBQUNEOztBQUVELFlBQUksb0JBQW9CLENBQUMsS0FBSyxPQUFMLENBQWEsV0FBdEMsRUFBbUQ7QUFDakQsZ0JBQU0sSUFBSSxLQUFKLENBQWEsSUFBYiwyREFBTjtBQUNEOztBQUVEO0FBQ0EsWUFBSSxPQUFPLEtBQVgsRUFBa0I7QUFDaEIsa0JBQVEsR0FBUixDQUFZLHdCQUF3QixTQUFTLFdBQTdDO0FBQ0Esa0JBQVEsR0FBUixDQUFZLEtBQUssS0FBTCxDQUFXLE1BQVgsR0FBb0IsY0FBaEM7QUFDQSxrQkFBUSxHQUFSLENBQVksYUFBYSxRQUF6QjtBQUNEOztBQUVEOzs7O0FBSUEsWUFBSSxLQUFLLE9BQUwsQ0FBYSxPQUFqQixFQUEwQjtBQUN4QixlQUFLLE9BQUwsQ0FBYSxRQUFiO0FBQ0Q7O0FBRUQsYUFBSyxRQUFMLENBQWMsbUJBQW1CLEtBQUssT0FBTCxDQUFhLFdBQWhDLEdBQThDLFFBQTVEO0FBQ0Q7O0FBRUQ7O0FBM1VpQjtBQUFBO0FBQUEsb0NBNFVJLE9BNVVKLEVBNFVhO0FBQzVCLGVBQU8sSUFBSSxLQUFKLENBQVUsT0FBVixDQUFQO0FBQ0Q7QUE5VWdCO0FBQUE7QUFBQSwwQkFzRkk7QUFDbkIsZUFBVSxJQUFWLFNBQWtCLE9BQWxCO0FBQ0Q7QUF4RmdCOztBQUFBO0FBQUE7O0FBaVZuQixTQUFPLEtBQVA7QUFDRCxDQWxWYSxFQUFkOztrQkFvVmUsSzs7Ozs7Ozs7Ozs7cWpCQzdWZjs7Ozs7O0FBTUE7O0FBQ0E7Ozs7QUFFQSxJQUFNLE9BQVEsWUFBTTtBQUNsQjs7Ozs7O0FBTUEsTUFBTSxPQUFPLE1BQWI7QUFDQSxNQUFNLFVBQVUsT0FBaEI7O0FBRUEsTUFBTSxvQkFBb0IsaUJBQTFCOztBQUVBOzs7Ozs7QUFaa0IsTUFrQlosSUFsQlk7QUFtQmhCOzs7O0FBSUEsa0JBQVksUUFBWixFQUFzQjtBQUFBOztBQUNwQixXQUFLLElBQUwsR0FBWSxRQUFaO0FBQ0EsV0FBSyxNQUFMLEdBQWMsRUFBZDtBQUNBLFdBQUssWUFBTCxHQUFvQixJQUFwQjtBQUNBLFdBQUssY0FBTCxHQUFzQixJQUF0QjtBQUNEOztBQUVEOztBQTlCZ0I7QUFBQTs7O0FBb0NoQjs7OztBQXBDZ0Isa0NBd0NKO0FBQ1YsZUFBTyxLQUFLLE1BQVo7QUFDRDs7QUFFRDs7Ozs7QUE1Q2dCO0FBQUE7QUFBQSxvQ0FnREY7QUFDWixlQUFPLEtBQUssWUFBWjtBQUNEOztBQUVEOzs7OztBQXBEZ0I7QUFBQTtBQUFBLDBDQXdESTtBQUNsQixlQUFPLEtBQUssY0FBWjtBQUNEO0FBMURlO0FBQUE7QUFBQSxxQ0E0REQ7QUFBQTs7QUFDYixZQUFNLGNBQWMsU0FBUyxhQUFULGtCQUFzQyxLQUFLLElBQTNDLFFBQXBCOztBQUVBLDZCQUFTLEtBQUssV0FBTCxFQUFULEVBQTZCLFVBQUMsUUFBRCxFQUFjO0FBQ3pDLGNBQUksU0FBUyxnQkFBVSxPQUFWLEVBQW1CLFFBQW5CLEVBQTZCLFFBQTdCLEVBQXVDO0FBQ2xELGdCQUFJLFFBQUosRUFBYztBQUNaLG9CQUFNLElBQU4sQ0FBVyxRQUFYLEVBQXFCLE9BQXJCLENBQTZCLFVBQUMsRUFBRCxFQUFRO0FBQ25DLG1CQUFHLFNBQUgsR0FBZSxRQUFmO0FBQ0QsZUFGRDtBQUdELGFBSkQsTUFJTztBQUNMLHNCQUFRLFNBQVIsR0FBb0IsUUFBcEI7QUFDRDtBQUNGLFdBUkQ7O0FBVUEsY0FBSSxNQUFLLGlCQUFMLEVBQUosRUFBOEI7QUFDNUIscUJBQVMsTUFBSyxpQkFBTCxFQUFUO0FBQ0Q7O0FBRUQsaUJBQU8sV0FBUCxFQUFvQixRQUFwQixFQUE4QixZQUFZLGdCQUFaLENBQTZCLGlCQUE3QixDQUE5QjtBQUNELFNBaEJELEVBZ0JHLElBaEJIO0FBaUJEOztBQUVEOztBQUVBOzs7OztBQXBGZ0I7QUFBQTtBQUFBLHVDQXdGQyxVQXhGRCxFQXdGYTtBQUMzQixhQUFLLE1BQUwsQ0FBWSxJQUFaLENBQWlCLFVBQWpCO0FBQ0Q7O0FBRUQ7Ozs7OztBQTVGZ0I7QUFBQTtBQUFBLGtDQWlHSixZQWpHSSxFQWlHVTtBQUN4QixZQUFJLE9BQU8sWUFBUCxLQUF3QixRQUE1QixFQUFzQztBQUNwQyxnQkFBTSxJQUFJLEtBQUosQ0FBVSxpREFBZ0QsWUFBaEQseUNBQWdELFlBQWhELEtBQStELFdBQXpFLENBQU47QUFDRDtBQUNELGFBQUssWUFBTCxHQUFvQixZQUFwQjtBQUNEOztBQUVEOzs7OztBQXhHZ0I7QUFBQTtBQUFBLDBDQTRHSSxjQTVHSixFQTRHb0I7QUFDbEMsWUFBSSxPQUFPLGNBQVAsS0FBMEIsVUFBOUIsRUFBMEM7QUFDeEMsZ0JBQU0sSUFBSSxLQUFKLENBQVUsOERBQTZELGNBQTdELHlDQUE2RCxjQUE3RCxLQUE4RSxXQUF4RixDQUFOO0FBQ0Q7QUFDRCxhQUFLLGNBQUwsR0FBc0IsY0FBdEI7QUFDRDs7QUFFRDs7Ozs7O0FBbkhnQjtBQUFBO0FBQUEsb0NBd0hGLFNBeEhFLEVBd0gyQjtBQUFBOztBQUFBLFlBQWxCLFdBQWtCLHVFQUFKLEVBQUk7O0FBQ3pDLFlBQU0sd0JBQXNCLFVBQVUsTUFBVixDQUFpQixDQUFqQixFQUFvQixXQUFwQixFQUF0QixHQUEwRCxVQUFVLEtBQVYsQ0FBZ0IsQ0FBaEIsQ0FBaEU7O0FBRUEsYUFBSyxNQUFMLENBQVksT0FBWixDQUFvQixVQUFDLEtBQUQsRUFBVztBQUM3QixjQUFNLGFBQWEsTUFBTSxTQUFOLENBQW5CO0FBQ0EsY0FBTSxrQkFBa0IsTUFBTSxjQUFOLENBQXhCO0FBQ0EsY0FBSSxPQUFPLFVBQVAsS0FBc0IsVUFBMUIsRUFBc0M7QUFDcEMsdUJBQVcsS0FBWCxTQUF1QixXQUF2QjtBQUNEOztBQUVEO0FBQ0EsY0FBSSxPQUFPLGVBQVAsS0FBMkIsVUFBL0IsRUFBMkM7QUFDekMsNEJBQWdCLEtBQWhCLFNBQTRCLFdBQTVCO0FBQ0Q7QUFDRixTQVhEOztBQWFBLHlDQUFrQixTQUFsQixFQUE2QixLQUFLLElBQWxDLEVBQXdDLFdBQXhDO0FBQ0Q7QUF6SWU7QUFBQTtBQUFBLDBCQWdDSztBQUNuQixlQUFVLElBQVYsU0FBa0IsT0FBbEI7QUFDRDtBQWxDZTs7QUFBQTtBQUFBOztBQTRJbEIsU0FBTyxJQUFQO0FBQ0QsQ0E3SVksRUFBYjs7a0JBK0llLEk7Ozs7Ozs7OztBQ2xKZjs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFHQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOzs7Ozs7QUFyQkE7Ozs7OztBQXVCQSxJQUFNLE1BQU0sRUFBWjs7QUFFQTs7Ozs7OztBQWZBO0FBb0JBLElBQUksTUFBSixHQUFhO0FBQ1g7QUFDQSxTQUFPOztBQUdUOzs7OztBQUxhLENBQWIsQ0FVQSxJQUFJLEtBQUosR0FBWSxVQUFDLE9BQUQsRUFBYTtBQUN2QixNQUFJLE9BQU8sSUFBSSxNQUFYLEtBQXNCLFdBQTFCLEVBQXVDO0FBQ3JDLFFBQUksTUFBSixHQUFhLGdCQUFNLGFBQU4sQ0FBb0IsT0FBcEIsQ0FBYjtBQUNEO0FBQ0QsU0FBTyxJQUFJLE1BQVg7QUFDRCxDQUxEOztBQU9BOzs7OztBQUtBLElBQUksSUFBSixHQUFXLGVBQUssYUFBaEI7O0FBRUE7Ozs7O0FBS0EsSUFBSSxPQUFKLEdBQWMsa0JBQVEsYUFBdEI7O0FBRUE7Ozs7O0FBS0EsSUFBSSxZQUFKLEdBQW1CLHVCQUFhLGFBQWhDOztBQUVBOzs7OztBQUtBLElBQUksTUFBSixHQUFhLGlCQUFPLGFBQXBCOztBQUVBLFdBQVcsWUFBTTtBQUNmLG1CQUFPLGFBQVAsQ0FBcUI7QUFDbkIsYUFBUyxJQURVO0FBRW5CLFdBQU8sUUFGWTtBQUduQixhQUFTLElBSFU7QUFJbkIsZ0JBQVk7QUFKTyxHQUFyQixFQUtHLElBTEg7QUFNRCxDQVBELEVBT0csSUFQSDs7QUFTQTs7Ozs7QUFLQSxJQUFJLFFBQUosR0FBZSxtQkFBUyxhQUF4Qjs7QUFFQTs7Ozs7QUFLQSxJQUFJLFNBQUosR0FBZ0Isb0JBQVUsYUFBMUI7O0FBR0E7Ozs7O0FBS0EsSUFBSSxHQUFKLEdBQVUsY0FBSSxhQUFkOztBQUVBOzs7OztBQUtBLElBQUksUUFBSixHQUFlLG1CQUFTLGFBQXhCOztBQUVBOzs7OztBQUtBLElBQUksTUFBSixHQUFhLGlCQUFPLGFBQXBCOztBQUVBOzs7OztBQUtBLElBQUksU0FBSixHQUFnQixvQkFBVSxhQUExQjs7QUFFQTs7Ozs7QUFLQSxJQUFJLFFBQUosR0FBZSxVQUFDLE9BQUQsRUFBYTtBQUMxQixNQUFJLFFBQVEsTUFBWixFQUFvQjtBQUNsQjtBQUNBLFdBQU8sbUJBQVMsYUFBaEI7QUFDRCxHQUhELE1BR087QUFDTDtBQUNBLFdBQU8saUJBQWUsYUFBdEI7QUFDRDtBQUNGLENBUkQ7O0FBVUE7QUFDQSxPQUFPLE1BQVAsR0FBZ0IsR0FBaEI7O2tCQUVlLEc7Ozs7Ozs7Ozs7Ozs7QUMzSWY7Ozs7QUFDQTs7Ozs7Ozs7OzsrZUFQQTs7Ozs7O0FBU0EsSUFBTSxVQUFXLFlBQU07QUFDckI7Ozs7OztBQU1BLE1BQU0sT0FBTyxTQUFiO0FBQ0EsTUFBTSxVQUFVLE9BQWhCO0FBQ0EsTUFBTSxxQkFBcUI7QUFDekIsYUFBUyxJQURnQjtBQUV6QixrQkFBYyxJQUZXO0FBR3pCLFdBQU87QUFIa0IsR0FBM0I7QUFLQSxNQUFNLHdCQUF3QixFQUE5Qjs7QUFHQTs7Ozs7O0FBakJxQixNQXVCZixPQXZCZTtBQUFBOztBQXdCbkI7Ozs7QUFJQSx1QkFBMEI7QUFBQSxVQUFkLE9BQWMsdUVBQUosRUFBSTs7QUFBQTs7QUFBQSxvSEFDbEIsSUFEa0IsRUFDWixPQURZLEVBQ0gsa0JBREcsRUFDaUIsT0FEakIsRUFDMEIscUJBRDFCLEVBQ2lELElBRGpELEVBQ3VELEtBRHZEOztBQUd4QixZQUFLLEdBQUwsR0FBVyxJQUFYO0FBQ0EsWUFBSyxhQUFMLEdBQXFCLElBQXJCOztBQUVBLFlBQUssU0FBTCxDQUFlLGlCQUFNLGNBQXJCOztBQUVBLGlCQUFXLFlBQU07QUFDZixjQUFLLFVBQUw7QUFDRCxPQUZELEVBRUcsTUFBSyxPQUFMLENBQWEsWUFGaEI7QUFSd0I7QUFXekI7O0FBdkNrQjtBQUFBO0FBQUEsa0NBeUNQO0FBQ1YsZUFBTyxLQUFLLE1BQVo7QUFDRDtBQTNDa0I7QUFBQTtBQUFBLGdDQTZDVCxNQTdDUyxFQTZDRDtBQUNoQixhQUFLLE1BQUwsR0FBYyxNQUFkO0FBQ0Q7QUEvQ2tCO0FBQUE7QUFBQSxxQ0FpREo7QUFBQTs7QUFDYixhQUFLLEdBQUwsR0FBVyxJQUFJLGNBQUosRUFBWDtBQUNBLGFBQUssR0FBTCxDQUFTLE9BQVQsR0FBbUIsS0FBbkI7O0FBRUEsWUFBTSwwQkFBd0IsSUFBSSxJQUFKLEdBQVcsT0FBWCxFQUE5Qjs7QUFFQSxhQUFLLFlBQUwsQ0FBa0IsaUJBQU0sb0JBQXhCLEVBQThDLEVBQUUsTUFBTSxJQUFJLElBQUosRUFBUixFQUE5QyxFQUFvRSxLQUFwRTs7QUFFQSxhQUFLLEdBQUwsQ0FBUyxJQUFULENBQWMsTUFBZCxFQUFzQixHQUF0QixFQUEyQixJQUEzQjs7QUFFQSxhQUFLLEdBQUwsQ0FBUyxPQUFULEdBQW1CLEtBQUssT0FBTCxDQUFhLEtBQWIsR0FBcUIsQ0FBeEM7QUFDQSxhQUFLLEdBQUwsQ0FBUyxTQUFULEdBQXFCLFlBQU07QUFDekIsaUJBQUssR0FBTCxDQUFTLEtBQVQ7QUFDQSxpQkFBSyxHQUFMLEdBQVcsSUFBWDtBQUNELFNBSEQ7O0FBS0EsYUFBSyxHQUFMLENBQVMsTUFBVCxHQUFrQixZQUFNO0FBQ3RCLGlCQUFLLElBQUw7QUFDRCxTQUZEO0FBR0EsYUFBSyxHQUFMLENBQVMsT0FBVCxHQUFtQixZQUFNO0FBQ3ZCLGlCQUFLLE1BQUw7QUFDRCxTQUZEOztBQUlBLFlBQUk7QUFDRixlQUFLLEdBQUwsQ0FBUyxJQUFUO0FBQ0QsU0FGRCxDQUVFLE9BQU8sQ0FBUCxFQUFVO0FBQ1YsZUFBSyxNQUFMO0FBQ0Q7QUFDRjtBQTdFa0I7QUFBQTtBQUFBLDZCQStFWjtBQUNMLGFBQUssWUFBTCxDQUFrQixpQkFBTSw0QkFBeEIsRUFBc0QsRUFBRSxNQUFNLElBQUksSUFBSixFQUFSLEVBQXRELEVBQTRFLEtBQTVFOztBQUVBLFlBQUksS0FBSyxTQUFMLE9BQXFCLGlCQUFNLGNBQS9CLEVBQStDO0FBQzdDLGVBQUssWUFBTCxDQUFrQixpQkFBTSxjQUF4QixFQUF3QyxFQUFFLE1BQU0sSUFBSSxJQUFKLEVBQVIsRUFBeEMsRUFBOEQsS0FBOUQ7QUFDRDs7QUFFRCxhQUFLLFNBQUwsQ0FBZSxpQkFBTSxjQUFyQjtBQUNEO0FBdkZrQjtBQUFBO0FBQUEsK0JBeUZWO0FBQ1AsYUFBSyxZQUFMLENBQWtCLGlCQUFNLDRCQUF4QixFQUFzRCxFQUFFLE1BQU0sSUFBSSxJQUFKLEVBQVIsRUFBdEQsRUFBNEUsS0FBNUU7O0FBRUEsWUFBSSxLQUFLLFNBQUwsT0FBcUIsaUJBQU0sZUFBL0IsRUFBZ0Q7QUFDOUMsZUFBSyxZQUFMLENBQWtCLGlCQUFNLGVBQXhCLEVBQXlDLEVBQUUsTUFBTSxJQUFJLElBQUosRUFBUixFQUF6QyxFQUErRCxLQUEvRDtBQUNEOztBQUVELGFBQUssU0FBTCxDQUFlLGlCQUFNLGVBQXJCO0FBQ0Q7QUFqR2tCO0FBQUE7QUFBQSxtQ0FtR047QUFBQTs7QUFDWCxhQUFLLFNBQUw7O0FBRUEsYUFBSyxZQUFMOztBQUVBLGFBQUssYUFBTCxHQUFxQixZQUFZLFlBQU07QUFDckMsaUJBQUssWUFBTDtBQUNELFNBRm9CLEVBRWxCLEtBQUssT0FBTCxDQUFhLEtBRkssQ0FBckI7QUFHRDtBQTNHa0I7QUFBQTtBQUFBLGtDQTZHUDtBQUNWLFlBQUksS0FBSyxhQUFMLEtBQXVCLElBQTNCLEVBQWlDO0FBQy9CLHdCQUFjLEtBQUssYUFBbkI7QUFDQSxlQUFLLGFBQUwsR0FBcUIsSUFBckI7QUFDRDtBQUNGO0FBbEhrQjtBQUFBO0FBQUEsb0NBb0hFLE9BcEhGLEVBb0hXO0FBQzVCLDJHQUEyQixPQUEzQixFQUFvQyxPQUFwQztBQUNEO0FBdEhrQjs7QUFBQTtBQUFBOztBQXlIckIsU0FBTyxPQUFQO0FBQ0QsQ0ExSGUsRUFBaEI7O2tCQTRIZSxPIiwiZmlsZSI6InBob25vbi5qcyIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiZXhwb3J0IGZ1bmN0aW9uIGRpc3BhdGNoV2luRG9jRXZlbnQoZXZlbnROYW1lLCBtb2R1bGVOYW1lLCBkZXRhaWwgPSB7fSkge1xuICBjb25zdCBmdWxsRXZlbnROYW1lID0gYCR7ZXZlbnROYW1lfS5waC4ke21vZHVsZU5hbWV9YFxuICB3aW5kb3cuZGlzcGF0Y2hFdmVudChuZXcgQ3VzdG9tRXZlbnQoZnVsbEV2ZW50TmFtZSwgeyBkZXRhaWwgfSkpXG4gIGRvY3VtZW50LmRpc3BhdGNoRXZlbnQobmV3IEN1c3RvbUV2ZW50KGZ1bGxFdmVudE5hbWUsIHsgZGV0YWlsIH0pKVxufVxuXG5leHBvcnQgZnVuY3Rpb24gZGlzcGF0Y2hFbGVtZW50RXZlbnQoZG9tRWxlbWVudCwgZXZlbnROYW1lLCBtb2R1bGVOYW1lLCBkZXRhaWwgPSB7fSkge1xuICBjb25zdCBmdWxsRXZlbnROYW1lID0gYCR7ZXZlbnROYW1lfS5waC4ke21vZHVsZU5hbWV9YFxuICBkb21FbGVtZW50LmRpc3BhdGNoRXZlbnQobmV3IEN1c3RvbUV2ZW50KGZ1bGxFdmVudE5hbWUsIHsgZGV0YWlsIH0pKVxufVxuXG5leHBvcnQgZnVuY3Rpb24gZGlzcGF0Y2hQYWdlRXZlbnQoZXZlbnROYW1lLCBwYWdlTmFtZSwgZGV0YWlsID0ge30pIHtcbiAgY29uc3QgZnVsbEV2ZW50TmFtZSA9IGAke3BhZ2VOYW1lfS4ke2V2ZW50TmFtZX1gXG4gIHdpbmRvdy5kaXNwYXRjaEV2ZW50KG5ldyBDdXN0b21FdmVudChmdWxsRXZlbnROYW1lLCB7IGRldGFpbCB9KSlcbiAgZG9jdW1lbnQuZGlzcGF0Y2hFdmVudChuZXcgQ3VzdG9tRXZlbnQoZnVsbEV2ZW50TmFtZSwgeyBkZXRhaWwgfSkpXG59XG4iLCIvLyBAdG9kbyBrZWVwID9cbmlmICh0eXBlb2Ygd2luZG93ICE9PSAndW5kZWZpbmVkJykge1xuICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcignZXJyb3InLCAoKSA9PiB7XG4gICAgY29uc29sZS5lcnJvcignQW4gZXJyb3IgaGFzIG9jY3VyZWQhIFlvdSBjYW4gcGVuIGFuIGlzc3VlIGhlcmU6IGh0dHBzOi8vZ2l0aHViLmNvbS9xdWFyay1kZXYvUGhvbm9uLUZyYW1ld29yay9pc3N1ZXMnKVxuICB9KVxufVxuXG4vLyBVc2UgYXZhaWxhYmxlIGV2ZW50c1xubGV0IGF2YWlsYWJsZUV2ZW50cyA9IFsnbW91c2Vkb3duJywgJ21vdXNlbW92ZScsICdtb3VzZXVwJ11cbmxldCB0b3VjaFNjcmVlbiA9IGZhbHNlXG5cbmlmICh0eXBlb2Ygd2luZG93ICE9PSAndW5kZWZpbmVkJykge1xuICBpZiAoKCdvbnRvdWNoc3RhcnQnIGluIHdpbmRvdykgfHwgd2luZG93LkRvY3VtZW50VG91Y2ggJiYgZG9jdW1lbnQgaW5zdGFuY2VvZiBEb2N1bWVudFRvdWNoKSB7XG4gICAgdG91Y2hTY3JlZW4gPSB0cnVlXG4gICAgYXZhaWxhYmxlRXZlbnRzID0gWyd0b3VjaHN0YXJ0JywgJ3RvdWNobW92ZScsICd0b3VjaGVuZCcsICd0b3VjaGNhbmNlbCddXG4gIH1cblxuICBpZiAod2luZG93Lm5hdmlnYXRvci5wb2ludGVyRW5hYmxlZCkge1xuICAgIGF2YWlsYWJsZUV2ZW50cyA9IFsncG9pbnRlcmRvd24nLCAncG9pbnRlcm1vdmUnLCAncG9pbnRlcnVwJywgJ3BvaW50ZXJjYW5jZWwnXVxuICB9IGVsc2UgaWYgKHdpbmRvdy5uYXZpZ2F0b3IubXNQb2ludGVyRW5hYmxlZCkge1xuICAgIGF2YWlsYWJsZUV2ZW50cyA9IFsnTVNQb2ludGVyRG93bicsICdNU1BvaW50ZXJNb3ZlJywgJ01TUG9pbnRlclVwJywgJ01TUG9pbnRlckNhbmNlbCddXG4gIH1cbn1cblxuY29uc3QgZWwgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKVxuY29uc3QgdHJhbnNpdGlvbnMgPSBbXG4gIHsgbmFtZTogJ3RyYW5zaXRpb24nLCBzdGFydDogJ3RyYW5zaXRpb25zdGFydCcsIGVuZDogJ3RyYW5zaXRpb25lbmQnIH0sXG4gIHsgbmFtZTogJ01velRyYW5zaXRpb24nLCBzdGFydDogJ3RyYW5zaXRpb25zdGFydCcsIGVuZDogJ3RyYW5zaXRpb25lbmQnIH0sXG4gIHsgbmFtZTogJ21zVHJhbnNpdGlvbicsIHN0YXJ0OiAnbXNUcmFuc2l0aW9uU3RhcnQnLCBlbmQ6ICdtc1RyYW5zaXRpb25FbmQnIH0sXG4gIHsgbmFtZTogJ1dlYmtpdFRyYW5zaXRpb24nLCBzdGFydDogJ3dlYmtpdFRyYW5zaXRpb25TdGFydCcsIGVuZDogJ3dlYmtpdFRyYW5zaXRpb25FbmQnIH0sXG5dXG5jb25zdCBhbmltYXRpb25zID0gW1xuICB7IG5hbWU6ICdhbmltYXRpb24nLCBzdGFydDogJ2FuaW1hdGlvbnN0YXJ0JywgZW5kOiAnYW5pbWF0aW9uZW5kJyB9LFxuICB7IG5hbWU6ICdNb3pBbmltYXRpb24nLCBzdGFydDogJ2FuaW1hdGlvbnN0YXJ0JywgZW5kOiAnYW5pbWF0aW9uZW5kJyB9LFxuICB7IG5hbWU6ICdtc0FuaW1hdGlvbicsIHN0YXJ0OiAnbXNBbmltYXRpb25TdGFydCcsIGVuZDogJ21zQW5pbWF0aW9uRW5kJyB9LFxuICB7IG5hbWU6ICdXZWJraXRBbmltYXRpb24nLCBzdGFydDogJ3dlYmtpdEFuaW1hdGlvblN0YXJ0JywgZW5kOiAnd2Via2l0QW5pbWF0aW9uRW5kJyB9LFxuXVxuXG5jb25zdCB0cmFuc2l0aW9uU3RhcnQgPSB0cmFuc2l0aW9ucy5maW5kKHQgPT4gZWwuc3R5bGVbdC5uYW1lXSAhPT0gdW5kZWZpbmVkKS5zdGFydFxuY29uc3QgdHJhbnNpdGlvbkVuZCA9IHRyYW5zaXRpb25zLmZpbmQodCA9PiBlbC5zdHlsZVt0Lm5hbWVdICE9PSB1bmRlZmluZWQpLmVuZFxuY29uc3QgYW5pbWF0aW9uU3RhcnQgPSBhbmltYXRpb25zLmZpbmQodCA9PiBlbC5zdHlsZVt0Lm5hbWVdICE9PSB1bmRlZmluZWQpLnN0YXJ0XG5jb25zdCBhbmltYXRpb25FbmQgPSBhbmltYXRpb25zLmZpbmQodCA9PiBlbC5zdHlsZVt0Lm5hbWVdICE9PSB1bmRlZmluZWQpLmVuZFxuXG5leHBvcnQgZGVmYXVsdCB7XG4gIC8vIHRvdWNoIHNjcmVlbiBzdXBwb3J0XG4gIFRPVUNIX1NDUkVFTjogdG91Y2hTY3JlZW4sXG5cbiAgLy8gbmV0d29ya1xuICBORVRXT1JLX09OTElORTogJ29ubGluZScsXG4gIE5FVFdPUktfT0ZGTElORTogJ29mZmxpbmUnLFxuICBORVRXT1JLX1JFQ09OTkVDVElORzogJ3JlY29ubmVjdGluZycsXG4gIE5FVFdPUktfUkVDT05ORUNUSU5HX1NVQ0NFU1M6ICdyZWNvbm5lY3Quc3VjY2VzcycsXG4gIE5FVFdPUktfUkVDT05ORUNUSU5HX0ZBSUxVUkU6ICdyZWNvbm5lY3QuZmFpbHVyZScsXG5cbiAgLy8gdXNlciBpbnRlcmZhY2Ugc3RhdGVzXG4gIFNIT1c6ICdzaG93JyxcbiAgU0hPV046ICdzaG93bicsXG4gIEhJREU6ICdoaWRlJyxcbiAgSElEREVOOiAnaGlkZGVuJyxcblxuICAvLyBoYXNoXG4gIEhBU0g6ICdoYXNoJyxcblxuICAvLyB0b3VjaCwgbW91c2UgYW5kIHBvaW50ZXIgZXZlbnRzIHBvbHlmaWxsXG4gIFNUQVJUOiBhdmFpbGFibGVFdmVudHNbMF0sXG4gIE1PVkU6IGF2YWlsYWJsZUV2ZW50c1sxXSxcbiAgRU5EOiBhdmFpbGFibGVFdmVudHNbMl0sXG4gIENBTkNFTDogdHlwZW9mIGF2YWlsYWJsZUV2ZW50c1szXSA9PT0gJ3VuZGVmaW5lZCcgPyBudWxsIDogYXZhaWxhYmxlRXZlbnRzWzNdLFxuXG4gIC8vIHRyYW5zaXRpb25zXG4gIFRSQU5TSVRJT05fU1RBUlQ6IHRyYW5zaXRpb25TdGFydCxcbiAgVFJBTlNJVElPTl9FTkQ6IHRyYW5zaXRpb25FbmQsXG5cbiAgLy8gYW5pbWF0aW9uc1xuICBBTklNQVRJT05fU1RBUlQ6IGFuaW1hdGlvblN0YXJ0LFxuICBBTklNQVRJT05fRU5EOiBhbmltYXRpb25FbmQsXG5cbiAgLy8gZHJvcGRvd25cbiAgSVRFTV9TRUxFQ1RFRDogJ2l0ZW1TZWxlY3RlZCcsXG59IiwiXG5leHBvcnQgZnVuY3Rpb24gbG9hZEZpbGUodXJsLCBmbiwgcG9zdERhdGEpIHtcbiAgY29uc3QgcmVxID0gbmV3IFhNTEh0dHBSZXF1ZXN0KClcbiAgaWYgKHJlcS5vdmVycmlkZU1pbWVUeXBlKSByZXEub3ZlcnJpZGVNaW1lVHlwZSgndGV4dC9odG1sOyBjaGFyc2V0PXV0Zi04JylcbiAgcmVxLm9ucmVhZHlzdGF0ZWNoYW5nZSA9ICgpID0+IHtcbiAgICBpZiAocmVxLnJlYWR5U3RhdGUgPT09IDQgJiYgKHBhcnNlSW50KHJlcS5zdGF0dXMsIDEwKSA9PT0gMjAwXG4gICAgICB8fCAhcmVxLnN0YXR1cyAmJiByZXEucmVzcG9uc2VUZXh0Lmxlbmd0aCkpIHtcbiAgICAgIGZuKHJlcS5yZXNwb25zZVRleHQpXG4gICAgfVxuICB9XG5cbiAgaWYgKHR5cGVvZiBwb3N0RGF0YSAhPT0gJ3N0cmluZycpIHtcbiAgICByZXEub3BlbignR0VUJywgdXJsLCB0cnVlKVxuICAgIHJlcS5zZW5kKCcnKVxuICB9IGVsc2Uge1xuICAgIHJlcS5vcGVuKCdQT1NUJywgdXJsLCB0cnVlKVxuICAgIHJlcS5zZXRSZXF1ZXN0SGVhZGVyKCdDb250ZW50LXR5cGUnLCAnYXBwbGljYXRpb24veC13d3ctZm9ybS11cmxlbmNvZGVkJylcbiAgICByZXEuc2VuZChwb3N0RGF0YSlcbiAgfVxufVxuXG5leHBvcnQgZnVuY3Rpb24gZ2VuZXJhdGVJZCgpIHtcbiAgcmV0dXJuIE1hdGgucmFuZG9tKCkudG9TdHJpbmcoMzYpLnN1YnN0cigyLCAxMClcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGZpbmRUYXJnZXRCeUNsYXNzKHRhcmdldCwgcGFyZW50Q2xhc3MpIHtcbiAgZm9yICg7IHRhcmdldCAmJiB0YXJnZXQgIT09IGRvY3VtZW50OyB0YXJnZXQgPSB0YXJnZXQucGFyZW50Tm9kZSkge1xuICAgIGlmICh0YXJnZXQuY2xhc3NMaXN0LmNvbnRhaW5zKHBhcmVudENsYXNzKSkge1xuICAgICAgcmV0dXJuIHRhcmdldFxuICAgIH1cbiAgfVxuXG4gIHJldHVybiBudWxsXG59XG5cblxuZXhwb3J0IGZ1bmN0aW9uIGZpbmRUYXJnZXRCeUlkKHRhcmdldCwgcGFyZW50SWQpIHtcbiAgZm9yICg7IHRhcmdldCAmJiB0YXJnZXQgIT09IGRvY3VtZW50OyB0YXJnZXQgPSB0YXJnZXQucGFyZW50Tm9kZSkge1xuICAgIGlmICh0YXJnZXQuZ2V0QXR0cmlidXRlKCdpZCcpID09PSBwYXJlbnRJZCkge1xuICAgICAgcmV0dXJuIHRhcmdldFxuICAgIH1cbiAgfVxuXG4gIHJldHVybiBudWxsXG59XG5cbmV4cG9ydCBmdW5jdGlvbiBmaW5kVGFyZ2V0QnlBdHRyKHRhcmdldCwgYXR0cikge1xuICBmb3IgKDsgdGFyZ2V0ICYmIHRhcmdldCAhPT0gZG9jdW1lbnQ7IHRhcmdldCA9IHRhcmdldC5wYXJlbnROb2RlKSB7XG4gICAgaWYgKHRhcmdldC5nZXRBdHRyaWJ1dGUoYXR0cikgIT09IG51bGwpIHtcbiAgICAgIHJldHVybiB0YXJnZXRcbiAgICB9XG4gIH1cblxuICByZXR1cm4gbnVsbFxufVxuIiwiLyoqXG4gKiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICogTGljZW5zZWQgdW5kZXIgTUlUIChodHRwczovL2dpdGh1Yi5jb20vcXVhcmstZGV2L1Bob25vbi1GcmFtZXdvcmsvYmxvYi9tYXN0ZXIvTElDRU5TRSlcbiAqIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gKi9cbmltcG9ydCBDb21wb25lbnQgZnJvbSAnLi4vY29tcG9uZW50J1xuaW1wb3J0IENvbGxhcHNlIGZyb20gJy4uL2NvbGxhcHNlJ1xuaW1wb3J0IHsgZ2V0QXR0cmlidXRlc0NvbmZpZyB9IGZyb20gJy4uL2NvbXBvbmVudE1hbmFnZXInXG5pbXBvcnQgeyBmaW5kVGFyZ2V0QnlDbGFzcyB9IGZyb20gJy4uLy4uL2NvbW1vbi91dGlscydcblxuY29uc3QgQWNjb3JkaW9uID0gKCgpID0+IHtcbiAgLyoqXG4gICAqIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgKiBDb25zdGFudHNcbiAgICogLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAqL1xuXG4gIGNvbnN0IE5BTUUgPSAnYWNjb3JkaW9uJ1xuICBjb25zdCBWRVJTSU9OID0gJzIuMC4wJ1xuICBjb25zdCBERUZBVUxUX1BST1BFUlRJRVMgPSB7XG4gICAgZWxlbWVudDogbnVsbCxcbiAgfVxuICBjb25zdCBEQVRBX0FUVFJTX1BST1BFUlRJRVMgPSBbXG4gIF1cblxuICAvKipcbiAgICogLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAqIENsYXNzIERlZmluaXRpb25cbiAgICogLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAqL1xuXG4gIGNsYXNzIEFjY29yZGlvbiBleHRlbmRzIENvbXBvbmVudCB7XG5cbiAgICBjb25zdHJ1Y3RvcihvcHRpb25zID0ge30pIHtcbiAgICAgIHN1cGVyKE5BTUUsIFZFUlNJT04sIERFRkFVTFRfUFJPUEVSVElFUywgb3B0aW9ucywgREFUQV9BVFRSU19QUk9QRVJUSUVTLCBmYWxzZSwgZmFsc2UpXG5cbiAgICAgIHRoaXMuY29sbGFwc2VzID0gW11cblxuICAgICAgY29uc3QgdG9nZ2xlcyA9IHRoaXMub3B0aW9ucy5lbGVtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoYFtkYXRhLXRvZ2dsZT1cIiR7TkFNRX1cIl1gKVxuICAgICAgQXJyYXkuZnJvbSh0b2dnbGVzKS5mb3JFYWNoKCh0b2dnbGUpID0+IHtcbiAgICAgICAgY29uc3QgY29sbGFwc2VJZCA9IHRvZ2dsZS5nZXRBdHRyaWJ1dGUoJ2hyZWYnKVxuICAgICAgICBjb25zdCBjb2xsYXBzZSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoY29sbGFwc2VJZClcblxuICAgICAgICBpZiAoY29sbGFwc2UpIHtcbiAgICAgICAgICB0aGlzLmFkZENvbGxhcHNlKGNvbGxhcHNlKVxuICAgICAgICB9XG4gICAgICB9KVxuICAgIH1cblxuICAgIG9uRWxlbWVudEV2ZW50KGV2ZW50KSB7XG4gICAgICBjb25zdCBpZCA9IGV2ZW50LnRhcmdldC5nZXRBdHRyaWJ1dGUoJ2hyZWYnKVxuICAgICAgY29uc3QgZWxlbWVudCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoaWQpXG5cbiAgICAgIHRoaXMuc2V0Q29sbGFwc2VzKGVsZW1lbnQpXG4gICAgfVxuXG4gICAgYWRkQ29sbGFwc2UoZWxlbWVudCkge1xuICAgICAgY29uc3QgY29sbGFwc2UgPSBuZXcgQ29sbGFwc2Uoe1xuICAgICAgICBlbGVtZW50LFxuICAgICAgfSlcbiAgICAgIHRoaXMuY29sbGFwc2VzLnB1c2goY29sbGFwc2UpXG5cbiAgICAgIHJldHVybiBjb2xsYXBzZVxuICAgIH1cblxuICAgIGdldENvbGxhcHNlKGVsZW1lbnQpIHtcbiAgICAgIGxldCBjb2xsYXBzZSA9IHRoaXMuY29sbGFwc2VzLmZpbmQoYyA9PiBjLm9wdGlvbnMuZWxlbWVudC5nZXRBdHRyaWJ1dGUoJ2lkJykgPT09IGVsZW1lbnQuZ2V0QXR0cmlidXRlKCdpZCcpKVxuXG4gICAgICBpZiAoIWNvbGxhcHNlKSB7XG4gICAgICAgIC8vIGNyZWF0ZSBhIG5ldyBjb2xsYXBzZVxuICAgICAgICBjb2xsYXBzZSA9IHRoaXMuYWRkQ29sbGFwc2UoKVxuICAgICAgfVxuXG4gICAgICByZXR1cm4gY29sbGFwc2VcbiAgICB9XG5cbiAgICBnZXRDb2xsYXBzZXMoKSB7XG4gICAgICByZXR1cm4gdGhpcy5jb2xsYXBzZXNcbiAgICB9XG5cbiAgICBzZXRDb2xsYXBzZXMoc2hvd0NvbGxhcHNlKSB7XG4gICAgICBjb25zdCBjb2xsYXBzZSA9IHRoaXMuZ2V0Q29sbGFwc2Uoc2hvd0NvbGxhcHNlKVxuICAgICAgdGhpcy5jb2xsYXBzZXMuZm9yRWFjaCgoYykgPT4ge1xuICAgICAgICBpZiAoYy5vcHRpb25zLmVsZW1lbnQuZ2V0QXR0cmlidXRlKCdpZCcpICE9PSBzaG93Q29sbGFwc2UuZ2V0QXR0cmlidXRlKCdpZCcpKSB7XG4gICAgICAgICAgYy5oaWRlKClcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBjb2xsYXBzZS50b2dnbGUoKVxuICAgICAgICB9XG4gICAgICB9KVxuICAgIH1cblxuICAgIHNob3coY29sbGFwc2VFbCkge1xuICAgICAgbGV0IGNvbGxhcHNlID0gY29sbGFwc2VFbFxuICAgICAgaWYgKHR5cGVvZiBjb2xsYXBzZUVsID09PSAnc3RyaW5nJykge1xuICAgICAgICBjb2xsYXBzZSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoY29sbGFwc2VFbClcbiAgICAgIH1cblxuICAgICAgaWYgKCFjb2xsYXBzZSkge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYCR7TkFNRX0uIFRoZSBjb2xsYXBzaWJsZSAke2NvbGxhcHNlRWx9IGlzIGFuIGludmFsaWQgSFRNTEVsZW1lbnQuYClcbiAgICAgIH1cblxuICAgICAgdGhpcy5zZXRDb2xsYXBzZXMoY29sbGFwc2UpXG5cbiAgICAgIHJldHVybiB0cnVlXG4gICAgfVxuXG4gICAgaGlkZShjb2xsYXBzZUVsKSB7XG4gICAgICBsZXQgY29sbGFwc2UgPSBjb2xsYXBzZUVsXG4gICAgICBpZiAodHlwZW9mIGNvbGxhcHNlRWwgPT09ICdzdHJpbmcnKSB7XG4gICAgICAgIGNvbGxhcHNlID0gZG9jdW1lbnQucXVlcnlTZWxlY3Rvcihjb2xsYXBzZUVsKVxuICAgICAgfVxuXG4gICAgICBpZiAoIWNvbGxhcHNlKSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcihgJHtOQU1FfS4gVGhlIGNvbGxhcHNpYmxlICR7Y29sbGFwc2VFbH0gaXMgYW4gaW52YWxpZCBIVE1MRWxlbWVudC5gKVxuICAgICAgfVxuXG4gICAgICBjb25zdCBjb2xsYXBzZU9iaiA9IHRoaXMuZ2V0Q29sbGFwc2UoY29sbGFwc2UpXG4gICAgICByZXR1cm4gY29sbGFwc2VPYmouaGlkZSgpXG4gICAgfVxuXG4gICAgc3RhdGljIGlkZW50aWZpZXIoKSB7XG4gICAgICByZXR1cm4gTkFNRVxuICAgIH1cblxuICAgIHN0YXRpYyBfRE9NSW50ZXJmYWNlKG9wdGlvbnMpIHtcbiAgICAgIHJldHVybiBzdXBlci5fRE9NSW50ZXJmYWNlKEFjY29yZGlvbiwgb3B0aW9ucylcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAqIERPTSBBcGkgaW1wbGVtZW50YXRpb25cbiAgICogLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAqL1xuICBjb25zdCBjb21wb25lbnRzID0gW11cblxuICBjb25zdCBhY2NvcmRpb25zID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChgLiR7TkFNRX1gKVxuICBpZiAoYWNjb3JkaW9ucykge1xuICAgIEFycmF5LmZyb20oYWNjb3JkaW9ucykuZm9yRWFjaCgoZWxlbWVudCkgPT4ge1xuICAgICAgY29uc3QgY29uZmlnID0gZ2V0QXR0cmlidXRlc0NvbmZpZyhlbGVtZW50LCBERUZBVUxUX1BST1BFUlRJRVMsIERBVEFfQVRUUlNfUFJPUEVSVElFUylcbiAgICAgIGNvbmZpZy5lbGVtZW50ID0gZWxlbWVudFxuXG4gICAgICBjb21wb25lbnRzLnB1c2goQWNjb3JkaW9uLl9ET01JbnRlcmZhY2UoY29uZmlnKSlcbiAgICB9KVxuICB9XG5cbiAgaWYgKGFjY29yZGlvbnMpIHtcbiAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIChldmVudCkgPT4ge1xuICAgICAgY29uc3QgZGF0YVRvZ2dsZUF0dHIgPSBldmVudC50YXJnZXQuZ2V0QXR0cmlidXRlKCdkYXRhLXRvZ2dsZScpXG4gICAgICBpZiAoZGF0YVRvZ2dsZUF0dHIgJiYgZGF0YVRvZ2dsZUF0dHIgPT09IE5BTUUpIHtcbiAgICAgICAgY29uc3QgY29sbGFwc2VJZCA9IGV2ZW50LnRhcmdldC5nZXRBdHRyaWJ1dGUoJ2RhdGEtdGFyZ2V0JykgfHwgZXZlbnQudGFyZ2V0LmdldEF0dHJpYnV0ZSgnaHJlZicpXG4gICAgICAgIGNvbnN0IGNvbGxhcHNlRWwgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKGNvbGxhcHNlSWQpXG5cbiAgICAgICAgY29uc3QgYWNjb3JkaW9uID0gZmluZFRhcmdldEJ5Q2xhc3MoZXZlbnQudGFyZ2V0LCAnYWNjb3JkaW9uJylcblxuICAgICAgICBpZiAoYWNjb3JkaW9uID09PSBudWxsKSB7XG4gICAgICAgICAgcmV0dXJuXG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCBhY2NvcmRpb25JZCA9IGFjY29yZGlvbi5nZXRBdHRyaWJ1dGUoJ2lkJylcbiAgICAgICAgY29uc3QgY29tcG9uZW50ID0gY29tcG9uZW50cy5maW5kKGMgPT4gYy5nZXRFbGVtZW50KCkuZ2V0QXR0cmlidXRlKCdpZCcpID09PSBhY2NvcmRpb25JZClcblxuICAgICAgICBpZiAoIWNvbXBvbmVudCkge1xuICAgICAgICAgIHJldHVyblxuICAgICAgICB9XG5cbiAgICAgICAgLy8gaWYgdGhlIGNvbGxhcHNlIGhhcyBiZWVuIGFkZGVkIHByb2dyYW1tYXRpY2FsbHksIHdlIGFkZCBpdFxuICAgICAgICBjb25zdCB0YXJnZXRDb2xsYXBzZSA9IGNvbXBvbmVudC5nZXRDb2xsYXBzZXMoKS5maW5kKGMgPT4gYy5nZXRFbGVtZW50KCkgPT09IGNvbGxhcHNlRWwpXG4gICAgICAgIGlmICghdGFyZ2V0Q29sbGFwc2UpIHtcbiAgICAgICAgICBjb21wb25lbnQuYWRkQ29sbGFwc2UoY29sbGFwc2VFbClcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbXBvbmVudC5zaG93KGNvbGxhcHNlSWQpXG4gICAgICB9XG4gICAgfSlcbiAgfVxuXG4gIHJldHVybiBBY2NvcmRpb25cbn0pKClcblxuZXhwb3J0IGRlZmF1bHQgQWNjb3JkaW9uXG4iLCIvKipcbiAqIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gKiBMaWNlbnNlZCB1bmRlciBNSVQgKGh0dHBzOi8vZ2l0aHViLmNvbS9xdWFyay1kZXYvUGhvbm9uLUZyYW1ld29yay9ibG9iL21hc3Rlci9MSUNFTlNFKVxuICogLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAqL1xuaW1wb3J0IENvbXBvbmVudCBmcm9tICcuLi9jb21wb25lbnQnXG5pbXBvcnQgeyBnZXRBdHRyaWJ1dGVzQ29uZmlnIH0gZnJvbSAnLi4vY29tcG9uZW50TWFuYWdlcidcbmltcG9ydCBFdmVudCBmcm9tICcuLi8uLi9jb21tb24vZXZlbnRzJ1xuaW1wb3J0IHsgZmluZFRhcmdldEJ5QXR0ciB9IGZyb20gJy4uLy4uL2NvbW1vbi91dGlscydcblxuY29uc3QgQ29sbGFwc2UgPSAoKCkgPT4ge1xuICAvKipcbiAgICogLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAqIENvbnN0YW50c1xuICAgKiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICovXG5cbiAgY29uc3QgTkFNRSA9ICdjb2xsYXBzZSdcbiAgY29uc3QgVkVSU0lPTiA9ICcyLjAuMCdcbiAgY29uc3QgREVGQVVMVF9QUk9QRVJUSUVTID0ge1xuICAgIGVsZW1lbnQ6IG51bGwsXG4gICAgdG9nZ2xlOiBmYWxzZSxcbiAgfVxuICBjb25zdCBEQVRBX0FUVFJTX1BST1BFUlRJRVMgPSBbXG4gICAgJ3RvZ2dsZScsXG4gIF1cblxuICAvKipcbiAgICogLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAqIENsYXNzIERlZmluaXRpb25cbiAgICogLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAqL1xuXG4gIGNsYXNzIENvbGxhcHNlIGV4dGVuZHMgQ29tcG9uZW50IHtcblxuICAgIGNvbnN0cnVjdG9yKG9wdGlvbnMgPSB7fSkge1xuICAgICAgc3VwZXIoTkFNRSwgVkVSU0lPTiwgREVGQVVMVF9QUk9QRVJUSUVTLCBvcHRpb25zLCBEQVRBX0FUVFJTX1BST1BFUlRJRVMsIGZhbHNlLCBmYWxzZSlcblxuICAgICAgdGhpcy5vblRyYW5zaXRpb24gPSBmYWxzZVxuXG4gICAgICAvLyB0b2dnbGUgZGlyZWN0bHlcbiAgICAgIGlmICh0aGlzLm9wdGlvbnMudG9nZ2xlKSB7XG4gICAgICAgIHRoaXMuc2hvdygpXG4gICAgICB9XG4gICAgfVxuXG4gICAgZ2V0SGVpZ2h0KCkge1xuICAgICAgcmV0dXJuIHRoaXMub3B0aW9ucy5lbGVtZW50LmdldEJvdW5kaW5nQ2xpZW50UmVjdCh0aGlzLm9wdGlvbnMuZWxlbWVudCkuaGVpZ2h0XG4gICAgfVxuXG4gICAgdG9nZ2xlKCkge1xuICAgICAgaWYgKHRoaXMub3B0aW9ucy5lbGVtZW50LmNsYXNzTGlzdC5jb250YWlucygnc2hvdycpKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmhpZGUoKVxuICAgICAgfVxuXG4gICAgICByZXR1cm4gdGhpcy5zaG93KClcbiAgICB9XG5cbiAgICBzaG93KCkge1xuICAgICAgaWYgKHRoaXMub25UcmFuc2l0aW9uKSB7XG4gICAgICAgIHJldHVybiBmYWxzZVxuICAgICAgfVxuXG4gICAgICBpZiAodGhpcy5vcHRpb25zLmVsZW1lbnQuY2xhc3NMaXN0LmNvbnRhaW5zKCdzaG93JykpIHtcbiAgICAgICAgcmV0dXJuIGZhbHNlXG4gICAgICB9XG5cbiAgICAgIHRoaXMub25UcmFuc2l0aW9uID0gdHJ1ZVxuXG4gICAgICBjb25zdCBvbkNvbGxhcHNlZCA9ICgpID0+IHtcbiAgICAgICAgdGhpcy5vcHRpb25zLmVsZW1lbnQuY2xhc3NMaXN0LmFkZCgnc2hvdycpXG4gICAgICAgIHRoaXMub3B0aW9ucy5lbGVtZW50LmNsYXNzTGlzdC5yZW1vdmUoJ2NvbGxhcHNpbmcnKVxuICAgICAgICB0aGlzLm9wdGlvbnMuZWxlbWVudC5yZW1vdmVFdmVudExpc3RlbmVyKEV2ZW50LlRSQU5TSVRJT05fRU5ELCBvbkNvbGxhcHNlZClcblxuICAgICAgICB0aGlzLm9wdGlvbnMuZWxlbWVudC5zZXRBdHRyaWJ1dGUoJ2FyaWEtZXhwYW5kZWQnLCB0cnVlKVxuXG4gICAgICAgIHRoaXMub25UcmFuc2l0aW9uID0gZmFsc2VcbiAgICAgIH1cblxuICAgICAgaWYgKCF0aGlzLm9wdGlvbnMuZWxlbWVudC5jbGFzc0xpc3QuY29udGFpbnMoJ2NvbGxhcHNpbmcnKSkge1xuICAgICAgICB0aGlzLm9wdGlvbnMuZWxlbWVudC5jbGFzc0xpc3QuYWRkKCdjb2xsYXBzaW5nJylcbiAgICAgIH1cblxuICAgICAgdGhpcy5vcHRpb25zLmVsZW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihFdmVudC5UUkFOU0lUSU9OX0VORCwgb25Db2xsYXBzZWQpXG5cbiAgICAgIGNvbnN0IGhlaWdodCA9IHRoaXMuZ2V0SGVpZ2h0KClcblxuICAgICAgdGhpcy5vcHRpb25zLmVsZW1lbnQuc3R5bGUuaGVpZ2h0ID0gJzBweCdcblxuICAgICAgc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICAgIHRoaXMub3B0aW9ucy5lbGVtZW50LnN0eWxlLmhlaWdodCA9IGAke2hlaWdodH1weGBcbiAgICAgIH0sIDIwKVxuXG4gICAgICByZXR1cm4gdHJ1ZVxuICAgIH1cblxuICAgIGhpZGUoKSB7XG4gICAgICBpZiAodGhpcy5vblRyYW5zaXRpb24pIHtcbiAgICAgICAgcmV0dXJuIGZhbHNlXG4gICAgICB9XG5cbiAgICAgIGlmICghdGhpcy5vcHRpb25zLmVsZW1lbnQuY2xhc3NMaXN0LmNvbnRhaW5zKCdzaG93JykpIHtcbiAgICAgICAgcmV0dXJuIGZhbHNlXG4gICAgICB9XG5cbiAgICAgIHRoaXMub25UcmFuc2l0aW9uID0gdHJ1ZVxuXG4gICAgICBjb25zdCBvbkNvbGxhcHNlZCA9ICgpID0+IHtcbiAgICAgICAgdGhpcy5vcHRpb25zLmVsZW1lbnQuY2xhc3NMaXN0LnJlbW92ZSgnY29sbGFwc2luZycpXG4gICAgICAgIHRoaXMub3B0aW9ucy5lbGVtZW50LnN0eWxlLmhlaWdodCA9ICdhdXRvJ1xuICAgICAgICB0aGlzLm9wdGlvbnMuZWxlbWVudC5yZW1vdmVFdmVudExpc3RlbmVyKEV2ZW50LlRSQU5TSVRJT05fRU5ELCBvbkNvbGxhcHNlZClcblxuICAgICAgICB0aGlzLm9wdGlvbnMuZWxlbWVudC5zZXRBdHRyaWJ1dGUoJ2FyaWEtZXhwYW5kZWQnLCBmYWxzZSlcblxuICAgICAgICB0aGlzLm9uVHJhbnNpdGlvbiA9IGZhbHNlXG4gICAgICB9XG5cbiAgICAgIHRoaXMub3B0aW9ucy5lbGVtZW50LnN0eWxlLmhlaWdodCA9ICcwcHgnXG5cbiAgICAgIGlmICghdGhpcy5vcHRpb25zLmVsZW1lbnQuY2xhc3NMaXN0LmNvbnRhaW5zKCdjb2xsYXBzaW5nJykpIHtcbiAgICAgICAgdGhpcy5vcHRpb25zLmVsZW1lbnQuY2xhc3NMaXN0LmFkZCgnY29sbGFwc2luZycpXG4gICAgICB9XG5cbiAgICAgIHRoaXMub3B0aW9ucy5lbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIoRXZlbnQuVFJBTlNJVElPTl9FTkQsIG9uQ29sbGFwc2VkKVxuXG4gICAgICB0aGlzLm9wdGlvbnMuZWxlbWVudC5jbGFzc0xpc3QucmVtb3ZlKCdzaG93JylcblxuICAgICAgcmV0dXJuIHRydWVcbiAgICB9XG5cbiAgICBzdGF0aWMgaWRlbnRpZmllcigpIHtcbiAgICAgIHJldHVybiBOQU1FXG4gICAgfVxuXG4gICAgc3RhdGljIF9ET01JbnRlcmZhY2Uob3B0aW9ucykge1xuICAgICAgcmV0dXJuIHN1cGVyLl9ET01JbnRlcmZhY2UoQ29sbGFwc2UsIG9wdGlvbnMpXG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgKiBET00gQXBpIGltcGxlbWVudGF0aW9uXG4gICAqIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgKi9cbiAgY29uc3QgY29tcG9uZW50cyA9IFtdXG5cbiAgY29uc3QgY29sbGFwc2VzID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChgLiR7TkFNRX1gKVxuICBpZiAoY29sbGFwc2VzKSB7XG4gICAgY29sbGFwc2VzLmZvckVhY2goKGVsZW1lbnQpID0+IHtcbiAgICAgIC8vIGNvbnN0IGNvbmZpZyA9IHt9XG4gICAgICBjb25zdCBjb25maWcgPSBnZXRBdHRyaWJ1dGVzQ29uZmlnKGVsZW1lbnQsIERFRkFVTFRfUFJPUEVSVElFUywgREFUQV9BVFRSU19QUk9QRVJUSUVTKVxuICAgICAgY29uZmlnLmVsZW1lbnQgPSBlbGVtZW50XG5cbiAgICAgIGNvbXBvbmVudHMucHVzaChDb2xsYXBzZS5fRE9NSW50ZXJmYWNlKGNvbmZpZykpXG4gICAgfSlcbiAgfVxuXG4gIGlmIChjb2xsYXBzZXMpIHtcbiAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIChldmVudCkgPT4ge1xuICAgICAgY29uc3QgdGFyZ2V0ID0gZmluZFRhcmdldEJ5QXR0cihldmVudC50YXJnZXQsICdkYXRhLXRvZ2dsZScpXG4gICAgICBpZiAoIXRhcmdldCkge1xuICAgICAgICByZXR1cm5cbiAgICAgIH1cblxuICAgICAgY29uc3QgZGF0YVRvZ2dsZUF0dHIgPSB0YXJnZXQuZ2V0QXR0cmlidXRlKCdkYXRhLXRvZ2dsZScpXG5cbiAgICAgIGlmIChkYXRhVG9nZ2xlQXR0ciAmJiBkYXRhVG9nZ2xlQXR0ciA9PT0gTkFNRSkge1xuICAgICAgICBsZXQgaWQgPSB0YXJnZXQuZ2V0QXR0cmlidXRlKCdkYXRhLXRhcmdldCcpIHx8IHRhcmdldC5nZXRBdHRyaWJ1dGUoJ2hyZWYnKVxuICAgICAgICBpZCA9IGlkLnJlcGxhY2UoJyMnLCAnJylcblxuICAgICAgICBjb25zdCBjb21wb25lbnQgPSBjb21wb25lbnRzLmZpbmQoYyA9PiBjLmdldEVsZW1lbnQoKS5nZXRBdHRyaWJ1dGUoJ2lkJykgPT09IGlkKVxuXG4gICAgICAgIGlmICghY29tcG9uZW50KSB7XG4gICAgICAgICAgcmV0dXJuXG4gICAgICAgIH1cblxuICAgICAgICBjb21wb25lbnQudG9nZ2xlKClcbiAgICAgIH1cbiAgICB9KVxuICB9XG5cbiAgcmV0dXJuIENvbGxhcHNlXG59KSgpXG5cbmV4cG9ydCBkZWZhdWx0IENvbGxhcHNlXG4iLCIvKipcbiAqIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gKiBMaWNlbnNlZCB1bmRlciBNSVQgKGh0dHBzOi8vZ2l0aHViLmNvbS9xdWFyay1kZXYvUGhvbm9uLUZyYW1ld29yay9ibG9iL21hc3Rlci9MSUNFTlNFKVxuICogLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAqL1xuaW1wb3J0IHsgZGlzcGF0Y2hFbGVtZW50RXZlbnQsIGRpc3BhdGNoV2luRG9jRXZlbnQgfSBmcm9tICcuLi9jb21tb24vZXZlbnRzL2Rpc3BhdGNoJ1xuaW1wb3J0IHsgZ2VuZXJhdGVJZCB9IGZyb20gJy4uL2NvbW1vbi91dGlscydcbmltcG9ydCBFdmVudCBmcm9tICcuLi9jb21tb24vZXZlbnRzJ1xuaW1wb3J0IENvbXBvbmVudE1hbmFnZXIsIHsgc2V0QXR0cmlidXRlc0NvbmZpZywgZ2V0QXR0cmlidXRlc0NvbmZpZyB9IGZyb20gJy4vY29tcG9uZW50TWFuYWdlcidcblxuLyoqXG4gKiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAqIENsYXNzIERlZmluaXRpb25cbiAqIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICovXG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIENvbXBvbmVudCB7XG5cbiAgY29uc3RydWN0b3IobmFtZSwgdmVyc2lvbiwgZGVmYXVsdE9wdGlvbnMgPSB7fSwgb3B0aW9ucyA9IHt9LCBvcHRpb25BdHRycyA9IFtdLCBzdXBwb3J0RHluYW1pY0VsZW1lbnQgPSBmYWxzZSwgYWRkVG9TdGFjayA9IGZhbHNlKSB7XG4gICAgdGhpcy5uYW1lID0gbmFtZVxuICAgIHRoaXMudmVyc2lvbiA9IHZlcnNpb25cbiAgICB0aGlzLm9wdGlvbnMgPSBvcHRpb25zXG5cbiAgICAvLyBAdG9kbyBrZWVwP1xuICAgIC8vIHRoaXMub3B0aW9ucyA9IE9iamVjdC5hc3NpZ24oZGVmYXVsdE9wdGlvbnMsIG9wdGlvbnMpXG4gICAgT2JqZWN0LmtleXMoZGVmYXVsdE9wdGlvbnMpLmZvckVhY2goKHByb3ApID0+IHtcbiAgICAgIGlmICh0eXBlb2YgdGhpcy5vcHRpb25zW3Byb3BdID09PSAndW5kZWZpbmVkJykge1xuICAgICAgICB0aGlzLm9wdGlvbnNbcHJvcF0gPSBkZWZhdWx0T3B0aW9uc1twcm9wXVxuICAgICAgfVxuICAgIH0pXG5cbiAgICB0aGlzLm9wdGlvbkF0dHJzID0gb3B0aW9uQXR0cnNcbiAgICB0aGlzLnN1cHBvcnREeW5hbWljRWxlbWVudCA9IHN1cHBvcnREeW5hbWljRWxlbWVudFxuICAgIHRoaXMuYWRkVG9TdGFjayA9IGFkZFRvU3RhY2tcbiAgICB0aGlzLmlkID0gZ2VuZXJhdGVJZCgpXG5cbiAgICBjb25zdCBjaGVja0VsZW1lbnQgPSAhdGhpcy5zdXBwb3J0RHluYW1pY0VsZW1lbnQgfHwgdGhpcy5vcHRpb25zLmVsZW1lbnQgIT09IG51bGxcblxuICAgIGlmICh0eXBlb2YgdGhpcy5vcHRpb25zLmVsZW1lbnQgPT09ICdzdHJpbmcnKSB7XG4gICAgICB0aGlzLm9wdGlvbnMuZWxlbWVudCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IodGhpcy5vcHRpb25zLmVsZW1lbnQpXG4gICAgfVxuXG4gICAgaWYgKGNoZWNrRWxlbWVudCAmJiAhdGhpcy5vcHRpb25zLmVsZW1lbnQpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihgJHt0aGlzLm5hbWV9LiBUaGUgZWxlbWVudCBpcyBub3QgYSBIVE1MRWxlbWVudC5gKVxuICAgIH1cblxuICAgIHRoaXMuZHluYW1pY0VsZW1lbnQgPSB0aGlzLm9wdGlvbnMuZWxlbWVudCA9PT0gbnVsbFxuICAgIHRoaXMucmVnaXN0ZXJlZEVsZW1lbnRzID0gW11cblxuICAgIGlmICghdGhpcy5keW5hbWljRWxlbWVudCkge1xuICAgICAgLyoqXG4gICAgICAgKiBpZiB0aGUgZWxlbWVudCBleGlzdHMsIHdlIHJlYWQgdGhlIGRhdGEgYXR0cmlidXRlcyBjb25maWdcbiAgICAgICAqIHRoZW4gd2Ugb3ZlcndyaXRlIGV4aXN0aW5nIGNvbmZpZyBrZXlzIGluIEphdmFTY3JpcHQsIHNvIHRoYXRcbiAgICAgICAqIHdlIGtlZXAgdGhlIGZvbGxvd2luZyBvcmRlclxuICAgICAgICogWzFdIGRlZmF1bHQgSmF2YVNjcmlwdCBjb25maWd1cmF0aW9uIG9mIHRoZSBjb21wb25lbnRcbiAgICAgICAqIFsyXSBEYXRhIGF0dHJpYnV0ZXMgY29uZmlndXJhdGlvbiBpZiB0aGUgZWxlbWVudCBleGlzdHMgaW4gdGhlIERPTVxuICAgICAgICogWzNdIEphdmFTY3JpcHQgY29uZmlndXJhdGlvblxuICAgICAgICovXG4gICAgICB0aGlzLm9wdGlvbnMgPSBPYmplY3QuYXNzaWduKHRoaXMub3B0aW9ucywgdGhpcy5hc3NpZ25Kc0NvbmZpZyh0aGlzLmdldEF0dHJpYnV0ZXMoKSwgb3B0aW9ucykpXG5cbiAgICAgIC8vIHRoZW4sIHNldCB0aGUgbmV3IGRhdGEgYXR0cmlidXRlcyB0byB0aGUgZWxlbWVudFxuICAgICAgdGhpcy5zZXRBdHRyaWJ1dGVzKClcbiAgICB9XG5cbiAgICB0aGlzLmVsZW1lbnRMaXN0ZW5lciA9IGV2ZW50ID0+IHRoaXMub25CZWZvcmVFbGVtZW50RXZlbnQoZXZlbnQpICAgICAgICAgIFxuICB9XG5cbiAgYXNzaWduSnNDb25maWcoYXR0ckNvbmZpZywgb3B0aW9ucykge1xuICAgIHRoaXMub3B0aW9uQXR0cnMuZm9yRWFjaCgoa2V5KSA9PiB7XG4gICAgICBpZiAob3B0aW9uc1trZXldKSB7XG4gICAgICAgIGF0dHJDb25maWdba2V5XSA9IG9wdGlvbnNba2V5XVxuICAgICAgfVxuICAgIH0pXG5cbiAgICByZXR1cm4gYXR0ckNvbmZpZ1xuICB9XG5cbiAgZ2V0VmVyc2lvbigpIHtcbiAgICByZXR1cm4gdGhpcy52ZXJzaW9uXG4gIH1cblxuICBnZXRFbGVtZW50KCkge1xuICAgIHJldHVybiB0aGlzLm9wdGlvbnMuZWxlbWVudFxuICB9XG5cbiAgZ2V0SWQoKSB7XG4gICAgcmV0dXJuIHRoaXMuaWRcbiAgfVxuXG4gIHJlZ2lzdGVyRWxlbWVudHMoZWxlbWVudHMpIHtcbiAgICBlbGVtZW50cy5mb3JFYWNoKGVsZW1lbnQgPT4gdGhpcy5yZWdpc3RlckVsZW1lbnQoZWxlbWVudCkpXG4gIH1cblxuICByZWdpc3RlckVsZW1lbnQoZWxlbWVudCkge1xuICAgIGVsZW1lbnQudGFyZ2V0LmFkZEV2ZW50TGlzdGVuZXIoZWxlbWVudC5ldmVudCwgdGhpcy5lbGVtZW50TGlzdGVuZXIpXG4gICAgdGhpcy5yZWdpc3RlcmVkRWxlbWVudHMucHVzaChlbGVtZW50KVxuICB9XG5cbiAgdW5yZWdpc3RlckVsZW1lbnRzKCkge1xuICAgIHRoaXMucmVnaXN0ZXJlZEVsZW1lbnRzLmZvckVhY2goKGVsZW1lbnQpID0+IHtcbiAgICAgIHRoaXMudW5yZWdpc3RlckVsZW1lbnQoZWxlbWVudClcbiAgICB9KVxuICB9XG5cbiAgdW5yZWdpc3RlckVsZW1lbnQoZWxlbWVudCkge1xuICAgIGNvbnN0IHJlZ2lzdGVyZWRFbGVtZW50SW5kZXggPSB0aGlzLnJlZ2lzdGVyZWRFbGVtZW50c1xuICAgICAgLmZpbmRJbmRleChlbCA9PiBlbC50YXJnZXQgPT09IGVsZW1lbnQudGFyZ2V0ICYmIGVsLmV2ZW50ID09PSBlbGVtZW50LmV2ZW50KVxuXG4gICAgaWYgKHJlZ2lzdGVyZWRFbGVtZW50SW5kZXggPiAtMSkge1xuICAgICAgZWxlbWVudC50YXJnZXQucmVtb3ZlRXZlbnRMaXN0ZW5lcihlbGVtZW50LmV2ZW50LCB0aGlzLmVsZW1lbnRMaXN0ZW5lcilcbiAgICAgIHRoaXMucmVnaXN0ZXJlZEVsZW1lbnRzLnNwbGljZShyZWdpc3RlcmVkRWxlbWVudEluZGV4LCAxKVxuICAgIH0gZWxzZSB7XG4gICAgICBjb25zb2xlLmVycm9yKGBXYXJuaW5nISBVbmtub3duIHJlZ2lzdGVyZWQgZWxlbWVudDogJHtlbGVtZW50LnRhcmdldH0gd2l0aCBldmVudDogJHtlbGVtZW50LmV2ZW50fS5gKVxuICAgIH1cbiAgfVxuXG4gIHRyaWdnZXJFdmVudChldmVudE5hbWUsIGRldGFpbCA9IHt9LCBvYmplY3RFdmVudE9ubHkgPSBmYWxzZSkge1xuICAgIGlmICh0eXBlb2YgZXZlbnROYW1lICE9PSAnc3RyaW5nJykge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdUaGUgZXZlbnQgbmFtZSBpcyBub3QgdmFsaWQuJylcbiAgICB9XG5cbiAgICBpZiAodGhpcy5hZGRUb1N0YWNrKSB7XG4gICAgICBpZiAoZXZlbnROYW1lID09PSBFdmVudC5TSE9XKSB7XG4gICAgICAgIENvbXBvbmVudE1hbmFnZXIuYWRkKHRoaXMpXG4gICAgICB9IGVsc2UgaWYgKGV2ZW50TmFtZSA9PT0gRXZlbnQuSElERSkge1xuICAgICAgICBDb21wb25lbnRNYW5hZ2VyLnJlbW92ZSh0aGlzKVxuICAgICAgfVxuICAgIH1cblxuICAgIC8vIGV2ZW50IG5hbWVzIGNhbiBiZSB3aXRoIGRvdCBub3RhdGlvbiBsaWtlIHJlY29ubmVjdGluZy5zdWNjZXNzXG4gICAgY29uc3QgZXZlbnROYW1lT2JqZWN0ID0gZXZlbnROYW1lLnNwbGl0KCcuJykucmVkdWNlKChhY2MsIGN1cnJlbnQsIGluZGV4KSA9PiB7XG4gICAgICBpZiAoaW5kZXggPT09IDApIHtcbiAgICAgICAgcmV0dXJuIGN1cnJlbnRcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIGFjYyArIGN1cnJlbnQuY2hhckF0KDApLnRvVXBwZXJDYXNlKCkgKyBjdXJyZW50LnNsaWNlKDEpXG4gICAgfSlcblxuICAgIGNvbnN0IGV2ZW50TmFtZUFsaWFzID0gYG9uJHtldmVudE5hbWVPYmplY3QuY2hhckF0KDApLnRvVXBwZXJDYXNlKCl9JHtldmVudE5hbWVPYmplY3Quc2xpY2UoMSl9YFxuXG4gICAgLy8gb2JqZWN0IGV2ZW50XG4gICAgaWYgKHR5cGVvZiB0aGlzLm9wdGlvbnNbZXZlbnROYW1lT2JqZWN0XSA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgdGhpcy5vcHRpb25zW2V2ZW50TmFtZU9iamVjdF0uYXBwbHkodGhpcywgW2RldGFpbF0pXG4gICAgfVxuXG4gICAgaWYgKHR5cGVvZiB0aGlzLm9wdGlvbnNbZXZlbnROYW1lQWxpYXNdID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICB0aGlzLm9wdGlvbnNbZXZlbnROYW1lQWxpYXNdLmFwcGx5KHRoaXMsIFtkZXRhaWxdKVxuICAgIH1cblxuICAgIGlmIChvYmplY3RFdmVudE9ubHkpIHtcbiAgICAgIHJldHVyblxuICAgIH1cblxuICAgIC8vIGRvbSBldmVudFxuICAgIGlmICh0aGlzLm9wdGlvbnMuZWxlbWVudCkge1xuICAgICAgZGlzcGF0Y2hFbGVtZW50RXZlbnQodGhpcy5vcHRpb25zLmVsZW1lbnQsIGV2ZW50TmFtZSwgdGhpcy5uYW1lLCBkZXRhaWwpXG4gICAgfSBlbHNlIHtcbiAgICAgIGRpc3BhdGNoV2luRG9jRXZlbnQoZXZlbnROYW1lLCB0aGlzLm5hbWUsIGRldGFpbClcbiAgICB9XG4gIH1cblxuICBzZXRBdHRyaWJ1dGVzKCkge1xuICAgIGlmICh0aGlzLm9wdGlvbkF0dHJzLmxlbmd0aCA+IDApIHtcbiAgICAgIHNldEF0dHJpYnV0ZXNDb25maWcodGhpcy5vcHRpb25zLmVsZW1lbnQsIHRoaXMub3B0aW9ucywgdGhpcy5vcHRpb25BdHRycylcbiAgICB9XG4gIH1cblxuICBnZXRBdHRyaWJ1dGVzKCkge1xuICAgIGNvbnN0IG9wdGlvbnMgPSBPYmplY3QuYXNzaWduKHt9LCB0aGlzLm9wdGlvbnMpXG4gICAgcmV0dXJuIGdldEF0dHJpYnV0ZXNDb25maWcodGhpcy5vcHRpb25zLmVsZW1lbnQsIG9wdGlvbnMsIHRoaXMub3B0aW9uQXR0cnMpXG4gIH1cblxuICAvKipcbiAgICogdGhlIHByZXZlbnRDbG9zYWJsZSBtZXRob2QgbWFuYWdlcyBjb25jdXJyZW5jeSBiZXR3ZWVuIGFjdGl2ZSBjb21wb25lbnRzLlxuICAgKiBGb3IgZXhhbXBsZSwgaWYgdGhlcmUgaXMgYSBzaG93biBvZmYtY2FudmFzIGFuZCBkaWFsb2csIHRoZSBsYXN0XG4gICAqIHNob3duIGNvbXBvbmVudCBnYWlucyB0aGUgcHJvY2Vzc2luZyBwcmlvcml0eVxuICAgKi9cbiAgcHJldmVudENsb3NhYmxlKCkge1xuICAgIHJldHVybiB0aGlzLmFkZFRvU3RhY2sgJiYgIUNvbXBvbmVudE1hbmFnZXIuY2xvc2FibGUodGhpcylcbiAgfVxuXG4gIG9uQmVmb3JlRWxlbWVudEV2ZW50KGV2ZW50KSB7XG4gICAgaWYgKHRoaXMucHJldmVudENsb3NhYmxlKCkpIHtcbiAgICAgIHJldHVyblxuICAgIH1cblxuICAgIHRoaXMub25FbGVtZW50RXZlbnQoZXZlbnQpXG4gIH1cblxuICBvbkVsZW1lbnRFdmVudChldmVudCkge1xuICAgIC8vXG4gIH1cblxuICBzdGF0aWMgaWRlbnRpZmllcigpIHtcbiAgICByZXR1cm4gdGhpcy5uYW1lXG4gIH1cblxuICBzdGF0aWMgX0RPTUludGVyZmFjZShDb21wb25lbnRDbGFzcywgb3B0aW9ucykge1xuICAgIHJldHVybiBuZXcgQ29tcG9uZW50Q2xhc3Mob3B0aW9ucylcbiAgfVxufVxuIiwiXG5jb25zdCBnZXRBdHRyaWJ1dGUgPSAoZmlyc3QsIHNlY29uZCkgPT4ge1xuICBpZiAoZmlyc3QgPT09ICcnKSB7XG4gICAgcmV0dXJuIGBkYXRhLSR7c2Vjb25kfWBcbiAgfVxuICByZXR1cm4gYGRhdGEtJHtmaXJzdH0tJHtzZWNvbmR9YFxufVxuXG5leHBvcnQgZnVuY3Rpb24gc2V0QXR0cmlidXRlc0NvbmZpZyhlbGVtZW50LCBvYmogPSB7fSwgYXR0cnMsIHN0YXJ0ID0gJycpIHtcbiAgY29uc3Qga2V5cyA9IE9iamVjdC5rZXlzKG9iailcblxuICBrZXlzLmZvckVhY2goKGtleSkgPT4ge1xuICAgIGlmIChzdGFydCA9PT0gJycgJiYgYXR0cnMuaW5kZXhPZihrZXkpID09PSAtMSkge1xuICAgICAgLy8gY29udGludWUgd2l0aCBuZXh0IGl0ZXJhdGlvblxuICAgICAgcmV0dXJuXG4gICAgfVxuXG4gICAgaWYgKHR5cGVvZiBvYmpba2V5XSA9PT0gJ29iamVjdCcgJiYgb2JqW2tleV0gIT09IG51bGwpIHtcbiAgICAgIGxldCBrZXlTdGFydCA9IGtleVxuICAgICAgaWYgKHN0YXJ0ICE9PSAnJykge1xuICAgICAgICBrZXlTdGFydCA9IGAke3N0YXJ0fS0ke2tleX1gXG4gICAgICB9XG5cbiAgICAgIHNldEF0dHJpYnV0ZXNDb25maWcoZWxlbWVudCwgb2JqW2tleV0sIGF0dHJzLCBrZXlTdGFydClcbiAgICAgIHJldHVyblxuICAgIH1cblxuICAgIGNvbnN0IGF0dHIgPSBnZXRBdHRyaWJ1dGUoc3RhcnQsIGtleSlcbiAgICBlbGVtZW50LnNldEF0dHJpYnV0ZShhdHRyLCBvYmpba2V5XSlcbiAgfSlcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGdldEF0dHJpYnV0ZXNDb25maWcoZWxlbWVudCwgb2JqID0ge30sIGF0dHJzLCBzdGFydCA9ICcnKSB7XG4gIGNvbnN0IG5ld09iaiA9IE9iamVjdC5hc3NpZ24oe30sIG9iailcbiAgY29uc3Qga2V5cyA9IE9iamVjdC5rZXlzKG9iailcblxuICBrZXlzLmZvckVhY2goKGtleSkgPT4ge1xuICAgIGlmIChzdGFydCA9PT0gJycgJiYgYXR0cnMuaW5kZXhPZihrZXkpID09PSAtMSkge1xuICAgICAgLy8gY29udGludWUgd2l0aCBuZXh0IGl0ZXJhdGlvblxuICAgICAgcmV0dXJuXG4gICAgfVxuXG4gICAgaWYgKG9ialtrZXldICE9PSBudWxsICYmIG9ialtrZXldLmNvbnN0cnVjdG9yID09PSBPYmplY3QpIHtcbiAgICAgIGxldCBrZXlTdGFydCA9IGtleVxuICAgICAgaWYgKHN0YXJ0ICE9PSAnJykge1xuICAgICAgICBrZXlTdGFydCA9IGAke3N0YXJ0fS0ke2tleX1gXG4gICAgICB9XG5cbiAgICAgIG5ld09ialtrZXldID0gZ2V0QXR0cmlidXRlc0NvbmZpZyhlbGVtZW50LCBvYmpba2V5XSwgYXR0cnMsIGtleVN0YXJ0KVxuICAgICAgcmV0dXJuXG4gICAgfVxuXG4gICAgLy8gdXBkYXRlIHZhbHVlXG4gICAgbGV0IHZhbHVlID0gb2JqW2tleV0gLy8gZGVmYXVsdCB2YWx1ZVxuICAgIGNvbnN0IHR5cGUgPSB0eXBlb2YgdmFsdWVcbiAgICBjb25zdCBhdHRyID0gZ2V0QXR0cmlidXRlKHN0YXJ0LCBrZXkpXG4gICAgY29uc3QgYXR0clZhbHVlID0gZWxlbWVudC5nZXRBdHRyaWJ1dGUoYXR0cilcblxuICAgIGlmIChhdHRyVmFsdWUgIT09IG51bGwpIHtcbiAgICAgIGlmICh0eXBlID09PSAnYm9vbGVhbicpIHtcbiAgICAgICAgLy8gY29udmVydCBzdHJpbmcgdG8gYm9vbGVhblxuICAgICAgICB2YWx1ZSA9IGF0dHJWYWx1ZSA9PT0gJ3RydWUnXG4gICAgICB9IGVsc2UgaWYgKCFpc05hTihhdHRyVmFsdWUpKSB7XG4gICAgICAgIHZhbHVlID0gcGFyc2VJbnQoYXR0clZhbHVlLCAxMClcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHZhbHVlID0gYXR0clZhbHVlXG4gICAgICB9XG4gICAgfVxuXG4gICAgbmV3T2JqW2tleV0gPSB2YWx1ZVxuICB9KVxuXG4gIHJldHVybiBuZXdPYmpcbn1cblxuY29uc3Qgc3RhY2sgPSBbXVxuXG5leHBvcnQgZGVmYXVsdCB7XG4gIGFkZChjb21wb25lbnQpIHtcbiAgICBzdGFjay5wdXNoKGNvbXBvbmVudClcbiAgfSxcbiAgcmVtb3ZlKGNvbXBvbmVudCkge1xuICAgIGNvbnN0IGluZGV4ID0gc3RhY2suZmluZEluZGV4KGMgPT4gT2JqZWN0LmlzKGNvbXBvbmVudCwgYykpXG4gICAgaWYgKGluZGV4ID4gLTEpIHtcbiAgICAgIHN0YWNrLnNwbGljZShpbmRleCwgMSlcbiAgICB9XG4gIH0sXG4gIGNsb3NhYmxlKGNvbXBvbmVudCkge1xuICAgIHJldHVybiBzdGFjay5sZW5ndGggPT09IDAgfHwgT2JqZWN0LmlzKHN0YWNrW3N0YWNrLmxlbmd0aCAtIDFdLCBjb21wb25lbnQpXG4gIH1cbn1cbiIsIi8qKlxuICogLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAqIExpY2Vuc2VkIHVuZGVyIE1JVCAoaHR0cHM6Ly9naXRodWIuY29tL3F1YXJrLWRldi9QaG9ub24tRnJhbWV3b3JrL2Jsb2IvbWFzdGVyL0xJQ0VOU0UpXG4gKiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICovXG5pbXBvcnQgRXZlbnQgZnJvbSAnLi4vLi4vY29tbW9uL2V2ZW50cydcbmltcG9ydCBDb21wb25lbnQgZnJvbSAnLi4vY29tcG9uZW50J1xuaW1wb3J0IHsgZ2V0QXR0cmlidXRlc0NvbmZpZyB9IGZyb20gJy4uL2NvbXBvbmVudE1hbmFnZXInXG5cbmNvbnN0IERpYWxvZyA9ICgoKSA9PiB7XG4gIC8qKlxuICAgKiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICogQ29uc3RhbnRzXG4gICAqIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgKi9cblxuICBjb25zdCBOQU1FID0gJ2RpYWxvZydcbiAgY29uc3QgVkVSU0lPTiA9ICcyLjAuMCdcbiAgY29uc3QgQkFDS0RST1BfU0VMRUNUT1IgPSAnZGlhbG9nLWJhY2tkcm9wJ1xuICBjb25zdCBERUZBVUxUX1BST1BFUlRJRVMgPSB7XG4gICAgZWxlbWVudDogbnVsbCxcbiAgICB0aXRsZTogbnVsbCxcbiAgICBtZXNzYWdlOiBudWxsLFxuICAgIGNhbmNlbGFibGU6IHRydWUsXG4gIH1cbiAgY29uc3QgREFUQV9BVFRSU19QUk9QRVJUSUVTID0gW1xuICAgICdjYW5jZWxhYmxlJyxcbiAgXVxuXG4gIC8qKlxuICAgKiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICogQ2xhc3MgRGVmaW5pdGlvblxuICAgKiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICovXG5cbiAgY2xhc3MgRGlhbG9nIGV4dGVuZHMgQ29tcG9uZW50IHtcblxuICAgIGNvbnN0cnVjdG9yKG9wdGlvbnMgPSB7fSwgdGVtcGxhdGUgPSBudWxsKSB7XG4gICAgICBzdXBlcihOQU1FLCBWRVJTSU9OLCBERUZBVUxUX1BST1BFUlRJRVMsIG9wdGlvbnMsIERBVEFfQVRUUlNfUFJPUEVSVElFUywgdHJ1ZSwgdHJ1ZSlcblxuICAgICAgdGhpcy50ZW1wbGF0ZSA9IHRlbXBsYXRlIHx8ICcnICtcbiAgICAgICc8ZGl2IGNsYXNzPVwiZGlhbG9nXCIgdGFiaW5kZXg9XCItMVwiIHJvbGU9XCJkaWFsb2dcIj4nICtcbiAgICAgICAgJzxkaXYgY2xhc3M9XCJkaWFsb2ctaW5uZXJcIiByb2xlPVwiZG9jdW1lbnRcIj4nICtcbiAgICAgICAgICAnPGRpdiBjbGFzcz1cImRpYWxvZy1jb250ZW50XCI+JyArXG4gICAgICAgICAgICAnPGRpdiBjbGFzcz1cImRpYWxvZy1oZWFkZXJcIj4nICtcbiAgICAgICAgICAgICAgJzxoNSBjbGFzcz1cImRpYWxvZy10aXRsZVwiPjwvaDU+JyArXG4gICAgICAgICAgICAnPC9kaXY+JyArXG4gICAgICAgICAgICAnPGRpdiBjbGFzcz1cImRpYWxvZy1ib2R5XCI+JyArXG4gICAgICAgICAgICAgICc8cD48L3A+JyArXG4gICAgICAgICAgICAnPC9kaXY+JyArXG4gICAgICAgICAgICAnPGRpdiBjbGFzcz1cImRpYWxvZy1mb290ZXJcIj4nICtcbiAgICAgICAgICAgICAgJzxidXR0b24gdHlwZT1cImJ1dHRvblwiIGNsYXNzPVwiYnRuIGJ0bi1wcmltYXJ5XCIgZGF0YS1kaXNtaXNzPVwiZGlhbG9nXCI+T2s8L2J1dHRvbj4nICtcbiAgICAgICAgICAgICc8L2Rpdj4nICtcbiAgICAgICAgICAnPC9kaXY+JyArXG4gICAgICAgICc8L2Rpdj4nICtcbiAgICAgICc8L2Rpdj4nXG5cbiAgICAgIGlmICh0aGlzLmR5bmFtaWNFbGVtZW50KSB7XG4gICAgICAgIHRoaXMuYnVpbGQoKVxuICAgICAgfVxuICAgIH1cblxuICAgIGJ1aWxkKCkge1xuICAgICAgY29uc3QgYnVpbGRlciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpXG5cbiAgICAgIGJ1aWxkZXIuaW5uZXJIVE1MID0gdGhpcy50ZW1wbGF0ZVxuXG4gICAgICB0aGlzLm9wdGlvbnMuZWxlbWVudCA9IGJ1aWxkZXIuZmlyc3RDaGlsZFxuXG4gICAgICAvLyB0aXRsZVxuICAgICAgaWYgKHRoaXMub3B0aW9ucy50aXRsZSAhPT0gbnVsbCkge1xuICAgICAgICB0aGlzLm9wdGlvbnMuZWxlbWVudC5xdWVyeVNlbGVjdG9yKCcuZGlhbG9nLXRpdGxlJykuaW5uZXJIVE1MID0gdGhpcy5vcHRpb25zLnRpdGxlXG4gICAgICB9XG5cbiAgICAgIC8vIG1lc3NhZ2VcbiAgICAgIGlmICh0aGlzLm9wdGlvbnMubWVzc2FnZSAhPT0gbnVsbCkge1xuICAgICAgICB0aGlzLm9wdGlvbnMuZWxlbWVudC5xdWVyeVNlbGVjdG9yKCcuZGlhbG9nLWJvZHknKS5maXJzdENoaWxkLmlubmVySFRNTCA9IHRoaXMub3B0aW9ucy5tZXNzYWdlXG4gICAgICB9XG5cbiAgICAgIGRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQodGhpcy5vcHRpb25zLmVsZW1lbnQpXG5cbiAgICAgIHRoaXMuc2V0QXR0cmlidXRlcygpXG4gICAgfVxuXG4gICAgYnVpbGRCYWNrZHJvcCgpIHtcbiAgICAgIGNvbnN0IGJhY2tkcm9wID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2JylcbiAgICAgIGJhY2tkcm9wLnNldEF0dHJpYnV0ZSgnZGF0YS1pZCcsIHRoaXMuaWQpXG4gICAgICBiYWNrZHJvcC5jbGFzc0xpc3QuYWRkKEJBQ0tEUk9QX1NFTEVDVE9SKVxuXG4gICAgICBkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKGJhY2tkcm9wKVxuICAgIH1cblxuICAgIGdldEJhY2tkcm9wKCkge1xuICAgICAgcmV0dXJuIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoYC4ke0JBQ0tEUk9QX1NFTEVDVE9SfVtkYXRhLWlkPVwiJHt0aGlzLmlkfVwiXWApXG4gICAgfVxuXG4gICAgY2VudGVyKCkge1xuICAgICAgY29uc3QgY29tcHV0ZWRTdHlsZSA9IHdpbmRvdy5nZXRDb21wdXRlZFN0eWxlKHRoaXMub3B0aW9ucy5lbGVtZW50KVxuICAgICAgLy8gY29uc3Qgd2lkdGggPSBjb21wdXRlZFN0eWxlLndpZHRoLnNsaWNlKDAsIGNvbXB1dGVkU3R5bGUud2lkdGgubGVuZ3RoIC0gMilcbiAgICAgIGNvbnN0IGhlaWdodCA9IGNvbXB1dGVkU3R5bGUuaGVpZ2h0LnNsaWNlKDAsIGNvbXB1dGVkU3R5bGUuaGVpZ2h0Lmxlbmd0aCAtIDIpXG5cbiAgICAgIGNvbnN0IHRvcCA9ICh3aW5kb3cuaW5uZXJIZWlnaHQgLyAyKSAtIChoZWlnaHQgLyAyKVxuICAgICAgdGhpcy5vcHRpb25zLmVsZW1lbnQuc3R5bGUudG9wID0gYCR7dG9wfXB4YFxuICAgIH1cblxuICAgIHNob3coKSB7XG4gICAgICBpZiAodGhpcy5vcHRpb25zLmVsZW1lbnQgPT09IG51bGwpIHtcbiAgICAgICAgLy8gYnVpbGQgYW5kIGluc2VydCBhIG5ldyBET00gZWxlbWVudFxuICAgICAgICB0aGlzLmJ1aWxkKClcbiAgICAgIH1cblxuICAgICAgaWYgKHRoaXMub3B0aW9ucy5lbGVtZW50LmNsYXNzTGlzdC5jb250YWlucygnc2hvdycpKSB7XG4gICAgICAgIHJldHVybiBmYWxzZVxuICAgICAgfVxuXG4gICAgICAvLyBhZGQgYSB0aW1lb3V0IHNvIHRoYXQgdGhlIENTUyBhbmltYXRpb24gd29ya3NcbiAgICAgIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgICB0aGlzLnRyaWdnZXJFdmVudChFdmVudC5TSE9XKVxuICAgICAgICB0aGlzLmJ1aWxkQmFja2Ryb3AoKVxuXG4gICAgICAgIGNvbnN0IG9uU2hvd24gPSAoKSA9PiB7XG4gICAgICAgICAgdGhpcy50cmlnZ2VyRXZlbnQoRXZlbnQuU0hPV04pXG4gICAgICAgICAgdGhpcy5vcHRpb25zLmVsZW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcihFdmVudC5UUkFOU0lUSU9OX0VORCwgb25TaG93bilcblxuICAgICAgICAgIC8vIGF0dGFjaCBldmVudFxuICAgICAgICAgIHRoaXMuYXR0YWNoRXZlbnRzKClcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMub3B0aW9ucy5lbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIoRXZlbnQuVFJBTlNJVElPTl9FTkQsIG9uU2hvd24pXG5cbiAgICAgICAgdGhpcy5vcHRpb25zLmVsZW1lbnQuY2xhc3NMaXN0LmFkZCgnc2hvdycpXG5cbiAgICAgICAgdGhpcy5jZW50ZXIoKVxuICAgICAgfSwgMTApXG5cbiAgICAgIHJldHVybiB0cnVlXG4gICAgfVxuXG4gICAgb25FbGVtZW50RXZlbnQoZXZlbnQpIHtcbiAgICAgIGlmIChldmVudC50eXBlID09PSAna2V5dXAnICYmIGV2ZW50LmtleUNvZGUgIT09IDI3ICYmIGV2ZW50LmtleUNvZGUgIT09IDEzKSB7XG4gICAgICAgIHJldHVyblxuICAgICAgfVxuXG4gICAgICAvLyBoaWRlIHRoZSBkaWFsb2dcbiAgICAgIHRoaXMuaGlkZSgpXG4gICAgfVxuXG4gICAgaGlkZSgpIHtcbiAgICAgIGlmICghdGhpcy5vcHRpb25zLmVsZW1lbnQuY2xhc3NMaXN0LmNvbnRhaW5zKCdzaG93JykpIHtcbiAgICAgICAgcmV0dXJuIGZhbHNlXG4gICAgICB9XG5cbiAgICAgIHRoaXMudHJpZ2dlckV2ZW50KEV2ZW50LkhJREUpXG5cbiAgICAgIHRoaXMuZGV0YWNoRXZlbnRzKClcblxuICAgICAgdGhpcy5vcHRpb25zLmVsZW1lbnQuY2xhc3NMaXN0LmFkZCgnaGlkZScpXG4gICAgICB0aGlzLm9wdGlvbnMuZWxlbWVudC5jbGFzc0xpc3QucmVtb3ZlKCdzaG93JylcblxuICAgICAgY29uc3QgYmFja2Ryb3AgPSB0aGlzLmdldEJhY2tkcm9wKClcblxuICAgICAgY29uc3Qgb25IaWRkZW4gPSAoKSA9PiB7XG4gICAgICAgIGRvY3VtZW50LmJvZHkucmVtb3ZlQ2hpbGQoYmFja2Ryb3ApXG5cbiAgICAgICAgdGhpcy5vcHRpb25zLmVsZW1lbnQuY2xhc3NMaXN0LnJlbW92ZSgnaGlkZScpXG5cbiAgICAgICAgdGhpcy50cmlnZ2VyRXZlbnQoRXZlbnQuSElEREVOKVxuXG4gICAgICAgIGJhY2tkcm9wLnJlbW92ZUV2ZW50TGlzdGVuZXIoRXZlbnQuVFJBTlNJVElPTl9FTkQsIG9uSGlkZGVuKVxuXG4gICAgICAgIC8vIHJlbW92ZSBnZW5lcmF0ZWQgZGlhbG9ncyBmcm9tIHRoZSBET01cbiAgICAgICAgaWYgKHRoaXMuZHluYW1pY0VsZW1lbnQpIHtcbiAgICAgICAgICBkb2N1bWVudC5ib2R5LnJlbW92ZUNoaWxkKHRoaXMub3B0aW9ucy5lbGVtZW50KVxuICAgICAgICAgIHRoaXMub3B0aW9ucy5lbGVtZW50ID0gbnVsbFxuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIGJhY2tkcm9wLmFkZEV2ZW50TGlzdGVuZXIoRXZlbnQuVFJBTlNJVElPTl9FTkQsIG9uSGlkZGVuKVxuICAgICAgYmFja2Ryb3AuY2xhc3NMaXN0LmFkZCgnZmFkZW91dCcpXG5cbiAgICAgIHJldHVybiB0cnVlXG4gICAgfVxuXG4gICAgYXR0YWNoRXZlbnRzKCkge1xuICAgICAgY29uc3QgZGlzbWlzc0J1dHRvbnMgPSB0aGlzLm9wdGlvbnMuZWxlbWVudC5xdWVyeVNlbGVjdG9yQWxsKCdbZGF0YS1kaXNtaXNzXScpXG4gICAgICBpZiAoZGlzbWlzc0J1dHRvbnMpIHtcbiAgICAgICAgQXJyYXkuZnJvbShkaXNtaXNzQnV0dG9ucykuZm9yRWFjaChidXR0b24gPT4gdGhpcy5yZWdpc3RlckVsZW1lbnQoeyB0YXJnZXQ6IGJ1dHRvbiwgZXZlbnQ6ICdjbGljaycgfSkpXG4gICAgICB9XG5cbiAgICAgIC8vIGFkZCBldmVudHMgaWYgdGhlIGRpYWxvZyBpcyBjYW5jZWxhYmxlXG4gICAgICAvLyB3aGljaCBtZWFucyB0aGUgdXNlciBjYW4gaGlkZSB0aGUgZGlhbG9nXG4gICAgICAvLyBieSBwcmVzc2luZyB0aGUgRVNDIGtleSBvciBjbGljayBvdXRzaWRlIHRoZSBiYWNrZHJvcFxuICAgICAgaWYgKHRoaXMub3B0aW9ucy5jYW5jZWxhYmxlKSB7XG4gICAgICAgIGNvbnN0IGJhY2tkcm9wID0gdGhpcy5nZXRCYWNrZHJvcCgpXG4gICAgICAgIHRoaXMucmVnaXN0ZXJFbGVtZW50KHsgdGFyZ2V0OiBiYWNrZHJvcCwgZXZlbnQ6IEV2ZW50LlNUQVJUIH0pXG4gICAgICAgIHRoaXMucmVnaXN0ZXJFbGVtZW50KHsgdGFyZ2V0OiBkb2N1bWVudCwgZXZlbnQ6ICdrZXl1cCcgfSlcbiAgICAgIH1cbiAgICB9XG5cbiAgICBkZXRhY2hFdmVudHMoKSB7XG4gICAgICBjb25zdCBkaXNtaXNzQnV0dG9ucyA9IHRoaXMub3B0aW9ucy5lbGVtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJ1tkYXRhLWRpc21pc3NdJylcbiAgICAgIGlmIChkaXNtaXNzQnV0dG9ucykge1xuICAgICAgICBBcnJheS5mcm9tKGRpc21pc3NCdXR0b25zKS5mb3JFYWNoKGJ1dHRvbiA9PiB0aGlzLnVucmVnaXN0ZXJFbGVtZW50KHsgdGFyZ2V0OiBidXR0b24sIGV2ZW50OiAnY2xpY2snIH0pKVxuICAgICAgfVxuXG4gICAgICBpZiAodGhpcy5vcHRpb25zLmNhbmNlbGFibGUpIHtcbiAgICAgICAgY29uc3QgYmFja2Ryb3AgPSB0aGlzLmdldEJhY2tkcm9wKClcbiAgICAgICAgdGhpcy51bnJlZ2lzdGVyRWxlbWVudCh7IHRhcmdldDogYmFja2Ryb3AsIGV2ZW50OiBFdmVudC5TVEFSVCB9KVxuICAgICAgICB0aGlzLnVucmVnaXN0ZXJFbGVtZW50KHsgdGFyZ2V0OiBkb2N1bWVudCwgZXZlbnQ6ICdrZXl1cCcgfSlcbiAgICAgIH1cbiAgICB9XG5cbiAgICBzdGF0aWMgaWRlbnRpZmllcigpIHtcbiAgICAgIHJldHVybiBOQU1FXG4gICAgfVxuXG4gICAgc3RhdGljIF9ET01JbnRlcmZhY2Uob3B0aW9ucykge1xuICAgICAgcmV0dXJuIHN1cGVyLl9ET01JbnRlcmZhY2UoRGlhbG9nLCBvcHRpb25zKVxuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICogRE9NIEFwaSBpbXBsZW1lbnRhdGlvblxuICAgKiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICovXG4gIGNvbnN0IGNvbXBvbmVudHMgPSBbXVxuXG4gIGNvbnN0IGRpYWxvZ3MgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKGAuJHtOQU1FfWApXG4gIGlmIChkaWFsb2dzKSB7XG4gICAgQXJyYXkuZnJvbShkaWFsb2dzKS5mb3JFYWNoKChlbGVtZW50KSA9PiB7XG4gICAgICBjb25zdCBjb25maWcgPSBnZXRBdHRyaWJ1dGVzQ29uZmlnKGVsZW1lbnQsIERFRkFVTFRfUFJPUEVSVElFUywgREFUQV9BVFRSU19QUk9QRVJUSUVTKVxuICAgICAgY29uZmlnLmVsZW1lbnQgPSBlbGVtZW50XG5cbiAgICAgIGNvbXBvbmVudHMucHVzaCh7IGVsZW1lbnQsIGRpYWxvZzogbmV3IERpYWxvZyhjb25maWcpIH0pXG4gICAgfSlcbiAgfVxuXG4gIGlmIChkaWFsb2dzKSB7XG4gICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoZXZlbnQpID0+IHtcbiAgICAgIGNvbnN0IGRhdGFUb2dnbGVBdHRyID0gZXZlbnQudGFyZ2V0LmdldEF0dHJpYnV0ZSgnZGF0YS10b2dnbGUnKVxuICAgICAgaWYgKGRhdGFUb2dnbGVBdHRyICYmIGRhdGFUb2dnbGVBdHRyID09PSBOQU1FKSB7XG4gICAgICAgIGNvbnN0IGlkID0gZXZlbnQudGFyZ2V0LmdldEF0dHJpYnV0ZSgnZGF0YS10YXJnZXQnKVxuICAgICAgICBjb25zdCBlbGVtZW50ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihpZClcblxuICAgICAgICBjb25zdCBjb21wb25lbnQgPSBjb21wb25lbnRzLmZpbmQoYyA9PiBjLmVsZW1lbnQgPT09IGVsZW1lbnQpXG5cbiAgICAgICAgaWYgKCFjb21wb25lbnQpIHtcbiAgICAgICAgICByZXR1cm5cbiAgICAgICAgfVxuXG4gICAgICAgIC8vIHJlbW92ZSB0aGUgZm9jdXMgc3RhdGUgb2YgdGhlIHRyaWdnZXJcbiAgICAgICAgZXZlbnQudGFyZ2V0LmJsdXIoKVxuXG4gICAgICAgIGNvbXBvbmVudC5kaWFsb2cuc2hvdygpXG4gICAgICB9XG4gICAgfSlcbiAgfVxuXG4gIHJldHVybiBEaWFsb2dcbn0pKClcblxuZXhwb3J0IGRlZmF1bHQgRGlhbG9nXG4iLCIvKipcbiAqIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gKiBMaWNlbnNlZCB1bmRlciBNSVQgKGh0dHBzOi8vZ2l0aHViLmNvbS9xdWFyay1kZXYvUGhvbm9uLUZyYW1ld29yay9ibG9iL21hc3Rlci9MSUNFTlNFKVxuICogLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAqL1xuaW1wb3J0IERpYWxvZyBmcm9tICcuL2luZGV4J1xuaW1wb3J0IHsgZmluZFRhcmdldEJ5Q2xhc3MgfSBmcm9tICcuLi8uLi9jb21tb24vdXRpbHMnXG5pbXBvcnQgeyBnZXRBdHRyaWJ1dGVzQ29uZmlnIH0gZnJvbSAnLi4vY29tcG9uZW50TWFuYWdlcidcblxuY29uc3QgUHJvbXB0ID0gKCgpID0+IHtcblxuICAvKipcbiAgICogLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAqIENvbnN0YW50c1xuICAgKiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICovXG5cbiAgY29uc3QgTkFNRSA9ICdkaWFsb2cnXG4gIGNvbnN0IEJBQ0tEUk9QX1NFTEVDVE9SID0gJ2RpYWxvZy1iYWNrZHJvcCdcbiAgY29uc3QgREVGQVVMVF9QUk9QRVJUSUVTID0ge1xuICAgIGVsZW1lbnQ6IG51bGwsXG4gICAgdGl0bGU6IG51bGwsXG4gICAgbWVzc2FnZTogbnVsbCxcbiAgICBjYW5jZWxhYmxlOiB0cnVlLFxuICB9XG4gIGNvbnN0IERBVEFfQVRUUlNfUFJPUEVSVElFUyA9IFtcbiAgICAnY2FuY2VsYWJsZScsXG4gIF1cblxuICAvKipcbiAgICogLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAqIENsYXNzIERlZmluaXRpb25cbiAgICogLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAqL1xuXG4gIGNsYXNzIFByb21wdCBleHRlbmRzIERpYWxvZyB7XG5cbiAgICBjb25zdHJ1Y3RvcihvcHRpb25zID0ge30pIHtcbiAgICAgIGNvbnN0IHRlbXBsYXRlID0gJycgK1xuICAgICAgJzxkaXYgY2xhc3M9XCJkaWFsb2dcIiB0YWJpbmRleD1cIi0xXCIgcm9sZT1cImRpYWxvZ1wiPicgK1xuICAgICAgICAnPGRpdiBjbGFzcz1cImRpYWxvZy1pbm5lclwiIHJvbGU9XCJkb2N1bWVudFwiPicgK1xuICAgICAgICAgICc8ZGl2IGNsYXNzPVwiZGlhbG9nLWNvbnRlbnRcIj4nICtcbiAgICAgICAgICAgICc8ZGl2IGNsYXNzPVwiZGlhbG9nLWhlYWRlclwiPicgK1xuICAgICAgICAgICAgICAnPGg1IGNsYXNzPVwiZGlhbG9nLXRpdGxlXCI+PC9oNT4nICtcbiAgICAgICAgICAgICc8L2Rpdj4nICtcbiAgICAgICAgICAgICc8ZGl2IGNsYXNzPVwiZGlhbG9nLWJvZHlcIj4nICtcbiAgICAgICAgICAgICAgJzxpbnB1dCBjbGFzcz1cImZvcm0tY29udHJvbFwiIHR5cGU9XCJ0ZXh0XCIgdmFsdWU9XCJcIj4nICtcbiAgICAgICAgICAgICc8L2Rpdj4nICtcbiAgICAgICAgICAgICc8ZGl2IGNsYXNzPVwiZGlhbG9nLWZvb3RlclwiPicgK1xuICAgICAgICAgICAgICAnPGJ1dHRvbiB0eXBlPVwiYnV0dG9uXCIgY2xhc3M9XCJidG4gYnRuLXByaW1hcnlcIiBkYXRhLWRpc21pc3M9XCJkaWFsb2dcIj5PazwvYnV0dG9uPicgK1xuICAgICAgICAgICAgJzwvZGl2PicgK1xuICAgICAgICAgICc8L2Rpdj4nICtcbiAgICAgICAgJzwvZGl2PicgK1xuICAgICAgJzwvZGl2PidcblxuICAgICAgc3VwZXIob3B0aW9ucywgdGVtcGxhdGUpXG4gICAgfVxuXG4gICAgc3RhdGljIF9ET01JbnRlcmZhY2Uob3B0aW9ucykge1xuICAgICAgcmV0dXJuIG5ldyBQcm9tcHQob3B0aW9ucylcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAqIERPTSBBcGkgaW1wbGVtZW50YXRpb25cbiAgICogLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAqL1xuICBjb25zdCBjb21wb25lbnRzID0gW11cbiAgY29uc3QgZGlhbG9ncyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoYC4ke05BTUV9YClcblxuICBpZiAoZGlhbG9ncykge1xuICAgIEFycmF5LmZyb20oZGlhbG9ncykuZm9yRWFjaCgoZWxlbWVudCkgPT4ge1xuICAgICAgY29uc3QgY29uZmlnID0gZ2V0QXR0cmlidXRlc0NvbmZpZyhlbGVtZW50LCBERUZBVUxUX1BST1BFUlRJRVMsIERBVEFfQVRUUlNfUFJPUEVSVElFUylcbiAgICAgIGNvbmZpZy5lbGVtZW50ID0gZWxlbWVudFxuXG4gICAgICBpZiAoY29uZmlnLnR5cGUgPT09ICdhbGVydCcpIHtcbiAgICAgICAgLy8gcHJvbXB0XG4gICAgICAgIGNvbXBvbmVudHMucHVzaChuZXcgUHJvbXB0KGNvbmZpZykpXG4gICAgICB9XG4gICAgfSlcbiAgfVxuXG4gIGlmIChkaWFsb2dzKSB7XG4gICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoZXZlbnQpID0+IHtcbiAgICAgIGNvbnN0IGRyb3Bkb3duTWVudSA9IGZpbmRUYXJnZXRCeUNsYXNzKGV2ZW50LnRhcmdldCwgJ2Ryb3Bkb3duLW1lbnUnKVxuICAgICAgaWYgKGRyb3Bkb3duTWVudSkge1xuICAgICAgICByZXR1cm5cbiAgICAgIH1cblxuICAgICAgY29uc3QgZHJvcGRvd24gPSBmaW5kVGFyZ2V0QnlDbGFzcyhldmVudC50YXJnZXQsICdkcm9wZG93bicpXG5cbiAgICAgIGlmIChkcm9wZG93bikge1xuICAgICAgICBjb25zdCBkYXRhVG9nZ2xlQXR0ciA9IGRyb3Bkb3duLmdldEF0dHJpYnV0ZSgnZGF0YS10b2dnbGUnKVxuICAgICAgICBpZiAoZGF0YVRvZ2dsZUF0dHIgJiYgZGF0YVRvZ2dsZUF0dHIgPT09IE5BTUUgJiYgZHJvcGRvd24pIHtcbiAgICAgICAgICBjb25zdCBjb21wb25lbnQgPSBjb21wb25lbnRzLmZpbmQoYyA9PiBjLmdldEVsZW1lbnQoKSA9PT0gZHJvcGRvd24pXG5cbiAgICAgICAgICBpZiAoIWNvbXBvbmVudCkge1xuICAgICAgICAgICAgcmV0dXJuXG4gICAgICAgICAgfVxuXG4gICAgICAgICAgY29tcG9uZW50LnRvZ2dsZSgpXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9KVxuICB9XG5cbiAgcmV0dXJuIFByb21wdFxufSkoKVxuXG5leHBvcnQgZGVmYXVsdCBQcm9tcHRcbiIsIi8qKlxuICogLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAqIExpY2Vuc2VkIHVuZGVyIE1JVCAoaHR0cHM6Ly9naXRodWIuY29tL3F1YXJrLWRldi9QaG9ub24tRnJhbWV3b3JrL2Jsb2IvbWFzdGVyL0xJQ0VOU0UpXG4gKiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICovXG5pbXBvcnQgQ29tcG9uZW50IGZyb20gJy4uL2NvbXBvbmVudCdcbmltcG9ydCBFdmVudCBmcm9tICcuLi8uLi9jb21tb24vZXZlbnRzJ1xuaW1wb3J0IHsgZmluZFRhcmdldEJ5Q2xhc3MgfSBmcm9tICcuLi8uLi9jb21tb24vdXRpbHMnXG5pbXBvcnQgeyBnZXRBdHRyaWJ1dGVzQ29uZmlnIH0gZnJvbSAnLi4vY29tcG9uZW50TWFuYWdlcidcblxuY29uc3QgRHJvcGRvd24gPSAoKCkgPT4ge1xuICAvKipcbiAgICogLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAqIENvbnN0YW50c1xuICAgKiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICovXG5cbiAgY29uc3QgTkFNRSA9ICdkcm9wZG93bidcbiAgY29uc3QgVkVSU0lPTiA9ICcyLjAuMCdcbiAgY29uc3QgREVGQVVMVF9QUk9QRVJUSUVTID0ge1xuICAgIGVsZW1lbnQ6IG51bGwsXG4gICAgZGVmYXVsdDogdHJ1ZSxcbiAgICBzZWFyY2g6IGZhbHNlLFxuICB9XG4gIGNvbnN0IERBVEFfQVRUUlNfUFJPUEVSVElFUyA9IFtcbiAgICAnZGVmYXVsdCcsXG4gICAgJ3NlYXJjaCcsICAgIFxuICBdXG5cbiAgLyoqXG4gICAqIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgKiBDbGFzcyBEZWZpbml0aW9uXG4gICAqIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgKi9cblxuICBjbGFzcyBEcm9wZG93biBleHRlbmRzIENvbXBvbmVudCB7XG5cbiAgICBjb25zdHJ1Y3RvcihvcHRpb25zID0ge30pIHtcbiAgICAgIHN1cGVyKE5BTUUsIFZFUlNJT04sIERFRkFVTFRfUFJPUEVSVElFUywgb3B0aW9ucywgREFUQV9BVFRSU19QUk9QRVJUSUVTLCBmYWxzZSwgZmFsc2UpXG5cbiAgICAgIGNvbnN0IHNlbGVjdGVkID0gdGhpcy5vcHRpb25zLmVsZW1lbnQucXVlcnlTZWxlY3RvcignW2RhdGEtc2VsZWN0ZWRdJylcbiAgICAgIGNvbnN0IGl0ZW0gPSB0aGlzLmdldEl0ZW1EYXRhKHNlbGVjdGVkKVxuXG4gICAgICB0aGlzLnNldFNlbGVjdGVkKGl0ZW0udmFsdWUsIGl0ZW0udGV4dCwgZmFsc2UpXG4gICAgfVxuXG4gICAgc2V0U2VsZWN0ZWQodmFsdWUgPSAnJywgdGV4dCA9IG51bGwsIGNoZWNrRXhpc3RzID0gdHJ1ZSkge1xuICAgICAgaWYgKCF0aGlzLm9wdGlvbnMuZGVmYXVsdCkge1xuICAgICAgICByZXR1cm4gZmFsc2VcbiAgICAgIH1cblxuICAgICAgbGV0IHRleHREaXNwbGF5ID0gdGV4dFxuICAgICAgdGhpcy5vcHRpb25zLmVsZW1lbnQucXVlcnlTZWxlY3RvcignLmRlZmF1bHQtdGV4dCcpLmlubmVySFRNTCA9IHRleHRcbiAgICAgIHRoaXMub3B0aW9ucy5lbGVtZW50LnF1ZXJ5U2VsZWN0b3IoJ2lucHV0W3R5cGU9XCJoaWRkZW5cIl0nKS52YWx1ZSA9IHZhbHVlXG5cbiAgICAgIGNvbnN0IGl0ZW1zID0gdGhpcy5vcHRpb25zLmVsZW1lbnQucXVlcnlTZWxlY3RvckFsbCgnLml0ZW0nKSB8fCBbXVxuICAgICAgbGV0IGl0ZW1Gb3VuZCA9IGZhbHNlXG5cbiAgICAgIEFycmF5LmZyb20oaXRlbXMpLmZvckVhY2goKGl0ZW0pID0+IHtcbiAgICAgICAgaWYgKGl0ZW0uY2xhc3NMaXN0LmNvbnRhaW5zKCdzZWxlY3RlZCcpKSB7XG4gICAgICAgICAgaXRlbS5jbGFzc0xpc3QucmVtb3ZlKCdzZWxlY3RlZCcpXG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCBkYXRhID0gdGhpcy5nZXRJdGVtRGF0YShpdGVtKVxuXG4gICAgICAgIGlmICh2YWx1ZSA9PT0gZGF0YS52YWx1ZSkge1xuICAgICAgICAgIGlmICghaXRlbS5jbGFzc0xpc3QuY29udGFpbnMoJ3NlbGVjdGVkJykpIHtcbiAgICAgICAgICAgIGl0ZW0uY2xhc3NMaXN0LmFkZCgnc2VsZWN0ZWQnKVxuICAgICAgICAgIH1cblxuICAgICAgICAgIHRleHREaXNwbGF5ID0gZGF0YS50ZXh0XG4gICAgICAgICAgaXRlbUZvdW5kID0gdHJ1ZVxuICAgICAgICB9XG4gICAgICB9KVxuXG4gICAgICBpZiAoY2hlY2tFeGlzdHMgJiYgaXRlbUZvdW5kKSB7XG4gICAgICAgIHRoaXMub3B0aW9ucy5lbGVtZW50LnF1ZXJ5U2VsZWN0b3IoJy5kZWZhdWx0LXRleHQnKS5pbm5lckhUTUwgPSB0ZXh0RGlzcGxheVxuICAgICAgfSBlbHNlIGlmIChjaGVja0V4aXN0cyAmJiAhaXRlbUZvdW5kKSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcihgJHtOQU1FfS4gVGhlIHZhbHVlIFwiJHt2YWx1ZX1cIiBkb2VzIG5vdCBleGlzdCBpbiB0aGUgbGlzdCBvZiBpdGVtcy5gKSAgICAgICAgXG4gICAgICB9XG5cbiAgICAgIHJldHVybiB0cnVlXG4gICAgfVxuXG4gICAgZ2V0U2VsZWN0ZWQoKSB7XG4gICAgICByZXR1cm4gdGhpcy5vcHRpb25zLmVsZW1lbnQucXVlcnlTZWxlY3RvcignaW5wdXRbdHlwZT1cImhpZGRlblwiXScpLnZhbHVlXG4gICAgfVxuXG4gICAgZ2V0SXRlbURhdGEoaXRlbSA9IG51bGwpIHtcbiAgICAgIGxldCB0ZXh0ID0gJydcbiAgICAgIGxldCB2YWx1ZSA9ICcnXG5cbiAgICAgIGlmIChpdGVtKSB7XG4gICAgICAgIHRleHQgPSBpdGVtLmdldEF0dHJpYnV0ZSgnZGF0YS10ZXh0JykgfHwgaXRlbS5pbm5lckhUTUxcblxuICAgICAgICBjb25zdCBzZWxlY3RlZFRleHROb2RlID0gaXRlbS5xdWVyeVNlbGVjdG9yKCcudGV4dCcpXG4gICAgICAgIGlmIChzZWxlY3RlZFRleHROb2RlKSB7XG4gICAgICAgICAgdGV4dCA9IHNlbGVjdGVkVGV4dE5vZGUuaW5uZXJIVE1MXG4gICAgICAgIH1cblxuICAgICAgICB2YWx1ZSA9IGl0ZW0uZ2V0QXR0cmlidXRlKCdkYXRhLXZhbHVlJykgfHwgJydcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIHsgdGV4dCwgdmFsdWUgfVxuICAgIH1cblxuICAgIG9uRWxlbWVudEV2ZW50KGV2ZW50KSB7XG4gICAgICBpZiAoZXZlbnQudHlwZSA9PT0gRXZlbnQuU1RBUlQpIHtcbiAgICAgICAgY29uc3QgZHJvcGRvd24gPSBmaW5kVGFyZ2V0QnlDbGFzcyhldmVudC50YXJnZXQsICdkcm9wZG93bicpXG5cbiAgICAgICAgLypcbiAgICAgICAgICogaGlkZSB0aGUgY3VycmVudCBkcm9wZG93biBvbmx5IGlmIHRoZSBldmVudCBjb25jZXJucyBhbm90aGVyIGRyb3Bkb3duXG4gICAgICAgICAqIGhpZGUgYWxzbyBpZiB0aGUgdXNlciBjbGlja3Mgb3V0c2lkZSBhIGRyb3Bkb3duXG4gICAgICAgICAqL1xuICAgICAgICBpZiAoIWRyb3Bkb3duIHx8IGRyb3Bkb3duICE9PSB0aGlzLmdldEVsZW1lbnQoKSkge1xuICAgICAgICAgIHRoaXMuaGlkZSgpXG4gICAgICAgIH1cblxuICAgICAgfSBlbHNlIGlmIChldmVudC50eXBlID09PSAnY2xpY2snKSB7XG4gICAgICAgIGNvbnN0IGl0ZW0gPSBmaW5kVGFyZ2V0QnlDbGFzcyhldmVudC50YXJnZXQsICdpdGVtJylcblxuICAgICAgICBpZiAoaXRlbSkge1xuICAgICAgICAgIGlmIChpdGVtLmNsYXNzTGlzdC5jb250YWlucygnZGlzYWJsZWQnKSkge1xuICAgICAgICAgICAgcmV0dXJuXG4gICAgICAgICAgfVxuXG4gICAgICAgICAgY29uc3QgaXRlbUluZm8gPSB0aGlzLmdldEl0ZW1EYXRhKGl0ZW0pXG5cbiAgICAgICAgICBpZiAodGhpcy5nZXRTZWxlY3RlZCgpICE9PSBpdGVtSW5mby52YWx1ZSkge1xuICAgICAgICAgICAgLy8gdGhlIHVzZXIgc2VsZWN0ZWQgYW5vdGhlciB2YWx1ZSwgd2UgZGlzcGF0Y2ggdGhlIGV2ZW50XG4gICAgICAgICAgICB0aGlzLnNldFNlbGVjdGVkKGl0ZW1JbmZvLnZhbHVlLCBpdGVtSW5mby50ZXh0LCBmYWxzZSlcbiAgICAgICAgICAgIGNvbnN0IGRldGFpbCA9IHsgaXRlbSwgdGV4dDogaXRlbUluZm8udGV4dCwgdmFsdWU6IGl0ZW1JbmZvLnZhbHVlIH1cbiAgICAgICAgICAgIHRoaXMudHJpZ2dlckV2ZW50KEV2ZW50LklURU1fU0VMRUNURUQsIGRldGFpbClcbiAgICAgICAgICB9XG5cbiAgICAgICAgICB0aGlzLmhpZGUoKVxuICAgICAgICAgIHJldHVyblxuICAgICAgICB9XG5cbiAgICAgICAgLy8gZG9uJ3QgdG9nZ2xlIHRoZSBkcm9wZG93biBpZiB0aGUgZXZlbnQgY29uY2VybnMgaGVhZGVycywgZGl2aWRlcnNcbiAgICAgICAgY29uc3QgZHJvcGRvd25NZW51ID0gZmluZFRhcmdldEJ5Q2xhc3MoZXZlbnQudGFyZ2V0LCAnZHJvcGRvd24tbWVudScpXG4gICAgICAgIGlmIChkcm9wZG93bk1lbnUpIHtcbiAgICAgICAgICByZXR1cm5cbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMudG9nZ2xlKClcbiAgICAgIH1cbiAgICB9XG5cbiAgICB0b2dnbGUoKSB7XG4gICAgICBpZiAodGhpcy5vcHRpb25zLmVsZW1lbnQuY2xhc3NMaXN0LmNvbnRhaW5zKCdhY3RpdmUnKSkge1xuICAgICAgICByZXR1cm4gdGhpcy5oaWRlKClcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIHRoaXMuc2hvdygpXG4gICAgfVxuXG4gICAgc2hvdygpIHtcbiAgICAgIGlmICh0aGlzLm9wdGlvbnMuZWxlbWVudC5jbGFzc0xpc3QuY29udGFpbnMoJ2FjdGl2ZScpKSB7XG4gICAgICAgIHJldHVybiBmYWxzZVxuICAgICAgfVxuXG4gICAgICB0aGlzLm9wdGlvbnMuZWxlbWVudC5jbGFzc0xpc3QuYWRkKCdhY3RpdmUnKVxuXG4gICAgICBjb25zdCBkcm9wZG93bk1lbnUgPSB0aGlzLm9wdGlvbnMuZWxlbWVudC5xdWVyeVNlbGVjdG9yKCcuZHJvcGRvd24tbWVudScpXG5cbiAgICAgIC8vIHNjcm9sbCB0byB0b3BcbiAgICAgIGRyb3Bkb3duTWVudS5zY3JvbGxUb3AgPSAwXG5cbiAgICAgIHRoaXMudHJpZ2dlckV2ZW50KEV2ZW50LlNIT1cpXG4gICAgICB0aGlzLnRyaWdnZXJFdmVudChFdmVudC5TSE9XTilcblxuICAgICAgdGhpcy5yZWdpc3RlckVsZW1lbnQoeyB0YXJnZXQ6IGRyb3Bkb3duTWVudSwgZXZlbnQ6ICdjbGljaycgfSkgICAgICBcbiAgICAgIHRoaXMucmVnaXN0ZXJFbGVtZW50KHsgdGFyZ2V0OiBkb2N1bWVudC5ib2R5LCBldmVudDogRXZlbnQuU1RBUlQgfSlcblxuICAgICAgcmV0dXJuIHRydWVcbiAgICB9XG5cbiAgICBoaWRlKCkge1xuICAgICAgaWYgKCF0aGlzLm9wdGlvbnMuZWxlbWVudC5jbGFzc0xpc3QuY29udGFpbnMoJ2FjdGl2ZScpKSB7XG4gICAgICAgIHJldHVybiBmYWxzZVxuICAgICAgfVxuXG4gICAgICB0aGlzLm9wdGlvbnMuZWxlbWVudC5jbGFzc0xpc3QucmVtb3ZlKCdhY3RpdmUnKVxuXG4gICAgICB0aGlzLnRyaWdnZXJFdmVudChFdmVudC5ISURFKVxuICAgICAgdGhpcy50cmlnZ2VyRXZlbnQoRXZlbnQuSElEREVOKVxuXG4gICAgICB0aGlzLnVucmVnaXN0ZXJFbGVtZW50KHsgdGFyZ2V0OiB0aGlzLm9wdGlvbnMuZWxlbWVudC5xdWVyeVNlbGVjdG9yKCcuZHJvcGRvd24tbWVudScpLCBldmVudDogJ2NsaWNrJyB9KSAgICAgIFxuICAgICAgdGhpcy51bnJlZ2lzdGVyRWxlbWVudCh7IHRhcmdldDogZG9jdW1lbnQuYm9keSwgZXZlbnQ6IEV2ZW50LlNUQVJUIH0pXG5cbiAgICAgIHJldHVybiB0cnVlXG4gICAgfVxuXG4gICAgc3RhdGljIGlkZW50aWZpZXIoKSB7XG4gICAgICByZXR1cm4gTkFNRVxuICAgIH1cblxuICAgIHN0YXRpYyBfRE9NSW50ZXJmYWNlKG9wdGlvbnMpIHtcbiAgICAgIHJldHVybiBzdXBlci5fRE9NSW50ZXJmYWNlKERyb3Bkb3duLCBvcHRpb25zKVxuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICogRE9NIEFwaSBpbXBsZW1lbnRhdGlvblxuICAgKiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICovXG4gIGNvbnN0IGNvbXBvbmVudHMgPSBbXVxuXG4gIGNvbnN0IGRyb3Bkb3ducyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoYC4ke05BTUV9YClcbiAgaWYgKGRyb3Bkb3ducykge1xuICAgIEFycmF5LmZyb20oZHJvcGRvd25zKS5mb3JFYWNoKChlbGVtZW50KSA9PiB7XG4gICAgICBjb25zdCBjb25maWcgPSBnZXRBdHRyaWJ1dGVzQ29uZmlnKGVsZW1lbnQsIERFRkFVTFRfUFJPUEVSVElFUywgREFUQV9BVFRSU19QUk9QRVJUSUVTKVxuICAgICAgY29uZmlnLmVsZW1lbnQgPSBlbGVtZW50XG5cbiAgICAgIGlmICghY29uZmlnLnNlYXJjaCkge1xuICAgICAgICBjb21wb25lbnRzLnB1c2gobmV3IERyb3Bkb3duKGNvbmZpZykpXG4gICAgICB9XG4gICAgfSlcbiAgfVxuXG4gIGlmIChkcm9wZG93bnMpIHtcbiAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIChldmVudCkgPT4ge1xuICAgICAgY29uc3QgZHJvcGRvd25NZW51ID0gZmluZFRhcmdldEJ5Q2xhc3MoZXZlbnQudGFyZ2V0LCAnZHJvcGRvd24tbWVudScpXG4gICAgICBpZiAoZHJvcGRvd25NZW51KSB7XG4gICAgICAgIHJldHVyblxuICAgICAgfVxuXG4gICAgICBjb25zdCBkcm9wZG93biA9IGZpbmRUYXJnZXRCeUNsYXNzKGV2ZW50LnRhcmdldCwgJ2Ryb3Bkb3duJylcblxuICAgICAgaWYgKGRyb3Bkb3duKSB7XG4gICAgICAgIGNvbnN0IGRhdGFUb2dnbGVBdHRyID0gZHJvcGRvd24uZ2V0QXR0cmlidXRlKCdkYXRhLXRvZ2dsZScpXG4gICAgICAgIGlmIChkYXRhVG9nZ2xlQXR0ciAmJiBkYXRhVG9nZ2xlQXR0ciA9PT0gTkFNRSAmJiBkcm9wZG93bikge1xuICAgICAgICAgIGNvbnN0IGNvbXBvbmVudCA9IGNvbXBvbmVudHMuZmluZChjID0+IGMuZ2V0RWxlbWVudCgpID09PSBkcm9wZG93bilcblxuICAgICAgICAgIGlmICghY29tcG9uZW50KSB7XG4gICAgICAgICAgICByZXR1cm5cbiAgICAgICAgICB9XG5cbiAgICAgICAgICBjb21wb25lbnQudG9nZ2xlKClcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0pXG4gIH1cblxuICByZXR1cm4gRHJvcGRvd25cbn0pKClcblxuZXhwb3J0IGRlZmF1bHQgRHJvcGRvd25cbiIsIi8qKlxuICogLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAqIExpY2Vuc2VkIHVuZGVyIE1JVCAoaHR0cHM6Ly9naXRodWIuY29tL3F1YXJrLWRldi9QaG9ub24tRnJhbWV3b3JrL2Jsb2IvbWFzdGVyL0xJQ0VOU0UpXG4gKiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICovXG5pbXBvcnQgRHJvcGRvd24gZnJvbSAnLi9pbmRleCdcbmltcG9ydCB7IGZpbmRUYXJnZXRCeUNsYXNzIH0gZnJvbSAnLi4vLi4vY29tbW9uL3V0aWxzJ1xuaW1wb3J0IHsgZ2V0QXR0cmlidXRlc0NvbmZpZyB9IGZyb20gJy4uL2NvbXBvbmVudE1hbmFnZXInXG5cbmNvbnN0IERyb3Bkb3duU2VhcmNoID0gKCgpID0+IHtcblxuICAvKipcbiAgICogLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAqIENvbnN0YW50c1xuICAgKiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICovXG5cbiAgY29uc3QgTkFNRSA9IERyb3Bkb3duLmlkZW50aWZpZXIoKVxuICBjb25zdCBERUZBVUxUX1BST1BFUlRJRVMgPSB7XG4gICAgZWxlbWVudDogbnVsbCxcbiAgICBkZWZhdWx0OiB0cnVlLFxuICAgIHNlYXJjaDogdHJ1ZSxcbiAgfVxuICBjb25zdCBEQVRBX0FUVFJTX1BST1BFUlRJRVMgPSBbXG4gICAgJ2RlZmF1bHQnLFxuICAgICdzZWFyY2gnLFxuICBdXG5cbiAgLyoqXG4gICAqIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgKiBDbGFzcyBEZWZpbml0aW9uXG4gICAqIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgKi9cblxuICBjbGFzcyBEcm9wZG93blNlYXJjaCBleHRlbmRzIERyb3Bkb3duIHtcblxuICAgIGNvbnN0cnVjdG9yKG9wdGlvbnMgPSB7fSkge1xuICAgICAgc3VwZXIob3B0aW9ucylcblxuICAgICAgdGhpcy5maWx0ZXJJdGVtc0hhbmRsZXIgPSAoZXZlbnQpID0+IHtcbiAgICAgICAgY29uc3Qgc2VhcmNoID0gZXZlbnQudGFyZ2V0LnZhbHVlXG5cbiAgICAgICAgaWYgKHNlYXJjaCA9PT0gJycpIHtcbiAgICAgICAgICB0aGlzLnNob3dJdGVtcygpXG4gICAgICAgICAgcmV0dXJuXG4gICAgICAgIH1cblxuXG4gICAgICAgIHRoaXMuZ2V0SXRlbXMoKS5mb3JFYWNoKChpdGVtKSA9PiB7XG4gICAgICAgICAgY29uc3QgZm4gPSB0eXBlb2YgdGhpcy5vcHRpb25zLmZpbHRlckl0ZW0gPT09ICdmdW5jdGlvbicgPyB0aGlzLm9wdGlvbnMuZmlsdGVySXRlbSA6IHRoaXMuZmlsdGVySXRlbVxuXG4gICAgICAgICAgaWYgKGZuKHNlYXJjaCwgaXRlbSkpIHtcbiAgICAgICAgICAgIGl0ZW0uZWxlbWVudC5zdHlsZS5kaXNwbGF5ID0gJ2Jsb2NrJ1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBpdGVtLmVsZW1lbnQuc3R5bGUuZGlzcGxheSA9ICdub25lJ1xuICAgICAgICAgIH1cbiAgICAgICAgfSlcbiAgICAgIH1cblxuICAgICAgdGhpcy5nZXRTZWFyY2hJbnB1dCgpLmFkZEV2ZW50TGlzdGVuZXIoJ2tleXVwJywgdGhpcy5maWx0ZXJJdGVtc0hhbmRsZXIpXG4gICAgfVxuXG4gICAgZmlsdGVySXRlbShzZWFyY2ggPSAnJywgaXRlbSA9IHt9KSB7XG4gICAgICBpZiAoaXRlbS52YWx1ZS5pbmRleE9mKHNlYXJjaCkgPiAtMVxuICAgICAgICB8fCBpdGVtLnRleHQuaW5kZXhPZihzZWFyY2gpID4gLTEpIHtcbiAgICAgICAgcmV0dXJuIHRydWVcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIGZhbHNlXG4gICAgfVxuXG4gICAgZ2V0SXRlbXMoKSB7XG4gICAgICBsZXQgaXRlbXMgPSBBcnJheS5mcm9tKHRoaXMub3B0aW9ucy5lbGVtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJy5pdGVtJykgfHwgW10pXG4gICAgICBpdGVtcyA9IGl0ZW1zLm1hcCgoaXRlbSkgPT4ge1xuICAgICAgICBjb25zdCBpbmZvID0gdGhpcy5nZXRJdGVtRGF0YShpdGVtKVxuICAgICAgICByZXR1cm4geyB0ZXh0OiBpbmZvLnRleHQsIHZhbHVlOiBpbmZvLnZhbHVlLCBlbGVtZW50OiBpdGVtIH1cbiAgICAgIH0pXG5cbiAgICAgIHJldHVybiBpdGVtc1xuICAgIH1cblxuICAgIHNob3dJdGVtcygpIHtcbiAgICAgIHRoaXMuZ2V0SXRlbXMoKS5mb3JFYWNoKChpdGVtKSA9PiB7XG4gICAgICAgIGl0ZW0uZWxlbWVudC5zdHlsZS5kaXNwbGF5ID0gJ2Jsb2NrJ1xuICAgICAgfSlcbiAgICB9XG5cbiAgICBnZXRTZWFyY2hJbnB1dCgpIHtcbiAgICAgIHJldHVybiB0aGlzLm9wdGlvbnMuZWxlbWVudC5xdWVyeVNlbGVjdG9yKCcuZHJvcGRvd24tbWVudSBpbnB1dCcpXG4gICAgfVxuXG4gICAgaGlkZSgpIHtcbiAgICAgIGlmIChzdXBlci5oaWRlKCkpIHtcbiAgICAgICAgLy8gcmVzZXQgdGhlIHZhbHVlXG4gICAgICAgIHRoaXMuZ2V0U2VhcmNoSW5wdXQoKS52YWx1ZSA9ICcnXG4gICAgICAgIC8vIHNob3cgYWxsIGl0ZW1zXG4gICAgICAgIHRoaXMuc2hvd0l0ZW1zKClcbiAgICAgIH1cbiAgICB9XG5cbiAgICBzdGF0aWMgX0RPTUludGVyZmFjZShvcHRpb25zKSB7XG4gICAgICByZXR1cm4gbmV3IERyb3Bkb3duU2VhcmNoKG9wdGlvbnMpXG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgKiBET00gQXBpIGltcGxlbWVudGF0aW9uXG4gICAqIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgKi9cbiAgY29uc3QgY29tcG9uZW50cyA9IFtdXG4gIGNvbnN0IGRyb3Bkb3ducyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoYC4ke05BTUV9YClcblxuICBpZiAoZHJvcGRvd25zKSB7XG4gICAgQXJyYXkuZnJvbShkcm9wZG93bnMpLmZvckVhY2goKGVsZW1lbnQpID0+IHtcbiAgICAgIGNvbnN0IGNvbmZpZyA9IGdldEF0dHJpYnV0ZXNDb25maWcoZWxlbWVudCwgREVGQVVMVF9QUk9QRVJUSUVTLCBEQVRBX0FUVFJTX1BST1BFUlRJRVMpXG4gICAgICBjb25maWcuZWxlbWVudCA9IGVsZW1lbnRcblxuICAgICAgaWYgKGNvbmZpZy5zZWFyY2gpIHtcbiAgICAgICAgLy8gc2VhcmNoXG4gICAgICAgIGNvbXBvbmVudHMucHVzaChuZXcgRHJvcGRvd25TZWFyY2goY29uZmlnKSlcbiAgICAgIH1cbiAgICB9KVxuICB9XG5cbiAgaWYgKGRyb3Bkb3ducykge1xuICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKGV2ZW50KSA9PiB7XG4gICAgICBjb25zdCBkcm9wZG93bk1lbnUgPSBmaW5kVGFyZ2V0QnlDbGFzcyhldmVudC50YXJnZXQsICdkcm9wZG93bi1tZW51JylcbiAgICAgIGlmIChkcm9wZG93bk1lbnUpIHtcbiAgICAgICAgcmV0dXJuXG4gICAgICB9XG5cbiAgICAgIGNvbnN0IGRyb3Bkb3duID0gZmluZFRhcmdldEJ5Q2xhc3MoZXZlbnQudGFyZ2V0LCAnZHJvcGRvd24nKVxuXG4gICAgICBpZiAoZHJvcGRvd24pIHtcbiAgICAgICAgY29uc3QgZGF0YVRvZ2dsZUF0dHIgPSBkcm9wZG93bi5nZXRBdHRyaWJ1dGUoJ2RhdGEtdG9nZ2xlJylcbiAgICAgICAgaWYgKGRhdGFUb2dnbGVBdHRyICYmIGRhdGFUb2dnbGVBdHRyID09PSBOQU1FICYmIGRyb3Bkb3duKSB7XG4gICAgICAgICAgY29uc3QgY29tcG9uZW50ID0gY29tcG9uZW50cy5maW5kKGMgPT4gYy5nZXRFbGVtZW50KCkgPT09IGRyb3Bkb3duKVxuXG4gICAgICAgICAgaWYgKCFjb21wb25lbnQpIHtcbiAgICAgICAgICAgIHJldHVyblxuICAgICAgICAgIH1cblxuICAgICAgICAgIGNvbXBvbmVudC50b2dnbGUoKVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfSlcbiAgfVxuXG4gIHJldHVybiBEcm9wZG93blNlYXJjaFxufSkoKVxuXG5leHBvcnQgZGVmYXVsdCBEcm9wZG93blNlYXJjaFxuIiwiLyoqXG4gKiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICogTGljZW5zZWQgdW5kZXIgTUlUIChodHRwczovL2dpdGh1Yi5jb20vcXVhcmstZGV2L1Bob25vbi1GcmFtZXdvcmsvYmxvYi9tYXN0ZXIvTElDRU5TRSlcbiAqIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gKi9cbmltcG9ydCBDb21wb25lbnQgZnJvbSAnLi4vY29tcG9uZW50J1xuXG5jb25zdCBMb2FkZXIgPSAoKCkgPT4ge1xuICAvKipcbiAgICogLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAqIENvbnN0YW50c1xuICAgKiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICovXG5cbiAgY29uc3QgTkFNRSA9ICdsb2FkZXInXG4gIGNvbnN0IFZFUlNJT04gPSAnMi4wLjAnXG4gIGNvbnN0IERFRkFVTFRfUFJPUEVSVElFUyA9IHtcbiAgICBlbGVtZW50OiBudWxsLFxuICAgIGNvbG9yOiBudWxsLFxuICAgIHNpemU6IG51bGwsXG4gIH1cbiAgY29uc3QgREFUQV9BVFRSU19QUk9QRVJUSUVTID0gW11cblxuICAvKipcbiAgICogLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAqIENsYXNzIERlZmluaXRpb25cbiAgICogLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAqL1xuXG4gIGNsYXNzIExvYWRlciBleHRlbmRzIENvbXBvbmVudCB7XG5cbiAgICBjb25zdHJ1Y3RvcihvcHRpb25zID0ge30pIHtcbiAgICAgIHN1cGVyKE5BTUUsIFZFUlNJT04sIERFRkFVTFRfUFJPUEVSVElFUywgb3B0aW9ucywgREFUQV9BVFRSU19QUk9QRVJUSUVTLCBmYWxzZSwgZmFsc2UpXG5cbiAgICAgIC8vIHNldCBjb2xvclxuICAgICAgY29uc3QgbG9hZGVyU3Bpbm5lciA9IHRoaXMuZ2V0U3Bpbm5lcigpXG4gICAgICBpZiAodHlwZW9mIHRoaXMub3B0aW9ucy5jb2xvciA9PT0gJ3N0cmluZydcbiAgICAgICAgJiYgIWxvYWRlclNwaW5uZXIuY2xhc3NMaXN0LmNvbnRhaW5zKGBjb2xvci0ke3RoaXMub3B0aW9ucy5jb2xvcn1gKSkge1xuICAgICAgICBsb2FkZXJTcGlubmVyLmNsYXNzTGlzdC5hZGQoYGNvbG9yLSR7dGhpcy5vcHRpb25zLmNvbG9yfWApXG4gICAgICB9XG5cbiAgICAgIHRoaXMuY3VzdG9tU2l6ZSA9IHRoaXMub3B0aW9ucy5zaXplICE9PSBudWxsXG4gICAgfVxuXG4gICAgZ2V0Q2xpZW50U2l6ZSgpIHtcbiAgICAgIGlmICghdGhpcy5jdXN0b21TaXplKSB7XG4gICAgICAgIGNvbnN0IHNpemUgPSB0aGlzLm9wdGlvbnMuZWxlbWVudC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKSAgICAgICAgXG4gICAgICAgIHJldHVybiBzaXplLmhlaWdodFxuICAgICAgfVxuXG4gICAgICByZXR1cm4gdGhpcy5vcHRpb25zLnNpemVcbiAgICB9XG5cbiAgICBnZXRTcGlubmVyKCkge1xuICAgICAgcmV0dXJuIHRoaXMub3B0aW9ucy5lbGVtZW50LnF1ZXJ5U2VsZWN0b3IoJy5sb2FkZXItc3Bpbm5lcicpXG4gICAgfVxuXG4gICAgc2hvdygpIHtcbiAgICAgIGlmICh0aGlzLm9wdGlvbnMuZWxlbWVudC5jbGFzc0xpc3QuY29udGFpbnMoJ2hpZGUnKSkge1xuICAgICAgICB0aGlzLm9wdGlvbnMuZWxlbWVudC5jbGFzc0xpc3QucmVtb3ZlKCdoaWRlJylcbiAgICAgIH1cblxuICAgICAgY29uc3Qgc2l6ZSA9IHRoaXMuZ2V0Q2xpZW50U2l6ZSgpXG4gICAgICB0aGlzLm9wdGlvbnMuc2l6ZSA9IHNpemVcblxuICAgICAgaWYgKHRoaXMuY3VzdG9tU2l6ZSkge1xuICAgICAgICB0aGlzLm9wdGlvbnMuZWxlbWVudC5zdHlsZS53aWR0aCA9IGAke3RoaXMub3B0aW9ucy5zaXplfXB4YFxuICAgICAgICB0aGlzLm9wdGlvbnMuZWxlbWVudC5zdHlsZS5oZWlnaHQgPSBgJHt0aGlzLm9wdGlvbnMuc2l6ZX1weGBcblxuICAgICAgICBjb25zdCBsb2FkZXJTcGlubmVyID0gdGhpcy5nZXRTcGlubmVyKClcbiAgICAgICAgbG9hZGVyU3Bpbm5lci5zdHlsZS53aWR0aCA9IGAke3RoaXMub3B0aW9ucy5zaXplfXB4YFxuICAgICAgICBsb2FkZXJTcGlubmVyLnN0eWxlLmhlaWdodCA9IGAke3RoaXMub3B0aW9ucy5zaXplfXB4YFxuICAgICAgfVxuXG4gICAgICByZXR1cm4gdHJ1ZVxuICAgIH1cblxuICAgIGFuaW1hdGUoc3RhcnRBbmltYXRpb24gPSB0cnVlKSB7XG4gICAgICBpZiAoc3RhcnRBbmltYXRpb24pIHtcbiAgICAgICAgdGhpcy5zaG93KClcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMuaGlkZSgpXG4gICAgICB9XG5cbiAgICAgIGNvbnN0IGxvYWRlclNwaW5uZXIgPSB0aGlzLmdldFNwaW5uZXIoKVxuXG4gICAgICBpZiAoc3RhcnRBbmltYXRpb24gJiZcbiAgICAgICAgIWxvYWRlclNwaW5uZXIuY2xhc3NMaXN0LmNvbnRhaW5zKCdsb2FkZXItc3Bpbm5lci1hbmltYXRlZCcpKSB7XG4gICAgICAgIGxvYWRlclNwaW5uZXIuY2xhc3NMaXN0LmFkZCgnbG9hZGVyLXNwaW5uZXItYW5pbWF0ZWQnKVxuICAgICAgICByZXR1cm4gdHJ1ZVxuICAgICAgfVxuXG4gICAgICBpZiAoIXN0YXJ0QW5pbWF0aW9uICYmXG4gICAgICAgIGxvYWRlclNwaW5uZXIuY2xhc3NMaXN0LmNvbnRhaW5zKCdsb2FkZXItc3Bpbm5lci1hbmltYXRlZCcpKSB7XG4gICAgICAgIGxvYWRlclNwaW5uZXIuY2xhc3NMaXN0LnJlbW92ZSgnbG9hZGVyLXNwaW5uZXItYW5pbWF0ZWQnKVxuICAgICAgfVxuXG4gICAgICByZXR1cm4gdHJ1ZVxuICAgIH1cblxuICAgIGhpZGUoKSB7XG4gICAgICBpZiAoIXRoaXMub3B0aW9ucy5lbGVtZW50LmNsYXNzTGlzdC5jb250YWlucygnaGlkZScpKSB7XG4gICAgICAgIHRoaXMub3B0aW9ucy5lbGVtZW50LmNsYXNzTGlzdC5hZGQoJ2hpZGUnKVxuICAgICAgfVxuXG4gICAgICByZXR1cm4gdHJ1ZVxuICAgIH1cblxuICAgIHN0YXRpYyBpZGVudGlmaWVyKCkge1xuICAgICAgcmV0dXJuIE5BTUVcbiAgICB9XG5cbiAgICBzdGF0aWMgX0RPTUludGVyZmFjZShvcHRpb25zKSB7XG4gICAgICByZXR1cm4gc3VwZXIuX0RPTUludGVyZmFjZShMb2FkZXIsIG9wdGlvbnMpXG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIExvYWRlclxufSkoKVxuXG5leHBvcnQgZGVmYXVsdCBMb2FkZXJcbiIsIi8qKlxuKiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuKiBMaWNlbnNlZCB1bmRlciBNSVQgKGh0dHBzOi8vZ2l0aHViLmNvbS9xdWFyay1kZXYvUGhvbm9uLUZyYW1ld29yay9ibG9iL21hc3Rlci9MSUNFTlNFKVxuKiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuKi9cbmltcG9ydCBFdmVudCBmcm9tICcuLi8uLi9jb21tb24vZXZlbnRzJ1xuaW1wb3J0IENvbXBvbmVudCBmcm9tICcuLi9jb21wb25lbnQnXG5cbmNvbnN0IE5vdGlmaWNhdGlvbiA9ICgoKSA9PiB7XG4gIC8qKlxuICAgKiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgKiBDb25zdGFudHNcbiAgKiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgKi9cblxuICBjb25zdCBOQU1FID0gJ25vdGlmaWNhdGlvbidcbiAgY29uc3QgVkVSU0lPTiA9ICcyLjAuMCdcbiAgY29uc3QgREVGQVVMVF9QUk9QRVJUSUVTID0ge1xuICAgIGVsZW1lbnQ6IG51bGwsXG4gICAgbWVzc2FnZTogJycsXG4gICAgc2hvd0J1dHRvbjogdHJ1ZSxcbiAgICB0aW1lb3V0OiBudWxsLFxuICAgIGJhY2tncm91bmQ6ICdwcmltYXJ5JyxcbiAgfVxuICBjb25zdCBEQVRBX0FUVFJTX1BST1BFUlRJRVMgPSBbXG4gICAgJ3RpbWVvdXQnLFxuICBdXG5cbiAgLyoqXG4gICAqIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgKiBDbGFzcyBEZWZpbml0aW9uXG4gICAqIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgKi9cblxuICBjbGFzcyBOb3RpZmljYXRpb24gZXh0ZW5kcyBDb21wb25lbnQge1xuXG4gICAgY29uc3RydWN0b3Iob3B0aW9ucyA9IHt9KSB7XG4gICAgICBzdXBlcihOQU1FLCBWRVJTSU9OLCBERUZBVUxUX1BST1BFUlRJRVMsIG9wdGlvbnMsIERBVEFfQVRUUlNfUFJPUEVSVElFUywgdHJ1ZSwgZmFsc2UpXG5cbiAgICAgIHRoaXMudGVtcGxhdGUgPSAnJyArXG4gICAgICAnPGRpdiBjbGFzcz1cIm5vdGlmaWNhdGlvblwiPicgK1xuICAgICAgICAnPGRpdiBjbGFzcz1cIm5vdGlmaWNhdGlvbi1pbm5lclwiPicgK1xuICAgICAgICAgICc8ZGl2IGNsYXNzPVwibWVzc2FnZVwiPjwvZGl2PicgK1xuICAgICAgICAgICc8YnV0dG9uIHR5cGU9XCJidXR0b25cIiBjbGFzcz1cImNsb3NlXCIgZGF0YS1kaXNtaXNzPVwibm90aWZpY2F0aW9uXCIgYXJpYS1sYWJlbD1cIkNsb3NlXCI+JyArXG4gICAgICAgICAgICAnPHNwYW4gYXJpYS1oaWRkZW49XCJ0cnVlXCI+JnRpbWVzOzwvc3Bhbj4nICtcbiAgICAgICAgICAnPC9idXR0b24+JyArXG4gICAgICAgICc8L2Rpdj4nICtcbiAgICAgICc8L2Rpdj4nXG5cbiAgICAgIGlmICh0aGlzLmR5bmFtaWNFbGVtZW50KSB7XG4gICAgICAgIHRoaXMuYnVpbGQoKVxuICAgICAgfVxuXG4gICAgICB0aGlzLnRpbWVvdXRDYWxsYmFjayA9IG51bGxcbiAgICB9XG5cbiAgICBidWlsZCgpIHtcbiAgICAgIGNvbnN0IGJ1aWxkZXIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKVxuXG4gICAgICBidWlsZGVyLmlubmVySFRNTCA9IHRoaXMudGVtcGxhdGVcblxuICAgICAgdGhpcy5vcHRpb25zLmVsZW1lbnQgPSBidWlsZGVyLmZpcnN0Q2hpbGRcblxuICAgICAgLy8gdGV4dCBtZXNzYWdlXG4gICAgICB0aGlzLm9wdGlvbnMuZWxlbWVudC5xdWVyeVNlbGVjdG9yKCcubWVzc2FnZScpLmlubmVySFRNTCA9IHRoaXMub3B0aW9ucy5tZXNzYWdlXG5cbiAgICAgIGlmICghdGhpcy5vcHRpb25zLnNob3dCdXR0b24pIHtcbiAgICAgICAgdGhpcy5vcHRpb25zLmVsZW1lbnQucXVlcnlTZWxlY3RvcignYnV0dG9uJykuc3R5bGUuZGlzcGxheSA9ICdub25lJ1xuICAgICAgfVxuXG4gICAgICBkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKHRoaXMub3B0aW9ucy5lbGVtZW50KVxuXG4gICAgICB0aGlzLnNldEF0dHJpYnV0ZXMoKVxuICAgIH1cblxuICAgIHNob3coKSB7XG4gICAgICBpZiAodGhpcy5vcHRpb25zLmVsZW1lbnQgPT09IG51bGwpIHtcbiAgICAgICAgLy8gYnVpbGQgYW5kIGluc2VydCBhIG5ldyBET00gZWxlbWVudFxuICAgICAgICB0aGlzLmJ1aWxkKClcbiAgICAgIH1cblxuICAgICAgaWYgKHRoaXMub3B0aW9ucy5lbGVtZW50LmNsYXNzTGlzdC5jb250YWlucygnc2hvdycpKSB7XG4gICAgICAgIHJldHVybiBmYWxzZVxuICAgICAgfVxuXG4gICAgICAvLyByZXNldCBjb2xvclxuICAgICAgaWYgKHRoaXMub3B0aW9ucy5iYWNrZ3JvdW5kKSB7XG4gICAgICAgIHRoaXMub3B0aW9ucy5lbGVtZW50LnJlbW92ZUF0dHJpYnV0ZSgnY2xhc3MnKVxuICAgICAgICB0aGlzLm9wdGlvbnMuZWxlbWVudC5zZXRBdHRyaWJ1dGUoJ2NsYXNzJywgJ25vdGlmaWNhdGlvbicpXG5cbiAgICAgICAgdGhpcy5vcHRpb25zLmVsZW1lbnQuY2xhc3NMaXN0LmFkZChgYmctJHt0aGlzLm9wdGlvbnMuYmFja2dyb3VuZH1gKVxuICAgICAgICB0aGlzLm9wdGlvbnMuZWxlbWVudC5xdWVyeVNlbGVjdG9yKCdidXR0b24nKS5jbGFzc0xpc3QuYWRkKGBidG4tJHt0aGlzLm9wdGlvbnMuYmFja2dyb3VuZH1gKVxuICAgICAgfVxuXG4gICAgICBpZiAodGhpcy5vcHRpb25zLnNob3dCdXR0b24pIHtcbiAgICAgICAgLy8gYXR0YWNoIHRoZSBidXR0b24gaGFuZGxlclxuICAgICAgICBjb25zdCBidXR0b25FbGVtZW50ID0gdGhpcy5vcHRpb25zLmVsZW1lbnQucXVlcnlTZWxlY3RvcignYnV0dG9uJylcbiAgICAgICAgdGhpcy5yZWdpc3RlckVsZW1lbnQoeyB0YXJnZXQ6IGJ1dHRvbkVsZW1lbnQsIGV2ZW50OiAnY2xpY2snIH0pXG4gICAgICB9XG5cbiAgICAgIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgICB0aGlzLm9wdGlvbnMuZWxlbWVudC5jbGFzc0xpc3QuYWRkKCdzaG93JylcblxuICAgICAgICAvLyBzZXQgcG9zaXRpb25cbiAgICAgICAgY29uc3QgYWN0aXZlTm90aWZpY2F0aW9ucyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJy5ub3RpZmljYXRpb24uc2hvdycpIHx8IFtdXG4gICAgICAgIGxldCBwdXNoRGlzdGFuY2UgPSAwXG4gICAgICAgIGFjdGl2ZU5vdGlmaWNhdGlvbnMuZm9yRWFjaCgobm90aWZpY2F0aW9uKSA9PiB7XG4gICAgICAgICAgaWYgKHRoaXMub3B0aW9ucy5lbGVtZW50ICE9PSBub3RpZmljYXRpb24pIHtcbiAgICAgICAgICAgIGNvbnN0IHN0eWxlID0gZ2V0Q29tcHV0ZWRTdHlsZShub3RpZmljYXRpb24pXG4gICAgICAgICAgICBwdXNoRGlzdGFuY2UgKz0gbm90aWZpY2F0aW9uLm9mZnNldEhlaWdodCArIHBhcnNlSW50KHN0eWxlLm1hcmdpbkJvdHRvbSwgMTApXG4gICAgICAgICAgfVxuICAgICAgICB9KVxuXG4gICAgICAgIHRoaXMub3B0aW9ucy5lbGVtZW50LnN0eWxlLnRyYW5zZm9ybSA9IGB0cmFuc2xhdGVZKCR7cHVzaERpc3RhbmNlfXB4KWBcblxuICAgICAgICB0aGlzLnRyaWdnZXJFdmVudChFdmVudC5TSE9XKVxuXG4gICAgICAgIGNvbnN0IG9uU2hvd24gPSAoKSA9PiB7XG4gICAgICAgICAgdGhpcy50cmlnZ2VyRXZlbnQoRXZlbnQuU0hPV04pXG4gICAgICAgICAgdGhpcy5vcHRpb25zLmVsZW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcihFdmVudC5UUkFOU0lUSU9OX0VORCwgb25TaG93bilcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMub3B0aW9ucy5lbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIoRXZlbnQuVFJBTlNJVElPTl9FTkQsIG9uU2hvd24pXG5cbiAgICAgIH0sIDEpXG5cbiAgICAgIGlmIChOdW1iZXIuaXNJbnRlZ2VyKHRoaXMub3B0aW9ucy50aW1lb3V0KSAmJiB0aGlzLm9wdGlvbnMudGltZW91dCA+IDApIHtcbiAgICAgICAgLy8gaWYgdGhlcmUgaXMgYSB0aW1lb3V0LCBhdXRvIGhpZGUgdGhlIG5vdGlmaWNhdGlvblxuICAgICAgICB0aGlzLnRpbWVvdXRDYWxsYmFjayA9IHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgICAgIHRoaXMuaGlkZSgpXG4gICAgICAgIH0sIHRoaXMub3B0aW9ucy50aW1lb3V0ICsgMSlcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIHRydWVcbiAgICB9XG5cbiAgICBoaWRlKCkge1xuICAgICAgLypcbiAgICAgICAqIHByZXZlbnQgdG8gY2xvc2UgYSBub3RpZmljYXRpb24gd2l0aCBhIHRpbWVvdXRcbiAgICAgICAqIGlmIHRoZSB1c2VyIGhhcyBhbHJlYWR5IGNsaWNrZWQgb24gdGhlIGJ1dHRvblxuICAgICAgICovXG4gICAgICBpZiAodGhpcy50aW1lb3V0Q2FsbGJhY2spIHtcbiAgICAgICAgY2xlYXJUaW1lb3V0KHRoaXMudGltZW91dENhbGxiYWNrKVxuICAgICAgICB0aGlzLnRpbWVvdXRDYWxsYmFjayA9IG51bGxcbiAgICAgIH1cblxuICAgICAgaWYgKCF0aGlzLm9wdGlvbnMuZWxlbWVudC5jbGFzc0xpc3QuY29udGFpbnMoJ3Nob3cnKSkge1xuICAgICAgICByZXR1cm4gZmFsc2VcbiAgICAgIH1cblxuICAgICAgdGhpcy50cmlnZ2VyRXZlbnQoRXZlbnQuSElERSlcblxuICAgICAgaWYgKHRoaXMub3B0aW9ucy5zaG93QnV0dG9uKSB7XG4gICAgICAgIGNvbnN0IGJ1dHRvbkVsZW1lbnQgPSB0aGlzLm9wdGlvbnMuZWxlbWVudC5xdWVyeVNlbGVjdG9yKCdidXR0b24nKVxuICAgICAgICB0aGlzLnVucmVnaXN0ZXJFbGVtZW50KHsgdGFyZ2V0OiBidXR0b25FbGVtZW50LCBldmVudDogJ2NsaWNrJyB9KVxuICAgICAgfVxuXG4gICAgICB0aGlzLm9wdGlvbnMuZWxlbWVudC5jbGFzc0xpc3QucmVtb3ZlKCdzaG93JylcbiAgICAgIHRoaXMub3B0aW9ucy5lbGVtZW50LmNsYXNzTGlzdC5hZGQoJ2hpZGUnKVxuXG4gICAgICBjb25zdCBvbkhpZGRlbiA9ICgpID0+IHtcbiAgICAgICAgdGhpcy5vcHRpb25zLmVsZW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcihFdmVudC5UUkFOU0lUSU9OX0VORCwgb25IaWRkZW4pXG4gICAgICAgIHRoaXMub3B0aW9ucy5lbGVtZW50LmNsYXNzTGlzdC5yZW1vdmUoJ2hpZGUnKVxuXG4gICAgICAgIHRoaXMudHJpZ2dlckV2ZW50KEV2ZW50LkhJRERFTilcblxuICAgICAgICBpZiAodGhpcy5keW5hbWljRWxlbWVudCkge1xuICAgICAgICAgIGRvY3VtZW50LmJvZHkucmVtb3ZlQ2hpbGQodGhpcy5vcHRpb25zLmVsZW1lbnQpXG4gICAgICAgICAgdGhpcy5vcHRpb25zLmVsZW1lbnQgPSBudWxsXG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgdGhpcy5vcHRpb25zLmVsZW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihFdmVudC5UUkFOU0lUSU9OX0VORCwgb25IaWRkZW4pXG5cbiAgICAgIHJldHVybiB0cnVlXG4gICAgfVxuXG4gICAgb25FbGVtZW50RXZlbnQoKSB7XG4gICAgICB0aGlzLmhpZGUoKVxuICAgIH1cblxuICAgIHN0YXRpYyBpZGVudGlmaWVyKCkge1xuICAgICAgcmV0dXJuIE5BTUVcbiAgICB9XG5cbiAgICBzdGF0aWMgX0RPTUludGVyZmFjZShvcHRpb25zKSB7XG4gICAgICByZXR1cm4gc3VwZXIuX0RPTUludGVyZmFjZShOb3RpZmljYXRpb24sIG9wdGlvbnMpXG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIE5vdGlmaWNhdGlvblxufSkoKVxuXG5leHBvcnQgZGVmYXVsdCBOb3RpZmljYXRpb25cbiIsIi8qKlxuICogLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAqIExpY2Vuc2VkIHVuZGVyIE1JVCAoaHR0cHM6Ly9naXRodWIuY29tL3F1YXJrLWRldi9QaG9ub24tRnJhbWV3b3JrL2Jsb2IvbWFzdGVyL0xJQ0VOU0UpXG4gKiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICovXG5pbXBvcnQgRXZlbnQgZnJvbSAnLi4vLi4vY29tbW9uL2V2ZW50cydcbmltcG9ydCBDb21wb25lbnQgZnJvbSAnLi4vY29tcG9uZW50J1xuaW1wb3J0IHsgZ2V0QXR0cmlidXRlc0NvbmZpZyB9IGZyb20gJy4uL2NvbXBvbmVudE1hbmFnZXInXG5pbXBvcnQgeyBmaW5kVGFyZ2V0QnlBdHRyIH0gZnJvbSAnLi4vLi4vY29tbW9uL3V0aWxzJ1xuXG5jb25zdCBPZmZDYW52YXMgPSAoKCkgPT4ge1xuICAvKipcbiAgICogLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAqIENvbnN0YW50c1xuICAgKiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICovXG5cbiAgY29uc3QgTkFNRSA9ICdvZmYtY2FudmFzJ1xuICBjb25zdCBWRVJTSU9OID0gJzIuMC4wJ1xuICBjb25zdCBCQUNLRFJPUF9TRUxFQ1RPUiA9ICdvZmYtY2FudmFzLWJhY2tkcm9wJ1xuICBjb25zdCBERUZBVUxUX1BST1BFUlRJRVMgPSB7XG4gICAgZWxlbWVudDogbnVsbCxcbiAgICBhc2lkZToge1xuICAgICAgbWQ6IGZhbHNlLFxuICAgICAgbGc6IGZhbHNlLFxuICAgICAgeGw6IGZhbHNlLFxuICAgIH0sXG4gIH1cbiAgY29uc3QgREFUQV9BVFRSU19QUk9QRVJUSUVTID0gW1xuICAgICdhc2lkZScsXG4gIF1cblxuICAvKipcbiAgICogLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAqIENsYXNzIERlZmluaXRpb25cbiAgICogLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAqL1xuXG4gIGNsYXNzIE9mZkNhbnZhcyBleHRlbmRzIENvbXBvbmVudCB7XG5cbiAgICBjb25zdHJ1Y3RvcihvcHRpb25zID0ge30pIHtcbiAgICAgIHN1cGVyKE5BTUUsIFZFUlNJT04sIERFRkFVTFRfUFJPUEVSVElFUywgb3B0aW9ucywgREFUQV9BVFRSU19QUk9QRVJUSUVTLCBmYWxzZSwgdHJ1ZSlcblxuICAgICAgdGhpcy51c2VCYWNrZHJvcCA9IHRydWVcbiAgICAgIHRoaXMuY3VycmVudFdpZHRoID0gbnVsbFxuICAgICAgdGhpcy5hbmltYXRlID0gdHJ1ZVxuXG4gICAgICB0aGlzLmRpcmVjdGlvbnMgPSBbJ2xlZnQnLCAncmlnaHQnXVxuXG4gICAgICBjb25zdCBzbSA9IHsgbmFtZTogJ3NtJywgbWVkaWE6IHdpbmRvdy5tYXRjaE1lZGlhKCcobWluLXdpZHRoOiAxcHgpJykgfVxuICAgICAgY29uc3QgbWQgPSB7IG5hbWU6ICdtZCcsIG1lZGlhOiB3aW5kb3cubWF0Y2hNZWRpYSgnKG1pbi13aWR0aDogNzY4cHgpJykgfVxuICAgICAgY29uc3QgbGcgPSB7IG5hbWU6ICdsZycsIG1lZGlhOiB3aW5kb3cubWF0Y2hNZWRpYSgnKG1pbi13aWR0aDogOTkycHgpJykgfVxuICAgICAgY29uc3QgeGwgPSB7IG5hbWU6ICd4bCcsIG1lZGlhOiB3aW5kb3cubWF0Y2hNZWRpYSgnKG1pbi13aWR0aDogMTIwMHB4KScpIH1cblxuICAgICAgdGhpcy5zaXplcyA9IFtzbSwgbWQsIGxnLCB4bF0ucmV2ZXJzZSgpXG5cbiAgICAgIHRoaXMuY2hlY2tEaXJlY3Rpb24oKVxuICAgICAgdGhpcy5jaGVja1dpZHRoKClcblxuICAgICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ3Jlc2l6ZScsICgpID0+IHRoaXMuY2hlY2tXaWR0aCgpLCBmYWxzZSkgICAgICBcbiAgICB9XG5cbiAgICBjaGVja0RpcmVjdGlvbigpIHtcbiAgICAgIHRoaXMuZGlyZWN0aW9ucy5ldmVyeSgoZGlyZWN0aW9uKSA9PiB7XG4gICAgICAgIGlmICh0aGlzLm9wdGlvbnMuZWxlbWVudC5jbGFzc0xpc3QuY29udGFpbnMoYG9mZi1jYW52YXMtJHtkaXJlY3Rpb259YCkpIHtcbiAgICAgICAgICB0aGlzLmRpcmVjdGlvbiA9IGRpcmVjdGlvblxuICAgICAgICAgIHJldHVybiBmYWxzZVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0cnVlXG4gICAgICB9KVxuICAgIH1cblxuICAgIGNoZWNrV2lkdGgoKSB7XG4gICAgICBpZiAoISgnbWF0Y2hNZWRpYScgaW4gd2luZG93KSkge1xuICAgICAgICByZXR1cm5cbiAgICAgIH1cblxuICAgICAgdGhpcy5zaXplcy5ldmVyeSgoc2l6ZSkgPT4ge1xuICAgICAgICBjb25zdCBtYXRjaCA9IHNpemUubWVkaWEubWVkaWEubWF0Y2goL1thLXpdPy13aWR0aDpcXHM/KFswLTldKykvKVxuXG4gICAgICAgIGlmIChtYXRjaCkge1xuICAgICAgICAgIGlmIChzaXplLm1lZGlhLm1hdGNoZXMpIHtcbiAgICAgICAgICAgIGlmICh0aGlzLmN1cnJlbnRXaWR0aCAhPT0gc2l6ZS5uYW1lKSB7XG4gICAgICAgICAgICAgIHRoaXMuc2V0QXNpZGUoc2l6ZS5uYW1lKVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdGhpcy5jdXJyZW50V2lkdGggPSBzaXplLm5hbWVcbiAgICAgICAgICAgIHJldHVybiBmYWxzZVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiB0cnVlXG4gICAgICB9KVxuICAgIH1cblxuICAgIHByZXZlbnRDbG9zYWJsZSgpIHtcbiAgICAgIHJldHVybiBzdXBlci5wcmV2ZW50Q2xvc2FibGUoKSB8fCB0aGlzLm9wdGlvbnMuYXNpZGVbdGhpcy5jdXJyZW50V2lkdGhdID09PSB0cnVlXG4gICAgfVxuXG4gICAgc2V0QXNpZGUobmFtZSkge1xuICAgICAgY29uc3QgY29udGVudCA9IGRvY3VtZW50LmJvZHlcblxuICAgICAgaWYgKHRoaXMub3B0aW9ucy5hc2lkZVtuYW1lXSA9PT0gdHJ1ZSkge1xuICAgICAgICBpZiAoIWNvbnRlbnQuY2xhc3NMaXN0LmNvbnRhaW5zKGBvZmYtY2FudmFzLWFzaWRlLSR7dGhpcy5kaXJlY3Rpb259YCkpIHtcbiAgICAgICAgICBjb250ZW50LmNsYXNzTGlzdC5hZGQoYG9mZi1jYW52YXMtYXNpZGUtJHt0aGlzLmRpcmVjdGlvbn1gKVxuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy51c2VCYWNrZHJvcCA9IGZhbHNlXG5cbiAgICAgICAgLy8gYXZvaWQgYW5pbWF0aW9uIGJ5IHNldHRpbmcgYW5pbWF0ZSB0byBmYWxzZVxuICAgICAgICB0aGlzLmFuaW1hdGUgPSBmYWxzZVxuICAgICAgICB0aGlzLnNob3coKVxuICAgICAgICAvLyByZW1vdmUgcHJldmlvdXMgYmFja2Ryb3BcbiAgICAgICAgdGhpcy5yZW1vdmVCYWNrZHJvcCgpXG4gICAgICB9IGVsc2Uge1xuICAgICAgICBpZiAoY29udGVudC5jbGFzc0xpc3QuY29udGFpbnMoYG9mZi1jYW52YXMtYXNpZGUtJHt0aGlzLmRpcmVjdGlvbn1gKSkge1xuICAgICAgICAgIGNvbnRlbnQuY2xhc3NMaXN0LnJlbW92ZShgb2ZmLWNhbnZhcy1hc2lkZS0ke3RoaXMuZGlyZWN0aW9ufWApXG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLmhpZGUoKVxuICAgICAgICB0aGlzLnVzZUJhY2tkcm9wID0gdHJ1ZVxuICAgICAgICB0aGlzLmFuaW1hdGUgPSB0cnVlXG4gICAgICB9XG4gICAgfVxuXG4gICAgb25FbGVtZW50RXZlbnQoZXZlbnQpIHtcbiAgICAgIGlmIChldmVudC50eXBlID09PSAna2V5dXAnICYmIGV2ZW50LmtleUNvZGUgIT09IDI3ICYmIGV2ZW50LmtleUNvZGUgIT09IDEzKSB7XG4gICAgICAgIHJldHVyblxuICAgICAgfVxuXG4gICAgICAvLyBoaWRlIHRoZSBvZmYtY2FudmFzXG4gICAgICB0aGlzLmhpZGUoKVxuICAgIH1cblxuICAgIHNob3coKSB7XG4gICAgICBpZiAodGhpcy5vcHRpb25zLmVsZW1lbnQuY2xhc3NMaXN0LmNvbnRhaW5zKCdzaG93JykpIHtcbiAgICAgICAgcmV0dXJuIGZhbHNlXG4gICAgICB9XG5cbiAgICAgIC8vIGFkZCBhIHRpbWVvdXQgc28gdGhhdCB0aGUgQ1NTIGFuaW1hdGlvbiB3b3Jrc1xuICAgICAgc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICAgIHRoaXMudHJpZ2dlckV2ZW50KEV2ZW50LlNIT1cpXG5cbiAgICAgICAgY29uc3Qgb25TaG93biA9ICgpID0+IHtcbiAgICAgICAgICB0aGlzLnRyaWdnZXJFdmVudChFdmVudC5TSE9XTilcblxuICAgICAgICAgIGlmICh0aGlzLmFuaW1hdGUpIHtcbiAgICAgICAgICAgIHRoaXMub3B0aW9ucy5lbGVtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoRXZlbnQuVFJBTlNJVElPTl9FTkQsIG9uU2hvd24pXG4gICAgICAgICAgICB0aGlzLm9wdGlvbnMuZWxlbWVudC5jbGFzc0xpc3QucmVtb3ZlKCdhbmltYXRlJylcbiAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBpZiAodGhpcy51c2VCYWNrZHJvcCkge1xuICAgICAgICAgIHRoaXMuY3JlYXRlQmFja2Ryb3AoKVxuICAgICAgICB9XG5cblxuICAgICAgICBpZiAodGhpcy5hbmltYXRlKSB7XG4gICAgICAgICAgdGhpcy5vcHRpb25zLmVsZW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihFdmVudC5UUkFOU0lUSU9OX0VORCwgb25TaG93bikgICAgICAgIFxuICAgICAgICAgIHRoaXMub3B0aW9ucy5lbGVtZW50LmNsYXNzTGlzdC5hZGQoJ2FuaW1hdGUnKVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIC8vIGRpcmVjdGx5IHRyaWdnZXIgdGhlIG9uU2hvd25cbiAgICAgICAgICBvblNob3duKClcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMub3B0aW9ucy5lbGVtZW50LmNsYXNzTGlzdC5hZGQoJ3Nob3cnKSAgICAgICAgXG5cbiAgICAgICAgLy8gYXR0YWNoIGV2ZW50XG4gICAgICAgIHRoaXMuYXR0YWNoRXZlbnRzKClcbiAgICAgIH0sIDEpXG5cbiAgICAgIHJldHVybiB0cnVlXG4gICAgfVxuXG4gICAgaGlkZSgpIHtcbiAgICAgIGlmICghdGhpcy5vcHRpb25zLmVsZW1lbnQuY2xhc3NMaXN0LmNvbnRhaW5zKCdzaG93JykpIHtcbiAgICAgICAgcmV0dXJuIGZhbHNlXG4gICAgICB9XG5cbiAgICAgIHRoaXMudHJpZ2dlckV2ZW50KEV2ZW50LkhJREUpXG5cbiAgICAgIHRoaXMuZGV0YWNoRXZlbnRzKClcblxuICAgICAgaWYgKHRoaXMuYW5pbWF0ZSkge1xuICAgICAgICB0aGlzLm9wdGlvbnMuZWxlbWVudC5jbGFzc0xpc3QuYWRkKCdhbmltYXRlJylcbiAgICAgIH1cblxuICAgICAgdGhpcy5vcHRpb25zLmVsZW1lbnQuY2xhc3NMaXN0LnJlbW92ZSgnc2hvdycpXG5cbiAgICAgIGlmICh0aGlzLnVzZUJhY2tkcm9wKSB7XG4gICAgICAgIGNvbnN0IGJhY2tkcm9wID0gdGhpcy5nZXRCYWNrZHJvcCgpXG5cbiAgICAgICAgY29uc3Qgb25IaWRkZW4gPSAoKSA9PiB7XG4gICAgICAgICAgaWYgKHRoaXMuYW5pbWF0ZSkge1xuICAgICAgICAgICAgdGhpcy5vcHRpb25zLmVsZW1lbnQuY2xhc3NMaXN0LnJlbW92ZSgnYW5pbWF0ZScpXG4gICAgICAgICAgfVxuXG4gICAgICAgICAgYmFja2Ryb3AucmVtb3ZlRXZlbnRMaXN0ZW5lcihFdmVudC5UUkFOU0lUSU9OX0VORCwgb25IaWRkZW4pXG4gICAgICAgICAgdGhpcy50cmlnZ2VyRXZlbnQoRXZlbnQuSElEREVOKSAgICAgICAgXG4gICAgICAgICAgdGhpcy5yZW1vdmVCYWNrZHJvcCgpXG4gICAgICAgIH1cblxuICAgICAgICBiYWNrZHJvcC5hZGRFdmVudExpc3RlbmVyKEV2ZW50LlRSQU5TSVRJT05fRU5ELCBvbkhpZGRlbilcbiAgICAgICAgYmFja2Ryb3AuY2xhc3NMaXN0LmFkZCgnZmFkZW91dCcpXG4gICAgICB9XG5cbiAgICAgIHJldHVybiB0cnVlXG4gICAgfVxuXG4gICAgY3JlYXRlQmFja2Ryb3AoKSB7XG4gICAgICBjb25zdCBiYWNrZHJvcCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpXG4gICAgICBiYWNrZHJvcC5zZXRBdHRyaWJ1dGUoJ2RhdGEtaWQnLCB0aGlzLmlkKVxuICAgICAgYmFja2Ryb3AuY2xhc3NMaXN0LmFkZChCQUNLRFJPUF9TRUxFQ1RPUilcblxuICAgICAgZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZChiYWNrZHJvcClcbiAgICB9XG5cbiAgICBnZXRCYWNrZHJvcCgpIHtcbiAgICAgIHJldHVybiBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKGAuJHtCQUNLRFJPUF9TRUxFQ1RPUn1bZGF0YS1pZD1cIiR7dGhpcy5pZH1cIl1gKVxuICAgIH1cblxuICAgIHJlbW92ZUJhY2tkcm9wKCkge1xuICAgICAgY29uc3QgYmFja2Ryb3AgPSB0aGlzLmdldEJhY2tkcm9wKClcbiAgICAgIGlmIChiYWNrZHJvcCkge1xuICAgICAgICBkb2N1bWVudC5ib2R5LnJlbW92ZUNoaWxkKGJhY2tkcm9wKVxuICAgICAgfVxuICAgIH1cblxuICAgIGF0dGFjaEV2ZW50cygpIHtcbiAgICAgIGNvbnN0IGRpc21pc3NCdXR0b25zID0gdGhpcy5vcHRpb25zLmVsZW1lbnQucXVlcnlTZWxlY3RvckFsbCgnW2RhdGEtZGlzbWlzc10nKVxuXG4gICAgICBpZiAoZGlzbWlzc0J1dHRvbnMpIHtcbiAgICAgICAgQXJyYXkuZnJvbShkaXNtaXNzQnV0dG9ucykuZm9yRWFjaChidXR0b24gPT4gdGhpcy5yZWdpc3RlckVsZW1lbnQoeyB0YXJnZXQ6IGJ1dHRvbiwgZXZlbnQ6ICdjbGljaycgfSkpXG4gICAgICB9XG5cbiAgICAgIGlmICh0aGlzLnVzZUJhY2tkcm9wKSB7XG4gICAgICAgIGNvbnN0IGJhY2tkcm9wID0gdGhpcy5nZXRCYWNrZHJvcCgpICAgICAgXG4gICAgICAgIHRoaXMucmVnaXN0ZXJFbGVtZW50KHsgdGFyZ2V0OiBiYWNrZHJvcCwgZXZlbnQ6IEV2ZW50LlNUQVJUIH0pXG4gICAgICB9XG5cbiAgICAgIHRoaXMucmVnaXN0ZXJFbGVtZW50KHsgdGFyZ2V0OiBkb2N1bWVudCwgZXZlbnQ6ICdrZXl1cCcgfSlcbiAgICB9XG5cbiAgICBkZXRhY2hFdmVudHMoKSB7XG4gICAgICBjb25zdCBkaXNtaXNzQnV0dG9ucyA9IHRoaXMub3B0aW9ucy5lbGVtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJ1tkYXRhLWRpc21pc3NdJylcblxuICAgICAgaWYgKGRpc21pc3NCdXR0b25zKSB7XG4gICAgICAgIEFycmF5LmZyb20oZGlzbWlzc0J1dHRvbnMpLmZvckVhY2goYnV0dG9uID0+IHRoaXMudW5yZWdpc3RlckVsZW1lbnQoeyB0YXJnZXQ6IGJ1dHRvbiwgZXZlbnQ6ICdjbGljaycgfSkpXG4gICAgICB9XG5cbiAgICAgIGlmICh0aGlzLnVzZUJhY2tkcm9wKSB7XG4gICAgICAgIGNvbnN0IGJhY2tkcm9wID0gdGhpcy5nZXRCYWNrZHJvcCgpXG4gICAgICAgIHRoaXMudW5yZWdpc3RlckVsZW1lbnQoeyB0YXJnZXQ6IGJhY2tkcm9wLCBldmVudDogRXZlbnQuU1RBUlQgfSlcbiAgICAgIH1cblxuICAgICAgdGhpcy51bnJlZ2lzdGVyRWxlbWVudCh7IHRhcmdldDogZG9jdW1lbnQsIGV2ZW50OiAna2V5dXAnIH0pXG4gICAgfVxuXG4gICAgc3RhdGljIGlkZW50aWZpZXIoKSB7XG4gICAgICByZXR1cm4gTkFNRVxuICAgIH1cblxuICAgIHN0YXRpYyBfRE9NSW50ZXJmYWNlKG9wdGlvbnMpIHtcbiAgICAgIHJldHVybiBzdXBlci5fRE9NSW50ZXJmYWNlKE9mZkNhbnZhcywgb3B0aW9ucylcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAqIERPTSBBcGkgaW1wbGVtZW50YXRpb25cbiAgICogLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAqL1xuICBjb25zdCBjb21wb25lbnRzID0gW11cblxuICBjb25zdCBvZmZDYW52YXMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKGAuJHtOQU1FfWApXG4gIGlmIChvZmZDYW52YXMpIHtcbiAgICBBcnJheS5mcm9tKG9mZkNhbnZhcykuZm9yRWFjaCgoZWxlbWVudCkgPT4ge1xuICAgICAgY29uc3QgY29uZmlnID0gZ2V0QXR0cmlidXRlc0NvbmZpZyhlbGVtZW50LCBERUZBVUxUX1BST1BFUlRJRVMsIERBVEFfQVRUUlNfUFJPUEVSVElFUylcbiAgICAgIGNvbmZpZy5lbGVtZW50ID0gZWxlbWVudFxuXG4gICAgICBjb21wb25lbnRzLnB1c2goeyBlbGVtZW50LCBvZmZDYW52YXM6IG5ldyBPZmZDYW52YXMoY29uZmlnKSB9KVxuICAgIH0pXG4gIH1cblxuICBpZiAob2ZmQ2FudmFzKSB7XG4gICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoZXZlbnQpID0+IHtcbiAgICAgIGNvbnN0IHRhcmdldCA9IGZpbmRUYXJnZXRCeUF0dHIoZXZlbnQudGFyZ2V0LCAnZGF0YS10b2dnbGUnKVxuICAgICAgaWYgKCF0YXJnZXQpIHtcbiAgICAgICAgcmV0dXJuXG4gICAgICB9XG5cbiAgICAgIGNvbnN0IGRhdGFUb2dnbGVBdHRyID0gdGFyZ2V0LmdldEF0dHJpYnV0ZSgnZGF0YS10b2dnbGUnKVxuICAgICAgaWYgKGRhdGFUb2dnbGVBdHRyICYmIGRhdGFUb2dnbGVBdHRyID09PSBOQU1FKSB7XG4gICAgICAgIGNvbnN0IGlkID0gdGFyZ2V0LmdldEF0dHJpYnV0ZSgnZGF0YS10YXJnZXQnKVxuICAgICAgICBjb25zdCBlbGVtZW50ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihpZClcblxuICAgICAgICBjb25zdCBjb21wb25lbnQgPSBjb21wb25lbnRzLmZpbmQoYyA9PiBjLmVsZW1lbnQgPT09IGVsZW1lbnQpXG5cbiAgICAgICAgaWYgKCFjb21wb25lbnQpIHtcbiAgICAgICAgICByZXR1cm5cbiAgICAgICAgfVxuXG4gICAgICAgIHRhcmdldC5ibHVyKClcblxuICAgICAgICBjb21wb25lbnQub2ZmQ2FudmFzLnNob3coKVxuICAgICAgfVxuICAgIH0pXG4gIH1cblxuICByZXR1cm4gT2ZmQ2FudmFzXG59KSgpXG5cbmV4cG9ydCBkZWZhdWx0IE9mZkNhbnZhc1xuIiwiLyoqXG4gKiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICogTGljZW5zZWQgdW5kZXIgTUlUIChodHRwczovL2dpdGh1Yi5jb20vcXVhcmstZGV2L1Bob25vbi1GcmFtZXdvcmsvYmxvYi9tYXN0ZXIvTElDRU5TRSlcbiAqIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gKi9cbmltcG9ydCBDb21wb25lbnQgZnJvbSAnLi4vY29tcG9uZW50J1xuaW1wb3J0IEV2ZW50IGZyb20gJy4uLy4uL2NvbW1vbi9ldmVudHMnXG5cbmNvbnN0IFByb2dyZXNzID0gKCgpID0+IHtcbiAgLyoqXG4gICAqIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgKiBDb25zdGFudHNcbiAgICogLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAqL1xuXG4gIGNvbnN0IE5BTUUgPSAncHJvZ3Jlc3MnXG4gIGNvbnN0IFZFUlNJT04gPSAnMi4wLjAnXG4gIGNvbnN0IERFRkFVTFRfUFJPUEVSVElFUyA9IHtcbiAgICBlbGVtZW50OiBudWxsLFxuICAgIGhlaWdodDogNSxcbiAgICBtaW46IDAsXG4gICAgbWF4OiAxMDAsXG4gICAgbGFiZWw6IGZhbHNlLFxuICAgIHN0cmlwZWQ6IGZhbHNlLFxuICAgIGJhY2tncm91bmQ6IG51bGwsXG4gIH1cbiAgY29uc3QgREFUQV9BVFRSU19QUk9QRVJUSUVTID0gW1xuICAgICdoZWlnaHQnLFxuICAgICdtaW4nLFxuICAgICdtYXgnLFxuICAgICdsYWJlbCcsXG4gICAgJ3N0cmlwZWQnLFxuICAgICdiYWNrZ3JvdW5kJyxcbiAgXVxuXG4gIC8qKlxuICAgKiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICogQ2xhc3MgRGVmaW5pdGlvblxuICAgKiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICovXG5cbiAgY2xhc3MgUHJvZ3Jlc3MgZXh0ZW5kcyBDb21wb25lbnQge1xuXG4gICAgY29uc3RydWN0b3Iob3B0aW9ucyA9IHt9KSB7XG4gICAgICBzdXBlcihOQU1FLCBWRVJTSU9OLCBERUZBVUxUX1BST1BFUlRJRVMsIG9wdGlvbnMsIERBVEFfQVRUUlNfUFJPUEVSVElFUywgZmFsc2UsIGZhbHNlKVxuXG4gICAgICAvLyBzZXQgdGhlIHdhbnRlZCBoZWlnaHRcbiAgICAgIHRoaXMub3B0aW9ucy5lbGVtZW50LnN0eWxlLmhlaWdodCA9IGAke3RoaXMub3B0aW9ucy5oZWlnaHR9cHhgXG5cbiAgICAgIC8vIHNldCBtaW4gYW5kIG1heCB2YWx1ZXNcbiAgICAgIGNvbnN0IHByb2dyZXNzQmFyID0gdGhpcy5nZXRQcm9ncmVzc0JhcigpXG4gICAgICBwcm9ncmVzc0Jhci5zZXRBdHRyaWJ1dGUoJ2FyaWEtdmFsdWVtaW4nLCBgJHt0aGlzLm9wdGlvbnMubWlufWApXG4gICAgICBwcm9ncmVzc0Jhci5zZXRBdHRyaWJ1dGUoJ2FyaWEtdmFsdWVtYXgnLCBgJHt0aGlzLm9wdGlvbnMubWF4fWApXG5cbiAgICAgIC8vIHNldCBzdHJpcGVkXG4gICAgICBpZiAodGhpcy5vcHRpb25zLnN0cmlwZWRcbiAgICAgICAgJiYgIXByb2dyZXNzQmFyLmNsYXNzTGlzdC5jb250YWlucygncHJvZ3Jlc3MtYmFyLXN0cmlwZWQnKSkge1xuICAgICAgICBwcm9ncmVzc0Jhci5jbGFzc0xpc3QuYWRkKCdwcm9ncmVzcy1iYXItc3RyaXBlZCcpXG4gICAgICB9XG5cbiAgICAgIC8vIHNldCBiYWNrZ3JvdW5kXG4gICAgICBpZiAodHlwZW9mIHRoaXMub3B0aW9ucy5iYWNrZ3JvdW5kID09PSAnc3RyaW5nJ1xuICAgICAgICAmJiAhcHJvZ3Jlc3NCYXIuY2xhc3NMaXN0LmNvbnRhaW5zKGBiZy0ke3RoaXMub3B0aW9ucy5iYWNrZ3JvdW5kfWApKSB7XG4gICAgICAgIHByb2dyZXNzQmFyLmNsYXNzTGlzdC5hZGQoYGJnLSR7dGhpcy5vcHRpb25zLmJhY2tncm91bmR9YClcbiAgICAgIH1cbiAgICB9XG5cbiAgICBnZXRQcm9ncmVzc0JhcigpIHtcbiAgICAgIHJldHVybiB0aGlzLm9wdGlvbnMuZWxlbWVudC5xdWVyeVNlbGVjdG9yKCcucHJvZ3Jlc3MtYmFyJylcbiAgICB9XG5cbiAgICBzZXQodmFsdWUgPSAwKSB7XG4gICAgICBjb25zdCBwcm9ncmVzc0JhciA9IHRoaXMuZ2V0UHJvZ3Jlc3NCYXIoKVxuICAgICAgY29uc3QgcHJvZ3Jlc3MgPSBNYXRoLnJvdW5kKCh2YWx1ZSAvICh0aGlzLm9wdGlvbnMubWluICsgdGhpcy5vcHRpb25zLm1heCkpICogMTAwKVxuXG4gICAgICBpZiAodmFsdWUgPCB0aGlzLm9wdGlvbnMubWluKSB7XG4gICAgICAgIGNvbnNvbGUuZXJyb3IoYCR7TkFNRX0uIFdhcm5pbmcsICR7dmFsdWV9IGlzIHVuZGVyIG1pbiB2YWx1ZS5gKVxuICAgICAgICByZXR1cm4gZmFsc2VcbiAgICAgIH1cblxuICAgICAgaWYgKHZhbHVlID4gdGhpcy5vcHRpb25zLm1heCkge1xuICAgICAgICBjb25zb2xlLmVycm9yKGAke05BTUV9LiBXYXJuaW5nLCAke3ZhbHVlfSBpcyBhYm92ZSBtYXggdmFsdWUuYCkgICAgICAgICAgXG4gICAgICAgIHJldHVybiBmYWxzZVxuICAgICAgfVxuXG4gICAgICBwcm9ncmVzc0Jhci5zZXRBdHRyaWJ1dGUoJ2FyaWEtdmFsdWVub3cnLCBgJHt2YWx1ZX1gKSAgICAgIFxuXG4gICAgICAvLyBzZXQgbGFiZWxcbiAgICAgIGlmICh0aGlzLm9wdGlvbnMubGFiZWwpIHtcbiAgICAgICAgcHJvZ3Jlc3NCYXIuaW5uZXJIVE1MID0gYCR7cHJvZ3Jlc3N9JWBcbiAgICAgIH1cblxuICAgICAgLy8gc2V0IHBlcmNlbnRhZ2VcbiAgICAgIHByb2dyZXNzQmFyLnN0eWxlLndpZHRoID0gYCR7cHJvZ3Jlc3N9JWBcblxuICAgICAgcmV0dXJuIHRydWVcbiAgICB9XG5cbiAgICBhbmltYXRlKHN0YXJ0QW5pbWF0aW9uID0gdHJ1ZSkge1xuICAgICAgaWYgKCF0aGlzLm9wdGlvbnMuc3RyaXBlZCkge1xuICAgICAgICBjb25zb2xlLmVycm9yKGAke05BTUV9LiBBbmltYXRpb24gd29ya3Mgb25seSB3aXRoIHN0cmlwZWQgcHJvZ3Jlc3MuYClcbiAgICAgICAgcmV0dXJuIGZhbHNlXG4gICAgICB9XG5cbiAgICAgIGNvbnN0IHByb2dyZXNzQmFyID0gdGhpcy5nZXRQcm9ncmVzc0JhcigpXG5cbiAgICAgIGlmIChzdGFydEFuaW1hdGlvblxuICAgICAgICAmJiAhcHJvZ3Jlc3NCYXIuY2xhc3NMaXN0LmNvbnRhaW5zKCdwcm9ncmVzcy1iYXItYW5pbWF0ZWQnKSkge1xuICAgICAgICBwcm9ncmVzc0Jhci5jbGFzc0xpc3QuYWRkKCdwcm9ncmVzcy1iYXItYW5pbWF0ZWQnKVxuICAgICAgfVxuXG4gICAgICBpZiAoIXN0YXJ0QW5pbWF0aW9uXG4gICAgICAgICYmIHByb2dyZXNzQmFyLmNsYXNzTGlzdC5jb250YWlucygncHJvZ3Jlc3MtYmFyLWFuaW1hdGVkJykpIHtcbiAgICAgICAgcHJvZ3Jlc3NCYXIuY2xhc3NMaXN0LnJlbW92ZSgncHJvZ3Jlc3MtYmFyLWFuaW1hdGVkJylcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIHRydWVcbiAgICB9XG5cbiAgICBzaG93KCkge1xuICAgICAgdGhpcy5vcHRpb25zLmVsZW1lbnQuc3R5bGUuaGVpZ2h0ID0gYCR7dGhpcy5vcHRpb25zLmhlaWdodH1weGBcbiAgICAgIHRoaXMudHJpZ2dlckV2ZW50KEV2ZW50LlNIT1cpXG4gICAgICB0aGlzLnRyaWdnZXJFdmVudChFdmVudC5TSE9XTilcblxuICAgICAgcmV0dXJuIHRydWVcbiAgICB9XG5cbiAgICBoaWRlKCkge1xuICAgICAgdGhpcy5vcHRpb25zLmVsZW1lbnQuc3R5bGUuaGVpZ2h0ID0gJzBweCdcbiAgICAgIHRoaXMudHJpZ2dlckV2ZW50KEV2ZW50LkhJREUpXG4gICAgICB0aGlzLnRyaWdnZXJFdmVudChFdmVudC5ISURERU4pXG5cbiAgICAgIHJldHVybiB0cnVlXG4gICAgfVxuXG4gICAgc3RhdGljIGlkZW50aWZpZXIoKSB7XG4gICAgICByZXR1cm4gTkFNRVxuICAgIH1cblxuICAgIHN0YXRpYyBfRE9NSW50ZXJmYWNlKG9wdGlvbnMpIHtcbiAgICAgIHJldHVybiBzdXBlci5fRE9NSW50ZXJmYWNlKFByb2dyZXNzLCBvcHRpb25zKVxuICAgIH1cbiAgfVxuXG4gIHJldHVybiBQcm9ncmVzc1xufSkoKVxuXG5leHBvcnQgZGVmYXVsdCBQcm9ncmVzc1xuIiwiLyoqXG4gKiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICogTGljZW5zZWQgdW5kZXIgTUlUIChodHRwczovL2dpdGh1Yi5jb20vcXVhcmstZGV2L1Bob25vbi1GcmFtZXdvcmsvYmxvYi9tYXN0ZXIvTElDRU5TRSlcbiAqIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gKi9cbmltcG9ydCBDb21wb25lbnQgZnJvbSAnLi4vY29tcG9uZW50J1xuaW1wb3J0IHsgZ2V0QXR0cmlidXRlc0NvbmZpZyB9IGZyb20gJy4uL2NvbXBvbmVudE1hbmFnZXInXG5pbXBvcnQgRXZlbnQgZnJvbSAnLi4vLi4vY29tbW9uL2V2ZW50cydcbmltcG9ydCB7IGZpbmRUYXJnZXRCeUNsYXNzIH0gZnJvbSAnLi4vLi4vY29tbW9uL3V0aWxzJ1xuXG5jb25zdCBUYWIgPSAoKCkgPT4ge1xuICAvKipcbiAgICogLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAqIENvbnN0YW50c1xuICAgKiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICovXG5cbiAgY29uc3QgTkFNRSA9ICd0YWInXG4gIGNvbnN0IFZFUlNJT04gPSAnMi4wLjAnXG4gIGNvbnN0IERFRkFVTFRfUFJPUEVSVElFUyA9IHtcblxuICB9XG4gIGNvbnN0IERBVEFfQVRUUlNfUFJPUEVSVElFUyA9IFtcbiAgXVxuICBjb25zdCBUQUJfQ09OVEVOVF9TRUxFQ1RPUiA9ICcudGFiLXBhbmUnXG5cbiAgLyoqXG4gICAqIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgKiBDbGFzcyBEZWZpbml0aW9uXG4gICAqIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgKi9cblxuICBjbGFzcyBUYWIgZXh0ZW5kcyBDb21wb25lbnQge1xuXG4gICAgY29uc3RydWN0b3Iob3B0aW9ucyA9IHt9KSB7XG4gICAgICBzdXBlcihOQU1FLCBWRVJTSU9OLCBERUZBVUxUX1BST1BFUlRJRVMsIG9wdGlvbnMsIERBVEFfQVRUUlNfUFJPUEVSVElFUywgZmFsc2UsIGZhbHNlKVxuICAgIH1cblxuICAgIHNob3coKSB7XG4gICAgICBpZiAodGhpcy5vcHRpb25zLmVsZW1lbnQuY2xhc3NMaXN0LmNvbnRhaW5zKCdhY3RpdmUnKSkge1xuICAgICAgICByZXR1cm4gZmFsc2VcbiAgICAgIH1cblxuICAgICAgY29uc3QgaWQgPSB0aGlzLm9wdGlvbnMuZWxlbWVudC5nZXRBdHRyaWJ1dGUoJ2hyZWYnKVxuICAgICAgY29uc3QgbmF2ID0gZmluZFRhcmdldEJ5Q2xhc3ModGhpcy5vcHRpb25zLmVsZW1lbnQsICduYXYnKVxuICAgICAgY29uc3QgbmF2VGFicyA9IG5hdiA/IG5hdi5xdWVyeVNlbGVjdG9yQWxsKGBbZGF0YS10b2dnbGU9XCIke05BTUV9XCJdYCkgOiBudWxsXG5cbiAgICAgIGlmIChuYXZUYWJzKSB7XG4gICAgICAgIEFycmF5LmZyb20obmF2VGFicykuZm9yRWFjaCgodGFiKSA9PiB7XG4gICAgICAgICAgaWYgKHRhYi5jbGFzc0xpc3QuY29udGFpbnMoJ2FjdGl2ZScpKSB7XG4gICAgICAgICAgICB0YWIuY2xhc3NMaXN0LnJlbW92ZSgnYWN0aXZlJylcbiAgICAgICAgICB9XG4gICAgICAgICAgdGFiLnNldEF0dHJpYnV0ZSgnYXJpYS1zZWxlY3RlZCcsIGZhbHNlKVxuICAgICAgICB9KVxuICAgICAgfVxuXG4gICAgICB0aGlzLm9wdGlvbnMuZWxlbWVudC5jbGFzc0xpc3QuYWRkKCdhY3RpdmUnKVxuICAgICAgdGhpcy5vcHRpb25zLmVsZW1lbnQuc2V0QXR0cmlidXRlKCdhcmlhLXNlbGVjdGVkJywgdHJ1ZSlcblxuICAgICAgY29uc3QgdGFiQ29udGVudCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoaWQpXG4gICAgICBjb25zdCB0YWJDb250ZW50cyA9IHRhYkNvbnRlbnQucGFyZW50Tm9kZS5xdWVyeVNlbGVjdG9yQWxsKFRBQl9DT05URU5UX1NFTEVDVE9SKVxuXG4gICAgICBpZiAodGFiQ29udGVudHMpIHtcbiAgICAgICAgQXJyYXkuZnJvbSh0YWJDb250ZW50cykuZm9yRWFjaCgodGFiKSA9PiB7XG4gICAgICAgICAgaWYgKHRhYi5jbGFzc0xpc3QuY29udGFpbnMoJ2FjdGl2ZScpKSB7XG4gICAgICAgICAgICB0YWIuY2xhc3NMaXN0LnJlbW92ZSgnYWN0aXZlJylcbiAgICAgICAgICB9XG4gICAgICAgIH0pXG4gICAgICB9XG5cbiAgICAgIHRhYkNvbnRlbnQuY2xhc3NMaXN0LmFkZCgnc2hvd2luZycpXG5cbiAgICAgIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgICBjb25zdCBvblNob3dlZCA9ICgpID0+IHtcbiAgICAgICAgICB0YWJDb250ZW50LmNsYXNzTGlzdC5yZW1vdmUoJ2FuaW1hdGUnKVxuICAgICAgICAgIHRhYkNvbnRlbnQuY2xhc3NMaXN0LmFkZCgnYWN0aXZlJylcbiAgICAgICAgICB0YWJDb250ZW50LmNsYXNzTGlzdC5yZW1vdmUoJ3Nob3dpbmcnKVxuICAgICAgICAgIHRhYkNvbnRlbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcihFdmVudC5UUkFOU0lUSU9OX0VORCwgb25TaG93ZWQpXG4gICAgICAgIH1cblxuICAgICAgICB0YWJDb250ZW50LmFkZEV2ZW50TGlzdGVuZXIoRXZlbnQuVFJBTlNJVElPTl9FTkQsIG9uU2hvd2VkKVxuXG4gICAgICAgIHRhYkNvbnRlbnQuY2xhc3NMaXN0LmFkZCgnYW5pbWF0ZScpXG5cbiAgICAgIH0sIDIwKVxuXG4gICAgICByZXR1cm4gdHJ1ZVxuICAgIH1cblxuICAgIGhpZGUoKSB7XG4gICAgICBpZiAoIXRoaXMub3B0aW9ucy5lbGVtZW50LmNsYXNzTGlzdC5jb250YWlucygnYWN0aXZlJykpIHtcbiAgICAgICAgcmV0dXJuIGZhbHNlXG4gICAgICB9XG5cbiAgICAgIGlmICh0aGlzLm9wdGlvbnMuZWxlbWVudC5jbGFzc0xpc3QuY29udGFpbnMoJ2FjdGl2ZScpKSB7XG4gICAgICAgIHRoaXMub3B0aW9ucy5lbGVtZW50LmNsYXNzTGlzdC5yZW1vdmUoJ2FjdGl2ZScpXG4gICAgICB9XG5cbiAgICAgIHRoaXMub3B0aW9ucy5lbGVtZW50LnNldEF0dHJpYnV0ZSgnYXJpYS1zZWxlY3RlZCcsIGZhbHNlKVxuXG4gICAgICBjb25zdCBpZCA9IHRoaXMub3B0aW9ucy5lbGVtZW50LmdldEF0dHJpYnV0ZSgnaHJlZicpXG4gICAgICBjb25zdCB0YWJDb250ZW50ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihpZClcblxuICAgICAgaWYgKHRhYkNvbnRlbnQuY2xhc3NMaXN0LmNvbnRhaW5zKCdhY3RpdmUnKSkge1xuICAgICAgICB0YWJDb250ZW50LmNsYXNzTGlzdC5yZW1vdmUoJ2FjdGl2ZScpXG4gICAgICB9XG5cbiAgICAgIHJldHVybiB0cnVlXG4gICAgfVxuXG4gICAgc3RhdGljIGlkZW50aWZpZXIoKSB7XG4gICAgICByZXR1cm4gTkFNRVxuICAgIH1cblxuICAgIHN0YXRpYyBfRE9NSW50ZXJmYWNlKG9wdGlvbnMpIHtcbiAgICAgIHJldHVybiBzdXBlci5fRE9NSW50ZXJmYWNlKFRhYiwgb3B0aW9ucylcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAqIERPTSBBcGkgaW1wbGVtZW50YXRpb25cbiAgICogLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAqL1xuICBjb25zdCBjb21wb25lbnRzID0gW11cblxuICBjb25zdCB0YWJzID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChgW2RhdGEtdG9nZ2xlPVwiJHtOQU1FfVwiXWApXG4gIGlmICh0YWJzKSB7XG4gICAgQXJyYXkuZnJvbSh0YWJzKS5mb3JFYWNoKChlbGVtZW50KSA9PiB7XG4gICAgICAvLyBjb25zdCBjb25maWcgPSB7fVxuICAgICAgY29uc3QgY29uZmlnID0gZ2V0QXR0cmlidXRlc0NvbmZpZyhlbGVtZW50LCBERUZBVUxUX1BST1BFUlRJRVMsIERBVEFfQVRUUlNfUFJPUEVSVElFUylcbiAgICAgIGNvbmZpZy5lbGVtZW50ID0gZWxlbWVudFxuXG4gICAgICBjb21wb25lbnRzLnB1c2goVGFiLl9ET01JbnRlcmZhY2UoY29uZmlnKSlcbiAgICB9KVxuICB9XG5cbiAgaWYgKHRhYnMpIHtcbiAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIChldmVudCkgPT4ge1xuICAgICAgY29uc3QgZGF0YVRvZ2dsZUF0dHIgPSBldmVudC50YXJnZXQuZ2V0QXR0cmlidXRlKCdkYXRhLXRvZ2dsZScpXG4gICAgICBpZiAoZGF0YVRvZ2dsZUF0dHIgJiYgZGF0YVRvZ2dsZUF0dHIgPT09IE5BTUUpIHtcbiAgICAgICAgY29uc3QgaWQgPSBldmVudC50YXJnZXQuZ2V0QXR0cmlidXRlKCdocmVmJylcblxuICAgICAgICBjb25zdCBjb21wb25lbnQgPSBjb21wb25lbnRzLmZpbmQoYyA9PiBjLmdldEVsZW1lbnQoKS5nZXRBdHRyaWJ1dGUoJ2hyZWYnKSA9PT0gaWQpXG5cbiAgICAgICAgaWYgKCFjb21wb25lbnQpIHtcbiAgICAgICAgICByZXR1cm5cbiAgICAgICAgfVxuXG4gICAgICAgIGNvbXBvbmVudC5zaG93KClcbiAgICAgIH1cbiAgICB9KVxuICB9XG5cbiAgcmV0dXJuIFRhYlxufSkoKVxuXG5leHBvcnQgZGVmYXVsdCBUYWJcbiIsIi8qKlxuKiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuKiBMaWNlbnNlZCB1bmRlciBNSVQgKGh0dHBzOi8vZ2l0aHViLmNvbS9xdWFyay1kZXYvUGhvbm9uLUZyYW1ld29yay9ibG9iL21hc3Rlci9MSUNFTlNFKVxuKiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuKi9cblxuY29uc3QgQmluZGVyID0gKCgpID0+IHtcbiAgLyoqXG4gICogLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICogQ29uc3RhbnRzXG4gICogLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICovXG5cbiAgY29uc3QgTkFNRSA9ICdpbnRsLWJpbmRlcidcbiAgY29uc3QgVkVSU0lPTiA9ICcyLjAuMCdcblxuICAvKipcbiAgICogLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAqIENsYXNzIERlZmluaXRpb25cbiAgICogLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAqL1xuXG4gIGNsYXNzIEJpbmRlciB7XG4gICAgY29uc3RydWN0b3IoZWxlbWVudCwgZGF0YSkge1xuICAgICAgdGhpcy5lbGVtZW50ID0gZWxlbWVudFxuICAgICAgdGhpcy5kYXRhID0gZGF0YVxuXG4gICAgICBpZiAoIXRoaXMuaXNFbGVtZW50KHRoaXMuZWxlbWVudCkpIHtcbiAgICAgICAgcmV0dXJuXG4gICAgICB9XG5cbiAgICAgIC8vIGFycmF5IG9mIEhUTUxFbGVtZW50XG4gICAgICBpZiAodGhpcy5lbGVtZW50Lmxlbmd0aCAmJiB0aGlzLmVsZW1lbnQubGVuZ3RoID4gMCkge1xuICAgICAgICB0aGlzLnNldE5vZGVzKHRoaXMuZWxlbWVudClcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIC8vIHNpbmdsZSBIVE1MRWxlbWVudFxuICAgICAgICB0aGlzLnNldE5vZGUodGhpcy5lbGVtZW50KVxuICAgICAgfVxuICAgIH1cblxuICAgIC8vIGdldHRlcnNcblxuICAgIHN0YXRpYyBnZXQgdmVyc2lvbigpIHtcbiAgICAgIHJldHVybiBgJHtOQU1FfS4ke1ZFUlNJT059YFxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIENoZWNrcyBpZiB0aGUgZ2l2ZW4gYXJndW1lbnQgaXMgYSBET00gZWxlbWVudFxuICAgICAqIEBwYXJhbSB7SFRNTEVsZW1lbnR9IHRoZSBhcmd1bWVudCB0byB0ZXN0XG4gICAgICogQHJldHVybiB7Ym9vbGVhbn0gdHJ1ZSBpZiB0aGUgb2JqZWN0IGlzIGEgRE9NIGVsZW1lbnQsIGZhbHNlIG90aGVyd2lzZVxuICAgICAqL1xuICAgIGlzRWxlbWVudChlbGVtZW50KSB7XG4gICAgICBpZiAoZWxlbWVudCA9PT0gbnVsbCkge1xuICAgICAgICByZXR1cm4gZmFsc2VcbiAgICAgIH1cbiAgICAgIHJldHVybiAodHlwZW9mIE5vZGUgPT09ICdvYmplY3QnID8gZWxlbWVudCBpbnN0YW5jZW9mIE5vZGUgOiBlbGVtZW50ICYmIHR5cGVvZiBlbGVtZW50ID09PSAnb2JqZWN0JyAmJiB0eXBlb2YgZWxlbWVudC5ub2RlVHlwZSA9PT0gJ251bWJlcicgJiYgdHlwZW9mIGVsZW1lbnQubm9kZU5hbWUgPT09ICdzdHJpbmcnKVxuICAgIH1cblxuICAgIC8qKlxuICAgICogQmluZHMgc29tZSB0ZXh0IHRvIHRoZSBnaXZlbiBET00gZWxlbWVudFxuICAgICogQHBhcmFtIHtIVE1MRWxlbWVudH0gZWxlbWVudFxuICAgICogQHBhcmFtIHtTdHJpbmd9IHRleHRcbiAgICAqL1xuICAgIHNldFRleHQoZWxlbWVudCwgdGV4dCkge1xuICAgICAgaWYgKCEoJ3RleHRDb250ZW50JyBpbiBlbGVtZW50KSkge1xuICAgICAgICBlbGVtZW50LmlubmVyVGV4dCA9IHRleHRcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGVsZW1lbnQudGV4dENvbnRlbnQgPSB0ZXh0XG4gICAgICB9XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQmluZHMgc29tZSBodG1sIHRvIHRoZSBnaXZlbiBET00gZWxlbWVudFxuICAgICAqIEBwYXJhbSB7SFRNTEVsZW1lbnR9IGVsZW1lbnRcbiAgICAgKiBAcGFyYW0ge3N0cmluZ30gdGV4dFxuICAgICAqL1xuICAgIHNldEh0bWwoZWxlbWVudCwgdGV4dCkge1xuICAgICAgZWxlbWVudC5pbm5lckhUTUwgPSB0ZXh0XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQmluZHMgY3VzdG9tIGF0dHJpYnV0ZXMgdG8gdGhlIGdpdmVuIERPTSBlbGVtZW50XG4gICAgICogQHBhcmFtIHtIVE1MRWxlbWVudH0gZWxlbWVudFxuICAgICAqIEBwYXJhbSB7U3RyaW5nfSBhdHRyXG4gICAgICogQHBhcmFtIHtTdHJpbmd9IHRleHRcbiAgICAgKi9cbiAgICBzZXRBdHRyaWJ1dGUoZWxlbWVudCwgYXR0ciwgdGV4dCkge1xuICAgICAgZWxlbWVudC5zZXRBdHRyaWJ1dGUoYXR0ciwgdGV4dClcbiAgICB9XG5cbiAgICBzZXROb2RlKGVsZW1lbnQpIHtcbiAgICAgIGxldCBhdHRyID0gZWxlbWVudC5nZXRBdHRyaWJ1dGUoJ2RhdGEtaTE4bicpXG4gICAgICBpZiAoIWF0dHIpIHtcbiAgICAgICAgcmV0dXJuXG4gICAgICB9XG5cbiAgICAgIGF0dHIgPSBhdHRyLnRyaW0oKVxuXG4gICAgICBjb25zdCByID0gLyg/Olxcc3xeKShbQS1aYS16LV8wLTldKyk6XFxzKiguKj8pKD89XFxzK1xcdys6fCQpL2dcbiAgICAgIGxldCBtXG5cbiAgICAgIHdoaWxlIChtID0gci5leGVjKGF0dHIpKSB7XG4gICAgICAgIGNvbnN0IGtleSA9IG1bMV0udHJpbSgpXG4gICAgICAgIGNvbnN0IHZhbHVlID0gbVsyXS50cmltKCkucmVwbGFjZSgnLCcsICcnKVxuICAgICAgICBsZXQgaW50bFZhbHVlID0gdGhpcy5kYXRhW3ZhbHVlXVxuXG4gICAgICAgIGlmICghdGhpcy5kYXRhW3ZhbHVlXSkge1xuICAgICAgICAgIGNvbnNvbGUubG9nKGAke05BTUV9LiBXYXJuaW5nLCAke3ZhbHVlfSBkb2VzIG5vdCBleGlzdC5gKVxuICAgICAgICAgIGludGxWYWx1ZSA9IHZhbHVlXG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCBtZXRob2ROYW1lID0gJ3NldCcgKyBrZXkuY2hhckF0KDApLnRvVXBwZXJDYXNlKCkgKyBrZXkuc2xpY2UoMSlcblxuICAgICAgICBpZiAodGhpc1ttZXRob2ROYW1lXSkge1xuICAgICAgICAgIHRoaXNbbWV0aG9kTmFtZV0oZWxlbWVudCwgaW50bFZhbHVlKVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHRoaXMuc2V0QXR0cmlidXRlKGVsZW1lbnQsIGtleSwgaW50bFZhbHVlKVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuXG4gICAgLyoqXG4gICAgKiBTZXQgdmFsdWVzIHRvIERPTSBub2Rlc1xuICAgICovXG4gICAgc2V0Tm9kZXMoZWxlbWVudCkge1xuICAgICAgQXJyYXkuZnJvbShlbGVtZW50KS5mb3JFYWNoKGVsID0+IHRoaXMuc2V0Tm9kZShlbCkpXG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIEJpbmRlclxufSkoKVxuXG5leHBvcnQgZGVmYXVsdCBCaW5kZXJcbiIsIi8qKlxuICogLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAqIExpY2Vuc2VkIHVuZGVyIE1JVCAoaHR0cHM6Ly9naXRodWIuY29tL3F1YXJrLWRldi9QaG9ub24tRnJhbWV3b3JrL2Jsb2IvbWFzdGVyL0xJQ0VOU0UpXG4gKiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICovXG5pbXBvcnQgQmluZGVyIGZyb20gJy4vYmluZGVyJ1xuXG5jb25zdCBJbnRsID0gKCgpID0+IHtcbiAgLyoqXG4gICAqIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgKiBDb25zdGFudHNcbiAgICogLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAqL1xuXG4gIGNvbnN0IE5BTUUgPSAnSW50bCdcbiAgY29uc3QgVkVSU0lPTiA9ICcyLjAuMCdcbiAgY29uc3QgREVGQVVMVF9QUk9QRVJUSUVTID0ge1xuICAgIGZhbGxiYWNrTG9jYWxlOiAnZW4nLFxuICAgIGxvY2FsZTogJ2VuJyxcbiAgICBhdXRvQmluZDogdHJ1ZSxcbiAgICBkYXRhOiBudWxsLFxuICB9XG5cbiAgLyoqXG4gICAqIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgKiBDbGFzcyBEZWZpbml0aW9uXG4gICAqIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgKi9cblxuICBjbGFzcyBJbnRsIHtcbiAgICAvKipcbiAgICAgKiBDcmVhdGVzIGFuIGluc3RhbmNlIG9mIEludGwuXG4gICAgICogQHBhcmFtIHtmYWxsYmFja0xvY2FsZTogc3RyaW5nLCBsb2NhbGU6IHN0cmluZywgYXV0b0JpbmQ6IGJvb2xlYW4sIGRhdGE6IHtbbGFuZzogc3RyaW5nXToge1trZXk6IHN0cmluZ106IHN0cmluZ319fVxuICAgICAqL1xuICAgIGNvbnN0cnVjdG9yKG9wdGlvbnMgPSB7fSkge1xuICAgICAgdGhpcy5vcHRpb25zID0gT2JqZWN0LmFzc2lnbihERUZBVUxUX1BST1BFUlRJRVMsIG9wdGlvbnMpXG5cbiAgICAgIGlmICh0eXBlb2YgdGhpcy5vcHRpb25zLmZhbGxiYWNrTG9jYWxlICE9PSAnc3RyaW5nJykge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYCR7TkFNRX0uIFRoZSBmYWxsYmFjayBsb2NhbGUgaXMgbWFuZGF0b3J5IGFuZCBtdXN0IGJlIGEgc3RyaW5nLmApXG4gICAgICB9XG5cbiAgICAgIGlmICh0aGlzLm9wdGlvbnMuZGF0YSA9PT0gbnVsbCkge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYCR7TkFNRX0uIFRoZXJlIGlzIG5vIHRyYW5zbGF0aW9uIGRhdGEuYClcbiAgICAgIH1cblxuICAgICAgaWYgKHR5cGVvZiB0aGlzLm9wdGlvbnMuZGF0YVt0aGlzLm9wdGlvbnMuZmFsbGJhY2tMb2NhbGVdICE9PSAnb2JqZWN0Jykge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYCR7TkFNRX0uIFRoZSBmYWxsYmFjayBsb2NhbGUgbXVzdCBuZWNlc3NhcmlseSBoYXZlIHRyYW5zbGF0aW9uIGRhdGEuYClcbiAgICAgIH1cblxuICAgICAgdGhpcy5zZXRMb2NhbGUodGhpcy5vcHRpb25zLmxvY2FsZSwgdGhpcy5vcHRpb25zLmF1dG9CaW5kKVxuICAgIH1cblxuICAgIHN0YXRpYyBnZXQgdmVyc2lvbigpIHtcbiAgICAgIHJldHVybiBgJHtOQU1FfS4ke1ZFUlNJT059YFxuICAgIH1cblxuICAgIGdldExvY2FsZSgpIHtcbiAgICAgIHJldHVybiB0aGlzLm9wdGlvbnMubG9jYWxlXG4gICAgfVxuXG4gICAgZ2V0RmFsbGJhY2tMb2NhbGUoKSB7XG4gICAgICByZXR1cm4gdGhpcy5vcHRpb25zLmZhbGxiYWNrTG9jYWxlXG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogU2V0IGRlZmF1bHQgbG9jYWxlXG4gICAgICogQHBhcmFtIHtzdHJpbmd9IGxvY2FsZVxuICAgICAqIEBwYXJhbSB7Ym9vbGVhbn0gW3VwZGF0ZUhUTUw9dHJ1ZV1cbiAgICAgKi9cbiAgICBzZXRMb2NhbGUobG9jYWxlLCB1cGRhdGVIVE1MID0gdHJ1ZSkge1xuICAgICAgaWYgKHR5cGVvZiB0aGlzLm9wdGlvbnMuZGF0YVtsb2NhbGVdICE9PSAnb2JqZWN0Jykge1xuICAgICAgICBjb25zb2xlLmVycm9yKGAke05BTUV9LiAke2xvY2FsZX0gaGFzIG5vIGRhdGEsIGZhbGxiYWNrIGluICR7dGhpcy5vcHRpb25zLmZhbGxiYWNrTG9jYWxlfS5gKVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy5vcHRpb25zLmxvY2FsZSA9IGxvY2FsZVxuICAgICAgfVxuXG4gICAgICBpZiAodXBkYXRlSFRNTCkge1xuICAgICAgICB0aGlzLnVwZGF0ZUh0bWwoKVxuICAgICAgfVxuICAgIH1cblxuICAgIGdldExhbmd1YWdlcygpIHtcbiAgICAgIHJldHVybiBPYmplY3Qua2V5cyh0aGlzLm9wdGlvbnMuZGF0YSlcbiAgICB9XG5cbiAgICBpbnNlcnRWYWx1ZXModmFsdWUgPSBudWxsLCBpbmplY3RhYmxlVmFsdWVzID0ge30pIHtcbiAgICAgIGlmICh0eXBlb2YgdmFsdWUgIT09ICdzdHJpbmcnKSB7XG4gICAgICAgIHJldHVybiB1bmRlZmluZWRcbiAgICAgIH1cblxuICAgICAgY29uc3QgbWF0Y2ggPSB2YWx1ZS5tYXRjaCgvOihbYS16QS1aLV8wLTldKykvKVxuICAgICAgaWYgKG1hdGNoKSB7XG4gICAgICAgIHZhbHVlID0gdmFsdWUucmVwbGFjZShtYXRjaFswXSwgaW5qZWN0YWJsZVZhbHVlc1ttYXRjaFsxXV0pXG4gICAgICB9XG5cbiAgICAgIGlmICh2YWx1ZS5tYXRjaCgvOihbYS16QS1aLV8wLTldKykvKSkge1xuICAgICAgICByZXR1cm4gdGhpcy5pbnNlcnRWYWx1ZXModmFsdWUsIGluamVjdGFibGVWYWx1ZXMpXG4gICAgICB9XG5cbiAgICAgIHJldHVybiB2YWx1ZVxuICAgIH1cblxuICAgIHRyYW5zbGF0ZShrZXlOYW1lID0gbnVsbCwgaW5qZWN0ID0ge30pIHtcbiAgICAgIGxldCBkYXRhID0gdGhpcy5vcHRpb25zLmRhdGFbdGhpcy5vcHRpb25zLmxvY2FsZV1cbiAgICAgIGlmICghZGF0YSkge1xuICAgICAgICBkYXRhID0gdGhpcy5vcHRpb25zLmRhdGFbdGhpcy5vcHRpb25zLmZhbGxiYWNrTG9jYWxlXVxuICAgICAgfVxuXG4gICAgICBpZiAoa2V5TmFtZSA9PT0gbnVsbCB8fCBrZXlOYW1lID09PSAnKicgfHwgQXJyYXkuaXNBcnJheShrZXlOYW1lKSkge1xuICAgICAgICBpZiAoQXJyYXkuaXNBcnJheShrZXlOYW1lKSkge1xuICAgICAgICAgIGNvbnN0IGtleXMgPSBPYmplY3Qua2V5cyhkYXRhKS5maWx0ZXIoa2V5ID0+IGtleU5hbWUuaW5kZXhPZihrZXkpID4gLTEpXG4gICAgICAgICAgY29uc3QgZmlsdGVyZWREYXRhID0ge31cbiAgICAgICAgICBrZXlzLmZvckVhY2goa2V5ID0+IHtcbiAgICAgICAgICAgIGZpbHRlcmVkRGF0YVtrZXldID0gdGhpcy5pbnNlcnRWYWx1ZXMoZGF0YVtrZXldLCBpbmplY3QpXG4gICAgICAgICAgfSlcbiAgICAgICAgICBkYXRhID0gZmlsdGVyZWREYXRhXG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCBkYXRhTWFwID0ge31cbiAgICAgICAgZm9yIChjb25zdCBrZXkgaW4gZGF0YSkge1xuICAgICAgICAgIGRhdGFNYXBba2V5XSA9IHRoaXMuaW5zZXJ0VmFsdWVzKGRhdGFba2V5XSwgaW5qZWN0KVxuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIGRhdGFNYXBcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIHRoaXMuaW5zZXJ0VmFsdWVzKGRhdGFba2V5TmFtZV0sIGluamVjdClcbiAgICB9XG5cbiAgICAvLyBhbGlhcyBvZiB0KClcbiAgICB0KGtleU5hbWUgPSBudWxsLCBpbmplY3QgPSB7fSkge1xuICAgICAgcmV0dXJuIHRoaXMudHJhbnNsYXRlKGtleU5hbWUsIGluamVjdClcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBVcGRhdGVzIHRoZSBIVE1MIHZpZXdzXG4gICAgICogQHBhcmFtIHtIVE1MRWxlbWVudH0gZWxlbWVudFxuICAgICAqL1xuICAgIHVwZGF0ZUh0bWwoZWxlbWVudCkge1xuICAgICAgaWYgKHR5cGVvZiBlbGVtZW50ID09PSAndW5kZWZpbmVkJykge1xuICAgICAgICBlbGVtZW50ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnW2RhdGEtaTE4bl0nKVxuICAgICAgfVxuXG4gICAgICBpZiAodHlwZW9mIGVsZW1lbnQgPT09ICdzdHJpbmcnKSB7XG4gICAgICAgIGVsZW1lbnQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKGVsZW1lbnQpXG4gICAgICB9XG5cbiAgICAgIG5ldyBCaW5kZXIoZWxlbWVudCwgdGhpcy50KCkpXG4gICAgfVxuXG4gICAgLy8gc3RhdGljXG4gICAgc3RhdGljIF9ET01JbnRlcmZhY2Uob3B0aW9ucykge1xuICAgICAgcmV0dXJuIG5ldyBJbnRsKG9wdGlvbnMpXG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIEludGxcbn0pKClcblxuZXhwb3J0IGRlZmF1bHQgSW50bFxuIiwiLyoqXG4gKiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICogTGljZW5zZWQgdW5kZXIgTUlUIChodHRwczovL2dpdGh1Yi5jb20vcXVhcmstZGV2L1Bob25vbi1GcmFtZXdvcmsvYmxvYi9tYXN0ZXIvTElDRU5TRSlcbiAqIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gKi9cblxuaW1wb3J0IFBhZ2UgZnJvbSAnLi9wYWdlJ1xuaW1wb3J0IEV2ZW50IGZyb20gJy4uLy4uL2NvbW1vbi9ldmVudHMnXG5cbmNvbnN0IFBhZ2VyID0gKCgpID0+IHtcbiAgLyoqXG4gICAqIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgKiBDb25zdGFudHNcbiAgICogLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAqL1xuXG4gIGNvbnN0IE5BTUUgPSAncGFnZXInXG4gIGNvbnN0IFZFUlNJT04gPSAnMi4wLjAnXG4gIGNvbnN0IERFRkFVTFRfUFJPUEVSVElFUyA9IHtcbiAgICBoYXNoUHJlZml4OiAnIyEnLFxuICAgIHVzZUhhc2g6IHRydWUsXG4gICAgZGVmYXVsdFBhZ2U6IG51bGwsXG4gICAgYW5pbWF0ZVBhZ2VzOiB0cnVlLFxuICB9XG5cbiAgbGV0IGN1cnJlbnRQYWdlXG4gIC8qKlxuICAgKiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICogQ2xhc3MgRGVmaW5pdGlvblxuICAgKiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICovXG5cbiAgY2xhc3MgUGFnZXIge1xuICAgIC8qKlxuICAgICAqIEBjb25zdHJ1Y3RvclxuICAgICAqXG4gICAgICogQHBhcmFtIG9wdGlvbnMge09iamVjdH1cbiAgICAgKi9cbiAgICBjb25zdHJ1Y3RvcihvcHRpb25zID0ge30pIHtcbiAgICAgIHRoaXMub3B0aW9ucyA9IE9iamVjdC5hc3NpZ24oREVGQVVMVF9QUk9QRVJUSUVTLCBvcHRpb25zKVxuXG4gICAgICB0aGlzLnBhZ2VzID0gW11cbiAgICAgIHRoaXMuc3RhcnRlZCA9IGZhbHNlXG5cbiAgICAgIC8vIGFkZCBnbG9iYWwgbGlzdGVuZXJzIHN1Y2ggYXNoIGhhc2ggY2hhbmdlLCBuYXZpZ2F0aW9uLCBldGMuXG4gICAgICB0aGlzLmFkZFBhZ2VyRXZlbnRzKClcblxuICAgICAgLy8gZmFzdGVyIHdheSB0byBpbml0IHBhZ2VzIGJlZm9yZSB0aGUgRE9NIGlzIHJlYWR5XG4gICAgICB0aGlzLm9uRE9NTG9hZGVkKClcbiAgICB9XG5cbiAgICAvLyBwcml2YXRlXG4gICAgXyhzZWxlY3Rvcikge1xuICAgICAgcmV0dXJuIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3Ioc2VsZWN0b3IpXG4gICAgfVxuXG4gICAgZ2V0SGFzaCgpIHtcbiAgICAgIHJldHVybiB3aW5kb3cubG9jYXRpb24uaGFzaC5zcGxpdCh0aGlzLm9wdGlvbnMuaGFzaFByZWZpeClbMV1cbiAgICB9XG5cbiAgICBnZXRQYWdlRnJvbUhhc2goKSB7XG4gICAgICBjb25zdCBoYXNoID0gdGhpcy5nZXRIYXNoKClcbiAgICAgIGNvbnN0IHJlID0gbmV3IFJlZ0V4cCgnWz9cXC9dKFteXFwvXSopJylcbiAgICAgIGNvbnN0IG1hdGNoZXMgPSByZS5leGVjKGhhc2gpXG5cbiAgICAgIGlmIChtYXRjaGVzICYmIG1hdGNoZXNbMV0pIHtcbiAgICAgICAgcmV0dXJuIG1hdGNoZXNbMV1cbiAgICAgIH1cblxuICAgICAgcmV0dXJuIG51bGxcbiAgICB9XG5cbiAgICBzZXRIYXNoKHBhZ2VOYW1lKSB7XG4gICAgICB3aW5kb3cubG9jYXRpb24uaGFzaCA9IGAke3RoaXMub3B0aW9ucy5oYXNoUHJlZml4fS8ke3BhZ2VOYW1lfWBcbiAgICB9XG5cbiAgICBhcmVTYW1lUGFnZShwYWdlTmFtZTEsIHBhZ2VOYW1lMikge1xuICAgICAgY29uc3QgcGFnZTEgPSB0aGlzLmdldFBhZ2VNb2RlbChwYWdlTmFtZTEpXG4gICAgICBjb25zdCBwYWdlMiA9IHRoaXMuZ2V0UGFnZU1vZGVsKHBhZ2VOYW1lMilcbiAgICAgIHJldHVybiBwYWdlMSAmJiBwYWdlMiAmJiBwYWdlMS5uYW1lID09PSBwYWdlMi5uYW1lXG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQXR0YWNoZXMgdGhlIG1haW4gZXZlbnRzIGZvciB0cmFja2luZyBoYXNoIGNoYW5nZXMsXG4gICAgICogY2xpY2sgb24gbmF2aWdhdGlvbiBidXR0b25zIGFuZCBsaW5rcyBhbmQgYmFjayBoaXN0b3J5XG4gICAgICovXG4gICAgYWRkUGFnZXJFdmVudHMoKSB7XG4gICAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGV2ZW50ID0+IHRoaXMub25DbGljayhldmVudCkpXG4gICAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcigncG9wc3RhdGUnLCBldmVudCA9PiB0aGlzLm9uQmFja0hpc3RvcnkoZXZlbnQpKVxuICAgICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ2hhc2hjaGFuZ2UnLCBldmVudCA9PiB0aGlzLm9uSGFzaENoYW5nZShldmVudCkpXG4gICAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdET01Db250ZW50TG9hZGVkJywgZXZlbnQgPT4gdGhpcy5vbkRPTUxvYWRlZChldmVudCkpXG4gICAgfVxuXG4gICAgLy8gZ2V0dGVyc1xuXG4gICAgc3RhdGljIGdldCB2ZXJzaW9uKCkge1xuICAgICAgcmV0dXJuIGAke05BTUV9LiR7VkVSU0lPTn1gXG4gICAgfVxuXG4gICAgLy8gcHVibGljXG5cbiAgICBzaG93UGFnZShwYWdlTmFtZSwgYWRkVG9IaXN0b3J5ID0gdHJ1ZSwgYmFjayA9IGZhbHNlKSB7XG4gICAgICBjb25zdCBvbGRQYWdlID0gdGhpcy5fKCcuY3VycmVudCcpXG4gICAgICBpZiAob2xkUGFnZSkge1xuICAgICAgICBjb25zdCBvbGRQYWdlTmFtZSA9IG9sZFBhZ2UuZ2V0QXR0cmlidXRlKCdkYXRhLXBhZ2UnKVxuXG4gICAgICAgIGlmICh0aGlzLmFyZVNhbWVQYWdlKHBhZ2VOYW1lLCBvbGRQYWdlTmFtZSkpIHtcbiAgICAgICAgICByZXR1cm5cbiAgICAgICAgfVxuXG4gICAgICAgIG9sZFBhZ2UuY2xhc3NMaXN0LnJlbW92ZSgnY3VycmVudCcpXG5cbiAgICAgICAgLy8gaGlzdG9yeVxuICAgICAgICB3aW5kb3cuaGlzdG9yeS5yZXBsYWNlU3RhdGUoeyBwYWdlOiBvbGRQYWdlTmFtZSB9LCBvbGRQYWdlTmFtZSwgd2luZG93LmxvY2F0aW9uLmhyZWYpXG5cbiAgICAgICAgdGhpcy50cmlnZ2VyUGFnZUV2ZW50KG9sZFBhZ2VOYW1lLCBFdmVudC5ISURFKVxuICAgICAgfVxuXG4gICAgICB0aGlzLnRyaWdnZXJQYWdlRXZlbnQocGFnZU5hbWUsIEV2ZW50LlNIT1cpXG5cbiAgICAgIGN1cnJlbnRQYWdlID0gcGFnZU5hbWVcblxuICAgICAgLy8gbmV3IHBhZ2VcbiAgICAgIGNvbnN0IG5ld1BhZ2UgPSB0aGlzLl8oYFtkYXRhLXBhZ2U9XCIke3BhZ2VOYW1lfVwiXWApXG5cbiAgICAgIG5ld1BhZ2UuY2xhc3NMaXN0LmFkZCgnY3VycmVudCcpXG5cbiAgICAgIC8vIHRlbXBsYXRlIGxvYWRlclxuICAgICAgY29uc3QgcGFnZU1vZGVsID0gdGhpcy5nZXRQYWdlTW9kZWwocGFnZU5hbWUpXG5cbiAgICAgIC8vIEB0b2RvOiB1c2UgdGVtcGxhdGUgY2FjaGU/XG4gICAgICBpZiAocGFnZU1vZGVsICYmIHBhZ2VNb2RlbC5nZXRUZW1wbGF0ZSgpKSB7XG4gICAgICAgIHBhZ2VNb2RlbC5sb2FkVGVtcGxhdGUoKVxuICAgICAgfVxuICAgICAgLy8gZW5kXG5cbiAgICAgIGlmIChvbGRQYWdlKSB7XG4gICAgICAgIGNvbnN0IG9sZFBhZ2VOYW1lID0gb2xkUGFnZS5nZXRBdHRyaWJ1dGUoJ2RhdGEtcGFnZScpXG4gICAgICAgIC8vIHVzZSBvZiBwcm90b3R5cGUtb3JpZW50ZWQgbGFuZ3VhZ2VcbiAgICAgICAgb2xkUGFnZS5iYWNrID0gYmFja1xuICAgICAgICBvbGRQYWdlLnByZXZpb3VzUGFnZU5hbWUgPSBvbGRQYWdlTmFtZVxuXG4gICAgICAgIGNvbnN0IG9uUGFnZUFuaW1hdGlvbkVuZCA9ICgpID0+IHtcbiAgICAgICAgICBpZiAob2xkUGFnZS5jbGFzc0xpc3QuY29udGFpbnMoJ2FuaW1hdGUnKSkge1xuICAgICAgICAgICAgb2xkUGFnZS5jbGFzc0xpc3QucmVtb3ZlKCdhbmltYXRlJylcbiAgICAgICAgICB9XG5cbiAgICAgICAgICBvbGRQYWdlLmNsYXNzTGlzdC5yZW1vdmUob2xkUGFnZS5iYWNrID8gJ3BvcC1wYWdlJyA6ICdwdXNoLXBhZ2UnKVxuXG4gICAgICAgICAgdGhpcy50cmlnZ2VyUGFnZUV2ZW50KGN1cnJlbnRQYWdlLCBFdmVudC5TSE9XTilcbiAgICAgICAgICB0aGlzLnRyaWdnZXJQYWdlRXZlbnQob2xkUGFnZS5wcmV2aW91c1BhZ2VOYW1lLCBFdmVudC5ISURERU4pXG5cbiAgICAgICAgICBvbGRQYWdlLnJlbW92ZUV2ZW50TGlzdGVuZXIoRXZlbnQuQU5JTUFUSU9OX0VORCwgb25QYWdlQW5pbWF0aW9uRW5kKVxuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHRoaXMub3B0aW9ucy5hbmltYXRlUGFnZXMpIHtcbiAgICAgICAgICBvbGRQYWdlLmFkZEV2ZW50TGlzdGVuZXIoRXZlbnQuQU5JTUFUSU9OX0VORCwgb25QYWdlQW5pbWF0aW9uRW5kKVxuICAgICAgICAgIG9sZFBhZ2UuY2xhc3NMaXN0LmFkZCgnYW5pbWF0ZScpXG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgb25QYWdlQW5pbWF0aW9uRW5kKClcbiAgICAgICAgfVxuXG4gICAgICAgIG9sZFBhZ2UuY2xhc3NMaXN0LmFkZChiYWNrID8gJ3BvcC1wYWdlJyA6ICdwdXNoLXBhZ2UnKVxuICAgICAgfVxuICAgIH1cblxuICAgIGFkZFVuaXF1ZVBhZ2VNb2RlbChwYWdlTmFtZSkge1xuICAgICAgaWYgKCF0aGlzLmdldFBhZ2VNb2RlbChwYWdlTmFtZSkpIHtcbiAgICAgICAgdGhpcy5wYWdlcy5wdXNoKG5ldyBQYWdlKHBhZ2VOYW1lKSlcbiAgICAgIH1cbiAgICB9XG5cbiAgICBnZXRQYWdlTW9kZWwocGFnZU5hbWUpIHtcbiAgICAgIHJldHVybiB0aGlzLnBhZ2VzLmZpbmQocGFnZSA9PiBwYWdlLm5hbWUgPT09IHBhZ2VOYW1lKVxuICAgIH1cblxuICAgIGdldFBhZ2VzTW9kZWwocGFnZU5hbWVzKSB7XG4gICAgICByZXR1cm4gdGhpcy5wYWdlcy5maWx0ZXIocGFnZSA9PiBwYWdlTmFtZXMuaW5kZXhPZihwYWdlLm5hbWUpID4gLTEpXG4gICAgfVxuXG4gICAgc2VsZWN0b3JUb0FycmF5KHN0cikge1xuICAgICAgcmV0dXJuIHN0ci5zcGxpdCgnLCcpLm1hcChpdGVtID0+IGl0ZW0udHJpbSgpKVxuICAgIH1cblxuICAgIGFkZEV2ZW50cyhjYWxsYmFjaykge1xuICAgICAgaWYgKHRoaXMuY2FjaGVQYWdlU2VsZWN0b3IgPT09ICcqJykge1xuICAgICAgICAvLyBhZGQgdG8gYWxsIHBhZ2UgbW9kZWxzXG4gICAgICAgIHRoaXMucGFnZXMuZm9yRWFjaCgocGFnZSkgPT4ge1xuICAgICAgICAgIHBhZ2UuYWRkRXZlbnRDYWxsYmFjayhjYWxsYmFjaylcbiAgICAgICAgfSlcbiAgICAgICAgcmV0dXJuXG4gICAgICB9XG5cbiAgICAgIGNvbnN0IHBhZ2VNb2RlbHMgPSB0aGlzLmdldFBhZ2VzTW9kZWwodGhpcy5zZWxlY3RvclRvQXJyYXkodGhpcy5jYWNoZVBhZ2VTZWxlY3RvciksIHRydWUpXG4gICAgICBwYWdlTW9kZWxzLmZvckVhY2goKHBhZ2UpID0+IHtcbiAgICAgICAgcGFnZS5hZGRFdmVudENhbGxiYWNrKGNhbGxiYWNrKVxuICAgICAgfSlcbiAgICAgIHRoaXMuY2FjaGVQYWdlU2VsZWN0b3IgPSBudWxsXG4gICAgfVxuXG4gICAgdXNlVGVtcGxhdGUodGVtcGxhdGVQYXRoLCByZW5kZXJGdW5jdGlvbiA9IG51bGwpIHtcbiAgICAgIGNvbnN0IHBhZ2VNb2RlbHMgPSB0aGlzLmdldFBhZ2VzTW9kZWwodGhpcy5zZWxlY3RvclRvQXJyYXkodGhpcy5jYWNoZVBhZ2VTZWxlY3RvciksIHRydWUpXG4gICAgICBwYWdlTW9kZWxzLmZvckVhY2goKHBhZ2UpID0+IHtcbiAgICAgICAgcGFnZS51c2VUZW1wbGF0ZSh0ZW1wbGF0ZVBhdGgpXG4gICAgICAgIGlmICh0eXBlb2YgcmVuZGVyRnVuY3Rpb24gPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgICBwYWdlLnVzZVRlbXBsYXRlUmVuZGVyZXIocmVuZGVyRnVuY3Rpb24pXG4gICAgICAgIH1cbiAgICAgIH0pXG4gICAgICB0aGlzLmNhY2hlUGFnZVNlbGVjdG9yID0gbnVsbFxuICAgIH1cblxuICAgIHRyaWdnZXJQYWdlRXZlbnQocGFnZU5hbWUsIGV2ZW50TmFtZSwgZXZlbnRQYXJhbXMgPSBudWxsKSB7XG4gICAgICBjb25zdCBwYWdlTW9kZWwgPSB0aGlzLmdldFBhZ2VNb2RlbChwYWdlTmFtZSlcbiAgICAgIGlmIChwYWdlTW9kZWwpIHtcbiAgICAgICAgcGFnZU1vZGVsLnRyaWdnZXJTY29wZXMoZXZlbnROYW1lLCBldmVudFBhcmFtcylcbiAgICAgIH1cbiAgICB9XG5cbiAgICBvbkNsaWNrKGV2ZW50KSB7XG4gICAgICBjb25zdCBwYWdlTmFtZSA9IGV2ZW50LnRhcmdldC5nZXRBdHRyaWJ1dGUoJ2RhdGEtbmF2aWdhdGUnKVxuICAgICAgY29uc3QgcHVzaFBhZ2UgPSAhKGV2ZW50LnRhcmdldC5nZXRBdHRyaWJ1dGUoJ2RhdGEtcG9wLXBhZ2UnKSA9PT0gJ3RydWUnKVxuXG4gICAgICBpZiAocGFnZU5hbWUpIHtcbiAgICAgICAgaWYgKHBhZ2VOYW1lID09PSAnJGJhY2snKSB7XG4gICAgICAgICAgLy8gdGhlIHBvcHN0YXRlIGV2ZW50IHdpbGwgYmUgdHJpZ2dlcmVkXG4gICAgICAgICAgd2luZG93Lmhpc3RvcnkuYmFjaygpXG4gICAgICAgICAgcmV0dXJuXG4gICAgICAgIH1cblxuICAgICAgICAvKlxuICAgICAgICAgKiBJZiB3ZSBoZSB1c2UgdGhlIGhhc2ggYXMgdHJpZ2dlcixcbiAgICAgICAgICogd2UgY2hhbmdlIGl0IGR5bmFtaWNhbGx5IHNvIHRoYXQgdGhlIGhhc2hjaGFuZ2UgZXZlbnQgaXMgY2FsbGVkXG4gICAgICAgICAqIE90aGVyd2lzZSwgd2Ugc2hvdyB0aGUgcGFnZVxuICAgICAgICAgKi9cbiAgICAgICAgaWYgKHRoaXMub3B0aW9ucy51c2VIYXNoKSB7XG4gICAgICAgICAgdGhpcy5zZXRIYXNoKHBhZ2VOYW1lKVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHRoaXMuc2hvd1BhZ2UocGFnZU5hbWUsIHRydWUsIHB1c2hQYWdlKVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuXG4gICAgb25CYWNrSGlzdG9yeShldmVudCA9IHt9KSB7XG4gICAgICBjb25zdCBwYWdlTmFtZSA9IGV2ZW50LnN0YXRlID8gZXZlbnQuc3RhdGUucGFnZSA6IG51bGxcbiAgICAgIGlmICghcGFnZU5hbWUpIHtcbiAgICAgICAgcmV0dXJuXG4gICAgICB9XG5cbiAgICAgIHRoaXMuc2hvd1BhZ2UocGFnZU5hbWUsIHRydWUsIHRydWUpXG4gICAgfVxuXG4gICAgb25IYXNoQ2hhbmdlKCkge1xuICAgICAgY29uc3QgcGFyYW1zID0gKHRoaXMuZ2V0SGFzaCgpID8gdGhpcy5nZXRIYXNoKCkuc3BsaXQoJy8nKSA6IFtdKS5maWx0ZXIocCA9PiBwLmxlbmd0aCA+IDApXG4gICAgICBpZiAocGFyYW1zLmxlbmd0aCA+IDApIHtcbiAgICAgICAgLy8gcmVtb3ZlIGZpcnN0IHZhbHVlIHdoaWNoIGlzIHRoZSBwYWdlIG5hbWVcbiAgICAgICAgcGFyYW1zLnNoaWZ0KClcbiAgICAgIH1cblxuICAgICAgdGhpcy50cmlnZ2VyUGFnZUV2ZW50KGN1cnJlbnRQYWdlLCBFdmVudC5IQVNILCBwYXJhbXMpXG5cbiAgICAgIGNvbnN0IG5hdlBhZ2UgPSB0aGlzLmdldFBhZ2VGcm9tSGFzaCgpXG4gICAgICBpZiAobmF2UGFnZSkge1xuICAgICAgICB0aGlzLnNob3dQYWdlKG5hdlBhZ2UpXG4gICAgICB9XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogUXVlcmllcyB0aGUgcGFnZSBub2RlcyBpbiB0aGUgRE9NXG4gICAgICovXG4gICAgb25ET01Mb2FkZWQoKSB7XG4gICAgICBjb25zdCBwYWdlcyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJ1tkYXRhLXBhZ2VdJylcblxuICAgICAgaWYgKCFwYWdlcykge1xuICAgICAgICByZXR1cm5cbiAgICAgIH1cblxuICAgICAgcGFnZXMuZm9yRWFjaCgocGFnZSkgPT4ge1xuICAgICAgICBsZXQgcGFnZU5hbWUgPSBwYWdlLmdldEF0dHJpYnV0ZSgnZGF0YS1wYWdlJylcbiAgICAgICAgLypcbiAgICAgICAgICogdGhlIHBhZ2UgbmFtZSBjYW4gYmUgZ2l2ZW4gd2l0aCB0aGUgYXR0cmlidXRlIGRhdGEtcGFnZVxuICAgICAgICAgKiBvciB3aXRoIGl0cyBub2RlIG5hbWVcbiAgICAgICAgICovXG4gICAgICAgIGlmICghcGFnZU5hbWUpIHtcbiAgICAgICAgICBwYWdlTmFtZSA9IHBhZ2Uubm9kZU5hbWVcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuYWRkVW5pcXVlUGFnZU1vZGVsKHBhZ2VOYW1lKVxuICAgICAgfSlcbiAgICB9XG5cbiAgICBzZWxlY3QocGFnZU5hbWUsIGFkZFBhZ2VNb2RlbCA9IHRydWUpIHtcbiAgICAgIHRoaXMuY2FjaGVQYWdlU2VsZWN0b3IgPSBwYWdlTmFtZVxuXG4gICAgICBpZiAoYWRkUGFnZU1vZGVsICYmIHBhZ2VOYW1lICE9PSAnKicpIHtcbiAgICAgICAgdGhpcy5hZGRVbmlxdWVQYWdlTW9kZWwocGFnZU5hbWUpXG4gICAgICB9XG5cbiAgICAgIHJldHVybiB0aGlzXG4gICAgfVxuXG4gICAgc3RhcnQoZm9yY2VEZWZhdWx0UGFnZSA9IGZhbHNlKSB7XG4gICAgICAvLyBjaGVjayBpZiB0aGUgYXBwIGhhcyBiZWVuIGFscmVhZHkgc3RhcnRlZFxuICAgICAgaWYgKHRoaXMuc3RhcnRlZCkge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYCR7TkFNRX0uIFRoZSBhcHAgaGFzIGJlZW4gYWxyZWFkeSBzdGFydGVkLmApXG4gICAgICB9XG5cbiAgICAgIHRoaXMuc3RhcnRlZCA9IHRydWVcblxuICAgICAgLy8gZm9yY2UgZGVmYXVsdCBwYWdlIG9uIENvcmRvdmFcbiAgICAgIGlmICh3aW5kb3cuY29yZG92YSkge1xuICAgICAgICBmb3JjZURlZmF1bHRQYWdlID0gdHJ1ZVxuICAgICAgfVxuXG4gICAgICBsZXQgcGFnZU5hbWUgPSB0aGlzLmdldFBhZ2VGcm9tSGFzaCgpXG4gICAgICBpZiAoIXRoaXMuZ2V0UGFnZU1vZGVsKHBhZ2VOYW1lKSkge1xuICAgICAgICBwYWdlTmFtZSA9IHRoaXMub3B0aW9ucy5kZWZhdWx0UGFnZVxuICAgICAgfVxuXG4gICAgICBpZiAoZm9yY2VEZWZhdWx0UGFnZSAmJiAhdGhpcy5vcHRpb25zLmRlZmF1bHRQYWdlKSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcihgJHtOQU1FfS4gVGhlIGRlZmF1bHQgcGFnZSBtdXN0IGV4aXN0IGZvciBmb3JjaW5nIGl0cyBsYXVuY2ghYClcbiAgICAgIH1cblxuICAgICAgLy8gTG9nIHRoZSBkZXZpY2UgaW5mb1xuICAgICAgaWYgKHBob25vbi5kZWJ1Zykge1xuICAgICAgICBjb25zb2xlLmxvZygnU3RhcnRpbmcgUGhvbm9uIGluICcgKyBwbGF0Zm9ybS5kZXNjcmlwdGlvbilcbiAgICAgICAgY29uc29sZS5sb2codGhpcy5wYWdlcy5sZW5ndGggKyAnIHBhZ2VzIGZvdW5kJylcbiAgICAgICAgY29uc29sZS5sb2coJ0xvYWRpbmcgJyArIHBhZ2VOYW1lKVxuICAgICAgfVxuXG4gICAgICAvKlxuICAgICAgICogaWYgdGhlIGFwcCBpcyBjb25maWd1cmF0ZWQgdG8gdXNlIGhhc2ggdHJhY2tpbmdcbiAgICAgICAqIHdlIGFkZCB0aGUgcGFnZSBkeW5hbWljYWxseSBpbiB0aGUgdXJsXG4gICAgICAgKi9cbiAgICAgIGlmICh0aGlzLm9wdGlvbnMudXNlSGFzaCkge1xuICAgICAgICB0aGlzLnNldEhhc2gocGFnZU5hbWUpXG4gICAgICB9XG5cbiAgICAgIHRoaXMuc2hvd1BhZ2UoZm9yY2VEZWZhdWx0UGFnZSA/IHRoaXMub3B0aW9ucy5kZWZhdWx0UGFnZSA6IHBhZ2VOYW1lKVxuICAgIH1cblxuICAgIC8vIHN0YXRpY1xuICAgIHN0YXRpYyBfRE9NSW50ZXJmYWNlKG9wdGlvbnMpIHtcbiAgICAgIHJldHVybiBuZXcgUGFnZXIob3B0aW9ucylcbiAgICB9XG4gIH1cblxuICByZXR1cm4gUGFnZXJcbn0pKClcblxuZXhwb3J0IGRlZmF1bHQgUGFnZXJcbiIsIi8qKlxuICogLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAqIExpY2Vuc2VkIHVuZGVyIE1JVCAoaHR0cHM6Ly9naXRodWIuY29tL3F1YXJrLWRldi9QaG9ub24tRnJhbWV3b3JrL2Jsb2IvbWFzdGVyL0xJQ0VOU0UpXG4gKiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICovXG5cbmltcG9ydCB7IGxvYWRGaWxlIH0gZnJvbSAnLi4vLi4vY29tbW9uL3V0aWxzJ1xuaW1wb3J0IHsgZGlzcGF0Y2hQYWdlRXZlbnQgfSBmcm9tICcuLi8uLi9jb21tb24vZXZlbnRzL2Rpc3BhdGNoJ1xuXG5jb25zdCBQYWdlID0gKCgpID0+IHtcbiAgLyoqXG4gICAqIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgKiBDb25zdGFudHNcbiAgICogLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAqL1xuXG4gIGNvbnN0IE5BTUUgPSAncGFnZSdcbiAgY29uc3QgVkVSU0lPTiA9ICcyLjAuMCdcblxuICBjb25zdCBURU1QTEFURV9TRUxFQ1RPUiA9ICdbZGF0YS10ZW1wbGF0ZV0nXG5cbiAgLyoqXG4gICAqIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgKiBDbGFzcyBEZWZpbml0aW9uXG4gICAqIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgKi9cblxuICBjbGFzcyBQYWdlIHtcbiAgICAvKipcbiAgICAgKiBDcmVhdGVzIGFuIGluc3RhbmNlIG9mIFBhZ2UuXG4gICAgICogQHBhcmFtIHtzdHJpbmd9IHBhZ2VOYW1lXG4gICAgICovXG4gICAgY29uc3RydWN0b3IocGFnZU5hbWUpIHtcbiAgICAgIHRoaXMubmFtZSA9IHBhZ2VOYW1lXG4gICAgICB0aGlzLmV2ZW50cyA9IFtdXG4gICAgICB0aGlzLnRlbXBsYXRlUGF0aCA9IG51bGxcbiAgICAgIHRoaXMucmVuZGVyRnVuY3Rpb24gPSBudWxsXG4gICAgfVxuXG4gICAgLy8gZ2V0dGVyc1xuXG4gICAgc3RhdGljIGdldCB2ZXJzaW9uKCkge1xuICAgICAgcmV0dXJuIGAke05BTUV9LiR7VkVSU0lPTn1gXG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogR2V0IGV2ZW50c1xuICAgICAqIEByZXR1cm5zIHtGdW5jdGlvbltdfVxuICAgICAqL1xuICAgIGdldEV2ZW50cygpIHtcbiAgICAgIHJldHVybiB0aGlzLmV2ZW50c1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEdldCB0ZW1wbGF0ZVxuICAgICAqIEByZXR1cm5zIHtzdHJpbmd9XG4gICAgICovXG4gICAgZ2V0VGVtcGxhdGUoKSB7XG4gICAgICByZXR1cm4gdGhpcy50ZW1wbGF0ZVBhdGhcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBHZXQgcmVuZGVyIGZ1bmN0aW9uXG4gICAgICogQHJldHVybnMge0Z1bmN0aW9ufVxuICAgICAqL1xuICAgIGdldFJlbmRlckZ1bmN0aW9uKCkge1xuICAgICAgcmV0dXJuIHRoaXMucmVuZGVyRnVuY3Rpb25cbiAgICB9XG5cbiAgICBsb2FkVGVtcGxhdGUoKSB7XG4gICAgICBjb25zdCBwYWdlRWxlbWVudCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoYFtkYXRhLXBhZ2U9XCIke3RoaXMubmFtZX1cIl1gKVxuXG4gICAgICBsb2FkRmlsZSh0aGlzLmdldFRlbXBsYXRlKCksICh0ZW1wbGF0ZSkgPT4ge1xuICAgICAgICBsZXQgcmVuZGVyID0gZnVuY3Rpb24gKERPTVBhZ2UsIHRlbXBsYXRlLCBlbGVtZW50cykge1xuICAgICAgICAgIGlmIChlbGVtZW50cykge1xuICAgICAgICAgICAgQXJyYXkuZnJvbShlbGVtZW50cykuZm9yRWFjaCgoZWwpID0+IHtcbiAgICAgICAgICAgICAgZWwuaW5uZXJIVE1MID0gdGVtcGxhdGVcbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIERPTVBhZ2UuaW5uZXJIVE1MID0gdGVtcGxhdGVcbiAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBpZiAodGhpcy5nZXRSZW5kZXJGdW5jdGlvbigpKSB7XG4gICAgICAgICAgcmVuZGVyID0gdGhpcy5nZXRSZW5kZXJGdW5jdGlvbigpXG4gICAgICAgIH1cblxuICAgICAgICByZW5kZXIocGFnZUVsZW1lbnQsIHRlbXBsYXRlLCBwYWdlRWxlbWVudC5xdWVyeVNlbGVjdG9yQWxsKFRFTVBMQVRFX1NFTEVDVE9SKSlcbiAgICAgIH0sIG51bGwpXG4gICAgfVxuXG4gICAgLy8gcHVibGljXG5cbiAgICAvKipcbiAgICAgKlxuICAgICAqIEBwYXJhbSB7Kn0gY2FsbGJhY2tGblxuICAgICAqL1xuICAgIGFkZEV2ZW50Q2FsbGJhY2soY2FsbGJhY2tGbikge1xuICAgICAgdGhpcy5ldmVudHMucHVzaChjYWxsYmFja0ZuKVxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFVzZSB0aGUgZ2l2ZW4gdGVtcGxhdGVcbiAgICAgKlxuICAgICAqIEBwYXJhbSB7c3RyaW5nfSB0ZW1wbGF0ZVBhdGhcbiAgICAgKi9cbiAgICB1c2VUZW1wbGF0ZSh0ZW1wbGF0ZVBhdGgpIHtcbiAgICAgIGlmICh0eXBlb2YgdGVtcGxhdGVQYXRoICE9PSAnc3RyaW5nJykge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ1RoZSB0ZW1wbGF0ZSBwYXRoIG11c3QgYmUgYSBzdHJpbmcuICcgKyB0eXBlb2YgdGVtcGxhdGVQYXRoICsgJyBpcyBnaXZlbicpXG4gICAgICB9XG4gICAgICB0aGlzLnRlbXBsYXRlUGF0aCA9IHRlbXBsYXRlUGF0aFxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFVzZSB0aGUgZ2l2ZW4gdGVtcGxhdGUgcmVuZGVyZXJcbiAgICAgKiBAcGFyYW0ge0Z1bmN0aW9ufSByZW5kZXJGdW5jdGlvblxuICAgICAqL1xuICAgIHVzZVRlbXBsYXRlUmVuZGVyZXIocmVuZGVyRnVuY3Rpb24pIHtcbiAgICAgIGlmICh0eXBlb2YgcmVuZGVyRnVuY3Rpb24gIT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdUaGUgY3VzdG9tIHRlbXBsYXRlIHJlbmRlcmVyIG11c3QgYmUgYSBmdW5jdGlvbi4gJyArIHR5cGVvZiByZW5kZXJGdW5jdGlvbiArICcgaXMgZ2l2ZW4nKVxuICAgICAgfVxuICAgICAgdGhpcy5yZW5kZXJGdW5jdGlvbiA9IHJlbmRlckZ1bmN0aW9uXG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogVHJpZ2dlciBzY29wZXNcbiAgICAgKiBAcGFyYW0ge3N0cmluZ30gZXZlbnROYW1lXG4gICAgICogQHBhcmFtIHt7fX0gW2V2ZW50UGFyYW1zPXt9XVxuICAgICAqL1xuICAgIHRyaWdnZXJTY29wZXMoZXZlbnROYW1lLCBldmVudFBhcmFtcyA9IHt9KSB7XG4gICAgICBjb25zdCBldmVudE5hbWVBbGlhcyA9IGBvbiR7ZXZlbnROYW1lLmNoYXJBdCgwKS50b1VwcGVyQ2FzZSgpfSR7ZXZlbnROYW1lLnNsaWNlKDEpfWBcblxuICAgICAgdGhpcy5ldmVudHMuZm9yRWFjaCgoc2NvcGUpID0+IHtcbiAgICAgICAgY29uc3Qgc2NvcGVFdmVudCA9IHNjb3BlW2V2ZW50TmFtZV1cbiAgICAgICAgY29uc3Qgc2NvcGVFdmVudEFsaWFzID0gc2NvcGVbZXZlbnROYW1lQWxpYXNdXG4gICAgICAgIGlmICh0eXBlb2Ygc2NvcGVFdmVudCA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICAgIHNjb3BlRXZlbnQuYXBwbHkodGhpcywgZXZlbnRQYXJhbXMpXG4gICAgICAgIH1cblxuICAgICAgICAvLyB0cmlnZ2VyIHRoZSBldmVudCBhbGlhc1xuICAgICAgICBpZiAodHlwZW9mIHNjb3BlRXZlbnRBbGlhcyA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICAgIHNjb3BlRXZlbnRBbGlhcy5hcHBseSh0aGlzLCBldmVudFBhcmFtcylcbiAgICAgICAgfVxuICAgICAgfSlcblxuICAgICAgZGlzcGF0Y2hQYWdlRXZlbnQoZXZlbnROYW1lLCB0aGlzLm5hbWUsIGV2ZW50UGFyYW1zKVxuICAgIH1cbiAgfVxuXG4gIHJldHVybiBQYWdlXG59KSgpXG5cbmV4cG9ydCBkZWZhdWx0IFBhZ2VcbiIsIi8qKlxuICogLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAqIExpY2Vuc2VkIHVuZGVyIE1JVCAoaHR0cHM6Ly9naXRodWIuY29tL3F1YXJrLWRldi9QaG9ub24tRnJhbWV3b3JrL2Jsb2IvbWFzdGVyL0xJQ0VOU0UpXG4gKiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICovXG5cbmltcG9ydCBQYWdlciBmcm9tICcuL2h5YnJpZC1hcHBzL3BhZ2VyL2luZGV4J1xuaW1wb3J0IEludGwgZnJvbSAnLi9oeWJyaWQtYXBwcy9pbnRsJ1xuaW1wb3J0IE5ldHdvcmsgZnJvbSAnLi91dGlsaXRpZXMvbmV0d29yaydcblxuLy8gY29tcG9uZW50c1xuaW1wb3J0IERpYWxvZyBmcm9tICcuL2NvbXBvbmVudHMvZGlhbG9nJ1xuaW1wb3J0IFByb21wdCBmcm9tICcuL2NvbXBvbmVudHMvZGlhbG9nL3Byb21wdCdcbmltcG9ydCBOb3RpZmljYXRpb24gZnJvbSAnLi9jb21wb25lbnRzL25vdGlmaWNhdGlvbidcbmltcG9ydCBDb2xsYXBzZSBmcm9tICcuL2NvbXBvbmVudHMvY29sbGFwc2UnXG5pbXBvcnQgQWNjb3JkaW9uIGZyb20gJy4vY29tcG9uZW50cy9hY2NvcmRpb24nXG5pbXBvcnQgVGFiIGZyb20gJy4vY29tcG9uZW50cy90YWInXG5pbXBvcnQgUHJvZ3Jlc3MgZnJvbSAnLi9jb21wb25lbnRzL3Byb2dyZXNzJ1xuaW1wb3J0IExvYWRlciBmcm9tICcuL2NvbXBvbmVudHMvbG9hZGVyJ1xuaW1wb3J0IE9mZkNhbnZhcyBmcm9tICcuL2NvbXBvbmVudHMvb2ZmLWNhbnZhcydcbmltcG9ydCBEcm9wZG93biBmcm9tICcuL2NvbXBvbmVudHMvZHJvcGRvd24nXG5pbXBvcnQgRHJvcGRvd25TZWFyY2ggZnJvbSAnLi9jb21wb25lbnRzL2Ryb3Bkb3duL3NlYXJjaCdcblxuY29uc3QgYXBpID0ge31cblxuLyoqXG4gKiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAqIENvbmZpZ3VyYXRpb25cbiAqIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICovXG5hcGkuY29uZmlnID0ge1xuICAvLyBnbG9iYWwgY29uZmlnXG4gIGRlYnVnOiB0cnVlLFxufVxuXG4vKipcbiAqIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICogUGFnZXJcbiAqIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICovXG5hcGkucGFnZXIgPSAob3B0aW9ucykgPT4ge1xuICBpZiAodHlwZW9mIGFwaS5fcGFnZXIgPT09ICd1bmRlZmluZWQnKSB7XG4gICAgYXBpLl9wYWdlciA9IFBhZ2VyLl9ET01JbnRlcmZhY2Uob3B0aW9ucylcbiAgfVxuICByZXR1cm4gYXBpLl9wYWdlclxufVxuXG4vKipcbiAqIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICogSW50bFxuICogLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gKi9cbmFwaS5pbnRsID0gSW50bC5fRE9NSW50ZXJmYWNlXG5cbi8qKlxuICogLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gKiBOZXR3b3JrXG4gKiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAqL1xuYXBpLm5ldHdvcmsgPSBOZXR3b3JrLl9ET01JbnRlcmZhY2VcblxuLyoqXG4gKiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAqIE5vdGlmaWNhdGlvblxuICogLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gKi9cbmFwaS5ub3RpZmljYXRpb24gPSBOb3RpZmljYXRpb24uX0RPTUludGVyZmFjZVxuXG4vKipcbiAqIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICogRGlhbG9nXG4gKiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAqL1xuYXBpLmRpYWxvZyA9IERpYWxvZy5fRE9NSW50ZXJmYWNlXG5cbnNldFRpbWVvdXQoKCkgPT4ge1xuICBQcm9tcHQuX0RPTUludGVyZmFjZSh7XG4gICAgZWxlbWVudDogbnVsbCxcbiAgICB0aXRsZTogJ0hFTExPVycsXG4gICAgbWVzc2FnZTogbnVsbCxcbiAgICBjYW5jZWxhYmxlOiB0cnVlLFxuICB9KS5zaG93KClcbn0sIDEwMDApXG5cbi8qKlxuICogLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gKiBDb2xsYXBzZVxuICogLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gKi9cbmFwaS5jb2xsYXBzZSA9IENvbGxhcHNlLl9ET01JbnRlcmZhY2VcblxuLyoqXG4gKiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAqIEFjY29yZGlvblxuICogLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gKi9cbmFwaS5hY2NvcmRpb24gPSBBY2NvcmRpb24uX0RPTUludGVyZmFjZVxuXG5cbi8qKlxuICogLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gKiBUYWJcbiAqIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICovXG5hcGkudGFiID0gVGFiLl9ET01JbnRlcmZhY2VcblxuLyoqXG4gKiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAqIFByb2dyZXNzXG4gKiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAqL1xuYXBpLnByb2dyZXNzID0gUHJvZ3Jlc3MuX0RPTUludGVyZmFjZVxuXG4vKipcbiAqIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICogTG9hZGVyXG4gKiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAqL1xuYXBpLmxvYWRlciA9IExvYWRlci5fRE9NSW50ZXJmYWNlXG5cbi8qKlxuICogLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gKiBPZmYgY2FudmFzXG4gKiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAqL1xuYXBpLm9mZkNhbnZhcyA9IE9mZkNhbnZhcy5fRE9NSW50ZXJmYWNlXG5cbi8qKlxuICogLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gKiBEcm9wZG93blxuICogLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gKi9cbmFwaS5kcm9wZG93biA9IChvcHRpb25zKSA9PiB7XG4gIGlmIChvcHRpb25zLnNlYXJjaCkge1xuICAgIC8vIGdlbmVyaWMgZHJvcGRvd25cbiAgICByZXR1cm4gRHJvcGRvd24uX0RPTUludGVyZmFjZVxuICB9IGVsc2Uge1xuICAgIC8vIHNlYXJjaCBkcm9wZG93blxuICAgIHJldHVybiBEcm9wZG93blNlYXJjaC5fRE9NSW50ZXJmYWNlXG4gIH1cbn1cblxuLy8gTWFrZSB0aGUgQVBJIGxpdmVcbndpbmRvdy5waG9ub24gPSBhcGlcblxuZXhwb3J0IGRlZmF1bHQgYXBpXG4iLCIvKipcbiAqIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gKiBMaWNlbnNlZCB1bmRlciBNSVQgKGh0dHBzOi8vZ2l0aHViLmNvbS9xdWFyay1kZXYvUGhvbm9uLUZyYW1ld29yay9ibG9iL21hc3Rlci9MSUNFTlNFKVxuICogLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAqL1xuXG5pbXBvcnQgRXZlbnQgZnJvbSAnLi4vLi4vY29tbW9uL2V2ZW50cydcbmltcG9ydCBDb21wb25lbnQgZnJvbSAnLi4vLi4vY29tcG9uZW50cy9jb21wb25lbnQnXG5cbmNvbnN0IE5ldHdvcmsgPSAoKCkgPT4ge1xuICAvKipcbiAgICogLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAqIENvbnN0YW50c1xuICAgKiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICovXG5cbiAgY29uc3QgTkFNRSA9ICduZXR3b3JrJ1xuICBjb25zdCBWRVJTSU9OID0gJzIuMC4wJ1xuICBjb25zdCBERUZBVUxUX1BST1BFUlRJRVMgPSB7XG4gICAgZWxlbWVudDogbnVsbCxcbiAgICBpbml0aWFsRGVsYXk6IDMwMDAsXG4gICAgZGVsYXk6IDUwMDAsXG4gIH1cbiAgY29uc3QgREFUQV9BVFRSU19QUk9QRVJUSUVTID0gW1xuICBdXG5cbiAgLyoqXG4gICAqIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgKiBDbGFzcyBEZWZpbml0aW9uXG4gICAqIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgKi9cblxuICBjbGFzcyBOZXR3b3JrIGV4dGVuZHMgQ29tcG9uZW50IHtcbiAgICAvKipcbiAgICAgKiBDcmVhdGVzIGFuIGluc3RhbmNlIG9mIE5ldHdvcmsuXG4gICAgICogQHBhcmFtIHt7fX0gW29wdGlvbnM9e31dXG4gICAgICovXG4gICAgY29uc3RydWN0b3Iob3B0aW9ucyA9IHt9KSB7XG4gICAgICBzdXBlcihOQU1FLCBWRVJTSU9OLCBERUZBVUxUX1BST1BFUlRJRVMsIG9wdGlvbnMsIERBVEFfQVRUUlNfUFJPUEVSVElFUywgdHJ1ZSwgZmFsc2UpXG5cbiAgICAgIHRoaXMueGhyID0gbnVsbFxuICAgICAgdGhpcy5jaGVja0ludGVydmFsID0gbnVsbFxuXG4gICAgICB0aGlzLnNldFN0YXR1cyhFdmVudC5ORVRXT1JLX09OTElORSlcblxuICAgICAgc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICAgIHRoaXMuc3RhcnRDaGVjaygpXG4gICAgICB9LCB0aGlzLm9wdGlvbnMuaW5pdGlhbERlbGF5KVxuICAgIH1cblxuICAgIGdldFN0YXR1cygpIHtcbiAgICAgIHJldHVybiB0aGlzLnN0YXR1c1xuICAgIH1cblxuICAgIHNldFN0YXR1cyhzdGF0dXMpIHtcbiAgICAgIHRoaXMuc3RhdHVzID0gc3RhdHVzXG4gICAgfVxuXG4gICAgc3RhcnRSZXF1ZXN0KCkge1xuICAgICAgdGhpcy54aHIgPSBuZXcgWE1MSHR0cFJlcXVlc3QoKVxuICAgICAgdGhpcy54aHIub2ZmbGluZSA9IGZhbHNlXG5cbiAgICAgIGNvbnN0IHVybCA9IGAvZmF2aWNvbi5pY28/Xz0ke25ldyBEYXRlKCkuZ2V0VGltZSgpfWBcblxuICAgICAgdGhpcy50cmlnZ2VyRXZlbnQoRXZlbnQuTkVUV09SS19SRUNPTk5FQ1RJTkcsIHsgZGF0ZTogbmV3IERhdGUoKSB9LCBmYWxzZSkgICAgICAgICAgICBcblxuICAgICAgdGhpcy54aHIub3BlbignSEVBRCcsIHVybCwgdHJ1ZSlcblxuICAgICAgdGhpcy54aHIudGltZW91dCA9IHRoaXMub3B0aW9ucy5kZWxheSAtIDFcbiAgICAgIHRoaXMueGhyLm9udGltZW91dCA9ICgpID0+IHtcbiAgICAgICAgdGhpcy54aHIuYWJvcnQoKVxuICAgICAgICB0aGlzLnhociA9IG51bGxcbiAgICAgIH1cblxuICAgICAgdGhpcy54aHIub25sb2FkID0gKCkgPT4ge1xuICAgICAgICB0aGlzLm9uVXAoKVxuICAgICAgfVxuICAgICAgdGhpcy54aHIub25lcnJvciA9ICgpID0+IHtcbiAgICAgICAgdGhpcy5vbkRvd24oKVxuICAgICAgfVxuXG4gICAgICB0cnkge1xuICAgICAgICB0aGlzLnhoci5zZW5kKClcbiAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgdGhpcy5vbkRvd24oKVxuICAgICAgfVxuICAgIH1cblxuICAgIG9uVXAoKSB7XG4gICAgICB0aGlzLnRyaWdnZXJFdmVudChFdmVudC5ORVRXT1JLX1JFQ09OTkVDVElOR19TVUNDRVNTLCB7IGRhdGU6IG5ldyBEYXRlKCkgfSwgZmFsc2UpXG5cbiAgICAgIGlmICh0aGlzLmdldFN0YXR1cygpICE9PSBFdmVudC5ORVRXT1JLX09OTElORSkge1xuICAgICAgICB0aGlzLnRyaWdnZXJFdmVudChFdmVudC5ORVRXT1JLX09OTElORSwgeyBkYXRlOiBuZXcgRGF0ZSgpIH0sIGZhbHNlKVxuICAgICAgfVxuXG4gICAgICB0aGlzLnNldFN0YXR1cyhFdmVudC5ORVRXT1JLX09OTElORSkgICAgICBcbiAgICB9XG5cbiAgICBvbkRvd24oKSB7XG4gICAgICB0aGlzLnRyaWdnZXJFdmVudChFdmVudC5ORVRXT1JLX1JFQ09OTkVDVElOR19GQUlMVVJFLCB7IGRhdGU6IG5ldyBEYXRlKCkgfSwgZmFsc2UpXG5cbiAgICAgIGlmICh0aGlzLmdldFN0YXR1cygpICE9PSBFdmVudC5ORVRXT1JLX09GRkxJTkUpIHtcbiAgICAgICAgdGhpcy50cmlnZ2VyRXZlbnQoRXZlbnQuTkVUV09SS19PRkZMSU5FLCB7IGRhdGU6IG5ldyBEYXRlKCkgfSwgZmFsc2UpXG4gICAgICB9XG5cbiAgICAgIHRoaXMuc2V0U3RhdHVzKEV2ZW50Lk5FVFdPUktfT0ZGTElORSkgICAgICBcbiAgICB9XG5cbiAgICBzdGFydENoZWNrKCkge1xuICAgICAgdGhpcy5zdG9wQ2hlY2soKVxuXG4gICAgICB0aGlzLnN0YXJ0UmVxdWVzdCgpICAgICAgXG5cbiAgICAgIHRoaXMuY2hlY2tJbnRlcnZhbCA9IHNldEludGVydmFsKCgpID0+IHtcbiAgICAgICAgdGhpcy5zdGFydFJlcXVlc3QoKVxuICAgICAgfSwgdGhpcy5vcHRpb25zLmRlbGF5KVxuICAgIH1cblxuICAgIHN0b3BDaGVjaygpIHtcbiAgICAgIGlmICh0aGlzLmNoZWNrSW50ZXJ2YWwgIT09IG51bGwpIHtcbiAgICAgICAgY2xlYXJJbnRlcnZhbCh0aGlzLmNoZWNrSW50ZXJ2YWwpXG4gICAgICAgIHRoaXMuY2hlY2tJbnRlcnZhbCA9IG51bGxcbiAgICAgIH1cbiAgICB9XG5cbiAgICBzdGF0aWMgX0RPTUludGVyZmFjZShvcHRpb25zKSB7XG4gICAgICByZXR1cm4gc3VwZXIuX0RPTUludGVyZmFjZShOZXR3b3JrLCBvcHRpb25zKVxuICAgIH1cbiAgfVxuXG4gIHJldHVybiBOZXR3b3JrXG59KSgpXG5cbmV4cG9ydCBkZWZhdWx0IE5ldHdvcmtcbiJdLCJwcmVFeGlzdGluZ0NvbW1lbnQiOiIvLyMgc291cmNlTWFwcGluZ1VSTD1kYXRhOmFwcGxpY2F0aW9uL2pzb247Y2hhcnNldD11dGYtODtiYXNlNjQsZXlKMlpYSnphVzl1SWpvekxDSnpiM1Z5WTJWeklqcGJJbTV2WkdWZmJXOWtkV3hsY3k5aWNtOTNjMlZ5TFhCaFkyc3ZYM0J5Wld4MVpHVXVhbk1pTENKemNtTXZhbk12WTI5dGJXOXVMMlYyWlc1MGN5OWthWE53WVhSamFDNXFjeUlzSW5OeVl5OXFjeTlqYjIxdGIyNHZaWFpsYm5SekwybHVaR1Y0TG1weklpd2ljM0pqTDJwekwyTnZiVzF2Ymk5MWRHbHNjeTlwYm1SbGVDNXFjeUlzSW5OeVl5OXFjeTlqYjIxd2IyNWxiblJ6TDJGalkyOXlaR2x2Ymk5cGJtUmxlQzVxY3lJc0luTnlZeTlxY3k5amIyMXdiMjVsYm5SekwyTnZiR3hoY0hObEwybHVaR1Y0TG1weklpd2ljM0pqTDJwekwyTnZiWEJ2Ym1WdWRITXZZMjl0Y0c5dVpXNTBMbXB6SWl3aWMzSmpMMnB6TDJOdmJYQnZibVZ1ZEhNdlkyOXRjRzl1Wlc1MFRXRnVZV2RsY2k1cWN5SXNJbk55WXk5cWN5OWpiMjF3YjI1bGJuUnpMMlJwWVd4dlp5OXBibVJsZUM1cWN5SXNJbk55WXk5cWN5OWpiMjF3YjI1bGJuUnpMMlJwWVd4dlp5OXdjbTl0Y0hRdWFuTWlMQ0p6Y21NdmFuTXZZMjl0Y0c5dVpXNTBjeTlrY205d1pHOTNiaTlwYm1SbGVDNXFjeUlzSW5OeVl5OXFjeTlqYjIxd2IyNWxiblJ6TDJSeWIzQmtiM2R1TDNObFlYSmphQzVxY3lJc0luTnlZeTlxY3k5amIyMXdiMjVsYm5SekwyeHZZV1JsY2k5cGJtUmxlQzVxY3lJc0luTnlZeTlxY3k5amIyMXdiMjVsYm5SekwyNXZkR2xtYVdOaGRHbHZiaTlwYm1SbGVDNXFjeUlzSW5OeVl5OXFjeTlqYjIxd2IyNWxiblJ6TDI5bVppMWpZVzUyWVhNdmFXNWtaWGd1YW5NaUxDSnpjbU12YW5NdlkyOXRjRzl1Wlc1MGN5OXdjbTluY21WemN5OXBibVJsZUM1cWN5SXNJbk55WXk5cWN5OWpiMjF3YjI1bGJuUnpMM1JoWWk5cGJtUmxlQzVxY3lJc0luTnlZeTlxY3k5b2VXSnlhV1F0WVhCd2N5OXBiblJzTDJKcGJtUmxjaTVxY3lJc0luTnlZeTlxY3k5b2VXSnlhV1F0WVhCd2N5OXBiblJzTDJsdVpHVjRMbXB6SWl3aWMzSmpMMnB6TDJoNVluSnBaQzFoY0hCekwzQmhaMlZ5TDJsdVpHVjRMbXB6SWl3aWMzSmpMMnB6TDJoNVluSnBaQzFoY0hCekwzQmhaMlZ5TDNCaFoyVXVhbk1pTENKemNtTXZhbk12YVc1a1pYZ3Vhbk1pTENKemNtTXZhbk12ZFhScGJHbDBhV1Z6TDI1bGRIZHZjbXN2YVc1a1pYZ3Vhbk1pWFN3aWJtRnRaWE1pT2x0ZExDSnRZWEJ3YVc1bmN5STZJa0ZCUVVFN096czdPenRSUTBGblFpeHRRaXhIUVVGQkxHMUNPMUZCVFVFc2IwSXNSMEZCUVN4dlFqdFJRVXRCTEdsQ0xFZEJRVUVzYVVJN1FVRllWQ3hUUVVGVExHMUNRVUZVTEVOQlFUWkNMRk5CUVRkQ0xFVkJRWGRETEZWQlFYaERMRVZCUVdsRk8wRkJRVUVzVFVGQllpeE5RVUZoTEhWRlFVRktMRVZCUVVrN08wRkJRM1JGTEUxQlFVMHNaMEpCUVcxQ0xGTkJRVzVDTEZsQlFXMURMRlZCUVhwRE8wRkJRMEVzVTBGQlR5eGhRVUZRTEVOQlFYRkNMRWxCUVVrc1YwRkJTaXhEUVVGblFpeGhRVUZvUWl4RlFVRXJRaXhGUVVGRkxHTkJRVVlzUlVGQkwwSXNRMEZCY2tJN1FVRkRRU3hYUVVGVExHRkJRVlFzUTBGQmRVSXNTVUZCU1N4WFFVRktMRU5CUVdkQ0xHRkJRV2hDTEVWQlFTdENMRVZCUVVVc1kwRkJSaXhGUVVFdlFpeERRVUYyUWp0QlFVTkVPenRCUVVWTkxGTkJRVk1zYjBKQlFWUXNRMEZCT0VJc1ZVRkJPVUlzUlVGQk1FTXNVMEZCTVVNc1JVRkJjVVFzVlVGQmNrUXNSVUZCT0VVN1FVRkJRU3hOUVVGaUxFMUJRV0VzZFVWQlFVb3NSVUZCU1RzN1FVRkRia1lzVFVGQlRTeG5Ra0ZCYlVJc1UwRkJia0lzV1VGQmJVTXNWVUZCZWtNN1FVRkRRU3hoUVVGWExHRkJRVmdzUTBGQmVVSXNTVUZCU1N4WFFVRktMRU5CUVdkQ0xHRkJRV2hDTEVWQlFTdENMRVZCUVVVc1kwRkJSaXhGUVVFdlFpeERRVUY2UWp0QlFVTkVPenRCUVVWTkxGTkJRVk1zYVVKQlFWUXNRMEZCTWtJc1UwRkJNMElzUlVGQmMwTXNVVUZCZEVNc1JVRkJOa1E3UVVGQlFTeE5RVUZpTEUxQlFXRXNkVVZCUVVvc1JVRkJTVHM3UVVGRGJFVXNUVUZCVFN4blFrRkJiVUlzVVVGQmJrSXNVMEZCSzBJc1UwRkJja003UVVGRFFTeFRRVUZQTEdGQlFWQXNRMEZCY1VJc1NVRkJTU3hYUVVGS0xFTkJRV2RDTEdGQlFXaENMRVZCUVN0Q0xFVkJRVVVzWTBGQlJpeEZRVUV2UWl4RFFVRnlRanRCUVVOQkxGZEJRVk1zWVVGQlZDeERRVUYxUWl4SlFVRkpMRmRCUVVvc1EwRkJaMElzWVVGQmFFSXNSVUZCSzBJc1JVRkJSU3hqUVVGR0xFVkJRUzlDTEVOQlFYWkNPMEZCUTBRN096czdPenM3TzBGRFprUTdRVUZEUVN4SlFVRkpMRTlCUVU4c1RVRkJVQ3hMUVVGclFpeFhRVUYwUWl4RlFVRnRRenRCUVVOcVF5eFRRVUZQTEdkQ1FVRlFMRU5CUVhkQ0xFOUJRWGhDTEVWQlFXbERMRmxCUVUwN1FVRkRja01zV1VGQlVTeExRVUZTTEVOQlFXTXNkVWRCUVdRN1FVRkRSQ3hIUVVaRU8wRkJSMFE3TzBGQlJVUTdRVUZEUVN4SlFVRkpMR3RDUVVGclFpeERRVUZETEZkQlFVUXNSVUZCWXl4WFFVRmtMRVZCUVRKQ0xGTkJRVE5DTEVOQlFYUkNPMEZCUTBFc1NVRkJTU3hqUVVGakxFdEJRV3hDT3p0QlFVVkJMRWxCUVVrc1QwRkJUeXhOUVVGUUxFdEJRV3RDTEZkQlFYUkNMRVZCUVcxRE8wRkJRMnBETEUxQlFVc3NhMEpCUVd0Q0xFMUJRVzVDTEVsQlFUaENMRTlCUVU4c1lVRkJVQ3hKUVVGM1FpeHZRa0ZCYjBJc1lVRkJPVVVzUlVGQk5rWTdRVUZETTBZc2EwSkJRV01zU1VGQlpEdEJRVU5CTEhOQ1FVRnJRaXhEUVVGRExGbEJRVVFzUlVGQlpTeFhRVUZtTEVWQlFUUkNMRlZCUVRWQ0xFVkJRWGRETEdGQlFYaERMRU5CUVd4Q08wRkJRMFE3TzBGQlJVUXNUVUZCU1N4UFFVRlBMRk5CUVZBc1EwRkJhVUlzWTBGQmNrSXNSVUZCY1VNN1FVRkRia01zYzBKQlFXdENMRU5CUVVNc1lVRkJSQ3hGUVVGblFpeGhRVUZvUWl4RlFVRXJRaXhYUVVFdlFpeEZRVUUwUXl4bFFVRTFReXhEUVVGc1FqdEJRVU5FTEVkQlJrUXNUVUZGVHl4SlFVRkpMRTlCUVU4c1UwRkJVQ3hEUVVGcFFpeG5Ra0ZCY2tJc1JVRkJkVU03UVVGRE5VTXNjMEpCUVd0Q0xFTkJRVU1zWlVGQlJDeEZRVUZyUWl4bFFVRnNRaXhGUVVGdFF5eGhRVUZ1UXl4RlFVRnJSQ3hwUWtGQmJFUXNRMEZCYkVJN1FVRkRSRHRCUVVOR096dEJRVVZFTEVsQlFVMHNTMEZCU3l4VFFVRlRMR0ZCUVZRc1EwRkJkVUlzUzBGQmRrSXNRMEZCV0R0QlFVTkJMRWxCUVUwc1kwRkJZeXhEUVVOc1FpeEZRVUZGTEUxQlFVMHNXVUZCVWl4RlFVRnpRaXhQUVVGUExHbENRVUUzUWl4RlFVRm5SQ3hMUVVGTExHVkJRWEpFTEVWQlJHdENMRVZCUld4Q0xFVkJRVVVzVFVGQlRTeGxRVUZTTEVWQlFYbENMRTlCUVU4c2FVSkJRV2hETEVWQlFXMUVMRXRCUVVzc1pVRkJlRVFzUlVGR2EwSXNSVUZIYkVJc1JVRkJSU3hOUVVGTkxHTkJRVklzUlVGQmQwSXNUMEZCVHl4dFFrRkJMMElzUlVGQmIwUXNTMEZCU3l4cFFrRkJla1FzUlVGSWEwSXNSVUZKYkVJc1JVRkJSU3hOUVVGTkxHdENRVUZTTEVWQlFUUkNMRTlCUVU4c2RVSkJRVzVETEVWQlFUUkVMRXRCUVVzc2NVSkJRV3BGTEVWQlNtdENMRU5CUVhCQ08wRkJUVUVzU1VGQlRTeGhRVUZoTEVOQlEycENMRVZCUVVVc1RVRkJUU3hYUVVGU0xFVkJRWEZDTEU5QlFVOHNaMEpCUVRWQ0xFVkJRVGhETEV0QlFVc3NZMEZCYmtRc1JVRkVhVUlzUlVGRmFrSXNSVUZCUlN4TlFVRk5MR05CUVZJc1JVRkJkMElzVDBGQlR5eG5Ra0ZCTDBJc1JVRkJhVVFzUzBGQlN5eGpRVUYwUkN4RlFVWnBRaXhGUVVkcVFpeEZRVUZGTEUxQlFVMHNZVUZCVWl4RlFVRjFRaXhQUVVGUExHdENRVUU1UWl4RlFVRnJSQ3hMUVVGTExHZENRVUYyUkN4RlFVaHBRaXhGUVVscVFpeEZRVUZGTEUxQlFVMHNhVUpCUVZJc1JVRkJNa0lzVDBGQlR5eHpRa0ZCYkVNc1JVRkJNRVFzUzBGQlN5eHZRa0ZCTDBRc1JVRkthVUlzUTBGQmJrSTdPMEZCVDBFc1NVRkJUU3hyUWtGQmEwSXNXVUZCV1N4SlFVRmFMRU5CUVdsQ08wRkJRVUVzVTBGQlN5eEhRVUZITEV0QlFVZ3NRMEZCVXl4RlFVRkZMRWxCUVZnc1RVRkJjVUlzVTBGQk1VSTdRVUZCUVN4RFFVRnFRaXhGUVVGelJDeExRVUU1UlR0QlFVTkJMRWxCUVUwc1owSkJRV2RDTEZsQlFWa3NTVUZCV2l4RFFVRnBRanRCUVVGQkxGTkJRVXNzUjBGQlJ5eExRVUZJTEVOQlFWTXNSVUZCUlN4SlFVRllMRTFCUVhGQ0xGTkJRVEZDTzBGQlFVRXNRMEZCYWtJc1JVRkJjMFFzUjBGQk5VVTdRVUZEUVN4SlFVRk5MR2xDUVVGcFFpeFhRVUZYTEVsQlFWZ3NRMEZCWjBJN1FVRkJRU3hUUVVGTExFZEJRVWNzUzBGQlNDeERRVUZUTEVWQlFVVXNTVUZCV0N4TlFVRnhRaXhUUVVFeFFqdEJRVUZCTEVOQlFXaENMRVZCUVhGRUxFdEJRVFZGTzBGQlEwRXNTVUZCVFN4bFFVRmxMRmRCUVZjc1NVRkJXQ3hEUVVGblFqdEJRVUZCTEZOQlFVc3NSMEZCUnl4TFFVRklMRU5CUVZNc1JVRkJSU3hKUVVGWUxFMUJRWEZDTEZOQlFURkNPMEZCUVVFc1EwRkJhRUlzUlVGQmNVUXNSMEZCTVVVN08ydENRVVZsTzBGQlEySTdRVUZEUVN4blFrRkJZeXhYUVVaRU96dEJRVWxpTzBGQlEwRXNhMEpCUVdkQ0xGRkJURWc3UVVGTllpeHRRa0ZCYVVJc1UwRk9TanRCUVU5aUxIZENRVUZ6UWl4alFWQlVPMEZCVVdJc1owTkJRVGhDTEcxQ1FWSnFRanRCUVZOaUxHZERRVUU0UWl4dFFrRlVha0k3TzBGQlYySTdRVUZEUVN4UlFVRk5MRTFCV2s4N1FVRmhZaXhUUVVGUExFOUJZazA3UVVGallpeFJRVUZOTEUxQlpFODdRVUZsWWl4VlFVRlJMRkZCWmtzN08wRkJhVUppTzBGQlEwRXNVVUZCVFN4TlFXeENUenM3UVVGdlFtSTdRVUZEUVN4VFFVRlBMR2RDUVVGblFpeERRVUZvUWl4RFFYSkNUVHRCUVhOQ1lpeFJRVUZOTEdkQ1FVRm5RaXhEUVVGb1FpeERRWFJDVHp0QlFYVkNZaXhQUVVGTExHZENRVUZuUWl4RFFVRm9RaXhEUVhaQ1VUdEJRWGRDWWl4VlFVRlJMRTlCUVU4c1owSkJRV2RDTEVOQlFXaENMRU5CUVZBc1MwRkJPRUlzVjBGQk9VSXNSMEZCTkVNc1NVRkJOVU1zUjBGQmJVUXNaMEpCUVdkQ0xFTkJRV2hDTEVOQmVFSTVRenM3UVVFd1FtSTdRVUZEUVN4dlFrRkJhMElzWlVFelFrdzdRVUUwUW1Jc2EwSkJRV2RDTEdGQk5VSklPenRCUVRoQ1lqdEJRVU5CTEcxQ1FVRnBRaXhqUVM5Q1NqdEJRV2REWWl4cFFrRkJaU3haUVdoRFJqczdRVUZyUTJJN1FVRkRRU3hwUWtGQlpUdEJRVzVEUml4RE96czdPenM3T3p0UlF6RkRReXhSTEVkQlFVRXNVVHRSUVc5Q1FTeFZMRWRCUVVFc1ZUdFJRVWxCTEdsQ0xFZEJRVUVzYVVJN1VVRlhRU3hqTEVkQlFVRXNZenRSUVZWQkxHZENMRWRCUVVFc1owSTdRVUUzUTFRc1UwRkJVeXhSUVVGVUxFTkJRV3RDTEVkQlFXeENMRVZCUVhWQ0xFVkJRWFpDTEVWQlFUSkNMRkZCUVROQ0xFVkJRWEZETzBGQlF6RkRMRTFCUVUwc1RVRkJUU3hKUVVGSkxHTkJRVW9zUlVGQldqdEJRVU5CTEUxQlFVa3NTVUZCU1N4blFrRkJVaXhGUVVFd1FpeEpRVUZKTEdkQ1FVRktMRU5CUVhGQ0xEQkNRVUZ5UWp0QlFVTXhRaXhOUVVGSkxHdENRVUZLTEVkQlFYbENMRmxCUVUwN1FVRkROMElzVVVGQlNTeEpRVUZKTEZWQlFVb3NTMEZCYlVJc1EwRkJia0lzUzBGQmVVSXNVMEZCVXl4SlFVRkpMRTFCUVdJc1JVRkJjVUlzUlVGQmNrSXNUVUZCTmtJc1IwRkJOMElzU1VGRGVFSXNRMEZCUXl4SlFVRkpMRTFCUVV3c1NVRkJaU3hKUVVGSkxGbEJRVW9zUTBGQmFVSXNUVUZFYWtNc1EwRkJTaXhGUVVNNFF6dEJRVU0xUXl4VFFVRkhMRWxCUVVrc1dVRkJVRHRCUVVORU8wRkJRMFlzUjBGTVJEczdRVUZQUVN4TlFVRkpMRTlCUVU4c1VVRkJVQ3hMUVVGdlFpeFJRVUY0UWl4RlFVRnJRenRCUVVOb1F5eFJRVUZKTEVsQlFVb3NRMEZCVXl4TFFVRlVMRVZCUVdkQ0xFZEJRV2hDTEVWQlFYRkNMRWxCUVhKQ08wRkJRMEVzVVVGQlNTeEpRVUZLTEVOQlFWTXNSVUZCVkR0QlFVTkVMRWRCU0VRc1RVRkhUenRCUVVOTUxGRkJRVWtzU1VGQlNpeERRVUZUTEUxQlFWUXNSVUZCYVVJc1IwRkJha0lzUlVGQmMwSXNTVUZCZEVJN1FVRkRRU3hSUVVGSkxHZENRVUZLTEVOQlFYRkNMR05CUVhKQ0xFVkJRWEZETEcxRFFVRnlRenRCUVVOQkxGRkJRVWtzU1VGQlNpeERRVUZUTEZGQlFWUTdRVUZEUkR0QlFVTkdPenRCUVVWTkxGTkJRVk1zVlVGQlZDeEhRVUZ6UWp0QlFVTXpRaXhUUVVGUExFdEJRVXNzVFVGQlRDeEhRVUZqTEZGQlFXUXNRMEZCZFVJc1JVRkJka0lzUlVGQk1rSXNUVUZCTTBJc1EwRkJhME1zUTBGQmJFTXNSVUZCY1VNc1JVRkJja01zUTBGQlVEdEJRVU5FT3p0QlFVVk5MRk5CUVZNc2FVSkJRVlFzUTBGQk1rSXNUVUZCTTBJc1JVRkJiVU1zVjBGQmJrTXNSVUZCWjBRN1FVRkRja1FzVTBGQlR5eFZRVUZWTEZkQlFWY3NVVUZCTlVJc1JVRkJjME1zVTBGQlV5eFBRVUZQTEZWQlFYUkVMRVZCUVd0Rk8wRkJRMmhGTEZGQlFVa3NUMEZCVHl4VFFVRlFMRU5CUVdsQ0xGRkJRV3BDTEVOQlFUQkNMRmRCUVRGQ0xFTkJRVW9zUlVGQk5FTTdRVUZETVVNc1lVRkJUeXhOUVVGUU8wRkJRMFE3UVVGRFJqczdRVUZGUkN4VFFVRlBMRWxCUVZBN1FVRkRSRHM3UVVGSFRTeFRRVUZUTEdOQlFWUXNRMEZCZDBJc1RVRkJlRUlzUlVGQlowTXNVVUZCYUVNc1JVRkJNRU03UVVGREwwTXNVMEZCVHl4VlFVRlZMRmRCUVZjc1VVRkJOVUlzUlVGQmMwTXNVMEZCVXl4UFFVRlBMRlZCUVhSRUxFVkJRV3RGTzBGQlEyaEZMRkZCUVVrc1QwRkJUeXhaUVVGUUxFTkJRVzlDTEVsQlFYQkNMRTFCUVRoQ0xGRkJRV3hETEVWQlFUUkRPMEZCUXpGRExHRkJRVThzVFVGQlVEdEJRVU5FTzBGQlEwWTdPMEZCUlVRc1UwRkJUeXhKUVVGUU8wRkJRMFE3TzBGQlJVMHNVMEZCVXl4blFrRkJWQ3hEUVVFd1FpeE5RVUV4UWl4RlFVRnJReXhKUVVGc1F5eEZRVUYzUXp0QlFVTTNReXhUUVVGUExGVkJRVlVzVjBGQlZ5eFJRVUUxUWl4RlFVRnpReXhUUVVGVExFOUJRVThzVlVGQmRFUXNSVUZCYTBVN1FVRkRhRVVzVVVGQlNTeFBRVUZQTEZsQlFWQXNRMEZCYjBJc1NVRkJjRUlzVFVGQk9FSXNTVUZCYkVNc1JVRkJkME03UVVGRGRFTXNZVUZCVHl4TlFVRlFPMEZCUTBRN1FVRkRSanM3UVVGRlJDeFRRVUZQTEVsQlFWQTdRVUZEUkRzN096czdPenM3T3pzN096dEJRMnBFUkRzN096dEJRVU5CT3pzN08wRkJRMEU3TzBGQlEwRTdPenM3T3pzN095dGxRVkpCT3pzN096czdPMEZCVlVFc1NVRkJUU3haUVVGaExGbEJRVTA3UVVGRGRrSTdPenM3T3p0QlFVMUJMRTFCUVUwc1QwRkJUeXhYUVVGaU8wRkJRMEVzVFVGQlRTeFZRVUZWTEU5QlFXaENPMEZCUTBFc1RVRkJUU3h4UWtGQmNVSTdRVUZEZWtJc1lVRkJVenRCUVVSblFpeEhRVUV6UWp0QlFVZEJMRTFCUVUwc2QwSkJRWGRDTEVWQlFUbENPenRCUVVkQk96czdPenM3UVVGbWRVSXNUVUZ4UW1wQ0xGTkJja0pwUWp0QlFVRkJPenRCUVhWQ2NrSXNlVUpCUVRCQ08wRkJRVUVzVlVGQlpDeFBRVUZqTEhWRlFVRktMRVZCUVVrN08wRkJRVUU3TzBGQlFVRXNkMGhCUTJ4Q0xFbEJSR3RDTEVWQlExb3NUMEZFV1N4RlFVTklMR3RDUVVSSExFVkJRMmxDTEU5QlJHcENMRVZCUXpCQ0xIRkNRVVF4UWl4RlFVTnBSQ3hMUVVScVJDeEZRVU4zUkN4TFFVUjRSRHM3UVVGSGVFSXNXVUZCU3l4VFFVRk1MRWRCUVdsQ0xFVkJRV3BDT3p0QlFVVkJMRlZCUVUwc1ZVRkJWU3hOUVVGTExFOUJRVXdzUTBGQllTeFBRVUZpTEVOQlFYRkNMR2RDUVVGeVFpeHZRa0ZCZFVRc1NVRkJka1FzVVVGQmFFSTdRVUZEUVN4WlFVRk5MRWxCUVU0c1EwRkJWeXhQUVVGWUxFVkJRVzlDTEU5QlFYQkNMRU5CUVRSQ0xGVkJRVU1zVFVGQlJDeEZRVUZaTzBGQlEzUkRMRmxCUVUwc1lVRkJZU3hQUVVGUExGbEJRVkFzUTBGQmIwSXNUVUZCY0VJc1EwRkJia0k3UVVGRFFTeFpRVUZOTEZkQlFWY3NVMEZCVXl4aFFVRlVMRU5CUVhWQ0xGVkJRWFpDTEVOQlFXcENPenRCUVVWQkxGbEJRVWtzVVVGQlNpeEZRVUZqTzBGQlExb3NaMEpCUVVzc1YwRkJUQ3hEUVVGcFFpeFJRVUZxUWp0QlFVTkVPMEZCUTBZc1QwRlFSRHRCUVU1M1FqdEJRV042UWpzN1FVRnlRMjlDTzBGQlFVRTdRVUZCUVN4eFEwRjFRMDRzUzBGMlEwMHNSVUYxUTBNN1FVRkRjRUlzV1VGQlRTeExRVUZMTEUxQlFVMHNUVUZCVGl4RFFVRmhMRmxCUVdJc1EwRkJNRUlzVFVGQk1VSXNRMEZCV0R0QlFVTkJMRmxCUVUwc1ZVRkJWU3hUUVVGVExHRkJRVlFzUTBGQmRVSXNSVUZCZGtJc1EwRkJhRUk3TzBGQlJVRXNZVUZCU3l4WlFVRk1MRU5CUVd0Q0xFOUJRV3hDTzBGQlEwUTdRVUUxUTI5Q08wRkJRVUU3UVVGQlFTeHJRMEU0UTFRc1QwRTVRMU1zUlVFNFEwRTdRVUZEYmtJc1dVRkJUU3hYUVVGWExIVkNRVUZoTzBGQlF6VkNPMEZCUkRSQ0xGTkJRV0lzUTBGQmFrSTdRVUZIUVN4aFFVRkxMRk5CUVV3c1EwRkJaU3hKUVVGbUxFTkJRVzlDTEZGQlFYQkNPenRCUVVWQkxHVkJRVThzVVVGQlVEdEJRVU5FTzBGQmNrUnZRanRCUVVGQk8wRkJRVUVzYTBOQmRVUlVMRTlCZGtSVExFVkJkVVJCTzBGQlEyNUNMRmxCUVVrc1YwRkJWeXhMUVVGTExGTkJRVXdzUTBGQlpTeEpRVUZtTEVOQlFXOUNPMEZCUVVFc2FVSkJRVXNzUlVGQlJTeFBRVUZHTEVOQlFWVXNUMEZCVml4RFFVRnJRaXhaUVVGc1FpeERRVUVyUWl4SlFVRXZRaXhOUVVGNVF5eFJRVUZSTEZsQlFWSXNRMEZCY1VJc1NVRkJja0lzUTBGQk9VTTdRVUZCUVN4VFFVRndRaXhEUVVGbU96dEJRVVZCTEZsQlFVa3NRMEZCUXl4UlFVRk1MRVZCUVdVN1FVRkRZanRCUVVOQkxIRkNRVUZYTEV0QlFVc3NWMEZCVEN4RlFVRllPMEZCUTBRN08wRkJSVVFzWlVGQlR5eFJRVUZRTzBGQlEwUTdRVUZvUlc5Q08wRkJRVUU3UVVGQlFTeHhRMEZyUlU0N1FVRkRZaXhsUVVGUExFdEJRVXNzVTBGQldqdEJRVU5FTzBGQmNFVnZRanRCUVVGQk8wRkJRVUVzYlVOQmMwVlNMRmxCZEVWUkxFVkJjMFZOTzBGQlEzcENMRmxCUVUwc1YwRkJWeXhMUVVGTExGZEJRVXdzUTBGQmFVSXNXVUZCYWtJc1EwRkJha0k3UVVGRFFTeGhRVUZMTEZOQlFVd3NRMEZCWlN4UFFVRm1MRU5CUVhWQ0xGVkJRVU1zUTBGQlJDeEZRVUZQTzBGQlF6VkNMR05CUVVrc1JVRkJSU3hQUVVGR0xFTkJRVlVzVDBGQlZpeERRVUZyUWl4WlFVRnNRaXhEUVVFclFpeEpRVUV2UWl4TlFVRjVReXhoUVVGaExGbEJRV0lzUTBGQk1FSXNTVUZCTVVJc1EwRkJOME1zUlVGQk9FVTdRVUZETlVVc1kwRkJSU3hKUVVGR08wRkJRMFFzVjBGR1JDeE5RVVZQTzBGQlEwd3NjVUpCUVZNc1RVRkJWRHRCUVVORU8wRkJRMFlzVTBGT1JEdEJRVTlFTzBGQkwwVnZRanRCUVVGQk8wRkJRVUVzTWtKQmFVWm9RaXhWUVdwR1owSXNSVUZwUmtvN1FVRkRaaXhaUVVGSkxGZEJRVmNzVlVGQlpqdEJRVU5CTEZsQlFVa3NUMEZCVHl4VlFVRlFMRXRCUVhOQ0xGRkJRVEZDTEVWQlFXOURPMEZCUTJ4RExIRkNRVUZYTEZOQlFWTXNZVUZCVkN4RFFVRjFRaXhWUVVGMlFpeERRVUZZTzBGQlEwUTdPMEZCUlVRc1dVRkJTU3hEUVVGRExGRkJRVXdzUlVGQlpUdEJRVU5pTEdkQ1FVRk5MRWxCUVVrc1MwRkJTaXhEUVVGaExFbEJRV0lzTUVKQlFYTkRMRlZCUVhSRExHbERRVUZPTzBGQlEwUTdPMEZCUlVRc1lVRkJTeXhaUVVGTUxFTkJRV3RDTEZGQlFXeENPenRCUVVWQkxHVkJRVThzU1VGQlVEdEJRVU5FTzBGQk9VWnZRanRCUVVGQk8wRkJRVUVzTWtKQlowZG9RaXhWUVdoSFowSXNSVUZuUjBvN1FVRkRaaXhaUVVGSkxGZEJRVmNzVlVGQlpqdEJRVU5CTEZsQlFVa3NUMEZCVHl4VlFVRlFMRXRCUVhOQ0xGRkJRVEZDTEVWQlFXOURPMEZCUTJ4RExIRkNRVUZYTEZOQlFWTXNZVUZCVkN4RFFVRjFRaXhWUVVGMlFpeERRVUZZTzBGQlEwUTdPMEZCUlVRc1dVRkJTU3hEUVVGRExGRkJRVXdzUlVGQlpUdEJRVU5pTEdkQ1FVRk5MRWxCUVVrc1MwRkJTaXhEUVVGaExFbEJRV0lzTUVKQlFYTkRMRlZCUVhSRExHbERRVUZPTzBGQlEwUTdPMEZCUlVRc1dVRkJUU3hqUVVGakxFdEJRVXNzVjBGQlRDeERRVUZwUWl4UlFVRnFRaXhEUVVGd1FqdEJRVU5CTEdWQlFVOHNXVUZCV1N4SlFVRmFMRVZCUVZBN1FVRkRSRHRCUVRWSGIwSTdRVUZCUVR0QlFVRkJMRzFEUVRoSFJEdEJRVU5zUWl4bFFVRlBMRWxCUVZBN1FVRkRSRHRCUVdoSWIwSTdRVUZCUVR0QlFVRkJMRzlEUVd0SVFTeFBRV3hJUVN4RlFXdElVenRCUVVNMVFpd3JSMEZCTWtJc1UwRkJNMElzUlVGQmMwTXNUMEZCZEVNN1FVRkRSRHRCUVhCSWIwSTdPMEZCUVVFN1FVRkJRVHM3UVVGMVNIWkNPenM3T3pzN08wRkJTMEVzVFVGQlRTeGhRVUZoTEVWQlFXNUNPenRCUVVWQkxFMUJRVTBzWVVGQllTeFRRVUZUTEdkQ1FVRlVMRTlCUVRoQ0xFbEJRVGxDTEVOQlFXNUNPMEZCUTBFc1RVRkJTU3hWUVVGS0xFVkJRV2RDTzBGQlEyUXNWVUZCVFN4SlFVRk9MRU5CUVZjc1ZVRkJXQ3hGUVVGMVFpeFBRVUYyUWl4RFFVRXJRaXhWUVVGRExFOUJRVVFzUlVGQllUdEJRVU14UXl4VlFVRk5MRk5CUVZNc01rTkJRVzlDTEU5QlFYQkNMRVZCUVRaQ0xHdENRVUUzUWl4RlFVRnBSQ3h4UWtGQmFrUXNRMEZCWmp0QlFVTkJMR0ZCUVU4c1QwRkJVQ3hIUVVGcFFpeFBRVUZxUWpzN1FVRkZRU3hwUWtGQlZ5eEpRVUZZTEVOQlFXZENMRlZCUVZVc1lVRkJWaXhEUVVGM1FpeE5RVUY0UWl4RFFVRm9RanRCUVVORUxFdEJURVE3UVVGTlJEczdRVUZGUkN4TlFVRkpMRlZCUVVvc1JVRkJaMEk3UVVGRFpDeGhRVUZUTEdkQ1FVRlVMRU5CUVRCQ0xFOUJRVEZDTEVWQlFXMURMRlZCUVVNc1MwRkJSQ3hGUVVGWE8wRkJRelZETEZWQlFVMHNhVUpCUVdsQ0xFMUJRVTBzVFVGQlRpeERRVUZoTEZsQlFXSXNRMEZCTUVJc1lVRkJNVUlzUTBGQmRrSTdRVUZEUVN4VlFVRkpMR3RDUVVGclFpeHRRa0ZCYlVJc1NVRkJla01zUlVGQkswTTdRVUZETjBNc1dVRkJUU3hoUVVGaExFMUJRVTBzVFVGQlRpeERRVUZoTEZsQlFXSXNRMEZCTUVJc1lVRkJNVUlzUzBGQk5FTXNUVUZCVFN4TlFVRk9MRU5CUVdFc1dVRkJZaXhEUVVFd1FpeE5RVUV4UWl4RFFVRXZSRHRCUVVOQkxGbEJRVTBzWVVGQllTeFRRVUZUTEdGQlFWUXNRMEZCZFVJc1ZVRkJka0lzUTBGQmJrSTdPMEZCUlVFc1dVRkJUU3haUVVGWkxEaENRVUZyUWl4TlFVRk5MRTFCUVhoQ0xFVkJRV2RETEZkQlFXaERMRU5CUVd4Q096dEJRVVZCTEZsQlFVa3NZMEZCWXl4SlFVRnNRaXhGUVVGM1FqdEJRVU4wUWp0QlFVTkVPenRCUVVWRUxGbEJRVTBzWTBGQll5eFZRVUZWTEZsQlFWWXNRMEZCZFVJc1NVRkJka0lzUTBGQmNFSTdRVUZEUVN4WlFVRk5MRmxCUVZrc1YwRkJWeXhKUVVGWUxFTkJRV2RDTzBGQlFVRXNhVUpCUVVzc1JVRkJSU3hWUVVGR0xFZEJRV1VzV1VGQlppeERRVUUwUWl4SlFVRTFRaXhOUVVGelF5eFhRVUV6UXp0QlFVRkJMRk5CUVdoQ0xFTkJRV3hDT3p0QlFVVkJMRmxCUVVrc1EwRkJReXhUUVVGTUxFVkJRV2RDTzBGQlEyUTdRVUZEUkRzN1FVRkZSRHRCUVVOQkxGbEJRVTBzYVVKQlFXbENMRlZCUVZVc1dVRkJWaXhIUVVGNVFpeEpRVUY2UWl4RFFVRTRRanRCUVVGQkxHbENRVUZMTEVWQlFVVXNWVUZCUml4UFFVRnRRaXhWUVVGNFFqdEJRVUZCTEZOQlFUbENMRU5CUVhaQ08wRkJRMEVzV1VGQlNTeERRVUZETEdOQlFVd3NSVUZCY1VJN1FVRkRia0lzYjBKQlFWVXNWMEZCVml4RFFVRnpRaXhWUVVGMFFqdEJRVU5FT3p0QlFVVkVMR3RDUVVGVkxFbEJRVllzUTBGQlpTeFZRVUZtTzBGQlEwUTdRVUZEUml4TFFUTkNSRHRCUVRSQ1JEczdRVUZGUkN4VFFVRlBMRk5CUVZBN1FVRkRSQ3hEUVhoTGFVSXNSVUZCYkVJN08ydENRVEJMWlN4VE96czdPenM3T3pzN096czdPMEZETDB0bU96czdPMEZCUTBFN08wRkJRMEU3T3pzN1FVRkRRVHM3T3pzN096czdLMlZCVWtFN096czdPenM3UVVGVlFTeEpRVUZOTEZkQlFWa3NXVUZCVFR0QlFVTjBRanM3T3pzN08wRkJUVUVzVFVGQlRTeFBRVUZQTEZWQlFXSTdRVUZEUVN4TlFVRk5MRlZCUVZVc1QwRkJhRUk3UVVGRFFTeE5RVUZOTEhGQ1FVRnhRanRCUVVONlFpeGhRVUZUTEVsQlJHZENPMEZCUlhwQ0xGbEJRVkU3UVVGR2FVSXNSMEZCTTBJN1FVRkpRU3hOUVVGTkxIZENRVUYzUWl4RFFVTTFRaXhSUVVRMFFpeERRVUU1UWpzN1FVRkpRVHM3T3pzN08wRkJha0p6UWl4TlFYVkNhRUlzVVVGMlFtZENPMEZCUVVFN08wRkJlVUp3UWl4M1FrRkJNRUk3UVVGQlFTeFZRVUZrTEU5QlFXTXNkVVZCUVVvc1JVRkJTVHM3UVVGQlFUczdRVUZCUVN4elNFRkRiRUlzU1VGRWEwSXNSVUZEV2l4UFFVUlpMRVZCUTBnc2EwSkJSRWNzUlVGRGFVSXNUMEZFYWtJc1JVRkRNRUlzY1VKQlJERkNMRVZCUTJsRUxFdEJSR3BFTEVWQlEzZEVMRXRCUkhoRU96dEJRVWQ0UWl4WlFVRkxMRmxCUVV3c1IwRkJiMElzUzBGQmNFSTdPMEZCUlVFN1FVRkRRU3hWUVVGSkxFMUJRVXNzVDBGQlRDeERRVUZoTEUxQlFXcENMRVZCUVhsQ08wRkJRM1pDTEdOQlFVc3NTVUZCVER0QlFVTkVPMEZCVW5WQ08wRkJVM3BDT3p0QlFXeERiVUk3UVVGQlFUdEJRVUZCTEd0RFFXOURVanRCUVVOV0xHVkJRVThzUzBGQlN5eFBRVUZNTEVOQlFXRXNUMEZCWWl4RFFVRnhRaXh4UWtGQmNrSXNRMEZCTWtNc1MwRkJTeXhQUVVGTUxFTkJRV0VzVDBGQmVFUXNSVUZCYVVVc1RVRkJlRVU3UVVGRFJEdEJRWFJEYlVJN1FVRkJRVHRCUVVGQkxDdENRWGREV0R0QlFVTlFMRmxCUVVrc1MwRkJTeXhQUVVGTUxFTkJRV0VzVDBGQllpeERRVUZ4UWl4VFFVRnlRaXhEUVVFclFpeFJRVUV2UWl4RFFVRjNReXhOUVVGNFF5eERRVUZLTEVWQlFYRkVPMEZCUTI1RUxHbENRVUZQTEV0QlFVc3NTVUZCVEN4RlFVRlFPMEZCUTBRN08wRkJSVVFzWlVGQlR5eExRVUZMTEVsQlFVd3NSVUZCVUR0QlFVTkVPMEZCT1VOdFFqdEJRVUZCTzBGQlFVRXNOa0pCWjBSaU8wRkJRVUU3TzBGQlEwd3NXVUZCU1N4TFFVRkxMRmxCUVZRc1JVRkJkVUk3UVVGRGNrSXNhVUpCUVU4c1MwRkJVRHRCUVVORU96dEJRVVZFTEZsQlFVa3NTMEZCU3l4UFFVRk1MRU5CUVdFc1QwRkJZaXhEUVVGeFFpeFRRVUZ5UWl4RFFVRXJRaXhSUVVFdlFpeERRVUYzUXl4TlFVRjRReXhEUVVGS0xFVkJRWEZFTzBGQlEyNUVMR2xDUVVGUExFdEJRVkE3UVVGRFJEczdRVUZGUkN4aFFVRkxMRmxCUVV3c1IwRkJiMElzU1VGQmNFSTdPMEZCUlVFc1dVRkJUU3hqUVVGakxGTkJRV1FzVjBGQll5eEhRVUZOTzBGQlEzaENMR2xDUVVGTExFOUJRVXdzUTBGQllTeFBRVUZpTEVOQlFYRkNMRk5CUVhKQ0xFTkJRU3RDTEVkQlFTOUNMRU5CUVcxRExFMUJRVzVETzBGQlEwRXNhVUpCUVVzc1QwRkJUQ3hEUVVGaExFOUJRV0lzUTBGQmNVSXNVMEZCY2tJc1EwRkJLMElzVFVGQkwwSXNRMEZCYzBNc1dVRkJkRU03UVVGRFFTeHBRa0ZCU3l4UFFVRk1MRU5CUVdFc1QwRkJZaXhEUVVGeFFpeHRRa0ZCY2tJc1EwRkJlVU1zYVVKQlFVMHNZMEZCTDBNc1JVRkJLMFFzVjBGQkwwUTdPMEZCUlVFc2FVSkJRVXNzVDBGQlRDeERRVUZoTEU5QlFXSXNRMEZCY1VJc1dVRkJja0lzUTBGQmEwTXNaVUZCYkVNc1JVRkJiVVFzU1VGQmJrUTdPMEZCUlVFc2FVSkJRVXNzV1VGQlRDeEhRVUZ2UWl4TFFVRndRanRCUVVORUxGTkJVa1E3TzBGQlZVRXNXVUZCU1N4RFFVRkRMRXRCUVVzc1QwRkJUQ3hEUVVGaExFOUJRV0lzUTBGQmNVSXNVMEZCY2tJc1EwRkJLMElzVVVGQkwwSXNRMEZCZDBNc1dVRkJlRU1zUTBGQlRDeEZRVUUwUkR0QlFVTXhSQ3hsUVVGTExFOUJRVXdzUTBGQllTeFBRVUZpTEVOQlFYRkNMRk5CUVhKQ0xFTkJRU3RDTEVkQlFTOUNMRU5CUVcxRExGbEJRVzVETzBGQlEwUTdPMEZCUlVRc1lVRkJTeXhQUVVGTUxFTkJRV0VzVDBGQllpeERRVUZ4UWl4blFrRkJja0lzUTBGQmMwTXNhVUpCUVUwc1kwRkJOVU1zUlVGQk5FUXNWMEZCTlVRN08wRkJSVUVzV1VGQlRTeFRRVUZUTEV0QlFVc3NVMEZCVEN4RlFVRm1PenRCUVVWQkxHRkJRVXNzVDBGQlRDeERRVUZoTEU5QlFXSXNRMEZCY1VJc1MwRkJja0lzUTBGQk1rSXNUVUZCTTBJc1IwRkJiME1zUzBGQmNFTTdPMEZCUlVFc2JVSkJRVmNzV1VGQlRUdEJRVU5tTEdsQ1FVRkxMRTlCUVV3c1EwRkJZU3hQUVVGaUxFTkJRWEZDTEV0QlFYSkNMRU5CUVRKQ0xFMUJRVE5DTEVkQlFYVkRMRTFCUVhaRE8wRkJRMFFzVTBGR1JDeEZRVVZITEVWQlJrZzdPMEZCU1VFc1pVRkJUeXhKUVVGUU8wRkJRMFE3UVVGd1JtMUNPMEZCUVVFN1FVRkJRU3cyUWtGelJtSTdRVUZCUVRzN1FVRkRUQ3haUVVGSkxFdEJRVXNzV1VGQlZDeEZRVUYxUWp0QlFVTnlRaXhwUWtGQlR5eExRVUZRTzBGQlEwUTdPMEZCUlVRc1dVRkJTU3hEUVVGRExFdEJRVXNzVDBGQlRDeERRVUZoTEU5QlFXSXNRMEZCY1VJc1UwRkJja0lzUTBGQkswSXNVVUZCTDBJc1EwRkJkME1zVFVGQmVFTXNRMEZCVEN4RlFVRnpSRHRCUVVOd1JDeHBRa0ZCVHl4TFFVRlFPMEZCUTBRN08wRkJSVVFzWVVGQlN5eFpRVUZNTEVkQlFXOUNMRWxCUVhCQ096dEJRVVZCTEZsQlFVMHNZMEZCWXl4VFFVRmtMRmRCUVdNc1IwRkJUVHRCUVVONFFpeHBRa0ZCU3l4UFFVRk1MRU5CUVdFc1QwRkJZaXhEUVVGeFFpeFRRVUZ5UWl4RFFVRXJRaXhOUVVFdlFpeERRVUZ6UXl4WlFVRjBRenRCUVVOQkxHbENRVUZMTEU5QlFVd3NRMEZCWVN4UFFVRmlMRU5CUVhGQ0xFdEJRWEpDTEVOQlFUSkNMRTFCUVROQ0xFZEJRVzlETEUxQlFYQkRPMEZCUTBFc2FVSkJRVXNzVDBGQlRDeERRVUZoTEU5QlFXSXNRMEZCY1VJc2JVSkJRWEpDTEVOQlFYbERMR2xDUVVGTkxHTkJRUzlETEVWQlFTdEVMRmRCUVM5RU96dEJRVVZCTEdsQ1FVRkxMRTlCUVV3c1EwRkJZU3hQUVVGaUxFTkJRWEZDTEZsQlFYSkNMRU5CUVd0RExHVkJRV3hETEVWQlFXMUVMRXRCUVc1RU96dEJRVVZCTEdsQ1FVRkxMRmxCUVV3c1IwRkJiMElzUzBGQmNFSTdRVUZEUkN4VFFWSkVPenRCUVZWQkxHRkJRVXNzVDBGQlRDeERRVUZoTEU5QlFXSXNRMEZCY1VJc1MwRkJja0lzUTBGQk1rSXNUVUZCTTBJc1IwRkJiME1zUzBGQmNFTTdPMEZCUlVFc1dVRkJTU3hEUVVGRExFdEJRVXNzVDBGQlRDeERRVUZoTEU5QlFXSXNRMEZCY1VJc1UwRkJja0lzUTBGQkswSXNVVUZCTDBJc1EwRkJkME1zV1VGQmVFTXNRMEZCVEN4RlFVRTBSRHRCUVVNeFJDeGxRVUZMTEU5QlFVd3NRMEZCWVN4UFFVRmlMRU5CUVhGQ0xGTkJRWEpDTEVOQlFTdENMRWRCUVM5Q0xFTkJRVzFETEZsQlFXNURPMEZCUTBRN08wRkJSVVFzWVVGQlN5eFBRVUZNTEVOQlFXRXNUMEZCWWl4RFFVRnhRaXhuUWtGQmNrSXNRMEZCYzBNc2FVSkJRVTBzWTBGQk5VTXNSVUZCTkVRc1YwRkJOVVE3TzBGQlJVRXNZVUZCU3l4UFFVRk1MRU5CUVdFc1QwRkJZaXhEUVVGeFFpeFRRVUZ5UWl4RFFVRXJRaXhOUVVFdlFpeERRVUZ6UXl4TlFVRjBRenM3UVVGRlFTeGxRVUZQTEVsQlFWQTdRVUZEUkR0QlFYUkliVUk3UVVGQlFUdEJRVUZCTEcxRFFYZElRVHRCUVVOc1FpeGxRVUZQTEVsQlFWQTdRVUZEUkR0QlFURkliVUk3UVVGQlFUdEJRVUZCTEc5RFFUUklReXhQUVRWSVJDeEZRVFJJVlR0QlFVTTFRaXcyUjBGQk1rSXNVVUZCTTBJc1JVRkJjVU1zVDBGQmNrTTdRVUZEUkR0QlFUbEliVUk3TzBGQlFVRTdRVUZCUVRzN1FVRnBTWFJDT3pzN096czdPMEZCUzBFc1RVRkJUU3hoUVVGaExFVkJRVzVDT3p0QlFVVkJMRTFCUVUwc1dVRkJXU3hUUVVGVExHZENRVUZVTEU5QlFUaENMRWxCUVRsQ0xFTkJRV3hDTzBGQlEwRXNUVUZCU1N4VFFVRktMRVZCUVdVN1FVRkRZaXhqUVVGVkxFOUJRVllzUTBGQmEwSXNWVUZCUXl4UFFVRkVMRVZCUVdFN1FVRkROMEk3UVVGRFFTeFZRVUZOTEZOQlFWTXNNa05CUVc5Q0xFOUJRWEJDTEVWQlFUWkNMR3RDUVVFM1FpeEZRVUZwUkN4eFFrRkJha1FzUTBGQlpqdEJRVU5CTEdGQlFVOHNUMEZCVUN4SFFVRnBRaXhQUVVGcVFqczdRVUZGUVN4cFFrRkJWeXhKUVVGWUxFTkJRV2RDTEZOQlFWTXNZVUZCVkN4RFFVRjFRaXhOUVVGMlFpeERRVUZvUWp0QlFVTkVMRXRCVGtRN1FVRlBSRHM3UVVGRlJDeE5RVUZKTEZOQlFVb3NSVUZCWlR0QlFVTmlMR0ZCUVZNc1owSkJRVlFzUTBGQk1FSXNUMEZCTVVJc1JVRkJiVU1zVlVGQlF5eExRVUZFTEVWQlFWYzdRVUZETlVNc1ZVRkJUU3hUUVVGVExEWkNRVUZwUWl4TlFVRk5MRTFCUVhaQ0xFVkJRU3RDTEdGQlFTOUNMRU5CUVdZN1FVRkRRU3hWUVVGSkxFTkJRVU1zVFVGQlRDeEZRVUZoTzBGQlExZzdRVUZEUkRzN1FVRkZSQ3hWUVVGTkxHbENRVUZwUWl4UFFVRlBMRmxCUVZBc1EwRkJiMElzWVVGQmNFSXNRMEZCZGtJN08wRkJSVUVzVlVGQlNTeHJRa0ZCYTBJc2JVSkJRVzFDTEVsQlFYcERMRVZCUVN0RE8wRkJRemRETEZsQlFVa3NTMEZCU3l4UFFVRlBMRmxCUVZBc1EwRkJiMElzWVVGQmNFSXNTMEZCYzBNc1QwRkJUeXhaUVVGUUxFTkJRVzlDTEUxQlFYQkNMRU5CUVM5RE8wRkJRMEVzWVVGQlN5eEhRVUZITEU5QlFVZ3NRMEZCVnl4SFFVRllMRVZCUVdkQ0xFVkJRV2hDTEVOQlFVdzdPMEZCUlVFc1dVRkJUU3haUVVGWkxGZEJRVmNzU1VGQldDeERRVUZuUWp0QlFVRkJMR2xDUVVGTExFVkJRVVVzVlVGQlJpeEhRVUZsTEZsQlFXWXNRMEZCTkVJc1NVRkJOVUlzVFVGQmMwTXNSVUZCTTBNN1FVRkJRU3hUUVVGb1FpeERRVUZzUWpzN1FVRkZRU3haUVVGSkxFTkJRVU1zVTBGQlRDeEZRVUZuUWp0QlFVTmtPMEZCUTBRN08wRkJSVVFzYTBKQlFWVXNUVUZCVmp0QlFVTkVPMEZCUTBZc1MwRndRa1E3UVVGeFFrUTdPMEZCUlVRc1UwRkJUeXhSUVVGUU8wRkJRMFFzUTBFMVMyZENMRVZCUVdwQ096dHJRa0U0UzJVc1VUczdPenM3T3pzN08zRnFRa040VEdZN096czdPenM3UVVGTFFUczdRVUZEUVRzN1FVRkRRVHM3T3p0QlFVTkJPenM3T3pzN096dEJRVVZCT3pzN096czdTVUZOY1VJc1V6dEJRVVZ1UWl4eFFrRkJXU3hKUVVGYUxFVkJRV3RDTEU5QlFXeENMRVZCUVcxSk8wRkJRVUVzVVVGQmVFY3NZMEZCZDBjc2RVVkJRWFpHTEVWQlFYVkdPMEZCUVVFc1VVRkJia1lzVDBGQmJVWXNkVVZCUVhwRkxFVkJRWGxGTzBGQlFVRXNVVUZCY2tVc1YwRkJjVVVzZFVWQlFYWkVMRVZCUVhWRU96dEJRVUZCT3p0QlFVRkJMRkZCUVc1RUxIRkNRVUZ0UkN4MVJVRkJNMElzUzBGQk1rSTdRVUZCUVN4UlFVRndRaXhWUVVGdlFpeDFSVUZCVUN4TFFVRlBPenRCUVVGQk96dEJRVU5xU1N4VFFVRkxMRWxCUVV3c1IwRkJXU3hKUVVGYU8wRkJRMEVzVTBGQlN5eFBRVUZNTEVkQlFXVXNUMEZCWmp0QlFVTkJMRk5CUVVzc1QwRkJUQ3hIUVVGbExFOUJRV1k3TzBGQlJVRTdRVUZEUVR0QlFVTkJMRmRCUVU4c1NVRkJVQ3hEUVVGWkxHTkJRVm9zUlVGQk5FSXNUMEZCTlVJc1EwRkJiME1zVlVGQlF5eEpRVUZFTEVWQlFWVTdRVUZETlVNc1ZVRkJTU3hQUVVGUExFMUJRVXNzVDBGQlRDeERRVUZoTEVsQlFXSXNRMEZCVUN4TFFVRTRRaXhYUVVGc1F5eEZRVUVyUXp0QlFVTTNReXhqUVVGTExFOUJRVXdzUTBGQllTeEpRVUZpTEVsQlFYRkNMR1ZCUVdVc1NVRkJaaXhEUVVGeVFqdEJRVU5FTzBGQlEwWXNTMEZLUkRzN1FVRk5RU3hUUVVGTExGZEJRVXdzUjBGQmJVSXNWMEZCYmtJN1FVRkRRU3hUUVVGTExIRkNRVUZNTEVkQlFUWkNMSEZDUVVFM1FqdEJRVU5CTEZOQlFVc3NWVUZCVEN4SFFVRnJRaXhWUVVGc1FqdEJRVU5CTEZOQlFVc3NSVUZCVEN4SFFVRlZMSGRDUVVGV096dEJRVVZCTEZGQlFVMHNaVUZCWlN4RFFVRkRMRXRCUVVzc2NVSkJRVTRzU1VGQkswSXNTMEZCU3l4UFFVRk1MRU5CUVdFc1QwRkJZaXhMUVVGNVFpeEpRVUUzUlRzN1FVRkZRU3hSUVVGSkxFOUJRVThzUzBGQlN5eFBRVUZNTEVOQlFXRXNUMEZCY0VJc1MwRkJaME1zVVVGQmNFTXNSVUZCT0VNN1FVRkROVU1zVjBGQlN5eFBRVUZNTEVOQlFXRXNUMEZCWWl4SFFVRjFRaXhUUVVGVExHRkJRVlFzUTBGQmRVSXNTMEZCU3l4UFFVRk1MRU5CUVdFc1QwRkJjRU1zUTBGQmRrSTdRVUZEUkRzN1FVRkZSQ3hSUVVGSkxHZENRVUZuUWl4RFFVRkRMRXRCUVVzc1QwRkJUQ3hEUVVGaExFOUJRV3hETEVWQlFUSkRPMEZCUTNwRExGbEJRVTBzU1VGQlNTeExRVUZLTEVOQlFXRXNTMEZCU3l4SlFVRnNRaXg1UTBGQlRqdEJRVU5FT3p0QlFVVkVMRk5CUVVzc1kwRkJUQ3hIUVVGelFpeExRVUZMTEU5QlFVd3NRMEZCWVN4UFFVRmlMRXRCUVhsQ0xFbEJRUzlETzBGQlEwRXNVMEZCU3l4clFrRkJUQ3hIUVVFd1FpeEZRVUV4UWpzN1FVRkZRU3hSUVVGSkxFTkJRVU1zUzBGQlN5eGpRVUZXTEVWQlFUQkNPMEZCUTNoQ096czdPenM3T3p0QlFWRkJMRmRCUVVzc1QwRkJUQ3hIUVVGbExFOUJRVThzVFVGQlVDeERRVUZqTEV0QlFVc3NUMEZCYmtJc1JVRkJORUlzUzBGQlN5eGpRVUZNTEVOQlFXOUNMRXRCUVVzc1lVRkJUQ3hGUVVGd1FpeEZRVUV3UXl4UFFVRXhReXhEUVVFMVFpeERRVUZtT3p0QlFVVkJPMEZCUTBFc1YwRkJTeXhoUVVGTU8wRkJRMFE3TzBGQlJVUXNVMEZCU3l4bFFVRk1MRWRCUVhWQ08wRkJRVUVzWVVGQlV5eE5RVUZMTEc5Q1FVRk1MRU5CUVRCQ0xFdEJRVEZDTEVOQlFWUTdRVUZCUVN4TFFVRjJRanRCUVVORU96czdPMjFEUVVWakxGVXNSVUZCV1N4UExFVkJRVk03UVVGRGJFTXNWMEZCU3l4WFFVRk1MRU5CUVdsQ0xFOUJRV3BDTEVOQlFYbENMRlZCUVVNc1IwRkJSQ3hGUVVGVE8wRkJRMmhETEZsQlFVa3NVVUZCVVN4SFFVRlNMRU5CUVVvc1JVRkJhMEk3UVVGRGFFSXNjVUpCUVZjc1IwRkJXQ3hKUVVGclFpeFJRVUZSTEVkQlFWSXNRMEZCYkVJN1FVRkRSRHRCUVVOR0xFOUJTa1E3TzBGQlRVRXNZVUZCVHl4VlFVRlFPMEZCUTBRN096dHBRMEZGV1R0QlFVTllMR0ZCUVU4c1MwRkJTeXhQUVVGYU8wRkJRMFE3T3p0cFEwRkZXVHRCUVVOWUxHRkJRVThzUzBGQlN5eFBRVUZNTEVOQlFXRXNUMEZCY0VJN1FVRkRSRHM3T3pSQ1FVVlBPMEZCUTA0c1lVRkJUeXhMUVVGTExFVkJRVm83UVVGRFJEczdPM0ZEUVVWblFpeFJMRVZCUVZVN1FVRkJRVHM3UVVGRGVrSXNaVUZCVXl4UFFVRlVMRU5CUVdsQ08wRkJRVUVzWlVGQlZ5eFBRVUZMTEdWQlFVd3NRMEZCY1VJc1QwRkJja0lzUTBGQldEdEJRVUZCTEU5QlFXcENPMEZCUTBRN096dHZRMEZGWlN4UExFVkJRVk03UVVGRGRrSXNZMEZCVVN4TlFVRlNMRU5CUVdVc1owSkJRV1lzUTBGQlowTXNVVUZCVVN4TFFVRjRReXhGUVVFclF5eExRVUZMTEdWQlFYQkVPMEZCUTBFc1YwRkJTeXhyUWtGQlRDeERRVUYzUWl4SlFVRjRRaXhEUVVFMlFpeFBRVUUzUWp0QlFVTkVPenM3ZVVOQlJXOUNPMEZCUVVFN08wRkJRMjVDTEZkQlFVc3NhMEpCUVV3c1EwRkJkMElzVDBGQmVFSXNRMEZCWjBNc1ZVRkJReXhQUVVGRUxFVkJRV0U3UVVGRE0wTXNaVUZCU3l4cFFrRkJUQ3hEUVVGMVFpeFBRVUYyUWp0QlFVTkVMRTlCUmtRN1FVRkhSRHM3TzNORFFVVnBRaXhQTEVWQlFWTTdRVUZEZWtJc1ZVRkJUU3g1UWtGQmVVSXNTMEZCU3l4clFrRkJUQ3hEUVVNMVFpeFRRVVEwUWl4RFFVTnNRanRCUVVGQkxHVkJRVTBzUjBGQlJ5eE5RVUZJTEV0QlFXTXNVVUZCVVN4TlFVRjBRaXhKUVVGblF5eEhRVUZITEV0QlFVZ3NTMEZCWVN4UlFVRlJMRXRCUVRORU8wRkJRVUVzVDBGRWEwSXNRMEZCTDBJN08wRkJSMEVzVlVGQlNTeDVRa0ZCZVVJc1EwRkJReXhEUVVFNVFpeEZRVUZwUXp0QlFVTXZRaXhuUWtGQlVTeE5RVUZTTEVOQlFXVXNiVUpCUVdZc1EwRkJiVU1zVVVGQlVTeExRVUV6UXl4RlFVRnJSQ3hMUVVGTExHVkJRWFpFTzBGQlEwRXNZVUZCU3l4clFrRkJUQ3hEUVVGM1FpeE5RVUY0UWl4RFFVRXJRaXh6UWtGQkwwSXNSVUZCZFVRc1EwRkJka1E3UVVGRFJDeFBRVWhFTEUxQlIwODdRVUZEVEN4blFrRkJVU3hMUVVGU0xESkRRVUZ6UkN4UlFVRlJMRTFCUVRsRUxIRkNRVUZ2Uml4UlFVRlJMRXRCUVRWR08wRkJRMFE3UVVGRFJqczdPMmxEUVVWWkxGTXNSVUZCYVVRN1FVRkJRU3hWUVVGMFF5eE5RVUZ6UXl4MVJVRkJOMElzUlVGQk5rSTdRVUZCUVN4VlFVRjZRaXhsUVVGNVFpeDFSVUZCVUN4TFFVRlBPenRCUVVNMVJDeFZRVUZKTEU5QlFVOHNVMEZCVUN4TFFVRnhRaXhSUVVGNlFpeEZRVUZ0UXp0QlFVTnFReXhqUVVGTkxFbEJRVWtzUzBGQlNpeERRVUZWTERoQ1FVRldMRU5CUVU0N1FVRkRSRHM3UVVGRlJDeFZRVUZKTEV0QlFVc3NWVUZCVkN4RlFVRnhRanRCUVVOdVFpeFpRVUZKTEdOQlFXTXNhVUpCUVUwc1NVRkJlRUlzUlVGQk9FSTdRVUZETlVJc2NVTkJRV2xDTEVkQlFXcENMRU5CUVhGQ0xFbEJRWEpDTzBGQlEwUXNVMEZHUkN4TlFVVlBMRWxCUVVrc1kwRkJZeXhwUWtGQlRTeEpRVUY0UWl4RlFVRTRRanRCUVVOdVF5eHhRMEZCYVVJc1RVRkJha0lzUTBGQmQwSXNTVUZCZUVJN1FVRkRSRHRCUVVOR096dEJRVVZFTzBGQlEwRXNWVUZCVFN4clFrRkJhMElzVlVGQlZTeExRVUZXTEVOQlFXZENMRWRCUVdoQ0xFVkJRWEZDTEUxQlFYSkNMRU5CUVRSQ0xGVkJRVU1zUjBGQlJDeEZRVUZOTEU5QlFVNHNSVUZCWlN4TFFVRm1MRVZCUVhsQ08wRkJRek5GTEZsQlFVa3NWVUZCVlN4RFFVRmtMRVZCUVdsQ08wRkJRMllzYVVKQlFVOHNUMEZCVUR0QlFVTkVPenRCUVVWRUxHVkJRVThzVFVGQlRTeFJRVUZSTEUxQlFWSXNRMEZCWlN4RFFVRm1MRVZCUVd0Q0xGZEJRV3hDTEVWQlFVNHNSMEZCZDBNc1VVRkJVU3hMUVVGU0xFTkJRV01zUTBGQlpDeERRVUV2UXp0QlFVTkVMRTlCVG5WQ0xFTkJRWGhDT3p0QlFWRkJMRlZCUVUwc2QwSkJRWE5DTEdkQ1FVRm5RaXhOUVVGb1FpeERRVUYxUWl4RFFVRjJRaXhGUVVFd1FpeFhRVUV4UWl4RlFVRjBRaXhIUVVGblJTeG5Ra0ZCWjBJc1MwRkJhRUlzUTBGQmMwSXNRMEZCZEVJc1EwRkJkRVU3TzBGQlJVRTdRVUZEUVN4VlFVRkpMRTlCUVU4c1MwRkJTeXhQUVVGTUxFTkJRV0VzWlVGQllpeERRVUZRTEV0QlFYbERMRlZCUVRkRExFVkJRWGxFTzBGQlEzWkVMR0ZCUVVzc1QwRkJUQ3hEUVVGaExHVkJRV0lzUlVGQk9FSXNTMEZCT1VJc1EwRkJiME1zU1VGQmNFTXNSVUZCTUVNc1EwRkJReXhOUVVGRUxFTkJRVEZETzBGQlEwUTdPMEZCUlVRc1ZVRkJTU3hQUVVGUExFdEJRVXNzVDBGQlRDeERRVUZoTEdOQlFXSXNRMEZCVUN4TFFVRjNReXhWUVVFMVF5eEZRVUYzUkR0QlFVTjBSQ3hoUVVGTExFOUJRVXdzUTBGQllTeGpRVUZpTEVWQlFUWkNMRXRCUVRkQ0xFTkJRVzFETEVsQlFXNURMRVZCUVhsRExFTkJRVU1zVFVGQlJDeERRVUY2UXp0QlFVTkVPenRCUVVWRUxGVkJRVWtzWlVGQlNpeEZRVUZ4UWp0QlFVTnVRanRCUVVORU96dEJRVVZFTzBGQlEwRXNWVUZCU1N4TFFVRkxMRTlCUVV3c1EwRkJZU3hQUVVGcVFpeEZRVUV3UWp0QlFVTjRRaXcwUTBGQmNVSXNTMEZCU3l4UFFVRk1MRU5CUVdFc1QwRkJiRU1zUlVGQk1rTXNVMEZCTTBNc1JVRkJjMFFzUzBGQlN5eEpRVUV6UkN4RlFVRnBSU3hOUVVGcVJUdEJRVU5FTEU5QlJrUXNUVUZGVHp0QlFVTk1MREpEUVVGdlFpeFRRVUZ3UWl4RlFVRXJRaXhMUVVGTExFbEJRWEJETEVWQlFUQkRMRTFCUVRGRE8wRkJRMFE3UVVGRFJqczdPMjlEUVVWbE8wRkJRMlFzVlVGQlNTeExRVUZMTEZkQlFVd3NRMEZCYVVJc1RVRkJha0lzUjBGQk1FSXNRMEZCT1VJc1JVRkJhVU03UVVGREwwSXNiVVJCUVc5Q0xFdEJRVXNzVDBGQlRDeERRVUZoTEU5QlFXcERMRVZCUVRCRExFdEJRVXNzVDBGQkwwTXNSVUZCZDBRc1MwRkJTeXhYUVVFM1JEdEJRVU5FTzBGQlEwWTdPenR2UTBGRlpUdEJRVU5rTEZWQlFVMHNWVUZCVlN4UFFVRlBMRTFCUVZBc1EwRkJZeXhGUVVGa0xFVkJRV3RDTEV0QlFVc3NUMEZCZGtJc1EwRkJhRUk3UVVGRFFTeGhRVUZQTERKRFFVRnZRaXhMUVVGTExFOUJRVXdzUTBGQllTeFBRVUZxUXl4RlFVRXdReXhQUVVFeFF5eEZRVUZ0UkN4TFFVRkxMRmRCUVhoRUxFTkJRVkE3UVVGRFJEczdRVUZGUkRzN096czdPenM3YzBOQlMydENPMEZCUTJoQ0xHRkJRVThzUzBGQlN5eFZRVUZNTEVsQlFXMUNMRU5CUVVNc01rSkJRV2xDTEZGQlFXcENMRU5CUVRCQ0xFbEJRVEZDTEVOQlFUTkNPMEZCUTBRN096dDVRMEZGYjBJc1N5eEZRVUZQTzBGQlF6RkNMRlZCUVVrc1MwRkJTeXhsUVVGTUxFVkJRVW9zUlVGQk5FSTdRVUZETVVJN1FVRkRSRHM3UVVGRlJDeFhRVUZMTEdOQlFVd3NRMEZCYjBJc1MwRkJjRUk3UVVGRFJEczdPMjFEUVVWakxFc3NSVUZCVHp0QlFVTndRanRCUVVORU96czdhVU5CUlcxQ08wRkJRMnhDTEdGQlFVOHNTMEZCU3l4SlFVRmFPMEZCUTBRN096dHJRMEZGYjBJc1l5eEZRVUZuUWl4UExFVkJRVk03UVVGRE5VTXNZVUZCVHl4SlFVRkpMR05CUVVvc1EwRkJiVUlzVDBGQmJrSXNRMEZCVUR0QlFVTkVPenM3T3pzN2EwSkJka3hyUWl4VE96czdPenM3T3pzN096dFJRMUpNTEcxQ0xFZEJRVUVzYlVJN1VVRjNRa0VzYlVJc1IwRkJRU3h0UWpzN1FVRXZRbWhDTEVsQlFVMHNaVUZCWlN4VFFVRm1MRmxCUVdVc1EwRkJReXhMUVVGRUxFVkJRVkVzVFVGQlVpeEZRVUZ0UWp0QlFVTjBReXhOUVVGSkxGVkJRVlVzUlVGQlpDeEZRVUZyUWp0QlFVTm9RaXh4UWtGQlpTeE5RVUZtTzBGQlEwUTdRVUZEUkN4dFFrRkJaU3hMUVVGbUxGTkJRWGRDTEUxQlFYaENPMEZCUTBRc1EwRk1SRHM3UVVGUFR5eFRRVUZUTEcxQ1FVRlVMRU5CUVRaQ0xFOUJRVGRDTEVWQlFXMUZPMEZCUVVFc1RVRkJOMElzUjBGQk5rSXNkVVZCUVhaQ0xFVkJRWFZDTzBGQlFVRXNUVUZCYmtJc1MwRkJiVUk3UVVGQlFTeE5RVUZhTEV0QlFWa3NkVVZCUVVvc1JVRkJTVHM3UVVGRGVFVXNUVUZCVFN4UFFVRlBMRTlCUVU4c1NVRkJVQ3hEUVVGWkxFZEJRVm9zUTBGQllqczdRVUZGUVN4UFFVRkxMRTlCUVV3c1EwRkJZU3hWUVVGRExFZEJRVVFzUlVGQlV6dEJRVU53UWl4UlFVRkpMRlZCUVZVc1JVRkJWaXhKUVVGblFpeE5RVUZOTEU5QlFVNHNRMEZCWXl4SFFVRmtMRTFCUVhWQ0xFTkJRVU1zUTBGQk5VTXNSVUZCSzBNN1FVRkROME03UVVGRFFUdEJRVU5FT3p0QlFVVkVMRkZCUVVrc1VVRkJUeXhKUVVGSkxFZEJRVW9zUTBGQlVDeE5RVUZ2UWl4UlFVRndRaXhKUVVGblF5eEpRVUZKTEVkQlFVb3NUVUZCWVN4SlFVRnFSQ3hGUVVGMVJEdEJRVU55UkN4VlFVRkpMRmRCUVZjc1IwRkJaanRCUVVOQkxGVkJRVWtzVlVGQlZTeEZRVUZrTEVWQlFXdENPMEZCUTJoQ0xHMUNRVUZqTEV0QlFXUXNVMEZCZFVJc1IwRkJka0k3UVVGRFJEczdRVUZGUkN3d1FrRkJiMElzVDBGQmNFSXNSVUZCTmtJc1NVRkJTU3hIUVVGS0xFTkJRVGRDTEVWQlFYVkRMRXRCUVhaRExFVkJRVGhETEZGQlFUbERPMEZCUTBFN1FVRkRSRHM3UVVGRlJDeFJRVUZOTEU5QlFVOHNZVUZCWVN4TFFVRmlMRVZCUVc5Q0xFZEJRWEJDTEVOQlFXSTdRVUZEUVN4WlFVRlJMRmxCUVZJc1EwRkJjVUlzU1VGQmNrSXNSVUZCTWtJc1NVRkJTU3hIUVVGS0xFTkJRVE5DTzBGQlEwUXNSMEZzUWtRN1FVRnRRa1E3TzBGQlJVMHNVMEZCVXl4dFFrRkJWQ3hEUVVFMlFpeFBRVUUzUWl4RlFVRnRSVHRCUVVGQkxFMUJRVGRDTEVkQlFUWkNMSFZGUVVGMlFpeEZRVUYxUWp0QlFVRkJMRTFCUVc1Q0xFdEJRVzFDTzBGQlFVRXNUVUZCV2l4TFFVRlpMSFZGUVVGS0xFVkJRVWs3TzBGQlEzaEZMRTFCUVUwc1UwRkJVeXhQUVVGUExFMUJRVkFzUTBGQll5eEZRVUZrTEVWQlFXdENMRWRCUVd4Q0xFTkJRV1k3UVVGRFFTeE5RVUZOTEU5QlFVOHNUMEZCVHl4SlFVRlFMRU5CUVZrc1IwRkJXaXhEUVVGaU96dEJRVVZCTEU5QlFVc3NUMEZCVEN4RFFVRmhMRlZCUVVNc1IwRkJSQ3hGUVVGVE8wRkJRM0JDTEZGQlFVa3NWVUZCVlN4RlFVRldMRWxCUVdkQ0xFMUJRVTBzVDBGQlRpeERRVUZqTEVkQlFXUXNUVUZCZFVJc1EwRkJReXhEUVVFMVF5eEZRVUVyUXp0QlFVTTNRenRCUVVOQk8wRkJRMFE3TzBGQlJVUXNVVUZCU1N4SlFVRkpMRWRCUVVvc1RVRkJZU3hKUVVGaUxFbEJRWEZDTEVsQlFVa3NSMEZCU2l4RlFVRlRMRmRCUVZRc1MwRkJlVUlzVFVGQmJFUXNSVUZCTUVRN1FVRkRlRVFzVlVGQlNTeFhRVUZYTEVkQlFXWTdRVUZEUVN4VlFVRkpMRlZCUVZVc1JVRkJaQ3hGUVVGclFqdEJRVU5vUWl4dFFrRkJZeXhMUVVGa0xGTkJRWFZDTEVkQlFYWkNPMEZCUTBRN08wRkJSVVFzWVVGQlR5eEhRVUZRTEVsQlFXTXNiMEpCUVc5Q0xFOUJRWEJDTEVWQlFUWkNMRWxCUVVrc1IwRkJTaXhEUVVFM1FpeEZRVUYxUXl4TFFVRjJReXhGUVVFNFF5eFJRVUU1UXl4RFFVRmtPMEZCUTBFN1FVRkRSRHM3UVVGRlJEdEJRVU5CTEZGQlFVa3NVVUZCVVN4SlFVRkpMRWRCUVVvc1EwRkJXaXhEUVdwQ2IwSXNRMEZwUWtNN1FVRkRja0lzVVVGQlRTeGpRVUZqTEV0QlFXUXNlVU5CUVdNc1MwRkJaQ3hEUVVGT08wRkJRMEVzVVVGQlRTeFBRVUZQTEdGQlFXRXNTMEZCWWl4RlFVRnZRaXhIUVVGd1FpeERRVUZpTzBGQlEwRXNVVUZCVFN4WlFVRlpMRkZCUVZFc1dVRkJVaXhEUVVGeFFpeEpRVUZ5UWl4RFFVRnNRanM3UVVGRlFTeFJRVUZKTEdOQlFXTXNTVUZCYkVJc1JVRkJkMEk3UVVGRGRFSXNWVUZCU1N4VFFVRlRMRk5CUVdJc1JVRkJkMEk3UVVGRGRFSTdRVUZEUVN4blFrRkJVU3hqUVVGakxFMUJRWFJDTzBGQlEwUXNUMEZJUkN4TlFVZFBMRWxCUVVrc1EwRkJReXhOUVVGTkxGTkJRVTRzUTBGQlRDeEZRVUYxUWp0QlFVTTFRaXhuUWtGQlVTeFRRVUZUTEZOQlFWUXNSVUZCYjBJc1JVRkJjRUlzUTBGQlVqdEJRVU5FTEU5QlJrMHNUVUZGUVR0QlFVTk1MR2RDUVVGUkxGTkJRVkk3UVVGRFJEdEJRVU5HT3p0QlFVVkVMRmRCUVU4c1IwRkJVQ3hKUVVGakxFdEJRV1E3UVVGRFJDeEhRV3hEUkRzN1FVRnZRMEVzVTBGQlR5eE5RVUZRTzBGQlEwUTdPMEZCUlVRc1NVRkJUU3hSUVVGUkxFVkJRV1E3TzJ0Q1FVVmxPMEZCUTJJc1MwRkVZU3hsUVVOVUxGTkJSRk1zUlVGRFJUdEJRVU5pTEZWQlFVMHNTVUZCVGl4RFFVRlhMRk5CUVZnN1FVRkRSQ3hIUVVoWk8wRkJTV0lzVVVGS1lTeHJRa0ZKVGl4VFFVcE5MRVZCU1VzN1FVRkRhRUlzVVVGQlRTeFJRVUZSTEUxQlFVMHNVMEZCVGl4RFFVRm5RanRCUVVGQkxHRkJRVXNzVDBGQlR5eEZRVUZRTEVOQlFWVXNVMEZCVml4RlFVRnhRaXhEUVVGeVFpeERRVUZNTzBGQlFVRXNTMEZCYUVJc1EwRkJaRHRCUVVOQkxGRkJRVWtzVVVGQlVTeERRVUZETEVOQlFXSXNSVUZCWjBJN1FVRkRaQ3haUVVGTkxFMUJRVTRzUTBGQllTeExRVUZpTEVWQlFXOUNMRU5CUVhCQ08wRkJRMFE3UVVGRFJpeEhRVlJaTzBGQlZXSXNWVUZXWVN4dlFrRlZTaXhUUVZaSkxFVkJWVTg3UVVGRGJFSXNWMEZCVHl4TlFVRk5MRTFCUVU0c1MwRkJhVUlzUTBGQmFrSXNTVUZCYzBJc1QwRkJUeXhGUVVGUUxFTkJRVlVzVFVGQlRTeE5RVUZOTEUxQlFVNHNSMEZCWlN4RFFVRnlRaXhEUVVGV0xFVkJRVzFETEZOQlFXNURMRU5CUVRkQ08wRkJRMFE3UVVGYVdTeERPenM3T3pzN096czdPenM3TzBGRGVFVm1PenM3TzBGQlEwRTdPenM3UVVGRFFUczdPenM3T3pzN0syVkJVRUU3T3pzN096czdRVUZUUVN4SlFVRk5MRk5CUVZVc1dVRkJUVHRCUVVOd1FqczdPenM3TzBGQlRVRXNUVUZCVFN4UFFVRlBMRkZCUVdJN1FVRkRRU3hOUVVGTkxGVkJRVlVzVDBGQmFFSTdRVUZEUVN4TlFVRk5MRzlDUVVGdlFpeHBRa0ZCTVVJN1FVRkRRU3hOUVVGTkxIRkNRVUZ4UWp0QlFVTjZRaXhoUVVGVExFbEJSR2RDTzBGQlJYcENMRmRCUVU4c1NVRkdhMEk3UVVGSGVrSXNZVUZCVXl4SlFVaG5RanRCUVVsNlFpeG5Ra0ZCV1R0QlFVcGhMRWRCUVROQ08wRkJUVUVzVFVGQlRTeDNRa0ZCZDBJc1EwRkROVUlzV1VGRU5FSXNRMEZCT1VJN08wRkJTVUU3T3pzN096dEJRWEJDYjBJc1RVRXdRbVFzVFVFeFFtTTdRVUZCUVRzN1FVRTBRbXhDTEhOQ1FVRXlRenRCUVVGQkxGVkJRUzlDTEU5QlFTdENMSFZGUVVGeVFpeEZRVUZ4UWp0QlFVRkJMRlZCUVdwQ0xGRkJRV2xDTEhWRlFVRk9MRWxCUVUwN08wRkJRVUU3TzBGQlFVRXNhMGhCUTI1RExFbEJSRzFETEVWQlF6ZENMRTlCUkRaQ0xFVkJRM0JDTEd0Q1FVUnZRaXhGUVVOQkxFOUJSRUVzUlVGRFV5eHhRa0ZFVkN4RlFVTm5ReXhKUVVSb1F5eEZRVU56UXl4SlFVUjBRenM3UVVGSGVrTXNXVUZCU3l4UlFVRk1MRWRCUVdkQ0xGbEJRVmtzUzBGRE5VSXNhMFJCUkRSQ0xFZEJSVEZDTERSRFFVWXdRaXhIUVVkNFFpdzRRa0ZJZDBJc1IwRkpkRUlzTmtKQlNuTkNMRWRCUzNCQ0xHZERRVXh2UWl4SFFVMTBRaXhSUVU1elFpeEhRVTkwUWl3eVFrRlFjMElzUjBGUmNFSXNVMEZTYjBJc1IwRlRkRUlzVVVGVWMwSXNSMEZWZEVJc05rSkJWbk5DTEVkQlYzQkNMR2xHUVZodlFpeEhRVmwwUWl4UlFWcHpRaXhIUVdGNFFpeFJRV0ozUWl4SFFXTXhRaXhSUVdRd1FpeEhRV1UxUWl4UlFXWkJPenRCUVdsQ1FTeFZRVUZKTEUxQlFVc3NZMEZCVkN4RlFVRjVRanRCUVVOMlFpeGpRVUZMTEV0QlFVdzdRVUZEUkR0QlFYUkNkME03UVVGMVFqRkRPenRCUVc1RWFVSTdRVUZCUVR0QlFVRkJMRGhDUVhGRVZqdEJRVU5PTEZsQlFVMHNWVUZCVlN4VFFVRlRMR0ZCUVZRc1EwRkJkVUlzUzBGQmRrSXNRMEZCYUVJN08wRkJSVUVzWjBKQlFWRXNVMEZCVWl4SFFVRnZRaXhMUVVGTExGRkJRWHBDT3p0QlFVVkJMR0ZCUVVzc1QwRkJUQ3hEUVVGaExFOUJRV0lzUjBGQmRVSXNVVUZCVVN4VlFVRXZRanM3UVVGRlFUdEJRVU5CTEZsQlFVa3NTMEZCU3l4UFFVRk1MRU5CUVdFc1MwRkJZaXhMUVVGMVFpeEpRVUV6UWl4RlFVRnBRenRCUVVNdlFpeGxRVUZMTEU5QlFVd3NRMEZCWVN4UFFVRmlMRU5CUVhGQ0xHRkJRWEpDTEVOQlFXMURMR1ZCUVc1RExFVkJRVzlFTEZOQlFYQkVMRWRCUVdkRkxFdEJRVXNzVDBGQlRDeERRVUZoTEV0QlFUZEZPMEZCUTBRN08wRkJSVVE3UVVGRFFTeFpRVUZKTEV0QlFVc3NUMEZCVEN4RFFVRmhMRTlCUVdJc1MwRkJlVUlzU1VGQk4wSXNSVUZCYlVNN1FVRkRha01zWlVGQlN5eFBRVUZNTEVOQlFXRXNUMEZCWWl4RFFVRnhRaXhoUVVGeVFpeERRVUZ0UXl4alFVRnVReXhGUVVGdFJDeFZRVUZ1UkN4RFFVRTRSQ3hUUVVFNVJDeEhRVUV3UlN4TFFVRkxMRTlCUVV3c1EwRkJZU3hQUVVGMlJqdEJRVU5FT3p0QlFVVkVMR2xDUVVGVExFbEJRVlFzUTBGQll5eFhRVUZrTEVOQlFUQkNMRXRCUVVzc1QwRkJUQ3hEUVVGaExFOUJRWFpET3p0QlFVVkJMR0ZCUVVzc1lVRkJURHRCUVVORU8wRkJla1ZwUWp0QlFVRkJPMEZCUVVFc2MwTkJNa1ZHTzBGQlEyUXNXVUZCVFN4WFFVRlhMRk5CUVZNc1lVRkJWQ3hEUVVGMVFpeExRVUYyUWl4RFFVRnFRanRCUVVOQkxHbENRVUZUTEZsQlFWUXNRMEZCYzBJc1UwRkJkRUlzUlVGQmFVTXNTMEZCU3l4RlFVRjBRenRCUVVOQkxHbENRVUZUTEZOQlFWUXNRMEZCYlVJc1IwRkJia0lzUTBGQmRVSXNhVUpCUVhaQ096dEJRVVZCTEdsQ1FVRlRMRWxCUVZRc1EwRkJZeXhYUVVGa0xFTkJRVEJDTEZGQlFURkNPMEZCUTBRN1FVRnFSbWxDTzBGQlFVRTdRVUZCUVN4dlEwRnRSa283UVVGRFdpeGxRVUZQTEZOQlFWTXNZVUZCVkN4UFFVRXlRaXhwUWtGQk0wSXNhMEpCUVhsRUxFdEJRVXNzUlVGQk9VUXNVVUZCVUR0QlFVTkVPMEZCY2tacFFqdEJRVUZCTzBGQlFVRXNLMEpCZFVaVU8wRkJRMUFzV1VGQlRTeG5Ra0ZCWjBJc1QwRkJUeXhuUWtGQlVDeERRVUYzUWl4TFFVRkxMRTlCUVV3c1EwRkJZU3hQUVVGeVF5eERRVUYwUWp0QlFVTkJPMEZCUTBFc1dVRkJUU3hUUVVGVExHTkJRV01zVFVGQlpDeERRVUZ4UWl4TFFVRnlRaXhEUVVFeVFpeERRVUV6UWl4RlFVRTRRaXhqUVVGakxFMUJRV1FzUTBGQmNVSXNUVUZCY2tJc1IwRkJPRUlzUTBGQk5VUXNRMEZCWmpzN1FVRkZRU3haUVVGTkxFMUJRVThzVDBGQlR5eFhRVUZRTEVkQlFYRkNMRU5CUVhSQ0xFZEJRVFJDTEZOQlFWTXNRMEZCYWtRN1FVRkRRU3hoUVVGTExFOUJRVXdzUTBGQllTeFBRVUZpTEVOQlFYRkNMRXRCUVhKQ0xFTkJRVEpDTEVkQlFUTkNMRWRCUVc5RExFZEJRWEJETzBGQlEwUTdRVUU1Um1sQ08wRkJRVUU3UVVGQlFTdzJRa0ZuUjFnN1FVRkJRVHM3UVVGRFRDeFpRVUZKTEV0QlFVc3NUMEZCVEN4RFFVRmhMRTlCUVdJc1MwRkJlVUlzU1VGQk4wSXNSVUZCYlVNN1FVRkRha003UVVGRFFTeGxRVUZMTEV0QlFVdzdRVUZEUkRzN1FVRkZSQ3haUVVGSkxFdEJRVXNzVDBGQlRDeERRVUZoTEU5QlFXSXNRMEZCY1VJc1UwRkJja0lzUTBGQkswSXNVVUZCTDBJc1EwRkJkME1zVFVGQmVFTXNRMEZCU2l4RlFVRnhSRHRCUVVOdVJDeHBRa0ZCVHl4TFFVRlFPMEZCUTBRN08wRkJSVVE3UVVGRFFTeHRRa0ZCVnl4WlFVRk5PMEZCUTJZc2FVSkJRVXNzV1VGQlRDeERRVUZyUWl4cFFrRkJUU3hKUVVGNFFqdEJRVU5CTEdsQ1FVRkxMR0ZCUVV3N08wRkJSVUVzWTBGQlRTeFZRVUZWTEZOQlFWWXNUMEZCVlN4SFFVRk5PMEZCUTNCQ0xHMUNRVUZMTEZsQlFVd3NRMEZCYTBJc2FVSkJRVTBzUzBGQmVFSTdRVUZEUVN4dFFrRkJTeXhQUVVGTUxFTkJRV0VzVDBGQllpeERRVUZ4UWl4dFFrRkJja0lzUTBGQmVVTXNhVUpCUVUwc1kwRkJMME1zUlVGQkswUXNUMEZCTDBRN08wRkJSVUU3UVVGRFFTeHRRa0ZCU3l4WlFVRk1PMEZCUTBRc1YwRk9SRHM3UVVGUlFTeHBRa0ZCU3l4UFFVRk1MRU5CUVdFc1QwRkJZaXhEUVVGeFFpeG5Ra0ZCY2tJc1EwRkJjME1zYVVKQlFVMHNZMEZCTlVNc1JVRkJORVFzVDBGQk5VUTdPMEZCUlVFc2FVSkJRVXNzVDBGQlRDeERRVUZoTEU5QlFXSXNRMEZCY1VJc1UwRkJja0lzUTBGQkswSXNSMEZCTDBJc1EwRkJiVU1zVFVGQmJrTTdPMEZCUlVFc2FVSkJRVXNzVFVGQlREdEJRVU5FTEZOQmFrSkVMRVZCYVVKSExFVkJha0pJT3p0QlFXMUNRU3hsUVVGUExFbEJRVkE3UVVGRFJEdEJRUzlJYVVJN1FVRkJRVHRCUVVGQkxIRkRRV2xKU0N4TFFXcEpSeXhGUVdsSlNUdEJRVU53UWl4WlFVRkpMRTFCUVUwc1NVRkJUaXhMUVVGbExFOUJRV1lzU1VGQk1FSXNUVUZCVFN4UFFVRk9MRXRCUVd0Q0xFVkJRVFZETEVsQlFXdEVMRTFCUVUwc1QwRkJUaXhMUVVGclFpeEZRVUY0UlN4RlFVRTBSVHRCUVVNeFJUdEJRVU5FT3p0QlFVVkVPMEZCUTBFc1lVRkJTeXhKUVVGTU8wRkJRMFE3UVVGNFNXbENPMEZCUVVFN1FVRkJRU3cyUWtFd1NWZzdRVUZCUVRzN1FVRkRUQ3haUVVGSkxFTkJRVU1zUzBGQlN5eFBRVUZNTEVOQlFXRXNUMEZCWWl4RFFVRnhRaXhUUVVGeVFpeERRVUVyUWl4UlFVRXZRaXhEUVVGM1F5eE5RVUY0UXl4RFFVRk1MRVZCUVhORU8wRkJRM0JFTEdsQ1FVRlBMRXRCUVZBN1FVRkRSRHM3UVVGRlJDeGhRVUZMTEZsQlFVd3NRMEZCYTBJc2FVSkJRVTBzU1VGQmVFSTdPMEZCUlVFc1lVRkJTeXhaUVVGTU96dEJRVVZCTEdGQlFVc3NUMEZCVEN4RFFVRmhMRTlCUVdJc1EwRkJjVUlzVTBGQmNrSXNRMEZCSzBJc1IwRkJMMElzUTBGQmJVTXNUVUZCYmtNN1FVRkRRU3hoUVVGTExFOUJRVXdzUTBGQllTeFBRVUZpTEVOQlFYRkNMRk5CUVhKQ0xFTkJRU3RDTEUxQlFTOUNMRU5CUVhORExFMUJRWFJET3p0QlFVVkJMRmxCUVUwc1YwRkJWeXhMUVVGTExGZEJRVXdzUlVGQmFrSTdPMEZCUlVFc1dVRkJUU3hYUVVGWExGTkJRVmdzVVVGQlZ5eEhRVUZOTzBGQlEzSkNMRzFDUVVGVExFbEJRVlFzUTBGQll5eFhRVUZrTEVOQlFUQkNMRkZCUVRGQ096dEJRVVZCTEdsQ1FVRkxMRTlCUVV3c1EwRkJZU3hQUVVGaUxFTkJRWEZDTEZOQlFYSkNMRU5CUVN0Q0xFMUJRUzlDTEVOQlFYTkRMRTFCUVhSRE96dEJRVVZCTEdsQ1FVRkxMRmxCUVV3c1EwRkJhMElzYVVKQlFVMHNUVUZCZUVJN08wRkJSVUVzYlVKQlFWTXNiVUpCUVZRc1EwRkJOa0lzYVVKQlFVMHNZMEZCYmtNc1JVRkJiVVFzVVVGQmJrUTdPMEZCUlVFN1FVRkRRU3hqUVVGSkxFOUJRVXNzWTBGQlZDeEZRVUY1UWp0QlFVTjJRaXh4UWtGQlV5eEpRVUZVTEVOQlFXTXNWMEZCWkN4RFFVRXdRaXhQUVVGTExFOUJRVXdzUTBGQllTeFBRVUYyUXp0QlFVTkJMRzFDUVVGTExFOUJRVXdzUTBGQllTeFBRVUZpTEVkQlFYVkNMRWxCUVhaQ08wRkJRMFE3UVVGRFJpeFRRV1JFT3p0QlFXZENRU3hwUWtGQlV5eG5Ra0ZCVkN4RFFVRXdRaXhwUWtGQlRTeGpRVUZvUXl4RlFVRm5SQ3hSUVVGb1JEdEJRVU5CTEdsQ1FVRlRMRk5CUVZRc1EwRkJiVUlzUjBGQmJrSXNRMEZCZFVJc1UwRkJka0k3TzBGQlJVRXNaVUZCVHl4SlFVRlFPMEZCUTBRN1FVRTFTMmxDTzBGQlFVRTdRVUZCUVN4eFEwRTRTMGc3UVVGQlFUczdRVUZEWWl4WlFVRk5MR2xDUVVGcFFpeExRVUZMTEU5QlFVd3NRMEZCWVN4UFFVRmlMRU5CUVhGQ0xHZENRVUZ5UWl4RFFVRnpReXhuUWtGQmRFTXNRMEZCZGtJN1FVRkRRU3haUVVGSkxHTkJRVW9zUlVGQmIwSTdRVUZEYkVJc1owSkJRVTBzU1VGQlRpeERRVUZYTEdOQlFWZ3NSVUZCTWtJc1QwRkJNMElzUTBGQmJVTTdRVUZCUVN4dFFrRkJWU3hQUVVGTExHVkJRVXdzUTBGQmNVSXNSVUZCUlN4UlFVRlJMRTFCUVZZc1JVRkJhMElzVDBGQlR5eFBRVUY2UWl4RlFVRnlRaXhEUVVGV08wRkJRVUVzVjBGQmJrTTdRVUZEUkRzN1FVRkZSRHRCUVVOQk8wRkJRMEU3UVVGRFFTeFpRVUZKTEV0QlFVc3NUMEZCVEN4RFFVRmhMRlZCUVdwQ0xFVkJRVFpDTzBGQlF6TkNMR05CUVUwc1YwRkJWeXhMUVVGTExGZEJRVXdzUlVGQmFrSTdRVUZEUVN4bFFVRkxMR1ZCUVV3c1EwRkJjVUlzUlVGQlJTeFJRVUZSTEZGQlFWWXNSVUZCYjBJc1QwRkJUeXhwUWtGQlRTeExRVUZxUXl4RlFVRnlRanRCUVVOQkxHVkJRVXNzWlVGQlRDeERRVUZ4UWl4RlFVRkZMRkZCUVZFc1VVRkJWaXhGUVVGdlFpeFBRVUZQTEU5QlFUTkNMRVZCUVhKQ08wRkJRMFE3UVVGRFJqdEJRVFZNYVVJN1FVRkJRVHRCUVVGQkxIRkRRVGhNU0R0QlFVRkJPenRCUVVOaUxGbEJRVTBzYVVKQlFXbENMRXRCUVVzc1QwRkJUQ3hEUVVGaExFOUJRV0lzUTBGQmNVSXNaMEpCUVhKQ0xFTkJRWE5ETEdkQ1FVRjBReXhEUVVGMlFqdEJRVU5CTEZsQlFVa3NZMEZCU2l4RlFVRnZRanRCUVVOc1FpeG5Ra0ZCVFN4SlFVRk9MRU5CUVZjc1kwRkJXQ3hGUVVFeVFpeFBRVUV6UWl4RFFVRnRRenRCUVVGQkxHMUNRVUZWTEU5QlFVc3NhVUpCUVV3c1EwRkJkVUlzUlVGQlJTeFJRVUZSTEUxQlFWWXNSVUZCYTBJc1QwRkJUeXhQUVVGNlFpeEZRVUYyUWl4RFFVRldPMEZCUVVFc1YwRkJia003UVVGRFJEczdRVUZGUkN4WlFVRkpMRXRCUVVzc1QwRkJUQ3hEUVVGaExGVkJRV3BDTEVWQlFUWkNPMEZCUXpOQ0xHTkJRVTBzVjBGQlZ5eExRVUZMTEZkQlFVd3NSVUZCYWtJN1FVRkRRU3hsUVVGTExHbENRVUZNTEVOQlFYVkNMRVZCUVVVc1VVRkJVU3hSUVVGV0xFVkJRVzlDTEU5QlFVOHNhVUpCUVUwc1MwRkJha01zUlVGQmRrSTdRVUZEUVN4bFFVRkxMR2xDUVVGTUxFTkJRWFZDTEVWQlFVVXNVVUZCVVN4UlFVRldMRVZCUVc5Q0xFOUJRVThzVDBGQk0wSXNSVUZCZGtJN1FVRkRSRHRCUVVOR08wRkJlazFwUWp0QlFVRkJPMEZCUVVFc2JVTkJNazFGTzBGQlEyeENMR1ZCUVU4c1NVRkJVRHRCUVVORU8wRkJOMDFwUWp0QlFVRkJPMEZCUVVFc2IwTkJLMDFITEU5QkwwMUlMRVZCSzAxWk8wRkJRelZDTEhsSFFVRXlRaXhOUVVFelFpeEZRVUZ0UXl4UFFVRnVRenRCUVVORU8wRkJhazVwUWpzN1FVRkJRVHRCUVVGQk96dEJRVzlPY0VJN096czdPenM3UVVGTFFTeE5RVUZOTEdGQlFXRXNSVUZCYmtJN08wRkJSVUVzVFVGQlRTeFZRVUZWTEZOQlFWTXNaMEpCUVZRc1QwRkJPRUlzU1VGQk9VSXNRMEZCYUVJN1FVRkRRU3hOUVVGSkxFOUJRVW9zUlVGQllUdEJRVU5ZTEZWQlFVMHNTVUZCVGl4RFFVRlhMRTlCUVZnc1JVRkJiMElzVDBGQmNFSXNRMEZCTkVJc1ZVRkJReXhQUVVGRUxFVkJRV0U3UVVGRGRrTXNWVUZCVFN4VFFVRlRMREpEUVVGdlFpeFBRVUZ3UWl4RlFVRTJRaXhyUWtGQk4wSXNSVUZCYVVRc2NVSkJRV3BFTEVOQlFXWTdRVUZEUVN4aFFVRlBMRTlCUVZBc1IwRkJhVUlzVDBGQmFrSTdPMEZCUlVFc2FVSkJRVmNzU1VGQldDeERRVUZuUWl4RlFVRkZMR2RDUVVGR0xFVkJRVmNzVVVGQlVTeEpRVUZKTEUxQlFVb3NRMEZCVnl4TlFVRllMRU5CUVc1Q0xFVkJRV2hDTzBGQlEwUXNTMEZNUkR0QlFVMUVPenRCUVVWRUxFMUJRVWtzVDBGQlNpeEZRVUZoTzBGQlExZ3NZVUZCVXl4blFrRkJWQ3hEUVVFd1FpeFBRVUV4UWl4RlFVRnRReXhWUVVGRExFdEJRVVFzUlVGQlZ6dEJRVU0xUXl4VlFVRk5MR2xDUVVGcFFpeE5RVUZOTEUxQlFVNHNRMEZCWVN4WlFVRmlMRU5CUVRCQ0xHRkJRVEZDTEVOQlFYWkNPMEZCUTBFc1ZVRkJTU3hyUWtGQmEwSXNiVUpCUVcxQ0xFbEJRWHBETEVWQlFTdERPMEZCUXpkRExGbEJRVTBzUzBGQlN5eE5RVUZOTEUxQlFVNHNRMEZCWVN4WlFVRmlMRU5CUVRCQ0xHRkJRVEZDTEVOQlFWZzdRVUZEUVN4WlFVRk5MRlZCUVZVc1UwRkJVeXhoUVVGVUxFTkJRWFZDTEVWQlFYWkNMRU5CUVdoQ096dEJRVVZCTEZsQlFVMHNXVUZCV1N4WFFVRlhMRWxCUVZnc1EwRkJaMEk3UVVGQlFTeHBRa0ZCU3l4RlFVRkZMRTlCUVVZc1MwRkJZeXhQUVVGdVFqdEJRVUZCTEZOQlFXaENMRU5CUVd4Q096dEJRVVZCTEZsQlFVa3NRMEZCUXl4VFFVRk1MRVZCUVdkQ08wRkJRMlE3UVVGRFJEczdRVUZGUkR0QlFVTkJMR05CUVUwc1RVRkJUaXhEUVVGaExFbEJRV0k3TzBGQlJVRXNhMEpCUVZVc1RVRkJWaXhEUVVGcFFpeEpRVUZxUWp0QlFVTkVPMEZCUTBZc1MwRnFRa1E3UVVGclFrUTdPMEZCUlVRc1UwRkJUeXhOUVVGUU8wRkJRMFFzUTBFelVHTXNSVUZCWmpzN2EwSkJObEJsTEUwN096czdPenM3T3pzN08wRkRhbEZtT3pzN08wRkJRMEU3TzBGQlEwRTdPenM3T3pzN095dGxRVkJCT3pzN096czdPMEZCVTBFc1NVRkJUU3hUUVVGVkxGbEJRVTA3TzBGQlJYQkNPenM3T3pzN1FVRk5RU3hOUVVGTkxFOUJRVThzVVVGQllqdEJRVU5CTEUxQlFVMHNiMEpCUVc5Q0xHbENRVUV4UWp0QlFVTkJMRTFCUVUwc2NVSkJRWEZDTzBGQlEzcENMR0ZCUVZNc1NVRkVaMEk3UVVGRmVrSXNWMEZCVHl4SlFVWnJRanRCUVVkNlFpeGhRVUZUTEVsQlNHZENPMEZCU1hwQ0xHZENRVUZaTzBGQlNtRXNSMEZCTTBJN1FVRk5RU3hOUVVGTkxIZENRVUYzUWl4RFFVTTFRaXhaUVVRMFFpeERRVUU1UWpzN1FVRkpRVHM3T3pzN08wRkJjRUp2UWl4TlFUQkNaQ3hOUVRGQ1l6dEJRVUZCT3p0QlFUUkNiRUlzYzBKQlFUQkNPMEZCUVVFc1ZVRkJaQ3hQUVVGakxIVkZRVUZLTEVWQlFVazdPMEZCUVVFN08wRkJRM2hDTEZWQlFVMHNWMEZCVnl4TFFVTnFRaXhyUkVGRWFVSXNSMEZGWml3MFEwRkdaU3hIUVVkaUxEaENRVWhoTEVkQlNWZ3NOa0pCU2xjc1IwRkxWQ3huUTBGTVV5eEhRVTFZTEZGQlRsY3NSMEZQV0N3eVFrRlFWeXhIUVZGVUxHMUVRVkpUTEVkQlUxZ3NVVUZVVnl4SFFWVllMRFpDUVZaWExFZEJWMVFzYVVaQldGTXNSMEZaV0N4UlFWcFhMRWRCWVdJc1VVRmlZU3hIUVdObUxGRkJaR1VzUjBGbGFrSXNVVUZtUVRzN1FVRkVkMElzTmtkQmEwSnNRaXhQUVd4Q2EwSXNSVUZyUWxRc1VVRnNRbE03UVVGdFFucENPenRCUVM5RGFVSTdRVUZCUVR0QlFVRkJMRzlEUVdsRVJ5eFBRV3BFU0N4RlFXbEVXVHRCUVVNMVFpeGxRVUZQTEVsQlFVa3NUVUZCU2l4RFFVRlhMRTlCUVZnc1EwRkJVRHRCUVVORU8wRkJia1JwUWpzN1FVRkJRVHRCUVVGQk96dEJRWE5FY0VJN096czdPenM3UVVGTFFTeE5RVUZOTEdGQlFXRXNSVUZCYmtJN1FVRkRRU3hOUVVGTkxGVkJRVlVzVTBGQlV5eG5Ra0ZCVkN4UFFVRTRRaXhKUVVFNVFpeERRVUZvUWpzN1FVRkZRU3hOUVVGSkxFOUJRVW9zUlVGQllUdEJRVU5ZTEZWQlFVMHNTVUZCVGl4RFFVRlhMRTlCUVZnc1JVRkJiMElzVDBGQmNFSXNRMEZCTkVJc1ZVRkJReXhQUVVGRUxFVkJRV0U3UVVGRGRrTXNWVUZCVFN4VFFVRlRMREpEUVVGdlFpeFBRVUZ3UWl4RlFVRTJRaXhyUWtGQk4wSXNSVUZCYVVRc2NVSkJRV3BFTEVOQlFXWTdRVUZEUVN4aFFVRlBMRTlCUVZBc1IwRkJhVUlzVDBGQmFrSTdPMEZCUlVFc1ZVRkJTU3hQUVVGUExFbEJRVkFzUzBGQlowSXNUMEZCY0VJc1JVRkJOa0k3UVVGRE0wSTdRVUZEUVN4dFFrRkJWeXhKUVVGWUxFTkJRV2RDTEVsQlFVa3NUVUZCU2l4RFFVRlhMRTFCUVZnc1EwRkJhRUk3UVVGRFJEdEJRVU5HTEV0QlVrUTdRVUZUUkRzN1FVRkZSQ3hOUVVGSkxFOUJRVW9zUlVGQllUdEJRVU5ZTEdGQlFWTXNaMEpCUVZRc1EwRkJNRUlzVDBGQk1VSXNSVUZCYlVNc1ZVRkJReXhMUVVGRUxFVkJRVmM3UVVGRE5VTXNWVUZCVFN4bFFVRmxMRGhDUVVGclFpeE5RVUZOTEUxQlFYaENMRVZCUVdkRExHVkJRV2hETEVOQlFYSkNPMEZCUTBFc1ZVRkJTU3haUVVGS0xFVkJRV3RDTzBGQlEyaENPMEZCUTBRN08wRkJSVVFzVlVGQlRTeFhRVUZYTERoQ1FVRnJRaXhOUVVGTkxFMUJRWGhDTEVWQlFXZERMRlZCUVdoRExFTkJRV3BDT3p0QlFVVkJMRlZCUVVrc1VVRkJTaXhGUVVGak8wRkJRMW9zV1VGQlRTeHBRa0ZCYVVJc1UwRkJVeXhaUVVGVUxFTkJRWE5DTEdGQlFYUkNMRU5CUVhaQ08wRkJRMEVzV1VGQlNTeHJRa0ZCYTBJc2JVSkJRVzFDTEVsQlFYSkRMRWxCUVRaRExGRkJRV3BFTEVWQlFUSkVPMEZCUTNwRUxHTkJRVTBzV1VGQldTeFhRVUZYTEVsQlFWZ3NRMEZCWjBJN1FVRkJRU3h0UWtGQlN5eEZRVUZGTEZWQlFVWXNUMEZCYlVJc1VVRkJlRUk3UVVGQlFTeFhRVUZvUWl4RFFVRnNRanM3UVVGRlFTeGpRVUZKTEVOQlFVTXNVMEZCVEN4RlFVRm5RanRCUVVOa08wRkJRMFE3TzBGQlJVUXNiMEpCUVZVc1RVRkJWanRCUVVORU8wRkJRMFk3UVVGRFJpeExRWEJDUkR0QlFYRkNSRHM3UVVGRlJDeFRRVUZQTEUxQlFWQTdRVUZEUkN4RFFXNUhZeXhGUVVGbU96dHJRa0Z4UjJVc1RUczdPenM3T3pzN096czdPenRCUTNwSFpqczdPenRCUVVOQk96czdPMEZCUTBFN08wRkJRMEU3T3pzN096czdPeXRsUVZKQk96czdPenM3TzBGQlZVRXNTVUZCVFN4WFFVRlpMRmxCUVUwN1FVRkRkRUk3T3pzN096dEJRVTFCTEUxQlFVMHNUMEZCVHl4VlFVRmlPMEZCUTBFc1RVRkJUU3hWUVVGVkxFOUJRV2hDTzBGQlEwRXNUVUZCVFN4eFFrRkJjVUk3UVVGRGVrSXNZVUZCVXl4SlFVUm5RanRCUVVWNlFpeGhRVUZUTEVsQlJtZENPMEZCUjNwQ0xGbEJRVkU3UVVGSWFVSXNSMEZCTTBJN1FVRkxRU3hOUVVGTkxIZENRVUYzUWl4RFFVTTFRaXhUUVVRMFFpeEZRVVUxUWl4UlFVWTBRaXhEUVVFNVFqczdRVUZMUVRzN096czdPMEZCYmtKelFpeE5RWGxDYUVJc1VVRjZRbWRDTzBGQlFVRTdPMEZCTWtKd1FpeDNRa0ZCTUVJN1FVRkJRU3hWUVVGa0xFOUJRV01zZFVWQlFVb3NSVUZCU1RzN1FVRkJRVHM3UVVGQlFTeHpTRUZEYkVJc1NVRkVhMElzUlVGRFdpeFBRVVJaTEVWQlEwZ3NhMEpCUkVjc1JVRkRhVUlzVDBGRWFrSXNSVUZETUVJc2NVSkJSREZDTEVWQlEybEVMRXRCUkdwRUxFVkJRM2RFTEV0QlJIaEVPenRCUVVkNFFpeFZRVUZOTEZkQlFWY3NUVUZCU3l4UFFVRk1MRU5CUVdFc1QwRkJZaXhEUVVGeFFpeGhRVUZ5UWl4RFFVRnRReXhwUWtGQmJrTXNRMEZCYWtJN1FVRkRRU3hWUVVGTkxFOUJRVThzVFVGQlN5eFhRVUZNTEVOQlFXbENMRkZCUVdwQ0xFTkJRV0k3TzBGQlJVRXNXVUZCU3l4WFFVRk1MRU5CUVdsQ0xFdEJRVXNzUzBGQmRFSXNSVUZCTmtJc1MwRkJTeXhKUVVGc1F5eEZRVUYzUXl4TFFVRjRRenRCUVU1M1FqdEJRVTk2UWpzN1FVRnNRMjFDTzBGQlFVRTdRVUZCUVN4dlEwRnZRM0ZETzBGQlFVRXNXVUZCTjBNc1MwRkJOa01zZFVWQlFYSkRMRVZCUVhGRE96dEJRVUZCT3p0QlFVRkJMRmxCUVdwRExFbEJRV2xETEhWRlFVRXhRaXhKUVVFd1FqdEJRVUZCTEZsQlFYQkNMRmRCUVc5Q0xIVkZRVUZPTEVsQlFVMDdPMEZCUTNaRUxGbEJRVWtzUTBGQlF5eExRVUZMTEU5QlFVd3NRMEZCWVN4UFFVRnNRaXhGUVVFeVFqdEJRVU42UWl4cFFrRkJUeXhMUVVGUU8wRkJRMFE3TzBGQlJVUXNXVUZCU1N4alFVRmpMRWxCUVd4Q08wRkJRMEVzWVVGQlN5eFBRVUZNTEVOQlFXRXNUMEZCWWl4RFFVRnhRaXhoUVVGeVFpeERRVUZ0UXl4bFFVRnVReXhGUVVGdlJDeFRRVUZ3UkN4SFFVRm5SU3hKUVVGb1JUdEJRVU5CTEdGQlFVc3NUMEZCVEN4RFFVRmhMRTlCUVdJc1EwRkJjVUlzWVVGQmNrSXNRMEZCYlVNc2MwSkJRVzVETEVWQlFUSkVMRXRCUVRORUxFZEJRVzFGTEV0QlFXNUZPenRCUVVWQkxGbEJRVTBzVVVGQlVTeExRVUZMTEU5QlFVd3NRMEZCWVN4UFFVRmlMRU5CUVhGQ0xHZENRVUZ5UWl4RFFVRnpReXhQUVVGMFF5eExRVUZyUkN4RlFVRm9SVHRCUVVOQkxGbEJRVWtzV1VGQldTeExRVUZvUWpzN1FVRkZRU3hqUVVGTkxFbEJRVTRzUTBGQlZ5eExRVUZZTEVWQlFXdENMRTlCUVd4Q0xFTkJRVEJDTEZWQlFVTXNTVUZCUkN4RlFVRlZPMEZCUTJ4RExHTkJRVWtzUzBGQlN5eFRRVUZNTEVOQlFXVXNVVUZCWml4RFFVRjNRaXhWUVVGNFFpeERRVUZLTEVWQlFYbERPMEZCUTNaRExHbENRVUZMTEZOQlFVd3NRMEZCWlN4TlFVRm1MRU5CUVhOQ0xGVkJRWFJDTzBGQlEwUTdPMEZCUlVRc1kwRkJUU3hQUVVGUExFOUJRVXNzVjBGQlRDeERRVUZwUWl4SlFVRnFRaXhEUVVGaU96dEJRVVZCTEdOQlFVa3NWVUZCVlN4TFFVRkxMRXRCUVc1Q0xFVkJRVEJDTzBGQlEzaENMR2RDUVVGSkxFTkJRVU1zUzBGQlN5eFRRVUZNTEVOQlFXVXNVVUZCWml4RFFVRjNRaXhWUVVGNFFpeERRVUZNTEVWQlFUQkRPMEZCUTNoRExHMUNRVUZMTEZOQlFVd3NRMEZCWlN4SFFVRm1MRU5CUVcxQ0xGVkJRVzVDTzBGQlEwUTdPMEZCUlVRc01FSkJRV01zUzBGQlN5eEpRVUZ1UWp0QlFVTkJMSGRDUVVGWkxFbEJRVm83UVVGRFJEdEJRVU5HTEZOQlprUTdPMEZCYVVKQkxGbEJRVWtzWlVGQlpTeFRRVUZ1UWl4RlFVRTRRanRCUVVNMVFpeGxRVUZMTEU5QlFVd3NRMEZCWVN4UFFVRmlMRU5CUVhGQ0xHRkJRWEpDTEVOQlFXMURMR1ZCUVc1RExFVkJRVzlFTEZOQlFYQkVMRWRCUVdkRkxGZEJRV2hGTzBGQlEwUXNVMEZHUkN4TlFVVlBMRWxCUVVrc1pVRkJaU3hEUVVGRExGTkJRWEJDTEVWQlFTdENPMEZCUTNCRExHZENRVUZOTEVsQlFVa3NTMEZCU2l4RFFVRmhMRWxCUVdJc2NVSkJRV2xETEV0QlFXcERMRFJEUVVGT08wRkJRMFE3TzBGQlJVUXNaVUZCVHl4SlFVRlFPMEZCUTBRN1FVRjRSVzFDTzBGQlFVRTdRVUZCUVN4dlEwRXdSVTQ3UVVGRFdpeGxRVUZQTEV0QlFVc3NUMEZCVEN4RFFVRmhMRTlCUVdJc1EwRkJjVUlzWVVGQmNrSXNRMEZCYlVNc2MwSkJRVzVETEVWQlFUSkVMRXRCUVd4Rk8wRkJRMFE3UVVFMVJXMUNPMEZCUVVFN1FVRkJRU3h2UTBFNFJVczdRVUZCUVN4WlFVRmlMRWxCUVdFc2RVVkJRVTRzU1VGQlRUczdRVUZEZGtJc1dVRkJTU3hQUVVGUExFVkJRVmc3UVVGRFFTeFpRVUZKTEZGQlFWRXNSVUZCV2pzN1FVRkZRU3haUVVGSkxFbEJRVW9zUlVGQlZUdEJRVU5TTEdsQ1FVRlBMRXRCUVVzc1dVRkJUQ3hEUVVGclFpeFhRVUZzUWl4TFFVRnJReXhMUVVGTExGTkJRVGxET3p0QlFVVkJMR05CUVUwc2JVSkJRVzFDTEV0QlFVc3NZVUZCVEN4RFFVRnRRaXhQUVVGdVFpeERRVUY2UWp0QlFVTkJMR05CUVVrc1owSkJRVW9zUlVGQmMwSTdRVUZEY0VJc2JVSkJRVThzYVVKQlFXbENMRk5CUVhoQ08wRkJRMFE3TzBGQlJVUXNhMEpCUVZFc1MwRkJTeXhaUVVGTUxFTkJRV3RDTEZsQlFXeENMRXRCUVcxRExFVkJRVE5ETzBGQlEwUTdPMEZCUlVRc1pVRkJUeXhGUVVGRkxGVkJRVVlzUlVGQlVTeFpRVUZTTEVWQlFWQTdRVUZEUkR0QlFUbEdiVUk3UVVGQlFUdEJRVUZCTEhGRFFXZEhUQ3hMUVdoSFN5eEZRV2RIUlR0QlFVTndRaXhaUVVGSkxFMUJRVTBzU1VGQlRpeExRVUZsTEdsQ1FVRk5MRXRCUVhwQ0xFVkJRV2RETzBGQlF6bENMR05CUVUwc1YwRkJWeXc0UWtGQmEwSXNUVUZCVFN4TlFVRjRRaXhGUVVGblF5eFZRVUZvUXl4RFFVRnFRanM3UVVGRlFUczdPenRCUVVsQkxHTkJRVWtzUTBGQlF5eFJRVUZFTEVsQlFXRXNZVUZCWVN4TFFVRkxMRlZCUVV3c1JVRkJPVUlzUlVGQmFVUTdRVUZETDBNc2FVSkJRVXNzU1VGQlREdEJRVU5FTzBGQlJVWXNVMEZZUkN4TlFWZFBMRWxCUVVrc1RVRkJUU3hKUVVGT0xFdEJRV1VzVDBGQmJrSXNSVUZCTkVJN1FVRkRha01zWTBGQlRTeFBRVUZQTERoQ1FVRnJRaXhOUVVGTkxFMUJRWGhDTEVWQlFXZERMRTFCUVdoRExFTkJRV0k3TzBGQlJVRXNZMEZCU1N4SlFVRktMRVZCUVZVN1FVRkRVaXhuUWtGQlNTeExRVUZMTEZOQlFVd3NRMEZCWlN4UlFVRm1MRU5CUVhkQ0xGVkJRWGhDTEVOQlFVb3NSVUZCZVVNN1FVRkRka003UVVGRFJEczdRVUZGUkN4blFrRkJUU3hYUVVGWExFdEJRVXNzVjBGQlRDeERRVUZwUWl4SlFVRnFRaXhEUVVGcVFqczdRVUZGUVN4blFrRkJTU3hMUVVGTExGZEJRVXdzVDBGQmRVSXNVMEZCVXl4TFFVRndReXhGUVVFeVF6dEJRVU42UXp0QlFVTkJMRzFDUVVGTExGZEJRVXdzUTBGQmFVSXNVMEZCVXl4TFFVRXhRaXhGUVVGcFF5eFRRVUZUTEVsQlFURkRMRVZCUVdkRUxFdEJRV2hFTzBGQlEwRXNhMEpCUVUwc1UwRkJVeXhGUVVGRkxGVkJRVVlzUlVGQlVTeE5RVUZOTEZOQlFWTXNTVUZCZGtJc1JVRkJOa0lzVDBGQlR5eFRRVUZUTEV0QlFUZERMRVZCUVdZN1FVRkRRU3h0UWtGQlN5eFpRVUZNTEVOQlFXdENMR2xDUVVGTkxHRkJRWGhDTEVWQlFYVkRMRTFCUVhaRE8wRkJRMFE3TzBGQlJVUXNhVUpCUVVzc1NVRkJURHRCUVVOQk8wRkJRMFE3TzBGQlJVUTdRVUZEUVN4alFVRk5MR1ZCUVdVc09FSkJRV3RDTEUxQlFVMHNUVUZCZUVJc1JVRkJaME1zWlVGQmFFTXNRMEZCY2tJN1FVRkRRU3hqUVVGSkxGbEJRVW9zUlVGQmEwSTdRVUZEYUVJN1FVRkRSRHM3UVVGRlJDeGxRVUZMTEUxQlFVdzdRVUZEUkR0QlFVTkdPMEZCZWtsdFFqdEJRVUZCTzBGQlFVRXNLMEpCTWtsWU8wRkJRMUFzV1VGQlNTeExRVUZMTEU5QlFVd3NRMEZCWVN4UFFVRmlMRU5CUVhGQ0xGTkJRWEpDTEVOQlFTdENMRkZCUVM5Q0xFTkJRWGRETEZGQlFYaERMRU5CUVVvc1JVRkJkVVE3UVVGRGNrUXNhVUpCUVU4c1MwRkJTeXhKUVVGTUxFVkJRVkE3UVVGRFJEczdRVUZGUkN4bFFVRlBMRXRCUVVzc1NVRkJUQ3hGUVVGUU8wRkJRMFE3UVVGcVNtMUNPMEZCUVVFN1FVRkJRU3cyUWtGdFNtSTdRVUZEVEN4WlFVRkpMRXRCUVVzc1QwRkJUQ3hEUVVGaExFOUJRV0lzUTBGQmNVSXNVMEZCY2tJc1EwRkJLMElzVVVGQkwwSXNRMEZCZDBNc1VVRkJlRU1zUTBGQlNpeEZRVUYxUkR0QlFVTnlSQ3hwUWtGQlR5eExRVUZRTzBGQlEwUTdPMEZCUlVRc1lVRkJTeXhQUVVGTUxFTkJRV0VzVDBGQllpeERRVUZ4UWl4VFFVRnlRaXhEUVVFclFpeEhRVUV2UWl4RFFVRnRReXhSUVVGdVF6czdRVUZGUVN4WlFVRk5MR1ZCUVdVc1MwRkJTeXhQUVVGTUxFTkJRV0VzVDBGQllpeERRVUZ4UWl4aFFVRnlRaXhEUVVGdFF5eG5Ra0ZCYmtNc1EwRkJja0k3TzBGQlJVRTdRVUZEUVN4eFFrRkJZU3hUUVVGaUxFZEJRWGxDTEVOQlFYcENPenRCUVVWQkxHRkJRVXNzV1VGQlRDeERRVUZyUWl4cFFrRkJUU3hKUVVGNFFqdEJRVU5CTEdGQlFVc3NXVUZCVEN4RFFVRnJRaXhwUWtGQlRTeExRVUY0UWpzN1FVRkZRU3hoUVVGTExHVkJRVXdzUTBGQmNVSXNSVUZCUlN4UlFVRlJMRmxCUVZZc1JVRkJkMElzVDBGQlR5eFBRVUV2UWl4RlFVRnlRanRCUVVOQkxHRkJRVXNzWlVGQlRDeERRVUZ4UWl4RlFVRkZMRkZCUVZFc1UwRkJVeXhKUVVGdVFpeEZRVUY1UWl4UFFVRlBMR2xDUVVGTkxFdEJRWFJETEVWQlFYSkNPenRCUVVWQkxHVkJRVThzU1VGQlVEdEJRVU5FTzBGQmRFdHRRanRCUVVGQk8wRkJRVUVzTmtKQmQwdGlPMEZCUTB3c1dVRkJTU3hEUVVGRExFdEJRVXNzVDBGQlRDeERRVUZoTEU5QlFXSXNRMEZCY1VJc1UwRkJja0lzUTBGQkswSXNVVUZCTDBJc1EwRkJkME1zVVVGQmVFTXNRMEZCVEN4RlFVRjNSRHRCUVVOMFJDeHBRa0ZCVHl4TFFVRlFPMEZCUTBRN08wRkJSVVFzWVVGQlN5eFBRVUZNTEVOQlFXRXNUMEZCWWl4RFFVRnhRaXhUUVVGeVFpeERRVUVyUWl4TlFVRXZRaXhEUVVGelF5eFJRVUYwUXpzN1FVRkZRU3hoUVVGTExGbEJRVXdzUTBGQmEwSXNhVUpCUVUwc1NVRkJlRUk3UVVGRFFTeGhRVUZMTEZsQlFVd3NRMEZCYTBJc2FVSkJRVTBzVFVGQmVFSTdPMEZCUlVFc1lVRkJTeXhwUWtGQlRDeERRVUYxUWl4RlFVRkZMRkZCUVZFc1MwRkJTeXhQUVVGTUxFTkJRV0VzVDBGQllpeERRVUZ4UWl4aFFVRnlRaXhEUVVGdFF5eG5Ra0ZCYmtNc1EwRkJWaXhGUVVGblJTeFBRVUZQTEU5QlFYWkZMRVZCUVhaQ08wRkJRMEVzWVVGQlN5eHBRa0ZCVEN4RFFVRjFRaXhGUVVGRkxGRkJRVkVzVTBGQlV5eEpRVUZ1UWl4RlFVRjVRaXhQUVVGUExHbENRVUZOTEV0QlFYUkRMRVZCUVhaQ096dEJRVVZCTEdWQlFVOHNTVUZCVUR0QlFVTkVPMEZCZEV4dFFqdEJRVUZCTzBGQlFVRXNiVU5CZDB4Qk8wRkJRMnhDTEdWQlFVOHNTVUZCVUR0QlFVTkVPMEZCTVV4dFFqdEJRVUZCTzBGQlFVRXNiME5CTkV4RExFOUJOVXhFTEVWQk5FeFZPMEZCUXpWQ0xEWkhRVUV5UWl4UlFVRXpRaXhGUVVGeFF5eFBRVUZ5UXp0QlFVTkVPMEZCT1V4dFFqczdRVUZCUVR0QlFVRkJPenRCUVdsTmRFSTdPenM3T3pzN1FVRkxRU3hOUVVGTkxHRkJRV0VzUlVGQmJrSTdPMEZCUlVFc1RVRkJUU3haUVVGWkxGTkJRVk1zWjBKQlFWUXNUMEZCT0VJc1NVRkJPVUlzUTBGQmJFSTdRVUZEUVN4TlFVRkpMRk5CUVVvc1JVRkJaVHRCUVVOaUxGVkJRVTBzU1VGQlRpeERRVUZYTEZOQlFWZ3NSVUZCYzBJc1QwRkJkRUlzUTBGQk9FSXNWVUZCUXl4UFFVRkVMRVZCUVdFN1FVRkRla01zVlVGQlRTeFRRVUZUTERKRFFVRnZRaXhQUVVGd1FpeEZRVUUyUWl4clFrRkJOMElzUlVGQmFVUXNjVUpCUVdwRUxFTkJRV1k3UVVGRFFTeGhRVUZQTEU5QlFWQXNSMEZCYVVJc1QwRkJha0k3TzBGQlJVRXNWVUZCU1N4RFFVRkRMRTlCUVU4c1RVRkJXaXhGUVVGdlFqdEJRVU5zUWl4dFFrRkJWeXhKUVVGWUxFTkJRV2RDTEVsQlFVa3NVVUZCU2l4RFFVRmhMRTFCUVdJc1EwRkJhRUk3UVVGRFJEdEJRVU5HTEV0QlVFUTdRVUZSUkRzN1FVRkZSQ3hOUVVGSkxGTkJRVW9zUlVGQlpUdEJRVU5pTEdGQlFWTXNaMEpCUVZRc1EwRkJNRUlzVDBGQk1VSXNSVUZCYlVNc1ZVRkJReXhMUVVGRUxFVkJRVmM3UVVGRE5VTXNWVUZCVFN4bFFVRmxMRGhDUVVGclFpeE5RVUZOTEUxQlFYaENMRVZCUVdkRExHVkJRV2hETEVOQlFYSkNPMEZCUTBFc1ZVRkJTU3haUVVGS0xFVkJRV3RDTzBGQlEyaENPMEZCUTBRN08wRkJSVVFzVlVGQlRTeFhRVUZYTERoQ1FVRnJRaXhOUVVGTkxFMUJRWGhDTEVWQlFXZERMRlZCUVdoRExFTkJRV3BDT3p0QlFVVkJMRlZCUVVrc1VVRkJTaXhGUVVGak8wRkJRMW9zV1VGQlRTeHBRa0ZCYVVJc1UwRkJVeXhaUVVGVUxFTkJRWE5DTEdGQlFYUkNMRU5CUVhaQ08wRkJRMEVzV1VGQlNTeHJRa0ZCYTBJc2JVSkJRVzFDTEVsQlFYSkRMRWxCUVRaRExGRkJRV3BFTEVWQlFUSkVPMEZCUTNwRUxHTkJRVTBzV1VGQldTeFhRVUZYTEVsQlFWZ3NRMEZCWjBJN1FVRkJRU3h0UWtGQlN5eEZRVUZGTEZWQlFVWXNUMEZCYlVJc1VVRkJlRUk3UVVGQlFTeFhRVUZvUWl4RFFVRnNRanM3UVVGRlFTeGpRVUZKTEVOQlFVTXNVMEZCVEN4RlFVRm5RanRCUVVOa08wRkJRMFE3TzBGQlJVUXNiMEpCUVZVc1RVRkJWanRCUVVORU8wRkJRMFk3UVVGRFJpeExRWEJDUkR0QlFYRkNSRHM3UVVGRlJDeFRRVUZQTEZGQlFWQTdRVUZEUkN4RFFUZFBaMElzUlVGQmFrSTdPMnRDUVN0UFpTeFJPenM3T3pzN096czdPenM3TzBGRGNGQm1PenM3TzBGQlEwRTdPMEZCUTBFN096czdPenM3T3l0bFFWQkJPenM3T3pzN08wRkJVMEVzU1VGQlRTeHBRa0ZCYTBJc1dVRkJUVHM3UVVGRk5VSTdPenM3T3p0QlFVMUJMRTFCUVUwc1QwRkJUeXhuUWtGQlV5eFZRVUZVTEVWQlFXSTdRVUZEUVN4TlFVRk5MSEZDUVVGeFFqdEJRVU42UWl4aFFVRlRMRWxCUkdkQ08wRkJSWHBDTEdGQlFWTXNTVUZHWjBJN1FVRkhla0lzV1VGQlVUdEJRVWhwUWl4SFFVRXpRanRCUVV0QkxFMUJRVTBzZDBKQlFYZENMRU5CUXpWQ0xGTkJSRFJDTEVWQlJUVkNMRkZCUmpSQ0xFTkJRVGxDT3p0QlFVdEJPenM3T3pzN1FVRnVRalJDTEUxQmVVSjBRaXhqUVhwQ2MwSTdRVUZCUVRzN1FVRXlRakZDTERoQ1FVRXdRanRCUVVGQkxGVkJRV1FzVDBGQll5eDFSVUZCU2l4RlFVRkpPenRCUVVGQk96dEJRVUZCTEd0SlFVTnNRaXhQUVVSclFqczdRVUZIZUVJc1dVRkJTeXhyUWtGQlRDeEhRVUV3UWl4VlFVRkRMRXRCUVVRc1JVRkJWenRCUVVOdVF5eFpRVUZOTEZOQlFWTXNUVUZCVFN4TlFVRk9MRU5CUVdFc1MwRkJOVUk3TzBGQlJVRXNXVUZCU1N4WFFVRlhMRVZCUVdZc1JVRkJiVUk3UVVGRGFrSXNaMEpCUVVzc1UwRkJURHRCUVVOQk8wRkJRMFE3TzBGQlIwUXNZMEZCU3l4UlFVRk1MRWRCUVdkQ0xFOUJRV2hDTEVOQlFYZENMRlZCUVVNc1NVRkJSQ3hGUVVGVk8wRkJRMmhETEdOQlFVMHNTMEZCU3l4UFFVRlBMRTFCUVVzc1QwRkJUQ3hEUVVGaExGVkJRWEJDTEV0QlFXMURMRlZCUVc1RExFZEJRV2RFTEUxQlFVc3NUMEZCVEN4RFFVRmhMRlZCUVRkRUxFZEJRVEJGTEUxQlFVc3NWVUZCTVVZN08wRkJSVUVzWTBGQlNTeEhRVUZITEUxQlFVZ3NSVUZCVnl4SlFVRllMRU5CUVVvc1JVRkJjMEk3UVVGRGNFSXNhVUpCUVVzc1QwRkJUQ3hEUVVGaExFdEJRV0lzUTBGQmJVSXNUMEZCYmtJc1IwRkJOa0lzVDBGQk4wSTdRVUZEUkN4WFFVWkVMRTFCUlU4N1FVRkRUQ3hwUWtGQlN5eFBRVUZNTEVOQlFXRXNTMEZCWWl4RFFVRnRRaXhQUVVGdVFpeEhRVUUyUWl4TlFVRTNRanRCUVVORU8wRkJRMFlzVTBGU1JEdEJRVk5FTEU5QmJFSkVPenRCUVc5Q1FTeFpRVUZMTEdOQlFVd3NSMEZCYzBJc1owSkJRWFJDTEVOQlFYVkRMRTlCUVhaRExFVkJRV2RFTEUxQlFVc3NhMEpCUVhKRU8wRkJka0ozUWp0QlFYZENla0k3TzBGQmJrUjVRanRCUVVGQk8wRkJRVUVzYlVOQmNVUlRPMEZCUVVFc1dVRkJlRUlzVFVGQmQwSXNkVVZCUVdZc1JVRkJaVHRCUVVGQkxGbEJRVmdzU1VGQlZ5eDFSVUZCU2l4RlFVRkpPenRCUVVOcVF5eFpRVUZKTEV0QlFVc3NTMEZCVEN4RFFVRlhMRTlCUVZnc1EwRkJiVUlzVFVGQmJrSXNTVUZCTmtJc1EwRkJReXhEUVVFNVFpeEpRVU5ETEV0QlFVc3NTVUZCVEN4RFFVRlZMRTlCUVZZc1EwRkJhMElzVFVGQmJFSXNTVUZCTkVJc1EwRkJReXhEUVVSc1F5eEZRVU54UXp0QlFVTnVReXhwUWtGQlR5eEpRVUZRTzBGQlEwUTdPMEZCUlVRc1pVRkJUeXhMUVVGUU8wRkJRMFE3UVVFMVJIbENPMEZCUVVFN1FVRkJRU3hwUTBFNFJHWTdRVUZCUVRzN1FVRkRWQ3haUVVGSkxGRkJRVkVzVFVGQlRTeEpRVUZPTEVOQlFWY3NTMEZCU3l4UFFVRk1MRU5CUVdFc1QwRkJZaXhEUVVGeFFpeG5Ra0ZCY2tJc1EwRkJjME1zVDBGQmRFTXNTMEZCYTBRc1JVRkJOMFFzUTBGQldqdEJRVU5CTEdkQ1FVRlJMRTFCUVUwc1IwRkJUaXhEUVVGVkxGVkJRVU1zU1VGQlJDeEZRVUZWTzBGQlF6RkNMR05CUVUwc1QwRkJUeXhQUVVGTExGZEJRVXdzUTBGQmFVSXNTVUZCYWtJc1EwRkJZanRCUVVOQkxHbENRVUZQTEVWQlFVVXNUVUZCVFN4TFFVRkxMRWxCUVdJc1JVRkJiVUlzVDBGQlR5eExRVUZMTEV0QlFTOUNMRVZCUVhORExGTkJRVk1zU1VGQkwwTXNSVUZCVUR0QlFVTkVMRk5CU0U4c1EwRkJVanM3UVVGTFFTeGxRVUZQTEV0QlFWQTdRVUZEUkR0QlFYUkZlVUk3UVVGQlFUdEJRVUZCTEd0RFFYZEZaRHRCUVVOV0xHRkJRVXNzVVVGQlRDeEhRVUZuUWl4UFFVRm9RaXhEUVVGM1FpeFZRVUZETEVsQlFVUXNSVUZCVlR0QlFVTm9ReXhsUVVGTExFOUJRVXdzUTBGQllTeExRVUZpTEVOQlFXMUNMRTlCUVc1Q0xFZEJRVFpDTEU5QlFUZENPMEZCUTBRc1UwRkdSRHRCUVVkRU8wRkJOVVY1UWp0QlFVRkJPMEZCUVVFc2RVTkJPRVZVTzBGQlEyWXNaVUZCVHl4TFFVRkxMRTlCUVV3c1EwRkJZU3hQUVVGaUxFTkJRWEZDTEdGQlFYSkNMRU5CUVcxRExITkNRVUZ1UXl4RFFVRlFPMEZCUTBRN1FVRm9SbmxDTzBGQlFVRTdRVUZCUVN3MlFrRnJSbTVDTzBGQlEwd3NhMGxCUVd0Q08wRkJRMmhDTzBGQlEwRXNaVUZCU3l4alFVRk1MRWRCUVhOQ0xFdEJRWFJDTEVkQlFUaENMRVZCUVRsQ08wRkJRMEU3UVVGRFFTeGxRVUZMTEZOQlFVdzdRVUZEUkR0QlFVTkdPMEZCZWtaNVFqdEJRVUZCTzBGQlFVRXNiME5CTWtaTUxFOUJNMFpMTEVWQk1rWkpPMEZCUXpWQ0xHVkJRVThzU1VGQlNTeGpRVUZLTEVOQlFXMUNMRTlCUVc1Q0xFTkJRVkE3UVVGRFJEdEJRVGRHZVVJN08wRkJRVUU3UVVGQlFUczdRVUZuUnpWQ096czdPenM3TzBGQlMwRXNUVUZCVFN4aFFVRmhMRVZCUVc1Q08wRkJRMEVzVFVGQlRTeFpRVUZaTEZOQlFWTXNaMEpCUVZRc1QwRkJPRUlzU1VGQk9VSXNRMEZCYkVJN08wRkJSVUVzVFVGQlNTeFRRVUZLTEVWQlFXVTdRVUZEWWl4VlFVRk5MRWxCUVU0c1EwRkJWeXhUUVVGWUxFVkJRWE5DTEU5QlFYUkNMRU5CUVRoQ0xGVkJRVU1zVDBGQlJDeEZRVUZoTzBGQlEzcERMRlZCUVUwc1UwRkJVeXd5UTBGQmIwSXNUMEZCY0VJc1JVRkJOa0lzYTBKQlFUZENMRVZCUVdsRUxIRkNRVUZxUkN4RFFVRm1PMEZCUTBFc1lVRkJUeXhQUVVGUUxFZEJRV2xDTEU5QlFXcENPenRCUVVWQkxGVkJRVWtzVDBGQlR5eE5RVUZZTEVWQlFXMUNPMEZCUTJwQ08wRkJRMEVzYlVKQlFWY3NTVUZCV0N4RFFVRm5RaXhKUVVGSkxHTkJRVW9zUTBGQmJVSXNUVUZCYmtJc1EwRkJhRUk3UVVGRFJEdEJRVU5HTEV0QlVrUTdRVUZUUkRzN1FVRkZSQ3hOUVVGSkxGTkJRVW9zUlVGQlpUdEJRVU5pTEdGQlFWTXNaMEpCUVZRc1EwRkJNRUlzVDBGQk1VSXNSVUZCYlVNc1ZVRkJReXhMUVVGRUxFVkJRVmM3UVVGRE5VTXNWVUZCVFN4bFFVRmxMRGhDUVVGclFpeE5RVUZOTEUxQlFYaENMRVZCUVdkRExHVkJRV2hETEVOQlFYSkNPMEZCUTBFc1ZVRkJTU3haUVVGS0xFVkJRV3RDTzBGQlEyaENPMEZCUTBRN08wRkJSVVFzVlVGQlRTeFhRVUZYTERoQ1FVRnJRaXhOUVVGTkxFMUJRWGhDTEVWQlFXZERMRlZCUVdoRExFTkJRV3BDT3p0QlFVVkJMRlZCUVVrc1VVRkJTaXhGUVVGak8wRkJRMW9zV1VGQlRTeHBRa0ZCYVVJc1UwRkJVeXhaUVVGVUxFTkJRWE5DTEdGQlFYUkNMRU5CUVhaQ08wRkJRMEVzV1VGQlNTeHJRa0ZCYTBJc2JVSkJRVzFDTEVsQlFYSkRMRWxCUVRaRExGRkJRV3BFTEVWQlFUSkVPMEZCUTNwRUxHTkJRVTBzV1VGQldTeFhRVUZYTEVsQlFWZ3NRMEZCWjBJN1FVRkJRU3h0UWtGQlN5eEZRVUZGTEZWQlFVWXNUMEZCYlVJc1VVRkJlRUk3UVVGQlFTeFhRVUZvUWl4RFFVRnNRanM3UVVGRlFTeGpRVUZKTEVOQlFVTXNVMEZCVEN4RlFVRm5RanRCUVVOa08wRkJRMFE3TzBGQlJVUXNiMEpCUVZVc1RVRkJWanRCUVVORU8wRkJRMFk3UVVGRFJpeExRWEJDUkR0QlFYRkNSRHM3UVVGRlJDeFRRVUZQTEdOQlFWQTdRVUZEUkN4RFFUZEpjMElzUlVGQmRrSTdPMnRDUVN0SlpTeGpPenM3T3pzN096czdPenM3TzBGRGJrcG1PenM3T3pzN096czdPeXRsUVV4Qk96czdPenM3TzBGQlQwRXNTVUZCVFN4VFFVRlZMRmxCUVUwN1FVRkRjRUk3T3pzN096dEJRVTFCTEUxQlFVMHNUMEZCVHl4UlFVRmlPMEZCUTBFc1RVRkJUU3hWUVVGVkxFOUJRV2hDTzBGQlEwRXNUVUZCVFN4eFFrRkJjVUk3UVVGRGVrSXNZVUZCVXl4SlFVUm5RanRCUVVWNlFpeFhRVUZQTEVsQlJtdENPMEZCUjNwQ0xGVkJRVTA3UVVGSWJVSXNSMEZCTTBJN1FVRkxRU3hOUVVGTkxIZENRVUYzUWl4RlFVRTVRanM3UVVGRlFUczdPenM3TzBGQmFFSnZRaXhOUVhOQ1pDeE5RWFJDWXp0QlFVRkJPenRCUVhkQ2JFSXNjMEpCUVRCQ08wRkJRVUVzVlVGQlpDeFBRVUZqTEhWRlFVRktMRVZCUVVrN08wRkJRVUU3TzBGQlIzaENPMEZCU0hkQ0xHdElRVU5zUWl4SlFVUnJRaXhGUVVOYUxFOUJSRmtzUlVGRFNDeHJRa0ZFUnl4RlFVTnBRaXhQUVVScVFpeEZRVU13UWl4eFFrRkVNVUlzUlVGRGFVUXNTMEZFYWtRc1JVRkRkMFFzUzBGRWVFUTdPMEZCU1hoQ0xGVkJRVTBzWjBKQlFXZENMRTFCUVVzc1ZVRkJUQ3hGUVVGMFFqdEJRVU5CTEZWQlFVa3NUMEZCVHl4TlFVRkxMRTlCUVV3c1EwRkJZU3hMUVVGd1FpeExRVUU0UWl4UlFVRTVRaXhKUVVORExFTkJRVU1zWTBGQll5eFRRVUZrTEVOQlFYZENMRkZCUVhoQ0xGbEJRVEJETEUxQlFVc3NUMEZCVEN4RFFVRmhMRXRCUVhaRUxFTkJSRTRzUlVGRGRVVTdRVUZEY2tVc2MwSkJRV01zVTBGQlpDeERRVUYzUWl4SFFVRjRRaXhaUVVGeFF5eE5RVUZMTEU5QlFVd3NRMEZCWVN4TFFVRnNSRHRCUVVORU96dEJRVVZFTEZsQlFVc3NWVUZCVEN4SFFVRnJRaXhOUVVGTExFOUJRVXdzUTBGQllTeEpRVUZpTEV0QlFYTkNMRWxCUVhoRE8wRkJWbmRDTzBGQlYzcENPenRCUVc1RGFVSTdRVUZCUVR0QlFVRkJMSE5EUVhGRFJqdEJRVU5rTEZsQlFVa3NRMEZCUXl4TFFVRkxMRlZCUVZZc1JVRkJjMEk3UVVGRGNFSXNZMEZCVFN4UFFVRlBMRXRCUVVzc1QwRkJUQ3hEUVVGaExFOUJRV0lzUTBGQmNVSXNjVUpCUVhKQ0xFVkJRV0k3UVVGRFFTeHBRa0ZCVHl4TFFVRkxMRTFCUVZvN1FVRkRSRHM3UVVGRlJDeGxRVUZQTEV0QlFVc3NUMEZCVEN4RFFVRmhMRWxCUVhCQ08wRkJRMFE3UVVFMVEybENPMEZCUVVFN1FVRkJRU3h0UTBFNFEwdzdRVUZEV0N4bFFVRlBMRXRCUVVzc1QwRkJUQ3hEUVVGaExFOUJRV0lzUTBGQmNVSXNZVUZCY2tJc1EwRkJiVU1zYVVKQlFXNURMRU5CUVZBN1FVRkRSRHRCUVdoRWFVSTdRVUZCUVR0QlFVRkJMRFpDUVd0RVdEdEJRVU5NTEZsQlFVa3NTMEZCU3l4UFFVRk1MRU5CUVdFc1QwRkJZaXhEUVVGeFFpeFRRVUZ5UWl4RFFVRXJRaXhSUVVFdlFpeERRVUYzUXl4TlFVRjRReXhEUVVGS0xFVkJRWEZFTzBGQlEyNUVMR1ZCUVVzc1QwRkJUQ3hEUVVGaExFOUJRV0lzUTBGQmNVSXNVMEZCY2tJc1EwRkJLMElzVFVGQkwwSXNRMEZCYzBNc1RVRkJkRU03UVVGRFJEczdRVUZGUkN4WlFVRk5MRTlCUVU4c1MwRkJTeXhoUVVGTUxFVkJRV0k3UVVGRFFTeGhRVUZMTEU5QlFVd3NRMEZCWVN4SlFVRmlMRWRCUVc5Q0xFbEJRWEJDT3p0QlFVVkJMRmxCUVVrc1MwRkJTeXhWUVVGVUxFVkJRWEZDTzBGQlEyNUNMR1ZCUVVzc1QwRkJUQ3hEUVVGaExFOUJRV0lzUTBGQmNVSXNTMEZCY2tJc1EwRkJNa0lzUzBGQk0wSXNSMEZCYzBNc1MwRkJTeXhQUVVGTUxFTkJRV0VzU1VGQmJrUTdRVUZEUVN4bFFVRkxMRTlCUVV3c1EwRkJZU3hQUVVGaUxFTkJRWEZDTEV0QlFYSkNMRU5CUVRKQ0xFMUJRVE5DTEVkQlFYVkRMRXRCUVVzc1QwRkJUQ3hEUVVGaExFbEJRWEJFT3p0QlFVVkJMR05CUVUwc1owSkJRV2RDTEV0QlFVc3NWVUZCVEN4RlFVRjBRanRCUVVOQkxIZENRVUZqTEV0QlFXUXNRMEZCYjBJc1MwRkJjRUlzUjBGQkswSXNTMEZCU3l4UFFVRk1MRU5CUVdFc1NVRkJOVU03UVVGRFFTeDNRa0ZCWXl4TFFVRmtMRU5CUVc5Q0xFMUJRWEJDTEVkQlFXZERMRXRCUVVzc1QwRkJUQ3hEUVVGaExFbEJRVGRETzBGQlEwUTdPMEZCUlVRc1pVRkJUeXhKUVVGUU8wRkJRMFE3UVVGd1JXbENPMEZCUVVFN1FVRkJRU3huUTBGelJXRTdRVUZCUVN4WlFVRjJRaXhqUVVGMVFpeDFSVUZCVGl4SlFVRk5PenRCUVVNM1FpeFpRVUZKTEdOQlFVb3NSVUZCYjBJN1FVRkRiRUlzWlVGQlN5eEpRVUZNTzBGQlEwUXNVMEZHUkN4TlFVVlBPMEZCUTB3c1pVRkJTeXhKUVVGTU8wRkJRMFE3TzBGQlJVUXNXVUZCVFN4blFrRkJaMElzUzBGQlN5eFZRVUZNTEVWQlFYUkNPenRCUVVWQkxGbEJRVWtzYTBKQlEwWXNRMEZCUXl4alFVRmpMRk5CUVdRc1EwRkJkMElzVVVGQmVFSXNRMEZCYVVNc2VVSkJRV3BETEVOQlJFZ3NSVUZEWjBVN1FVRkRPVVFzZDBKQlFXTXNVMEZCWkN4RFFVRjNRaXhIUVVGNFFpeERRVUUwUWl4NVFrRkJOVUk3UVVGRFFTeHBRa0ZCVHl4SlFVRlFPMEZCUTBRN08wRkJSVVFzV1VGQlNTeERRVUZETEdOQlFVUXNTVUZEUml4alFVRmpMRk5CUVdRc1EwRkJkMElzVVVGQmVFSXNRMEZCYVVNc2VVSkJRV3BETEVOQlJFWXNSVUZESzBRN1FVRkROMFFzZDBKQlFXTXNVMEZCWkN4RFFVRjNRaXhOUVVGNFFpeERRVUVyUWl4NVFrRkJMMEk3UVVGRFJEczdRVUZGUkN4bFFVRlBMRWxCUVZBN1FVRkRSRHRCUVROR2FVSTdRVUZCUVR0QlFVRkJMRFpDUVRaR1dEdEJRVU5NTEZsQlFVa3NRMEZCUXl4TFFVRkxMRTlCUVV3c1EwRkJZU3hQUVVGaUxFTkJRWEZDTEZOQlFYSkNMRU5CUVN0Q0xGRkJRUzlDTEVOQlFYZERMRTFCUVhoRExFTkJRVXdzUlVGQmMwUTdRVUZEY0VRc1pVRkJTeXhQUVVGTUxFTkJRV0VzVDBGQllpeERRVUZ4UWl4VFFVRnlRaXhEUVVFclFpeEhRVUV2UWl4RFFVRnRReXhOUVVGdVF6dEJRVU5FT3p0QlFVVkVMR1ZCUVU4c1NVRkJVRHRCUVVORU8wRkJia2RwUWp0QlFVRkJPMEZCUVVFc2JVTkJjVWRGTzBGQlEyeENMR1ZCUVU4c1NVRkJVRHRCUVVORU8wRkJka2RwUWp0QlFVRkJPMEZCUVVFc2IwTkJlVWRITEU5QmVrZElMRVZCZVVkWk8wRkJRelZDTEhsSFFVRXlRaXhOUVVFelFpeEZRVUZ0UXl4UFFVRnVRenRCUVVORU8wRkJNMGRwUWpzN1FVRkJRVHRCUVVGQk96dEJRVGhIY0VJc1UwRkJUeXhOUVVGUU8wRkJRMFFzUTBFdlIyTXNSVUZCWmpzN2EwSkJhVWhsTEUwN096czdPenM3T3pzN096czdRVU51U0dZN096czdRVUZEUVRzN096czdPenM3T3pzclpVRk9RVHM3T3pzN096dEJRVkZCTEVsQlFVMHNaVUZCWjBJc1dVRkJUVHRCUVVNeFFqczdPenM3TzBGQlRVRXNUVUZCVFN4UFFVRlBMR05CUVdJN1FVRkRRU3hOUVVGTkxGVkJRVlVzVDBGQmFFSTdRVUZEUVN4TlFVRk5MSEZDUVVGeFFqdEJRVU42UWl4aFFVRlRMRWxCUkdkQ08wRkJSWHBDTEdGQlFWTXNSVUZHWjBJN1FVRkhla0lzWjBKQlFWa3NTVUZJWVR0QlFVbDZRaXhoUVVGVExFbEJTbWRDTzBGQlMzcENMR2RDUVVGWk8wRkJUR0VzUjBGQk0wSTdRVUZQUVN4TlFVRk5MSGRDUVVGM1FpeERRVU0xUWl4VFFVUTBRaXhEUVVFNVFqczdRVUZKUVRzN096czdPMEZCY0VJd1FpeE5RVEJDY0VJc1dVRXhRbTlDTzBGQlFVRTdPMEZCTkVKNFFpdzBRa0ZCTUVJN1FVRkJRU3hWUVVGa0xFOUJRV01zZFVWQlFVb3NSVUZCU1RzN1FVRkJRVHM3UVVGQlFTdzRTRUZEYkVJc1NVRkVhMElzUlVGRFdpeFBRVVJaTEVWQlEwZ3NhMEpCUkVjc1JVRkRhVUlzVDBGRWFrSXNSVUZETUVJc2NVSkJSREZDTEVWQlEybEVMRWxCUkdwRUxFVkJRM1ZFTEV0QlJIWkVPenRCUVVkNFFpeFpRVUZMTEZGQlFVd3NSMEZCWjBJc1MwRkRhRUlzTkVKQlJHZENMRWRCUldRc2EwTkJSbU1zUjBGSFdpdzJRa0ZJV1N4SFFVbGFMSEZHUVVwWkxFZEJTMVlzZVVOQlRGVXNSMEZOV2l4WFFVNVpMRWRCVDJRc1VVRlFZeXhIUVZGb1FpeFJRVkpCT3p0QlFWVkJMRlZCUVVrc1RVRkJTeXhqUVVGVUxFVkJRWGxDTzBGQlEzWkNMR05CUVVzc1MwRkJURHRCUVVORU96dEJRVVZFTEZsQlFVc3NaVUZCVEN4SFFVRjFRaXhKUVVGMlFqdEJRV3BDZDBJN1FVRnJRbnBDT3p0QlFUbERkVUk3UVVGQlFUdEJRVUZCTERoQ1FXZEVhRUk3UVVGRFRpeFpRVUZOTEZWQlFWVXNVMEZCVXl4aFFVRlVMRU5CUVhWQ0xFdEJRWFpDTEVOQlFXaENPenRCUVVWQkxHZENRVUZSTEZOQlFWSXNSMEZCYjBJc1MwRkJTeXhSUVVGNlFqczdRVUZGUVN4aFFVRkxMRTlCUVV3c1EwRkJZU3hQUVVGaUxFZEJRWFZDTEZGQlFWRXNWVUZCTDBJN08wRkJSVUU3UVVGRFFTeGhRVUZMTEU5QlFVd3NRMEZCWVN4UFFVRmlMRU5CUVhGQ0xHRkJRWEpDTEVOQlFXMURMRlZCUVc1RExFVkJRU3RETEZOQlFTOURMRWRCUVRKRUxFdEJRVXNzVDBGQlRDeERRVUZoTEU5QlFYaEZPenRCUVVWQkxGbEJRVWtzUTBGQlF5eExRVUZMTEU5QlFVd3NRMEZCWVN4VlFVRnNRaXhGUVVFNFFqdEJRVU0xUWl4bFFVRkxMRTlCUVV3c1EwRkJZU3hQUVVGaUxFTkJRWEZDTEdGQlFYSkNMRU5CUVcxRExGRkJRVzVETEVWQlFUWkRMRXRCUVRkRExFTkJRVzFFTEU5QlFXNUVMRWRCUVRaRUxFMUJRVGRFTzBGQlEwUTdPMEZCUlVRc2FVSkJRVk1zU1VGQlZDeERRVUZqTEZkQlFXUXNRMEZCTUVJc1MwRkJTeXhQUVVGTUxFTkJRV0VzVDBGQmRrTTdPMEZCUlVFc1lVRkJTeXhoUVVGTU8wRkJRMFE3UVVGcVJYVkNPMEZCUVVFN1FVRkJRU3cyUWtGdFJXcENPMEZCUVVFN08wRkJRMHdzV1VGQlNTeExRVUZMTEU5QlFVd3NRMEZCWVN4UFFVRmlMRXRCUVhsQ0xFbEJRVGRDTEVWQlFXMURPMEZCUTJwRE8wRkJRMEVzWlVGQlN5eExRVUZNTzBGQlEwUTdPMEZCUlVRc1dVRkJTU3hMUVVGTExFOUJRVXdzUTBGQllTeFBRVUZpTEVOQlFYRkNMRk5CUVhKQ0xFTkJRU3RDTEZGQlFTOUNMRU5CUVhkRExFMUJRWGhETEVOQlFVb3NSVUZCY1VRN1FVRkRia1FzYVVKQlFVOHNTMEZCVUR0QlFVTkVPenRCUVVWRU8wRkJRMEVzV1VGQlNTeExRVUZMTEU5QlFVd3NRMEZCWVN4VlFVRnFRaXhGUVVFMlFqdEJRVU16UWl4bFFVRkxMRTlCUVV3c1EwRkJZU3hQUVVGaUxFTkJRWEZDTEdWQlFYSkNMRU5CUVhGRExFOUJRWEpETzBGQlEwRXNaVUZCU3l4UFFVRk1MRU5CUVdFc1QwRkJZaXhEUVVGeFFpeFpRVUZ5UWl4RFFVRnJReXhQUVVGc1F5eEZRVUV5UXl4alFVRXpRenM3UVVGRlFTeGxRVUZMTEU5QlFVd3NRMEZCWVN4UFFVRmlMRU5CUVhGQ0xGTkJRWEpDTEVOQlFTdENMRWRCUVM5Q0xGTkJRWGxETEV0QlFVc3NUMEZCVEN4RFFVRmhMRlZCUVhSRU8wRkJRMEVzWlVGQlN5eFBRVUZNTEVOQlFXRXNUMEZCWWl4RFFVRnhRaXhoUVVGeVFpeERRVUZ0UXl4UlFVRnVReXhGUVVFMlF5eFRRVUUzUXl4RFFVRjFSQ3hIUVVGMlJDeFZRVUZyUlN4TFFVRkxMRTlCUVV3c1EwRkJZU3hWUVVFdlJUdEJRVU5FT3p0QlFVVkVMRmxCUVVrc1MwRkJTeXhQUVVGTUxFTkJRV0VzVlVGQmFrSXNSVUZCTmtJN1FVRkRNMEk3UVVGRFFTeGpRVUZOTEdkQ1FVRm5RaXhMUVVGTExFOUJRVXdzUTBGQllTeFBRVUZpTEVOQlFYRkNMR0ZCUVhKQ0xFTkJRVzFETEZGQlFXNURMRU5CUVhSQ08wRkJRMEVzWlVGQlN5eGxRVUZNTEVOQlFYRkNMRVZCUVVVc1VVRkJVU3hoUVVGV0xFVkJRWGxDTEU5QlFVOHNUMEZCYUVNc1JVRkJja0k3UVVGRFJEczdRVUZGUkN4dFFrRkJWeXhaUVVGTk8wRkJRMllzYVVKQlFVc3NUMEZCVEN4RFFVRmhMRTlCUVdJc1EwRkJjVUlzVTBGQmNrSXNRMEZCSzBJc1IwRkJMMElzUTBGQmJVTXNUVUZCYmtNN08wRkJSVUU3UVVGRFFTeGpRVUZOTEhOQ1FVRnpRaXhUUVVGVExHZENRVUZVTEVOQlFUQkNMRzlDUVVFeFFpeExRVUZ0UkN4RlFVRXZSVHRCUVVOQkxHTkJRVWtzWlVGQlpTeERRVUZ1UWp0QlFVTkJMRGhDUVVGdlFpeFBRVUZ3UWl4RFFVRTBRaXhWUVVGRExGbEJRVVFzUlVGQmEwSTdRVUZETlVNc1owSkJRVWtzVDBGQlN5eFBRVUZNTEVOQlFXRXNUMEZCWWl4TFFVRjVRaXhaUVVFM1FpeEZRVUV5UXp0QlFVTjZReXhyUWtGQlRTeFJRVUZSTEdsQ1FVRnBRaXhaUVVGcVFpeERRVUZrTzBGQlEwRXNPRUpCUVdkQ0xHRkJRV0VzV1VGQllpeEhRVUUwUWl4VFFVRlRMRTFCUVUwc1dVRkJaaXhGUVVFMlFpeEZRVUUzUWl4RFFVRTFRenRCUVVORU8wRkJRMFlzVjBGTVJEczdRVUZQUVN4cFFrRkJTeXhQUVVGTUxFTkJRV0VzVDBGQllpeERRVUZ4UWl4TFFVRnlRaXhEUVVFeVFpeFRRVUV6UWl4dFFrRkJjVVFzV1VGQmNrUTdPMEZCUlVFc2FVSkJRVXNzV1VGQlRDeERRVUZyUWl4cFFrRkJUU3hKUVVGNFFqczdRVUZGUVN4alFVRk5MRlZCUVZVc1UwRkJWaXhQUVVGVkxFZEJRVTA3UVVGRGNFSXNiVUpCUVVzc1dVRkJUQ3hEUVVGclFpeHBRa0ZCVFN4TFFVRjRRanRCUVVOQkxHMUNRVUZMTEU5QlFVd3NRMEZCWVN4UFFVRmlMRU5CUVhGQ0xHMUNRVUZ5UWl4RFFVRjVReXhwUWtGQlRTeGpRVUV2UXl4RlFVRXJSQ3hQUVVFdlJEdEJRVU5FTEZkQlNFUTdPMEZCUzBFc2FVSkJRVXNzVDBGQlRDeERRVUZoTEU5QlFXSXNRMEZCY1VJc1owSkJRWEpDTEVOQlFYTkRMR2xDUVVGTkxHTkJRVFZETEVWQlFUUkVMRTlCUVRWRU8wRkJSVVFzVTBGNFFrUXNSVUYzUWtjc1EwRjRRa2c3TzBGQk1FSkJMRmxCUVVrc1QwRkJUeXhUUVVGUUxFTkJRV2xDTEV0QlFVc3NUMEZCVEN4RFFVRmhMRTlCUVRsQ0xFdEJRVEJETEV0QlFVc3NUMEZCVEN4RFFVRmhMRTlCUVdJc1IwRkJkVUlzUTBGQmNrVXNSVUZCZDBVN1FVRkRkRVU3UVVGRFFTeGxRVUZMTEdWQlFVd3NSMEZCZFVJc1YwRkJWeXhaUVVGTk8wRkJRM1JETEcxQ1FVRkxMRWxCUVV3N1FVRkRSQ3hYUVVaelFpeEZRVVZ3UWl4TFFVRkxMRTlCUVV3c1EwRkJZU3hQUVVGaUxFZEJRWFZDTEVOQlJrZ3NRMEZCZGtJN1FVRkhSRHM3UVVGRlJDeGxRVUZQTEVsQlFWQTdRVUZEUkR0QlFUbElkVUk3UVVGQlFUdEJRVUZCTERaQ1FXZEpha0k3UVVGQlFUczdRVUZEVERzN096dEJRVWxCTEZsQlFVa3NTMEZCU3l4bFFVRlVMRVZCUVRCQ08wRkJRM2hDTEhWQ1FVRmhMRXRCUVVzc1pVRkJiRUk3UVVGRFFTeGxRVUZMTEdWQlFVd3NSMEZCZFVJc1NVRkJka0k3UVVGRFJEczdRVUZGUkN4WlFVRkpMRU5CUVVNc1MwRkJTeXhQUVVGTUxFTkJRV0VzVDBGQllpeERRVUZ4UWl4VFFVRnlRaXhEUVVFclFpeFJRVUV2UWl4RFFVRjNReXhOUVVGNFF5eERRVUZNTEVWQlFYTkVPMEZCUTNCRUxHbENRVUZQTEV0QlFWQTdRVUZEUkRzN1FVRkZSQ3hoUVVGTExGbEJRVXdzUTBGQmEwSXNhVUpCUVUwc1NVRkJlRUk3TzBGQlJVRXNXVUZCU1N4TFFVRkxMRTlCUVV3c1EwRkJZU3hWUVVGcVFpeEZRVUUyUWp0QlFVTXpRaXhqUVVGTkxHZENRVUZuUWl4TFFVRkxMRTlCUVV3c1EwRkJZU3hQUVVGaUxFTkJRWEZDTEdGQlFYSkNMRU5CUVcxRExGRkJRVzVETEVOQlFYUkNPMEZCUTBFc1pVRkJTeXhwUWtGQlRDeERRVUYxUWl4RlFVRkZMRkZCUVZFc1lVRkJWaXhGUVVGNVFpeFBRVUZQTEU5QlFXaERMRVZCUVhaQ08wRkJRMFE3TzBGQlJVUXNZVUZCU3l4UFFVRk1MRU5CUVdFc1QwRkJZaXhEUVVGeFFpeFRRVUZ5UWl4RFFVRXJRaXhOUVVFdlFpeERRVUZ6UXl4TlFVRjBRenRCUVVOQkxHRkJRVXNzVDBGQlRDeERRVUZoTEU5QlFXSXNRMEZCY1VJc1UwRkJja0lzUTBGQkswSXNSMEZCTDBJc1EwRkJiVU1zVFVGQmJrTTdPMEZCUlVFc1dVRkJUU3hYUVVGWExGTkJRVmdzVVVGQlZ5eEhRVUZOTzBGQlEzSkNMR2xDUVVGTExFOUJRVXdzUTBGQllTeFBRVUZpTEVOQlFYRkNMRzFDUVVGeVFpeERRVUY1UXl4cFFrRkJUU3hqUVVFdlF5eEZRVUVyUkN4UlFVRXZSRHRCUVVOQkxHbENRVUZMTEU5QlFVd3NRMEZCWVN4UFFVRmlMRU5CUVhGQ0xGTkJRWEpDTEVOQlFTdENMRTFCUVM5Q0xFTkJRWE5ETEUxQlFYUkRPenRCUVVWQkxHbENRVUZMTEZsQlFVd3NRMEZCYTBJc2FVSkJRVTBzVFVGQmVFSTdPMEZCUlVFc1kwRkJTU3hQUVVGTExHTkJRVlFzUlVGQmVVSTdRVUZEZGtJc2NVSkJRVk1zU1VGQlZDeERRVUZqTEZkQlFXUXNRMEZCTUVJc1QwRkJTeXhQUVVGTUxFTkJRV0VzVDBGQmRrTTdRVUZEUVN4dFFrRkJTeXhQUVVGTUxFTkJRV0VzVDBGQllpeEhRVUYxUWl4SlFVRjJRanRCUVVORU8wRkJRMFlzVTBGV1JEczdRVUZaUVN4aFFVRkxMRTlCUVV3c1EwRkJZU3hQUVVGaUxFTkJRWEZDTEdkQ1FVRnlRaXhEUVVGelF5eHBRa0ZCVFN4alFVRTFReXhGUVVFMFJDeFJRVUUxUkRzN1FVRkZRU3hsUVVGUExFbEJRVkE3UVVGRFJEdEJRWFpMZFVJN1FVRkJRVHRCUVVGQkxIVkRRWGxMVUR0QlFVTm1MR0ZCUVVzc1NVRkJURHRCUVVORU8wRkJNMHQxUWp0QlFVRkJPMEZCUVVFc2JVTkJOa3RLTzBGQlEyeENMR1ZCUVU4c1NVRkJVRHRCUVVORU8wRkJMMHQxUWp0QlFVRkJPMEZCUVVFc2IwTkJhVXhJTEU5QmFreEhMRVZCYVV4Tk8wRkJRelZDTEhGSVFVRXlRaXhaUVVFelFpeEZRVUY1UXl4UFFVRjZRenRCUVVORU8wRkJia3gxUWpzN1FVRkJRVHRCUVVGQk96dEJRWE5NTVVJc1UwRkJUeXhaUVVGUU8wRkJRMFFzUTBGMlRHOUNMRVZCUVhKQ096dHJRa0Y1VEdVc1dUczdPenM3T3pzN096czdPenRCUXpWTVpqczdPenRCUVVOQk96czdPMEZCUTBFN08wRkJRMEU3T3pzN096czdPeXRsUVZKQk96czdPenM3TzBGQlZVRXNTVUZCVFN4WlFVRmhMRmxCUVUwN1FVRkRka0k3T3pzN096dEJRVTFCTEUxQlFVMHNUMEZCVHl4WlFVRmlPMEZCUTBFc1RVRkJUU3hWUVVGVkxFOUJRV2hDTzBGQlEwRXNUVUZCVFN4dlFrRkJiMElzY1VKQlFURkNPMEZCUTBFc1RVRkJUU3h4UWtGQmNVSTdRVUZEZWtJc1lVRkJVeXhKUVVSblFqdEJRVVY2UWl4WFFVRlBPMEZCUTB3c1ZVRkJTU3hMUVVSRE8wRkJSVXdzVlVGQlNTeExRVVpETzBGQlIwd3NWVUZCU1R0QlFVaERPMEZCUm10Q0xFZEJRVE5DTzBGQlVVRXNUVUZCVFN4M1FrRkJkMElzUTBGRE5VSXNUMEZFTkVJc1EwRkJPVUk3TzBGQlNVRTdPenM3T3p0QlFYUkNkVUlzVFVFMFFtcENMRk5CTlVKcFFqdEJRVUZCT3p0QlFUaENja0lzZVVKQlFUQkNPMEZCUVVFc1ZVRkJaQ3hQUVVGakxIVkZRVUZLTEVWQlFVazdPMEZCUVVFN08wRkJRVUVzZDBoQlEyeENMRWxCUkd0Q0xFVkJRMW9zVDBGRVdTeEZRVU5JTEd0Q1FVUkhMRVZCUTJsQ0xFOUJSR3BDTEVWQlF6QkNMSEZDUVVReFFpeEZRVU5wUkN4TFFVUnFSQ3hGUVVOM1JDeEpRVVI0UkRzN1FVRkhlRUlzV1VGQlN5eFhRVUZNTEVkQlFXMUNMRWxCUVc1Q08wRkJRMEVzV1VGQlN5eFpRVUZNTEVkQlFXOUNMRWxCUVhCQ08wRkJRMEVzV1VGQlN5eFBRVUZNTEVkQlFXVXNTVUZCWmpzN1FVRkZRU3haUVVGTExGVkJRVXdzUjBGQmEwSXNRMEZCUXl4TlFVRkVMRVZCUVZNc1QwRkJWQ3hEUVVGc1FqczdRVUZGUVN4VlFVRk5MRXRCUVVzc1JVRkJSU3hOUVVGTkxFbEJRVklzUlVGQll5eFBRVUZQTEU5QlFVOHNWVUZCVUN4RFFVRnJRaXhyUWtGQmJFSXNRMEZCY2tJc1JVRkJXRHRCUVVOQkxGVkJRVTBzUzBGQlN5eEZRVUZGTEUxQlFVMHNTVUZCVWl4RlFVRmpMRTlCUVU4c1QwRkJUeXhWUVVGUUxFTkJRV3RDTEc5Q1FVRnNRaXhEUVVGeVFpeEZRVUZZTzBGQlEwRXNWVUZCVFN4TFFVRkxMRVZCUVVVc1RVRkJUU3hKUVVGU0xFVkJRV01zVDBGQlR5eFBRVUZQTEZWQlFWQXNRMEZCYTBJc2IwSkJRV3hDTEVOQlFYSkNMRVZCUVZnN1FVRkRRU3hWUVVGTkxFdEJRVXNzUlVGQlJTeE5RVUZOTEVsQlFWSXNSVUZCWXl4UFFVRlBMRTlCUVU4c1ZVRkJVQ3hEUVVGclFpeHhRa0ZCYkVJc1EwRkJja0lzUlVGQldEczdRVUZGUVN4WlFVRkxMRXRCUVV3c1IwRkJZU3hEUVVGRExFVkJRVVFzUlVGQlN5eEZRVUZNTEVWQlFWTXNSVUZCVkN4RlFVRmhMRVZCUVdJc1JVRkJhVUlzVDBGQmFrSXNSVUZCWWpzN1FVRkZRU3haUVVGTExHTkJRVXc3UVVGRFFTeFpRVUZMTEZWQlFVdzdPMEZCUlVFc1lVRkJUeXhuUWtGQlVDeERRVUYzUWl4UlFVRjRRaXhGUVVGclF6dEJRVUZCTEdWQlFVMHNUVUZCU3l4VlFVRk1MRVZCUVU0N1FVRkJRU3hQUVVGc1F5eEZRVUV5UkN4TFFVRXpSRHRCUVc1Q2QwSTdRVUZ2UW5wQ096dEJRV3hFYjBJN1FVRkJRVHRCUVVGQkxIVkRRVzlFU2p0QlFVRkJPenRCUVVObUxHRkJRVXNzVlVGQlRDeERRVUZuUWl4TFFVRm9RaXhEUVVGelFpeFZRVUZETEZOQlFVUXNSVUZCWlR0QlFVTnVReXhqUVVGSkxFOUJRVXNzVDBGQlRDeERRVUZoTEU5QlFXSXNRMEZCY1VJc1UwRkJja0lzUTBGQkswSXNVVUZCTDBJc2FVSkJRWE5FTEZOQlFYUkVMRU5CUVVvc1JVRkJkMFU3UVVGRGRFVXNiVUpCUVVzc1UwRkJUQ3hIUVVGcFFpeFRRVUZxUWp0QlFVTkJMRzFDUVVGUExFdEJRVkE3UVVGRFJEdEJRVU5FTEdsQ1FVRlBMRWxCUVZBN1FVRkRSQ3hUUVU1RU8wRkJUMFE3UVVFMVJHOUNPMEZCUVVFN1FVRkJRU3h0UTBFNFJGSTdRVUZCUVRzN1FVRkRXQ3haUVVGSkxFVkJRVVVzWjBKQlFXZENMRTFCUVd4Q0xFTkJRVW9zUlVGQkswSTdRVUZETjBJN1FVRkRSRHM3UVVGRlJDeGhRVUZMTEV0QlFVd3NRMEZCVnl4TFFVRllMRU5CUVdsQ0xGVkJRVU1zU1VGQlJDeEZRVUZWTzBGQlEzcENMR05CUVUwc1VVRkJVU3hMUVVGTExFdEJRVXdzUTBGQlZ5eExRVUZZTEVOQlFXbENMRXRCUVdwQ0xFTkJRWFZDTERCQ1FVRjJRaXhEUVVGa096dEJRVVZCTEdOQlFVa3NTMEZCU2l4RlFVRlhPMEZCUTFRc1owSkJRVWtzUzBGQlN5eExRVUZNTEVOQlFWY3NUMEZCWml4RlFVRjNRanRCUVVOMFFpeHJRa0ZCU1N4UFFVRkxMRmxCUVV3c1MwRkJjMElzUzBGQlN5eEpRVUV2UWl4RlFVRnhRenRCUVVOdVF5eDFRa0ZCU3l4UlFVRk1MRU5CUVdNc1MwRkJTeXhKUVVGdVFqdEJRVU5FTzBGQlEwUXNjVUpCUVVzc1dVRkJUQ3hIUVVGdlFpeExRVUZMTEVsQlFYcENPMEZCUTBFc2NVSkJRVThzUzBGQlVEdEJRVU5FTzBGQlEwWTdPMEZCUlVRc2FVSkJRVThzU1VGQlVEdEJRVU5FTEZOQlpFUTdRVUZsUkR0QlFXeEdiMEk3UVVGQlFUdEJRVUZCTEhkRFFXOUdTRHRCUVVOb1FpeGxRVUZQTEhsSVFVRXlRaXhMUVVGTExFOUJRVXdzUTBGQllTeExRVUZpTEVOQlFXMUNMRXRCUVVzc1dVRkJlRUlzVFVGQk1FTXNTVUZCTlVVN1FVRkRSRHRCUVhSR2IwSTdRVUZCUVR0QlFVRkJMQ3RDUVhkR1dpeEpRWGhHV1N4RlFYZEdUanRCUVVOaUxGbEJRVTBzVlVGQlZTeFRRVUZUTEVsQlFYcENPenRCUVVWQkxGbEJRVWtzUzBGQlN5eFBRVUZNTEVOQlFXRXNTMEZCWWl4RFFVRnRRaXhKUVVGdVFpeE5RVUUyUWl4SlFVRnFReXhGUVVGMVF6dEJRVU55UXl4alFVRkpMRU5CUVVNc1VVRkJVU3hUUVVGU0xFTkJRV3RDTEZGQlFXeENMSFZDUVVFclF5eExRVUZMTEZOQlFYQkVMRU5CUVV3c1JVRkJkVVU3UVVGRGNrVXNiMEpCUVZFc1UwRkJVaXhEUVVGclFpeEhRVUZzUWl4MVFrRkJNRU1zUzBGQlN5eFRRVUV2UXp0QlFVTkVPenRCUVVWRUxHVkJRVXNzVjBGQlRDeEhRVUZ0UWl4TFFVRnVRanM3UVVGRlFUdEJRVU5CTEdWQlFVc3NUMEZCVEN4SFFVRmxMRXRCUVdZN1FVRkRRU3hsUVVGTExFbEJRVXc3UVVGRFFUdEJRVU5CTEdWQlFVc3NZMEZCVER0QlFVTkVMRk5CV2tRc1RVRlpUenRCUVVOTUxHTkJRVWtzVVVGQlVTeFRRVUZTTEVOQlFXdENMRkZCUVd4Q0xIVkNRVUVyUXl4TFFVRkxMRk5CUVhCRUxFTkJRVW9zUlVGQmMwVTdRVUZEY0VVc2IwSkJRVkVzVTBGQlVpeERRVUZyUWl4TlFVRnNRaXgxUWtGQk5rTXNTMEZCU3l4VFFVRnNSRHRCUVVORU96dEJRVVZFTEdWQlFVc3NTVUZCVER0QlFVTkJMR1ZCUVVzc1YwRkJUQ3hIUVVGdFFpeEpRVUZ1UWp0QlFVTkJMR1ZCUVVzc1QwRkJUQ3hIUVVGbExFbEJRV1k3UVVGRFJEdEJRVU5HTzBGQmFFaHZRanRCUVVGQk8wRkJRVUVzY1VOQmEwaE9MRXRCYkVoTkxFVkJhMGhETzBGQlEzQkNMRmxCUVVrc1RVRkJUU3hKUVVGT0xFdEJRV1VzVDBGQlppeEpRVUV3UWl4TlFVRk5MRTlCUVU0c1MwRkJhMElzUlVGQk5VTXNTVUZCYTBRc1RVRkJUU3hQUVVGT0xFdEJRV3RDTEVWQlFYaEZMRVZCUVRSRk8wRkJRekZGTzBGQlEwUTdPMEZCUlVRN1FVRkRRU3hoUVVGTExFbEJRVXc3UVVGRFJEdEJRWHBJYjBJN1FVRkJRVHRCUVVGQkxEWkNRVEpJWkR0QlFVRkJPenRCUVVOTUxGbEJRVWtzUzBGQlN5eFBRVUZNTEVOQlFXRXNUMEZCWWl4RFFVRnhRaXhUUVVGeVFpeERRVUVyUWl4UlFVRXZRaXhEUVVGM1F5eE5RVUY0UXl4RFFVRktMRVZCUVhGRU8wRkJRMjVFTEdsQ1FVRlBMRXRCUVZBN1FVRkRSRHM3UVVGRlJEdEJRVU5CTEcxQ1FVRlhMRmxCUVUwN1FVRkRaaXhwUWtGQlN5eFpRVUZNTEVOQlFXdENMR2xDUVVGTkxFbEJRWGhDT3p0QlFVVkJMR05CUVUwc1ZVRkJWU3hUUVVGV0xFOUJRVlVzUjBGQlRUdEJRVU53UWl4dFFrRkJTeXhaUVVGTUxFTkJRV3RDTEdsQ1FVRk5MRXRCUVhoQ096dEJRVVZCTEdkQ1FVRkpMRTlCUVVzc1QwRkJWQ3hGUVVGclFqdEJRVU5vUWl4eFFrRkJTeXhQUVVGTUxFTkJRV0VzVDBGQllpeERRVUZ4UWl4dFFrRkJja0lzUTBGQmVVTXNhVUpCUVUwc1kwRkJMME1zUlVGQkswUXNUMEZCTDBRN1FVRkRRU3h4UWtGQlN5eFBRVUZNTEVOQlFXRXNUMEZCWWl4RFFVRnhRaXhUUVVGeVFpeERRVUVyUWl4TlFVRXZRaXhEUVVGelF5eFRRVUYwUXp0QlFVTkVPMEZCUTBZc1YwRlFSRHM3UVVGVFFTeGpRVUZKTEU5QlFVc3NWMEZCVkN4RlFVRnpRanRCUVVOd1FpeHRRa0ZCU3l4alFVRk1PMEZCUTBRN08wRkJSMFFzWTBGQlNTeFBRVUZMTEU5QlFWUXNSVUZCYTBJN1FVRkRhRUlzYlVKQlFVc3NUMEZCVEN4RFFVRmhMRTlCUVdJc1EwRkJjVUlzWjBKQlFYSkNMRU5CUVhORExHbENRVUZOTEdOQlFUVkRMRVZCUVRSRUxFOUJRVFZFTzBGQlEwRXNiVUpCUVVzc1QwRkJUQ3hEUVVGaExFOUJRV0lzUTBGQmNVSXNVMEZCY2tJc1EwRkJLMElzUjBGQkwwSXNRMEZCYlVNc1UwRkJia003UVVGRFJDeFhRVWhFTEUxQlIwODdRVUZEVER0QlFVTkJPMEZCUTBRN08wRkJSVVFzYVVKQlFVc3NUMEZCVEN4RFFVRmhMRTlCUVdJc1EwRkJjVUlzVTBGQmNrSXNRMEZCSzBJc1IwRkJMMElzUTBGQmJVTXNUVUZCYmtNN08wRkJSVUU3UVVGRFFTeHBRa0ZCU3l4WlFVRk1PMEZCUTBRc1UwRTNRa1FzUlVFMlFrY3NRMEUzUWtnN08wRkJLMEpCTEdWQlFVOHNTVUZCVUR0QlFVTkVPMEZCYWt0dlFqdEJRVUZCTzBGQlFVRXNOa0pCYlV0a08wRkJRVUU3TzBGQlEwd3NXVUZCU1N4RFFVRkRMRXRCUVVzc1QwRkJUQ3hEUVVGaExFOUJRV0lzUTBGQmNVSXNVMEZCY2tJc1EwRkJLMElzVVVGQkwwSXNRMEZCZDBNc1RVRkJlRU1zUTBGQlRDeEZRVUZ6UkR0QlFVTndSQ3hwUWtGQlR5eExRVUZRTzBGQlEwUTdPMEZCUlVRc1lVRkJTeXhaUVVGTUxFTkJRV3RDTEdsQ1FVRk5MRWxCUVhoQ096dEJRVVZCTEdGQlFVc3NXVUZCVERzN1FVRkZRU3haUVVGSkxFdEJRVXNzVDBGQlZDeEZRVUZyUWp0QlFVTm9RaXhsUVVGTExFOUJRVXdzUTBGQllTeFBRVUZpTEVOQlFYRkNMRk5CUVhKQ0xFTkJRU3RDTEVkQlFTOUNMRU5CUVcxRExGTkJRVzVETzBGQlEwUTdPMEZCUlVRc1lVRkJTeXhQUVVGTUxFTkJRV0VzVDBGQllpeERRVUZ4UWl4VFFVRnlRaXhEUVVFclFpeE5RVUV2UWl4RFFVRnpReXhOUVVGMFF6czdRVUZGUVN4WlFVRkpMRXRCUVVzc1YwRkJWQ3hGUVVGelFqdEJRVU53UWl4alFVRk5MRmRCUVZjc1MwRkJTeXhYUVVGTUxFVkJRV3BDT3p0QlFVVkJMR05CUVUwc1YwRkJWeXhUUVVGWUxGRkJRVmNzUjBGQlRUdEJRVU55UWl4blFrRkJTU3hQUVVGTExFOUJRVlFzUlVGQmEwSTdRVUZEYUVJc2NVSkJRVXNzVDBGQlRDeERRVUZoTEU5QlFXSXNRMEZCY1VJc1UwRkJja0lzUTBGQkswSXNUVUZCTDBJc1EwRkJjME1zVTBGQmRFTTdRVUZEUkRzN1FVRkZSQ3h4UWtGQlV5eHRRa0ZCVkN4RFFVRTJRaXhwUWtGQlRTeGpRVUZ1UXl4RlFVRnRSQ3hSUVVGdVJEdEJRVU5CTEcxQ1FVRkxMRmxCUVV3c1EwRkJhMElzYVVKQlFVMHNUVUZCZUVJN1FVRkRRU3h0UWtGQlN5eGpRVUZNTzBGQlEwUXNWMEZTUkRzN1FVRlZRU3h0UWtGQlV5eG5Ra0ZCVkN4RFFVRXdRaXhwUWtGQlRTeGpRVUZvUXl4RlFVRm5SQ3hSUVVGb1JEdEJRVU5CTEcxQ1FVRlRMRk5CUVZRc1EwRkJiVUlzUjBGQmJrSXNRMEZCZFVJc1UwRkJka0k3UVVGRFJEczdRVUZGUkN4bFFVRlBMRWxCUVZBN1FVRkRSRHRCUVhCTmIwSTdRVUZCUVR0QlFVRkJMSFZEUVhOTlNqdEJRVU5tTEZsQlFVMHNWMEZCVnl4VFFVRlRMR0ZCUVZRc1EwRkJkVUlzUzBGQmRrSXNRMEZCYWtJN1FVRkRRU3hwUWtGQlV5eFpRVUZVTEVOQlFYTkNMRk5CUVhSQ0xFVkJRV2xETEV0QlFVc3NSVUZCZEVNN1FVRkRRU3hwUWtGQlV5eFRRVUZVTEVOQlFXMUNMRWRCUVc1Q0xFTkJRWFZDTEdsQ1FVRjJRanM3UVVGRlFTeHBRa0ZCVXl4SlFVRlVMRU5CUVdNc1YwRkJaQ3hEUVVFd1FpeFJRVUV4UWp0QlFVTkVPMEZCTlUxdlFqdEJRVUZCTzBGQlFVRXNiME5CT0UxUU8wRkJRMW9zWlVGQlR5eFRRVUZUTEdGQlFWUXNUMEZCTWtJc2FVSkJRVE5DTEd0Q1FVRjVSQ3hMUVVGTExFVkJRVGxFTEZGQlFWQTdRVUZEUkR0QlFXaE9iMEk3UVVGQlFUdEJRVUZCTEhWRFFXdE9TanRCUVVObUxGbEJRVTBzVjBGQlZ5eExRVUZMTEZkQlFVd3NSVUZCYWtJN1FVRkRRU3haUVVGSkxGRkJRVW9zUlVGQll6dEJRVU5hTEcxQ1FVRlRMRWxCUVZRc1EwRkJZeXhYUVVGa0xFTkJRVEJDTEZGQlFURkNPMEZCUTBRN1FVRkRSanRCUVhaT2IwSTdRVUZCUVR0QlFVRkJMSEZEUVhsT1RqdEJRVUZCT3p0QlFVTmlMRmxCUVUwc2FVSkJRV2xDTEV0QlFVc3NUMEZCVEN4RFFVRmhMRTlCUVdJc1EwRkJjVUlzWjBKQlFYSkNMRU5CUVhORExHZENRVUYwUXl4RFFVRjJRanM3UVVGRlFTeFpRVUZKTEdOQlFVb3NSVUZCYjBJN1FVRkRiRUlzWjBKQlFVMHNTVUZCVGl4RFFVRlhMR05CUVZnc1JVRkJNa0lzVDBGQk0wSXNRMEZCYlVNN1FVRkJRU3h0UWtGQlZTeFBRVUZMTEdWQlFVd3NRMEZCY1VJc1JVRkJSU3hSUVVGUkxFMUJRVllzUlVGQmEwSXNUMEZCVHl4UFFVRjZRaXhGUVVGeVFpeERRVUZXTzBGQlFVRXNWMEZCYmtNN1FVRkRSRHM3UVVGRlJDeFpRVUZKTEV0QlFVc3NWMEZCVkN4RlFVRnpRanRCUVVOd1FpeGpRVUZOTEZkQlFWY3NTMEZCU3l4WFFVRk1MRVZCUVdwQ08wRkJRMEVzWlVGQlN5eGxRVUZNTEVOQlFYRkNMRVZCUVVVc1VVRkJVU3hSUVVGV0xFVkJRVzlDTEU5QlFVOHNhVUpCUVUwc1MwRkJha01zUlVGQmNrSTdRVUZEUkRzN1FVRkZSQ3hoUVVGTExHVkJRVXdzUTBGQmNVSXNSVUZCUlN4UlFVRlJMRkZCUVZZc1JVRkJiMElzVDBGQlR5eFBRVUV6UWl4RlFVRnlRanRCUVVORU8wRkJkRTl2UWp0QlFVRkJPMEZCUVVFc2NVTkJkMDlPTzBGQlFVRTdPMEZCUTJJc1dVRkJUU3hwUWtGQmFVSXNTMEZCU3l4UFFVRk1MRU5CUVdFc1QwRkJZaXhEUVVGeFFpeG5Ra0ZCY2tJc1EwRkJjME1zWjBKQlFYUkRMRU5CUVhaQ096dEJRVVZCTEZsQlFVa3NZMEZCU2l4RlFVRnZRanRCUVVOc1FpeG5Ra0ZCVFN4SlFVRk9MRU5CUVZjc1kwRkJXQ3hGUVVFeVFpeFBRVUV6UWl4RFFVRnRRenRCUVVGQkxHMUNRVUZWTEU5QlFVc3NhVUpCUVV3c1EwRkJkVUlzUlVGQlJTeFJRVUZSTEUxQlFWWXNSVUZCYTBJc1QwRkJUeXhQUVVGNlFpeEZRVUYyUWl4RFFVRldPMEZCUVVFc1YwRkJia003UVVGRFJEczdRVUZGUkN4WlFVRkpMRXRCUVVzc1YwRkJWQ3hGUVVGelFqdEJRVU53UWl4alFVRk5MRmRCUVZjc1MwRkJTeXhYUVVGTUxFVkJRV3BDTzBGQlEwRXNaVUZCU3l4cFFrRkJUQ3hEUVVGMVFpeEZRVUZGTEZGQlFWRXNVVUZCVml4RlFVRnZRaXhQUVVGUExHbENRVUZOTEV0QlFXcERMRVZCUVhaQ08wRkJRMFE3TzBGQlJVUXNZVUZCU3l4cFFrRkJUQ3hEUVVGMVFpeEZRVUZGTEZGQlFWRXNVVUZCVml4RlFVRnZRaXhQUVVGUExFOUJRVE5DTEVWQlFYWkNPMEZCUTBRN1FVRnlVRzlDTzBGQlFVRTdRVUZCUVN4dFEwRjFVRVE3UVVGRGJFSXNaVUZCVHl4SlFVRlFPMEZCUTBRN1FVRjZVRzlDTzBGQlFVRTdRVUZCUVN4dlEwRXlVRUVzVDBFelVFRXNSVUV5VUZNN1FVRkROVUlzSzBkQlFUSkNMRk5CUVROQ0xFVkJRWE5ETEU5QlFYUkRPMEZCUTBRN1FVRTNVRzlDT3p0QlFVRkJPMEZCUVVFN08wRkJaMUYyUWpzN096czdPenRCUVV0QkxFMUJRVTBzWVVGQllTeEZRVUZ1UWpzN1FVRkZRU3hOUVVGTkxGbEJRVmtzVTBGQlV5eG5Ra0ZCVkN4UFFVRTRRaXhKUVVFNVFpeERRVUZzUWp0QlFVTkJMRTFCUVVrc1UwRkJTaXhGUVVGbE8wRkJRMklzVlVGQlRTeEpRVUZPTEVOQlFWY3NVMEZCV0N4RlFVRnpRaXhQUVVGMFFpeERRVUU0UWl4VlFVRkRMRTlCUVVRc1JVRkJZVHRCUVVONlF5eFZRVUZOTEZOQlFWTXNNa05CUVc5Q0xFOUJRWEJDTEVWQlFUWkNMR3RDUVVFM1FpeEZRVUZwUkN4eFFrRkJha1FzUTBGQlpqdEJRVU5CTEdGQlFVOHNUMEZCVUN4SFFVRnBRaXhQUVVGcVFqczdRVUZGUVN4cFFrRkJWeXhKUVVGWUxFTkJRV2RDTEVWQlFVVXNaMEpCUVVZc1JVRkJWeXhYUVVGWExFbEJRVWtzVTBGQlNpeERRVUZqTEUxQlFXUXNRMEZCZEVJc1JVRkJhRUk3UVVGRFJDeExRVXhFTzBGQlRVUTdPMEZCUlVRc1RVRkJTU3hUUVVGS0xFVkJRV1U3UVVGRFlpeGhRVUZUTEdkQ1FVRlVMRU5CUVRCQ0xFOUJRVEZDTEVWQlFXMURMRlZCUVVNc1MwRkJSQ3hGUVVGWE8wRkJRelZETEZWQlFVMHNVMEZCVXl3MlFrRkJhVUlzVFVGQlRTeE5RVUYyUWl4RlFVRXJRaXhoUVVFdlFpeERRVUZtTzBGQlEwRXNWVUZCU1N4RFFVRkRMRTFCUVV3c1JVRkJZVHRCUVVOWU8wRkJRMFE3TzBGQlJVUXNWVUZCVFN4cFFrRkJhVUlzVDBGQlR5eFpRVUZRTEVOQlFXOUNMR0ZCUVhCQ0xFTkJRWFpDTzBGQlEwRXNWVUZCU1N4clFrRkJhMElzYlVKQlFXMUNMRWxCUVhwRExFVkJRU3RETzBGQlF6ZERMRmxCUVUwc1MwRkJTeXhQUVVGUExGbEJRVkFzUTBGQmIwSXNZVUZCY0VJc1EwRkJXRHRCUVVOQkxGbEJRVTBzVlVGQlZTeFRRVUZUTEdGQlFWUXNRMEZCZFVJc1JVRkJka0lzUTBGQmFFSTdPMEZCUlVFc1dVRkJUU3haUVVGWkxGZEJRVmNzU1VGQldDeERRVUZuUWp0QlFVRkJMR2xDUVVGTExFVkJRVVVzVDBGQlJpeExRVUZqTEU5QlFXNUNPMEZCUVVFc1UwRkJhRUlzUTBGQmJFSTdPMEZCUlVFc1dVRkJTU3hEUVVGRExGTkJRVXdzUlVGQlowSTdRVUZEWkR0QlFVTkVPenRCUVVWRUxHVkJRVThzU1VGQlVEczdRVUZGUVN4clFrRkJWU3hUUVVGV0xFTkJRVzlDTEVsQlFYQkNPMEZCUTBRN1FVRkRSaXhMUVhKQ1JEdEJRWE5DUkRzN1FVRkZSQ3hUUVVGUExGTkJRVkE3UVVGRFJDeERRVE5UYVVJc1JVRkJiRUk3TzJ0Q1FUWlRaU3hUT3pzN096czdPenM3T3pzN08wRkRiRlJtT3pzN08wRkJRMEU3T3pzN096czdPenM3SzJWQlRrRTdPenM3T3pzN1FVRlJRU3hKUVVGTkxGZEJRVmtzV1VGQlRUdEJRVU4wUWpzN096czdPMEZCVFVFc1RVRkJUU3hQUVVGUExGVkJRV0k3UVVGRFFTeE5RVUZOTEZWQlFWVXNUMEZCYUVJN1FVRkRRU3hOUVVGTkxIRkNRVUZ4UWp0QlFVTjZRaXhoUVVGVExFbEJSR2RDTzBGQlJYcENMRmxCUVZFc1EwRkdhVUk3UVVGSGVrSXNVMEZCU3l4RFFVaHZRanRCUVVsNlFpeFRRVUZMTEVkQlNtOUNPMEZCUzNwQ0xGZEJRVThzUzBGTWEwSTdRVUZOZWtJc1lVRkJVeXhMUVU1blFqdEJRVTk2UWl4blFrRkJXVHRCUVZCaExFZEJRVE5DTzBGQlUwRXNUVUZCVFN4M1FrRkJkMElzUTBGRE5VSXNVVUZFTkVJc1JVRkZOVUlzUzBGR05FSXNSVUZITlVJc1MwRklORUlzUlVGSk5VSXNUMEZLTkVJc1JVRkxOVUlzVTBGTU5FSXNSVUZOTlVJc1dVRk9ORUlzUTBGQk9VSTdPMEZCVTBFN096czdPenRCUVROQ2MwSXNUVUZwUTJoQ0xGRkJha05uUWp0QlFVRkJPenRCUVcxRGNFSXNkMEpCUVRCQ08wRkJRVUVzVlVGQlpDeFBRVUZqTEhWRlFVRktMRVZCUVVrN08wRkJRVUU3TzBGQlIzaENPMEZCU0hkQ0xITklRVU5zUWl4SlFVUnJRaXhGUVVOYUxFOUJSRmtzUlVGRFNDeHJRa0ZFUnl4RlFVTnBRaXhQUVVScVFpeEZRVU13UWl4eFFrRkVNVUlzUlVGRGFVUXNTMEZFYWtRc1JVRkRkMFFzUzBGRWVFUTdPMEZCU1hoQ0xGbEJRVXNzVDBGQlRDeERRVUZoTEU5QlFXSXNRMEZCY1VJc1MwRkJja0lzUTBGQk1rSXNUVUZCTTBJc1IwRkJkVU1zVFVGQlN5eFBRVUZNTEVOQlFXRXNUVUZCY0VRN08wRkJSVUU3UVVGRFFTeFZRVUZOTEdOQlFXTXNUVUZCU3l4alFVRk1MRVZCUVhCQ08wRkJRMEVzYTBKQlFWa3NXVUZCV2l4RFFVRjVRaXhsUVVGNlFpeFBRVUUyUXl4TlFVRkxMRTlCUVV3c1EwRkJZU3hIUVVFeFJEdEJRVU5CTEd0Q1FVRlpMRmxCUVZvc1EwRkJlVUlzWlVGQmVrSXNUMEZCTmtNc1RVRkJTeXhQUVVGTUxFTkJRV0VzUjBGQk1VUTdPMEZCUlVFN1FVRkRRU3hWUVVGSkxFMUJRVXNzVDBGQlRDeERRVUZoTEU5QlFXSXNTVUZEUXl4RFFVRkRMRmxCUVZrc1UwRkJXaXhEUVVGelFpeFJRVUYwUWl4RFFVRXJRaXh6UWtGQkwwSXNRMEZFVGl4RlFVTTRSRHRCUVVNMVJDeHZRa0ZCV1N4VFFVRmFMRU5CUVhOQ0xFZEJRWFJDTEVOQlFUQkNMSE5DUVVFeFFqdEJRVU5FT3p0QlFVVkVPMEZCUTBFc1ZVRkJTU3hQUVVGUExFMUJRVXNzVDBGQlRDeERRVUZoTEZWQlFYQkNMRXRCUVcxRExGRkJRVzVETEVsQlEwTXNRMEZCUXl4WlFVRlpMRk5CUVZvc1EwRkJjMElzVVVGQmRFSXNVMEZCY1VNc1RVRkJTeXhQUVVGTUxFTkJRV0VzVlVGQmJFUXNRMEZFVGl4RlFVTjFSVHRCUVVOeVJTeHZRa0ZCV1N4VFFVRmFMRU5CUVhOQ0xFZEJRWFJDTEZOQlFXZERMRTFCUVVzc1QwRkJUQ3hEUVVGaExGVkJRVGRETzBGQlEwUTdRVUZ5UW5WQ08wRkJjMEo2UWpzN1FVRjZSRzFDTzBGQlFVRTdRVUZCUVN4MVEwRXlSRWc3UVVGRFppeGxRVUZQTEV0QlFVc3NUMEZCVEN4RFFVRmhMRTlCUVdJc1EwRkJjVUlzWVVGQmNrSXNRMEZCYlVNc1pVRkJia01zUTBGQlVEdEJRVU5FTzBGQk4wUnRRanRCUVVGQk8wRkJRVUVzTkVKQkswUk1PMEZCUVVFc1dVRkJXQ3hMUVVGWExIVkZRVUZJTEVOQlFVYzdPMEZCUTJJc1dVRkJUU3hqUVVGakxFdEJRVXNzWTBGQlRDeEZRVUZ3UWp0QlFVTkJMRmxCUVUwc1YwRkJWeXhMUVVGTExFdEJRVXdzUTBGQldTeFRRVUZUTEV0QlFVc3NUMEZCVEN4RFFVRmhMRWRCUVdJc1IwRkJiVUlzUzBGQlN5eFBRVUZNTEVOQlFXRXNSMEZCZWtNc1EwRkJSQ3hIUVVGclJDeEhRVUUzUkN4RFFVRnFRanM3UVVGRlFTeFpRVUZKTEZGQlFWRXNTMEZCU3l4UFFVRk1MRU5CUVdFc1IwRkJla0lzUlVGQk9FSTdRVUZETlVJc2EwSkJRVkVzUzBGQlVpeERRVUZwUWl4SlFVRnFRaXh0UWtGQmJVTXNTMEZCYmtNN1FVRkRRU3hwUWtGQlR5eExRVUZRTzBGQlEwUTdPMEZCUlVRc1dVRkJTU3hSUVVGUkxFdEJRVXNzVDBGQlRDeERRVUZoTEVkQlFYcENMRVZCUVRoQ08wRkJRelZDTEd0Q1FVRlJMRXRCUVZJc1EwRkJhVUlzU1VGQmFrSXNiVUpCUVcxRExFdEJRVzVETzBGQlEwRXNhVUpCUVU4c1MwRkJVRHRCUVVORU96dEJRVVZFTEc5Q1FVRlpMRmxCUVZvc1EwRkJlVUlzWlVGQmVrSXNUMEZCTmtNc1MwRkJOME03TzBGQlJVRTdRVUZEUVN4WlFVRkpMRXRCUVVzc1QwRkJUQ3hEUVVGaExFdEJRV3BDTEVWQlFYZENPMEZCUTNSQ0xITkNRVUZaTEZOQlFWb3NSMEZCTWtJc1VVRkJNMEk3UVVGRFJEczdRVUZGUkR0QlFVTkJMRzlDUVVGWkxFdEJRVm9zUTBGQmEwSXNTMEZCYkVJc1IwRkJOa0lzVVVGQk4wSTdPMEZCUlVFc1pVRkJUeXhKUVVGUU8wRkJRMFE3UVVGNFJtMUNPMEZCUVVFN1FVRkJRU3huUTBFd1JsYzdRVUZCUVN4WlFVRjJRaXhqUVVGMVFpeDFSVUZCVGl4SlFVRk5PenRCUVVNM1FpeFpRVUZKTEVOQlFVTXNTMEZCU3l4UFFVRk1MRU5CUVdFc1QwRkJiRUlzUlVGQk1rSTdRVUZEZWtJc2EwSkJRVkVzUzBGQlVpeERRVUZwUWl4SlFVRnFRanRCUVVOQkxHbENRVUZQTEV0QlFWQTdRVUZEUkRzN1FVRkZSQ3haUVVGTkxHTkJRV01zUzBGQlN5eGpRVUZNTEVWQlFYQkNPenRCUVVWQkxGbEJRVWtzYTBKQlEwTXNRMEZCUXl4WlFVRlpMRk5CUVZvc1EwRkJjMElzVVVGQmRFSXNRMEZCSzBJc2RVSkJRUzlDTEVOQlJFNHNSVUZESzBRN1FVRkROMFFzYzBKQlFWa3NVMEZCV2l4RFFVRnpRaXhIUVVGMFFpeERRVUV3UWl4MVFrRkJNVUk3UVVGRFJEczdRVUZGUkN4WlFVRkpMRU5CUVVNc1kwRkJSQ3hKUVVORExGbEJRVmtzVTBGQldpeERRVUZ6UWl4UlFVRjBRaXhEUVVFclFpeDFRa0ZCTDBJc1EwRkVUQ3hGUVVNNFJEdEJRVU0xUkN4elFrRkJXU3hUUVVGYUxFTkJRWE5DTEUxQlFYUkNMRU5CUVRaQ0xIVkNRVUUzUWp0QlFVTkVPenRCUVVWRUxHVkJRVThzU1VGQlVEdEJRVU5FTzBGQk4wZHRRanRCUVVGQk8wRkJRVUVzTmtKQkswZGlPMEZCUTB3c1lVRkJTeXhQUVVGTUxFTkJRV0VzVDBGQllpeERRVUZ4UWl4TFFVRnlRaXhEUVVFeVFpeE5RVUV6UWl4SFFVRjFReXhMUVVGTExFOUJRVXdzUTBGQllTeE5RVUZ3UkR0QlFVTkJMR0ZCUVVzc1dVRkJUQ3hEUVVGclFpeHBRa0ZCVFN4SlFVRjRRanRCUVVOQkxHRkJRVXNzV1VGQlRDeERRVUZyUWl4cFFrRkJUU3hMUVVGNFFqczdRVUZGUVN4bFFVRlBMRWxCUVZBN1FVRkRSRHRCUVhKSWJVSTdRVUZCUVR0QlFVRkJMRFpDUVhWSVlqdEJRVU5NTEdGQlFVc3NUMEZCVEN4RFFVRmhMRTlCUVdJc1EwRkJjVUlzUzBGQmNrSXNRMEZCTWtJc1RVRkJNMElzUjBGQmIwTXNTMEZCY0VNN1FVRkRRU3hoUVVGTExGbEJRVXdzUTBGQmEwSXNhVUpCUVUwc1NVRkJlRUk3UVVGRFFTeGhRVUZMTEZsQlFVd3NRMEZCYTBJc2FVSkJRVTBzVFVGQmVFSTdPMEZCUlVFc1pVRkJUeXhKUVVGUU8wRkJRMFE3UVVFM1NHMUNPMEZCUVVFN1FVRkJRU3h0UTBFclNFRTdRVUZEYkVJc1pVRkJUeXhKUVVGUU8wRkJRMFE3UVVGcVNXMUNPMEZCUVVFN1FVRkJRU3h2UTBGdFNVTXNUMEZ1U1VRc1JVRnRTVlU3UVVGRE5VSXNOa2RCUVRKQ0xGRkJRVE5DTEVWQlFYRkRMRTlCUVhKRE8wRkJRMFE3UVVGeVNXMUNPenRCUVVGQk8wRkJRVUU3TzBGQmQwbDBRaXhUUVVGUExGRkJRVkE3UVVGRFJDeERRWHBKWjBJc1JVRkJha0k3TzJ0Q1FUSkpaU3hST3pzN096czdPenM3T3pzN08wRkRPVWxtT3pzN08wRkJRMEU3TzBGQlEwRTdPenM3UVVGRFFUczdPenM3T3pzN0syVkJVa0U3T3pzN096czdRVUZWUVN4SlFVRk5MRTFCUVU4c1dVRkJUVHRCUVVOcVFqczdPenM3TzBGQlRVRXNUVUZCVFN4UFFVRlBMRXRCUVdJN1FVRkRRU3hOUVVGTkxGVkJRVlVzVDBGQmFFSTdRVUZEUVN4TlFVRk5MSEZDUVVGeFFpeEZRVUV6UWp0QlFVZEJMRTFCUVUwc2QwSkJRWGRDTEVWQlFUbENPMEZCUlVFc1RVRkJUU3gxUWtGQmRVSXNWMEZCTjBJN08wRkJSVUU3T3pzN096dEJRV2hDYVVJc1RVRnpRbGdzUjBGMFFsYzdRVUZCUVRzN1FVRjNRbVlzYlVKQlFUQkNPMEZCUVVFc1ZVRkJaQ3hQUVVGakxIVkZRVUZLTEVWQlFVazdPMEZCUVVFN08wRkJRVUVzZFVkQlEyeENMRWxCUkd0Q0xFVkJRMW9zVDBGRVdTeEZRVU5JTEd0Q1FVUkhMRVZCUTJsQ0xFOUJSR3BDTEVWQlF6QkNMSEZDUVVReFFpeEZRVU5wUkN4TFFVUnFSQ3hGUVVOM1JDeExRVVI0UkR0QlFVVjZRanM3UVVFeFFtTTdRVUZCUVR0QlFVRkJMRFpDUVRSQ1VqdEJRVU5NTEZsQlFVa3NTMEZCU3l4UFFVRk1MRU5CUVdFc1QwRkJZaXhEUVVGeFFpeFRRVUZ5UWl4RFFVRXJRaXhSUVVFdlFpeERRVUYzUXl4UlFVRjRReXhEUVVGS0xFVkJRWFZFTzBGQlEzSkVMR2xDUVVGUExFdEJRVkE3UVVGRFJEczdRVUZGUkN4WlFVRk5MRXRCUVVzc1MwRkJTeXhQUVVGTUxFTkJRV0VzVDBGQllpeERRVUZ4UWl4WlFVRnlRaXhEUVVGclF5eE5RVUZzUXl4RFFVRllPMEZCUTBFc1dVRkJUU3hOUVVGTkxEaENRVUZyUWl4TFFVRkxMRTlCUVV3c1EwRkJZU3hQUVVFdlFpeEZRVUYzUXl4TFFVRjRReXhEUVVGYU8wRkJRMEVzV1VGQlRTeFZRVUZWTEUxQlFVMHNTVUZCU1N4blFrRkJTaXh2UWtGQmMwTXNTVUZCZEVNc1VVRkJUaXhIUVVGM1JDeEpRVUY0UlRzN1FVRkZRU3haUVVGSkxFOUJRVW9zUlVGQllUdEJRVU5ZTEdkQ1FVRk5MRWxCUVU0c1EwRkJWeXhQUVVGWUxFVkJRVzlDTEU5QlFYQkNMRU5CUVRSQ0xGVkJRVU1zUjBGQlJDeEZRVUZUTzBGQlEyNURMR2RDUVVGSkxFbEJRVWtzVTBGQlNpeERRVUZqTEZGQlFXUXNRMEZCZFVJc1VVRkJka0lzUTBGQlNpeEZRVUZ6UXp0QlFVTndReXhyUWtGQlNTeFRRVUZLTEVOQlFXTXNUVUZCWkN4RFFVRnhRaXhSUVVGeVFqdEJRVU5FTzBGQlEwUXNaMEpCUVVrc1dVRkJTaXhEUVVGcFFpeGxRVUZxUWl4RlFVRnJReXhMUVVGc1F6dEJRVU5FTEZkQlRFUTdRVUZOUkRzN1FVRkZSQ3hoUVVGTExFOUJRVXdzUTBGQllTeFBRVUZpTEVOQlFYRkNMRk5CUVhKQ0xFTkJRU3RDTEVkQlFTOUNMRU5CUVcxRExGRkJRVzVETzBGQlEwRXNZVUZCU3l4UFFVRk1MRU5CUVdFc1QwRkJZaXhEUVVGeFFpeFpRVUZ5UWl4RFFVRnJReXhsUVVGc1F5eEZRVUZ0UkN4SlFVRnVSRHM3UVVGRlFTeFpRVUZOTEdGQlFXRXNVMEZCVXl4aFFVRlVMRU5CUVhWQ0xFVkJRWFpDTEVOQlFXNUNPMEZCUTBFc1dVRkJUU3hqUVVGakxGZEJRVmNzVlVGQldDeERRVUZ6UWl4blFrRkJkRUlzUTBGQmRVTXNiMEpCUVhaRExFTkJRWEJDT3p0QlFVVkJMRmxCUVVrc1YwRkJTaXhGUVVGcFFqdEJRVU5tTEdkQ1FVRk5MRWxCUVU0c1EwRkJWeXhYUVVGWUxFVkJRWGRDTEU5QlFYaENMRU5CUVdkRExGVkJRVU1zUjBGQlJDeEZRVUZUTzBGQlEzWkRMR2RDUVVGSkxFbEJRVWtzVTBGQlNpeERRVUZqTEZGQlFXUXNRMEZCZFVJc1VVRkJka0lzUTBGQlNpeEZRVUZ6UXp0QlFVTndReXhyUWtGQlNTeFRRVUZLTEVOQlFXTXNUVUZCWkN4RFFVRnhRaXhSUVVGeVFqdEJRVU5FTzBGQlEwWXNWMEZLUkR0QlFVdEVPenRCUVVWRUxHMUNRVUZYTEZOQlFWZ3NRMEZCY1VJc1IwRkJja0lzUTBGQmVVSXNVMEZCZWtJN08wRkJSVUVzYlVKQlFWY3NXVUZCVFR0QlFVTm1MR05CUVUwc1YwRkJWeXhUUVVGWUxGRkJRVmNzUjBGQlRUdEJRVU55UWl4MVFrRkJWeXhUUVVGWUxFTkJRWEZDTEUxQlFYSkNMRU5CUVRSQ0xGTkJRVFZDTzBGQlEwRXNkVUpCUVZjc1UwRkJXQ3hEUVVGeFFpeEhRVUZ5UWl4RFFVRjVRaXhSUVVGNlFqdEJRVU5CTEhWQ1FVRlhMRk5CUVZnc1EwRkJjVUlzVFVGQmNrSXNRMEZCTkVJc1UwRkJOVUk3UVVGRFFTeDFRa0ZCVnl4dFFrRkJXQ3hEUVVFclFpeHBRa0ZCVFN4alFVRnlReXhGUVVGeFJDeFJRVUZ5UkR0QlFVTkVMRmRCVEVRN08wRkJUMEVzY1VKQlFWY3NaMEpCUVZnc1EwRkJORUlzYVVKQlFVMHNZMEZCYkVNc1JVRkJhMFFzVVVGQmJFUTdPMEZCUlVFc2NVSkJRVmNzVTBGQldDeERRVUZ4UWl4SFFVRnlRaXhEUVVGNVFpeFRRVUY2UWp0QlFVVkVMRk5CV2tRc1JVRlpSeXhGUVZwSU96dEJRV05CTEdWQlFVOHNTVUZCVUR0QlFVTkVPMEZCTjBWak8wRkJRVUU3UVVGQlFTdzJRa0VyUlZJN1FVRkRUQ3haUVVGSkxFTkJRVU1zUzBGQlN5eFBRVUZNTEVOQlFXRXNUMEZCWWl4RFFVRnhRaXhUUVVGeVFpeERRVUVyUWl4UlFVRXZRaXhEUVVGM1F5eFJRVUY0UXl4RFFVRk1MRVZCUVhkRU8wRkJRM1JFTEdsQ1FVRlBMRXRCUVZBN1FVRkRSRHM3UVVGRlJDeFpRVUZKTEV0QlFVc3NUMEZCVEN4RFFVRmhMRTlCUVdJc1EwRkJjVUlzVTBGQmNrSXNRMEZCSzBJc1VVRkJMMElzUTBGQmQwTXNVVUZCZUVNc1EwRkJTaXhGUVVGMVJEdEJRVU55UkN4bFFVRkxMRTlCUVV3c1EwRkJZU3hQUVVGaUxFTkJRWEZDTEZOQlFYSkNMRU5CUVN0Q0xFMUJRUzlDTEVOQlFYTkRMRkZCUVhSRE8wRkJRMFE3TzBGQlJVUXNZVUZCU3l4UFFVRk1MRU5CUVdFc1QwRkJZaXhEUVVGeFFpeFpRVUZ5UWl4RFFVRnJReXhsUVVGc1F5eEZRVUZ0UkN4TFFVRnVSRHM3UVVGRlFTeFpRVUZOTEV0QlFVc3NTMEZCU3l4UFFVRk1MRU5CUVdFc1QwRkJZaXhEUVVGeFFpeFpRVUZ5UWl4RFFVRnJReXhOUVVGc1F5eERRVUZZTzBGQlEwRXNXVUZCVFN4aFFVRmhMRk5CUVZNc1lVRkJWQ3hEUVVGMVFpeEZRVUYyUWl4RFFVRnVRanM3UVVGRlFTeFpRVUZKTEZkQlFWY3NVMEZCV0N4RFFVRnhRaXhSUVVGeVFpeERRVUU0UWl4UlFVRTVRaXhEUVVGS0xFVkJRVFpETzBGQlF6TkRMSEZDUVVGWExGTkJRVmdzUTBGQmNVSXNUVUZCY2tJc1EwRkJORUlzVVVGQk5VSTdRVUZEUkRzN1FVRkZSQ3hsUVVGUExFbEJRVkE3UVVGRFJEdEJRV3hIWXp0QlFVRkJPMEZCUVVFc2JVTkJiMGRMTzBGQlEyeENMR1ZCUVU4c1NVRkJVRHRCUVVORU8wRkJkRWRqTzBGQlFVRTdRVUZCUVN4dlEwRjNSMDBzVDBGNFIwNHNSVUYzUjJVN1FVRkROVUlzYlVkQlFUSkNMRWRCUVROQ0xFVkJRV2RETEU5QlFXaERPMEZCUTBRN1FVRXhSMk03TzBGQlFVRTdRVUZCUVRzN1FVRTJSMnBDT3pzN096czdPMEZCUzBFc1RVRkJUU3hoUVVGaExFVkJRVzVDT3p0QlFVVkJMRTFCUVUwc1QwRkJUeXhUUVVGVExHZENRVUZVTEc5Q1FVRXlReXhKUVVFelF5eFJRVUZpTzBGQlEwRXNUVUZCU1N4SlFVRktMRVZCUVZVN1FVRkRVaXhWUVVGTkxFbEJRVTRzUTBGQlZ5eEpRVUZZTEVWQlFXbENMRTlCUVdwQ0xFTkJRWGxDTEZWQlFVTXNUMEZCUkN4RlFVRmhPMEZCUTNCRE8wRkJRMEVzVlVGQlRTeFRRVUZUTERKRFFVRnZRaXhQUVVGd1FpeEZRVUUyUWl4clFrRkJOMElzUlVGQmFVUXNjVUpCUVdwRUxFTkJRV1k3UVVGRFFTeGhRVUZQTEU5QlFWQXNSMEZCYVVJc1QwRkJha0k3TzBGQlJVRXNhVUpCUVZjc1NVRkJXQ3hEUVVGblFpeEpRVUZKTEdGQlFVb3NRMEZCYTBJc1RVRkJiRUlzUTBGQmFFSTdRVUZEUkN4TFFVNUVPMEZCVDBRN08wRkJSVVFzVFVGQlNTeEpRVUZLTEVWQlFWVTdRVUZEVWl4aFFVRlRMR2RDUVVGVUxFTkJRVEJDTEU5QlFURkNMRVZCUVcxRExGVkJRVU1zUzBGQlJDeEZRVUZYTzBGQlF6VkRMRlZCUVUwc2FVSkJRV2xDTEUxQlFVMHNUVUZCVGl4RFFVRmhMRmxCUVdJc1EwRkJNRUlzWVVGQk1VSXNRMEZCZGtJN1FVRkRRU3hWUVVGSkxHdENRVUZyUWl4dFFrRkJiVUlzU1VGQmVrTXNSVUZCSzBNN1FVRkROME1zV1VGQlRTeExRVUZMTEUxQlFVMHNUVUZCVGl4RFFVRmhMRmxCUVdJc1EwRkJNRUlzVFVGQk1VSXNRMEZCV0RzN1FVRkZRU3haUVVGTkxGbEJRVmtzVjBGQlZ5eEpRVUZZTEVOQlFXZENPMEZCUVVFc2FVSkJRVXNzUlVGQlJTeFZRVUZHTEVkQlFXVXNXVUZCWml4RFFVRTBRaXhOUVVFMVFpeE5RVUYzUXl4RlFVRTNRenRCUVVGQkxGTkJRV2hDTEVOQlFXeENPenRCUVVWQkxGbEJRVWtzUTBGQlF5eFRRVUZNTEVWQlFXZENPMEZCUTJRN1FVRkRSRHM3UVVGRlJDeHJRa0ZCVlN4SlFVRldPMEZCUTBRN1FVRkRSaXhMUVdKRU8wRkJZMFE3TzBGQlJVUXNVMEZCVHl4SFFVRlFPMEZCUTBRc1EwRnFTbGNzUlVGQldqczdhMEpCYlVwbExFYzdPenM3T3pzN096czdPenM3T3p0QlF6ZEtaanM3T3pzN08wRkJUVUVzU1VGQlRTeFRRVUZWTEZsQlFVMDdRVUZEY0VJN096czdPenRCUVUxQkxFMUJRVTBzVDBGQlR5eGhRVUZpTzBGQlEwRXNUVUZCVFN4VlFVRlZMRTlCUVdoQ096dEJRVVZCT3pzN096czdRVUZXYjBJc1RVRm5RbVFzVFVGb1FtTTdRVUZwUW14Q0xHOUNRVUZaTEU5QlFWb3NSVUZCY1VJc1NVRkJja0lzUlVGQk1rSTdRVUZCUVRzN1FVRkRla0lzVjBGQlN5eFBRVUZNTEVkQlFXVXNUMEZCWmp0QlFVTkJMRmRCUVVzc1NVRkJUQ3hIUVVGWkxFbEJRVm83TzBGQlJVRXNWVUZCU1N4RFFVRkRMRXRCUVVzc1UwRkJUQ3hEUVVGbExFdEJRVXNzVDBGQmNFSXNRMEZCVEN4RlFVRnRRenRCUVVOcVF6dEJRVU5FT3p0QlFVVkVPMEZCUTBFc1ZVRkJTU3hMUVVGTExFOUJRVXdzUTBGQllTeE5RVUZpTEVsQlFYVkNMRXRCUVVzc1QwRkJUQ3hEUVVGaExFMUJRV0lzUjBGQmMwSXNRMEZCYWtRc1JVRkJiMFE3UVVGRGJFUXNZVUZCU3l4UlFVRk1MRU5CUVdNc1MwRkJTeXhQUVVGdVFqdEJRVU5FTEU5QlJrUXNUVUZGVHp0QlFVTk1PMEZCUTBFc1lVRkJTeXhQUVVGTUxFTkJRV0VzUzBGQlN5eFBRVUZzUWp0QlFVTkVPMEZCUTBZN08wRkJSVVE3TzBGQmJFTnJRanRCUVVGQk96czdRVUYzUTJ4Q096czdPenRCUVhoRGEwSXNaME5CTmtOU0xFOUJOME5STEVWQk5rTkRPMEZCUTJwQ0xGbEJRVWtzV1VGQldTeEpRVUZvUWl4RlFVRnpRanRCUVVOd1FpeHBRa0ZCVHl4TFFVRlFPMEZCUTBRN1FVRkRSQ3hsUVVGUkxGRkJRVThzU1VGQlVDeDVRMEZCVHl4SlFVRlFMRTlCUVdkQ0xGRkJRV2hDTEVkQlFUSkNMRzFDUVVGdFFpeEpRVUU1UXl4SFFVRnhSQ3hYUVVGWExGRkJRVThzVDBGQlVDeDVRMEZCVHl4UFFVRlFMRTlCUVcxQ0xGRkJRVGxDTEVsQlFUQkRMRTlCUVU4c1VVRkJVU3hSUVVGbUxFdEJRVFJDTEZGQlFYUkZMRWxCUVd0R0xFOUJRVThzVVVGQlVTeFJRVUZtTEV0QlFUUkNMRkZCUVROTE8wRkJRMFE3TzBGQlJVUTdPenM3T3p0QlFYQkVhMEk3UVVGQlFUdEJRVUZCTERoQ1FYbEVWaXhQUVhwRVZTeEZRWGxFUkN4SlFYcEVReXhGUVhsRVN6dEJRVU55UWl4WlFVRkpMRVZCUVVVc2FVSkJRV2xDTEU5QlFXNUNMRU5CUVVvc1JVRkJhVU03UVVGREwwSXNhMEpCUVZFc1UwRkJVaXhIUVVGdlFpeEpRVUZ3UWp0QlFVTkVMRk5CUmtRc1RVRkZUenRCUVVOTUxHdENRVUZSTEZkQlFWSXNSMEZCYzBJc1NVRkJkRUk3UVVGRFJEdEJRVU5HT3p0QlFVVkVPenM3T3pzN1FVRnFSV3RDTzBGQlFVRTdRVUZCUVN3NFFrRnpSVllzVDBGMFJWVXNSVUZ6UlVRc1NVRjBSVU1zUlVGelJVczdRVUZEY2tJc1owSkJRVkVzVTBGQlVpeEhRVUZ2UWl4SlFVRndRanRCUVVORU96dEJRVVZFT3pzN096czdPMEZCTVVWclFqdEJRVUZCTzBGQlFVRXNiVU5CWjBaTUxFOUJhRVpMTEVWQlowWkpMRWxCYUVaS0xFVkJaMFpWTEVsQmFFWldMRVZCWjBablFqdEJRVU5vUXl4blFrRkJVU3haUVVGU0xFTkJRWEZDTEVsQlFYSkNMRVZCUVRKQ0xFbEJRVE5DTzBGQlEwUTdRVUZzUm1sQ08wRkJRVUU3UVVGQlFTdzRRa0Z2UmxZc1QwRndSbFVzUlVGdlJrUTdRVUZEWml4WlFVRkpMRTlCUVU4c1VVRkJVU3haUVVGU0xFTkJRWEZDTEZkQlFYSkNMRU5CUVZnN1FVRkRRU3haUVVGSkxFTkJRVU1zU1VGQlRDeEZRVUZYTzBGQlExUTdRVUZEUkRzN1FVRkZSQ3hsUVVGUExFdEJRVXNzU1VGQlRDeEZRVUZRT3p0QlFVVkJMRmxCUVUwc1NVRkJTU3hwUkVGQlZqdEJRVU5CTEZsQlFVa3NWVUZCU2pzN1FVRkZRU3hsUVVGUExFbEJRVWtzUlVGQlJTeEpRVUZHTEVOQlFVOHNTVUZCVUN4RFFVRllMRVZCUVhsQ08wRkJRM1pDTEdOQlFVMHNUVUZCVFN4RlFVRkZMRU5CUVVZc1JVRkJTeXhKUVVGTUxFVkJRVm83UVVGRFFTeGpRVUZOTEZGQlFWRXNSVUZCUlN4RFFVRkdMRVZCUVVzc1NVRkJUQ3hIUVVGWkxFOUJRVm9zUTBGQmIwSXNSMEZCY0VJc1JVRkJlVUlzUlVGQmVrSXNRMEZCWkR0QlFVTkJMR05CUVVrc1dVRkJXU3hMUVVGTExFbEJRVXdzUTBGQlZTeExRVUZXTEVOQlFXaENPenRCUVVWQkxHTkJRVWtzUTBGQlF5eExRVUZMTEVsQlFVd3NRMEZCVlN4TFFVRldMRU5CUVV3c1JVRkJkVUk3UVVGRGNrSXNiMEpCUVZFc1IwRkJVaXhEUVVGbExFbEJRV1lzYlVKQlFXbERMRXRCUVdwRE8wRkJRMEVzZDBKQlFWa3NTMEZCV2p0QlFVTkVPenRCUVVWRUxHTkJRVTBzWVVGQllTeFJRVUZSTEVsQlFVa3NUVUZCU2l4RFFVRlhMRU5CUVZnc1JVRkJZeXhYUVVGa0xFVkJRVklzUjBGQmMwTXNTVUZCU1N4TFFVRktMRU5CUVZVc1EwRkJWaXhEUVVGNlJEczdRVUZGUVN4alFVRkpMRXRCUVVzc1ZVRkJUQ3hEUVVGS0xFVkJRWE5DTzBGQlEzQkNMR2xDUVVGTExGVkJRVXdzUlVGQmFVSXNUMEZCYWtJc1JVRkJNRUlzVTBGQk1VSTdRVUZEUkN4WFFVWkVMRTFCUlU4N1FVRkRUQ3hwUWtGQlN5eFpRVUZNTEVOQlFXdENMRTlCUVd4Q0xFVkJRVEpDTEVkQlFUTkNMRVZCUVdkRExGTkJRV2hETzBGQlEwUTdRVUZEUmp0QlFVTkdPenRCUVVWRU96czdPMEZCYmtoclFqdEJRVUZCTzBGQlFVRXNLMEpCYzBoVUxFOUJkRWhUTEVWQmMwaEJPMEZCUVVFN08wRkJRMmhDTEdOQlFVMHNTVUZCVGl4RFFVRlhMRTlCUVZnc1JVRkJiMElzVDBGQmNFSXNRMEZCTkVJN1FVRkJRU3hwUWtGQlRTeE5RVUZMTEU5QlFVd3NRMEZCWVN4RlFVRmlMRU5CUVU0N1FVRkJRU3hUUVVFMVFqdEJRVU5FTzBGQmVFaHBRanRCUVVGQk8wRkJRVUVzTUVKQmIwTkhPMEZCUTI1Q0xHVkJRVlVzU1VGQlZpeFRRVUZyUWl4UFFVRnNRanRCUVVORU8wRkJkRU5wUWpzN1FVRkJRVHRCUVVGQk96dEJRVEpJY0VJc1UwRkJUeXhOUVVGUU8wRkJRMFFzUTBFMVNHTXNSVUZCWmpzN2EwSkJPRWhsTEUwN096czdPenM3T3pzN08zRnFRa053U1dZN096czdPenM3UVVGTFFUczdPenM3T3pzN1FVRkZRU3hKUVVGTkxFOUJRVkVzV1VGQlRUdEJRVU5zUWpzN096czdPMEZCVFVFc1RVRkJUU3hQUVVGUExFMUJRV0k3UVVGRFFTeE5RVUZOTEZWQlFWVXNUMEZCYUVJN1FVRkRRU3hOUVVGTkxIRkNRVUZ4UWp0QlFVTjZRaXh2UWtGQlowSXNTVUZFVXp0QlFVVjZRaXhaUVVGUkxFbEJSbWxDTzBGQlIzcENMR05CUVZVc1NVRklaVHRCUVVsNlFpeFZRVUZOT3p0QlFVZFNPenM3T3pzN1FVRlFNa0lzUjBGQk0wSTdRVUZVYTBJc1RVRnpRbG9zU1VGMFFsazdRVUYxUW1oQ096czdPMEZCU1VFc2IwSkJRVEJDTzBGQlFVRXNWVUZCWkN4UFFVRmpMSFZGUVVGS0xFVkJRVWs3TzBGQlFVRTdPMEZCUTNoQ0xGZEJRVXNzVDBGQlRDeEhRVUZsTEU5QlFVOHNUVUZCVUN4RFFVRmpMR3RDUVVGa0xFVkJRV3RETEU5QlFXeERMRU5CUVdZN08wRkJSVUVzVlVGQlNTeFBRVUZQTEV0QlFVc3NUMEZCVEN4RFFVRmhMR05CUVhCQ0xFdEJRWFZETEZGQlFUTkRMRVZCUVhGRU8wRkJRMjVFTEdOQlFVMHNTVUZCU1N4TFFVRktMRU5CUVdFc1NVRkJZaXc0UkVGQlRqdEJRVU5FT3p0QlFVVkVMRlZCUVVrc1MwRkJTeXhQUVVGTUxFTkJRV0VzU1VGQllpeExRVUZ6UWl4SlFVRXhRaXhGUVVGblF6dEJRVU01UWl4alFVRk5MRWxCUVVrc1MwRkJTaXhEUVVGaExFbEJRV0lzY1VOQlFVNDdRVUZEUkRzN1FVRkZSQ3hWUVVGSkxGRkJRVThzUzBGQlN5eFBRVUZNTEVOQlFXRXNTVUZCWWl4RFFVRnJRaXhMUVVGTExFOUJRVXdzUTBGQllTeGpRVUV2UWl4RFFVRlFMRTFCUVRCRUxGRkJRVGxFTEVWQlFYZEZPMEZCUTNSRkxHTkJRVTBzU1VGQlNTeExRVUZLTEVOQlFXRXNTVUZCWWl4dFJVRkJUanRCUVVORU96dEJRVVZFTEZkQlFVc3NVMEZCVEN4RFFVRmxMRXRCUVVzc1QwRkJUQ3hEUVVGaExFMUJRVFZDTEVWQlFXOURMRXRCUVVzc1QwRkJUQ3hEUVVGaExGRkJRV3BFTzBGQlEwUTdPMEZCTTBObE8wRkJRVUU3UVVGQlFTeHJRMEZwUkVvN1FVRkRWaXhsUVVGUExFdEJRVXNzVDBGQlRDeERRVUZoTEUxQlFYQkNPMEZCUTBRN1FVRnVSR1U3UVVGQlFUdEJRVUZCTERCRFFYRkVTVHRCUVVOc1FpeGxRVUZQTEV0QlFVc3NUMEZCVEN4RFFVRmhMR05CUVhCQ08wRkJRMFE3TzBGQlJVUTdPenM3T3p0QlFYcEVaMEk3UVVGQlFUdEJRVUZCTEdkRFFUaEVUaXhOUVRsRVRTeEZRVGhFY1VJN1FVRkJRU3haUVVGdVFpeFZRVUZ0UWl4MVJVRkJUaXhKUVVGTk96dEJRVU51UXl4WlFVRkpMRkZCUVU4c1MwRkJTeXhQUVVGTUxFTkJRV0VzU1VGQllpeERRVUZyUWl4TlFVRnNRaXhEUVVGUUxFMUJRWEZETEZGQlFYcERMRVZCUVcxRU8wRkJRMnBFTEd0Q1FVRlJMRXRCUVZJc1EwRkJhVUlzU1VGQmFrSXNWVUZCTUVJc1RVRkJNVUlzYTBOQlFUWkVMRXRCUVVzc1QwRkJUQ3hEUVVGaExHTkJRVEZGTzBGQlEwUXNVMEZHUkN4TlFVVlBPMEZCUTB3c1pVRkJTeXhQUVVGTUxFTkJRV0VzVFVGQllpeEhRVUZ6UWl4TlFVRjBRanRCUVVORU96dEJRVVZFTEZsQlFVa3NWVUZCU2l4RlFVRm5RanRCUVVOa0xHVkJRVXNzVlVGQlREdEJRVU5FTzBGQlEwWTdRVUY0UldVN1FVRkJRVHRCUVVGQkxIRkRRVEJGUkR0QlFVTmlMR1ZCUVU4c1QwRkJUeXhKUVVGUUxFTkJRVmtzUzBGQlN5eFBRVUZNTEVOQlFXRXNTVUZCZWtJc1EwRkJVRHRCUVVORU8wRkJOVVZsTzBGQlFVRTdRVUZCUVN4eFEwRTRSV3RETzBGQlFVRXNXVUZCY2tNc1MwRkJjVU1zZFVWQlFUZENMRWxCUVRaQ08wRkJRVUVzV1VGQmRrSXNaMEpCUVhWQ0xIVkZRVUZLTEVWQlFVazdPMEZCUTJoRUxGbEJRVWtzVDBGQlR5eExRVUZRTEV0QlFXbENMRkZCUVhKQ0xFVkJRU3RDTzBGQlF6ZENMR2xDUVVGUExGTkJRVkE3UVVGRFJEczdRVUZGUkN4WlFVRk5MRkZCUVZFc1RVRkJUU3hMUVVGT0xFTkJRVmtzYlVKQlFWb3NRMEZCWkR0QlFVTkJMRmxCUVVrc1MwRkJTaXhGUVVGWE8wRkJRMVFzYTBKQlFWRXNUVUZCVFN4UFFVRk9MRU5CUVdNc1RVRkJUU3hEUVVGT0xFTkJRV1FzUlVGQmQwSXNhVUpCUVdsQ0xFMUJRVTBzUTBGQlRpeERRVUZxUWl4RFFVRjRRaXhEUVVGU08wRkJRMFE3TzBGQlJVUXNXVUZCU1N4TlFVRk5MRXRCUVU0c1EwRkJXU3h0UWtGQldpeERRVUZLTEVWQlFYTkRPMEZCUTNCRExHbENRVUZQTEV0QlFVc3NXVUZCVEN4RFFVRnJRaXhMUVVGc1FpeEZRVUY1UWl4blFrRkJla0lzUTBGQlVEdEJRVU5FT3p0QlFVVkVMR1ZCUVU4c1MwRkJVRHRCUVVORU8wRkJOMFpsTzBGQlFVRTdRVUZCUVN4clEwRXJSblZDTzBGQlFVRTdPMEZCUVVFc1dVRkJOMElzVDBGQk5rSXNkVVZCUVc1Q0xFbEJRVzFDTzBGQlFVRXNXVUZCWWl4TlFVRmhMSFZGUVVGS0xFVkJRVWs3TzBGQlEzSkRMRmxCUVVrc1QwRkJUeXhMUVVGTExFOUJRVXdzUTBGQllTeEpRVUZpTEVOQlFXdENMRXRCUVVzc1QwRkJUQ3hEUVVGaExFMUJRUzlDTEVOQlFWZzdRVUZEUVN4WlFVRkpMRU5CUVVNc1NVRkJUQ3hGUVVGWE8wRkJRMVFzYVVKQlFVOHNTMEZCU3l4UFFVRk1MRU5CUVdFc1NVRkJZaXhEUVVGclFpeExRVUZMTEU5QlFVd3NRMEZCWVN4alFVRXZRaXhEUVVGUU8wRkJRMFE3TzBGQlJVUXNXVUZCU1N4WlFVRlpMRWxCUVZvc1NVRkJiMElzV1VGQldTeEhRVUZvUXl4SlFVRjFReXhOUVVGTkxFOUJRVTRzUTBGQll5eFBRVUZrTEVOQlFUTkRMRVZCUVcxRk8wRkJRMnBGTEdOQlFVa3NUVUZCVFN4UFFVRk9MRU5CUVdNc1QwRkJaQ3hEUVVGS0xFVkJRVFJDTzBGQlF6RkNMR2RDUVVGTkxFOUJRVThzVDBGQlR5eEpRVUZRTEVOQlFWa3NTVUZCV2l4RlFVRnJRaXhOUVVGc1FpeERRVUY1UWp0QlFVRkJMSEZDUVVGUExGRkJRVkVzVDBGQlVpeERRVUZuUWl4SFFVRm9RaXhKUVVGMVFpeERRVUZETEVOQlFTOUNPMEZCUVVFc1lVRkJla0lzUTBGQllqdEJRVU5CTEdkQ1FVRk5MR1ZCUVdVc1JVRkJja0k3UVVGRFFTeHBRa0ZCU3l4UFFVRk1MRU5CUVdFc1pVRkJUenRCUVVOc1Fpd3lRa0ZCWVN4SFFVRmlMRWxCUVc5Q0xFMUJRVXNzV1VGQlRDeERRVUZyUWl4TFFVRkxMRWRCUVV3c1EwRkJiRUlzUlVGQk5rSXNUVUZCTjBJc1EwRkJjRUk3UVVGRFJDeGhRVVpFTzBGQlIwRXNiVUpCUVU4c1dVRkJVRHRCUVVORU96dEJRVVZFTEdOQlFVMHNWVUZCVlN4RlFVRm9RanRCUVVOQkxHVkJRVXNzU1VGQlRTeEhRVUZZTEVsQlFXdENMRWxCUVd4Q0xFVkJRWGRDTzBGQlEzUkNMRzlDUVVGUkxFZEJRVklzU1VGQlpTeExRVUZMTEZsQlFVd3NRMEZCYTBJc1MwRkJTeXhIUVVGTUxFTkJRV3hDTEVWQlFUWkNMRTFCUVRkQ0xFTkJRV1k3UVVGRFJEczdRVUZGUkN4cFFrRkJUeXhQUVVGUU8wRkJRMFE3TzBGQlJVUXNaVUZCVHl4TFFVRkxMRmxCUVV3c1EwRkJhMElzUzBGQlN5eFBRVUZNTEVOQlFXeENMRVZCUVdsRExFMUJRV3BETEVOQlFWQTdRVUZEUkRzN1FVRkZSRHM3UVVFeFNHZENPMEZCUVVFN1FVRkJRU3d3UWtFeVNHVTdRVUZCUVN4WlFVRTNRaXhQUVVFMlFpeDFSVUZCYmtJc1NVRkJiVUk3UVVGQlFTeFpRVUZpTEUxQlFXRXNkVVZCUVVvc1JVRkJTVHM3UVVGRE4wSXNaVUZCVHl4TFFVRkxMRk5CUVV3c1EwRkJaU3hQUVVGbUxFVkJRWGRDTEUxQlFYaENMRU5CUVZBN1FVRkRSRHM3UVVGRlJEczdPenM3UVVFdlNHZENPMEZCUVVFN1FVRkJRU3hwUTBGdFNVd3NUMEZ1U1Vzc1JVRnRTVWs3UVVGRGJFSXNXVUZCU1N4UFFVRlBMRTlCUVZBc1MwRkJiVUlzVjBGQmRrSXNSVUZCYjBNN1FVRkRiRU1zYjBKQlFWVXNVMEZCVXl4blFrRkJWQ3hEUVVFd1FpeGhRVUV4UWl4RFFVRldPMEZCUTBRN08wRkJSVVFzV1VGQlNTeFBRVUZQTEU5QlFWQXNTMEZCYlVJc1VVRkJka0lzUlVGQmFVTTdRVUZETDBJc2IwSkJRVlVzVTBGQlV5eGhRVUZVTEVOQlFYVkNMRTlCUVhaQ0xFTkJRVlk3UVVGRFJEczdRVUZGUkN3MlFrRkJWeXhQUVVGWUxFVkJRVzlDTEV0QlFVc3NRMEZCVEN4RlFVRndRanRCUVVORU96dEJRVVZFT3p0QlFTOUpaMEk3UVVGQlFUdEJRVUZCTEc5RFFXZEtTeXhQUVdoS1RDeEZRV2RLWXp0QlFVTTFRaXhsUVVGUExFbEJRVWtzU1VGQlNpeERRVUZUTEU5QlFWUXNRMEZCVUR0QlFVTkVPMEZCYkVwbE8wRkJRVUU3UVVGQlFTd3dRa0UyUTBzN1FVRkRia0lzWlVGQlZTeEpRVUZXTEZOQlFXdENMRTlCUVd4Q08wRkJRMFE3UVVFdlEyVTdPMEZCUVVFN1FVRkJRVHM3UVVGeFNteENMRk5CUVU4c1NVRkJVRHRCUVVORUxFTkJkRXBaTEVWQlFXSTdPMnRDUVhkS1pTeEpPenM3T3pzN096czdjV3BDUXk5S1pqczdPenM3TzBGQlRVRTdPenM3UVVGRFFUczdPenM3T3pzN1FVRkZRU3hKUVVGTkxGRkJRVk1zV1VGQlRUdEJRVU51UWpzN096czdPMEZCVFVFc1RVRkJUU3hQUVVGUExFOUJRV0k3UVVGRFFTeE5RVUZOTEZWQlFWVXNUMEZCYUVJN1FVRkRRU3hOUVVGTkxIRkNRVUZ4UWp0QlFVTjZRaXhuUWtGQldTeEpRVVJoTzBGQlJYcENMR0ZCUVZNc1NVRkdaMEk3UVVGSGVrSXNhVUpCUVdFc1NVRklXVHRCUVVsNlFpeHJRa0ZCWXp0QlFVcFhMRWRCUVROQ096dEJRVTlCTEUxQlFVa3NiMEpCUVVvN1FVRkRRVHM3T3pzN08wRkJha0p0UWl4TlFYVkNZaXhMUVhaQ1lUdEJRWGRDYWtJN096czdPMEZCUzBFc2NVSkJRVEJDTzBGQlFVRXNWVUZCWkN4UFFVRmpMSFZGUVVGS0xFVkJRVWs3TzBGQlFVRTdPMEZCUTNoQ0xGZEJRVXNzVDBGQlRDeEhRVUZsTEU5QlFVOHNUVUZCVUN4RFFVRmpMR3RDUVVGa0xFVkJRV3RETEU5QlFXeERMRU5CUVdZN08wRkJSVUVzVjBGQlN5eExRVUZNTEVkQlFXRXNSVUZCWWp0QlFVTkJMRmRCUVVzc1QwRkJUQ3hIUVVGbExFdEJRV1k3TzBGQlJVRTdRVUZEUVN4WFFVRkxMR05CUVV3N08wRkJSVUU3UVVGRFFTeFhRVUZMTEZkQlFVdzdRVUZEUkRzN1FVRkZSRHM3TzBGQk1VTnBRanRCUVVGQk8wRkJRVUVzZDBKQk1rTm1MRkZCTTBObExFVkJNa05NTzBGQlExWXNaVUZCVHl4VFFVRlRMR0ZCUVZRc1EwRkJkVUlzVVVGQmRrSXNRMEZCVUR0QlFVTkVPMEZCTjBOblFqdEJRVUZCTzBGQlFVRXNaME5CSzBOUU8wRkJRMUlzWlVGQlR5eFBRVUZQTEZGQlFWQXNRMEZCWjBJc1NVRkJhRUlzUTBGQmNVSXNTMEZCY2tJc1EwRkJNa0lzUzBGQlN5eFBRVUZNTEVOQlFXRXNWVUZCZUVNc1JVRkJiMFFzUTBGQmNFUXNRMEZCVUR0QlFVTkVPMEZCYWtSblFqdEJRVUZCTzBGQlFVRXNkME5CYlVSRE8wRkJRMmhDTEZsQlFVMHNUMEZCVHl4TFFVRkxMRTlCUVV3c1JVRkJZanRCUVVOQkxGbEJRVTBzUzBGQlN5eEpRVUZKTEUxQlFVb3NRMEZCVnl4bFFVRllMRU5CUVZnN1FVRkRRU3haUVVGTkxGVkJRVlVzUjBGQlJ5eEpRVUZJTEVOQlFWRXNTVUZCVWl4RFFVRm9RanM3UVVGRlFTeFpRVUZKTEZkQlFWY3NVVUZCVVN4RFFVRlNMRU5CUVdZc1JVRkJNa0k3UVVGRGVrSXNhVUpCUVU4c1VVRkJVU3hEUVVGU0xFTkJRVkE3UVVGRFJEczdRVUZGUkN4bFFVRlBMRWxCUVZBN1FVRkRSRHRCUVRkRVowSTdRVUZCUVR0QlFVRkJMRGhDUVN0RVZDeFJRUzlFVXl4RlFTdEVRenRCUVVOb1FpeGxRVUZQTEZGQlFWQXNRMEZCWjBJc1NVRkJhRUlzUjBGQk1FSXNTMEZCU3l4UFFVRk1MRU5CUVdFc1ZVRkJka01zVTBGQmNVUXNVVUZCY2tRN1FVRkRSRHRCUVdwRlowSTdRVUZCUVR0QlFVRkJMR3REUVcxRlRDeFRRVzVGU3l4RlFXMUZUU3hUUVc1RlRpeEZRVzFGYVVJN1FVRkRhRU1zV1VGQlRTeFJRVUZSTEV0QlFVc3NXVUZCVEN4RFFVRnJRaXhUUVVGc1FpeERRVUZrTzBGQlEwRXNXVUZCVFN4UlFVRlJMRXRCUVVzc1dVRkJUQ3hEUVVGclFpeFRRVUZzUWl4RFFVRmtPMEZCUTBFc1pVRkJUeXhUUVVGVExFdEJRVlFzU1VGQmEwSXNUVUZCVFN4SlFVRk9MRXRCUVdVc1RVRkJUU3hKUVVFNVF6dEJRVU5FT3p0QlFVVkVPenM3T3p0QlFYcEZhVUk3UVVGQlFUdEJRVUZCTEhWRFFUWkZRVHRCUVVGQk96dEJRVU5tTEdsQ1FVRlRMR2RDUVVGVUxFTkJRVEJDTEU5QlFURkNMRVZCUVcxRE8wRkJRVUVzYVVKQlFWTXNUVUZCU3l4UFFVRk1MRU5CUVdFc1MwRkJZaXhEUVVGVU8wRkJRVUVzVTBGQmJrTTdRVUZEUVN4bFFVRlBMR2RDUVVGUUxFTkJRWGRDTEZWQlFYaENMRVZCUVc5RE8wRkJRVUVzYVVKQlFWTXNUVUZCU3l4aFFVRk1MRU5CUVcxQ0xFdEJRVzVDTEVOQlFWUTdRVUZCUVN4VFFVRndRenRCUVVOQkxHVkJRVThzWjBKQlFWQXNRMEZCZDBJc1dVRkJlRUlzUlVGQmMwTTdRVUZCUVN4cFFrRkJVeXhOUVVGTExGbEJRVXdzUTBGQmEwSXNTMEZCYkVJc1EwRkJWRHRCUVVGQkxGTkJRWFJETzBGQlEwRXNhVUpCUVZNc1owSkJRVlFzUTBGQk1FSXNhMEpCUVRGQ0xFVkJRVGhETzBGQlFVRXNhVUpCUVZNc1RVRkJTeXhYUVVGTUxFTkJRV2xDTEV0QlFXcENMRU5CUVZRN1FVRkJRU3hUUVVFNVF6dEJRVU5FT3p0QlFVVkVPenRCUVhCR2FVSTdRVUZCUVRzN08wRkJNRVpxUWpzN1FVRXhSbWxDTEN0Q1FUUkdVaXhSUVRWR1VTeEZRVFJHY1VNN1FVRkJRVHM3UVVGQlFTeFpRVUZ1UXl4WlFVRnRReXgxUlVGQmNFSXNTVUZCYjBJN1FVRkJRU3haUVVGa0xFbEJRV01zZFVWQlFWQXNTMEZCVHpzN1FVRkRjRVFzV1VGQlRTeFZRVUZWTEV0QlFVc3NRMEZCVEN4RFFVRlBMRlZCUVZBc1EwRkJhRUk3UVVGRFFTeFpRVUZKTEU5QlFVb3NSVUZCWVR0QlFVTllMR05CUVUwc1kwRkJZeXhSUVVGUkxGbEJRVklzUTBGQmNVSXNWMEZCY2tJc1EwRkJjRUk3TzBGQlJVRXNZMEZCU1N4TFFVRkxMRmRCUVV3c1EwRkJhVUlzVVVGQmFrSXNSVUZCTWtJc1YwRkJNMElzUTBGQlNpeEZRVUUyUXp0QlFVTXpRenRCUVVORU96dEJRVVZFTEd0Q1FVRlJMRk5CUVZJc1EwRkJhMElzVFVGQmJFSXNRMEZCZVVJc1UwRkJla0k3TzBGQlJVRTdRVUZEUVN4cFFrRkJUeXhQUVVGUUxFTkJRV1VzV1VGQlppeERRVUUwUWl4RlFVRkZMRTFCUVUwc1YwRkJVaXhGUVVFMVFpeEZRVUZ0UkN4WFFVRnVSQ3hGUVVGblJTeFBRVUZQTEZGQlFWQXNRMEZCWjBJc1NVRkJhRVk3TzBGQlJVRXNaVUZCU3l4blFrRkJUQ3hEUVVGelFpeFhRVUYwUWl4RlFVRnRReXhwUWtGQlRTeEpRVUY2UXp0QlFVTkVPenRCUVVWRUxHRkJRVXNzWjBKQlFVd3NRMEZCYzBJc1VVRkJkRUlzUlVGQlowTXNhVUpCUVUwc1NVRkJkRU03TzBGQlJVRXNjMEpCUVdNc1VVRkJaRHM3UVVGRlFUdEJRVU5CTEZsQlFVMHNWVUZCVlN4TFFVRkxMRU5CUVV3c2EwSkJRWE5DTEZGQlFYUkNMRkZCUVdoQ096dEJRVVZCTEdkQ1FVRlJMRk5CUVZJc1EwRkJhMElzUjBGQmJFSXNRMEZCYzBJc1UwRkJkRUk3TzBGQlJVRTdRVUZEUVN4WlFVRk5MRmxCUVZrc1MwRkJTeXhaUVVGTUxFTkJRV3RDTEZGQlFXeENMRU5CUVd4Q096dEJRVVZCTzBGQlEwRXNXVUZCU1N4aFFVRmhMRlZCUVZVc1YwRkJWaXhGUVVGcVFpeEZRVUV3UXp0QlFVTjRReXh2UWtGQlZTeFpRVUZXTzBGQlEwUTdRVUZEUkRzN1FVRkZRU3haUVVGSkxFOUJRVW9zUlVGQllUdEJRVU5ZTEdOQlFVMHNaVUZCWXl4UlFVRlJMRmxCUVZJc1EwRkJjVUlzVjBGQmNrSXNRMEZCY0VJN1FVRkRRVHRCUVVOQkxHdENRVUZSTEVsQlFWSXNSMEZCWlN4SlFVRm1PMEZCUTBFc2EwSkJRVkVzWjBKQlFWSXNSMEZCTWtJc1dVRkJNMEk3TzBGQlJVRXNZMEZCVFN4eFFrRkJjVUlzVTBGQmNrSXNhMEpCUVhGQ0xFZEJRVTA3UVVGREwwSXNaMEpCUVVrc1VVRkJVU3hUUVVGU0xFTkJRV3RDTEZGQlFXeENMRU5CUVRKQ0xGTkJRVE5DTEVOQlFVb3NSVUZCTWtNN1FVRkRla01zYzBKQlFWRXNVMEZCVWl4RFFVRnJRaXhOUVVGc1FpeERRVUY1UWl4VFFVRjZRanRCUVVORU96dEJRVVZFTEc5Q1FVRlJMRk5CUVZJc1EwRkJhMElzVFVGQmJFSXNRMEZCZVVJc1VVRkJVU3hKUVVGU0xFZEJRV1VzVlVGQlppeEhRVUUwUWl4WFFVRnlSRHM3UVVGRlFTeHRRa0ZCU3l4blFrRkJUQ3hEUVVGelFpeFhRVUYwUWl4RlFVRnRReXhwUWtGQlRTeExRVUY2UXp0QlFVTkJMRzFDUVVGTExHZENRVUZNTEVOQlFYTkNMRkZCUVZFc1owSkJRVGxDTEVWQlFXZEVMR2xDUVVGTkxFMUJRWFJFT3p0QlFVVkJMRzlDUVVGUkxHMUNRVUZTTEVOQlFUUkNMR2xDUVVGTkxHRkJRV3hETEVWQlFXbEVMR3RDUVVGcVJEdEJRVU5FTEZkQldFUTdPMEZCWVVFc1kwRkJTU3hMUVVGTExFOUJRVXdzUTBGQllTeFpRVUZxUWl4RlFVRXJRanRCUVVNM1FpeHZRa0ZCVVN4blFrRkJVaXhEUVVGNVFpeHBRa0ZCVFN4aFFVRXZRaXhGUVVFNFF5eHJRa0ZCT1VNN1FVRkRRU3h2UWtGQlVTeFRRVUZTTEVOQlFXdENMRWRCUVd4Q0xFTkJRWE5DTEZOQlFYUkNPMEZCUTBRc1YwRklSQ3hOUVVkUE8wRkJRMHc3UVVGRFJEczdRVUZGUkN4clFrRkJVU3hUUVVGU0xFTkJRV3RDTEVkQlFXeENMRU5CUVhOQ0xFOUJRVThzVlVGQlVDeEhRVUZ2UWl4WFFVRXhRenRCUVVORU8wRkJRMFk3UVVFelNtZENPMEZCUVVFN1FVRkJRU3g1UTBFMlNrVXNVVUUzU2tZc1JVRTJTbGs3UVVGRE0wSXNXVUZCU1N4RFFVRkRMRXRCUVVzc1dVRkJUQ3hEUVVGclFpeFJRVUZzUWl4RFFVRk1MRVZCUVd0RE8wRkJRMmhETEdWQlFVc3NTMEZCVEN4RFFVRlhMRWxCUVZnc1EwRkJaMElzYlVKQlFWTXNVVUZCVkN4RFFVRm9RanRCUVVORU8wRkJRMFk3UVVGcVMyZENPMEZCUVVFN1FVRkJRU3h0UTBGdFMwb3NVVUZ1UzBrc1JVRnRTMDA3UVVGRGNrSXNaVUZCVHl4TFFVRkxMRXRCUVV3c1EwRkJWeXhKUVVGWUxFTkJRV2RDTzBGQlFVRXNhVUpCUVZFc1MwRkJTeXhKUVVGTUxFdEJRV01zVVVGQmRFSTdRVUZCUVN4VFFVRm9RaXhEUVVGUU8wRkJRMFE3UVVGeVMyZENPMEZCUVVFN1FVRkJRU3h2UTBGMVMwZ3NVMEYyUzBjc1JVRjFTMUU3UVVGRGRrSXNaVUZCVHl4TFFVRkxMRXRCUVV3c1EwRkJWeXhOUVVGWUxFTkJRV3RDTzBGQlFVRXNhVUpCUVZFc1ZVRkJWU3hQUVVGV0xFTkJRV3RDTEV0QlFVc3NTVUZCZGtJc1NVRkJLMElzUTBGQlF5eERRVUY0UXp0QlFVRkJMRk5CUVd4Q0xFTkJRVkE3UVVGRFJEdEJRWHBMWjBJN1FVRkJRVHRCUVVGQkxITkRRVEpMUkN4SFFUTkxReXhGUVRKTFNUdEJRVU51UWl4bFFVRlBMRWxCUVVrc1MwRkJTaXhEUVVGVkxFZEJRVllzUlVGQlpTeEhRVUZtTEVOQlFXMUNPMEZCUVVFc2FVSkJRVkVzUzBGQlN5eEpRVUZNTEVWQlFWSTdRVUZCUVN4VFFVRnVRaXhEUVVGUU8wRkJRMFE3UVVFM1MyZENPMEZCUVVFN1FVRkJRU3huUTBFclMxQXNVVUV2UzA4c1JVRXJTMGM3UVVGRGJFSXNXVUZCU1N4TFFVRkxMR2xDUVVGTUxFdEJRVEpDTEVkQlFTOUNMRVZCUVc5RE8wRkJRMnhETzBGQlEwRXNaVUZCU3l4TFFVRk1MRU5CUVZjc1QwRkJXQ3hEUVVGdFFpeFZRVUZETEVsQlFVUXNSVUZCVlR0QlFVTXpRaXhwUWtGQlN5eG5Ra0ZCVEN4RFFVRnpRaXhSUVVGMFFqdEJRVU5FTEZkQlJrUTdRVUZIUVR0QlFVTkVPenRCUVVWRUxGbEJRVTBzWVVGQllTeExRVUZMTEdGQlFVd3NRMEZCYlVJc1MwRkJTeXhsUVVGTUxFTkJRWEZDTEV0QlFVc3NhVUpCUVRGQ0xFTkJRVzVDTEVWQlFXbEZMRWxCUVdwRkxFTkJRVzVDTzBGQlEwRXNiVUpCUVZjc1QwRkJXQ3hEUVVGdFFpeFZRVUZETEVsQlFVUXNSVUZCVlR0QlFVTXpRaXhsUVVGTExHZENRVUZNTEVOQlFYTkNMRkZCUVhSQ08wRkJRMFFzVTBGR1JEdEJRVWRCTEdGQlFVc3NhVUpCUVV3c1IwRkJlVUlzU1VGQmVrSTdRVUZEUkR0QlFUZE1aMEk3UVVGQlFUdEJRVUZCTEd0RFFTdE1UQ3haUVM5TVN5eEZRU3RNWjBNN1FVRkJRU3haUVVGMlFpeGpRVUYxUWl4MVJVRkJUaXhKUVVGTk96dEJRVU12UXl4WlFVRk5MR0ZCUVdFc1MwRkJTeXhoUVVGTUxFTkJRVzFDTEV0QlFVc3NaVUZCVEN4RFFVRnhRaXhMUVVGTExHbENRVUV4UWl4RFFVRnVRaXhGUVVGcFJTeEpRVUZxUlN4RFFVRnVRanRCUVVOQkxHMUNRVUZYTEU5QlFWZ3NRMEZCYlVJc1ZVRkJReXhKUVVGRUxFVkJRVlU3UVVGRE0wSXNaVUZCU3l4WFFVRk1MRU5CUVdsQ0xGbEJRV3BDTzBGQlEwRXNZMEZCU1N4UFFVRlBMR05CUVZBc1MwRkJNRUlzVlVGQk9VSXNSVUZCTUVNN1FVRkRlRU1zYVVKQlFVc3NiVUpCUVV3c1EwRkJlVUlzWTBGQmVrSTdRVUZEUkR0QlFVTkdMRk5CVEVRN1FVRk5RU3hoUVVGTExHbENRVUZNTEVkQlFYbENMRWxCUVhwQ08wRkJRMFE3UVVGNFRXZENPMEZCUVVFN1FVRkJRU3gxUTBFd1RVRXNVVUV4VFVFc1JVRXdUVlVzVTBFeFRWWXNSVUV3VFhsRE8wRkJRVUVzV1VGQmNFSXNWMEZCYjBJc2RVVkJRVTRzU1VGQlRUczdRVUZEZUVRc1dVRkJUU3haUVVGWkxFdEJRVXNzV1VGQlRDeERRVUZyUWl4UlFVRnNRaXhEUVVGc1FqdEJRVU5CTEZsQlFVa3NVMEZCU2l4RlFVRmxPMEZCUTJJc2IwSkJRVlVzWVVGQlZpeERRVUYzUWl4VFFVRjRRaXhGUVVGdFF5eFhRVUZ1UXp0QlFVTkVPMEZCUTBZN1FVRXZUV2RDTzBGQlFVRTdRVUZCUVN3NFFrRnBUbFFzUzBGcVRsTXNSVUZwVGtZN1FVRkRZaXhaUVVGTkxGZEJRVmNzVFVGQlRTeE5RVUZPTEVOQlFXRXNXVUZCWWl4RFFVRXdRaXhsUVVFeFFpeERRVUZxUWp0QlFVTkJMRmxCUVUwc1YwRkJWeXhGUVVGRkxFMUJRVTBzVFVGQlRpeERRVUZoTEZsQlFXSXNRMEZCTUVJc1pVRkJNVUlzVFVGQkswTXNUVUZCYWtRc1EwRkJha0k3TzBGQlJVRXNXVUZCU1N4UlFVRktMRVZCUVdNN1FVRkRXaXhqUVVGSkxHRkJRV0VzVDBGQmFrSXNSVUZCTUVJN1FVRkRlRUk3UVVGRFFTeHRRa0ZCVHl4UFFVRlFMRU5CUVdVc1NVRkJaanRCUVVOQk8wRkJRMFE3TzBGQlJVUTdPenM3TzBGQlMwRXNZMEZCU1N4TFFVRkxMRTlCUVV3c1EwRkJZU3hQUVVGcVFpeEZRVUV3UWp0QlFVTjRRaXhwUWtGQlN5eFBRVUZNTEVOQlFXRXNVVUZCWWp0QlFVTkVMRmRCUmtRc1RVRkZUenRCUVVOTUxHbENRVUZMTEZGQlFVd3NRMEZCWXl4UlFVRmtMRVZCUVhkQ0xFbEJRWGhDTEVWQlFUaENMRkZCUVRsQ08wRkJRMFE3UVVGRFJqdEJRVU5HTzBGQmRrOW5RanRCUVVGQk8wRkJRVUVzYzBOQmVVOVRPMEZCUVVFc1dVRkJXaXhMUVVGWkxIVkZRVUZLTEVWQlFVazdPMEZCUTNoQ0xGbEJRVTBzVjBGQlZ5eE5RVUZOTEV0QlFVNHNSMEZCWXl4TlFVRk5MRXRCUVU0c1EwRkJXU3hKUVVFeFFpeEhRVUZwUXl4SlFVRnNSRHRCUVVOQkxGbEJRVWtzUTBGQlF5eFJRVUZNTEVWQlFXVTdRVUZEWWp0QlFVTkVPenRCUVVWRUxHRkJRVXNzVVVGQlRDeERRVUZqTEZGQlFXUXNSVUZCZDBJc1NVRkJlRUlzUlVGQk9FSXNTVUZCT1VJN1FVRkRSRHRCUVdoUVowSTdRVUZCUVR0QlFVRkJMSEZEUVd0UVJqdEJRVU5pTEZsQlFVMHNVMEZCVXl4RFFVRkRMRXRCUVVzc1QwRkJUQ3hMUVVGcFFpeExRVUZMTEU5QlFVd3NSMEZCWlN4TFFVRm1MRU5CUVhGQ0xFZEJRWEpDTEVOQlFXcENMRWRCUVRaRExFVkJRVGxETEVWQlFXdEVMRTFCUVd4RUxFTkJRWGxFTzBGQlFVRXNhVUpCUVVzc1JVRkJSU3hOUVVGR0xFZEJRVmNzUTBGQmFFSTdRVUZCUVN4VFFVRjZSQ3hEUVVGbU8wRkJRMEVzV1VGQlNTeFBRVUZQTEUxQlFWQXNSMEZCWjBJc1EwRkJjRUlzUlVGQmRVSTdRVUZEY2tJN1FVRkRRU3hwUWtGQlR5eExRVUZRTzBGQlEwUTdPMEZCUlVRc1lVRkJTeXhuUWtGQlRDeERRVUZ6UWl4WFFVRjBRaXhGUVVGdFF5eHBRa0ZCVFN4SlFVRjZReXhGUVVFclF5eE5RVUV2UXpzN1FVRkZRU3haUVVGTkxGVkJRVlVzUzBGQlN5eGxRVUZNTEVWQlFXaENPMEZCUTBFc1dVRkJTU3hQUVVGS0xFVkJRV0U3UVVGRFdDeGxRVUZMTEZGQlFVd3NRMEZCWXl4UFFVRmtPMEZCUTBRN1FVRkRSanM3UVVGRlJEczdPenRCUVdwUmFVSTdRVUZCUVR0QlFVRkJMRzlEUVc5UlNEdEJRVUZCT3p0QlFVTmFMRmxCUVUwc1VVRkJVU3hUUVVGVExHZENRVUZVTEVOQlFUQkNMR0ZCUVRGQ0xFTkJRV1E3TzBGQlJVRXNXVUZCU1N4RFFVRkRMRXRCUVV3c1JVRkJXVHRCUVVOV08wRkJRMFE3TzBGQlJVUXNZMEZCVFN4UFFVRk9MRU5CUVdNc1ZVRkJReXhKUVVGRUxFVkJRVlU3UVVGRGRFSXNZMEZCU1N4WFFVRlhMRXRCUVVzc1dVRkJUQ3hEUVVGclFpeFhRVUZzUWl4RFFVRm1PMEZCUTBFN096czdRVUZKUVN4alFVRkpMRU5CUVVNc1VVRkJUQ3hGUVVGbE8wRkJRMklzZFVKQlFWY3NTMEZCU3l4UlFVRm9RanRCUVVORU96dEJRVVZFTEdsQ1FVRkxMR3RDUVVGTUxFTkJRWGRDTEZGQlFYaENPMEZCUTBRc1UwRllSRHRCUVZsRU8wRkJkbEpuUWp0QlFVRkJPMEZCUVVFc05rSkJlVkpXTEZGQmVsSlZMRVZCZVZKeFFqdEJRVUZCTEZsQlFYSkNMRmxCUVhGQ0xIVkZRVUZPTEVsQlFVMDdPMEZCUTNCRExHRkJRVXNzYVVKQlFVd3NSMEZCZVVJc1VVRkJla0k3TzBGQlJVRXNXVUZCU1N4blFrRkJaMElzWVVGQllTeEhRVUZxUXl4RlFVRnpRenRCUVVOd1F5eGxRVUZMTEd0Q1FVRk1MRU5CUVhkQ0xGRkJRWGhDTzBGQlEwUTdPMEZCUlVRc1pVRkJUeXhKUVVGUU8wRkJRMFE3UVVGcVUyZENPMEZCUVVFN1FVRkJRU3c0UWtGdFUyVTdRVUZCUVN4WlFVRXhRaXhuUWtGQk1FSXNkVVZCUVZBc1MwRkJUenM3UVVGRE9VSTdRVUZEUVN4WlFVRkpMRXRCUVVzc1QwRkJWQ3hGUVVGclFqdEJRVU5vUWl4blFrRkJUU3hKUVVGSkxFdEJRVW9zUTBGQllTeEpRVUZpTEhsRFFVRk9PMEZCUTBRN08wRkJSVVFzWVVGQlN5eFBRVUZNTEVkQlFXVXNTVUZCWmpzN1FVRkZRVHRCUVVOQkxGbEJRVWtzVDBGQlR5eFBRVUZZTEVWQlFXOUNPMEZCUTJ4Q0xEWkNRVUZ0UWl4SlFVRnVRanRCUVVORU96dEJRVVZFTEZsQlFVa3NWMEZCVnl4TFFVRkxMR1ZCUVV3c1JVRkJaanRCUVVOQkxGbEJRVWtzUTBGQlF5eExRVUZMTEZsQlFVd3NRMEZCYTBJc1VVRkJiRUlzUTBGQlRDeEZRVUZyUXp0QlFVTm9ReXh4UWtGQlZ5eExRVUZMTEU5QlFVd3NRMEZCWVN4WFFVRjRRanRCUVVORU96dEJRVVZFTEZsQlFVa3NiMEpCUVc5Q0xFTkJRVU1zUzBGQlN5eFBRVUZNTEVOQlFXRXNWMEZCZEVNc1JVRkJiVVE3UVVGRGFrUXNaMEpCUVUwc1NVRkJTU3hMUVVGS0xFTkJRV0VzU1VGQllpd3lSRUZCVGp0QlFVTkVPenRCUVVWRU8wRkJRMEVzV1VGQlNTeFBRVUZQTEV0QlFWZ3NSVUZCYTBJN1FVRkRhRUlzYTBKQlFWRXNSMEZCVWl4RFFVRlpMSGRDUVVGM1FpeFRRVUZUTEZkQlFUZERPMEZCUTBFc2EwSkJRVkVzUjBGQlVpeERRVUZaTEV0QlFVc3NTMEZCVEN4RFFVRlhMRTFCUVZnc1IwRkJiMElzWTBGQmFFTTdRVUZEUVN4clFrRkJVU3hIUVVGU0xFTkJRVmtzWVVGQllTeFJRVUY2UWp0QlFVTkVPenRCUVVWRU96czdPMEZCU1VFc1dVRkJTU3hMUVVGTExFOUJRVXdzUTBGQllTeFBRVUZxUWl4RlFVRXdRanRCUVVONFFpeGxRVUZMTEU5QlFVd3NRMEZCWVN4UlFVRmlPMEZCUTBRN08wRkJSVVFzWVVGQlN5eFJRVUZNTEVOQlFXTXNiVUpCUVcxQ0xFdEJRVXNzVDBGQlRDeERRVUZoTEZkQlFXaERMRWRCUVRoRExGRkJRVFZFTzBGQlEwUTdPMEZCUlVRN08wRkJNMVZwUWp0QlFVRkJPMEZCUVVFc2IwTkJORlZKTEU5Qk5WVktMRVZCTkZWaE8wRkJRelZDTEdWQlFVOHNTVUZCU1N4TFFVRktMRU5CUVZVc1QwRkJWaXhEUVVGUU8wRkJRMFE3UVVFNVZXZENPMEZCUVVFN1FVRkJRU3d3UWtGelJrazdRVUZEYmtJc1pVRkJWU3hKUVVGV0xGTkJRV3RDTEU5QlFXeENPMEZCUTBRN1FVRjRSbWRDT3p0QlFVRkJPMEZCUVVFN08wRkJhVlp1UWl4VFFVRlBMRXRCUVZBN1FVRkRSQ3hEUVd4V1lTeEZRVUZrT3p0clFrRnZWbVVzU3pzN096czdPenM3T3pzN2NXcENRemRXWmpzN096czdPMEZCVFVFN08wRkJRMEU3T3pzN1FVRkZRU3hKUVVGTkxFOUJRVkVzV1VGQlRUdEJRVU5zUWpzN096czdPMEZCVFVFc1RVRkJUU3hQUVVGUExFMUJRV0k3UVVGRFFTeE5RVUZOTEZWQlFWVXNUMEZCYUVJN08wRkJSVUVzVFVGQlRTeHZRa0ZCYjBJc2FVSkJRVEZDT3p0QlFVVkJPenM3T3pzN1FVRmFhMElzVFVGclFsb3NTVUZzUWxrN1FVRnRRbWhDT3pzN08wRkJTVUVzYTBKQlFWa3NVVUZCV2l4RlFVRnpRanRCUVVGQk96dEJRVU53UWl4WFFVRkxMRWxCUVV3c1IwRkJXU3hSUVVGYU8wRkJRMEVzVjBGQlN5eE5RVUZNTEVkQlFXTXNSVUZCWkR0QlFVTkJMRmRCUVVzc1dVRkJUQ3hIUVVGdlFpeEpRVUZ3UWp0QlFVTkJMRmRCUVVzc1kwRkJUQ3hIUVVGelFpeEpRVUYwUWp0QlFVTkVPenRCUVVWRU96dEJRVGxDWjBJN1FVRkJRVHM3TzBGQmIwTm9RanM3T3p0QlFYQkRaMElzYTBOQmQwTktPMEZCUTFZc1pVRkJUeXhMUVVGTExFMUJRVm83UVVGRFJEczdRVUZGUkRzN096czdRVUUxUTJkQ08wRkJRVUU3UVVGQlFTeHZRMEZuUkVZN1FVRkRXaXhsUVVGUExFdEJRVXNzV1VGQldqdEJRVU5FT3p0QlFVVkVPenM3T3p0QlFYQkVaMEk3UVVGQlFUdEJRVUZCTERCRFFYZEVTVHRCUVVOc1FpeGxRVUZQTEV0QlFVc3NZMEZCV2p0QlFVTkVPMEZCTVVSbE8wRkJRVUU3UVVGQlFTeHhRMEUwUkVRN1FVRkJRVHM3UVVGRFlpeFpRVUZOTEdOQlFXTXNVMEZCVXl4aFFVRlVMR3RDUVVGelF5eExRVUZMTEVsQlFUTkRMRkZCUVhCQ096dEJRVVZCTERaQ1FVRlRMRXRCUVVzc1YwRkJUQ3hGUVVGVUxFVkJRVFpDTEZWQlFVTXNVVUZCUkN4RlFVRmpPMEZCUTNwRExHTkJRVWtzVTBGQlV5eG5Ra0ZCVlN4UFFVRldMRVZCUVcxQ0xGRkJRVzVDTEVWQlFUWkNMRkZCUVRkQ0xFVkJRWFZETzBGQlEyeEVMR2RDUVVGSkxGRkJRVW9zUlVGQll6dEJRVU5hTEc5Q1FVRk5MRWxCUVU0c1EwRkJWeXhSUVVGWUxFVkJRWEZDTEU5QlFYSkNMRU5CUVRaQ0xGVkJRVU1zUlVGQlJDeEZRVUZSTzBGQlEyNURMRzFDUVVGSExGTkJRVWdzUjBGQlpTeFJRVUZtTzBGQlEwUXNaVUZHUkR0QlFVZEVMR0ZCU2tRc1RVRkpUenRCUVVOTUxITkNRVUZSTEZOQlFWSXNSMEZCYjBJc1VVRkJjRUk3UVVGRFJEdEJRVU5HTEZkQlVrUTdPMEZCVlVFc1kwRkJTU3hOUVVGTExHbENRVUZNTEVWQlFVb3NSVUZCT0VJN1FVRkROVUlzY1VKQlFWTXNUVUZCU3l4cFFrRkJUQ3hGUVVGVU8wRkJRMFE3TzBGQlJVUXNhVUpCUVU4c1YwRkJVQ3hGUVVGdlFpeFJRVUZ3UWl4RlFVRTRRaXhaUVVGWkxHZENRVUZhTEVOQlFUWkNMR2xDUVVFM1FpeERRVUU1UWp0QlFVTkVMRk5CYUVKRUxFVkJaMEpITEVsQmFFSklPMEZCYVVKRU96dEJRVVZFT3p0QlFVVkJPenM3T3p0QlFYQkdaMEk3UVVGQlFUdEJRVUZCTEhWRFFYZEdReXhWUVhoR1JDeEZRWGRHWVR0QlFVTXpRaXhoUVVGTExFMUJRVXdzUTBGQldTeEpRVUZhTEVOQlFXbENMRlZCUVdwQ08wRkJRMFE3TzBGQlJVUTdPenM3T3p0QlFUVkdaMEk3UVVGQlFUdEJRVUZCTEd0RFFXbEhTaXhaUVdwSFNTeEZRV2xIVlR0QlFVTjRRaXhaUVVGSkxFOUJRVThzV1VGQlVDeExRVUYzUWl4UlFVRTFRaXhGUVVGelF6dEJRVU53UXl4blFrRkJUU3hKUVVGSkxFdEJRVW9zUTBGQlZTeHBSRUZCWjBRc1dVRkJhRVFzZVVOQlFXZEVMRmxCUVdoRUxFdEJRU3RFTEZkQlFYcEZMRU5CUVU0N1FVRkRSRHRCUVVORUxHRkJRVXNzV1VGQlRDeEhRVUZ2UWl4WlFVRndRanRCUVVORU96dEJRVVZFT3pzN096dEJRWGhIWjBJN1FVRkJRVHRCUVVGQkxEQkRRVFJIU1N4alFUVkhTaXhGUVRSSGIwSTdRVUZEYkVNc1dVRkJTU3hQUVVGUExHTkJRVkFzUzBGQk1FSXNWVUZCT1VJc1JVRkJNRU03UVVGRGVFTXNaMEpCUVUwc1NVRkJTU3hMUVVGS0xFTkJRVlVzT0VSQlFUWkVMR05CUVRkRUxIbERRVUUyUkN4alFVRTNSQ3hMUVVFNFJTeFhRVUY0Uml4RFFVRk9PMEZCUTBRN1FVRkRSQ3hoUVVGTExHTkJRVXdzUjBGQmMwSXNZMEZCZEVJN1FVRkRSRHM3UVVGRlJEczdPenM3TzBGQmJraG5RanRCUVVGQk8wRkJRVUVzYjBOQmQwaEdMRk5CZUVoRkxFVkJkMGd5UWp0QlFVRkJPenRCUVVGQkxGbEJRV3hDTEZkQlFXdENMSFZGUVVGS0xFVkJRVWs3TzBGQlEzcERMRmxCUVUwc2QwSkJRWE5DTEZWQlFWVXNUVUZCVml4RFFVRnBRaXhEUVVGcVFpeEZRVUZ2UWl4WFFVRndRaXhGUVVGMFFpeEhRVUV3UkN4VlFVRlZMRXRCUVZZc1EwRkJaMElzUTBGQmFFSXNRMEZCYUVVN08wRkJSVUVzWVVGQlN5eE5RVUZNTEVOQlFWa3NUMEZCV2l4RFFVRnZRaXhWUVVGRExFdEJRVVFzUlVGQlZ6dEJRVU0zUWl4alFVRk5MR0ZCUVdFc1RVRkJUU3hUUVVGT0xFTkJRVzVDTzBGQlEwRXNZMEZCVFN4clFrRkJhMElzVFVGQlRTeGpRVUZPTEVOQlFYaENPMEZCUTBFc1kwRkJTU3hQUVVGUExGVkJRVkFzUzBGQmMwSXNWVUZCTVVJc1JVRkJjME03UVVGRGNFTXNkVUpCUVZjc1MwRkJXQ3hUUVVGMVFpeFhRVUYyUWp0QlFVTkVPenRCUVVWRU8wRkJRMEVzWTBGQlNTeFBRVUZQTEdWQlFWQXNTMEZCTWtJc1ZVRkJMMElzUlVGQk1rTTdRVUZEZWtNc05FSkJRV2RDTEV0QlFXaENMRk5CUVRSQ0xGZEJRVFZDTzBGQlEwUTdRVUZEUml4VFFWaEVPenRCUVdGQkxIbERRVUZyUWl4VFFVRnNRaXhGUVVFMlFpeExRVUZMTEVsQlFXeERMRVZCUVhkRExGZEJRWGhETzBGQlEwUTdRVUY2U1dVN1FVRkJRVHRCUVVGQkxEQkNRV2REU3p0QlFVTnVRaXhsUVVGVkxFbEJRVllzVTBGQmEwSXNUMEZCYkVJN1FVRkRSRHRCUVd4RFpUczdRVUZCUVR0QlFVRkJPenRCUVRSSmJFSXNVMEZCVHl4SlFVRlFPMEZCUTBRc1EwRTNTVmtzUlVGQllqczdhMEpCSzBsbExFazdPenM3T3pzN096dEJRMnhLWmpzN096dEJRVU5CT3pzN08wRkJRMEU3T3pzN1FVRkhRVHM3T3p0QlFVTkJPenM3TzBGQlEwRTdPenM3UVVGRFFUczdPenRCUVVOQk96czdPMEZCUTBFN096czdRVUZEUVRzN096dEJRVU5CT3pzN08wRkJRMEU3T3pzN1FVRkRRVHM3T3p0QlFVTkJPenM3T3pzN1FVRnlRa0U3T3pzN096dEJRWFZDUVN4SlFVRk5MRTFCUVUwc1JVRkJXanM3UVVGRlFUczdPenM3T3p0QlFXWkJPMEZCYjBKQkxFbEJRVWtzVFVGQlNpeEhRVUZoTzBGQlExZzdRVUZEUVN4VFFVRlBPenRCUVVkVU96czdPenRCUVV4aExFTkJRV0lzUTBGVlFTeEpRVUZKTEV0QlFVb3NSMEZCV1N4VlFVRkRMRTlCUVVRc1JVRkJZVHRCUVVOMlFpeE5RVUZKTEU5QlFVOHNTVUZCU1N4TlFVRllMRXRCUVhOQ0xGZEJRVEZDTEVWQlFYVkRPMEZCUTNKRExGRkJRVWtzVFVGQlNpeEhRVUZoTEdkQ1FVRk5MR0ZCUVU0c1EwRkJiMElzVDBGQmNFSXNRMEZCWWp0QlFVTkVPMEZCUTBRc1UwRkJUeXhKUVVGSkxFMUJRVmc3UVVGRFJDeERRVXhFT3p0QlFVOUJPenM3T3p0QlFVdEJMRWxCUVVrc1NVRkJTaXhIUVVGWExHVkJRVXNzWVVGQmFFSTdPMEZCUlVFN096czdPMEZCUzBFc1NVRkJTU3hQUVVGS0xFZEJRV01zYTBKQlFWRXNZVUZCZEVJN08wRkJSVUU3T3pzN08wRkJTMEVzU1VGQlNTeFpRVUZLTEVkQlFXMUNMSFZDUVVGaExHRkJRV2hET3p0QlFVVkJPenM3T3p0QlFVdEJMRWxCUVVrc1RVRkJTaXhIUVVGaExHbENRVUZQTEdGQlFYQkNPenRCUVVWQkxGZEJRVmNzV1VGQlRUdEJRVU5tTEcxQ1FVRlBMR0ZCUVZBc1EwRkJjVUk3UVVGRGJrSXNZVUZCVXl4SlFVUlZPMEZCUlc1Q0xGZEJRVThzVVVGR1dUdEJRVWR1UWl4aFFVRlRMRWxCU0ZVN1FVRkpia0lzWjBKQlFWazdRVUZLVHl4SFFVRnlRaXhGUVV0SExFbEJURWc3UVVGTlJDeERRVkJFTEVWQlQwY3NTVUZRU0RzN1FVRlRRVHM3T3pzN1FVRkxRU3hKUVVGSkxGRkJRVW9zUjBGQlpTeHRRa0ZCVXl4aFFVRjRRanM3UVVGRlFUczdPenM3UVVGTFFTeEpRVUZKTEZOQlFVb3NSMEZCWjBJc2IwSkJRVlVzWVVGQk1VSTdPMEZCUjBFN096czdPMEZCUzBFc1NVRkJTU3hIUVVGS0xFZEJRVlVzWTBGQlNTeGhRVUZrT3p0QlFVVkJPenM3T3p0QlFVdEJMRWxCUVVrc1VVRkJTaXhIUVVGbExHMUNRVUZUTEdGQlFYaENPenRCUVVWQk96czdPenRCUVV0QkxFbEJRVWtzVFVGQlNpeEhRVUZoTEdsQ1FVRlBMR0ZCUVhCQ096dEJRVVZCT3pzN096dEJRVXRCTEVsQlFVa3NVMEZCU2l4SFFVRm5RaXh2UWtGQlZTeGhRVUV4UWpzN1FVRkZRVHM3T3pzN1FVRkxRU3hKUVVGSkxGRkJRVW9zUjBGQlpTeFZRVUZETEU5QlFVUXNSVUZCWVR0QlFVTXhRaXhOUVVGSkxGRkJRVkVzVFVGQldpeEZRVUZ2UWp0QlFVTnNRanRCUVVOQkxGZEJRVThzYlVKQlFWTXNZVUZCYUVJN1FVRkRSQ3hIUVVoRUxFMUJSMDg3UVVGRFREdEJRVU5CTEZkQlFVOHNhVUpCUVdVc1lVRkJkRUk3UVVGRFJEdEJRVU5HTEVOQlVrUTdPMEZCVlVFN1FVRkRRU3hQUVVGUExFMUJRVkFzUjBGQlowSXNSMEZCYUVJN08ydENRVVZsTEVjN096czdPenM3T3pzN096czdRVU16U1dZN096czdRVUZEUVRzN096czdPenM3T3pzclpVRlFRVHM3T3pzN08wRkJVMEVzU1VGQlRTeFZRVUZYTEZsQlFVMDdRVUZEY2tJN096czdPenRCUVUxQkxFMUJRVTBzVDBGQlR5eFRRVUZpTzBGQlEwRXNUVUZCVFN4VlFVRlZMRTlCUVdoQ08wRkJRMEVzVFVGQlRTeHhRa0ZCY1VJN1FVRkRla0lzWVVGQlV5eEpRVVJuUWp0QlFVVjZRaXhyUWtGQll5eEpRVVpYTzBGQlIzcENMRmRCUVU4N1FVRklhMElzUjBGQk0wSTdRVUZMUVN4TlFVRk5MSGRDUVVGM1FpeEZRVUU1UWpzN1FVRkhRVHM3T3pzN08wRkJha0p4UWl4TlFYVkNaaXhQUVhaQ1pUdEJRVUZCT3p0QlFYZENia0k3T3pzN1FVRkpRU3gxUWtGQk1FSTdRVUZCUVN4VlFVRmtMRTlCUVdNc2RVVkJRVW9zUlVGQlNUczdRVUZCUVRzN1FVRkJRU3h2U0VGRGJFSXNTVUZFYTBJc1JVRkRXaXhQUVVSWkxFVkJRMGdzYTBKQlJFY3NSVUZEYVVJc1QwRkVha0lzUlVGRE1FSXNjVUpCUkRGQ0xFVkJRMmxFTEVsQlJHcEVMRVZCUTNWRUxFdEJSSFpFT3p0QlFVZDRRaXhaUVVGTExFZEJRVXdzUjBGQlZ5eEpRVUZZTzBGQlEwRXNXVUZCU3l4aFFVRk1MRWRCUVhGQ0xFbEJRWEpDT3p0QlFVVkJMRmxCUVVzc1UwRkJUQ3hEUVVGbExHbENRVUZOTEdOQlFYSkNPenRCUVVWQkxHbENRVUZYTEZsQlFVMDdRVUZEWml4alFVRkxMRlZCUVV3N1FVRkRSQ3hQUVVaRUxFVkJSVWNzVFVGQlN5eFBRVUZNTEVOQlFXRXNXVUZHYUVJN1FVRlNkMEk3UVVGWGVrSTdPMEZCZGtOclFqdEJRVUZCTzBGQlFVRXNhME5CZVVOUU8wRkJRMVlzWlVGQlR5eExRVUZMTEUxQlFWbzdRVUZEUkR0QlFUTkRhMEk3UVVGQlFUdEJRVUZCTEdkRFFUWkRWQ3hOUVRkRFV5eEZRVFpEUkR0QlFVTm9RaXhoUVVGTExFMUJRVXdzUjBGQll5eE5RVUZrTzBGQlEwUTdRVUV2UTJ0Q08wRkJRVUU3UVVGQlFTeHhRMEZwUkVvN1FVRkJRVHM3UVVGRFlpeGhRVUZMTEVkQlFVd3NSMEZCVnl4SlFVRkpMR05CUVVvc1JVRkJXRHRCUVVOQkxHRkJRVXNzUjBGQlRDeERRVUZUTEU5QlFWUXNSMEZCYlVJc1MwRkJia0k3TzBGQlJVRXNXVUZCVFN3d1FrRkJkMElzU1VGQlNTeEpRVUZLTEVkQlFWY3NUMEZCV0N4RlFVRTVRanM3UVVGRlFTeGhRVUZMTEZsQlFVd3NRMEZCYTBJc2FVSkJRVTBzYjBKQlFYaENMRVZCUVRoRExFVkJRVVVzVFVGQlRTeEpRVUZKTEVsQlFVb3NSVUZCVWl4RlFVRTVReXhGUVVGdlJTeExRVUZ3UlRzN1FVRkZRU3hoUVVGTExFZEJRVXdzUTBGQlV5eEpRVUZVTEVOQlFXTXNUVUZCWkN4RlFVRnpRaXhIUVVGMFFpeEZRVUV5UWl4SlFVRXpRanM3UVVGRlFTeGhRVUZMTEVkQlFVd3NRMEZCVXl4UFFVRlVMRWRCUVcxQ0xFdEJRVXNzVDBGQlRDeERRVUZoTEV0QlFXSXNSMEZCY1VJc1EwRkJlRU03UVVGRFFTeGhRVUZMTEVkQlFVd3NRMEZCVXl4VFFVRlVMRWRCUVhGQ0xGbEJRVTA3UVVGRGVrSXNhVUpCUVVzc1IwRkJUQ3hEUVVGVExFdEJRVlE3UVVGRFFTeHBRa0ZCU3l4SFFVRk1MRWRCUVZjc1NVRkJXRHRCUVVORUxGTkJTRVE3TzBGQlMwRXNZVUZCU3l4SFFVRk1MRU5CUVZNc1RVRkJWQ3hIUVVGclFpeFpRVUZOTzBGQlEzUkNMR2xDUVVGTExFbEJRVXc3UVVGRFJDeFRRVVpFTzBGQlIwRXNZVUZCU3l4SFFVRk1MRU5CUVZNc1QwRkJWQ3hIUVVGdFFpeFpRVUZOTzBGQlEzWkNMR2xDUVVGTExFMUJRVXc3UVVGRFJDeFRRVVpFT3p0QlFVbEJMRmxCUVVrN1FVRkRSaXhsUVVGTExFZEJRVXdzUTBGQlV5eEpRVUZVTzBGQlEwUXNVMEZHUkN4RFFVVkZMRTlCUVU4c1EwRkJVQ3hGUVVGVk8wRkJRMVlzWlVGQlN5eE5RVUZNTzBGQlEwUTdRVUZEUmp0QlFUZEZhMEk3UVVGQlFUdEJRVUZCTERaQ1FTdEZXanRCUVVOTUxHRkJRVXNzV1VGQlRDeERRVUZyUWl4cFFrRkJUU3cwUWtGQmVFSXNSVUZCYzBRc1JVRkJSU3hOUVVGTkxFbEJRVWtzU1VGQlNpeEZRVUZTTEVWQlFYUkVMRVZCUVRSRkxFdEJRVFZGT3p0QlFVVkJMRmxCUVVrc1MwRkJTeXhUUVVGTUxFOUJRWEZDTEdsQ1FVRk5MR05CUVM5Q0xFVkJRU3RETzBGQlF6ZERMR1ZCUVVzc1dVRkJUQ3hEUVVGclFpeHBRa0ZCVFN4alFVRjRRaXhGUVVGM1F5eEZRVUZGTEUxQlFVMHNTVUZCU1N4SlFVRktMRVZCUVZJc1JVRkJlRU1zUlVGQk9FUXNTMEZCT1VRN1FVRkRSRHM3UVVGRlJDeGhRVUZMTEZOQlFVd3NRMEZCWlN4cFFrRkJUU3hqUVVGeVFqdEJRVU5FTzBGQmRrWnJRanRCUVVGQk8wRkJRVUVzSzBKQmVVWldPMEZCUTFBc1lVRkJTeXhaUVVGTUxFTkJRV3RDTEdsQ1FVRk5MRFJDUVVGNFFpeEZRVUZ6UkN4RlFVRkZMRTFCUVUwc1NVRkJTU3hKUVVGS0xFVkJRVklzUlVGQmRFUXNSVUZCTkVVc1MwRkJOVVU3TzBGQlJVRXNXVUZCU1N4TFFVRkxMRk5CUVV3c1QwRkJjVUlzYVVKQlFVMHNaVUZCTDBJc1JVRkJaMFE3UVVGRE9VTXNaVUZCU3l4WlFVRk1MRU5CUVd0Q0xHbENRVUZOTEdWQlFYaENMRVZCUVhsRExFVkJRVVVzVFVGQlRTeEpRVUZKTEVsQlFVb3NSVUZCVWl4RlFVRjZReXhGUVVFclJDeExRVUV2UkR0QlFVTkVPenRCUVVWRUxHRkJRVXNzVTBGQlRDeERRVUZsTEdsQ1FVRk5MR1ZCUVhKQ08wRkJRMFE3UVVGcVIydENPMEZCUVVFN1FVRkJRU3h0UTBGdFIwNDdRVUZCUVRzN1FVRkRXQ3hoUVVGTExGTkJRVXc3TzBGQlJVRXNZVUZCU3l4WlFVRk1PenRCUVVWQkxHRkJRVXNzWVVGQlRDeEhRVUZ4UWl4WlFVRlpMRmxCUVUwN1FVRkRja01zYVVKQlFVc3NXVUZCVER0QlFVTkVMRk5CUm05Q0xFVkJSV3hDTEV0QlFVc3NUMEZCVEN4RFFVRmhMRXRCUmtzc1EwRkJja0k3UVVGSFJEdEJRVE5IYTBJN1FVRkJRVHRCUVVGQkxHdERRVFpIVUR0QlFVTldMRmxCUVVrc1MwRkJTeXhoUVVGTUxFdEJRWFZDTEVsQlFUTkNMRVZCUVdsRE8wRkJReTlDTEhkQ1FVRmpMRXRCUVVzc1lVRkJia0k3UVVGRFFTeGxRVUZMTEdGQlFVd3NSMEZCY1VJc1NVRkJja0k3UVVGRFJEdEJRVU5HTzBGQmJFaHJRanRCUVVGQk8wRkJRVUVzYjBOQmIwaEZMRTlCY0VoR0xFVkJiMGhYTzBGQlF6VkNMREpIUVVFeVFpeFBRVUV6UWl4RlFVRnZReXhQUVVGd1F6dEJRVU5FTzBGQmRFaHJRanM3UVVGQlFUdEJRVUZCT3p0QlFYbElja0lzVTBGQlR5eFBRVUZRTzBGQlEwUXNRMEV4U0dVc1JVRkJhRUk3TzJ0Q1FUUklaU3hQSWl3aVptbHNaU0k2SW1kbGJtVnlZWFJsWkM1cWN5SXNJbk52ZFhKalpWSnZiM1FpT2lJaUxDSnpiM1Z5WTJWelEyOXVkR1Z1ZENJNld5SW9ablZ1WTNScGIyNGdaU2gwTEc0c2NpbDdablZ1WTNScGIyNGdjeWh2TEhVcGUybG1LQ0Z1VzI5ZEtYdHBaaWdoZEZ0dlhTbDdkbUZ5SUdFOWRIbHdaVzltSUhKbGNYVnBjbVU5UFZ3aVpuVnVZM1JwYjI1Y0lpWW1jbVZ4ZFdseVpUdHBaaWdoZFNZbVlTbHlaWFIxY200Z1lTaHZMQ0V3S1R0cFppaHBLWEpsZEhWeWJpQnBLRzhzSVRBcE8zWmhjaUJtUFc1bGR5QkZjbkp2Y2loY0lrTmhibTV2ZENCbWFXNWtJRzF2WkhWc1pTQW5YQ0lyYnl0Y0lpZGNJaWs3ZEdoeWIzY2daaTVqYjJSbFBWd2lUVTlFVlV4RlgwNVBWRjlHVDFWT1JGd2lMR1o5ZG1GeUlHdzlibHR2WFQxN1pYaHdiM0owY3pwN2ZYMDdkRnR2WFZzd1hTNWpZV3hzS0d3dVpYaHdiM0owY3l4bWRXNWpkR2x2YmlobEtYdDJZWElnYmoxMFcyOWRXekZkVzJWZE8zSmxkSFZ5YmlCektHNC9ianBsS1gwc2JDeHNMbVY0Y0c5eWRITXNaU3gwTEc0c2NpbDljbVYwZFhKdUlHNWJiMTB1Wlhod2IzSjBjMzEyWVhJZ2FUMTBlWEJsYjJZZ2NtVnhkV2x5WlQwOVhDSm1kVzVqZEdsdmJsd2lKaVp5WlhGMWFYSmxPMlp2Y2loMllYSWdiejB3TzI4OGNpNXNaVzVuZEdnN2J5c3JLWE1vY2x0dlhTazdjbVYwZFhKdUlITjlLU0lzSW1WNGNHOXlkQ0JtZFc1amRHbHZiaUJrYVhOd1lYUmphRmRwYmtSdlkwVjJaVzUwS0dWMlpXNTBUbUZ0WlN3Z2JXOWtkV3hsVG1GdFpTd2daR1YwWVdsc0lEMGdlMzBwSUh0Y2JpQWdZMjl1YzNRZ1puVnNiRVYyWlc1MFRtRnRaU0E5SUdBa2UyVjJaVzUwVG1GdFpYMHVjR2d1Skh0dGIyUjFiR1ZPWVcxbGZXQmNiaUFnZDJsdVpHOTNMbVJwYzNCaGRHTm9SWFpsYm5Rb2JtVjNJRU4xYzNSdmJVVjJaVzUwS0daMWJHeEZkbVZ1ZEU1aGJXVXNJSHNnWkdWMFlXbHNJSDBwS1Z4dUlDQmtiMk4xYldWdWRDNWthWE53WVhSamFFVjJaVzUwS0c1bGR5QkRkWE4wYjIxRmRtVnVkQ2htZFd4c1JYWmxiblJPWVcxbExDQjdJR1JsZEdGcGJDQjlLU2xjYm4xY2JseHVaWGh3YjNKMElHWjFibU4wYVc5dUlHUnBjM0JoZEdOb1JXeGxiV1Z1ZEVWMlpXNTBLR1J2YlVWc1pXMWxiblFzSUdWMlpXNTBUbUZ0WlN3Z2JXOWtkV3hsVG1GdFpTd2daR1YwWVdsc0lEMGdlMzBwSUh0Y2JpQWdZMjl1YzNRZ1puVnNiRVYyWlc1MFRtRnRaU0E5SUdBa2UyVjJaVzUwVG1GdFpYMHVjR2d1Skh0dGIyUjFiR1ZPWVcxbGZXQmNiaUFnWkc5dFJXeGxiV1Z1ZEM1a2FYTndZWFJqYUVWMlpXNTBLRzVsZHlCRGRYTjBiMjFGZG1WdWRDaG1kV3hzUlhabGJuUk9ZVzFsTENCN0lHUmxkR0ZwYkNCOUtTbGNibjFjYmx4dVpYaHdiM0owSUdaMWJtTjBhVzl1SUdScGMzQmhkR05vVUdGblpVVjJaVzUwS0dWMlpXNTBUbUZ0WlN3Z2NHRm5aVTVoYldVc0lHUmxkR0ZwYkNBOUlIdDlLU0I3WEc0Z0lHTnZibk4wSUdaMWJHeEZkbVZ1ZEU1aGJXVWdQU0JnSkh0d1lXZGxUbUZ0WlgwdUpIdGxkbVZ1ZEU1aGJXVjlZRnh1SUNCM2FXNWtiM2N1WkdsemNHRjBZMmhGZG1WdWRDaHVaWGNnUTNWemRHOXRSWFpsYm5Rb1puVnNiRVYyWlc1MFRtRnRaU3dnZXlCa1pYUmhhV3dnZlNrcFhHNGdJR1J2WTNWdFpXNTBMbVJwYzNCaGRHTm9SWFpsYm5Rb2JtVjNJRU4xYzNSdmJVVjJaVzUwS0daMWJHeEZkbVZ1ZEU1aGJXVXNJSHNnWkdWMFlXbHNJSDBwS1Z4dWZWeHVJaXdpTHk4Z1FIUnZaRzhnYTJWbGNDQS9YRzVwWmlBb2RIbHdaVzltSUhkcGJtUnZkeUFoUFQwZ0ozVnVaR1ZtYVc1bFpDY3BJSHRjYmlBZ2QybHVaRzkzTG1Ga1pFVjJaVzUwVEdsemRHVnVaWElvSjJWeWNtOXlKeXdnS0NrZ1BUNGdlMXh1SUNBZ0lHTnZibk52YkdVdVpYSnliM0lvSjBGdUlHVnljbTl5SUdoaGN5QnZZMk4xY21Wa0lTQlpiM1VnWTJGdUlIQmxiaUJoYmlCcGMzTjFaU0JvWlhKbE9pQm9kSFJ3Y3pvdkwyZHBkR2gxWWk1amIyMHZjWFZoY21zdFpHVjJMMUJvYjI1dmJpMUdjbUZ0WlhkdmNtc3ZhWE56ZFdWekp5bGNiaUFnZlNsY2JuMWNibHh1THk4Z1ZYTmxJR0YyWVdsc1lXSnNaU0JsZG1WdWRITmNibXhsZENCaGRtRnBiR0ZpYkdWRmRtVnVkSE1nUFNCYkoyMXZkWE5sWkc5M2JpY3NJQ2R0YjNWelpXMXZkbVVuTENBbmJXOTFjMlYxY0NkZFhHNXNaWFFnZEc5MVkyaFRZM0psWlc0Z1BTQm1ZV3h6WlZ4dVhHNXBaaUFvZEhsd1pXOW1JSGRwYm1SdmR5QWhQVDBnSjNWdVpHVm1hVzVsWkNjcElIdGNiaUFnYVdZZ0tDZ25iMjUwYjNWamFITjBZWEowSnlCcGJpQjNhVzVrYjNjcElIeDhJSGRwYm1SdmR5NUViMk4xYldWdWRGUnZkV05vSUNZbUlHUnZZM1Z0Wlc1MElHbHVjM1JoYm1ObGIyWWdSRzlqZFcxbGJuUlViM1ZqYUNrZ2UxeHVJQ0FnSUhSdmRXTm9VMk55WldWdUlEMGdkSEoxWlZ4dUlDQWdJR0YyWVdsc1lXSnNaVVYyWlc1MGN5QTlJRnNuZEc5MVkyaHpkR0Z5ZENjc0lDZDBiM1ZqYUcxdmRtVW5MQ0FuZEc5MVkyaGxibVFuTENBbmRHOTFZMmhqWVc1alpXd25YVnh1SUNCOVhHNWNiaUFnYVdZZ0tIZHBibVJ2ZHk1dVlYWnBaMkYwYjNJdWNHOXBiblJsY2tWdVlXSnNaV1FwSUh0Y2JpQWdJQ0JoZG1GcGJHRmliR1ZGZG1WdWRITWdQU0JiSjNCdmFXNTBaWEprYjNkdUp5d2dKM0J2YVc1MFpYSnRiM1psSnl3Z0ozQnZhVzUwWlhKMWNDY3NJQ2R3YjJsdWRHVnlZMkZ1WTJWc0oxMWNiaUFnZlNCbGJITmxJR2xtSUNoM2FXNWtiM2N1Ym1GMmFXZGhkRzl5TG0xelVHOXBiblJsY2tWdVlXSnNaV1FwSUh0Y2JpQWdJQ0JoZG1GcGJHRmliR1ZGZG1WdWRITWdQU0JiSjAxVFVHOXBiblJsY2tSdmQyNG5MQ0FuVFZOUWIybHVkR1Z5VFc5MlpTY3NJQ2ROVTFCdmFXNTBaWEpWY0Njc0lDZE5VMUJ2YVc1MFpYSkRZVzVqWld3blhWeHVJQ0I5WEc1OVhHNWNibU52Ym5OMElHVnNJRDBnWkc5amRXMWxiblF1WTNKbFlYUmxSV3hsYldWdWRDZ25aR2wySnlsY2JtTnZibk4wSUhSeVlXNXphWFJwYjI1eklEMGdXMXh1SUNCN0lHNWhiV1U2SUNkMGNtRnVjMmwwYVc5dUp5d2djM1JoY25RNklDZDBjbUZ1YzJsMGFXOXVjM1JoY25RbkxDQmxibVE2SUNkMGNtRnVjMmwwYVc5dVpXNWtKeUI5TEZ4dUlDQjdJRzVoYldVNklDZE5iM3BVY21GdWMybDBhVzl1Snl3Z2MzUmhjblE2SUNkMGNtRnVjMmwwYVc5dWMzUmhjblFuTENCbGJtUTZJQ2QwY21GdWMybDBhVzl1Wlc1a0p5QjlMRnh1SUNCN0lHNWhiV1U2SUNkdGMxUnlZVzV6YVhScGIyNG5MQ0J6ZEdGeWREb2dKMjF6VkhKaGJuTnBkR2x2YmxOMFlYSjBKeXdnWlc1a09pQW5iWE5VY21GdWMybDBhVzl1Ulc1a0p5QjlMRnh1SUNCN0lHNWhiV1U2SUNkWFpXSnJhWFJVY21GdWMybDBhVzl1Snl3Z2MzUmhjblE2SUNkM1pXSnJhWFJVY21GdWMybDBhVzl1VTNSaGNuUW5MQ0JsYm1RNklDZDNaV0pyYVhSVWNtRnVjMmwwYVc5dVJXNWtKeUI5TEZ4dVhWeHVZMjl1YzNRZ1lXNXBiV0YwYVc5dWN5QTlJRnRjYmlBZ2V5QnVZVzFsT2lBbllXNXBiV0YwYVc5dUp5d2djM1JoY25RNklDZGhibWx0WVhScGIyNXpkR0Z5ZENjc0lHVnVaRG9nSjJGdWFXMWhkR2x2Ym1WdVpDY2dmU3hjYmlBZ2V5QnVZVzFsT2lBblRXOTZRVzVwYldGMGFXOXVKeXdnYzNSaGNuUTZJQ2RoYm1sdFlYUnBiMjV6ZEdGeWRDY3NJR1Z1WkRvZ0oyRnVhVzFoZEdsdmJtVnVaQ2NnZlN4Y2JpQWdleUJ1WVcxbE9pQW5iWE5CYm1sdFlYUnBiMjRuTENCemRHRnlkRG9nSjIxelFXNXBiV0YwYVc5dVUzUmhjblFuTENCbGJtUTZJQ2R0YzBGdWFXMWhkR2x2YmtWdVpDY2dmU3hjYmlBZ2V5QnVZVzFsT2lBblYyVmlhMmwwUVc1cGJXRjBhVzl1Snl3Z2MzUmhjblE2SUNkM1pXSnJhWFJCYm1sdFlYUnBiMjVUZEdGeWRDY3NJR1Z1WkRvZ0ozZGxZbXRwZEVGdWFXMWhkR2x2YmtWdVpDY2dmU3hjYmwxY2JseHVZMjl1YzNRZ2RISmhibk5wZEdsdmJsTjBZWEowSUQwZ2RISmhibk5wZEdsdmJuTXVabWx1WkNoMElEMCtJR1ZzTG5OMGVXeGxXM1F1Ym1GdFpWMGdJVDA5SUhWdVpHVm1hVzVsWkNrdWMzUmhjblJjYm1OdmJuTjBJSFJ5WVc1emFYUnBiMjVGYm1RZ1BTQjBjbUZ1YzJsMGFXOXVjeTVtYVc1a0tIUWdQVDRnWld3dWMzUjViR1ZiZEM1dVlXMWxYU0FoUFQwZ2RXNWtaV1pwYm1Wa0tTNWxibVJjYm1OdmJuTjBJR0Z1YVcxaGRHbHZibE4wWVhKMElEMGdZVzVwYldGMGFXOXVjeTVtYVc1a0tIUWdQVDRnWld3dWMzUjViR1ZiZEM1dVlXMWxYU0FoUFQwZ2RXNWtaV1pwYm1Wa0tTNXpkR0Z5ZEZ4dVkyOXVjM1FnWVc1cGJXRjBhVzl1Ulc1a0lEMGdZVzVwYldGMGFXOXVjeTVtYVc1a0tIUWdQVDRnWld3dWMzUjViR1ZiZEM1dVlXMWxYU0FoUFQwZ2RXNWtaV1pwYm1Wa0tTNWxibVJjYmx4dVpYaHdiM0owSUdSbFptRjFiSFFnZTF4dUlDQXZMeUIwYjNWamFDQnpZM0psWlc0Z2MzVndjRzl5ZEZ4dUlDQlVUMVZEU0Y5VFExSkZSVTQ2SUhSdmRXTm9VMk55WldWdUxGeHVYRzRnSUM4dklHNWxkSGR2Y210Y2JpQWdUa1ZVVjA5U1MxOVBUa3hKVGtVNklDZHZibXhwYm1VbkxGeHVJQ0JPUlZSWFQxSkxYMDlHUmt4SlRrVTZJQ2R2Wm1ac2FXNWxKeXhjYmlBZ1RrVlVWMDlTUzE5U1JVTlBUazVGUTFSSlRrYzZJQ2R5WldOdmJtNWxZM1JwYm1jbkxGeHVJQ0JPUlZSWFQxSkxYMUpGUTA5T1RrVkRWRWxPUjE5VFZVTkRSVk5UT2lBbmNtVmpiMjV1WldOMExuTjFZMk5sYzNNbkxGeHVJQ0JPUlZSWFQxSkxYMUpGUTA5T1RrVkRWRWxPUjE5R1FVbE1WVkpGT2lBbmNtVmpiMjV1WldOMExtWmhhV3gxY21VbkxGeHVYRzRnSUM4dklIVnpaWElnYVc1MFpYSm1ZV05sSUhOMFlYUmxjMXh1SUNCVFNFOVhPaUFuYzJodmR5Y3NYRzRnSUZOSVQxZE9PaUFuYzJodmQyNG5MRnh1SUNCSVNVUkZPaUFuYUdsa1pTY3NYRzRnSUVoSlJFUkZUam9nSjJocFpHUmxiaWNzWEc1Y2JpQWdMeThnYUdGemFGeHVJQ0JJUVZOSU9pQW5hR0Z6YUNjc1hHNWNiaUFnTHk4Z2RHOTFZMmdzSUcxdmRYTmxJR0Z1WkNCd2IybHVkR1Z5SUdWMlpXNTBjeUJ3YjJ4NVptbHNiRnh1SUNCVFZFRlNWRG9nWVhaaGFXeGhZbXhsUlhabGJuUnpXekJkTEZ4dUlDQk5UMVpGT2lCaGRtRnBiR0ZpYkdWRmRtVnVkSE5iTVYwc1hHNGdJRVZPUkRvZ1lYWmhhV3hoWW14bFJYWmxiblJ6V3pKZExGeHVJQ0JEUVU1RFJVdzZJSFI1Y0dWdlppQmhkbUZwYkdGaWJHVkZkbVZ1ZEhOYk0xMGdQVDA5SUNkMWJtUmxabWx1WldRbklEOGdiblZzYkNBNklHRjJZV2xzWVdKc1pVVjJaVzUwYzFzelhTeGNibHh1SUNBdkx5QjBjbUZ1YzJsMGFXOXVjMXh1SUNCVVVrRk9VMGxVU1U5T1gxTlVRVkpVT2lCMGNtRnVjMmwwYVc5dVUzUmhjblFzWEc0Z0lGUlNRVTVUU1ZSSlQwNWZSVTVFT2lCMGNtRnVjMmwwYVc5dVJXNWtMRnh1WEc0Z0lDOHZJR0Z1YVcxaGRHbHZibk5jYmlBZ1FVNUpUVUZVU1U5T1gxTlVRVkpVT2lCaGJtbHRZWFJwYjI1VGRHRnlkQ3hjYmlBZ1FVNUpUVUZVU1U5T1gwVk9SRG9nWVc1cGJXRjBhVzl1Ulc1a0xGeHVYRzRnSUM4dklHUnliM0JrYjNkdVhHNGdJRWxVUlUxZlUwVk1SVU5VUlVRNklDZHBkR1Z0VTJWc1pXTjBaV1FuTEZ4dWZTSXNJbHh1Wlhod2IzSjBJR1oxYm1OMGFXOXVJR3h2WVdSR2FXeGxLSFZ5YkN3Z1ptNHNJSEJ2YzNSRVlYUmhLU0I3WEc0Z0lHTnZibk4wSUhKbGNTQTlJRzVsZHlCWVRVeElkSFJ3VW1WeGRXVnpkQ2dwWEc0Z0lHbG1JQ2h5WlhFdWIzWmxjbkpwWkdWTmFXMWxWSGx3WlNrZ2NtVnhMbTkyWlhKeWFXUmxUV2x0WlZSNWNHVW9KM1JsZUhRdmFIUnRiRHNnWTJoaGNuTmxkRDExZEdZdE9DY3BYRzRnSUhKbGNTNXZibkpsWVdSNWMzUmhkR1ZqYUdGdVoyVWdQU0FvS1NBOVBpQjdYRzRnSUNBZ2FXWWdLSEpsY1M1eVpXRmtlVk4wWVhSbElEMDlQU0EwSUNZbUlDaHdZWEp6WlVsdWRDaHlaWEV1YzNSaGRIVnpMQ0F4TUNrZ1BUMDlJREl3TUZ4dUlDQWdJQ0FnZkh3Z0lYSmxjUzV6ZEdGMGRYTWdKaVlnY21WeExuSmxjM0J2Ym5ObFZHVjRkQzVzWlc1bmRHZ3BLU0I3WEc0Z0lDQWdJQ0JtYmloeVpYRXVjbVZ6Y0c5dWMyVlVaWGgwS1Z4dUlDQWdJSDFjYmlBZ2ZWeHVYRzRnSUdsbUlDaDBlWEJsYjJZZ2NHOXpkRVJoZEdFZ0lUMDlJQ2R6ZEhKcGJtY25LU0I3WEc0Z0lDQWdjbVZ4TG05d1pXNG9KMGRGVkNjc0lIVnliQ3dnZEhKMVpTbGNiaUFnSUNCeVpYRXVjMlZ1WkNnbkp5bGNiaUFnZlNCbGJITmxJSHRjYmlBZ0lDQnlaWEV1YjNCbGJpZ25VRTlUVkNjc0lIVnliQ3dnZEhKMVpTbGNiaUFnSUNCeVpYRXVjMlYwVW1WeGRXVnpkRWhsWVdSbGNpZ25RMjl1ZEdWdWRDMTBlWEJsSnl3Z0oyRndjR3hwWTJGMGFXOXVMM2d0ZDNkM0xXWnZjbTB0ZFhKc1pXNWpiMlJsWkNjcFhHNGdJQ0FnY21WeExuTmxibVFvY0c5emRFUmhkR0VwWEc0Z0lIMWNibjFjYmx4dVpYaHdiM0owSUdaMWJtTjBhVzl1SUdkbGJtVnlZWFJsU1dRb0tTQjdYRzRnSUhKbGRIVnliaUJOWVhSb0xuSmhibVJ2YlNncExuUnZVM1J5YVc1bktETTJLUzV6ZFdKemRISW9NaXdnTVRBcFhHNTlYRzVjYm1WNGNHOXlkQ0JtZFc1amRHbHZiaUJtYVc1a1ZHRnlaMlYwUW5sRGJHRnpjeWgwWVhKblpYUXNJSEJoY21WdWRFTnNZWE56S1NCN1hHNGdJR1p2Y2lBb095QjBZWEpuWlhRZ0ppWWdkR0Z5WjJWMElDRTlQU0JrYjJOMWJXVnVkRHNnZEdGeVoyVjBJRDBnZEdGeVoyVjBMbkJoY21WdWRFNXZaR1VwSUh0Y2JpQWdJQ0JwWmlBb2RHRnlaMlYwTG1Oc1lYTnpUR2x6ZEM1amIyNTBZV2x1Y3lod1lYSmxiblJEYkdGemN5a3BJSHRjYmlBZ0lDQWdJSEpsZEhWeWJpQjBZWEpuWlhSY2JpQWdJQ0I5WEc0Z0lIMWNibHh1SUNCeVpYUjFjbTRnYm5Wc2JGeHVmVnh1WEc1Y2JtVjRjRzl5ZENCbWRXNWpkR2x2YmlCbWFXNWtWR0Z5WjJWMFFubEpaQ2gwWVhKblpYUXNJSEJoY21WdWRFbGtLU0I3WEc0Z0lHWnZjaUFvT3lCMFlYSm5aWFFnSmlZZ2RHRnlaMlYwSUNFOVBTQmtiMk4xYldWdWREc2dkR0Z5WjJWMElEMGdkR0Z5WjJWMExuQmhjbVZ1ZEU1dlpHVXBJSHRjYmlBZ0lDQnBaaUFvZEdGeVoyVjBMbWRsZEVGMGRISnBZblYwWlNnbmFXUW5LU0E5UFQwZ2NHRnlaVzUwU1dRcElIdGNiaUFnSUNBZ0lISmxkSFZ5YmlCMFlYSm5aWFJjYmlBZ0lDQjlYRzRnSUgxY2JseHVJQ0J5WlhSMWNtNGdiblZzYkZ4dWZWeHVYRzVsZUhCdmNuUWdablZ1WTNScGIyNGdabWx1WkZSaGNtZGxkRUo1UVhSMGNpaDBZWEpuWlhRc0lHRjBkSElwSUh0Y2JpQWdabTl5SUNnN0lIUmhjbWRsZENBbUppQjBZWEpuWlhRZ0lUMDlJR1J2WTNWdFpXNTBPeUIwWVhKblpYUWdQU0IwWVhKblpYUXVjR0Z5Wlc1MFRtOWtaU2tnZTF4dUlDQWdJR2xtSUNoMFlYSm5aWFF1WjJWMFFYUjBjbWxpZFhSbEtHRjBkSElwSUNFOVBTQnVkV3hzS1NCN1hHNGdJQ0FnSUNCeVpYUjFjbTRnZEdGeVoyVjBYRzRnSUNBZ2ZWeHVJQ0I5WEc1Y2JpQWdjbVYwZFhKdUlHNTFiR3hjYm4xY2JpSXNJaThxS2x4dUlDb2dMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzFjYmlBcUlFeHBZMlZ1YzJWa0lIVnVaR1Z5SUUxSlZDQW9hSFIwY0hNNkx5OW5hWFJvZFdJdVkyOXRMM0YxWVhKckxXUmxkaTlRYUc5dWIyNHRSbkpoYldWM2IzSnJMMkpzYjJJdmJXRnpkR1Z5TDB4SlEwVk9VMFVwWEc0Z0tpQXRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMVnh1SUNvdlhHNXBiWEJ2Y25RZ1EyOXRjRzl1Wlc1MElHWnliMjBnSnk0dUwyTnZiWEJ2Ym1WdWRDZGNibWx0Y0c5eWRDQkRiMnhzWVhCelpTQm1jbTl0SUNjdUxpOWpiMnhzWVhCelpTZGNibWx0Y0c5eWRDQjdJR2RsZEVGMGRISnBZblYwWlhORGIyNW1hV2NnZlNCbWNtOXRJQ2N1TGk5amIyMXdiMjVsYm5STllXNWhaMlZ5SjF4dWFXMXdiM0owSUhzZ1ptbHVaRlJoY21kbGRFSjVRMnhoYzNNZ2ZTQm1jbTl0SUNjdUxpOHVMaTlqYjIxdGIyNHZkWFJwYkhNblhHNWNibU52Ym5OMElFRmpZMjl5WkdsdmJpQTlJQ2dvS1NBOVBpQjdYRzRnSUM4cUtseHVJQ0FnS2lBdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMxY2JpQWdJQ29nUTI5dWMzUmhiblJ6WEc0Z0lDQXFJQzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMVnh1SUNBZ0tpOWNibHh1SUNCamIyNXpkQ0JPUVUxRklEMGdKMkZqWTI5eVpHbHZiaWRjYmlBZ1kyOXVjM1FnVmtWU1UwbFBUaUE5SUNjeUxqQXVNQ2RjYmlBZ1kyOXVjM1FnUkVWR1FWVk1WRjlRVWs5UVJWSlVTVVZUSUQwZ2UxeHVJQ0FnSUdWc1pXMWxiblE2SUc1MWJHd3NYRzRnSUgxY2JpQWdZMjl1YzNRZ1JFRlVRVjlCVkZSU1UxOVFVazlRUlZKVVNVVlRJRDBnVzF4dUlDQmRYRzVjYmlBZ0x5b3FYRzRnSUNBcUlDMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExWeHVJQ0FnS2lCRGJHRnpjeUJFWldacGJtbDBhVzl1WEc0Z0lDQXFJQzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMVnh1SUNBZ0tpOWNibHh1SUNCamJHRnpjeUJCWTJOdmNtUnBiMjRnWlhoMFpXNWtjeUJEYjIxd2IyNWxiblFnZTF4dVhHNGdJQ0FnWTI5dWMzUnlkV04wYjNJb2IzQjBhVzl1Y3lBOUlIdDlLU0I3WEc0Z0lDQWdJQ0J6ZFhCbGNpaE9RVTFGTENCV1JWSlRTVTlPTENCRVJVWkJWVXhVWDFCU1QxQkZVbFJKUlZNc0lHOXdkR2x2Ym5Nc0lFUkJWRUZmUVZSVVVsTmZVRkpQVUVWU1ZFbEZVeXdnWm1Gc2MyVXNJR1poYkhObEtWeHVYRzRnSUNBZ0lDQjBhR2x6TG1OdmJHeGhjSE5sY3lBOUlGdGRYRzVjYmlBZ0lDQWdJR052Ym5OMElIUnZaMmRzWlhNZ1BTQjBhR2x6TG05d2RHbHZibk11Wld4bGJXVnVkQzV4ZFdWeWVWTmxiR1ZqZEc5eVFXeHNLR0JiWkdGMFlTMTBiMmRuYkdVOVhDSWtlMDVCVFVWOVhDSmRZQ2xjYmlBZ0lDQWdJRUZ5Y21GNUxtWnliMjBvZEc5bloyeGxjeWt1Wm05eVJXRmphQ2dvZEc5bloyeGxLU0E5UGlCN1hHNGdJQ0FnSUNBZ0lHTnZibk4wSUdOdmJHeGhjSE5sU1dRZ1BTQjBiMmRuYkdVdVoyVjBRWFIwY21saWRYUmxLQ2RvY21WbUp5bGNiaUFnSUNBZ0lDQWdZMjl1YzNRZ1kyOXNiR0Z3YzJVZ1BTQmtiMk4xYldWdWRDNXhkV1Z5ZVZObGJHVmpkRzl5S0dOdmJHeGhjSE5sU1dRcFhHNWNiaUFnSUNBZ0lDQWdhV1lnS0dOdmJHeGhjSE5sS1NCN1hHNGdJQ0FnSUNBZ0lDQWdkR2hwY3k1aFpHUkRiMnhzWVhCelpTaGpiMnhzWVhCelpTbGNiaUFnSUNBZ0lDQWdmVnh1SUNBZ0lDQWdmU2xjYmlBZ0lDQjlYRzVjYmlBZ0lDQnZia1ZzWlcxbGJuUkZkbVZ1ZENobGRtVnVkQ2tnZTF4dUlDQWdJQ0FnWTI5dWMzUWdhV1FnUFNCbGRtVnVkQzUwWVhKblpYUXVaMlYwUVhSMGNtbGlkWFJsS0Nkb2NtVm1KeWxjYmlBZ0lDQWdJR052Ym5OMElHVnNaVzFsYm5RZ1BTQmtiMk4xYldWdWRDNXhkV1Z5ZVZObGJHVmpkRzl5S0dsa0tWeHVYRzRnSUNBZ0lDQjBhR2x6TG5ObGRFTnZiR3hoY0hObGN5aGxiR1Z0Wlc1MEtWeHVJQ0FnSUgxY2JseHVJQ0FnSUdGa1pFTnZiR3hoY0hObEtHVnNaVzFsYm5RcElIdGNiaUFnSUNBZ0lHTnZibk4wSUdOdmJHeGhjSE5sSUQwZ2JtVjNJRU52Ykd4aGNITmxLSHRjYmlBZ0lDQWdJQ0FnWld4bGJXVnVkQ3hjYmlBZ0lDQWdJSDBwWEc0Z0lDQWdJQ0IwYUdsekxtTnZiR3hoY0hObGN5NXdkWE5vS0dOdmJHeGhjSE5sS1Z4dVhHNGdJQ0FnSUNCeVpYUjFjbTRnWTI5c2JHRndjMlZjYmlBZ0lDQjlYRzVjYmlBZ0lDQm5aWFJEYjJ4c1lYQnpaU2hsYkdWdFpXNTBLU0I3WEc0Z0lDQWdJQ0JzWlhRZ1kyOXNiR0Z3YzJVZ1BTQjBhR2x6TG1OdmJHeGhjSE5sY3k1bWFXNWtLR01nUFQ0Z1l5NXZjSFJwYjI1ekxtVnNaVzFsYm5RdVoyVjBRWFIwY21saWRYUmxLQ2RwWkNjcElEMDlQU0JsYkdWdFpXNTBMbWRsZEVGMGRISnBZblYwWlNnbmFXUW5LU2xjYmx4dUlDQWdJQ0FnYVdZZ0tDRmpiMnhzWVhCelpTa2dlMXh1SUNBZ0lDQWdJQ0F2THlCamNtVmhkR1VnWVNCdVpYY2dZMjlzYkdGd2MyVmNiaUFnSUNBZ0lDQWdZMjlzYkdGd2MyVWdQU0IwYUdsekxtRmtaRU52Ykd4aGNITmxLQ2xjYmlBZ0lDQWdJSDFjYmx4dUlDQWdJQ0FnY21WMGRYSnVJR052Ykd4aGNITmxYRzRnSUNBZ2ZWeHVYRzRnSUNBZ1oyVjBRMjlzYkdGd2MyVnpLQ2tnZTF4dUlDQWdJQ0FnY21WMGRYSnVJSFJvYVhNdVkyOXNiR0Z3YzJWelhHNGdJQ0FnZlZ4dVhHNGdJQ0FnYzJWMFEyOXNiR0Z3YzJWektITm9iM2REYjJ4c1lYQnpaU2tnZTF4dUlDQWdJQ0FnWTI5dWMzUWdZMjlzYkdGd2MyVWdQU0IwYUdsekxtZGxkRU52Ykd4aGNITmxLSE5vYjNkRGIyeHNZWEJ6WlNsY2JpQWdJQ0FnSUhSb2FYTXVZMjlzYkdGd2MyVnpMbVp2Y2tWaFkyZ29LR01wSUQwK0lIdGNiaUFnSUNBZ0lDQWdhV1lnS0dNdWIzQjBhVzl1Y3k1bGJHVnRaVzUwTG1kbGRFRjBkSEpwWW5WMFpTZ25hV1FuS1NBaFBUMGdjMmh2ZDBOdmJHeGhjSE5sTG1kbGRFRjBkSEpwWW5WMFpTZ25hV1FuS1NrZ2UxeHVJQ0FnSUNBZ0lDQWdJR011YUdsa1pTZ3BYRzRnSUNBZ0lDQWdJSDBnWld4elpTQjdYRzRnSUNBZ0lDQWdJQ0FnWTI5c2JHRndjMlV1ZEc5bloyeGxLQ2xjYmlBZ0lDQWdJQ0FnZlZ4dUlDQWdJQ0FnZlNsY2JpQWdJQ0I5WEc1Y2JpQWdJQ0J6YUc5M0tHTnZiR3hoY0hObFJXd3BJSHRjYmlBZ0lDQWdJR3hsZENCamIyeHNZWEJ6WlNBOUlHTnZiR3hoY0hObFJXeGNiaUFnSUNBZ0lHbG1JQ2gwZVhCbGIyWWdZMjlzYkdGd2MyVkZiQ0E5UFQwZ0ozTjBjbWx1WnljcElIdGNiaUFnSUNBZ0lDQWdZMjlzYkdGd2MyVWdQU0JrYjJOMWJXVnVkQzV4ZFdWeWVWTmxiR1ZqZEc5eUtHTnZiR3hoY0hObFJXd3BYRzRnSUNBZ0lDQjlYRzVjYmlBZ0lDQWdJR2xtSUNnaFkyOXNiR0Z3YzJVcElIdGNiaUFnSUNBZ0lDQWdkR2h5YjNjZ2JtVjNJRVZ5Y205eUtHQWtlMDVCVFVWOUxpQlVhR1VnWTI5c2JHRndjMmxpYkdVZ0pIdGpiMnhzWVhCelpVVnNmU0JwY3lCaGJpQnBiblpoYkdsa0lFaFVUVXhGYkdWdFpXNTBMbUFwWEc0Z0lDQWdJQ0I5WEc1Y2JpQWdJQ0FnSUhSb2FYTXVjMlYwUTI5c2JHRndjMlZ6S0dOdmJHeGhjSE5sS1Z4dVhHNGdJQ0FnSUNCeVpYUjFjbTRnZEhKMVpWeHVJQ0FnSUgxY2JseHVJQ0FnSUdocFpHVW9ZMjlzYkdGd2MyVkZiQ2tnZTF4dUlDQWdJQ0FnYkdWMElHTnZiR3hoY0hObElEMGdZMjlzYkdGd2MyVkZiRnh1SUNBZ0lDQWdhV1lnS0hSNWNHVnZaaUJqYjJ4c1lYQnpaVVZzSUQwOVBTQW5jM1J5YVc1bkp5a2dlMXh1SUNBZ0lDQWdJQ0JqYjJ4c1lYQnpaU0E5SUdSdlkzVnRaVzUwTG5GMVpYSjVVMlZzWldOMGIzSW9ZMjlzYkdGd2MyVkZiQ2xjYmlBZ0lDQWdJSDFjYmx4dUlDQWdJQ0FnYVdZZ0tDRmpiMnhzWVhCelpTa2dlMXh1SUNBZ0lDQWdJQ0IwYUhKdmR5QnVaWGNnUlhKeWIzSW9ZQ1I3VGtGTlJYMHVJRlJvWlNCamIyeHNZWEJ6YVdKc1pTQWtlMk52Ykd4aGNITmxSV3g5SUdseklHRnVJR2x1ZG1Gc2FXUWdTRlJOVEVWc1pXMWxiblF1WUNsY2JpQWdJQ0FnSUgxY2JseHVJQ0FnSUNBZ1kyOXVjM1FnWTI5c2JHRndjMlZQWW1vZ1BTQjBhR2x6TG1kbGRFTnZiR3hoY0hObEtHTnZiR3hoY0hObEtWeHVJQ0FnSUNBZ2NtVjBkWEp1SUdOdmJHeGhjSE5sVDJKcUxtaHBaR1VvS1Z4dUlDQWdJSDFjYmx4dUlDQWdJSE4wWVhScFl5QnBaR1Z1ZEdsbWFXVnlLQ2tnZTF4dUlDQWdJQ0FnY21WMGRYSnVJRTVCVFVWY2JpQWdJQ0I5WEc1Y2JpQWdJQ0J6ZEdGMGFXTWdYMFJQVFVsdWRHVnlabUZqWlNodmNIUnBiMjV6S1NCN1hHNGdJQ0FnSUNCeVpYUjFjbTRnYzNWd1pYSXVYMFJQVFVsdWRHVnlabUZqWlNoQlkyTnZjbVJwYjI0c0lHOXdkR2x2Ym5NcFhHNGdJQ0FnZlZ4dUlDQjlYRzVjYmlBZ0x5b3FYRzRnSUNBcUlDMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExWeHVJQ0FnS2lCRVQwMGdRWEJwSUdsdGNHeGxiV1Z1ZEdGMGFXOXVYRzRnSUNBcUlDMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExWeHVJQ0FnS2k5Y2JpQWdZMjl1YzNRZ1kyOXRjRzl1Wlc1MGN5QTlJRnRkWEc1Y2JpQWdZMjl1YzNRZ1lXTmpiM0prYVc5dWN5QTlJR1J2WTNWdFpXNTBMbkYxWlhKNVUyVnNaV04wYjNKQmJHd29ZQzRrZTA1QlRVVjlZQ2xjYmlBZ2FXWWdLR0ZqWTI5eVpHbHZibk1wSUh0Y2JpQWdJQ0JCY25KaGVTNW1jbTl0S0dGalkyOXlaR2x2Ym5NcExtWnZja1ZoWTJnb0tHVnNaVzFsYm5RcElEMCtJSHRjYmlBZ0lDQWdJR052Ym5OMElHTnZibVpwWnlBOUlHZGxkRUYwZEhKcFluVjBaWE5EYjI1bWFXY29aV3hsYldWdWRDd2dSRVZHUVZWTVZGOVFVazlRUlZKVVNVVlRMQ0JFUVZSQlgwRlVWRkpUWDFCU1QxQkZVbFJKUlZNcFhHNGdJQ0FnSUNCamIyNW1hV2N1Wld4bGJXVnVkQ0E5SUdWc1pXMWxiblJjYmx4dUlDQWdJQ0FnWTI5dGNHOXVaVzUwY3k1d2RYTm9LRUZqWTI5eVpHbHZiaTVmUkU5TlNXNTBaWEptWVdObEtHTnZibVpwWnlrcFhHNGdJQ0FnZlNsY2JpQWdmVnh1WEc0Z0lHbG1JQ2hoWTJOdmNtUnBiMjV6S1NCN1hHNGdJQ0FnWkc5amRXMWxiblF1WVdSa1JYWmxiblJNYVhOMFpXNWxjaWduWTJ4cFkyc25MQ0FvWlhabGJuUXBJRDArSUh0Y2JpQWdJQ0FnSUdOdmJuTjBJR1JoZEdGVWIyZG5iR1ZCZEhSeUlEMGdaWFpsYm5RdWRHRnlaMlYwTG1kbGRFRjBkSEpwWW5WMFpTZ25aR0YwWVMxMGIyZG5iR1VuS1Z4dUlDQWdJQ0FnYVdZZ0tHUmhkR0ZVYjJkbmJHVkJkSFJ5SUNZbUlHUmhkR0ZVYjJkbmJHVkJkSFJ5SUQwOVBTQk9RVTFGS1NCN1hHNGdJQ0FnSUNBZ0lHTnZibk4wSUdOdmJHeGhjSE5sU1dRZ1BTQmxkbVZ1ZEM1MFlYSm5aWFF1WjJWMFFYUjBjbWxpZFhSbEtDZGtZWFJoTFhSaGNtZGxkQ2NwSUh4OElHVjJaVzUwTG5SaGNtZGxkQzVuWlhSQmRIUnlhV0oxZEdVb0oyaHlaV1luS1Z4dUlDQWdJQ0FnSUNCamIyNXpkQ0JqYjJ4c1lYQnpaVVZzSUQwZ1pHOWpkVzFsYm5RdWNYVmxjbmxUWld4bFkzUnZjaWhqYjJ4c1lYQnpaVWxrS1Z4dVhHNGdJQ0FnSUNBZ0lHTnZibk4wSUdGalkyOXlaR2x2YmlBOUlHWnBibVJVWVhKblpYUkNlVU5zWVhOektHVjJaVzUwTG5SaGNtZGxkQ3dnSjJGalkyOXlaR2x2YmljcFhHNWNiaUFnSUNBZ0lDQWdhV1lnS0dGalkyOXlaR2x2YmlBOVBUMGdiblZzYkNrZ2UxeHVJQ0FnSUNBZ0lDQWdJSEpsZEhWeWJseHVJQ0FnSUNBZ0lDQjlYRzVjYmlBZ0lDQWdJQ0FnWTI5dWMzUWdZV05qYjNKa2FXOXVTV1FnUFNCaFkyTnZjbVJwYjI0dVoyVjBRWFIwY21saWRYUmxLQ2RwWkNjcFhHNGdJQ0FnSUNBZ0lHTnZibk4wSUdOdmJYQnZibVZ1ZENBOUlHTnZiWEJ2Ym1WdWRITXVabWx1WkNoaklEMCtJR011WjJWMFJXeGxiV1Z1ZENncExtZGxkRUYwZEhKcFluVjBaU2duYVdRbktTQTlQVDBnWVdOamIzSmthVzl1U1dRcFhHNWNiaUFnSUNBZ0lDQWdhV1lnS0NGamIyMXdiMjVsYm5RcElIdGNiaUFnSUNBZ0lDQWdJQ0J5WlhSMWNtNWNiaUFnSUNBZ0lDQWdmVnh1WEc0Z0lDQWdJQ0FnSUM4dklHbG1JSFJvWlNCamIyeHNZWEJ6WlNCb1lYTWdZbVZsYmlCaFpHUmxaQ0J3Y205bmNtRnRiV0YwYVdOaGJHeDVMQ0IzWlNCaFpHUWdhWFJjYmlBZ0lDQWdJQ0FnWTI5dWMzUWdkR0Z5WjJWMFEyOXNiR0Z3YzJVZ1BTQmpiMjF3YjI1bGJuUXVaMlYwUTI5c2JHRndjMlZ6S0NrdVptbHVaQ2hqSUQwK0lHTXVaMlYwUld4bGJXVnVkQ2dwSUQwOVBTQmpiMnhzWVhCelpVVnNLVnh1SUNBZ0lDQWdJQ0JwWmlBb0lYUmhjbWRsZEVOdmJHeGhjSE5sS1NCN1hHNGdJQ0FnSUNBZ0lDQWdZMjl0Y0c5dVpXNTBMbUZrWkVOdmJHeGhjSE5sS0dOdmJHeGhjSE5sUld3cFhHNGdJQ0FnSUNBZ0lIMWNibHh1SUNBZ0lDQWdJQ0JqYjIxd2IyNWxiblF1YzJodmR5aGpiMnhzWVhCelpVbGtLVnh1SUNBZ0lDQWdmVnh1SUNBZ0lIMHBYRzRnSUgxY2JseHVJQ0J5WlhSMWNtNGdRV05qYjNKa2FXOXVYRzU5S1NncFhHNWNibVY0Y0c5eWRDQmtaV1poZFd4MElFRmpZMjl5WkdsdmJseHVJaXdpTHlvcVhHNGdLaUF0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFZ4dUlDb2dUR2xqWlc1elpXUWdkVzVrWlhJZ1RVbFVJQ2hvZEhSd2N6b3ZMMmRwZEdoMVlpNWpiMjB2Y1hWaGNtc3RaR1YyTDFCb2IyNXZiaTFHY21GdFpYZHZjbXN2WW14dllpOXRZWE4wWlhJdlRFbERSVTVUUlNsY2JpQXFJQzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0WEc0Z0tpOWNibWx0Y0c5eWRDQkRiMjF3YjI1bGJuUWdabkp2YlNBbkxpNHZZMjl0Y0c5dVpXNTBKMXh1YVcxd2IzSjBJSHNnWjJWMFFYUjBjbWxpZFhSbGMwTnZibVpwWnlCOUlHWnliMjBnSnk0dUwyTnZiWEJ2Ym1WdWRFMWhibUZuWlhJblhHNXBiWEJ2Y25RZ1JYWmxiblFnWm5KdmJTQW5MaTR2TGk0dlkyOXRiVzl1TDJWMlpXNTBjeWRjYm1sdGNHOXlkQ0I3SUdacGJtUlVZWEpuWlhSQ2VVRjBkSElnZlNCbWNtOXRJQ2N1TGk4dUxpOWpiMjF0YjI0dmRYUnBiSE1uWEc1Y2JtTnZibk4wSUVOdmJHeGhjSE5sSUQwZ0tDZ3BJRDArSUh0Y2JpQWdMeW9xWEc0Z0lDQXFJQzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMVnh1SUNBZ0tpQkRiMjV6ZEdGdWRITmNiaUFnSUNvZ0xTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdFhHNGdJQ0FxTDF4dVhHNGdJR052Ym5OMElFNUJUVVVnUFNBblkyOXNiR0Z3YzJVblhHNGdJR052Ym5OMElGWkZVbE5KVDA0Z1BTQW5NaTR3TGpBblhHNGdJR052Ym5OMElFUkZSa0ZWVEZSZlVGSlBVRVZTVkVsRlV5QTlJSHRjYmlBZ0lDQmxiR1Z0Wlc1ME9pQnVkV3hzTEZ4dUlDQWdJSFJ2WjJkc1pUb2dabUZzYzJVc1hHNGdJSDFjYmlBZ1kyOXVjM1FnUkVGVVFWOUJWRlJTVTE5UVVrOVFSVkpVU1VWVElEMGdXMXh1SUNBZ0lDZDBiMmRuYkdVbkxGeHVJQ0JkWEc1Y2JpQWdMeW9xWEc0Z0lDQXFJQzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMVnh1SUNBZ0tpQkRiR0Z6Y3lCRVpXWnBibWwwYVc5dVhHNGdJQ0FxSUMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFZ4dUlDQWdLaTljYmx4dUlDQmpiR0Z6Y3lCRGIyeHNZWEJ6WlNCbGVIUmxibVJ6SUVOdmJYQnZibVZ1ZENCN1hHNWNiaUFnSUNCamIyNXpkSEoxWTNSdmNpaHZjSFJwYjI1eklEMGdlMzBwSUh0Y2JpQWdJQ0FnSUhOMWNHVnlLRTVCVFVVc0lGWkZVbE5KVDA0c0lFUkZSa0ZWVEZSZlVGSlBVRVZTVkVsRlV5d2diM0IwYVc5dWN5d2dSRUZVUVY5QlZGUlNVMTlRVWs5UVJWSlVTVVZUTENCbVlXeHpaU3dnWm1Gc2MyVXBYRzVjYmlBZ0lDQWdJSFJvYVhNdWIyNVVjbUZ1YzJsMGFXOXVJRDBnWm1Gc2MyVmNibHh1SUNBZ0lDQWdMeThnZEc5bloyeGxJR1JwY21WamRHeDVYRzRnSUNBZ0lDQnBaaUFvZEdocGN5NXZjSFJwYjI1ekxuUnZaMmRzWlNrZ2UxeHVJQ0FnSUNBZ0lDQjBhR2x6TG5Ob2IzY29LVnh1SUNBZ0lDQWdmVnh1SUNBZ0lIMWNibHh1SUNBZ0lHZGxkRWhsYVdkb2RDZ3BJSHRjYmlBZ0lDQWdJSEpsZEhWeWJpQjBhR2x6TG05d2RHbHZibk11Wld4bGJXVnVkQzVuWlhSQ2IzVnVaR2x1WjBOc2FXVnVkRkpsWTNRb2RHaHBjeTV2Y0hScGIyNXpMbVZzWlcxbGJuUXBMbWhsYVdkb2RGeHVJQ0FnSUgxY2JseHVJQ0FnSUhSdloyZHNaU2dwSUh0Y2JpQWdJQ0FnSUdsbUlDaDBhR2x6TG05d2RHbHZibk11Wld4bGJXVnVkQzVqYkdGemMweHBjM1F1WTI5dWRHRnBibk1vSjNOb2IzY25LU2tnZTF4dUlDQWdJQ0FnSUNCeVpYUjFjbTRnZEdocGN5NW9hV1JsS0NsY2JpQWdJQ0FnSUgxY2JseHVJQ0FnSUNBZ2NtVjBkWEp1SUhSb2FYTXVjMmh2ZHlncFhHNGdJQ0FnZlZ4dVhHNGdJQ0FnYzJodmR5Z3BJSHRjYmlBZ0lDQWdJR2xtSUNoMGFHbHpMbTl1VkhKaGJuTnBkR2x2YmlrZ2UxeHVJQ0FnSUNBZ0lDQnlaWFIxY200Z1ptRnNjMlZjYmlBZ0lDQWdJSDFjYmx4dUlDQWdJQ0FnYVdZZ0tIUm9hWE11YjNCMGFXOXVjeTVsYkdWdFpXNTBMbU5zWVhOelRHbHpkQzVqYjI1MFlXbHVjeWduYzJodmR5Y3BLU0I3WEc0Z0lDQWdJQ0FnSUhKbGRIVnliaUJtWVd4elpWeHVJQ0FnSUNBZ2ZWeHVYRzRnSUNBZ0lDQjBhR2x6TG05dVZISmhibk5wZEdsdmJpQTlJSFJ5ZFdWY2JseHVJQ0FnSUNBZ1kyOXVjM1FnYjI1RGIyeHNZWEJ6WldRZ1BTQW9LU0E5UGlCN1hHNGdJQ0FnSUNBZ0lIUm9hWE11YjNCMGFXOXVjeTVsYkdWdFpXNTBMbU5zWVhOelRHbHpkQzVoWkdRb0ozTm9iM2NuS1Z4dUlDQWdJQ0FnSUNCMGFHbHpMbTl3ZEdsdmJuTXVaV3hsYldWdWRDNWpiR0Z6YzB4cGMzUXVjbVZ0YjNabEtDZGpiMnhzWVhCemFXNW5KeWxjYmlBZ0lDQWdJQ0FnZEdocGN5NXZjSFJwYjI1ekxtVnNaVzFsYm5RdWNtVnRiM1psUlhabGJuUk1hWE4wWlc1bGNpaEZkbVZ1ZEM1VVVrRk9VMGxVU1U5T1gwVk9SQ3dnYjI1RGIyeHNZWEJ6WldRcFhHNWNiaUFnSUNBZ0lDQWdkR2hwY3k1dmNIUnBiMjV6TG1Wc1pXMWxiblF1YzJWMFFYUjBjbWxpZFhSbEtDZGhjbWxoTFdWNGNHRnVaR1ZrSnl3Z2RISjFaU2xjYmx4dUlDQWdJQ0FnSUNCMGFHbHpMbTl1VkhKaGJuTnBkR2x2YmlBOUlHWmhiSE5sWEc0Z0lDQWdJQ0I5WEc1Y2JpQWdJQ0FnSUdsbUlDZ2hkR2hwY3k1dmNIUnBiMjV6TG1Wc1pXMWxiblF1WTJ4aGMzTk1hWE4wTG1OdmJuUmhhVzV6S0NkamIyeHNZWEJ6YVc1bkp5a3BJSHRjYmlBZ0lDQWdJQ0FnZEdocGN5NXZjSFJwYjI1ekxtVnNaVzFsYm5RdVkyeGhjM05NYVhOMExtRmtaQ2duWTI5c2JHRndjMmx1WnljcFhHNGdJQ0FnSUNCOVhHNWNiaUFnSUNBZ0lIUm9hWE11YjNCMGFXOXVjeTVsYkdWdFpXNTBMbUZrWkVWMlpXNTBUR2x6ZEdWdVpYSW9SWFpsYm5RdVZGSkJUbE5KVkVsUFRsOUZUa1FzSUc5dVEyOXNiR0Z3YzJWa0tWeHVYRzRnSUNBZ0lDQmpiMjV6ZENCb1pXbG5hSFFnUFNCMGFHbHpMbWRsZEVobGFXZG9kQ2dwWEc1Y2JpQWdJQ0FnSUhSb2FYTXViM0IwYVc5dWN5NWxiR1Z0Wlc1MExuTjBlV3hsTG1obGFXZG9kQ0E5SUNjd2NIZ25YRzVjYmlBZ0lDQWdJSE5sZEZScGJXVnZkWFFvS0NrZ1BUNGdlMXh1SUNBZ0lDQWdJQ0IwYUdsekxtOXdkR2x2Ym5NdVpXeGxiV1Z1ZEM1emRIbHNaUzVvWldsbmFIUWdQU0JnSkh0b1pXbG5hSFI5Y0hoZ1hHNGdJQ0FnSUNCOUxDQXlNQ2xjYmx4dUlDQWdJQ0FnY21WMGRYSnVJSFJ5ZFdWY2JpQWdJQ0I5WEc1Y2JpQWdJQ0JvYVdSbEtDa2dlMXh1SUNBZ0lDQWdhV1lnS0hSb2FYTXViMjVVY21GdWMybDBhVzl1S1NCN1hHNGdJQ0FnSUNBZ0lISmxkSFZ5YmlCbVlXeHpaVnh1SUNBZ0lDQWdmVnh1WEc0Z0lDQWdJQ0JwWmlBb0lYUm9hWE11YjNCMGFXOXVjeTVsYkdWdFpXNTBMbU5zWVhOelRHbHpkQzVqYjI1MFlXbHVjeWduYzJodmR5Y3BLU0I3WEc0Z0lDQWdJQ0FnSUhKbGRIVnliaUJtWVd4elpWeHVJQ0FnSUNBZ2ZWeHVYRzRnSUNBZ0lDQjBhR2x6TG05dVZISmhibk5wZEdsdmJpQTlJSFJ5ZFdWY2JseHVJQ0FnSUNBZ1kyOXVjM1FnYjI1RGIyeHNZWEJ6WldRZ1BTQW9LU0E5UGlCN1hHNGdJQ0FnSUNBZ0lIUm9hWE11YjNCMGFXOXVjeTVsYkdWdFpXNTBMbU5zWVhOelRHbHpkQzV5WlcxdmRtVW9KMk52Ykd4aGNITnBibWNuS1Z4dUlDQWdJQ0FnSUNCMGFHbHpMbTl3ZEdsdmJuTXVaV3hsYldWdWRDNXpkSGxzWlM1b1pXbG5hSFFnUFNBbllYVjBieWRjYmlBZ0lDQWdJQ0FnZEdocGN5NXZjSFJwYjI1ekxtVnNaVzFsYm5RdWNtVnRiM1psUlhabGJuUk1hWE4wWlc1bGNpaEZkbVZ1ZEM1VVVrRk9VMGxVU1U5T1gwVk9SQ3dnYjI1RGIyeHNZWEJ6WldRcFhHNWNiaUFnSUNBZ0lDQWdkR2hwY3k1dmNIUnBiMjV6TG1Wc1pXMWxiblF1YzJWMFFYUjBjbWxpZFhSbEtDZGhjbWxoTFdWNGNHRnVaR1ZrSnl3Z1ptRnNjMlVwWEc1Y2JpQWdJQ0FnSUNBZ2RHaHBjeTV2YmxSeVlXNXphWFJwYjI0Z1BTQm1ZV3h6WlZ4dUlDQWdJQ0FnZlZ4dVhHNGdJQ0FnSUNCMGFHbHpMbTl3ZEdsdmJuTXVaV3hsYldWdWRDNXpkSGxzWlM1b1pXbG5hSFFnUFNBbk1IQjRKMXh1WEc0Z0lDQWdJQ0JwWmlBb0lYUm9hWE11YjNCMGFXOXVjeTVsYkdWdFpXNTBMbU5zWVhOelRHbHpkQzVqYjI1MFlXbHVjeWduWTI5c2JHRndjMmx1WnljcEtTQjdYRzRnSUNBZ0lDQWdJSFJvYVhNdWIzQjBhVzl1Y3k1bGJHVnRaVzUwTG1Oc1lYTnpUR2x6ZEM1aFpHUW9KMk52Ykd4aGNITnBibWNuS1Z4dUlDQWdJQ0FnZlZ4dVhHNGdJQ0FnSUNCMGFHbHpMbTl3ZEdsdmJuTXVaV3hsYldWdWRDNWhaR1JGZG1WdWRFeHBjM1JsYm1WeUtFVjJaVzUwTGxSU1FVNVRTVlJKVDA1ZlJVNUVMQ0J2YmtOdmJHeGhjSE5sWkNsY2JseHVJQ0FnSUNBZ2RHaHBjeTV2Y0hScGIyNXpMbVZzWlcxbGJuUXVZMnhoYzNOTWFYTjBMbkpsYlc5MlpTZ25jMmh2ZHljcFhHNWNiaUFnSUNBZ0lISmxkSFZ5YmlCMGNuVmxYRzRnSUNBZ2ZWeHVYRzRnSUNBZ2MzUmhkR2xqSUdsa1pXNTBhV1pwWlhJb0tTQjdYRzRnSUNBZ0lDQnlaWFIxY200Z1RrRk5SVnh1SUNBZ0lIMWNibHh1SUNBZ0lITjBZWFJwWXlCZlJFOU5TVzUwWlhKbVlXTmxLRzl3ZEdsdmJuTXBJSHRjYmlBZ0lDQWdJSEpsZEhWeWJpQnpkWEJsY2k1ZlJFOU5TVzUwWlhKbVlXTmxLRU52Ykd4aGNITmxMQ0J2Y0hScGIyNXpLVnh1SUNBZ0lIMWNiaUFnZlZ4dVhHNGdJQzhxS2x4dUlDQWdLaUF0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzFjYmlBZ0lDb2dSRTlOSUVGd2FTQnBiWEJzWlcxbGJuUmhkR2x2Ymx4dUlDQWdLaUF0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzFjYmlBZ0lDb3ZYRzRnSUdOdmJuTjBJR052YlhCdmJtVnVkSE1nUFNCYlhWeHVYRzRnSUdOdmJuTjBJR052Ykd4aGNITmxjeUE5SUdSdlkzVnRaVzUwTG5GMVpYSjVVMlZzWldOMGIzSkJiR3dvWUM0a2UwNUJUVVY5WUNsY2JpQWdhV1lnS0dOdmJHeGhjSE5sY3lrZ2UxeHVJQ0FnSUdOdmJHeGhjSE5sY3k1bWIzSkZZV05vS0NobGJHVnRaVzUwS1NBOVBpQjdYRzRnSUNBZ0lDQXZMeUJqYjI1emRDQmpiMjVtYVdjZ1BTQjdmVnh1SUNBZ0lDQWdZMjl1YzNRZ1kyOXVabWxuSUQwZ1oyVjBRWFIwY21saWRYUmxjME52Ym1acFp5aGxiR1Z0Wlc1MExDQkVSVVpCVlV4VVgxQlNUMUJGVWxSSlJWTXNJRVJCVkVGZlFWUlVVbE5mVUZKUFVFVlNWRWxGVXlsY2JpQWdJQ0FnSUdOdmJtWnBaeTVsYkdWdFpXNTBJRDBnWld4bGJXVnVkRnh1WEc0Z0lDQWdJQ0JqYjIxd2IyNWxiblJ6TG5CMWMyZ29RMjlzYkdGd2MyVXVYMFJQVFVsdWRHVnlabUZqWlNoamIyNW1hV2NwS1Z4dUlDQWdJSDBwWEc0Z0lIMWNibHh1SUNCcFppQW9ZMjlzYkdGd2MyVnpLU0I3WEc0Z0lDQWdaRzlqZFcxbGJuUXVZV1JrUlhabGJuUk1hWE4wWlc1bGNpZ25ZMnhwWTJzbkxDQW9aWFpsYm5RcElEMCtJSHRjYmlBZ0lDQWdJR052Ym5OMElIUmhjbWRsZENBOUlHWnBibVJVWVhKblpYUkNlVUYwZEhJb1pYWmxiblF1ZEdGeVoyVjBMQ0FuWkdGMFlTMTBiMmRuYkdVbktWeHVJQ0FnSUNBZ2FXWWdLQ0YwWVhKblpYUXBJSHRjYmlBZ0lDQWdJQ0FnY21WMGRYSnVYRzRnSUNBZ0lDQjlYRzVjYmlBZ0lDQWdJR052Ym5OMElHUmhkR0ZVYjJkbmJHVkJkSFJ5SUQwZ2RHRnlaMlYwTG1kbGRFRjBkSEpwWW5WMFpTZ25aR0YwWVMxMGIyZG5iR1VuS1Z4dVhHNGdJQ0FnSUNCcFppQW9aR0YwWVZSdloyZHNaVUYwZEhJZ0ppWWdaR0YwWVZSdloyZHNaVUYwZEhJZ1BUMDlJRTVCVFVVcElIdGNiaUFnSUNBZ0lDQWdiR1YwSUdsa0lEMGdkR0Z5WjJWMExtZGxkRUYwZEhKcFluVjBaU2duWkdGMFlTMTBZWEpuWlhRbktTQjhmQ0IwWVhKblpYUXVaMlYwUVhSMGNtbGlkWFJsS0Nkb2NtVm1KeWxjYmlBZ0lDQWdJQ0FnYVdRZ1BTQnBaQzV5WlhCc1lXTmxLQ2NqSnl3Z0p5Y3BYRzVjYmlBZ0lDQWdJQ0FnWTI5dWMzUWdZMjl0Y0c5dVpXNTBJRDBnWTI5dGNHOXVaVzUwY3k1bWFXNWtLR01nUFQ0Z1l5NW5aWFJGYkdWdFpXNTBLQ2t1WjJWMFFYUjBjbWxpZFhSbEtDZHBaQ2NwSUQwOVBTQnBaQ2xjYmx4dUlDQWdJQ0FnSUNCcFppQW9JV052YlhCdmJtVnVkQ2tnZTF4dUlDQWdJQ0FnSUNBZ0lISmxkSFZ5Ymx4dUlDQWdJQ0FnSUNCOVhHNWNiaUFnSUNBZ0lDQWdZMjl0Y0c5dVpXNTBMblJ2WjJkc1pTZ3BYRzRnSUNBZ0lDQjlYRzRnSUNBZ2ZTbGNiaUFnZlZ4dVhHNGdJSEpsZEhWeWJpQkRiMnhzWVhCelpWeHVmU2tvS1Z4dVhHNWxlSEJ2Y25RZ1pHVm1ZWFZzZENCRGIyeHNZWEJ6WlZ4dUlpd2lMeW9xWEc0Z0tpQXRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMVnh1SUNvZ1RHbGpaVzV6WldRZ2RXNWtaWElnVFVsVUlDaG9kSFJ3Y3pvdkwyZHBkR2gxWWk1amIyMHZjWFZoY21zdFpHVjJMMUJvYjI1dmJpMUdjbUZ0WlhkdmNtc3ZZbXh2WWk5dFlYTjBaWEl2VEVsRFJVNVRSU2xjYmlBcUlDMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRYRzRnS2k5Y2JtbHRjRzl5ZENCN0lHUnBjM0JoZEdOb1JXeGxiV1Z1ZEVWMlpXNTBMQ0JrYVhOd1lYUmphRmRwYmtSdlkwVjJaVzUwSUgwZ1puSnZiU0FuTGk0dlkyOXRiVzl1TDJWMlpXNTBjeTlrYVhOd1lYUmphQ2RjYm1sdGNHOXlkQ0I3SUdkbGJtVnlZWFJsU1dRZ2ZTQm1jbTl0SUNjdUxpOWpiMjF0YjI0dmRYUnBiSE1uWEc1cGJYQnZjblFnUlhabGJuUWdabkp2YlNBbkxpNHZZMjl0Ylc5dUwyVjJaVzUwY3lkY2JtbHRjRzl5ZENCRGIyMXdiMjVsYm5STllXNWhaMlZ5TENCN0lITmxkRUYwZEhKcFluVjBaWE5EYjI1bWFXY3NJR2RsZEVGMGRISnBZblYwWlhORGIyNW1hV2NnZlNCbWNtOXRJQ2N1TDJOdmJYQnZibVZ1ZEUxaGJtRm5aWEluWEc1Y2JpOHFLbHh1SUNvZ0xTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdFhHNGdLaUJEYkdGemN5QkVaV1pwYm1sMGFXOXVYRzRnS2lBdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMxY2JpQXFMMXh1WEc1bGVIQnZjblFnWkdWbVlYVnNkQ0JqYkdGemN5QkRiMjF3YjI1bGJuUWdlMXh1WEc0Z0lHTnZibk4wY25WamRHOXlLRzVoYldVc0lIWmxjbk5wYjI0c0lHUmxabUYxYkhSUGNIUnBiMjV6SUQwZ2UzMHNJRzl3ZEdsdmJuTWdQU0I3ZlN3Z2IzQjBhVzl1UVhSMGNuTWdQU0JiWFN3Z2MzVndjRzl5ZEVSNWJtRnRhV05GYkdWdFpXNTBJRDBnWm1Gc2MyVXNJR0ZrWkZSdlUzUmhZMnNnUFNCbVlXeHpaU2tnZTF4dUlDQWdJSFJvYVhNdWJtRnRaU0E5SUc1aGJXVmNiaUFnSUNCMGFHbHpMblpsY25OcGIyNGdQU0IyWlhKemFXOXVYRzRnSUNBZ2RHaHBjeTV2Y0hScGIyNXpJRDBnYjNCMGFXOXVjMXh1WEc0Z0lDQWdMeThnUUhSdlpHOGdhMlZsY0Q5Y2JpQWdJQ0F2THlCMGFHbHpMbTl3ZEdsdmJuTWdQU0JQWW1wbFkzUXVZWE56YVdkdUtHUmxabUYxYkhSUGNIUnBiMjV6TENCdmNIUnBiMjV6S1Z4dUlDQWdJRTlpYW1WamRDNXJaWGx6S0dSbFptRjFiSFJQY0hScGIyNXpLUzVtYjNKRllXTm9LQ2h3Y205d0tTQTlQaUI3WEc0Z0lDQWdJQ0JwWmlBb2RIbHdaVzltSUhSb2FYTXViM0IwYVc5dWMxdHdjbTl3WFNBOVBUMGdKM1Z1WkdWbWFXNWxaQ2NwSUh0Y2JpQWdJQ0FnSUNBZ2RHaHBjeTV2Y0hScGIyNXpXM0J5YjNCZElEMGdaR1ZtWVhWc2RFOXdkR2x2Ym5OYmNISnZjRjFjYmlBZ0lDQWdJSDFjYmlBZ0lDQjlLVnh1WEc0Z0lDQWdkR2hwY3k1dmNIUnBiMjVCZEhSeWN5QTlJRzl3ZEdsdmJrRjBkSEp6WEc0Z0lDQWdkR2hwY3k1emRYQndiM0owUkhsdVlXMXBZMFZzWlcxbGJuUWdQU0J6ZFhCd2IzSjBSSGx1WVcxcFkwVnNaVzFsYm5SY2JpQWdJQ0IwYUdsekxtRmtaRlJ2VTNSaFkyc2dQU0JoWkdSVWIxTjBZV05yWEc0Z0lDQWdkR2hwY3k1cFpDQTlJR2RsYm1WeVlYUmxTV1FvS1Z4dVhHNGdJQ0FnWTI5dWMzUWdZMmhsWTJ0RmJHVnRaVzUwSUQwZ0lYUm9hWE11YzNWd2NHOXlkRVI1Ym1GdGFXTkZiR1Z0Wlc1MElIeDhJSFJvYVhNdWIzQjBhVzl1Y3k1bGJHVnRaVzUwSUNFOVBTQnVkV3hzWEc1Y2JpQWdJQ0JwWmlBb2RIbHdaVzltSUhSb2FYTXViM0IwYVc5dWN5NWxiR1Z0Wlc1MElEMDlQU0FuYzNSeWFXNW5KeWtnZTF4dUlDQWdJQ0FnZEdocGN5NXZjSFJwYjI1ekxtVnNaVzFsYm5RZ1BTQmtiMk4xYldWdWRDNXhkV1Z5ZVZObGJHVmpkRzl5S0hSb2FYTXViM0IwYVc5dWN5NWxiR1Z0Wlc1MEtWeHVJQ0FnSUgxY2JseHVJQ0FnSUdsbUlDaGphR1ZqYTBWc1pXMWxiblFnSmlZZ0lYUm9hWE11YjNCMGFXOXVjeTVsYkdWdFpXNTBLU0I3WEc0Z0lDQWdJQ0IwYUhKdmR5QnVaWGNnUlhKeWIzSW9ZQ1I3ZEdocGN5NXVZVzFsZlM0Z1ZHaGxJR1ZzWlcxbGJuUWdhWE1nYm05MElHRWdTRlJOVEVWc1pXMWxiblF1WUNsY2JpQWdJQ0I5WEc1Y2JpQWdJQ0IwYUdsekxtUjVibUZ0YVdORmJHVnRaVzUwSUQwZ2RHaHBjeTV2Y0hScGIyNXpMbVZzWlcxbGJuUWdQVDA5SUc1MWJHeGNiaUFnSUNCMGFHbHpMbkpsWjJsemRHVnlaV1JGYkdWdFpXNTBjeUE5SUZ0ZFhHNWNiaUFnSUNCcFppQW9JWFJvYVhNdVpIbHVZVzFwWTBWc1pXMWxiblFwSUh0Y2JpQWdJQ0FnSUM4cUtseHVJQ0FnSUNBZ0lDb2dhV1lnZEdobElHVnNaVzFsYm5RZ1pYaHBjM1J6TENCM1pTQnlaV0ZrSUhSb1pTQmtZWFJoSUdGMGRISnBZblYwWlhNZ1kyOXVabWxuWEc0Z0lDQWdJQ0FnS2lCMGFHVnVJSGRsSUc5MlpYSjNjbWwwWlNCbGVHbHpkR2x1WnlCamIyNW1hV2NnYTJWNWN5QnBiaUJLWVhaaFUyTnlhWEIwTENCemJ5QjBhR0YwWEc0Z0lDQWdJQ0FnS2lCM1pTQnJaV1Z3SUhSb1pTQm1iMnhzYjNkcGJtY2diM0prWlhKY2JpQWdJQ0FnSUNBcUlGc3hYU0JrWldaaGRXeDBJRXBoZG1GVFkzSnBjSFFnWTI5dVptbG5kWEpoZEdsdmJpQnZaaUIwYUdVZ1kyOXRjRzl1Wlc1MFhHNGdJQ0FnSUNBZ0tpQmJNbDBnUkdGMFlTQmhkSFJ5YVdKMWRHVnpJR052Ym1acFozVnlZWFJwYjI0Z2FXWWdkR2hsSUdWc1pXMWxiblFnWlhocGMzUnpJR2x1SUhSb1pTQkVUMDFjYmlBZ0lDQWdJQ0FxSUZzelhTQktZWFpoVTJOeWFYQjBJR052Ym1acFozVnlZWFJwYjI1Y2JpQWdJQ0FnSUNBcUwxeHVJQ0FnSUNBZ2RHaHBjeTV2Y0hScGIyNXpJRDBnVDJKcVpXTjBMbUZ6YzJsbmJpaDBhR2x6TG05d2RHbHZibk1zSUhSb2FYTXVZWE56YVdkdVNuTkRiMjVtYVdjb2RHaHBjeTVuWlhSQmRIUnlhV0oxZEdWektDa3NJRzl3ZEdsdmJuTXBLVnh1WEc0Z0lDQWdJQ0F2THlCMGFHVnVMQ0J6WlhRZ2RHaGxJRzVsZHlCa1lYUmhJR0YwZEhKcFluVjBaWE1nZEc4Z2RHaGxJR1ZzWlcxbGJuUmNiaUFnSUNBZ0lIUm9hWE11YzJWMFFYUjBjbWxpZFhSbGN5Z3BYRzRnSUNBZ2ZWeHVYRzRnSUNBZ2RHaHBjeTVsYkdWdFpXNTBUR2x6ZEdWdVpYSWdQU0JsZG1WdWRDQTlQaUIwYUdsekxtOXVRbVZtYjNKbFJXeGxiV1Z1ZEVWMlpXNTBLR1YyWlc1MEtTQWdJQ0FnSUNBZ0lDQmNiaUFnZlZ4dVhHNGdJR0Z6YzJsbmJrcHpRMjl1Wm1sbktHRjBkSEpEYjI1bWFXY3NJRzl3ZEdsdmJuTXBJSHRjYmlBZ0lDQjBhR2x6TG05d2RHbHZia0YwZEhKekxtWnZja1ZoWTJnb0tHdGxlU2tnUFQ0Z2UxeHVJQ0FnSUNBZ2FXWWdLRzl3ZEdsdmJuTmJhMlY1WFNrZ2UxeHVJQ0FnSUNBZ0lDQmhkSFJ5UTI5dVptbG5XMnRsZVYwZ1BTQnZjSFJwYjI1elcydGxlVjFjYmlBZ0lDQWdJSDFjYmlBZ0lDQjlLVnh1WEc0Z0lDQWdjbVYwZFhKdUlHRjBkSEpEYjI1bWFXZGNiaUFnZlZ4dVhHNGdJR2RsZEZabGNuTnBiMjRvS1NCN1hHNGdJQ0FnY21WMGRYSnVJSFJvYVhNdWRtVnljMmx2Ymx4dUlDQjlYRzVjYmlBZ1oyVjBSV3hsYldWdWRDZ3BJSHRjYmlBZ0lDQnlaWFIxY200Z2RHaHBjeTV2Y0hScGIyNXpMbVZzWlcxbGJuUmNiaUFnZlZ4dVhHNGdJR2RsZEVsa0tDa2dlMXh1SUNBZ0lISmxkSFZ5YmlCMGFHbHpMbWxrWEc0Z0lIMWNibHh1SUNCeVpXZHBjM1JsY2tWc1pXMWxiblJ6S0dWc1pXMWxiblJ6S1NCN1hHNGdJQ0FnWld4bGJXVnVkSE11Wm05eVJXRmphQ2hsYkdWdFpXNTBJRDArSUhSb2FYTXVjbVZuYVhOMFpYSkZiR1Z0Wlc1MEtHVnNaVzFsYm5RcEtWeHVJQ0I5WEc1Y2JpQWdjbVZuYVhOMFpYSkZiR1Z0Wlc1MEtHVnNaVzFsYm5RcElIdGNiaUFnSUNCbGJHVnRaVzUwTG5SaGNtZGxkQzVoWkdSRmRtVnVkRXhwYzNSbGJtVnlLR1ZzWlcxbGJuUXVaWFpsYm5Rc0lIUm9hWE11Wld4bGJXVnVkRXhwYzNSbGJtVnlLVnh1SUNBZ0lIUm9hWE11Y21WbmFYTjBaWEpsWkVWc1pXMWxiblJ6TG5CMWMyZ29aV3hsYldWdWRDbGNiaUFnZlZ4dVhHNGdJSFZ1Y21WbmFYTjBaWEpGYkdWdFpXNTBjeWdwSUh0Y2JpQWdJQ0IwYUdsekxuSmxaMmx6ZEdWeVpXUkZiR1Z0Wlc1MGN5NW1iM0pGWVdOb0tDaGxiR1Z0Wlc1MEtTQTlQaUI3WEc0Z0lDQWdJQ0IwYUdsekxuVnVjbVZuYVhOMFpYSkZiR1Z0Wlc1MEtHVnNaVzFsYm5RcFhHNGdJQ0FnZlNsY2JpQWdmVnh1WEc0Z0lIVnVjbVZuYVhOMFpYSkZiR1Z0Wlc1MEtHVnNaVzFsYm5RcElIdGNiaUFnSUNCamIyNXpkQ0J5WldkcGMzUmxjbVZrUld4bGJXVnVkRWx1WkdWNElEMGdkR2hwY3k1eVpXZHBjM1JsY21Wa1JXeGxiV1Z1ZEhOY2JpQWdJQ0FnSUM1bWFXNWtTVzVrWlhnb1pXd2dQVDRnWld3dWRHRnlaMlYwSUQwOVBTQmxiR1Z0Wlc1MExuUmhjbWRsZENBbUppQmxiQzVsZG1WdWRDQTlQVDBnWld4bGJXVnVkQzVsZG1WdWRDbGNibHh1SUNBZ0lHbG1JQ2h5WldkcGMzUmxjbVZrUld4bGJXVnVkRWx1WkdWNElENGdMVEVwSUh0Y2JpQWdJQ0FnSUdWc1pXMWxiblF1ZEdGeVoyVjBMbkpsYlc5MlpVVjJaVzUwVEdsemRHVnVaWElvWld4bGJXVnVkQzVsZG1WdWRDd2dkR2hwY3k1bGJHVnRaVzUwVEdsemRHVnVaWElwWEc0Z0lDQWdJQ0IwYUdsekxuSmxaMmx6ZEdWeVpXUkZiR1Z0Wlc1MGN5NXpjR3hwWTJVb2NtVm5hWE4wWlhKbFpFVnNaVzFsYm5SSmJtUmxlQ3dnTVNsY2JpQWdJQ0I5SUdWc2MyVWdlMXh1SUNBZ0lDQWdZMjl1YzI5c1pTNWxjbkp2Y2loZ1YyRnlibWx1WnlFZ1ZXNXJibTkzYmlCeVpXZHBjM1JsY21Wa0lHVnNaVzFsYm5RNklDUjdaV3hsYldWdWRDNTBZWEpuWlhSOUlIZHBkR2dnWlhabGJuUTZJQ1I3Wld4bGJXVnVkQzVsZG1WdWRIMHVZQ2xjYmlBZ0lDQjlYRzRnSUgxY2JseHVJQ0IwY21sbloyVnlSWFpsYm5Rb1pYWmxiblJPWVcxbExDQmtaWFJoYVd3Z1BTQjdmU3dnYjJKcVpXTjBSWFpsYm5SUGJteDVJRDBnWm1Gc2MyVXBJSHRjYmlBZ0lDQnBaaUFvZEhsd1pXOW1JR1YyWlc1MFRtRnRaU0FoUFQwZ0ozTjBjbWx1WnljcElIdGNiaUFnSUNBZ0lIUm9jbTkzSUc1bGR5QkZjbkp2Y2lnblZHaGxJR1YyWlc1MElHNWhiV1VnYVhNZ2JtOTBJSFpoYkdsa0xpY3BYRzRnSUNBZ2ZWeHVYRzRnSUNBZ2FXWWdLSFJvYVhNdVlXUmtWRzlUZEdGamF5a2dlMXh1SUNBZ0lDQWdhV1lnS0dWMlpXNTBUbUZ0WlNBOVBUMGdSWFpsYm5RdVUwaFBWeWtnZTF4dUlDQWdJQ0FnSUNCRGIyMXdiMjVsYm5STllXNWhaMlZ5TG1Ga1pDaDBhR2x6S1Z4dUlDQWdJQ0FnZlNCbGJITmxJR2xtSUNobGRtVnVkRTVoYldVZ1BUMDlJRVYyWlc1MExraEpSRVVwSUh0Y2JpQWdJQ0FnSUNBZ1EyOXRjRzl1Wlc1MFRXRnVZV2RsY2k1eVpXMXZkbVVvZEdocGN5bGNiaUFnSUNBZ0lIMWNiaUFnSUNCOVhHNWNiaUFnSUNBdkx5QmxkbVZ1ZENCdVlXMWxjeUJqWVc0Z1ltVWdkMmwwYUNCa2IzUWdibTkwWVhScGIyNGdiR2xyWlNCeVpXTnZibTVsWTNScGJtY3VjM1ZqWTJWemMxeHVJQ0FnSUdOdmJuTjBJR1YyWlc1MFRtRnRaVTlpYW1WamRDQTlJR1YyWlc1MFRtRnRaUzV6Y0d4cGRDZ25MaWNwTG5KbFpIVmpaU2dvWVdOakxDQmpkWEp5Wlc1MExDQnBibVJsZUNrZ1BUNGdlMXh1SUNBZ0lDQWdhV1lnS0dsdVpHVjRJRDA5UFNBd0tTQjdYRzRnSUNBZ0lDQWdJSEpsZEhWeWJpQmpkWEp5Wlc1MFhHNGdJQ0FnSUNCOVhHNWNiaUFnSUNBZ0lISmxkSFZ5YmlCaFkyTWdLeUJqZFhKeVpXNTBMbU5vWVhKQmRDZ3dLUzUwYjFWd2NHVnlRMkZ6WlNncElDc2dZM1Z5Y21WdWRDNXpiR2xqWlNneEtWeHVJQ0FnSUgwcFhHNWNiaUFnSUNCamIyNXpkQ0JsZG1WdWRFNWhiV1ZCYkdsaGN5QTlJR0J2YmlSN1pYWmxiblJPWVcxbFQySnFaV04wTG1Ob1lYSkJkQ2d3S1M1MGIxVndjR1Z5UTJGelpTZ3BmU1I3WlhabGJuUk9ZVzFsVDJKcVpXTjBMbk5zYVdObEtERXBmV0JjYmx4dUlDQWdJQzh2SUc5aWFtVmpkQ0JsZG1WdWRGeHVJQ0FnSUdsbUlDaDBlWEJsYjJZZ2RHaHBjeTV2Y0hScGIyNXpXMlYyWlc1MFRtRnRaVTlpYW1WamRGMGdQVDA5SUNkbWRXNWpkR2x2YmljcElIdGNiaUFnSUNBZ0lIUm9hWE11YjNCMGFXOXVjMXRsZG1WdWRFNWhiV1ZQWW1wbFkzUmRMbUZ3Y0d4NUtIUm9hWE1zSUZ0a1pYUmhhV3hkS1Z4dUlDQWdJSDFjYmx4dUlDQWdJR2xtSUNoMGVYQmxiMllnZEdocGN5NXZjSFJwYjI1elcyVjJaVzUwVG1GdFpVRnNhV0Z6WFNBOVBUMGdKMloxYm1OMGFXOXVKeWtnZTF4dUlDQWdJQ0FnZEdocGN5NXZjSFJwYjI1elcyVjJaVzUwVG1GdFpVRnNhV0Z6WFM1aGNIQnNlU2gwYUdsekxDQmJaR1YwWVdsc1hTbGNiaUFnSUNCOVhHNWNiaUFnSUNCcFppQW9iMkpxWldOMFJYWmxiblJQYm14NUtTQjdYRzRnSUNBZ0lDQnlaWFIxY201Y2JpQWdJQ0I5WEc1Y2JpQWdJQ0F2THlCa2IyMGdaWFpsYm5SY2JpQWdJQ0JwWmlBb2RHaHBjeTV2Y0hScGIyNXpMbVZzWlcxbGJuUXBJSHRjYmlBZ0lDQWdJR1JwYzNCaGRHTm9SV3hsYldWdWRFVjJaVzUwS0hSb2FYTXViM0IwYVc5dWN5NWxiR1Z0Wlc1MExDQmxkbVZ1ZEU1aGJXVXNJSFJvYVhNdWJtRnRaU3dnWkdWMFlXbHNLVnh1SUNBZ0lIMGdaV3h6WlNCN1hHNGdJQ0FnSUNCa2FYTndZWFJqYUZkcGJrUnZZMFYyWlc1MEtHVjJaVzUwVG1GdFpTd2dkR2hwY3k1dVlXMWxMQ0JrWlhSaGFXd3BYRzRnSUNBZ2ZWeHVJQ0I5WEc1Y2JpQWdjMlYwUVhSMGNtbGlkWFJsY3lncElIdGNiaUFnSUNCcFppQW9kR2hwY3k1dmNIUnBiMjVCZEhSeWN5NXNaVzVuZEdnZ1BpQXdLU0I3WEc0Z0lDQWdJQ0J6WlhSQmRIUnlhV0oxZEdWelEyOXVabWxuS0hSb2FYTXViM0IwYVc5dWN5NWxiR1Z0Wlc1MExDQjBhR2x6TG05d2RHbHZibk1zSUhSb2FYTXViM0IwYVc5dVFYUjBjbk1wWEc0Z0lDQWdmVnh1SUNCOVhHNWNiaUFnWjJWMFFYUjBjbWxpZFhSbGN5Z3BJSHRjYmlBZ0lDQmpiMjV6ZENCdmNIUnBiMjV6SUQwZ1QySnFaV04wTG1GemMybG5iaWg3ZlN3Z2RHaHBjeTV2Y0hScGIyNXpLVnh1SUNBZ0lISmxkSFZ5YmlCblpYUkJkSFJ5YVdKMWRHVnpRMjl1Wm1sbktIUm9hWE11YjNCMGFXOXVjeTVsYkdWdFpXNTBMQ0J2Y0hScGIyNXpMQ0IwYUdsekxtOXdkR2x2YmtGMGRISnpLVnh1SUNCOVhHNWNiaUFnTHlvcVhHNGdJQ0FxSUhSb1pTQndjbVYyWlc1MFEyeHZjMkZpYkdVZ2JXVjBhRzlrSUcxaGJtRm5aWE1nWTI5dVkzVnljbVZ1WTNrZ1ltVjBkMlZsYmlCaFkzUnBkbVVnWTI5dGNHOXVaVzUwY3k1Y2JpQWdJQ29nUm05eUlHVjRZVzF3YkdVc0lHbG1JSFJvWlhKbElHbHpJR0VnYzJodmQyNGdiMlptTFdOaGJuWmhjeUJoYm1RZ1pHbGhiRzluTENCMGFHVWdiR0Z6ZEZ4dUlDQWdLaUJ6YUc5M2JpQmpiMjF3YjI1bGJuUWdaMkZwYm5NZ2RHaGxJSEJ5YjJObGMzTnBibWNnY0hKcGIzSnBkSGxjYmlBZ0lDb3ZYRzRnSUhCeVpYWmxiblJEYkc5ellXSnNaU2dwSUh0Y2JpQWdJQ0J5WlhSMWNtNGdkR2hwY3k1aFpHUlViMU4wWVdOcklDWW1JQ0ZEYjIxd2IyNWxiblJOWVc1aFoyVnlMbU5zYjNOaFlteGxLSFJvYVhNcFhHNGdJSDFjYmx4dUlDQnZia0psWm05eVpVVnNaVzFsYm5SRmRtVnVkQ2hsZG1WdWRDa2dlMXh1SUNBZ0lHbG1JQ2gwYUdsekxuQnlaWFpsYm5SRGJHOXpZV0pzWlNncEtTQjdYRzRnSUNBZ0lDQnlaWFIxY201Y2JpQWdJQ0I5WEc1Y2JpQWdJQ0IwYUdsekxtOXVSV3hsYldWdWRFVjJaVzUwS0dWMlpXNTBLVnh1SUNCOVhHNWNiaUFnYjI1RmJHVnRaVzUwUlhabGJuUW9aWFpsYm5RcElIdGNiaUFnSUNBdkwxeHVJQ0I5WEc1Y2JpQWdjM1JoZEdsaklHbGtaVzUwYVdacFpYSW9LU0I3WEc0Z0lDQWdjbVYwZFhKdUlIUm9hWE11Ym1GdFpWeHVJQ0I5WEc1Y2JpQWdjM1JoZEdsaklGOUVUMDFKYm5SbGNtWmhZMlVvUTI5dGNHOXVaVzUwUTJ4aGMzTXNJRzl3ZEdsdmJuTXBJSHRjYmlBZ0lDQnlaWFIxY200Z2JtVjNJRU52YlhCdmJtVnVkRU5zWVhOektHOXdkR2x2Ym5NcFhHNGdJSDFjYm4xY2JpSXNJbHh1WTI5dWMzUWdaMlYwUVhSMGNtbGlkWFJsSUQwZ0tHWnBjbk4wTENCelpXTnZibVFwSUQwK0lIdGNiaUFnYVdZZ0tHWnBjbk4wSUQwOVBTQW5KeWtnZTF4dUlDQWdJSEpsZEhWeWJpQmdaR0YwWVMwa2UzTmxZMjl1WkgxZ1hHNGdJSDFjYmlBZ2NtVjBkWEp1SUdCa1lYUmhMU1I3Wm1seWMzUjlMU1I3YzJWamIyNWtmV0JjYm4xY2JseHVaWGh3YjNKMElHWjFibU4wYVc5dUlITmxkRUYwZEhKcFluVjBaWE5EYjI1bWFXY29aV3hsYldWdWRDd2diMkpxSUQwZ2UzMHNJR0YwZEhKekxDQnpkR0Z5ZENBOUlDY25LU0I3WEc0Z0lHTnZibk4wSUd0bGVYTWdQU0JQWW1wbFkzUXVhMlY1Y3lodlltb3BYRzVjYmlBZ2EyVjVjeTVtYjNKRllXTm9LQ2hyWlhrcElEMCtJSHRjYmlBZ0lDQnBaaUFvYzNSaGNuUWdQVDA5SUNjbklDWW1JR0YwZEhKekxtbHVaR1Y0VDJZb2EyVjVLU0E5UFQwZ0xURXBJSHRjYmlBZ0lDQWdJQzh2SUdOdmJuUnBiblZsSUhkcGRHZ2dibVY0ZENCcGRHVnlZWFJwYjI1Y2JpQWdJQ0FnSUhKbGRIVnlibHh1SUNBZ0lIMWNibHh1SUNBZ0lHbG1JQ2gwZVhCbGIyWWdiMkpxVzJ0bGVWMGdQVDA5SUNkdlltcGxZM1FuSUNZbUlHOWlhbHRyWlhsZElDRTlQU0J1ZFd4c0tTQjdYRzRnSUNBZ0lDQnNaWFFnYTJWNVUzUmhjblFnUFNCclpYbGNiaUFnSUNBZ0lHbG1JQ2h6ZEdGeWRDQWhQVDBnSnljcElIdGNiaUFnSUNBZ0lDQWdhMlY1VTNSaGNuUWdQU0JnSkh0emRHRnlkSDB0Skh0clpYbDlZRnh1SUNBZ0lDQWdmVnh1WEc0Z0lDQWdJQ0J6WlhSQmRIUnlhV0oxZEdWelEyOXVabWxuS0dWc1pXMWxiblFzSUc5aWFsdHJaWGxkTENCaGRIUnljeXdnYTJWNVUzUmhjblFwWEc0Z0lDQWdJQ0J5WlhSMWNtNWNiaUFnSUNCOVhHNWNiaUFnSUNCamIyNXpkQ0JoZEhSeUlEMGdaMlYwUVhSMGNtbGlkWFJsS0hOMFlYSjBMQ0JyWlhrcFhHNGdJQ0FnWld4bGJXVnVkQzV6WlhSQmRIUnlhV0oxZEdVb1lYUjBjaXdnYjJKcVcydGxlVjBwWEc0Z0lIMHBYRzU5WEc1Y2JtVjRjRzl5ZENCbWRXNWpkR2x2YmlCblpYUkJkSFJ5YVdKMWRHVnpRMjl1Wm1sbktHVnNaVzFsYm5Rc0lHOWlhaUE5SUh0OUxDQmhkSFJ5Y3l3Z2MzUmhjblFnUFNBbkp5a2dlMXh1SUNCamIyNXpkQ0J1WlhkUFltb2dQU0JQWW1wbFkzUXVZWE56YVdkdUtIdDlMQ0J2WW1vcFhHNGdJR052Ym5OMElHdGxlWE1nUFNCUFltcGxZM1F1YTJWNWN5aHZZbW9wWEc1Y2JpQWdhMlY1Y3k1bWIzSkZZV05vS0NoclpYa3BJRDArSUh0Y2JpQWdJQ0JwWmlBb2MzUmhjblFnUFQwOUlDY25JQ1ltSUdGMGRISnpMbWx1WkdWNFQyWW9hMlY1S1NBOVBUMGdMVEVwSUh0Y2JpQWdJQ0FnSUM4dklHTnZiblJwYm5WbElIZHBkR2dnYm1WNGRDQnBkR1Z5WVhScGIyNWNiaUFnSUNBZ0lISmxkSFZ5Ymx4dUlDQWdJSDFjYmx4dUlDQWdJR2xtSUNodlltcGJhMlY1WFNBaFBUMGdiblZzYkNBbUppQnZZbXBiYTJWNVhTNWpiMjV6ZEhKMVkzUnZjaUE5UFQwZ1QySnFaV04wS1NCN1hHNGdJQ0FnSUNCc1pYUWdhMlY1VTNSaGNuUWdQU0JyWlhsY2JpQWdJQ0FnSUdsbUlDaHpkR0Z5ZENBaFBUMGdKeWNwSUh0Y2JpQWdJQ0FnSUNBZ2EyVjVVM1JoY25RZ1BTQmdKSHR6ZEdGeWRIMHRKSHRyWlhsOVlGeHVJQ0FnSUNBZ2ZWeHVYRzRnSUNBZ0lDQnVaWGRQWW1wYmEyVjVYU0E5SUdkbGRFRjBkSEpwWW5WMFpYTkRiMjVtYVdjb1pXeGxiV1Z1ZEN3Z2IySnFXMnRsZVYwc0lHRjBkSEp6TENCclpYbFRkR0Z5ZENsY2JpQWdJQ0FnSUhKbGRIVnlibHh1SUNBZ0lIMWNibHh1SUNBZ0lDOHZJSFZ3WkdGMFpTQjJZV3gxWlZ4dUlDQWdJR3hsZENCMllXeDFaU0E5SUc5aWFsdHJaWGxkSUM4dklHUmxabUYxYkhRZ2RtRnNkV1ZjYmlBZ0lDQmpiMjV6ZENCMGVYQmxJRDBnZEhsd1pXOW1JSFpoYkhWbFhHNGdJQ0FnWTI5dWMzUWdZWFIwY2lBOUlHZGxkRUYwZEhKcFluVjBaU2h6ZEdGeWRDd2dhMlY1S1Z4dUlDQWdJR052Ym5OMElHRjBkSEpXWVd4MVpTQTlJR1ZzWlcxbGJuUXVaMlYwUVhSMGNtbGlkWFJsS0dGMGRISXBYRzVjYmlBZ0lDQnBaaUFvWVhSMGNsWmhiSFZsSUNFOVBTQnVkV3hzS1NCN1hHNGdJQ0FnSUNCcFppQW9kSGx3WlNBOVBUMGdKMkp2YjJ4bFlXNG5LU0I3WEc0Z0lDQWdJQ0FnSUM4dklHTnZiblpsY25RZ2MzUnlhVzVuSUhSdklHSnZiMnhsWVc1Y2JpQWdJQ0FnSUNBZ2RtRnNkV1VnUFNCaGRIUnlWbUZzZFdVZ1BUMDlJQ2QwY25WbEoxeHVJQ0FnSUNBZ2ZTQmxiSE5sSUdsbUlDZ2hhWE5PWVU0b1lYUjBjbFpoYkhWbEtTa2dlMXh1SUNBZ0lDQWdJQ0IyWVd4MVpTQTlJSEJoY25ObFNXNTBLR0YwZEhKV1lXeDFaU3dnTVRBcFhHNGdJQ0FnSUNCOUlHVnNjMlVnZTF4dUlDQWdJQ0FnSUNCMllXeDFaU0E5SUdGMGRISldZV3gxWlZ4dUlDQWdJQ0FnZlZ4dUlDQWdJSDFjYmx4dUlDQWdJRzVsZDA5aWFsdHJaWGxkSUQwZ2RtRnNkV1ZjYmlBZ2ZTbGNibHh1SUNCeVpYUjFjbTRnYm1WM1QySnFYRzU5WEc1Y2JtTnZibk4wSUhOMFlXTnJJRDBnVzExY2JseHVaWGh3YjNKMElHUmxabUYxYkhRZ2UxeHVJQ0JoWkdRb1kyOXRjRzl1Wlc1MEtTQjdYRzRnSUNBZ2MzUmhZMnN1Y0hWemFDaGpiMjF3YjI1bGJuUXBYRzRnSUgwc1hHNGdJSEpsYlc5MlpTaGpiMjF3YjI1bGJuUXBJSHRjYmlBZ0lDQmpiMjV6ZENCcGJtUmxlQ0E5SUhOMFlXTnJMbVpwYm1SSmJtUmxlQ2hqSUQwK0lFOWlhbVZqZEM1cGN5aGpiMjF3YjI1bGJuUXNJR01wS1Z4dUlDQWdJR2xtSUNocGJtUmxlQ0ErSUMweEtTQjdYRzRnSUNBZ0lDQnpkR0ZqYXk1emNHeHBZMlVvYVc1a1pYZ3NJREVwWEc0Z0lDQWdmVnh1SUNCOUxGeHVJQ0JqYkc5ellXSnNaU2hqYjIxd2IyNWxiblFwSUh0Y2JpQWdJQ0J5WlhSMWNtNGdjM1JoWTJzdWJHVnVaM1JvSUQwOVBTQXdJSHg4SUU5aWFtVmpkQzVwY3loemRHRmphMXR6ZEdGamF5NXNaVzVuZEdnZ0xTQXhYU3dnWTI5dGNHOXVaVzUwS1Z4dUlDQjlYRzU5WEc0aUxDSXZLaXBjYmlBcUlDMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRYRzRnS2lCTWFXTmxibk5sWkNCMWJtUmxjaUJOU1ZRZ0tHaDBkSEJ6T2k4dloybDBhSFZpTG1OdmJTOXhkV0Z5YXkxa1pYWXZVR2h2Ym05dUxVWnlZVzFsZDI5eWF5OWliRzlpTDIxaGMzUmxjaTlNU1VORlRsTkZLVnh1SUNvZ0xTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMWNiaUFxTDF4dWFXMXdiM0owSUVWMlpXNTBJR1p5YjIwZ0p5NHVMeTR1TDJOdmJXMXZiaTlsZG1WdWRITW5YRzVwYlhCdmNuUWdRMjl0Y0c5dVpXNTBJR1p5YjIwZ0p5NHVMMk52YlhCdmJtVnVkQ2RjYm1sdGNHOXlkQ0I3SUdkbGRFRjBkSEpwWW5WMFpYTkRiMjVtYVdjZ2ZTQm1jbTl0SUNjdUxpOWpiMjF3YjI1bGJuUk5ZVzVoWjJWeUoxeHVYRzVqYjI1emRDQkVhV0ZzYjJjZ1BTQW9LQ2tnUFQ0Z2UxeHVJQ0F2S2lwY2JpQWdJQ29nTFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0WEc0Z0lDQXFJRU52Ym5OMFlXNTBjMXh1SUNBZ0tpQXRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMWNiaUFnSUNvdlhHNWNiaUFnWTI5dWMzUWdUa0ZOUlNBOUlDZGthV0ZzYjJjblhHNGdJR052Ym5OMElGWkZVbE5KVDA0Z1BTQW5NaTR3TGpBblhHNGdJR052Ym5OMElFSkJRMHRFVWs5UVgxTkZURVZEVkU5U0lEMGdKMlJwWVd4dlp5MWlZV05yWkhKdmNDZGNiaUFnWTI5dWMzUWdSRVZHUVZWTVZGOVFVazlRUlZKVVNVVlRJRDBnZTF4dUlDQWdJR1ZzWlcxbGJuUTZJRzUxYkd3c1hHNGdJQ0FnZEdsMGJHVTZJRzUxYkd3c1hHNGdJQ0FnYldWemMyRm5aVG9nYm5Wc2JDeGNiaUFnSUNCallXNWpaV3hoWW14bE9pQjBjblZsTEZ4dUlDQjlYRzRnSUdOdmJuTjBJRVJCVkVGZlFWUlVVbE5mVUZKUFVFVlNWRWxGVXlBOUlGdGNiaUFnSUNBblkyRnVZMlZzWVdKc1pTY3NYRzRnSUYxY2JseHVJQ0F2S2lwY2JpQWdJQ29nTFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0WEc0Z0lDQXFJRU5zWVhOeklFUmxabWx1YVhScGIyNWNiaUFnSUNvZ0xTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdFhHNGdJQ0FxTDF4dVhHNGdJR05zWVhOeklFUnBZV3h2WnlCbGVIUmxibVJ6SUVOdmJYQnZibVZ1ZENCN1hHNWNiaUFnSUNCamIyNXpkSEoxWTNSdmNpaHZjSFJwYjI1eklEMGdlMzBzSUhSbGJYQnNZWFJsSUQwZ2JuVnNiQ2tnZTF4dUlDQWdJQ0FnYzNWd1pYSW9Ua0ZOUlN3Z1ZrVlNVMGxQVGl3Z1JFVkdRVlZNVkY5UVVrOVFSVkpVU1VWVExDQnZjSFJwYjI1ekxDQkVRVlJCWDBGVVZGSlRYMUJTVDFCRlVsUkpSVk1zSUhSeWRXVXNJSFJ5ZFdVcFhHNWNiaUFnSUNBZ0lIUm9hWE11ZEdWdGNHeGhkR1VnUFNCMFpXMXdiR0YwWlNCOGZDQW5KeUFyWEc0Z0lDQWdJQ0FuUEdScGRpQmpiR0Z6Y3oxY0ltUnBZV3h2WjF3aUlIUmhZbWx1WkdWNFBWd2lMVEZjSWlCeWIyeGxQVndpWkdsaGJHOW5YQ0krSnlBclhHNGdJQ0FnSUNBZ0lDYzhaR2wySUdOc1lYTnpQVndpWkdsaGJHOW5MV2x1Ym1WeVhDSWdjbTlzWlQxY0ltUnZZM1Z0Wlc1MFhDSStKeUFyWEc0Z0lDQWdJQ0FnSUNBZ0p6eGthWFlnWTJ4aGMzTTlYQ0prYVdGc2IyY3RZMjl1ZEdWdWRGd2lQaWNnSzF4dUlDQWdJQ0FnSUNBZ0lDQWdKenhrYVhZZ1kyeGhjM005WENKa2FXRnNiMmN0YUdWaFpHVnlYQ0krSnlBclhHNGdJQ0FnSUNBZ0lDQWdJQ0FnSUNjOGFEVWdZMnhoYzNNOVhDSmthV0ZzYjJjdGRHbDBiR1ZjSWo0OEwyZzFQaWNnSzF4dUlDQWdJQ0FnSUNBZ0lDQWdKend2WkdsMlBpY2dLMXh1SUNBZ0lDQWdJQ0FnSUNBZ0p6eGthWFlnWTJ4aGMzTTlYQ0prYVdGc2IyY3RZbTlrZVZ3aVBpY2dLMXh1SUNBZ0lDQWdJQ0FnSUNBZ0lDQW5QSEErUEM5d1BpY2dLMXh1SUNBZ0lDQWdJQ0FnSUNBZ0p6d3ZaR2wyUGljZ0sxeHVJQ0FnSUNBZ0lDQWdJQ0FnSnp4a2FYWWdZMnhoYzNNOVhDSmthV0ZzYjJjdFptOXZkR1Z5WENJK0p5QXJYRzRnSUNBZ0lDQWdJQ0FnSUNBZ0lDYzhZblYwZEc5dUlIUjVjR1U5WENKaWRYUjBiMjVjSWlCamJHRnpjejFjSW1KMGJpQmlkRzR0Y0hKcGJXRnllVndpSUdSaGRHRXRaR2x6YldsemN6MWNJbVJwWVd4dloxd2lQazlyUEM5aWRYUjBiMjQrSnlBclhHNGdJQ0FnSUNBZ0lDQWdJQ0FuUEM5a2FYWStKeUFyWEc0Z0lDQWdJQ0FnSUNBZ0p6d3ZaR2wyUGljZ0sxeHVJQ0FnSUNBZ0lDQW5QQzlrYVhZK0p5QXJYRzRnSUNBZ0lDQW5QQzlrYVhZK0oxeHVYRzRnSUNBZ0lDQnBaaUFvZEdocGN5NWtlVzVoYldsalJXeGxiV1Z1ZENrZ2UxeHVJQ0FnSUNBZ0lDQjBhR2x6TG1KMWFXeGtLQ2xjYmlBZ0lDQWdJSDFjYmlBZ0lDQjlYRzVjYmlBZ0lDQmlkV2xzWkNncElIdGNiaUFnSUNBZ0lHTnZibk4wSUdKMWFXeGtaWElnUFNCa2IyTjFiV1Z1ZEM1amNtVmhkR1ZGYkdWdFpXNTBLQ2RrYVhZbktWeHVYRzRnSUNBZ0lDQmlkV2xzWkdWeUxtbHVibVZ5U0ZSTlRDQTlJSFJvYVhNdWRHVnRjR3hoZEdWY2JseHVJQ0FnSUNBZ2RHaHBjeTV2Y0hScGIyNXpMbVZzWlcxbGJuUWdQU0JpZFdsc1pHVnlMbVpwY25OMFEyaHBiR1JjYmx4dUlDQWdJQ0FnTHk4Z2RHbDBiR1ZjYmlBZ0lDQWdJR2xtSUNoMGFHbHpMbTl3ZEdsdmJuTXVkR2wwYkdVZ0lUMDlJRzUxYkd3cElIdGNiaUFnSUNBZ0lDQWdkR2hwY3k1dmNIUnBiMjV6TG1Wc1pXMWxiblF1Y1hWbGNubFRaV3hsWTNSdmNpZ25MbVJwWVd4dlp5MTBhWFJzWlNjcExtbHVibVZ5U0ZSTlRDQTlJSFJvYVhNdWIzQjBhVzl1Y3k1MGFYUnNaVnh1SUNBZ0lDQWdmVnh1WEc0Z0lDQWdJQ0F2THlCdFpYTnpZV2RsWEc0Z0lDQWdJQ0JwWmlBb2RHaHBjeTV2Y0hScGIyNXpMbTFsYzNOaFoyVWdJVDA5SUc1MWJHd3BJSHRjYmlBZ0lDQWdJQ0FnZEdocGN5NXZjSFJwYjI1ekxtVnNaVzFsYm5RdWNYVmxjbmxUWld4bFkzUnZjaWduTG1ScFlXeHZaeTFpYjJSNUp5a3VabWx5YzNSRGFHbHNaQzVwYm01bGNraFVUVXdnUFNCMGFHbHpMbTl3ZEdsdmJuTXViV1Z6YzJGblpWeHVJQ0FnSUNBZ2ZWeHVYRzRnSUNBZ0lDQmtiMk4xYldWdWRDNWliMlI1TG1Gd2NHVnVaRU5vYVd4a0tIUm9hWE11YjNCMGFXOXVjeTVsYkdWdFpXNTBLVnh1WEc0Z0lDQWdJQ0IwYUdsekxuTmxkRUYwZEhKcFluVjBaWE1vS1Z4dUlDQWdJSDFjYmx4dUlDQWdJR0oxYVd4a1FtRmphMlJ5YjNBb0tTQjdYRzRnSUNBZ0lDQmpiMjV6ZENCaVlXTnJaSEp2Y0NBOUlHUnZZM1Z0Wlc1MExtTnlaV0YwWlVWc1pXMWxiblFvSjJScGRpY3BYRzRnSUNBZ0lDQmlZV05yWkhKdmNDNXpaWFJCZEhSeWFXSjFkR1VvSjJSaGRHRXRhV1FuTENCMGFHbHpMbWxrS1Z4dUlDQWdJQ0FnWW1GamEyUnliM0F1WTJ4aGMzTk1hWE4wTG1Ga1pDaENRVU5MUkZKUFVGOVRSVXhGUTFSUFVpbGNibHh1SUNBZ0lDQWdaRzlqZFcxbGJuUXVZbTlrZVM1aGNIQmxibVJEYUdsc1pDaGlZV05yWkhKdmNDbGNiaUFnSUNCOVhHNWNiaUFnSUNCblpYUkNZV05yWkhKdmNDZ3BJSHRjYmlBZ0lDQWdJSEpsZEhWeWJpQmtiMk4xYldWdWRDNXhkV1Z5ZVZObGJHVmpkRzl5S0dBdUpIdENRVU5MUkZKUFVGOVRSVXhGUTFSUFVuMWJaR0YwWVMxcFpEMWNJaVI3ZEdocGN5NXBaSDFjSWwxZ0tWeHVJQ0FnSUgxY2JseHVJQ0FnSUdObGJuUmxjaWdwSUh0Y2JpQWdJQ0FnSUdOdmJuTjBJR052YlhCMWRHVmtVM1I1YkdVZ1BTQjNhVzVrYjNjdVoyVjBRMjl0Y0hWMFpXUlRkSGxzWlNoMGFHbHpMbTl3ZEdsdmJuTXVaV3hsYldWdWRDbGNiaUFnSUNBZ0lDOHZJR052Ym5OMElIZHBaSFJvSUQwZ1kyOXRjSFYwWldSVGRIbHNaUzUzYVdSMGFDNXpiR2xqWlNnd0xDQmpiMjF3ZFhSbFpGTjBlV3hsTG5kcFpIUm9MbXhsYm1kMGFDQXRJRElwWEc0Z0lDQWdJQ0JqYjI1emRDQm9aV2xuYUhRZ1BTQmpiMjF3ZFhSbFpGTjBlV3hsTG1obGFXZG9kQzV6YkdsalpTZ3dMQ0JqYjIxd2RYUmxaRk4wZVd4bExtaGxhV2RvZEM1c1pXNW5kR2dnTFNBeUtWeHVYRzRnSUNBZ0lDQmpiMjV6ZENCMGIzQWdQU0FvZDJsdVpHOTNMbWx1Ym1WeVNHVnBaMmgwSUM4Z01pa2dMU0FvYUdWcFoyaDBJQzhnTWlsY2JpQWdJQ0FnSUhSb2FYTXViM0IwYVc5dWN5NWxiR1Z0Wlc1MExuTjBlV3hsTG5SdmNDQTlJR0FrZTNSdmNIMXdlR0JjYmlBZ0lDQjlYRzVjYmlBZ0lDQnphRzkzS0NrZ2UxeHVJQ0FnSUNBZ2FXWWdLSFJvYVhNdWIzQjBhVzl1Y3k1bGJHVnRaVzUwSUQwOVBTQnVkV3hzS1NCN1hHNGdJQ0FnSUNBZ0lDOHZJR0oxYVd4a0lHRnVaQ0JwYm5ObGNuUWdZU0J1WlhjZ1JFOU5JR1ZzWlcxbGJuUmNiaUFnSUNBZ0lDQWdkR2hwY3k1aWRXbHNaQ2dwWEc0Z0lDQWdJQ0I5WEc1Y2JpQWdJQ0FnSUdsbUlDaDBhR2x6TG05d2RHbHZibk11Wld4bGJXVnVkQzVqYkdGemMweHBjM1F1WTI5dWRHRnBibk1vSjNOb2IzY25LU2tnZTF4dUlDQWdJQ0FnSUNCeVpYUjFjbTRnWm1Gc2MyVmNiaUFnSUNBZ0lIMWNibHh1SUNBZ0lDQWdMeThnWVdSa0lHRWdkR2x0Wlc5MWRDQnpieUIwYUdGMElIUm9aU0JEVTFNZ1lXNXBiV0YwYVc5dUlIZHZjbXR6WEc0Z0lDQWdJQ0J6WlhSVWFXMWxiM1YwS0NncElEMCtJSHRjYmlBZ0lDQWdJQ0FnZEdocGN5NTBjbWxuWjJWeVJYWmxiblFvUlhabGJuUXVVMGhQVnlsY2JpQWdJQ0FnSUNBZ2RHaHBjeTVpZFdsc1pFSmhZMnRrY205d0tDbGNibHh1SUNBZ0lDQWdJQ0JqYjI1emRDQnZibE5vYjNkdUlEMGdLQ2tnUFQ0Z2UxeHVJQ0FnSUNBZ0lDQWdJSFJvYVhNdWRISnBaMmRsY2tWMlpXNTBLRVYyWlc1MExsTklUMWRPS1Z4dUlDQWdJQ0FnSUNBZ0lIUm9hWE11YjNCMGFXOXVjeTVsYkdWdFpXNTBMbkpsYlc5MlpVVjJaVzUwVEdsemRHVnVaWElvUlhabGJuUXVWRkpCVGxOSlZFbFBUbDlGVGtRc0lHOXVVMmh2ZDI0cFhHNWNiaUFnSUNBZ0lDQWdJQ0F2THlCaGRIUmhZMmdnWlhabGJuUmNiaUFnSUNBZ0lDQWdJQ0IwYUdsekxtRjBkR0ZqYUVWMlpXNTBjeWdwWEc0Z0lDQWdJQ0FnSUgxY2JseHVJQ0FnSUNBZ0lDQjBhR2x6TG05d2RHbHZibk11Wld4bGJXVnVkQzVoWkdSRmRtVnVkRXhwYzNSbGJtVnlLRVYyWlc1MExsUlNRVTVUU1ZSSlQwNWZSVTVFTENCdmJsTm9iM2R1S1Z4dVhHNGdJQ0FnSUNBZ0lIUm9hWE11YjNCMGFXOXVjeTVsYkdWdFpXNTBMbU5zWVhOelRHbHpkQzVoWkdRb0ozTm9iM2NuS1Z4dVhHNGdJQ0FnSUNBZ0lIUm9hWE11WTJWdWRHVnlLQ2xjYmlBZ0lDQWdJSDBzSURFd0tWeHVYRzRnSUNBZ0lDQnlaWFIxY200Z2RISjFaVnh1SUNBZ0lIMWNibHh1SUNBZ0lHOXVSV3hsYldWdWRFVjJaVzUwS0dWMlpXNTBLU0I3WEc0Z0lDQWdJQ0JwWmlBb1pYWmxiblF1ZEhsd1pTQTlQVDBnSjJ0bGVYVndKeUFtSmlCbGRtVnVkQzVyWlhsRGIyUmxJQ0U5UFNBeU55QW1KaUJsZG1WdWRDNXJaWGxEYjJSbElDRTlQU0F4TXlrZ2UxeHVJQ0FnSUNBZ0lDQnlaWFIxY201Y2JpQWdJQ0FnSUgxY2JseHVJQ0FnSUNBZ0x5OGdhR2xrWlNCMGFHVWdaR2xoYkc5blhHNGdJQ0FnSUNCMGFHbHpMbWhwWkdVb0tWeHVJQ0FnSUgxY2JseHVJQ0FnSUdocFpHVW9LU0I3WEc0Z0lDQWdJQ0JwWmlBb0lYUm9hWE11YjNCMGFXOXVjeTVsYkdWdFpXNTBMbU5zWVhOelRHbHpkQzVqYjI1MFlXbHVjeWduYzJodmR5Y3BLU0I3WEc0Z0lDQWdJQ0FnSUhKbGRIVnliaUJtWVd4elpWeHVJQ0FnSUNBZ2ZWeHVYRzRnSUNBZ0lDQjBhR2x6TG5SeWFXZG5aWEpGZG1WdWRDaEZkbVZ1ZEM1SVNVUkZLVnh1WEc0Z0lDQWdJQ0IwYUdsekxtUmxkR0ZqYUVWMlpXNTBjeWdwWEc1Y2JpQWdJQ0FnSUhSb2FYTXViM0IwYVc5dWN5NWxiR1Z0Wlc1MExtTnNZWE56VEdsemRDNWhaR1FvSjJocFpHVW5LVnh1SUNBZ0lDQWdkR2hwY3k1dmNIUnBiMjV6TG1Wc1pXMWxiblF1WTJ4aGMzTk1hWE4wTG5KbGJXOTJaU2duYzJodmR5Y3BYRzVjYmlBZ0lDQWdJR052Ym5OMElHSmhZMnRrY205d0lEMGdkR2hwY3k1blpYUkNZV05yWkhKdmNDZ3BYRzVjYmlBZ0lDQWdJR052Ym5OMElHOXVTR2xrWkdWdUlEMGdLQ2tnUFQ0Z2UxeHVJQ0FnSUNBZ0lDQmtiMk4xYldWdWRDNWliMlI1TG5KbGJXOTJaVU5vYVd4a0tHSmhZMnRrY205d0tWeHVYRzRnSUNBZ0lDQWdJSFJvYVhNdWIzQjBhVzl1Y3k1bGJHVnRaVzUwTG1Oc1lYTnpUR2x6ZEM1eVpXMXZkbVVvSjJocFpHVW5LVnh1WEc0Z0lDQWdJQ0FnSUhSb2FYTXVkSEpwWjJkbGNrVjJaVzUwS0VWMlpXNTBMa2hKUkVSRlRpbGNibHh1SUNBZ0lDQWdJQ0JpWVdOclpISnZjQzV5WlcxdmRtVkZkbVZ1ZEV4cGMzUmxibVZ5S0VWMlpXNTBMbFJTUVU1VFNWUkpUMDVmUlU1RUxDQnZia2hwWkdSbGJpbGNibHh1SUNBZ0lDQWdJQ0F2THlCeVpXMXZkbVVnWjJWdVpYSmhkR1ZrSUdScFlXeHZaM01nWm5KdmJTQjBhR1VnUkU5TlhHNGdJQ0FnSUNBZ0lHbG1JQ2gwYUdsekxtUjVibUZ0YVdORmJHVnRaVzUwS1NCN1hHNGdJQ0FnSUNBZ0lDQWdaRzlqZFcxbGJuUXVZbTlrZVM1eVpXMXZkbVZEYUdsc1pDaDBhR2x6TG05d2RHbHZibk11Wld4bGJXVnVkQ2xjYmlBZ0lDQWdJQ0FnSUNCMGFHbHpMbTl3ZEdsdmJuTXVaV3hsYldWdWRDQTlJRzUxYkd4Y2JpQWdJQ0FnSUNBZ2ZWeHVJQ0FnSUNBZ2ZWeHVYRzRnSUNBZ0lDQmlZV05yWkhKdmNDNWhaR1JGZG1WdWRFeHBjM1JsYm1WeUtFVjJaVzUwTGxSU1FVNVRTVlJKVDA1ZlJVNUVMQ0J2YmtocFpHUmxiaWxjYmlBZ0lDQWdJR0poWTJ0a2NtOXdMbU5zWVhOelRHbHpkQzVoWkdRb0oyWmhaR1Z2ZFhRbktWeHVYRzRnSUNBZ0lDQnlaWFIxY200Z2RISjFaVnh1SUNBZ0lIMWNibHh1SUNBZ0lHRjBkR0ZqYUVWMlpXNTBjeWdwSUh0Y2JpQWdJQ0FnSUdOdmJuTjBJR1JwYzIxcGMzTkNkWFIwYjI1eklEMGdkR2hwY3k1dmNIUnBiMjV6TG1Wc1pXMWxiblF1Y1hWbGNubFRaV3hsWTNSdmNrRnNiQ2duVzJSaGRHRXRaR2x6YldsemMxMG5LVnh1SUNBZ0lDQWdhV1lnS0dScGMyMXBjM05DZFhSMGIyNXpLU0I3WEc0Z0lDQWdJQ0FnSUVGeWNtRjVMbVp5YjIwb1pHbHpiV2x6YzBKMWRIUnZibk1wTG1admNrVmhZMmdvWW5WMGRHOXVJRDArSUhSb2FYTXVjbVZuYVhOMFpYSkZiR1Z0Wlc1MEtIc2dkR0Z5WjJWME9pQmlkWFIwYjI0c0lHVjJaVzUwT2lBblkyeHBZMnNuSUgwcEtWeHVJQ0FnSUNBZ2ZWeHVYRzRnSUNBZ0lDQXZMeUJoWkdRZ1pYWmxiblJ6SUdsbUlIUm9aU0JrYVdGc2IyY2dhWE1nWTJGdVkyVnNZV0pzWlZ4dUlDQWdJQ0FnTHk4Z2QyaHBZMmdnYldWaGJuTWdkR2hsSUhWelpYSWdZMkZ1SUdocFpHVWdkR2hsSUdScFlXeHZaMXh1SUNBZ0lDQWdMeThnWW5rZ2NISmxjM05wYm1jZ2RHaGxJRVZUUXlCclpYa2diM0lnWTJ4cFkyc2diM1YwYzJsa1pTQjBhR1VnWW1GamEyUnliM0JjYmlBZ0lDQWdJR2xtSUNoMGFHbHpMbTl3ZEdsdmJuTXVZMkZ1WTJWc1lXSnNaU2tnZTF4dUlDQWdJQ0FnSUNCamIyNXpkQ0JpWVdOclpISnZjQ0E5SUhSb2FYTXVaMlYwUW1GamEyUnliM0FvS1Z4dUlDQWdJQ0FnSUNCMGFHbHpMbkpsWjJsemRHVnlSV3hsYldWdWRDaDdJSFJoY21kbGREb2dZbUZqYTJSeWIzQXNJR1YyWlc1ME9pQkZkbVZ1ZEM1VFZFRlNWQ0I5S1Z4dUlDQWdJQ0FnSUNCMGFHbHpMbkpsWjJsemRHVnlSV3hsYldWdWRDaDdJSFJoY21kbGREb2daRzlqZFcxbGJuUXNJR1YyWlc1ME9pQW5hMlY1ZFhBbklIMHBYRzRnSUNBZ0lDQjlYRzRnSUNBZ2ZWeHVYRzRnSUNBZ1pHVjBZV05vUlhabGJuUnpLQ2tnZTF4dUlDQWdJQ0FnWTI5dWMzUWdaR2x6YldsemMwSjFkSFJ2Ym5NZ1BTQjBhR2x6TG05d2RHbHZibk11Wld4bGJXVnVkQzV4ZFdWeWVWTmxiR1ZqZEc5eVFXeHNLQ2RiWkdGMFlTMWthWE50YVhOelhTY3BYRzRnSUNBZ0lDQnBaaUFvWkdsemJXbHpjMEoxZEhSdmJuTXBJSHRjYmlBZ0lDQWdJQ0FnUVhKeVlYa3Vabkp2YlNoa2FYTnRhWE56UW5WMGRHOXVjeWt1Wm05eVJXRmphQ2hpZFhSMGIyNGdQVDRnZEdocGN5NTFibkpsWjJsemRHVnlSV3hsYldWdWRDaDdJSFJoY21kbGREb2dZblYwZEc5dUxDQmxkbVZ1ZERvZ0oyTnNhV05ySnlCOUtTbGNiaUFnSUNBZ0lIMWNibHh1SUNBZ0lDQWdhV1lnS0hSb2FYTXViM0IwYVc5dWN5NWpZVzVqWld4aFlteGxLU0I3WEc0Z0lDQWdJQ0FnSUdOdmJuTjBJR0poWTJ0a2NtOXdJRDBnZEdocGN5NW5aWFJDWVdOclpISnZjQ2dwWEc0Z0lDQWdJQ0FnSUhSb2FYTXVkVzV5WldkcGMzUmxja1ZzWlcxbGJuUW9leUIwWVhKblpYUTZJR0poWTJ0a2NtOXdMQ0JsZG1WdWREb2dSWFpsYm5RdVUxUkJVbFFnZlNsY2JpQWdJQ0FnSUNBZ2RHaHBjeTUxYm5KbFoybHpkR1Z5Uld4bGJXVnVkQ2g3SUhSaGNtZGxkRG9nWkc5amRXMWxiblFzSUdWMlpXNTBPaUFuYTJWNWRYQW5JSDBwWEc0Z0lDQWdJQ0I5WEc0Z0lDQWdmVnh1WEc0Z0lDQWdjM1JoZEdsaklHbGtaVzUwYVdacFpYSW9LU0I3WEc0Z0lDQWdJQ0J5WlhSMWNtNGdUa0ZOUlZ4dUlDQWdJSDFjYmx4dUlDQWdJSE4wWVhScFl5QmZSRTlOU1c1MFpYSm1ZV05sS0c5d2RHbHZibk1wSUh0Y2JpQWdJQ0FnSUhKbGRIVnliaUJ6ZFhCbGNpNWZSRTlOU1c1MFpYSm1ZV05sS0VScFlXeHZaeXdnYjNCMGFXOXVjeWxjYmlBZ0lDQjlYRzRnSUgxY2JseHVJQ0F2S2lwY2JpQWdJQ29nTFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0WEc0Z0lDQXFJRVJQVFNCQmNHa2dhVzF3YkdWdFpXNTBZWFJwYjI1Y2JpQWdJQ29nTFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0WEc0Z0lDQXFMMXh1SUNCamIyNXpkQ0JqYjIxd2IyNWxiblJ6SUQwZ1cxMWNibHh1SUNCamIyNXpkQ0JrYVdGc2IyZHpJRDBnWkc5amRXMWxiblF1Y1hWbGNubFRaV3hsWTNSdmNrRnNiQ2hnTGlSN1RrRk5SWDFnS1Z4dUlDQnBaaUFvWkdsaGJHOW5jeWtnZTF4dUlDQWdJRUZ5Y21GNUxtWnliMjBvWkdsaGJHOW5jeWt1Wm05eVJXRmphQ2dvWld4bGJXVnVkQ2tnUFQ0Z2UxeHVJQ0FnSUNBZ1kyOXVjM1FnWTI5dVptbG5JRDBnWjJWMFFYUjBjbWxpZFhSbGMwTnZibVpwWnlobGJHVnRaVzUwTENCRVJVWkJWVXhVWDFCU1QxQkZVbFJKUlZNc0lFUkJWRUZmUVZSVVVsTmZVRkpQVUVWU1ZFbEZVeWxjYmlBZ0lDQWdJR052Ym1acFp5NWxiR1Z0Wlc1MElEMGdaV3hsYldWdWRGeHVYRzRnSUNBZ0lDQmpiMjF3YjI1bGJuUnpMbkIxYzJnb2V5QmxiR1Z0Wlc1MExDQmthV0ZzYjJjNklHNWxkeUJFYVdGc2IyY29ZMjl1Wm1sbktTQjlLVnh1SUNBZ0lIMHBYRzRnSUgxY2JseHVJQ0JwWmlBb1pHbGhiRzluY3lrZ2UxeHVJQ0FnSUdSdlkzVnRaVzUwTG1Ga1pFVjJaVzUwVEdsemRHVnVaWElvSjJOc2FXTnJKeXdnS0dWMlpXNTBLU0E5UGlCN1hHNGdJQ0FnSUNCamIyNXpkQ0JrWVhSaFZHOW5aMnhsUVhSMGNpQTlJR1YyWlc1MExuUmhjbWRsZEM1blpYUkJkSFJ5YVdKMWRHVW9KMlJoZEdFdGRHOW5aMnhsSnlsY2JpQWdJQ0FnSUdsbUlDaGtZWFJoVkc5bloyeGxRWFIwY2lBbUppQmtZWFJoVkc5bloyeGxRWFIwY2lBOVBUMGdUa0ZOUlNrZ2UxeHVJQ0FnSUNBZ0lDQmpiMjV6ZENCcFpDQTlJR1YyWlc1MExuUmhjbWRsZEM1blpYUkJkSFJ5YVdKMWRHVW9KMlJoZEdFdGRHRnlaMlYwSnlsY2JpQWdJQ0FnSUNBZ1kyOXVjM1FnWld4bGJXVnVkQ0E5SUdSdlkzVnRaVzUwTG5GMVpYSjVVMlZzWldOMGIzSW9hV1FwWEc1Y2JpQWdJQ0FnSUNBZ1kyOXVjM1FnWTI5dGNHOXVaVzUwSUQwZ1kyOXRjRzl1Wlc1MGN5NW1hVzVrS0dNZ1BUNGdZeTVsYkdWdFpXNTBJRDA5UFNCbGJHVnRaVzUwS1Z4dVhHNGdJQ0FnSUNBZ0lHbG1JQ2doWTI5dGNHOXVaVzUwS1NCN1hHNGdJQ0FnSUNBZ0lDQWdjbVYwZFhKdVhHNGdJQ0FnSUNBZ0lIMWNibHh1SUNBZ0lDQWdJQ0F2THlCeVpXMXZkbVVnZEdobElHWnZZM1Z6SUhOMFlYUmxJRzltSUhSb1pTQjBjbWxuWjJWeVhHNGdJQ0FnSUNBZ0lHVjJaVzUwTG5SaGNtZGxkQzVpYkhWeUtDbGNibHh1SUNBZ0lDQWdJQ0JqYjIxd2IyNWxiblF1WkdsaGJHOW5Mbk5vYjNjb0tWeHVJQ0FnSUNBZ2ZWeHVJQ0FnSUgwcFhHNGdJSDFjYmx4dUlDQnlaWFIxY200Z1JHbGhiRzluWEc1OUtTZ3BYRzVjYm1WNGNHOXlkQ0JrWldaaGRXeDBJRVJwWVd4dloxeHVJaXdpTHlvcVhHNGdLaUF0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFZ4dUlDb2dUR2xqWlc1elpXUWdkVzVrWlhJZ1RVbFVJQ2hvZEhSd2N6b3ZMMmRwZEdoMVlpNWpiMjB2Y1hWaGNtc3RaR1YyTDFCb2IyNXZiaTFHY21GdFpYZHZjbXN2WW14dllpOXRZWE4wWlhJdlRFbERSVTVUUlNsY2JpQXFJQzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0WEc0Z0tpOWNibWx0Y0c5eWRDQkVhV0ZzYjJjZ1puSnZiU0FuTGk5cGJtUmxlQ2RjYm1sdGNHOXlkQ0I3SUdacGJtUlVZWEpuWlhSQ2VVTnNZWE56SUgwZ1puSnZiU0FuTGk0dkxpNHZZMjl0Ylc5dUwzVjBhV3h6SjF4dWFXMXdiM0owSUhzZ1oyVjBRWFIwY21saWRYUmxjME52Ym1acFp5QjlJR1p5YjIwZ0p5NHVMMk52YlhCdmJtVnVkRTFoYm1GblpYSW5YRzVjYm1OdmJuTjBJRkJ5YjIxd2RDQTlJQ2dvS1NBOVBpQjdYRzVjYmlBZ0x5b3FYRzRnSUNBcUlDMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExWeHVJQ0FnS2lCRGIyNXpkR0Z1ZEhOY2JpQWdJQ29nTFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0WEc0Z0lDQXFMMXh1WEc0Z0lHTnZibk4wSUU1QlRVVWdQU0FuWkdsaGJHOW5KMXh1SUNCamIyNXpkQ0JDUVVOTFJGSlBVRjlUUlV4RlExUlBVaUE5SUNka2FXRnNiMmN0WW1GamEyUnliM0FuWEc0Z0lHTnZibk4wSUVSRlJrRlZURlJmVUZKUFVFVlNWRWxGVXlBOUlIdGNiaUFnSUNCbGJHVnRaVzUwT2lCdWRXeHNMRnh1SUNBZ0lIUnBkR3hsT2lCdWRXeHNMRnh1SUNBZ0lHMWxjM05oWjJVNklHNTFiR3dzWEc0Z0lDQWdZMkZ1WTJWc1lXSnNaVG9nZEhKMVpTeGNiaUFnZlZ4dUlDQmpiMjV6ZENCRVFWUkJYMEZVVkZKVFgxQlNUMUJGVWxSSlJWTWdQU0JiWEc0Z0lDQWdKMk5oYm1ObGJHRmliR1VuTEZ4dUlDQmRYRzVjYmlBZ0x5b3FYRzRnSUNBcUlDMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExWeHVJQ0FnS2lCRGJHRnpjeUJFWldacGJtbDBhVzl1WEc0Z0lDQXFJQzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMVnh1SUNBZ0tpOWNibHh1SUNCamJHRnpjeUJRY205dGNIUWdaWGgwWlc1a2N5QkVhV0ZzYjJjZ2UxeHVYRzRnSUNBZ1kyOXVjM1J5ZFdOMGIzSW9iM0IwYVc5dWN5QTlJSHQ5S1NCN1hHNGdJQ0FnSUNCamIyNXpkQ0IwWlcxd2JHRjBaU0E5SUNjbklDdGNiaUFnSUNBZ0lDYzhaR2wySUdOc1lYTnpQVndpWkdsaGJHOW5YQ0lnZEdGaWFXNWtaWGc5WENJdE1Wd2lJSEp2YkdVOVhDSmthV0ZzYjJkY0lqNG5JQ3RjYmlBZ0lDQWdJQ0FnSnp4a2FYWWdZMnhoYzNNOVhDSmthV0ZzYjJjdGFXNXVaWEpjSWlCeWIyeGxQVndpWkc5amRXMWxiblJjSWo0bklDdGNiaUFnSUNBZ0lDQWdJQ0FuUEdScGRpQmpiR0Z6Y3oxY0ltUnBZV3h2WnkxamIyNTBaVzUwWENJK0p5QXJYRzRnSUNBZ0lDQWdJQ0FnSUNBblBHUnBkaUJqYkdGemN6MWNJbVJwWVd4dlp5MW9aV0ZrWlhKY0lqNG5JQ3RjYmlBZ0lDQWdJQ0FnSUNBZ0lDQWdKenhvTlNCamJHRnpjejFjSW1ScFlXeHZaeTEwYVhSc1pWd2lQand2YURVK0p5QXJYRzRnSUNBZ0lDQWdJQ0FnSUNBblBDOWthWFkrSnlBclhHNGdJQ0FnSUNBZ0lDQWdJQ0FuUEdScGRpQmpiR0Z6Y3oxY0ltUnBZV3h2WnkxaWIyUjVYQ0krSnlBclhHNGdJQ0FnSUNBZ0lDQWdJQ0FnSUNjOGFXNXdkWFFnWTJ4aGMzTTlYQ0ptYjNKdExXTnZiblJ5YjJ4Y0lpQjBlWEJsUFZ3aWRHVjRkRndpSUhaaGJIVmxQVndpWENJK0p5QXJYRzRnSUNBZ0lDQWdJQ0FnSUNBblBDOWthWFkrSnlBclhHNGdJQ0FnSUNBZ0lDQWdJQ0FuUEdScGRpQmpiR0Z6Y3oxY0ltUnBZV3h2WnkxbWIyOTBaWEpjSWo0bklDdGNiaUFnSUNBZ0lDQWdJQ0FnSUNBZ0p6eGlkWFIwYjI0Z2RIbHdaVDFjSW1KMWRIUnZibHdpSUdOc1lYTnpQVndpWW5SdUlHSjBiaTF3Y21sdFlYSjVYQ0lnWkdGMFlTMWthWE50YVhOelBWd2laR2xoYkc5blhDSStUMnM4TDJKMWRIUnZiajRuSUN0Y2JpQWdJQ0FnSUNBZ0lDQWdJQ2M4TDJScGRqNG5JQ3RjYmlBZ0lDQWdJQ0FnSUNBblBDOWthWFkrSnlBclhHNGdJQ0FnSUNBZ0lDYzhMMlJwZGo0bklDdGNiaUFnSUNBZ0lDYzhMMlJwZGo0blhHNWNiaUFnSUNBZ0lITjFjR1Z5S0c5d2RHbHZibk1zSUhSbGJYQnNZWFJsS1Z4dUlDQWdJSDFjYmx4dUlDQWdJSE4wWVhScFl5QmZSRTlOU1c1MFpYSm1ZV05sS0c5d2RHbHZibk1wSUh0Y2JpQWdJQ0FnSUhKbGRIVnliaUJ1WlhjZ1VISnZiWEIwS0c5d2RHbHZibk1wWEc0Z0lDQWdmVnh1SUNCOVhHNWNiaUFnTHlvcVhHNGdJQ0FxSUMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFZ4dUlDQWdLaUJFVDAwZ1FYQnBJR2x0Y0d4bGJXVnVkR0YwYVc5dVhHNGdJQ0FxSUMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFZ4dUlDQWdLaTljYmlBZ1kyOXVjM1FnWTI5dGNHOXVaVzUwY3lBOUlGdGRYRzRnSUdOdmJuTjBJR1JwWVd4dlozTWdQU0JrYjJOMWJXVnVkQzV4ZFdWeWVWTmxiR1ZqZEc5eVFXeHNLR0F1Skh0T1FVMUZmV0FwWEc1Y2JpQWdhV1lnS0dScFlXeHZaM01wSUh0Y2JpQWdJQ0JCY25KaGVTNW1jbTl0S0dScFlXeHZaM01wTG1admNrVmhZMmdvS0dWc1pXMWxiblFwSUQwK0lIdGNiaUFnSUNBZ0lHTnZibk4wSUdOdmJtWnBaeUE5SUdkbGRFRjBkSEpwWW5WMFpYTkRiMjVtYVdjb1pXeGxiV1Z1ZEN3Z1JFVkdRVlZNVkY5UVVrOVFSVkpVU1VWVExDQkVRVlJCWDBGVVZGSlRYMUJTVDFCRlVsUkpSVk1wWEc0Z0lDQWdJQ0JqYjI1bWFXY3VaV3hsYldWdWRDQTlJR1ZzWlcxbGJuUmNibHh1SUNBZ0lDQWdhV1lnS0dOdmJtWnBaeTUwZVhCbElEMDlQU0FuWVd4bGNuUW5LU0I3WEc0Z0lDQWdJQ0FnSUM4dklIQnliMjF3ZEZ4dUlDQWdJQ0FnSUNCamIyMXdiMjVsYm5SekxuQjFjMmdvYm1WM0lGQnliMjF3ZENoamIyNW1hV2NwS1Z4dUlDQWdJQ0FnZlZ4dUlDQWdJSDBwWEc0Z0lIMWNibHh1SUNCcFppQW9aR2xoYkc5bmN5a2dlMXh1SUNBZ0lHUnZZM1Z0Wlc1MExtRmtaRVYyWlc1MFRHbHpkR1Z1WlhJb0oyTnNhV05ySnl3Z0tHVjJaVzUwS1NBOVBpQjdYRzRnSUNBZ0lDQmpiMjV6ZENCa2NtOXdaRzkzYmsxbGJuVWdQU0JtYVc1a1ZHRnlaMlYwUW5sRGJHRnpjeWhsZG1WdWRDNTBZWEpuWlhRc0lDZGtjbTl3Wkc5M2JpMXRaVzUxSnlsY2JpQWdJQ0FnSUdsbUlDaGtjbTl3Wkc5M2JrMWxiblVwSUh0Y2JpQWdJQ0FnSUNBZ2NtVjBkWEp1WEc0Z0lDQWdJQ0I5WEc1Y2JpQWdJQ0FnSUdOdmJuTjBJR1J5YjNCa2IzZHVJRDBnWm1sdVpGUmhjbWRsZEVKNVEyeGhjM01vWlhabGJuUXVkR0Z5WjJWMExDQW5aSEp2Y0dSdmQyNG5LVnh1WEc0Z0lDQWdJQ0JwWmlBb1pISnZjR1J2ZDI0cElIdGNiaUFnSUNBZ0lDQWdZMjl1YzNRZ1pHRjBZVlJ2WjJkc1pVRjBkSElnUFNCa2NtOXdaRzkzYmk1blpYUkJkSFJ5YVdKMWRHVW9KMlJoZEdFdGRHOW5aMnhsSnlsY2JpQWdJQ0FnSUNBZ2FXWWdLR1JoZEdGVWIyZG5iR1ZCZEhSeUlDWW1JR1JoZEdGVWIyZG5iR1ZCZEhSeUlEMDlQU0JPUVUxRklDWW1JR1J5YjNCa2IzZHVLU0I3WEc0Z0lDQWdJQ0FnSUNBZ1kyOXVjM1FnWTI5dGNHOXVaVzUwSUQwZ1kyOXRjRzl1Wlc1MGN5NW1hVzVrS0dNZ1BUNGdZeTVuWlhSRmJHVnRaVzUwS0NrZ1BUMDlJR1J5YjNCa2IzZHVLVnh1WEc0Z0lDQWdJQ0FnSUNBZ2FXWWdLQ0ZqYjIxd2IyNWxiblFwSUh0Y2JpQWdJQ0FnSUNBZ0lDQWdJSEpsZEhWeWJseHVJQ0FnSUNBZ0lDQWdJSDFjYmx4dUlDQWdJQ0FnSUNBZ0lHTnZiWEJ2Ym1WdWRDNTBiMmRuYkdVb0tWeHVJQ0FnSUNBZ0lDQjlYRzRnSUNBZ0lDQjlYRzRnSUNBZ2ZTbGNiaUFnZlZ4dVhHNGdJSEpsZEhWeWJpQlFjbTl0Y0hSY2JuMHBLQ2xjYmx4dVpYaHdiM0owSUdSbFptRjFiSFFnVUhKdmJYQjBYRzRpTENJdktpcGNiaUFxSUMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdFhHNGdLaUJNYVdObGJuTmxaQ0IxYm1SbGNpQk5TVlFnS0doMGRIQnpPaTh2WjJsMGFIVmlMbU52YlM5eGRXRnlheTFrWlhZdlVHaHZibTl1TFVaeVlXMWxkMjl5YXk5aWJHOWlMMjFoYzNSbGNpOU1TVU5GVGxORktWeHVJQ29nTFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMxY2JpQXFMMXh1YVcxd2IzSjBJRU52YlhCdmJtVnVkQ0JtY205dElDY3VMaTlqYjIxd2IyNWxiblFuWEc1cGJYQnZjblFnUlhabGJuUWdabkp2YlNBbkxpNHZMaTR2WTI5dGJXOXVMMlYyWlc1MGN5ZGNibWx0Y0c5eWRDQjdJR1pwYm1SVVlYSm5aWFJDZVVOc1lYTnpJSDBnWm5KdmJTQW5MaTR2TGk0dlkyOXRiVzl1TDNWMGFXeHpKMXh1YVcxd2IzSjBJSHNnWjJWMFFYUjBjbWxpZFhSbGMwTnZibVpwWnlCOUlHWnliMjBnSnk0dUwyTnZiWEJ2Ym1WdWRFMWhibUZuWlhJblhHNWNibU52Ym5OMElFUnliM0JrYjNkdUlEMGdLQ2dwSUQwK0lIdGNiaUFnTHlvcVhHNGdJQ0FxSUMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFZ4dUlDQWdLaUJEYjI1emRHRnVkSE5jYmlBZ0lDb2dMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRYRzRnSUNBcUwxeHVYRzRnSUdOdmJuTjBJRTVCVFVVZ1BTQW5aSEp2Y0dSdmQyNG5YRzRnSUdOdmJuTjBJRlpGVWxOSlQwNGdQU0FuTWk0d0xqQW5YRzRnSUdOdmJuTjBJRVJGUmtGVlRGUmZVRkpQVUVWU1ZFbEZVeUE5SUh0Y2JpQWdJQ0JsYkdWdFpXNTBPaUJ1ZFd4c0xGeHVJQ0FnSUdSbFptRjFiSFE2SUhSeWRXVXNYRzRnSUNBZ2MyVmhjbU5vT2lCbVlXeHpaU3hjYmlBZ2ZWeHVJQ0JqYjI1emRDQkVRVlJCWDBGVVZGSlRYMUJTVDFCRlVsUkpSVk1nUFNCYlhHNGdJQ0FnSjJSbFptRjFiSFFuTEZ4dUlDQWdJQ2R6WldGeVkyZ25MQ0FnSUNCY2JpQWdYVnh1WEc0Z0lDOHFLbHh1SUNBZ0tpQXRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMWNiaUFnSUNvZ1EyeGhjM01nUkdWbWFXNXBkR2x2Ymx4dUlDQWdLaUF0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzFjYmlBZ0lDb3ZYRzVjYmlBZ1kyeGhjM01nUkhKdmNHUnZkMjRnWlhoMFpXNWtjeUJEYjIxd2IyNWxiblFnZTF4dVhHNGdJQ0FnWTI5dWMzUnlkV04wYjNJb2IzQjBhVzl1Y3lBOUlIdDlLU0I3WEc0Z0lDQWdJQ0J6ZFhCbGNpaE9RVTFGTENCV1JWSlRTVTlPTENCRVJVWkJWVXhVWDFCU1QxQkZVbFJKUlZNc0lHOXdkR2x2Ym5Nc0lFUkJWRUZmUVZSVVVsTmZVRkpQVUVWU1ZFbEZVeXdnWm1Gc2MyVXNJR1poYkhObEtWeHVYRzRnSUNBZ0lDQmpiMjV6ZENCelpXeGxZM1JsWkNBOUlIUm9hWE11YjNCMGFXOXVjeTVsYkdWdFpXNTBMbkYxWlhKNVUyVnNaV04wYjNJb0oxdGtZWFJoTFhObGJHVmpkR1ZrWFNjcFhHNGdJQ0FnSUNCamIyNXpkQ0JwZEdWdElEMGdkR2hwY3k1blpYUkpkR1Z0UkdGMFlTaHpaV3hsWTNSbFpDbGNibHh1SUNBZ0lDQWdkR2hwY3k1elpYUlRaV3hsWTNSbFpDaHBkR1Z0TG5aaGJIVmxMQ0JwZEdWdExuUmxlSFFzSUdaaGJITmxLVnh1SUNBZ0lIMWNibHh1SUNBZ0lITmxkRk5sYkdWamRHVmtLSFpoYkhWbElEMGdKeWNzSUhSbGVIUWdQU0J1ZFd4c0xDQmphR1ZqYTBWNGFYTjBjeUE5SUhSeWRXVXBJSHRjYmlBZ0lDQWdJR2xtSUNnaGRHaHBjeTV2Y0hScGIyNXpMbVJsWm1GMWJIUXBJSHRjYmlBZ0lDQWdJQ0FnY21WMGRYSnVJR1poYkhObFhHNGdJQ0FnSUNCOVhHNWNiaUFnSUNBZ0lHeGxkQ0IwWlhoMFJHbHpjR3hoZVNBOUlIUmxlSFJjYmlBZ0lDQWdJSFJvYVhNdWIzQjBhVzl1Y3k1bGJHVnRaVzUwTG5GMVpYSjVVMlZzWldOMGIzSW9KeTVrWldaaGRXeDBMWFJsZUhRbktTNXBibTVsY2toVVRVd2dQU0IwWlhoMFhHNGdJQ0FnSUNCMGFHbHpMbTl3ZEdsdmJuTXVaV3hsYldWdWRDNXhkV1Z5ZVZObGJHVmpkRzl5S0NkcGJuQjFkRnQwZVhCbFBWd2lhR2xrWkdWdVhDSmRKeWt1ZG1Gc2RXVWdQU0IyWVd4MVpWeHVYRzRnSUNBZ0lDQmpiMjV6ZENCcGRHVnRjeUE5SUhSb2FYTXViM0IwYVc5dWN5NWxiR1Z0Wlc1MExuRjFaWEo1VTJWc1pXTjBiM0pCYkd3b0p5NXBkR1Z0SnlrZ2ZId2dXMTFjYmlBZ0lDQWdJR3hsZENCcGRHVnRSbTkxYm1RZ1BTQm1ZV3h6WlZ4dVhHNGdJQ0FnSUNCQmNuSmhlUzVtY205dEtHbDBaVzF6S1M1bWIzSkZZV05vS0NocGRHVnRLU0E5UGlCN1hHNGdJQ0FnSUNBZ0lHbG1JQ2hwZEdWdExtTnNZWE56VEdsemRDNWpiMjUwWVdsdWN5Z25jMlZzWldOMFpXUW5LU2tnZTF4dUlDQWdJQ0FnSUNBZ0lHbDBaVzB1WTJ4aGMzTk1hWE4wTG5KbGJXOTJaU2duYzJWc1pXTjBaV1FuS1Z4dUlDQWdJQ0FnSUNCOVhHNWNiaUFnSUNBZ0lDQWdZMjl1YzNRZ1pHRjBZU0E5SUhSb2FYTXVaMlYwU1hSbGJVUmhkR0VvYVhSbGJTbGNibHh1SUNBZ0lDQWdJQ0JwWmlBb2RtRnNkV1VnUFQwOUlHUmhkR0V1ZG1Gc2RXVXBJSHRjYmlBZ0lDQWdJQ0FnSUNCcFppQW9JV2wwWlcwdVkyeGhjM05NYVhOMExtTnZiblJoYVc1ektDZHpaV3hsWTNSbFpDY3BLU0I3WEc0Z0lDQWdJQ0FnSUNBZ0lDQnBkR1Z0TG1Oc1lYTnpUR2x6ZEM1aFpHUW9KM05sYkdWamRHVmtKeWxjYmlBZ0lDQWdJQ0FnSUNCOVhHNWNiaUFnSUNBZ0lDQWdJQ0IwWlhoMFJHbHpjR3hoZVNBOUlHUmhkR0V1ZEdWNGRGeHVJQ0FnSUNBZ0lDQWdJR2wwWlcxR2IzVnVaQ0E5SUhSeWRXVmNiaUFnSUNBZ0lDQWdmVnh1SUNBZ0lDQWdmU2xjYmx4dUlDQWdJQ0FnYVdZZ0tHTm9aV05yUlhocGMzUnpJQ1ltSUdsMFpXMUdiM1Z1WkNrZ2UxeHVJQ0FnSUNBZ0lDQjBhR2x6TG05d2RHbHZibk11Wld4bGJXVnVkQzV4ZFdWeWVWTmxiR1ZqZEc5eUtDY3VaR1ZtWVhWc2RDMTBaWGgwSnlrdWFXNXVaWEpJVkUxTUlEMGdkR1Y0ZEVScGMzQnNZWGxjYmlBZ0lDQWdJSDBnWld4elpTQnBaaUFvWTJobFkydEZlR2x6ZEhNZ0ppWWdJV2wwWlcxR2IzVnVaQ2tnZTF4dUlDQWdJQ0FnSUNCMGFISnZkeUJ1WlhjZ1JYSnliM0lvWUNSN1RrRk5SWDB1SUZSb1pTQjJZV3gxWlNCY0lpUjdkbUZzZFdWOVhDSWdaRzlsY3lCdWIzUWdaWGhwYzNRZ2FXNGdkR2hsSUd4cGMzUWdiMllnYVhSbGJYTXVZQ2tnSUNBZ0lDQWdJRnh1SUNBZ0lDQWdmVnh1WEc0Z0lDQWdJQ0J5WlhSMWNtNGdkSEoxWlZ4dUlDQWdJSDFjYmx4dUlDQWdJR2RsZEZObGJHVmpkR1ZrS0NrZ2UxeHVJQ0FnSUNBZ2NtVjBkWEp1SUhSb2FYTXViM0IwYVc5dWN5NWxiR1Z0Wlc1MExuRjFaWEo1VTJWc1pXTjBiM0lvSjJsdWNIVjBXM1I1Y0dVOVhDSm9hV1JrWlc1Y0lsMG5LUzUyWVd4MVpWeHVJQ0FnSUgxY2JseHVJQ0FnSUdkbGRFbDBaVzFFWVhSaEtHbDBaVzBnUFNCdWRXeHNLU0I3WEc0Z0lDQWdJQ0JzWlhRZ2RHVjRkQ0E5SUNjblhHNGdJQ0FnSUNCc1pYUWdkbUZzZFdVZ1BTQW5KMXh1WEc0Z0lDQWdJQ0JwWmlBb2FYUmxiU2tnZTF4dUlDQWdJQ0FnSUNCMFpYaDBJRDBnYVhSbGJTNW5aWFJCZEhSeWFXSjFkR1VvSjJSaGRHRXRkR1Y0ZENjcElIeDhJR2wwWlcwdWFXNXVaWEpJVkUxTVhHNWNiaUFnSUNBZ0lDQWdZMjl1YzNRZ2MyVnNaV04wWldSVVpYaDBUbTlrWlNBOUlHbDBaVzB1Y1hWbGNubFRaV3hsWTNSdmNpZ25MblJsZUhRbktWeHVJQ0FnSUNBZ0lDQnBaaUFvYzJWc1pXTjBaV1JVWlhoMFRtOWtaU2tnZTF4dUlDQWdJQ0FnSUNBZ0lIUmxlSFFnUFNCelpXeGxZM1JsWkZSbGVIUk9iMlJsTG1sdWJtVnlTRlJOVEZ4dUlDQWdJQ0FnSUNCOVhHNWNiaUFnSUNBZ0lDQWdkbUZzZFdVZ1BTQnBkR1Z0TG1kbGRFRjBkSEpwWW5WMFpTZ25aR0YwWVMxMllXeDFaU2NwSUh4OElDY25YRzRnSUNBZ0lDQjlYRzVjYmlBZ0lDQWdJSEpsZEhWeWJpQjdJSFJsZUhRc0lIWmhiSFZsSUgxY2JpQWdJQ0I5WEc1Y2JpQWdJQ0J2YmtWc1pXMWxiblJGZG1WdWRDaGxkbVZ1ZENrZ2UxeHVJQ0FnSUNBZ2FXWWdLR1YyWlc1MExuUjVjR1VnUFQwOUlFVjJaVzUwTGxOVVFWSlVLU0I3WEc0Z0lDQWdJQ0FnSUdOdmJuTjBJR1J5YjNCa2IzZHVJRDBnWm1sdVpGUmhjbWRsZEVKNVEyeGhjM01vWlhabGJuUXVkR0Z5WjJWMExDQW5aSEp2Y0dSdmQyNG5LVnh1WEc0Z0lDQWdJQ0FnSUM4cVhHNGdJQ0FnSUNBZ0lDQXFJR2hwWkdVZ2RHaGxJR04xY25KbGJuUWdaSEp2Y0dSdmQyNGdiMjVzZVNCcFppQjBhR1VnWlhabGJuUWdZMjl1WTJWeWJuTWdZVzV2ZEdobGNpQmtjbTl3Wkc5M2JseHVJQ0FnSUNBZ0lDQWdLaUJvYVdSbElHRnNjMjhnYVdZZ2RHaGxJSFZ6WlhJZ1kyeHBZMnR6SUc5MWRITnBaR1VnWVNCa2NtOXdaRzkzYmx4dUlDQWdJQ0FnSUNBZ0tpOWNiaUFnSUNBZ0lDQWdhV1lnS0NGa2NtOXdaRzkzYmlCOGZDQmtjbTl3Wkc5M2JpQWhQVDBnZEdocGN5NW5aWFJGYkdWdFpXNTBLQ2twSUh0Y2JpQWdJQ0FnSUNBZ0lDQjBhR2x6TG1ocFpHVW9LVnh1SUNBZ0lDQWdJQ0I5WEc1Y2JpQWdJQ0FnSUgwZ1pXeHpaU0JwWmlBb1pYWmxiblF1ZEhsd1pTQTlQVDBnSjJOc2FXTnJKeWtnZTF4dUlDQWdJQ0FnSUNCamIyNXpkQ0JwZEdWdElEMGdabWx1WkZSaGNtZGxkRUo1UTJ4aGMzTW9aWFpsYm5RdWRHRnlaMlYwTENBbmFYUmxiU2NwWEc1Y2JpQWdJQ0FnSUNBZ2FXWWdLR2wwWlcwcElIdGNiaUFnSUNBZ0lDQWdJQ0JwWmlBb2FYUmxiUzVqYkdGemMweHBjM1F1WTI5dWRHRnBibk1vSjJScGMyRmliR1ZrSnlrcElIdGNiaUFnSUNBZ0lDQWdJQ0FnSUhKbGRIVnlibHh1SUNBZ0lDQWdJQ0FnSUgxY2JseHVJQ0FnSUNBZ0lDQWdJR052Ym5OMElHbDBaVzFKYm1adklEMGdkR2hwY3k1blpYUkpkR1Z0UkdGMFlTaHBkR1Z0S1Z4dVhHNGdJQ0FnSUNBZ0lDQWdhV1lnS0hSb2FYTXVaMlYwVTJWc1pXTjBaV1FvS1NBaFBUMGdhWFJsYlVsdVptOHVkbUZzZFdVcElIdGNiaUFnSUNBZ0lDQWdJQ0FnSUM4dklIUm9aU0IxYzJWeUlITmxiR1ZqZEdWa0lHRnViM1JvWlhJZ2RtRnNkV1VzSUhkbElHUnBjM0JoZEdOb0lIUm9aU0JsZG1WdWRGeHVJQ0FnSUNBZ0lDQWdJQ0FnZEdocGN5NXpaWFJUWld4bFkzUmxaQ2hwZEdWdFNXNW1ieTUyWVd4MVpTd2dhWFJsYlVsdVptOHVkR1Y0ZEN3Z1ptRnNjMlVwWEc0Z0lDQWdJQ0FnSUNBZ0lDQmpiMjV6ZENCa1pYUmhhV3dnUFNCN0lHbDBaVzBzSUhSbGVIUTZJR2wwWlcxSmJtWnZMblJsZUhRc0lIWmhiSFZsT2lCcGRHVnRTVzVtYnk1MllXeDFaU0I5WEc0Z0lDQWdJQ0FnSUNBZ0lDQjBhR2x6TG5SeWFXZG5aWEpGZG1WdWRDaEZkbVZ1ZEM1SlZFVk5YMU5GVEVWRFZFVkVMQ0JrWlhSaGFXd3BYRzRnSUNBZ0lDQWdJQ0FnZlZ4dVhHNGdJQ0FnSUNBZ0lDQWdkR2hwY3k1b2FXUmxLQ2xjYmlBZ0lDQWdJQ0FnSUNCeVpYUjFjbTVjYmlBZ0lDQWdJQ0FnZlZ4dVhHNGdJQ0FnSUNBZ0lDOHZJR1J2YmlkMElIUnZaMmRzWlNCMGFHVWdaSEp2Y0dSdmQyNGdhV1lnZEdobElHVjJaVzUwSUdOdmJtTmxjbTV6SUdobFlXUmxjbk1zSUdScGRtbGtaWEp6WEc0Z0lDQWdJQ0FnSUdOdmJuTjBJR1J5YjNCa2IzZHVUV1Z1ZFNBOUlHWnBibVJVWVhKblpYUkNlVU5zWVhOektHVjJaVzUwTG5SaGNtZGxkQ3dnSjJSeWIzQmtiM2R1TFcxbGJuVW5LVnh1SUNBZ0lDQWdJQ0JwWmlBb1pISnZjR1J2ZDI1TlpXNTFLU0I3WEc0Z0lDQWdJQ0FnSUNBZ2NtVjBkWEp1WEc0Z0lDQWdJQ0FnSUgxY2JseHVJQ0FnSUNBZ0lDQjBhR2x6TG5SdloyZHNaU2dwWEc0Z0lDQWdJQ0I5WEc0Z0lDQWdmVnh1WEc0Z0lDQWdkRzluWjJ4bEtDa2dlMXh1SUNBZ0lDQWdhV1lnS0hSb2FYTXViM0IwYVc5dWN5NWxiR1Z0Wlc1MExtTnNZWE56VEdsemRDNWpiMjUwWVdsdWN5Z25ZV04wYVhabEp5a3BJSHRjYmlBZ0lDQWdJQ0FnY21WMGRYSnVJSFJvYVhNdWFHbGtaU2dwWEc0Z0lDQWdJQ0I5WEc1Y2JpQWdJQ0FnSUhKbGRIVnliaUIwYUdsekxuTm9iM2NvS1Z4dUlDQWdJSDFjYmx4dUlDQWdJSE5vYjNjb0tTQjdYRzRnSUNBZ0lDQnBaaUFvZEdocGN5NXZjSFJwYjI1ekxtVnNaVzFsYm5RdVkyeGhjM05NYVhOMExtTnZiblJoYVc1ektDZGhZM1JwZG1VbktTa2dlMXh1SUNBZ0lDQWdJQ0J5WlhSMWNtNGdabUZzYzJWY2JpQWdJQ0FnSUgxY2JseHVJQ0FnSUNBZ2RHaHBjeTV2Y0hScGIyNXpMbVZzWlcxbGJuUXVZMnhoYzNOTWFYTjBMbUZrWkNnbllXTjBhWFpsSnlsY2JseHVJQ0FnSUNBZ1kyOXVjM1FnWkhKdmNHUnZkMjVOWlc1MUlEMGdkR2hwY3k1dmNIUnBiMjV6TG1Wc1pXMWxiblF1Y1hWbGNubFRaV3hsWTNSdmNpZ25MbVJ5YjNCa2IzZHVMVzFsYm5VbktWeHVYRzRnSUNBZ0lDQXZMeUJ6WTNKdmJHd2dkRzhnZEc5d1hHNGdJQ0FnSUNCa2NtOXdaRzkzYmsxbGJuVXVjMk55YjJ4c1ZHOXdJRDBnTUZ4dVhHNGdJQ0FnSUNCMGFHbHpMblJ5YVdkblpYSkZkbVZ1ZENoRmRtVnVkQzVUU0U5WEtWeHVJQ0FnSUNBZ2RHaHBjeTUwY21sbloyVnlSWFpsYm5Rb1JYWmxiblF1VTBoUFYwNHBYRzVjYmlBZ0lDQWdJSFJvYVhNdWNtVm5hWE4wWlhKRmJHVnRaVzUwS0hzZ2RHRnlaMlYwT2lCa2NtOXdaRzkzYmsxbGJuVXNJR1YyWlc1ME9pQW5ZMnhwWTJzbklIMHBJQ0FnSUNBZ1hHNGdJQ0FnSUNCMGFHbHpMbkpsWjJsemRHVnlSV3hsYldWdWRDaDdJSFJoY21kbGREb2daRzlqZFcxbGJuUXVZbTlrZVN3Z1pYWmxiblE2SUVWMlpXNTBMbE5VUVZKVUlIMHBYRzVjYmlBZ0lDQWdJSEpsZEhWeWJpQjBjblZsWEc0Z0lDQWdmVnh1WEc0Z0lDQWdhR2xrWlNncElIdGNiaUFnSUNBZ0lHbG1JQ2doZEdocGN5NXZjSFJwYjI1ekxtVnNaVzFsYm5RdVkyeGhjM05NYVhOMExtTnZiblJoYVc1ektDZGhZM1JwZG1VbktTa2dlMXh1SUNBZ0lDQWdJQ0J5WlhSMWNtNGdabUZzYzJWY2JpQWdJQ0FnSUgxY2JseHVJQ0FnSUNBZ2RHaHBjeTV2Y0hScGIyNXpMbVZzWlcxbGJuUXVZMnhoYzNOTWFYTjBMbkpsYlc5MlpTZ25ZV04wYVhabEp5bGNibHh1SUNBZ0lDQWdkR2hwY3k1MGNtbG5aMlZ5UlhabGJuUW9SWFpsYm5RdVNFbEVSU2xjYmlBZ0lDQWdJSFJvYVhNdWRISnBaMmRsY2tWMlpXNTBLRVYyWlc1MExraEpSRVJGVGlsY2JseHVJQ0FnSUNBZ2RHaHBjeTUxYm5KbFoybHpkR1Z5Uld4bGJXVnVkQ2g3SUhSaGNtZGxkRG9nZEdocGN5NXZjSFJwYjI1ekxtVnNaVzFsYm5RdWNYVmxjbmxUWld4bFkzUnZjaWduTG1SeWIzQmtiM2R1TFcxbGJuVW5LU3dnWlhabGJuUTZJQ2RqYkdsamF5Y2dmU2tnSUNBZ0lDQmNiaUFnSUNBZ0lIUm9hWE11ZFc1eVpXZHBjM1JsY2tWc1pXMWxiblFvZXlCMFlYSm5aWFE2SUdSdlkzVnRaVzUwTG1KdlpIa3NJR1YyWlc1ME9pQkZkbVZ1ZEM1VFZFRlNWQ0I5S1Z4dVhHNGdJQ0FnSUNCeVpYUjFjbTRnZEhKMVpWeHVJQ0FnSUgxY2JseHVJQ0FnSUhOMFlYUnBZeUJwWkdWdWRHbG1hV1Z5S0NrZ2UxeHVJQ0FnSUNBZ2NtVjBkWEp1SUU1QlRVVmNiaUFnSUNCOVhHNWNiaUFnSUNCemRHRjBhV01nWDBSUFRVbHVkR1Z5Wm1GalpTaHZjSFJwYjI1ektTQjdYRzRnSUNBZ0lDQnlaWFIxY200Z2MzVndaWEl1WDBSUFRVbHVkR1Z5Wm1GalpTaEVjbTl3Wkc5M2Jpd2diM0IwYVc5dWN5bGNiaUFnSUNCOVhHNGdJSDFjYmx4dUlDQXZLaXBjYmlBZ0lDb2dMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRYRzRnSUNBcUlFUlBUU0JCY0drZ2FXMXdiR1Z0Wlc1MFlYUnBiMjVjYmlBZ0lDb2dMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRYRzRnSUNBcUwxeHVJQ0JqYjI1emRDQmpiMjF3YjI1bGJuUnpJRDBnVzExY2JseHVJQ0JqYjI1emRDQmtjbTl3Wkc5M2JuTWdQU0JrYjJOMWJXVnVkQzV4ZFdWeWVWTmxiR1ZqZEc5eVFXeHNLR0F1Skh0T1FVMUZmV0FwWEc0Z0lHbG1JQ2hrY205d1pHOTNibk1wSUh0Y2JpQWdJQ0JCY25KaGVTNW1jbTl0S0dSeWIzQmtiM2R1Y3lrdVptOXlSV0ZqYUNnb1pXeGxiV1Z1ZENrZ1BUNGdlMXh1SUNBZ0lDQWdZMjl1YzNRZ1kyOXVabWxuSUQwZ1oyVjBRWFIwY21saWRYUmxjME52Ym1acFp5aGxiR1Z0Wlc1MExDQkVSVVpCVlV4VVgxQlNUMUJGVWxSSlJWTXNJRVJCVkVGZlFWUlVVbE5mVUZKUFVFVlNWRWxGVXlsY2JpQWdJQ0FnSUdOdmJtWnBaeTVsYkdWdFpXNTBJRDBnWld4bGJXVnVkRnh1WEc0Z0lDQWdJQ0JwWmlBb0lXTnZibVpwWnk1elpXRnlZMmdwSUh0Y2JpQWdJQ0FnSUNBZ1kyOXRjRzl1Wlc1MGN5NXdkWE5vS0c1bGR5QkVjbTl3Wkc5M2JpaGpiMjVtYVdjcEtWeHVJQ0FnSUNBZ2ZWeHVJQ0FnSUgwcFhHNGdJSDFjYmx4dUlDQnBaaUFvWkhKdmNHUnZkMjV6S1NCN1hHNGdJQ0FnWkc5amRXMWxiblF1WVdSa1JYWmxiblJNYVhOMFpXNWxjaWduWTJ4cFkyc25MQ0FvWlhabGJuUXBJRDArSUh0Y2JpQWdJQ0FnSUdOdmJuTjBJR1J5YjNCa2IzZHVUV1Z1ZFNBOUlHWnBibVJVWVhKblpYUkNlVU5zWVhOektHVjJaVzUwTG5SaGNtZGxkQ3dnSjJSeWIzQmtiM2R1TFcxbGJuVW5LVnh1SUNBZ0lDQWdhV1lnS0dSeWIzQmtiM2R1VFdWdWRTa2dlMXh1SUNBZ0lDQWdJQ0J5WlhSMWNtNWNiaUFnSUNBZ0lIMWNibHh1SUNBZ0lDQWdZMjl1YzNRZ1pISnZjR1J2ZDI0Z1BTQm1hVzVrVkdGeVoyVjBRbmxEYkdGemN5aGxkbVZ1ZEM1MFlYSm5aWFFzSUNka2NtOXdaRzkzYmljcFhHNWNiaUFnSUNBZ0lHbG1JQ2hrY205d1pHOTNiaWtnZTF4dUlDQWdJQ0FnSUNCamIyNXpkQ0JrWVhSaFZHOW5aMnhsUVhSMGNpQTlJR1J5YjNCa2IzZHVMbWRsZEVGMGRISnBZblYwWlNnblpHRjBZUzEwYjJkbmJHVW5LVnh1SUNBZ0lDQWdJQ0JwWmlBb1pHRjBZVlJ2WjJkc1pVRjBkSElnSmlZZ1pHRjBZVlJ2WjJkc1pVRjBkSElnUFQwOUlFNUJUVVVnSmlZZ1pISnZjR1J2ZDI0cElIdGNiaUFnSUNBZ0lDQWdJQ0JqYjI1emRDQmpiMjF3YjI1bGJuUWdQU0JqYjIxd2IyNWxiblJ6TG1acGJtUW9ZeUE5UGlCakxtZGxkRVZzWlcxbGJuUW9LU0E5UFQwZ1pISnZjR1J2ZDI0cFhHNWNiaUFnSUNBZ0lDQWdJQ0JwWmlBb0lXTnZiWEJ2Ym1WdWRDa2dlMXh1SUNBZ0lDQWdJQ0FnSUNBZ2NtVjBkWEp1WEc0Z0lDQWdJQ0FnSUNBZ2ZWeHVYRzRnSUNBZ0lDQWdJQ0FnWTI5dGNHOXVaVzUwTG5SdloyZHNaU2dwWEc0Z0lDQWdJQ0FnSUgxY2JpQWdJQ0FnSUgxY2JpQWdJQ0I5S1Z4dUlDQjlYRzVjYmlBZ2NtVjBkWEp1SUVSeWIzQmtiM2R1WEc1OUtTZ3BYRzVjYm1WNGNHOXlkQ0JrWldaaGRXeDBJRVJ5YjNCa2IzZHVYRzRpTENJdktpcGNiaUFxSUMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdFhHNGdLaUJNYVdObGJuTmxaQ0IxYm1SbGNpQk5TVlFnS0doMGRIQnpPaTh2WjJsMGFIVmlMbU52YlM5eGRXRnlheTFrWlhZdlVHaHZibTl1TFVaeVlXMWxkMjl5YXk5aWJHOWlMMjFoYzNSbGNpOU1TVU5GVGxORktWeHVJQ29nTFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMxY2JpQXFMMXh1YVcxd2IzSjBJRVJ5YjNCa2IzZHVJR1p5YjIwZ0p5NHZhVzVrWlhnblhHNXBiWEJ2Y25RZ2V5Qm1hVzVrVkdGeVoyVjBRbmxEYkdGemN5QjlJR1p5YjIwZ0p5NHVMeTR1TDJOdmJXMXZiaTkxZEdsc2N5ZGNibWx0Y0c5eWRDQjdJR2RsZEVGMGRISnBZblYwWlhORGIyNW1hV2NnZlNCbWNtOXRJQ2N1TGk5amIyMXdiMjVsYm5STllXNWhaMlZ5SjF4dVhHNWpiMjV6ZENCRWNtOXdaRzkzYmxObFlYSmphQ0E5SUNnb0tTQTlQaUI3WEc1Y2JpQWdMeW9xWEc0Z0lDQXFJQzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMVnh1SUNBZ0tpQkRiMjV6ZEdGdWRITmNiaUFnSUNvZ0xTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdFhHNGdJQ0FxTDF4dVhHNGdJR052Ym5OMElFNUJUVVVnUFNCRWNtOXdaRzkzYmk1cFpHVnVkR2xtYVdWeUtDbGNiaUFnWTI5dWMzUWdSRVZHUVZWTVZGOVFVazlRUlZKVVNVVlRJRDBnZTF4dUlDQWdJR1ZzWlcxbGJuUTZJRzUxYkd3c1hHNGdJQ0FnWkdWbVlYVnNkRG9nZEhKMVpTeGNiaUFnSUNCelpXRnlZMmc2SUhSeWRXVXNYRzRnSUgxY2JpQWdZMjl1YzNRZ1JFRlVRVjlCVkZSU1UxOVFVazlRUlZKVVNVVlRJRDBnVzF4dUlDQWdJQ2RrWldaaGRXeDBKeXhjYmlBZ0lDQW5jMlZoY21Ob0p5eGNiaUFnWFZ4dVhHNGdJQzhxS2x4dUlDQWdLaUF0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzFjYmlBZ0lDb2dRMnhoYzNNZ1JHVm1hVzVwZEdsdmJseHVJQ0FnS2lBdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMxY2JpQWdJQ292WEc1Y2JpQWdZMnhoYzNNZ1JISnZjR1J2ZDI1VFpXRnlZMmdnWlhoMFpXNWtjeUJFY205d1pHOTNiaUI3WEc1Y2JpQWdJQ0JqYjI1emRISjFZM1J2Y2lodmNIUnBiMjV6SUQwZ2UzMHBJSHRjYmlBZ0lDQWdJSE4xY0dWeUtHOXdkR2x2Ym5NcFhHNWNiaUFnSUNBZ0lIUm9hWE11Wm1sc2RHVnlTWFJsYlhOSVlXNWtiR1Z5SUQwZ0tHVjJaVzUwS1NBOVBpQjdYRzRnSUNBZ0lDQWdJR052Ym5OMElITmxZWEpqYUNBOUlHVjJaVzUwTG5SaGNtZGxkQzUyWVd4MVpWeHVYRzRnSUNBZ0lDQWdJR2xtSUNoelpXRnlZMmdnUFQwOUlDY25LU0I3WEc0Z0lDQWdJQ0FnSUNBZ2RHaHBjeTV6YUc5M1NYUmxiWE1vS1Z4dUlDQWdJQ0FnSUNBZ0lISmxkSFZ5Ymx4dUlDQWdJQ0FnSUNCOVhHNWNibHh1SUNBZ0lDQWdJQ0IwYUdsekxtZGxkRWwwWlcxektDa3VabTl5UldGamFDZ29hWFJsYlNrZ1BUNGdlMXh1SUNBZ0lDQWdJQ0FnSUdOdmJuTjBJR1p1SUQwZ2RIbHdaVzltSUhSb2FYTXViM0IwYVc5dWN5NW1hV3gwWlhKSmRHVnRJRDA5UFNBblpuVnVZM1JwYjI0bklEOGdkR2hwY3k1dmNIUnBiMjV6TG1acGJIUmxja2wwWlcwZ09pQjBhR2x6TG1acGJIUmxja2wwWlcxY2JseHVJQ0FnSUNBZ0lDQWdJR2xtSUNobWJpaHpaV0Z5WTJnc0lHbDBaVzBwS1NCN1hHNGdJQ0FnSUNBZ0lDQWdJQ0JwZEdWdExtVnNaVzFsYm5RdWMzUjViR1V1WkdsemNHeGhlU0E5SUNkaWJHOWpheWRjYmlBZ0lDQWdJQ0FnSUNCOUlHVnNjMlVnZTF4dUlDQWdJQ0FnSUNBZ0lDQWdhWFJsYlM1bGJHVnRaVzUwTG5OMGVXeGxMbVJwYzNCc1lYa2dQU0FuYm05dVpTZGNiaUFnSUNBZ0lDQWdJQ0I5WEc0Z0lDQWdJQ0FnSUgwcFhHNGdJQ0FnSUNCOVhHNWNiaUFnSUNBZ0lIUm9hWE11WjJWMFUyVmhjbU5vU1c1d2RYUW9LUzVoWkdSRmRtVnVkRXhwYzNSbGJtVnlLQ2RyWlhsMWNDY3NJSFJvYVhNdVptbHNkR1Z5U1hSbGJYTklZVzVrYkdWeUtWeHVJQ0FnSUgxY2JseHVJQ0FnSUdacGJIUmxja2wwWlcwb2MyVmhjbU5vSUQwZ0p5Y3NJR2wwWlcwZ1BTQjdmU2tnZTF4dUlDQWdJQ0FnYVdZZ0tHbDBaVzB1ZG1Gc2RXVXVhVzVrWlhoUFppaHpaV0Z5WTJncElENGdMVEZjYmlBZ0lDQWdJQ0FnZkh3Z2FYUmxiUzUwWlhoMExtbHVaR1Y0VDJZb2MyVmhjbU5vS1NBK0lDMHhLU0I3WEc0Z0lDQWdJQ0FnSUhKbGRIVnliaUIwY25WbFhHNGdJQ0FnSUNCOVhHNWNiaUFnSUNBZ0lISmxkSFZ5YmlCbVlXeHpaVnh1SUNBZ0lIMWNibHh1SUNBZ0lHZGxkRWwwWlcxektDa2dlMXh1SUNBZ0lDQWdiR1YwSUdsMFpXMXpJRDBnUVhKeVlYa3Vabkp2YlNoMGFHbHpMbTl3ZEdsdmJuTXVaV3hsYldWdWRDNXhkV1Z5ZVZObGJHVmpkRzl5UVd4c0tDY3VhWFJsYlNjcElIeDhJRnRkS1Z4dUlDQWdJQ0FnYVhSbGJYTWdQU0JwZEdWdGN5NXRZWEFvS0dsMFpXMHBJRDArSUh0Y2JpQWdJQ0FnSUNBZ1kyOXVjM1FnYVc1bWJ5QTlJSFJvYVhNdVoyVjBTWFJsYlVSaGRHRW9hWFJsYlNsY2JpQWdJQ0FnSUNBZ2NtVjBkWEp1SUhzZ2RHVjRkRG9nYVc1bWJ5NTBaWGgwTENCMllXeDFaVG9nYVc1bWJ5NTJZV3gxWlN3Z1pXeGxiV1Z1ZERvZ2FYUmxiU0I5WEc0Z0lDQWdJQ0I5S1Z4dVhHNGdJQ0FnSUNCeVpYUjFjbTRnYVhSbGJYTmNiaUFnSUNCOVhHNWNiaUFnSUNCemFHOTNTWFJsYlhNb0tTQjdYRzRnSUNBZ0lDQjBhR2x6TG1kbGRFbDBaVzF6S0NrdVptOXlSV0ZqYUNnb2FYUmxiU2tnUFQ0Z2UxeHVJQ0FnSUNBZ0lDQnBkR1Z0TG1Wc1pXMWxiblF1YzNSNWJHVXVaR2x6Y0d4aGVTQTlJQ2RpYkc5amF5ZGNiaUFnSUNBZ0lIMHBYRzRnSUNBZ2ZWeHVYRzRnSUNBZ1oyVjBVMlZoY21Ob1NXNXdkWFFvS1NCN1hHNGdJQ0FnSUNCeVpYUjFjbTRnZEdocGN5NXZjSFJwYjI1ekxtVnNaVzFsYm5RdWNYVmxjbmxUWld4bFkzUnZjaWduTG1SeWIzQmtiM2R1TFcxbGJuVWdhVzV3ZFhRbktWeHVJQ0FnSUgxY2JseHVJQ0FnSUdocFpHVW9LU0I3WEc0Z0lDQWdJQ0JwWmlBb2MzVndaWEl1YUdsa1pTZ3BLU0I3WEc0Z0lDQWdJQ0FnSUM4dklISmxjMlYwSUhSb1pTQjJZV3gxWlZ4dUlDQWdJQ0FnSUNCMGFHbHpMbWRsZEZObFlYSmphRWx1Y0hWMEtDa3VkbUZzZFdVZ1BTQW5KMXh1SUNBZ0lDQWdJQ0F2THlCemFHOTNJR0ZzYkNCcGRHVnRjMXh1SUNBZ0lDQWdJQ0IwYUdsekxuTm9iM2RKZEdWdGN5Z3BYRzRnSUNBZ0lDQjlYRzRnSUNBZ2ZWeHVYRzRnSUNBZ2MzUmhkR2xqSUY5RVQwMUpiblJsY21aaFkyVW9iM0IwYVc5dWN5a2dlMXh1SUNBZ0lDQWdjbVYwZFhKdUlHNWxkeUJFY205d1pHOTNibE5sWVhKamFDaHZjSFJwYjI1ektWeHVJQ0FnSUgxY2JpQWdmVnh1WEc0Z0lDOHFLbHh1SUNBZ0tpQXRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMWNiaUFnSUNvZ1JFOU5JRUZ3YVNCcGJYQnNaVzFsYm5SaGRHbHZibHh1SUNBZ0tpQXRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMWNiaUFnSUNvdlhHNGdJR052Ym5OMElHTnZiWEJ2Ym1WdWRITWdQU0JiWFZ4dUlDQmpiMjV6ZENCa2NtOXdaRzkzYm5NZ1BTQmtiMk4xYldWdWRDNXhkV1Z5ZVZObGJHVmpkRzl5UVd4c0tHQXVKSHRPUVUxRmZXQXBYRzVjYmlBZ2FXWWdLR1J5YjNCa2IzZHVjeWtnZTF4dUlDQWdJRUZ5Y21GNUxtWnliMjBvWkhKdmNHUnZkMjV6S1M1bWIzSkZZV05vS0NobGJHVnRaVzUwS1NBOVBpQjdYRzRnSUNBZ0lDQmpiMjV6ZENCamIyNW1hV2NnUFNCblpYUkJkSFJ5YVdKMWRHVnpRMjl1Wm1sbktHVnNaVzFsYm5Rc0lFUkZSa0ZWVEZSZlVGSlBVRVZTVkVsRlV5d2dSRUZVUVY5QlZGUlNVMTlRVWs5UVJWSlVTVVZUS1Z4dUlDQWdJQ0FnWTI5dVptbG5MbVZzWlcxbGJuUWdQU0JsYkdWdFpXNTBYRzVjYmlBZ0lDQWdJR2xtSUNoamIyNW1hV2N1YzJWaGNtTm9LU0I3WEc0Z0lDQWdJQ0FnSUM4dklITmxZWEpqYUZ4dUlDQWdJQ0FnSUNCamIyMXdiMjVsYm5SekxuQjFjMmdvYm1WM0lFUnliM0JrYjNkdVUyVmhjbU5vS0dOdmJtWnBaeWtwWEc0Z0lDQWdJQ0I5WEc0Z0lDQWdmU2xjYmlBZ2ZWeHVYRzRnSUdsbUlDaGtjbTl3Wkc5M2JuTXBJSHRjYmlBZ0lDQmtiMk4xYldWdWRDNWhaR1JGZG1WdWRFeHBjM1JsYm1WeUtDZGpiR2xqYXljc0lDaGxkbVZ1ZENrZ1BUNGdlMXh1SUNBZ0lDQWdZMjl1YzNRZ1pISnZjR1J2ZDI1TlpXNTFJRDBnWm1sdVpGUmhjbWRsZEVKNVEyeGhjM01vWlhabGJuUXVkR0Z5WjJWMExDQW5aSEp2Y0dSdmQyNHRiV1Z1ZFNjcFhHNGdJQ0FnSUNCcFppQW9aSEp2Y0dSdmQyNU5aVzUxS1NCN1hHNGdJQ0FnSUNBZ0lISmxkSFZ5Ymx4dUlDQWdJQ0FnZlZ4dVhHNGdJQ0FnSUNCamIyNXpkQ0JrY205d1pHOTNiaUE5SUdacGJtUlVZWEpuWlhSQ2VVTnNZWE56S0dWMlpXNTBMblJoY21kbGRDd2dKMlJ5YjNCa2IzZHVKeWxjYmx4dUlDQWdJQ0FnYVdZZ0tHUnliM0JrYjNkdUtTQjdYRzRnSUNBZ0lDQWdJR052Ym5OMElHUmhkR0ZVYjJkbmJHVkJkSFJ5SUQwZ1pISnZjR1J2ZDI0dVoyVjBRWFIwY21saWRYUmxLQ2RrWVhSaExYUnZaMmRzWlNjcFhHNGdJQ0FnSUNBZ0lHbG1JQ2hrWVhSaFZHOW5aMnhsUVhSMGNpQW1KaUJrWVhSaFZHOW5aMnhsUVhSMGNpQTlQVDBnVGtGTlJTQW1KaUJrY205d1pHOTNiaWtnZTF4dUlDQWdJQ0FnSUNBZ0lHTnZibk4wSUdOdmJYQnZibVZ1ZENBOUlHTnZiWEJ2Ym1WdWRITXVabWx1WkNoaklEMCtJR011WjJWMFJXeGxiV1Z1ZENncElEMDlQU0JrY205d1pHOTNiaWxjYmx4dUlDQWdJQ0FnSUNBZ0lHbG1JQ2doWTI5dGNHOXVaVzUwS1NCN1hHNGdJQ0FnSUNBZ0lDQWdJQ0J5WlhSMWNtNWNiaUFnSUNBZ0lDQWdJQ0I5WEc1Y2JpQWdJQ0FnSUNBZ0lDQmpiMjF3YjI1bGJuUXVkRzluWjJ4bEtDbGNiaUFnSUNBZ0lDQWdmVnh1SUNBZ0lDQWdmVnh1SUNBZ0lIMHBYRzRnSUgxY2JseHVJQ0J5WlhSMWNtNGdSSEp2Y0dSdmQyNVRaV0Z5WTJoY2JuMHBLQ2xjYmx4dVpYaHdiM0owSUdSbFptRjFiSFFnUkhKdmNHUnZkMjVUWldGeVkyaGNiaUlzSWk4cUtseHVJQ29nTFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMxY2JpQXFJRXhwWTJWdWMyVmtJSFZ1WkdWeUlFMUpWQ0FvYUhSMGNITTZMeTluYVhSb2RXSXVZMjl0TDNGMVlYSnJMV1JsZGk5UWFHOXViMjR0Um5KaGJXVjNiM0pyTDJKc2IySXZiV0Z6ZEdWeUwweEpRMFZPVTBVcFhHNGdLaUF0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFZ4dUlDb3ZYRzVwYlhCdmNuUWdRMjl0Y0c5dVpXNTBJR1p5YjIwZ0p5NHVMMk52YlhCdmJtVnVkQ2RjYmx4dVkyOXVjM1FnVEc5aFpHVnlJRDBnS0NncElEMCtJSHRjYmlBZ0x5b3FYRzRnSUNBcUlDMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExWeHVJQ0FnS2lCRGIyNXpkR0Z1ZEhOY2JpQWdJQ29nTFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0WEc0Z0lDQXFMMXh1WEc0Z0lHTnZibk4wSUU1QlRVVWdQU0FuYkc5aFpHVnlKMXh1SUNCamIyNXpkQ0JXUlZKVFNVOU9JRDBnSnpJdU1DNHdKMXh1SUNCamIyNXpkQ0JFUlVaQlZVeFVYMUJTVDFCRlVsUkpSVk1nUFNCN1hHNGdJQ0FnWld4bGJXVnVkRG9nYm5Wc2JDeGNiaUFnSUNCamIyeHZjam9nYm5Wc2JDeGNiaUFnSUNCemFYcGxPaUJ1ZFd4c0xGeHVJQ0I5WEc0Z0lHTnZibk4wSUVSQlZFRmZRVlJVVWxOZlVGSlBVRVZTVkVsRlV5QTlJRnRkWEc1Y2JpQWdMeW9xWEc0Z0lDQXFJQzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMVnh1SUNBZ0tpQkRiR0Z6Y3lCRVpXWnBibWwwYVc5dVhHNGdJQ0FxSUMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFZ4dUlDQWdLaTljYmx4dUlDQmpiR0Z6Y3lCTWIyRmtaWElnWlhoMFpXNWtjeUJEYjIxd2IyNWxiblFnZTF4dVhHNGdJQ0FnWTI5dWMzUnlkV04wYjNJb2IzQjBhVzl1Y3lBOUlIdDlLU0I3WEc0Z0lDQWdJQ0J6ZFhCbGNpaE9RVTFGTENCV1JWSlRTVTlPTENCRVJVWkJWVXhVWDFCU1QxQkZVbFJKUlZNc0lHOXdkR2x2Ym5Nc0lFUkJWRUZmUVZSVVVsTmZVRkpQVUVWU1ZFbEZVeXdnWm1Gc2MyVXNJR1poYkhObEtWeHVYRzRnSUNBZ0lDQXZMeUJ6WlhRZ1kyOXNiM0pjYmlBZ0lDQWdJR052Ym5OMElHeHZZV1JsY2xOd2FXNXVaWElnUFNCMGFHbHpMbWRsZEZOd2FXNXVaWElvS1Z4dUlDQWdJQ0FnYVdZZ0tIUjVjR1Z2WmlCMGFHbHpMbTl3ZEdsdmJuTXVZMjlzYjNJZ1BUMDlJQ2R6ZEhKcGJtY25YRzRnSUNBZ0lDQWdJQ1ltSUNGc2IyRmtaWEpUY0dsdWJtVnlMbU5zWVhOelRHbHpkQzVqYjI1MFlXbHVjeWhnWTI5c2IzSXRKSHQwYUdsekxtOXdkR2x2Ym5NdVkyOXNiM0o5WUNrcElIdGNiaUFnSUNBZ0lDQWdiRzloWkdWeVUzQnBibTVsY2k1amJHRnpjMHhwYzNRdVlXUmtLR0JqYjJ4dmNpMGtlM1JvYVhNdWIzQjBhVzl1Y3k1amIyeHZjbjFnS1Z4dUlDQWdJQ0FnZlZ4dVhHNGdJQ0FnSUNCMGFHbHpMbU4xYzNSdmJWTnBlbVVnUFNCMGFHbHpMbTl3ZEdsdmJuTXVjMmw2WlNBaFBUMGdiblZzYkZ4dUlDQWdJSDFjYmx4dUlDQWdJR2RsZEVOc2FXVnVkRk5wZW1Vb0tTQjdYRzRnSUNBZ0lDQnBaaUFvSVhSb2FYTXVZM1Z6ZEc5dFUybDZaU2tnZTF4dUlDQWdJQ0FnSUNCamIyNXpkQ0J6YVhwbElEMGdkR2hwY3k1dmNIUnBiMjV6TG1Wc1pXMWxiblF1WjJWMFFtOTFibVJwYm1kRGJHbGxiblJTWldOMEtDa2dJQ0FnSUNBZ0lGeHVJQ0FnSUNBZ0lDQnlaWFIxY200Z2MybDZaUzVvWldsbmFIUmNiaUFnSUNBZ0lIMWNibHh1SUNBZ0lDQWdjbVYwZFhKdUlIUm9hWE11YjNCMGFXOXVjeTV6YVhwbFhHNGdJQ0FnZlZ4dVhHNGdJQ0FnWjJWMFUzQnBibTVsY2lncElIdGNiaUFnSUNBZ0lISmxkSFZ5YmlCMGFHbHpMbTl3ZEdsdmJuTXVaV3hsYldWdWRDNXhkV1Z5ZVZObGJHVmpkRzl5S0NjdWJHOWhaR1Z5TFhOd2FXNXVaWEluS1Z4dUlDQWdJSDFjYmx4dUlDQWdJSE5vYjNjb0tTQjdYRzRnSUNBZ0lDQnBaaUFvZEdocGN5NXZjSFJwYjI1ekxtVnNaVzFsYm5RdVkyeGhjM05NYVhOMExtTnZiblJoYVc1ektDZG9hV1JsSnlrcElIdGNiaUFnSUNBZ0lDQWdkR2hwY3k1dmNIUnBiMjV6TG1Wc1pXMWxiblF1WTJ4aGMzTk1hWE4wTG5KbGJXOTJaU2duYUdsa1pTY3BYRzRnSUNBZ0lDQjlYRzVjYmlBZ0lDQWdJR052Ym5OMElITnBlbVVnUFNCMGFHbHpMbWRsZEVOc2FXVnVkRk5wZW1Vb0tWeHVJQ0FnSUNBZ2RHaHBjeTV2Y0hScGIyNXpMbk5wZW1VZ1BTQnphWHBsWEc1Y2JpQWdJQ0FnSUdsbUlDaDBhR2x6TG1OMWMzUnZiVk5wZW1VcElIdGNiaUFnSUNBZ0lDQWdkR2hwY3k1dmNIUnBiMjV6TG1Wc1pXMWxiblF1YzNSNWJHVXVkMmxrZEdnZ1BTQmdKSHQwYUdsekxtOXdkR2x2Ym5NdWMybDZaWDF3ZUdCY2JpQWdJQ0FnSUNBZ2RHaHBjeTV2Y0hScGIyNXpMbVZzWlcxbGJuUXVjM1I1YkdVdWFHVnBaMmgwSUQwZ1lDUjdkR2hwY3k1dmNIUnBiMjV6TG5OcGVtVjljSGhnWEc1Y2JpQWdJQ0FnSUNBZ1kyOXVjM1FnYkc5aFpHVnlVM0JwYm01bGNpQTlJSFJvYVhNdVoyVjBVM0JwYm01bGNpZ3BYRzRnSUNBZ0lDQWdJR3h2WVdSbGNsTndhVzV1WlhJdWMzUjViR1V1ZDJsa2RHZ2dQU0JnSkh0MGFHbHpMbTl3ZEdsdmJuTXVjMmw2Wlgxd2VHQmNiaUFnSUNBZ0lDQWdiRzloWkdWeVUzQnBibTVsY2k1emRIbHNaUzVvWldsbmFIUWdQU0JnSkh0MGFHbHpMbTl3ZEdsdmJuTXVjMmw2Wlgxd2VHQmNiaUFnSUNBZ0lIMWNibHh1SUNBZ0lDQWdjbVYwZFhKdUlIUnlkV1ZjYmlBZ0lDQjlYRzVjYmlBZ0lDQmhibWx0WVhSbEtITjBZWEowUVc1cGJXRjBhVzl1SUQwZ2RISjFaU2tnZTF4dUlDQWdJQ0FnYVdZZ0tITjBZWEowUVc1cGJXRjBhVzl1S1NCN1hHNGdJQ0FnSUNBZ0lIUm9hWE11YzJodmR5Z3BYRzRnSUNBZ0lDQjlJR1ZzYzJVZ2UxeHVJQ0FnSUNBZ0lDQjBhR2x6TG1ocFpHVW9LVnh1SUNBZ0lDQWdmVnh1WEc0Z0lDQWdJQ0JqYjI1emRDQnNiMkZrWlhKVGNHbHVibVZ5SUQwZ2RHaHBjeTVuWlhSVGNHbHVibVZ5S0NsY2JseHVJQ0FnSUNBZ2FXWWdLSE4wWVhKMFFXNXBiV0YwYVc5dUlDWW1YRzRnSUNBZ0lDQWdJQ0ZzYjJGa1pYSlRjR2x1Ym1WeUxtTnNZWE56VEdsemRDNWpiMjUwWVdsdWN5Z25iRzloWkdWeUxYTndhVzV1WlhJdFlXNXBiV0YwWldRbktTa2dlMXh1SUNBZ0lDQWdJQ0JzYjJGa1pYSlRjR2x1Ym1WeUxtTnNZWE56VEdsemRDNWhaR1FvSjJ4dllXUmxjaTF6Y0dsdWJtVnlMV0Z1YVcxaGRHVmtKeWxjYmlBZ0lDQWdJQ0FnY21WMGRYSnVJSFJ5ZFdWY2JpQWdJQ0FnSUgxY2JseHVJQ0FnSUNBZ2FXWWdLQ0Z6ZEdGeWRFRnVhVzFoZEdsdmJpQW1KbHh1SUNBZ0lDQWdJQ0JzYjJGa1pYSlRjR2x1Ym1WeUxtTnNZWE56VEdsemRDNWpiMjUwWVdsdWN5Z25iRzloWkdWeUxYTndhVzV1WlhJdFlXNXBiV0YwWldRbktTa2dlMXh1SUNBZ0lDQWdJQ0JzYjJGa1pYSlRjR2x1Ym1WeUxtTnNZWE56VEdsemRDNXlaVzF2ZG1Vb0oyeHZZV1JsY2kxemNHbHVibVZ5TFdGdWFXMWhkR1ZrSnlsY2JpQWdJQ0FnSUgxY2JseHVJQ0FnSUNBZ2NtVjBkWEp1SUhSeWRXVmNiaUFnSUNCOVhHNWNiaUFnSUNCb2FXUmxLQ2tnZTF4dUlDQWdJQ0FnYVdZZ0tDRjBhR2x6TG05d2RHbHZibk11Wld4bGJXVnVkQzVqYkdGemMweHBjM1F1WTI5dWRHRnBibk1vSjJocFpHVW5LU2tnZTF4dUlDQWdJQ0FnSUNCMGFHbHpMbTl3ZEdsdmJuTXVaV3hsYldWdWRDNWpiR0Z6YzB4cGMzUXVZV1JrS0Nkb2FXUmxKeWxjYmlBZ0lDQWdJSDFjYmx4dUlDQWdJQ0FnY21WMGRYSnVJSFJ5ZFdWY2JpQWdJQ0I5WEc1Y2JpQWdJQ0J6ZEdGMGFXTWdhV1JsYm5ScFptbGxjaWdwSUh0Y2JpQWdJQ0FnSUhKbGRIVnliaUJPUVUxRlhHNGdJQ0FnZlZ4dVhHNGdJQ0FnYzNSaGRHbGpJRjlFVDAxSmJuUmxjbVpoWTJVb2IzQjBhVzl1Y3lrZ2UxeHVJQ0FnSUNBZ2NtVjBkWEp1SUhOMWNHVnlMbDlFVDAxSmJuUmxjbVpoWTJVb1RHOWhaR1Z5TENCdmNIUnBiMjV6S1Z4dUlDQWdJSDFjYmlBZ2ZWeHVYRzRnSUhKbGRIVnliaUJNYjJGa1pYSmNibjBwS0NsY2JseHVaWGh3YjNKMElHUmxabUYxYkhRZ1RHOWhaR1Z5WEc0aUxDSXZLaXBjYmlvZ0xTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMWNiaW9nVEdsalpXNXpaV1FnZFc1a1pYSWdUVWxVSUNob2RIUndjem92TDJkcGRHaDFZaTVqYjIwdmNYVmhjbXN0WkdWMkwxQm9iMjV2YmkxR2NtRnRaWGR2Y21zdllteHZZaTl0WVhOMFpYSXZURWxEUlU1VFJTbGNiaW9nTFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMxY2Jpb3ZYRzVwYlhCdmNuUWdSWFpsYm5RZ1puSnZiU0FuTGk0dkxpNHZZMjl0Ylc5dUwyVjJaVzUwY3lkY2JtbHRjRzl5ZENCRGIyMXdiMjVsYm5RZ1puSnZiU0FuTGk0dlkyOXRjRzl1Wlc1MEoxeHVYRzVqYjI1emRDQk9iM1JwWm1sallYUnBiMjRnUFNBb0tDa2dQVDRnZTF4dUlDQXZLaXBjYmlBZ0lDb2dMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRYRzRnSUNvZ1EyOXVjM1JoYm5SelhHNGdJQ29nTFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0WEc0Z0lDb3ZYRzVjYmlBZ1kyOXVjM1FnVGtGTlJTQTlJQ2R1YjNScFptbGpZWFJwYjI0blhHNGdJR052Ym5OMElGWkZVbE5KVDA0Z1BTQW5NaTR3TGpBblhHNGdJR052Ym5OMElFUkZSa0ZWVEZSZlVGSlBVRVZTVkVsRlV5QTlJSHRjYmlBZ0lDQmxiR1Z0Wlc1ME9pQnVkV3hzTEZ4dUlDQWdJRzFsYzNOaFoyVTZJQ2NuTEZ4dUlDQWdJSE5vYjNkQ2RYUjBiMjQ2SUhSeWRXVXNYRzRnSUNBZ2RHbHRaVzkxZERvZ2JuVnNiQ3hjYmlBZ0lDQmlZV05yWjNKdmRXNWtPaUFuY0hKcGJXRnllU2NzWEc0Z0lIMWNiaUFnWTI5dWMzUWdSRUZVUVY5QlZGUlNVMTlRVWs5UVJWSlVTVVZUSUQwZ1cxeHVJQ0FnSUNkMGFXMWxiM1YwSnl4Y2JpQWdYVnh1WEc0Z0lDOHFLbHh1SUNBZ0tpQXRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMWNiaUFnSUNvZ1EyeGhjM01nUkdWbWFXNXBkR2x2Ymx4dUlDQWdLaUF0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzFjYmlBZ0lDb3ZYRzVjYmlBZ1kyeGhjM01nVG05MGFXWnBZMkYwYVc5dUlHVjRkR1Z1WkhNZ1EyOXRjRzl1Wlc1MElIdGNibHh1SUNBZ0lHTnZibk4wY25WamRHOXlLRzl3ZEdsdmJuTWdQU0I3ZlNrZ2UxeHVJQ0FnSUNBZ2MzVndaWElvVGtGTlJTd2dWa1ZTVTBsUFRpd2dSRVZHUVZWTVZGOVFVazlRUlZKVVNVVlRMQ0J2Y0hScGIyNXpMQ0JFUVZSQlgwRlVWRkpUWDFCU1QxQkZVbFJKUlZNc0lIUnlkV1VzSUdaaGJITmxLVnh1WEc0Z0lDQWdJQ0IwYUdsekxuUmxiWEJzWVhSbElEMGdKeWNnSzF4dUlDQWdJQ0FnSnp4a2FYWWdZMnhoYzNNOVhDSnViM1JwWm1sallYUnBiMjVjSWo0bklDdGNiaUFnSUNBZ0lDQWdKenhrYVhZZ1kyeGhjM005WENKdWIzUnBabWxqWVhScGIyNHRhVzV1WlhKY0lqNG5JQ3RjYmlBZ0lDQWdJQ0FnSUNBblBHUnBkaUJqYkdGemN6MWNJbTFsYzNOaFoyVmNJajQ4TDJScGRqNG5JQ3RjYmlBZ0lDQWdJQ0FnSUNBblBHSjFkSFJ2YmlCMGVYQmxQVndpWW5WMGRHOXVYQ0lnWTJ4aGMzTTlYQ0pqYkc5elpWd2lJR1JoZEdFdFpHbHpiV2x6Y3oxY0ltNXZkR2xtYVdOaGRHbHZibHdpSUdGeWFXRXRiR0ZpWld3OVhDSkRiRzl6WlZ3aVBpY2dLMXh1SUNBZ0lDQWdJQ0FnSUNBZ0p6eHpjR0Z1SUdGeWFXRXRhR2xrWkdWdVBWd2lkSEoxWlZ3aVBpWjBhVzFsY3pzOEwzTndZVzQrSnlBclhHNGdJQ0FnSUNBZ0lDQWdKend2WW5WMGRHOXVQaWNnSzF4dUlDQWdJQ0FnSUNBblBDOWthWFkrSnlBclhHNGdJQ0FnSUNBblBDOWthWFkrSjF4dVhHNGdJQ0FnSUNCcFppQW9kR2hwY3k1a2VXNWhiV2xqUld4bGJXVnVkQ2tnZTF4dUlDQWdJQ0FnSUNCMGFHbHpMbUoxYVd4a0tDbGNiaUFnSUNBZ0lIMWNibHh1SUNBZ0lDQWdkR2hwY3k1MGFXMWxiM1YwUTJGc2JHSmhZMnNnUFNCdWRXeHNYRzRnSUNBZ2ZWeHVYRzRnSUNBZ1luVnBiR1FvS1NCN1hHNGdJQ0FnSUNCamIyNXpkQ0JpZFdsc1pHVnlJRDBnWkc5amRXMWxiblF1WTNKbFlYUmxSV3hsYldWdWRDZ25aR2wySnlsY2JseHVJQ0FnSUNBZ1luVnBiR1JsY2k1cGJtNWxja2hVVFV3Z1BTQjBhR2x6TG5SbGJYQnNZWFJsWEc1Y2JpQWdJQ0FnSUhSb2FYTXViM0IwYVc5dWN5NWxiR1Z0Wlc1MElEMGdZblZwYkdSbGNpNW1hWEp6ZEVOb2FXeGtYRzVjYmlBZ0lDQWdJQzh2SUhSbGVIUWdiV1Z6YzJGblpWeHVJQ0FnSUNBZ2RHaHBjeTV2Y0hScGIyNXpMbVZzWlcxbGJuUXVjWFZsY25sVFpXeGxZM1J2Y2lnbkxtMWxjM05oWjJVbktTNXBibTVsY2toVVRVd2dQU0IwYUdsekxtOXdkR2x2Ym5NdWJXVnpjMkZuWlZ4dVhHNGdJQ0FnSUNCcFppQW9JWFJvYVhNdWIzQjBhVzl1Y3k1emFHOTNRblYwZEc5dUtTQjdYRzRnSUNBZ0lDQWdJSFJvYVhNdWIzQjBhVzl1Y3k1bGJHVnRaVzUwTG5GMVpYSjVVMlZzWldOMGIzSW9KMkoxZEhSdmJpY3BMbk4wZVd4bExtUnBjM0JzWVhrZ1BTQW5ibTl1WlNkY2JpQWdJQ0FnSUgxY2JseHVJQ0FnSUNBZ1pHOWpkVzFsYm5RdVltOWtlUzVoY0hCbGJtUkRhR2xzWkNoMGFHbHpMbTl3ZEdsdmJuTXVaV3hsYldWdWRDbGNibHh1SUNBZ0lDQWdkR2hwY3k1elpYUkJkSFJ5YVdKMWRHVnpLQ2xjYmlBZ0lDQjlYRzVjYmlBZ0lDQnphRzkzS0NrZ2UxeHVJQ0FnSUNBZ2FXWWdLSFJvYVhNdWIzQjBhVzl1Y3k1bGJHVnRaVzUwSUQwOVBTQnVkV3hzS1NCN1hHNGdJQ0FnSUNBZ0lDOHZJR0oxYVd4a0lHRnVaQ0JwYm5ObGNuUWdZU0J1WlhjZ1JFOU5JR1ZzWlcxbGJuUmNiaUFnSUNBZ0lDQWdkR2hwY3k1aWRXbHNaQ2dwWEc0Z0lDQWdJQ0I5WEc1Y2JpQWdJQ0FnSUdsbUlDaDBhR2x6TG05d2RHbHZibk11Wld4bGJXVnVkQzVqYkdGemMweHBjM1F1WTI5dWRHRnBibk1vSjNOb2IzY25LU2tnZTF4dUlDQWdJQ0FnSUNCeVpYUjFjbTRnWm1Gc2MyVmNiaUFnSUNBZ0lIMWNibHh1SUNBZ0lDQWdMeThnY21WelpYUWdZMjlzYjNKY2JpQWdJQ0FnSUdsbUlDaDBhR2x6TG05d2RHbHZibk11WW1GamEyZHliM1Z1WkNrZ2UxeHVJQ0FnSUNBZ0lDQjBhR2x6TG05d2RHbHZibk11Wld4bGJXVnVkQzV5WlcxdmRtVkJkSFJ5YVdKMWRHVW9KMk5zWVhOekp5bGNiaUFnSUNBZ0lDQWdkR2hwY3k1dmNIUnBiMjV6TG1Wc1pXMWxiblF1YzJWMFFYUjBjbWxpZFhSbEtDZGpiR0Z6Y3ljc0lDZHViM1JwWm1sallYUnBiMjRuS1Z4dVhHNGdJQ0FnSUNBZ0lIUm9hWE11YjNCMGFXOXVjeTVsYkdWdFpXNTBMbU5zWVhOelRHbHpkQzVoWkdRb1lHSm5MU1I3ZEdocGN5NXZjSFJwYjI1ekxtSmhZMnRuY205MWJtUjlZQ2xjYmlBZ0lDQWdJQ0FnZEdocGN5NXZjSFJwYjI1ekxtVnNaVzFsYm5RdWNYVmxjbmxUWld4bFkzUnZjaWduWW5WMGRHOXVKeWt1WTJ4aGMzTk1hWE4wTG1Ga1pDaGdZblJ1TFNSN2RHaHBjeTV2Y0hScGIyNXpMbUpoWTJ0bmNtOTFibVI5WUNsY2JpQWdJQ0FnSUgxY2JseHVJQ0FnSUNBZ2FXWWdLSFJvYVhNdWIzQjBhVzl1Y3k1emFHOTNRblYwZEc5dUtTQjdYRzRnSUNBZ0lDQWdJQzh2SUdGMGRHRmphQ0IwYUdVZ1luVjBkRzl1SUdoaGJtUnNaWEpjYmlBZ0lDQWdJQ0FnWTI5dWMzUWdZblYwZEc5dVJXeGxiV1Z1ZENBOUlIUm9hWE11YjNCMGFXOXVjeTVsYkdWdFpXNTBMbkYxWlhKNVUyVnNaV04wYjNJb0oySjFkSFJ2YmljcFhHNGdJQ0FnSUNBZ0lIUm9hWE11Y21WbmFYTjBaWEpGYkdWdFpXNTBLSHNnZEdGeVoyVjBPaUJpZFhSMGIyNUZiR1Z0Wlc1MExDQmxkbVZ1ZERvZ0oyTnNhV05ySnlCOUtWeHVJQ0FnSUNBZ2ZWeHVYRzRnSUNBZ0lDQnpaWFJVYVcxbGIzVjBLQ2dwSUQwK0lIdGNiaUFnSUNBZ0lDQWdkR2hwY3k1dmNIUnBiMjV6TG1Wc1pXMWxiblF1WTJ4aGMzTk1hWE4wTG1Ga1pDZ25jMmh2ZHljcFhHNWNiaUFnSUNBZ0lDQWdMeThnYzJWMElIQnZjMmwwYVc5dVhHNGdJQ0FnSUNBZ0lHTnZibk4wSUdGamRHbDJaVTV2ZEdsbWFXTmhkR2x2Ym5NZ1BTQmtiMk4xYldWdWRDNXhkV1Z5ZVZObGJHVmpkRzl5UVd4c0tDY3VibTkwYVdacFkyRjBhVzl1TG5Ob2IzY25LU0I4ZkNCYlhWeHVJQ0FnSUNBZ0lDQnNaWFFnY0hWemFFUnBjM1JoYm1ObElEMGdNRnh1SUNBZ0lDQWdJQ0JoWTNScGRtVk9iM1JwWm1sallYUnBiMjV6TG1admNrVmhZMmdvS0c1dmRHbG1hV05oZEdsdmJpa2dQVDRnZTF4dUlDQWdJQ0FnSUNBZ0lHbG1JQ2gwYUdsekxtOXdkR2x2Ym5NdVpXeGxiV1Z1ZENBaFBUMGdibTkwYVdacFkyRjBhVzl1S1NCN1hHNGdJQ0FnSUNBZ0lDQWdJQ0JqYjI1emRDQnpkSGxzWlNBOUlHZGxkRU52YlhCMWRHVmtVM1I1YkdVb2JtOTBhV1pwWTJGMGFXOXVLVnh1SUNBZ0lDQWdJQ0FnSUNBZ2NIVnphRVJwYzNSaGJtTmxJQ3M5SUc1dmRHbG1hV05oZEdsdmJpNXZabVp6WlhSSVpXbG5hSFFnS3lCd1lYSnpaVWx1ZENoemRIbHNaUzV0WVhKbmFXNUNiM1IwYjIwc0lERXdLVnh1SUNBZ0lDQWdJQ0FnSUgxY2JpQWdJQ0FnSUNBZ2ZTbGNibHh1SUNBZ0lDQWdJQ0IwYUdsekxtOXdkR2x2Ym5NdVpXeGxiV1Z1ZEM1emRIbHNaUzUwY21GdWMyWnZjbTBnUFNCZ2RISmhibk5zWVhSbFdTZ2tlM0IxYzJoRWFYTjBZVzVqWlgxd2VDbGdYRzVjYmlBZ0lDQWdJQ0FnZEdocGN5NTBjbWxuWjJWeVJYWmxiblFvUlhabGJuUXVVMGhQVnlsY2JseHVJQ0FnSUNBZ0lDQmpiMjV6ZENCdmJsTm9iM2R1SUQwZ0tDa2dQVDRnZTF4dUlDQWdJQ0FnSUNBZ0lIUm9hWE11ZEhKcFoyZGxja1YyWlc1MEtFVjJaVzUwTGxOSVQxZE9LVnh1SUNBZ0lDQWdJQ0FnSUhSb2FYTXViM0IwYVc5dWN5NWxiR1Z0Wlc1MExuSmxiVzkyWlVWMlpXNTBUR2x6ZEdWdVpYSW9SWFpsYm5RdVZGSkJUbE5KVkVsUFRsOUZUa1FzSUc5dVUyaHZkMjRwWEc0Z0lDQWdJQ0FnSUgxY2JseHVJQ0FnSUNBZ0lDQjBhR2x6TG05d2RHbHZibk11Wld4bGJXVnVkQzVoWkdSRmRtVnVkRXhwYzNSbGJtVnlLRVYyWlc1MExsUlNRVTVUU1ZSSlQwNWZSVTVFTENCdmJsTm9iM2R1S1Z4dVhHNGdJQ0FnSUNCOUxDQXhLVnh1WEc0Z0lDQWdJQ0JwWmlBb1RuVnRZbVZ5TG1selNXNTBaV2RsY2loMGFHbHpMbTl3ZEdsdmJuTXVkR2x0Wlc5MWRDa2dKaVlnZEdocGN5NXZjSFJwYjI1ekxuUnBiV1Z2ZFhRZ1BpQXdLU0I3WEc0Z0lDQWdJQ0FnSUM4dklHbG1JSFJvWlhKbElHbHpJR0VnZEdsdFpXOTFkQ3dnWVhWMGJ5Qm9hV1JsSUhSb1pTQnViM1JwWm1sallYUnBiMjVjYmlBZ0lDQWdJQ0FnZEdocGN5NTBhVzFsYjNWMFEyRnNiR0poWTJzZ1BTQnpaWFJVYVcxbGIzVjBLQ2dwSUQwK0lIdGNiaUFnSUNBZ0lDQWdJQ0IwYUdsekxtaHBaR1VvS1Z4dUlDQWdJQ0FnSUNCOUxDQjBhR2x6TG05d2RHbHZibk11ZEdsdFpXOTFkQ0FySURFcFhHNGdJQ0FnSUNCOVhHNWNiaUFnSUNBZ0lISmxkSFZ5YmlCMGNuVmxYRzRnSUNBZ2ZWeHVYRzRnSUNBZ2FHbGtaU2dwSUh0Y2JpQWdJQ0FnSUM4cVhHNGdJQ0FnSUNBZ0tpQndjbVYyWlc1MElIUnZJR05zYjNObElHRWdibTkwYVdacFkyRjBhVzl1SUhkcGRHZ2dZU0IwYVcxbGIzVjBYRzRnSUNBZ0lDQWdLaUJwWmlCMGFHVWdkWE5sY2lCb1lYTWdZV3h5WldGa2VTQmpiR2xqYTJWa0lHOXVJSFJvWlNCaWRYUjBiMjVjYmlBZ0lDQWdJQ0FxTDF4dUlDQWdJQ0FnYVdZZ0tIUm9hWE11ZEdsdFpXOTFkRU5oYkd4aVlXTnJLU0I3WEc0Z0lDQWdJQ0FnSUdOc1pXRnlWR2x0Wlc5MWRDaDBhR2x6TG5ScGJXVnZkWFJEWVd4c1ltRmpheWxjYmlBZ0lDQWdJQ0FnZEdocGN5NTBhVzFsYjNWMFEyRnNiR0poWTJzZ1BTQnVkV3hzWEc0Z0lDQWdJQ0I5WEc1Y2JpQWdJQ0FnSUdsbUlDZ2hkR2hwY3k1dmNIUnBiMjV6TG1Wc1pXMWxiblF1WTJ4aGMzTk1hWE4wTG1OdmJuUmhhVzV6S0NkemFHOTNKeWtwSUh0Y2JpQWdJQ0FnSUNBZ2NtVjBkWEp1SUdaaGJITmxYRzRnSUNBZ0lDQjlYRzVjYmlBZ0lDQWdJSFJvYVhNdWRISnBaMmRsY2tWMlpXNTBLRVYyWlc1MExraEpSRVVwWEc1Y2JpQWdJQ0FnSUdsbUlDaDBhR2x6TG05d2RHbHZibk11YzJodmQwSjFkSFJ2YmlrZ2UxeHVJQ0FnSUNBZ0lDQmpiMjV6ZENCaWRYUjBiMjVGYkdWdFpXNTBJRDBnZEdocGN5NXZjSFJwYjI1ekxtVnNaVzFsYm5RdWNYVmxjbmxUWld4bFkzUnZjaWduWW5WMGRHOXVKeWxjYmlBZ0lDQWdJQ0FnZEdocGN5NTFibkpsWjJsemRHVnlSV3hsYldWdWRDaDdJSFJoY21kbGREb2dZblYwZEc5dVJXeGxiV1Z1ZEN3Z1pYWmxiblE2SUNkamJHbGpheWNnZlNsY2JpQWdJQ0FnSUgxY2JseHVJQ0FnSUNBZ2RHaHBjeTV2Y0hScGIyNXpMbVZzWlcxbGJuUXVZMnhoYzNOTWFYTjBMbkpsYlc5MlpTZ25jMmh2ZHljcFhHNGdJQ0FnSUNCMGFHbHpMbTl3ZEdsdmJuTXVaV3hsYldWdWRDNWpiR0Z6YzB4cGMzUXVZV1JrS0Nkb2FXUmxKeWxjYmx4dUlDQWdJQ0FnWTI5dWMzUWdiMjVJYVdSa1pXNGdQU0FvS1NBOVBpQjdYRzRnSUNBZ0lDQWdJSFJvYVhNdWIzQjBhVzl1Y3k1bGJHVnRaVzUwTG5KbGJXOTJaVVYyWlc1MFRHbHpkR1Z1WlhJb1JYWmxiblF1VkZKQlRsTkpWRWxQVGw5RlRrUXNJRzl1U0dsa1pHVnVLVnh1SUNBZ0lDQWdJQ0IwYUdsekxtOXdkR2x2Ym5NdVpXeGxiV1Z1ZEM1amJHRnpjMHhwYzNRdWNtVnRiM1psS0Nkb2FXUmxKeWxjYmx4dUlDQWdJQ0FnSUNCMGFHbHpMblJ5YVdkblpYSkZkbVZ1ZENoRmRtVnVkQzVJU1VSRVJVNHBYRzVjYmlBZ0lDQWdJQ0FnYVdZZ0tIUm9hWE11WkhsdVlXMXBZMFZzWlcxbGJuUXBJSHRjYmlBZ0lDQWdJQ0FnSUNCa2IyTjFiV1Z1ZEM1aWIyUjVMbkpsYlc5MlpVTm9hV3hrS0hSb2FYTXViM0IwYVc5dWN5NWxiR1Z0Wlc1MEtWeHVJQ0FnSUNBZ0lDQWdJSFJvYVhNdWIzQjBhVzl1Y3k1bGJHVnRaVzUwSUQwZ2JuVnNiRnh1SUNBZ0lDQWdJQ0I5WEc0Z0lDQWdJQ0I5WEc1Y2JpQWdJQ0FnSUhSb2FYTXViM0IwYVc5dWN5NWxiR1Z0Wlc1MExtRmtaRVYyWlc1MFRHbHpkR1Z1WlhJb1JYWmxiblF1VkZKQlRsTkpWRWxQVGw5RlRrUXNJRzl1U0dsa1pHVnVLVnh1WEc0Z0lDQWdJQ0J5WlhSMWNtNGdkSEoxWlZ4dUlDQWdJSDFjYmx4dUlDQWdJRzl1Uld4bGJXVnVkRVYyWlc1MEtDa2dlMXh1SUNBZ0lDQWdkR2hwY3k1b2FXUmxLQ2xjYmlBZ0lDQjlYRzVjYmlBZ0lDQnpkR0YwYVdNZ2FXUmxiblJwWm1sbGNpZ3BJSHRjYmlBZ0lDQWdJSEpsZEhWeWJpQk9RVTFGWEc0Z0lDQWdmVnh1WEc0Z0lDQWdjM1JoZEdsaklGOUVUMDFKYm5SbGNtWmhZMlVvYjNCMGFXOXVjeWtnZTF4dUlDQWdJQ0FnY21WMGRYSnVJSE4xY0dWeUxsOUVUMDFKYm5SbGNtWmhZMlVvVG05MGFXWnBZMkYwYVc5dUxDQnZjSFJwYjI1ektWeHVJQ0FnSUgxY2JpQWdmVnh1WEc0Z0lISmxkSFZ5YmlCT2IzUnBabWxqWVhScGIyNWNibjBwS0NsY2JseHVaWGh3YjNKMElHUmxabUYxYkhRZ1RtOTBhV1pwWTJGMGFXOXVYRzRpTENJdktpcGNiaUFxSUMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdFhHNGdLaUJNYVdObGJuTmxaQ0IxYm1SbGNpQk5TVlFnS0doMGRIQnpPaTh2WjJsMGFIVmlMbU52YlM5eGRXRnlheTFrWlhZdlVHaHZibTl1TFVaeVlXMWxkMjl5YXk5aWJHOWlMMjFoYzNSbGNpOU1TVU5GVGxORktWeHVJQ29nTFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMxY2JpQXFMMXh1YVcxd2IzSjBJRVYyWlc1MElHWnliMjBnSnk0dUx5NHVMMk52YlcxdmJpOWxkbVZ1ZEhNblhHNXBiWEJ2Y25RZ1EyOXRjRzl1Wlc1MElHWnliMjBnSnk0dUwyTnZiWEJ2Ym1WdWRDZGNibWx0Y0c5eWRDQjdJR2RsZEVGMGRISnBZblYwWlhORGIyNW1hV2NnZlNCbWNtOXRJQ2N1TGk5amIyMXdiMjVsYm5STllXNWhaMlZ5SjF4dWFXMXdiM0owSUhzZ1ptbHVaRlJoY21kbGRFSjVRWFIwY2lCOUlHWnliMjBnSnk0dUx5NHVMMk52YlcxdmJpOTFkR2xzY3lkY2JseHVZMjl1YzNRZ1QyWm1RMkZ1ZG1GeklEMGdLQ2dwSUQwK0lIdGNiaUFnTHlvcVhHNGdJQ0FxSUMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFZ4dUlDQWdLaUJEYjI1emRHRnVkSE5jYmlBZ0lDb2dMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRYRzRnSUNBcUwxeHVYRzRnSUdOdmJuTjBJRTVCVFVVZ1BTQW5iMlptTFdOaGJuWmhjeWRjYmlBZ1kyOXVjM1FnVmtWU1UwbFBUaUE5SUNjeUxqQXVNQ2RjYmlBZ1kyOXVjM1FnUWtGRFMwUlNUMUJmVTBWTVJVTlVUMUlnUFNBbmIyWm1MV05oYm5aaGN5MWlZV05yWkhKdmNDZGNiaUFnWTI5dWMzUWdSRVZHUVZWTVZGOVFVazlRUlZKVVNVVlRJRDBnZTF4dUlDQWdJR1ZzWlcxbGJuUTZJRzUxYkd3c1hHNGdJQ0FnWVhOcFpHVTZJSHRjYmlBZ0lDQWdJRzFrT2lCbVlXeHpaU3hjYmlBZ0lDQWdJR3huT2lCbVlXeHpaU3hjYmlBZ0lDQWdJSGhzT2lCbVlXeHpaU3hjYmlBZ0lDQjlMRnh1SUNCOVhHNGdJR052Ym5OMElFUkJWRUZmUVZSVVVsTmZVRkpQVUVWU1ZFbEZVeUE5SUZ0Y2JpQWdJQ0FuWVhOcFpHVW5MRnh1SUNCZFhHNWNiaUFnTHlvcVhHNGdJQ0FxSUMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFZ4dUlDQWdLaUJEYkdGemN5QkVaV1pwYm1sMGFXOXVYRzRnSUNBcUlDMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExWeHVJQ0FnS2k5Y2JseHVJQ0JqYkdGemN5QlBabVpEWVc1MllYTWdaWGgwWlc1a2N5QkRiMjF3YjI1bGJuUWdlMXh1WEc0Z0lDQWdZMjl1YzNSeWRXTjBiM0lvYjNCMGFXOXVjeUE5SUh0OUtTQjdYRzRnSUNBZ0lDQnpkWEJsY2loT1FVMUZMQ0JXUlZKVFNVOU9MQ0JFUlVaQlZVeFVYMUJTVDFCRlVsUkpSVk1zSUc5d2RHbHZibk1zSUVSQlZFRmZRVlJVVWxOZlVGSlBVRVZTVkVsRlV5d2dabUZzYzJVc0lIUnlkV1VwWEc1Y2JpQWdJQ0FnSUhSb2FYTXVkWE5sUW1GamEyUnliM0FnUFNCMGNuVmxYRzRnSUNBZ0lDQjBhR2x6TG1OMWNuSmxiblJYYVdSMGFDQTlJRzUxYkd4Y2JpQWdJQ0FnSUhSb2FYTXVZVzVwYldGMFpTQTlJSFJ5ZFdWY2JseHVJQ0FnSUNBZ2RHaHBjeTVrYVhKbFkzUnBiMjV6SUQwZ1d5ZHNaV1owSnl3Z0ozSnBaMmgwSjExY2JseHVJQ0FnSUNBZ1kyOXVjM1FnYzIwZ1BTQjdJRzVoYldVNklDZHpiU2NzSUcxbFpHbGhPaUIzYVc1a2IzY3ViV0YwWTJoTlpXUnBZU2duS0cxcGJpMTNhV1IwYURvZ01YQjRLU2NwSUgxY2JpQWdJQ0FnSUdOdmJuTjBJRzFrSUQwZ2V5QnVZVzFsT2lBbmJXUW5MQ0J0WldScFlUb2dkMmx1Wkc5M0xtMWhkR05vVFdWa2FXRW9KeWh0YVc0dGQybGtkR2c2SURjMk9IQjRLU2NwSUgxY2JpQWdJQ0FnSUdOdmJuTjBJR3huSUQwZ2V5QnVZVzFsT2lBbmJHY25MQ0J0WldScFlUb2dkMmx1Wkc5M0xtMWhkR05vVFdWa2FXRW9KeWh0YVc0dGQybGtkR2c2SURrNU1uQjRLU2NwSUgxY2JpQWdJQ0FnSUdOdmJuTjBJSGhzSUQwZ2V5QnVZVzFsT2lBbmVHd25MQ0J0WldScFlUb2dkMmx1Wkc5M0xtMWhkR05vVFdWa2FXRW9KeWh0YVc0dGQybGtkR2c2SURFeU1EQndlQ2tuS1NCOVhHNWNiaUFnSUNBZ0lIUm9hWE11YzJsNlpYTWdQU0JiYzIwc0lHMWtMQ0JzWnl3Z2VHeGRMbkpsZG1WeWMyVW9LVnh1WEc0Z0lDQWdJQ0IwYUdsekxtTm9aV05yUkdseVpXTjBhVzl1S0NsY2JpQWdJQ0FnSUhSb2FYTXVZMmhsWTJ0WGFXUjBhQ2dwWEc1Y2JpQWdJQ0FnSUhkcGJtUnZkeTVoWkdSRmRtVnVkRXhwYzNSbGJtVnlLQ2R5WlhOcGVtVW5MQ0FvS1NBOVBpQjBhR2x6TG1Ob1pXTnJWMmxrZEdnb0tTd2dabUZzYzJVcElDQWdJQ0FnWEc0Z0lDQWdmVnh1WEc0Z0lDQWdZMmhsWTJ0RWFYSmxZM1JwYjI0b0tTQjdYRzRnSUNBZ0lDQjBhR2x6TG1ScGNtVmpkR2x2Ym5NdVpYWmxjbmtvS0dScGNtVmpkR2x2YmlrZ1BUNGdlMXh1SUNBZ0lDQWdJQ0JwWmlBb2RHaHBjeTV2Y0hScGIyNXpMbVZzWlcxbGJuUXVZMnhoYzNOTWFYTjBMbU52Ym5SaGFXNXpLR0J2Wm1ZdFkyRnVkbUZ6TFNSN1pHbHlaV04wYVc5dWZXQXBLU0I3WEc0Z0lDQWdJQ0FnSUNBZ2RHaHBjeTVrYVhKbFkzUnBiMjRnUFNCa2FYSmxZM1JwYjI1Y2JpQWdJQ0FnSUNBZ0lDQnlaWFIxY200Z1ptRnNjMlZjYmlBZ0lDQWdJQ0FnZlZ4dUlDQWdJQ0FnSUNCeVpYUjFjbTRnZEhKMVpWeHVJQ0FnSUNBZ2ZTbGNiaUFnSUNCOVhHNWNiaUFnSUNCamFHVmphMWRwWkhSb0tDa2dlMXh1SUNBZ0lDQWdhV1lnS0NFb0oyMWhkR05vVFdWa2FXRW5JR2x1SUhkcGJtUnZkeWtwSUh0Y2JpQWdJQ0FnSUNBZ2NtVjBkWEp1WEc0Z0lDQWdJQ0I5WEc1Y2JpQWdJQ0FnSUhSb2FYTXVjMmw2WlhNdVpYWmxjbmtvS0hOcGVtVXBJRDArSUh0Y2JpQWdJQ0FnSUNBZ1kyOXVjM1FnYldGMFkyZ2dQU0J6YVhwbExtMWxaR2xoTG0xbFpHbGhMbTFoZEdOb0tDOWJZUzE2WFQ4dGQybGtkR2c2WEZ4elB5aGJNQzA1WFNzcEx5bGNibHh1SUNBZ0lDQWdJQ0JwWmlBb2JXRjBZMmdwSUh0Y2JpQWdJQ0FnSUNBZ0lDQnBaaUFvYzJsNlpTNXRaV1JwWVM1dFlYUmphR1Z6S1NCN1hHNGdJQ0FnSUNBZ0lDQWdJQ0JwWmlBb2RHaHBjeTVqZFhKeVpXNTBWMmxrZEdnZ0lUMDlJSE5wZW1VdWJtRnRaU2tnZTF4dUlDQWdJQ0FnSUNBZ0lDQWdJQ0IwYUdsekxuTmxkRUZ6YVdSbEtITnBlbVV1Ym1GdFpTbGNiaUFnSUNBZ0lDQWdJQ0FnSUgxY2JpQWdJQ0FnSUNBZ0lDQWdJSFJvYVhNdVkzVnljbVZ1ZEZkcFpIUm9JRDBnYzJsNlpTNXVZVzFsWEc0Z0lDQWdJQ0FnSUNBZ0lDQnlaWFIxY200Z1ptRnNjMlZjYmlBZ0lDQWdJQ0FnSUNCOVhHNGdJQ0FnSUNBZ0lIMWNibHh1SUNBZ0lDQWdJQ0J5WlhSMWNtNGdkSEoxWlZ4dUlDQWdJQ0FnZlNsY2JpQWdJQ0I5WEc1Y2JpQWdJQ0J3Y21WMlpXNTBRMnh2YzJGaWJHVW9LU0I3WEc0Z0lDQWdJQ0J5WlhSMWNtNGdjM1Z3WlhJdWNISmxkbVZ1ZEVOc2IzTmhZbXhsS0NrZ2ZId2dkR2hwY3k1dmNIUnBiMjV6TG1GemFXUmxXM1JvYVhNdVkzVnljbVZ1ZEZkcFpIUm9YU0E5UFQwZ2RISjFaVnh1SUNBZ0lIMWNibHh1SUNBZ0lITmxkRUZ6YVdSbEtHNWhiV1VwSUh0Y2JpQWdJQ0FnSUdOdmJuTjBJR052Ym5SbGJuUWdQU0JrYjJOMWJXVnVkQzVpYjJSNVhHNWNiaUFnSUNBZ0lHbG1JQ2gwYUdsekxtOXdkR2x2Ym5NdVlYTnBaR1ZiYm1GdFpWMGdQVDA5SUhSeWRXVXBJSHRjYmlBZ0lDQWdJQ0FnYVdZZ0tDRmpiMjUwWlc1MExtTnNZWE56VEdsemRDNWpiMjUwWVdsdWN5aGdiMlptTFdOaGJuWmhjeTFoYzJsa1pTMGtlM1JvYVhNdVpHbHlaV04wYVc5dWZXQXBLU0I3WEc0Z0lDQWdJQ0FnSUNBZ1kyOXVkR1Z1ZEM1amJHRnpjMHhwYzNRdVlXUmtLR0J2Wm1ZdFkyRnVkbUZ6TFdGemFXUmxMU1I3ZEdocGN5NWthWEpsWTNScGIyNTlZQ2xjYmlBZ0lDQWdJQ0FnZlZ4dVhHNGdJQ0FnSUNBZ0lIUm9hWE11ZFhObFFtRmphMlJ5YjNBZ1BTQm1ZV3h6WlZ4dVhHNGdJQ0FnSUNBZ0lDOHZJR0YyYjJsa0lHRnVhVzFoZEdsdmJpQmllU0J6WlhSMGFXNW5JR0Z1YVcxaGRHVWdkRzhnWm1Gc2MyVmNiaUFnSUNBZ0lDQWdkR2hwY3k1aGJtbHRZWFJsSUQwZ1ptRnNjMlZjYmlBZ0lDQWdJQ0FnZEdocGN5NXphRzkzS0NsY2JpQWdJQ0FnSUNBZ0x5OGdjbVZ0YjNabElIQnlaWFpwYjNWeklHSmhZMnRrY205d1hHNGdJQ0FnSUNBZ0lIUm9hWE11Y21WdGIzWmxRbUZqYTJSeWIzQW9LVnh1SUNBZ0lDQWdmU0JsYkhObElIdGNiaUFnSUNBZ0lDQWdhV1lnS0dOdmJuUmxiblF1WTJ4aGMzTk1hWE4wTG1OdmJuUmhhVzV6S0dCdlptWXRZMkZ1ZG1GekxXRnphV1JsTFNSN2RHaHBjeTVrYVhKbFkzUnBiMjU5WUNrcElIdGNiaUFnSUNBZ0lDQWdJQ0JqYjI1MFpXNTBMbU5zWVhOelRHbHpkQzV5WlcxdmRtVW9ZRzltWmkxallXNTJZWE10WVhOcFpHVXRKSHQwYUdsekxtUnBjbVZqZEdsdmJuMWdLVnh1SUNBZ0lDQWdJQ0I5WEc1Y2JpQWdJQ0FnSUNBZ2RHaHBjeTVvYVdSbEtDbGNiaUFnSUNBZ0lDQWdkR2hwY3k1MWMyVkNZV05yWkhKdmNDQTlJSFJ5ZFdWY2JpQWdJQ0FnSUNBZ2RHaHBjeTVoYm1sdFlYUmxJRDBnZEhKMVpWeHVJQ0FnSUNBZ2ZWeHVJQ0FnSUgxY2JseHVJQ0FnSUc5dVJXeGxiV1Z1ZEVWMlpXNTBLR1YyWlc1MEtTQjdYRzRnSUNBZ0lDQnBaaUFvWlhabGJuUXVkSGx3WlNBOVBUMGdKMnRsZVhWd0p5QW1KaUJsZG1WdWRDNXJaWGxEYjJSbElDRTlQU0F5TnlBbUppQmxkbVZ1ZEM1clpYbERiMlJsSUNFOVBTQXhNeWtnZTF4dUlDQWdJQ0FnSUNCeVpYUjFjbTVjYmlBZ0lDQWdJSDFjYmx4dUlDQWdJQ0FnTHk4Z2FHbGtaU0IwYUdVZ2IyWm1MV05oYm5aaGMxeHVJQ0FnSUNBZ2RHaHBjeTVvYVdSbEtDbGNiaUFnSUNCOVhHNWNiaUFnSUNCemFHOTNLQ2tnZTF4dUlDQWdJQ0FnYVdZZ0tIUm9hWE11YjNCMGFXOXVjeTVsYkdWdFpXNTBMbU5zWVhOelRHbHpkQzVqYjI1MFlXbHVjeWduYzJodmR5Y3BLU0I3WEc0Z0lDQWdJQ0FnSUhKbGRIVnliaUJtWVd4elpWeHVJQ0FnSUNBZ2ZWeHVYRzRnSUNBZ0lDQXZMeUJoWkdRZ1lTQjBhVzFsYjNWMElITnZJSFJvWVhRZ2RHaGxJRU5UVXlCaGJtbHRZWFJwYjI0Z2QyOXlhM05jYmlBZ0lDQWdJSE5sZEZScGJXVnZkWFFvS0NrZ1BUNGdlMXh1SUNBZ0lDQWdJQ0IwYUdsekxuUnlhV2RuWlhKRmRtVnVkQ2hGZG1WdWRDNVRTRTlYS1Z4dVhHNGdJQ0FnSUNBZ0lHTnZibk4wSUc5dVUyaHZkMjRnUFNBb0tTQTlQaUI3WEc0Z0lDQWdJQ0FnSUNBZ2RHaHBjeTUwY21sbloyVnlSWFpsYm5Rb1JYWmxiblF1VTBoUFYwNHBYRzVjYmlBZ0lDQWdJQ0FnSUNCcFppQW9kR2hwY3k1aGJtbHRZWFJsS1NCN1hHNGdJQ0FnSUNBZ0lDQWdJQ0IwYUdsekxtOXdkR2x2Ym5NdVpXeGxiV1Z1ZEM1eVpXMXZkbVZGZG1WdWRFeHBjM1JsYm1WeUtFVjJaVzUwTGxSU1FVNVRTVlJKVDA1ZlJVNUVMQ0J2YmxOb2IzZHVLVnh1SUNBZ0lDQWdJQ0FnSUNBZ2RHaHBjeTV2Y0hScGIyNXpMbVZzWlcxbGJuUXVZMnhoYzNOTWFYTjBMbkpsYlc5MlpTZ25ZVzVwYldGMFpTY3BYRzRnSUNBZ0lDQWdJQ0FnZlZ4dUlDQWdJQ0FnSUNCOVhHNWNiaUFnSUNBZ0lDQWdhV1lnS0hSb2FYTXVkWE5sUW1GamEyUnliM0FwSUh0Y2JpQWdJQ0FnSUNBZ0lDQjBhR2x6TG1OeVpXRjBaVUpoWTJ0a2NtOXdLQ2xjYmlBZ0lDQWdJQ0FnZlZ4dVhHNWNiaUFnSUNBZ0lDQWdhV1lnS0hSb2FYTXVZVzVwYldGMFpTa2dlMXh1SUNBZ0lDQWdJQ0FnSUhSb2FYTXViM0IwYVc5dWN5NWxiR1Z0Wlc1MExtRmtaRVYyWlc1MFRHbHpkR1Z1WlhJb1JYWmxiblF1VkZKQlRsTkpWRWxQVGw5RlRrUXNJRzl1VTJodmQyNHBJQ0FnSUNBZ0lDQmNiaUFnSUNBZ0lDQWdJQ0IwYUdsekxtOXdkR2x2Ym5NdVpXeGxiV1Z1ZEM1amJHRnpjMHhwYzNRdVlXUmtLQ2RoYm1sdFlYUmxKeWxjYmlBZ0lDQWdJQ0FnZlNCbGJITmxJSHRjYmlBZ0lDQWdJQ0FnSUNBdkx5QmthWEpsWTNSc2VTQjBjbWxuWjJWeUlIUm9aU0J2YmxOb2IzZHVYRzRnSUNBZ0lDQWdJQ0FnYjI1VGFHOTNiaWdwWEc0Z0lDQWdJQ0FnSUgxY2JseHVJQ0FnSUNBZ0lDQjBhR2x6TG05d2RHbHZibk11Wld4bGJXVnVkQzVqYkdGemMweHBjM1F1WVdSa0tDZHphRzkzSnlrZ0lDQWdJQ0FnSUZ4dVhHNGdJQ0FnSUNBZ0lDOHZJR0YwZEdGamFDQmxkbVZ1ZEZ4dUlDQWdJQ0FnSUNCMGFHbHpMbUYwZEdGamFFVjJaVzUwY3lncFhHNGdJQ0FnSUNCOUxDQXhLVnh1WEc0Z0lDQWdJQ0J5WlhSMWNtNGdkSEoxWlZ4dUlDQWdJSDFjYmx4dUlDQWdJR2hwWkdVb0tTQjdYRzRnSUNBZ0lDQnBaaUFvSVhSb2FYTXViM0IwYVc5dWN5NWxiR1Z0Wlc1MExtTnNZWE56VEdsemRDNWpiMjUwWVdsdWN5Z25jMmh2ZHljcEtTQjdYRzRnSUNBZ0lDQWdJSEpsZEhWeWJpQm1ZV3h6WlZ4dUlDQWdJQ0FnZlZ4dVhHNGdJQ0FnSUNCMGFHbHpMblJ5YVdkblpYSkZkbVZ1ZENoRmRtVnVkQzVJU1VSRktWeHVYRzRnSUNBZ0lDQjBhR2x6TG1SbGRHRmphRVYyWlc1MGN5Z3BYRzVjYmlBZ0lDQWdJR2xtSUNoMGFHbHpMbUZ1YVcxaGRHVXBJSHRjYmlBZ0lDQWdJQ0FnZEdocGN5NXZjSFJwYjI1ekxtVnNaVzFsYm5RdVkyeGhjM05NYVhOMExtRmtaQ2duWVc1cGJXRjBaU2NwWEc0Z0lDQWdJQ0I5WEc1Y2JpQWdJQ0FnSUhSb2FYTXViM0IwYVc5dWN5NWxiR1Z0Wlc1MExtTnNZWE56VEdsemRDNXlaVzF2ZG1Vb0ozTm9iM2NuS1Z4dVhHNGdJQ0FnSUNCcFppQW9kR2hwY3k1MWMyVkNZV05yWkhKdmNDa2dlMXh1SUNBZ0lDQWdJQ0JqYjI1emRDQmlZV05yWkhKdmNDQTlJSFJvYVhNdVoyVjBRbUZqYTJSeWIzQW9LVnh1WEc0Z0lDQWdJQ0FnSUdOdmJuTjBJRzl1U0dsa1pHVnVJRDBnS0NrZ1BUNGdlMXh1SUNBZ0lDQWdJQ0FnSUdsbUlDaDBhR2x6TG1GdWFXMWhkR1VwSUh0Y2JpQWdJQ0FnSUNBZ0lDQWdJSFJvYVhNdWIzQjBhVzl1Y3k1bGJHVnRaVzUwTG1Oc1lYTnpUR2x6ZEM1eVpXMXZkbVVvSjJGdWFXMWhkR1VuS1Z4dUlDQWdJQ0FnSUNBZ0lIMWNibHh1SUNBZ0lDQWdJQ0FnSUdKaFkydGtjbTl3TG5KbGJXOTJaVVYyWlc1MFRHbHpkR1Z1WlhJb1JYWmxiblF1VkZKQlRsTkpWRWxQVGw5RlRrUXNJRzl1U0dsa1pHVnVLVnh1SUNBZ0lDQWdJQ0FnSUhSb2FYTXVkSEpwWjJkbGNrVjJaVzUwS0VWMlpXNTBMa2hKUkVSRlRpa2dJQ0FnSUNBZ0lGeHVJQ0FnSUNBZ0lDQWdJSFJvYVhNdWNtVnRiM1psUW1GamEyUnliM0FvS1Z4dUlDQWdJQ0FnSUNCOVhHNWNiaUFnSUNBZ0lDQWdZbUZqYTJSeWIzQXVZV1JrUlhabGJuUk1hWE4wWlc1bGNpaEZkbVZ1ZEM1VVVrRk9VMGxVU1U5T1gwVk9SQ3dnYjI1SWFXUmtaVzRwWEc0Z0lDQWdJQ0FnSUdKaFkydGtjbTl3TG1Oc1lYTnpUR2x6ZEM1aFpHUW9KMlpoWkdWdmRYUW5LVnh1SUNBZ0lDQWdmVnh1WEc0Z0lDQWdJQ0J5WlhSMWNtNGdkSEoxWlZ4dUlDQWdJSDFjYmx4dUlDQWdJR055WldGMFpVSmhZMnRrY205d0tDa2dlMXh1SUNBZ0lDQWdZMjl1YzNRZ1ltRmphMlJ5YjNBZ1BTQmtiMk4xYldWdWRDNWpjbVZoZEdWRmJHVnRaVzUwS0Nka2FYWW5LVnh1SUNBZ0lDQWdZbUZqYTJSeWIzQXVjMlYwUVhSMGNtbGlkWFJsS0Nka1lYUmhMV2xrSnl3Z2RHaHBjeTVwWkNsY2JpQWdJQ0FnSUdKaFkydGtjbTl3TG1Oc1lYTnpUR2x6ZEM1aFpHUW9Ra0ZEUzBSU1QxQmZVMFZNUlVOVVQxSXBYRzVjYmlBZ0lDQWdJR1J2WTNWdFpXNTBMbUp2WkhrdVlYQndaVzVrUTJocGJHUW9ZbUZqYTJSeWIzQXBYRzRnSUNBZ2ZWeHVYRzRnSUNBZ1oyVjBRbUZqYTJSeWIzQW9LU0I3WEc0Z0lDQWdJQ0J5WlhSMWNtNGdaRzlqZFcxbGJuUXVjWFZsY25sVFpXeGxZM1J2Y2loZ0xpUjdRa0ZEUzBSU1QxQmZVMFZNUlVOVVQxSjlXMlJoZEdFdGFXUTlYQ0lrZTNSb2FYTXVhV1I5WENKZFlDbGNiaUFnSUNCOVhHNWNiaUFnSUNCeVpXMXZkbVZDWVdOclpISnZjQ2dwSUh0Y2JpQWdJQ0FnSUdOdmJuTjBJR0poWTJ0a2NtOXdJRDBnZEdocGN5NW5aWFJDWVdOclpISnZjQ2dwWEc0Z0lDQWdJQ0JwWmlBb1ltRmphMlJ5YjNBcElIdGNiaUFnSUNBZ0lDQWdaRzlqZFcxbGJuUXVZbTlrZVM1eVpXMXZkbVZEYUdsc1pDaGlZV05yWkhKdmNDbGNiaUFnSUNBZ0lIMWNiaUFnSUNCOVhHNWNiaUFnSUNCaGRIUmhZMmhGZG1WdWRITW9LU0I3WEc0Z0lDQWdJQ0JqYjI1emRDQmthWE50YVhOelFuVjBkRzl1Y3lBOUlIUm9hWE11YjNCMGFXOXVjeTVsYkdWdFpXNTBMbkYxWlhKNVUyVnNaV04wYjNKQmJHd29KMXRrWVhSaExXUnBjMjFwYzNOZEp5bGNibHh1SUNBZ0lDQWdhV1lnS0dScGMyMXBjM05DZFhSMGIyNXpLU0I3WEc0Z0lDQWdJQ0FnSUVGeWNtRjVMbVp5YjIwb1pHbHpiV2x6YzBKMWRIUnZibk1wTG1admNrVmhZMmdvWW5WMGRHOXVJRDArSUhSb2FYTXVjbVZuYVhOMFpYSkZiR1Z0Wlc1MEtIc2dkR0Z5WjJWME9pQmlkWFIwYjI0c0lHVjJaVzUwT2lBblkyeHBZMnNuSUgwcEtWeHVJQ0FnSUNBZ2ZWeHVYRzRnSUNBZ0lDQnBaaUFvZEdocGN5NTFjMlZDWVdOclpISnZjQ2tnZTF4dUlDQWdJQ0FnSUNCamIyNXpkQ0JpWVdOclpISnZjQ0E5SUhSb2FYTXVaMlYwUW1GamEyUnliM0FvS1NBZ0lDQWdJRnh1SUNBZ0lDQWdJQ0IwYUdsekxuSmxaMmx6ZEdWeVJXeGxiV1Z1ZENoN0lIUmhjbWRsZERvZ1ltRmphMlJ5YjNBc0lHVjJaVzUwT2lCRmRtVnVkQzVUVkVGU1ZDQjlLVnh1SUNBZ0lDQWdmVnh1WEc0Z0lDQWdJQ0IwYUdsekxuSmxaMmx6ZEdWeVJXeGxiV1Z1ZENoN0lIUmhjbWRsZERvZ1pHOWpkVzFsYm5Rc0lHVjJaVzUwT2lBbmEyVjVkWEFuSUgwcFhHNGdJQ0FnZlZ4dVhHNGdJQ0FnWkdWMFlXTm9SWFpsYm5SektDa2dlMXh1SUNBZ0lDQWdZMjl1YzNRZ1pHbHpiV2x6YzBKMWRIUnZibk1nUFNCMGFHbHpMbTl3ZEdsdmJuTXVaV3hsYldWdWRDNXhkV1Z5ZVZObGJHVmpkRzl5UVd4c0tDZGJaR0YwWVMxa2FYTnRhWE56WFNjcFhHNWNiaUFnSUNBZ0lHbG1JQ2hrYVhOdGFYTnpRblYwZEc5dWN5a2dlMXh1SUNBZ0lDQWdJQ0JCY25KaGVTNW1jbTl0S0dScGMyMXBjM05DZFhSMGIyNXpLUzVtYjNKRllXTm9LR0oxZEhSdmJpQTlQaUIwYUdsekxuVnVjbVZuYVhOMFpYSkZiR1Z0Wlc1MEtIc2dkR0Z5WjJWME9pQmlkWFIwYjI0c0lHVjJaVzUwT2lBblkyeHBZMnNuSUgwcEtWeHVJQ0FnSUNBZ2ZWeHVYRzRnSUNBZ0lDQnBaaUFvZEdocGN5NTFjMlZDWVdOclpISnZjQ2tnZTF4dUlDQWdJQ0FnSUNCamIyNXpkQ0JpWVdOclpISnZjQ0E5SUhSb2FYTXVaMlYwUW1GamEyUnliM0FvS1Z4dUlDQWdJQ0FnSUNCMGFHbHpMblZ1Y21WbmFYTjBaWEpGYkdWdFpXNTBLSHNnZEdGeVoyVjBPaUJpWVdOclpISnZjQ3dnWlhabGJuUTZJRVYyWlc1MExsTlVRVkpVSUgwcFhHNGdJQ0FnSUNCOVhHNWNiaUFnSUNBZ0lIUm9hWE11ZFc1eVpXZHBjM1JsY2tWc1pXMWxiblFvZXlCMFlYSm5aWFE2SUdSdlkzVnRaVzUwTENCbGRtVnVkRG9nSjJ0bGVYVndKeUI5S1Z4dUlDQWdJSDFjYmx4dUlDQWdJSE4wWVhScFl5QnBaR1Z1ZEdsbWFXVnlLQ2tnZTF4dUlDQWdJQ0FnY21WMGRYSnVJRTVCVFVWY2JpQWdJQ0I5WEc1Y2JpQWdJQ0J6ZEdGMGFXTWdYMFJQVFVsdWRHVnlabUZqWlNodmNIUnBiMjV6S1NCN1hHNGdJQ0FnSUNCeVpYUjFjbTRnYzNWd1pYSXVYMFJQVFVsdWRHVnlabUZqWlNoUFptWkRZVzUyWVhNc0lHOXdkR2x2Ym5NcFhHNGdJQ0FnZlZ4dUlDQjlYRzVjYmlBZ0x5b3FYRzRnSUNBcUlDMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExWeHVJQ0FnS2lCRVQwMGdRWEJwSUdsdGNHeGxiV1Z1ZEdGMGFXOXVYRzRnSUNBcUlDMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExWeHVJQ0FnS2k5Y2JpQWdZMjl1YzNRZ1kyOXRjRzl1Wlc1MGN5QTlJRnRkWEc1Y2JpQWdZMjl1YzNRZ2IyWm1RMkZ1ZG1GeklEMGdaRzlqZFcxbGJuUXVjWFZsY25sVFpXeGxZM1J2Y2tGc2JDaGdMaVI3VGtGTlJYMWdLVnh1SUNCcFppQW9iMlptUTJGdWRtRnpLU0I3WEc0Z0lDQWdRWEp5WVhrdVpuSnZiU2h2Wm1aRFlXNTJZWE1wTG1admNrVmhZMmdvS0dWc1pXMWxiblFwSUQwK0lIdGNiaUFnSUNBZ0lHTnZibk4wSUdOdmJtWnBaeUE5SUdkbGRFRjBkSEpwWW5WMFpYTkRiMjVtYVdjb1pXeGxiV1Z1ZEN3Z1JFVkdRVlZNVkY5UVVrOVFSVkpVU1VWVExDQkVRVlJCWDBGVVZGSlRYMUJTVDFCRlVsUkpSVk1wWEc0Z0lDQWdJQ0JqYjI1bWFXY3VaV3hsYldWdWRDQTlJR1ZzWlcxbGJuUmNibHh1SUNBZ0lDQWdZMjl0Y0c5dVpXNTBjeTV3ZFhOb0tIc2daV3hsYldWdWRDd2diMlptUTJGdWRtRnpPaUJ1WlhjZ1QyWm1RMkZ1ZG1GektHTnZibVpwWnlrZ2ZTbGNiaUFnSUNCOUtWeHVJQ0I5WEc1Y2JpQWdhV1lnS0c5bVprTmhiblpoY3lrZ2UxeHVJQ0FnSUdSdlkzVnRaVzUwTG1Ga1pFVjJaVzUwVEdsemRHVnVaWElvSjJOc2FXTnJKeXdnS0dWMlpXNTBLU0E5UGlCN1hHNGdJQ0FnSUNCamIyNXpkQ0IwWVhKblpYUWdQU0JtYVc1a1ZHRnlaMlYwUW5sQmRIUnlLR1YyWlc1MExuUmhjbWRsZEN3Z0oyUmhkR0V0ZEc5bloyeGxKeWxjYmlBZ0lDQWdJR2xtSUNnaGRHRnlaMlYwS1NCN1hHNGdJQ0FnSUNBZ0lISmxkSFZ5Ymx4dUlDQWdJQ0FnZlZ4dVhHNGdJQ0FnSUNCamIyNXpkQ0JrWVhSaFZHOW5aMnhsUVhSMGNpQTlJSFJoY21kbGRDNW5aWFJCZEhSeWFXSjFkR1VvSjJSaGRHRXRkRzluWjJ4bEp5bGNiaUFnSUNBZ0lHbG1JQ2hrWVhSaFZHOW5aMnhsUVhSMGNpQW1KaUJrWVhSaFZHOW5aMnhsUVhSMGNpQTlQVDBnVGtGTlJTa2dlMXh1SUNBZ0lDQWdJQ0JqYjI1emRDQnBaQ0E5SUhSaGNtZGxkQzVuWlhSQmRIUnlhV0oxZEdVb0oyUmhkR0V0ZEdGeVoyVjBKeWxjYmlBZ0lDQWdJQ0FnWTI5dWMzUWdaV3hsYldWdWRDQTlJR1J2WTNWdFpXNTBMbkYxWlhKNVUyVnNaV04wYjNJb2FXUXBYRzVjYmlBZ0lDQWdJQ0FnWTI5dWMzUWdZMjl0Y0c5dVpXNTBJRDBnWTI5dGNHOXVaVzUwY3k1bWFXNWtLR01nUFQ0Z1l5NWxiR1Z0Wlc1MElEMDlQU0JsYkdWdFpXNTBLVnh1WEc0Z0lDQWdJQ0FnSUdsbUlDZ2hZMjl0Y0c5dVpXNTBLU0I3WEc0Z0lDQWdJQ0FnSUNBZ2NtVjBkWEp1WEc0Z0lDQWdJQ0FnSUgxY2JseHVJQ0FnSUNBZ0lDQjBZWEpuWlhRdVlteDFjaWdwWEc1Y2JpQWdJQ0FnSUNBZ1kyOXRjRzl1Wlc1MExtOW1aa05oYm5aaGN5NXphRzkzS0NsY2JpQWdJQ0FnSUgxY2JpQWdJQ0I5S1Z4dUlDQjlYRzVjYmlBZ2NtVjBkWEp1SUU5bVprTmhiblpoYzF4dWZTa29LVnh1WEc1bGVIQnZjblFnWkdWbVlYVnNkQ0JQWm1aRFlXNTJZWE5jYmlJc0lpOHFLbHh1SUNvZ0xTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMWNiaUFxSUV4cFkyVnVjMlZrSUhWdVpHVnlJRTFKVkNBb2FIUjBjSE02THk5bmFYUm9kV0l1WTI5dEwzRjFZWEpyTFdSbGRpOVFhRzl1YjI0dFJuSmhiV1YzYjNKckwySnNiMkl2YldGemRHVnlMMHhKUTBWT1UwVXBYRzRnS2lBdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExWeHVJQ292WEc1cGJYQnZjblFnUTI5dGNHOXVaVzUwSUdaeWIyMGdKeTR1TDJOdmJYQnZibVZ1ZENkY2JtbHRjRzl5ZENCRmRtVnVkQ0JtY205dElDY3VMaTh1TGk5amIyMXRiMjR2WlhabGJuUnpKMXh1WEc1amIyNXpkQ0JRY205bmNtVnpjeUE5SUNnb0tTQTlQaUI3WEc0Z0lDOHFLbHh1SUNBZ0tpQXRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMWNiaUFnSUNvZ1EyOXVjM1JoYm5SelhHNGdJQ0FxSUMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFZ4dUlDQWdLaTljYmx4dUlDQmpiMjV6ZENCT1FVMUZJRDBnSjNCeWIyZHlaWE56SjF4dUlDQmpiMjV6ZENCV1JWSlRTVTlPSUQwZ0p6SXVNQzR3SjF4dUlDQmpiMjV6ZENCRVJVWkJWVXhVWDFCU1QxQkZVbFJKUlZNZ1BTQjdYRzRnSUNBZ1pXeGxiV1Z1ZERvZ2JuVnNiQ3hjYmlBZ0lDQm9aV2xuYUhRNklEVXNYRzRnSUNBZ2JXbHVPaUF3TEZ4dUlDQWdJRzFoZURvZ01UQXdMRnh1SUNBZ0lHeGhZbVZzT2lCbVlXeHpaU3hjYmlBZ0lDQnpkSEpwY0dWa09pQm1ZV3h6WlN4Y2JpQWdJQ0JpWVdOclozSnZkVzVrT2lCdWRXeHNMRnh1SUNCOVhHNGdJR052Ym5OMElFUkJWRUZmUVZSVVVsTmZVRkpQVUVWU1ZFbEZVeUE5SUZ0Y2JpQWdJQ0FuYUdWcFoyaDBKeXhjYmlBZ0lDQW5iV2x1Snl4Y2JpQWdJQ0FuYldGNEp5eGNiaUFnSUNBbmJHRmlaV3duTEZ4dUlDQWdJQ2R6ZEhKcGNHVmtKeXhjYmlBZ0lDQW5ZbUZqYTJkeWIzVnVaQ2NzWEc0Z0lGMWNibHh1SUNBdktpcGNiaUFnSUNvZ0xTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdFhHNGdJQ0FxSUVOc1lYTnpJRVJsWm1sdWFYUnBiMjVjYmlBZ0lDb2dMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRYRzRnSUNBcUwxeHVYRzRnSUdOc1lYTnpJRkJ5YjJkeVpYTnpJR1Y0ZEdWdVpITWdRMjl0Y0c5dVpXNTBJSHRjYmx4dUlDQWdJR052Ym5OMGNuVmpkRzl5S0c5d2RHbHZibk1nUFNCN2ZTa2dlMXh1SUNBZ0lDQWdjM1Z3WlhJb1RrRk5SU3dnVmtWU1UwbFBUaXdnUkVWR1FWVk1WRjlRVWs5UVJWSlVTVVZUTENCdmNIUnBiMjV6TENCRVFWUkJYMEZVVkZKVFgxQlNUMUJGVWxSSlJWTXNJR1poYkhObExDQm1ZV3h6WlNsY2JseHVJQ0FnSUNBZ0x5OGdjMlYwSUhSb1pTQjNZVzUwWldRZ2FHVnBaMmgwWEc0Z0lDQWdJQ0IwYUdsekxtOXdkR2x2Ym5NdVpXeGxiV1Z1ZEM1emRIbHNaUzVvWldsbmFIUWdQU0JnSkh0MGFHbHpMbTl3ZEdsdmJuTXVhR1ZwWjJoMGZYQjRZRnh1WEc0Z0lDQWdJQ0F2THlCelpYUWdiV2x1SUdGdVpDQnRZWGdnZG1Gc2RXVnpYRzRnSUNBZ0lDQmpiMjV6ZENCd2NtOW5jbVZ6YzBKaGNpQTlJSFJvYVhNdVoyVjBVSEp2WjNKbGMzTkNZWElvS1Z4dUlDQWdJQ0FnY0hKdlozSmxjM05DWVhJdWMyVjBRWFIwY21saWRYUmxLQ2RoY21saExYWmhiSFZsYldsdUp5d2dZQ1I3ZEdocGN5NXZjSFJwYjI1ekxtMXBibjFnS1Z4dUlDQWdJQ0FnY0hKdlozSmxjM05DWVhJdWMyVjBRWFIwY21saWRYUmxLQ2RoY21saExYWmhiSFZsYldGNEp5d2dZQ1I3ZEdocGN5NXZjSFJwYjI1ekxtMWhlSDFnS1Z4dVhHNGdJQ0FnSUNBdkx5QnpaWFFnYzNSeWFYQmxaRnh1SUNBZ0lDQWdhV1lnS0hSb2FYTXViM0IwYVc5dWN5NXpkSEpwY0dWa1hHNGdJQ0FnSUNBZ0lDWW1JQ0Z3Y205bmNtVnpjMEpoY2k1amJHRnpjMHhwYzNRdVkyOXVkR0ZwYm5Nb0ozQnliMmR5WlhOekxXSmhjaTF6ZEhKcGNHVmtKeWtwSUh0Y2JpQWdJQ0FnSUNBZ2NISnZaM0psYzNOQ1lYSXVZMnhoYzNOTWFYTjBMbUZrWkNnbmNISnZaM0psYzNNdFltRnlMWE4wY21sd1pXUW5LVnh1SUNBZ0lDQWdmVnh1WEc0Z0lDQWdJQ0F2THlCelpYUWdZbUZqYTJkeWIzVnVaRnh1SUNBZ0lDQWdhV1lnS0hSNWNHVnZaaUIwYUdsekxtOXdkR2x2Ym5NdVltRmphMmR5YjNWdVpDQTlQVDBnSjNOMGNtbHVaeWRjYmlBZ0lDQWdJQ0FnSmlZZ0lYQnliMmR5WlhOelFtRnlMbU5zWVhOelRHbHpkQzVqYjI1MFlXbHVjeWhnWW1jdEpIdDBhR2x6TG05d2RHbHZibk11WW1GamEyZHliM1Z1WkgxZ0tTa2dlMXh1SUNBZ0lDQWdJQ0J3Y205bmNtVnpjMEpoY2k1amJHRnpjMHhwYzNRdVlXUmtLR0JpWnkwa2UzUm9hWE11YjNCMGFXOXVjeTVpWVdOclozSnZkVzVrZldBcFhHNGdJQ0FnSUNCOVhHNGdJQ0FnZlZ4dVhHNGdJQ0FnWjJWMFVISnZaM0psYzNOQ1lYSW9LU0I3WEc0Z0lDQWdJQ0J5WlhSMWNtNGdkR2hwY3k1dmNIUnBiMjV6TG1Wc1pXMWxiblF1Y1hWbGNubFRaV3hsWTNSdmNpZ25MbkJ5YjJkeVpYTnpMV0poY2ljcFhHNGdJQ0FnZlZ4dVhHNGdJQ0FnYzJWMEtIWmhiSFZsSUQwZ01Da2dlMXh1SUNBZ0lDQWdZMjl1YzNRZ2NISnZaM0psYzNOQ1lYSWdQU0IwYUdsekxtZGxkRkJ5YjJkeVpYTnpRbUZ5S0NsY2JpQWdJQ0FnSUdOdmJuTjBJSEJ5YjJkeVpYTnpJRDBnVFdGMGFDNXliM1Z1WkNnb2RtRnNkV1VnTHlBb2RHaHBjeTV2Y0hScGIyNXpMbTFwYmlBcklIUm9hWE11YjNCMGFXOXVjeTV0WVhncEtTQXFJREV3TUNsY2JseHVJQ0FnSUNBZ2FXWWdLSFpoYkhWbElEd2dkR2hwY3k1dmNIUnBiMjV6TG0xcGJpa2dlMXh1SUNBZ0lDQWdJQ0JqYjI1emIyeGxMbVZ5Y205eUtHQWtlMDVCVFVWOUxpQlhZWEp1YVc1bkxDQWtlM1poYkhWbGZTQnBjeUIxYm1SbGNpQnRhVzRnZG1Gc2RXVXVZQ2xjYmlBZ0lDQWdJQ0FnY21WMGRYSnVJR1poYkhObFhHNGdJQ0FnSUNCOVhHNWNiaUFnSUNBZ0lHbG1JQ2gyWVd4MVpTQStJSFJvYVhNdWIzQjBhVzl1Y3k1dFlYZ3BJSHRjYmlBZ0lDQWdJQ0FnWTI5dWMyOXNaUzVsY25KdmNpaGdKSHRPUVUxRmZTNGdWMkZ5Ym1sdVp5d2dKSHQyWVd4MVpYMGdhWE1nWVdKdmRtVWdiV0Y0SUhaaGJIVmxMbUFwSUNBZ0lDQWdJQ0FnSUZ4dUlDQWdJQ0FnSUNCeVpYUjFjbTRnWm1Gc2MyVmNiaUFnSUNBZ0lIMWNibHh1SUNBZ0lDQWdjSEp2WjNKbGMzTkNZWEl1YzJWMFFYUjBjbWxpZFhSbEtDZGhjbWxoTFhaaGJIVmxibTkzSnl3Z1lDUjdkbUZzZFdWOVlDa2dJQ0FnSUNCY2JseHVJQ0FnSUNBZ0x5OGdjMlYwSUd4aFltVnNYRzRnSUNBZ0lDQnBaaUFvZEdocGN5NXZjSFJwYjI1ekxteGhZbVZzS1NCN1hHNGdJQ0FnSUNBZ0lIQnliMmR5WlhOelFtRnlMbWx1Ym1WeVNGUk5UQ0E5SUdBa2UzQnliMmR5WlhOemZTVmdYRzRnSUNBZ0lDQjlYRzVjYmlBZ0lDQWdJQzh2SUhObGRDQndaWEpqWlc1MFlXZGxYRzRnSUNBZ0lDQndjbTluY21WemMwSmhjaTV6ZEhsc1pTNTNhV1IwYUNBOUlHQWtlM0J5YjJkeVpYTnpmU1ZnWEc1Y2JpQWdJQ0FnSUhKbGRIVnliaUIwY25WbFhHNGdJQ0FnZlZ4dVhHNGdJQ0FnWVc1cGJXRjBaU2h6ZEdGeWRFRnVhVzFoZEdsdmJpQTlJSFJ5ZFdVcElIdGNiaUFnSUNBZ0lHbG1JQ2doZEdocGN5NXZjSFJwYjI1ekxuTjBjbWx3WldRcElIdGNiaUFnSUNBZ0lDQWdZMjl1YzI5c1pTNWxjbkp2Y2loZ0pIdE9RVTFGZlM0Z1FXNXBiV0YwYVc5dUlIZHZjbXR6SUc5dWJIa2dkMmwwYUNCemRISnBjR1ZrSUhCeWIyZHlaWE56TG1BcFhHNGdJQ0FnSUNBZ0lISmxkSFZ5YmlCbVlXeHpaVnh1SUNBZ0lDQWdmVnh1WEc0Z0lDQWdJQ0JqYjI1emRDQndjbTluY21WemMwSmhjaUE5SUhSb2FYTXVaMlYwVUhKdlozSmxjM05DWVhJb0tWeHVYRzRnSUNBZ0lDQnBaaUFvYzNSaGNuUkJibWx0WVhScGIyNWNiaUFnSUNBZ0lDQWdKaVlnSVhCeWIyZHlaWE56UW1GeUxtTnNZWE56VEdsemRDNWpiMjUwWVdsdWN5Z25jSEp2WjNKbGMzTXRZbUZ5TFdGdWFXMWhkR1ZrSnlrcElIdGNiaUFnSUNBZ0lDQWdjSEp2WjNKbGMzTkNZWEl1WTJ4aGMzTk1hWE4wTG1Ga1pDZ25jSEp2WjNKbGMzTXRZbUZ5TFdGdWFXMWhkR1ZrSnlsY2JpQWdJQ0FnSUgxY2JseHVJQ0FnSUNBZ2FXWWdLQ0Z6ZEdGeWRFRnVhVzFoZEdsdmJseHVJQ0FnSUNBZ0lDQW1KaUJ3Y205bmNtVnpjMEpoY2k1amJHRnpjMHhwYzNRdVkyOXVkR0ZwYm5Nb0ozQnliMmR5WlhOekxXSmhjaTFoYm1sdFlYUmxaQ2NwS1NCN1hHNGdJQ0FnSUNBZ0lIQnliMmR5WlhOelFtRnlMbU5zWVhOelRHbHpkQzV5WlcxdmRtVW9KM0J5YjJkeVpYTnpMV0poY2kxaGJtbHRZWFJsWkNjcFhHNGdJQ0FnSUNCOVhHNWNiaUFnSUNBZ0lISmxkSFZ5YmlCMGNuVmxYRzRnSUNBZ2ZWeHVYRzRnSUNBZ2MyaHZkeWdwSUh0Y2JpQWdJQ0FnSUhSb2FYTXViM0IwYVc5dWN5NWxiR1Z0Wlc1MExuTjBlV3hsTG1obGFXZG9kQ0E5SUdBa2UzUm9hWE11YjNCMGFXOXVjeTVvWldsbmFIUjljSGhnWEc0Z0lDQWdJQ0IwYUdsekxuUnlhV2RuWlhKRmRtVnVkQ2hGZG1WdWRDNVRTRTlYS1Z4dUlDQWdJQ0FnZEdocGN5NTBjbWxuWjJWeVJYWmxiblFvUlhabGJuUXVVMGhQVjA0cFhHNWNiaUFnSUNBZ0lISmxkSFZ5YmlCMGNuVmxYRzRnSUNBZ2ZWeHVYRzRnSUNBZ2FHbGtaU2dwSUh0Y2JpQWdJQ0FnSUhSb2FYTXViM0IwYVc5dWN5NWxiR1Z0Wlc1MExuTjBlV3hsTG1obGFXZG9kQ0E5SUNjd2NIZ25YRzRnSUNBZ0lDQjBhR2x6TG5SeWFXZG5aWEpGZG1WdWRDaEZkbVZ1ZEM1SVNVUkZLVnh1SUNBZ0lDQWdkR2hwY3k1MGNtbG5aMlZ5UlhabGJuUW9SWFpsYm5RdVNFbEVSRVZPS1Z4dVhHNGdJQ0FnSUNCeVpYUjFjbTRnZEhKMVpWeHVJQ0FnSUgxY2JseHVJQ0FnSUhOMFlYUnBZeUJwWkdWdWRHbG1hV1Z5S0NrZ2UxeHVJQ0FnSUNBZ2NtVjBkWEp1SUU1QlRVVmNiaUFnSUNCOVhHNWNiaUFnSUNCemRHRjBhV01nWDBSUFRVbHVkR1Z5Wm1GalpTaHZjSFJwYjI1ektTQjdYRzRnSUNBZ0lDQnlaWFIxY200Z2MzVndaWEl1WDBSUFRVbHVkR1Z5Wm1GalpTaFFjbTluY21WemN5d2diM0IwYVc5dWN5bGNiaUFnSUNCOVhHNGdJSDFjYmx4dUlDQnlaWFIxY200Z1VISnZaM0psYzNOY2JuMHBLQ2xjYmx4dVpYaHdiM0owSUdSbFptRjFiSFFnVUhKdlozSmxjM05jYmlJc0lpOHFLbHh1SUNvZ0xTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMWNiaUFxSUV4cFkyVnVjMlZrSUhWdVpHVnlJRTFKVkNBb2FIUjBjSE02THk5bmFYUm9kV0l1WTI5dEwzRjFZWEpyTFdSbGRpOVFhRzl1YjI0dFJuSmhiV1YzYjNKckwySnNiMkl2YldGemRHVnlMMHhKUTBWT1UwVXBYRzRnS2lBdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExWeHVJQ292WEc1cGJYQnZjblFnUTI5dGNHOXVaVzUwSUdaeWIyMGdKeTR1TDJOdmJYQnZibVZ1ZENkY2JtbHRjRzl5ZENCN0lHZGxkRUYwZEhKcFluVjBaWE5EYjI1bWFXY2dmU0JtY205dElDY3VMaTlqYjIxd2IyNWxiblJOWVc1aFoyVnlKMXh1YVcxd2IzSjBJRVYyWlc1MElHWnliMjBnSnk0dUx5NHVMMk52YlcxdmJpOWxkbVZ1ZEhNblhHNXBiWEJ2Y25RZ2V5Qm1hVzVrVkdGeVoyVjBRbmxEYkdGemN5QjlJR1p5YjIwZ0p5NHVMeTR1TDJOdmJXMXZiaTkxZEdsc2N5ZGNibHh1WTI5dWMzUWdWR0ZpSUQwZ0tDZ3BJRDArSUh0Y2JpQWdMeW9xWEc0Z0lDQXFJQzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMVnh1SUNBZ0tpQkRiMjV6ZEdGdWRITmNiaUFnSUNvZ0xTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdFhHNGdJQ0FxTDF4dVhHNGdJR052Ym5OMElFNUJUVVVnUFNBbmRHRmlKMXh1SUNCamIyNXpkQ0JXUlZKVFNVOU9JRDBnSnpJdU1DNHdKMXh1SUNCamIyNXpkQ0JFUlVaQlZVeFVYMUJTVDFCRlVsUkpSVk1nUFNCN1hHNWNiaUFnZlZ4dUlDQmpiMjV6ZENCRVFWUkJYMEZVVkZKVFgxQlNUMUJGVWxSSlJWTWdQU0JiWEc0Z0lGMWNiaUFnWTI5dWMzUWdWRUZDWDBOUFRsUkZUbFJmVTBWTVJVTlVUMUlnUFNBbkxuUmhZaTF3WVc1bEoxeHVYRzRnSUM4cUtseHVJQ0FnS2lBdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMxY2JpQWdJQ29nUTJ4aGMzTWdSR1ZtYVc1cGRHbHZibHh1SUNBZ0tpQXRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMWNiaUFnSUNvdlhHNWNiaUFnWTJ4aGMzTWdWR0ZpSUdWNGRHVnVaSE1nUTI5dGNHOXVaVzUwSUh0Y2JseHVJQ0FnSUdOdmJuTjBjblZqZEc5eUtHOXdkR2x2Ym5NZ1BTQjdmU2tnZTF4dUlDQWdJQ0FnYzNWd1pYSW9Ua0ZOUlN3Z1ZrVlNVMGxQVGl3Z1JFVkdRVlZNVkY5UVVrOVFSVkpVU1VWVExDQnZjSFJwYjI1ekxDQkVRVlJCWDBGVVZGSlRYMUJTVDFCRlVsUkpSVk1zSUdaaGJITmxMQ0JtWVd4elpTbGNiaUFnSUNCOVhHNWNiaUFnSUNCemFHOTNLQ2tnZTF4dUlDQWdJQ0FnYVdZZ0tIUm9hWE11YjNCMGFXOXVjeTVsYkdWdFpXNTBMbU5zWVhOelRHbHpkQzVqYjI1MFlXbHVjeWduWVdOMGFYWmxKeWtwSUh0Y2JpQWdJQ0FnSUNBZ2NtVjBkWEp1SUdaaGJITmxYRzRnSUNBZ0lDQjlYRzVjYmlBZ0lDQWdJR052Ym5OMElHbGtJRDBnZEdocGN5NXZjSFJwYjI1ekxtVnNaVzFsYm5RdVoyVjBRWFIwY21saWRYUmxLQ2RvY21WbUp5bGNiaUFnSUNBZ0lHTnZibk4wSUc1aGRpQTlJR1pwYm1SVVlYSm5aWFJDZVVOc1lYTnpLSFJvYVhNdWIzQjBhVzl1Y3k1bGJHVnRaVzUwTENBbmJtRjJKeWxjYmlBZ0lDQWdJR052Ym5OMElHNWhkbFJoWW5NZ1BTQnVZWFlnUHlCdVlYWXVjWFZsY25sVFpXeGxZM1J2Y2tGc2JDaGdXMlJoZEdFdGRHOW5aMnhsUFZ3aUpIdE9RVTFGZlZ3aVhXQXBJRG9nYm5Wc2JGeHVYRzRnSUNBZ0lDQnBaaUFvYm1GMlZHRmljeWtnZTF4dUlDQWdJQ0FnSUNCQmNuSmhlUzVtY205dEtHNWhkbFJoWW5NcExtWnZja1ZoWTJnb0tIUmhZaWtnUFQ0Z2UxeHVJQ0FnSUNBZ0lDQWdJR2xtSUNoMFlXSXVZMnhoYzNOTWFYTjBMbU52Ym5SaGFXNXpLQ2RoWTNScGRtVW5LU2tnZTF4dUlDQWdJQ0FnSUNBZ0lDQWdkR0ZpTG1Oc1lYTnpUR2x6ZEM1eVpXMXZkbVVvSjJGamRHbDJaU2NwWEc0Z0lDQWdJQ0FnSUNBZ2ZWeHVJQ0FnSUNBZ0lDQWdJSFJoWWk1elpYUkJkSFJ5YVdKMWRHVW9KMkZ5YVdFdGMyVnNaV04wWldRbkxDQm1ZV3h6WlNsY2JpQWdJQ0FnSUNBZ2ZTbGNiaUFnSUNBZ0lIMWNibHh1SUNBZ0lDQWdkR2hwY3k1dmNIUnBiMjV6TG1Wc1pXMWxiblF1WTJ4aGMzTk1hWE4wTG1Ga1pDZ25ZV04wYVhabEp5bGNiaUFnSUNBZ0lIUm9hWE11YjNCMGFXOXVjeTVsYkdWdFpXNTBMbk5sZEVGMGRISnBZblYwWlNnbllYSnBZUzF6Wld4bFkzUmxaQ2NzSUhSeWRXVXBYRzVjYmlBZ0lDQWdJR052Ym5OMElIUmhZa052Ym5SbGJuUWdQU0JrYjJOMWJXVnVkQzV4ZFdWeWVWTmxiR1ZqZEc5eUtHbGtLVnh1SUNBZ0lDQWdZMjl1YzNRZ2RHRmlRMjl1ZEdWdWRITWdQU0IwWVdKRGIyNTBaVzUwTG5CaGNtVnVkRTV2WkdVdWNYVmxjbmxUWld4bFkzUnZja0ZzYkNoVVFVSmZRMDlPVkVWT1ZGOVRSVXhGUTFSUFVpbGNibHh1SUNBZ0lDQWdhV1lnS0hSaFlrTnZiblJsYm5SektTQjdYRzRnSUNBZ0lDQWdJRUZ5Y21GNUxtWnliMjBvZEdGaVEyOXVkR1Z1ZEhNcExtWnZja1ZoWTJnb0tIUmhZaWtnUFQ0Z2UxeHVJQ0FnSUNBZ0lDQWdJR2xtSUNoMFlXSXVZMnhoYzNOTWFYTjBMbU52Ym5SaGFXNXpLQ2RoWTNScGRtVW5LU2tnZTF4dUlDQWdJQ0FnSUNBZ0lDQWdkR0ZpTG1Oc1lYTnpUR2x6ZEM1eVpXMXZkbVVvSjJGamRHbDJaU2NwWEc0Z0lDQWdJQ0FnSUNBZ2ZWeHVJQ0FnSUNBZ0lDQjlLVnh1SUNBZ0lDQWdmVnh1WEc0Z0lDQWdJQ0IwWVdKRGIyNTBaVzUwTG1Oc1lYTnpUR2x6ZEM1aFpHUW9KM05vYjNkcGJtY25LVnh1WEc0Z0lDQWdJQ0J6WlhSVWFXMWxiM1YwS0NncElEMCtJSHRjYmlBZ0lDQWdJQ0FnWTI5dWMzUWdiMjVUYUc5M1pXUWdQU0FvS1NBOVBpQjdYRzRnSUNBZ0lDQWdJQ0FnZEdGaVEyOXVkR1Z1ZEM1amJHRnpjMHhwYzNRdWNtVnRiM1psS0NkaGJtbHRZWFJsSnlsY2JpQWdJQ0FnSUNBZ0lDQjBZV0pEYjI1MFpXNTBMbU5zWVhOelRHbHpkQzVoWkdRb0oyRmpkR2wyWlNjcFhHNGdJQ0FnSUNBZ0lDQWdkR0ZpUTI5dWRHVnVkQzVqYkdGemMweHBjM1F1Y21WdGIzWmxLQ2R6YUc5M2FXNW5KeWxjYmlBZ0lDQWdJQ0FnSUNCMFlXSkRiMjUwWlc1MExuSmxiVzkyWlVWMlpXNTBUR2x6ZEdWdVpYSW9SWFpsYm5RdVZGSkJUbE5KVkVsUFRsOUZUa1FzSUc5dVUyaHZkMlZrS1Z4dUlDQWdJQ0FnSUNCOVhHNWNiaUFnSUNBZ0lDQWdkR0ZpUTI5dWRHVnVkQzVoWkdSRmRtVnVkRXhwYzNSbGJtVnlLRVYyWlc1MExsUlNRVTVUU1ZSSlQwNWZSVTVFTENCdmJsTm9iM2RsWkNsY2JseHVJQ0FnSUNBZ0lDQjBZV0pEYjI1MFpXNTBMbU5zWVhOelRHbHpkQzVoWkdRb0oyRnVhVzFoZEdVbktWeHVYRzRnSUNBZ0lDQjlMQ0F5TUNsY2JseHVJQ0FnSUNBZ2NtVjBkWEp1SUhSeWRXVmNiaUFnSUNCOVhHNWNiaUFnSUNCb2FXUmxLQ2tnZTF4dUlDQWdJQ0FnYVdZZ0tDRjBhR2x6TG05d2RHbHZibk11Wld4bGJXVnVkQzVqYkdGemMweHBjM1F1WTI5dWRHRnBibk1vSjJGamRHbDJaU2NwS1NCN1hHNGdJQ0FnSUNBZ0lISmxkSFZ5YmlCbVlXeHpaVnh1SUNBZ0lDQWdmVnh1WEc0Z0lDQWdJQ0JwWmlBb2RHaHBjeTV2Y0hScGIyNXpMbVZzWlcxbGJuUXVZMnhoYzNOTWFYTjBMbU52Ym5SaGFXNXpLQ2RoWTNScGRtVW5LU2tnZTF4dUlDQWdJQ0FnSUNCMGFHbHpMbTl3ZEdsdmJuTXVaV3hsYldWdWRDNWpiR0Z6YzB4cGMzUXVjbVZ0YjNabEtDZGhZM1JwZG1VbktWeHVJQ0FnSUNBZ2ZWeHVYRzRnSUNBZ0lDQjBhR2x6TG05d2RHbHZibk11Wld4bGJXVnVkQzV6WlhSQmRIUnlhV0oxZEdVb0oyRnlhV0V0YzJWc1pXTjBaV1FuTENCbVlXeHpaU2xjYmx4dUlDQWdJQ0FnWTI5dWMzUWdhV1FnUFNCMGFHbHpMbTl3ZEdsdmJuTXVaV3hsYldWdWRDNW5aWFJCZEhSeWFXSjFkR1VvSjJoeVpXWW5LVnh1SUNBZ0lDQWdZMjl1YzNRZ2RHRmlRMjl1ZEdWdWRDQTlJR1J2WTNWdFpXNTBMbkYxWlhKNVUyVnNaV04wYjNJb2FXUXBYRzVjYmlBZ0lDQWdJR2xtSUNoMFlXSkRiMjUwWlc1MExtTnNZWE56VEdsemRDNWpiMjUwWVdsdWN5Z25ZV04wYVhabEp5a3BJSHRjYmlBZ0lDQWdJQ0FnZEdGaVEyOXVkR1Z1ZEM1amJHRnpjMHhwYzNRdWNtVnRiM1psS0NkaFkzUnBkbVVuS1Z4dUlDQWdJQ0FnZlZ4dVhHNGdJQ0FnSUNCeVpYUjFjbTRnZEhKMVpWeHVJQ0FnSUgxY2JseHVJQ0FnSUhOMFlYUnBZeUJwWkdWdWRHbG1hV1Z5S0NrZ2UxeHVJQ0FnSUNBZ2NtVjBkWEp1SUU1QlRVVmNiaUFnSUNCOVhHNWNiaUFnSUNCemRHRjBhV01nWDBSUFRVbHVkR1Z5Wm1GalpTaHZjSFJwYjI1ektTQjdYRzRnSUNBZ0lDQnlaWFIxY200Z2MzVndaWEl1WDBSUFRVbHVkR1Z5Wm1GalpTaFVZV0lzSUc5d2RHbHZibk1wWEc0Z0lDQWdmVnh1SUNCOVhHNWNiaUFnTHlvcVhHNGdJQ0FxSUMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFZ4dUlDQWdLaUJFVDAwZ1FYQnBJR2x0Y0d4bGJXVnVkR0YwYVc5dVhHNGdJQ0FxSUMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFZ4dUlDQWdLaTljYmlBZ1kyOXVjM1FnWTI5dGNHOXVaVzUwY3lBOUlGdGRYRzVjYmlBZ1kyOXVjM1FnZEdGaWN5QTlJR1J2WTNWdFpXNTBMbkYxWlhKNVUyVnNaV04wYjNKQmJHd29ZRnRrWVhSaExYUnZaMmRzWlQxY0lpUjdUa0ZOUlgxY0lsMWdLVnh1SUNCcFppQW9kR0ZpY3lrZ2UxeHVJQ0FnSUVGeWNtRjVMbVp5YjIwb2RHRmljeWt1Wm05eVJXRmphQ2dvWld4bGJXVnVkQ2tnUFQ0Z2UxeHVJQ0FnSUNBZ0x5OGdZMjl1YzNRZ1kyOXVabWxuSUQwZ2UzMWNiaUFnSUNBZ0lHTnZibk4wSUdOdmJtWnBaeUE5SUdkbGRFRjBkSEpwWW5WMFpYTkRiMjVtYVdjb1pXeGxiV1Z1ZEN3Z1JFVkdRVlZNVkY5UVVrOVFSVkpVU1VWVExDQkVRVlJCWDBGVVZGSlRYMUJTVDFCRlVsUkpSVk1wWEc0Z0lDQWdJQ0JqYjI1bWFXY3VaV3hsYldWdWRDQTlJR1ZzWlcxbGJuUmNibHh1SUNBZ0lDQWdZMjl0Y0c5dVpXNTBjeTV3ZFhOb0tGUmhZaTVmUkU5TlNXNTBaWEptWVdObEtHTnZibVpwWnlrcFhHNGdJQ0FnZlNsY2JpQWdmVnh1WEc0Z0lHbG1JQ2gwWVdKektTQjdYRzRnSUNBZ1pHOWpkVzFsYm5RdVlXUmtSWFpsYm5STWFYTjBaVzVsY2lnblkyeHBZMnNuTENBb1pYWmxiblFwSUQwK0lIdGNiaUFnSUNBZ0lHTnZibk4wSUdSaGRHRlViMmRuYkdWQmRIUnlJRDBnWlhabGJuUXVkR0Z5WjJWMExtZGxkRUYwZEhKcFluVjBaU2duWkdGMFlTMTBiMmRuYkdVbktWeHVJQ0FnSUNBZ2FXWWdLR1JoZEdGVWIyZG5iR1ZCZEhSeUlDWW1JR1JoZEdGVWIyZG5iR1ZCZEhSeUlEMDlQU0JPUVUxRktTQjdYRzRnSUNBZ0lDQWdJR052Ym5OMElHbGtJRDBnWlhabGJuUXVkR0Z5WjJWMExtZGxkRUYwZEhKcFluVjBaU2duYUhKbFppY3BYRzVjYmlBZ0lDQWdJQ0FnWTI5dWMzUWdZMjl0Y0c5dVpXNTBJRDBnWTI5dGNHOXVaVzUwY3k1bWFXNWtLR01nUFQ0Z1l5NW5aWFJGYkdWdFpXNTBLQ2t1WjJWMFFYUjBjbWxpZFhSbEtDZG9jbVZtSnlrZ1BUMDlJR2xrS1Z4dVhHNGdJQ0FnSUNBZ0lHbG1JQ2doWTI5dGNHOXVaVzUwS1NCN1hHNGdJQ0FnSUNBZ0lDQWdjbVYwZFhKdVhHNGdJQ0FnSUNBZ0lIMWNibHh1SUNBZ0lDQWdJQ0JqYjIxd2IyNWxiblF1YzJodmR5Z3BYRzRnSUNBZ0lDQjlYRzRnSUNBZ2ZTbGNiaUFnZlZ4dVhHNGdJSEpsZEhWeWJpQlVZV0pjYm4wcEtDbGNibHh1Wlhod2IzSjBJR1JsWm1GMWJIUWdWR0ZpWEc0aUxDSXZLaXBjYmlvZ0xTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMWNiaW9nVEdsalpXNXpaV1FnZFc1a1pYSWdUVWxVSUNob2RIUndjem92TDJkcGRHaDFZaTVqYjIwdmNYVmhjbXN0WkdWMkwxQm9iMjV2YmkxR2NtRnRaWGR2Y21zdllteHZZaTl0WVhOMFpYSXZURWxEUlU1VFJTbGNiaW9nTFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMxY2Jpb3ZYRzVjYm1OdmJuTjBJRUpwYm1SbGNpQTlJQ2dvS1NBOVBpQjdYRzRnSUM4cUtseHVJQ0FxSUMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFZ4dUlDQXFJRU52Ym5OMFlXNTBjMXh1SUNBcUlDMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExWeHVJQ0FxTDF4dVhHNGdJR052Ym5OMElFNUJUVVVnUFNBbmFXNTBiQzFpYVc1a1pYSW5YRzRnSUdOdmJuTjBJRlpGVWxOSlQwNGdQU0FuTWk0d0xqQW5YRzVjYmlBZ0x5b3FYRzRnSUNBcUlDMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExWeHVJQ0FnS2lCRGJHRnpjeUJFWldacGJtbDBhVzl1WEc0Z0lDQXFJQzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMVnh1SUNBZ0tpOWNibHh1SUNCamJHRnpjeUJDYVc1a1pYSWdlMXh1SUNBZ0lHTnZibk4wY25WamRHOXlLR1ZzWlcxbGJuUXNJR1JoZEdFcElIdGNiaUFnSUNBZ0lIUm9hWE11Wld4bGJXVnVkQ0E5SUdWc1pXMWxiblJjYmlBZ0lDQWdJSFJvYVhNdVpHRjBZU0E5SUdSaGRHRmNibHh1SUNBZ0lDQWdhV1lnS0NGMGFHbHpMbWx6Uld4bGJXVnVkQ2gwYUdsekxtVnNaVzFsYm5RcEtTQjdYRzRnSUNBZ0lDQWdJSEpsZEhWeWJseHVJQ0FnSUNBZ2ZWeHVYRzRnSUNBZ0lDQXZMeUJoY25KaGVTQnZaaUJJVkUxTVJXeGxiV1Z1ZEZ4dUlDQWdJQ0FnYVdZZ0tIUm9hWE11Wld4bGJXVnVkQzVzWlc1bmRHZ2dKaVlnZEdocGN5NWxiR1Z0Wlc1MExteGxibWQwYUNBK0lEQXBJSHRjYmlBZ0lDQWdJQ0FnZEdocGN5NXpaWFJPYjJSbGN5aDBhR2x6TG1Wc1pXMWxiblFwWEc0Z0lDQWdJQ0I5SUdWc2MyVWdlMXh1SUNBZ0lDQWdJQ0F2THlCemFXNW5iR1VnU0ZSTlRFVnNaVzFsYm5SY2JpQWdJQ0FnSUNBZ2RHaHBjeTV6WlhST2IyUmxLSFJvYVhNdVpXeGxiV1Z1ZENsY2JpQWdJQ0FnSUgxY2JpQWdJQ0I5WEc1Y2JpQWdJQ0F2THlCblpYUjBaWEp6WEc1Y2JpQWdJQ0J6ZEdGMGFXTWdaMlYwSUhabGNuTnBiMjRvS1NCN1hHNGdJQ0FnSUNCeVpYUjFjbTRnWUNSN1RrRk5SWDB1Skh0V1JWSlRTVTlPZldCY2JpQWdJQ0I5WEc1Y2JpQWdJQ0F2S2lwY2JpQWdJQ0FnS2lCRGFHVmphM01nYVdZZ2RHaGxJR2RwZG1WdUlHRnlaM1Z0Wlc1MElHbHpJR0VnUkU5TklHVnNaVzFsYm5SY2JpQWdJQ0FnS2lCQWNHRnlZVzBnZTBoVVRVeEZiR1Z0Wlc1MGZTQjBhR1VnWVhKbmRXMWxiblFnZEc4Z2RHVnpkRnh1SUNBZ0lDQXFJRUJ5WlhSMWNtNGdlMkp2YjJ4bFlXNTlJSFJ5ZFdVZ2FXWWdkR2hsSUc5aWFtVmpkQ0JwY3lCaElFUlBUU0JsYkdWdFpXNTBMQ0JtWVd4elpTQnZkR2hsY25kcGMyVmNiaUFnSUNBZ0tpOWNiaUFnSUNCcGMwVnNaVzFsYm5Rb1pXeGxiV1Z1ZENrZ2UxeHVJQ0FnSUNBZ2FXWWdLR1ZzWlcxbGJuUWdQVDA5SUc1MWJHd3BJSHRjYmlBZ0lDQWdJQ0FnY21WMGRYSnVJR1poYkhObFhHNGdJQ0FnSUNCOVhHNGdJQ0FnSUNCeVpYUjFjbTRnS0hSNWNHVnZaaUJPYjJSbElEMDlQU0FuYjJKcVpXTjBKeUEvSUdWc1pXMWxiblFnYVc1emRHRnVZMlZ2WmlCT2IyUmxJRG9nWld4bGJXVnVkQ0FtSmlCMGVYQmxiMllnWld4bGJXVnVkQ0E5UFQwZ0oyOWlhbVZqZENjZ0ppWWdkSGx3Wlc5bUlHVnNaVzFsYm5RdWJtOWtaVlI1Y0dVZ1BUMDlJQ2R1ZFcxaVpYSW5JQ1ltSUhSNWNHVnZaaUJsYkdWdFpXNTBMbTV2WkdWT1lXMWxJRDA5UFNBbmMzUnlhVzVuSnlsY2JpQWdJQ0I5WEc1Y2JpQWdJQ0F2S2lwY2JpQWdJQ0FxSUVKcGJtUnpJSE52YldVZ2RHVjRkQ0IwYnlCMGFHVWdaMmwyWlc0Z1JFOU5JR1ZzWlcxbGJuUmNiaUFnSUNBcUlFQndZWEpoYlNCN1NGUk5URVZzWlcxbGJuUjlJR1ZzWlcxbGJuUmNiaUFnSUNBcUlFQndZWEpoYlNCN1UzUnlhVzVuZlNCMFpYaDBYRzRnSUNBZ0tpOWNiaUFnSUNCelpYUlVaWGgwS0dWc1pXMWxiblFzSUhSbGVIUXBJSHRjYmlBZ0lDQWdJR2xtSUNnaEtDZDBaWGgwUTI5dWRHVnVkQ2NnYVc0Z1pXeGxiV1Z1ZENrcElIdGNiaUFnSUNBZ0lDQWdaV3hsYldWdWRDNXBibTVsY2xSbGVIUWdQU0IwWlhoMFhHNGdJQ0FnSUNCOUlHVnNjMlVnZTF4dUlDQWdJQ0FnSUNCbGJHVnRaVzUwTG5SbGVIUkRiMjUwWlc1MElEMGdkR1Y0ZEZ4dUlDQWdJQ0FnZlZ4dUlDQWdJSDFjYmx4dUlDQWdJQzhxS2x4dUlDQWdJQ0FxSUVKcGJtUnpJSE52YldVZ2FIUnRiQ0IwYnlCMGFHVWdaMmwyWlc0Z1JFOU5JR1ZzWlcxbGJuUmNiaUFnSUNBZ0tpQkFjR0Z5WVcwZ2UwaFVUVXhGYkdWdFpXNTBmU0JsYkdWdFpXNTBYRzRnSUNBZ0lDb2dRSEJoY21GdElIdHpkSEpwYm1kOUlIUmxlSFJjYmlBZ0lDQWdLaTljYmlBZ0lDQnpaWFJJZEcxc0tHVnNaVzFsYm5Rc0lIUmxlSFFwSUh0Y2JpQWdJQ0FnSUdWc1pXMWxiblF1YVc1dVpYSklWRTFNSUQwZ2RHVjRkRnh1SUNBZ0lIMWNibHh1SUNBZ0lDOHFLbHh1SUNBZ0lDQXFJRUpwYm1SeklHTjFjM1J2YlNCaGRIUnlhV0oxZEdWeklIUnZJSFJvWlNCbmFYWmxiaUJFVDAwZ1pXeGxiV1Z1ZEZ4dUlDQWdJQ0FxSUVCd1lYSmhiU0I3U0ZSTlRFVnNaVzFsYm5SOUlHVnNaVzFsYm5SY2JpQWdJQ0FnS2lCQWNHRnlZVzBnZTFOMGNtbHVaMzBnWVhSMGNseHVJQ0FnSUNBcUlFQndZWEpoYlNCN1UzUnlhVzVuZlNCMFpYaDBYRzRnSUNBZ0lDb3ZYRzRnSUNBZ2MyVjBRWFIwY21saWRYUmxLR1ZzWlcxbGJuUXNJR0YwZEhJc0lIUmxlSFFwSUh0Y2JpQWdJQ0FnSUdWc1pXMWxiblF1YzJWMFFYUjBjbWxpZFhSbEtHRjBkSElzSUhSbGVIUXBYRzRnSUNBZ2ZWeHVYRzRnSUNBZ2MyVjBUbTlrWlNobGJHVnRaVzUwS1NCN1hHNGdJQ0FnSUNCc1pYUWdZWFIwY2lBOUlHVnNaVzFsYm5RdVoyVjBRWFIwY21saWRYUmxLQ2RrWVhSaExXa3hPRzRuS1Z4dUlDQWdJQ0FnYVdZZ0tDRmhkSFJ5S1NCN1hHNGdJQ0FnSUNBZ0lISmxkSFZ5Ymx4dUlDQWdJQ0FnZlZ4dVhHNGdJQ0FnSUNCaGRIUnlJRDBnWVhSMGNpNTBjbWx0S0NsY2JseHVJQ0FnSUNBZ1kyOXVjM1FnY2lBOUlDOG9QenBjWEhOOFhpa29XMEV0V21FdGVpMWZNQzA1WFNzcE9seGNjeW9vTGlvL0tTZy9QVnhjY3l0Y1hIY3JPbndrS1M5blhHNGdJQ0FnSUNCc1pYUWdiVnh1WEc0Z0lDQWdJQ0IzYUdsc1pTQW9iU0E5SUhJdVpYaGxZeWhoZEhSeUtTa2dlMXh1SUNBZ0lDQWdJQ0JqYjI1emRDQnJaWGtnUFNCdFd6RmRMblJ5YVcwb0tWeHVJQ0FnSUNBZ0lDQmpiMjV6ZENCMllXeDFaU0E5SUcxYk1sMHVkSEpwYlNncExuSmxjR3hoWTJVb0p5d25MQ0FuSnlsY2JpQWdJQ0FnSUNBZ2JHVjBJR2x1ZEd4V1lXeDFaU0E5SUhSb2FYTXVaR0YwWVZ0MllXeDFaVjFjYmx4dUlDQWdJQ0FnSUNCcFppQW9JWFJvYVhNdVpHRjBZVnQyWVd4MVpWMHBJSHRjYmlBZ0lDQWdJQ0FnSUNCamIyNXpiMnhsTG14dlp5aGdKSHRPUVUxRmZTNGdWMkZ5Ym1sdVp5d2dKSHQyWVd4MVpYMGdaRzlsY3lCdWIzUWdaWGhwYzNRdVlDbGNiaUFnSUNBZ0lDQWdJQ0JwYm5Sc1ZtRnNkV1VnUFNCMllXeDFaVnh1SUNBZ0lDQWdJQ0I5WEc1Y2JpQWdJQ0FnSUNBZ1kyOXVjM1FnYldWMGFHOWtUbUZ0WlNBOUlDZHpaWFFuSUNzZ2EyVjVMbU5vWVhKQmRDZ3dLUzUwYjFWd2NHVnlRMkZ6WlNncElDc2dhMlY1TG5Oc2FXTmxLREVwWEc1Y2JpQWdJQ0FnSUNBZ2FXWWdLSFJvYVhOYmJXVjBhRzlrVG1GdFpWMHBJSHRjYmlBZ0lDQWdJQ0FnSUNCMGFHbHpXMjFsZEdodlpFNWhiV1ZkS0dWc1pXMWxiblFzSUdsdWRHeFdZV3gxWlNsY2JpQWdJQ0FnSUNBZ2ZTQmxiSE5sSUh0Y2JpQWdJQ0FnSUNBZ0lDQjBhR2x6TG5ObGRFRjBkSEpwWW5WMFpTaGxiR1Z0Wlc1MExDQnJaWGtzSUdsdWRHeFdZV3gxWlNsY2JpQWdJQ0FnSUNBZ2ZWeHVJQ0FnSUNBZ2ZWeHVJQ0FnSUgxY2JseHVJQ0FnSUM4cUtseHVJQ0FnSUNvZ1UyVjBJSFpoYkhWbGN5QjBieUJFVDAwZ2JtOWtaWE5jYmlBZ0lDQXFMMXh1SUNBZ0lITmxkRTV2WkdWektHVnNaVzFsYm5RcElIdGNiaUFnSUNBZ0lFRnljbUY1TG1aeWIyMG9aV3hsYldWdWRDa3VabTl5UldGamFDaGxiQ0E5UGlCMGFHbHpMbk5sZEU1dlpHVW9aV3dwS1Z4dUlDQWdJSDFjYmlBZ2ZWeHVYRzRnSUhKbGRIVnliaUJDYVc1a1pYSmNibjBwS0NsY2JseHVaWGh3YjNKMElHUmxabUYxYkhRZ1FtbHVaR1Z5WEc0aUxDSXZLaXBjYmlBcUlDMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRYRzRnS2lCTWFXTmxibk5sWkNCMWJtUmxjaUJOU1ZRZ0tHaDBkSEJ6T2k4dloybDBhSFZpTG1OdmJTOXhkV0Z5YXkxa1pYWXZVR2h2Ym05dUxVWnlZVzFsZDI5eWF5OWliRzlpTDIxaGMzUmxjaTlNU1VORlRsTkZLVnh1SUNvZ0xTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMWNiaUFxTDF4dWFXMXdiM0owSUVKcGJtUmxjaUJtY205dElDY3VMMkpwYm1SbGNpZGNibHh1WTI5dWMzUWdTVzUwYkNBOUlDZ29LU0E5UGlCN1hHNGdJQzhxS2x4dUlDQWdLaUF0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzFjYmlBZ0lDb2dRMjl1YzNSaGJuUnpYRzRnSUNBcUlDMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExWeHVJQ0FnS2k5Y2JseHVJQ0JqYjI1emRDQk9RVTFGSUQwZ0owbHVkR3duWEc0Z0lHTnZibk4wSUZaRlVsTkpUMDRnUFNBbk1pNHdMakFuWEc0Z0lHTnZibk4wSUVSRlJrRlZURlJmVUZKUFVFVlNWRWxGVXlBOUlIdGNiaUFnSUNCbVlXeHNZbUZqYTB4dlkyRnNaVG9nSjJWdUp5eGNiaUFnSUNCc2IyTmhiR1U2SUNkbGJpY3NYRzRnSUNBZ1lYVjBiMEpwYm1RNklIUnlkV1VzWEc0Z0lDQWdaR0YwWVRvZ2JuVnNiQ3hjYmlBZ2ZWeHVYRzRnSUM4cUtseHVJQ0FnS2lBdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMxY2JpQWdJQ29nUTJ4aGMzTWdSR1ZtYVc1cGRHbHZibHh1SUNBZ0tpQXRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMWNiaUFnSUNvdlhHNWNiaUFnWTJ4aGMzTWdTVzUwYkNCN1hHNGdJQ0FnTHlvcVhHNGdJQ0FnSUNvZ1EzSmxZWFJsY3lCaGJpQnBibk4wWVc1alpTQnZaaUJKYm5Sc0xseHVJQ0FnSUNBcUlFQndZWEpoYlNCN1ptRnNiR0poWTJ0TWIyTmhiR1U2SUhOMGNtbHVaeXdnYkc5allXeGxPaUJ6ZEhKcGJtY3NJR0YxZEc5Q2FXNWtPaUJpYjI5c1pXRnVMQ0JrWVhSaE9pQjdXMnhoYm1jNklITjBjbWx1WjEwNklIdGJhMlY1T2lCemRISnBibWRkT2lCemRISnBibWQ5ZlgxY2JpQWdJQ0FnS2k5Y2JpQWdJQ0JqYjI1emRISjFZM1J2Y2lodmNIUnBiMjV6SUQwZ2UzMHBJSHRjYmlBZ0lDQWdJSFJvYVhNdWIzQjBhVzl1Y3lBOUlFOWlhbVZqZEM1aGMzTnBaMjRvUkVWR1FWVk1WRjlRVWs5UVJWSlVTVVZUTENCdmNIUnBiMjV6S1Z4dVhHNGdJQ0FnSUNCcFppQW9kSGx3Wlc5bUlIUm9hWE11YjNCMGFXOXVjeTVtWVd4c1ltRmphMHh2WTJGc1pTQWhQVDBnSjNOMGNtbHVaeWNwSUh0Y2JpQWdJQ0FnSUNBZ2RHaHliM2NnYm1WM0lFVnljbTl5S0dBa2UwNUJUVVY5TGlCVWFHVWdabUZzYkdKaFkyc2diRzlqWVd4bElHbHpJRzFoYm1SaGRHOXllU0JoYm1RZ2JYVnpkQ0JpWlNCaElITjBjbWx1Wnk1Z0tWeHVJQ0FnSUNBZ2ZWeHVYRzRnSUNBZ0lDQnBaaUFvZEdocGN5NXZjSFJwYjI1ekxtUmhkR0VnUFQwOUlHNTFiR3dwSUh0Y2JpQWdJQ0FnSUNBZ2RHaHliM2NnYm1WM0lFVnljbTl5S0dBa2UwNUJUVVY5TGlCVWFHVnlaU0JwY3lCdWJ5QjBjbUZ1YzJ4aGRHbHZiaUJrWVhSaExtQXBYRzRnSUNBZ0lDQjlYRzVjYmlBZ0lDQWdJR2xtSUNoMGVYQmxiMllnZEdocGN5NXZjSFJwYjI1ekxtUmhkR0ZiZEdocGN5NXZjSFJwYjI1ekxtWmhiR3hpWVdOclRHOWpZV3hsWFNBaFBUMGdKMjlpYW1WamRDY3BJSHRjYmlBZ0lDQWdJQ0FnZEdoeWIzY2dibVYzSUVWeWNtOXlLR0FrZTA1QlRVVjlMaUJVYUdVZ1ptRnNiR0poWTJzZ2JHOWpZV3hsSUcxMWMzUWdibVZqWlhOellYSnBiSGtnYUdGMlpTQjBjbUZ1YzJ4aGRHbHZiaUJrWVhSaExtQXBYRzRnSUNBZ0lDQjlYRzVjYmlBZ0lDQWdJSFJvYVhNdWMyVjBURzlqWVd4bEtIUm9hWE11YjNCMGFXOXVjeTVzYjJOaGJHVXNJSFJvYVhNdWIzQjBhVzl1Y3k1aGRYUnZRbWx1WkNsY2JpQWdJQ0I5WEc1Y2JpQWdJQ0J6ZEdGMGFXTWdaMlYwSUhabGNuTnBiMjRvS1NCN1hHNGdJQ0FnSUNCeVpYUjFjbTRnWUNSN1RrRk5SWDB1Skh0V1JWSlRTVTlPZldCY2JpQWdJQ0I5WEc1Y2JpQWdJQ0JuWlhSTWIyTmhiR1VvS1NCN1hHNGdJQ0FnSUNCeVpYUjFjbTRnZEdocGN5NXZjSFJwYjI1ekxteHZZMkZzWlZ4dUlDQWdJSDFjYmx4dUlDQWdJR2RsZEVaaGJHeGlZV05yVEc5allXeGxLQ2tnZTF4dUlDQWdJQ0FnY21WMGRYSnVJSFJvYVhNdWIzQjBhVzl1Y3k1bVlXeHNZbUZqYTB4dlkyRnNaVnh1SUNBZ0lIMWNibHh1SUNBZ0lDOHFLbHh1SUNBZ0lDQXFJRk5sZENCa1pXWmhkV3gwSUd4dlkyRnNaVnh1SUNBZ0lDQXFJRUJ3WVhKaGJTQjdjM1J5YVc1bmZTQnNiMk5oYkdWY2JpQWdJQ0FnS2lCQWNHRnlZVzBnZTJKdmIyeGxZVzU5SUZ0MWNHUmhkR1ZJVkUxTVBYUnlkV1ZkWEc0Z0lDQWdJQ292WEc0Z0lDQWdjMlYwVEc5allXeGxLR3h2WTJGc1pTd2dkWEJrWVhSbFNGUk5UQ0E5SUhSeWRXVXBJSHRjYmlBZ0lDQWdJR2xtSUNoMGVYQmxiMllnZEdocGN5NXZjSFJwYjI1ekxtUmhkR0ZiYkc5allXeGxYU0FoUFQwZ0oyOWlhbVZqZENjcElIdGNiaUFnSUNBZ0lDQWdZMjl1YzI5c1pTNWxjbkp2Y2loZ0pIdE9RVTFGZlM0Z0pIdHNiMk5oYkdWOUlHaGhjeUJ1YnlCa1lYUmhMQ0JtWVd4c1ltRmpheUJwYmlBa2UzUm9hWE11YjNCMGFXOXVjeTVtWVd4c1ltRmphMHh2WTJGc1pYMHVZQ2xjYmlBZ0lDQWdJSDBnWld4elpTQjdYRzRnSUNBZ0lDQWdJSFJvYVhNdWIzQjBhVzl1Y3k1c2IyTmhiR1VnUFNCc2IyTmhiR1ZjYmlBZ0lDQWdJSDFjYmx4dUlDQWdJQ0FnYVdZZ0tIVndaR0YwWlVoVVRVd3BJSHRjYmlBZ0lDQWdJQ0FnZEdocGN5NTFjR1JoZEdWSWRHMXNLQ2xjYmlBZ0lDQWdJSDFjYmlBZ0lDQjlYRzVjYmlBZ0lDQm5aWFJNWVc1bmRXRm5aWE1vS1NCN1hHNGdJQ0FnSUNCeVpYUjFjbTRnVDJKcVpXTjBMbXRsZVhNb2RHaHBjeTV2Y0hScGIyNXpMbVJoZEdFcFhHNGdJQ0FnZlZ4dVhHNGdJQ0FnYVc1elpYSjBWbUZzZFdWektIWmhiSFZsSUQwZ2JuVnNiQ3dnYVc1cVpXTjBZV0pzWlZaaGJIVmxjeUE5SUh0OUtTQjdYRzRnSUNBZ0lDQnBaaUFvZEhsd1pXOW1JSFpoYkhWbElDRTlQU0FuYzNSeWFXNW5KeWtnZTF4dUlDQWdJQ0FnSUNCeVpYUjFjbTRnZFc1a1pXWnBibVZrWEc0Z0lDQWdJQ0I5WEc1Y2JpQWdJQ0FnSUdOdmJuTjBJRzFoZEdOb0lEMGdkbUZzZFdVdWJXRjBZMmdvTHpvb1cyRXRla0V0V2kxZk1DMDVYU3NwTHlsY2JpQWdJQ0FnSUdsbUlDaHRZWFJqYUNrZ2UxeHVJQ0FnSUNBZ0lDQjJZV3gxWlNBOUlIWmhiSFZsTG5KbGNHeGhZMlVvYldGMFkyaGJNRjBzSUdsdWFtVmpkR0ZpYkdWV1lXeDFaWE5iYldGMFkyaGJNVjFkS1Z4dUlDQWdJQ0FnZlZ4dVhHNGdJQ0FnSUNCcFppQW9kbUZzZFdVdWJXRjBZMmdvTHpvb1cyRXRla0V0V2kxZk1DMDVYU3NwTHlrcElIdGNiaUFnSUNBZ0lDQWdjbVYwZFhKdUlIUm9hWE11YVc1elpYSjBWbUZzZFdWektIWmhiSFZsTENCcGJtcGxZM1JoWW14bFZtRnNkV1Z6S1Z4dUlDQWdJQ0FnZlZ4dVhHNGdJQ0FnSUNCeVpYUjFjbTRnZG1Gc2RXVmNiaUFnSUNCOVhHNWNiaUFnSUNCMGNtRnVjMnhoZEdVb2EyVjVUbUZ0WlNBOUlHNTFiR3dzSUdsdWFtVmpkQ0E5SUh0OUtTQjdYRzRnSUNBZ0lDQnNaWFFnWkdGMFlTQTlJSFJvYVhNdWIzQjBhVzl1Y3k1a1lYUmhXM1JvYVhNdWIzQjBhVzl1Y3k1c2IyTmhiR1ZkWEc0Z0lDQWdJQ0JwWmlBb0lXUmhkR0VwSUh0Y2JpQWdJQ0FnSUNBZ1pHRjBZU0E5SUhSb2FYTXViM0IwYVc5dWN5NWtZWFJoVzNSb2FYTXViM0IwYVc5dWN5NW1ZV3hzWW1GamEweHZZMkZzWlYxY2JpQWdJQ0FnSUgxY2JseHVJQ0FnSUNBZ2FXWWdLR3RsZVU1aGJXVWdQVDA5SUc1MWJHd2dmSHdnYTJWNVRtRnRaU0E5UFQwZ0p5b25JSHg4SUVGeWNtRjVMbWx6UVhKeVlYa29hMlY1VG1GdFpTa3BJSHRjYmlBZ0lDQWdJQ0FnYVdZZ0tFRnljbUY1TG1selFYSnlZWGtvYTJWNVRtRnRaU2twSUh0Y2JpQWdJQ0FnSUNBZ0lDQmpiMjV6ZENCclpYbHpJRDBnVDJKcVpXTjBMbXRsZVhNb1pHRjBZU2t1Wm1sc2RHVnlLR3RsZVNBOVBpQnJaWGxPWVcxbExtbHVaR1Y0VDJZb2EyVjVLU0ErSUMweEtWeHVJQ0FnSUNBZ0lDQWdJR052Ym5OMElHWnBiSFJsY21Wa1JHRjBZU0E5SUh0OVhHNGdJQ0FnSUNBZ0lDQWdhMlY1Y3k1bWIzSkZZV05vS0d0bGVTQTlQaUI3WEc0Z0lDQWdJQ0FnSUNBZ0lDQm1hV3gwWlhKbFpFUmhkR0ZiYTJWNVhTQTlJSFJvYVhNdWFXNXpaWEowVm1Gc2RXVnpLR1JoZEdGYmEyVjVYU3dnYVc1cVpXTjBLVnh1SUNBZ0lDQWdJQ0FnSUgwcFhHNGdJQ0FnSUNBZ0lDQWdaR0YwWVNBOUlHWnBiSFJsY21Wa1JHRjBZVnh1SUNBZ0lDQWdJQ0I5WEc1Y2JpQWdJQ0FnSUNBZ1kyOXVjM1FnWkdGMFlVMWhjQ0E5SUh0OVhHNGdJQ0FnSUNBZ0lHWnZjaUFvWTI5dWMzUWdhMlY1SUdsdUlHUmhkR0VwSUh0Y2JpQWdJQ0FnSUNBZ0lDQmtZWFJoVFdGd1cydGxlVjBnUFNCMGFHbHpMbWx1YzJWeWRGWmhiSFZsY3loa1lYUmhXMnRsZVYwc0lHbHVhbVZqZENsY2JpQWdJQ0FnSUNBZ2ZWeHVYRzRnSUNBZ0lDQWdJSEpsZEhWeWJpQmtZWFJoVFdGd1hHNGdJQ0FnSUNCOVhHNWNiaUFnSUNBZ0lISmxkSFZ5YmlCMGFHbHpMbWx1YzJWeWRGWmhiSFZsY3loa1lYUmhXMnRsZVU1aGJXVmRMQ0JwYm1wbFkzUXBYRzRnSUNBZ2ZWeHVYRzRnSUNBZ0x5OGdZV3hwWVhNZ2IyWWdkQ2dwWEc0Z0lDQWdkQ2hyWlhsT1lXMWxJRDBnYm5Wc2JDd2dhVzVxWldOMElEMGdlMzBwSUh0Y2JpQWdJQ0FnSUhKbGRIVnliaUIwYUdsekxuUnlZVzV6YkdGMFpTaHJaWGxPWVcxbExDQnBibXBsWTNRcFhHNGdJQ0FnZlZ4dVhHNGdJQ0FnTHlvcVhHNGdJQ0FnSUNvZ1ZYQmtZWFJsY3lCMGFHVWdTRlJOVENCMmFXVjNjMXh1SUNBZ0lDQXFJRUJ3WVhKaGJTQjdTRlJOVEVWc1pXMWxiblI5SUdWc1pXMWxiblJjYmlBZ0lDQWdLaTljYmlBZ0lDQjFjR1JoZEdWSWRHMXNLR1ZzWlcxbGJuUXBJSHRjYmlBZ0lDQWdJR2xtSUNoMGVYQmxiMllnWld4bGJXVnVkQ0E5UFQwZ0ozVnVaR1ZtYVc1bFpDY3BJSHRjYmlBZ0lDQWdJQ0FnWld4bGJXVnVkQ0E5SUdSdlkzVnRaVzUwTG5GMVpYSjVVMlZzWldOMGIzSkJiR3dvSjF0a1lYUmhMV2t4T0c1ZEp5bGNiaUFnSUNBZ0lIMWNibHh1SUNBZ0lDQWdhV1lnS0hSNWNHVnZaaUJsYkdWdFpXNTBJRDA5UFNBbmMzUnlhVzVuSnlrZ2UxeHVJQ0FnSUNBZ0lDQmxiR1Z0Wlc1MElEMGdaRzlqZFcxbGJuUXVjWFZsY25sVFpXeGxZM1J2Y2lobGJHVnRaVzUwS1Z4dUlDQWdJQ0FnZlZ4dVhHNGdJQ0FnSUNCdVpYY2dRbWx1WkdWeUtHVnNaVzFsYm5Rc0lIUm9hWE11ZENncEtWeHVJQ0FnSUgxY2JseHVJQ0FnSUM4dklITjBZWFJwWTF4dUlDQWdJSE4wWVhScFl5QmZSRTlOU1c1MFpYSm1ZV05sS0c5d2RHbHZibk1wSUh0Y2JpQWdJQ0FnSUhKbGRIVnliaUJ1WlhjZ1NXNTBiQ2h2Y0hScGIyNXpLVnh1SUNBZ0lIMWNiaUFnZlZ4dVhHNGdJSEpsZEhWeWJpQkpiblJzWEc1OUtTZ3BYRzVjYm1WNGNHOXlkQ0JrWldaaGRXeDBJRWx1ZEd4Y2JpSXNJaThxS2x4dUlDb2dMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzFjYmlBcUlFeHBZMlZ1YzJWa0lIVnVaR1Z5SUUxSlZDQW9hSFIwY0hNNkx5OW5hWFJvZFdJdVkyOXRMM0YxWVhKckxXUmxkaTlRYUc5dWIyNHRSbkpoYldWM2IzSnJMMkpzYjJJdmJXRnpkR1Z5TDB4SlEwVk9VMFVwWEc0Z0tpQXRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMVnh1SUNvdlhHNWNibWx0Y0c5eWRDQlFZV2RsSUdaeWIyMGdKeTR2Y0dGblpTZGNibWx0Y0c5eWRDQkZkbVZ1ZENCbWNtOXRJQ2N1TGk4dUxpOWpiMjF0YjI0dlpYWmxiblJ6SjF4dVhHNWpiMjV6ZENCUVlXZGxjaUE5SUNnb0tTQTlQaUI3WEc0Z0lDOHFLbHh1SUNBZ0tpQXRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMWNiaUFnSUNvZ1EyOXVjM1JoYm5SelhHNGdJQ0FxSUMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFZ4dUlDQWdLaTljYmx4dUlDQmpiMjV6ZENCT1FVMUZJRDBnSjNCaFoyVnlKMXh1SUNCamIyNXpkQ0JXUlZKVFNVOU9JRDBnSnpJdU1DNHdKMXh1SUNCamIyNXpkQ0JFUlVaQlZVeFVYMUJTVDFCRlVsUkpSVk1nUFNCN1hHNGdJQ0FnYUdGemFGQnlaV1pwZURvZ0p5TWhKeXhjYmlBZ0lDQjFjMlZJWVhOb09pQjBjblZsTEZ4dUlDQWdJR1JsWm1GMWJIUlFZV2RsT2lCdWRXeHNMRnh1SUNBZ0lHRnVhVzFoZEdWUVlXZGxjem9nZEhKMVpTeGNiaUFnZlZ4dVhHNGdJR3hsZENCamRYSnlaVzUwVUdGblpWeHVJQ0F2S2lwY2JpQWdJQ29nTFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0WEc0Z0lDQXFJRU5zWVhOeklFUmxabWx1YVhScGIyNWNiaUFnSUNvZ0xTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdFhHNGdJQ0FxTDF4dVhHNGdJR05zWVhOeklGQmhaMlZ5SUh0Y2JpQWdJQ0F2S2lwY2JpQWdJQ0FnS2lCQVkyOXVjM1J5ZFdOMGIzSmNiaUFnSUNBZ0tseHVJQ0FnSUNBcUlFQndZWEpoYlNCdmNIUnBiMjV6SUh0UFltcGxZM1I5WEc0Z0lDQWdJQ292WEc0Z0lDQWdZMjl1YzNSeWRXTjBiM0lvYjNCMGFXOXVjeUE5SUh0OUtTQjdYRzRnSUNBZ0lDQjBhR2x6TG05d2RHbHZibk1nUFNCUFltcGxZM1F1WVhOemFXZHVLRVJGUmtGVlRGUmZVRkpQVUVWU1ZFbEZVeXdnYjNCMGFXOXVjeWxjYmx4dUlDQWdJQ0FnZEdocGN5NXdZV2RsY3lBOUlGdGRYRzRnSUNBZ0lDQjBhR2x6TG5OMFlYSjBaV1FnUFNCbVlXeHpaVnh1WEc0Z0lDQWdJQ0F2THlCaFpHUWdaMnh2WW1Gc0lHeHBjM1JsYm1WeWN5QnpkV05vSUdGemFDQm9ZWE5vSUdOb1lXNW5aU3dnYm1GMmFXZGhkR2x2Yml3Z1pYUmpMbHh1SUNBZ0lDQWdkR2hwY3k1aFpHUlFZV2RsY2tWMlpXNTBjeWdwWEc1Y2JpQWdJQ0FnSUM4dklHWmhjM1JsY2lCM1lYa2dkRzhnYVc1cGRDQndZV2RsY3lCaVpXWnZjbVVnZEdobElFUlBUU0JwY3lCeVpXRmtlVnh1SUNBZ0lDQWdkR2hwY3k1dmJrUlBUVXh2WVdSbFpDZ3BYRzRnSUNBZ2ZWeHVYRzRnSUNBZ0x5OGdjSEpwZG1GMFpWeHVJQ0FnSUY4b2MyVnNaV04wYjNJcElIdGNiaUFnSUNBZ0lISmxkSFZ5YmlCa2IyTjFiV1Z1ZEM1eGRXVnllVk5sYkdWamRHOXlLSE5sYkdWamRHOXlLVnh1SUNBZ0lIMWNibHh1SUNBZ0lHZGxkRWhoYzJnb0tTQjdYRzRnSUNBZ0lDQnlaWFIxY200Z2QybHVaRzkzTG14dlkyRjBhVzl1TG1oaGMyZ3VjM0JzYVhRb2RHaHBjeTV2Y0hScGIyNXpMbWhoYzJoUWNtVm1hWGdwV3pGZFhHNGdJQ0FnZlZ4dVhHNGdJQ0FnWjJWMFVHRm5aVVp5YjIxSVlYTm9LQ2tnZTF4dUlDQWdJQ0FnWTI5dWMzUWdhR0Z6YUNBOUlIUm9hWE11WjJWMFNHRnphQ2dwWEc0Z0lDQWdJQ0JqYjI1emRDQnlaU0E5SUc1bGR5QlNaV2RGZUhBb0oxcy9YRnd2WFNoYlhseGNMMTBxS1NjcFhHNGdJQ0FnSUNCamIyNXpkQ0J0WVhSamFHVnpJRDBnY21VdVpYaGxZeWhvWVhOb0tWeHVYRzRnSUNBZ0lDQnBaaUFvYldGMFkyaGxjeUFtSmlCdFlYUmphR1Z6V3pGZEtTQjdYRzRnSUNBZ0lDQWdJSEpsZEhWeWJpQnRZWFJqYUdWeld6RmRYRzRnSUNBZ0lDQjlYRzVjYmlBZ0lDQWdJSEpsZEhWeWJpQnVkV3hzWEc0Z0lDQWdmVnh1WEc0Z0lDQWdjMlYwU0dGemFDaHdZV2RsVG1GdFpTa2dlMXh1SUNBZ0lDQWdkMmx1Wkc5M0xteHZZMkYwYVc5dUxtaGhjMmdnUFNCZ0pIdDBhR2x6TG05d2RHbHZibk11YUdGemFGQnlaV1pwZUgwdkpIdHdZV2RsVG1GdFpYMWdYRzRnSUNBZ2ZWeHVYRzRnSUNBZ1lYSmxVMkZ0WlZCaFoyVW9jR0ZuWlU1aGJXVXhMQ0J3WVdkbFRtRnRaVElwSUh0Y2JpQWdJQ0FnSUdOdmJuTjBJSEJoWjJVeElEMGdkR2hwY3k1blpYUlFZV2RsVFc5a1pXd29jR0ZuWlU1aGJXVXhLVnh1SUNBZ0lDQWdZMjl1YzNRZ2NHRm5aVElnUFNCMGFHbHpMbWRsZEZCaFoyVk5iMlJsYkNod1lXZGxUbUZ0WlRJcFhHNGdJQ0FnSUNCeVpYUjFjbTRnY0dGblpURWdKaVlnY0dGblpUSWdKaVlnY0dGblpURXVibUZ0WlNBOVBUMGdjR0ZuWlRJdWJtRnRaVnh1SUNBZ0lIMWNibHh1SUNBZ0lDOHFLbHh1SUNBZ0lDQXFJRUYwZEdGamFHVnpJSFJvWlNCdFlXbHVJR1YyWlc1MGN5Qm1iM0lnZEhKaFkydHBibWNnYUdGemFDQmphR0Z1WjJWekxGeHVJQ0FnSUNBcUlHTnNhV05ySUc5dUlHNWhkbWxuWVhScGIyNGdZblYwZEc5dWN5QmhibVFnYkdsdWEzTWdZVzVrSUdKaFkyc2dhR2x6ZEc5eWVWeHVJQ0FnSUNBcUwxeHVJQ0FnSUdGa1pGQmhaMlZ5UlhabGJuUnpLQ2tnZTF4dUlDQWdJQ0FnWkc5amRXMWxiblF1WVdSa1JYWmxiblJNYVhOMFpXNWxjaWduWTJ4cFkyc25MQ0JsZG1WdWRDQTlQaUIwYUdsekxtOXVRMnhwWTJzb1pYWmxiblFwS1Z4dUlDQWdJQ0FnZDJsdVpHOTNMbUZrWkVWMlpXNTBUR2x6ZEdWdVpYSW9KM0J2Y0hOMFlYUmxKeXdnWlhabGJuUWdQVDRnZEdocGN5NXZia0poWTJ0SWFYTjBiM0o1S0dWMlpXNTBLU2xjYmlBZ0lDQWdJSGRwYm1SdmR5NWhaR1JGZG1WdWRFeHBjM1JsYm1WeUtDZG9ZWE5vWTJoaGJtZGxKeXdnWlhabGJuUWdQVDRnZEdocGN5NXZia2hoYzJoRGFHRnVaMlVvWlhabGJuUXBLVnh1SUNBZ0lDQWdaRzlqZFcxbGJuUXVZV1JrUlhabGJuUk1hWE4wWlc1bGNpZ25SRTlOUTI5dWRHVnVkRXh2WVdSbFpDY3NJR1YyWlc1MElEMCtJSFJvYVhNdWIyNUVUMDFNYjJGa1pXUW9aWFpsYm5RcEtWeHVJQ0FnSUgxY2JseHVJQ0FnSUM4dklHZGxkSFJsY25OY2JseHVJQ0FnSUhOMFlYUnBZeUJuWlhRZ2RtVnljMmx2YmlncElIdGNiaUFnSUNBZ0lISmxkSFZ5YmlCZ0pIdE9RVTFGZlM0a2UxWkZVbE5KVDA1OVlGeHVJQ0FnSUgxY2JseHVJQ0FnSUM4dklIQjFZbXhwWTF4dVhHNGdJQ0FnYzJodmQxQmhaMlVvY0dGblpVNWhiV1VzSUdGa1pGUnZTR2x6ZEc5eWVTQTlJSFJ5ZFdVc0lHSmhZMnNnUFNCbVlXeHpaU2tnZTF4dUlDQWdJQ0FnWTI5dWMzUWdiMnhrVUdGblpTQTlJSFJvYVhNdVh5Z25MbU4xY25KbGJuUW5LVnh1SUNBZ0lDQWdhV1lnS0c5c1pGQmhaMlVwSUh0Y2JpQWdJQ0FnSUNBZ1kyOXVjM1FnYjJ4a1VHRm5aVTVoYldVZ1BTQnZiR1JRWVdkbExtZGxkRUYwZEhKcFluVjBaU2duWkdGMFlTMXdZV2RsSnlsY2JseHVJQ0FnSUNBZ0lDQnBaaUFvZEdocGN5NWhjbVZUWVcxbFVHRm5aU2h3WVdkbFRtRnRaU3dnYjJ4a1VHRm5aVTVoYldVcEtTQjdYRzRnSUNBZ0lDQWdJQ0FnY21WMGRYSnVYRzRnSUNBZ0lDQWdJSDFjYmx4dUlDQWdJQ0FnSUNCdmJHUlFZV2RsTG1Oc1lYTnpUR2x6ZEM1eVpXMXZkbVVvSjJOMWNuSmxiblFuS1Z4dVhHNGdJQ0FnSUNBZ0lDOHZJR2hwYzNSdmNubGNiaUFnSUNBZ0lDQWdkMmx1Wkc5M0xtaHBjM1J2Y25rdWNtVndiR0ZqWlZOMFlYUmxLSHNnY0dGblpUb2diMnhrVUdGblpVNWhiV1VnZlN3Z2IyeGtVR0ZuWlU1aGJXVXNJSGRwYm1SdmR5NXNiMk5oZEdsdmJpNW9jbVZtS1Z4dVhHNGdJQ0FnSUNBZ0lIUm9hWE11ZEhKcFoyZGxjbEJoWjJWRmRtVnVkQ2h2YkdSUVlXZGxUbUZ0WlN3Z1JYWmxiblF1U0VsRVJTbGNiaUFnSUNBZ0lIMWNibHh1SUNBZ0lDQWdkR2hwY3k1MGNtbG5aMlZ5VUdGblpVVjJaVzUwS0hCaFoyVk9ZVzFsTENCRmRtVnVkQzVUU0U5WEtWeHVYRzRnSUNBZ0lDQmpkWEp5Wlc1MFVHRm5aU0E5SUhCaFoyVk9ZVzFsWEc1Y2JpQWdJQ0FnSUM4dklHNWxkeUJ3WVdkbFhHNGdJQ0FnSUNCamIyNXpkQ0J1WlhkUVlXZGxJRDBnZEdocGN5NWZLR0JiWkdGMFlTMXdZV2RsUFZ3aUpIdHdZV2RsVG1GdFpYMWNJbDFnS1Z4dVhHNGdJQ0FnSUNCdVpYZFFZV2RsTG1Oc1lYTnpUR2x6ZEM1aFpHUW9KMk4xY25KbGJuUW5LVnh1WEc0Z0lDQWdJQ0F2THlCMFpXMXdiR0YwWlNCc2IyRmtaWEpjYmlBZ0lDQWdJR052Ym5OMElIQmhaMlZOYjJSbGJDQTlJSFJvYVhNdVoyVjBVR0ZuWlUxdlpHVnNLSEJoWjJWT1lXMWxLVnh1WEc0Z0lDQWdJQ0F2THlCQWRHOWtiem9nZFhObElIUmxiWEJzWVhSbElHTmhZMmhsUDF4dUlDQWdJQ0FnYVdZZ0tIQmhaMlZOYjJSbGJDQW1KaUJ3WVdkbFRXOWtaV3d1WjJWMFZHVnRjR3hoZEdVb0tTa2dlMXh1SUNBZ0lDQWdJQ0J3WVdkbFRXOWtaV3d1Ykc5aFpGUmxiWEJzWVhSbEtDbGNiaUFnSUNBZ0lIMWNiaUFnSUNBZ0lDOHZJR1Z1WkZ4dVhHNGdJQ0FnSUNCcFppQW9iMnhrVUdGblpTa2dlMXh1SUNBZ0lDQWdJQ0JqYjI1emRDQnZiR1JRWVdkbFRtRnRaU0E5SUc5c1pGQmhaMlV1WjJWMFFYUjBjbWxpZFhSbEtDZGtZWFJoTFhCaFoyVW5LVnh1SUNBZ0lDQWdJQ0F2THlCMWMyVWdiMllnY0hKdmRHOTBlWEJsTFc5eWFXVnVkR1ZrSUd4aGJtZDFZV2RsWEc0Z0lDQWdJQ0FnSUc5c1pGQmhaMlV1WW1GamF5QTlJR0poWTJ0Y2JpQWdJQ0FnSUNBZ2IyeGtVR0ZuWlM1d2NtVjJhVzkxYzFCaFoyVk9ZVzFsSUQwZ2IyeGtVR0ZuWlU1aGJXVmNibHh1SUNBZ0lDQWdJQ0JqYjI1emRDQnZibEJoWjJWQmJtbHRZWFJwYjI1RmJtUWdQU0FvS1NBOVBpQjdYRzRnSUNBZ0lDQWdJQ0FnYVdZZ0tHOXNaRkJoWjJVdVkyeGhjM05NYVhOMExtTnZiblJoYVc1ektDZGhibWx0WVhSbEp5a3BJSHRjYmlBZ0lDQWdJQ0FnSUNBZ0lHOXNaRkJoWjJVdVkyeGhjM05NYVhOMExuSmxiVzkyWlNnbllXNXBiV0YwWlNjcFhHNGdJQ0FnSUNBZ0lDQWdmVnh1WEc0Z0lDQWdJQ0FnSUNBZ2IyeGtVR0ZuWlM1amJHRnpjMHhwYzNRdWNtVnRiM1psS0c5c1pGQmhaMlV1WW1GamF5QS9JQ2R3YjNBdGNHRm5aU2NnT2lBbmNIVnphQzF3WVdkbEp5bGNibHh1SUNBZ0lDQWdJQ0FnSUhSb2FYTXVkSEpwWjJkbGNsQmhaMlZGZG1WdWRDaGpkWEp5Wlc1MFVHRm5aU3dnUlhabGJuUXVVMGhQVjA0cFhHNGdJQ0FnSUNBZ0lDQWdkR2hwY3k1MGNtbG5aMlZ5VUdGblpVVjJaVzUwS0c5c1pGQmhaMlV1Y0hKbGRtbHZkWE5RWVdkbFRtRnRaU3dnUlhabGJuUXVTRWxFUkVWT0tWeHVYRzRnSUNBZ0lDQWdJQ0FnYjJ4a1VHRm5aUzV5WlcxdmRtVkZkbVZ1ZEV4cGMzUmxibVZ5S0VWMlpXNTBMa0ZPU1UxQlZFbFBUbDlGVGtRc0lHOXVVR0ZuWlVGdWFXMWhkR2x2YmtWdVpDbGNiaUFnSUNBZ0lDQWdmVnh1WEc0Z0lDQWdJQ0FnSUdsbUlDaDBhR2x6TG05d2RHbHZibk11WVc1cGJXRjBaVkJoWjJWektTQjdYRzRnSUNBZ0lDQWdJQ0FnYjJ4a1VHRm5aUzVoWkdSRmRtVnVkRXhwYzNSbGJtVnlLRVYyWlc1MExrRk9TVTFCVkVsUFRsOUZUa1FzSUc5dVVHRm5aVUZ1YVcxaGRHbHZia1Z1WkNsY2JpQWdJQ0FnSUNBZ0lDQnZiR1JRWVdkbExtTnNZWE56VEdsemRDNWhaR1FvSjJGdWFXMWhkR1VuS1Z4dUlDQWdJQ0FnSUNCOUlHVnNjMlVnZTF4dUlDQWdJQ0FnSUNBZ0lHOXVVR0ZuWlVGdWFXMWhkR2x2YmtWdVpDZ3BYRzRnSUNBZ0lDQWdJSDFjYmx4dUlDQWdJQ0FnSUNCdmJHUlFZV2RsTG1Oc1lYTnpUR2x6ZEM1aFpHUW9ZbUZqYXlBL0lDZHdiM0F0Y0dGblpTY2dPaUFuY0hWemFDMXdZV2RsSnlsY2JpQWdJQ0FnSUgxY2JpQWdJQ0I5WEc1Y2JpQWdJQ0JoWkdSVmJtbHhkV1ZRWVdkbFRXOWtaV3dvY0dGblpVNWhiV1VwSUh0Y2JpQWdJQ0FnSUdsbUlDZ2hkR2hwY3k1blpYUlFZV2RsVFc5a1pXd29jR0ZuWlU1aGJXVXBLU0I3WEc0Z0lDQWdJQ0FnSUhSb2FYTXVjR0ZuWlhNdWNIVnphQ2h1WlhjZ1VHRm5aU2h3WVdkbFRtRnRaU2twWEc0Z0lDQWdJQ0I5WEc0Z0lDQWdmVnh1WEc0Z0lDQWdaMlYwVUdGblpVMXZaR1ZzS0hCaFoyVk9ZVzFsS1NCN1hHNGdJQ0FnSUNCeVpYUjFjbTRnZEdocGN5NXdZV2RsY3k1bWFXNWtLSEJoWjJVZ1BUNGdjR0ZuWlM1dVlXMWxJRDA5UFNCd1lXZGxUbUZ0WlNsY2JpQWdJQ0I5WEc1Y2JpQWdJQ0JuWlhSUVlXZGxjMDF2WkdWc0tIQmhaMlZPWVcxbGN5a2dlMXh1SUNBZ0lDQWdjbVYwZFhKdUlIUm9hWE11Y0dGblpYTXVabWxzZEdWeUtIQmhaMlVnUFQ0Z2NHRm5aVTVoYldWekxtbHVaR1Y0VDJZb2NHRm5aUzV1WVcxbEtTQStJQzB4S1Z4dUlDQWdJSDFjYmx4dUlDQWdJSE5sYkdWamRHOXlWRzlCY25KaGVTaHpkSElwSUh0Y2JpQWdJQ0FnSUhKbGRIVnliaUJ6ZEhJdWMzQnNhWFFvSnl3bktTNXRZWEFvYVhSbGJTQTlQaUJwZEdWdExuUnlhVzBvS1NsY2JpQWdJQ0I5WEc1Y2JpQWdJQ0JoWkdSRmRtVnVkSE1vWTJGc2JHSmhZMnNwSUh0Y2JpQWdJQ0FnSUdsbUlDaDBhR2x6TG1OaFkyaGxVR0ZuWlZObGJHVmpkRzl5SUQwOVBTQW5LaWNwSUh0Y2JpQWdJQ0FnSUNBZ0x5OGdZV1JrSUhSdklHRnNiQ0J3WVdkbElHMXZaR1ZzYzF4dUlDQWdJQ0FnSUNCMGFHbHpMbkJoWjJWekxtWnZja1ZoWTJnb0tIQmhaMlVwSUQwK0lIdGNiaUFnSUNBZ0lDQWdJQ0J3WVdkbExtRmtaRVYyWlc1MFEyRnNiR0poWTJzb1kyRnNiR0poWTJzcFhHNGdJQ0FnSUNBZ0lIMHBYRzRnSUNBZ0lDQWdJSEpsZEhWeWJseHVJQ0FnSUNBZ2ZWeHVYRzRnSUNBZ0lDQmpiMjV6ZENCd1lXZGxUVzlrWld4eklEMGdkR2hwY3k1blpYUlFZV2RsYzAxdlpHVnNLSFJvYVhNdWMyVnNaV04wYjNKVWIwRnljbUY1S0hSb2FYTXVZMkZqYUdWUVlXZGxVMlZzWldOMGIzSXBMQ0IwY25WbEtWeHVJQ0FnSUNBZ2NHRm5aVTF2WkdWc2N5NW1iM0pGWVdOb0tDaHdZV2RsS1NBOVBpQjdYRzRnSUNBZ0lDQWdJSEJoWjJVdVlXUmtSWFpsYm5SRFlXeHNZbUZqYXloallXeHNZbUZqYXlsY2JpQWdJQ0FnSUgwcFhHNGdJQ0FnSUNCMGFHbHpMbU5oWTJobFVHRm5aVk5sYkdWamRHOXlJRDBnYm5Wc2JGeHVJQ0FnSUgxY2JseHVJQ0FnSUhWelpWUmxiWEJzWVhSbEtIUmxiWEJzWVhSbFVHRjBhQ3dnY21WdVpHVnlSblZ1WTNScGIyNGdQU0J1ZFd4c0tTQjdYRzRnSUNBZ0lDQmpiMjV6ZENCd1lXZGxUVzlrWld4eklEMGdkR2hwY3k1blpYUlFZV2RsYzAxdlpHVnNLSFJvYVhNdWMyVnNaV04wYjNKVWIwRnljbUY1S0hSb2FYTXVZMkZqYUdWUVlXZGxVMlZzWldOMGIzSXBMQ0IwY25WbEtWeHVJQ0FnSUNBZ2NHRm5aVTF2WkdWc2N5NW1iM0pGWVdOb0tDaHdZV2RsS1NBOVBpQjdYRzRnSUNBZ0lDQWdJSEJoWjJVdWRYTmxWR1Z0Y0d4aGRHVW9kR1Z0Y0d4aGRHVlFZWFJvS1Z4dUlDQWdJQ0FnSUNCcFppQW9kSGx3Wlc5bUlISmxibVJsY2taMWJtTjBhVzl1SUQwOVBTQW5ablZ1WTNScGIyNG5LU0I3WEc0Z0lDQWdJQ0FnSUNBZ2NHRm5aUzUxYzJWVVpXMXdiR0YwWlZKbGJtUmxjbVZ5S0hKbGJtUmxja1oxYm1OMGFXOXVLVnh1SUNBZ0lDQWdJQ0I5WEc0Z0lDQWdJQ0I5S1Z4dUlDQWdJQ0FnZEdocGN5NWpZV05vWlZCaFoyVlRaV3hsWTNSdmNpQTlJRzUxYkd4Y2JpQWdJQ0I5WEc1Y2JpQWdJQ0IwY21sbloyVnlVR0ZuWlVWMlpXNTBLSEJoWjJWT1lXMWxMQ0JsZG1WdWRFNWhiV1VzSUdWMlpXNTBVR0Z5WVcxeklEMGdiblZzYkNrZ2UxeHVJQ0FnSUNBZ1kyOXVjM1FnY0dGblpVMXZaR1ZzSUQwZ2RHaHBjeTVuWlhSUVlXZGxUVzlrWld3b2NHRm5aVTVoYldVcFhHNGdJQ0FnSUNCcFppQW9jR0ZuWlUxdlpHVnNLU0I3WEc0Z0lDQWdJQ0FnSUhCaFoyVk5iMlJsYkM1MGNtbG5aMlZ5VTJOdmNHVnpLR1YyWlc1MFRtRnRaU3dnWlhabGJuUlFZWEpoYlhNcFhHNGdJQ0FnSUNCOVhHNGdJQ0FnZlZ4dVhHNGdJQ0FnYjI1RGJHbGpheWhsZG1WdWRDa2dlMXh1SUNBZ0lDQWdZMjl1YzNRZ2NHRm5aVTVoYldVZ1BTQmxkbVZ1ZEM1MFlYSm5aWFF1WjJWMFFYUjBjbWxpZFhSbEtDZGtZWFJoTFc1aGRtbG5ZWFJsSnlsY2JpQWdJQ0FnSUdOdmJuTjBJSEIxYzJoUVlXZGxJRDBnSVNobGRtVnVkQzUwWVhKblpYUXVaMlYwUVhSMGNtbGlkWFJsS0Nka1lYUmhMWEJ2Y0Mxd1lXZGxKeWtnUFQwOUlDZDBjblZsSnlsY2JseHVJQ0FnSUNBZ2FXWWdLSEJoWjJWT1lXMWxLU0I3WEc0Z0lDQWdJQ0FnSUdsbUlDaHdZV2RsVG1GdFpTQTlQVDBnSnlSaVlXTnJKeWtnZTF4dUlDQWdJQ0FnSUNBZ0lDOHZJSFJvWlNCd2IzQnpkR0YwWlNCbGRtVnVkQ0IzYVd4c0lHSmxJSFJ5YVdkblpYSmxaRnh1SUNBZ0lDQWdJQ0FnSUhkcGJtUnZkeTVvYVhOMGIzSjVMbUpoWTJzb0tWeHVJQ0FnSUNBZ0lDQWdJSEpsZEhWeWJseHVJQ0FnSUNBZ0lDQjlYRzVjYmlBZ0lDQWdJQ0FnTHlwY2JpQWdJQ0FnSUNBZ0lDb2dTV1lnZDJVZ2FHVWdkWE5sSUhSb1pTQm9ZWE5vSUdGeklIUnlhV2RuWlhJc1hHNGdJQ0FnSUNBZ0lDQXFJSGRsSUdOb1lXNW5aU0JwZENCa2VXNWhiV2xqWVd4c2VTQnpieUIwYUdGMElIUm9aU0JvWVhOb1kyaGhibWRsSUdWMlpXNTBJR2x6SUdOaGJHeGxaRnh1SUNBZ0lDQWdJQ0FnS2lCUGRHaGxjbmRwYzJVc0lIZGxJSE5vYjNjZ2RHaGxJSEJoWjJWY2JpQWdJQ0FnSUNBZ0lDb3ZYRzRnSUNBZ0lDQWdJR2xtSUNoMGFHbHpMbTl3ZEdsdmJuTXVkWE5sU0dGemFDa2dlMXh1SUNBZ0lDQWdJQ0FnSUhSb2FYTXVjMlYwU0dGemFDaHdZV2RsVG1GdFpTbGNiaUFnSUNBZ0lDQWdmU0JsYkhObElIdGNiaUFnSUNBZ0lDQWdJQ0IwYUdsekxuTm9iM2RRWVdkbEtIQmhaMlZPWVcxbExDQjBjblZsTENCd2RYTm9VR0ZuWlNsY2JpQWdJQ0FnSUNBZ2ZWeHVJQ0FnSUNBZ2ZWeHVJQ0FnSUgxY2JseHVJQ0FnSUc5dVFtRmphMGhwYzNSdmNua29aWFpsYm5RZ1BTQjdmU2tnZTF4dUlDQWdJQ0FnWTI5dWMzUWdjR0ZuWlU1aGJXVWdQU0JsZG1WdWRDNXpkR0YwWlNBL0lHVjJaVzUwTG5OMFlYUmxMbkJoWjJVZ09pQnVkV3hzWEc0Z0lDQWdJQ0JwWmlBb0lYQmhaMlZPWVcxbEtTQjdYRzRnSUNBZ0lDQWdJSEpsZEhWeWJseHVJQ0FnSUNBZ2ZWeHVYRzRnSUNBZ0lDQjBhR2x6TG5Ob2IzZFFZV2RsS0hCaFoyVk9ZVzFsTENCMGNuVmxMQ0IwY25WbEtWeHVJQ0FnSUgxY2JseHVJQ0FnSUc5dVNHRnphRU5vWVc1blpTZ3BJSHRjYmlBZ0lDQWdJR052Ym5OMElIQmhjbUZ0Y3lBOUlDaDBhR2x6TG1kbGRFaGhjMmdvS1NBL0lIUm9hWE11WjJWMFNHRnphQ2dwTG5Od2JHbDBLQ2N2SnlrZ09pQmJYU2t1Wm1sc2RHVnlLSEFnUFQ0Z2NDNXNaVzVuZEdnZ1BpQXdLVnh1SUNBZ0lDQWdhV1lnS0hCaGNtRnRjeTVzWlc1bmRHZ2dQaUF3S1NCN1hHNGdJQ0FnSUNBZ0lDOHZJSEpsYlc5MlpTQm1hWEp6ZENCMllXeDFaU0IzYUdsamFDQnBjeUIwYUdVZ2NHRm5aU0J1WVcxbFhHNGdJQ0FnSUNBZ0lIQmhjbUZ0Y3k1emFHbG1kQ2dwWEc0Z0lDQWdJQ0I5WEc1Y2JpQWdJQ0FnSUhSb2FYTXVkSEpwWjJkbGNsQmhaMlZGZG1WdWRDaGpkWEp5Wlc1MFVHRm5aU3dnUlhabGJuUXVTRUZUU0N3Z2NHRnlZVzF6S1Z4dVhHNGdJQ0FnSUNCamIyNXpkQ0J1WVhaUVlXZGxJRDBnZEdocGN5NW5aWFJRWVdkbFJuSnZiVWhoYzJnb0tWeHVJQ0FnSUNBZ2FXWWdLRzVoZGxCaFoyVXBJSHRjYmlBZ0lDQWdJQ0FnZEdocGN5NXphRzkzVUdGblpTaHVZWFpRWVdkbEtWeHVJQ0FnSUNBZ2ZWeHVJQ0FnSUgxY2JseHVJQ0FnSUM4cUtseHVJQ0FnSUNBcUlGRjFaWEpwWlhNZ2RHaGxJSEJoWjJVZ2JtOWtaWE1nYVc0Z2RHaGxJRVJQVFZ4dUlDQWdJQ0FxTDF4dUlDQWdJRzl1UkU5TlRHOWhaR1ZrS0NrZ2UxeHVJQ0FnSUNBZ1kyOXVjM1FnY0dGblpYTWdQU0JrYjJOMWJXVnVkQzV4ZFdWeWVWTmxiR1ZqZEc5eVFXeHNLQ2RiWkdGMFlTMXdZV2RsWFNjcFhHNWNiaUFnSUNBZ0lHbG1JQ2doY0dGblpYTXBJSHRjYmlBZ0lDQWdJQ0FnY21WMGRYSnVYRzRnSUNBZ0lDQjlYRzVjYmlBZ0lDQWdJSEJoWjJWekxtWnZja1ZoWTJnb0tIQmhaMlVwSUQwK0lIdGNiaUFnSUNBZ0lDQWdiR1YwSUhCaFoyVk9ZVzFsSUQwZ2NHRm5aUzVuWlhSQmRIUnlhV0oxZEdVb0oyUmhkR0V0Y0dGblpTY3BYRzRnSUNBZ0lDQWdJQzhxWEc0Z0lDQWdJQ0FnSUNBcUlIUm9aU0J3WVdkbElHNWhiV1VnWTJGdUlHSmxJR2RwZG1WdUlIZHBkR2dnZEdobElHRjBkSEpwWW5WMFpTQmtZWFJoTFhCaFoyVmNiaUFnSUNBZ0lDQWdJQ29nYjNJZ2QybDBhQ0JwZEhNZ2JtOWtaU0J1WVcxbFhHNGdJQ0FnSUNBZ0lDQXFMMXh1SUNBZ0lDQWdJQ0JwWmlBb0lYQmhaMlZPWVcxbEtTQjdYRzRnSUNBZ0lDQWdJQ0FnY0dGblpVNWhiV1VnUFNCd1lXZGxMbTV2WkdWT1lXMWxYRzRnSUNBZ0lDQWdJSDFjYmx4dUlDQWdJQ0FnSUNCMGFHbHpMbUZrWkZWdWFYRjFaVkJoWjJWTmIyUmxiQ2h3WVdkbFRtRnRaU2xjYmlBZ0lDQWdJSDBwWEc0Z0lDQWdmVnh1WEc0Z0lDQWdjMlZzWldOMEtIQmhaMlZPWVcxbExDQmhaR1JRWVdkbFRXOWtaV3dnUFNCMGNuVmxLU0I3WEc0Z0lDQWdJQ0IwYUdsekxtTmhZMmhsVUdGblpWTmxiR1ZqZEc5eUlEMGdjR0ZuWlU1aGJXVmNibHh1SUNBZ0lDQWdhV1lnS0dGa1pGQmhaMlZOYjJSbGJDQW1KaUJ3WVdkbFRtRnRaU0FoUFQwZ0p5b25LU0I3WEc0Z0lDQWdJQ0FnSUhSb2FYTXVZV1JrVlc1cGNYVmxVR0ZuWlUxdlpHVnNLSEJoWjJWT1lXMWxLVnh1SUNBZ0lDQWdmVnh1WEc0Z0lDQWdJQ0J5WlhSMWNtNGdkR2hwYzF4dUlDQWdJSDFjYmx4dUlDQWdJSE4wWVhKMEtHWnZjbU5sUkdWbVlYVnNkRkJoWjJVZ1BTQm1ZV3h6WlNrZ2UxeHVJQ0FnSUNBZ0x5OGdZMmhsWTJzZ2FXWWdkR2hsSUdGd2NDQm9ZWE1nWW1WbGJpQmhiSEpsWVdSNUlITjBZWEowWldSY2JpQWdJQ0FnSUdsbUlDaDBhR2x6TG5OMFlYSjBaV1FwSUh0Y2JpQWdJQ0FnSUNBZ2RHaHliM2NnYm1WM0lFVnljbTl5S0dBa2UwNUJUVVY5TGlCVWFHVWdZWEJ3SUdoaGN5QmlaV1Z1SUdGc2NtVmhaSGtnYzNSaGNuUmxaQzVnS1Z4dUlDQWdJQ0FnZlZ4dVhHNGdJQ0FnSUNCMGFHbHpMbk4wWVhKMFpXUWdQU0IwY25WbFhHNWNiaUFnSUNBZ0lDOHZJR1p2Y21ObElHUmxabUYxYkhRZ2NHRm5aU0J2YmlCRGIzSmtiM1poWEc0Z0lDQWdJQ0JwWmlBb2QybHVaRzkzTG1OdmNtUnZkbUVwSUh0Y2JpQWdJQ0FnSUNBZ1ptOXlZMlZFWldaaGRXeDBVR0ZuWlNBOUlIUnlkV1ZjYmlBZ0lDQWdJSDFjYmx4dUlDQWdJQ0FnYkdWMElIQmhaMlZPWVcxbElEMGdkR2hwY3k1blpYUlFZV2RsUm5KdmJVaGhjMmdvS1Z4dUlDQWdJQ0FnYVdZZ0tDRjBhR2x6TG1kbGRGQmhaMlZOYjJSbGJDaHdZV2RsVG1GdFpTa3BJSHRjYmlBZ0lDQWdJQ0FnY0dGblpVNWhiV1VnUFNCMGFHbHpMbTl3ZEdsdmJuTXVaR1ZtWVhWc2RGQmhaMlZjYmlBZ0lDQWdJSDFjYmx4dUlDQWdJQ0FnYVdZZ0tHWnZjbU5sUkdWbVlYVnNkRkJoWjJVZ0ppWWdJWFJvYVhNdWIzQjBhVzl1Y3k1a1pXWmhkV3gwVUdGblpTa2dlMXh1SUNBZ0lDQWdJQ0IwYUhKdmR5QnVaWGNnUlhKeWIzSW9ZQ1I3VGtGTlJYMHVJRlJvWlNCa1pXWmhkV3gwSUhCaFoyVWdiWFZ6ZENCbGVHbHpkQ0JtYjNJZ1ptOXlZMmx1WnlCcGRITWdiR0YxYm1Ob0lXQXBYRzRnSUNBZ0lDQjlYRzVjYmlBZ0lDQWdJQzh2SUV4dlp5QjBhR1VnWkdWMmFXTmxJR2x1Wm05Y2JpQWdJQ0FnSUdsbUlDaHdhRzl1YjI0dVpHVmlkV2NwSUh0Y2JpQWdJQ0FnSUNBZ1kyOXVjMjlzWlM1c2IyY29KMU4wWVhKMGFXNW5JRkJvYjI1dmJpQnBiaUFuSUNzZ2NHeGhkR1p2Y20wdVpHVnpZM0pwY0hScGIyNHBYRzRnSUNBZ0lDQWdJR052Ym5OdmJHVXViRzluS0hSb2FYTXVjR0ZuWlhNdWJHVnVaM1JvSUNzZ0p5QndZV2RsY3lCbWIzVnVaQ2NwWEc0Z0lDQWdJQ0FnSUdOdmJuTnZiR1V1Ykc5bktDZE1iMkZrYVc1bklDY2dLeUJ3WVdkbFRtRnRaU2xjYmlBZ0lDQWdJSDFjYmx4dUlDQWdJQ0FnTHlwY2JpQWdJQ0FnSUNBcUlHbG1JSFJvWlNCaGNIQWdhWE1nWTI5dVptbG5kWEpoZEdWa0lIUnZJSFZ6WlNCb1lYTm9JSFJ5WVdOcmFXNW5YRzRnSUNBZ0lDQWdLaUIzWlNCaFpHUWdkR2hsSUhCaFoyVWdaSGx1WVcxcFkyRnNiSGtnYVc0Z2RHaGxJSFZ5YkZ4dUlDQWdJQ0FnSUNvdlhHNGdJQ0FnSUNCcFppQW9kR2hwY3k1dmNIUnBiMjV6TG5WelpVaGhjMmdwSUh0Y2JpQWdJQ0FnSUNBZ2RHaHBjeTV6WlhSSVlYTm9LSEJoWjJWT1lXMWxLVnh1SUNBZ0lDQWdmVnh1WEc0Z0lDQWdJQ0IwYUdsekxuTm9iM2RRWVdkbEtHWnZjbU5sUkdWbVlYVnNkRkJoWjJVZ1B5QjBhR2x6TG05d2RHbHZibk11WkdWbVlYVnNkRkJoWjJVZ09pQndZV2RsVG1GdFpTbGNiaUFnSUNCOVhHNWNiaUFnSUNBdkx5QnpkR0YwYVdOY2JpQWdJQ0J6ZEdGMGFXTWdYMFJQVFVsdWRHVnlabUZqWlNodmNIUnBiMjV6S1NCN1hHNGdJQ0FnSUNCeVpYUjFjbTRnYm1WM0lGQmhaMlZ5S0c5d2RHbHZibk1wWEc0Z0lDQWdmVnh1SUNCOVhHNWNiaUFnY21WMGRYSnVJRkJoWjJWeVhHNTlLU2dwWEc1Y2JtVjRjRzl5ZENCa1pXWmhkV3gwSUZCaFoyVnlYRzRpTENJdktpcGNiaUFxSUMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdFhHNGdLaUJNYVdObGJuTmxaQ0IxYm1SbGNpQk5TVlFnS0doMGRIQnpPaTh2WjJsMGFIVmlMbU52YlM5eGRXRnlheTFrWlhZdlVHaHZibTl1TFVaeVlXMWxkMjl5YXk5aWJHOWlMMjFoYzNSbGNpOU1TVU5GVGxORktWeHVJQ29nTFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMxY2JpQXFMMXh1WEc1cGJYQnZjblFnZXlCc2IyRmtSbWxzWlNCOUlHWnliMjBnSnk0dUx5NHVMMk52YlcxdmJpOTFkR2xzY3lkY2JtbHRjRzl5ZENCN0lHUnBjM0JoZEdOb1VHRm5aVVYyWlc1MElIMGdabkp2YlNBbkxpNHZMaTR2WTI5dGJXOXVMMlYyWlc1MGN5OWthWE53WVhSamFDZGNibHh1WTI5dWMzUWdVR0ZuWlNBOUlDZ29LU0E5UGlCN1hHNGdJQzhxS2x4dUlDQWdLaUF0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzFjYmlBZ0lDb2dRMjl1YzNSaGJuUnpYRzRnSUNBcUlDMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExWeHVJQ0FnS2k5Y2JseHVJQ0JqYjI1emRDQk9RVTFGSUQwZ0ozQmhaMlVuWEc0Z0lHTnZibk4wSUZaRlVsTkpUMDRnUFNBbk1pNHdMakFuWEc1Y2JpQWdZMjl1YzNRZ1ZFVk5VRXhCVkVWZlUwVk1SVU5VVDFJZ1BTQW5XMlJoZEdFdGRHVnRjR3hoZEdWZEoxeHVYRzRnSUM4cUtseHVJQ0FnS2lBdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMxY2JpQWdJQ29nUTJ4aGMzTWdSR1ZtYVc1cGRHbHZibHh1SUNBZ0tpQXRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMWNiaUFnSUNvdlhHNWNiaUFnWTJ4aGMzTWdVR0ZuWlNCN1hHNGdJQ0FnTHlvcVhHNGdJQ0FnSUNvZ1EzSmxZWFJsY3lCaGJpQnBibk4wWVc1alpTQnZaaUJRWVdkbExseHVJQ0FnSUNBcUlFQndZWEpoYlNCN2MzUnlhVzVuZlNCd1lXZGxUbUZ0WlZ4dUlDQWdJQ0FxTDF4dUlDQWdJR052Ym5OMGNuVmpkRzl5S0hCaFoyVk9ZVzFsS1NCN1hHNGdJQ0FnSUNCMGFHbHpMbTVoYldVZ1BTQndZV2RsVG1GdFpWeHVJQ0FnSUNBZ2RHaHBjeTVsZG1WdWRITWdQU0JiWFZ4dUlDQWdJQ0FnZEdocGN5NTBaVzF3YkdGMFpWQmhkR2dnUFNCdWRXeHNYRzRnSUNBZ0lDQjBhR2x6TG5KbGJtUmxja1oxYm1OMGFXOXVJRDBnYm5Wc2JGeHVJQ0FnSUgxY2JseHVJQ0FnSUM4dklHZGxkSFJsY25OY2JseHVJQ0FnSUhOMFlYUnBZeUJuWlhRZ2RtVnljMmx2YmlncElIdGNiaUFnSUNBZ0lISmxkSFZ5YmlCZ0pIdE9RVTFGZlM0a2UxWkZVbE5KVDA1OVlGeHVJQ0FnSUgxY2JseHVJQ0FnSUM4cUtseHVJQ0FnSUNBcUlFZGxkQ0JsZG1WdWRITmNiaUFnSUNBZ0tpQkFjbVYwZFhKdWN5QjdSblZ1WTNScGIyNWJYWDFjYmlBZ0lDQWdLaTljYmlBZ0lDQm5aWFJGZG1WdWRITW9LU0I3WEc0Z0lDQWdJQ0J5WlhSMWNtNGdkR2hwY3k1bGRtVnVkSE5jYmlBZ0lDQjlYRzVjYmlBZ0lDQXZLaXBjYmlBZ0lDQWdLaUJIWlhRZ2RHVnRjR3hoZEdWY2JpQWdJQ0FnS2lCQWNtVjBkWEp1Y3lCN2MzUnlhVzVuZlZ4dUlDQWdJQ0FxTDF4dUlDQWdJR2RsZEZSbGJYQnNZWFJsS0NrZ2UxeHVJQ0FnSUNBZ2NtVjBkWEp1SUhSb2FYTXVkR1Z0Y0d4aGRHVlFZWFJvWEc0Z0lDQWdmVnh1WEc0Z0lDQWdMeW9xWEc0Z0lDQWdJQ29nUjJWMElISmxibVJsY2lCbWRXNWpkR2x2Ymx4dUlDQWdJQ0FxSUVCeVpYUjFjbTV6SUh0R2RXNWpkR2x2Ym4xY2JpQWdJQ0FnS2k5Y2JpQWdJQ0JuWlhSU1pXNWtaWEpHZFc1amRHbHZiaWdwSUh0Y2JpQWdJQ0FnSUhKbGRIVnliaUIwYUdsekxuSmxibVJsY2taMWJtTjBhVzl1WEc0Z0lDQWdmVnh1WEc0Z0lDQWdiRzloWkZSbGJYQnNZWFJsS0NrZ2UxeHVJQ0FnSUNBZ1kyOXVjM1FnY0dGblpVVnNaVzFsYm5RZ1BTQmtiMk4xYldWdWRDNXhkV1Z5ZVZObGJHVmpkRzl5S0dCYlpHRjBZUzF3WVdkbFBWd2lKSHQwYUdsekxtNWhiV1Y5WENKZFlDbGNibHh1SUNBZ0lDQWdiRzloWkVacGJHVW9kR2hwY3k1blpYUlVaVzF3YkdGMFpTZ3BMQ0FvZEdWdGNHeGhkR1VwSUQwK0lIdGNiaUFnSUNBZ0lDQWdiR1YwSUhKbGJtUmxjaUE5SUdaMWJtTjBhVzl1SUNoRVQwMVFZV2RsTENCMFpXMXdiR0YwWlN3Z1pXeGxiV1Z1ZEhNcElIdGNiaUFnSUNBZ0lDQWdJQ0JwWmlBb1pXeGxiV1Z1ZEhNcElIdGNiaUFnSUNBZ0lDQWdJQ0FnSUVGeWNtRjVMbVp5YjIwb1pXeGxiV1Z1ZEhNcExtWnZja1ZoWTJnb0tHVnNLU0E5UGlCN1hHNGdJQ0FnSUNBZ0lDQWdJQ0FnSUdWc0xtbHVibVZ5U0ZSTlRDQTlJSFJsYlhCc1lYUmxYRzRnSUNBZ0lDQWdJQ0FnSUNCOUtWeHVJQ0FnSUNBZ0lDQWdJSDBnWld4elpTQjdYRzRnSUNBZ0lDQWdJQ0FnSUNCRVQwMVFZV2RsTG1sdWJtVnlTRlJOVENBOUlIUmxiWEJzWVhSbFhHNGdJQ0FnSUNBZ0lDQWdmVnh1SUNBZ0lDQWdJQ0I5WEc1Y2JpQWdJQ0FnSUNBZ2FXWWdLSFJvYVhNdVoyVjBVbVZ1WkdWeVJuVnVZM1JwYjI0b0tTa2dlMXh1SUNBZ0lDQWdJQ0FnSUhKbGJtUmxjaUE5SUhSb2FYTXVaMlYwVW1WdVpHVnlSblZ1WTNScGIyNG9LVnh1SUNBZ0lDQWdJQ0I5WEc1Y2JpQWdJQ0FnSUNBZ2NtVnVaR1Z5S0hCaFoyVkZiR1Z0Wlc1MExDQjBaVzF3YkdGMFpTd2djR0ZuWlVWc1pXMWxiblF1Y1hWbGNubFRaV3hsWTNSdmNrRnNiQ2hVUlUxUVRFRlVSVjlUUlV4RlExUlBVaWtwWEc0Z0lDQWdJQ0I5TENCdWRXeHNLVnh1SUNBZ0lIMWNibHh1SUNBZ0lDOHZJSEIxWW14cFkxeHVYRzRnSUNBZ0x5b3FYRzRnSUNBZ0lDcGNiaUFnSUNBZ0tpQkFjR0Z5WVcwZ2V5cDlJR05oYkd4aVlXTnJSbTVjYmlBZ0lDQWdLaTljYmlBZ0lDQmhaR1JGZG1WdWRFTmhiR3hpWVdOcktHTmhiR3hpWVdOclJtNHBJSHRjYmlBZ0lDQWdJSFJvYVhNdVpYWmxiblJ6TG5CMWMyZ29ZMkZzYkdKaFkydEdiaWxjYmlBZ0lDQjlYRzVjYmlBZ0lDQXZLaXBjYmlBZ0lDQWdLaUJWYzJVZ2RHaGxJR2RwZG1WdUlIUmxiWEJzWVhSbFhHNGdJQ0FnSUNwY2JpQWdJQ0FnS2lCQWNHRnlZVzBnZTNOMGNtbHVaMzBnZEdWdGNHeGhkR1ZRWVhSb1hHNGdJQ0FnSUNvdlhHNGdJQ0FnZFhObFZHVnRjR3hoZEdVb2RHVnRjR3hoZEdWUVlYUm9LU0I3WEc0Z0lDQWdJQ0JwWmlBb2RIbHdaVzltSUhSbGJYQnNZWFJsVUdGMGFDQWhQVDBnSjNOMGNtbHVaeWNwSUh0Y2JpQWdJQ0FnSUNBZ2RHaHliM2NnYm1WM0lFVnljbTl5S0NkVWFHVWdkR1Z0Y0d4aGRHVWdjR0YwYUNCdGRYTjBJR0psSUdFZ2MzUnlhVzVuTGlBbklDc2dkSGx3Wlc5bUlIUmxiWEJzWVhSbFVHRjBhQ0FySUNjZ2FYTWdaMmwyWlc0bktWeHVJQ0FnSUNBZ2ZWeHVJQ0FnSUNBZ2RHaHBjeTUwWlcxd2JHRjBaVkJoZEdnZ1BTQjBaVzF3YkdGMFpWQmhkR2hjYmlBZ0lDQjlYRzVjYmlBZ0lDQXZLaXBjYmlBZ0lDQWdLaUJWYzJVZ2RHaGxJR2RwZG1WdUlIUmxiWEJzWVhSbElISmxibVJsY21WeVhHNGdJQ0FnSUNvZ1FIQmhjbUZ0SUh0R2RXNWpkR2x2Ym4wZ2NtVnVaR1Z5Um5WdVkzUnBiMjVjYmlBZ0lDQWdLaTljYmlBZ0lDQjFjMlZVWlcxd2JHRjBaVkpsYm1SbGNtVnlLSEpsYm1SbGNrWjFibU4wYVc5dUtTQjdYRzRnSUNBZ0lDQnBaaUFvZEhsd1pXOW1JSEpsYm1SbGNrWjFibU4wYVc5dUlDRTlQU0FuWm5WdVkzUnBiMjRuS1NCN1hHNGdJQ0FnSUNBZ0lIUm9jbTkzSUc1bGR5QkZjbkp2Y2lnblZHaGxJR04xYzNSdmJTQjBaVzF3YkdGMFpTQnlaVzVrWlhKbGNpQnRkWE4wSUdKbElHRWdablZ1WTNScGIyNHVJQ2NnS3lCMGVYQmxiMllnY21WdVpHVnlSblZ1WTNScGIyNGdLeUFuSUdseklHZHBkbVZ1SnlsY2JpQWdJQ0FnSUgxY2JpQWdJQ0FnSUhSb2FYTXVjbVZ1WkdWeVJuVnVZM1JwYjI0Z1BTQnlaVzVrWlhKR2RXNWpkR2x2Ymx4dUlDQWdJSDFjYmx4dUlDQWdJQzhxS2x4dUlDQWdJQ0FxSUZSeWFXZG5aWElnYzJOdmNHVnpYRzRnSUNBZ0lDb2dRSEJoY21GdElIdHpkSEpwYm1kOUlHVjJaVzUwVG1GdFpWeHVJQ0FnSUNBcUlFQndZWEpoYlNCN2UzMTlJRnRsZG1WdWRGQmhjbUZ0Y3oxN2ZWMWNiaUFnSUNBZ0tpOWNiaUFnSUNCMGNtbG5aMlZ5VTJOdmNHVnpLR1YyWlc1MFRtRnRaU3dnWlhabGJuUlFZWEpoYlhNZ1BTQjdmU2tnZTF4dUlDQWdJQ0FnWTI5dWMzUWdaWFpsYm5ST1lXMWxRV3hwWVhNZ1BTQmdiMjRrZTJWMlpXNTBUbUZ0WlM1amFHRnlRWFFvTUNrdWRHOVZjSEJsY2tOaGMyVW9LWDBrZTJWMlpXNTBUbUZ0WlM1emJHbGpaU2d4S1gxZ1hHNWNiaUFnSUNBZ0lIUm9hWE11WlhabGJuUnpMbVp2Y2tWaFkyZ29LSE5qYjNCbEtTQTlQaUI3WEc0Z0lDQWdJQ0FnSUdOdmJuTjBJSE5qYjNCbFJYWmxiblFnUFNCelkyOXdaVnRsZG1WdWRFNWhiV1ZkWEc0Z0lDQWdJQ0FnSUdOdmJuTjBJSE5qYjNCbFJYWmxiblJCYkdsaGN5QTlJSE5qYjNCbFcyVjJaVzUwVG1GdFpVRnNhV0Z6WFZ4dUlDQWdJQ0FnSUNCcFppQW9kSGx3Wlc5bUlITmpiM0JsUlhabGJuUWdQVDA5SUNkbWRXNWpkR2x2YmljcElIdGNiaUFnSUNBZ0lDQWdJQ0J6WTI5d1pVVjJaVzUwTG1Gd2NHeDVLSFJvYVhNc0lHVjJaVzUwVUdGeVlXMXpLVnh1SUNBZ0lDQWdJQ0I5WEc1Y2JpQWdJQ0FnSUNBZ0x5OGdkSEpwWjJkbGNpQjBhR1VnWlhabGJuUWdZV3hwWVhOY2JpQWdJQ0FnSUNBZ2FXWWdLSFI1Y0dWdlppQnpZMjl3WlVWMlpXNTBRV3hwWVhNZ1BUMDlJQ2RtZFc1amRHbHZiaWNwSUh0Y2JpQWdJQ0FnSUNBZ0lDQnpZMjl3WlVWMlpXNTBRV3hwWVhNdVlYQndiSGtvZEdocGN5d2daWFpsYm5SUVlYSmhiWE1wWEc0Z0lDQWdJQ0FnSUgxY2JpQWdJQ0FnSUgwcFhHNWNiaUFnSUNBZ0lHUnBjM0JoZEdOb1VHRm5aVVYyWlc1MEtHVjJaVzUwVG1GdFpTd2dkR2hwY3k1dVlXMWxMQ0JsZG1WdWRGQmhjbUZ0Y3lsY2JpQWdJQ0I5WEc0Z0lIMWNibHh1SUNCeVpYUjFjbTRnVUdGblpWeHVmU2tvS1Z4dVhHNWxlSEJ2Y25RZ1pHVm1ZWFZzZENCUVlXZGxYRzRpTENJdktpcGNiaUFxSUMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdFhHNGdLaUJNYVdObGJuTmxaQ0IxYm1SbGNpQk5TVlFnS0doMGRIQnpPaTh2WjJsMGFIVmlMbU52YlM5eGRXRnlheTFrWlhZdlVHaHZibTl1TFVaeVlXMWxkMjl5YXk5aWJHOWlMMjFoYzNSbGNpOU1TVU5GVGxORktWeHVJQ29nTFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMxY2JpQXFMMXh1WEc1cGJYQnZjblFnVUdGblpYSWdabkp2YlNBbkxpOW9lV0p5YVdRdFlYQndjeTl3WVdkbGNpOXBibVJsZUNkY2JtbHRjRzl5ZENCSmJuUnNJR1p5YjIwZ0p5NHZhSGxpY21sa0xXRndjSE12YVc1MGJDZGNibWx0Y0c5eWRDQk9aWFIzYjNKcklHWnliMjBnSnk0dmRYUnBiR2wwYVdWekwyNWxkSGR2Y21zblhHNWNiaTh2SUdOdmJYQnZibVZ1ZEhOY2JtbHRjRzl5ZENCRWFXRnNiMmNnWm5KdmJTQW5MaTlqYjIxd2IyNWxiblJ6TDJScFlXeHZaeWRjYm1sdGNHOXlkQ0JRY205dGNIUWdabkp2YlNBbkxpOWpiMjF3YjI1bGJuUnpMMlJwWVd4dlp5OXdjbTl0Y0hRblhHNXBiWEJ2Y25RZ1RtOTBhV1pwWTJGMGFXOXVJR1p5YjIwZ0p5NHZZMjl0Y0c5dVpXNTBjeTl1YjNScFptbGpZWFJwYjI0blhHNXBiWEJ2Y25RZ1EyOXNiR0Z3YzJVZ1puSnZiU0FuTGk5amIyMXdiMjVsYm5SekwyTnZiR3hoY0hObEoxeHVhVzF3YjNKMElFRmpZMjl5WkdsdmJpQm1jbTl0SUNjdUwyTnZiWEJ2Ym1WdWRITXZZV05qYjNKa2FXOXVKMXh1YVcxd2IzSjBJRlJoWWlCbWNtOXRJQ2N1TDJOdmJYQnZibVZ1ZEhNdmRHRmlKMXh1YVcxd2IzSjBJRkJ5YjJkeVpYTnpJR1p5YjIwZ0p5NHZZMjl0Y0c5dVpXNTBjeTl3Y205bmNtVnpjeWRjYm1sdGNHOXlkQ0JNYjJGa1pYSWdabkp2YlNBbkxpOWpiMjF3YjI1bGJuUnpMMnh2WVdSbGNpZGNibWx0Y0c5eWRDQlBabVpEWVc1MllYTWdabkp2YlNBbkxpOWpiMjF3YjI1bGJuUnpMMjltWmkxallXNTJZWE1uWEc1cGJYQnZjblFnUkhKdmNHUnZkMjRnWm5KdmJTQW5MaTlqYjIxd2IyNWxiblJ6TDJSeWIzQmtiM2R1SjF4dWFXMXdiM0owSUVSeWIzQmtiM2R1VTJWaGNtTm9JR1p5YjIwZ0p5NHZZMjl0Y0c5dVpXNTBjeTlrY205d1pHOTNiaTl6WldGeVkyZ25YRzVjYm1OdmJuTjBJR0Z3YVNBOUlIdDlYRzVjYmk4cUtseHVJQ29nTFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0WEc0Z0tpQkRiMjVtYVdkMWNtRjBhVzl1WEc0Z0tpQXRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMWNiaUFxTDF4dVlYQnBMbU52Ym1acFp5QTlJSHRjYmlBZ0x5OGdaMnh2WW1Gc0lHTnZibVpwWjF4dUlDQmtaV0oxWnpvZ2RISjFaU3hjYm4xY2JseHVMeW9xWEc0Z0tpQXRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMWNiaUFxSUZCaFoyVnlYRzRnS2lBdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMxY2JpQXFMMXh1WVhCcExuQmhaMlZ5SUQwZ0tHOXdkR2x2Ym5NcElEMCtJSHRjYmlBZ2FXWWdLSFI1Y0dWdlppQmhjR2t1WDNCaFoyVnlJRDA5UFNBbmRXNWtaV1pwYm1Wa0p5a2dlMXh1SUNBZ0lHRndhUzVmY0dGblpYSWdQU0JRWVdkbGNpNWZSRTlOU1c1MFpYSm1ZV05sS0c5d2RHbHZibk1wWEc0Z0lIMWNiaUFnY21WMGRYSnVJR0Z3YVM1ZmNHRm5aWEpjYm4xY2JseHVMeW9xWEc0Z0tpQXRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMWNiaUFxSUVsdWRHeGNiaUFxSUMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFZ4dUlDb3ZYRzVoY0drdWFXNTBiQ0E5SUVsdWRHd3VYMFJQVFVsdWRHVnlabUZqWlZ4dVhHNHZLaXBjYmlBcUlDMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExWeHVJQ29nVG1WMGQyOXlhMXh1SUNvZ0xTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdFhHNGdLaTljYm1Gd2FTNXVaWFIzYjNKcklEMGdUbVYwZDI5eWF5NWZSRTlOU1c1MFpYSm1ZV05sWEc1Y2JpOHFLbHh1SUNvZ0xTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdFhHNGdLaUJPYjNScFptbGpZWFJwYjI1Y2JpQXFJQzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMVnh1SUNvdlhHNWhjR2t1Ym05MGFXWnBZMkYwYVc5dUlEMGdUbTkwYVdacFkyRjBhVzl1TGw5RVQwMUpiblJsY21aaFkyVmNibHh1THlvcVhHNGdLaUF0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzFjYmlBcUlFUnBZV3h2WjF4dUlDb2dMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRYRzRnS2k5Y2JtRndhUzVrYVdGc2IyY2dQU0JFYVdGc2IyY3VYMFJQVFVsdWRHVnlabUZqWlZ4dVhHNXpaWFJVYVcxbGIzVjBLQ2dwSUQwK0lIdGNiaUFnVUhKdmJYQjBMbDlFVDAxSmJuUmxjbVpoWTJVb2UxeHVJQ0FnSUdWc1pXMWxiblE2SUc1MWJHd3NYRzRnSUNBZ2RHbDBiR1U2SUNkSVJVeE1UMWNuTEZ4dUlDQWdJRzFsYzNOaFoyVTZJRzUxYkd3c1hHNGdJQ0FnWTJGdVkyVnNZV0pzWlRvZ2RISjFaU3hjYmlBZ2ZTa3VjMmh2ZHlncFhHNTlMQ0F4TURBd0tWeHVYRzR2S2lwY2JpQXFJQzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMVnh1SUNvZ1EyOXNiR0Z3YzJWY2JpQXFJQzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMVnh1SUNvdlhHNWhjR2t1WTI5c2JHRndjMlVnUFNCRGIyeHNZWEJ6WlM1ZlJFOU5TVzUwWlhKbVlXTmxYRzVjYmk4cUtseHVJQ29nTFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0WEc0Z0tpQkJZMk52Y21ScGIyNWNiaUFxSUMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFZ4dUlDb3ZYRzVoY0drdVlXTmpiM0prYVc5dUlEMGdRV05qYjNKa2FXOXVMbDlFVDAxSmJuUmxjbVpoWTJWY2JseHVYRzR2S2lwY2JpQXFJQzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMVnh1SUNvZ1ZHRmlYRzRnS2lBdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMxY2JpQXFMMXh1WVhCcExuUmhZaUE5SUZSaFlpNWZSRTlOU1c1MFpYSm1ZV05sWEc1Y2JpOHFLbHh1SUNvZ0xTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdFhHNGdLaUJRY205bmNtVnpjMXh1SUNvZ0xTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdFhHNGdLaTljYm1Gd2FTNXdjbTluY21WemN5QTlJRkJ5YjJkeVpYTnpMbDlFVDAxSmJuUmxjbVpoWTJWY2JseHVMeW9xWEc0Z0tpQXRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMWNiaUFxSUV4dllXUmxjbHh1SUNvZ0xTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdFhHNGdLaTljYm1Gd2FTNXNiMkZrWlhJZ1BTQk1iMkZrWlhJdVgwUlBUVWx1ZEdWeVptRmpaVnh1WEc0dktpcGNiaUFxSUMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFZ4dUlDb2dUMlptSUdOaGJuWmhjMXh1SUNvZ0xTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdFhHNGdLaTljYm1Gd2FTNXZabVpEWVc1MllYTWdQU0JQWm1aRFlXNTJZWE11WDBSUFRVbHVkR1Z5Wm1GalpWeHVYRzR2S2lwY2JpQXFJQzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMVnh1SUNvZ1JISnZjR1J2ZDI1Y2JpQXFJQzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMVnh1SUNvdlhHNWhjR2t1WkhKdmNHUnZkMjRnUFNBb2IzQjBhVzl1Y3lrZ1BUNGdlMXh1SUNCcFppQW9iM0IwYVc5dWN5NXpaV0Z5WTJncElIdGNiaUFnSUNBdkx5Qm5aVzVsY21saklHUnliM0JrYjNkdVhHNGdJQ0FnY21WMGRYSnVJRVJ5YjNCa2IzZHVMbDlFVDAxSmJuUmxjbVpoWTJWY2JpQWdmU0JsYkhObElIdGNiaUFnSUNBdkx5QnpaV0Z5WTJnZ1pISnZjR1J2ZDI1Y2JpQWdJQ0J5WlhSMWNtNGdSSEp2Y0dSdmQyNVRaV0Z5WTJndVgwUlBUVWx1ZEdWeVptRmpaVnh1SUNCOVhHNTlYRzVjYmk4dklFMWhhMlVnZEdobElFRlFTU0JzYVhabFhHNTNhVzVrYjNjdWNHaHZibTl1SUQwZ1lYQnBYRzVjYm1WNGNHOXlkQ0JrWldaaGRXeDBJR0Z3YVZ4dUlpd2lMeW9xWEc0Z0tpQXRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMVnh1SUNvZ1RHbGpaVzV6WldRZ2RXNWtaWElnVFVsVUlDaG9kSFJ3Y3pvdkwyZHBkR2gxWWk1amIyMHZjWFZoY21zdFpHVjJMMUJvYjI1dmJpMUdjbUZ0WlhkdmNtc3ZZbXh2WWk5dFlYTjBaWEl2VEVsRFJVNVRSU2xjYmlBcUlDMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRYRzRnS2k5Y2JseHVhVzF3YjNKMElFVjJaVzUwSUdaeWIyMGdKeTR1THk0dUwyTnZiVzF2Ymk5bGRtVnVkSE1uWEc1cGJYQnZjblFnUTI5dGNHOXVaVzUwSUdaeWIyMGdKeTR1THk0dUwyTnZiWEJ2Ym1WdWRITXZZMjl0Y0c5dVpXNTBKMXh1WEc1amIyNXpkQ0JPWlhSM2IzSnJJRDBnS0NncElEMCtJSHRjYmlBZ0x5b3FYRzRnSUNBcUlDMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExWeHVJQ0FnS2lCRGIyNXpkR0Z1ZEhOY2JpQWdJQ29nTFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0WEc0Z0lDQXFMMXh1WEc0Z0lHTnZibk4wSUU1QlRVVWdQU0FuYm1WMGQyOXlheWRjYmlBZ1kyOXVjM1FnVmtWU1UwbFBUaUE5SUNjeUxqQXVNQ2RjYmlBZ1kyOXVjM1FnUkVWR1FWVk1WRjlRVWs5UVJWSlVTVVZUSUQwZ2UxeHVJQ0FnSUdWc1pXMWxiblE2SUc1MWJHd3NYRzRnSUNBZ2FXNXBkR2xoYkVSbGJHRjVPaUF6TURBd0xGeHVJQ0FnSUdSbGJHRjVPaUExTURBd0xGeHVJQ0I5WEc0Z0lHTnZibk4wSUVSQlZFRmZRVlJVVWxOZlVGSlBVRVZTVkVsRlV5QTlJRnRjYmlBZ1hWeHVYRzRnSUM4cUtseHVJQ0FnS2lBdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMxY2JpQWdJQ29nUTJ4aGMzTWdSR1ZtYVc1cGRHbHZibHh1SUNBZ0tpQXRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMWNiaUFnSUNvdlhHNWNiaUFnWTJ4aGMzTWdUbVYwZDI5eWF5QmxlSFJsYm1SeklFTnZiWEJ2Ym1WdWRDQjdYRzRnSUNBZ0x5b3FYRzRnSUNBZ0lDb2dRM0psWVhSbGN5QmhiaUJwYm5OMFlXNWpaU0J2WmlCT1pYUjNiM0pyTGx4dUlDQWdJQ0FxSUVCd1lYSmhiU0I3ZTMxOUlGdHZjSFJwYjI1elBYdDlYVnh1SUNBZ0lDQXFMMXh1SUNBZ0lHTnZibk4wY25WamRHOXlLRzl3ZEdsdmJuTWdQU0I3ZlNrZ2UxeHVJQ0FnSUNBZ2MzVndaWElvVGtGTlJTd2dWa1ZTVTBsUFRpd2dSRVZHUVZWTVZGOVFVazlRUlZKVVNVVlRMQ0J2Y0hScGIyNXpMQ0JFUVZSQlgwRlVWRkpUWDFCU1QxQkZVbFJKUlZNc0lIUnlkV1VzSUdaaGJITmxLVnh1WEc0Z0lDQWdJQ0IwYUdsekxuaG9jaUE5SUc1MWJHeGNiaUFnSUNBZ0lIUm9hWE11WTJobFkydEpiblJsY25aaGJDQTlJRzUxYkd4Y2JseHVJQ0FnSUNBZ2RHaHBjeTV6WlhSVGRHRjBkWE1vUlhabGJuUXVUa1ZVVjA5U1MxOVBUa3hKVGtVcFhHNWNiaUFnSUNBZ0lITmxkRlJwYldWdmRYUW9LQ2tnUFQ0Z2UxeHVJQ0FnSUNBZ0lDQjBhR2x6TG5OMFlYSjBRMmhsWTJzb0tWeHVJQ0FnSUNBZ2ZTd2dkR2hwY3k1dmNIUnBiMjV6TG1sdWFYUnBZV3hFWld4aGVTbGNiaUFnSUNCOVhHNWNiaUFnSUNCblpYUlRkR0YwZFhNb0tTQjdYRzRnSUNBZ0lDQnlaWFIxY200Z2RHaHBjeTV6ZEdGMGRYTmNiaUFnSUNCOVhHNWNiaUFnSUNCelpYUlRkR0YwZFhNb2MzUmhkSFZ6S1NCN1hHNGdJQ0FnSUNCMGFHbHpMbk4wWVhSMWN5QTlJSE4wWVhSMWMxeHVJQ0FnSUgxY2JseHVJQ0FnSUhOMFlYSjBVbVZ4ZFdWemRDZ3BJSHRjYmlBZ0lDQWdJSFJvYVhNdWVHaHlJRDBnYm1WM0lGaE5URWgwZEhCU1pYRjFaWE4wS0NsY2JpQWdJQ0FnSUhSb2FYTXVlR2h5TG05bVpteHBibVVnUFNCbVlXeHpaVnh1WEc0Z0lDQWdJQ0JqYjI1emRDQjFjbXdnUFNCZ0wyWmhkbWxqYjI0dWFXTnZQMTg5Skh0dVpYY2dSR0YwWlNncExtZGxkRlJwYldVb0tYMWdYRzVjYmlBZ0lDQWdJSFJvYVhNdWRISnBaMmRsY2tWMlpXNTBLRVYyWlc1MExrNUZWRmRQVWt0ZlVrVkRUMDVPUlVOVVNVNUhMQ0I3SUdSaGRHVTZJRzVsZHlCRVlYUmxLQ2tnZlN3Z1ptRnNjMlVwSUNBZ0lDQWdJQ0FnSUNBZ1hHNWNiaUFnSUNBZ0lIUm9hWE11ZUdoeUxtOXdaVzRvSjBoRlFVUW5MQ0IxY213c0lIUnlkV1VwWEc1Y2JpQWdJQ0FnSUhSb2FYTXVlR2h5TG5ScGJXVnZkWFFnUFNCMGFHbHpMbTl3ZEdsdmJuTXVaR1ZzWVhrZ0xTQXhYRzRnSUNBZ0lDQjBhR2x6TG5ob2NpNXZiblJwYldWdmRYUWdQU0FvS1NBOVBpQjdYRzRnSUNBZ0lDQWdJSFJvYVhNdWVHaHlMbUZpYjNKMEtDbGNiaUFnSUNBZ0lDQWdkR2hwY3k1NGFISWdQU0J1ZFd4c1hHNGdJQ0FnSUNCOVhHNWNiaUFnSUNBZ0lIUm9hWE11ZUdoeUxtOXViRzloWkNBOUlDZ3BJRDArSUh0Y2JpQWdJQ0FnSUNBZ2RHaHBjeTV2YmxWd0tDbGNiaUFnSUNBZ0lIMWNiaUFnSUNBZ0lIUm9hWE11ZUdoeUxtOXVaWEp5YjNJZ1BTQW9LU0E5UGlCN1hHNGdJQ0FnSUNBZ0lIUm9hWE11YjI1RWIzZHVLQ2xjYmlBZ0lDQWdJSDFjYmx4dUlDQWdJQ0FnZEhKNUlIdGNiaUFnSUNBZ0lDQWdkR2hwY3k1NGFISXVjMlZ1WkNncFhHNGdJQ0FnSUNCOUlHTmhkR05vSUNobEtTQjdYRzRnSUNBZ0lDQWdJSFJvYVhNdWIyNUViM2R1S0NsY2JpQWdJQ0FnSUgxY2JpQWdJQ0I5WEc1Y2JpQWdJQ0J2YmxWd0tDa2dlMXh1SUNBZ0lDQWdkR2hwY3k1MGNtbG5aMlZ5UlhabGJuUW9SWFpsYm5RdVRrVlVWMDlTUzE5U1JVTlBUazVGUTFSSlRrZGZVMVZEUTBWVFV5d2dleUJrWVhSbE9pQnVaWGNnUkdGMFpTZ3BJSDBzSUdaaGJITmxLVnh1WEc0Z0lDQWdJQ0JwWmlBb2RHaHBjeTVuWlhSVGRHRjBkWE1vS1NBaFBUMGdSWFpsYm5RdVRrVlVWMDlTUzE5UFRreEpUa1VwSUh0Y2JpQWdJQ0FnSUNBZ2RHaHBjeTUwY21sbloyVnlSWFpsYm5Rb1JYWmxiblF1VGtWVVYwOVNTMTlQVGt4SlRrVXNJSHNnWkdGMFpUb2dibVYzSUVSaGRHVW9LU0I5TENCbVlXeHpaU2xjYmlBZ0lDQWdJSDFjYmx4dUlDQWdJQ0FnZEdocGN5NXpaWFJUZEdGMGRYTW9SWFpsYm5RdVRrVlVWMDlTUzE5UFRreEpUa1VwSUNBZ0lDQWdYRzRnSUNBZ2ZWeHVYRzRnSUNBZ2IyNUViM2R1S0NrZ2UxeHVJQ0FnSUNBZ2RHaHBjeTUwY21sbloyVnlSWFpsYm5Rb1JYWmxiblF1VGtWVVYwOVNTMTlTUlVOUFRrNUZRMVJKVGtkZlJrRkpURlZTUlN3Z2V5QmtZWFJsT2lCdVpYY2dSR0YwWlNncElIMHNJR1poYkhObEtWeHVYRzRnSUNBZ0lDQnBaaUFvZEdocGN5NW5aWFJUZEdGMGRYTW9LU0FoUFQwZ1JYWmxiblF1VGtWVVYwOVNTMTlQUmtaTVNVNUZLU0I3WEc0Z0lDQWdJQ0FnSUhSb2FYTXVkSEpwWjJkbGNrVjJaVzUwS0VWMlpXNTBMazVGVkZkUFVrdGZUMFpHVEVsT1JTd2dleUJrWVhSbE9pQnVaWGNnUkdGMFpTZ3BJSDBzSUdaaGJITmxLVnh1SUNBZ0lDQWdmVnh1WEc0Z0lDQWdJQ0IwYUdsekxuTmxkRk4wWVhSMWN5aEZkbVZ1ZEM1T1JWUlhUMUpMWDA5R1JreEpUa1VwSUNBZ0lDQWdYRzRnSUNBZ2ZWeHVYRzRnSUNBZ2MzUmhjblJEYUdWamF5Z3BJSHRjYmlBZ0lDQWdJSFJvYVhNdWMzUnZjRU5vWldOcktDbGNibHh1SUNBZ0lDQWdkR2hwY3k1emRHRnlkRkpsY1hWbGMzUW9LU0FnSUNBZ0lGeHVYRzRnSUNBZ0lDQjBhR2x6TG1Ob1pXTnJTVzUwWlhKMllXd2dQU0J6WlhSSmJuUmxjblpoYkNnb0tTQTlQaUI3WEc0Z0lDQWdJQ0FnSUhSb2FYTXVjM1JoY25SU1pYRjFaWE4wS0NsY2JpQWdJQ0FnSUgwc0lIUm9hWE11YjNCMGFXOXVjeTVrWld4aGVTbGNiaUFnSUNCOVhHNWNiaUFnSUNCemRHOXdRMmhsWTJzb0tTQjdYRzRnSUNBZ0lDQnBaaUFvZEdocGN5NWphR1ZqYTBsdWRHVnlkbUZzSUNFOVBTQnVkV3hzS1NCN1hHNGdJQ0FnSUNBZ0lHTnNaV0Z5U1c1MFpYSjJZV3dvZEdocGN5NWphR1ZqYTBsdWRHVnlkbUZzS1Z4dUlDQWdJQ0FnSUNCMGFHbHpMbU5vWldOclNXNTBaWEoyWVd3Z1BTQnVkV3hzWEc0Z0lDQWdJQ0I5WEc0Z0lDQWdmVnh1WEc0Z0lDQWdjM1JoZEdsaklGOUVUMDFKYm5SbGNtWmhZMlVvYjNCMGFXOXVjeWtnZTF4dUlDQWdJQ0FnY21WMGRYSnVJSE4xY0dWeUxsOUVUMDFKYm5SbGNtWmhZMlVvVG1WMGQyOXlheXdnYjNCMGFXOXVjeWxjYmlBZ0lDQjlYRzRnSUgxY2JseHVJQ0J5WlhSMWNtNGdUbVYwZDI5eWExeHVmU2tvS1Z4dVhHNWxlSEJ2Y25RZ1pHVm1ZWFZzZENCT1pYUjNiM0pyWEc0aVhYMD0ifQ==
