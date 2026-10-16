import { Rect } from '../engine/Graphics';
import type { Board } from './Board';
import type { Img } from './Pic';

/** Base for everything drawn with a sprite on the board (TDObject.java). */
export abstract class TDObject {
  img: Img;
  protected gui: Board;
  protected x: number;
  protected y: number;

  constructor(img: Img, gui: Board, xs: number, ys: number) {
    this.gui = gui;
    this.img = img;
    this.x = xs;
    this.y = ys;
  }

  getImg(): Img {
    return this.img;
  }

  setImg(img: Img): void {
    this.img = img;
  }

  getBounds(): Rect {
    return new Rect(Math.trunc(this.x), Math.trunc(this.y), this.img.width, this.img.height);
  }

  abstract loop(): void;

  getX(): number {
    return Math.trunc(this.x);
  }

  getY(): number {
    return Math.trunc(this.y);
  }

  setX(t: number): void {
    this.x = t;
  }

  setY(t: number): void {
    this.y = t;
  }

  getWidth(): number {
    return this.img.width;
  }

  getHeight(): number {
    return this.img.height;
  }
}
