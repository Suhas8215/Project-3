import Phaser from 'phaser';

/**
 * Player prefab class
 * Handles player movement, jumping, and physics
 */
export default class Player extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, texture = 'player') {
        super(scene, x, y, texture);
        
        scene.add.existing(this);
        scene.physics.add.existing(this);
        
        // Player physics properties
        this.setCollideWorldBounds(true);
        this.setBounce(0);
        this.setDragX(200);
        
        // Player movement properties
        this.speed = 200;
        this.jumpVelocity = -400;
        this.canJump = false;
        
        // Input
        this.cursors = scene.cursors;
        this.wasdKeys = scene.wasdKeys;
        
        // Particle system for movement (will be set up in scene)
        this.moveParticles = null;
        this.jumpParticles = null;
    }

    update() {
        // Horizontal movement
        const leftKey = this.cursors.left.isDown || this.wasdKeys.A.isDown;
        const rightKey = this.cursors.right.isDown || this.wasdKeys.D.isDown;
        
        if (leftKey) {
            this.setVelocityX(-this.speed);
            this.setFlipX(true);
            // Emit movement particles if available
            if (this.moveParticles) {
                this.moveParticles.setPosition(this.x, this.y + this.height / 2);
                this.moveParticles.start();
            }
        } else if (rightKey) {
            this.setVelocityX(this.speed);
            this.setFlipX(false);
            // Emit movement particles if available
            if (this.moveParticles) {
                this.moveParticles.setPosition(this.x, this.y + this.height / 2);
                this.moveParticles.start();
            }
        } else {
            this.setVelocityX(0);
            if (this.moveParticles) {
                this.moveParticles.stop();
            }
        }
        
        // Jumping
        const jumpKey = Phaser.Input.Keyboard.JustDown(this.cursors.up) || 
                       Phaser.Input.Keyboard.JustDown(this.wasdKeys.W);
        
        if (jumpKey && this.canJump && this.body.touching.down) {
            this.setVelocityY(this.jumpVelocity);
            this.canJump = false;
            
            // Emit jump particles if available
            if (this.jumpParticles) {
                this.jumpParticles.setPosition(this.x, this.y + this.height);
                this.jumpParticles.explode(10);
            }
        }
        
        // Reset jump ability when touching ground
        if (this.body.touching.down) {
            this.canJump = true;
        }
    }

    // Method to set up particle systems
    setupParticles(moveParticles, jumpParticles) {
        this.moveParticles = moveParticles;
        this.jumpParticles = jumpParticles;
    }
}

