window.onload = function() {
    var game = new Phaser.Game(1280, 720, Phaser.AUTO, 'game', 
                               { preload: preload, create: create, update: update });

    function preload() {
        game.load.image('bg', './assets/temp/bg.png');
        game.load.image('sbg','./assets/temp/sbg.png');
        game.load.image('dude', './assets/temp/bombtiles.jpg');
    }
    
    var dude;
    var cursors;
    var customBounds;
    
    function create() {
        //Backgrounds
        var bigbg = game.add.sprite(0,0, 'bg');
        var smallbg = game.add.sprite(320, 40, 'sbg');
        
        //  The bounds of our physics simulation
        var bounds = new Phaser.Rectangle(320, 40, 640, 640);
        //	Enable arcade physics
        game.physics.startSystem(Phaser.Physics.ARCADE);

        dude = game.add.sprite(500, 500, 'dude');
        game.physics.arcade.enable(dude);
        //  Modify a few body properties
        dude.body.fixedRotation = true;
        
        customBounds = game.add.group();
        //  Create a new custom sized bounds, within the world bounds
        createPreviewBounds(bounds.x, bounds.y, bounds.width, bounds.height);
        
        cursors = game.input.keyboard.createCursorKeys();
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
        dude.body.velocity.x = 0;
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
        }
    }
};