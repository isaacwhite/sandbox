'use strict';

var client = require('http');
var bl = require('bl');

var url = process.argv[2];

client.get(url, function (res) {
	res.pipe(bl(function (err, data) {
		var result;

		if (err) {
			return;
		}

		result = data.toString();
		console.log(result.length);
		console.log(result);
	}));
});


