package projectiles;

import source.Board;
import towers.Tower;
import enemies.Enemy;
import enemies.ShieldEnemy;
import enemies.SuperEnemy;

public class NormalProjectile extends Projectile {
	
	Tower to;
	
	public NormalProjectile(Board br, Tower t, Enemy e, int dmg) {
		super(br.getBilder().getNormalprojectileimage(), br, t, e, dmg);
		to = t;
	}

	
	protected void hitTest(){
		xdist = (target.getX() + (target.getWidth()/2)) - (x + (getWidth()/2)); 
		ydist = (target.getY() + (target.getHeight()/2)) - (y + (getHeight()/2)); 
		
		int hypdist = (int)Math.sqrt(Math.pow(xdist, 2) + Math.pow(ydist, 2));
		
		if(hypdist < ((getWidth()/2) + (target.getWidth()/2))){
			target.takedamge(damage);
			if(target instanceof ShieldEnemy || target instanceof SuperEnemy){
				tower.damagedone += (damage-10);
			}else{
				tower.damagedone += damage;
			}
			die();
		}
	}
	
	@Override
	public void setStats() {
		speed = 6;
	}

}
