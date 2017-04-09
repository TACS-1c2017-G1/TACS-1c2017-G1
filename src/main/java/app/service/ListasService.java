package app.service;

import app.model.odb.Movie;
import app.model.odb.MovieList;
import org.springframework.stereotype.Service;

import java.util.Arrays;
import java.util.List;

import resources.hibernate.util.*;
 
import org.hibernate.Session;

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
    
    public void crearLista(String name){
    			
		Session session = HibernateUtil.getSessionFactory().openSession();
		session.beginTransaction();
		MovieList movieList = new MovieList();
		movieList.setName(name);
		session.save(movieList);
		session.getTransaction().commit();
		session.close();		
		
    }
    
    public void agregarItem(Movie movie, Long id_lista){
    	 	
    	Session session = HibernateUtil.getSessionFactory().openSession();
		session.beginTransaction();
		MovieList lista = (MovieList)session.get(MovieList.class, id_lista);
		lista.addMovie(movie);
		session.save(lista);
		session.getTransaction().commit();
		session.close();
		
    }
    
    public void eliminarItem(Movie movie, Long id_lista){
    	
    	Session session = HibernateUtil.getSessionFactory().openSession();
		session.beginTransaction();
		MovieList lista = (MovieList)session.get(MovieList.class, id_lista);
		lista.removeMovie(movie);
		session.save(lista);
		session.getTransaction().commit();
		session.close();
    	
    }
}
