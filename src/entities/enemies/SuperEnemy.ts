import { Enemy } from './Enemy';
import { ENEMY_GOLD_REWARD } from '../../game/constants';

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

    protected getFallbackColor(): string {
        return '#FF0000';
    }
}
