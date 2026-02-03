package source;

import java.awt.Color;
import java.awt.Font;
import java.awt.Graphics;
import java.awt.Graphics2D;
import java.awt.RenderingHints;
import java.awt.event.MouseEvent;
import java.awt.event.MouseListener;
import java.util.ArrayList;

import javax.swing.JPanel;

import knapper.Knapp;
import knapper.MenuKnapp;

@SuppressWarnings("serial")
public class TDMenu extends JPanel implements MouseListener {

	MainFrame mainframe;
	LevelsReader levelleser;
	ArrayList<Knapp> knapper = new ArrayList<Knapp>();
	Pic bilder = new Pic();

	public TDMenu(MainFrame mf, LevelsReader ls){
		addMouseListener(this);
		levelleser = ls;
		mainframe = mf;
		setBackground(new Color(0x666444));

		for (int i = 0; i < ls.getLevelCount(); i++) {
			knapper.add(new MenuKnapp(bilder, mf, 50 + i * 200, 300, i));
		}
	}

	@Override
	public void paint(Graphics g1){
		super.paint(g1);

		Graphics2D g2 = (Graphics2D)g1;
		g2.setRenderingHint(RenderingHints.KEY_TEXT_ANTIALIASING,
                RenderingHints.VALUE_TEXT_ANTIALIAS_ON);
		
		g2.drawImage(bilder.getBackgroundpic(), 0, 0, this);
		
		g2.setFont(new Font("Times New Roman", Font.BOLD , 48));
		g2.setColor(Color.BLACK);
		g2.drawString("Road Defender: Revenge of the Road", 50, 150);
		
		g2.setColor(Color.BLACK);
		
		g2.setFont(new Font("Times New Roman", Font.BOLD , 16));
		g2.drawString("Laget av Håvard Eidheim. Lyd fra Empire Earth.", getWidth()-328, getHeight()-4);
		g2.drawString("Utopia", 50, 295);
		g2.drawString("The Butchers Ballroom", 250, 295);
		g2.drawString("Paths Untrodden", 450, 295);
		g2.drawString("Ad Astra", 650, 295);
		
		for (int i = 0; i < levelleser.getLevelCount(); i++) {
			char[][] brett = levelleser.getLevelAt(i).getLevel();
			
			g2.setColor(Color.DARK_GRAY);
			for (int j2 = 0; j2 < 5; j2++) {
				g2.drawString("*", 50 + 200*i + 10*j2, 420);
			}
			
			g2.setColor(Color.ORANGE);
			for (int j2 = 0; j2 < mainframe.getlevelstars()[i]; j2++) {
					g2.drawString("*", 50 + 200*i + 10*j2, 420);
			}
			
			for (int j = 0; j < brett.length; j++) {
				
				for (int k = 0; k < brett[j].length; k++) {
					if(brett[j][k] == Co.PATHC || brett[j][k] == Co.TARGETC) {
						g2.setColor(Color.DARK_GRAY);
					} else if (brett[j][k] == Co.SPAWNC) {
						g2.setColor(new Color(0x732888));
					} else {
						g2.setColor(Color.GRAY);
					}
					g2.fillRect(50 + 200 * i + 8 * k, 300 + 8 * j, 8, 8);
				}
			}
			if(mainframe.getlevelacces()[i] != true){
				g2.drawImage(bilder.getMapcrosspic(), 50+200*i, 300, this);
			}
		}
	}

	@Override
	public void mouseClicked(MouseEvent e){
		for (int i = 0; i < knapper.size(); i++) {
			Knapp k = knapper.get(i);
			if (mainframe.getlevelacces()[i] == true && k.getBounds().contains(e.getX(), e.getY())) {
				k.clicked();
			}
		}
	}
	public void mouseEntered(MouseEvent arg0){}
	public void mouseExited(MouseEvent arg0){}
	public void mousePressed(MouseEvent arg0){}
	public void mouseReleased(MouseEvent arg0){}
}// END
