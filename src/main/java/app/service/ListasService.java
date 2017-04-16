package app.service;

import app.model.odb.Movie;
import app.model.odb.MovieList;
import app.model.tmdb.TMDbStatic;
import app.repositories.RepositorioDeListas;
import app.repositories.RepositorioDePeliculas;

import org.json.JSONObject;
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
	private RepositorioDePeliculas getRepositorioPelicuas(){
		return RepositorioDePeliculas.getInstance();
	}

	public List<Movie> interseccionEntre(int idLista1, int idLista2, String token) {
		return this.consultarLista(idLista1, token).intersectionWith(this.consultarLista(idLista2, token));
	}

	public void crearLista(String name) {
		MovieList list = MovieList.create(name);
		this.getRepositorioListas().insert(list);
	}

	public void agregarItem(Movie movie, int id_list, String token) {
		this.getRepositorioPelicuas().insert(movie);
		this.consultarLista(id_list, token).addMovie(movie);
		this.getRepositorioListas().update(movie, id_list);
	}
	
	public static JSONObject buscarPeliculaPorNombreJson(String query) throws Exception {
		return TMDbStatic.getResource("search/movie", query);
	}

	public void eliminarItem(Movie movie, int id_list, String token) {
		this.consultarLista(id_list, token).removeMovie(movie);
		this.getRepositorioListas().update(movie, id_list);
	}
	
	public MovieList consultarLista(int id_list, String token){
		return sesionesService.obtenerUsuarioPorToken(token).getList(id_list);
	}
}
