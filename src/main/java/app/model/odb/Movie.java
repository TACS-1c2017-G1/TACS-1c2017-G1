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
public class Movie {
	private int id;
	private String title;
	private String overview;
	private List<Credit> cast = new ArrayList<Credit>();
	private List<Image> backdrops = new ArrayList<Image>();
	private List<Image> posters = new ArrayList<Image>();
	private List<Review> reviews = new ArrayList<Review>();
	private JSONObject jsonResponse;

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
	public List<Credit> getCast() {
		return cast;
	}

	/**
	 * @return the backdrops
	 */
	public List<Image> getBackdrops() {
		return backdrops;
	}

	/**
	 * @return the posters
	 */
	public List<Image> getPosters() {
		return posters;
	}

	/**
	 * @return the reviews
	 */
	public List<Review> getReviews() {
		return reviews;
	}

	public void setInfo() {
		try {
			this.setId(this.getJsonResponse().getInt("id"));
			this.setTitle(this.getJsonResponse().getString("title"));
			this.setOverview(this.getJsonResponse().getString("overview"));
		} catch (JSONException e) {
			System.out.print(e);
		}
	}

	public Movie(JSONObject jsonMovie) throws JSONException, IOException {
		this.setJsonResponse(TMDbStatic.getResource2("movie", jsonMovie.getString("id")));
		this.setInfo();
	}

	//Constructor para testing
	public Movie(String id, String nombre){
		this.setId(Integer.parseInt(id));
		this.setTitle(nombre);
	}
	
	public Movie(String id) throws JSONException, IOException {
		this.setJsonResponse(TMDbStatic.getResource2("movie", id));
		try {
			this.setInfo();
			this.setCredits();
			this.setReviews();
			this.setImages();
		} catch (Exception e) {
			throw new JSONException("not found");
		} finally {

		}
	}

	/**
	 * @param id
	 * @throws JSONException
	 * @throws IOException
	 */
	private void setImages() throws JSONException, IOException {
		JSONObject images = TMDbStatic.getResource2("movie", this.getId() + "/images");
		JSONArray backdrops = images.getJSONArray("backdrops");
		for (int i = 0; i < backdrops.length(); i++) {
			this.addBackdrop(new Image(backdrops.getJSONObject(i), this));
		}
		JSONArray posters = images.getJSONArray("posters");
		for (int i = 0; i < posters.length(); i++) {
			this.addPoster(new Image(posters.getJSONObject(i), this));
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
	 * @throws JSONException
	 * @throws IOException
	 */
	private void setReviews() throws JSONException, IOException {
		JSONArray reviews = TMDbStatic.getResource2("movie", this.getId() + "/reviews").getJSONArray("results");
		for (int i = 0; i < reviews.length(); i++) {
			this.addReview(new Review(reviews.getJSONObject(i), this));
		}
	}

	private void addReview(Review review) {
		this.getReviews().add(review);
	}

	/**
	 * @param id
	 * @throws JSONException
	 * @throws IOException
	 */
	private void setCredits() throws JSONException, IOException {
		JSONArray cast = TMDbStatic.getResource2("movie", this.getId() + "/credits").getJSONArray("cast");
		for (int i = 0; i < cast.length(); i++) {
			this.addCredit(new Credit(cast.getJSONObject(i), this));
		}
	}

	private void addCredit(Credit credit) {
		this.getCast().add(credit);
	}

	public Movie() {
		super();
	}

	public void showDetails() {
		// TODO Auto-generated method stub

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

	public static Movie create(int movieId, String movieName) {
		// TODO Auto-generated method stub
		Movie movie = new Movie();
		movie.setId(movieId);
		movie.setTitle(movieName);
		return movie;
	}

}
