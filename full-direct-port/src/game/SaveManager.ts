/**
 * Cookie-based stand-in for the original's data.txt. The value keeps the same
 * format: one 't'/'f' per level for access, then one digit per level for stars.
 * The cookie name is unique so it does not clash with other builds on the same host.
 */
const COOKIE = 'roadDefenderClassicSave';
const TEN_YEARS = 60 * 60 * 24 * 365 * 10;

export interface SaveData {
  levelacces: boolean[];
  levelstars: number[];
}

export function load(levelCount: number): SaveData | null {
  const entry = document.cookie.split('; ').find((c) => c.startsWith(`${COOKIE}=`));
  if (!entry) return null;
  const raw = decodeURIComponent(entry.slice(COOKIE.length + 1));
  const levelacces: boolean[] = [];
  const levelstars: number[] = [];
  for (let i = 0; i < levelCount; i++) levelacces.push(raw.charAt(i) === 't');
  for (let i = 0; i < levelCount; i++) {
    const c = raw.charAt(levelCount + i);
    levelstars.push(c >= '0' && c <= '9' ? Number(c) : 0);
  }
  return { levelacces, levelstars };
}

export function save(data: SaveData): void {
  const raw = data.levelacces.map((a) => (a ? 't' : 'f')).join('') + data.levelstars.join('');
  document.cookie = `${COOKIE}=${encodeURIComponent(raw)}; max-age=${TEN_YEARS}; path=/; SameSite=Lax`;
}
