import Game from "./main_scene.js"
import { name_link } from "./UI.js";

export default class SidePanelAttribute{

    updateBody(bodyName){
        this.updatesName = bodyName;
        this.body = Game.GravityBodiesDict[bodyName];
        this.fillInAttributes();
        this.addListeners();
    }

    update(){
        this.fillInAttributes();
    }

    addListeners(){
        document.getElementById("direction-attributes").addEventListener('change', (e) => (this.body.setDirection(e.target.value)));
        document.getElementById("speed-attributes").addEventListener('change', (e) => (this.body.setMagnitude(e.target.value)));
        document.getElementById("radius-attributes").addEventListener('change', (e) => (this.body.radius = e.target.value));
        document.getElementById("mass-attributes").addEventListener('change', (e) => (this.body.mass = e.target.value));
    }

    updateValue(element, text){
        if (!(element === document.activeElement)){
            element.value = text;
        }
    }

    fillInAttributes(){
        if (this.body.deleted){
            document.getElementById("icon-pic-attributes").src = name_link["_GraveStone"];
            document.getElementById("body-name-attributes").innerText = "[DEAD] " + this.updatesName;
        }
        else{
            document.getElementById("icon-pic-attributes").src = name_link[this.body.sprite.texture.key];
            document.getElementById("body-name-attributes").innerText = this.updatesName;
        }
        
        this.updateValue(document.getElementById("preset-list-attributes"), this.body.preset);
        this.updateValue(document.getElementById("direction-attributes"), this.body.velocity.direction().toFixed(2));
        this.updateValue(document.getElementById("speed-attributes"), this.body.velocity.magnitude().toFixed(2));
        this.updateValue(document.getElementById("radius-attributes"), this.body.radius);
        this.updateValue(document.getElementById("mass-attributes"), this.body.mass);

        document.getElementById('icon-list-attributes').value = this.updatesName;
    }
}