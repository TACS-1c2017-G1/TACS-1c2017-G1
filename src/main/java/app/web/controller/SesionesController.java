package app.web.controller;

import app.web.TOs.UserAndPasswordTO;
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
    public String newUser(@RequestBody UserAndPasswordTO userAndPassword) throws IOException{
        //Acá hay que crear el usuario y sino tirar excepción.
        return "Cuenta creada correctamente!";
    }




}
