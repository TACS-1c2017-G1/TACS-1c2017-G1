/**
 * 
 */
package app.service;

import static org.junit.Assert.assertNotNull;

import java.util.ArrayList;
import java.util.List;

import org.junit.Assert;
import org.junit.Before;
import org.junit.Test;

import app.model.odb.Movie;
import app.model.odb.MovieList;
import app.model.odb.User;
import app.repositories.RepositorioDeUsuarios;

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
	
	@Test
	public void testBusquedaUsuario() {
		List<Movie> pelis = new ArrayList<Movie>();
		List<MovieList> listas = new ArrayList<MovieList>();
		pelis.add(new Movie("150","Matrix"));
		listas.add(MovieList.create("Lista 1", pelis));
		listas.add(MovieList.create("Lista 2", pelis));
		RepositorioDeUsuarios.getInstance().insert(User.create("100", "AEC", listas));
		Assert.assertTrue(AdministrativoService.obtenerUsuario("100").getId()==100);
	}

}
