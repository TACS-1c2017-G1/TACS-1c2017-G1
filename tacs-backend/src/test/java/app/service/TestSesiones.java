/**
 * 
 */
package app.service;

import static org.junit.Assert.assertNotNull;

import org.junit.Before;
import org.junit.Test;

/**
 * @author facundo91
 *
 */
public class TestSesiones {

	/**
	 * @throws java.lang.Exception
	 */
	@Before
	public void setUp() throws Exception {
	}

	@Test
	public void testGestionadorSesiones() throws Exception {
		SesionesService sersionesService = new SesionesService();
		assertNotNull(sersionesService);
	}

}
