/** Thin wrapper over the canvas that mimics the java.awt.Graphics calls the original used. */

export const Color = {
  BLACK: '#000000',
  RED: '#ff0000',
  GREEN: '#00ff00',
  BLUE: '#0000ff',
  ORANGE: '#ffc800',
  GRAY: '#808080',
  DARK_GRAY: '#404040',
} as const;

export function font(sizePx: number): string {
  return `bold ${sizePx}px "Times New Roman", Times, "Liberation Serif", serif`;
}

export class Graphics {
  constructor(public ctx: CanvasRenderingContext2D) {}

  setColor(c: string): void {
    this.ctx.fillStyle = c;
    this.ctx.strokeStyle = c;
  }

  setFont(f: string): void {
    this.ctx.font = f;
  }

  drawString(s: string, x: number, y: number): void {
    this.ctx.fillText(s, x, y);
  }

  drawImage(img: HTMLImageElement | undefined | null, x: number, y: number, w?: number, h?: number): void {
    if (!img) return; // Java's drawImage(null, ...) silently draws nothing
    if (w === undefined || h === undefined) {
      this.ctx.drawImage(img, x, y);
    } else {
      this.ctx.drawImage(img, x, y, w, h);
    }
  }

  drawLine(x1: number, y1: number, x2: number, y2: number): void {
    const c = this.ctx;
    c.lineWidth = 1;
    c.beginPath();
    c.moveTo(x1 + 0.5, y1 + 0.5);
    c.lineTo(x2 + 0.5, y2 + 0.5);
    c.stroke();
  }

  drawRect(x: number, y: number, w: number, h: number): void {
    this.ctx.lineWidth = 1;
    this.ctx.strokeRect(x + 0.5, y + 0.5, w, h);
  }

  fillRect(x: number, y: number, w: number, h: number): void {
    if (w <= 0 || h <= 0) return;
    this.ctx.fillRect(x, y, w, h);
  }
}

export class Rect {
  constructor(public x: number, public y: number, public w: number, public h: number) {}

  /** Same edge rules as java.awt.Rectangle.contains(x, y). */
  contains(px: number, py: number): boolean {
    return px >= this.x && py >= this.y && px < this.x + this.w && py < this.y + this.h;
  }
}

/** Java integer division / (int) cast. */
export function idiv(a: number, b: number): number {
  return Math.trunc(a / b);
}

/** Formats a double the way Java's string concatenation does ("2.0", not "2"). */
export function jdouble(v: number): string {
  return Number.isInteger(v) ? v.toFixed(1) : String(v);
}
