package app.model.odb;

/**
 * Created by aye on 31/03/17.
 */
public class Credencial {

    private String username;
    private String password;

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public static Credencial create(String nombre, String password) {
        Credencial credencial = new Credencial();
        credencial.setPassword(password);
        credencial.setUsername(nombre);
        return credencial;
    }

    public Boolean esInvalida(){
        return this.getPassword().isEmpty() || this.getUsername().isEmpty();
    }

    public Credencial() {}

}
