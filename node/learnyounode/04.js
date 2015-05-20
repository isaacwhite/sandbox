'use strict';

var filepath = process.argv[2];
var fs = require('fs');

fs.readFile(filepath, function (err, buffer) {
	var lines;

	if (err) {
		return;
	}

	lines = buffer.toString().split('\n').length - 1;

	console.log(lines);
});
