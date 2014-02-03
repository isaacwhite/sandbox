
/*
 * GET home page.
 */
var fc = require('../flight'); //flight control

var flight1 = fc.flight({
	number: 1,
	origin: 'LAX',
	destination: 'DCA',
	departs: '9AM',
	arrives: '4PM'
});

var flight2 = fc.flight({
	number: 2,
	origin: 'LAX',
	destination: 'PDX',
	departs: '10AM',
	arrives: '12PM'
});

exports.flight1 = function(req, res){
  res.json(flight1.getInformation());
};

exports.flight2 = function(req, res){
  res.json(flight2.getInformation());
};