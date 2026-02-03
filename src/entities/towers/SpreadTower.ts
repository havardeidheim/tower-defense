import { Tower } from './Tower';
import { Enemy } from '../enemies/Enemy';
import { SpreadProjectile } from '../projectiles/SpreadProjectile';
import { Projectile } from '../projectiles/Projectile';
import { TOWER_SPREAD } from '../../game/constants';
import { resources } from '../../resources/ResourceLoader';

export class SpreadTower extends Tower {
    targetCount: number = 2;
    canBounce: boolean = false;

    getBaseDamage(): number { return 16; }
    getBaseRange(): number { return 140; }
    getBaseSpeed(): number { return 1.5; }
    getCost(): number { return 80; }
    getType(): string { return TOWER_SPREAD; }
    getImageKey(): string { return 'spreadtower'; }
    getSoundKey(): string { return 'fire'; }

    getUpgradeCost(): number {
        const costs = [40, 60, 80];
        return this.level < this.maxLevel ? costs[this.level] : 0;
    }

    protected applyUpgrade(): void {
        // +1 target (2→3→4), +2 damage, bounces at L3
        this.targetCount = 2 + this.level;
        this.damage = this.getBaseDamage() + this.level * 2;
        this.canBounce = this.level >= 3;
    }

    // Override scan to find multiple targets
    scanMultiple(enemies: Enemy[]): Enemy[] {
        const targets: Enemy[] = [];
        const sorted = [...enemies]
            .filter(e => !e.isDead() && e.active && this.isInRange(e))
            .sort((a, b) => b.pixelsTraveled - a.pixelsTraveled);

        for (let i = 0; i < Math.min(this.targetCount, sorted.length); i++) {
            targets.push(sorted[i]);
        }

        return targets;
    }

    createProjectile(target: Enemy): Projectile {
        return new SpreadProjectile(this.centerX, this.centerY, target, this.damage, this.canBounce);
    }

    // Fire at multiple targets
    fireMultiple(enemies: Enemy[]): Projectile[] {
        if (this.cooldownTimer > 0) return [];

        const targets = this.scanMultiple(enemies);
        if (targets.length === 0) return [];

        this.cooldownTimer = this.attackSpeed * 1000;

        const projectiles: Projectile[] = [];
        for (const target of targets) {
            const proj = new SpreadProjectile(this.centerX, this.centerY, target, this.damage, this.canBounce);
            proj.allEnemies = enemies; // For bounce targeting
            projectiles.push(proj);
        }

        if (projectiles.length > 0) {
            resources.soundManager.play(this.getSoundKey());
        }

        return projectiles;
    }
}
