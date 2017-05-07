package app.service;

import app.model.odb.Movie;
import app.model.odb.MovieList;
import app.model.odb.User;
import app.repositories.RepositorioDeListas;
import app.repositories.RepositorioDeUsuarios;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class AdministrativoService {

    private RepositorioDeUsuarios getRepositorio() {
        return RepositorioDeUsuarios.getInstance();
    }

    public User obtenerUsuario(String id) {
        User user = this.getRepositorio().search(Integer.parseInt(id));
        if(user == null){
            throw new RuntimeException("No existe el usuario con id " + id.toString());
        }
        return user;
    }
    public ArrayList<User> obtenerUsuarios() {
        return this.getRepositorio().getUsers();
    }


    public AdministrativoService validarAdmin(String token) {
        if (token.substring(0,1) == "f"){
            throw new RuntimeException("Esta funcionalidad solo es para admins");
        }
        return this;
    }


    public List<Movie> obtenerInterseccionListas(String id1, String id2) {
        RepositorioDeListas repo = RepositorioDeListas.getInstance();
        MovieList lista1 = RepositorioDeListas.getInstance().search(Integer.parseInt(id1));
        MovieList lista2 = RepositorioDeListas.getInstance().search(Integer.parseInt(id2));
        List<Movie> interseccion = lista1.intersectionWith(lista2);
        return interseccion;
    }

}
