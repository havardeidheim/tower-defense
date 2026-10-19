import { resources } from '../../resources/ResourceLoader';

/** The images of the ring, shrinking from large to small, one per tick. */
const FRAMES = [5, 4, 3, 3, 2, 2, 1, 0];

/** The frost tower's pulse, drawn over the whole range. Only a visual; the tower deals the damage. */
export class FrostRing {
  done = false;
  /** -1 until its first update, so it is never drawn before it starts. */
  private frame = -1;

  constructor(
    private readonly centerX: number,
    private readonly centerY: number,
    private readonly radius: number,
  ) {}

  update(): void {
    this.frame++;
    if (this.frame >= FRAMES.length) this.done = true;
  }

  render(ctx: CanvasRenderingContext2D): void {
    if (this.frame < 0 || this.done) return;
    const size = this.radius * 2;
    resources.images.draw(
      ctx,
      `areashot${FRAMES[this.frame]}`,
      this.centerX - this.radius,
      this.centerY - this.radius,
      size,
      size,
    );
  }
}
