import { TowerType } from '../../ui/TowerButton';
import { TOWER_COSTS } from '../../game/constants';

export interface TowerStatLine {
    label: string;
    values: string[];    // 4 entries, one per level (0-3)
    suffix?: string;     // e.g. "s", "%"
}

export interface TowerStatsDefinition {
    name: string;
    flavorText: string;
    cost: number;
    statLines: TowerStatLine[];
    specialNotes?: string[];
}

export const TOWER_STATS: Record<TowerType, TowerStatsDefinition> = {
    Normal: {
        name: 'Tower of Stonehurling',
        flavorText: 'Hurls stones at the enemy',
        cost: TOWER_COSTS['Normal'],
        statLines: [
            { label: 'Damage', values: ['20', '28', '36', '44'] },
            { label: 'Range', values: ['140', '150', '160', '170'] },
            { label: 'Speed', values: ['1.2', '1.1', '1.0', '0.9'], suffix: 's' },
        ],
    },
    Area: {
        name: 'Tower of Frostshock',
        flavorText: 'Damage and slow enemies',
        cost: TOWER_COSTS['Area'],
        statLines: [
            { label: 'Damage', values: ['20', '26', '32', '38'] },
            { label: 'Range', values: ['80', '80', '80', '100'] },
            { label: 'Speed', values: ['2.0', '2.0', '2.0', '2.0'], suffix: 's' },
            { label: 'Slow', values: ['30', '35', '40', '50'], suffix: '%' },
        ],
    },
    Spread: {
        name: 'Tower of Scatterflames',
        flavorText: 'Fires multiple fireballs',
        cost: TOWER_COSTS['Spread'],
        statLines: [
            { label: 'Damage', values: ['16', '18', '22', '22 x2'] },
            { label: 'Range', values: ['140', '140', '140', '140'] },
            { label: 'Speed', values: ['1.5', '1.5', '1.5', '1.5'], suffix: 's' },
            { label: 'Targets', values: ['2', '3', '4', '4'] },
        ],
        specialNotes: ['Lv4: Fireballs spread'],
    },
    Poison: {
        name: 'Tower of Poisoning',
        flavorText: 'Poisons enemies',
        cost: TOWER_COSTS['Poison'],
        statLines: [
            { label: 'Ticks', values: ['2', '3', '4', '6'] },
            { label: 'Total dmg', values: ['36', '54', '72', '108'] },
            { label: 'Range', values: ['120', '120', '120', '120'] },
            { label: 'Speed', values: ['1.2', '1.2', '1.2', '1.2'], suffix: 's' },
        ],
        specialNotes: ['Prioritizes unpoisoned enemies'],
    },
};

function isConstant(values: string[]): boolean {
    return values.every(v => v === values[0]);
}

export function renderStatLine(
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    stat: TowerStatLine,
    currentLevel?: number
): void {
    const normalFont = '12px Arial';
    const boldFont = 'bold 12px Arial';
    const labelColor = '#AAA';
    const valueColor = '#DDD';
    const activeColor = '#FFF';

    // Draw label
    ctx.font = normalFont;
    ctx.fillStyle = labelColor;
    const labelText = stat.label + ': ';
    ctx.fillText(labelText, x, y);
    let cursorX = x + ctx.measureText(labelText).width;

    if (isConstant(stat.values)) {
        // Single value display for constant stats
        const isCurrent = currentLevel !== undefined;
        ctx.font = isCurrent ? boldFont : normalFont;
        ctx.fillStyle = isCurrent ? activeColor : valueColor;
        ctx.fillText(stat.values[0] + (stat.suffix || ''), cursorX, y);
    } else {
        // Multi-value display: "v0 / v1 / v2 / v3"
        for (let i = 0; i < stat.values.length; i++) {
            const isCurrent = currentLevel !== undefined && i === currentLevel;
            ctx.font = isCurrent ? boldFont : normalFont;
            ctx.fillStyle = isCurrent ? activeColor : valueColor;

            const valText = stat.values[i] + (stat.suffix || '');
            ctx.fillText(valText, cursorX, y);
            cursorX += ctx.measureText(valText).width;

            if (i < stat.values.length - 1) {
                ctx.font = normalFont;
                ctx.fillStyle = '#888';
                const sep = ' / ';
                ctx.fillText(sep, cursorX, y);
                cursorX += ctx.measureText(sep).width;
            }
        }
    }
}
