/**
 * The six enemy types, keyed by their character in the wave scripts.
 *
 * All differences between enemies are data. How the traits combine:
 * - dodges: each attack (stone, fireball, poison dart, frost) misses half the time.
 * - blocks: the first N attacks are ignored completely.
 * - shield: subtracted from the damage of every hit and every poison tick.
 * - slowImmune: frost still hurts, but does not slow.
 * Lightning ignores all of these.
 */
export interface EnemyType {
  readonly char: string;
  readonly name: string;
  /** Image key prefix; the walking direction is appended ("peasant" + "u"). */
  readonly sprite: string;
  readonly baseHealth: number;
  readonly healthPerLevel: number;
  /** Pixels per tick. */
  readonly speed: number;
  readonly shield: number;
  readonly dodges: boolean;
  readonly blocks: number;
  readonly slowImmune: boolean;
  /** Damage to the player when it reaches the end of the road. */
  readonly damage: number;
  /** Shown when hovering the enemy in the "next wave" panel. */
  readonly description: readonly string[];
}

const PLAIN = { shield: 0, dodges: false, blocks: 0, slowImmune: false, damage: 1 };

export const ENEMY_TYPES: readonly EnemyType[] = [
  {
    ...PLAIN,
    char: 'n',
    name: 'Peasant',
    sprite: 'peasant',
    baseHealth: 100,
    healthPerLevel: 100,
    speed: 1.2,
    description: ['Peasant', '', 'Just a peasant'],
  },
  {
    ...PLAIN,
    char: 'f',
    name: 'Scout',
    sprite: 'scout',
    baseHealth: 100,
    healthPerLevel: 100,
    speed: 1.7,
    description: ['Scout', '', 'Fast movement'],
  },
  {
    ...PLAIN,
    char: 's',
    name: 'Solider',
    sprite: 'solider',
    baseHealth: 130,
    healthPerLevel: 130,
    speed: 1.2,
    shield: 10,
    description: [
      'Solider', '', 'High health', 'Mitigates a certain amount', 'of damage every hit, also',
      'work on poison damage',
    ],
  },
  {
    ...PLAIN,
    char: 'd',
    name: 'Assassin',
    sprite: 'assassin',
    baseHealth: 70,
    healthPerLevel: 70,
    speed: 1.6,
    dodges: true,
    description: ['Assassin', '', 'Low Health', 'Fast movement', '50% chance to dodge attacks'],
  },
  {
    ...PLAIN,
    char: '<',
    name: 'Vanguard',
    sprite: 'vanguard',
    baseHealth: 120,
    healthPerLevel: 100,
    speed: 1.6,
    blocks: 3,
    slowImmune: true,
    description: [
      'Vanguard', '', 'Fast movement', 'Immune to slow', 'Blocks the three first',
      'attacks made to him',
    ],
  },
  {
    ...PLAIN,
    char: '*',
    name: 'Paragon',
    sprite: 'paragon',
    baseHealth: 70,
    healthPerLevel: 70,
    speed: 1.4,
    shield: 10,
    dodges: true,
    slowImmune: true,
    description: [
      'Paragon', '', 'Low health', 'Fast movement', 'Immune to slow',
      '50% chance to dodge attacks', 'Mitigates a certain amount', 'of damage every hit, also',
      'work on poison damage',
    ],
  },
];

const BY_CHAR = new Map(ENEMY_TYPES.map((t) => [t.char, t]));

/** The enemy type for a wave script character, or undefined for pauses. */
export function enemyTypeFor(char: string): EnemyType | undefined {
  return BY_CHAR.get(char);
}
