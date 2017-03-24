/**
 * 
 */
package com.UTNFRBATACS1c2017.app.Gestionadores.Administrativo;

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
	public void testGestionadorAdministrativo() throws Exception{
		Administrativo gestionadorAdministrativo = new Administrativo();
		assertNotNull(gestionadorAdministrativo);
	}

}
