import { Rectangle } from '../core/Rectangle';
import type { Tower } from '../entities/towers/Tower';
import { TOWER_KINDS, type TowerType } from '../entities/towers/TowerTypes';
import { CANVAS_HEIGHT, CANVAS_WIDTH, END_DELAY_TICKS, MAP_HEIGHT, MAP_WIDTH, TILE_SIZE } from '../game/constants';
import { COLOR_BACKGROUND } from '../game/theme';
import { resources } from '../resources/ResourceLoader';
import { SaveManager } from '../save/SaveManager';
import type { Spell } from '../spells/Spell';
import { SPELLS } from '../spells/spells';
import type { BuildButton } from '../ui/BuildButton';
import { HelpOverlay } from '../ui/HelpOverlay';
import { SidePanel } from '../ui/SidePanel';
import { TextButton } from '../ui/TextButton';
import { World } from '../world/World';
import { MenuScene } from './MenuScene';
import { Scene } from './Scene';

const MAP_AREA = new Rectangle(0, 0, MAP_WIDTH, MAP_HEIGHT);
const START_SOUNDS = ['endiscoming', 'forseevictory', 'noonealive', 'letsgo'];

/**
 * Playing a level. The scene owns the World and decides when it ticks (not
 * before Start, not while paused, twice per tick in fast mode), turns input into
 * world commands, and draws everything.
 */
export class GameScene extends Scene {
  private world: World;
  private paused = false;
  private fast = false;
  /** Counts down from the end of the level to the return to the menu. */
  private endTicks: number | null = null;

  private selected: Tower | null = null;
  private placing: TowerType | null = null;
  private casting: Spell | null = null;
  private help: HelpOverlay | null = null;

  private readonly panel = new SidePanel();
  private readonly menuButton = new TextButton(48, 10, 'Menu', () => this.leave(0));
  private readonly helpButton = new TextButton(166, 10, 'Help', () => this.showHelp());
  private readonly startButton = new TextButton(284, 10, 'Start', () => this.startOrReset());
  private readonly pauseButton = new TextButton(402, 10, 'Pause', () => this.togglePause());
  private readonly speedButton = new TextButton(520, 10, 'Faster', () => this.toggleSpeed());
  private readonly topButtons = [this.menuButton, this.helpButton, this.startButton, this.pauseButton, this.speedButton];

  constructor(private readonly levelIndex: number) {
    super();
    this.world = new World(resources.levels.createLevel(levelIndex));
  }

  enter(): void {
    if (this.levelIndex === 0) this.showHelp();
  }

  // ============================================================
  // Time
  // ============================================================

  tick(): void {
    if (this.endTicks !== null) {
      this.endTicks--;
      if (this.endTicks <= 0) this.leave(this.world.health);
      return;
    }
    if (!this.world.started || this.paused) return;

    const steps = this.fast ? 2 : 1;
    for (let i = 0; i < steps; i++) {
      this.world.tick();
      if (this.world.outcome !== 'playing') {
        this.finish();
        return;
      }
    }
  }

  private finish(): void {
    const health = this.world.health;
    resources.sounds.play(health >= 4 ? 'verygood' : health <= 0 ? 'die' : 'ok');
    this.endTicks = END_DELAY_TICKS;
  }

  /** Back to the menu. The health left counts as stars; leaving early counts as 0. */
  private leave(healthLeft: number): void {
    new SaveManager(resources.levels.count).recordResult(this.levelIndex, healthLeft);
    this.game.setScene(new MenuScene());
  }

  // ============================================================
  // Top bar
  // ============================================================

  private startOrReset(): void {
    if (this.world.started) {
      this.reset();
      return;
    }
    this.world.start();
    resources.sounds.play(START_SOUNDS[this.levelIndex] ?? 'letsgo');
    this.startButton.label = 'Reset';
  }

  /** A fresh game on the same level: map, gold, mana, health and waves. */
  private reset(): void {
    this.world = new World(resources.levels.createLevel(this.levelIndex));
    this.cancelAction();
    this.selected = null;
    this.paused = false;
    this.fast = false;
    this.startButton.label = 'Start';
    this.pauseButton.label = 'Pause';
    this.speedButton.label = 'Faster';
  }

  private togglePause(): void {
    if (!this.world.started) return;
    this.paused = !this.paused;
    this.pauseButton.label = this.paused ? 'Resume' : 'Pause';
  }

  private toggleSpeed(): void {
    this.fast = !this.fast;
    this.speedButton.label = this.fast ? 'Slower' : 'Faster';
  }

  private showHelp(): void {
    if (this.help) {
      this.help.rewind();
    } else {
      this.help = new HelpOverlay(resources.levels.helpPages, () => {
        this.help = null;
      });
    }
  }

  // ============================================================
  // Input. The order of the checks follows the original.
  // ============================================================

  onPointerDown(x: number, y: number, button: number): void {
    if (this.endTicks !== null) return;
    if (button === 2) {
      this.cancelAction();
      this.selected = null;
      return;
    }
    if (button !== 0) return;
    if (this.help?.click(x, y)) return;

    const selected = this.selected;
    if (selected) {
      if (this.panel.upgradeBounds.contains(x, y)) {
        if (this.world.upgrade(selected)) resources.sounds.play('build');
        return;
      }
      if (this.panel.sellBounds.contains(x, y)) {
        this.world.sell(selected);
        resources.sounds.play('sell');
        this.selected = null;
        return;
      }
    }
    this.selected = null;

    const tower = this.world.towers.find((t) => t.bounds.contains(x, y));
    if (tower) {
      resources.sounds.play('select');
      this.selected = tower;
      return;
    }

    if (MAP_AREA.contains(x, y)) {
      const col = Math.trunc(x / TILE_SIZE);
      const row = Math.trunc(y / TILE_SIZE);
      if (this.placing && this.world.build(this.placing, col, row)) {
        resources.sounds.play('build');
        this.placing = null;
      }
      if (this.casting && this.casting.cast(this.world, x, y)) {
        this.casting = null;
        return;
      }
    }

    const build = this.panel.buildButtonAt(x, y);
    if (build) {
      this.pick(build);
      return;
    }
    if (this.panel.infoButtonAt(x, y)) return;

    const topButton = this.topButtons.find((b) => b.bounds.contains(x, y));
    topButton?.click();
  }

  /** A build button: start placing that tower, or casting that spell, if the player can pay. */
  private pick(button: BuildButton): void {
    resources.sounds.play('knapp');
    this.cancelAction();
    const item = button.item;
    if ('tower' in item) {
      if (this.world.gold.canAfford(item.tower)) this.placing = item.tower;
    } else if (this.world.canCastSpell) {
      this.casting = SPELLS[item.spell];
    }
  }

  private cancelAction(): void {
    this.placing = null;
    this.casting = null;
  }

  // ============================================================
  // Drawing, back to front
  // ============================================================

  render(ctx: CanvasRenderingContext2D): void {
    const world = this.world;
    const mouse = this.game.mouse;

    ctx.fillStyle = COLOR_BACKGROUND;
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    resources.images.draw(ctx, 'background', 0, 0);
    world.level.renderRoad(ctx);
    for (const f of world.effects) f.render(ctx);
    world.level.renderFoundations(ctx);

    this.panel.render(ctx, world, this.selected, mouse);
    if (this.selected) {
      resources.images.draw(ctx, 'select', this.selected.x - 2, this.selected.y - 2);
      renderRange(ctx, this.selected.centerX, this.selected.centerY, this.selected.range);
    }

    for (const e of world.enemies) e.render(ctx);
    for (const t of world.towers) t.render(ctx);
    for (const p of world.projectiles) p.render(ctx);

    if (mouse && MAP_AREA.contains(mouse.x, mouse.y)) {
      if (this.placing) this.renderPlacement(ctx, this.placing, mouse.x, mouse.y);
      if (this.casting) this.casting.renderPreview(ctx, world, mouse.x, mouse.y);
    }

    this.help?.render(ctx);
    for (const b of this.topButtons) b.render(ctx);
  }

  private renderPlacement(ctx: CanvasRenderingContext2D, type: TowerType, x: number, y: number): void {
    const kind = TOWER_KINDS[type];
    const col = Math.trunc(x / TILE_SIZE);
    const row = Math.trunc(y / TILE_SIZE);
    const tx = col * TILE_SIZE;
    const ty = row * TILE_SIZE;
    resources.images.draw(ctx, kind.sprite, tx, ty);
    if (!this.world.canBuildAt(col, row)) resources.images.draw(ctx, 'cross', tx, ty);
    renderRange(ctx, tx + TILE_SIZE / 2, ty + TILE_SIZE / 2, kind.levels[0].range);
  }
}

function renderRange(ctx: CanvasRenderingContext2D, centerX: number, centerY: number, range: number): void {
  resources.images.draw(ctx, `range${range}`, centerX - range, centerY - range, range * 2, range * 2);
}
