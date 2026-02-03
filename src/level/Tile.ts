import { TILE_SIZE, TILE_GROUND, TILE_OBSTACLE, TILE_PATH, TILE_SPAWN, TILE_TARGET } from '../game/constants';
import { resources } from '../resources/ResourceLoader';

export type TileType = '.' | '#' | 'x' | 's' | 't';

export class Tile {
    constructor(
        public type: TileType,
        public col: number,
        public row: number
    ) {}

    get x(): number { return this.col * TILE_SIZE; }
    get y(): number { return this.row * TILE_SIZE; }
    get centerX(): number { return this.x + TILE_SIZE / 2; }
    get centerY(): number { return this.y + TILE_SIZE / 2; }

    isPath(): boolean {
        return this.type === TILE_PATH || this.type === TILE_SPAWN || this.type === TILE_TARGET;
    }

    isBuildable(): boolean {
        return this.type === TILE_GROUND;
    }

    isObstacle(): boolean {
        return this.type === TILE_OBSTACLE;
    }

    isSpawn(): boolean {
        return this.type === TILE_SPAWN;
    }

    isTarget(): boolean {
        return this.type === TILE_TARGET;
    }

    render(ctx: CanvasRenderingContext2D): void {
        const imageCache = resources.imageCache;

        switch (this.type) {
            case TILE_PATH:
            case TILE_TARGET: {
                const pathImg = imageCache.get('path');
                if (pathImg) {
                    ctx.drawImage(pathImg, this.x, this.y, TILE_SIZE, TILE_SIZE);
                }
                break;
            }
            case TILE_SPAWN: {
                const spawnImg = imageCache.get('spawn');
                if (spawnImg) {
                    ctx.drawImage(spawnImg, this.x, this.y, TILE_SIZE, TILE_SIZE);
                }
                break;
            }
            case TILE_GROUND: {
                const groundImg = imageCache.get('ground');
                if (groundImg) {
                    ctx.drawImage(groundImg, this.x, this.y, TILE_SIZE, TILE_SIZE);
                }
                break;
            }
            // Obstacles use background, no need to draw
        }
    }
}
