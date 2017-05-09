package app.repositories;

import app.model.odb.Movie;
import app.model.odb.MovieList;

import org.springframework.stereotype.Repository;

import java.util.ArrayList;

@Repository
public class RepositorioDePeliculas implements IRepositorio<Movie> {

	private static RepositorioDePeliculas ourInstance = new RepositorioDePeliculas();

	public static RepositorioDePeliculas getInstance() {
		return ourInstance;
	}

	private static ArrayList<Movie> peliculas;

	private RepositorioDePeliculas() {
		peliculas = new ArrayList<Movie>();
	}

	@Override
	public void insert(Movie movie) {
		peliculas.add(movie);
	}

	@Override
	public void update(Movie object) {
		// TODO Auto-generated method stub

	}

	@Override
	public void delete(Movie object) {
		// TODO Auto-generated method stub

	}
	
	public Movie search(int idBusqueda) {
		return peliculas.stream().filter(movie -> movie.getId() == idBusqueda).findFirst().orElse(null);
	}

}
