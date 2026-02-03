package spells;

import source.Board;
import source.Co;
import source.TDObject;
import enemies.Enemy;

public class Lightning extends TDObject {

	public Lightning(Board gui, int xs, int ys) {
		super(gui.getBilder().getLightningpic(), gui, xs, ys);
	}
	
	public void castOn(Enemy e){
		e.spellDamage(1, 200);
	}

	@Override
	public void loop(){
		// TODO Auto-generated method stub
		
	}
	public String toString(){
		return Co.LIGHTNINGTYPE;
	}
}//END
