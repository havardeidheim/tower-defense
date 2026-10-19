/** One slot of a wave script: an enemy type character, and the health level from a digit prefix. */
export interface WaveSlot {
  char: string;
  healthLevel: number;
}

/**
 * Reads the wave scripts, one slot per spawn pulse.
 *
 * A wave script is a string like "2n2n dd": each character is one slot. Enemy
 * characters spawn that enemy, a digit in front raises its health level, and any
 * other character (space, '|') is a pause. Every slot, pauses included, takes the
 * next spawn point in turn; Paths Untrodden uses '|' to skip spawn points.
 *
 * When a wave's script is used up, the next wave begins on the first pulse that
 * finds the field clear of enemies.
 */
export class WaveSpawner {
  /** -1 until the game starts; waves.length once every wave is done. */
  private wave = -1;
  private cursor = 0;

  constructor(private readonly waves: readonly string[]) {}

  start(): void {
    this.wave = 0;
    this.cursor = 0;
  }

  get waveIndex(): number {
    return this.wave;
  }

  get waveCount(): number {
    return this.waves.length;
  }

  get finished(): boolean {
    return this.wave >= this.waves.length;
  }

  /** The script of the wave after the current one, or '' if there is none. */
  get nextWaveScript(): string {
    return this.waves[this.wave + 1] ?? '';
  }

  /** One spawn pulse. Returns the slot to spawn, or null when nothing spawns. */
  pulse(fieldClear: boolean): WaveSlot | null {
    const script = this.waves[this.wave];
    if (script === undefined) return null;

    if (this.cursor < script.length) {
      let healthLevel = 0;
      const c = script.charAt(this.cursor);
      if (c >= '0' && c <= '9') {
        healthLevel = Number(c);
        this.cursor++;
        if (this.cursor >= script.length) return null; // a digit at the very end
      }
      const char = script.charAt(this.cursor);
      this.cursor++;
      return { char, healthLevel };
    }

    if (fieldClear) {
      this.wave++;
      this.cursor = 0;
    }
    return null;
  }
}
