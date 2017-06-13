'use strict';

myApp.service('Sesion', function ($http, $rootScope) {

    var self = this;

    self.login = function (credentials) {
        return $http.post(settings.apiUrl+'authentication/login', credentials);
    };

    self.logout = function () {
        return $http.put(settings.apiUrl+'authentication/logout',undefined,{headers: {"token": $rootScope.sesionActual.idSesion}})
    };

});
