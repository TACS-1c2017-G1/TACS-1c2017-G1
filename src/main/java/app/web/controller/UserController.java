package app.web.controller;

import app.model.odb.Actor;
import app.model.odb.UserView;
import org.json.JSONException;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;


import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

@Controller
public class UserController {

	@RequestMapping(value="/user/{id}",method=RequestMethod.GET,produces="application/json")
	@ResponseBody
	public UserView datosUsuario(@PathVariable String id) throws JSONException, IOException{
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

    @RequestMapping(value="/Juli/actoresFavoritos",method=RequestMethod.GET)
    @ResponseBody
    public String actoresFavoritosUsuario(@RequestHeader(value="Token") String token) throws IOException{
        return "Estos son tus actores favoritos.";
    }

    @RequestMapping(value="/Juli/peliculasActoresFavoritos",method=RequestMethod.GET)
    @ResponseBody
    public String peliculasActoresFavoritos(@RequestHeader(value="Token") String token) throws IOException{
        return "Lista de peliculas donde hay más de uno de tus actores favoritos.";
    }


}
