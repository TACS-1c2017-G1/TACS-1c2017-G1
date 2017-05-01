'use strict';

myApp.service('Sesion', function ($http) {

  var self = this;
  var sesionActual = undefined;

  self.login = function (credentials) {
    return $http.post('http://localhost:8080/authentication/login',credentials)
      .success(function (sesion) {
        sesionActual = sesion;
        alert("Bienvenido");
      })
      .fail(function (exception) {
        alert(exception);
      })
  };

});