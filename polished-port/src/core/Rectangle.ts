export class Rectangle {
  constructor(
    readonly x: number,
    readonly y: number,
    readonly width: number,
    readonly height: number,
  ) {}

  get right(): number {
    return this.x + this.width;
  }

  get bottom(): number {
    return this.y + this.height;
  }

  /** The left and top edges are inside, the right and bottom edges are not. */
  contains(px: number, py: number): boolean {
    return px >= this.x && py >= this.y && px < this.right && py < this.bottom;
  }
}
