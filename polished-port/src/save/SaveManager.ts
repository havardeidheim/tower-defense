export interface Progress {
  /** Best result per level: the health left at the end, 0 to 5. */
  stars: number[];
}

const STORAGE_KEY = 'roadDefender.polishedPort.progress';

/** Level progress, kept in localStorage. Every level can be played; only the stars are saved. */
export class SaveManager {
  constructor(private readonly levelCount: number) {}

  load(): Progress {
    const progress: Progress = { stars: Array.from({ length: this.levelCount }, () => 0) };
    try {
      const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? 'null') as Partial<Progress> | null;
      for (let i = 0; i < this.levelCount; i++) {
        const stars = saved?.stars?.[i];
        if (typeof stars === 'number' && stars >= 0) progress.stars[i] = stars;
      }
    } catch {
      // No storage or unreadable data: start fresh.
    }
    return progress;
  }

  /**
   * Records how a level ended: the health left counts as stars if it beats the
   * best so far. Leaving through the menu counts as 0.
   */
  recordResult(levelIndex: number, healthLeft: number): void {
    const progress = this.load();
    if (healthLeft <= progress.stars[levelIndex]) return;
    progress.stars[levelIndex] = healthLeft;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
    } catch {
      // Progress is not saved when storage is unavailable.
    }
  }
}
