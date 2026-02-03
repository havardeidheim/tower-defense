package spells;

import source.Board;
import source.Co;
import source.TDObject;


public class PlaceRunestone extends TDObject {

	public PlaceRunestone(Board gui, int xs, int ys) {
		super(gui.getBilder().getBlanctowerpic(), gui, xs, ys);
	}
	
	public void cast(int i, int j){
		char[][] arr = gui.getLevel().getLevel();
		if(arr[i][j] == Co.OBSTACLEC){
			arr[i][j] = Co.GROUNDC;
		}
	}
	@Override
	public void loop() {
		// TODO Auto-generated method stub
	}
	public String toString(){
		return Co.RUNESTONETYPE;
	}
	
}//END
