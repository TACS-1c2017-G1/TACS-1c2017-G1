package app.web.controller;

import java.io.IOException;
import java.util.List;

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
import app.service.ActoresFavoritosService;
import flexjson.JSONSerializer;

@Controller
public class ActoresFavoritosController {
	
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
