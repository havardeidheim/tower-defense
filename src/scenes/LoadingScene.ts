import { Scene } from './Scene';
import { resources } from '../resources/ResourceLoader';
import { CANVAS_WIDTH, CANVAS_HEIGHT } from '../game/constants';
import { MenuScene } from './MenuScene';

export class LoadingScene extends Scene {
    private progress: number = 0;
    private message: string = 'Loading...';
    private loadingComplete: boolean = false;

    enter(): void {
        resources.onProgress((progress, message) => {
            this.progress = progress;
            this.message = message;
        });

        resources.loadAll().then(() => {
            this.loadingComplete = true;
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
        ctx.fillStyle = '#1a1a2e';
        ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

        // Title
        ctx.fillStyle = '#FFD700';
        ctx.font = 'bold 32px Times New Roman';
        ctx.textAlign = 'center';
        ctx.fillText('Road Defender', CANVAS_WIDTH / 2, 150);

        ctx.fillStyle = '#888';
        ctx.font = '18px Times New Roman';
        ctx.fillText('Revenge of the Road', CANVAS_WIDTH / 2, 180);

        // Progress bar background
        const barWidth = 400;
        const barHeight = 30;
        const barX = (CANVAS_WIDTH - barWidth) / 2;
        const barY = CANVAS_HEIGHT / 2;

        ctx.fillStyle = '#333';
        ctx.fillRect(barX, barY, barWidth, barHeight);

        // Progress bar fill
        ctx.fillStyle = '#4a9eff';
        ctx.fillRect(barX, barY, barWidth * this.progress, barHeight);

        // Progress bar border
        ctx.strokeStyle = '#666';
        ctx.lineWidth = 2;
        ctx.strokeRect(barX, barY, barWidth, barHeight);

        // Progress text
        ctx.fillStyle = 'white';
        ctx.font = '16px Times New Roman';
        ctx.fillText(`${Math.floor(this.progress * 100)}%`, CANVAS_WIDTH / 2, barY + 20);

        // Status message
        ctx.fillStyle = '#888';
        ctx.font = '14px Times New Roman';
        ctx.fillText(this.message, CANVAS_WIDTH / 2, barY + 60);

        ctx.textAlign = 'left';
    }
}
