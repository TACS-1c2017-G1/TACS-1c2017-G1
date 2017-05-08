/**
 * Created by aye on 01/05/17.
 */
'use strict';

myApp.service('Usuario', function ($http, $rootScope) {

    var self = this;

    self.register = function (credentials) {
        return $http.post('http://localhost:8080/user/', credentials);
    };

    self.getRecMovies = function (sesion) {
        return $http.get('http://localhost:8080/user/favoriteactor/movies', {
            headers: {'token': sesion.idSesion}
        });
    }

    self.actoresFavoritos = function (credentials) {
        return $http.get('http://localhost:8080/user/favoriteactor/',
            {
                headers: {
                    'token': $rootScope.sesionActual.idSesion
                }
            }
        );
    }

    self.marcarActorFavorito = function (idActor) {
        return $http.put('http://localhost:8080/user/favoriteactor/' + idActor + '/', undefined,
            {
                headers: {
                    'token': $rootScope.sesionActual.idSesion
                }
            }
        );
    }


})
;