# CMPM 120 Project 3 - Platformer Game

## Controls

- **Left/Right Arrow Keys** or **A/D**: Move left/right  
- **Up/Down Arrow Keys** or **W/S**: Climb ladders when overlapping a ladder (Level 1)  
- **Space**: Jump / Double Jump  
- **E**: Activate levers when close and level requirements are met  
- **1 / 2**: Choose Level 1 or Level 2 from the Level Select screen  
- **ESC**: From a level, return to Level Select; from Level Select, return to the title screen  
- **Defeating slimes**: Run into a slime or land on it with the player to destroy it (instead of taking damage)

## Camera Behavior

The camera uses smooth following with a deadzone system:
- **Smooth Follow**: Camera follows the player with a slight delay (lerp-based) for both horizontal and vertical movement
- **Deadzone**: A 200x150 pixel deadzone keeps the player roughly centered but allows some movement before the camera starts following
- **Dynamic Vertical Adjustment**: Camera adjusts dynamically during jumps and vertical exploration
- **Boundary Handling**: Camera eases to stop at level boundaries to prevent showing empty space
- **Framing**: Player remains centered unless nearing the edge of the level

## Level Information

### Level 1: Ashen Forest
- **Created by**: Suhas
- **Unique Mechanic**: Lever-activated gate with killable shooting slimes and ladders
  - Players must **collect all 10 glowing crystals and defeat all slimes** to unlock the lever  
    - Slimes patrol fixed ground paths, fire slime-shot projectiles, and can be defeated by **running into them or jumping on them**  
  - Once all crystals are collected and all slimes are defeated, the lever on a late platform begins to glow and becomes interactable  
  - Activating the lever (**press E when near**) opens the gate on the final platform and activates the exit portal  
  - The player must then reach the exit portal to complete the level  
  - Ladders (vines) are required to reach at least one crystal, emphasizing vertical movement as part of the puzzle

### Level 2: Molten Depths
- **Created by**: Tejas
- **Unique Mechanic**: Lava hazards with temporary fire shield power-up
  - The level features lava floors that damage the player on contact
  - A fire shield power-up grants temporary immunity to lava and enemy projectiles for 5 seconds
  - Moving platforms traverse over lava, requiring careful timing
  - Slime enemies ride on moving platforms and fire projectiles that can be blocked by the fire shield
  - Players must strategically use the fire shield to navigate hazardous areas

## Level Selection

To select which level to play:

1. **From Title Screen**: Press **SPACE** or **ENTER** to go to the Level Select screen
2. **Level Select Screen**: 
   - Press **1** to play Level 1 (Ashen Forest)
   - Press **2** to play Level 2 (Molten Depths)
   - Press **ESC** to return to the title screen
3. **During Gameplay**: Press **ESC** at any time during a level to return to the Level Select screen

The Level Select screen displays both levels with their names and creators.

## Bonus Elements

### Double Jumping
- **Implementation**: The player can perform a second jump while in mid-air
- **Location**: Available in both Level 1 and Level 2
- **Usage**: Allows players to reach higher platforms and navigate more complex level geometry

### Enemies
- **Implementation**: 
  - **Level 1**: Three Slime Blob enemies that patrol fixed ground paths, fire slime-shot projectiles, and can be defeated by contact
  - **Level 2**: Slime enemies that ride on moving platforms, act as turrets firing projectiles, and can also be defeated by contact
- **Behavior**: 
  - Slimes in Level 1 bounce back and forth between set boundaries and shoot horizontally along the ground
  - Slimes in Level 2 act as turrets, firing projectiles at regular intervals while attached to moving platforms
  - Slimes in both levels are defeated by **running into them or jumping on them**
  - The player loses hearts from **hazards** such as lava, pits (falling off the world), and enemy projectiles
- **Animation**: Enemies flip their sprites when changing direction

### Interactive Items
- **Implementation**: 
  - **Level 1**: Lever and Gate system
    - Lever can be activated when **all crystals are collected and all slimes are defeated** (press **E** when near)
    - Lever and gate are on separate late platforms, with the gate blocking the exit portal until the lever is activated
    - Visual feedback shows when the lever is ready and when the player is near (tinting, on-screen hints)
  - **Level 2**: Fire Shield power-up pickup
    - Fire Shield: temporary power-up that grants immunity to lava and projectiles, with a tint effect and on-screen explanation
- **Interaction**: Players must be near interactive items and press **E** (for levers in level 1) to activate them

### Moving Platforms
- **Implementation**: 
  - **Level 2**: Two moving platforms that traverse horizontally over lava
  - Platforms move back and forth between set waypoints at different speeds
  - Players can jump onto platforms and ride them without sliding
  - Slime enemies can attach to moving platforms and move with them
- **Physics**: Player velocity adjusts when landing on moving platforms for smooth movement

### Power-ups (1 point)
- **Implementation**: 
  - **Level 2**: Fire Shield power-up
    - Grants 5 seconds of immunity to lava and enemy projectiles
    - Player sprite is tinted to indicate active shield
    - Shield automatically expires after the duration
- **Visual Feedback**: Power-up pickup shows a message explaining the shield's effect

### Juicy Juice
- **Implementation**: Enhanced visual effects beyond required particles
  - Crystal collection particles with upward burst effect
  - Screen shake on heavy landings
  - Glowing crystal animations (rotation and scale pulsing)
  - Particle effects for movement, jumping, landing, and collection
  - Visual feedback for lever interaction (tinting and hints)
  - Gate fade-out animation when opened

### Complex Camera / Deadzone
- **Implementation**:
  - Both levels inherit camera behavior from `BaseLevelScene`, which configures:
    - Smooth camera follow with lerp-based horizontal/vertical tracking
    - A **deadzone** region (200x150) that keeps the player near the center of the screen before the camera starts moving
    - World bounds so the camera does not show outside the level geometry

### Ways for the Player to Die & Hearts System
- **Implementation**:
  - Player has **3 hearts**; losing all hearts triggers a Game Over screen
  - Hazards that consume hearts:
    - **Lava** (Level 2)
    - **Falling off the world** (both levels)
    - **Slime projectiles** (both levels; blocked when fire shield is active)
  - `GameOverScene` allows retrying the same level, returning to level select, or going back to the title screen without restarting the game

### Dynamic Level Elements
- **Implementation**:
  - **Gate objects** that change sprite (closed/open), alpha, and collision state when opened
  - **Exit portals** that visually “wake up” (pulsing scale tween) when the level’s conditions are satisfied
  - **Level 1**: Lever unlock condition dynamically depends on collectibles and enemies (all crystals + all slimes)
