import type { World } from '../../world/World';
import { NormalProjectile } from '../attacks/NormalProjectile';
import { Tower } from './Tower';
import { TOWER_KINDS } from './TowerTypes';

/** Tower of Stonehurling: one stone at the enemy that has walked furthest. */
export class NormalTower extends Tower {
  constructor(col: number, row: number) {
    super(TOWER_KINDS.Normal, col, row);
  }

  protected act(world: World): void {
    const target = this.furthestInRange(world.enemies);
    if (this.ready && target) {
      world.addProjectile(new NormalProjectile(this, target, this.damage));
      this.fired();
    }
  }
}
