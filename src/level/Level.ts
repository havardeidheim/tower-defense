import { Tile, TileType } from './Tile';
import { Vector2 } from '../core/Vector2';
import { TILE_SIZE, TILE_GROUND } from '../game/constants';
import { LevelData } from '../resources/LevelLoader';

export type Direction = 'u' | 'd' | 'l' | 'r';

export class Level {
    name: string;
    tiles: Tile[][] = [];
    waves: string[];
    spawnPoints: Vector2[];
    targetPoint: Vector2;
    rows: number = 0;
    cols: number = 0;

    constructor(data: LevelData) {
        this.name = data.name;
        this.waves = data.waves;
        this.spawnPoints = data.spawnPoints;
        this.targetPoint = data.targetPoint;
        this.parseMap(data.map);
    }

    private parseMap(map: string[][]): void {
        this.rows = map.length;
        this.cols = map[0]?.length || 0;

        this.tiles = [];
        for (let row = 0; row < this.rows; row++) {
            this.tiles[row] = [];
            for (let col = 0; col < this.cols; col++) {
                const char = map[row][col] as TileType;
                this.tiles[row][col] = new Tile(char, col, row);
            }
        }
    }

    getTile(col: number, row: number): Tile | null {
        if (row < 0 || row >= this.rows || col < 0 || col >= this.cols) {
            return null;
        }
        return this.tiles[row][col];
    }

    getTileAtPixel(x: number, y: number): Tile | null {
        const col = Math.floor(x / TILE_SIZE);
        const row = Math.floor(y / TILE_SIZE);
        return this.getTile(col, row);
    }

    isBuildable(col: number, row: number): boolean {
        const tile = this.getTile(col, row);
        return tile !== null && tile.isBuildable();
    }

    isPath(col: number, row: number): boolean {
        const tile = this.getTile(col, row);
        return tile !== null && tile.isPath();
    }

    // Convert tile to buildable ground (for Runestone spell)
    convertToBuildable(col: number, row: number): boolean {
        const tile = this.getTile(col, row);
        if (tile && tile.isObstacle()) {
            this.tiles[row][col] = new Tile(TILE_GROUND as TileType, col, row);
            return true;
        }
        return false;
    }

    // Get next direction for enemy at tile position
    getNextDirection(col: number, row: number, currentDirection: Direction): Direction {
        // Check all adjacent tiles for path
        const directions: { dir: Direction; dc: number; dr: number }[] = [
            { dir: 'r', dc: 1, dr: 0 },
            { dir: 'l', dc: -1, dr: 0 },
            { dir: 'd', dc: 0, dr: 1 },
            { dir: 'u', dc: 0, dr: -1 }
        ];

        // Get opposite direction to avoid going back
        const opposite: Record<Direction, Direction> = {
            'u': 'd', 'd': 'u', 'l': 'r', 'r': 'l'
        };

        // First try to continue in current direction
        for (const { dir, dc, dr } of directions) {
            if (dir === currentDirection) {
                const nextTile = this.getTile(col + dc, row + dr);
                if (nextTile && nextTile.isPath()) {
                    return dir;
                }
            }
        }

        // Otherwise find any valid direction except opposite
        for (const { dir, dc, dr } of directions) {
            if (dir !== opposite[currentDirection]) {
                const nextTile = this.getTile(col + dc, row + dr);
                if (nextTile && nextTile.isPath()) {
                    return dir;
                }
            }
        }

        // If stuck, try opposite (shouldn't happen in valid maps)
        return currentDirection;
    }

    // Get starting direction from spawn point
    getSpawnDirection(spawnCol: number, spawnRow: number): Direction {
        // Check adjacent tiles for path
        const checks: { dir: Direction; dc: number; dr: number }[] = [
            { dir: 'r', dc: 1, dr: 0 },
            { dir: 'l', dc: -1, dr: 0 },
            { dir: 'd', dc: 0, dr: 1 },
            { dir: 'u', dc: 0, dr: -1 }
        ];

        for (const { dir, dc, dr } of checks) {
            const tile = this.getTile(spawnCol + dc, spawnRow + dr);
            if (tile && tile.isPath()) {
                return dir;
            }
        }

        return 'r'; // Default
    }

    render(ctx: CanvasRenderingContext2D): void {
        for (let row = 0; row < this.rows; row++) {
            for (let col = 0; col < this.cols; col++) {
                this.tiles[row][col].render(ctx);
            }
        }
    }

    getWidth(): number {
        return this.cols * TILE_SIZE;
    }

    getHeight(): number {
        return this.rows * TILE_SIZE;
    }
}
