import type { Enemy } from '../enemies/Enemy';
import { ShieldEnemy, SuperEnemy } from '../enemies/Enemies';
import { idiv } from '../engine/Graphics';
import type { Board } from '../game/Board';
import type { Img } from '../game/Pic';
import { TDObject } from '../game/TDObject';
import type { Tower } from '../towers/Tower';

/** Heat-seeking projectile fired from the centre of a tower (Projectile.java). */
export abstract class Projectile extends TDObject {
  protected target: Enemy | null;
  protected tower: Tower;
  protected xdist = 0;
  protected ydist = 0;
  protected xspeed = 0;
  protected yspeed = 0;
  protected speed = 6;
  protected damage: number;

  constructor(img: Img, gui: Board, t: Tower, e: Enemy, dmg: number) {
    super(img, gui, t.getX() + idiv(t.getWidth(), 2), t.getY() + idiv(t.getHeight(), 2));
    this.target = e;
    this.tower = t;
    this.damage = dmg;
  }

  loop(): void {
    if (!this.validtarget()) {
      this.die();
      return;
    }
    this.heatSeek();
    this.x += this.xspeed;
    this.y += this.yspeed;
    this.hitTest();
  }

  /** Distance from this projectile's centre to the target's centre, in whole pixels. */
  protected distanceToTarget(target: Enemy): number {
    this.xdist = target.getX() + idiv(target.getWidth(), 2) - (this.x + idiv(this.getWidth(), 2));
    this.ydist = target.getY() + idiv(target.getHeight(), 2) - (this.y + idiv(this.getHeight(), 2));
    return Math.trunc(Math.sqrt(this.xdist * this.xdist + this.ydist * this.ydist));
  }

  protected heatSeek(): void {
    if (!this.target) return;
    this.distanceToTarget(this.target);
    const radianer = Math.atan2(this.ydist, this.xdist);
    this.xspeed = this.speed * Math.cos(radianer);
    this.yspeed = this.speed * Math.sin(radianer);
  }

  protected validtarget(): boolean {
    if (this.target === null || this.target.isDead()) {
      this.tower.lostShot();
      return false;
    }
    return true;
  }

  protected isHit(target: Enemy): boolean {
    return this.distanceToTarget(target) < idiv(this.getWidth(), 2) + idiv(target.getWidth(), 2);
  }

  protected hitTest(): void {
    const target = this.target;
    if (target && this.isHit(target)) {
      target.takedamge(this.damage);
      if (target instanceof ShieldEnemy || target instanceof SuperEnemy) {
        this.tower.damagedone += this.damage - 10;
      } else {
        this.tower.damagedone += this.damage;
      }
      this.die();
    }
  }

  protected die(): void {
    this.target = null;
    this.gui.removeProjectile(this);
  }
}

/** Stone. */
export class NormalProjectile extends Projectile {
  constructor(gui: Board, t: Tower, e: Enemy, dmg: number) {
    super(gui.getBilder().normalprojectileimage, gui, t, e, dmg);
  }
}

/** Adds poison counters instead of dealing damage on hit. */
export class PoisonProjectile extends Projectile {
  constructor(gui: Board, t: Tower, e: Enemy, dmg: number) {
    super(gui.getBilder().poisonprojectileimage, gui, t, e, dmg);
  }

  protected hitTest(): void {
    const target = this.target;
    if (target && this.isHit(target)) {
      target.poison(this.damage);
      if (target instanceof ShieldEnemy || target instanceof SuperEnemy) {
        this.tower.damagedone += idiv(this.damage * 20, 2);
      } else {
        this.tower.damagedone += this.damage * 20;
      }
      this.die();
    }
  }
}

/** Slow fireball. A bouncing one seeks a second enemy within 80 px after its first hit. */
export class SpreadProjectile extends Projectile {
  private range = 80;
  private bounced = true;
  private hasbounced = false;
  private usedtarget: Enemy | null = null;

  constructor(gui: Board, t: Tower, e: Enemy, dmg: number, canbounce: boolean) {
    super(gui.getBilder().spreadprojectileimage, gui, t, e, dmg);
    this.speed = 3;
    if (canbounce) this.bounced = false;
  }

  /** Unlike the others, a lost fireball does not let its tower fire early. */
  protected validtarget(): boolean {
    if (this.target === null || this.target.isDead()) {
      this.target = null;
      return false;
    }
    return true;
  }

  loop(): void {
    if (!this.validtarget()) {
      this.scan();
      if (this.target === null) {
        this.die();
        return;
      }
    }
    this.heatSeek();
    this.x += this.xspeed;
    this.y += this.yspeed;
    this.hitTest();
  }

  protected hitTest(): void {
    const target = this.target;
    if (target && this.isHit(target)) {
      target.takedamge(this.damage);
      this.tower.damagedone += this.damage;
      if (this.bounced) {
        this.die();
      } else {
        this.bounced = true;
        this.hasbounced = true;
        this.usedtarget = target;
        this.target = null;
      }
    }
  }

  private scan(): void {
    let fiender = [...this.gui.getEnemies()];
    if (this.hasbounced) {
      const i = fiender.indexOf(this.usedtarget as Enemy);
      if (i >= 0) fiender.splice(i, 1);
    }
    let higheststeps = 0;
    for (const e of fiender) {
      if (this.sjekkrange(e) && e.getSkritt() > higheststeps) {
        higheststeps = e.getSkritt();
        this.target = e;
      }
    }
  }

  private sjekkrange(e: Enemy): boolean {
    const xdist = e.getX() + idiv(e.getWidth(), 2) - (this.x + idiv(this.getWidth(), 2));
    const ydist = e.getY() + idiv(e.getWidth(), 2) - (this.y + idiv(this.getWidth(), 2));
    return Math.trunc(Math.sqrt(xdist * xdist + ydist * ydist)) <= this.range;
  }
}
