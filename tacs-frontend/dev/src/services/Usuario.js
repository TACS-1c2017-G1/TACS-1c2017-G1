/**
 * Created by aye on 01/05/17.
 */
'use strict';

myApp.service('Usuario', function ($http, $rootScope) {

    var self = this;

    self.register = function (credentials) {
        return $http.post(settings.apiUrl+'user/', credentials);
    };

    self.getRecMovies = function (sesion,callback) {
        return $http.get(settings.apiUrl+'user/favoriteactor/movies', {
            headers: {'token': sesion.idSesion}
        }).then(callback);
    }

    self.actoresFavoritos = function (credentials) {
        return $http.get(settings.apiUrl+'user/favoriteactor/',
            {
                headers: {
                    'token': $rootScope.sesionActual.idSesion
                }
            }
        );
    }

    self.marcarActorFavorito = function (actor) {
      return $http.put(settings.apiUrl+'user/favoriteactor/', actor,
            {
                headers: {
                    'token': $rootScope.sesionActual.idSesion
                }
            }
        );
    };
  self.desmarcarActorFavorito = function (actor_id) {
    return $http.put(settings.apiUrl+'user/favoriteactor/' + actor_id,null,
      {
        headers: {
          'token': $rootScope.sesionActual.idSesion
        }
      }
    );
  }

    self.getListas = function (credentials) {
        return $http.get(settings.apiUrl+'user/movieLists', {
                headers: {
                    'token': $rootScope.sesionActual.idSesion
                }
            }
        );
    };
    self.getRankingActoresFavoritos = function () {
        return $http.get(settings.apiUrl+'user/favoriteactor/ranking',
            {
                headers: {
                    'token': $rootScope.sesionActual.idSesion
                }
            }
        );
    }



})
;
