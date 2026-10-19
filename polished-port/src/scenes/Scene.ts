import type { Game } from '../game/Game';

/** A screen of the game. The game forwards ticks, rendering and input to the current scene. */
export abstract class Scene {
  game!: Game;

  enter(): void {}

  /** One fixed 20 ms step. */
  tick(): void {}

  abstract render(ctx: CanvasRenderingContext2D): void;

  /** Mouse button pressed. button: 0 left, 1 middle, 2 right. */
  onPointerDown(_x: number, _y: number, _button: number): void {}

  /** A full click (press and release). */
  onClick(_x: number, _y: number): void {}
}
