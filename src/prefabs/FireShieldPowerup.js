/**
 * power-up that grants the player temporary fire shield
 */
export default class FireShieldPowerup extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, texture = 'fireShieldFlag') {
        super(scene, x, y, texture);

        scene.add.existing(this);
        scene.physics.add.existing(this);

        this.body.setAllowGravity(false);
        this.body.setImmovable(true);
    }

    applyTo(player) {
        // grant shield effect for a few seconds
        if (!player) return;

        player.hasFireShield = true;
        player.fireShieldActiveUntil = player.scene.time.now + 5000;

        // optional: visually indicate shield using tint
        player.setTint(0xffaa00);

        this.destroy();
    }
}


