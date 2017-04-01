package app.model.odb;

import java.io.IOException;
import java.util.Calendar;
import java.util.Date;

import org.json.JSONException;

public class UserView {
	private Date lastAccess;
	private User user;
	
	public UserView(String id) throws JSONException, IOException{
		user = new User(id,"AEC");
		MovieList movieList = new MovieList("Lista1");
		movieList.addMovie(new Movie("200"));
		user.addList(movieList);
		user.createList("Lista2");
		user.markActorAsFavorite(new Actor("200"));
		lastAccess = Calendar.getInstance().getTime();
	}
	
	public Date getLastAccess() {
		return lastAccess;
	}
	private void setLastAccess(Date lastAccess) {
		this.lastAccess = lastAccess;
	}
	public User getUser() {
		return user;
	}
	private void setUser(User user) {
		this.user = user;
	}
	
	
}
