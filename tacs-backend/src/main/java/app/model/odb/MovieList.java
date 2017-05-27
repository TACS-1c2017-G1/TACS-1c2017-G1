/**
 * 
 */
package app.model.odb;

import com.querydsl.core.annotations.QueryEntity;
import org.apache.commons.collections.ListUtils;
import org.mongodb.morphia.annotations.Id;
import org.springframework.data.annotation.PersistenceConstructor;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.ArrayList;
import java.util.List;

/**
 * @author facundo91
 *
 */

@QueryEntity
@Document
public class MovieList {

	@Id
	private String id;
	private String name;
	private List<Movie> movies;

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
	private void setId(String id) {
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
		if(movies == null){
			movies = new ArrayList<>();
		}
		this.movies = movies;
	}

	@PersistenceConstructor
	public MovieList() {
	}

	public static MovieList create(String name, List<Movie> movies) {
		MovieList movieList = new MovieList();
		movieList.setName(name);
		movieList.setMovies(movies);
		return movieList;
	}

	public void addMovie(Movie movie) {
		this.getMovies().add(movie);
	}

	public void removeMovie(Movie movie) {
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
		return this.getMovies().size();
	}

	public boolean isEmpty() {
		return this.getMovies().isEmpty();
	}

}
