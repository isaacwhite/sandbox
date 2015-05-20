'use strict';

var http = require('http');
var url = require('url');

var port = process.argv[2];

var server = http.createServer(function (req, res) {
	var result, when;
	var urlObj = url.parse(req.url, true);
	var q = urlObj.query;

	if (q) {
		when = new Date(q.iso);
	}

	if (urlObj.pathname === '/api/parsetime') {
		result = {
			hour: when.getHours(),
			minute: when.getMinutes(),
			second: when.getSeconds()
		};

	} else if (urlObj.pathname === '/api/unixtime') {
		result = {
			unixtime: when.getTime()
		};

	}

	result = result ? JSON.stringify(result) : 404;

	res.end(result);

});

server.listen(port);
