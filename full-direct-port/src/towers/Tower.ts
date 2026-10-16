import type { AudioClip } from '../engine/AudioClip';
import { idiv, jdouble } from '../engine/Graphics';
import { SwingTimer } from '../engine/Scheduler';
import type { Enemy } from '../enemies/Enemy';
import { Lyder } from '../game/Audio';
import type { Board } from '../game/Board';
import type { Img } from '../game/Pic';
import { TDObject } from '../game/TDObject';

/** Base tower with a reload timer that runs in real time (Tower.java). */
export abstract class Tower extends TDObject {
  protected target: Enemy | null = null;
  protected speed = 0;
  protected damage = 0;
  protected range = 0;
  protected skytelyd: AudioClip | null = null;
  protected timer: SwingTimer;
  protected level = 0;
  protected ready = true;
  protected desription: string | null = null;
  protected name = '';
  protected maxlevel = 3;
  protected prices = [40, 80, 120];
  damagedone = 0;
  protected fast = false;

  constructor(img: Img, gui: Board, xs: number, ys: number) {
    super(img, gui, xs, ys);
    this.setStats();
    this.timer = new SwingTimer(gui.scheduler, Math.trunc(1000 * this.speed), () => {
      this.ready = true;
    });
    this.timer.start();
  }

  abstract upgrade(): void;
  abstract setStats(): void;
  abstract toString(): string;
  protected abstract fireProjectile(): void;

  clicked(): void {
    Lyder().selectlyd.play();
    this.gui.setSelectedTower(this);
  }

  getMaxLevel(): number {
    return this.maxlevel;
  }

  getUpgradePrice(): number {
    return this.level < this.maxlevel ? this.prices[this.level] : 0;
  }

  /** Targets the enemy in range that has walked furthest. */
  protected scan(): void {
    let higheststeps = 0;
    for (const e of [...this.gui.getEnemies()]) {
      if (this.sjekkrange(e) && e.getSkritt() > higheststeps) {
        higheststeps = e.getSkritt();
        this.target = e;
      }
    }
  }

  getStatsAsString(): string[] {
    const descr = [this.name, '', '', '', `Level: ${this.level + 1}`];
    descr.push(this.isPoison() ? `Damage: ${this.damage} * 18` : `Damage: ${this.damage}`);
    descr.push(`Range: ${this.range}`);
    descr.push(`Speed: ${jdouble(this.speed)}`);
    if (this.desription !== null) descr.push(this.desription);
    return descr;
  }

  protected isPoison(): boolean {
    return false;
  }

  protected fire(): void {
    if (this.target !== null) {
      if (this.target.isDead()) {
        this.target = null;
      } else if (this.sjekkrange(this.target)) {
        this.fireProjectile();
        this.ready = false;
        this.timer.restart();
      }
    }
  }

  /** A projectile lost its target, so the tower may fire again right away. */
  lostShot(): void {
    this.ready = true;
  }

  getRange(): number {
    return this.range;
  }

  getLevel(): number {
    return this.level;
  }

  protected sjekkrange(e: Enemy): boolean {
    // The original uses widths for both axes.
    const xdist = e.getX() + idiv(e.getWidth(), 2) - (this.x + idiv(this.getWidth(), 2));
    const ydist = e.getY() + idiv(e.getWidth(), 2) - (this.y + idiv(this.getWidth(), 2));
    const hypdist = Math.trunc(Math.sqrt(xdist * xdist + ydist * ydist));
    return hypdist <= this.range;
  }

  loop(): void {
    this.scan();
    if (this.ready) {
      this.fire();
      this.target = null;
    }
  }

  getDamageDone(): number {
    return this.damagedone;
  }

  /** Only changes the reload used after the next shot, and only for towers that exist when toggled. */
  speedchanged(arg: string): void {
    if (arg === 'slower') {
      this.timer.setInitialDelay(Math.trunc(1000 * this.speed));
      this.fast = false;
    } else if (arg === 'faster') {
      this.timer.setInitialDelay(Math.trunc((1000 * this.speed) / 2));
      this.fast = true;
    }
  }
}
