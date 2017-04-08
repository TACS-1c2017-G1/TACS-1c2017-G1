package app.web.controller;

import app.model.dto.ActorDto;
import app.model.dto.MoviDto;
import app.model.odb.Actor;
import app.model.odb.Credencial;
import app.model.odb.Movie;
import app.model.odb.UserView;
import app.service.ActoresFavoritosService;
import app.service.UserService;
import org.json.JSONException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;


@Controller
@RequestMapping(value = "/user")
public class UserController {

	@Autowired
	UserService servicioDeUsuario;

	@RequestMapping(value="/", method = RequestMethod.POST)
	@ResponseBody
	public void crearUsuario(@RequestBody Credencial userAndPassword) throws IOException{
		servicioDeUsuario.crearNuevoUsuario(userAndPassword);
	}

	@RequestMapping(value="/{id}",method=RequestMethod.GET,produces="application/json")
	@ResponseBody
	public UserView datosUsuario(@RequestHeader String token,@PathVariable String id) throws JSONException, IOException{
		return new UserView(id);
	}


	@RequestMapping(value = "/ranking/{idlistaDePeliculas}", method = RequestMethod.GET, produces = "application/json")
	@ResponseBody
	public List<Actor> rankingDeActores(@RequestHeader String Token, @PathVariable Long idlistaDePeliculas) throws JSONException, IOException{
		List<Actor> rankingDeActores = new ArrayList<Actor>();
		Actor actor1 = new Actor("10990");
		Actor actor2 = new Actor("10980");

		rankingDeActores.add(actor1);
		rankingDeActores.add(actor2);

		return rankingDeActores;
	}

	

	@RequestMapping(value="/{id1}/{id2}/",method=RequestMethod.GET,produces="application/json")
	@ResponseBody
	public ArrayList<Movie> listaUsuarios(@RequestHeader String token, @PathVariable Integer id1, Integer id2) throws JSONException, IOException{
		return new ArrayList<Movie>();
	}
	
    
    @RequestMapping(value = "/favoriteactor/{idactor}/", method = RequestMethod.PUT, produces="application/json")
	@ResponseBody
	public ActorDto marcarActorFavorito(@RequestHeader String token, @PathVariable String idactor, Model model) throws Exception {
		ActorDto actor = ActoresFavoritosService.maracarActorFavorito(idactor);
		return actor;
	}

	
	
	@RequestMapping(value = "/favoriteactor/", method = RequestMethod.GET, produces="application/json")
	@ResponseBody
	public List<ActorDto> verActoresFavoritos(@RequestHeader String token, Model model) throws IOException {
		List<ActorDto> list = ActoresFavoritosService.verActoresFavoritos();
		return list;
	}
	
	
	@RequestMapping(value = "/favoriteactor/ranking", method = RequestMethod.GET, produces="application/json")
	@ResponseBody
	public List<ActorDto> verRankingActoresFavoritos(@RequestHeader String token, Model model) throws IOException {
		List<ActorDto> list = ActoresFavoritosService.verRankingActoresFavoritos();
		return list;
	}
	
	
	@RequestMapping(value = "/favoriteactor/movies", method = RequestMethod.GET, produces="application/json")
	@ResponseBody
	public List<MoviDto> verPeliculasConActoresFavoritos(@RequestHeader String token, Model model) throws Exception {
		List<MoviDto> list = ActoresFavoritosService.verPeliculasConActoresFavoritos();
		return list;
	}

}