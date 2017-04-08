package app.model.odb;

/**
 * Created by Rodrigo on 08/04/2017.
 */
public class Sesion {
    private Long idSesion;
    private String username;
    private Boolean estaActiva;

    public Long getIdSesion() {
        return idSesion;
    }

    public void setIdSesion(Long idSesion) {
        this.idSesion = idSesion;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public Boolean getEstaActiva() {
        return estaActiva;
    }

    public void setEstaActiva(Boolean estaActiva) {
        this.estaActiva = estaActiva;
    }

    public Sesion() {
    }

    public static Sesion create(Long idSesion, String username){

        Sesion sesion = new Sesion();
        sesion.setIdSesion(idSesion);
        sesion.setUsername(username);
        sesion.setEstaActiva(Boolean.TRUE);

        return sesion;
    }
}
