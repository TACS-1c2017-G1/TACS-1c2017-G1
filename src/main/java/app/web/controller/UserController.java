package app.web.controller;

import app.model.dto.ActorDto;
import app.model.dto.MoviDto;
import app.model.odb.*;
import app.service.ActoresFavoritosService;
import app.web.TOs.CredencialTO;
import org.json.JSONException;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;


@Controller
@RequestMapping(value = "/user")
public class UserController {

	@RequestMapping(value="/", method = RequestMethod.POST)
	@ResponseBody
	public String crearUsuario(@RequestBody CredencialTO userAndPassword) throws IOException{
		//Acá hay que crear el usuario y sino tirar excepción.
		return "Cuenta creada correctamente!";
	}

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

	

	@RequestMapping(value="/{id1}/{id2}/",method=RequestMethod.GET,produces="application/json")
	@ResponseBody
	public ArrayList<Movie> listaUsuarios(@RequestHeader String token, @PathVariable String id1, String id2) throws JSONException, IOException{
		User user1 = User.create(id1, "AEC",new ArrayList<MovieList>());
		User user2 = User.create(id2, "AEC",new ArrayList<MovieList>());
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