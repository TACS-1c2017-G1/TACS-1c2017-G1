package app.web.TOs;

/**
 * Created by aye on 30/03/17.
 */
public class UsuarioLogueadoTO {

    private String nombre;
    private Long idSesion;

    public String getNombre() {
        return nombre;
    }

    public void setNombre(String nombre) {
        this.nombre = nombre;
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
        usuarioLogueadoTO.setNombre(nombre);
        return usuarioLogueadoTO;
    }

    public UsuarioLogueadoTO() {}
}
