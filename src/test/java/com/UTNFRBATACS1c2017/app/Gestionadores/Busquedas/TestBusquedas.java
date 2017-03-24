/**
 * 
 */
package com.UTNFRBATACS1c2017.app.Gestionadores.Busquedas;

import static org.junit.Assert.*;

import com.UTNFRBATACS1c2017.app.others.Movie;

import org.json.*;
import org.junit.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

/**
 * @author facundo91
 *
 */
public class TestBusquedas {
	Busquedas gestionadorBusquedas = new Busquedas();
	Logger logger = LoggerFactory.getLogger(TestBusquedas.class);

	/**
	 * @throws java.lang.Exception
	 */
	@Before
	public void setUp() throws Exception {
	}

	@Test
	public void testGestionadorBusquedas() throws Exception {
		assertNotNull(gestionadorBusquedas);
	}

	@Test
	public void testBuscarPeliculaPorNombreCrearMovie() throws Exception {
		JSONArray jsonArray = gestionadorBusquedas.buscarPeliculaPorNombre("Pirates-of-the-Caribbean");
		assertTrue(jsonArray.getJSONObject(0).getString("title").startsWith("Pirates of the Caribbean"));
	}

	@Test(expected = JSONException.class)
	public void testBuscarActorPorNombre() throws Exception {
		gestionadorBusquedas.buscarActorPorNombre("Johnny-Depp").get("statusCode");
	}

	@Test(expected = JSONException.class)
	public void testBuscarPorNombre() throws Exception {
		gestionadorBusquedas.buscarPorNombre("Chaplin").get("statusCode");
	}

}
