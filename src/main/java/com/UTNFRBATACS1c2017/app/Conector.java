package com.UTNFRBATACS1c2017.app;

import okhttp3.OkHttpClient;
import okhttp3.Request;
import okhttp3.Response;

public class Conector {
  static OkHttpClient client = new OkHttpClient();
  private static String apiURL = "https://api.themoviedb.org/3/";
  private static String api_key = "?&api_key=76e19488d670621ca05341b858d5aa16&query=";  
  
  public static String run(String resource, String query) throws Exception {
    Request request = new Request.Builder()
        .url(apiURL+resource+api_key+query)
        .get()
        .build();

    try (Response response = client.newCall(request).execute()) {
      return response.body().string();
    }
  }
  
  public static void main(String[] args) {
  }
}