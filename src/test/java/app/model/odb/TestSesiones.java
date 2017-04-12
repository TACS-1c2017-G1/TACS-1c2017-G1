package app.model.odb;

import org.junit.Test;

import static org.junit.Assert.assertNotEquals;

/**
 * Created by Rodrigo on 09/04/2017.
 */
public class TestSesiones {

    @Test
    public void TokensUnicos(){
            Sesion sesionAyita = Sesion.create("Ayita");
            Sesion sesionRodri = Sesion.create("Rodri");

            assertNotEquals(sesionAyita.getIdSesion(),sesionRodri.getIdSesion());
    }

}
