import type { Game } from '../game/Game';

export abstract class Scene {
    game!: Game;

    abstract enter(): void;
    abstract exit(): void;
    abstract update(deltaTime: number): void;
    abstract render(ctx: CanvasRenderingContext2D): void;

    handleClick(x: number, y: number): void {}
    handleRightClick(x: number, y: number): void {}
    handleMouseMove(x: number, y: number): void {}
    handleKeyDown(key: string): void {}
}
