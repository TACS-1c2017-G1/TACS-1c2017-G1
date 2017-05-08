myApp.controller('favoritosController', function ($rootScope, $scope, Usuario) {

    $scope.actoresFavoritos = [];
    self.recMovies = undefined;

    this.actoresFavoritos = function () {
        Usuario.actoresFavoritos()
            .then(function (actores) {
                $scope.actoresFavoritos = actores.data;
            });
    };

    $scope.sacarDeFavorito = function (actor) {
        $scope.actoresFavoritos.splice($scope.actoresFavoritos.indexOf(actor), 1)
        Usuario.marcarActorFavorito(actor.id)
    }

    $scope.searchRecMovies = function () {
        Usuario.getRecMovies($rootScope.sesionActual)
            .then(function (response) {
                self.recMovies = response.data;
            })
    }


    this.actoresFavoritos();

});

