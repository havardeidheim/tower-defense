import { readBlocks, text } from '../engine/Assets';
import * as Co from './Co';

export interface Point {
  x: number;
  y: number;
}

/** A level's tile grid and wave strings (Level.java). */
export class Level {
  private startposses: Point[] = [];
  private posindex = 0;

  constructor(private brett: string[][], private waves: string[]) {
    this.findstartposses();
  }

  /** Rows are shared, so changes (runestones) persist for this level instance. */
  getLevel(): string[][] {
    return [...this.brett];
  }

  getWaves(): string[] {
    return [...this.waves];
  }

  /** Spawn points are used round-robin when a level has more than one. */
  getStartPos(): Point {
    if (this.posindex >= this.startposses.length) this.posindex = 0;
    const p = this.startposses[this.posindex];
    this.posindex++;
    return p;
  }

  findStartDirection(yy: number, xx: number): string {
    const b = this.brett;
    if (xx + 1 < b[yy].length && b[yy][xx + 1] === Co.PATHC) return 'r';
    if (xx - 1 >= 0 && b[yy][xx - 1] === Co.PATHC) return 'l';
    if (yy - 1 >= 0 && b[yy - 1][xx] === Co.PATHC) return 'u';
    if (yy + 1 < b.length && b[yy + 1][xx] === Co.PATHC) return 'd';
    return '';
  }

  private findstartposses(): void {
    for (let i = 0; i < this.brett.length; i++) {
      for (let j = 0; j < this.brett[i].length; j++) {
        if (this.brett[i][j] === Co.SPAWNC) this.startposses.push({ x: j, y: i });
      }
    }
  }
}

/** Parses levels.txt and wavedata.txt (LevelsReader.java). */
export class LevelsReader {
  private levels: string[][] = [];
  private waves: string[][] = [];

  constructor() {
    this.levels = readBlocks(text('levels.txt'));
    this.waves = readBlocks(text('wavedata.txt'));
  }

  /** Returns a fresh copy, so restarting a level undoes placed runestones. */
  getLevelAt(i: number): Level {
    const grid = this.levels[i].map((row) => row.split(''));
    return new Level(grid, this.waves[i] ?? []);
  }

  getLevelCount(): number {
    return this.levels.length;
  }
}
