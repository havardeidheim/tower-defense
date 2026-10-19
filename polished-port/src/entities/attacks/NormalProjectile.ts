import type { Enemy } from '../enemies/Enemy';
import type { Tower } from '../towers/Tower';
import { Projectile } from './Projectile';

/** A stone. */
export class NormalProjectile extends Projectile {
  constructor(tower: Tower, target: Enemy, damage: number) {
    super(tower, target, damage, 6, 'normalprojectile');
  }

  protected onHit(target: Enemy): void {
    target.hit(this.damage);
    this.done = true;
  }
}
