package knapper;

import source.Board;
import towers.Tower;

public class UpgradeKnapp extends Knapp {
	
	public UpgradeKnapp(Board gui, int xs, int ys) {
		super(gui.getBilder().getUpgradepic(), gui, xs, ys);
	}
	
	@Override
	public void clicked() {
		Tower t = gui.getSelectedTower();
		if((t.getLevel() < t.getMaxLevel()) && gui.getKonto().checkAmount(t.getUpgradePrice())){
			gui.getKonto().withdraw(t.getUpgradePrice());
			gui.getLyder().getBuildlyd().play();
			t.upgrade();
		}
	}
}//END
