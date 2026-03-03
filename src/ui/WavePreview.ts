import { Rectangle } from '../core/Rectangle';
import { resources } from '../resources/ResourceLoader';
import {
    ENEMY_NORMAL, ENEMY_FAST, ENEMY_SHIELD,
    ENEMY_DODGE, ENEMY_NOSLOW, ENEMY_SUPER,
    GAME_WIDTH, UI_WIDTH
} from '../game/constants';

interface EnemyIconData {
    enemyType: string;
    spriteKey: string;
    displayName: string;
    description: string[];
}

const ENEMY_DATA: EnemyIconData[] = [
    {
        enemyType: ENEMY_NORMAL,
        spriteKey: 'peasant',
        displayName: 'Peasant',
        description: ['Just a peasant']
    },
    {
        enemyType: ENEMY_FAST,
        spriteKey: 'scout',
        displayName: 'Scout',
        description: ['Fast movement']
    },
    {
        enemyType: ENEMY_SHIELD,
        spriteKey: 'solider',
        displayName: 'Solider',
        description: [
            'High health',
            'Mitigates a certain amount of',
            'damage every hit, also works',
            'on poison damage'
        ]
    },
    {
        enemyType: ENEMY_DODGE,
        spriteKey: 'assassin',
        displayName: 'Assassin',
        description: [
            'Low health',
            'Fast movement',
            '50% chance to dodge attacks'
        ]
    },
    {
        enemyType: ENEMY_NOSLOW,
        spriteKey: 'vanguard',
        displayName: 'Vanguard',
        description: [
            'Fast movement',
            'Immune to slow',
            'Blocks the first three attacks'
        ]
    },
    {
        enemyType: ENEMY_SUPER,
        spriteKey: 'paragon',
        displayName: 'Paragon',
        description: [
            'Low health',
            'Fast movement',
            '50% chance to resist slow',
            '50% chance to dodge attacks',
            'Mitigates damage every hit'
        ]
    }
];

class EnemyIcon {
    bounds: Rectangle;
    hoverBounds: Rectangle;
    enemyType: string;
    spriteKey: string;
    displayName: string;
    description: string[];
    hovered: boolean = false;

    constructor(x: number, y: number, data: EnemyIconData) {
        this.bounds = new Rectangle(x, y, 28, 28);
        this.hoverBounds = this.bounds;
        this.enemyType = data.enemyType;
        this.spriteKey = data.spriteKey;
        this.displayName = data.displayName;
        this.description = data.description;
    }
}

export class WavePreview {
    private icons: EnemyIcon[] = [];
    private counts: Map<string, number> = new Map();
    private visible: boolean = false;
    private headerY: number;

    constructor() {
        const startX = GAME_WIDTH + 15;
        const colSpacing = 67;
        this.headerY = 342;
        const row1Y = 360;
        const row2Y = 393;
        const rowSplit = 390; // Midpoint between row bottoms

        // x-division between columns: midpoint between count text end (~53px) and next icon (67px)
        const colDivOffset = 60;

        // Row 1: Peasant, Scout, Solider
        for (let i = 0; i < 3; i++) {
            const icon = new EnemyIcon(startX + i * colSpacing, row1Y, ENEMY_DATA[i]);
            const hoverLeft = i === 0 ? startX : startX + (i - 1) * colSpacing + colDivOffset;
            const hoverRight = i === 2 ? startX + 2 * colSpacing + colSpacing : startX + i * colSpacing + colDivOffset;
            icon.hoverBounds = new Rectangle(hoverLeft, this.headerY, hoverRight - hoverLeft, rowSplit - this.headerY);
            this.icons.push(icon);
        }
        // Row 2: Assassin, Vanguard, Paragon
        for (let i = 0; i < 3; i++) {
            const icon = new EnemyIcon(startX + i * colSpacing, row2Y, ENEMY_DATA[i + 3]);
            const hoverLeft = i === 0 ? startX : startX + (i - 1) * colSpacing + colDivOffset;
            const hoverRight = i === 2 ? startX + 2 * colSpacing + colSpacing : startX + i * colSpacing + colDivOffset;
            icon.hoverBounds = new Rectangle(hoverLeft, rowSplit, hoverRight - hoverLeft, row2Y + 28 + 15 - rowSplit);
            this.icons.push(icon);
        }
    }

    updateCounts(counts: Map<string, number>): void {
        this.counts = counts;
        this.visible = true;
    }

    hide(): void {
        this.visible = false;
    }

    handleMouseMove(x: number, y: number): void {
        for (const icon of this.icons) {
            icon.hovered = this.visible && icon.hoverBounds.contains(x, y);
        }
    }

    getHoveredEnemy(): EnemyIcon | null {
        if (!this.visible) return null;
        return this.icons.find(icon => icon.hovered) || null;
    }

    render(ctx: CanvasRenderingContext2D): void {
        if (!this.visible) return;

        // Header
        ctx.font = 'bold 16px Arial';
        ctx.fillStyle = '#DDD';
        ctx.textAlign = 'left';
        ctx.fillText('Next Wave:', GAME_WIDTH + 20, this.headerY);

        // Draw each icon with count
        for (const icon of this.icons) {
            const count = this.counts.get(icon.enemyType) || 0;

            // Draw sprite
            const img = resources.imageCache.get(icon.spriteKey);
            if (img) {
                if (count === 0) ctx.globalAlpha = 0.4;
                ctx.drawImage(img, icon.bounds.x, icon.bounds.y, icon.bounds.width, icon.bounds.height);
                ctx.globalAlpha = 1.0;
            }

            // Draw count to the right
            ctx.font = 'bold 14px Arial';
            ctx.fillStyle = '#E0E0E0';
            if (count === 0) ctx.globalAlpha = 0.4;
            ctx.textAlign = 'left';
            ctx.fillText(`×${count}`, icon.bounds.right + 3, icon.bounds.y + 18);
            ctx.globalAlpha = 1.0;

            // Hover border
            if (icon.hovered) {
                ctx.strokeStyle = '#FFD54F';
                ctx.lineWidth = 2;
                ctx.strokeRect(icon.bounds.x - 1, icon.bounds.y - 1, icon.bounds.width + 2, icon.bounds.height + 2);
            }
        }
    }

    renderHoverInfo(ctx: CanvasRenderingContext2D, x: number, _y: number): void {
        const hovered = this.getHoveredEnemy();
        if (!hovered) return;

        // Fill Zone 2 down past "Next Wave:" header
        const panelX = GAME_WIDTH;
        const panelY = 150;
        const panelWidth = UI_WIDTH;
        const panelHeight = 200;

        const bgImg = resources.imageCache.get('helpback');
        if (bgImg) {
            ctx.drawImage(bgImg, panelX, panelY, panelWidth, panelHeight);
        } else {
            ctx.fillStyle = '#777755';
            ctx.fillRect(panelX, panelY, panelWidth, panelHeight);
        }

        // Border matching panel divider lines
        ctx.strokeStyle = '#000';
        ctx.lineWidth = 1;
        ctx.strokeRect(panelX, panelY, panelWidth, panelHeight);

        // Title
        let y = panelY + 28;
        ctx.font = 'bold 15px Arial';
        ctx.fillStyle = '#FFD54F';
        ctx.textAlign = 'left';
        ctx.fillText(hovered.displayName, x, y);
        y += 18;

        // Description
        ctx.font = '13px Arial';
        ctx.fillStyle = '#DDD';
        for (const line of hovered.description) {
            ctx.fillText(line, x, y);
            y += 15;
        }
    }
}
