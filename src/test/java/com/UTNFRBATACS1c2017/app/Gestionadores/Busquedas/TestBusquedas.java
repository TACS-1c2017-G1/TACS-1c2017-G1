/**
 * 
 */
package com.UTNFRBATACS1c2017.app.Gestionadores.Busquedas;

import static org.junit.Assert.assertNotNull;

import org.json.JSONException;
import org.json.JSONObject;
import org.junit.Before;
import org.junit.Test;

/**
 * @author facundo91
 *
 */
public class TestBusquedas {
	Busquedas gestionadorBusquedas = new Busquedas();

	/**
	 * @throws java.lang.Exception
	 */
	@Before
	public void setUp() throws Exception {
	}

	@Test
	public void testGestionadorBusquedas() throws Exception{
		assertNotNull(gestionadorBusquedas);
	}
	
	@Test (expected = JSONException.class)
	public void testBuscarPeliculaPorNombre() throws Exception{
		JSONObject respuesta = new JSONObject(gestionadorBusquedas.buscarPeliculaPorNombre("Pirates-of-the-Caribbean"));
		respuesta.get("statusCode");
	}
	
	@Test (expected = JSONException.class)
	public void testBuscarActorPorNombre() throws Exception{
		JSONObject respuesta = new JSONObject(gestionadorBusquedas.buscarActorPorNombre("Johnny-Depp"));
		respuesta.get("statusCode");
	}
	
	@Test (expected = JSONException.class)
	public void testBuscarPorNombre() throws Exception{
		JSONObject respuesta = new JSONObject(gestionadorBusquedas.buscarPorNombre("Chaplin"));
		respuesta.get("statusCode");
	}

}
