package app.service;

import java.util.ArrayList;
import java.util.List;

import org.json.JSONArray;
import org.json.JSONObject;

import app.model.odb.Movie;
import app.model.tmdb.TheMovieDBDao;

public class BusquedasService {
	String query;
	TheMovieDBDao theMovieDBDao = new TheMovieDBDao();

	public List<Movie> buscarPeliculaPorNombre(String query) throws Exception {
		JSONArray resultJsonArray = this.getTheMovieDBDao().getResource("search/movie", query).getJSONArray("results");
		List<Movie> resultList = new ArrayList<Movie>();
		for (int i = 0; i < resultJsonArray.length(); i++) {
			Movie movie = new Movie();
			movie.setInfo(resultJsonArray.getJSONObject(i));
			resultList.add(movie);
		}
		return resultList;
	}

	public JSONObject buscarActorPorNombre(String query) throws Exception {
		return theMovieDBDao.getResource("search/person", query);
	}

	public JSONObject buscarPorNombre(String query) throws Exception {
		return theMovieDBDao.getResource("search/multi", query);
	}

	/**
	 * @return the query
	 */
	public String getQuery() {
		return query;
	}

	/**
	 * @param query
	 *            the query to set
	 */
	public void setQuery(String query) {
		this.query = query;
	}

	/**
	 * @return the conector
	 */
	private TheMovieDBDao getTheMovieDBDao() {
		return theMovieDBDao;
	}

}