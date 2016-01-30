window.onload = function() {
    var game = new Phaser.Game(1280, 720, Phaser.AUTO, 'game', 
                               { preload: preload, create: create, update: update });

    function preload() {
        game.load.image('bg', './assets/temp/bg.png');
        game.load.image('sbg','./assets/temp/sbg.png');
        game.load.image('dude', './assets/temp/bombtiles.jpg');
        game.load.spritesheet("character", "assets/sprites/char1_spritesheet2b.png", 32, 32);
        game.load.image("projectile", "assets/img/block_neutral_1.png");
        game.load.spritesheet(
            'hourglass', './assets/sprites/hourglass_spritesheet_1.png',150, 450, 11);
    }
    
    var dude;
    
    var block;
    var cursors;
    var customBounds;
    var blocks;
    
    function create() {
        //Backgrounds
        var bigbg = game.add.sprite(0,0, 'bg');
        var smallbg = game.add.sprite(320, 40, 'sbg');
        
        //Hourglass
        var hglass = game.add.sprite(85, 135, 'hourglass');
        var timeout = hglass.animations.add('timeout');
        hglass.animations.play('timeout', 0.1, false);
        
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
                                        'action': Phaser.KeyCode.SPACEBAR }), 500,200);
        game.physics.arcade.enable(dude);
        //  Modify a few body properties

        
        customBounds = game.add.group();
        
        //  Create a new custom sized bounds, within the world bounds
        createPreviewBounds(bounds.x, bounds.y, bounds.width, bounds.height);
        
        cursors = game.input.keyboard.createCursorKeys();
        
        blocks = game.add.group();
        /*
        block = Phaser.ggj.getBlock(game, "block1", 400, 500);
        blocks.add(block);
        block = Phaser.ggj.getBlock(game, "block1", 450, 550);
        blocks.add(block);
        */
        var places = shuffleBlocks(20, 20, false);
        for(var i = 0; i< places.length; i++){
            var topmargin = 40;
            var leftmargin = 320;
            var x = leftmargin + places[i].x*32;
            var y = topmargin + places[i].y*32;
            block = Phaser.ggj.getBlock(game, "block1", x, y);
            blocks.add(block);
        }
    }

    function createPreviewBounds(x, y, w, h) {
        
        
        var rright = game.add.sprite(x+w,y);
        game.physics.enable(rright, Phaser.Physics.ARCADE);
        rright.body.setSize(1,h);
        rright.body.immovable = true;
        rright.visible = false;
        customBounds.add(rright);
        
        var ttop = game.add.sprite(x,y);
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
        
        var lleft = game.add.sprite(x,y);
        game.physics.enable(lleft, Phaser.Physics.ARCADE);
        lleft.body.setSize(1,h);
        lleft.body.immovable = true;
        lleft.visible = false;
        customBounds.add(lleft);
    }

    
    function update(){
        game.physics.arcade.collide(dude, customBounds);
        game.physics.arcade.collide(dude, blocks, function(character, block) {
          character.ggj.touching = block;
        });
        dude.update();
        block.update();

        
     /*   dude.body.velocity.x = 0;
        dude.body.velocity.y = 0;
        game.physics.arcade.collide(dude, customBounds,function(a, b) {
        console.log(a, b)
        });
        if (cursors.left.isDown){
            dude.body.velocity.x = -500;
        }else if (cursors.right.isDown){
            dude.body.velocity.x = 500;
        }

        if (cursors.up.isDown)
        {
            dude.body.velocity.y = -500;
        }
        else if (cursors.down.isDown)
        {
            dude.body.velocity.y = 500;
        }*/
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
                console.log('x+y' + x + '.'+ y);
            }while (isPlaceReserved(x, y, shuffled));

            block.x = x;
            block.y = y;
            shuffled.push(block);
            
        }
        
        function isPlaceReserved(x, y, shuffled) {
            console.log(shuffled);
            for (var j = 0; j < shuffled.length; j++) {
                if (x == shuffled[j].x && y == shuffled[j].y) {
                    return true;
                }
            }
            return false;
        }
        
        return shuffled;
    }
};