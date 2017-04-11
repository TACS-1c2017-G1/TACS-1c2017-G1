package app.model.odb;

import java.io.IOException;
import java.util.Date;

import org.json.JSONException;
import org.json.JSONObject;

public class UserView {
	private Date lastAccess;
	private User user;
	private JSONObject jsonResponse;
	
	/*public UserView(String id) throws JSONException, IOException{

		user = User.create(id,"AEC",new ArrayList<MovieList>());
		MovieList movieList = MovieList.create("Lista1",new ArrayList<Movie>());
		movieList.addMovie(new Movie("200"));
		user.addList(movieList);
		user.createList("Lista2");
		user.markActorAsFavorite(new Actor("200"));
		lastAccess = Calendar.getInstance().getTime();
	}*/
	
	public UserView(String id) throws JSONException, IOException{
		user = User.create(id);
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

	/**
	 * @return the jsonResponse
	 */
	public JSONObject getJsonResponse() {
		return jsonResponse;
	}

	/**
	 * @param jsonResponse the jsonResponse to set
	 */
	public void setJsonResponse(JSONObject jsonResponse) {
		this.jsonResponse = jsonResponse;
	}
	
	
}
