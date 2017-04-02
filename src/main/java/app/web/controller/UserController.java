package app.web.controller;

import java.io.IOException;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

import org.json.JSONException;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import app.model.odb.Actor;
import app.model.odb.Movie;
import app.model.odb.MovieList;
import app.model.odb.User;
import app.model.odb.UserView;

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
	public ArrayList<MovieList> listaUsuarios(@RequestHeader String token,@PathVariable String id1, String id2) throws JSONException, IOException{
		User user1 = User.create(id1, "AEC",new ArrayList<MovieList>());
		User user2 = User.create(id2, "AEC",new ArrayList<MovieList>());
		return new ArrayList<MovieList>();
	}
	

    @RequestMapping(value="/favorite-actors",method=RequestMethod.GET)
    @ResponseBody
    public List<Actor> actoresFavoritosUsuario(@RequestHeader(value="Token") String token) throws IOException{
        return Arrays.asList(new Actor(), new Actor());
    }

    @RequestMapping(value="/favorite-actors/movies",method=RequestMethod.GET)
    @ResponseBody
    public List<Movie> peliculasActoresFavoritos(@RequestHeader(value="Token") String token) throws IOException{
        return Arrays.asList(new Movie());
    }


}
