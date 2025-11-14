/**
 * simple slime enemy
 * can either patrol between bounds, or attach visually to a moving platform.
 * this uses manual positioning (no arcade body) so it behaves deterministically.
 */
export default class SlimeEnemy extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y, texture = 'slime', leftBound = x - 50, rightBound = x + 50, speed = 50) {
        super(scene, x, y, texture);

        scene.add.existing(this);

        this.leftBound = leftBound;
        this.rightBound = rightBound;
        this.speed = speed;
        this.direction = 1;

        // when attached to a platform, the slime simply rides that platform
        this.attachedPlatform = null;
        this.offsetY = 40;
    }

    attachToPlatform(platform, offsetY = 40) {
        this.attachedPlatform = platform;
        this.offsetY = offsetY;
    }

    preUpdate(time, delta) {
        super.preUpdate(time, delta);

        // if attached to a platform, follow its position exactly
        if (this.attachedPlatform && this.attachedPlatform.active) {
            this.setPosition(this.attachedPlatform.x, this.attachedPlatform.y - this.offsetY);
            return;
        }

        // otherwise, patrol between leftbound and rightbound
        const dx = this.direction * (this.speed * (delta / 1000));
        this.x += dx;

        if (this.direction > 0 && this.x >= this.rightBound) {
            this.direction = -1;
            this.setFlipX(true);
        } else if (this.direction < 0 && this.x <= this.leftBound) {
            this.direction = 1;
            this.setFlipX(false);
        }
    }
}


