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
	private String id = TokenGenerator.generarIdString();
	private String movieId;
	private String actorId;
	private String baseUrl = "http://image.tmdb.org/t/p/";
	private int size;
	private String filePath;

	/**
	 * @param movieId
	 *            the movieId to set
	 */
	private void setMovieId(String movieId) {
		this.movieId = movieId;
	}

	/**
	 * @return the baseUrl
	 */
	public String getBaseUrl() {
		return baseUrl;
	}

	/**
	 * @return the filePath
	 */
	public String getFilePath() {
		return filePath;
	}

	/**
	 * @param actorId
	 *            the actorId to set
	 */
	public void setActorId(String actorId) {
		this.actorId = actorId;
	}

	/**
	 * @param filePath
	 *            the filePath to set
	 */
	public void setFilePath(String filePath) {
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

	public Image() {
		// TODO Auto-generated constructor stub
	}
}
