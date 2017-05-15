//package app.web.controller;
//
//
//import app.model.odb.Credencial;
//import app.repositories.RepositorioDeUsuarios;
//import app.service.UserService;
//import app.web.RestTestBase;
//import org.junit.Before;
//import org.junit.Test;
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.boot.test.mock.mockito.MockBean;
//
//import static org.springframework.http.MediaType.APPLICATION_JSON_UTF8_VALUE;
//import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
//import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;
//
///**
// * Created by aye on 12/04/17.
// */
//public class UserControllerTest extends RestTestBase {
//
//    @MockBean
//    private UserService servicioDeUsuario;
//
//    @Autowired
//    private RepositorioDeUsuarios repositorioDeUsuarios;
//
//    @Before
//    public void setUp() {
//        //Acá van las cosas que queremos tener previamente
//    }
//
//    @Test
//    public void crearUnNuevoUsuarioAPartirDeUsernameYPassword() throws Exception {
//        this.mockClient.perform(post("/user/")
//                .contentType(APPLICATION_JSON_UTF8_VALUE)
//                .content(json(Credencial.create("Carlos", "123456"))))
//                .andExpect(status().is(200));
//    }

//}
