/**
 * game over scene - shown when the game ends
 * allows player to restart or return to level select
 */
export default class GameOverScene extends Phaser.Scene {
    constructor() {
        super({ key: 'GameOverScene' });
    }

    init(data) {
        // data can contain information about game completion
        this.won = data.won || false;
        this.score = data.score || 0;
        this.level = data.level || 0;
    }

    create() {
        const { width, height } = this.cameras.main;

        // mood background
        this.cameras.main.setBackgroundColor(this.won ? '#123322' : '#330b15');

        // add game over text
        const gameOverText = this.won ? 'molten depths cleared!' : 'out of hearts';
        this.add.text(
            width / 2,
            height / 2 - 120,
            gameOverText,
            {
                fontSize: '48px',
                fill: this.won ? '#00ff00' : '#ff0000',
                fontFamily: 'Arial'
            }
        ).setOrigin(0.5);

        // level label
        const levelLabel = this.level
            ? `level ${this.level} - ${this.won ? 'complete' : 'failed'}`
            : '';

        if (levelLabel) {
            this.add.text(
                width / 2,
                height / 2 - 70,
                levelLabel,
                {
                    fontSize: '22px',
                    fill: '#ffffff',
                    fontFamily: 'Arial'
                }
            ).setOrigin(0.5);
        }

        // add score if available
        if (this.score > 0) {
            this.add.text(
                width / 2,
                height / 2 - 30,
                `Score: ${this.score}`,
                {
                    fontSize: '24px',
                    fill: '#ffffff',
                    fontFamily: 'Arial'
                }
            ).setOrigin(0.5);
        }

        // add restart instruction
        this.add.text(
            width / 2,
            height / 2 + 20,
            'space - retry this level   •   enter - level select   •   esc - title',
            {
                fontSize: '18px',
                fill: '#ffffff',
                fontFamily: 'Arial'
            }
        ).setOrigin(0.5);

        // add input
        this.spaceKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
        this.enterKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ENTER);
        this.escKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ESC);
    }

    update() {
        if (Phaser.Input.Keyboard.JustDown(this.spaceKey)) {
            // retry same level with a fresh 3-heart run
            if (this.level === 1) {
                this.scene.start('Level1Scene', { fromRestart: false });
            } else if (this.level === 2) {
                this.scene.start('Level2Scene', { fromRestart: false });
            } else {
                this.scene.start('LevelSelectScene');
            }
        } else if (Phaser.Input.Keyboard.JustDown(this.enterKey)) {
            this.scene.start('LevelSelectScene');
        } else if (Phaser.Input.Keyboard.JustDown(this.escKey)) {
            this.scene.start('TitleScene');
        }
    }
}

