import { loadAll } from './engine/Assets';
import { audioContext, unlockAudioOnGesture } from './engine/AudioClip';
import { Color, font, Graphics } from './engine/Graphics';
import * as Co from './game/Co';
import { MainFrame } from './game/MainFrame';

/**
 * Browser wrapper: a canvas at the original 850x480 resolution, scaled to fit
 * the window, a loading screen while assets load, then the game itself.
 */
const canvas = document.getElementById('game') as HTMLCanvasElement;
const ctx = canvas.getContext('2d')!;
const g = new Graphics(ctx);
let scale = 1;

function resize(): void {
  const s = Math.min(window.innerWidth / Co.WIDTH, window.innerHeight / Co.HEIGHT);
  const dpr = window.devicePixelRatio || 1;
  canvas.style.width = `${Math.floor(Co.WIDTH * s)}px`;
  canvas.style.height = `${Math.floor(Co.HEIGHT * s)}px`;
  canvas.width = Math.round(Co.WIDTH * s * dpr);
  canvas.height = Math.round(Co.HEIGHT * s * dpr);
  scale = s * dpr;
}

function beginFrame(): void {
  ctx.setTransform(scale, 0, 0, scale, 0, 0);
  ctx.imageSmoothingEnabled = true;
  ctx.textBaseline = 'alphabetic';
}

function drawLoading(done: number, total: number): void {
  beginFrame();
  g.setColor(Co.BGCOLOR);
  g.fillRect(0, 0, Co.WIDTH, Co.HEIGHT);
  g.setColor(Color.BLACK);
  g.setFont(font(48));
  g.drawString('Road Defender: Revenge of the Road', 50, 150);
  g.setFont(font(16));
  g.drawString(`Loading... ${done}/${total}`, 50, 290);
  g.drawRect(50, 300, 750, 20);
  g.setColor(Color.ORANGE);
  g.fillRect(52, 302, Math.round((746 * done) / Math.max(total, 1)), 17);
}

function drawError(message: string): void {
  beginFrame();
  g.setColor(Co.BGCOLOR);
  g.fillRect(0, 0, Co.WIDTH, Co.HEIGHT);
  g.setColor(Color.RED);
  g.setFont(font(16));
  g.drawString(message, 50, 240);
}

function toGame(e: MouseEvent): { x: number; y: number } | null {
  const r = canvas.getBoundingClientRect();
  const x = Math.floor(((e.clientX - r.left) / r.width) * Co.WIDTH);
  const y = Math.floor(((e.clientY - r.top) / r.height) * Co.HEIGHT);
  if (x < 0 || y < 0 || x >= Co.WIDTH || y >= Co.HEIGHT) return null;
  return { x, y };
}

function startGame(): void {
  const frame = new MainFrame();

  canvas.addEventListener('pointermove', (e) => frame.setMouse(toGame(e)));
  canvas.addEventListener('pointerleave', () => frame.setMouse(null));
  canvas.addEventListener('pointerdown', (e) => {
    const p = toGame(e);
    frame.setMouse(p);
    if (p) frame.mousePressed(p.x, p.y, e.button);
  });
  canvas.addEventListener('click', (e) => {
    const p = toGame(e);
    if (p) frame.mouseClicked(p.x, p.y);
  });

  let last = performance.now();
  const tick = (now: number) => {
    // Cap the step so a backgrounded tab does not fast-forward the game.
    const elapsed = Math.min(now - last, 100);
    last = now;
    frame.update(elapsed);
    beginFrame();
    frame.paint(g);
    requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);
}

async function boot(): Promise<void> {
  resize();
  window.addEventListener('resize', resize);
  canvas.addEventListener('contextmenu', (e) => e.preventDefault());
  audioContext();
  unlockAudioOnGesture();

  try {
    await loadAll(drawLoading);
  } catch (e) {
    drawError(`Could not load the game: ${String(e)}`);
    return;
  }
  startGame();
}

void boot();
