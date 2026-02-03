package projectiles;

import source.Board;
import towers.Tower;
import enemies.Enemy;
import enemies.ShieldEnemy;
import enemies.SuperEnemy;

public class PoisonProjectile extends Projectile {

	public PoisonProjectile(Board gui, Tower t, Enemy e, int dmg) {
		super(gui.getBilder().getPoisonprojectileimage(), gui, t, e, dmg);
	}

	@Override
	public void setStats() {
		speed = 6;
	}
	
	protected void hitTest(){
		xdist = (target.getX() + (target.getWidth()/2)) - (x + (getWidth()/2)); 
		ydist = (target.getY() + (target.getHeight()/2)) - (y + (getHeight()/2)); 
		
		int hypdist = (int)Math.sqrt(Math.pow(xdist, 2) + Math.pow(ydist, 2));
		
		if(hypdist < ((getWidth()/2) + (target.getWidth()/2))){
			target.poison(damage);
			if(target instanceof ShieldEnemy || target instanceof SuperEnemy){
				tower.damagedone += damage*20/2;
			}else{
				tower.damagedone += damage*20;
			}
			die();
		}
	}

}
