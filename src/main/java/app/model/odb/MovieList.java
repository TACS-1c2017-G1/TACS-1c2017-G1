/**
 * 
 */
package app.model.odb;

import org.apache.commons.collections.ListUtils;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import app.model.tmdb.TMDbStatic;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

/**
 * @author facundo91
 *
 */
public class MovieList {
	private int id = 0;
	private String name = "";
	private List<Movie> movies = new ArrayList<Movie>();
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
	 * @return the movies
	 */
	public List<Movie> getMovies() {
		return movies;
	}

	/**
	 * @param movies
	 *            the movies to set
	 */
	private void setMovies(List<Movie> movies) {
		this.movies = movies;
	}

	public MovieList() {
	}

	public static MovieList create(String name, List<Movie> movies){
		MovieList movieList = new MovieList();
		movieList.setName(name);
		movieList.setMovies(movies);
		return movieList;
	}
	
	public static MovieList create(int id) throws IOException{
		MovieList movieList = new MovieList();
		movieList.setId(id);
		movieList.setInfo();
		return movieList;
	}
	
	private void setInfo() throws IOException {
		try {
			this.setJsonResponse(TMDbStatic.getResource2("list", String.valueOf(id) ));
			this.setName(this.getJsonResponse().getString("name"));
			this.setMovies(fromJsonArrayToList(this.getJsonResponse().getJSONArray("items")));
		} catch (JSONException e) {
			throw new JSONException(e.toString());
		} finally {

		}
		
	}
	
	private List<Movie> fromJsonArrayToList(JSONArray jArray) throws JSONException, IOException {
		List<Movie> listMovie = new ArrayList<Movie>();
		if (jArray != null) {
			for (int i = 0; i < jArray.length(); i++) {
				JSONObject jsonMovie = jArray.getJSONObject(i);
				int movieId = jsonMovie.getInt("id");
				String movieName = jsonMovie.getString("title");
				Movie movie = Movie.create(movieId,movieName);
				listMovie.add(movie);
			}
		}
		return listMovie;
	}

	public void addMovie(Movie movie) {
		// TODO Auto-generated method stub
		this.getMovies().add(movie);
	}

	public void removeMovie(Movie movie) {
		// TODO Auto-generated method stub
		this.getMovies().remove(movie);
	}

	public void list() {
		// TODO Auto-generated method stub

	}

	public List<Movie> intersectionWith(MovieList movieList2) {
		// TODO Test
		List<Movie> intersection = new ArrayList<Movie>(
				ListUtils.intersection(this.getMovies(), movieList2.getMovies()));
		return intersection;
	}

	public void rankActors() {
		// TODO Auto-generated method stub
	}

	public int size() {
		// TODO Auto-generated method stub
		return this.getMovies().size();
	}

	public boolean isEmpty() {
		// TODO Auto-generated method stub
		return this.getMovies().isEmpty();
	}

	/**
	 * @return the jsonResponse
	 */
	private JSONObject getJsonResponse() {
		return jsonResponse;
	}

	/**
	 * @param jsonResponse the jsonResponse to set
	 */
	public void setJsonResponse(JSONObject jsonResponse) {
		this.jsonResponse = jsonResponse;
	}

}
