import { Enemy } from '../entities/enemies/Enemy';
import { NormalEnemy } from '../entities/enemies/NormalEnemy';
import { FastEnemy } from '../entities/enemies/FastEnemy';
import { ShieldEnemy } from '../entities/enemies/ShieldEnemy';
import { DodgeEnemy } from '../entities/enemies/DodgeEnemy';
import { NoslowEnemy } from '../entities/enemies/NoslowEnemy';
import { SuperEnemy } from '../entities/enemies/SuperEnemy';
import { Level } from './Level';
import {
    TILE_SIZE,
    ENEMY_NORMAL, ENEMY_FAST, ENEMY_SHIELD,
    ENEMY_DODGE, ENEMY_NOSLOW, ENEMY_SUPER,
    ENEMY_SPAWN_INTERVAL, ENEMY_SPAWN_INTERVAL_FAST
} from '../game/constants';

export class WaveManager {
    private currentWave: number = -1;
    private waveIndex: number = 0;
    private spawnTimer: number = 0;
    private spawnPointIndex: number = 0;
    private currentLevel: number = 0;
    private waveComplete: boolean = true;

    constructor(private level: Level) {}

    startNextWave(): boolean {
        if (this.currentWave + 1 >= this.level.waves.length) {
            return false; // No more waves
        }

        this.currentWave++;
        this.waveIndex = 0;
        this.spawnTimer = 0;
        this.currentLevel = 0;
        this.waveComplete = false;
        return true;
    }

    update(deltaTime: number, fastMode: boolean): Enemy | null {
        if (this.waveComplete) return null;

        const wave = this.level.waves[this.currentWave];
        if (!wave || this.waveIndex >= wave.length) {
            this.waveComplete = true;
            return null;
        }

        const interval = fastMode ? ENEMY_SPAWN_INTERVAL_FAST : ENEMY_SPAWN_INTERVAL;
        this.spawnTimer += deltaTime;

        if (this.spawnTimer >= interval) {
            this.spawnTimer = 0;
            return this.spawnNextEnemy(wave);
        }

        return null;
    }

    private spawnNextEnemy(wave: string): Enemy | null {
        // Skip spaces (delays)
        while (this.waveIndex < wave.length && wave[this.waveIndex] === ' ') {
            this.waveIndex++;
            return null; // Return null to indicate delay
        }

        if (this.waveIndex >= wave.length) {
            this.waveComplete = true;
            return null;
        }

        let char = wave[this.waveIndex];

        // Check for level prefix (digit)
        if (/\d/.test(char)) {
            this.currentLevel = parseInt(char);
            this.waveIndex++;
            if (this.waveIndex >= wave.length) {
                this.waveComplete = true;
                return null;
            }
            char = wave[this.waveIndex];
        }

        // Handle pipe character for alternate spawn points (level 3)
        if (char === '|') {
            this.spawnPointIndex = (this.spawnPointIndex + 1) % this.level.spawnPoints.length;
            this.waveIndex++;
            return null;
        }

        this.waveIndex++;

        // Get spawn position
        const spawnPoint = this.level.spawnPoints[this.spawnPointIndex] || this.level.spawnPoints[0];
        const x = spawnPoint.x * TILE_SIZE;
        const y = spawnPoint.y * TILE_SIZE;
        const direction = this.level.getSpawnDirection(spawnPoint.x, spawnPoint.y);

        // Create enemy based on type
        const enemy = this.createEnemy(char, x, y, this.currentLevel);
        if (enemy) {
            enemy.direction = direction;
            enemy.level = this.level;
        }

        // Reset level for next enemy
        this.currentLevel = 0;

        return enemy;
    }

    private createEnemy(type: string, x: number, y: number, level: number): Enemy | null {
        switch (type) {
            case ENEMY_NORMAL:
                return new NormalEnemy(x, y, level);
            case ENEMY_FAST:
                return new FastEnemy(x, y, level);
            case ENEMY_SHIELD:
                return new ShieldEnemy(x, y, level);
            case ENEMY_DODGE:
                return new DodgeEnemy(x, y, level);
            case ENEMY_NOSLOW:
                return new NoslowEnemy(x, y, level);
            case ENEMY_SUPER:
                return new SuperEnemy(x, y, level);
            default:
                console.warn(`Unknown enemy type: ${type}`);
                return null;
        }
    }

    getCurrentWave(): number {
        return this.currentWave;
    }

    getTotalWaves(): number {
        return this.level.waves.length;
    }

    isWaveComplete(): boolean {
        return this.waveComplete;
    }

    isAllWavesComplete(): boolean {
        // Must have started, be on or past the last wave, and have spawned all enemies
        return this.currentWave >= 0 &&
               this.currentWave >= this.level.waves.length - 1 &&
               this.waveComplete;
    }

    hasStarted(): boolean {
        return this.currentWave >= 0;
    }

    // Get enemy counts for next wave (for info display)
    getNextWaveInfo(): Map<string, number> {
        const counts = new Map<string, number>();
        const nextWaveIndex = this.currentWave + 1;

        if (nextWaveIndex >= this.level.waves.length) {
            return counts;
        }

        const wave = this.level.waves[nextWaveIndex];
        for (const char of wave) {
            if (char !== ' ' && char !== '|' && !/\d/.test(char)) {
                counts.set(char, (counts.get(char) || 0) + 1);
            }
        }

        return counts;
    }

    reset(): void {
        this.currentWave = -1;
        this.waveIndex = 0;
        this.spawnTimer = 0;
        this.spawnPointIndex = 0;
        this.currentLevel = 0;
        this.waveComplete = true;
    }
}
