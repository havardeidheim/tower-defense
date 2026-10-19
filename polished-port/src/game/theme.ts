// ============================================================
// Colors and fonts of the original game (java.awt defaults)
// ============================================================

export const COLOR_BLACK = '#000000';
export const COLOR_RED = '#ff0000';
export const COLOR_GREEN = '#00ff00';
export const COLOR_BLUE = '#0000ff';
export const COLOR_ORANGE = '#ffc800';
export const COLOR_GRAY = '#808080';
export const COLOR_DARK_GRAY = '#404040';

export const COLOR_BACKGROUND = '#666444';
export const COLOR_MAP_SPAWN = '#732888';

// The text colors of the HUD
export const COLOR_GOLD = COLOR_ORANGE;
export const COLOR_MANA = COLOR_BLUE;
export const COLOR_HEALTH = COLOR_RED;
export const COLOR_TEXT = COLOR_BLACK;

function timesBold(sizePx: number): string {
  return `bold ${sizePx}px "Times New Roman", Times, "Liberation Serif", serif`;
}

export const FONT = timesBold(16);
export const FONT_TITLE = timesBold(48);
