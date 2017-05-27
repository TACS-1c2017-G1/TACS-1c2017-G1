package app.repositories;

import app.model.odb.Actor;
import org.springframework.data.mongodb.repository.MongoRepository;

/**
 * Created by aye on 27/05/17.
 */
public interface RepositorioDeActores extends MongoRepository<Actor,String> {
}
