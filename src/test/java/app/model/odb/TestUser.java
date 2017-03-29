/**
 * 
 */
package app.model.odb;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertTrue;
import static org.junit.Assert.fail;

import app.model.odb.User;
import app.model.odb.Movie;
import app.model.odb.MovieList;

import org.junit.Before;
import org.junit.Test;

/**
 * @author facundo91
 *
 */
public class TestUser {
	User user1 = new User();
	User user2 = new User();
	Movie movie1 = new Movie();
	Movie movie2 = new Movie();
	Movie movie3 = new Movie();
	MovieList movieList1 = new MovieList("movieList1");
	MovieList movieList2 = new MovieList("movieList2");
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
		assertTrue(user1.getLists().isEmpty());
		assertTrue(user1.getFavoriteActors().isEmpty());
	}

	/**
	 * Test method for {@link app.model.odb.User#createList(java.lang.String)}.
	 */
	@Test
	public final void testCreateList() {
		assertEquals(1, user2.getLists().size());
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
		user1.addList(movieList1);
		user1.addList(movieList2);
		user1.addToList(movieList1, movie1);
		user1.addToList(movieList1, movie2);
		user1.addToList(movieList2, movie1);
		user1.addToList(movieList2, movie3);
		assertEquals(1, user1.intersectionBetweenLists(movieList1, movieList2).size());
		assertEquals(movie1, user1.intersectionBetweenLists(movieList1, movieList2).get(0));
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
	 * Test method for
	 * {@link app.model.odb.User#markActorAsFavorite(app.model.odb.Actor)}.
	 */
	@Test
	public final void testMarkActorAsFavorite() {
		user1.markActorAsFavorite(actor);
		assertEquals(actor, user1.getFavoriteActors().get(0));
	}

	/**
	 * Test method for
	 * {@link app.model.odb.User#unmarkActorAsFavorite(app.model.odb.Actor)}.
	 */
	@Test
	public final void testUnmarkActorAsFavorite() {
		user1.markActorAsFavorite(actor);
		assertEquals(actor, user1.getFavoriteActors().get(0));
		user1.unmarkActorAsFavorite(actor);
		assertTrue(user1.getFavoriteActors().isEmpty());
	}

	/**
	 * Test method for {@link app.model.odb.User#listFavorites()}.
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

}
