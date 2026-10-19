import { ImageCache } from './ImageCache';
import { LevelLoader } from './LevelLoader';
import { SoundManager } from './SoundManager';

const ENEMY_SPRITES = ['peasant', 'solider', 'scout', 'assassin', 'vanguard', 'paragon'];
const DIRECTIONS = ['u', 'd', 'l', 'r'];
export const RANGE_IMAGE_SIZES = [80, 100, 120, 140, 150, 160, 170];
export const FROST_RING_FRAMES = 6;

/** Image key -> path under public/images. */
function imageManifest(): [string, string][] {
  const plain = [
    'background', 'helpback', 'path', 'spawn', 'select', 'cross',
    'normaltower', 'areatower', 'spreadtower', 'poisontower', 'blanctower',
    'normalprojectile', 'poisonprojectile', 'spreadprojectile',
    'blancknapp', 'upgradeknapp', 'sellknapp', 'lightningknapp', 'lightning',
  ];
  return [
    ...plain.map((k): [string, string] => [k, `${k}.png`]),
    // Enemies: one sprite per walking direction, e.g. "peasantu".
    ...ENEMY_SPRITES.flatMap((name) =>
      DIRECTIONS.map((d): [string, string] => [`${name}${d}`, `${name}/${name}${d}.png`]),
    ),
    ...Array.from({ length: FROST_RING_FRAMES }, (_, i): [string, string] => [
      `areashot${i}`,
      `areashot/areashot${i}.png`,
    ]),
    ...RANGE_IMAGE_SIZES.map((r): [string, string] => [`range${r}`, `range/range${r}.png`]),
  ];
}

const SOUNDS = [
  'select', 'build', 'knapp', 'sell',
  'stone', 'frost', 'fire', 'poison', 'lightning',
  'die', 'ok', 'verygood',
  'endiscoming', 'forseevictory', 'noonealive', 'letsgo',
];

export class ResourceLoader {
  readonly images = new ImageCache();
  readonly sounds = new SoundManager();
  readonly levels = new LevelLoader();

  /** Loads everything up front. Missing sounds are tolerated: the game just stays silent. */
  async loadAll(onProgress: (done: number, total: number) => void): Promise<void> {
    this.sounds.init();
    const jobs: Promise<void>[] = [
      ...imageManifest().map(([key, path]) => this.loadImage(key, `images/${path}`)),
      ...SOUNDS.map((key) =>
        this.sounds.load(key, `sounds/${key}.wav`).catch((e) => console.warn(String(e))),
      ),
      this.loadLevels(),
    ];

    let done = 0;
    onProgress(done, jobs.length);
    await Promise.all(
      jobs.map((job) =>
        job.then(() => {
          done++;
          onProgress(done, jobs.length);
        }),
      ),
    );
  }

  private loadImage(key: string, url: string): Promise<void> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => {
        this.images.set(key, img);
        resolve();
      };
      img.onerror = () => reject(new Error(`Could not load ${url}`));
      img.src = url;
    });
  }

  private async loadLevels(): Promise<void> {
    const [levels, waves, help] = await Promise.all(
      ['levels.txt', 'wavedata.txt', 'info.txt'].map(async (name) => {
        const response = await fetch(`levels/${name}`);
        if (!response.ok) throw new Error(`Could not load levels/${name}`);
        return response.text();
      }),
    );
    this.levels.parse(levels, waves, help);
  }
}

/** The game's single resource store, filled by the loading scene. */
export const resources = new ResourceLoader();
