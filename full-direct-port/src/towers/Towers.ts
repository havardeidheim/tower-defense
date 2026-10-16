import type { Enemy } from '../enemies/Enemy';
import { idiv, jdouble } from '../engine/Graphics';
import { AreaShot } from '../game/AreaShot';
import type { Board } from '../game/Board';
import * as Co from '../game/Co';
import { NormalProjectile, PoisonProjectile, SpreadProjectile } from '../projectiles/Projectiles';
import { Tower } from './Tower';

/** Tower of Stonehurling. */
export class NormalTower extends Tower {
  constructor(gui: Board, xs: number, ys: number) {
    super(gui.getBilder().towerpic[Co.NORMALTYPE], gui, xs, ys);
    this.skytelyd = gui.getLyder().getStoneLyd();
  }

  setStats(): void {
    this.range = 140;
    this.speed = 1.2;
    this.damage = 20;
    this.name = 'Tower of Stonehurling';
  }

  upgrade(): void {
    this.range += 10;
    this.damage += 8;
    this.speed -= 0.1;
    this.speed = Math.round(this.speed * 100000) / 100000;
    this.level++;
    const reload = this.fast ? Math.trunc((1000 * this.speed) / 2) : Math.trunc(1000 * this.speed);
    this.timer.setDelay(reload);
    this.timer.setInitialDelay(reload);
  }

  protected fireProjectile(): void {
    this.skytelyd?.play();
    if (this.target) {
      this.gui.addProjectile(new NormalProjectile(this.gui, this, this.target, this.damage));
    }
  }

  toString(): string {
    return Co.NORMALTYPE;
  }
}

/** Tower of Frostshock: damages and slows everything in range. */
export class AreaTower extends Tower {
  private slowAmount = 0.3;

  constructor(gui: Board, xs: number, ys: number) {
    super(gui.getBilder().towerpic[Co.AREATYPE], gui, xs, ys);
    this.desription = `Slow: ${jdouble(this.slowAmount * 100)}%`;
    this.skytelyd = gui.getLyder().getAreaLyd();
  }

  setStats(): void {
    this.range = 80;
    this.speed = 2.0;
    this.damage = 20;
    this.name = 'Tower of Frostshock';
  }

  upgrade(): void {
    this.damage += 6;
    this.slowAmount += 0.05;
    this.level++;
    if (this.level === this.maxlevel) {
      this.range += 20;
      this.slowAmount = 0.5;
    }
    this.desription = `Slow: ${jdouble(this.slowAmount * 100)}%`;
  }

  loop(): void {
    if (this.target === null || this.target.isDead() || !this.sjekkrange(this.target)) {
      this.scan();
    } else if (this.ready) {
      this.fire();
    }
  }

  protected fireProjectile(): void {
    this.skytelyd?.play();
    this.gui.addAreaShot(
      new AreaShot(this.gui, this.getX() + idiv(this.getWidth(), 2), this.getY() + idiv(this.getHeight(), 2), this),
    );
    for (const e of [...this.gui.getEnemies()]) {
      if (this.sjekkrange(e)) {
        e.slow(this.slowAmount, this.damage);
        this.damagedone += this.damage;
      }
    }
  }

  toString(): string {
    return Co.AREATYPE;
  }
}

/** Tower of Scatterflames: one fireball per target, bouncing at max level. */
export class SpreadTower extends Tower {
  private maxtargets = 2;
  private bounce = false;
  private targets: (Enemy | null)[] = [];

  constructor(gui: Board, xs: number, ys: number) {
    super(gui.getBilder().towerpic[Co.SPREADTYPE], gui, xs, ys);
    this.skytelyd = gui.getLyder().getSpreadLyd();
    this.desription = `Fires ${this.maxtargets} fireballs`;
    for (let i = 0; i < this.maxtargets; i++) this.targets.push(null);
  }

  setStats(): void {
    this.range = 140;
    this.speed = 1.5;
    this.damage = 16;
    this.name = 'Tower of Scatterflames';
  }

  upgrade(): void {
    this.maxtargets += 1;
    this.targets = [];
    this.damage += 2;
    this.level++;
    if (this.level === this.maxlevel) {
      this.maxtargets = 4;
      this.damage -= 2;
      this.bounce = true;
    } else if (this.level === this.maxlevel - 1) {
      this.damage += 2;
    }
    this.desription = `Fires ${this.maxtargets} fireballs`;
    for (let i = 0; i < this.maxtargets; i++) this.targets.push(null);
  }

  loop(): void {
    for (let i = 0; i < this.targets.length; i++) this.targets[i] = null;
    this.scan();
    if (this.ready) this.fire();
  }

  protected fire(): void {
    if (this.targets[0] !== null) {
      this.fireProjectile();
      this.ready = false;
      this.timer.restart();
    }
  }

  protected scan(): void {
    const fiender = [...this.gui.getEnemies()];
    for (let i = 0; i < this.maxtargets; i++) {
      let higheststeps = 0;
      for (const e of fiender) {
        if (this.sjekkrange(e) && e.getSkritt() > higheststeps && !this.targets.includes(e)) {
          this.targets[i] = e;
          higheststeps = e.getSkritt();
        }
      }
    }
  }

  protected fireProjectile(): void {
    this.skytelyd?.play();
    for (let i = 0; i < this.targets.length; i++) {
      const t = this.targets[i];
      if (t === null || t.isDead() || !this.sjekkrange(t)) {
        this.targets[i] = null;
      } else {
        this.gui.addProjectile(new SpreadProjectile(this.gui, this, t, this.damage, this.bounce));
      }
    }
  }

  toString(): string {
    return Co.SPREADTYPE;
  }
}

/** Tower of Poisoning: prefers enemies with the fewest poison counters. */
export class PoisonTower extends Tower {
  constructor(gui: Board, xs: number, ys: number) {
    super(gui.getBilder().towerpic[Co.POISONTYPE], gui, xs, ys);
    this.skytelyd = gui.getLyder().getPoisonLyd();
  }

  setStats(): void {
    this.range = 120;
    this.speed = 1.2;
    this.damage = 2;
    this.name = 'Tower of Poisoning';
  }

  upgrade(): void {
    this.level++;
    this.damage += 1;
    if (this.level === this.getMaxLevel()) this.damage += 1;
  }

  protected isPoison(): boolean {
    return true;
  }

  protected scan(): void {
    let leastPoison = 100;
    let higheststeps = 0;
    for (const e of [...this.gui.getEnemies()]) {
      if (this.sjekkrange(e)) {
        if (e.getPoisonCounters() === leastPoison) {
          if (e.getSkritt() > higheststeps) {
            this.target = e;
            leastPoison = e.getPoisonCounters();
            higheststeps = e.getSkritt();
          }
        } else if (e.getPoisonCounters() < leastPoison) {
          this.target = e;
          leastPoison = e.getPoisonCounters();
        }
      }
    }
  }

  protected fireProjectile(): void {
    this.skytelyd?.play();
    if (this.target) {
      this.gui.addProjectile(new PoisonProjectile(this.gui, this, this.target, this.damage));
    }
    this.target = null;
  }

  toString(): string {
    return Co.POISONTYPE;
  }
}
