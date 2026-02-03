export class SoundManager {
    private context: AudioContext | null = null;
    private buffers: Map<string, AudioBuffer> = new Map();
    private enabled: boolean = true;

    async init(): Promise<void> {
        this.context = new AudioContext();
    }

    async loadSound(key: string, url: string): Promise<void> {
        if (!this.context) await this.init();

        try {
            const response = await fetch(url);
            const arrayBuffer = await response.arrayBuffer();
            const audioBuffer = await this.context!.decodeAudioData(arrayBuffer);
            this.buffers.set(key, audioBuffer);
        } catch (e) {
            console.warn(`Failed to load sound: ${url}`, e);
        }
    }

    play(key: string): void {
        if (!this.enabled || !this.context) return;

        const buffer = this.buffers.get(key);
        if (buffer) {
            // Resume context if suspended (browser autoplay policy)
            if (this.context.state === 'suspended') {
                this.context.resume();
            }

            const source = this.context.createBufferSource();
            source.buffer = buffer;
            source.connect(this.context.destination);
            source.start();
        }
    }

    setEnabled(enabled: boolean): void {
        this.enabled = enabled;
    }

    isEnabled(): boolean {
        return this.enabled;
    }
}
