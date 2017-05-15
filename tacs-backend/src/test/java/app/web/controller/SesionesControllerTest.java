//package app.web.controller;
//
//
//import app.model.odb.Credencial;
//import app.model.odb.Sesion;
//import app.model.odb.User;
//import app.repositories.RepositorioDeSesiones;
//import app.repositories.RepositorioDeUsuarios;
//import app.service.SesionesService;
//import app.web.RestTestBase;
//import org.junit.Before;
//import org.junit.Test;
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.boot.test.mock.mockito.MockBean;
//
//import static org.springframework.http.MediaType.APPLICATION_JSON_UTF8_VALUE;
//import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
//import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
//import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;
//
///**
// * Created by aye on 12/04/17.
// */
//public class SesionesControllerTest extends RestTestBase {
//
//    @MockBean
//    private SesionesService servicioDeSesion;
//
//    @Autowired
//    private RepositorioDeSesiones repositorioDeSesiones;
//
//    @Autowired
//    private RepositorioDeUsuarios repositorioDeUsuarios;
//
//
//    @Before
//    public void setUp() {
//
//        Credencial credencialDeCarlos = Credencial.create("Carlos", "123456");
//
//        //Acá van las cosas que queremos tener previamente
//    }
//
//
//    @Test
//    public void loginCorrecto() throws Exception {
//        this.mockClient.perform(post("/authentication/login")
//                .contentType(APPLICATION_JSON_UTF8_VALUE)
//                .content(json(Credencial.create("Carlos", "123456"))))
//                .andExpect(status().is(200))
//                    ;
//    }
//
//
//    @Test
//    public void logoutCorrecto() throws Exception {
//        Credencial credencial =Credencial.create("Carlos", "123456");
//        repositorioDeUsuarios.insert(User.create(credencial,false));
//        Sesion sesion = Sesion.create(credencial.getUsername(), false);
//        repositorioDeSesiones.insert(sesion);
//
//        this.mockClient.perform(put("/authentication/logout")
//                .header("token",sesion.getIdSesion()))
//                .andExpect(status().is(200));
//
//    }
//


//}
