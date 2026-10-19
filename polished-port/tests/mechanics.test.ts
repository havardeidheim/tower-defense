import { describe, expect, it } from 'vitest';
import { seededRandom } from '../src/core/Random';
import { Enemy } from '../src/entities/enemies/Enemy';
import { enemyTypeFor } from '../src/entities/enemies/EnemyTypes';
import { SLOW_DURATION_TICKS } from '../src/game/constants';
import { WaveSpawner } from '../src/level/WaveSpawner';
import { fixedRandom, newWorld, placeEnemy } from './support/worlds';

describe('wave scripts', () => {
  it('reads one slot per pulse, with digit prefixes and pauses', () => {
    const spawner = new WaveSpawner(['2n f|', 'n']);
    spawner.start();
    const slots = Array.from({ length: 4 }, () => spawner.pulse(false));
    expect(slots).toEqual([
      { char: 'n', healthLevel: 2 },
      { char: ' ', healthLevel: 0 },
      { char: 'f', healthLevel: 0 },
      { char: '|', healthLevel: 0 },
    ]);
  });

  it('starts the next wave only on a pulse that finds the field clear', () => {
    const spawner = new WaveSpawner(['n', 'f']);
    spawner.start();
    spawner.pulse(true);
    expect(spawner.pulse(false)).toBeNull();
    expect(spawner.waveIndex).toBe(0);
    expect(spawner.pulse(true)).toBeNull();
    expect(spawner.waveIndex).toBe(1);
    expect(spawner.pulse(true)).toEqual({ char: 'f', healthLevel: 0 });
    spawner.pulse(true);
    expect(spawner.finished).toBe(true);
  });

  it('gives every slot, pauses included, the next spawn point in turn', () => {
    // Paths Untrodden has spawn points at (0,2), (0,8) and (15,10); its first wave is "nn|".
    const world = newWorld(2);
    world.start();
    const spawns: [number, number][] = [];
    for (let tick = 0; tick < 50 * 3; tick++) {
      const before = world.enemies.length;
      world.tick();
      if (world.enemies.length > before) {
        const e = world.enemies[world.enemies.length - 1];
        spawns.push([Math.trunc(e.x / 40), Math.trunc(e.y / 40)]);
      }
    }
    expect(spawns).toEqual([
      [0, 2],
      [0, 8],
    ]);
    // The '|' took (15,10), so the next wave's first enemy starts at (0,2) again.
    expect(world.level.takeSpawnPoint()).toEqual({ col: 0, row: 2 });
  });
});

describe('enemy defenses', () => {
  const level = newWorld(0).level;
  const make = (char: string, random = seededRandom(1)) =>
    new Enemy(enemyTypeFor(char)!, 0, { col: 6, row: 4 }, level, random);

  it('a shield takes 10 off every hit and every poison tick', () => {
    const soldier = make('s');
    soldier.hit(20);
    expect(soldier.health).toBe(120);
    soldier.hit(8);
    expect(soldier.health).toBe(120);
    soldier.poison(1);
    soldier.poisonTick();
    expect(soldier.health).toBe(112);
  });

  it('a vanguard blocks its first three attacks of any kind, and frost never slows it', () => {
    const vanguard = make('<');
    vanguard.hit(50);
    vanguard.poison(5);
    vanguard.frost(0.5, 20);
    expect(vanguard.health).toBe(120);
    expect(vanguard.poisonCounters).toBe(0);
    vanguard.frost(0.5, 20);
    expect(vanguard.health).toBe(100);
    expect(vanguard.speed).toBe(vanguard.maxSpeed);
  });

  it('an assassin dodges when the roll is 0.5 or less', () => {
    const lucky = make('d', fixedRandom(0.5));
    lucky.hit(20);
    expect(lucky.health).toBe(70);
    const unlucky = make('d', fixedRandom(0.51));
    unlucky.hit(20);
    expect(unlucky.health).toBe(50);
  });

  it('lightning ignores dodging, shields and slow immunity', () => {
    const paragon = make('*', fixedRandom(0));
    paragon.lightning();
    expect(paragon.state).toBe('killed');
    expect(paragon.health).toBe(0);

    const vanguard = make('<');
    vanguard.lightning();
    expect(vanguard.speed).toBe(0);
  });
});

describe('timers in ticks', () => {
  it('a slow wears off on the 80th tick after it was applied', () => {
    const world = newWorld(0);
    const enemy = placeEnemy(world, 'n', 6, 4);
    world.start();
    enemy.frost(0.5, 0);
    for (let i = 1; i < SLOW_DURATION_TICKS; i++) {
      world.tick();
      expect(enemy.speed).toBeCloseTo(0.6);
    }
    world.tick();
    expect(enemy.speed).toBe(1.2);
  });

  it('a stone tower fires exactly every 60 ticks while it has a target', () => {
    const world = newWorld(0);
    world.build('Normal', 6, 5);
    const enemy = placeEnemy(world, 'n', 6, 4);
    enemy.health = 1_000_000;
    enemy.speed = 0; // stays in range
    world.start();
    const shots: number[] = [];
    const seen = new Set<unknown>();
    for (let tick = 0; tick < 130; tick++) {
      world.tick();
      for (const p of world.projectiles) {
        if (!seen.has(p)) shots.push(tick);
        seen.add(p);
      }
    }
    expect(shots).toEqual([0, 60, 120]);
  });
});

describe('towers', () => {
  it('shows its stats like the original', () => {
    const world = newWorld(0);
    world.gold.balance = 10_000;
    const frost = world.build('Area', 6, 5)!;
    expect(frost.infoLines().slice(4)).toEqual(['Level: 1', 'Damage: 20', 'Range: 80', 'Speed: 2.0', 'Slow: 30%']);
    const poison = world.build('Poison', 7, 5)!;
    world.upgrade(poison);
    world.upgrade(poison);
    world.upgrade(poison);
    expect(poison.infoLines().slice(4)).toEqual(['Level: 4', 'Damage: 6 * 18', 'Range: 120', 'Speed: 1.2']);
    expect(world.canUpgrade(poison)).toBe(false);
  });

  it('every tower bought makes the next of its type 10 gold dearer', () => {
    const world = newWorld(0);
    world.gold.balance = 10_000;
    world.build('Normal', 6, 5);
    world.build('Normal', 7, 5);
    expect(world.gold.priceOf('Normal')).toBe(100);
    expect(world.gold.priceOf('Poison')).toBe(70);
  });
});
