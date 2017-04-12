package app.service;

import app.model.odb.Credencial;
import app.model.odb.Movie;
import app.model.odb.MovieList;
import app.model.odb.User;
import app.repositories.RepositorioDeUsuarios;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

/**
 * Created by Rodrigo on 08/04/2017.
 */
@Service
public class UserService {

    private RepositorioDeUsuarios getRepositorio(){
        return RepositorioDeUsuarios.getInstance();
    }

    public void crearNuevoUsuario(Credencial userAndPassword) throws ExceptionInInitializerError{
    	User usuarioNuevo = User.create(userAndPassword);
        this.getRepositorio().insert(usuarioNuevo);
    }

    public List<Movie> obtenerInterseccionListas(String id1, String id2) {
		User user1 = this.obtenerUsuario(id1);
		User user2 = this.obtenerUsuario(id2);
		List<MovieList> user1Lists = user1.getLists();
		List<MovieList> user2Lists = user2.getLists();
		List<Movie> interseccion = new ArrayList<Movie>();
		for (MovieList ml1:user1Lists){
			List<Movie> movies1 = ml1.getMovies();
			for (MovieList ml2:user2Lists){
				List<Movie> movies2 = ml2.getMovies();
				interseccion.addAll(movies2.stream().filter(movies1::contains).collect(Collectors.toList()));
			}
		}
		return interseccion;
	}

    public User obtenerUsuario(String id) {
		return this.getRepositorio().search(Integer.parseInt(id));
	}
}
