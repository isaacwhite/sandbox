'use strict'
var through = require('through2');

var transformer = through(function (buffer, enc, next) {
	this.push(buffer.toString().toUpperCase());
	next();
});

process.stdin.pipe(transformer).pipe(process.stdout);