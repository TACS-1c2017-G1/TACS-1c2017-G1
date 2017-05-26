/**
 * Created by Rodrigo on 01/05/2017.
 */
myApp.service('BusquedasService', function ($http, $rootScope) {

    var self = this;

    self.buscar = function (url, textoDeBusqueda, numeroDePagina) {
        return $http.get('http://localhost:8080/search/' + url + textoDeBusqueda.split(' ').join('-') + '?page=' + numeroDePagina, {
            headers: {
                "Token": $rootScope.sesionActual.idSesion
            }
        });
    };

});
