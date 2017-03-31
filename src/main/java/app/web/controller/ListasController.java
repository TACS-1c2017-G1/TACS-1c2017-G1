package app.web.controller;

import java.util.ArrayList;

import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;

import app.model.odb.Movie;
import app.service.ListasService;

public class ListasController {
	
	private ListasService lista = new ListasService();
	
	@RequestMapping(value = "/lis{list_id}t", method = RequestMethod.GET)
	public String consultarLista(@PathVariable int list_id) throws Exception {
		//
		return "/list/{lisdt_id}";
	}
	
	@RequestMapping(value = "/list/new-list", method = RequestMethod.POST)
	public String crearLista(@RequestHeader(value="Token") String Token, @RequestBody String list_name, int list_id) throws Exception {
		//
		return "Se creó la lista.";
	}
	
	@RequestMapping(value = "/list/{list_id}/items", method = RequestMethod.POST)
	public String agregarItem(@RequestHeader(value="Token") String Token, @RequestBody String list_name, int list_id, ArrayList<Movie> movies) throws Exception {
		//
		return "Se agregó el item a la lista.";
	}
	
	@RequestMapping(value = "/list/{list_id}/items", method = RequestMethod.DELETE)
	public String eliminarItem(@RequestHeader(value="Token") String Token, @RequestBody String list_name, int list_id, ArrayList<Movie> movies) throws Exception {
		//
		return "Se eliminó el item a la lista.";
	}
	
	
	
	
	
	
	
	
}


