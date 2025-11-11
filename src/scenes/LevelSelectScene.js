import Phaser from 'phaser';

/**
 * Level select scene - allows players to choose which level to play
 * Press number keys 1, 2, 3, etc. to select levels
 */
export default class LevelSelectScene extends Phaser.Scene {
    constructor() {
        super({ key: 'LevelSelectScene' });
    }

    create() {
        // Add title
        this.add.text(
            this.cameras.main.width / 2,
            100,
            'Select Level',
            {
                fontSize: '36px',
                fill: '#ffffff',
                fontFamily: 'Arial'
            }
        ).setOrigin(0.5);

        // Add level selection instructions
        const instructions = [
            'Press 1 for Level 1',
            'Press 2 for Level 2',
            'Press 3 for Level 3',
            'Press ESC to return to title'
        ];

        instructions.forEach((text, index) => {
            this.add.text(
                this.cameras.main.width / 2,
                200 + (index * 40),
                text,
                {
                    fontSize: '20px',
                    fill: '#ffffff',
                    fontFamily: 'Arial'
                }
            ).setOrigin(0.5);
        });

        // Create number key inputs for level selection
        this.input.keyboard.on('keydown-ONE', () => {
            // this.scene.start('Level1Scene');
            console.log('Level 1 selected - implement Level1Scene');
        });

        this.input.keyboard.on('keydown-TWO', () => {
            // this.scene.start('Level2Scene');
            console.log('Level 2 selected - implement Level2Scene');
        });

        this.input.keyboard.on('keydown-THREE', () => {
            // this.scene.start('Level3Scene');
            console.log('Level 3 selected - implement Level3Scene');
        });

        // ESC to return to title
        this.escKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ESC);
    }

    update() {
        if (Phaser.Input.Keyboard.JustDown(this.escKey)) {
            this.scene.start('TitleScene');
        }
    }
}

