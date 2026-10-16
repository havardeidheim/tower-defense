import type { Game } from '../game/Game';

export abstract class Scene {
    game!: Game;

    abstract enter(): void;
    abstract exit(): void;
    abstract update(deltaTime: number): void;
    abstract render(ctx: CanvasRenderingContext2D): void;

    handleClick(_x: number, _y: number): void {}
    handleRightClick(_x: number, _y: number): void {}
    handleMouseMove(_x: number, _y: number): void {}
    handleKeyDown(_key: string): void {}
}
