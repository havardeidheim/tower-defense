/**
 * A repeating timer counted in ticks. Call tick() once per game tick; it returns
 * true on the ticks where the interval fires.
 */
export class Interval {
  private remaining: number;

  constructor(
    private readonly interval: number,
    firstAfter: number = interval,
  ) {
    this.remaining = firstAfter;
  }

  tick(): boolean {
    this.remaining--;
    if (this.remaining > 0) return false;
    this.remaining = this.interval;
    return true;
  }
}
