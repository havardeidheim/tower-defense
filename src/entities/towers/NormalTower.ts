import { Tower } from './Tower';
import { Enemy } from '../enemies/Enemy';
import { NormalProjectile } from '../projectiles/NormalProjectile';
import { Projectile } from '../projectiles/Projectile';
import { TOWER_NORMAL } from '../../game/constants';

export class NormalTower extends Tower {
    getBaseDamage(): number { return 20; }
    getBaseRange(): number { return 140; }
    getBaseSpeed(): number { return 1.2; }
    getCost(): number { return 80; }
    getType(): string { return TOWER_NORMAL; }
    getImageKey(): string { return 'normaltower'; }
    getSoundKey(): string { return 'stone'; }

    getUpgradeCost(): number {
        // Costs: L1->L2: 40, L2->L3: 60, L3: max
        const costs = [40, 60, 80];
        return this.level < this.maxLevel ? costs[this.level] : 0;
    }

    protected applyUpgrade(): void {
        // +10 range, +8 damage, -0.1 speed per level
        this.range = this.getBaseRange() + this.level * 10;
        this.damage = this.getBaseDamage() + this.level * 8;
        this.attackSpeed = this.getBaseSpeed() - this.level * 0.1;
    }

    createProjectile(target: Enemy): Projectile {
        return new NormalProjectile(this.centerX, this.centerY, target, this.damage);
    }
}
