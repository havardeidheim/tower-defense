export class ImageCache {
    private images: Map<string, HTMLImageElement> = new Map();

    set(key: string, image: HTMLImageElement): void {
        this.images.set(key, image);
    }

    get(key: string): HTMLImageElement | undefined {
        return this.images.get(key);
    }

    has(key: string): boolean {
        return this.images.has(key);
    }

    getAll(): Map<string, HTMLImageElement> {
        return this.images;
    }
}
