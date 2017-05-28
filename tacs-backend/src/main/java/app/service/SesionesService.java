package app.service;

import app.model.odb.Credencial;
import app.model.odb.Sesion;
import app.model.odb.User;
import app.repositories.RepositorioDeSesiones;
import app.repositories.RepositorioDeUsuarios;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.util.Calendar;

@Service
public class SesionesService {

    @Autowired
    RepositorioDeUsuarios repositorioDeUsuarios;
	public static final String SALT = "TMDB-G1";


    public Sesion loguearUsuario(Credencial credencial) {
        this.crearAdminSiNoExiste();
        User user = repositorioDeUsuarios.findByUsername(credencial.getUsername());
        String saltedPassword = SALT + credencial.getPassword();
		String hashedPassword = generarHash(saltedPassword);
        if(user == null || !user.getPassword().equals(hashedPassword)){
            throw new RuntimeException("Usuario y/o contraseña inválida");
        }
        Sesion nuevaSesion =Sesion.create(user.getUsername(), user.getAdmin());
        RepositorioDeSesiones.getInstance().insert(nuevaSesion);
        user.setLastAccess(Calendar.getInstance().getTime());
        return nuevaSesion;
    }
    
    private static String generarHash(String input) {
		StringBuilder hash = new StringBuilder();

		try {
			MessageDigest sha = MessageDigest.getInstance("SHA-1");
			byte[] hashedBytes = sha.digest(input.getBytes());
			char[] digits = { '0', '1', '2', '3', '4', '5', '6', '7', '8', '9',
					'a', 'b', 'c', 'd', 'e', 'f' };
			for (int idx = 0; idx < hashedBytes.length; ++idx) {
				byte b = hashedBytes[idx];
				hash.append(digits[(b & 0xf0) >> 4]);
				hash.append(digits[b & 0x0f]);
			}
		} catch (NoSuchAlgorithmException e) {
			System.out.println("Error en la encriptación de la password.");
		}

		return hash.toString();
	}

    private void crearAdminSiNoExiste() {
        User userAdmin = User.create(Credencial.create("admin","admin"),true);
        if(repositorioDeUsuarios.findByUsername("admin") == null){
            repositorioDeUsuarios.insert(userAdmin);
        }
    }

    public void desloguearUsuario(String token) {
        Sesion sesionADesactivar = RepositorioDeSesiones.getInstance().searchById(token);
        sesionADesactivar.desactivarSesion();
        RepositorioDeSesiones.getInstance().update(sesionADesactivar);

    }
    
    
    public User obtenerUsuarioPorToken( String token ) {
        if (token == null)
            throw new RuntimeException("Token nulo, no se puede realizar la operación.");
        Sesion sesion = RepositorioDeSesiones.getInstance().searchById(token);
        validarSesionActiva(sesion);
        return repositorioDeUsuarios.findByUsername(sesion.getUsername());
    }



    public void validarSesionActiva(Sesion sesion) {
        if (!sesion.getEstaActiva()) {
            throw new RuntimeException("La sesión ya expiró, vuelva a loguearse por favor");
        }
    }

}
