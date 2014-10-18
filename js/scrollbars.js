/* ========================================================================
* Phonon: scrollbars.js v0.1.2
* http://phonon.quarkdev.com
* ========================================================================
* Licensed under MIT (http://phonon.quarkdev.com)
* ======================================================================== */
var Scrollbar;
(function (Scrollbar) {

	'use strict';

	var lastPosition = 0;
	var lastContentHeight = 0;
	var hasTouchEvent = false;

	var changeHeight = function(pageContent, scrollbar) {

		var direction = scrollbar.getAttribute('data-position');
		if(!direction) {
			throw new Error('A scrollbar has been defined, but the data-position attribute is not found');
		}
		if(direction !== 'top' && direction !== 'bottom') {
			throw new Error('the ' + direction + ' is invalid, please set top or bottom');
		}

		var defaultHeight = scrollbar.offsetHeight;
		var position = pageContent.scrollTop;

		var height;
		var scrollbarHeight = parseInt(direction === 'top' ? scrollbar.style.top : scrollbar.style.bottom, 10);
		
		if(isNaN(scrollbarHeight)) {
			scrollbarHeight = 0;
		}

		if(lastPosition > position) {
			// Going up
			height = scrollbarHeight + 5;
			if(height > 0) {
				height = 0;
			}
		} else {
			height = scrollbarHeight - 5;
			if((-height) > defaultHeight) {
				height = (-defaultHeight);
			}
		}

		if(position === 0 || position > pageContent.offsetHeight) {
			height = 0;
		}

		direction === 'top' ? scrollbar.style.top = height+"px" : scrollbar.style.bottom = height+"px";
	};

	var onScroll = function (e) {
		e = e.originalEvent || e;
		var pageContent = e.target;

		lastContentHeight = pageContent.offsetHeight;

		var scrollbars = document.querySelector('.app-page.app-active').querySelectorAll('.scrollbar');

		if (!scrollbars) {
			return;
		}

		var i, l = scrollbars.length;
		for (i = l - 1; i >= 0; i--) {
			var scrollb = scrollbars[i];
			changeHeight(pageContent, scrollb);
		}

		if(!hasTouchEvent) {
			hasTouchEvent = true;
			document.addEventListener('touchend', onResize);
		}

		lastPosition = pageContent.scrollTop;
	};

    var isElement = function (o) {
        return (typeof Node === "object" ? o instanceof Node : o && typeof o === "object" && typeof o.nodeType === "number" && typeof o.nodeName === "string");
    };

    function onResize(e) {

    	var target = e.target;

    	if(target.offsetHeight !== lastContentHeight) {
    		lastContentHeight = target.offsetHeight;

    		var scrollbars = document.querySelector('.app-page.app-active').querySelectorAll('.scrollbar'), i, l = scrollbars.length - 1;

    		for (i = l; i >= 0; i--) {
    			var scrollbar = scrollbars[i];
    			var direction = scrollbar.getAttribute('data-position');

    			direction === 'top' ? scrollbar.style.top = "0px" : scrollbar.style.bottom = "0px";
    		}
    	}
		hasTouchEvent = false;
		document.removeEventListener('touchend', onResize);
    }

	function registerScrollListener(page, content) {
		if(isElement(page)) {
			if(content === undefined) {
				page.querySelector('.content').addEventListener('scroll', onScroll, false);
			} else {
				page.querySelector(content).addEventListener('scroll', onScroll, false);
			}
		} else {
			throw new TypeError('The following element is not a DOM object ' + content);
		}
	}
	Scrollbar.registerScrollListener = registerScrollListener;

	var findScrollBars = function (target) {
		var pages = document.querySelectorAll('.app-page'), i, l = pages.length;
		for (i = l - 1; i >= 0; i--) {
			var p = pages[i];

			if(p.querySelector('.scrollbar'))
				registerScrollListener(p);
		}
	}();

	// Expose the Router either via AMD, CommonJS or the global object
	if (typeof define === 'function' && define.amd) {
		define(function () {
			return Scrollbar;
		});
	} else if (typeof module === 'object' && module.exports) {
		module.exports = Scrollbar;
	} else {
		return Scrollbar;
	}

})(Scrollbar || (Scrollbar = {}));