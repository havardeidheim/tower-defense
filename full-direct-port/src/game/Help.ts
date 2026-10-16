import { SimpleKnapp } from '../buttons/Buttons';
import { readBlocks, text } from '../engine/Assets';
import { Color, Graphics } from '../engine/Graphics';
import type { Board } from './Board';
import type { Img } from './Pic';

/** Paged help window drawn over the board (TDHelp.java). It does not block clicks underneath. */
export class TDHelp {
  private img: Img;
  private textNr = 0;
  private tekst: string[][];
  private prev: SimpleKnapp;
  private next: SimpleKnapp;
  private close: SimpleKnapp;
  private tldr: SimpleKnapp;

  constructor(gui: Board, private x: number, private y: number) {
    const b = gui.getBilder();
    this.img = b.helpbackgroundpic;
    this.tekst = readBlocks(text('info.txt'));

    this.prev = new SimpleKnapp(x + 10, y + 260, 'Back', () => {
      if (this.textNr > 0) this.textNr--;
    }, b);
    this.next = new SimpleKnapp(x + 90, y + 260, 'Next', () => {
      if (this.textNr < this.tekst.length - 1) this.textNr++;
    }, b);
    this.close = new SimpleKnapp(x + 320, y + 260, 'Close', () => {
      gui.hidehelpscreen();
      gui.removeKnapp(this.prev);
      gui.removeKnapp(this.next);
      gui.removeKnapp(this.close);
      gui.removeKnapp(this.tldr);
    }, b);
    this.tldr = new SimpleKnapp(x + 210, y + 260, 'tl:dr', () => {
      this.textNr = this.tekst.length - 1;
    }, b);

    gui.addKnapp(this.tldr);
    gui.addKnapp(this.prev);
    gui.addKnapp(this.next);
    gui.addKnapp(this.close);
  }

  draw(g: Graphics): void {
    const w = this.img.width;
    const h = this.img.height;
    g.setColor(Color.BLACK);
    g.drawImage(this.img, this.x, this.y, w, h);
    g.drawRect(this.x + 2, this.y + 2, w - 4, h - 4);
    g.drawRect(this.x, this.y, w, h);
    const page = this.tekst[this.textNr] ?? [];
    for (let i = 0; i < page.length; i++) g.drawString(page[i], this.x + 10, this.y + 20 + i * 15);
  }
}
