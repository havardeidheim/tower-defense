import { TowerAttack } from './TowerAttack';
import { Enemy } from '../enemies/Enemy';
import { Vector2 } from '../../core/Vector2';
import { resources } from '../../resources/ResourceLoader';

export class AreaAttack extends TowerAttack {
    private frame: number = 0;
    private frameTimer: number = 0;
    private readonly frameDelay: number = 80; // ms per frame
    private readonly totalFrames: number = 6;

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

        // Apply damage + slow immediately (matching original instant-damage behavior)
        const origin = new Vector2(x, y);
        for (const enemy of enemies) {
            if (enemy.isDead() || !enemy.active) continue;
            if (origin.distanceTo(enemy.center) <= range) {
                enemy.takeDamage(damage);
                enemy.applySlow(slowPercent, slowDuration);
            }
        }
    }

    update(deltaTime: number): void {
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
