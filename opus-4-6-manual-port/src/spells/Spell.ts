import { GameObject } from '../core/GameObject';
import { resources } from '../resources/ResourceLoader';

export abstract class Spell extends GameObject {
    manaCost: number = 50;

    abstract getType(): string;
    abstract getImageKey(): string;
    abstract canCastAt(x: number, y: number, context: SpellContext): boolean;
    abstract cast(x: number, y: number, context: SpellContext): void;

    constructor() {
        super();
        this.width = 40;
        this.height = 40;
    }

    update(_deltaTime: number): void {
        // Most spells are instant, no update needed
    }

    render(_ctx: CanvasRenderingContext2D): void {
        // Override in subclass if needed
    }

    renderPreview(ctx: CanvasRenderingContext2D, x: number, y: number, valid: boolean): void {
        const img = resources.imageCache.get(this.getImageKey());
        if (img) {
            ctx.globalAlpha = 0.7;
            ctx.drawImage(img, x - 20, y - 20, 40, 40);
            ctx.globalAlpha = 1.0;

            if (!valid) {
                const crossImg = resources.imageCache.get('cross');
                if (crossImg) {
                    ctx.drawImage(crossImg, x - 20, y - 20, 40, 40);
                }
            }
        }
    }
}

export interface SpellContext {
    enemies: import('../entities/enemies/Enemy').Enemy[];
    level: import('../level/Level').Level;
    mana: number;
    onEnemyKilled: (enemy: import('../entities/enemies/Enemy').Enemy) => void;
    onManaUsed: (amount: number) => void;
    onTileChanged: (col: number, row: number) => void;
}
