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
public class TestActoresFavoritos {

	/**
	 * @throws java.lang.Exception
	 */
	@Before
	public void setUp() throws Exception {
	}

	@Test
	public void testGestionadorActoresFavoritos() throws Exception {
		ActoresFavoritosService actoresFavoritosService = new ActoresFavoritosService();
		assertNotNull(actoresFavoritosService);
	}

}
