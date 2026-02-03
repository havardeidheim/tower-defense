import { ENEMY_NORMAL, ENEMY_FAST, ENEMY_SHIELD, ENEMY_DODGE, ENEMY_NOSLOW, ENEMY_SUPER } from '../game/constants';

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

        ctx.font = 'bold 16px Times New Roman';

        // Gold
        ctx.fillStyle = '#FFD700';
        ctx.fillText(`Gold: ${gold}`, x, y);
        y += 25;

        // Mana
        ctx.fillStyle = '#4169E1';
        ctx.fillText(`Mana: ${mana}/${maxMana}`, x, y);
        y += 25;

        // Lives
        ctx.fillStyle = lives <= 2 ? '#FF4444' : '#32CD32';
        ctx.fillText(`Lives: ${lives}`, x, y);
        y += 25;

        // Wave
        ctx.fillStyle = 'white';
        ctx.fillText(`Wave: ${wave + 1}/${totalWaves}`, x, y);
    }

    renderTowerInfo(ctx: CanvasRenderingContext2D, tower: { getType: () => string; damage: number; range: number; attackSpeed: number; level: number; maxLevel: number }): void {
        const x = this.x;
        let y = this.y + 120;

        ctx.font = 'bold 14px Times New Roman';
        ctx.fillStyle = '#FFD700';
        ctx.fillText(`${tower.getType()} Tower (Lv ${tower.level + 1})`, x, y);
        y += 20;

        ctx.font = '12px Times New Roman';
        ctx.fillStyle = 'white';
        ctx.fillText(`Damage: ${tower.damage}`, x, y);
        y += 16;
        ctx.fillText(`Range: ${tower.range}`, x, y);
        y += 16;
        ctx.fillText(`Speed: ${tower.attackSpeed.toFixed(1)}s`, x, y);
    }

    renderWaveInfo(ctx: CanvasRenderingContext2D, enemyCounts: Map<string, number>): void {
        if (enemyCounts.size === 0) return;

        const x = this.x;
        let y = this.y + 280;

        ctx.font = 'bold 14px Times New Roman';
        ctx.fillStyle = 'white';
        ctx.fillText('Next Wave:', x, y);
        y += 20;

        ctx.font = '12px Times New Roman';

        const enemyNames: Record<string, string> = {
            [ENEMY_NORMAL]: 'Normal',
            [ENEMY_FAST]: 'Fast',
            [ENEMY_SHIELD]: 'Shield',
            [ENEMY_DODGE]: 'Dodge',
            [ENEMY_NOSLOW]: 'Noslow',
            [ENEMY_SUPER]: 'Super'
        };

        for (const [type, count] of enemyCounts) {
            const name = enemyNames[type] || type;
            ctx.fillText(`${name}: ${count}`, x, y);
            y += 14;
        }
    }
}
