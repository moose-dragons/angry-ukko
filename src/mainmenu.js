
mainmenu = function() {

};

mainmenu.prototype = {
    preload: function() {
        game.load.image('tausta', 'assets/img/opening_menu.png');
        game.load.image('play_1', 'assets/img/play_1.png');
        game.load.image('menu_1', 'assets/img/menu_1.png');
        game.load.image('bg', './assets/img/lankut_tausta_2.png');
        game.load.image('sbg','./assets/img/texture_3.png');
        //game.load.image('dude', './assets/temp/bombtiles.jpg');
        game.load.spritesheet("character1", "assets/sprites/char1_spritesheet2b.png", 32, 32);
        game.load.spritesheet("character2", "assets/sprites/char2_spritesheet2b.png", 32, 32);
        game.load.image("projectile", "assets/img/block_green2.png");
        game.load.image("ukkoback", "assets/img/puzzle_board_1.png");
        game.load.spritesheet(
            'hourglass', './assets/sprites/hourglass_spritesheet_1.png',150, 450, 11);
        game.load.spritesheet("ukko", './assets/sprites/ukko_spritesheet_2.png', 213, 84, 8);
        game.load.image('ritual1', './assets/img/puzzle_1b.png');
        game.load.image('win', './assets/win_screen.png');
        game.load.image('end', './assets/img/game_over_1.png');

        game.load.spritesheet("targetRitual", "assets/sprites/puzzle_spritesheet_1.png", 155, 157);
        //sounds
        game.load.audio('themesong', './assets/audio/theme_song.mp3');
        game.load.audio('finalSeconds', './assets/audio/game_over.mp3');
        game.load.audio('blockForward', './assets/audio/block_forward.mp3');
        game.load.audio('blockBackward', './assets/audio/block_backward.mp3');
        game.load.audio('muahaha', './assets/audio/insane_muahaha.mp3');
    },
    create: function() {

        var image1 = game.add.sprite(game.world.centerX, game.world.centerY, 'tausta');
        image1.anchor.set(0.5);
        var image2 = game.add.sprite(game.world.centerX - 150, game.world.centerY + 200, 'play_1');
        image2.anchor.set(0.5);
        image2.scale.setTo(0.3, 0.3);
        var image3 = game.add.sprite(game.world.centerX + 150, game.world.centerY + 200, 'menu_1');
        image3.anchor.set(0.5);
        image3.scale.setTo(0.3, 0.3);

        image2.inputEnabled = true;
        image2.events.onInputDown.add(function(){
          game.state.start("playfield");
        });

        image3.inputEnabled = true;
        image3.events.onInputDown.add(function(){
          game.state.start("credits");
        });

    },
    update: function() {
    }
};
