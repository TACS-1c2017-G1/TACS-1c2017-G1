package app.web.controller;

import app.web.TOs.UsuarioLogueadoTO;
import app.web.TOs.UsuarioYContraseniaTo;
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

    @RequestMapping(value = "/new-user", method = RequestMethod.POST)
    @ResponseBody
    public String crearUsuario(@RequestBody UsuarioYContraseniaTo userAndPassword) throws IOException{
        //Acá hay que crear el usuario y sino tirar excepción.
        return "Cuenta creada correctamente!";
    }

    @RequestMapping(value="/login", method=RequestMethod.POST, produces = MediaType.APPLICATION_JSON_UTF8_VALUE)
    @ResponseBody
    public UsuarioLogueadoTO loguearUsuario(@RequestBody UsuarioYContraseniaTo userAndPassword) throws IOException{
        /*
        acá hay que pedir el token y crear la sesión
         mockie un usuario y un numero de sesion random
         */
        UsuarioLogueadoTO usuarioParaDevolver = UsuarioLogueadoTO.create("ayitaLokura", 345476788993L);
        return usuarioParaDevolver;
    }

}
