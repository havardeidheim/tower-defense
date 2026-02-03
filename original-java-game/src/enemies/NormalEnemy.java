package enemies;

import source.Board;

public class NormalEnemy extends Enemy {
	
	public NormalEnemy(Board gui, int xs, int ys, int nivå) {
		super(gui.getBilder().getPeasant(), gui, xs, ys, gui.getLevel(), nivå);
	}

	@Override
	protected void setStats() {
		maxhealth = 100 + 100 * healthlevel;
		maxspeed = 1.2;
		damage = 1;
	}
}//END
