// ============================================================
// Screen and map
// ============================================================

export const CANVAS_WIDTH = 850;
export const CANVAS_HEIGHT = 480;

export const TILE_SIZE = 40;
/** The map fills the left part of the screen; the side panel starts at x = MAP_WIDTH. */
export const MAP_WIDTH = 640;
export const MAP_HEIGHT = 480;

// Tile characters in levels.txt
export const TILE_GROUND = '.';
export const TILE_OBSTACLE = '#';
export const TILE_PATH = 'x';
export const TILE_SPAWN = 's';
export const TILE_TARGET = 't';

// Sprite sizes. Game logic uses these (hit tests, ranges), so they live here and
// not in the image files.
export const TOWER_SIZE = 40;
export const ENEMY_SIZE = 28;
export const PROJECTILE_SIZE = 10;

// ============================================================
// Simulation clock
// ============================================================
// The game runs in fixed ticks of 20 ms, like the original's logic timer. Speeds
// are in pixels per tick and every duration is a whole number of ticks.

export const TICK_MS = 20;
export const TICKS_PER_SECOND = 1000 / TICK_MS;

/** One character of the wave script is read per spawn interval. */
export const SPAWN_INTERVAL_TICKS = 50; // 1.0 s
export const POISON_INTERVAL_TICKS = 35; // 0.7 s
export const MANA_INTERVAL_TICKS = 70; // 1.4 s
/** The first mana arrives with the first poison pulse. */
export const MANA_FIRST_TICKS = 35;
export const SLOW_DURATION_TICKS = 80; // 1.6 s
/** Time between the end of a level and the return to the menu. */
export const END_DELAY_TICKS = 50; // 1.0 s

// ============================================================
// Economy and player
// ============================================================

export const STARTING_GOLD = 180;
export const STARTING_MANA = 60;
/** Ad Astra (the fourth level) starts with extra mana. */
export const STARTING_MANA_AD_ASTRA = 240;
export const AD_ASTRA_INDEX = 3;
/** Mana regeneration stops at this amount. Starting mana can be higher. */
export const MAX_MANA = 100;
export const STARTING_HEALTH = 5;

/** Each tower bought makes the next one of the same type this much more expensive. */
export const TOWER_PRICE_STEP = 10;
/** Price of upgrading from level 1, 2 and 3. */
export const UPGRADE_PRICES = [40, 80, 120] as const;
/** Selling pays half the current price of the tower type plus this per upgrade. */
export const SELL_BONUS_PER_LEVEL = 10;

export const BOUNTY_BASE = 10;
export const BOUNTY_PER_HEALTH_LEVEL = 2;

// ============================================================
// Combat
// ============================================================

export const POISON_TICK_DAMAGE = 18;
export const DODGE_CHANCE = 0.5;

export const SPELL_MANA_COST = 50;
export const LIGHTNING_DAMAGE = 200;
