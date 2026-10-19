import { existsSync, readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { LevelLoader } from '../../src/resources/LevelLoader';

const here = dirname(fileURLToPath(import.meta.url));
export const POLISHED_PUBLIC = join(here, '../../public');
export const DIRECT_PORT = join(here, '../../../full-direct-port');

export function readText(path: string): string {
  return readFileSync(path, 'utf8');
}

export function fileExists(path: string): boolean {
  return existsSync(path);
}

/** Reads public/levels into a level loader (a new one by default). */
export function loadLevels(loader = new LevelLoader()): LevelLoader {
  const dir = join(POLISHED_PUBLIC, 'levels');
  loader.parse(readText(join(dir, 'levels.txt')), readText(join(dir, 'wavedata.txt')), readText(join(dir, 'info.txt')));
  return loader;
}
