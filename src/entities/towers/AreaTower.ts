import { Tower } from './Tower';
import { Enemy } from '../enemies/Enemy';
import { Projectile } from '../projectiles/Projectile';
import { TOWER_AREA } from '../../game/constants';
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
        const costs = [40, 80, 120];
        return this.level < this.maxLevel ? costs[this.level] : 0;
    }

    protected applyUpgrade(): void {
        // +6 damage, +5% slow per level, at max level: +20 range and 50% slow
        this.damage = this.getBaseDamage() + this.level * 6;
        if (this.level >= 3) {
            this.range = this.getBaseRange() + 20;
            this.slowPercent = 0.5;
        } else {
            this.slowPercent = 0.3 + this.level * 0.05;
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
