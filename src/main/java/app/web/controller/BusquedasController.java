package app.web.controller;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;

import app.service.BusquedasService;

@Controller
public class BusquedasController {

	BusquedasService busquedaSrv = new BusquedasService();

	@RequestMapping("/searchMovie")
	public String busquedaPelicula(@RequestParam(value = "name", required = false, defaultValue = "") String name,
			Model model) throws Exception {
		model.addAttribute("name", busquedaSrv.buscarPeliculaPorNombre(name));
		return "searchMovie";
	}

	@RequestMapping("/searchActor")
	public String busquedaActor(@RequestParam(value = "name", required = false, defaultValue = "") String name,
			Model model) throws Exception {
		model.addAttribute("name", busquedaSrv.buscarActorPorNombre(name));
		return "searchActor";
	}

	@RequestMapping("/search")
	public String busqueda(@RequestParam(value = "name", required = false, defaultValue = "") String name, Model model)
			throws Exception {
		model.addAttribute("name", busquedaSrv.buscarPorNombre(name));
		return "search";
	}

}