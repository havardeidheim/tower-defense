package knapper;

import java.util.ArrayList;

import source.Board;
import source.Co;

public class InfoKnapp extends Knapp {

	char type;
	
	public InfoKnapp(Board gui, int xs, int ys, char c) {
		super(gui.getBilder().getPeasant().get("u"), gui, xs, ys);
		type = c;
		
		if(type == Co.DODGEENEMYC){
			setImg(gui.getBilder().getAssassin().get("u"));
		}else if(type == Co.NORMALENEMYC){
			setImg(gui.getBilder().getPeasant().get("u"));
		}else if(type == Co.FASTENEMYC){
			setImg(gui.getBilder().getScout().get("u"));
		}else if(type == Co.NOSLOWENEMYC){
			setImg(gui.getBilder().getVanguard().get("u"));
		}else if(type == Co.SUPERENEMYC){
			setImg(gui.getBilder().getParagon().get("u"));
		}else if(type == Co.SHIELDENEMYC){
			setImg(gui.getBilder().getSolider().get("u"));
		}
	}
	public char getType(){
		return type;
	}
	public ArrayList<String> getDescription(){
		ArrayList<String> ting = new ArrayList<String>();
		
		if(type == Co.DODGEENEMYC){
			ting.add("Assassin");
			ting.add("");
			ting.add("Low Health");
			ting.add("Fast movement");
			ting.add("50% chance to dodge attacks");
		}else if(type == Co.NORMALENEMYC){
			ting.add("Peasant");
			ting.add("");
			ting.add("Just a peasant");
		}else if(type == Co.FASTENEMYC){
			ting.add("Scout");
			ting.add("");
			ting.add("Fast movement");
		}else if(type == Co.NOSLOWENEMYC){
			ting.add("Vanguard");
			ting.add("");
			ting.add("Fast movement");
			ting.add("Immune to slow");
			ting.add("Blocks the three first");
			ting.add("attacks made to him");
		}else if(type == Co.SUPERENEMYC){
			ting.add("Paragon");
			ting.add("");
			ting.add("Low health");
			ting.add("Fast movement");
			ting.add("Immune to slow");
			ting.add("50% chance to dodge attacks");
			ting.add("Mitigates a certain amount");
			ting.add("of damage every hit, also");
			ting.add("work on poison damage");
		}else if(type == Co.SHIELDENEMYC){
			ting.add("Solider");
			ting.add("");
			ting.add("High health");
			ting.add("Mitigates a certain amount");
			ting.add("of damage every hit, also");
			ting.add("work on poison damage");
		}
		return ting;
	}
	
	@Override
	public void clicked(){
		// TODO Auto-generated method stub
	}

}//END
