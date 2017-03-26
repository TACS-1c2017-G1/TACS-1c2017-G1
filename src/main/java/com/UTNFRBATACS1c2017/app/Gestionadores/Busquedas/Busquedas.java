package com.UTNFRBATACS1c2017.app.Gestionadores.Busquedas;

import java.util.ArrayList;
import java.util.List;

import org.json.*;

import com.UTNFRBATACS1c2017.app.helpers.Conector;
import com.UTNFRBATACS1c2017.app.others.Movie;

public class Busquedas {
	Conector conector = new Conector();

	public List<Movie> buscarPeliculaPorNombre(String query) throws Exception {
		JSONArray resultJsonArray = conector.getResource("search/movie", query).getJSONArray("results");
		List<Movie> resultList = new ArrayList<Movie>();
        for(int i=0; i<resultJsonArray.length() ; i++){
        	Movie movie = new Movie();
        	movie.setInfo(resultJsonArray.getJSONObject(i));
        	resultList.add(movie);
       }
		return resultList;
	}

	public JSONObject buscarActorPorNombre(String query) throws Exception {
		return conector.getResource("search/person", query);
	}

	public JSONObject buscarPorNombre(String query) throws Exception {
		return conector.getResource("search/multi", query);
	}

}