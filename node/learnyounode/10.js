'use strict';

var net = require('net');
var ftime = require('strftime');
var portNumber = process.argv[2];

var server = net.createServer(function (socket) {
	socket.end(ftime('%F %R') + '\n');
});

server.listen(portNumber);