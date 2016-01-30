window.onload = function() {
    var game = new Phaser.Game(1280, 720, Phaser.AUTO, 'game', 
                               { preload: preload, create: create, update: update });

    function preload() {
        game.load.image('bg', './assets/img/phaser.png');
        game.load.image('dude', './assets/temp/bombtiles.jpg');
    }
    
    var dude;
    var cursors;
    var customBounds;
    
    function create() {
        //  The bounds of our physics simulation
        var bounds = new Phaser.Rectangle(320, 40, 640, 640);
        //	Enable p2 physics
        game.physics.startSystem(Phaser.Physics.P2JS);
        
        var logo = game.add.sprite(game.world.centerX, game.world.centerY, 'bg');
        logo.anchor.setTo(0.5, 0.5);
        dude = game.add.sprite(500, 500, 'dude');
        game.physics.p2.enable(dude);
        //  Modify a few body properties
        dude.body.collideWorldBounds = true;
        dude.body.setZeroDamping();
        dude.body.fixedRotation = true;
        
        //  Create a new custom sized bounds, within the world bounds
        customBounds = { left: null, right: null, top: null, bottom: null };
        createPreviewBounds(bounds.x, bounds.y, bounds.width, bounds.height);
        
        //  Just to display the bounds
        var graphics = game.add.graphics(bounds.x, bounds.y);
        graphics.lineStyle(4, 0xffd900, 1);
        graphics.drawRect(0, 0, bounds.width, bounds.height);
        
        cursors = game.input.keyboard.createCursorKeys();
    }
    
    function createPreviewBounds(x, y, w, h) {
        var sim = game.physics.p2;

        //  If you want to use your own collision group then set it here and un-comment the lines below
        var mask = sim.boundsCollisionGroup.mask;

        customBounds.left = new p2.Body({ mass: 0, position: [ sim.pxmi(x), sim.pxmi(y) ], 
                                         angle: 1.5707963267948966 });
        customBounds.left.addShape(new p2.Plane());
        // customBounds.left.shapes[0].collisionGroup = mask;

        customBounds.right = new p2.Body({ mass: 0, position: [ sim.pxmi(x + w), sim.pxmi(y) ], 
                                          angle: -1.5707963267948966 });
        customBounds.right.addShape(new p2.Plane());
        // customBounds.right.shapes[0].collisionGroup = mask;

        customBounds.top = new p2.Body({ mass: 0, position: [ sim.pxmi(x), sim.pxmi(y) ], 
                                        angle: -3.141592653589793 });
        customBounds.top.addShape(new p2.Plane());
        // customBounds.top.shapes[0].collisionGroup = mask;

        customBounds.bottom = new p2.Body({ mass: 0, position: [ sim.pxmi(x), sim.pxmi(y + h) ] });
        customBounds.bottom.addShape(new p2.Plane());
        // customBounds.bottom.shapes[0].collisionGroup = mask;

        sim.world.addBody(customBounds.left);
        sim.world.addBody(customBounds.right);
        sim.world.addBody(customBounds.top);
        sim.world.addBody(customBounds.bottom);
    }

    
    function update(){
        dude.body.setZeroVelocity();
        if (cursors.left.isDown){
            dude.body.moveLeft(500);
        }else if (cursors.right.isDown){
            dude.body.moveRight(500);
        }

        if (cursors.up.isDown)
        {
            dude.body.moveUp(500);
        }
        else if (cursors.down.isDown)
        {
            dude.body.moveDown(500);
        }
    }
};