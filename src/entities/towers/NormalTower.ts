import { Tower, TowerStats } from './Tower';
import { Enemy } from '../enemies/Enemy';
import { NormalProjectile } from '../attacks/NormalProjectile';
import { TOWER_NORMAL } from '../../game/constants';

export class NormalTower extends Tower {
    static readonly STATS: TowerStats = {
        cost: 80,
        levels: [
            { damage: 20, range: 140, speed: 1.2 },
            { damage: 28, range: 150, speed: 1.1 },
            { damage: 36, range: 160, speed: 1.0 },
            { damage: 44, range: 170, speed: 0.9 },
        ],
    };

    getStats() { return NormalTower.STATS; }
    getType(): string { return TOWER_NORMAL; }
    getImageKey(): string { return 'normaltower'; }
    getSoundKey(): string { return 'stone'; }

    protected applyUpgrade(): void {
        const s = NormalTower.STATS.levels[this.level];
        this.damage = s.damage;
        this.range = s.range;
        this.attackSpeed = s.speed;
    }

    createAttacks([target]: Enemy[]) {
        return [new NormalProjectile(this.centerX, this.centerY, target, this.damage)];
    }
}
