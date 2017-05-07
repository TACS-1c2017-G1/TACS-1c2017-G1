/**
 * Created by aye on 01/05/17.
 */
'use strict';

myApp.service('Usuario', function ($http, $rootScope) {

  var self = this;

  self.register = function (credentials) {
    return $http.post('http://localhost:8080/user/', credentials);
  };

  self.actoresFavoritos = function (credentials, callback) {
            return $http.get('http://localhost:8080/user/favoriteactor/',
    {
      headers: {
        'token'
      :
        $rootScope.sesionActual.idSesion
      }
    }
    );
}


})
;