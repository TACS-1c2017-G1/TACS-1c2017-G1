/**
 * 
 */
package com.UTNFRBATACS1c2017.app.others;

import java.util.ArrayList;
import java.util.List;

import org.apache.commons.collections.ListUtils;

/**
 * @author facundo91
 *
 */
public class MovieList {
	private int id;
	private String name;
	private List<Movie> movies = new ArrayList<Movie>();

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
	 * @return the name
	 */
	private String getName() {
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
	 * @return the movies
	 */
	private List<Movie> getMovies() {
		return movies;
	}

	/**
	 * @param movies
	 *            the movies to set
	 */
	private void setMovies(List<Movie> movies) {
		this.movies = movies;
	}

	public MovieList(String name) {
		this.setName(name);
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
