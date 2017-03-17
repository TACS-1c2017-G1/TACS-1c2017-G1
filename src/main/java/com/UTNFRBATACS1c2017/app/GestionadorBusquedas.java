package com.UTNFRBATACS1c2017.app;


public class GestionadorBusquedas {
	
//	TODO este metodo no deberia estar aca creo - Facundo 17/03 
//	public String fichaPeli(Integer movieCodigo) throws Exception {
//		return Conector.run("movie/"+movieCodigo.toString(),"");
//	}
  
	public static void main(String[] args) throws Exception {
//		TODO ELIMINAR, estas son pruebas en la consola para ver la correcta configuracion 
//		GestionadorBusquedas gestionadorBusquedas = new GestionadorBusquedas();
//		System.out.println(gestionadorBusquedas.fichaPeli(550));
//		System.out.println(gestionadorBusquedas.buscarPeliculaPorNombre("Pirates-of-the-Caribbean"));
//		System.out.println(gestionadorBusquedas.buscarActorPorNombre("Johnny-Depp"));
//		System.out.println(gestionadorBusquedas.buscarPorNombre("Chaplin"));
	}
  
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