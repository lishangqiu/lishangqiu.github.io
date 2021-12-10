import {SCREEN_SCALE_INCREASE} from "./config.js"

const sliderScale = 0.05;
var plusScale = 0.05;
var minusScale = 0.04;
const plusMinusOffset = 19;
const lineLengthOffset = 3;
const imageTint = 0x999999;

export default class SliderUI{
    constructor(posX, posY, length, sceneObj, color){
        this.img = sceneObj.add.image(posX*SCREEN_SCALE_INCREASE, posY*SCREEN_SCALE_INCREASE, "slider");
        this.img.setScale(plusScale, plusScale);

        sceneObj.add.graphics()
        .lineStyle(2*SCREEN_SCALE_INCREASE, color, 1)
        .strokePoints([{x: this.img.x, y: this.img.y - lineLengthOffset}, {x: this.img.x, y: this.img.y+length*SCREEN_SCALE_INCREASE+lineLengthOffset*2}]);

        this.img.slider = sceneObj.plugins.get('rexsliderplugin').add(this.img, {
            endPoints: [{
                x: this.img.x,
                y: this.img.y,
            },
            {
                x: this.img.x,
                y: this.img.y+length*SCREEN_SCALE_INCREASE,
            }],
            value: 1
        });
        //this.img.depth = 1*SCREEN_SCALE_INCREASE;

        this.plusImage = sceneObj.add.image(posX*SCREEN_SCALE_INCREASE, posY*SCREEN_SCALE_INCREASE - plusMinusOffset, "plus_button");
        this.plusImage.setScale(plusScale, plusScale);
        this.plusImage.setInteractive({useHandCursor: true}).on("pointerdown", () => this.onPlus()).on("pointerover", () => this.setTint(this.plusImage, imageTint)).on("pointerout", () => this.setTint(this.plusImage, 0xffffff));


        this.minusImage = sceneObj.add.image(posX*SCREEN_SCALE_INCREASE, posY*SCREEN_SCALE_INCREASE + length*SCREEN_SCALE_INCREASE + lineLengthOffset*2 + plusMinusOffset, "minus_button")
        this.minusImage.setScale(minusScale, minusScale);
        this.minusImage.setInteractive({useHandCursor: true}).on("pointerdown", () => this.onMinus()).on("pointerover", () => this.setTint(this.minusImage, imageTint)).on("pointerout", () => this.setTint(this.minusImage, 0xffffff));
    }

    onPlus(){
        console.log(this.img.slider.value);
        this.img.slider.value -= 0.01;
    }

    onMinus(){
        this.img.slider.value += 0.01;
    }

    setTint(imageObj, tint){
        imageObj.setTint(tint);
    }
}