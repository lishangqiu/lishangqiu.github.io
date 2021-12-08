const sliderScale = 0.05;
var plusScale = 0.05;
var minusScale = 0.04;
const plusMinusOffset = 19;
const lineLengthOffset = 3;
const imageTint = 0x999999;

class SliderUI{
    constructor(posX, posY, length, sceneObj, color){
        this.img = sceneObj.add.image(posX, posY, "slider").setScale(sliderScale, sliderScale);

        sceneObj.add.graphics()
        .lineStyle(2, color, 1)
        .strokePoints([{x: this.img.x, y: this.img.y - lineLengthOffset}, {x: this.img.x, y: this.img.y+length+lineLengthOffset*2}]);

        this.img.slider = sceneObj.plugins.get('rexsliderplugin').add(this.img, {
            endPoints: [{
                x: this.img.x,
                y: this.img.y,
            },
            {
                x: this.img.x,
                y: this.img.y+length,
            }],
            value: 0.25
        });
        this.img.depth = 1;

        this.plusImage = sceneObj.add.image(posX, posY - plusMinusOffset, "plus_button");
        this.plusImage.setScale(plusScale, plusScale)
        this.plusImage.setInteractive({useHandCursor: true}).on("pointerdown", () => this.onPlus()).on("pointerover", () => this.setTint(this.plusImage, imageTint)).on("pointerout", () => this.setTint(this.plusImage, 0xffffff));


        this.minusImage = sceneObj.add.image(posX, posY +length+lineLengthOffset*2 + plusMinusOffset, "minus_button")
        this.minusImage.setScale(minusScale, minusScale);
        this.minusImage.setInteractive({useHandCursor: true}).on("pointerdown", () => this.onMinus()).on("pointerover", () => this.setTint(this.minusImage, imageTint)).on("pointerout", () => this.setTint(this.minusImage, 0xffffff));
    }

    onPlus(){
        this.img.slider.value -= 0.01;
    }

    onMinus(){
        this.img.slider.value += 0.01;
    }

    setTint(imageObj, tint){
        imageObj.setTint(tint);
    }
}