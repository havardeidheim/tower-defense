import { Button } from './Button';
import { resources } from '../resources/ResourceLoader';
import { COLOR_GOLD, COLOR_TEXT_DARK_DISABLED, COLOR_BORDER_DARK, COLOR_BTN_ACTIVE_BG, COLOR_BTN_INACTIVE_BG, FONT_LABEL_XS } from '../game/theme';

export type GameButtonType = 'start' | 'pause' | 'fast' | 'menu' | 'help';

export class GameButton extends Button {
    buttonType: GameButtonType;
    label: string;
    active: boolean = false;
    private onAction: (type: GameButtonType) => void;

    constructor(x: number, y: number, buttonType: GameButtonType, label: string, onAction: (type: GameButtonType) => void) {
        super(x, y, 70, 25);
        this.buttonType = buttonType;
        this.label = label;
        this.onAction = onAction;
    }

    onClick(): void {
        if (this.enabled) {
            resources.soundManager.play('knapp');
            this.onAction(this.buttonType);
        }
    }

    render(ctx: CanvasRenderingContext2D): void {
        if (!this.visible) return;

        // Draw button background
        ctx.fillStyle = this.active ? COLOR_BTN_ACTIVE_BG : COLOR_BTN_INACTIVE_BG;
        ctx.fillRect(this.bounds.x, this.bounds.y, this.bounds.width, this.bounds.height);

        ctx.strokeStyle = this.hovered ? COLOR_GOLD : COLOR_BORDER_DARK;
        ctx.lineWidth = 1;
        ctx.strokeRect(this.bounds.x, this.bounds.y, this.bounds.width, this.bounds.height);

        // Draw label
        ctx.fillStyle = this.enabled ? COLOR_GOLD : COLOR_TEXT_DARK_DISABLED;
        ctx.font = FONT_LABEL_XS;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(this.label, this.bounds.centerX, this.bounds.centerY);
        ctx.textAlign = 'left';
        ctx.textBaseline = 'alphabetic';
    }

    setLabel(label: string): void {
        this.label = label;
    }
}
