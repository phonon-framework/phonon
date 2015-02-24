/* ========================================================================
* Phonon: preloaders.js v0.0.3
* http://phonon.quarkdev.com
* ========================================================================
* Licensed under MIT (http://phonon.quarkdev.com)
* ======================================================================== */
;(function (window, document, Phonon) {

	'use strict';

	var transitionEnd = 'webkitTransitionEnd';

	if (Phonon.animationEnd) {
		transitionEnd = (Phonon.animationPrefix === '' ? 'transitionend' : 'webkitTransitionEnd');
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


	Phonon.Preloader = function (el) {
		var preloader = (typeof el === 'string' ? document.querySelector(el) : el);
		if(preloader === null) {
			throw new Error('The preloader with ID ' + el + ' does not exist');
		}

		return {
			show: function () {
				show(preloader);
				return this;
			},
			hide: function () {
				hide(preloader);
				return this;
			}
		};
	};
	window.Phonon = Phonon;

	if (typeof define === 'function' && define.amd) {
	  define(function () {
	      if(Phonon.returnGlobalNamespace === true) {
	          return Phonon;
	      } else {
	          return Phonon.Preloader;
	      }
	  });
	} else if (typeof module === 'object' && module.exports) {
	  if(Phonon.returnGlobalNamespace === true) {
	      module.exports = Phonon;
	  } else {
	      module.exports = Phonon.Preloader;
	  }
	}

}(window, document, window.Phonon || {}));