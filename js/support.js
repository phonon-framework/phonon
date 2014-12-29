/* ========================================================================
* Phonon: support.js v0.0.1
* http://phonon.quarkdev.com
* ========================================================================
* Licensed under MIT (http://phonon.quarkdev.com)
* ======================================================================== */
(function (window, document) {

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

	window.animationName = 'animation';
	window.animationEnd = 'animationend';

	if(document.body.style.animationName === undefined ) {

		var domPrefixes = ['webkit', 'moz'], l = domPrefixes.length, i = l - 1;

		for (; i >= 0; i--) {
			if(document.body.style[ domPrefixes[i] + 'AnimationName' ] !== undefined ) {
				window.animationName = domPrefixes[i] + 'Animation';
				window.animationEnd = domPrefixes[i] + 'AnimationEnd';
				break;
			}
		}
	}

}(window, document));