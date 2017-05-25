package app.service;

import app.model.odb.Movie;
import app.model.odb.MovieList;
import app.repositories.RepositorioDeListas;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ListasService {
	
	@Autowired
	SesionesService sesionesService;
	
	private RepositorioDeListas getRepositorioListas(){
        return RepositorioDeListas.getInstance();
    }

	public List<Movie> interseccionEntre(int idLista1, int idLista2, String token) {
		return this.consultarLista(idLista1, token).intersectionWith(this.consultarLista(idLista2, token));
	}

	public MovieList crearLista(String name, String token) {
		MovieList list = getRepositorioListas().find(name);
		if (null==list){
			list = MovieList.create(name);
			sesionesService.obtenerUsuarioPorToken(token).addList(list);
			this.getRepositorioListas().insert(list);
		}
		return list;
	}

	public void agregarItem(Movie movie, int id_list, String token) {
		this.consultarLista(id_list, token);
		MovieList lista = this.getRepositorioListas().search(id_list);
		lista.addMovie(movie);
		this.getRepositorioListas().update(lista);
	}

	public void eliminarItem(Movie movie, int id_list, String token) {
		this.consultarLista(id_list, token).removeMovie(movie);
		MovieList lista = this.getRepositorioListas().search(id_list);
		lista.removeMovie(movie);
		this.getRepositorioListas().update(lista);
	}
	
	public MovieList consultarLista(int id_list, String token){
		return sesionesService.obtenerUsuarioPorToken(token).getList(id_list);
	}
}
