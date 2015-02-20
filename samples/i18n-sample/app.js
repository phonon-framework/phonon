'use strict';

var elPrefLang = document.querySelector('.pref-lang');
var elLang = document.querySelector('.locale-lang');
var elDefault = document.querySelector('.default-lang');
var elSetFr = document.querySelector('.set-fr');
var elSetEn = document.querySelector('.set-en');

var defaultLocale = 'fr';

function bindHTML() {
	var pref = (Phonon.i18n().getPreference() ? Phonon.i18n().getPreference() : 'not used');
	elPrefLang.textContent = 'Preferred language : ' + pref;
	elLang.textContent = 'Locale language : ' + Phonon.i18n().getLocale();
	elDefault.textContent = 'Default language : ' + defaultLocale;

	// The parameter is optional, if you pass nothing, i18n will bind all the document
	Phonon.i18n().bind();
}

var setPreference = function (evt) {
	var target = evt.target;
	var lang = target.getAttribute('data-l');
	if(lang) {
		Phonon.i18n().setPreference(lang);
		bindHTML();
	}
};

elSetFr.addEventListener('click', setPreference);
elSetEn.addEventListener('click', setPreference);

Phonon.i18n({directory: 'res/lang/', defaultLocale: defaultLocale, preferredLocale: 'en'});

bindHTML();