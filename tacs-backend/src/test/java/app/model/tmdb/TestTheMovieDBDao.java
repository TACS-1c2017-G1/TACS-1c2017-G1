/**
 * 
 */
package app.model.tmdb;

import static org.junit.Assert.assertNotNull;

import org.junit.Before;
import org.junit.Test;

/**
 * @author facundo91
 *
 */
public class TestTheMovieDBDao {

	/**
	 * @throws java.lang.Exception
	 */
	@Before
	public void setUp() throws Exception {
	}

	/**
	 * Test method for
	 * {@link com.UTNFRBATACS1c2017.app.helpers.Conector#getResource(java.lang.String, java.lang.String)}.
	 */
	@Test
	public void testConector() throws Exception {
		TheMovieDBDao theMovieDBDao = new TheMovieDBDao();
		assertNotNull(theMovieDBDao);
	}

}
