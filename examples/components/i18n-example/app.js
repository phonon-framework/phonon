'use strict';

var elPrefLang = document.querySelector('.pref-lang');
var elLang = document.querySelector('.locale-lang');
var elDefault = document.querySelector('.default-lang');
var elSetFr = document.querySelector('.set-fr');
var elSetEnGlobal = document.querySelector('.set-en-global');
var elSetEnUs = document.querySelector('.set-en-us');

var defaultLocale = 'fr';

function setupHTML() {
	var pref = (phonon.i18n().getPreference() ? phonon.i18n().getPreference() : 'not used');
	elPrefLang.textContent = 'Preferred language : ' + pref;
	elLang.textContent = 'Locale language : ' + phonon.i18n().getLocale();
	elDefault.textContent = 'Default language : ' + defaultLocale;

	// The parameter is optional, if you pass nothing, i18n will bind all the document
	phonon.i18n().bind();
}

var setPreference = function (evt) {
	var target = evt.target;
	var lang = target.getAttribute('data-l');
	if(lang) {
		phonon.updateLocale(lang);
	}
};

elSetFr.on('click', setPreference);
elSetEnGlobal.on('click', setPreference);
elSetEnUs.on('click', setPreference);

phonon.options({
    navigator: {
        defaultPage: 'home',
    },
    i18n: {
		directory: 'res/lang/',
		localeFallback: defaultLocale,
		localePreferred: 'en'
    }
});

setupHTML();

phonon.navigator().start();