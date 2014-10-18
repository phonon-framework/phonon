'use strict';

var req1 = new Ajax({baseUrl: 'http://localhost/UniProgress/', timeout: 5000, dataType: 'json', crossDomain: true});

req1.get('actu?type=news', null, function(res) {

	console.log('OK');
	console.log(res);

}, function(err) {

	console.log('ERR');
	console.log(err);
});