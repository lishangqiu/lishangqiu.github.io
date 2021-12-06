class Game extends Phaser.Scene{
    constructor(){
        super();
    }

    preload(){
        // load stuff soon
        this.load.image('background', 'assets/GravityGame/background.jpg');
        this.load.image("Earth", "assets/GravityGame/earth.png");
        this.load.image("Sun", "assets/GravityGame/sun.png");
    }

    create(){
        var bg = this.add.image(960, 468.5, "background");

        this.createBody(0, 0, 0, 0, 69.34e6, 1.989e30, "Sun", "Sun");
        this.createBody(149e9, 0, 0, -30000, 6.73e6, 5.972e24, "Earth", "Earth");
        this.createBody(-180e9, 0, 0, -25000, 20.34e6, 1.989e29, "Sun", "AnotherStar");

        this.add.text(20, 10, "Scale: 5x10^10 meters/pixel\nTime Scale: Each second in simulation = 1000000 in real life\nRadius are upscaled by: 500x for visibility\n");

        this.add.graphics(this);
    }

    update(){
        GravityBodies.forEach(function(item, index, array) {
            item.drawNewPos();
        });
    }

    createBody(posX, posY, velocityX, velocityY, radius, mass, textureName, name){
        const config = {
            starting_pos : new Victor(posX, posY),
            starting_velocity : new Victor(velocityX, velocityY),
            radius : radius,
            mass : mass,
            sceneObj : this,
            textureName : textureName,
            name: name,
        };
        GravityBodies.push(new GravityBody(config));
    }
}

const config = {
    parent: "game",
    type: Phaser.AUTO,
    scale: {
        mode: Phaser.Scale.RESIZE,
        autoCenter: Phaser.Scale.CENTER_BOTH,
    },
    width: 1920,
    height: 937,
    backgroundColor: "#FF0000",
    scene: [Game]
}

var GravityBodies = [];
var game = new Phaser.Game(config);