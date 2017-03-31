package app.web.controller;

import java.io.IOException;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import app.model.odb.Movie;

@Controller
public class ListasController {
		
	@RequestMapping(value = "/list/1234", method = RequestMethod.GET)
	@ResponseBody
	public String consultarLista(@RequestHeader(value="Token") String token, @PathVariable int list_id) throws Exception {
		//
		return "/list/{list_id}";
	}
	
	@RequestMapping(value = "/list/new-list", method = RequestMethod.POST)
	@ResponseBody
	public String crearLista(@RequestHeader(value="Token") String Token, @RequestBody String list_name) throws IOException {
		//
		return "Se creó la lista.";
	}
	
	@RequestMapping(value = "/list/1234/itemAgregado", method = RequestMethod.POST)
	@ResponseBody
	public String agregarItem(@RequestHeader(value="Token") String token, @RequestBody Movie movie) throws IOException {
		//
		return "Se agregó el item.";
	}
	
	@RequestMapping(value = "/list/1234/itemBorrado", method = RequestMethod.DELETE)
	@ResponseBody
	public String eliminarItem(@RequestHeader(value="Token") String Token, @RequestBody Movie movie) throws IOException {
		//
		return "Se eliminó el item.";
	}
	
	
	
	
	
	
	
	
}


