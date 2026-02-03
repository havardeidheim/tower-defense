import { ImageCache } from './ImageCache';
import { SoundManager } from './SoundManager';
import { LevelLoader } from './LevelLoader';

export interface ResourceManifest {
    images: { key: string; path: string }[];
    sounds: { key: string; path: string }[];
}

export class ResourceLoader {
    imageCache: ImageCache = new ImageCache();
    soundManager: SoundManager = new SoundManager();
    levelLoader: LevelLoader = new LevelLoader();

    private loaded: number = 0;
    private total: number = 0;
    private onProgressCallback?: (progress: number, message: string) => void;

    onProgress(callback: (progress: number, message: string) => void): void {
        this.onProgressCallback = callback;
    }

    async loadAll(): Promise<void> {
        const manifest = this.getManifest();
        this.total = manifest.images.length + manifest.sounds.length + 1; // +1 for levels
        this.loaded = 0;

        // Load images
        const imagePromises = manifest.images.map(img => this.loadImage(img.key, img.path));

        // Load sounds
        await this.soundManager.init();
        const soundPromises = manifest.sounds.map(snd => this.loadSound(snd.key, snd.path));

        // Load levels
        const levelPromise = this.loadLevels();

        await Promise.all([...imagePromises, ...soundPromises, levelPromise]);
    }

    private async loadImage(key: string, path: string): Promise<void> {
        return new Promise((resolve) => {
            const img = new Image();
            img.onload = () => {
                this.imageCache.set(key, img);
                this.incrementProgress(`Loaded image: ${key}`);
                resolve();
            };
            img.onerror = () => {
                console.warn(`Failed to load image: ${path}`);
                this.incrementProgress(`Failed: ${key}`);
                resolve();
            };
            img.src = path;
        });
    }

    private async loadSound(key: string, path: string): Promise<void> {
        await this.soundManager.loadSound(key, path);
        this.incrementProgress(`Loaded sound: ${key}`);
    }

    private async loadLevels(): Promise<void> {
        await this.levelLoader.load();
        this.incrementProgress('Loaded levels');
    }

    private incrementProgress(message: string): void {
        this.loaded++;
        const progress = this.loaded / this.total;
        this.onProgressCallback?.(progress, message);
    }

    getProgress(): number {
        return this.total > 0 ? this.loaded / this.total : 0;
    }

    private getManifest(): ResourceManifest {
        const images: { key: string; path: string }[] = [
            // UI and background
            { key: 'background', path: 'images/background.png' },
            { key: 'helpback', path: 'images/helpback.png' },
            { key: 'ground', path: 'images/ground.png' },
            { key: 'path', path: 'images/path.png' },
            { key: 'spawn', path: 'images/spawn.png' },
            { key: 'select', path: 'images/select.png' },
            { key: 'cross', path: 'images/cross.png' },
            { key: 'mapcross', path: 'images/mapcross.png' },

            // Towers
            { key: 'normaltower', path: 'images/normaltower.png' },
            { key: 'areatower', path: 'images/areatower.png' },
            { key: 'poisontower', path: 'images/poisontower.png' },
            { key: 'spreadtower', path: 'images/spreadtower.png' },
            { key: 'blanctower', path: 'images/blanctower.png' },

            // Projectiles
            { key: 'normalprojectile', path: 'images/normalprojectile.png' },
            { key: 'poisonprojectile', path: 'images/poisonprojectile.png' },
            { key: 'spreadprojectile', path: 'images/spreadprojectile.png' },

            // Buttons
            { key: 'blancknapp', path: 'images/blancknapp.png' },
            { key: 'upgradeknapp', path: 'images/upgradeknapp.png' },
            { key: 'sellknapp', path: 'images/sellknapp.png' },
            { key: 'lightningknapp', path: 'images/lightningknapp.png' },

            // Effects
            { key: 'lightning', path: 'images/lightning.png' },

            // Range circles
            { key: 'range80', path: 'images/range/range80.png' },
            { key: 'range100', path: 'images/range/range100.png' },
            { key: 'range120', path: 'images/range/range120.png' },
            { key: 'range140', path: 'images/range/range140.png' },
            { key: 'range150', path: 'images/range/range150.png' },
            { key: 'range160', path: 'images/range/range160.png' },
            { key: 'range170', path: 'images/range/range170.png' },

            // Area shot animation frames
            { key: 'areashot0', path: 'images/areashot/areashot0.png' },
            { key: 'areashot1', path: 'images/areashot/areashot1.png' },
            { key: 'areashot2', path: 'images/areashot/areashot2.png' },
            { key: 'areashot3', path: 'images/areashot/areashot3.png' },
            { key: 'areashot4', path: 'images/areashot/areashot4.png' },
            { key: 'areashot5', path: 'images/areashot/areashot5.png' },

            // Enemy sprites (using right-facing only, will rotate)
            { key: 'peasant', path: 'images/peasant/peasantr.png' },
            { key: 'solider', path: 'images/solider/soliderr.png' },
            { key: 'scout', path: 'images/scout/scoutr.png' },
            { key: 'assassin', path: 'images/assassin/assassinr.png' },
            { key: 'vanguard', path: 'images/vanguard/vanguardr.png' },
            { key: 'paragon', path: 'images/paragon/paragonr.png' },
        ];

        const sounds: { key: string; path: string }[] = [
            // UI sounds
            { key: 'select', path: 'sounds/select.wav' },
            { key: 'build', path: 'sounds/build.wav' },
            { key: 'knapp', path: 'sounds/knapp.wav' },
            { key: 'sell', path: 'sounds/sell.wav' },

            // Combat sounds
            { key: 'stone', path: 'sounds/stone.wav' },
            { key: 'frost', path: 'sounds/frost.wav' },
            { key: 'fire', path: 'sounds/fire.wav' },
            { key: 'poison', path: 'sounds/poison.wav' },
            { key: 'lightning', path: 'sounds/lightning.wav' },

            // Game state sounds
            { key: 'die', path: 'sounds/die.wav' },
            { key: 'ok', path: 'sounds/ok.wav' },
            { key: 'verygood', path: 'sounds/verygood.wav' },

            // Level narration
            { key: 'endiscoming', path: 'sounds/endiscoming.wav' },
            { key: 'forseevictory', path: 'sounds/forseevictory.wav' },
            { key: 'noonealive', path: 'sounds/noonealive.wav' },
            { key: 'letsgo', path: 'sounds/letsgo.wav' },
        ];

        return { images, sounds };
    }
}

// Global resource instance
export const resources = new ResourceLoader();
