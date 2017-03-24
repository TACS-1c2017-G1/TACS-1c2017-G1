package com.UTNFRBATACS1c2017.app.Gestionadores.Busquedas;

import com.UTNFRBATACS1c2017.app.Conector;

public class Busquedas {
	Conector conector = new Conector();
	
	public String buscarPeliculaPorNombre(String query) throws Exception{
		return conector.getResource("search/movie",query);
	}
	  
	public String buscarActorPorNombre(String query) throws Exception {
		  return conector.getResource("search/person",query);
	}
	
	public String buscarPorNombre(String query) throws Exception {
		  return conector.getResource("search/multi",query);
	}
	
}