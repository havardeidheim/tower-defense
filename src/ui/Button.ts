import { Rectangle } from '../core/Rectangle';
import { resources } from '../resources/ResourceLoader';

export abstract class Button {
    bounds: Rectangle;
    enabled: boolean = true;
    visible: boolean = true;
    hovered: boolean = false;

    constructor(x: number, y: number, width: number, height: number) {
        this.bounds = new Rectangle(x, y, width, height);
    }

    abstract render(ctx: CanvasRenderingContext2D): void;
    abstract onClick(): void;

    containsPoint(x: number, y: number): boolean {
        return this.bounds.contains(x, y);
    }

    setHovered(hovered: boolean): void {
        this.hovered = hovered;
    }

    isClickable(): boolean {
        return this.enabled && this.visible;
    }

    protected drawImage(ctx: CanvasRenderingContext2D, imageKey: string): void {
        const img = resources.imageCache.get(imageKey);
        if (img) {
            ctx.drawImage(img, this.bounds.x, this.bounds.y, this.bounds.width, this.bounds.height);
        }
    }

    protected drawText(ctx: CanvasRenderingContext2D, text: string, x: number, y: number, color: string = 'white'): void {
        ctx.fillStyle = color;
        ctx.font = 'bold 14px Times New Roman';
        ctx.fillText(text, x, y);
    }
}
