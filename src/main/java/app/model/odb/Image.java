/**
 * 
 */
package app.model.odb;

import org.json.JSONObject;

/**
 * @author facundo91
 *
 */
// http://image.tmdb.org/t/p/w185/nBNZadXqJSdt05SHLqgT0HuC5Gm.jpg
public class Image {
	private int id;
	private int movieId;
	private int actorId;
	private String baseUrl = "http://image.tmdb.org/t/p/";
	private int size;
	private String filePath;

	/**
	 * @return the id
	 */
	private int getId() {
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
	 * @return the movieId
	 */
	private int getMovieId() {
		return movieId;
	}

	/**
	 * @param movieId
	 *            the movieId to set
	 */
	private void setMovieId(int movieId) {
		this.movieId = movieId;
	}

	/**
	 * @return the baseUrl
	 */
	public String getBaseUrl() {
		return baseUrl;
	}

	/**
	 * @param baseUrl
	 *            the baseUrl to set
	 */
	private void setBaseUrl(String baseUrl) {
		this.baseUrl = baseUrl;
	}

	/**
	 * @return the size
	 */
	private int getSize() {
		return size;
	}

	/**
	 * @param size
	 *            the size to set
	 */
	private void setSize(int size) {
		this.size = size;
	}

	/**
	 * @return the filePath
	 */
	public String getFilePath() {
		return filePath;
	}

	/**
	 * @return the actorId
	 */
	private int getActorId() {
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
	 * @param filePath
	 *            the filePath to set
	 */
	private void setFilePath(String filePath) {
		this.filePath = filePath;
	}

	public Image(JSONObject jsonImage, Movie movie) {
		this.setMovieId(movie.getId());
		this.setFilePath(jsonImage.getString("file_path"));
	}

	public Image(JSONObject jsonImage, Actor actor) {
		this.setActorId(actor.getId());
		this.setFilePath(jsonImage.getString("file_path"));
	}
}
