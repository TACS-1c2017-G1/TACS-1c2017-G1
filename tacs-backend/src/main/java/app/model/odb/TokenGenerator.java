package app.model.odb;

import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
/**
 * Created by Rodrigo on 09/04/2017.
 */
import java.security.SecureRandom;

public class TokenGenerator {

    protected static SecureRandom random = new SecureRandom();

    //El synchronized es para que sea ThreadSafe.
    public synchronized String generateToken( String username, Boolean esAdmin ) {
        long longToken = Math.abs( random.nextLong() );
        String random = Long.toString( longToken, 16 );
        return (esAdmin.toString().concat(random.substring(0,7)).concat(username).concat(random.substring(8,15)));
    }

    public synchronized static String generarIdString(){
        long longToken = Math.abs( random.nextLong() );
        String random = Long.toString( longToken, 16 );
        return random;
    }
    
    public static String generarHash(String input) {
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

}
