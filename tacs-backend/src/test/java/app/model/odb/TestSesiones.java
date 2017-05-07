package app.model.odb;

import org.junit.Test;

import static org.junit.Assert.*;

/**
 * Created by Rodrigo on 09/04/2017.
 */
public class TestSesiones {

    @Test
    public void TokensUnicos(){
            Sesion sesionAyita = Sesion.create("Ayita",Boolean.FALSE);
            Sesion sesionRodri = Sesion.create("Rodri", Boolean.FALSE);

        assertNotEquals(sesionAyita.getIdSesion(),sesionRodri.getIdSesion());
    }

    @Test
    public void siDesactivoSesionQuedaInactiva(){
        Sesion sesionRodri = Sesion.create("Rodri", Boolean.FALSE);
        assertTrue(sesionRodri.getEstaActiva());
        sesionRodri.desactivarSesion();
        assertFalse(sesionRodri.getEstaActiva());
    }


}
