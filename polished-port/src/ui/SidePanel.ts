import { Rectangle } from '../core/Rectangle';
import { enemyTypeFor } from '../entities/enemies/EnemyTypes';
import type { Tower } from '../entities/towers/Tower';
import type { Point } from '../game/Game';
import { CANVAS_WIDTH, MAP_WIDTH } from '../game/constants';
import { COLOR_GOLD, COLOR_HEALTH, COLOR_MANA, COLOR_TEXT } from '../game/theme';
import { resources } from '../resources/ResourceLoader';
import type { World } from '../world/World';
import { BuildButton } from './BuildButton';
import { drawLine, drawLines, drawText } from './draw';
import { EnemyInfoButton } from './EnemyInfoButton';

/** Where hover descriptions and the selected tower's stats are written. */
const INFO_X = 650;
const INFO_Y = 167;
/** Lines 2 and 3 of the info area hold prices. */
const PRICE_Y = INFO_Y + 15;
const SELL_PRICE_Y = INFO_Y + 30;

/**
 * The panel right of the map: gold, health and mana, the build buttons, the
 * "next wave" preview, and the info area that shows either what the mouse is
 * over or the selected tower with its upgrade and sell buttons.
 */
export class SidePanel {
  readonly buildButtons: BuildButton[] = [
    new BuildButton(650, 35, { tower: 'Normal' }),
    new BuildButton(700, 35, { tower: 'Area' }),
    new BuildButton(750, 35, { tower: 'Spread' }),
    new BuildButton(800, 35, { tower: 'Poison' }),
    new BuildButton(650, 105, { spell: 'Lightning' }),
    new BuildButton(700, 105, { spell: 'Runestone' }),
  ];

  readonly infoButtons: EnemyInfoButton[] = (
    [
      ['n', 680, 395],
      ['f', 750, 395],
      ['s', 820, 395],
      ['d', 680, 435],
      ['<', 750, 435],
      ['*', 820, 435],
    ] as const
  ).map(([char, x, y]) => new EnemyInfoButton(x, y, enemyTypeFor(char)!));

  readonly upgradeBounds = new Rectangle(800, 155, 40, 40);
  readonly sellBounds = new Rectangle(800, 200, 40, 40);

  buildButtonAt(x: number, y: number): BuildButton | null {
    return this.buildButtons.find((b) => b.bounds.contains(x, y)) ?? null;
  }

  infoButtonAt(x: number, y: number): EnemyInfoButton | null {
    return this.infoButtons.find((b) => b.bounds.contains(x, y)) ?? null;
  }

  render(ctx: CanvasRenderingContext2D, world: World, selected: Tower | null, mouse: Point | null): void {
    const spawner = world.spawner;
    drawText(ctx, `Wave#: ${spawner.waveIndex + 1}/ ${spawner.waveCount}`, 645, 382, COLOR_TEXT);
    drawText(ctx, 'Next wave:', 760, 382, COLOR_TEXT);
    drawLine(ctx, MAP_WIDTH, 360, CANVAS_WIDTH, 360, COLOR_TEXT);
    drawLine(ctx, MAP_WIDTH, 150, CANVAS_WIDTH, 150, COLOR_TEXT);
    drawLine(ctx, MAP_WIDTH, 0, MAP_WIDTH, 550, COLOR_TEXT);

    drawText(ctx, `Health: ${world.health}`, 770, 25, COLOR_HEALTH);
    drawText(ctx, `Gold: ${world.gold.balance}`, 650, 25, COLOR_GOLD);
    drawText(ctx, `Mana: ${world.mana.balance}`, 650, 95, COLOR_MANA);

    const hovered = (b: { bounds: Rectangle }) => mouse !== null && b.bounds.contains(mouse.x, mouse.y);
    let showingHover = false;

    const counts = countEnemies(spawner.nextWaveScript);
    for (const b of this.infoButtons) {
      b.render(ctx, counts.get(b.type.char) ?? 0);
      if (hovered(b)) {
        showingHover = true;
        drawLines(ctx, b.type.description, INFO_X, INFO_Y, COLOR_TEXT);
      }
    }

    for (const b of this.buildButtons) {
      b.render(ctx, world);
      if (hovered(b)) {
        showingHover = true;
        drawText(ctx, b.priceText(world), INFO_X, PRICE_Y, 'tower' in b.item ? COLOR_GOLD : COLOR_MANA);
        drawLines(ctx, b.description, INFO_X, INFO_Y, COLOR_TEXT);
      }
    }

    if (selected && !showingHover) this.renderSelected(ctx, world, selected);
  }

  private renderSelected(ctx: CanvasRenderingContext2D, world: World, tower: Tower): void {
    drawLines(ctx, tower.infoLines(), INFO_X, INFO_Y, COLOR_TEXT);
    resources.images.draw(ctx, 'upgradeknapp', this.upgradeBounds.x, this.upgradeBounds.y);
    resources.images.draw(ctx, 'sellknapp', this.sellBounds.x, this.sellBounds.y);
    drawText(ctx, `Upgrade: ${tower.upgradePrice}`, INFO_X, PRICE_Y, COLOR_GOLD);
    drawText(ctx, `Sell: ${world.gold.sellValue(tower)}`, INFO_X, SELL_PRICE_Y, COLOR_GOLD);
    if (!world.canUpgrade(tower)) {
      resources.images.draw(ctx, 'cross', this.upgradeBounds.x, this.upgradeBounds.y);
    }
  }
}

/** How many of each character a wave script has. */
function countEnemies(script: string): Map<string, number> {
  const counts = new Map<string, number>();
  for (const c of script) counts.set(c, (counts.get(c) ?? 0) + 1);
  return counts;
}
