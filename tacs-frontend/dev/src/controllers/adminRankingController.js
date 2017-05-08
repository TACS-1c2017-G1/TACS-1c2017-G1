/**
 * Created by Rodrigo on 08/05/2017.
 */
myApp.controller('adminRankingController', function ($rootScope, $scope, Usuario) {

    function getRanking() {
        Usuario.getRankingActoresFavoritos()
            .then(function (response) {
                $scope.ranking = response.data
            });
    }

    getRanking();

});