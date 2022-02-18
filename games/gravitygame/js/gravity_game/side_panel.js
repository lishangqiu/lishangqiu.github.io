import Game from "./main_scene.js"
import {name_link} from "./main_scene.js"
import {game} from "./main.js"

const iconSize = 64;
var untitledNums = 1;

export default class SidePanel{
    constructor(){
        this.buttons = [];
        this.buttonsID = {};
    }

    preload(){
        Object.entries(name_link).map(([key, value]) => {
            this.load.image(key, value);
        })
    }

    create(sceneObj){
        //var sidePanel = this.add.rectangle(1750, 0, 390, 2160, 0xADD8E6);

        sceneObj.add.line(0,0,1500,0,1500,2160,0xffffff);

        for (let i = 0; i < Game.GravityBodies.length; i++){
            var obj = new SidePanelButton(Game.GravityBodies[i].id, sceneObj, this);
            this.buttons.push(obj);
            this.buttonsID[Game.GravityBodies[i].id] = obj;
        }
        this.sceneObj = sceneObj;
        var dom = sceneObj.add.dom(1517, 0, "#sidepanel");
        dom.setOrigin(0, 0);

        document.getElementById("plus_button1").onclick = () => {
            var id = game.scene.getScene("game").createBody({preset_name: "Custom", posX: game.scene.getScene("game").cameras.main.centerX, 
            posY: game.scene.getScene("game").cameras.main.centerY, velocityX: 0, velocityY: 0, 
            radius: 69911000, mass: 1898.13e24, textureName: "Jupiter", name: "Untitled"+untitledNums}, true);
            untitledNums++;
            this.insertLast();
            game.scene.getScene("UIScene").switchSideBar(id);
        };
    }

    insertLast(){
        var obj = new SidePanelButton(Game.GravityBodies[Game.GravityBodies.length-1].id, this.sceneObj);
        this.buttons.push(obj);
        this.buttonsID[Game.GravityBodies[Game.GravityBodies.length-1].id] = obj;
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


class SidePanelButton{
    constructor(bodyId, sceneObj, parentObj){
        this.addTemplate(bodyId, Game.GravityBodiesDict[bodyId].sprite.texture.key, sceneObj);
        this.id = bodyId;
        this.parentObj = parentObj;
    }

    addTemplate(bodyId, imageName, sceneObj){
        var template = document.getElementById("gravity-body");
        var clon = template.content.cloneNode(true);

        clon.getElementById("name").textContent = Game.GravityBodiesDict[bodyId].name;
        this.nameElement = clon.getElementById("name");

        clon.getElementById("icon-pic").src = name_link[imageName];
        this.icon_pic = clon.getElementById("icon-pic");

        var panel = clon.getElementById("panel-id");
        this.panel = panel;
        this.panel_body = panel.children[0];

        clon.getElementById("button").onmouseover = () => {
            if (!this.dead){
                panel.style.backgroundColor = "#0f0f0f";
            }
        };
    
        clon.getElementById("button").onmouseout = () => {
            if (!this.dead){
                panel.style.backgroundColor = "#1a1a1a";
            }
        };
        clon.getElementById("button").onclick = function() {sceneObj.switchSideBar(bodyId)};
        clon.getElementById("delete_button").onclick = () => {
            Game.GravityBodies.forEach(function(item, index, array){
                if (item.id == bodyId){
                    Game.GravityBodies[index].deleteItem();
                    Game.GravityBodies.splice(index, 1);
                    document.getElementById("side-button-id-"+index).remove();
                }
            });
            delete Game.GravityBodiesDict[bodyId]; 
            this.deleted = true;
        };
        clon.children[0].id = "side-button-id-"+Game.GravityBodiesDict[bodyId].id;


        document.getElementById("side-panel-id").appendChild(clon);
    }
    
    dead_now(){
        if (this.dead || this.deleted){
            return;
        }

        this.dead = true;
        this.panel.style.backgroundColor = "#000000";
        this.icon_pic.src = "assets/GravityGame/tombstone.png";
    }

    updateName(name){
        this.nameElement.textContent = name;
    }

    updateIcon(textureName){
        this.icon_pic.src = name_link[textureName];
    }
}