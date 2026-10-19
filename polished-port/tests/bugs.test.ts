/**
 * Regression tests for bugs in the original (and the direct port) that this port fixes.
 */
import { describe, expect, it } from 'vitest';
import { NormalProjectile } from '../src/entities/attacks/NormalProjectile';
import { newWorld, placeEnemy } from './support/worlds';

describe('double gold', () => {
  it('two frost towers that hit the same dying enemy pay its bounty once', () => {
    const world = newWorld(0);
    world.build('Area', 6, 5);
    world.build('Area', 7, 5);
    const enemy = placeEnemy(world, 'n', 6, 4);
    enemy.health = 1;
    world.start();
    const gold = world.gold.balance;

    for (let i = 0; i < 5 && world.enemies.length > 0; i++) world.tick();

    expect(enemy.state).toBe('killed');
    expect(world.gold.balance).toBe(gold + enemy.bounty);
  });

  it('a second lightning on the same spot while paused finds no enemy', () => {
    // The world is never ticked here, just as when the game is paused.
    const world = newWorld(0);
    world.mana.balance = 100;
    const enemy = placeEnemy(world, 'n', 6, 4);
    const gold = world.gold.balance;

    expect(world.castLightning(enemy.centerX, enemy.centerY)).toBe(enemy);
    expect(world.castLightning(enemy.centerX, enemy.centerY)).toBeNull();
    expect(world.gold.balance).toBe(gold + enemy.bounty);
    expect(world.mana.balance).toBe(50);
    expect(world.enemies).toHaveLength(0);
  });

  it('a stone in flight towards an enemy that escapes does not pay a bounty', () => {
    const world = newWorld(0);
    const tower = world.build('Normal', 7, 3)!;
    // Utopia's end of the road is tile (15, 4); put the enemy on it.
    const enemy = placeEnemy(world, 'n', 15, 4);
    enemy.health = 1;
    world.addProjectile(new NormalProjectile(tower, enemy, 20));
    world.start();
    const gold = world.gold.balance;

    world.tick();

    expect(enemy.state).toBe('escaped');
    expect(world.health).toBe(4);
    expect(world.projectiles).toHaveLength(0);
    expect(world.gold.balance).toBe(gold);
  });
});

describe('selling', () => {
  it('a sold tower is gone at once and cannot be sold again', () => {
    // Not ticking: as when the game is paused.
    const world = newWorld(0);
    const tower = world.build('Normal', 6, 5)!;
    const afterBuild = world.gold.balance;

    world.sell(tower);
    world.sell(tower);

    // Half the current Normal price (90 after one bought) and no upgrades.
    expect(world.gold.balance).toBe(afterBuild + 45);
    expect(world.towers).toHaveLength(0);
    expect(world.towerAt(6, 5)).toBeNull();
    expect(world.canBuildAt(6, 5)).toBe(true);
  });
});
