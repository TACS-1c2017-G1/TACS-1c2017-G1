package com.UTNFRBATACS1c2017.app;

import java.nio.file.Files;
import java.nio.file.Paths;

import okhttp3.OkHttpClient;
import okhttp3.Request;
import okhttp3.Response;

public class Conector {
  private static OkHttpClient client = new OkHttpClient();
  private static String apiURL = "https://api.themoviedb.org/3/";
  private static String api_key = "";  
  
  private static void setApi_key(String key) {
	Conector.api_key = "?&api_key=" + key +"&query=";
  }

  public static String run(String resource, String query) throws Exception {
	  String key = new String(Files.readAllBytes(Paths.get(".resources")));
	  Conector.setApi_key(key.substring(0,key.length()-1));
    Request request = new Request.Builder()
        .url(apiURL+resource+api_key+query)
        .get()
        .build();

    	Response response = client.newCall(request).execute();
    	return response.body().string();
  }
  
}