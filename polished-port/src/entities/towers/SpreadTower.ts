import type { World } from '../../world/World';
import { SpreadProjectile } from '../attacks/SpreadProjectile';
import type { Enemy } from '../enemies/Enemy';
import { Tower } from './Tower';
import { TOWER_KINDS } from './TowerTypes';

/** Tower of Scatterflames: one fireball at each of the enemies that have walked furthest. */
export class SpreadTower extends Tower {
  constructor(col: number, row: number) {
    super(TOWER_KINDS.Spread, col, row);
  }

  get fireballs(): number {
    return this.stats.fireballs ?? 1;
  }

  protected act(world: World): void {
    const targets: Enemy[] = [];
    while (targets.length < this.fireballs) {
      const next = this.furthestInRange(world.enemies, targets);
      if (!next) break;
      targets.push(next);
    }

    if (this.ready && targets.length > 0) {
      const bounce = this.stats.bounce ?? false;
      for (const t of targets) world.addProjectile(new SpreadProjectile(this, t, this.damage, bounce));
      this.fired();
    }
  }

  protected extraInfo(): string {
    return `Fires ${this.fireballs} fireballs`;
  }
}
