'use strict';

var numbers = process.argv;
numbers.splice(0, 2); // remove the first two elements

var sum = numbers.reduce(function(prev, curr) {
  return parseInt(prev) + parseInt(curr);
});

console.log(sum);