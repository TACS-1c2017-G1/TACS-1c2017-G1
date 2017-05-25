package app.repositories;

import app.model.odb.User;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

/**
 * Created by Rodrigo on 11/04/2017.
 */
@Repository
public interface RepositorioDeUsuarios extends MongoRepository<User, String>{

    @Query("{ 'username' : ?0 }")
    User findByUsername(String username);

}
