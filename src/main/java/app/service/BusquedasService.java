package app.service;

import java.util.ArrayList;
import java.util.List;

import org.json.JSONArray;
import org.json.JSONObject;

import app.model.odb.Actor;
import app.model.odb.Movie;
import app.model.odb.MovieList;
import app.model.tmdb.TheMovieDBDao;

public class BusquedasService {
	private String query;
	private TheMovieDBDao theMovieDBDao = new TheMovieDBDao();

	public MovieList buscarPeliculaPorNombre(String query) throws Exception {
		JSONArray resultJsonArray = this.getTheMovieDBDao().getResource("search/movie", query).getJSONArray("results");
		MovieList resultList = new MovieList();
		resultList.setName("Resultados de buscar "+query);
		for (int i = 0; i < resultJsonArray.length(); i++) {
			Movie movie = new Movie();
			movie.setInfo(resultJsonArray.getJSONObject(i));
			resultList.addMovie(movie);
		}
		return resultList;
	}

	public List<Actor> buscarActorPorNombre(String query) throws Exception {
		JSONArray resultJsonArray = this.getTheMovieDBDao().getResource("search/person", query).getJSONArray("results");
		List<Actor> resultList = new ArrayList<Actor>();
		for (int i = 0; i < resultJsonArray.length(); i++) {
			Actor actor = new Actor();
			actor.setInfo(resultJsonArray.getJSONObject(i));
			resultList.add(actor);
		}
		return resultList;
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
	public TheMovieDBDao getTheMovieDBDao() {
		return theMovieDBDao;
	}

}