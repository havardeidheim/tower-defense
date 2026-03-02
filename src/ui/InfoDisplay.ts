import { resources } from '../resources/ResourceLoader';
import { GAME_WIDTH, UI_WIDTH } from '../game/constants';

export class InfoDisplay {
    x: number;
    y: number;

    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
    }

    renderStats(ctx: CanvasRenderingContext2D, gold: number, mana: number, maxMana: number, lives: number, wave: number, totalWaves: number): void {
        const x = this.x;
        let y = this.y;

        ctx.font = 'bold 18px Arial';

        // Gold
        ctx.fillStyle = '#FFD54F';
        ctx.fillText(`Gold: ${gold}`, x, y);
        y += 25;

        // Mana
        ctx.fillStyle = '#4488FF';
        ctx.fillText(`Mana: ${mana}/${maxMana}`, x, y);
        y += 25;

        // Lives
        ctx.fillStyle = lives <= 2 ? '#FF4444' : '#44CC44';
        ctx.fillText(`Lives: ${lives}`, x, y);
        y += 25;

        // Wave
        ctx.fillStyle = '#DDD';
        ctx.fillText(`Wave: ${wave + 1}/${totalWaves}`, x, y);
    }

    renderTowerInfo(ctx: CanvasRenderingContext2D, tower: { getType: () => string; damage: number; range: number; attackSpeed: number; level: number; maxLevel: number }): void {
        const x = this.x;
        let y = this.y + 120;

        // Draw info panel background
        const panelX = GAME_WIDTH + 5;
        const panelY = y - 16;
        const panelWidth = UI_WIDTH - 10;
        const panelHeight = 80;
        this.drawInfoPanel(ctx, panelX, panelY, panelWidth, panelHeight);

        ctx.font = 'bold 15px Arial';
        ctx.fillStyle = '#FFD54F';
        ctx.fillText(`${tower.getType()} Tower (Lv ${tower.level + 1})`, x, y);
        y += 20;

        ctx.font = '13px Arial';
        ctx.fillStyle = '#DDD';
        ctx.fillText(`Damage: ${tower.damage}`, x, y);
        y += 16;
        ctx.fillText(`Range: ${tower.range}`, x, y);
        y += 16;
        ctx.fillText(`Speed: ${tower.attackSpeed.toFixed(1)}s`, x, y);
    }

    private drawInfoPanel(ctx: CanvasRenderingContext2D, x: number, y: number, width: number, height: number): void {
        // Draw helpback pattern or solid fallback
        const bgImg = resources.imageCache.get('helpback');
        if (bgImg) {
            ctx.drawImage(bgImg, x, y, width, height);
        } else {
            ctx.fillStyle = '#777755';
            ctx.fillRect(x, y, width, height);
        }

        // Double black border (matching original help screen style)
        ctx.strokeStyle = '#000';
        ctx.lineWidth = 1;
        ctx.strokeRect(x, y, width, height);
        ctx.strokeRect(x + 2, y + 2, width - 4, height - 4);
    }

}
