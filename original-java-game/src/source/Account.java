package source;

import java.util.HashMap;


public class Account {

	private HashMap<String, Integer> prices = new HashMap<String, Integer>();
	
	int balance;
	
	public Account(int startbalance) {
		balance = startbalance;
		
		prices.put(Co.NORMALTYPE, 80);
		prices.put(Co.POISONTYPE, 70);
		prices.put(Co.AREATYPE, 80);
		prices.put(Co.SPREADTYPE, 80);
		prices.put(Co.LIGHTNINGTYPE, 50);
		prices.put(Co.RUNESTONETYPE, 50);
	}
	
	public boolean canAfford(String type){
		int amount = prices.get(type);
		
		if(balance >= amount && amount >= 0){
			return true;
		}
		return false;
	}
	public int pricefor(String type){
		return prices.get(type);
	}
	public void payfor(String type){
		withdraw(prices.get(type));
		prices.put(type, prices.get(type) + 10);
	}
	
	public void deposit(int amount) {
		if(amount >= 0){
			balance += amount;
		}
	}
	public boolean checkAmount(int amount){
		if(amount >= 0 && balance - amount >= 0){
			return true;
		}
		return false;
	}
	public int getBalance(){
		return balance;
	}
	public void withdraw(int amount) {
		if(balance >= amount && amount >= 0){
			balance -= amount;
		}
	}
}//END
