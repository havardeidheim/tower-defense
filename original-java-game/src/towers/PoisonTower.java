package towers;

import java.util.LinkedList;

import projectiles.PoisonProjectile;
import source.Board;
import source.Co;
import enemies.Enemy;

public class PoisonTower extends Tower {

	public PoisonTower(Board br, int xs, int ys) {
		super(br.getBilder().getTowerpic().get(Co.POISONTYPE), br, xs, ys);
		skytelyd = gui.getLyder().getPoisonLyd();
	}

	@Override
	public void upgrade() {
		level++;
		damage += 1;
		if(level == getMaxLevel()){
			damage += 1;
		}
	}

	@Override
	public void setStats() {
		range = 120;
		speed = 1.2;
		damage = 2;
		name = "Tower of Poisoning";
	}
	
	@SuppressWarnings("unchecked")
	protected void scan(){
		LinkedList<Enemy> fiender = (LinkedList<Enemy>)gui.getEnemies().clone();
		
		int leastPoison = 100;
		int higheststeps = 0;
		for (Enemy e : fiender) {
			if(sjekkrange(e)){
				if(e.getPoisonCounters() == leastPoison){
					if(e.getSkritt() > higheststeps){
						target = e;
						leastPoison = target.getPoisonCounters();
						higheststeps = target.getSkritt();
					}
				}else if(e.getPoisonCounters() < leastPoison){
					target = e;
					leastPoison = target.getPoisonCounters();
				}
			}
		}
	}
	
	@Override
	protected void fireProjectile() {
		skytelyd.play();
		gui.addProjectile(new PoisonProjectile(gui, this, target, (int)damage));
		target = null;
	}
	@Override
	public String toString(){
		return Co.POISONTYPE;
	}
}//END
