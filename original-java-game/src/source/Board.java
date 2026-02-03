package source;

import java.awt.Color;
import java.awt.Font;
import java.awt.Graphics;
import java.awt.Graphics2D;
import java.awt.Point;
import java.awt.Rectangle;
import java.awt.RenderingHints;
import java.awt.event.ActionEvent;
import java.awt.event.ActionListener;
import java.awt.event.MouseEvent;
import java.awt.event.MouseListener;
import java.util.HashMap;
import java.util.LinkedList;
import java.util.Timer;
import java.util.TimerTask;

import javax.swing.JPanel;

import knapper.*;
import projectiles.Projectile;
import spells.*;
import towers.Tower;
import enemies.*;

@SuppressWarnings("serial")
public class Board extends JPanel implements MouseListener{

	private Pic bilder;
	private Audio lyder;
	private Account konto;
	private Account mana;
	
	private MainFrame mainframe;
	private Level level;
	private LevelsReader levelleser;
	private int lvlnr;
	
	private Timer timer;
	private javax.swing.Timer enemyTimer;
	private javax.swing.Timer poisonTimer;
	private javax.swing.Timer avslutttimer;
	
	private ActionListener avsluttaction;
	private TimerTask timerAction;
	private ActionListener enemyTimerAction;
	private ActionListener poisonTimerAction;
	
	private LinkedList<Knapp> knapper = new LinkedList<Knapp>();
	private LinkedList<SimpleKnapp> knapper2 = new LinkedList<SimpleKnapp>();
	
	private LinkedList<Enemy> fiender  = new LinkedList<Enemy>();
	private LinkedList<Tower> taarn = new LinkedList<Tower>();
	private LinkedList<Projectile> prosjektiler = new LinkedList<Projectile>();
	private LinkedList<AreaShot> areaskudd  = new LinkedList<AreaShot>();
	
	private LinkedList<AreaShot> areaskuddbin  = new LinkedList<AreaShot>();
	private LinkedList<Enemy> fienderbin = new LinkedList<Enemy>();
	private LinkedList<Tower> taarnbin = new LinkedList<Tower>();
	private LinkedList<Projectile> prosjektilerbin = new LinkedList<Projectile>();
	
	private int wavenumber = -1;
	private int enemynumber = 0;

	private boolean placingtower = false;
	private boolean castingspell = false;
	private boolean helpscreenon = false;
	
	private Tower placethis = null;
	private TDObject castingthis = null;
	
	private Tower selectedTower = null;
	private Knapp upgradeKnapp;
	private SellKnapp sellKnapp;
	
	private SimpleKnapp speedupknapp;
	private SimpleKnapp startknapp;
	private SimpleKnapp resetknapp;
	private SimpleKnapp pauseknapp;
	private SimpleKnapp resumeknapp;
	private SimpleKnapp mainmenuknapp;
	private SimpleKnapp helpknapp;
	
	private int health = 5;
	
	private boolean paused = false;
	private boolean started = false;
	private boolean fast = false;
	
	private TDHelp helpscreen;
	
	public Board(LevelsReader l, int lvlrnr, MainFrame mf) {
		addMouseListener(this);
		levelleser = l;
		lvlnr = lvlrnr;
		level = l.getLevelAt(lvlrnr);
		mainframe = mf;
		bilder = new Pic();
		lyder = new Audio();
		setBackground(new Color(0x666444));
		
		enemyTimerAction = new ActionListener() {
			public void actionPerformed(ActionEvent e) {
				String wave = level.getWaves()[wavenumber];
				if(enemynumber < wave.length()){
					int nivåttt = 0;
					if(Character.isDigit(wave.charAt(enemynumber))){
						nivåttt = Integer.parseInt(""+wave.charAt(enemynumber));
						enemynumber++;
					}
					addEnemy(wave.charAt(enemynumber), nivåttt);
					enemynumber++;
				}else if(fiender.isEmpty()){
					wavenumber++;
					enemynumber = 0;
				}
			}
		};
		avsluttaction = new ActionListener() {
			public void actionPerformed(ActionEvent e){
				avslutttimer.stop();
				timer.cancel();
				enemyTimer.stop();
				poisonTimer.stop();
				timer = null;
				enemyTimer = null;
				poisonTimer = null;
				mainframe.showmenu(health);
				return;
			}
		};
		poisonTimerAction = new ActionListener(){
			public void actionPerformed(ActionEvent e) {
				poisonloop();
			}
		};
		timerAction = new TimerTask(){
			public void run(){
				if(!paused){
					loop();
					if(fast == true && !(wavenumber >= level.getWaves().length || health <= 0)){
						loop();
					}
				}
				repaint();
			}
		};
		
		timer = new Timer();
		timer.scheduleAtFixedRate(timerAction, 20, 20);
		enemyTimer = new javax.swing.Timer(1000, enemyTimerAction);
		poisonTimer = new javax.swing.Timer(700, poisonTimerAction);
		avslutttimer = new javax.swing.Timer(1000, avsluttaction);
		
		knapper.add(new InfoKnapp(this, 680, 395, Co.NORMALENEMYC));
		knapper.add(new InfoKnapp(this, 750, 395, Co.FASTENEMYC));
		knapper.add(new InfoKnapp(this, 820, 395, Co.SHIELDENEMYC));
		knapper.add(new InfoKnapp(this, 680, 435, Co.DODGEENEMYC));
		knapper.add(new InfoKnapp(this, 750, 435, Co.NOSLOWENEMYC));
		knapper.add(new InfoKnapp(this, 820, 435, Co.SUPERENEMYC));
		
		knapper.add(new AddKnapp(this, 650, 35, Co.NORMALTYPE));
		knapper.add(new AddKnapp(this, 700, 35, Co.AREATYPE));
		knapper.add(new AddKnapp(this, 750, 35, Co.SPREADTYPE));
		knapper.add(new AddKnapp(this, 800, 35, Co.POISONTYPE));
		knapper.add(new AddKnapp(this, 650, 105, Co.LIGHTNINGTYPE));
		knapper.add(new AddKnapp(this, 700, 105, Co.RUNESTONETYPE));
		
		TDAction menuclick = new TDAction() {
			public void clicked(){
				pause();
				timer.cancel();
				enemyTimer.stop();
				poisonTimer.stop();
				health = 0;
				mainframe.showmenu(0);
			}
		};
		TDAction fastclick = new TDAction() {
			public void clicked(){speedup();}
		};
		TDAction startclick = new TDAction() {
			public void clicked(){start();}
		};
		TDAction resetclick = new TDAction() {
			public void clicked(){reset();}
		};
		TDAction pauseclick = new TDAction() {
			public void clicked(){pause();}
		};
		TDAction resumeclick = new TDAction() {
			public void clicked(){resume();}
		};
		TDAction helpclick = new TDAction() {
			public void clicked(){showhelpscreen();}
		};
		
		mainmenuknapp = new SimpleKnapp(48, 10, "Menu", menuclick);
		helpknapp = new SimpleKnapp(166, 10, "Help", helpclick);
		startknapp = new SimpleKnapp(284, 10, "Start", startclick);
		resetknapp = new SimpleKnapp(284, 10, "Reset", resetclick);
		pauseknapp = new SimpleKnapp(402, 10, "Pause", pauseclick);
		resumeknapp = new SimpleKnapp(402, 10, "Resume", resumeclick);
		speedupknapp = new SimpleKnapp(520, 10, "Faster", fastclick);
		
		knapper2.add(speedupknapp);
		knapper2.add(pauseknapp);
		knapper2.add(mainmenuknapp);
		knapper2.add(startknapp);
		knapper2.add(helpknapp);
		if(lvlnr == 0){
			showhelpscreen();
		}
		
		upgradeKnapp = new UpgradeKnapp(this, 800, 155);
		sellKnapp = new SellKnapp(this, 800, 200);
		konto = new Account(180);
		if(lvlnr == 3){
			mana = new ManaAccount(240);
		}else{
			mana = new ManaAccount(60);
		}
		
		boolean tgm = false;
		if(tgm){
			konto = new Account(10000);
			mana = new ManaAccount(10000);
		}
	}
	
	public void start(){
		paused = false;
		started = true;
		wavenumber++;
		lyder.getStartlyd()[lvlnr].play();
		enemyTimer.restart();
		poisonTimer.restart();
		
		knapper2.remove(startknapp);
		knapper2.add(resetknapp);
	}
	public void reset(){
		started = false;
		cleanup();
		level = levelleser.getLevelAt(lvlnr);
		enemyTimer.stop();
		poisonTimer.stop();
		
		fiender  = new LinkedList<Enemy>();
		prosjektiler = new LinkedList<Projectile>();
		areaskudd  = new LinkedList<AreaShot>();
		
		health = 5;
		wavenumber = -1;
		enemynumber = 0;
		
		konto = new Account(180);
		if(lvlnr == 3){
			mana = new ManaAccount(240);
		}else{
			mana = new ManaAccount(60);
		}
		taarn = new LinkedList<Tower>();
		
		knapper2.remove(resetknapp);
		knapper2.add(startknapp);
		
		if(knapper2.contains(resumeknapp)){
			knapper2.remove(resumeknapp);
			knapper2.add(pauseknapp);
			
		}
		
		speedupknapp.setLabel("Faster");
		enemyTimer.setDelay(1000);
		poisonTimer.setDelay(700);
		fast = false;
		for (Enemy e : fiender) {
			e.speedchanged("slower");
		}
		for (Tower t : taarn) {
			t.speedchanged("slower");
		}
		
		cleanup();
		repaint();
	}
	
	@SuppressWarnings("unchecked")
	public void speedup(){
		if(fast){
			speedupknapp.setLabel("Faster");
			enemyTimer.setDelay(1000);
			poisonTimer.setDelay(700);
			fast = false;
			for (Enemy e : fiender) {
				e.speedchanged("slower");
			}
			for (Tower t : taarn) {
				t.speedchanged("slower");
			}
		}else{
			speedupknapp.setLabel("Slower");
			enemyTimer.setDelay(500);
			poisonTimer.setDelay(350);
			fast = true;
			
			LinkedList<Enemy> fienderclone = (LinkedList<Enemy>) fiender.clone();
			for (Enemy e : fienderclone) {
				e.speedchanged("faster");
			}
			for (Tower t : taarn) {
				t.speedchanged("faster");
			}
		}
		repaint();
	}
	
	public void damagePlayer(int dmg){
		health -= dmg;
	}
	
	boolean grantedmana = false;
	@SuppressWarnings("unchecked")
	public void poisonloop(){
		if(!grantedmana){
			mana.deposit(1);
			grantedmana = true;
		}else{
			grantedmana = false;
		}
		
		LinkedList<Enemy> fienderclone =  (LinkedList<Enemy>)fiender.clone();
		for(Enemy e: fienderclone){
			e.poisonTick();
		}
	}
	
	public void pause(){
		if(started){
			enemyTimer.stop();
			poisonTimer.stop();
			paused = true;
			knapper2.remove(pauseknapp);
			knapper2.add(resumeknapp);
			cleanup();
			repaint();
		}
	}
	public void resume(){
		enemyTimer.start();
		poisonTimer.start();
		paused = false;
		knapper2.remove(resumeknapp);
		knapper2.add(pauseknapp);
		cleanup();
		repaint();
	}
	
	@SuppressWarnings("unchecked")
	public void loop(){
		if(wavenumber >= level.getWaves().length || health <= 0){
			if(health >= 4){
				lyder.getVerygood().play();
			}else if(health <= 0){
				lyder.getDielyd().play();
			}else{
				lyder.getOklyd().play();
			}
			timer.cancel();
			enemyTimer.stop();
			poisonTimer.stop();
			pause();
			avslutttimer.start();
		}
		
		cleanup();
		
		LinkedList<Enemy> fienderclone =  (LinkedList<Enemy>)fiender.clone();
		for(Enemy e: fienderclone){
			e.loop();
		}
		LinkedList<Tower> tårnclone =  (LinkedList<Tower>)taarn.clone();
		for(Tower t: tårnclone){
			Point mousepoint = getMousePosition();
			if(mousepoint != null){
				if(t.getBounds().contains(mousepoint)){
					t.mouseOn();
				}else{
					t.mouseOff();
				}
			}
			t.loop();
		}
		LinkedList<Projectile> prosjektilerclone =  (LinkedList<Projectile>)prosjektiler.clone();
		for(Projectile p: prosjektilerclone){
			p.loop();
		}
		LinkedList<AreaShot> areaskuddclone = (LinkedList<AreaShot>)areaskudd.clone();
		for(AreaShot a: areaskuddclone){
			a.loop();
		}
		
		cleanup();
	}
	
	private void cleanup() {
		for(Projectile p: prosjektilerbin){
			prosjektiler.remove(p);
		}
		for(Enemy e: fienderbin){
			fiender.remove(e);
		}
		for(Tower t: taarnbin){
			taarn.remove(t);
		}
		for (AreaShot a : areaskuddbin) {
			areaskudd.remove(a);
		}
	
		prosjektilerbin.clear();
		fienderbin.clear();
		taarnbin.clear();
	}

	@SuppressWarnings("unchecked")
	public void paint(Graphics g1){
		super.paint(g1);
		
		Graphics2D g2 = (Graphics2D)g1;
		g2.setRenderingHint(RenderingHints.KEY_TEXT_ANTIALIASING, RenderingHints.VALUE_TEXT_ANTIALIAS_ON);
		
		g2.drawImage(bilder.getBackgroundpic(), 0, 0, this);
		g2.setFont(new Font("Times New Roman", Font.BOLD , 16));
		
		char[][] drawlevel = level.getLevel();
		
		for (int i = 0; i < drawlevel.length; i++) {
			for (int j = 0; j < drawlevel[i].length; j++) {
				char c = drawlevel[i][j];
				if(c == Co.GROUNDC){
					//g.drawImage(bilder.groundpic, j*Co.IMGSIZE, i*Co.IMGSIZE, this);
				}else if(c == Co.PATHC || c == Co.SPAWNC ||c == Co.TARGETC){
					g2.drawImage(bilder.getPathpic(), j*Co.IMGSIZE, i*Co.IMGSIZE, this);
				}else if(c == Co.OBSTACLEC ){
					//g.drawImage(bilder.groundpic, j*Co.IMGSIZE, i*Co.IMGSIZE, this);
				}
				
				if(c == Co.SPAWNC ){
					g2.drawImage(bilder.getSpawnpic(), j*Co.IMGSIZE, i*Co.IMGSIZE, this);
				}
			}
		}
		
		for(AreaShot a: areaskudd){
			g2.drawImage(a.getImg(), a.getX(), a.getY(), a.getWidth(), a.getHeight(), this);
		}
		
		for (int i = 0; i < drawlevel.length; i++) {
			for (int j = 0; j < drawlevel[i].length; j++) {
				char c = drawlevel[i][j];
				if(c == Co.GROUNDC){
					g2.drawImage(bilder.getBlanctowerpic(), j*Co.IMGSIZE, i*Co.IMGSIZE, this);
				}
			}
		}
		
		g2.setColor(Color.BLACK);
		g2.drawString("Wave#: " + (wavenumber + 1) + "/ " + level.getWaves().length, 645, 382);
		g2.drawString("Next wave:", 760, 382);
		
		g2.drawLine(640, 360, 850, 360);
		
		g2.drawLine(640, 150, 850, 150);
		g2.drawLine(640, 0, 640, 550);
		
		g2.setColor(Color.RED);
		g2.drawString("Health: "+health, 770, 25);
		g2.setColor(Color.ORANGE);
		g2.drawString("Gold: "+konto.getBalance(), 650, 25);
		g2.setColor(Color.BLUE);
		g2.drawString("Mana: "+mana.getBalance(), 650, 95);
		
		
		HashMap<Character, Integer> numenemies = new HashMap<Character, Integer>();
		String nextwave = "";
		if(!((wavenumber+1) >= level.getWaves().length)){
			nextwave = level.getWaves()[wavenumber+1];
		}
		
		for(int i = 0; i < nextwave.length(); i++){
			char ch = nextwave.charAt(i);
			if(numenemies.get(ch) == null){
				numenemies.put(ch, 0);
			}
			numenemies.put(ch, numenemies.get(ch) + 1);
		}
		
		boolean gotoverknapp = false;
		for(Knapp k: knapper){
			g2.drawImage(k.getImg(), k.getX(), k.getY(), this);
			if(k instanceof AddKnapp) {
				AddKnapp ak = (AddKnapp)k;
				if((ak.isSpell()) && ak.getPrice() > mana.getBalance()){
					g2.drawImage(bilder.getCrosspic(), ak.getX(), ak.getY(), this);
				}else if(!ak.isSpell() && ak.getPrice() > konto.getBalance()){
					g2.drawImage(bilder.getCrosspic(), ak.getX(), ak.getY(), this);
				}
				
				Point mp = getMousePosition();
				if(mp != null && k.getBounds().contains(mp)){
					gotoverknapp = true;
					
					if(ak.isSpell()){
						g2.setColor(Color.BLUE);
					}else{
						g2.setColor(Color.ORANGE);
					}
					
					g2.drawString(ak.getPriceString(), 650, 182);
					
					for(int i = 0; i < ak.getDescription().size(); i++){
						g2.setColor(Color.BLACK);
						g2.drawString(ak.getDescription().get(i), 650, 167+15*i);
					}
				}
			}else if(k instanceof InfoKnapp) {
				InfoKnapp ik = (InfoKnapp)k;
				int thth = 0;
				
				if(numenemies.get(ik.getType()) != null ){
					thth = numenemies.get(ik.getType());
				}
				
				g2.setColor(Color.BLACK);
				g2.drawString("" + thth + " x ", ik.getX()-30, ik.getY()+16);
				
				Point mp = getMousePosition();
				if(mp != null && k.getBounds().contains(mp)){
					gotoverknapp = true;
					for(int i = 0; i < ik.getDescription().size(); i++){
						g2.setColor(Color.BLACK);
						g2.drawString(ik.getDescription().get(i), 650, 167+15*i);
					}
				}
			}
		}
		
		if(selectedTower != null){
			if(!gotoverknapp){
				for(int i = 0; i < selectedTower.getStatsAsString().size(); i++){
					g2.setColor(Color.BLACK);
					g2.drawString(selectedTower.getStatsAsString().get(i), 650, 167 + i*15);
					//g.drawString("Damage done: " + selectedTower.damagedone, 20, 20);
				}
				g2.drawImage(upgradeKnapp.getImg(), upgradeKnapp.getX(), upgradeKnapp.getY(), this);
				g2.drawImage(sellKnapp.getImg(),  sellKnapp.getX(), sellKnapp.getY(), this);
				g2.setColor(Color.ORANGE);
				g2.drawString("Upgrade: " + selectedTower.getUpgradePrice(), 650, 182);
				g2.drawString("Sell: " + (konto.pricefor(selectedTower.toString())/2 + selectedTower.getLevel()*10), 650, 197);
				if(selectedTower.getLevel() >= selectedTower.getMaxLevel() || selectedTower.getUpgradePrice() > konto.getBalance()){
					g2.drawImage(bilder.getCrosspic(), upgradeKnapp.getX(), upgradeKnapp.getY(), this);
				}
			}
			
			g2.drawImage(bilder.getSelectpic(), selectedTower.getX() - 2, selectedTower.getY() -2 , this);
			g2.drawImage(bilder.getRangepic().get(selectedTower.getRange()), selectedTower.getX() + selectedTower.getWidth()/2 - selectedTower.getRange(), selectedTower.getY() + selectedTower.getHeight()/2 - selectedTower.getRange(), selectedTower.getRange()*2, selectedTower.getRange()*2, this);
		}
		LinkedList<Enemy> fienderclone = (LinkedList<Enemy>)fiender.clone();
		for(Enemy e: fienderclone){
			g2.drawImage(e.getImg(), e.getX(), e.getY(), this);
			g2.setColor(Color.BLACK);
			g2.fillRect(e.getX(), e.getY()-4, e.getWidth(), 4);
			g2.setColor(Color.GREEN);
			g2.fillRect(e.getX(), e.getY()-4, e.getHealthWidth(), 4);
		}
		LinkedList<Tower> taarnclone = (LinkedList<Tower>)taarn.clone();
		for(Tower t: taarnclone){
			g2.drawImage(t.getImg(), t.getX(), t.getY(), this);
		}
		LinkedList<Projectile> prosjektilerclone = (LinkedList<Projectile>)prosjektiler.clone();
		for(Projectile p: prosjektilerclone){
			g2.drawImage(p.getImg(), p.getX(), p.getY(), this);
		}
		
		if(placingtower ){
			Point mp = getMousePosition();
			if(mp != null){
				int xp = (int)(mp.x/Co.IMGSIZE);
				int yp = (int)(mp.y/Co.IMGSIZE);
				
				if(Co.DRAWINGAREA.contains(mp.x, mp.y)){
					placethis.setX(xp*Co.IMGSIZE);
					placethis.setY(yp*Co.IMGSIZE);
					
					g2.drawImage(placethis.getImg(), placethis.getX(), placethis.getY(), this);
					
					boolean drawCross = false;
					
					if(drawlevel[yp][xp] != Co.GROUNDC){
						drawCross = true;
					}else{
						Rectangle tilebounds;
						for (Tower t : taarn) {
							tilebounds = new Rectangle(t.getX(), t.getY(), Co.IMGSIZE, Co.IMGSIZE);
							if(tilebounds.contains(mp.x, mp.y)){
								drawCross = true;
							}
						}
					}
					if(drawCross){
						g2.drawImage(bilder.getCrosspic(), placethis.getX(), placethis.getY(), this);
					}
					g2.drawImage(bilder.getRangepic().get(placethis.getRange()), placethis.getX() + placethis.getWidth()/2 - placethis.getRange(), placethis.getY() + placethis.getHeight()/2 - placethis.getRange(), placethis.getRange()*2, placethis.getRange()*2, this);
				}
			}
		}
		if(castingspell ){
			Point mp = getMousePosition();
			if(mp != null){
				if(Co.DRAWINGAREA.contains(mp.x, mp.y)){
					if(castingthis instanceof PlaceRunestone){
						
						int xp = (int)(mp.x/Co.IMGSIZE);
						int yp = (int)(mp.y/Co.IMGSIZE);
						
						castingthis.setX(xp*Co.IMGSIZE);
						castingthis.setY(yp*Co.IMGSIZE);
						
						g2.drawImage(castingthis.getImg(), castingthis.getX(), castingthis.getY(), this);
						
						boolean drawCross = false;
						
						if(drawlevel[yp][xp] != Co.OBSTACLEC){
							drawCross = true;
						}else{
							Rectangle tilebounds;
							for (Tower t : taarn) {
								tilebounds = new Rectangle(t.getX(), t.getY(), Co.IMGSIZE, Co.IMGSIZE);
								if(tilebounds.contains(mp.x, mp.y)){
									drawCross = true;
								}
							}
						}
						if(drawCross){
							g2.drawImage(bilder.getCrosspic(), castingthis.getX(), castingthis.getY(), this);
						}
					}else{
						castingthis.setX(mp.x);
						castingthis.setY(mp.y);
						g2.drawImage(castingthis.getImg(), castingthis.getX()-castingthis.getWidth(), castingthis.getY()-castingthis.getHeight(), this);
					}
				}
			}
		}
		if(helpscreenon){
			helpscreen.draw(g2);
		}
		for (SimpleKnapp k : knapper2) {
			k.draw(g2);
		}
	}
	
	public LinkedList<Enemy> getEnemies(){
		return fiender;
	}
	public void addEnemy(char c, int nivå){
		Point start = level.getStartPos();
		
		if(c == Co.NORMALENEMYC){
			fiender.add(new NormalEnemy(this, start.x*Co.IMGSIZE + Co.IMGSIZE/2, start.y*Co.IMGSIZE  + Co.IMGSIZE/2, nivå));
		}else if(c == Co.FASTENEMYC){
			fiender.add(new FastEnemy(this, start.x*Co.IMGSIZE + Co.IMGSIZE/2, start.y*Co.IMGSIZE  + Co.IMGSIZE/2, nivå));
		}else if(c == Co.SHIELDENEMYC){
			fiender.add(new ShieldEnemy(this, start.x*Co.IMGSIZE + Co.IMGSIZE/2, start.y*Co.IMGSIZE  + Co.IMGSIZE/2, nivå));
		}else if(c == Co.DODGEENEMYC){
			fiender.add(new DodgeEnemy(this, start.x*Co.IMGSIZE + Co.IMGSIZE/2, start.y*Co.IMGSIZE  + Co.IMGSIZE/2, nivå));
		}else if(c == Co.NOSLOWENEMYC){
			fiender.add(new NoslowEnemy(this, start.x*Co.IMGSIZE + Co.IMGSIZE/2, start.y*Co.IMGSIZE  + Co.IMGSIZE/2, nivå));
		}else if(c == Co.SUPERENEMYC){
			fiender.add(new SuperEnemy(this, start.x*Co.IMGSIZE + Co.IMGSIZE/2, start.y*Co.IMGSIZE  + Co.IMGSIZE/2, nivå));
		}
	}
	public void addTower(Tower t) {
		placingtower = true;
		placethis = t;
	}
	public void addSpell(TDObject s) {
		castingspell = true;
		castingthis = s;
	}
	public void addProjectile(Projectile p){
		prosjektiler.add(p);
	}
	public void addAreaShot(AreaShot a){
		areaskudd.add(a);
	}
	public void addKnapp(SimpleKnapp k){
		knapper2.add(k);
	}
	public void removeKnapp(SimpleKnapp k){
		knapper2.remove(k);
	}
	public void removeEnemy(Enemy e) {
		fienderbin.add(e);
	}
	public void removeTower(Tower t) {
		taarnbin.add(t);
	}
	public void removeProjectile(Projectile p) {
		prosjektilerbin.add(p);
	}
	public void removeAreaShot(AreaShot a){
		areaskuddbin.add(a);
	}
	public Pic getBilder(){
		return bilder;
	}
	public Account getKonto(){
		return konto;
	}
	public Account getMana(){
		return mana;
	}
	public Level getLevel(){
		return level;
	}
	public Audio getLyder(){
		return lyder;
	}
	public int getWavenumber(){
		return wavenumber;
	}
	public Tower getSelectedTower(){
		return selectedTower;
	}
	public boolean isPlacingTower(){
		return placingtower;
	}
	public boolean isCastingSpell(){
		return castingspell;
	}
	public void cancelPlaceCast(){
		placingtower = false;
		placethis = null;
		castingspell = false;
		castingthis = null;
	}
	public void setSelectedTower(Tower t){
		selectedTower = t;
	}
	public void showhelpscreen(){
		helpscreen = new TDHelp(this, 100, 100);
		helpscreenon = true;
	}
	public void hidehelpscreen(){
		helpscreen = null;
		helpscreenon = false;
	}
	
	/////MOUSEEVENTS
	public void mousePressed(MouseEvent e) {
		
		if(e.getButton() == MouseEvent.BUTTON3){
			placingtower = false;
			placethis = null;
			castingspell = false;
			castingthis = null;
			selectedTower = null;
			return;
		}
		
		if(selectedTower != null){
			if(upgradeKnapp.getBounds().contains(e.getX(), e.getY())){
				if(selectedTower.getLevel() < selectedTower.getMaxLevel()){
					upgradeKnapp.clicked();
				}
				return;
			}else if(sellKnapp.getBounds().contains(e.getX(), e.getY())){
				sellKnapp.clicked();
				selectedTower = null;
				return;
			}
		}
		selectedTower = null;
		
		for (Tower t : taarn) {
			if(t.getBounds().contains(e.getX(), e.getY())){
				t.clicked();
				return;
			}
		}
		if(placingtower && konto.canAfford(placethis.toString())){
			char[][] brett = level.getLevel();
			int xp = (int)(e.getX()/Co.IMGSIZE);
			int yp = (int)(e.getY()/Co.IMGSIZE);
			
			if(Co.DRAWINGAREA.contains(e.getX(), e.getY()) && brett[yp][xp] == Co.GROUNDC){
				Rectangle tilebounds;
				for (Tower t : taarn) {
					tilebounds = new Rectangle(t.getX(), t.getY(), Co.IMGSIZE, Co.IMGSIZE);
					if(tilebounds.contains(e.getX(), e.getY())){
						return;
					}
				}
				taarn.add(placethis);
				lyder.getBuildlyd().play();
				konto.payfor(placethis.toString());
				placingtower = false;
				placethis = null;
			}
		}
		
		if(castingspell && mana.checkAmount(50)){
			if(Co.DRAWINGAREA.contains(e.getX(), e.getY())){
				
				if(castingthis instanceof Lightning){
					@SuppressWarnings("unchecked")
					LinkedList<Enemy> fienderclone =  (LinkedList<Enemy>)fiender.clone();
					for(Enemy en: fienderclone){
						if(en.getBounds().contains(e.getX(), e.getY())){
							Lightning sl = (Lightning)castingthis;
							lyder.getLynlyd().play();
							sl.castOn(en);
							mana.withdraw(50);
							castingspell = false;
							castingthis = null;
							return;
						}
					}
				}
				else if(castingthis instanceof PlaceRunestone){
					if(level.getLevel()[e.getY()/Co.IMGSIZE][e.getX()/Co.IMGSIZE] == Co.OBSTACLEC ){
						PlaceRunestone sr = (PlaceRunestone)castingthis;
						lyder.getBuildlyd().play();
						sr.cast(e.getY()/Co.IMGSIZE, e.getX()/Co.IMGSIZE);
						mana.withdraw(50);
						castingspell = false;
						castingthis = null;
						return;
					}
				}
			}
		}
		for (Knapp k : knapper) {
			if(k.getBounds().contains(e.getX(), e.getY())){
				k.clicked();
				return;
			}
		}
		for (SimpleKnapp k : knapper2) {
			if(k.getBounds().contains(e.getX(), e.getY())){
				k.clicked();
				return;
			}
		}
	}
	
	public void mouseClicked(MouseEvent e){}
	public void mouseEntered(MouseEvent e){}
	public void mouseExited(MouseEvent e){}
	public void mouseReleased(MouseEvent e){}
}//END
