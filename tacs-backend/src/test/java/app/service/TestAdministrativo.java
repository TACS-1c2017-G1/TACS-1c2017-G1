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
public class TestAdministrativo {

	/**
	 * @throws java.lang.Exception
	 */
	@Before
	public void setUp() throws Exception {
	}
	

	@Test
	public void testAdministrativoService() throws Exception {
		AdministrativoService administrativoService = new AdministrativoService();
		assertNotNull(administrativoService);
	}

}
