package app.web.controller;

import java.io.IOException;

import org.json.JSONException;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import app.model.odb.UserView;

@RestController
public class UserController {
	
	@RequestMapping(value="/user/{id}",method=RequestMethod.GET,produces="application/json")
	public UserView datosUsuario(@PathVariable String id) throws JSONException, IOException{
		return new UserView(id);
	}
	
}
