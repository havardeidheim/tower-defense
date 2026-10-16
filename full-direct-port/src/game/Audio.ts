import { AudioClip } from '../engine/AudioClip';

/** Sound effects (Audio.java). Each instance has its own clips, as in the original. */
export class Audio {
  readonly startlyd = [
    new AudioClip('endiscoming'),
    new AudioClip('forseevictory'),
    new AudioClip('noonealive'),
    new AudioClip('letsgo'),
  ];
  readonly lynlyd = new AudioClip('lightning');
  readonly verygood = new AudioClip('verygood');
  readonly buildlyd = new AudioClip('build');
  readonly knapplyd = new AudioClip('knapp');
  readonly selectlyd = new AudioClip('select');
  readonly selllyd = new AudioClip('sell');
  readonly dielyd = new AudioClip('die');
  readonly oklyd = new AudioClip('ok');

  // Every tower gets its own firing clip.
  getStoneLyd(): AudioClip {
    return new AudioClip('stone');
  }
  getAreaLyd(): AudioClip {
    return new AudioClip('frost');
  }
  getSpreadLyd(): AudioClip {
    return new AudioClip('fire');
  }
  getPoisonLyd(): AudioClip {
    return new AudioClip('poison');
  }
}

let shared: Audio | null = null;

/** The static clips from Lyder.java, used by plain buttons, menu buttons and tower selection. */
export function Lyder(): Audio {
  if (!shared) shared = new Audio();
  return shared;
}
