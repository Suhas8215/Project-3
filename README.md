# CMPM 120 Project 3 - Platformer Game

A Phaser.js platformer game built for CMPM 120 Project 3.

## Project Structure

```
.
├── index.html              # Main HTML entry point
├── package.json            # Node.js dependencies and scripts
├── README.md              # This file
├── src/
│   ├── main.js            # Phaser game configuration and initialization
│   ├── scenes/            # Scene classes
│   │   ├── TitleScene.js           # Title/menu screen
│   │   ├── LevelSelectScene.js     # Level selection screen
│   │   ├── BaseLevelScene.js       # Base class for level scenes
│   │   ├── GameOverScene.js        # Game over/completion screen
│   │   └── Level1Scene.js          # Individual level scenes (to be created)
│   ├── prefabs/           # Reusable game object classes
│   │   ├── Player.js               # Player character
│   │   └── Collectible.js         # Collectible items
│   └── utils/             # Utility classes
│       └── ParticleManager.js      # Particle system management
└── assets/                # Game assets (art, audio, etc.)
    ├── images/
    └── audio/
```

## Setup

1. Install dependencies:
```bash
npm install
```

2. Run the development server:
```bash
npm run dev
```

3. Open your browser and navigate to `http://localhost:8000`

## Project Requirements

### Implementation Details (10 points)

- [x] **Player avatar movement** (2 points): Horizontal movement and single jumping
- [x] **Ground and platforms** (2 points): At least one ground and one platform type
- [x] **Collectible items** (1 point): At least one kind of collectible
- [x] **End of level condition** (1 point): Way to complete a level
- [x] **Scrolling & camera** (1 point): Camera follows player, world scrolls
- [x] **Particle Juice** (2 points): Particle systems for at least two player actions
- [x] **Audio juice** (1 point): Audio effects for jumping, moving, landing, or collecting

### Level Design (5 points)

- [x] **Level size** (2 points): Roughly three screen widths wide
- [x] **Level mechanics** (2 points): Each level has a unique mechanic
- [x] **Level playability** (1 point): All core mechanics work in each level

### Technical Requirements

- [x] **JS & Phaser**: Written in JavaScript using Phaser
- [x] **Arcade Physics**: Uses Phaser's arcade physics
- [x] **Scenes**: Uses at least one Scene class per level
- [x] **Input**: Keyboard input (note: gamepad support can be added)
- [x] **Art assets**: Primarily off-the-shelf assets
- [x] **Game end**: End game state with visual component
- [x] **Game restart**: Can reset and play again without restarting VS Code

### Level Selection

Press number keys (1, 2, 3, etc.) in the Level Select screen to choose which level to play. Press ESC to return to the title screen or level select.

## Development Notes

### Creating a New Level

1. Create a new scene file in `src/scenes/` (e.g., `Level1Scene.js`)
2. Extend `BaseLevelScene` class
3. Implement the `createLevel()` method
4. Add the scene to `src/main.js` imports and config
5. Add level selection in `LevelSelectScene.js`

Example:
```javascript
import BaseLevelScene from './BaseLevelScene.js';

export default class Level1Scene extends BaseLevelScene {
    constructor() {
        super({ key: 'Level1Scene' });
    }

    createLevel() {
        // Create your level here
        // - Ground and platforms
        // - Collectibles
        // - Player
        // - End condition
        // - Unique mechanic
    }
}
```

### Adding Assets

Place art assets in `assets/images/` and audio assets in `assets/audio/`. Load them in your scene's `preload()` method:

```javascript
preload() {
    this.load.image('player', 'assets/images/player.png');
    this.load.audio('jumpSound', 'assets/audio/jump.mp3');
}
```

### Particle Systems

Use the `ParticleManager` utility class to create particle effects. Set up particles in your level scene and assign them to the player:

```javascript
const particleManager = new ParticleManager(this);
const moveParticles = particleManager.createMovementParticles();
const jumpParticles = particleManager.createJumpParticles();
player.setupParticles(moveParticles, jumpParticles);
```

## Optional Elements (Up to 6 bonus points)

Consider implementing:
- Parallax background layers
- Complex camera (deadzone, adaptive, vertical movement)
- Double jumping and wall jumping
- Alternate player movement (dashing, crouching, kicking)
- Enhanced visual effects
- Player death/incapacitation mechanics
- Enemies
- Puzzles
- Secret levels
- Power-ups
- Dynamic level elements
- Moving platforms
- Interactive items
- Animated level elements
- Underwater swimming movement

## Team Collaboration

This project is set up for team collaboration. Each team member should:
1. Create their own level scene file
2. Document their level's unique mechanic in the README
3. Clearly mark which features are bonus (optional) elements
4. Test that all levels work with the common core gameplay mechanics

## License

ISC

