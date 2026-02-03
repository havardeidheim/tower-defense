import { Projectile } from './Projectile';
import { Enemy } from '../enemies/Enemy';
import { SHIELD_DAMAGE_REDUCTION, DODGE_CHANCE } from '../../game/constants';

export class PoisonProjectile extends Projectile {
    poisonTicks: number;

    constructor(x: number, y: number, target: Enemy, damage: number, poisonTicks: number) {
        super(x, y, target, damage);
        this.speed = 6;
        this.poisonTicks = poisonTicks;
    }

    getImageKey(): string {
        return 'poisonprojectile';
    }

    onHit(): void {
        if (!this.target || this.target.isDead()) return;

        // Check if target can dodge
        if (this.target.canDodge && this.target.canDodge()) {
            return; // Dodged!
        }

        // Apply initial damage (reduced by shield)
        let finalDamage = this.damage;
        if (this.target.hasShield && this.target.hasShield()) {
            finalDamage = Math.max(0, finalDamage - SHIELD_DAMAGE_REDUCTION);
        }

        // Apply damage - blocking is handled by enemy's takeDamage method
        this.target.takeDamage(finalDamage);

        // Apply poison effect - blocking is handled by enemy's applyPoison method
        this.target.applyPoison(this.poisonTicks);
    }
}
