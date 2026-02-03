import { Vector2 } from './Vector2';

export class Rectangle {
    constructor(
        public x: number,
        public y: number,
        public width: number,
        public height: number
    ) {}

    get left(): number { return this.x; }
    get right(): number { return this.x + this.width; }
    get top(): number { return this.y; }
    get bottom(): number { return this.y + this.height; }
    get centerX(): number { return this.x + this.width / 2; }
    get centerY(): number { return this.y + this.height / 2; }
    get center(): Vector2 { return new Vector2(this.centerX, this.centerY); }

    contains(x: number, y: number): boolean {
        return x >= this.left && x <= this.right && y >= this.top && y <= this.bottom;
    }

    containsPoint(point: Vector2): boolean {
        return this.contains(point.x, point.y);
    }

    intersects(other: Rectangle): boolean {
        return !(this.right < other.left || this.left > other.right ||
                 this.bottom < other.top || this.top > other.bottom);
    }

    clone(): Rectangle {
        return new Rectangle(this.x, this.y, this.width, this.height);
    }
}
