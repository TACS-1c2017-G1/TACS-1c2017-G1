/**
 * 
 */
package com.UTNFRBATACS1c2017.app.others;

import static org.junit.Assert.*;

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
	 * Test method for
	 * {@link com.UTNFRBATACS1c2017.app.others.User#createList(java.lang.String)}.
	 */
	@Test
	public final void testCreateList() {
		assertEquals(1, user2.getLists().size());
	}

	/**
	 * Test method for
	 * {@link com.UTNFRBATACS1c2017.app.others.User#deleteList(com.UTNFRBATACS1c2017.app.others.MovieList)}.
	 */
	@Test
	public final void testDeleteList() {
		user2.deleteList(user2.getLists().get(0));
		assertTrue(user2.getLists().isEmpty());
	}

	/**
	 * Test method for
	 * {@link com.UTNFRBATACS1c2017.app.others.User#addToList(com.UTNFRBATACS1c2017.app.others.MovieList, com.UTNFRBATACS1c2017.app.others.Movie)}.
	 */
	@Test
	public final void testAddToList() {
		user2.addToList(user2.getLists().get(0), movie1);
		assertEquals(1, user2.getLists().get(0).size());
	}

	/**
	 * Test method for
	 * {@link com.UTNFRBATACS1c2017.app.others.User#removeFromList(com.UTNFRBATACS1c2017.app.others.MovieList, com.UTNFRBATACS1c2017.app.others.Movie)}.
	 */
	@Test
	public final void testRemoveFromList() {
		user2.addToList(user2.getLists().get(0), movie1);
		user2.removeFromList(user2.getLists().get(0), movie1);
		assertTrue(user2.getLists().get(0).isEmpty());
	}

	/**
	 * Test method for
	 * {@link com.UTNFRBATACS1c2017.app.others.User#listList(com.UTNFRBATACS1c2017.app.others.MovieList)}.
	 */
	@Test
	public final void testListList() {
		fail("Not yet implemented"); // TODO
	}

	/**
	 * Test method for
	 * {@link com.UTNFRBATACS1c2017.app.others.User#intersectionBetweenLists(com.UTNFRBATACS1c2017.app.others.MovieList, com.UTNFRBATACS1c2017.app.others.MovieList)}.
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
	 * {@link com.UTNFRBATACS1c2017.app.others.User#rankActorsInAList(com.UTNFRBATACS1c2017.app.others.MovieList)}.
	 */
	@Test
	public final void testRankActorsInAList() {
		fail("Not yet implemented"); // TODO
	}

	/**
	 * Test method for
	 * {@link com.UTNFRBATACS1c2017.app.others.User#search(java.lang.String)}.
	 */
	@Test
	public final void testSearch() {
		fail("Not yet implemented"); // TODO
	}

	/**
	 * Test method for
	 * {@link com.UTNFRBATACS1c2017.app.others.User#searchMovie(java.lang.String)}.
	 */
	@Test
	public final void testSearchMovie() {
		fail("Not yet implemented"); // TODO
	}

	/**
	 * Test method for
	 * {@link com.UTNFRBATACS1c2017.app.others.User#searchActor(java.lang.String)}.
	 */
	@Test
	public final void testSearchActor() {
		fail("Not yet implemented"); // TODO
	}

	/**
	 * Test method for
	 * {@link com.UTNFRBATACS1c2017.app.others.User#markActorAsFavorite(com.UTNFRBATACS1c2017.app.others.Actor)}.
	 */
	@Test
	public final void testMarkActorAsFavorite() {
		user1.markActorAsFavorite(actor);
		assertEquals(actor, user1.getFavoriteActors().get(0));
	}

	/**
	 * Test method for
	 * {@link com.UTNFRBATACS1c2017.app.others.User#unmarkActorAsFavorite(com.UTNFRBATACS1c2017.app.others.Actor)}.
	 */
	@Test
	public final void testUnmarkActorAsFavorite() {
		user1.markActorAsFavorite(actor);
		assertEquals(actor, user1.getFavoriteActors().get(0));
		user1.unmarkActorAsFavorite(actor);
		assertTrue(user1.getFavoriteActors().isEmpty());
	}

	/**
	 * Test method for
	 * {@link com.UTNFRBATACS1c2017.app.others.User#listFavorites()}.
	 */
	@Test
	public final void testListFavorites() {
		fail("Not yet implemented"); // TODO
	}

	/**
	 * Test method for
	 * {@link com.UTNFRBATACS1c2017.app.others.User#listMoviesWithMoreThanOneFavoriteActor()}.
	 */
	@Test
	public final void testListMoviesWithMoreThanOneFavoriteActor() {
		fail("Not yet implemented"); // TODO
	}

	/**
	 * Test method for
	 * {@link com.UTNFRBATACS1c2017.app.others.User#showMovieDetails(com.UTNFRBATACS1c2017.app.others.Movie)}.
	 */
	@Test
	public final void testShowMovieDetails() {
		fail("Not yet implemented"); // TODO
	}

	/**
	 * Test method for
	 * {@link com.UTNFRBATACS1c2017.app.others.User#showActorDetails(com.UTNFRBATACS1c2017.app.others.Actor)}.
	 */
	@Test
	public final void testShowActorDetails() {
		fail("Not yet implemented"); // TODO
	}

}
