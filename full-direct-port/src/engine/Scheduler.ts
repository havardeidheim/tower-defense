/**
 * Virtual clock that stands in for the threads and timers of the Java original.
 *
 * The Java game ran its logic on a java.util.Timer (20 ms fixed rate) and used
 * many javax.swing.Timer instances for spawning, poison ticks, tower reloads and
 * slow durations. All of those ran in real time, independently of the game loop.
 * Here every timer is driven by one virtual clock that advances with real time,
 * and due timers fire in chronological order, so their relative timing matches.
 */
export class Scheduler {
  now = 0;
  private pending = new Set<SwingTimer>();
  private seq = 0;

  advance(ms: number): void {
    const target = this.now + ms;
    for (;;) {
      let next: SwingTimer | null = null;
      for (const t of this.pending) {
        if (t.due > target) continue;
        if (!next || t.due < next.due || (t.due === next.due && t.seq < next.seq)) {
          next = t;
        }
      }
      if (!next) break;
      this.now = next.due;
      next.fire();
    }
    this.now = target;
  }

  schedule(t: SwingTimer, due: number): void {
    t.due = due;
    t.seq = this.seq++;
    this.pending.add(t);
  }

  unschedule(t: SwingTimer): void {
    this.pending.delete(t);
  }
}

/** Emulates javax.swing.Timer: repeating, with separate initial delay and delay. */
export class SwingTimer {
  due = 0;
  seq = 0;
  private delay: number;
  private initialDelay: number;
  private running = false;

  constructor(private scheduler: Scheduler, delay: number, private action: () => void) {
    this.delay = delay;
    this.initialDelay = delay;
  }

  start(): void {
    if (this.running) return;
    this.running = true;
    this.scheduler.schedule(this, this.scheduler.now + this.initialDelay);
  }

  stop(): void {
    this.running = false;
    this.scheduler.unschedule(this);
  }

  restart(): void {
    this.stop();
    this.start();
  }

  setDelay(d: number): void {
    this.delay = d;
  }

  setInitialDelay(d: number): void {
    this.initialDelay = d;
  }

  fire(): void {
    // Re-queue before running the action so the action may stop or restart us.
    this.scheduler.schedule(this, this.scheduler.now + this.delay);
    this.action();
  }
}
