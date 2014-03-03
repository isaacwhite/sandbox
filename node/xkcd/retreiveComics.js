"use strict";
var write, http;
http = require("http");
write = require("fs");

function getComicData(path,callback,number) {
  var options = {
    host: "www.xkcd.com",
    port: 80,
    path: path
  };
  http.get(options, function(res) {
    var jsonObj = "";
    res.on("data", function (chunk) {
        jsonObj += chunk;
    });
    res.on("end",function() {
      callback(jsonObj,number);
    });
  });
}

function comicCallback(data,number) {
  try {
    var num = JSON.parse(data).num;
    write.writeFile("comics/" + num + ".json", data, function(err) {
      if(err) {
        console.log("looks like comic number " + num + " didn't save.");
      } else {
        console.log("Saved " + num + ".json!");
      }
    });
  } catch(error) {
    console.log("Had a problem processing comic number" + number + ".");
    console.log(error);
  }
}
 
var max = 1337;
var path;

for (var i = 1; i<= max; i++) {
  path = i + "/info.0.json";
  getComicData(path,comicCallback,i);
}

