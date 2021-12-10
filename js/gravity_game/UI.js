import SliderUI from "./slider.js"
import GravityBody from "./gravity_body.js";
import {resolutionTime} from "./gravity_body.js"
import {SCREEN_SCALE_INCREASE, SIZE_WIDTH_SCREEN, SIZE_HEIGHT_SCREEN } from "./config.js"
import {game} from "./main.js"

export default  class UIScene extends Phaser.Scene{
    constructor(){
        super("UIScene");
    }

    preload(){
        this.load.plugin('rexsliderplugin', 'https://raw.githubusercontent.com/rexrainbow/phaser3-rex-notes/master/dist/rexsliderplugin.min.js', true);
        UIScene.sliderImg = this.load.image("slider", "assets/GravityGame/slider.png");
        UIScene.plusImg = this.load.image("plus_button", "assets/GravityGame/plus_button.png");
        UIScene.minusImg = this.load.image("minus_button", "assets/GravityGame/minus_button.png");
    }

    create(){
        this.cameras.main.setZoom(1);

        this.add.text(20, 10, 
            "Scale: 5x10^10 meters/pixel\n\nRadius are upscaled by: 500x for visibility\n");

        this.simSpeedText = this.add.text(-1, 1000, 
            "Time Scale: Each second in simulation = 100.05 hours in real life(its updating to match your framerate)");
        this.simSpeedText.setPosition(SIZE_WIDTH_SCREEN/2-(this.simSpeedText.width/2), 1030);
        this.simSpeedText.depth = 3;
        
        this.simSpeedSlider = new SliderUI(30, 150, 240 , this, 0xD9DDDC);
        this.add.text(18, 230, "Simulation\n  Speed");
    }

    update(){
        // set the amount of times of simulation
        GravityBody.simTimes = Math.round(((1-this.simSpeedSlider.img.slider.value) * 60) + 8);

        this.simSpeedText.text = "Time Scale: Each second in simulation = " + 
        (resolutionTime*GravityBody.simTimes/3600*game.loop.actualFps).toFixed(3) + " hours in real life(its updating to match your framerate)";
    }
    
}