'use strict';

var filepath = process.argv[2];
var fs = require('fs');

var buffer = fs.readFileSync(filepath);
var contents = buffer.toString();

var lines = contents.split('\n');

console.log(lines.length - 1);

