package source;

import java.awt.Point;
import java.util.ArrayList;

public class Level{

	private char[][] brett;
	private String[] waves;
	private ArrayList<Point> startposses = new ArrayList<Point>();
	
	ArrayList<String> dir = new ArrayList<String>();
	
	public Level(char[][] buildthis, String[] wavess){
		brett = buildthis;
		waves = wavess;
		findstartposses();
	}
	public char[][] getLevel() {
		char[][] returnthis = new char[brett.length][]; 
		for(int i = 0; i < brett.length; i++){
			returnthis[i] = brett[i];
		}
		return returnthis;
	}
	public String[] getWaves(){
		String[] returnthis = new String[waves.length]; 
		for(int i = 0; i < waves.length; i++){
			returnthis[i] = waves[i];
		}
		return returnthis;
	}
	
	int posindex = 0;
	public Point getStartPos(){
		if(posindex >= startposses.size()){
			posindex = 0;
		}
		Point p = startposses.get(posindex);
		posindex++;
		return p;
	}
	public String findStartDirection(int yy, int xx){
	
		if(xx+1 < brett[yy].length && brett[yy][xx+1] == Co.PATHC){
			return "r";
		}
		else if(xx-1 >= 0 && brett[yy][xx-1] == Co.PATHC){
			return "l";
		}
		else if(yy-1 >= 0 && brett[yy-1][xx] == Co.PATHC){
			return "u";
		}
		else if(yy+1 < brett.length && brett[yy+1][xx] == Co.PATHC){
			return "d";
		}
		return "";
	}
	private void findstartposses(){
		for (int i = 0; i < brett.length; i++) {
			for (int j = 0; j < brett[i].length; j++) {
				if(brett[i][j] == Co.SPAWNC){
					startposses.add(new Point(j, i));
				}
			}
		}
	}
	
	
}//END
