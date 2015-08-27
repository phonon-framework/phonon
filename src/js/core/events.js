phonon.event = (function () {

    /**
     * Events
     * [1] touch enabled boolean
     * [2] start, move, end and tap events
     * [3] transitionEnd and animationEnd polyfill
     */

    // Check if touch is enabled
    var hasTouch = false;
    if(('ontouchstart' in window) || window.DocumentTouch && document instanceof DocumentTouch) {
        hasTouch = true;
    }

    // Use available events
    var desktopEvents = ['mousedown', 'mousemove', 'mouseup'];

    if (window.navigator.pointerEnabled) {
        desktopEvents = ['pointerdown', 'pointermove', 'pointerup'];
    } else if (window.navigator.msPointerEnabled) {
        desktopEvents = ['MSPointerDown', 'MSPointerMove', 'MSPointerUp'];
    }

    var api = {};

    api.hasTouch = hasTouch;
    api.start = hasTouch ? 'touchstart' : desktopEvents[0];
    api.move = hasTouch ? 'touchmove' : desktopEvents[1];
    api.end = hasTouch ? 'touchend' : desktopEvents[2];
    api.tap = 'tap';


    /**
     * Animation/Transition event polyfill
    */
    var el = document.createElement('div');
    var transitions = [
        { name: 'transition', end: 'transitionend' } ,
        { name: 'MozTransition', end: 'transitionend' },
        { name: 'msTransition', end: 'msTransitionEnd' },
        { name: 'WebkitTransition', end: 'webkitTransitionEnd' }
    ];
    var animations = [
        { name: 'animation', end: 'animationend' } ,
        { name: 'MozAnimation', end: 'animationend' },
        { name: 'msAnimation', end: 'msAnimationEnd' },
        { name: 'WebkitAnimation', end: 'webkitAnimationEnd' }
    ];

    var transitionEnd = null;
    var animationEnd = null;

    var i = transitions.length - 1;
    for (i in transitions) {
        if (el.style[transitions[i].name] !== undefined) {
            transitionEnd = transitions[i].end;
            break;
        }
    }

    var j = animations.length - 1;
    for (j in animations) {
        if (el.style[animations[j].name] !== undefined) {
            animationEnd = animations[j].end;
            break;
        }
    }

    // fix bug on Android 4.1
    var osV = phonon.device.osVersion;
    if(osV.length > 2) {
        osV = phonon.device.osVersion.substring(0,3);
    }

    if(phonon.device.os.toLowerCase() === 'android' && osV === '4.1') {
        transitionEnd = 'webkitTransitionEnd';
        animationEnd = 'webkitAnimationEnd';
    }
    
    api.transitionEnd = transitionEnd;
    api.animationEnd = animationEnd;


    var tapEls = [];

    var TapElement = (function () {

        function TapElement(el, callback) {
            this.el = el;
            this.callback = callback;
            this.moved = false;
            this.startX = 0;
            this.startY = 0;
            this.hasTouchEventOccured = false;
            this.el.addEventListener(api.start, this, false);
        }

        TapElement.prototype.start = function(e) {

            if (e.type === 'touchstart') {

                this.hasTouchEventOccured = true;
                this.el.addEventListener('touchmove', this, false);
                this.el.addEventListener('touchend', this, false);
                this.el.addEventListener('touchcancel', this, false);

            } else {

                this.el.addEventListener(api.end, this, false);
            }

            this.moved = false;
            this.startX = e.type === 'touchstart' ? e.touches[0].clientX : e.clientX;
            this.startY = e.type === 'touchstart' ? e.touches[0].clientY : e.clientY;
        };

        TapElement.prototype.move = function(e) {
            //if finger moves more than 10px flag to cancel
            if (Math.abs(e.touches[0].clientX - this.startX) > 10 || Math.abs(e.touches[0].clientY - this.startY) > 10) {
                this.moved = true;
            }
        };

        TapElement.prototype.end = function(e) {
            this.el.removeEventListener('touchmove', this, false);
            this.el.removeEventListener('touchend', this, false);
            this.el.removeEventListener('touchcancel', this, false);
            this.el.removeEventListener(api.end, this, false);

            if (!this.moved) {
                this.callback(e);
            }
        };

        TapElement.prototype.cancel = function() {
            this.hasTouchEventOccured = false;
            this.moved = false;
            this.startX = 0;
            this.startY = 0;
        };

        TapElement.prototype.off = function() {
            this.el.removeEventListener(api.start, this, false);
            this.el.removeEventListener(api.move, this, false);
            this.el.removeEventListener(api.end, this, false);
            this.el.removeEventListener('touchcancel', this, false);
        };

        TapElement.prototype.handleEvent = function(e) {
            switch (e.type) {
                case api.start: this.start(e); break;
                case 'touchmove': this.move(e); break;
                case api.end: this.end(e); break;
                case 'touchcancel': this.cancel(e); break;
            }
        };

        return TapElement;
    })();

    phonon.on = function(el, eventName, callback, useCapture) {

        if(eventName === api.tap) {
            var tap = new TapElement(el, callback);
            tapEls.push(tap);
            return;
        }

        if(el.addEventListener) {
            el.addEventListener(eventName, callback, useCapture);
        } else if(el.attachEvent) {
            el.attachEvent('on' + eventName, callback, useCapture);
        }
    };

    window.on = document.on = HTMLElement.prototype.on = function(type, listener, useCapture) {
        phonon.on(this, type, listener, useCapture);
    };

    phonon.off = function(el, eventName, callback, useCapture) {

        if(eventName === api.tap) {

            for (var i = tapEls.length - 1; i >= 0; i--) {
                if(tapEls[i].el === el) {
                    tapEls[i].off();
                    tapEls.splice(i, 1);
                    break;
                }
            }
            return;
        }

        if(el.removeEventListener) {
            el.removeEventListener(eventName, callback, useCapture);
        } else if(el.attachEvent) {
            el.detachEvent('on' + eventName, callback, useCapture);
        }
    };

    window.off = document.off = HTMLElement.prototype.off = function(type, listener, useCapture) {
        phonon.off(this, type, listener, useCapture);
    };

    return api;

})();