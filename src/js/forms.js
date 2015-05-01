/* ========================================================================
* Phonon: forms.js v0.0.1
* http://phonon.quarkdev.com
* ========================================================================
* Licensed under MIT (http://phonon.quarkdev.com)
* ======================================================================== */

'use strict';

;(function (window, document, Phonon, undefined) {

	var inputs = document.querySelectorAll('input.with-label'), i = inputs.length - 1;

	for (; i >= 0; i--) {
		addListener(inputs[i]);
	}

	function addListener (inputEl) {
		inputEl.addEventListener('focus', onInputFocus);
		inputEl.addEventListener('blur', onInputBlur);
	}

	function onInputFocus(evt) {
		evt.target.parentNode.classList.add('input-filled');
	}

	function onInputBlur(evt) {
		if(evt.target.value.trim() === '') {
			evt.target.parentNode.classList.remove('input-filled');
		}
	}

	Phonon.Form = function () {
		return {
			addListener: addListener
		};
	};
	window.Phonon = Phonon;

    if (typeof define === 'function' && define.amd) {
        define(function () {
            if(Phonon.returnGlobalNamespace === true) {
                return Phonon;
            } else {
                return Phonon.Form;
            }
        });
    } else if (typeof module === 'object' && module.exports) {
        if(Phonon.returnGlobalNamespace === true) {
            module.exports = Phonon;
        } else {
            module.exports = Phonon.Form;
        }
    }

}(window, document, window.Phonon || {}));