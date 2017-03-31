package app.model.odb;

import java.util.Calendar;
import java.util.Date;

public class UserView {
	private Date lastAccess;
	private User user;
	
	public UserView(int id){
		user = new User(id,"AEC");
		lastAccess = Calendar.getInstance().getTime();
	}
	
	public Date getLastAccess() {
		return lastAccess;
	}
	public void setLastAccess(Date lastAccess) {
		this.lastAccess = lastAccess;
	}
	public User getUser() {
		return user;
	}
	public void setUser(User user) {
		this.user = user;
	}
	
	
}
