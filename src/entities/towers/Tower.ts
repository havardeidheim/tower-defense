import { GameObject } from '../../core/GameObject';
import { Enemy } from '../enemies/Enemy';
import { TowerAttack } from '../attacks/TowerAttack';
import { resources } from '../../resources/ResourceLoader';
import { TILE_SIZE } from '../../game/constants';

export abstract class Tower extends GameObject {
    damage: number = 20;
    range: number = 140;
    attackSpeed: number = 1.2; // seconds between attacks
    level: number = 0;
    maxLevel: number = 3;
    cooldownTimer: number = 0;
    totalCost: number = 0; // Track total investment for selling

    private static readonly DEFAULT_UPGRADE_COSTS = [40, 80, 120];

    abstract getBaseDamage(): number;
    abstract getBaseRange(): number;
    abstract getBaseSpeed(): number;
    abstract getCost(): number;
    abstract getType(): string;
    abstract getImageKey(): string;
    abstract getSoundKey(): string;
    abstract createAttacks(targets: Enemy[], allEnemies: Enemy[]): TowerAttack[];

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

    findTargets(enemies: Enemy[]): Enemy[] {
        return enemies
            .filter(e => !e.isDead() && e.active && this.isInRange(e))
            .sort((a, b) => b.pixelsTraveled - a.pixelsTraveled);
    }

    isInRange(enemy: Enemy): boolean {
        return this.distanceTo(enemy) <= this.range;
    }

    shoot(enemies: Enemy[]): TowerAttack[] {
        if (this.cooldownTimer > 0) return [];

        const targets = this.findTargets(enemies);
        if (targets.length === 0) return [];

        this.cooldownTimer = this.attackSpeed * 1000; // Convert to ms
        resources.soundManager.play(this.getSoundKey());

        return this.createAttacks(targets, enemies);
    }

    upgrade(): boolean {
        if (this.level >= this.maxLevel) return false;

        this.level++;
        this.applyUpgrade();
        return true;
    }

    protected abstract applyUpgrade(): void;

    getUpgradeCost(): number {
        return this.level < this.maxLevel ? Tower.DEFAULT_UPGRADE_COSTS[this.level] : 0;
    }

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
