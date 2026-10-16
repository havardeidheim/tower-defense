/**
 * Web Audio replacement for java.applet.AudioClip. As in Java, calling play()
 * on a clip that is already playing restarts it; separate clips overlap.
 */
let ctx: AudioContext | null = null;
const buffers = new Map<string, AudioBuffer>();

export function audioContext(): AudioContext {
  if (!ctx) ctx = new AudioContext();
  return ctx;
}

/** Browsers keep audio suspended until the first user gesture. */
export function unlockAudioOnGesture(): void {
  const resume = () => {
    if (ctx && ctx.state !== 'running') void ctx.resume();
  };
  window.addEventListener('pointerdown', resume, true);
  window.addEventListener('keydown', resume, true);
}

export async function loadSound(name: string, url: string): Promise<void> {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Could not load ${url}`);
  const data = await res.arrayBuffer();
  buffers.set(name, await audioContext().decodeAudioData(data));
}

export class AudioClip {
  private source: AudioBufferSourceNode | null = null;

  constructor(private name: string) {}

  play(): void {
    const buffer = buffers.get(this.name);
    if (!buffer || !ctx) return;
    this.stop();
    const src = ctx.createBufferSource();
    src.buffer = buffer;
    src.connect(ctx.destination);
    src.onended = () => {
      if (this.source === src) this.source = null;
    };
    src.start();
    this.source = src;
  }

  stop(): void {
    if (this.source) {
      try {
        this.source.stop();
      } catch {
        // already stopped
      }
      this.source = null;
    }
  }
}
