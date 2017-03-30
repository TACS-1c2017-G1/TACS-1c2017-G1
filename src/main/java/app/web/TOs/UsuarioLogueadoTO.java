package app.web.TOs;

/**
 * Created by aye on 30/03/17.
 */
public class UsuarioLogueadoTO {

    private String username;
    private Long idSesion;

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public Long getIdSesion() {
        return idSesion;
    }

    public void setIdSesion(Long idSesion) {
        this.idSesion = idSesion;
    }

    public static UsuarioLogueadoTO create(String nombre, Long idSesion) {
        UsuarioLogueadoTO usuarioLogueadoTO = new UsuarioLogueadoTO();
        usuarioLogueadoTO.setIdSesion(idSesion);
        usuarioLogueadoTO.setUsername(nombre);
        return usuarioLogueadoTO;
    }

    public UsuarioLogueadoTO() {}
}
