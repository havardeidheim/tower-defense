import { Lightning } from './Lightning';
import { Runestone } from './Runestone';
import type { Spell, SpellType } from './Spell';

export const SPELLS: Record<SpellType, Spell> = { Lightning, Runestone };
