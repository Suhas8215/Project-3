/**
 * level select scene - allows players to choose which level to play
 * press number keys 1, 2, 3, etc. to select levels
 */
export default class LevelSelectScene extends Phaser.Scene {
    constructor() {
        super({ key: 'LevelSelectScene' });
    }

    create() {
        const { width, height } = this.cameras.main;

        // soft gradient-style background using two large rectangles
        this.cameras.main.setBackgroundColor('#160b1f');
        const panel = this.add.rectangle(width / 2, height / 2, width * 0.7, height * 0.7, 0x261433, 0.9);
        panel.setStrokeStyle(3, 0xffd38a);

        // add title
        this.add.text(
            width / 2,
            height / 2 - 140,
            'choose your path',
            {
                fontSize: '40px',
                fill: '#ffd38a',
                fontFamily: 'Arial',
                stroke: '#000000',
                strokeThickness: 4
            }
        ).setOrigin(0.5);

        // level cards
        const levels = [
            {
                key: 'Level1Scene',
                label: '1  •  ashen forest',
                author: 'suhas',
                y: height / 2 - 20
            },
            {
                key: 'Level2Scene',
                label: '2  •  molten depths',
                author: 'tejas',
                y: height / 2 + 60
            }
        ];

        levels.forEach((level, index) => {
            const card = this.add.rectangle(width / 2, level.y, width * 0.45, 60, 0x39214f, 0.9);
            card.setStrokeStyle(2, 0xffffff);

            this.add.text(
                width / 2 - 140,
                level.y,
                level.label,
                {
                    fontSize: '22px',
                    fill: '#ffffff',
                    fontFamily: 'Arial'
                }
            ).setOrigin(0, 0.5);

            this.add.text(
                width / 2 + 140,
                level.y,
                level.author,
                {
                    fontSize: '18px',
                    fill: '#ffd38a',
                    fontFamily: 'Arial'
                }
            ).setOrigin(1, 0.5);
        });

        // footer instructions
        this.add.text(
            width / 2,
            height / 2 + 140,
            'press 1 or 2 to start • esc to return to title',
            {
                fontSize: '18px',
                fill: '#ffffff',
                fontFamily: 'Arial'
            }
        ).setOrigin(0.5);

        // create number key inputs for level selection
        this.input.keyboard.on('keydown-ONE', () => {
            this.scene.start('Level1Scene', { fromRestart: false });
        });

        this.input.keyboard.on('keydown-TWO', () => {
            this.scene.start('Level2Scene', { fromRestart: false });
        });

        // esc to return to title
        this.escKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ESC);
    }

    update() {
        if (Phaser.Input.Keyboard.JustDown(this.escKey)) {
            this.scene.start('TitleScene');
        }
    }
}

