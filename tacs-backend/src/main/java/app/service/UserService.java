package app.service;

import app.model.dto.RespuestaDto;
import app.model.odb.*;
import app.repositories.RepositorioDeListas;
import app.repositories.RepositorioDeUsuarios;
import org.json.JSONException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.util.*;
import java.util.stream.Collectors;
import java.util.stream.Stream;

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
		User usuarioNuevo = User.create(userAndPassword, false);
		this.getRepositorio().insert(usuarioNuevo);
	}

	public ArrayList<User> obtenerUsuarios() {
		return this.getRepositorio().getUsers();
	}

	public RespuestaDto maracarActorFavorito(String token, String idActor) throws JSONException, IOException {
		try {
			User usuario = sesionesService.obtenerUsuarioPorToken(token);
			Optional<Actor> optActor = usuario.getFavoriteActors().stream()
					.filter(actor -> actor.getId() == Integer.parseInt(idActor)).findFirst();
			RespuestaDto rta = new RespuestaDto();
			if (optActor.isPresent()) {
				usuario.getFavoriteActors().remove(optActor.get());
				rta.setCode(1);
				rta.setMessage("Actor favorito removido: " + idActor);
			} else {
				usuario.getFavoriteActors().add(new Actor(idActor));
				rta.setCode(0);
				rta.setMessage("Actor favorito agregado: " + idActor);
			}

			return rta;
		} catch (NumberFormatException e) {
			e.printStackTrace();
			throw new RuntimeException("El id de actor posee un formato inválido.");
		}
	}

	public List<Actor> verActoresFavoritos(String token) throws JSONException, IOException {
		User usuario = sesionesService.obtenerUsuarioPorToken(token);
		return usuario.getFavoriteActors();
	}

	public List<Actor> verRankingActoresFavoritos(String token) throws JSONException, IOException {

		Map<Actor, Integer> rankingActores = new HashMap<Actor, Integer>();
		List<User> usuarios = obtenerUsuarios();
		usuarios.forEach(usuario-> usuario.getFavoriteActors().forEach(a ->{
            if (rankingActores.containsKey(a)){
                int valor = rankingActores.get(a);
                rankingActores.put(a, ++valor);
            }
            else
            {
                rankingActores.put(a, 1);
            }
        }));
		Stream<Map.Entry<Actor, Integer>> sorted = rankingActores.entrySet().stream()
				.sorted(Collections.reverseOrder(Map.Entry.comparingByValue()));
		List<Actor> actoresOrdenados = sorted.map(Map.Entry::getKey).collect(Collectors.toList());
		return actoresOrdenados;
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
		return usuario.getLists();
	}


	public List<Actor> rankingDeActoresPorMayorRepeticion(String token, String idlistaDePeliculas) {
		User usuario = sesionesService.obtenerUsuarioPorToken(token);
		Integer id = Integer.parseInt(idlistaDePeliculas);

		MovieList listaDePeliculas = usuario.getLists().stream()
				.filter(movieList -> movieList.getId() == id).findFirst()
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

	private void evaluarApariciones(Integer idActor, Map<Actor, Integer> aparicionDeActores) {

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

}
