/**
 * 
 */
package com.UTNFRBATACS1c2017.app.others;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import com.UTNFRBATACS1c2017.app.helpers.Conector;

/**
 * @author facundo91
 *
 */
public class Movie {
	private int id;
	private String title;
	private String overview;
	private List<Credit> cast = new ArrayList<Credit>();
	private List<Image> backdrops = new ArrayList<Image>();
	private List<Image> posters = new ArrayList<Image>();
	private List<Review> reviews = new ArrayList<Review>();

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
	 * @return the title
	 */
	public String getTitle() {
		return title;
	}

	/**
	 * @param title
	 *            the title to set
	 */
	private void setTitle(String title) {
		this.title = title;
	}

	/**
	 * @return the overview
	 */
	public String getOverview() {
		return overview;
	}

	/**
	 * @param overview
	 *            the overview to set
	 */
	private void setOverview(String overview) {
		this.overview = overview;
	}

	/**
	 * @return the cast
	 */
	List<Credit> getCast() {
		return cast;
	}

	/**
	 * @param cast
	 *            the cast to set
	 */
	private void setCast(List<Credit> cast) {
		this.cast = cast;
	}

	/**
	 * @return the backdrops
	 */
	private List<Image> getBackdrops() {
		return backdrops;
	}

	/**
	 * @param backdrops
	 *            the backdrops to set
	 */
	private void setBackdrops(List<Image> backdrops) {
		this.backdrops = backdrops;
	}

	/**
	 * @return the posters
	 */
	private List<Image> getPosters() {
		return posters;
	}

	/**
	 * @param posters
	 *            the posters to set
	 */
	private void setPosters(List<Image> posters) {
		this.posters = posters;
	}

	/**
	 * @return the reviews
	 */
	private List<Review> getReviews() {
		return reviews;
	}

	/**
	 * @param reviews
	 *            the reviews to set
	 */
	private void setReviews(List<Review> reviews) {
		this.reviews = reviews;
	}

	private void setInfo(JSONObject jsonMovie) {
		try {
			this.setId(jsonMovie.getInt("id"));
			this.setTitle(jsonMovie.getString("title"));
			this.setOverview(jsonMovie.getString("overview"));
		} catch (JSONException e) {
			System.out.print(e);
		}
	}

	public Movie(JSONObject jsonMovie) throws JSONException, IOException {
		Conector conector = new Conector();
		this.setInfo(jsonMovie);
		this.setCredits(jsonMovie.getString("id"),conector);
	}

	public Movie(String id) throws JSONException, IOException {
		Conector conector = new Conector();
		this.setInfo(conector.getResource2("movie", id));
		this.setCredits(id, conector);
	}

	/**
	 * @param id
	 * @param conector
	 * @throws JSONException
	 * @throws IOException
	 */
	private void setCredits(String id, Conector conector) throws JSONException, IOException {
		JSONArray cast = conector.getResource2("movie",id+"/credits").getJSONArray("cast");
        for(int i=0; i<cast.length() ; i++){
        	this.addCredit(new Credit(cast.getJSONObject(i),this));
       }
	}

	private void addCredit(Credit credit) {
		this.getCast().add(credit);
		
	}

	public Movie() {
		// TODO Auto-generated constructor stub
	}

	public void showDetails() {
		// TODO Auto-generated method stub

	}

}
