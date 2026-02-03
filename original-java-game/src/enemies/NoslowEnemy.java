package enemies;

import source.Board;

public class NoslowEnemy extends Enemy {

	int blocks = 3;
	
	public NoslowEnemy(Board gui, int xs, int ys, int nivå) {
		super(gui.getBilder().getVanguard(), gui, xs, ys, gui.getLevel(), nivå);
	}
	
	@Override
	protected void setStats() { 
		maxhealth = 120 + 100 * healthlevel;
		maxspeed = 1.6;
		damage = 1;
	}
	public void slow(double amount, int dmg) {
		//haha cantslow
		if(blocks > 0){
			blocks--;
		}else{
			health -= dmg;
			if(isDead()){
				die();
			}
		}
	}
	public void takedamge(int dmg){
		if(blocks > 0){
			blocks--;
		}else{
			super.takedamge(dmg);
		}
	}
	public void poison(int ticks){
		if(blocks > 0){
			blocks--;
		}else{
			super.poison(ticks);
		}
	}

}//END
