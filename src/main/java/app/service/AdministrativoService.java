package app.service;


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
