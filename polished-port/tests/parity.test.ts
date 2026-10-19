/**
 * Compares the polished port with the full direct port (the reference copy of
 * the original game), tick by tick: gold, mana, health, waves, and the position,
 * health, speed and poison of every enemy, tower and projectile.
 *
 * The ports differ on purpose in a few places, which the scripted players avoid:
 * - The original keeps killed and escaped enemies in its lists until the end of a
 *   tick, so they can be hit again (the double gold bug) or targeted for one more
 *   tick. Here they are out of play at once. This shows up when a frost tower kills
 *   the target of a tower that acts after it, so frost towers are built last, and
 *   when two fireballs chase the same enemy.
 * - Pausing and fast mode, which the scripts do not use.
 */
import { describe, expect, it } from 'vitest';
import { AD_ASTRA_STEPS, BALLROOM_STEPS, UNTRODDEN_STEPS } from './support/plans';
import { runParity, type Scenario } from './support/scenario';

const FIFTEEN_MINUTES = 50 * 60 * 15;

interface ParityCase extends Scenario {
  /** At least this many ticks must be identical before any (explained) difference. */
  identicalTicks: number;
}

const CASES: ParityCase[] = [
  {
    // The whole game, won with full health.
    name: 'Utopia, stone and poison towers',
    level: 0,
    seed: 1,
    maxTicks: FIFTEEN_MINUTES,
    identicalTicks: 16150,
    steps: [
      { build: 'Normal', at: [6, 5] },
      { build: 'Poison', at: [7, 5] },
      { build: 'Normal', at: [7, 7] },
      { upgrade: [6, 5] },
      { build: 'Poison', at: [6, 8] },
      { upgrade: [7, 7] },
      { build: 'Normal', at: [9, 7] },
      { upgrade: [7, 5] },
      { upgrade: [6, 5] },
      { build: 'Normal', at: [4, 7] },
      { upgrade: [6, 8] },
      { upgrade: [7, 7] },
      { upgrade: [9, 7] },
      { build: 'Normal', at: [6, 3] },
      { upgrade: [6, 5] },
      { upgrade: [4, 7] },
      { build: 'Poison', at: [4, 9] },
      { upgrade: [9, 7] },
      { upgrade: [7, 5] },
      { upgrade: [6, 3] },
      { build: 'Normal', at: [7, 3] },
      { upgrade: [6, 8] },
    ],
  },
  {
    name: 'The Butchers Ballroom, stone, poison and frost',
    level: 1,
    seed: 2,
    maxTicks: FIFTEEN_MINUTES,
    identicalTicks: 12000,
    steps: BALLROOM_STEPS,
  },
  {
    name: 'Paths Untrodden, three spawn points, with lightning',
    level: 2,
    seed: 3,
    maxTicks: FIFTEEN_MINUTES,
    identicalTicks: 14000,
    lightningAtMana: 80,
    steps: UNTRODDEN_STEPS,
  },
  {
    name: 'Ad Astra, foundations and lightning',
    level: 3,
    seed: 4,
    maxTicks: FIFTEEN_MINUTES,
    identicalTicks: 3900,
    lightningAtMana: 80,
    steps: AD_ASTRA_STEPS,
  },
  {
    // Two fireballs end up chasing the same enemy after a while (see the top).
    name: 'Utopia, one scatterflames tower upgraded to bouncing fireballs',
    level: 0,
    seed: 5,
    maxTicks: FIFTEEN_MINUTES,
    identicalTicks: 4800,
    steps: [
      { build: 'Spread', at: [7, 5] },
      { upgrade: [7, 5] },
      { upgrade: [7, 5] },
      { upgrade: [7, 5] },
    ],
  },
];

describe('parity with the full direct port', () => {
  for (const c of CASES) {
    it(c.name, async () => {
      const result = await runParity(c);
      console.log(
        `${c.name}: ${result.ticks} identical ticks, ${result.wavesCompleted} waves cleared, health ${result.finalHealth}` +
          (result.mismatch ? `, then differs (${result.cause})` : ', identical to the end'),
      );
      if (result.mismatch) {
        expect(result.cause, result.mismatch).not.toBe('unexplained');
      }
      expect(result.ticks).toBeGreaterThanOrEqual(c.identicalTicks);
    });
  }
});
