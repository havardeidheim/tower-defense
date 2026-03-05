import { Button } from './Button';
import { resources } from '../resources/ResourceLoader';
import { TOWER_COSTS } from '../game/constants';
import { COLOR_GOLD, COLOR_TEXT_DISABLED, COLOR_DISABLED_OVERLAY, FONT_LABEL_SM } from '../game/theme';

export type TowerType = 'Normal' | 'Area' | 'Spread' | 'Poison';

export class TowerButton extends Button {
    towerType: TowerType;
    imageKey: string;
    private onPurchase: (type: TowerType) => void;

    constructor(x: number, y: number, towerType: TowerType, onPurchase: (type: TowerType) => void) {
        super(x, y, 40, 40);
        this.towerType = towerType;
        this.imageKey = `${towerType.toLowerCase()}tower`;
        this.onPurchase = onPurchase;
    }

    onClick(): void {
        if (this.enabled) {
            resources.soundManager.play('knapp');
            this.onPurchase(this.towerType);
        }
    }

    render(ctx: CanvasRenderingContext2D): void {
        if (!this.visible) return;

        // Draw tower image
        this.drawImage(ctx, this.imageKey);

        // Draw cost below
        const cost = TOWER_COSTS[this.towerType];
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

    updateEnabled(gold: number): void {
        this.enabled = gold >= TOWER_COSTS[this.towerType];
    }
}
