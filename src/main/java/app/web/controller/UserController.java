package app.web.controller;

import app.model.dto.ActorDto;
import app.model.dto.RespuestaDto;
import app.model.odb.Actor;
import app.model.odb.Credencial;
import app.model.odb.Movie;
import app.model.odb.User;
import app.service.UserService;
import org.json.JSONException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.util.List;



@Controller
@RequestMapping(value = "/user")
public class UserController {

	@Autowired
	UserService servicioDeUsuario;
		

	@RequestMapping(value="/", method = RequestMethod.POST)
	@ResponseBody
	public void crearUsuario(@RequestBody Credencial userAndPassword) throws Exception,IOException{
		servicioDeUsuario.crearNuevoUsuario(userAndPassword);
	}

	
	@RequestMapping(value="/{id}",method=RequestMethod.GET,produces="application/json")
	@ResponseBody
	public User datosUsuario(@RequestHeader String token,@PathVariable String id) throws JSONException, IOException{
		return servicioDeUsuario.obtenerUsuario(id);
	}


	@RequestMapping(value = "/ranking/{idlistaDePeliculas}", method = RequestMethod.GET, produces = "application/json")
	@ResponseBody
	public List<Actor> rankingDeActores(@RequestHeader String token, @PathVariable Long idlistaDePeliculas) throws JSONException, IOException{
		return servicioDeUsuario.rankingDeActoresPorMayorRepeticion(token,idlistaDePeliculas);
	}

	

	@RequestMapping(value="/{id1}/{id2}/",method=RequestMethod.GET,produces="application/json")
	@ResponseBody
	public List<Movie> listaUsuarios(@RequestHeader String token, @PathVariable String id1, @PathVariable String id2) throws JSONException, IOException{
		List<Movie> interseccion = servicioDeUsuario.obtenerInterseccionListas(id1,id2);
		return interseccion;
	}
	
    
    @RequestMapping(value = "/favoriteactor/{idactor}/", method = RequestMethod.PUT, produces="application/json")
	@ResponseBody
	public RespuestaDto marcarActorFavorito(@RequestHeader String token, @PathVariable String idactor, Model model) throws Exception {
    	return servicioDeUsuario.maracarActorFavorito(token, idactor);
	}

	
	@RequestMapping(value = "/favoriteactor/", method = RequestMethod.GET, produces="application/json")
	@ResponseBody
	public List<Actor> verActoresFavoritos(@RequestHeader String token, Model model) throws IOException {
		return servicioDeUsuario.verActoresFavoritos(token);
	}
	
	
	@RequestMapping(value = "/favoriteactor/ranking", method = RequestMethod.GET, produces="application/json")
	@ResponseBody
	public List<Actor> verRankingActoresFavoritos(@RequestHeader String token, Model model) throws IOException {
		return servicioDeUsuario.verRankingActoresFavoritos(token);
	}
	
	
	@RequestMapping(value = "/favoriteactor/movies", method = RequestMethod.GET, produces="application/json")
	@ResponseBody
	public List<Movie> verPeliculasConActoresFavoritos(@RequestHeader String token, Model model) throws Exception {
		return servicioDeUsuario.verPeliculasConMasDeUnActorFavorito(token);
	}

}