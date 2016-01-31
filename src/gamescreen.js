(function() {
    //var game = new Phaser.Game(1280, 720, Phaser.AUTO, 'game',  { preload: preload, create: create, update: update });

  var dude, dude2;

  var block;
  var cursors;
  var customBounds;
  var blocks;
  var hglass, themesong, finalSeconds;

  var winningRitual = [];

  var puzzleTable = [8,9,0,1,2,3,4,5,6,7];

  Phaser.ggj.playfield = function() {

  };
  Phaser.ggj.playfield.prototype = {
       create: function() {
        //Backgrounds
        var bigbg = game.add.sprite(0,0, 'bg');
        var smallbg = game.add.sprite(320, 40, 'sbg');
        var ukkobg = game.add.sprite(1013, 41, 'ukkoback');
        // Ukko
        var ukko = game.add.sprite(1019, 40, 'ukko');
        var perkele = ukko.animations.add('perkele');

        // Hourglass + Ukko Animation Control
        hglass = game.add.sprite(85, 135, 'hourglass');
        var timeout = hglass.animations.add('timeout');
        timeout.enableUpdate = true;
        timeout.onUpdate.add(function(anim, frame) {

          if(frame.index == 3) {
            muahaha.play()
            ukko.animations.add('perkele', [0], true);
            ukko.animations.play('perkele');
          }

          if(frame.index == 6) {
            ukko.animations.add('perkele', [0,1,2], true);
            ukko.animations.play('perkele');
          }

          if(frame.index == 7) {
            muahaha.play()
            ukko.animations.add('perkele', [0,1,2,3], true);
            ukko.animations.play('perkele');
          }

          if(frame.index == 8) {
            ukko.animations.add('perkele', [0,1,2,3,4,5], true);
            ukko.animations.play('perkele');
          }

          if(frame.index == 9) {
            ukko.animations.add('perkele', [2,3,4,5,6,7], true);
            ukko.animations.play('perkele');
          }

          if(frame.index == 10) {
            finalSeconds.play();
          }
        }, this);

        hglass.animations.play('timeout', 13/120, false);
        hglass.animations.currentAnim.onComplete.add(function(e) {
          var end = game.add.sprite(640, 360, 'end');
          end.anchor.setTo(0.5,0.5);
          game.input.keyboard.onUpCallback = function() {
                delete game.input.keyboard.onUpCallback;
                game.state.start("mainmenu");
            };
        });

        //  The bounds of our physics simulation
        var bounds = new Phaser.Rectangle(320, 40, 640, 640);
        //	Enable arcade physics
        game.physics.startSystem(Phaser.Physics.ARCADE);

        dude = Phaser.ggj.getCharacter(game, "player1",
                                       game.input.keyboard.addKeys({
                                        'up':   Phaser.KeyCode.UP,
                                        'down': Phaser.KeyCode.DOWN,
                                        'left': Phaser.KeyCode.LEFT,
                                        'right': Phaser.KeyCode.RIGHT,
                                        'action': Phaser.KeyCode.SPACEBAR }), 500,200, "character1");

        dude2 = Phaser.ggj.getCharacter(game, "player2",
                                       game.input.keyboard.addKeys({
                                        'up':   Phaser.KeyCode.W,
                                        'down': Phaser.KeyCode.S,
                                        'left': Phaser.KeyCode.A,
                                        'right': Phaser.KeyCode.D,
                                        'action': Phaser.KeyCode.E }), 500,300, "character2");


        //  Create a new custom sized bounds, within the world bounds
        customBounds = game.add.group();
        createPreviewBounds(bounds.x, bounds.y, bounds.width, bounds.height);

        // Audio loading and decoding
        themesong = game.add.audio('themesong');
        finalSeconds = game.add.audio('finalSeconds');
        muahaha = game.add.audio('muahaha');
        game.sound.setDecodedCallback([ themesong, finalSeconds, muahaha ], startMusic, this);

        cursors = game.input.keyboard.createCursorKeys();

        blocks = game.add.group();
        Phaser.ggj.setAllObjects(blocks);
        /*
        block = Phaser.ggj.getBlock(game, "block1", 400, 500);
        blocks.add(block);
        block = Phaser.ggj.getBlock(game, "block1", 450, 550);
        blocks.add(block);
        */
        var places = shuffleBlocks(35, 19, false);
        /*for(var f = 0; f < 20; f++){
            var b={};
            b.x = f;
            b.y = f;
            places.push(b);
        }*/
        for(var i = 0; i< places.length; i++){
            var topmargin = 40 + 16;
            var leftmargin = 320 + 16;
            var x = leftmargin + places[i].x*32;
            var y = topmargin + places[i].y*32;
            block = Phaser.ggj.getBlock(game, "block1", x, y);
            block.anchor.setTo(.5, .5);
            blocks.add(block);
        }

        // Creating ritual for clearing the level
        makeRitual();
        displayRitual();
        game.puzzleIndex++;
   //     var ritualDrawing = game.add.sprite(1055, 160, 'ritual1');
    },
   update: function() {
        game.physics.arcade.collide(dude, customBounds);
        game.physics.arcade.collide(dude, dude2, function(character) {
          delete character.ggj.destination;
        });
        game.physics.arcade.collide(dude, blocks, function(character, block) {
          delete character.ggj.destination;
          character.ggj.touching = block;
        });
        game.physics.arcade.collide(dude2, customBounds);
        game.physics.arcade.collide(dude2, blocks, function(character, block) {
          delete character.ggj.destination;
          character.ggj.touching = block;
        });
        //dude.update();
        //block.update();
    },
    preload: function() {
        game.ritualIsComplete = ritualIsComplete;
        game.complete = complete;
    }
  }

  function createPreviewBounds(x, y, w, h) {
      var rright = game.add.sprite(x+w,y);
      game.physics.enable(rright, Phaser.Physics.ARCADE);
      rright.body.setSize(1,h);
      rright.body.immovable = true;
      rright.visible = false;
      customBounds.add(rright);

      var ttop = game.add.sprite(x,y-1);
      game.physics.enable(ttop, Phaser.Physics.ARCADE);
      ttop.body.setSize(w,1);
      ttop.body.immovable = true;
      ttop.visible = false;
      customBounds.add(ttop);

      var bbb = game.add.sprite(x,y+h);
      game.physics.enable(bbb, Phaser.Physics.ARCADE);
      bbb.body.setSize(w,1);
      bbb.body.immovable = true;
      bbb.visible = false;
      customBounds.add(bbb);

      var lleft = game.add.sprite(x-1,y);
      game.physics.enable(lleft, Phaser.Physics.ARCADE);
      lleft.body.setSize(1,h);
      lleft.body.immovable = true;
      lleft.visible = false;
      customBounds.add(lleft);
  }

  function shuffleBlocks(num, dimen, different){
      var shuffled = [];
      var rnd = function(max){
          return Math.floor(Math.random() * (max + 1));
      }
      for (var i = 0; i < num; i++) {
          var block = {};
          do {
              var x = rnd(dimen);
              var y = rnd(dimen);
          }while (isPlaceReserved(x, y, shuffled));

          block.x = x;
          block.y = y;
          shuffled.push(block);
      }

      function isPlaceReserved(x, y, shuffled) {
          for (var j = 0; j < shuffled.length; j++) {
              if (x == shuffled[j].x && y == shuffled[j].y) {
                  return true;
              }
          }
          return false;
      }

      return shuffled;
  }

  function makeRitual(){
      //winningRitual = shuffleBlocks(tiles, 7, false);
      winningRitual = UKKO.rituals[puzzleTable[game.puzzleIndex]];
  }


  function ritualIsComplete(){
      var ritual = false;
      for(var i = 0; i < winningRitual.length; i++){
          ritual = true;
          var x = 512 + winningRitual[i].x * 32+10;
          var y = 232 + winningRitual[i].y * 32+10;
          var blockarray = game.physics.arcade.getObjectsAtLocation(x, y, blocks);
          if(blockarray.length < 1){
              ritual = false;
              break;
          }
      }
      return ritual;
  }

  function complete(){
      dude.kill();
      dude2.kill();
      var end = game.add.sprite(640, 360, 'win');
      end.anchor.setTo(0.5,0.5);
      hglass.animations.stop();

      game.input.keyboard.onUpCallback = function() {
        delete game.input.keyboard.onUpCallback;
        game.state.start("playfield");
      };
  }

  function displayRitual(){
      var mx = 1044;
      var my = 154;
      var p = game.add.sprite(mx,my, 'targetRitual');
      p.frame = puzzleTable[game.puzzleIndex];
  }

  function startMusic() {
    themesong.play();
    themesong.volume -= 0.5;
  }

})();
