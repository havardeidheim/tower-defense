import { Enemy } from './Enemy';
import { ENEMY_GOLD_REWARD, NOSLOW_BLOCK_COUNT } from '../../game/constants';

export class NoslowEnemy extends Enemy {
    private blocksRemaining: number = NOSLOW_BLOCK_COUNT;

    constructor(x: number, y: number, healthLevel: number = 0) {
        super(x, y, healthLevel);
        this.goldReward = Math.floor(ENEMY_GOLD_REWARD * 1.5);
    }

    getSpriteName(): string {
        return 'vanguard';
    }

    getBaseHealth(): number {
        return 120;
    }

    getBaseSpeed(): number {
        return 65;
    }

    // Override takeDamage - blocks consume attacks
    takeDamage(amount: number): boolean {
        if (this.blocksRemaining > 0) {
            this.blocksRemaining--;
            return false; // Blocked, not dead
        }
        return super.takeDamage(amount);
    }

    // Override applyPoison - blocks consume poison attempts
    applyPoison(ticks: number): void {
        if (this.blocksRemaining > 0) {
            this.blocksRemaining--;
            return; // Blocked
        }
        super.applyPoison(ticks);
    }

    // Override applySlow - NEVER apply slow effect (permanently immune to slowing)
    applySlow(_amount: number, _duration: number): void {
        // NoslowEnemy is completely immune to slow effects
        // The slow portion is always ignored (speed reduction never applied)
    }

    // These are not used for blocking logic anymore
    canBlockHit(): boolean {
        return false; // Blocking is handled in takeDamage override
    }

    canBlockSlow(): boolean {
        return true; // Always immune to slow
    }

    protected getFallbackColor(): string {
        return '#FFD700';
    }
}
