/**
 * 
 */
package app.model.odb;

import org.json.JSONObject;

import java.util.concurrent.ThreadLocalRandom;

/**
 * @author facundo91
 *
 */
public class ActorEnPelicula {
	private int id = ThreadLocalRandom.current().nextInt(0, Integer.MAX_VALUE);
	private int actorId; // just id in the TMDb API
	private int movieId;
	private String movieTitle;
	private String creditId;
	private String character;
	private String name;

	public ActorEnPelicula(JSONObject jsonCredit, Movie movie) {
		this.setMovieId(movie.getId());
		this.setActorId(jsonCredit.getInt("id"));
		this.setCreditId(jsonCredit.getString("credit_id"));
		this.setCharacter(jsonCredit.getString("character"));
		this.setName(jsonCredit.getString("name"));
		this.setMovieTitle(movie.getTitle());
	}

	public ActorEnPelicula(JSONObject jsonCredit, Actor actor) {
		this.setMovieId(jsonCredit.getInt("id"));
		this.setActorId(actor.getId());
		this.setCreditId(jsonCredit.getString("credit_id"));
		this.setCharacter(jsonCredit.getString("character"));
		this.setName(actor.getName());
		this.setMovieTitle(jsonCredit.getString("title"));
	}

	public ActorEnPelicula(int actorId,int movieId) {
		super();
		this.movieId = movieId;
		this.actorId = actorId;
	}

	/**
	 * @return the actorId
	 */
	public int getActorId() {
		return actorId;
	}

	/**
	 * @param actorId
	 *            the actorId to set
	 */
	private void setActorId(int actorId) {
		this.actorId = actorId;
	}

	/**
	 * @return the movieId
	 */
	public int getMovieId() {
		return movieId;
	}

	/**
	 * @param movieId
	 *            the movieId to set
	 */
	public void setMovieId(int movieId) {
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
