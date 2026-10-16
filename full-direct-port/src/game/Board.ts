import { AddKnapp, InfoKnapp, type Knapp, SellKnapp, SimpleKnapp, UpgradeKnapp } from '../buttons/Buttons';
import { DodgeEnemy, FastEnemy, NormalEnemy, NoslowEnemy, ShieldEnemy, SuperEnemy } from '../enemies/Enemies';
import type { Enemy } from '../enemies/Enemy';
import { Color, font, Graphics, idiv, Rect } from '../engine/Graphics';
import { Scheduler, SwingTimer } from '../engine/Scheduler';
import type { Projectile } from '../projectiles/Projectiles';
import { Lightning, PlaceRunestone } from '../spells/Spells';
import type { Tower } from '../towers/Tower';
import { Account, ManaAccount } from './Account';
import type { AreaShot } from './AreaShot';
import { Audio } from './Audio';
import * as Co from './Co';
import { TDHelp } from './Help';
import type { Level, LevelsReader, Point } from './Level';
import type { MainFrame } from './MainFrame';
import { Pic } from './Pic';
import type { TDObject } from './TDObject';

function removeFrom<T>(list: T[], item: T): void {
  const i = list.indexOf(item);
  if (i >= 0) list.splice(i, 1);
}

/** The in-game screen: map, side panel, game loop and input (Board.java). */
export class Board {
  readonly scheduler = new Scheduler();
  private bilder = new Pic();
  private lyder = new Audio();
  private konto!: Account;
  private mana!: Account;
  private level: Level;

  private timer: SwingTimer;
  private enemyTimer: SwingTimer;
  private poisonTimer: SwingTimer;
  private avslutttimer: SwingTimer;

  private knapper: Knapp[] = [];
  private knapper2: SimpleKnapp[] = [];

  private fiender: Enemy[] = [];
  private taarn: Tower[] = [];
  private prosjektiler: Projectile[] = [];
  private areaskudd: AreaShot[] = [];

  private areaskuddbin: AreaShot[] = [];
  private fienderbin: Enemy[] = [];
  private taarnbin: Tower[] = [];
  private prosjektilerbin: Projectile[] = [];

  private wavenumber = -1;
  private enemynumber = 0;

  private placingtower = false;
  private castingspell = false;
  private helpscreenon = false;

  private placethis: Tower | null = null;
  private castingthis: TDObject | null = null;

  private selectedTower: Tower | null = null;
  private upgradeKnapp: UpgradeKnapp;
  private sellKnapp: SellKnapp;

  private speedupknapp: SimpleKnapp;
  private startknapp: SimpleKnapp;
  private resetknapp: SimpleKnapp;
  private pauseknapp: SimpleKnapp;
  private resumeknapp: SimpleKnapp;
  private mainmenuknapp: SimpleKnapp;
  private helpknapp: SimpleKnapp;

  private health = 5;
  private paused = false;
  private started = false;
  private fast = false;
  private grantedmana = false;

  private helpscreen: TDHelp | null = null;

  /** Where the mouse is over the canvas, or null (Component.getMousePosition()). */
  mouse: Point | null = null;

  constructor(private levelleser: LevelsReader, private lvlnr: number, private mainframe: MainFrame) {
    this.level = levelleser.getLevelAt(lvlnr);

    // The game logic runs every 20 ms; "Faster" runs it twice per tick.
    this.timer = new SwingTimer(this.scheduler, 20, () => {
      if (!this.paused) {
        this.loop();
        if (this.fast && !(this.wavenumber >= this.level.getWaves().length || this.health <= 0)) {
          this.loop();
        }
      }
    });
    this.enemyTimer = new SwingTimer(this.scheduler, 1000, () => this.spawnTick());
    this.poisonTimer = new SwingTimer(this.scheduler, 700, () => this.poisonloop());
    this.avslutttimer = new SwingTimer(this.scheduler, 1000, () => {
      this.avslutttimer.stop();
      this.timer.stop();
      this.enemyTimer.stop();
      this.poisonTimer.stop();
      this.mainframe.showmenu(this.health);
    });
    this.timer.start();

    this.knapper.push(new InfoKnapp(this, 680, 395, Co.NORMALENEMYC));
    this.knapper.push(new InfoKnapp(this, 750, 395, Co.FASTENEMYC));
    this.knapper.push(new InfoKnapp(this, 820, 395, Co.SHIELDENEMYC));
    this.knapper.push(new InfoKnapp(this, 680, 435, Co.DODGEENEMYC));
    this.knapper.push(new InfoKnapp(this, 750, 435, Co.NOSLOWENEMYC));
    this.knapper.push(new InfoKnapp(this, 820, 435, Co.SUPERENEMYC));

    this.knapper.push(new AddKnapp(this, 650, 35, Co.NORMALTYPE));
    this.knapper.push(new AddKnapp(this, 700, 35, Co.AREATYPE));
    this.knapper.push(new AddKnapp(this, 750, 35, Co.SPREADTYPE));
    this.knapper.push(new AddKnapp(this, 800, 35, Co.POISONTYPE));
    this.knapper.push(new AddKnapp(this, 650, 105, Co.LIGHTNINGTYPE));
    this.knapper.push(new AddKnapp(this, 700, 105, Co.RUNESTONETYPE));

    const b = this.bilder;
    this.mainmenuknapp = new SimpleKnapp(48, 10, 'Menu', () => {
      this.pause();
      this.timer.stop();
      this.enemyTimer.stop();
      this.poisonTimer.stop();
      this.health = 0;
      this.mainframe.showmenu(0);
    }, b);
    this.helpknapp = new SimpleKnapp(166, 10, 'Help', () => this.showhelpscreen(), b);
    this.startknapp = new SimpleKnapp(284, 10, 'Start', () => this.start(), b);
    this.resetknapp = new SimpleKnapp(284, 10, 'Reset', () => this.reset(), b);
    this.pauseknapp = new SimpleKnapp(402, 10, 'Pause', () => this.pause(), b);
    this.resumeknapp = new SimpleKnapp(402, 10, 'Resume', () => this.resume(), b);
    this.speedupknapp = new SimpleKnapp(520, 10, 'Faster', () => this.speedup(), b);

    this.knapper2.push(this.speedupknapp, this.pauseknapp, this.mainmenuknapp, this.startknapp, this.helpknapp);
    if (lvlnr === 0) this.showhelpscreen();

    this.upgradeKnapp = new UpgradeKnapp(this, 800, 155);
    this.sellKnapp = new SellKnapp(this, 800, 200);
    this.newAccounts();
  }

  private newAccounts(): void {
    this.konto = new Account(180);
    this.mana = new ManaAccount(this.lvlnr === 3 ? 240 : 60);
  }

  /** Advances the virtual clock by real elapsed time. */
  update(ms: number): void {
    this.scheduler.advance(ms);
  }

  /** One enemy-timer tick: spawn the next character of the wave, or move on once the field is clear. */
  private spawnTick(): void {
    const wave = this.level.getWaves()[this.wavenumber];
    if (wave === undefined) return;
    if (this.enemynumber < wave.length) {
      let nivaa = 0;
      const c = wave.charAt(this.enemynumber);
      if (c >= '0' && c <= '9') {
        nivaa = Number(c);
        this.enemynumber++;
      }
      if (this.enemynumber >= wave.length) return; // a trailing digit, as the original's exception
      this.addEnemy(wave.charAt(this.enemynumber), nivaa);
      this.enemynumber++;
    } else if (this.fiender.length === 0) {
      this.wavenumber++;
      this.enemynumber = 0;
    }
  }

  start(): void {
    this.paused = false;
    this.started = true;
    this.wavenumber++;
    this.lyder.startlyd[this.lvlnr]?.play();
    this.enemyTimer.restart();
    this.poisonTimer.restart();
    removeFrom(this.knapper2, this.startknapp);
    this.knapper2.push(this.resetknapp);
  }

  reset(): void {
    this.started = false;
    this.cleanup();
    this.level = this.levelleser.getLevelAt(this.lvlnr);
    this.enemyTimer.stop();
    this.poisonTimer.stop();

    this.fiender = [];
    this.prosjektiler = [];
    this.areaskudd = [];

    this.health = 5;
    this.wavenumber = -1;
    this.enemynumber = 0;

    this.newAccounts();
    this.taarn = [];

    removeFrom(this.knapper2, this.resetknapp);
    this.knapper2.push(this.startknapp);
    if (this.knapper2.includes(this.resumeknapp)) {
      removeFrom(this.knapper2, this.resumeknapp);
      this.knapper2.push(this.pauseknapp);
    }

    this.speedupknapp.setLabel('Faster');
    this.enemyTimer.setDelay(1000);
    this.poisonTimer.setDelay(700);
    this.fast = false;
    this.cleanup();
  }

  speedup(): void {
    if (this.fast) {
      this.speedupknapp.setLabel('Faster');
      this.enemyTimer.setDelay(1000);
      this.poisonTimer.setDelay(700);
      this.fast = false;
      for (const e of [...this.fiender]) e.speedchanged('slower');
      for (const t of this.taarn) t.speedchanged('slower');
    } else {
      this.speedupknapp.setLabel('Slower');
      this.enemyTimer.setDelay(500);
      this.poisonTimer.setDelay(350);
      this.fast = true;
      for (const e of [...this.fiender]) e.speedchanged('faster');
      for (const t of this.taarn) t.speedchanged('faster');
    }
  }

  damagePlayer(dmg: number): void {
    this.health -= dmg;
  }

  /** Poison ticks every 0.7 s; mana regenerates by 1 on every other tick. */
  poisonloop(): void {
    if (!this.grantedmana) {
      this.mana.deposit(1);
      this.grantedmana = true;
    } else {
      this.grantedmana = false;
    }
    for (const e of [...this.fiender]) e.poisonTick();
  }

  pause(): void {
    if (this.started) {
      this.enemyTimer.stop();
      this.poisonTimer.stop();
      this.paused = true;
      removeFrom(this.knapper2, this.pauseknapp);
      this.knapper2.push(this.resumeknapp);
      this.cleanup();
    }
  }

  resume(): void {
    this.enemyTimer.start();
    this.poisonTimer.start();
    this.paused = false;
    removeFrom(this.knapper2, this.resumeknapp);
    this.knapper2.push(this.pauseknapp);
    this.cleanup();
  }

  loop(): void {
    if (this.wavenumber >= this.level.getWaves().length || this.health <= 0) {
      if (this.health >= 4) this.lyder.verygood.play();
      else if (this.health <= 0) this.lyder.dielyd.play();
      else this.lyder.oklyd.play();
      this.timer.stop();
      this.enemyTimer.stop();
      this.poisonTimer.stop();
      this.pause();
      this.avslutttimer.start();
    }

    this.cleanup();
    for (const e of [...this.fiender]) e.loop();
    for (const t of [...this.taarn]) t.loop();
    for (const p of [...this.prosjektiler]) p.loop();
    for (const a of [...this.areaskudd]) a.loop();
    this.cleanup();
  }

  private cleanup(): void {
    for (const p of this.prosjektilerbin) removeFrom(this.prosjektiler, p);
    for (const e of this.fienderbin) removeFrom(this.fiender, e);
    for (const t of this.taarnbin) removeFrom(this.taarn, t);
    for (const a of this.areaskuddbin) removeFrom(this.areaskudd, a);
    this.prosjektilerbin = [];
    this.fienderbin = [];
    this.taarnbin = [];
    this.areaskuddbin = [];
  }

  paint(g: Graphics): void {
    const S = Co.IMGSIZE;
    const b = this.bilder;
    const mp = this.mouse;

    g.setColor(Co.BGCOLOR);
    g.fillRect(0, 0, Co.WIDTH, Co.HEIGHT);
    g.drawImage(b.backgroundpic, 0, 0);
    g.setFont(font(16));

    const drawlevel = this.level.getLevel();
    for (let i = 0; i < drawlevel.length; i++) {
      for (let j = 0; j < drawlevel[i].length; j++) {
        const c = drawlevel[i][j];
        if (c === Co.PATHC || c === Co.SPAWNC || c === Co.TARGETC) g.drawImage(b.pathpic, j * S, i * S);
        if (c === Co.SPAWNC) g.drawImage(b.spawnpic, j * S, i * S);
      }
    }

    for (const a of this.areaskudd) g.drawImage(a.getImg(), a.getX(), a.getY(), a.getWidth(), a.getHeight());

    for (let i = 0; i < drawlevel.length; i++) {
      for (let j = 0; j < drawlevel[i].length; j++) {
        if (drawlevel[i][j] === Co.GROUNDC) g.drawImage(b.blanctowerpic, j * S, i * S);
      }
    }

    const waves = this.level.getWaves();
    g.setColor(Color.BLACK);
    g.drawString(`Wave#: ${this.wavenumber + 1}/ ${waves.length}`, 645, 382);
    g.drawString('Next wave:', 760, 382);
    g.drawLine(640, 360, 850, 360);
    g.drawLine(640, 150, 850, 150);
    g.drawLine(640, 0, 640, 550);

    g.setColor(Color.RED);
    g.drawString(`Health: ${this.health}`, 770, 25);
    g.setColor(Color.ORANGE);
    g.drawString(`Gold: ${this.konto.getBalance()}`, 650, 25);
    g.setColor(Color.BLUE);
    g.drawString(`Mana: ${this.mana.getBalance()}`, 650, 95);

    const numenemies = new Map<string, number>();
    const nextwave = this.wavenumber + 1 >= waves.length ? '' : waves[this.wavenumber + 1];
    for (const ch of nextwave) numenemies.set(ch, (numenemies.get(ch) ?? 0) + 1);

    let gotoverknapp = false;
    for (const k of this.knapper) {
      g.drawImage(k.getImg(), k.getX(), k.getY());
      const hovered = mp !== null && k.getBounds().contains(mp.x, mp.y);
      if (k instanceof AddKnapp) {
        const funds = k.isSpell() ? this.mana.getBalance() : this.konto.getBalance();
        if (k.getPrice() > funds) g.drawImage(b.crosspic, k.getX(), k.getY());
        if (hovered) {
          gotoverknapp = true;
          g.setColor(k.isSpell() ? Color.BLUE : Color.ORANGE);
          g.drawString(k.getPriceString(), 650, 182);
          const d = k.getDescription();
          g.setColor(Color.BLACK);
          for (let i = 0; i < d.length; i++) g.drawString(d[i], 650, 167 + 15 * i);
        }
      } else if (k instanceof InfoKnapp) {
        g.setColor(Color.BLACK);
        g.drawString(`${numenemies.get(k.getType()) ?? 0} x `, k.getX() - 30, k.getY() + 16);
        if (hovered) {
          gotoverknapp = true;
          const d = k.getDescription();
          for (let i = 0; i < d.length; i++) g.drawString(d[i], 650, 167 + 15 * i);
        }
      }
    }

    const sel = this.selectedTower;
    if (sel !== null) {
      if (!gotoverknapp) {
        const stats = sel.getStatsAsString();
        g.setColor(Color.BLACK);
        for (let i = 0; i < stats.length; i++) g.drawString(stats[i], 650, 167 + i * 15);
        g.drawImage(this.upgradeKnapp.getImg(), this.upgradeKnapp.getX(), this.upgradeKnapp.getY());
        g.drawImage(this.sellKnapp.getImg(), this.sellKnapp.getX(), this.sellKnapp.getY());
        g.setColor(Color.ORANGE);
        g.drawString(`Upgrade: ${sel.getUpgradePrice()}`, 650, 182);
        g.drawString(`Sell: ${idiv(this.konto.pricefor(sel.toString()), 2) + sel.getLevel() * 10}`, 650, 197);
        if (sel.getLevel() >= sel.getMaxLevel() || sel.getUpgradePrice() > this.konto.getBalance()) {
          g.drawImage(b.crosspic, this.upgradeKnapp.getX(), this.upgradeKnapp.getY());
        }
      }
      g.drawImage(b.selectpic, sel.getX() - 2, sel.getY() - 2);
      this.drawRange(g, sel);
    }

    for (const e of this.fiender) {
      g.drawImage(e.getImg(), e.getX(), e.getY());
      g.setColor(Color.BLACK);
      g.fillRect(e.getX(), e.getY() - 4, e.getWidth(), 4);
      g.setColor(Color.GREEN);
      g.fillRect(e.getX(), e.getY() - 4, e.getHealthWidth(), 4);
    }
    for (const t of this.taarn) g.drawImage(t.getImg(), t.getX(), t.getY());
    for (const p of this.prosjektiler) g.drawImage(p.getImg(), p.getX(), p.getY());

    if (this.placingtower && this.placethis && mp && Co.DRAWINGAREA.contains(mp.x, mp.y)) {
      const pt = this.placethis;
      const xp = idiv(mp.x, S);
      const yp = idiv(mp.y, S);
      pt.setX(xp * S);
      pt.setY(yp * S);
      g.drawImage(pt.getImg(), pt.getX(), pt.getY());
      const blocked = drawlevel[yp][xp] !== Co.GROUNDC || this.towerAt(mp.x, mp.y);
      if (blocked) g.drawImage(b.crosspic, pt.getX(), pt.getY());
      this.drawRange(g, pt);
    }

    if (this.castingspell && this.castingthis && mp && Co.DRAWINGAREA.contains(mp.x, mp.y)) {
      const ct = this.castingthis;
      if (ct instanceof PlaceRunestone) {
        const xp = idiv(mp.x, S);
        const yp = idiv(mp.y, S);
        ct.setX(xp * S);
        ct.setY(yp * S);
        g.drawImage(ct.getImg(), ct.getX(), ct.getY());
        const blocked = drawlevel[yp][xp] !== Co.OBSTACLEC || this.towerAt(mp.x, mp.y);
        if (blocked) g.drawImage(b.crosspic, ct.getX(), ct.getY());
      } else {
        ct.setX(mp.x);
        ct.setY(mp.y);
        g.drawImage(ct.getImg(), ct.getX() - ct.getWidth(), ct.getY() - ct.getHeight());
      }
    }

    if (this.helpscreenon && this.helpscreen) this.helpscreen.draw(g);
    for (const k of this.knapper2) k.draw(g);
  }

  private drawRange(g: Graphics, t: Tower): void {
    const r = t.getRange();
    g.drawImage(
      this.bilder.rangepic.get(r),
      t.getX() + idiv(t.getWidth(), 2) - r,
      t.getY() + idiv(t.getHeight(), 2) - r,
      r * 2,
      r * 2,
    );
  }

  private towerAt(px: number, py: number): boolean {
    return this.taarn.some((t) => new Rect(t.getX(), t.getY(), Co.IMGSIZE, Co.IMGSIZE).contains(px, py));
  }

  getEnemies(): Enemy[] {
    return this.fiender;
  }

  addEnemy(c: string, nivaa: number): void {
    const start = this.level.getStartPos();
    const xs = start.x * Co.IMGSIZE + Co.IMGSIZE / 2;
    const ys = start.y * Co.IMGSIZE + Co.IMGSIZE / 2;
    if (c === Co.NORMALENEMYC) this.fiender.push(new NormalEnemy(this, xs, ys, nivaa));
    else if (c === Co.FASTENEMYC) this.fiender.push(new FastEnemy(this, xs, ys, nivaa));
    else if (c === Co.SHIELDENEMYC) this.fiender.push(new ShieldEnemy(this, xs, ys, nivaa));
    else if (c === Co.DODGEENEMYC) this.fiender.push(new DodgeEnemy(this, xs, ys, nivaa));
    else if (c === Co.NOSLOWENEMYC) this.fiender.push(new NoslowEnemy(this, xs, ys, nivaa));
    else if (c === Co.SUPERENEMYC) this.fiender.push(new SuperEnemy(this, xs, ys, nivaa));
  }

  addTower(t: Tower): void {
    this.placingtower = true;
    this.placethis = t;
  }

  addSpell(s: TDObject): void {
    this.castingspell = true;
    this.castingthis = s;
  }

  addProjectile(p: Projectile): void {
    this.prosjektiler.push(p);
  }

  addAreaShot(a: AreaShot): void {
    this.areaskudd.push(a);
  }

  addKnapp(k: SimpleKnapp): void {
    this.knapper2.push(k);
  }

  removeKnapp(k: SimpleKnapp): void {
    removeFrom(this.knapper2, k);
  }

  removeEnemy(e: Enemy): void {
    this.fienderbin.push(e);
  }

  removeTower(t: Tower): void {
    this.taarnbin.push(t);
  }

  removeProjectile(p: Projectile): void {
    this.prosjektilerbin.push(p);
  }

  removeAreaShot(a: AreaShot): void {
    this.areaskuddbin.push(a);
  }

  getBilder(): Pic {
    return this.bilder;
  }

  getKonto(): Account {
    return this.konto;
  }

  getMana(): Account {
    return this.mana;
  }

  getLevel(): Level {
    return this.level;
  }

  getLyder(): Audio {
    return this.lyder;
  }

  getSelectedTower(): Tower | null {
    return this.selectedTower;
  }

  isPlacingTower(): boolean {
    return this.placingtower;
  }

  isCastingSpell(): boolean {
    return this.castingspell;
  }

  cancelPlaceCast(): void {
    this.placingtower = false;
    this.placethis = null;
    this.castingspell = false;
    this.castingthis = null;
  }

  setSelectedTower(t: Tower | null): void {
    this.selectedTower = t;
  }

  showhelpscreen(): void {
    this.helpscreen = new TDHelp(this, 100, 100);
    this.helpscreenon = true;
  }

  hidehelpscreen(): void {
    this.helpscreen = null;
    this.helpscreenon = false;
  }

  /** Mouse press. button: 0 left, 1 middle, 2 right (right cancels everything). */
  mousePressed(x: number, y: number, button: number): void {
    if (button === 2) {
      this.cancelPlaceCast();
      this.selectedTower = null;
      return;
    }

    if (this.selectedTower !== null) {
      if (this.upgradeKnapp.getBounds().contains(x, y)) {
        if (this.selectedTower.getLevel() < this.selectedTower.getMaxLevel()) this.upgradeKnapp.clicked();
        return;
      } else if (this.sellKnapp.getBounds().contains(x, y)) {
        this.sellKnapp.clicked();
        this.selectedTower = null;
        return;
      }
    }
    this.selectedTower = null;

    for (const t of this.taarn) {
      if (t.getBounds().contains(x, y)) {
        t.clicked();
        return;
      }
    }

    const S = Co.IMGSIZE;
    if (this.placingtower && this.placethis && this.konto.canAfford(this.placethis.toString())) {
      const brett = this.level.getLevel();
      const xp = idiv(x, S);
      const yp = idiv(y, S);
      if (Co.DRAWINGAREA.contains(x, y) && brett[yp][xp] === Co.GROUNDC) {
        if (this.towerAt(x, y)) return;
        // The original relied on paint() having moved the preview to this tile already.
        this.placethis.setX(xp * S);
        this.placethis.setY(yp * S);
        this.taarn.push(this.placethis);
        this.lyder.buildlyd.play();
        this.konto.payfor(this.placethis.toString());
        this.placingtower = false;
        this.placethis = null;
      }
    }

    if (this.castingspell && this.mana.checkAmount(50) && Co.DRAWINGAREA.contains(x, y)) {
      const ct = this.castingthis;
      if (ct instanceof Lightning) {
        for (const en of [...this.fiender]) {
          if (en.getBounds().contains(x, y)) {
            this.lyder.lynlyd.play();
            ct.castOn(en);
            this.mana.withdraw(50);
            this.castingspell = false;
            this.castingthis = null;
            return;
          }
        }
      } else if (ct instanceof PlaceRunestone) {
        if (this.level.getLevel()[idiv(y, S)][idiv(x, S)] === Co.OBSTACLEC) {
          this.lyder.buildlyd.play();
          ct.cast(idiv(y, S), idiv(x, S));
          this.mana.withdraw(50);
          this.castingspell = false;
          this.castingthis = null;
          return;
        }
      }
    }

    for (const k of this.knapper) {
      if (k.getBounds().contains(x, y)) {
        k.clicked();
        return;
      }
    }
    for (const k of this.knapper2) {
      if (k.getBounds().contains(x, y)) {
        k.clicked();
        return;
      }
    }
  }
}
