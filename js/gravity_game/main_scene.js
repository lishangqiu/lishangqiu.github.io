import GravityBody from "./gravity_body.js"
import {MIN_ZOOM, MAX_ZOOM, SCREEN_SCALE_INCREASE} from "./config.js"

// this scene mostly handles the scaling of the screen and transformations by mouse
export default class Game extends Phaser.Scene{
    startX = null;
    startY = null;

    constructor(){
        super({ key: 'game' })
        Game.GravityBodies = [];
    }

    preload(){
        this.width = this.game.screenBaseSize.width
        this.height = this.game.screenBaseSize.height

        // load stuff soon
        this.load.image('background', 'assets/GravityGame/background.jpg');
        this.load.image("Earth", "assets/GravityGame/earth.png");
        this.load.image("Sun", "assets/GravityGame/sun.png");

        this.handlerScene = this.scene.get('handler')
        this.handlerScene.sceneRunning = 'preload'
        this.sceneStopped = false;
    }

    create(){
        // CONFIG SCENE         
        this.handlerScene.updateResize(this);

        // Deal with zoom stuff
        this.cameras.main.setZoom(1);
        Game.currZoom = 1;

        this.input.on('wheel', function (pointer, gameObjects, deltaX, deltaY, deltaZ) {
            const camera = this.cameras.main;
            const newZoom = Math.min(Math.max(camera.zoom - deltaY * 0.0007, MIN_ZOOM), MAX_ZOOM);
            Game.GravityBodies.forEach(function(item, index, array){
                item.label.setScale(item.label.scale * (camera.zoom / newZoom));
            });
            
            camera.setZoom(newZoom);
            Game.currZoom = newZoom;
        });

        this.startScrollX = this.cameras.main.scrollX;
        this.startScrollY = this.cameras.main.scrollY;

        this.input.on('pointermove', this.onPointerMove, this);

        // create celestrial bodies
        this.createBody(0, 0, 0, 0, 69.34e6, 1.989e30, "Sun", "Sun");
        this.createBody(149e9, 0, 0, -30000, 6.73e6, 5.972e24, "Earth", "Earth");
        //this.createBody(-180e9, 0, 0, -25000, 20.34e6, 1.989e29, "Sun", "AnotherStar");

    }

    update(){
        Game.GravityBodies.forEach(function(item, index, array) {
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
        Game.GravityBodies.push(new GravityBody(config));
    }

    onPointerMove(pointer){
        if (pointer.isDown && pointer.x>100)
        {
            if (this.startX == null){
                this.startX = pointer.x;
                this.startY = pointer.y;
            }
            console.log(Game.currZoom);
            this.cameras.main.setScroll(this.startScrollX - (pointer.x-this.startX) / Game.currZoom, this.startScrollY - (pointer.y-this.startY) / Game.currZoom);
        }
        else{
            if (this.startX != null){
                this.startX = null;
                this.startY = null;
                this.startScrollX = this.cameras.main.scrollX;
                this.startScrollY = this.cameras.main.scrollY;
            }
        }
    }
}