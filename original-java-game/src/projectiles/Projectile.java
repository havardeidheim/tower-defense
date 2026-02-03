package projectiles;

import java.awt.image.BufferedImage;

import enemies.Enemy;
import enemies.ShieldEnemy;
import enemies.SuperEnemy;

import source.Board;
import source.Pic;
import source.TDObject;
import towers.Tower;

public abstract class Projectile extends TDObject {

	protected Enemy target;
	protected Tower tower;
	
	protected double xdist;
	protected double ydist;
	protected double xspeed;
	protected double yspeed;
	
	protected double speed;
	
	protected int damage;
	
	protected Pic bilder;
	
	public Projectile(BufferedImage b, Board br, Tower t, Enemy e, int dmg) {
		super(b, br, t.getX() + t.getWidth()/2, t.getY() + t.getHeight()/2);
		target = e;
		tower = t;
		damage = dmg;
		setStats();
	}
	public abstract void setStats();
	@Override
	public void loop() {
		if(!validtarget()){
			die();
			return;
		}
		heatSeek();
		x += xspeed;
		y += yspeed;
		hitTest();
	}
	
	protected void heatSeek(){
		//avstanden mellom target og prosjektil
		xdist = (target.getX() + (target.getWidth()/2)) - (x + (getWidth()/2)); 
		ydist = (target.getY() + (target.getHeight()/2)) - (y + (getHeight()/2)); 
		
		//radiander
		double radianer = Math.atan2(ydist, xdist);

		//fart i x og y
		xspeed = speed * Math.cos(radianer);
    	yspeed = speed * Math.sin(radianer);
	}
	
	protected boolean validtarget(){
		if(target == null || target.isDead()){
			tower.lostShot();
			return false;
		}
		return true;
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
	protected void die(){
		target = null;
		gui.removeProjectile(this);
	}
}//END
