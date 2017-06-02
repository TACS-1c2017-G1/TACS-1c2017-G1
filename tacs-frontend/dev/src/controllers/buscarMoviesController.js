myApp.controller('fichaController', function($scope, $http, $stateParams) {

  $scope.traerFicha = function(tipo) {
    $http.get(settings.apiUrl + tipo + '/' + $stateParams.fichaId, {
      headers: {
        "Token": '12345'
      }
    }).then(function(response) {
      $scope.item = response.data;
    })
  }
});
