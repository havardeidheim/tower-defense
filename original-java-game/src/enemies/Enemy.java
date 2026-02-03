package enemies;

import java.awt.event.ActionEvent;
import java.awt.event.ActionListener;
import java.awt.image.BufferedImage;
import java.util.HashMap;

import javax.swing.Timer;

import source.Board;
import source.Co;
import source.Level;
import source.TDObject;

public abstract class Enemy extends TDObject {

	
	protected int health;
	protected int maxhealth;
	protected double maxspeed;
	protected double speed;
	protected int damage;
	protected int healthlevel;
	private double skritt = 0;
	private String direction;
	
	private Level brett;
	private char[][] lvl;
	
	Timer slowtimer;
	ActionListener slowremove;
	HashMap<String, BufferedImage> imgmap;
	
	protected int poisoncounters = 0;
	
	protected boolean poisoned = false;
	
	public Enemy(HashMap<String, BufferedImage> b, Board gui, int xs, int ys, Level brettt, int enemylevel) {
		super(b.get("u"), gui, xs, ys);
		imgmap = b;
		x -= getWidth()/2;
		y -= getHeight()/2;
		
		brett = brettt;
		lvl = brett.getLevel();
		direction = brett.findStartDirection((int)y/Co.IMGSIZE, (int)x/Co.IMGSIZE);
		setImg(b.get(direction));
		healthlevel = enemylevel;
		setStats();
		health = maxhealth;
		speed = maxspeed;
		
		
		ActionListener slowremove = new ActionListener(){
			public void actionPerformed(ActionEvent e) {
				slowtimer.stop();
				speed = maxspeed;
			}
		};
		slowtimer = new Timer(1600, slowremove);
	}
	public void speedchanged(String arg){
		if(arg.equals("slower")){
			slowtimer.setInitialDelay(1600);
		}else if(arg.equals("faster")){
			slowtimer.setDelay(1600/2);
		}
	}
	
	protected abstract void setStats();
	
	public int getPoisonCounters(){
		return poisoncounters;
	}
	
	@Override
	public void loop() {
		if(lvl[(int)(y/Co.IMGSIZE)][(int)(x/Co.IMGSIZE)] == Co.TARGETC){
			destruct();
			return;
		}
		int xx = (int)(x/Co.IMGSIZE);
		int yy = (int)(y/Co.IMGSIZE);
		
		int xxpp = (int) (((x + getWidth()/2) + (Co.IMGSIZE/2)) / Co.IMGSIZE);
		int yypp = (int) (((y + getHeight()/2) + (Co.IMGSIZE/2)) / Co.IMGSIZE);
		
		int xxmm = (int) (((x + getWidth()/2) - (Co.IMGSIZE/2)) / Co.IMGSIZE);
		int yymm = (int) (((y + getHeight()/2) - (Co.IMGSIZE/2)) / Co.IMGSIZE);
		
		if(direction.equals("r")){
			x += speed;
			skritt += speed;
			if(lvl[yy][xxpp] != Co.PATHC && lvl[yy][xxpp] != Co.TARGETC){
				if(lvl[yy+1][xx] == Co.PATHC || lvl[yy+1][xx] == Co.TARGETC){
					direction = "d";
				}
				else if(lvl[yy-1][xx] == Co.PATHC || lvl[yy-1][xx] == Co.TARGETC){
					direction = "u";
				}
			}
		}
		else if(direction.equals("l")){
			x -= speed;
			skritt += speed;
			if(lvl[yy][xxmm] != Co.PATHC && lvl[yy][xxmm] != Co.TARGETC){
				if(lvl[yy+1][xx] == Co.PATHC || lvl[yy+1][xx] == Co.TARGETC){
					direction = "d";
				}
				else if(lvl[yy-1][xx] == Co.PATHC || lvl[yy-1][xx] == Co.TARGETC){
					direction = "u";
				}
			}
		}
		else if(direction.equals("u")){
			y -= speed;
			skritt += speed;
			if(lvl[yymm][xx] != Co.PATHC && lvl[yymm][xx] != Co.TARGETC){
				if(lvl[yy][xx+1] == Co.PATHC || lvl[yy][xx+1] == Co.TARGETC){
					direction = "r";
				}
				else if(lvl[yy][xx-1] == Co.PATHC || lvl[yy][xx-1] == Co.TARGETC){
					direction = "l";
				}
			}
		}
		else if(direction.equals("d")){
			y += speed;
			skritt += speed;
			if(lvl[yypp][xx] != Co.PATHC && lvl[yypp][xx] != Co.TARGETC){
				if(lvl[yy][xx+1] == Co.PATHC || lvl[yy][xx+1] == Co.TARGETC){
					direction = "r";
				}
				else if(lvl[yy][xx-1] == Co.PATHC || lvl[yy][xx-1] == Co.TARGETC){
					direction = "l";
				}
			}
		}
		setImg(imgmap.get(direction));
	}
	
	public void die(){
		gui.getKonto().deposit(10 + (healthlevel*2));
		gui.removeEnemy(this);
	}
	public void destruct(){
		gui.damagePlayer(damage);
		gui.removeEnemy(this);
	}
	public void takedamge(int dmg){
		health -= dmg;
		if(isDead()){
			die();
		}
	}
	public void takePoisonDamge(int dmg){
		health -= dmg;
		if(isDead()){
			die();
		}
	}
	public boolean isDead(){
		if(health <= 0){
			return true;
		}
		return false;
	}
	public int getSkritt() {
		return (int)skritt;
	}
	public int getHealthWidth(){
		return (int)(((double)health/(double)maxhealth)*(double)getWidth());
	}
	public boolean isPoisoned(){
		return poisoned;
	}
	public void poison(int ticks){
		poisoncounters += ticks;
		poisoned = true;
	}
	public void slow(double amount, int dmg) {
		health -= dmg;
		if(maxspeed - (maxspeed*amount) < speed){
			speed = maxspeed - (maxspeed*amount);
		}
		slowtimer.restart();
		if(isDead()){
			die();
		}
	}
	
	public void spellDamage(int s, int d){
		if(maxspeed - (maxspeed*s) < speed){
			speed = maxspeed - (maxspeed*s);
		}
		slowtimer.restart();
		health -= d;
		if(health < 0){
			health = 0;
		}
		if(isDead()){
			die();
			slowtimer.stop();
		}
	}

	public void poisonTick() {
		if(poisoncounters > 0){
			takePoisonDamge(18);
			poisoncounters--;
			if(poisoncounters <= 0){
				poisoned = false;
			}
		}else{
			poisoned = false;
		}
	}

}//END
