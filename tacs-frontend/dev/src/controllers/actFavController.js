myApp.controller('actFavController', function ($rootScope, $scope, $state, Usuario) {
    var self = this;
    self.recMovies = null;

    self.searchRecMovies = function () {
        Usuario.getRecMovies($rootScope.sesionActual,
            function (response) {
                self.recMovies = response.data;
        })
    }


})
