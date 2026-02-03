import { Enemy } from './Enemy';
import { ENEMY_GOLD_REWARD } from '../../game/constants';

export class NormalEnemy extends Enemy {
    constructor(x: number, y: number, healthLevel: number = 0) {
        super(x, y, healthLevel);
        this.goldReward = ENEMY_GOLD_REWARD;
    }

    getSpriteName(): string {
        return 'peasant';
    }

    getBaseHealth(): number {
        return 100;
    }

    getBaseSpeed(): number {
        return 60;
    }

    protected getFallbackColor(): string {
        return '#8B4513'; // Brown for peasant
    }
}
