import { TILE_SIZE } from '../game/constants';
import { resources } from '../resources/ResourceLoader';
import type { World } from '../world/World';
import type { Spell } from './Spell';

/** Place foundation: turns an obstacle tile into a foundation that a tower can be built on. */
export const Runestone: Spell = {
  type: 'Runestone',
  icon: 'blanctower',
  description: [
    'Place foundation', '', '', 'Places a foundation on', 'the ground, allowing you',
    'to build a tower on it.',
  ],

  cast(world: World, x: number, y: number): boolean {
    if (!world.placeFoundation(Math.trunc(x / TILE_SIZE), Math.trunc(y / TILE_SIZE))) return false;
    resources.sounds.play('build');
    return true;
  },

  renderPreview(ctx: CanvasRenderingContext2D, world: World, x: number, y: number): void {
    const col = Math.trunc(x / TILE_SIZE);
    const row = Math.trunc(y / TILE_SIZE);
    resources.images.draw(ctx, 'blanctower', col * TILE_SIZE, row * TILE_SIZE);
    if (!world.level.isObstacle(col, row) || world.towerAt(col, row)) {
      resources.images.draw(ctx, 'cross', col * TILE_SIZE, row * TILE_SIZE);
    }
  },
};
