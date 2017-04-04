package app.web.controller;

import app.web.TOs.CredencialTO;
import app.web.TOs.UsuarioLogueadoTO;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import java.io.IOException;

@Controller
@RequestMapping("/authentication")
public class SesionesController {


    @RequestMapping(value="/login", method=RequestMethod.POST, produces = MediaType.APPLICATION_JSON_UTF8_VALUE)
    @ResponseBody
    public UsuarioLogueadoTO loguearUsuario(@RequestBody CredencialTO userAndPassword) throws IOException{
        /*
        acá hay que pedir el token y crear la sesión
         mockie un usuario y un numero de sesion random
         */
        UsuarioLogueadoTO usuarioParaDevolver = UsuarioLogueadoTO.create("ayitaLokura", "tuToken");
        return usuarioParaDevolver;
    }

    @RequestMapping(value="/logout", method=RequestMethod.POST)
    @ResponseBody
    public String desloguearUsuario(@RequestBody UsuarioLogueadoTO usuarioParaDesloguearse) throws IOException{
       /*acá debo desloguear al usuario va a devolver void pero en forma de prueba*/
        return "Se deslogueó el usuario correctamente!";
    }
}
