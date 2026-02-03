import { Tower } from './Tower';
import { Enemy } from '../enemies/Enemy';
import { PoisonProjectile } from '../projectiles/PoisonProjectile';
import { Projectile } from '../projectiles/Projectile';
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

    // Override scan to prioritize enemies with least poison (original Java behavior)
    scan(enemies: Enemy[]): void {
        let bestTarget: Enemy | null = null;
        let lowestPoison = Infinity;
        let bestProgress = -1;

        for (const enemy of enemies) {
            if (enemy.isDead() || !enemy.active) continue;
            if (!this.isInRange(enemy)) continue;

            // Primary: fewer poison ticks. Secondary: most progress (original Java logic)
            if (enemy.poisonTicks < lowestPoison) {
                lowestPoison = enemy.poisonTicks;
                bestProgress = enemy.pixelsTraveled;
                bestTarget = enemy;
            } else if (enemy.poisonTicks === lowestPoison && enemy.pixelsTraveled > bestProgress) {
                bestProgress = enemy.pixelsTraveled;
                bestTarget = enemy;
            }
        }

        this.target = bestTarget;
    }

    createProjectile(target: Enemy): Projectile {
        // damage = number of poison ticks to apply
        return new PoisonProjectile(this.centerX, this.centerY, target, this.damage);
    }
}
