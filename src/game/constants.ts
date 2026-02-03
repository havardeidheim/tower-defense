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

// Frame rate
export const TARGET_FPS = 60;
export const FRAME_TIME = 1000 / TARGET_FPS;

// Tower types
export const TOWER_NORMAL = 'Normal';
export const TOWER_AREA = 'Area';
export const TOWER_SPREAD = 'Spread';
export const TOWER_POISON = 'Poison';

// Enemy type characters
export const ENEMY_NORMAL = 'n';
export const ENEMY_FAST = 'f';
export const ENEMY_SHIELD = 's';
export const ENEMY_DODGE = 'd';
export const ENEMY_NOSLOW = '<';
export const ENEMY_SUPER = '*';

// Spell types
export const SPELL_LIGHTNING = 'Lightning';
export const SPELL_RUNESTONE = 'Runestone';

// Tower costs
export const TOWER_COSTS: Record<string, number> = {
    'Normal': 80,
    'Area': 80,
    'Spread': 80,
    'Poison': 70
};

// Spell costs
export const SPELL_COSTS: Record<string, number> = {
    'Lightning': 50,
    'Runestone': 50
};

// Game settings
export const STARTING_GOLD = 180;
export const STARTING_MANA = 60;
export const STARTING_MANA_LEVEL3 = 240;
export const MAX_MANA = 100;
export const STARTING_LIVES = 5;

// Timing (in ms)
export const ENEMY_SPAWN_INTERVAL = 1000;
export const ENEMY_SPAWN_INTERVAL_FAST = 500;
export const POISON_TICK_INTERVAL = 700;
export const POISON_TICK_INTERVAL_FAST = 350;
export const SLOW_DURATION = 1600;

// Combat
export const POISON_DAMAGE_PER_TICK = 18;
export const SHIELD_DAMAGE_REDUCTION = 10;
export const DODGE_CHANCE = 0.5;
export const NOSLOW_BLOCK_COUNT = 3;

// Gold rewards per enemy type (base)
export const ENEMY_GOLD_REWARD = 10;
