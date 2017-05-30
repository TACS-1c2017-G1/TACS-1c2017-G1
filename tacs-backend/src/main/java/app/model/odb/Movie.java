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
public class Movie {

	@Id
	private String id;
	private String title;
	private String overview;
	private List<ActorEnPelicula> cast = new ArrayList<ActorEnPelicula>();
	private List<Image> backdrops = new ArrayList<Image>();
	private List<Image> posters = new ArrayList<Image>();
	private List<Review> reviews = new ArrayList<Review>();
	private JSONObject jsonResponse;

	public String getId() {
		return id;
	}

	public void setId(String id) {
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
	public List<ActorEnPelicula> getCast() {
		return cast;
	}
	
	public void setCast(List<ActorEnPelicula> cast) {
		this.cast = cast;
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
//	public List<Review> getReviews() {
//		return reviews;
//	}

	public void setInfo() {
		try {
			this.setId(String.valueOf(this.getJsonResponse().getInt("id")));
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

	public Movie(String id) {
		try {
			this.setJsonResponse(TMDbStatic.getResource2("movie", id));
			this.id = id;
			this.setInfoCreditsReviewsImages();
		} catch (Exception e) {
			throw new JSONException("not found");
		} finally {

		}
	}

	public void setInfoCreditsReviewsImages() throws IOException {
		this.setJsonResponse(TMDbStatic.getResource2("movie", id));
		this.setInfo();
		this.setCredits();
//		this.setReviews();
		this.setImages();
	}


	/**
	 * @param
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
	 * @throws JSONException
	 * @throws IOException
	 */
//	private void setReviews() throws JSONException, IOException {
//		JSONArray reviews = TMDbStatic.getResource2("movie", this.getId() + "/reviews").getJSONArray("results");
//		for (int i = 0; i < reviews.length(); i++) {
////			this.addReview(new Review(reviews.getJSONObject(i), this));
//		}
//	}
//
//	private void addReview(Review review) {
//		this.getReviews().add(review);
//	}

	/**
	 * @throws JSONException
	 * @throws IOException
	 */
	private void setCredits() throws JSONException, IOException {
		JSONArray cast = TMDbStatic.getResource2("movie", this.getId() + "/credits").getJSONArray("cast");
		for (int i = 0; i < cast.length(); i++) {
			this.addCredit(new ActorEnPelicula(cast.getJSONObject(i), this));
		}
	}

	private void addCredit(ActorEnPelicula actorEnPelicula) {
		this.getCast().add(actorEnPelicula);
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

	public static Movie create(String movieName) {
		Movie movie = new Movie();
		movie.setTitle(movieName);
		return movie;
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
		if (!(obj instanceof Movie))
			return false;
		Movie other = (Movie) obj;
		if (id != other.id)
			return false;
		return true;
	}

}
