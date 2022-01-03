export default class Arrow{
    constructor(sceneObj){
        this.sceneObj = sceneObj;
        this.rect = this.sceneObj.add.rectangle(0, -25, 4, 50, 0xffffff);
        this.triangle = this.sceneObj.add.triangle(0, -50, -10, 0, 0, -10, 10, 0, 0xffffff);
        this.triangle.setOrigin(0, 0);

        this.group = this.sceneObj.add.container(0, 0, [this.rect, this.triangle]);
    }

    setPosition(x, y){
        this.group.setPosition(x, y);
    }

    setAngle(angle){
        this.group.angle = angle;
    }

    setNewHeight(height){
        this.rect.displayHeight = height;
        this.rect.setPosition(0, -(height/2));
        this.triangle.setPosition(0, -(height));
    }

    setNewWidth(width){
        this.rect.displayWidth = width;
        this.triangle.displayWidth = width * 5;
    }

    destroy(){
        this.group.destroy(true);
    }
}