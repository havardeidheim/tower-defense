import { Enemy } from './Enemy';
import { ENEMY_GOLD_REWARD, SHIELD_DAMAGE_REDUCTION } from '../../game/constants';


export class SuperEnemy extends Enemy {
    constructor(x: number, y: number, healthLevel: number = 0) {
        super(x, y, healthLevel);
        this.goldReward = Math.floor(ENEMY_GOLD_REWARD * 5);
    }

    protected initStats(): void {
        this.maxHealth = 70 + 70 * this.healthLevel;
        this.health = this.maxHealth;
        this.maxSpeed = 65;
        this.speed = this.maxSpeed;
    }

    getSpriteName(): string {
        return 'paragon';
    }

    // Shield reduces normal hit damage (same as ShieldEnemy)
    takeDamage(amount: number): boolean {
        amount = Math.max(0, amount - SHIELD_DAMAGE_REDUCTION);
        this.health -= amount;
        return this.health <= 0;
    }

    canDodge(): boolean {
        return Math.random() < 0.5; // 50% dodge chance (same as DodgeEnemy)
    }

    // Shield reduces poison tick damage (original Java behavior)
    takePoisonDamage(amount: number): void {
        const reducedDamage = Math.max(0, amount - SHIELD_DAMAGE_REDUCTION);
        this.health -= reducedDamage;
    }

    // Override applySlow - NEVER apply slow effect (permanently immune to slowing)
    applySlow(_amount: number, _duration: number): void {
        // NoslowEnemy is completely immune to slow effects
        // The slow portion is always ignored (speed reduction never applied)
    }

}
