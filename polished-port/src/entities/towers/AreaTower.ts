import type { World } from '../../world/World';
import { FrostRing } from '../attacks/FrostRing';
import type { Enemy } from '../enemies/Enemy';
import { Tower } from './Tower';
import { TOWER_KINDS } from './TowerTypes';

/**
 * Tower of Frostshock: a pulse that damages and slows every enemy in range.
 *
 * It keeps a target only to know when to fire. Finding a new target takes a
 * tick, and the tower fires on a later tick once it is reloaded.
 */
export class AreaTower extends Tower {
  private target: Enemy | null = null;

  constructor(col: number, row: number) {
    super(TOWER_KINDS.Area, col, row);
  }

  get slowPercent(): number {
    return this.stats.slowPercent ?? 0;
  }

  protected act(world: World): void {
    const target = this.target;
    if (!target || !target.alive || !this.inRange(target)) {
      this.target = this.furthestInRange(world.enemies);
    } else if (this.ready) {
      this.pulse(world);
    }
  }

  private pulse(world: World): void {
    world.addEffect(new FrostRing(this.centerX, this.centerY, this.range));
    const slowAmount = this.slowPercent / 100;
    for (const e of world.enemies) {
      if (e.alive && this.inRange(e)) e.frost(slowAmount, this.damage);
    }
    this.fired();
  }

  protected extraInfo(): string {
    return `Slow: ${this.slowPercent}%`;
  }
}
