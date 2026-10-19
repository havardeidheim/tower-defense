/**
 * Runs the full direct port (../full-direct-port), the reference copy of the
 * original game, headless in Node, so the polished port can be compared with it
 * tick by tick. Images only need their sizes; sounds are left out.
 */
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { DIRECT_PORT, fileExists } from './files';

const PUBLIC = join(DIRECT_PORT, 'public');

/** Reads width and height from a PNG header. */
function pngSize(path: string): { width: number; height: number } {
  const header = readFileSync(path).subarray(16, 24);
  return { width: header.readUInt32BE(0), height: header.readUInt32BE(4) };
}

class HeadlessImage {
  width = 0;
  height = 0;
  onload: (() => void) | null = null;
  onerror: (() => void) | null = null;

  set src(url: string) {
    const path = join(PUBLIC, url);
    queueMicrotask(() => {
      if (!fileExists(path)) {
        this.onerror?.();
        return;
      }
      Object.assign(this, pngSize(path));
      this.onload?.();
    });
  }
}

async function headlessFetch(url: string): Promise<Response> {
  const path = join(PUBLIC, url);
  if (!url.startsWith('levels/') || !fileExists(path)) {
    return { ok: false } as Response;
  }
  const text = readFileSync(path, 'utf8');
  return { ok: true, text: async () => text } as Response;
}

let loaded: Promise<void> | null = null;

/** Loads the direct port's assets once. */
export function loadDirectPort(): Promise<void> {
  if (!loaded) {
    (globalThis as Record<string, unknown>).Image = HeadlessImage;
    (globalThis as Record<string, unknown>).fetch = headlessFetch;
    loaded = import('../../../full-direct-port/src/engine/Assets').then((assets) => assets.loadAll(() => {}));
  }
  return loaded;
}

// Screen positions of the direct port's buttons (Board.java).
const BUILD_BUTTONS: Record<string, [number, number]> = {
  Normal: [650, 35],
  Area: [700, 35],
  Spread: [750, 35],
  Poison: [800, 35],
  Lightning: [650, 105],
  Runestone: [700, 105],
};
const START_BUTTON: [number, number] = [284, 10];
const UPGRADE_BUTTON: [number, number] = [800, 155];
const SELL_BUTTON: [number, number] = [800, 200];

type AnyRecord = Record<string, any>;

/** A Board from the direct port, driven through its mouse handler like a player would. */
export class DirectGame {
  readonly board: AnyRecord;

  private constructor(board: AnyRecord) {
    this.board = board;
  }

  static async create(levelIndex: number): Promise<DirectGame> {
    await loadDirectPort();
    const { Board } = await import('../../../full-direct-port/src/game/Board');
    const { LevelsReader } = await import('../../../full-direct-port/src/game/Level');
    const mainframe = { showmenu: () => {} };
    const board = new Board(new LevelsReader(), levelIndex, mainframe as never);
    return new DirectGame(board as unknown as AnyRecord);
  }

  /** One logic tick of the original: 20 ms on its virtual clock. */
  tick(): void {
    this.board.update(20);
  }

  private press(x: number, y: number): void {
    this.board.mousePressed(x, y, 0);
  }

  private pressButton([x, y]: [number, number]): void {
    this.press(x + 5, y + 5);
  }

  start(): void {
    this.pressButton(START_BUTTON);
  }

  build(type: string, col: number, row: number): void {
    this.pressButton(BUILD_BUTTONS[type]);
    this.press(col * 40 + 20, row * 40 + 20);
  }

  upgrade(col: number, row: number): void {
    this.press(col * 40 + 20, row * 40 + 20);
    this.pressButton(UPGRADE_BUTTON);
  }

  sell(col: number, row: number): void {
    this.press(col * 40 + 20, row * 40 + 20);
    this.pressButton(SELL_BUTTON);
  }

  lightning(x: number, y: number): void {
    this.pressButton(BUILD_BUTTONS.Lightning);
    this.press(x, y);
  }

  foundation(col: number, row: number): void {
    this.pressButton(BUILD_BUTTONS.Runestone);
    this.press(col * 40 + 20, row * 40 + 20);
  }

  get gold(): number {
    return this.board.konto.balance;
  }

  get mana(): number {
    return this.board.mana.balance;
  }

  get health(): number {
    return this.board.health;
  }

  get wave(): number {
    return this.board.wavenumber;
  }

  get enemies(): AnyRecord[] {
    return this.board.fiender;
  }

  get towers(): AnyRecord[] {
    return this.board.taarn;
  }

  get projectiles(): AnyRecord[] {
    return this.board.prosjektiler;
  }
}
