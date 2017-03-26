package com.UTNFRBATACS1c2017.app.others;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;

@Controller
public class ActorController {

	@RequestMapping("/actor")
	public String busquedaPelicula(@RequestParam(value = "id", required = true) String id,
			Model model) throws Exception {
		Actor actor = new Actor(id);
		model.addAttribute("actor", actor);
		model.addAttribute("credits", actor.getCredits());
		model.addAttribute("profiles", actor.getProfiles());
		return "actor";
	}

}