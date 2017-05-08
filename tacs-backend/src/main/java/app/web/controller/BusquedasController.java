package app.web.controller;

import org.json.JSONArray;
import org.json.JSONObject;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import app.service.BusquedasService;

@Controller
@CrossOrigin
@RequestMapping(value = "/search")
public class BusquedasController {

	@RequestMapping(value = "/movie/{query}", method = RequestMethod.GET, produces = "application/json")
	@ResponseStatus(HttpStatus.OK)
	public @ResponseBody String busquedaPeliculaJson(@RequestHeader String Token, @PathVariable String query)
			throws Exception {
		return BusquedasService.buscarPeliculaPorNombreJson(query).toString();
	}

	@RequestMapping(value = "/person/{query}", method = RequestMethod.GET, produces = "application/json")
	@ResponseStatus(HttpStatus.OK)
	public @ResponseBody String busquedaActorJson(@RequestHeader String Token, @PathVariable String query)
			throws Exception {
		return BusquedasService.buscarActorPorNombreJson(query).toString();
	}

	@RequestMapping(value = "/{query}", method = RequestMethod.GET, produces = "application/json")
	@ResponseStatus(HttpStatus.OK)
	public @ResponseBody String busqueda(@RequestHeader String Token, @PathVariable String query) throws Exception {
		JSONObject respuesta = BusquedasService.buscarPorNombre(query);
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