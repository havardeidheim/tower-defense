package towers;

import java.applet.AudioClip;
import java.awt.event.ActionEvent;
import java.awt.event.ActionListener;
import java.awt.image.BufferedImage;
import java.util.ArrayList;
import java.util.LinkedList;

import javax.swing.Timer;

import source.Board;
import source.Lyder;
import source.TDObject;
import enemies.Enemy;

public abstract class Tower extends TDObject{

	protected Enemy target;
	protected double speed;
	protected int damage;
	protected int range;
	protected AudioClip skytelyd;
	protected Timer timer;
	protected ActionListener timeraction;
	
	protected int level = 0;
	
	protected boolean ready = true;
	private boolean mouseover = false;
	
	protected String desription;
	protected String name;
	
	protected int maxlevel = 3;
	
	protected int[] prices;
	public int damagedone = 0;
	
	public Tower(BufferedImage b, Board br, int xs, int ys) {
		super(b, br, xs, ys);
		setStats();	
		
		prices = new int[]{40, 80, 120};
		
		timeraction = new ActionListener() {
			public void actionPerformed(ActionEvent evt) {
				ready = true;
			}
		};
		timer =  new Timer((int)(1000*speed), timeraction);
		timer.start();
	}
	
	public abstract void upgrade();
	public abstract void setStats();
	public abstract String toString();
	
	public void clicked(){
		Lyder.selectlyd.play();
		gui.setSelectedTower(this);
	}
	public int getMaxLevel(){
		return maxlevel;
	}
	public int getUpgradePrice(){
		if(level < maxlevel){
			return prices[level];
		}else {
			return 0;
		}
	}
	
	@SuppressWarnings("unchecked")
	protected void scan(){
		LinkedList<Enemy> fiender = (LinkedList<Enemy>)gui.getEnemies().clone();
		int higheststeps = 0;
		for (Enemy e : fiender) {
			if(sjekkrange(e) && e.getSkritt() > higheststeps){
				higheststeps = e.getSkritt();
				target = e;
			}
		}
	}
	
	protected abstract void fireProjectile();
	public ArrayList<String> getStatsAsString(){
		
		ArrayList<String> descr = new ArrayList<String>();
		descr.add(name);
		descr.add("");
		descr.add("");
		descr.add("");
		descr.add("Level: " + (level+1));
		if(this instanceof PoisonTower){
			descr.add("Damage: " + damage + " * 18");
		}else{
			descr.add("Damage: " + damage);
		}
		descr.add("Range: " + range);
		descr.add("Speed: " + speed);
		if(desription != null){
			descr.add("" + desription);
		}
		return descr;
	}
	
	protected void fire(){
		if (target != null){
			if(target.isDead()){
				target = null;
			}else if(sjekkrange(target)){
				 fireProjectile();
				 ready = false;
				 timer.restart();
				 timer.start();
			}
		}
	}
	public void lostShot(){
		ready = true;
	}
	public int getRange(){
		return range;
	}
	public int getLevel(){
		return level;
	}
	protected boolean sjekkrange(Enemy e){
		double xdist = (e.getX() + (e.getWidth()/2)) - (x + (getWidth()/2)); 
		double ydist = (e.getY() + (e.getWidth()/2)) - (y + (getWidth()/2)); 
			
		int hypdist = (int)Math.sqrt(Math.pow(xdist, 2) + Math.pow(ydist, 2));
		if(hypdist > range){
			return false;
		}else{
			return true;
		}
	}
	public void loop() {
		scan();
		if(ready){
			fire();
			target = null;
		}
	}
	
	public int getDamageDone(){
		return damagedone;
	}
	protected boolean fast = false;
	public void speedchanged(String arg){
		if(arg.equals("slower")){
			timer.setInitialDelay((int)(1000*speed));
			fast = false;
		}else if(arg.equals("faster")){
			timer.setInitialDelay((int)((1000*speed) /2));
			fast = true;
		}
	}
	
	public boolean hasMouseOver(){
		return mouseover;
	}
	public void mouseOn() {
		mouseover = true;
	}
	public void mouseOff() {
		mouseover = false;
	}

}//END
