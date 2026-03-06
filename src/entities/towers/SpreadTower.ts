import { Tower } from './Tower';
import { Enemy } from '../enemies/Enemy';
import { TowerAttack } from '../attacks/TowerAttack';
import { SpreadProjectile } from '../attacks/SpreadProjectile';
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
        const costs = [40, 80, 120];
        return this.level < this.maxLevel ? costs[this.level] : 0;
    }

    protected applyUpgrade(): void {
        // Matches original Java logic:
        // L1: 3 targets, 18 dmg
        // L2: 4 targets, 22 dmg
        // L3: 4 targets, 22 dmg, bounce enabled
        if (this.level === 3) {
            this.targetCount = 4;
            this.damage = 22;
            this.canBounce = true;
        } else if (this.level === 2) {
            this.targetCount = 4;
            this.damage = 22;
            this.canBounce = false;
        } else {
            this.targetCount = 2 + this.level;
            this.damage = this.getBaseDamage() + this.level * 2;
            this.canBounce = false;
        }
    }

    private scanMultiple(enemies: Enemy[]): Enemy[] {
        const sorted = [...enemies]
            .filter(e => !e.isDead() && e.active && this.isInRange(e))
            .sort((a, b) => b.pixelsTraveled - a.pixelsTraveled);

        return sorted.slice(0, this.targetCount);
    }

    shoot(enemies: Enemy[]): TowerAttack[] {
        if (this.cooldownTimer > 0) return [];

        const targets = this.scanMultiple(enemies);
        if (targets.length === 0) return [];

        this.cooldownTimer = this.attackSpeed * 1000;
        resources.soundManager.play(this.getSoundKey());

        const attacks: TowerAttack[] = [];
        for (const target of targets) {
            const proj = new SpreadProjectile(this.centerX, this.centerY, target, this.damage, this.canBounce);
            proj.allEnemies = enemies; // For bounce targeting
            attacks.push(proj);
        }
        return attacks;
    }
}
