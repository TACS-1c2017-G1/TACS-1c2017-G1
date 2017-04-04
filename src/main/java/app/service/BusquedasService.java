package app.service;

import java.util.ArrayList;
import java.util.List;

import org.json.JSONArray;
import org.json.JSONObject;
import org.springframework.stereotype.Service;

import app.model.odb.Actor;
import app.model.odb.Movie;
import app.model.odb.MovieList;
import app.model.tmdb.TMDbStatic;

@Service
public abstract class BusquedasService {

	public static MovieList buscarPeliculaPorNombre(String query) throws Exception {
		JSONArray resultJsonArray = buscarPeliculaPorNombreJson(query).getJSONArray("results");
		MovieList resultList = new MovieList();
		resultList.setName("Resultados de buscar " + query);
		for (int i = 0; i < resultJsonArray.length(); i++) {
			resultList.addMovie(new Movie(resultJsonArray.getJSONObject(i)));
		}
		return resultList;
	}

	public static JSONObject buscarPeliculaPorNombreJson(String query) throws Exception {
		return TMDbStatic.getResource("search/movie", query);
	}

	public static List<Actor> buscarActorPorNombre(String query) throws Exception {
		JSONArray resultJsonArray = buscarActorPorNombreJson(query).getJSONArray("results");
		List<Actor> resultList = new ArrayList<Actor>();
		for (int i = 0; i < resultJsonArray.length(); i++) {
			Actor actor = new Actor();
			actor.setInfo(resultJsonArray.getJSONObject(i));
			resultList.add(actor);
		}
		return resultList;
	}

	public static JSONObject buscarActorPorNombreJson(String query) throws Exception {
		return TMDbStatic.getResource("search/person", query);
	}

	public static JSONObject buscarPorNombre(String query) throws Exception {
		return TMDbStatic.getResource("search/multi", query);
	}

}