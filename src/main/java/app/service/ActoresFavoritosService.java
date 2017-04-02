package app.service;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

import org.json.JSONException;

import app.model.dto.ActorDto;
import app.model.dto.MoviDto;

public class ActoresFavoritosService {

	public static ActorDto maracarActorFavorito( String idActor ) throws JSONException, IOException {
		ActorDto actor = new ActorDto(idActor, "un Nombre");
		actor.setFavorite(true);
		return actor;
	}
	
	
	public static ActorDto desmarcarActorFavorito( String idActor ) throws JSONException, IOException {
		ActorDto actor = new ActorDto(idActor, "un Nombre");
		actor.setFavorite(false);
		return actor;
	}
	
	
	public static List<ActorDto> verActoresFavoritos() throws JSONException, IOException {
		
		List<ActorDto> actoresFavoritosList = new ArrayList<ActorDto>(0);
		ActorDto actor = new ActorDto("123", "un Nombre");
		actor.setFavorite(true);
		actoresFavoritosList.add(actor);
		
		actor = new ActorDto("321", "otro Nombre");
		actor.setFavorite(true);
		actoresFavoritosList.add(actor);
		
		return actoresFavoritosList;
	}
	
	
	public static List<ActorDto> verRankingActoresFavoritos() throws JSONException, IOException {
		
		List<ActorDto> actoresFavoritosList = new ArrayList<ActorDto>(0);
		ActorDto actor = new ActorDto("123", "un Nombre");
		actor.setFavorite(true);
		actoresFavoritosList.add(actor);
		
		actor = new ActorDto("321", "otro Nombre");
		actor.setFavorite(true);
		actoresFavoritosList.add(actor);
		
		return actoresFavoritosList;
	}
	
	
	public static List<MoviDto> verPeliculasConActoresFavoritos() throws JSONException, IOException {
		
		List<MoviDto> movies = new ArrayList<MoviDto>(0);
		MoviDto movi = new MoviDto("Una Película", "2015");
		
		ActorDto actor = new ActorDto("123", "un Nombre");
		actor.setFavorite(true);
		movi.addActor(actor);
		
		actor = new ActorDto("321", "otro Nombre");
		actor.setFavorite(true);
		movi.addActor(actor);
		
		actor = new ActorDto("456", "otro Nombre");
		actor.setFavorite(true);
		movi.addActor(actor);
		
		actor = new ActorDto("987", "otro Nombre");
		actor.setFavorite(true);
		movi.addActor(actor);
		
		movies.add(movi);
		
		actor = new ActorDto("8745", "un Nombre");
		actor.setFavorite(true);
		movi.addActor(actor);
		
		actor = new ActorDto("3697", "otro Nombre");
		actor.setFavorite(true);
		movi.addActor(actor);
		
		actor = new ActorDto("4578", "otro Nombre");
		actor.setFavorite(true);
		movi.addActor(actor);
		
		actor = new ActorDto("4515", "otro Nombre");
		actor.setFavorite(true);
		movi.addActor(actor);
		
		movies.add(movi);
		
		return movies;
	}
}
