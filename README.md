# CMPM 120 Project 3 - Platformer Game

## Controls

- **Arrow Keys** or **WASD**: Move left/right
- **Space** or **Up Arrow** or **W**: Jump / Double Jump
- **E** or **Space**: Interact with lever (when near and all crystals collected)
- **ESC**: Return to level select / Return to title screen

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
- **Unique Mechanic**: Lever-activated gate system
  - Players must collect all 10 glowing crystals to unlock the lever
  - Once all crystals are collected, the lever becomes interactable
  - Activating the lever (press E or Space when near) opens the gate blocking the exit portal
  - Players must then reach the exit portal to complete the level
  - This creates a two-step progression: collect → unlock → activate → exit

### Level 2: Molten Depths
- **Created by**: Tejas
- **Unique Mechanic**: Lava hazards with temporary fire shield power-up
  - The level features lava floors that damage the player on contact
  - A fire shield power-up grants temporary immunity to lava and enemy projectiles for 5 seconds
  - Moving platforms traverse over lava, requiring careful timing
  - Slime enemies fire projectiles that can be blocked by the fire shield
  - Players must strategically use the fire shield to navigate hazardous areas

## Level Selection

To select which level to play:

1. **From Title Screen**: Press **SPACE** to go to the Level Select screen
2. **Level Select Screen**: 
   - Press **1** to play Level 1 (Ashen Forest)
   - Press **2** to play Level 2 (Molten Depths)
   - Press **ESC** to return to the title screen
3. **During Gameplay**: Press **ESC** at any time during a level to return to the Level Select screen

The Level Select screen displays both levels with their names and creators.

## Bonus Elements

### Double Jumping (1 point)
- **Implementation**: The player can perform a second jump while in mid-air
- **Location**: Available in both Level 1 and Level 2
- **Usage**: Allows players to reach higher platforms and navigate more complex level geometry

### Enemies (1.5 points)
- **Implementation**: 
  - **Level 1**: Three Slime Blob enemies that patrol fixed paths horizontally
  - **Level 2**: Slime enemies that fire projectiles and can attach to moving platforms
- **Behavior**: 
  - Slimes in Level 1 bounce back and forth between set boundaries
  - Slimes in Level 2 act as turrets, firing projectiles at regular intervals
  - Contact with enemies causes the player to lose a heart
- **Animation**: Enemies flip their sprites when changing direction

### Interactive Items (2 points)
- **Implementation**: 
  - **Level 1**: Lever and Gate system
    - Lever can be activated when all crystals are collected (press E or Space when near)
    - Gate blocks the exit portal until the lever is activated
    - Visual feedback shows when the lever is ready and when the player is near
  - **Level 2**: Fire Shield power-up pickup
    - Temporary power-up that grants immunity to lava and projectiles
    - Visual indicator shows when the shield is active
- **Interaction**: Players must be near interactive items and press the interact key

### Moving Platforms (1.5 points)
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

### Juicy Juice (0.5 points)
- **Implementation**: Enhanced visual effects beyond required particles
  - Crystal collection particles with upward burst effect
  - Screen shake on heavy landings
  - Glowing crystal animations (rotation and scale pulsing)
  - Particle effects for movement, jumping, landing, and collection
  - Visual feedback for lever interaction (tinting and hints)
  - Gate fade-out animation when opened
