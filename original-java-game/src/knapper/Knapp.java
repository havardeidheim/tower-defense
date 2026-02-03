package knapper;

import java.awt.image.BufferedImage;

import source.Board;
import source.TDObject;

public abstract class Knapp extends TDObject{

	public Knapp(BufferedImage b, Board gui, int xs, int ys) {
		super(b, gui, xs, ys);
	}
	@Override
	public void loop() {
		//nothing
	}
	
	public abstract void clicked();
}
