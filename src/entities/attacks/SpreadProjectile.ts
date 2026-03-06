import { Projectile } from './Projectile';
import { Enemy } from '../enemies/Enemy';

export class SpreadProjectile extends Projectile {
    canBounce: boolean;
    hasBounced: boolean = false;
    usedTarget: Enemy | null = null; // The enemy we already hit (for bounce exclusion)
    allEnemies: Enemy[] = [];
    bounceRange: number = 80;

    constructor(x: number, y: number, target: Enemy, damage: number, canBounce: boolean = false, allEnemies: Enemy[] = []) {
        super(x, y, target, damage);
        this.speed = 3; // Slower projectile
        this.canBounce = canBounce;
        this.allEnemies = allEnemies;
    }

    getImageKey(): string {
        return 'spreadprojectile';
    }

    // Override update to handle bouncing logic like the original Java implementation
    update(_deltaTime: number): void {
        if (!this.active) return;

        // Check if target is valid - if not, try to find a new one (for bouncing)
        if (!this.target || this.target.isDead() || !this.target.active) {
            if (this.hasBounced || !this.canBounce) {
                // Already bounced or can't bounce - die
                this.active = false;
                return;
            }
            // Try to find a new target to bounce to
            this.scan();
            if (!this.target) {
                this.active = false;
                return;
            }
        }

        // Update velocity to track target (heat-seeking)
        this.calculateVelocity();

        // Move projectile
        this.x += this.vx;
        this.y += this.vy;

        // Check collision with target
        if (this.hitTest()) {
            this.performHit();
        }
    }

    private performHit(): void {
        if (!this.target || this.target.isDead()) return;

        // Check if target can dodge
        if (this.target.canDodge && this.target.canDodge()) {
            // Dodged - if we can bounce, mark as bounced and scan for new target
            if (this.canBounce && !this.hasBounced) {
                this.hasBounced = true;
                this.usedTarget = this.target;
                this.target = null!;
                this.scan();
                if (!this.target) {
                    this.active = false;
                }
            } else {
                this.active = false;
            }
            return;
        }

        this.target.takeDamage(this.damage);

        // Check if we should bounce or die
        if (this.hasBounced || !this.canBounce) {
            // Already bounced once or can't bounce - die
            this.active = false;
        } else {
            // First hit - mark as bounced, save used target, and scan for new target
            this.hasBounced = true;
            this.usedTarget = this.target;
            this.target = null!;
            // Immediately scan for bounce target
            this.scan();
            if (!this.target) {
                // No valid bounce target found - die
                this.active = false;
            }
        }
    }

    // Scan for a new target within bounce range (matching original Java logic)
    private scan(): void {
        let bestEnemy: Enemy | null = null;
        let highestProgress = 0;

        for (const enemy of this.allEnemies) {
            if (enemy.isDead() || !enemy.active) continue;
            // Exclude the enemy we already hit
            if (this.usedTarget && enemy === this.usedTarget) continue;

            // Check if enemy is within bounce range
            const distance = this.distanceTo(enemy);

            if (distance <= this.bounceRange && enemy.pixelsTraveled > highestProgress) {
                highestProgress = enemy.pixelsTraveled;
                bestEnemy = enemy;
            }
        }

        if (bestEnemy) {
            this.target = bestEnemy;
            this.calculateVelocity();
        }
    }

    // onHit is required by abstract class but we handle hits in performHit
    onHit(): void {
        // Not used - we override update() to handle hits ourselves
    }
}
