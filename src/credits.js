
credits = function() {

};

credits.prototype = {
    preload: function() {
        game.load.image('credits', 'assets/credits1.png');
        game.load.image('back', 'assets/img/play_1.png');
    },
    create: function() {
        
        var image1 = game.add.sprite(255, 140, 'credits');
        image1.anchor.set(0.5);
        
        var image2 = game.add.sprite(game.world.centerX - 270, game.world.centerY + 130, 'back');
        image1.anchor.set(0.2);
        image2.scale.setTo(-0.3, 0.3);

        image2.inputEnabled = true;
        image2.events.onInputDown.add(function(){
          game.state.start("mainmenu");
        });
                
    },
    update: function() {
    }
};
