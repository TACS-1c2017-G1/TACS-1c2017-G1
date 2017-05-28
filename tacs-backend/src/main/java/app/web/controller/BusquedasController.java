package app.web.controller;

import app.service.BusquedasService;
import org.json.JSONArray;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

@Controller
@CrossOrigin
@RequestMapping(value = "/search")
public class BusquedasController {
	
	@Autowired
	BusquedasService servicioBusquedas;

	@RequestMapping(value = "/movie/{query}", method = RequestMethod.GET, produces = "application/json")
	@ResponseStatus(HttpStatus.OK)
	public @ResponseBody String busquedaPeliculaJson(@RequestHeader String Token, @PathVariable String query, @RequestParam String page)
			throws Exception {
		
		return servicioBusquedas.buscarPeliculaPorNombreJson(query, Token, page).toString();
	}

	@RequestMapping(value = "/person/{query}", method = RequestMethod.GET, produces = "application/json")
	@ResponseStatus(HttpStatus.OK)
	public @ResponseBody String busquedaActorJson(@RequestHeader String Token, @PathVariable String query, @RequestParam String page)
			throws Exception {
		return servicioBusquedas.buscarActorPorNombreJson(query, Token, page).toString();
	}

	@RequestMapping(value = "/{query}", method = RequestMethod.GET, produces = "application/json")
	@ResponseStatus(HttpStatus.OK)
	public @ResponseBody String busqueda(@RequestHeader String Token, @PathVariable String query, @RequestParam String page) throws Exception {
		JSONObject respuesta = servicioBusquedas.buscarPorNombre(query, Token, page);
		JSONArray list = new JSONArray();
		JSONArray jsonArray = respuesta.getJSONArray("results");
		int len = jsonArray.length();
		if (jsonArray != null) {
			for (int i = 0; i < len; i++) {
				String mediaType = jsonArray.getJSONObject(i).getString("media_type");
				if (!mediaType.equalsIgnoreCase("tv")) {
					list.put(jsonArray.get(i));
				}
			}
		}
		respuesta.remove("results");
		respuesta.put("results", list);
		return respuesta.toString();
	}

}