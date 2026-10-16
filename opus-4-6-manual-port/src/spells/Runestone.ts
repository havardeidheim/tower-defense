import { Spell, SpellContext } from './Spell';
import { resources } from '../resources/ResourceLoader';
import { SPELL_RUNESTONE, TILE_SIZE, TILE_OBSTACLE } from '../game/constants';

export class Runestone extends Spell {
    constructor() {
        super();
        this.manaCost = 50;
    }

    getType(): string {
        return SPELL_RUNESTONE;
    }

    getImageKey(): string {
        return 'blanctower';
    }

    canCastAt(x: number, y: number, context: SpellContext): boolean {
        if (context.mana < this.manaCost) return false;

        // Check if position is on an obstacle tile
        const col = Math.floor(x / TILE_SIZE);
        const row = Math.floor(y / TILE_SIZE);
        const tile = context.level.getTile(col, row);

        return tile !== null && tile.type === TILE_OBSTACLE;
    }

    cast(x: number, y: number, context: SpellContext): void {
        const col = Math.floor(x / TILE_SIZE);
        const row = Math.floor(y / TILE_SIZE);

        // Play sound
        resources.soundManager.play('build');

        // Deduct mana
        context.onManaUsed(this.manaCost);

        // Convert tile
        if (context.level.convertToBuildable(col, row)) {
            context.onTileChanged(col, row);
        }
    }

    renderPreview(ctx: CanvasRenderingContext2D, x: number, y: number, valid: boolean): void {
        // Snap to grid
        const col = Math.floor(x / TILE_SIZE);
        const row = Math.floor(y / TILE_SIZE);
        const snapX = col * TILE_SIZE;
        const snapY = row * TILE_SIZE;

        if (valid) {
            const img = resources.imageCache.get('blanctower');
            if (img) {
                ctx.globalAlpha = 0.7;
                ctx.drawImage(img, snapX, snapY, TILE_SIZE, TILE_SIZE);
                ctx.globalAlpha = 1.0;
            }
        } else {
            const crossImg = resources.imageCache.get('cross');
            if (crossImg) {
                ctx.drawImage(crossImg, snapX, snapY, TILE_SIZE, TILE_SIZE);
            }
        }
    }
}
