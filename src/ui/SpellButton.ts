import { Button } from './Button';
import { resources } from '../resources/ResourceLoader';
import { SPELL_COSTS } from '../game/constants';
import { COLOR_GOLD, COLOR_TEXT_DISABLED, COLOR_DISABLED_OVERLAY, FONT_LABEL_SM } from '../game/theme';

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

        // Draw spell icon
        this.drawImage(ctx, this.imageKey);

        // Draw cost below
        const cost = SPELL_COSTS[this.spellType];
        ctx.fillStyle = this.enabled ? COLOR_GOLD : COLOR_TEXT_DISABLED;
        ctx.font = FONT_LABEL_SM;
        ctx.textAlign = 'center';
        ctx.fillText(`${cost}`, this.bounds.centerX, this.bounds.bottom + 14);
        ctx.textAlign = 'left';

        // Dim if disabled
        if (!this.enabled) {
            ctx.fillStyle = COLOR_DISABLED_OVERLAY;
            ctx.fillRect(this.bounds.x, this.bounds.y, this.bounds.width, this.bounds.height);
        }

        // Highlight if hovered
        if (this.hovered && this.enabled) {
            ctx.strokeStyle = COLOR_GOLD;
            ctx.lineWidth = 2;
            ctx.strokeRect(this.bounds.x, this.bounds.y, this.bounds.width, this.bounds.height);
        }
    }

    updateEnabled(mana: number): void {
        this.enabled = mana >= SPELL_COSTS[this.spellType];
    }
}
