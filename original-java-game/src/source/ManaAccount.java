package source;

public class ManaAccount extends Account {
	
	
    public ManaAccount(int startbalance) {
		super(startbalance);
	}
    
    public void deposit(int amount) {
		if(amount >= 0 && balance < 100){
			balance += amount;
			if(balance > 100){
				balance = 100;
			}
		}
	}
}
