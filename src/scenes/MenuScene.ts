import { Scene } from './Scene';
import { resources } from '../resources/ResourceLoader';
import { SaveManager } from '../save/SaveManager';
import { CANVAS_WIDTH, CANVAS_HEIGHT } from '../game/constants';
import { GameScene } from './GameScene';
import { Rectangle } from '../core/Rectangle';

interface LevelButton {
    bounds: Rectangle;
    levelIndex: number;
    name: string;
    unlocked: boolean;
    stars: number;
}

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

        const startY = 180;
        const buttonHeight = 60;
        const spacing = 20;

        levels.forEach((level, index) => {
            this.levelButtons.push({
                bounds: new Rectangle(
                    CANVAS_WIDTH / 2 - 150,
                    startY + index * (buttonHeight + spacing),
                    300,
                    buttonHeight
                ),
                levelIndex: index,
                name: level.name,
                unlocked: saveData.levelsUnlocked[index] || index === 0,
                stars: saveData.starsEarned[index] || 0
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
            // Play level start sound
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
            ctx.fillStyle = '#1a1a2e';
            ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
        }

        // Semi-transparent overlay
        ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
        ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

        // Title
        ctx.fillStyle = '#FFD700';
        ctx.font = 'bold 36px Times New Roman';
        ctx.textAlign = 'center';
        ctx.fillText('Road Defender', CANVAS_WIDTH / 2, 80);

        ctx.fillStyle = '#888';
        ctx.font = '20px Times New Roman';
        ctx.fillText('Select Level', CANVAS_WIDTH / 2, 120);

        // Level buttons
        for (const button of this.levelButtons) {
            this.renderLevelButton(ctx, button);
        }

        ctx.textAlign = 'left';
    }

    private renderLevelButton(ctx: CanvasRenderingContext2D, button: LevelButton): void {
        const { bounds, name, unlocked, stars, levelIndex } = button;
        const hovered = this.hoveredLevel === levelIndex;

        // Button background
        ctx.fillStyle = unlocked
            ? (hovered ? '#3a3a5a' : '#2a2a4a')
            : '#1a1a2a';
        ctx.fillRect(bounds.x, bounds.y, bounds.width, bounds.height);

        // Border
        ctx.strokeStyle = hovered && unlocked ? '#FFD700' : '#444';
        ctx.lineWidth = 2;
        ctx.strokeRect(bounds.x, bounds.y, bounds.width, bounds.height);

        // Level name
        ctx.fillStyle = unlocked ? 'white' : '#666';
        ctx.font = 'bold 18px Times New Roman';
        ctx.textAlign = 'left';
        ctx.fillText(`${levelIndex + 1}. ${name}`, bounds.x + 15, bounds.y + 25);

        // Stars
        if (unlocked && stars > 0) {
            ctx.fillStyle = '#FFD700';
            ctx.font = '20px Times New Roman';
            const starStr = '\u2605'.repeat(stars) + '\u2606'.repeat(3 - stars);
            ctx.textAlign = 'right';
            ctx.fillText(starStr, bounds.right - 15, bounds.y + 25);
        }

        // Locked indicator
        if (!unlocked) {
            ctx.fillStyle = '#666';
            ctx.font = '14px Times New Roman';
            ctx.textAlign = 'center';
            ctx.fillText('Locked', bounds.centerX, bounds.y + 45);
        } else {
            ctx.fillStyle = '#888';
            ctx.font = '12px Times New Roman';
            ctx.textAlign = 'left';
            ctx.fillText('Click to play', bounds.x + 15, bounds.y + 45);
        }
    }
}
