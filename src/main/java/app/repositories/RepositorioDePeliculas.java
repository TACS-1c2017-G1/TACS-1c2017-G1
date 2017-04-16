package app.repositories;

import java.util.ArrayList;

import app.model.odb.Movie;

public class RepositorioDePeliculas implements IRepositorio<Movie>{
	
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

}
