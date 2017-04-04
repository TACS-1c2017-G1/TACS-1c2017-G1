/**
 * 
 */
package app.model.odb;

import org.apache.commons.collections.ListUtils;

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

}
