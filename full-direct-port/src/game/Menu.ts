import { Color, font, Graphics, Rect } from '../engine/Graphics';
import { Lyder } from './Audio';
import * as Co from './Co';
import type { LevelsReader } from './Level';
import type { MainFrame } from './MainFrame';
import { Pic } from './Pic';

const LEVEL_NAMES = ['Utopia', 'The Butchers Ballroom', 'Paths Untrodden', 'Ad Astra'];

/** Level select screen with map previews and stars (TDMenu.java). */
export class TDMenu {
  private bilder = new Pic();
  private knapper: Rect[] = [];

  constructor(private mainframe: MainFrame, private levelleser: LevelsReader) {
    for (let i = 0; i < levelleser.getLevelCount(); i++) {
      this.knapper.push(new Rect(50 + i * 200, 300, 128, 96));
    }
  }

  paint(g: Graphics): void {
    g.setColor(Co.BGCOLOR);
    g.fillRect(0, 0, Co.WIDTH, Co.HEIGHT);
    g.drawImage(this.bilder.backgroundpic, 0, 0);

    g.setFont(font(48));
    g.setColor(Color.BLACK);
    g.drawString('Road Defender: Revenge of the Road', 50, 150);

    g.setFont(font(16));
    g.drawString('Laget av Håvard Eidheim. Lyd fra Empire Earth.', Co.WIDTH - 328, Co.HEIGHT - 4);
    LEVEL_NAMES.forEach((name, i) => g.drawString(name, 50 + i * 200, 295));

    const stars = this.mainframe.getlevelstars();
    const access = this.mainframe.getlevelacces();
    for (let i = 0; i < this.levelleser.getLevelCount(); i++) {
      const brett = this.levelleser.getLevelAt(i).getLevel();

      g.setColor(Color.DARK_GRAY);
      for (let j = 0; j < 5; j++) g.drawString('*', 50 + 200 * i + 10 * j, 420);
      g.setColor(Color.ORANGE);
      for (let j = 0; j < stars[i]; j++) g.drawString('*', 50 + 200 * i + 10 * j, 420);

      for (let j = 0; j < brett.length; j++) {
        for (let k = 0; k < brett[j].length; k++) {
          const c = brett[j][k];
          if (c === Co.PATHC || c === Co.TARGETC) g.setColor(Color.DARK_GRAY);
          else if (c === Co.SPAWNC) g.setColor('#732888');
          else g.setColor(Color.GRAY);
          g.fillRect(50 + 200 * i + 8 * k, 300 + 8 * j, 8, 8);
        }
      }
      if (!access[i]) g.drawImage(this.bilder.mapcrosspic, 50 + 200 * i, 300);
    }
  }

  mouseClicked(x: number, y: number): void {
    const access = this.mainframe.getlevelacces();
    for (let i = 0; i < this.knapper.length; i++) {
      if (access[i] && this.knapper[i].contains(x, y)) {
        Lyder().knapplyd.play();
        this.mainframe.newgame(i);
      }
    }
  }
}
