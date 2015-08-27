/* ========================================================================
 * Phonon: forms.js v0.0.1
 * http://phonon.quarkdev.com
 * ========================================================================
 * Licensed under MIT (http://phonon.quarkdev.com)
 * ======================================================================== */
;(function (window) {

	'use strict';

	function addListener(inputEl) {
		inputEl.on('focus', onInputFocus);
		inputEl.on('blur', onInputBlur);
	}

	function onInputFocus(evt) {
		evt.target.parentNode.classList.add('input-filled');
	}

	function onInputBlur(evt) {
		if(evt.target.value.trim() === '') {
			evt.target.parentNode.classList.remove('input-filled');
		}
	}

	document.on('pagecreated', function(evt) {
		var page = document.querySelector(evt.detail.page);
		var inputs = page.querySelectorAll('input.with-label'), i = inputs.length - 1;
		for (; i >= 0; i--) {
			addListener(inputs[i]);
		}
	});

}(typeof window !== 'undefined' ? window : this));