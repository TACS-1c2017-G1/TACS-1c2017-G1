package app.web.TOs;

/**
 * Created by aye on 30/03/17.
 */
public class UsuarioLogueadoTO {

    private String username;
    private String idSesion;

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getIdSesion() {
        return idSesion;
    }

    public void setIdSesion(String idSesion) {
        this.idSesion = idSesion;
    }

    public static UsuarioLogueadoTO create(String nombre, String idSesion) {
        UsuarioLogueadoTO usuarioLogueadoTO = new UsuarioLogueadoTO();
        usuarioLogueadoTO.setIdSesion(idSesion);
        usuarioLogueadoTO.setUsername(nombre);
        return usuarioLogueadoTO;
    }

    public UsuarioLogueadoTO() {}
}
