package towers;

import java.util.LinkedList;

import source.AreaShot;
import source.Board;
import source.Co;
import enemies.Enemy;

public class AreaTower extends Tower {

	private double slowAmount = 0.30;
	
	public AreaTower(Board gui, int xs, int ys) {
		super(gui.getBilder().getTowerpic().get(Co.AREATYPE), gui, xs, ys);
		desription = "Slow: " + slowAmount*100 + "%" ;
		skytelyd = gui.getLyder().getAreaLyd();
	}
	@Override
	public void upgrade() {
		damage += 6;
		slowAmount += 0.05;
		level++;
		if(level == maxlevel){
			range += 20;
			slowAmount = 0.5;
		}
		desription = "Slow: " + slowAmount*100 + "%" ;
	}
	@Override
	public void setStats() {
		range = 80;
		speed = 2.0;
		damage = 20;
		name = "Tower of Frostshock";
	}
	public void loop() {
		if(target == null || target.isDead() || !sjekkrange(target)){
			scan();
		}else if(ready){
			fire();
		}
	}
	
	@Override
	@SuppressWarnings("unchecked")
	protected void fireProjectile() {
		skytelyd.play();
		
		gui.addAreaShot(new AreaShot(gui, (int)x + getWidth()/2, (int)y + getHeight()/2, this));
		
		LinkedList<Enemy> fiender = (LinkedList<Enemy>)gui.getEnemies().clone();
		for (Enemy e : fiender) {
			if(sjekkrange(e)){
				e.slow(slowAmount, (int)damage);
				damagedone += (int)damage;
			}
		}
	}
	@Override
	public String toString(){
		return Co.AREATYPE;
	}
}//END
