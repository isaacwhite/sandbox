'use strict';

var fs = require('fs');
var path = require('path');

var listFiles = function (dir, filter, callback) {
	fs.readdir(dir, function (err, list) {
		if (err && callback) {
			callback(err);
			return;
		}

		var results = list.filter(function (item) {
			return path.extname(item) === '.' + filter;
		});

		if (callback) {
			callback(null, results);
		}
	});
};

module.exports =  listFiles;