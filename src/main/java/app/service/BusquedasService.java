package app.service;

import org.json.JSONArray;
import org.json.JSONObject;

import app.model.tmdb.TheMovieDBDao;

public class BusquedasService {

	TheMovieDBDao tmdbDao = new TheMovieDBDao();

	public JSONArray buscarPeliculaPorNombre(String query) throws Exception {
		return tmdbDao.getResource("search/movie", query).getJSONArray("results");
	}

	public JSONObject buscarActorPorNombre(String query) throws Exception {
		return tmdbDao.getResource("search/person", query);
	}

	public JSONObject buscarPorNombre(String query) throws Exception {
		return tmdbDao.getResource("search/multi", query);
	}
}
