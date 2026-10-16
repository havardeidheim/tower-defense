import { Tower, TowerStats } from './Tower';
import { Enemy } from '../enemies/Enemy';
import { SpreadProjectile } from '../attacks/SpreadProjectile';
import { TOWER_SPREAD } from '../../game/constants';

export class SpreadTower extends Tower {
    targetCount: number = 2;
    canBounce: boolean = false;

    static readonly STATS: TowerStats = {
        cost: 80,
        levels: [
            { damage: 16, range: 140, speed: 1.5, targets: 2, canBounce: false },
            { damage: 18, range: 140, speed: 1.5, targets: 3, canBounce: false },
            { damage: 22, range: 140, speed: 1.5, targets: 4, canBounce: false },
            { damage: 22, range: 140, speed: 1.5, targets: 4, canBounce: true },
        ],
    };

    getStats() { return SpreadTower.STATS; }
    getType(): string { return TOWER_SPREAD; }
    getImageKey(): string { return 'spreadtower'; }
    getSoundKey(): string { return 'fire'; }

    protected applyUpgrade(): void {
        const s = SpreadTower.STATS.levels[this.level];
        this.damage = s.damage;
        this.targetCount = s.targets as number;
        this.canBounce = s.canBounce as boolean;
    }

    findTargets(enemies: Enemy[]): Enemy[] {
        return super.findTargets(enemies).slice(0, this.targetCount);
    }

    createAttacks(targets: Enemy[], allEnemies: Enemy[]) {
        return targets.map(t => new SpreadProjectile(this.centerX, this.centerY, t, this.damage, this.canBounce, allEnemies));
    }
}
