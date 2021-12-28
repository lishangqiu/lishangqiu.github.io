import Game from "./main_scene.js";
import {game} from "./main.js"
import { SIZE_WIDTH_SCREEN, SIZE_HEIGHT_SCREEN } from './config.js'

const gravitationalConstant = 6.67428e-11;
//const screenScale = 0.00000470883; // pixel/meter
const screenScale = 0.000000002; // pixel/meter
const resolutionTime = 4000/20; // simulated second/frame
const radiusUpscale = 300;
const labelDegree = -225;

var middleX = SIZE_WIDTH_SCREEN/2;
var middleY = SIZE_HEIGHT_SCREEN/2;

var _idIndex = 0;
export {resolutionTime, radiusUpscale, screenScale};

// pos vector(aphelion), velocity vector(mininum speed), radius, mass, texture name
var presets = {
    "Sun": [new Victor(0, 0), new Victor(0, 0), 69.34e6, 1.989e30, "Sun"],
    "Mercury": [new Victor(69.817e9, 0), new Victor(0,-38860), 2.439766e6, 0.33010e24, "Mercury"],
    "Venus": [new Victor(108.939e9, 0), new Victor(0, -34790), 6.05177718e6, 4.867e24, "Venus"],
    "Earth": [new Victor(152.1e9, 0), new Victor(0, -29290), 6.73e6, 5.972e24, "Earth"],
    "Mars": [new Victor(249.261e9, 0), new Victor(0, -21970), 3.3895e6, 0.64169e24, "Mars"],

}

export default class GravityBody{
    // starting_pos(note coordinates start from the center as 0,0), starting_velocity, radius, (density or mass) in SI units
    constructor(options_temp){
        var options = options_temp;
        if (options_temp.preset_name == "Custom"){
            this.pos = options.starting_pos.clone();
            this.velocity = options.starting_velocity.clone();
            this.radius = options.radius;

            if (options.density){
                this.mass = (4/3)*Math.PI*(Math.pow(options.radius,3)) * options.density;
            }
            else{
                this.mass = options.mass;
            }
            this.textureName = options.textureName;
        }
        else{
            this.setPreset(options_temp.preset_name);
        }
        
        this.sceneObj = options.sceneObj;
        this.lastSimulated = new Date().getTime();

        this.id = _idIndex;
        _idIndex += 1;

        this.pathPoints = [];
        this.lastPoint = this.pos.clone().multiplyScalar(screenScale);
        this.name = options.name;
        this.preset = options.preset_name;
        this.initDraw(this.radius, this.textureName);
        this.lineColor = options.lineColor;

        this.graphicLines = this.sceneObj.add.graphics();
        this.graphicLines.fillStyle(this.lineColor, 1.0);
    }
    
    setPreset(presetName){
        this.pos = presets[presetName][0].clone();
        this.velocity = presets[presetName][1].clone();
        this.radius = presets[presetName][2];
        this.mass = presets[presetName][3];
        this.textureName = presets[presetName][4];
    }

    updatePreset(presetName){
        this.deleteItem();
        this.preset = presetName;
        this.setPreset(presetName);
        this.initDraw(this.radius, this.textureName);
        this.drawObjPos();
    }

    // returns displacement(unit: m)
    simGravity(){
        // this is seperate from updatePos because we might want to calculate path
        //var deltaTime = ((new Date().getTime() - this.lastSimulated) / 1000) * updateTime; // /1000 is to convert from ms to s
        //this.lastSimulated = new Date().getTime();
        if (this.deleted){
            return;
        }

        var currID = this.id;
        var mass = this.mass;
        var pos = this.pos;
        var radius = this.radius;

        
        // check if we've collided with something else
        Game.GravityBodies.forEach(function(item, index, array){
            if (item.id != currID && !item.invisible){
                var distVector = pos.clone().subtract(item.pos);
                //console.log(Math.sqrt(distVector.x*distVector.x + distVector.y*distVector.y));
                if (Math.sqrt(distVector.x*distVector.x + distVector.y*distVector.y) < ((item.radius + radius))*radiusUpscale){
                    if (item.radius <= radius){
                        Game.GravityBodies.splice(Game.GravityBodies.indexOf(item), 1);
                        item.deleteItem();
                        item.deleted = true;
                    }
                }
            }
        });

        var accelerations = [];
        Game.GravityBodies.forEach(function(item, index, array){
            if (item.id != currID && !item.invisible){
                accelerations.push(GravityBody.getGravityAcceleration(mass, item.mass, pos, item.pos));
            }
        });
        var gravitySumVelocity = GravityBody.addVectors(accelerations).multiplyScalar(resolutionTime);
        gravitySumVelocity.add(this.velocity);
        this.velocity = gravitySumVelocity;
        
        this.pos.add(gravitySumVelocity.clone().multiplyScalar(resolutionTime)); // add the displacement to the current position

        // Orbit drawing
        if (
            (Math.abs(((this.pos.x * screenScale) - this.lastPoint.x)) > 1.5) ||
            (Math.abs(((this.pos.y * screenScale) - this.lastPoint.y)) > 1.5)){
                //this.sceneObj.add.line(0, 0, this.lastPoint.x + middleX, this.lastPoint.y + middleY,
                    //(this.pos.x * screenScale) + middleX, (this.pos.y * screenScale) + middleY, 0xf8f9f0);
                //this.sceneObj.add.circle((this.pos.x * screenScale) + middleX, (this.pos.y * screenScale) + middleY, 1, 0xf8f9f0);
                this.graphicLines.fillPoint((this.pos.x * screenScale) + middleX, (this.pos.y * screenScale) + middleY, 2);
                this.lastPoint = this.pos.clone().multiplyScalar(screenScale);
        }

        return;
    }

    drawNewPos(){
        if (this.invisible){
            return;
        }
        for (let i=0;i<GravityBody.simTimes;i++){
            this.simGravity();
        }
        this.drawObjPos();
    }

    drawObjPos(){
        this.sprite.setPosition(this.pos.x * screenScale + middleX, this.pos.y * screenScale + middleY);

        var diplacements = this.getAngleDisplacements(this.radius * screenScale * radiusUpscale);
        this.label.setPosition(this.sprite.x - diplacements[0], this.sprite.y - diplacements[1] - this.label.displayHeight);
    }

    initDraw(radius, textureName){
        this.sprite = this.sceneObj.add.sprite(-1, -1, textureName).setInteractive({cursor: 'pointer'});
        this.sprite.displayWidth = radius * screenScale * radiusUpscale *2; // times two for diameter(scaling the image)
        this.sprite.scaleY = this.sprite.scaleX;

        this.sprite.on('pointerdown', () => {this.sceneObj.scene.get("UIScene").switchSideBar(this.id)});
        this.sprite.on('pointerout', () => {this.sprite.clearTint()});
        this.sprite.on('pointerover', () => {this.sprite.setTint(0xa5a5a5 );});

        this.label = this.sceneObj.add.text(-1, -1, this.name, {color:"#3fc6f3"}); 
        this.label.setFontSize(17);
        this.label.depth = 1;
    }

    getAngleDisplacements(radius){
        return [Math.cos((labelDegree/180)*Math.PI)*radius, Math.sin((labelDegree/180)*Math.PI)*radius]
    }

    deleteItem(){
        this.sprite.destroy(true);
        this.label.destroy(true);
    }

    setDirection(direction){
        this.velocity = MDToVictor(this.velocity.magnitude(), direction);
    }

    setMagnitude(magnitude){
        this.velocity = MDToVictor(magnitude, this.velocity.direction());
    }

    setRadius(radius){
        this.radius = radius;
        this.sprite.displayWidth = radius * screenScale * radiusUpscale *2;
        this.sprite.scaleY = this.sprite.scaleX;
    }

    setPosX(x){
        this.pos.x = x;
        this.drawObjPos();
    }

    setPosY(y){
        this.pos.y = y;
        this.drawObjPos();
    }

    updateName(name){
        this.name = name;
        this.label.setText(name);
        game.scene.getScene("UIScene").sidePanelObj.buttonsID[this.id].updateName(name);
    }

    setSpriteIcon(textureName){
        this.sprite.setTexture(textureName);
    }

    setInvisible(){
        this.sprite.setAlpha(0.2);
        this.label.setAlpha(0.2);
        this.invisible = true;
    }

    setAppear(){
        this.sprite.setAlpha(1);
        this.label.setAlpha(1);
        this.invisible = false;
    }
}

GravityBody.addVectors = function(vectors){
    var finalVecotr = new Victor(0,0);
    vectors.forEach(function(item, index, array) {
        finalVecotr.add(item);
    });
    return finalVecotr;
}

// returns the acceleration for the first object(m/s^2)
GravityBody.getGravityAcceleration = function(obj1Mass, obj2Mass, obj1Pos_, obj2Pos_){
    // (vector F) = ((G * m1 * m2)/r^2) * (vector r)  Note: F is mutual between the two objects(which is INSANE!)
    // (vector A1) = (vector F) /  m1

    // clone this just to make sure
    var obj1Pos = obj1Pos_.clone();
    var obj2Pos = obj2Pos_.clone();

    var direction = obj2Pos.subtract(obj1Pos); // yes it is correct(opposite of what you'd think)
    var magnitude = direction.magnitude();

    var F = (gravitationalConstant * obj1Mass * obj2Mass) / (magnitude*magnitude); // this is scalar F
    direction.normalize(); // keep the same direction
    direction.multiplyScalar(F); // now we get vector F

    var acceleration = direction.clone();
    acceleration.divideScalar(obj1Mass);

    return acceleration;
}

function MDToVictor(magnitude, direction){
    return new Victor(Math.abs(magnitude)*Math.cos(direction), Math.abs(magnitude)*Math.sin(direction));
}