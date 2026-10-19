import { seededRandom } from '../../src/core/Random';
import { SPELL_MANA_COST } from '../../src/game/constants';
import { World } from '../../src/world/World';
import { DirectGame } from './directPort';
import { loadLevels } from './files';

import { canTake, type Step } from './player';

export type { Step };

export interface Scenario {
  name: string;
  level: number;
  seed: number;
  steps: Step[];
  /** Cast lightning on the leading enemy whenever mana is at least this much. */
  lightningAtMana?: number;
  maxTicks: number;
}

/**
 * Why the ports first differed, when the difference is one made on purpose:
 * the original lets a projectile keep chasing an enemy that was killed earlier in
 * the same tick, or one that escaped (it is never marked dead, so the projectile
 * flies on and can still "kill" it for gold).
 */
export type DifferenceCause = 'chases-killed-enemy' | 'chases-escaped-enemy' | 'unexplained';

export interface ParityResult {
  /** Ticks that were identical. */
  ticks: number;
  /** The first difference, if there was one. */
  mismatch: string | null;
  cause: DifferenceCause | null;
  wavesCompleted: number;
  finalHealth: number;
}

function apply(world: World, direct: DirectGame, step: Step): void {
  if ('build' in step) {
    world.build(step.build, step.at[0], step.at[1]);
    direct.build(step.build, step.at[0], step.at[1]);
  } else if ('upgrade' in step) {
    world.upgrade(world.towerAt(step.upgrade[0], step.upgrade[1])!);
    direct.upgrade(step.upgrade[0], step.upgrade[1]);
  } else {
    world.placeFoundation(step.foundation[0], step.foundation[1]);
    direct.foundation(step.foundation[0], step.foundation[1]);
  }
}

function describeWorld(world: World): string {
  return JSON.stringify({
    gold: world.gold.balance,
    mana: world.mana.balance,
    health: world.health,
    wave: world.spawner.waveIndex,
    enemies: world.enemies.map((e) => [e.maxHealth, e.maxSpeed, e.x, e.y, e.health, e.poisonCounters, e.speed]),
    towers: world.towers.map((t) => [t.col, t.row, t.level]),
    projectiles: world.projectiles.map((p) => [p.x, p.y]),
  });
}

function describeDirect(direct: DirectGame): string {
  return JSON.stringify({
    gold: direct.gold,
    mana: direct.mana,
    health: direct.health,
    wave: direct.wave,
    enemies: direct.enemies.map((e) => [e.maxhealth, e.maxspeed, e.x, e.y, e.health, e.poisoncounters, e.speed]),
    towers: direct.towers.map((t) => [t.x / 40, t.y / 40, t.level]),
    projectiles: direct.projectiles.map((p) => [p.x, p.y]),
  });
}

function explain(direct: DirectGame): DifferenceCause {
  for (const p of direct.projectiles) {
    const target = p.target;
    if (!target) continue;
    if (target.isDead()) return 'chases-killed-enemy';
    if (!direct.enemies.includes(target)) return 'chases-escaped-enemy';
  }
  return 'unexplained';
}

/** Plays the same scripted game in both ports and compares the full state after every tick. */
export async function runParity(scenario: Scenario): Promise<ParityResult> {
  const realRandom = Math.random;
  // The direct port rolls dodges with Math.random; give both ports the same sequence.
  Math.random = seededRandom(scenario.seed);
  try {
    const direct = await DirectGame.create(scenario.level);
    const world = new World(loadLevels().createLevel(scenario.level), seededRandom(scenario.seed));

    let next = 0;
    let started = false;
    let ticks = 0;

    for (let tick = 0; tick < scenario.maxTicks; tick++) {
      while (next < scenario.steps.length && canTake(world, scenario.steps[next])) {
        apply(world, direct, scenario.steps[next++]);
      }
      if (!started) {
        world.start();
        direct.start();
        started = true;
      }
      if (scenario.lightningAtMana !== undefined && world.mana.balance >= Math.max(scenario.lightningAtMana, SPELL_MANA_COST)) {
        const leader = [...world.enemies].sort((a, b) => b.distance - a.distance)[0];
        if (leader && leader.progress > 200) {
          world.castLightning(leader.centerX, leader.centerY);
          direct.lightning(leader.centerX, leader.centerY);
        }
      }

      world.tick();
      direct.tick();

      const mine = describeWorld(world);
      const theirs = describeDirect(direct);
      if (mine !== theirs) {
        return {
          ticks,
          mismatch: `tick ${tick}\n polished: ${mine}\n direct:   ${theirs}`,
          cause: explain(direct),
          wavesCompleted: world.spawner.waveIndex,
          finalHealth: world.health,
        };
      }
      ticks = tick + 1;
      if (world.outcome !== 'playing') break;
    }

    return {
      ticks,
      mismatch: null,
      cause: null,
      wavesCompleted: world.spawner.waveIndex,
      finalHealth: world.health,
    };
  } finally {
    Math.random = realRandom;
  }
}
