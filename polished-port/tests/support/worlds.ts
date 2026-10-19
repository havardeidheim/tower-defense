import { seededRandom, type Random } from '../../src/core/Random';
import { Enemy } from '../../src/entities/enemies/Enemy';
import { enemyTypeFor } from '../../src/entities/enemies/EnemyTypes';
import { TILE_SIZE } from '../../src/game/constants';
import { World } from '../../src/world/World';
import { loadLevels } from './files';

const levels = loadLevels();

export function newWorld(levelIndex = 0, random: Random = seededRandom(1)): World {
  return new World(levels.createLevel(levelIndex), random);
}

/** Puts an enemy straight onto a road tile, as if it had walked there. */
export function placeEnemy(world: World, char: string, col: number, row: number, random: Random = seededRandom(1)): Enemy {
  const enemy = new Enemy(enemyTypeFor(char)!, 0, { col, row }, world.level, random);
  enemy.distance = 100 + col * TILE_SIZE;
  world.enemies.push(enemy);
  return enemy;
}

/** A random source that always returns the same number. */
export function fixedRandom(value: number): Random {
  return () => value;
}
