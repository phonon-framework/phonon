/* ========================================================================
* Phonon: ripple.js v0.0.3
* http://phonon.quarkdev.com
* ========================================================================
* Licensed under MIT (http://phonon.quarkdev.com)
* Inspiration: http://www.cssscript.com/demo/android-l-ripple-click-effect-with-javascript-and-css3/
* ======================================================================== */
;(function (window, document) {

	'use strict';

	var ripple = function (evt) {
		var target = evt.target;

		if (target.getAttribute('no-ripple') !== null) return false;
		
		if (target.tagName.toLowerCase() !== 'button' && !target.classList.contains('btn')) return false;
		
		if (target.classList.contains('btn-action') || target.classList.contains('floating-action')) return false;

		if (target.disabled === true) return false;

		var rect = target.getBoundingClientRect();
		var ripple = target.querySelector('.ripple');
		if (!ripple) {
			ripple = document.createElement('span');
			ripple.className = 'ripple';
			ripple.style.height = ripple.style.width = Math.max(rect.width, rect.height) + 'px';
			target.appendChild(ripple);
		}
		ripple.classList.remove('show');

		var top = (evt.changedTouches ? evt.changedTouches[0].pageY : evt.pageY) - rect.top - ripple.offsetHeight / 2 - document.body.scrollTop;
		var left = (evt.changedTouches ? evt.changedTouches[0].pageX : evt.pageX) - rect.left - ripple.offsetWidth / 2 - document.body.scrollLeft;
		ripple.style.top = top + 'px';
		ripple.style.left = left + 'px';
		ripple.classList.add('show');
		return false;
	};

	document.addEventListener('touchend', ripple, false);

}(window, document));