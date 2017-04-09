package app.service;

import app.model.odb.Credencial;
import app.model.odb.Sesion;
import app.model.odb.User;
import org.springframework.stereotype.Service;

@Service
public class SesionesService {

    public Sesion loguearUsuario(Credencial credencial) {
        //TODO:Aca deberiamos buscar en la BD el usuario correspondiente y validar su password.
        //TODO: si no existe el usuario
        User usuario = User.create(credencial);
        //TODO: Aca deberiamos persistir la sesion.
        return Sesion.create(credencial.getUsername());
    }

    public void desloguearUsuario(String token) {
        //TODO: acá hay que buscar en la BD la sesión por el token y ponerla como inactiva.
        //TODO: validaciones cuando tengamos db: Ver si no existe la sesion tirar exception.
        Sesion sesion = Sesion.create("Rodrigo");
        sesion.setIdSesion(token);
        sesion.desactivarSesion();

    }
}
