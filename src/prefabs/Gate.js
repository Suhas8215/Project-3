/**
 * Gate/Door prefab - blocks passage until opened
 * Opens when lever is activated
 */
export default class Gate extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, texture = 'door_closed') {
        super(scene, x, y, texture);
        
        scene.add.existing(this);
        scene.physics.add.existing(this);
        
        this.setOrigin(0.5, 1); // Anchor at bottom
        this.body.setImmovable(true);
        this.body.setAllowGravity(false);
        
        this.isOpen = false;
    }

    open() {
        if (this.isOpen) return;
        
        this.isOpen = true;
        this.setTexture('door_open');
        this.body.enable = false; // Disable collision
        
        // Fade out effect
        this.scene.tweens.add({
            targets: this,
            alpha: 0.3,
            duration: 500
        });
        
        // Play open sound if available
        if (this.scene.sound) {
            // this.scene.sound.play('doorOpenSound', { volume: 0.6 });
        }
    }

    close() {
        this.isOpen = false;
        this.setTexture('door_closed');
        this.body.enable = true;
        this.setAlpha(1);
    }
}

