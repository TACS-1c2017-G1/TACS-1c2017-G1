package app.service;


import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

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

	public static List<Movie> obtenerInterseccionListas(User user1, User user2) {
		Set<Movie> interseccionSet = new HashSet<Movie>();
		List<MovieList> user1Lists = user1.getLists();
		for (MovieList ml1:user1Lists){
			interseccionSet.addAll(ml1.getMovies());
		}
		List<MovieList> user2Lists = user2.getLists();
		for (MovieList ml2:user2Lists){
			interseccionSet.addAll(ml2.getMovies());
		}
		List<Movie> interseccion = new ArrayList<Movie>(interseccionSet);
		return interseccion;
	}
}
