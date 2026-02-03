import { GameObject } from '../../core/GameObject';
import { Level, Direction } from '../../level/Level';
import { TILE_SIZE, POISON_TICK_INTERVAL, POISON_DAMAGE_PER_TICK, ENEMY_GOLD_REWARD } from '../../game/constants';
import { resources } from '../../resources/ResourceLoader';

export abstract class Enemy extends GameObject {
    health: number = 100;
    maxHealth: number = 100;
    speed: number = 1;
    maxSpeed: number = 1;
    damage: number = 1;
    healthLevel: number = 0;
    direction: Direction = 'r';
    poisonTicks: number = 0;
    poisonTimer: number = 0;
    slowTimer: number = 0;
    slowAmount: number = 0;
    pixelsTraveled: number = 0;
    level: Level | null = null;
    goldReward: number = ENEMY_GOLD_REWARD;
    blockedHits: number = 0;

    abstract getSpriteName(): string;
    abstract getBaseHealth(): number;
    abstract getBaseSpeed(): number;

    constructor(x: number, y: number, healthLevel: number = 0) {
        super();
        this.x = x;
        this.y = y;
        this.healthLevel = healthLevel;
        this.initStats();
    }

    protected initStats(): void {
        this.maxHealth = this.getBaseHealth() + this.getBaseHealth() * this.healthLevel;
        this.health = this.maxHealth;
        this.maxSpeed = this.getBaseSpeed();
        this.speed = this.maxSpeed;
    }

    update(deltaTime: number): void {
        if (!this.level) return;

        // Process poison damage
        if (this.poisonTicks > 0) {
            this.poisonTimer += deltaTime;
            if (this.poisonTimer >= POISON_TICK_INTERVAL) {
                this.poisonTimer -= POISON_TICK_INTERVAL;
                this.poisonTicks--;
                this.takePoisonDamage(POISON_DAMAGE_PER_TICK);
            }
        }

        // Process slow effect
        if (this.slowTimer > 0) {
            this.slowTimer -= deltaTime;
            if (this.slowTimer <= 0) {
                this.speed = this.maxSpeed;
                this.slowAmount = 0;
            }
        }

        // Movement
        this.move(deltaTime);
    }

    protected move(deltaTime: number): void {
        if (!this.level) return;

        const moveDistance = (this.speed * deltaTime) / 1000;
        this.pixelsTraveled += moveDistance;

        // Calculate movement based on direction
        let dx = 0, dy = 0;
        switch (this.direction) {
            case 'r': dx = moveDistance; break;
            case 'l': dx = -moveDistance; break;
            case 'd': dy = moveDistance; break;
            case 'u': dy = -moveDistance; break;
        }

        this.x += dx;
        this.y += dy;

        // Check if we've moved past tile center and need to update direction
        const tileX = Math.floor(this.centerX / TILE_SIZE);
        const tileY = Math.floor(this.centerY / TILE_SIZE);
        const tileCenterX = tileX * TILE_SIZE + TILE_SIZE / 2;
        const tileCenterY = tileY * TILE_SIZE + TILE_SIZE / 2;

        // Check if we've crossed tile center
        const atTileCenter = this.isAtTileCenter(tileCenterX, tileCenterY);

        if (atTileCenter) {
            // Check if we reached the target
            const tile = this.level.getTile(tileX, tileY);
            if (tile && tile.isTarget()) {
                // Enemy reached target, will be handled by game state
                return;
            }

            // Update direction
            this.direction = this.level.getNextDirection(tileX, tileY, this.direction);
        }
    }

    private isAtTileCenter(tileCenterX: number, tileCenterY: number): boolean {
        const threshold = 2;
        return Math.abs(this.centerX - tileCenterX) < threshold &&
               Math.abs(this.centerY - tileCenterY) < threshold;
    }

    render(ctx: CanvasRenderingContext2D): void {
        const sprite = resources.imageCache.get(this.getSpriteName());

        if (sprite) {
            // Save context for rotation
            ctx.save();
            ctx.translate(this.centerX, this.centerY);

            // Rotate based on direction
            let rotation = 0;
            switch (this.direction) {
                case 'r': rotation = 0; break;
                case 'd': rotation = Math.PI / 2; break;
                case 'l': rotation = Math.PI; break;
                case 'u': rotation = -Math.PI / 2; break;
            }
            ctx.rotate(rotation);

            ctx.drawImage(sprite, -this.width / 2, -this.height / 2, this.width, this.height);
            ctx.restore();
        } else {
            // Fallback rendering
            ctx.fillStyle = this.getFallbackColor();
            ctx.fillRect(this.x + 5, this.y + 5, this.width - 10, this.height - 10);
        }

        // Draw health bar
        this.renderHealthBar(ctx);

        // Draw poison indicator
        if (this.poisonTicks > 0) {
            ctx.fillStyle = 'rgba(0, 255, 0, 0.3)';
            ctx.fillRect(this.x + 5, this.y + 5, this.width - 10, this.height - 10);
        }
    }

    protected renderHealthBar(ctx: CanvasRenderingContext2D): void {
        const barWidth = this.width - 10;
        const barHeight = 4;
        const barX = this.x + 5;
        const barY = this.y - 8;

        // Background
        ctx.fillStyle = '#333';
        ctx.fillRect(barX, barY, barWidth, barHeight);

        // Health
        const healthPercent = this.health / this.maxHealth;
        ctx.fillStyle = healthPercent > 0.5 ? '#0f0' : healthPercent > 0.25 ? '#ff0' : '#f00';
        ctx.fillRect(barX, barY, barWidth * healthPercent, barHeight);
    }

    protected getFallbackColor(): string {
        return '#888';
    }

    takeDamage(amount: number): boolean {
        this.health -= amount;
        return this.health <= 0;
    }

    // Called each poison tick - can be overridden by ShieldEnemy/SuperEnemy for damage reduction
    takePoisonDamage(amount: number): void {
        this.health -= amount;
    }

    applyPoison(ticks: number): void {
        this.poisonTicks += ticks;
    }

    applySlow(amount: number, duration: number): void {
        if (this.canBeSlow()) {
            this.slowAmount = amount;
            this.slowTimer = duration;
            this.speed = this.maxSpeed * (1 - amount);
        }
    }

    canBeSlow(): boolean {
        return true; // Override in NoslowEnemy
    }

    canDodge(): boolean {
        return false; // Override in DodgeEnemy
    }

    hasShield(): boolean {
        return false; // Override in ShieldEnemy
    }

    canBlockHit(): boolean {
        return false; // Override in NoslowEnemy, SuperEnemy
    }

    canBlockSlow(): boolean {
        return false; // Override in NoslowEnemy, SuperEnemy
    }

    // Spell damage bypasses dodge and shield
    spellDamage(amount: number): void {
        this.health -= amount;
        if (this.health <= 0) {
            this.health = 0;
        }
    }

    isDead(): boolean {
        return this.health <= 0;
    }

    hasReachedTarget(): boolean {
        if (!this.level) return false;
        const tileX = Math.floor(this.centerX / TILE_SIZE);
        const tileY = Math.floor(this.centerY / TILE_SIZE);
        const tile = this.level.getTile(tileX, tileY);

        // Check if on target tile
        if (tile !== null && tile.isTarget()) {
            return true;
        }

        // Also treat going out of bounds as "escaped" (same as reaching target)
        if (this.centerX < 0 || this.centerY < 0 ||
            this.centerX > this.level.getWidth() ||
            this.centerY > this.level.getHeight()) {
            return true;
        }

        return false;
    }
}
