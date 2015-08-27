'use strict';

window.addEventListener('load', function () {

	Phonon.Notification(document.querySelector('#welcome')).show();

	var myNotif = document.querySelector('#my-notif');

	myNotif.addEventListener('phonon-notif:opened', function (evt) {
	    console.log('opened!');
	    console.log(evt.target);
	});
	myNotif.addEventListener('phonon-notif:hidden', function (evt) {
	    console.log('hidden!');
	    console.log(evt.target);
	});


	document.querySelector('#show-notif-btn').addEventListener('click', function (evt) {
		evt.preventDefault();
		Phonon.Notification(myNotif).show();
	});
});