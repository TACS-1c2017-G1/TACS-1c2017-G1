myApp.controller('favoritosController', function ($rootScope, $scope, Usuario) {

    $scope.actoresFavoritos = [];

    this.actoresFavoritos = function () {
        Usuario.actoresFavoritos().then(function (actores) {
            $scope.actoresFavoritos = actores.data;
        });
    };

    $scope.sacarDeFavorito = function (actor) {
        $scope.actoresFavoritos.splice($scope.actoresFavoritos.indexOf(actor),1)
        Usuario.marcarActorFavorito(actor.id)
    }

    this.actoresFavoritos();

});

