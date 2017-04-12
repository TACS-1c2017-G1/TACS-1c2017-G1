package app.model.odb;

/**
 * Created by Rodrigo on 09/04/2017.
 */
import java.security.SecureRandom;

public class TokenGenerator {

    protected static SecureRandom random = new SecureRandom();

    //El synchronized es para que sea ThreadSafe.
    public synchronized String generateToken( String username ) {
        long longToken = Math.abs( random.nextLong() );
        String random = Long.toString( longToken, 16 );
        return ( random.substring(0,7).concat(username).concat(random.substring(8,15)));
    }
}
