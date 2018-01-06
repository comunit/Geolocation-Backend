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

var loc = []
var inout;
io.on('connection', function (socket) {
  console.log('made socket connection');

  socket.on('newUser', function (data) {
    var data = {
      user: data.user,
      id: socket.id
    }
    socket.broadcast.emit('newUser', data);
  });

  socket.on('location', function (data) {
    if (data.user == undefined) {} else {
      if (typeof loc !== 'undefined' && loc.length > 0) {
        for (let i = 0; i < loc.length; i++) {
          const element = loc[i];
          console.log(element.id)
          if (element.id == data.id) {
            element.lat = data.lat;
            element.lng = data.lng;
            console.log(data.user + 'updated')
          }
        }
      } else {
        loc.push(data)
      }
      console.log(loc);
      setInterval(function () {
        socket.broadcast.emit('location', {
          loc,
          inout
        });
        // console.log(loc);
      }, 10000);
    }

    socket.on('disconnect', function () {


      // Listen for disconneted ids and send it back to clients
      socket.broadcast.emit('disconnectId', {
        disconnetId: socket.id
      });


      console.log(socket.id + " disconnected");
      //Find disconncted user and remove it from loc array
      for (let i = 0; i < loc.length; i++) {
        const element = loc[i];
        if (socket.id == element.id) {
          for (let i = 0; i < loc.length; i++)
            if (loc[i].id == element.id) {
              loc.splice(i, 1);
            }
        }
      }
    });
  });

});