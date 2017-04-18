package app.service;

import java.io.IOException;
import java.util.ArrayList;
import java.util.Collections;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;
import java.util.stream.Stream;

import org.json.JSONException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import app.model.dto.RespuestaDto;
import app.model.odb.Actor;
import app.model.odb.ActorEnPelicula;
import app.model.odb.Credencial;
import app.model.odb.Movie;
import app.model.odb.MovieList;
import app.model.odb.User;
import app.repositories.RepositorioDeUsuarios;

/**
 * Created by Rodrigo on 08/04/2017.
 */
@Service
public class UserService {

    @Autowired
    SesionesService sesionesService;



    private RepositorioDeUsuarios getRepositorio() {
        return RepositorioDeUsuarios.getInstance();
    }

    public void crearNuevoUsuario(Credencial userAndPassword) throws ExceptionInInitializerError {
        User usuarioNuevo = User.create(userAndPassword);
        this.getRepositorio().insert(usuarioNuevo);
    }

    public List<Movie> obtenerInterseccionListas(String id1, String id2) {
        User user1 = this.obtenerUsuario(id1);
        User user2 = this.obtenerUsuario(id2);
        List<MovieList> user1Lists = user1.getLists();
        List<MovieList> user2Lists = user2.getLists();
        List<Movie> interseccion = new ArrayList<Movie>();
        for (MovieList ml1 : user1Lists) {
            List<Movie> movies1 = ml1.getMovies();
            for (MovieList ml2 : user2Lists) {
                List<Movie> movies2 = ml2.getMovies();
                interseccion.addAll(movies2.stream().filter(movies1::contains).collect(Collectors.toList()));
            }
        }
        return interseccion;
    }


    public User obtenerUsuario(String id) {
		User user = this.getRepositorio().search(Integer.parseInt(id));
		if(user == null){
			throw new RuntimeException("No existe el usuario con id " + id.toString());
		}
		return user;
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


	public List<Actor> verRankingActoresFavoritos( String token ) throws JSONException, IOException {

		Map<Actor,Integer> rankingActores = new HashMap<Actor,Integer>();
		List<User> usuarios = obtenerUsuarios();
		usuarios.stream().forEach(u-> {
			u.getFavoriteActors().stream().forEach(a ->{
				if (rankingActores.containsKey(a)){
					int valor = rankingActores.get(a);
					rankingActores.put(a, ++valor);
				}
				else
				{
					rankingActores.put(a, 1);
				}
			});
		});
		Stream<Map.Entry<Actor, Integer>> sorted = rankingActores.entrySet().stream()
				.sorted(Collections.reverseOrder(Map.Entry.comparingByValue()));
		List<Actor> actoresOrdenados = sorted.map(e-> e.getKey()).collect(Collectors.toList());
		return actoresOrdenados;
	}


	public List<Movie> verPeliculasConMasDeUnActorFavorito( String token ) throws JSONException, IOException {

		User usuario = sesionesService.obtenerUsuarioPorToken(token);
		ArrayList<Movie> listPelConMasDeUnActorFav = new ArrayList<Movie>(0);
		for (MovieList unaMovieList : usuario.getLists() ) {
			for (Movie unaMovie : unaMovieList.getMovies() ) {
				if ( contieneMasDeUnActorFavorito(unaMovie, usuario.getFavoriteActors()) )
					listPelConMasDeUnActorFav.add(unaMovie);

			}
		}
		return listPelConMasDeUnActorFav;
	}

	private boolean contieneMasDeUnActorFavorito( Movie movie, List<Actor> actoresFav ) {
		Optional<Actor> optActor = null;
		int countActoresFav = 0;
		Iterator<ActorEnPelicula> credIt = movie.getCast().iterator();
		while ( countActoresFav < 2 && credIt.hasNext() ) {
			optActor = actoresFav.stream().filter( actor -> actor.getId() == credIt.next().getActorId() ).findFirst();
			if ( optActor.isPresent() )
				countActoresFav++;
		}
		return countActoresFav > 1;
	}

    public List<ActorEnPelicula> rankingDeActoresPorMayorRepeticion(String token, Long idlistaDePeliculas) {
        User usuario = sesionesService.obtenerUsuarioPorToken(token);

        MovieList listaDePeliculas = usuario.getLists().stream().filter(movieList -> movieList.getId() == idlistaDePeliculas)
                .findFirst()
                .orElseThrow(() -> new RuntimeException("No existe la lista de peliculas que intenta rankear."));

        List<ActorEnPelicula> actoresEnPeliculas = obtenerTodosLosActoresEnPeliculas(listaDePeliculas.getMovies());

        Map<ActorEnPelicula, Integer> aparicionDeActores = mapearPorRepeticionesLosActoresEnPeliculas(actoresEnPeliculas);

        List<ActorEnPelicula> actoresOrdenados = aparicionDeActores.entrySet().stream().sorted(Collections.reverseOrder(Map.Entry.comparingByValue())).map(Map.Entry::getKey).collect(Collectors.toList());
        //TODO en el futuro podemos ver la posibilidad de devolver actor en vez de actorENPelicula.
        return actoresOrdenados;
    }

    private Map<ActorEnPelicula, Integer> mapearPorRepeticionesLosActoresEnPeliculas(List<ActorEnPelicula> actoresEnPeliculas) {
        Map<ActorEnPelicula, Integer> aparicionDeActores = new HashMap<>();
        actoresEnPeliculas.forEach(actorEnPelicula -> evaluarApariciones(actorEnPelicula, aparicionDeActores));
        return aparicionDeActores;
    }

    private List<ActorEnPelicula> obtenerTodosLosActoresEnPeliculas(List<Movie> peliculas) {
        List<ActorEnPelicula> actoresEnPeliculas = new ArrayList<ActorEnPelicula>();
        peliculas.forEach(pelicula -> actoresEnPeliculas.addAll(pelicula.getCast()));
        return actoresEnPeliculas;
    }

    private void evaluarApariciones(ActorEnPelicula actor, Map<ActorEnPelicula, Integer> aparicionDeActores) {

        if (aparicionDeActores.containsKey(actor)) {
            Integer valor = aparicionDeActores.get(actor);
            aparicionDeActores.replace(actor, valor++);
        } else
            aparicionDeActores.put(actor, 1);
    }

}
