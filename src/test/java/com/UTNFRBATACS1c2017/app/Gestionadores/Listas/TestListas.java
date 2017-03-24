/**
 * 
 */
package com.UTNFRBATACS1c2017.app.Gestionadores.Listas;

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
	public void testGestionadorListas() throws Exception{
		Listas gestionadorListas = new Listas();
		assertNotNull(gestionadorListas);
	}

}
