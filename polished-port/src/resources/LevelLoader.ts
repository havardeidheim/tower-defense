import { Level } from '../level/Level';

export interface LevelData {
  name: string;
  /** One string per row of tiles. */
  map: string[];
  /** One wave script per wave. */
  waves: string[];
}

const LEVEL_NAMES = ['Utopia', 'The Butchers Ballroom', 'Paths Untrodden', 'Ad Astra'];

/**
 * Splits a text file into blocks separated by empty lines, the format of all the
 * original's data files. Lines are kept as they are (a line with a single space is
 * not empty), and the last block ends at the end of the file.
 */
export function splitBlocks(content: string): string[][] {
  const lines = content.split(/\r\n|\n|\r/);
  if (lines.length > 0 && lines[lines.length - 1] === '') lines.pop();

  const blocks: string[][] = [];
  let current: string[] = [];
  for (const line of lines) {
    if (line === '') {
      blocks.push(current);
      current = [];
    } else {
      current.push(line);
    }
  }
  blocks.push(current);
  return blocks;
}

/** The levels (levels.txt + wavedata.txt) and the help pages (info.txt). */
export class LevelLoader {
  private levels: LevelData[] = [];
  helpPages: string[][] = [];

  parse(levelsText: string, wavesText: string, helpText: string): void {
    const maps = splitBlocks(levelsText);
    const waves = splitBlocks(wavesText);
    this.levels = maps.map((map, i) => ({
      name: LEVEL_NAMES[i] ?? `Level ${i + 1}`,
      map,
      waves: waves[i] ?? [],
    }));
    this.helpPages = splitBlocks(helpText);
  }

  get count(): number {
    return this.levels.length;
  }

  getData(index: number): LevelData {
    const data = this.levels[index];
    if (!data) throw new Error(`No level ${index}`);
    return data;
  }

  /** A fresh copy of the level, so foundations placed in one game do not carry over. */
  createLevel(index: number): Level {
    const data = this.getData(index);
    return new Level(index, data.name, data.map, data.waves);
  }
}
