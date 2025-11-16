import BaseLevelScene from './BaseLevelScene.js';
import Player from '../prefabs/Player.js';
import Collectible from '../prefabs/Collectible.js';
import ParticleManager from '../utils/ParticleManager.js';
import SlimeEnemy from '../prefabs/SlimeEnemy.js';
import Lever from '../prefabs/Lever.js';
import Gate from '../prefabs/Gate.js';

/**
 * level 1: ashen forest
 * tutorial and early movement-based challenges
 * 
 * unique mechanic: lever-activated gate system - collect all crystals and defeat all slimes to unlock the lever,
 * then activate the lever to open the gate to the exit portal
 * 
 * features:
 * - 10 glowing crystals (collectibles)
 * - tree stumps and platforms for jumping
 * - vines (ladders) for vertical climbing
 * - slime enemies patrolling and shooting
 * - double jumping mechanics
 * - particle effects and audio juice
 * - smooth camera scrolling with dynamic vertical adjustment
 */
export default class Level1Scene extends BaseLevelScene {
    constructor() {
        super({ key: 'Level1Scene' });
        this.levelWidth = 2400; // ~3 screen widths
    }

    init(data) {
        // hearts system (same as level 2)
        this.maxHearts = 3;
        if (data && data.fromRestart && typeof data.hearts === 'number') {
            this.hearts = data.hearts;
        } else {
            this.hearts = this.maxHearts;
        }
        this.isRespawning = false;
    }

    preload() {
        // load assets - using existing assets from assets/images
        this.load.image('player', 'assets/images/player_ashen.png');
        this.load.image('ground', 'assets/images/ground_stone.png');
        this.load.image('platform', 'assets/images/platform_wood.png');
        this.load.image('crystal', 'assets/images/crystal_glow.png');
        this.load.image('exitPortal', 'assets/images/portal_exit.png');
        this.load.image('slime', 'assets/images/enemy_slime_blob.png');
        this.load.image('slimeShot', 'assets/images/slime_shot.png');
        this.load.image('particle', 'assets/images/particle_smoke.png');
        
        // load lever and door art (copied into assets/images from kenney pack)
        this.load.image('lever', 'assets/images/lever.png');
        this.load.image('lever_right', 'assets/images/lever_right.png');
        this.load.image('door_closed', 'assets/images/door_closed.png');
        this.load.image('door_open', 'assets/images/door_open.png');
        
        // load ladder/vine tiles for vertical climbing
        this.load.image('ladder', 'assets/images/ladder_middle.png');
        this.load.image('ladder_top', 'assets/images/ladder_top.png');
        this.load.image('ladder_bottom', 'assets/images/ladder_bottom.png');
        
        // load tree stump/bush assets for forest theme
        this.load.image('bush', 'assets/images/bush.png');
        this.load.image('rock', 'assets/images/rock.png');
        
        // audio
        this.load.audio('jumpSound', 'assets/audio/Jump_01.wav');
        this.load.audio('collectSound', 'assets/audio/Coin_Collect_02.wav');
        this.load.audio('landSound', 'assets/audio/Land_Heavy_01.wav');
        this.load.audio('victorySound', 'assets/audio/Victory_Jingle_01.wav');
    }

    createLevel() {
        // ashen forest background - burnt woodland theme
        this.cameras.main.setBackgroundColor('#2d1a0f'); // dark brown/burnt color
        
        // create ground spanning the full level width
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

        // create platforms (tree stumps and elevated platforms)
        this.platforms = this.physics.add.staticGroup();
        
        // early platforms - tutorial area
        this.platforms.create(300, this.levelHeight - 120, 'platform');
        this.platforms.create(500, this.levelHeight - 180, 'platform');
        this.platforms.create(750, this.levelHeight - 240, 'platform');
        
        // mid-level platforms
        this.platforms.create(1100, this.levelHeight - 150, 'platform');
        this.platforms.create(1300, this.levelHeight - 220, 'platform');
        this.platforms.create(1500, this.levelHeight - 280, 'platform');
        
        // late platforms near exit
        const latePlatformA = this.platforms.create(1900, this.levelHeight - 200, 'platform');
        const latePlatformB = this.platforms.create(2100, this.levelHeight - 160, 'platform');
        
        // end platform for exit portal
        const endPlatform = this.platforms.create(this.levelWidth - 150, this.levelHeight - 140, 'platform');

        // create ladders/vines for vertical climbing (visuals + logical ladder regions)
        this.ladders = this.add.group();
        // ladder 1 visuals
        this.ladders.add(this.add.image(1100, this.levelHeight - 200, 'ladder_bottom'));
        this.ladders.add(this.add.image(1100, this.levelHeight - 250, 'ladder'));
        this.ladders.add(this.add.image(1100, this.levelHeight - 300, 'ladder_top'));
        // ladder 2 visuals
        this.ladders.add(this.add.image(1500, this.levelHeight - 330, 'ladder_bottom'));
        this.ladders.add(this.add.image(1500, this.levelHeight - 380, 'ladder'));
        this.ladders.add(this.add.image(1500, this.levelHeight - 430, 'ladder_top'));

        // logical ladder regions used for climbing checks
        this.ladderData = [
            {
                x: 1100,
                topY: this.levelHeight - 320,
                bottomY: this.levelHeight - 180
            },
            {
                x: 1500,
                topY: this.levelHeight - 460,
                bottomY: this.levelHeight - 300
            }
        ];
        this.playerOnLadder = false;

        // add decorative forest elements (bushes, rocks) for atmosphere
        this.decorations = this.add.group();
        // bushes along the ground
        this.decorations.add(this.add.image(200, this.levelHeight - 20, 'bush').setOrigin(0.5, 1));
        this.decorations.add(this.add.image(600, this.levelHeight - 20, 'bush').setOrigin(0.5, 1));
        this.decorations.add(this.add.image(900, this.levelHeight - 20, 'bush').setOrigin(0.5, 1));
        this.decorations.add(this.add.image(1400, this.levelHeight - 20, 'bush').setOrigin(0.5, 1));
        this.decorations.add(this.add.image(1800, this.levelHeight - 20, 'bush').setOrigin(0.5, 1));
        
        // rocks scattered around
        this.decorations.add(this.add.image(400, this.levelHeight - 20, 'rock').setOrigin(0.5, 1));
        this.decorations.add(this.add.image(1000, this.levelHeight - 20, 'rock').setOrigin(0.5, 1));
        this.decorations.add(this.add.image(1600, this.levelHeight - 20, 'rock').setOrigin(0.5, 1));
        this.decorations.add(this.add.image(2000, this.levelHeight - 20, 'rock').setOrigin(0.5, 1));

        // create player at starting position
        this.player = new Player(this, 150, this.levelHeight - 100, 'player');
        this.player.setDepth(5);

        // create 10 collectible crystals positioned throughout the level
        this.collectibles = this.physics.add.staticGroup();
        const crystalPositions = [
            // early crystals - easy to reach
            { x: 300, y: this.levelHeight - 180 },
            { x: 500, y: this.levelHeight - 240 },
            { x: 750, y: this.levelHeight - 300 },
            
            // mid-level crystals - require jumping
            { x: 1100, y: this.levelHeight - 200 },
            { x: 1300, y: this.levelHeight - 280 },
            // mid crystal that sits high above ladder 2 and effectively requires climbing
            { x: 1500, y: this.levelHeight - 440 },
            
            // late crystals - require double jump
            { x: 1700, y: this.levelHeight - 120 },
            { x: 1900, y: this.levelHeight - 260 },
            { x: 2100, y: this.levelHeight - 220 },
            
            // final crystal near exit
            { x: 2200, y: this.levelHeight - 200 }
        ];

        crystalPositions.forEach(pos => {
            const crystal = this.collectibles.create(pos.x, pos.y, 'crystal');
            crystal.setOrigin(0.5, 0.5);
            crystal.setScale(0.8);
            crystal.refreshBody();
            
            // add glow effect animation
            this.tweens.add({
                targets: crystal,
                scale: 0.9,
                yoyo: true,
                repeat: -1,
                duration: 800,
                ease: 'Sine.easeInOut'
            });
            
            // add rotation for sparkle effect
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

        // create enemies - slime blobs patrolling
        this.enemies = [];
        
        // slime 1 - early area, simple patrol
        const slime1 = new SlimeEnemy(this, 400, this.levelHeight - 100, 'slime', 350, 500, 40);
        this.enemies.push(slime1);
        
        // slime 2 - mid area
        const slime2 = new SlimeEnemy(this, 1200, this.levelHeight - 100, 'slime', 1150, 1350, 45);
        this.enemies.push(slime2);
        
        // slime 3 - late area
        const slime3 = new SlimeEnemy(this, 1800, this.levelHeight - 100, 'slime', 1750, 1950, 50);
        this.enemies.push(slime3);

        this.totalEnemies = this.enemies.length;
        this.enemiesDefeated = 0;

        // slime projectile group (ground slimes fire simple shots like level 2 turrets)
        this.slimeShots = this.physics.add.group({ allowGravity: false, immovable: true });

        // create lever - positioned on a late platform, separate from the exit portal
        this.lever = new Lever(this, latePlatformB.x, latePlatformB.y - 40, 'lever');
        this.lever.setCanActivate(false); // can't activate until all crystals collected
        this.lever.onActivate = () => {
            this.openGate();
        };

        // create gate blocking the exit
        this.gate = new Gate(this, this.levelWidth - 150, this.levelHeight - 20, 'door_closed');
        this.gate.setDepth(3);

        // exit portal (initially locked behind gate)
        this.exitPortal = this.physics.add.staticImage(endPlatform.x, endPlatform.y - 90, 'exitPortal');
        this.exitPortal.setScale(1.1);
        this.exitPortal.setDepth(4);
        this.exitPortalActive = false;

        // particle systems
        const pm = new ParticleManager(this);
        const moveParticles = pm.createMovementParticles();
        const jumpParticles = pm.createJumpParticles();
        const landParticles = pm.createLandingParticles();
        this.player.setupParticles({ moveParticles, jumpParticles, landParticles });

        // audio callbacks
        this.player.setupCallbacks({
            onJump: () => this.sound.play('jumpSound', { volume: 0.6 }),
            onLand: () => {
                this.sound.play('landSound', { volume: 0.6 });
                this.cameras.main.shake(80, 0.003);
            }
        });

        // camera follow configuration
        this.enableCameraFollow(this.player);

        // collisions and overlaps
        this.physics.add.collider(this.player, this.ground);
        this.physics.add.collider(this.player, this.platforms);
        this.physics.add.overlap(this.player, this.collectibles, this.collectItem, null, this);
        this.physics.add.overlap(this.player, this.exitPortal, this.tryCompleteLevel, null, this);
        
        // slime projectile overlap
        this.physics.add.overlap(this.player, this.slimeShots, this.onSlimeShotHitPlayer, null, this);

        // lever interaction key (e key)
        this.interactKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.E);
        
        // interaction hint text (shown when near lever)
        this.interactHint = this.add.text(0, 0, 'Press E to activate', {
            fontSize: '16px',
            fill: '#ffffaa',
            fontFamily: 'Arial',
            stroke: '#000000',
            strokeThickness: 2
        });
        this.interactHint.setOrigin(0.5);
        this.interactHint.setScrollFactor(0);
        this.interactHint.setVisible(false);

        // hud - crystal counter
        this.crystalText = this.add.text(16, 16, 'crystals: 0 / ' + this.totalCollectibles, {
            fontSize: '20px',
            fill: '#ffffff',
            fontFamily: 'Arial',
            stroke: '#000000',
            strokeThickness: 2
        });
        this.crystalText.setScrollFactor(0);

        // hud - enemies counter
        this.enemiesText = this.add.text(16, 64, 'slimes: 0 / ' + this.totalEnemies, {
            fontSize: '20px',
            fill: '#ffffff',
            fontFamily: 'Arial',
            stroke: '#000000',
            strokeThickness: 2
        });
        this.enemiesText.setScrollFactor(0);

        // hud - hearts
        this.heartsText = this.add.text(16, 40, '', {
            fontSize: '20px',
            fill: '#ff8080',
            fontFamily: 'Arial',
            stroke: '#000000',
            strokeThickness: 2
        });
        this.heartsText.setScrollFactor(0);
        this.updateHeartsText();

        // tutorial hint text (fades after a few seconds)
        const hintText = this.add.text(
            this.cameras.main.width / 2,
            100,
            'Collect all crystals and defeat all slimes to unlock the lever!\nSlimes can be defeated by running into them or jumping on them.',
            {
                fontSize: '18px',
                fill: '#ffd38a',
                fontFamily: 'Arial',
                stroke: '#000000',
                strokeThickness: 3,
                align: 'center'
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
            delay: 6500,
            duration: 1000,
            onComplete: () => hintText.destroy()
        });

        // start slime firing timers – simple, slightly staggered cadences
        this.time.addEvent({
            delay: 2000,
            loop: true,
            callback: () => this.fireSlimeShot(slime1)
        });
        this.time.addEvent({
            delay: 2600,
            loop: true,
            callback: () => this.fireSlimeShot(slime2)
        });
        this.time.addEvent({
            delay: 2200,
            loop: true,
            callback: () => this.fireSlimeShot(slime3)
        });

        // fade in when starting
        this.cameras.main.fadeIn(400, 0, 0, 0);
    }

    update(time, delta) {
        super.update();

        if (this.player) {
            this.player.update();

            // ladder climbing logic (up arrow / w move vertically while inside ladder region)
            this.handleLadderClimbing();
            
            // check if player fell off the world
            if (this.player.y > this.levelHeight + 50) {
                this.handlePlayerDeath();
            }
        }

        // update lever and check for interaction
        if (this.lever && !this.lever.activated) {
            this.lever.update();
            
            // check if player is near lever and pressing interact key
            if (this.player) {
                const distance = Phaser.Math.Distance.Between(
                    this.lever.x, this.lever.y,
                    this.player.x, this.player.y
                );
                
                if (distance < 80 && this.lever.canActivate) {
                    // show interaction hint
                    const screenPos = this.cameras.main.getWorldPoint(this.lever.x, this.lever.y - 60);
                    this.interactHint.setPosition(screenPos.x, screenPos.y);
                    this.interactHint.setVisible(true);
                    
                    if (Phaser.Input.Keyboard.JustDown(this.interactKey)) {
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

        // update enemies
        this.enemies.forEach(enemy => {
            if (enemy && enemy.preUpdate) {
                enemy.preUpdate(time, delta);
            }
        });

        // clean up off-screen slime shots
        if (this.slimeShots) {
            this.slimeShots.children.each(shot => {
                if (!shot.active) return;
                if (shot.x < -100 || shot.x > this.levelWidth + 100) {
                    shot.destroy();
                }
            }, this);
        }

        // check enemy collisions
        this.checkEnemyCollisions();
    }

    collectItem(player, crystal) {
        if (!crystal.active) return;

        this.collectiblesCollected++;
        crystal.disableBody(true, true);
        this.sound.play('collectSound', { volume: 0.7 });

        // collection particles
        const pm = new ParticleManager(this);
        const collectParticles = pm.createCollectionParticles();
        collectParticles.setPosition(crystal.x, crystal.y);
        collectParticles.explode(16);

        // update hud
        this.crystalText.setText('crystals: ' + this.collectiblesCollected + ' / ' + this.totalCollectibles);

        // check if requirements are met (all crystals + all slimes)
        this.maybeUnlockLever();
    }

    unlockLever() {
        // enable lever activation
        this.lever.setCanActivate(true);
        
        // visual feedback
        const unlockText = this.add.text(
            this.cameras.main.width / 2,
            this.cameras.main.height / 2 - 50,
            'All crystals and slimes cleared! Activate the lever!',
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
        
        // animate exit portal
        this.tweens.add({
            targets: this.exitPortal,
            scale: 1.3,
            yoyo: true,
            repeat: -1,
            duration: 600
        });
        
        // show message
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
            // show hint if gate is still closed
            const hint = this.add.text(
                this.cameras.main.width / 2,
                this.cameras.main.height / 2,
                'Collect all crystals, defeat all slimes, then activate the lever!',
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

        // level complete!
        this.sound.play('victorySound', { volume: 0.9 });

        this.scene.start('GameOverScene', {
            won: true,
            score: this.collectiblesCollected * 100,
            level: 1
        });
    }

    checkEnemyCollisions() {
        // level 1 slimes are killable on contact (run into or jump on them)
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
            if (!Phaser.Geom.Intersects.RectangleToRectangle(playerRect, slimeRect)) {
                return;
            }

            // destroy slime and spawn a small burst of particles
            slime.setActive(false);
            slime.setVisible(false);

            this.enemiesDefeated++;
            if (this.enemiesText) {
                this.enemiesText.setText('slimes: ' + this.enemiesDefeated + ' / ' + this.totalEnemies);
            }

            const pm = new ParticleManager(this);
            const deathParticles = pm.createCollectionParticles();
            deathParticles.setPosition(slimeRect.centerX, slimeRect.centerY);
            deathParticles.explode(20);

            // Check if requirements are met (all crystals + all slimes)
            this.maybeUnlockLever();
        });
    }

    maybeUnlockLever() {
        if (!this.lever) return;
        const allCrystals = this.collectiblesCollected >= this.totalCollectibles;
        const allEnemiesCleared = this.enemiesDefeated >= this.totalEnemies;

        if (allCrystals && allEnemiesCleared && !this.lever.canActivate) {
            this.unlockLever();
        }
    }

    fireSlimeShot(slime) {
        if (!slime || !slime.active || !this.slimeShots) return;

        const shot = this.slimeShots.create(slime.x, slime.y - 10, 'slimeShot');
        // fire horizontally in the direction the slime is currently moving
        const dir = slime.direction >= 0 ? 1 : -1;
        shot.setVelocityX(250 * dir);
        shot.setDepth(4);
    }

    onSlimeShotHitPlayer(player, shot) {
        if (!shot.active) return;
        shot.destroy();
        this.handlePlayerDeath();
    }

    handleLadderClimbing() {
        if (!this.player || !this.player.body || !this.ladderData) return;

        const body = this.player.body;
        const playerCenterY = body.y + body.height / 2;
        const playerX = this.player.x;

        // find ladder the player is currently inside (if any)
        let activeLadder = null;
        for (const ladder of this.ladderData) {
            const withinX = Math.abs(playerX - ladder.x) < 24;
            const withinY = playerCenterY >= ladder.topY && playerCenterY <= ladder.bottomY;
            if (withinX && withinY) {
                activeLadder = ladder;
                break;
            }
        }

        const upPressed =
            (this.cursors && this.cursors.up.isDown) ||
            (this.wasdKeys && this.wasdKeys.W.isDown);
        const downPressed =
            (this.cursors && this.cursors.down.isDown) ||
            (this.wasdKeys && this.wasdKeys.S.isDown);

        if (activeLadder && (upPressed || downPressed)) {
            // snap roughly to ladder column and disable gravity while climbing
            this.playerOnLadder = true;
            body.allowGravity = false;
            this.player.setVelocityX(0);

            if (upPressed) {
                this.player.setVelocityY(-this.player.moveSpeed);
            } else if (downPressed) {
                this.player.setVelocityY(this.player.moveSpeed);
            } else {
                this.player.setVelocityY(0);
            }

            // gently pull player toward ladder center for a cleaner feel
            this.player.x = Phaser.Math.Linear(this.player.x, activeLadder.x, 0.25);
        } else if (this.playerOnLadder) {
            // left the ladder region – restore gravity
            this.playerOnLadder = false;
            body.allowGravity = true;
        }
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
                // restart level with one fewer heart
                this.scene.restart({ hearts: this.hearts, fromRestart: true });
            } else {
                // game over
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
