package towers;

import projectiles.NormalProjectile;
import source.Board;
import source.Co;

public class NormalTower extends Tower{

	public NormalTower(Board gui, int xs, int ys) {
		super(gui.getBilder().getTowerpic().get(Co.NORMALTYPE), gui, xs, ys);
		skytelyd = gui.getLyder().getStoneLyd();
	}
	@Override
	public void setStats() {
		range = 140; 
		speed = 1.2;
		damage = 20;
		name = "Tower of Stonehurling";
	}
	@Override
	public void upgrade() {
		range += 10;
		damage += 8;
		
		speed -= 0.1;
		speed = (double)Math.round(speed * 100000) / 100000;

		level++;
		
		if(fast){
			timer.setDelay((int)((1000*speed) /2));
			timer.setInitialDelay((int)((1000*speed) /2));
		}else{
			timer.setDelay((int)(1000*speed));
			timer.setInitialDelay((int)(1000*speed));
		}
	}
	@Override
	protected void fireProjectile() {
		skytelyd.play();
		gui.addProjectile(new NormalProjectile(gui, this, target, (int)damage));
	}

	@Override
	public String toString(){
		return Co.NORMALTYPE;
	}
}//END
