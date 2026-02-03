# Road Defender: Revenge of the Road

A TypeScript tower defense game ported from the original Java implementation. Players defend against waves of enemies by strategically placing towers along a path.

## Technologies

- **TypeScript** - Type-safe JavaScript with strict compiler settings
- **Vite** - Fast build tool and dev server (runs on port 8080)
- **HTML5 Canvas** - For rendering game graphics
- No external game frameworks - custom game engine implementation

## Codebase Structure

```
src/
├── game/               # Core game loop and initialization
│   ├── Game.ts        # Main game class
│   ├── GameLoop.ts    # Fixed 60 FPS game loop
│   ├── main.ts        # Entry point
│   └── constants.ts   # Game constants
│
├── core/              # Base classes and utilities
│   ├── GameObject.ts  # Base class for all game objects
│   ├── Vector2.ts     # 2D vector math
│   └── Rectangle.ts   # Collision/bounds helpers
│
├── scenes/            # Game state management
│   ├── Scene.ts       # Base scene class
│   ├── LoadingScene.ts  # Resource loading screen
│   ├── MenuScene.ts     # Level select menu
│   └── GameScene.ts     # Main gameplay scene
│
├── entities/
│   ├── enemies/       # Enemy types (Normal, Fast, Dodge, Shield, Super, Noslow)
│   ├── towers/        # Tower types (Normal, Area, Spread, Poison)
│   ├── projectiles/   # Projectile types for tower attacks
│   └── effects/       # Visual effects (AreaShot)
│
├── spells/            # Player-castable spells (Lightning, Runestone)
│
├── level/             # Level system
│   ├── Level.ts       # Level grid and tile management
│   ├── Tile.ts        # Individual tile logic
│   └── WaveManager.ts # Enemy wave spawning
│
├── ui/                # User interface
│   ├── UIManager.ts   # Coordinates all UI elements
│   ├── TowerButton.ts # Tower purchase buttons
│   ├── SpellButton.ts # Spell cast buttons
│   └── InfoDisplay.ts # Gold/mana/lives display
│
├── resources/         # Asset management
│   ├── ResourceLoader.ts  # Loads all game assets on startup
│   ├── ImageCache.ts      # Manages PNG sprite images
│   ├── SoundManager.ts    # Manages WAV audio files
│   └── LevelLoader.ts     # Parses level txt files
│
├── save/              # Persistence
│   └── SaveManager.ts # Cookie-based save system for level progress
│
└── index.html         # Game container and styling

public/                # Static assets (PNG images, WAV sounds, level files)
```

## Key Concepts

### Game Loop
- Fixed framerate of 60 FPS
- Each GameObject implements `update()` and `render()` methods
- Scene-based architecture for managing game states

### Resource Loading
- All images (.png) and sounds (.wav) are preloaded on startup
- Loading screen displays progress
- Resources are cached in memory for the game session

### Level System
- Levels defined in txt files with:
  - Map layout (grid of tiles)
  - Wave data (enemy types and spawn timing)
- Player must survive all waves without losing all lives

### Gameplay Mechanics
- **Gold**: Earned by killing enemies, used to build/upgrade towers
- **Mana**: Accumulates over time, used to cast spells
- **Lives**: Lost when enemies reach the goal
- **Stars**: Awarded based on lives remaining (3 stars = no lives lost)

### Towers
- Placed on buildable tiles
- Can be upgraded or sold
- Different types have unique attack patterns and targets

### Save System
- Cookie-based persistence
- Tracks level completion and stars earned
- No server-side storage

## Development

```bash
# Install dependencies
npm install

# Run dev server (localhost:8080)
npm run dev

# Type check without building
npm run typecheck

# Build for production
npm run build
```

## Project Origin

Ported from an original Java tower defense game located in `original-java-game/`. The TypeScript version uses modern web technologies while preserving the original gameplay mechanics.
