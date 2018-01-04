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

  socket.on('newUser', function (data) {
    socket.broadcast.emit('newUser', data);
  });

  socket.on('location', function (data) {
    if (data.user == undefined) {

    } else {
      setInterval(function () {
        socket.broadcast.emit('location', data);
      }, 6000);
    }
  });

});