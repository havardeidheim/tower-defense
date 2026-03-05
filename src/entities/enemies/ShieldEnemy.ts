import { Enemy } from './Enemy';
import { ENEMY_GOLD_REWARD, SHIELD_DAMAGE_REDUCTION } from '../../game/constants';
import { COLOR_ENEMY_SHIELD, COLOR_SHIELD_AURA, COLOR_TEXT_WHITE, FONT_SHIELD_COUNT } from '../../game/theme';

export class ShieldEnemy extends Enemy {
    constructor(x: number, y: number, healthLevel: number = 0) {
        super(x, y, healthLevel);
        this.goldReward = Math.floor(ENEMY_GOLD_REWARD * 1.5);
        this.blockedHits = 3;
    }

    protected initStats(): void {
        this.maxHealth = 130 + 130 * this.healthLevel;
        this.health = this.maxHealth;
        this.maxSpeed = this.getBaseSpeed();
        this.speed = this.maxSpeed;
    }

    getSpriteName(): string {
        return 'solider';
    }

    getBaseSpeed(): number {
        return 50;
    }

    hasShield(): boolean {
        return this.blockedHits > 0;
    }

    takeDamage(amount: number): boolean {
        // Shield blocks a portion of damage while active
        if (this.blockedHits > 0) {
            this.blockedHits--;
            amount = Math.max(0, amount - SHIELD_DAMAGE_REDUCTION);
        }
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

    render(ctx: CanvasRenderingContext2D): void {
        super.render(ctx);

        // Draw shield indicator
        if (this.blockedHits > 0) {
            ctx.fillStyle = COLOR_SHIELD_AURA;
            ctx.beginPath();
            ctx.arc(this.centerX, this.centerY, this.width / 2 + 2, 0, Math.PI * 2);
            ctx.fill();

            // Draw shield count
            ctx.fillStyle = COLOR_TEXT_WHITE;
            ctx.font = FONT_SHIELD_COUNT;
            ctx.textAlign = 'center';
            ctx.fillText(String(this.blockedHits), this.centerX, this.y + this.height + 10);
        }
    }
}
