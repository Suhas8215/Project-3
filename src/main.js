import Phaser from 'phaser';
import TitleScene from './scenes/TitleScene.js';
import LevelSelectScene from './scenes/LevelSelectScene.js';
import GameOverScene from './scenes/GameOverScene.js';
// Import level scenes as they are created
// import Level1Scene from './scenes/Level1Scene.js';
// import Level2Scene from './scenes/Level2Scene.js';

const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
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
        // Add level scenes here as they are created
        // Level1Scene,
        // Level2Scene
    ],
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH
    }
};

const game = new Phaser.Game(config);

