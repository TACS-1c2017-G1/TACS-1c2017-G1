/**
 * 
 */
package app.model.odb;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import org.mongodb.morphia.annotations.Id;
import org.springframework.data.annotation.PersistenceConstructor;
import org.springframework.data.mongodb.core.mapping.Document;

import com.querydsl.core.annotations.QueryEntity;

/**
 * @author facundo91
 *
 */

@QueryEntity
@Document
public class User {

	@Id
	private String id;

	private List<MovieList> lists;
	private List<Actor> favoriteActors;
	private Date lastAccess;
	private Boolean isAdmin;
	private String username;
	private String password;
	public static final String SALT = "TMDB-G1";

	public String getUsername() {
		return username;
	}

	public void setUsername(String username) {
		this.username = username;
	}

	public String getPassword() {
		return password;
	}

	public void setPassword(String password) {
		this.password = password;
	}

	@PersistenceConstructor
	public User() {}


	public static User create(Credencial credencial, Boolean esAdmin) throws ExceptionInInitializerError {
		User user = new User();
		if (credencial.esInvalida()) {
			throw new ExceptionInInitializerError(User.usuarioOContraseniaVacio());
		}
		user.setUsername(credencial.getUsername());
		String saltedPassword = SALT + credencial.getPassword();
		String hashedPassword = TokenGenerator.generarHash(saltedPassword);
		user.setPassword(hashedPassword);
		user.setLists(new ArrayList<MovieList>());
		user.setAdmin(esAdmin);
		return user;
	}


	/**
	 * @return the id
	 */
	public String getId() {
		return id;
	}

	/**
	 * @param id
	 *            the id to set
	 */
	public void setId(String id) {
		this.id = id;
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
	
	public void setFavoriteActors(List<Actor> actores) {
		this.favoriteActors = actores;
	}


	public void createList(String name) {
		this.getLists().add(MovieList.create(name, new ArrayList<Movie>()));
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

	public MovieList getList(MovieList list){

		return lists.stream().filter(movieList -> movieList.getId().equals(list.getId())).findFirst().orElseThrow(() -> new RuntimeException("No existe la lista solicitada"));
	}

	public Boolean getAdmin() {
		return isAdmin;
	}

	public void setAdmin(Boolean admin) {
		isAdmin = admin;
	}
}
