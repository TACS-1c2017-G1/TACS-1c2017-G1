package app.web;


import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.Before;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.junit4.SpringRunner;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.web.context.WebApplicationContext;

import java.io.IOException;
import java.nio.charset.Charset;


@RunWith(SpringRunner.class)
@SpringBootTest(webEnvironment= SpringBootTest.WebEnvironment.RANDOM_PORT)
@ActiveProfiles("test")
public abstract class RestTestBase {
    protected final static MediaType JSON_CONTENT_TYPE = new MediaType(MediaType.APPLICATION_JSON.getType(),
            MediaType.APPLICATION_JSON.getSubtype(),
            Charset.forName("utf8"));
    protected MockMvc mockClient;

    @Autowired
    protected WebApplicationContext webApplicationContext;

    @Autowired
    protected ObjectMapper objectMapper;

    protected String json(Object o) throws IOException {
        return objectMapper.writeValueAsString(o);
    }

    @Before
    public void setupRestClient() throws Exception {
        this.mockClient = MockMvcBuilders
                .webAppContextSetup(webApplicationContext)
                .build();
    }



}