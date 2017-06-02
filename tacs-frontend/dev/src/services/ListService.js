myApp.service('ListService', function ($http, $rootScope) {

    var self = this;

    self.intersectionOf = function (lista1, lista2, sesionActual, callback) {
        return $http.get(settings.apiUrl+'admin/user/' + lista1.id + '/' + lista2.id + '/', {
            headers: {'token': sesionActual.idSesion}
        }).then(callback);
    };

    self.getAct = function (sesionActual, lista, callback) {
        return $http.get(settings.apiUrl+'user/ranking/' + lista, {
            headers: {'token': sesionActual.idSesion}
        }).then(callback);
    };



    self.intersection = function (lista1, lista2, sesionActual, callback) {
        return $http.get(settings.apiUrl+'list/' + lista1.id + '/' + lista2.id, {
            headers: {'token': sesionActual.idSesion}
        }).then(callback);
    };

    self.createList = function (nombre) {
        return $http.post(settings.apiUrl+'list/', nombre, {
            headers: {'token': $rootScope.sesionActual.idSesion}
        })
    };

    self.agregarALista = function (pelicula, lista) {
        return $http.post(settings.apiUrl+'list/' + lista.id + '/', pelicula, {
            headers: {'token': $rootScope.sesionActual.idSesion}
        });
    };

    self.quitarDeLista = function (pelicula, lista) {
        // return $http({
        //     method: 'DELETE',
        //     url: 'http://localhost:8080/list/' + lista.id + '/',
        //     data: {
        //         movie: pelicula
        //     },
        //     headers: {
        //         'token': $rootScope.sesionActual.idSesion
        //     }
        // });
        return $http.delete(settings.apiUrl+'list/' + lista.id + '/'+ pelicula.id,{
            headers: {'token': $rootScope.sesionActual.idSesion}
        });


    };

});
