import Phaser from 'phaser';

/**
 * Game Over scene - shown when the game ends
 * Allows player to restart or return to level select
 */
export default class GameOverScene extends Phaser.Scene {
    constructor() {
        super({ key: 'GameOverScene' });
    }

    init(data) {
        // Data can contain information about game completion
        this.won = data.won || false;
        this.score = data.score || 0;
        this.level = data.level || 0;
    }

    create() {
        // Add game over text
        const gameOverText = this.won ? 'Level Complete!' : 'Game Over';
        this.add.text(
            this.cameras.main.width / 2,
            this.cameras.main.height / 2 - 100,
            gameOverText,
            {
                fontSize: '48px',
                fill: this.won ? '#00ff00' : '#ff0000',
                fontFamily: 'Arial'
            }
        ).setOrigin(0.5);

        // Add score if available
        if (this.score > 0) {
            this.add.text(
                this.cameras.main.width / 2,
                this.cameras.main.height / 2 - 20,
                `Score: ${this.score}`,
                {
                    fontSize: '24px',
                    fill: '#ffffff',
                    fontFamily: 'Arial'
                }
            ).setOrigin(0.5);
        }

        // Add restart instruction
        this.add.text(
            this.cameras.main.width / 2,
            this.cameras.main.height / 2 + 50,
            'Press SPACE to Return to Level Select',
            {
                fontSize: '20px',
                fill: '#ffffff',
                fontFamily: 'Arial'
            }
        ).setOrigin(0.5);

        // Add input
        this.spaceKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
        this.escKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ESC);
    }

    update() {
        if (Phaser.Input.Keyboard.JustDown(this.spaceKey) || 
            Phaser.Input.Keyboard.JustDown(this.escKey)) {
            this.scene.start('LevelSelectScene');
        }
    }
}

