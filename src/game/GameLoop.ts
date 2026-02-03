import { TARGET_FPS, FRAME_TIME } from './constants';

export class GameLoop {
    private lastTime: number = 0;
    private accumulator: number = 0;
    private running: boolean = false;
    private animationFrameId: number = 0;

    constructor(
        private updateFn: (deltaTime: number) => void,
        private renderFn: () => void
    ) {}

    start(): void {
        if (this.running) return;
        this.running = true;
        this.lastTime = performance.now();
        this.loop(this.lastTime);
    }

    stop(): void {
        this.running = false;
        if (this.animationFrameId) {
            cancelAnimationFrame(this.animationFrameId);
        }
    }

    private loop = (currentTime: number): void => {
        if (!this.running) return;

        const deltaTime = currentTime - this.lastTime;
        this.lastTime = currentTime;
        this.accumulator += deltaTime;

        // Fixed timestep updates
        while (this.accumulator >= FRAME_TIME) {
            this.updateFn(FRAME_TIME);
            this.accumulator -= FRAME_TIME;
        }

        this.renderFn();
        this.animationFrameId = requestAnimationFrame(this.loop);
    };

    isRunning(): boolean {
        return this.running;
    }
}
