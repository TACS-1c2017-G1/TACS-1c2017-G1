package app.web.controller;

import app.model.odb.Movie;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

@Controller
@RequestMapping(value = "/movie")
public class MovieController {

	@RequestMapping(value = "/{id}", method = RequestMethod.GET, produces = "application/json")
	@ResponseStatus(HttpStatus.OK)
	public @ResponseBody Movie busquedaPeliculaJson(@RequestHeader String Token, @PathVariable String id)
			throws Exception {
		return new Movie(id);
	}

}