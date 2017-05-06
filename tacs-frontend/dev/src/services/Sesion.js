'use strict';

myApp.service('Sesion', function ($http, $rootScope) {

    var self = this;

    self.login = function (credentials) {
        return $http.post('http://localhost:8080/authentication/login', credentials);
    };

    self.logout = function () {
        return $http.put('http://localhost:8080/authentication/logout',undefined,{headers: {"token": $rootScope.sesionActual.idSesion}})
    };

});