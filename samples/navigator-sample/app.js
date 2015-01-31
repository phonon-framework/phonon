'use strict';

/**
 * Simple function to render some text on a element
*/
function write (el, text) {
    if(!('textContent' in el)) {
        el.innerText = text;
    } else {
        el.textContent = text;
    }
}

var onDeviceReady = function () {
	Phonon.Navigator.start('home');
}

var isCordova = typeof window.cordova !== 'undefined' ? true : false;

if(isCordova) {
	document.addEventListener('deviceready', onDeviceReady, false);
} else {
	window.addEventListener('load', onDeviceReady, false);
}

Phonon.Navigator.init({
	defaultPage: 'home',
	templatePath: 'tpl',
	pageAnimations: true
});

/**
 * This page is synchronous
*/
Phonon.Navigator.on({page: 'home', template: 'home', asynchronous: false}, function(activity) {

	activity.onCreate(function(self, el, req) {
		console.log('home: onCreate');
	});

	activity.onReady(function(self, el, req) {
		console.log('home: onReady');
	});

	activity.onTransitionEnd(function() {
		console.log('home: onTransitionEnd');
	});

	activity.onQuit(function(self) {
		console.log('home: onQuit');
	});

	activity.onHidden(function(el) {
		console.log('home: onHidden');
	});
});

/**
 * This page is asynchronous which means that you must
 * call runReady() inside the onCreate callback
 * and startTransition() inside the onReady callback manually after asynchronous tasks are done
*/
Phonon.Navigator.on({page: 'page-two', template: 'page-two', asynchronous: true}, function(activity) {

	var msg;
	var userAction = false;
	var handler = function(evt) {
		evt.preventDefault();

		userAction = true;
		write(msg,  'You can now leave this page if you want to');
	};

	activity.onCreate(function(self, el, req) {

		msg = el.querySelector('.msg');
		var els = el.querySelectorAll('.order, .cancel');
		els[0].addEventListener('click', handler);
		els[1].addEventListener('click', handler);

		// Asynchronous call of the onReady callback sample
		console.log('page-two: onCreate');
		self.runReady();
	});

	activity.onReady(function(self, el, req) {
		console.log('page-two: onReady');
		// OnReady task simulation : wait 1/4 second, then start the page transition
		setTimeout(function() {

			// get/display the parameter value
			var res = el.querySelector('.result');

	        write(res, req.myParam);
			self.startTransition();

		}, 250);
	});

	activity.onTransitionEnd(function() {
		console.log('page-two: onTransitionEnd');
	});

	activity.onQuit(function(self) {
		console.log('page-two: onQuit');
		if(userAction) {
			self.quit();
		} else {
			self.cancel();
			console.log('page-two: quit has been canceled');
			write(msg, 'Please order or cancel your pizza before going back.');
		}
	});

	activity.onHidden(function(el) {
		console.log('page-two: onHidden');

		// Reset the text
		write(msg, '');
		userAction = false;
	});

}, 'page-two/:myParam');