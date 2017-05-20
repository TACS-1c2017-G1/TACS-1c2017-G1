package app.repositories;

import app.model.odb.Sesion;
import org.springframework.stereotype.Repository;

import java.util.ArrayList;

/**
 * Created by aye on 12/04/17.
 */
@Repository
public class RepositorioDeSesiones implements IRepositorio<Sesion> {
	private static RepositorioDeSesiones ourInstance = new RepositorioDeSesiones();

	public static RepositorioDeSesiones getInstance() {
		return ourInstance;
	}

	private static ArrayList<Sesion> sesiones;

	public RepositorioDeSesiones() {
		sesiones = new ArrayList<Sesion>();
	}

	@Override
	public void insert(Sesion sesion) {
		Sesion sesionAntigua = this.searchByUsername(sesion.getUsername());
		if (sesionAntigua != null) {
			sesionAntigua.desactivarSesion();
		}
		sesiones.add(sesion);
	}

	@Override
	public void update(Sesion sesion) {
		this.delete(sesion);
		this.insert(sesion);
	}

	@Override
	public void delete(Sesion sesion) {
		sesiones.remove(sesion);
	}

	public Sesion searchByUsername(String username) {
		return sesiones.stream().filter(sesion -> sesion.getUsername().equals(username) && sesion.getEstaActiva())
				.findFirst().orElse(null);
	}

	public Sesion searchById(String idSesion) {
		return sesiones.stream().filter(sesion -> sesion.getIdSesion().equals(idSesion) && sesion.getEstaActiva())
				.findFirst().orElseThrow(() -> new RuntimeException("La sesion buscada no existe."));

	}

	public void clear() {
		sesiones.clear();
	}

}
