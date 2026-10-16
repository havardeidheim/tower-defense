import { Rectangle } from '../core/Rectangle';
import { resources } from '../resources/ResourceLoader';
import { FONT_LABEL_SM, COLOR_TEXT_WHITE, COLOR_GOLD, COLOR_DISABLED_OVERLAY } from '../game/theme';

export abstract class Button {
    bounds: Rectangle;
    hoverBounds: Rectangle;
    enabled: boolean = true;
    visible: boolean = true;
    hovered: boolean = false;

    constructor(x: number, y: number, width: number, height: number) {
        this.bounds = new Rectangle(x, y, width, height);
        this.hoverBounds = this.bounds;
    }

    abstract render(ctx: CanvasRenderingContext2D): void;
    abstract onClick(): void;

    containsPoint(x: number, y: number): boolean {
        return this.hoverBounds.contains(x, y);
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

    protected drawText(ctx: CanvasRenderingContext2D, text: string, x: number, y: number, color: string = COLOR_TEXT_WHITE): void {
        ctx.fillStyle = color;
        ctx.font = FONT_LABEL_SM;
        ctx.fillText(text, x, y);
    }

    protected drawCostLabel(ctx: CanvasRenderingContext2D, text: string, color: string): void {
        ctx.fillStyle = color;
        ctx.font = FONT_LABEL_SM;
        ctx.textAlign = 'center';
        ctx.fillText(text, this.bounds.centerX, this.bounds.bottom + 14);
        ctx.textAlign = 'left';
    }

    protected drawDisabledOverlay(ctx: CanvasRenderingContext2D): void {
        if (!this.enabled) {
            ctx.fillStyle = COLOR_DISABLED_OVERLAY;
            ctx.fillRect(this.bounds.x, this.bounds.y, this.bounds.width, this.bounds.height);
        }
    }

    protected drawHoverHighlight(ctx: CanvasRenderingContext2D): void {
        if (this.hovered && this.enabled) {
            ctx.strokeStyle = COLOR_GOLD;
            ctx.lineWidth = 2;
            ctx.strokeRect(this.bounds.x, this.bounds.y, this.bounds.width, this.bounds.height);
        }
    }
}
