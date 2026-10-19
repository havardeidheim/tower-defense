import type { Enemy } from '../enemies/Enemy';
import type { Tower } from '../towers/Tower';
import { Projectile } from './Projectile';

/** A poison dart. Deals no damage itself; its damage is the number of poison counters it adds. */
export class PoisonProjectile extends Projectile {
  constructor(tower: Tower, target: Enemy, counters: number) {
    super(tower, target, counters, 6, 'poisonprojectile');
  }

  protected onHit(target: Enemy): void {
    target.poison(this.damage);
    this.done = true;
  }
}
