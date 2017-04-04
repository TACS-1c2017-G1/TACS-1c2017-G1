package app.service;

import app.model.odb.Movie;
import org.springframework.stereotype.Service;

import java.util.Arrays;
import java.util.List;

@Service
public class ListasService {

    public List<Movie> interseccionEntre(Integer idLista1, Integer idLista2) {
        /*
        Pasos para ahcer en el servicio(logica):
        1- Buscar la primera lista.
        2- buscar la segunda lista.
        3- Aplicar lista1.intersectionWith(lista2)
        4- Devolver.
         */
        return Arrays.asList(new Movie());

    }
}
