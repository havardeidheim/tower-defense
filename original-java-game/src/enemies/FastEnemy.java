package enemies;

import source.Board;

public class FastEnemy extends Enemy {

	public FastEnemy(Board gui, int xs, int ys, int nivå) {
		super(gui.getBilder().getScout(), gui, xs, ys, gui.getLevel(), nivå);
	}

	@Override
	protected void setStats() {
		maxhealth = 100 + 100 * healthlevel;
		maxspeed = 1.7;
		damage = 1;
	}

}//END
