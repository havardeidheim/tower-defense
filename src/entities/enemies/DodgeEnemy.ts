import { Enemy } from './Enemy';
import { ENEMY_GOLD_REWARD } from '../../game/constants';


export class DodgeEnemy extends Enemy {
    constructor(x: number, y: number, healthLevel: number = 0) {
        super(x, y, healthLevel);
        this.goldReward = Math.floor(ENEMY_GOLD_REWARD * 1.5);
    }

    protected initStats(): void {
        this.maxHealth = 70 + 70 * this.healthLevel;
        this.health = this.maxHealth;
        this.maxSpeed = 70;
        this.speed = this.maxSpeed;
        this.dodgeChance = 0.5;
    }

    getSpriteName(): string {
        return 'assassin';
    }

    canDodge(): boolean {
        return Math.random() < this.dodgeChance;
    }
}
