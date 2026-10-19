import { resources } from '../resources/ResourceLoader';
import {
  TILE_GROUND, TILE_OBSTACLE, TILE_PATH, TILE_SIZE, TILE_SPAWN, TILE_TARGET,
} from '../game/constants';

export type Direction = 'u' | 'd' | 'l' | 'r';

export interface TilePos {
  col: number;
  row: number;
}

/** A level's tile grid, its wave scripts and its spawn points. */
export class Level {
  readonly rows: number;
  readonly cols: number;
  readonly waves: readonly string[];
  private readonly grid: string[][];
  private readonly spawnPoints: TilePos[] = [];
  private nextSpawn = 0;

  constructor(
    readonly index: number,
    readonly name: string,
    map: readonly string[],
    waves: readonly string[],
  ) {
    this.grid = map.map((row) => row.split(''));
    this.rows = this.grid.length;
    this.cols = this.grid[0]?.length ?? 0;
    this.waves = [...waves];

    for (let row = 0; row < this.rows; row++) {
      for (let col = 0; col < this.grid[row].length; col++) {
        if (this.grid[row][col] === TILE_SPAWN) this.spawnPoints.push({ col, row });
      }
    }
  }

  /** The tile character, or '' outside the map. */
  tileAt(col: number, row: number): string {
    return this.grid[row]?.[col] ?? '';
  }

  /** Enemies walk on road and target tiles. */
  isWalkable(col: number, row: number): boolean {
    const t = this.tileAt(col, row);
    return t === TILE_PATH || t === TILE_TARGET;
  }

  isTarget(col: number, row: number): boolean {
    return this.tileAt(col, row) === TILE_TARGET;
  }

  /** Towers can only be built on foundations. */
  isBuildable(col: number, row: number): boolean {
    return this.tileAt(col, row) === TILE_GROUND;
  }

  isObstacle(col: number, row: number): boolean {
    return this.tileAt(col, row) === TILE_OBSTACLE;
  }

  /** Turns an obstacle into a foundation. */
  placeFoundation(col: number, row: number): boolean {
    if (!this.isObstacle(col, row)) return false;
    this.grid[row][col] = TILE_GROUND;
    return true;
  }

  /** Spawn points are used in turn, in reading order. */
  takeSpawnPoint(): TilePos {
    if (this.nextSpawn >= this.spawnPoints.length) this.nextSpawn = 0;
    return this.spawnPoints[this.nextSpawn++];
  }

  /** Which way an enemy leaves a spawn tile: the first road tile to the right, left, up or down. */
  startDirection(col: number, row: number): Direction | null {
    if (this.tileAt(col + 1, row) === TILE_PATH) return 'r';
    if (this.tileAt(col - 1, row) === TILE_PATH) return 'l';
    if (this.tileAt(col, row - 1) === TILE_PATH) return 'u';
    if (this.tileAt(col, row + 1) === TILE_PATH) return 'd';
    return null;
  }

  /** The road and the spawn swirls. Drawn below everything else. */
  renderRoad(ctx: CanvasRenderingContext2D): void {
    this.forEachTile((tile, x, y) => {
      if (tile === TILE_PATH || tile === TILE_SPAWN || tile === TILE_TARGET) {
        resources.images.draw(ctx, 'path', x, y);
      }
      if (tile === TILE_SPAWN) resources.images.draw(ctx, 'spawn', x, y);
    });
  }

  /** The foundations towers stand on. */
  renderFoundations(ctx: CanvasRenderingContext2D): void {
    this.forEachTile((tile, x, y) => {
      if (tile === TILE_GROUND) resources.images.draw(ctx, 'blanctower', x, y);
    });
  }

  private forEachTile(fn: (tile: string, x: number, y: number) => void): void {
    for (let row = 0; row < this.rows; row++) {
      for (let col = 0; col < this.grid[row].length; col++) {
        fn(this.grid[row][col], col * TILE_SIZE, row * TILE_SIZE);
      }
    }
  }
}
