package com.UTNFRBATACS1c2017.app;


import static org.junit.Assert.*;
import java.io.IOException;
import org.json.*;
import org.junit.Test;

public class AppTest
{
	@Test
    public void TestmovieID() throws IOException
    {
        Conector conector = new Conector();
//        550 es el codigo de la pelicula Fight Club
        JSONObject jsonObj = new JSONObject(conector.fichaPeli(550));
        assertEquals(jsonObj.get("title"),"Fight Club");
    }

}
