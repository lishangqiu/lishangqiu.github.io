import GravityBody from "./gravity_body.js"
import {MIN_ZOOM, MAX_ZOOM, SCREEN_SCALE_INCREASE, SIZE_WIDTH_SCREEN, SIZE_HEIGHT_SCREEN } from './config.js'


// this scene mostly handles the scaling of the screen and transformations by mouse
export default class Game extends Phaser.Scene{
    startX = null;
    startY = null;

    constructor(){
        super('game');
        Game.GravityBodies = [];
        Game.GravityBodiesDict = {};
        Game.paused = false;
    }

    preload(){

        // load stuff soon
        this.load.image('background', 'assets/GravityGame/background.jpg');
        this.load.image("Earth", "assets/GravityGame/earth.png");
        this.load.image("Sun", "assets/GravityGame/sun.png");
    }

    create(){
        // CONFIG SCENE         
        //this.handlerScene.updateResize(this);

        // Deal with zoom stuff
        this.scene.launch("UIScene");

        this.cameras.main.setZoom(1);
        this.cameras.main.centerOn(SIZE_WIDTH_SCREEN/2, SIZE_HEIGHT_SCREEN/2);
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
        this.keySpace = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);

        // create celestrial bodies
        this.createBody(0, 0, 0, 0, 69.34e6, 1.989e30, "Sun", "Sun");
        this.createBody(149e9, 0, 0, -30000, 6.73e6, 5.972e24, "Earth", "Earth");
        this.createBody(-180e9, 0, 0, -25000, 20.34e6, 1.989e29, "Sun", "AnotherStar");

    }

    update(){
        if (this.input.keyboard.checkDown(this.keySpace, 800)){
            Game.paused = !Game.paused;
            console.log(Game.paused);
        }
        if (!Game.paused){
            Game.GravityBodies.forEach(function(item, index, array) {
                item.drawNewPos();
            });
        }
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

        var obj = new GravityBody(config);
        Game.GravityBodies.push(obj);
        Game.GravityBodiesDict[name] = obj;
    }

    onPointerMove(pointer){
        if (pointer.isDown && pointer.x>100)
        {
            if (this.startX == null){
                this.startX = pointer.x;
                this.startY = pointer.y;
            }
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