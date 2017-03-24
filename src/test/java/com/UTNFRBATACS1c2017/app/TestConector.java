/**
 * 
 */
package com.UTNFRBATACS1c2017.app;

import static org.junit.Assert.assertNotNull;

import org.junit.Before;
import org.junit.Test;

/**
 * @author facundo91
 *
 */
public class TestConector {

	/**
	 * @throws java.lang.Exception
	 */
	@Before
	public void setUp() throws Exception {
	}

	/**
	 * Test method for {@link com.UTNFRBATACS1c2017.app.Conector#getResource(java.lang.String, java.lang.String)}.
	 */
	@Test
	public void testConector() throws Exception{
		Conector conector = new Conector();
		assertNotNull(conector);
	}

}
