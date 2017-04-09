package app.service;

import app.model.odb.Credencial;
import app.model.odb.User;
import org.springframework.stereotype.Service;

/**
 * Created by Rodrigo on 08/04/2017.
 */
@Service
public class UserService {

    public void crearNuevoUsuario(Credencial userAndPassword) throws ExceptionInInitializerError{
        //Aca hay que persistir.
        User.create(userAndPassword);
    }
}
