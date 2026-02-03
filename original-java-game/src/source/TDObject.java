package source;

import java.awt.Dimension;
import java.awt.Point;
import java.awt.Rectangle;
import java.awt.image.BufferedImage;


public abstract class TDObject{
	
	BufferedImage img;
	protected Board gui;
	
	protected double x;
	protected double y;
	
	
	public TDObject(BufferedImage b, Board gui, int xs, int ys) {
		this.gui = gui;
		img = b;
		x = xs;
		y = ys;
	}
	public BufferedImage getImg(){
		return img;
	}
	public void setImg(BufferedImage im){
		img = im;
	}
	
	public Rectangle getBounds(){
		return new Rectangle(new Point((int)x,(int)y), new Dimension(img.getWidth(), img.getHeight()));
	}
	
	public abstract void loop();
	
	public int getX(){
		return (int)x;
	}
	public int getY(){
		return (int)y;
	}
	public void setX(int t){
		x = t;
	}
	public void setY(int t){
		y = t;
	}
	public int getWidth(){
		return img.getWidth();
	}
	public int getHeight(){
		return img.getHeight();
	}
	
}
