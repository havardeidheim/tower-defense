import { Button } from './Button';
import { TowerButton, TowerType } from './TowerButton';
import { SpellButton, SpellType } from './SpellButton';
import { UpgradeButton, SellButton } from './ActionButton';
import { GameButton, GameButtonType } from './GameButton';
import { InfoDisplay } from './InfoDisplay';
import { GAME_WIDTH, UI_WIDTH, CANVAS_HEIGHT } from '../game/constants';

export class UIManager {
    private buttons: Button[] = [];
    towerButtons: TowerButton[] = [];
    spellButtons: SpellButton[] = [];
    upgradeButton!: UpgradeButton;
    sellButton!: SellButton;
    gameButtons: GameButton[] = [];
    infoDisplay: InfoDisplay;

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
        this.infoDisplay = new InfoDisplay(GAME_WIDTH + 20, 180);
    }

    private createButtons(): void {
        // Center tower buttons: 4 × 40px + 3 × 10px gaps = 190px, centered in 220px
        const towerStartX = GAME_WIDTH + 15;  // 15px margin each side

        // Tower buttons (row at y=35)
        const towerTypes: TowerType[] = ['Normal', 'Area', 'Spread', 'Poison'];
        towerTypes.forEach((type, i) => {
            const btn = new TowerButton(towerStartX + i * 50, 35, type, this.onTowerSelect);
            this.towerButtons.push(btn);
            this.buttons.push(btn);
        });

        // Spell buttons (row at y=105) - aligned with first two tower buttons
        const spellTypes: SpellType[] = ['Lightning', 'Runestone'];
        spellTypes.forEach((type, i) => {
            const btn = new SpellButton(towerStartX + i * 50, 105, type, this.onSpellSelect);
            this.spellButtons.push(btn);
            this.buttons.push(btn);
        });

        // Upgrade and Sell buttons
        this.upgradeButton = new UpgradeButton(towerStartX, 380, this.onUpgrade);
        this.sellButton = new SellButton(towerStartX + 60, 380, this.onSell);
        this.buttons.push(this.upgradeButton);
        this.buttons.push(this.sellButton);

        // Game control buttons: 3 × 70px + 2 × 5px gaps = 220px
        const gameStartX = GAME_WIDTH + 5;  // 5px margin
        const gameButtonConfigs: { type: GameButtonType; label: string }[] = [
            { type: 'start', label: 'Start' },
            { type: 'fast', label: 'Fast' },
            { type: 'menu', label: 'Menu' }
        ];
        gameButtonConfigs.forEach((config, i) => {
            const btn = new GameButton(gameStartX + i * 72, 450, config.type, config.label, this.onGameAction);
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
        // Draw UI background
        ctx.fillStyle = '#1a1a2e';
        ctx.fillRect(GAME_WIDTH, 0, UI_WIDTH, CANVAS_HEIGHT);

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
    }

    renderWaveInfo(ctx: CanvasRenderingContext2D, enemyCounts: Map<string, number>): void {
        this.infoDisplay.renderWaveInfo(ctx, enemyCounts);
    }
}
