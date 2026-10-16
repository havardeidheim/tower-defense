import { image } from '../engine/Assets';
import * as Co from './Co';

export type Img = HTMLImageElement;
export type DirImages = Record<string, Img>;

function dirs(name: string): DirImages {
  const m: DirImages = {};
  for (const d of ['u', 'd', 'l', 'r']) m[d] = image(`${name}/${name}${d}.png`);
  return m;
}

/** All sprites (Pic.java). */
export class Pic {
  readonly backgroundpic = image('background.png');
  readonly helpbackgroundpic = image('helpback.png');
  readonly pathpic = image('path.png');
  readonly spawnpic = image('spawn.png');
  readonly blancknapppic = image('blancknapp.png');
  readonly blanctowerpic = image('blanctower.png');
  readonly upgradepic = image('upgradeknapp.png');
  readonly sellpic = image('sellknapp.png');
  readonly lightningpic = image('lightning.png');
  readonly lightningknapppic = image('lightningknapp.png');
  readonly mapcrosspic = image('mapcross.png');
  readonly crosspic = image('cross.png');
  readonly selectpic = image('select.png');
  readonly normalprojectileimage = image('normalprojectile.png');
  readonly spreadprojectileimage = image('spreadprojectile.png');
  readonly poisonprojectileimage = image('poisonprojectile.png');

  readonly towerpic: Record<string, Img> = {
    [Co.NORMALTYPE]: image('normaltower.png'),
    [Co.POISONTYPE]: image('poisontower.png'),
    [Co.AREATYPE]: image('areatower.png'),
    [Co.SPREADTYPE]: image('spreadtower.png'),
    [Co.LIGHTNINGTYPE]: image('lightningknapp.png'),
    [Co.RUNESTONETYPE]: image('blanctower.png'),
  };

  readonly peasant = dirs('peasant');
  readonly solider = dirs('solider');
  readonly scout = dirs('scout');
  readonly assassin = dirs('assassin');
  readonly vanguard = dirs('vanguard');
  readonly paragon = dirs('paragon');

  readonly rangepic = new Map<number, Img>(
    [170, 160, 150, 140, 120, 100, 80].map((r) => [r, image(`range/range${r}.png`)]),
  );

  /** The frost ring animation, played from large to small. */
  readonly areashot: Img[] = [5, 4, 3, 3, 2, 2, 1, 0].map((i) => image(`areashot/areashot${i}.png`));
}
