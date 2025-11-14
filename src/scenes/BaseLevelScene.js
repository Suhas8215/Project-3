/**
 * base level scene class that other level scenes can extend
 * contains common functionality for all levels
 */
export default class BaseLevelScene extends Phaser.Scene {
    constructor(config) {
        super(config);
        this.levelName = config.key || 'BaseLevel';
        this.levelWidth = 2400;
        this.levelHeight = 600;
    }

    create() {
        // common setup for all levels
        this.setupInput();

        // sync level size with current canvas size
        this.levelWidth = this.levelWidth || this.scale.width;
        this.levelHeight = this.scale.height;

        // child classes should configure geometry, player, and collectibles here
        this.createLevel();

        // after level is created we can safely configure camera bounds/follow
        this.setupCamera();
    }

    setupCamera() {
        // set world bounds (roughly 3 screen widths wide by default)
        this.physics.world.setBounds(0, 0, this.levelWidth, this.levelHeight);

        // camera bounds match world
        this.cameras.main.setBounds(0, 0, this.levelWidth, this.levelHeight);

        // if a player exists, enable smooth follow and deadzone framing
        if (this.player) {
            this.enableCameraFollow(this.player);
        }
    }

    setupInput() {
        // common input setup
        this.cursors = this.input.keyboard.createCursorKeys();
        this.wasdKeys = this.input.keyboard.addKeys('W,S,A,D');
        this.spaceKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
        
        // esc to return to level select
        this.escKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ESC);
    }

    createLevel() {
        // override this method in child classes
        console.warn('createLevel() should be overridden in child class');
    }

    update() {
        // handle esc to return to level select
        if (Phaser.Input.Keyboard.JustDown(this.escKey)) {
            this.scene.start('LevelSelectScene');
        }
    }

    // helper method to create player (override as needed)
    createPlayer(x, y) {
        // override in child classes
        console.warn('createPlayer() should be overridden in child class');
        return null;
    }

    // helper method to create collectibles
    createCollectible(x, y, type = 'default') {
        // override in child classes
        console.warn('createCollectible() should be overridden in child class');
        return null;
    }

    // helper method to create platforms
    createPlatform(x, y, width, height) {
        // override in child classes
        console.warn('createPlatform() should be overridden in child class');
        return null;
    }

    // helper method to check level completion
    checkLevelComplete() {
        // override in child classes
        return false;
    }

    // method to handle level completion
    completeLevel() {
        // transition to next level or game over scene
        // override in child classes
        console.log('Level completed!');
    }

    /**
     * helper to configure smooth camera follow and deadzone behavior.
     */
    enableCameraFollow(target) {
        const cam = this.cameras.main;

        // smooth follow with slight delay for horizontal and vertical movement
        cam.startFollow(target, true, 0.08, 0.12);

        // deadzone keeps the player roughly centered but allows some movement
        cam.setDeadzone(200, 150);
    }
}

