package app.model.odb;

/**
 * Created by Rodrigo on 08/04/2017.
 */
public class Sesion {
    private String idSesion;
    private String username;
    private Boolean estaActiva;
    private Boolean esAdmin;

    private static TokenGenerator generadorDeTokens = new TokenGenerator();

    public String getIdSesion() {
        return idSesion;
    }

    public void setIdSesion(String idSesion) {
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

    public static Sesion create(String username, Boolean esAdmin){

        Sesion sesion = new Sesion();
        sesion.setIdSesion(generadorDeTokens.generateToken(username, esAdmin));
        sesion.setUsername(username);
        sesion.setEstaActiva(Boolean.TRUE);
        sesion.setEsAdmin(esAdmin);

        return sesion;
    }

    public Boolean getEsAdmin() {
        return esAdmin;
    }

    public void setEsAdmin(Boolean esAdmin) {
        this.esAdmin = esAdmin;
    }

    public void desactivarSesion() {
        this.setEstaActiva(Boolean.FALSE);
    }
}
