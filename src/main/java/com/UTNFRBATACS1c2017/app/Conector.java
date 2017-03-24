package com.UTNFRBATACS1c2017.app;

import java.nio.file.Files;
import java.nio.file.Paths;

import org.apache.http.HttpEntity;
import org.apache.http.client.methods.CloseableHttpResponse;
import org.apache.http.client.methods.HttpGet;
import org.apache.http.impl.client.CloseableHttpClient;
import org.apache.http.impl.client.HttpClients;
import org.apache.http.util.EntityUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class Conector {

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
		api_key = "?&api_key=" + key +"&query=";
	}

	public String getResource(String resource, String query) throws Exception {
		String key = new String(Files.readAllBytes(Paths.get(".resources")));
		this.setApi_key(key.substring(0,key.length()-1));
		HttpGet httpGet = new HttpGet(this.getApiURL()+resource+this.getApi_key()+query);
		CloseableHttpResponse response1 = this.getHttpclient().execute(httpGet);
//		Logger logger = LoggerFactory.getLogger(Conector.class);

		try {
			HttpEntity entity1 = response1.getEntity();
			String response2 = EntityUtils.toString(entity1);
//			logger.info("Recurso: "+resource+" Query: "+query+" Respuesta: "+response2);
			EntityUtils.consume(entity1);
			return response2;
		} finally {
			response1.close();
		} 
	}

	private String getApi_key() {
		return api_key;
	}
}