import Game from "./main_scene.js"
import {game} from "./main.js"
import { name_link } from "./UI.js";

export default class SidePanelAttribute{
    constructor(){
        this.posXObj = new NumberAttributeObj(document.getElementById("posX-attributes"), 
        () => {return this.body.pos.x.toFixed(2);}, (val) => {this.body.setPosX(val);}, 0.001);

        this.posYObj = new NumberAttributeObj(document.getElementById("posY-attributes"), 
        () => {return this.body.pos.y.toFixed(2);}, (val) => {this.body.setPosY(val);}, 0.001);

        this.directionObj = new NumberAttributeObj(document.getElementById("direction-attributes"), 
        () => {return this.body.velocity.direction().toFixed(2);}, (val) => {this.body.setDirection(val)}, 1);

        this.speedObj = new NumberAttributeObj(document.getElementById("speed-attributes"), 
        () => {return this.body.velocity.magnitude().toFixed(2);}, (val) => {this.body.setMagnitude(val)}, 1);

        this.radiusObj = new NumberAttributeObj(document.getElementById("radius-attributes"), 
        () => {return this.body.radius}, (val) => {this.body.setRadius(val)}, 1);

        this.massObj = new NumberAttributeObj(document.getElementById("mass-attributes"), 
        () => {return this.body.mass}, (val) => {this.body.mass = val}, 1);
    }

    updateBody(bodyName){
        this.updatesName = bodyName;
        this.body = Game.GravityBodiesDict[bodyName];
        this.fillInAttributes();
        this.addListeners();
    }

    update(){
        this.fillInAttributes();
    }

    updateNonPausable(){
        this.posXObj.updateValue();
        this.posYObj.updateValue();
        this.directionObj.updateValue();
        this.speedObj.updateValue(); 
        this.radiusObj.updateValue();
        this.massObj.updateValue();
    }

    addListeners(){
        document.getElementById("mass-attributes").addEventListener('change', (e) => (this.body.mass = e.target.value));

        this.posXObj.addListeners();
        this.posYObj.addListeners();
        this.directionObj.addListeners();
        this.speedObj.addListeners();
        this.radiusObj.addListeners();
        this.massObj.addListeners();
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
        
        document.getElementById("preset-list-attributes").value = this.body.preset; 

        document.getElementById('icon-list-attributes').value = this.body.sprite.texture.key;

        this.posXObj.fillInAttributes();
        this.posYObj.fillInAttributes();
        this.directionObj.fillInAttributes();
        this.speedObj.fillInAttributes(); 
        this.radiusObj.fillInAttributes();
        this.massObj.fillInAttributes();
    }
}

class NumberAttributeObj{
    constructor(element, getFunc, setFunc, unitMultiply){
        this.element = element;
        this.getFunc = getFunc;
        this.setFunc = setFunc;
        this.unitMultiply = unitMultiply;
    }

    fillInAttributes(){
        this.element.value = (this.getFunc()*this.unitMultiply).toFixed(2);
    }

    addListeners(){
        this.element.addEventListener('change', (e) => (this.setFunc(e.target.value/this.unitMultiply)));
    }

    updateValue(){
        if (this.element === document.activeElement){
            Game.setPaused(true);
            if (game.input.activePointer.isDown){
                if (game.input.activePointer.x < 1500){
                    this.element.blur();
                }
            }
        }
    }
}