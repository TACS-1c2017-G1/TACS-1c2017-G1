package app.service;

import app.model.odb.Credencial;
import app.model.odb.Movie;
import app.model.odb.MovieList;
import app.model.odb.User;
import app.repositories.RepositorioDeUsuarios;
import org.junit.After;
import org.junit.Assert;
import org.junit.Test;

import java.util.ArrayList;
import java.util.List;

public class TestUser {

	UserService servicioUsuario = new UserService();

	@Test
	public void testBusquedaUsuario() {
		List<Movie> pelis = new ArrayList<Movie>();
		List<MovieList> listas = new ArrayList<MovieList>();
		pelis.add(Movie.create(150,"Matrix"));
		listas.add(MovieList.create("Lista 1", pelis));
		listas.add(MovieList.create("Lista 2", pelis));
		RepositorioDeUsuarios.getInstance().insert(User.create(Credencial.create("Carlos","123")));
		Assert.assertTrue(servicioUsuario.obtenerUsuario("0").getId()==0);
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

		User usuario1 = User.create(Credencial.create("Carlos","124"));
		usuario1.setId(100);
		usuario1.setLists(listas1);

		User usuario2 = User.create(Credencial.create("Carlos2","123"));
		usuario2.setId(50);
		usuario2.setLists(listas2);

		RepositorioDeUsuarios.getInstance().insert(usuario1);
		RepositorioDeUsuarios.getInstance().insert(usuario2);
		List<Movie> interseccion = new ArrayList<Movie>();
		interseccion.add(Movie.create(100,"Star Wars"));
		Assert.assertEquals(servicioUsuario.obtenerInterseccionListas("100", "50"),interseccion);
	}
	
	@After
	public void repoReset(){
		RepositorioDeUsuarios.getInstance().clear();
	}
}
