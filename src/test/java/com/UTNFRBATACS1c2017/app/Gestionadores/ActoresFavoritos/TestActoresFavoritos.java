/**
 * 
 */
package com.UTNFRBATACS1c2017.app.Gestionadores.ActoresFavoritos;

import static org.junit.Assert.*;

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
	public void testGestionadorActoresFavoritos() throws Exception{
		ActoresFavoritos gestionadorActoresFavoritos = new ActoresFavoritos();
		assertNotNull(gestionadorActoresFavoritos);
	}

}
