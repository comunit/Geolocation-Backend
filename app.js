var express = require('express');
var socket = require('socket.io');

var port = process.env.PORT || 4000;

//App setup
var app = express();

//server
var server = app.listen(port, function () {
  console.log('listenig to requests on port 4000');
});

//socket setup
var io = socket(server);

io.on('connection', function (socket) {
  console.log('made socket connection');
  
  socket.on('location', function (data) {
    if (data.user == undefined) {
      console.log('nothing');
      
    } else {
      setInterval(function(){ 
      socket.broadcast.emit('location', data);
      console.log(data.user); 
     }, 20000);
    }
  });
  
});