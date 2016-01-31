
mainmenu = function() {

};

mainmenu.prototype = {
    preload: function() {
        game.load.image('tausta', 'assets/img/lankut_tausta_3.png');
        game.load.image('play_1', 'assets/img/play_1.png');
        game.load.image('menu_1', 'assets/img/menu_1.png');
        
    },
    create: function() {

        var image1 = game.add.sprite(game.world.centerX, game.world.centerY, 'tausta');
        image1.anchor.set(0.5);
        var image2 = game.add.sprite(game.world.centerX - 150, game.world.centerY + 100, 'play_1');
        image2.anchor.set(0.5);
        image2.scale.setTo(0.3, 0.3);
        var image3 = game.add.sprite(game.world.centerX + 150, game.world.centerY + 100, 'menu_1');
        image3.anchor.set(0.5);
        image3.scale.setTo(0.3, 0.3);

        image2.inputEnabled = true;
        image2.events.onInputDown.add(function(){
          game.state.start("playfield");
        });

        image3.inputEnabled = true;
        image3.events.onInputDown.add(function(){alert('credits!');});

    },
    update: function() {
    }
};
