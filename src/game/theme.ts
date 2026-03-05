// ============================================================
// Visual theme constants: colors and fonts
// Centralizes all visual styling for consistency and easy tuning.
// ============================================================

// --- Primary accent colors ---
export const COLOR_GOLD = '#FFD54F';
export const COLOR_MANA_BLUE = '#66BBFF';
export const COLOR_SELL_GREEN = '#32CD32';

// --- Text colors ---
export const COLOR_TEXT = '#DDD';
export const COLOR_TEXT_SUBTLE = '#BBB';
export const COLOR_TEXT_DISABLED = '#888';
export const COLOR_TEXT_DARK_DISABLED = '#666';
export const COLOR_TEXT_WHITE = '#FFF';

// --- Status colors ---
export const COLOR_LIVES_DANGER = '#FF4444';
export const COLOR_LIVES_SAFE = '#44CC44';

// --- Health bar ---
export const COLOR_HEALTH_HIGH = '#0f0';
export const COLOR_HEALTH_MID = '#ff0';
export const COLOR_HEALTH_LOW = '#f00';
export const COLOR_HEALTH_BG = '#333';

// --- Panel & UI chrome ---
export const COLOR_PANEL_BG = '#777755';
export const COLOR_BORDER = '#000';
export const COLOR_BORDER_LIGHT = '#666';
export const COLOR_BORDER_DARK = '#333';
export const COLOR_DISABLED_OVERLAY = 'rgba(0, 0, 0, 0.5)';
export const COLOR_GAMEOVER_OVERLAY = 'rgba(0, 0, 0, 0.7)';

// --- Button backgrounds ---
export const COLOR_BTN_ACTIVE_BG = '#887755';
export const COLOR_BTN_INACTIVE_BG = '#554433';

// --- Scene backgrounds ---
export const COLOR_LOADING_BG = '#1a1a2e';
export const COLOR_MENU_BG = '#666444';

// --- Map preview ---
export const COLOR_MAP_PATH = '#404040';
export const COLOR_MAP_SPAWN = '#732888';
export const COLOR_MAP_TILE = '#808080';

// --- Enemy indicators ---
export const COLOR_POISON_INDICATOR = 'rgba(0, 200, 0, 0.8)';
export const COLOR_SHIELD_AURA = 'rgba(100, 149, 237, 0.5)';
export const COLOR_DODGE_AURA = 'rgba(128, 0, 128, 0.2)';

// --- Enemy fallback colors (when sprites fail to load) ---
export const COLOR_ENEMY_NORMAL = '#8B4513';
export const COLOR_ENEMY_FAST = '#00FF00';
export const COLOR_ENEMY_SHIELD = '#4169E1';
export const COLOR_ENEMY_DODGE = '#800080';
export const COLOR_ENEMY_NOSLOW = COLOR_GOLD;
export const COLOR_ENEMY_SUPER = '#FF0000';
export const COLOR_ENEMY_FALLBACK = '#888';

// --- Stat display ---
export const COLOR_STAT_LABEL = '#AAA';
export const COLOR_STAT_SEPARATOR = '#888';

// ============================================================
// Fonts
// ============================================================

// Titles (Times New Roman)
export const FONT_TITLE_LG = 'bold 48px Times New Roman';
export const FONT_TITLE = 'bold 32px Times New Roman';

// Headings (Arial)
export const FONT_HEADING = 'bold 18px Arial';
export const FONT_HEADING_SM = 'bold 16px Arial';

// Labels (Arial, bold)
export const FONT_LABEL = 'bold 15px Arial';
export const FONT_LABEL_SM = 'bold 14px Arial';
export const FONT_LABEL_XS = 'bold 13px Arial';

// Body text (Arial)
export const FONT_BODY = '13px Arial';
export const FONT_BODY_SM = '12px Arial';
export const FONT_BODY_SM_BOLD = 'bold 12px Arial';
export const FONT_NOTE = 'italic 11px Arial';

// Specialized
export const FONT_MENU_LABEL = 'bold 16px Times New Roman';
export const FONT_PROGRESS = '16px Times New Roman';
export const FONT_STATUS = '14px Times New Roman';
export const FONT_GAMEOVER_BODY = '18px Times New Roman';
export const FONT_STARS = '36px Times New Roman';
export const FONT_SHIELD_COUNT = '10px Arial';
