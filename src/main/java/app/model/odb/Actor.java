/**
 * 
 */
package app.model.odb;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import app.model.tmdb.TMDbStatic;

/**
 * @author facundo91
 *
 */
public class Actor {
	private int id;
	private String name;
	private List<Image> profiles = new ArrayList<Image>();
	private List<Credit> credits = new ArrayList<Credit>();
	private String bio;
	private JSONObject jsonResponse;
	private int statusCode;
	private String statusMessage;

	public Actor(String id) throws JSONException, IOException {
		this.setJsonResponse(TMDbStatic.getResource2("person", id));
		try {	
			this.setId(this.getJsonResponse().getInt("id"));
			this.setName(this.getJsonResponse().getString("name"));
			this.setBio(this.getJsonResponse().getString("biography"));
			this.setImages(id);
			this.setCredits(id);
		}
		catch (JSONException e) {
			this.setStatusCode(this.getJsonResponse().getInt("status_code"));
			this.setStatusMessage(this.getJsonResponse().getString("status_message"));
		}
	}

	public JSONObject actorJson(String id) throws JSONException, IOException {
		this.setJsonResponse(TMDbStatic.getResource2("person", id));
		this.setImages(id);
		this.setCredits(id);
		return this.getJsonResponse();
	}

	public Actor() {
		// TODO Auto-generated constructor stub
	}

	private void setImages(String id) throws JSONException, IOException {
		JSONArray imagesJson = TMDbStatic.getResource2("person", id + "/images").getJSONArray("profiles");
		for (int i = 0; i < imagesJson.length(); i++) {
			this.addProfile(new Image(imagesJson.getJSONObject(i), this));
		}
	}

	private void setCredits(String id) throws JSONException, IOException {
		JSONArray creditsJson = TMDbStatic.getResource2("person", id + "/movie_credits").getJSONArray("cast");
		for (int i = 0; i < creditsJson.length(); i++) {
			this.addCredit(new Credit(creditsJson.getJSONObject(i), this));
		}
	}

	public void addCredit(Credit credit) {
		this.getCredits().add(credit);
	}

	private void addProfile(Image image) {
		this.getProfiles().add(image);
	}

	private void addProfile(String string) {
		Image profile_picture = new Image();
		profile_picture.setFilePath(string);
		profile_picture.setActorId(this.getId());
		this.getProfiles().add(profile_picture);
	}

	/**
	 * @return the id
	 */
	public int getId() {
		return id;
	}

	/**
	 * @param id
	 *            the id to set
	 */
	private void setId(int id) {
		this.id = id;
	}

	/**
	 * @return the name
	 */
	public String getName() {
		return name;
	}

	/**
	 * @param name
	 *            the name to set
	 */
	private void setName(String name) {
		this.name = name;
	}

	/**
	 * @return the profiles
	 */
	public List<Image> getProfiles() {
		return profiles;
	}

	/**
	 * @return the credits
	 */
	public List<Credit> getCredits() {
		return credits;
	}

	public void showDetails() {
		// TODO Auto-generated method stub

	}

	public void setInfo(JSONObject jsonActor) {
		try {
			this.setId(jsonActor.getInt("id"));
			this.setName(jsonActor.getString("name"));
			this.addProfile(jsonActor.getString("profile_path"));
		} catch (JSONException e) {
			System.out.print(e);
		}
	}

	/**
	 * @return the bio
	 */
	public String getBio() {
		return bio;
	}

	/**
	 * @param bio
	 *            the bio to set
	 */
	public void setBio(String bio) {
		this.bio = bio;
	}

	/**
	 * @return the jsonResponse
	 */
	private JSONObject getJsonResponse() {
		return jsonResponse;
	}

	/**
	 * @param jsonResponse
	 *            the jsonResponse to set
	 */
	private void setJsonResponse(JSONObject jsonResponse) {
		this.jsonResponse = jsonResponse;
	}

	public int getStatusCode() {
		return statusCode;
	}

	private void setStatusCode(int statusCode) {
		this.statusCode = statusCode;
	}

	public String getStatusMessage() {
		return statusMessage;
	}

	private void setStatusMessage(String statusMessage) {
		this.statusMessage = statusMessage;
	}
	
	
	

}
