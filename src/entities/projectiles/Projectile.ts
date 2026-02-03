import { GameObject } from '../../core/GameObject';
import { Enemy } from '../enemies/Enemy';
import { resources } from '../../resources/ResourceLoader';

export abstract class Projectile extends GameObject {
    target: Enemy;
    damage: number;
    speed: number = 6;
    vx: number = 0;
    vy: number = 0;
    hitRadius: number = 10;

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
        const dx = this.target.centerX - this.centerX;
        const dy = this.target.centerY - this.centerY;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance > 0) {
            this.vx = (dx / distance) * this.speed;
            this.vy = (dy / distance) * this.speed;
        }
    }

    update(_deltaTime: number): void {
        if (!this.active) return;

        // Update velocity to track target (heat-seeking)
        this.calculateVelocity();

        // Move projectile
        this.x += this.vx;
        this.y += this.vy;

        // Check if target is dead or inactive
        if (!this.target || this.target.isDead() || !this.target.active) {
            this.active = false;
            return;
        }

        // Check collision with target
        if (this.hitTest()) {
            this.onHit();
            this.active = false;
        }
    }

    protected hitTest(): boolean {
        const dx = this.centerX - this.target.centerX;
        const dy = this.centerY - this.target.centerY;
        const distance = Math.sqrt(dx * dx + dy * dy);
        return distance < this.hitRadius + this.target.width / 2;
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
