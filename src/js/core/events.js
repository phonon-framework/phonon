phonon.event = (function ($) {
  /**
     * Events
     * [1] touch enabled boolean
     * [2] start, move, end and tap events
     * [3] transitionEnd and animationEnd polyfill
     */

  // Use available events
  // mousecancel does not exists
  let availableEvents = ['mousedown', 'mousemove', 'mouseup'];

  // Check if touch is enabled
  let hasTouch = false;
  if (('ontouchstart' in window) || window.DocumentTouch && document instanceof DocumentTouch) {
    hasTouch = true;
    availableEvents = ['touchstart', 'touchmove', 'touchend', 'touchcancel'];
  }

  if (window.navigator.pointerEnabled) {
    availableEvents = ['pointerdown', 'pointermove', 'pointerup', 'pointercancel'];
  } else if (window.navigator.msPointerEnabled) {
    availableEvents = ['MSPointerDown', 'MSPointerMove', 'MSPointerUp', 'MSPointerCancel'];
  }

  const api = {};

  api.hasTouch = hasTouch;

  api.start = availableEvents[0];
  api.move = availableEvents[1];
  api.end = availableEvents[2];
  api.cancel = typeof availableEvents[3] === 'undefined' ? null : availableEvents[3];

  api.tap = 'tap';

  /**
	 * By default, force click event if the browser does
	 * not support touch events
	 */
  api.forceTap = false;

  /**
     * Animation/Transition event polyfill
    */
  const el = document.createElement('div');
  const transitions = [
    { name: 'transition', end: 'transitionend' },
    { name: 'MozTransition', end: 'transitionend' },
    { name: 'msTransition', end: 'msTransitionEnd' },
    { name: 'WebkitTransition', end: 'webkitTransitionEnd' },
  ];
  const animations = [
    { name: 'animation', end: 'animationend' },
    { name: 'MozAnimation', end: 'animationend' },
    { name: 'msAnimation', end: 'msAnimationEnd' },
    { name: 'WebkitAnimation', end: 'webkitAnimationEnd' },
  ];

  let transitionEnd = null;
  let animationEnd = null;

  let i = transitions.length - 1;
  for (i in transitions) {
    if (el.style[transitions[i].name] !== undefined) {
      transitionEnd = transitions[i].end;
      break;
    }
  }

  let j = animations.length - 1;
  for (j in animations) {
    if (el.style[animations[j].name] !== undefined) {
      animationEnd = animations[j].end;
      break;
    }
  }

  // fix bug on Android 4.1
  let osV = phonon.device.osVersion;
  if (osV && osV.length > 2) {
    osV = phonon.device.osVersion.substring(0, 3);
  }

  if (phonon.device.os && phonon.device.os.toLowerCase() === 'android' && osV === '4.1') {
    transitionEnd = 'webkitTransitionEnd';
    animationEnd = 'webkitAnimationEnd';
  }

  api.transitionEnd = transitionEnd;
  api.animationEnd = animationEnd;

  const tapEls = [];

  const TapElement = (function () {
    function TapElement(el, callback) {
      this.el = el;
      this.callback = callback;
      this.moved = false;
      this.startX = 0;
      this.startY = 0;

      this.el.addEventListener(api.start, this, false);
    }

    TapElement.prototype.start = function (e) {
      this.el.addEventListener(api.move, this, false);
      this.el.addEventListener(api.end, this, false);

      this.moved = false;

      this.startX = (e.touches ? e.touches[0].clientX : e.clientX);
      this.startY = (e.touches ? e.touches[0].clientY : e.clientY);
    };

    TapElement.prototype.move = function (e) {
      const moveX = (e.touches ? e.touches[0].clientX : e.clientX);
      const moveY = (e.touches ? e.touches[0].clientY : e.clientY);

      // if finger moves more than 10px flag to cancel
      if (Math.abs(moveX - this.startX) > 10 || Math.abs(moveY - this.startY) > 10) {
        this.moved = true;
      }
    };

    TapElement.prototype.end = function (e) {
      this.el.removeEventListener(api.move, this, false);
      this.el.removeEventListener(api.end, this, false);

      if (api.cancel !== null) this.el.removeEventListener(api.cancel, this, false);

      if (!this.moved) {
        /**
                 * jQuery/Zepto compatibility with the tap event
                 * See issue: #147
                 */
        if (typeof $ !== 'undefined') {
          const customEvent = new window.CustomEvent(
            this.tap,
            {
              detail: {
                event: 'tap',
                target: this.element,
              },
              bubbles: true,
              cancelable: true,
            },
          );
          this.el.dispatchEvent(customEvent);
        }

        this.callback(e);
      }
    };

    TapElement.prototype.cancel = function () {
      this.moved = false;
      this.startX = 0;
      this.startY = 0;
    };

    TapElement.prototype.off = function () {
      this.el.removeEventListener(api.start, this, false);
      this.el.removeEventListener(api.move, this, false);
      this.el.removeEventListener(api.end, this, false);
      if (api.cancel !== null) this.el.removeEventListener(api.cancel, this, false);
    };

    TapElement.prototype.handleEvent = function (e) {
      switch (e.type) {
        case api.start: this.start(e); break;
        case api.move: this.move(e); break;
        case api.end: this.end(e); break;
        case api.cancel: this.cancel(e); break; // api.cancel can be null
      }
    };

    return TapElement;
  }());

  phonon.on = function (el, eventName, callback, useCapture) {
    const addEvent = function (el, eventName, callback, useCapture) {
      if (eventName === api.tap && (api.hasTouch || api.forceTap)) {
        const tap = new TapElement(el, callback);
        tapEls.push(tap);
        return;
      }

      if (eventName === api.tap) {
        eventName = 'click';
      }

      if (el.addEventListener) {
        el.addEventListener(eventName, callback, useCapture);
      } else if (el.attachEvent) {
        el.attachEvent(`on${eventName}`, callback, useCapture);
      }
    };

    if (typeof el.length !== 'undefined') {
      let i = 0;
      const l = el.length;
      for (; i < l; i++) {
        addEvent(el[i], eventName, callback, useCapture);
      }
      return;
    }
    addEvent(el, eventName, callback, useCapture);
  };

  window.on = document.on = NodeList.prototype.on = HTMLElement.prototype.on = function (type, listener, useCapture) {
    phonon.on(this, type, listener, useCapture);
  };

  phonon.off = function (el, eventName, callback, useCapture) {
    const removeEvent = function (el, eventName, callback, useCapture) {
      if (eventName === api.tap && (api.hasTouch || api.forceTap)) {
        let i = 0;
        const l = tapEls.length;
        for (; i < l; i++) {
          if (tapEls[i].el === el) {
            tapEls[i].off();
            tapEls.splice(i, 1);
            break;
          }
        }
        return;
      }

      if (eventName === api.tap) {
        eventName = 'click';
      }

      if (el.removeEventListener) {
        el.removeEventListener(eventName, callback, useCapture);
      } else if (el.attachEvent) {
        el.detachEvent(`on${eventName}`, callback, useCapture);
      }
    };

    if (typeof el.length !== 'undefined') {
      let i = 0;
      const l = el.length;
      for (; i < l; i++) {
        removeEvent(el[i], eventName, callback, useCapture);
      }
      return;
    }

    removeEvent(el, eventName, callback, useCapture);
  };

  window.off = document.off = NodeList.prototype.off = HTMLElement.prototype.off = function (type, listener, useCapture) {
    phonon.off(this, type, listener, useCapture);
  };

  return api;
}(window.jQuery));
