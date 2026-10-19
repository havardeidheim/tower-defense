import type { World } from '../world/World';

export type SpellType = 'Lightning' | 'Runestone';

/** A spell costs mana and is cast by clicking the map. */
export interface Spell {
  readonly type: SpellType;
  /** Image of the build button. */
  readonly icon: string;
  /** Shown when hovering the build button. */
  readonly description: readonly string[];
  /** Tries to cast at a point on the map. Returns true if the spell was cast. */
  cast(world: World, x: number, y: number): boolean;
  /** Drawn under the mouse while the player picks where to cast. */
  renderPreview(ctx: CanvasRenderingContext2D, world: World, x: number, y: number): void;
}
