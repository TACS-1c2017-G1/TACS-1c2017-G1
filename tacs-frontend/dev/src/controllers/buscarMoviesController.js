myApp.controller('fichaController', function($scope, $http, $stateParams) {

  $http.get('http://localhost:8080/movie/' + $stateParams.id, {
    headers: {
      "Token": '12345'
    }
  }).then(function(response) {
    $scope.item = response.data;
  })
});
