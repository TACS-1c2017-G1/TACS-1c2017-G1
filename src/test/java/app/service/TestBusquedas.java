/**
 * 
 */
package app.service;

import static org.junit.Assert.assertNotNull;

import org.json.JSONException;
import org.junit.Before;
import org.junit.Test;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

/**
 * @author facundo91
 *
 */
public class TestBusquedas {
	BusquedasService busquedasService = new BusquedasService();
	Logger logger = LoggerFactory.getLogger(TestBusquedas.class);

	/**
	 * @throws java.lang.Exception
	 */
	@Before
	public void setUp() throws Exception {
	}

	@Test
	public void testBusquedasService() throws Exception {
		assertNotNull(busquedasService);
	}

	// @Test //FIXME
	// public void testBuscarPeliculaPorNombreCrearMovie() throws Exception {
	// JSONArray jsonArray =
	// gestionadorBusquedas.buscarPeliculaPorNombre("Pirates-of-the-Caribbean");
	// assertTrue(jsonArray.getJSONObject(0).getString("title").startsWith("Pirates
	// of the Caribbean"));
	// }

//	@Test(expected = JSONException.class)
//	public void testBuscarActorPorNombre() throws Exception {
//		busquedasService.buscarActorPorNombre("Johnny-Depp").get("statusCode");
//	}

	@Test(expected = JSONException.class)
	public void testBuscarPorNombre() throws Exception {
		busquedasService.buscarPorNombre("Chaplin").get("statusCode");
	}

}
