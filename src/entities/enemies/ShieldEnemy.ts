import { Enemy } from './Enemy';
import { ENEMY_GOLD_REWARD, SHIELD_DAMAGE_REDUCTION } from '../../game/constants';
import { COLOR_ENEMY_SHIELD } from '../../game/theme';

export class ShieldEnemy extends Enemy {
    constructor(x: number, y: number, healthLevel: number = 0) {
        super(x, y, healthLevel);
        this.goldReward = Math.floor(ENEMY_GOLD_REWARD * 1.5);
    }

    protected initStats(): void {
        this.maxHealth = 130 + 130 * this.healthLevel;
        this.health = this.maxHealth;
        this.maxSpeed = 50;
        this.speed = this.maxSpeed;
    }

    getSpriteName(): string {
        return 'solider';
    }


    takeDamage(amount: number): boolean {
        amount = Math.max(0, amount - SHIELD_DAMAGE_REDUCTION);
        this.health -= amount;
        return this.health <= 0;
    }

    // Shield reduces poison tick damage (original Java behavior)
    takePoisonDamage(amount: number): void {
        const reducedDamage = Math.max(0, amount - SHIELD_DAMAGE_REDUCTION);
        this.health -= reducedDamage;
    }

    protected getFallbackColor(): string {
        return COLOR_ENEMY_SHIELD;
    }

}
