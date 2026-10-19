import { TICK_MS } from './constants';

/** Longest stretch of real time one frame may catch up on, so a hidden tab does not fast-forward. */
const MAX_FRAME_MS = 100;

/**
 * Runs fixed 20 ms ticks, as many as real time calls for, and renders once per
 * animation frame.
 */
export class GameLoop {
  private last = 0;
  private pending = 0;
  private running = false;

  constructor(
    private readonly tick: () => void,
    private readonly render: () => void,
  ) {}

  start(): void {
    if (this.running) return;
    this.running = true;
    this.last = performance.now();
    requestAnimationFrame(this.frame);
  }

  private frame = (now: number): void => {
    this.pending += Math.min(now - this.last, MAX_FRAME_MS);
    this.last = now;
    while (this.pending >= TICK_MS) {
      this.tick();
      this.pending -= TICK_MS;
    }
    this.render();
    requestAnimationFrame(this.frame);
  };
}
