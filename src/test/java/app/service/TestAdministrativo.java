/**
 * 
 */
package app.service;

import static org.junit.Assert.assertNotNull;

import java.util.ArrayList;
import java.util.List;

import org.junit.After;
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
		pelis.add(Movie.create(150,"Matrix"));
		listas.add(MovieList.create("Lista 1", pelis));
		listas.add(MovieList.create("Lista 2", pelis));
		RepositorioDeUsuarios.getInstance().insert(User.create("100", "AEC", listas));
		Assert.assertTrue(AdministrativoService.obtenerUsuario("100").getId()==100);
	}
	
	@Test
	public void testInterseccionListasUsuario(){
		List<Movie> pelis1 = new ArrayList<Movie>();
		List<Movie> pelis2 = new ArrayList<Movie>();
		List<MovieList> listas1 = new ArrayList<MovieList>();
		List<MovieList> listas2 = new ArrayList<MovieList>();
		pelis1.add(Movie.create(150,"Matrix"));
		pelis1.add(Movie.create(100,"Star Wars"));
		pelis2.add(Movie.create(50,"Toy Story"));
		pelis2.add(Movie.create(100,"Star Wars"));
		listas1.add(MovieList.create("Lista 1", pelis1));
		listas2.add(MovieList.create("Lista 2", pelis2));
		RepositorioDeUsuarios.getInstance().insert(User.create("100", "AEC", listas1));
		RepositorioDeUsuarios.getInstance().insert(User.create("50", "WOC", listas2));
		List<Movie> interseccion = new ArrayList<Movie>();
		interseccion.add(Movie.create(100,"Star Wars"));
		Assert.assertEquals(AdministrativoService.obtenerInterseccionListas("100", "50"),interseccion);
	}
	
	@After
	public void repoReset(){
		RepositorioDeUsuarios.getInstance().clear();
	}

}
