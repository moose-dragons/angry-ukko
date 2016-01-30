// TIMER EVENTS
var timer = io.connect('http://localhost:3000/timer');

timer.on('ping', function(timeLeft) {
  console.log("time left:" + timeLeft);
})

timer.on('timeover', function() {
  console.log("timeover");
  timer.disconnect();
})
