/**
 * 
 */
package app.model.odb;

import com.querydsl.core.annotations.QueryEntity;
import org.json.JSONObject;
import org.mongodb.morphia.annotations.Id;
import org.springframework.data.annotation.PersistenceConstructor;
import org.springframework.data.mongodb.core.mapping.Document;

/**
 * @author facundo91
 *
 */
@QueryEntity
@Document
public class ActorEnPelicula {

	@Id
	private int id;
	private String actorId; // just id in the TMDb API
	private String movieId;
	private String movieTitle;
	private String creditId;
	private String character;
	private String name;

	public ActorEnPelicula(JSONObject jsonCredit, Movie movie) {
		this.setMovieId(movie.getId());
		this.setActorId(String.valueOf(jsonCredit.getInt("id")));
		this.setCreditId(jsonCredit.getString("credit_id"));
		this.setCharacter(jsonCredit.getString("character"));
		this.setName(jsonCredit.getString("name"));
		this.setMovieTitle(movie.getTitle());
	}

	public ActorEnPelicula(JSONObject jsonCredit, Actor actor) {
		this.setMovieId(String.valueOf(jsonCredit.getInt("id")));
		this.setActorId(actor.getId());
		this.setCreditId(jsonCredit.getString("credit_id"));
		this.setCharacter(jsonCredit.getString("character"));
		this.setName(actor.getName());
		this.setMovieTitle(jsonCredit.getString("title"));
	}

	@PersistenceConstructor
	public ActorEnPelicula(String actorId,String movieId) {
		super();
		this.movieId = movieId;
		this.actorId = actorId;
	}

	/**
	 * @return the actorId
	 */
	public String getActorId() {
		return actorId;
	}

	/**
	 * @param actorId
	 *            the actorId to set
	 */
	private void setActorId(String actorId) {
		this.actorId = actorId;
	}

	/**
	 * @return the movieId
	 */
	public String getMovieId() {
		return movieId;
	}

	/**
	 * @param movieId
	 *            the movieId to set
	 */
	public void setMovieId(String movieId) {
		this.movieId = movieId;
	}

	/**
	 * @param creditId
	 *            the creditId to set
	 */
	public void setCreditId(String creditId) {
		this.creditId = creditId;
	}

	/**
	 * @return the character
	 */
	public String getCharacter() {
		return character;
	}

	/**
	 * @param character
	 *            the character to set
	 */
	private void setCharacter(String character) {
		this.character = character;
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
	 * @return the movieTitle
	 */
	public String getMovieTitle() {
		return movieTitle;
	}

	/**
	 * @param movieTitle
	 *            the movieTitle to set
	 */
	private void setMovieTitle(String movieTitle) {
		this.movieTitle = movieTitle;
	}
}
