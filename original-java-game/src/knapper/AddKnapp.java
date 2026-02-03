package knapper;

import java.util.ArrayList;

import source.Board;
import source.Co;
import spells.Lightning;
import spells.PlaceRunestone;
import towers.AreaTower;
import towers.NormalTower;
import towers.PoisonTower;
import towers.SpreadTower;

public class AddKnapp extends Knapp {
	
	String type;
	
	public AddKnapp(Board gui, int xs, int ys, String ty) {
		super(gui.getBilder().getLightningknapppic(), gui, xs, ys);
		type = ty;
		
		setImg(gui.getBilder().getTowerpic().get(type));
	}
	public boolean isSpell(){
		if(type.equals(Co.LIGHTNINGTYPE) || type.equals(Co.RUNESTONETYPE)){
			return true;
		}
		return false;
	}
	public int getPrice(){
		return gui.getKonto().pricefor(type);
	}
	public String getPriceString(){
		if(isSpell()){
			return "Mana: " + gui.getKonto().pricefor(type);
		}
		return "Price: " + gui.getKonto().pricefor(type);
	}
	public String getType(){
		return type;
	}
	
	public ArrayList<String> getDescription(){
		ArrayList<String> ting = new ArrayList<String>();
		
		if(type.equals(Co.POISONTYPE)){
			ting.add("Tower of Poisoning");
			ting.add("");
			ting.add("");
			ting.add("Poisons the enemy causing");
			ting.add("damage every second.");
			ting.add("Hits on already poisoned");
			ting.add("enemies will increase the ");
			ting.add("duration of the poison.");
			ting.add("Prioritizes nonpoisoned");
			ting.add("enemies");
			ting.add("");
			ting.add("Levelup:");
			ting.add("Increased duration");
		}else if(type.equals(Co.NORMALTYPE)){
			ting.add("Tower of Stonehurling");
			ting.add("");
			ting.add("");
			ting.add("Hurls stones at the enemy");
			ting.add("");
			ting.add("Levelup:");
			ting.add("Increased speed");
			ting.add("Increased damage");
			ting.add("Increased range");
		}else if(type.equals(Co.AREATYPE)){
			ting.add("Tower of Frostshock");
			ting.add("");
			ting.add("");
			ting.add("Damages and slows all");
			ting.add("enemies in range");
			ting.add("");
			ting.add("Levelup:");
			ting.add("Increased slow");
			ting.add("Increased damage");
			ting.add("");
			ting.add("Level 4:");
			ting.add("Increased range");
		}else if(type.equals(Co.SPREADTYPE)){
			ting.add("Tower of Scatterflames");
			ting.add("");
			ting.add("");
			ting.add("Fires heatseeking fireballs");
			ting.add("at multiple enemies");
			ting.add("");
			ting.add("Levelup:");
			ting.add("Extra fireballs");
			ting.add("Increased damage");
			ting.add("");
			ting.add("Level 4");
			ting.add("Fireballs now");
			ting.add("strike two targets");
		}else if(type.equals(Co.LIGHTNINGTYPE)){
			ting.add("Lightningbolt");
			ting.add("");
			ting.add("");
			ting.add("Stuns and damages a single");
			ting.add("enemy. Killing normal");
			ting.add("enemies outright");
			ting.add("");
			ting.add("Can't be dodged");
		}else if(type.equals(Co.RUNESTONETYPE)){
			ting.add("Place foundation");
			ting.add("");
			ting.add("");
			ting.add("Places a foundation on");
			ting.add("the ground, allowing you");
			ting.add("to build a tower on it.");
		}
		return ting;
	}
	
	@Override
	public void clicked() {
		
		gui.getLyder().getKnapplyd().play();
		
		if(gui.isPlacingTower() || gui.isCastingSpell()){
			gui.cancelPlaceCast();
		}
		
		if(!isSpell() && gui.getKonto().canAfford(type)){
			if(type.equals(Co.POISONTYPE)){
				gui.addTower(new PoisonTower(gui, (int)x, (int)y));
			}else if(type.equals(Co.NORMALTYPE)){
				gui.addTower(new NormalTower(gui, (int)x, (int)y));
			}else if(type.equals(Co.AREATYPE)){
				gui.addTower(new AreaTower(gui, (int)x, (int)y));
			}else if(type.equals(Co.SPREADTYPE)){
				gui.addTower(new SpreadTower(gui, (int)x, (int)y));
			}
		}else if(gui.getMana().checkAmount(getPrice())){
			if(type.equals(Co.LIGHTNINGTYPE)){
				gui.addSpell(new Lightning(gui, (int)x, (int)y));
			}else if(type.equals(Co.RUNESTONETYPE)){
				gui.addSpell(new PlaceRunestone(gui, (int)x, (int)y));
			}
		}
	}
}//END
