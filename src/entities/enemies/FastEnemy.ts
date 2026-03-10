import { Enemy } from './Enemy';


export class FastEnemy extends Enemy {
    protected initStats(): void {
        this.maxHealth = 100 + 100 * this.healthLevel;
        this.health = this.maxHealth;
        this.maxSpeed = 120;
        this.speed = this.maxSpeed;
    }

    getSpriteName(): string {
        return 'scout';
    }

}
