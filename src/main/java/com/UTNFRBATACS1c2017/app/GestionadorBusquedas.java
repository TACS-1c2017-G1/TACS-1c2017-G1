package com.UTNFRBATACS1c2017.app;


public class GestionadorBusquedas {
	
  public String fichaPeli(Integer movieCodigo) throws Exception {
    return Conector.run("movie/"+movieCodigo.toString()+"?");
  }
  
  public static void main(String[] args) throws Exception {
	  GestionadorBusquedas gestionadorBusquedas = new GestionadorBusquedas();
	  System.out.println(gestionadorBusquedas.fichaPeli(550));
  }

}