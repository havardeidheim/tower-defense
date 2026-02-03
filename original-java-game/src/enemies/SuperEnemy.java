package enemies;

import java.util.Random;

import source.Board;

public class SuperEnemy extends Enemy {

	private double shield;
	Random rg = new Random();
	
	public SuperEnemy(Board gui, int xs, int ys, int nivå) {
		super(gui.getBilder().getParagon(), gui, xs, ys, gui.getLevel(), nivå);
	}

	@Override
	protected void setStats() {
		maxhealth = 70 + 70 * healthlevel;
		maxspeed = 1.4;
		damage = 1;
		
		shield = 10;
	}
	
	public void takedamge(int dmg){
		if(rg.nextDouble() > 0.5){
			if((dmg - (int)shield) < 0){
				//nothing
			}else{
				health -= (dmg - (int)shield);
			}
			if(isDead()){
				die();
			}
		}
	}
	public void poison(int ticks) {
		if(rg.nextDouble() > 0.5){
			super.poison(ticks);
		}
	}
	public void takePoisonDamge(int dmg){
		if((dmg - (int)shield) < 0){
			//nothing
		}else{
			health -= (dmg - (int)shield);
		}
		if(isDead()){
			die();
		}
	}
	public void slow(double amount, int dmg) {
		if(rg.nextDouble() > 0.5){
			if((dmg - (int)shield) < 0){
				//nothing
			}else{
				health -= (dmg - (int)shield);
			}
			if(isDead()){
				die();
			}
		}
	}
}//END
