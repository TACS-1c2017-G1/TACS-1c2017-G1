package app.service;

import java.util.ArrayList;
import java.util.List;

import org.junit.Assert;
import org.junit.Test;

import app.model.odb.Movie;
import app.model.odb.MovieList;
import app.model.odb.User;
import app.repositories.RepositorioDeUsuarios;

public class TestUser {
	
	UserService servicioUsuario = new UserService();

	@Test
	public void testBusquedaUsuario() {
		List<Movie> pelis = new ArrayList<Movie>();
		List<MovieList> listas = new ArrayList<MovieList>();
		pelis.add(Movie.create(150,"Matrix"));
		listas.add(MovieList.create("Lista 1", pelis));
		listas.add(MovieList.create("Lista 2", pelis));
		RepositorioDeUsuarios.getInstance().insert(User.create("100", listas));
		Assert.assertTrue(servicioUsuario.obtenerUsuario("100").getId()==100);
	}
}
