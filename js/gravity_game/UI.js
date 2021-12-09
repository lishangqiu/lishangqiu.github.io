import SliderUI from "./slider.js"
import GravityBody from "./gravity_body.js";
import {resolutionTime} from "./gravity_body.js"
import {SCREEN_SCALE_INCREASE} from "./config.js"
import {game} from "./main.js"

export default  class UIScene extends Phaser.Scene{
    constructor(){
        super({ key: 'UIScene'});
    }

    preload(){
        this.load.plugin('rexsliderplugin', 'https://raw.githubusercontent.com/rexrainbow/phaser3-rex-notes/master/dist/rexsliderplugin.min.js', true);
        UIScene.sliderImg = this.load.image("slider", "assets/GravityGame/slider.png");
        UIScene.plusImg = this.load.image("plus_button", "assets/GravityGame/plus_button.png");
        UIScene.minusImg = this.load.image("minus_button", "assets/GravityGame/minus_button.png");

        this.sceneStopped = false;
        this.width = this.game.screenBaseSize.width;
        this.height = this.game.screenBaseSize.height;
        this.handlerScene = this.scene.get('handler');
        this.handlerScene.sceneRunning = 'title';
    }

    create(){
        const { width, height } = this;
        // CONFIG SCENE         
        this.handlerScene.updateResize(this)

        this.add.text(20*SCREEN_SCALE_INCREASE, 10*SCREEN_SCALE_INCREASE, 
            "Scale: 5x10^10 meters/pixel\n\nRadius are upscaled by: 500x for visibility\n").setScale(SCREEN_SCALE_INCREASE);

        this.simSpeedText = this.add.text(-50*SCREEN_SCALE_INCREASE, 850*SCREEN_SCALE_INCREASE, 
            "you're not supposed to see this").setScale(SCREEN_SCALE_INCREASE);
        this.simSpeedText.depth = 3;

        this.simSpeedSlider = new SliderUI(-600, 260, 400 , this, 0xD9DDDC);
        this.add.text(-750*SCREEN_SCALE_INCREASE, 170*SCREEN_SCALE_INCREASE, "Simulation\n  Speed").setScale(SCREEN_SCALE_INCREASE);
    }

    update(){
        GravityBody.simTimes = Math.round((this.simSpeedSlider.img.slider.value * 30) + 8);
        this.simSpeedText.text = "Time Scale: Each second in simulation = " + 
        (resolutionTime*GravityBody.simTimes/3600*game.loop.actualFps).toFixed(3) + " hours in real life\n                 (its updating to match your framerate)";
    }
    
}