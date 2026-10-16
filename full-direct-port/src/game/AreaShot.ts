import type { Tower } from '../towers/Tower';
import type { Board } from './Board';
import type { Img } from './Pic';
import { TDObject } from './TDObject';

/** The frost ring animation, one frame per game tick, scaled to the tower's range. */
export class AreaShot extends TDObject {
  private frames = 0;
  private opx: number;
  private opy: number;
  private skuttav: Tower;
  private bilder: Img[];

  constructor(gui: Board, xs: number, ys: number, t: Tower) {
    super(gui.getBilder().areashot[0], gui, xs, ys);
    this.opx = xs;
    this.opy = ys;
    this.bilder = gui.getBilder().areashot;
    this.skuttav = t;
  }

  getWidth(): number {
    return this.skuttav.getRange() * 2;
  }

  getHeight(): number {
    return this.skuttav.getRange() * 2;
  }

  loop(): void {
    if (this.frames >= this.bilder.length) {
      this.gui.removeAreaShot(this);
      return;
    }
    this.setImg(this.bilder[this.frames]);
    this.setX(Math.trunc(this.opx - this.getWidth() / 2));
    this.setY(Math.trunc(this.opy - this.getHeight() / 2));
    this.frames++;
  }
}
