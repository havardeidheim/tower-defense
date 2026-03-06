import { Projectile } from './Projectile';
import { Enemy } from '../enemies/Enemy';

export class SpreadProjectile extends Projectile {
    private canBounce: boolean;
    private hasBounced: boolean = false;
    private usedTarget: Enemy | null = null;
    private allEnemies: Enemy[];
    private bounceRange: number = 80;

    constructor(x: number, y: number, target: Enemy, damage: number, canBounce: boolean = false, allEnemies: Enemy[] = []) {
        super(x, y, target, damage);
        this.speed = 3;
        this.canBounce = canBounce;
        this.allEnemies = allEnemies;
    }

    getImageKey(): string {
        return 'spreadprojectile';
    }

    // Override update: only difference from base is trying to bounce when target is lost
    update(_deltaTime: number): void {
        if (!this.active) return;

        if (!this.target || this.target.isDead() || !this.target.active) {
            if (!this.findBounceTarget()) {
                this.active = false;
            }
            return;
        }

        this.calculateVelocity();
        this.x += this.vx;
        this.y += this.vy;

        if (this.hitTest()) {
            this.onHit();
        }
    }

    onHit(): void {
        if (this.target.canDodge && this.target.canDodge()) {
            if (!this.tryBounce()) this.active = false;
            return;
        }

        this.target.takeDamage(this.damage);

        if (!this.tryBounce()) this.active = false;
    }

    private tryBounce(): boolean {
        if (this.hasBounced || !this.canBounce) return false;
        this.hasBounced = true;
        this.usedTarget = this.target;
        return this.findBounceTarget();
    }

    private findBounceTarget(): boolean {
        let bestEnemy: Enemy | null = null;
        let highestProgress = 0;

        for (const enemy of this.allEnemies) {
            if (enemy.isDead() || !enemy.active) continue;
            if (enemy === this.usedTarget) continue;

            const distance = this.distanceTo(enemy);
            if (distance <= this.bounceRange && enemy.pixelsTraveled > highestProgress) {
                highestProgress = enemy.pixelsTraveled;
                bestEnemy = enemy;
            }
        }

        if (bestEnemy) {
            this.target = bestEnemy;
            this.calculateVelocity();
            return true;
        }
        return false;
    }
}
