package app.web.controller;

import app.service.BusquedasService;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

@Controller
@RequestMapping(value = "/search")
public class BusquedasController {

	@RequestMapping(value = "/movie/{query}", method = RequestMethod.GET, produces = "application/json")
	@ResponseStatus(HttpStatus.OK)
	public @ResponseBody String busquedaPeliculaJson(@RequestHeader String Token, @PathVariable String query) throws Exception {
		return BusquedasService.buscarPeliculaPorNombreJson(query).toString();
	}

	// @RequestMapping(value = "/movie/{query}", method = RequestMethod.GET)
	// public String busquedaPelicula(@PathVariable String query, Model model)
	// throws Exception {
	// model.addAttribute("movies", this.busquedaPeliculaJson(query));
	// return "search/movie";
	// }

	@RequestMapping(value = "/person/{query}", method = RequestMethod.GET, produces = "application/json")
	@ResponseStatus(HttpStatus.OK)
	public @ResponseBody String busquedaActorJson(@RequestHeader String Token, @PathVariable String query) throws Exception {
		return BusquedasService.buscarActorPorNombreJson(query).toString();
	}

	// @RequestMapping(value = "/person/{query}", method = RequestMethod.GET)
	// public String busquedaActor(@PathVariable String query, Model model)
	// throws Exception {
	// model.addAttribute("people", this.busquedaActorJson(query));
	// return "search/actor";
	// }

	@RequestMapping(value = "/{query}", method = RequestMethod.GET, produces = "application/json")
	@ResponseStatus(HttpStatus.OK)
	public @ResponseBody String busqueda(@RequestHeader String Token, @PathVariable String query) throws Exception {
		return BusquedasService.buscarPorNombre(query).toString();
	}

	// @RequestMapping(value = "/{query}", method = RequestMethod.GET)
	// public String busqueda(@PathVariable String query, Model model) throws
	// Exception {
	// model.addAttribute("things", this.busqueda(query));
	// return "search/search";
	// }

}