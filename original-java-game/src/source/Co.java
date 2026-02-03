package source;

import java.awt.Color;
import java.awt.Dimension;
import java.awt.Rectangle;

public class Co {
	public static final Color BGCOLOR = new Color(255, 255, 255);
	public static final Dimension WINDOWSIZE = new Dimension(800, 480);
	public static final Rectangle DRAWINGAREA = new Rectangle(0, 0, 640, 480);
	
	public static final int IMGSIZE = 40;
	
	public static final char GROUNDC = '.';
	public static final char OBSTACLEC = '#';
	public static final char PATHC = 'x';
	public static final char SPAWNC = 's';
	public static final char TARGETC = 't';
	
	public static final String NORMALTYPE = "Normal"; 
	public static final String POISONTYPE = "Poison"; 
	public static final String SPREADTYPE = "Spread"; 
	public static final String AREATYPE = "Area"; 
	
	public static final String LIGHTNINGTYPE = "Lightning";
	public static final String RUNESTONETYPE = "Runestone";
	
	public static final char NORMALENEMYC = 'n';
	public static final char FASTENEMYC = 'f';
	public static final char SHIELDENEMYC = 's';
	public static final char DODGEENEMYC = 'd';
	public static final char NOSLOWENEMYC = '<';
	public static final char SUPERENEMYC = '*';
	
	public static final String LEVELSPATH = "/resources/levels/levels.txt";
	public static final String WAVESPATH = "/resources/levels/wavedata.txt";
	public static final String HELPPATH = "/resources/levels/info.txt";
}//END
