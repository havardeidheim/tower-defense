/**
 * Plays the game's sound effects with Web Audio.
 *
 * Like the original's audio clips, playing a sound that is still playing on the
 * same channel restarts it. Each sound is its own channel unless a channel owner
 * is given: every tower passes itself, so two towers firing overlap, while one
 * tower firing quickly restarts its own sound.
 */
export class SoundManager {
  private context: AudioContext | null = null;
  private buffers = new Map<string, AudioBuffer>();
  private shared = new Map<string, AudioBufferSourceNode>();
  private owned = new WeakMap<object, Map<string, AudioBufferSourceNode>>();

  init(): void {
    if (this.context || typeof AudioContext === 'undefined') return;
    try {
      this.context = new AudioContext();
    } catch (e) {
      console.warn('Audio is not available, the game runs silently', e);
    }
  }

  /** Browsers keep audio suspended until the first user gesture. */
  unlockOnGesture(target: EventTarget): void {
    const resume = () => {
      if (this.context && this.context.state !== 'running') void this.context.resume();
    };
    target.addEventListener('pointerdown', resume, true);
    target.addEventListener('keydown', resume, true);
  }

  async load(key: string, url: string): Promise<void> {
    if (!this.context) return;
    const response = await fetch(url);
    if (!response.ok) throw new Error(`Could not load ${url}`);
    const data = await response.arrayBuffer();
    this.buffers.set(key, await this.context.decodeAudioData(data));
  }

  play(key: string, owner?: object): void {
    const buffer = this.buffers.get(key);
    if (!buffer || !this.context) return;

    const channel = owner ? this.channelOf(owner) : this.shared;
    channel.get(key)?.stop();

    const source = this.context.createBufferSource();
    source.buffer = buffer;
    source.connect(this.context.destination);
    source.onended = () => {
      if (channel.get(key) === source) channel.delete(key);
    };
    source.start();
    channel.set(key, source);
  }

  private channelOf(owner: object): Map<string, AudioBufferSourceNode> {
    let channel = this.owned.get(owner);
    if (!channel) {
      channel = new Map();
      this.owned.set(owner, channel);
    }
    return channel;
  }
}
