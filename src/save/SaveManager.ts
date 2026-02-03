export interface SaveData {
    levelsUnlocked: boolean[];
    starsEarned: number[];
}

export class SaveManager {
    private static readonly COOKIE_NAME = 'td_save';
    private static readonly COOKIE_EXPIRY_DAYS = 365;
    private static readonly NUM_LEVELS = 4;

    load(): SaveData {
        const cookieValue = this.getCookie(SaveManager.COOKIE_NAME);

        if (cookieValue) {
            try {
                const data = JSON.parse(decodeURIComponent(cookieValue)) as SaveData;
                // Validate and return
                if (this.isValidSaveData(data)) {
                    return data;
                }
            } catch (e) {
                console.warn('Failed to parse save data, using defaults');
            }
        }

        return this.getDefaultSaveData();
    }

    save(data: SaveData): void {
        const json = JSON.stringify(data);
        const encoded = encodeURIComponent(json);
        const expiryDate = new Date();
        expiryDate.setDate(expiryDate.getDate() + SaveManager.COOKIE_EXPIRY_DAYS);

        document.cookie = `${SaveManager.COOKIE_NAME}=${encoded};expires=${expiryDate.toUTCString()};path=/;SameSite=Strict`;
    }

    completeLevel(levelIndex: number, stars: number): void {
        const data = this.load();

        // Update stars if better
        if (stars > (data.starsEarned[levelIndex] || 0)) {
            data.starsEarned[levelIndex] = stars;
        }

        // Unlock next level
        if (levelIndex + 1 < SaveManager.NUM_LEVELS) {
            data.levelsUnlocked[levelIndex + 1] = true;
        }

        this.save(data);
    }

    isLevelUnlocked(levelIndex: number): boolean {
        const data = this.load();
        return data.levelsUnlocked[levelIndex] || levelIndex === 0;
    }

    getStars(levelIndex: number): number {
        const data = this.load();
        return data.starsEarned[levelIndex] || 0;
    }

    getTotalStars(): number {
        const data = this.load();
        return data.starsEarned.reduce((sum, stars) => sum + stars, 0);
    }

    reset(): void {
        this.save(this.getDefaultSaveData());
    }

    private getDefaultSaveData(): SaveData {
        return {
            levelsUnlocked: [true, false, false, false],
            starsEarned: [0, 0, 0, 0]
        };
    }

    private isValidSaveData(data: unknown): data is SaveData {
        if (!data || typeof data !== 'object') return false;

        const d = data as Record<string, unknown>;

        if (!Array.isArray(d.levelsUnlocked) || d.levelsUnlocked.length !== SaveManager.NUM_LEVELS) {
            return false;
        }

        if (!Array.isArray(d.starsEarned) || d.starsEarned.length !== SaveManager.NUM_LEVELS) {
            return false;
        }

        return true;
    }

    private getCookie(name: string): string | null {
        const nameEQ = name + '=';
        const cookies = document.cookie.split(';');

        for (let cookie of cookies) {
            cookie = cookie.trim();
            if (cookie.indexOf(nameEQ) === 0) {
                return cookie.substring(nameEQ.length);
            }
        }

        return null;
    }
}
