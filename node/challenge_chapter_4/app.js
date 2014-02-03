var flightControl = require('./flight');

var pdxlax = {
	number: 847,
	origin: 'PDX',
	destination: 'LAX'
};

var pl = flightControl.flight(pdxlax);

pl.triggerDepart();

console.log(pl.getInformation());

var ausdca = {
	number: 382,
	origin: 'AUS',
	destination: 'DCA'
};

var ad = flightControl.flight(ausdca);

console.log(ad.getInformation());
console.log(pl.getInformation());

console.log(flightControl.getFlightCount());
console.log(flightControl.getDestinations());
