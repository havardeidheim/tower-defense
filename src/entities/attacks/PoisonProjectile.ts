import { Projectile } from './Projectile';
import { Enemy } from '../enemies/Enemy';

export class PoisonProjectile extends Projectile {
    // In original Java, damage = number of poison ticks to apply
    // No immediate damage is dealt - only poison is applied

    constructor(x: number, y: number, target: Enemy, poisonTicks: number) {
        super(x, y, target, poisonTicks); // damage field stores poison ticks
        this.speed = 6;
    }

    getImageKey(): string {
        return 'poisonprojectile';
    }

    onHit(): void {
        if (!this.target || this.target.isDead()) return;

        // Apply poison effect only (no immediate damage)
        // The enemy's applyPoison handles dodge chance for DodgeEnemy/SuperEnemy
        // Each tick will deal POISON_DAMAGE_PER_TICK (18) damage
        this.target.applyPoison(this.damage); // damage = number of ticks
    }
}
