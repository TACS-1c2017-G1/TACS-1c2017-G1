package app.web.controller;

import app.model.odb.Movie;
import app.model.odb.MovieList;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.util.Arrays;


@Controller
@RequestMapping(value="/list")
public class ListasController {

    @RequestMapping(value = "/{id_lista}", method = RequestMethod.GET)
    @ResponseBody
    public MovieList consultarLista(@RequestHeader String token, @PathVariable Long id_lista) throws Exception {
        return  MovieList.create("Lista de disney", Arrays.asList(new Movie()));
    }

    @RequestMapping(value = "/new-list", method = RequestMethod.POST)
    @ResponseBody
    public String crearLista(@RequestHeader String token, @RequestBody MovieList nuevaLista) throws IOException {
        /* Acá no va a devolver el string sino un void con el status 200 en caso positivo o excepción en caso de que falle la creacioN*/
        return "Se creó la lista.";
    }

    @RequestMapping(value = "/{id_lista}/add-item", method = RequestMethod.PUT)
    @ResponseBody
    public String agregarItem(@RequestHeader String token, @RequestBody Movie movie, @PathVariable Long id_lista) throws IOException {
        //RequestBody deberá recibir un objeto Movie y PathVariable.
        return "Se agregó el item.";
    }

    @RequestMapping(value = "/{id_lista}/delete-item", method = RequestMethod.PUT)
    @ResponseBody
    public String eliminarItem(@RequestHeader String Token, @RequestBody Movie movie, @PathVariable Long id_lista) throws IOException {
        //RequestBody deberá recibir un objeto Movie y PathVariable.
        return "Se eliminó el item.";
    }


}


