package app.web.controller;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;

import app.model.odb.Movie;

@Controller
public class MovieController {

	@RequestMapping(value = "/movie/{id}", method = RequestMethod.GET)
	public String busquedaPelicula(@PathVariable String id, Model model) throws Exception {
		Movie movie = new Movie(id);
		model.addAttribute(movie);
		return "movie";
	}

}