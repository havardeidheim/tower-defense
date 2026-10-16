import { Rect } from '../engine/Graphics';

/** Game constants (Co.java). */
export const WIDTH = 850;
export const HEIGHT = 480;
export const BGCOLOR = '#666444';
export const DRAWINGAREA = new Rect(0, 0, 640, 480);

export const IMGSIZE = 40;

export const GROUNDC = '.';
export const OBSTACLEC = '#';
export const PATHC = 'x';
export const SPAWNC = 's';
export const TARGETC = 't';

export const NORMALTYPE = 'Normal';
export const POISONTYPE = 'Poison';
export const SPREADTYPE = 'Spread';
export const AREATYPE = 'Area';

export const LIGHTNINGTYPE = 'Lightning';
export const RUNESTONETYPE = 'Runestone';

export const NORMALENEMYC = 'n';
export const FASTENEMYC = 'f';
export const SHIELDENEMYC = 's';
export const DODGEENEMYC = 'd';
export const NOSLOWENEMYC = '<';
export const SUPERENEMYC = '*';
