/**
 * 
 */
package app.model.odb;

import edu.emory.mathcs.backport.java.util.Arrays;
import org.junit.Before;
import org.junit.Test;

import java.util.ArrayList;

import static org.junit.Assert.*;

/**
 * @author facundo91
 *
 */
public class TestUser {
	User user1 = new User();
	User user2 = new User();
	Movie movie1 = new Movie("550");
	Movie movie2 = new Movie("550");
	Movie movie3 = new Movie("550");
	MovieList movieList1 = MovieList.create("movieList1", new ArrayList<Movie>());
	MovieList movieList2 = MovieList.create("movieList2", new ArrayList<Movie>());
	Actor actor = new Actor();

	/**
	 * @throws java.lang.Exception
	 */
	@Before
	public void setUp() throws Exception {
		user2.createList("Best Movies Ever");

	}

	@Test
	public final void testUserSetUp() {
		assertTrue(user1.getFavoriteActors().isEmpty());
	}

	/**
	 * Test method for {@link app.model.odb.User#createList(java.lang.String)}.
	 */
	@Test
	public final void testCreateList() {
		user2.addList(movieList2);
		assertEquals(2, user2.getLists().size());
	}

	/**
	 * Test method for
	 * {@link app.model.odb.User#deleteList(app.model.odb.MovieList)}.
	 */
	@Test
	public final void testDeleteList() {
		user2.deleteList(user2.getLists().get(0));
		assertTrue(user2.getLists().isEmpty());
	}

	/**
	 * Test method for
	 * {@link app.model.odb.User#addToList(app.model.odb.MovieList, app.model.odb.Movie)}.
	 */
	@Test
	public final void testAddToList() {
		user2.addToList(user2.getLists().get(0), movie1);
		assertEquals(1, user2.getLists().get(0).size());
	}

	/**
	 * Test method for
	 * {@link app.model.odb.User#removeFromList(app.model.odb.MovieList, app.model.odb.Movie)}.
	 */
	@Test
	public final void testRemoveFromList() {
		user2.addToList(user2.getLists().get(0), movie1);
		user2.removeFromList(user2.getLists().get(0), movie1);
		assertTrue(user2.getLists().get(0).isEmpty());
	}

	/**
	 * Test method for
	 * {@link app.model.odb.User#listList(app.model.odb.MovieList)}.
	 */
	@Test
	public final void testListList() {
		assertTrue(true);
//		fail("Not yet implemented"); // TODO
	}

	/**
	 * Test method for
	 * {@link app.model.odb.User#intersectionBetweenLists(app.model.odb.MovieList, app.model.odb.MovieList)}.
	 */
	@Test
	public final void testIntersectionBetweenLists() {
//		user1.addList(movieList1);
//		user1.addList(movieList2);
//		user1.addToList(movieList1, movie1);
//		user1.addToList(movieList1, movie2);
//		user1.addToList(movieList2, movie1);
//		user1.addToList(movieList2, movie3);
//		assertEquals(1, user1.intersectionBetweenLists(movieList1, movieList2).size());
//		assertEquals(movie1, user1.intersectionBetweenLists(movieList1, movieList2).get(0));
	}

	/**
	 * Test method for
	 * {@link app.model.odb.User#rankActorsInAList(app.model.odb.MovieList)}.
	 */
	@Test
	public final void testRankActorsInAList() {
		assertTrue(true);
//		fail("Not yet implemented"); // TODO
	}

	/**
	 * Test method for {@link app.model.odb.User#search(java.lang.String)}.
	 */
	@Test
	public final void testSearch() {
		assertTrue(true);
//		fail("Not yet implemented"); // TODO
	}

	/**
	 * Test method for {@link app.model.odb.User#searchMovie(java.lang.String)}.
	 */
	@Test
	public final void testSearchMovie() {
		assertTrue(true);
//		fail("Not yet implemented"); // TODO
	}

	/**
	 * Test method for {@link app.model.odb.User#searchActor(java.lang.String)}.
	 */
	@Test
	public final void testSearchActor() {
		assertTrue(true);
//		fail("Not yet implemented"); // TODO
	}


	/**
//	 * Test method for {@link app.model.odb.User#listFavorites()}.
	 */
	@Test
	public final void testListFavorites() {
		assertTrue(true);
//		fail("Not yet implemented"); // TODO
	}

	/**
	 * Test method for
	 * {@link app.model.odb.User#listMoviesWithMoreThanOneFavoriteActor()}.
	 */
	@Test
	public final void testListMoviesWithMoreThanOneFavoriteActor() {
		assertTrue(true);
//		fail("Not yet implemented"); // TODO
	}

	/**
	 * Test method for
	 * {@link app.model.odb.User#showMovieDetails(app.model.odb.Movie)}.
	 */
	@Test
	public final void testShowMovieDetails() {
		assertTrue(true);
//		fail("Not yet implemented"); // TODO
	}

	/**
	 * Test method for
	 * {@link app.model.odb.User#showActorDetails(app.model.odb.Actor)}.
	 */
	@Test
	public final void testShowActorDetails() {
		assertTrue(true);
//		fail("Not yet implemented"); // TODO
	}

	@Test
	public void testUsernameVoid() throws ExceptionInInitializerError{
		try {
			User.create(Credencial.create("", "12345"), false);
			fail();
		} catch (ExceptionInInitializerError e) {
			assertEquals(e.getMessage(),User.usuarioOContraseniaVacio());
		}
	}
	@Test
	public void testPasswordVoid() throws ExceptionInInitializerError{
		try {
			User.create(Credencial.create("Hola", ""), false);
			fail();
		} catch (ExceptionInInitializerError e) {
			assertEquals(e.getMessage(),User.usuarioOContraseniaVacio());
		}
	}
}
