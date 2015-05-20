'use strict';

var client = require('http');
var url = process.argv[2];

client.get(url, function (res) {
	// listen for data events;
	res.on('data', function (data) {
		console.log(data.toString());
	});
});
