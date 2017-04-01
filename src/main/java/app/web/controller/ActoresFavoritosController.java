package app.web.controller;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import app.service.ActoresFavoritosService;

@Controller
public class ActoresFavoritosController {
	
	private static final ActoresFavoritosService service = new ActoresFavoritosService();
	
	@RequestMapping(value = "/favoriteactor/mark/{query}", method = RequestMethod.POST)
	public String marcarActorFavorito(@PathVariable String query, Model model) throws Exception {
		model.addAttribute("actorFavoritoMarcado",  "{actor: "+query+", favorite: true}" /*service.marcarActorFavorito(query)*/);
		return "{actor: "+query+", favorite: true}";
	}
	
	@RequestMapping(value = "/favoriteactor/see", method = RequestMethod.GET)
	@ResponseBody
	public String verActoresFavoritos(@RequestBody ) throws Exception {
		//model.addAttribute("actorFavoritoMarcado",  "{actor: "+query+", favorite: true}" /*service.marcarActorFavorito(query)*/);
		return "listado de actores favoritos";
	}

}
