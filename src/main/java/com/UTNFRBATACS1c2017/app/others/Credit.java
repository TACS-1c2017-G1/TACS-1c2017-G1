/**
 * 
 */
package com.UTNFRBATACS1c2017.app.others;

import org.json.JSONObject;

/**
 * @author facundo91
 *
 */
public class Credit {
	private int id;
	private int actorId; // just id in the TMDb API
	private int movieId;
	private String creditId;
	private String character;
	private String name;
	
	public Credit(JSONObject jsonCredit, Movie movie) {
		this.setMovieId(movie.getId());
		this.setActorId(jsonCredit.getInt("id"));
		this.setCreditId(jsonCredit.getString("credit_id"));
		this.setCharacter(jsonCredit.getString("character"));
		this.setName(jsonCredit.getString("name"));
	}
	/**
	 * @return the actorId
	 */
	public int getActorId() {
		return actorId;
	}
	/**
	 * @param actorId the actorId to set
	 */
	private void setActorId(int actorId) {
		this.actorId = actorId;
	}
	/**
	 * @return the movieId
	 */
	private int getMovieId() {
		return movieId;
	}
	/**
	 * @param movieId the movieId to set
	 */
	public void setMovieId(int movieId) {
		this.movieId = movieId;
	}
	/**
	 * @return the creditId
	 */
	private String getCreditId() {
		return creditId;
	}
	/**
	 * @param creditId the creditId to set
	 */
	public void setCreditId(String creditId) {
		this.creditId = creditId;
	}
	/**
	 * @return the id
	 */
	private int getId() {
		return id;
	}
	/**
	 * @param id the id to set
	 */
	private void setId(int id) {
		this.id = id;
	}
	/**
	 * @return the character
	 */
	public String getCharacter() {
		return character;
	}
	/**
	 * @param character the character to set
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
	 * @param name the name to set
	 */
	private void setName(String name) {
		this.name = name;
	}
}
