package knapper;

import java.awt.image.BufferedImage;

import source.Lyder;
import source.MainFrame;
import source.Pic;

public class MenuKnapp extends Knapp {

	int nr;
	MainFrame mainframe;
	
	public MenuKnapp(Pic b, MainFrame mf, int xs, int ys, int in) {
		super(new BufferedImage(128,96,BufferedImage.TYPE_INT_ARGB), null, xs, ys);
		nr = in;
		mainframe = mf;
	}

	@Override
	public void clicked() {
		Lyder.knapplyd.play();
		mainframe.newgame(nr);
	}
}//END
