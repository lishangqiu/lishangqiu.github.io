import SliderUI from "./slider.js"
import GravityBody from "./gravity_body.js";
import {resolutionTime} from "./gravity_body.js"
import {SCREEN_SCALE_INCREASE, SIZE_WIDTH_SCREEN, SIZE_HEIGHT_SCREEN } from "./config.js"
import Game from "./main_scene.js"
import SidePanel from "./side_panel.js";
import SidePanelAttribute from "./side_panel_attributes.js"

const name_link = {
    "Earth": "assets/GravityGame/earth.png",
    "Sun": "assets/GravityGame/sun.png",
    "_GraveStone": "assets/GravityGame/tombstone.png"
}
export {name_link};

export default class UIScene extends Phaser.Scene{
    constructor(){
        super("UIScene");
        this.lastTime = new Date().getTime();
        this.timeSpent = 0; // in seconds
        this.sidePanelObj = new SidePanel();
        this.attributesPanelObj = new SidePanelAttribute();

        this.skipCountAttributes = 0;
    }

    preload(){
        this.load.plugin('rexsliderplugin', 'https://raw.githubusercontent.com/rexrainbow/phaser3-rex-notes/master/dist/rexsliderplugin.min.js', true);
        this.load.scenePlugin('rexuiplugin', 'https://raw.githubusercontent.com/rexrainbow/phaser3-rex-notes/master/dist/rexuiplugin.min.js', 'rexUI', 'rexUI');
        UIScene.sliderImg = this.load.image("slider", "assets/GravityGame/slider.png");
        UIScene.plusImg = this.load.image("plus_button", "assets/GravityGame/plus_button.png");
        UIScene.minusImg = this.load.image("minus_button", "assets/GravityGame/minus_button.png");

        UIScene.buttonImg = this.load.image("button_image", "assets/GravityGame/button.png");
        UIScene.playButtonImg = this.load.image("play_button", "assets/GravityGame/play_button.png");
        UIScene.playButtonImg = this.load.image("pause_button", "assets/GravityGame/pause_button.png");
    }

    create(){
        this.cameras.main.setZoom(1);

        this.add.text(20, 10, 
            "Scale: 5x10^10 meters/pixel\n\nRadius are upscaled by: 500x for visibility\n");

        //this.simSpeedText = this.add.text(-1, 1000, 
        //    "Time Scale: Each second in simulation = 100.05 hours in real life(its updating to match your framerate)");
        //this.simSpeedText.setPosition(SIZE_WIDTH_SCREEN/2-(this.simSpeedText.width/2), 1050);
        //this.simSpeedText.depth = 3;
        
        this.simSpeedSlider = new SliderUI(30, 150, 240 , this, 0xD9DDDC);
        this.add.text(18, 230, "Simulation\n  Speed");

        this.earthDaysText = this.add.text(850, 1030, "Earth days").setOrigin(0.5, 0.5).setFontSize(23);
        this.sidePanelObj.create(this);
        this.switchSideBar("main");

        this.playButton = this.add.sprite(850, 950, "play_button").setOrigin(0.5, 0.5);
        this.playButton.displayWidth = 64; // times two for diameter(scaling the image)
        this.playButton.scaleY = this.playButton.scaleX;
        this.playButton.setInteractive({useHandCursor: true}).on("pointerdown", () => this.playClicked()).on("pointerover", () => this.playButton.setTint(0xafafaf)).on("pointerout", () => this.playButton.setTint(0xffffff));
    
        document.getElementById("home-attributes").onclick = ()=>{this.switchSideBar("main");}
    }

    update(){
        var deltaTime = ((new Date().getTime() - this.lastTime) / 1000);
        this.lastTime = new Date().getTime();
        // set the amount of times of simulation
        GravityBody.simTimes = Math.round(((1-this.simSpeedSlider.img.slider.value) * 60) + 8);

        //this.simSpeedText.text = "Time Scale: Each second in simulation = " + 
        //(resolutionTime*GravityBody.simTimes*game.loop.actualFps/3600).toFixed(3) + " hours in real life(its updating to match your framerate)";


        if (!Game.paused){
            this.timeSpent += resolutionTime*GravityBody.simTimes;
        }

        this.earthDaysText.text = "Earth days: " + (this.timeSpent/86400).toFixed(0);
        this.sidePanelObj.update();

        if (this.updatesName != null && !Game.paused){
            if (this.skipCountAttributes > 2){ // change later, 5 constant
                this.attributesPanelObj.update();
                this.skipCountAttributes = 0;
            }
            this.skipCountAttributes++;
        }

        if (Game.paused){
            this.playButton.setTexture("pause_button");
        }
        else{
            this.playButton.setTexture("play_button");
        }
    }

    
    switchSideBar(name){
        console.log(name);
        if (name=="main"){
            document.getElementById("side-panel-id").style.display = "";
            document.getElementById("side-panel-attributes").style.display = "none";
            this.updatesName = null;
        }
        else{
            this.updatesName = name;
            document.getElementById("side-panel-id").style.display = "none";
            document.getElementById("side-panel-attributes").style.display = "";
            this.attributesPanelObj.updateBody(name);
        }
    }

    playClicked(){
        Game.paused = !Game.paused;
    }
}