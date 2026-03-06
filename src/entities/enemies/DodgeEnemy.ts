import { Enemy } from './Enemy';
import { ENEMY_GOLD_REWARD, DODGE_CHANCE } from '../../game/constants';
import { COLOR_ENEMY_DODGE } from '../../game/theme';

export class DodgeEnemy extends Enemy {
    private dodgeChance: number = DODGE_CHANCE;

    constructor(x: number, y: number, healthLevel: number = 0) {
        super(x, y, healthLevel);
        this.goldReward = Math.floor(ENEMY_GOLD_REWARD * 1.5);
    }

    protected initStats(): void {
        this.maxHealth = 70 + 70 * this.healthLevel;
        this.health = this.maxHealth;
        this.maxSpeed = 70;
        this.speed = this.maxSpeed;
    }

    getSpriteName(): string {
        return 'assassin';
    }

    canDodge(): boolean {
        return Math.random() < this.dodgeChance;
    }

    takeDamage(amount: number): boolean {
        // Chance to completely dodge the attack
        if (this.canDodge()) {
            return false;
        }
        this.health -= amount;
        return this.health <= 0;
    }

    // 50% chance to dodge poison application (original Java behavior)
    applyPoison(ticks: number): void {
        if (Math.random() > DODGE_CHANCE) {
            super.applyPoison(ticks);
        }
        // else: dodged the poison
    }

    protected getFallbackColor(): string {
        return COLOR_ENEMY_DODGE;
    }

}
