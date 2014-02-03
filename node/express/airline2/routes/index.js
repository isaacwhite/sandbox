
/*
 * GET home page.
 */
module.exports = function (flights) {
  var fc = require('../flight'); //flight control

  for (var number in flights) {
    flights[number] = fc.flight(flights[number]);
  }

  var functions = {};

  functions.flight = function(req, res){
    var number = req.param('number');

    if(typeof flights[number] === 'undefined') {
      res.status(404).json({status: 'error'});
    } else {
      res.json(flights[number].getInformation());
    }
  };

  functions.arrived = function(req, res) {
    var number = req.param('number');

    if(typeof flights[number] === 'undefined') {
      res.status(404).json({status: 'error'});
    } else {
      flights[number].triggerArrive();
      res.json({status:'done'});
    }
  };

  functions.list = function (req, res) {
    res.render('list', {title: 'All Flights', flights: flights});
  };

  functions.jsonlist = function(req, res) {
    var responseObj = {};
    for (var number in flights) {
      responseObj[number.toString()] = flights[number].getInformation();
    }
    res.json(responseObj);
  };

  return functions;
  
};