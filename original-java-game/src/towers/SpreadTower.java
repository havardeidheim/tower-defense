package towers;

import java.util.ArrayList;
import java.util.LinkedList;

import projectiles.SpreadProjectile;
import source.Board;
import source.Co;
import enemies.Enemy;

public class SpreadTower extends Tower {

	double maxtargets;
	private boolean bounce = false;
	
	private ArrayList<Enemy> targets = new ArrayList<Enemy>();
	
	public SpreadTower(Board br, int xs, int ys) {
		super(br.getBilder().getTowerpic().get(Co.SPREADTYPE), br, xs, ys);
		skytelyd = gui.getLyder().getSpreadLyd();
		
		for (int i = 0; i < (int)maxtargets; i++) {
			targets.add(null);
		}
	}
	@Override
	public void setStats() {
		range = 140;
		maxtargets = 2;
		speed = 1.5;
		damage = 16;
		name = "Tower of Scatterflames";
		desription = "Fires " + (int)maxtargets + " fireballs";
	}
	@Override
	public void upgrade() {
		maxtargets += 1;
		targets.clear();
		damage += 2;
		level++;
		if(level == maxlevel){
			maxtargets = 4;
			damage -= 2;
			bounce = true;
		}else if(level == maxlevel-1){
			damage += 2;
		}
		desription = "Fires " + (int)maxtargets + " fireballs";
		for (int i = 0; i < (int)maxtargets; i++) {
			targets.add(null);
		}
	}

	public void loop(){
		for (int i = 0; i < targets.size(); i++){
			targets.set(i, null);
		}
		
		scan();
		if(ready){
			fire();
		}
	}
	protected void fire(){
		if(targets.get(0) != null){
			fireProjectile();
			ready = false;
			timer.restart();
		}
	}
	
	@SuppressWarnings("unchecked")
	public void scan(){
		LinkedList<Enemy> fiender = (LinkedList<Enemy>)gui.getEnemies().clone();
		
		for (int i = 0; i < (int)maxtargets; i++) {
			int higheststeps = 0;
			for (Enemy e : fiender) {
				if(sjekkrange(e) && e.getSkritt() > higheststeps && !targets.contains(e)){
					targets.set(i, e);
					higheststeps = e.getSkritt();
				}
			}
		}
	}
	@Override
	protected void fireProjectile() {
		skytelyd.play();
		for (int i = 0; i < targets.size(); i++){
			if(targets.get(i) == null || targets.get(i).isDead() || !sjekkrange(targets.get(i))){
				targets.set(i, null);
			}else{
				if(targets.get(i) != null){
					gui.addProjectile(new SpreadProjectile(gui, this, targets.get(i), (int)damage, bounce));
				}
			}
		}
	}
	@Override
	public String toString(){
		return Co.SPREADTYPE;
	}
}//END
