import { loadSound } from './AudioClip';

const images = new Map<string, HTMLImageElement>();
const texts = new Map<string, string>();

export const IMAGE_FILES = [
  'background.png', 'helpback.png', 'ground.png', 'path.png', 'spawn.png',
  'normaltower.png', 'poisontower.png', 'areatower.png', 'spreadtower.png',
  'blanctower.png', 'blancknapp.png', 'lightningknapp.png', 'lightning.png',
  'normalprojectile.png', 'spreadprojectile.png', 'poisonprojectile.png',
  'mapcross.png', 'cross.png', 'select.png', 'upgradeknapp.png', 'sellknapp.png',
  ...['peasant', 'solider', 'scout', 'assassin', 'vanguard', 'paragon'].flatMap((n) =>
    ['u', 'd', 'l', 'r'].map((d) => `${n}/${n}${d}.png`),
  ),
  ...[0, 1, 2, 3, 4, 5].map((i) => `areashot/areashot${i}.png`),
  ...[80, 100, 120, 140, 150, 160, 170].map((r) => `range/range${r}.png`),
];

export const SOUND_FILES = [
  'endiscoming', 'forseevictory', 'noonealive', 'letsgo', 'fire', 'lightning',
  'verygood', 'build', 'knapp', 'select', 'sell', 'die', 'ok', 'stone', 'frost', 'poison',
];

export const TEXT_FILES = ['levels.txt', 'wavedata.txt', 'info.txt'];

export function image(path: string): HTMLImageElement {
  const img = images.get(path);
  if (!img) throw new Error(`Image not loaded: ${path}`);
  return img;
}

export function text(name: string): string {
  return texts.get(name) ?? '';
}

function loadImage(path: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      images.set(path, img);
      resolve();
    };
    img.onerror = () => reject(new Error(`Could not load images/${path}`));
    img.src = `images/${path}`;
  });
}

async function loadText(name: string): Promise<void> {
  const res = await fetch(`levels/${name}`);
  if (!res.ok) throw new Error(`Could not load levels/${name}`);
  texts.set(name, await res.text());
}

/** Loads everything up front. Missing sounds are tolerated; the game just stays silent. */
export async function loadAll(onProgress: (done: number, total: number) => void): Promise<void> {
  const jobs: Promise<void>[] = [
    ...IMAGE_FILES.map(loadImage),
    ...TEXT_FILES.map(loadText),
    ...SOUND_FILES.map((s) =>
      loadSound(s, `sounds/${s}.wav`).catch((e) => console.warn(String(e))),
    ),
  ];
  let done = 0;
  onProgress(0, jobs.length);
  await Promise.all(
    jobs.map((j) =>
      j.then(() => {
        done++;
        onProgress(done, jobs.length);
      }),
    ),
  );
}

/** Splits text into lines the way java.io.BufferedReader.readLine() does. */
export function readLines(content: string): string[] {
  const lines = content.split(/\r\n|\n|\r/);
  if (lines.length > 0 && lines[lines.length - 1] === '') lines.pop();
  return lines;
}

/** The original's file format: blocks of lines separated by empty lines. */
export function readBlocks(content: string): string[][] {
  const blocks: string[][] = [];
  let current: string[] = [];
  for (const line of [...readLines(content), null]) {
    if (line === null || line === '') {
      blocks.push(current);
      current = [];
    } else {
      current.push(line);
    }
  }
  return blocks;
}
