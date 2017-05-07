package app.model;

import app.model.odb.Credencial;
import app.model.odb.User;
import app.repositories.RepositorioDeUsuarios;

/**
 * Created by aye on 06/05/17.
 */
public class Initializer {

    public static Initializer create() {
        Initializer initializer = new Initializer();
        User admin = User.create(Credencial.create("admin", "admin"), true);
        RepositorioDeUsuarios.getInstance().insert(admin);
        return initializer;
    }

}
