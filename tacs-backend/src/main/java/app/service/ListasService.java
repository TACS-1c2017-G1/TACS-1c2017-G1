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
import java.util.Objects;
import java.util.stream.Collectors;
import java.util.stream.Stream;

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
		MovieList list = findMovieList(name);
        if (list==null) {
            list = MovieList.create(name, new ArrayList<>());
            User usuario = sesionesService.obtenerUsuarioPorToken(token);
            usuario.addList(list);
            repositorioDeListas.insert(list);
            repositorioDeUsuarios.save(usuario);
        }
		return list;
	}

    public MovieList findMovieList(String name) {
        List<MovieList> listas = repositorioDeListas.findAll();
		return listas.stream().filter(movieList -> Objects.equals(movieList.getName(), name)).findFirst().orElse(null);
	}

	public void agregarItem(Movie movie, String id_list, String token) {
		consultarLista(id_list, token);
		MovieList lista = repositorioDeListas.findOne(id_list);
		if(findMovie(movie, lista)==null){
			repositorioDePeliculasEnListas.save(movie);
			lista.addMovie(movie);
			repositorioDeListas.save(lista);
		}
	}

	private Movie findMovie(Movie movie, MovieList lista) {
		return lista.getMovies().stream().filter(peli -> Objects.equals(peli.getId(), movie.getId())).findFirst().orElse(null);
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
