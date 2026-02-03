import { GameObject } from '../../core/GameObject';
import { Enemy } from '../enemies/Enemy';
import { Projectile } from '../projectiles/Projectile';
import { resources } from '../../resources/ResourceLoader';
import { TILE_SIZE } from '../../game/constants';

export abstract class Tower extends GameObject {
    target: Enemy | null = null;
    damage: number = 20;
    range: number = 140;
    attackSpeed: number = 1.2; // seconds between attacks
    level: number = 0;
    maxLevel: number = 3;
    cooldownTimer: number = 0;
    totalCost: number = 0; // Track total investment for selling

    abstract getBaseDamage(): number;
    abstract getBaseRange(): number;
    abstract getBaseSpeed(): number;
    abstract getCost(): number;
    abstract getUpgradeCost(): number;
    abstract getType(): string;
    abstract getImageKey(): string;
    abstract getSoundKey(): string;
    abstract createProjectile(target: Enemy): Projectile;

    constructor(x: number, y: number) {
        super();
        this.x = x;
        this.y = y;
        this.width = TILE_SIZE;
        this.height = TILE_SIZE;
        this.initStats();
    }

    protected initStats(): void {
        this.damage = this.getBaseDamage();
        this.range = this.getBaseRange();
        this.attackSpeed = this.getBaseSpeed();
    }

    update(deltaTime: number): void {
        // Update cooldown
        if (this.cooldownTimer > 0) {
            this.cooldownTimer -= deltaTime;
        }
    }

    // Find target among enemies
    scan(enemies: Enemy[]): void {
        // Find enemy with most pixels traveled that's in range
        let bestTarget: Enemy | null = null;
        let bestDistance = -1;

        for (const enemy of enemies) {
            if (enemy.isDead() || !enemy.active) continue;
            if (this.isInRange(enemy)) {
                if (enemy.pixelsTraveled > bestDistance) {
                    bestDistance = enemy.pixelsTraveled;
                    bestTarget = enemy;
                }
            }
        }

        this.target = bestTarget;
    }

    isInRange(enemy: Enemy): boolean {
        const dx = this.centerX - enemy.centerX;
        const dy = this.centerY - enemy.centerY;
        const distance = Math.sqrt(dx * dx + dy * dy);
        return distance <= this.range;
    }

    canFire(): boolean {
        return this.cooldownTimer <= 0 && this.target !== null && this.target.active && !this.target.isDead();
    }

    fire(): Projectile | null {
        if (!this.canFire() || !this.target) return null;

        this.cooldownTimer = this.attackSpeed * 1000; // Convert to ms

        // Play sound
        resources.soundManager.play(this.getSoundKey());

        return this.createProjectile(this.target);
    }

    upgrade(): boolean {
        if (this.level >= this.maxLevel) return false;

        this.level++;
        this.applyUpgrade();
        return true;
    }

    protected abstract applyUpgrade(): void;

    getSellValue(): number {
        // 50% of cost + 10 per level
        return Math.floor(this.totalCost * 0.5) + this.level * 10;
    }

    render(ctx: CanvasRenderingContext2D): void {
        const img = resources.imageCache.get(this.getImageKey());
        if (img) {
            ctx.drawImage(img, this.x, this.y, this.width, this.height);
        }
    }

    renderRange(ctx: CanvasRenderingContext2D): void {
        // Find closest matching range image
        const ranges = [80, 100, 120, 140, 150, 160, 170];
        let closest = ranges[0];
        let minDiff = Math.abs(this.range - closest);

        for (const r of ranges) {
            const diff = Math.abs(this.range - r);
            if (diff < minDiff) {
                minDiff = diff;
                closest = r;
            }
        }

        const rangeImg = resources.imageCache.get(`range${closest}`);
        if (rangeImg) {
            const size = closest * 2;
            ctx.drawImage(
                rangeImg,
                this.centerX - closest,
                this.centerY - closest,
                size,
                size
            );
        }
    }

    renderSelection(ctx: CanvasRenderingContext2D): void {
        const selectImg = resources.imageCache.get('select');
        if (selectImg) {
            ctx.drawImage(selectImg, this.x, this.y, this.width, this.height);
        }
        this.renderRange(ctx);
    }
}
