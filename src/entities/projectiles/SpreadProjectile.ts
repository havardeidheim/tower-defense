import { Projectile } from './Projectile';
import { Enemy } from '../enemies/Enemy';
import { SHIELD_DAMAGE_REDUCTION, DODGE_CHANCE } from '../../game/constants';

export class SpreadProjectile extends Projectile {
    canBounce: boolean;
    hasBounced: boolean = false;
    hitEnemies: Set<Enemy> = new Set();
    allEnemies: Enemy[] = [];
    bounceRange: number = 80;

    constructor(x: number, y: number, target: Enemy, damage: number, canBounce: boolean = false) {
        super(x, y, target, damage);
        this.speed = 3; // Slower projectile
        this.canBounce = canBounce;
        this.hitEnemies.add(target); // Don't bounce back to original target
    }

    getImageKey(): string {
        return 'spreadprojectile';
    }

    onHit(): void {
        if (!this.target || this.target.isDead()) return;

        // Check if target can dodge
        if (this.target.canDodge && this.target.canDodge()) {
            // If can bounce and dodged, try to find new target
            if (this.canBounce && !this.hasBounced) {
                this.tryBounce();
            }
            return; // Dodged!
        }

        // Calculate damage (shield enemies reduce damage)
        let finalDamage = this.damage;
        if (this.target.hasShield && this.target.hasShield()) {
            finalDamage = Math.max(0, finalDamage - SHIELD_DAMAGE_REDUCTION);
        }

        // Apply damage - blocking is handled by enemy's takeDamage method
        this.target.takeDamage(finalDamage);
        this.hitEnemies.add(this.target);

        // Try to bounce to another target
        if (this.canBounce && !this.hasBounced) {
            this.tryBounce();
        }
    }

    private tryBounce(): void {
        // Find nearest enemy that hasn't been hit
        let nearestEnemy: Enemy | null = null;
        let nearestDistance = this.bounceRange;

        for (const enemy of this.allEnemies) {
            if (enemy.isDead() || !enemy.active) continue;
            if (this.hitEnemies.has(enemy)) continue;

            const dx = this.centerX - enemy.centerX;
            const dy = this.centerY - enemy.centerY;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < nearestDistance) {
                nearestDistance = distance;
                nearestEnemy = enemy;
            }
        }

        if (nearestEnemy) {
            this.target = nearestEnemy;
            this.hitEnemies.add(nearestEnemy);
            this.hasBounced = true;
            this.active = true; // Keep projectile active
            this.calculateVelocity();
        }
    }
}
