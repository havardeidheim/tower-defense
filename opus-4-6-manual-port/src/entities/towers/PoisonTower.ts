import { Tower, TowerStats } from './Tower';
import { Enemy } from '../enemies/Enemy';
import { PoisonProjectile } from '../attacks/PoisonProjectile';
import { TOWER_POISON } from '../../game/constants';

export class PoisonTower extends Tower {
    static readonly STATS: TowerStats = {
        cost: 70,
        levels: [
            { damage: 2, range: 120, speed: 1.2 },
            { damage: 3, range: 120, speed: 1.2 },
            { damage: 4, range: 120, speed: 1.2 },
            { damage: 6, range: 120, speed: 1.2 },
        ],
    };

    getStats() { return PoisonTower.STATS; }
    getType(): string { return TOWER_POISON; }
    getImageKey(): string { return 'poisontower'; }
    getSoundKey(): string { return 'poison'; }

    protected applyUpgrade(): void {
        const s = PoisonTower.STATS.levels[this.level];
        this.damage = s.damage;
    }

    findTargets(enemies: Enemy[]): Enemy[] {
        return enemies
            .filter(e => !e.isDead() && e.active && this.isInRange(e))
            .sort((a, b) => {
                if (a.poisonTicks !== b.poisonTicks) return a.poisonTicks - b.poisonTicks;
                return b.pixelsTraveled - a.pixelsTraveled;
            });
    }

    createAttacks([target]: Enemy[]) {
        return [new PoisonProjectile(this.centerX, this.centerY, target, this.damage)];
    }
}
