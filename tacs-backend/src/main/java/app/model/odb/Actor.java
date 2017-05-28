/**
 * 
 */
package app.model.odb;

import app.model.tmdb.TMDbStatic;
import com.querydsl.core.annotations.QueryEntity;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;
import org.mongodb.morphia.annotations.Id;
import org.springframework.data.annotation.PersistenceConstructor;
import org.springframework.data.mongodb.core.mapping.Document;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

/**
 * @author facundo91
 *
 */
@QueryEntity
@Document
public class Actor {

	@Id
	private String id;
	private String name;
	private List<Image> profiles = new ArrayList<Image>();
	private List<ActorEnPelicula> actorEnPeliculas = new ArrayList<ActorEnPelicula>();
	private String bio;
	private JSONObject jsonResponse;
	private int statusCode;
	private String statusMessage;
	private int scoreRank = 0;

	public Actor(String id) throws JSONException, IOException {
		this.setJsonResponse(TMDbStatic.getResource2("person", id));
		try {
			this.setId(String.valueOf(this.getJsonResponse().getInt("id")));
			this.setName(this.getJsonResponse().getString("name"));
			this.setBio(this.getJsonResponse().getString("biography"));
			this.setImages(id);
			this.setActorEnPeliculas(id);
		} catch (JSONException e) {
			this.setStatusCode(this.getJsonResponse().getInt("status_code"));
			this.setStatusMessage(this.getJsonResponse().getString("status_message"));
		}
	}

	public JSONObject actorJson(String id) throws JSONException, IOException {
		this.setJsonResponse(TMDbStatic.getResource2("person", id));
		this.setImages(id);
		this.setActorEnPeliculas(id);
		return this.getJsonResponse();
	}

	@PersistenceConstructor
	public Actor(){
		super();
	}

	public static Actor create(String nombre) {
		Actor actor = new Actor();
		actor.setName(nombre);
		return actor;
	}

	private void setImages(String id) throws JSONException, IOException {
		JSONArray imagesJson = TMDbStatic.getResource2("person", id + "/images").getJSONArray("profiles");
		for (int i = 0; i < imagesJson.length(); i++) {
			this.addProfile(new Image(imagesJson.getJSONObject(i), this));
		}
	}

	private void setActorEnPeliculas(String id) throws JSONException, IOException {
		JSONArray creditsJson = TMDbStatic.getResource2("person", id + "/movie_credits").getJSONArray("cast");
		for (int i = 0; i < creditsJson.length(); i++) {
			this.addCredit(new ActorEnPelicula(creditsJson.getJSONObject(i), this));
		}
	}

	public void addCredit(ActorEnPelicula actorEnPelicula) {
		this.getActorEnPeliculas().add(actorEnPelicula);
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
	public String getId() {
		return id;
	}

	/**
	 * @param id
	 *            the id to set
	 */
	public void setId(String id) {
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
	public void setName(String name) {
		this.name = name;
	}

	/**
	 * @return the profiles
	 */
	public List<Image> getProfiles() {
		return profiles;
	}

	/**
	 * @return the actorEnPeliculas
	 */
	public List<ActorEnPelicula> getActorEnPeliculas() {
		return actorEnPeliculas;
	}

	public void showDetails() {
		// TODO Auto-generated method stub

	}

	public void setInfo(JSONObject jsonActor) {
		try {
			this.setId(jsonActor.getString("id"));
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

	/*
	 * (non-Javadoc)
	 * 
	 * @see java.lang.Object#equals(java.lang.Object)
	 */
	@Override
	public boolean equals(Object obj) {
		if (this == obj)
			return true;
		if (obj == null)
			return false;
		if (!(obj instanceof Actor))
			return false;
		Actor other = (Actor) obj;
		if (id != other.id)
			return false;
		return true;
	}

	public int getScoreRank() {
		return scoreRank;
	}

	public void resetScoreRak() {
		this.scoreRank = 0;
	}
	
	public void incScoreRank() {
		this.scoreRank++;
	}

}
