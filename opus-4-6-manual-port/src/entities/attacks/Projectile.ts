import { TowerAttack } from './TowerAttack';
import { Enemy } from '../enemies/Enemy';
import { resources } from '../../resources/ResourceLoader';
import { PROJECTILE_BASE_SPEED } from '../../game/constants';

export abstract class Projectile extends TowerAttack {
    target: Enemy;
    damage: number;
    speed: number = PROJECTILE_BASE_SPEED;
    vx: number = 0;
    vy: number = 0;

    abstract getImageKey(): string;
    abstract onHit(): void;

    constructor(x: number, y: number, target: Enemy, damage: number) {
        super();
        this.x = x - 10; // Center the projectile
        this.y = y - 10;
        this.width = 20;
        this.height = 20;
        this.target = target;
        this.damage = damage;
        this.calculateVelocity();
    }

    protected calculateVelocity(): void {
        const direction = this.target.center.subtract(this.center);
        const distance = direction.magnitude();

        if (distance > 0) {
            this.vx = (direction.x / distance) * this.speed;
            this.vy = (direction.y / distance) * this.speed;
        }
    }

    update(_deltaTime: number): void {
        if (!this.active) return;

        // Check if target is dead or inactive
        if (!this.target || this.target.isDead() || !this.target.active) {
            this.active = false;
            return;
        }

        // Update velocity to track target (heat-seeking)
        this.calculateVelocity();

        // Move projectile
        this.x += this.vx;
        this.y += this.vy;

        // Check collision with target
        if (this.hitTest()) {
            this.onHit();
            this.active = false;
        }
    }

    protected hitTest(): boolean {
        // dont collide in edge, overlap slightly with enemy before hitting
        return this.distanceTo(this.target) < this.target.width / 3; 
    }

    render(ctx: CanvasRenderingContext2D): void {
        if (!this.active) return;

        const img = resources.imageCache.get(this.getImageKey());
        if (img) {
            // Rotate projectile to face direction of movement
            const angle = Math.atan2(this.vy, this.vx);

            ctx.save();
            ctx.translate(this.centerX, this.centerY);
            ctx.rotate(angle);
            ctx.drawImage(img, -this.width / 2, -this.height / 2, this.width, this.height);
            ctx.restore();
        }
    }
}
