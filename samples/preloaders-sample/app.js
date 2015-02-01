'use strict';

var task = function(evt) {
	evt.preventDefault();

	var target = evt.target ? evt.target : evt.toElement
	target = (target.classList.contains('btn-progress') ? target : target.parentNode);

	target.disabled = true;

	window.setTimeout(function() {
		target.disabled = false;
	}, 4000);
};

var btnProgress = document.querySelectorAll('.btn-progress'), size = btnProgress.length, i = size - 1;
for (; i >= 0; i--) {
	btnProgress[i].addEventListener('click', task);
}