import { Tower } from './Tower';
import { Enemy } from '../enemies/Enemy';
import { PoisonProjectile } from '../attacks/PoisonProjectile';
import { TOWER_POISON } from '../../game/constants';

export class PoisonTower extends Tower {
    // In the original Java, "damage" represents the number of poison ticks applied
    // Each tick deals a fixed 18 damage (POISON_DAMAGE_PER_TICK)

    getBaseDamage(): number { return 2; } // Base poison ticks
    getBaseRange(): number { return 120; }
    getBaseSpeed(): number { return 1.2; }
    getCost(): number { return 70; }
    getType(): string { return TOWER_POISON; }
    getImageKey(): string { return 'poisontower'; }
    getSoundKey(): string { return 'poison'; }

    getUpgradeCost(): number {
        const costs = [40, 80, 120];
        return this.level < this.maxLevel ? costs[this.level] : 0;
    }

    protected applyUpgrade(): void {
        // +1 tick per level, extra +1 at max level
        // L0: 2 ticks, L1: 3 ticks, L2: 4 ticks, L3: 6 ticks
        this.damage = this.getBaseDamage() + this.level;
        if (this.level >= 3) {
            this.damage += 1; // Extra tick at max level
        }
    }

    // Override to prioritize enemies with least poison (original Java behavior)
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
