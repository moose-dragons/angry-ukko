var UUID = require('node-uuid');

function handler(req, res) {
  fs.readFile(__dirname + '/index.html',
    function(err, data) {
      if (err) {
        res.writeHead(500);
        return res.end('Error loading index.html');
      }

      res.writeHead(200);
      res.end(data);
    });
}

var app = require('http').createServer(handler)
var io = require('socket.io')(app, {
  origins: '*:*'
});
var fs = require('fs');

var timeLeft = 120000; // TODO reset this at some time
var timerChannel = io
  .of('/timer')
  .on('connection', function(socket) {
    var time = setInterval(function() {
      timeLeft -= 1000
      if (timeLeft > 0) {
        socket.broadcast.emit('ping', timeLeft);
      } else {
        clearInterval(time);
        socket.broadcast.emit('timeover');
      }
    }, 1000);
  });

var players = [];
var gameChannel = io
  .of('/game')
  .on('connection', function(socket) {
    var userId = UUID();
    if (players.length <= 4) {
      players.push(userId);
      socket.emit('userId', userId);
      console.log(players);
    } else {
      socket.emit('fullRoom');
    }

    // disconnect
    socket.on('disconnect', function() {
      players = players.filter(function (id) {
        return id !== userId;
      });

      console.log('\t socket.io:: client disconnected ' + userId);
    });
  })


// TODO set timeInterval to spread the players positions

app.listen(3000);
