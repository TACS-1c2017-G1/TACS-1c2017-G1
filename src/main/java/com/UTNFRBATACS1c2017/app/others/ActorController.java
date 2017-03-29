package com.UTNFRBATACS1c2017.app.others;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;

@Controller
public class ActorController {

	@RequestMapping(value="/actor/{id}", method = RequestMethod.GET)
	public String busquedaPelicula(@PathVariable String id, Model model)
			throws Exception {
		Actor actor = new Actor(id);
		model.addAttribute("actor", actor);
		return "actor";
	}

}