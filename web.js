var express = require('express');
var fs = require('fs');

var app = express.createServer(express.logger());

var filename = 'index.html'


app.get('/', function(request, response) {
  var text = new Buffer(fs.readFileSync(filename), 'utf-8')
  response.send(text.toString());
});

var port = process.env.PORT || 5000;
app.listen(port, function() {
  console.log("Listening on " + port);
});