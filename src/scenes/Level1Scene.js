import BaseLevelScene from './BaseLevelScene.js';
import Player from '../prefabs/Player.js';
import Collectible from '../prefabs/Collectible.js';
import ParticleManager from '../utils/ParticleManager.js';
import SlimeEnemy from '../prefabs/SlimeEnemy.js';
import Lever from '../prefabs/Lever.js';
import Gate from '../prefabs/Gate.js';

/**
 * Level 1: Ashen Forest
 * Tutorial and early movement-based challenges
 * 
 * UNIQUE MECHANIC: Lever-activated gate system - collect all crystals to unlock lever, 
 * then activate lever to open gate to exit portal
 * 
 * Features:
 * - 10 Glowing Crystals (collectibles)
 * - Tree stumps and platforms for jumping
 * - Vines (ladders) for vertical climbing
 * - Slime enemies patrolling
 * - Double jumping mechanics
 * - Particle effects and audio juice
 * - Smooth camera scrolling with dynamic vertical adjustment
 */
export default class Level1Scene extends BaseLevelScene {
    constructor() {
        super({ key: 'Level1Scene' });
        this.levelWidth = 2400; // ~3 screen widths
    }

    init(data) {
        // Hearts system (same as Level 2)
        this.maxHearts = 3;
        if (data && data.fromRestart && typeof data.hearts === 'number') {
            this.hearts = data.hearts;
        } else {
            this.hearts = this.maxHearts;
        }
        this.isRespawning = false;
    }

    preload() {
        // Load assets - using existing assets from assets/images
        this.load.image('player', 'assets/images/player_ashen.png');
        this.load.image('ground', 'assets/images/ground_stone.png');
        this.load.image('platform', 'assets/images/platform_wood.png');
        this.load.image('crystal', 'assets/images/crystal_glow.png');
        this.load.image('exitPortal', 'assets/images/portal_exit.png');
        this.load.image('slime', 'assets/images/enemy_slime_blob.png');
        this.load.image('particle', 'assets/images/particle_smoke.png');
        
        // Load lever and door from kenney pack
        this.load.image('lever', 'kenney_new-platformer-pack-1.0/Sprites/Tiles/Default/lever.png');
        this.load.image('lever_right', 'kenney_new-platformer-pack-1.0/Sprites/Tiles/Default/lever_right.png');
        this.load.image('door_closed', 'kenney_new-platformer-pack-1.0/Sprites/Tiles/Default/door_closed.png');
        this.load.image('door_open', 'kenney_new-platformer-pack-1.0/Sprites/Tiles/Default/door_open.png');
        
        // Load ladder/vine tiles for vertical climbing
        this.load.image('ladder', 'kenney_new-platformer-pack-1.0/Sprites/Tiles/Default/ladder_middle.png');
        this.load.image('ladder_top', 'kenney_new-platformer-pack-1.0/Sprites/Tiles/Default/ladder_top.png');
        this.load.image('ladder_bottom', 'kenney_new-platformer-pack-1.0/Sprites/Tiles/Default/ladder_bottom.png');
        
        // Load tree stump/bush assets for forest theme
        this.load.image('bush', 'kenney_new-platformer-pack-1.0/Sprites/Tiles/Default/bush.png');
        this.load.image('rock', 'kenney_new-platformer-pack-1.0/Sprites/Tiles/Default/rock.png');
        
        // Audio
        this.load.audio('jumpSound', 'assets/audio/Jump_01.wav');
        this.load.audio('collectSound', 'assets/audio/Coin_Collect_02.wav');
        this.load.audio('landSound', 'assets/audio/Land_Heavy_01.wav');
        this.load.audio('victorySound', 'assets/audio/Victory_Jingle_01.wav');
    }

    createLevel() {
        // Ashen Forest background - burnt woodland theme
        this.cameras.main.setBackgroundColor('#2d1a0f'); // Dark brown/burnt color
        
        // Create ground spanning the full level width
        this.ground = this.physics.add.staticGroup();
        const groundTexture = this.textures.get('ground');
        const groundSource = groundTexture.getSourceImage();
        const groundWidth = groundSource.width;
        const tiles = Math.ceil(this.levelWidth / groundWidth);
        
        for (let i = 0; i < tiles; i++) {
            const x = i * groundWidth + groundWidth / 2;
            const ground = this.ground.create(x, this.levelHeight - 20, 'ground');
            ground.setOrigin(0.5, 1);
            ground.refreshBody();
        }

        // Create platforms (tree stumps and elevated platforms)
        this.platforms = this.physics.add.staticGroup();
        
        // Early platforms - tutorial area
        this.platforms.create(300, this.levelHeight - 120, 'platform');
        this.platforms.create(500, this.levelHeight - 180, 'platform');
        this.platforms.create(750, this.levelHeight - 240, 'platform');
        
        // Mid-level platforms
        this.platforms.create(1100, this.levelHeight - 150, 'platform');
        this.platforms.create(1300, this.levelHeight - 220, 'platform');
        this.platforms.create(1500, this.levelHeight - 280, 'platform');
        
        // Late platforms near exit
        this.platforms.create(1900, this.levelHeight - 200, 'platform');
        this.platforms.create(2100, this.levelHeight - 160, 'platform');
        
        // End platform for exit portal
        const endPlatform = this.platforms.create(this.levelWidth - 150, this.levelHeight - 140, 'platform');

        // Create ladders/vines for vertical climbing (visual only, use platforms for actual climbing)
        this.ladders = this.add.group();
        // Add ladder visuals on some platforms
        this.ladders.add(this.add.image(1100, this.levelHeight - 200, 'ladder_bottom'));
        this.ladders.add(this.add.image(1100, this.levelHeight - 250, 'ladder'));
        this.ladders.add(this.add.image(1100, this.levelHeight - 300, 'ladder_top'));
        
        this.ladders.add(this.add.image(1500, this.levelHeight - 330, 'ladder_bottom'));
        this.ladders.add(this.add.image(1500, this.levelHeight - 380, 'ladder'));
        this.ladders.add(this.add.image(1500, this.levelHeight - 430, 'ladder_top'));

        // Add decorative forest elements (bushes, rocks) for atmosphere
        this.decorations = this.add.group();
        // Bushes along the ground
        this.decorations.add(this.add.image(200, this.levelHeight - 20, 'bush').setOrigin(0.5, 1));
        this.decorations.add(this.add.image(600, this.levelHeight - 20, 'bush').setOrigin(0.5, 1));
        this.decorations.add(this.add.image(900, this.levelHeight - 20, 'bush').setOrigin(0.5, 1));
        this.decorations.add(this.add.image(1400, this.levelHeight - 20, 'bush').setOrigin(0.5, 1));
        this.decorations.add(this.add.image(1800, this.levelHeight - 20, 'bush').setOrigin(0.5, 1));
        
        // Rocks scattered around
        this.decorations.add(this.add.image(400, this.levelHeight - 20, 'rock').setOrigin(0.5, 1));
        this.decorations.add(this.add.image(1000, this.levelHeight - 20, 'rock').setOrigin(0.5, 1));
        this.decorations.add(this.add.image(1600, this.levelHeight - 20, 'rock').setOrigin(0.5, 1));
        this.decorations.add(this.add.image(2000, this.levelHeight - 20, 'rock').setOrigin(0.5, 1));

        // Create player at starting position
        this.player = new Player(this, 150, this.levelHeight - 100, 'player');
        this.player.setDepth(5);

        // Create 10 collectible crystals positioned throughout the level
        this.collectibles = this.physics.add.staticGroup();
        const crystalPositions = [
            // Early crystals - easy to reach
            { x: 300, y: this.levelHeight - 180 },
            { x: 500, y: this.levelHeight - 240 },
            { x: 750, y: this.levelHeight - 300 },
            
            // Mid-level crystals - require jumping
            { x: 1100, y: this.levelHeight - 200 },
            { x: 1300, y: this.levelHeight - 280 },
            { x: 1500, y: this.levelHeight - 340 },
            
            // Late crystals - require double jump
            { x: 1700, y: this.levelHeight - 120 },
            { x: 1900, y: this.levelHeight - 260 },
            { x: 2100, y: this.levelHeight - 220 },
            
            // Final crystal near exit
            { x: 2200, y: this.levelHeight - 200 }
        ];

        crystalPositions.forEach(pos => {
            const crystal = this.collectibles.create(pos.x, pos.y, 'crystal');
            crystal.setOrigin(0.5, 0.5);
            crystal.setScale(0.8);
            crystal.refreshBody();
            
            // Add glow effect animation
            this.tweens.add({
                targets: crystal,
                scale: 0.9,
                yoyo: true,
                repeat: -1,
                duration: 800,
                ease: 'Sine.easeInOut'
            });
            
            // Add rotation for sparkle effect
            this.tweens.add({
                targets: crystal,
                angle: 360,
                repeat: -1,
                duration: 2000,
                ease: 'Linear'
            });
        });

        this.collectiblesCollected = 0;
        this.totalCollectibles = crystalPositions.length;

        // Create enemies - Slime Blobs patrolling
        this.enemies = [];
        
        // Slime 1 - early area, simple patrol
        const slime1 = new SlimeEnemy(this, 400, this.levelHeight - 100, 'slime', 350, 500, 40);
        this.enemies.push(slime1);
        
        // Slime 2 - mid area
        const slime2 = new SlimeEnemy(this, 1200, this.levelHeight - 100, 'slime', 1150, 1350, 45);
        this.enemies.push(slime2);
        
        // Slime 3 - late area
        const slime3 = new SlimeEnemy(this, 1800, this.levelHeight - 100, 'slime', 1750, 1950, 50);
        this.enemies.push(slime3);

        // Create lever - positioned before the gate
        this.lever = new Lever(this, this.levelWidth - 300, this.levelHeight - 100, 'lever');
        this.lever.setCanActivate(false); // Can't activate until all crystals collected
        this.lever.onActivate = () => {
            this.openGate();
        };

        // Create gate blocking the exit
        this.gate = new Gate(this, this.levelWidth - 150, this.levelHeight - 20, 'door_closed');
        this.gate.setDepth(3);

        // Exit portal (initially locked behind gate)
        this.exitPortal = this.physics.add.staticImage(endPlatform.x, endPlatform.y - 90, 'exitPortal');
        this.exitPortal.setScale(1.1);
        this.exitPortal.setDepth(4);
        this.exitPortalActive = false;

        // Particle systems
        const pm = new ParticleManager(this);
        const moveParticles = pm.createMovementParticles();
        const jumpParticles = pm.createJumpParticles();
        const landParticles = pm.createLandingParticles();
        this.player.setupParticles({ moveParticles, jumpParticles, landParticles });

        // Audio callbacks
        this.player.setupCallbacks({
            onJump: () => this.sound.play('jumpSound', { volume: 0.6 }),
            onLand: () => {
                this.sound.play('landSound', { volume: 0.6 });
                this.cameras.main.shake(80, 0.003);
            }
        });

        // Camera follow configuration
        this.enableCameraFollow(this.player);

        // Collisions and overlaps
        this.physics.add.collider(this.player, this.ground);
        this.physics.add.collider(this.player, this.platforms);
        this.physics.add.overlap(this.player, this.collectibles, this.collectItem, null, this);
        this.physics.add.overlap(this.player, this.exitPortal, this.tryCompleteLevel, null, this);
        
        // Lever interaction key (E key)
        this.interactKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.E);
        
        // Interaction hint text (shown when near lever)
        this.interactHint = this.add.text(0, 0, 'Press E or SPACE to activate', {
            fontSize: '16px',
            fill: '#ffffaa',
            fontFamily: 'Arial',
            stroke: '#000000',
            strokeThickness: 2
        });
        this.interactHint.setOrigin(0.5);
        this.interactHint.setScrollFactor(0);
        this.interactHint.setVisible(false);

        // HUD - Crystal counter
        this.crystalText = this.add.text(16, 16, 'crystals: 0 / ' + this.totalCollectibles, {
            fontSize: '20px',
            fill: '#ffffff',
            fontFamily: 'Arial',
            stroke: '#000000',
            strokeThickness: 2
        });
        this.crystalText.setScrollFactor(0);

        // HUD - Hearts
        this.heartsText = this.add.text(16, 40, '', {
            fontSize: '20px',
            fill: '#ff8080',
            fontFamily: 'Arial',
            stroke: '#000000',
            strokeThickness: 2
        });
        this.heartsText.setScrollFactor(0);
        this.updateHeartsText();

        // Tutorial hint text (fades after a few seconds)
        const hintText = this.add.text(
            this.cameras.main.width / 2,
            100,
            'Collect all crystals to unlock the lever!',
            {
                fontSize: '18px',
                fill: '#ffd38a',
                fontFamily: 'Arial',
                stroke: '#000000',
                strokeThickness: 3
            }
        );
        hintText.setOrigin(0.5);
        hintText.setScrollFactor(0);
        hintText.setAlpha(0);
        
        this.tweens.add({
            targets: hintText,
            alpha: 1,
            duration: 500,
            delay: 1000
        });
        
        this.tweens.add({
            targets: hintText,
            alpha: 0,
            delay: 5000,
            duration: 1000,
            onComplete: () => hintText.destroy()
        });

        // Fade in when starting
        this.cameras.main.fadeIn(400, 0, 0, 0);
    }

    update(time, delta) {
        super.update();

        if (this.player) {
            this.player.update();
            
            // Check if player fell off the world
            if (this.player.y > this.levelHeight + 50) {
                this.handlePlayerDeath();
            }
        }

        // Update lever and check for interaction
        if (this.lever && !this.lever.activated) {
            this.lever.update();
            
            // Check if player is near lever and pressing interact key
            if (this.player) {
                const distance = Phaser.Math.Distance.Between(
                    this.lever.x, this.lever.y,
                    this.player.x, this.player.y
                );
                
                if (distance < 80 && this.lever.canActivate) {
                    // Show interaction hint
                    const screenPos = this.cameras.main.getWorldPoint(this.lever.x, this.lever.y - 60);
                    this.interactHint.setPosition(screenPos.x, screenPos.y);
                    this.interactHint.setVisible(true);
                    
                    if (Phaser.Input.Keyboard.JustDown(this.interactKey) || 
                        Phaser.Input.Keyboard.JustDown(this.spaceKey)) {
                        this.lever.activate();
                        this.interactHint.setVisible(false);
                    }
                } else {
                    this.interactHint.setVisible(false);
                }
            }
        } else {
            this.interactHint.setVisible(false);
        }

        // Update enemies
        this.enemies.forEach(enemy => {
            if (enemy && enemy.preUpdate) {
                enemy.preUpdate(time, delta);
            }
        });

        // Check enemy collisions
        this.checkEnemyCollisions();
    }

    collectItem(player, crystal) {
        if (!crystal.active) return;

        this.collectiblesCollected++;
        crystal.disableBody(true, true);
        this.sound.play('collectSound', { volume: 0.7 });

        // Collection particles
        const pm = new ParticleManager(this);
        const collectParticles = pm.createCollectionParticles();
        collectParticles.setPosition(crystal.x, crystal.y);
        collectParticles.explode(16);

        // Update HUD
        this.crystalText.setText('crystals: ' + this.collectiblesCollected + ' / ' + this.totalCollectibles);

        // Check if all crystals collected
        if (this.collectiblesCollected >= this.totalCollectibles) {
            this.unlockLever();
        }
    }

    unlockLever() {
        // Enable lever activation
        this.lever.setCanActivate(true);
        
        // Visual feedback
        const unlockText = this.add.text(
            this.cameras.main.width / 2,
            this.cameras.main.height / 2 - 50,
            'All crystals collected! Activate the lever!',
            {
                fontSize: '24px',
                fill: '#88ff88',
                fontFamily: 'Arial',
                stroke: '#000000',
                strokeThickness: 4
            }
        );
        unlockText.setOrigin(0.5);
        unlockText.setScrollFactor(0);
        
        this.tweens.add({
            targets: unlockText,
            alpha: 0,
            delay: 2000,
            duration: 500,
            onComplete: () => unlockText.destroy()
        });
    }


    openGate() {
        this.gate.open();
        this.exitPortalActive = true;
        
        // Animate exit portal
        this.tweens.add({
            targets: this.exitPortal,
            scale: 1.3,
            yoyo: true,
            repeat: -1,
            duration: 600
        });
        
        // Show message
        const gateText = this.add.text(
            this.cameras.main.width / 2,
            this.cameras.main.height / 2 - 50,
            'Gate opened! Reach the exit portal!',
            {
                fontSize: '24px',
                fill: '#88ff88',
                fontFamily: 'Arial',
                stroke: '#000000',
                strokeThickness: 4
            }
        );
        gateText.setOrigin(0.5);
        gateText.setScrollFactor(0);
        
        this.tweens.add({
            targets: gateText,
            alpha: 0,
            delay: 2000,
            duration: 500,
            onComplete: () => gateText.destroy()
        });
    }

    tryCompleteLevel() {
        if (!this.exitPortalActive) {
            // Show hint if gate is still closed
            const hint = this.add.text(
                this.cameras.main.width / 2,
                this.cameras.main.height / 2,
                'Collect all crystals and activate the lever first!',
                {
                    fontSize: '18px',
                    fill: '#ffaaaa',
                    fontFamily: 'Arial',
                    stroke: '#000000',
                    strokeThickness: 3
                }
            );
            hint.setOrigin(0.5);
            hint.setScrollFactor(0);
            
            this.tweens.add({
                targets: hint,
                alpha: 0,
                delay: 1500,
                duration: 500,
                onComplete: () => hint.destroy()
            });
            return;
        }

        // Level complete!
        this.sound.play('victorySound', { volume: 0.9 });

        this.scene.start('GameOverScene', {
            won: true,
            score: this.collectiblesCollected * 100,
            level: 1
        });
    }

    checkEnemyCollisions() {
        if (!this.player || !this.player.body) return;

        const playerRect = new Phaser.Geom.Rectangle(
            this.player.body.x,
            this.player.body.y,
            this.player.body.width,
            this.player.body.height
        );

        this.enemies.forEach(slime => {
            if (!slime.active) return;

            const slimeRect = slime.getBounds();
            if (Phaser.Geom.Intersects.RectangleToRectangle(playerRect, slimeRect)) {
                // Player hit by enemy
                this.handlePlayerDeath();
            }
        });
    }

    handlePlayerDeath() {
        if (this.isRespawning) return;
        this.isRespawning = true;

        this.hearts = Math.max(0, this.hearts - 1);
        this.updateHeartsText();

        this.cameras.main.shake(150, 0.01);
        this.cameras.main.fadeOut(400, 0, 0, 0);

        this.time.delayedCall(450, () => {
            if (this.hearts > 0) {
                // Restart level with one fewer heart
                this.scene.restart({ hearts: this.hearts, fromRestart: true });
            } else {
                // Game over
                this.scene.start('GameOverScene', {
                    won: false,
                    score: this.collectiblesCollected * 100,
                    level: 1
                });
            }
        });
    }

    updateHeartsText() {
        const full = '♥'.repeat(this.hearts);
        const empty = '·'.repeat(this.maxHearts - this.hearts);
        this.heartsText?.setText('hearts: ' + full + empty);
    }
}
