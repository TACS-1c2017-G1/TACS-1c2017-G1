package app.repositories;

import java.util.ArrayList;

import org.springframework.stereotype.Repository;
import app.model.odb.MovieList;

@Repository
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
    
    @Override
	public void update(MovieList lista) {
		this.delete(this.search(lista.getId()));
        this.insert(lista);
	}

	@Override
	public void delete(MovieList lista) {
		listas.remove(lista.getId());

	}

}
