package enemies;

import java.util.Random;

import source.Board;

public class DodgeEnemy extends Enemy {

	Random rg = new Random();
	
	public DodgeEnemy(Board gui, int xs, int ys, int nivå) {
		super(gui.getBilder().getAssassin(), gui, xs, ys, gui.getLevel(), nivå);
	}

	@Override
	protected void setStats(){
		maxhealth = 70 + 70 * healthlevel;
		maxspeed = 1.6;
		damage = 1;
	}
	public void takedamge(int dmg){
		if(rg.nextDouble() > 0.5){
			super.takedamge(dmg);
		}
	}
	@Override
	public void poison(int ticks) {
		if(rg.nextDouble() > 0.5){
			super.poison(ticks);
		}
	}
	public void slow(double amount, int dmg) {
		if(rg.nextDouble() > 0.5){
			super.slow(amount, dmg);
		}
	}

}//END
