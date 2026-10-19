import { MAX_MANA, SELL_BONUS_PER_LEVEL, TOWER_PRICE_STEP } from '../game/constants';
import { TOWER_KINDS, TOWER_TYPES, type TowerType } from '../entities/towers/TowerTypes';
import type { Tower } from '../entities/towers/Tower';

/** The player's gold, and the tower prices, which rise with every tower bought. */
export class Gold {
  private prices: Record<TowerType, number>;

  constructor(public balance: number) {
    this.prices = Object.fromEntries(TOWER_TYPES.map((t) => [t, TOWER_KINDS[t].basePrice])) as Record<
      TowerType,
      number
    >;
  }

  priceOf(type: TowerType): number {
    return this.prices[type];
  }

  canAfford(type: TowerType): boolean {
    return this.canPay(this.priceOf(type));
  }

  /** Pays for a tower and makes the next one of that type more expensive. */
  buy(type: TowerType): void {
    this.pay(this.priceOf(type));
    this.prices[type] += TOWER_PRICE_STEP;
  }

  /**
   * Half the current price of the tower's type, plus a bonus per upgrade. The
   * price is today's, not what was paid, and selling does not lower it.
   */
  sellValue(tower: Tower): number {
    return Math.trunc(this.priceOf(tower.kind.type) / 2) + tower.level * SELL_BONUS_PER_LEVEL;
  }

  canPay(amount: number): boolean {
    return amount >= 0 && this.balance >= amount;
  }

  pay(amount: number): void {
    if (this.canPay(amount)) this.balance -= amount;
  }

  earn(amount: number): void {
    if (amount > 0) this.balance += amount;
  }
}

/** The player's mana. Regeneration stops at MAX_MANA, but a level may start above it. */
export class Mana {
  constructor(public balance: number) {}

  canPay(amount: number): boolean {
    return amount >= 0 && this.balance >= amount;
  }

  pay(amount: number): void {
    if (this.canPay(amount)) this.balance -= amount;
  }

  regenerate(amount: number): void {
    if (amount <= 0 || this.balance >= MAX_MANA) return;
    this.balance = Math.min(MAX_MANA, this.balance + amount);
  }
}
