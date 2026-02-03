package source;

import java.awt.image.BufferedImage;
import java.util.ArrayList;
import java.util.HashMap;

import javax.imageio.ImageIO;

public class Pic {
	private BufferedImage backgroundpic;
	private BufferedImage helpbackgroundpic;
	
	private BufferedImage groundpic;
	private BufferedImage obstaclepic;
	private BufferedImage pathpic;
	
	private BufferedImage spawnpic;
	private BufferedImage targetpic;
	
	private BufferedImage normalenemybilde;
	private BufferedImage fastenemybilde;
	private BufferedImage dodgeenemybilde;
	private BufferedImage shieldenemybilde;
	private BufferedImage noslowenemybilde;
	private BufferedImage superenemybilde;
	
	private BufferedImage blancknapppic;
	private BufferedImage blanctowerpic;
	private BufferedImage towerknapp;
	private BufferedImage cursorpic;
	
	private BufferedImage upgradepic;
	private BufferedImage sellpic;
	
	private BufferedImage lightningpic;
	
	private BufferedImage lightningknapppic;
	
	private BufferedImage eksplosjonpic;
	
	private BufferedImage mapcrosspic;
	private BufferedImage crosspic;
	private BufferedImage selectpic;
	
	private BufferedImage spreadprojectileimage;
	private BufferedImage poisonprojectileimage;
	private BufferedImage normalprojectileimage;
	
	private HashMap<String, BufferedImage> towerpic = new HashMap<String, BufferedImage>();
	
	private HashMap<String, BufferedImage> peasant = new HashMap<String, BufferedImage>();
	
	private HashMap<String, BufferedImage> solider = new HashMap<String, BufferedImage>();
	private HashMap<String, BufferedImage> scout = new HashMap<String, BufferedImage>();
	private HashMap<String, BufferedImage> assassin = new HashMap<String, BufferedImage>();
	private HashMap<String, BufferedImage> vanguard = new HashMap<String, BufferedImage>();
	private HashMap<String, BufferedImage> paragon = new HashMap<String, BufferedImage>();
	
	private HashMap<Integer, BufferedImage> rangepic = new HashMap<Integer, BufferedImage>();
	
	private ArrayList<BufferedImage> areashot = new ArrayList<BufferedImage>();
	
	public Pic(){
		try {
			backgroundpic = ImageIO.read(getClass().getResource("/resources/images/background.png"));
			helpbackgroundpic = ImageIO.read(getClass().getResource("/resources/images/helpback.png"));
			
			peasant.put("u", ImageIO.read(getClass().getResource("/resources/images/peasant/peasantu.png")));
			peasant.put("d", ImageIO.read(getClass().getResource("/resources/images/peasant/peasantd.png")));
			peasant.put("l", ImageIO.read(getClass().getResource("/resources/images/peasant/peasantl.png")));
			peasant.put("r", ImageIO.read(getClass().getResource("/resources/images/peasant/peasantr.png")));
			
			solider.put("u", ImageIO.read(getClass().getResource("/resources/images/solider/solideru.png")));
			solider.put("d", ImageIO.read(getClass().getResource("/resources/images/solider/soliderd.png")));
			solider.put("l", ImageIO.read(getClass().getResource("/resources/images/solider/soliderl.png")));
			solider.put("r", ImageIO.read(getClass().getResource("/resources/images/solider/soliderr.png")));

			scout.put("u", ImageIO.read(getClass().getResource("/resources/images/scout/scoutu.png")));
			scout.put("d", ImageIO.read(getClass().getResource("/resources/images/scout/scoutd.png")));
			scout.put("l", ImageIO.read(getClass().getResource("/resources/images/scout/scoutl.png")));
			scout.put("r", ImageIO.read(getClass().getResource("/resources/images/scout/scoutr.png")));
			
			assassin.put("u", ImageIO.read(getClass().getResource("/resources/images/assassin/assassinu.png")));
			assassin.put("d", ImageIO.read(getClass().getResource("/resources/images/assassin/assassind.png")));
			assassin.put("l", ImageIO.read(getClass().getResource("/resources/images/assassin/assassinl.png")));
			assassin.put("r", ImageIO.read(getClass().getResource("/resources/images/assassin/assassinr.png")));
			
			vanguard.put("u", ImageIO.read(getClass().getResource("/resources/images/vanguard/vanguardu.png")));
			vanguard.put("d", ImageIO.read(getClass().getResource("/resources/images/vanguard/vanguardd.png")));
			vanguard.put("l", ImageIO.read(getClass().getResource("/resources/images/vanguard/vanguardl.png")));
			vanguard.put("r", ImageIO.read(getClass().getResource("/resources/images/vanguard/vanguardr.png")));
			
			paragon.put("u", ImageIO.read(getClass().getResource("/resources/images/paragon/paragonu.png")));
			paragon.put("d", ImageIO.read(getClass().getResource("/resources/images/paragon/paragond.png")));
			paragon.put("l", ImageIO.read(getClass().getResource("/resources/images/paragon/paragonl.png")));
			paragon.put("r", ImageIO.read(getClass().getResource("/resources/images/paragon/paragonr.png")));
			
			areashot.add(ImageIO.read(getClass().getResource("/resources/images/areashot/areashot5.png")));
			areashot.add(ImageIO.read(getClass().getResource("/resources/images/areashot/areashot4.png")));
			areashot.add(ImageIO.read(getClass().getResource("/resources/images/areashot/areashot3.png")));
			areashot.add(ImageIO.read(getClass().getResource("/resources/images/areashot/areashot3.png")));
			areashot.add(ImageIO.read(getClass().getResource("/resources/images/areashot/areashot2.png")));
			areashot.add(ImageIO.read(getClass().getResource("/resources/images/areashot/areashot2.png")));
			areashot.add(ImageIO.read(getClass().getResource("/resources/images/areashot/areashot1.png")));
			areashot.add(ImageIO.read(getClass().getResource("/resources/images/areashot/areashot0.png")));
			
			rangepic.put(170, ImageIO.read(getClass().getResource("/resources/images/range/range170.png")));
			rangepic.put(160, ImageIO.read(getClass().getResource("/resources/images/range/range160.png")));
			rangepic.put(150, ImageIO.read(getClass().getResource("/resources/images/range/range150.png")));
			rangepic.put(140, ImageIO.read(getClass().getResource("/resources/images/range/range140.png")));
			rangepic.put(120, ImageIO.read(getClass().getResource("/resources/images/range/range120.png")));
			rangepic.put(100, ImageIO.read(getClass().getResource("/resources/images/range/range100.png")));
			rangepic.put(80, ImageIO.read(getClass().getResource("/resources/images/range/range80.png")));
			
			groundpic = ImageIO.read(getClass().getResource("/resources/images/ground.png"));
			pathpic = ImageIO.read(getClass().getResource("/resources/images/path.png"));
			spawnpic = ImageIO.read(getClass().getResource("/resources/images/spawn.png"));
			
			towerpic.put(Co.NORMALTYPE, ImageIO.read(getClass().getResource("/resources/images/normaltower.png")));
			towerpic.put(Co.POISONTYPE, ImageIO.read(getClass().getResource("/resources/images/poisontower.png")));
			towerpic.put(Co.AREATYPE, ImageIO.read(getClass().getResource("/resources/images/areatower.png")));
			towerpic.put(Co.SPREADTYPE, ImageIO.read(getClass().getResource("/resources/images/spreadtower.png")));
			towerpic.put(Co.LIGHTNINGTYPE, ImageIO.read(getClass().getResource("/resources/images/lightningknapp.png")));
			towerpic.put(Co.RUNESTONETYPE, ImageIO.read(getClass().getResource("/resources/images/blanctower.png")));
			
			blancknapppic = ImageIO.read(getClass().getResource("/resources/images/blancknapp.png"));
			blanctowerpic = ImageIO.read(getClass().getResource("/resources/images/blanctower.png"));
			
			normalprojectileimage = ImageIO.read(getClass().getResource("/resources/images/normalprojectile.png"));
			spreadprojectileimage = ImageIO.read(getClass().getResource("/resources/images/spreadprojectile.png"));
			poisonprojectileimage = ImageIO.read(getClass().getResource("/resources/images/poisonprojectile.png"));
			
			mapcrosspic = ImageIO.read(getClass().getResource("/resources/images/mapcross.png"));
			
			crosspic = ImageIO.read(getClass().getResource("/resources/images/cross.png"));
			selectpic = ImageIO.read(getClass().getResource("/resources/images/select.png"));
			
			lightningpic = ImageIO.read(getClass().getResource("/resources/images/lightning.png"));
			lightningknapppic = ImageIO.read(getClass().getResource("/resources/images/lightningknapp.png"));
			
			upgradepic = ImageIO.read(getClass().getResource("/resources/images/upgradeknapp.png"));
			sellpic = ImageIO.read(getClass().getResource("/resources/images/sellknapp.png"));
		} catch (Exception e) {
			e.printStackTrace();
		}
	}
	
	public BufferedImage getBackgroundpic(){
		return backgroundpic;
	}

	public BufferedImage getHelpbackgroundpic(){
		return helpbackgroundpic;
	}

	public BufferedImage getGroundpic(){
		return groundpic;
	}

	public BufferedImage getObstaclepic(){
		return obstaclepic;
	}

	public BufferedImage getPathpic(){
		return pathpic;
	}

	public BufferedImage getSpawnpic(){
		return spawnpic;
	}

	public BufferedImage getTargetpic(){
		return targetpic;
	}

	public BufferedImage getNormalenemybilde(){
		return normalenemybilde;
	}

	public BufferedImage getFastenemybilde(){
		return fastenemybilde;
	}

	public BufferedImage getDodgeenemybilde(){
		return dodgeenemybilde;
	}

	public BufferedImage getShieldenemybilde(){
		return shieldenemybilde;
	}

	public BufferedImage getNoslowenemybilde(){
		return noslowenemybilde;
	}

	public BufferedImage getSuperenemybilde(){
		return superenemybilde;
	}

	public BufferedImage getBlancknapppic(){
		return blancknapppic;
	}

	public BufferedImage getBlanctowerpic(){
		return blanctowerpic;
	}

	public BufferedImage getTowerknapp(){
		return towerknapp;
	}

	public BufferedImage getCursorpic(){
		return cursorpic;
	}

	public BufferedImage getUpgradepic(){
		return upgradepic;
	}

	public BufferedImage getSellpic(){
		return sellpic;
	}

	public BufferedImage getLightningpic(){
		return lightningpic;
	}

	public BufferedImage getLightningknapppic(){
		return lightningknapppic;
	}

	public BufferedImage getEksplosjonpic(){
		return eksplosjonpic;
	}

	public BufferedImage getMapcrosspic(){
		return mapcrosspic;
	}

	public BufferedImage getCrosspic(){
		return crosspic;
	}

	public BufferedImage getSelectpic(){
		return selectpic;
	}

	public BufferedImage getSpreadprojectileimage(){
		return spreadprojectileimage;
	}

	public BufferedImage getPoisonprojectileimage(){
		return poisonprojectileimage;
	}

	public BufferedImage getNormalprojectileimage(){
		return normalprojectileimage;
	}

	public HashMap<String, BufferedImage> getTowerpic(){
		return towerpic;
	}

	public HashMap<String, BufferedImage> getPeasant(){
		return peasant;
	}

	public HashMap<String, BufferedImage> getSolider(){
		return solider;
	}

	public HashMap<String, BufferedImage> getScout(){
		return scout;
	}

	public HashMap<String, BufferedImage> getAssassin(){
		return assassin;
	}

	public HashMap<String, BufferedImage> getVanguard(){
		return vanguard;
	}

	public HashMap<String, BufferedImage> getParagon(){
		return paragon;
	}

	public HashMap<Integer, BufferedImage> getRangepic(){
		return rangepic;
	}

	public ArrayList<BufferedImage> getAreashot(){
		return areashot;
	}
}//END
