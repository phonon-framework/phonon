/* ========================================================================
* Phonon: selectboxes.js v0.0.2
* http://phonon.quarkdev.com
* ========================================================================
* Licensed under MIT (http://phonon.quarkdev.com)
* ======================================================================== */
 (function (window, document) {
 	
	'use strict';

	var touchMove = false;
	var selectbox = false;
	var backdrop = document.createElement('div');
	backdrop.classList.add('backdrop-selectbox');
	var isOpened = false;

	var findSelect = function (target) {
		var i, selectboxes = document.querySelectorAll('.selectbox');

		for (; target && target !== document; target = target.parentNode) {
			for (i = selectboxes.length; i--;) {
				if (selectboxes[i] === target) {
					return target;
				}
			}
		}
	};

	var open = function () {
		isOpened = true;
		document.querySelector('.app-page.app-active').appendChild(backdrop);
		selectbox.querySelector('.caret').classList.add('up');
		selectbox.querySelector('.selectbox-items').classList.add('show');
	};

	var close = function (sb) {
		isOpened = false;
		sb.querySelector('.caret').classList.remove('up');
		sb.querySelector('.selectbox-items').classList.remove('show');
		
		window.setTimeout(function() {
			var page = document.querySelector('.app-page.app-active');
			if(page.querySelector('div.backdrop-selectbox') !== null)
				page.removeChild(backdrop);
		}, 500);
	};

	var onToggle = function (e) {

		var target = e.target ? e.target : e.toElement, toggle = selectbox.querySelector('.selectbox-toggle'), i;

		for (; target && target !== document; target = target.parentNode) {
			if(target === toggle) {
				return true;
			}
		}
		return false;
	};

	var onItem = function (e) {
		var target = e.target ? e.target : e.toElement;
		for (; target && target !== document; target = target.parentNode) {
			if(target.nodeName === 'LI') {
				return true;
			}
		}
		return false;
	};

	window.addEventListener('touchstart', function (e) {
		e = e.originalEvent || e;

		var previousSelectbox = selectbox;
		selectbox = findSelect(e.target);

		if (previousSelectbox !== selectbox) {
			if( isOpened ) {
				close(previousSelectbox);
			}
			return;
		}

		touchMove = false;
	});

	window.addEventListener('touchmove', function (e) {
		e = e.originalEvent || e;
		touchMove = true;
	});

	window.addEventListener('touchend', function (e) {

		if (selectbox) {
			if( onToggle(e) ) {
				var state = selectbox.querySelector('.selectbox-items').classList.contains('show') ? true : false;
				state ? close(selectbox) : open();
				return;
			} else if( !touchMove && onItem(e) ) {

				// stop the immediate propagation if there is a HTML object behind the selectbox
				e.preventDefault();
				e.stopImmediatePropagation();

				var selection = e.target.textContent;

				e = new CustomEvent('selectbox', {
					detail: { item: selection, target: e.target },
					bubbles: true,
					cancelable: true
				});

				selectbox.dispatchEvent(e);
				close(selectbox);
				selectbox.querySelector('.current-item').textContent = selection;
				return;
			}
		}

		touchMove = false;
		isOpened = false;
	});

}(window, document));