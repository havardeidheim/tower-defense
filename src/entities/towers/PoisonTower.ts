import { Tower } from './Tower';
import { Enemy } from '../enemies/Enemy';
import { PoisonProjectile } from '../projectiles/PoisonProjectile';
import { Projectile } from '../projectiles/Projectile';
import { TOWER_POISON } from '../../game/constants';

export class PoisonTower extends Tower {
    poisonDuration: number = 3; // Number of poison ticks

    getBaseDamage(): number { return 2; }
    getBaseRange(): number { return 120; }
    getBaseSpeed(): number { return 1.2; }
    getCost(): number { return 70; }
    getType(): string { return TOWER_POISON; }
    getImageKey(): string { return 'poisontower'; }
    getSoundKey(): string { return 'poison'; }

    getUpgradeCost(): number {
        const costs = [35, 50, 70];
        return this.level < this.maxLevel ? costs[this.level] : 0;
    }

    protected applyUpgrade(): void {
        // +1 duration, +1 damage each level
        this.poisonDuration = 3 + this.level;
        this.damage = this.getBaseDamage() + this.level;
    }

    // Override scan to prioritize unpoisoned enemies
    scan(enemies: Enemy[]): void {
        let bestTarget: Enemy | null = null;
        let lowestPoison = Infinity;
        let bestDistance = -1;

        for (const enemy of enemies) {
            if (enemy.isDead() || !enemy.active) continue;
            if (!this.isInRange(enemy)) continue;

            // Prioritize enemies with fewer poison ticks
            if (enemy.poisonTicks < lowestPoison ||
                (enemy.poisonTicks === lowestPoison && enemy.pixelsTraveled > bestDistance)) {
                lowestPoison = enemy.poisonTicks;
                bestDistance = enemy.pixelsTraveled;
                bestTarget = enemy;
            }
        }

        this.target = bestTarget;
    }

    createProjectile(target: Enemy): Projectile {
        return new PoisonProjectile(this.centerX, this.centerY, target, this.damage, this.poisonDuration);
    }
}
