import type { Enemy } from '../enemies/Enemy';
import type { Board } from '../game/Board';
import * as Co from '../game/Co';
import { TDObject } from '../game/TDObject';

/** Lightningbolt: stuns and deals 200 damage to one enemy. Nothing resists it. */
export class Lightning extends TDObject {
  constructor(gui: Board, xs: number, ys: number) {
    super(gui.getBilder().lightningpic, gui, xs, ys);
  }

  castOn(e: Enemy): void {
    e.spellDamage(1, 200);
  }

  loop(): void {}

  toString(): string {
    return Co.LIGHTNINGTYPE;
  }
}

/** Place foundation: turns an obstacle tile into buildable ground. */
export class PlaceRunestone extends TDObject {
  constructor(gui: Board, xs: number, ys: number) {
    super(gui.getBilder().blanctowerpic, gui, xs, ys);
  }

  cast(i: number, j: number): void {
    const arr = this.gui.getLevel().getLevel();
    if (arr[i][j] === Co.OBSTACLEC) arr[i][j] = Co.GROUNDC;
  }

  loop(): void {}

  toString(): string {
    return Co.RUNESTONETYPE;
  }
}
