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

}
