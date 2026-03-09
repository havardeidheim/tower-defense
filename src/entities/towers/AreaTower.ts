import { Tower, TowerStats } from './Tower';
import { Enemy } from '../enemies/Enemy';
import { AreaAttack } from '../attacks/AreaAttack';
import { TOWER_AREA, SLOW_DURATION } from '../../game/constants';

export class AreaTower extends Tower {
    slowPercent: number = 0.3;
    slowDuration: number = SLOW_DURATION;

    static readonly STATS: TowerStats = {
        cost: 80,
        levels: [
            { damage: 20, range: 80, speed: 2.0, slow: 30 },
            { damage: 26, range: 80, speed: 2.0, slow: 35 },
            { damage: 32, range: 80, speed: 2.0, slow: 40 },
            { damage: 38, range: 100, speed: 2.0, slow: 50 },
        ],
    };

    getStats() { return AreaTower.STATS; }
    getType(): string { return TOWER_AREA; }
    getImageKey(): string { return 'areatower'; }
    getSoundKey(): string { return 'frost'; }

    protected applyUpgrade(): void {
        const s = AreaTower.STATS.levels[this.level];
        this.damage = s.damage;
        this.range = s.range;
        this.slowPercent = (s.slow as number) / 100;
    }

    createAttacks(_targets: Enemy[], allEnemies: Enemy[]) {
        return [new AreaAttack(
            this.centerX, this.centerY,
            allEnemies, this.damage, this.range,
            this.slowPercent, this.slowDuration
        )];
    }
}
