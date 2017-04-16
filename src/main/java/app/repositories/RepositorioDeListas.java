package app.repositories;

import java.util.ArrayList;

import app.model.odb.Movie;
import app.model.odb.MovieList;

public class RepositorioDeListas implements IRepositorio<MovieList> {
	private static RepositorioDeListas ourInstance = new RepositorioDeListas();

	public static RepositorioDeListas getInstance() {
		return ourInstance;
	}

	private ArrayList<MovieList> listas;

	private RepositorioDeListas() {
		this.listas = new ArrayList<MovieList>();
	}

	@Override
	public void insert(MovieList list) {
		if (this.search(list.getId()) == null) {
			listas.add(list);
		} else {
			throw new RuntimeException("Ya existe la lista que quiere crear");
		}
	}
	
    public MovieList search(int idBusqueda) {
        return listas.stream().filter(lista -> lista.getId() == idBusqueda).findFirst().orElse(null);
    }

    public void eliminarItem(Movie movie, int idList){
    	this.search(idList).removeMovie(movie);
    }
    
    public void agregarItem(Movie movie, int idList){
    	this.search(idList).addMovie(movie);
    }
    
	@Override
	public void update(MovieList object) {
		// TODO Auto-generated method stub

	}

	@Override
	public void delete(MovieList object) {
		// TODO Auto-generated method stub

	}
}
