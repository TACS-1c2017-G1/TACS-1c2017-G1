package app.repositories;

/**
 * Created by Rodrigo on 11/04/2017.
 */
public interface IRepositorio<T> {

	public void insert(T object);

	public void update(T object);

	public void delete(T object);
}
