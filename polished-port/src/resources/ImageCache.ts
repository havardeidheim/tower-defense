export class ImageCache {
  private images = new Map<string, HTMLImageElement>();

  set(key: string, image: HTMLImageElement): void {
    this.images.set(key, image);
  }

  get(key: string): HTMLImageElement | undefined {
    return this.images.get(key);
  }

  /** Draws an image at its own size, or scaled to width x height. Missing images draw nothing. */
  draw(ctx: CanvasRenderingContext2D, key: string, x: number, y: number, width?: number, height?: number): void {
    const img = this.images.get(key);
    if (!img) return;
    if (width === undefined || height === undefined) {
      ctx.drawImage(img, x, y);
    } else {
      ctx.drawImage(img, x, y, width, height);
    }
  }
}
