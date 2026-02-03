import { Enemy } from './Enemy';
import { ENEMY_GOLD_REWARD, SHIELD_DAMAGE_REDUCTION } from '../../game/constants';

export class SuperEnemy extends Enemy {
    constructor(x: number, y: number, healthLevel: number = 0) {
        super(x, y, healthLevel);
        this.goldReward = Math.floor(ENEMY_GOLD_REWARD * 5);
    }

    getSpriteName(): string {
        return 'paragon';
    }

    getBaseHealth(): number {
        return 500;
    }

    getBaseSpeed(): number {
        return 40;
    }

    // Super enemy has all abilities
    canDodge(): boolean {
        return Math.random() < 0.25; // 25% dodge chance (less than DodgeEnemy)
    }

    hasShield(): boolean {
        return true;
    }

    canBlockHit(): boolean {
        return true;
    }

    canBlockSlow(): boolean {
        return true;
    }

    // 50% chance to dodge poison application (original Java behavior)
    applyPoison(ticks: number): void {
        if (Math.random() > 0.5) {
            super.applyPoison(ticks);
        }
        // else: dodged the poison
    }

    // Shield reduces poison tick damage (original Java behavior)
    takePoisonDamage(amount: number): void {
        const reducedDamage = Math.max(0, amount - SHIELD_DAMAGE_REDUCTION);
        this.health -= reducedDamage;
    }

    protected getFallbackColor(): string {
        return '#FF0000';
    }
}
