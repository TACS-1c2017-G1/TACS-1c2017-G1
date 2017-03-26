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
	public List<Image> getBackdrops() {
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
	public List<Image> getPosters() {
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
	public List<Review> getReviews() {
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
		this.setReviews(jsonMovie.getString("id"),conector);
	}

	public Movie(String id) throws JSONException, IOException {
		Conector conector = new Conector();
		this.setInfo(conector.getResource2("movie", id));
		this.setCredits(id, conector);
		this.setReviews(id, conector);
		this.setImages(id, conector);
	}

	/**
	 * @param id
	 * @param conector
	 * @throws JSONException
	 * @throws IOException
	 */
	private void setImages(String id, Conector conector) throws JSONException, IOException {
		JSONObject images = conector.getResource2("movie",id+"/images");
		JSONArray backdrops = images.getJSONArray("backdrops");
        for(int i=0; i<backdrops.length() ; i++){
        	this.addBackdrop(new Image(backdrops.getJSONObject(i),this));
       }
		JSONArray posters = images.getJSONArray("posters");
        for(int i=0; i<posters.length() ; i++){
        	this.addPoster(new Image(posters.getJSONObject(i),this));
       }
	}

	private void addPoster(Image image) {
		this.getPosters().add(image);
	}

	private void addBackdrop(Image image) {
		this.getBackdrops().add(image);
	}

	/**
	 * @param id
	 * @param conector
	 * @throws JSONException
	 * @throws IOException
	 */
	private void setReviews(String id, Conector conector) throws JSONException, IOException {
		JSONArray reviews = conector.getResource2("movie",id+"/reviews").getJSONArray("results");
        for(int i=0; i<reviews.length() ; i++){
        	this.addReview(new Review(reviews.getJSONObject(i),this));
       }
	}

	private void addReview(Review review) {
		this.getReviews().add(review);
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
