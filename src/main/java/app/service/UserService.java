package app.service;

import app.model.dto.ActorDto;
import app.model.dto.MovieDto;
import app.model.dto.RespuestaDto;
import app.model.odb.Actor;
import app.model.odb.Credencial;
import app.model.odb.Movie;
import app.model.odb.MovieList;
import app.model.odb.User;
import app.repositories.RepositorioDeUsuarios;

import org.json.JSONException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

/**
 * Created by Rodrigo on 08/04/2017.
 */
@Service
public class UserService {
	
	@Autowired
	SesionesService sesionesService;

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
    
    
    public ArrayList<User> obtenerUsuarios() {
    	return this.getRepositorio().getUsers();
    }
    
    
    public RespuestaDto maracarActorFavorito( String token, String idActor ) throws JSONException, IOException {
    	try {
	    	User usuario = sesionesService.obtenerUsuarioPorToken(token);
	    	Optional<Actor> optActor = usuario.getFavoriteActors().stream().filter(actor -> actor.getId() == Integer.parseInt(idActor)).findFirst();
	    	RespuestaDto rta = new RespuestaDto(); 
	    	if (optActor.isPresent()) {
	    		usuario.getFavoriteActors().remove(optActor.get());
	    		rta.setCode(1);
	    		rta.setMessage("Actor favorito removido: "+ idActor);
	    	}
	    	else {
	    		usuario.getFavoriteActors().add(new Actor(idActor));
	    		rta.setCode(0);
	    		rta.setMessage("Actor favorito agregado: "+ idActor);
	    	}
	    	
	    	return rta;
    	}
    	catch (NumberFormatException e) {
    		e.printStackTrace();
    		throw new RuntimeException("El id de actor posee un formato inválido.");
    	}
	}
	
	
	public List<Actor> verActoresFavoritos( String token ) throws JSONException, IOException {
    	User usuario = sesionesService.obtenerUsuarioPorToken(token);
	    return usuario.getFavoriteActors();
	}
	
	
	public List<ActorDto> verRankingActoresFavoritos( String token ) throws JSONException, IOException {
		
		List<ActorDto> actoresFavoritosList = new ArrayList<ActorDto>(0);
		ActorDto actor = new ActorDto("123", "un Nombre");
		actor.setFavorite(true);
		actoresFavoritosList.add(actor);
		
		actor = new ActorDto("321", "otro Nombre");
		actor.setFavorite(true);
		actoresFavoritosList.add(actor);
		
		return actoresFavoritosList;
	}
	
	
	public List<Movie> verPeliculasConActoresFavoritos( String token ) throws JSONException, IOException {
		
		User usuario = sesionesService.obtenerUsuarioPorToken(token);
		ArrayList<Movie> listPelConMasDeUnActorFav = new ArrayList<Movie>(0);
		return listPelConMasDeUnActorFav;
	}

}
