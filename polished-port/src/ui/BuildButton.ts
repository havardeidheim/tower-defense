import { Rectangle } from '../core/Rectangle';
import { TOWER_KINDS, type TowerType } from '../entities/towers/TowerTypes';
import { SPELL_MANA_COST, TOWER_SIZE } from '../game/constants';
import { resources } from '../resources/ResourceLoader';
import { SPELLS } from '../spells/spells';
import type { SpellType } from '../spells/Spell';
import type { World } from '../world/World';

export type BuildItem = { tower: TowerType } | { spell: SpellType };

/** A side panel button that starts building a tower or casting a spell. */
export class BuildButton {
  readonly bounds: Rectangle;

  constructor(
    x: number,
    y: number,
    readonly item: BuildItem,
  ) {
    this.bounds = new Rectangle(x, y, TOWER_SIZE, TOWER_SIZE);
  }

  get icon(): string {
    return 'tower' in this.item ? TOWER_KINDS[this.item.tower].sprite : SPELLS[this.item.spell].icon;
  }

  get description(): readonly string[] {
    return 'tower' in this.item ? TOWER_KINDS[this.item.tower].description : SPELLS[this.item.spell].description;
  }

  /** Towers cost gold, spells cost mana. */
  price(world: World): number {
    return 'tower' in this.item ? world.gold.priceOf(this.item.tower) : SPELL_MANA_COST;
  }

  priceText(world: World): string {
    return `${'tower' in this.item ? 'Price' : 'Mana'}: ${this.price(world)}`;
  }

  affordable(world: World): boolean {
    const funds = 'tower' in this.item ? world.gold.balance : world.mana.balance;
    return this.price(world) <= funds;
  }

  render(ctx: CanvasRenderingContext2D, world: World): void {
    const { x, y } = this.bounds;
    resources.images.draw(ctx, this.icon, x, y);
    if (!this.affordable(world)) resources.images.draw(ctx, 'cross', x, y);
  }
}
