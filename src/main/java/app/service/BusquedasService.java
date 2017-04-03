package app.service;

import java.util.ArrayList;
import java.util.List;

import org.json.JSONArray;
import org.json.JSONObject;

import app.model.odb.Actor;
import app.model.odb.Movie;
import app.model.odb.MovieList;
import app.model.tmdb.TMDbStatic;

public class BusquedasService {
	private String query;

	public MovieList buscarPeliculaPorNombre(String query) throws Exception {
		JSONArray resultJsonArray = this.buscarPeliculaPorNombreJson(query).getJSONArray("results");
		MovieList resultList = new MovieList();
		resultList.setName("Resultados de buscar " + query);
		for (int i = 0; i < resultJsonArray.length(); i++) {
			resultList.addMovie(new Movie(resultJsonArray.getJSONObject(i)));
		}
		return resultList;
	}

	public JSONObject buscarPeliculaPorNombreJson(String query) throws Exception {
		return TMDbStatic.getResource("search/movie", query);
	}

	public List<Actor> buscarActorPorNombre(String query) throws Exception {
		JSONArray resultJsonArray = this.buscarActorPorNombreJson(query).getJSONArray("results");
		List<Actor> resultList = new ArrayList<Actor>();
		for (int i = 0; i < resultJsonArray.length(); i++) {
			Actor actor = new Actor();
			actor.setInfo(resultJsonArray.getJSONObject(i));
			resultList.add(actor);
		}
		return resultList;
	}

	public JSONObject buscarActorPorNombreJson(String query) throws Exception {
		return TMDbStatic.getResource("search/person", query);
	}

	public JSONObject buscarPorNombre(String query) throws Exception {
		return TMDbStatic.getResource("search/multi", query);
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

}