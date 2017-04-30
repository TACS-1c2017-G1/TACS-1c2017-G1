package app.web.controller;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.ResponseStatus;

import app.service.BusquedasService;

@Controller
@RequestMapping(value = "/search")
public class BusquedasController {

	@RequestMapping(value = "/movie/{query}", method = RequestMethod.GET, produces = "application/json")
	@ResponseStatus(HttpStatus.OK)
	public @ResponseBody String busquedaPeliculaJson(@RequestHeader String Token, @PathVariable String query)
			throws Exception {
		return BusquedasService.buscarPeliculaPorNombreJson(query).toString();
	}

	@RequestMapping(value = "/person/{query}", method = RequestMethod.GET, produces = "application/json")
	@ResponseStatus(HttpStatus.OK)
	public @ResponseBody String busquedaActorJson(@RequestHeader String Token, @PathVariable String query)
			throws Exception {
		return BusquedasService.buscarActorPorNombreJson(query).toString();
	}

	@RequestMapping(value = "/{query}", method = RequestMethod.GET, produces = "application/json")
	@ResponseStatus(HttpStatus.OK)
	public @ResponseBody String busqueda(@RequestHeader String Token, @PathVariable String query) throws Exception {
		return BusquedasService.buscarPorNombre(query).toString();
	}

}