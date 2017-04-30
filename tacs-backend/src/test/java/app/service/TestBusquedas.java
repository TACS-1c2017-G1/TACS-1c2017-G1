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
	Logger logger = LoggerFactory.getLogger(TestBusquedas.class);

	/**
	 * @throws java.lang.Exception
	 */
	@Before
	public void setUp() throws Exception {
	}

	@Test
	public void testBusquedasService() throws Exception {
		assertNotNull(BusquedasService.class);
	}

	@Test(expected = JSONException.class)
	public void testBuscarPorNombre() throws Exception {
		BusquedasService.buscarPorNombre("Chaplin").get("statusCode");
	}

}
