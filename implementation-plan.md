# Tower Defense Game - TypeScript Port Implementation Plan

## Overview

Port of the Java tower defense game "Road Defender: Revenge of the Road" to TypeScript with HTML5 Canvas rendering.

### Key Specifications
- **Window Size**: 854x506 pixels (original: 854x506)
- **Game Area**: 640x480 pixels (16x12 tiles at 40px each)
- **UI Area**: 640-854x0-506 (right panel)
- **Frame Rate**: 60 FPS (fixed)
- **Tile Size**: 40x40 pixels

---

## Phase 1: Project Setup and Core Infrastructure

### 1.1 Project Structure
```
src/
├── index.html
├── main.ts                 # Entry point
├── game/
│   ├── Game.ts            # Main game controller
│   ├── GameLoop.ts        # Fixed 60fps game loop
│   └── constants.ts       # Game constants (tile types, sizes, etc.)
├── core/
│   ├── GameObject.ts      # Base class for all game objects
│   ├── Vector2.ts         # 2D vector utility
│   └── Rectangle.ts       # Rectangle utility for collision/bounds
├── resources/
│   ├── ResourceLoader.ts  # Async resource loading with progress
│   ├── ImageCache.ts      # Image storage and retrieval
│   ├── SoundManager.ts    # Audio playback management
│   └── LevelLoader.ts     # Level and wave data parsing
├── entities/
│   ├── enemies/
│   │   ├── Enemy.ts       # Base enemy class
│   │   ├── NormalEnemy.ts
│   │   ├── FastEnemy.ts
│   │   ├── ShieldEnemy.ts
│   │   ├── DodgeEnemy.ts
│   │   ├── NoslowEnemy.ts
│   │   └── SuperEnemy.ts
│   ├── towers/
│   │   ├── Tower.ts       # Base tower class
│   │   ├── NormalTower.ts
│   │   ├── AreaTower.ts
│   │   ├── SpreadTower.ts
│   │   └── PoisonTower.ts
│   ├── projectiles/
│   │   ├── Projectile.ts  # Base projectile class
│   │   ├── NormalProjectile.ts
│   │   ├── PoisonProjectile.ts
│   │   └── SpreadProjectile.ts
│   └── effects/
│       └── AreaShot.ts    # Area effect animation
├── spells/
│   ├── Spell.ts           # Base spell class
│   ├── Lightning.ts
│   └── Runestone.ts
├── ui/
│   ├── UIManager.ts       # UI rendering and button management
│   ├── Button.ts          # Base button class
│   ├── TowerButton.ts     # Tower purchase buttons
│   ├── SpellButton.ts     # Spell cast buttons
│   ├── UpgradeButton.ts   # Tower upgrade button
│   ├── SellButton.ts      # Tower sell button
│   ├── InfoButton.ts      # Enemy wave info display
│   └── GameButton.ts      # Start/Pause/Fast/Menu buttons
├── scenes/
│   ├── Scene.ts           # Base scene class
│   ├── LoadingScene.ts    # Resource loading with progress bar
│   ├── MenuScene.ts       # Level select menu
│   ├── GameScene.ts       # Main gameplay
│   └── HelpScene.ts       # Help overlay
├── level/
│   ├── Level.ts           # Level data structure
│   ├── Tile.ts            # Tile types and rendering
│   └── WaveManager.ts     # Wave spawning logic
└── save/
    └── SaveManager.ts     # Cookie-based progress saving

public/
├── images/                # Copy from original-java-game
├── sounds/                # Copy from original-java-game
└── levels/                # Copy from original-java-game
```

### 1.2 Build System Setup
- TypeScript configuration (tsconfig.json)
- Simple bundler (esbuild or similar)
- Development server with hot reload
- Asset copying to dist folder

### 1.3 HTML Entry Point
```html
<!DOCTYPE html>
<html>
<head>
    <title>Road Defender: Revenge of the Road</title>
    <style>
        body { margin: 0; background: #222; display: flex;
               justify-content: center; align-items: center;
               min-height: 100vh; }
        canvas { display: block; }
    </style>
</head>
<body>
    <canvas id="game" width="854" height="506"></canvas>
    <script src="bundle.js"></script>
</body>
</html>
```

---

## Phase 2: Core Systems

### 2.1 Game Constants (constants.ts)
```typescript
// Tile characters
export const TILE_GROUND = '.';
export const TILE_OBSTACLE = '#';
export const TILE_PATH = 'x';
export const TILE_SPAWN = 's';
export const TILE_TARGET = 't';

// Sizes
export const TILE_SIZE = 40;
export const GAME_WIDTH = 640;
export const GAME_HEIGHT = 480;
export const UI_WIDTH = 214;
export const CANVAS_WIDTH = 854;
export const CANVAS_HEIGHT = 506;
export const MAP_COLS = 16;
export const MAP_ROWS = 12;

// Tower types
export const TOWER_NORMAL = 'Normal';
export const TOWER_AREA = 'Area';
export const TOWER_SPREAD = 'Spread';
export const TOWER_POISON = 'Poison';

// Enemy types
export const ENEMY_NORMAL = 'n';
export const ENEMY_FAST = 'f';
export const ENEMY_SHIELD = 's';
export const ENEMY_DODGE = 'd';
export const ENEMY_NOSLOW = '<';
export const ENEMY_SUPER = '*';
```

### 2.2 GameObject Base Class
```typescript
abstract class GameObject {
    x: number;
    y: number;
    width: number;
    height: number;

    abstract update(deltaTime: number): void;
    abstract render(ctx: CanvasRenderingContext2D): void;

    get centerX(): number { return this.x + this.width / 2; }
    get centerY(): number { return this.y + this.height / 2; }
}
```

### 2.3 Game Loop (60 FPS Fixed)
```typescript
class GameLoop {
    private lastTime: number = 0;
    private accumulator: number = 0;
    private readonly timestep: number = 1000 / 60; // ~16.67ms

    start(updateFn: (dt: number) => void, renderFn: () => void) {
        const loop = (currentTime: number) => {
            const deltaTime = currentTime - this.lastTime;
            this.lastTime = currentTime;
            this.accumulator += deltaTime;

            while (this.accumulator >= this.timestep) {
                updateFn(this.timestep);
                this.accumulator -= this.timestep;
            }

            renderFn();
            requestAnimationFrame(loop);
        };
        requestAnimationFrame(loop);
    }
}
```

---

## Phase 3: Resource Loading System

### 3.1 Resource Manifest
Define all resources to load:
- **Images** (58 files):
  - UI: background, helpback, ground, path, spawn, select, cross, mapcross
  - Towers: normaltower, areatower, poisontower, spreadtower, blanctower
  - Projectiles: normalprojectile, poisonprojectile, spreadprojectile
  - Buttons: blancknapp, upgradeknapp, sellknapp, lightningknapp
  - Effects: lightning
  - Range circles: range80, range100, range120, range140, range150, range160, range170
  - Area shot animation: areashot0-5
  - Enemies (use only right-facing sprite, rotate in-game):
    - peasant (Normal), solider (Shield), scout (Fast)
    - assassin (Dodge), vanguard (Noslow), paragon (Super)
- **Sounds** (16 files):
  - UI: select, build, knapp, sell
  - Combat: stone, frost, fire, poison, lightning
  - Game: die, ok, verygood
  - Narration: endiscoming, forseevictory, noonealive, letsgo
- **Level Data**:
  - levels.txt (map layouts)
  - wavedata.txt (wave definitions)

### 3.2 ResourceLoader Class
```typescript
class ResourceLoader {
    private loaded: number = 0;
    private total: number = 0;
    private onProgress?: (progress: number) => void;

    async loadAll(manifest: ResourceManifest): Promise<void> {
        this.total = manifest.images.length + manifest.sounds.length;

        const imagePromises = manifest.images.map(img => this.loadImage(img));
        const soundPromises = manifest.sounds.map(snd => this.loadSound(snd));

        await Promise.all([...imagePromises, ...soundPromises]);
    }

    private async loadImage(path: string): Promise<HTMLImageElement> {
        return new Promise((resolve, reject) => {
            const img = new Image();
            img.onload = () => {
                this.loaded++;
                this.onProgress?.(this.loaded / this.total);
                resolve(img);
            };
            img.onerror = reject;
            img.src = path;
        });
    }

    private async loadSound(path: string): Promise<AudioBuffer> {
        const response = await fetch(path);
        const arrayBuffer = await response.arrayBuffer();
        const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
        this.loaded++;
        this.onProgress?.(this.loaded / this.total);
        return audioBuffer;
    }
}
```

### 3.3 Loading Scene
- Display loading bar matching level select style
- Show "Loading..." text
- Progress bar fills as resources load
- Transition to MenuScene when complete

---

## Phase 4: Level System

### 4.1 Level Data Structure
```typescript
interface Level {
    name: string;
    map: string[][];           // 16x12 tile grid
    waves: string[];           // Wave definition strings
    spawnPoints: Vector2[];    // List of spawn locations
    targetPoint: Vector2;      // Goal location
}
```

### 4.2 Level Loader
Parse levels.txt and wavedata.txt:
- Split by blank lines for level boundaries
- Parse map characters into 2D array
- Parse wave strings preserving formatting (spaces = delays)
- Level names: "Utopia", "The Butchers Ballroom", "Paths Untrodden", "Ad Astra"

### 4.3 Wave Manager
```typescript
class WaveManager {
    private currentWave: number = -1;
    private enemyIndex: number = 0;
    private spawnTimer: number = 0;
    private spawnInterval: number = 1000; // 1 second between enemies

    update(deltaTime: number, fastMode: boolean): Enemy | null {
        // Adjust timing for fast mode
        const interval = fastMode ? 500 : 1000;

        this.spawnTimer += deltaTime;
        if (this.spawnTimer >= interval) {
            this.spawnTimer = 0;
            return this.spawnNextEnemy();
        }
        return null;
    }

    private parseWaveChar(wave: string): Enemy | null {
        // Handle level prefix (e.g., "2n" = level 2 normal)
        // Space = delay
        // Return appropriate enemy type
    }
}
```

### 4.4 Pathfinding
Simple tile-based pathfinding:
- Enemies follow path tiles (x, s, t)
- At each tile, check NSEW for next path tile
- Direction changes smoothly at tile centers
- Multiple spawn points supported (level 3 has 3 spawns)

---

## Phase 5: Enemies

### 5.1 Base Enemy Class
```typescript
abstract class Enemy extends GameObject {
    health: number;
    maxHealth: number;
    speed: number;
    maxSpeed: number;
    damage: number = 1;          // Damage to player on reaching goal
    level: number;               // 0-7, affects stats
    direction: 'u' | 'd' | 'l' | 'r' = 'r';
    poisonTicks: number = 0;
    slowTimer: number = 0;
    pixelsTraveled: number = 0;  // For targeting priority

    abstract getBaseHealth(): number;
    abstract getBaseSpeed(): number;

    takeDamage(amount: number): void;
    applyPoison(ticks: number): void;
    applySlow(amount: number, damage: number): void;
    die(): void;
    reachGoal(): void;
}
```

### 5.2 Enemy Types Implementation

| Type | Class | Sprite | Base Speed | Base Health | Special |
|------|-------|--------|------------|-------------|---------|
| n | NormalEnemy | peasant | 1.2 | 100+100*level | None |
| f | FastEnemy | scout | 1.7 | 100+100*level | Faster |
| s | ShieldEnemy | solider | 1.2 | 130+130*level | Reduces damage by 10 |
| d | DodgeEnemy | assassin | 1.6 | 70+70*level | 50% dodge chance |
| < | NoslowEnemy | vanguard | 1.6 | 120+100*level | First 3 hits blocked |
| * | SuperEnemy | paragon | 1.4 | 70+70*level | Dodge+Shield+Noslow |

### 5.3 Enemy Rendering
- Use single sprite (right-facing)
- Rotate based on direction:
  - Right: 0°
  - Down: 90°
  - Left: 180°
  - Up: 270°
- Draw health bar above enemy (green bar, width = health%)

---

## Phase 6: Towers

### 6.1 Base Tower Class
```typescript
abstract class Tower extends GameObject {
    target: Enemy | null = null;
    damage: number;
    range: number;
    attackSpeed: number;        // Seconds between attacks
    level: number = 0;
    maxLevel: number = 3;
    cooldownTimer: number = 0;

    abstract getBaseDamage(): number;
    abstract getBaseRange(): number;
    abstract getBaseSpeed(): number;
    abstract getUpgradeCost(): number;
    abstract createProjectile(target: Enemy): Projectile;

    scan(enemies: Enemy[]): void;      // Find target
    checkRange(enemy: Enemy): boolean;  // Distance check
    fire(): Projectile | null;          // Create projectile
    upgrade(): void;                    // Apply upgrade stats
    getSellValue(): number;             // 50% + 10*level
}
```

### 6.2 Tower Types Implementation

| Tower | Cost | Range | Speed | Damage | Max Lvl | Upgrades |
|-------|------|-------|-------|--------|---------|----------|
| Normal | 80 | 140 | 1.2s | 20 | 3 | +10 range, +8 dmg, -0.1 speed per level |
| Area | 80 | 80 | 2.0s | 20 | 3 | +6 dmg, +5% slow (30→50%), +20 range at L3 |
| Spread | 80 | 140 | 1.5s | 16 | 3 | +1 target (2→4), +2 dmg, bounces at L3 |
| Poison | 70 | 120 | 1.2s | 2 | 3 | +1 duration, +1 dmg each level |

### 6.3 Tower Targeting
- Scan all enemies in range
- Target enemy with most pixels traveled (furthest along path)
- Poison tower prioritizes unpoisoned enemies
- Spread tower targets multiple enemies

---

## Phase 7: Projectiles

### 7.1 Base Projectile Class
```typescript
abstract class Projectile extends GameObject {
    target: Enemy;
    tower: Tower;
    damage: number;
    speed: number;
    vx: number = 0;
    vy: number = 0;

    abstract onHit(): void;

    update(deltaTime: number): void {
        // Heat-seek toward target
        const angle = Math.atan2(
            this.target.centerY - this.centerY,
            this.target.centerX - this.centerX
        );
        this.vx = Math.cos(angle) * this.speed;
        this.vy = Math.sin(angle) * this.speed;

        this.x += this.vx;
        this.y += this.vy;

        // Check collision
        if (this.hitTest()) {
            this.onHit();
        }
    }
}
```

### 7.2 Projectile Types
- **NormalProjectile**: Speed 6, deals direct damage
- **PoisonProjectile**: Speed 6, applies poison ticks
- **SpreadProjectile**: Speed 3, can bounce at max tower level

---

## Phase 8: Spells

### 8.1 Lightning Spell
- Cost: 50 mana
- Effect: 200 damage + stun (100% slow)
- Cannot be dodged
- Cast by clicking on enemy

### 8.2 Runestone Spell
- Cost: 50 mana
- Effect: Convert obstacle (#) to buildable ground (.)
- Cast by clicking on obstacle tile
- Show placement preview

### 8.3 Mana System
- Starting mana: 60 (240 on level 3)
- Max mana: 100
- Gain: 1 mana per 2 poison ticks (every ~1.4 seconds per poisoned enemy)

---

## Phase 9: UI System

### 9.1 UI Layout (Right Panel: 640-854px)
```
┌─────────────────────────────┐
│  Tower Buttons (4)          │ y=35
│  [N] [A] [S] [P]            │
├─────────────────────────────┤
│  Spell Buttons (2)          │ y=105
│  [⚡] [🪨]                   │
├─────────────────────────────┤
│  Stats Display              │
│  Gold: 180                  │
│  Mana: 60/100               │
│  Lives: 5                   │
│  Wave: 1/18                 │
├─────────────────────────────┤
│  Selected Tower Info        │
│  [Upgrade] [Sell]           │
├─────────────────────────────┤
│  Enemy Wave Info            │
│  (Shows next wave enemies)  │
├─────────────────────────────┤
│  Game Controls              │
│  [Start] [Fast] [Menu]      │
└─────────────────────────────┘
```

### 9.2 Button Classes
- **TowerButton**: Shows tower icon, cost, initiates placement
- **SpellButton**: Shows spell icon, mana cost
- **UpgradeButton**: Shows when tower selected, displays cost
- **SellButton**: Shows when tower selected, displays refund value
- **InfoButton**: Shows enemy count in next wave on hover
- **GameButton**: Start/Pause/Resume/Fast/Menu/Help

### 9.3 Tower Placement
- Click tower button → enter placement mode
- Show tower preview at cursor with range circle
- Green = valid placement (ground tile without tower)
- Red X = invalid placement
- Click to place, deduct gold
- ESC or right-click to cancel

### 9.4 Tower Selection
- Click on placed tower to select
- Show selection border and range circle
- Display tower stats in UI
- Show upgrade/sell buttons

---

## Phase 10: Scenes

### 10.1 LoadingScene
- Display loading progress bar
- Style matching level select screen
- Show resource count (X/Y loaded)
- Transition to MenuScene when complete

### 10.2 MenuScene (Level Select)
- Display 4 level buttons with names
- Show stars earned (0-3) per level
- Show lock/unlock status
- Level 1 always unlocked
- Subsequent levels unlock on completion
- Start button for each level

### 10.3 GameScene
- Main gameplay scene
- Renders map, enemies, towers, projectiles
- Handles input (clicks, keyboard)
- Manages game state (playing, paused, won, lost)

### 10.4 HelpScene (Overlay)
- Display help text from info.txt
- Semi-transparent overlay
- Click anywhere to close

---

## Phase 11: Save System

### 11.1 Cookie-Based Save
```typescript
interface SaveData {
    levelsUnlocked: boolean[];  // [true, false, false, false]
    starsEarned: number[];      // [3, 0, 0, 0]
}

class SaveManager {
    private static COOKIE_NAME = 'td_save';

    static save(data: SaveData): void {
        const json = JSON.stringify(data);
        document.cookie = `${this.COOKIE_NAME}=${encodeURIComponent(json)};max-age=31536000`;
    }

    static load(): SaveData {
        // Parse cookie, return defaults if not found
        return { levelsUnlocked: [true, false, false, false], starsEarned: [0,0,0,0] };
    }
}
```

### 11.2 Star Calculation
- 5 lives remaining: 3 stars
- 3-4 lives remaining: 2 stars (plays "ok" sound)
- 1-2 lives remaining: 1 star
- 0 lives: Failed (plays "die" sound)

---

## Phase 12: Sound System

### 12.1 SoundManager
```typescript
class SoundManager {
    private context: AudioContext;
    private buffers: Map<string, AudioBuffer> = new Map();

    play(name: string): void {
        const buffer = this.buffers.get(name);
        if (buffer) {
            const source = this.context.createBufferSource();
            source.buffer = buffer;
            source.connect(this.context.destination);
            source.start();
        }
    }
}
```

### 12.2 Sound Triggers
- **select**: Tower clicked
- **build**: Tower placed, Runestone cast
- **knapp**: Button clicked
- **lightning**: Lightning spell cast
- **stone/frost/fire/poison**: Tower fires
- **sell**: Tower sold
- **die**: Level failed
- **ok**: Level passed (3-4 lives)
- **verygood**: Level passed (5 lives)
- **endiscoming/forseevictory/noonealive/letsgo**: Level start narration

---

## Phase 13: Game Flow

### 13.1 Main Game Class
```typescript
class Game {
    canvas: HTMLCanvasElement;
    ctx: CanvasRenderingContext2D;
    currentScene: Scene;
    resources: ResourceCache;
    saveManager: SaveManager;
    soundManager: SoundManager;

    async init(): Promise<void> {
        // Show loading scene
        // Load all resources
        // Transition to menu
    }

    changeScene(scene: Scene): void {
        this.currentScene = scene;
    }
}
```

### 13.2 GameScene State
```typescript
class GameScene extends Scene {
    level: Level;
    enemies: Enemy[] = [];
    towers: Tower[] = [];
    projectiles: Projectile[] = [];
    areaEffects: AreaShot[] = [];

    gold: number = 180;
    mana: number = 60;
    lives: number = 5;

    waveManager: WaveManager;
    uiManager: UIManager;

    selectedTower: Tower | null = null;
    placingTower: Tower | null = null;
    castingSpell: Spell | null = null;

    isPaused: boolean = false;
    isFastMode: boolean = false;
    gameState: 'waiting' | 'playing' | 'won' | 'lost' = 'waiting';
}
```

---

## Implementation Order

### Step 1: Project Setup (Estimated: Foundation)
1. Create directory structure
2. Set up TypeScript and build system
3. Create HTML entry point
4. Implement basic canvas rendering

### Step 2: Core Systems
1. Implement GameObject base class
2. Implement GameLoop (60 FPS fixed timestep)
3. Create constants file
4. Implement Vector2 and Rectangle utilities

### Step 3: Resource Loading
1. Implement ResourceLoader
2. Implement ImageCache
3. Implement SoundManager
4. Implement LevelLoader
5. Create LoadingScene with progress bar
6. Copy assets from original-java-game

### Step 4: Level and Tile System
1. Implement Level data structure
2. Implement Tile rendering
3. Implement map rendering
4. Implement pathfinding for enemies

### Step 5: Enemies
1. Implement base Enemy class
2. Implement all 6 enemy types
3. Implement enemy movement and pathfinding
4. Implement enemy rendering with rotation
5. Implement health bars
6. Implement poison and slow effects

### Step 6: Towers
1. Implement base Tower class
2. Implement all 4 tower types
3. Implement targeting logic
4. Implement tower placement
5. Implement tower upgrades
6. Implement tower selling

### Step 7: Projectiles
1. Implement base Projectile class
2. Implement all 3 projectile types
3. Implement collision detection
4. Implement projectile rendering

### Step 8: Spells
1. Implement Lightning spell
2. Implement Runestone spell
3. Implement mana system

### Step 9: UI System
1. Implement base Button class
2. Implement tower buttons
3. Implement spell buttons
4. Implement upgrade/sell buttons
5. Implement game control buttons
6. Implement info displays
7. Implement tower selection UI

### Step 10: Wave System
1. Implement WaveManager
2. Parse wave data format
3. Implement enemy spawning
4. Implement wave progression

### Step 11: Scenes
1. Implement MenuScene (level select)
2. Implement GameScene
3. Implement HelpScene overlay
4. Implement scene transitions

### Step 12: Save System
1. Implement SaveManager with cookies
2. Implement star calculation
3. Implement level unlock logic

### Step 13: Polish and Testing
1. Add all sound effects
2. Test all 4 levels
3. Verify enemy behaviors match original
4. Verify tower behaviors match original
5. Verify spell behaviors match original
6. Test save/load functionality
7. Test game completion flow

---

## Verification Checklist

### Core Mechanics
- [ ] Game runs at 60 FPS
- [ ] Resources load with progress bar
- [ ] All images display correctly
- [ ] All sounds play correctly

### Enemies
- [ ] All 6 enemy types spawn correctly
- [ ] Enemies follow paths correctly
- [ ] Enemy health scales with level
- [ ] Shield enemies reduce damage by 10
- [ ] Dodge enemies have 50% dodge chance
- [ ] Noslow enemies block first 3 hits
- [ ] Super enemies have all abilities
- [ ] Poison damage applies correctly
- [ ] Slow effects apply correctly
- [ ] Enemies rotate based on direction

### Towers
- [ ] All 4 tower types place correctly
- [ ] Towers only place on ground tiles
- [ ] Tower range visualization works
- [ ] Towers target furthest enemy in range
- [ ] Tower upgrades apply correct stats
- [ ] Tower selling returns correct gold
- [ ] Area tower hits all enemies in range
- [ ] Spread tower hits multiple targets
- [ ] Poison tower prioritizes unpoisoned

### Projectiles
- [ ] All projectiles render correctly
- [ ] Projectiles track targets
- [ ] Spread projectile bounces at max level

### Spells
- [ ] Lightning deals 200 damage + stun
- [ ] Runestone converts obstacles
- [ ] Mana costs deducted correctly
- [ ] Mana regenerates from poison

### UI
- [ ] All buttons clickable
- [ ] Tower placement preview works
- [ ] Tower selection works
- [ ] Stats display correctly
- [ ] Wave info displays correctly

### Levels
- [ ] All 4 levels load correctly
- [ ] All waves spawn correctly
- [ ] Multiple spawn points work (level 3)
- [ ] Level win condition works
- [ ] Level lose condition works

### Save System
- [ ] Progress saves to cookie
- [ ] Progress loads on game start
- [ ] Stars calculate correctly
- [ ] Levels unlock correctly

### Audio
- [ ] All sound effects trigger correctly
- [ ] Level start narration plays
- [ ] Win/lose sounds play

---

## Technical Notes

### Enemy Sprite Rotation
Original game has 4 directional sprites. For the port, use canvas rotation:
```typescript
ctx.save();
ctx.translate(enemy.centerX, enemy.centerY);
ctx.rotate(enemy.directionAngle);
ctx.drawImage(sprite, -20, -20, 40, 40);
ctx.restore();
```

### Fast Mode
When fast mode enabled, run update loop twice per frame:
```typescript
if (isFastMode) {
    update(deltaTime);
    update(deltaTime);
}
```

### Poison Timer
Original uses separate timer (700ms normal, 350ms fast). In port:
- Track time per poisoned enemy
- Apply 18 damage per tick
- Grant 1 mana per 2 ticks globally

### Wave Parsing
Wave format: `[level]type[level]type...`
- Digit = level for next enemy
- Space = 1 second delay
- `|` in level 3 = alternate spawn point indicator

### Resource Paths
Copy resources to public folder:
```
public/images/  ← original-java-game/src/resources/images/
public/sounds/  ← original-java-game/src/resources/sounds/
public/levels/  ← original-java-game/src/resources/levels/
```
