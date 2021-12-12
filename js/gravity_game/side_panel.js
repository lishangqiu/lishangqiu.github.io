import Game from "./main_scene.js"

const iconSize = 64;

export default class SidePanel{
    constructor(){
        this.buttons = [];
    }

    preload(){
        this.load.image("Earth", "assets/GravityGame/earth.png");
        this.load.image("Sun", "assets/GravityGame/sun.png");
    }

    create(sceneObj){
        //var sidePanel = this.add.rectangle(1750, 0, 390, 2160, 0xADD8E6);

        sceneObj.add.line(0,0,1600,0,1600,2160,0xffffff);

        var y_coord = 40;
        for (let i = 0; i < Game.GravityBodies.length; i++){
            this.buttons.push(new SideButton(y_coord, i, sceneObj));
            y_coord += 80;
        }
    }

    update(){
        for (let i = 0; i < this.buttons.length; i++){
            var deleted = true;
            for (let j = 0; j < Game.GravityBodies.length; j++){
                if (Game.GravityBodies[j].id == this.buttons[i].id){
                    deleted = false;
                }
            }
            if (deleted){
                this.buttons[i].dead_now();
            }
        }
    }
}

class SideButton{
    constructor(y_coordinate, bodyIndex, sceneObj){
        var button_icon = sceneObj.add.image(-120, 0, Game.GravityBodies[bodyIndex].sprite.texture.key);
        button_icon.setScale(iconSize/button_icon.width);
        var button_text = sceneObj.add.text(-60, -6, Game.GravityBodies[bodyIndex].label.text, {color:"#ffffff"}).setFontSize(18);
        this.button_image = sceneObj.add.image(0, 0, "button_image").setScale(0.34);
        var button_image = this.button_image;

        var container = sceneObj.add.container(1764, y_coordinate, [button_icon, this.button_image, button_text]);
        container.setSize(this.button_image.width/2, this.button_image.height/2);
        container.sendToBack(this.button_image);

        var buttons = sceneObj.rexUI.add.buttons({orientation: 0, buttons: [container]});
        buttons.on('button.click', function(button, index, pointer, event) {

        });
        buttons.on('button.over', function(button, index, pointer, event) {
            button_image.setTint(0xc4c4c4);
        });
        buttons.on('button.out', function(button, index, pointer, event) {
            button_image.setTint(0xfffffff);
        });
        this.buttons = buttons;

        this.id = Game.GravityBodies[bodyIndex].id;
    }

    button_over(){
        
    }

    dead_now(){
        this.buttons.setButtonEnable(false);
        this.button_image.setTint(0x000000);
    }
}