package app.web.controller;

import app.model.odb.Movie;
import app.model.odb.MovieList;
import app.service.ListasService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.util.List;

@CrossOrigin
@Controller
@RequestMapping(value = "/list")
public class ListasController {

	@Autowired
	ListasService listasService;

	@RequestMapping(value = "/{id_lista}", method = RequestMethod.GET)
	@ResponseBody
	public MovieList consultarLista(@RequestHeader String token, @PathVariable String id_lista) throws Exception {
		return listasService.consultarLista(id_lista, token);
	}

	@RequestMapping(value = "/", method = RequestMethod.POST)
	@ResponseBody
	public MovieList crearLista(@RequestHeader String token, @RequestBody String nuevaLista) throws IOException {
		return listasService.crearLista(nuevaLista, token);
	}

	@RequestMapping(value = "/{id_lista}/", method = RequestMethod.POST)
	@ResponseBody
	public void agregarItem(@RequestHeader String token, @RequestBody Movie movie, @PathVariable String id_lista)
			throws IOException {
    	listasService.agregarItem(movie, id_lista, token);
    }

	@RequestMapping(value = "/{id_lista}/{id_pelicula}", method = RequestMethod.DELETE)
	@ResponseBody
	public void eliminarItem(@RequestHeader String token, @PathVariable String id_lista, @PathVariable String id_pelicula)
			throws IOException {
        listasService.eliminarItem(id_pelicula, id_lista, token);
    }
	
	@RequestMapping(value = "/intersection/{idLista1}/{idLista2}", method = RequestMethod.GET)
	@ResponseBody
	public List<Movie> calcularInterseccionDe(@RequestHeader String token, @PathVariable String idLista1,
			String idLista2) throws IOException {
		return listasService.interseccionEntre(idLista1, idLista2, token);
	}

}

