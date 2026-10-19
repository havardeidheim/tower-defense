import { Interval } from '../core/Interval';
import { defaultRandom, type Random } from '../core/Random';
import type { FrostRing } from '../entities/attacks/FrostRing';
import type { Projectile } from '../entities/attacks/Projectile';
import { Enemy } from '../entities/enemies/Enemy';
import { enemyTypeFor } from '../entities/enemies/EnemyTypes';
import { createTower } from '../entities/towers/createTower';
import type { Tower } from '../entities/towers/Tower';
import type { TowerType } from '../entities/towers/TowerTypes';
import {
  AD_ASTRA_INDEX, MANA_FIRST_TICKS, MANA_INTERVAL_TICKS, POISON_INTERVAL_TICKS,
  SPAWN_INTERVAL_TICKS, SPELL_MANA_COST, STARTING_GOLD, STARTING_HEALTH, STARTING_MANA,
  STARTING_MANA_AD_ASTRA,
} from '../game/constants';
import type { Level } from '../level/Level';
import { WaveSpawner } from '../level/WaveSpawner';
import { Gold, Mana } from './Economy';

export type Outcome = 'playing' | 'won' | 'lost';

/** Pulses that start when the player presses Start. */
interface Clocks {
  spawn: Interval;
  mana: Interval;
  poison: Interval;
}

/**
 * One game on one level: the entities, the player's resources, and the rules.
 *
 * The world only changes in tick() and in the player commands below. It knows
 * nothing about pausing, fast mode or input; the game scene decides when to tick.
 *
 * Entity lifecycle: killed enemies, finished projectiles and effects stay in
 * their lists until sweep(), which pays the bounty for every killed enemy and
 * removes them. Sweeping runs at the end of every tick and after every player
 * command, so the lists are always clean between ticks, also while paused.
 */
export class World {
  readonly gold = new Gold(STARTING_GOLD);
  readonly mana: Mana;
  health = STARTING_HEALTH;

  enemies: Enemy[] = [];
  towers: Tower[] = [];
  projectiles: Projectile[] = [];
  effects: FrostRing[] = [];

  readonly spawner: WaveSpawner;
  private clocks: Clocks | null = null;

  constructor(
    readonly level: Level,
    private readonly random: Random = defaultRandom,
  ) {
    this.mana = new Mana(level.index === AD_ASTRA_INDEX ? STARTING_MANA_AD_ASTRA : STARTING_MANA);
    this.spawner = new WaveSpawner(level.waves);
  }

  get started(): boolean {
    return this.clocks !== null;
  }

  get outcome(): Outcome {
    if (this.health <= 0) return 'lost';
    if (this.spawner.finished) return 'won';
    return 'playing';
  }

  /** Starts the first wave. The first enemy arrives one spawn interval later. */
  start(): void {
    if (this.clocks) return;
    this.spawner.start();
    this.clocks = {
      spawn: new Interval(SPAWN_INTERVAL_TICKS),
      mana: new Interval(MANA_INTERVAL_TICKS, MANA_FIRST_TICKS),
      poison: new Interval(POISON_INTERVAL_TICKS),
    };
  }

  /**
   * Advances the game by one tick (20 ms). The order is fixed: first the pulses
   * that are due (spawning, mana, poison), then enemies walk, towers act,
   * projectiles fly and effects animate. Things created earlier in a tick act
   * later in the same tick: a new enemy walks, a new projectile flies.
   */
  tick(): void {
    const clocks = this.clocks;
    if (!clocks || this.outcome !== 'playing') return;

    if (clocks.spawn.tick()) this.spawnPulse();
    if (clocks.mana.tick()) this.mana.regenerate(1);
    if (clocks.poison.tick()) {
      for (const e of this.enemies) e.poisonTick();
    }

    const onEscape = (e: Enemy) => {
      this.health -= e.type.damage;
    };
    for (const e of this.enemies) e.update(onEscape);
    for (const t of this.towers) t.update(this);
    for (const p of this.projectiles) p.update(this);
    for (const f of this.effects) f.update();

    this.sweep();
  }

  private spawnPulse(): void {
    const slot = this.spawner.pulse(this.enemies.length === 0);
    if (!slot) return;
    const spawn = this.level.takeSpawnPoint();
    const type = enemyTypeFor(slot.char);
    if (type) this.enemies.push(new Enemy(type, slot.healthLevel, spawn, this.level, this.random));
  }

  /** Pays out killed enemies once and drops everything that is finished. */
  private sweep(): void {
    for (const e of this.enemies) {
      if (e.state === 'killed') this.gold.earn(e.bounty);
    }
    this.enemies = this.enemies.filter((e) => e.alive);
    this.projectiles = this.projectiles.filter((p) => !p.done);
    this.effects = this.effects.filter((f) => !f.done);
  }

  addProjectile(p: Projectile): void {
    this.projectiles.push(p);
  }

  addEffect(f: FrostRing): void {
    this.effects.push(f);
  }

  // ============================================================
  // Player commands. Each one takes effect at once, also while paused.
  // ============================================================

  towerAt(col: number, row: number): Tower | null {
    return this.towers.find((t) => t.col === col && t.row === row) ?? null;
  }

  canBuildAt(col: number, row: number): boolean {
    return this.level.isBuildable(col, row) && !this.towerAt(col, row);
  }

  build(type: TowerType, col: number, row: number): Tower | null {
    if (!this.gold.canAfford(type) || !this.canBuildAt(col, row)) return null;
    this.gold.buy(type);
    const tower = createTower(type, col, row);
    this.towers.push(tower);
    return tower;
  }

  canUpgrade(tower: Tower): boolean {
    return !tower.isMaxLevel && this.gold.canPay(tower.upgradePrice);
  }

  upgrade(tower: Tower): boolean {
    if (!this.canUpgrade(tower)) return false;
    this.gold.pay(tower.upgradePrice);
    tower.upgrade();
    return true;
  }

  sell(tower: Tower): void {
    const i = this.towers.indexOf(tower);
    if (i < 0) return;
    this.gold.earn(this.gold.sellValue(tower));
    this.towers.splice(i, 1);
  }

  get canCastSpell(): boolean {
    return this.mana.canPay(SPELL_MANA_COST);
  }

  /** The first enemy (in spawn order) under the point. */
  enemyAt(x: number, y: number): Enemy | null {
    return this.enemies.find((e) => e.alive && e.bounds.contains(x, y)) ?? null;
  }

  castLightning(x: number, y: number): Enemy | null {
    const enemy = this.canCastSpell ? this.enemyAt(x, y) : null;
    if (!enemy) return null;
    this.mana.pay(SPELL_MANA_COST);
    enemy.lightning();
    this.sweep();
    return enemy;
  }

  placeFoundation(col: number, row: number): boolean {
    if (!this.canCastSpell || !this.level.placeFoundation(col, row)) return false;
    this.mana.pay(SPELL_MANA_COST);
    return true;
  }
}
