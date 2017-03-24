package com.UTNFRBATACS1c2017.app.Gestionadores.Busquedas;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;

@Controller
public class BusquedasController {
	Busquedas busqueda = new Busquedas();

	@RequestMapping("/searchMovie")
	public String busquedaPelicula(@RequestParam(value = "name", required = false, defaultValue = "") String name,
			Model model) throws Exception {
		model.addAttribute("name", busqueda.buscarPeliculaPorNombre(name));
		return "searchMovie";
	}

	@RequestMapping("/searchActor")
	public String busquedaActor(@RequestParam(value = "name", required = false, defaultValue = "") String name,
			Model model) throws Exception {
		model.addAttribute("name", busqueda.buscarActorPorNombre(name));
		return "searchActor";
	}

	@RequestMapping("/search")
	public String busqueda(@RequestParam(value = "name", required = false, defaultValue = "") String name, Model model)
			throws Exception {
		model.addAttribute("name", busqueda.buscarPorNombre(name));
		return "search";
	}

}