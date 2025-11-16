/**
 * Lever prefab - interactable lever that can be activated by player
 * Changes sprite when activated and triggers callbacks
 */
export default class Lever extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, texture = 'lever') {
        super(scene, x, y, texture);
        
        scene.add.existing(this);
        scene.physics.add.existing(this);
        
        this.setOrigin(0.5, 0.5);
        this.body.setAllowGravity(false);
        this.body.setImmovable(true);
        this.body.setSize(this.width * 0.8, this.height * 0.8);
        
        this.activated = false;
        this.canActivate = false; // Only activate after all crystals collected
        this.onActivate = null; 
    }

    update() {
        if (!this.canActivate || this.activated) return;
        
        // Visual feedback - slight glow when player is near
        if (this.scene.player) {
            const distance = Phaser.Math.Distance.Between(
                this.x, this.y,
                this.scene.player.x, this.scene.player.y
            );
            
            if (distance < 80) {
                this.setTint(0xffffaa);
            } else {
                this.clearTint();
            }
        }
    }

    activate() {
        if (this.activated || !this.canActivate) return false;
        
        this.activated = true;
        this.setTexture('lever_right');
        this.setTint(0x88ff88);
        
        // Play activation sound if available
        if (this.scene.sound) {
        }
        
        if (typeof this.onActivate === 'function') {
            this.onActivate();
        }
        
        return true;
    }

    setCanActivate(canActivate) {
        this.canActivate = canActivate;
        if (canActivate && !this.activated) {
            this.setTint(0xffffaa);
        }
    }
}

