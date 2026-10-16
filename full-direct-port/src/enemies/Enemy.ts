import { idiv } from '../engine/Graphics';
import { SwingTimer } from '../engine/Scheduler';
import type { Board } from '../game/Board';
import * as Co from '../game/Co';
import type { DirImages } from '../game/Pic';
import { TDObject } from '../game/TDObject';

export interface EnemyStats {
  maxhealth: number;
  maxspeed: number;
  damage: number;
}

/** Base enemy that walks the road tile by tile (Enemy.java). */
export abstract class Enemy extends TDObject {
  protected health: number;
  protected maxhealth: number;
  protected maxspeed: number;
  protected speed: number;
  protected damage: number;
  protected healthlevel: number;
  private skritt = 0;
  private direction: string;
  private lvl: string[][];
  protected slowtimer: SwingTimer;
  private imgmap: DirImages;
  protected poisoncounters = 0;
  protected poisoned = false;

  constructor(b: DirImages, gui: Board, xs: number, ys: number, enemylevel: number) {
    super(b.u, gui, xs, ys);
    this.imgmap = b;
    this.x -= idiv(this.getWidth(), 2);
    this.y -= idiv(this.getHeight(), 2);

    const brett = gui.getLevel();
    this.lvl = brett.getLevel();
    this.direction = brett.findStartDirection(idiv(this.y, Co.IMGSIZE), idiv(this.x, Co.IMGSIZE));
    this.setImg(b[this.direction] ?? b.u);
    this.healthlevel = enemylevel;
    const s = this.stats(enemylevel);
    this.maxhealth = s.maxhealth;
    this.maxspeed = s.maxspeed;
    this.damage = s.damage;
    this.health = this.maxhealth;
    this.speed = this.maxspeed;

    // Slows and stuns wear off after 1.6 s of real time.
    this.slowtimer = new SwingTimer(gui.scheduler, 1600, () => {
      this.slowtimer.stop();
      this.speed = this.maxspeed;
    });
  }

  protected abstract stats(healthlevel: number): EnemyStats;

  speedchanged(arg: string): void {
    // As in the original: neither call changes how long a slow lasts.
    if (arg === 'slower') {
      this.slowtimer.setInitialDelay(1600);
    } else if (arg === 'faster') {
      this.slowtimer.setDelay(1600 / 2);
    }
  }

  getPoisonCounters(): number {
    return this.poisoncounters;
  }

  private tile(row: number, col: number): string {
    return this.lvl[row]?.[col] ?? '';
  }

  private walkable(row: number, col: number): boolean {
    const c = this.tile(row, col);
    return c === Co.PATHC || c === Co.TARGETC;
  }

  loop(): void {
    const S = Co.IMGSIZE;
    if (this.tile(idiv(this.y, S), idiv(this.x, S)) === Co.TARGETC) {
      this.destruct();
      return;
    }
    const xx = idiv(this.x, S);
    const yy = idiv(this.y, S);
    const xxpp = idiv(this.x + idiv(this.getWidth(), 2) + S / 2, S);
    const yypp = idiv(this.y + idiv(this.getHeight(), 2) + S / 2, S);
    const xxmm = idiv(this.x + idiv(this.getWidth(), 2) - S / 2, S);
    const yymm = idiv(this.y + idiv(this.getHeight(), 2) - S / 2, S);

    if (this.direction === 'r') {
      this.x += this.speed;
      this.skritt += this.speed;
      if (!this.walkable(yy, xxpp)) {
        if (this.walkable(yy + 1, xx)) this.direction = 'd';
        else if (this.walkable(yy - 1, xx)) this.direction = 'u';
      }
    } else if (this.direction === 'l') {
      this.x -= this.speed;
      this.skritt += this.speed;
      if (!this.walkable(yy, xxmm)) {
        if (this.walkable(yy + 1, xx)) this.direction = 'd';
        else if (this.walkable(yy - 1, xx)) this.direction = 'u';
      }
    } else if (this.direction === 'u') {
      this.y -= this.speed;
      this.skritt += this.speed;
      if (!this.walkable(yymm, xx)) {
        if (this.walkable(yy, xx + 1)) this.direction = 'r';
        else if (this.walkable(yy, xx - 1)) this.direction = 'l';
      }
    } else if (this.direction === 'd') {
      this.y += this.speed;
      this.skritt += this.speed;
      if (!this.walkable(yypp, xx)) {
        if (this.walkable(yy, xx + 1)) this.direction = 'r';
        else if (this.walkable(yy, xx - 1)) this.direction = 'l';
      }
    }
    const img = this.imgmap[this.direction];
    if (img) this.setImg(img);
  }

  /** Can run more than once for the same enemy, paying out each time, as in the original. */
  die(): void {
    this.gui.getKonto().deposit(10 + this.healthlevel * 2);
    this.gui.removeEnemy(this);
  }

  destruct(): void {
    this.gui.damagePlayer(this.damage);
    this.gui.removeEnemy(this);
  }

  takedamge(dmg: number): void {
    this.health -= dmg;
    if (this.isDead()) this.die();
  }

  takePoisonDamge(dmg: number): void {
    this.health -= dmg;
    if (this.isDead()) this.die();
  }

  isDead(): boolean {
    return this.health <= 0;
  }

  getSkritt(): number {
    return Math.trunc(this.skritt);
  }

  getHealthWidth(): number {
    return Math.trunc((this.health / this.maxhealth) * this.getWidth());
  }

  isPoisoned(): boolean {
    return this.poisoned;
  }

  poison(ticks: number): void {
    this.poisoncounters += ticks;
    this.poisoned = true;
  }

  slow(amount: number, dmg: number): void {
    this.health -= dmg;
    if (this.maxspeed - this.maxspeed * amount < this.speed) {
      this.speed = this.maxspeed - this.maxspeed * amount;
    }
    this.slowtimer.restart();
    if (this.isDead()) this.die();
  }

  spellDamage(s: number, d: number): void {
    if (this.maxspeed - this.maxspeed * s < this.speed) {
      this.speed = this.maxspeed - this.maxspeed * s;
    }
    this.slowtimer.restart();
    this.health -= d;
    if (this.health < 0) this.health = 0;
    if (this.isDead()) {
      this.die();
      this.slowtimer.stop();
    }
  }

  poisonTick(): void {
    if (this.poisoncounters > 0) {
      this.takePoisonDamge(18);
      this.poisoncounters--;
      if (this.poisoncounters <= 0) this.poisoned = false;
    } else {
      this.poisoned = false;
    }
  }
}
