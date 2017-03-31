package app.web.controller;

import java.io.IOException;

import org.json.JSONException;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import app.model.odb.UserView;

@RestController
public class UserController {
	
	@RequestMapping(value="/user",method=RequestMethod.GET,produces="application/json")
	public UserView datosUsuario(@RequestParam(value="id") int id) throws JSONException, IOException{
		return new UserView(id);
	}
	
}
