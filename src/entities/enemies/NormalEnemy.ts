import { Enemy } from './Enemy';


export class NormalEnemy extends Enemy {
    protected initStats(): void {
        this.maxHealth = 100 + 100 * this.healthLevel;
        this.health = this.maxHealth;
        this.maxSpeed = 60;
        this.speed = this.maxSpeed;
    }

    getSpriteName(): string {
        return 'peasant';
    }

}
