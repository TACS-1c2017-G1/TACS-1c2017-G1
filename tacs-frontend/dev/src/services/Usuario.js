/**
 * Created by aye on 01/05/17.
 */
'use strict';

myApp.service('Usuario', function ($http, $rootScope) {

    var self = this;

    self.register = function (credentials) {
        return $http.post('http://localhost:8080/user/', credentials);
    };

    self.getRecMovies = function (sesion,callback) {
        return $http.get('http://localhost:8080/user/favoriteactor/movies', {
            headers: {'token': sesion.idSesion}
        }).then(callback);
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

    self.marcarActorFavorito = function (actor) {
        return $http.put('http://localhost:8080/user/favoriteactor/', actor,
            {
                headers: {
                    'token': $rootScope.sesionActual.idSesion
                }
            }
        );
    }

    self.getListas = function (credentials) {
        return $http.get('http://localhost:8080/user/movieLists', {
                headers: {
                    'token': $rootScope.sesionActual.idSesion
                }
            }
        );
    };
    self.getRankingActoresFavoritos = function () {
        return $http.get('http://localhost:8080/user/favoriteactor/ranking',
            {
                headers: {
                    'token': $rootScope.sesionActual.idSesion
                }
            }
        );
    }



})
;