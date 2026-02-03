import { Tower } from './Tower';
import { Enemy } from '../enemies/Enemy';
import { Projectile } from '../projectiles/Projectile';
import { TOWER_AREA, TILE_SIZE } from '../../game/constants';
import { resources } from '../../resources/ResourceLoader';

export class AreaTower extends Tower {
    slowPercent: number = 0.3; // 30% slow

    getBaseDamage(): number { return 20; }
    getBaseRange(): number { return 80; }
    getBaseSpeed(): number { return 2.0; }
    getCost(): number { return 80; }
    getType(): string { return TOWER_AREA; }
    getImageKey(): string { return 'areatower'; }
    getSoundKey(): string { return 'frost'; }

    getUpgradeCost(): number {
        const costs = [40, 60, 80];
        return this.level < this.maxLevel ? costs[this.level] : 0;
    }

    protected applyUpgrade(): void {
        // +6 damage, +5% slow (30%→50%), +20 range at L3
        this.damage = this.getBaseDamage() + this.level * 6;
        this.slowPercent = 0.3 + this.level * 0.05;
        if (this.level >= 3) {
            this.range = this.getBaseRange() + 20;
        }
    }

    // Area tower doesn't use projectiles, it hits all in range directly
    createProjectile(_target: Enemy): Projectile {
        // Return a dummy - area tower handles damage differently
        return null as unknown as Projectile;
    }

    // Override fire to hit all enemies in range
    fireArea(enemies: Enemy[]): { enemy: Enemy; damage: number }[] {
        if (this.cooldownTimer > 0) return [];

        const hits: { enemy: Enemy; damage: number }[] = [];

        for (const enemy of enemies) {
            if (enemy.isDead() || !enemy.active) continue;
            if (this.isInRange(enemy)) {
                hits.push({ enemy, damage: this.damage });
                // Apply slow
                enemy.applySlow(this.slowPercent, 1600);
            }
        }

        if (hits.length > 0) {
            this.cooldownTimer = this.attackSpeed * 1000;
            resources.soundManager.play(this.getSoundKey());
        }

        return hits;
    }
}
