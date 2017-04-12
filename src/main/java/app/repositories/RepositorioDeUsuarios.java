package app.repositories;

import app.model.odb.MovieList;
import app.model.odb.User;

import java.util.ArrayList;
import java.util.List;
import java.util.NoSuchElementException;

/**
 * Created by Rodrigo on 11/04/2017.
 */
public class RepositorioDeUsuarios implements IRepositorio<User> {
    private static RepositorioDeUsuarios ourInstance = new RepositorioDeUsuarios();

    public static RepositorioDeUsuarios getInstance() {
        return ourInstance;
    }

    private ArrayList<User> usuarios;

    private RepositorioDeUsuarios() {
        this.usuarios = new ArrayList<>();
    }

    @Override
    public void insert(User usuario) {
        usuarios.add(usuario);
    }

    @Override
    public void update(Object object) {
    }

    @Override
    public void delete(Object object) {
    }
    
    public User search(int idBusqueda){
    	try{
    	return usuarios.stream().filter(usuario -> usuario.getId()==idBusqueda).findFirst().get();
    	}
    	catch (NoSuchElementException e){
    		return User.create("0", "ERROR: USER DOESN'T EXIST", new ArrayList<MovieList>());
    	}
    }

	public void clear() {
		usuarios.clear();
	}
}
