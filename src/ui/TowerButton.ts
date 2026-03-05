import { Button } from './Button';
import { resources } from '../resources/ResourceLoader';
import { TOWER_COSTS } from '../game/constants';
import { COLOR_GOLD, COLOR_TEXT_DISABLED } from '../game/theme';

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

        this.drawImage(ctx, this.imageKey);
        const cost = TOWER_COSTS[this.towerType];
        this.drawCostLabel(ctx, `${cost}`, this.enabled ? COLOR_GOLD : COLOR_TEXT_DISABLED);
        this.drawDisabledOverlay(ctx);
        this.drawHoverHighlight(ctx);
    }

    updateEnabled(gold: number): void {
        this.enabled = gold >= TOWER_COSTS[this.towerType];
    }
}
