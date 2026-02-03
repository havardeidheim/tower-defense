package source;

import java.applet.Applet;
import java.applet.AudioClip;

public class Audio {

	
	private AudioClip selectlyd;
	private AudioClip menylyd;
	private AudioClip knapplyd;
	
	private AudioClip buildlyd;
	private AudioClip[] startlyd = new AudioClip[4];
	private AudioClip lynlyd;
	
	private AudioClip verygood;
	
	private AudioClip firelyd;
	
	private AudioClip stonelyd;
	private AudioClip dielyd;
	private AudioClip oklyd;
	private AudioClip selllyd;
	
	public Audio() {
		startlyd[0] = Applet.newAudioClip(getClass().getResource("/resources/sounds/endiscoming.wav"));
		startlyd[1] = Applet.newAudioClip(getClass().getResource("/resources/sounds/forseevictory.wav"));
		startlyd[2] = Applet.newAudioClip(getClass().getResource("/resources/sounds/noonealive.wav"));
		startlyd[3] = Applet.newAudioClip(getClass().getResource("/resources/sounds/letsgo.wav"));
		
		firelyd = Applet.newAudioClip(getClass().getResource("/resources/sounds/fire.wav"));
		
		lynlyd = Applet.newAudioClip(getClass().getResource("/resources/sounds/lightning.wav"));
		verygood = Applet.newAudioClip(getClass().getResource("/resources/sounds/verygood.wav"));
		buildlyd = Applet.newAudioClip(getClass().getResource("/resources/sounds/build.wav"));
		knapplyd = Applet.newAudioClip(getClass().getResource("/resources/sounds/knapp.wav"));
		selectlyd = Applet.newAudioClip(getClass().getResource("/resources/sounds/select.wav"));
		
		selllyd = Applet.newAudioClip(getClass().getResource("/resources/sounds/sell.wav"));
		dielyd = Applet.newAudioClip(getClass().getResource("/resources/sounds/die.wav"));
		oklyd = Applet.newAudioClip(getClass().getResource("/resources/sounds/ok.wav"));
	}
	
	public AudioClip getStoneLyd(){
		return Applet.newAudioClip(getClass().getResource("/resources/sounds/stone.wav"));
	}
	public AudioClip getAreaLyd(){
		return Applet.newAudioClip(getClass().getResource("/resources/sounds/frost.wav"));
	}
	public AudioClip getSpreadLyd(){
		return Applet.newAudioClip(getClass().getResource("/resources/sounds/fire.wav"));
	}
	public AudioClip getPoisonLyd(){
		return Applet.newAudioClip(getClass().getResource("/resources/sounds/poison.wav"));
	}

	public AudioClip getSelectlyd(){
		return selectlyd;
	}

	public AudioClip getMenylyd(){
		return menylyd;
	}

	public AudioClip getKnapplyd(){
		return knapplyd;
	}

	public AudioClip getBuildlyd(){
		return buildlyd;
	}

	public AudioClip[] getStartlyd(){
		return startlyd;
	}

	public AudioClip getLynlyd(){
		return lynlyd;
	}

	public AudioClip getVerygood(){
		return verygood;
	}

	public AudioClip getFirelyd(){
		return firelyd;
	}

	public AudioClip getStonelyd(){
		return stonelyd;
	}

	public AudioClip getDielyd(){
		return dielyd;
	}

	public AudioClip getOklyd(){
		return oklyd;
	}

	public AudioClip getSelllyd(){
		return selllyd;
	}

}//END
