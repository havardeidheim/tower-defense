import { Vector2 } from './Vector2';
import { Rectangle } from './Rectangle';

export abstract class GameObject {
    x: number = 0;
    y: number = 0;
    width: number = 40;
    height: number = 40;
    active: boolean = true;

    get centerX(): number { return this.x + this.width / 2; }
    get centerY(): number { return this.y + this.height / 2; }
    get center(): Vector2 { return new Vector2(this.centerX, this.centerY); }
    get bounds(): Rectangle { return new Rectangle(this.x, this.y, this.width, this.height); }

    abstract update(deltaTime: number): void;
    abstract render(ctx: CanvasRenderingContext2D): void;

    distanceTo(other: GameObject): number {
        const dx = this.centerX - other.centerX;
        const dy = this.centerY - other.centerY;
        return Math.sqrt(dx * dx + dy * dy);
    }

    setPosition(x: number, y: number): void {
        this.x = x;
        this.y = y;
    }

    setCenterPosition(x: number, y: number): void {
        this.x = x - this.width / 2;
        this.y = y - this.height / 2;
    }
}
