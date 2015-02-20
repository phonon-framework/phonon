/* ========================================================================
* Phonon: notifications.js v0.1.4
* http://phonon.quarkdev.com
* ========================================================================
* Licensed under MIT (http://phonon.quarkdev.com)
* ======================================================================== */
;(function (window, document, Phonon, undefined) {

    'use strict';

	/**
	 * @private
	*/
	var isCordova = typeof window.cordova !== 'undefined' ? true : false;

	/**
	 * Public API
	*/
	var api = {};

	/**
	 * Displays an alert dialog
	 * @param {String} title dialog title
	 * @param {String} message dialog message
	 * @param {String} buttonOK button name
	 * @param {Function} callback
	 * @public
	*/
	function showAlert(title, message, buttonOK, callback) {

		title = title || 'Alert';
		message = message || ' ';
		buttonOK = buttonOK || 'OK';
		callback = typeof callback !== 'undefined' ? callback : null;

		if(isCordova) {
			navigator.notification.alert(
				message,
				callback,
				title,
				buttonOK
			);
		} else {
			alert(title+'\n\n'+message);
			if(callback !== null)
				callback();
		}
	}
	api.showAlert = showAlert;

	/**
	 * Displays a confirmation dialog
	 * @param {String} title : dialog title
	 * @param {String} message : dialog message
	 * @param {Array} arrayButtonNames array of button names (positive button, then the negative)
	 * @return callback {Number} the button iIndex (1=ok, 2=cancel)
	 * @public
	*/
	function showConfirm(title, message, arrayButtonNames, callback) {

		title = title || 'Confirm';
		message = message || ' ';
		arrayButtonNames = arrayButtonNames || ['OK', 'Cancel'];
		if(!arrayButtonNames instanceof Array) {
			throw new Error('Button names must be an array of two values or an empty array');
		}
		if(arrayButtonNames.length != 2) {
			arrayButtonNames = ['OK', 'Cancel'];
		}
		callback = typeof callback !== 'undefined' ? callback : null;

		if(isCordova) {

			navigator.notification.confirm(
				message,
				callback,
				title,
				arrayButtonNames
			);
		} else {
			var result = confirm(title+'\n\n'+message);
			if(callback !== null)
				callback(result);
		}
	}
	api.showConfirm = showConfirm;

	/**
	 * Displays a prompt dialog
	 * @param {String} title dialog title 
	 * @param {String} message dialog message
	 * @param {String} defaultText the default input value
	 * @param {String} arrayButtonNames array of buttons names
	 * @return callback an object containing the buttonIndex (1=ok, 2=cancel), the inserted value
	 * Callback to invoke with index of button pressed (1, 2, or 3) or
	 * when the dialog is dismissed without a button press (0)
	*/
	function showPrompt(title, message, defaultText, arrayButtonNames, callback) {

		title = title || 'Confirm';
		message = message || ' ';
		defaultText = defaultText || '';
		arrayButtonNames = arrayButtonNames || ['OK', 'Cancel'];
		if(!arrayButtonNames instanceof Array) {
			throw new Error('Button names must be an array of two values or an empty array');
		}
		if(arrayButtonNames.length != 2) {
			arrayButtonNames = ['OK', 'Cancel'];
		}
		callback = typeof callback !== 'undefined' ? callback : null;

		if(isCordova) {

			navigator.notification.prompt(
				message,
				callback,
				title,
				arrayButtonNames,
				defaultText
			);
		} else {
			var text = prompt(title+'\n\n'+message, defaultText);

			var obj = {};
			obj.buttonIndex = (text !== null ? 1 : 2);
			obj.input1 = text;

			if(callback !== null)
				callback(obj);
		}
	}
	api.showPrompt = showPrompt;

    Phonon.Notification = function () {
    	return api;
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