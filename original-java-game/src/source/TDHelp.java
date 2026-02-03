package source;

import java.awt.Color;
import java.awt.Graphics2D;
import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.util.ArrayList;

import knapper.SimpleKnapp;
import knapper.TDAction;

public class TDHelp extends TDObject {
	public void loop(){/*nothing*/};
	
	int height = 0;
	int width = 0;
	int textNr = 0;
	
	SimpleKnapp prev;
	SimpleKnapp next;
	SimpleKnapp close;
	SimpleKnapp tldr;
	
	ArrayList<ArrayList<String>> tekst = new ArrayList<ArrayList<String>>();
	ArrayList<ArrayList<Arrow>> piler = new ArrayList<ArrayList<Arrow>>();
	
	public TDHelp(final Board gui, int xs, int ys) {
		super(gui.getBilder().getHelpbackgroundpic(), gui, xs, ys);
		try {
			initTekst();
		} catch (IOException e) {
			e.printStackTrace();
		}
		
		TDAction clicknext = new TDAction() {
			public void clicked(){
				if(textNr < (tekst.size()-1)){
					textNr++;
				}
			}
		};
		TDAction clickprev = new TDAction() {
			public void clicked(){
				if(textNr > 0){
					textNr--;
				}
			}
		};
		TDAction clickclose = new TDAction() {
			public void clicked(){
				gui.hidehelpscreen();
				gui.removeKnapp(prev);
				gui.removeKnapp(next);
				gui.removeKnapp(close);
				gui.removeKnapp(tldr);
			}
		};
		TDAction tldrclick = new TDAction() {
			public void clicked(){
				textNr = tekst.size()-1;
			}
		};
		prev = new SimpleKnapp(xs+10, ys+260, "Back", clickprev);
		next = new SimpleKnapp(xs+90, ys+260, "Next", clicknext);
		close = new SimpleKnapp(xs + 320, ys+260, "Close", clickclose);
		tldr = new SimpleKnapp(xs + 210, ys+260, "tl:dr", tldrclick);
		
		gui.addKnapp(tldr);
		gui.addKnapp(prev);
		gui.addKnapp(next);
		gui.addKnapp(close);
	}

	@Override
	public int getHeight(){
		return img.getHeight();
	}
	@Override
	public int getWidth(){
		return img.getWidth();
	}
	
	public void draw(Graphics2D g){
		g.setColor(Color.BLACK);
		g.drawImage(img, (int)x, (int)y, getWidth(), getHeight(), null);
		g.drawRect((int)x+2, (int)y+2, getWidth()-4, getHeight()-4);
		g.drawRect((int)x, (int)y, getWidth(), getHeight());
		
		for(int i = 0; i < tekst.get(textNr).size(); i++){
			g.drawString(tekst.get(textNr).get(i), (int)x+10, (int)y + 20 +  i*15);
		}
//		for(int i = 0; i < piler.get(textNr).size(); i++){
//			//piler.get(textNr).get(i).draw(g);
//		}
	}
	private void initTekst() throws IOException{
		
		InputStream tekststream = getClass().getResourceAsStream(Co.HELPPATH); 
		InputStreamReader isr = new InputStreamReader(tekststream);
		BufferedReader reader = new BufferedReader(isr);
		
		String in = "";
		ArrayList<String> nytekst = new ArrayList<String>();
		while(in != null){
			in = reader.readLine();
			if(in == null || in.equals("")){
				tekst.add(nytekst);
				nytekst = new ArrayList<String>();
			}else{
				nytekst.add(in);
			}
		}
		
//		ArrayList<Arrow> piler1 = new ArrayList<Arrow>();
//		piler1.add(new Arrow(354, 280, 670, 55));
//		piler1.add(new Arrow(238, 296, 670, 125));
//		piler1.add(new Arrow(242, 310, 690, 400));
//		
//		ArrayList<Arrow> piler2 = new ArrayList<Arrow>();
//		ArrayList<Arrow> piler3 = new ArrayList<Arrow>();
//		
//		
//		piler.add(piler1);
//		piler.add(piler2);
//		piler.add(piler3);
		
	}
}//END
