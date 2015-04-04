/* ========================================================================
* Phonon: notifications.js v0.0.1
* http://phonon.quarkdev.com
* ========================================================================
* Licensed under MIT (http://phonon.quarkdev.com)
* ======================================================================== */

'use strict';

;(function (window, document, Phonon) {

	var transitionEnd = 'webkitTransitionEnd';

	if (Phonon.animationEnd) {
		transitionEnd = (Phonon.animationPrefix === '' ? 'transitionend' : 'webkitTransitionEnd');
	}

	function onShow () {
		var self = this;
		self.classList.add('showing');

		var evt = new CustomEvent('phonon-notif:opened', {
			detail: { target: self },
			bubbles: true,
			cancelable: true
		});
		self.dispatchEvent(evt);

		var timeout = self.getAttribute('data-timeout');
		if(timeout) {
			if(isNaN(parseInt(timeout))) {
				console.error('Attribute data-timeout must be a number');
			} else {
				window.setTimeout(function() {
					hide(self);
				}, timeout);
			}
		}

		self.removeEventListener(transitionEnd, onShow, false);
	}

	function onHide () {
		var self = this;
		self.classList.remove('showing');

		var evt = new CustomEvent('phonon-notif:hidden', {
			detail: { target: self },
			bubbles: true,
			cancelable: true
		});
		self.dispatchEvent(evt);

		self.style.visibility = 'hidden';

		self.removeEventListener(transitionEnd, onHide, false);
	}

	var getNotification = function (target) {
		for (; target && target !== document; target = target.parentNode) {
			if(target.classList.contains('notification')) {
				return target;
			}
		}
	};

	window.addEventListener('touchend', function (evt) {

		var target = evt.target;

		if(target.getAttribute('data-hide-notif') === 'true') {
			var notification = getNotification(target);
			if(notification) hide(notification);
		}
	});

	/*
	 * Public API
	*/

	function show (el) {
		var notification = (typeof el === 'string' ? document.querySelector(el) : el);
		if(notification === null) {
			throw new Error('The notification with ID ' + el + ' does not exist');
		}

		if(!notification.classList.contains('show')) {
			notification.classList.add('show');
			
			notification.style.visibility = 'visible';

			notification.addEventListener(transitionEnd, onShow, false);
		}
	}

	function hide (el) {
		var notification = (typeof el === 'string' ? document.querySelector(el) : el);
		if(notification === null) {
			throw new Error('The notification with ID ' + el + ' does not exist');
		}

		if(notification.classList.contains('show')) {
			notification.classList.remove('showing');
			notification.classList.remove('show');

			notification.addEventListener(transitionEnd, onHide, false);
		}
	}

	Phonon.Notification = function (el) {
		var notif = (typeof el === 'string' ? document.querySelector(el) : el);
		if(notif === null) {
			throw new Error('The notification with ID ' + el + ' does not exist');
		}

		return {
			show: function () {
				show(notif);
				return this;
			},
			hide: function () {
				hide(notif);
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
                return Phonon.Notification;
            }
        });
    } else if (typeof module === 'object' && module.exports) {
        if(Phonon.returnGlobalNamespace === true) {
            module.exports = Phonon;
        } else {
            module.exports = Phonon.Notification;
        }
    }

}(window, document, window.Phonon || {}));
