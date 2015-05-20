'use strict';
var client = require('http');
var bl = require('bl');

// wrangle the args
var urls = process.argv;
urls.splice(0, 2);

// get a counter to help decide when we are done
var remaining = urls.length;
var result = urls.map(function () {
	return ''; //prepopulate with empty string
});

urls.forEach(function (item, index) {
	client.get(item, function (res) {
		res.pipe(bl(function (err, data) {
			remaining--;

			if (err) {
				return err;
			}

			result[index] = data.toString();

			if (remaining !== 0) {
				return;
			}

			result.forEach(function (item) {
				console.log(item);
			});
		}));
	});
});