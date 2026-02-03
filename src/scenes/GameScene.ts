import { Scene } from './Scene';
import { Level } from '../level/Level';
import { WaveManager } from '../level/WaveManager';
import { Enemy } from '../entities/enemies/Enemy';
import { Tower } from '../entities/towers/Tower';
import { NormalTower } from '../entities/towers/NormalTower';
import { AreaTower } from '../entities/towers/AreaTower';
import { SpreadTower } from '../entities/towers/SpreadTower';
import { PoisonTower } from '../entities/towers/PoisonTower';
import { Projectile } from '../entities/projectiles/Projectile';
import { AreaShot } from '../entities/effects/AreaShot';
import { Lightning } from '../spells/Lightning';
import { Runestone } from '../spells/Runestone';
import { Spell, SpellContext } from '../spells/Spell';
import { UIManager } from '../ui/UIManager';
import { TowerType } from '../ui/TowerButton';
import { SpellType } from '../ui/SpellButton';
import { GameButtonType } from '../ui/GameButton';
import { resources } from '../resources/ResourceLoader';
import { SaveManager } from '../save/SaveManager';
import { MenuScene } from './MenuScene';
import {
    TILE_SIZE, GAME_WIDTH, GAME_HEIGHT,
    STARTING_GOLD, STARTING_MANA, STARTING_MANA_LEVEL3, MAX_MANA, STARTING_LIVES,
    TOWER_COSTS, POISON_DAMAGE_PER_TICK, POISON_TICK_INTERVAL, POISON_TICK_INTERVAL_FAST
} from '../game/constants';

type GameState = 'waiting' | 'playing' | 'paused' | 'won' | 'lost';

export class GameScene extends Scene {
    private levelIndex: number;
    private level!: Level;
    private waveManager!: WaveManager;

    private enemies: Enemy[] = [];
    private towers: Tower[] = [];
    private projectiles: Projectile[] = [];
    private areaEffects: AreaShot[] = [];

    private gold: number = STARTING_GOLD;
    private mana: number = STARTING_MANA;
    private lives: number = STARTING_LIVES;

    private gameState: GameState = 'waiting';
    private fastMode: boolean = false;

    private selectedTower: Tower | null = null;
    private placingTower: TowerType | null = null;
    private castingSpell: Spell | null = null;

    private poisonTimer: number = 0;
    private manaAccumulator: number = 0;

    private ui!: UIManager;
    private saveManager: SaveManager = new SaveManager();

    private mouseX: number = 0;
    private mouseY: number = 0;

    constructor(levelIndex: number) {
        super();
        this.levelIndex = levelIndex;
    }

    enter(): void {
        const levelData = resources.levelLoader.getLevel(this.levelIndex);
        if (!levelData) {
            console.error('Level not found:', this.levelIndex);
            return;
        }

        this.level = new Level(levelData);
        this.waveManager = new WaveManager(this.level);

        // Special mana for level 3
        if (this.levelIndex === 3) {
            this.mana = Math.min(STARTING_MANA_LEVEL3, MAX_MANA);
        }

        this.ui = new UIManager(
            (type) => this.onTowerSelect(type),
            (type) => this.onSpellSelect(type),
            () => this.onUpgrade(),
            () => this.onSell(),
            (type) => this.onGameAction(type)
        );
    }

    exit(): void {}

    update(deltaTime: number): void {
        if (this.gameState !== 'playing') return;

        // Double update in fast mode
        const iterations = this.fastMode ? 2 : 1;
        for (let i = 0; i < iterations; i++) {
            this.updateGame(deltaTime);
        }
    }

    private updateGame(deltaTime: number): void {
        // Check if we need to start the next wave
        // (current wave complete and all enemies dead)
        if (this.waveManager.isWaveComplete() &&
            this.enemies.filter(e => e.active).length === 0 &&
            !this.waveManager.isAllWavesComplete()) {
            this.waveManager.startNextWave();
        }

        // Update wave spawning
        const newEnemy = this.waveManager.update(deltaTime, this.fastMode);
        if (newEnemy) {
            this.enemies.push(newEnemy);
        }

        // Update enemies
        for (const enemy of this.enemies) {
            if (enemy.active) {
                enemy.update(deltaTime);

                // Check if reached target
                if (enemy.hasReachedTarget()) {
                    this.lives -= enemy.damage;
                    enemy.active = false;
                }
            }
        }

        // Update poison damage and mana
        this.updatePoison(deltaTime);

        // Update towers
        for (const tower of this.towers) {
            tower.update(deltaTime);
            tower.scan(this.enemies.filter(e => e.active && !e.isDead()));

            if (tower instanceof AreaTower) {
                const hits = tower.fireArea(this.enemies.filter(e => e.active && !e.isDead()));
                if (hits.length > 0) {
                    // Create area effect at tower position
                    this.areaEffects.push(new AreaShot(tower.centerX, tower.centerY));
                    for (const hit of hits) {
                        hit.enemy.takeDamage(hit.damage);
                        this.checkEnemyDeath(hit.enemy);
                    }
                }
            } else if (tower instanceof SpreadTower) {
                const projectiles = tower.fireMultiple(this.enemies.filter(e => e.active && !e.isDead()));
                this.projectiles.push(...projectiles);
            } else {
                const projectile = tower.fire();
                if (projectile) {
                    this.projectiles.push(projectile);
                }
            }
        }

        // Update projectiles
        for (const projectile of this.projectiles) {
            if (projectile.active) {
                projectile.update(deltaTime);
                if (!projectile.active && projectile.target) {
                    this.checkEnemyDeath(projectile.target);
                }
            }
        }

        // Update area effects
        for (const effect of this.areaEffects) {
            effect.update(deltaTime);
        }

        // Update spells (for visual effects)
        if (this.castingSpell instanceof Lightning) {
            this.castingSpell.update(deltaTime);
        }

        // Cleanup inactive objects
        this.enemies = this.enemies.filter(e => e.active);
        this.projectiles = this.projectiles.filter(p => p.active);
        this.areaEffects = this.areaEffects.filter(e => e.active);

        // Check win/lose conditions
        this.checkGameEnd();

        // Update UI button states
        this.ui.updateButtonStates(this.gold, this.mana);
    }

    private updatePoison(deltaTime: number): void {
        const interval = this.fastMode ? POISON_TICK_INTERVAL_FAST : POISON_TICK_INTERVAL;
        this.poisonTimer += deltaTime;

        if (this.poisonTimer >= interval) {
            this.poisonTimer = 0;

            for (const enemy of this.enemies) {
                if (enemy.active && enemy.poisonTicks > 0) {
                    enemy.takeDamage(POISON_DAMAGE_PER_TICK);
                    enemy.poisonTicks--;
                    this.manaAccumulator++;
                    this.checkEnemyDeath(enemy);
                }
            }

            // Grant mana every 2 poison ticks
            if (this.manaAccumulator >= 2) {
                this.mana = Math.min(this.mana + 1, MAX_MANA);
                this.manaAccumulator = 0;
            }
        }
    }

    private checkEnemyDeath(enemy: Enemy): void {
        if (enemy.isDead() && enemy.active) {
            enemy.active = false;
            this.gold += enemy.goldReward;
        }
    }

    private checkGameEnd(): void {
        if (this.lives <= 0) {
            this.gameState = 'lost';
            resources.soundManager.play('die');
            return;
        }

        // Check win condition: all waves complete and no enemies remaining
        // Note: this.enemies has already been filtered to only active enemies at this point
        const allWavesDone = this.waveManager.isAllWavesComplete();
        const noEnemiesLeft = this.enemies.length === 0;

        if (allWavesDone && noEnemiesLeft) {
            this.gameState = 'won';

            // Calculate stars (1 star per life remaining)
            const stars = this.lives;

            // Play appropriate sound
            if (stars >= 4) {
                resources.soundManager.play('verygood');
            } else {
                resources.soundManager.play('ok');
            }

            // Save progress
            this.saveManager.completeLevel(this.levelIndex, stars);
        }
    }

    handleClick(x: number, y: number): void {
        // Check UI clicks first
        if (x >= GAME_WIDTH) {
            if (this.ui.handleClick(x, y)) {
                return;
            }
        }

        // Game area clicks
        if (x < GAME_WIDTH && y < GAME_HEIGHT) {
            if (this.placingTower) {
                this.tryPlaceTower(x, y);
            } else if (this.castingSpell) {
                this.tryCastSpell(x, y);
            } else {
                this.handleGameClick(x, y);
            }
        }
    }

    handleRightClick(_x: number, _y: number): void {
        this.cancelAction();
    }

    handleMouseMove(x: number, y: number): void {
        this.mouseX = x;
        this.mouseY = y;
        this.ui.handleMouseMove(x, y);
    }

    handleKeyDown(key: string): void {
        if (key === 'Escape') {
            this.cancelAction();
        }
    }

    private cancelAction(): void {
        this.placingTower = null;
        this.castingSpell = null;
        this.selectedTower = null;
        this.ui.hideTowerActions();
    }

    private onTowerSelect(type: TowerType): void {
        if (this.gold >= TOWER_COSTS[type]) {
            this.placingTower = type;
            this.castingSpell = null;
            this.selectedTower = null;
            this.ui.hideTowerActions();
        }
    }

    private onSpellSelect(type: SpellType): void {
        this.castingSpell = type === 'Lightning' ? new Lightning() : new Runestone();
        this.placingTower = null;
        this.selectedTower = null;
        this.ui.hideTowerActions();
    }

    private onUpgrade(): void {
        if (!this.selectedTower) return;

        const cost = this.selectedTower.getUpgradeCost();
        if (this.gold >= cost && this.selectedTower.level < this.selectedTower.maxLevel) {
            this.gold -= cost;
            this.selectedTower.totalCost += cost;
            this.selectedTower.upgrade();
            this.ui.showTowerActions(
                this.selectedTower.getUpgradeCost(),
                this.selectedTower.getSellValue(),
                this.selectedTower.level < this.selectedTower.maxLevel,
                this.gold
            );
        }
    }

    private onSell(): void {
        if (!this.selectedTower) return;

        this.gold += this.selectedTower.getSellValue();
        this.towers = this.towers.filter(t => t !== this.selectedTower);
        resources.soundManager.play('sell');
        this.selectedTower = null;
        this.ui.hideTowerActions();
    }

    private onGameAction(type: GameButtonType): void {
        switch (type) {
            case 'start':
                if (this.gameState === 'waiting' || this.gameState === 'paused') {
                    if (!this.waveManager.hasStarted()) {
                        this.waveManager.startNextWave();
                    }
                    this.gameState = 'playing';
                    this.ui.setStartButtonLabel('Pause');
                } else if (this.gameState === 'playing') {
                    this.gameState = 'paused';
                    this.ui.setStartButtonLabel('Resume');
                }
                break;
            case 'fast':
                this.fastMode = !this.fastMode;
                this.ui.setFastButtonActive(this.fastMode);
                break;
            case 'menu':
                this.game.setScene(new MenuScene());
                break;
        }
    }

    private tryPlaceTower(x: number, y: number): void {
        if (!this.placingTower) return;

        const col = Math.floor(x / TILE_SIZE);
        const row = Math.floor(y / TILE_SIZE);

        if (!this.canPlaceTower(col, row)) return;

        const towerX = col * TILE_SIZE;
        const towerY = row * TILE_SIZE;

        let tower: Tower;
        switch (this.placingTower) {
            case 'Normal': tower = new NormalTower(towerX, towerY); break;
            case 'Area': tower = new AreaTower(towerX, towerY); break;
            case 'Spread': tower = new SpreadTower(towerX, towerY); break;
            case 'Poison': tower = new PoisonTower(towerX, towerY); break;
            default: return;
        }

        const cost = TOWER_COSTS[this.placingTower];
        this.gold -= cost;
        tower.totalCost = cost;
        this.towers.push(tower);

        resources.soundManager.play('build');
        this.placingTower = null;
    }

    private canPlaceTower(col: number, row: number): boolean {
        if (!this.level.isBuildable(col, row)) return false;

        // Check if tower already exists at this position
        const x = col * TILE_SIZE;
        const y = row * TILE_SIZE;
        for (const tower of this.towers) {
            if (tower.x === x && tower.y === y) return false;
        }

        return true;
    }

    private tryCastSpell(x: number, y: number): void {
        if (!this.castingSpell) return;

        const context: SpellContext = {
            enemies: this.enemies.filter(e => e.active && !e.isDead()),
            level: this.level,
            mana: this.mana,
            onEnemyKilled: (enemy) => {
                enemy.active = false;
                this.gold += enemy.goldReward;
            },
            onManaUsed: (amount) => {
                this.mana -= amount;
            },
            onTileChanged: (_col, _row) => {
                // Tile already changed in level
            }
        };

        if (this.castingSpell.canCastAt(x, y, context)) {
            this.castingSpell.cast(x, y, context);
            // Keep lightning for visual effect, clear runestone immediately
            if (!(this.castingSpell instanceof Lightning)) {
                this.castingSpell = null;
            }
        }
    }

    private handleGameClick(x: number, y: number): void {
        // Check for tower selection
        for (const tower of this.towers) {
            if (tower.bounds.contains(x, y)) {
                this.selectedTower = tower;
                resources.soundManager.play('select');
                this.ui.showTowerActions(
                    tower.getUpgradeCost(),
                    tower.getSellValue(),
                    tower.level < tower.maxLevel,
                    this.gold
                );
                return;
            }
        }

        // Deselect if clicked empty area
        this.selectedTower = null;
        this.ui.hideTowerActions();
    }

    render(ctx: CanvasRenderingContext2D): void {
        // Draw background
        const bgImg = resources.imageCache.get('background');
        if (bgImg) {
            ctx.drawImage(bgImg, 0, 0, GAME_WIDTH, GAME_HEIGHT);
        }

        // Draw level tiles
        this.level.render(ctx);

        // Draw towers
        for (const tower of this.towers) {
            tower.render(ctx);
        }

        // Draw selected tower highlight
        if (this.selectedTower) {
            this.selectedTower.renderSelection(ctx);
        }

        // Draw enemies
        for (const enemy of this.enemies) {
            if (enemy.active) {
                enemy.render(ctx);
            }
        }

        // Draw projectiles
        for (const projectile of this.projectiles) {
            if (projectile.active) {
                projectile.render(ctx);
            }
        }

        // Draw area effects
        for (const effect of this.areaEffects) {
            effect.render(ctx);
        }

        // Draw spell effects
        if (this.castingSpell instanceof Lightning) {
            this.castingSpell.render(ctx);
        }

        // Draw placement preview
        if (this.placingTower && this.mouseX < GAME_WIDTH) {
            this.renderTowerPreview(ctx);
        }

        // Draw spell preview
        if (this.castingSpell && this.mouseX < GAME_WIDTH) {
            this.renderSpellPreview(ctx);
        }

        // Draw UI
        this.ui.render(ctx);
        this.ui.renderStats(ctx, this.gold, this.mana, MAX_MANA, this.lives,
            this.waveManager.getCurrentWave(), this.waveManager.getTotalWaves());

        if (this.selectedTower) {
            this.ui.renderTowerInfo(ctx, this.selectedTower);
        }

        if (!this.waveManager.isAllWavesComplete()) {
            this.ui.renderWaveInfo(ctx, this.waveManager.getNextWaveInfo());
        }

        // Draw game over overlay
        if (this.gameState === 'won' || this.gameState === 'lost') {
            this.renderGameOver(ctx);
        }
    }

    private renderTowerPreview(ctx: CanvasRenderingContext2D): void {
        const col = Math.floor(this.mouseX / TILE_SIZE);
        const row = Math.floor(this.mouseY / TILE_SIZE);
        const x = col * TILE_SIZE;
        const y = row * TILE_SIZE;
        const valid = this.canPlaceTower(col, row);

        // Draw tower preview
        const imageKey = `${this.placingTower!.toLowerCase()}tower`;
        const img = resources.imageCache.get(imageKey);
        if (img) {
            ctx.globalAlpha = 0.7;
            ctx.drawImage(img, x, y, TILE_SIZE, TILE_SIZE);
            ctx.globalAlpha = 1.0;
        }

        // Draw X if invalid
        if (!valid) {
            const crossImg = resources.imageCache.get('cross');
            if (crossImg) {
                ctx.drawImage(crossImg, x, y, TILE_SIZE, TILE_SIZE);
            }
        }

        // Draw range circle
        const ranges: Record<string, number> = {
            'Normal': 140, 'Area': 80, 'Spread': 140, 'Poison': 120
        };
        const range = ranges[this.placingTower!] || 100;
        const rangeImg = resources.imageCache.get(`range${range}`);
        if (rangeImg) {
            ctx.globalAlpha = 0.3;
            ctx.drawImage(rangeImg, x + TILE_SIZE/2 - range, y + TILE_SIZE/2 - range, range * 2, range * 2);
            ctx.globalAlpha = 1.0;
        }
    }

    private renderSpellPreview(ctx: CanvasRenderingContext2D): void {
        if (!this.castingSpell) return;

        const context: SpellContext = {
            enemies: this.enemies,
            level: this.level,
            mana: this.mana,
            onEnemyKilled: () => {},
            onManaUsed: () => {},
            onTileChanged: () => {}
        };

        const valid = this.castingSpell.canCastAt(this.mouseX, this.mouseY, context);
        this.castingSpell.renderPreview(ctx, this.mouseX, this.mouseY, valid);
    }

    private renderGameOver(ctx: CanvasRenderingContext2D): void {
        ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
        ctx.fillRect(0, 0, GAME_WIDTH, GAME_HEIGHT);

        ctx.textAlign = 'center';

        if (this.gameState === 'won') {
            ctx.fillStyle = '#FFD700';
            ctx.font = 'bold 48px Times New Roman';
            ctx.fillText('Victory!', GAME_WIDTH / 2, GAME_HEIGHT / 2 - 30);

            const stars = this.lives;
            ctx.font = '36px Times New Roman';
            ctx.fillText('\u2605'.repeat(stars) + '\u2606'.repeat(5 - stars), GAME_WIDTH / 2, GAME_HEIGHT / 2 + 20);
        } else {
            ctx.fillStyle = '#FF4444';
            ctx.font = 'bold 48px Times New Roman';
            ctx.fillText('Defeat', GAME_WIDTH / 2, GAME_HEIGHT / 2 - 30);
        }

        ctx.fillStyle = 'white';
        ctx.font = '18px Times New Roman';
        ctx.fillText('Click Menu to return', GAME_WIDTH / 2, GAME_HEIGHT / 2 + 70);

        ctx.textAlign = 'left';
    }
}
