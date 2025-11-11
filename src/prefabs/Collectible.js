import Phaser from 'phaser';

/**
 * Collectible item prefab
 * Can be collected by the player
 */
export default class Collectible extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, texture = 'collectible', type = 'default') {
        super(scene, x, y, texture);
        
        scene.add.existing(this);
        scene.physics.add.existing(this);
        
        this.type = type;
        this.collected = false;
        
        // Make collectible non-solid (sensor)
        this.body.setAllowGravity(false);
        this.body.setImmovable(true);
    }

    collect() {
        if (!this.collected) {
            this.collected = true;
            // Play collection sound if available
            if (this.scene.sound) {
                // this.scene.sound.play('collectSound');
            }
            // Destroy or hide the collectible
            this.destroy();
            return true;
        }
        return false;
    }
}

