import type { Board } from '../game/Board';
import { Enemy, type EnemyStats } from './Enemy';

/** Peasant. */
export class NormalEnemy extends Enemy {
  constructor(gui: Board, xs: number, ys: number, nivaa: number) {
    super(gui.getBilder().peasant, gui, xs, ys, nivaa);
  }
  protected stats(hl: number): EnemyStats {
    return { maxhealth: 100 + 100 * hl, maxspeed: 1.2, damage: 1 };
  }
}

/** Scout. */
export class FastEnemy extends Enemy {
  constructor(gui: Board, xs: number, ys: number, nivaa: number) {
    super(gui.getBilder().scout, gui, xs, ys, nivaa);
  }
  protected stats(hl: number): EnemyStats {
    return { maxhealth: 100 + 100 * hl, maxspeed: 1.7, damage: 1 };
  }
}

/** Assassin: 50% chance to ignore hits, poison and slow. */
export class DodgeEnemy extends Enemy {
  constructor(gui: Board, xs: number, ys: number, nivaa: number) {
    super(gui.getBilder().assassin, gui, xs, ys, nivaa);
  }
  protected stats(hl: number): EnemyStats {
    return { maxhealth: 70 + 70 * hl, maxspeed: 1.6, damage: 1 };
  }
  takedamge(dmg: number): void {
    if (Math.random() > 0.5) super.takedamge(dmg);
  }
  poison(ticks: number): void {
    if (Math.random() > 0.5) super.poison(ticks);
  }
  slow(amount: number, dmg: number): void {
    if (Math.random() > 0.5) super.slow(amount, dmg);
  }
}

/** Solider: armour subtracts 10 from every hit, including poison ticks. */
export class ShieldEnemy extends Enemy {
  private shield = 10;

  constructor(gui: Board, xs: number, ys: number, nivaa: number) {
    super(gui.getBilder().solider, gui, xs, ys, nivaa);
  }
  protected stats(hl: number): EnemyStats {
    return { maxhealth: 130 + 130 * hl, maxspeed: 1.2, damage: 1 };
  }
  takedamge(dmg: number): void {
    if (dmg - this.shield >= 0) this.health -= dmg - this.shield;
    if (this.isDead()) this.die();
  }
  takePoisonDamge(dmg: number): void {
    if (dmg - this.shield >= 0) this.health -= dmg - this.shield;
    if (this.isDead()) this.die();
  }
  slow(amount: number, dmg: number): void {
    if (dmg - this.shield >= 0) this.health -= dmg - this.shield;
    if (this.maxspeed - this.maxspeed * amount < this.speed) {
      this.speed = this.maxspeed - this.maxspeed * amount;
    }
    if (this.isDead()) this.die();
    this.slowtimer.restart();
  }
}

/** Vanguard: cannot be slowed, and blocks the first three attacks of any kind. */
export class NoslowEnemy extends Enemy {
  private blocks = 3;

  constructor(gui: Board, xs: number, ys: number, nivaa: number) {
    super(gui.getBilder().vanguard, gui, xs, ys, nivaa);
  }
  protected stats(hl: number): EnemyStats {
    return { maxhealth: 120 + 100 * hl, maxspeed: 1.6, damage: 1 };
  }
  slow(_amount: number, dmg: number): void {
    if (this.blocks > 0) {
      this.blocks--;
    } else {
      this.health -= dmg;
      if (this.isDead()) this.die();
    }
  }
  takedamge(dmg: number): void {
    if (this.blocks > 0) this.blocks--;
    else super.takedamge(dmg);
  }
  poison(ticks: number): void {
    if (this.blocks > 0) this.blocks--;
    else super.poison(ticks);
  }
}

/** Paragon: dodges, has armour, and cannot be slowed. */
export class SuperEnemy extends Enemy {
  private shield = 10;

  constructor(gui: Board, xs: number, ys: number, nivaa: number) {
    super(gui.getBilder().paragon, gui, xs, ys, nivaa);
  }
  protected stats(hl: number): EnemyStats {
    return { maxhealth: 70 + 70 * hl, maxspeed: 1.4, damage: 1 };
  }
  takedamge(dmg: number): void {
    if (Math.random() > 0.5) {
      if (dmg - this.shield >= 0) this.health -= dmg - this.shield;
      if (this.isDead()) this.die();
    }
  }
  poison(ticks: number): void {
    if (Math.random() > 0.5) super.poison(ticks);
  }
  takePoisonDamge(dmg: number): void {
    if (dmg - this.shield >= 0) this.health -= dmg - this.shield;
    if (this.isDead()) this.die();
  }
  slow(_amount: number, dmg: number): void {
    if (Math.random() > 0.5) {
      if (dmg - this.shield >= 0) this.health -= dmg - this.shield;
      if (this.isDead()) this.die();
    }
  }
}
