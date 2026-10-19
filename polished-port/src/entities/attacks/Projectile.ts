import { ENEMY_SIZE, PROJECTILE_SIZE } from '../../game/constants';
import { resources } from '../../resources/ResourceLoader';
import type { World } from '../../world/World';
import type { Enemy } from '../enemies/Enemy';
import type { Tower } from '../towers/Tower';

const HALF = PROJECTILE_SIZE / 2;

/** A heat-seeking shot that turns towards its target every tick. */
export abstract class Projectile {
  /** Top-left corner. Starts at the center of the tower that fired it. */
  x: number;
  y: number;
  done = false;
  protected target: Enemy | null;

  constructor(
    readonly tower: Tower,
    target: Enemy,
    readonly damage: number,
    private readonly speed: number,
    private readonly image: string,
  ) {
    this.x = tower.centerX;
    this.y = tower.centerY;
    this.target = target;
  }

  update(world: World): void {
    const target = this.target;
    if (!target || !target.alive) {
      this.targetLost(world);
      return;
    }
    this.flyTowards(target);
  }

  /** The target died or escaped before the hit. */
  protected targetLost(_world: World): void {
    this.tower.lostShot();
    this.done = true;
  }

  protected flyTowards(target: Enemy): void {
    const angle = Math.atan2(this.dy(target), this.dx(target));
    this.x += this.speed * Math.cos(angle);
    this.y += this.speed * Math.sin(angle);
    if (this.distanceTo(target) < HALF + ENEMY_SIZE / 2) this.onHit(target);
  }

  protected abstract onHit(target: Enemy): void;

  private dx(target: Enemy): number {
    return target.centerX - (this.x + HALF);
  }

  private dy(target: Enemy): number {
    return target.centerY - (this.y + HALF);
  }

  /** Center to center, in whole pixels. */
  protected distanceTo(target: Enemy): number {
    const dx = this.dx(target);
    const dy = this.dy(target);
    return Math.trunc(Math.sqrt(dx * dx + dy * dy));
  }

  render(ctx: CanvasRenderingContext2D): void {
    resources.images.draw(ctx, this.image, Math.trunc(this.x), Math.trunc(this.y));
  }
}
