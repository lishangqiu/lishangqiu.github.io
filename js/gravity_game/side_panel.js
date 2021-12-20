import Game from "./main_scene.js"
import {name_link} from "./UI.js"

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

        sceneObj.add.line(0,0,1500,0,1500,2160,0xffffff);

        for (let i = 0; i < Game.GravityBodies.length; i++){
            this.buttons.push(new SidePanelButton(Game.GravityBodies[i].name, sceneObj));
        }

        var dom = sceneObj.add.dom(1517, 0, "#sidepanel");
        dom.setOrigin(0, 0)
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
    constructor(bodyName, sceneObj){
        this.addTemplate(bodyName, Game.GravityBodiesDict[bodyName].sprite.texture.key, sceneObj);
        this.id = Game.GravityBodiesDict[bodyName].id;
    }

    addTemplate(bodyName, imageName, sceneObj){
        var template = document.getElementById("gravity-body");
        var clon = template.content.cloneNode(true);
        clon.getElementById("name").textContent = bodyName;
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
        clon.getElementById("button").onclick = function() {sceneObj.switchSideBar(bodyName)};
        clon.getElementById("delete_button").onclick = () => {
            Game.GravityBodies.forEach(function(item, index, array){
                if (item.id == (Game.GravityBodiesDict[bodyName].id)){
                    Game.GravityBodies[index].deleteItem();
                    Game.GravityBodies.splice(index, 1);
                    document.getElementById("side-button-id-"+index).remove();
                }
            });
            delete Game.GravityBodiesDict[bodyName]; 
            this.deleted = true;
        };
        clon.children[0].id = "side-button-id-"+Game.GravityBodiesDict[bodyName].id;
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
}