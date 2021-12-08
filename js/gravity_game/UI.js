class UIScene extends Phaser.Scene{
    constructor(){
        super({ key: 'UIScene', active: true });
    }

    preload(){
        this.load.plugin('rexsliderplugin', 'https://raw.githubusercontent.com/rexrainbow/phaser3-rex-notes/master/dist/rexsliderplugin.min.js', true);
        UIScene.sliderImg = this.load.image("slider", "assets/GravityGame/slider.png");
        UIScene.plusImg = this.load.image("plus_button", "assets/GravityGame/plus_button.png");
        UIScene.minusImg = this.load.image("minus_button", "assets/GravityGame/minus_button.png");
    }

    create(){
        new SliderUI(70, 230, 400 , this, 0xD9DDDC);
        this.add.text(25, 160, "Simulation\n  Speed");
    }
    
}