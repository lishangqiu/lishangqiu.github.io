import GravityBody from "./gravity_body.js"
import { screenScale } from "./gravity_body.js";
import {MIN_ZOOM, MAX_ZOOM, SCREEN_SCALE_INCREASE, SIZE_WIDTH_SCREEN, SIZE_HEIGHT_SCREEN } from './config.js'

const name_link = {
    "Earth": "assets/GravityGame/earth.png",
    "Sun": "assets/GravityGame/sun.png",
    "Venus": "assets/GravityGame/venus.png",
    "Mercury": "assets/GravityGame/mercury.png",
    "Mars": "assets/GravityGame/mars.png",
    "Jupiter": "assets/GravityGame/jupiter2.png",
    "_GraveStone": "assets/GravityGame/tombstone.png"
}
export {name_link};

export default class Game extends Phaser.Scene{
    startX = null;
    startY = null;

    constructor(){
        super('game');
        Game.GravityBodies = [];
        Game.GravityBodiesDict = {};
        Game.paused = true;
        Game.allBodyIds = [];
        this.currFollowing = null;
        this.currDragging = false;
        this.currMoving = null;
        Game.currScale_ = 1/ screenScale;
    }

    preload(){
        // load stuff soon
        this.load.image('background', 'assets/GravityGame/background.jpg');
        Object.entries(name_link).map(([key, value]) => {
            this.load.image(key, value);
        });
        this.load.image("position", "assets/GravityGame/position.png");
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
            Game.currScale_ = 1/ (screenScale * camera.zoom);
        });

        this.startScrollX = this.cameras.main.scrollX;
        this.startScrollY = this.cameras.main.scrollY;

        this.input.on('pointermove', this.onPointerMove, this);
        this.keySpace = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);

        this.createBody({preset_name: "Sun", name: "Sun", lineColor: 0xff00ff});
        this.createBody({preset_name: "Earth", name: "Earth", lineColor: 0x4B0082});
        this.createBody({preset_name: "Venus", name: "Venus", lineColor: 0xF8F8FF});
        this.createBody({preset_name: "Mercury", name: "Mercury", lineColor: 0xadd8e6});
        this.createBody({preset_name: "Custom", posX: -180e9, posY: 0, velocityX: 0, velocityY: -35000, 
                   radius: 30.34e6, mass: 4.989e29, textureName: "Sun", name: "AnotherStar", lineColor:  0x00FFFF});
        //this.createBody({preset_name: "Custom", posX: 152.1e9, posY: 0, velocityX: -1000000, velocityY: 10000, radius: 6.73e6, mass: 5.972e24, textureName: "Earth", name: "test"});
        
        this.add.circle(0, 0, 10, 0xff00ff);

        Game.gra = this.add.graphics();
    }

    update(){
        if (this.input.keyboard.checkDown(this.keySpace, 800)){
            Game.paused = !Game.paused;
        }
        if (!Game.paused){
            Game.GravityBodies.forEach(function(item, index, array) {
                item.drawNewPos(Game.allBodyIds);
            });
            if (this.currMoving != null){
                this.currMoving.stopPositionDrag();
            }

        }

        if (this.currFollowing != null){
            this.cameras.main.startFollow(Game.GravityBodiesDict[this.currFollowing].sprite);
        }
        else{
            this.cameras.main.stopFollow();
        }
    }

    createBody(options){
        var config;
        if (options.preset_name == "Custom"){
            console.log(options.posX);
            config = {
                starting_pos : new Victor(options.posX, options.posY),
                starting_velocity : new Victor(options.velocityX, options.velocityY),
                radius : options.radius,
                mass : options.mass,
                sceneObj : this,
                textureName : options.textureName,
                name: options.name,
                preset_name: options.preset_name,
                lineColor: Number(this.randomColor(   ))
            };
        }
        else{
            config = {
                sceneObj : this,
                name: options.name,
                preset_name: options.preset_name,
                lineColor: Number(this.randomColor())
            };
        }

        var obj = new GravityBody(config);
        obj.drawObjPos();
        Game.GravityBodies.push(obj);
        Game.GravityBodiesDict[obj.id] = obj;
        Game.allBodyIds.push(obj.id);
        return obj.id;
    }

    onPointerMove(pointer){
        if (!this.currDragging){
            if (pointer.isDown && pointer.x>100 && pointer.x<1500)
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
                }
                this.startScrollX = this.cameras.main.scrollX;
                this.startScrollY = this.cameras.main.scrollY;
            }
        }
    }

    fullScreen(){
        this.scale.toggleFullscreen();
    }
    
    hslToHex(h, s, l) {
        l /= 100;
        const a = s * Math.min(l, 1 - l) / 100;
        const f = n => {
          const k = (n + h / 30) % 12;
          const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
          return Math.round(255 * color).toString(16).padStart(2, '0');   // convert to Hex and prefix "0" if needed
        };
        return `0x${f(0)}${f(8)}${f(4)}`;
      }
    
    randomColor = (() => {
        "use strict";
      
        const randomInt = (min, max) => {
          return Math.floor(Math.random() * (max - min + 1)) + min;
        };
      
        return () => {
          var h = randomInt(0, 360);
          var s = randomInt(42, 98);
          var l = randomInt(40, 90);
          return this.hslToHex(h, s, l);
        };
      })();
}

Game.setPaused = function(pause){
    Game.paused = pause;
}
