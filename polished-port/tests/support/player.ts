import { seededRandom } from '../../src/core/Random';
import type { TowerType } from '../../src/entities/towers/TowerTypes';
import { SPELL_MANA_COST } from '../../src/game/constants';
import type { Outcome } from '../../src/world/World';
import { World } from '../../src/world/World';
import { loadLevels } from './files';

/** One step of a scripted player. Steps run in order, each as soon as it is affordable. */
export type Step =
  | { build: TowerType; at: [number, number] }
  | { upgrade: [number, number] }
  | { foundation: [number, number] };

export interface Script {
  level: number;
  steps: Step[];
  /**
   * Cast lightning on the enemy that has walked furthest once it has walked this
   * many pixels (the road is about 1500 px long on most levels), whenever there
   * is mana for it.
   */
  lightningAfter?: number;
  /** Only cast it on an enemy with at least this much health left. */
  lightningMinHealth?: number;
}

export interface PlayResult {
  outcome: Outcome;
  /** Health left, which is the star rating when the level is won. */
  health: number;
  wavesCleared: number;
  ticks: number;
  /** How many steps of the script were carried out. */
  stepsDone: number;
}

const levels = loadLevels();
const MAX_TICKS = 50 * 60 * 30;

/** Whether a step can be carried out now. */
export function canTake(world: World, step: Step): boolean {
  if ('build' in step) return world.gold.canAfford(step.build) && world.canBuildAt(...step.at);
  if ('upgrade' in step) {
    const tower = world.towerAt(...step.upgrade);
    return tower !== null && world.canUpgrade(tower);
  }
  return world.canCastSpell && world.level.isObstacle(...step.foundation);
}

export function take(world: World, step: Step): void {
  if ('build' in step) world.build(step.build, ...step.at);
  else if ('upgrade' in step) world.upgrade(world.towerAt(...step.upgrade)!);
  else world.placeFoundation(...step.foundation);
}

/** The enemy that has walked furthest, for lightning. */
export function leadingEnemy(world: World) {
  let best = null;
  for (const e of world.enemies) if (e.alive && (!best || e.distance > best.distance)) best = e;
  return best;
}

/**
 * Plays a script on the polished port without pausing or fast mode. Before the
 * first tick, every step that is affordable is taken, then the game starts.
 * The seed decides dodge rolls.
 */
export function play(script: Script, seed: number, onTick?: (world: World, tick: number) => void): PlayResult {
  const world = new World(levels.createLevel(script.level), seededRandom(seed));
  let next = 0;
  let tick = 0;
  for (; tick < MAX_TICKS; tick++) {
    while (next < script.steps.length && canTake(world, script.steps[next])) take(world, script.steps[next++]);
    if (tick === 0) world.start();
    if (script.lightningAfter !== undefined && world.mana.balance >= SPELL_MANA_COST) {
      const leader = leadingEnemy(world);
      if (leader && leader.progress >= script.lightningAfter && leader.health >= (script.lightningMinHealth ?? 0)) {
        world.castLightning(leader.centerX, leader.centerY);
      }
    }
    onTick?.(world, tick);
    world.tick();
    if (world.outcome !== 'playing') break;
  }
  return {
    outcome: world.outcome,
    health: world.health,
    wavesCleared: world.spawner.waveIndex,
    ticks: tick,
    stepsDone: next,
  };
}
