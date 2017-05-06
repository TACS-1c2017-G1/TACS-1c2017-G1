package app.web.controller;

import app.model.odb.Movie;
import app.model.odb.User;
import app.service.AdministrativoService;
import org.json.JSONException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.util.List;


@Controller
@CrossOrigin
@RequestMapping(value = "/admin/user")
public class AdministrativoController {

    @Autowired
    AdministrativoService adminService;

    @RequestMapping(value = "/{id}", method = RequestMethod.GET, produces = "application/json")
    @ResponseBody
    public User datosUsuario(@RequestHeader String token, @PathVariable String id) throws JSONException, IOException {
        return adminService.validarAdmin(token).obtenerUsuario(id);
    }

    @RequestMapping(value = "/{idLista1}/{idLista2}/", method = RequestMethod.GET, produces = "application/json")
    @ResponseBody
    public List<Movie> listaUsuarios(@RequestHeader String token, @PathVariable String idLista1,
                                     @PathVariable String idLista2)
            throws JSONException, IOException {
        List<Movie> interseccion = adminService.validarAdmin(token).obtenerInterseccionListas(idLista1, idLista2);
        return interseccion;
    }

    @RequestMapping(value = "/list", method = RequestMethod.GET, produces = "application/json")
    @ResponseBody
    public List<User> listadoUsuarios(@RequestHeader String token) throws JSONException, IOException {
        return adminService.validarAdmin(token).obtenerUsuarios();
    }
}
