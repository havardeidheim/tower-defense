import { Button } from './Button';
import { resources } from '../resources/ResourceLoader';
import { SPELL_COSTS } from '../game/constants';

export type SpellType = 'Lightning' | 'Runestone';

export class SpellButton extends Button {
    spellType: SpellType;
    imageKey: string;
    private onCast: (type: SpellType) => void;

    constructor(x: number, y: number, spellType: SpellType, onCast: (type: SpellType) => void) {
        super(x, y, 40, 40);
        this.spellType = spellType;
        this.imageKey = spellType === 'Lightning' ? 'lightningknapp' : 'blanctower';
        this.onCast = onCast;
    }

    onClick(): void {
        if (this.enabled) {
            resources.soundManager.play('knapp');
            this.onCast(this.spellType);
        }
    }

    render(ctx: CanvasRenderingContext2D): void {
        if (!this.visible) return;

        // Draw blank button background
        this.drawImage(ctx, 'blancknapp');

        // Draw spell icon
        const iconImg = resources.imageCache.get(this.imageKey);
        if (iconImg) {
            ctx.drawImage(iconImg, this.bounds.x + 4, this.bounds.y + 4, 32, 32);
        }

        // Draw cost below
        const cost = SPELL_COSTS[this.spellType];
        ctx.fillStyle = this.enabled ? '#4169E1' : '#888';
        ctx.font = 'bold 12px Times New Roman';
        ctx.textAlign = 'center';
        ctx.fillText(`${cost}`, this.bounds.centerX, this.bounds.bottom + 14);
        ctx.textAlign = 'left';

        // Dim if disabled
        if (!this.enabled) {
            ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
            ctx.fillRect(this.bounds.x, this.bounds.y, this.bounds.width, this.bounds.height);
        }

        // Highlight if hovered
        if (this.hovered && this.enabled) {
            ctx.strokeStyle = '#4169E1';
            ctx.lineWidth = 2;
            ctx.strokeRect(this.bounds.x, this.bounds.y, this.bounds.width, this.bounds.height);
        }
    }

    updateEnabled(mana: number): void {
        this.enabled = mana >= SPELL_COSTS[this.spellType];
    }
}
