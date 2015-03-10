/* ========================================================================
* Phonon: support.js v0.0.3
* http://phonon.quarkdev.com
* ========================================================================
* Licensed under MIT (http://phonon.quarkdev.com)
* ======================================================================== */
;(function (window, document, Phonon, undefined) {

	'use strict';

	/**
	 * CustomEvent polyfill
	*/
	if(!window.CustomEvent) {
		var CustomEvent = function ( event, params ) {
			params = params || { bubbles: false, cancelable: false, detail: undefined };
			var evt = document.createEvent( 'CustomEvent' );
			evt.initCustomEvent( event, params.bubbles, params.cancelable, params.detail );
			return evt;
		};
		CustomEvent.prototype = window.Event.prototype;
		window.CustomEvent = CustomEvent;
	}

	Phonon.returnGlobalNamespace = false;

	Phonon.animationPrefix = '';
	Phonon.animationEnd = 'animationend';

	(function whichAnimationEvent() {
		var el = document.createElement('div'), transitions = [
			{ name: 'animation', event: 'animationend' } ,
			{ name: 'MozAnimation', event: 'animationend' },
			{ name: 'WebkitAnimation', event: 'webkitAnimationEnd' }
		];

		var size = transitions.length, i = size - 1;

		for (; i >= 0; i--) {
			var t = transitions[i];
			if(el.style[t.name] !== undefined) {
				Phonon.animationPrefix = (t.event.indexOf('webkit') === 0 ? 'webkit' : '');
				Phonon.animationEnd = t.event;
				break;
			}
		}


		Phonon.Support = function () {
			return {
				setGlobalNamespace: function (value) {
					window.Phonon.returnGlobalNamespace = value;
				}
			};
		};

		window.Phonon = Phonon;
	})();

	if (typeof define === 'function' && define.amd) {
		define(function () {
			if(Phonon.returnGlobalNamespace === true) {
				return Phonon;
			} else {
				return Phonon.Support;
			}
		});
	} else if (typeof module === 'object' && module.exports) {
		if(Phonon.returnGlobalNamespace === true) {
			module.exports = Phonon;
		} else {
			module.exports = Phonon.Support;
		}
	}

}(window, document, window.Phonon || {}));