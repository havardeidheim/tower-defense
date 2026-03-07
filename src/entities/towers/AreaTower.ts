import { Tower } from './Tower';
import { Enemy } from '../enemies/Enemy';
import { AreaAttack } from '../attacks/AreaAttack';
import { TOWER_AREA } from '../../game/constants';

export class AreaTower extends Tower {
    slowPercent: number = 0.3; // 30% slow

    getBaseDamage(): number { return 20; }
    getBaseRange(): number { return 80; }
    getBaseSpeed(): number { return 2.0; }
    getCost(): number { return 80; }
    getType(): string { return TOWER_AREA; }
    getImageKey(): string { return 'areatower'; }
    getSoundKey(): string { return 'frost'; }

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

    createAttacks(_targets: Enemy[], allEnemies: Enemy[]) {
        return [new AreaAttack(
            this.centerX, this.centerY,
            allEnemies, this.damage, this.range,
            this.slowPercent, 1600
        )];
    }
}
