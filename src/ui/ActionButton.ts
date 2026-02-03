import { Button } from './Button';
import { resources } from '../resources/ResourceLoader';

export class UpgradeButton extends Button {
    cost: number = 0;
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

        // Draw cost
        ctx.fillStyle = this.enabled ? '#FFD700' : '#888';
        ctx.font = 'bold 12px Times New Roman';
        ctx.textAlign = 'center';
        ctx.fillText(`${this.cost}`, this.bounds.centerX, this.bounds.bottom + 14);
        ctx.textAlign = 'left';

        if (!this.enabled) {
            ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
            ctx.fillRect(this.bounds.x, this.bounds.y, this.bounds.width, this.bounds.height);
        }
    }

    setCost(cost: number): void {
        this.cost = cost;
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

        // Draw value
        ctx.fillStyle = '#32CD32';
        ctx.font = 'bold 12px Times New Roman';
        ctx.textAlign = 'center';
        ctx.fillText(`+${this.value}`, this.bounds.centerX, this.bounds.bottom + 14);
        ctx.textAlign = 'left';
    }

    setValue(value: number): void {
        this.value = value;
    }
}
