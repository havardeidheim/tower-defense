/**
 * Difficulty benchmarks: scripted players that must keep beating their level.
 *
 * Five stars is the bar for "the level can be beaten perfectly", and it must
 * hold for every gameplay change. Dodges are random, so each script plays many
 * seeds, and every one of them must end with five stars. A change that fails
 * this has made the level harder; the star counts in the log show by how much.
 */
import { describe, expect, it } from 'vitest';
import { BALLROOM_FIVE_STARS } from './support/benchmarks';
import { play, type Script } from './support/player';

const SEEDS = Array.from({ length: 60 }, (_, i) => i + 1);

interface Benchmark {
  name: string;
  script: Script;
  /** Share of the seeds that must end with five stars. */
  fiveStarShare: number;
}

const BENCHMARKS: Benchmark[] = [
  { name: 'The Butchers Ballroom', script: BALLROOM_FIVE_STARS, fiveStarShare: 1 },
];

describe('difficulty benchmarks', () => {
  for (const b of BENCHMARKS) {
    it(`${b.name} gets five stars on ${b.fiveStarShare * 100}% of ${SEEDS.length} seeds`, () => {
      const results = SEEDS.map((seed) => play(b.script, seed));
      const stars = results.map((r) => (r.outcome === 'won' ? r.health : 0));
      const count = (n: number) => stars.filter((s) => s === n).length;
      console.log(
        `${b.name}: ${SEEDS.length} games, stars 5: ${count(5)}, 4: ${count(4)}, 3: ${count(3)}, ` +
          `2: ${count(2)}, 1: ${count(1)}, lost: ${results.filter((r) => r.outcome !== 'won').length}`,
      );

      const lostSeeds = SEEDS.filter((_, i) => results[i].outcome !== 'won');
      expect(lostSeeds, 'seeds that lost').toEqual([]);
      expect(count(5) / SEEDS.length).toBeGreaterThanOrEqual(b.fiveStarShare);
    });
  }
});
