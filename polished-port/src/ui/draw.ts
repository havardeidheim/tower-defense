import { FONT } from '../game/theme';

/** Text at a baseline position, in the game's font. */
export function drawText(ctx: CanvasRenderingContext2D, text: string, x: number, y: number, color: string, font = FONT): void {
  ctx.font = font;
  ctx.fillStyle = color;
  ctx.fillText(text, x, y);
}

/** A crisp one-pixel line between pixel positions. */
export function drawLine(ctx: CanvasRenderingContext2D, x1: number, y1: number, x2: number, y2: number, color: string): void {
  ctx.strokeStyle = color;
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(x1 + 0.5, y1 + 0.5);
  ctx.lineTo(x2 + 0.5, y2 + 0.5);
  ctx.stroke();
}

/** A one-pixel outline that covers width + 1 by height + 1 pixels. */
export function drawOutline(ctx: CanvasRenderingContext2D, x: number, y: number, width: number, height: number, color: string): void {
  ctx.strokeStyle = color;
  ctx.lineWidth = 1;
  ctx.strokeRect(x + 0.5, y + 0.5, width, height);
}

/** Lines of text, one every 15 px. */
export function drawLines(ctx: CanvasRenderingContext2D, lines: readonly string[], x: number, y: number, color: string): void {
  lines.forEach((line, i) => drawText(ctx, line, x, y + 15 * i, color));
}
