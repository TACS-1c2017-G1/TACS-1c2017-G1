package app.service;

import app.model.odb.Movie;
import app.model.odb.MovieList;
import app.model.odb.User;
import app.repositories.RepositorioDeListas;
import app.repositories.RepositorioDePeliculasEnListas;
import app.repositories.RepositorioDeUsuarios;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class ListasService {
	
	@Autowired
	SesionesService sesionesService;
	
	@Autowired
	RepositorioDeListas repositorioDeListas;

	@Autowired
	RepositorioDeUsuarios repositorioDeUsuarios;

	@Autowired
	RepositorioDePeliculasEnListas repositorioDePeliculasEnListas;

	public List<Movie> interseccionEntre(String idLista1, String idLista2, String token) {
		return this.consultarLista(idLista1, token).intersectionWith(this.consultarLista(idLista2, token));
	}

	public MovieList crearLista(String name, String token) {
		MovieList list = MovieList.create(name,new ArrayList<>());
		User usuario =sesionesService.obtenerUsuarioPorToken(token);
		usuario.addList(list);
		repositorioDeListas.insert(list);
		repositorioDeUsuarios.save(usuario);
		return list;
	}

	public void agregarItem(Movie movie, String id_list, String token) {
		this.consultarLista(id_list, token);
		MovieList lista = repositorioDeListas.findOne(id_list);
		repositorioDePeliculasEnListas.save(movie);
		lista.addMovie(movie);
		repositorioDeListas.save(lista);
	}

	public void eliminarItem(String id_pelicula, String id_list, String token) {
		MovieList lista =this.consultarLista(id_list, token);
		Movie movie = repositorioDePeliculasEnListas.findOne(id_pelicula);
		lista.removeMovie(movie);
		repositorioDeListas.save(lista);
	}
	
	public MovieList consultarLista(String id_list, String token){
		MovieList list = repositorioDeListas.findOne(id_list);
		return sesionesService.obtenerUsuarioPorToken(token).getList(list);
	}
}
