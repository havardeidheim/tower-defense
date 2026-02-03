package source;

import java.awt.image.BufferedImage;
import java.util.ArrayList;

import towers.Tower;

public class AreaShot extends TDObject {

	int frames = 0;
	
	int opx;
	int opy;
	boolean started = false;
	Tower skuttav;
	public ArrayList<BufferedImage> bilder;
	
	public AreaShot(Board gui, int xs, int ys, Tower t) {
		super(gui.getBilder().getAreashot().get(0) , gui, xs, ys);
		loop();
		opx = xs;
		opy = ys;
		bilder = gui.getBilder().getAreashot();
		skuttav = t;
		started = true;
	}
	
	@Override
	public int getWidth(){
		return skuttav.getRange()*2;
	}
	@Override
	public int getHeight(){
		return skuttav.getRange()*2;
	}
	
	@Override
	public void loop(){
		if(!started){
			return;
		}
		if(frames >= bilder.size()){
			die();
			return;
		}
		setImg(bilder.get(frames));
		setX((int)(opx - getWidth()/2));
		setY((int)(opy - getHeight()/2));
		
		frames++;
	}
	public void die(){
		gui.removeAreaShot(this);
	}

}
