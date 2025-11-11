import Phaser from 'phaser';

/**
 * Utility class for managing particle systems
 * Creates and configures particle effects for various game actions
 */
export default class ParticleManager {
    constructor(scene) {
        this.scene = scene;
    }

    /**
     * Create particle system for player movement
     */
    createMovementParticles() {
        const particles = this.scene.add.particles(0, 0, 'particle', {
            speed: { min: 20, max: 40 },
            scale: { start: 0.3, end: 0 },
            lifespan: 300,
            frequency: 50,
            tint: 0x888888
        });
        
        particles.stop();
        return particles;
    }

    /**
     * Create particle system for jumping
     */
    createJumpParticles() {
        const particles = this.scene.add.particles(0, 0, 'particle', {
            speed: { min: 50, max: 100 },
            scale: { start: 0.5, end: 0 },
            lifespan: 400,
            tint: 0xffffff,
            angle: { min: 180, max: 360 }
        });
        
        return particles;
    }

    /**
     * Create particle system for landing
     */
    createLandingParticles() {
        const particles = this.scene.add.particles(0, 0, 'particle', {
            speed: { min: 30, max: 60 },
            scale: { start: 0.4, end: 0 },
            lifespan: 300,
            tint: 0xcccccc,
            angle: { min: 0, max: 180 }
        });
        
        return particles;
    }

    /**
     * Create particle system for collecting items
     */
    createCollectionParticles() {
        const particles = this.scene.add.particles(0, 0, 'particle', {
            speed: { min: 50, max: 150 },
            scale: { start: 0.6, end: 0 },
            lifespan: 500,
            tint: 0xffff00,
            gravityY: -50
        });
        
        return particles;
    }
}

