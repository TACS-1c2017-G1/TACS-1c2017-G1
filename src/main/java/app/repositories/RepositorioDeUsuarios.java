package app.repositories;

import app.model.odb.User;

import java.util.ArrayList;

/**
 * Created by Rodrigo on 11/04/2017.
 */
public class RepositorioDeUsuarios implements IRepositorio {
    private static RepositorioDeUsuarios ourInstance = new RepositorioDeUsuarios();

    public static RepositorioDeUsuarios getInstance() {
        return ourInstance;
    }

    private ArrayList<User> usuarios;

    private RepositorioDeUsuarios() {
        this.usuarios = new ArrayList<>();
    }

    @Override
    public void insert(Object object) {
    }

    @Override
    public void update(Object object) {
    }

    @Override
    public void delete(Object object) {
    }
}
