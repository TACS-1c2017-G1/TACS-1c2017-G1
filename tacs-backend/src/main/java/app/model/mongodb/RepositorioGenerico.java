package app.model.mongodb;

import app.Application;
import com.mongodb.MongoClient;
import org.mongodb.morphia.Datastore;
import org.mongodb.morphia.Morphia;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.net.UnknownHostException;

/**
 * Created by aye on 23/05/17.
 */
abstract class RepositorioGenerico<T> {
    private static final Logger LOG = LoggerFactory.getLogger(Application.class);

    static protected Datastore ds;
    static Morphia morphia;

	new() {
        if (ds == null) {
            MongoClient mongo = null;
            try {
                mongo = new MongoClient("localhost",25486);
            } catch (UnknownHostException e) {
                e.printStackTrace();
            }
            morphia = new Morphia();
            ds = new Datastore;


            LOG.info("Conectado a MongoDB. Bases: " + ds.getDB.collectionNames);
        }
    }


    public void setList(def list) {
        List = list;
    }

    void update(T t) {
        ds.update(t, this.defineUpdateOperations(t))
    }

    abstract def UpdateOperations<T> defineUpdateOperations(T t)

    def T create(T t) {
        ds.save(t)
        t
    }

    def void delete(T t) {
        ds.delete(t)
    }

    def List<T> allInstances() {
        ds.createQuery(this.getEntityType()).asList
    }

    abstract def Class<T> getEntityType()


}
