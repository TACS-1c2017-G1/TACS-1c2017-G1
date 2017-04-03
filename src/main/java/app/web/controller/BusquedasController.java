package app.web.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.ResponseStatus;

import app.model.odb.Actor;
import app.model.odb.MovieList;
import app.service.BusquedasService;

@Controller
@RequestMapping(value = "/search")
public class BusquedasController {
	BusquedasService busqueda = new BusquedasService();
	
	@RequestMapping(value = "/movie/{query}", method = RequestMethod.GET,produces="application/json")
	@ResponseStatus(HttpStatus.OK)
	public @ResponseBody MovieList busquedaPeliculaJson(@PathVariable String query) throws Exception {
		return busqueda.buscarPeliculaPorNombre(query);
	}
	
	@RequestMapping(value = "/movie/{query}", method = RequestMethod.GET)
	public String busquedaPelicula(@PathVariable String query, Model model) throws Exception {
		model.addAttribute("movies", this.busquedaPeliculaJson(query));
		return "search/movie";
	}
	
	@RequestMapping(value = "/person/{query}", method = RequestMethod.GET,produces="application/json")
	@ResponseStatus(HttpStatus.OK)
	public @ResponseBody List<Actor> busquedaActorJson(@PathVariable String query) throws Exception {
		return busqueda.buscarActorPorNombre(query);
	}
	
	@RequestMapping(value = "/person/{query}", method = RequestMethod.GET)
	public String busquedaActor(@PathVariable String query, Model model) throws Exception {
		model.addAttribute("people", this.busquedaActorJson(query));
		return "search/actor";
	}

	@RequestMapping(value = "/{query}", method = RequestMethod.GET, produces="application/json")
	@ResponseStatus(HttpStatus.OK)
	public @ResponseBody String busqueda(@PathVariable String query) throws Exception {
		return busqueda.buscarPorNombre(query).toString();
	}
	
	@RequestMapping(value = "/{query}", method = RequestMethod.GET)
	public String busqueda(@PathVariable String query, Model model) throws Exception {
		model.addAttribute("things", this.busqueda(query));
		return "search/search";
	}

}