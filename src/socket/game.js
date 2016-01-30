// GAME Events
var playerId = ""
var game = io.connect('http://localhost:3000/game');
game.on("connect", function() {
  console.log("game: asking for room");
});

game.on("disconnect", function() {
  console.log("game: disconnect");
});

game.on("fullRoom", function() {
  console.log("game: no room");
});

game.on("userId", function(userId) {
  playerId = userId;
  console.log("game: you have your spot: " + playerId);
});
