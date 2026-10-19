import { Rectangle } from '../core/Rectangle';
import { COLOR_TEXT } from '../game/theme';
import { resources } from '../resources/ResourceLoader';
import { drawLines, drawOutline } from './draw';
import { TextButton } from './TextButton';

/** The paged "how to play" window over the map, with the text from info.txt. */
export class HelpOverlay {
  readonly bounds = new Rectangle(100, 100, 400, 300);
  private page = 0;
  private readonly buttons: TextButton[];

  constructor(
    private readonly pages: readonly (readonly string[])[],
    onClose: () => void,
  ) {
    const { x, y } = this.bounds;
    this.buttons = [
      new TextButton(x + 10, y + 260, 'Back', () => {
        if (this.page > 0) this.page--;
      }),
      new TextButton(x + 90, y + 260, 'Next', () => {
        if (this.page < this.pages.length - 1) this.page++;
      }),
      new TextButton(x + 210, y + 260, 'tl:dr', () => {
        this.page = this.pages.length - 1;
      }),
      new TextButton(x + 320, y + 260, 'Close', onClose),
    ];
  }

  /** Back to the first page. */
  rewind(): void {
    this.page = 0;
  }

  /** Handles a click. Clicks anywhere on the window are taken, so they do not reach the map below. */
  click(x: number, y: number): boolean {
    const button = this.buttons.find((b) => b.bounds.contains(x, y));
    if (button) {
      button.click();
      return true;
    }
    return this.bounds.contains(x, y);
  }

  render(ctx: CanvasRenderingContext2D): void {
    const { x, y, width, height } = this.bounds;
    resources.images.draw(ctx, 'helpback', x, y, width, height);
    drawOutline(ctx, x + 2, y + 2, width - 4, height - 4, COLOR_TEXT);
    drawOutline(ctx, x, y, width, height, COLOR_TEXT);
    drawLines(ctx, this.pages[this.page] ?? [], x + 10, y + 20, COLOR_TEXT);
    for (const b of this.buttons) b.render(ctx);
  }
}
