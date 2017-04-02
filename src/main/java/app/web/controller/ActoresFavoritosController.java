package app.web.controller;

import java.util.List;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;

import app.model.dto.ActorDto;
import app.model.dto.MoviDto;
import app.service.ActoresFavoritosService;
import flexjson.JSONSerializer;

@Controller
public class ActoresFavoritosController {
	
	@RequestMapping(value = "/favoriteactor/mark/{idactor}", method = RequestMethod.POST)
	public String marcarActorFavorito(@PathVariable String idactor, Model model) throws Exception {
		ActorDto actor = ActoresFavoritosService.maracarActorFavorito(idactor);
		JSONSerializer serializer = new JSONSerializer();
		model.addAttribute("actorFavoritoMarcado", serializer.serialize(actor));
		return "favoriteActor/mark";
	}
	
	
	@RequestMapping(value = "/favoriteactor/unmark/{idactor}", method = RequestMethod.POST)
	public String desmarcarActorFavorito(@PathVariable String idactor, Model model) throws Exception {
		ActorDto actor = ActoresFavoritosService.desmarcarActorFavorito(idactor);
		JSONSerializer serializer = new JSONSerializer();
		model.addAttribute("actorFavoritoDesmarcado", serializer.serialize(actor));
		return "favoriteActor/unmark";
	}
	
	
	@RequestMapping(value = "/favoriteactor/see", method = RequestMethod.GET)
	public String verActoresFavoritos(Model model ) throws Exception {
		List<ActorDto> list = ActoresFavoritosService.verActoresFavoritos();
		JSONSerializer serializer = new JSONSerializer();
		model.addAttribute("actoresFavoritos", serializer.deepSerialize(list) );
		return "favoriteActor/list";
	}
	
	
	@RequestMapping(value = "/favoriteactor/seeRanking", method = RequestMethod.GET)
	public String verRankingActoresFavoritos(Model model ) throws Exception {
		List<ActorDto> list = ActoresFavoritosService.verRankingActoresFavoritos();
		JSONSerializer serializer = new JSONSerializer();
		model.addAttribute("actoresFavoritos", serializer.deepSerialize(list) );
		return "favoriteActor/ranking";
	}
	
	
	@RequestMapping(value = "/favoriteactor/inMovies", method = RequestMethod.GET)
	public String verPeliculasConActoresFavoritos(Model model ) throws Exception {
		List<MoviDto> list = ActoresFavoritosService.verPeliculasConActoresFavoritos();
		JSONSerializer serializer = new JSONSerializer();
		model.addAttribute("movies", serializer.deepSerialize(list) );
		return "favoriteActor/inmovies";
	}

}
