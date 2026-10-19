import { CANVAS_HEIGHT, CANVAS_WIDTH } from '../game/constants';
import { COLOR_BACKGROUND, COLOR_BLACK, COLOR_ORANGE, COLOR_RED, FONT_TITLE } from '../game/theme';
import { resources } from '../resources/ResourceLoader';
import { drawOutline, drawText } from '../ui/draw';
import { MenuScene } from './MenuScene';
import { Scene } from './Scene';

/** Shown while images, sounds and levels load. */
export class LoadingScene extends Scene {
  private done = 0;
  private total = 1;
  private error: string | null = null;

  enter(): void {
    resources
      .loadAll((done, total) => {
        this.done = done;
        this.total = total;
      })
      .then(() => this.game.setScene(new MenuScene()))
      .catch((e: unknown) => {
        this.error = `Could not load the game: ${String(e)}`;
      });
  }

  render(ctx: CanvasRenderingContext2D): void {
    ctx.fillStyle = COLOR_BACKGROUND;
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    if (this.error) {
      drawText(ctx, this.error, 50, 240, COLOR_RED);
      return;
    }
    drawText(ctx, 'Road Defender: Revenge of the Road', 50, 150, COLOR_BLACK, FONT_TITLE);
    drawText(ctx, `Loading... ${this.done}/${this.total}`, 50, 290, COLOR_BLACK);
    drawOutline(ctx, 50, 300, 750, 20, COLOR_BLACK);
    ctx.fillStyle = COLOR_ORANGE;
    ctx.fillRect(52, 302, Math.round((746 * this.done) / Math.max(this.total, 1)), 17);
  }
}
