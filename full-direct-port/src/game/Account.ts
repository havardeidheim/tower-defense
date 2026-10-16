import * as Co from './Co';

/** Gold account. Each purchase of a tower type raises that type's price by 10. */
export class Account {
  private prices = new Map<string, number>([
    [Co.NORMALTYPE, 80],
    [Co.POISONTYPE, 70],
    [Co.AREATYPE, 80],
    [Co.SPREADTYPE, 80],
    [Co.LIGHTNINGTYPE, 50],
    [Co.RUNESTONETYPE, 50],
  ]);

  balance: number;

  constructor(startbalance: number) {
    this.balance = startbalance;
  }

  canAfford(type: string): boolean {
    const amount = this.pricefor(type);
    return this.balance >= amount && amount >= 0;
  }

  pricefor(type: string): number {
    return this.prices.get(type) ?? 0;
  }

  payfor(type: string): void {
    this.withdraw(this.pricefor(type));
    this.prices.set(type, this.pricefor(type) + 10);
  }

  deposit(amount: number): void {
    if (amount >= 0) this.balance += amount;
  }

  checkAmount(amount: number): boolean {
    return amount >= 0 && this.balance - amount >= 0;
  }

  getBalance(): number {
    return this.balance;
  }

  withdraw(amount: number): void {
    if (this.balance >= amount && amount >= 0) this.balance -= amount;
  }
}

/** Mana regenerates up to 100, but a higher starting balance is kept. */
export class ManaAccount extends Account {
  deposit(amount: number): void {
    if (amount >= 0 && this.balance < 100) {
      this.balance += amount;
      if (this.balance > 100) this.balance = 100;
    }
  }
}
