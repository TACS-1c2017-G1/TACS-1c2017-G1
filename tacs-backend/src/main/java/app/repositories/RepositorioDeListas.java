package app.repositories;

import app.model.odb.MovieList;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface RepositorioDeListas extends MongoRepository<MovieList, String> {

}
