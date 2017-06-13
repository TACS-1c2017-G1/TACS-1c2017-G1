/**
 * Created by Rodrigo on 01/05/2017.
 */
myApp.service('BusquedasService', function ($http, $rootScope) {

    var self = this;

    self.buscar = function (url, textoDeBusqueda, numeroDePagina) {
        // return $http.get(settings.apiUrl+'search/' + url + textoDeBusqueda.split(' ').join('-') + '?page=' + numeroDePagina, {
          return $http.get(settings.apiUrl+'search/' + url + textoDeBusqueda.split(' ').join('-'),{
            headers: {
                "Token": $rootScope.sesionActual.idSesion
            }
        });
    };

});
