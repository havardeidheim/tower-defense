package source;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.util.ArrayList;

public class LevelsReader {

	private ArrayList<char[][]> levels;
	private ArrayList<String[]> waves;
	private InputStream levelstream;
	private InputStream wavestream;
	private InputStreamReader lvlisr;
	private InputStreamReader wavisr;
	private BufferedReader lvlleser;
	private BufferedReader wavleser;
	
	public LevelsReader() {
		levels = new  ArrayList<char[][]>();
		waves = new ArrayList<String[]>();
		
		levelstream = getClass().getResourceAsStream(Co.LEVELSPATH); 
		wavestream = getClass().getResourceAsStream(Co.WAVESPATH); 
		lvlisr = new InputStreamReader(levelstream);
		wavisr = new InputStreamReader(wavestream);
		lvlleser = new BufferedReader(lvlisr);
		wavleser = new BufferedReader(wavisr);
		
		try {
			readlevels();
			readWaves();
		} catch (IOException e) {
			System.out.println("OMG NOE ER GALT MED LEVELS/WAVES!");
			e.printStackTrace();
		}
	}
	public Level getLevelAt(int in){
		
		
		
		if(in > (levels.size()-1))
			return null;
		
		char[][] returncopy = new char[levels.get(in).length][levels.get(in)[0].length];
		for(int i = 0; i < levels.get(in).length; i++){
			for(int k = 0; k < levels.get(in)[0].length; k++){
				returncopy[i][k] = levels.get(in)[i][k];
			}
		}
		
		return new Level(returncopy, waves.get(in));
	}
	public int getLevelCount(){
		return levels.size();
	}
	private void readWaves() throws IOException{
		ArrayList<String> tempwaves = new ArrayList<String>(); 
		String[] addwaves;
		
		String temp = "";
		
		while(temp != null){
			temp = wavleser.readLine();
			if(temp == null || temp.equals("")){
				
				addwaves = new String[tempwaves.size()];
				for(int i = 0; i < tempwaves.size(); i++ ){
					addwaves[i] = tempwaves.get(i);
				}
				waves.add(addwaves);
				tempwaves = new ArrayList<String>(); 
			}else{
				tempwaves.add(temp);
			}
		}
		
	}
	
	private void readlevels() throws IOException{
		ArrayList<String> templevel = new ArrayList<String>(); 
		char[][] addlevel;
		String temp = "";
		
		while(temp != null){
			temp = lvlleser.readLine();
			if(temp == null || temp.equals("")){
				
				addlevel = new char[templevel.size()][];
				for(int i = 0; i < addlevel.length; i++ ){
					addlevel[i] = templevel.get(i).toCharArray();
				}
				levels.add(addlevel);
				templevel = new ArrayList<String>(); 
			}else{
				templevel.add(temp);
			}
		}
	}
}//END
	
