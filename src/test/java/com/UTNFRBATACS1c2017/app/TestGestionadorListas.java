/**
 * 
 */
package com.UTNFRBATACS1c2017.app;

import static org.junit.Assert.*;

import org.junit.Before;
import org.junit.Test;

/**
 * @author facundo91
 *
 */
public class TestGestionadorListas {

	/**
	 * @throws java.lang.Exception
	 */
	@Before
	public void setUp() throws Exception {
	}
	
	@Test
	public void testGestionadorListas() throws Exception{
		GestionadorListas gestionadorListas = new GestionadorListas();
		assertNotNull(gestionadorListas);
	}

}
