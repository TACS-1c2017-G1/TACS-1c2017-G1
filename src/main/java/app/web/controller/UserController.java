package app.web.controller;

import java.io.IOException;

import org.json.JSONException;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import app.model.odb.User;

@RestController
public class UserController {
	
	@RequestMapping("/user")
	public User datosUsuario(@RequestParam(value="id") int id) throws JSONException, IOException{
		return new User(id);
		
	}
	
}
