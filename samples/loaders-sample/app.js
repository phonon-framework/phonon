'use strict';

var task = function(evt) {
	evt.preventDefault();

	var target = evt.target ? evt.target : evt.toElement
	target = (target.classList.contains('btn-loader') ? target : target.parentNode);

	target.disabled = true;

	window.setTimeout(function() {
		target.disabled = false;
	}, 4000);
};

var btnLoaders = document.querySelectorAll('.btn-loader'), size = btnLoaders.length, i = size - 1;
for (; i >= 0; i--) {
	btnLoaders[i].addEventListener('click', task);
}

document.querySelector('.show-toploader').addEventListener('click', function() {

	var progress = document.querySelector('.top-loader');

	if(!progress.classList.contains('active')) {
		progress.classList.add('active');

		window.setTimeout(function() {
			progress.classList.remove('active');
		}, 4000);
	}
});