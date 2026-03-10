import { Enemy } from './Enemy';
import { SHIELD_DAMAGE_REDUCTION } from '../../game/constants';


export class ShieldEnemy extends Enemy {
    protected initStats(): void {
        this.goldMultiplier = 1.5;
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
}
