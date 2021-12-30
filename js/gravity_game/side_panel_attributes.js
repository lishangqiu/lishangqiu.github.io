import Game from "./main_scene.js"
import {game} from "./main.js"
import { name_link } from "./main_scene.js";

export default class SidePanelAttribute{
    constructor(){
        this.posXObj = new NumberAttributeObj(document.getElementById("posX-attributes"), 
        () => {return this.body.pos.x}, (val) => {this.body.setPosX(val);}, 0.001);

        this.posYObj = new NumberAttributeObj(document.getElementById("posY-attributes"), 
        () => {return this.body.pos.y}, (val) => {this.body.setPosY(val);}, 0.001);

        this.directionObj = new NumberAttributeObj(document.getElementById("direction-attributes"), 
        () => {return this.body.velocity.direction()}, (val) => {this.body.setDirection(val)}, 1);

        this.speedObj = new NumberAttributeObj(document.getElementById("speed-attributes"), 
        () => {return this.body.velocity.magnitude()}, (val) => {this.body.setMagnitude(val)}, 0.001);

        this.radiusObj = new NumberAttributeObj(document.getElementById("radius-attributes"), 
        () => {return this.body.radius}, (val) => {this.body.setRadius(val)}, 0.001);

        this.massObj = new NumberAttributeObj(document.getElementById("mass-attributes"), 
        () => {return this.body.mass}, (val) => {this.body.mass = val}, 1);
        
        /*this.iconChoiceObj = new NumberAttributeObj(, 
        () => {return }, (val) => {console.log("hoa");this.body.setSpriteIcon(val)}, 1);*/
    }

    updateBody(bodyId){
        console.log(bodyId); 

        this.bodyId = bodyId;
        this.body = Game.GravityBodiesDict[bodyId];
        this.fillInAttributes();
        this.addListeners();
        document.getElementById("body-name-attributes").value = this.body.name;
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
        //document.getElementById("body-name-attributes")

        this.posXObj.addListeners();
        this.posYObj.addListeners();
        this.directionObj.addListeners();
        this.speedObj.addListeners();
        this.radiusObj.addListeners();
        this.massObj.addListeners();
        document.getElementById('icon-list-attributes').onchange = (val) => {this.body.setSpriteIcon(val.target.value);this.fillInAttributes();};
        document.getElementById("preset-list-attributes").onchange = (val) => {
            this.body.updatePreset(val.target.value);
            this.fillInAttributes();
            game.scene.getScene("UIScene").sidePanelObj.buttonsID[this.bodyId].updateIcon(val.target.value);
        };
        document.getElementById("follow-button").onclick = () => {
            if (game.scene.getScene("game").currFollowing == this.bodyId){
                game.scene.getScene("game").currFollowing = null;
            }
            else{ 
                game.scene.getScene("game").currFollowing = this.bodyId;
            }
            this.fillInAttributes();
        }

        document.getElementById("appear-button").onclick = () => {
            if (this.body.invisible){
                this.body.setAppear();
            }
            else{
                this.body.setInvisible();
            }
            this.fillInAttributes();
        }

        document.getElementById("position-button").onclick = () => {
            this.body.startPositionDrag();
        }
    }


    fillInAttributes(){
        if (this.body.deleted){
            document.getElementById("icon-pic-attributes").src = name_link["_GraveStone"];
            document.getElementById("body-name-attributes").value  = "[DEAD] " + this.body.name;
            document.getElementById("body-name-attributes").disabled = true;

            this.posXObj.disable();
            this.posYObj.disable();
            this.directionObj.disable();
            this.speedObj.disable(); 
            this.radiusObj.disable();
            this.massObj.disable();
            document.getElementById("preset-list-attributes").disabled = true;
            document.getElementById('icon-list-attributes').disabled = true;
        }
        else{
            document.getElementById("icon-pic-attributes").src = name_link[this.body.sprite.texture.key];
        }
        document.getElementById("body-name-attributes").addEventListener('change', (e) => (this.body.updateName(e.target.value)));
        document.getElementById("preset-list-attributes").value = this.body.preset; 
        document.getElementById('icon-list-attributes').value = this.body.sprite.texture.key;

        this.posXObj.fillInAttributes();
        this.posYObj.fillInAttributes();
        this.directionObj.fillInAttributes();
        this.speedObj.fillInAttributes(); 
        this.radiusObj.fillInAttributes();
        this.massObj.fillInAttributes();

        var targetStr;
        if (game.scene.getScene("game").currFollowing == this.bodyId){
            targetStr = "Unfollow";
        }
        else{ 
            targetStr = "Follow";
        }
        if (document.getElementById("follow-button").innerText != targetStr){
            document.getElementById("follow-button").innerText = targetStr;
        }

        var targetStr;
        if (this.body.invisible){
            targetStr = "Invisible";
        }
        else{ 
            targetStr = "Visible";
        }
        if (document.getElementById("appear-button").innerText != targetStr){
            document.getElementById("appear-button").innerText = targetStr;
        }
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
        let num = (this.getFunc()*this.unitMultiply);
        if (this.checkToExponent(num)){
            this.element.value = num.toExponential(4);
        }
        else{
            this.element.value = num.toFixed(2);
        }
    }

    addListeners(){
        this.element.onchange = (e) => (this.setFunc(e.target.value/this.unitMultiply));
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

    checkToExponent(num){
        if (Math.abs(num) > 1e4){
            return true;
        }
        return false;
    }

    disable(){
        this.element.disabled = true;
    }
}