import { Tower } from './Tower';
import { Enemy } from '../enemies/Enemy';
import { SpreadProjectile } from '../attacks/SpreadProjectile';
import { TOWER_SPREAD } from '../../game/constants';
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

    findTargets(enemies: Enemy[]): Enemy[] {
        return super.findTargets(enemies).slice(0, this.targetCount);
    }

    createAttacks(targets: Enemy[], allEnemies: Enemy[]) {
        return targets.map(t => {
            const proj = new SpreadProjectile(this.centerX, this.centerY, t, this.damage, this.canBounce);
            proj.allEnemies = allEnemies; // For bounce targeting
            return proj;
        });
    }
}
