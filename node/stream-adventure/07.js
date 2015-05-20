'use strict';

var http = require('http');
var through = require('through2');

var port = process.argv[2];
var server = http.createServer(function (req, res) {
	if (req.method === 'POST') {
		req.pipe(through(function (buffer, _, next) {
			this.push(buffer.toString().toUpperCase());
			next();
		})).pipe(res);
	}
});

server.listen(port);