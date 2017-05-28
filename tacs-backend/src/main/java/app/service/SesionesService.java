package app.service;

import app.model.odb.Credencial;
import app.model.odb.Sesion;
import app.model.odb.User;
import app.repositories.RepositorioDeSesiones;
import app.repositories.RepositorioDeUsuarios;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Calendar;

@Service
public class SesionesService {

    @Autowired
    RepositorioDeUsuarios repositorioDeUsuarios;


    public Sesion loguearUsuario(Credencial credencial) {
        this.crearAdminSiNoExiste();
        User user = repositorioDeUsuarios.findByUsername(credencial.getUsername());
        if(user == null || !user.getPassword().equals(credencial.getPassword())){
            throw new RuntimeException("Usuario y/o contraseña inválida");
        }
        Sesion nuevaSesion =Sesion.create(user.getUsername(), user.getAdmin());
        RepositorioDeSesiones.getInstance().insert(nuevaSesion);
        user.setLastAccess(Calendar.getInstance().getTime());
        repositorioDeUsuarios.save(user);
        return nuevaSesion;
    }

    private void crearAdminSiNoExiste() {
        User userAdmin = User.create(Credencial.create("admin","admin"),true);
        if(repositorioDeUsuarios.findByUsername("admin") == null){
            repositorioDeUsuarios.insert(userAdmin);
        }
    }

    public void desloguearUsuario(String token) {
        Sesion sesionADesactivar = RepositorioDeSesiones.getInstance().searchById(token);
        sesionADesactivar.desactivarSesion();
        RepositorioDeSesiones.getInstance().update(sesionADesactivar);

    }
    
    
    public User obtenerUsuarioPorToken( String token ) {
        if (token == null)
            throw new RuntimeException("Token nulo, no se puede realizar la operación.");
        Sesion sesion = RepositorioDeSesiones.getInstance().searchById(token);
        validarSesionActiva(sesion);
        return repositorioDeUsuarios.findByUsername(sesion.getUsername());
    }



    public void validarSesionActiva(Sesion sesion) {
        if (!sesion.getEstaActiva()) {
            throw new RuntimeException("La sesión ya expiró, vuelva a loguearse por favor");
        }
    }

}
