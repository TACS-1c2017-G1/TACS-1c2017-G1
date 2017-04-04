package app.web.controller;

import app.model.odb.Actor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

@Controller
@RequestMapping(value = "/person")
public class ActorController {

	@RequestMapping(value = "/{id}", method = RequestMethod.GET, produces = "application/json")
	@ResponseStatus(HttpStatus.OK)
	public @ResponseBody Actor busquedaPeliculaJson(@RequestHeader String Token, @PathVariable String id) throws Exception {
		return new Actor(id);
	}

	// @RequestMapping(value = "/{id}", method = RequestMethod.GET)
	// public String busquedaPelicula(@PathVariable String id, Model model)
	// throws Exception {
	// model.addAttribute("actor", this.busquedaPeliculaJson(id));
	// return "actor";
	// }
}