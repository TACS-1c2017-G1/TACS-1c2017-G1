package app.service;

import app.model.odb.Credencial;
import app.model.odb.Sesion;
import app.model.odb.User;
import org.springframework.stereotype.Service;

@Service
public class SesionesService {

    public Sesion loguearUsuario(Credencial credencial) {
        //TODO:Aca deberiamos buscar en la BD el usuario correspondiente y validar su password.
        User usuario = User.create(credencial);
        //TODO: Aca deberiamos persistir la sesion.
        return Sesion.create(credencial.getUsername());
    }
}
