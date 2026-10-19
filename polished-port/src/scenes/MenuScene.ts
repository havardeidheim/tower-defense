import { Rectangle } from '../core/Rectangle';
import { CANVAS_HEIGHT, CANVAS_WIDTH, TILE_PATH, TILE_SPAWN, TILE_TARGET } from '../game/constants';
import {
  COLOR_BACKGROUND, COLOR_BLACK, COLOR_DARK_GRAY, COLOR_GRAY, COLOR_MAP_SPAWN, COLOR_ORANGE, FONT_TITLE,
} from '../game/theme';
import { resources } from '../resources/ResourceLoader';
import { SaveManager } from '../save/SaveManager';
import { drawText } from '../ui/draw';
import { GameScene } from './GameScene';
import { Scene } from './Scene';

const PREVIEW_TILE = 8;
const PREVIEW_Y = 300;
const MAX_STARS = 5;

function previewX(index: number): number {
  return 50 + index * 200;
}

/** The level select screen: a small map per level and its stars. Every level can be played. */
export class MenuScene extends Scene {
  private readonly progress = new SaveManager(resources.levels.count).load();

  private previewBounds(index: number): Rectangle {
    const map = resources.levels.getData(index).map;
    return new Rectangle(previewX(index), PREVIEW_Y, map[0].length * PREVIEW_TILE, map.length * PREVIEW_TILE);
  }

  onClick(x: number, y: number): void {
    for (let i = 0; i < resources.levels.count; i++) {
      if (this.previewBounds(i).contains(x, y)) {
        resources.sounds.play('knapp');
        this.game.setScene(new GameScene(i));
        return;
      }
    }
  }

  render(ctx: CanvasRenderingContext2D): void {
    ctx.fillStyle = COLOR_BACKGROUND;
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    resources.images.draw(ctx, 'background', 0, 0);

    drawText(ctx, 'Road Defender: Revenge of the Road', 50, 150, COLOR_BLACK, FONT_TITLE);
    drawText(ctx, 'Laget av Håvard Eidheim. Lyd fra Empire Earth.', CANVAS_WIDTH - 328, CANVAS_HEIGHT - 4, COLOR_BLACK);

    const { stars } = this.progress;
    for (let i = 0; i < resources.levels.count; i++) {
      const data = resources.levels.getData(i);
      const x = previewX(i);
      drawText(ctx, data.name, x, PREVIEW_Y - 5, COLOR_BLACK);

      for (let s = 0; s < MAX_STARS; s++) {
        drawText(ctx, '*', x + 10 * s, 420, s < stars[i] ? COLOR_ORANGE : COLOR_DARK_GRAY);
      }

      data.map.forEach((row, r) => {
        for (let c = 0; c < row.length; c++) {
          const tile = row[c];
          ctx.fillStyle =
            tile === TILE_PATH || tile === TILE_TARGET ? COLOR_DARK_GRAY : tile === TILE_SPAWN ? COLOR_MAP_SPAWN : COLOR_GRAY;
          ctx.fillRect(x + PREVIEW_TILE * c, PREVIEW_Y + PREVIEW_TILE * r, PREVIEW_TILE, PREVIEW_TILE);
        }
      });
    }
  }
}
