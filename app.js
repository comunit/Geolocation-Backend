require('events').EventEmitter.prototype._maxListeners = 0;
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

var loc = [];
var inout;
io.on('connection', function (socket) {
  socket.on('newUser', function (data) {
    var data = {
      user: data.user,
      id: socket.id
    }
    socket.broadcast.emit('newUser', data);
  });

  socket.on('location', function (data) {

    if (data.user == undefined) {} else {
      let obj = loc.find(o => o.id === data.id);

      if (obj == undefined) {
        loc.push(data);
      } else {
        let obj = loc.find((o, i) => {
          //Find index of lat and lng using using findIndex method.    
          objIndex = loc.findIndex((obj => obj.id == data.id));
          //Update userslat and lng property.
          loc[objIndex].lat = data.lat;
          loc[objIndex].lng = data.lng;
          loc[objIndex].user = data.user;
        });
      }
    }

    // send information back to client
    socket.emit('location', {
      loc,
      inout
    });

    socket.on('disconnect', function () {


      // Listen for disconneted ids and send it back to clients
      socket.broadcast.emit('disconnectId', {
        disconnetId: socket.id
      });


      console.log(socket.id + " disconnected");
      //Find disconncted user and remove it from loc alreadyHave
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