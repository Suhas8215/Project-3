/**
 * player prefab class
 * handles player movement, jumping (including optional double jump),
 * and hooks into particle / audio systems provided by the scene.
 */
export default class Player extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, texture = 'player') {
        super(scene, x, y, texture);

        scene.add.existing(this);
        scene.physics.add.existing(this);

        // player physics properties
        this.setScale(0.85);
        this.setCollideWorldBounds(true);
        this.setBounce(0);
        this.setDragX(200);
        this.setScale(0.8);

        // player movement properties
        this.moveSpeed = 220;
        this.jumpVelocity = -420;

        // double jump state
        this.maxJumps = 2;
        this.jumpCount = 0;
        this.wasOnGround = false;

        // input references provided by baselevelscene
        this.cursors = scene.cursors;
        this.wasdKeys = scene.wasdKeys;
        this.spaceKey = scene.spaceKey;

        // slightly smaller physics body than the sprite so edge standing feels fair
        if (this.body && this.body.setSize) {
            this.body.setSize(this.width * 0.6, this.height * 0.9);
            this.body.setOffset(this.width * 0.2, this.height * 0.1);
        }

        // particle & juice hooks (set up in the scene)
        this.moveParticles = null;
        this.jumpParticles = null;
        this.landParticles = null;
        this.onJump = null;   // optional callback (e.g. play sound)
        this.onLand = null;   // optional callback (e.g. screen shake)
    }

    /**
     * main per-frame update.
     * expects the owning scene to call player.update() from its update().
     */
    update() {
        if (!this.body) return;

        // horizontal movement
        const leftDown =
            (this.cursors && this.cursors.left.isDown) ||
            (this.wasdKeys && this.wasdKeys.A.isDown);
        const rightDown =
            (this.cursors && this.cursors.right.isDown) ||
            (this.wasdKeys && this.wasdKeys.D.isDown);

        if (leftDown) {
            this.setVelocityX(-this.moveSpeed);
            this.setFlipX(true);
            this.emitMoveDust();
        } else if (rightDown) {
            this.setVelocityX(this.moveSpeed);
            this.setFlipX(false);
            this.emitMoveDust();
        } else {
            this.setVelocityX(0);
            if (this.moveParticles) {
                this.moveParticles.stop();
            }
        }

        // jumping / double jump (space is primary, arrows/w are secondary)
        const justPressedJump =
            Phaser.Input.Keyboard.JustDown(this.spaceKey) ||
            Phaser.Input.Keyboard.JustDown(this.cursors.up) ||
            Phaser.Input.Keyboard.JustDown(this.wasdKeys.W);

        const onGround = this.body.blocked.down || this.body.touching.down;

        // reset jump counter when touching ground
        if (onGround && !this.wasOnGround) {
            this.jumpCount = 0;
            this.handleLanding();
        }

        if (justPressedJump && this.jumpCount < this.maxJumps) {
            this.setVelocityY(this.jumpVelocity);
            this.jumpCount++;
            this.handleJump();
        }

        this.wasOnGround = onGround;
    }

    emitMoveDust() {
        if (!this.moveParticles) return;
        this.moveParticles.setPosition(this.x, this.y + this.height / 2);
        this.moveParticles.start();
    }

    handleJump() {
        if (this.jumpParticles) {
            this.jumpParticles.setPosition(this.x, this.y + this.height);
            this.jumpParticles.explode(12);
        }
        if (typeof this.onJump === 'function') {
            this.onJump();
        }
    }

    handleLanding() {
        if (this.landParticles) {
            this.landParticles.setPosition(this.x, this.y + this.height / 2);
            this.landParticles.explode(10);
        }
        if (typeof this.onLand === 'function') {
            this.onLand();
        }
    }

    /**
     * configure particle systems and callbacks used for juice.
     */
    setupParticles({ moveParticles, jumpParticles, landParticles } = {}) {
        this.moveParticles = moveParticles || this.moveParticles;
        this.jumpParticles = jumpParticles || this.jumpParticles;
        this.landParticles = landParticles || this.landParticles;
    }

    setupCallbacks({ onJump, onLand } = {}) {
        this.onJump = onJump || this.onJump;
        this.onLand = onLand || this.onLand;
    }
}


