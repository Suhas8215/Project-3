import BaseLevelScene from './BaseLevelScene.js';
import Player from '../prefabs/Player.js';
import ParticleManager from '../utils/ParticleManager.js';
import MovingPlatform from '../prefabs/MovingPlatform.js';
import SlimeEnemy from '../prefabs/SlimeEnemy.js';
import FireShieldPowerup from '../prefabs/FireShieldPowerup.js';

/**
 * level 2 - molten depths (tejas)
 * unique mechanic: lava hazards with temporary fire shield power-up
 * plus moving platforms over lava and simple enemies.
 */
export default class Level2Scene extends BaseLevelScene {
    constructor() {
        super({ key: 'Level2Scene' });
        this.levelWidth = 2400;
    }

    init(data) {
        // hearts persist only on in-level restarts, but always reset to 3
        // when starting fresh from title or level select.
        this.maxHearts = 3;
        if (data && data.fromRestart && typeof data.hearts === 'number') {
            this.hearts = data.hearts;
        } else {
            this.hearts = this.maxHearts;
        }
        this.isRespawning = false;
    }

    preload() {
        // all asset filenames here are concrete and should match files you add under assets/.
        // for kenney art packs you can either rename the chosen sprites to these names
        // or adjust these paths to match the exact filenames you keep.

        // images
        this.load.image('player', 'assets/images/player_ashen.png');              // from kenney simplified platformer
        this.load.image('ground', 'assets/images/ground_stone.png');             // ground tile from kenney platformer pack
        this.load.image('platform', 'assets/images/platform_wood.png');          // standard platform tile
        this.load.image('movingPlatform', 'assets/images/platform_moving.png');  // custom cropped moving platform sprite
        this.load.image('lava', 'assets/images/tile_lava.png');                  // lava surface / geyser tile
        this.load.image('crystal', 'assets/images/crystal_glow.png');            // glowing crystal collectible
        this.load.image('exitPortal', 'assets/images/portal_exit.png');          // swirling exit portal
        this.load.image('slime', 'assets/images/enemy_slime_blob.png');          // slime enemy (turret)
        this.load.image('slimeShot', 'assets/images/slime_shot.png');           // slime projectile
        this.load.image('fireShieldFlag', 'assets/images/powerup_fire_shield.png');  // red flag shield pickup
        this.load.image('particle', 'assets/images/particle_smoke.png');         // generic particle from kenney particle pack

        // audio (names chosen to mirror your design document)
        this.load.audio('jumpSound', 'assets/audio/Jump_01.wav');
        this.load.audio('collectSound', 'assets/audio/Coin_Collect_02.wav');
        this.load.audio('landSound', 'assets/audio/Land_Heavy_01.wav');
        this.load.audio('victorySound', 'assets/audio/Victory_Jingle_01.wav');
    }

    createLevel() {
        // simple parallax-style background tint (can be replaced by art)
        this.cameras.main.setBackgroundColor('#1b0b1f');

        // static platforms (no solid ground floor, only platforms and lava)
        this.platforms = this.physics.add.staticGroup();

        // lava floor spanning the full level width (no gaps)
        this.lavaGroup = this.physics.add.staticGroup();
        const lavaTexture = this.textures.get('lava');
        const lavaSource = lavaTexture.getSourceImage();
        const lavaWidth = lavaSource.width;
        const tiles = Math.ceil(this.levelWidth / lavaWidth);
        for (let i = 0; i < tiles; i++) {
            const x = i * lavaWidth + lavaWidth / 2;
            const lava = this.lavaGroup.create(x, this.levelHeight, 'lava');
            lava.setOrigin(0.5, 1);
            lava.refreshBody();
        }

        // raised platforms leading into the cavern
        this.platforms.create(150, this.levelHeight - 80, 'platform');
        this.platforms.create(350, this.levelHeight - 140, 'platform');
        this.platforms.create(600, this.levelHeight - 200, 'platform');

        // end platform that holds the exit portal
        const endPlatform = this.platforms.create(this.levelWidth - 180, this.levelHeight - 120, 'platform');

        // moving platforms over lava (second slightly higher to increase distance)
        this.movingPlatforms = this.physics.add.group({ allowGravity: false, immovable: true });
        this.platformA = new MovingPlatform(this, 1000, 420, 'movingPlatform', 950, 1250, 60);
        this.platformB = new MovingPlatform(this, 1450, 320, 'movingPlatform', 1400, 1700, 70);
        this.movingPlatforms.add(this.platformA);
        this.movingPlatforms.add(this.platformB);

        // player spawn (above the first platform so they drop onto it)
        this.player = new Player(this, 150, this.levelHeight - 180, 'player');
        this.player.setDepth(5);

        // enemy setup: one slime turret on top of each moving platform
        this.enemies = [];
        this.slimeA = new SlimeEnemy(this, this.platformA.x, this.platformA.y - 40, 'slime');
        this.slimeA.attachToPlatform(this.platformA, 40);
        this.slimeB = new SlimeEnemy(this, this.platformB.x, this.platformB.y - 40, 'slime');
        this.slimeB.attachToPlatform(this.platformB, 40);
        this.enemies.push(this.slimeA, this.slimeB);

        this.totalEnemies = this.enemies.length;
        this.enemiesDefeated = 0;

        // fire shield power-up (red flag) that grants temporary lava/shot immunity
        this.fireShield = new FireShieldPowerup(this, 500, this.levelHeight - 220);

        // collectible crystals (3 total, in distinct areas)
        this.collectibles = this.physics.add.staticGroup();
        const crystalPositions = [
            // early crystal near entry platforms
            { x: 260, y: 400 },
            // mid crystal floating above moving platforms (requires careful jumps)
            { x: 1300, y: 260 },
            // late crystal positioned high, encouraging double jump
            { x: 2100, y: 260 }
        ];

        crystalPositions.forEach(pos => {
            const item = this.collectibles.create(pos.x, pos.y, 'crystal');
            item.setOrigin(0.5, 0.5);
            item.refreshBody();
        });

        this.collectiblesCollected = 0;
        this.totalCollectibles = crystalPositions.length;

        // exit portal (always active), sitting on the end platform
        this.exitPortal = this.physics.add.staticImage(endPlatform.x, endPlatform.y - 90, 'exitPortal');
        this.exitPortal.setScale(1.1);
        this.exitPortal.setDepth(4);

        // particle manager and player particles
        const pm = new ParticleManager(this);
        const moveParticles = pm.createMovementParticles();
        const jumpParticles = pm.createJumpParticles();
        const landParticles = pm.createLandingParticles();
        this.lavaParticles = pm.createLavaSplashParticles();
        this.player.setupParticles({ moveParticles, jumpParticles, landParticles });

        // slime projectile group
        this.slimeShots = this.physics.add.group({ allowGravity: false, immovable: true });

        // callbacks for sound and landing juice
        this.player.setupCallbacks({
            onJump: () => this.sound.play('jumpSound', { volume: 0.6 }),
            onLand: () => {
                this.sound.play('landSound', { volume: 0.6 });
                this.cameras.main.shake(80, 0.003);
            }
        });

        // camera follow configuration
        this.enableCameraFollow(this.player);

        // collisions and overlaps (slime shots are handled via physics)
        this.physics.add.collider(this.player, this.platforms);
        this.physics.add.collider(this.player, this.movingPlatforms, this.onLandOnMovingPlatform, null, this);

        this.physics.add.overlap(this.player, this.collectibles, this.collectItem, null, this);
        this.physics.add.overlap(this.player, this.exitPortal, this.tryCompleteLevel, null, this);
        this.physics.add.overlap(this.player, this.lavaGroup, this.onLavaHit, null, this);
        this.physics.add.overlap(this.player, this.slimeShots, this.onSlimeShotHitPlayer, null, this);
        this.physics.add.overlap(this.player, this.fireShield, this.onFireShieldPickup, null, this);

        // hud text
        this.crystalText = this.add.text(16, 16, 'crystals: 0 / ' + this.totalCollectibles, {
            fontSize: '20px',
            fill: '#ffffff',
            fontFamily: 'Arial'
        });
        this.crystalText.setScrollFactor(0);

        // enemies hud
        this.enemiesText = this.add.text(16, 64, 'slimes: 0 / ' + this.totalEnemies, {
            fontSize: '20px',
            fill: '#ffffff',
            fontFamily: 'Arial'
        });
        this.enemiesText.setScrollFactor(0);

        // hearts hud
        this.heartsText = this.add.text(16, 40, '', {
            fontSize: '20px',
            fill: '#ff8080',
            fontFamily: 'Arial'
        });
        this.heartsText.setScrollFactor(0);
        this.updateHeartsText();

        // tutorial hint text (fades after a few seconds)
        const hintText = this.add.text(
            this.cameras.main.width / 2,
            100,
            'beware the lava! collect crystals, grab the fire shield, and avoid enemy shots.\nslimes can be defeated by running into them or jumping on them.',
            {
                fontSize: '18px',
                fill: '#ffd38a',
                fontFamily: 'Arial',
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

        // fade in when (re)spawning
        this.cameras.main.fadeIn(400, 0, 0, 0);

        // start slime firing timers
        this.time.addEvent({
            delay: 1800,
            loop: true,
            callback: () => this.fireSlimeShot(this.slimeA)
        });
        this.time.addEvent({
            delay: 2200,
            loop: true,
            callback: () => this.fireSlimeShot(this.slimeB)
        });
    }

    update(time, delta) {
        super.update();

        if (this.player) {
            this.player.update();
            this.updateFireShieldState();
            // falling off the world costs a heart
            if (this.player.y > this.levelHeight + 50) {
                this.handlePlayerDeath();
            }
        }

        // clean up off-screen slime shots
        this.slimeShots.children.each(shot => {
            if (!shot.active) return;
            if (shot.x < -100 || shot.x > this.levelWidth + 100) {
                shot.destroy();
            }
        }, this);

        // manual enemy collision checks (slimes are not physics bodies)
        this.checkSlimeCollisions();
    }

    collectItem(player, crystal) {
        if (!crystal.active) return;

        this.collectiblesCollected++;
        crystal.disableBody(true, true);
        this.sound.play('collectSound', { volume: 0.7 });

        // collection particles at pickup location
        const pm = new ParticleManager(this);
        const collectParticles = pm.createCollectionParticles();
        collectParticles.setPosition(crystal.x, crystal.y);
        collectParticles.explode(16);

        this.crystalText.setText('crystals: ' + this.collectiblesCollected + ' / ' + this.totalCollectibles);
    }

    tryCompleteLevel() {
        this.sound.play('victorySound', { volume: 0.9 });
        if (this.ambient) {
            this.ambient.stop();
        }

        this.scene.start('GameOverScene', {
            won: true,
            score: this.collectiblesCollected * 100,
            level: 2
        });
    }

    onLavaHit(player, lavaTile) {
        if (this.player.hasFireShield) {
            return;
        }

        if (this.lavaParticles) {
            this.lavaParticles.setPosition(player.x, player.y + 10);
            this.lavaParticles.explode(18);
        }

        this.handlePlayerDeath();
    }

    // slime projectile overlap handlers
    onSlimeShotHitPlayer(player, shot) {
        shot.destroy();
        if (this.player.hasFireShield) {
            return;
        }
        this.handlePlayerDeath();
    }

    onSlimeShotHitShield(shield, shot) {
        shot.destroy();
        if (!shield.active) return;

        shield.absorbed += 1;
        if (shield.absorbed >= 1) {
            shield.disableBody(true, true);
        }
    }

    fireSlimeShot(slime) {
        if (!slime || !slime.active) return;

        const shot = this.slimeShots.create(slime.x, slime.y, 'slimeShot');
        // fire towards the player if possible, otherwise default left
        let dir = -1;
        if (this.player) {
            dir = this.player.x >= slime.x ? 1 : -1;
        }
        shot.setVelocityX(250 * dir);
        shot.setDepth(4);
    }

    onFireShieldPickup(player, shieldPowerup) {
        shieldPowerup.applyTo(player);

        // show a short popup explaining the shield
        const { width } = this.cameras.main;
        const msg = this.add.text(
            width / 2,
            80,
            'fire shield: 5 seconds of safety from lava and shots',
            {
                fontSize: '18px',
                fill: '#ffd38a',
                fontFamily: 'Arial',
                stroke: '#000000',
                strokeThickness: 3
            }
        ).setOrigin(0.5);

        msg.setAlpha(0);
        this.tweens.add({
            targets: msg,
            alpha: 1,
            duration: 250,
            yoyo: false
        });

        this.tweens.add({
            targets: msg,
            alpha: 0,
            delay: 1600,
            duration: 400,
            onComplete: () => msg.destroy()
        });
    }

    updateFireShieldState() {
        if (!this.player.hasFireShield) return;

        if (this.time.now >= this.player.fireShieldActiveUntil) {
            this.player.hasFireShield = false;
            this.player.clearTint();
        }
    }

    onLandOnMovingPlatform(player, platform) {
        // attach player x velocity to platform for less sliding feel
        if (platform.body && platform.body.velocity.x !== 0) {
            player.x += platform.body.velocity.x * this.game.loop.delta / 1000;
        }
    }

    handlePlayerDeath() {
        if (this.isRespawning) return;
        this.isRespawning = true;

        this.hearts = Math.max(0, this.hearts - 1);
        this.updateHeartsText();

        this.cameras.main.shake(150, 0.01);
        this.cameras.main.fadeOut(400, 0, 0, 0);

        if (this.ambient) {
            this.ambient.stop();
        }

        this.time.delayedCall(450, () => {
            if (this.hearts > 0) {
                // restart the level from the beginning with one fewer heart
                this.scene.restart({ hearts: this.hearts, fromRestart: true });
            } else {
                // out of hearts: full game over
                this.scene.start('GameOverScene', {
                    won: false,
                    score: this.collectiblesCollected * 100,
                    level: 2
                });
            }
        });
    }

    updateHeartsText() {
        const full = '♥'.repeat(this.hearts);
        const empty = '·'.repeat(this.maxHearts - this.hearts);
        this.heartsText?.setText('hearts: ' + full + empty);
    }

    /**
     * manual collision detection between the player and slimes.
     * any contact from any angle kills the slime.
     */
    checkSlimeCollisions() {
        if (!this.player || !this.player.body) return;

        const body = this.player.body;
        const playerRect = new Phaser.Geom.Rectangle(body.x, body.y, body.width, body.height);

        this.enemies.forEach(slime => {
            if (!slime.active) return;

            const slimeRect = slime.getBounds();
            if (!Phaser.Geom.Intersects.RectangleToRectangle(playerRect, slimeRect)) {
                return;
            }

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
        });
    }
}


