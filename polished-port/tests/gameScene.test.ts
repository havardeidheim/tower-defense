/**
 * The game scene with real clicks: pausing, selling while paused, reset and fast mode.
 * Runs headless; images and sounds are not loaded, so drawing and audio do nothing.
 */
import { beforeAll, describe, expect, it } from 'vitest';
import type { Game } from '../src/game/Game';
import { resources } from '../src/resources/ResourceLoader';
import { GameScene } from '../src/scenes/GameScene';
import type { Scene } from '../src/scenes/Scene';
import type { World } from '../src/world/World';
import { loadLevels } from './support/files';

beforeAll(() => {
  loadLevels(resources.levels);
});

// Screen positions from the original layout.
const START = [290, 20] as const;
const PAUSE = [410, 20] as const;
const FASTER = [530, 20] as const;
const BUILD_NORMAL = [660, 45] as const;
const SELL = [810, 210] as const;
const UPGRADE = [810, 165] as const;

function tileCenter(col: number, row: number): [number, number] {
  return [col * 40 + 20, row * 40 + 20];
}

/** Butchers Ballroom: no help window opens, so clicks go straight to the map. */
function newScene(levelIndex = 1): { scene: GameScene; world: () => World; click: (p: readonly [number, number]) => void } {
  const scene = new GameScene(levelIndex);
  const fakeGame = { setScene: (_s: Scene) => {}, mouse: null } as unknown as Game;
  scene.game = fakeGame;
  scene.enter();
  const world = () => (scene as unknown as { world: World }).world;
  const click = (p: readonly [number, number]) => scene.onPointerDown(p[0], p[1], 0);
  return { scene, world, click };
}

describe('game scene', () => {
  it('nothing moves while paused', () => {
    const { scene, world, click } = newScene();
    click(START);
    for (let i = 0; i < 60; i++) scene.tick();
    expect(world().enemies).toHaveLength(1);
    const enemy = world().enemies[0];
    const x = enemy.x;

    click(PAUSE);
    for (let i = 0; i < 500; i++) scene.tick();
    expect(enemy.x).toBe(x);
    expect(world().enemies).toHaveLength(1);

    click(PAUSE); // Resume
    scene.tick();
    expect(enemy.x).not.toBe(x);
  });

  it('selling while paused removes the tower at once and pays once', () => {
    const { scene, world, click } = newScene();
    click(BUILD_NORMAL);
    click(tileCenter(7, 7));
    expect(world().towers).toHaveLength(1);
    click(START);
    scene.tick();
    click(PAUSE);

    const gold = world().gold.balance;
    click(tileCenter(7, 7)); // select
    click(SELL);
    click(SELL); // nothing is selected any more
    click(tileCenter(7, 7)); // nothing to select
    click(SELL);

    expect(world().towers).toHaveLength(0);
    expect(world().gold.balance).toBe(gold + 45);
  });

  it('reset forgets the selected tower, so it cannot be sold for gold afterwards', () => {
    const { world, click } = newScene();
    click(BUILD_NORMAL);
    click(tileCenter(7, 7));
    click(START);
    click(tileCenter(7, 7)); // select
    click(START); // Reset
    const gold = world().gold.balance;

    click(SELL);
    click(UPGRADE);

    expect(world().towers).toHaveLength(0);
    expect(world().gold.balance).toBe(gold);
  });

  it('fast mode runs two ticks per tick', () => {
    const normal = newScene();
    const fast = newScene();
    normal.click(START);
    fast.click(START);
    fast.click(FASTER);
    for (let i = 0; i < 100; i++) {
      normal.scene.tick();
      fast.scene.tick();
      normal.scene.tick();
    }
    expect(fast.world().enemies.map((e) => e.x)).toEqual(normal.world().enemies.map((e) => e.x));
    expect(fast.world().mana.balance).toBe(normal.world().mana.balance);
  });
});
