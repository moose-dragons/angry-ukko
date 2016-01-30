(function() {
  var directions = {
          right:  {x: 1, y: 0, frame: 1},
          left:   {x: -1, y: 0, frame: 1},
          up:     {x: 0, y: -1, frame: 3},
          down:   {x: 0, y: 1, frame: 5}
        };
  var speed = 150;
  
  Phaser.ggj = {
      setSpeed: function(newSpeed) {
        speed = newSpeed;
      }
  };
	Phaser.ggj.getCharacter = function(game, name, cursors, x, y) {
      var character = game.add.sprite(x, y, "character");
      character.anchor.setTo(.5,.5);
      character.animations.add("walk", [0,1], 5, true);
      character.animations.add("walkup", [3,4], 5, true);
      character.animations.add("walkdown", [5,6], 5, true);
      
      character.ggj = {};
      character.ggj.flipped = false;
      character.ggj.cursors = cursors;
      character.ggj.name = name;
      character.ggj.destinationDirection;
      character.ggj.direction = directions["right"];
      game.physics.arcade.enable(character);
      character.body.collideWorldBounds = true;
      
      character.update = function() {
        if(character.ggj.destination) {
          var destination = character.ggj.destination;
          if(game.physics.arcade.distanceToXY(character, destination.x, destination.y) > 4) {
            character.frame = directions[character.ggj.destinationDirection].frame;
            game.physics.arcade.moveToXY(character, destination.x, destination.y);
          } else {
            character.body.velocity.x = 0;
            character.body.velocity.y = 0;
            delete character.ggj.destination;
            delete character.ggj.touching;
          }
        } else{
          if(character.ggj.cursors.action.isDown && character.ggj.touching) {
            var block = character.ggj.touching;
            if (character.ggj.cursors.left.isDown) {
              character.destination("left");
              block.destination("left");
            } else if (character.ggj.cursors.right.isDown) {
              character.destination("right");
              block.destination("right");
            } else if (character.ggj.cursors.up.isDown) {
              character.destination("up");
              block.destination("up");
            } else if (character.ggj.cursors.down.isDown) {
              character.destination("down");
              block.destination("down");
            }
          } else {
            character.body.velocity.x = 0;
            character.body.velocity.y = 0;
            if (cursors.left.isDown) {
              if(!character.ggj.flip) {
                character.ggj.flip = true;
                character.scale.x *= -1;
              }
              character.animations.play("walk");
              character.body.velocity.x = -speed;
              character.ggj.direction = directions["left"];
              character.ggj.touching = false;
            } else if (cursors.right.isDown) {
              if(character.ggj.flip) {
                character.ggj.flip = false;
                character.scale.x *= -1;
              }
                character.animations.play("walk");
                character.body.velocity.x = speed;
                character.ggj.direction = directions["right"];
                character.ggj.touching = false;
            } else if (cursors.up.isDown) {
                character.animations.play("walkup");
                character.body.velocity.y = -speed;
                character.ggj.direction = directions["up"];
                character.ggj.touching = false;
            } else if (cursors.down.isDown) {
                character.animations.play("walkdown");
                character.body.velocity.y = speed;
                character.ggj.direction = directions["down"];
                character.ggj.touching = false;
            } else {
                character.animations.stop();
            }
          }
        }
      }
      character.destination = function(direction) {
        var dir = directions[direction];
        var destination = {};
        destination.x = character.x + (64 * directions[direction].x);
        destination.y = character.y + (64 * directions[direction].y);
        character.ggj.destination = destination;
        character.ggj.destinationDirection = direction;
      }
      
      return character;
    };
  Phaser.ggj.getCreature = function(game, name) {
      var creature = game.add.sprite(250, 250, "spiky");
      creature.scale.setTo(0.1);
      
      game.physics.arcade.enable(creature);
      creature.body.collideWorldBounds = true;
      creature.body.immovable = true;
      
      creature.ggj = {};
      creature.ggj.movementLength = 32;
      creature.ggj.movementStartX = creature.x + creature.ggj.movementLength;
      creature.ggj.movementStartY = creature.y + creature.ggj.movementLength;
      creature.ggj.currentDirection = directions["right"];
      
      creature.update = function() {
        if(game.physics.arcade.distanceToXY(creature, creature.ggj.movementStartX, creature.ggj.movementStartY) > creature.ggj.movementLength) {
          var random = Math.random();
          if(random < 0.25) {
            creature.ggj.currentDirection = directions["right"];
          } else if(random < 0.5) {
            creature.ggj.currentDirection = directions["left"];
          } else if(random < 0.75) {
            creature.ggj.currentDirection = directions["up"];
          } else {
            creature.ggj.currentDirection = directions["down"];
          }
          creature.ggj.movementStartX = creature.x;
          creature.ggj.movementStartY = creature.y;
          creature.body.velocity.x = 50 * creature.ggj.currentDirection.x;
          creature.body.velocity.y = 50 * creature.ggj.currentDirection.y;
        }
      };
      return creature;
    };
    Phaser.ggj.getBlock = function(game, name, x, y) {
      var block = game.add.sprite(x, y, "projectile");
      game.physics.arcade.enable(block);
      block.body.immovable = true;

      block.ggj = {};
      
      block.destination = function(direction) {
        var dir = directions[direction];
        var destination = {};
        destination.x = block.x + (64 * directions[direction].x);
        destination.y = block.y + (64 * directions[direction].y);
        block.ggj.destination = destination;
      }
      
      block.update = function() {


        if(block.ggj.destination) {
          var destination = block.ggj.destination;
          if(block.x !== destination.x || block.y !== destination.y) {
            game.physics.arcade.moveToXY(block, destination.x, destination.y);
          } else {
            block.body.velocity.x = 0;
            block.body.velocity.y = 0;
            delete block.ggj.destination;
          }
        }
      }
      
      return block;
    };
    Phaser.ggj.getTrigger = function(game, name, x, y) {
      var trigger = game.add.sprite(x, y, null);
      game.physics.enable(trigger, Phaser.Physics.ARCADE);
      
      trigger.body.setSize(0, 0, 64, 64);
      
      return trigger;
    };
})();
