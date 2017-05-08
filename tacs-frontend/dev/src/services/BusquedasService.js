/**
 * Created by Rodrigo on 01/05/2017.
 */
myApp.service('BusquedasService', function($http) {

  var self = this;

  self.buscar = function(url, textoDeBusqueda) {
    return $http.get('http://localhost:8080/search/' + url + textoDeBusqueda.split(' ').join('-'), {
      headers: {
        "Token": '12345'
      }
    });
  };

});
