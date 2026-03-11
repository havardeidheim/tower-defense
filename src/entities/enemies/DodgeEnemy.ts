import { Enemy } from './Enemy';


export class DodgeEnemy extends Enemy {
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

    tryDodge(): boolean {
        return Math.random() < this.dodgeChance;
    }
}
