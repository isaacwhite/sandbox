'use strict';

var fs = require('fs');
var path = require('path');

var dirname = process.argv[2];
var ext = process.argv[3];

fs.readdir(dirname, function (err, results) {
	var filtered = results.filter(function (item) {
		return path.extname(item) === '.' + ext;
	});

	filtered.map(function (item) {
		console.log(item);
	});
});