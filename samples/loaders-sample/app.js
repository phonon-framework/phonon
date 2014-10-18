'use strict';

var task = function(evt) {
	evt.preventDefault();

	var target = evt.target ? evt.target : evt.toElement
	target = (target.classList.contains('btn-loader') ? target : target.parentNode);

	target.disabled = true;

	window.setTimeout(function() {
		target.disabled = false;
	}, 2500);
};

var loaderOne = document.querySelector('.loader-one');
var loaderTwo = document.querySelector('.loader-two');
var loaderThree = document.querySelector('.loader-three');

loaderOne.addEventListener('click', task);
loaderTwo.addEventListener('click', task);
loaderThree.addEventListener('click', task);