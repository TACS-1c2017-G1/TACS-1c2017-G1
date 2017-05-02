/**
 * Created by Rodrigo on 01/05/2017.
 */
myApp.controller('HomeController', function ($scope, BusquedasService) {

    $scope.buscar = function (textoABuscar) {
        if (!textoABuscar)
            return;

        BusquedasService.buscarPelicula(textoABuscar)
            .then(function (response) {
                if (response.data.results <= 0) {
                    alert("Lo sentimos, no se encontraron resultados para \"" + textoABuscar + "\"");
                    $scope.resultados = [];
                }
                else
                    $scope.resultados = response.data.results;
            })
    }

});