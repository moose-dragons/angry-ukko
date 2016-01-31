window.onload = function() {
    var game = new Phaser.Game(1280, 720, Phaser.AUTO, 'game', 
                               { preload: preload, create: create, update: update });

    function preload() {
        game.load.image('bg', './assets/img/lankut_tausta_2.png');
        game.load.image('sbg','./assets/img/texture_3.png');
        game.load.image('dude', './assets/temp/bombtiles.jpg');
        game.load.spritesheet("character", "assets/sprites/char1_spritesheet2b.png", 32, 32);
        game.load.image("projectile", "assets/img/block_neutral_2.png");
        game.load.image("ukkoback", "assets/img/puzzle_board_1.png");
        game.load.spritesheet(
            'hourglass', './assets/sprites/hourglass_spritesheet_1.png',150, 450, 11);
        game.load.spritesheet("ukko", './assets/sprites/ukko_spritesheet_2.png', 213, 84, 8);
        
        game.ritualIsComplete = ritualIsComplete;
        game.cleared = complete;
    }
    
    var dude;
    
    var block;
    var cursors;
    var customBounds;
    var blocks;
    
    var winningRitual = [];
    
    function create() {
        //Backgrounds
        var bigbg = game.add.sprite(0,0, 'bg');
        var smallbg = game.add.sprite(320, 40, 'sbg');
        var ukkobg = game.add.sprite(1013, 41, 'ukkoback');
        // Ukko
        var ukko = game.add.sprite(1019, 40, 'ukko');
        var perkele = ukko.animations.add('perkele');
        ukko.animations.play('perkele', 3, true);
        
        //Hourglass
        var hglass = game.add.sprite(85, 135, 'hourglass');
        var timeout = hglass.animations.add('timeout');
        hglass.animations.play('timeout', 11/120, false);
        
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
        
        //  Create a new custom sized bounds, within the world bounds
        customBounds = game.add.group();
        createPreviewBounds(bounds.x, bounds.y, bounds.width, bounds.height);
        
        cursors = game.input.keyboard.createCursorKeys();
        
        blocks = game.add.group();
        Phaser.ggj.setAllObjects(blocks);
        /*
        block = Phaser.ggj.getBlock(game, "block1", 400, 500);
        blocks.add(block);
        block = Phaser.ggj.getBlock(game, "block1", 450, 550);
        blocks.add(block);
        */
        var places = shuffleBlocks(20, 19, false);
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
        makeRitual(10);
        displayRitual();
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

    
    function update(){
        game.physics.arcade.collide(dude, customBounds);
        game.physics.arcade.collide(dude, blocks, function(character, block) {
          character.ggj.touching = block;
        });
        dude.update();
        block.update();
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
    
    function makeRitual(tiles, types){
        winningRitual = shuffleBlocks(tiles, 7, false);
    }
    
    
    function ritualIsComplete(){
        var ritual = false;
        for(var i = 0; i < winningRitual.length; i++){
            ritual = true;
            var x = 512 + winningRitual[i].x * 32;
            var y = 232 + winningRitual[i].y * 32;
            var blockarray = game.physics.arcade.getObjectsAtLocation(x, y, blocks);
            if(blockarray.length < 1){
                ritual = false;
                break;
            }
        }
        return ritual;
    }
    
    function complete(){
        console.log("Ritual complete!");
    }
    
    function displayRitual(){
        var mx = 1048;
        var my = 154;
        for(var i = 0; i < winningRitual.length; i++){
            var x = mx + winningRitual[i].x*32*0.609375;
            var y = my + winningRitual[i].y*32*0.609375;
            var p = game.add.sprite(x, y, 'projectile');
            p.scale.setTo(0.609375, 0.609375);
        }
    }
};