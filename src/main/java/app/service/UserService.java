package app.service;

import app.model.dto.ActorDto;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Arrays;
import java.util.List;


/**
 * Created by aye on 06/04/17.
 */

@Service
public class UserService {

    @Autowired
    SesionesService servicioDeSesiones;

    public List<ActorDto> getActoresFavoritos(String token) {
        return Arrays.asList(new ActorDto());
    }
    }