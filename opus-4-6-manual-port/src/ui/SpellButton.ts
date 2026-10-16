import { Button } from './Button';
import { resources } from '../resources/ResourceLoader';
import { SPELL_COSTS } from '../game/constants';
import { COLOR_GOLD, COLOR_TEXT_DISABLED } from '../game/theme';

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

        this.drawImage(ctx, this.imageKey);
        const cost = SPELL_COSTS[this.spellType];
        this.drawCostLabel(ctx, `${cost}`, this.enabled ? COLOR_GOLD : COLOR_TEXT_DISABLED);
        this.drawDisabledOverlay(ctx);
        this.drawHoverHighlight(ctx);
    }

    updateEnabled(mana: number): void {
        this.enabled = mana >= SPELL_COSTS[this.spellType];
    }
}
