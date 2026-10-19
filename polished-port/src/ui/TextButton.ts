import { Rectangle } from '../core/Rectangle';
import { COLOR_ORANGE } from '../game/theme';
import { resources } from '../resources/ResourceLoader';
import { drawText } from './draw';

/** A plain labelled button. */
export class TextButton {
  readonly bounds: Rectangle;

  constructor(
    x: number,
    y: number,
    public label: string,
    private readonly action: () => void,
  ) {
    this.bounds = new Rectangle(x, y, 70, 30);
  }

  click(): void {
    resources.sounds.play('knapp');
    this.action();
  }

  render(ctx: CanvasRenderingContext2D): void {
    const { x, y } = this.bounds;
    resources.images.draw(ctx, 'blancknapp', x, y);
    drawText(ctx, this.label, x + 8, y + 20, COLOR_ORANGE);
  }
}
