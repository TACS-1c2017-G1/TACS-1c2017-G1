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
public class TestListas {

	/**
	 * @throws java.lang.Exception
	 */
	@Before
	public void setUp() throws Exception {
	}

	@Test
	public void testListasService() throws Exception {
		ListasService listasService = new ListasService();
		assertNotNull(listasService);
	}

}
