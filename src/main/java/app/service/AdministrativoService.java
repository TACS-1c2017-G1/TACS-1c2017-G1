package app.service;

import java.util.ArrayList;
import java.util.List;

import app.model.odb.Movie;
import app.model.odb.MovieList;
import app.model.odb.User;

public class AdministrativoService {

	public static List<Movie> obtenerInterseccionListas(User user1, User user2) {
		List<Movie> interseccion = new ArrayList<Movie>();
		List<MovieList> user1Lists = user1.getLists();
		List<MovieList> user2Lists = user2.getLists();
		return interseccion;
	}
}
