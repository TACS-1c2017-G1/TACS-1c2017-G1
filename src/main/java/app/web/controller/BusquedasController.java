package app.web.controller;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;

import app.service.BusquedasService;

@Controller
public class BusquedasController {
	BusquedasService busqueda = new BusquedasService();

	@RequestMapping(value = "/search/movie/{query}", method = RequestMethod.GET)
	public String busquedaPelicula(@PathVariable String query, Model model) throws Exception {
		model.addAttribute("movies", busqueda.buscarPeliculaPorNombre(query));
		return "search/movie";
	}

	@RequestMapping(value = "/search/person/{query}", method = RequestMethod.GET)
	public String busquedaActor(@PathVariable String query, Model model) throws Exception {
		model.addAttribute("people", busqueda.buscarActorPorNombre(query));
		return "search/actor";
	}

	@RequestMapping(value = "/search/{query}", method = RequestMethod.GET)
	public String busqueda(@PathVariable String query, Model model) throws Exception {
		model.addAttribute("things", busqueda.buscarPorNombre(query));
		return "search/search";
	}

}