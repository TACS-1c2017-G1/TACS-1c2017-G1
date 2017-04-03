package app.model.tmdb;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Paths;

import org.apache.http.HttpEntity;
import org.apache.http.client.ClientProtocolException;
import org.apache.http.client.methods.CloseableHttpResponse;
import org.apache.http.client.methods.HttpGet;
import org.apache.http.impl.client.HttpClients;
import org.apache.http.util.EntityUtils;
import org.json.JSONException;
import org.json.JSONObject;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public abstract class TMDbStatic {

	private static String apiURL = "https://api.themoviedb.org/3/";

	private static String getApiURL() {
		return apiURL;
	}

	/**
	 * @param resource
	 * @param query
	 * @param pedir
	 * @return
	 * @throws IOException
	 * @throws ClientProtocolException
	 */
	private static JSONObject makeRequest(String resource, String query, String pedir)
			throws IOException, ClientProtocolException {
		HttpGet httpGet = new HttpGet(pedir);
		System.out.println(pedir);
		CloseableHttpResponse response1 = HttpClients.createDefault().execute(httpGet);
		Logger logger = LoggerFactory.getLogger(TMDbStatic.class);
		return getJsonObject(resource, query, response1, logger);
	}

	public static JSONObject getResource(String resource, String query) throws JSONException, IOException {
		String pedir = getApiURL() + resource + getApiKey() + "&query=" + query;
		return makeRequest(resource, query, pedir);
	}

	public static JSONObject getResource2(String resource, String query) throws JSONException, IOException {
		String pedir = getApiURL() + resource + "/" + query + getApiKey();
		return makeRequest(resource, query, pedir);
	}

	/**
	 * @return
	 * @throws IOException
	 */
	private static String getApiKey() throws IOException {
		String key = new String(Files.readAllBytes(Paths.get("resources")));
		return "?&api_key=" + key.substring(0, key.length() - 1);
	}

	private static JSONObject getJsonObject(String resource, String query, CloseableHttpResponse response1,
			Logger logger) throws IOException {
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

}
