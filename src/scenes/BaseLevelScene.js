import Phaser from 'phaser';

/**
 * Base level scene class that other level scenes can extend
 * Contains common functionality for all levels
 */
export default class BaseLevelScene extends Phaser.Scene {
    constructor(config) {
        super(config);
        this.levelName = config.key || 'BaseLevel';
    }

    create() {
        // Common setup for all levels
        this.setupCamera();
        this.setupInput();
        
        // Override in child classes
        this.createLevel();
    }

    setupCamera() {
        // Set world bounds (adjust based on level size)
        // Should be roughly 3 screen widths wide
        this.physics.world.setBounds(0, 0, 2400, 600);
        
        // Camera will follow player (set in createLevel)
        this.cameras.main.setBounds(0, 0, 2400, 600);
    }

    setupInput() {
        // Common input setup
        this.cursors = this.input.keyboard.createCursorKeys();
        this.wasdKeys = this.input.keyboard.addKeys('W,S,A,D');
        
        // ESC to return to level select
        this.escKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ESC);
    }

    createLevel() {
        // Override this method in child classes
        console.warn('createLevel() should be overridden in child class');
    }

    update() {
        // Handle ESC to return to level select
        if (Phaser.Input.Keyboard.JustDown(this.escKey)) {
            this.scene.start('LevelSelectScene');
        }
    }

    // Helper method to create player (override as needed)
    createPlayer(x, y) {
        // Override in child classes
        console.warn('createPlayer() should be overridden in child class');
        return null;
    }

    // Helper method to create collectibles
    createCollectible(x, y, type = 'default') {
        // Override in child classes
        console.warn('createCollectible() should be overridden in child class');
        return null;
    }

    // Helper method to create platforms
    createPlatform(x, y, width, height) {
        // Override in child classes
        console.warn('createPlatform() should be overridden in child class');
        return null;
    }

    // Helper method to check level completion
    checkLevelComplete() {
        // Override in child classes
        return false;
    }

    // Method to handle level completion
    completeLevel() {
        // Transition to next level or game over scene
        // Override in child classes
        console.log('Level completed!');
    }
}

