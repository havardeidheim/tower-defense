import { Enemy } from './Enemy';
import { ENEMY_GOLD_REWARD } from '../../game/constants';
import { COLOR_ENEMY_NORMAL } from '../../game/theme';

export class NormalEnemy extends Enemy {
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
        return 'peasant';
    }

    getBaseSpeed(): number {
        return 60;
    }

    protected getFallbackColor(): string {
        return COLOR_ENEMY_NORMAL;
    }
}
