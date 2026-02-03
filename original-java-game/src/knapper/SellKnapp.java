package knapper;

import source.Account;
import source.Board;
import towers.Tower;

public class SellKnapp extends Knapp{

	public SellKnapp(Board gui, int xs, int ys) {
		super(gui.getBilder().getSellpic(), gui, xs, ys);
	}
	
	@Override
	public void clicked() {
		Tower t = gui.getSelectedTower();
		Account ac = gui.getKonto();
		gui.getKonto().deposit(ac.pricefor(t.toString())/2 + t.getLevel()*10);
		gui.getLyder().getSelllyd().play();
		gui.removeTower(t);
	}
}//END
