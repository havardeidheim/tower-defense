import { Button } from './Button';
import { resources } from '../resources/ResourceLoader';
import { COLOR_GOLD, COLOR_TEXT_DISABLED, COLOR_SELL_GREEN } from '../game/theme';

export class UpgradeButton extends Button {
    cost: number = 0;
    private canUpgrade: boolean = false;
    private onUpgrade: () => void;

    constructor(x: number, y: number, onUpgrade: () => void) {
        super(x, y, 40, 40);
        this.onUpgrade = onUpgrade;
        this.visible = false;
    }

    onClick(): void {
        if (this.enabled) {
            resources.soundManager.play('knapp');
            this.onUpgrade();
        }
    }

    render(ctx: CanvasRenderingContext2D): void {
        if (!this.visible) return;

        this.drawImage(ctx, 'upgradeknapp');
        this.drawCostLabel(ctx, `${this.cost}`, this.enabled ? COLOR_GOLD : COLOR_TEXT_DISABLED);
        this.drawDisabledOverlay(ctx);
    }

    setCost(cost: number): void {
        this.cost = cost;
    }

    setCanUpgrade(canUpgrade: boolean): void {
        this.canUpgrade = canUpgrade;
    }

    updateEnabled(gold: number): void {
        this.enabled = this.canUpgrade && gold >= this.cost;
    }
}

export class SellButton extends Button {
    value: number = 0;
    private onSell: () => void;

    constructor(x: number, y: number, onSell: () => void) {
        super(x, y, 40, 40);
        this.onSell = onSell;
        this.visible = false;
    }

    onClick(): void {
        if (this.enabled) {
            resources.soundManager.play('sell');
            this.onSell();
        }
    }

    render(ctx: CanvasRenderingContext2D): void {
        if (!this.visible) return;

        this.drawImage(ctx, 'sellknapp');
        this.drawCostLabel(ctx, `+${this.value}`, COLOR_SELL_GREEN);
    }

    setValue(value: number): void {
        this.value = value;
    }
}
