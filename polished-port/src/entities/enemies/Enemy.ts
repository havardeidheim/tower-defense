import type { Random } from '../../core/Random';
import { Rectangle } from '../../core/Rectangle';
import {
  BOUNTY_BASE, BOUNTY_PER_HEALTH_LEVEL, DODGE_CHANCE, ENEMY_SIZE, LIGHTNING_DAMAGE,
  POISON_TICK_DAMAGE, SLOW_DURATION_TICKS, TILE_SIZE,
} from '../../game/constants';
import { COLOR_BLACK, COLOR_GREEN } from '../../game/theme';
import type { Direction, Level, TilePos } from '../../level/Level';
import { resources } from '../../resources/ResourceLoader';
import type { EnemyType } from './EnemyTypes';

/**
 * alive: on the road. killed: died this tick, its bounty is paid when the world
 * sweeps it away. escaped: reached the end of the road and hurt the player.
 * Only alive enemies can be targeted or damaged, so nothing is paid twice.
 */
export type EnemyState = 'alive' | 'killed' | 'escaped';

const HALF = ENEMY_SIZE / 2;
const HALF_TILE = TILE_SIZE / 2;

export class Enemy {
  /** Top-left corner of the sprite. */
  x: number;
  y: number;
  readonly width = ENEMY_SIZE;
  readonly height = ENEMY_SIZE;

  health: number;
  readonly maxHealth: number;
  speed: number;
  readonly maxSpeed: number;
  direction: Direction | null;
  /** Pixels walked since spawning. Towers target the enemy that has walked furthest. */
  distance = 0;
  poisonCounters = 0;
  state: EnemyState = 'alive';

  private slowTicks = 0;
  private blocksLeft: number;

  constructor(
    readonly type: EnemyType,
    readonly healthLevel: number,
    spawn: TilePos,
    private readonly level: Level,
    private readonly random: Random,
  ) {
    // Centered on the spawn tile.
    this.x = spawn.col * TILE_SIZE + HALF_TILE - HALF;
    this.y = spawn.row * TILE_SIZE + HALF_TILE - HALF;
    this.direction = level.startDirection(Math.trunc(this.x / TILE_SIZE), Math.trunc(this.y / TILE_SIZE));

    this.maxHealth = type.baseHealth + type.healthPerLevel * healthLevel;
    this.health = this.maxHealth;
    this.maxSpeed = type.speed;
    this.speed = type.speed;
    this.blocksLeft = type.blocks;
  }

  get alive(): boolean {
    return this.state === 'alive';
  }

  get bounty(): number {
    return BOUNTY_BASE + BOUNTY_PER_HEALTH_LEVEL * this.healthLevel;
  }

  /** Whole pixels walked, used to pick targets. */
  get progress(): number {
    return Math.trunc(this.distance);
  }

  get centerX(): number {
    return Math.trunc(this.x) + HALF;
  }

  get centerY(): number {
    return Math.trunc(this.y) + HALF;
  }

  get bounds(): Rectangle {
    return new Rectangle(Math.trunc(this.x), Math.trunc(this.y), this.width, this.height);
  }

  /** Called once per tick by the world, before the towers act. */
  update(onEscape: (enemy: Enemy) => void): void {
    if (!this.alive) return;

    if (this.slowTicks > 0) {
      this.slowTicks--;
      if (this.slowTicks === 0) this.speed = this.maxSpeed;
    }

    if (this.level.isTarget(Math.trunc(this.x / TILE_SIZE), Math.trunc(this.y / TILE_SIZE))) {
      this.state = 'escaped';
      onEscape(this);
      return;
    }
    this.walk();
  }

  /**
   * Moves one step along the road. The enemy keeps its direction until the tile
   * half a tile ahead of its center is no longer road, then turns towards the
   * road beside it. Tiles are looked up from the position before the step.
   */
  private walk(): void {
    const level = this.level;
    const col = Math.trunc(this.x / TILE_SIZE);
    const row = Math.trunc(this.y / TILE_SIZE);
    const colAhead = Math.trunc((this.x + HALF + HALF_TILE) / TILE_SIZE);
    const rowAhead = Math.trunc((this.y + HALF + HALF_TILE) / TILE_SIZE);
    const colBehind = Math.trunc((this.x + HALF - HALF_TILE) / TILE_SIZE);
    const rowBehind = Math.trunc((this.y + HALF - HALF_TILE) / TILE_SIZE);

    switch (this.direction) {
      case 'r':
      case 'l': {
        const right = this.direction === 'r';
        this.x += right ? this.speed : -this.speed;
        this.distance += this.speed;
        if (!level.isWalkable(right ? colAhead : colBehind, row)) {
          if (level.isWalkable(col, row + 1)) this.direction = 'd';
          else if (level.isWalkable(col, row - 1)) this.direction = 'u';
        }
        break;
      }
      case 'u':
      case 'd': {
        const down = this.direction === 'd';
        this.y += down ? this.speed : -this.speed;
        this.distance += this.speed;
        if (!level.isWalkable(col, down ? rowAhead : rowBehind)) {
          if (level.isWalkable(col + 1, row)) this.direction = 'r';
          else if (level.isWalkable(col - 1, row)) this.direction = 'l';
        }
        break;
      }
      case null:
        break;
    }
  }

  // ============================================================
  // Attacks. Each one does nothing to an enemy that is no longer alive.
  // ============================================================

  /** A stone or a fireball. */
  hit(damage: number): void {
    if (!this.alive || this.evades()) return;
    this.lose(damage - this.type.shield);
  }

  /** A poison dart: adds poison counters, each one worth a poison tick. */
  poison(counters: number): void {
    if (!this.alive || this.evades()) return;
    this.poisonCounters += counters;
  }

  /** The frost tower's pulse: damage, and a slow unless the enemy is immune. */
  frost(slowAmount: number, damage: number): void {
    if (!this.alive || this.evades()) return;
    this.lose(damage - this.type.shield);
    if (!this.type.slowImmune) this.slow(slowAmount);
  }

  /** Called on every poison pulse; uses up one poison counter. */
  poisonTick(): void {
    if (!this.alive || this.poisonCounters <= 0) return;
    this.lose(POISON_TICK_DAMAGE - this.type.shield);
    this.poisonCounters--;
  }

  /** The lightning spell: stuns and damages. Cannot be dodged, blocked or shielded. */
  lightning(): void {
    if (!this.alive) return;
    this.slow(1);
    this.health = Math.max(0, this.health - LIGHTNING_DAMAGE);
    if (this.health <= 0) this.state = 'killed';
  }

  /** Dodging and blocking. Dodging is rolled first; a blocked attack uses up a block. */
  private evades(): boolean {
    if (this.type.dodges && !(this.random() > DODGE_CHANCE)) return true;
    if (this.blocksLeft > 0) {
      this.blocksLeft--;
      return true;
    }
    return false;
  }

  private lose(amount: number): void {
    if (amount > 0) this.health -= amount;
    if (this.health <= 0) this.state = 'killed';
  }

  /** Slows never stack: the strongest one counts, and any slow restarts the duration. */
  private slow(amount: number): void {
    const slowed = this.maxSpeed - this.maxSpeed * amount;
    if (slowed < this.speed) this.speed = slowed;
    this.slowTicks = SLOW_DURATION_TICKS;
  }

  render(ctx: CanvasRenderingContext2D): void {
    const x = Math.trunc(this.x);
    const y = Math.trunc(this.y);
    resources.images.draw(ctx, `${this.type.sprite}${this.direction ?? 'u'}`, x, y);

    // Health bar
    ctx.fillStyle = COLOR_BLACK;
    ctx.fillRect(x, y - 4, this.width, 4);
    const healthWidth = Math.trunc((this.health / this.maxHealth) * this.width);
    if (healthWidth > 0) {
      ctx.fillStyle = COLOR_GREEN;
      ctx.fillRect(x, y - 4, healthWidth, 4);
    }
  }
}
