export type TowerType = 'Normal' | 'Area' | 'Spread' | 'Poison';

export const TOWER_TYPES: readonly TowerType[] = ['Normal', 'Area', 'Spread', 'Poison'];

/** Stats at one tower level. */
export interface TowerLevel {
  /** Damage per hit. For the poison tower: poison counters per dart. */
  readonly damage: number;
  readonly range: number;
  /** Ticks between shots. */
  readonly reloadTicks: number;
  /** Frost tower: how much the pulse slows, in percent. */
  readonly slowPercent?: number;
  /** Spread tower: fireballs per volley, and whether they strike a second enemy. */
  readonly fireballs?: number;
  readonly bounce?: boolean;
}

export interface TowerKind {
  readonly type: TowerType;
  readonly name: string;
  readonly sprite: string;
  readonly sound: string;
  readonly basePrice: number;
  /** Levels 1 to 4. */
  readonly levels: readonly TowerLevel[];
  /** Shown when hovering the build button. */
  readonly description: readonly string[];
}

export const TOWER_KINDS: Record<TowerType, TowerKind> = {
  Normal: {
    type: 'Normal',
    name: 'Tower of Stonehurling',
    sprite: 'normaltower',
    sound: 'stone',
    basePrice: 80,
    levels: [
      { damage: 20, range: 140, reloadTicks: 60 },
      { damage: 28, range: 150, reloadTicks: 55 },
      { damage: 36, range: 160, reloadTicks: 50 },
      { damage: 44, range: 170, reloadTicks: 45 },
    ],
    description: [
      'Tower of Stonehurling', '', '', 'Hurls stones at the enemy', '', 'Levelup:',
      'Increased speed', 'Increased damage', 'Increased range',
    ],
  },
  Area: {
    type: 'Area',
    name: 'Tower of Frostshock',
    sprite: 'areatower',
    sound: 'frost',
    basePrice: 80,
    levels: [
      { damage: 20, range: 80, reloadTicks: 100, slowPercent: 30 },
      { damage: 26, range: 80, reloadTicks: 100, slowPercent: 35 },
      { damage: 32, range: 80, reloadTicks: 100, slowPercent: 40 },
      { damage: 38, range: 100, reloadTicks: 100, slowPercent: 50 },
    ],
    description: [
      'Tower of Frostshock', '', '', 'Damages and slows all', 'enemies in range', '', 'Levelup:',
      'Increased slow', 'Increased damage', '', 'Level 4:', 'Increased range',
    ],
  },
  Spread: {
    type: 'Spread',
    name: 'Tower of Scatterflames',
    sprite: 'spreadtower',
    sound: 'fire',
    basePrice: 80,
    levels: [
      { damage: 16, range: 140, reloadTicks: 75, fireballs: 2, bounce: false },
      { damage: 18, range: 140, reloadTicks: 75, fireballs: 3, bounce: false },
      { damage: 22, range: 140, reloadTicks: 75, fireballs: 4, bounce: false },
      { damage: 22, range: 140, reloadTicks: 75, fireballs: 4, bounce: true },
    ],
    description: [
      'Tower of Scatterflames', '', '', 'Fires heatseeking fireballs', 'at multiple enemies', '',
      'Levelup:', 'Extra fireballs', 'Increased damage', '', 'Level 4', 'Fireballs now',
      'strike two targets',
    ],
  },
  Poison: {
    type: 'Poison',
    name: 'Tower of Poisoning',
    sprite: 'poisontower',
    sound: 'poison',
    basePrice: 70,
    levels: [
      { damage: 2, range: 120, reloadTicks: 60 },
      { damage: 3, range: 120, reloadTicks: 60 },
      { damage: 4, range: 120, reloadTicks: 60 },
      { damage: 6, range: 120, reloadTicks: 60 },
    ],
    description: [
      'Tower of Poisoning', '', '', 'Poisons the enemy causing', 'damage every second.',
      'Hits on already poisoned', 'enemies will increase the ', 'duration of the poison.',
      'Prioritizes nonpoisoned', 'enemies', '', 'Levelup:', 'Increased duration',
    ],
  },
};
