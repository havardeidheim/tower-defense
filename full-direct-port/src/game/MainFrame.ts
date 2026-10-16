import type { Graphics } from '../engine/Graphics';
import { Board } from './Board';
import { LevelsReader } from './Level';
import { TDMenu } from './Menu';
import * as SaveManager from './SaveManager';

/** Switches between the menu and a level, and tracks progress (MainFrame.java). */
export class MainFrame {
  private board: Board | null = null;
  private menu: TDMenu | null = null;
  private levelacces: boolean[];
  private levelstars: number[];
  private levelleser = new LevelsReader();
  private lastlevel = 0;
  private mouse: { x: number; y: number } | null = null;

  constructor() {
    const n = this.levelleser.getLevelCount();
    const saved = SaveManager.load(n);
    this.levelacces = saved?.levelacces ?? new Array<boolean>(n).fill(false);
    this.levelstars = saved?.levelstars ?? new Array<number>(n).fill(0);
    this.levelacces[0] = true;
    this.showmenu(this.levelstars[this.lastlevel]);
  }

  getlevelstars(): number[] {
    return this.levelstars;
  }

  getlevelacces(): boolean[] {
    return this.levelacces;
  }

  /** Back to the menu. Stars are the health left; any star unlocks the next level. */
  showmenu(s: number): void {
    this.menu = new TDMenu(this, this.levelleser);
    this.board = null;
    if (s > 0 && this.lastlevel + 1 < this.levelacces.length) this.levelacces[this.lastlevel + 1] = true;
    if (s > this.levelstars[this.lastlevel]) this.levelstars[this.lastlevel] = s;
    SaveManager.save({ levelacces: this.levelacces, levelstars: this.levelstars });
  }

  newgame(lvlnr: number): void {
    this.board = new Board(this.levelleser, lvlnr, this);
    this.menu = null;
    this.lastlevel = lvlnr;
  }

  update(ms: number): void {
    this.board?.update(ms);
  }

  paint(g: Graphics): void {
    if (this.board) {
      this.board.mouse = this.mouse;
      this.board.paint(g);
    } else {
      this.menu?.paint(g);
    }
  }

  setMouse(p: { x: number; y: number } | null): void {
    this.mouse = p;
  }

  mousePressed(x: number, y: number, button: number): void {
    this.board?.mousePressed(x, y, button);
  }

  mouseClicked(x: number, y: number): void {
    this.menu?.mouseClicked(x, y);
  }
}
