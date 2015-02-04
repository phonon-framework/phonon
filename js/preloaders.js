/* ========================================================================
* Phonon: preloaders.js v0.0.1
* http://phonon.quarkdev.com
* ========================================================================
* Licensed under MIT (http://phonon.quarkdev.com)
* ======================================================================== */
(function (window, document) {

	'use strict';

	var transitionEnd = 'webkitTransitionEnd';

	if (window.animationPrefix) {
		transitionEnd = (window.animationPrefix === '' ? 'transitionend' : 'webkitTransitionEnd');
	}


	/**
	* Public API
	*/
	var api = {};

	/**
	 * @param {DOMElement | String} el
	*/
	function show (el) {
		var preloader = (typeof el === 'string' ? document.querySelector(el) : el);
		if(preloader === null) {
			throw new Error('The preloader with ID ' + el + ' does not exist');
		}

		if(preloader.classList.contains('btn-progress')) {
			if(preloader.nodeName === 'BUTTON') {
				preloader.disabled = true;
			} else {
				if(!preloader.classList.contains('in-progress')) {
					preloader.classList.add('in-progress');
				}
			}
			return;
		}

		if(!preloader.classList.contains('active')) {
			preloader.style.visibility = 'visible';
			preloader.classList.add('active');
		}
	}
	api.show = show;

	/**
	 * @param {DOMElement | String} el
	*/
	function hide (el) {
		var preloader = (typeof el === 'string' ? document.querySelector(el) : el);
		if(preloader === null) {
			throw new Error('The preloader with ID ' + el + ' does not exist');
		}

		if(preloader.classList.contains('btn-progress')) {
			if(preloader.nodeName === 'BUTTON') {
				preloader.disabled = false;
			} else {
				if(preloader.classList.contains('in-progress')) {
					preloader.classList.remove('in-progress');
				}
			}
			return;
		}

		if(preloader.classList.contains('active')) {
			preloader.classList.remove('active');

			preloader.addEventListener(transitionEnd, function() {
				preloader.style.visibility = 'hidden';
			});
		}

	}
	api.hide = hide;


	// Expose the Router either via AMD, CommonJS or the global object
	if (typeof define === 'function' && define.amd) {
		define(function () {
			return api;
		});
	} else if (typeof module === 'object' && module.exports) {
		module.exports = api;
	} else {

		if(window.Phonon === undefined) {
			window.Phonon = {};
		}
		window.Phonon.Preloader = api;
	}

}(window, document));