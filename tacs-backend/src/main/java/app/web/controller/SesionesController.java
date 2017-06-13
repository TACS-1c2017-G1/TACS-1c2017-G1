package app.web.controller;

import app.model.odb.Credencial;
import app.model.odb.Sesion;
import app.service.SesionesService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;

@Controller
@CrossOrigin
@RequestMapping("/api/authentication")
public class SesionesController {

    @Autowired
    SesionesService servicioDeSesiones;

    @RequestMapping(value="/login", method=RequestMethod.POST, produces = MediaType.APPLICATION_JSON_UTF8_VALUE)
    @ResponseBody
    public Sesion loguearUsuario(@RequestBody Credencial userAndPassword) throws IOException{
        return servicioDeSesiones.loguearUsuario(userAndPassword);
    }

    @RequestMapping(value="/logout", method=RequestMethod.PUT)
    @ResponseBody
    public void desloguearUsuario(@RequestHeader String token) throws IOException{
       /*acá debo desloguear al usuario va a devolver void pero en forma de prueba*/
        servicioDeSesiones.desloguearUsuario(token);
    }
}
