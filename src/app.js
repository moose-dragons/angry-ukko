
window.onload = function() {
    
        var game = new Phaser.Game(800, 600, Phaser.AUTO, 'game', { preload: preload, create: create, update: update });


        function preload() {
            game.load.image('logo', './assets/img/phaser.png');
            console.error("errrg");
        }

        function create() {
            var logo = game.add.sprite(game.world.centerX, game.world.centerY, 'logo');
            logo.anchor.setTo(0.5, 0.5);
            console.error("somethinG");
        }
    function update(){
        
    }
};