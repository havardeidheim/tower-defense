import { GameObject } from '../../core/GameObject';
import { resources } from '../../resources/ResourceLoader';

export class AreaShot extends GameObject {
    private frame: number = 0;
    private frameTimer: number = 0;
    private readonly frameDelay: number = 80; // ms per frame
    private readonly totalFrames: number = 6;

    constructor(x: number, y: number) {
        super();
        this.x = x - 40; // Center the effect (80x80 size)
        this.y = y - 40;
        this.width = 80;
        this.height = 80;
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

    isFinished(): boolean {
        return !this.active;
    }
}
