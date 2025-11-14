/**
 * title scene - the first scene shown when the game starts
 */
export default class TitleScene extends Phaser.Scene {
    constructor() {
        super({ key: 'TitleScene' });
    }

    preload() {
        this.load.image('titleHero', 'assets/images/player_ashen.png');
    }

    create() {
        const { width, height } = this.cameras.main;

        // background
        this.cameras.main.setBackgroundColor('#140b26');

        // hero illustration
        const hero = this.add.image(width / 2 + 180, height / 2 + 40, 'titleHero');
        hero.setScale(2);

        // add title text
        this.add.text(
            width / 2,
            height / 2 - 140,
            'echoes of ember',
            {
                fontSize: '56px',
                fill: '#ffd38a',
                fontFamily: 'Arial',
                stroke: '#000000',
                strokeThickness: 6
            }
        ).setOrigin(0.5);

        // subtitle
        this.add.text(
            width / 2,
            height / 2 - 80,
            'ashen forest  •  molten depths',
            {
                fontSize: '22px',
                fill: '#ffffff',
                fontFamily: 'Arial'
            }
        ).setOrigin(0.5);

        // add instruction text
        this.add.text(
            width / 2,
            height / 2 + 20,
            'space / enter  -  start',
            {
                fontSize: '20px',
                fill: '#ffffff',
                fontFamily: 'Arial'
            }
        ).setOrigin(0.5);

        this.add.text(
            width / 2,
            height / 2 + 60,
            'move - arrows / wasd   •   jump - space   •   double jump - space twice',
            {
                fontSize: '18px',
                fill: '#ffffff',
                fontFamily: 'Arial'
            }
        ).setOrigin(0.5);

        // add keyboard input
        this.cursors = this.input.keyboard.createCursorKeys();
        this.spaceKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
        this.enterKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ENTER);
    }

    update() {
        // transition to level select on space or enter
        if (Phaser.Input.Keyboard.JustDown(this.spaceKey) || 
            Phaser.Input.Keyboard.JustDown(this.enterKey)) {
            this.scene.start('LevelSelectScene');
        }
    }
}

