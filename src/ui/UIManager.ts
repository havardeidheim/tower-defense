import { Button } from './Button';
import { TowerButton, TowerType } from './TowerButton';
import { SpellButton, SpellType } from './SpellButton';
import { UpgradeButton, SellButton } from './ActionButton';
import { GameButton, GameButtonType } from './GameButton';
import { InfoDisplay } from './InfoDisplay';
import { WavePreview } from './WavePreview';
import { Rectangle } from '../core/Rectangle';
import { resources } from '../resources/ResourceLoader';
import { GAME_WIDTH, UI_WIDTH, CANVAS_HEIGHT, TOWER_COSTS, SPELL_COSTS } from '../game/constants';

interface ShopItemInfo {
    name: string;
    description: string[];
    priceLabel: string;
    priceColor: string;
}

const TOWER_DESCRIPTIONS: Record<TowerType, ShopItemInfo> = {
    Normal: {
        name: 'Tower of Stonehurling',
        description: [
            'Hurls stones at the enemy',
            '',
            'Levelup:',
            'Increased speed',
            'Increased damage',
            'Increased range',
        ],
        priceLabel: `Price: ${TOWER_COSTS['Normal']}`,
        priceColor: '#FFD54F',
    },
    Area: {
        name: 'Tower of Frostshock',
        description: [
            'Damages and slows all',
            'enemies in range',
            '',
            'Levelup:',
            'Increased slow',
            'Increased damage',
            '',
            'Level 4:',
            'Increased range',
        ],
        priceLabel: `Price: ${TOWER_COSTS['Area']}`,
        priceColor: '#FFD54F',
    },
    Spread: {
        name: 'Tower of Scatterflames',
        description: [
            'Fires heatseeking fireballs',
            'at multiple enemies',
            '',
            'Levelup:',
            'Extra fireballs',
            'Increased damage',
            '',
            'Level 4:',
            'Fireballs now strike two targets',
        ],
        priceLabel: `Price: ${TOWER_COSTS['Spread']}`,
        priceColor: '#FFD54F',
    },
    Poison: {
        name: 'Tower of Poisoning',
        description: [
            'Poisons the enemy causing',
            'damage over time.',
            'Hits on already poisoned',
            'enemies will increase the',
            'duration of the poison.',
            'Prioritizes targets with no poison',
            '',
            'Levelup:',
            'Increased duration',
        ],
        priceLabel: `Price: ${TOWER_COSTS['Poison']}`,
        priceColor: '#FFD54F',
    },
};

const SPELL_DESCRIPTIONS: Record<SpellType, ShopItemInfo> = {
    Lightning: {
        name: 'Lightningbolt',
        description: [
            'Stuns and damages a',
            'single enemy.',
            '',
            'Kills weaker enemies',
            '',
            "Can't be dodged",
        ],
        priceLabel: `Mana: ${SPELL_COSTS['Lightning']}`,
        priceColor: '#66BBFF',
    },
    Runestone: {
        name: 'Place foundation',
        description: [
            'Places a foundation where',
            'towers can be built',
        ],
        priceLabel: `Mana: ${SPELL_COSTS['Runestone']}`,
        priceColor: '#66BBFF',
    },
};

export class UIManager {
    private buttons: Button[] = [];
    towerButtons: TowerButton[] = [];
    spellButtons: SpellButton[] = [];
    upgradeButton!: UpgradeButton;
    sellButton!: SellButton;
    gameButtons: GameButton[] = [];
    infoDisplay: InfoDisplay;
    wavePreview: WavePreview;

    private onTowerSelect: (type: TowerType) => void;
    private onSpellSelect: (type: SpellType) => void;
    private onUpgrade: () => void;
    private onSell: () => void;
    private onGameAction: (type: GameButtonType) => void;

    constructor(
        onTowerSelect: (type: TowerType) => void,
        onSpellSelect: (type: SpellType) => void,
        onUpgrade: () => void,
        onSell: () => void,
        onGameAction: (type: GameButtonType) => void
    ) {
        this.onTowerSelect = onTowerSelect;
        this.onSpellSelect = onSpellSelect;
        this.onUpgrade = onUpgrade;
        this.onSell = onSell;
        this.onGameAction = onGameAction;

        this.createButtons();
        this.infoDisplay = new InfoDisplay(GAME_WIDTH + 20, 192);
        this.wavePreview = new WavePreview();
    }

    private createButtons(): void {
        // Center tower buttons: 4 × 40px + 3 × 10px gaps = 190px, centered in 220px
        const towerStartX = GAME_WIDTH + 15;  // 15px margin each side
        const spacing = 50;

        // Tower buttons (row at y=16, centered in box 1: 0-150)
        const towerTypes: TowerType[] = ['Normal', 'Area', 'Spread', 'Poison'];
        towerTypes.forEach((type, i) => {
            const btn = new TowerButton(towerStartX + i * spacing, 16, type, this.onTowerSelect);
            // Expand hover zone to fill cell: edge-to-edge horizontally, down to spell row vertically
            btn.hoverBounds = new Rectangle(towerStartX + i * spacing, 0, spacing, 70);
            this.towerButtons.push(btn);
            this.buttons.push(btn);
        });

        // Spell buttons (row at y=80, centered in box 1: 0-150)
        const spellTypes: SpellType[] = ['Lightning', 'Runestone'];
        spellTypes.forEach((type, i) => {
            const btn = new SpellButton(towerStartX + i * spacing, 80, type, this.onSpellSelect);
            // Expand hover zone to fill cell: edge-to-edge horizontally, up to tower row vertically
            btn.hoverBounds = new Rectangle(towerStartX + i * spacing, 70, spacing, 80);
            this.spellButtons.push(btn);
            this.buttons.push(btn);
        });

        // Upgrade and Sell buttons (in box 2, below stats)
        this.upgradeButton = new UpgradeButton(towerStartX, 255, this.onUpgrade);
        this.sellButton = new SellButton(towerStartX + 60, 255, this.onSell);
        this.buttons.push(this.upgradeButton);
        this.buttons.push(this.sellButton);

        // Game control buttons: 3 × 70px + 2 × 2px gaps = 214px, centered in 220px panel
        const gameStartX = GAME_WIDTH + 3;  // 3px margin
        const gameButtonConfigs: { type: GameButtonType; label: string }[] = [
            { type: 'start', label: 'Start' },
            { type: 'fast', label: 'Fast' },
            { type: 'menu', label: 'Menu' }
        ];
        gameButtonConfigs.forEach((config, i) => {
            const btn = new GameButton(gameStartX + i * 72, 452, config.type, config.label, this.onGameAction);
            this.gameButtons.push(btn);
            this.buttons.push(btn);
        });
    }

    handleClick(x: number, y: number): boolean {
        for (const button of this.buttons) {
            if (button.visible && button.containsPoint(x, y) && button.isClickable()) {
                button.onClick();
                return true;
            }
        }
        return false;
    }

    handleMouseMove(x: number, y: number): void {
        for (const button of this.buttons) {
            button.setHovered(button.visible && button.containsPoint(x, y));
        }
        this.wavePreview.handleMouseMove(x, y);
    }

    updateButtonStates(gold: number, mana: number): void {
        this.towerButtons.forEach(btn => btn.updateEnabled(gold));
        this.spellButtons.forEach(btn => btn.updateEnabled(mana));
        if (this.upgradeButton.visible) {
            this.upgradeButton.updateEnabled(gold);
        }
    }

    showTowerActions(upgradeCost: number, sellValue: number, canUpgrade: boolean, gold: number): void {
        this.upgradeButton.visible = true;
        this.upgradeButton.setCost(upgradeCost);
        this.upgradeButton.setCanUpgrade(canUpgrade);
        this.upgradeButton.enabled = canUpgrade && gold >= upgradeCost;

        this.sellButton.visible = true;
        this.sellButton.setValue(sellValue);
    }

    hideTowerActions(): void {
        this.upgradeButton.visible = false;
        this.sellButton.visible = false;
    }

    setStartButtonLabel(label: string): void {
        const startBtn = this.gameButtons.find(b => b.buttonType === 'start');
        if (startBtn) startBtn.setLabel(label);
    }

    setFastButtonActive(active: boolean): void {
        const fastBtn = this.gameButtons.find(b => b.buttonType === 'fast');
        if (fastBtn) fastBtn.active = active;
    }

    render(ctx: CanvasRenderingContext2D): void {
        // Draw black divider lines matching original game
        ctx.strokeStyle = '#000';
        ctx.lineWidth = 1;

        // Vertical line separating game area from panel
        ctx.beginPath();
        ctx.moveTo(GAME_WIDTH, 0);
        ctx.lineTo(GAME_WIDTH, CANVAS_HEIGHT);
        ctx.stroke();

        // Horizontal line below tower/spell buttons
        ctx.beginPath();
        ctx.moveTo(GAME_WIDTH, 150);
        ctx.lineTo(GAME_WIDTH + UI_WIDTH, 150);
        ctx.stroke();

        // Horizontal line above wave preview
        ctx.beginPath();
        ctx.moveTo(GAME_WIDTH, 300);
        ctx.lineTo(GAME_WIDTH + UI_WIDTH, 300);
        ctx.stroke();

        // Draw all buttons
        for (const button of this.buttons) {
            button.render(ctx);
        }
    }

    renderStats(ctx: CanvasRenderingContext2D, gold: number, mana: number, maxMana: number, lives: number, wave: number, totalWaves: number): void {
        this.infoDisplay.renderStats(ctx, gold, mana, maxMana, lives, wave, totalWaves);
    }

    renderTowerInfo(ctx: CanvasRenderingContext2D, tower: { getType: () => string; damage: number; range: number; attackSpeed: number; level: number; maxLevel: number }): void {
        this.infoDisplay.renderTowerInfo(ctx, tower);
        // Re-render upgrade/sell buttons on top of the info panel
        this.upgradeButton.render(ctx);
        this.sellButton.render(ctx);
    }

    updateWavePreview(enemyCounts: Map<string, number>): void {
        this.wavePreview.updateCounts(enemyCounts);
    }

    hideWavePreview(): void {
        this.wavePreview.hide();
    }

    renderWavePreview(ctx: CanvasRenderingContext2D): void {
        this.wavePreview.render(ctx);
    }

    renderEnemyHoverInfo(ctx: CanvasRenderingContext2D): void {
        this.wavePreview.renderHoverInfo(ctx, GAME_WIDTH + 20, 168);
    }

    hasHoveredEnemy(): boolean {
        return this.wavePreview.getHoveredEnemy() !== null;
    }

    getHoveredShopInfo(): ShopItemInfo | null {
        for (const btn of this.towerButtons) {
            if (btn.hovered && btn.visible) {
                return TOWER_DESCRIPTIONS[btn.towerType];
            }
        }
        for (const btn of this.spellButtons) {
            if (btn.hovered && btn.visible) {
                return SPELL_DESCRIPTIONS[btn.spellType];
            }
        }
        return null;
    }

    hasHoveredShopButton(): boolean {
        return this.getHoveredShopInfo() !== null;
    }

    renderShopHoverInfo(ctx: CanvasRenderingContext2D): void {
        const info = this.getHoveredShopInfo();
        if (!info) return;

        const panelX = GAME_WIDTH;
        const panelY = 150;
        const panelWidth = UI_WIDTH;
        const panelHeight = 200;
        const lineHeight = 15;
        const textX = GAME_WIDTH + 20;

        // Background - fill Zone 2 down past "Next Wave:" header
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

        let y = panelY + 28;

        // Title
        ctx.font = 'bold 15px Arial';
        ctx.fillStyle = '#FFD54F';
        ctx.textAlign = 'left';
        ctx.fillText(info.name, textX, y);
        y += 18;

        // Price
        ctx.font = 'bold 14px Arial';
        ctx.fillStyle = info.priceColor;
        ctx.fillText(info.priceLabel, textX, y);
        y += 18;

        // Description
        ctx.font = '13px Arial';
        ctx.fillStyle = '#DDD';
        for (const line of info.description) {
            if (line !== '') {
                ctx.fillText(line, textX, y);
            }
            y += lineHeight;
        }
    }
}
