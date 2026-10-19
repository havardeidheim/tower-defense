import { PROJECTILE_SIZE } from '../../game/constants';
import type { World } from '../../world/World';
import type { Enemy } from '../enemies/Enemy';
import type { Tower } from '../towers/Tower';
import { Projectile } from './Projectile';

/** How far a fireball looks for a new target. */
const SEEK_RANGE = 80;

/**
 * A slow fireball. If its target dies or escapes, it flies on to the enemy within
 * 80 px that has walked furthest, and it never gives its tower an early reload. A
 * bouncing fireball strikes a second enemy after its first hit.
 */
export class SpreadProjectile extends Projectile {
  private bouncesLeft: number;
  private lastHit: Enemy | null = null;

  constructor(tower: Tower, target: Enemy, damage: number, bounce: boolean) {
    super(tower, target, damage, 3, 'spreadprojectile');
    this.bouncesLeft = bounce ? 1 : 0;
  }

  protected targetLost(world: World): void {
    this.target = this.findTarget(world.enemies);
    if (this.target) {
      this.flyTowards(this.target);
    } else {
      this.done = true;
    }
  }

  protected onHit(target: Enemy): void {
    target.hit(this.damage);
    if (this.bouncesLeft > 0) {
      this.bouncesLeft--;
      this.lastHit = target;
      this.target = null; // picks the next target on the next tick
    } else {
      this.done = true;
    }
  }

  private findTarget(enemies: readonly Enemy[]): Enemy | null {
    let best: Enemy | null = null;
    let highest = 0;
    for (const e of enemies) {
      if (e.alive && e !== this.lastHit && this.withinSeekRange(e) && e.progress > highest) {
        best = e;
        highest = e.progress;
      }
    }
    return best;
  }

  private withinSeekRange(e: Enemy): boolean {
    const dx = e.centerX - (this.x + PROJECTILE_SIZE / 2);
    const dy = e.centerY - (this.y + PROJECTILE_SIZE / 2);
    return Math.trunc(Math.sqrt(dx * dx + dy * dy)) <= SEEK_RANGE;
  }
}
