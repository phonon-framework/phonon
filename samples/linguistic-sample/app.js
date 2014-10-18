'use strict';

var elPrefLang = document.querySelector('.pref-lang');
var elLang = document.querySelector('.browser-lang');
var elDefault = document.querySelector('.default-lang');
var elSetFr = document.querySelector('.set-fr');
var elSetEn = document.querySelector('.set-en');

function drawData() {
	var pref = (Phonon.Linguistic.getPreferredLanguage() === null ? 'not used' : Phonon.Linguistic.getPreferredLanguage());
	elPrefLang.textContent = 'Preferred language : ' + pref;
	elLang.textContent = 'Browser language : ' + Phonon.Linguistic.getBrowserLanguage();
	elDefault.textContent = 'Default language : ' + Phonon.Linguistic.getDefaultLanguage();

	// The parameter is optional, if you pass nothing, Linguistic will read all the DOM
	Phonon.Linguistic.draw();
}

var setPreferredLanguage = function (evt) {
	var target = evt.target;
	var lang = target.getAttribute('data-l');
	if(lang !== null) {
		Phonon.Linguistic.setPreferredLanguage(lang);
		Phonon.Linguistic.draw();

		drawData();
	}
};

elSetFr.addEventListener('click', setPreferredLanguage);
elSetEn.addEventListener('click', setPreferredLanguage);

Phonon.Linguistic.init('res/lang/', 'fr');

drawData();