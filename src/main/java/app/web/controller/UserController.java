package app.web.controller;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

import org.json.JSONException;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import app.model.dto.ActorDto;
import app.model.dto.MoviDto;
import app.model.odb.Actor;
import app.model.odb.Movie;
import app.model.odb.User;
import app.service.ActoresFavoritosService;
import app.service.AdministrativoService;
import app.web.TOs.CredencialTO;


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
	public User datosUsuario(@RequestHeader String token,@PathVariable String id) throws JSONException, IOException{
		return AdministrativoService.obtenerUsuario(id);
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