import { resources } from '../resources/ResourceLoader';
import { GAME_WIDTH, UI_WIDTH } from '../game/constants';
import { TOWER_STATS, renderStatLine } from '../entities/towers/TowerStatsConfig';
import { TowerType } from './TowerButton';
import {
    COLOR_GOLD, COLOR_MANA_BLUE, COLOR_TEXT, COLOR_TEXT_SUBTLE,
    COLOR_LIVES_DANGER, COLOR_LIVES_SAFE,
    COLOR_PANEL_BG, COLOR_BORDER,
    FONT_HEADING, FONT_LABEL_SM, FONT_NOTE,
} from '../game/theme';

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

        ctx.font = FONT_HEADING;

        // Gold
        ctx.fillStyle = COLOR_GOLD;
        ctx.fillText(`Gold: ${gold}`, x, y);
        y += 25;

        // Mana
        ctx.fillStyle = COLOR_MANA_BLUE;
        ctx.fillText(`Mana: ${mana}/${maxMana}`, x, y);
        y += 25;

        // Lives
        ctx.fillStyle = lives <= 2 ? COLOR_LIVES_DANGER : COLOR_LIVES_SAFE;
        ctx.fillText(`Lives: ${lives}`, x, y);
        y += 25;

        // Wave
        ctx.fillStyle = COLOR_TEXT;
        ctx.fillText(`Wave: ${wave + 1}/${totalWaves}`, x, y);
    }

    renderTowerInfo(ctx: CanvasRenderingContext2D, tower: { getType: () => string; damage: number; range: number; attackSpeed: number; level: number; maxLevel: number }): void {
        const panelX = GAME_WIDTH;
        const panelY = 150;
        const panelWidth = UI_WIDTH;
        const panelHeight = 200;

        // Background
        const bgImg = resources.imageCache.get('helpback');
        if (bgImg) {
            ctx.drawImage(bgImg, panelX, panelY, panelWidth, panelHeight);
        } else {
            ctx.fillStyle = COLOR_PANEL_BG;
            ctx.fillRect(panelX, panelY, panelWidth, panelHeight);
        }

        ctx.strokeStyle = COLOR_BORDER;
        ctx.lineWidth = 1;
        ctx.strokeRect(panelX, panelY, panelWidth, panelHeight);

        const textX = GAME_WIDTH + 20;
        let y = panelY + 28;

        const towerType = tower.getType() as TowerType;
        const stats = TOWER_STATS[towerType];
        if (!stats) return;

        // Title: tower name + level
        ctx.font = FONT_LABEL_SM;
        ctx.fillStyle = COLOR_GOLD;
        ctx.textAlign = 'left';
        ctx.fillText(`${stats.name} (Lv ${tower.level + 1})`, textX, y);
        y += 20;

        // Stat lines with current level bolded
        for (const stat of stats.statLines) {
            renderStatLine(ctx, textX, y, stat, tower.level);
            y += 14;
        }

        // Special notes
        if (stats.specialNotes) {
            y += 2;
            ctx.font = FONT_NOTE;
            ctx.fillStyle = COLOR_TEXT_SUBTLE;
            for (const note of stats.specialNotes) {
                ctx.fillText(note, textX, y);
                y += 13;
            }
        }
    }
}
