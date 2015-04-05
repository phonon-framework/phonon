'use strict';

/**
 * Define a View Model
*/
var viewModel = function () {

	var self = this;

	self.title = Knity.observable('');
	self.item = Knity.observable('');

	// Custom function
	self.item.submit = function () {

		var value = this().trim();

		if(value.length > 0) {

			var date = new Date();
			var h = date.getHours().toString();
			var m = (date.getMinutes()).toString();

			var d = (h[1]?h:'0'+h[0]) + '.' + (m[1]?m:'0'+m[0]);
			self.allItems( {name: value, date: d } );

			this('');

			self.computeTotal();
		}
	};

	self.allItems = Knity.observable([]);

	self.computeTotal = function () {
		self.title('Number of elements (' + self.allItems().length + ')');
	};

	// Set the value of title
	self.computeTotal();

	return self;
};

/**
 * Declare the View Model
*/
var viewModel = new viewModel();

/*
 * Attach the View Model with a DOM element or the document
*/
Knity.attach(viewModel, document);

document.querySelector('.submit-btn').addEventListener('click', function (evt) {
	evt.preventDefault();

	// Keep the vm context
	viewModel.item.submit();
});

/*
 * Listener for click event on "delete" buttons.
*/
document.addEventListener('click', function (evt) {
	evt.preventDefault();

	var target = evt.target;

	if(target.getAttribute('data-delete')) {

		var index = target.getAttribute('data-index');

		var items = viewModel.allItems();
		items.splice(index, 1);

		viewModel.allItems(items);
		viewModel.computeTotal();
	}
});