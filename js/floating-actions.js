/* ========================================================================
* Phonon: floating-actions.js v0.0.3
* http://phonon.quarkdev.com
* ========================================================================
* Licensed under MIT (http://phonon.quarkdev.com)
* ======================================================================== */
;(function (window, document, Phonon) {

	'use strict';

	var lastPosition = 0;
	var lastContentHeight = 0;

	var onScroll = function (evt) {
		evt = evt.originalEvent || evt;
		var pageContent = evt.target;

		lastContentHeight = pageContent.offsetHeight;

		var flga = document.querySelector('.app-page.app-active .floating-action');

		if (!flga) return;

		if(lastPosition > pageContent.scrollTop) {
			if(!flga.classList.contains('active')) {
				flga.classList.add('active');
			}
		} else {
			if(flga.classList.contains('active')) {
				flga.classList.remove('active');
			}
		}

		lastPosition = pageContent.scrollTop;
	};

    var isElement = function (o) {
        return (typeof Node === 'object' ? o instanceof Node : o && typeof o === 'object' && typeof o.nodeType === 'number' && typeof o.nodeName === 'string');
    };

	/**
    * Public API
    */

    var api = {};

    /**
     * Event listener for a floating action
     * @param {DOMElement} page
    */
	function listenTo(page) {
		if(isElement(page)) {
			var c = page.querySelector('.content');
			if(c) {
				c.addEventListener('scroll', onScroll, false);
			} else {
				console.error('The given page does not contain the .content class');
			}
		} else {
			throw new Error('The page must be a DOMElement not a ' + typeof page);
		}
	}
	api.listenTo = listenTo;

	var pages = document.querySelectorAll('.app-page'), l = pages.length, i = l - 1;
	for (; i >= 0; i--) {
		var p = pages[i];

		if(p.querySelector('.floating-action')) {
			listenTo(p);
		}
	}

    // Expose the Router either via AMD, CommonJS or the global object
    if (typeof define === 'function' && define.amd) {
        define(function () {
            return api;
        });
    } else if (typeof module === 'object' && module.exports) {
        module.exports = api;
    } else {
        Phonon.FloatingAction = api;
        window.Phonon = Phonon;
    }

}(window, document, window.Phonon || {}));