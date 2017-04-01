package app.model.tmdb;

import org.apache.http.HttpEntity;
import org.apache.http.client.methods.CloseableHttpResponse;
import org.apache.http.client.methods.HttpGet;
import org.apache.http.impl.client.CloseableHttpClient;
import org.apache.http.impl.client.HttpClients;
import org.apache.http.util.EntityUtils;
import org.json.JSONException;
import org.json.JSONObject;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Paths;

public class TheMovieDBDao {

	private String apiURL = "https://api.themoviedb.org/3/";
	private String api_key = "";
	private CloseableHttpClient httpclient = HttpClients.createDefault();

	private CloseableHttpClient getHttpclient() {
		return httpclient;
	}

	private String getApiURL() {
		return apiURL;
	}

	private void setApi_key(String key) {
		api_key = "?&api_key=" + key;
	}

	public JSONObject getResource(String resource, String query) throws JSONException, IOException {
		String key = new String(Files.readAllBytes(Paths.get("resources")));
		this.setApi_key(key.substring(0, key.length() - 1));
		HttpGet httpGet = new HttpGet(this.getApiURL() + resource + this.getApi_key() + "&query=" + query);
		CloseableHttpResponse response1 = this.getHttpclient().execute(httpGet);
		Logger logger = LoggerFactory.getLogger(TheMovieDBDao.class);

		return getJsonObject(resource, query, response1, logger);
	}

	public JSONObject getResource2(String resource, String query) throws JSONException, IOException {
		String key = new String(Files.readAllBytes(Paths.get("resources")));
		this.setApi_key(key.substring(0, key.length() - 1));
		String pedir = this.getApiURL() + resource + "/" + query + this.getApi_key();
		HttpGet httpGet = new HttpGet(pedir);
		System.out.println(pedir);
		CloseableHttpResponse response1 = this.getHttpclient().execute(httpGet);
		Logger logger = LoggerFactory.getLogger(TheMovieDBDao.class);

		return getJsonObject(resource, query, response1, logger);
	}

	private JSONObject getJsonObject(String resource, String query, CloseableHttpResponse response1, Logger logger) throws IOException {
		try {
			HttpEntity entity1 = response1.getEntity();
			String response2 = EntityUtils.toString(entity1);
			logger.debug("Recurso: " + resource + " Query: " + query + " Respuesta: " + response2);
			JSONObject respuesta = new JSONObject(response2);
			EntityUtils.consume(entity1);
			return respuesta;
		} finally {
			response1.close();
		}
	}

	private String getApi_key() {
		return api_key;
	}

}
