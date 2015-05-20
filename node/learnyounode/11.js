'use strict';
var http = require('http');
var fs = require('fs');

// args
var port = process.argv[2];
var filename = process.argv[3];

// make a server
var server = http.createServer(function (req, response) {
	fs.createReadStream(filename).pipe(response);
});

// listen
server.listen(port);