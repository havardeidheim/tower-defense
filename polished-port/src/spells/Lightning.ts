import { resources } from '../resources/ResourceLoader';
import type { World } from '../world/World';
import type { Spell } from './Spell';

/** Lightningbolt: stuns one enemy and deals 200 damage. Nothing resists it. */
export const Lightning: Spell = {
  type: 'Lightning',
  icon: 'lightningknapp',
  description: [
    'Lightningbolt', '', '', 'Stuns and damages a single', 'enemy. Killing normal',
    'enemies outright', '', "Can't be dodged",
  ],

  cast(world: World, x: number, y: number): boolean {
    if (!world.castLightning(x, y)) return false;
    resources.sounds.play('lightning');
    return true;
  },

  renderPreview(ctx: CanvasRenderingContext2D, _world: World, x: number, y: number): void {
    // The bolt hangs up and to the left of the mouse.
    resources.images.draw(ctx, 'lightning', x - 20, y - 40);
  },
};
