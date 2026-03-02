import { Enemy } from './Enemy';
import { ENEMY_GOLD_REWARD } from '../../game/constants';

export class FastEnemy extends Enemy {
    constructor(x: number, y: number, healthLevel: number = 0) {
        super(x, y, healthLevel);
        this.goldReward = ENEMY_GOLD_REWARD;
    }

    protected initStats(): void {
        this.maxHealth = 100 + 100 * this.healthLevel;
        this.health = this.maxHealth;
        this.maxSpeed = this.getBaseSpeed();
        this.speed = this.maxSpeed;
    }

    getSpriteName(): string {
        return 'scout';
    }

    getBaseSpeed(): number {
        return 120;
    }

    protected getFallbackColor(): string {
        return '#00FF00'; // Green for scout (fast)
    }
}
