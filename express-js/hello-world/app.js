var express = require('express');
var app = express();

app.get('/hello.txt', function(req, res){
  // var body = 'Hello World';
  // res.setHeader('Content-Type','text/plain');
  // res.setHeader('Content-Length',Buffer.byteLength(body));
  // res.end(body);
  res.send('Hello World');
});

app.get('/',function(req,res){
  res.send('Welcome to express!');
});

app.listen(3000);
console.log('Listening on port 3000');