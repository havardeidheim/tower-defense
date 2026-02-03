import { Spell, SpellContext } from './Spell';
import { Enemy } from '../entities/enemies/Enemy';
import { resources } from '../resources/ResourceLoader';
import { SPELL_LIGHTNING, TILE_SIZE } from '../game/constants';

export class Lightning extends Spell {
    damage: number = 200;
    stunDuration: number = 1600; // 100% slow for this duration
    effectDuration: number = 500; // Visual effect duration
    effectTimer: number = 0;
    effectX: number = 0;
    effectY: number = 0;
    showingEffect: boolean = false;

    constructor() {
        super();
        this.manaCost = 50;
    }

    getType(): string {
        return SPELL_LIGHTNING;
    }

    getImageKey(): string {
        return 'lightning';
    }

    canCastAt(x: number, y: number, context: SpellContext): boolean {
        if (context.mana < this.manaCost) return false;

        // Check if there's an enemy at this position
        for (const enemy of context.enemies) {
            if (enemy.isDead() || !enemy.active) continue;

            const dx = x - enemy.centerX;
            const dy = y - enemy.centerY;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < TILE_SIZE / 2) {
                return true;
            }
        }

        return false;
    }

    cast(x: number, y: number, context: SpellContext): void {
        // Find enemy at position
        let targetEnemy: Enemy | null = null;
        let closestDistance = TILE_SIZE / 2;

        for (const enemy of context.enemies) {
            if (enemy.isDead() || !enemy.active) continue;

            const dx = x - enemy.centerX;
            const dy = y - enemy.centerY;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < closestDistance) {
                closestDistance = distance;
                targetEnemy = enemy;
            }
        }

        if (!targetEnemy) return;

        // Play sound
        resources.soundManager.play('lightning');

        // Deduct mana
        context.onManaUsed(this.manaCost);

        // Apply damage (cannot be dodged, ignores shield)
        targetEnemy.spellDamage(this.damage);

        // Apply stun (100% slow)
        targetEnemy.applySlow(1.0, this.stunDuration);

        // Start visual effect
        this.effectX = targetEnemy.centerX;
        this.effectY = targetEnemy.centerY;
        this.effectTimer = this.effectDuration;
        this.showingEffect = true;

        // Check if killed
        if (targetEnemy.isDead()) {
            context.onEnemyKilled(targetEnemy);
        }
    }

    update(deltaTime: number): void {
        if (this.showingEffect) {
            this.effectTimer -= deltaTime;
            if (this.effectTimer <= 0) {
                this.showingEffect = false;
            }
        }
    }

    render(ctx: CanvasRenderingContext2D): void {
        if (this.showingEffect) {
            const img = resources.imageCache.get('lightning');
            if (img) {
                // Flash effect
                const alpha = this.effectTimer / this.effectDuration;
                ctx.globalAlpha = alpha;
                ctx.drawImage(img, this.effectX - 20, this.effectY - 40, 40, 80);
                ctx.globalAlpha = 1.0;
            }
        }
    }

    renderPreview(ctx: CanvasRenderingContext2D, x: number, y: number, _valid: boolean): void {
        // Only show the lightning icon, no red overlay
        const img = resources.imageCache.get(this.getImageKey());
        if (img) {
            ctx.globalAlpha = 0.7;
            ctx.drawImage(img, x - 40, y - 40, 40, 40);
            ctx.globalAlpha = 1.0;
        }
    }
}
