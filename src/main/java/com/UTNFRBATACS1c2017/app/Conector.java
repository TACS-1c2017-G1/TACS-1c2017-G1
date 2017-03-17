package com.UTNFRBATACS1c2017.app;

import java.io.IOException;
import okhttp3.OkHttpClient;
import okhttp3.Request;
import okhttp3.Response;

public class Conector {
  OkHttpClient client = new OkHttpClient();
  private String apiURL = "https://api.themoviedb.org/3/";
  private String api_key = "api_key=76e19488d670621ca05341b858d5aa16";  
  
  private String run(String url) throws IOException {
    Request request = new Request.Builder()
        .url(apiURL+url+api_key)
        .build();

    try (Response response = client.newCall(request).execute()) {
      return response.body().string();
    }
  }

  public String fichaPeli(Integer movieCodigo) throws IOException {
    return this.run("movie/"+movieCodigo.toString()+"?");
  }
  
  public static void main(String[] args) throws IOException{
	  System.out.println(new Conector().fichaPeli(550));
  }
}