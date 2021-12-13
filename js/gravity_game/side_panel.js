import Game from "./main_scene.js"

const iconSize = 64;
const name_link = {
    "Earth": "assets/GravityGame/earth.png",
    "Sun": "assets/GravityGame/sun.png"
}

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
            this.buttons.push(new SidePanelButton(i));
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
    constructor(bodyIndex){
        this.addTemplate(Game.GravityBodies[bodyIndex].label.text, Game.GravityBodies[bodyIndex].sprite.texture.key);

        this.id = Game.GravityBodies[bodyIndex].id;
    }

    addTemplate(bodyName, imageName){
        var template = document.getElementById("gravity-body");
        var clon = template.content.cloneNode(true);
        clon.getElementById("name").textContent = bodyName;
        clon.getElementById("icon-pic").src = name_link[imageName];

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
    
        
        document.getElementById("side-panel-id").appendChild(clon);
    }
    
    dead_now(){
        if (this.dead){
            return;
        }
        this.dead = true;
        this.panel.style.backgroundColor = "#000000";
        var node = document.createElement("img");
        node.src = "assets/GravityGame/tombstone.png"
        node.style.width = "40px";
        node.style.marginLeft = "190px";
        this.panel_body.appendChild(node);
    }
}