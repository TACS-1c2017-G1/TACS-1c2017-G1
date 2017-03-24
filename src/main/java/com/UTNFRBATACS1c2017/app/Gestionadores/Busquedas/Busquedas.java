package com.UTNFRBATACS1c2017.app.Gestionadores.Busquedas;

import org.json.*;

import com.UTNFRBATACS1c2017.app.helpers.Conector;

public class Busquedas {
	Conector conector = new Conector();

	public JSONArray buscarPeliculaPorNombre(String query) throws Exception {
		return conector.getResource("search/movie", query).getJSONArray("results");
	}

	public JSONObject buscarActorPorNombre(String query) throws Exception {
		return conector.getResource("search/person", query);
	}

	public JSONObject buscarPorNombre(String query) throws Exception {
		return conector.getResource("search/multi", query);
	}

}