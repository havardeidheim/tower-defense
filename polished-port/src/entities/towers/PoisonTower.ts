import { POISON_TICK_DAMAGE } from '../../game/constants';
import type { World } from '../../world/World';
import { PoisonProjectile } from '../attacks/PoisonProjectile';
import type { Enemy } from '../enemies/Enemy';
import { Tower } from './Tower';
import { TOWER_KINDS } from './TowerTypes';

/** Enemies with this many poison counters or more are never targeted. */
const POISON_TARGET_LIMIT = 100;

/** Tower of Poisoning: poison darts, aimed at the least poisoned enemy in range. */
export class PoisonTower extends Tower {
  constructor(col: number, row: number) {
    super(TOWER_KINDS.Poison, col, row);
  }

  protected act(world: World): void {
    const target = this.leastPoisonedInRange(world.enemies);
    if (this.ready && target) {
      world.addProjectile(new PoisonProjectile(this, target, this.damage));
      this.fired();
    }
  }

  /**
   * The enemy in range with the fewest poison counters. Ties follow the original's
   * rule, which is not "furthest wins": a later enemy with the same count wins if it
   * has walked further than the last tie winner, and that distance starts at 0 and
   * is not updated when a new lowest count is found.
   */
  private leastPoisonedInRange(enemies: readonly Enemy[]): Enemy | null {
    let best: Enemy | null = null;
    let leastPoison = POISON_TARGET_LIMIT;
    let highest = 0;
    for (const e of enemies) {
      if (!e.alive || !this.inRange(e)) continue;
      if (e.poisonCounters === leastPoison) {
        if (e.progress > highest) {
          best = e;
          highest = e.progress;
        }
      } else if (e.poisonCounters < leastPoison) {
        best = e;
        leastPoison = e.poisonCounters;
      }
    }
    return best;
  }

  protected damageText(): string {
    return `${this.damage} * ${POISON_TICK_DAMAGE}`;
  }
}
