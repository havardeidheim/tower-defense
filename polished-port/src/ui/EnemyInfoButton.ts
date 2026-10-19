import { Rectangle } from '../core/Rectangle';
import type { EnemyType } from '../entities/enemies/EnemyTypes';
import { ENEMY_SIZE } from '../game/constants';
import { COLOR_TEXT } from '../game/theme';
import { resources } from '../resources/ResourceLoader';
import { drawText } from './draw';

/** An enemy in the "next wave" panel: how many come next, and its description on hover. */
export class EnemyInfoButton {
  readonly bounds: Rectangle;

  constructor(
    x: number,
    y: number,
    readonly type: EnemyType,
  ) {
    this.bounds = new Rectangle(x, y, ENEMY_SIZE, ENEMY_SIZE);
  }

  render(ctx: CanvasRenderingContext2D, count: number): void {
    const { x, y } = this.bounds;
    resources.images.draw(ctx, `${this.type.sprite}u`, x, y);
    drawText(ctx, `${count} x `, x - 30, y + 16, COLOR_TEXT);
  }
}
