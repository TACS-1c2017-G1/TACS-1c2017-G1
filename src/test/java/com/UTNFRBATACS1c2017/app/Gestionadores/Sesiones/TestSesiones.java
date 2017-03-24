/**
 * 
 */
package com.UTNFRBATACS1c2017.app.Gestionadores.Sesiones;

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
		Sesiones gestionadorSesiones = new Sesiones();
		assertNotNull(gestionadorSesiones);
	}

}
