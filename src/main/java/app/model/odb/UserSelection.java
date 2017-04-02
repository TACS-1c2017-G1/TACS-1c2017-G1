package app.model.odb;

public class UserSelection {

	private User user1;
	private User user2;
	
	public UserSelection(){
		user1 = new User("100", "AEC");
		user1.addList(new MovieList("Lista1"));
		user2 = new User("150", "WOC");
		user2.addList(new MovieList("Lista2"));
	}
	
	public User getUser1() {
		return user1;
	}
	public void setUser1(User user1) {
		this.user1 = user1;
	}
	public User getUser2() {
		return user2;
	}
	public void setUser2(User user2) {
		this.user2 = user2;
	}
	
	
}
