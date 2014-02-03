var numberOfFlights = 0;
var destinations = {};
//our flights object
var Flight = function () {
  this.data = {
    number: null,
    origin: null,
    destination: null,
    departs: null,
    arrives: null,
    actualDepart: null,
    actualArrive: null
  };

  this.fill = function (info) {
    if(info.destination) {
      addDestination(info.destination);
    }
    for (var prop in this.data) {
      if(this.data[prop] !== 'undefined') {
        this.data[prop] = info[prop];
      }
    }
  };

  this.triggerDepart = function () {
    this.data.actualDepart = Date.now();
  };
  this.triggerArrive = function() {
    this.data.actualArrive = Date.now();
  };
  this.getInformation = function () {
    return this.data;
  };
};

function addDestination(name) {
  destinations[name] = true;
}

function getDestinationList() {
  var destinationList = [];
  for (var prop in destinations) {
    destinationList.push(prop);
  }
  return destinationList;
}


module.exports = {
  flight: function(info) {
     var instance = new Flight();
     numberOfFlights++;
     instance.fill(info);
     return instance;
   },
   getFlightCount: function() {
    return numberOfFlights;
   },
   getDestinations: function() {
    return getDestinationList();
   }
};