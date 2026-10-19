import type { Scene } from '../scenes/Scene';
import { CANVAS_HEIGHT, CANVAS_WIDTH } from './constants';
import { GameLoop } from './GameLoop';

export interface Point {
  x: number;
  y: number;
}

/**
 * Owns the canvas, the loop and the current scene. The canvas keeps the original
 * 850x480 coordinate system and is scaled to fit the window; input is mapped back
 * to those coordinates.
 */
export class Game {
  private readonly ctx: CanvasRenderingContext2D;
  private readonly loop: GameLoop;
  private scene: Scene | null = null;
  private scale = 1;
  /** Where the mouse is over the game, or null when it is outside. */
  mouse: Point | null = null;

  constructor(private readonly canvas: HTMLCanvasElement) {
    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('Canvas 2D is not available');
    this.ctx = ctx;
    this.loop = new GameLoop(
      () => this.scene?.tick(),
      () => this.render(),
    );
    this.resize();
    window.addEventListener('resize', () => this.resize());
    this.listen();
  }

  setScene(scene: Scene): void {
    scene.game = this;
    this.scene = scene;
    scene.enter();
  }

  start(): void {
    this.loop.start();
  }

  private resize(): void {
    const fit = Math.min(window.innerWidth / CANVAS_WIDTH, window.innerHeight / CANVAS_HEIGHT);
    const dpr = window.devicePixelRatio || 1;
    this.canvas.style.width = `${Math.floor(CANVAS_WIDTH * fit)}px`;
    this.canvas.style.height = `${Math.floor(CANVAS_HEIGHT * fit)}px`;
    this.canvas.width = Math.round(CANVAS_WIDTH * fit * dpr);
    this.canvas.height = Math.round(CANVAS_HEIGHT * fit * dpr);
    this.scale = fit * dpr;
  }

  private render(): void {
    const ctx = this.ctx;
    ctx.setTransform(this.scale, 0, 0, this.scale, 0, 0);
    ctx.imageSmoothingEnabled = true;
    ctx.textBaseline = 'alphabetic';
    ctx.textAlign = 'left';
    this.scene?.render(ctx);
  }

  private toGame(e: MouseEvent): Point | null {
    const r = this.canvas.getBoundingClientRect();
    const x = Math.floor(((e.clientX - r.left) / r.width) * CANVAS_WIDTH);
    const y = Math.floor(((e.clientY - r.top) / r.height) * CANVAS_HEIGHT);
    if (x < 0 || y < 0 || x >= CANVAS_WIDTH || y >= CANVAS_HEIGHT) return null;
    return { x, y };
  }

  private listen(): void {
    const c = this.canvas;
    c.addEventListener('contextmenu', (e) => e.preventDefault());
    c.addEventListener('pointermove', (e) => {
      this.mouse = this.toGame(e);
    });
    c.addEventListener('pointerleave', () => {
      this.mouse = null;
    });
    c.addEventListener('pointerdown', (e) => {
      const p = this.toGame(e);
      this.mouse = p;
      if (p) this.scene?.onPointerDown(p.x, p.y, e.button);
    });
    c.addEventListener('click', (e) => {
      const p = this.toGame(e);
      if (p) this.scene?.onClick(p.x, p.y);
    });
  }
}
