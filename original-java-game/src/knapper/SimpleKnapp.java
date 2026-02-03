package knapper;

import java.awt.Color;
import java.awt.Font;
import java.awt.Graphics;
import java.awt.Rectangle;
import java.awt.image.BufferedImage;
import java.io.IOException;

import javax.imageio.ImageIO;

import source.Lyder;

public class SimpleKnapp{

	TDAction action;
	BufferedImage img;
	String label;
	int x;
	int y;
	
	public SimpleKnapp(int xs, int ys, String lab, TDAction ac) {
		x = xs;
		y = ys;
		action = ac;
		try {
			img = ImageIO.read(getClass().getResource("/resources/images/blancknapp.png"));
		} catch (IOException e) {
			e.printStackTrace();
		}
		label = lab;
	}
	public SimpleKnapp(int xs, int ys, BufferedImage bilde, TDAction ac) {
		x = xs;
		y = ys;
		action = ac;
		img = bilde;
	}
	public void setLabel(String nylab){
		label = nylab;
	}
	public Rectangle getBounds(){
		return new Rectangle(x, y, img.getWidth(), img.getHeight());
	}
	
	public void clicked(){
		Lyder.knapplyd.play();
		action.clicked();
	}
	
	public void draw(Graphics g){
		
		g.drawImage(img, x, y, null);
		
		if(label != null){
			g.setFont(new Font("Times New Roman", Font.BOLD , 16));
			g.setColor(Color.ORANGE);
			g.drawString(label, x + 8, y + 20);
		}
	}
	
}//END
