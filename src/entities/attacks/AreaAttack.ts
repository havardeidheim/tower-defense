import { TowerAttack } from './TowerAttack';
import { Enemy } from '../enemies/Enemy';
import { Vector2 } from '../../core/Vector2';
import { resources } from '../../resources/ResourceLoader';

export class AreaAttack extends TowerAttack {
    private frame: number = 0;
    private frameTimer: number = 0;
    private readonly frameDelay: number = 80; // ms per frame
    private readonly totalFrames: number = 6;
    private hasHit: boolean = false;

    private readonly enemies: Enemy[];
    private readonly damage: number;
    private readonly range: number;
    private readonly slowPercent: number;
    private readonly slowDuration: number;
    private readonly origin: Vector2;

    constructor(
        x: number,
        y: number,
        enemies: Enemy[],
        damage: number,
        range: number,
        slowPercent: number,
        slowDuration: number
    ) {
        super();
        // Center the effect (80x80 visual size)
        this.x = x - 40;
        this.y = y - 40;
        this.width = 80;
        this.height = 80;

        this.origin = new Vector2(x, y);
        this.enemies = enemies;
        this.damage = damage;
        this.range = range;
        this.slowPercent = slowPercent;
        this.slowDuration = slowDuration;
    }

    private onHit(): void {
        for (const enemy of this.enemies) {
            if (enemy.isDead() || !enemy.active) continue;
            if (this.origin.distanceTo(enemy.center) <= this.range) {
                enemy.takeDamage(this.damage);
                enemy.applySlow(this.slowPercent, this.slowDuration);
            }
        }
    }

    update(deltaTime: number): void {
        if (!this.hasHit) {
            this.hasHit = true;
            this.onHit();
        }

        this.frameTimer += deltaTime;
        if (this.frameTimer >= this.frameDelay) {
            this.frameTimer = 0;
            this.frame++;
            if (this.frame >= this.totalFrames) {
                this.active = false;
            }
        }
    }

    render(ctx: CanvasRenderingContext2D): void {
        if (!this.active) return;
        const img = resources.imageCache.get(`areashot${this.frame}`);
        if (img) {
            ctx.drawImage(img, this.x, this.y, this.width, this.height);
        }
    }
}
