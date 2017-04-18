/**
 * 
 */
package app.model.odb;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Date;
import java.util.List;
import java.util.concurrent.ThreadLocalRandom;

/**
 * @author facundo91
 *
 */
public class User {
	private int id = ThreadLocalRandom.current().nextInt(0, Integer.MAX_VALUE);
	private Credencial credencial;
	private List<MovieList> lists;
	private List<Actor> favoriteActors;
	private Date lastAccess;




	
	public static User create(Credencial credencial) throws ExceptionInInitializerError {

		User user = new User();
		System.out.println("user id: " + user.getId());
		if (credencial.esInvalida()) {
			throw new ExceptionInInitializerError(User.usuarioOContraseniaVacio());
		}
		user.setCredencial(credencial);
		user.setLists(new ArrayList<MovieList>());
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
	public void setId(int id) {
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
		if (lists == null) {
			lists = new ArrayList<>();
		}
		return lists;
	}

	/**
	 * @param lists
	 *            the lists to set
	 */
	public void setLists(List<MovieList> lists) {
		this.lists = lists;
	}

	/**
	 * @return the favoriteActors
	 */
	public List<Actor> getFavoriteActors() {
		if(favoriteActors == null){
			favoriteActors = new ArrayList<>();
		}
		return favoriteActors;
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

	public MovieList getList(int id_list){
		return lists.stream().filter(movieList -> movieList.getId() == id_list).findFirst().orElseThrow(() -> new RuntimeException("No existe la lista solicitada"));
	}
	
}
