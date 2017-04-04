package app.web.controller;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

import org.json.JSONException;
import org.springframework.stereotype.Controller;

import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import app.model.dto.ActorDto;
import app.model.dto.MoviDto;
import app.model.odb.Actor;
import app.model.odb.UserView;
import app.service.ActoresFavoritosService;


@Controller
@RequestMapping(value = "/user")
public class UserController {

	@RequestMapping(value="/{id}",method=RequestMethod.GET,produces="application/json")
	@ResponseBody
	public UserView datosUsuario(@RequestHeader String token,@PathVariable String id) throws JSONException, IOException{
		return new UserView(id);
	}


	@RequestMapping(value = "/ranking/{idlistaDePeliculas}", method = RequestMethod.GET, produces = "application/json")
	@ResponseBody
	public List<Actor> rankingDeActores(@PathVariable Long idlistaDePeliculas) throws JSONException, IOException{
		List<Actor> rankingDeActores = new ArrayList<Actor>();
		Actor actor1 = new Actor("10990");
		Actor actor2 = new Actor("10980");

		rankingDeActores.add(actor1);
		rankingDeActores.add(actor2);

		return rankingDeActores;
	}

	

	@RequestMapping(value="/{id1}/{id2}",method=RequestMethod.GET,produces="application/json")
	@ResponseBody
	public ArrayList<Movie> listaUsuarios(@RequestHeader String token,@PathVariable String id1, String id2) throws JSONException, IOException{
		User user1 = User.create(id1, "AEC",new ArrayList<MovieList>());
		User user2 = User.create(id2, "AEC",new ArrayList<MovieList>());
		return new ArrayList<Movie>();
	}
	
    
    @RequestMapping(value = "/favoriteactor/mark/{idactor}", method = RequestMethod.PUT, produces="application/json")
	@ResponseBody
	public ActorDto marcarActorFavorito(@RequestHeader String token, @PathVariable String idactor, Model model) throws Exception {
		ActorDto actor = ActoresFavoritosService.maracarActorFavorito(idactor);
		return actor;
	}
	
	
	@RequestMapping(value = "/favoriteactor/unmark/{idactor}", method = RequestMethod.PUT, produces="application/json")
	@ResponseBody
	public ActorDto desmarcarActorFavorito(@RequestHeader String token, @PathVariable String idactor, Model model) throws IOException{
		ActorDto actor = ActoresFavoritosService.desmarcarActorFavorito(idactor);
		return actor;
	}
	
	
	@RequestMapping(value = "/favoriteactor/see", method = RequestMethod.GET, produces="application/json")
	@ResponseBody
	public List<ActorDto> verActoresFavoritos(@RequestHeader String token, Model model) throws IOException {
		List<ActorDto> list = ActoresFavoritosService.verActoresFavoritos();
		return list;
	}
	
	
	@RequestMapping(value = "/favoriteactor/seeRanking", method = RequestMethod.GET, produces="application/json")
	@ResponseBody
	public List<ActorDto> verRankingActoresFavoritos(@RequestHeader String token, Model model) throws IOException {
		List<ActorDto> list = ActoresFavoritosService.verRankingActoresFavoritos();
		return list;
	}
	
	
	@RequestMapping(value = "/favoriteactor/inMovies", method = RequestMethod.GET, produces="application/json")
	@ResponseBody
	public List<MoviDto> verPeliculasConActoresFavoritos(@RequestHeader String token, Model model) throws Exception {
		List<MoviDto> list = ActoresFavoritosService.verPeliculasConActoresFavoritos();
		return list;
	}

}