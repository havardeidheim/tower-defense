import { Rectangle } from '../../core/Rectangle';
import { ENEMY_SIZE, TICKS_PER_SECOND, TILE_SIZE, TOWER_SIZE, UPGRADE_PRICES } from '../../game/constants';
import { resources } from '../../resources/ResourceLoader';
import type { World } from '../../world/World';
import type { Enemy } from '../enemies/Enemy';
import type { TowerKind, TowerLevel } from './TowerTypes';

const HALF = TOWER_SIZE / 2;

export abstract class Tower {
  /** Top-left corner of the tower's tile. */
  readonly x: number;
  readonly y: number;
  readonly width = TOWER_SIZE;
  readonly height = TOWER_SIZE;
  /** 0 to 3; shown as level 1 to 4. */
  level = 0;
  private cooldown = 0;

  constructor(
    readonly kind: TowerKind,
    readonly col: number,
    readonly row: number,
  ) {
    this.x = col * TILE_SIZE;
    this.y = row * TILE_SIZE;
  }

  get stats(): TowerLevel {
    return this.kind.levels[this.level];
  }

  get damage(): number {
    return this.stats.damage;
  }

  get range(): number {
    return this.stats.range;
  }

  get centerX(): number {
    return this.x + HALF;
  }

  get centerY(): number {
    return this.y + HALF;
  }

  get bounds(): Rectangle {
    return new Rectangle(this.x, this.y, this.width, this.height);
  }

  get isMaxLevel(): boolean {
    return this.level >= this.kind.levels.length - 1;
  }

  /** 0 at max level. */
  get upgradePrice(): number {
    return this.isMaxLevel ? 0 : UPGRADE_PRICES[this.level];
  }

  upgrade(): void {
    if (!this.isMaxLevel) this.level++;
  }

  /** Called once per tick by the world, after the enemies have moved. */
  update(world: World): void {
    if (this.cooldown > 0) this.cooldown--;
    this.act(world);
  }

  protected abstract act(world: World): void;

  protected get ready(): boolean {
    return this.cooldown === 0;
  }

  /** Plays the firing sound and starts the reload. */
  protected fired(): void {
    resources.sounds.play(this.kind.sound, this);
    this.cooldown = this.stats.reloadTicks;
  }

  /** A projectile lost its target before it hit, so the tower may fire again right away. */
  lostShot(): void {
    this.cooldown = 0;
  }

  /** Distance between centers, in whole pixels. */
  inRange(enemy: Enemy): boolean {
    const dx = Math.trunc(enemy.x) + ENEMY_SIZE / 2 - this.centerX;
    const dy = Math.trunc(enemy.y) + ENEMY_SIZE / 2 - this.centerY;
    return Math.trunc(Math.sqrt(dx * dx + dy * dy)) <= this.range;
  }

  /**
   * The enemy in range that has walked furthest. Ties go to the one that spawned
   * first, and an enemy that has not taken its first step is never picked.
   */
  protected furthestInRange(enemies: readonly Enemy[], exclude: readonly Enemy[] = []): Enemy | null {
    let best: Enemy | null = null;
    let highest = 0;
    for (const e of enemies) {
      if (e.alive && this.inRange(e) && e.progress > highest && !exclude.includes(e)) {
        best = e;
        highest = e.progress;
      }
    }
    return best;
  }

  /** The lines of the selected-tower panel. Lines 2 and 3 hold the upgrade and sell prices. */
  infoLines(): string[] {
    const lines = [this.kind.name, '', '', '', `Level: ${this.level + 1}`];
    lines.push(`Damage: ${this.damageText()}`);
    lines.push(`Range: ${this.range}`);
    lines.push(`Speed: ${(this.stats.reloadTicks / TICKS_PER_SECOND).toFixed(1)}`);
    const extra = this.extraInfo();
    if (extra) lines.push(extra);
    return lines;
  }

  protected damageText(): string {
    return `${this.damage}`;
  }

  protected extraInfo(): string | null {
    return null;
  }

  render(ctx: CanvasRenderingContext2D): void {
    resources.images.draw(ctx, this.kind.sprite, this.x, this.y);
  }
}
