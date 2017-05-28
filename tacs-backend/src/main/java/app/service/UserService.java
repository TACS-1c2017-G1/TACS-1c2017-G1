package app.service;

import java.io.IOException;
import java.util.ArrayList;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

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
import app.repositories.RepositorioDeActores;
import app.repositories.RepositorioDeListas;
import app.repositories.RepositorioDeUsuarios;

/**
 * Created by Rodrigo on 08/04/2017.
 */
@Service
public class UserService {

	@Autowired
	SesionesService sesionesService;

	@Autowired
	RepositorioDeUsuarios repositorioDeUsuarios;

	@Autowired
	RepositorioDeListas repositorioDeListas;

	@Autowired
	RepositorioDeActores repositorioDeActores;



	public void crearNuevoUsuario(Credencial userAndPassword) throws ExceptionInInitializerError {
		User usuarioNuevo = User.create(userAndPassword, false);
		repositorioDeUsuarios.insert(usuarioNuevo);
	}

	public List<User> obtenerUsuarios() {
		return repositorioDeUsuarios.findAll();
	}

	public RespuestaDto marcarActorFavorito(String token, Actor actor) throws JSONException, IOException {
		try {
			User usuario = sesionesService.obtenerUsuarioPorToken(token);
			Optional<Actor> optActor = usuario.getFavoriteActors().stream()
					.filter(actorFavorito -> actorFavorito.getId().equals(actor.getId())).findFirst();
			RespuestaDto rta = new RespuestaDto();
			if (optActor.isPresent()) {
				rta.setMessage("Ya lo tiene como favorito al actor  " + actor.getName());

			} else {
				repositorioDeActores.save(actor);
				usuario.getFavoriteActors().add(actor);
				repositorioDeUsuarios.save(usuario);
				rta.setMessage("Actor favorito agregado: " + actor.getName());
			}

			return rta;
		} catch (NumberFormatException e) {
			e.printStackTrace();
			throw new RuntimeException("El id de actor posee un formato inválido.");
		}
	}

	public void desmarcarActorFavorito(String token, String id_actor){
		User usuario = sesionesService.obtenerUsuarioPorToken(token);
		usuario.getFavoriteActors().stream()
				.filter(actorFavorito -> actorFavorito.getId().equals(id_actor)).findFirst().ifPresent(actor -> usuario.getFavoriteActors().remove(actor));
		repositorioDeUsuarios.save(usuario);
	}

	public List<Actor> verActoresFavoritos(String token) throws JSONException, IOException {
		User usuario = sesionesService.obtenerUsuarioPorToken(token);
		return usuario.getFavoriteActors();
	}

	public List<Actor> verRankingActoresFavoritos(String token) throws JSONException, IOException {

		ArrayList<Actor> rankingActores = new ArrayList<Actor>(0);
		List<User> usuarios = obtenerUsuarios();
		usuarios
		.forEach( usuario -> usuario.getFavoriteActors()
				.forEach( actor -> {
		            Optional<Actor> optActRank = rankingActores.stream()
		            							.filter( actorRank -> actorRank.getId().equals(actor.getId())).findFirst();
		            if (optActRank.isPresent())
		            	optActRank.get().incScoreRank();
		            else {
		            	actor.resetScoreRak();
		            	rankingActores.add(actor);
		            }
				})
		);
		
		return rankingActores.stream().sorted((actor1, actor2) -> Integer.compare(actor2.getScoreRank(), actor1.getScoreRank()))
				.collect(Collectors.toList());
	}

	public List<Movie> verPeliculasConMasDeUnActorFavorito(String token) throws JSONException, IOException {

		User usuario = sesionesService.obtenerUsuarioPorToken(token);
		ArrayList<Movie> listPelConMasDeUnActorFav = new ArrayList<Movie>(0);
		int cantActores = 0;
		List<Actor> actoresFav = usuario.getFavoriteActors();
		List<MovieList> listas = usuario.getLists();
		for (MovieList list : listas) {
			for (Movie movie : list.getMovies()) {
				for (ActorEnPelicula credit : movie.getCast()) {
					if (actoresFav.stream().anyMatch(actor -> actor.getId() == credit.getActorId())) {
						cantActores++;
					}
				}
				if (cantActores > 1) {
					listPelConMasDeUnActorFav.add(movie);
				}
				cantActores = 0;
			}
		}
		return listPelConMasDeUnActorFav;
	}
	
	public List<MovieList> verListas(String token) {
		User usuario = sesionesService.obtenerUsuarioPorToken(token);
		//esto lo hago para que me devuelva el contenido de cada lista .
		List<MovieList> listasADevolver = getListasCompletasDelUsuario(usuario);
		return listasADevolver;
	}

	private List<MovieList> getListasCompletasDelUsuario(User usuario) {
		return usuario.getLists().stream().map(movieList -> repositorioDeListas.findOne(movieList.getId())).collect(Collectors.toList());
	}


	public List<Actor> rankingDeActoresPorMayorRepeticion(String token, String idlistaDePeliculas) {
		User usuario = sesionesService.obtenerUsuarioPorToken(token);

		MovieList listaDePeliculas = getListasCompletasDelUsuario(usuario).stream()
				.filter(movieList -> movieList.getId().equals(idlistaDePeliculas)).findFirst()
				.orElseThrow(() -> new RuntimeException("No existe la lista de peliculas que intenta rankear."));
		
	
		List<ActorEnPelicula> actoresEnPeliculas = obtenerTodosLosActoresEnPeliculas(listaDePeliculas.getMovies());

		Map<Actor, Integer> aparicionDeActores = mapearPorRepeticionesLosActoresEnPeliculas(
				actoresEnPeliculas);

		List<Actor> actoresOrdenados = aparicionDeActores.entrySet().stream()
				.sorted(Collections.reverseOrder(Map.Entry.comparingByValue())).map(Map.Entry::getKey)
				.collect(Collectors.toList());
		// TODO en el futuro podemos ver la posibilidad de devolver actor en vez
		// de actorENPelicula.
		return actoresOrdenados;
	}

	private Map<Actor, Integer> mapearPorRepeticionesLosActoresEnPeliculas(
			List<ActorEnPelicula> actoresEnPeliculas) {
		Map<Actor, Integer> aparicionDeActores = new HashMap<>();
		actoresEnPeliculas.forEach(actorEnPelicula -> evaluarApariciones(actorEnPelicula.getActorId(), aparicionDeActores));
		return aparicionDeActores;
	}

	private List<ActorEnPelicula> obtenerTodosLosActoresEnPeliculas(List<Movie> peliculas) {
		List<ActorEnPelicula> actoresEnPeliculas = new ArrayList<ActorEnPelicula>();
		peliculas.forEach(pelicula -> actoresEnPeliculas.addAll(pelicula.getCast()));
		return actoresEnPeliculas;
	}

	private void evaluarApariciones(String idActor, Map<Actor, Integer> aparicionDeActores) {

		try {
			Actor actor = new Actor(idActor.toString());
			if (aparicionDeActores.containsKey(actor)) {
				Integer valor = aparicionDeActores.get(actor);
				aparicionDeActores.replace(actor, ++valor);
			} else
				aparicionDeActores.put(actor, 1);
		} catch (JSONException | IOException e) {
			System.out.println(e.getMessage());
		}
	}

	public void borrarTodo() {
		repositorioDeUsuarios.deleteAll();
	}
}
