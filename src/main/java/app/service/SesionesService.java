package app.service;

import app.model.odb.Credencial;
import app.model.odb.Sesion;
import app.model.odb.User;
import app.repositories.RepositorioDeSesiones;
import app.repositories.RepositorioDeUsuarios;
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
        Sesion nuevaSesion =Sesion.create(user.getCredencial().getUsername());
        this.getRepositorio().insert(nuevaSesion);
        return nuevaSesion;
    }

    public void desloguearUsuario(String token) {
        Sesion sesionADesactivar = this.getRepositorio().searchById(token);
        sesionADesactivar.desactivarSesion();
        this.getRepositorio().update(sesionADesactivar);

    }
    
    
    public User obtenerUsuarioPorToken( String token ) {
    	if ( token == null )
    		throw new RuntimeException("Token nulo, no se puede realizar la operación.");
    	Sesion sesion = this.getRepositorio().searchById(token);
    	return RepositorioDeUsuarios.getInstance().searchByUsername(sesion.getUsername());
    }
}
