/**
 * Scripted players that prove a level can be beaten. They are benchmarks for
 * gameplay changes: if a change makes a script lose stars, the level got harder.
 *
 * Steps run in order, each as soon as there is gold for it (see player.ts).
 */
import type { Script, Step } from './player';

function build(type: 'Normal' | 'Spread', at: [number, number], upgrades = 3): Step[] {
  return [{ build: type, at }, ...upgrade(at, upgrades)];
}

function upgrade(at: [number, number], times: number): Step[] {
  return Array.from({ length: times }, () => ({ upgrade: at }));
}

/**
 * The Butchers Ballroom (level 2) with five stars.
 *
 * - A level 2 poison tower first, on the tile with the most road in range.
 * - A max level scatterflames tower next: the early Assassins dodge half of all
 *   attacks, and many bouncing fireballs are what gets through.
 * - Two stone towers along the last stretch, first only to level 3 so the second
 *   scatterflames tower comes sooner, which the Vanguards of wave 9 need.
 * - Then the stone towers to level 4 and a third one, to punch through the
 *   shields of the level 3 Paragons in wave 13.
 * - Lightning only on an enemy that is about to reach the end of the road
 *   (1470 px walked; this road is about 1500 px).
 *
 * In testing this got five stars on 300 of 300 seeds. Without lightning it
 * still always wins, but with five stars only about three games in four.
 */
export const BALLROOM_FIVE_STARS: Script = {
  level: 1,
  steps: [
    { build: 'Poison', at: [8, 7] },
    { upgrade: [8, 7] },
    ...build('Spread', [7, 7]),
    ...build('Normal', [11, 6], 2),
    ...build('Normal', [11, 8], 2),
    ...build('Spread', [6, 9]),
    ...upgrade([11, 6], 1),
    ...upgrade([11, 8], 1),
    ...build('Normal', [4, 2]),
  ],
  lightningAfter: 1470,
};
