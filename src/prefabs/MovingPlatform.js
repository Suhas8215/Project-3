/**
 * simple moving platform that travels back and forth between two points
 */
export default class MovingPlatform extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, texture = 'movingPlatform', fromX = x, toX = x, speed = 60) {
        super(scene, x, y, texture);

        scene.add.existing(this);
        scene.physics.add.existing(this);

        this.body.setImmovable(true);
        this.body.allowGravity = false;

        this.fromX = fromX;
        this.toX = toX;
        this.speed = speed;
        this.direction = 1;
    }

    preUpdate(time, delta) {
        super.preUpdate(time, delta);

        // move horizontally between fromx and tox
        const vx = this.direction * this.speed;
        this.body.setVelocityX(vx);

        if (this.direction > 0 && this.x >= this.toX) {
            this.x = this.toX;
            this.direction = -1;
        } else if (this.direction < 0 && this.x <= this.fromX) {
            this.x = this.fromX;
            this.direction = 1;
        }
    }
}


