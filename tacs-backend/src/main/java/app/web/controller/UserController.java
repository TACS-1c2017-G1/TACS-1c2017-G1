package app.web.controller;

import app.model.dto.RespuestaDto;
import app.model.odb.*;
import app.service.UserService;
import org.json.JSONException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.util.List;

@Controller
@CrossOrigin
@RequestMapping(value = "/user")
public class UserController {

	@Autowired
	UserService servicioDeUsuario;

	@RequestMapping(value = "/", method = RequestMethod.POST)
	@ResponseBody
	public void crearUsuario(@RequestBody Credencial userAndPassword) throws Exception, IOException {
		servicioDeUsuario.crearNuevoUsuario(userAndPassword);
	}

	@RequestMapping(value = "/ranking/{idlistaDePeliculas}", method = RequestMethod.GET, produces = "application/json")
	@ResponseBody
	public List<ActorEnPelicula> rankingDeActores(@RequestHeader String token, @PathVariable Long idlistaDePeliculas)
			throws JSONException, IOException {
		return servicioDeUsuario.rankingDeActoresPorMayorRepeticion(token, idlistaDePeliculas);
	}

	@RequestMapping(value = "/favoriteactor/{idactor}/", method = RequestMethod.PUT, produces = "application/json")
	@ResponseBody
	public RespuestaDto marcarActorFavorito(@RequestHeader String token, @PathVariable String idactor, Model model)
			throws Exception {
		return servicioDeUsuario.maracarActorFavorito(token, idactor);
	}

	@RequestMapping(value = "/favoriteactor/", method = RequestMethod.GET, produces = "application/json")
	@ResponseBody
	public List<Actor> verActoresFavoritos(@RequestHeader String token, Model model) throws IOException {
		return servicioDeUsuario.verActoresFavoritos(token);
	}

	@RequestMapping(value = "/favoriteactor/ranking", method = RequestMethod.GET, produces = "application/json")
	@ResponseBody
	public List<Actor> verRankingActoresFavoritos(@RequestHeader String token, Model model) throws IOException {
		return servicioDeUsuario.verRankingActoresFavoritos(token);
	}

	@RequestMapping(value = "/favoriteactor/movies", method = RequestMethod.GET, produces = "application/json")
	@ResponseBody
	public List<Movie> verPeliculasConActoresFavoritos(@RequestHeader String token, Model model) throws Exception {
		return servicioDeUsuario.verPeliculasConMasDeUnActorFavorito(token);
	}
	
	@RequestMapping(value = "/movieLists", method = RequestMethod.GET, produces = "application/json")
	@ResponseBody
	public List<MovieList> verListas(@RequestHeader String token, Model model) throws Exception {
		return servicioDeUsuario.verListas(token);
	}

}