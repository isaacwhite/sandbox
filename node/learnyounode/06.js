'use strict';

var filterDirectory = require('./06_support.js');
var directory = process.argv[2];
var filter = process.argv[3];


filterDirectory(directory, filter, function (err, data) {

	if (err) {
		console.log(err);
		return;
	}

	data.forEach(function (item) {
		console.log(item);
	});
});