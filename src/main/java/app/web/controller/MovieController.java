package app.web.controller;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.http.HttpStatus;

import app.model.odb.Movie;

@Controller
@RequestMapping(value = "/movie")
public class MovieController {
	
	// RESTful method
	@RequestMapping(value = "/{id}", method = RequestMethod.GET, produces="application/json")
	@ResponseStatus(HttpStatus.OK)
	public @ResponseBody Movie busquedaPeliculaJson(@PathVariable String id) throws Exception {
		return new Movie(id);
	}
	
	// View-based method
	@RequestMapping(value = "/{id}", method = RequestMethod.GET)
	public String busquedaPelicula(@PathVariable String id, Model model) throws Exception {
		// Call RESTful method to avoid repeating account lookup logic
		model.addAttribute(this.busquedaPeliculaJson(id));
		// Return the view to use for rendering the response
		return "movie";
	}

}