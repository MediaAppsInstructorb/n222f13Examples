var game = new Phaser.Game(
                    800, 600, 
                    Phaser.AUTO, '', 
                    { 
                        preload: preload, 
                        create: create, 
                        update: update 
                    }
            );

var sprite;

//load in game assets
function preload() {
//    game.load.atlasJSONHash('inch', 
//                            'assets/inchy.png', 
///                            'assets/inchy.json')
    game.load.atlasJSONHash('inch',
                            'assets/sprites.png',
                            'assets/sprites.js');
}

//setup game entities
function create() {
    sprite = game.add.sprite(0, 0, 'inch');
    sprite.animations.add('idle');
    sprite.animations.play('idle', 60, true);
    sprite.anchor.setTo(.5, 0); //center flip area
}

//game logic, ~30 fps
function update() {
    
    if (game.input.keyboard.isDown(Phaser.Keyboard.LEFT))
    {
        sprite.x -= 4; //move left
        sprite.scale.x = -1; //face left
    }
    else if (game.input.keyboard.isDown(Phaser.Keyboard.RIGHT))
    {
        sprite.x += 4; //move right
        sprite.scale.x = 1; //face right
    }
    
}