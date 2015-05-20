'use strict';

var split = require('split');
var through = require('through2');
var counter = 0;

process.stdin
	.pipe(split())
	.pipe(through(function (line, _, next) {
		counter++;
		var stringified = line.toString();
		var result = counter % 2 ? stringified.toLowerCase() : stringified.toUpperCase();

		this.push(result + '\n');
		next();
	}))
	.pipe(process.stdout);