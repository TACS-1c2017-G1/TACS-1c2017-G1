package app.web.controller;

import app.model.odb.Credencial;
import app.model.odb.Sesion;
import app.service.SesionesService;
import app.web.TOs.UsuarioLogueadoTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;

@Controller
@RequestMapping("/authentication")
public class SesionesController {

    @Autowired
    SesionesService servicioDeSesiones;

    @RequestMapping(value="/login", method=RequestMethod.POST, produces = MediaType.APPLICATION_JSON_UTF8_VALUE)
    @ResponseBody
    public Sesion loguearUsuario(@RequestBody Credencial userAndPassword) throws IOException{
        return servicioDeSesiones.loguearUsuario(userAndPassword);
    }

    @RequestMapping(value="/logout", method=RequestMethod.POST)
    @ResponseBody
    public String desloguearUsuario(@RequestHeader String Token, @RequestBody UsuarioLogueadoTO usuarioParaDesloguearse) throws IOException{
       /*acá debo desloguear al usuario va a devolver void pero en forma de prueba*/
        return "Se deslogueó el usuario correctamente!";
    }
}
