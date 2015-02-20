'use strict';

var req1 = new Phonon.Ajax({baseUrl: 'http://www.unige.ch/', timeout: 5000, dataType: 'xml', crossDomain: true});

req1.get('feed/rss', null, function(res) {

	console.log('OK');
	console.log(res);

}, function(err) {

	console.log('ERR');
	console.log(err);
});