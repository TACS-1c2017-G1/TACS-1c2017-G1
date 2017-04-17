package app.repositories;

import app.model.odb.User;
import org.springframework.stereotype.Repository;

import java.util.ArrayList;
import java.util.Optional;

/**
 * Created by Rodrigo on 11/04/2017.
 */
@Repository
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
        Optional<User> usuarioLog = this.buscarUsuarioSiExiste(usuario.getCredencial().getUsername());
        if (usuarioLog.isPresent()) {
            throw new RuntimeException("Ya existe el usuario que quiere crear");
        }
        usuarios.add(usuario);
    }

    @Override
    public void update(User usuario) {
        this.delete(this.search(usuario.getId()));
        this.insert(usuario);
    }

    @Override
    public void delete(User usuario) {
        usuarios.remove(usuario);
    }

    public User search(int idBusqueda) {
        return usuarios.stream().filter(usuario -> usuario.getId() == idBusqueda).findFirst().orElse(null);
    }

    public void clear() {
        usuarios.clear();
    }

    public User searchByUsername(String username) {
        return this.buscarUsuarioSiExiste(username).orElseThrow(() -> new RuntimeException("No existe el usuario que intenta loguear"));
    }

    public Optional<User> buscarUsuarioSiExiste(String username) {
        return usuarios.stream().filter(user ->
                user.getCredencial().getUsername().equals(username))
                .findFirst();
    }

    public ArrayList<User> getUsers() {
        return usuarios;
    }
}
