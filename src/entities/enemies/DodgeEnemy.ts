import { Enemy } from './Enemy';
import { ENEMY_GOLD_REWARD, DODGE_CHANCE } from '../../game/constants';

export class DodgeEnemy extends Enemy {
    private dodgeChance: number = DODGE_CHANCE;

    constructor(x: number, y: number, healthLevel: number = 0) {
        super(x, y, healthLevel);
        this.goldReward = Math.floor(ENEMY_GOLD_REWARD * 1.5);
    }

    getSpriteName(): string {
        return 'assassin';
    }

    getBaseHealth(): number {
        return 80;
    }

    getBaseSpeed(): number {
        return 70;
    }

    canDodge(): boolean {
        return Math.random() < this.dodgeChance;
    }

    takeDamage(amount: number): boolean {
        // Chance to completely dodge the attack
        if (this.canDodge()) {
            return false;
        }
        this.health -= amount;
        return this.health <= 0;
    }

    // 50% chance to dodge poison application (original Java behavior)
    applyPoison(ticks: number): void {
        if (Math.random() > DODGE_CHANCE) {
            super.applyPoison(ticks);
        }
        // else: dodged the poison
    }

    protected getFallbackColor(): string {
        return '#800080'; // Purple for assassin (dodge)
    }

    render(ctx: CanvasRenderingContext2D): void {
        super.render(ctx);

        // Draw dodge indicator (semi-transparent)
        ctx.fillStyle = 'rgba(128, 0, 128, 0.2)';
        ctx.beginPath();
        ctx.arc(this.centerX, this.centerY, this.width / 2 + 4, 0, Math.PI * 2);
        ctx.fill();
    }
}
