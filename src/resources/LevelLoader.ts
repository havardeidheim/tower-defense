import { TILE_SPAWN, TILE_TARGET } from '../game/constants';
import { Vector2 } from '../core/Vector2';

export interface LevelData {
    name: string;
    map: string[][];
    waves: string[];
    spawnPoints: Vector2[];
    targetPoint: Vector2;
}

export class LevelLoader {
    private levels: LevelData[] = [];
    private levelNames = ['Utopia', 'The Butchers Ballroom', 'Paths Untrodden', 'Ad Astra'];

    async load(): Promise<void> {
        const [levelsText, wavesText] = await Promise.all([
            fetch('levels/levels.txt').then(r => r.text()),
            fetch('levels/wavedata.txt').then(r => r.text())
        ]);

        this.parseLevels(levelsText, wavesText);
    }

    private parseLevels(levelsText: string, wavesText: string): void {
        // Split levels by double newline or empty lines
        const levelMaps = this.splitByEmptyLines(levelsText);
        const levelWaves = this.splitByEmptyLines(wavesText);

        for (let i = 0; i < levelMaps.length; i++) {
            const map = this.parseMap(levelMaps[i]);
            const waves = levelWaves[i] || [];
            const spawnPoints = this.findTiles(map, TILE_SPAWN);
            const targetPoints = this.findTiles(map, TILE_TARGET);

            this.levels.push({
                name: this.levelNames[i] || `Level ${i + 1}`,
                map,
                waves,
                spawnPoints,
                targetPoint: targetPoints[0] || new Vector2(0, 0)
            });
        }
    }

    private splitByEmptyLines(text: string): string[][] {
        const result: string[][] = [];
        let current: string[] = [];

        const lines = text.split('\n');
        for (const line of lines) {
            const trimmed = line.trimEnd();
            if (trimmed === '') {
                if (current.length > 0) {
                    result.push(current);
                    current = [];
                }
            } else {
                current.push(trimmed);
            }
        }

        if (current.length > 0) {
            result.push(current);
        }

        return result;
    }

    private parseMap(lines: string[]): string[][] {
        return lines.map(line => line.split(''));
    }

    private findTiles(map: string[][], tileChar: string): Vector2[] {
        const points: Vector2[] = [];
        for (let row = 0; row < map.length; row++) {
            for (let col = 0; col < map[row].length; col++) {
                if (map[row][col] === tileChar) {
                    points.push(new Vector2(col, row));
                }
            }
        }
        return points;
    }

    getLevel(index: number): LevelData | null {
        return this.levels[index] || null;
    }

    getLevelCount(): number {
        return this.levels.length;
    }

    getAllLevels(): LevelData[] {
        return [...this.levels];
    }
}
