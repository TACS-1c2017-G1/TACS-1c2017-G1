/**
 * Created by Rodrigo on 01/05/2017.
 */
myApp.controller('HomeController', function ($scope, BusquedasService, Usuario) {

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

    $scope.agregarComoFavorito = function (actor) {

        if (actor.media_type !== 'person') {
            alert('Lo que selecciono no es un actor');
            return;
        }

        Usuario.marcarActorFavorito(actor.id)
            .then(function() {
                alert('Actor agregado.')
            });

    }

});