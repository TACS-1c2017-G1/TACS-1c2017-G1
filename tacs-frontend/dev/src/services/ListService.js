myApp.service('ListService', function ($http, $rootScope) {

    var self = this;

    self.intersectionOf = function (lista1, lista2, sesionActual, callback) {
        return $http.get('http://localhost:8080/admin/user/' + lista1.id + '/' + lista2.id + '/', {
            headers: {'token': sesionActual.idSesion}
        }).then(callback);
    };

    self.intersection = function (lista1, lista2, sesionActual, callback) {
        return $http.get('http://localhost:8080/list/' + lista1.id + '/' + lista2.id, {
            headers: {'token': sesionActual.idSesion}
        }).then(callback);
    };

    self.createList = function (nombre) {
        return $http.post('http://localhost:8080/list/', nombre, {
            headers: {'token': $rootScope.sesionActual.idSesion}
        })
    };

});