import { TowerType } from '../../ui/TowerButton';
import { TowerStats, TowerLevelStats } from './Tower';
import { NormalTower } from './NormalTower';
import { AreaTower } from './AreaTower';
import { SpreadTower } from './SpreadTower';
import { PoisonTower } from './PoisonTower';
import { POISON_DAMAGE_PER_TICK } from '../../game/constants';
import {
    COLOR_STAT_LABEL, COLOR_TEXT, COLOR_TEXT_WHITE, COLOR_STAT_SEPARATOR,
    FONT_BODY_SM, FONT_BODY_SM_BOLD,
} from '../../game/theme';

// --- Tower descriptions (presentation only) ---

export interface TowerDescription {
    name: string;
    flavorText: string;
    specialNotes?: string[];
}

export const TOWER_DESCRIPTIONS: Record<TowerType, TowerDescription> = {
    Normal: {
        name: 'Tower of Stonehurling',
        flavorText: 'Hurls stones at the enemy',
    },
    Area: {
        name: 'Tower of Frostshock',
        flavorText: 'Damage and slow enemies',
    },
    Spread: {
        name: 'Tower of Scatterflames',
        flavorText: 'Fires multiple fireballs',
        specialNotes: ['Lv4: Fireballs spread'],
    },
    Poison: {
        name: 'Tower of Poisoning',
        flavorText: 'Poisons enemies',
        specialNotes: ['Prioritizes unpoisoned enemies'],
    },
};

// --- Stat display configuration ---

interface StatDisplayConfig {
    label: string;
    key: string;
    suffix?: string;
    format?: (value: number | boolean, level: TowerLevelStats) => string;
}

const DAMAGE: StatDisplayConfig = { label: 'Damage', key: 'damage' };
const RANGE: StatDisplayConfig = { label: 'Range', key: 'range' };
const SPEED: StatDisplayConfig = { label: 'Speed', key: 'speed', suffix: 's' };

const TOWER_STAT_DISPLAY: Record<TowerType, StatDisplayConfig[]> = {
    Normal: [DAMAGE, RANGE, SPEED],
    Area: [DAMAGE, RANGE, SPEED, { label: 'Slow', key: 'slow', suffix: '%' }],
    Spread: [
        {
            label: 'Damage', key: 'damage',
            format: (v, l) => l.canBounce ? `${v} x2` : `${v}`,
        },
        RANGE, SPEED,
        { label: 'Targets', key: 'targets' },
    ],
    Poison: [
        { label: 'Ticks', key: 'damage' },
        {
            label: 'Total dmg', key: 'damage',
            format: (v) => `${(v as number) * POISON_DAMAGE_PER_TICK}`,
        },
        RANGE, SPEED,
    ],
};

// --- Tower stats access ---

export function getTowerStats(type: TowerType): TowerStats {
    switch (type) {
        case 'Normal': return NormalTower.STATS;
        case 'Area': return AreaTower.STATS;
        case 'Spread': return SpreadTower.STATS;
        case 'Poison': return PoisonTower.STATS;
    }
}

// --- Stat line generation ---

export interface TowerStatLine {
    label: string;
    values: string[];
}

export function getStatLines(type: TowerType): TowerStatLine[] {
    const config = TOWER_STAT_DISPLAY[type];
    const stats = getTowerStats(type);

    return config.map(s => ({
        label: s.label,
        values: stats.levels.map(level => {
            const value = level[s.key];
            if (s.format) return s.format(value, level);
            return `${value}${s.suffix || ''}`;
        }),
    }));
}

// --- Rendering ---

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
    const normalFont = FONT_BODY_SM;
    const boldFont = FONT_BODY_SM_BOLD;
    const labelColor = COLOR_STAT_LABEL;
    const valueColor = COLOR_TEXT;
    const activeColor = COLOR_TEXT_WHITE;

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
        ctx.fillText(stat.values[0], cursorX, y);
    } else {
        // Multi-value display: "v0 / v1 / v2 / v3"
        for (let i = 0; i < stat.values.length; i++) {
            const isCurrent = currentLevel !== undefined && i === currentLevel;
            ctx.font = isCurrent ? boldFont : normalFont;
            ctx.fillStyle = isCurrent ? activeColor : valueColor;

            ctx.fillText(stat.values[i], cursorX, y);
            cursorX += ctx.measureText(stat.values[i]).width;

            if (i < stat.values.length - 1) {
                ctx.font = normalFont;
                ctx.fillStyle = COLOR_STAT_SEPARATOR;
                const sep = ' / ';
                ctx.fillText(sep, cursorX, y);
                cursorX += ctx.measureText(sep).width;
            }
        }
    }
}
