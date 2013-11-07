var game = new Phaser.Game(
                    800, 600, 
                    Phaser.AUTO, '', 
                    { 
                        preload: preload, 
                        create: create, 
                        update: update 
                    }
            );

//game variables
var sprite, group, txtScore;

//load in game assets
function preload() {
//    game.load.atlasJSONHash('inch', 
//                            'assets/inchy.png', 
///                            'assets/inchy.json')
    game.load.atlasJSONHash('inch',
                            'assets/sprites.png',
                            'assets/sprites.js');
    game.load.image("hairball", "assets/hairball.png")
}

//setup game entities
function create() {
    //protagonist
    sprite = game.add.sprite(0, 0, 'inch');
    sprite.animations.add('idle');
    sprite.animations.play('idle', 60, true);
    sprite.anchor.setTo(.5, 0); //center flip area
    sprite.body.collideWorldBounds = true;
    
    //add text
     var style = { font: "30px Arial", fill: "#FFFF00", fontWeight: "bold", align: "center" };
    txtScore = game.add.text(0, 0, "0", style);
    
    group = game.add.group();
    //stuff
    for(var i = 0; i < 3; i++) {
        var ball = group.create(i*100,0, "hairball");
        ball.acceleration.y = 100;
        ball.body.collideWorldBounds = true;
    }
}

//game logic, ~30 fps
function update() {
    
    //add new thingy 
    if(Math.random() < .05) {
         var ball = group.create(Math.random() * 500,0, "hairball");
        ball.acceleration.y = 100;
        ball.body.collideWorldBounds = true;
    }
    
    group.forEach(function(hb) {
        if(hb.y > 500) {
            hb.kill();
            //game over
        }
    })
    
    //add one to score
    var score = txtScore.text;
    score ++;
    txtScore.text = score.toString();
    
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
    
    //check for collision with hairball
    game.physics.collide(
         sprite, 
         group, 
         collisionHandler, 
         null, 
         this
    );
    
} //end update function

function collisionHandler(protagonist, hairball) {
    hairball.kill();   
}