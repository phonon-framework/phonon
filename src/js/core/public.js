	// init
	phonon.options = function(options) {

		var useI18n = false;
		if(typeof options.i18n === 'object' && options.i18n !== null) {
			phonon.i18n(options.i18n);
			useI18n = true;
		}

		options.navigator.useI18n = useI18n;
		phonon.navigator(options.navigator);
	};

	/**
	 * Shortcuts for dialog
	 */
	phonon.alert = function(text, title, cancelable, textOk) {
		return phonon.dialog().alert(text, title, cancelable, textOk);
	};

	phonon.confirm = function(text, title, cancelable, textOk, textCancel) {
		return phonon.dialog().confirm(text, title, cancelable, textOk, textCancel);
	};

	phonon.prompt = function(text, title, cancelable, textOk, textCancel) {
		return phonon.dialog().prompt(text, title, cancelable, textOk, textCancel);
	};

	phonon.indicator = function(title, cancelable) {
		return phonon.dialog().indicator(title, cancelable);
	};

	/**
	* Changes the language and updates tags
	* @param {String} locale
	*/
	phonon.updateLocale = function(locale) {

		var riotEnabled = (typeof riot !== 'undefined' ? true : false);

		phonon.i18n().setPreference(locale).getAll(function(json) {

			if(riotEnabled) {

				var virtualDom = phonon.tagManager.getAll();
				var i = virtualDom.length - 1;
				for (; i >= 0; i--) {
					virtualDom[i].i18n = json;
				}

				// Global update
				riot.update();

			} else {
				phonon.i18n().bind();
			}
		});
	};
