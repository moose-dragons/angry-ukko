window.onload = function() {
        
        Phaser.ggj.setSpeed(150);
        
        var player1, player2, enemy1, block, players, blocks, creatures, trigger;
        var game = new Phaser.Game(800, 600, Phaser.AUTO, 'game', { preload: preload, create: create, update: update });


        function preload() {
          game.load.spritesheet("character", "assets/char_1_spritesheet_1.png", 64, 64);
          game.load.spritesheet("projectile", "assets/img/rock.png", 64, 64);
          game.load.image("spiky", "assets/creatures/spiky.png");
          game.load.image('logo', './assets/img/phaser.png');

          
          players = game.add.group();
          creatures = game.add.group();
          blocks = game.add.group();
        }

        function create() {
            var logo = game.add.sprite(game.world.centerX, game.world.centerY, 'logo');
            logo.anchor.setTo(0.5, 0.5);
          
  
            game.physics.startSystem(Phaser.Physics.ARCADE);
            player1 = Phaser.ggj.getCharacter(game, "player1", game.input.keyboard.addKeys({ 'up': Phaser.KeyCode.UP, 'down': Phaser.KeyCode.DOWN, 'left': Phaser.KeyCode.LEFT, 'right': Phaser.KeyCode.RIGHT, 'action': Phaser.KeyCode.SPACEBAR }));
            player1.tint = Math.random() * 0xffffff;
            
            players.add(player1);
            
            creature = Phaser.ggj.getCreature(game, "enemy1");
            creatures.add(creature);
              
              
            block = Phaser.ggj.getBlock(game, "block1");
            blocks.add(block);
            
        }
      function update(){
            game.physics.arcade.collide(players);
            game.physics.arcade.collide(players, creatures);
            game.physics.arcade.collide(players, blocks, function(character, block) {
              character.ggj.touching = block;
            });
            
            player1.update();
            
            creature.update();
            
            block.update();
      }

};
