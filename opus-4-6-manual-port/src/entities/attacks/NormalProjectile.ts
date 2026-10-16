import { Projectile } from './Projectile';
import { Enemy } from '../enemies/Enemy';

export class NormalProjectile extends Projectile {
    constructor(x: number, y: number, target: Enemy, damage: number) {
        super(x, y, target, damage);
        this.speed = 6;
    }

    getImageKey(): string {
        return 'normalprojectile';
    }

    onHit(): void {
        if (!this.target || this.target.isDead()) return;

        if (this.target.tryDodge()) {
            return;
        }

        this.target.takeDamage(this.damage);
    }
}
