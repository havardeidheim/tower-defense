import { Scene } from './Scene';
import { resources } from '../resources/ResourceLoader';
import { CANVAS_WIDTH, CANVAS_HEIGHT } from '../game/constants';
import { MenuScene } from './MenuScene';
import {
    COLOR_GOLD, COLOR_MANA_BLUE, COLOR_TEXT_DISABLED, COLOR_TEXT_WHITE, COLOR_LOADING_BG, COLOR_HEALTH_BG, COLOR_BORDER_LIGHT,
    FONT_TITLE, FONT_PROGRESS, FONT_STATUS,
} from '../game/theme';

export class LoadingScene extends Scene {
    private progress: number = 0;
    private message: string = 'Loading...';

    enter(): void {
        resources.onProgress((progress, message) => {
            this.progress = progress;
            this.message = message;
        });

        resources.loadAll().then(() => {
            // Transition to menu after a short delay
            setTimeout(() => {
                this.game.setScene(new MenuScene());
            }, 500);
        }).catch(err => {
            console.error('Failed to load resources:', err);
            this.message = 'Failed to load resources!';
        });
    }

    exit(): void {}

    update(_deltaTime: number): void {}

    render(ctx: CanvasRenderingContext2D): void {
        // Dark background
        ctx.fillStyle = COLOR_LOADING_BG;
        ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

        // Title
        ctx.fillStyle = COLOR_GOLD;
        ctx.font = FONT_TITLE;
        ctx.textAlign = 'center';
        ctx.fillText('Road Defender', CANVAS_WIDTH / 2, 150);

        // Progress bar background
        const barWidth = 400;
        const barHeight = 30;
        const barX = (CANVAS_WIDTH - barWidth) / 2;
        const barY = CANVAS_HEIGHT / 2;

        ctx.fillStyle = COLOR_HEALTH_BG;
        ctx.fillRect(barX, barY, barWidth, barHeight);

        // Progress bar fill
        ctx.fillStyle = COLOR_MANA_BLUE;
        ctx.fillRect(barX, barY, barWidth * this.progress, barHeight);

        // Progress bar border
        ctx.strokeStyle = COLOR_BORDER_LIGHT;
        ctx.lineWidth = 2;
        ctx.strokeRect(barX, barY, barWidth, barHeight);

        // Progress text
        ctx.fillStyle = COLOR_TEXT_WHITE;
        ctx.font = FONT_PROGRESS;
        ctx.fillText(`${Math.floor(this.progress * 100)}%`, CANVAS_WIDTH / 2, barY + 20);

        // Status message
        ctx.fillStyle = COLOR_TEXT_DISABLED;
        ctx.font = FONT_STATUS;
        ctx.fillText(this.message, CANVAS_WIDTH / 2, barY + 60);

        ctx.textAlign = 'left';
    }
}
