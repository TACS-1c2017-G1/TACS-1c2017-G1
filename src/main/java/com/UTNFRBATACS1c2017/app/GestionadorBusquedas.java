package com.UTNFRBATACS1c2017.app;


public class GestionadorBusquedas {
  
	public String buscarPeliculaPorNombre(String query) throws Exception {
		return Conector.run("search/movie",query);
	}
	  
	public String buscarActorPorNombre(String query) throws Exception {
		  return Conector.run("search/person",query);
	}
	
	public String buscarPorNombre(String query) throws Exception {
		  return Conector.run("search/multi",query);
	}
	
}