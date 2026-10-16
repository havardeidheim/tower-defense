import { Color, font, Graphics, Rect } from '../engine/Graphics';
import { Lyder } from '../game/Audio';
import type { Board } from '../game/Board';
import * as Co from '../game/Co';
import type { Img } from '../game/Pic';
import { TDObject } from '../game/TDObject';
import { Lightning, PlaceRunestone } from '../spells/Spells';
import { AreaTower, NormalTower, PoisonTower, SpreadTower } from '../towers/Towers';

/** Sprite button on the side panel (Knapp.java). */
export abstract class Knapp extends TDObject {
  loop(): void {}
  abstract clicked(): void;
}

const ADD_DESCRIPTIONS: Record<string, string[]> = {
  [Co.POISONTYPE]: [
    'Tower of Poisoning', '', '', 'Poisons the enemy causing', 'damage every second.',
    'Hits on already poisoned', 'enemies will increase the ', 'duration of the poison.',
    'Prioritizes nonpoisoned', 'enemies', '', 'Levelup:', 'Increased duration',
  ],
  [Co.NORMALTYPE]: [
    'Tower of Stonehurling', '', '', 'Hurls stones at the enemy', '', 'Levelup:',
    'Increased speed', 'Increased damage', 'Increased range',
  ],
  [Co.AREATYPE]: [
    'Tower of Frostshock', '', '', 'Damages and slows all', 'enemies in range', '', 'Levelup:',
    'Increased slow', 'Increased damage', '', 'Level 4:', 'Increased range',
  ],
  [Co.SPREADTYPE]: [
    'Tower of Scatterflames', '', '', 'Fires heatseeking fireballs', 'at multiple enemies', '',
    'Levelup:', 'Extra fireballs', 'Increased damage', '', 'Level 4', 'Fireballs now',
    'strike two targets',
  ],
  [Co.LIGHTNINGTYPE]: [
    'Lightningbolt', '', '', 'Stuns and damages a single', 'enemy. Killing normal',
    'enemies outright', '', "Can't be dodged",
  ],
  [Co.RUNESTONETYPE]: [
    'Place foundation', '', '', 'Places a foundation on', 'the ground, allowing you',
    'to build a tower on it.',
  ],
};

/** Buy-a-tower or cast-a-spell button (AddKnapp.java). */
export class AddKnapp extends Knapp {
  constructor(gui: Board, xs: number, ys: number, private type: string) {
    super(gui.getBilder().towerpic[type], gui, xs, ys);
  }

  isSpell(): boolean {
    return this.type === Co.LIGHTNINGTYPE || this.type === Co.RUNESTONETYPE;
  }

  /** Spell prices also come from the gold account's price list; they never change. */
  getPrice(): number {
    return this.gui.getKonto().pricefor(this.type);
  }

  getPriceString(): string {
    return (this.isSpell() ? 'Mana: ' : 'Price: ') + this.gui.getKonto().pricefor(this.type);
  }

  getType(): string {
    return this.type;
  }

  getDescription(): string[] {
    return ADD_DESCRIPTIONS[this.type] ?? [];
  }

  clicked(): void {
    const gui = this.gui;
    gui.getLyder().knapplyd.play();
    if (gui.isPlacingTower() || gui.isCastingSpell()) gui.cancelPlaceCast();

    const x = this.getX();
    const y = this.getY();
    if (!this.isSpell() && gui.getKonto().canAfford(this.type)) {
      if (this.type === Co.POISONTYPE) gui.addTower(new PoisonTower(gui, x, y));
      else if (this.type === Co.NORMALTYPE) gui.addTower(new NormalTower(gui, x, y));
      else if (this.type === Co.AREATYPE) gui.addTower(new AreaTower(gui, x, y));
      else if (this.type === Co.SPREADTYPE) gui.addTower(new SpreadTower(gui, x, y));
    } else if (gui.getMana().checkAmount(this.getPrice())) {
      if (this.type === Co.LIGHTNINGTYPE) gui.addSpell(new Lightning(gui, x, y));
      else if (this.type === Co.RUNESTONETYPE) gui.addSpell(new PlaceRunestone(gui, x, y));
    }
  }
}

const INFO_DESCRIPTIONS: Record<string, string[]> = {
  [Co.DODGEENEMYC]: ['Assassin', '', 'Low Health', 'Fast movement', '50% chance to dodge attacks'],
  [Co.NORMALENEMYC]: ['Peasant', '', 'Just a peasant'],
  [Co.FASTENEMYC]: ['Scout', '', 'Fast movement'],
  [Co.NOSLOWENEMYC]: [
    'Vanguard', '', 'Fast movement', 'Immune to slow', 'Blocks the three first',
    'attacks made to him',
  ],
  [Co.SUPERENEMYC]: [
    'Paragon', '', 'Low health', 'Fast movement', 'Immune to slow',
    '50% chance to dodge attacks', 'Mitigates a certain amount', 'of damage every hit, also',
    'work on poison damage',
  ],
  [Co.SHIELDENEMYC]: [
    'Solider', '', 'High health', 'Mitigates a certain amount', 'of damage every hit, also',
    'work on poison damage',
  ],
};

/** Enemy icon in the "next wave" panel (InfoKnapp.java). */
export class InfoKnapp extends Knapp {
  constructor(gui: Board, xs: number, ys: number, private type: string) {
    super(InfoKnapp.iconFor(gui, type), gui, xs, ys);
  }

  private static iconFor(gui: Board, type: string): Img {
    const p = gui.getBilder();
    switch (type) {
      case Co.DODGEENEMYC: return p.assassin.u;
      case Co.FASTENEMYC: return p.scout.u;
      case Co.NOSLOWENEMYC: return p.vanguard.u;
      case Co.SUPERENEMYC: return p.paragon.u;
      case Co.SHIELDENEMYC: return p.solider.u;
      default: return p.peasant.u;
    }
  }

  getType(): string {
    return this.type;
  }

  getDescription(): string[] {
    return INFO_DESCRIPTIONS[this.type] ?? [];
  }

  clicked(): void {}
}

/** Upgrade arrow for the selected tower (UpgradeKnapp.java). */
export class UpgradeKnapp extends Knapp {
  constructor(gui: Board, xs: number, ys: number) {
    super(gui.getBilder().upgradepic, gui, xs, ys);
  }

  clicked(): void {
    const t = this.gui.getSelectedTower();
    if (!t) return;
    const konto = this.gui.getKonto();
    if (t.getLevel() < t.getMaxLevel() && konto.checkAmount(t.getUpgradePrice())) {
      konto.withdraw(t.getUpgradePrice());
      this.gui.getLyder().buildlyd.play();
      t.upgrade();
    }
  }
}

/** Recycle button: refunds half the current price of that tower type plus 10 per level. */
export class SellKnapp extends Knapp {
  constructor(gui: Board, xs: number, ys: number) {
    super(gui.getBilder().sellpic, gui, xs, ys);
  }

  clicked(): void {
    const t = this.gui.getSelectedTower();
    if (!t) return;
    const konto = this.gui.getKonto();
    konto.deposit(Math.trunc(konto.pricefor(t.toString()) / 2) + t.getLevel() * 10);
    this.gui.getLyder().selllyd.play();
    this.gui.removeTower(t);
  }
}

/** Plain labelled button (SimpleKnapp.java). */
export class SimpleKnapp {
  private img: Img;

  constructor(
    private x: number,
    private y: number,
    private label: string,
    private action: () => void,
    bilder: { blancknapppic: Img },
  ) {
    this.img = bilder.blancknapppic;
  }

  setLabel(nylab: string): void {
    this.label = nylab;
  }

  getBounds(): Rect {
    return new Rect(this.x, this.y, this.img.width, this.img.height);
  }

  clicked(): void {
    Lyder().knapplyd.play();
    this.action();
  }

  draw(g: Graphics): void {
    g.drawImage(this.img, this.x, this.y);
    g.setFont(font(16));
    g.setColor(Color.ORANGE);
    g.drawString(this.label, this.x + 8, this.y + 20);
  }
}
