myApp.service('ListService', function ($http) {

    var self = this;

    self.intersectionOf= function (lista1, lista2,sesionActual,callback) {
        return $http.get('http://localhost:8080/admin/user/' + lista1.id + '/' + lista2.id+'/', {
            headers: {'token': sesionActual.idSesion}
        }).then(callback);
    }

});