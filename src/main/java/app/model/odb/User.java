/**
 * 
 */
package app.model.odb;

import java.io.IOException;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import app.model.tmdb.TMDbStatic;

/**
 * @author facundo91
 *
 */
public class User {
	private int id;
	private String name;
	private List<MovieList> lists = new ArrayList<MovieList>();
	private List<Actor> favoriteActors = new ArrayList<Actor>();
	private JSONObject jsonResponse;

	public static User create(String id, String name, List<MovieList> movieList) {

		User user = new User();
		user.setId(Integer.parseInt(id));
		user.setName(name);
		user.setLists(movieList);
		return user;
	}

	public static User create(String id) throws IOException {
		User user = new User();
		user.setLists();
		return user;
	}

	private void setLists() throws IOException {
		try {
			this.setJsonResponse(TMDbStatic.getResource2("account", id + "/lists"));
			this.setLists(fromJsonArrayToList(this.getJsonResponse().getJSONArray("lists")));
		} catch (JSONException e) {
			throw new JSONException(e.toString());
		} finally {

		}

	}

	private List<MovieList> fromJsonArrayToList(JSONArray jArray) throws JSONException, IOException {
		List<MovieList> listMovieList = new ArrayList<MovieList>();
		if (jArray != null) {
			for (int i = 0; i < jArray.length(); i++) {
				JSONObject jsonMovieList = jArray.getJSONObject(i);
				String listName = jsonMovieList.getString("name");
				JSONArray jsonMovies = jsonMovieList.getJSONArray("movies");
				List<Movie> movies = new ArrayList<Movie>();
				for (int j = 0; j < jsonMovies.length(); j++) {
					JSONObject jsonMovie = jsonMovies.getJSONObject(j);
					Movie movie = new Movie(jsonMovie.getString("id"));
					movies.add(movie);
				}
				MovieList movieList = MovieList.create(listName, movies);
				listMovieList.add(movieList);
			}
		}
		return listMovieList;
	}

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
	private void setName(String name) {
		this.name = name;
	}

	/**
	 * @return the lists
	 */
	public List<MovieList> getLists() {
		return lists;
	}

	/**
	 * @param lists
	 *            the lists to set
	 */
	private void setLists(List<MovieList> lists) {
		this.lists = lists;
	}

	/**
	 * @return the favoriteActors
	 */
	public List<Actor> getFavoriteActors() {
		return favoriteActors;
	}

	/**
	 * @param favoriteActors
	 *            the favoriteActors to set
	 */
	private void setFavoriteActors(List<Actor> favoriteActors) {
		this.favoriteActors = favoriteActors;
	}

	public JSONObject getJsonResponse() {
		return jsonResponse;
	}

	public void setJsonResponse(JSONObject jsonResponse) {
		this.jsonResponse = jsonResponse;
	}

	public void createList(String name) {
		this.getLists().add(MovieList.create(name, Arrays.asList()));
	}

	public void addList(MovieList movieList) {
		this.getLists().add(movieList);
	}

	public void deleteList(MovieList movieList) {
		// TODO validate that the movieList is in lists.
		this.getLists().remove(movieList);
	}

	public void addToList(MovieList movieList, Movie movie) {
		// TODO validate that the movieList is in lists.
		movieList.addMovie(movie);
	}

	public void removeFromList(MovieList movieList, Movie movie) {
		// TODO validate that the movieList is in lists.
		movieList.removeMovie(movie);
	}

	public void listList(MovieList movieList) {
		// TODO validate that the movieList is in lists.
		movieList.list();
	}

	public List<Movie> intersectionBetweenLists(MovieList movieList1, MovieList movieList2) {
		return movieList1.intersectionWith(movieList2);
	}

	public void rankActorsInAList(MovieList list) {
		list.rankActors();
	}

	public void search(String query) {
		// TODO
	}

	public void searchMovie(String query) {
		// TODO
	}

	public void searchActor(String query) {
		// TODO
	}

	public void markActorAsFavorite(Actor actor) {
		this.getFavoriteActors().add(actor);
	}

	public void unmarkActorAsFavorite(Actor actor) {
		this.getFavoriteActors().remove(actor);
	}

	public void listFavorites() {
		// TODO
	}

	public void listMoviesWithMoreThanOneFavoriteActor() {
		// TODO
	}

	public void showMovieDetails(Movie movie) {
		movie.showDetails();
	}

	public void showActorDetails(Actor actor) {
		actor.showDetails();
	}

}
