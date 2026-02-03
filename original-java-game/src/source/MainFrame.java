package source;

import java.awt.Dimension;
import java.awt.Toolkit;
import java.io.FileReader;
import java.io.FileWriter;
import java.io.IOException;

import javax.swing.JFrame;
import javax.swing.JOptionPane;

@SuppressWarnings("serial")
public class MainFrame extends JFrame{

	Board board;
	TDMenu menu;
	
	boolean[] levelacces;
	int[] levelstars;
	
	LevelsReader levelleser;
	
	int Swidth = 854;
	int Sheigth = 506;
	
	int lastlevel = 0;
	
	public MainFrame() {
		levelleser = new LevelsReader();
		
		levelacces = new boolean[levelleser.getLevelCount()];
		levelstars = new int[levelleser.getLevelCount()];
		levelacces[0] = true;
		
		try {
			FileReader fr = new FileReader("data.txt");
			char c = ' ';
			for(int i = 0; i < levelacces.length; i++){
				c = (char) fr.read();
				if(c == 't'){
					levelacces[i] = true;
				}
				
			}
			for(int i = 0; i < levelstars.length; i++){
				c = (char) fr.read();
				if(Character.isDigit(c)){
					levelstars[i] = Integer.parseInt(""+c);
				}
			}
			fr.close();
			
		} catch (Exception e) {
			try {
				FileWriter fw = new FileWriter("data.txt");
				levelacces[0] = true;
				for(int i = 0; i < levelacces.length; i++){
					if(levelacces[i] == true){
						fw.write('t');
					}else{
						fw.write('f');
					}
				}
				for(int i = 0; i < levelstars.length; i++){
					fw.write(""+levelstars[i]);
				}
				fw.close();
			} catch (IOException e1) {
				e1.printStackTrace();
			}
		} 
		
		Dimension scsize = Toolkit.getDefaultToolkit().getScreenSize();
        setDefaultCloseOperation(EXIT_ON_CLOSE);
        setSize(Swidth, Sheigth);
        setTitle("Road Defender: Revenge of the Road");
        setLocation(scsize.width/2 - Swidth/2, scsize.height/2 - Sheigth/2);
        setResizable(false);
        setVisible(true);
        
        showmenu(levelstars[lastlevel]);
	}
	public int[] getlevelstars(){
		return levelstars;
	}
	public boolean[] getlevelacces(){
		return levelacces;
	}
	public void showmenu(int s){
		menu = new TDMenu(this, levelleser);
		if(board != null){
			getContentPane().remove(board);
			board = null;
		}
		if(s > 0 && lastlevel != 3){
			levelacces[lastlevel+1] = true;
		}
		if(s > levelstars[lastlevel]){
			levelstars[lastlevel] = s;
		}
		try {
			save();
		} catch (IOException e) {
			JOptionPane.showConfirmDialog(this, "Could not save :(");
		}
		add(menu);
		setVisible(true);
	}
	private void save() throws IOException{
		FileWriter fw = new FileWriter("data.txt");
		for(int i = 0; i < levelacces.length; i++){
			if(levelacces[i] == true){
				fw.write('t');
			}else{
				fw.write('f');
			}
		}
		for(int i = 0; i < levelstars.length; i++){
			fw.write(""+levelstars[i]);
		}
		fw.close();
	}
	public void newgame(int lvlnr){
		board = new Board(levelleser, lvlnr, this);
		if(menu != null){
			getContentPane().remove(menu);
			menu = null;
		}
		lastlevel = lvlnr;
		add(board);
		setVisible(true);
	}
	
	public static void main(String[] args) {
		new MainFrame();
	}
}//END
