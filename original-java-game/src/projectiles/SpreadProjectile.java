package projectiles;

import java.util.LinkedList;

import source.Board;
import towers.Tower;
import enemies.Enemy;

public class SpreadProjectile extends Projectile {

	private int range;
	private boolean bounced = true;
	private boolean hasbounced = false;
	Enemy usedtarget;
	
	
	public SpreadProjectile(Board br, Tower t, Enemy e, int dmg, boolean canbounce) {
		super(br.getBilder().getSpreadprojectileimage(), br, t, e, dmg);
		if(canbounce == true){
			bounced = false;
		}
	}

	@Override
	public void setStats() {
		speed = 3;
		range = 80;
	}
	
	public boolean validtarget(){
		if(target == null || target.isDead()){
			target = null;
			return false;
		}
		return true;
	}
	
	public void loop(){
		if(!validtarget()){
			scan();
			if(target == null){
				die();
				return;
			}
		}
		
		heatSeek();
		x += xspeed;
		y += yspeed;
		hitTest();
	}
	protected void hitTest(){
		xdist = (target.getX() + (target.getWidth()/2)) - (x + (getWidth()/2)); 
		ydist = (target.getY() + (target.getHeight()/2)) - (y + (getHeight()/2)); 
		
		int hypdist = (int)Math.sqrt(Math.pow(xdist, 2) + Math.pow(ydist, 2));
		
		if(hypdist < ((getWidth()/2) + (target.getWidth()/2))){
			target.takedamge(damage);
			tower.damagedone += damage;
			if(bounced){
				die();
			}else{
				bounced = true;
				hasbounced = true;
				usedtarget = target;
				target = null;
			}
		}
	}
	
	@SuppressWarnings("unchecked")
	private void scan() {
		LinkedList<Enemy> fiender = (LinkedList<Enemy>) gui.getEnemies().clone();
		if(hasbounced){
			fiender.remove(usedtarget);
		}
		int higheststeps = 0;
		for (Enemy e : fiender) {
			if(sjekkrange(e) && e.getSkritt() > higheststeps){
				higheststeps = e.getSkritt();
				target = e;
			}
		}
	}
	private boolean sjekkrange(Enemy e){
		double xdist = (e.getX() + (e.getWidth()/2)) - (x + (getWidth()/2)); 
		double ydist = (e.getY() + (e.getWidth()/2)) - (y + (getWidth()/2)); 
			
		int hypdist = (int)Math.sqrt(Math.pow(xdist, 2) + Math.pow(ydist, 2));
		if(hypdist > range){
			return false;
		}else{
			return true;
		}
	}
	
}
