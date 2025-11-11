import Phaser from 'phaser';
import BaseLevelScene from './BaseLevelScene.js';
import Player from '../prefabs/Player.js';
import Collectible from '../prefabs/Collectible.js';
import ParticleManager from '../utils/ParticleManager.js';

/**
 * Level 1 Scene - Template for creating levels
 * 
 * UNIQUE MECHANIC: [Describe your level's unique mechanic here]
 * 
 * To implement this level:
 * 1. Load assets in preload() method
 * 2. Create level geometry in createLevel() method
 * 3. Set up collisions and interactions
 * 4. Implement level completion condition
 * 5. Add particle effects and audio
 */
export default class Level1Scene extends BaseLevelScene {
    constructor() {
        super({ key: 'Level1Scene' });
    }

    preload() {
        // Load assets for this level
        // Example:
        // this.load.image('ground', 'assets/images/ground.png');
        // this.load.image('platform', 'assets/images/platform.png');
        // this.load.image('player', 'assets/images/player.png');
        // this.load.image('collectible', 'assets/images/collectible.png');
        // this.load.image('particle', 'assets/images/particle.png');
        // this.load.audio('jumpSound', 'assets/audio/jump.mp3');
        // this.load.audio('collectSound', 'assets/audio/collect.mp3');
    }

    createLevel() {
        // Create ground
        // Example:
        // this.ground = this.physics.add.staticGroup();
        // this.ground.create(400, 550, 'ground');
        
        // Create platforms
        // Example:
        // this.platforms = this.physics.add.staticGroup();
        // this.platforms.create(600, 400, 'platform');
        
        // Create collectibles
        // Example:
        // this.collectibles = this.physics.add.group();
        // this.collectibles.add(new Collectible(this, 500, 300, 'collectible'));
        
        // Create player
        // Example:
        // this.player = new Player(this, 100, 400, 'player');
        
        // Set up camera to follow player
        // this.cameras.main.startFollow(this.player);
        
        // Set up collisions
        // this.physics.add.collider(this.player, this.ground);
        // this.physics.add.collider(this.player, this.platforms);
        // this.physics.add.overlap(this.player, this.collectibles, this.collectItem, null, this);
        
        // Set up particle systems
        // const particleManager = new ParticleManager(this);
        // const moveParticles = particleManager.createMovementParticles();
        // const jumpParticles = particleManager.createJumpParticles();
        // this.player.setupParticles(moveParticles, jumpParticles);
        
        // Set up audio
        // this.jumpSound = this.sound.add('jumpSound');
        
        // Track collectibles collected
        this.collectiblesCollected = 0;
        this.totalCollectibles = 0; // Set this based on collectibles created
    }

    update() {
        super.update();
        
        // Update player
        if (this.player) {
            this.player.update();
        }
        
        // Check for level completion
        if (this.checkLevelComplete()) {
            this.completeLevel();
        }
    }

    collectItem(player, collectible) {
        if (collectible.collect()) {
            this.collectiblesCollected++;
            // Play collection sound
            // this.sound.play('collectSound');
            
            // Emit collection particles
            // const particles = this.add.particles(collectible.x, collectible.y, 'particle', {
            //     speed: { min: 50, max: 150 },
            //     scale: { start: 0.6, end: 0 },
            //     lifespan: 500,
            //     tint: 0xffff00
            // });
        }
    }

    checkLevelComplete() {
        // Implement level completion condition
        // Example: collect all collectibles and reach end point
        // return this.collectiblesCollected >= this.totalCollectibles && 
        //        this.player.x > 2200;
        return false;
    }

    completeLevel() {
        // Transition to game over scene with win state
        this.scene.start('GameOverScene', {
            won: true,
            score: this.collectiblesCollected * 100,
            level: 1
        });
    }
}

