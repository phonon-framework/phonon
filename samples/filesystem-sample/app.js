'use strict';

var elTextarea = document.querySelector('.textarea-fs');
var elSave = document.querySelector('.btn-save');
var elRead = document.querySelector('.btn-read');
var elResult = document.querySelector('.result-fs');

elSave.addEventListener('click', function(evt) {
	evt.preventDefault();

	Phonon.FileSystem.putContent('quarkJS', 'example.txt', true, {data:elTextarea.value}, function() {
		console.log('done!');
	});
});

elRead.addEventListener('click', function(evt) {
	evt.preventDefault();

	Phonon.FileSystem.readFile('quarkJS', 'example.txt', false, function(json) {
		elResult.textContent = json.data;
	});
});