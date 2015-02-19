/* ========================================================================
* Phonon: support.js v0.0.3
* http://phonon.quarkdev.com
* ========================================================================
* Licensed under MIT (http://phonon.quarkdev.com)
* ======================================================================== */
;(function (window, document, undefined) {

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

	window.animationPrefix = '';
	window.animationEnd = 'animationend';

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
				window.animationPrefix = (t.event.indexOf('webkit') === 0 ? 'webkit' : '');
				window.animationEnd = t.event;
				break;
			}
		}
	})();

}(window, document));