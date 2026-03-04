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
        ctx.fillStyle = '#66BBFF';
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
        // Render in the middle panel zone, matching shop hover info style
        const panelX = GAME_WIDTH;
        const panelY = 150;
        const panelWidth = UI_WIDTH;
        const panelHeight = 200;

        // Background - same as shop hover info
        const bgImg = resources.imageCache.get('helpback');
        if (bgImg) {
            ctx.drawImage(bgImg, panelX, panelY, panelWidth, panelHeight);
        } else {
            ctx.fillStyle = '#777755';
            ctx.fillRect(panelX, panelY, panelWidth, panelHeight);
        }

        // Single border - matching shop hover info
        ctx.strokeStyle = '#000';
        ctx.lineWidth = 1;
        ctx.strokeRect(panelX, panelY, panelWidth, panelHeight);

        const textX = GAME_WIDTH + 20;
        let y = panelY + 28;

        ctx.font = 'bold 15px Arial';
        ctx.fillStyle = '#FFD54F';
        ctx.textAlign = 'left';
        ctx.fillText(`${tower.getType()} Tower (Lv ${tower.level + 1})`, textX, y);
        y += 20;

        ctx.font = '13px Arial';
        ctx.fillStyle = '#DDD';
        ctx.fillText(`Damage: ${tower.damage}`, textX, y);
        y += 16;
        ctx.fillText(`Range: ${tower.range}`, textX, y);
        y += 16;
        ctx.fillText(`Speed: ${tower.attackSpeed.toFixed(1)}s`, textX, y);
    }


}
