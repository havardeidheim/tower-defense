import { Enemy } from './Enemy';
import { NOSLOW_BLOCK_COUNT } from '../../game/constants';


export class NoslowEnemy extends Enemy {
    private blocksRemaining: number = NOSLOW_BLOCK_COUNT;

    getSpriteName(): string {
        return 'vanguard';
    }

    // Noslow uses a different health scaling: 120 + 100*level (not 120 + 120*level)
    protected initStats(): void {
        this.goldMultiplier = 1.5;
        this.maxHealth = 120 + 100 * this.healthLevel;
        this.health = this.maxHealth;
        this.maxSpeed = 65;
        this.speed = this.maxSpeed;
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

}
