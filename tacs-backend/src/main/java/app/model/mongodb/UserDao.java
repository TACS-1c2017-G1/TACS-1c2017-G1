package app.model.mongodb;

import app.model.odb.User;
import com.mongodb.MongoClient;
import org.mongodb.morphia.Datastore;
import org.mongodb.morphia.Morphia;
import org.mongodb.morphia.dao.BasicDAO;

/**
 * Created by aye on 23/05/17.
 */

public class UserDao extends BasicDAO<Integer,User>{

    private Datastore store;

    public UserDao(Class<Integer> entityClass, MongoClient mongoClient, Morphia morphia, String dbName) {
        super(entityClass, mongoClient, morphia, dbName);
    }


    public User get(Long id) {
        return store.get(User.class, id);
    }

    public User save(User unUsuario) {
        store.save(unUsuario);
        return unUsuario;
    }
}