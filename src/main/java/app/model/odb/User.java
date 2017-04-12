/**
 * 
 */
package app.model.odb;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Date;
import java.util.List;

/**
 * @author facundo91
 *
 */
public class User {
	private int id;
	private Credencial credencial;
	private List<MovieList> lists = new ArrayList<MovieList>();
	private List<Actor> favoriteActors = new ArrayList<Actor>();
	private Date lastAccess;


	
	public static User create(String id, List<MovieList> movieList) {
		User user = new User();
		user.setId(Integer.parseInt(id));
		user.setLists(movieList);
		return user;
	}


	
	public static User create(Credencial credencial) throws ExceptionInInitializerError {

		User user = new User();
		if(credencial.esInvalida()){
			throw new ExceptionInInitializerError(User.usuarioOContraseniaVacio());
		}
		user.setCredencial(credencial);
		return user;
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

	public Credencial getCredencial() {
		return credencial;
	}

	public void setCredencial(Credencial credencial) {
		this.credencial = credencial;
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

	public static String usuarioOContraseniaVacio() {
			return "El usuario o la contraseña no pueden estar vacíos.";
	}

	/**
	 * @return the lastAccess
	 */
	public Date getLastAccess() {
		return lastAccess;
	}

	/**
	 * @param lastAccess
	 *            the lastAccess to set
	 */
	public void setLastAccess(Date lastAccess) {
		this.lastAccess = lastAccess;
	}

}
