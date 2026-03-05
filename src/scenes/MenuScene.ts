import { Scene } from './Scene';
import { resources } from '../resources/ResourceLoader';
import { SaveManager } from '../save/SaveManager';
import { CANVAS_WIDTH, CANVAS_HEIGHT, TILE_PATH, TILE_TARGET, TILE_SPAWN } from '../game/constants';
import { GameScene } from './GameScene';
import { Rectangle } from '../core/Rectangle';
import {
    COLOR_GOLD, COLOR_TEXT_BLACK, COLOR_MENU_BG, COLOR_MAP_PATH, COLOR_MAP_SPAWN, COLOR_MAP_TILE,
    FONT_TITLE_LG, FONT_MENU_LABEL,
} from '../game/theme';

interface LevelButton {
    bounds: Rectangle;
    levelIndex: number;
    name: string;
    unlocked: boolean;
    stars: number;
    map: string[][];
}

const TILE_PX = 8;
const LEVEL_SPACING = 200;
const LEVEL_START_X = 50;
const MAP_Y = 300;

export class MenuScene extends Scene {
    private levelButtons: LevelButton[] = [];
    private saveManager: SaveManager = new SaveManager();
    private hoveredLevel: number = -1;

    enter(): void {
        this.createLevelButtons();
    }

    exit(): void {}

    private createLevelButtons(): void {
        const levels = resources.levelLoader.getAllLevels();
        const saveData = this.saveManager.load();

        levels.forEach((level, index) => {
            const mapWidth = (level.map[0]?.length || 16) * TILE_PX;
            const mapHeight = level.map.length * TILE_PX;

            this.levelButtons.push({
                bounds: new Rectangle(
                    LEVEL_START_X + index * LEVEL_SPACING,
                    MAP_Y,
                    mapWidth,
                    mapHeight
                ),
                levelIndex: index,
                name: level.name,
                unlocked: saveData.levelsUnlocked[index] || index === 0,
                stars: saveData.starsEarned[index] || 0,
                map: level.map
            });
        });
    }

    update(_deltaTime: number): void {}

    handleClick(x: number, y: number): void {
        for (const button of this.levelButtons) {
            if (button.bounds.contains(x, y) && button.unlocked) {
                resources.soundManager.play('knapp');
                this.startLevel(button.levelIndex);
                return;
            }
        }
    }

    handleMouseMove(x: number, y: number): void {
        this.hoveredLevel = -1;
        for (const button of this.levelButtons) {
            if (button.bounds.contains(x, y) && button.unlocked) {
                this.hoveredLevel = button.levelIndex;
                return;
            }
        }
    }

    private startLevel(levelIndex: number): void {
        const level = resources.levelLoader.getLevel(levelIndex);
        if (level) {
            const sounds = ['endiscoming', 'forseevictory', 'noonealive', 'letsgo'];
            if (sounds[levelIndex]) {
                resources.soundManager.play(sounds[levelIndex]);
            }
            this.game.setScene(new GameScene(levelIndex));
        }
    }

    render(ctx: CanvasRenderingContext2D): void {
        // Background
        const bgImg = resources.imageCache.get('background');
        if (bgImg) {
            ctx.drawImage(bgImg, 0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
        } else {
            ctx.fillStyle = COLOR_MENU_BG;
            ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
        }

        // Title
        ctx.fillStyle = COLOR_TEXT_BLACK;
        ctx.font = FONT_TITLE_LG;
        ctx.textAlign = 'center';
        ctx.fillText('Road Defender', CANVAS_WIDTH / 2, 150);

        // Level previews
        for (const button of this.levelButtons) {
            this.renderLevelPreview(ctx, button);
        }

        // Attribution
        ctx.fillStyle = COLOR_TEXT_BLACK;
        ctx.font = FONT_MENU_LABEL;
        ctx.textAlign = 'right';
        ctx.fillText('Laget av Håvard Eidheim. Lyd fra Empire Earth.', CANVAS_WIDTH - 10, CANVAS_HEIGHT - 4);
        ctx.textAlign = 'left';
    }

    private renderLevelPreview(ctx: CanvasRenderingContext2D, button: LevelButton): void {
        const { bounds, name, unlocked, stars, map } = button;
        const baseX = bounds.x;
        const baseY = bounds.y;
        const hovered = this.hoveredLevel === button.levelIndex;

        // Level name above map
        ctx.fillStyle = COLOR_TEXT_BLACK;
        ctx.font = FONT_MENU_LABEL;
        ctx.textAlign = 'left';
        ctx.fillText(name, baseX, baseY - 5);

        // Draw map preview — small colored tiles
        for (let row = 0; row < map.length; row++) {
            for (let col = 0; col < (map[row]?.length || 0); col++) {
                const char = map[row][col];
                if (char === TILE_PATH || char === TILE_TARGET) {
                    ctx.fillStyle = COLOR_MAP_PATH;
                } else if (char === TILE_SPAWN) {
                    ctx.fillStyle = COLOR_MAP_SPAWN;
                } else {
                    ctx.fillStyle = COLOR_MAP_TILE;
                }
                ctx.fillRect(baseX + TILE_PX * col, baseY + TILE_PX * row, TILE_PX, TILE_PX);
            }
        }

        // Locked overlay
        if (!unlocked) {
            const mapcross = resources.imageCache.get('mapcross');
            if (mapcross) {
                ctx.drawImage(mapcross, baseX, baseY);
            }
        }

        // Stars below map
        const mapWidth = (map[0]?.length || 16) * TILE_PX;
        const starSpacing = mapWidth / 5;
        const starY = baseY + map.length * TILE_PX + 28;
        ctx.font = `${starSpacing}px Times New Roman`;
        ctx.textAlign = 'center';
        for (let i = 0; i < 5; i++) {
            ctx.fillStyle = i < stars ? COLOR_GOLD : COLOR_MAP_PATH;
            ctx.fillText('\u2605', baseX + starSpacing * i + starSpacing / 2, starY);
        }

        // Hover highlight for unlocked levels
        if (hovered && unlocked) {
            ctx.strokeStyle = COLOR_GOLD;
            ctx.lineWidth = 2;
            ctx.strokeRect(baseX - 2, baseY - 2, bounds.width + 4, bounds.height + 4);
        }
    }
}
