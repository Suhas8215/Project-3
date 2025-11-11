import Phaser from 'phaser';

/**
 * Title scene - the first scene shown when the game starts
 */
export default class TitleScene extends Phaser.Scene {
    constructor() {
        super({ key: 'TitleScene' });
    }

    create() {
        // Add title text
        this.add.text(
            this.cameras.main.width / 2,
            this.cameras.main.height / 2 - 100,
            'Platformer Game',
            {
                fontSize: '48px',
                fill: '#ffffff',
                fontFamily: 'Arial'
            }
        ).setOrigin(0.5);

        // Add instruction text
        this.add.text(
            this.cameras.main.width / 2,
            this.cameras.main.height / 2 + 50,
            'Press SPACE to Start',
            {
                fontSize: '24px',
                fill: '#ffffff',
                fontFamily: 'Arial'
            }
        ).setOrigin(0.5);

        // Add keyboard input
        this.cursors = this.input.keyboard.createCursorKeys();
        this.spaceKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
    }

    update() {
        // Transition to level select on space or enter
        if (Phaser.Input.Keyboard.JustDown(this.spaceKey) || 
            Phaser.Input.Keyboard.JustDown(this.cursors.enter)) {
            this.scene.start('LevelSelectScene');
        }
    }
}

