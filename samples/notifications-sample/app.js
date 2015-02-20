'use strict';

var btnAlert = document.querySelector('.alert');
var btnPrompt = document.querySelector('.prompt');
var btnConfirm = document.querySelector('.confirm');

btnAlert.addEventListener('click', function() {
	Phonon.Notification().showAlert('Hello!', 'This is an alert dialog', 'Close :)', function() {

	});
});

btnPrompt.addEventListener('click', function() {
	Phonon.Notification().showPrompt('Hello!', 'This is a prompt dialog', '', ['Button1', 'Button2'], function(res) {

		var buttonIndex = res.buttonIndex;
		var input = res.input1;

		Phonon.Notification().showAlert('Result', 'Button index: ' + buttonIndex + '\n' + 'input: ' + input, 'OK');
	});
});

btnConfirm.addEventListener('click', function() {
	Phonon.Notification().showConfirm('Hello!', 'This is a confirm dialog', ['Button1', 'Button2'], function(res) {

		if(res == 1) {
			Phonon.Notification().showAlert('Result', 'Accepted', 'OK');
		}
		else {
			Phonon.Notification().showAlert('Result', 'Canceled', 'OK');
		}
	});
});