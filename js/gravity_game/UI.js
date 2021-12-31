import SliderUI from "./slider.js"
import GravityBody from "./gravity_body.js";
import {resolutionTime, radiusUpscale} from "./gravity_body.js"
import {SCREEN_SCALE_INCREASE, SIZE_WIDTH_SCREEN, SIZE_HEIGHT_SCREEN } from "./config.js"
import Game from "./main_scene.js"
import SidePanel from "./side_panel.js";
import SidePanelAttribute from "./side_panel_attributes.js"
import {game} from "./main.js"


export default class UIScene extends Phaser.Scene{
    constructor(){
        super("UIScene");
        this.lastTime = new Date().getTime();
        this.timeSpent = 0; // in seconds
        this.sidePanelObj = new SidePanel();
        this.attributesPanelObj = new SidePanelAttribute();

        this.skipCountAttributes = 0;
        document.fullscreenEnabled = true;
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

        UIScene.fullScreenButton = this.load.image("fullscreen_button", "assets/GravityGame/FullScreen.png");
        UIScene.unFullScreenButton = this.load.image("unfullscreen_button", "assets/GravityGame/UnFullScreen.png");
    }

    create(){
        this.cameras.main.setZoom(1);
        this.scale.fullscreenTarget = document.getElementById("game");
        this.scaleText = this.add.text(20, 10, 
            );

        this.fullScreenButton = this.add.sprite(1400, 60, "fullscreen_button").setOrigin(0.5, 0.5).setInteractive({useHandCursor: true});
        this.fullScreenButton.displayWidth = 32; // times two for diameter(scaling the image)
        this.fullScreenButton.scaleY = this.fullScreenButton.scaleX;
        this.fullScreenButton.on("pointerover", () => this.fullScreenButton.setTint(0xafafaf)).on("pointerout", () => this.fullScreenButton.setTint(0xffffff));
        this.fullScreenButton.on('pointerdown', () => {
            game.scene.getScene("game").fullScreen();
            if (this.fullScreenButton.texture.key == "fullscreen_button"){
                this.fullScreenButton.setTexture("unfullscreen_button");
            }
            else{
                this.fullScreenButton.setTexture("fullscreen_button");
            }
        });

        //this.simSpeedText = this.add.text(-1, 1000, 
        //    "Time Scale: Each second in simulation = 100.05 hours in real life(its updating to match your framerate)");
        //this.simSpeedText.setPosition(SIZE_WIDTH_SCREEN/2-(this.simSpeedText.width/2), 1050);
        //this.simSpeedText.depth = 3;
        
        this.simSpeedSlider = new SliderUI(30, 120, 310 , this, 0xD9DDDC);
        this.add.text(18, 170, "Simulation\n  Speed");

        this.earthDaysText = this.add.text(780, 1030, "Earth days").setOrigin(0.5, 0.5).setFontSize(23);
        this.sidePanelObj.create(this);
        this.switchSideBar("main");

        this.playButton = this.add.sprite(780, 970, "play_button").setOrigin(0.5, 0.5);
        this.playButton.displayWidth = 64; // times two for diameter(scaling the image)
        this.playButton.scaleY = this.playButton.scaleX;
        this.playButton.setInteractive({useHandCursor: true}).on("pointerdown", () => this.playClicked()).on("pointerover", () => this.playButton.setTint(0xafafaf)).on("pointerout", () => this.playButton.setTint(0xffffff));

        document.getElementById("home-attributes").onclick = ()=>{this.switchSideBar("main");game.scene.getScene("game").currFollowing = null;}
        this.debug = this.add.text(1000, 10, '', { font: '16px Courier', fill: '#00ff00' });
    }

    update(){
        this.lastTime = new Date().getTime();
        // set the amount of times of simulation
        GravityBody.simTimes = Math.round(((1-this.simSpeedSlider.sliderImg.slider.value) * 1000) + 160);
        //GravityBody.simTimes = Math.round(100 );

        //this.simSpeedText.text = "Time Scale: Each second in simulation = " + 
        //(resolutionTime*GravityBody.simTimes*game.loop.actualFps/3600).toFixed(3) + " hours in real life(its updating to match your framerate)";


        if (!Game.paused){
            this.timeSpent += resolutionTime*GravityBody.simTimes;
        }

        this.scaleText.text = "Scale: " + Game.currScale_.toExponential(3) + " meters/pixel\n\nRadius are upscaled by: " + radiusUpscale + "x for visibility\n"
        this.earthDaysText.text = "Earth days: " + (this.timeSpent/86400).toFixed(0);
        this.sidePanelObj.update();

        if (this.updatesName != null && !Game.paused){
            // skip every x frame so that the attributes don't update so fast
            if (this.skipCountAttributes > 2){ // change later
                this.attributesPanelObj.update();
                this.skipCountAttributes = 0;
            }
            this.skipCountAttributes++;
        }

        if (Game.paused){
            this.playButton.setTexture("play_button");
        }
        else{
            this.playButton.setTexture("pause_button");
        }
        this.attributesPanelObj.updateNonPausable();

        //this.input.on('pointerdown', () => {clearSelection();}, this);
        
        this.debug.setText([
            'FPS: ' + game.loop.actualFps
        ]);
    }

    
    switchSideBar(name){
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

function clearSelection() {
    var sel;
    if ( (sel = document.selection) && sel.empty ) {
        sel.empty();
    } else {
        if (window.getSelection) {
            window.getSelection().removeAllRanges();
        }
        var activeEl = document.activeElement;
        if (activeEl) {
            var tagName = activeEl.nodeName.toLowerCase();
            if ( tagName == "textarea" ||
                    (tagName == "input" && activeEl.type == "text") ) {
                // Collapse the selection to the end
                activeEl.selectionStart = activeEl.selectionEnd; 
            }
        }
    }
}