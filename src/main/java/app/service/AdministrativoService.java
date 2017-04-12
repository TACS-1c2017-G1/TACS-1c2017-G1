package app.service;


import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

import app.model.odb.Movie;
import app.model.odb.MovieList;
import app.model.odb.User;
import app.repositories.RepositorioDeUsuarios;


public class AdministrativoService {
	
	private static RepositorioDeUsuarios repoUsers = RepositorioDeUsuarios.getInstance();

	public static User obtenerUsuario(String id) {
		return repoUsers.search(Integer.parseInt(id));
	}

	/**
	 * @return the repoUsers
	 */
	private static RepositorioDeUsuarios getRepoUsers() {
		return repoUsers;
	}

	/**
	 * @param repoUsers the repoUsers to set
	 */
	private static void setRepoUsers(RepositorioDeUsuarios repoUsers) {
		AdministrativoService.repoUsers = repoUsers;
	}

	public static List<Movie> obtenerInterseccionListas(String id1, String id2) {
		User user1 = AdministrativoService.obtenerUsuario(id1);
		User user2 = AdministrativoService.obtenerUsuario(id2);
		List<MovieList> user1Lists = user1.getLists();
		List<MovieList> user2Lists = user2.getLists();
		List<Movie> interseccion = new ArrayList<Movie>();
		for (MovieList ml1:user1Lists){
			List<Movie> movies1 = ml1.getMovies();
			for (MovieList ml2:user2Lists){
				List<Movie> movies2 = ml2.getMovies();
				interseccion.addAll(movies2.stream().filter(movies1::contains).collect(Collectors.toList()));
			}
		}
		return interseccion;
	}
}
