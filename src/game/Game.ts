import { GameLoop } from './GameLoop';
import { CANVAS_WIDTH, CANVAS_HEIGHT } from './constants';
import { Scene } from '../scenes/Scene';

export class Game {
    canvas: HTMLCanvasElement;
    ctx: CanvasRenderingContext2D;
    private gameLoop: GameLoop;
    private currentScene: Scene | null = null;
    private mouseX: number = 0;
    private mouseY: number = 0;

    constructor(canvasId: string) {
        const canvas = document.getElementById(canvasId) as HTMLCanvasElement;
        if (!canvas) throw new Error(`Canvas with id '${canvasId}' not found`);

        this.canvas = canvas;
        this.canvas.width = CANVAS_WIDTH;
        this.canvas.height = CANVAS_HEIGHT;

        const ctx = this.canvas.getContext('2d');
        if (!ctx) throw new Error('Could not get 2D context');
        this.ctx = ctx;

        this.gameLoop = new GameLoop(
            (dt) => this.update(dt),
            () => this.render()
        );

        this.setupEventListeners();
    }

    private setupEventListeners(): void {
        this.canvas.addEventListener('click', (e) => this.handleClick(e));
        this.canvas.addEventListener('mousemove', (e) => this.handleMouseMove(e));
        this.canvas.addEventListener('contextmenu', (e) => {
            e.preventDefault();
            this.handleRightClick(e);
        });
        window.addEventListener('keydown', (e) => this.handleKeyDown(e));
    }

    private getCanvasCoordinates(e: MouseEvent): { x: number; y: number } {
        const rect = this.canvas.getBoundingClientRect();
        const scaleX = this.canvas.width / rect.width;
        const scaleY = this.canvas.height / rect.height;
        return {
            x: (e.clientX - rect.left) * scaleX,
            y: (e.clientY - rect.top) * scaleY
        };
    }

    private handleClick(e: MouseEvent): void {
        const { x, y } = this.getCanvasCoordinates(e);
        this.currentScene?.handleClick(x, y);
    }

    private handleRightClick(e: MouseEvent): void {
        const { x, y } = this.getCanvasCoordinates(e);
        this.currentScene?.handleRightClick(x, y);
    }

    private handleMouseMove(e: MouseEvent): void {
        const { x, y } = this.getCanvasCoordinates(e);
        this.mouseX = x;
        this.mouseY = y;
        this.currentScene?.handleMouseMove(x, y);
    }

    private handleKeyDown(e: KeyboardEvent): void {
        this.currentScene?.handleKeyDown(e.key);
    }

    setScene(scene: Scene): void {
        this.currentScene?.exit();
        this.currentScene = scene;
        this.currentScene.game = this;
        this.currentScene.enter();
    }

    private update(deltaTime: number): void {
        this.currentScene?.update(deltaTime);
    }

    private render(): void {
        this.ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
        this.currentScene?.render(this.ctx);
    }

    start(): void {
        this.gameLoop.start();
    }

    stop(): void {
        this.gameLoop.stop();
    }

    getMousePosition(): { x: number; y: number } {
        return { x: this.mouseX, y: this.mouseY };
    }
}
