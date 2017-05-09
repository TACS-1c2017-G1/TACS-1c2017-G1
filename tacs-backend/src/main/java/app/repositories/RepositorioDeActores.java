package app.repositories;

import java.util.ArrayList;

import app.model.odb.Actor;

public class RepositorioDeActores implements IRepositorio<Actor>{

	private static RepositorioDeActores ourInstance = new RepositorioDeActores();

	public static RepositorioDeActores getInstance() {
		return ourInstance;
	}

	private ArrayList<Actor> actores;

	private RepositorioDeActores() {
		this.actores = new ArrayList<Actor>();
	}
	
	@Override
	public void insert(Actor actor) {
		if (this.search(actor.getId()) == null) {
			actores.add(actor);
		} else {
			throw new RuntimeException("Ya existe la lista que quiere crear");
		}
		
	}
	
	public Actor search(int idBusqueda) {
		return actores.stream().filter(actor -> actor.getId() == idBusqueda).findFirst().orElse(null);
	}

	@Override
	public void update(Actor actor) {
		this.delete(this.search(actor.getId()));
		this.insert(actor);
		
	}

	@Override
	public void delete(Actor actor) {
		actores.remove(actor);		
	}

}
