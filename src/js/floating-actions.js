/* ========================================================================
* Phonon: floating-actions.js v0.0.5
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

		var actions = document.querySelectorAll('.app-page.app-active .floating-action');

		if (!actions) return;

		var size = actions.length, i = size - 1;
		for (; i >= 0; i--) {
			var action = actions[i];
		
			if(lastPosition > pageContent.scrollTop) {
				if(!action.classList.contains('active')) {
					action.classList.add('active');
				}
			} else {
				if(action.classList.contains('active')) {
					action.classList.remove('active');
				}
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

	var pages = document.querySelectorAll('.app-page'), l = pages.length, i = l - 1;
	for (; i >= 0; i--) {
		var p = pages[i];

		if(p.querySelector('.floating-action')) {
			listenTo(p);
		}
	}

	Phonon.FloatingAction = function () {
		return {
			listenTo: function (page) {
				listenTo(page);
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
                return Phonon.FloatingAction;
            }
        });
    } else if (typeof module === 'object' && module.exports) {
        if(Phonon.returnGlobalNamespace === true) {
            module.exports = Phonon;
        } else {
            module.exports = Phonon.FloatingAction;
        }
    }

}(window, document, window.Phonon || {}));