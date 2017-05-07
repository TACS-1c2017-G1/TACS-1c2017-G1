package app.service;

import app.model.odb.Credencial;
import app.model.odb.Sesion;
import app.model.odb.User;
import app.repositories.RepositorioDeSesiones;
import app.repositories.RepositorioDeUsuarios;

import java.util.Calendar;

import org.springframework.stereotype.Service;

@Service
public class SesionesService {

    private RepositorioDeSesiones getRepositorio(){
        return RepositorioDeSesiones.getInstance();
    }

    public Sesion loguearUsuario(Credencial credencial) {
        User user = RepositorioDeUsuarios.getInstance().searchByUsername(credencial.getUsername());
        if(!user.getCredencial().getPassword().equals(credencial.getPassword())){
            throw new RuntimeException("Usuario y/o contraseña inválida");
        }
        Sesion nuevaSesion =Sesion.create(user.getCredencial().getUsername(), user.getAdmin());
        this.getRepositorio().insert(nuevaSesion);
        user.setLastAccess(Calendar.getInstance().getTime());
        return nuevaSesion;
    }

    public void desloguearUsuario(String token) {
        Sesion sesionADesactivar = this.getRepositorio().searchById(token);
        sesionADesactivar.desactivarSesion();
        this.getRepositorio().update(sesionADesactivar);

    }
    
    
    public User obtenerUsuarioPorToken( String token ) {
        if (token == null)
            throw new RuntimeException("Token nulo, no se puede realizar la operación.");
        Sesion sesion = this.getRepositorio().searchById(token);
        validarSesionActiva(sesion);
        return RepositorioDeUsuarios.getInstance().searchByUsername(sesion.getUsername());
    }



    public void validarSesionActiva(Sesion sesion) {
        if (!sesion.getEstaActiva()) {
            throw new RuntimeException("La sesión ya expiró, vuelva a loguearse por favor");
        }
    }

}
