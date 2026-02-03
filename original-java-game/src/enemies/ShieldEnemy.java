package enemies;

import source.Board;

public class ShieldEnemy extends Enemy{

	private double shield;
	
	public ShieldEnemy(Board gui, int xs, int ys, int nivå) {
		super(gui.getBilder().getSolider(), gui, xs, ys, gui.getLevel(), nivå);
	}

	@Override
	protected void setStats() {
		maxhealth = 130 + 130 * healthlevel;
		maxspeed = 1.2;
		damage = 1;
		
		shield = 10;
	}
	public void takedamge(int dmg){
		if((dmg - (int)shield) < 0){
			//nothing
		}else{
			health -= (dmg - shield);
		}
		if(isDead()){
			die();
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
	@Override
	public void slow(double amount, int dmg) {
		if((dmg - (int)shield) < 0){
			//nothing
		}else{
			health -= (dmg - (int)shield);
		}
		
		if(maxspeed - (maxspeed*amount) < speed){
			speed = maxspeed - (maxspeed*amount);
		}
		if(isDead()){
			die();
		}
		slowtimer.restart();
	}
	
}//end
