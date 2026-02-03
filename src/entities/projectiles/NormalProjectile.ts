import { Projectile } from './Projectile';
import { Enemy } from '../enemies/Enemy';
import { SHIELD_DAMAGE_REDUCTION, DODGE_CHANCE } from '../../game/constants';

export class NormalProjectile extends Projectile {
    constructor(x: number, y: number, target: Enemy, damage: number) {
        super(x, y, target, damage);
        this.speed = 6;
    }

    getImageKey(): string {
        return 'normalprojectile';
    }

    onHit(): void {
        if (!this.target || this.target.isDead()) return;

        // Check if target can dodge (DodgeEnemy, SuperEnemy)
        if (this.target.canDodge && this.target.canDodge()) {
            return; // Dodged!
        }

        // Calculate damage (shield enemies reduce damage)
        let finalDamage = this.damage;
        if (this.target.hasShield && this.target.hasShield()) {
            finalDamage = Math.max(0, finalDamage - SHIELD_DAMAGE_REDUCTION);
        }

        // Apply damage - blocking is handled by enemy's takeDamage method
        this.target.takeDamage(finalDamage);
    }
}
