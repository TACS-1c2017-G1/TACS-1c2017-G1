package app.model.odb;

import org.junit.Assert;
import org.junit.Test;

import java.util.ArrayList;
import java.util.List;

import static org.junit.Assert.assertTrue;

public class TestMovieList {

	@Test
	public void interseccionListas() {
		MovieList lista = MovieList.create("Primer lista", new ArrayList<>());
		MovieList otraLista = MovieList.create("Segunda lista", new ArrayList<>());
		Movie peli = Movie.create(1, "Primer Peli");
		Movie otraPeli = Movie.create(2, "Segunda peli");
		lista.addMovie(peli);
		otraLista.addMovie(peli);
		otraLista.addMovie(otraPeli);
		assertTrue(lista.size() == 1);
		assertTrue(otraLista.size() == 2);
		List<Movie> interseccion = new ArrayList<Movie>();
		interseccion.add(peli);
		Assert.assertEquals(interseccion, lista.intersectionWith(otraLista));
		otraLista.removeMovie(peli);
		assertTrue(otraLista.size() == 1);
		assertTrue(lista.intersectionWith(otraLista).isEmpty());		
	}

}
