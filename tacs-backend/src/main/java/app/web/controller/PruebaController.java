package app.web.controller;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

@Controller
@CrossOrigin
@RequestMapping(value = "/")
public class PruebaController {

	// CLASE UNICAMENTE CREADA PARA LA ETAPA DE DEPLOY
	// ELIMINARLA UNA VEZ CONFIGURADO EL PROYECTO CORRECTAMENTE PARA DEPLOYAR EN
	// TOMCAT
	// SE ACCEDE A /prueba DESDE UN BROWSER Y DEBERIA DEVOLVER Hello World!

	@RequestMapping(value = "prueba", method = RequestMethod.GET)
	@ResponseStatus(HttpStatus.OK)
	public @ResponseBody String busquedaPeliculaJson() {
		return "Hello World!";
	}

}