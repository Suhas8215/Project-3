import TitleScene from './scenes/TitleScene.js';
import LevelSelectScene from './scenes/LevelSelectScene.js';
import GameOverScene from './scenes/GameOverScene.js';
import Level1Scene from './scenes/Level1Scene.js';
import Level2Scene from './scenes/Level2Scene.js';

const config = {
    type: Phaser.AUTO,
    width: window.innerWidth || 800,
    height: window.innerHeight || 600,
    parent: 'game-container',
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 300 },
            debug: false // Set to true for debugging physics
        }
    },
    scene: [
        TitleScene,
        LevelSelectScene,
        GameOverScene,
        Level1Scene,
        Level2Scene
    ],
    scale: {
        mode: Phaser.Scale.NONE
    },
};

const game = new Phaser.Game(config);

